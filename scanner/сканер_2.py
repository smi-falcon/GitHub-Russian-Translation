#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
сканер_2.py v5 — верификация перевода (с userscript).

Заходит на те же страницы, что и сканер_1, но с активным userscript.
Собирает все видимые тексты. Сравнивает с inventory.json:
  - текст из inventory пропал        → переведён
  - текст из inventory ещё на экране → НЕ переведён
  - userscript умеет перевести (window.__ghRuTranslate) → БАГ (тайминг/селектор)
  - userscript не умеет (нет ключа) → реальный пробел

Изменения v5 vs v4:
  * inventory["entries"][t]["is_uc"] — разделяет UI и user-content.
    real_gaps → gaps_ui (в to_translate) + gaps_uc (только в отчёт).
    real_bugs → фильтруется по is_uc (user-content не считаем багом).
    translated разделён на UI / UC.
  * is_noise(text, repo) — фильтр owner/repo/master/main/develop/dev.
  * _NOISE_RX расширен: SVG Highcharts, ". More information available below.",
    "Merge pull request #N", "from user/repo", "Star X", "Watch X",
    "Test/Probe/UAT/Smoke", "Codespace <name>", "Hello-World Tags/Release Notes",
    "Ahead and behind counts", "Package:", "Repositories that depend on".
  * _possibly_filtered → _possibly_filtered_latin (массив) +
    _possibly_filtered_cyrillic_count (число). Кириллица = уже переведено.
  * Отчёт: сводка "Из inventory / UI / UC", новая секция "🗂 User content".

Изменения v4 vs v3:
  * --scope (из inventory если не задан).
  * _is_login_page из auth_utils: детект протухшей сессии; 3 страницы — стоп.
  * Дедуп URL через url_key.
  * is_noise: убран слишком широкий ^[a-z][a-z0-9-]{0,38}$.
  * USERNAME_LIKE удалён.
  * translated постранично через sources + fallback.
  * "⏭ Не проверено".
  * _possibly_filtered в to_translate.json.
  * EXTRACT_ALL_TEXT_JS: +alert/status/aria-live, caption, figcaption.

Использование:
    python сканер_2.py https://github.com/owner/repo \
        --script "GitHub Russian Translation.js" \
        --inventory inventory.json \
        --auth auth.json \
        --scope default \
        --delay 3.5
"""
import argparse
import json
import re
import time
from pathlib import Path

from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

from pages import build_pages, is_identifier, url_key
from auth_utils import _is_login_page


# ============================================================
# EXTRACT
# ============================================================

EXTRACT_ALL_TEXT_JS = r"""
() => {
    const texts = new Set();
    const push = (s) => {
        if (!s) return;
        const t = String(s).replace(/\s+/g, ' ').trim();
        if (t && t.length < 500) texts.add(t);
    };

    // 1. текстовые узлы
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
        const p = n.parentElement;
        if (!p) continue;
        const tag = p.tagName.toLowerCase();
        if (['script','style','noscript','code','pre','textarea','svg','path'].includes(tag)) continue;
        if (p.closest('[translate="no"]')) continue;
        push(n.textContent);
    }

    // 2. атрибуты — alt вынесен отдельно (см. ниже)
    const ATTRS = ['placeholder', 'aria-label', 'title',
                   'data-tooltip-content', 'data-content', 'data-message',
                   'data-hovercard-text'];
    document.querySelectorAll(ATTRS.map(a => `[${a}]`).join(',')).forEach(el => {
        if (el.closest('[aria-label*="Directory"], [aria-label*="File"]')) return;
        if (el.closest('[role="tree"]')) return;
        for (const attr of ATTRS) {
            const v = el.getAttribute(attr);
            if (v) push(v);
        }
    });

    // 2b. alt — только для видимых IMG с осмысленным содержимым (≥ 4 симв.)
    document.querySelectorAll('img[alt]').forEach(el => {
        if (!el.offsetWidth && !el.offsetHeight) return;
        const v = el.getAttribute('alt');
        if (v && v.length >= 4 && !/^[a-z_]+$/i.test(v)) push(v);
    });

    // 3. <input type=submit|button|reset value="...">
    document.querySelectorAll('input[type="submit"], input[type="button"], input[type="reset"]')
        .forEach(el => {
            const v = el.getAttribute('value');
            if (v) push(v);
        });

    // 4. <optgroup label>
    document.querySelectorAll('optgroup[label]').forEach(el => {
        push(el.getAttribute('label'));
    });

    // 5. options / menus / tabs
    document.querySelectorAll('option, [role="option"], [role="menuitem"], [role="tab"], summary, label, legend')
        .forEach(el => push(el.textContent));

    // 6. SVG (графики Pulse/Commits/Insights)
    document.querySelectorAll('svg text, svg title').forEach(el => {
        push(el.textContent);
    });

    // 7. v4: alert / status / aria-live
    document.querySelectorAll('[role="alert"], [role="status"], [aria-live]')
        .forEach(el => push(el.innerText));

    // 8. v4: caption / figcaption
    document.querySelectorAll('caption, figcaption').forEach(el => {
        push(el.textContent);
    });

    return Array.from(texts);
}
"""


# ============================================================
# СЛОВАРЬ userscript
# ============================================================

def _extract_dict_keys(src: str, name: str) -> set[str]:
    """Извлечь строковые ключи верхнего уровня из `name = { ... }`.

    Корректно пропускает //-комментарии, /* */ и содержимое строк,
    поддерживает escape-последовательности внутри строк.
    """
    m = re.search(rf'{re.escape(name)}\s*=\s*\{{', src)
    if not m:
        return set()
    start = m.end()
    depth = 1
    i = start
    in_str = False
    q = ""
    n = len(src)
    while i < n:
        if not in_str:
            if src.startswith('//', i):
                nl = src.find('\n', i)
                if nl < 0:
                    break
                i = nl + 1
                continue
            if src.startswith('/*', i):
                end = src.find('*/', i + 2)
                if end < 0:
                    break
                i = end + 2
                continue
            ch = src[i]
            if ch in ('"', "'", '`'):
                in_str = True
                q = ch
            elif ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    break
            i += 1
            continue
        ch = src[i]
        if ch == '\\':
            i += 2
            continue
        if ch == q:
            in_str = False
        i += 1
    body = src[start:i]
    return {mm.group(1) for mm in re.finditer(r'["\']([^"\']+)["\']\s*:', body)}


def load_script_dictionary(script_path: str) -> set[str]:
    """Ключи из exactTranslations + translateNumberedExtended (если он словарь)."""
    src = Path(script_path).read_text(encoding="utf-8")
    keys = _extract_dict_keys(src, 'exactTranslations')
    keys |= _extract_dict_keys(src, 'translateNumberedExtended')
    return keys


# ============================================================
# ФИЛЬТРЫ ШУМА
# ============================================================

BRANDS = {
    "GitHub","GitHub Actions","GitHub Pages","GitHub Enterprise","GitHub API",
    "GitHub Apps","GitHub Mobile","GitHub Free","GitHub Copilot",
    "GitHub Universe 2026","GitHub Status","GitHub-Russian-Translation",
    "Codespaces","Dependabot","Copilot","OIDC","MCP","SSH","SSL","OAuth",
    "Npm","Python","TypeScript","JavaScript","JavaScript / TypeScript",
    "HTML","CSS","Shell","PowerShell","Bash","PLpgSQL","Go","Rust","Ruby",
    "Java","PHP","Swift","Kotlin","React","Vue","Svelte","Solidity",".NET",
    "Jupyter Notebook","Visual Studio Code","Playwright","Spark",
    "Netlify","Vercel","MIT License","GNU Affero General Public License v3.0",
    "LinkedIn","Bluesky","Facebook","Instagram","Reddit","Threads","Twitch",
    "Mastodon","YouTube","Telegram","X","Apple","Google",
}
BRANDS |= {
    "Android", "iOS", "MacOS", "Windows", "Linux", "Chrome", "Firefox", "Safari",
    "ORCID", "ORCID iD", "ORCID.org", "ATOM", "VSCode", "VS Code",
    "XartIA", "XartIA 4.2",
}

SHORT_SINGLE_LETTER = re.compile(r'^[A-Z]$')

_NOISE_RX = [
    # часовые пояса
    re.compile(r'^\(GMT[+-]\d{2}:\d{2}\)'),
    # графики: "10/15, 0. Total.", "10/24, 302. Total."
    re.compile(r'^\d{1,2}/\d{1,2},\s*-?\d+\.\s*(Total|Unique)\.$'),
    # дни недели с датой
    re.compile(r'^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\w*,?\s+\w+\s+\d{1,2},\s+\d{4}'),
    # "Oct 29, 2026, 8:45 AM GMT+3"
    re.compile(r'^\w{3}\s+\d{1,2},\s+\d{4}(,?\s+\d{1,2}:\d{2}\s*(AM|PM)?)?(\s+GMT[+-]\d+)?$'),
    # "October 28, 2026 20:35"
    re.compile(r'^\w+\s+\d{1,2},\s+\d{4}\s+\d{1,2}:\d{2}$'),
    # "October 22, 2026 – October 29, 2026"
    re.compile(r'^\w+\s+\d{1,2},\s+\d{4}\s+[–-]\s+\w+\s+\d{1,2},\s+\d{4}$'),
    # "Oct 2026" / "Aug 2026\u200bOct 2026"
    re.compile(r'^\w{3}\s+\d{4}(\u200b\w{3}\s+\d{4})?$'),
    # одиночные месяцы и дни недели
    re.compile(r'^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$'),
    re.compile(r'^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$'),
    re.compile(r'^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$'),
    re.compile(r'^(January|February|March|April|May|June|July|August|September|October|November|December)$'),
    # "10/15", "Oct 24"
    re.compile(r'^\d{1,2}/\d{1,2}$'),
    re.compile(r'^\w{3}\s+\d{1,2}$'),
    # размеры и длительности
    re.compile(r'^\d+\.\d+\s*(B|KB|MB|GB|TB)$'),
    re.compile(r'^\d+\s*(B|KB|MB|GB|TB)\s+cached$'),
    re.compile(r'^\d+m\s*\d+s$'),
    re.compile(r'^\d+s$'),
    re.compile(r'^-?\d+(\.\d+)?k$'),
    # активность — с опциональным порядковым суффиксом
    re.compile(r'^No contributions on \w+ \d+(?:st|nd|rd|th)?\.$'),
    re.compile(r'^\d+\s+contributions? on \w+ \d+(?:st|nd|rd|th)?\.$'),
    re.compile(r'^\d+\s+contributions? in the last year$'),
    # счётчики репозитория и графиков
    re.compile(r'^\d+\s+(commits?|views?|clones?|unique cloners?|comments?|cache|items?|branches?|tags?|selected)$', re.I),
    re.compile(r'^\d+\s+(open\s+issues?|open\s+pull\s+requests?|stars?|watchers?|forks?|collaborators?|packages?)$', re.I),
    re.compile(r'^\d+\s+(available\s+runners?|branch\s+protection\s+rules?|tasks?)$', re.I),
    re.compile(r'^\d+\s+issues?\s+(of\s+\d+\s+selected|need\s+help)$'),
    re.compile(r'^\d+\s+of\s+\d+\s+selected$'),
    re.compile(r'^\d+\s+selected$'),
    re.compile(r'^\d+\s+(Commits?|Stars?|Forks?|Watchers?|Releases?|Issues?|Pull requests?|Branches?|Tags?|Contributors?|Packages?|Projects?|Environments?|Views?|Clones?|Unique cloners?)$'),
    re.compile(r'^\d+%\s+of\s+commits\s+in\s+\w+\s+were\s+made\s+to'),
    # "owner/repo 7 open 1 closed"
    re.compile(r'^[\w./-]+\s+\d+\s+open\s+\d+\s+closed$'),
    # "user, 84. Commits." / "user, 2. Navigator 3."
    re.compile(r'^[\w-]+,\s*\d+\.\s+(Commits?|Navigator \d+)\.$'),
    # "user:docs/troubleshooting"
    re.compile(r'^[\w-]+:\S+$'),
    # "24 hours ago", "1 week"
    re.compile(r'^\d+\s+(minutes?|hours?|days?|weeks?|months?|years?)\s+ago$'),
    # Actions
    re.compile(r'^Copy full SHA for [a-f0-9]{7,40}$'),
    re.compile(r'^Show description for [a-f0-9]{7,40}$'),
    re.compile(r'^More actions for workflow run \d+$'),
    re.compile(r'^(completed successfully|cancelled|requires action with the application):\s+Run \d+'),
    # OAuth scopes / keyboard / query syntax
    re.compile(r'^(admin|repo|write|read|delete|user|gist|notifications|workflow|packages):\w+$'),
    re.compile(r'^(control|alt|shift|ctrl)\s+\w+', re.I),
    re.compile(r'^is:(issue|pr)\s+'),
    # node-cache / артефакты
    re.compile(r'^node-cache-'),
    # "@username"
    re.compile(r'^@[\w.-]+$'),
    # UI
    re.compile(r'^Upvote: \(\d+\):'),
    re.compile(r'^Select:\s+'),
    re.compile(r'^Permalink:\s+'),
    re.compile(r'^\d+\s+linked\s+(issue|pull\s+request)', re.I),
    re.compile(r'^\d+\s+accounts?\s+connected$'),
    re.compile(r'^\d+\s+verified\s+email'),
    re.compile(r'^\d+\s*/\s*\d+$'),
    re.compile(r'^\d+/\d+ checks passing$'),
    # номера, пути, файлы
    re.compile(r'^#\d+$'), re.compile(r'^#$'),
    re.compile(r'^\($'), re.compile(r'^\)$'),
    re.compile(r'^[\w.-]+/[\w.-]+#\d+'),
    re.compile(r'^[a-z0-9_.-]+/[a-z0-9_./-]+$', re.I),
    re.compile(r'^[\w.-]+\.(md|json|yaml|yml|py|ts|tsx|js|jsx|mjs|txt|sh|toml|ini|lock)$', re.I),
    re.compile(r'^[\w.-]+,\s*\((File|Directory)\)$'),
    # URL / email / IP
    re.compile(r'^https?://'),
    re.compile(r'^[\w.+-]+@[\w.-]+\.[a-z]{2,}$'),
    re.compile(r'^\d+\.\d+\.\d+\.\d+$'),
    # placeholder-скелетоны
    re.compile(r'^[Xx]{4,}$'), re.compile(r'^[X]+$'),
    # версии / числа
    re.compile(r'^v?\d+(\.\d+)+$'),
    re.compile(r'^\d+$'),
    # коммит-сообщения (git commit)
    re.compile(r'^(feat|fix|docs|chore|test|refactor|style|perf|build|ci|revert)(\([^)]+\))?:', re.I),

    # --- v4: имена владельцев/репозиториев только с цифрой или [-_] ---
    re.compile(r'^[a-z][a-z0-9]*[-_][a-z0-9-]+$'),    # vamhana-2, xartia_4
    re.compile(r'^[a-z][a-z0-9-]*\d[a-z0-9-]*$'),     # canakyuz1

    # --- общие «служебные» папки ---
    re.compile(r'^(docs|src|tests|scripts|infra|k8s|helm|docker|terraform|mobile|monitoring|db|db/migrations|bin|lib|dist|build|public|config|assets|static|templates|vendor|node_modules)$'),

    # --- aria-label-односложные (иконки/счётчики) ---
    re.compile(r'^(items?|results?|fork|read|write|admin|repo|collaborators?|eligible|feedback|changelog|avatar|user avatar)$', re.I),

    # --- цена / эмодзи / многоточие ---
    re.compile(r'^\$\d+(\.\d+)?$'),
    re.compile(r'^[✅❌⚠️🔥⭐✔✖]+$'),
    re.compile(r'^\.{2,}$'),
    re.compile(r'^[\u200b\u200c\u200d]+$'),

    # --- v5 (патч 4): SVG-подписи Highcharts ---
    re.compile(r'^\w+\s+\d{4},\s*-?\d+\.\s*(Additions|Deletions)\.$'),      # April 2011, 0. Additions.
    re.compile(r'^(Additions|Deletions), bar series \d+ of \d+'),           # Additions, bar series 1 of 2 with 64 bars.
    re.compile(r'^Navigator \d+, series \d+ of \d+'),
    re.compile(r'^The chart has \d+ [XY] axis'),
    re.compile(r'^Created with Highcharts'),

    # --- v5 (патч 4): aria-label заголовков issue/PR ---
    # "Test. More information available below."
    re.compile(r'^.+\.\s+More information available below\.$'),

    # --- v5 (патч 4): имена репо-объектов, PR/commit ---
    re.compile(r'^[\w\-./]+\s+(Tags|Release Notes)$'),                     # Hello-World Tags
    re.compile(r'^Ahead and behind counts:'),
    re.compile(r'^(Star|Watch|Fork|Unstar|Unwatch|Unfork)\s+[\w\-./]+'),
    re.compile(r'^Merge pull request #\d+'),
    re.compile(r'^from [\w\-]+/[\w\-]+'),                                   # from Spaceghost/patch-1
    re.compile(r'^This reverts commit https?://'),
    re.compile(r'^master@\{[\w]+\}\.\.\.master'),                           # master@{1day}...master

    # --- v5 (патч 4): тестовые/технические имена ---
    re.compile(r'^(Test|Probe|Smoke|UAT|probe|test|uat)[\s\-_].*', re.I),
    re.compile(r'^Codespace [\w\- ]+$'),
    re.compile(r'^Package:'),
    re.compile(r'^Repositories that depend on'),
    re.compile(r'^[\w\-./]+#\d+\s+·\s+Opened by'),                        # owner/repo#N · Opened by …
    # --- v6: тестовые/placeholder имена (Hello-World, тестовые репо) ---
    re.compile(r'^(test|testing|t|x|xx|xxx|probe|tmp|temp|foo|bar|baz|asdf|qwerty)$', re.I),
    re.compile(r'^test\d*$', re.I),
    # "1 label", "1 revision" — счётчики с одиночным числом
    re.compile(r'^\d+\s+(label|revision|comment|comments|label|labels|revision|revisions)$', re.I),
    # "Watch: Participating in <repo>…"
    re.compile(r'^Watch:\s+Participating\s+in\s+'),
    # "@/tmp/…" — внутренние пути
    re.compile(r'^@/'),
    # "[AI Test] …", "[ws-test] …", "[checkout-api] …" — тестовые маркеры
    re.compile(r'^\[[A-Za-z\- ]+\]\s+'),
    # "See your forks of this repository" — единичные UI-строки, не нужен перевод
    re.compile(r'^See your forks of this repository$'),
    # --- v10: счётчики-одиночки ---
    re.compile(r'^\d+\s+(stargazers?|forks?|watchers?|stars?|issues?|pulls?)$', re.I),
    re.compile(r'^\d+%$'),
    re.compile(r'^#\d+\s+(opened|closed|merged)$', re.I),
    re.compile(r'^\([\w.-]+\)$'),                                   # (vamhana)
    re.compile(r'^[\w-]+/([\w.-]+)$'),                              # github.com, habr.com
    re.compile(r'^\w+:\s*\d+[.,]\d+%$'),                            # PLpgSQL: 3,9%
    re.compile(r'^API\s+:?\d+'),                                    # API :3000 + WebSocket :3001
    re.compile(r'^Repository body \d+(-\d+)?$'),
    re.compile(r'^Repo Details \d+(-\d+)?$'),
    re.compile(r'^Control \+ Shift \+ [\w]$'),

    # --- v10: UC-фиды, от которых не избавиться ---
    re.compile(r"^I'm not interested in"),                          # I'm not interested in canakyuz/xartia
    re.compile(r"^Dismissed a (recommendation|repository) from"),

    # --- v10: обрывки/предлоги/служебные ---
    re.compile(r'^(and|or|for|with|have|that|then|can|use|type|per|'
               r'person|project|policies|month|minutes|characters|'
               r'data\.|days\.|instead\.|environment\.|extension\.|'
               r'page\.|repositories\.|state|success|active|closed|'
               r'merged|opened|stale|started|pushed|complete|through)$', re.I),

    # --- v10: языковые названия с "..." ---
    re.compile(r'^[A-Z][\w\s]+\(.*\.\.\."?\)?$'),
]

_FRAGMENT_START = re.compile(r'^[,.;:)\]]\s|^\.\s|^,\s')
_FRAGMENT_SHORT = {'or', 'and', 'not', 'to', 'in', 'of', 'for', 'on', 'at', 'by'}


def is_noise(text: str, repo: str | None = None) -> bool:
    if not text:
        return True
    t = text.strip()
    if not t:
        return True
    if t in BRANDS:
        return True
    if SHORT_SINGLE_LETTER.match(t):
        return True
    # кириллица → уже не UI-текст (контент, коммиты, задачи, перевод userscript)
    if re.search(r'[а-яА-ЯёЁ]', t):
        return True

    # owner / name репозитория — это user-content
    if repo:
        parts = [p for p in repo.rstrip("/").split("/") if p]
        if len(parts) >= 2:
            owner, name = parts[-2], parts[-1]
            if t in (owner, name):
                return True

    for rx in _NOISE_RX:
        if rx.search(t):
            return True
    return False


def is_fragment(text: str) -> bool:
    """Строка — обрывок фразы (после <strong>, <em> и т.п.).

    ВАЖНО: одиночное слово без пробелов — это полноценный UI-лейбл
    (cancel, delete, settings, issues, actions, insights, …), не фрагмент.
    """
    t = text.strip()
    if not t:
        return True
    if ' ' not in t and len(t) <= 25:
        return False
    if _FRAGMENT_START.search(t):
        return True
    if t.lower() in _FRAGMENT_SHORT:
        return True
    if len(t) < 15 and t[:1].islower() and not t.endswith(('.', '!', '?')):
        return True
    return False


def safe_is_identifier(text: str) -> bool:
    try:
        return is_identifier(text)
    except Exception:
        return False


# ============================================================
# СКАН СТРАНИЦЫ
# ============================================================

def scan_page_with_script(page, url, delay=2.0):
    """
    Возвращает (visible_texts | None, error | None).

    error:
      • "timeout"        — PWTimeout на goto;
      • "auth_required"  — редирект/форма логина;
      • str(e)           — прочие ошибки навигации/извлечения.
    """
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=30000)
    except PWTimeout:
        print(f"    ⚠ timeout: {url}")
        return None, "timeout"
    except Exception as e:
        print(f"    ⚠ error: {url}: {e}")
        return None, str(e)

    login_reason = _is_login_page(page, url)
    if login_reason:
        print(f"    [AUTH] {login_reason}")
        return None, "auth_required"

    time.sleep(delay)

    try:
        for _ in range(3):
            n = page.evaluate(
                "() => { const d = document.querySelectorAll('details:not([open])');"
                "d.forEach(x => x.open = true); return d.length; }"
            )
            if not n:
                break
            time.sleep(0.4)
        time.sleep(1.2)
    except Exception:
        pass

    try:
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(0.6)
        page.evaluate("window.scrollTo(0, 0)")
        time.sleep(0.4)
    except Exception:
        pass

    time.sleep(0.5)

    try:
        texts = page.evaluate(EXTRACT_ALL_TEXT_JS)
    except Exception as e:
        print(f"    ⚠ extract error: {url}: {e}")
        return None, f"extract: {e}"

    return texts, None


# ============================================================
# ПРОВЕРКА «умеет ли userscript переводить эту строку»
# ============================================================

def _can_translate(page, text: str, has_api: bool, script_dict: set[str]) -> bool:
    """Точная проверка. Вызывать ТОЛЬКО пока браузер открыт."""
    if has_api:
        try:
            r = page.evaluate("t => window.__ghRuTranslate?.(t) ?? null", text)
            if r is not None and r != text:
                return True
        except Exception:
            pass
    return text in script_dict


# ============================================================
# MAIN
# ============================================================

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("repo")
    ap.add_argument("--script", required=True)
    ap.add_argument("--inventory", default="inventory.json")
    ap.add_argument("--auth", default="auth.json")
    ap.add_argument("--scope", default=None,
                    help="если не задан — берётся из inventory['scope']")
    ap.add_argument("--out-report", default="verify_report.md")
    ap.add_argument("--out-todo", default="to_translate.json")
    ap.add_argument("--out-bugs", default="to_translate_bugs.json")
    ap.add_argument("--delay", type=float, default=3.5)
    args = ap.parse_args()

    inventory = json.loads(Path(args.inventory).read_text(encoding="utf-8"))
    inv_entries = inventory.get("entries", {})
    inv_scope = inventory.get("scope", "default")
    script_dict = load_script_dictionary(args.script)
    script_src = Path(args.script).read_text(encoding="utf-8")

    scope = args.scope or inv_scope
    if args.scope and args.scope != inv_scope:
        print(f"⚠ --scope={args.scope} не совпадает с inventory['scope']={inv_scope}")
        print("   → translated/real_gaps могут быть неточными")
    print(f"[scope] используем: {scope} (inventory: {inv_scope})")

    pages_raw = build_pages(args.repo, scope)
    # дедуп URL (важно при смешанных алиасах)
    seen_urls = set()
    pages = []
    for title, url in pages_raw:
        k = url_key(url)
        if k in seen_urls:
            continue
        seen_urls.add(k)
        pages.append((title, url))

    untranslated: dict[str, int] = {}
    seen_on_any_page: set[str] = set()
    unknown: set[str] = set()
    translation_capability: dict[str, bool] = {}
    visited_urls: set[str] = set()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx_kwargs = {"viewport": {"width": 1440, "height": 900}}
        if Path(args.auth).exists():
            ctx_kwargs["storage_state"] = args.auth
        context = browser.new_context(**ctx_kwargs)
        context.add_init_script(script_src)
        page = context.new_page()
        has_api = None
        auth_streak = 0

        for title, url in pages:
            print(f"  → [{title}] {url}")
            visible, err = scan_page_with_script(page, url, delay=args.delay)

            if has_api is None and visible is not None:
                try:
                    has_api = bool(page.evaluate(
                        "() => typeof window.__ghRuTranslate === 'function'"
                    ))
                except Exception:
                    has_api = False
                print(f"[init] __ghRuTranslate: "
                      f"{'OK' if has_api else 'MISSING — fallback на exactTranslations'}")

            if visible is None:
                if err == "auth_required":
                    auth_streak += 1
                    if auth_streak >= 3:
                        print("\n[!] 3 страницы подряд требуют логин — прерываю.")
                        print("    Запустите с --auth свежим или перелогиньтесь.\n")
                        break
                continue
            auth_streak = 0
            visited_urls.add(url)

            visible_set = set(visible)

            # накопить untranslated
            hits = set(inv_entries) & visible_set
            for text in hits:
                untranslated[text] = untranslated.get(text, 0) + 1
            seen_on_any_page |= hits

            # capability — пока браузер открыт
            for text in hits:
                if text not in translation_capability:
                    translation_capability[text] = _can_translate(
                        page, text, bool(has_api), script_dict
                    )

            # unknown (нет в inventory)
            for text in visible_set:
                if text in inv_entries:
                    continue
                if safe_is_identifier(text):
                    continue
                if len(text) < 3 or len(text) > 300:
                    continue
                if not any(c.isalpha() for c in text):
                    continue
                unknown.add(text)

        context.close()
        browser.close()

    # ==================================================
    # КЛАССИФИКАЦИЯ
    # ==================================================
    gaps_raw: dict[str, dict] = {}
    bugs_raw: dict[str, dict] = {}
    for text, count in untranslated.items():
        if translation_capability.get(text, False):
            bugs_raw[text] = {"count": count,
                              "reason": "userscript умеет, но на DOM не сработало"}
        else:
            gaps_raw[text] = {"count": count,
                              "meta": inv_entries.get(text, {})}

    def _is_uc(text: str) -> bool:
        return bool((inv_entries.get(text) or {}).get("is_uc", False))

    # gaps: сначала разделяем на UI / UC (по метаданным inventory)
    gaps_ui_raw = {t: v for t, v in gaps_raw.items() if not _is_uc(t)}
    gaps_uc_raw = {t: v for t, v in gaps_raw.items() if _is_uc(t)}

    # фильтрация UI
    real_gaps = {
        t: v for t, v in gaps_ui_raw.items()
        if not is_noise(t, args.repo)
        and not is_fragment(t)
        and not safe_is_identifier(t)
    }

    # UC → без фильтра is_noise (это по определению user-content), но
    # отбрасываем совсем короткое/пустое
    gaps_uc = {
        t: v for t, v in gaps_uc_raw.items()
        if len(t) >= 3 and len(t) <= 300
    }

    # bugs: фильтруем и по is_noise, и по is_uc
    real_bugs = {
        t: v for t, v in bugs_raw.items()
        if not _is_uc(t)
        and not is_noise(t, args.repo)
        and not SHORT_SINGLE_LETTER.match(t)
        and t not in BRANDS
        and not t.startswith('@')
        and not t.endswith(', (Directory)')
        and not t.endswith(', (File)')
    }

    unknown_clean = set()
    for t in unknown:
        if is_noise(t, args.repo) or is_fragment(t):
            continue
        if len(t) < 3 or len(t) > 300:
            continue
        unknown_clean.add(t)

    # ==================================================
    # TRANSLATED (v5: постранично + разделение UI/UC)
    # ==================================================
    translated_ui: set[str] = set()
    translated_uc: set[str] = set()
    unchecked: set[str] = set()
    has_sources_info = any(
        bool((inv_entries.get(t) or {}).get("sources"))
        for t in inv_entries
    )
    if not has_sources_info and inv_entries:
        print("⚠ inventory без 'sources' — translated считается глобально (fallback)")

    for text in inv_entries:
        if text in seen_on_any_page:
            continue  # ещё виден → уже в untranslated
        sources = set((inv_entries.get(text) or {}).get("sources", []))
        if not sources:
            # старый inventory или text без источников → глобальный fallback
            target = translated_uc if _is_uc(text) else translated_ui
            target.add(text)
        elif sources <= visited_urls:
            target = translated_uc if _is_uc(text) else translated_ui
            target.add(text)
        else:
            unchecked.add(text)

    # Счётчики
    inv_ui = sum(1 for m in inv_entries.values() if not m.get("is_uc", False))
    inv_uc = sum(1 for m in inv_entries.values() if m.get("is_uc", False))

    # ==================================================
    # ОТЧЁТ
    # ==================================================
    L = ["# Отчёт верификации\n",
         f"Страниц: {len(pages)} (scope: `{scope}`)\n",
         "## Сводка\n",
         "| Метрика | Кол-во |", "|---|---:|",
         f"| Из inventory (всего) | {len(inv_entries)} |",
         f"| ├ UI | {inv_ui} |",
         f"| └ User-content | {inv_uc} |",
         f"| ✅ Переведено (UI) | {len(translated_ui)} |",
         f"| ✅ Переведено (UC) — справочно | {len(translated_uc)} |",
         f"| ❌ Реальных пробелов (UI, после фильтра) | {len(real_gaps)} |",
         f"| 🐞 Багов (userscript умеет, но не сработало) | {len(real_bugs)} |",
         f"| 🗂 User content (не переводим) | {len(gaps_uc)} |",
         f"| ⏭ Не проверено (страницы не посещены) | {len(unchecked)} |",
         f"| ➕ Новых строк (после фильтра) | {len(unknown_clean)} |", ""]

    if real_gaps:
        L.append("## ❌ Реальные пробелы (добавить в словарь)\n")
        L.append("| Текст | Раз | Категории | Тултип |")
        L.append("|---|---:|---|---|")
        for text, info in sorted(real_gaps.items(), key=lambda x: -x[1]["count"]):
            cats = ", ".join(info["meta"].get("categories", []))
            tip_cell = "да" if info["meta"].get("tooltip") else "нет"
            esc = text.replace('|', '\\|')[:100]
            L.append(f"| `{esc}` | {info['count']} | {cats} | {tip_cell} |")
        L.append("")

    if real_bugs:
        L.append("## 🐞 Баги (исправить в userscript)\n")
        L.append("`__ghRuTranslate` умеет перевести, но на экране не переведено.\n"
                 "Причины: тайминг, `aria-busy`, `PROTECTED_SELECTORS`, `<svg>` внутри `<button>`.\n")
        L.append("| Текст | Раз |")
        L.append("|---|---:|")
        for text, info in sorted(real_bugs.items(), key=lambda x: -x[1]["count"]):
            esc = text.replace('|', '\\|')[:100]
            L.append(f"| `{esc}` | {info['count']} |")
        L.append("")

    if gaps_uc:
        L.append("## 🗂 User content (не переводим)\n")
        L.append("Заголовки issue/PR, коммиты, имена пользователей, ветки, "
                 "SVG-подписи Highcharts. Это **не UI** GitHub.\n")
        L.append("| Текст | Раз |")
        L.append("|---|---:|")
        for text, info in sorted(gaps_uc.items(), key=lambda x: -x[1]["count"])[:100]:
            esc = text.replace('|', '\\|')[:100]
            L.append(f"| `{esc}` | {info['count']} |")
        if len(gaps_uc) > 100:
            L.append(f"| … и ещё {len(gaps_uc) - 100} | |")
        L.append("")

    if unchecked:
        L.append("## ⏭ Не проверено (частично просканировано)\n")
        L.append("Тексты, чьи страницы-источники не были посещены. "
                 "Запустите сканер_1 с тем же --scope или расширьте scope.\n")
        for text in sorted(unchecked)[:200]:
            L.append(f"- `{text.replace(chr(96), chr(39))[:120]}`")
        if len(unchecked) > 200:
            L.append(f"- … и ещё {len(unchecked) - 200}")
        L.append("")

    if unknown_clean:
        L.append("## ➕ Новые строки (проверить вручную)\n")
        for text in sorted(unknown_clean)[:80]:
            L.append(f"- `{text.replace(chr(96), chr(39))[:100]}`")
        L.append("")

    Path(args.out_report).write_text("\n".join(L), encoding="utf-8")

    # ==================================================
    # to_translate.json — только реальные UI-пробелы + новые строки
    # ==================================================
    todo = {text: "" for text in sorted(real_gaps.keys())}
    for text in sorted(unknown_clean):
        todo[text] = ""

    # v5: разделяем отфильтрованное на latin / cyrillic
    filtered_gaps = set(gaps_raw) - set(real_gaps) - set(gaps_uc) - set(real_bugs)
    filtered_bugs = set(bugs_raw) - set(real_bugs)
    filtered_unknown = set(unknown) - unknown_clean
    possibly_filtered = filtered_gaps | filtered_bugs | filtered_unknown

    possibly_latin = sorted(
        t for t in possibly_filtered
        if not re.search(r'[а-яА-ЯёЁ]', t)
    )
    possibly_cyrillic_count = sum(
        1 for t in possibly_filtered
        if re.search(r'[а-яА-ЯёЁ]', t)
    )
    if possibly_latin:
        todo["_possibly_filtered_latin"] = possibly_latin
    if possibly_cyrillic_count:
        todo["_possibly_filtered_cyrillic_count"] = possibly_cyrillic_count

    Path(args.out_todo).write_text(
        json.dumps(todo, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    # ==================================================
    # to_translate_bugs.json
    # ==================================================
    bugs_out = {text: "" for text in sorted(real_bugs.keys())}
    Path(args.out_bugs).write_text(
        json.dumps(bugs_out, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    todo_count = len(real_gaps) + len(unknown_clean)
    print(f"\n✓ {args.out_report}")
    print(f"✓ {args.out_todo}: {todo_count} UI-строк требуют перевода "
          f"({len(real_gaps)} gaps + {len(unknown_clean)} unknown)")
    print(f"✓ {args.out_bugs}: {len(bugs_out)} потенциальных багов")
    print(f"  (inventory: UI={inv_ui}, UC={inv_uc}; "
          f"translated_ui={len(translated_ui)}, translated_uc={len(translated_uc)}; "
          f"real_gaps={len(real_gaps)}, real_bugs={len(real_bugs)}, "
          f"gaps_uc={len(gaps_uc)}, unchecked={len(unchecked)}, "
          f"unknown_clean={len(unknown_clean)}; "
          f"filtered: latin={len(possibly_latin)}, cyrillic={possibly_cyrillic_count})")


if __name__ == "__main__":
    main()