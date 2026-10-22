const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const dbPath = path.join(rootDir, 'jiutian-arcana-database-v2.json');
const outputPath = path.join(rootDir, 'card_titles.txt');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const lines = [
  '# ============================================================================',
  '# รายชื่อฉายาและนิยามประจำไพ่ 96 ใบ (Card Titles & Concepts)',
  '# คำแนะนำการแก้ไข: แก้ไขข้อความด้านหลังเครื่องหมาย "=" ได้ตามต้องการ',
  '# เมื่อแก้ไขเสร็จแล้ว บันทึกไฟล์นี้ (Ctrl + S) หรือส่งข้อความกลับมาในแชทได้เลยครับ',
  '# ============================================================================',
  ''
];

db.cards.forEach((c, idx) => {
  const id = c.id !== undefined ? c.id : (idx + 1);
  const name = c.name_th || c.name_en || '';
  const title = c.deity?.title || '';
  lines.push(`[${id}] ${name} = ${title}`);
});

fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');
console.log(`Successfully generated card_titles.txt with ${db.cards.length} cards`);
