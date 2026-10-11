import fs from 'fs';

const artMap = {
  wish: 'assets/bumji_card_wish.jpg',
  healing: 'assets/bumji_card_healing.jpg',
  harmony: 'assets/bumji_card_harmony.jpg',
  curiosity: 'assets/bumji_card_curiosity.jpg',
  churu: 'assets/bumji_card_churu.jpg',
  loaf: 'assets/bumji_card_loaf.jpg',
  box: 'assets/bumji_card_box.jpg'
};

// Curated mood/archetype matching each of the 61 cards from คู่มือไพ่CAT61.xlsx
const cardThemeMap = {
  1: 'wish',        // 1 - Wish (ความปรารถนา)
  2: 'curiosity',   // 2 - Strategy (การวางแผน)
  3: 'wish',        // 3 - Breakthrough (การทะลุข้อจำกัด)
  4: 'curiosity',   // 4 - Decision (การตัดสินใจ)
  5: 'wish',        // 5 - Willpower (ความมุ่งมั่น)
  6: 'wish',        // 6 - Leadership (ภาวะผู้นำ)
  7: 'curiosity',   // 7 - Communication (การสื่อสาร)
  8: 'curiosity',   // 8 - Adaptability (การปรับตัว)
  9: 'box',         // 9 - Defiance (การขัดขืน)
  10: 'churu',      // 10 - Victory (ชัยชนะ)
  11: 'healing',    // 11 - Standstill (การหยุดชะงัก)
  12: 'harmony',    // 12 - Love (ความรัก)
  13: 'churu',      // 13 - Lust (แรงปรารถนา)
  14: 'harmony',    // 14 - Exchange (การแลกเปลี่ยน)
  15: 'churu',      // 15 - Addiction (การเสพติด)
  16: 'box',        // 16 - Betrayal (การทรยศ)
  17: 'loaf',       // 17 - Indecision (ความลังเล)
  18: 'loaf',       // 18 - Ego (อัตตา)
  19: 'box',        // 19 - Boundary (ขอบเขต)
  20: 'harmony',    // 20 - Harmony (ความกลมเกลียว)
  21: 'loaf',       // 21 - Apathy (ความเฉยชา)
  22: 'churu',      // 22 - Recognition (การได้รับการยอมรับ)
  23: 'harmony',    // 23 - Closure (การปิดบท)
  24: 'churu',      // 24 - Prosperity (ความมั่งคั่ง)
  25: 'churu',      // 25 - Abundance (ความอุดมสมบูรณ์)
  26: 'loaf',       // 26 - Stability (ความมั่นคง)
  27: 'wish',       // 27 - Opportunity (โอกาส)
  28: 'healing',    // 28 - Hardship (ความยากลำบาก)
  29: 'box',        // 29 - Jealousy (ความหึงหวง)
  30: 'harmony',    // 30 - Generosity (ความเอื้อเฟื้อ)
  31: 'box',        // 31 - Independence (ความเป็นอิสระ)
  32: 'curiosity',  // 32 - Experts (ผู้เชี่ยวชาญ)
  33: 'churu',      // 33 - Legacy (สิ่งที่ส่งต่อ)
  34: 'wish',       // 34 - Achievement (ความสำเร็จ)
  35: 'loaf',       // 35 - Foundation (รากฐาน)
  36: 'box',        // 36 - Blind Spot (จุดบอด)
  37: 'healing',    // 37 - Burden (ภาระ)
  38: 'healing',    // 38 - Exhaustion (ความเหนื่อยล้า)
  39: 'healing',    // 39 - Collapse (การพังทลาย)
  40: 'box',        // 40 - Trapped (การติดกับ)
  41: 'healing',    // 41 - Torment (ความทุกข์ทรมาน)
  42: 'healing',    // 42 - Defeat (ความพ่ายแพ้)
  43: 'curiosity',  // 43 - Competition (การแข่งขัน)
  44: 'box',        // 44 - Verdict (คำตัดสิน)
  45: 'wish',       // 45 - Fate (โชคชะตา)
  46: 'curiosity',  // 46 - Perspective (มุมมอง)
  47: 'harmony',    // 47 - Moving On (การก้าวต่อ)
  48: 'curiosity',  // 48 - Unclear (ความไม่ชัดเจน)
  49: 'box',        // 49 - Fear (ความกลัว)
  50: 'box',        // 50 - Hidden (สิ่งที่ซ่อนอยู่)
  51: 'box',        // 51 - Resistance (การต่อต้าน)
  52: 'healing',    // 52 - Healing (การเยียวยา)
  53: 'healing',    // 53 - Patience (ความอดทนรอคอย)
  54: 'harmony',    // 54 - Trust (ความไว้วางใจ)
  55: 'churu',      // 55 - Joy (ความสุข)
  56: 'healing',    // 56 - Acceptance (การยอมรับ)
  57: 'curiosity',  // 57 - Curiosity (ความอยากรู้อยากเห็น)
  58: 'wish',       // 58 - Beginning (การเริ่มต้น)
  59: 'curiosity',  // 59 - Timing (จังหวะเวลา)
  60: 'loaf',       // 60 - Mastery (ความชำนาญ)
  61: 'wish'        // 61 - Explorer (การออกสำรวจ)
};

function updateCards(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;
  for (let id = 1; id <= 61; id++) {
    const theme = cardThemeMap[id] || 'wish';
    const imgPath = artMap[theme];
    const regex = new RegExp('("id":\\s*' + id + ',[\\s\\S]*?"image":\\s*")[^"]+(")', 'g');
    content = content.replace(regex, (match, p1, p2) => {
      count++;
      return p1 + imgPath + p2;
    });
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}: ${count} cards mapped to healing themes`);
}

updateCards('data/my-cat-cards.js');
updateCards('data/bumji-cards.js');
