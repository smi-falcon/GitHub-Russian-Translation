# GitHub RU — пайплайн русификации

Набор из шести Python-скриптов + userscript для Tampermonkey, которые вместе
**находят**, **переводят** и **верифицируют** перевод интерфейса GitHub.

---

## Структура репозитория

```
GitHub-Russian-Translation/
├── Userscript/
│   ├── GitHub Russian Translation.js          ← userscript (публикуется)
│   ├── GitHub Russian Translation.js.orig     ← бэкап оригинала (.gitignore)
│   └── GitHub Time Translation.js             ← чужой, не трогаем
├── scanner/                                    ← этот README и Python-скрипты
│   ├── pages.py
│   ├── auth_utils.py
│   ├── сканер_1.py
│   ├── сканер_2.py
│   ├── fix.py
│   ├── discover_pages.py
│   ├── save_auth.py
│   └── README.md
├── .gitignore
├── .gitattributes
├── License.md
└── Readme.md
```

Вспомогательные артефакты (создаются по ходу, в `.gitignore`):
`auth.json`, `inventory.json`, `verify_report.md`, `to_translate.json`,
`to_translate_bugs.json`, `discovered_pages.json`, `discovered_pages.py`,
`discovered_diff.md`, `сканер.md`.

---

## TL;DR — карта файлов

| Файл | Роль | Импортируется кем |
|---|---|---|
| `pages.py` | Единый список URL (core/settings/user/noise/…) | сканер_1, сканер_2 |
| `auth_utils.py` | Общий auth-флоу + детект «протухшей сессии» | сканер_1, сканер_2 |
| `сканер_1.py` | Обходит страницы → `inventory.json` | — |
| `сканер_2.py` | Верификация с активным userscript → отчёты + TODO | — |
| `fix.py` | Вливает переводы из `to_translate.json` в userscript | — |
| `discover_pages.py` | Находит новые URL краулером → обновляет `pages.py` | — |
| `save_auth.py` | Разовая авторизация → `auth.json` | — |
| `Userscript/GitHub Russian Translation.js` | Собственно userscript | Tampermonkey |

> **⚠️ Про `--script`:** путь считается от **текущей папки запуска**.
> - из корня репозитория: `--script "Userscript/GitHub Russian Translation.js"`
> - из `scanner/`: `--script "../Userscript/GitHub Russian Translation.js"`

---

## Первый запуск с нуля

```bash
# 1. Зависимости
pip install playwright
playwright install chromium

# 2. Один раз залогиниться → auth.json
python scanner/save_auth.py
# (либо потом: сканер_1.py --force-auth — откроет headed-браузер)

# 3. Собрать строки UI
python scanner/сканер_1.py https://github.com/OWNER/REPO --scope default

# 4. Верифицировать
python scanner/сканер_2.py https://github.com/OWNER/REPO \
    --script "Userscript/GitHub Russian Translation.js"

# 5. Посмотреть, чего не хватает
cat to_translate.json
# (отдать в ИИ или перевести руками)

# 6. Влить переводы в userscript
python scanner/fix.py --script "Userscript/GitHub Russian Translation.js" \
              --todo to_translate.json --apply --version 7.3

# 7. Пере-верифицировать
python scanner/сканер_2.py https://github.com/OWNER/REPO \
    --script "Userscript/GitHub Russian Translation.js"
```

### Полный прогон (все страницы, включая noise)

```bash
python scanner/сканер_1.py https://github.com/OWNER/REPO --scope all \
    --auth auth.json --out inventory.json --md сканер.md --delay 0.5

python scanner/сканер_2.py https://github.com/OWNER/REPO \
    --script "Userscript/GitHub Russian Translation.js" \
    --inventory inventory.json --auth auth.json --delay 3.5
```

`--scope all` = `default + noise (Explore/Trending/Marketplace/Topics) +
discovered_*`. Даёт больше страниц, но в `noise` много user-content — фильтр
`is_noise` в `сканер_2.py` может отбросить часть. Если важна скорость —
`--scope default`.

---

## Полный пайплайн (схема)

```
┌──────────────────────────────┐
│   discover_pages.py          │  (опционально, раз в N недель)
│   краулер по github.com      │
└──────────────┬───────────────┘
               │ --update-pages-py
               ▼
┌──────────────────────────────┐
│   pages.py                   │  build_pages(repo, scope)
│   единый источник URL        │
└──────────────┬───────────────┘
               │ импорт
               ▼
┌──────────────────────────────┐        ┌──────────────────┐
│   сканер_1.py                │───────▶│ inventory.json   │
│   обход URL, извлечение      │        │ (что есть на     │
│   UI-строк + is_uc           │        │  страницах,      │
└──────────────────────────────┘        │  is_uc, sources) │
               │                        └────────┬─────────┘
               │                                 │
               ▼                                 ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│   сканер_2.py                │◀───────│ Userscript/GitHub Russian    │
│   с активным userscript      │        │ Translation.js               │
│   сверяет «что переведено»   │        │ (словарь + логика)           │
└──────┬──────────┬────────────┘        └──────────────────────────────┘
       │          │                                  ▲
       ▼          ▼                                  │
┌────────────┐ ┌────────────────────┐                │
│ verify_    │ │ to_translate.json  │                │
│ report.md  │ │ to_translate_bugs  │                │
└────────────┘ └─────────┬──────────┘                │
                         │                           │
                         ▼  (ИИ / руками)            │
                   ┌─────────────┐                   │
                   │  fix.py     │───────────────────┘
                   │  --apply    │  вставляет блок в
                   └─────────────┘  exactTranslations
```

---

## Кто что делает — подробно

### 1. `pages.py` — источник URL

Единственное место, где перечислены страницы для обхода. Меняешь **только здесь** —
сканеры импортируют.

```python
from pages import build_pages
pages = build_pages("https://github.com/owner/repo", scope="default")
# → [('Главная', 'https://github.com/owner/repo'), ('Issues (открытые)', ...), ...]
```

Доступные `scope`:

| scope | Что внутри |
|---|---|
| `core` | страницы репозитория (Code, Issues, PR, Actions, …) |
| `settings` | настройки репозитория |
| `user` | общепользовательские настройки |
| `noise` | Explore/Trending/Marketplace/Topics |
| `default` | `core + settings + user` ← **по умолчанию** |
| `all` | `default + noise + discovered_*` |
| `issues`, `pulls`, `codespaces`, `discussions`, `dashboard`, `planning`, `errors` | алиасы для узких прогонов |
| `discovered` | только то, что нашёл краулер |

**Блок AUTO-DISCOVERED BEGIN/END** внутри файла — не трогать руками,
его перегенерирует `discover_pages.py --update-pages-py`.

---

### 2. `auth_utils.py` — вход

```python
from auth_utils import ensure_auth, _is_login_page
```

- `ensure_auth(..., force=False)` — проверяет `auth.json`. Если сессия протухла
  или `force=True` → открывает **headed**-браузер, ждёт логин, сохраняет `auth.json`.
- `_is_login_page(page, url)` — возвращает причину («redirect → /login» или
  «login form») либо `None`. Сканеры используют, чтобы поставить `auth_required`
  вместо падения.

`save_auth.py` — однократный скрипт ровно с той же задачей. Оставь, если
лень запускать полный сканер ради пересоздания `auth.json`.

---

### 3. `сканер_1.py` — сбор строк

```bash
python scanner/сканер_1.py https://github.com/owner/repo --scope default --hover
```

Что делает:
1. Берёт список URL из `build_pages(repo, scope)`.
2. Обходит их в Playwright (headless).
3. С `EXTRACT_JS` вытаскивает **все тексты** + атрибуты с категориями
   (`button`, `link`, `heading`, `placeholder`, …).
4. Классифицирует каждый элемент как **UC** (user content: README, коммиты,
   имена пользователей, задачи) или **UI** (то, что мы переводим).
5. Для `/settings/*` — **автодискавер** подстраниц (кликабельные ссылки в
   боковом меню настроек) → добавляет их в очередь.
6. Пишет `inventory.json`:

```json
{
  "scope": "default",
  "entries": {
    "Open issues": {
      "categories": ["link", "button"],
      "has_tooltip": true,
      "tooltip": "Show open issues",
      "translation": "",
      "sources": ["https://github.com/o/r/issues"],
      "is_uc": false
    },
    "fix: something": { "is_uc": true, "...": "..." }
  }
}
```

Полезные флаги: `--auth`, `--force-auth`, `--max-pages`, `--no-discover`,
`--delay`, `--hover`.

---

### 4. `сканер_2.py` — верификация

```bash
python scanner/сканер_2.py https://github.com/owner/repo \
    --script "Userscript/GitHub Russian Translation.js" \
    --inventory inventory.json
```

Что делает:
1. Читает `inventory.json` (строки, `is_uc`, `sources`).
2. Парсит словарь из userscript (`exactTranslations` и `translateNumberedExtended`)
   и **вставляет userscript** в контекст.
3. Проходит те же URL, собирает **видимые** тексты.
4. Сверяет:

| Ситуация | Куда попадает |
|---|---|
| было в inventory, на странице **нет** | ✅ translated (UI / UC отдельно) |
| было в inventory, на странице **есть**, `__ghRuTranslate` умеет | 🐞 `to_translate_bugs.json` — баг селектора/тайминга |
| было в inventory, на странице **есть**, userscript не умеет | ❌ `real_gaps` → в `to_translate.json` |
| нет в inventory, но есть на странице | ➕ `unknown_clean` → тоже в `to_translate.json` |

5. Пишет:
   - `verify_report.md` — сводка + разбивка;
   - `to_translate.json` — плоский словарь `{ "English": "" }` для перевода;
   - `to_translate_bugs.json` — что userscript **должен** переводить, но не переводит (для отладки userscript, не для перевода).

**`to_translate.json` — готовый вход для ИИ.**

---

### 5. `to_translate.json` → ИИ → переводы

**Шаг 1.** Открываешь `to_translate.json` — плоский словарь без переводов:

```json
{
  "Open in new tab": "",
  "Add file": "",
  "Compare & pull request": "",
  "_possibly_filtered_latin": ["..."],
  "_possibly_filtered_cyrillic_count": 0
}
```

**Шаг 2.** Копируешь в ChatGPT/Claude с промптом:

> Переведи значения ключей на русский. Сохрани ключи без изменений.
> Верни **только валидный JSON** того же формата.
> Термины Git: pull request → «запрос на слияние», issue → «задача»,
> commit → «коммит», fork → «форк». Бренды (GitHub, Copilot, Codespaces,
> Actions, Pages) не переводить. Тексты со `_possibly_filtered_*` — служебные,
> их пропусти.

**Шаг 3.** Получил JSON с заполненными значениями → сохранил как
`to_translate.json` (или `to_translate_filled.json`).

**Шаг 4.** Влил в userscript:

```bash
python scanner/fix.py --script "Userscript/GitHub Russian Translation.js" \
              --todo to_translate.json \
              --apply --version 7.3
```

`fix.py`:
- находит блок `exactTranslations = { ... }`,
- парсит существующие ключи (чтобы **не перезаписывать** имеющиеся),
- вставляет в конец блока:

```js
// === fix.py applied 7.3 ===
"Open in new tab": "Открыть в новой вкладке",
"Add file": "Добавить файл",
```

- обновляет `@version` в шапке userscript (если `--version` передан).

Флаг `--dry-run` — показывает, что будет вставлено, без записи файла.

---

### 6. `+1 значение` — перевести одно слово

Сценарий: увидел на странице непереведённую строку `Compare & pull request`,
хочешь добавить только её.

**Вариант A — вручную (быстро).**

Открыть `Userscript/GitHub Russian Translation.js`, найти
`exactTranslations = {` и вставить строку в **любое** место словаря (но лучше —
в тематический раздел, чтобы не конфликтовало с `fix.py`):

```js
"Compare & pull request": "Сравнить и создать запрос на слияние",
```

Обновить `@version`, сохранить, в Tampermonkey — «Обновить». Всё.

**Вариант B — через `fix.py`.**

1. Убедиться, что в `to_translate.json` есть ключ с непустым значением:

```json
{
  "Compare & pull request": "Сравнить и создать запрос на слияние"
}
```

2. Прогнать:

```bash
python scanner/fix.py --script "Userscript/GitHub Russian Translation.js" \
              --todo to_translate.json \
              --apply --version 7.3
```

`fix.py` **сам** проверит, нет ли этого ключа уже в словаре (не перезапишет).

**Вариант C — только поправить существующий перевод.**

`fix.py` **не перезаписывает** уже существующие ключи. Если нужно поменять
значение у существующего ключа — править userscript руками (или временно
удалить ключ + прогнать `fix.py`).

---

## Типовые сценарии

### «Хочу новые страницы»

Раз в N недель прогонять:

```bash
# сначала посмотреть, что найдётся — без записи
python scanner/discover_pages.py --dry-run

# если ок — обновить блок AUTO-DISCOVERED в pages.py
python scanner/discover_pages.py --update-pages-py
```

`discover_pages.py` **не трогает** остальной `pages.py` — только блок между
маркерами `# === AUTO-DISCOVERED BEGIN ===` и `# === AUTO-DISCOVERED END ===`.
Бэкап `pages.py.bak` создаётся автоматически.

### «Хочу добавить один неинвентаризованный URL»

Ручками в `scanner/pages.py`:

- если это `core`/`settings` — добавить в `core`/`settings` списки;
- если специфичная — создать новый список и добавить в `scopes` в `build_pages`.

### «Не хочу шум (Explore/Trending)»

```bash
python scanner/сканер_1.py ... --scope core
```

или в `pages.py` — убери `noise` из `default` при желании.

### «Хочу проверить только settings»

```bash
python scanner/сканер_1.py ... --scope settings
python scanner/сканер_2.py ... --scope settings
```

`сканер_2.py` возьмёт `scope` из `inventory.json`, если `--scope` не задан.
Если задан и не совпадает — предупредит.

### «Юзерконтент попал в отчёт»

Не баг. `сканер_2.py` разделяет `real_gaps` (UI) и `gaps_uc` (user content).
UC не идёт в `to_translate.json` — только в `verify_report.md` в секцию
«🗂 User content» для справки.

Если что-то действительно является UI, но помечено `is_uc` — значит, в
`сканер_1.py` → `EXTRACT_JS` → `isUserContent` сработал `true`. Правится
селектор там (добавить/убрать в `RESERVED_PATHS` или в условиях).

### «userscript не переводит, хотя фраза в словаре»

Это баг, не пробел. Ищи `to_translate_bugs.json`:

- тайминг — React гидратирует позже, чем проходит `MutationObserver`;
- `shouldIgnoreElement` отсекает по `aria-busy` (в v7.2 кнопки/ссылки/текст
  уже не отсекаются — если всё равно баг, смотри тег);
- `PROTECTED_SELECTORS` — это контент, который мы сознательно не переводим;
  если строка внутри `.markdown-body`, а `markdownTranslationEnabled = false` —
  ожидаемо;
- для `.blob-code` — **не баг**, это код.

---

## Как отлаживать

**Проверить, что userscript загружен:**

В консоли на github.com:

```js
typeof window.__ghRuTranslate   // должно быть "function" (если экспортирован)
```

> ⚠️ **Важно:** в текущей версии userscript `window.__ghRuTranslate` **не
> экспортируется** — `сканер_2.py` падает на fallback (парсит `exactTranslations`
> из текста файла). Если хочешь, чтобы `_can_translate` работал точно,
> добавь в конец IIFE:

```js
window.__ghRuTranslate = translateText;
```

**Проверить, что сканер видит страницу:**

```bash
python scanner/сканер_1.py ... --scope default --max-pages 3
```

Смотрит на `[OK] / [SKIP]` по каждой странице.

**Протух `auth.json`:**

```bash
python scanner/save_auth.py
# или
python scanner/сканер_1.py ... --force-auth
```

---

## Зависимости

```
python >= 3.10     # из-за `str | None` в сигнатурах
playwright
```

```bash
pip install playwright
playwright install chromium
```

---

## Git и `.gitignore`

В репозитории **не должно** лежать:

- `auth.json` — cookies сессии (приватно);
- `inventory.json`, `verify_report.md`, `to_translate*.json`,
  `discovered_pages.json`, `discovered_pages.py`, `discovered_diff.md`,
  `сканер.md` — рабочие артефакты, могут содержать приватные строки;
- `*.bak`, `*.orig`, `__pycache__/`, `*.pyc`.

Всё это покрыто `.gitignore` в корне. Проверить:

```bash
git check-ignore -v "auth.json"       # должен вернуть строку
git check-ignore -v "Userscript/GitHub Russian Translation.js.orig"
```

`.gitattributes` фиксирует EOL = LF для всех текстовых файлов, чтобы не было
`warning: LF will be replaced by CRLF` и phantom-diff'а.

---

## Лицензия / неофициальность

Неофициальный проект. GitHub Inc. не имеет к нему отношения. Все названия
продуктов и брендов принадлежат их владельцам.