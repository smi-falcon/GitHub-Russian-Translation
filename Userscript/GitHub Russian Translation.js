// ==UserScript==
// @name         GitHub Russian Translation
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Перевод интерфейса сайта GitHub на русский язык.
// @downloadURL  https://github.com/smi-falcon/GitHubRussianTranslation/raw/main/Userscript/GitHub%20Russian%20Translation.js
// @updateURL    https://github.com/smi-falcon/GitHubRussianTranslation/raw/main/Userscript/GitHub%20Russian%20Translation.js
// @homepageURL  https://github.com/smi-falcon/GitHubRussianTranslation
// @author       Falcon (@smi-falcon)
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
        'Sign up': 'Регистрация',
        'Dashboard': 'Панель управления',
        'Organizations': 'Организации',
        'Owners': 'Владельцы',
        'Repositories': 'Репозитории',
        'Projects': 'Проекты',
        'Packages': 'Пакеты',
        'Gists': 'Суть',
        'Stars': 'Звёзды',
        'Profile': 'Профиль',
        'Your profile': 'Ваш профиль',
        'Your repositories': 'Ваши репозитории',
        'Your projects': 'Ваши проекты',
        'Your stars': 'Ваши звёзды',
        'Your gists': 'Ваши gists',
        'Your organizations': 'Ваши организации',
        'Your enterprises': 'Ваши предприятия',
        'Your sponsors': 'Ваши спонсоры',
        'Chat with Copilot': 'Чат с Copilot',
        'Open Copilot': 'Открыть Copilot',
        'New conversation in': 'Новый разговор в',
        'Assistive': 'Вспомогательный',
        'Spaces': 'Пространства',
        'Download for': 'Скачать для',
        'New repository': 'Новый репозиторий',
        'Import repository': 'Импорт репозитория',
        'New codespace': 'Новое пространство кода',
        'New gist': 'Новая суть',
        'New organization': 'Новая организация',
        'New project': 'Новый проект',

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
        'Public profile': 'Публичный профиль',
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
        'Popular repositories': 'Популярные репозитории',
        'Customize your pins': 'Настройте свои значки',
        'Contribution settings': 'Настройки взносов',
        'Private contributions': 'Частный вклад',
        'Activity overview': 'Обзор деятельности',
        'Edit pinned items': 'Редактировать закрепленные элементы',
        'Contribution activity': 'Вклад в деятельность',
        'Created their first repository': 'Создали свой первый репозиторий',
        'Joined GitHub': 'Присоединился к GitHub',
        'First repository': 'Первый репозиторий',
        'Seeing something unexpected? Take a look at the': 'Видите что-то неожиданное? Посмотрите на',

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
        'Manage cookies': 'Управление файлами cookie'
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
