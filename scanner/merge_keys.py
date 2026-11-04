#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
merge_keys.py — находит ключи в .orig, которых нет в текущем .js,
и сохраняет их в to_add_from_orig.json для последующего fix.py.

Использование:
    python scanner/merge_keys.py
    python scanner/merge_keys.py --orig path/to/orig --js path/to/js --out out.json
"""
import argparse
import json
import re
from pathlib import Path


def read_text_any(path: str) -> str:
    """Пробует несколько кодировок — чтобы не падать на PS-редиректе."""
    p = Path(path)
    raw = p.read_bytes()
    for enc in ("utf-8-sig", "utf-8", "utf-16", "utf-16-le", "utf-16-be", "cp1251"):
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            continue
    # последний шанс — заменить битые байты
    return raw.decode("utf-8", errors="replace")


def detect_encoding(path: str) -> str:
    raw = Path(path).read_bytes()
    if raw[:3] == b'\xef\xbb\xbf':
        return 'utf-8-sig'
    if raw[:2] in (b'\xff\xfe', b'\xfe\xff'):
        return 'utf-16'
    return 'utf-8'


def extract_dict(src: str, name: str) -> dict[str, str]:
    """Извлечь {ключ: значение} из `name = { ... }` в JS."""
    m = re.search(rf'{re.escape(name)}\s*=\s*\{{', src)
    if not m:
        return {}
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

    result = {}
    for m in re.finditer(
        r'["\']([^"\'\\]+)["\']\s*:\s*["\']((?:[^"\'\\]|\\.)*)["\']',
        body,
    ):
        result[m.group(1)] = m.group(2)
    return result


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--orig", default="Userscript/GitHub Russian Translation.js.orig")
    ap.add_argument("--js",   default="Userscript/GitHub Russian Translation.js")
    ap.add_argument("--out",  default="to_add_from_orig.json")
    ap.add_argument("--dict", default="exactTranslations")
    args = ap.parse_args()

    print(f"Кодировка .orig: {detect_encoding(args.orig)}")
    print(f"Кодировка .js:   {detect_encoding(args.js)}")

    orig_src = read_text_any(args.orig)
    js_src   = read_text_any(args.js)

    orig = extract_dict(orig_src, args.dict)
    new  = extract_dict(js_src,   args.dict)

    print(f"Оригинал: {len(orig)} ключей")
    print(f"Твой .js: {len(new)} ключей")

    missing = {k: v for k, v in orig.items() if k not in new}
    extra   = {k: v for k, v in new.items() if k not in orig}

    print(f"Отсутствует в твоём: {len(missing)}")
    print(f"Уникально в твоём:   {len(extra)}")

    if missing:
        Path(args.out).write_text(
            json.dumps(missing, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        print(f"\n→ {args.out}: {len(missing)} ключей для fix.py")

        print("\nПервые 30 отсутствующих:")
        for k in list(missing)[:30]:
            print(f"  {k!r}: {missing[k]!r}")
        print()

        # Отдельно — ключи Watch-дропдауна (для контроля)
        watch_keys = [k for k in missing
                      if any(w in k.lower() for w in
                             ("watch", "participat", "activity",
                              "ignor", "mention"))]
        if watch_keys:
            print(f"Из них про Watch-дропдаун: {len(watch_keys)}")
            for k in watch_keys:
                print(f"  ✓ {k!r}: {missing[k]!r}")
    else:
        print("\nНечего добавлять — все ключи оригинала уже в твоём .js")


if __name__ == "__main__":
    main()