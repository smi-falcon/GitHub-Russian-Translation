// ==UserScript==
// @name         GitHub Russian Translation
// @namespace    http://tampermonkey.net/
// @version      1.82
// @description  Перевод интерфейса сайта GitHub на русский язык.
// @downloadURL  https://github.com/smi-falcon/GitHub-Russian-Translation/raw/main/Userscript/GitHub%20Russian%20Translation.js
// @updateURL    https://github.com/smi-falcon/GitHub-Russian-Translation/raw/main/Userscript/GitHub%20Russian%20Translation.js
// @homepageURL  https://github.com/smi-falcon/GitHub-Russian-Translation
// @supportURL   https://github.com/smi-falcon/GitHub-Russian-Translation/issues
// @author       Falcon (https://github.com/smi-falcon)
// @match        https://github.com/*
// @match        https://gist.github.com/*
// @match        https://*.github.com/*
// @exclude      https://github.com/enterprise*
// @exclude      https://github.com/mobile*
// @icon         https://github.com/smi-falcon/GitHub-Russian-Translation/blob/main/Assets/Images/logo.png?raw=true
// @icon64       https://github.com/smi-falcon/GitHub-Russian-Translation/blob/main/Assets/Images/logo.png?raw=true
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_notification
// @run-at       document-idle
// @noframes
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';

    // Словарь переводов
    const translations = {
        // Главная и лента
        'Activity you want to see on your feed': 'Активность, которую вы хотите видеть в своей ленте',
        'Adjust time span': 'Настроить временной интервал',
        'All issues': 'Все задачи',
        'All featured topics': 'Все представленные темы',
        'All pull requests': 'Все запросы на слияние',
        'Announcements': 'Объявления',
        'Ask Copilot': 'Спросите Copilot',
        'By default, the feed shows events from repositories you sponsor or watch, and people you follow.': 'По умолчанию в ленте отображаются события из репозиториев, которые вы спонсируете или наблюдаете, а также от людей, на которых вы подписаны.',
        'Bulk Sponsor': 'Массовый спонсор',
        'Careers': 'Карьера',
        'Collections': 'Коллекции',
        'Community Forum': 'Форум сообщества',
        'Compare GitHub': 'Сравнить GitHub',
        'Create a collection': 'Создать коллекцию',
        'Create a profile README for me': 'Создать для меня профиль README',
        'Create a web app': 'Создать веб-приложение',
        'Create an issue for a bug': 'Создать заявку об ошибке',
        'Customer stories': 'Истории клиентов',
        'Developer API': 'API для разработчиков',
        'Developers': 'Разработчики',
        'Direct dependencies only': 'Только прямые зависимости',
        'Ecosystem': 'Экосистема',
        'Ecosystems': 'Экосистемы',
        'Education': 'Образование',
        'Enterprise': 'Предприятие',
        'Events': 'События',
        'Explore.': 'Исследуйте',
        'Explore as': 'Исследуйте как',
        'Explore GitHub': 'Исследуйте GitHub',
        'Explore GitHub Sponsors': 'Исследуйте GitHub Sponsors',
        'Explore people and projects': 'Изучите людей и проекты',
        'Feed': 'Лента',
        'Feed item options': 'Параметры элемента фида',
        'feed filter': 'фильтр ленты',
        'Follows': 'Следует',
        'Get code feedback': 'Получить отзыв о коде',
        'Get started with GitHub': 'Начните работу с GitHub',
        'Inclusion': 'Инклюзия',
        'Include events from starred repositories': 'Включить события из репозиториев с отметкой «звездочка»',
        'Interpret an architecture diagram': 'Интерпретация архитектурной схемы',
        'Issues and pull requests from repositories': 'Проблемы и запросы на извлечение из репозиториев',
        'I want to see fewer trending repositories': 'Я хочу видеть меньше популярных репозиториев',
        'I want to see fewer repository recommendations': 'Я хочу видеть меньше рекомендаций по репозиториям',
        'Latest changes': 'Последние изменения',
        'Latest from our changelog': 'Последние изменения в нашем журнале изменений',
        'Learn to code': 'Научиться программировать',
        'My open pull requests': 'Мои открытые запросы на извлечение',
        'Newsroom': 'Новостная лента',
        'No issues found, try a different filter.': 'Проблем не обнаружено, попробуйте другой фильтр.',
        'No pull requests found, try a different filter.': 'Запросы на извлечение не найдены, попробуйте другой фильтр.',
        'None of your dependencies can be sponsored': 'Ни одна из ваших зависимостей не может быть спонсирована',
        'Order by': 'Заказать',
        'Partners': 'Партнеры',
        'Platform': 'Платформа',
        'Popular topics': 'Популярные темы',
        'Premium Support': 'Премиум-поддержка',
        'Professional Services': 'Профессиональные услуги',
        'Recommendations': 'Рекомендации',
        'Recommended for you': 'Рекомендуется для вас',
        'Relevant projects or people that are being sponsored': 'Соответствующие проекты или люди, которые получают спонсорскую поддержку',
        'Remove from dashboard': 'Удалить с панели инструментов',
        'Remove section': 'Удалить раздел',
        'Repository activity': 'Деятельность репозитория',
        'Repositories and people you may like': 'Репозитории и люди, которые могут вам понравиться',
        'Repositories being starred by people': 'Репозитории, отмеченные звездочкой людьми',
        'Repositories that are created or forked by people': 'Репозитории, созданные или форкнутые людьми',
        'Reset to default': 'Сбросить до настроек по умолчанию',
        'Resources': 'Ресурсы',
        'Roadmap': 'Дорожная карта',
        'Select a language': 'Выберите язык',
        'Select a spoken language': 'Выберите разговорный язык',
        'Send': 'Отправить',
        'Send feedback': 'Отправить отзыв',
        'Shop': 'Магазин',
        'Show less activity like this': 'Показать меньше подобных действий',
        'Skills': 'Навыки',
        'Social Impact': 'Социальное воздействие',
        'Special discussion posts from repositories': 'Специальные дискуссионные посты из репозиториев',
        'Start with GitHub Docs': 'Начните с GitHub Docs',
        'Status': 'Статус',
        'Subscribe to our developer newsletter': 'Подпишитесь на нашу рассылку для разработчиков',
        'Suggest next steps for an issue': 'Предложить следующие шаги по решению проблемы',
        'Summarize a pull request': 'Обобщить запрос на извлечение',
        'Support': 'Поддержка',
        "That's all for now": "На этом пока всё",
        'The ReadME Project': 'Проект ReadME',
        'Top repositories': 'Лучшие репозитории',
        'to see more content, or visit': 'чтобы увидеть больше контента, или посетите',
        'Trending': 'Тренды',
        'Trending developers': 'Популярные разработчики',
        'Trending repositories': 'Популярные репозитории',
        'Try the new experience': 'Попробуйте новый опыт',
        'Update posts from repositories': 'Обновление сообщений из репозиториев',
        'View changelog →': 'Просмотреть журнал изменений →',
        'Who people are following': 'За кем следят люди',
        'Why GitHub': 'Почему GitHub',
        'You can adjust your': 'Вы можете настроить',

        // Навигация и заголовки
        'Accessibility': 'Доступность',
        'Account switcher': 'Переключатель учетных записей',
        'Add account': 'Добавить учетную запись',
        'All MCP servers': 'Все серверы MCP',
        'Appearance': 'Внешний вид',
        'Assistive': 'Вспомогательный',
        'Blank issue': 'Пустой выпуск',
        'Chat with Copilot': 'Чат с Copilot',
        'Codespaces': 'Кодспейсы',
        'Connect models to the real world': 'Соединяйте модели с реальным миром',
        'Contributed to': 'Внёс вклад в',
        'Copilot settings': 'Copilot настройки',
        'Create a new extension': 'Создать новое расширение',
        'Create a new issue from scratch': 'Создать новую задачу с нуля',
        'Create New...': 'Создать новый…',
        'Create new...': 'Создать новый...',
        'Create new issue': 'Создать новую проблему',
        'Create more': 'Создать больше',
        'Dashboard': 'Панель управления',
        'Discover apps with Copilot extensions': 'Откройте для себя приложения с расширениями Copilot',
        'Download for': 'Скачать для',
        'Explore': 'Обзор',
        'Enhance your workflow with extensions': 'Улучшите свой рабочий процесс с помощью расширений',
        'Feature preview': 'Предварительный просмотр функций',
        'First pull request': 'Первый запрос на слияние',
        'Gists': 'Gists',
        'Give feedback': 'Оставить отзыв',
        'Homepage': 'Домашняя страница',
        'Import repository': 'Импорт репозитория',
        'Indent mode': 'Режим отступа',
        'Issues': 'Задачи',
        'Jump to': 'Перейти к',
        'Languages': 'Языки',
        'Marketplace': 'Магазин',
        'Models': 'Модели',
        'Models for your every use case': 'Модели для любого случая использования',
        'New': 'Новый',
        'New codespace': 'Новое пространство кода',
        'New conversation in': 'Новый разговор в',
        'New gist': 'Новый Gist',
        'New organization': 'Новая организация',
        'New project': 'Новый проект',
        'New repository': 'Новый репозиторий',
        'No wrap': 'Без обертки',
        'Open Copilot': 'Открыть Copilot',
        'Open Menu': 'Открыть меню',
        'Open user navigation menu': 'Открыть меню навигации пользователя',
        'Organizations': 'Организации',
        'Owners': 'Владельцы',
        'Packages': 'Пакеты',
        'Profile': 'Профиль',
        'Project': 'Проект',
        'Projects': 'Проекты',
        'Pull requests': 'Запросы на слияние',
        'Repositories': 'Репозитории',
        'Search for repositories': 'Поиск репозиториев',
        'Search in this owner': 'Поиск по этому владельцу',
        'Search in this repository': 'Поиск в этом репозитории',
        'Search syntax tips': 'Советы по синтаксису поиска',
        'Select an item': 'Выберите элемент',
        'Settings': 'Настройки',
        'Signed in as': 'Вошел как',
        'Sign in': 'Войти',
        'Sign out': 'Выйти',
        'Sign up': 'Регистрация',
        'Soft wrap': 'Мягкая обертка',
        'Spaces': 'Пространства',
        'Sponsors': 'Спонсоры',
        'Stars': 'Звёзды',
        'Start a new Copilot thread': 'Начать новый чат с Copilot',
        'stars': 'Звёзд',
        'Tabs': 'Вкладки',
        'Templates and forms': 'Шаблоны и формы',
        'to search': 'искать',
        'Try Enterprise': 'Попробуйте Enterprise',
        'You have no unread notifications': 'У вас нет непрочитанных уведомлений',
        'Your Copilot': 'Ваш Copilot',
        'Your enterprises': 'Ваши предприятия',
        'Your gists': 'Ваши Gists',
        'Your GitHub profile': 'Ваш профиль GitHub',
        'Your issues': 'Ваши проблемы',
        'Your organizations': 'Ваши организации',
        'Your profile': 'Ваш профиль',
        'Your projects': 'Ваши проекты',
        'Your pull requests': 'Ваши запросы на извлечение',
        'Your repositories': 'Ваши репозитории',
        'Your sponsors': 'Ваши спонсоры',
        'Your stars': 'Ваши звёзды',

        // Репозиторий и настройки
        '(separate with spaces)': '(разделите пробелами)',
        '.gitignore tells git which files not to track.': '.gitignore сообщает git, какие файлы не отслеживать.',
        'Able to merge.': 'Возможно объединение.',
        'About ignoring files': 'Об игнорировании файлов',
        'About licenses': 'О лицензиях',
        'About READMEs': 'О файлах README',
        'Action required': 'Требуется принять меры',
        'Actions': 'Действия',
        'Actions Performance Metrics': 'Показатели эффективности действий',
        'Actions secrets and variables': 'Скрытые действия и переменные',
        'Actions usage metrics': 'Показатели использования действий',
        'Actions Usage Metrics': 'Показатели использования действий',
        'Actions performance metrics': 'Показатели эффективности действий',
        'Actions permissions': 'Разрешения на действия',
        'Active branches': 'Активные ветви',
        'active forked repositories': 'активные форкнутые репозитории',
        'Active issues': 'Актуальные вопросы',
        'Active pull requests': 'Активные запросы на извлечение',
        'Actor': 'Актер',
        'Add .gitignore': 'Добавить .gitignore',
        'Add a comment': 'Добавить комментарий',
        'Add a filter': 'Добавить фильтр',
        'Add a title': 'Добавить заголовок',
        'Add account': 'Добавить учетную запись',
        'Add all commits from the head branch to the base branch with a merge commit.': 'Добавьте все коммиты из головной ветки в базовую ветку с помощью коммита слияния.',
        'Add all commits from the head branch onto the base branch individually.': 'Добавьте все коммиты из головной ветки в базовую ветку по отдельности.',
        'Add any third-party code scanning tool.': 'Добавьте любой сторонний инструмент для сканирования кода.',
        'Add branch ruleset': 'Добавить набор правил ветки',
        'Add classic branch protection rule': 'Добавить классическое правило защиты ветки',
        'Add deploy key': 'Добавить ключи развертывания',
        'Add file': 'Добавить файл',
        'Add license': 'Добавить лицензию',
        'Add links to GitHub Sponsors or third-party methods your repository accepts for financial contributions to your project.': 'Добавьте ссылки на GitHub Sponsors или сторонние методы, которые ваш репозиторий принимает для финансовых взносов в ваш проект.',
        'Add projects to view them here.': 'Добавьте проекты, чтобы просмотреть их здесь.',
        'Add README': 'Добавить README',
        'Add repositories to this list': 'Добавить репозитории в этот список',
        'Add rule': 'Добавить правило',
        'Add this repository to a list': 'Добавить этот репозиторий в список',
        'Add this repository to one or more lists': 'Добавить этот репозиторий в один или несколько списков',
        'Add users to bypass list': 'Добавить пользователей в список исключений',
        'Add webhook': 'Добавить веб-хук',
        'Add your comment here...': 'Добавьте свой комментарий здесь...',
        'Adds gradients and outlines to increase contrast in charts.': 'Добавляет градиенты и контуры для увеличения контрастности диаграмм.',
        'Additions': 'Дополнения',
        'Additions and deletions per week': 'Добавления и удаления за неделю',
        'Admin access': 'Административный доступ',
        'Advanced filters': 'Расширенные фильтры',
        'Advanced Security': 'Расширенная безопасность',
        'Advanced Security features help keep your repository secure and updated.\n      By enabling these features, you\'re granting us permission to perform read-only analysis on your repository.': 'Функции Advanced Security помогают обеспечивать безопасность и актуальность вашего репозитория.\n      Включая эти функции, вы предоставляете нам разрешение на выполнение анализа вашего репозитория в режиме только для чтения.',
        'Advanced Security will be disabled.': 'Расширенная безопасность будет отключена.',
        'Advisories': 'Рекомендации',
        'Agent suggestions for issues': 'Предложения агентов по проблемам',
        'After merging a pull request, linked issues can be closed automatically.': 'После слияния запроса на извлечение связанные проблемы могут быть закрыты автоматически.',
        'After pull requests are merged, you can have head branches deleted automatically.': 'После слияния пул-реквестов вы можете настроить автоматическое удаление головных веток.',
        'ahead of': 'впереди',
        'All Activity': 'Вся деятельность',
        'All deployments': 'Все развертывания',
        'All jobs': 'Вся работа',
        'All users that are not a member or owner of this repository will require approval to run workflows.': 'Все пользователи, которые не являются членами или владельцами этого репозитория, должны получить разрешение для запуска рабочих процессов.',
        'All workflows': 'Все рабочие процессы',
        'Allow all actions and reusable workflows': 'Разрешить все действия и повторно используемые рабочие процессы',
        'Allow auto-merge': 'Разрешить автоматическое слияние',
        'Allow Dependabot to open pull requests automatically to keep your dependencies up-to-date when new versions are available.': 'Разрешите Dependabot автоматически открывать пул-реквесты, чтобы ваши зависимости оставались актуальными при появлении новых версий.',
        'Allow GitHub Actions to create and approve pull requests': 'Разрешить GitHub Actions создавать и утверждать запросы на вытягивание',
        'Allow merge commits': 'Разрешить слияние коммитов',
        'Allow rebase merging': 'Разрешить слияние с перебазированием',
        'Allow squash merging': 'Разрешить слияние сквоша',
        'Always suggest updating pull request branches': 'Всегда предлагайте обновлять ветки запросов на извлечение',
        'An agent analyzes incoming issues and recommends labels, priority, assignees, and other metadata.': 'Агент анализирует входящие задачи и рекомендует метки, приоритет, исполнителей и другие метаданные.',
        'and start receiving funding.': 'и начать получать финансирование.',
        'Any': 'Любой',
        'Any action or reusable workflow can be used, regardless of who authored it or where it is defined.': 'Можно использовать любое действие или многократно используемый рабочий процесс, независимо от того, кто его создал и где он определен.',
        'Any custom Dependabot alert rules will be disabled unless GitHub Advanced Security is enabled for this repository.': 'Любые настраиваемые правила оповещений Dependabot будут отключены, если для этого репозитория не включена функция GitHub Advanced Security.',
        'Any repository that has not been created or\n    updated during this period will be excluded.': 'Любой репозиторий, который не был создан или обновлён в течение этого периода, будет исключён.',
        'Anyone can create a pull request': 'Создать пул-реквест может любой',
        'Anyone on the internet can see this repository. You choose who can commit.': 'Любой пользователь Интернета может просматривать этот репозиторий. Вы выбираете, кто может вносить изменения.',
        'Apply and reload': 'Применить и перезагрузить',
        'Apply labels to this pull request': 'Применить метки к этому пул-реквесту',
        'Approved review': 'Утвержденный обзор',
        'Approval for running fork pull request workflows from contributors': 'Утверждение запуска рабочих процессов запросов на извлечение веток от участников',
        'Archive this repository': 'Архивировать этот репозиторий',
        'Archived repositories': 'Архивные репозитории',
        'Artifact and log retention': 'Хранение артефактов и журналов',
        'Ascending': 'Восходящий',
        'Ask about this diff': 'Спросить об этом различии',
        'Ask about this file': 'Cпросить об этой файле',
        'Ask Copilot about this file': 'Спросите Copilot об этом файле',
        'Ask Copilot about this diff': 'Спросите Copilot об этом расхождении',
        'Ask Copilot about this file-diff': 'Спросите Copilot об этом файле-diff',
        'Assign up to 10 people to this pull request': 'Назначьте до 10 человек для этого запроса на извлечение',
        'Attach to current thread': 'Присоединить к текущей ветке',
        'Attestations': 'Сертификаты',
        'Authored': 'Автор',
        'Auto-close issues with merged linked pull requests': 'Проблемы с автоматическим закрытием объединенных связанных запросов на извлечение',
        'Automate your workflow from idea to production': 'Автоматизируйте рабочий процесс от идеи до производства',
        'Automated code reviews using rulesets': 'Автоматизированная проверка кода с использованием наборов правил',
        'Automatically delete head branches': 'Автоматически удалять головные ветви',
        'Automatically detect common vulnerabilities and coding errors.': 'Автоматически обнаруживайте распространенные уязвимости и ошибки кодирования.',
        'Automatically detect vulnerabilities in your code.': 'Автоматически обнаруживайте уязвимости в вашем коде.',
        'Automation': 'Автоматизация',
        'Automation level': 'Уровень автоматизации',
        'Available on Copilot Pro': 'Доступно в Copilot Pro',
        'available runner': 'доступный раннер',
        'available runners': 'доступных раннеров',
        'Average run time of jobs in this repository for current month': 'Среднее время выполнения заданий в этом репозитории за текущий месяц',
        'Average queue time of jobs in this repository for current month': 'Среднее время ожидания заданий в этом репозитории за текущий месяц',
        'Avg job queue time': 'Среднее время ожидания в очереди заданий',
        'Avg job run time': 'Среднее время выполнения задания',
        'Awaiting review from you': 'Ожидаем вашего отзыва',
        'Awaiting review from you or your team': 'Ожидаем отзыв от вас или вашей команды',
        'Balanced': 'Сбалансированный',
        'Bank account': 'Банковский счет',
        'Begin import': 'Начать импорт',
        'behind': 'позади',
        'Best for using frameworks and customizing your build process': 'Лучше всего для использования фреймворков и настройки процесса сборки',
        'Block commits that contain': 'Блокируйте фиксации, содержащие',
        'Branch': 'Ветка',
        'branches': 'ветки',
        'Branch protection rules': 'Правила защиты ветвей',
        'Branches': 'Ветки',
        'Browse all categories': 'Просмотреть все категории',
        'Browse files': 'Просмотр файлов',
        'Browse the repository at this point in the history': 'Просмотрите репозиторий на этом этапе истории',
        'Build and deployment': 'Создание и развертывание',
        'Build complex filter queries': 'Создание сложных запросов с фильтрами',
        'Build, test, and deploy your code. Make code reviews, branch management, and issue triaging work the way you want. Select a workflow to get started.': 'Создавайте, тестируйте и развертывайте свой код. Обеспечьте работу по проверке кода, управлению ветвями и сортировке проблем в соответствии с вашими требованиями. Выберите рабочий процесс, чтобы начать работу.',
        'By default, forks are named the same as their upstream repository. You can customize the name to distinguish it further.': 'По умолчанию форки называются так же, как их исходный репозиторий. Вы можете настроить имя, чтобы лучше его различать.',
        'By repository': 'По репозиторию',
        'Bypass list': 'Список исключений',
        'Caches': 'Кэши',
        'Can be sponsored': 'Может быть спонсировано',
        'Cancel changes': 'Отменить изменения',
        'can still leave comments': 'все еще могут оставлять комментарии',
        'can’t add new comments': 'не могут добавлять новые комментарии',
        'Care to check out the': 'Не хотите ли заглянуть на',
        'Cautious': 'Осторожный',
        'Center content': 'Центр содержания',
        'Change to private': 'Перейти в приватный режим',
        'Change repository visibility': 'Изменить видимость репозитория',
        'Change visibility': 'Изменить видимость',
        'Change your avatar': 'Изменить аватар',
        'Chart options': 'Параметры графика',
        'Check out our': 'Посмотрите наше',
        'Check runs failure threshold': 'Проверить порог сбоев',
        'Checklist': 'Контрольный список',
        'Choose a .gitignore template': 'Выберите шаблон .gitignore',
        'Choose a license': 'Выберите лицензию',
        'Choose a reason': 'Выберите причину',
        'Choose a tag to compare': 'Выберите тег для сравнения',
        'Choose dates': 'Выберите даты',
        'Choose a fiscal host': 'Выберите финансового хоста',
        'Choose the repository settings for artifacts and logs.': 'Выберите настройки репозитория для артефактов и журналов.',
        'Choose two branches to see what’s changed or to start a new pull request.': 'Выберите две ветки, чтобы увидеть изменения или создать новый запрос на слияние.',
        'Choose visibility': 'Выберите видимость',
        'Choose who can see and commit to this repository': 'Выберите, кто может просматривать и вносить изменения в этот репозиторий',
        'Choose whether GitHub Actions can create pull requests or submit approving pull request reviews.': 'Выберите, может ли GitHub Actions создавать пул-реквесты или отправлять утверждающие рецензии на пул-реквесты.',
        'Choosing a license': 'Выбор лицензии',
        'Classic branch protections have not been configured': 'Классические средства защиты ветвей не настроены',
        'Classic Pages experience': 'Классический опыт Pages',
        'Clear current search query, filters, and sorts': 'Очистить текущий поисковый запрос, фильтры и сортировку',
        'Clone': 'Клонировать',
        'Clone using the web URL.': 'Клонировать с помощью веб-URL.',
        'Clone via HTTPS': 'Клонировать через HTTPS',
        'Clone via SSH': 'Клонировать через SSH',
        'Clone with an SSH key and passphrase from your GitHub settings.': 'Склонируйте с помощью SSH-ключа и парольной фразы из настроек GitHub.',
        'Closed': 'Закрыто',
        'Code': 'Код',
        'Code and automation': 'Код и автоматизация',
        'Code check': 'Проверка кода',
        'Code frequency': 'Частота кода',
        'Code of conduct': 'Кодекс поведения',
        'Code review': 'Проверка кода',
        'CodeQL analysis': 'Анализ CodeQL',
        'CodeQL will automatically find the best configuration for your repository.': 'CodeQL автоматически найдет оптимальную конфигурацию для вашего репозитория.',
        'Codespaces secrets': 'Секреты Codespaces',
        'Coding agent': 'Кодирующий агент',
        'collaborators': 'сотрудниками',
        'Collaborators only': 'Только для участников проекта',
        'Collapse file': 'Свернуть файл',
        'Collapse file tree': 'Свернуть дерево файлов',
        'Collapse sidebar': 'Свернуть боковую панель',
        'Column & bar chart settings': 'Настройки столбчатых и гистограммных диаграмм',
        'Combine all commits from the head branch into a single commit in the base branch.': 'Объединить все коммиты из головной ветки в один коммит в базовой ветке.',
        'Comfortable display density': 'Комфортная плотность отображения',
        'Compact display density': 'Компактная плотность отображения',
        'Comparing changes': 'Сравнение изменений',
        'Comment on this file': 'Комментируйте этот файл',
        'Commenting has been disabled because this issue was converted to a': 'Комментарии отключены, так как эта проблема была преобразована в',
        'Comments are disabled for this gist.': 'Комментарии для этого гиста отключены.',
        'Committed to this repository in the last day': 'Внесено в этот репозиторий за последний день',
        'Committed to this repository in the last week': 'Внесено в этот репозиторий за последнюю неделю',
        'Committed to this repository in the last month': 'Внесено в этот репозиторий за последний месяц',
        'Committed to this repository in the last year': 'Внесено в этот репозиторий за последний год',
        'Committed to this repository in the past day': 'Внесено в этот репозиторий за последний день',
        'Committed to this repository in the past week': 'Внесено в этот репозиторий за последнюю неделю',
        'Committed to this repository in the past month': 'Внесено в этот репозиторий за последний месяц',
        'Committed to this repository in the past year': 'Внесено в этот репозиторий за последний год',
        'Commit': 'Коммит',
        'Commit changes': 'Зафиксировать изменения',
        'Commit changes...': 'Зафиксировать изменения',
        'Commit message': 'Сообщение о фиксации',
        'Commits': 'Коммиты',
        'committed': 'коммитили',
        'Committed to this repository': 'Зарегистрирован в этом репозитории',
        'Community standards': 'Стандарты сообщества',
        'Community Standards': 'Стандарты сообщества',
        'Compare': 'Сравнить',
        'compare across forks': 'сравнить форки',
        'Compact line height': 'Компактная высота строки',
        'Confirm merge': 'Подтвердить слияние',
        'Configuration': 'Конфигурация',
        'Configure dev container': 'Настроить контейнер разработчика',
        'Configure environment': 'Настроить среду',
        'Configure scanning tool': 'Настройка инструмента сканирования',
        "Contact email": "Контактный email",
        'Contact GitHub Support': 'Связаться со службой поддержки GitHub',
        'Continuous integration': 'Непрерывная интеграция',
        'Contribute': 'Вклад',
        'Contributed by me': 'Автор: я',
        'Contributing': 'Вклады',
        'Contributors': 'Участники',
        'Contributors are working behind the scenes to make open source better for everyone—give them the help and recognition they deserve.': 'Участники проекта работают за кулисами, чтобы сделать открытый исходный код лучше для всех — окажите им помощь и признание, которых они заслуживают.',
        'Contributions per week to': 'Взносы в неделю на',
        ', excluding merge commits': ', исключая слияния коммитов',
        'Control how and when users are prompted to update their branches if there are new changes available in the base branch.': 'Управляйте тем, как и когда пользователям предлагается обновить свои ветки, если в базовой ветке доступны новые изменения.',
        'converted this issue into a discussion': 'превратил этот вопрос в дискуссию',
        'Conversations': 'Разговоры',
        'Copilot Autofix': 'Автоматическое исправление Copilot',
        'Copilot Autofix for third-party tools': 'Copilot Autofix для сторонних инструментов',
        'Copilot coding agent': 'Агент кодирования Copilot',
        'Copilot menu': 'Меню Copilot',
        'Copy command to clipboard': 'Скопировать команду в буфер обмена',
        'Copy file name to clipboard': 'Скопировать название файла в буфер обмена',
        'Copy macos-latest': 'Скопировать macos-latest',
        'Copy Markdown': 'Скопировать Markdown',
        'Copy raw file': 'Скопировать исходный файл',
        'Copy sharable link for this gist.': 'Скопируйте ссылку для общего доступа к этому Gist.',
        'Copy ubuntu-latest': 'Скопировать ubuntu-latest',
        'Copy url to clipboard': 'Cкопировать URL в буфер обмена',
        'Copy URL to clipboard': 'Скопировать URL в буфер обмена',
        'Copy windows-latest': 'Скопировать windows-latest',
        'Country or region of residence': 'Страна или регион проживания',
        'Country or region where your bank account is located': 'Страна или регион, в котором находится ваш банковский счет',
        'Create a branch ruleset': 'Создать набор правил ветки',
        'Create a codespace on development': 'Создать пространство кода в разработке',
        'Create a codespace on main': 'Создать пространство кода в главном меню',
        'Create a list to organize your starred repositories.': 'Создайте список, чтобы упорядочить репозитории, отмеченные звездочкой.',
        'Create a merge commit': 'Создать коммит слияния',
        'create a pull request': 'создать запрос на извлечение',
        'Create a new release': 'Создать новый релиз',
        'Create a new repository': 'Создать новый репозиторий',
        'Create a new codespace': 'Создать новое пространство кода',
        'Create attestations using the': 'Создавайте справки с помощью',
        'Create codespace': 'Создать кодовое пространство',
        'Create codespace on main': 'Создать пространство кода в главном меню',
        'Create draft pull request': 'Создать черновой запрос на слияние',
        'Create new file': 'Создать новый файл',
        'Create new gist': 'Создать новый Gist',
        'Create new page': 'Создать новую страницу',
        'Create new tag': 'Создать новый тег',
        'Create public gist': 'Создать публичный Gist',
        'Create pull request': 'Создать запрос на слияние',
        'Create repository': 'Создать репозиторий',
        'Create ruleset for default branch': 'Создать набор правил для ветки по умолчанию',
        'Create saved search': 'Создать сохраненный поиск',
        'Create secret gist': 'Создать секретный Gist',
        'Create status badge': 'Создать значок статуса',
        'Create the first page': 'Создать первую страницу',
        'Create your first list.': 'Создайте свой первый список.',
        'Create your own views to quickly find and access your work.': 'Создавайте собственные представления, чтобы быстро находить и открывать свои работы.',
        'Current forks will remain public and will be detached from this repository.': 'Текущие форки останутся общедоступными и будут отделены от этого репозитория.',
        'Currently, users without write access can open an unlimited number of pull requests.': 'В настоящее время пользователи, не имеющие прав на запись, могут открывать неограниченное количество пулл-реквестов.',
        'Custom allowlist': 'Пользовательский белый список',
        'Custom date range (UTC)': 'Пользовательский диапазон дат (UTC)',
        'Custom Patterns': 'Пользовательские шаблоны',
        'Custom properties': 'Пользовательские свойства',
        'Customize': 'Настроить',
        'Customize claims included in the OIDC token.': 'Настройте утверждения, включенные в токен OIDC.',
        'Customize the subject (sub) claim in the OIDC token, used to identify the workflow run context.': 'Настройте утверждение subject (sub) в токене OIDC, используемое для идентификации контекста запуска рабочего процесса.',
        'Customize your CodeQL configuration via a YAML file checked into the repository.': 'Настройте конфигурацию CodeQL с помощью файла YAML, зарегистрированного в репозитории.',
        'Customization settings': 'Настройки персонализации',
        'Danger Zone': 'Опасная зона',
        'Default branch': 'По умолчанию ветвь',
        'Default commit message': 'Сообщение фиксации по умолчанию',
        'Default message': 'Сообщение по умолчанию',
        'Defaults Saved': 'Настройки по умолчанию сохранены',
        'Define branch rules to disable force pushing, prevent branches from being deleted, or require pull requests before merging. Learn more about': 'Определите правила для веток, чтобы отключить принудительную отправку, предотвратить удаление веток или требовать запросы на извлечение перед слиянием. Узнайте больше о',
        'Define whether collaborators can delete or force push and set requirements for any pushes, such as passing status checks or a linear commit history.': 'Определите, могут ли сотрудники удалять или принудительно отправлять изменения, а также установите требования для любых отправлений, такие как прохождение проверок статуса или линейная история коммитов.',
        'Delete all logs': 'Удалить все журналы',
        'Delete directory': 'Удалить каталог',
        'Delete this repository': 'Удалить этот репозиторий',
        'Delete workflow run': 'Удалить запуск рабочего процесса',
        'Deleted branches will still be able to be restored.': 'Удаленные ветки по-прежнему можно будет восстановить.',
        'Deletions': 'Удаления',
        'Dependabot alerts are disabled.': 'Оповещения Dependabot отключены.',
        "Dependabot isn't enabled": "Dependabot не включен",
        'Dependabot secrets': 'Секреты Dependabot',
        'Dependabot version updates': 'Обновления версий Dependabot',
        'dependencies and sub-dependencies': 'зависимости и подзависимости',
        'Dependency graph is disabled': 'График зависимостей отключен',
        'Deploy keys': 'Развертывание ключей',
        'Deploy from a branch': 'Развертывание из ветки',
        'Deployable': 'В процессе развертывания',
        'Deployed': 'Развернут',
        'Deployment': 'Развёртывание',
        'Descending': 'Нисходящий',
        'Developer Certificate of Origin (DCO)': 'Сертификат происхождения разработчика (DCO)',
        'Development': 'Разработка',
        'Diff view': 'Сравнение',
        'Differentiate by line style': 'Различать по стилю линии',
        'Disable actions': 'Отключить действия',
        'Disable branch protection rules': 'Отключить правила защиты ветвей',
        'Disable branch protection rules enforcement and APIs': 'Отключить применение правил защиты ветвей и API',
        'Disable comments': 'Отключить комментарии',
        'Disallow assets and tags from being modified once a release is published.': 'Запретить изменение ресурсов и тегов после публикации выпуска.',
        'Discuss and review the changes in this comparison with others.': 'Обсуждайте и просматривайте изменения в этом сравнении с другими.',
        'Discussions': 'Обсуждения',
        'Discussions are used to ask questions and have open-ended conversations.': 'Дискуссии используются для того, чтобы задавать вопросы и вести открытые беседы.',
        'Discussions is the central space for your community to share announcements, ask questions, and host conversations.': 'Обсуждения — это центральное место в вашем сообществе, где можно делиться объявлениями, задавать вопросы и вести беседы.',
        'Discussions is the space for your community to have conversations, ask questions and post answers without opening issues.': '«Обсуждения» — это площадка, где участники вашего сообщества могут общаться, задавать вопросы и публиковать ответы, не создавая новых задач.',
        'Dismiss suggestions': 'Отклонить предложения',
        'Dismiss for this repository only': 'Отклонить только для этого репозитория',
        'Dismiss for all repositories': 'Отклонить для всех репозиториев',
        'Display a "Sponsor" button': 'Отображение кнопки «Спонсор»',
        'Documentation': 'Документация',
        "doesn't have any public repositories yet": "ещё не имеет публичных репозиториев",
        'Download': 'Скачать',
        'Download CSV': 'Скачать CSV',
        'Download PNG': 'Скачать PNG',
        'Download raw file': 'Скачать исходный файл',
        'Download template': 'Скачать шаблон',
        'Drag additional files here to add them to your repository': 'Перетащите дополнительные файлы сюда, чтобы добавить их в репозиторий.',
        'Drag files here to add them to your repository': 'Перетащите файлы сюда, чтобы добавить их в ваш репозиторий',
        'Earned achievements': 'Заработанные достижения',
        'Edit file...': 'Редактировать файл...',
        'Edit message': 'Редактировать сообщение',
        'Edit mode:': 'Режим редактирования:',
        'Edit repository details': 'Изменить детали репозитория',
        'Edit this file': 'Редактировать этот файл',
        'Email notifications': 'Уведомления по электронной почте',
        'email settings': 'настройки электронной почты',
        'Embed': 'Вставить',
        'Embed this gist in your website.': 'Встройте этот Gist в свой веб-сайт.',
        'Enable Dependabot': 'Включить Dependabot',
        'Enable Discussions to unlock Community Insights!': 'Включите обсуждения, чтобы разблокировать аналитику сообщества!',
        'Enable firewall': 'Включить брандмауэр',
        'Enable release immutability': 'Включить неизменяемость релиза',
        'Enable the dependency graph': 'Включить граф зависимостей',
        'Enabling this makes the list visible only to you.': 'Включение этой функции делает список видимым только для вас.',
        "Enabling this setting will require contributors to sign off on commits made through GitHub’s web interface. Signing off is a way for contributors to affirm that their commit complies with the repository's terms, commonly the": "Включение этой настройки потребует от участников подписания коммитов, сделанных через веб-интерфейс GitHub. Подписание — это способ для участников подтвердить, что их коммит соответствует условиям репозитория, обычно",
        'Engage your community by having discussions right in your repository, where your community already lives': 'Вовлекайте свое сообщество, проводя дискуссии прямо в вашем репозитории, где уже находится ваше сообщество.',
        'Enhance your code review process with GitHub Actions': 'Улучшите процесс проверки кода с помощью GitHub Actions',
        'enhanced security': 'повышенная безопасность',
        'Environment secrets': 'Секреты окружающей среды',
        'Environment variables': 'Переменные окружения',
        'Environments are used by your workflows for deployments.': 'Среды используются вашими рабочими процессами для развертываний.',
        'Errors and warnings': 'Ошибки и предупреждения',
        'Event': 'Событие',
        "Every change is applied automatically. The agent only holds a change back if it's flagged as uncertain.": "Все изменения применяются автоматически. Агент задерживает изменение только в том случае, если оно помечено как неопределённое.",
        'Every suggestion is held for your review. Nothing is applied automatically.': 'Каждая рекомендация отправляется вам на проверку. Ничего не применяется автоматически.',
        'Everyone will be able to comment on this commit once more.': 'Все снова смогут комментировать этот коммит.',
        'Everything assigned to you': 'Все, что вам поручено',
        'Everything mentioning you': 'Все, что касается вас',
        'Exclude': 'Исключить',
        'Existing forks': 'Существующие форки',
        'Explain': 'Объясните',
        'Explore workflows': 'Изучите рабочий процесс',
        'Export SBOM': 'Экспорт SBOM',
        'Extended description': 'Расширенное описание',
        'Failure rate across jobs in this repository for current month': 'Коэффициент отказов по всем заданиям в этом репозитории за текущий месяц',
        'Failed job usage': 'Неудачное использование задания',
        'Features': 'Особенности',
        'Fewest sponsors': 'Меньше всего спонсоров',
        'Feedback': 'Отзывы',
        'File filter': 'Фильтр файлов',
        'File extensions': 'Расширения файлов',
        'Files changed': 'Измененные файлы',
        'files viewed': 'просмотренные файлы',
        'Filter Issues': 'Проблемы с фильтром',
        'Filter options': 'Параметры фильтра',
        'Filter by Actor': 'Фильтр по актеру',
        'Filter by author': 'Фильтровать по автору',
        'Filter by assignees': 'Фильтровать по исполнителям',
        'Filter by Branch': 'Фильтр по ветке',
        'Filter by branch': 'Фильтр по ветке',
        'Filter by extension': 'Фильтровать по расширению',
        'Filter by ecosystem': 'Фильтровать по экосистеме',
        'Filter by Event': 'Фильтр по событию',
        'Filter by job status': 'Фильтр по статусу работы',
        'Filter by milestone': 'Фильтровать по этапу',
        'Filter by label': 'Фильтровать по метке',
        'Filter by owner': 'Фильтровать по владельцу',
        'Filter by period': 'Фильтровать по периоду',
        'Filter by project': 'Фильтровать по проекту',
        'Filter by reviews': 'Фильтровать по отзывам',
        'Filter by repository type': 'Фильтровать по типу репозитория',
        'Filter by Status': 'Фильтр по статусу',
        'Filter by status': 'Фильтр по статусу',
        "Filter by who’s assigned": "Фильтр по назначенному лицу",
        'Filter by Workflow': 'Фильтр по рабочему процессу',
        'Find a release': 'Найти релиз',
        'Find file': 'Найти файл',
        'Find someone to sponsor': 'Найдите спонсора',
        'Fund the work of developers and projects you depend on.': 'Финансируйте работу разработчиков и проектов, от которых вы зависите.',
        'Finish your review': 'Завершите свой отзыв',
        'Findings': 'Результаты',
        'Find code, projects, and people on GitHub:': 'Поиск кода, проектов и людей на GitHub:',
        'Fiscal Host': 'Фискальный хост',
        'Fiscal host project profile URL': 'URL профиля проекта финансового хоста',
        'For security reasons, you cannot change the visibility of a fork.': 'По соображениям безопасности вы не можете изменить настройки видимости форка.',
        'Fork': 'Форк',
        'fork': 'Форк',
        'Fork this repository and edit the file': 'Сделайте форк этого репозитория и отредактируйте файл',
        'Forks': 'Форки',
        'forks':'Форков',
        'Forks of other forks': 'Форки других форков',
        'forked from': 'форк от',
        'Full automation': 'Полная автоматизация',
        'Full control': 'Полный контроль',
        'General settings': 'Общие настройки',
        'Generate release notes': 'Создать примечания к выпуску',
        'Get organized with issue templates': 'Организуйтесь с помощью шаблонов выпусков',
        "Get Sponsored": "Спонсорская поддержка",
        'Get started with Discussions': 'Начните работу с обсуждениями',
        'Get started with GitHub Actions': 'Начните работу с GitHub Actions',
        'Get tips, technical guides, and best practices. Twice a month.': 'Получайте советы, технические руководства и лучшие практики. Два раза в месяц.',
        'Git clones': 'Клоны Git',
        'Git LFS usage in archives is billed at the same rate as usage with the client.': 'Использование Git LFS в архивах оплачивается по той же ставке, что и использование с клиентом.',
        'GitHub Apps': 'Приложения GitHub',
        'GitHub Apps augment and extend your workflows on GitHub with commercial, open source, and homegrown tools.': 'Приложения GitHub дополняют и расширяют ваши рабочие процессы на GitHub с помощью коммерческих, открытых и собственных инструментов.',
        'GitHub Archive Program': 'Программа архивирования GitHub',
        'GitHub Channel on YouTube': 'Канал GitHub на YouTube',
        'GitHub Pages': 'Страницы GitHub',
        'GitHub Pages is currently disabled.\n          Select a source below to enable GitHub Pages for this repository.': 'GitHub Pages в настоящее время отключен.\n          Выберите источник ниже, чтобы включить GitHub Pages для этого репозитория.',
        'GitHub Sponsors profile': 'Профиль GitHub Sponsors',
        'GitHub will always send alerts to partners for detected secrets in public repositories.': 'GitHub всегда будет отправлять партнерам уведомления об обнаруженных секретах в общедоступных репозиториях.',
        'Give contributors issue templates that help you cut through the noise and help them push your project forward.': 'Предоставьте участникам шаблоны задач, которые помогут вам избавиться от лишней информации и продвинуть ваш проект.',
        'Give feedback': 'Оставить отзыв',
        'Go from code to commit faster on any project.': 'Переходите от кода к фиксации быстрее в любом проекте.',
        'Go to rulesets': 'Перейти к наборам правил',
        'Go to rulesets to create new tag rules': 'Перейдите в набор правил, чтобы создать новые правила тегов.',
        'guide on deploy keys': 'руководство по развертыванию ключей',
        "has no activity yet for this period": "пока не имеет активности за этот период",
        "has no activity yet for this period.": "пока не имеет активности за этот период.",
        'Have a project elsewhere?': 'У вас есть проект в другом месте?',
        'Having problems?': 'Есть проблемы?',
        'Helpful resources': 'Полезные ресурсы',
        'Here’s how this project compares to': 'Вот как этот проект сравнивается с',
        'Hide whitespace': 'Скрыть пробелы',
        'High or higher': 'Высокий или выше',
        'Host your own runners and customize the environment used to run jobs in your GitHub Actions workflows.': 'Размещайте собственные программы-раннеры и настраивайте среду, используемую для выполнения заданий в ваших рабочих процессах GitHub Actions.',
        'How can we improve search?': 'Как мы можем улучшить поиск?',
        'How you receive payments': 'Как вы получаете платежи',
        'Identify vulnerabilities and errors with': 'Выявляйте уязвимости и ошибки с помощью',
        'Ignore': 'Игнорировать',
        'Images should be at least 640×320px (1280×640px for best display).': 'Изображения должны иметь размер не менее 640×320 пикселей (1280×640 пикселей для оптимального отображения).',
        'Import a repository': 'Импортировать репозиторий',
        'Import a ruleset': 'Импорт набора правил',
        'Import all the files, including revision history, from another version control system.': 'Импортируйте все файлы, включая историю изменений, из другой системы контроля версий.',
        'Import your project to GitHub': 'Импортируйте свой проект в GitHub',
        'importing git repositories': 'Импорт репозиториев Git',
        'In progress': 'В процессе выполнения',
        'Install from the command line': 'Установка из командной строки',
        'is a copy of a repository. Forking a repository allows you to freely experiment with changes without affecting the original project.': '— это копия репозитория. Разветвление репозитория позволяет свободно экспериментировать с изменениями, не влияя на исходный проект.',
        'is designed to host your personal, organization, or project pages from a GitHub repository.': 'предназначены для размещения ваших личных, организационных или проектных страниц из репозитория GitHub.',
        'If disabled, the Models tab will be hidden, and the prompt editor and comparison tooling evaluations will be unavailable.': 'Если эта функция отключена, вкладка «Модели» будет скрыта, а редактор подсказок и оценки инструментов сравнения будут недоступны.',
        'If restricted, pull requests will still be readable by everyone who can see this repository.': 'Даже в случае ограничения доступа к пул-реквестам они по-прежнему будут доступны для просмотра всем, кто имеет доступ к этому репозиторию.',
        'If you need to, you can also': 'При необходимости вы также можете',
        'Include Git LFS objects in archives': 'Включить объекты Git LFS в архивы',
        'Include in the home page': 'Включить в главную страницу',
        'Include my email address so I can be contacted': 'Включите мой адрес электронной почты, чтобы со мной можно было связаться',
        'Include this code in the': 'Включите этот код в',
        'Increase Contrast': 'Увеличить контраст',
        'In place': 'На месте',
        'Indent mode': 'Режим отступа',
        'Indent size': 'Размер отступа',
        'Insights': 'Статистика',
        'Instantly share code, notes, and snippets.': 'Мгновенно делитесь кодом, заметками и фрагментами кода.',
        'instead.': 'вместо этого.',
        'instead for fine grained control over repositories and': 'вместо этого для более точного управления репозиториями и',
        'Internal': 'Внутренние',
        'Internet access': 'доступ к Интернету',
        "Invest in open source software and we'll track your progress here!": "Инвестируйте в программное обеспечение с открытым исходным кодом, и мы будем отслеживать ваши успехи здесь!",
        'Involves me': 'Это касается меня',
        'Involves user': 'С участием пользователя',
        'Issues integrate lightweight task tracking into your repository. Keep projects on track with issue labels and milestones, and reference them in commit messages.': 'Функция отслеживания задач (issues) интегрирует в ваш репозиторий облегченную систему мониторинга задач. Следите за ходом проектов с помощью меток задач и этапов, а также ссылайтесь на них в сообщениях коммитов.',
        'Issues to include': 'Вопросы, которые следует включить',
        'Issue body actions': 'Выполнить действия с телом выпуска',
        'Issue options': 'Параметры выпуска',
        'Issue templates': 'Шаблоны выпусков',
        'I have read and understand these effects': 'Я прочитал и понимаю эти последствия.',
        'I want to delete this repository': 'Я хочу удалить этот репозиторий',
        'I want to make this repository private': 'Я хочу сделать этот репозиторий приватным',
        'Job failure rate': 'Коэффициент неудач при выполнении заданий',
        'Joined GitHub this month': 'Присоединился к GitHub в этом месяце',
        'Jump to conversation': 'Перейти к разговору',
        'Jump to file': 'Перейти к файлу',
        'Jump to line': 'Перейти к строке',
        'Label issues and pull requests for new contributors': 'Проблемы с метками и запросы на добавление для новых участников',
        'Languages': 'Языки',
        'Largest size': 'Наибольший размер',
        'Last commit date': 'Дата последней фиксации',
        'Last commit message': 'Сообщение последней фиксации',
        'Last pushed': 'Последнее добавление',
        'Last published': 'Последнее опубликование',
        'Last updated': 'Последнее обновление',
        'Last used': 'Последнее использование',
        'Latest deployments from pinned environments': 'Последние развертывания из закрепленных сред',
        'Latest release': 'Последний релиз',
        'Layout': 'Макет',
        'Launch a': 'Запустить',
        'Learn how we count contributions': 'Узнайте, как мы считаем вклады',
        'Learn more': 'Узнать больше',
        'Learn more about': 'Узнайте больше о',
        'Learn more about codespaces...': 'Узнайте больше о кодовых пространствах...',
        'Learn more about configuring a dependabot.yml file': 'Подробнее о настройке файла dependabot.yml',
        'Learn more about configuring the publishing source for your site': 'Узнайте больше о настройке источника публикации для вашего сайта',
        'Learn more about clone URLs': 'Узнайте больше о клонированных URL-адресах',
        'learn more about diff comparisons': 'узнать больше о сравнении различий',
        'Learn more about GitHub Actions': 'Узнайте больше о GitHub Actions',
        'Learn more about GitHub-hosted runners.': 'Узнайте больше о запусках, размещённых на GitHub.',
        'Learn more about getting started with Actions.': 'Узнайте больше о том, как начать работу с Actions.',
        'Learn more about how we use your data.': 'Узнайте больше о том, как мы используем ваши данные.',
        'Learn more about managing caches.': 'Узнайте больше об управлении кэшами.',
        'Learn more about Models.': 'Узнайте больше о моделях.',
        'Learn more about OIDC tokens.': 'Подробнее о токенах OIDC.',
        'Learn more about packages': 'Узнайте больше о пакетах',
        'Learn more about partner patterns': 'Узнайте больше о моделях партнерства',
        'Learn about pull requests': 'Узнайте о запросах на слияние',
        'Learn more about rulesets.': 'Узнайте больше о наборах правил.',
        'Learn more about self-hosted runners': 'Узнайте больше о саморазмещённых раннерах',
        'Learn more about setting up prebuilds': 'Узнайте больше о настройке предварительных сборок',
        'Learn more about signing off on commits': 'Узнайте больше о подписании коммитов',
        'Learn more about template repositories': 'Узнайте больше о репозиториях шаблонов',
        'Learn more about the artifact metadata API': 'Узнайте больше об API метаданных артефактов',
        'Learn more about this setting': 'Узнайте больше об этой настройке',
        'Learn more about using runners': 'Узнайте больше об использовании раннеров',
        'Learn more about the visibility of your GitHub Pages site.': 'Узнайте больше о видимости вашего сайта на GitHub Pages.',
        'learn more here': 'Узнайте больше здесь',
        'Least downloads': 'Наименьшее количество загрузок',
        'Least recently created': 'Наименее недавно созданные',
        'Least used': 'Наименее популярные',
        'Leave fork network': 'Выйти из форка сети',
        'Licenses explain how others can use your code.': 'Лицензии объясняют, как другие могут использовать ваш код.',
        'Limit how many branches and tags can be updated in a single push': 'Ограничить количество ветвей и тегов, которые можно обновить за один раз',
        'Limit open pull requests from users without write access': 'Ограничить количество открытых пул-реквестов от пользователей, не имеющих прав на запись ',
        'Limit to users explicitly granted read or higher access': 'Ограничение доступа только для пользователей, которым явно предоставлен доступ на чтение или выше.',
        'Line chart settings': 'Настройки линейного графика',
        'Line wrap mode': 'Режим переноса строк',
        'Link projects': 'Связанные проекты',
        'Link a project': 'Связать проект',
        'Link a project to this repository': 'Связать проект с этим репозиторием',
        'Link an issue from this repository': 'Связать проблему из этого репозитория',
        'Link artifacts built on GitHub Actions to external registries and environments with the artifact metadata API': 'Связывание артефактов, созданных в GitHub Actions, с внешними реестрами и средами с помощью API метаданных артефактов',
        'Lists make it easier to organize and curate repositories that you have starred.': 'Списки упрощают организацию и курирование репозиториев, которые вы отметили звездочкой.',
        'Lock conversation on this commit': 'Заблокировать обсуждение этого коммита',
        'Lock conversation on this pull request': 'Заблокировать обсуждение этого запроса на извлечение',
        'Lock conversation': 'Заблокировать разговор',
        'locked and limited conversation to collaborators ': 'заблокировал и ограничил доступ к обсуждению только для участников проекта ',
        'Locking the conversation means:': 'Блокировка обсуждения означает:',
        'Machine type': 'Тип машины',
        'Manage account notification settings': 'Управление настройками уведомлений учетной записи',
        'Manage codespaces': 'Управление кодовыми пространствами',
        'Manage Dependabot rules': 'Управление правилами Dependabot',
        'Manage environment secrets': 'Управление секретами среды',
        'Manage environment variables': 'Управление переменными среды',
        'Manage repository vulnerability settings': 'Управление настройками уязвимостей репозитория',
        'Management': 'Управление',
        'Mark this repository as archived and read-only.': 'Пометить этот репозиторий как заархивированный и доступный только для чтения.',
        'Markdown is supported': 'Поддерживается разметка Markdown',
        'Maximum age of results': 'Максимальный срок хранения результатов',
        'Maximum open pull requests per user': 'Максимальное количество открытых запросов на слияние на одного пользователя',
        'MCP configuration': 'MCP конфигурация',
        'Medium or higher': 'Средний или выше',
        'Members of supported fiscal hosts can use their fiscal host to join GitHub Sponsors instead of using a bank account.': 'Участники поддерживаемых фискальных хостов могут использовать своего фискального хоста для участия в GitHub Sponsors вместо использования банковского счета.',
        'Merged': 'Слито',
        'Merging can be performed automatically.': 'Объединение может выполняться автоматически.',
        'Milestone': 'Важная веха',
        'Minimize comments': 'Минимизировать комментарии',
        'Model Context Protocol (MCP)': 'Протокол контекста модели (MCP)',
        'Models in this repository': 'Модели в этом репозитории',
        'Moderation options': 'Параметры модерации',
        'More actions': 'Дополнительные действия',
        'More edit options': 'Дополнительные параметры редактирования',
        'More file actions': 'Дополнительные действия с файлами',
        'More languages...': 'Другие языки...',
        'More list item action bar': 'Дополнительная панель действий элемента списка',
        'More options': 'Дополнительные параметры',
        'More Runner actions': 'Больше действий actions',
        'More Runner list item actions': 'Дополнительные действия со списком actions',
        'More workflows': 'Дополнительные рабочие процессы',
        'Most downloads': 'Наибольшее количество загрузок',
        'Most sponsors': 'Больше всего спонсоров',
        'Most starred': 'Наиболее популярные',
        'Most used': 'Самые используемые',
        'Mirror': 'Зеркало',
        'My contributions': 'Мои вклады',
        'My repositories': 'Мои репозитории',
        'My forks': 'Мои форки',
        'Narrow your search': 'Сузить поиск',
        'Needs setup': 'Требуется настройка',
        'Network graph': 'Сетевой график',
        'New': 'Новый',
        'New branch ruleset': 'Новый набор правил для ветки',
        'New conversation in': 'Новый разговор в',
        'New draft security advisory': 'Новый проект рекомендаций по безопасности',
        'New environment': 'Новая среда',
        'New milestone': 'Новая веха',
        'New pull request': 'Новый запрос на слияние',
        'New runner': 'Новый раннер',
        'New release': 'Новый выпуск',
        'New repository secret': 'Новый секретный репозиторий',
        'New repository variable': 'Новая переменная репозитория',
        'New ruleset': 'Новый набор правил',
        'New self-hosted runner': 'Новый саморазмещённый раннер',
        'New tag ruleset': 'Новый набор правил для тегов',
        'New with options...': 'Новое с опциями...',
        'New workflow': 'Новый рабочий процесс',
        'Never be notified.': 'Никогда не получать уведомления.',
        'Newest Sponsors profile': 'Новые профили Sponsors',
        'No codespaces': 'Нет кодовых пространств',
        'No commits history': 'Нет истории коммитов',
        'No conflicts with base branch': 'Нет конфликтов с базовой веткой',
        'No contributors': 'Нет участников',
        'No conversations yet': 'Пока нет разговоров',
        'No description, website, or topics provided.': 'Описание, веб-сайт и темы не указаны.',
        'No forked repositories found': 'Не найдено ни одного форкнутого репозитория',
        'No labels': 'Нет этикеток',
        'No maximum': 'Без ограничения',
        'No new commits to fetch. Enjoy your day!': 'Новых коммитов для загрузки нет. Хорошего дня!',
        'No new commits yet. Enjoy your day!': 'Новых коммитов пока нет. Хорошего дня!',
        'No one has forked this repository yet': 'Пока что никто не создал форк этого репозитория.',
        'No open projects': 'Нет открытых проектов',
        'No open project templates': 'Нет открытых шаблонов проектов',
        'No packages published': 'Нет опубликованных пакетов',
        'No projects': 'Нет проектов',
        'No projects found': 'Проекты не найдены',
        'No projects were found': 'Проекты не найдены',
        'No releases published': 'Нет опубликованных релизов',
        'No repositories matched your search.': 'Ни один репозиторий не соответствует вашему запросу.',
        'No results': 'Нет результатов',
        'No reviews': 'Нет отзывов',
        'No rules yet': 'Пока нет правил',
        'No rulesets set up for automated reviews': 'Не настроены наборы правил для автоматических проверок',
        'No saved views': 'Сохранённые просмотры отсутствуют',
        'No secrets found.': 'Секретов не найдено.',
        'No security policy detected': 'Политика безопасности не обнаружена',
        'No attestations': 'Свидетельств нет',
        'No table data available yet.': 'Данные таблицы пока недоступны.',
        'No users can bypass the open pull request limit': 'Ни один пользователь не может обойти ограничение на количество открытых пулл-реквестов',
        'No users found': 'Пользователи не найдены',
        'No wrap' : 'Без переноса',
        'None yet': 'Пока нет',
        'Not subscribed': 'Не подписан',
        'Not reviewed by you': 'Не проверено вами',
        'Notified of all notifications on this repository.': 'Уведомления обо всей активности в этом репозитории.',
        'Notifications': 'Уведомления',
        'Notifications you save will appear here to read later.': 'Сохраненные уведомления появятся здесь, чтобы вы могли прочитать их позже.',
        'Nothing to show': 'Нечего показать',
        'Nothing to preview': 'Нет предварительного просмотра',
        'Number of comments': 'Количество комментариев',
        'Number of commits per week': 'Количество коммитов в неделю',
        'Number of results': 'Количество результатов',
        'OIDC configuration': 'Настройка OIDC',
        'Off-topic': 'Не по теме',
        'Oldest Sponsors profile': 'Старые профили Sponsors',
        'Once you delete a repository, there is no going back. Please be certain.': 'После удаления репозитория возвратных действий не будет. Пожалуйста, будьте уверены в своем решении.',
        'Only collaborators can create PRs': 'Создавать PR могут только участники проекта',
        'Only critical': 'Только критические',
        'Only errors': 'Только ошибки',
        'Only high confidence changes are applied automatically. Everything else is held for your review.': 'Автоматически применяются только изменения с высокой степенью уверенности. Всё остальное отправляется вам на проверку.',
        "Only receive notifications from this repository when participating or @mentioned.": "Получать уведомления из этого репозитория только при участии или упоминании (@).",
        'Only users who are both new on GitHub and who have never had a commit or pull request merged into this repository will require approval to run workflows.': 'Только пользователи, которые являются новыми на GitHub и никогда не имели коммитов или пул-реквестов, объединенных в этом репозитории, потребуют одобрения для запуска рабочих процессов.',
        'Only users who have never had a commit or pull request merged into this repository will require approval to run workflows.': 'Только пользователи, которые никогда не выполняли коммиты или не отправляли запросы на слияние в этот репозиторий, будут нуждаться в одобрении для запуска рабочих процессов.',
        'Open': 'Открыто',
        'Open a pull request': 'Открыть запрос на слияние',
        'Open a pull request to contribute your changes upstream.': 'Откройте запрос на слияние, чтобы внести свои изменения в основной репозиторий.',
        'Open an issue': 'Создать заявку',
        'Open diff view settings': 'Открыть настройки просмотра различий',
        'Open in a codespace': 'Открыть в кодовом пространстве',
        'Open in GitHub Copilot app': 'Открыть в приложении GitHub Copilot',
        'Open issues and pull requests': 'Открытые вопросы и запросы на извлечение',
        'Open symbols on click': 'Открыть символы при нажатии',
        'Open symbols panel': 'Открыть панель символов',
        'Open with...': 'Открыть с...',
        'Opened this pull request': 'Открыл этот пулл-реквест',
        'Operator': 'Оператор',
        'Organization permissions': 'Разрешения организации',
        'Other tools': 'Другие инструменты',
        'Other users': 'Другие пользователи',
        'Other users **can’t add new comments** to this commit.': 'Другие пользователи **не могут добавлять новые комментарии** к этому коммиту.',
        'our docs': 'нашей документации',
        'Owns this repository': 'Владелец этого репозитория',
        'Participating and @mentions': 'Участие и @упоминания',
        'Paste, drop, or click to add files': 'Вставьте, перетащите или щелкните, чтобы добавить файлы',
        'Performance metrics': 'Показатели эффективности',
        'Pick a branch or recent commit': 'Выберите ветку или последнюю фиксацию',
        'Planning': 'Планирование',
        'Please enter your credentials if required for cloning your remote repository.': 'Введите свои учетные данные, если они требуются для клонирования удаленного репозитория.',
        'Please try a different search query.': 'Попробуйте другой поисковый запрос.',
        'Policy': 'Политика',
        'Popular content': 'Популярный контент',
        'Prebuild configuration': 'Конфигурация предварительной сборки',
        'Prebuild configurations speed up Codespace creations significantly by pre-executing all the tasks required to build your development environment.': 'Предварительно скомпилированные конфигурации значительно ускоряют создание Codespace, заранее выполняя все задачи, необходимые для построения вашей среды разработки.',
        'Presented when merging a pull request with merge.': 'Представляется при слиянии запроса на извлечение с помощью merge.',
        'Presented when merging a pull request with squash.': 'Представляется при слиянии запроса на извлечение с squash.',
        'Preserve this repository': 'Сохранить этот репозиторий',
        'Projects are a customizable, flexible tool for planning and tracking your work.': 'Проекты — это настраиваемый гибкий инструмент для планирования и отслеживания вашей работы.',
        "Projects on GitHub are created at the repository owner's level (organization or user) and can be linked to a repository's Projects tab. Projects are suitable for cross-repository development efforts such as feature work, complex product roadmaps or even Issue triage.": "Проекты на GitHub создаются на уровне владельца репозитория (организации или пользователя) и могут быть привязаны к вкладке «Проекты» репозитория. Проекты подходят для межрепозиторийных разработок, таких как реализация новых функций, разработка сложных дорожных карт продукта или даже сортировка задач.",
        'Propose': 'Предложить',
        'Propose changes': 'Предложить изменения',
        'protected branches': 'защищенные ветви',
        'Protected tags': 'Защищенные теги',
        'Protected tags have been deprecated': 'Защищенные теги устарели',
        'Protection rules': 'Правила защиты',
        'Provide feedback': 'Оставить отзыв',
        'Provide quick access to relevant projects.': 'Обеспечить быстрый доступ к соответствующим проектам.',
        'Provider': 'Поставщик',
        'Public gists are visible to everyone.': 'Публичные Gists видны всем.',
        'Public wikis will still be readable by everyone.': 'Публичные вики-сайты по-прежнему будут доступны для чтения всем пользователям.',
        'Publish release': 'Опубликовать релиз',
        'Pull request limits': 'Ограничения на пул-реквесты',
        'Pull request options': 'Параметры запроса на слияние',
        'Pull request permissions': 'Права доступа к пул-реквестам',
        'Pull request successfully merged and closed': 'Запрос на слияние успешно выполнен и закрыт.',
        'Pull request template': 'Шаблон запроса на извлечение',
        'Pull request title': 'Название запроса на извлечение',
        'Pull request title and commit details': 'Название запроса на извлечение и детали фиксации',
        'Pull request title and description': 'Название и описание запроса на извлечение',
        'Pull Requests': 'Запросы на извлечение',
        'Pull requests allow others to suggest changes to your repository.': 'С помощью пулл-реквестов другие пользователи могут предлагать изменения в ваш репозиторий.',
        'Pull requests to include': 'Запросы на добавление изменений',
        'Pull requests help you collaborate on code with other people. As pull requests are created, they’ll appear here in a searchable and filterable list. To get started, you should': 'Запросы на извлечение помогают вам совместно работать над кодом с другими людьми. По мере создания запросов на извлечение они будут появляться здесь в списке, который можно просматривать и фильтровать. Чтобы начать работу, вам необходимо',
        'Push protection': 'Защита от толчков',
        'Pushes': 'Толчки',
        'Pushes will be rejected if they attempt to update more than this.': 'Попытки обновления, превышающие этот объем, будут отклонены.',
        'Qualifier': 'Квалификатор',
        'Queued': 'В очереди',
        'Raw file content': 'Содержание исходного файла',
        'Re-run job': 'Повторить задание',
        'Re-run all jobs': 'Повторно запустить все задания',
        'Reason for locking': 'Причина блокировки',
        'Read and write permissions': 'Права на чтение и запись',
        'Read repository contents and packages permissions': 'Чтение содержимого репозитория и прав доступа к пакетам',
        'Ready-to-use runners managed by GitHub.': 'Готовые к использованию репозитории, управляемые GitHub.',
        'READMEs can be used as longer descriptions.': 'README-файлы могут использоваться в качестве более подробных описаний.',
        'Rebase and merge': 'Ребазирование и слияние',
        'Recent': 'Недавнее',
        'Recent Commits': 'Недавние коммиты',
        'Recent tagged image versions': 'Последние версии образов с тегами',
        'Recently created': 'Недавно созданные',
        'Recommended allowlist': 'Рекомендуемый белый список',
        'recommended community standards': 'рекомендуемые стандарты сообщества',
        'Refresh Dependabot alerts': 'Обновить оповещения Dependabot',
        'Referring sites': 'Сайты-источники переходов',
        'Related topics': 'Связанные темы',
        'Release': 'Выпуск',
        'Release - Beta': 'Выпуск - Бета-версия',
        'Release title': 'Название выпуска',
        'Release notes': 'Примечания к выпуску',
        'Releases': 'Релизы',
        'released this': 'выпустил это',
        'Relevance': 'Релевантность',
        'Repository name': 'Название репозитория',
        'Repository owner ': 'Владелец репозитория ',
        'repository rules': 'правила хранилища',
        'Repository secrets': 'Секреты репозитория',
        'Repository variables': 'Переменные репозитория',
        "Repositories contain a project's files and version history.": "Репозитории содержат файлы проекта и историю версий.",
        'Repositories with at least 1 star': 'Репозитории с рейтингом не менее 1 звезды',
        'Repositories with push activity': 'Репозитории с активностью push-уведомлений',
        'Repositories with no push activity': 'Репозитории без активности push-уведомлений',
        'Reporting': 'Отчетность',
        'Report repository': 'Репозиторий отчетов',
        'Require actions to be pinned to a full-length commit SHA': 'Требовать, чтобы действия были привязаны к полному SHA коммита',
        'Require approval for all external contributors': 'Требовать одобрения для всех внешних участников',
        'Require approval for first-time contributors': 'Требовать одобрение для новых авторов',
        'Require approval for first-time contributors who are new to GitHub': 'Требовать одобрение для новых участников, которые впервые используют GitHub',
        'Require contributors to sign off on web-based commits': 'Требовать от участников подписания веб-коммитов',
        'Required fields are marked with an asterisk (*).': 'Обязательные поля отмечены звездочкой (*).',
        'Request up to 15 reviewers': 'Запросить до 15 рецензентов',
        'Resolved': 'Решено',
        'Restrict editing to collaborators only': 'Ограничить редактирование только для соавторов',
        'Restrict how many pull requests users without write access can have open at one time and add specific users to a bypass list. These settings stay in effect until you change them.': 'Ограничьте количество открытых пул-реквестов, которые могут иметь одновременно пользователи без прав на запись, и добавьте определённых пользователей в список исключений. Эти настройки будут действовать до тех пор, пока вы их не измените.',
        'Restrict users who are permitted to approve or request changes on pull requests in this repository.': 'Ограничьте круг пользователей, которым разрешено утверждать или запрашивать изменения в пул-реквестах в этом репозитории.',
        'Resources for your codespace': 'Ресурсы для вашего кодового пространства',
        'Review changes': 'Просмотр изменений',
        'Review in codespace': 'Обзор в кодовом пространстве',
        'Review required': 'Требуется проверка',
        'Reviews': 'Отзывы',
        'Reviewers': 'Рецензенты',
        'Reviewed': 'Проверено',
        'Reviewed by you': 'Проверено вами',
        'Routine, clear-cut changes are applied automatically. Anything with ambiguity is held for review.': 'Автоматически применяются рутинные и однозначные изменения. Любые неоднозначные случаи отправляются на проверку.',
        'Rule': 'Правило',
        'Rules': 'Правила',
        'Rulesets': 'Набор правил',
        'Run details': 'Подробности запуска',
        'Runner type': 'Тип раннера',
        'Runners available to this repository': 'Доступные для этого репозитория средства запуска',
        'Runtime OS': 'Операционная система выполнения',
        'Safely publish packages, store your packages alongside your code, and share your packages privately with your team.': 'Безопасно публикуйте пакеты, храните их вместе с кодом и делитесь ими в частном порядке со своей командой.',
        'Save changes': 'Сохранить изменения',
        'Save draft': 'Сохранить черновик',
        'Save MCP configuration': 'Сохранить конфигурацию MCP',
        'Save page': 'Сохранить страницу',
        'Search Gists': 'Поиск Gists',
        'Search in this owner': 'Поиск по этому владельцу',
        'Search in this repository': 'Поиск в этом репозитории',
        'Search this repository': 'Поиск в этом репозитории',
        'Secret': 'Секрет',
        'Secret gists are hidden by search engines but visible to anyone you give the URL to.': 'Секретные Gists скрываются поисковыми системами, но видны всем, кому вы предоставите URL-адрес.',
        'Secret Protection': 'Секретная защита',
        'Secret scanning': 'Скрытое сканирование',
        'Secret scanning alerts': 'Уведомления о секретном сканировании',
        'Secret type': 'Секретный тип',
        'Secrets and variables': 'Секреты и переменные',
        'Secrets are not passed to forks.': 'Секреты не передаются форкам.',
        'Security': 'Безопасность',
        'Security and quality': 'Безопасность и качество',
        'Security Advisories': 'Рекомендации по безопасности',
        'Security alerts': 'Предупреждения о безопасности',
        'Security overview': 'Обзор безопасности',
        'Security policy': 'Политика безопасности',
        'See pricing': 'Ознакомьтесь с ценами',
        'Select a country or region': 'Выберите страну или регион',
        "Select a verified email address for us to contact you about your GitHub Sponsors profile. This will not be shared publicly. You can manage verified email addresses in your": "Выберите подтвержденный адрес электронной почты, по которому мы сможем связаться с вами по поводу вашего профиля GitHub Sponsors. Он не будет публиковаться. Вы можете управлять подтвержденными адресами электронной почты в своем",
        'Select branch': 'Выберите ветвь',
        'Select commit': 'Выберите фиксацию',
        'Select events you want to be notified of in addition to participating and @mentions.': 'Выберите события, о которых вы хотите получать уведомления, в дополнение к участию и упоминаниям (@).',
        'Select language': 'Выберите язык',
        'Select order': 'Выберите заказ',
        'Select sort view': 'Выберите вид сортировки',
        'Select tag': 'Выберите тег',
        'Select the alert severity level for code scanning check runs to fail.': 'Выберите уровень серьезности предупреждения для сбоев проверки сканирования кода.',
        'Select type': 'Выберите тип',
        'Select visibility': 'Выберите видимость',
        'Self-hosted runners are virtual machines for GitHub Actions workflows that you manage and maintain outside of GitHub.': 'Самостоятельно размещаемые исполнители — это виртуальные машины для рабочих процессов GitHub Actions, которыми вы управляете и которые обслуживаете вне GitHub.',
        'Service Providers': 'Поставщики услуг',
        'Set how much control the agent has to apply changes': 'Определяет, какой объём контроля агент имеет при применении изменений',
        'Set milestone': 'Установить веховой показатель',
        'Set as a pre-release': 'Установить как предварительную версию',
        'Set up a security policy': 'Настройте политику безопасности',
        'set up a workflow yourself': 'настройте рабочий процесс самостоятельно',
        'Set up discussions': 'Настройте обсуждения',
        'Set up prebuilds': 'Настройка предварительных сборок',
        'Set up prebuild': 'Настройка сборки',
        'Set up sponsor button': 'Настроить кнопку спонсора',
        'Set up templates': 'Настройка шаблонов',
        'Share': 'Поделиться',
        'Share a deep link': 'Поделиться глубокой ссылкой',
        'Show all changes': 'Показать все изменения',
        'Show changes since your last review': 'Показать изменения с момента последнего просмотра',
        'Show data labels': 'Показать метки данных',
        'Show description for': 'Показать описание для',
        'Show comments': 'Показать комментарии',
        'Show code folding buttons': 'Показать кнопки сворачивания кода',
        'Show labels for each data point in line chart.': 'Показать метки для каждой точки данных на линейном графике.',
        'Show labels for each data point in column and bar charts.': 'Показать метки для каждой точки данных в столбчатых и гистограммах.',
        'Showing caches from all workflows.': 'Отображаются кэши из всех рабочих процессов.',
        'Showing runs from all workflows': 'Показ запусков из всех рабочих процессов',
        'Sign off and commit changes': 'Подпишите и зафиксируйте изменения',
        'Signed-off-by': 'Подписано',
        'Skip this and': 'Пропустите это и',
        'Skipped': 'Пропущено',
        'Smallest size': 'Наименьший размер',
        'Social preview': 'Социальный просмотр',
        'Soft wrap' : 'Мягкий перенос',
        'Source': 'Источник',
        'Spaces': 'Пробелы',
        'Spam': 'Спам',
        'Split': 'Разделение',
        'Sponsor multiple maintainers in one easy transaction.': 'Спонсируйте нескольких сопровождающих одним простым транзакцией.',
        'Sponsor this project': 'Спонсируйте этот проект',
        'Sponsorships help your community know how to financially support this repository.': 'Спонсорская помощь помогает вашему сообществу узнать, как финансово поддержать этот репозиторий.',
        'Squash and merge': 'Сжатие и объединение',
        'Stale issue handler': 'Обработчик устаревших запросов',
        'Star': 'Звезда',
        'star': 'Звезда',
        'Star repositories on GitHub to keep track of your favorite projects and inspirational code.': 'Добавляйте репозитории в избранное на GitHub, чтобы следить за любимыми проектами и вдохновляющим кодом.',
        'Starred': 'Отмечен звездочкой',
        'Stargazers': 'Звездочёты',
        'Star lists': 'Списки звёзд',
        'Start setup': 'Начать установку',
        'Start a codespace from a template and get to developing with the power of a virtual machine in the cloud.': 'Запустите кодовое пространство из шаблона и приступайте к разработке с помощью мощной виртуальной машины в облаке.',
        'Start a codespace with Copilot agent mode for this issue in another repository.': 'Запустите кодовое пространство с режимом агента Copilot для этой проблемы в другом репозитории.',
        'Starred gists': 'Избранные Gists',
        'Submit feedback': 'Отправить отзыв',
        'Submit review': 'Отправить отзыв',
        'Subject claim': 'Утверждение Subject',
        'Subscribed': 'Подписано',
        'Successful': 'Успешный',
        'Suggest a policy': 'Предложить политику',
        'Suggest a security policy': 'Предложить политику безопасности',
        'Suggested for this repository': 'Предлагается для этого репозитория',
        'Suggested workflows': 'Рекомендуемые рабочие процессы',
        'Suggestions': 'Предложения',
        'Summary': 'Резюме',
        'supported secrets': 'поддерживаемые секреты',
        'Switch branches/tags': 'Переключение ветвей/тегов',
        'Switch to tree view': 'Перейти к дереву',
        'Tabs': 'Табуляция',
        'Tags': 'Теги',
        'tags': 'теги',
        'Take a break, write some code, do what you do best.': 'Сделайте перерыв, напишите код, займитесь тем, что у вас получается лучше всего.',
        'Template repository': 'Хранилище шаблонов ',
        'Template repositories let users generate new repositories with the same directory structure and files.': 'Хранилища шаблонов позволяют пользователям создавать новые хранилища с той же структурой каталогов и файлами.',
        'Temporary interaction restrictions': 'Временные ограничения на взаимодействие',
        'Temporarily restrict which external users can interact with your repository (comment, open issues, or create pull requests) for a configurable period of time.': 'Временно ограничьте круг внешних пользователей, которые могут взаимодействовать с вашим репозиторием (оставлять комментарии, открывать задачи или создавать пул-реквесты) на настраиваемый период времени.',
        'Test': 'Тест',
        'Timed out': 'Истекло время ожидания',
        'Timeline of the most recent commits to this repository and its network ordered by most recently pushed to.': 'Хронология последних коммитов в этом репозитории и его сети, отсортированная по дате последнего добавления.',
        'that others can see.': 'которые видят другие.',
        'The Actions tab is hidden and no workflows can run.': 'Вкладка «Действия» скрыта, и рабочие процессы не могут выполняться.',
        'The default branch is considered the “base” branch in your repository, against which all pull requests and code commits are automatically made, unless you specify a different branch.': 'По умолчанию ветка считается «базовой» веткой в вашем репозитории, по отношению к которой автоматически выполняются все запросы на извлечение и фиксации кода, если вы не указали другую ветку.',
        'the community profile': 'профиль сообщества',
        'The URL for your source repository': 'URL вашего исходного репозитория',
        'There are no deploy keys for this repository': 'Для этого репозитория нет ключей развертывания.',
        'There are no environments for this repository': 'Для этого репозитория нет сред.',
        'There are no prebuilds configured for this repository': 'Для этого репозитория нет предварительно скомпилированных версий.',
        'There are no runners configured': 'Нет настроенных раннеров',
        "There aren’t any closed security advisories": "Нет никаких закрытых рекомендаций по безопасности",
        "There aren’t any draft security advisories": "Нет никаких проектов рекомендаций по безопасности",
        "There aren't any GitHub Apps installed on this repository.": "В этом репозитории не установлено ни одного приложения GitHub.",
        "There aren't any project templates yet": "Пока нет шаблонов проектов",
        "There aren't any published security advisories": "Опубликованных рекомендаций по безопасности нет.",
        "There aren’t any releases here": "Здесь нет никаких релизов",
        'These branches can be automatically merged.': 'Эти ветви могут быть автоматически объединены.',
        "There isn't any commit history to show here for the selected date range": "Для выбранного диапазона дат нет истории коммитов, которую можно было бы здесь показать.",
        'This account has not applied to join GitHub Sponsors.': 'Эта учетная запись не подала заявку на участие в программе GitHub Sponsors.',
        'This branch is': 'Эта ветвь',
        'This branch is not ahead of the upstream': 'Эта ветвь не опережает основную ветвь',
        'This branch is not behind the upstream': 'Эта ветка не отстает от основной ветки',
        'This branch is up to date with': 'Эта ветка содержит последние изменения из',
        'This branch will be checked out on creation': 'Эта ветка будет проверена при создании.',
        'This repository has been archived.': 'Этот репозиторий был заархивирован.',
        'This environment has no secrets.': 'В этой среде нет секретов.',
        'This environment has no variables.': 'В этой среде нет переменных.',
        'This may be used to force a "cool-down" period during heated discussions or prevent unwanted interactions.': 'Это может быть использовано для принудительного «охлаждения» в ходе горячих дискуссий или предотвращения нежелательных взаимодействий.',
        'This organization has no public members.': 'В этой организации нет публичных членов.',
        'This organization has no public members. You must be a member to see who’s a part of this organization.': 'В этой организации нет открытых участников. Чтобы увидеть, кто входит в эту организацию, необходимо стать её участником.',
        'This repository is currently public.': 'Это хранилище в настоящее время является общедоступным.',
        'This repository is empty.': 'Этот репозиторий пуст.',
        'This repository has no secrets.': 'Это хранилище не имеет секретов.',
        'This repository has no variables.': 'В этом репозитории нет переменных.',
        'To be cloned into your codespace': 'Для клонирования в ваше кодовое пространство',
        'to learn more.': 'чтобы узнать больше.',
        'to prevent a branch from merging when these checks fail.': 'чтобы предотвратить слияние ветки, если эти проверки завершаются с ошибкой.',
        'to run actions on your own servers.': 'для запуска действий на ваших собственных серверах.',
        'to search': 'искать',
        'To see all available qualifiers, see our': 'Чтобы увидеть все доступные квалификаторы, см. нашу',
        'To start building your query add your first filter using the button below.': 'Чтобы начать создание запроса, добавьте первый фильтр с помощью кнопки ниже.',
        'to the main branch of this repository will be unable to interact with the repository.': 'в основную ветвь этого репозитория не смогут взаимодействовать с репозиторием.',
        'to this commit.': 'к этому коммиту.',
        'to this repository': 'к этому репозиторию',
        'Too heated': 'Слишком горячий',
        'Top Committers': 'Лучшие коммиттеры',
        'Tools': 'Инструменты',
        'Total downloads': 'Общее количество скачиваний',
        'Total duration': 'Общая продолжительность',
        'Total issue count': 'Общее количество выпусков',
        'Total job runs': 'Общее количество запусков заданий',
        'Total minutes': 'Общее количество минут',
        'Total minutes used across failed jobs in this repository for current month': 'Общее количество минут, использованных для неудачных заданий в этом репозитории за текущий месяц',
        'Total minutes across all workflows in this repository for current month': 'Общее количество минут по всем рабочим процессам в этом репозитории за текущий месяц',
        'Total job runs across all workflows in this repository for current month': 'Общее количество заданий во всех рабочих процессах в этом репозитории за текущий месяц',
        'Track artifacts from build through deployment': 'Отслеживание артефактов от сборки до развертывания',
        'Track this repository’s': 'Отслеживать этот репозиторий',
        'Traffic': 'Трафик',
        'Transfer': 'Передача',
        'Transfer ownership': 'Передача права собственности',
        'Try adjusting your search filters.': 'Попробуйте настроить фильтры поиска.',
        'Try a different search query.': 'Попробуйте другой поисковый запрос.',
        'Try changing your filters, or search for': 'Попробуйте сменить фильтры или выполнить поиск по',
        'Turning on the activity overview will show an overview of your activity across organizations and repositories.': 'Включение обзора активности покажет обзор вашей активности по организациям и репозиториям.',
        'Turning off private contributions will show only public activity on your profile.': 'Отключение приватных вкладов будет показывать только публичную активность в вашем профиле.',
        'Turning on private contributions will show anonymized private activity on your profile.': 'Включение приватных вкладов будет показывать анонимизированную приватную активность в вашем профиле.',
        'Turning off the activity overview will hide the section on your profile.': 'Отключение обзора активности скроет этот раздел в вашем профиле.',
        'Unexpected bad things will happen if you don’t read this!': 'Если вы не прочитаете это, произойдут неожиданные неприятности!',
        'Unique Visitors': 'Уникальные посетители',
        'Unified': 'Единый',
        'Unknown': 'Неизвестно',
        'Unlink this repository from the fork network and make it standalone.': 'Отсоедините этот репозиторий от сети форков и сделайте его автономным.',
        'Unlock conversation on this commit': 'Разблокировать обсуждение этого коммита',
        'Unlock conversation': 'Разблокировать разговор',
        'Unlocking the conversation means:': 'Разблокировка обсуждения означает:',
        'Unpin': 'Открепить',
        'Unprovisioned': 'Неразвернутое',
        'Unstar': 'Убрать звезду',
        'Unsubscribe': 'Отписаться',
        'Unwatch': 'Не отслеживать',
        'Update public gist': 'Обновить общедоступный гист',
        'Upload an image to customize your repository’s social media preview.': 'Загрузите изображение, чтобы настроить предварительный просмотр вашего репозитория в социальных сетях.',
        'Upload files': 'Загрузить файлы',
        'Usage metrics': 'Показатели использования',
        'Use a bank account to receive your sponsorships. Note: If you use a personal bank account, your country may tax your GitHub Sponsors payouts as personal income.': 'Используйте банковский счет для получения спонсорских средств. Примечание: если вы используете личный банковский счет, ваша страна может облагать налогом выплаты от GitHub Sponsors как личный доход.',
        'Use a password-protected SSH key.': 'Используйте защищенный паролем ключ SSH.',
        'use an SSH key to grant readonly or write access to a single repository.\n    They are not protected by a passphrase and can be a security risk if your server is compromised.\n    If you have a complex project or want more fine-grain control over permissions, consider using': 'используйте SSH-ключ для предоставления доступа только для чтения или записи к одному репозиторию.\n    Они не защищены парольной фразой и могут представлять угрозу безопасности в случае компрометации вашего сервера.\n    Если у вас сложный проект или вам нужен более тонкий контроль над разрешениями, рассмотрите возможность использования',
        'Use Milestones to create collections of Issues and Pull Requests for a particular release or project.': 'Используйте этапы для создания коллекций проблем и запросов на извлечение для конкретного выпуска или проекта.',
        'Use saved searches to filter your results more quickly': 'Используйте сохраненные поиски, чтобы быстрее фильтровать результаты',
        'Use unique line styles (dashed, dotted, etc.) to differentiate lines in charts.': 'Используйте уникальные стили линий (пунктирные, точечные и т. д.) для различения линий на графиках.',
        'Use your password': 'Используйте свой пароль',
        'Used by': 'Используется',
        'Users listed here can open pull requests regardless of the configured limit.': 'Пользователи, указанные в этом списке, могут создавать пул-реквесты независимо от установленного ограничения.',
        'Users that are not': 'Пользователи, которые не являются',
        'Users that have not previously': 'Пользователи, которые ранее не',
        'Users that have recently created their account will be unable to interact with the repository.': 'Пользователи, которые недавно создали свою учетную запись, не смогут взаимодействовать с репозиторием.',
        'Validate Registries': 'Проверка реестров',
        'Validity': 'Действительность',
        'Value': 'Значение',
        'View all branches': 'Посмотреть все ветви',
        'View all tags': 'Посмотреть все теги',
        'View all repositories': 'Просмотреть все репозитории',
        'View advanced search syntax': 'Просмотреть синтаксис расширенного поиска',
        'View as table': 'Просмотр в виде таблицы',
        'View detected secrets': 'Просмотреть обнаруженные секреты',
        'View existing forks.': 'Просмотреть существующие форки.',
        'View file': 'Просмотреть файл',
        'View fork': 'Просмотр форка',
        'View larger runner docs': 'Просмотреть увеличенные документы для раннеров',
        'View license': 'Посмотреть лицензию',
        'View logs': 'Просмотреть журналы',
        'View options': 'Параметры просмотра',
        'View security advisories': 'Просмотреть рекомендации по безопасности',
        'View workflow file': 'Просмотреть файл рабочего процесса',
        'View workflow run': 'Просмотр запуска рабочего процесса',
        'View your gists': 'Просмотреть ваши Gists',
        'Viewed': 'Просмотрено',
        'Visitors': 'Посетители',
        'Visibility': 'Видимость',
        'Vulnerability alerts': 'Предупреждения об уязвимостях',
        'Waits for merge requirements to be met and then merges automatically.': 'Ожидает выполнения требований слияния, а затем выполняет слияние автоматически.',
        'Watch': 'Отслеживать',
        'We haven’t found any dependents for this repository yet.': 'Мы пока не нашли никаких зависимых элементов для этого репозитория.',
        'We read every piece of feedback, and take your input very seriously.': 'Мы читаем каждый отзыв и очень серьезно относимся к вашим комментариям.',
        'We recommend using': 'Мы рекомендуем использовать',
        'Welcome to pull requests!': 'Добро пожаловать в pull-запросы!',
        'Welcome to the GitHubRussianTranslation wiki!': 'Добро пожаловать на вики-сайт GitHubRussianTranslation!',
        "We’ll keep looking!": "Мы будем продолжать поиски!",
        'What are codespaces?': 'Что такое коды?',
        'What is': 'Что такое',
        'When creating source code archives, you can choose to include files stored using Git LFS in the archive.': 'При создании архивов исходного кода вы можете выбрать включение в архив файлов, хранящихся с помощью Git LFS.',
        'When enabled, only users explicitly granted access to this repository will be able to submit pull request reviews that "approve" or "request changes". All users able to submit comment pull request reviews will continue to be able to do so.': 'Если эта функция включена, только те пользователи, которым явно предоставлен доступ к данному репозиторию, смогут оставлять отзывы на пул-реквесты с отметками «одобрить» или «запросить изменения». Все пользователи, имеющие право оставлять комментарии к пул-реквестам, по-прежнему смогут это делать.',
        "When merging pull requests, you can allow any combination of merge commits, squashing, or rebasing.\n        At least one option must be enabled.\n        If you have linear history requirement enabled on any protected branch, you must enable squashing or rebasing.": "При слиянии запросов на извлечение вы можете разрешить любую комбинацию коммитов слияния, сжатия или перебазирования.\n        Должен быть включен как минимум один вариант.\n        Если на любой защищенной ветке включено требование линейной истории, вы должны включить сжатие или перебазирование.",
        'Whenever linked pull requests have merged, auto-close the issue.': 'При слиянии связанных запросов на извлечение автоматически закрывайте проблему.',
        'Whenever there are new changes available in the base branch, present an “update branch” option in the pull request.': 'Всякий раз, когда в базовой ветке появляются новые изменения, предлагайте в запросе на слияние опцию «обновить ветку».',
        'Which remote URL should I use?': 'Какой удаленный URL мне следует использовать?',
        'while you wait?': 'пока вы ждете?',
        'With a GitHub Enterprise account, you can restrict access to your GitHub Pages site by publishing it privately. You can use privately published sites to share your internal documentation or knowledge base with members of your enterprise. You can try GitHub Enterprise risk-free for 30 days.': 'С учетной записью GitHub Enterprise вы можете ограничить доступ к своему сайту GitHub Pages, опубликовав его в приватном режиме. Вы можете использовать приватные сайты для обмена внутренней документацией или базой знаний с участниками вашего предприятия. Вы можете попробовать GitHub Enterprise без риска в течение 30 дней.',
        'with access': 'с доступом',
        'Wiki': 'Вики',
        'Wikis': 'Вики',
        'Wikis host documentation for your repository.': 'Вики-сайты хранят документацию для вашего репозитория.',
        "Wikis provide a place in your repository to lay out the roadmap of your project, show the current status, and document software better, together.": "Вики-страницы предоставляют место в вашем репозитории, где можно совместно разработать план проекта, отобразить текущий статус и лучше документировать программное обеспечение.",
        'will not be able to interact with the repository.': 'не смогут взаимодействовать с репозиторием.',
        'Work fast with our official CLI.': 'Работайте быстро с помощью нашего официального CLI.',
        'Workflow file for this run': 'Файл рабочего процесса для этого запуска',
        'Workflow permissions': 'Разрешения для рабочего процесса',
        'Workflow run options': 'Параметры запуска рабочего процесса',
        'workflow runs': 'запусков рабочих процессов',
        'Workflows have read and write permissions in the repository for all scopes.': 'Рабочие процессы имеют права на чтение и запись в репозитории для всех областей.',
        'Workflows have read permissions in the repository for the contents and packages scopes only.': 'Рабочие процессы имеют права на чтение в репозитории только для контента и пакетов.',
        'Wrap lines': 'Линии обёртывания',
        'Write Beta Release comment': 'Написать комментарий о бета-версии',
        'Writing contributing guidelines': 'Руководство по написанию статей',
        'You and other collaborators': 'Вы и другие участники',
        'You and other collaborators with access to this repository **can still leave comments** that others can see.': 'Вы и другие участники с доступом к этому репозиторию **все еще можете оставлять комментарии**, которые видят другие.',
        'You are creating a fork in your personal account.': 'Вы создаете форк в своем личном аккаунте.',
        'You are creating a public repository in your personal account.': 'Вы создаете общедоступный репозиторий в своей личной учетной записи.',
        'You can allow setting pull requests to merge automatically once all required reviews and status checks have passed.': 'Вы можете разрешить автоматическое слияние запросов на извлечение после прохождения всех необходимых проверок и проверок статуса.',
        'You can always lock this commit again in the future.': 'Вы всегда сможете снова заблокировать этот коммит в будущем.',
        'You can always unlock this commit again in the future.': 'Вы всегда сможете снова разблокировать этот коммит в будущем.',
        'You can change how you receive notifications from your account settings.': 'Вы можете изменить способ получения уведомлений в настройках своего аккаунта.',
        "You can create a release to package software, along with release notes and links to binary files, for other people to use. Learn more about releases in": "Вы можете создать релиз, чтобы скомпилировать программное обеспечение, а также подготовить примечания к релизу и ссылки на бинарные файлы, чтобы другие пользователи могли ими воспользоваться. Подробнее о релизах читайте в",
        'You choose who can see and commit to this repository.': 'Вы выбираете, кто может просматривать и вносить изменения в этот репозиторий.',
        "You don't have any self-hosted runners for this repository": "У вас нет самостоятельно размещенных раннеров для этого репозитория",
        "You don't directly depend on any repositories whose maintainers can be sponsored.": "Вы не зависите напрямую от каких-либо репозиториев, поддержка которых может спонсироваться.",
        "You don't have any codespaces with this repository checked out": "У вас нет кодовых пространств с этим репозиторием, проверенным",
        "You don't have any forks of this repository.": "У вас нет никаких форков этого репозитория.",
        "You don’t have any starred gists yet.": "У вас еще нет избранных Gists.",
        "You don’t have any starred repositories yet.": "У вас еще нет репозиториев с отметкой «Избранное».",
        "You don't have workflows on any of your organization repositories.": "У вас нет рабочих процессов ни в одном из репозиториев вашей организации.",
        'You have unread notifications': 'У вас есть непрочитанные уведомления',
        'You have unsaved changes on this file that can be restored.': 'В этом файле есть несохраненные изменения, которые можно восстановить.',
        "You haven't created any rulesets": "Вы не создали ни одного набора правил",
        "You haven't sponsored anyone yet.": 'Вы еще никого не спонсировали.',
        'Your access token or password for your source repository': 'Ваш токен доступа или пароль для исходного репозитория',
        'Your branches': 'Ваши ветви',
        'Your codespaces': 'Ваши кодовые пространства',
        'Your codespace will run in the selected region': 'Ваше кодовое пространство будет работать в выбранном регионе.',
        'Your new repository details': 'Детали вашего нового репозитория',
        'Your public gists will show up here on your profile.': 'Ваши публичные Gists будут отображаться здесь, в вашем профиле.',
        'Your source repository details': 'Данные вашего исходного репозитория',
        'Your username for your source repository': 'Ваше имя пользователя для исходного репозитория',
        'Your workspaces in the cloud': 'Ваши рабочие пространства в облаке',

        // Ветки
        'Active': 'Активный',
        'Ahead': 'Впереди',
        'All activity': 'Вся активность',
        'Behind': 'Позади',
        'Branch creations': 'Создание веток',
        'Branch deletions': 'Удаление веток',
        'Branch menu': 'Меню ветви',
        'Check status': 'Проверить статус',
        'Choose from this fork or its upstream repository.': 'Выберите этот форк или его исходный репозиторий.',
        'Create new branch': 'Создать новую ветвь',
        'Copy branch name to clipboard': 'Копировать название ветки в буфер обмена',
        'Copy to clipboard': 'Скопировать в буфер обмена',
        'Default': 'По умолчанию',
        'Delete branch': 'Удалить ветвь',
        'Direct pushes': 'Прямые пуши',
        'Force pushes': 'Принудительные пуши',
        'New branch': 'Новая ветвь',
        'New branch name': 'Название новой ветки',
        'No branches': 'Нет веток',
        'No branches match the search': 'Ни одна ветвь не соответствует поиску',
        'No activity matched your search.': 'Поисковый запрос не дал результатов',
        'Merge queue merges': 'Слияния из очереди слияний',
        'Pull request': 'Запрос на извлечение',
        'Pull request merges': 'Слияние пулл-реквестов',
        'Rename branch': 'Переименовать ветвь',
        'Share feedback about this page': 'Оставьте свой отзыв об этой странице',
        'Showing most recent first': 'Показать сначала самые последние ',
        'Showing oldest first': 'Показать сначала самые старые',
        'Stale': 'Просроченный',
        'Switch branches': 'Переключить ветки',
        'Try expanding your search by selecting a different branch, activity type, user, or timeframe.': 'Попробуйте расширить поиск, выбрав другую ветку, тип деятельности, пользователя или период времени.',
        'View activity for all branches': 'Просмотреть активность по всем веткам',
        'View activity for all users': 'Просмотреть активность всех пользователей',
        'View rules': 'Просмотреть правила',
        'Yours': 'Ваш',

        // Проекты
        'Admin': 'Администратор',
        'Add a new column to the board': 'Добавить новый столбец на доску',
        'Add item': 'Добавить элемент',
        'Add field': 'Добавить поле',
        'Add status update': 'Добавить обновление статуса',
        'Add your first item': 'Добавьте свой первый товар',
        'Advanced Move...': 'Расширенное перемещение...',
        'All gists': 'Все Gists',
        'All languages': 'Все языки',
        'All new and existing items from the selected source will be added to this project.': 'Все новые и существующие элементы из выбранного источника будут добавлены в этот проект.',
        'Archive': 'Архив',
        'Archive all': 'Архивировать все',
        "Archive items from a project view and they'll be shown here.": "Архивируйте элементы из представления проекта, и они будут отображаться здесь.",
        'Archived items': 'Архивные элементы',
        'Assignees column options': 'Параметры столбца «Исполнители»',
        'Back to GitHub': 'Вернуться на GitHub',
        'Board': 'Доска',
        'Bulk import items': 'Массовый импорт товаров',
        'By default, new issues created from this project are added to this repository.': 'По умолчанию новые задачи, созданные в рамках этого проекта, добавляются в этот репозиторий.',
        'Can see and make changes to this project.': 'Может просматривать и вносить изменения в этот проект.',
        'Can see, make changes to, and add new collaborators to this project.': 'Может просматривать, вносить изменения и добавлять новых участников в этот проект.',
        'Can see this project.': 'Можно посмотреть этот проект.',
        'Change the order in which custom fields appear on project items and in field lists.': 'Изменить порядок отображения настраиваемых полей в элементах проекта и в списках полей.',
        'Choose a registry': 'Выберите реестр',
        'Click "Add Item" to get started or use the shortcut': 'Нажмите «Добавить элемент», чтобы начать, или воспользуйтесь ярлыком.',
        'Close project': 'Закрыть проект',
        'Close this project': 'Закрыть этот проект',
        'Closing a project will disable its workflows & remove it from the list of open projects.': 'Закрытие проекта приведет к отключению его рабочих процессов и удалению из списка открытых проектов.',
        'Color': 'Цвет',
        'Column': 'Колонка',
        'Column by': 'Колонки',
        'Count': 'Считать',
        'Create a gist': 'Создать Gist',
        'Create list': 'Создать список',
        'Create new item or add existing item': 'Создать новый элемент или добавить существующий элемент',
        'Create project': 'Создать проект',
        'Create your first GitHub project': 'Создайте свой первый проект GitHub',
        'Create your first list': 'Создайте свой первый список',
        'Custom fields': 'Пользовательский поля',
        'Custom field options': 'Параметры настраиваемых полей',
        'Date fields': 'Поля даты',
        'Dates': 'Даты',
        'Danger zone': 'Опасная зона',
        'Delete all': 'Удалить все',
        'Delete project': 'Удалить проект',
        'Delete this project': 'Удалить этот проект',
        'Default repository': 'Репозиторий по умолчанию',
        'Duplicate view': 'Дубликат просмотра',
        'Edit option': 'Опция редактирования',
        'Edit project name': 'Изменить название проекта',
        'Field name': 'Название поля',
        'Field settings…': 'Настройки поля…',
        'Field sum': 'Сумма полей',
        'Field type': 'Тип поля',
        'Fields': 'Поля',
        'Filter by values…': 'Фильтровать по значениям...',
        'Filter by type or state…': 'Фильтровать по типу или состоянию...',
        'Edit details': 'Редактировать детали',
        'Export view data': 'Экспорт данных просмотра',
        'Invite': 'Пригласить',
        'Invite collaborators': 'Пригласить сотрудников',
        'Item': 'Пункт',
        'Items': 'Предметы',
        'Generate chart': 'Создать диаграмму',
        'Get started with GitHub Packages': 'Начните работу с GitHub Packages',
        'GitHub Docs': 'Документация GitHub',
        'Got it!': 'Понял!',
        'Group by': 'Группировать по',
        'Group by values': 'Группировать по значениям',
        'Hide field': 'Скрыть поле',
        'Hide from view': 'Скрыть из вида',
        'Hidden fields': 'Скрытые поля',
        'Label text': 'Текст метки',
        'Linked pull requests': 'Связанные запросы на извлечение',
        'Linked pull requests column options': 'Параметры столбца связанных запросов на извлечение',
        'Lists': 'Списки',
        'Make a copy': 'Сделать копию',
        'Make a copy of this project.': 'Сделайте копию этого проекта.',
        'Manage access': 'Управление доступом',
        'Markers': 'Маркеры',
        'Month': 'Месяц',
        'Most stars': 'Большинство звезд',
        'Move': 'Переместить',
        'Move item before': 'Переместить элемент перед',
        'Move left': 'Переместиться влево',
        'Move right': 'Переместиться вправо',
        'Move selected item': 'Переместить выбранный элемент',
        'Name ascending (A-Z)': 'Имя по возрастанию',
        'Name descending (Z-A)': 'Имя по убыванию',
        'New field': 'Новое поле',
        'New table': 'Новая таблица',
        'Newest': 'Самые новые',
        'No archived items': 'Нет заархивированных элементов',
        'No grouping': 'Без группировки',
        'No slicing': 'Без нарезки',
        'No sorting': 'Без сортировки',
        'No start date': 'Дата начала не указана',
        'No target date': 'Целевая дата отсутствует',
        'OK, dismiss': 'Хорошо, отклонить',
        'Oldest': 'Самый старый',
        'Options': 'Опции',
        'Once you delete a project, there is no going back. Please be certain.': 'После удаления проекта его невозможно будет восстановить. Пожалуйста, будьте уверены в своем решении.',
        'Only those with access to this project can view it.': 'Только те, кто имеет доступ к этому проекту, могут его просматривать.',
        'Open field actions for Status': 'Открыть действие в поле «Статус»',
        'Open field actions for Sub-issues progress': 'Открытые действия по продвижению подвопросов',
        'Open field actions for Todo': 'Открытые действия для «Todo»',
        'Open field actions for In Progress': 'Открытые действия для «В процессе»',
        'Open field actions for Done': 'Открытые действия для «Done»',
        'Parent issue': 'Родительская проблема',
        'Position': 'Позиция',
        'Private project': 'Частный проект',
        'Project details': 'Детали проекта',
        'Project name': 'Название проекта',
        'Read': 'Читать',
        'Recently active': 'Недавно активные',
        'Recently starred': 'Недавно снялся',
        'Recently viewed': 'Недавно просматриваемые',
        'Rename view': 'Переименовать вид',
        'Remove': 'Удалить',
        'Remove option': 'Удалить опцию',
        'Reorder fields': 'Изменить порядок полей',
        'Reorder custom fields': 'Изменить порядок пользовательских полей',
        'Save changes to new view': 'Сохранить изменения в новом представлении',
        'Scroll to previous date range': 'Перейти к предыдущему диапазону дат',
        'Scroll to next date range': 'Перейти к следующему диапазону дат',
        'Select column': 'Выбрать столбец',
        'Set limit': 'Установить лимит',
        'Slice by': 'Срез по',
        'Sort ascending': 'Сортировать по возрастанию',
        'Sort descending': 'Сортировать по убыванию',
        'Sort by': 'Сортировать по',
        'Sort by: Most stars': 'Сортировать по: Больше всего звезд',
        'Sort by: Recently active': 'Сортировать по: Недавно активные',
        'Sort by: Recently starred': 'Сортировать по: Недавно добавленные',
        'Short description': 'Краткое описание',
        'Show date fields': 'Показать поля даты',
        'Show numerical value': 'Показать числовое значение',
        'Single select': 'Один выбор',
        'Slice by values': 'Разделить по значениям',
        'Start date': 'Дата начала',
        'Start from scratch': 'Начать с нуля',
        'Start with a powerful spreadsheet style table to filter, sort and group your issues and pull requests. Easily switch to a board or roadmap layout at any time.': 'Начните с удобной таблицы в стиле электронных таблиц для фильтрации, сортировки и группировки задач и запросов на слияние. В любой момент вы можете легко переключиться на формат доски или дорожной карты.',
        'Starred repositories': 'Репозитории с отметкой «Избранное»',
        'Starred topics': 'Избранные темы',
        'Status column options': 'Параметры столбца «Статус»',
        'Status field settings': 'Настройки поля статуса',
        'Sub-issues progress': 'Прогресс по подвопросам',
        'Sub-issues progress column options': 'Параметры столбца прогресса подзадач',
        'Sub-issues progress field settings': 'Настройки поля прогресса подзадач',
        'Swimlanes': 'Дорожки',
        'Table': 'Таблица',
        'Target date': 'Целевая дата',
        "There aren't any archived items": "Нет никаких заархивированных элементов",
        "There aren't any projects yet": "Пока нет проектов",
        'This is the left-most column': 'Это крайний левый столбец.',
        'This is the right-most column': 'Это крайний правый столбец.',
        'This project is currently private.': 'Этот проект в настоящее время является частным.',
        'Title column options': 'Параметры столбца заголовка',
        'Truncate titles': 'Сокращенные названия',
        'Type: All': 'Тип: Все',
        'View more options': 'Посмотреть другие варианты',
        'Visible fields': 'Видимые поля',
        'Visible in group headers and value pickers': 'Отображается в заголовках групп и средствах выбора значений',
        'Welcome to Roadmap!': 'Добро пожаловать в Roadmap!',
        "What’s new": "Что нового?",
        'Who has access': 'Кто имеет доступ',
        'You don’t have any gists yet.': 'У вас еще нет никаких идей.',
        'You choose who can read, write, and admin this project.': 'Вы выбираете, кто может читать, писать и администрировать этот проект.',
        'Your project needs at least one date or iteration field to get started.': 'Для запуска вашего проекта необходимо как минимум одно поле даты или итерации.',

        // Задачи
        "Abuse": "Злоупотребление",
        "Add existing issue": "Добавить существующую проблему",
        "Add parent": "Добавить родителя",
        "added": "добавлен",
        "AND": "И",
        "An owner of this repository has limited the ability to comment to users that are collaborators on this repository.": "Владелец этого репозитория ограничил возможность оставлять комментарии только пользователям, которые являются соавторами этого репозитория.",
        "Apply labels to this issue": "Применить метки к этой проблеме",
        "Archived": "Архивированные",
        "Are you sure you want to delete view Untitled view?": "Вы уверены, что хотите удалить представление «Без названия»?",
        "as": "как",
        "Assignee": "Исполнитель",
        "Assign yourself": "Назначьте себя",
        "Assigned to me": "Назначено мне",
        "Base": "База",
        "Best match": "Лучшее совпадение",
        "Blocked by": "Заблокировано",
        "Blocking": "Блокирует",
        "Build powerful views to keep track of work": "Создавайте мощные представления для отслеживания работы",
        "Change icon and color": "Изменить значок и цвет",
        'Clone issue': 'Проблема с клонированием',
        "Close as completed": "Закрыть как завершенное",
        "Close as duplicate": "Закрыть как дубликат",
        "Close as not planned": "Закрыть, как не планировалось",
        "closed this": "закрыл это",
        "Closed date": "Дата закрытия",
        "Closed reason": "Причина закрытия",
        "Closest due date": "Ближайший срок",
        "Code with agent mode": "Код с режимом агента",
        "Comment count": "Количество комментариев",
        "Commenter": "Комментатор",
        "Commit SHA": "Хеш коммита",
        "completed": "завершенный",
        "Create a branch": "Cоздать ветвь",
        "create a branch": "создать ветвь",
        "Create a milestone": "Создать веху",
        "Create sub-issue": "Создать подзадачу",
        "Created by me": "Создано мной",
        "Created on": "Создано",
        "Create view": "Создать представление",
        "Creation date": "Дата создания",
        "Delete issue": "Удалить проблему",
        "Delete revision": "Удалить ревизию",
        "Delete view": "Удалить вид",
        "Done, closed, fixed, resolved": "Выполнено, закрыто, исправлено, решено",
        "Draft": "Черновик",
        "Duplicate": "Дубликат",
        "Duplicate of another issue": "Дубликат другой проблемы",
        "Duplicate issue": "Дубликат проблемы",
        "edited by": "под редакцией",
        'Edit issue title': 'Изменить название задачи',
        "Edit labels": "Редактировать метки",
        "Edit view": "Редактировать вид",
        "Edits": "Изменения",
        "Fewest issues": "Наименьшее количество проблем",
        "Field": "Поле",
        "for this issue or link a pull request.": "для этой проблемы или добавьте ссылку запрос на слияние.",
        "Furthest due date": "Самый поздний срок",
        "Group assignees": "Группа назначенных лиц",
        "Head": "Головная ветка",
        "Hide": "Скрыть",
        "Icon": "Значок",
        "In": "В",
        "Interactions count": "Количество взаимодействий",
        "Involves": "Участвует",
        "Is": "Это",
        "Issue body actions": "Действия с текстом сообщения",
        "Label": "Метка",
        "Least complete": "Наименее полный",
        'Least Recently Updated': 'Последнее обновление',
        "Link a branch, pull request, or": "Связать ветку, запрос на слияние или",
        "Linked": "Связано",
        "Mark as blocked by": "Пометить как заблокированное",
        "Mark as blocking": "Пометить как блокирующее",
        "Mentioned": "Упомянуто",
        "Mentions": "Упоминания",
        "Merge date": "Дата слияния",
        "Milestone": "Важная веха",
        "More actions": "Дополнительные действия",
        "Most complete": "Наиболее полный",
        "Most issues": "Большинство вопросов",
        "Most recent": "Последние",
        'New view': 'Новый вид',
        "No assignees": "Нет правопреемников",
        "No branches or pull requests": "Никаких ветвей или запросов на слияние",
        'No fields configured for issues without a type.': 'Для задач без типа не настроено ни одного поля.',
        "No milestone": "Нет контрольной точки",
        "No milestones were found": "Не найдено контрольной точки",
        "No one": "Никто",
        "No one assigned": "Никто не назначен",
        "No pull requests or branches were found": "Не найдено ни одного запроса на слияние или ветки",
        "No type": "Без типа",
        'No views yet': 'Пока нет просмотров',
        "Only receive notifications from this issue when you have participated or have been @mentioned.": "Получайте уведомления по этой теме только в том случае, если вы участвовали в ней или были в ней упомянуты (@).",
        "opened": "открытый",
        "OR": "ИЛИ",
        "Order": "Порядок",
        "Organization": "Организация",
        "Outdated": "Устаревший",
        "Parent issue": "Родительская проблема",
        "Pin issue": "Проблема с булавкой",
        "Project": "Проект",
        "Query": "Запрос",
        "Reaction count": "Количество реакций",
        "React": "Реакции",
        "Reactions": "Реакции",
        "Recent activity": "Недавняя активность",
        'Recently Updated': 'Недавно обновлено',
        "Receive all notifications from this issue.": "Получать все уведомления по этой проблеме.",
        "Reference in a new issue": "Ссылка в новом выпуске",
        "Relationships": "Отношения",
        "Repository": "Репозиторий",
        "Reverse alphabetical": "Обратный алфавитный порядок",
        "Review requested": "Запрошена проверка",
        "Review state": "Состояние проверки",
        "Reviewed by": "Проверено",
        'Save a search as a view. Views are visible to everyone with repository access.': 'Сохраните поиск в качестве представления. Представления доступны всем пользователям, имеющим доступ к репозиторию.',
        "Save view": "Сохранить представление",
        "Saved views menu": "Меню сохраненных видов",
        "Select a repository": "Выберите репозиторий",
        "Select assignees": "Выбрать назначенных лиц",
        "Select code repository": "Выберите репозиторий кода",
        "Select projects": "Выбрать проекты",
        'Selected labels': 'Выбранные метки',
        "self-assigned this": "самостоятельно назначил это",
        "Semantic search": "Семантический поиск",
        "Sort": "Сортировка",
        "State": "Состояние",
        "Status": "Статус",
        "Sub-issue": "Подзадача",
        "Successfully merging this pull request may close these issues.": "Успешное слияние этого запроса на извлечение может закрыть эти проблемы.",
        "Team": "Команда",
        "Team review requested": "Запрошена проверка команды",
        'There are no projects linked to this repository yet.': 'Пока к этому репозиторию не привязано ни одного проекта.',
        "This conversation has been locked and limited to collaborators.": "Этот разговор был заблокирован и ограничен для участников проекта.",
        "Title": "Название",
        "Total comments": "Всего комментариев",
        "Total reactions": "Общее количество реакций",
        "Transfer issue": "Проблема перевода",
        "Try searching with a different query for results.": "Попробуйте выполнить поиск с другим запросом.",
        "Type": "Тип",
        "Update date": "Дата обновления",
        "User": "Пользователь",
        "User review requested": "Запрошена проверка пользователя",
        "Views": "Просмотры",
        "Viewing edit": "Просмотр редактирования",
        "Won't fix, can't repro, stale": "Не исправляется, не воспроизводится, устарело",
        "You are assigned to and commented on this issue": "Вы назначены ответственным за эту проблему и прокомментировали ее.",
        "You do not have permissions to close this issue": "У вас нет прав для закрытия этой проблемы.",
        "You haven’t created any Milestones.": "Вы не создали ни одного этапа.",
        "You will only be notified for events selected from the list below. If you participate or are @mentioned you will be subscribed.": "Вы будете получать уведомления только о событиях, выбранных из приведенного ниже списка. Если вы участвуете в событии или вас упомянули с помощью @, вы будете подписаны на него.",
        "You're not receiving notifications from this thread.": "Вы не получаете уведомления из этой ветки.",
        "You're receiving notifications because you're subscribed to this thread.": "Вы получаете уведомления, потому что подписаны на эту ветку.",

        // Запросы
        'advanced search': 'расширенный поиск',
        'Ask admin for access': 'Обратиться к администратору за доступом',
        'Assigned': 'Назначено',
        'Assigned to nobody': 'Никому не назначено',
        'All commits': 'Все коммиты',
        'all of GitHub': 'весь GitHub',
        'Build, test, and deploy your code right from GitHub.': 'Создавайте, тестируйте и развертывайте свой код прямо из GitHub.',
        'Changes since your last review': 'Изменения, произошедшие с момента вашего последнего обзора',
        'Checkout with GitHub CLI': 'Проверка с помощью GitHub CLI',
        'Checkout with GitHub Desktop': 'Открыть в GitHub Desktop',
        'Codespace repository configuration': 'Настройка репозитория Codespace',
        "created": "создал",
        'Close Copilot panel': 'Закрыть панель Copilot',
        'Close side panel': 'Закрыть боковую панель',
        'Closed with unmerged commits': 'Закрыто с необъединенными коммитами',
        "edited": "отредактировал",
        'Filter by organization or owner': 'Фильтровать по организации или владельцу',
        'Finish your comments': 'Завершите комментарии',
        'Finish your review': 'Завершите обзор',
        'GitHub Actions make it easy to automate all your software workflows, now with world-class CI/CD.': 'GitHub Actions упрощает автоматизацию всех ваших программных рабочих процессов, теперь с помощью CI/CD мирового класса.',
        'Learn about draft PRs': 'Узнайте о проектах PR',
        'Least commented': 'Наименее комментируемые',
        'Least recently updated': 'Наименее недавно обновленные',
        'Most commented': 'Наиболее комментируемые',
        'Most reactions': 'Большинство реакций',
        "(most recent)": "(последнее)",
        "most recent": "последнее",
        'No previous review found': 'Предыдущих отзывов не найдено',
        'Only manifest files': 'Только файлы манифеста',
        "Only receive notifications from this pull request when you have participated or have been @mentioned.": "Получать уведомления от этого запроса на слияние только когда вы участвовали или вас упомянули (@mentioned).",
        "Open an in-progress pull request without asking for formal review or risking an unwanted merge. When you're ready for code review, you can mark your draft pull request as ready for review, which will request reviews from any code owners.": "Откройте незавершенный запрос на слияние, не запрашивая официального рецензирования и не рискуя нежелательным слиянием. Когда вы будете готовы к рецензированию кода, вы можете пометить свой черновой запрос на слияние как готовый к рецензированию, что вызовет запрос на рецензирование от всех владельцев кода.",
        'Open comments panel': 'Открыть панель комментариев',
        'Open overview panel': 'Открыть панель обзора',
        'or try an': 'или попробуйте',
        'Organization': 'Организация',
        'Private repositories only': 'Только частные репозитории',
        'Public repositories only': 'Только публичные репозитории',
        'Pull requests with no milestone': 'Запросы на извлечение без вех',
        "Receive all notifications from this pull request.": "Получать все уведомления от этого запроса на слияние.",
        'Recently updated': 'Недавно обновленные',
        'Repository visibility': 'Видимость репозитория',
        'Review changes': 'Просмотр изменений',
        'Review conversations will show up here.': 'Здесь будут отображаться разговоры по поводу обзоров.',
        'Review requests': 'Запросы на проверку',
        'Reference in new issue': 'Ссылка в новом выпуске',
        'Select a range of commits': 'Выбрать диапазон коммитов',
        'Select commits to view': 'Выберите коммиты для просмотра',
        'Still in progress?': 'Все еще в процессе?',
        'Switch to the classic experience': 'Переключитесь на классический режим',
        "Submit general feedback without explicit approval.": "Оставить общий отзыв без явного одобрения.",
        "Submit feedback and approve merging these changes.": "Оставить отзыв и одобрить слияние этих изменений.",
        "Submit feedback suggesting changes.": "Оставить отзыв с предложением изменений.",
        'There aren’t any open pull requests.': 'Открытых запросов на извлечение нет.',
        'This pull request is closed.': 'Этот запрос на извлечение закрыт.',
        'This pull request must be reopened to create new codespaces on it.': 'Этот pull request необходимо снова открыть, чтобы создать на его основе новые codespaces.',
        'Try draft pull requests': 'Попробуйте создать черновики запросов на слияние',
        'Unlabeled': 'Без маркировки',
        'Verified': 'Проверено',
        'Viewed files': 'Просмотренные файлы',
        'View status': 'Просмотреть статус',
        "What's new": "Что нового",
        'You could search': 'Вы можете выполнить поиск',
        "You haven’t reviewed this pull request yet": "Вы еще не просмотрели этот запрос на извлечение",
        "You will only be notified for the events selected from the list below. If you participate or are @mentioned you will be subscribed.": "Вы будете получать уведомления только о событиях, выбранных из списка ниже. Если вы участвуете или вас упомянули (@mentioned), вы будете подписаны.",
        "You're all set — the branch has been merged.": "Всё готово — ветка объединена.",
        'You’re not receiving notifications from this thread.': 'Вы не получаете уведомления из этой ветки.',

        // Кодспейсы
        'Change codespace machine type': 'Изменить тип машины codespace',
        'Choose a template': 'Выберите шаблон',
        'Codespace creation is disabled': 'Создание codespace отключено',
        'Codespace usage for this repository is paid for by': 'Использование codespace для этого репозитория оплачивается',
        'Configure and create codespace': 'Настроить и создать codespace',
        'Configure and manage': 'Настройка и управление',
        'Copilot coding agent': 'Агент кодирования Copilot',
        'Create a new codespace': 'Создать новый codespace',
        'Create codespace': 'Создать codespace',
        'Develop locally': 'Развиваться на местном уровне',
        'Explore quick start templates': 'Изучите шаблоны быстрой настройки',
        'Getting started with GitHub Codespaces': 'Начало работы с GitHub Codespaces',
        'Go to docs': 'Перейти к документам',
        'Learn core concepts': 'Изучите основные концепции',
        'Machine type': 'Тип машины',
        'No changes': 'Нет изменений',
        'Rename codespace': 'Переименовать codespace',
        'Resources for your codespace': 'Ресурсы для вашего codespace',
        'See all': 'Посмотреть все',
        'Show advanced options before launching codespace': 'Показать расширенные настройки перед запуском codespace',
        'Update codespace': 'Обновить codespace',
        'Use this template': 'Используйте этот шаблон',
        'Your instant dev environment': 'Ваша среда для мгновенной разработки',

        // Магазин
        'A catalog and playground of AI models to help you build AI features and products.': 'Каталог и тестовая среда моделей искусственного интеллекта, которые помогут вам создавать функции и продукты на базе ИИ.',
        'A single API key for all models & billing.': 'Один ключ API для всех моделей и биллинга.',
        'Agents': 'Агенты',
        'AI Assisted actions': 'Действия с помощью ИИ',
        'AI Assisted apps': 'Приложения с поддержкой ИИ',
        'All actions': 'Все действия',
        'All apps': 'Все приложения',
        'All creators': 'Все создатели',
        'API management': 'Управление API',
        'API management actions': 'Действия по управлению API',
        'API management apps': 'Приложения для управления API',
        'App guidelines': 'Руководство по приложениям',
        'Audio': 'Аудио',
        'Authorize': 'Авторизовать',
        'Automate workflows': 'Автоматизируйте рабочие процессы',
        'Automate your code review with style, quality, security, and test‑coverage checks when you need them.': 'Автоматизируйте проверку кода с помощью проверок стиля, качества, безопасности и покрытия тестами тогда, когда это необходимо.',
        'Automatically build and test your code as you push it to GitHub, preventing bugs from being deployed to production.': 'Автоматически компилируйте и тестируйте свой код при отправке в GitHub, чтобы не допустить попадания ошибок в производственную среду.',
        'Auxiliary tools to enhance your experience on GitHub': 'Дополнительные инструменты для удобства работы на GitHub',
        'Backup Utilities': 'Утилиты для резервного копирования',
        'Backup Utilities actions': 'Действия утилит резервного копирования',
        'Backup Utilities apps': 'Приложения для резервного копирования',
        'Be the first to review': 'Будьте первым, кто оставит отзыв',
        'Billed monthly': 'Оплачивается ежемесячно',
        'Billed yearly': 'Оплачивается ежегодно',
        'Bring GitHub into your conversations.': 'Включите GitHub в свои беседы.',
        'Boost your workflow': 'Улучшите ваш рабочий процесс',
        'Build on your workflow with apps that integrate with GitHub': 'Расширьте возможности своего рабочего процесса с помощью приложений, интегрированных с GitHub',
        'Buy now': 'Купить сейчас',
        'By': 'От',
        'Cancelled': 'Отменено',
        'Chat': 'Чат',
        'Chat actions': 'Действия в чате',
        'Chat apps': 'Приложения для чата',
        'Chat/completion': 'Чат/завершение',
        'Create applications with GitHub powered by AI Models. Free to use, quick personal setup, and seamless model switching to help you build AI products using the latest models.': 'Создавайте приложения с помощью GitHub, используя модели искусственного интеллекта. Бесплатное использование, быстрая персональная настройка и беспроблемное переключение моделей помогут вам создавать продукты на основе ИИ, используя новейшие модели.',
        'Code quality': 'Качество кода',
        'Code quality actions': 'Действия по обеспечению качества кода',
        'Code quality apps': 'Приложения для проверки качества кода',
        'Code review actions': 'Действия по проверке кода',
        'Code review apps': 'Приложения для проверки кода',
        'Code Scanning Ready': 'Готовность к сканированию кода',
        'Code Scanning Ready actions': 'Действия, готовые к сканированию кода',
        'Code Scanning Ready apps': 'Приложения с функцией сканирования кода',
        'Code search': 'Поиск кода',
        'Code search actions': 'Действия по поиску кода',
        'Code search apps': 'Приложения для поиска кода',
        'Coding': 'Кодирование',
        'Compatibility': 'Совместимость',
        'Configure app': 'Настроить приложение',
        'Contact sales': 'Связаться с отделом продаж',
        'Container CI': 'Контейнер CI',
        'Container CI actions': 'Действия CI контейнера',
        'Container CI apps': 'Контейнерные приложения CI',
        'Continuous integration actions': 'Действия по непрерывной интеграции',
        'Continuous integration apps': 'Приложения непрерывной интеграции',
        'Continuous integration for container applications.': 'Непрерывная интеграция для контейнерных приложений.',
        'Continuous integration for Mobile applications': 'Непрерывная интеграция для мобильных приложений',
        'day trial': 'дневный пробный период',
        'Dependency management': 'Управление зависимостями',
        'Dependency management actions': 'Действия по управлению зависимостями',
        'Dependency management apps': 'Приложения для управления зависимостями',
        'Deployment actions': 'Действия по развертыванию',
        'Deployment apps': 'Приложения для развертывания',
        'Deployment Protection Rules': 'Правила защиты развертывания',
        'Deployment Protection Rules actions': 'Действия по защите развертывания',
        'Deployment Protection Rules apps': 'Приложения для защиты развертывания',
        'Desktop tools': 'Настольные инструменты',
        'Desktop tools actions': 'Действия рабочего стола',
        'Desktop tools apps': 'Приложения для настольных компьютеров',
        'Developer program': 'Программа для разработчиков',
        'Developer tools that are run natively on your local machine.': 'Инструменты разработчика, запускаемые непосредственно на вашем локальном компьютере.',
        'Discover apps': 'Открывайте приложения',
        'Edit settings': 'Изменить настройки',
        'Embeddings': 'Вложения',
        'Eliminate bugs and ship with more confidence by adding these tools to your workflow.': 'Устраняйте ошибки и выпускайте продукты с большей уверенностью, включив эти инструменты в свой рабочий процесс.',
        'Enables custom protection rules to gate deployments with third-party services': 'Позволяет использовать настраиваемые правила защиты для контроля развертываний с использованием сторонних сервисов',
        'Enhanced security': 'Улучшенная безопасность',
        'Ensure your code meets quality standards and ship with confidence.': 'Убедитесь, что ваш код соответствует стандартам качества, и с уверенностью выпускайте его в производство.',
        'Enterprise ready': 'Готово для предприятий',
        'Expired': 'Истекло',
        'Expires': 'Истекает',
        'explore the full model catalog': 'ознакомьтесь с полным каталогом моделей',
        "Extend your software's reach. Localize and translate continuously from GitHub.": "Расширьте охват вашего программного обеспечения. Осуществляйте локализацию и перевод напрямую из GitHub.",
        'Find the right interface to build, debug, and deploy your source code.': 'Найдите подходящий интерфейс для компиляции, отладки и развертывания вашего исходного кода.',
        'Find, fix, and prevent security vulnerabilities before they can be exploited.': 'Выявляйте, устраняйте и предотвращайте уязвимости в системе безопасности, прежде чем ими смогут воспользоваться злоумышленники.',
        'Free forever': 'Бесплатно навсегда',
        'Free plan': 'Бесплатный тариф',
        'Free trial': 'Бесплатная пробная версия',
        'Free to start:': 'Начните бесплатно:',
        'Game CI actions': 'Действия CI в игре',
        'Get it now': 'Получить сейчас',
        'Get insights into how your teams are developing software using GitHub.': 'Узнайте, как ваши команды разрабатывают программное обеспечение с помощью GitHub.',
        'Get the skills you need to level up.': 'Приобретите навыки, необходимые для продвижения по карьерной лестнице.',
        'Get your site ready for production so you can get the word out.': 'Подготовьте свой сайт к запуску, чтобы вы могли рассказать о нем всем.',
        'Get your team and customers the help they need.': 'Обеспечьте своей команде и клиентам необходимую поддержку.',
        'GitHub Marketplace': 'Магазин GitHub',
        'GitHub PAT to install models in your projects.': 'GitHub PAT для установки моделей в ваши проекты.',
        'GitHub Sponsors actions': 'Действия GitHub Sponsors',
        "Here's what we found based on your interests...": "Вот что мы нашли, исходя из ваших интересов...",
        'Helpful': 'Полезно',
        'How it works': 'Как это работает',
        'IDEs actions': 'Действия IDE',
        'IDEs apps': 'Приложения IDE',
        'Inactive': 'Неактивно',
        'Increase productivity': 'Повысьте продуктивность',
        'Input token limit': 'Ограничение по количеству входных токенов',
        'Install this app': 'Установить это приложение',
        'Installation failed': 'Ошибка установки',
        'Instruction': 'Инструкция',
        'Integrated with GitHub': 'Интегрировано с GitHub',
        'Invoice': 'Счёт',
        'Improve your workflow for the small screen.': 'Оптимизируйте рабочий процесс для работы на небольшом экране.',
        'Large context': 'Обширный контекст',
        'Learning': 'Обучение',
        'Learning actions': 'Обучающие действия',
        'Learning apps': 'Обучающие приложения',
        'List your app': 'Разместите своё приложение',
        'List your tool': 'Перечислите ваши инструменты',
        'List your tool on GitHub Marketplace': 'Добавьте свой инструмент в GitHub Marketplace',
        'Localization': 'Локализация',
        'Localization actions': 'Меры по локализации',
        'Localization apps': 'Приложения для локализации',
        'Low latency': 'Низкая задержка',
        'Manage purchases': 'Управление покупками',
        'Marketplace': 'Магазин приложений',
        'Mobile': 'Мобильные',
        'Mobile actions': 'Мобильные действия',
        'Mobile CI': 'Мобильная CI',
        'Mobile CI actions': 'Мобильные CI-действия',
        'Mobile CI apps': 'Мобильные приложения CI',
        'Mobile apps': 'Мобильные приложения',
        'Model switching:': 'Переключение моделей:',
        'Monitor the impact of your code changes. Measure performance, track errors, and analyze your application.': 'Отслеживайте последствия изменений в коде. Измеряйте производительность, отслеживайте ошибки и анализируйте работу приложения.',
        'Monitoring': 'Мониторинг',
        'Monitoring actions': 'Мониторинг действий',
        'Monitoring apps': 'Приложения для мониторинга',
        'More about tools and GitHub Marketplace': 'Подробнее об инструментах и GitHub Marketplace',
        'Multilingual': 'Многоязычный',
        'Multimodal': 'Мультимодальный',
        'Multipurpose': 'Многоцелевой',
        'No charges until you hit our rate limits.': 'Плата не взимается, пока вы не достигнете установленных лимитов.',
        'No reviews yet': 'Пока нет отзывов',
        'Only select repositories': 'Только выбранные репозитории',
        'Open Source management': 'Управление с открытым исходным кодом',
        'Open Source management actions': 'Действия по управлению открытыми источниками',
        'Open Source management apps': 'Приложения для управления с открытым исходным кодом',
        'Optimize your work to minimize impact on the environment.': 'Оптимизируйте свою работу, чтобы свести к минимуму воздействие на окружающую среду.',
        'Order history': 'История заказов',
        'Organize, manage, and track your project with tools that build on top of issues and pull requests.': 'Организуйте, управляйте и отслеживайте свой проект с помощью инструментов, основанных на задачах и запросах на слияние.',
        'out of 5 stars': 'из 5 звёзд',
        'Output token limit': 'Ограничение по количеству выходных токенов',
        'Paid': 'Платные',
        'Paid plan': 'Платный тариф',
        'Payment method': 'Способ оплаты',
        'Per user': 'За пользователя',
        'Pricing & setup': 'Цены и настройка',
        'Pricing guidelines': 'Руководство по ценам',
        'Pricing plan': 'Тарифный план',
        'Pricing plans': 'Тарифные планы',
        'Privacy policy': 'Политика конфиденциальности',
        'Project management': 'Управление проектами',
        'Project management actions': 'Действия по управлению проектами',
        'Project management apps': 'Приложения для управления проектами',
        'Publisher': 'Издатель',
        'Publishing': 'Публикация',
        'Publishing actions': 'Действия по публикации',
        'Publishing apps': 'Публикация приложений',
        'Query, index, or hash the semantics of your source code.': 'Проанализируйте, проиндексируйте или хешируйте семантику вашего исходного кода.',
        'Quick personal setup:': 'Быстрая настройка профиля:',
        'Rating': 'Рейтинг',
        'Ratings': 'Рейтинги',
        'Read reviews': 'Читать отзывы',
        'Reasoning': 'Аргументация',
        'Recently added': 'Недавно добавленные',
        'Recently added apps': 'Недавно добавленные приложения',
        'Refunded': 'Возвращено',
        'Renews': 'Продлевается',
        'Reporting actions': 'Отчет о действиях',
        'Reporting apps': 'Приложения для отчетности',
        'Repository access': 'Доступ к репозиториям',
        'Revenue share': 'Доля дохода',
        'Running open source projects can be hard. Here are some tools to make that process a little more fun and a ton more manageable.': 'Ведение проектов с открытым исходным кодом может быть непростым делом. Вот несколько инструментов, которые помогут сделать этот процесс немного интереснее и значительно упростят его.',
        'Search apps and actions': 'Поиск приложений и действий',
        'Search marketplace': 'Поиск в магазине',
        'Seamless integration': 'Беспроблемная интеграция',
        'Secure and manage your third-party dependencies.': 'Обеспечьте безопасность сторонних зависимостей и управляйте ими.',
        'Security actions': 'Меры безопасности',
        'Security apps': 'Приложения для безопасности',
        'Select a model to get started, or': 'Выберите модель, чтобы начать, или',
        'Select account': 'Выберите аккаунт',
        'Select organization': 'Выберите организацию',
        'Select repositories': 'Выберите репозитории',
        'Servers and tools from the community that connect models to files, APIs, databases, and more.': 'Серверы и инструменты от сообщества, которые обеспечивают связь моделей с файлами, API, базами данных и другими ресурсами.',
        'Starting at': 'Начиная с',
        'Static analysis, dynamic analysis, container scanning, linting, and fuzzing tools that integrate with GitHub Code Scanning SARIF Upload': 'Инструменты статического и динамического анализа, сканирования контейнеров, проверки кода и фаззинга, интегрированные с GitHub Code Scanning и функцией загрузки SARIF',
        'Streamline your code deployment so you can focus on your product.': 'Оптимизируйте процесс развертывания кода, чтобы сосредоточиться на разработке продукта.',
        'Structure your API infrastructure to enable various internet gateways to interact with your service.': 'Структурируйте свою инфраструктуру API таким образом, чтобы различные интернет-шлюзы могли взаимодействовать с вашим сервисом.',
        'Subscription': 'Подписка',
        'Successfully installed': 'Успешно установлено',
        'Summarization': 'Краткое изложение',
        'Support actions': 'Меры поддержки',
        'Support apps': 'Приложения поддержки',
        'Sustainability': 'Устойчивое развитие',
        'Sustainability actions': 'Меры по обеспечению устойчивого развития',
        'Sustainability apps': 'Приложения для устойчивого развития',
        'Switch model': 'Модель переключателя',
        'Team collaboration': 'Командное сотрудничество',
        'Terms of service': 'Условия использования',
        'Testing': 'Тестирование',
        'Testing actions': 'Проверка действий',
        'Testing apps': 'Тестирование приложений',
        'Time tracking': 'Учет рабочего времени',
        'Time tracking actions': 'Действия по отслеживанию времени',
        'Time tracking apps': 'Приложения для отслеживания времени',
        'The latest tools that help you and your team build software better, together.': 'Новейшие инструменты, которые помогут вам и вашей команде совместно создавать более качественное программное обеспечение.',
        'Tools from the community and partners to simplify tasks and automate processes': 'Инструменты от сообщества и партнеров для упрощения задач и автоматизации процессов',
        'Tools that are superpowered with AI (artificial intelligence) to help you be a better developer.': 'Инструменты, оснащенные передовыми технологиями искусственного интеллекта (ИИ), которые помогут вам стать лучшим разработчиком.',
        'Track your progress, and predict how long a task will take based on your coding activity.': 'Отслеживайте свои успехи и прогнозируйте, сколько времени займет выполнение задачи, исходя из вашей активности в программировании.',
        'Trial': 'Пробный период',
        'Trial ends': 'Пробный период заканчивается',
        'Trusted by developers': 'Доверено разработчиками',
        'Try it free': 'Попробовать бесплатно',
        'Try, test, and deploy from a wide range of model types, sizes, and specializations.': 'Пробуйте, тестируйте и внедряйте решения, используя широкий спектр типов, размеров и специализаций моделей.',
        'Understanding': 'Понимание',
        'Uninstall app': 'Удалить приложение',
        'Up to': 'До',
        'Utilities': 'Утилиты',
        'Utilities apps': 'Приложения для утилит',
        'Utilities actions': 'Действия с утилитами',
        'Utilities providing periodic backups of your GitHub data': 'Сервисы, обеспечивающие периодическое резервное копирование ваших данных на GitHub',
        'Verified creator': 'Проверенный создатель',
        'Verified creators': 'Проверенные создатели',
        'View all models': 'Показать все модели',
        'View details': 'Посмотреть детали',
        'Vision': 'Видение',
        'Welcome to GitHub Models': 'Добро пожаловать в GitHub Models',
        'What you get': 'Что вы получаете',
        'Works with': 'Работает с',
        'Write a review': 'Написать отзыв',
        'You have no tools to list on GitHub Marketplace': 'У вас нет инструментов для размещения на GitHub Marketplace',
        'Your apps': 'Ваши приложения',

        // Безопасность и аналитика
        'Access denied': 'Доступ запрещен',
        'Account settings': 'Настройки аккаунта',
        'Active issues': 'Активные задачи',
        'Active pull requests': 'Активные пулл-реквесты',
        'additions': 'добавлений',
        'Advanced Security': 'Расширенная безопасность',
        'AI Assistant': 'AI Ассистент',
        'AI Code Review': 'AI Ревью кода',
        'AI Code Search': 'AI Поиск кода',
        'AI Explanations': 'AI Объяснения',
        'AI Features': 'AI Функции',
        'AI Pair Programmer': 'AI Парный программист',
        'AI Powered': 'На базе ИИ',
        'AI-generated code': 'Код, сгенерированный ИИ',
        'Allow users to privately report potential security vulnerabilities': 'Разрешить пользователям в частном порядке сообщать о потенциальных уязвимостях безопасности',
        'Android app': 'Android приложение',
        'Answer discussions': 'Ответы в обсуждениях',
        'API documentation': 'Документация API',
        'API rate limits': 'Лимиты API',
        'API tokens': 'Токены API',
        'Appearance settings': 'Настройки внешнего вида',
        'Authorized GitHub Apps': 'Авторизованные GitHub Apps',
        'Auto-complete': 'Автозавершение',
        'Automatically detect common vulnerability and coding errors': 'Автоматическое обнаружение распространенных уязвимостей и ошибок кодирования',
        'Bad request': 'Неверный запрос',
        'Billing settings': 'Настройки биллинга',
        'Branch rules': 'Правила веток',
        'Bypassed': 'Пропущено',
        'Campaign': 'Кампания',
        'Chart settings': 'Настройки диаграммы',
        'CI/CD integrations': 'CI/CD интеграции',
        'Closed': 'Закрыто',
        'Closed issues': 'Закрытые задачи',
        'Closed pull requests': 'Закрытые пулл-реквесты',
        'Cloud development': 'Облачная разработка',
        'Code alert': 'Оповещение по коду',
        'Code Completion': 'Автодополнение кода',
        'Code Explanation': 'Объяснение кода',
        'Code generation': 'Генерация кода',
        'Code quality tools': 'Инструменты качества кода',
        'Code Review': 'Ревью кода',
        'Code scanning alerts': 'Предупреждения о сканировании кода',
        'Code scanning alerts •': 'Предупреждения о сканировании кода •',
        'Code scanning is not enabled': 'Сканирование кода не включено',
        'Code scanning helps you find and fix vulnerabilities and coding errors.': 'Сканирование кода помогает находить и исправлять уязвимости и ошибки в коде.',
        'Code search': 'Поиск кода',
        'Code security': 'Безопасность кода',
        'Code Suggestions': 'Предложения кода',
        'CodeQL': 'CodeQL',
        'Codespace settings': 'Настройки Codespace',
        'Commit activity': 'Активность коммитов',
        'Commit rules': 'Правила коммитов',
        'commits': 'коммитов',
        'Community contributions': 'Вклад сообщества',
        'Community discussions': 'Обсуждения сообщества',
        'Community metrics': 'Метрики сообщества',
        'Completed': 'Завершено',
        'Conflict': 'Конфликт',
        'Connected': 'Подключено',
        'Container configuration': 'Конфигурация контейнера',
        'Container registry': 'Реестр контейнеров',
        'Context-aware': 'Контекстно-зависимый',
        'Contextual Code': 'Контекстный код',
        'Copilot': 'Copilot',
        'Copilot Business': 'Copilot Business',
        'Copilot Chat': 'Copilot Чат',
        'Copilot completions': 'Завершения Copilot',
        'Copilot Extensions': 'Расширения Copilot',
        'Copilot metrics': 'Метрики Copilot',
        'Copilot settings': 'Настройки Copilot',
        'Copilot suggestions': 'Предложения Copilot',
        'Copilot telemetry': 'Телеметрия Copilot',
        'Copilot usage': 'Использование Copilot',
        'Copilot Workspace': 'Copilot Workspace',
        'Created': 'Создано',
        'Custom domain': 'Пользовательский домен',
        'Debug': 'Отладка',
        'Define how users should report security vulnerabilities for this repository': 'Определите, как пользователи должны сообщать об уязвимостях безопасности для этого репозитория.',
        'deletions': 'удалений',
        'Dependabot alerts •': 'Оповещения Dependabot •',
        'Dependabot security updates': 'Security-обновления Dependabot',
        'Dependency graph': 'Граф зависимостей',
        'Dependency review': 'Обзор зависимостей',
        'Dev containers': 'Dev контейнеры',
        'Dev environment': 'Среда разработки',
        'Developer settings': 'Настройки разработчика',
        'Developer tools': 'Инструменты разработчика',
        'Disable all Dependabot alerts': 'Отключить все оповещения Dependabot',
        'Disable all Dependabot security updates': 'Отключить все обновления безопасности Dependabot',
        'Disable Dependabot alerts': 'Отключить оповещения Dependabot',
        'Disable Dependabot security updates': 'Отключить обновления безопасности Dependabot',
        'Disable grouped security updates': 'Отключить групповые обновления безопасности',
        'Disable private vulnerability reporting': 'Отключить приватные отчеты об уязвимостях',
        'Disable push protection': 'Отключить защиту при push',
        'Disable push protection for yourself': 'Отключить защиту при push для себя',
        'Disconnected': 'Отключено',
        'Discussion categories': 'Категории обсуждений',
        'Discussion comments': 'Комментарии обсуждений',
        'Discussion threads': 'Ветки обсуждений',
        'during this period.': 'в течение этого периода.',
        'Email preferences': 'Настройки email',
        'Email settings': 'Настройки email',
        'Enable all Dependabot alerts': 'Включить все оповещения Dependabot',
        'Enable all Dependabot security updates': 'Включить все обновления безопасности Dependabot',
        'Enable code scanning': 'Включить сканирование кода',
        'Enable Dependabot alerts': 'Включить оповещения Dependabot',
        'Enable Dependabot security updates': 'Включить обновления безопасности Dependabot',
        'Enable grouped security updates': 'Включить групповые обновления безопасности',
        'Enable private vulnerability reporting': 'Включить приватные отчеты об уязвимостях',
        'Enable security features': 'Включить функции безопасности',
        'Enable vulnerability reporting': 'Включить отчеты об уязвимостях',
        'Enterprise billing': 'Биллинг Enterprise',
        'Enterprise compliance': 'Соответствие Enterprise',
        'Enterprise features': 'Функции Enterprise',
        'Enterprise licensing': 'Лицензирование Enterprise',
        'Enterprise security': 'Безопасность Enterprise',
        'Enterprise settings': 'Настройки Enterprise',
        'Enterprise support': 'Поддержка Enterprise',
        'Error': 'Ошибка',
        'Excluding forks': 'Исключая форки',
        'Failed': 'Не удалось',
        'files changed': 'файлов изменено',
        'Forbidden': 'Запрещено',
        'Get notified when a secret is pushed to this repository': 'Получать уведомления, когда в этот репозиторий добавляется секрет',
        'Get notified when one of your dependencies has a vulnerability': 'Получайте уведомления, когда одна из ваших зависимостей имеет уязвимость',
        'Gist forks': 'Форки Gist',
        'Gist history': 'История Gist',
        'Gist revisions': 'Ревизии Gist',
        'Gist settings': 'Настройки Gist',
        'GitHub Apps': 'GitHub приложения',
        'GitHub CLI': 'GitHub CLI',
        'GitHub Copilot Enterprise': 'GitHub Copilot Enterprise',
        'GitHub Desktop': 'GitHub Desktop',
        'GitHub Mobile': 'GitHub Мобильный',
        'GitHub-hosted runners': 'GitHub-hosted раннеры',
        'GPT models': 'GPT модели',
        'GraphQL API': 'GraphQL API',
        'Grouped security updates': 'Групповые обновления безопасности',
        'Has': 'Имеет',
        'Has is': 'Есть ли',
        'Help your community understand how to securely report security vulnerabilities for your project.': 'Помогите вашему сообществу понять, как безопасно сообщать об уязвимостях безопасности вашего проекта.',
        'HTTPS enforcement': 'Принудительный HTTPS',
        'Info': 'Информация',
        'Intelligent code': 'Интеллектуальный код',
        'iOS app': 'iOS приложение',
        'Large language models': 'Большие языковые модели',
        'Latest commit': 'Последний коммит',
        'Learn more about Dependabot': 'Подробнее о Dependabot',
        'Loading': 'Загрузка',
        'Loading failed': 'Ошибка загрузки',
        'Machine learning': 'Машинное обучение',
        'Machine types': 'Типы машин',
        'Maintenance': 'Техническое обслуживание',
        "Malware": "Вредоносное ПО",
        'Malware alerts': 'Предупреждения о вредоносном ПО',
        'Manage security settings': 'Управление настройками безопасности',
        'Marketplace apps': 'Приложения Marketplace',
        'Merge queue': 'Очередь слияния',
        'Merge strategies': 'Стратегии слияния',
        'Merged': 'Объединено',
        'Merged pull requests': 'Объединенные пулл-реквесты',
        'Mobile app': 'Мобильное приложение',
        'Mobile features': 'Мобильные функции',
        'Mobile notifications': 'Мобильные уведомления',
        'Multi-repository': 'Мультирепозиторный',
        'Mute notifications': 'Отключить уведомления',
        'Natural language processing': 'Обработка естественного языка',
        'Network error': 'Ошибка сети',
        'New issues': 'Новые задачи',
        'New pull requests': 'Новые пулл-реквесты',
        'No description provided.': 'Описание отсутствует.',
        'Not found': 'Не найдено',
        'Notification filters': 'Фильтры уведомлений',
        'Notification settings': 'Настройки уведомлений',
        'npm registry': 'npm реестр',
        'OAuth app': 'OAuth-приложение',
        'OAuth apps': 'OAuth приложения',
        'Offline': 'Офлайн',
        'Online': 'Онлайн',
        'Open issues': 'Открытые задачи',
        'Open pull requests': 'Открытые пулл-реквесты',
        'Organization members': 'Участники организации',
        'Organization projects': 'Проекты организации',
        'Organization settings': 'Настройки организации',
        'Organization teams': 'Команды организации',
        'Out of date': 'Устарело',
        'Overview': 'Обзор',
        'Package permissions': 'Разрешения пакета',
        'Package registry': 'Реестр пакетов',
        'Package settings': 'Настройки пакета',
        'Package versions': 'Версии пакетов',
        'Package visibility': 'Видимость пакета',
        'Pages analytics': 'Аналитика Pages',
        'Pages build': 'Сборка Pages',
        'Pages deployment': 'Деплой Pages',
        'Pages settings': 'Настройки Pages',
        'Participants': 'Участники',
        'Pending': 'В ожидании',
        'Personal access tokens': 'Персональные токены доступа',
        'Pinned discussions': 'Закрепленные обсуждения',
        'Please try again': 'Пожалуйста, попробуйте снова',
        'Prebuilds': 'Пребилды',
        'Predictive coding': 'Предсказательное кодирование',
        'Private vulnerability reporting': 'Приватные сообщения об уязвимостях',
        'Private vulnerability reporting •': 'Приватные сообщения об уязвимостях •',
        "Privately discuss, fix, and publish information about security vulnerabilities in your repository\'s code.": "Обсуждайте, исправляйте и публикуйте информацию об уязвимостях безопасности в коде вашего репозитория в частном порядке.",
        'Processing': 'Обработка',
        'Profile settings': 'Настройки профиля',
        'Project automation': 'Автоматизация проекта',
        'Project boards': 'Доски проекта',
        'Project insights': 'Аналитика проекта',
        'Project items': 'Элементы проекта',
        'Project management tools': 'Инструменты управления проектами',
        'Project settings': 'Настройки проекта',
        'Project templates': 'Шаблоны проекта',
        'Project views': 'Представления проекта',
        'Publicly leaked': 'Публично утекшие',
        'Punch card': 'Панч-карта',
        'Push protection': 'Защита при push',
        'Rate limited': 'Превышен лимит запросов',
        'Recent commits': 'Последние коммиты',
        'Remote development': 'Удаленная разработка',
        'Reopened issues': 'Переоткрытые задачи',
        'Report a vulnerability': 'Сообщить об уязвимости',
        'Repository insights': 'Аналитика репозитория',
        'Repository rules': 'Правила репозитория',
        'Required reviews': 'Обязательные ревью',
        'Required status checks': 'Обязательные проверки статуса',
        'Required workflows': 'Обязательные workflow',
        'Resolved': 'Решено',
        'Resolution': 'Резолюция',
        'REST API': 'REST API',
        'Runner groups': 'Группы раннеров',
        'Runner labels': 'Метки раннеров',
        'SBOM': 'SBOM (Ведомость программного обеспечения)',
        'Search filters': 'Фильтры поиска',
        'Search results': 'Результаты поиска',
        'Search syntax': 'Синтаксис поиска',
        'Secret scanning': 'Сканирование секретов',
        'Secret scanning alerts': 'Предупреждение о секретном сканировании',
        'Secret scanning alerts •': 'Предупреждение о секретном сканировании •',
        'Secret Type': 'Секретный тип',
        'Security advisories •': 'Рекомендации по безопасности •',
        'Security analysis': 'Анализ безопасности',
        'Security log': 'Журнал безопасности',
        'Security overview': 'Обзор безопасности',
        'Security policy •': 'Политика безопасности •',
        'Security policies': 'Политики безопасности',
        'Security settings': 'Настройки безопасности',
        'Security tools': 'Инструменты безопасности',
        'See less': 'Показать меньше',
        'See more': 'Показать еще',
        'Select items': 'Выбрать товары',
        'Self-hosted runners': 'Self-hosted раннеры',
        'Server error': 'Ошибка сервера',
        'Set up code scanning': 'Настройка сканирования кода',
        'Show labels for each data point in chart.': 'Показать метки для каждой точки на графике.',
        'Smart Code Navigation': 'Умная навигация по коду',
        'Smart Suggestions': 'Умные предложения',
        'Snooze notifications': 'Отложить уведомления',
        'Software Bill of Materials': 'Ведомость программного обеспечения',
        'Software supply chain': 'Цепочка поставок ПО',
        'Something went wrong': 'Что-то пошло не так',
        'Sponsorship analytics': 'Аналитика спонсорства',
        'Sponsorship benefits': 'Преимущества спонсорства',
        'Sponsorship goals': 'Цели спонсорства',
        'Sponsorship settings': 'Настройки спонсорства',
        'Sponsorship tiers': 'Уровни спонсорства',
        'Success': 'Успех',
        'Summary': 'Сводка',
        'Supply chain security': 'Безопасность цепочки поставок',
        'Sync failed': 'Ошибка синхронизации',
        'Syncing': 'Синхронизация',
        'Tag rules': 'Правила тегов',
        'Team discussions': 'Обсуждения команды',
        'Team permissions': 'Разрешения команды',
        'Team repositories': 'Репозитории команды',
        'Team settings': 'Настройки команды',
        'Text': 'Текст',
        'Third-party integrations': 'Сторонние интеграции',
        'This repository has no activity': 'В этом репозитории нет активности',
        "this repository’s settings": "настройках этого репозитория",
        'To receive Dependabot alerts, you must first enable Dependabot alerts in': 'Чтобы получать оповещения Dependabot, сначала необходимо включить оповещения Dependabot в',
        'Trace': 'Трассировка',
        'Traffic analytics': 'Аналитика трафика',
        'Unauthorized': 'Не авторизован',
        'Unresolved': 'Не решено',
        'Up to date': 'Актуально',
        'Updated': 'Обновлено',
        'VEX': 'VEX (Заявления об уязвимостях)',
        'View all': 'Посмотреть все',
        'View or disclose security advisories for this repository': 'Просмотр или раскрытие рекомендаций по безопасности для этого репозитория',
        'View security policy': 'Посмотреть политику безопасности',
        'Vulnerability alerts': 'Оповещения об уязвимостях',
        'Vulnerability Exploitability eXchange': 'Обмен данными об эксплуатируемости уязвимостей',
        "Vulnerabilities": "Уязвимости",
        'Warning': 'Предупреждение',
        'Web notifications': 'Веб-уведомления',
        'Webhooks': 'Вебхуки',
        'Wiki history': 'История Wiki',
        'Wiki pages': 'Страницы Wiki',
        'Wiki permissions': 'Разрешения Wiki',
        'Wiki settings': 'Настройки Wiki',
        'Workflow artifacts': 'Артефакты workflow',
        'Workflow editor': 'Редактор workflow',
        'Workflow file': 'Файл workflow',
        'Workflow logs': 'Логи workflow',
        'Workflow runs': 'Запуски workflow',
        'Workflow status': 'Статус workflow',
        'Workflow triggers': 'Триггеры workflow',
        "Your repository doesn\'t have any unresolved secrets.": "В вашем репозитории нет неразрешенных секретов.",

        // Уведомления
        'Add new filter': 'Добавить новый фильтр',
        'All': 'Все',
        'All caught up!': 'Все наверстали!',
        'All done here!': 'Все готово!',
        'and watch the ones you’re interested.': 'и смотрите те, которые вам интересны.',
        'Any reason': 'Любая причина',
        'Assign': 'Назначить',
        'Assigned': 'Назначено',
        'Author': 'Автор',
        'Autocomplete': 'Автозаполнение',
        'Bulk action processing complete.': 'Массовая операция завершена.',
        'Bulk action processing failed, please try again.': 'Ошибка при выполнении массовой операции, попробуйте снова.',
        'Bulk actions are not currently supported for this query.': 'Массовые операции не поддерживаются для этого запроса.',
        'Bulk actions currently being processed.': 'Массовые операции обрабатываются.',
        'Change notification settings': 'Изменить настройки уведомлений',
        'Clear': 'Очистить',
        'Clear out the clutter.': 'Уберите беспорядок.',
        'commented': 'прокомментировал',
        'Create new filter': 'Создать новый фильтр',
        'Customize filters': 'Настроить фильтры',
        'Date': 'Дата',
        'Done': 'Готово',
        'Explore repositories': 'Исследуйте репозитории',
        'Filter inbox by…': 'Фильтровать входящие по…',
        'Filters': 'Фильтры',
        'Folders': 'Папки',
        'Get started': 'Начать работу',
        'Group by:': 'Группировка:',
        'Inbox': 'Входящие',
        'Inbox zero': 'Входящие пусты',
        'Least recently subscribed': 'Наименее недавно подписанные',
        'Manage notifications': 'Управление уведомлениями',
        'Manual': 'Руководство',
        'Mark as done': 'Пометить как выполненное',
        'Mark notifications as done so you can move on with your work.': 'Помечайте уведомления как выполненные, чтобы можно было продолжить работу.',
        'Mention': 'Упоминание',
        'Mentioned': 'Упоминания',
        'Most recently subscribed': 'Последние подписки',
        'New activity appears in your inbox.': 'Новая активность появляется в вашем почтовом ящике.',
        'Newest to oldest': 'Сначала новые',
        'No notifications matched your query.': 'Ни одно уведомление не соответствует вашему запросу.',
        'No results matched your search.': 'Результаты поиска не найдены.',
        'Notification settings': 'Настройки уведомлений',
        'Notifications settings': 'Настройки уведомлений',
        'Oldest to newest': 'Сначала старые',
        'Participating': 'Участвую',
        'Reason': 'Причина',
        'Repository': 'Репозиторий',
        'Review Requested': 'Запрос на проверку',
        'Review requested': 'Запрошена проверка',
        'Saved': 'Сохраненное',
        'Save something important': 'Сохрани что-нибудь важное',
        'Search notifications': 'Поиск уведомлений',
        'Show all subscriptions': 'Показать все подписки',
        'Sort by:': 'Сортировка:',
        'State Change': 'Изменение состояния',
        'Submit search': 'Отправить запрос',
        'Subscriptions': 'Подписки',
        'Suggested filters': 'Рекомендуемые фильтры',
        'Take a break, write some code, do what you do best.': 'Сделайте перерыв, напишите код, займитесь тем, что у вас получается лучше всего.',
        'Team Mention': 'Упоминание команды',
        'Team mentioned': 'Упоминания команды',
        'Types': 'Типы',
        'Unread': 'Непрочитанные',
        'Watched repositories': 'Просмотренные репозитории',
        'Watching': 'Наблюдение',
        "We're still processing your last request. Please wait for that to complete before submitting a new request.": 'Ваш предыдущий запрос ещё обрабатывается. Пожалуйста, подождите.',
        'You changed the thread state (for example, closing an Issue or merging a Pull Request).': 'Вы изменили состояние ветки (например, закрыли проблему или объединили запрос на извлечение).',
        'You commented on the thread.': 'Вы прокомментировали эту ветку.',
        'You created the thread.': 'Вы создали эту ветку.',
        'You subscribed to the thread (via an Issue or Pull Request).': 'Вы подписались на ветку (через Issue или Pull Request).',
        'You were assigned to the Issue/PR.': 'Вы были назначены ответственным за задачу/пул-реквест.',
        'You were on a team that was mentioned.': 'Вы были в команде, о которой упомянули.',
        'You were requested for review.': 'Вас запросили на проверку.',
        'You were specifically @mentioned in the content.': 'Вы были явно упомянуты (@mention) в содержании.',

        // События в ленте
        'added a commit that references this issue': 'добавил коммит, который ссылается на эту задачу',
        'added a commit that references this pull request': 'добавил коммит, который ссылается на этот запрос на слияние',
        'assigned': 'назначил',
        'changed the title': 'изменил название',
        'closed this as': 'закрыл это как',
        'closed this as completed': 'закрыл как выполненное',
        'closed this as duplicate': 'закрыл как дубликат',
        'closed this as not planned': 'закрыл как не запланированное',
        'commented': 'прокомментировал',
        'completed': 'завершённое',
        'converted to draft': 'перевёл в черновик',
        'demilestoned': 'удалил из вехи',
        'labeled': 'добавил метку',
        'locked': 'заблокировал',
        'marked as ready for review': 'отметил как готовое к проверке',
        'mentioned': 'упомянул',
        'milestoned': 'добавил в веху',
        'opened': 'открыл',
        'opened by': 'открыт',
        'pinned': 'закрепил',
        'removed review request for': 'убрал запрос проверки для',
        'renamed': 'переименовал',
        'requested review from': 'запросил проверку от',
        'unassigned': 'снял назначение',
        'unlabeled': 'удалил метку',
        'unlocked': 'разблокировал',
        'unpinned': 'открепил',

        // Действия с файлами
        'Blame': 'История изменений',
        'Copy path': 'Копировать путь',
        'Copy permalink': 'Копировать постоянную ссылку',
        'Delete': 'Удалить',
        'Delete file': 'Удалить файл',
        'Edit': 'Редактировать',
        'Edit file': 'Редактировать файл',
        'History': 'История',
        'Open in': 'Открыть в',
        'Raw': 'Исходный',

        // Поиск и фильтры
        'Advanced search': 'Расширенный поиск',
        'All': 'Все',
        'Alphabetical': 'По алфавиту',
        'Archived': 'Архивированные',
        'Date created': 'Дата создания',
        'Date pushed': 'Дата отложена',
        'Explore sponsorable projects': 'Изучите проекты, которые можно спонсировать',
        'Fewest forks': 'Наименьшее количество форков',
        'Fewest stars': 'Наименьшее количество звезд',
        'Filter': 'Фильтр',
        'Filter by': 'Фильтр по',
        'Forks': 'Форки',
        'Language': 'Язык',
        'Least recently used': 'Наименее часто используемые',
        'Mirrors': 'Зеркала',
        'Most forks': 'Большинство форков',
        'Number of followers': 'Количество подписчиков',
        'Number of forks': 'Количество форков',
        'Number of stars': 'Количество звезд',
        'Private': 'Приватные',
        'Public': 'Публичные',
        'Recently used': 'Недавно использованные',
        'results': 'результаты',
        'Search': 'Поиск',
        'Search or jump to...': 'Поиск или переход...',
        'Size': 'Размер',
        'Sort': 'Сортировка',
        'Sources': 'Источники',
        'Sponsor open source projects you depend on': 'Спонсируйте открытые проекты, от которых вы зависите',
        'Templates': 'Шаблоны',
        'Topic': 'Тема',
        'Type': 'Тип',
        'View search docs': 'Просмотр документов поиска',

        // Расширенный поиск
        'Advanced options': 'Расширенные настройки',
        'Assigned to the users': 'Назначено на указанных пользователей',
        'any reason': 'Любая причина',
        'Code options': 'Варианты кода',
        'Created on the dates': 'Создано в указанные даты',
        'From this location': 'Из указанного местоположения',
        'From these owners': 'От указанных владельцев',
        'In the state': 'В указанном состоянии',
        'In this path': 'По указанному пути',
        'In these repositories': 'В указанных репозиториях',
        'including forks.': 'включая форки.',
        'Issues options': 'Выпуск опционов',
        'Mentioning the users': 'Упоминает указанных пользователей',
        'not planned': 'не запланировано',
        'Of this size': 'Указанного размера',
        'Opened by the author': 'Открыто указанным автором',
        'Pushed to': 'Обновлено (последний push)',
        'reopened': 'вновь открытый',
        'Repositories options': 'Параметры репозиториев',
        'Return code': 'Код возврата',
        'Return repositories': 'Возврат репозиториев',
        'Updated before the date': 'Обновлено до указанной даты',
        'Users options': 'Параметры пользователей',
        'Wiki options': 'Параметры Wiki',
        'With the labels': 'С указанными метками',
        'With the reason': 'По указанной причине',
        'With this extension': 'С указанным расширением',
        'With this file name': 'С указанным именем файла',
        'With this full name': 'С указанным полным именем',
        'With this license': 'С указанной лицензией',
        'With this many comments': 'С указанным количеством комментариев',
        'With this many followers': 'С указанным количеством подписчиков',
        'With this many forks': 'С указанным количеством форков',
        'With this many public repositories': 'С указанным количеством публичных репозиториев',
        'With this many stars': 'С указанным количеством звезд',
        'Working in this language': 'Работает с указанным языком',
        'Written in this language': 'Написано на указанном языке',

        // Issues и PR
        'Approve': 'Одобрить',
        'Assignee': 'Исполнитель',
        'Assignees': 'Исполнители',
        'Attach files': 'Прикрепить файлы',
        'Bold': 'Жирный',
        'Close issue': 'Закрыть задачу',
        'Close pull request': 'Закрыть запрос на слияние',
        'Comment': 'Комментарий',
        'Comments': 'Комментарии',
        'Commented': 'С комментариями',
        'Expand Up': 'Развернуть вверх',
        'Expand Down': 'Развернуть вниз',
        'Expand all': 'Развернуть всё',
        'Heading': 'Заголовок',
        'Italic': 'Курсив',
        'Labels': 'Метки',
        'Leave a comment': 'Оставить комментарий',
        'Link': 'Ссылка',
        'Local': 'Локальный',
        'Menu': 'Меню',
        'Merge pull request': 'Слить запрос',
        'Milestones': 'Этапы',
        'New issue': 'Новая задача',
        'No discussions match the selected filters.': 'Нет обсуждений, соответствующих выбранным фильтрам.',
        'Numbered list': 'Пронумерованный список',
        'Open pull request': 'Открыть запрос на извлечение',
        'Preview': 'Предпросмотр',
        'Quote': 'Цитата',
        'Reference': 'Ссылка',
        'Reopen issue': 'Переоткрыть задачу',
        'Reopen pull request': 'Переоткрыть запрос на слияние',
        'Request changes': 'Запросить изменения',
        'Review changes': 'Просмотреть изменения',
        'Revert': 'Возврат',
        'Slash commands': 'Слэш-команды',
        'Task list': 'Список задач',
        'Unordered list': 'Неупорядоченный список',
        'Write': 'Написать',

        // Статистика
        'Forks': 'Форки',
        'Frequency': 'Частота',
        'Graphs': 'Графики',
        'Network': 'Сеть',
        'Pulse': 'Пульс',

        // Личный кабинет и профиль
        "'Deploy key' alert email": "Уведомление по электронной почте «Развернуть ключ»",
        'Access': 'Доступ',
        'Access and security': 'Доступ и безопасность',
        'Account': 'Учетная запись',
        'Account budgets': 'Бюджеты счетов',
        'Achievements': 'Достижения',
        'across all public repositories on GitHub.': 'во всех публичных репозиториях на GitHub.',
        'Active Mode': 'Активный режим',
        'Active subscription': 'Активная подписка',
        'Activity': 'Активность',
        'Activity overview': 'Обзор деятельности',
        'Add a domain': 'Добавить домен',
        'Add a saved reply': 'Добавить сохраненный ответ',
        'Add email address': 'Добавить адрес электронной почты',
        'Add information': 'Добавить информацию',
        'Add new route': 'Добавить новый маршрут',
        'Add or remove instructions for how to operate complex controls.': 'Добавьте или удалите инструкции по эксплуатации сложных элементов управления.',
        'Add passkey': 'Добавить ключ доступа',
        'Add payment method': 'Добавить спосок оплаты',
        'Add saved reply': 'Добавить сохраненный ответ',
        'Add Successor': 'Добавить преемника',
        'Add your  information to show on every invoice': 'Добавьте свою информацию, которая будет отображаться на каждой накладной',
        'Additional billing details': 'Дополнительные данные для выставления счета',
        'Additional information': 'Дополнительная информация',
        'Address': 'Адрес',
        'Address line 2': 'Адрес 2',
        'Adopts your system preference for reduced motion': 'Принимает настройки вашей системы для уменьшения движения',
        'Agent sessions': 'Сессии агента',
        'All': 'Все',
        'All blocked users': 'Все заблокированные пользователи',
        'All Codespaces can access other repositories I own': 'Все кодовые пространства могут получить доступ к другим репозиториям, которые мне принадлежат.',
        'All of the fields on this page are optional and can be deleted at any\n                  time, and by filling them out, you\'re giving us consent to share this\n                  data wherever your user profile appears. Please see our': 'Все поля на этой странице необязательны и могут быть удалены в любое время. Заполняя их, вы даете нам согласие на передачу этих данных везде, где отображается ваш профиль. Пожалуйста, ознакомьтесь с нашим',
        'All repositories': 'Все репозитории',
        'Allow all verified emails': 'Разрешить все подтвержденные адреса электронной почты',
        'Allow Copilot to suggest commit messages when you make changes on GitHub.com.': 'Разрешить Copilot предлагать сообщения о фиксации при внесении изменений на GitHub.com.',
        'Allow GitHub, its affiliates and third parties to use my data, including Prompts, Suggestions, and Code Snippets, for product improvements. More information in the': 'Разрешить GitHub, его аффилированным лицам и третьим сторонам использовать мои данные, включая подсказки, предложения и фрагменты кода, для улучшения продуктов. Дополнительная информация в',
        'Allow GitHub, its affiliates and third parties to use my data, including Prompts, Suggestions, and Code Snippets, for AI model training. More information in the': 'Разрешить GitHub, его аффилированным лицам и третьим сторонам использовать мои данные, включая подсказки, предложения и фрагменты кода, для обучения моделей ИИ. Дополнительная информация в',
        "Allow GitHub to collect and use my Inputs, Outputs, and associated context to train and improve AI models. Read more in the": "Разрешить GitHub собирать и использовать мои вводные данные, результаты и связанный контекст для обучения и улучшения моделей искусственного интеллекта. Подробнее в ",
        'Allow GitHub to use my data for AI model training': 'Разрешить GitHub использовать мои данные для обучения моделей искусственного интеллекта',
        'Allow GitHub to use my data for product improvements': 'Разрешить GitHub использовать мои данные для улучшения продуктов',
        'Allow your community to privately report potential security vulnerabilities to maintainers and repository owners.': 'Позвольте вашему сообществу в частном порядке сообщать о потенциальных уязвимостях безопасности администраторам и владельцам репозиториев.',
        'Allows instant chatting when landing on GitHub.com': 'Позволяет мгновенно общаться в чате при переходе на GitHub.com',
        'Allowed': 'Разрешено',
        'Always use the latest stable configuration.': 'Всегда используйте последнюю стабильную конфигурацию.',
        'Alternative 2FA option:': 'Альтернативный вариант двухфакторной аутентификации:',
        'Amounts shown in USD': 'Суммы указаны в долларах США',
        'and sign in to your account.': 'и войдите в свою учетную запись.',
        'and uncheck "Keep my email address private."': 'и снимите флажок «Сохранять мой адрес электронной почты в тайне».',
        '.\n    Any changes here will override those limits.': '.\n    Любые изменения здесь переопределят эти ограничения.',
        'Applications': 'Приложения',
        'Applies only to specifically selected repositories': 'Применяется только к специально выбранным репозиториям',
        'Archives': 'Архивы',
        'Are you sure you want to do this?': 'Вы уверены, что хотите это сделать?',
        'Assignee': 'Исполнитель',
        'Assignees': 'Исполнители',
        'Assistive technology hints': 'Советы по использованию вспомогательных технологий',
        'Authenticator app': 'Приложение для аутентификации',
        'authenticate to the API over Basic Authentication': 'аутентификации в API через базовую аутентификацию',
        'Authorized GitHub Apps': 'Авторизованные приложения GitHub',
        'Authorized OAuth Apps': 'Авторизованные приложения OAuth',
        'Automatically enable for new public repositories': 'Автоматически включать для новых общедоступных репозиториев',
        'Automatically enable for new repositories': 'Автоматически включать для новых репозиториев',
        'Automatically install dotfiles': 'Автоматическая установка dotfiles',
        'Automatically plays animated images': 'Автоматически воспроизводит анимированные изображения',
        'automatically receive notifications when a new vulnerability is found in one of your dependencies.': 'автоматически получать уведомления, когда в одной из ваших зависимостей обнаруживается новая уязвимость.',
        'Autoplay animated images': 'Автоматическое воспроизведение анимированных изображений',
        'Available for hire': 'Доступно для аренды',
        'Back to email settings': 'Вернуться к настройкам электронной почты',
        'Backup email address': 'Резервный адрес электронной почты',
        'Billable usage': 'Платное использование',
        'Billed amount': 'Сумма по счету',
        'Billed premium requests': 'Запросы на оплату премиум-услуг',
        'Billing': 'Выставление счетов',
        'Billing and licensing': 'Выставление счетов и лицензирование',
        'Billing information': 'Информация для выставления счетов',
        'Billing updates': 'Обновления по биллингу',
        'Bio': 'Биография',
        'Block a user': 'Заблокировать пользователя',
        'Block command line pushes that expose my email': 'Блокировка командной строки, раскрывающей мой адрес электронной почты',
        'Block or Report': 'Блокировать или сообщить',
        'Block or report user': 'Заблокировать или пожаловаться на пользователя',
        'Block user': 'Заблокировать пользователя',
        'Blocked': 'Заблокировано',
        'Blocked users': 'Заблокированные пользователи',
        'budget': 'бюджет',
        'Budgets and alerts': 'Бюджеты и оповещения',
        'Budgets let you set monthly usage limits for specific GitHub products or SKUs. If no budget is set, usage for that product is unlimited.': 'Бюджеты позволяют устанавливать ежемесячные лимиты использования для определенных продуктов GitHub или SKU. Если бюджет не установлен, использование данного продукта не ограничено.',
        'Building an application, service, or tool that integrates with GitHub?': 'Создаете приложение, сервис или инструмент, который интегрируется с GitHub?',
        'Busy': 'Занят',
        'By enabling, your codespaces will be able to pull from VS Code Settings Sync service and push only for the trusted repositories you specify.\n    Only enable this for repositories that you trust.': 'При включении ваши кодовые пространства смогут получать данные из службы синхронизации настроек VS Code и отправлять изменения только в указанные вами доверенные репозитории.\n    Включайте эту функцию только для репозиториев, которым вы доверяете.',
        'Change my username': 'Изменить имя пользователя',
        'Change password': 'Изменить пароль',
        'Change username': 'Изменить имя пользователя',
        'Changing your username can have': 'Изменение имени пользователя может иметь',
        'Character keys': 'Клавиши с символами',
        'Chat messages': 'Сообщения в чате',
        'Choose the default branch for your new personal repositories. You might want to change the default name due\n  to different workflows, or because your integrations still require "master" as the default branch name. You can always change\n  the default branch name on individual repositories.': 'Выберите ветку по умолчанию для ваших новых личных репозиториев. Возможно, вы захотите изменить имя по умолчанию из-за разных рабочих процессов или потому что ваши интеграции все еще требуют «master» в качестве имени ветки по умолчанию. Вы всегда можете изменить имя ветки по умолчанию в отдельных репозиториях.',
        'Choose how GitHub looks to you. Select a single theme, or sync with your system and\n        automatically switch between day and night themes. Selections are applied immediately and saved automatically.': 'Выберите, как GitHub выглядит для вас. Выберите единую тему или синхронизируйте с системой для автоматического переключения между дневной и ночной темами. Выбор применяется немедленно и сохраняется автоматически.',
        'Choose the number of spaces a tab is equal to when rendering code': 'Выберите количество пробелов, равное табуляции при отображении кода.',
        'Choose where you\'d like emails to be sent. You can add more email addresses. Use custom routes to specify different email addresses to be used for individual organizations.': 'Выберите, куда вы хотите отправлять электронные письма. Вы можете добавить несколько адресов электронной почты. Используйте настраиваемые маршруты, чтобы указать разные адреса электронной почты для отдельных организаций.',
        'Choose which repositories Copilot coding agent should be enabled in. Copilot coding agent will only be available where it is enabled for the repository and in the Copilot license policies.': 'Выберите, в каких репозиториях следует включить агент кодирования Copilot. Агент кодирования Copilot будет доступен только там, где он включен для репозитория и в политиках лицензирования Copilot.',
        'Choose your default region': 'Выберите регион по умолчанию',
        'City': 'Город',
        'Clear status': 'Очистить статус',
        'Code completions': 'Завершение кода',
        'Code review': 'Проверка кода',
        'Code review limits': 'Ограничения проверки кода',
        'Code review limits may already be specified by individual repositories. Any changes here will override those\n        limits until unset.': 'Ограничения проверки кода могут уже быть указаны для отдельных репозиториев. Любые изменения здесь переопределят эти ограничения, пока не будут отменены.',
        'Code review limits are currently managed individually for all repositories. Enable limits to permit only\n            users who have explicitly been granted access to each repository to submit reviews that "approve" or\n            "request changes". Remove limits to allow all users to submit pull request reviews. All users able to submit\n            comment pull request reviews will continue to be able to do so.': 'Ограничения проверки кода в настоящее время управляются индивидуально для всех репозиториев. Включите ограничения, чтобы разрешить только пользователям, которым явно предоставлен доступ к каждому репозиторию, отправлять рецензии с пометкой "одобрить" или "запросить изменения". Снимите ограничения, чтобы разрешить всем пользователям отправлять рецензии на пул-реквесты. Все пользователи, которые могут отправлять комментарии к рецензиям на пул-реквесты, продолжат это делать.',
        'Code security': 'Коды безопасности',
        'Code, planning, and automation': 'Код, планирование и автоматизация',
        'Codespace user secrets': 'Секретные данные пользователя Codespace',
        'Codespaces can automatically install your dotfiles into every codespace you create.': 'Codespaces может автоматически устанавливать ваши dotfiles в каждое создаваемое вами пространство кода.',
        'Codespaces can have GPG commit signing capabilities so that GitHub can verify that commits made in the codespace come from a trusted source.\n    When enabled, this setting will be applied to your list of trusted repositories.': 'Codespaces могут иметь возможности подписи коммитов GPG, чтобы GitHub мог подтвердить, что коммиты, сделанные в codespace, поступают из надежного источника.\n    При включении этот параметр будет применен к вашему списку доверенных репозиториев.',
        'Codespaces you create for your personal account can either be restricted to accessing the repository it was opened for,\n    or granted read access to other repositories you own.': 'Кодовые пространства, которые вы создаете для своей личной учетной записи, могут либо быть ограничены доступом только к репозиторию, для которого они были открыты,\n    либо иметь доступ на чтение к другим вашим репозиториям.',
        'Comment': 'Комментарий',
        'Comments': 'Комментарии',
        'Company': 'Компания',
        'Compare base plans': 'Сравнить базовые планы',
        'Configure alert notifications': 'Настройка уведомлений о предупреждениях',
        'Connect': 'Подключиться',
        'Connect MCP servers to Copilot in\n                all Copilot editors and Coding Agent.': 'Подключайте серверы MCP к Copilot во\n                всех редакторах Copilot и в агенте кодирования.',
        'Connect MCP servers to Copilot in all Copilot editors and Copilot cloud agent.': 'Подключите серверы MCP к Copilot во всех редакторах Copilot и в облачном агенте Copilot.',
        'Connect with Patreon': 'Подключится к Patreon',
        'Connect with the community that builds the tools you use': 'Общайтесь с сообществом, которое создает инструменты, которые вы используете',
        'Connect your ORCID iD': 'Подключите свой ORCID iD',
        'Content': 'Содержание',
        'Contrast': 'Контраст',
        'Contribution activity': 'Вклад в деятельность',
        'Contribution settings': 'Настройки взносов',
        'Contributions': 'Вклад',
        'Contributions & activity': 'Вклады и деятельность',
        'Copilot activity': 'Активность Copilot',
        'Copilot can answer questions about new trends and give improved answers, via Bing. See': 'Copilot может отвечать на вопросы о новых трендах и давать улучшенные ответы через Bing. См.',
        'Copilot can allow or block suggestions matching public code. Learn more about': 'Copilot может разрешать или блокировать предложения, соответствующие публичному коду. Подробнее о',
        'Copilot can search the web': 'Copilot может выполнять поиск в Интернете',
        'Copilot Chat in GitHub.com': 'Чат Copilot на GitHub.com',
        'Copilot cloud agent': 'Облачный агент Copilot',
        'Copilot in GitHub Desktop': 'Copilot в GitHub Desktop',
        'Copilot Spaces': 'Пространства Copilot',
        'Copilot Spaces Individual Access': 'Индивидуальный доступ к пространствам Copilot',
        'Copilot Spaces Individual Sharing': 'Индивидуальный обмен пространствами Copilot',
        'Copilot-generated commit messages': 'Сообщения о фиксации, сгенерированные Copilot',
        'Copy subject claim prefix': 'Скопировать префикс утверждения subject',
        'Country/Region': 'Страна/регион',
        'Coupon': 'Купон',
        'Create an organization': 'Создать организацию',
        'Create saved search': 'Создать сохраненный поиск',
        'Created their first repository': 'Создали свой первый репозиторий',
        'Current GitHub base plan': 'Текущий базовый план GitHub',
        'Current included usage': 'Текущее включенное использование',
        'Current metered usage': 'Текущее измеренное использование',
        'Current month': 'Текущий месяц',
        'Custom': 'Пользовательский',
        'Custom routing': 'Пользовательская маршрутизация',
        'Customize your pins': 'Настройте свои значки',
        'Dark default': 'Темная (по умолчанию)',
        'Dark mode': 'Темный режим',
        'Dark protanopia and deuteranopia': 'Темная (протанопия и дейтеранопия)',
        'Dark theme': 'Темная тема',
        'Dark tritanopia': 'Темная (тританопия)',
        'Dashboard Entry Point': 'Точка входа в панель управления',
        'Dashboard entry point': 'Точка входа в панель управления',
        'Default idle timeout': 'Таймаут простоя по умолчанию',
        'Default notifications email': 'Уведомления по умолчанию по электронной почте',
        'Default Package Setting': 'Настройки пакета по умолчанию',
        'Default retention period': 'Срок хранения по умолчанию',
        'Default subject claim prefix': 'Префикс утверждения subject по умолчанию',
        'Delete account': 'Удаление аккаунта',
        'Delete your account': 'Удалить свою учетную запись',
        'Deleted Packages': 'Удаленные пакеты',
        'Deleted repositories': 'Удаленные репозитории',
        'Delegate tasks to Copilot cloud agent in repositories where it is enabled': 'Делегировать задачи облачному агенту Copilot в репозиториях, где он включен',
        'Delegate tasks to Copilot coding agent in repositories where it is enabled': 'Делегируйте задачи агенту кодирования Copilot в репозиториях, где он включен.',
        'Dependabot alerts': 'Оповещения Dependabot',
        'Dependabot alerts: Email digest': 'Уведомления Dependabot: дайджест по электронной почте',
        'Dependabot alerts: New vulnerabilities': 'Оповещения Dependabot: новые уязвимости',
        'Dependabot on self-hosted runners': 'Dependabot на самохостных раннерах',
        'Dependabot security updates': 'Обновления безопасности Dependabot',
        'Dependency graph': 'График зависимостей',
        'Designed for businesses or teams who collaborate on GitHub.com': 'Предназначен для компаний или команд, которые сотрудничают на GitHub.com.',
        'designated below': 'указанному ниже',
        'Details': 'Подробности',
        'Developer settings': 'Настройки разработчика',
        'Development environment secrets are environment variables that are encrypted. They are available to any codespace you create using repositories with access to that secret.': 'Секреты среды разработки — это зашифрованные переменные среды. Они доступны для любого кодового пространства, которое вы создаете с помощью репозиториев, имеющих доступ к этому секрету.',
        'Disabled everywhere': 'Отключено везде',
        'Disable screen reader hint': 'Отключить подсказку для чтения с экрана',
        'Display current local time': 'Местное время',
        "Don't send": "Не отправлять",
        "Don't specify": "Не указывать",
        'Dotfiles': 'Файлы точек',
        'Download your recovery codes': 'Скачайте свои коды восстановления',
        'Edit and preview changes straight from the browser.': 'Редактируйте и просматривайте изменения прямо в браузере.',
        'Edit and run notebooks from the browser with JupyterLab.': 'Редактируйте и запускайте ноутбуки из браузера с помощью JupyterLab.',
        'Edit pinned items': 'Редактировать закрепленные элементы',
        'Edit profile': 'Редактировать профиль',
        'Edit status': 'Редактировать статус',
        'Editor preference': 'Предпочтения редактора',
        'Editor settings': 'Настройки редактора',
        'Education benefits': 'Льготы на образование',
        'Education Benefits': 'Преимущества образования',
        'Email': 'Электронная почта',
        'Email a regular summary of Dependabot alerts for up to 10 of your repositories.': 'Отправляйте по электронной почте регулярные сводки оповещений Dependabot для 10 ваших репозиториев.',
        'Emails': 'Электронные письма',
        'Emoji skin tone preference': 'Предпочтения по цвету кожи эмодзи',
        'Enable **GitHub shortcuts** that don\'t use modifier keys in their activation. For example, the **g** **n** shortcut to navigate notifications, or **?** to view context relevant shortcuts. **Learn more about character key shortcuts**.': 'Включить **сочетания клавиш GitHub**, которые не используют клавиши-модификаторы. Например, сочетание **g** **n** для навигации по уведомлениям или **?** для просмотра соответствующих контексту сочетаний клавиш. **Подробнее о сочетаниях клавиш с символами**.',
        'Enable Copilot for all GitHub features, including navigation bar, search, and dashboard.': 'Включите Copilot для всех функций GitHub, включая панель навигации, поиск и панель инструментов.',
        'Enable high contrast for light or dark mode (or both) based on your system settings': 'Включите высокую контрастность для светлого или темного режима (или обоих) в зависимости от настроек вашей системы.',
        'Enable interaction limits for:': 'Ограничение для существующих пользователей',
        '.\n        Enable paid usage to avoid interruption and add tokens.': '.\n        Включите платное использование, чтобы избежать перерывов в работе и добавить токены.',
        'Enable previewing link content via mouse hover or keyboard focus before navigation. Move focus to hovercard content using **Alt** **↑**.': 'Включить предварительный просмотр содержимого ссылки при наведении курсора мыши или фокусировке клавиатуры перед переходом. Переместить фокус на содержимое всплывающей карточки с помощью **Alt** **↑**.',
        'Enable previewing link content via mouse hover or keyboard focus before navigation. Move focus to hovercard content using': 'Включить предварительный просмотр содержимого ссылки при наведении курсора мыши или фокусировке клавиатуры перед переходом. Переместить фокус на содержимое всплывающей карточки с помощью',
        'Enable screen reader hint': 'Включить подсказку для чтения с экрана',
        'Enable two-factor authentication': 'Включить двухфакторную аутентификацию',
        'Enable two-factor authentication (2FA)': 'Включить двухфакторную аутентификацию (2FA)',
        'Enabled everywhere': 'Включено везде',
        'Enabling this option will result in Dependabot automatically attempting to open pull requests to resolve every open Dependabot alert with an available patch.': 'Включение этой опции приведет к тому, что Dependabot будет автоматически пытаться открывать пул-реквесты для устранения всех открытых предупреждений Dependabot с помощью доступного патча.',
        'Enabling this will hide your contributions and activity from your GitHub profile and from social features like followers, stars, feeds, leaderboards and releases.': 'Включение этой функции скрывает ваши вклады и активность из вашего профиля GitHub и из социальных функций, таких как подписчики, звездочки, ленты, таблицы лидеров и релизы.',
        'Enter a new username': 'Введите новое имя пользователя',
        'Export': 'Экспорт',
        'Export account data': 'Экспорт данных учетной записи',
        'Feature preview dialog': 'Диалоговое окно предварительного просмотра функций',
        'Filter': 'Фильтр',
        'Filter activity': 'Активность фильтра',
        'Filter audit logs': 'Фильтр журналов аудита',
        'Fine-grained personal access tokens': 'Мелкозернистые личные токены доступа',
        'Fine-grained tokens': 'Мелкозернистые токены',
        'Fine-grained, repo-scoped': 'Детализированные, с областью действия репозитория',
        'First name': 'Имя',
        'First repository': 'Первый репозиторий',
        'Flag unsigned commits as unverified': 'Пометить неподписанные коммиты как непроверенные',
        'Follow': 'Подписаться',
        'follower': 'Подписчик',
        'followers': 'Подписчики',
        'following': 'Подписки',
        'Font preference for plain text editors that support Markdown styling (e.g. pull request and issue descriptions, comments.)': 'Предпочтительный шрифт для редакторов простого текста, поддерживающих стили Markdown (например, описания запросов на извлечение и проблем, комментарии).',
        'For general use': 'Для общего использования',
        'For more information about the data your organization receives regarding your use of GitHub Copilot, please review': 'Для получения дополнительной информации о данных, которые ваша организация получает относительно вашего использования GitHub Copilot, пожалуйста, ознакомьтесь с',
        'Forgot password?': 'Забыли пароль?',
        'Forks': 'Форки',
        'Formatted link': 'Отформатированная ссылка',
        'free rate limits': 'бесплатные лимиты скорости',
        'General': 'Общее',
        'General info and offers from GitHub': 'Общая информация и предложения от GitHub',
        'Generate new token': 'Сгенерировать новый токен',
        'Generate new token (classic)': 'Сгенерировать новый токен (классический)',
        'Generate new tokens': 'Генерировать новые токены',
        'Get Copilot from an organization': 'Получить Copilot от организации',
        'Get one-time codes sent to your phone via SMS to complete authentication requests. We strongly advise against using SMS because it is susceptible to interception, does not provide resistance against phishing attacks, and deliverability can be unreliable. It is recommended to use an Authenticator app instead of SMS.': 'Получайте одноразовые коды на свой телефон посредством SMS для завершения запросов на аутентификации. Мы настоятельно не рекомендуем использовать SMS, поскольку они подвержены перехвату, не обеспечивают защиту от фишинговых атак, а их доставка может быть ненадежной. Вместо SMS рекомендуется использовать приложение Authenticator.',
        'Get sponsored': 'Получить спонсорскую поддержку',
        'Get tips, solutions and exclusive offers from GitHub about products, services and events we think you might find interesting.': 'Получайте советы, решения и эксклюзивные предложения от GitHub о продуктах, услугах и событиях, которые, по нашему мнению, могут вас заинтересовать.',
        'Get usage report': 'Получить отчет об использовании',
        'GitHub Copilot for assistance in GitHub Desktop': 'GitHub Copilot для помощи в GitHub Desktop',
        'GitHub Copilot for assistance in terminal': 'Для помощи в работе с терминалом используйте GitHub Copilot',
        'GitHub Copilot will show suggestions matching public code.': 'GitHub Copilot будет показывать предложения, соответствующие общедоступному коду.',
        "GitHub Copilot won't show suggestions matching public code.": "GitHub Copilot не будет показывать предложения, соответствующие общедоступному коду.",
        'GitHub developer program': 'Программа для разработчиков GitHub',
        'GitHub Developer Program': 'Программа для разработчиков GitHub',
        'GitHub Education': 'GitHub Образование',
        'GitHub Mobile sessions': 'Мобильные сессии GitHub',
        'GitHub Mobile can be used for two-factor authentication by installing the GitHub Mobile app and signing in to your account.': 'GitHub Mobile можно использовать для двухфакторной аутентификации, установив приложение GitHub Mobile и войдя в свою учетную запись.',
        'GitHub Mobile can be used to verify your identity when signing in from a new device and as a two-factor authentication method.': 'GitHub Mobile можно использовать для подтверждения вашей личности при входе с нового устройства и в качестве метода двухфакторной аутентификации.',
        'GitHub\'s Privacy Statement': 'Заявлением о конфиденциальности GitHub',
        'GitHub profile guide': 'Руководство по профилю GitHub',
        'GitHub Sponsors': 'Спонсоры GitHub',
        'GitHub Sponsors accounts': 'Учетные записи GitHub Sponsors',
        'GitHub Sponsors eligible accounts': 'Учетные записи, имеющие право на участие в программе GitHub Sponsors',
        'GitHub theme will match your system active settings': 'Тема GitHub будет соответствовать активным настройкам вашей системы',
        'GitHub will use your selected theme': 'GitHub будет использовать выбранную вами тему',
        'Go to your personal profile': 'Перейти в личный профиль',
        'GPG and VS Code Settings Sync will be available for Codespaces from these repositories.': 'Синхронизация настроек GPG и VS Code будет доступна для Codespaces из этих репозиториев.',
        'GPG keys': 'Ключи GPG',
        'GPG signing and VS Code Settings Sync will be available for codespaces for all repositories': 'Подпись GPG и синхронизация настроек VS Code будут доступны для кодовых пространств всех репозиториев',
        'GPG signing and VS Code Settings Sync will be available for codespaces from the selected repositories': 'Подпись GPG и синхронизация настроек VS Code будут доступны для кодовых пространств из выбранных репозиториев',
        'GPG signing will be available in Codespaces': 'Подпись GPG будет доступна в Codespaces',
        'GPG verification': 'Проверка GPG',
        'Gross amount': 'Общая сумма',
        'Grouped security updates': 'Группированные обновления безопасности',
        'Groups all available updates that resolve a Dependabot alert into one pull request (per package manager and directory of requirement manifests). This option may be overridden by group rules specified in dependabot.yml -': 'Группирует все доступные обновления, которые устраняют предупреждение Dependabot, в один пул-реквест (для каждого менеджера пакетов и каталога манифестов требований). Этот параметр может быть переопределен правилами группы, указанными в dependabot.yml -',
        'he/him': 'он/его',
        'Hide link underlines': 'Скрыть подчеркивание ссылок',
        'Highlights': 'Основные моменты',
        'Host image version preference': 'Предпочтения по версии образа хоста',
        'Hovercards': 'Всплывающая карточка',
        '**Hover cards** preview information about other parts of GitHub.': '**Всплывающие карточки** предварительно показывают информацию о других частях GitHub.',
        'I have saved my recovery codes': 'Я сохранил свои коды восстановления',
        'I understand, let’s change my username': 'Я понимаю, давайте изменим имя пользователя',
        'If enabled, usage beyond the free tier will be billed per token based on model pricing from\n        your Models budget.': 'Если эта функция включена, использование, превышающее бесплатный тариф, будет оплачиваться за токен на основе цен на модели из\n        вашего бюджета Models.',
        'If enabled, you can create individually owned': 'Если включено, вы можете создавать индивидуально принадлежащие',
        'If enabled, you can share individually owned': 'Если включено, вы можете делиться индивидуально принадлежащими',
        'If enabled, you can view and create': 'Если эта функция включена, вы можете просматривать и создавать',
        'If you don’t read this, unexpected bad things will happen!': 'Если вы не прочитаете это, произойдут неожиданные неприятности!',
        'Ignored repositories': 'Игнорируемые репозитории',
        'Improve security by including unique identifiers in the subject claim, ensuring that trust policies cannot be assumed by a different repository or organization with the same name.': 'Повысьте безопасность, включив уникальные идентификаторы в утверждение subject, чтобы гарантировать, что политики доверия не могут быть применены другим репозиторием или организацией с тем же именем.',
        'Include all current and future repositories': 'Включить все текущие и будущие репозитории',
        'Include private contributions on my profile': 'Включить частные пожертвования в мой профиль',
        'Included credits': 'Включенные кредиты',
        'Included premium requests consumed': 'Использованные включенные премиум-запросы',
        'Included usage': 'Включенное использование',
        'Increase contrast': 'Увеличить контраст',
        'Inherit access from source repository': 'Наследовать доступ из исходного репозитория',
        'Inline suggestions': 'Встроенные предложения',
        'In-product messages': 'Сообщения в продукте',
        'Installed GitHub Apps': 'Установленные приложения GitHub',
        'Integrations': 'Интеграции',
        'Interaction limits': 'Пределы взаимодействия',
        'Interaction limits may already exist in your account\'s': 'Ограничения взаимодействия могут уже существовать в',
        'If enabled you can use Semantic indexing for Non-GitHub Repositories to index your non-GitHub repositories in VSCode.': 'Если включено, вы можете использовать семантическое индексирование для репозиториев не из GitHub, чтобы индексировать ваши репозитории в VSCode.',
        'If enabled, you may be served evaluation models through Copilot Auto model selection .': 'Если включено, вам могут предоставляться оценочные модели через автоматический выбор модели Copilot.',
        'It can take up to 30 minutes for the changes to take effect. Restart your code editor for the changes to take effect immediately.': 'Для вступления изменений в силу может потребоваться до 30 минут. Перезапустите редактор кода, чтобы изменения вступили в силу немедленно.',
        'It may take up to an hour for repositories to be displayed here. You can only restore repositories that are not forks, or have not been forked.': 'Может потребоваться до часа, чтобы репозитории отобразились здесь. Вы можете восстановить только те репозитории, которые не являются форками или не были форкнуты.',
        'Jobs profile': 'Профиль вакансий',
        'Join the GitHub Developer Program': 'Присоединяйтесь к программе для разработчиков GitHub',
        'Joined': 'Присоединился',
        'Joined GitHub': 'Присоединился к GitHub',
        'Keep my email addresses private': 'Сохранять конфиденциальность моих адресов электронной почты',
        'Keep your dependencies secure and up-to-date.': 'Обеспечьте безопасность и актуальность ваших зависимостей.',
        'Keyboard shortcuts': 'Горячие клавиши',
        'Label': 'Метка',
        'Labels': 'Метки',
        'Language': 'Язык',
        'Last month': 'В прошлом месяце',
        'Last name': 'Фамилия',
        'Leave a comment': 'Оставить комментарий',
        'Learn how to group updates.': 'Узнайте, как группировать обновления.',
        'Learn how to set up your dotfiles for Codespaces.': 'Узнайте, как настроить файлы dotfiles для Codespaces.',
        'Learn more.': 'Узнайте больше.',
        'Learn more about account successors.': 'Узнать больше о преемниках аккаунта.',
        'Learn more about authentication with GitHub Mobile.': 'Узнайте больше об аутентификации с помощью GitHub Mobile.',
        'Learn more about blocking a user': 'Узнайте больше о блокировке пользователя',
        'Learn more about character key shortcuts': 'Подробнее о сочетаниях клавиш с символами',
        'Learn more about configuring environments.': 'Узнайте больше о настройке сред.',
        'Learn more about Copilot in GitHub.com': 'Узнайте больше о Copilot на GitHub.com',
        'Learn more about Copilot-generated commit messages.': 'Узнайте больше о сообщениях о фиксации, сгенерированных Copilot.',
        'Learn more about default branches.': 'Подробнее о ветках по умолчанию.',
        'Learn more about Dependabot': 'Узнайте больше о Dependabot',
        'Learn more about enterprises': 'Узнайте больше о предприятиях',
        'Learn more about GitHub Sponsors': 'Узнайте больше о GitHub Sponsors',
        'Learn more about host images': 'Узнайте больше об образах хоста',
        'Learn more about how GitHub Copilot serves Anthropic Claude Haiku 4.5.': 'Узнайте больше о том, как GitHub Copilot обслуживает Anthropic Claude Haiku 4.5.',
        'Learn more about how GitHub Copilot serves Raptor mini.': 'Узнайте больше о том, как GitHub Copilot помогает Raptor mini.',
        'Learn more about private vulnerability reporting': 'Узнайте больше о частном сообщении об уязвимостях',
        'Learn more about restoring deleted repositories': 'Подробнее о восстановлении удаленных репозиториев',
        'Learn more about two-factor authentication': 'Узнайте больше о двухфакторной аутентификации',
        'Learn more about working with saved replies': 'Подробнее о работе с сохраненными ответами',
        'Learn more in the docs.': 'Подробнее в документации.',
        'Legacy usage report': 'Отчет об использовании устаревших функций',
        'Licensing': 'Лицензирование',
        'lines changed': 'изменения в строках',
        'Light default': 'Светлая (по умолчанию)',
        'Light mode': 'Светлый режим',
        'Light protanopia and deuteranopia': 'Светлая (протанопия и дейтеранопия)',
        'Light theme': 'Светлая тема',
        'Light tritanopia': 'Светлая (тританопия)',
        'Limit access of personal Codespaces to the repository they were opened for': 'Ограничить доступ личных кодовых пространств к репозиторию, для которого они были открыты',
        'Limit reviews on all repositories': 'Ограничение просмотров всех репозиториев',
        'Limit to existing users': 'Ограничение для существующих пользователей',
        'Limit to prior contributors': 'Ограничение для предыдущих участников',
        'Limit to repository collaborators': 'Ограничение для участников репозитория',
        'Link Patreon account': 'Ссылка на аккаунт Patreon',
        'Link underlines': 'Подчеркивание ссылок',
        'Location': 'Местоположение',
        'Looking to manage account security settings? You can find them in the': 'Хотите управлять настройками безопасности аккаунта? Вы можете найти их на странице',
        'Make profile private and hide activity': 'Сделать профиль приватным и скрыть активность',
        'Manage': 'Управлять',
        'Manage budgets': 'Управление бюджетами',
        'Manage email preferences': 'Управление настройками электронной почты',
        'Manage subscriptions': 'Управление подписками',
        'Manage who you sponsor': 'Управляйте тем, кого вы спонсируете',
        'Markdown editor font preference': 'Настройки шрифта в редакторе Markdown',
        'MCP servers in Copilot': 'Серверы MCP в Copilot',
        'Metered usage': 'Использование по счетчику',
        'Microsoft Privacy Statement': 'Заявление о конфиденциальности Microsoft',
        'Milestones': 'Этапы',
        'Models paid usage': 'Модели платного использования',
        'Models pricing': 'Цены на модели',
        'Moderation': 'Модерация',
        'More details': 'Подробнее',
        'Motion': 'Движение',
        'Move to an organization': 'Перейти в организацию',
        'Move work to an organization': 'Переместить работу в организацию',
        'My GitHub Apps': 'Мои приложения GitHub',
        'Name': 'Имя',
        'Need an API token for scripts or testing? Generate a personal access token for quick access to the GitHub API.': 'Нужен API-токен для скриптов или тестирования? Сгенерируйте персональный токен доступа для быстрого доступа к GitHub API.',
        'New budget': 'Новый бюджет',
        'New GitHub App': 'Новое приложение GitHub',
        'New GPG key': 'Новый ключи GPG',
        'New issue': 'Новая задача',
        'New OAuth app': 'Новое приложение OAuth',
        'New secret': 'Новый секрет',
        'New SSH key': 'Новый ключ SSH',
        'New sponsorships, changes, and cancellations': 'Новые спонсорские контракты, изменения и отмены',
        'Newer': 'Новее',
        'Next payment due': 'Следующий платеж',
        'No additional information added to your receipts.': 'Никакая дополнительная информация не добавляется к вашим чекам.',
        'No custom routes yet.': 'Пока нет пользовательских маршрутов.',
        'No fine-grained tokens created': 'Не создано мелкозернистых токенов',
        'No GitHub Apps': 'Нет приложений GitHub',
        'No installed GitHub Apps': 'Нет установленных приложений GitHub',
        'No OAuth apps': 'Нет приложений OAuth',
        'No personal access token created': 'Персональный токен доступа не создан',
        'No reminders': 'Без напоминаний',
        'No repositories': 'Нет репозиториев',
        'No saved replies yet.': 'Пока нет сохраненных ответов.',
        'No sponsorship activity in this time period': 'В этот период спонсорская деятельность не осуществлялась.',
        'No usage found': 'Использование не найдено',
        'Note that this will include your existing unsigned commits.': 'Обратите внимание, что сюда будут включены ваши существующие неподписанные коммиты.',
        'Notifications for agent sessions that you started.': 'Уведомления о сеансах агента, которые вы запустили.',
        'Notifications for all repositories, teams, or conversations you\'re watching.': 'Уведомления для всех репозиториев, команд или разговоров, за которыми вы следите.',
        'Notifications for the conversations you are participating in, or if someone cites you with an @mention. Also for all activity when subscribed to specific events.': 'Уведомления о разговорах, в которых вы участвуете, или если кто-то упоминает вас с помощью @mention. Также для всех действий при подписке на определенные события.',
        'Notifications for workflow runs on repositories set up with': 'Уведомления о выполнении рабочих процессов в репозиториях, настроенных с помощью',
        'Notify me:': 'Уведомить меня:',
        'OAuth apps': 'Приложения OAuth',
        'OAuth apps are used to access the GitHub API. Read the docs to find out more.': 'Приложения OAuth используются для доступа к API GitHub. Подробнее читайте в документации.',
        'Older': 'Старше',
        'On GitHub': 'На GitHub',
        'On repositories you haven\'t contributed to yet, we\'ll warn you when a user you\'ve blocked has previously made contributions.': 'В репозиториях, в которые вы еще не вносили вклад, мы будем предупреждать вас, если заблокированный вами пользователь ранее вносил в них вклад.',
        'Once you delete your account, there is no going back. Please be certain.': 'После удаления учетной записи возврат невозможен. Пожалуйста, будьте уверены в своем решении.',
        'Only allow primary email': 'Разрешить только основной адрес электронной почты',
        'Only notify for failed workflows': 'Уведомлять только о неудачных рабочих процессах',
        'Only selected repositories': 'Только выбранные репозитории',
        'Open repository usage options': 'Открыть параметры использования репозитория',
        'ORCID iD': 'Идентификатор ORCID',
        'ORCID provides a persistent identifier - an ORCID iD - that distinguishes you from other\n  researchers. Learn more at': 'ORCID предоставляет постоянный идентификатор - ORCID iD, который отличает вас от других исследователей. Узнайте больше на',
        'Organizations': 'Организации',
        'Organizations can provide their members (including you) and their teams access to GitHub Copilot.': 'Организации могут предоставить своим членам (включая вас) и их командам доступ к GitHub Copilot.',
        'Other users will see the time difference from their local time.': 'Другие пользователи будут видеть разницу во времени по отношению к своему местному времени.',
        'Overview': 'Обзор',
        'Packages permissions': 'Разрешения пакетов',
        'Participating, @mentions and custom': 'Участие, @упоминания и настройки',
        'Password': 'Пароль',
        'Password and authentication': 'Пароль и аутентификация',
        'Passwordless sign-in with biometrics or security keys': 'Вход без пароля с помощью биометрических данных или ключей безопасности',
        'Passkeys': 'Пароли',
        'Pasting a URL while having text selected will format to a Markdown link': 'Вставка URL-адреса при выделенном тексте приведет к форматированию в ссылку Markdown.',
        'Pasting a URL while having text selected will replace the text': 'Вставка URL-адреса при выделенном тексте приведет к замене текста.',
        'Payment history': 'История платежей',
        'Payment information': 'Информация об оплате',
        'Personal access token activity': 'Активность персональных токенов доступа',
        'Personal access tokens': 'Персональные токены доступа',
        'Personal access tokens (classic)': 'Персональные токены доступа (классические)',
        'Personal access tokens (classic) function like ordinary OAuth access tokens. They\n  can be used instead of a password for Git over HTTPS, or can be used to': 'Персональные токены доступа (классические) функционируют как обычные токены доступа OAuth.\n  Их можно использовать вместо пароля для Git по HTTPS, или для',
        'Personal Codespaces created for specific repositories can access other repositories I own': 'Личные кодовые пространства, созданные для определенных репозиториев, могут получать доступ к другим репозиториям, которые мне принадлежат.',
        'Pinned': 'Закреплено',
        'Plain text': 'Обычный текст',
        'Popular repositories': 'Популярные репозитории',
        'Postal/Zip code': 'Почтовый индекс',
        'Preferred 2FA method': 'Предпочтительный метод двухфакторной аутентификации',
        'Preferred default emoji skin tone': 'Предпочтительный цвет кожи эмодзи по умолчанию',
        'Preferred spoken language': 'Предпочтительный язык общения',
        'Preview': 'Предпросмотр',
        'Premium request analytics': 'Аналитика запросов премиум-услуг',
        'Premium requests usage report': 'Отчет об использовании премиум-запросов',
        'Prevents animated images from playing automatically': 'Предотвращает автоматическое воспроизведение анимированных изображений',
        'preview information about other parts of GitHub.': 'предварительный просмотр информации о других частях GitHub.',
        "Price/unit": "Цена за единицу",
        'Primary': 'Начальный',
        'Primary email address': 'Основной адрес электронной почты',
        'Privacy Statement': 'Заявлении о конфиденциальности',
        'privacy statement': 'заявление о конфиденциальности',
        'Private contributions': 'Частный вклад',
        'Private vulnerability reporting': 'Частные сообщения об уязвимостях',
        'Product': 'Продукт',
        'Profile picture': 'Аватар',
        'Profile settings': 'Настройки профиля',
        'Pronouns': 'Местоимения',
        'Public email': 'Публичная электронная почта',
        'Public profile': 'Публичный профиль',
        'public repositories': 'публичных репозиториях',
        'Push protection for yourself': 'Защита для себя',
        'Read more': 'Читать далее',
        'Read more about connecting with third-party applications at': 'Подробнее о подключении сторонних приложений читайте на сайте',
        'Really change your username?': 'Действительно изменить имя пользователя?',
        'Recent events': 'Недавние события',
        'Receive alerts for vulnerabilities that affect your dependencies and manually generate Dependabot pull requests to resolve these vulnerabilities.': 'Получайте уведомления об уязвимостях, которые влияют на ваши зависимости, и вручную создавайте запросы на извлечение Dependabot для устранения этих уязвимостей.',
        'Receive email notifications about security campaigns in repositories where you have access to security alerts.': 'Получайте уведомления по электронной почте о кампаниях по безопасности в репозиториях, где у вас есть доступ к оповещениям о безопасности.',
        'Recovery codes': 'Коды восстановления',
        'Recovery codes can be used to access your account in the event you lose access to your device and cannot receive two-factor authentication codes.': 'Коды восстановления могут быть использованы для доступа к вашей учетной записи в случае, если вы потеряли доступ к своему устройству и не можете получить коды двухфакторной аутентификации.',
        'Recovery options': 'Варианты восстановления',
        'Redeem a coupon': 'Погасить купон',
        'Required for certain countries': 'Требуется для некоторых стран',
        'Region': 'Регион',
        'Reminders allow you to push certain events to authorized instances of Microsoft Teams or Slack.': 'Напоминания позволяют отправлять определенные события в авторизованные экземпляры Microsoft Teams или Slack.',
        'Remove review limits from all repositories': 'Удалить ограничения на просмотр из всех репозиториев',
        'Renaming май take a few minutes to complete.': 'Переименование может занять несколько минут.',
        'Report': 'Пожаловаться',
        'Repository default branch': 'Репозиторий по умолчанию',
        'Repository management': 'Управление репозиториями',
        'Restrict users who are permitted to approve or request changes on pull requests in your public repositories.': 'Ограничьте круг пользователей, которые могут утверждать или запрашивать изменения в пул-реквестах в ваших публичных репозиториях.',
        'results': 'результаты',
        'Run Dependabot security and version updates on self-hosted Actions runners.': 'Запустите обновления безопасности и версий Dependabot на самохостинговых исполнителях Actions.',
        'Save assistive technology hint preferences': 'Сохранить настройки подсказок по вспомогательным технологиям',
        'Save billing information': 'Сохранить платежную информацию',
        'Save content preferences': 'Сохранить настройки контента',
        'Save editor settings': 'Сохранить настройки редактора',
        'Save hovercard preferences': 'Сохранить настройки всплывающих карточек',
        'Save jobs profile': 'Сохранить профиль вакансии',
        'Save keyboard shortcut preferences': 'Сохранить настройки сочетаний клавиш',
        'Save motion preferences': 'Cохранить настройки движения',
        'Save pins': 'Сохранить пины',
        'Save subject claim': 'Сохранить утверждение subject',
        'Save subscription preferences': 'Сохранить настройки подписки',
        'Save Trending settings': 'Сохранить настройки трендов',
        'Saved reply title': 'Сохраненное название ответа',
        'Saved replies': 'Сохраненные ответы',
        'Saved replies are re-usable text snippets that you can use throughout GitHub comment fields.\n    Saved replies can save you time if you’re often typing similar responses.': 'Сохраненные ответы — это многократно используемые текстовые фрагменты, которые вы можете использовать во всех полях комментариев GitHub.\n    Сохраненные ответы могут сэкономить вам время, если вы часто вводите похожие ответы.',
        'Scan the QR code': 'Отсканируйте QR-код',
        'Scheduled reminders': 'Запланированные напоминания',
        'Search by username, full name or email address': 'Поиск по имени пользователя, полному имени или адресу электронной почты',
        'Search by username, full name, or email address': 'Поиск по имени пользователя, полному имени или адресу электронной почты',
        'Security and analysis features help keep your repositories secure and updated. By enabling these features, you\'re granting us permission to perform read-only analysis on your repositories.': 'Функции безопасности и анализа помогают обеспечить безопасность и актуальность ваших репозиториев. Включив эти функции, вы даете нам разрешение на выполнение анализа ваших репозиториев в режиме «только для чтения».',
        'Security and analysis features help keep your repositories secure and updated.': 'Функции безопасности и анализа помогают обеспечить безопасность и актуальность ваших репозиториев.',
        'Security and analysis features help keep you secure and updated, wherever you are.': 'Функции безопасности и анализа помогают вам оставаться в безопасности и быть в курсе событий, где бы вы ни находились.',
        'Security campaign emails': 'Электронные письма в рамках кампании по безопасности',
        'Security keys': 'Ключи безопасности',
        'Security keys are webauthn credentials that can only be used as a second factor of authentication.': 'Ключи безопасности — это учетные данные webauthn, которые можно использовать только в качестве второго фактора аутентификации.',
        'Security log': 'Журнал безопасности',
        'Seeing something unexpected? Take a look at the': 'Видите что-то неожиданное? Посмотрите на',
        'Select an email to be used for account-related notifications and can be used for password reset.': 'Выберите адрес электронной почты, который будет использоваться для уведомлений, связанных с учетной записью, и может быть использован для сброса пароля.',
        'Select an option': 'Выберите вариант',
        'Select if animated images should play automatically.': 'Выберите, должны ли анимированные изображения воспроизводиться автоматически.',
        'Select if URLs should be formatted on paste. You can use **Ctrl** **⇧** **V** to paste a link in the opposite way.': 'Выберите, должны ли URL-адреса форматироваться при вставке. Вы можете использовать **Ctrl** **⇧** **V**, чтобы вставить ссылку противоположным способом.',
        'Select notification channels': 'Выберите каналы уведомлений',
        "Select up to six public repositories or gists you'd like to show to anyone.": "Выберите до шести общедоступных репозиториев или гистов, которые вы хотите показать всем.",
        'Select repository': 'Выбрать репозиторий',
        'Select whether animated images should play automatically.': 'Выберите, должны ли анимированные изображения воспроизводиться автоматически.',
        'Selected repositories': 'Выбранные хранилища',
        'Selected theme: ': 'Выбранная тема: ',
        'Send daily': 'Отправлять ежедневно',
        'Send weekly': 'Отправлять еженедельно',
        'Sessions': 'Сессии',
        'Set status': 'Установить статус',
        'Set your preferred method to use for two-factor authentication when signing into GitHub.': 'Установите предпочтительный метод двухфакторной аутентификации при входе в GitHub.',
        'Setup authenticator app': 'Настроить приложение для аутентификации',
        'Settings Sync': 'Синхронизация настроек',
        'she/her': 'она/ее',
        'Show Achievements on my profile': 'Показать достижения в моем профиле',
        'Show code folding buttons': 'Показать кнопки сворачивания кода',
        'Show Copilot': 'Показать Copilot',
        'Show hovercards': 'Показать всплывающие карточки',
        'Show link underlines': 'Показать подчеркивания ссылок',
        'Show more activity': 'Показать больше активности',
        'Show:': 'Показать:',
        'Sign in methods': 'Способы входа в систему',
        'Sign in with your Apple account': 'Войди с помощью своей учетной записи Apple',
        'Sign in with your Google account': 'Войди с помощью своей учетной записи Google',
        'Single theme': 'Единая тема',
        'SKU': 'Артикул',
        'SMS authentication': 'Аутентификация по SMS',
        'SMS/Text message': 'SMS/текстовое сообщение',
        'Social accounts': 'Социальные сети',
        'Soft dark': 'Мягкая темная',
        'Sort': 'Сортировка',
        'Spaces': 'Пространства',
        'spent': 'потрачено',
        'Sponsorship log': 'Журнал спонсорства',
        'Sponsorships': 'Спонсорство',
        'SSH and GPG keys': 'Ключи SSH и GPG',
        'SSH keys': 'SSH-ключи',
        'Start an application': 'Запустить приложение',
        'Start export': 'Начать экспорт',
        'Start free for 30 days': 'Начните бесплатно на 30 дней',
        'Start sponsoring': 'Начать спонсировать',
        'Start your first organization': 'Начните свою первую организацию',
        'State/Province': 'Штат/провинция',
        'Stop usage': 'Прекратить использование',
        'Subscriptions': 'Подписки',
        'Subscription preferences for': 'Настройки подписки для',
        'Successor settings': 'Настройки преемника',
        'Suggestions matching public code': 'Предложения, соответствующие публичному коду',
        'Sync with system': 'Синхронизация с системой',
        'System': 'Система',
        'Tab size preference': 'Предпочтения по размеру вкладок',
        'Temporary interaction limits': 'Временные ограничения взаимодействия',
        'Temporarily restrict which external users can interact with your repositories (comment, open issues, or create pull requests) for a configurable period of time.': 'Временно ограничьте круг внешних пользователей, которые могут взаимодействовать с вашими репозиториями (комментировать, открывать задачи или создавать пул-реквесты) на настраиваемый период времени.',
        'The basics for all developers': 'Основы для всех разработчиков',
        'The following repositories will be referenced by GPG verification and Settings Sync.': 'Следующие репозитории будут использоваться для проверки GPG и синхронизации настроек.',
        'The host image defines the operating system in which development containers run. These images receive periodic upgrades for security, functionality, and performance.\n    GitHub Codespaces offers early access to beta images to ensure compatibility with existing development container configurations.\n    Any codespace created or resumed after changing this setting will use the specified image configuration.': 'Базовый образ определяет операционную систему, в которой работают контейнеры разработки. Эти образы получают периодические обновления для безопасности, функциональности и производительности.\n    GitHub Codespaces предоставляет ранний доступ к бета-образам для обеспечения совместимости с существующими конфигурациями контейнеров разработки.\n    Любое кодовое пространство, созданное или возобновленное после изменения этого параметра, будет использовать указанную конфигурацию образа.',
        'Theme mode': 'Тематический режим',
        'Theme preferences': 'Предпочтения по темам',
        'they/them': 'они/их',
        'There are no Codespace secrets.': 'В Codespace нет секретов.',
        'There are no GPG keys associated with your account.': 'С вашей учетной записью не связано ни одного ключа GPG.',
        'There are no SSH keys associated with your account.': 'С вашей учетной записью не связаны никакие ключи SSH.',
        'There are no verified domains.': 'Нет проверенных доменов.',
        'These are packages that have been previously deleted belonging to you. You can restore a package deleted within the last 30 days.': 'Это пакеты, которые были ранее удалены и принадлежали вам. Вы можете восстановить пакет, удаленный в течение последних 30 дней.',
        'This email address is the default for GitHub notifications, such as replies to issues, pull requests, and similar activity.': 'Этот адрес электронной почты является адресом по умолчанию для уведомлений GitHub, таких как ответы на вопросы, запросы на извлечение и аналогичные действия.',
        'This includes Actions, Git LFS, Packages, and Codespaces': 'Это включает Actions, Git LFS, Packages и Codespaces',
        'This is a list of devices that have logged into your account. Revoke any sessions that you do not recognize.': 'Это список устройств, которые вошли в вашу учетную запись. Отмените все сеансы, которые вы не узнаете.',
        'This is extremely important.': 'Это чрезвычайно важно.',
        'This is where you can review activity from your sponsorships.': 'Здесь вы можете просматривать активность ваших спонсоров.',
        'This setting will be applied to new Container, npm, rubygems and NuGet packages.': 'Этот параметр будет применен к новым пакетам Container, npm, rubygems и NuGet.',
        'This theme will be active when your system is set to "dark mode"': 'Эта тема будет активна, когда ваша система настроена на "темный режим"',
        'This theme will be active when your system is set to "light mode"': 'Эта тема будет активна, когда ваша система настроена на "светлый режим"',
        'This will include any commit attributed to your account but not signed with your GPG or\n        S/MIME key.': 'Это включит все коммиты, приписываемые вашей учетной записи, но не подписанные вашим ключом GPG или S/MIME.',
        'Time zone': 'Часовой пояс',
        'To enable Models paid usage, a payment method is needed.': 'Для включения платного использования Models необходим способ оплаты.',
        'To get started, install GitHub Mobile for': 'Чтобы начать, установите GitHub Mobile для',
        'to learn more about how we use this information.': 'чтобы узнать больше о том, как мы используем эту информацию.',
        'To stop receiving emails for the topics below, uncheck any topics you don\'t want to receive, then click Save subscription preferences': 'Чтобы отказаться от получения писем по нижеперечисленным темам, снимите галочки с тех тем, которые вы не хотите получать, а затем нажмите «Сохранить настройки подписки».',
        'Toggle the visibility of underlines on links that are adjacent to text.': 'Включение/выключение отображения подчеркиваний на ссылках, расположенных рядом с текстом.',
        'Tokens (classic)': 'Токены (классические)',
        'Transform account': 'Преобразовать учетную запись',
        'Trending settings': 'Настройки трендов',
        'Trending Repositories': 'Популярные репозитории',
        'Trusted repositories': 'Надежные репозитории',
        'Turn on included usage email alerts': 'Включить оповещения о включенном использовании по email',
        'Turn off included usage email alerts': 'Отключить оповещения о включенном использовании по email',
        'Two-factor authentication': 'Двухфакторная аутентификация',
        'Two-factor authentication (2FA) is now enabled for your GitHub account': 'Двухфакторная аутентификация (2FA) теперь включена для вашей учетной записи GitHub.',
        'Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in.': 'Двухфакторная аутентификация добавляет дополнительный уровень безопасности к вашей учетной записи, требуя для входа не только пароль.',
        'Two-factor authentication is not enabled yet.': 'Двухфакторная аутентификация еще не включена.',
        'Two-factor methods': 'Двухфакторные методы',
        'Type': 'Тип',
        'Understand your dependencies.': 'Поймите свои зависимости.',
        'Unfollow': 'Отписаться',
        'Units': 'Единицы',
        'unintended side effects': 'непредвиденные побочные эффекты',
        'Unsubscribe from all topics': 'Отписаться от всех тем',
        'Update preference': 'Обновить настройки',
        'Update preferences': 'Обновление настроек',
        'Update profile': 'Обновление профиля',
        'Upgrade Copilot': 'Обновление Copilot',
        "Upgrade for higher limits, premium models, AI reviews.\n                      \n                      Free responses reset in 14 days.": "Обновитесь для увеличения лимитов, премиальных моделей и проверок с помощью ИИ.\n                      \n                      Бесплатные ответы восстанавливаются через 14 дней.",
        'Upgrade to GitHub Pro': 'Переход на GitHub Pro',
        'URL paste behavior': 'Поведение при вставке URL-адреса',
        'Usage': 'Использование',
        'Usage analytics for premium requests in your personal account.': 'Аналитика использования премиум-запросов в личном кабинете.',
        'Usage breakdown': 'Разбивка по использованию',
        'Usage by products': 'Использование по продуктам',
        'Usage by repository': 'Использование по репозиторию',
        'Use a beta image configuration when available. Otherwise, use the latest stable configuration.': 'Используйте бета-версию конфигурации, если она доступна. В противном случае используйте последнюю стабильную версию конфигурации.',
        'Use a fixed-width (monospace) font when editing Markdown': 'Используйте шрифт с фиксированной шириной (моноширинный) при редактировании Markdown.',
        'Use an authentication app or browser extension to get two-factor authentication codes when prompted.': 'Используйте приложение для аутентификации или расширение браузера, чтобы получить коды двухфакторной аутентификации, когда это будет предложено.',
        'Use default template': 'Использовать шаблон по умолчанию',
        'Use immutable subject claim': 'Использовать неизменяемое утверждение subject',
        'Use this prefix when configuring trust policies in your cloud provider.': 'Используйте этот префикс при настройке политик доверия в вашем облачном провайдере.',
        'Users that have recently created their account will be unable to interact with your repositories.': 'Пользователи, которые недавно создали свою учетную запись, не смогут взаимодействовать с вашими репозиториями.',
        'Users that have not previously committed to the default branch of one of your repositories will be unable to interact with that repository.': 'Пользователи, которые ранее не делали коммиты в ветку по умолчанию одного из ваших репозиториев, не смогут взаимодействовать с этим репозиторием.',
        'Users that are not collaborators of one of your repositories will not be able to interact with that repository.': 'Пользователи, которые не являются участниками одного из ваших репозиториев, не смогут взаимодействовать с этим репозиторием.',
        'VAT/GST ID': 'Идентификационный номер НДС/GST',
        'Verify domains to restrict who can publish GitHub Pages on them.': 'Проверяйте домены, чтобы ограничить круг лиц, которые могут публиковать на них страницы GitHub.',
        'Verify the code from the app': 'Проверьте код из приложения',
        'Verified domains': 'Проверенные домены',
        'View all repository usage': 'Просмотреть все использования репозитория',
        'View documentation': 'Просмотр документации',
        'View GitHub Profile': 'Просмотреть профиль GitHub',
        'View ignored repositories': 'Просмотреть игнорируемые репозитории',
        'View watched repositories': 'Просмотр просмотренных репозиториев',
        'Vigilant mode': 'Режим бдительности',
        'Visit Marketplace': 'Посетите торговую площадку',
        'VS Code Settings Sync will be available in Codespaces': 'Синхронизация настроек VS Code будет доступна в Codespaces',
        'Want to build something that integrates with and extends GitHub? Register a new GitHub App to get started developing on the GitHub API.': 'Хотите создать что-то, что интегрируется с GitHub и расширяет его возможности? Зарегистрируйте новое приложение GitHub, чтобы начать разработку на API GitHub.',
        'Warn me when a blocked user is a prior contributor to a repository': 'Предупреждать, когда заблокированный пользователь является предыдущим автором репозитория',
        'Warning notifications for codespace deletions will be enabled': 'Будут включены предупреждающие уведомления об удалении кодовых пространств.',
        'watching': 'Наблюдателей',
        'We **will** create redirects for your repositories\n                (web and git access).': 'Мы **будем** создавать перенаправления для ваших репозиториев (веб-доступ и git-доступ).',
        'We **will not** set up redirects for your old profile page.': 'Мы **не будем** настраивать перенаправления для вашей старой страницы профиля.',
        'We **will not** set up redirects for Pages sites.': 'Мы **не будем** настраивать перенаправления для сайтов Pages.',
        'We will **immediately delete all of your repositories\n              (2)**, along with all of your forks,\n              wikis, issues, pull requests, and GitHub Pages sites.': 'Мы **немедленно удалим все ваши репозитории (2)**, вместе со всеми вашими форками, вики, задачами, пулл-реквестами и сайтами GitHub Pages.',
        'We will determine the closest available region based on your location (IP address) at codespace creation time.': 'Мы определим ближайший доступный регион на основе вашего местоположения (IP-адреса) на момент создания кодового пространства.',
        'Web sessions': 'Веб-сессии',
        "We'll use this language preference to filter the trending repository lists on": "Мы будем использовать этот языковой параметр для фильтрации списков популярных репозиториев на",
        'When disabled, Copilot will be hidden and unavailable. This setting does not apply to Copilot search on GitHub Docs.': 'При отключении Copilot будет скрыт и недоступен. Этот параметр не применяется к поиску Copilot в GitHub Docs.',
        '. When disabled, you cannot view or create any Copilot Spaces.': '. Когда эта функция отключена, вы не можете просматривать или создавать какие-либо пространства Copilot.',
        '. When disabled, you cannot create individual spaces.': '. Когда эта функция отключена, вы не можете создавать индивидуальные пространства.',
        '.\n                When disabled, you cannot share individual spaces.': '.\n                Когда эта функция отключена, вы не можете делиться индивидуальными пространствами.',
        'When enabled, you will receive emails when your codespaces are nearing deletion due to inactivity.': 'Если эта функция включена, вы будете получать электронные письма, когда ваши кодовые пространства будут близки к удалению из-за бездействия.',
        'When selected, use upstream template for the subject claim. Unselect to set a custom template.': 'При выборе используется стандартный шаблон для утверждения subject. Снимите флажок, чтобы установить пользовательский шаблон.',
        'When you are given admin permissions to an organization, automatically receive notifications when a new deploy key is added.': 'Когда вам предоставляются права администратора в организации, вы автоматически получаете уведомления о добавлении нового ключа развертывания.',
        'When you push to GitHub, we\'ll check the most recent commit. If the author email on that commit is a private email on your GitHub account, we will block the push and warn you about exposing your private email.': 'Когда вы отправляете данные в GitHub, мы проверяем последнюю фиксацию. Если адрес электронной почты автора этой фиксации является личным адресом в вашей учетной записи GitHub, мы блокируем отправку и предупреждаем вас о раскрытии вашего личного адреса электронной почты.',
        "When you push to GitHub, we’ll check the most recent commit. If the author email on that commit is a private email on your GitHub account, we will block the push and warn you about exposing your private email.": "Когда вы отправляете данные в GitHub, мы проверяем последнюю фиксацию. Если адрес электронной почты автора этой фиксации является личным адресом в вашей учетной записи GitHub, мы блокируем отправку и предупреждаем вас о раскрытии вашего личного адреса электронной почты.",
        "When you're given access to": "Когда вам предоставляется доступ к",
        'With CI/CD, Dependabot, and the world\'s largest developer community, GitHub gives your team everything they need to ship better software faster': 'Благодаря CI/CD, Dependabot и крупнейшему в мире сообществу разработчиков GitHub предоставляет вашей команде все необходимое для более быстрого выпуска более качественного программного обеспечения.',
        'With Copilot coding agent, you can delegate tasks to Copilot, freeing you to focus\n    on the creative, complex, and high-impact work that matters most. Simply assign an issue to Copilot, wait\n    for the agent to request your review, then leave feedback on the pull request to iterate.': 'С помощью агента кодирования Copilot вы можете делегировать задачи Copilot, освобождая себя для сосредоточения\n    на творческой, сложной и важной работе. Просто назначьте задачу Copilot, дождитесь,\n    когда агент запросит вашу проверку, затем оставьте отзыв в пул-реквесте для итерации.',
        'Yesterday\'s activity': 'Активность за вчера',
        'You are not a member of any organizations.': 'Вы не являетесь членом каких-либо организаций.',
        'You can': 'Вы можете',
        'You can **@mention** other users and\n                    organizations to link to them.': 'Вы можете **@упоминать** других пользователей и организации, чтобы ссылаться на них.',
        'You can **@mention** your company’s GitHub\n                        organization to link it.': 'Вы можете **@упомянуть** организацию вашей компании на GitHub, чтобы создать ссылку на неё.',
        'You can configure environments with protection rules, variables, and secrets.': 'Вы можете настраивать среды с помощью правил защиты, переменных и секретных данных.',
        'You can block a user to deny them access to repositories and more.': 'Вы можете заблокировать пользователя, чтобы лишить его доступа к репозиториям и другим функциям.',
        "You can enable Copilot coding agent for other users, but you won't be able to assign tasks to Copilot because you don't have a Copilot Pro, Copilot Pro+, Copilot Business or Copilot Enterprise license.": "Вы можете включить агент кодирования Copilot для других пользователей, но не сможете назначать задачи Copilot, поскольку у вас нет лицензии Copilot Pro, Copilot Pro+, Copilot Business или Copilot Enterprise.",
        'You can remove it at any time.': 'Вы можете удалить его в любое время.',
        'You can use': 'Вы можете использовать',
        'You can use Copilot Chat in GitHub.com. Preview features are only available for paid licenses.': 'Вы можете использовать Copilot Chat на GitHub.com. Функции предварительного просмотра доступны только для платных лицензий.',
        'You can use the latest Anthropic Claude Haiku 4.5 model.': 'Вы можете использовать последнюю версию модели Anthropic Claude Haiku 4.5.',
        'You can use the latest Raptor mini model.': 'Вы можете использовать новейшую модель Raptor mini.',
        'You currently have': 'В данный момент у вас есть',
        'You do not belong to any organizations.': 'Вы не являетесь членом никаких организаций.',
        "You don't have an active coupon.": "У вас нет активного купона.",
        "You don't have any enterprises": "У вас нет предприятий",
        'You have enabled two-factor authentication using your authenticator app.': 'Вы включили двухфакторную аутентификацию с помощью приложения-аутентификатора.',
        'You have no GitHub Apps installed on this account.': 'В этой учетной записи не установлено ни одного приложения GitHub.',
        'You have not blocked any users.': 'Вы не заблокировали ни одного пользователя.',
        'You have not designated a successor.': 'Вы не назначили преемника.',
        'You have not made any payments.': 'Вы не произвели никаких платежей.',
        'You have set your email address to private. To toggle email privacy, go to': 'Вы установили свой адрес электронной почты как частный. Чтобы изменить настройки конфиденциальности электронной почты, перейдите в раздел',
        'You will have access to the feature': 'Вы получите доступ к этой функции',
        "You won't have access to the feature": "У вас не будет доступа к этой функции",
        'You\'ll never be notified.': 'Вы никогда не будете уведомлены.',
        'You\'ll be prompted to verify your identity before account deletion.': 'Перед удалением аккаунта вам будет предложено подтвердить вашу личность.',
        'You\'re currently not sponsoring anyone.': 'В настоящее время вы никого не спонсируете.',
        'You’re not watching any repositories.': 'Вы не следите ни за одним репозиторием.',
        'Your achievements will be shown on your profile.': 'Ваши достижения будут отображаться в вашем профиле.',
        'Your AI pair programmer': 'Ваш программист-партнер с искусственным интеллектом',
        'Your backup GitHub email address will be used as an additional destination for security-relevant account notifications and can also be used for password resets.': 'Ваш резервный адрес электронной почты GitHub будет использоваться в качестве дополнительного адреса для получения уведомлений, связанных с безопасностью учетной записи, а также может использоваться для сброса пароля.',
        'Your contribution graph, achievements, and activity overview will show your private contributions without revealing any repository or\n              organization information.': 'Ваш график вкладов, достижения и обзор активности будут показывать ваши приватные вклады, не раскрывая информацию о репозиториях или организациях.',
        'Your default region will be used to designate compute resources to your codespaces. GitHub can set your region automatically based on your location, or you can set it yourself. Codespaces are deployed to a subset of Azure regions.': 'Ваш регион по умолчанию будет использоваться для выделения вычислительных ресурсов для ваших кодовых пространств. GitHub может установить ваш регион автоматически на основе вашего местоположения, или вы можете установить его самостоятельно. Кодовые пространства развертываются в подмножестве регионов Azure.',
        'Your name may appear around GitHub where you contribute or are mentioned.': 'Ваше имя может появляться на GitHub в тех местах, где вы участвуете или упоминаетесь.',
        'Your personal account': 'Ваш личный кабинет',
        'Your personal account cannot be converted to an organization.\n    You must create a new organization and transfer your repositories and projects to it instead.\n    You can then rename your personal account and the organization if you want your organization to have the\n    same name that you are currently using for your personal account.': 'Ваш личный аккаунт нельзя преобразовать в организацию. Вместо этого вам необходимо создать новую организацию и перенести в неё свои репозитории и проекты. После этого вы можете переименовать свой личный аккаунт и организацию, если хотите, чтобы у организации было то же имя, которое вы сейчас используете для личного аккаунта.',
        'Your username or email:': 'Ваше имя пользователя или email:',

        // Плейсхолдеры
        'Add a short title to your reply': 'Добавьте краткий заголовок к вашему ответу',
        'Add your saved reply': 'Добавить сохраненный ответ',
        'Email address': 'Адрес электронной почты',
        'Enter a valid URL': 'Введите действительный URL-адрес',
        'Filter assignees': 'Фильтр исполнителей',
        'Filter authors': 'Фильтр авторов',
        'Filter caches': 'Кэши фильтров',
        'Filter deployments': 'Фильтры развертывания',
        'Filter files…': 'Фильтр файлов…',
        'Filter headings': 'Фильтр по заголовкам',
        'Filter labels': 'Фильтр меток',
        'Filter lists': 'Списки фильтров',
        'Filter milestones ': 'Фильтр этапов',
        'Filter projects': 'Фильтр проектов',
        'Filter provider': 'Фильтр по поставщику',
        'Filter repositories and gists': 'Фильтровать репозитории и gists',
        'Filter organizations': 'Фильтр по организациям',
        'Filter secret type': 'Фильтр по типу секрета',
        'Filter users': 'Фильтр пользователей',
        'Filter values': 'Значения фильтра',
        'Filter workflow runs': 'Запуски рабочих процессов фильтрации',
        'Find a branch': 'Найти ветку',
        'Find a branch...': 'Найти ветку...',
        'Find a member…': 'Найти участника…',
        'Find a repository…': 'Найти репозиторий…',
        'Find a user...': 'Найти пользователя...',
        'Find or create a branch...': 'Найти или создать ветку...',
        'Go to file': 'Перейти к файлу',
        'No results found.': 'Ничего не найдено.',
        'Nothing to preview': 'Предварительного просмотра нет',
        "Link to social profile 1": "Ссылка на соцсеть 1",
        "Link to social profile 2": "Ссылка на соцсеть 2",
        "Link to social profile 3": "Ссылка на соцсеть 3",
        "Link to social profile 4": "Ссылка на соцсеть 4",
        'Search': 'Поиск',
        'Search...': 'Поиск...',
        'Search all discussions': 'Поиск по всем обсуждениям',
        'Search all issues': 'Поиск по всем выпускам',
        'Search all labels': 'Поиск по всем меткам',
        'Search all projects': 'Поиск по всем проектам',
        'Search branches...': 'Поиск веток...',
        'Search by name…': 'Поиск по названию…',
        'Search deleted packages': 'Поиск удалённых пакетов',
        'Search Issues': 'Поиск задач',
        'Search for apps, actions, and models': 'Поиск приложений, действий и моделей',
        'Search notifications': 'Поиск уведомлений',
        'Search MCPs': 'Поиск MCP',
        'Search or create a new tag': 'Найти или создать новый тег',
        'Search or filter': 'Поиск или фильтр',
        'Search or filter usage': 'Поиск или фильтрация использования',
        'Search packages…': 'Поиск пакетов…',
        'Search repositories': 'Поиск в репозиториях',
        'Search starred repositories': 'Поиск репозиториев, отмеченных звездочкой',
        'Search within code': 'Поиск в коде',
        'Search workflows': 'Поиск рабочих процессов',
        'Select a verified email to display': 'Выберите подтвержденный адрес электронной почты для отображения',
        'Tell us a little bit about yourself': 'Расскажите нам немного о себе',
        'Use Markdown to format your comment': 'Используйте Markdown для форматирования своего комментария',
        'Write a description': 'Напишите описание',

        // Языки для выпадающего списка
        'No Preference' : 'Без предпочтений',
        'Abkhazian' : 'Абхазский',
        'Afar' : 'Афарский',
        'Afrikaans' : 'Африкаанс',
        'Akan' : 'Акан',
        'Albanian' : 'Албанский',
        'Amharic' : 'Амхарский',
        'Arabic' : 'Арабский',
        'Aragonese' : 'Арагонский',
        'Armenian' : 'Армянский',
        'Assamese' : 'Ассамский',
        'Avaric' : 'Аварский',
        'Avestan' : 'Авестийский',
        'Aymara' : 'Аймара',
        'Azerbaijani' : 'Азербайджанский',
        'Bambara' : 'Бамбара',
        'Bashkir' : 'Башкирский',
        'Basque' : 'Баскский',
        'Belarusian' : 'Белорусский',
        'Bengali' : 'Бенгальский',
        'Bihari languages' : 'Бихари',
        'Bislama' : 'Бислама',
        'Bosnian' : 'Боснийский',
        'Breton' : 'Бретонский',
        'Bulgarian' : 'Болгарский',
        'Burmese' : 'Бирманский',
        'Catalan, Valencian' : 'Каталанский, Валенсийский',
        'Chamorro' : 'Чаморро',
        'Chechen' : 'Чеченский',
        'Chichewa, Chewa, Nyanja' : 'Чичева, Чева, Ньянджа',
        'Chinese' : 'Китайский',
        'Chuvash' : 'Чувашский',
        'Cornish' : 'Корнский',
        'Corsican' : 'Корсиканский',
        'Cree' : 'Кри',
        'Croatian' : 'Хорватский',
        'Czech' : 'Чешский',
        'Danish' : 'Датский',
        'Divehi, Dhivehi, Maldivian' : 'Дивехи, Мальдивский',
        'Dutch, Flemish' : 'Нидерландский, Фламандский',
        'Dzongkha' : 'Дзонг-кэ',
        'English' : 'Английский',
        'Esperanto' : 'Эсперанто',
        'Estonian' : 'Эстонский',
        'Ewe' : 'Эве',
        'Faroese' : 'Фарерский',
        'Fijian' : 'Фиджийский',
        'Finnish' : 'Финский',
        'French' : 'Французский',
        'Fulah' : 'Фула',
        'Galician' : 'Галисийский',
        'Georgian' : 'Грузинский',
        'German' : 'Немецкий',
        'Greek, Modern' : 'Греческий (современный)',
        'Guarani' : 'Гуарани',
        'Gujarati' : 'Гуджарати',
        'Haitian, Haitian Creole' : 'Гаитянский, Гаитянский креольский',
        'Hausa' : 'Хауса',
        'Hebrew' : 'Иврит',
        'Herero' : 'Гереро',
        'Hindi' : 'Хинди',
        'Hiri Motu' : 'Хири-моту',
        'Hungarian' : 'Венгерский',
        'Interlingua (International Auxil...' : 'Интерлингва',
        'Indonesian' : 'Индонезийский',
        'Interlingue, Occidental' : 'Интерлингве, Окциденталь',
        'Irish' : 'Ирландский',
        'Igbo' : 'Игбо',
        'Inupiaq' : 'Инупиак',
        'Ido' : 'Идо',
        'Icelandic' : 'Исландский',
        'Italian' : 'Итальянский',
        'Inuktitut' : 'Инуктитут',
        'Japanese' : 'Японский',
        'Javanese' : 'Яванский',
        'Kalaallisut, Greenlandic' : 'Гренландский',
        'Kannada' : 'Каннада',
        'Kanuri' : 'Канури',
        'Kashmiri' : 'Кашмири',
        'Kazakh' : 'Казахский',
        'Central Khmer' : 'Кхмерский',
        'Kikuyu, Gikuyu' : 'Кикуйю',
        'Kinyarwanda' : 'Киньяруанда',
        'Kirghiz, Kyrgyz' : 'Киргизский',
        'Komi' : 'Коми',
        'Kongo' : 'Конго',
        'Korean' : 'Корейский',
        'Kurdish' : 'Курдский',
        'Kuanyama, Kwanyama' : 'Кваньяма',
        'Latin' : 'Латинский',
        'Luxembourgish, Letzeburgesch' : 'Люксембургский',
        'Ganda' : 'Ганда',
        'Limburgan, Limburger, Limburgish' : 'Лимбургский',
        'Lingala' : 'Лингала',
        'Lao' : 'Лаосский',
        'Lithuanian' : 'Литовский',
        'Luba-Katanga' : 'Луба-Катанга',
        'Latvian' : 'Латышский',
        'Manx' : 'Мэнский',
        'Macedonian' : 'Македонский',
        'Malagasy' : 'Малагасийский',
        'Malay' : 'Малайский',
        'Malayalam' : 'Малаялам',
        'Maltese' : 'Мальтийский',
        'Maori' : 'Маори',
        'Marathi' : 'Маратхи',
        'Marshallese' : 'Маршалльский',
        'Mongolian' : 'Монгольский',
        'Nauru' : 'Науру',
        'Navajo, Navaho' : 'Навахо',
        'North Ndebele' : 'Северный ндебеле',
        'Nepali' : 'Непальский',
        'Ndonga' : 'Ндонга',
        'Norwegian Bokmål' : 'Норвежский (букмол)',
        'Norwegian Nynorsk' : 'Норвежский (нюнорск)',
        'Norwegian' : 'Норвежский',
        'Sichuan Yi, Nuosu' : 'Носу',
        'South Ndebele' : 'Южный ндебеле',
        'Occitan' : 'Окситанский',
        'Ojibwa' : 'Оджибве',
        'Church Slavic, Old Slavonic, Chu...' : 'Церковнославянский, Старославянский',
        'Oromo' : 'Оромо',
        'Oriya' : 'Ория',
        'Ossetian, Ossetic' : 'Осетинский',
        'Punjabi, Panjabi' : 'Панджаби',
        'Pali' : 'Пали',
        'Persian' : 'Персидский',
        'Polish' : 'Польский',
        'Pashto, Pushto' : 'Пушту',
        'Portuguese' : 'Португальский',
        'Quechua' : 'Кечуа',
        'Romansh' : 'Романшский',
        'Rundi' : 'Рунди',
        'Romanian, Moldavian, Moldovan' : 'Румынский, Молдавский',
        'Russian' : 'Русский',
        'Sanskrit' : 'Санскрит',
        'Sardinian' : 'Сардинский',
        'Sindhi' : 'Синдхи',
        'Northern Sami' : 'Северносаамский',
        'Samoan' : 'Самоанский',
        'Sango' : 'Санго',
        'Serbian' : 'Сербский',
        'Gaelic, Scottish Gaelic' : 'Гэльский, Шотландский гэльский',
        'Shona' : 'Шона',
        'Sinhala, Sinhalese' : 'Сингальский',
        'Slovak' : 'Словацкий',
        'Slovenian' : 'Словенский',
        'Somali' : 'Сомалийский',
        'Southern Sotho' : 'Южный сото',
        'Spanish, Castilian' : 'Испанский, Кастильский',
        'Sundanese' : 'Сунданский',
        'Swahili' : 'Суахили',
        'Swati' : 'Свази',
        'Swedish' : 'Шведский',
        'Tamil' : 'Тамильский',
        'Telugu' : 'Телугу',
        'Tajik' : 'Таджикский',
        'Thai' : 'Тайский',
        'Tigrinya' : 'Тигринья',
        'Tibetan' : 'Тибетский',
        'Turkmen' : 'Туркменский',
        'Tagalog' : 'Тагальский',
        'Tswana' : 'Тсвана',
        'Tonga (Tonga Islands)' : 'Тонга',
        'Turkish' : 'Турецкий',
        'Tsonga' : 'Тсонга',
        'Tatar' : 'Татарский',
        'Twi' : 'Тви',
        'Tahitian' : 'Таитянский',
        'Uighur, Uyghur' : 'Уйгурский',
        'Ukrainian' : 'Украинский',
        'Urdu' : 'Урду',
        'Uzbek' : 'Узбекский',
        'Venda' : 'Венда',
        'Vietnamese' : 'Вьетнамский',
        'Volapük' : 'Волапюк',
        'Walloon' : 'Валлонский',
        'Welsh' : 'Валлийский',
        'Wolof' : 'Волоф',
        'Western Frisian' : 'Западнофризский',
        'Xhosa' : 'Коса',
        'Yiddish' : 'Идиш',
        'Yoruba' : 'Йоруба',
        'Zhuang, Chuang' : 'Чжуанский',
        'Zulu' : 'Зулу',

        // Страны для выпадающего списка
        'Choose your country/region' : 'Выберите страну/регион',
        'Afghanistan' : 'Афганистан',
        'Åland' : 'Аландские острова',
        'Albania' : 'Албания',
        'Algeria' : 'Алжир',
        'American Samoa' : 'Американское Самоа',
        'Andorra' : 'Андорра',
        'Angola' : 'Ангола',
        'Anguilla' : 'Ангилья',
        'Antarctica' : 'Антарктида',
        'Antigua and Barbuda' : 'Антигуа и Барбуда',
        'Argentina' : 'Аргентина',
        'Armenia' : 'Армения',
        'Aruba' : 'Аруба',
        'Australia' : 'Австралия',
        'Austria' : 'Австрия',
        'Azerbaijan' : 'Азербайджан',
        'Bahamas' : 'Багамские острова',
        'Bahrain' : 'Бахрейн',
        'Bangladesh' : 'Бангладеш',
        'Barbados' : 'Барбадос',
        'Belarus' : 'Беларусь',
        'Belgium' : 'Бельгия',
        'Belize' : 'Белиз',
        'Benin' : 'Бенин',
        'Bermuda' : 'Бермудские острова',
        'Bhutan' : 'Бутан',
        'Bolivia' : 'Боливия',
        'Bonaire, Sint Eustatius and Saba' : 'Бонайре, Синт-Эстатиус и Саба',
        'Bosnia and Herzegovina' : 'Босния и Герцеговина',
        'Botswana' : 'Ботсвана',
        'Bouvet Island' : 'Остров Буве',
        'Brazil' : 'Бразилия',
        'British Indian Ocean Territory' : 'Британская территория в Индийском океане',
        'Brunei Darussalam' : 'Бруней-Даруссалам',
        'Bulgaria' : 'Болгария',
        'Burkina Faso' : 'Буркина-Фасо',
        'Burundi' : 'Бурунди',
        'Cambodia' : 'Камбоджа',
        'Cameroon' : 'Камерун',
        'Canada' : 'Канада',
        'Cape Verde' : 'Кабо-Верде',
        'Cayman Islands' : 'Каймановы острова',
        'Central African Republic' : 'Центральноафриканская Республика',
        'Chad' : 'Чад',
        'Chile' : 'Чили',
        'China' : 'Китай',
        'Christmas Island' : 'Остров Рождества',
        'Cocos (Keeling) Islands' : 'Кокосовые (Килинг) острова',
        'Colombia' : 'Колумбия',
        'Comoros' : 'Коморские острова',
        'Congo (Brazzaville)' : 'Конго (Браззавиль)',
        'Congo (Kinshasa)' : 'Конго (Киншаса)',
        'Cook Islands' : 'Острова Кука',
        'Costa Rica' : 'Коста-Рика',
        'Côte d\'Ivoire' : 'Кот-д\'Ивуар',
        'Croatia' : 'Хорватия',
        'Curaçao' : 'Кюрасао',
        'Cyprus' : 'Кипр',
        'Czech Republic' : 'Чехия',
        'Denmark' : 'Дания',
        'Djibouti' : 'Джибути',
        'Dominica' : 'Доминика',
        'Dominican Republic' : 'Доминиканская Республика',
        'Ecuador' : 'Эквадор',
        'Egypt' : 'Египет',
        'El Salvador' : 'Сальвадор',
        'Equatorial Guinea' : 'Экваториальная Гвинея',
        'Eritrea' : 'Эритрея',
        'Estonia' : 'Эстония',
        'Ethiopia' : 'Эфиопия',
        'Falkland Islands' : 'Фолклендские острова',
        'Faroe Islands' : 'Фарерские острова',
        'Fiji' : 'Фиджи',
        'Finland' : 'Финляндия',
        'France' : 'Франция',
        'French Guiana' : 'Французская Гвиана',
        'French Polynesia' : 'Французская Полинезия',
        'French Southern Lands' : 'Французские Южные территории',
        'Gabon' : 'Габон',
        'Gambia' : 'Гамбия',
        'Georgia' : 'Грузия',
        'Germany' : 'Германия',
        'Ghana' : 'Гана',
        'Gibraltar' : 'Гибралтар',
        'Greece' : 'Греция',
        'Greenland' : 'Гренландия',
        'Grenada' : 'Гренада',
        'Guadeloupe' : 'Гваделупа',
        'Guam' : 'Гуам',
        'Guatemala' : 'Гватемала',
        'Guernsey' : 'Гернси',
        'Guinea' : 'Гвинея',
        'Guinea-Bissau' : 'Гвинея-Бисау',
        'Guyana' : 'Гайана',
        'Haiti' : 'Гаити',
        'Heard and McDonald Islands' : 'Острова Херд и Макдональд',
        'Honduras' : 'Гондурас',
        'Hong Kong' : 'Гонконг',
        'Hungary' : 'Венгрия',
        'Iceland' : 'Исландия',
        'India' : 'Индия',
        'Indonesia' : 'Индонезия',
        'Iran' : 'Иран',
        'Iraq' : 'Ирак',
        'Ireland' : 'Ирландия',
        'Isle of Man' : 'Остров Мэн',
        'Israel' : 'Израиль',
        'Italy' : 'Италия',
        'Jamaica' : 'Ямайка',
        'Japan' : 'Япония',
        'Jersey' : 'Джерси',
        'Jordan' : 'Иордания',
        'Kazakhstan' : 'Казахстан',
        'Kenya' : 'Кения',
        'Kiribati' : 'Кирибати',
        'Korea, South' : 'Республика Корея',
        'Kuwait' : 'Кувейт',
        'Kyrgyzstan' : 'Кыргызстан',
        'Laos' : 'Лаос',
        'Latvia' : 'Латвия',
        'Lebanon' : 'Ливан',
        'Lesotho' : 'Лесото',
        'Liberia' : 'Либерия',
        'Libya' : 'Ливия',
        'Liechtenstein' : 'Лихтенштейн',
        'Lithuania' : 'Литва',
        'Luxembourg' : 'Люксембург',
        'Macau' : 'Макао',
        'Macedonia' : 'Северная Македония',
        'Madagascar' : 'Мадагаскар',
        'Malawi' : 'Малави',
        'Malaysia' : 'Малайзия',
        'Maldives' : 'Мальдивы',
        'Mali' : 'Мали',
        'Malta' : 'Мальта',
        'Marshall Islands' : 'Маршалловы острова',
        'Martinique' : 'Мартиника',
        'Mauritania' : 'Мавритания',
        'Mauritius' : 'Маврикий',
        'Mayotte' : 'Майотта',
        'Mexico' : 'Мексика',
        'Micronesia' : 'Микронезия',
        'Moldova' : 'Молдова',
        'Monaco' : 'Монако',
        'Mongolia' : 'Монголия',
        'Montenegro' : 'Черногория',
        'Montserrat' : 'Монтсеррат',
        'Morocco' : 'Марокко',
        'Mozambique' : 'Мозамбик',
        'Myanmar' : 'Мьянма',
        'Namibia' : 'Намибия',
        'Науру' : 'Nauru',
        'Nepal' : 'Непал',
        'Netherlands' : 'Нидерланды',
        'New Caledonia' : 'Новая Каледония',
        'New Zealand' : 'Новая Зеландия',
        'Nicaragua' : 'Никарагуа',
        'Niger' : 'Нигер',
        'Nigeria' : 'Нигерия',
        'Niue' : 'Ниуэ',
        'Norfolk Island' : 'Остров Норфолк',
        'Northern Mariana Islands' : 'Северные Марианские острова',
        'Norway' : 'Норвегия',
        'Oman' : 'Оман',
        'Pakistan' : 'Пакистан',
        'Palau' : 'Палау',
        'Palestine' : 'Палестина',
        'Panama' : 'Панама',
        'Papua New Guinea' : 'Папуа — Новая Гвинея',
        'Paraguay' : 'Парагвай',
        'Peru' : 'Перу',
        'Philippines' : 'Филиппины',
        'Pitcairn' : 'Питкэрн',
        'Poland' : 'Польша',
        'Portugal' : 'Португалия',
        'Puerto Rico' : 'Пуэрто-Рико',
        'Qatar' : 'Катар',
        'Reunion' : 'Реюньон',
        'Romania' : 'Румыния',
        'Russian Federation' : 'Российская Федерация',
        'Rwanda' : 'Руанда',
        'Saint Barthélemy' : 'Сен-Бартелеми',
        'Saint Helena' : 'Остров Святой Елены',
        'Saint Kitts and Nevis' : 'Сент-Китс и Невис',
        'Saint Lucia' : 'Сент-Люсия',
        'Saint Martin (French part)' : 'Сен-Мартен (французская часть)',
        'Saint Pierre and Miquelon' : 'Сен-Пьер и Микелон',
        'Saint Vincent and the Grenadines' : 'Сент-Винсент и Гренадины',
        'Samoa' : 'Самоа',
        'San Marino' : 'Сан-Марино',
        'Sao Tome and Principe' : 'Сан-Томе и Принсипи',
        'Saudi Arabia' : 'Саудовская Аравия',
        'Senegal' : 'Сенегал',
        'Serbia' : 'Сербия',
        'Seychelles' : 'Сейшельские острова',
        'Sierra Leone' : 'Сьерра-Леоне',
        'Singapore' : 'Сингапур',
        'Sint Maarten (Dutch part)' : 'Синт-Мартен (нидерландская часть)',
        'Slovakia' : 'Словакия',
        'Slovenia' : 'Словения',
        'Solomon Islands' : 'Соломоновы острова',
        'Somalia' : 'Сомали',
        'South Africa' : 'Южно-Африканская Республика',
        'South Georgia and South Sandwich Islands' : 'Южная Георгия и Южные Сандвичевы острова',
        'South Sudan' : 'Южный Судан',
        'Spain' : 'Испания',
        'Sri Lanka' : 'Шри-Ланка',
        'Sudan' : 'Судан',
        'Suriname' : 'Суринам',
        'Svalbard and Jan Mayen Islands' : 'Шпицберген и Ян-Майен',
        'Swaziland' : 'Эсватини',
        'Sweden' : 'Швеция',
        'Switzerland' : 'Швейцария',
        'Syria' : 'Сирия',
        'Taiwan' : 'Тайвань',
        'Tajikistan' : 'Таджикистан',
        'Tanzania' : 'Танзания',
        'Thailand' : 'Таиланд',
        'Timor-Leste' : 'Восточный Тимор',
        'Togo' : 'Того',
        'Tokelau' : 'Токелау',
        'Tonga' : 'Тонга',
        'Trinidad and Tobago' : 'Тринидад и Тобаго',
        'Tunisia' : 'Тунис',
        'Türkiye' : 'Турция',
        'Turkmenistan' : 'Туркменистан',
        'Turks and Caicos Islands' : 'Теркс и Кайкос',
        'Tuvalu' : 'Тувалу',
        'Uganda' : 'Уганда',
        'Ukraine' : 'Украина',
        'United Arab Emirates' : 'Объединенные Арабские Эмираты',
        'United Kingdom' : 'Великобритания',
        'United States Minor Outlying Islands' : 'Внешние малые острова США',
        'United States of America' : 'Соединенные Штаты Америки',
        'Uruguay' : 'Уругвай',
        'Uzbekistan' : 'Узбекистан',
        'Vanuatu' : 'Вануату',
        'Vatican City' : 'Ватикан',
        'Venezuela' : 'Венесуэла',
        'Vietnam' : 'Вьетнам',
        'Virgin Islands, British' : 'Виргинские острова (Великобритания)',
        'Virgin Islands, U.S.' : 'Виргинские острова (США)',
        'Wallis and Futuna Islands' : 'Уоллис и Футуна',
        'Western Sahara' : 'Западная Сахара',
        'Yemen' : 'Йемен',
        'Zambia' : 'Замбия',
        'Zimbabwe' : 'Зимбабве',

        // Часовые пояса для выпадающего списка
        '(GMT-12:00) International Date Line West' : '(GMT-12:00) Линия перемены даты (запад)',
        '(GMT-11:00) American Samoa' : '(GMT-11:00) Американское Самоа',
        '(GMT-11:00) Midway Island' : '(GMT-11:00) Мидуэй',
        '(GMT-10:00) Hawaii' : '(GMT-10:00) Гавайи',
        '(GMT-09:00) Alaska' : '(GMT-09:00) Аляска',
        '(GMT-08:00) Pacific Time (US & Canada)' : '(GMT-08:00) Тихоокеанское время (США и Канада)',
        '(GMT-08:00) Tijuana' : '(GMT-08:00) Тихуана',
        '(GMT-07:00) Arizona' : '(GMT-07:00) Аризона',
        '(GMT-07:00) Mazatlan' : '(GMT-07:00) Масатлан',
        '(GMT-07:00) Mountain Time (US & Canada)' : '(GMT-07:00) Горное время (США и Канада)',
        '(GMT-06:00) Central America' : '(GMT-06:00) Центральная Америка',
        '(GMT-06:00) Central Time (US & Canada)' : '(GMT-06:00) Центральное время (США и Канада)',
        '(GMT-06:00) Chihuahua' : '(GMT-06:00) Чиуауа',
        '(GMT-06:00) Guadalajara' : '(GMT-06:00) Гвадалахара',
        '(GMT-06:00) Mexico City' : '(GMT-06:00) Мехико',
        '(GMT-06:00) Monterrey' : '(GMT-06:00) Монтеррей',
        '(GMT-06:00) Saskatchewan' : '(GMT-06:00) Саскачеван',
        '(GMT-05:00) Bogota' : '(GMT-05:00) Богота',
        '(GMT-05:00) Eastern Time (US & Canada)' : '(GMT-05:00) Восточное время (США и Канада)',
        '(GMT-05:00) Indiana (East)' : '(GMT-05:00) Индиана (восток)',
        '(GMT-05:00) Lima' : '(GMT-05:00) Лима',
        '(GMT-05:00) Quito' : '(GMT-05:00) Кито',
        '(GMT-04:00) Atlantic Time (Canada)' : '(GMT-04:00) Атлантическое время (Канада)',
        '(GMT-04:00) Caracas' : '(GMT-04:00) Каракас',
        '(GMT-04:00) Georgetown' : '(GMT-04:00) Джорджтаун',
        '(GMT-04:00) La Paz' : '(GMT-04:00) Ла-Пас',
        '(GMT-04:00) Puerto Rico' : '(GMT-04:00) Пуэрто-Рико',
        '(GMT-04:00) Santiago' : '(GMT-04:00) Сантьяго',
        '(GMT-03:30) Newfoundland' : '(GMT-03:30) Ньюфаундленд',
        '(GMT-03:00) Asuncion' : '(GMT-03:00) Асунсьон',
        '(GMT-03:00) Brasilia' : '(GMT-03:00) Бразилиа',
        '(GMT-03:00) Buenos Aires' : '(GMT-03:00) Буэнос-Айрес',
        '(GMT-03:00) Montevideo' : '(GMT-03:00) Монтевидео',
        '(GMT-02:00) Greenland' : '(GMT-02:00) Гренландия',
        '(GMT-02:00) Mid-Atlantic' : '(GMT-02:00) Срединно-Атлантический',
        '(GMT-01:00) Azores' : '(GMT-01:00) Азорские острова',
        '(GMT-01:00) Cape Verde Is.' : '(GMT-01:00) Кабо-Верде',
        '(GMT+00:00) Edinburgh' : '(GMT+00:00) Эдинбург',
        '(GMT+00:00) Lisbon' : '(GMT+00:00) Лиссабон',
        '(GMT+00:00) London' : '(GMT+00:00) Лондон',
        '(GMT+00:00) Monrovia' : '(GMT+00:00) Монровия',
        '(GMT+00:00) UTC' : '(GMT+00:00) UTC',
        '(GMT+01:00) Amsterdam' : '(GMT+01:00) Амстердам',
        '(GMT+01:00) Belgrade' : '(GMT+01:00) Белград',
        '(GMT+01:00) Berlin' : '(GMT+01:00) Берлин',
        '(GMT+01:00) Bern' : '(GMT+01:00) Берн',
        '(GMT+01:00) Bratislava' : '(GMT+01:00) Братислава',
        '(GMT+01:00) Brussels' : '(GMT+01:00) Брюссель',
        '(GMT+01:00) Budapest' : '(GMT+01:00) Будапешт',
        '(GMT+01:00) Casablanca' : '(GMT+01:00) Касабланка',
        '(GMT+01:00) Copenhagen' : '(GMT+01:00) Копенгаген',
        '(GMT+01:00) Dublin' : '(GMT+01:00) Дублин',
        '(GMT+01:00) Ljubljana' : '(GMT+01:00) Любляна',
        '(GMT+01:00) Madrid' : '(GMT+01:00) Мадрид',
        '(GMT+01:00) Paris' : '(GMT+01:00) Париж',
        '(GMT+01:00) Prague' : '(GMT+01:00) Прага',
        '(GMT+01:00) Rome' : '(GMT+01:00) Рим',
        '(GMT+01:00) Sarajevo' : '(GMT+01:00) Сараево',
        '(GMT+01:00) Skopje' : '(GMT+01:00) Скопье',
        '(GMT+01:00) Stockholm' : '(GMT+01:00) Стокгольм',
        '(GMT+01:00) Vienna' : '(GMT+01:00) Вена',
        '(GMT+01:00) Warsaw' : '(GMT+01:00) Варшава',
        '(GMT+01:00) West Central Africa' : '(GMT+01:00) Западная Центральная Африка',
        '(GMT+01:00) Zagreb' : '(GMT+01:00) Загреб',
        '(GMT+01:00) Zurich' : '(GMT+01:00) Цюрих',
        '(GMT+02:00) Athens' : '(GMT+02:00) Афины',
        '(GMT+02:00) Bucharest' : '(GMT+02:00) Бухарест',
        '(GMT+02:00) Cairo' : '(GMT+02:00) Каир',
        '(GMT+02:00) Harare' : '(GMT+02:00) Хараре',
        '(GMT+02:00) Helsinki' : '(GMT+02:00) Хельсинки',
        '(GMT+02:00) Jerusalem' : '(GMT+02:00) Иерусалим',
        '(GMT+02:00) Kaliningrad' : '(GMT+02:00) Калининград',
        '(GMT+02:00) Kyiv' : '(GMT+02:00) Киев',
        '(GMT+02:00) Pretoria' : '(GMT+02:00) Претория',
        '(GMT+02:00) Riga' : '(GMT+02:00) Рига',
        '(GMT+02:00) Sofia' : '(GMT+02:00) София',
        '(GMT+02:00) Tallinn' : '(GMT+02:00) Таллин',
        '(GMT+02:00) Vilnius' : '(GMT+02:00) Вильнюс',
        '(GMT+03:00) Baghdad' : '(GMT+03:00) Багдад',
        '(GMT+03:00) Istanbul' : '(GMT+03:00) Стамбул',
        '(GMT+03:00) Kuwait' : '(GMT+03:00) Кувейт',
        '(GMT+03:00) Minsk' : '(GMT+03:00) Минск',
        '(GMT+03:00) Moscow' : '(GMT+03:00) Москва',
        '(GMT+03:00) Nairobi' : '(GMT+03:00) Найроби',
        '(GMT+03:00) Riyadh' : '(GMT+03:00) Эр-Рияд',
        '(GMT+03:00) St. Petersburg' : '(GMT+03:00) Санкт-Петербург',
        '(GMT+03:00) Volgograd' : '(GMT+03:00) Волгоград',
        '(GMT+03:30) Tehran' : '(GMT+03:30) Тегеран',
        '(GMT+04:00) Abu Dhabi' : '(GMT+04:00) Абу-Даби',
        '(GMT+04:00) Baku' : '(GMT+04:00) Баку',
        '(GMT+04:00) Muscat' : '(GMT+04:00) Маскат',
        '(GMT+04:00) Samara' : '(GMT+04:00) Самара',
        '(GMT+04:00) Tbilisi' : '(GMT+04:00) Тбилиси',
        '(GMT+04:00) Yerevan' : '(GMT+04:00) Ереван',
        '(GMT+04:30) Kabul' : '(GMT+04:30) Кабул',
        '(GMT+05:00) Almaty' : '(GMT+05:00) Алматы',
        '(GMT+05:00) Astana' : '(GMT+05:00) Астана',
        '(GMT+05:00) Ekaterinburg' : '(GMT+05:00) Екатеринбург',
        '(GMT+05:00) Islamabad' : '(GMT+05:00) Исламабад',
        '(GMT+05:00) Karachi' : '(GMT+05:00) Карачи',
        '(GMT+05:00) Tashkent' : '(GMT+05:00) Ташкент',
        '(GMT+05:30) Chennai' : '(GMT+05:30) Ченнаи',
        '(GMT+05:30) Kolkata' : '(GMT+05:30) Калькутта',
        '(GMT+05:30) Mumbai' : '(GMT+05:30) Мумбаи',
        '(GMT+05:30) New Delhi' : '(GMT+05:30) Нью-Дели',
        '(GMT+05:30) Sri Jayawardenepura' : '(GMT+05:30) Шри-Джаяварденепура-Котте',
        '(GMT+05:45) Kathmandu' : '(GMT+05:45) Катманду',
        '(GMT+06:00) Dhaka' : '(GMT+06:00) Дакка',
        '(GMT+06:00) Urumqi' : '(GMT+06:00) Урумчи',
        '(GMT+06:30) Rangoon' : '(GMT+06:30) Янгон',
        '(GMT+07:00) Bangkok' : '(GMT+07:00) Бангкок',
        '(GMT+07:00) Hanoi' : '(GMT+07:00) Ханой',
        '(GMT+07:00) Jakarta' : '(GMT+07:00) Джакарта',
        '(GMT+07:00) Krasnoyarsk' : '(GMT+07:00) Красноярск',
        '(GMT+07:00) Novosibirsk' : '(GMT+07:00) Новосибирск',
        '(GMT+08:00) Beijing' : '(GMT+08:00) Пекин',
        '(GMT+08:00) Chongqing' : '(GMT+08:00) Чунцин',
        '(GMT+08:00) Hong Kong' : '(GMT+08:00) Гонконг',
        '(GMT+08:00) Irkutsk' : '(GMT+08:00) Иркутск',
        '(GMT+08:00) Kuala Lumpur' : '(GMT+08:00) Куала-Лумпур',
        '(GMT+08:00) Perth' : '(GMT+08:00) Перт',
        '(GMT+08:00) Singapore' : '(GMT+08:00) Сингапур',
        '(GMT+08:00) Taipei' : '(GMT+08:00) Тайбэй',
        '(GMT+08:00) Ulaanbaatar' : '(GMT+08:00) Улан-Батор',
        '(GMT+09:00) Osaka' : '(GMT+09:00) Осака',
        '(GMT+09:00) Sapporo' : '(GMT+09:00) Саппоро',
        '(GMT+09:00) Seoul' : '(GMT+09:00) Сеул',
        '(GMT+09:00) Tokyo' : '(GMT+09:00) Токио',
        '(GMT+09:00) Yakutsk' : '(GMT+09:00) Якутск',
        '(GMT+09:30) Adelaide' : '(GMT+09:30) Аделаида',
        '(GMT+09:30) Darwin' : '(GMT+09:30) Дарвин',
        '(GMT+10:00) Brisbane' : '(GMT+10:00) Брисбен',
        '(GMT+10:00) Canberra' : '(GMT+10:00) Канберра',
        '(GMT+10:00) Guam' : '(GMT+10:00) Гуам',
        '(GMT+10:00) Hobart' : '(GMT+10:00) Хобарт',
        '(GMT+10:00) Melbourne' : '(GMT+10:00) Мельбурн',
        '(GMT+10:00) Port Moresby' : '(GMT+10:00) Порт-Морсби',
        '(GMT+10:00) Sydney' : '(GMT+10:00) Сидней',
        '(GMT+10:00) Vladivostok' : '(GMT+10:00) Владивосток',
        '(GMT+11:00) Magadan' : '(GMT+11:00) Магадан',
        '(GMT+11:00) New Caledonia' : '(GMT+11:00) Новая Каледония',
        '(GMT+11:00) Solomon Is.' : '(GMT+11:00) Соломоновы острова',
        '(GMT+11:00) Srednekolymsk' : '(GMT+11:00) Среднеколымск',
        '(GMT+12:00) Auckland' : '(GMT+12:00) Окленд',
        '(GMT+12:00) Fiji' : '(GMT+12:00) Фиджи',
        '(GMT+12:00) Kamchatka' : '(GMT+12:00) Камчатка',
        '(GMT+12:00) Marshall Is.' : '(GMT+12:00) Маршалловы острова',
        '(GMT+12:00) Wellington' : '(GMT+12:00) Веллингтон',
        '(GMT+12:45) Chatham Is.' : '(GMT+12:45) Чатем',
        '(GMT+13:00) Nuku\'alofa' : '(GMT+13:00) Нукуалофа',
        '(GMT+13:00) Samoa' : '(GMT+13:00) Самоа',
        '(GMT+13:00) Tokelau Is.' : '(GMT+13:00) Токелау',

        // Регионы для выпадающего списка
        'US East' : 'Восточное побережье США',
        'US West' : 'Западное побережье США',
        'Europe West' : 'Западная Европа',
        'Southeast Asia' : 'Юго-Восточная Азия',
        'Australia' : 'Австралия',

        // Реакции
        'Confused' : 'Недоумение',
        'Eyes' : 'Глаза',
        'Heart' : 'Сердце',
        'Hooray' : 'Ура',
        'Laugh' : 'Смех',
        'Rocket' : 'Ракета',
        'Thumbs down' : 'Палец вниз',
        'Thumbs up' : 'Палец вверх',
        'Total reactions' : 'Всего реакций',

        // Названия списков
        '🔮 Future ideas' : '🔮 Будущие идеи',
        '🚀 My stack' : '🚀 Мой стек',
        '✨ Inspiration' : '✨ Вдохновение',
        '⭐️ Name this list': '⭐️ Назовите этот список',

        // Кнопки и действия
        'Add file': 'Добавить файл',
        'Add users': 'Добавить пользователей',
        'Apply': 'Применить',
        'Cancel': 'Отмена',
        'Clone or download': 'Клонировать или скачать',
        'Confirm': 'Подтвердить',
        'Copy': 'Копировать',
        'Copy link': 'Копировать ссылку',
        'Create': 'Создать',
        'Create fork': 'Создать форк',
        'Create public gist': 'Создать публичный Gist',
        'Create secret gist': 'Создать секретный Gist',
        'Delete list': 'Удалить список',
        'Download ZIP': 'Скачать ZIP',
        'Edit list': 'Редактировать список',
        'Editing': 'Редактирование',
        'Indent mode': 'Режим отступа',
        'Line wrap mode': 'Режим переноса строк',
        'Load more': 'Загрузить ещё',
        'Make public': 'Опубликовать',
        'Quote reply': 'Цитата ответа',
        'No wrap': 'Без переноса',
        'Report content': 'Содержание отчета',
        'Revisions': 'Изменения',
        'Save': 'Сохранить',
        'Save list': 'Сохранить список',
        'Show less': 'Показать меньше',
        'Show more': 'Показать больше',
        'Soft wrap': 'Мягкий перенос',
        'Spaces': 'Пробелы',
        'Submit': 'Отправить',
        'Tabs': 'Табуляция',
        'Unstar this repository?': 'Убрать звезду с этого репозитория?',
        'Update': 'Обновить',
        'Update comment': 'Обновить комментарий',
        'Update public gist': 'Обновить публичный Gist',
        'Update secret gist': 'Обновить секретный Gist',

        // Временные предлоги и конструкции
        '@mention': '@упомянуть',
        'and': 'и',
        'at': 'в',
        'on': 'на',
        'or': 'или',
        'only': 'только',
        'our': 'нашей',
        'for': 'для',
        'not': 'не',
        'Committed': 'Закоммичено',
        'Created': 'Создано',
        'repositories.': 'репозитории.',
        'Last updated': 'Последнее обновление',
        'Loading': 'Загрузка',
        'Updated': 'Обновлено',

        // Дополнительные термины
        'About': 'О нас',
        'Activity': 'Активность',
        'Add': 'Добавить',
        'Add a description': 'Добавить описание',
        'Advanced': 'Продвинутый',
        'Action': 'Действие',
        'All time': 'Всё время',
        'All users': 'Все пользователи',
        'API': 'API',
        'App': 'Приложение',
        'Apps': 'Приложения',
        'Approved': 'Одобрено',
        'Artifacts': 'Артефакты',
        'Assets': 'Активы',
        'Any language': 'Любой язык',
        'Any license': 'Любая лицензия',
        'author': 'автор',
        'authored': 'автор',
        'base': 'основа',
        'Beta': 'Бета',
        'Blog': 'Блог',
        'cache': 'кэш',
        'cached': 'в кэше',
        'caches': 'кэша',
        'Cancel': 'Отмена',
        'Catalog': 'Каталог',
        'Category': 'Категория',
        'Categories': 'Категории',
        'changed': 'изменился',
        'Changes requested': 'Требуются изменения',
        'Checks': 'Проверки',
        'Clear': 'Очистить',
        'Clear filter': 'Очистить фильтр',
        'Clone or download': 'Клонировать или скачать',
        'Close': 'Закрыть',
        'closed': 'закрытый',
        'Close menu': 'Закрыть меню',
        'Code scanning': 'Сканирование кода',
        'Collaborators': 'Сотрудники',
        'Commits': 'Комиты',
        'Community': 'Сообщество',
        'compare': 'сравнить',
        'Compare & pull request': 'Сравнить и создать запрос на слияние',
        'Configure': 'Конфигурация',
        'Configured': 'Настроенный',
        'Confirm': 'Подтвердить',
        'Confirm access': 'Подтвердить доступ',
        'Contact': 'Контакты',
        'Contact GitHub': 'Связаться с GitHub',
        'Continue': 'Продолжить',
        'Contributions': 'Взносы',
        'Conversation': 'Обсуждение',
        'Copy': 'Копировать',
        'Create': 'Создать',
        'Create a new fork': 'Создать новый форк',
        'Creator': 'Автор',
        'default': 'по умолчанию',
        'Default': 'По умолчанию',
        'Dependencies': 'Зависимости',
        'Dependents': 'Зависимые',
        'deployment': 'развертывание',
        'Deployments': 'Развертывания',
        'deployments': 'развертываний',
        'Deprecated': 'Устаревший',
        'Description': 'Описание',
        'Disable': 'Отключить',
        'Disable all': 'Отключить всё',
        'Disable hint': 'Отключить подсказку',
        'Disabled': 'Отключено',
        'disabled': 'отключено',
        'Discard': 'Отменить',
        'discussion': 'обсуждение',
        'Dismiss': 'Отклонить',
        'Do not share my personal information': 'Не разглашайте мою личную информацию',
        'Docs': 'Документация',
        'documentation': 'документацию',
        'Download ZIP': 'Скачать ZIP',
        'Downloads': 'Загрузки',
        'Draft': 'Черновик',
        'Enable': 'Включить',
        'Enable all': 'Включить всё',
        'Enable hint': 'Включить подсказку',
        'Enabled': 'Включено',
        'enabled': 'включено',
        'Enterprises': 'Предприятия',
        'Environment': 'Cреда',
        'Environments': 'Окружения',
        'Everywhere': 'Везде',
        'Featured': 'Рекомендуемое',
        'Fetch upstream': 'Получить изменения из оригинала',
        'file': 'файл',
        'files': 'файлы',
        'Files': 'Файлы',
        'Filters': 'Фильтры',
        'Fork this repository': 'Форкнуть репозиторий',
        'Forked': 'Разветвленный',
        'Free': 'Бесплатно',
        'Help': 'Помощь',
        'Home': 'Главная',
        'install': 'установить',
        'Installation': 'Установка',
        'Jobs': 'Задания',
        'Latest': 'Последний',
        'Less': 'Меньше',
        'Less secure': 'Менее безопасный',
        'License': 'Лицензия',
        'Load more': 'Загрузить ещё',
        'Locked': 'Заблокировано',
        'Manage cookies': 'Управление файлами cookie',
        'Manage Cookies': 'Управление файлами cookie',
        'MCP registry': 'Реестр MCP',
        'Members': 'Участники',
        'Model': 'Модель',
        'Modified': 'Модифицированный',
        'Most helpful': 'Самое полезное',
        'Most popular': 'Самые популярные',
        'Most used topics': 'Наиболее используемые темы',
        'More': 'Больше',
        'New discussion': 'Новое обсуждение',
        'New label': 'Новый ярлык',
        'New users': 'Новые пользователи',
        'Next': 'Следующая',
        'No': 'Нет',
        'No description provided': 'Описание не предоставлено',
        'None': 'Нет',
        'Notes': 'Примечания',
        'Off': 'Выключено',
        'On': 'Включено',
        'open': 'открытый',
        'open/closed': 'открытый/закрытый',
        'opened': 'открыл',
        'Open menu': 'Открыть меню',
        'Owned': 'Принадлежит',
        'Owner': 'Владелец',
        'Packages & registries': 'Пакеты и реестры',
        'page.': 'странице.',
        'Pages': 'Страницы',
        'People': 'Люди',
        'Period': 'Период',
        'Pin': 'Закрепить',
        'Playground': 'Игровая площадка',
        'Popularity': 'По популярности',
        'Pre-release': 'Предварительный выпуск',
        'Prev': 'Предыдущая',
        'Previous': 'Предыдущая',
        'Privacy': 'Конфиденциальность',
        'Pricing': 'Цены',
        'Products': 'Продукт',
        'Public template': 'Публичный шаблон',
        'Public archive': 'Публичный архив',
        'Published': 'Опубликовано',
        'Readme': 'Readme',
        'Ready for review': 'Готово к проверке',
        'Recently added': 'Недавно добавлено',
        'Recommended': 'Рекомендуется',
        'Ref': 'Ссылка',
        'Rename': 'Переименовать',
        'Report abuse': 'Сообщить о нарушении',
        'Repository': 'Репозиторий',
        'Restore': 'Восстановить',
        'Revoke all': 'Отменить всё',
        'Runners': 'Исполнители',
        'Runs': 'Запуски',
        'Save': 'Сохранить',
        'Secrets': 'Секреты',
        'Select': 'Выбрать',
        'Set automatically': 'Установить автоматически',
        'Set manually': 'Установить вручную',
        'Set up': 'Настройка',
        'Site': 'Сайт',
        'Show less': 'Показать меньше',
        'Show more': 'Показать больше',
        'Source': 'Источник',
        'Sponsor': 'Спонсировать',
        'Sponsoring': 'Спонсорство',
        'Stable': 'Стабильный',
        'Status': 'Статус',
        'Submit': 'Отправить',
        'Subscribe': 'Подписаться',
        'Sync fork': 'Синхронизировать форк',
        'Tag': 'Теги',
        'Team': 'Команда',
        'Terms': 'Условия',
        'Today': 'Сегодня',
        'Top': 'Вверх',
        'Top languages': 'Популярные языки',
        'Topics': 'Темы',
        'Training': 'Обучение',
        'Upgrade': 'Обновление',
        'Update': 'Обновить',
        'Unfollow': 'Отписаться',
        'Unlocked': 'Разблокировано',
        'User': 'Пользователь',
        'Users': 'Пользователи',
        'Variables': 'Переменные',
        'Verified': 'Проверено',
        'Verify': 'Проверить',
        'View': 'Просмотр',
        'Warning': 'Предупреждение',
        'was closed': 'закрыт',
        'Webhooks': 'Вебхуки',
        'Website': 'Веб-сайт',
        'Workflow': 'Рабочий процесс',
        'Workflows': 'Рабочие процессы',
        'Yes': 'Да',

    };

    // Функция для нормализации текста
    function normalizeText(text) {
        return text.replace(/\s+/g, ' ').trim();
    }

    // Функция для проверки имени пользователя
    function isUsername(text) {
        if (!text || text.length < 2) return false;
        const reservedNames = ['true', 'false', 'null', 'undefined', 'src', 'href', 'http', 'https', 'www', 'com', 'org', 'net', 'git', 'github'];
        if (reservedNames.includes(text.toLowerCase())) return false;
        return /^[a-zA-Z0-9][a-zA-Z0-9-]{0,38}[a-zA-Z0-9]$/.test(text);
    }

    // Функция для blankslate блоков
    function translateBlankslateWithUsernames() {
        const blankslateHeadings = document.querySelectorAll('.blankslate-heading');

        blankslateHeadings.forEach(heading => {
            const originalText = heading.textContent;
            if (hasCyrillic(originalText)) return;

            const normalizedText = normalizeText(originalText);

            // Перевод "username doesn't have any public repositories yet."
            const match = normalizedText.match(/^(.+?)\s+doesn't have any public repositories yet\.?$/i);
            if (match) {
                const username = match[1];
                if (isUsername(username)) {
                    heading.textContent = `${username} ещё не имеет публичных репозиториев.`;
                    return;
                }
            }
        });

        // Перевод span активности
        const activitySpans = document.querySelectorAll('.text-center.color-fg-muted.tmp-pt-3 span, .color-fg-muted.m-0');

        activitySpans.forEach(span => {
            const originalText = span.textContent;
            if (hasCyrillic(originalText)) return;

            const normalizedText = normalizeText(originalText);

            // Перевод "username has no activity yet for this period."
            const match = normalizedText.match(/^(.+?)\s+has no activity yet for this period\.?$/i);
            if (match) {
                const username = match[1];
                if (isUsername(username)) {
                    span.textContent = `${username} пока не имеет активности за этот период.`;
                    return;
                }
            }
        });
    }

    // Функция для перевода событий в ленте
    function translateTimelineEvents() {
        const eventKeys = Object.keys(translations).filter(key => {
            if (typeof key !== 'string') return false;
            if (key.length < 3) return false;
            if (hasCyrillic(key)) return false;

            // Список индикаторов событий в ленте
            const eventIndicators = [
                'commit', 'pull request', 'title', 'closed', 'opened', 'assigned',
                'commented', 'completed', 'converted', 'draft', 'labeled', 'locked',
                'mentioned', 'milestoned', 'pinned', 'renamed', 'requested',
                'unassigned', 'unlabeled', 'unlocked', 'unpinned', 'removed', 'demilestoned'
            ];

            return eventIndicators.some(indicator => key.toLowerCase().includes(indicator.toLowerCase()));
        });

        const eventContainers = document.querySelectorAll('.row-module__timelineBodyContent__nmY90, .ActivityHeader-module__footer__HD8mP, .IssueBodyHeader-module__footerSection__Df7HB');

        eventContainers.forEach(container => {
            let newHtml = container.innerHTML;
            let hasChanges = false;

            eventKeys.forEach(key => {
                if (newHtml.includes(key) && !hasCyrillic(newHtml)) {
                    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    newHtml = newHtml.replace(new RegExp(escapedKey, 'g'), translations[key]);
                    hasChanges = true;
                }
            });

            if (hasChanges) {
                container.innerHTML = newHtml;
            }
        });

        const safeShortWords = ['completed', 'not planned', 'duplicate'];
        const reasonLinks = document.querySelectorAll('.ClosedEvent-module__stateReasonLink__X7TkZ');
        reasonLinks.forEach(link => {
            const text = link.textContent.trim();
            if (safeShortWords.includes(text) && translations[text]) {
                link.textContent = translations[text];
            }
        });
    }

    // Функция для перевода числовых ссылок
    function translatePRLinks() {
        const prLinks = document.querySelectorAll('a[href*="/pulls?"]');

        prLinks.forEach(link => {
            const text = link.textContent.replace(/\s+/g, ' ').trim();

            // Проверяем паттерн "X Open"
            let match = text.match(/^(\d+)\s+Open$/);
            if (match) {
                const num = parseInt(match[1], 10);
                const translated = (num === 1) ? `${num} Открытый` : `${num} Открытых`;

                link.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === `${num} Open`) {
                        node.textContent = ` ${translated}`;
                    }
                });
                return;
            }

            // Проверяем паттерн "X Closed"
            match = text.match(/^(\d+)\s+Closed$/);
            if (match) {
                const num = parseInt(match[1], 10);
                const translated = (num === 1) ? `${num} Закрытый` : `${num} Закрытых`;

                link.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === `${num} Closed`) {
                        node.textContent = ` ${translated}`;
                    }
                });
            }
        });
    }

    // Функция для перевода form-элементов
    function translateFormElements() {
        // Перевод optgroup
        const optgroups = document.querySelectorAll('optgroup');
        optgroups.forEach(optgroup => {
            const label = optgroup.getAttribute('label');
            if (label && !hasCyrillic(label) && translations[label]) {
                optgroup.setAttribute('label', translations[label]);
            }
        });

        // Перевод option
        const options = document.querySelectorAll('option');
        options.forEach(option => {
            const text = option.textContent.trim();
            if (text && !hasCyrillic(text) && translations[text]) {
                option.textContent = translations[text];
            }
        });

        // Перевод button
        const buttons = document.querySelectorAll('button, .btn, .btn-primary, .btn-danger, a.btn, a.btn-primary, a.btn-danger');
        buttons.forEach(button => {
            if (button.querySelector('svg')) {
                const textLength = button.textContent.trim().length;
                if (textLength < 2) return;
            }

            const text = button.textContent.trim();
            if (text && !hasCyrillic(text) && translations[text]) {
                button.textContent = translations[text];
            }

            // Перевод data-disable-with атрибута
            const disableWith = button.getAttribute('data-disable-with');
            if (disableWith && !hasCyrillic(disableWith) && translations[disableWith]) {
                button.setAttribute('data-disable-with', translations[disableWith]);
            }
        });
    }

    // Функция для замены текста с проверкой имени пользователя
    function translateTextWithUsernameCheck(text) {
        if (!text || typeof text !== 'string') return text;

        if (/[а-яА-ЯёЁ]/.test(text)) return text;

        if (translations[text]) {
            return translations[text];
        }

        // Проверяем удаление точки в конце
        if (text.endsWith('.') && translations[text.slice(0, -1)]) {
            return translations[text.slice(0, -1)] + '.';
        }

        // Проверяем удаление пробелов
        const trimmed = text.trim();
        if (trimmed !== text && translations[trimmed]) {
            const prefix = text.match(/^\s*/)[0];
            const suffix = text.match(/\s*$/)[0];
            return prefix + translations[trimmed] + suffix;
        }

        // Проверяем числовые паттерны
        const numberedTranslation = translateNumberedText(text);
        if (numberedTranslation) {
            return numberedTranslation;
        }

        // Проверяем паттерн "username doesn't have any public repositories yet"
        const publicRepoMatch = text.match(/^(.+?)\s+doesn't have any public repositories yet\.?$/i);
        if (publicRepoMatch) {
            const username = publicRepoMatch[1];
            if (isUsername(username)) {
                return `${username} ещё не имеет публичных репозиториев.`;
            }
        }

        // Проверяем паттерн "username has no activity yet for this period"
        const activityMatch = text.match(/^(.+?)\s+has no activity yet for this period\.?$/i);
        if (activityMatch) {
            const username = activityMatch[1];
            if (isUsername(username)) {
                return `${username} пока не имеет активности за этот период.`;
            }
        }

        return text;
    }

    // Функция для автоматического перевода с правильными склонениями
    function translateNumberedText(text) {
        // Вспомогательная функция для склонений
        function plural(num, form1, form2, form5) {
            const n = Math.abs(num);
            const lastDigit = n % 10;
            const lastTwoDigits = n % 100;

            if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
                return form5;
            }
            if (lastDigit === 1) {
                return form1;
            }
            if (lastDigit >= 2 && lastDigit <= 4) {
                return form2;
            }
            return form5;
        }

        // Очистка текста от лишних пробелов и символов
        const cleanText = text.replace(/\s+/g, ' ').trim();

        // Проверяем паттерн "X Open"
        const openMatch = text.match(/^(\d+)\s+Open$/);
        if (openMatch) {
            const num = parseInt(openMatch[1], 10);
            if (num === 1) {
                return `${num} Открытый`;
            } else if (num >= 2 && num <= 4) {
                return `${num} Открытых`;
            } else {
                return `${num} Открытых`;
            }
        }

        // Проверяем паттерн "X Closed"
        const closedMatch = text.match(/^(\d+)\s+Closed$/);
        if (closedMatch) {
            const num = parseInt(closedMatch[1], 10);
            if (num === 1) {
                return `${num} Закрытый`;
            } else if (num >= 2 && num <= 4) {
                return `${num} Закрытых`;
            } else {
                return `${num} Закрытых`;
            }
        }

        // Проверяем паттерн "Edited X time"
        const editedMatch = cleanText.match(/^Edited\s+(\d+)\s+time?s?$/i);
        if (editedMatch) {
            const num = parseInt(editedMatch[1], 10);
            if (num === 1) {
                return `Отредактировано ${num} раз`;
            } else if (num >= 2 && num <= 4) {
                return `Отредактировано ${num} раза`;
            } else {
                return `Отредактировано ${num} раз`;
            }
        }

        // Проверяем паттерн "X Draft"
        const draftMatch = text.match(/^(\d+)\s+Draft$/);
        if (draftMatch) {
            const num = parseInt(draftMatch[1], 10);
            if (num === 1) {
                return `${num} Черновик`;
            } else if (num >= 2 && num <= 4) {
                return `${num} Черновика`;
            } else {
                return `${num} Черновиков`;
            }
        }

        // Проверяем паттерн "X Published"
        const publishedMatch = text.match(/^(\d+)\s+Published$/);
        if (publishedMatch) {
            const num = parseInt(publishedMatch[1], 10);
            if (num === 1) {
                return `${num} Опубликованный`;
            } else if (num >= 2 && num <= 4) {
                return `${num} Опубликованных`;
            } else {
                return `${num} Опубликованных`;
            }
        }

        // Проверяем паттерн "X contributions"
        const contributionsMatch = text.match(/^(\d+(?:,\d+)?)\s+contributions?\s+in\s+the\s+last\s+year$/i);
        if (contributionsMatch) {
            const num = parseInt(contributionsMatch[1].replace(/,/g, ''), 10);
            const word = (num === 1) ? 'вклад' : ((num >= 2 && num <= 4) ? 'вклада' : 'вкладов');
            return `${num.toLocaleString()} ${word} за последний год`;
        }

        const contributionsYearMatch = text.match(/^(\d+(?:,\d+)?)\s+contributions?\s+in\s+(\d{4})$/i);
        if (contributionsYearMatch) {
            const num = parseInt(contributionsYearMatch[1].replace(/,/g, ''), 10);
            const year = contributionsYearMatch[2];
            const word = (num === 1) ? 'вклад' : ((num >= 2 && num <= 4) ? 'вклада' : 'вкладов');
            return `${num.toLocaleString()} ${word} в ${year} году`;
        }

        const contributionsOnlyMatch = text.match(/^(\d+(?:,\d+)?)\s+contributions?$/i);
        if (contributionsOnlyMatch) {
            const num = parseInt(contributionsOnlyMatch[1].replace(/,/g, ''), 10);
            const word = (num === 1) ? 'вклад' : ((num >= 2 && num <= 4) ? 'вклада' : 'вкладов');
            return `${num.toLocaleString()} ${word}`;
        }

        // Проверяем паттерн "X contributions in private repositories"
        const privateContribMatch = cleanText.match(/^(\d+)\s+contributions?\s+in\s+private\s+repositories$/i);
        if (privateContribMatch) {
            const num = parseInt(privateContribMatch[1], 10);
            const word = (num === 1) ? 'вклад' : ((num >= 2 && num <= 4) ? 'вклада' : 'вкладов');
            return `${num} ${word} в приватных репозиториях`;
        }

        // Проверяем паттерн "Created X commits in Y repositories"
        const normalizedText = text.replace(/\s+/g, ' ').trim();

        const openedPrMatch = normalizedText.match(/^Opened\s+(\d+)\s+pull\s+request\s+in\s+(\d+)\s+repositories?$/i);
        if (openedPrMatch) {
            const prs = parseInt(openedPrMatch[1], 10);
            const repos = parseInt(openedPrMatch[2], 10);
            const prWord = (prs === 1) ? 'запрос на слияние' : ((prs >= 2 && prs <= 4) ? 'запроса на слияние' : 'запросов на слияние');
            const reposWord = (repos === 1) ? 'репозитории' : ((repos >= 2 && repos <= 4) ? 'репозиториях' : 'репозиториях');
            return `Открыто ${prs} ${prWord} в ${repos} ${reposWord}`;
        }

        const openedIssueMatch = normalizedText.match(/^Opened\s+(\d+)\s+issue\s+in\s+(\d+)\s+repositories?$/i);
        if (openedIssueMatch) {
            const issues = parseInt(openedIssueMatch[1], 10);
            const repos = parseInt(openedIssueMatch[2], 10);
            const issueWord = (issues === 1) ? 'задачу' : ((issues >= 2 && issues <= 4) ? 'задачи' : 'задач');
            const reposWord = (repos === 1) ? 'репозитории' : ((repos >= 2 && repos <= 4) ? 'репозиториях' : 'репозиториях');
            return `Открыто ${issues} ${issueWord} в ${repos} ${reposWord}`;
        }

        const prOnlyMatch = normalizedText.match(/^Opened\s+(\d+)\s+pull\s+request$/i);
        if (prOnlyMatch) {
            const num = parseInt(prOnlyMatch[1], 10);
            const word = (num === 1) ? 'запрос на слияние' : ((num >= 2 && num <= 4) ? 'запроса на слияние' : 'запросов на слияние');
            return `Открыто ${num} ${word}`;
        }

        // Проверяем паттерн "Opened X issue"
        const issueOnlyMatch = normalizedText.match(/^Opened\s+(\d+)\s+issue$/i);
        if (issueOnlyMatch) {
            const num = parseInt(issueOnlyMatch[1], 10);
            const word = (num === 1) ? 'задачу' : ((num >= 2 && num <= 4) ? 'задачи' : 'задач');
            return `Открыто ${num} ${word}`;
        }

        const commitsInReposMatch = normalizedText.match(/^Created\s+(\d+)\s+commits?\s+in\s+(\d+)\s+repositories?$/i);
        if (commitsInReposMatch) {
            const commits = parseInt(commitsInReposMatch[1], 10);
            const repos = parseInt(commitsInReposMatch[2], 10);
            const commitWord = (commits === 1) ? 'коммит' : ((commits >= 2 && commits <= 4) ? 'коммита' : 'коммитов');
            const reposWord = (repos === 1) ? 'репозитории' : ((repos >= 2 && repos <= 4) ? 'репозиториях' : 'репозиториях');
            return `Создано ${commits} ${commitWord} в ${repos} ${reposWord}`;
        }

        // Проверяем паттерн "Created X repository"
        const createdRepoMatch = normalizedText.match(/^Created\s+(\d+)\s+repository$/i);
        if (createdRepoMatch) {
            const num = parseInt(createdRepoMatch[1], 10);
            const word = (num === 1) ? 'репозиторий' : ((num >= 2 && num <= 4) ? 'репозитория' : 'репозиториев');
            return `Создано ${num} ${word}`;
        }

        // Проверяем паттерн "Created X repositories"
        const createdReposMatch = normalizedText.match(/^Created\s+(\d+)\s+repositories$/i);
        if (createdReposMatch) {
            const num = parseInt(createdReposMatch[1], 10);
            const word = (num === 1) ? 'репозиторий' : ((num >= 2 && num <= 4) ? 'репозитория' : 'репозиториев');
            return `Создано ${num} ${word}`;
        }

        // Проверяем паттерн "X commits"
        const commitsMatch = normalizedText.match(/^(\d+)\s+commits?$/i);
        if (commitsMatch) {
            const num = parseInt(commitsMatch[1], 10);
            const word = (num === 1) ? 'коммит' : ((num >= 2 && num <= 4) ? 'коммита' : 'коммитов');
            return `${num} ${word}`;
        }

        // Проверяем паттерн "X repositories"
        const reposMatch = normalizedText.match(/^(\d+)\s+repositories?$/i);
        if (reposMatch) {
            const num = parseInt(reposMatch[1], 10);
            const word = (num === 1) ? 'репозиторий' : ((num >= 2 && num <= 4) ? 'репозитория' : 'репозиториев');
            return `${num} ${word}`;
        }

        // Проверяем паттерн "Created X commits in Y repositories"
        const commitsInReposMatchNew = normalizedText.match(/^Created\s+(\d+)\s+commits?\s+in\s+(\d+)\s+repositories?$/i);
        if (commitsInReposMatchNew) {
            const commits = parseInt(commitsInReposMatchNew[1], 10);
            const repos = parseInt(commitsInReposMatchNew[2], 10);
            const commitWord = (commits === 1) ? 'коммит' : ((commits >= 2 && commits <= 4) ? 'коммита' : 'коммитов');
            const reposWord = (repos === 1) ? 'репозитории' : ((repos >= 2 && repos <= 4) ? 'репозиториях' : 'репозиториях');
            return `Создано ${commits} ${commitWord} в ${repos} ${reposWord}`;
        }

        // Проверяем паттерн "Opened X other pull requests in Y repositories"
        const openedPrsInReposMatch = normalizedText.match(/^Opened\s+(\d+)\s+other\s+pull\s+requests\s+in\s+(\d+)\s+repositories?$/i);
        if (openedPrsInReposMatch) {
            const prs = parseInt(openedPrsInReposMatch[1], 10);
            const repos = parseInt(openedPrsInReposMatch[2], 10);
            const prWord = (prs === 1) ? 'запрос на извлечение' : ((prs >= 2 && prs <= 4) ? 'запроса на извлечение' : 'запросов на извлечение');
            const reposWord = (repos === 1) ? 'репозитории' : ((repos >= 2 && repos <= 4) ? 'репозиториях' : 'репозиториях');
            return `Открыто ${prs} других ${prWord} в ${repos} ${reposWord}`;
        }

        // Проверяем паттерн "Opened X pull request in Y repositories"
        const openedPrMatchNew = normalizedText.match(/^Opened\s+(\d+)\s+pull\s+request\s+in\s+(\d+)\s+repositories?$/i);
        if (openedPrMatchNew) {
            const prs = parseInt(openedPrMatchNew[1], 10);
            const repos = parseInt(openedPrMatchNew[2], 10);
            const prWord = (prs === 1) ? 'запрос на слияние' : ((prs >= 2 && prs <= 4) ? 'запроса на слияние' : 'запросов на слияние');
            const reposWord = (repos === 1) ? 'репозитории' : ((repos >= 2 && repos <= 4) ? 'репозиториях' : 'репозиториях');
            return `Открыто ${prs} ${prWord} в ${repos} ${reposWord}`;
        }

        // Проверяем паттерн "Opened X issue in Y repositories"
        const openedIssueMatchNew = normalizedText.match(/^Opened\s+(\d+)\s+issue\s+in\s+(\d+)\s+repositories?$/i);
        if (openedIssueMatchNew) {
            const issues = parseInt(openedIssueMatchNew[1], 10);
            const repos = parseInt(openedIssueMatchNew[2], 10);
            const issueWord = (issues === 1) ? 'задачу' : ((issues >= 2 && issues <= 4) ? 'задачи' : 'задач');
            const reposWord = (repos === 1) ? 'репозитории' : ((repos >= 2 && repos <= 4) ? 'репозиториях' : 'репозиториях');
            return `Открыто ${issues} ${issueWord} в ${repos} ${reposWord}`;
        }

        // Проверяем паттерн "Created X repositories"
        const createdReposMatchNew = normalizedText.match(/^Created\s+(\d+)\s+repositories?$/i);
        if (createdReposMatchNew) {
            const num = parseInt(createdReposMatchNew[1], 10);
            const word = (num === 1) ? 'репозиторий' : ((num >= 2 && num <= 4) ? 'репозитория' : 'репозиториев');
            return `Создано ${num} ${word}`;
        }

        // Проверяем паттерн "Created X repository"
        const createdRepoMatchNew = normalizedText.match(/^Created\s+(\d+)\s+repository$/i);
        if (createdRepoMatchNew) {
            const num = parseInt(createdRepoMatchNew[1], 10);
            const word = (num === 1) ? 'репозиторий' : ((num >= 2 && num <= 4) ? 'репозитория' : 'репозиториев');
            return `Создано ${num} ${word}`;
        }

        // Проверяем паттерн "X releases"
        const releasesPlainMatch = cleanText.match(/^(\d+)\s+releases$/i);
        if (releasesPlainMatch) {
            const num = parseInt(releasesPlainMatch[1], 10);
            const word = (num === 1) ? 'релиз' : ((num >= 2 && num <= 4) ? 'релиза' : 'релизов');
            return `${num} ${word}`;
        }

        // Проверяем паттерн "+ X releases"
        const releasesMatch = normalizedText.match(/^\+\s+(\d+)\s+releases$/i);
        if (releasesMatch) {
            const num = parseInt(releasesMatch[1], 10);
            const word = (num === 1) ? 'релиз' : ((num >= 2 && num <= 4) ? 'релиза' : 'релизов');
            return `+ ${num} ${word}`;
        }

        // Проверяем паттерн "X deployments"
        const deploymentsPlainMatch = cleanText.match(/^(\d+)\s+deployments$/i);
        if (deploymentsPlainMatch) {
            const num = parseInt(deploymentsPlainMatch[1], 10);
            const word = (num === 1) ? 'развертывание' : ((num >= 2 && num <= 4) ? 'развертывания' : 'развертываний');
            return `${num} ${word}`;
        }

        // Проверяем паттерн "+ X deployments"
        const deploymentsMatch = normalizedText.match(/^\+\s+(\d+)\s+deployments$/i);
        if (deploymentsMatch) {
            const num = parseInt(deploymentsMatch[1], 10);
            const word = (num === 1) ? 'развертывание' : ((num >= 2 && num <= 4) ? 'развертывания' : 'развертываний');
            return `+ ${num} ${word}`;
        }

        // Проверяем паттерн "X contributors"
        const contributorsPlainMatch = cleanText.match(/^(\d+)\s+contributors$/i);
        if (contributorsPlainMatch) {
            const num = parseInt(contributorsPlainMatch[1], 10);
            const word = (num === 1) ? 'участник' : ((num >= 2 && num <= 4) ? 'участника' : 'участников');
            return `${num} ${word}`;
        }

        // Проверяем паттерн "+ X contributors"
        const contributorsMatch = normalizedText.match(/^\+\s+(\d+)\s+contributors$/i);
        if (contributorsMatch) {
            const num = parseInt(contributorsMatch[1], 10);
            const word = (num === 1) ? 'участник' : ((num >= 2 && num <= 4) ? 'участника' : 'участников');
            return `+ ${num} ${word}`;
        }

        // Проверяем паттерн "X packages"
        const packagesMatch = cleanText.match(/^(\d+)\s+packages$/i);
        if (packagesMatch) {
            const num = parseInt(packagesMatch[1], 10);
            const word = (num === 1) ? 'пакет' : ((num >= 2 && num <= 4) ? 'пакета' : 'пакетов');
            return `${num} ${word}`;
        }

        // Проверяем паттерн "X files"
        const filesMatch = cleanText.match(/^(\d+)\s+files?$/i);
        if (filesMatch) {
            const num = parseInt(filesMatch[1], 10);
            return `${num} ${plural(num, 'файл', 'файла', 'файлов')}`;
        }

        // Проверяем паттерн "X forks"
        const forksMatch = cleanText.match(/^(\d+)\s+forks?$/i);
        if (forksMatch) {
            const num = parseInt(forksMatch[1], 10);
            return `${num} ${plural(num, 'форк', 'форка', 'форков')}`;
        }

        // Проверяем паттерн "X comments"
        const commentsMatch = cleanText.match(/^(\d+)\s+comments?$/i);
        if (commentsMatch) {
            const num = parseInt(commentsMatch[1], 10);
            return `${num} ${plural(num, 'комментарий', 'комментария', 'комментариев')}`;
        }

        // Проверяем паттерн "X stars"
        const starsMatch = cleanText.match(/^(\d+)\s+stars?$/i);
        if (starsMatch) {
            const num = parseInt(starsMatch[1], 10);
            return `${num} ${plural(num, 'звезда', 'звезды', 'звёзд')}`;
        }

        // Проверяем паттерн "X% used"
        const percentUsedMatch = cleanText.match(/^(\d+(?:\.\d+)?)%\s+used$/i);
        if (percentUsedMatch) {
            const num = percentUsedMatch[1];
            return `${num}% использовано`;
        }

        // Проверяем паттерн "X workflow runs"
        const workflowRunsMatch = cleanText.match(/^(\d+)\s+workflow\s+runs?$/i);
        if (workflowRunsMatch) {
            const num = parseInt(workflowRunsMatch[1], 10);
            return `${num} ${plural(num, 'запуск рабочего процесса', 'запуска рабочего процесса', 'запусков рабочих процессов')}`;
        }

        // Проверяем паттерн "X cache"
        const cacheMatch = cleanText.match(/^(\d+)\s+cache$/i);
        if (cacheMatch) {
            const num = parseInt(cacheMatch[1], 10);
            return `${num} ${plural(num, 'кэш', 'кэша', 'кэшей')}`;
        }

        // Проверяем паттерн "X available runner"
        const runnerMatch = cleanText.match(/^(\d+)\s+available\s+runners?$/i);
        if (runnerMatch) {
            const num = parseInt(runnerMatch[1], 10);
            return `${num} ${plural(num, 'доступный раннер', 'доступных раннера', 'доступных раннеров')}`;
        }

        return null;
    }

    // Функция для перевода элементов активности с разбитым текстом
    function translateTimelineActivity() {
        const activityElements = document.querySelectorAll('.color-fg-default.ws-normal.text-left');

        activityElements.forEach(element => {
            if (hasCyrillic(element.textContent)) return;

            const fullText = element.textContent.replace(/\s+/g, ' ').trim();

            // Проверяем паттерн "Created X commits in Y repository"
            const commitsMatch = fullText.match(/^Created\s+(\d+)\s+commits?\s+in\s+(\d+)\s+repositories?$/i);
            if (commitsMatch) {
                const commits = parseInt(commitsMatch[1], 10);
                const repos = parseInt(commitsMatch[2], 10);
                const commitWord = (commits === 1) ? 'коммит' : ((commits >= 2 && commits <= 4) ? 'коммита' : 'коммитов');
                const reposWord = (repos === 1) ? 'репозитории' : ((repos >= 2 && repos <= 4) ? 'репозиториях' : 'репозиториях');
                element.textContent = `Создано ${commits} ${commitWord} в ${repos} ${reposWord}`;
                return;
            }

            // Проверяем паттерн "Opened X other pull requests in Y repositories"
            const prsMatch = fullText.match(/^Opened\s+(\d+)\s+other\s+pull\s+requests\s+in\s+(\d+)\s+repositories?$/i);
            if (prsMatch) {
                const prs = parseInt(prsMatch[1], 10);
                const repos = parseInt(prsMatch[2], 10);
                const prWord = (prs === 1) ? 'запрос на извлечение' : ((prs >= 2 && prs <= 4) ? 'запроса на извлечение' : 'запросов на извлечение');
                const reposWord = (repos === 1) ? 'репозитории' : ((repos >= 2 && repos <= 4) ? 'репозиториях' : 'репозиториях');
                element.textContent = `Открыто ${prs} других ${prWord} в ${repos} ${reposWord}`;
                return;
            }

            // Проверяем паттерн "Created X repositories"
            const reposMatchCreated = fullText.match(/^Created\s+(\d+)\s+repositories?$/i);
            if (reposMatchCreated) {
                const num = parseInt(reposMatchCreated[1], 10);
                const word = (num === 1) ? 'репозиторий' : ((num >= 2 && num <= 4) ? 'репозитория' : 'репозиториев');
                element.textContent = `Создано ${num} ${word}`;
                return;
            }

            // Проверяем паттерн "Opened X pull request in Y repositories"
            const openedPrMatch = fullText.match(/^Opened\s+(\d+)\s+pull\s+request\s+in\s+(\d+)\s+repositories?$/i);
            if (openedPrMatch) {
                const prs = parseInt(openedPrMatch[1], 10);
                const repos = parseInt(openedPrMatch[2], 10);
                const prWord = (prs === 1) ? 'запрос на слияние' : ((prs >= 2 && prs <= 4) ? 'запроса на слияние' : 'запросов на слияние');
                const reposWord = (repos === 1) ? 'репозитории' : ((repos >= 2 && repos <= 4) ? 'репозиториях' : 'репозиториях');
                element.textContent = `Открыто ${prs} ${prWord} в ${repos} ${reposWord}`;
                return;
            }

            // Проверяем паттерн "Started X discussions in Y repository(ies)"
            const startedDiscussionsMatch = fullText.match(/^Started\s+(\d+)\s+discussions?\s+in\s+(\d+)\s+(repository|repositories)$/i);
            if (startedDiscussionsMatch) {
                const discussions = parseInt(startedDiscussionsMatch[1], 10);
                const repos = parseInt(startedDiscussionsMatch[2], 10);
                const discussionWord = (discussions === 1) ? 'обсуждение' : ((discussions >= 2 && discussions <= 4) ? 'обсуждения' : 'обсуждений');
                const reposWord = (repos === 1) ? 'репозитории' : ((repos >= 2 && repos <= 4) ? 'репозиториях' : 'репозиториях');
                element.textContent = `Начато ${discussions} ${discussionWord} в ${repos} ${reposWord}`;
                return;
            }

            // Проверяем паттерн "Answered X discussion(s) in Y repository(ies)"
            const answeredDiscussionMatch = fullText.match(/^Answered\s+(\d+)\s+discussions?\s+in\s+(\d+)\s+(repository|repositories)$/i);
            if (answeredDiscussionMatch) {
                const discussions = parseInt(answeredDiscussionMatch[1], 10);
                const repos = parseInt(answeredDiscussionMatch[2], 10);
                const discussionWord = (discussions === 1) ? 'обсуждение' : ((discussions >= 2 && discussions <= 4) ? 'обсуждения' : 'обсуждений');
                const reposWord = (repos === 1) ? 'репозитории' : ((repos >= 2 && repos <= 4) ? 'репозиториях' : 'репозиториях');
                element.textContent = `Отвечено на ${discussions} ${discussionWord} в ${repos} ${reposWord}`;
                return;
            }
        });

        // Перевод кнопки "Показать больше активности"
        const showMoreButton = document.querySelector('.ajax-pagination-btn');
        if (showMoreButton && showMoreButton.textContent.trim() === 'Show more activity') {
            showMoreButton.textContent = 'Показать больше активности';
        }
    }

    // Функция для перевода сообщений об архивации репозитория
    function translateArchiveFlashMessage() {
        const flashWarnings = document.querySelectorAll('.flash.flash-warn.flash-full, .flash.flash-warn');

        flashWarnings.forEach(flash => {
            const text = flash.textContent.trim();

            const hybridMatch = text.match(/This repository was archived by the owner на (.+?)\. It is только что read-only\./);
            if (hybridMatch) {
                let date = hybridMatch[1];
                date = date.replace(/мар\.\s*(\d+),\s*(\d+)/, '$1 марта $2 г.');
                flash.innerHTML = `Этот репозиторий был архивирован владельцем ${date}. Он только для чтения.`;
                return;
            }

            const fullMatch = text.match(/This repository was archived by the owner on (.+?)\. It is read-only\./);
            if (fullMatch) {
                let date = fullMatch[1];
                flash.innerHTML = `Этот репозиторий был архивирован владельцем ${date}. Он только для чтения.`;
                return;
            }

            const altMatch = text.match(/This repository was archived by the owner on (.+?)\. It is только что read-only\./);
            if (altMatch) {
                let date = altMatch[1];
                flash.innerHTML = `Этот репозиторий был архивирован владельцем ${date}. Он только для чтения.`;
                return;
            }

            const partialMatch = text.match(/был архивирован владельцем (.+?)\. Он только что read-only\./);
            if (partialMatch) {
                let date = partialMatch[1];
                flash.innerHTML = `Этот репозиторий был архивирован владельцем ${date}. Он только для чтения.`;
                return;
            }

            if (text.includes('только для чтения')) {
                return;
            }
        });
    }

    // Функция для проверки наличия кириллицы
    function hasCyrillic(text) {
        return /[а-яА-ЯёЁ]/.test(text);
    }

    // Функция для проверки игнорируемых элементов
    function shouldIgnoreElement(element) {
        if (!element.closest) {
            return false;
        }

        // Игнорируем строку поиска
        if (element.closest && (
            element.closest('[data-target="qbsearch-input.*"]') ||
            element.closest('#search-suggestions-dialog') ||
            element.closest('#feedback-dialog')
        )) {
            return true;
        }

        // Игнорируем диалоговые окна
        if (element.closest('[role="dialog"], .prc-Dialog-Body, .prc-Dialog-Body-bB903, [class*="Dialog"]')) {
            return false;
        }

        // Игнорируем дерево файлов
        if (element.closest('[data-testid="repos-file-tree-container"]')) {
            if (element.getAttribute && element.getAttribute('role') === 'tree') {
                return false;
            }
            return true;
        }

        // Игнорируем ссылки на файлы и папки в таблице содержимого
        if (element.closest('.react-directory-filename-column')) {
            return true;
        }

        // Игнорируем ячейки с именами файлов в таблице
        if (element.closest('.react-directory-row-name-cell-small-screen, .react-directory-row-name-cell-large-screen')) {
            return true;
        }

        // Пропускаем aria-label с указанием типа Directory/File
        if (element.getAttribute && element.getAttribute('aria-label')) {
            const ariaLabel = element.getAttribute('aria-label');
            if (ariaLabel && (ariaLabel.includes('Directory') || ariaLabel.includes('File'))) {
                return true;
            }
        }

        // Пропускаем title атрибуты у ссылок на файлы
        if (element.tagName === 'A' && element.getAttribute('title')) {
            const title = element.getAttribute('title');
            if (title && (title.includes('.') || title.match(/^[a-zA-Z0-9\-_\.]+$/))) {
                return true;
            }
        }

        // Проверка Markdown элементов
        const markdownSelectors = [
            '#readme',
            '.Box-body #readme',
            '.DirectoryRichtextContent-module__SharedMarkdownContent__hHXUL',
            '.markdown-body',
            'article.markdown-body',
            '[data-target="readme-toc.contentSticky"]'
        ];

        for (const selector of markdownSelectors) {
            if (element.closest(selector)) {
                return true;
            }
        }

        // Проверка блоков коммитов
        const commitSelectors = [
            '.AuthorAvatar-module__authorHoverableLink__MHTT8',
            '.CommitAttribution-module__CommitAttributionContainer__I_rfs',
            '.CommitRow-module__ListItemTitle_0__cUhJS',
            '.Title-module__heading__tHuYV',
            '.react-directory-commit-message'
        ];

        for (const selector of commitSelectors) {
            if (element.closest(selector)) {
                return true;
            }
        }

        // Проверка конкретного блока на странице репозитория
        if (element.matches && (
            element.matches('#repo-content-pjax-container > div > div > div > div.Layout-main > react-partial > div > div > div.OverviewContent-module__Box_11--Tqhu2 > div:nth-child(1)') ||
            element.matches('.OverviewContent-module__Box_11--Tqhu2') ||
            element.closest('#repo-content-pjax-container > div > div > div > div.Layout-main > react-partial > div > div > div.OverviewContent-module__Box_11--Tqhu2 > div:nth-child(1)')
        )) {
            return true;
        }

        // Проверка по техническим селекторам
        const technicalSelectors = [
            // Селекторы для кода
            '#new_blob',
            '.blob-code',
            '.blob-code-inner',
            '.blob-editor-container',
            '.cm-editor',
            '.code-editor',
            '.CodeMirror',
            '.commit-create',
            '.commit-desc',
            '.commit-ref',
            '.commit-title',
            '.diff-table',
            '.file-editor',
            '.gh-header-title',
            '.git-command',
            '.highlight',
            '.js-blob-form',
            '.js-file-line',
            '.js-file-line-container',
            '.js-issue-title',
            '.monaco-editor',
            '.react-code-text',
            '.sha',
            '.text-diff-container',
            '.user-select-contain',
            '[aria-label*="command"]',
            '[aria-label^="Toggle"]',
            '[data-code-marker]',
            '[data-qa-code-editor]',
            'code',
            'pre'
        ];

        for (const selector of technicalSelectors) {
            if (element.closest(selector)) {
                return true;
            }
        }

        const readmeContainer = element.closest('#readme, [data-target="readme-toc.contentSticky"]');
        if (readmeContainer) {
            return true;
        }

        const boxBody = element.closest('.Box-body');
        if (boxBody && boxBody.querySelector('#readme, [data-target="readme-toc.contentSticky"]')) {
            return true;
        }

        // Проверка по тегам
        if (element.tagName === 'SCRIPT' ||
            element.tagName === 'STYLE' ||
            element.tagName === 'NOSCRIPT' ||
            element.tagName === 'CODE' ||
            element.tagName === 'PRE') {
            return true;
        }

        // Проверка по CSS-классам
        if (element.classList && element.classList.length > 0) {
            const classList = Array.from(element.classList);
            var hasForbiddenClass = false;
            for (var i = 0; i < classList.length; i++) {
                var className = classList[i];
                if ((className.includes('code') ||
                    className.includes('commit') ||
                    (className.includes('react') && !className.includes('Dialog')) ||
                    className.includes('editor') ||
                    className.includes('search-match') ||
                    className.includes('match') ||
                    className.includes('highlight'))) {
                    hasForbiddenClass = true;
                    break;
                }
            }
            if (hasForbiddenClass) {
                return true;
            }
        }

        return false;
    }

    // Функция для перевода диалогов
    function translateDialogElements() {
        const dialogBody = document.querySelector('.prc-Dialog-Body-bB903, .prc-Dialog-Body, [role="dialog"] .prc-Dialog-Body');
        if (!dialogBody) return;

        const paragraphs = dialogBody.querySelectorAll('p');
        paragraphs.forEach(p => {
            const text = p.textContent.trim();
            if (translations[text]) {
                p.textContent = translations[text];
            }
        });

        const listItems = dialogBody.querySelectorAll('li');
        listItems.forEach(li => {
            const text = li.textContent.trim();
            if (translations[text]) {
                const strong = li.querySelector('strong');
                if (strong && translations[strong.textContent.trim()]) {
                    li.innerHTML = li.innerHTML.replace(strong.textContent, translations[strong.textContent.trim()]);
                }
                li.textContent = translations[text];
            }
        });
    }

    // Функция для проверки URL
    function shouldIgnorePage() {
        const path = window.location.pathname;
        return path.includes('/compare/');
    }

    // Функция для замены текста
    function translateText(node) {
        if (node.nodeType === Node.TEXT_NODE && node.parentElement && !shouldIgnoreElement(node.parentElement)) {
            const text = node.textContent;

            if (hasCyrillic(text)) {
                return false;
            }

            // Сначала проверяем по словарю
            if (translations[text]) {
                node.textContent = translations[text];
                return true;
            }

            // Проверяем с удалением точки в конце
            if (text.endsWith('.') && translations[text.slice(0, -1)]) {
                node.textContent = translations[text.slice(0, -1)] + '.';
                return true;
            }

            // Проверяем с удалением пробелов в начале/конце
            const trimmed = text.trim();
            if (trimmed !== text && translations[trimmed]) {
                const prefix = text.match(/^\s*/)[0];
                const suffix = text.match(/\s*$/)[0];
                node.textContent = prefix + translations[trimmed] + suffix;
                return true;
            }

            // Проверяем числовые паттерны
            const numberedTranslation = translateNumberedText(text);
            if (numberedTranslation) {
                node.textContent = numberedTranslation;
                return true;
            }

            // Проверяем на фразы с именем пользователя
            const result = translateTextWithUsernameCheck(text);
            if (result !== text) {
                node.textContent = result;
                return true;
            }
        }
        return false;
    }

    // Функция для обхода DOM-дерева
    function walkDOM(node) {
        if (shouldIgnoreElement(node)) {
            return;
        }

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
            if (shouldIgnoreElement(element)) return;
            const placeholder = element.getAttribute('placeholder');
            if (placeholder && !hasCyrillic(placeholder) && translations[placeholder]) {
                element.setAttribute('placeholder', translations[placeholder]);
            }
        });

        // Перевод aria-label
        document.querySelectorAll('[aria-label]').forEach(element => {
            if (shouldIgnoreElement(element)) return;
            const label = element.getAttribute('aria-label');
            if (label && !hasCyrillic(label) && translations[label]) {
                element.setAttribute('aria-label', translations[label]);
            }
        });

        // Перевод title
        document.querySelectorAll('[title]').forEach(element => {
            if (shouldIgnoreElement(element)) return;
            if (element.tagName === 'A' && element.closest('.react-directory-filename-column')) {
                return;
            }
            const title = element.getAttribute('title');
            if (title && !hasCyrillic(title) && translations[title]) {
                element.setAttribute('title', translations[title]);
            }
        });

        // Перевод alt
        document.querySelectorAll('[alt]').forEach(element => {
            if (shouldIgnoreElement(element)) return;
            const alt = element.getAttribute('alt');
            if (alt && !hasCyrillic(alt) && translations[alt]) {
                element.setAttribute('alt', translations[alt]);
            }
        });

        // Перевод value и input
        document.querySelectorAll('input[type="submit"], input[type="button"], button, .btn').forEach(element => {
            if (shouldIgnoreElement(element)) return;
            if (element.tagName === 'INPUT' && element.value && !hasCyrillic(element.value) && translations[element.value]) {
                element.value = translations[element.value];
            }
            if (element.tagName === 'BUTTON') {
                const text = element.textContent.trim();
                if (text && !hasCyrillic(text) && translations[text]) {
                    element.textContent = element.textContent.replace(text, translations[text]);
                }
            }
            if (element.getAttribute('data-disable-with')) {
                const disableText = element.getAttribute('data-disable-with');
                if (disableText && !hasCyrillic(disableText) && translations[disableText]) {
                    element.setAttribute('data-disable-with', translations[disableText]);
                }
            }
        });

        // Перевод btn
        document.querySelectorAll('a.btn, a.btn-danger, a.btn-primary, a.Button').forEach(element => {
            if (shouldIgnoreElement(element)) return;
            const text = element.textContent.trim();
            if (text && !hasCyrillic(text) && translations[text]) {
                element.textContent = translations[text];
            }
        });
    }

    // Функция для перевода многострочных текстов
    function translateMultilineTexts() {
        const textElements = document.querySelectorAll(
            '.note, .form-group .note, .help-text, .form-note, .annotation, ' +
            '.caption, .subtext, .info-text, [class*="note"], [class*="help"], ' +
            '[class*="description"], [class*="caption"], p.description, .Box-body, ' +
            '.flash, .alert, .details, #copilot_blackbird_external_indexing_label, ' +
            '#copilot_experimental_auto_models_label, #copilot_mcp_label'
        );

        textElements.forEach(element => {
            if (shouldIgnoreElement(element)) {
                return;
            }

            if (hasCyrillic(element.textContent)) {
                return;
            }

            if (element.querySelector('a, button, input, select, textarea, .btn, .Button')) {
                const fullText = element.textContent.replace(/\s+/g, ' ').trim();

                for (const [en, ru] of Object.entries(translations)) {
                    if (fullText === en) {
                        const links = element.querySelectorAll('a');
                        if (links.length > 0) {
                            let newHtml = element.innerHTML;
                            for (const link of links) {
                                const linkText = link.textContent;
                                newHtml = newHtml.replace(link.outerHTML, `{{LINK_${linkText}}}`);
                            }
                            newHtml = newHtml.replace(en, ru);
                            for (const link of links) {
                                const linkText = link.textContent;
                                newHtml = newHtml.replace(`{{LINK_${linkText}}}`, link.outerHTML);
                            }
                            element.innerHTML = newHtml;
                        } else {
                            element.textContent = ru;
                        }
                        return;
                    }
                }
                return;
            }

            let textNodeCount = 0;
            element.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                    textNodeCount++;
                }
            });

            const hasLineBreaksInText = element.textContent.includes('\n');

            if (textNodeCount <= 1 && !hasLineBreaksInText) {
                return;
            }

            const fullText = element.textContent.replace(/\s+/g, ' ').trim();

            if (translations[fullText]) {
                element.textContent = translations[fullText];
                return;
            }

            const sentences = fullText.split(/\.\s+/);
            if (sentences.length > 1) {
                let translatedHtml = '';
                let hasTranslation = false;

                sentences.forEach((sentence, index) => {
                    const trimmed = sentence.trim();
                    if (translations[trimmed]) {
                        translatedHtml += translations[trimmed];
                        if (index < sentences.length - 1) translatedHtml += '. ';
                        hasTranslation = true;
                    } else if (translations[trimmed + '.']) {
                        translatedHtml += translations[trimmed + '.'];
                        if (index < sentences.length - 1) translatedHtml += ' ';
                        hasTranslation = true;
                    } else {
                        translatedHtml += sentence;
                        if (index < sentences.length - 1) translatedHtml += '. ';
                    }
                });

                if (hasTranslation) {
                    element.textContent = translatedHtml;
                }
            }
        });
    }

    // Функция для перевода многострочных атрибутов с проверкой на кириллицу
    function translateMultilineAttributes() {
        const attrElements = document.querySelectorAll('[title], [aria-label], [placeholder], [alt]');

        attrElements.forEach(element => {
            if (shouldIgnoreElement(element)) return;

            ['title', 'aria-label', 'placeholder', 'alt'].forEach(attr => {
                const value = element.getAttribute(attr);
                if (value && value.includes('\n') && !hasCyrillic(value)) {
                    const normalized = value.replace(/\s+/g, ' ').trim();
                    if (translations[normalized]) {
                        element.setAttribute(attr, translations[normalized]);
                    }
                }
            });
        });
    }

    // Функция для перевода React-компонентов по словарю
    function translateReactElements() {
        // Перевод Overlay
        document.querySelectorAll('.Overlay-title').forEach(element => {
            if (shouldIgnoreElement(element)) return;
            const text = element.textContent.trim();
            if (text && translations[text] && !hasCyrillic(text)) {
                element.textContent = translations[text];
            }
        });

        // Перевод btn-primary, btn, button
        document.querySelectorAll('.btn-primary, .btn, button[type="submit"]').forEach(element => {
            if (shouldIgnoreElement(element)) return;
            const text = element.textContent.trim();
            if (text && translations[text] && !hasCyrillic(text)) {
                element.textContent = translations[text];
            }
        });

        // Перевод select, optgroup, option
        document.querySelectorAll('select, optgroup, option').forEach(element => {
            if (shouldIgnoreElement(element)) return;

            if (element.tagName === 'OPTGROUP' && element.label) {
                if (translations[element.label] && !hasCyrillic(element.label)) {
                    element.label = translations[element.label];
                }
            }

            // Перевод aria-label
            const ariaLabel = element.getAttribute('aria-label');
            if (ariaLabel && translations[ariaLabel] && !hasCyrillic(ariaLabel)) {
                element.setAttribute('aria-label', translations[ariaLabel]);
            }

            // Перевод option
            if (element.tagName === 'OPTION') {
                const text = element.textContent.trim();
                if (text && translations[text] && !hasCyrillic(text)) {
                    element.textContent = translations[text];
                }
            }

            // Перевод optgroup
            if (element.tagName === 'OPTGROUP') {
                const text = element.textContent.trim();
                if (text && translations[text] && !hasCyrillic(text)) {
                    element.textContent = translations[text];
                }
            }
        });
    }

    // Функция для перевода SVG графики
    function translateSVGGraphs() {
        // Перевод всех текстов внутри SVG элементов
        const allSvgTexts = document.querySelectorAll('svg text, svg textContent');
        allSvgTexts.forEach(text => {
            const content = text.textContent.trim();
            if (content && !hasCyrillic(content) && translations[content]) {
                text.textContent = translations[content];
            }
        });

        // Перевод всех title внутри SVG
        const allSvgTitles = document.querySelectorAll('svg title');
        allSvgTitles.forEach(title => {
            const content = title.textContent;
            if (content && !hasCyrillic(content) && translations[content]) {
                title.textContent = translations[content];
            }
        });

        // Перевод всех aria-label внутри SVG
        const allSvgElements = document.querySelectorAll('svg, svg *');
        allSvgElements.forEach(element => {
            const ariaLabel = element.getAttribute('aria-label');
            if (ariaLabel && !hasCyrillic(ariaLabel) && translations[ariaLabel]) {
                element.setAttribute('aria-label', translations[ariaLabel]);
            }
        });

        // Перевод aria-label у Progress элементов
        const progressElements = document.querySelectorAll('.Progress[role="img"]');
        progressElements.forEach(el => {
            const ariaLabel = el.getAttribute('aria-label');
            if (ariaLabel && !hasCyrillic(ariaLabel)) {
                const match = ariaLabel.match(/^(\d+)% of commits in (\w+) were made to (.+)$/);
                if (match) {
                    const percent = match[1];
                    const month = match[2];
                    const repo = match[3];
                    const monthTrans = translations[month] || month;
                    el.setAttribute('aria-label', `${percent}% коммитов в ${monthTrans} было сделано в ${repo}`);
                } else if (translations[ariaLabel]) {
                    el.setAttribute('aria-label', translations[ariaLabel]);
                }
            }
        });

        // Перевод текста "Activity overview"
        const activityHeaders = document.querySelectorAll('h3.tmp-mb-3.text-normal.f5');
        activityHeaders.forEach(header => {
            const text = header.textContent.replace(/\s+/g, ' ').trim();
            if (text === 'Activity overview') {
                header.textContent = 'Обзор активности';
            }
        });

        // Перевод текста "Contributed to"
        const contributedTexts = document.querySelectorAll('.wb-break-word');
        contributedTexts.forEach(el => {
            const text = el.textContent.trim();
            if (text.startsWith('Contributed to') && translations['Contributed to']) {
                const links = el.querySelectorAll('a');
                if (links.length) {
                    const repos = Array.from(links).map(a => a.textContent).join(', ');
                    el.innerHTML = `${translations['Contributed to']} ${repos}`;
                }
            }
        });

        // Перевод блока с количеством вкладов
        const contributionDesc = document.querySelector('#js-contribution-activity-description');
        if (contributionDesc) {
            const text = contributionDesc.textContent.replace(/\s+/g, ' ').trim();

            let match = text.match(/^(\d+(?:,\d+)?)\s+contributions?\s+in\s+the\s+last\s+year$/i);
            if (match) {
                const num = parseInt(match[1].replace(/,/g, ''), 10);
                const word = (num === 1) ? 'вклад' : ((num >= 2 && num <= 4) ? 'вклада' : 'вкладов');
                contributionDesc.textContent = `${num.toLocaleString()} ${word} за последний год`;
            }

            match = text.match(/^(\d+(?:,\d+)?)\s+contributions?\s+in\s+(\d{4})$/i);
            if (match) {
                const num = parseInt(match[1].replace(/,/g, ''), 10);
                const year = match[2];
                const word = (num === 1) ? 'вклад' : ((num >= 2 && num <= 4) ? 'вклада' : 'вкладов');
                contributionDesc.textContent = `${num.toLocaleString()} ${word} в ${year} году`;
            }
        }

        // Перевод блока с количеством коммитов
        const commitLinks = document.querySelectorAll('a[href*="/commits?"]');
        commitLinks.forEach(link => {
            const text = link.textContent.trim();
            const match = text.match(/^(\d+)\s+commits?$/);
            if (match) {
                const num = parseInt(match[1], 10);
                const commitWord = (num === 1) ? 'коммит' : ((num >= 2 && num <= 4) ? 'коммита' : 'коммитов');
                link.textContent = `${num} ${commitWord}`;
            }
        });

        // Перевод блока активности
        const activitySpans = document.querySelectorAll('span.color-fg-default.ws-normal.text-left, span.float-left.ws-normal.text-left.color-fg-default');
        activitySpans.forEach(span => {
            const text = span.textContent.replace(/\s+/g, ' ').trim();

            let match = text.match(/^Opened\s+(\d+)\s+pull\s+request\s+in\s+(\d+)\s+repositories?$/i);
            if (match) {
                const prs = parseInt(match[1], 10);
                const repos = parseInt(match[2], 10);
                const prWord = (prs === 1) ? 'запрос на слияние' : ((prs >= 2 && prs <= 4) ? 'запроса на слияние' : 'запросов на слияние');
                const reposWord = (repos === 1) ? 'репозитории' : ((repos >= 2 && repos <= 4) ? 'репозиториях' : 'репозиториях');
                span.textContent = `Открыто ${prs} ${prWord} в ${repos} ${reposWord}`;
                return;
            }

            match = text.match(/^Opened\s+(\d+)\s+issue\s+in\s+(\d+)\s+repositories?$/i);
            if (match) {
                const issues = parseInt(match[1], 10);
                const repos = parseInt(match[2], 10);
                const issueWord = (issues === 1) ? 'задачу' : ((issues >= 2 && issues <= 4) ? 'задачи' : 'задач');
                const reposWord = (repos === 1) ? 'репозитории' : ((repos >= 2 && repos <= 4) ? 'репозиториях' : 'репозиториях');
                span.textContent = `Открыто ${issues} ${issueWord} в ${repos} ${reposWord}`;
                return;
            }

            match = text.match(/^Created\s+(\d+)\s+commits?\s+in\s+(\d+)\s+repositories?$/i);
            if (match) {
                const commits = parseInt(match[1], 10);
                const repos = parseInt(match[2], 10);
                const commitWord = (commits === 1) ? 'коммит' : ((commits >= 2 && commits <= 4) ? 'коммита' : 'коммитов');
                const reposWord = (repos === 1) ? 'репозитории' : ((repos >= 2 && repos <= 4) ? 'репозиториях' : 'репозиториях');
                span.textContent = `Создано ${commits} ${commitWord} в ${repos} ${reposWord}`;
                return;
            }

            match = text.match(/^Created\s+(\d+)\s+repository$/i);
            if (match) {
                const num = parseInt(match[1], 10);
                const word = (num === 1) ? 'репозиторий' : ((num >= 2 && num <= 4) ? 'репозитория' : 'репозиториев');
                span.textContent = `Создано ${num} ${word}`;
                return;
            }

            match = text.match(/^Created\s+(\d+)\s+repositories$/i);
            if (match) {
                const num = parseInt(match[1], 10);
                const word = (num === 1) ? 'репозиторий' : ((num >= 2 && num <= 4) ? 'репозитория' : 'репозиториев');
                span.textContent = `Создано ${num} ${word}`;
            }
        });
    }

    // Основная функция перевода
    function translatePage() {
        if (shouldIgnorePage()) {
            return;
        }

        // Переводим основной контент
        walkDOM(document.body);

        // Переводим атрибуты
        translateAttributes();

        // Переводим многострочные тексты
        translateMultilineTexts();
        translateMultilineAttributes();

        // Переводим React-компоненты
        translateReactElements();

        // Специальная обработка для динамически загружаемого контента
        const selectors = 'button, a, span, div, h1, h2, h3, h4, h5, h6, p, label, td, th';
        document.querySelectorAll(selectors).forEach(element => {
            if (shouldIgnoreElement(element)) return;

            if (element.childNodes.length === 1 &&
                element.firstChild.nodeType === Node.TEXT_NODE &&
                !shouldIgnoreElement(element)) {
                const text = element.textContent;
                if (!hasCyrillic(text)) {
                    if (translations[text]) {
                        element.textContent = translations[text];
                    } else {
                        // Проверяем числовые паттерны
                        const numberedTranslation = translateNumberedText(text);
                        if (numberedTranslation) {
                            element.textContent = numberedTranslation;
                        }
                    }
                }
            }
        });

        translateSVGGraphs();
        translateDialogElements();
        translateTimelineActivity();
        translateArchiveFlashMessage();
        translateBlankslateWithUsernames();
        translateFormElements();
        translateTimelineEvents();
        translatePRLinks();
    }

    // Запуск перевода при загрузке страницы
    let initialTranslateDone = false;
    function delayedTranslate() {
        if (!initialTranslateDone) {
            translatePage();
            initialTranslateDone = true;
        }
    }
    setTimeout(delayedTranslate, 500);

    // Наблюдатель за изменениями DOM
    const observer = new MutationObserver(function(mutations) {
        if (shouldIgnorePage()) {
            return;
        }

        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (shouldIgnoreElement(node)) {
                            return;
                        }

                        walkDOM(node);
                        // Переводим атрибуты у новых элементов
                        if (node.querySelectorAll) {
                            node.querySelectorAll('[placeholder], [aria-label], [title], [alt]').forEach(element => {
                                if (shouldIgnoreElement(element)) return;
                                ['placeholder', 'aria-label', 'title', 'alt'].forEach(attr => {
                                    const value = element.getAttribute(attr);
                                    if (value && !hasCyrillic(value) && translations[value]) {
                                        element.setAttribute(attr, translations[value]);
                                    }
                                });
                            });
                            // Перевод value и input
                            node.querySelectorAll('input[type="submit"], input[type="button"], button, .btn').forEach(element => {
                                if (shouldIgnoreElement(element)) return;
                                if (element.tagName === 'INPUT' && element.value && !hasCyrillic(element.value) && translations[element.value]) {
                                    element.value = translations[element.value];
                                }
                                if (element.tagName === 'BUTTON') {
                                    const text = element.textContent.trim();
                                    if (text && !hasCyrillic(text) && translations[text]) {
                                        element.textContent = element.textContent.replace(text, translations[text]);
                                    }
                                }
                                if (element.getAttribute('data-disable-with')) {
                                    const disableText = element.getAttribute('data-disable-with');
                                    if (disableText && !hasCyrillic(disableText) && translations[disableText]) {
                                        element.setAttribute('data-disable-with', translations[disableText]);
                                    }
                                }
                            });
                            // Перевод btn
                            node.querySelectorAll('a.btn, a.btn-danger, a.btn-primary, a.Button').forEach(element => {
                                if (shouldIgnoreElement(element)) return;
                                const text = element.textContent.trim();
                                if (text && !hasCyrillic(text) && translations[text]) {
                                    element.textContent = translations[text];
                                }
                            });
                            setTimeout(() => {
                                translateSVGGraphs();
                                translateBlankslateWithUsernames();
                                translateTimelineEvents();
                            }, 50);
                        }
                    }
                });
            }
        });

        // Переводим многострочные тексты после изменений
        setTimeout(() => {
            translateMultilineTexts();
            translateMultilineAttributes();
            translateReactElements();
            translateSVGGraphs();
            translateDialogElements();
            translateTimelineActivity();
            translateArchiveFlashMessage();
            translateBlankslateWithUsernames();
            translateTimelineEvents();
            translatePRLinks();
        }, 50);
    });

    // Запускаем наблюдатель
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Обработка навигации SPA
    let originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        setTimeout(() => {
            translatePage();
        }, 100);
    };

    let originalReplaceState = history.replaceState;
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        setTimeout(() => {
            translatePage();
        }, 100);
    };

    window.addEventListener('popstate', () => {
        setTimeout(() => {
            translatePage();
        }, 100);
    });

    // Обработка событий Turbo/PJAX
    document.addEventListener('turbo:load', () => setTimeout(translatePage, 100));
    document.addEventListener('turbo:render', () => setTimeout(translatePage, 100));
    document.addEventListener('turbo:before-cache', () => setTimeout(translatePage, 100));
    document.addEventListener('turbo:before-render', () => setTimeout(translatePage, 100));
    document.addEventListener('pjax:end', () => setTimeout(translatePage, 100));
    document.addEventListener('pjax:success', () => setTimeout(translatePage, 100));

    // Универсальный обработчик для отслеживания изменений URL
    let lastUrl = window.location.href;
    const urlObserver = new MutationObserver(function() {
        if (lastUrl !== window.location.href) {
            lastUrl = window.location.href;
            setTimeout(() => {
                translatePage();
            }, 100);
        }
    });
    urlObserver.observe(document, { subtree: true, childList: true });

    // Дополнительные обработчики для полной совместимости
    window.addEventListener('pushstate', () => setTimeout(translatePage, 100));
    window.addEventListener('replacestate', () => setTimeout(translatePage, 100));
    document.addEventListener('DOMContentLoaded', () => setTimeout(translatePage, 100));
    window.addEventListener('load', () => setTimeout(translatePage, 100));

    // Добавляем индикатор, что скрипт работает
    console.log('🌐 GitHub Russian Translation активирован');
})();