// Система трекинга событий
(function() {
    'use strict';

    const API_URL = '/api/events';

    // Определение типа устройства
    function getDeviceType() {
        return window.innerWidth < 768 ? 'mobile' : 'desktop';
    }

    // Отправка события
    function trackEvent(type, data = {}) {
        const eventData = {
            type,
            ...data,
            userAgent: navigator.userAgent,
            referrer: document.referrer || '',
            lang: navigator.language || navigator.userLanguage || '',
            deviceType: getDeviceType(),
            ts: new Date().toISOString()
        };

        // Используем sendBeacon для надежной отправки перед переходом
        if (navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(eventData)], { type: 'application/json' });
            navigator.sendBeacon(API_URL, blob);
        } else {
            // Fallback на fetch с keepalive
            fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData),
                keepalive: true
            }).catch(err => console.error('Tracking error:', err));
        }
    }

    // Трекинг просмотра страницы
    function trackPageView() {
        trackEvent('page_view');
    }

    // Трекинг клика по казино
    function trackCasinoClick(casinoId, casinoName, href) {
        trackEvent('casino_click', {
            casinoId,
            label: casinoName,
            href
        });
    }

    // Трекинг клика по промо-элементам
    function trackPromoClick(label, href = '') {
        trackEvent('action_click', {
            label,
            href
        });
    }

    // Инициализация трекинга
    function initTracking() {
        // Трекинг просмотра страницы
        trackPageView();

        // Трекинг кликов по карточкам казино
        document.addEventListener('click', (e) => {
            const casinoCard = e.target.closest('.casino-card');
            if (casinoCard) {
                const casinoId = casinoCard.getAttribute('data-casino-id');
                const casinoName = casinoCard.querySelector('.casino-card-name span')?.textContent || '';
                const href = casinoCard.getAttribute('href') || '';
                
                if (casinoId) {
                    trackCasinoClick(casinoId, casinoName, href);
                }
            }

            // Трекинг кнопки копирования промокода
            if (e.target.id === 'copyPromoBtn' || e.target.closest('#copyPromoBtn')) {
                trackPromoClick('copy_promo_ludka');
            }

            // Трекинг кнопок поддержки
            if (e.target.closest('.support-button') || e.target.closest('.support-popup a')) {
                const href = e.target.closest('a')?.getAttribute('href') || '';
                trackPromoClick('support_click', href);
            }

            // Трекинг других промо-элементов
            if (e.target.closest('.speech-btn')) {
                const text = e.target.textContent.trim();
                trackPromoClick(`speech_btn_${text.toLowerCase().replace(/\s+/g, '_')}`);
            }
        }, true); // Используем capture для перехвата до перехода
    }

    // Инициализация при загрузке
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTracking);
    } else {
        initTracking();
    }

    // Экспорт для использования в других скриптах
    window.tracking = {
        trackEvent,
        trackCasinoClick,
        trackPromoClick
    };
})();





