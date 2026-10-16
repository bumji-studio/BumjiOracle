const fs = require('fs');
const path = require('path');

const jiuTianDir = path.join(__dirname, '..', 'JiuTianData');
const defCardsPath = path.join(__dirname, '..', 'scratch', 'default_cards_cjs.cjs');
const defaultCards = require(defCardsPath);

// List existing md files
const mdFiles = fs.readdirSync(jiuTianDir).filter(f => f.endsWith('.md'));
const existingIds = new Set();

for (const f of mdFiles) {
  const majorMatch = f.match(/^(\d+)-/);
  if (majorMatch) {
    existingIds.add(parseInt(majorMatch[1], 10) + 1);
  } else {
    const minorMatch = f.match(/^(Wood|Fire|Earth|Metal|Water)\s+(\d+)/i);
    if (minorMatch) {
      const suit = minorMatch[1].toLowerCase();
      const rank = parseInt(minorMatch[2], 10);
      const base = { wood: 22, fire: 36, earth: 50, metal: 64, water: 78 }[suit];
      existingIds.add(base + rank);
    }
  }
}

console.log(`Existing markdown cards: ${existingIds.size}`);

// Template generator for missing cards
function generateMarkdown(card) {
  const id = card.id;
  let title = card.name;
  let filename = '';
  
  if (id >= 1 && id <= 22) {
    const majorNo = id - 1;
    filename = `${majorNo}-${card.name.replace(/^Major \d+\s*-\s*/, '')}.md`;
    title = `${majorNo}-${card.name.replace(/^Major \d+\s*-\s*/, '')}`;
  } else if (id >= 23 && id <= 36) {
    const rank = id - 22;
    filename = `Wood ${rank} - ${card.name.replace(/^Minor Wood \d+\s*-\s*/, '')}.md`;
    title = `Wood ${rank} - ${card.name.replace(/^Minor Wood \d+\s*-\s*/, '')}`;
  } else if (id >= 37 && id <= 50) {
    const rank = id - 36;
    filename = `Fire ${rank} - ${card.name.replace(/^Minor Fire \d+\s*-\s*/, '')}.md`;
    title = `Fire ${rank} - ${card.name.replace(/^Minor Fire \d+\s*-\s*/, '')}`;
  } else if (id >= 51 && id <= 64) {
    const rank = id - 50;
    filename = `Earth ${rank} - ${card.name.replace(/^Minor Earth \d+\s*-\s*/, '')}.md`;
    title = `Earth ${rank} - ${card.name.replace(/^Minor Earth \d+\s*-\s*/, '')}`;
  } else if (id >= 65 && id <= 78) {
    const rank = id - 64;
    filename = `Metal ${rank} - ${card.name.replace(/^Minor Metal \d+\s*-\s*/, '')}.md`;
    title = `Metal ${rank} - ${card.name.replace(/^Minor Metal \d+\s*-\s*/, '')}`;
  } else if (id >= 79 && id <= 92) {
    const rank = id - 78;
    filename = `Water ${rank} - ${card.name.replace(/^Minor Water \d+\s*-\s*/, '')}.md`;
    title = `Water ${rank} - ${card.name.replace(/^Minor Water \d+\s*-\s*/, '')}`;
  } else {
    filename = `Special ${id} - ${card.name.replace(/^Special \d+\s*-\s*/, '')}.md`;
    title = `Special ${id} - ${card.name.replace(/^Special \d+\s*-\s*/, '')}`;
  }

  // Clean filename for Windows file system
  filename = filename.replace(/[\\/:*?"<>|]/g, '').trim();
  if (!filename.endsWith('.md')) filename += '.md';

  const element = card.element || 'ธาตุทอง (Metal)';
  const generalMeaning = card.general_meaning || 'สัจธรรมแห่งการเปลี่ยนแปลงและสมดุลพลังงานสากล';
  const advice = card.advice || 'จงดำเนินชีวิตด้วยสติปัญญาและรักษาใจให้สงบมั่นคง';
  const workMeaning = card.work_meaning || 'การงานและการเงิน: โอกาสความสำเร็จและการบริหารจัดการตามแนวทางของพลังธาตุ';
  const loveMeaning = card.love_meaning || 'ความรัก: พลังงานเกื้อหนุนและความเข้าใจที่ลึกซึ้ง';

  const mdContent = `# ${title}

## **${title}**

---

![${id}.png](${id}.png)

**ธาตุประจำตัว:** ${element}

**คอนเซปต์หลัก:** ${generalMeaning}

1. **แก่นแท้ของตัวละคร (The Essence)**
    ${generalMeaning} เป็นตัวแทนของปัญญาและสัจธรรมที่นำทางสรรพชีวิต สะท้อนความกลมกลืนระหว่างฟ้า ดิน และมนุษย์ตามหลักเต๋าโบราณ

2. **สัญลักษณ์และปรัชญา (Symbolism & Philosophy)**
    - **พลังประจำธาตุ:** สะท้อนการหมุนเวียนของพลังงานธรรมชาติ (${element}) ที่ไม่หยุดนิ่ง
    - **สัญลักษณ์แห่งปัญญา:** เตือนสติให้มองเห็นแก่นแท้เบื้องลึก มากกว่าภาพลวงตาภายนอก
    - **สมดุลหยินหยาง:** การปรับตัวให้เข้ากับจังหวะเวลาแห่งจักรวาล

3. **กลยุทธ์เมื่อปรากฏไพ่ใบนี้ (The Strategy)**
    - **รู้จังหวะรุกรับ:** ดำเนินการอย่างรอบคอบ ไม่เร่งร้อนหรือดื้อดึงเกินเหตุ
    - **ใช้ปัญญาแทนอารมณ์:** ทุกการตัดสินใจต้องตั้งอยู่บนความจริงและหลักการที่ถูกต้อง
    - **รักษาจุดยืนที่มั่นคง:** ยึดมั่นในความซื่อสัตย์สุจริตและคุณธรรมภายในใจ

4. **คำแนะนำและการทำนาย (Reading Guidance)**
    - **ภาพรวมของไพ่ใบนี้:** ${advice}
    - **การงาน/ธุรกิจ:** ${workMeaning}
    - **การเงิน:** จัดการสภาพคล่องอย่างมีวินัย วางแผนระยะยาว และหลีกเลี่ยงความเสี่ยงที่ไม่จำเป็น
    - **ความรัก:** ${loveMeaning}
    - **สุขภาพ:** ดูแลสมดุลธาตุในร่างกาย พักผ่อนให้เพียงพอ และฝึกการเจริญสติ

5. **บุคลิกของคนที่เป็นตัวแทนไพ่**
    เป็นคนมีวิสัยทัศน์ มั่นคง มีเหตุผล และเปี่ยมด้วยความรับผิดชอบ
    
    **ในด้านเงา** อาจดื้อดึง ยึดมั่นในความคิดตนเองมากเกินไป หรือวิตกกังวลกับความสมบูรณ์แบบ

6. **อาชีพที่พบได้บ่อย**
    ผู้นำองค์กร นักบริหาร ที่ปรึกษา ผู้เชี่ยวชาญ นักวิชาการ นักวางแผนกลยุทธ์

7. **Key Affirmation:**
    "${advice.replace(/^ข้อความจากเทพ\s*“?|^คำแนะนำ:?\s*“?/, '').replace(/”$/, '')}"

8. **Keyword**
    ${(card.keywords || ['พลังธาตุ', 'จิ่วเทียนอาร์คานา', 'โชคชะตา']).join(' • ')}

9. **ประวัติเทพเจ้า**
    ${generalMeaning}
`;

  return { filename, content: mdContent };
}

let createdCount = 0;
for (let id = 1; id <= 96; id++) {
  if (!existingIds.has(id)) {
    const card = defaultCards[id - 1];
    if (card) {
      const { filename, content } = generateMarkdown(card);
      const targetPath = path.join(jiuTianDir, filename);
      if (!fs.existsSync(targetPath)) {
        fs.writeFileSync(targetPath, content, 'utf8');
        createdCount++;
        console.log(`Created markdown for card #${id}: ${filename}`);
      }
    }
  }
}

console.log(`[SUCCESS] Generated ${createdCount} markdown card files in JiuTianData!`);
