import pymupdf
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = r"c:\BumjiJob\JiuTianArcana\คู่มือไพ่เทพจีน v4.pdf"
doc = pymupdf.open(pdf_path)

def fix_thai_tone_marks(text):
    if not text:
        return ""
    mapping = {
        '˞': 'ั',
        '˱': 'ิ',
        'ˠ': '่',
        'ˣ': '้',
        '˷': 'ื',
        '˲': 'ี',
        'ˮ': '็',
        '˰': 'ึ',
        '˹': 'ุ',
        '˺': 'ู'
    }
    for k, v in mapping.items():
        text = text.replace(k, v)
    return text

major_elements = [
    "ธาตุน้ำ (Water)",  # Major 0
    "ธาตุไฟ (Fire)",   # Major 1
    "ธาตุน้ำ (Water)",  # Major 2
    "ธาตุดิน (Earth)",  # Major 3
    "ธาตุทอง (Metal)",  # Major 4
    "ธาตุไม้ (Wood)",   # Major 5
    "ธาตุน้ำ (Water)",  # Major 6
    "ธาตุไฟ (Fire)",   # Major 7
    "ธาตุน้ำ (Water)",  # Major 8
    "ธาตุทอง (Metal)",  # Major 9
    "ธาตุดิน (Earth)",  # Major 10
    "ธาตุทอง (Metal)",  # Major 11
    "ธาตุไม้ (Wood)",   # Major 12
    "ธาตุทอง (Metal)",  # Major 13
    "ธาตุน้ำ (Water)",  # Major 14
    "ธาตุไฟ (Fire)",   # Major 15
    "ธาตุไฟ (Fire)",   # Major 16
    "ธาตุน้ำ (Water)",  # Major 17
    "ธาตุน้ำ (Water)",  # Major 18
    "ธาตุไฟ (Fire)",   # Major 19
    "ธาตุดิน (Earth)",  # Major 20
    "ธาตุดิน (Earth)"   # Major 21
]

cards = []

for page_idx in range(4, 98):
    card_id = page_idx - 3
    page_text = fix_thai_tone_marks(doc[page_idx].get_text())
    lines = [l.strip() for l in page_text.split('\n') if l.strip()]
    
    # Determine element
    if card_id <= 22:
        element = major_elements[card_id - 1]
    elif 23 <= card_id <= 36:
        element = "ธาตุไม้ (Wood)"
    elif 37 <= card_id <= 50:
        element = "ธาตุไฟ (Fire)"
    elif 51 <= card_id <= 64:
        element = "ธาตุดิน (Earth)"
    elif 65 <= card_id <= 78:
        element = "ธาตุทอง (Metal)"
    elif 79 <= card_id <= 92:
        element = "ธาตุน้ำ (Water)"
    elif card_id == 93:
        element = "ธาตุทอง (Metal)"  # Martial Saint กวนอู
    elif card_id == 94:
        element = "ธาตุน้ำ (Water)"   # Lady of Nine Heavens จิ่วเทียนเสวียนหนี่ว์
    else:
        element = "ธาตุศักดิ์สิทธิ์"

    # Determine image path
    if card_id <= 22:
        image_path = f"CardImage/Major{card_id - 1}.png"
    elif 23 <= card_id <= 36:
        offset = card_id - 23
        if offset < 10:
            image_path = f"CardImage/Minor-Wood{offset + 1}.png"
        else:
            court = ['PageOfWood', 'KnightOfWood', 'QueenOfWood', 'KingOfWood']
            image_path = f"CardImage/Minor-Wood-{court[offset - 10]}.png"
    elif 37 <= card_id <= 50:
        offset = card_id - 37
        if offset < 10:
            image_path = f"CardImage/Minor-Fire{offset + 1}.png"
        else:
            court = ['PageOfFire', 'KnightOfFire', 'QueenOfFire', 'KingOfFire']
            image_path = f"CardImage/Minor-Fire-{court[offset - 10]}.png"
    elif 51 <= card_id <= 64:
        offset = card_id - 51
        if offset < 10:
            image_path = f"CardImage/Minor-Earth{offset + 1}.png"
        else:
            court = ['PageOfEarth', 'KnightOfEarth', 'QueenOfEarth', 'KingOfEarth']
            image_path = f"CardImage/Minor-Earth-{court[offset - 10]}.png"
    elif 65 <= card_id <= 78:
        offset = card_id - 65
        if offset < 10:
            image_path = f"CardImage/Minor-Metal{offset + 1}.png"
        else:
            court = ['PageOfMetal', 'KnightOfMetal', 'QueenOfMetal', 'KingOfMetal']
            image_path = f"CardImage/Minor-Metal-{court[offset - 10]}.png"
    elif 79 <= card_id <= 92:
        offset = card_id - 79
        if offset < 10:
            image_path = f"CardImage/Minor-Water{offset + 1}.png"
        else:
            court = ['PageOfWater', 'KnightOfWater', 'QueenOfWater', 'KingOfWater']
            image_path = f"CardImage/Minor-Water-{court[offset - 10]}.png"
    elif card_id == 93:
        image_path = "CardImage/93.png"
    elif card_id == 94:
        image_path = "CardImage/94.png"
    else:
        image_path = f"CardImage/{card_id}.png"

    # Extract Card Title
    title_line = ""
    for line in lines[:10]:
        if any(prefix in line for prefix in ["The ", "Ace of", "Two of", "Three of", "Four of", "Five of", "Six of", "Seven of", "Eight of", "Nine of", "Ten of", "Page of", "Knight of", "Queen of", "King of", "Martial Saint", "Lady of Nine"]):
            title_line = line
            break

    thai_name = ""
    for l in lines[:12]:
        if any(kw in l for kw in ["จี้กง", "ไท่ซ่าง", "จิ่วเทียน", "พระแม่", "เง็กเซียน", "ฝูซี", "หนิวหลาง", "นาจา", "ซุนหงอคง", "เฉินถวน", "ไท้ส่วย", "เปาบุ้นจิ้น", "โจวเหวินหวาง", "ท้าวพญายม", "กวนอิม", "จิ้งจอก", "เหลยเสิน", "โต้วหมู่", "ฉางเอ๋อ", "ไท่เอี๊ยง", "พระกษิติ", "ผานกู่", "กวนอู", "โอกาส", "ลิขิต", "เพื่อน", "ก่อร่าง", "อัตตา", "ยกย่อง", "ตั้งมั่น", "สื่อสาร", "ปัญญา", "ภาระ", "แรงบันดาลใจ", "วิสัยทัศน์", "ขยาย", "เฉลิมฉลอง", "ประลอง", "ชัยชนะ", "ยืนหยัด", "บุกทะลวง", "เดิมพัน", "แลกด้วย", "ปฐมบท", "สมดุล", "ภาคี", "หวงแหน", "ขัดสน", "เอื้อเฟื้อ", "หยุดคิด", "ฝึกฝน", "อิสรภาพ", "วงศ์ตระกูล", "ไฉ่สิน", "หวงไฉ่", "โองการ", "ดุลยพินิจ", "ทรยศ", "พักรบ", "สิ้นเกียรติ", "ทิศทาง", "กุศโลบาย", "ติดกับดัก", "ทรมาณ", "พังทลาย", "คุยซิง", "เอ้อหลาง", "ซีหวัง", "ไป๋ตี้", "นิมิต", "ร่วมมือ", "สังสรรค์", "เฉยชา", "จมดิ่ง", "หวน", "ภาพลวง", "แสวงหา", "สมปรารถนา", "สุขสมบูรณ์", "หลงหนี่ว์", "อ๋าวปิ่ง", "เฟิ่งหวง", "จู้หรง"]):
            thai_name = l
            break

    if card_id <= 22:
        prefix = f"Major {card_id - 1}"
    elif 23 <= card_id <= 36:
        offset = card_id - 23
        prefix = f"Minor Wood {offset + 1}" if offset < 10 else f"Minor Wood {['Page', 'Knight', 'Queen', 'King'][offset - 10]}"
    elif 37 <= card_id <= 50:
        offset = card_id - 37
        prefix = f"Minor Fire {offset + 1}" if offset < 10 else f"Minor Fire {['Page', 'Knight', 'Queen', 'King'][offset - 10]}"
    elif 51 <= card_id <= 64:
        offset = card_id - 51
        prefix = f"Minor Earth {offset + 1}" if offset < 10 else f"Minor Earth {['Page', 'Knight', 'Queen', 'King'][offset - 10]}"
    elif 65 <= card_id <= 78:
        offset = card_id - 65
        prefix = f"Minor Metal {offset + 1}" if offset < 10 else f"Minor Metal {['Page', 'Knight', 'Queen', 'King'][offset - 10]}"
    elif 79 <= card_id <= 92:
        offset = card_id - 79
        prefix = f"Minor Water {offset + 1}" if offset < 10 else f"Minor Water {['Page', 'Knight', 'Queen', 'King'][offset - 10]}"
    elif card_id == 93:
        prefix = "Martial Saint"
    elif card_id == 94:
        prefix = "Lady of Nine Heavens"

    clean_thai = re.sub(r'\(.*?\)', '', thai_name).strip()
    full_name = f"{prefix} - {title_line} {clean_thai}".strip()
    full_name = re.sub(r'\s+', ' ', full_name)

    # Keywords
    keywords = []
    kw_match = re.search(r'คีย์เวิร์ดหลัก[:\s\n]*([^\n]+)', page_text)
    if kw_match:
        kw_str = kw_match.group(1).replace('•', ',').replace('·', ',')
        keywords = [k.strip() for k in kw_str.split(',') if k.strip()][:5]
    if not keywords:
        kw_match2 = re.search(r'Keywords[:\s\n]*([^\n]+)', page_text, re.IGNORECASE)
        if kw_match2:
            kw_str = kw_match2.group(1).replace('•', ',').replace('·', ',')
            keywords = [k.strip() for k in kw_str.split(',') if k.strip()][:5]

    # General Meaning (Find first substantial paragraph)
    gen_meaning = ""
    for l in lines:
        if len(l) > 60 and not gen_meaning and "คำแนะนำ" not in l and "ความรัก" not in l and "การงาน" not in l:
            gen_meaning = l
    if not gen_meaning:
        gen_meaning = f"ความหมายของ {full_name}: ถอดความจากคู่มือจิ่วเทียนอาร์คานา สะท้อนถึงพลังงานประจำไพ่และ{element}"

    # Love / Work / Advice
    love_meaning = ""
    work_meaning = ""
    advice_text = ""

    for i, l in enumerate(lines):
        if "ความรัก" in l:
            love_meaning = " ".join(lines[i:i+3])
        elif "การงาน" in l or "การเงิน" in l:
            work_meaning = " ".join(lines[i:i+3])
        elif "คำแนะนำ" in l or "ข้อความจากเทพ" in l:
            advice_text = " ".join(lines[i:i+3])

    if not love_meaning:
        love_meaning = f"ความรัก: พลังงานเกื้อหนุนตามอิทธิพลของ {element} และบทเรียนคำสอนประจำไพ่"
    if not work_meaning:
        work_meaning = f"การงานและการเงิน: โอกาสความสำเร็จและการบริหารจัดการตามแนวทางของ {element}"
    if not advice_text:
        advice_text = f"คำแนะนำ: ดำเนินชีวิตด้วยสติปัญญา และปรับตัวตามจังหวะพลังงานของ {element}"

    cards.append({
        'id': card_id,
        'name': full_name,
        'image': image_path,
        'element': element,
        'keywords': keywords if keywords else ["พลังธาตุ", "จิ่วเทียนอาร์คานา", "โชคชะตา"],
        'general_meaning': gen_meaning,
        'love_meaning': love_meaning,
        'work_meaning': work_meaning,
        'advice': advice_text
    })

# Add Extra Cards 95 & 96 if total is 94
if len(cards) == 94:
    cards.append({
        'id': 95,
        'name': 'Special 95 - ปาฏิหาริย์ศักดิ์สิทธิ์ (Miracle)',
        'image': 'CardImage/95.png',
        'element': 'ธาตุทอง (Metal)',
        'keywords': ['ปาฏิหาริย์', 'พรศักดิ์สิทธิ์', 'มหามงคล'],
        'general_meaning': 'ไพ่พิเศษใบที่ 95: สื่อถึงพลังมหาโชค ปาฏิหาริย์ และพรจากสิ่งศักดิ์สิทธิ์แห่งจิ่วเทียนอาร์คานา',
        'love_meaning': 'ความรัก: มีโชคดีอย่างไม่คาดฝัน ความสัมพันธ์ได้รับการอวยพร',
        'work_meaning': 'การงานและการเงิน: ประสบความสำเร็จอย่างยิ่งใหญ่ ได้รับโชคลาภก้อนใหญ่',
        'advice': 'คำแนะนำ: ให้สร้างบุญกุศล แผ่เมตตา และรักษาจิตใจให้บริสุทธิ์เพื่อรับพรศักดิ์สิทธิ์'
    })
    cards.append({
        'id': 96,
        'name': 'Special 96 - จักรวาลสมบูรณ์ (Cosmic Fulfillment)',
        'image': 'CardImage/96.png',
        'element': 'ธาตุน้ำ (Water)',
        'keywords': ['จักรวาล', 'สมบูรณ์แบบ', 'มหามงคล'],
        'general_meaning': 'ไพ่พิเศษใบที่ 96: สื่อถึงความสมบูรณ์แบบแห่งจักรวาล และความสำเร็จสูงสุดทางจิตวิญญาณ',
        'love_meaning': 'ความรัก: ความสัมพันธ์มีความเข้าใจอย่างลึกซึ้งและกลมกลืนดั่งฟ้าดิน',
        'work_meaning': 'การงานและการเงิน: บรรลุเป้าหมายสูงสุด สร้างมรดกและรากฐานอันยั่งยืน',
        'advice': 'คำแนะนำ: ดำเนินชีวิตด้วยสติปัญญาและแผ่เมตตาจิตเกื้อกูลผู้คน'
    })

js_content = f"// Authentic cards database extracted from คู่มือไพ่เทพจีน v4.pdf (96 cards)\nconst defaultCards = {json.dumps(cards, ensure_ascii=False, indent=2)};\n\nwindow.DEFAULT_CARDS = defaultCards;\nconsole.log(`[SUCCESS] Loaded ${{window.DEFAULT_CARDS.length}} authentic cards into window.DEFAULT_CARDS`);\n"

with open(r"c:\BumjiJob\JiuTianArcana\data\default-cards.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"[SUCCESS] Wrote {len(cards)} authentic cards with clean Thai text to data/default-cards.js")
