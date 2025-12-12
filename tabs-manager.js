// Управление вкладками и рендеринг карточек
(function() {
    'use strict';

    // Функция рендеринга карточки казино
    function renderCasinoCard(casino) {
        const badgeClassMap = {
            'Royal Partners': 'badge-royal',
            '+50 FS по LUDKA': 'badge-freespins',
            'Краш-игры': 'badge-crash',
            'Крипто': 'badge-crypto',
            'Повышенный RTP': 'badge-rtp'
        };

        const badgesHtml = casino.badges.map(badge => {
            const badgeClass = badgeClassMap[badge] || '';
            return `<span class="badge ${badgeClass}">${badge}</span>`;
        }).join('');

        const initials = casino.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

        return `
            <a href="${casino.href}" class="casino-card" data-casino-id="${casino.id}" data-name="${casino.name.toLowerCase()}" target="_blank" rel="noopener noreferrer">
                <div class="casino-logo">
                    <img src="${casino.logo}" alt="${casino.name}" loading="lazy" 
                         onerror="this.style.display='none'; this.parentElement.innerHTML='${initials}';" 
                         onload="this.classList.add('loaded')">
                </div>
                <div class="casino-info">
                    <div class="casino-badges">
                        ${badgesHtml}
                    </div>
                    <div class="casino-card-name">
                        <span>${casino.name}</span>
                        <span class="casino-arrow">→</span>
                    </div>
                    <p class="casino-card-desc">
                        ${casino.desc}
                    </p>
                </div>
            </a>
        `;
    }

    // Рендеринг вкладки
    function renderTab(categoryId, casinos) {
        const category = categoriesConfig[categoryId];
        if (!category) return '';

        const cardsHtml = casinos.map(renderCasinoCard).join('');

        return `
            <div class="tab-content" data-tab="${categoryId}" style="display: none;">
                <div class="section-header">
                    <h2 class="section-title">
                        <span class="section-icon">${category.icon}</span>${category.title}
                    </h2>
                    <p class="section-desc">${category.desc}</p>
                </div>
                <div class="casino-cards">
                    ${cardsHtml}
                </div>
            </div>
        `;
    }

    // Инициализация вкладок
    function initTabs() {
        const tabsContainer = document.getElementById('casino-tabs-container');
        if (!tabsContainer) return;

        // Создание кнопок вкладок
        const tabsButtons = document.createElement('div');
        tabsButtons.className = 'tabs-buttons';
        
        const tabsContent = document.createElement('div');
        tabsContent.className = 'tabs-content';

        // Определение активной вкладки по умолчанию
        const defaultTab = Object.values(categoriesConfig).find(cat => cat.default)?.id || 'top';

        Object.values(categoriesConfig).forEach(category => {
            // Кнопка вкладки
            const tabButton = document.createElement('button');
            tabButton.className = `tab-button ${category.id === defaultTab ? 'active' : ''}`;
            tabButton.setAttribute('data-tab', category.id);
            tabButton.innerHTML = `<span class="tab-icon">${category.icon}</span> ${category.title}`;
            tabsButtons.appendChild(tabButton);

            // Контент вкладки
            let casinosInCategory;
            if (category.id === 'top') {
                // Для ТОП казино - показываем только казино с категорией 'top'
                casinosInCategory = casinosData.filter(casino => 
                    casino.categories.includes('top')
                );
            } else {
                // Для остальных категорий - стандартная фильтрация
                casinosInCategory = casinosData.filter(casino => 
                    casino.categories.includes(category.id)
                );
            }
            
            if (casinosInCategory.length > 0) {
                tabsContent.innerHTML += renderTab(category.id, casinosInCategory);
            }
        });

        // Показываем активную вкладку
        const activeTabContent = tabsContent.querySelector(`[data-tab="${defaultTab}"]`);
        if (activeTabContent) {
            activeTabContent.style.display = 'block';
        }

        tabsContainer.appendChild(tabsButtons);
        tabsContainer.appendChild(tabsContent);

        // Обработчики кликов на вкладки
        tabsButtons.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Убираем активность со всех кнопок
                tabsButtons.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Скрываем все контенты
                tabsContent.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = 'none';
                });

                // Показываем выбранный контент
                const selectedContent = tabsContent.querySelector(`[data-tab="${tabId}"]`);
                if (selectedContent) {
                    selectedContent.style.display = 'block';
                }
            });
        });
    }

    // Инициализация при загрузке DOM
    // Ждём загрузки данных казино
    function waitForData() {
        if (typeof casinosData !== 'undefined' && typeof categoriesConfig !== 'undefined') {
            initTabs();
        } else {
            setTimeout(waitForData, 100);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForData);
    } else {
        waitForData();
    }
})();

