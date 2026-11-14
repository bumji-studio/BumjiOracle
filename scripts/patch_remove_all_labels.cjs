const fs = require('fs');

console.log('--- Updating app.js to completely remove all prefix labels ---');
let app = fs.readFileSync('app.js', 'utf8');

// 1. Update formatOracleAnalysisText function
const oldFuncRegex = /function formatOracleAnalysisText\(raw\) \{[\s\S]*?\n  \}/;

const newFunc = `function formatOracleAnalysisText(raw) {
    if (!raw) return '';
    let cleaned = raw
      // Remove Step / สเต็ป labels and any parentheses
      .replace(/(?:(?:สเต็ป|สเตป|step)\\s*1\\s*(?:\\([^)]*\\))?|(?:\\([^)]*พลังงานประจำวัน[^)]*\\)))\\s*[:：\\-–]?\\s*/gi, '')
      .replace(/(?:(?:สเต็ป|สเตป|step)\\s*2\\s*(?:\\([^)]*\\))?|(?:\\([^)]*ข้อคิดเตือนใจ[^)]*\\)))\\s*[:：\\-–]?\\s*/gi, '\\n\\n')
      .replace(/(?:(?:สเต็ป|สเตป|step)\\s*3\\s*(?:\\([^)]*\\))?|(?:\\([^)]*พลังใจ[^)]*\\)))\\s*[:：\\-–]?\\s*/gi, '\\n\\n')
      // Remove คำทำนาย, คำเตือน, คำฮีลใจ prefixes anywhere (start of line, middle of line, inside text)
      .replace(/(?:^|\\n)\\s*(?:\\(?คำทำนาย\\)?)\\s*[:：\\-–]?\\s*/g, '')
      .replace(/\\s*(?:\\(?คำทำนาย\\)?)\\s*[:：\\-–]?\\s*/g, '')
      .replace(/(?:^|\\n)\\s*(?:\\(?คำเตือน\\)?)\\s*[:：\\-–]?\\s*/g, '\\n\\n')
      .replace(/\\s*(?:\\(?คำเตือน\\)?)\\s*[:：\\-–]?\\s*/g, '\\n\\n')
      .replace(/(?:^|\\n)\\s*(?:\\(?คำฮีลใจ\\)?)\\s*[:：\\-–]?\\s*/g, '\\n\\n')
      .replace(/\\s*(?:\\(?คำฮีลใจ\\)?)\\s*[:：\\-–]?\\s*/g, '\\n\\n')
      // Remove any leftover strong tags wrapping those labels
      .replace(/<\\/?(?:strong|b)>\\s*(?:คำทำนาย|คำเตือน|คำฮีลใจ)\\s*[:：\\-–]?\\s*<\\/(?:strong|b)>/gi, '')
      .replace(/<\\/?(?:strong|b)>\\s*<\\/(?:strong|b)>/gi, '')
      .trim();

    if (cleaned.includes('<p>') || cleaned.includes('<div>')) {
      return cleaned
        .replace(/(?:<p>|<br\\s*\\/?>)\\s*(?:คำทำนาย|คำเตือน|คำฮีลใจ)\\s*[:：\\-–]?\\s*/gi, '$1')
        .replace(/<\\/?(?:strong|b)>\\s*(?:คำทำนาย|คำเตือน|คำฮีลใจ)\\s*[:：\\-–]?\\s*<\\/(?:strong|b)>/gi, '');
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

// 2. Update the prompt instruction for Daily
const oldDailyPrompt = `2. overall_analysis: วิเคราะห์พลังงานของไพ่ประจำวันใบนี้ โดยแบ่งเนื้อหาเป็น 3 ส่วนชัดเจน ห้ามเขียนคำว่า Step หรือ สเต็ป และห้ามใส่วงเล็บ โดยให้ขึ้นต้นแต่ละส่วนด้วยคำเหล่านี้โดยตรง:
   - คำทำนาย: สิ่งที่ไพ่ใบนี้สะท้อนถึงสภาวะและโอกาสดีๆ ในวันนี้
   - คำเตือน: เตือนใจอย่างอ่อนโยน ไม่ประมาท หรือสิ่งที่ควรปล่อยวาง ค่อยๆ ทำ ไม่กดดันตัวเอง
   - คำฮีลใจ: คำพูดให้กำลังใจ ชุบชูใจ อบอุ่น ส่งพลังบวกให้ก้าวผ่านวันได้อย่างมีความสุข`;

const newDailyPrompt = `2. overall_analysis: เขียนคำทำนายให้อ่านไหลลื่นเป็นธรรมชาติ 2-3 ย่อหน้า (คั่นแต่ละย่อหน้าด้วย \\n\\n):
   - เนื้อหาครอบคลุม: พลังงานและโอกาสดีๆ ในวันนี้, ข้อคิดเตือนใจอย่างอ่อนโยนไม่ประมาท, และพลังใจชุบชูใจอบอุ่น
   - ข้อห้ามสำคัญเด็ดขาด: ไม่ต้องใส่หัวข้อ ไม่ต้องเขียนคำว่า "คำทำนาย" ไม่ต้องเขียนคำว่า "คำเตือน" ไม่ต้องเขียนคำว่า "คำฮีลใจ" ไม่ต้องเขียนคำว่า "สเต็ป" หรือ "Step" และห้ามใส่วงเล็บใดๆ ทั้งสิ้น ให้เขียนเป็นความเรียงบรรยายอย่างอบอุ่นต่อเนื่องเป็นธรรมชาติไปเลย`;

if (app.includes(oldDailyPrompt)) {
  app = app.replace(oldDailyPrompt, newDailyPrompt);
}

fs.writeFileSync('app.js', app, 'utf8');
console.log('Successfully updated app.js: all labels removed completely.');
