# auth_utils.py — общий auth-флоу для сканера_1 и сканера_2.
#
# Перенос из сканер_1.py v5 без изменения логики. Меняй ТОЛЬКО здесь,
# оба сканера импортируют.
import time
from pathlib import Path


AUTH_PROBE_URL = "https://github.com/settings/profile"


def _is_logged_in(page) -> bool:
    """Эвристика: есть ли на текущей странице форма логина."""
    try:
        if "/login" in page.url:
            return False
        ok = page.evaluate("""
            () => {
                if (document.querySelector('input[name="login"]')) return false;
                if (document.querySelector('form[action="/session"]')) return false;
                return true;
            }
        """)
        return bool(ok)
    except Exception:
        return False


def _wait_stable(page, networkidle_ms: int = 15000, dom_ms: int = 8000) -> None:
    """Дождаться networkidle; при таймауте — fallback на domcontentloaded."""
    try:
        page.wait_for_load_state("networkidle", timeout=networkidle_ms)
        return
    except Exception:
        pass
    try:
        page.wait_for_load_state("domcontentloaded", timeout=dom_ms)
    except Exception:
        pass


def _goto_probe(page, url: str) -> None:
    """Перейти на url так, чтобы redirect на /login не ронял процесс."""
    try:
        page.goto(url, wait_until="commit", timeout=30000)
        page.wait_for_load_state("domcontentloaded", timeout=15000)
        return
    except Exception as e:
        print(f"  [auth] goto прерван ({type(e).__name__}), проверяю URL...")
    if "/settings/profile" in page.url:
        return
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=30000)
    except Exception as e:
        print(f"  [auth] повторный goto не удался: {e}")
        if "/settings/profile" not in page.url:
            raise


def ensure_auth(p, ctx_kwargs: dict, auth_path: str, force: bool = False):
    """
    Гарантирует авторизованный контекст.

    Возвращает (browser, context, page).

    force=False и auth_path существует:
      • проверяет валидность сессии;
      • OK  → переиспользует auth.json;
      • протух → открывает headed-браузер и пересоздаёт auth.json.

    force=True:
      • сразу headed-браузер для перелогина.
    """
    if not force and Path(auth_path).exists():
        b = p.chromium.launch(headless=True)
        c = b.new_context(**ctx_kwargs)
        pg = c.new_page()
        ok = False
        try:
            pg.goto(AUTH_PROBE_URL, wait_until="domcontentloaded", timeout=20000)
            _wait_stable(pg, networkidle_ms=5000, dom_ms=5000)
            ok = _is_logged_in(pg)
        except Exception as e:
            print(f"[auth] проверка не удалась: {e}")
        finally:
            try: c.close()
            except Exception: pass
            try: b.close()
            except Exception: pass

        if ok:
            print(f"[auth] OK сессия валидна ({auth_path})")
            ctx_kwargs = dict(ctx_kwargs)
            ctx_kwargs["storage_state"] = auth_path
            b = p.chromium.launch(headless=True)
            c = b.new_context(**ctx_kwargs)
            return b, c, c.new_page()
        print("[auth] сессия протухла — пересоздаём")

    print("[auth] открываю браузер для входа...")
    b = p.chromium.launch(headless=False)
    c = b.new_context()
    pg = c.new_page()
    pg.goto("https://github.com/login", wait_until="domcontentloaded", timeout=30000)
    input("  Войдите, потом Enter -> ")
    _wait_stable(pg, networkidle_ms=15000, dom_ms=10000)
    print(f"  [auth] URL после логина: {pg.url}")
    _goto_probe(pg, AUTH_PROBE_URL)
    _wait_stable(pg)
    input("  Если видите Settings — Enter, если снова логин — Ctrl+C -> ")
    c.storage_state(path=auth_path)
    print(f"[auth] OK {auth_path} сохранён")
    try: c.close()
    except Exception: pass
    try: b.close()
    except Exception: pass

    ctx_kwargs = dict(ctx_kwargs)
    ctx_kwargs["storage_state"] = auth_path
    b = p.chromium.launch(headless=True)
    c = b.new_context(**ctx_kwargs)
    return b, c, c.new_page()


def _is_login_page(page, requested_url: str):
    """
    Признак того, что нас редиректнуло на логин.

    Возвращает строку-причину или None.
    """
    if "/login" in page.url and "/login" not in requested_url:
        return f"redirect -> {page.url}"
    try:
        ok = page.evaluate("""
            () => {
                if (document.querySelector('input[name="login"]')) return true;
                if (document.querySelector('form[action="/session"]')) return true;
                const h1 = document.querySelector('h1');
                return !!(h1 && /sign in to github/i.test(h1.textContent || ''));
            }
        """)
        return "login form" if ok else None
    except Exception:
        return None