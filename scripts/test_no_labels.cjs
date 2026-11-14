const fs = require('fs');
const assert = require('assert');

const app = fs.readFileSync('app.js', 'utf8');
const funcMatch = app.match(/function formatOracleAnalysisText\(raw\) \{[\s\S]*?\n  \}/);
assert(funcMatch, 'formatOracleAnalysisText function should exist in app.js');

const formatOracleAnalysisText = eval(`(${funcMatch[0]})`);

// Test 1: Exact sample from user's latest screenshot
const sample1 = 'คำทำนาย: ไพ่พังทลายบ่งบอกว่าพลังของการสิ้นสุดกำลังทำงาน ทำให้คุณเห็นโอกาสใหม่ที่ซ่อนอยู่หลังการเปลี่ยนแปลงและพร้อมเปิดรับการเริ่มต้นที่สดใส คำเตือน: อย่าให้ความเสียใจหรือความกังวลเกาะกุมใจ ค่อยๆ ปล่อยให้สิ่งเก่าเลือนหายโดยไม่กดดันตัวเอง ให้เวลาเป็นเพื่อนร่วมทาง คำฮีลใจ: จำไว้ว่าการปล่อยวางคือการให้พื้นที่ให้ความรักและความหวังเจริญเติบโต คุณมีพลังและเมตตาเพียงพอที่จะก้าวผ่านวันนี้อย่างอุ่นใจ';

const out1 = formatOracleAnalysisText(sample1);
console.log('--- TEST 1 RESULT ---');
console.log(out1);

assert(!out1.includes('คำทำนาย'), 'Must not contain คำทำนาย');
assert(!out1.includes('คำเตือน'), 'Must not contain คำเตือน');
assert(!out1.includes('คำฮีลใจ'), 'Must not contain คำฮีลใจ');
assert(!out1.includes('สเต็ป'), 'Must not contain สเต็ป');
assert(!out1.includes('Step'), 'Must not contain Step');

// Test 2: Sample with old Step format
const sample2 = `สเต็ป 1 (พลังงานประจำวัน): ไพ่แห่งน้ำวันนี้พาคุณเข้าสู่บรรยากาศที่อ่อนโยน...
สเต็ป 2 (ข้อคิดเตือนใจ): อย่างไรก็ตาม น้ำก็อาจเป็นสัญญาณ...
สเต็ป 3 (พลังใจ & กำลังใจ): จงเชื่อว่าความพยายามของคุณ...`;

const out2 = formatOracleAnalysisText(sample2);
console.log('--- TEST 2 RESULT ---');
console.log(out2);

assert(!out2.includes('สเต็ป'), 'Must not contain สเต็ป');
assert(!out2.includes('พลังงานประจำวัน'), 'Must not contain พลังงานประจำวัน');
assert(!out2.includes('ข้อคิดเตือนใจ'), 'Must not contain ข้อคิดเตือนใจ');
assert(!out2.includes('พลังใจ & กำลังใจ'), 'Must not contain พลังใจ & กำลังใจ');

// Test 3: Sample with HTML tags
const sample3 = '<p><strong>คำทำนาย:</strong> วันนี้ฟ้าเปิด</p><p><strong>คำเตือน:</strong> อย่าประมาท</p><p><strong>คำฮีลใจ:</strong> คุณทำได้</p>';
const out3 = formatOracleAnalysisText(sample3);
console.log('--- TEST 3 RESULT ---');
console.log(out3);

assert(!out3.includes('คำทำนาย'), 'Must not contain คำทำนาย');
assert(!out3.includes('คำเตือน'), 'Must not contain คำเตือน');
assert(!out3.includes('คำฮีลใจ'), 'Must not contain คำฮีลใจ');

console.log('✅ ALL TESTS PASSED: Completely eliminated all prefix words and tags!');
