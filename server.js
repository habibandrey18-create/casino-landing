const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Server configuration (production mode - minimal logging)
if (process.env.NODE_ENV !== 'production') {
    console.log('Server starting on port:', PORT);
}

// Trust proxy (для работы за прокси Render)
app.set('trust proxy', true);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname)));

// Rate limiting для API
const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// Инициализация БД
const db = new sqlite3.Database('./analytics.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        // Создание таблицы events
        db.run(`CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            label TEXT,
            casino_id TEXT,
            href TEXT,
            user_agent TEXT,
            referrer TEXT,
            lang TEXT,
            device_type TEXT,
            ip_address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err);
            } else {
                console.log('Events table ready');
            }
        });

        // Создание таблицы для снимков статистики
        db.run(`CREATE TABLE IF NOT EXISTS stats_snapshots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            snapshot_date DATE NOT NULL,
            total_pageviews INTEGER DEFAULT 0,
            total_clicks INTEGER DEFAULT 0,
            conversion_rate REAL DEFAULT 0,
            top_casino_id TEXT,
            top_casino_label TEXT,
            top_casino_clicks INTEGER DEFAULT 0,
            device_mobile INTEGER DEFAULT 0,
            device_desktop INTEGER DEFAULT 0,
            device_unknown INTEGER DEFAULT 0,
            snapshot_data TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(snapshot_date)
        )`, (err) => {
            if (err) {
                console.error('Error creating stats_snapshots table:', err);
            } else {
                console.log('Stats snapshots table ready');
            }
        });
    }
});

// Middleware для проверки JWT
const authenticateAdmin = (req, res, next) => {
    const token = req.cookies.admin_token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// API: Отправка событий
app.post('/api/events', apiLimiter, async (req, res) => {
    try {
        const { type, casinoId, label, href, userAgent, referrer, lang, deviceType } = req.body;
        const ip = req.ip || req.connection.remoteAddress;
        
        if (!type) {
            return res.status(400).json({ error: 'Type is required' });
        }

        db.run(
            `INSERT INTO events (type, label, casino_id, href, user_agent, referrer, lang, device_type, ip_address)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [type, label || null, casinoId || null, href || null, userAgent || null, referrer || null, lang || null, deviceType || null, ip],
            function(err) {
                if (err) {
                    console.error('Error inserting event:', err);
                    return res.status(500).json({ error: 'Failed to save event' });
                }
                res.json({ success: true, id: this.lastID });
            }
        );
    } catch (error) {
        console.error('Error in /api/events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API: Авторизация админа
app.post('/api/admin/login', apiLimiter, (req, res) => {
    const { password } = req.body;
    
    // Login attempt (logging only in development)
    
    // Убираем пробелы и сравниваем
    const cleanPassword = password ? password.trim() : '';
    const cleanAdminPassword = ADMIN_PASSWORD ? ADMIN_PASSWORD.trim() : '';
    
    if (cleanPassword === cleanAdminPassword) {
        const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '24h' });
        res.cookie('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        res.json({ success: true, token });
    } else {
        res.status(401).json({ error: 'Invalid password' });
    }
});

// API: Выход
app.post('/api/admin/logout', (req, res) => {
    res.clearCookie('admin_token');
    res.json({ success: true });
});

// API: Статистика (только для админа)
app.get('/api/stats', authenticateAdmin, (req, res) => {
    const { from, to } = req.query;
    
    let dateFilter = '';
    if (from && to) {
        dateFilter = `WHERE created_at >= '${from}' AND created_at <= '${to} 23:59:59'`;
    } else if (from) {
        dateFilter = `WHERE created_at >= '${from}'`;
    } else if (to) {
        dateFilter = `WHERE created_at <= '${to} 23:59:59'`;
    }

    // Общая статистика
    db.all(`SELECT 
        COUNT(CASE WHEN type = 'page_view' THEN 1 END) as total_pageviews,
        COUNT(CASE WHEN type = 'casino_click' THEN 1 END) as total_clicks
        FROM events ${dateFilter}`, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        const stats = rows[0] || { total_pageviews: 0, total_clicks: 0 };

        // Статистика по казино
        db.all(`SELECT 
            casino_id,
            label,
            COUNT(*) as clicks
            FROM events
            WHERE type = 'casino_click' ${dateFilter ? 'AND ' + dateFilter.replace('WHERE ', '') : ''}
            GROUP BY casino_id, label
            ORDER BY clicks DESC`, (err, casinoStats) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            // Расчет конверсии
            const pageviews = parseInt(stats.total_pageviews) || 1;
            const breakdown = casinoStats.map(casino => ({
                casinoId: casino.casino_id,
                label: casino.label,
                clicks: casino.clicks,
                conversion: ((casino.clicks / pageviews) * 100).toFixed(2)
            }));

            res.json({
                total_pageviews: parseInt(stats.total_pageviews) || 0,
                total_clicks: parseInt(stats.total_clicks) || 0,
                breakdown
            });
        });
    });
});

// API: Детальная статистика по дням
app.get('/api/stats/daily', authenticateAdmin, (req, res) => {
    const { from, to } = req.query;
    
    let dateFilter = '';
    if (from && to) {
        dateFilter = `WHERE DATE(created_at) >= '${from}' AND DATE(created_at) <= '${to}'`;
    }

    db.all(`SELECT 
        DATE(created_at) as date,
        COUNT(CASE WHEN type = 'page_view' THEN 1 END) as pageviews,
        COUNT(CASE WHEN type = 'casino_click' THEN 1 END) as clicks
        FROM events
        ${dateFilter}
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30`, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

// API: Статистика по устройствам
app.get('/api/stats/devices', authenticateAdmin, (req, res) => {
    const { from, to } = req.query;
    
    let dateFilter = '';
    if (from && to) {
        dateFilter = `WHERE created_at >= '${from}' AND created_at <= '${to} 23:59:59'`;
    } else if (from) {
        dateFilter = `WHERE created_at >= '${from}'`;
    } else if (to) {
        dateFilter = `WHERE created_at <= '${to} 23:59:59'`;
    }

    db.all(`SELECT 
        COALESCE(device_type, 'Unknown') as device,
        COUNT(*) as count
        FROM events
        ${dateFilter}
        GROUP BY device_type
        ORDER BY count DESC`, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

// API: Статистика по типам событий
app.get('/api/stats/events', authenticateAdmin, (req, res) => {
    const { from, to } = req.query;
    
    let dateFilter = '';
    if (from && to) {
        dateFilter = `WHERE created_at >= '${from}' AND created_at <= '${to} 23:59:59'`;
    } else if (from) {
        dateFilter = `WHERE created_at >= '${from}'`;
    } else if (to) {
        dateFilter = `WHERE created_at <= '${to} 23:59:59'`;
    }

    db.all(`SELECT 
        type,
        COUNT(*) as count
        FROM events
        ${dateFilter}
        GROUP BY type
        ORDER BY count DESC`, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

// API: Сохранение снимка статистики
app.post('/api/stats/snapshot', authenticateAdmin, (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Получаем статистику за сегодня
    db.all(`SELECT 
        COUNT(CASE WHEN type = 'page_view' THEN 1 END) as total_pageviews,
        COUNT(CASE WHEN type = 'casino_click' THEN 1 END) as total_clicks
        FROM events 
        WHERE DATE(created_at) = '${today}'`, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        const stats = rows[0] || { total_pageviews: 0, total_clicks: 0 };
        const pageviews = parseInt(stats.total_pageviews) || 0;
        const clicks = parseInt(stats.total_clicks) || 0;
        const conversion = pageviews > 0 ? ((clicks / pageviews) * 100).toFixed(2) : 0;

        // Получаем топ казино за сегодня
        db.all(`SELECT 
            casino_id,
            label,
            COUNT(*) as clicks
            FROM events
            WHERE type = 'casino_click' AND DATE(created_at) = '${today}'
            GROUP BY casino_id, label
            ORDER BY clicks DESC
            LIMIT 1`, (err, topCasino) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            // Статистика по устройствам
            db.all(`SELECT 
                COALESCE(device_type, 'Unknown') as device,
                COUNT(*) as count
                FROM events
                WHERE DATE(created_at) = '${today}'
                GROUP BY device_type`, (err, devices) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }

                const deviceStats = {
                    mobile: 0,
                    desktop: 0,
                    unknown: 0
                };

                devices.forEach(d => {
                    const device = (d.device || '').toLowerCase();
                    if (device.includes('mobile') || device.includes('android') || device.includes('iphone')) {
                        deviceStats.mobile += d.count;
                    } else if (device.includes('desktop') || device.includes('windows') || device.includes('mac') || device.includes('linux')) {
                        deviceStats.desktop += d.count;
                    } else {
                        deviceStats.unknown += d.count;
                    }
                });

                const snapshotData = JSON.stringify({
                    breakdown: [],
                    devices: devices
                });

                // Сохраняем или обновляем снимок
                db.run(`INSERT OR REPLACE INTO stats_snapshots 
                    (snapshot_date, total_pageviews, total_clicks, conversion_rate, 
                     top_casino_id, top_casino_label, top_casino_clicks,
                     device_mobile, device_desktop, device_unknown, snapshot_data)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [today, pageviews, clicks, conversion,
                     topCasino[0]?.casino_id || null,
                     topCasino[0]?.label || null,
                     topCasino[0]?.clicks || 0,
                     deviceStats.mobile,
                     deviceStats.desktop,
                     deviceStats.unknown,
                     snapshotData],
                    function(err) {
                        if (err) {
                            console.error('Error saving snapshot:', err);
                            return res.status(500).json({ error: 'Failed to save snapshot' });
                        }
                        res.json({ success: true, id: this.lastID });
                    }
                );
            });
        });
    });
});

// API: Получение истории снимков
app.get('/api/stats/snapshots', authenticateAdmin, (req, res) => {
    const { limit = 30 } = req.query;
    
    db.all(`SELECT * FROM stats_snapshots 
        ORDER BY snapshot_date DESC 
        LIMIT ?`, [limit], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});

// API: Получение сравнения статистики (сегодня vs вчера)
app.get('/api/stats/compare', authenticateAdmin, (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    db.all(`SELECT * FROM stats_snapshots 
        WHERE snapshot_date IN (?, ?)
        ORDER BY snapshot_date DESC`, [today, yesterdayStr], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        const todaySnapshot = rows.find(r => r.snapshot_date === today);
        const yesterdaySnapshot = rows.find(r => r.snapshot_date === yesterdayStr);

        res.json({
            today: todaySnapshot || null,
            yesterday: yesterdaySnapshot || null,
            changes: {
                pageviews: todaySnapshot && yesterdaySnapshot 
                    ? todaySnapshot.total_pageviews - yesterdaySnapshot.total_pageviews 
                    : null,
                clicks: todaySnapshot && yesterdaySnapshot 
                    ? todaySnapshot.total_clicks - yesterdaySnapshot.total_clicks 
                    : null,
                conversion: todaySnapshot && yesterdaySnapshot 
                    ? (parseFloat(todaySnapshot.conversion_rate) - parseFloat(yesterdaySnapshot.conversion_rate)).toFixed(2)
                    : null
            }
        });
    });
});

// Проверка авторизации для админки
app.get('/api/admin/check', authenticateAdmin, (req, res) => {
    res.json({ authenticated: true });
});

// Статичные файлы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});

