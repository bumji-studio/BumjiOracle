const fs = require('fs');

console.log('--- 1. Patching app.js ---');
let app = fs.readFileSync('app.js', 'utf8');

// Replace formatOracleAnalysisText in app.js
const oldFuncRegex = /function formatOracleAnalysisText\(raw\) \{[\s\S]*?\n  \}/;

const newFunc = `function formatOracleAnalysisText(raw) {
    if (!raw) return '';

    // 1. Convert literal escaped newlines and line breaks to actual newlines
    let cleaned = String(raw)
      .replace(/\\\\r\\\\n/g, '\\n')
      .replace(/\\\\n/g, '\\n')
      .replace(/\\r\\n/g, '\\n');

    // 2. Remove all section / step / part headers and coding symbols
    cleaned = cleaned
      // Remove "ส่วนที่ X" or "(ส่วนที่ X)" anywhere
      .replace(/(?:^|\\n|\\s*)(?:\\(?ส่วนที่\\s*\\d+\\)?)\\s*[:：\\-–]?\\s*/gi, '\\n\\n')
      // Remove "สเต็ป X" or "Step X" anywhere
      .replace(/(?:^|\\n|\\s*)(?:\\(?(?:สเต็ป|สเตป|step)\\s*\\d+\\)?)\\s*(?:\\([^)]*\\))?\\s*[:：\\-–]?\\s*/gi, '\\n\\n')
      // Remove "คำทำนาย:", "คำเตือน:", "คำฮีลใจ:"
      .replace(/(?:^|\\n|\\s*)(?:\\(?คำทำนาย\\)?)\\s*[:：\\-–]?\\s*/g, '\\n\\n')
      .replace(/(?:^|\\n|\\s*)(?:\\(?คำเตือน\\)?)\\s*[:：\\-–]?\\s*/g, '\\n\\n')
      .replace(/(?:^|\\n|\\s*)(?:\\(?คำฮีลใจ\\)?)\\s*[:：\\-–]?\\s*/g, '\\n\\n')
      // Remove standalone parenthesized terms like (พลังงานประจำวัน), (ข้อคิดเตือนใจ), (พลังใจ & กำลังใจ)
      .replace(/\\((?:พลังงานประจำวัน|ข้อคิดเตือนใจ|พลังใจ[^)]*)\\)\\s*[:：\\-–]?\\s*/gi, '')
      // Remove leftover bold or HTML headers if any
      .replace(/<\\/?(?:strong|b)>\\s*(?:ส่วนที่\\s*\\d+|สเต็ป\\s*\\d+|step\\s*\\d+|คำทำนาย|คำเตือน|คำฮีลใจ)\\s*[:：\\-–]?\\s*<\\/(?:strong|b)>/gi, '')
      .replace(/<\\/?(?:strong|b)>\\s*<\\/(?:strong|b)>/gi, '')
      .trim();

    // If it already had <p> tags
    if (cleaned.includes('<p>') || cleaned.includes('<div>')) {
      return cleaned
        .replace(/(?:<p>|<br\\s*\\/?>)\\s*(?:ส่วนที่\\s*\\d+|สเต็ป\\s*\\d+|step\\s*\\d+|คำทำนาย|คำเตือน|คำฮีลใจ)\\s*[:：\\-–]?\\s*/gi, '$1')
        .replace(/<\\/?(?:strong|b)>\\s*(?:ส่วนที่\\s*\\d+|สเต็ป\\s*\\d+|step\\s*\\d+|คำทำนาย|คำเตือน|คำฮีลใจ)\\s*[:：\\-–]?\\s*<\\/(?:strong|b)>/gi, '');
    }

    return cleaned
      .split(/\\n\\n+/)
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .map(p => \`<p>\${p}</p>\`)
      .join('');
  }`;

if (!oldFuncRegex.test(app)) {
  console.error('Could not find formatOracleAnalysisText in app.js');
  process.exit(1);
}
app = app.replace(oldFuncRegex, newFunc);

// Update prompt instructions for mode 2 and mode 3
const oldChoicePrompt = `2. overall_analysis: วิเคราะห์เจาะลึก 4 ส่วนอย่างชัดเจน:
   - ส่วนที่ 1: สถานการณ์ปัจจุบัน (วิเคราะห์จากใบที่ 1)
   - ส่วนที่ 2: ผ่าเส้นทางเลือกที่ 1 & ผลลัพธ์ (วิเคราะห์จากใบที่ 2 และใบที่ 3)
   - ส่วนที่ 3: ผ่าเส้นทางเลือกที่ 2 & ผลลัพธ์ (วิเคราะห์จากใบที่ 4 และใบที่ 5)
   - ส่วนที่ 4: บทสรุปเปรียบเทียบ & คำแนะนำชี้ทางสว่าง (คำแนะนำที่นำไปใช้ตัดสินใจได้จริงอย่างมีสติ)`;

const newChoicePrompt = `2. overall_analysis: เขียนวิเคราะห์เปรียบเทียบให้อ่านไหลลื่นเป็นเนื้อความเดียวกัน 3-4 ย่อหน้า (คั่นแต่ละย่อหน้าด้วย \\n\\n):
   - เนื้อหาครอบคลุม: สถานการณ์ปัจจุบัน, ผ่าเส้นทางเลือกที่ 1 และผลลัพธ์, ผ่าเส้นทางเลือกที่ 2 และผลลัพธ์, และบทสรุปข้อแนะนำชี้ทางสว่าง
   - ข้อห้ามสำคัญเด็ดขาด: ไม่ต้องใส่หัวข้อ ไม่ต้องเขียนคำว่า "ส่วนที่ 1", "ส่วนที่ 2", "สเต็ป", "Step" หรือใส่รหัสสัญลักษณ์ใดๆ ทั้งสิ้น ให้เขียนเป็นความเรียงเนื้อความบรรยายอย่างเป็นธรรมชาติไปเลย`;

const oldFuturePrompt = `2. overall_analysis: วิเคราะห์ไทม์ไลน์ 4 ส่วนอย่างเป็นระบบ:
   - ส่วนที่ 1: สถานการณ์ปัจจุบัน (วิเคราะห์จากใบที่ 1)
   - ส่วนที่ 2: สิ่งที่จะทยอยเกิดขึ้นระหว่างทาง (วิเคราะห์จากใบที่ 2)
   - ส่วนที่ 3: ผลลัพธ์ปลายทางที่จะปรากฏ (วิเคราะห์จากใบที่ 3)
   - ส่วนที่ 4: กลยุทธ์และคำแนะนำเตรียมพร้อมรับมือหรือต่อยอดความสำเร็จ`;

const newFuturePrompt = `2. overall_analysis: เขียนวิเคราะห์ไทม์ไลน์ให้อ่านไหลลื่นเป็นเนื้อความเดียวกัน 3-4 ย่อหน้า (คั่นแต่ละย่อหน้าด้วย \\n\\n):
   - เนื้อหาครอบคลุม: สถานการณ์ปัจจุบัน, สิ่งที่จะทยอยเกิดขึ้นระหว่างทาง, ผลลัพธ์ปลายทางที่จะปรากฏ, และกลยุทธ์คำแนะนำเตรียมพร้อม
   - ข้อห้ามสำคัญเด็ดขาด: ไม่ต้องใส่หัวข้อ ไม่ต้องเขียนคำว่า "ส่วนที่ 1", "ส่วนที่ 2", "ส่วนที่ 3", "ส่วนที่ 4", "สเต็ป", "Step" หรือใส่รหัสสัญลักษณ์ใดๆ ทั้งสิ้น ให้เขียนเป็นความเรียงเนื้อความบรรยายอย่างเป็นธรรมชาติไปเลย`;

if (app.includes(oldChoicePrompt)) {
  app = app.replace(oldChoicePrompt, newChoicePrompt);
}
if (app.includes(oldFuturePrompt)) {
  app = app.replace(oldFuturePrompt, newFuturePrompt);
}

fs.writeFileSync('app.js', app, 'utf8');
console.log('app.js updated successfully.');

console.log('--- 2. Updating index.html with new cache-busting version ---');
let html = fs.readFileSync('index.html', 'utf8');
const nowVer = '20261114_v4';
html = html.replace(/href="styles\.css\?v=[^"]*"/g, `href="styles.css?v=${nowVer}"`);
html = html.replace(/src="auth\.js\?v=[^"]*"/g, `src="auth.js?v=${nowVer}"`);
html = html.replace(/src="app\.js\?v=[^"]*"/g, `src="app.js?v=${nowVer}"`);
html = html.replace(/src="data\/jiutian-arcana-database-v2\.js\?v=[^"]*"/g, `src="data/jiutian-arcana-database-v2.js?v=${nowVer}"`);
html = html.replace(/src="data\/jiutian-cards\.js\?v=[^"]*"/g, `src="data/jiutian-cards.js?v=${nowVer}"`);

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html updated successfully to version', nowVer);
