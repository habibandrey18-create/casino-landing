// Структура данных казино
const casinosData = [
    // Royal Partners
    { id: 'beef', name: 'Beef Casino', href: 'https://beef-way-one.com/c3a1809ba', categories: ['royal', 'top'], logo: 'https://logo.clearbit.com/beef-way-one.com', badges: ['Royal Partners', '+50 FS по LUDKA', 'Повышенный RTP'], desc: 'Мощный старт для любителей слотов: до крупного welcome-пакета и фриспины по промокоду LUDKA, плюс быстрые выплаты без лишней бюрократии.' },
    { id: 'martin', name: 'Martin Casino', href: 'https://martin-way-five.com/cb55341ca', categories: ['royal', 'top'], logo: 'https://logo.clearbit.com/martin-way-five.com', badges: ['Royal Partners', '+50 FS по LUDKA', 'Повышенный RTP'], desc: 'Много турниров и движухи, для тех, кому важен соревновательный азарт: большое приветствие, кэшбэк и постоянные акции для активных игроков.' },
    { id: 'flagman', name: 'Flagman Casino', href: 'https://flagman-way-five.com/cc889ac09', categories: ['royal'], logo: 'https://logo.clearbit.com/flagman-way-five.com', badges: ['Royal Partners', '+50 FS по LUDKA'], desc: 'Вариант "для основного банка": высокая линейка бонусов, расширенные лимиты на вывод и регулярный кэшбэк для тех, кто крутит часто.' },
    { id: 'irwin', name: 'IRWIN Casino', href: 'https://rwn-irrs.com/ccc765ec2', categories: ['royal', 'top'], logo: 'https://logo.clearbit.com/rwn-irrs.com', badges: ['Royal Partners', '+50 FS по LUDKA', 'Повышенный RTP'], desc: 'Больше про стабильность: бренд давно на рынке, упор на надежность выплат и понятные условия бонусов + фриспины по LUDKA.' },
    { id: 'gizbo', name: 'GIZBO Casino', href: 'https://gizbo-way-five.com/cdc450203', categories: ['royal'], logo: 'https://logo.clearbit.com/gizbo-way-five.com', badges: ['Royal Partners', '+50 FS по LUDKA'], desc: 'Современная платформа с широким выбором слотов и лайв-столов, щедрые бонусы и быстрые выплаты для активных игроков.' },
    { id: 'lex', name: 'LEX Casino', href: 'https://lex-blrs.com/cbd7b10ef', categories: ['royal'], logo: 'https://logo.clearbit.com/lex-blrs.com', badges: ['Royal Partners', '+50 FS по LUDKA'], desc: 'Частые турниры и квесты, повышенный кешбэк и VIP-статусы для тех, кто играет объемом, плюс фриспины по LUDKA.' },
    { id: '1go', name: '1GO Casino', href: 'https://1go-blrs.com/cf63c458f', categories: ['royal'], logo: 'https://logo.clearbit.com/1go-blrs.com', badges: ['Royal Partners', '+50 FS по LUDKA'], desc: 'Много слотов и лайв-столов, частые турниры и квесты, повышенный кешбэк для активных игроков.' },
    { id: 'legzo', name: 'LEGZO Casino', href: 'https://gzo-blrs01.com/c97d2b11c', categories: ['royal'], logo: 'https://logo.clearbit.com/gzo-blrs01.com', badges: ['Royal Partners', '+50 FS по LUDKA'], desc: 'Современный интерфейс, быстрые выплаты, щедрый welcome и удобно с телефона, плюс фриспины по LUDKA.' },
    { id: 'volna', name: 'VOLNA Casino', href: 'https://vln-blrs.com/ca7fb15d4', categories: ['royal'], logo: 'https://logo.clearbit.com/vln-blrs.com', badges: ['Royal Partners', '+50 FS по LUDKA'], desc: 'Повышенный кешбэк и VIP-статусы для тех, кто играет объемом, регулярные акции и турниры.' },
    { id: 'drip', name: 'DRIP Casino', href: 'https://drp-blrs21.com/c68ad6936', categories: ['royal'], logo: 'https://logo.clearbit.com/drp-blrs21.com', badges: ['Royal Partners', '+50 FS по LUDKA'], desc: 'Широкий выбор развлечений и специальные предложения для новых игроков с увеличенным бонусом.' },
    { id: 'monro', name: 'MONRO Casino', href: 'https://mnr-blrs.com/cb94e728a', categories: ['royal'], logo: 'https://logo.clearbit.com/mnr-blrs.com', badges: ['Royal Partners', '+50 FS по LUDKA'], desc: 'Надежная игровая площадка с лицензией и выгодными условиями для новых и постоянных игроков.' },
    { id: 'rox', name: 'ROX Casino', href: 'https://rx-fiiffronu.com/cc31f40a9', categories: ['royal'], logo: 'https://logo.clearbit.com/rx-fiiffronu.com', badges: ['Royal Partners', '+50 FS по LUDKA'], desc: 'Современное казино с быстрыми выплатами и обширной коллекцией игр от ведущих провайдеров.' },
    { id: 'jet', name: 'JET Casino', href: 'https://jtfr-mutlukir.com/cda393f48', categories: ['royal'], logo: 'https://logo.clearbit.com/jtfr-mutlukir.com', badges: ['Royal Partners', '+50 FS по LUDKA'], desc: 'Игровой портал с широким выбором развлечений и специальными предложениями для новых игроков.' },
    { id: 'fresh', name: 'FRESH Casino', href: 'https://fresh-blrs10.com/c64308122', categories: ['royal'], logo: 'https://logo.clearbit.com/fresh-blrs10.com', badges: ['Royal Partners', '+50 FS по LUDKA'], desc: 'Свежий подход к онлайн-гемблингу с современным интерфейсом и щедрыми бонусами.' },
    { id: 'sol', name: 'SOL Casino', href: 'https://sol-irrs01.com/c8112727', categories: ['royal'], logo: 'https://logo.clearbit.com/sol-irrs01.com', badges: ['Royal Partners', '+50 FS по LUDKA'], desc: 'Солнечное настроение и яркие выигрыши, щедрые бонусы и постоянные акции для игроков.' },
    { id: 'izzi', name: 'IZZI Casino', href: 'https://izz-bls32.com/c2da29971', categories: ['royal'], logo: 'https://logo.clearbit.com/izz-bls32.com', badges: ['Royal Partners', '+50 FS по LUDKA'], desc: 'Удобный интерфейс, быстрые выплаты и щедрый приветственный пакет для новых игроков.' },
    { id: 'starda', name: 'STARDA Casino', href: 'https://strd-irrs10.com/c7a4ce467', categories: ['royal'], logo: 'https://logo.clearbit.com/strd-irrs10.com', badges: ['Royal Partners', '+50 FS по LUDKA'], desc: 'Звездные выигрыши и VIP-программы для постоянных игроков, регулярные турниры и акции.' },

    // VAVADA (только RTP)
    { id: 'vavada', name: 'VAVADA', href: 'https://gate707.com/?promo=19f05fd1-aa88-40af-bf4a-a07524b337ca&target=register', categories: ['rtp', 'top'], logo: 'https://logo.clearbit.com/gate707.com', badges: ['Повышенный RTP'], desc: 'Популярная платформа с лицензией и щедрыми бонусными программами для новых и постоянных клиентов, колесо фортуны.' },
    // Sykaaa (перемещено в другие)
    { id: 'sykaaa', name: 'Sykaaa Casino', href: 'https://s-way-q.com/?source=hsjxj&pid=90790', categories: ['other', 'top'], logo: 'https://logo.clearbit.com/s-way-q.com', badges: ['Быстрые выплаты', 'Повышенный RTP'], desc: 'Быстрые выплаты без задержек, щедрый приветственный бонус и удобный мобильный интерфейс.' },
    // Dragonmoney (только краш-игры)
    { id: 'dragonmoney', name: 'Dragonmoney', href: 'https://dr0.to/ifHOq', categories: ['crash', 'top'], logo: 'https://logo.clearbit.com/dr0.to', badges: ['Краш-игры', 'Промокод: BUPCF', 'Повышенный RTP'], desc: 'Формат краш и кейсы, быстрый движ и возможность "залететь с промика BUPCF на мини-депозите".' },

    // Казино от котов
    { id: 'gama', name: 'Gama Casino', href: 'https://preesiader.com/sllpxj6el', categories: ['cats', 'top'], logo: 'https://logo.clearbit.com/preesiader.com', badges: ['Надежность', 'Повышенный RTP'], desc: 'Надежная игровая площадка с лицензией и широким ассортиментом слотов от известных разработчиков, плюс быстрые выводы.' },
    { id: 'daddy', name: 'Daddy Casino', href: 'https://aeruborony.com/sqzgsa9wg', categories: ['cats'], logo: 'https://logo.clearbit.com/aeruborony.com', badges: ['Приветственный бонус'], desc: 'Популярное казино с современным интерфейсом и привлекательными бонусными программами для новых и постоянных игроков.' },
    { id: 'cat', name: 'Cat Casino', href: 'https://catchthecatkz.com/s1d080de5', categories: ['cats', 'top'], logo: 'https://logo.clearbit.com/catchthecatkz.com', badges: ['Уникальный стиль', 'Повышенный RTP'], desc: 'Милый стиль, но серьёзные призы: уникальные предложения и регулярные акции, включая турниры с крупными джекпотами.' },
    { id: 'kometa', name: 'Kometa Casino', href: 'https://searing-path.com/syguvd7e1', categories: ['cats'], logo: 'https://logo.clearbit.com/searing-path.com', badges: ['Быстрые выплаты'], desc: 'Современное казино с быстрыми выплатами и обширной коллекцией игр от ведущих провайдеров, удобный мобильный клиент.' },
    { id: 'kent', name: 'Kent Casino', href: 'https://mealmenalc.com/swyyntwpu', categories: ['cats'], logo: 'https://logo.clearbit.com/mealmenalc.com', badges: ['Надежность'], desc: 'Надежная игровая площадка с лицензией и выгодными условиями для новых и постоянных игроков, прозрачные условия.' },
    { id: 'r7', name: 'R7 Casino', href: 'https://sigreaciry.com/sts7vp57a', categories: ['cats'], logo: 'https://logo.clearbit.com/sigreaciry.com', badges: ['Широкий выбор'], desc: 'Игровой портал с широким выбором развлечений и специальными предложениями для новых игроков с увеличенным бонусом.' },

    // Другие казино
    { id: 'atom', name: 'Atom Casino', href: 'https://spark-impulse.com/smuzc7tfa', categories: ['other'], logo: 'https://logo.clearbit.com/spark-impulse.com', badges: ['Современный интерфейс'], desc: 'Современный интерфейс, быстрые выплаты, щедрый welcome и удобно с телефона — идеально для мобильных игроков.' },
    { id: 'unlim', name: 'UNLIM Casino', href: 'https://goo.su/djTgS', categories: ['other'], logo: 'https://logo.clearbit.com/goo.su', badges: ['Безлимитные возможности'], desc: 'Казино с безлимитными возможностями для игры и щедрыми бонусами на каждый депозит без ограничений по времени.' },
    { id: 'cryptoboss', name: 'CRYPTOboss Casino', href: 'https://goo.su/WxYeK', categories: ['other'], logo: 'https://logo.clearbit.com/goo.su', badges: ['Крипто'], desc: 'Платформа с поддержкой криптовалют и специальными предложениями для пользователей цифровых активов, крупный welcome.' },
    { id: 'arkada', name: 'Arkada Casino', href: 'https://grid-cyberlane.com/smv5augqt', categories: ['other'], logo: 'https://logo.clearbit.com/grid-cyberlane.com', badges: ['Приветственный пакет'], desc: 'Приветственный пакет для новых игроков, регулярные акции и турниры с крупными призами.' },
    { id: 'kilogram', name: 'Casino Kilogram', href: 'https://kgpar.com/refs/share?refId=telegram&partnerId=14637&authorization=signup&promocode=ludka', categories: ['other'], logo: 'https://logo.clearbit.com/kgpar.com', badges: ['Промокод: ludka'], desc: 'Уникальная платформа с эксклюзивными предложениями и щедрыми бонусами для новых игроков.' },
    { id: '1win', name: '1Win', href: 'https://lkis.cc/6e03', categories: ['other'], logo: 'https://logo.clearbit.com/lkis.cc', badges: ['Крупный welcome'], desc: 'Крупный welcome, своя фишка (крипта, крупные розыгрыши, колесо фортуны, эксклюзивные слоты) и "мобильный клиент без лагов".' }
];

// Категории вкладок
const categoriesConfig = {
    'top': {
        id: 'top',
        title: 'ТОП казино',
        icon: '⭐',
        desc: 'Лучшие казино из разных категорий: Royal Partners, казино от котов, Vavada, Sykaaa и Dragonmoney. Топовые предложения в одном месте.',
        default: true
    },
    'royal': {
        id: 'royal',
        title: 'Royal Partners (LUDKA)',
        icon: '👑',
        desc: 'Отдельная линейка проверенных казино от Royal Partners, где работает промокод LUDKA. Эксклюзивные бонусы и фриспины.',
        default: false
    },
    'cats': {
        id: 'cats',
        title: 'Казино от котов',
        icon: '🐱',
        desc: 'Подборка брендированных "кошачьих" казино с отдельными фишками и уникальным стилем. Особые условия для игроков.',
        default: false
    },
    'rtp': {
        id: 'rtp',
        title: 'Повышенный RTP',
        icon: '🎯',
        desc: 'Здесь собраны казино с повышенной отдачей слотов по легенде. Больше шансов на выигрыш и лучшие условия для игроков.',
        default: false
    },
    'crash': {
        id: 'crash',
        title: 'Краш-игры и кейсы',
        icon: '🎲',
        desc: 'Платформы с краш-играми и кейсами. Быстрый движ, адреналин и возможность крупных выигрышей на мини-депозитах.',
        default: false
    }
};

