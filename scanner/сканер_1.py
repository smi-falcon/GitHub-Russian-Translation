#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
сканер_1.py v8 — быстрый сбор UI-строк GitHub.

Изменения v8 vs v7:
  • isUserContent расширен: .markdown-title, .markdown-body, .wiki-body,
    [data-hovercard-type="issue"|"pull_request"], [data-testid*="issue-row"],
    [data-testid*="commit-row"], проверка <a href> на профиль/issue/pull/
    commit/tree/blob/tag/discussion, title="username Display Name".
  • RESERVED_PATHS — служебные пути, которые не считаем профилем.

Изменения v7 vs v6:
  • isUserContent + is_uc в inventory.
  • sources у каждой строки.

Изменения v6 vs v5:
  • build_pages / is_identifier / url_key из pages.py.
  • auth-флоу в auth_utils.py.
  • --scope default = "default".

Использование:
    python сканер_1.py https://github.com/owner/repo --scope settings
    python сканер_1.py https://github.com/owner/repo --scope all --max-pages 80
    python сканер_1.py https://github.com/owner/repo --scope settings --hover
"""
import argparse
import json
import time
from pathlib import Path

from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

from pages import build_pages, is_identifier, url_key
from auth_utils import ensure_auth, _is_login_page


ALL_SCOPES = [
    "core", "settings", "user", "noise", "default", "all",
    "settings-user", "marketplace",
    "issues", "pulls", "codespaces", "discussions",
    "dashboard", "planning", "errors",
]


# ============================================================
# EXTRACT (браузерный JS) — v8
# ============================================================

EXTRACT_JS = r"""
() => {
    const out = {};
    const clean = s => (s || '').replace(/\s+/g, ' ').trim();

    // Служебные пути, которые НЕ являются профилями пользователей
    const RESERVED_PATHS = new Set([
        'login','signup','features','enterprise','team','security','about','pricing',
        'marketplace','explore','topics','trending','dashboard','notifications','new',
        'settings','codespaces','feed','sponsors','search','orgs','pulls','issues',
        'account','join','contact','site','apps','git','repositories','organizations',
        'collections','events','stars','watching','following','followers','blog',
        'readme','robots.txt','favicon.ico','sitemap.xml','sessions','password_reset',
        'site','sponsors','sponsorships','readme','discussions','projects','wiki',
        'actions','releases','tags','branches','graphs','pulse','forks','labels',
        'milestones','compare','network','community','deployments','packages',
    ]);

    // --- v7/v8: детектор user-content ---
    const isUserContent = (el) => {
        if (!el || !el.closest) return false;

        // 1) Явные маркеры UC через обёртки
        if (el.closest('[data-hovercard-type]')) return true;
        if (el.closest('.author, .user-mention, .commit-author, .commit-title, .commit-desc, .commit-message')) return true;
        if (el.closest('.markdown-title, .js-issue-title')) return true;
        if (el.closest('.markdown-body, .wiki-body, .comment-body, [data-testid="issue-body"], [data-testid="readme"]')) return true;
        if (el.closest('[role="tree"], [data-testid="tree-view-item"], [data-testid="repos-file-tree"]')) return true;
        if (el.closest('.highcharts-container, svg.highcharts-root, .js-repo-network-graph')) return true;
        if (el.closest('[data-testid*="issue-row"], [data-testid*="commit-row"], [data-testid*="pull-request-row"]')) return true;
        if (el.closest('article.markdown-body, .repository-content article')) return true;
        if (el.closest('[data-testid*="feed"], .js-notification-thread, [data-testid="feed-item"]')) return true;
        if (el.closest('[data-testid="recommendation"], .js-recommendation')) return true;
        
        // 2) По href — стрипаем ?query и #fragment, поддерживаем многосегментные пути
        let a = el.tagName === 'A' ? el : el.closest('a[href]');
        if (a) {
            const rawHref = a.getAttribute('href') || '';
            const href = rawHref.split('?')[0].split('#')[0];

            // 2a. /username — профиль (один сегмент, не служебный)
            if (/^\/[A-Za-z0-9][\w.-]*\/?$/.test(href)) {
                const seg = href.replace(/^\/|\/?$/g, '').toLowerCase();
                if (!RESERVED_PATHS.has(seg)) return true;
            }

            // 2b. /owner/repo — репозиторий (два+ сегментов, первый не служебный)
            if (/^\/[A-Za-z0-9][\w.-]*\/[A-Za-z0-9]/.test(href)) {
                const first = href.replace(/^\//, '').split('/')[0].toLowerCase();
                if (!RESERVED_PATHS.has(first)) return true;
            }

            // 2c. Контент-ссылки (в т.ч. многосегментные)
            if (/\/issues\/\d+/.test(href)) return true;
            if (/\/pull\/\d+/.test(href)) return true;
            if (/\/commit\/[a-f0-9]{7,40}/.test(href)) return true;
            if (/\/commits(\/|$)/.test(href)) return true;                 // ← новое
            if (/\/releases\/tag\//.test(href)) return true;
            if (/\/tree\/[\w.-]+/.test(href)) return true;
            if (/\/blob\/[\w.-]+\//.test(href)) return true;
            if (/\/discussions\/\d+/.test(href)) return true;
            if (/\/forks(\?|$)/.test(href)) return true;                    // ← новое
            if (/\/network\/members/.test(href)) return true;
        }

        // 3) title="username Display Name" (octocat The Octocat)
        const title = el.getAttribute && el.getAttribute('title');
        if (title && (el.tagName === 'A' || el.closest('a[href]'))
            && /^[\w.-]+ [\w\s.'-]+$/.test(title) && title.length < 60) {
            return true;
        }

        return false;
    };

    const add = (text, cat, el) => {
        const t = clean(text);
        if (!t || t.length > 300) return;

        const uc = isUserContent(el);
        if (!out[t]) out[t] = { categories: [], has_tooltip: false, tooltip: '', uc: true };
        if (uc) return;
        out[t].uc = false;
        if (!out[t].categories.includes(cat)) out[t].categories.push(cat);
        const tip = (el && (el.getAttribute('title') || el.getAttribute('aria-label'))) || '';
        if (tip && tip.length < 400) {
            out[t].has_tooltip = true;
            if (!out[t].tooltip) out[t].tooltip = tip;
        }
    };

    const all = (sel) => {
        const acc = [];
        const walk = root => {
            try { root.querySelectorAll(sel).forEach(x => acc.push(x)); } catch(e){}
            try { root.querySelectorAll('*').forEach(x => { if (x.shadowRoot) walk(x.shadowRoot); }); } catch(e){}
        };
        walk(document);
        return acc;
    };

    // --- базовая разметка ---
    all('button, [role="button"]').forEach(el => add(el.innerText || el.textContent, 'button', el));
    all('input[type="checkbox"], input[type="radio"]').forEach(el => {
        const lbl = el.id ? document.querySelector(`label[for="${el.id}"]`) : el.closest('label');
        add(lbl ? lbl.textContent : (el.getAttribute('aria-label') || ''), 'checkbox', lbl || el);
    });
    all('label').forEach(el => add(el.innerText || el.textContent, 'label', el));
    all('summary').forEach(el => add(el.innerText || el.textContent, 'summary', el));
    all('[role="tab"]').forEach(el => add(el.innerText || el.textContent, 'tab', el));
    all('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')
        .forEach(el => add(el.innerText || el.textContent, 'menuitem', el));
    all('h1, h2, h3, h4, h5, h6, [role="heading"]').forEach(el => {
        const t = clean(el.innerText || el.textContent).replace(/^#+\s*/, '').replace(/\s*#\s*$/, '');
        add(t, 'heading', el);
    });
    all('a.anchor, h1 a[aria-hidden="true"], h2 a[aria-hidden="true"], h3 a[aria-hidden="true"]').forEach(a => {
        const h = a.closest('h1, h2, h3, h4, h5, h6');
        if (!h) return;
        const full = clean(h.innerText || h.textContent);
        const mark = clean(a.textContent);
        const t = mark ? full.replace(mark, '').trim() : full;
        if (t) add(t, 'heading_with_anchor', h);
    });
    all('dt').forEach(el => add(el.innerText || el.textContent, 'definition_term', el));
    all('dd').forEach(el => add(el.innerText || el.textContent, 'description', el));
    all('p').forEach(el => {
        if (el.closest('[data-testid="readme"], .markdown-body, .comment-body, [data-testid="issue-body"]')) return;
        if (!el.closest('main, [role="main"], form')) return;
        const text = clean(el.innerText || el.textContent);
        if (text.length < 20 || text.length > 600) return;
        add(text, 'description', el);
    });
    all('[class*="note"], [class*="hint"], [class*="warning"], [class*="danger"]').forEach(el => {
        if (!el.closest('main, [role="main"]')) return;
        const text = clean(el.innerText || el.textContent);
        if (text.length < 10 || text.length > 800) return;
        add(text, 'notice', el);
    });
    all('input[placeholder], textarea[placeholder]').forEach(el =>
        add(el.getAttribute('placeholder'), 'placeholder', el));
    all('select > option').forEach(el => add(el.textContent, 'option', el));

    all('a[href]').forEach(el => {
        const text = clean(el.innerText || el.textContent);
        if (!text) return;
        const hasIcon = el.querySelector('img, svg, picture');
        if (hasIcon && text.length < 2) return;
        if (text.length < 300) add(text, 'link', el);
    });

    all('td, th').forEach(el => {
        if (el.querySelector('input, button, select, textarea')) return;
        const text = clean(el.innerText || el.textContent);
        if (text && text.length < 300) add(text, 'cell', el);
    });

    all('input[type="submit"], input[type="button"], input[type="reset"]').forEach(el => {
        const v = el.getAttribute('value');
        if (v) add(v, 'button', el);
    });

    all('optgroup[label]').forEach(el => {
        const l = el.getAttribute('label');
        if (l) add(l, 'option_group', el);
    });

    const ATTRS = ['data-tooltip-content', 'data-content', 'data-message',
                   'data-hovercard-text', 'aria-label', 'title', 'alt'];
    ATTRS.forEach(attr => {
        all(`[${attr}]`).forEach(el => {
            const v = el.getAttribute(attr);
            if (v && v.length < 300) add(v, 'attr:' + attr, el);
        });
    });

    all('svg text, svg title').forEach(el => {
        const t = clean(el.textContent);
        if (t && t.length < 300) add(t, 'svg', el);
    });

    all('[role="alert"], [role="status"], [role="alertdialog"]').forEach(el => {
        const text = clean(el.innerText || el.textContent);
        if (text && text.length < 500) add(text, 'notice', el);
    });

    all('caption').forEach(el => {
        const text = clean(el.innerText || el.textContent);
        if (text && text.length < 300) add(text, 'cell', el);
    });

    all('figcaption').forEach(el => {
        const text = clean(el.innerText || el.textContent);
        if (text && text.length < 300) add(text, 'description', el);
    });

    return out;
}
"""

SETTINGS_LINKS_JS = r"""
() => {
    const origin = location.origin;
    const path = location.pathname;
    let base;
    if (/^\/settings(\/|$)/.test(path)) base = '/settings';
    else {
        const m = path.match(/^(\/[^\/]+\/[^\/]+)\/settings(\/|$)/);
        if (!m) return [];
        base = m[1] + '/settings';
    }
    const out = [], seen = new Set();
    const walk = root => {
        try {
            root.querySelectorAll('a[href]').forEach(a => {
                const href = a.getAttribute('href') || '';
                if (!href.startsWith(base)) return;
                const clean = (origin + href).split('?')[0].split('#')[0];
                if (seen.has(clean)) return;
                seen.add(clean);
                const t = (a.innerText || a.textContent || '').trim().split('\n')[0];
                out.push({href: clean, text: t.slice(0, 120)});
            });
        } catch(e){}
        try { root.querySelectorAll('*').forEach(el => { if (el.shadowRoot) walk(el.shadowRoot); }); } catch(e){}
    };
    walk(document);
    return out;
}
"""

HOVER_TIP_JS = r"""
() => {
    for (const s of ['[role="tooltip"]', '[data-testid="tooltip"]', '.Tooltip', 'tool-tip']) {
        try {
            for (const el of document.querySelectorAll(s)) {
                const r = el.getBoundingClientRect();
                if (r.width > 0 && r.height > 0) {
                    const t = (el.innerText || '').trim();
                    if (t) return t;
                }
            }
        } catch(e){}
    }
    return '';
}
"""


# ============================================================
# SCAN
# ============================================================

def dismiss_cookies(page):
    for sel in ['button:has-text("Accept")', 'button:has-text("Принять")',
                'button:has-text("Reject")', 'button:has-text("Отклонить")']:
        try:
            el = page.query_selector(sel)
            if el and el.is_visible():
                el.click(timeout=1000)
                time.sleep(0.2)
                return
        except Exception:
            pass


def scan_page(page, url, delay=0.4, hover=False, discover=False):
    print(f"  -> {url}")
    info = {"url": url, "ok": False, "error": None, "count": 0,
            "hovered": [], "discovered": []}

    try:
        page.goto(url, wait_until="domcontentloaded", timeout=30000)
    except PWTimeout:
        info["error"] = "timeout"
        return info
    except Exception as e:
        info["error"] = str(e)
        return info

    login_reason = _is_login_page(page, url)
    if login_reason:
        print(f"    [AUTH] {login_reason}")
        info["error"] = "auth_required"
        return info

    is_settings = '/settings' in url
    try:
        page.wait_for_function(
            """() => {
                if (document.querySelector('[aria-busy="true"]')) return false;
                if (location.pathname.includes('/settings')) {
                    return document.querySelector(
                        'form, [data-testid*="setting"], main .Box, .settings-form'
                    );
                }
                return document.readyState === 'complete';
            }""",
            timeout=15000 if is_settings else 6000
        )
    except Exception:
        pass

    if delay:
        time.sleep(delay)
    dismiss_cookies(page)

    try:
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(0.35)
        page.evaluate("window.scrollTo(0, 0)")
        page.evaluate(
            "document.querySelectorAll('details:not([open])')"
            ".forEach(d => d.open = true)"
        )
        time.sleep(0.2)
    except Exception:
        pass

    try:
        data = page.evaluate(EXTRACT_JS)
    except Exception as e:
        info["error"] = f"extract: {e}"
        return info

    if _is_login_page(page, url):
        info["error"] = "auth_required"
        return info

    if is_settings and len(data) < 25:
        print(f"    [retry settings] {len(data)} эл.")
        try:
            page.reload(wait_until="domcontentloaded", timeout=30000)
            page.wait_for_load_state("networkidle", timeout=10000)
            time.sleep(1.5)
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            time.sleep(0.3)
            page.evaluate("window.scrollTo(0, 0)")
            data = page.evaluate(EXTRACT_JS)
            print(f"    [retry done] {len(data)} эл.")
        except Exception as e:
            print(f"    [retry err] {e}")

    if hover:
        try:
            handles = page.query_selector_all(
                '[aria-describedby], [title], [data-tooltip-content]'
            )[:40]
            for h in handles:
                try:
                    if not h.is_visible():
                        continue
                    h.hover(timeout=500)
                    time.sleep(0.15)
                    tip = page.evaluate(HOVER_TIP_JS)
                    if tip:
                        trigger = (h.inner_text()
                                   or h.get_attribute('title')
                                   or "").strip()[:120]
                        info["hovered"].append(
                            {"trigger": trigger, "content": tip[:400]}
                        )
                except Exception:
                    pass
                finally:
                    try: page.mouse.move(1, 1)
                    except Exception: pass
        except Exception:
            pass

    if discover:
        try:
            info["discovered"] = page.evaluate(SETTINGS_LINKS_JS)
        except Exception:
            pass

    info["ok"] = True
    info["count"] = len(data)
    info["entries"] = data
    return info


# ============================================================
# OUTPUT
# ============================================================

def write_json(out_path, repo, scope, results, auth_used, inventory):
    payload = {
        "repo": repo,
        "scope": scope,
        "date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "auth": auth_used,
        "pages": results,
        "entries": inventory,
    }
    text = json.dumps(payload, ensure_ascii=False, indent=2)
    out_path.write_text(text, encoding="utf-8")
    size = out_path.stat().st_size
    print(f"OK JSON: {out_path} ({size} байт)")


def write_markdown(out_path, repo, scope, results, inventory, auth_used):
    ok = [r for r in results if r["ok"]]
    fail = [r for r in results if not r["ok"]]

    by_cat = {}
    for meta in inventory.values():
        for c in meta["categories"]:
            by_cat[c] = by_cat.get(c, 0) + 1

    uc_count = sum(1 for meta in inventory.values() if meta.get("is_uc"))

    L = []
    L.append(f"# Скан UI GitHub: `{repo}`\n")
    L.append(f"*Дата: {time.strftime('%Y-%m-%d %H:%M:%S')}*  ")
    L.append(f"*Scope: `{scope}`*  ")
    L.append(f"*Авторизация: {'да' if auth_used else 'нет'}*  ")
    L.append(f"*Страниц OK: {len(ok)}/{len(results)}*  ")
    L.append(f"*Уникальных строк: {len(inventory)}*  ")
    L.append(f"*User-content строк: {uc_count}*\n")
    L.append("## Категории\n")
    L.append("| Категория | Уникальных |")
    L.append("| --- | ---: |")
    for c, n in sorted(by_cat.items(), key=lambda kv: -kv[1]):
        L.append(f"| `{c}` | {n} |")
    L.append("\n## Проваленные страницы\n")
    if fail:
        for r in fail:
            L.append(f"- `{r['url']}` — **{r['error']}**")
    else:
        L.append("_нет_")
    L.append("\n---\n")

    cat_order = ["button", "menuitem", "tab", "summary", "label", "checkbox",
                 "heading", "heading_with_anchor", "definition_term",
                 "description", "notice", "placeholder", "option", "option_group",
                 "link", "cell", "svg"]

    for cat in cat_order:
        items = [(t, m) for t, m in inventory.items() if cat in m["categories"]]
        if not items:
            continue
        L.append(f"## `{cat}` ({len(items)})\n")
        for text, meta in sorted(items, key=lambda x: x[0].lower()):
            tip = ""
            if meta["has_tooltip"] and meta["tooltip"]:
                tip = f"  \n  *tooltip:* `{meta['tooltip']}`"
            L.append(f"- {text}{tip}")
        L.append("")

    out_path.write_text("\n".join(L), encoding="utf-8")
    size = out_path.stat().st_size
    print(f"OK Markdown: {out_path} ({size} байт)")


# ============================================================
# MAIN
# ============================================================

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("repo")
    ap.add_argument("--scope", default="default", choices=ALL_SCOPES,
                    help="набор страниц (default: core+settings+user)")
    ap.add_argument("--auth", default="auth.json")
    ap.add_argument("--out", default="inventory.json")
    ap.add_argument("--md", default="сканер.md")
    ap.add_argument("--delay", type=float, default=0.4,
                    help="пауза после загрузки страницы")
    ap.add_argument("--hover", action="store_true",
                    help="собирать всплывающие тултипы (медленно)")
    ap.add_argument("--no-discover", action="store_true",
                    help="не искать подстраницы /settings/*")
    ap.add_argument("--max-pages", type=int, default=0,
                    help="ограничить число сканирований")
    ap.add_argument("--force-auth", action="store_true",
                    help="принудительно перелогиниться")
    args = ap.parse_args()

    queue = list(build_pages(args.repo, args.scope))
    discover = not args.no_discover
    inventory = {}
    results = []
    seen = set()
    auth_streak = 0
    t_start = time.time()

    with sync_playwright() as p:
        ctx_kwargs = {"viewport": {"width": 1440, "height": 900}}
        if Path(args.auth).exists() and not args.force_auth:
            ctx_kwargs["storage_state"] = args.auth
        browser, context, page = ensure_auth(
            p, ctx_kwargs, args.auth, force=args.force_auth
        )

        try:
            while queue:
                title, url = queue.pop(0)
                key = url_key(url)
                if key in seen:
                    continue
                seen.add(key)

                is_settings = '/settings' in url
                info = scan_page(
                    page, url,
                    delay=args.delay,
                    hover=args.hover,
                    discover=is_settings and discover,
                )

                entry = {k: v for k, v in info.items() if k != "entries"}
                entry["title"] = title
                results.append(entry)

                if not info["ok"]:
                    print(f"    [SKIP] {title}: {info['error']}")
                    if info["error"] == "auth_required":
                        auth_streak += 1
                        if auth_streak >= 3:
                            print("\n[!] 3 страницы подряд требуют логин — прерываю.")
                            print("    Запустите с --force-auth для перелогина.\n")
                            break
                    continue
                auth_streak = 0

                for text, meta in info["entries"].items():
                    if is_identifier(text):
                        continue

                    uc = meta.get("uc", False)

                    if text not in inventory:
                        inventory[text] = {
                            "categories": [] if uc else list(meta["categories"]),
                            "has_tooltip": False if uc else meta["has_tooltip"],
                            "tooltip": "" if uc else meta["tooltip"],
                            "translation": "",
                            "sources": [url],
                            "is_uc": uc,
                        }
                    else:
                        if not uc:
                            inventory[text]["is_uc"] = False
                            for c in meta["categories"]:
                                if c not in inventory[text]["categories"]:
                                    inventory[text]["categories"].append(c)
                            if meta["has_tooltip"]:
                                inventory[text]["has_tooltip"] = True
                                if not inventory[text]["tooltip"]:
                                    inventory[text]["tooltip"] = meta["tooltip"]
                        if url not in inventory[text]["sources"]:
                            inventory[text]["sources"].append(url)

                print(f"    [{info['count']} эл.]")

                if is_settings and discover and info.get("discovered"):
                    added = 0
                    for link in info["discovered"]:
                        href = link.get("href", "")
                        if not href:
                            continue
                        k = url_key(href)
                        if k in seen:
                            continue
                        label = (link.get("text") or "").strip() or k.rsplit("/", 1)[-1]
                        queue.append((f"OK {label}", href))
                        added += 1
                    if added:
                        print(f"    +{added} settings-подстраниц в очереди")

                if args.max_pages and len(results) >= args.max_pages:
                    print(f"\n[Достигнут --max-pages={args.max_pages}]")
                    break
        finally:
            try: context.close()
            except Exception: pass
            try: browser.close()
            except Exception: pass

    elapsed = time.time() - t_start
    ok_count = sum(1 for r in results if r["ok"])
    uc_count = sum(1 for meta in inventory.values() if meta.get("is_uc"))
    ui_count = len(inventory) - uc_count
    print(f"\nOK {len(inventory)} уникальных строк "
          f"(UI: {ui_count}, user-content: {uc_count}), "
          f"{ok_count}/{len(results)} страниц OK "
          f"за {elapsed:.1f} сек")

    write_json(
        Path(args.out), args.repo, args.scope, results,
        bool(Path(args.auth).exists()), inventory
    )
    write_markdown(
        Path(args.md), args.repo, args.scope, results, inventory,
        bool(Path(args.auth).exists())
    )


if __name__ == "__main__":
    main()