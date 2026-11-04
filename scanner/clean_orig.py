#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
clean_orig.py — фильтрует to_add_from_orig.json, оставляя только
пригодные для добавления ключи.

Отбрасывает:
  • обрывки (leading/trailing space, lowercase начало)
  • контракции "ll ", "re ", "s ", "t ", "ve ", "d ", "m "
  • опечатки ("май", "спосок", латинские буквы в русских словах)
  • фрагменты с "..." / лишние кавычки
  • repo-specific (GitHubRussianTranslation)
  • слишком короткое (<3) или слишком длинное (>250)
  • похожее на SHA / path / URL
"""
import json
import re
from pathlib import Path


_CONTRACTION = re.compile(r"^(ll|re|s|t|ve|d|m)\s", re.I)
_LATIN_IN_RU = re.compile(r"[а-яёА-ЯЁ][cCkKeEoOpPxXaA][а-яёА-ЯЁ]")  # "Cпросить", "cпособ"
_PATH_LIKE = re.compile(r"^[\w.-]+/[\w.-]+$")
_SHA_LIKE = re.compile(r"^[a-f0-9]{7,40}$")
_URL_LIKE = re.compile(r"^https?://")


def is_clean(key: str, val: str) -> tuple[bool, str]:
    k = key
    v = val

    if not isinstance(k, str) or not isinstance(v, str):
        return False, "not a string"

    if k != k.strip():
        return False, "leading/trailing space (fragment)"
    if _CONTRACTION.match(k):
        return False, "contraction piece"
    if len(k) < 3:
        return False, "too short"
    if len(k) > 250:
        return False, "too long"
    if len(v) > 400:
        return False, "val too long"

    # Обрывки с началом lowercase
    if k[0].islower() and len(k) < 40 and not k.endswith((".", ":", "!", "?")):
        return False, "lowercase short (fragment)"

    # Специфичные для repo
    if "GitHubRussianTranslation" in k:
        return False, "repo-specific"

    # Похоже на идентификатор
    if _PATH_LIKE.match(k):
        return False, "looks like path"
    if _SHA_LIKE.match(k):
        return False, "looks like SHA"
    if _URL_LIKE.match(k):
        return False, "looks like URL"

    # Известные опечатки / ошибки в v1.87
    if re.search(r"\bмай\b", v):
        return False, "typo: 'май' (may)"
    if "спосок" in v:
        return False, "typo: 'спосок'"
    if _LATIN_IN_RU.search(v) and not re.search(r"\bAPI\b|\bSSH\b|\bURL\b|\bHTML\b", v):
        return False, "latin letter inside russian word"

    # Ключ с ведущим/хвостовым многоточием, с ... в середине
    if k.startswith(("...", ". ")) or k.endswith(("...", " ..", " .")):
        return False, "ellipsis fragment"

    # Голый знак препинания / эмодзи
    if len(k) <= 3 and not any(c.isalpha() for c in k):
        return False, "punctuation only"

    return True, ""


def main():
    src_path = Path("to_add_from_orig.json")
    src = json.loads(src_path.read_text(encoding="utf-8"))

    clean = {}
    reasons = {}
    dropped_samples = {}

    for k, v in src.items():
        ok, reason = is_clean(k, v)
        if ok:
            clean[k] = v
        else:
            reasons[reason] = reasons.get(reason, 0) + 1
            dropped_samples.setdefault(reason, []).append((k, v))

    Path("to_add_clean.json").write_text(
        json.dumps(clean, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    print(f"Было:      {len(src)}")
    print(f"Оставлено: {len(clean)}")
    print(f"Отброшено: {len(src) - len(clean)}")
    print()

    print("Причины отбрасывания:")
    for r, n in sorted(reasons.items(), key=lambda x: -x[1]):
        print(f"  {r}: {n}")

    print(f"\nПримеры отброшенного (по 3 шт.):")
    for r, samples in dropped_samples.items():
        print(f"\n  [{r}]")
        for k, _ in samples[:3]:
            print(f"    ✗ {k!r}")

    print(f"\n→ to_add_clean.json ({len(clean)} ключей)")


if __name__ == "__main__":
    main()