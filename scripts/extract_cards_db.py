import pypdf
import json
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

reader = pypdf.PdfReader(r"c:\BumjiJob\JiuTianArcana\คู่มือไพ่เทพจีน v4.pdf")

cards = []

def clean_spaces(text):
    if not text:
        return ""
    # Remove excessive spaces between individual characters if inserted by pypdf
    # e.g. "จ ิ ว เ ท ีย น" -> "จิ่วเทียน"
    text = re.sub(r'(?<=\S)\s(?=\S)', '', text)
    return text.strip()

for page_idx in range(4, 98):
    card_id = page_idx - 3
    page = reader.pages[page_idx]
    text = page.extract_text()
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    
    # Detect element from Chinese character on page
    element = "ไม่ระบุ"
    if "( ⽔ )" in text or "( 水 )" in text or "น  า" in text or "(水)" in text:
        element = "ธาตุน้ำ (Water)"
    elif "( 火 )" in text or "ไ ฟ" in text or "(火)" in text:
        element = "ธาตุไฟ (Fire)"
    elif "( 土 )" in text or "ด ิน" in text or "(土)" in text:
        element = "ธาตุดิน (Earth)"
    elif "( 金 )" in text or "ท อ ง" in text or "(金)" in text:
        element = "ธาตุทอง (Metal)"
    elif "( ⽊ )" in text or "ไ ม ้" in text or "(木)" in text:
        element = "ธาตุไม้ (Wood)"
        
    cards.append({
        'id': card_id,
        'page': page_idx + 1,
        'element': element,
        'raw_text': text
    })

print(f"Parsed {len(cards)} cards.")
# Print sample elements
for c in cards[:22]:
    print(f"Card #{c['id']} (Page {c['page']}): {c['element']}")
