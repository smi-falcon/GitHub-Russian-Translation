// ==UserScript==
// @name         GitHub Time Translation
// @namespace    http://tampermonkey.net/
// @version      1.1
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
        if (isTranslating) return;
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

            // Обработка текстовых элементов
            const textSelectors = ['span', 'div', 'li', 'p', 'td', 'time'];
            textSelectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(element => {
                    // Пропускаем элементы в markdown и код-блоках
                    if (element.closest('.markdown-body') ||
                        element.closest('pre') ||
                        element.closest('code') ||
                        element.querySelector('relative-time') ||
                        element.textContent.length > 100) {
                        return;
                    }

                    const originalText = element.textContent.trim();
                    if (!originalText) return;

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
            subtree: false
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

        console.log('⏰ GitHub Time Translation активирован');
    }

    // Запуск инициализации
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }
})();
