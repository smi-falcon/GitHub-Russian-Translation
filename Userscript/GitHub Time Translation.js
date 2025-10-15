// ==UserScript==
// @name         GitHub Time Translation
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Перевод времени сайта GitHub на русский язык.
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
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @icon64       https://github.githubassets.com/favicons/favicon.png
// @license      MIT
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Флаг отслеживания состояния перевода
    let isTranslating = false;

    // Функция для проверки режима редактирования
    function isInEditMode() {
        return document.querySelector('.blob-editor-container') ||
               document.querySelector('.CodeMirror') ||
               document.querySelector('.commit-create') ||
               document.querySelector('.file-editor') ||
               document.querySelector('.js-blob-form') ||
               document.querySelector('.monaco-editor') ||
               document.querySelector('[data-qa-code-editor]') ||
               window.location.href.includes('/edit/') ||
               window.location.href.includes('/new/');
    }

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
        'yesterday': 'вчера',
        'last week': 'на прошлой неделе',
        'last month': 'в прошлом месяце',
        'last year': 'в прошлом году',
        'this month': 'в этом месяце',
        'this week': 'на этой неделе',
        'this year': 'в этом году',
        'Joined last month': 'Присоединился в прошлом месяце',
        'Joined last week': 'Присоединился на прошлой неделе',
        'Joined last year': 'Присоединился в прошлом году',

        // Абсолютное время
        'Jan': 'янв', 'Feb': 'фев', 'Mar': 'мар', 'Apr': 'апр',
        'May': 'мая', 'Jun': 'июн', 'Jul': 'июл', 'Aug': 'авг',
        'Sep': 'сен', 'Oct': 'окт', 'Nov': 'ноя', 'Dec': 'дек',
        'January': 'января', 'February': 'февраля', 'March': 'марта', 'April': 'апреля',
        'May': 'мая', 'June': 'июня', 'July': 'июля', 'August': 'августа',
        'September': 'сентября', 'October': 'октября', 'November': 'ноября', 'December': 'декабря'
    };

    // Функция для проверки, является ли элемент частью кода или техническим контентом
    function isCodeOrTechnicalElement(element) {
        // Для элементов relative-time всегда разрешаем перевод
        if (element.matches && element.matches('relative-time')) {
            return false;
        }

        // Проверка элементов, содержащих код или технические названия
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
            element.getAttribute('data-code-marker')) {
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
        }

        return false;
    }

    // Функция для перевода относительного времени
    function translateRelativeTime(text) {
        // Пропускаем уже переведенный текст
        if (text.includes('назад') || text.includes('только что') || text.includes('вчера') ||
            text.includes('прошлом') || text.includes('этом')) {
            return text;
        }

        let translated = text;

        // Паттерны для числовых временных выражений
        const timePatterns = [
            { regex: /(\d+)\s+seconds?\s+ago/, unit: 'секунд' },
            { regex: /(\d+)\s+minutes?\s+ago/, unit: 'минут' },
            { regex: /(\d+)\s+hours?\s+ago/, unit: 'часов' },
            { regex: /(\d+)\s+days?\s+ago/, unit: 'дней' },
            { regex: /(\d+)\s+weeks?\s+ago/, unit: 'недель' },
            { regex: /(\d+)\s+months?\s+ago/, unit: 'месяцев' },
            { regex: /(\d+)\s+years?\s+ago/, unit: 'лет' }
        ];

        for (const pattern of timePatterns) {
            const match = translated.match(pattern.regex);
            if (match) {
                const number = match[1];
                translated = `${number} ${pattern.unit} назад`;
                break;
            }
        }

        // Перевод стандартных выражений
        for (const [en, ru] of Object.entries(timeTranslations)) {
            if (translated.includes(en)) {
                translated = translated.replace(en, ru);
            }
        }

        return translated;
    }

    // Функция для перевода абсолютного времени
    function translateAbsoluteTime(text) {
        let translated = text;

        // Замена наименований месяцев
        for (const [en, ru] of Object.entries(timeTranslations)) {
            if (en.length > 2) {
                const regex = new RegExp(en, 'g');
                translated = translated.replace(regex, ru);
            }
        }

        // Добавление указания временной зоны
        if (translated !== text && translated.includes('GMT')) {
            translated = translated.replace('GMT', 'по московскому времени');
        }

        return translated;
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

            // Обработка текстовых элементов с улучшенной фильтрацией
            const textSelectors = ['span', 'div', 'li', 'p', 'td', 'time'];
            textSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(element => {
                    // Пропускаем элементы, которые уже содержат relative-time
                    if (element.querySelector('relative-time')) {
                        return;
                    }

                    // Пропускаем элементы в markdown и код-блоках
                    if (element.closest('.blob-code') ||
                        element.closest('.blob-code-inner') ||
                        element.closest('.blob-editor-container') ||
                        element.closest('.blob-wrapper') ||
                        element.closest('.Box-body') ||
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
                        element.textContent.length > 100 ||
                        isCodeOrTechnicalElement(element)) {
                        return;
                    }

                    const originalText = element.textContent.trim();
                    if (!originalText) return;

                    const timePattern = /(ago|now|yesterday|week|month|year|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i;
                    if (!timePattern.test(originalText)) {
                        return;
                    }

                    const translated = translateRelativeTime(originalText);
                    if (translated !== originalText && element.childNodes.length === 1) {
                        element.textContent = translated;
                    }
                });
            });

        } catch (error) {
            console.log('Ошибка при переводе времени:', error);
        } finally {
            isTranslating = false;
        }
    }

    // Функция для безопасного запуска перевода
    function safeTranslate() {
        if (document.readyState === 'loading') {
            return;
        }

        // Запускаем с задержкой, чтобы дать странице загрузиться
        setTimeout(translateTimeElements, 500);

        // Дополнительный перевод через 2 секунды для динамического контента
        setTimeout(translateTimeElements, 2000);
    }

    // Наблюдатель за изменениями DOM
    const observer = new MutationObserver((mutations) => {
        let hasTimeElements = false;

        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches && (
                            node.matches('relative-time') ||
                            (node.textContent && /(ago|now|yesterday|week|month|year)/i.test(node.textContent))
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
            '.js-check-all-container',
            '.news',
            '.js-activity-list'
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
