from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch(headless=False)
    c = b.new_context()
    pg = c.new_page()
    pg.goto("https://github.com/login")
    input("Залогиньтесь в открытом окне и нажмите Enter…")
    c.storage_state(path="auth.json")
    b.close()
