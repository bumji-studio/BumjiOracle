import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r"c:\BumjiJob\JiuTianArcana\scratch\parsed_raw_pdf.json", "r", encoding="utf-8") as f:
    cards_data = json.load(f)

for card in cards_data[:3] + cards_data[22:25] + cards_data[-2:]:
    print(f"================ ID {card['card_id']} (Page {card['page']}) ================")
    print("LINES:")
    for line in card['lines']:
        print("  *", line)
