import fs from 'fs';
import path from 'path';

const DATA_DIR = './data';
const DATA_FILE = path.join(DATA_DIR, 'cards.json');

// Check if directory exists, if not create it
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Check if file already exists to avoid overwriting user edits
if (fs.existsSync(DATA_FILE)) {
  console.log(`[INFO] file ${DATA_FILE} already exists. Skipping generation.`);
  process.exit(0);
}

const elements = ['ธาตุทอง (Metal)', 'ธาตุไม้ (Wood)', 'ธาตุน้ำ (Water)', 'ธาตุไฟ (Fire)', 'ธาตุดิน (Earth)'];

const defaultCards = [];
for (let i = 1; i <= 94; i++) {
  const elementIndex = (i - 1) % elements.length;
  defaultCards.push({
    id: i,
    name: `ไพ่ใบที่ ${i}`,
    image: `card_${String(i).padStart(2, '0')}.png`,
    element: elements[elementIndex],
    keywords: [`ความหมายที่ ${i}.1`, `ความหมายที่ ${i}.2`, `ความหมายที่ ${i}.3`],
    general_meaning: `คำอธิบายทั่วไปของไพ่ใบที่ ${i}: เป็นสัญลักษณ์ของพลังงานดวงจีนโบราณและอาร์คานา (Arcana) สื่อถึงโอกาสและการเปลี่ยนแปลงที่กำลังจะเกิดขึ้นในชีวิต มีเกณฑ์ที่จะได้รับข่าวดีหรือการปรับเปลี่ยนในทางที่ดีขึ้น`,
    love_meaning: `ความรักของไพ่ใบที่ ${i}: สำหรับคนโสด มีโอกาสได้พบเจอกับคนที่ศีลเสมอกันหรือคู่ธาตุที่เกื้อหนุนกัน สำหรับคนมีคู่ ความสัมพันธ์จะมีความเข้าใจกันมากขึ้นและการเจรจาประสบความสำเร็จ`,
    work_meaning: `การงานและการเงินของไพ่ใบที่ ${i}: ด้านการงานมีความเจริญก้าวหน้า มีโอกาสได้ทำงานสำคัญหรือเลื่อนตำแหน่ง ด้านการเงินมีกระแสเงินสดไหลเวียนดี มีโอกาสได้โชคลาภลอยหรือผลกำไรจากการลงทุน`,
    advice: `คำแนะนำของไพ่ใบที่ ${i}: ควรมีสติในการตัดสินใจและรักษาสมดุลธาตุในร่างกาย หลีกเลี่ยงความขัดแย้งที่ไม่มีเหตุผลและเปิดรับโอกาสใหม่ๆ`
  });
}

fs.writeFileSync(DATA_FILE, JSON.stringify(defaultCards, null, 2), 'utf-8');
console.log(`[SUCCESS] Generated default template for 94 cards at ${DATA_FILE}`);
