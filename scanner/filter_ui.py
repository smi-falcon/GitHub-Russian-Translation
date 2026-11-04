#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
filter_ui.py — оставляет в to_translate.json только РЕАЛЬНЫЙ UI-текст GitHub.

Отбрасывает:
  • служебные ключи _possibly_filtered_*
  • числа, размеры, проценты, даты, SHA, URL, email
  • не-латинские скрипты (CJK, арабский)
  • счётчики «X users starred this repository», «X stars today»
  • имена спонсоров «Sponsor X», «Unstar X»
  • описания репо (> 80 символов, точка в конце, — em-dash)
  • имена людей («Name Name's headshot»)
  • названия моделей / AI (Anthropic Claude, OpenAI GPT, Google Gemini, xAI Grok, Kimi, Microsoft MAI)
  • chart-обрывки («Line chart with...», «bar series», «Highcharts»)
  • keyboard shortcuts («control X», «alt X», «shift X»)
  • язык-процент («X: 12,5 %»)
  • короткие служебные слова (and, or, of, to, in, the, a, of 2)
  • names из 'Topic: X'"
"""
import json
import re
from pathlib import Path


_SERVICE_KEYS = lambda k: k.startswith("_")

_NOISE_RX = [
    re.compile(r"^[\d\s,\.%+\-kKmMbBgGhHrR]+$"),                     # 33,876 / 1.7K / 0.49 GB-hr / 4.2K+
    re.compile(r"^[\d,]+\s+(users?\s+starred|stars?\s+today|USD|GB-hr)"),  # 33876 users starred...
    re.compile(r"\bstars?\s+today\b", re.I),
    re.compile(r"\busers?\s+starred\b", re.I),
    re.compile(r"^Sponsor\s+", re.I),
    re.compile(r"^(Un)?[Ss]tar\s+"),
    re.compile(r"^(Star|Unstar|Watch|Unwatch|Fork|Unfork)\b"),
    re.compile(r"^@[\w-]+$"),                                         # @username
    re.compile(r"^[\w.-]+/[\w.-]+$"),                                 # owner/repo
    re.compile(r"^\w+/\s*$"),                                         # "Ahmad Awais/"
    re.compile(r"^[\w.-]+@[\w.-]+\.\w+$"),                            # email
    re.compile(r"^https?://"),
    re.compile(r"^[a-f0-9]{7,40}$"),                                  # SHA
    re.compile(r"^#\d+$"),                                            # #123

    # Chart / Highcharts
    re.compile(r"^(Line|Bar|Column|Interactive)\s+chart", re.I),
    re.compile(r"\bbar series\b", re.I),
    re.compile(r"\bdata points?\b", re.I),
    re.compile(r"Highcharts", re.I),
    re.compile(r"^Navigator\s+\d", re.I),

    # Keyboard shortcuts
    re.compile(r"^(alt|shift|control|ctrl|cmd|meta)\s+", re.I),
    re.compile(r"^(Control|Alt|Shift)\s*\+\s*", re.I),

    # Язык с процентом
    re.compile(r"^[\w+#.]+\s*:\s*\d+[,.]\d+\s*%$"),

    # Месяц / дата
    re.compile(r"^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b", re.I),
    re.compile(r"^\w+\s+\d{1,2}(-\d{1,2})?$"),
    re.compile(r"^\d{1,2}[-–]\d{1,2}$"),

    # Модели AI
    re.compile(r"^(Anthropic|OpenAI|Google|Microsoft|xAI|Kimi)\s+\S+", re.I),

    # Описание репо (типичные маркеры)
    re.compile(r"—\s"),                                               # em-dash
    re.compile(r"\.\s*$"),                                            # точка в конце длинной строки
    re.compile(r"'s headshot\."),
    re.compile(r"^(Read more about|Read our|Learn more about|Learn how to)\b"),

    # Служебные короткие
    re.compile(r"^(and|or|of|to|in|the|a|with|for|on|at|by|is|as|that|this|these|those|from|of \d+|,|\.|;|:|\(|\))$", re.I),

    # Прочее очевидное
    re.compile(r"^Topic:\s"),
    re.compile(r"^Read more about"),
]

# UI-маркеры, которые почти всегда полезны (переопределяют фильтр выше)
_UI_HINTS = [
    re.compile(r"\b(button|banner|dialog|placeholder|dropdown|toggle|checkbox|label|header|footer|sidebar)\b", re.I),
    re.compile(r"\b(Sign in|Sign out|Sign up|Log in|Log out|Next|Previous|Continue|Cancel|Save|Delete|Edit|Create|Update|Remove|Add)\b"),
    re.compile(r"\b(notification|notifications|repository|repositories|pull request|issue|commit|branch|fork)\b", re.I),
]


def is_ui(k: str, v) -> tuple[bool, str]:
    # СНАЧАЛА служебное — до работы с v
    if not isinstance(k, str) or _SERVICE_KEYS(k):
        return False, "service key / not string"

    # теперь безопасно работать с v
    if isinstance(v, str) and v.strip():
        if not re.match(r"^\d", v) and len(v) < 200:
            return True, ""

    # если v — не строка (int, list) — пропускаем
    if not isinstance(v, str):
        return False, "value not string"

    # не-латиница
    if not re.match(r"^[\x00-\x7F]*$", k):
        return False, "non-latin"

    if len(k) > 100:
        return False, "too long (description)"

    for rx in _UI_HINTS:
        if rx.search(k):
            return True, "ui-hint"

    for rx in _NOISE_RX:
        if rx.match(k):
            return False, f"noise: {rx.pattern[:30]}"

    return True, ""


def main():
    src = json.loads(Path("to_translate.json").read_text(encoding="utf-8"))

    clean = {}
    dropped = {}
    dropped_samples = {}

    for k, v in src.items():
        ok, reason = is_ui(k, v)
        if ok:
            clean[k] = v
        else:
            dropped[reason] = dropped.get(reason, 0) + 1
            dropped_samples.setdefault(reason, []).append(k)

    Path("to_translate_ui.json").write_text(
        json.dumps(clean, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    print(f"Было:      {len(src)}")
    print(f"Оставлено: {len(clean)}")
    print(f"Отброшено: {len(src) - len(clean)}")
    print()
    print("Причины отбрасывания:")
    for r, n in sorted(dropped.items(), key=lambda x: -x[1])[:15]:
        print(f"  {r}: {n}")
    print(f"\n→ to_translate_ui.json ({len(clean)} ключей)")


if __name__ == "__main__":
    main()