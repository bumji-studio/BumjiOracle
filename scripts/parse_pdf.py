import pymupdf
import json
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

os.makedirs(r"c:\BumjiJob\JiuTianArcana\scratch", exist_ok=True)
pdf_path = r"c:\BumjiJob\JiuTianArcana\คู่มือไพ่เทพจีน v4.pdf"
doc = pymupdf.open(pdf_path)

cards_data = []

# Map page index to Card ID (Page 5 -> Card 1, Page 6 -> Card 2, ... Page 98 -> Card 94)
for page_idx in range(4, 98):
    card_id = page_idx - 3
    page_text = doc[page_idx].get_text()
    lines = [l.strip() for l in page_text.split('\n') if l.strip()]
    
    cards_data.append({
        'page': page_idx + 1,
        'card_id': card_id,
        'lines': lines,
        'full_text': page_text
    })

output_file = r"c:\BumjiJob\JiuTianArcana\scratch\parsed_raw_pdf.json"
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(cards_data, f, ensure_ascii=False, indent=2)

print(f"[SUCCESS] Extracted {len(cards_data)} pages from PDF into scratch/parsed_raw_pdf.json")
