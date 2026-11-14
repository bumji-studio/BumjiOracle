const fs = require('fs');
const assert = require('assert');

// Test formatOracleAnalysisText logic directly from app.js
const app = fs.readFileSync('app.js', 'utf8');
const funcMatch = app.match(/function formatOracleAnalysisText\(raw\) \{[\s\S]*?\n  \}/);
assert(funcMatch, 'formatOracleAnalysisText function should exist in app.js');

const formatOracleAnalysisText = eval(`(${funcMatch[0]})`);

const inputSample = `สเต็ป 1 (พลังงานประจำวัน): ไพ่แห่งน้ำวันนี้พาคุณเข้าสู่บรรยากาศที่อ่อนโยนและเต็มไปด้วยความเชื่อมโยงอันลึกซึ้ง เหมือนน้ำที่ค่อยๆ ไหลไปรอบๆ ทุกสิ่ง ทำให้คุณรู้สึกถึงความมั่นคงและความอุ่นใจที่มาจากความสัมพันธ์ที่แท้จริง ไม่ว่าจะเป็นมิตรภาพหรือความรักที่กำลังเติบโต

สเต็ป 2 (ข้อคิดเตือนใจ): อย่างไรก็ตาม น้ำก็อาจเป็นสัญญาณให้คุณระมัดระวังการรอคอยเกินไป อย่าให้ความหวังหรือความคาดหวังทำให้คุณรู้สึกกดดัน จงปล่อยให้สิ่งต่างๆ เกิดขึ้นตามธรรมชาติและค่อยๆ ทำตามหัวใจของคุณโดยไม่เร่งรีบ

สเต็ป 3 (พลังใจ & กำลังใจ): จงเชื่อว่าความพยายามของคุณจะนำมาซึ่งผลลัพธ์ที่อ่อนโยนและยั่งยืน ทุกก้าวที่คุณก้าวไปเป็นการเติมเต็มความรักและความสุขให้กับตัวเองและคนที่คุณห่วงใย อย่าลืมให้กำลังใจตัวเองด้วยคำพูดอ่อนโยนและรอยยิ้มที่แผ่ออกไปเมี๊ยววว~ 🐾`;

const output = formatOracleAnalysisText(inputSample);
console.log('--- FORMATTED OUTPUT ---');
console.log(output);

// Assertions:
assert(!output.includes('สเต็ป 1'), 'Must not contain สเต็ป 1');
assert(!output.includes('สเต็ป 2'), 'Must not contain สเต็ป 2');
assert(!output.includes('สเต็ป 3'), 'Must not contain สเต็ป 3');
assert(!output.includes('Step'), 'Must not contain Step');
assert(!output.includes('(พลังงานประจำวัน)'), 'Must not contain (พลังงานประจำวัน)');
assert(!output.includes('(ข้อคิดเตือนใจ)'), 'Must not contain (ข้อคิดเตือนใจ)');
assert(!output.includes('(พลังใจ & กำลังใจ)'), 'Must not contain (พลังใจ & กำลังใจ)');

assert(output.includes('<strong>คำทำนาย:</strong>'), 'Must contain คำทำนาย:');
assert(output.includes('<strong>คำเตือน:</strong>'), 'Must contain คำเตือน:');
assert(output.includes('<strong>คำฮีลใจ:</strong>'), 'Must contain คำฮีลใจ:');

console.log('✅ ALL ASSERTIONS PASSED: No "Step" or parentheses, accurately uses คำทำนาย, คำเตือน, คำฮีลใจ');
