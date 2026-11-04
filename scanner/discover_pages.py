#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
discover_pages.py — автоматически находит страницы приложения GitHub
и (опционально) напрямую обновляет блок AUTO-DISCOVERED в pages.py.

Стратегия:
  • стартует с seed-URL (главная, /settings, /copilot, /marketplace, …)
  • BFS по ссылкам <a href> внутри домена github.com
  • фильтр по whitelist префиксов (только "приложение", не пользовательский контент)
  • отбрасывает страницы с HTTP >= 400 и «soft-404» по заголовку
  • группирует по первому сегменту пути
  • на выходе:
      discovered_pages.json       — все найденные пути
      discovered_pages.py         — готовый фрагмент (если не передан --no-fragment)
      discovered_diff.md          — что нового vs текущим pages.py
      pages.py                    — (если --update-pages-py) блок AUTO-DISCOVERED
                                    заменяется, создаётся pages.py.bak

Использование:
    python discover_pages.py --max-depth 3 --max-pages 400
    python discover_pages.py --only-prefix /settings --max-depth 4
    python discover_pages.py --seed https://github.com/copilot,https://github.com/copilot/agents
    python discover_pages.py --pages-py pages.py --dry-run

    # напрямую патчит pages.py между маркерами AUTO-DISCOVERED
    python discover_pages.py --update-pages-py
    python discover_pages.py --update-pages-py --no-fragment
    python discover_pages.py --update-pages-py --dry-run

Зависимости: playwright (chromium).
"""
import argparse
import json
import re
import time
from collections import deque
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright


# ============================================================
# WHITELIST / BLACKLIST
# ============================================================

# только эти префиксы путей считаем «страницами приложения»
WHITELIST_PREFIXES = [
    "/settings",       # настройки пользователя
    "/copilot",        # Copilot (onboarding, chat, agents)
    "/dashboard",      # новая панель
    "/feed",           # лента
    "/notifications",  # уведомления
    "/codespaces",     # codespaces
    "/explore",        # discovery
    "/trending",
    "/topics",
    "/collections",
    "/events",
    "/sponsors",       # только /sponsors и /sponsors/* без имени пользователя
    "/marketplace",
    "/apps",
    "/features",
    "/enterprise",
    "/pricing",
    "/solutions",
    "/team",
    "/security",       # /security/advisories и т.п.
    "/site",           # /site/terms, /site/privacy
    "/about",
    "/contact",
    "/changelog",
    "/readme",
    "/customer-stories",
    "/education",
    "/nonprofit",
    "/premium-support",
    "/new",            # /new (создание репо), /new/import
    "/organizations",
    "/account",
    "/login",
    "/signup",
    "/join",
    "/gist",           # gist.github.com — отдельный домен, но упомянем
]

# эти пути игнорируем всегда
BLACKLIST_PATTERNS = [
    r"^/login(\?|$)",           # /login/oauth/authorize?.. — не надо
    r"^/logout",
    r"^/join(\?|$)",
    r"^/signup(\?|$)",
    r"^/password_reset",
    r"^/sessions",
    r"^/account_verifications",
    r"^/site/terms(/|$)",       # правовые страницы — отдельно
    r"^/site/privacy",
    r"^/site/cookies",
    r"^/users/",                # /users/xxx — пользователи
    r"^/orgs/",                 # /orgs/xxx — организации
    r"^/sponsors/[^/]+$",       # конкретный спонсор
    r"^/sponsors/explore/.*",
    r"^/settings/installations/[^/]+",  # конкретная установка
    r"^/settings/connections/applications/[^/]+",
    r"^/settings/tokens/[^/]+",
    r"^/notifications/(?!$)",   # /notifications/xxx — детали
    r"^/apps/[^/]+/?$",         # конкретное приложение
    r"^/marketplace/[^/]+/?$",  # конкретный листинг
    r"^/topics/[^/]+/?$",       # конкретная тема
    r"^/collections/[^/]+/?$",  # конкретная коллекция
]

# относительные исключения — не заходить дальше этих сегментов
MAX_SEGMENTS = {
    "/settings": 3,        # /settings/actions/runners — ок; глубже не надо
    "/copilot": 2,
    "/codespaces": 2,
    "/marketplace": 2,
    "/sponsors": 2,
    "/apps": 2,
    "/enterprise": 3,
    "/features": 3,
    "/solutions": 2,
    "/security": 2,
    "/site": 2,
    "/about": 2,
    "/new": 1,
}

DEFAULT_SEEDS = [
    "https://github.com",
    "https://github.com/settings/profile",
    "https://github.com/settings/account",
    "https://github.com/settings/appearance",
    "https://github.com/settings/accessibility",
    "https://github.com/settings/notifications",
    "https://github.com/settings/billing",
    "https://github.com/settings/emails",
    "https://github.com/settings/security",
    "https://github.com/settings/sessions",
    "https://github.com/settings/keys",
    "https://github.com/settings/organizations",
    "https://github.com/settings/repositories",
    "https://github.com/settings/codespaces",
    "https://github.com/settings/copilot",
    "https://github.com/settings/apps",
    "https://github.com/settings/installations",
    "https://github.com/settings/developer",
    "https://github.com/settings/tokens",
    "https://github.com/settings/replies",
    "https://github.com/dashboard",
    "https://github.com/feed",
    "https://github.com/notifications",
    "https://github.com/copilot",
    "https://github.com/codespaces",
    "https://github.com/explore",
    "https://github.com/trending",
    "https://github.com/topics",
    "https://github.com/collections",
    "https://github.com/events",
    "https://github.com/sponsors",
    "https://github.com/marketplace",
    "https://github.com/pricing",
    "https://github.com/features",
    "https://github.com/enterprise",
    "https://github.com/security",
    "https://github.com/changelog",
    "https://github.com/readme",
    "https://github.com/customer-stories",
    "https://github.com/education",
    "https://github.com/nonprofit",
    "https://github.com/about",
    "https://github.com/contact",
    "https://github.com/site/terms",
    "https://github.com/site/privacy",
    "https://github.com/new",
]


# ============================================================
# SOFT-404 ФИЛЬТР
# ============================================================

# Признаки «страница не найдена», которые отдаются с HTTP 200
# (SPA / client-side router). Проверяем по <title>, регистронезависимо.
BAD_TITLE_MARKERS = (
    "page not found",
    "403 forbidden",
    "404 not found",
)

# HTTP-статусы, при которых имеет смысл один retry после паузы
# (rate-limit / временный блок) — не дропаем сразу.
RETRYABLE_STATUS = frozenset({403, 429})


# ============================================================
# МАРКЕРЫ ДЛЯ pages.py
# ============================================================

MARKER_BEGIN = "# === AUTO-DISCOVERED BEGIN ==="
MARKER_END   = "# === AUTO-DISCOVERED END ==="

# порядок переменных discovered_<section> — совпадает с pages.py
SECTION_ORDER = [
    "home", "dashboard", "settings-user", "copilot", "codespaces",
    "discover", "marketplace", "sponsors", "create", "account",
    "marketing", "info", "other",
]


def normalize_url(url: str, base: str = "https://github.com") -> str | None:
    """Привести URL к виду https://github.com/path (без query/hash)."""
    try:
        u = urlparse(url)
    except Exception:
        return None
    if u.scheme not in ("http", "https"):
        return None
    if u.netloc != "github.com":
        return None
    path = u.path or "/"
    # убрать trailing slash (кроме корня)
    if path != "/" and path.endswith("/"):
        path = path[:-1]
    return f"https://github.com{path}"


def path_of(url: str) -> str:
    return urlparse(url).path or "/"


def is_whitelisted(path: str) -> bool:
    return any(path == p or path.startswith(p + "/") or path == p + "/"
               for p in WHITELIST_PREFIXES)


def is_blacklisted(path: str) -> bool:
    return any(re.match(p, path) for p in BLACKLIST_PATTERNS)


def depth_ok(path: str) -> bool:
    """Не заходить слишком глубоко для конкретных префиксов."""
    parts = [s for s in path.split("/") if s]
    for prefix, max_seg in MAX_SEGMENTS.items():
        if path == prefix or path.startswith(prefix + "/"):
            return len(parts) <= max_seg
    return len(parts) <= 3


def looks_like_file(path: str) -> bool:
    return bool(re.search(r'\.[a-z0-9]{1,5}$', path, re.I))


def classify(path: str) -> str:
    """Раздел для группировки."""
    if path == "/" or path == "":
        return "home"
    first = "/" + path.split("/", 2)[1] if path.startswith("/") else path
    if first.startswith("/settings"):
        return "settings-user"
    if first.startswith("/copilot"):
        return "copilot"
    if first.startswith("/dashboard"):
        return "dashboard"
    if first.startswith("/feed"):
        return "dashboard"
    if first.startswith("/notifications"):
        return "dashboard"
    if first.startswith("/codespaces"):
        return "codespaces"
    if first in ("/explore", "/trending", "/topics", "/collections"):
        return "discover"
    if first.startswith("/marketplace") or first.startswith("/apps"):
        return "marketplace"
    if first in ("/features", "/enterprise", "/pricing", "/solutions",
                 "/team", "/security", "/customer-stories", "/education",
                 "/nonprofit", "/premium-support"):
        return "marketing"
    if first.startswith("/sponsors"):
        return "sponsors"
    if first.startswith("/about") or first.startswith("/site") \
            or first.startswith("/contact") or first.startswith("/changelog") \
            or first.startswith("/readme") or first.startswith("/events"):
        return "info"
    if first.startswith("/new"):
        return "create"
    if first.startswith("/organizations") or first.startswith("/account"):
        return "account"
    return "other"


# ============================================================
# CRAWLER
# ============================================================

def collect_links(page) -> list[str]:
    try:
        return page.evaluate(r"""
        () => {
            const out = [];
            document.querySelectorAll('a[href]').forEach(a => {
                const href = a.getAttribute('href') || '';
                if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
                out.push(href);
            });
            return out;
        }
        """)
    except Exception:
        return []


def _goto_with_retry(page, url: str, delay: float):
    """goto + один retry на 403/429 (rate-limit / временный блок).

    Возвращает Response или None при сетевой ошибке.
    """
    try:
        response = page.goto(url, wait_until="domcontentloaded", timeout=20000)
    except Exception:
        return None

    if response is not None and response.status in RETRYABLE_STATUS:
        # вероятный rate-limit — подождать и попробовать ещё раз
        time.sleep(max(delay * 5.0, 2.0))
        try:
            response = page.goto(url, wait_until="domcontentloaded", timeout=20000)
        except Exception:
            return None

    return response


def crawl(seeds, auth_path, max_depth, max_pages, delay, only_prefix, verbose=True):
    """BFS-обход. Возвращает {url: {depth, from_page, title}}.

    Страницы с HTTP >= 400 и «soft-404» по <title> в результат не попадают,
    и с них не извлекаются дальнейшие ссылки.
    """
    found = {}
    queue = deque()
    seen = set()

    for s in seeds:
        u = normalize_url(s)
        if u and u not in seen:
            queue.append((u, 0, None))
            seen.add(u)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx_kwargs = {"viewport": {"width": 1440, "height": 900}}
        if Path(auth_path).exists():
            ctx_kwargs["storage_state"] = auth_path
        context = browser.new_context(**ctx_kwargs)
        page = context.new_page()

        while queue and len(found) < max_pages:
            url, depth, from_page = queue.popleft()
            path = path_of(url)

            # фильтры
            if not only_prefix and not is_whitelisted(path):
                continue
            if only_prefix and not path.startswith(only_prefix):
                continue
            if is_blacklisted(path):
                continue
            if not depth_ok(path):
                continue
            if looks_like_file(path):
                continue

            response = _goto_with_retry(page, url, delay)
            if response is None:
                if verbose:
                    print(f"  ⚠ skip {path}: network error")
                continue

            # первичный фильтр: HTTP-статус
            if response.status >= 400:
                if verbose:
                    print(f"  ⚠ drop {path}: HTTP {response.status}")
                continue

            time.sleep(delay)

            title = ""
            try:
                title = page.title() or ""
            except Exception:
                pass

            # вторичный фильтр: soft-404 по заголовку
            # (SPA отдают 200 + "Page not found" в <title>)
            if title and any(m in title.lower() for m in BAD_TITLE_MARKERS):
                if verbose:
                    print(f"  ⚠ drop {path}: bad title {title!r}")
                continue

            # только теперь регистрируем страницу
            found[url] = {"depth": depth, "from_page": from_page, "title": title}
            if verbose:
                print(f"  [{len(found):3d}] {path}" + (f"  · {title[:50]}" if title else ""))

            if depth >= max_depth:
                continue

            # извлечь ссылки
            raw_links = collect_links(page)
            for raw in raw_links:
                nxt = normalize_url(raw)
                if not nxt or nxt in seen:
                    continue
                npath = path_of(nxt)
                if only_prefix and not npath.startswith(only_prefix):
                    continue
                if not is_whitelisted(npath):
                    continue
                if is_blacklisted(npath):
                    continue
                if looks_like_file(npath):
                    continue
                if not depth_ok(npath):
                    continue
                seen.add(nxt)
                queue.append((nxt, depth + 1, url))

        context.close()
        browser.close()

    return found


# ============================================================
# ВЫВОД
# ============================================================

def group_by_section(found: dict) -> dict[str, list[str]]:
    groups: dict[str, list[str]] = {}
    for url in found:
        section = classify(path_of(url))
        groups.setdefault(section, []).append(url)
    for section in groups:
        groups[section].sort()
    return groups


def extract_current_urls(pages_py: Path) -> set[str]:
    """Достать все URL, упомянутые в текущем pages.py (для diff)."""
    if not pages_py.exists():
        return set()
    src = pages_py.read_text(encoding="utf-8")
    urls = set()
    # абсолютные URL
    urls |= set(re.findall(r'https://github\.com(/[^\s"\']*)?', src))
    # обрезать query
    return {u.split("?")[0].split("#")[0].rstrip("/") or "/" for u in urls}


def _render_list_assignments(groups: dict[str, list[str]],
                             found: dict) -> list[str]:
    """Общий рендер `discovered_xxx = [(title, url), ...]` для всех секций."""
    lines: list[str] = []
    for section in SECTION_ORDER:
        var = "discovered_" + section.replace("-", "_")
        urls = groups.get(section) or []
        lines.append(f"{var} = [")
        for u in urls:
            title = found[u].get("title") or path_of(u) or "Home"
            # нормализуем пробелы и типографику, чтобы не тащить
            # \xa0 / \u2019 / ·  в исходник
            title = (title
                     .replace("\u00a0", " ")      # NBSP → пробел
                     .replace("\u2009", " ")      # thin space
                     .replace("\u202f", " ")      # narrow NBSP
                     .replace("\u2018", "'")      # ‘
                     .replace("\u2019", "'")      # ’
                     .replace("\u201c", '"')      # “
                     .replace("\u201d", '"')      # ”
                     .replace("\u2026", "...")    # …
                     .replace("·", "-"))          # middle dot
            title = title.replace('"', "'").strip()[:80]
            lines.append(f'    ({title!r}, "https://github.com{path_of(u)}"),')
        lines.append("]")
        lines.append("")
    return lines


def render_snippet(groups: dict[str, list[str]], found: dict) -> str:
    """Standalone discovered_pages.py (без маркеров)."""
    lines = [
        "# ============================================================",
        "# AUTO-DISCOVERED PAGES (discover_pages.py)",
        f"# Всего: {sum(len(v) for v in groups.values())} уникальных URL",
        "# Вставьте нужные блоки в build_pages() или объедините с core/settings/user",
        "# ============================================================",
        "",
    ]
    lines.extend(_render_list_assignments(groups, found))
    return "\n".join(lines)


def render_discovered_block(groups: dict[str, list[str]], found: dict) -> str:
    """Блок с маркерами для прямой вставки в pages.py."""
    lines = [
        MARKER_BEGIN,
        "# AUTO-GENERATED by discover_pages.py — DO NOT EDIT manually.",
        "# Regenerate:  python discover_pages.py --update-pages-py",
        "",
    ]
    lines.extend(_render_list_assignments(groups, found))
    lines.append(MARKER_END)
    return "\n".join(lines)


def update_pages_py(pages_path: Path, groups, found, dry_run: bool = False) -> None:
    """Заменить блок между MARKER_BEGIN и MARKER_END в pages.py."""
    if not pages_path.exists():
        raise FileNotFoundError(str(pages_path))
    src = pages_path.read_text(encoding="utf-8")

    if MARKER_BEGIN not in src or MARKER_END not in src:
        raise RuntimeError(
            f"{pages_path} не содержит маркеров авто-обновления.\n"
            f"Добавьте в файл блок:\n\n"
            f"{MARKER_BEGIN}\n"
            f"discovered_home = []\n"
            f"discovered_dashboard = []\n"
            f"discovered_settings_user = []\n"
            f"discovered_copilot = []\n"
            f"discovered_codespaces = []\n"
            f"discovered_discover = []\n"
            f"discovered_marketplace = []\n"
            f"discovered_sponsors = []\n"
            f"discovered_create = []\n"
            f"discovered_account = []\n"
            f"discovered_marketing = []\n"
            f"discovered_info = []\n"
            f"discovered_other = []\n"
            f"{MARKER_END}"
        )

    new_block = render_discovered_block(groups, found)
    pattern = re.compile(
        re.escape(MARKER_BEGIN) + r".*?" + re.escape(MARKER_END),
        re.DOTALL,
    )
    # ВАЖНО: замену отдаём через callable — иначе re трактует
    # \x.., \u.... и \g<..> в тексте как backreference-последовательности
    # (падало на \xa0 в заголовке "The ReadME Project · Meet…").
    new_src, n = pattern.subn(lambda m: new_block, src, count=1)
    if n != 1:
        raise RuntimeError("Не удалось найти блок маркеров для замены")

    if new_src == src:
        print(f"  ℹ {pages_path} не изменился (блок AUTO-DISCOVERED совпадает)")
        return

    if dry_run:
        print(f"  ℹ dry-run: {pages_path} был бы обновлён")
        return

    backup = pages_path.with_name(pages_path.name + ".bak")
    backup.write_text(src, encoding="utf-8")
    pages_path.write_text(new_src, encoding="utf-8")
    print(f"✓ updated {pages_path}  (backup → {backup.name})")


def render_diff(found: dict, current_urls: set[str]) -> str:
    new_urls = []
    for url in sorted(found.keys()):
        path = path_of(url)
        if path not in current_urls:
            new_urls.append((path, found[url].get("title") or ""))

    L = [
        "# Diff: чего нет в текущем pages.py",
        "",
        f"*В текущем pages.py:* {len(current_urls)} URL",
        f"*Найдено краулером:* {len(found)} URL",
        f"*Новых:* {len(new_urls)}",
        "",
    ]
    if not new_urls:
        L.append("_Ничего нового — pages.py уже покрывает всё._")
        return "\n".join(L)

    L.append("| Путь | Найден с | Заголовок |")
    L.append("|---|---|---|")
    for path, title in new_urls:
        # найти from_page
        url = next(u for u in found if path_of(u) == path)
        from_page = found[url].get("from_page") or "seed"
        from_path = path_of(from_page) if from_page != "seed" else "seed"
        L.append(f"| `{path}` | `{from_path}` | {title[:60]} |")
    return "\n".join(L)


# ============================================================
# MAIN
# ============================================================

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--seed", default="",
                    help="через запятую (переопределяет DEFAULT_SEEDS)")
    ap.add_argument("--auth", default="auth.json")
    ap.add_argument("--max-depth", type=int, default=3)
    ap.add_argument("--max-pages", type=int, default=400)
    ap.add_argument("--delay", type=float, default=0.3)
    ap.add_argument("--only-prefix", default="",
                    help="искать только в этом префиксе (например /settings)")
    ap.add_argument("--pages-py", default="pages.py")
    ap.add_argument("--out-dir", default=".")
    ap.add_argument("--dry-run", action="store_true",
                    help="только отчёт, не писать discovered_pages.py / pages.py")
    ap.add_argument("--update-pages-py", action="store_true",
                    help="Заменить блок AUTO-DISCOVERED в pages.py напрямую "
                         "(бэкап .bak создаётся автоматически)")
    ap.add_argument("--no-fragment", action="store_true",
                    help="Не писать discovered_pages.py "
                         "(используйте с --update-pages-py)")
    args = ap.parse_args()

    # защита от случайной потери данных: --only-prefix + --update-pages-py
    if args.only_prefix and args.update_pages_py:
        print("⚠ ВНИМАНИЕ: --only-prefix + --update-pages-py перезапишет "
              "ВЕСЬ блок AUTO-DISCOVERED только найденными под "
              f"'{args.only_prefix}' страницами.")
        print("  Если нужен полный блок — запустите без --only-prefix.")
        print("  Для просмотра без записи используйте --dry-run.\n")

    seeds = [s.strip() for s in args.seed.split(",") if s.strip()] or DEFAULT_SEEDS

    print(f"Seed: {len(seeds)} URL")
    print(f"Max depth: {args.max_depth}, max pages: {args.max_pages}")
    if args.only_prefix:
        print(f"Only prefix: {args.only_prefix}")
    if args.update_pages_py:
        print(f"Update: {args.pages_py} (block AUTO-DISCOVERED)")
    print()

    found = crawl(
        seeds=seeds,
        auth_path=args.auth,
        max_depth=args.max_depth,
        max_pages=args.max_pages,
        delay=args.delay,
        only_prefix=args.only_prefix,
    )

    print(f"\nНайдено {len(found)} страниц")

    groups = group_by_section(found)
    for section, urls in sorted(groups.items(), key=lambda x: -len(x[1])):
        print(f"  {section:15s} {len(urls):3d}")

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    # discovered_pages.json
    json_path = out_dir / "discovered_pages.json"
    if not args.dry_run:
        json_path.write_text(
            json.dumps(found, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        print(f"\n✓ {json_path}")
    else:
        print(f"\nℹ dry-run: {json_path} не записан")

    # discovered_pages.py (standalone fragment)
    if not args.dry_run and not args.no_fragment:
        snippet = render_snippet(groups, found)
        py_path = out_dir / "discovered_pages.py"
        py_path.write_text(snippet, encoding="utf-8")
        print(f"✓ {py_path}")

    # прямой апдейт pages.py
    if args.update_pages_py:
        print()
        try:
            update_pages_py(Path(args.pages_py), groups, found, dry_run=args.dry_run)
        except Exception as e:
            print(f"⚠ update {args.pages_py}: {e}")

    # discovered_diff.md
    current = extract_current_urls(Path(args.pages_py))
    diff = render_diff(found, current)
    diff_path = out_dir / "discovered_diff.md"
    if not args.dry_run:
        diff_path.write_text(diff, encoding="utf-8")
        print(f"✓ {diff_path}")
    else:
        print(f"ℹ dry-run: {diff_path} не записан")


if __name__ == "__main__":
    main()