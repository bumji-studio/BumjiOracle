// Test annual deep fortune generator
import '../data/bazi-knowledge/bazi-ten-gods-db.js';
import '../data/bazi-knowledge/bazi-elements-career-db.js';
import '../data/bazi-knowledge/bazi-stars-db.js';
import '../data/bazi-knowledge/bazi-interactions-db.js';
import '../data/bazi-knowledge/bazi-marriage-db.js';
import '../data/bazi-knowledge/bazi-chart-patterns-db.js';
import '../data/bazi-knowledge/bazi-annual-db.js';
import '../data/bazi-knowledge/index.js';

function generateDeepAnnualFortune(chart, y, curDaYun) {
  const dm = chart.dayMaster.zh; // '辛'
  
  // Year 2026: 丙午
  const yearStem = '丙';
  const yearBranch = '午';

  const stems = [chart.pillars.year.stem.zh, chart.pillars.month.stem.zh, chart.pillars.day.stem.zh, chart.pillars.hour.stem.zh];
  const branches = [chart.pillars.year.branch.zh, chart.pillars.month.branch.zh, chart.pillars.day.branch.zh, chart.pillars.hour.branch.zh];

  // 1. Check Tian Ke Di Chong with Da Yun (岁运天克地冲)
  let isTianKeDiChong = false;
  let luckClashDesc = '';
  if (curDaYun && curDaYun.stem && curDaYun.branch) {
    const daYunStem = curDaYun.stem.zh;
    const daYunBranch = curDaYun.branch.zh;

    // Stem clash: 丙 vs 壬, 甲 vs 庚, etc.
    const stemClash = (yearStem === '丙' && daYunStem === '壬') || (yearStem === '壬' && daYunStem === '丙') ||
                      (yearStem === '甲' && daYunStem === '庚') || (yearStem === '庚' && daYunStem === '甲') ||
                      (yearStem === '乙' && daYunStem === '辛') || (yearStem === '辛' && daYunStem === '乙') ||
                      (yearStem === '丁' && daYunStem === '癸') || (yearStem === '癸' && daYunStem === '丁');

    // Branch clash: 子-午, 丑-未, 寅-申, 卯-酉, 辰-戌, 巳-亥
    const branchClash = (yearBranch === '午' && daYunBranch === '子') || (yearBranch === '子' && daYunBranch === '午') ||
                        (yearBranch === '未' && daYunBranch === '丑') || (yearBranch === '丑' && daYunBranch === '未') ||
                        (yearBranch === '申' && daYunBranch === '寅') || (yearBranch === '寅' && daYunBranch === '申') ||
                        (yearBranch === '酉' && daYunBranch === '卯') || (yearBranch === '卯' && daYunBranch === '酉') ||
                        (yearBranch === '戌' && daYunBranch === '辰') || (yearBranch === '辰' && daYunBranch === '戌') ||
                        (yearBranch === '亥' && daYunBranch === '巳') || (yearBranch === '巳' && daYunBranch === '亥');

    if (stemClash && branchClash) {
      isTianKeDiChong = true;
      luckClashDesc = `ปีจร ${yearStem}${yearBranch} ปะทะกับวัยจร ${daYunStem}${daYunBranch} ทั้งฟ้าและดิน (岁运天克地冲: ${daYunStem} พิฆาต ${yearStem} และ ${daYunBranch} ชง ${yearBranch})`;
    }
  }

  // 2. Check San Hui (三会 - 巳午未)
  let isSanHuiFire = false;
  if (branches.includes('巳') && branches.includes('未') && yearBranch === '午') {
    isSanHuiFire = true;
  }

  // 3. Compose contextual readings
  let overview = '';
  let career = '';
  let wealth = '';
  let love = '';
  let health = '';

  if (isTianKeDiChong && isSanHuiFire) {
    overview = `ปี ${y} (丙午) ถือเป็น "มหาปีแห่งจุดเปลี่ยนผันและรื้อโครงสร้างชีวิตครั้งสำคัญในรอบ 10 ปี" (Major Breakthrough Turning Point)! เกิดปรากฏการณ์ "ปีจรปะทะวัยจรทั้งฟ้าและดิน" (岁运天克地冲 ระหว่างปีจร 丙午 กับวัยจร 壬子) ควบคู่กับ "ซาฮุ่ยไฟใต้ระดับมหาพลัง" (巳-午-未 三会火局) แรงผลักดันจากความตึงเครียดและภาระเดิมๆ จะบีบให้คุณ Bumji ต้องลุกขึ้นมาปฏิรูปเปลี่ยนแปลงวิถีชีวิต ปลดแอกสิ่งที่กดทับ และสร้างเส้นทางใหม่ที่เป็นของตนเอง`;
    career = `ไม่ใช่ปีที่นั่งรอการเลื่อนตำแหน่งแบบชิลๆ แต่เป็นปีแห่งการ "ปฏิวัติระบบงานและธุรกิจ" ปัญญาและวิสัยทัศน์ที่สั่งสมมา (伤官 壬น้ำ) จะถูกงัดออกมาสยบแรงกดดันและกฎเกณฑ์เก่าๆ (官杀 丙ไฟ) เหมาะอย่างยิ่งกับการเปิดตัวนวัตกรรมใหม่ ศาสตร์พยากรณ์ เทคโนโลยี หรือโปรเจกต์อิสระที่ตนเองเป็นผู้นำ ไม่ยอมทนอยู่ใต้ข้อกำหนดที่ไม่เป็นธรรมอีกต่อไป`;
    wealth = `เกิดกระแสเงินหมุนเวียนก้อนใหญ่ มีทั้งรายจ่ายจรในการลงทุนปรับเปลี่ยนธุรกิจ และรายได้ที่พร้อมเติบโตก้าวกระโดดจากไอเดียใหม่ กลยุทธ์สำคัญคือ "แปลงเงินสดเป็นสินทรัพย์ถาวร" (ที่ดิน, อสังหาฯ, ทองคำ) ทันทีที่ได้กำไร ห้ามให้ใครยืมเงินหรือค้ำประกันเด็ดขาด`;
    love = `ปีแห่งการชี้ขาดและจัดระเบียบความสัมพันธ์! การปะทะกันของน้ำกับไฟ (子午冲) จะไม่ยอมให้มีความคลุมเครือหรือความอึดอัดใจสะสมอีกต่อไป หากมีคู่ครองอยู่แล้ว แนะนำให้แก้เคล็ดด้วยการชวนกันเดินทางท่องเที่ยวไกลๆ ต่างจังหวัด/ต่างประเทศ หรือจัดห้องนอนใหม่เพื่อสลายพลังการปะทะ`;
    health = `จุดที่ต้องระมัดระวังที่สุดในปีนี้! ผลจากการที่ "น้ำปะทะไฟ" (子午相冲) รุนแรงมาก ต้องดูแล: 1. ระบบหัวใจ หลอดเลือด และความดันโลหิต 2. สายตา อาการไมเกรน และการนอนหลับ 3. ระบบฮอร์โมนสตรีและทางเดินปัสสาวะ ควรตรวจสุขภาพประจำปีแต่เนิ่นๆ บริจาคเลือด และฝึกสมาธิคลายความร้อนในใจ`;
  } else {
    overview = `ปี ${y} (${yearStem}${yearBranch}) เป็นปีแห่งการขับเคลื่อนความก้าวหน้าและการปรับสมดุลชีวิต`;
    career = `งานมีความเคลื่อนไหวและเปิดโอกาสให้แสดงศักยภาพ`;
    wealth = `บริหารการเงินอย่างรัดกุมและมองหาโอกาสการเติบโต`;
    love = `ความสัมพันธ์ดำเนินไปด้วยความเข้าใจและสนับสนุนซึ่งกันและกัน`;
    health = `ดูแลสมดุลสุขภาพและการพักผ่อนให้เหมาะสม`;
  }

  return { isTianKeDiChong, isSanHuiFire, luckClashDesc, overview, career, wealth, love, health };
}

// Test with mock Bumji chart
const mockChart = {
  dayMaster: { zh: '辛' },
  pillars: {
    year: { stem: { zh: '丁' }, branch: { zh: '巳' } },
    month: { stem: { zh: '丁' }, branch: { zh: '未' } },
    day: { stem: { zh: '辛' }, branch: { zh: '巳' } },
    hour: { stem: { zh: '丙' }, branch: { zh: '申' } }
  }
};
const curDaYun = { stem: { zh: '壬' }, branch: { zh: '子' } };

const annualRes = generateDeepAnnualFortune(mockChart, 2026, curDaYun);
console.log('Tian Ke Di Chong?:', annualRes.isTianKeDiChong);
console.log('San Hui Fire?:', annualRes.isSanHuiFire);
console.log('Luck Clash Desc:', annualRes.luckClashDesc);
console.log('\nOVERVIEW:\n', annualRes.overview);
console.log('\nCAREER:\n', annualRes.career);
console.log('\nWEALTH:\n', annualRes.wealth);
console.log('\nLOVE:\n', annualRes.love);
console.log('\nHEALTH:\n', annualRes.health);
