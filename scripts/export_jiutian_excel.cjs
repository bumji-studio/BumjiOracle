const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const jsonPath = path.join(__dirname, '..', 'JiuTianData', 'jiutian-cards.json');
if (!fs.existsSync(jsonPath)) {
  console.error('jiutian-cards.json not found!');
  process.exit(1);
}

const cards = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
console.log(`Loaded ${cards.length} cards from jiutian-cards.json`);

// Clean text helper (remove excessive newlines, trim)
function clean(str) {
  if (!str) return '';
  if (Array.isArray(str)) return str.join(', ');
  return String(str).replace(/\r\n/g, '\n').trim();
}

// Map cards to master columns
function formatMasterRow(c) {
  return {
    'ลำดับ (No.)': c.id,
    'รหัส/เลขไพ่': c.card_no,
    'หมวดหมู่ (Suit)': c.suit_name_th || c.type,
    'หมวดหมู่ (EN)': c.suit_name_en || c.type,
    'ชื่อไพ่เต็ม (Full Title)': clean(c.title),
    'ชื่อภาษาไทย': clean(c.name_th),
    'ชื่อภาษาอังกฤษ': clean(c.name_en),
    'ชื่อภาษาจีน': clean(c.name_cn),
    'ธาตุประจำตัว (Element)': clean(c.element),
    'คอนเซปต์หลัก (Concept)': clean(c.concept),
    'ความหมายหลัก (Core Meaning)': clean(c.core_meaning),
    'แก่นพลังและจิตวิญญาณ (Essence)': clean(c.essence),
    'สัญลักษณ์ในภาพ (Symbolism)': clean(c.symbolism),
    'กลยุทธ์และการนำไปใช้ (Strategy)': clean(c.strategy),
    'คำทำนาย: ภาพรวม': clean(c.reading_overview),
    'คำทำนาย: การงาน & ธุรกิจ': clean(c.reading_work),
    'คำทำนาย: การเงิน & โชคลาภ': clean(c.reading_finance),
    'คำทำนาย: ความรัก & ความสัมพันธ์': clean(c.reading_love),
    'คำทำนาย: สุขภาพ': clean(c.reading_health),
    'บุคลิกภาพ: ด้านสว่าง (Light)': clean(c.personality_light),
    'บุคลิกภาพ: ด้านเงา/ข้อควรระวัง (Shadow)': clean(c.personality_shadow),
    'คำแนะนำ/ข้อคิดเตือนใจ (Advice)': clean(c.advice),
    'คำยืนยันพลังบวก (Affirmation)': clean(c.affirmation),
    'อาชีพที่เหมาะสม (Careers)': clean(c.careers),
    'คำสำคัญ (Keywords)': Array.isArray(c.keywords) ? c.keywords.join(', ') : clean(c.keywords),
    'ประวัติและตำนานเทพเจ้า (Mythology)': clean(c.mythology),
    'ไฟล์รูปภาพ (Image)': clean(c.image)
  };
}

// Summary sheet row
function formatSummaryRow(c) {
  return {
    'ลำดับ (No.)': c.id,
    'หมวดหมู่': c.suit_name_th || c.type,
    'ชื่อไพ่': clean(c.name_th),
    'ชื่ออังกฤษ': clean(c.name_en),
    'ชื่อจีน': clean(c.name_cn),
    'ธาตุ': clean(c.element),
    'คอนเซปต์หลัก': clean(c.concept),
    'คำทำนายภาพรวม': clean(c.reading_overview),
    'คำแนะนำ': clean(c.advice),
    'คำยืนยันพลังบวก': clean(c.affirmation),
    'คีย์เวิร์ด': Array.isArray(c.keywords) ? c.keywords.join(', ') : clean(c.keywords)
  };
}

// Build workbook
const wb = XLSX.utils.book_new();

// Helper to set column widths
function setColWidths(ws, rows) {
  if (!rows || rows.length === 0) return;
  const colKeys = Object.keys(rows[0]);
  const colWidths = colKeys.map(key => {
    let maxLen = key.length;
    for (const r of rows) {
      const val = r[key];
      if (val !== undefined && val !== null) {
        // Sample first line length
        const firstLine = String(val).split('\n')[0];
        const len = Math.min(firstLine.length, 50);
        if (len > maxLen) maxLen = len;
      }
    }
    // Cap minimum and maximum
    return { wch: Math.max(Math.min(maxLen + 4, 60), 12) };
  });
  ws['!cols'] = colWidths;
}

// 1. Master Sheet: All 96 cards
const masterRows = cards.map(formatMasterRow);
const wsMaster = XLSX.utils.json_to_sheet(masterRows);
setColWidths(wsMaster, masterRows);
XLSX.utils.book_append_sheet(wb, wsMaster, 'ไพ่เทพจีน 96 ใบ (ทั้งหมด)');

// 2. Summary Sheet
const summaryRows = cards.map(formatSummaryRow);
const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
setColWidths(wsSummary, summaryRows);
XLSX.utils.book_append_sheet(wb, wsSummary, 'สรุปย่อ & คีย์เวิร์ด');

// 3. Major Arcana Sheet (Cards 1-22)
const majorCards = cards.filter(c => c.id >= 1 && c.id <= 22);
const majorRows = majorCards.map(formatMasterRow);
const wsMajor = XLSX.utils.json_to_sheet(majorRows);
setColWidths(wsMajor, majorRows);
XLSX.utils.book_append_sheet(wb, wsMajor, 'เมเจอร์ อาร์คานา (22 ใบ)');

// 4. Minor Suits & Special Sheets (Wood, Fire, Earth, Metal, Water, Special)
const suits = [
  { name: 'ธาตุไม้ (Wood 14 ใบ)', filter: c => c.type === 'wood' || (c.id >= 23 && c.id <= 36) },
  { name: 'ธาตุไฟ (Fire 14 ใบ)', filter: c => c.type === 'fire' || (c.id >= 37 && c.id <= 50) },
  { name: 'ธาตุดิน (Earth 14 ใบ)', filter: c => c.type === 'earth' || (c.id >= 51 && c.id <= 64) },
  { name: 'ธาตุทอง (Metal 14 ใบ)', filter: c => c.type === 'metal' || (c.id >= 65 && c.id <= 78) },
  { name: 'ธาตุน้ำ (Water 14 ใบ)', filter: c => c.type === 'water' || (c.id >= 79 && c.id <= 92) },
  { name: 'ไพ่พิเศษ (Special 4 ใบ)', filter: c => c.type === 'special' || c.id >= 93 }
];

for (const s of suits) {
  const filtered = cards.filter(s.filter);
  const rows = filtered.map(formatMasterRow);
  const ws = XLSX.utils.json_to_sheet(rows);
  setColWidths(ws, rows);
  XLSX.utils.book_append_sheet(wb, ws, s.name);
}

// 5. Element Info Sheet
const elementInfoRows = [
  { 'ธาตุ': 'ไม้ (Wood)', 'ความเกี่ยวข้อง & สัญลักษณ์': 'สิ่งที่เกี่ยวกับการศึกษา ความรู้เป็นหลัก เช่น นักเรียน นักศึกษา งานวิจัย งานเอกสาร ภาพลักษณ์ที่ดูฉลาดมีความรู้' },
  { 'ธาตุ': 'ไฟ (Fire)', 'ความเกี่ยวข้อง & สัญลักษณ์': 'เกี่ยวกับสิ่งที่ใช้ความเคลื่อนไหว เช่น นักกีฬา รถยนต์ นักแสดง ภาพลักษณ์ที่ดูดี' },
  { 'ธาตุ': 'ดิน (Earth)', 'ความเกี่ยวข้อง & สัญลักษณ์': 'เกี่ยวกับอสังหาริมทรัพย์ บ้าน เงิน สมบัติ ที่ดิน ภาพลักษณ์ที่ร่ำรวย' },
  { 'ธาตุ': 'ทอง (Metal)', 'ความเกี่ยวข้อง & สัญลักษณ์': 'เกี่ยวกับการตัดสินใจ ภาพลักษณ์ที่เฉียบคม Perfectionist' },
  { 'ธาตุ': 'น้ำ (Water)', 'ความเกี่ยวข้อง & สัญลักษณ์': 'เกี่ยวกับการเดินทาง อาชีพเกี่ยวกับน้ำ เกี่ยวกับจิตใจ การใช้inituition ภาพลักษณ์ที่ใจดี' }
];
const wsElement = XLSX.utils.json_to_sheet(elementInfoRows);
wsElement['!cols'] = [{ wch: 18 }, { wch: 90 }];
XLSX.utils.book_append_sheet(wb, wsElement, 'ข้อมูลธาตุ');

// 6. Spread 5 Cards Guide Sheet
const spread5Rows = [
  { 'ตำแหน่ง': 'ใบที่ 1', 'ชื่อตำแหน่ง': 'สถานการณ์ปัจจุบัน', 'หน้าที่ของไพ่': 'บอกสภาพที่เรื่องราวเป็นอยู่ ปัจจัยแวดล้อม และสิ่งที่กำลังเผชิญ', 'การวิเคราะห์ด้วยธาตุ': 'ดูว่าสถานการณ์ตั้งต้นมีแรงส่ง แรงต้าน หรือสภาวะคงตัวแบบใด' },
  { 'ตำแหน่ง': 'ใบที่ 2', 'ชื่อตำแหน่ง': 'ทางออก / วิธีการ / สิ่งที่ควรทำ', 'หน้าที่ของไพ่': 'เสนอแนวทาง การกระทำ หรือวิธีรับมือกับสถานการณ์', 'การวิเคราะห์ด้วยธาตุ': 'ดูว่าวิธีนี้ส่งเสริม ขัดกับ หรือพยายามควบคุมสถานการณ์ในใบที่ 1 อย่างไร (คู่ 1 ↔ 2)' },
  { 'ตำแหน่ง': 'ใบที่ 3', 'ชื่อตำแหน่ง': 'ผลลัพธ์หากทำตามใบที่ 2', 'หน้าที่ของไพ่': 'ผลที่อาจเกิดขึ้นเมื่อเลือกลงมือทำตามแนวทางที่แนะนำ', 'การวิเคราะห์ด้วยธาตุ': 'ตรวจว่าแนวทางในใบที่ 2 ส่งแรงไปสู่ผลลัพธ์ในใบที่ 3 ราบรื่นหรือมีแรงต้าน (คู่ 2 ↔ 3)' },
  { 'ตำแหน่ง': 'ใบที่ 4', 'ชื่อตำแหน่ง': 'ผลลัพธ์หากไม่ทำ / ทำไม่สำเร็จ', 'หน้าที่ของไพ่': 'ความเป็นไปได้ของอีกเส้นทางหนึ่ง เพื่อใช้เปรียบเทียบกับใบที่ 3', 'การวิเคราะห์ด้วยธาตุ': 'ดูแรงสนับสนุนหรือแรงต้านของเส้นทางที่ไม่ทำ เปรียบเทียบกับใบที่ 3 (คู่ 3 ↔ 4)' },
  { 'ตำแหน่ง': 'ใบที่ 5', 'ชื่อตำแหน่ง': 'แนวโน้มการตัดสินใจของผู้ถาม', 'หน้าที่ของไพ่': 'สะท้อนแนวโน้มว่าผู้ถามมีโอกาสเลือกทำตามแนวทางในใบที่ 2 หรือไม่', 'การวิเคราะห์ด้วยธาตุ': 'ดูความสอดคล้องระหว่างแนวโน้มใจกับวิธีแก้ไขและผลลัพธ์ (คู่ 2 ↔ 5 และ 5 ↔ 3,4)' }
];
const wsSpread5 = XLSX.utils.json_to_sheet(spread5Rows);
wsSpread5['!cols'] = [{ wch: 12 }, { wch: 32 }, { wch: 55 }, { wch: 65 }];
XLSX.utils.book_append_sheet(wb, wsSpread5, 'วิธีอ่านไพ่ 5 ใบ');

// 7. Spread 3 Cards Guide Sheet (5 Patterns)
const spread3Rows = [
  { 'แบบที่': 'แบบที่ 1', 'ชื่อรูปแบบ': 'อดีต — ปัจจุบัน — อนาคต', 'ใบที่ 1': 'อดีต (ที่มา/รากเหง้า)', 'ใบที่ 2': 'ปัจจุบัน (สภาวะขณะนี้)', 'ใบที่ 3': 'อนาคต (แนวโน้มข้างหน้า)', 'บริบทการใช้งาน': 'ใช้ดูพัฒนาการของเรื่อง ตั้งแต่สิ่งที่นำมาสู่สถานการณ์ปัจจุบัน ไปจนถึงแนวโน้มข้างหน้า' },
  { 'แบบที่': 'แบบที่ 2', 'ชื่อรูปแบบ': 'สถานการณ์ — อุปสรรค — ทางออก', 'ใบที่ 1': 'สถานการณ์ (สิ่งที่เผชิญ)', 'ใบที่ 2': 'อุปสรรค (จุดท้าทาย)', 'ใบที่ 3': 'ทางออก (วิธีจัดการ)', 'บริบทการใช้งาน': 'ใช้เมื่อผู้ถามต้องการเข้าใจปัญหาและหาทางจัดการ เหมาะกับเรื่องงาน ความสัมพันธ์ และการตัดสินใจ' },
  { 'แบบที่': 'แบบที่ 3', 'ชื่อรูปแบบ': 'สิ่งที่เกิดขึ้น — สิ่งที่ซ่อนอยู่ — แนวโน้มผลลัพธ์', 'ใบที่ 1': 'สิ่งที่เกิดขึ้น (เห็นชัดเจน)', 'ใบที่ 2': 'สิ่งที่ซ่อนอยู่ (เบื้องลึก/สิ่งที่มองข้าม)', 'ใบที่ 3': 'แนวโน้มผลลัพธ์ (ปลายทาง)', 'บริบทการใช้งาน': 'ใช้เจาะสถานการณ์ที่ยังไม่เข้าใจ เช่น อีกฝ่ายคิดอย่างไร หรือองค์กรกำลังดำเนินไปทิศทางใด' },
  { 'แบบที่': 'แบบที่ 4', 'ชื่อรูปแบบ': 'ตัวเลือก A — ตัวเลือก B — คำแนะนำ', 'ใบที่ 1': 'ตัวเลือก A (ทิศทางแรก)', 'ใบที่ 2': 'ตัวเลือก B (ทิศทางสอง)', 'ใบที่ 3': 'คำแนะนำ (ทางสายกลาง/การตัดสินใจ)', 'บริบทการใช้งาน': 'ใช้เมื่อผู้ถามต้องเลือกระหว่างสองแนวทาง โดยเปรียบเทียบข้อดี ข้อเสีย และความเสี่ยงร่วมกับคำแนะนำ' },
  { 'แบบที่': 'แบบที่ 5', 'ชื่อรูปแบบ': 'เงื่อนไข — กระบวนการ — ผลลัพธ์', 'ใบที่ 1': 'เงื่อนไข (ข้อกำหนดตั้งต้น)', 'ใบที่ 2': 'กระบวนการ (การดำเนินการ)', 'ใบที่ 3': 'ผลลัพธ์ (บทสรุปปลายทาง)', 'บริบทการใช้งาน': 'ใช้ดูว่าเรื่องหนึ่งจะดำเนินไปอย่างไร โดยเฉพาะคำถามเกี่ยวกับการสมัครงาน การเจรจา การอนุมัติ และการเปลี่ยนผ่าน' }
];
const wsSpread3 = XLSX.utils.json_to_sheet(spread3Rows);
wsSpread3['!cols'] = [{ wch: 10 }, { wch: 42 }, { wch: 25 }, { wch: 28 }, { wch: 30 }, { wch: 70 }];
XLSX.utils.book_append_sheet(wb, wsSpread3, 'วิธีอ่านไพ่ 3 ใบ');

// 8. Five Elements Relationship Guide Sheet
const elementRelationsRows = [
  { 'ประเภทความสัมพันธ์': 'วงจรส่งเสริม (相生)', 'คู่ธาตุ': 'ไม้ → ไฟ', 'สัญลักษณ์': 'ไม้เป็นเชื้อฟืนหล่อเลี้ยงให้ไฟลุกโชน', 'การตีความ': 'ช่วยส่งเสริม หล่อเลี้ยง ผลักดัน สนับสนุนให้แนวทางดำเนินไปอย่างราบรื่น' },
  { 'ประเภทความสัมพันธ์': 'วงจรส่งเสริม (相生)', 'คู่ธาตุ': 'ไฟ → ดิน', 'สัญลักษณ์': 'ไฟเผาไหม้กลายเป็นเถ้าถ่านกลับคืนสู่ดิน', 'การตีความ': 'สร้างความมั่นคง ก่อเกิดผลลัพธ์และทรัพย์สินที่เป็นรูปธรรม' },
  { 'ประเภทความสัมพันธ์': 'วงจรส่งเสริม (相生)', 'คู่ธาตุ': 'ดิน → ทอง', 'สัญลักษณ์': 'แร่ธาตุและทองคำก่อตัวสะสมในผืนดิน', 'การตีความ': 'การสั่งสมประสบการณ์ นำไปสู่การตัดสินใจที่เฉียบคมและแม่นยำ' },
  { 'ประเภทความสัมพันธ์': 'วงจรส่งเสริม (相生)', 'คู่ธาตุ': 'ทอง → น้ำ', 'สัญลักษณ์': 'โลหะหลอมเหลวเป็นของเหลว หรือกลั่นตัวเป็นหยดน้ำ', 'การตีความ': 'การแปรเปลี่ยนความเฉียบคมไปสู่ความยืดหยุ่น ปัญญา และสัญชาตญาณ' },
  { 'ประเภทความสัมพันธ์': 'วงจรส่งเสริม (相生)', 'คู่ธาตุ': 'น้ำ → ไม้', 'สัญลักษณ์': 'น้ำรดหล่อเลี้ยงต้นไม้ให้เติบโตงอกงาม', 'การตีความ': 'จิตใจและสัญชาตญาณช่วยบำรุงการศึกษา การเรียนรู้ และการเริ่มต้นใหม่' },
  { 'ประเภทความสัมพันธ์': 'วงจรควบคุม (相克)', 'คู่ธาตุ': 'ไม้ ควบคุม ดิน', 'สัญลักษณ์': 'รากไม้ชอนไชยึดและควบคุมผืนดิน', 'การตีความ': 'การจัดระเบียบ การใช้ความรู้หรือกฎเกณฑ์เข้าควบคุมจัดการทรัพยากร' },
  { 'ประเภทความสัมพันธ์': 'วงจรควบคุม (相克)', 'คู่ธาตุ': 'ดิน ควบคุม น้ำ', 'สัญลักษณ์': 'คันดินกักกั้นและควบคุมทิศทางของสายน้ำ', 'การตีความ': 'ความมั่นคงและหลักการช่วยดึงสติ คุมอารมณ์ และกักเก็บพลังงาน' },
  { 'ประเภทความสัมพันธ์': 'วงจรควบคุม (相克)', 'คู่ธาตุ': 'น้ำ ควบคุม ไฟ', 'สัญลักษณ์': 'น้ำดับและควบคุมเปลวเพลิง', 'การตีความ': 'ความเยือกเย็น สติ และความสุขุมช่วยดับความใจร้อน วู่วาม และความกดดัน' },
  { 'ประเภทความสัมพันธ์': 'วงจรควบคุม (相克)', 'คู่ธาตุ': 'ไฟ ควบคุม ทอง', 'สัญลักษณ์': 'ไฟหลอมละลายและจัดรูปทรงทองคำ', 'การตีความ': 'พลังขับเคลื่อนและความมุ่งมั่นช่วยหลอมละลายความดื้อรั้น ดัดแปลงสู่สิ่งที่ดีกว่า' },
  { 'ประเภทความสัมพันธ์': 'วงจรควบคุม (相克)', 'คู่ธาตุ': 'ทอง ควบคุม ไม้', 'สัญลักษณ์': 'คมขวานโลหะตัดแต่งกิ่งไม้และโค่นต้นไม้', 'การตีความ': 'การตัดสินใจที่เด็ดขาด ตัดสิ่งที่ไม่จำเป็นทิ้ง เพื่อให้สิ่งที่เหลือเติบโตได้ถูกทิศทาง' },
  { 'ประเภทความสัมพันธ์': 'ธาตุเดียวกัน (比和)', 'คู่ธาตุ': 'ธาตุเดียวกัน', 'สัญลักษณ์': 'พลังงานธาตุชนิดเดียวกันมาพบกัน', 'การตีความ': 'สอดคล้อง รวมพลัง เน้นย้ำมวลพลังงานเดิมให้เข้มข้นยิ่งขึ้น' }
];
const wsElementRelations = XLSX.utils.json_to_sheet(elementRelationsRows);
wsElementRelations['!cols'] = [{ wch: 22 }, { wch: 18 }, { wch: 50 }, { wch: 70 }];
XLSX.utils.book_append_sheet(wb, wsElementRelations, 'ความสัมพันธ์เบญจธาตุ');

// Output destinations
const targets = [
  path.join(__dirname, '..', 'คำทำนายไพ่เทพเหมียว_รวมความหมาย.xlsx'),
  path.join(__dirname, '..', 'คู่มือไพ่เทพจีน_JiuTian_96ใบ.xlsx'),
  path.join(__dirname, '..', 'JiuTianData', 'คู่มือไพ่เทพจีน_JiuTian_96ใบ.xlsx')
];

for (const p of targets) {
  try {
    XLSX.writeFile(wb, p);
    console.log(`[SUCCESS] Written Excel to ${p}`);
  } catch (err) {
    console.warn(`[WARN] Could not write to ${p} (file may be open in Excel): ${err.message}`);
  }
}
