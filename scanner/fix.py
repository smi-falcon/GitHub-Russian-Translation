#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
fix.py — безопасно вливает переводы из to_translate.json в userscript.

НЕ перезаписывает существующие значения (кроме явно повторяющихся).
Форматирует как «// v6.N — auto-applied» блок в конце exactTranslations.

Использование:
    python fix.py --script "GitHub Russian Translation.js" \
                  --todo to_translate.json --apply
    python fix.py --script ... --todo ... --dry-run     # показать, что будет вставлено
"""
import argparse, json, re
from pathlib import Path


def find_exact_translations_block(src: str) -> tuple[int, int]:
    """Возвращает [start, end) — позицию содержимого `{ ... }`."""
    m = re.search(r'exactTranslations\s*=\s*\{', src)
    if not m:
        raise SystemExit("exactTranslations не найден в файле")
    start = m.end()
    depth = 1
    i = start
    in_str = False
    q = ""
    while i < len(src):
        ch = src[i]
        if in_str:
            if ch == '\\': i += 2; continue
            if ch == q: in_str = False
        else:
            if ch in ('"', "'"): in_str = True; q = ch
            elif ch == '{': depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    return (start, i)
        i += 1
    raise SystemExit("Не найден закрывающий } для exactTranslations")


def get_existing_keys(block: str) -> set[str]:
    return {m.group(1) for m in re.finditer(r'["\']([^"\']+)["\']\s*:', block)}


def js_quote(s: str) -> str:
    """Правильное экранирование строки в JS."""
    return json.dumps(s, ensure_ascii=False)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--script", required=True)
    ap.add_argument("--todo", default="to_translate.json")
    ap.add_argument("--version", default="", help="например, 6.7 — попадёт в комментарий")
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--out", default="")
    args = ap.parse_args()

    script_path = Path(args.script)
    src = script_path.read_text(encoding="utf-8")
    start, end = find_exact_translations_block(src)
    block = src[start:end]
    existing = get_existing_keys(block)

    todo = json.loads(Path(args.todo).read_text(encoding="utf-8"))
    to_add = {k: v for k, v in todo.items()
              if not k.startswith("_") and isinstance(v, str) and v.strip()}
    skipped_empty = [k for k, v in todo.items() if not v.strip()]
    overwrite = [k for k in to_add if k in existing]

    print(f"Всего в to_translate.json: {len(todo)}")
    print(f"С непустым переводом: {len(to_add)}")
    print(f"Пустых (пропущены): {len(skipped_empty)}")
    print(f"Уже в словаре (не перезаписываем): {len(overwrite)}")

    if not to_add:
        print("\nНечего вставлять.")
        return

    # Формируем блок
    header = f"        // === fix.py applied {args.version or ''} ==="
    lines = [header]
    for en in sorted(to_add):
        if en in existing:
            continue
        ru = to_add[en]
        lines.append(f"        {js_quote(en)}: {js_quote(ru)},")

    block_to_insert = "\n" + "\n".join(lines) + "\n"

    if args.dry_run:
        print("\n--- будет вставлено ---")
        print(block_to_insert)
        return

    if not args.apply:
        print("Запустите с --apply, чтобы записать.")
        return

    # Вставляем перед закрывающей } (в позицию end)
    new_src = src[:start] + block + block_to_insert + src[end:]

    # Обновляем версию если задана
    if args.version:
        new_src = re.sub(
            r'(@version\s+)[\d.]+',
            rf'\g<1>{args.version}',
            new_src,
            count=1
        )

    out_path = Path(args.out) if args.out else script_path
    out_path.write_text(new_src, encoding="utf-8")
    print(f"\n✓ Записано в {out_path}: +{len([l for l in lines if l.endswith(',')])} строк")


if __name__ == "__main__":
    main()