// Test generator for deep insights in bazi.js
import '../data/bazi-knowledge/bazi-ten-gods-db.js';
import '../data/bazi-knowledge/bazi-elements-career-db.js';
import '../data/bazi-knowledge/bazi-stars-db.js';
import '../data/bazi-knowledge/bazi-interactions-db.js';
import '../data/bazi-knowledge/bazi-marriage-db.js';
import '../data/bazi-knowledge/bazi-chart-patterns-db.js';
import '../data/bazi-knowledge/bazi-annual-db.js';
import '../data/bazi-knowledge/index.js';

function generateDeepInsights(chart) {
  const dm = chart.dayMaster.zh; // '辛'
  const dmTh = chart.dayMaster.th; // 'ซิง (ทองหยิน)'
  const gender = chart.gender; // 'female'
  
  // Element distribution
  const elemScores = chart.elementPercentages || {};
  const isFireHeavy = (elemScores.fire || 0) >= 35;
  const isWaterLow = (elemScores.water || 0) <= 10;
  const isMetalWeak = (elemScores.metal || 0) <= 25;

  // Stems & branches in chart
  const stems = [chart.pillars.year.stem.zh, chart.pillars.month.stem.zh, chart.pillars.day.stem.zh, chart.pillars.hour.stem.zh];
  const branches = [chart.pillars.year.branch.zh, chart.pillars.month.branch.zh, chart.pillars.day.branch.zh, chart.pillars.hour.branch.zh];

  // Check Guan Sha count
  const hasZhengGuan = stems.includes('丙') || branches.includes('巳');
  const hasQiSha = stems.includes('丁') || branches.includes('午') || branches.includes('未');
  const isGuanShaHunZa = hasZhengGuan && hasQiSha;

  // Check Bing-Xin He (丙辛合)
  const hasBingXinHe = stems.includes('丙') && stems.includes('辛');

  // 1. Traits
  let traits = '';
  if (dm === '辛' && isFireHeavy) {
    traits = `ดิถีทองซิง (辛金) เปรียบดั่งทองคำขาวและอัญมณีอันประณีตงดงาม มีรสนิยมสูง รักศักดิ์ศรีและความถูกต้อง แต่เนื่องจากในผังชะตามีธาตุไฟ (丁/丙/巳) แวดล้อมหนาแน่น ถือเป็นสภาพ "ทองน้อยเผชิญไฟแรงกล้า" ทำให้เป็นคนที่มีความมุ่งมั่น อดทนสูงส่ง เป็นเสาหลักที่แบกรับภาระหน้าที่และความรับผิดชอบล้นพ้นตัว`;
    if (isGuanShaHunZa) {
      traits += ` ทั้งยังมีโครงสร้าง "กัวสัวะปะปน" (官杀混杂) จึงรวมเอาความสุขุม มีวินัย รักเกียรติยศ (เจียกัว) เข้ากับความเด็ดเดี่ยว กล้าลุย ไม่ยอมก้มหัวให้ใคร (ฉิกสัวะ) เป็นคนภายนอกดูนุ่มนวลสง่างาม แต่ภายในใจเด็ดเดี่ยว ใจสู้ และมีความเป็นผู้นำสูงมาก`;
    }
    if (hasBingXinHe) {
      traits += ` ก้านฟ้ายามเปี้ยไฟทำปฏิกิริยา "เปี้ย-ซิง ฮะ" (丙辛合) ดึงดูดอำนาจและเสน่ห์บารมี ทำให้เป็นที่นับถือและมีจิตวิทยาในการโน้มน้าวผู้คน`;
    }
  } else {
    traits = `ดิถี${dmTh} เป็นคนมีเอกลักษณ์เฉพาะตัว มีความตั้งใจจริงและยึดมั่นในอุดมการณ์`;
  }

  // 2. Career
  let career = '';
  if (isGuanShaHunZa || isFireHeavy) {
    career = `โครงสร้างกัวสัวะหนุนนำอำนาจและบารมี เหมาะอย่างยิ่งกับบทบาท "ผู้นำ ผู้บริหาร ที่ปรึกษา ผู้เชี่ยวชาญเฉพาะทาง หรือเจ้าของธุรกิจส่วนตัว" มีความสามารถในการจัดระเบียบองค์กร บริหารคน และแก้วิกฤติต่างๆ ได้เฉียบคม`;
    career += ` เสริมด้วยธาตุย้งซิ้ง "ดินเปียกและน้ำ" ทำให้โดดเด่นเป็นพิเศษในสายงานนวัตกรรม การวางแผนกลยุทธ์ งานศาสตร์พยากรณ์/โหราศาสตร์ สื่อสารมวลชน เทคโนโลยี หรืองานที่ต้องใช้ทักษะความรู้เฉพาะตัว ไม่เหมาะกับการอยู่ใต้กฎระเบียบที่ไร้เหตุผล`;
  } else {
    career = `เหมาะกับงานที่อาศัยความเชี่ยวชาญเฉพาะด้านและการบริหารจัดการอย่างเป็นระบบ`;
  }

  // 3. Wealth
  let wealth = '';
  if (isFireHeavy && isMetalWeak) {
    wealth = `มีกระแสเงินทองหมุนเวียนก้อนใหญ่ตลอดเวลา มักมีรายได้เข้ามาจากความสามารถเฉพาะตัวและตำแหน่งหน้าที่ แต่เนื่องจากภาระและความรับผิดชอบรอบตัวมีมาก ทำให้เงินทองเข้าเร็วและมีเรื่องต้องใช้จ่ายหรือหมุนเวียนเร็วเช่นกัน`;
    wealth += ` กลยุทธ์การเงินที่ดีที่สุดคือ "ไม่ควรเก็บเป็นเงินสดไว้เฉยๆ" แต่ควรแปลงเป็นสินทรัพย์ถาวร เช่น อสังหาริมทรัพย์ ที่ดิน หรือทองคำแท่ง (ธาตุดินและธาตุทอง) จะช่วยเก็บกักความมั่งคั่งได้อย่างยั่งยืน และหลีกเลี่ยงการค้ำประกันหรือให้ผู้อื่นยืมเงิน`;
  } else {
    wealth = `การเงินเติบโตตามผลงาน มีสภาพคล่องที่ดีเมื่อวางแผนอย่างเป็นระบบ`;
  }

  // 4. Love & Marriage
  let love = '';
  if (gender === 'female' && isGuanShaHunZa) {
    love = `ตามตำราว่าด้วยคู่ครอง: สตรีที่มี "กัวสัวะปะปน" (官杀混杂) มักเป็นคนมีเสน่ห์ดึงดูดใจเพศตรงข้าม มีผู้ชายเข้ามาให้เลือกหลายรูปแบบ แต่เส้นทางความรักมักมาพร้อมกับภาระ ความกดดัน หรือคู่ครองมีบุคลิกเด็ดเดี่ยว/ชอบบงการ`;
    if (branches[2] === '巳') {
      love += ` เสาวันเป็น 辛巳 (เรือนคู่ครองเป็นธาตุไฟ 巳 ซึ่งควบคุมดิถี) บ่งบอกว่าคู่ครองเป็นคนเก่ง มีตำแหน่งหรือภาวะผู้นำสูง แต่อาจมีความคิดเห็นไม่ตรงกันในบางเรื่อง การครองคู่ที่ดีจึงต้องใช้ความเข้าใจ ให้อิสระทางความคิด และชวนกันเดินทางท่องเที่ยวเปลี่ยนบรรยากาศ`;
    }
  } else {
    love = `ความสัมพันธ์เน้นความจริงใจและความเข้าใจซึ่งกันและกัน`;
  }

  // 5. Health
  let health = '';
  if (isFireHeavy) {
    health = `เนื่องจากธาตุไฟในดวงมีพลังเข้มข้นมาก จุดที่ต้องดูแลเป็นพิเศษคือ: ระบบหัวใจ หลอดเลือด ความดันโลหิต สายตา อาการไมเกรน และภาวะตึงเครียดนอนไม่หลับจากความคิดที่แล่นตลอดเวลา`;
    if (isWaterLow) {
      health += ` อีกทั้งธาตุน้ำถูกไฟต้มระเหย ควรระวังระบบทางเดินปัสสาวะ ไต และระบบฮอร์โมนสตรี แนะนำให้ดื่มน้ำสะอาดให้เพียงพอ ทำสมาธิคลายเครียด และจัดสภาพแวดล้อมให้อยู่ใกล้สายน้ำหรือธรรมชาติสีเขียว`;
    }
  } else {
    health = `รักษาสมดุลการพักผ่อนและการออกกำลังกายอย่างสม่ำเสมอ`;
  }

  return { traits, career, wealth, love, health };
}

console.log('Testing deep insights generator...');
// Mock chart for Bumji
const mockChart = {
  dayMaster: { zh: '辛', th: 'ซิง (ทองหยิน)' },
  gender: 'female',
  elementPercentages: { fire: 55, metal: 20, earth: 15, water: 5, wood: 5 },
  pillars: {
    year: { stem: { zh: '丁' }, branch: { zh: '巳' } },
    month: { stem: { zh: '丁' }, branch: { zh: '未' } },
    day: { stem: { zh: '辛' }, branch: { zh: '巳' } },
    hour: { stem: { zh: '丙' }, branch: { zh: '申' } }
  }
};

const insights = generateDeepInsights(mockChart);
console.log('\n--- 1. TRAITS ---');
console.log(insights.traits);
console.log('\n--- 2. CAREER ---');
console.log(insights.career);
console.log('\n--- 3. WEALTH ---');
console.log(insights.wealth);
console.log('\n--- 4. LOVE ---');
console.log(insights.love);
console.log('\n--- 5. HEALTH ---');
console.log(insights.health);
