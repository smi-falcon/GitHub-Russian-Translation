// ==UserScript==
// @name         GitHub Time Translation
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Перевод дат и времени сайта GitHub на русский язык.
// @downloadURL  https://github.com/smi-falcon/GitHub-Russian-Translation/raw/main/Userscript/GitHub%20Time%20Translation.js
// @updateURL    https://github.com/smi-falcon/GitHub-Russian-Translation/raw/main/Userscript/GitHub%20Time%20Translation.js
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
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Флаг отслеживания состояния перевода
    let isTranslating = false;

    // Словарь переводов временных выражений
    const timeTranslations = {
        // Относительное время
        'just now': 'только что',
        'a minute ago': 'минуту назад',
        'an hour ago': 'час назад',
        'a day ago': 'день назад',
        'a week ago': 'неделю назад',
        'a month ago': 'месяц назад',
        'a year ago': 'год назад',
        '1 year ago': 'год назад',
        'yesterday': 'вчера',
        'now': 'только что',
        'last week': 'на прошлой неделе',
        'last month': 'в прошлом месяце',
        'last year': 'в прошлом году',
        'last 3 months': 'за последние 3 месяца',
        'last 6 months': 'за последние 6 месяцев',
        'last 3 weeks': 'за последние 3 недели',
        'last 6 weeks': 'за последние 6 недель',
        'last 3 days': 'за последние 3 дня',
        'last 6 days': 'за последние 6 дней',
        'this month': 'в этом месяце',
        'this week': 'на этой неделе',
        'this year': 'в этом году',
        'Joined last month': 'Присоединился в прошлом месяце',
        'Joined last week': 'Присоединился на прошлой неделе',
        'Joined last year': 'Присоединился в прошлом году',
        'year': 'год',
        'years': 'лет',

        // Абсолютное время
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
        'Jan': 'янв.',
        'Feb': 'фев.',
        'Mar': 'мар.',
        'Apr': 'апр.',
        'May': 'май',
        'Jun': 'июн.',
        'Jul': 'июл.',
        'Aug': 'авг.',
        'Sep': 'сен.',
        'Oct': 'окт.',
        'Nov': 'ноя.',
        'Dec': 'дек.',

        // Дни недели
        'Monday': 'понедельник',
        'Tuesday': 'вторник',
        'Wednesday': 'среда',
        'Thursday': 'четверг',
        'Friday': 'пятница',
        'Saturday': 'суббота',
        'Sunday': 'воскресенье',
        'Mon': 'пн',
        'Tue': 'вт',
        'Wed': 'ср',
        'Thu': 'чт',
        'Fri': 'пт',
        'Sat': 'сб',
        'Sun': 'вс',

        // Перевод предлога в контексте дат
        'on': 'на',
    };

    // Функция для склонения числительных
    function pluralize(number, forms) {
        const num = Math.abs(number) % 100;
        const num1 = num % 10;

        if (num > 10 && num < 20) {
            return forms[2];
        }
        if (num1 > 1 && num1 < 5) {
            return forms[1];
        }
        if (num1 === 1) {
            return forms[0];
        }
        return forms[2];
    }

    // Функция для правильного перевода числовых временных выражений
    function translateNumberWithUnit(number, unit) {
        const num = parseInt(number);

        const units = {
            'second': ['секунду', 'секунды', 'секунд'],
            'minute': ['минуту', 'минуты', 'минут'],
            'hour': ['час', 'часа', 'часов'],
            'day': ['день', 'дня', 'дней'],
            'week': ['неделю', 'недели', 'недель'],
            'month': ['месяц', 'месяца', 'месяцев'],
            'year': ['год', 'года', 'лет']
        };

        if (units[unit]) {
            return `${num} ${pluralize(num, units[unit])}`;
        }

        return `${num} ${unit}`;
    }

    // Функция для проверки режима редактирования
    function isInEditMode() {
        // Проверка видимых редакторов кода
        if (document.querySelector('.CodeMirror') ||
            document.querySelector('[data-qa-code-editor]') ||
            document.querySelector('.blob-editor-container') ||
            document.querySelector('.cm-editor') ||
            document.querySelector('.code-editor') ||
            document.querySelector('.comment-form-textarea') ||
            document.querySelector('.commit-create') ||
            document.querySelector('.diff-table') ||
            document.querySelector('.editor') ||
            document.querySelector('.file-editor') ||
            document.querySelector('.js-blob-form') ||
            document.querySelector('.js-code-container') ||
            document.querySelector('.js-code-editor') ||
            document.querySelector('.js-comment-field') ||
            document.querySelector('.js-diff-load-container') ||
            document.querySelector('.js-diff-progressive-container') ||
            document.querySelector('.js-file') ||
            document.querySelector('.js-file-content') ||
            document.querySelector('.js-gist-content') ||
            document.querySelector('.js-gist-file-content') ||
            document.querySelector('.js-gist-update-url') ||
            document.querySelector('.js-new-blob-form') ||
            document.querySelector('.js-previewable-comment-form') ||
            document.querySelector('.monaco-editor') ||
            document.querySelector('.text-diff-container')) {
            return true;
        }

        // Проверка URL на режимы редактирования
        if (window.location.href.includes('/blob/') ||
            window.location.href.includes('/commit/') ||
            window.location.href.includes('/compare/') ||
            window.location.href.includes('/discussions/') && window.location.href.includes('/edit/') ||
            window.location.href.includes('/edit/') ||
            window.location.href.includes('/gist/') && window.location.href.includes('/edit/') ||
            window.location.href.includes('/issues/') && window.location.href.includes('/edit/') ||
            window.location.href.includes('/new/') ||
            window.location.href.includes('/pull/') ||
            window.location.href.includes('/releases/') && window.location.href.includes('/edit/') ||
            window.location.href.includes('/tree/')) {
            return true;
        }

        // Проверка активных текстовых областей и полей ввода
        const activeElement = document.activeElement;
        if (activeElement && (
            activeElement.matches('[contenteditable="true"]') ||
            activeElement.matches('.comment-form-textarea') ||
            activeElement.matches('input[type="search"]') ||
            activeElement.matches('input[type="text"]') ||
            activeElement.matches('.js-blob-form') ||
            activeElement.matches('.js-code-editor') ||
            activeElement.matches('.js-comment-field') ||
            activeElement.matches('.js-gist-file-content') ||
            activeElement.matches('.js-previewable-comment-form') ||
            activeElement.matches('textarea'))) {
            return true;
        }

        return false;
    }

    // Функция для проверки, является ли элемент частью кода или техническим контентом
    function isCodeOrTechnicalElement(element) {
        // Для элементов relative-time и time-ago всегда разрешаем перевод
        if (element.matches && element.matches('relative-time, time-ago')) {
            return false;
        }

        // Критические селекторы, которые точно являются кодом
        const criticalCodeSelectors = [
            '#new_blob',
            '#readme',
            '.blob-code',
            '.blob-code-inner',
            '.blob-editor-container',
            '.cm-editor',
            '.code-editor',
            '.CodeMirror',
            '.commit-create',
            '.CommitRow-module__ListItemTitle_0__cUhJS',
            '.DirectoryRichtextContent-module__SharedMarkdownContent__hHXUL',
            '.file-editor',
            '.highlight',
            '.js-blob-form',
            '.js-file-line',
            '.js-file-line-container',
            '.markdown-body',
            '.monaco-editor',
            '.react-code-text',
            '.react-directory-row-commit-cell',
            '.react-directory-commit-cell',
            '[data-code-marker]',
            '[data-qa-code-editor]',
            '[data-target="readme-toc.contentSticky"]',
            '[data-testid="commit-row"]',
            'code',
            'pre'
        ];

        // Проверка по критическим селекторам
        for (const selector of criticalCodeSelectors) {
            if (element.closest(selector)) {
                return true;
            }
        }

        // Проверка по классам элемента
        const criticalCodeClasses = [
            'blob-code',
            'blob-code-inner',
            'highlight',
            'js-file-line',
            'react-code-text'
        ];

        for (const className of criticalCodeClasses) {
            if (element.classList.contains(className)) {
                return true;
            }
        }

        // Проверка по атрибутам
        if (element.getAttribute('data-code-marker') ||
            element.getAttribute('data-qa-code-editor')) {
            return true;
        }

        // Проверка на camelCase, PascalCase, snake_case и kebab-case паттерны
        const text = element.textContent.trim();
        if (text.length > 0) {
            // Проверка camelCase и PascalCase
            if (/([a-z][A-Z]|[A-Z][a-z][A-Z])/.test(text) && text.length > 10) {
                return true;
            }

            // Проверка snake_case и kebab-case
            if ((text.includes('_') || (text.includes('-') && !text.includes(' '))) && text.length > 8) {
                return true;
            }

            // Проверка на технические идентификаторы
            if (/^[a-zA-Z0-9_\-\.]+$/.test(text) && text.length > 6) {
                return true;
            }

            // Проверка на JSON, XML, HTML теги
            if (/^{.*}$/.test(text) || /^<[^>]+>$/.test(text) || text.includes('<?xml') || text.includes('<!DOCTYPE')) {
                return true;
            }

            // Проверка на пути и URL
            if (text.includes('/') && (text.includes('.') || text.includes('://')) && text.length > 8) {
                return true;
            }

            // Исключение для коротких временных выражений
            if (text.length <= 3 && /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/i.test(text)) {
                return false;
            }
        }

        return false;
    }

    // Функция для перевода относительного времени
    function translateRelativeTime(text) {
        // Проверка на кириллицу
        if (/[а-яА-ЯёЁ]/.test(text)) return text;
        // Пропускаем уже переведенный текст
        if (text.includes('назад') || text.includes('только что') || text.includes('вчера') ||
            text.includes('прошлом') || text.includes('этом') || text.includes('пн') || text.includes('вт') ||
            text.includes('ср') || text.includes('чт') || text.includes('пт') || text.includes('сб') || text.includes('вс')) {
            return text;
        }

        let translated = text;

        // Паттерны для относительных выражений
        const lastPatterns = [
            { regex: /last\s+(\d+)\s+months?/i, prefix: 'за последние', unit: 'month' },
            { regex: /last\s+(\d+)\s+weeks?/i, prefix: 'за последние', unit: 'week' },
            { regex: /last\s+(\d+)\s+days?/i, prefix: 'за последние', unit: 'day' },
            { regex: /last\s+(\d+)\s+years?/i, prefix: 'за последние', unit: 'year' }
        ];

        for (const pattern of lastPatterns) {
            const match = translated.match(pattern.regex);
            if (match) {
                const number = match[1];
                const unit = pattern.unit;
                translated = `${pattern.prefix} ${translateNumberWithUnit(number, unit)}`;
                break;
            }
        }

        // Паттерны для числовых временных выражений
        const timePatterns = [
            { regex: /(\d+)\s+seconds?\s+ago/i, unit: 'second' },
            { regex: /(\d+)\s+minutes?\s+ago/i, unit: 'minute' },
            { regex: /(\d+)\s+hours?\s+ago/i, unit: 'hour' },
            { regex: /(\d+)\s+days?\s+ago/i, unit: 'day' },
            { regex: /(\d+)\s+weeks?\s+ago/i, unit: 'week' },
            { regex: /(\d+)\s+months?\s+ago/i, unit: 'month' },
            { regex: /(\d+)\s+years?\s+ago/i, unit: 'year' },
            { regex: /^a\s+second\s+ago$/i, unit: 'second', value: 1 },
            { regex: /^a\s+minute\s+ago$/i, unit: 'minute', value: 1 },
            { regex: /^an?\s+hour\s+ago$/i, unit: 'hour', value: 1 },
            { regex: /^a\s+day\s+ago$/i, unit: 'day', value: 1 },
            { regex: /^a\s+week\s+ago$/i, unit: 'week', value: 1 },
            { regex: /^a\s+month\s+ago$/i, unit: 'month', value: 1 },
            { regex: /^a\s+year\s+ago$/i, unit: 'year', value: 1 }
        ];

        for (const pattern of timePatterns) {
            const match = translated.match(pattern.regex);
            if (match) {
                if (pattern.value !== undefined) {
                    translated = translateNumberWithUnit(pattern.value, pattern.unit) + ' назад';
                } else {
                    const number = match[1];
                    translated = translateNumberWithUnit(number, pattern.unit) + ' назад';
                }
                break;
            }
        }

        // Паттерны для периодов времени
        const periodPatterns = [
            { regex: /^(\d+)\s+hours?$/i, unit: 'hour' },
            { regex: /^(\d+)\s+days?$/i, unit: 'day' },
            { regex: /^(\d+)\s+weeks?$/i, unit: 'week' },
            { regex: /^(\d+)\s+months?$/i, unit: 'month' },
            { regex: /^a\s+hour$/i, unit: 'hour', value: 1 },
            { regex: /^a\s+day$/i, unit: 'day', value: 1 },
            { regex: /^a\s+week$/i, unit: 'week', value: 1 },
            { regex: /^a\s+month$/i, unit: 'month', value: 1 }
        ];

        for (const pattern of periodPatterns) {
            const match = translated.match(pattern.regex);
            if (match) {
                if (pattern.value !== undefined) {
                    translated = translateNumberWithUnit(pattern.value, pattern.unit);
                } else {
                    const number = match[1];
                    translated = translateNumberWithUnit(number, pattern.unit);
                }
                break;
            }
        }

        // Перевод стандартных выражений
        for (const [en, ru] of Object.entries(timeTranslations)) {
            // Для коротких аббревиатур используем строгую проверку с границами слов
            if (en.length <= 3) {
                const regex = new RegExp('\\b' + en + '\\b', 'gi');
                translated = translated.replace(regex, ru);
            } else {
                const regex = new RegExp('\\b' + en + '\\b', 'gi');
                translated = translated.replace(regex, ru);
            }
        }

        return translated;
    }

    // Функция для перевода абсолютного времени
    function translateAbsoluteTime(text) {
        let translated = text;

        // Простая и надежная замена с границами слов
        for (const [en, ru] of Object.entries(timeTranslations)) {
            const regex = new RegExp('\\b' + en + '\\b', 'gi');
            translated = translated.replace(regex, ru);
        }

        // Добавление указания временной зоны
        if (translated !== text && translated.includes('GMT')) {
            translated = translated.replace('GMT', 'по московскому времени');
        }

        return translated;
    }

    // Специальная обработка элементов меню ActionList
    function translateActionListItems() {
        // Находим все элементы меню с текстом времени
        document.querySelectorAll('.prc-ActionList-ItemLabel-81ohH').forEach(element => {
            const text = element.textContent.trim();

            // Проверяем, содержит ли текст временные выражения
            const timePattern = /^(24 hours|3 days|1 week|1 month|\d+\s+(hours?|days?|weeks?|months?))$/i;
            if (timePattern.test(text) && !isCodeOrTechnicalElement(element)) {
                const translated = translateRelativeTime(text);
                if (translated !== text) {
                    element.textContent = translated;
                }
            }
        });

        // Также проверяем элементы с похожими классами
        document.querySelectorAll('[class*="ActionList-ItemLabel"]').forEach(element => {
            const text = element.textContent.trim();
            const timePattern = /^(24 hours|3 days|1 week|1 month|\d+\s+(hours?|days?|weeks?|months?))$/i;
            if (timePattern.test(text) && !isCodeOrTechnicalElement(element)) {
                const translated = translateRelativeTime(text);
                if (translated !== text) {
                    element.textContent = translated;
                }
            }
        });
    }

    // Функция для перевода атрибутов времени
    function translateTimeAttributes() {
        // Перевод title у элементов времени
        document.querySelectorAll('[title*="GMT"], [title*="Jan"], [title*="Feb"], [title*="Mar"], [title*="Apr"], [title*="May"], [title*="Jun"], [title*="Jul"], [title*="Aug"], [title*="Sep"], [title*="Oct"], [title*="Nov"], [title*="Dec"], [title*="Mon"], [title*="Tue"], [title*="Wed"], [title*="Thu"], [title*="Fri"], [title*="Sat"], [title*="Sun"]').forEach(element => {
            const title = element.getAttribute('title');
            if (title && !title.includes('московскому')) {
                const translatedTitle = translateAbsoluteTime(title);
                if (translatedTitle !== title) {
                    element.setAttribute('title', translatedTitle);
                }
            }
        });

        // Перевод placeholder с временными значениями
        document.querySelectorAll('[placeholder*="ago"], [placeholder*="yesterday"], [placeholder*="week"], [placeholder*="month"], [placeholder*="year"]').forEach(element => {
            const placeholder = element.getAttribute('placeholder');
            if (placeholder) {
                const translated = translateRelativeTime(placeholder);
                if (translated !== placeholder) {
                    element.setAttribute('placeholder', translated);
                }
            }
        });

        // Перевод предлога "on" в title атрибутах
        document.querySelectorAll('[title*=" on "]').forEach(element => {
            const title = element.getAttribute('title');
            if (title) {
                const newTitle = title.replace(/\bon\b/g, 'на');
                if (newTitle !== title) {
                    element.setAttribute('title', newTitle);
                }
            }
        });
    }

    // Функция для перевода предлога "on" в атрибутах title у relative-time элементов
    function translateOnInTitle() {
        document.querySelectorAll('relative-time, time-ago, time').forEach(element => {
            const title = element.getAttribute('title');
            if (title && title.includes(' on ')) {
                const newTitle = title.replace(/\bon\b/g, 'на');
                if (newTitle !== title) {
                    element.setAttribute('title', newTitle);
                }
            }
        });
    }

    // Функция для исправления ошибок в переводе
    function fixTranslationErrors() {
        if (!document.body) return;

        // Флеш-баннер архивации репозитория
        const flashSelectors = [
            '.flash-warn',
            '.flash-error',
            '.flash-notice',
            '[data-component="Flash"]',
            '[class*="ArchivedRepoBanner"]'
        ];
        const flashElements = new Set();
        flashSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => flashElements.add(el));
        });

        flashElements.forEach(flash => {
            const text = flash.textContent.trim();
            if (text.startsWith('Этот репозиторий')) return;

            const m = text.match(/This repo(?:sitory)? was archived by the owner (?:on|на) (.+?)\.\s*It is (?:now|только что)?\s*read-only\.?/);
            if (!m) return;

            const walker = document.createTreeWalker(flash, NodeFilter.SHOW_TEXT);
            let n;
            while (n = walker.nextNode()) {
                if (n.textContent.includes('This repo')) {
                    n.textContent = `Этот репозиторий был архивирован владельцем ${m[1]}. Он только для чтения.`;
                    break;
                }
            }
        });

        // Откат ложного перевода в обычном тексте
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    const t = node.textContent;
                    if (!t || !t.includes('только что')) return NodeFilter.FILTER_REJECT;
                    if (!/только что [a-zA-Z]/.test(t)) return NodeFilter.FILTER_REJECT;
                    const parent = node.parentElement;
                    if (!parent) return NodeFilter.FILTER_REJECT;
                    if (parent.closest(
                        'code, pre, .blob-code, .blob-code-inner, .highlight, ' +
                        '.markdown-body, .js-file-line-container, #readme, ' +
                        '[data-qa-code-editor], .CodeMirror, .cm-editor, .monaco-editor, ' +
                        '.js-file-line, .react-code-text, [data-code-marker], ' +
                        '.diff-table, .file-editor, .js-file-content, .js-gist-file-content'
                    )) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const nodes = [];
        let n;
        while (n = walker.nextNode()) nodes.push(n);
        nodes.forEach(node => {
            node.textContent = node.textContent.replace(/только что (?=[a-zA-Z])/g, 'now ');
        });
    }

    // Основная функция перевода временных элементов
    function translateTimeElements() {
        if (isTranslating || isInEditMode()) return;
        isTranslating = true;

        try {
            // Обработка элементов relative-time
            document.querySelectorAll('relative-time').forEach(element => {
                const title = element.getAttribute('title');
                if (title && !title.includes('московскому')) {
                    const translatedTitle = translateAbsoluteTime(title);
                    if (translatedTitle !== title) {
                        element.setAttribute('title', translatedTitle);
                    }
                }

                // Обработка содержимого теневого DOM
                if (element.shadowRoot) {
                    const textNodes = [];
                    const walker = document.createTreeWalker(
                        element.shadowRoot,
                        NodeFilter.SHOW_TEXT,
                        null,
                        false
                    );

                    let node;
                    while (node = walker.nextNode()) {
                        textNodes.push(node);
                    }

                    textNodes.forEach(textNode => {
                        const translated = translateRelativeTime(textNode.textContent);
                        if (translated !== textNode.textContent) {
                            textNode.textContent = translated;
                        }
                    });
                }
            });

            // Обработка элементов time-ago
            document.querySelectorAll('time-ago').forEach(element => {
                const title = element.getAttribute('title');
                if (title && !title.includes('московскому')) {
                    const translatedTitle = translateAbsoluteTime(title);
                    if (translatedTitle !== title) {
                        element.setAttribute('title', translatedTitle);
                    }
                }
            });

            // Перевод элементов меню ActionList
            translateActionListItems();

            // Обработка текстовых элементов с улучшенной фильтрацией
            const textSelectors = ['span', 'div', 'li', 'p', 'td', 'time', 'small', 'strong'];
            textSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(element => {
                    // Пропускаем элементы, которые уже содержат relative-time или time-ago
                    if (element.querySelector('relative-time, time-ago')) {
                        return;
                    }

                    // Пропускаем элементы в markdown и код-блоках
                    if (element.closest('.blob-code') ||
                        element.closest('.blob-code-inner') ||
                        element.closest('.blob-editor-container') ||
                        element.closest('.blob-wrapper') ||
                        element.closest('.Box-body') && element.textContent.includes('{') && element.textContent.includes('}') ||
                        element.closest('.CodeMirror') ||
                        element.closest('.commit-create') ||
                        element.closest('.commit-form') ||
                        element.closest('.file') ||
                        element.closest('.file-editor') ||
                        element.closest('.highlight') ||
                        element.closest('.input-group') ||
                        element.closest('.js-blob-form') ||
                        element.closest('.js-file-editor') ||
                        element.closest('.js-file-line') ||
                        element.closest('.js-file-line-container') ||
                        element.closest('.markdown-body') ||
                        element.closest('.monaco-editor') ||
                        element.closest('.react-blob-print-hide') ||
                        element.closest('.react-code-text') ||
                        element.closest('[data-code-marker]') ||
                        element.closest('[data-qa-code-editor]') ||
                        element.closest('#new_blob') ||
                        element.closest('code') ||
                        element.closest('pre') ||
                        element.classList.contains('blob-code') ||
                        element.classList.contains('blob-code-inner') ||
                        element.classList.contains('highlight') ||
                        element.classList.contains('js-file-line') ||
                        element.classList.contains('react-code-text') ||
                        element.getAttribute('data-code-marker') ||
                        isCodeOrTechnicalElement(element)) {
                        return;
                    }

                    const originalText = element.textContent.trim();
                    if (!originalText) return;

                    const timePattern = /(ago|now|yesterday|week|month|year|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Mon|Tue|Wed|Thu|Fri|Sat|Sun)/i;
                    if (!timePattern.test(originalText)) {
                        return;
                    }

                    const translated = translateRelativeTime(originalText);
                    if (translated !== originalText && element.childNodes.length === 1) {
                        element.textContent = translated;
                    }
                });
            });

            // Специальная обработка для коротких временных выражений
            document.querySelectorAll('span, div, td, time').forEach(element => {
                const text = element.textContent.trim();
                if (text && /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$/i.test(text) &&
                    !isCodeOrTechnicalElement(element) &&
                    element.childNodes.length === 1) {
                    const translated = translateRelativeTime(text);
                    if (translated !== text) {
                        element.textContent = translated;
                    }
                }
            });

            // Перевод атрибутов
            translateTimeAttributes();
            translateOnInTitle();

        } finally {
            isTranslating = false;
        }

        fixTranslationErrors();
    }

    // Функция для безопасного запуска перевода
    function safeTranslate() {
        if (document.readyState === 'loading') {
            return;
        }

        // Запускаем с задержкой, чтобы дать странице загрузиться
        setTimeout(translateTimeElements, 500);

        // Дополнительный перевод через 2 секунды для динамического контента
        setTimeout(translateTimeElements, 1500);

        // Перевод атрибутов
        setTimeout(translateTimeAttributes, 2000);
    }

    // Наблюдатель за изменениями DOM
    const observer = new MutationObserver((mutations) => {
        let hasTimeElements = false;

        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches && (
                            node.matches('relative-time, time-ago') ||
                            node.matches('.prc-ActionList-ItemLabel-81ohH') ||
                            (node.textContent && /(ago|now|yesterday|week|month|year|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Mon|Tue|Wed|Thu|Fri|Sat|Sun)/i.test(node.textContent))
                        )) {
                            hasTimeElements = true;
                            break;
                        }
                    }
                }
            }
            if (hasTimeElements) break;
        }

        if (hasTimeElements) {
            setTimeout(translateTimeElements, 300);
        }
    });

    // Инициализация скрипта
    function init() {
        safeTranslate();

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Дополнительный наблюдатель для контейнеров контента
        const contentObserver = new MutationObserver((mutations) => {
            setTimeout(translateTimeElements, 400);
        });

        const contentContainers = [
            '#js-repo-pjax-container',
            '#repository-container-header',
            '[data-turbo-body]',
            '.js-activity-list',
            '.js-check-all-container',
            '.news',
            '.profile-timeline',
            '.user-repo-search-results'
        ];

        contentContainers.forEach(selector => {
            const container = document.querySelector(selector);
            if (container) {
                contentObserver.observe(container, {
                    childList: true,
                    subtree: true
                });
            }
        });

        // Постоянный мониторинг для предотвращения сброса перевода
        setInterval(translateTimeElements, 1500);

        // Обработка навигации SPA
        let originalPushState = history.pushState;
        history.pushState = function() {
            originalPushState.apply(this, arguments);
            setTimeout(translateTimeElements, 500);
        };

        let originalReplaceState = history.replaceState;
        history.replaceState = function() {
            originalReplaceState.apply(this, arguments);
            setTimeout(translateTimeElements, 500);
        };

        window.addEventListener('popstate', () => {
            setTimeout(translateTimeElements, 500);
        });

        // Добавляем индикатор, что скрипт работает
        console.log('⏰ GitHub Time Translation активирован');
    }

    // Запуск инициализации
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }
})();