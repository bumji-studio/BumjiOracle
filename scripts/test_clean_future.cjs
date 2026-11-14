const assert = require('assert');

function cleanOracleAnalysis(raw) {
  if (!raw) return '';

  // 1. Convert literal escaped newlines and line breaks to actual newlines
  let cleaned = String(raw)
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n');

  // 2. Remove all section / step / part headers and coding symbols
  // Examples: ส่วนที่ 1:, ส่วนที่ 2:, สเต็ป 1:, Step 1:, ใบที่ 1:, คำทำนาย:, คำเตือน:, คำฮีลใจ:
  cleaned = cleaned
    // Remove "ส่วนที่ X" or "(ส่วนที่ X)" anywhere
    .replace(/(?:^|\n|\s*)(?:\(?ส่วนที่\s*\d+\)?)\s*[:：\-–]?\s*/gi, '\n\n')
    // Remove "สเต็ป X" or "Step X" anywhere
    .replace(/(?:^|\n|\s*)(?:\(?(?:สเต็ป|สเตป|step)\s*\d+\)?)\s*(?:\([^)]*\))?\s*[:：\-–]?\s*/gi, '\n\n')
    // Remove "คำทำนาย:", "คำเตือน:", "คำฮีลใจ:"
    .replace(/(?:^|\n|\s*)(?:\(?คำทำนาย\)?)\s*[:：\-–]?\s*/g, '\n\n')
    .replace(/(?:^|\n|\s*)(?:\(?คำเตือน\)?)\s*[:：\-–]?\s*/g, '\n\n')
    .replace(/(?:^|\n|\s*)(?:\(?คำฮีลใจ\)?)\s*[:：\-–]?\s*/g, '\n\n')
    // Remove standalone parenthesized terms like (พลังงานประจำวัน), (ข้อคิดเตือนใจ), (พลังใจ & กำลังใจ)
    .replace(/\((?:พลังงานประจำวัน|ข้อคิดเตือนใจ|พลังใจ[^)]*)\)\s*[:：\-–]?\s*/gi, '')
    // Remove leftover bold or HTML headers if any
    .replace(/<\/?(?:strong|b)>\s*(?:ส่วนที่\s*\d+|สเต็ป\s*\d+|step\s*\d+|คำทำนาย|คำเตือน|คำฮีลใจ)\s*[:：\-–]?\s*<\/(?:strong|b)>/gi, '')
    .replace(/<\/?(?:strong|b)>\s*<\/(?:strong|b)>/gi, '')
    .trim();

  // If it already had <p> tags
  if (cleaned.includes('<p>') || cleaned.includes('<div>')) {
    return cleaned
      .replace(/(?:<p>|<br\s*\/?>)\s*(?:ส่วนที่\s*\d+|สเต็ป\s*\d+|step\s*\d+|คำทำนาย|คำเตือน|คำฮีลใจ)\s*[:：\-–]?\s*/gi, '$1')
      .replace(/<\/?(?:strong|b)>\s*(?:ส่วนที่\s*\d+|สเต็ป\s*\d+|step\s*\d+|คำทำนาย|คำเตือน|คำฮีลใจ)\s*[:：\-–]?\s*<\/(?:strong|b)>/gi, '');
  }

  // Format into clean paragraphs
  return cleaned
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => `<p>${p}</p>`)
    .join('');
}

// Test with the exact string from user screenshot:
const sampleFromUserScreenshot = 'ส่วนที่ 1: ปัจจุบันคุณอยู่ในสถานการณ์ที่ต้องเผชิญการแข่งขันและการทดสอบศักยภาพของตนเอง การแสดงฝีมือและความคล่องแคล่วเป็นสิ่งจำเป็นเพื่อให้ผ่านพ้นอุปสรรคนี้ได้อย่างราบรื่น\\n\\nส่วนที่ 2: ใบต่อมาบ่งบอกว่าคุณจะก้าวเข้าสู่บทบาทผู้นำที่เต็มไปด้วยความมั่นใจและการตัดสินใจที่ชัดเจน การควบคุมสถานการณ์และรับผิดชอบอย่างเต็มที่จะทำให้คุณเป็นศูนย์กลางของการเคลื่อนที่ของทีม\\n\\nส่วนที่ 3: ผลลัพธ์สุดท้ายเตือนให้ระวังการยึดติดกับความคิดของตนเองมากเกินไป การถกเถียงและความขัดแย้งทางความคิดอาจเกิดขึ้นหากไม่เปิดใจรับฟังผู้อื่น\\n\\nส่วนที่ 4: กลยุทธ์ที่ควรใช้คือการรักษาความสมดุลระหว่างความมั่นใจและความอ่อนน้อม การฟังความคิดเห็นของทีมและปรับตัวตามสถานการณ์จะช่วยให้คุณนำพาไปสู่ผลลัพธ์ที่สงบสุขและยั่งยืน เมี๊ยววว~ 🐾';

const result = cleanOracleAnalysis(sampleFromUserScreenshot);
console.log('--- RESULT ---');
console.log(result);

assert(!result.includes('ส่วนที่'), 'Must not contain ส่วนที่');
assert(!result.includes('\\n'), 'Must not contain literal \\n');
assert(!result.includes('\\t'), 'Must not contain literal \\t');
assert(!result.includes('Step'), 'Must not contain Step');
assert(!result.includes('สเต็ป'), 'Must not contain สเต็ป');
assert(result.startsWith('<p>ปัจจุบันคุณอยู่ใน'), 'Should start directly with story text');

console.log('✅ TEST PASSED: Perfectly cleans literal \\n and "ส่วนที่ X:" into clean paragraphs!');
