// ==UserScript==
// @name         GitHub Russian Translation
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Перевод интерфейса сайта GitHub на русский язык.
// @downloadURL  https://github.com/smi-falcon/GitHubRussianTranslation/raw/main/Userscript/GitHub%20Russian%20Translation.js
// @updateURL    https://github.com/smi-falcon/GitHubRussianTranslation/raw/main/Userscript/GitHub%20Russian%20Translation.js
// @homepageURL  https://github.com/smi-falcon/GitHubRussianTranslation
// @author       Falcon (https://github.com/smi-falcon)
// @match        https://github.com/*
// @match        https://gist.github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @license      MIT
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // Словарь переводов
    const translations = {
        // Навигация и заголовки
        'Pull requests': 'Запросы на слияние',
        'Issues': 'Задачи',
        'Marketplace': 'Магазин',
        'Explore': 'Обзор',
        'Codespaces': 'Кодспейсы',
        'Models': 'Модели',
        'Sponsors': 'Спонсоры',
        'Settings': 'Настройки',
        'Copilot settings': 'Copilot настройки',
        'Feature preview': 'Предварительный просмотр функций',
        'Appearance': 'Внешний вид',
        'Accessibility': 'Доступность',
        'Try Enterprise': 'Попробуйте Enterprise',
        'Sign out': 'Выйти',
        'Sign in': 'Войти',
        'Signed in as': 'Вошел как',
        'Sign up': 'Регистрация',
        'Add account': 'Добавить учетную запись',
        'Dashboard': 'Панель управления',
        'Organizations': 'Организации',
        'Owners': 'Владельцы',
        'Repositories': 'Репозитории',
        'Projects': 'Проекты',
        'Packages': 'Пакеты',
        'Gists': 'Gists',
        'Stars': 'Звёзды',
        'Languages': 'Языки',
        'Profile': 'Профиль',
        'Your profile': 'Ваш профиль',
        'Your repositories': 'Ваши репозитории',
        'Your projects': 'Ваши проекты',
        'Your stars': 'Ваши звёзды',
        'Your gists': 'Ваши gists',
        'Your GitHub profile': 'Ваш профиль GitHub',
        'Your organizations': 'Ваши организации',
        'Your enterprises': 'Ваши предприятия',
        'Your sponsors': 'Ваши спонсоры',
        'Your Copilot': 'Ваш Copilot',
        'Chat with Copilot': 'Чат с Copilot',
        'Open Copilot': 'Открыть Copilot',
        'New conversation in': 'Новый разговор в',
        'Assistive': 'Вспомогательный',
        'Spaces': 'Пространства',
        'Download for': 'Скачать для',
        'New repository': 'Новый репозиторий',
        'Import repository': 'Импорт репозитория',
        'New': 'Новый',
        'New codespace': 'Новое пространство кода',
        'New gist': 'Новый gist',
        'New organization': 'Новая организация',
        'New project': 'Новый проект',
        'Indent mode': 'Режим отступа',
        'Tabs': 'Вкладки',
        'Soft wrap': 'Мягкая обертка',
        'No wrap': 'Без обертки',

        // Репозиторий
        'Code': 'Код',
        'Actions': 'Действия',
        'Security': 'Безопасность',
        'Insights': 'Статистика',
        'Wiki': 'Вики',
        'Discussions': 'Обсуждения',
        'Fork': 'Форк',
        'Star': 'Звезда',
        'Unstar': 'Убрать звезду',
        'Watch': 'Отслеживать',
        'Unwatch': 'Не отслеживать',
        'Clone': 'Клонировать',
        'Download': 'Скачать',
        'Create new file': 'Создать новый файл',
        'Upload files': 'Загрузить файлы',
        'Find file': 'Найти файл',
        'Branch': 'Ветка',
        'Tags': 'Теги',
        'Branches': 'Ветки',
        'New pull request': 'Новый запрос на слияние',
        'Compare': 'Сравнить',
        'Open': 'Открыто',
        'Closed': 'Закрыто',
        'Merged': 'Слито',
        'Commits': 'Коммиты',
        'Commit': 'Коммит',
        'Files changed': 'Измененные файлы',
        'Contributors': 'Участники',
        'Releases': 'Релизы',
        'Latest release': 'Последний релиз',
        'Used by': 'Используется',
        'Notifications': 'Уведомления',
        'Select type': 'Выберите тип',
        'Can be sponsored': 'Может быть спонсировано',
        'Select language': 'Выберите язык',
        'Select order': 'Выбрать заказ',
        'Last updated': 'Последнее обновление',
        'Switch branches/tags': 'Переключение ветвей/тегов',
        'Nothing to show': 'Нечего показать',
        'There aren’t any releases here': 'Здесь нет никаких релизов',
        'Create a new release': 'Создать новый релиз',
        'Unpin': 'Открепить',
        'Add file': 'Добавить файл',
        'Participating and @mentions': 'Участие и @упоминания',
        'All Activity': 'Вся деятельность',
        'Ignore': 'Игнорировать',
        'Security alerts': 'Предупреждения о безопасности',
        'Existing forks': 'Существующие вилки',
        'Edit repository details': 'Изменить детали репозитория',
        'Include in the home page': 'Включить в главную страницу',
        'Save changes': 'Сохранить изменения',
        'Cancel changes': 'Отменить изменения',
        'Commit changes': 'Зафиксировать изменения',
        'Suggested workflows': 'Рекомендуемые рабочие процессы',
        'More workflows': 'Дополнительные рабочие процессы',
        'Dismiss suggestions': 'Отклонить предложения',
        'Clone using the web URL.': 'Клонировать с помощью веб-URL.',
        'Use a password-protected SSH key.': 'Используйте защищенный паролем ключ SSH.',
        'Work fast with our official CLI.': 'Работайте быстро с помощью нашего официального CLI.',
        'Copy url to clipboard': 'Копировать URL в буфер обмена',
        'Copy command to clipboard': 'Копировать команду в буфер обмена',
        'Your workspaces in the cloud': 'Ваши рабочие пространства в облаке',
        'No codespaces': 'Нет кодовых пространств',
        'Create codespace on main': 'Создать кодовое пространство на главной странице',
        'New with options...': 'Новое с опциями...',
        'Configure dev container': 'Настроить контейнер разработчика',
        'Set up prebuilds': 'Настройка предварительных сборок',
        'Manage codespaces': 'Управление кодовыми пространствами',
        'Share a deep link': 'Поделиться глубокой ссылкой',
        'What are codespaces?': 'Что такое коды?',

        // Ветки
        'New branch': 'Новый филиал',
        'Default': 'По умолчанию',
        'Check status': 'Проверить статус',
        'Behind': 'Позади',
        'Ahead': 'Впереди',
        'Pull request': 'Запрос на извлечение',
        'Copy branch name to clipboard': 'Копировать название ветки в буфер обмена',
        'Delete branch': 'Удалить ветвь',
        'Branch menu': 'Меню филиала',
        'View rules': 'Просмотреть правила',
        'Rename branch': 'Переименовать ветвь',
        'Yours': 'Ваш',
        'Active': 'Активный',
        'Stale': 'Просроченный',
        'No branches': 'Без филиалов',
        'No branches match the search': 'Ни одна ветвь не соответствует поиску',

        // Проекты
        'Create your first GitHub project': 'Создайте свой первый проект GitHub',
        'Get started with GitHub Packages': 'Начните работу с GitHub Packages',
        'Choose a registry': 'Выберите реестр',
        'Create your first list': 'Создайте свой первый список',
        'Lists': 'Списки',
        'Starred repositories': 'Репозитории с отметкой «Избранное»',
        'Starred topics': 'Избранные темы',
        'Sort by': 'Сортировать по',
        'Create list': 'Создать список',
        'Name ascending (A-Z)': 'Имя по возрастанию',
        'Name descending (Z-A)': 'Имя по убыванию',
        'Newest': 'Самые новые',
        'Oldest': 'Самый старый',
        'Type: All': 'Тип: Все',
        'All languages': 'Все языки',
        'Sort by: Recently starred': 'Сортировать по: Недавно добавленные',
        'Sort by: Recently active': 'Сортировать по: Недавно активные',
        'Sort by: Most stars': 'Сортировать по: Больше всего звезд',
        'Recently starred': 'Недавно снялся',
        'Recently active': 'Недавно активные',
        'Most stars': 'Большинство звезд',
        'All gists': 'Все Gists',
        'Back to GitHub': 'Вернуться на GitHub',
        'You don’t have any gists yet.': 'У вас еще нет никаких идей.',
        'Create a gist': 'Создать Gist',

        // Действия с файлами
        'Edit file': 'Редактировать файл',
        'Edit': 'Редактировать',
        'Delete file': 'Удалить файл',
        'Delete': 'Удалить',
        'Raw': 'Исходный',
        'Blame': 'История изменений',
        'History': 'История',
        'Open in': 'Открыть в',
        'Copy path': 'Копировать путь',
        'Copy permalink': 'Копировать постоянную ссылку',

        // Поиск и фильтры
        'Search': 'Поиск',
        'Search or jump to...': 'Поиск или переход...',
        'Filter': 'Фильтр',
        'Sort': 'Сортировка',
        'Type': 'Тип',
        'Language': 'Язык',
        'All': 'Все',
        'Public': 'Публичные',
        'Private': 'Приватные',
        'Sources': 'Источники',
        'Forks': 'Форки',
        'Archived': 'Архивированные',
        'Mirrors': 'Зеркала',
        'Templates': 'Шаблоны',

        // Issues и PR
        'New issue': 'Новая задача',
        'Labels': 'Метки',
        'Milestones': 'Вехи',
        'Assignees': 'Исполнители',
        'Assignee': 'Исполнитель',
        'Comment': 'Комментарий',
        'Comments': 'Комментарии',
        'Leave a comment': 'Оставить комментарий',
        'Write': 'Написать',
        'Preview': 'Предпросмотр',
        'Close issue': 'Закрыть задачу',
        'Reopen issue': 'Переоткрыть задачу',
        'Close pull request': 'Закрыть запрос на слияние',
        'Reopen pull request': 'Переоткрыть запрос на слияние',
        'Merge pull request': 'Слить запрос',
        'Review changes': 'Просмотреть изменения',
        'Approve': 'Одобрить',
        'Request changes': 'Запросить изменения',

        // Статистика
        'Pulse': 'Пульс',
        'Graphs': 'Графики',
        'Network': 'Сеть',
        'Forks': 'Форки',

        // Профиль
        'Name': 'Имя',
        'Bio': 'Биография',
        'Pronouns': 'Местоимения',
        'they/them': 'они/их',
        'she/her': 'она/ее',
        'he/him': 'он/его',
        'Custom': 'Пользовательский',
        'Display current local time': 'Местное время',
        'Social accounts': 'Социальные сети',
        'Overview': 'Обзор',
        'Followers': 'Подписчики',
        'Following': 'Подписки',
        'Follow': 'Подписаться',
        'Unfollow': 'Отписаться',
        'Block user': 'Заблокировать пользователя',
        'Report': 'Пожаловаться',
        'Contributions': 'Вклад',
        'Activity': 'Активность',
        'Organizations': 'Организации',
        'Your personal account': 'Ваш личный кабинет',
        'Go to your personal profile': 'Перейти в личный профиль',
        'Public profile': 'Публичный профиль',
        'Profile picture': 'Аватар',
        'Account': 'Учетная запись',
        'Access': 'Доступ',
        'Billing and licensing': 'Выставление счетов и лицензирование',
        'Emails': 'Электронные письма',
        'Password and authentication': 'Пароль и аутентификация',
        'Sessions': 'Сессии',
        'SSH and GPG keys': 'Ключи SSH и GPG',
        'Moderation': 'Модерация',
        'Code, planning, and automation': 'Код, планирование и автоматизация',
        'Saved replies': 'Сохраненные ответы',
        'Code security': 'Коды безопасности',
        'Integrations': 'Интеграции',
        'Applications': 'Приложения',
        'Scheduled reminders': 'Запланированные напоминания',
        'Archives': 'Архивы',
        'Security log': 'Журнал безопасности',
        'Sponsorship log': 'Журнал спонсорства',
        'Developer settings': 'Настройки разработчика',
        'Pinned': 'Закреплено',
        'Public email': 'Публичная электронная почта',
        'Company': 'Компания',
        'Location': 'Местоположение',
        'Time zone': 'Часовой пояс',
        'Make profile private and hide activity': 'Сделать профиль приватным и скрыть активность',
        'Include private contributions on my profile': 'Включить частные пожертвования в мой профиль',
        'Update preferences': 'Обновление настроек',
        'ORCID iD': 'Идентификатор ORCID',
        'Connect your ORCID iD': 'Подключите свой ORCID iD',
        'Update profile': 'Обновление профиля',
        'Profile settings': 'Настройки профиля',
        'Show Achievements on my profile': 'Показать достижения в моем профиле',
        'GitHub Developer Program': 'Программа для разработчиков GitHub',
        'Jobs profile': 'Профиль вакансий',
        'Available for hire': 'Доступно для аренды',
        'Save jobs profile': 'Сохранить профиль вакансии',
        'Trending settings': 'Настройки трендов',
        'Preferred spoken language': 'Предпочтительный язык общения',
        'Save Trending settings': 'Сохранить настройки трендов',
        'Contributions & activity': 'Вклады и деятельность',
        'Popular repositories': 'Популярные репозитории',
        'Customize your pins': 'Настройте свои значки',
        'Contribution settings': 'Настройки взносов',
        'Private contributions': 'Частный вклад',
        'Activity overview': 'Обзор деятельности',
        'Edit pinned items': 'Редактировать закрепленные элементы',
        'Contribution activity': 'Вклад в деятельность',
        'Created their first repository': 'Создали свой первый репозиторий',
        'Joined': 'Присоединился',
        'Joined GitHub': 'Присоединился к GitHub',
        'First repository': 'Первый репозиторий',
        'Seeing something unexpected? Take a look at the': 'Видите что-то неожиданное? Посмотрите на',
        'Change username': 'Изменить имя пользователя',
        'Link Patreon account': 'Ссылка на аккаунт Patreon',
        'Connect with Patreon': 'Подключится к Patreon',
        'Export account data': 'Экспорт данных учетной записи',
        'Start export': 'Начать экспорт',
        'Successor settings': 'Настройки преемника',
        'Search by username, full name, or email address': 'Поиск по имени пользователя, полному имени или адресу электронной почты',
        'Add Successor': 'Добавить преемника',
        'You have not designated a successor.': 'Вы не назначили преемника.',
        'Delete account': 'Удаление аккаунта',
        'Delete your account': 'Удалить свою учетную запись',
        'Theme preferences': 'Предпочтения по темам',
        'Theme mode': 'Тематический режим',
        'Single theme': 'Единая тема',
        'Sync with system': 'Синхронизация с системой',
        'GitHub will use your selected theme': 'GitHub будет использовать выбранную вами тему',
        'Contrast': 'Контраст',
        'Increase contrast': 'Увеличить контраст',
        'Emoji skin tone preference': 'Предпочтения по цвету кожи эмодзи',
        'Preferred default emoji skin tone': 'Предпочтительный цвет кожи эмодзи по умолчанию',
        'Tab size preference': 'Предпочтения по размеру вкладок',
        'Choose the number of spaces a tab is equal to when rendering code': 'Выберите количество пробелов, равное табуляции при отображении кода.',
        'Markdown editor font preference': 'Настройки шрифта в редакторе Markdown',
        'Use a fixed-width (monospace) font when editing Markdown': 'Используйте шрифт с фиксированной шириной (моноширинный) при редактировании Markdown.',
        'Keyboard shortcuts': 'Горячие клавиши',
        'General': 'Общее',
        'Character keys': 'Клавиши с символами',
        'Save keyboard shortcut preferences': 'Сохранить настройки сочетаний клавиш',
        'Motion': 'Движение',
        'Autoplay animated images': 'Автоматическое воспроизведение анимированных изображений',
        'Motion': 'Движение',
        'Save motion preferences': 'Cохранить настройки движения',
        'Content': 'Содержание',
        'Link underlines': 'Подчеркивание ссылок',
        'Hide link underlines': 'Скрыть подчеркивание ссылок',
        'Show link underlines': 'Показать подчеркивания ссылок',
        'Save content preferences': 'Сохранить настройки контента',
        'Hovercards': 'Всплывающая карточка',
        'Save hovercard preferences': 'Сохранить настройки всплывающих карточек',
        'Editor settings': 'Настройки редактора',
        'URL paste behavior': 'Поведение при вставке URL-адреса',
        'Formatted link': 'Отформатированная ссылка',
        'Plain text': 'Обычный текст',
        'Save editor settings': 'Сохранить настройки редактора',
        'Assistive technology hints': 'Советы по использованию вспомогательных технологий',
        'Add or remove instructions for how to operate complex controls.': 'Добавьте или удалите инструкции по эксплуатации сложных элементов управления.',
        'Save assistive technology hint preferences': 'Сохранить настройки подсказок по вспомогательным технологиям',
        'Default notifications email': 'Уведомления по умолчанию по электронной почте',
        'Custom routing': 'Пользовательская маршрутизация',
        'Subscriptions': 'Подписки',
        'Watching': 'Наблюдение',
        'Participating, @mentions and custom': 'Участие, @упоминания и настройки',
        'Ignored repositories': 'Игнорируемые репозитории',
        'System': 'Система',
        'Dependabot alerts: New vulnerabilities': 'Оповещения Dependabot: новые уязвимости',
        'Dependabot alerts: Email digest': 'Уведомления Dependabot: дайджест по электронной почте',
        'Security campaign emails': 'Электронные письма в рамках кампании по безопасности',
        'In-product messages': 'Сообщения в продукте',

        // Кнопки и действия
        'Save': 'Сохранить',
        'Cancel': 'Отмена',
        'Create': 'Создать',
        'Update': 'Обновить',
        'Submit': 'Отправить',
        'Apply': 'Применить',
        'Confirm': 'Подтвердить',
        'Load more': 'Загрузить ещё',
        'Show more': 'Показать больше',
        'Show less': 'Показать меньше',
        'Copy': 'Копировать',
        'Download ZIP': 'Скачать ZIP',
        'Clone or download': 'Клонировать или скачать',

        // Время
        'yesterday': 'вчера',
        'days ago': 'дней назад',
        'day ago': 'день назад',
        'weeks ago': 'недель назад',
        'week ago': 'неделю назад',
        'months ago': 'месяцев назад',
        'month ago': 'месяц назад',
        'hours ago': 'часов назад',
        'hour ago': 'час назад',
        'minutes ago': 'минут назад',
        'minute ago': 'минуту назад',
        'seconds ago': 'секунд назад',
        'just now': 'только что',
        'Updated': 'Обновлено',
        'Created': 'Создано',

        // Месяца
        'January': 'январь',
        'February': 'февраль',
        'March': 'март',
        'April': 'апрель',
        'May': 'май',
        'June': 'июнь',
        'July': 'июль',
        'August': 'август',
        'September': 'сентябрь',
        'October': 'октябрь',
        'November': 'ноябрь',
        'December': 'декабрь',

        // Дополнительные термины
        'Repository': 'Репозиторий',
        'Description': 'Описание',
        'Website': 'Веб-сайт',
        'Topics': 'Темы',
        'License': 'Лицензия',
        'Readme': 'Readme',
        'Activity': 'Активность',
        'Dependencies': 'Зависимости',
        'Dependents': 'Зависимые',
        'Environments': 'Окружения',
        'Deployments': 'Развертывания',
        'Packages & registries': 'Пакеты и реестры',
        'Pages': 'Страницы',
        'Webhooks': 'Вебхуки',
        'Secrets': 'Секреты',
        'Variables': 'Переменные',
        'Runners': 'Исполнители',
        'Workflow': 'Рабочий процесс',
        'Workflows': 'Рабочие процессы',
        'Jobs': 'Задания',
        'Runs': 'Запуски',
        'Artifacts': 'Артефакты',
        'Fork this repository': 'Форкнуть репозиторий',
        'Create a new fork': 'Создать новый форк',
        'Sync fork': 'Синхронизировать форк',
        'Fetch upstream': 'Получить изменения из оригинала',
        'Compare & pull request': 'Сравнить и создать запрос на слияние',
        'Draft': 'Черновик',
        'Ready for review': 'Готово к проверке',
        'Changes requested': 'Требуются изменения',
        'Approved': 'Одобрено',
        'Conversation': 'Обсуждение',
        'On': 'Включено',
        'Off': 'Выключено',
        'Enabled': 'Включено',
        'Disabled': 'Отключено',
        'Enable hint': 'Включить подсказку',
        'Disable hint': 'Отключить подсказку',
        'Files': 'Файлы',
        'Review': 'Проверка',
        'Checks': 'Проверки',
        'No description provided': 'Описание не предоставлено',
        'Add a description': 'Добавить описание',
        'Sponsor': 'Спонсировать',
        'Report abuse': 'Сообщить о нарушении',
        'Contact GitHub': 'Связаться с GitHub',
        'Pricing': 'Цены',
        'Training': 'Обучение',
        'Blog': 'Блог',
        'About': 'О нас',
        'Terms': 'Условия',
        'Privacy': 'Конфиденциальность',
        'Docs': 'Документация',
        'Status': 'Статус',
        'API': 'API',
        'Home': 'Главная',
        'Team': 'Команда',
        'Enterprises': 'Предприятия',
        'MCP Registry': 'Реестр MCP',
        'Do not share my personal information': 'Не разглашайте мою личную информацию',
        'Manage Cookies': 'Управление файлами cookie',
        'Community': 'Сообщество',
        'Contact': 'Контакты',
        'Manage cookies': 'Управление файлами cookie',
        'Help': 'Помощь'
    };

    // Функция для замены текста
    function translateText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();
            if (text && translations[text]) {
                node.textContent = node.textContent.replace(text, translations[text]);
            }
        }
    }

    // Функция для обхода DOM-дерева
    function walkDOM(node) {
        translateText(node);
        node = node.firstChild;
        while (node) {
            walkDOM(node);
            node = node.nextSibling;
        }
    }

    // Функция для перевода атрибутов
    function translateAttributes() {
        // Перевод placeholder
        document.querySelectorAll('[placeholder]').forEach(element => {
            const placeholder = element.getAttribute('placeholder');
            if (translations[placeholder]) {
                element.setAttribute('placeholder', translations[placeholder]);
            }
        });

        // Перевод aria-label
        document.querySelectorAll('[aria-label]').forEach(element => {
            const label = element.getAttribute('aria-label');
            if (translations[label]) {
                element.setAttribute('aria-label', translations[label]);
            }
        });

        // Перевод title
        document.querySelectorAll('[title]').forEach(element => {
            const title = element.getAttribute('title');
            if (translations[title]) {
                element.setAttribute('title', translations[title]);
            }
        });
    }

    // Основная функция перевода
    function translatePage() {
        // Переводим основной контент
        walkDOM(document.body);

        // Переводим атрибуты
        translateAttributes();

        // Специальная обработка для динамически загружаемого контента
        document.querySelectorAll('button, a, span, div, h1, h2, h3, h4, h5, h6, p, label, td, th').forEach(element => {
            if (element.childNodes.length === 1 && element.firstChild.nodeType === Node.TEXT_NODE) {
                const text = element.textContent.trim();
                if (translations[text]) {
                    element.textContent = translations[text];
                }
            }
        });
    }

    // Запуск перевода при загрузке страницы
    setTimeout(translatePage, 500);

    // Наблюдатель за изменениями DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        walkDOM(node);
                        // Переводим атрибуты у новых элементов
                        if (node.querySelectorAll) {
                            node.querySelectorAll('[placeholder], [aria-label], [title]').forEach(element => {
                                ['placeholder', 'aria-label', 'title'].forEach(attr => {
                                    const value = element.getAttribute(attr);
                                    if (value && translations[value]) {
                                        element.setAttribute(attr, translations[value]);
                                    }
                                });
                            });
                        }
                    }
                });
            }
        });
    });

    // Запускаем наблюдатель
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Добавляем индикатор, что скрипт работает
    console.log('🌐 GitHub Russian Translation активирован');
})();
