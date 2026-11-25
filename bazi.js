/**
 * ============================================================================
 * BAZI FOUR PILLARS OF DESTINY (八字命理) ENGINE & CONTROLLER
 * Comprehensive Professional BaZi Analysis System
 * Features:
 *  - Four Pillars Matrix (Year, Month, Day, Hour) with Hidden Stems & NaYin
 *  - Five Elements Balance (Scores & Percentages) & Favorable Gods (喜用神)
 *  - Da Yun 10-Year Luck Pillars with Interactive Deep Decade Readings
 *  - Annual Fortune Prediction (流年 Liu Nian) with Clashes/Harmonies Analysis
 *  - Monthly Fortune Prediction (流月 Liu Yue) for all 12 Solar Months
 *  - Saved Profiles Manager (LocalStorage CRUD with Quick Switcher)
 * ============================================================================
 */

(function () {
  'use strict';

  // 1. Ten Heavenly Stems (十天干)
  const STEMS = [
    { zh: '甲', py: 'Jia', th: 'กะ (ไม้หยาง)', element: 'wood', polarity: 'yang', desc: 'ไม้ใหญ่ ยืนต้นมั่นคง เปี่ยมคุณธรรม มีความเป็นผู้นำ' },
    { zh: '乙', py: 'Yi', th: 'อิก (ไม้หยิน)', element: 'wood', polarity: 'yin', desc: 'ไม้เลื้อย พืชพรรณ ยืดหยุ่น ปรับตัวเก่ง มีไหวพริบ' },
    { zh: '丙', py: 'Bing', th: 'เปี้ย (ไฟหยาง)', element: 'fire', polarity: 'yang', desc: 'พระอาทิตย์ สดใส อบอุ่น ตรงไปตรงมา กระตือรือร้น' },
    { zh: '丁', py: 'Ding', th: 'เต็ง (ไฟหยิน)', element: 'fire', polarity: 'yin', desc: 'ดวงประทีป เปลวเทียน อ่อนโยนแต่ทรงพลัง รอบรู้ มีสติปัญญา' },
    { zh: '戊', py: 'Wu', th: 'โบ่ว (ดินหยาง)', element: 'earth', polarity: 'yang', desc: 'ภูเขาใหญ่ หนักแน่น น่าเชื่อถือ มั่นคง ซื่อสัตย์' },
    { zh: '己', py: 'Ji', th: 'กี้ (ดินหยิน)', element: 'earth', polarity: 'yin', desc: 'ดินแปลงเกษตร โอบอ้อมอารี เลี้ยงดูเก่ง ใจกว้าง เข้าใจผู้อื่น' },
    { zh: '庚', py: 'Geng', th: 'แก (ทองหยาง)', element: 'metal', polarity: 'yang', desc: 'ดาบเหล็กกล้า เด็ดขาด ชัดเจน กล้าหาญ รักความยุติธรรม' },
    { zh: '辛', py: 'Xin', th: 'ซิง (ทองหยิน)', element: 'metal', polarity: 'yin', desc: 'อัญมณี ส่องประกาย สง่างาม มีรสนิยม รักศักดิ์ศรี' },
    { zh: '壬', py: 'Ren', th: 'หยิม (น้ำหยาง)', element: 'water', polarity: 'yang', desc: 'มหาสมุทร ทรงพลัง คล่องแคล่ว มีวิสัยทัศน์กว้างไกล' },
    { zh: '癸', py: 'Gui', th: 'กุ่ย (น้ำหยิน)', element: 'water', polarity: 'yin', desc: 'น้ำค้าง สายฝน ช่างคิด ฉลาด ลึกล้ำ มีญาณหยั่งรู้' }
  ];

  // 2. Twelve Earthly Branches (十二地支)
  const BRANCHES = [
    { zh: '子', py: 'Zi', th: 'จื่อ (ชวด - หนู)', zodiac: 'หนู (Rat)', animal: 'หนู', element: 'water', polarity: 'yang', season: 'winter', monthNum: 11, hidden: [{ stem: '癸', weight: 1.0 }] },
    { zh: '丑', py: 'Chou', th: 'โฉ่ว (ฉลู - วัว)', zodiac: 'วัว (Ox)', animal: 'วัว', element: 'earth', polarity: 'yin', season: 'winter', monthNum: 12, hidden: [{ stem: '己', weight: 0.6 }, { stem: '癸', weight: 0.3 }, { stem: '辛', weight: 0.1 }] },
    { zh: '寅', py: 'Yin', th: 'อิ๋น (ขาล - เสือ)', zodiac: 'เสือ (Tiger)', animal: 'เสือ', element: 'wood', polarity: 'yang', season: 'spring', monthNum: 1, hidden: [{ stem: '甲', weight: 0.6 }, { stem: '丙', weight: 0.3 }, { stem: '戊', weight: 0.1 }] },
    { zh: '卯', py: 'Mao', th: 'เหม่า (เถาะ - กระต่าย)', zodiac: 'กระต่าย (Rabbit)', animal: 'กระต่าย', element: 'wood', polarity: 'yin', season: 'spring', monthNum: 2, hidden: [{ stem: '乙', weight: 1.0 }] },
    { zh: '辰', py: 'Chen', th: 'เฉิน (มะโรง - มังกร)', zodiac: 'มังกร (Dragon)', animal: 'มังกร', element: 'earth', polarity: 'yang', season: 'spring', monthNum: 3, hidden: [{ stem: '戊', weight: 0.6 }, { stem: '乙', weight: 0.3 }, { stem: '癸', weight: 0.1 }] },
    { zh: '巳', py: 'Si', th: 'ซื่อ (มะเส็ง - งูเล็ก)', zodiac: 'งู (Snake)', animal: 'งู', element: 'fire', polarity: 'yin', season: 'summer', monthNum: 4, hidden: [{ stem: '丙', weight: 0.6 }, { stem: '戊', weight: 0.3 }, { stem: '庚', weight: 0.1 }] },
    { zh: '午', py: 'Wu', th: 'อู่ (มะเมีย - ม้า)', zodiac: 'ม้า (Horse)', animal: 'ม้า', element: 'fire', polarity: 'yang', season: 'summer', monthNum: 5, hidden: [{ stem: '丁', weight: 0.7 }, { stem: '己', weight: 0.3 }] },
    { zh: '未', py: 'Wei', th: 'เว่ย (มะแม - แพะ)', zodiac: 'แพะ (Goat)', animal: 'แพะ', element: 'earth', polarity: 'yin', season: 'summer', monthNum: 6, hidden: [{ stem: '己', weight: 0.6 }, { stem: '丁', weight: 0.3 }, { stem: '乙', weight: 0.1 }] },
    { zh: '申', py: 'Shen', th: 'เซิน (วอก - ลิง)', zodiac: 'ลิง (Monkey)', animal: 'ลิง', element: 'metal', polarity: 'yang', season: 'autumn', monthNum: 7, hidden: [{ stem: '庚', weight: 0.6 }, { stem: '壬', weight: 0.3 }, { stem: '戊', weight: 0.1 }] },
    { zh: '酉', py: 'You', th: 'โหย่ว (ระกา - ไก่)', zodiac: 'ไก่ (Rooster)', animal: 'ไก่', element: 'metal', polarity: 'yin', season: 'autumn', monthNum: 8, hidden: [{ stem: '辛', weight: 1.0 }] },
    { zh: '戌', py: 'Xu', th: 'ซวี (จอ - หมา)', zodiac: 'หมา (Dog)', animal: 'หมา', element: 'earth', polarity: 'yang', season: 'autumn', monthNum: 9, hidden: [{ stem: '戊', weight: 0.6 }, { stem: '辛', weight: 0.3 }, { stem: '丁', weight: 0.1 }] },
    { zh: '亥', py: 'Hai', th: 'ฮ่าย (กุน - หมู)', zodiac: 'หมู (Pig)', animal: 'หมู', element: 'water', polarity: 'yin', season: 'winter', monthNum: 10, hidden: [{ stem: '壬', weight: 0.7 }, { stem: '甲', weight: 0.3 }] }
  ];

  // 3. Five Elements Meta (五行)
  const ELEMENTS_META = {
    wood: { th: 'ธาตุไม้', zh: '木', color: '#10b981', dark: '#059669', light: '#6ee7b7', lightBg: 'rgba(16, 185, 129, 0.12)', border: '#10b981', generates: 'fire', controls: 'earth', direction: 'ตะวันออก', organ: 'ตับ / ถุงน้ำดี / สายตา', emotion: 'ความเมตตา / การเติบโต' },
    fire: { th: 'ธาตุไฟ', zh: '火', color: '#ef4444', dark: '#dc2626', light: '#fca5a5', lightBg: 'rgba(239, 68, 68, 0.12)', border: '#ef4444', generates: 'earth', controls: 'metal', direction: 'ทิศใต้', organ: 'หัวใจ / หลอดเลือด / สมอง', emotion: 'ความมีชีวิตชีวา / ความหลงใหล' },
    earth: { th: 'ธาตุดิน', zh: '土', color: '#d97706', dark: '#b45309', light: '#fcd34d', lightBg: 'rgba(217, 119, 6, 0.12)', border: '#d97706', generates: 'metal', controls: 'water', direction: 'จุดศูนย์กลาง / ตกเฉียงใต้', organ: 'ม้าม / กระเพาะอาหาร / ย่อยอาหาร', emotion: 'ความน่าเชื่อถือ / ความสงบ' },
    metal: { th: 'ธาตุทอง', zh: '金', color: '#64748b', dark: '#475569', light: '#cbd5e1', lightBg: 'rgba(100, 116, 139, 0.14)', border: '#64748b', generates: 'water', controls: 'wood', direction: 'ทิศตะวันตก', organ: 'ปอด / ผิวหนัง / ทางเดินหายใจ', emotion: 'ความเฉียบขาด / ระเบียบวินัย' },
    water: { th: 'ธาตุน้ำ', zh: '水', color: '#0284c7', dark: '#0369a1', light: '#7dd3fc', lightBg: 'rgba(2, 132, 199, 0.12)', border: '#0284c7', generates: 'wood', controls: 'fire', direction: 'ทิศเหนือ', organ: 'ไต / กระเพาะปัสสาวะ / หู', emotion: 'สติปัญญา / ความยืดหยุ่น' }
  };

  // 4. Ten Gods (十神) Definition and Relations
  const TEN_GODS_MAP = {
    'same_same': { zh: '比肩', py: 'Bi Jian', th: 'เพื่อนร่วมทาง (比肩)', en: 'Friend', role: 'ตนเอง มิตรสหาย พี่น้อง ความมั่นใจ ความเป็นอิสระ' },
    'same_diff': { zh: '劫財', py: 'Jie Cai', th: 'ช่วงชิงทรัพย์ (劫財)', en: 'Rob Wealth', role: 'การแข่งขัน มนุษยสัมพันธ์ ความกล้าได้กล้าเสีย การแบ่งปัน' },
    'gen_same': { zh: '食神', py: 'Shi Shen', th: 'ดาวผลิตทรัพย์ (食神)', en: 'Eating God', role: 'สุนทรียภาพ ศิลปะ จินตนาการ ความสุขุม การเจรจา' },
    'gen_diff': { zh: '傷官', py: 'Shang Guan', th: 'ดาวฝ่ากฎเกณฑ์ (傷官)', en: 'Hurting Officer', role: 'นวัตกรรม ปฏิภาณไหวพริบ ฉีกกรอบ ความสามารถพิเศษ' },
    'ctrl_same': { zh: '偏財', py: 'Pian Cai', th: 'โชคลาภพิเศษ (偏財)', en: 'Indirect Wealth', role: 'การลงทุน ลาภลอย โอกาสทางธุรกิจ เงินหมุนเวียน' },
    'ctrl_diff': { zh: '正財', py: 'Zheng Cai', th: 'ทรัพย์มั่นคง (正財)', en: 'Direct Wealth', role: 'รายได้ประจำ วินัยการออม ความซื่อสัตย์ ความรับผิดชอบ' },
    'ctrld_same': { zh: '七殺', py: 'Qi Sha', th: 'อำนาจบารมี (七殺)', en: 'Seven Killings', role: 'ความเด็ดขาด ภาวะผู้นำ กล้าเผชิญหน้า จัดการวิกฤต' },
    'ctrld_diff': { zh: '正官', py: 'Zheng Guan', th: 'เกียรติยศชื่อเสียง (正官)', en: 'Direct Officer', role: 'ตำแหน่งหน้าที่ ระเบียบแบบแผน คุณธรรม วินัย' },
    'gend_same': { zh: '偏印', py: 'Pian Yin', th: 'ปัญญาญาณหยั่งรู้ (偏印)', en: 'Indirect Resource', role: 'ศาสตร์ลี้ลับ วิสัยทัศน์พิเศษ ความคิดลึกซึ้ง เอกลักษณ์' },
    'gend_diff': { zh: '正印', py: 'Zheng Yin', th: 'ผู้อุปถัมภ์เกื้อหนุน (正印)', en: 'Direct Resource', role: 'ผู้ใหญ่ช่วยเหลือ ความรู้ ความเมตตา สุขภาพกายใจ' }
  };

  function getTenGod(dayStemObj, targetStemObj) {
    if (!dayStemObj || !targetStemObj) return TEN_GODS_MAP['same_same'];
    const dElem = dayStemObj.element;
    const tElem = targetStemObj.element;
    const samePolarity = dayStemObj.polarity === targetStemObj.polarity;

    if (dElem === tElem) {
      return samePolarity ? TEN_GODS_MAP['same_same'] : TEN_GODS_MAP['same_diff'];
    }
    if (ELEMENTS_META[dElem].generates === tElem) {
      return samePolarity ? TEN_GODS_MAP['gen_same'] : TEN_GODS_MAP['gen_diff'];
    }
    if (ELEMENTS_META[dElem].controls === tElem) {
      return samePolarity ? TEN_GODS_MAP['ctrl_same'] : TEN_GODS_MAP['ctrl_diff'];
    }
    if (ELEMENTS_META[tElem].generates === dElem) {
      return samePolarity ? TEN_GODS_MAP['gend_same'] : TEN_GODS_MAP['gend_diff'];
    }
    if (ELEMENTS_META[tElem].controls === dElem) {
      return samePolarity ? TEN_GODS_MAP['ctrld_same'] : TEN_GODS_MAP['ctrld_diff'];
    }
    return TEN_GODS_MAP['same_same'];
  }

  // 5. 60 NaYin (六十甲子納音)
  const NAYIN_TABLE = [
    '海中金 (ทองในมหาสมุทร)', '海中金 (ทองในมหาสมุทร)', '爐中火 (ไฟในเตาหลอม)', '爐中火 (ไฟในเตาหลอม)',
    '大林木 (ไม้ในป่าใหญ่)', '大林木 (ไม้ในป่าใหญ่)', '路旁土 (ดินริมทาง)', '路旁土 (ดินริมทาง)',
    '劍鋒金 (ทองปลายกระบี่)', '劍鋒金 (ทองปลายกระบี่)', '山頭火 (ไฟบนยอดเขา)', '山頭火 (ไฟบนยอดเขา)',
    '澗下水 (น้ำในลำธาร)', '澗下水 (น้ำในลำธาร)', '城頭土 (ดินบนกำแพงเมือง)', '城頭土 (ดินบนกำแพงเมือง)',
    '白蠟金 (ทองขาวบริสุทธิ์)', '白蠟金 (ทองขาวบริสุทธิ์)', '楊柳木 (ไม้ต้นหลิว)', '楊柳木 (ไม้ต้นหลิว)',
    '泉中水 (น้ำพุใต้พิภพ)', '泉中水 (น้ำพุใต้พิภพ)', '屋上土 (ดินบนหลังคา)', '屋上土 (ดินบนหลังคา)',
    '霹雳火 (ไฟสายฟ้าฟาด)', '霹雳火 (ไฟสายฟ้าฟาด)', '松柏木 (ไม้สนยืนต้น)', '松柏木 (ไม้สนยืนต้น)',
    '長流水 (น้ำไหลไม่สิ้นสุด)', '長流水 (น้ำไหลไม่สิ้นสุด)', '砂中金 (ทองในหาดทราย)', '砂中金 (ทองในหาดทราย)',
    '山下火 (ไฟเชิงเขา)', '山下火 (ไฟเชิงเขา)', '平地木 (ไม้บนที่ราบ)', '平地木 (ไม้บนที่ราบ)',
    '壁上土 (ดินฉาบฝาผนัง)', '壁上土 (ดินฉาบฝาผนัง)', '金箔金 (ทองคำเปลว)', '金箔金 (ทองคำเปลว)',
    '覆燈火 (ไฟดวงประทีป)', '覆燈火 (ไฟดวงประทีป)', '天河水 (น้ำแม่น้ำสวรรค์)', '天河水 (น้ำแม่น้ำสวรรค์)',
    '大驛土 (ดินสถานีใหญ่)', '大驛土 (ดินสถานีใหญ่)', '釵釧金 (ทองปิ่นปักผม)', '釵釧金 (ทองปิ่นปักผม)',
    '桑柘木 (ไม้หม่อนมงคล)', '桑柘木 (ไม้หม่อนมงคล)', '大溪水 (น้ำในห้วยใหญ่)', '大溪水 (น้ำในห้วยใหญ่)',
    '沙中土 (ดินทรายปนหิน)', '沙中土 (ดินทรายปนหิน)', '天上火 (ไฟบนท้องนภา)', '天上火 (ไฟบนท้องนภา)',
    '石榴木 (ไม้ทับทิมมงคล)', '石榴木 (ไม้ทับทิมมงคล)', '大海水 (น้ำในทะเลหลวง)', '大海水 (น้ำในทะเลหลวง)'
  ];

  function getNaYin(stemIdx, branchIdx) {
    const s = stemIdx;
    const b = branchIdx;
    let cycle = 0;
    for (let i = 0; i < 60; i++) {
      if (i % 10 === s && i % 12 === b) {
        cycle = i;
        break;
      }
    }
    return NAYIN_TABLE[cycle] || '五行之氣';
  }

  // 6. Branch Clash & Harmony Rules
  const CLASH_PAIRS = [
    { a: '子', b: '午', th: 'ชวด ปะทะ มะเมีย (น้ำปะทะไฟ: ระวังอารมณ์ สายตา ความดัน)' },
    { a: '丑', b: '未', th: 'ฉลู ปะทะ มะแม (ดินปะทะดิน: ระวังระบบย่อยอาหาร อสังหาฯ ทรัพย์สิน)' },
    { a: '寅', b: '申', th: 'ขาล ปะทะ วอก (ไม้ปะทะทอง: ระวังอุบัติเหตุ ยวดยาน การเดินทาง)' },
    { a: '卯', b: '酉', th: 'เถาะ ปะทะ ระกา (ไม้ปะทะทอง: ระวังความสัมพันธ์ ของมีคม รักสามเส้า)' },
    { a: '辰', b: '戌', th: 'มะโรง ปะทะ จอ (ดินปะทะดิน: การเปลี่ยนแปลงโครงสร้าง การงาน ผู้ใหญ่)' },
    { a: '巳', b: '亥', th: 'มะเส็ง ปะทะ กุน (ไฟปะทะน้ำ: ความคิดสับสน โยกย้ายที่อยู่หรือสายงาน)' }
  ];

  const HARMONY_PAIRS = [
    { a: '子', b: '丑', name: 'ชวด-ฉลู สมพงศ์ธาตุดิน' },
    { a: '寅', b: '亥', name: 'ขาล-กุน สมพงศ์ธาตุไม้' },
    { a: '卯', b: '戌', name: 'เถาะ-จอ สมพงศ์ธาตุไฟ' },
    { a: '辰', b: '酉', name: 'มะโรง-ระกา สมพงศ์ธาตุทอง' },
    { a: '巳', b: '申', name: 'มะเส็ง-วอก สมพงศ์ธาตุน้ำ' },
    { a: '午', b: '未', name: 'มะเมีย-มะแม สมพงศ์ธาตุไฟ/ดิน' }
  ];

  function checkBranchClash(b1, b2) {
    return CLASH_PAIRS.find(p => (p.a === b1 && p.b === b2) || (p.a === b2 && p.b === b1));
  }

  function checkBranchHarmony(b1, b2) {
    return HARMONY_PAIRS.find(p => (p.a === b1 && p.b === b2) || (p.a === b2 && p.b === b1));
  }

  // 7. Special Shen Sha (神煞 - Stars of Destiny)
  function computeShenSha(dayStemObj, dayBranchObj, yearBranchObj, targetBranchObj) {
    const stars = [];
    const tb = targetBranchObj.zh;
    const ds = dayStemObj.zh;
    const db = dayBranchObj.zh;
    const yb = yearBranchObj.zh;

    const tianYiMap = {
      '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'],
      '乙': ['子', '申'], '己': ['子', '申'],
      '丙': ['亥', '酉'], '丁': ['亥', '酉'],
      '壬': ['卯', '巳'], '癸': ['卯', '巳'],
      '辛': ['午', '寅']
    };
    if (tianYiMap[ds] && tianYiMap[ds].includes(tb)) {
      stars.push({ name: 'ดาวเทียนอี่กุ้ยเหริน (天乙貴人)', desc: 'ดาวผู้ใหญ่อุปถัมภ์ คลาดแคล้วภัย มีคนยื่นมือช่วยเสมอยามยาก' });
    }

    const wenChangMap = {
      '甲': '巳', '乙': '午', '丙': '申', '丁': '酉', '戊': '申',
      '己': '酉', '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯'
    };
    if (wenChangMap[ds] === tb) {
      stars.push({ name: 'ดาวบุ๋นชัง (文昌貴人)', desc: 'ดาวปัญญา วิชาการ การเรียนรู้โดดเด่น สอบแข่งขันราบรื่น มีไหวพริบ' });
    }

    const yiMaMap = {
      '申': '寅', '子': '寅', '辰': '寅',
      '寅': '申', '午': '申', '戌': '申',
      '巳': '亥', '酉': '亥', '丑': '亥',
      '亥': '巳', '卯': '巳', '未': '巳'
    };
    if (yiMaMap[yb] === tb || yiMaMap[db] === tb) {
      stars.push({ name: 'ดาวอี้หม่า (驛馬星)', desc: 'ดาวม้าสวรรค์ เดินทางไกล ได้ดีต่างแดน ปรับตัวไว มีความคล่องตัวสูง' });
    }

    const taoHuaMap = {
      '申': '酉', '子': '酉', '辰': '酉',
      '寅': '卯', '午': '卯', '戌': '卯',
      '巳': '午', '酉': '午', '丑': '午',
      '亥': '子', '卯': '子', '未': '子'
    };
    if (taoHuaMap[yb] === tb || taoHuaMap[db] === tb) {
      stars.push({ name: 'ดาวดอกท้อ (桃花星)', desc: 'ดาวเสน่ห์เมตตามหานิยม มีแรงดึงดูด ผู้คนรักใคร่เอ็นดู โดดเด่นในสังคม' });
    }

    const huaGaiMap = {
      '申': '辰', '子': '辰', '辰': '辰',
      '寅': '戌', '午': '戌', '戌': '戌',
      '巳': '丑', '酉': '丑', '丑': '丑',
      '亥': '未', '卯': '未', '未': '未'
    };
    if (huaGaiMap[yb] === tb || huaGaiMap[db] === tb) {
      stars.push({ name: 'ดาวหัวก่าย (華蓋星)', desc: 'ดาวศิลปะ ญาณทัศนะ สนใจปรัชญา โลกทัศน์ลึกซึ้ง โดดเด่นทางงานสร้างสรรค์' });
    }

    const luShenMap = {
      '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午', '戊': '巳',
      '己': '午', '庚': '申', '辛': '酉', '壬': '亥', '癸': '子'
    };
    if (luShenMap[ds] === tb) {
      stars.push({ name: 'ดาวลกซิ้ง (祿神星)', desc: 'ดาวโภคทรัพย์ ลาภผลมั่นคง มีกินมีใช้ พึ่งพาความสามารถตนเองสำเร็จ' });
    }

    return stars;
  }

  // 8. Core BaZi Engine
  const BaziEngine = {
    STEMS,
    BRANCHES,
    ELEMENTS_META,

    calculateChart: function (params) {
      const {
        birthDate, // 'YYYY-MM-DD'
        birthHour = 12, // 0-23
        birthMinute = 0,
        gender = 'male', // 'male' or 'female'
        name = 'Bumji',
        isUnknownTime = false
      } = params;

      const date = new Date(birthDate + 'T' + String(birthHour).padStart(2, '0') + ':' + String(birthMinute).padStart(2, '0') + ':00');
      const year = date.getFullYear();
      const month = date.getMonth(); // 0-11
      const day = date.getDate();

      // 1. Year Pillar (Li Chun threshold approx Feb 4)
      let baziYear = year;
      if (month < 1 || (month === 1 && day < 4)) {
        baziYear = year - 1;
      }
      const yrStemIdx = ((baziYear - 4) % 10 + 10) % 10;
      const yrBranchIdx = ((baziYear - 4) % 12 + 12) % 12;
      const yearStem = STEMS[yrStemIdx];
      const yearBranch = BRANCHES[yrBranchIdx];

      // 2. Month Pillar
      const solarCutoffs = [5, 4, 5, 5, 5, 6, 7, 7, 7, 8, 7, 7];
      let solarM = month;
      if (day < solarCutoffs[month]) {
        solarM = (month + 11) % 12;
      }
      const mBranchMap = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];
      const mBranchIdx = mBranchMap[solarM];
      const monthBranch = BRANCHES[mBranchIdx];

      const mTigerStart = (yrStemIdx % 5) * 2 + 2;
      const mOffsetFromYin = (mBranchIdx - 2 + 12) % 12;
      const mStemIdx = (mTigerStart + mOffsetFromYin) % 10;
      const monthStem = STEMS[mStemIdx];

      // 3. Day Pillar (Julian Days from Epoch)
      const baseUTC = Date.UTC(2000, 0, 1);
      const targetUTC = Date.UTC(year, month, day);
      const diffDays = Math.round((targetUTC - baseUTC) / 86400000);
      const dayCycle = ((54 + diffDays) % 60 + 60) % 60;
      const dayStemIdx = dayCycle % 10;
      const dayBranchIdx = dayCycle % 12;
      const dayStem = STEMS[dayStemIdx]; // Day Master (日主)
      const dayBranch = BRANCHES[dayBranchIdx];

      // 4. Hour Pillar
      const hBranchIdx = Math.floor((birthHour + 1) % 24 / 2);
      const hourBranch = BRANCHES[hBranchIdx];

      const hRatStart = (dayStemIdx % 5) * 2;
      const hStemIdx = (hRatStart + hBranchIdx) % 10;
      const hourStem = STEMS[hStemIdx];

      // Build Pillars
      const buildPillar = (stem, branch, stemIdx, branchIdx, labelTh, roleTh) => {
        const isDayMaster = labelTh === 'เสาวัน (Day)';
        const tenGod = isDayMaster ? { zh: '日主', py: 'Day Master', th: 'ดิถีธาตุ (ตนเอง)', en: 'Self' } : getTenGod(dayStem, stem);
        const hiddenStemsWithGods = branch.hidden.map(h => {
          const hStemObj = STEMS.find(s => s.zh === h.stem);
          return {
            ...h,
            stemObj: hStemObj,
            tenGod: getTenGod(dayStem, hStemObj)
          };
        });
        const naYin = getNaYin(stemIdx, branchIdx);
        const stars = computeShenSha(dayStem, dayBranch, yearBranch, branch);

        return {
          label: labelTh,
          role: roleTh,
          stem,
          branch,
          tenGod,
          hiddenStems: hiddenStemsWithGods,
          naYin,
          stars
        };
      };

      const pillars = {
        hour: buildPillar(hourStem, hourBranch, hStemIdx, hBranchIdx, 'เสายาม (Hour)', 'บริวาร บุตรหลาน วัยชรา (49+ ปี) ความปรารถนาลึกๆ'),
        day: buildPillar(dayStem, dayBranch, dayStemIdx, dayBranchIdx, 'เสาวัน (Day)', 'จิตวิญญาณ ตัวตนแก่นแท้ วังคู่ครอง (33-48 ปี)'),
        month: buildPillar(monthStem, monthBranch, mStemIdx, mBranchIdx, 'เสาเดือน (Month)', 'การงาน ธุรกิจ พ่อแม่ วัยสร้างตัว (17-32 ปี) สภาพแวดล้อม'),
        year: buildPillar(yearStem, yearBranch, yrStemIdx, yrBranchIdx, 'เสาปี (Year)', 'บรรพบุรุษ สังคมภายนอก วัยเด็ก (0-16 ปี) ภาพลักษณ์แรกพบ')
      };

      // 5. Five Elements Calculation (สูตรแท้มาตรฐานชั่งน้ำหนักดวงและสิบเทพ)
      // 5. Five Elements Calculation (สูตรแท้มาตรฐานชั่งน้ำหนักดวงและสิบเทพ)
      // กิ่งฟ้า 4 เสา = เสาละ 1.0 คะแนน (รวม 4.0 คะแนน)
      // กิ่งดิน 4 เสา = เสาละ 1.5 คะแนน กระจายตามสัดส่วนราศีแฝง (รวม 6.0 คะแนน)
      // รวมพลังทั้งดวง = 10.0 คะแนนบริบูรณ์ (1.0 คะแนน = 10% พอดี)
      const elementScores = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
      const rawStemYangYin = {
        wood: { yang: 0, yin: 0 },
        fire: { yang: 0, yin: 0 },
        earth: { yang: 0, yin: 0 },
        metal: { yang: 0, yin: 0 },
        water: { yang: 0, yin: 0 }
      };

      [hourStem, dayStem, monthStem, yearStem].forEach(s => {
        if (s && s.element) {
          elementScores[s.element] += 1.0;
          if (rawStemYangYin[s.element]) rawStemYangYin[s.element][s.polarity] += 1.0;
        }
      });
      [hourBranch, dayBranch, monthBranch, yearBranch].forEach(b => {
        if (b && b.hidden) {
          b.hidden.forEach(h => {
            const sObj = STEMS.find(s => s.zh === h.stem);
            if (sObj && elementScores[sObj.element] !== undefined) {
              const branchWeight = h.weight * 1.5;
              elementScores[sObj.element] += branchWeight;
              if (rawStemYangYin[sObj.element]) rawStemYangYin[sObj.element][sObj.polarity] += branchWeight;
            }
          });
        }
      });

      // 5.1 Branch Combinations & Transformations (การภาคีแปรธาตุ: 六合 / 半三合 / 三合 / 三會 化神)
      // เมื่อกิ่งดินจับคู่ภาคีกัน และมีดาวธาตุที่แปรสภาพปรากฏบนกิ่งฟ้า (化神透干) พลังจะแปรสภาพหนุนธาตุนั้นอย่างแท้จริง
      const bZhList = [hourBranch, dayBranch, monthBranch, yearBranch].map(b => b ? b.zh : '');
      const hasStemElem = (elem) => [hourStem, dayStem, monthStem, yearStem].some(s => s && s.element === elem);

      // Fire transformations (午未合火, 卯戌合火, 寅午戌/午戌/寅午半合火, 巳午未三會火)
      if (hasStemElem('fire')) {
        if (bZhList.includes('巳') && bZhList.includes('午') && bZhList.includes('未') && elementScores.earth >= 1.0) {
          elementScores.earth -= 1.0;
          elementScores.fire += 1.0;
        }
        if (bZhList.includes('午') && bZhList.includes('未') && elementScores.earth >= 1.0) {
          elementScores.earth -= 1.0;
          elementScores.fire += 1.0;
        }
        if (bZhList.includes('午') && bZhList.includes('戌') && elementScores.earth >= 0.8) {
          elementScores.earth -= 0.8;
          elementScores.fire += 0.8;
        }
        if (bZhList.includes('寅') && bZhList.includes('午') && elementScores.wood >= 0.8) {
          elementScores.wood -= 0.8;
          elementScores.fire += 0.8;
        }
        if (bZhList.includes('卯') && bZhList.includes('戌') && elementScores.wood >= 0.6) {
          elementScores.wood -= 0.6;
          elementScores.fire += 0.6;
        }
      }

      // Wood transformations (寅亥合木, 亥卯/卯未半合木, 亥卯未三合木, 寅卯辰三會木)
      if (hasStemElem('wood')) {
        if (bZhList.includes('寅') && bZhList.includes('卯') && bZhList.includes('辰') && elementScores.earth >= 1.0) {
          elementScores.earth -= 1.0;
          elementScores.wood += 1.0;
        }
        if (bZhList.includes('寅') && bZhList.includes('亥') && elementScores.water >= 0.8) {
          elementScores.water -= 0.8;
          elementScores.wood += 0.8;
        }
        if (bZhList.includes('亥') && bZhList.includes('卯') && elementScores.water >= 0.8) {
          elementScores.water -= 0.8;
          elementScores.wood += 0.8;
        }
        if (bZhList.includes('卯') && bZhList.includes('未') && elementScores.earth >= 0.8) {
          elementScores.earth -= 0.8;
          elementScores.wood += 0.8;
        }
      }

      // Metal transformations (辰酉合金, 巳酉/酉丑半合金, 巳酉丑三合金, 申酉戌三會金)
      if (hasStemElem('metal')) {
        if (bZhList.includes('申') && bZhList.includes('酉') && bZhList.includes('戌') && elementScores.earth >= 1.0) {
          elementScores.earth -= 1.0;
          elementScores.metal += 1.0;
        }
        if (bZhList.includes('辰') && bZhList.includes('酉') && elementScores.earth >= 0.8) {
          elementScores.earth -= 0.8;
          elementScores.metal += 0.8;
        }
        if (bZhList.includes('巳') && bZhList.includes('酉') && elementScores.fire >= 0.8) {
          elementScores.fire -= 0.8;
          elementScores.metal += 0.8;
        }
        if (bZhList.includes('酉') && bZhList.includes('丑') && elementScores.earth >= 0.8) {
          elementScores.earth -= 0.8;
          elementScores.metal += 0.8;
        }
      }

      // Water transformations (巳申合水, 申子/子辰半合水, 申子辰三合水, 亥子丑三會水)
      if (hasStemElem('water')) {
        if (bZhList.includes('亥') && bZhList.includes('子') && bZhList.includes('丑') && elementScores.earth >= 1.0) {
          elementScores.earth -= 1.0;
          elementScores.water += 1.0;
        }
        if (bZhList.includes('巳') && bZhList.includes('申') && elementScores.fire >= 0.8) {
          elementScores.fire -= 0.8;
          elementScores.water += 0.8;
        }
        if (bZhList.includes('申') && bZhList.includes('子') && elementScores.metal >= 0.8) {
          elementScores.metal -= 0.8;
          elementScores.water += 0.8;
        }
        if (bZhList.includes('子') && bZhList.includes('辰') && elementScores.earth >= 0.8) {
          elementScores.earth -= 0.8;
          elementScores.water += 0.8;
        }
      }

      // Earth transformations (子丑合土)
      if (hasStemElem('earth')) {
        if (bZhList.includes('子') && bZhList.includes('丑') && elementScores.water >= 0.8) {
          elementScores.water -= 0.8;
          elementScores.earth += 0.8;
        }
      }

      const totalScore = Object.values(elementScores).reduce((a, b) => a + b, 0) || 10;
      const elementPercentages = {};
      const elementMultipliers = { wood: 1.0, fire: 1.0, earth: 1.0, metal: 1.0, water: 1.0 };
      for (const el in elementScores) {
        elementPercentages[el] = Math.round((elementScores[el] / totalScore) * 100);
      }

      // 6. Day Master Strength (身強 vs 身弱) คำนวณชั่งน้ำหนักดวง
      // ฝั่งดิถี: ธาตุเกิดดิถี (印 - Resource) + ธาตุดิถี (比劫 - Companion)
      // อีกฝั่ง: พิฆาตดิถี (官殺 - Power) + ดิถีเกิด (食傷 - Output) + ดิถีพิฆาต (財 - Wealth)
      // ฝั่งดิถีมากกว่า ก็ถือว่าแข็งแรง (身强) ฝั่งดิถีน้อยกว่า ก็ถือว่าอ่อนแอ (身弱)
      const dmElement = dayStem.element;
      const resourceElement = Object.keys(ELEMENTS_META).find(k => ELEMENTS_META[k].generates === dmElement);
      const powerElement = Object.keys(ELEMENTS_META).find(k => ELEMENTS_META[k].controls === dmElement);
      const wealthElement = ELEMENTS_META[dmElement].controls;
      const outputElement = ELEMENTS_META[dmElement].generates;

      const supportingScore = (elementScores[dmElement] || 0) + (elementScores[resourceElement] || 0);
      const drainingScore = (elementScores[powerElement] || 0) + (elementScores[outputElement] || 0) + (elementScores[wealthElement] || 0);
      const supportPercentage = Math.round((supportingScore / totalScore) * 100);

      const isStrong = supportingScore > drainingScore;
      const strengthText = isStrong ? 'ดิถีแข็งแรง (身強 - Strong Day Master)' : 'ดิถีอ่อนแอ (身弱 - Weak Day Master)';

      let favorableElements = [];
      let avoidElements = [];
      if (isStrong) {
        favorableElements = [outputElement, wealthElement, powerElement];
        avoidElements = [dmElement, resourceElement];
      } else {
        favorableElements = [resourceElement, dmElement];
        avoidElements = [powerElement, wealthElement];
      }

      // 6.1 Classical Regulating Element (調候用神 - Tiao Hou / Climate & Balance)
      // Reference: 窮通寶鑑 (Qiong Tong Bao Jian), 滴天髓 (Di Tian Shui), 三命通會 (San Ming Tong Hui)
      function determineTiaoHou(dayStemObj, monthBranchObj, elScores, elPcts) {
        const dStem = dayStemObj.zh;
        const mBranch = monthBranchObj.zh;

        let tiaoHouElem = 'water';
        let tiaoHouRole = '';
        let tiaoHouReason = '';

        // 1. Winter (亥, 子, 丑): Freezing climate -> Needs FIRE (丙/丁) to thaw and warm (暖局解凍)
        if (['亥', '子', '丑'].includes(mBranch)) {
          tiaoHouElem = 'fire';
          tiaoHouRole = 'อบอุ่นดวงชะตา & สลายความเย็น (暖局解凍)';
          tiaoHouReason = `เกิดในเดือนสารทฤดูหนาว (${mBranch}) สภาพอากาศหนาวเย็นจัด แผ่นดินและสายน้ำเยือกแข็ง คัมภีร์เฉียงทงเป่าเจี้ยนระบุว่า ต้องการ "ธาตุไฟ" เป็นธาตุปรับดวงให้ความอบอุ่น เพื่อให้พลังชีวิตเบ่งบานและสร้างความสำเร็จ`;
        }
        // 2. Summer (巳, 午, 未): Scorching hot -> Needs WATER (壬/癸) to cool and moisturize (降溫潤局)
        else if (['巳', '午', '未'].includes(mBranch)) {
          tiaoHouElem = 'water';
          tiaoHouRole = 'ลดอุณหภูมิ & ชโลมความชุ่มชื้น (降溫潤局)';
          tiaoHouReason = `เกิดในเดือนสารทฤดูร้อน (${mBranch}) สภาพอากาศร้อนจัดแผดเผา ธาตุไฟและดินแห้งแล้ง ต้องการ "ธาตุน้ำ" เป็นธาตุปรับดวง เพื่อดับพิษร้อน ชโลมความชุ่มชื้น และรักษาความสมดุลของจิตใจ`;
        }
        // 3. Autumn (申, 酉, 戌): Crisp metal & cooling climate
        else if (['申', '酉', '戌'].includes(mBranch)) {
          if (['丁', '丙'].includes(dStem)) {
            // Ding / Bing Fire in Autumn:
            // 丁 Fire: 滴天髓 & 窮通寶鑑: 丁火秋令退氣，金旺。丁火喜水既濟，尤其是壬水/癸水 顯貴，水火既濟
            tiaoHouElem = 'water';
            tiaoHouRole = 'ชโลมดวงชะตา & สะท้อนเกียรติยศ (水火既濟 / 顯貴)';
            tiaoHouReason = `เกิดในเดือนสารทฤดูใบไม้ร่วง (${mBranch}) พลังทองหนาแน่น อากาศเริ่มเย็นและแห้ง คัมภีร์เฉียงทงเป่าเจี้ยนระบุว่า ดิถีไฟ ${dStem} (ดวงประทีป) ต้องการ "ธาตุน้ำ" เป็นธาตุปรับดวง เพื่อสะท้อนประกายเกียรติยศชื่อเสียง นำมาซึ่งความเยือกเย็น สติปัญญา และความสำเร็จในตำแหน่งหน้าที่การงาน (官殺)`;
          } else if (['甲', '乙'].includes(dStem)) {
            // Wood in Autumn: Metal chops Wood -> Needs Water as bridge (通關) to generate wood
            tiaoHouElem = 'water';
            tiaoHouRole = 'สะพานเชื่อมพลัง & พิทักษ์ต้นไม้ (通關化殺)';
            tiaoHouReason = `เกิดในเดือนสารทฤดูใบไม้ร่วง (${mBranch}) พลังทองพิฆาตตัดไม้ ต้องการ "ธาตุน้ำ" เป็นธาตุปรับดวง เพื่อถ่ายเทพลังทองมาเสริมส่งไม้ เปลี่ยนแรงกดดันให้กลายเป็นสติปัญญาและโชคลาภ`;
          } else if (['庚', '辛'].includes(dStem)) {
            // Metal in Autumn: Metal heavy -> Needs Water to wash metal or Fire to forge
            tiaoHouElem = (elScores.fire > elScores.water) ? 'water' : 'fire';
            if (tiaoHouElem === 'water') {
              tiaoHouRole = 'ชำระล้างทองให้ผุดผ่อง (金水傷官 / 水淘金)';
              tiaoHouReason = `เกิดในเดือนสารทฤดูใบไม้ร่วง (${mBranch}) พลังทองแกร่งกล้า ต้องการ "ธาตุน้ำ" ชำระล้างทองให้ส่องประกาย แสดงออกซึ่งปฏิภาณไหวพริบและสติปัญญา`;
            } else {
              tiaoHouRole = 'หลอมหล่อศาสตรา (火煉秋金)';
              tiaoHouReason = `เกิดในเดือนสารทฤดูใบไม้ร่วง (${mBranch}) พลังทองหนาแน่น ต้องการ "ธาตุไฟ" มาหลอมตีให้เป็นยอดศาสตราและผู้นำที่เข้มแข็ง`;
            }
          } else {
            // Earth / Water in Autumn
            if (elPcts.water <= 10) {
              tiaoHouElem = 'water';
              tiaoHouRole = 'หล่อเลี้ยงความชุ่มชื้น (潤澤調候)';
              tiaoHouReason = `ในดวงมีพลังธาตุน้ำพร่อง ต้องการ "ธาตุน้ำ" เพื่อปรับความชุ่มชื้นและกระตุ้นการไหลเวียนของโชคลาภ`;
            } else {
              tiaoHouElem = 'fire';
              tiaoHouRole = 'อบอุ่นและเสริมกำลัง (暖土培元)';
              tiaoHouReason = `เกิดในเดือนสารทฤดูใบไม้ร่วง (${mBranch}) ต้องการ "ธาตุไฟ" ให้ความอบอุ่นแก่ผืนดินและขับเคลื่อนความสำเร็จ`;
            }
          }
        }
        // 4. Spring (寅, 卯, 辰): Wood grows
        else if (['寅', '卯', '辰'].includes(mBranch)) {
          if (mBranch === '寅') {
            tiaoHouElem = 'fire';
            tiaoHouRole = 'คลายหนาวต้นฤดูใบไม้ผลิ (陽和解寒)';
            tiaoHouReason = `เกิดในเดือนสารทต้นฤดูใบไม้ผลิ (${mBranch}) ไอหนาวปลายฤดูยังหลงเหลือ ต้องการ "ธาตุไฟ" มอบแสงตะวันอบอุ่นให้ยอดไม้งอกงาม`;
          } else {
            if (elPcts.water <= 12) {
              tiaoHouElem = 'water';
              tiaoHouRole = 'หล่อเลี้ยงพืชผล (雨露滋潤)';
              tiaoHouReason = `เกิดในฤดูใบไม้ผลิ (${mBranch}) ต้นไม้ต้องการ "ธาตุน้ำ" ดั่งสายฝนชุ่มฉ่ำหล่อเลี้ยงรากให้มั่นคง`;
            } else {
              tiaoHouElem = 'fire';
              tiaoHouRole = 'ให้แสงสว่างเจริญเติบโต (木火通明)';
              tiaoHouReason = `เกิดในฤดูใบไม้ผลิ (${mBranch}) ต้องการ "ธาตุไฟ" เพื่อให้พืชพันธุ์สังเคราะห์แสง ดอกไม้เบ่งบาน นำพาชื่อเสียงและผลงานโดดเด่น`;
            }
          }
        }

        // Secondary check: Chart Dryness vs Coldness (燥濕平衡)
        if ((elPcts.water <= 8 || (elPcts.fire + elPcts.earth) >= 48) && tiaoHouElem !== 'water') {
          tiaoHouElem = 'water';
          tiaoHouRole = 'น้ำทิพย์ชโลมดวงแห้งแล้ง (潤局調候)';
          tiaoHouReason = `ผังดวงมีความแห้งแล้งสูง (ธาตุน้ำมีเพียง ${elPcts.water || 0}%) ต้องการ "ธาตุน้ำ" ชโลมดวง ปรับสมดุลอารมณ์ และเปิดรับโอกาสโชคลาภ`;
        } else if ((elPcts.fire <= 8 || (elPcts.water + elPcts.metal) >= 48) && tiaoHouElem !== 'fire') {
          tiaoHouElem = 'fire';
          tiaoHouRole = 'ดวงประทีปสลายความเย็น (暖局調候)';
          tiaoHouReason = `ผังดวงมีความเย็นชื้นสูง (ธาตุไฟมีเพียง ${elPcts.fire || 0}%) ต้องการ "ธาตุไฟ" สลายความหนาวเย็น เพิ่มความกระตือรือร้นและพลังขับเคลื่อนชีวิต`;
        }

        return {
          element: tiaoHouElem,
          role: tiaoHouRole,
          reason: tiaoHouReason
        };
      }

      const tiaoHou = determineTiaoHou(dayStem, monthBranch, elementScores, elementPercentages);

      // CRITICAL BAZI PRINCIPLE: "調候為先" (Climate Regulation Takes Priority)
      // The regulating element must NEVER be treated as an Avoid Element (忌神)!
      avoidElements = avoidElements.filter(e => e !== tiaoHou.element);

      // 7. Da Yun (วัยจร 10 ปี / 大運)
      const isYearYang = yearStem.polarity === 'yang';
      const isForward = (gender === 'male' && isYearYang) || (gender === 'female' && !isYearYang);

      const daYunPillars = [];
      const currentYear = new Date().getFullYear();
      const currentAge = currentYear - year;

      // Calculate startAge and firstLPDate accurately from Solar Jie (節氣)
      // Standard rule: 3 days = 1 year, 1 day = 4 months, 1 hour = 10 days
      const jieDays = [6, 4, 6, 5, 6, 6, 7, 8, 8, 8, 7, 7];
      const curJie = new Date(year, month, jieDays[month], 12, 0, 0);
      let prevJie, nextJie;
      if (date >= curJie) {
        prevJie = curJie;
        const nextM = (month + 1) % 12;
        const nextY = month === 11 ? year + 1 : year;
        nextJie = new Date(nextY, nextM, jieDays[nextM], 12, 0, 0);
      } else {
        nextJie = curJie;
        const prevM = (month + 11) % 12;
        const prevY = month === 0 ? year - 1 : year;
        prevJie = new Date(prevY, prevM, jieDays[prevM], 12, 0, 0);
      }

      const targetJie = isForward ? nextJie : prevJie;
      const diffMs = Math.abs(date - targetJie);
      const jieDiffDays = diffMs / 86400000;
      const startYears = Math.floor(jieDiffDays / 3);
      const remDays = jieDiffDays - (startYears * 3);
      const startMonths = Math.floor(remDays * 4);
      const startDays = Math.round((remDays * 4 - startMonths) * 30);
      const startAge = Math.max(1, startYears + (startMonths >= 6 ? 1 : 0));
      const firstLPTimestamp = date.getTime() + (startYears * 365.25 + startMonths * 30.4375 + startDays) * 86400000;
      const firstLPDateObj = new Date(firstLPTimestamp);
      const firstLPDate = `${firstLPDateObj.getFullYear()}-${String(firstLPDateObj.getMonth() + 1).padStart(2, '0')}-${String(firstLPDateObj.getDate()).padStart(2, '0')}`;

      // Column 0: Birth Pillar / วัยแรกเกิดก่อนเข้าวัยจร (童限 / 幼年)
      // Starting from birth month and birth year, governed by the Month Pillar (月柱)
      const startMonthStr = String(month + 1).padStart(2, '0');
      const birthPillar = {
        index: 0,
        order: 0,
        isBirthPillar: true,
        ageRange: `0 - ${startAge - 1} ปี (แรกเกิด)`,
        ageFrom: 0,
        ageTo: startAge - 1,
        yearFrom: year,
        yearTo: year + startAge - 1,
        headerTitle: `${startMonthStr}/${year}+`,
        stem: monthStem,
        branch: monthBranch,
        tenGod: getTenGod(dayStem, monthStem),
        naYin: getNaYin(mStemIdx, mBranchIdx),
        isCurrent: currentAge < startAge
      };
      daYunPillars.push(birthPillar);

      // Columns 1 to 10: 10-Year Luck Pillars (大運)
      for (let i = 1; i <= 10; i++) {
        const offset = isForward ? i : -i;
        const dyStemIdx = (mStemIdx + offset + 100) % 10;
        const dyBranchIdx = (mBranchIdx + offset + 120) % 12;
        const dyStem = STEMS[dyStemIdx];
        const dyBranch = BRANCHES[dyBranchIdx];
        const ageFrom = startAge + (i - 1) * 10;
        const ageTo = ageFrom + 9;
        const yearFrom = year + ageFrom;
        const yearTo = yearFrom + 9;
        const isCurrent = currentAge >= ageFrom && currentAge <= ageTo;
        const lpMonthStr = String(firstLPDateObj.getMonth() + 1).padStart(2, '0');
        const headerTitle = `${lpMonthStr}/${yearFrom}+ (${ageFrom})`;

        daYunPillars.push({
          index: i,
          order: i,
          isBirthPillar: false,
          ageRange: `${ageFrom} - ${ageTo} ปี`,
          ageFrom,
          ageTo,
          yearFrom,
          yearTo,
          headerTitle,
          stem: dyStem,
          branch: dyBranch,
          tenGod: getTenGod(dayStem, dyStem),
          naYin: getNaYin(dyStemIdx, dyBranchIdx),
          isCurrent
        });
      }

      // 8. Personality Profiles
      const personalityProfiles = {
        '甲': {
          title: 'ต้นไม้ใหญ่ผู้สง่างาม เปี่ยมด้วยวิสัยทัศน์และความเป็นผู้นำ',
          traits: 'ใจกว้าง หนักแน่น ซื่อตรง มีจิตใจเมตตา มุ่งมั่นสู่ความสำเร็จ ไม่ยอมแพ้ต่ออุปสรรค ดุจต้นไม้ใหญ่ที่แผ่กิ่งก้านให้ร่มเงาแก่ผู้คน',
          career: 'การบริหารองค์กร, ผู้บริหารระดับสูง, นักพัฒนาอสังหาริมทรัพย์, การศึกษา, การแพทย์, ธุรกิจเพื่อสังคม',
          wealth: 'การเงินมั่นคงแบบสั่งสมระยะยาว เหมาะกับการลงทุนในสินทรัพย์ที่มีรากฐานแน่นอน เช่น ที่ดิน หรือหุ้นเติบโตยั่งยืน',
          love: 'เป็นที่พึ่งพาให้คนรักได้ดี อบอุ่น มีความรับผิดชอบสูง แต่อาจขาดความโรแมนติกแบบหวานแหววไปบ้าง ควรเพิ่มการรับฟังอย่างใส่ใจ',
          health: 'ดูแลระบบตับ ถุงน้ำดี สายตา และอาการปวดเมื่อยกล้ามเนื้อ ควรออกกำลังกายแบบยืดเส้นสม่ำเสมอ'
        },
        '乙': {
          title: 'ไม้เลื้อยผู้ทรงเสน่ห์ ปรับตัวเป็นเลิศ ไหวพริบยอดเยี่ยม',
          traits: 'อ่อนโยน นุ่มนวล มีมนุษยสัมพันธ์ดีเยี่ยม เข้ากับคนง่าย พลิกแพลงแก้ไขปัญหาเฉพาะหน้าได้อย่างอัศจรรย์ ดั่งดอกไม้และเถาวัลย์ที่เติบโตได้ทุกที่',
          career: 'ศิลปะ, งานออกแบบ, การทูต, การประชาสัมพันธ์, การตลาด, วงการบันเทิง, ธุรกิจความงามและแฟชั่น',
          wealth: 'มีโชคจากการเชื่อมโยงผู้คน คอนเนกชันนำพาเงินทองมาให้ มีไหวพริบจับโอกาสธุรกิจใหม่ๆ ได้รวดเร็ว',
          love: 'มีเสน่ห์ดึงดูด ช่างเอาอกเอาใจ คู่ครองมักเป็นคนที่คอยปกป้องคุ้มครองและเป็นที่พึ่งให้ได้',
          health: 'ดูแลระบบประสาท ทางเดินอาหารส่วนล่าง และเส้นเอ็น ควรหลีกเลี่ยงความเครียดสะสมด้วยการพักผ่อนใกล้ชิดธรรมชาติ'
        },
        '丙': {
          title: 'พระอาทิตย์เจิดจ้า เปี่ยมพลังบวก ความกระตือรือร้นและชื่อเสียง',
          traits: 'สดใส ตรงไปตรงมา รักความยุติธรรม ชอบความชัดเจน มีความเป็นมิตรสูง สร้างพลังใจและแรงบันดาลใจให้ผู้อื่นเสมอ ดั่งแสงสุริยาที่มอบความอบอุ่น',
          career: 'สื่อสารมวลชน, การแสดง, อินฟลูเอนเซอร์, การตลาดออนไลน์, ธุรกิจพลังงาน, งานต้อนรับและการบริการระดับไฮเอนด์',
          wealth: 'เงินทองหมุนเวียนคล่องตัว มีโอกาสสร้างความมั่งคั่งจากชื่อเสียงและภาพลักษณ์ ระวังการใช้จ่ายตามอารมณ์',
          love: 'รักจริงจัง เปิดเผย ทุ่มเทเต็มที่ ชอบคนที่มีพลังงานสดใสเหมือนกัน ควรระวังความใจร้อนหรือพูดตรงเกินไป',
          health: 'ดูแลระบบหัวใจ ความดันโลหิต สายตา และระบบไหลเวียนโลหิต ควรดื่มน้ำให้เพียงพอและฝึกสมาธิ'
        },
        '丁': {
          title: 'เปลวเทียนส่องแสง สติปัญญาหยั่งรู้ สุขุมลุ่มลึกและมีเอกลักษณ์',
          traits: 'ช่างสังเกต สุภาพ อ่อนโยน มีความคิดสร้างสรรค์ลึกซึ้ง มีสัมผัสพิเศษหรือเซนส์ในการรับรู้ความรู้สึกผู้อื่น ดั่งดวงประทีปที่ส่องสว่างในความมืด',
          career: 'วิจัยเชิงลึก, นักคิดนักเขียน, นักวิเคราะห์ข้อมูล, ปรัชญา, โหราศาสตร์, เทคโนโลยี, การแพทย์เฉพาะทาง',
          wealth: 'ร่ำรวยจากองค์ความรู้เฉพาะตัว นวัตกรรม และไอเดียที่ไม่เหมือนใคร เงินทองเข้ามาสม่ำเสมอตามความเชี่ยวชาญ',
          love: 'รักลึกซึ้ง ละเอียดอ่อน เอาใจใส่ความรู้สึกคนรักอย่างประณีต มักมองหาคู่แท้ที่เข้าใจจิตวิญญาณและความคิดลึกๆ',
          health: 'ดูแลระบบหลอดเลือด หัวใจ และดวงตา ระวังการใช้สายตาตอนกลางคืนและภาวะนอนไม่หลับ'
        },
        '戊': {
          title: 'ขุนเขาตระหง่าน หนักแน่น ซื่อสัตย์ ไว้วางใจได้สูงสุด',
          traits: 'มั่นคง ไม่หวั่นไหวง่าย เก็บความลับเก่ง มีความอดทนสูง เป็นที่ปรึกษาที่ทุกคนเชื่อมั่น ดั่งภูเขาใหญ่ที่โอบรับทุกสรรพสิ่ง',
          career: 'อสังหาริมทรัพย์, การเงินการธนาคาร, ภาครัฐ, ก่อสร้าง, การเกษตร, ผู้พิพากษา, นักบริหารทรัพย์สิน',
          wealth: 'สร้างความมั่งคั่งจากความมั่นคงและวินัยระยะยาว มักมีทรัพย์สินสะสมเป็นกอบเป็นกำ ปลอดภัยไร้ความเสี่ยง',
          love: 'รักเดียวใจเดียว มั่นคงเหมือนหินผา เป็นเสาหลักของครอบครัว ควรแสดงความรู้สึกและคำหวานให้บ่อยขึ้น',
          health: 'ดูแลระบบกระเพาะอาหาร ม้าม การย่อยอาหาร และการเผาผลาญ ควรทานอาหารให้ตรงเวลา'
        },
        '己': {
          title: 'ผืนดินอุดมสมบูรณ์ โอบอ้อมอารี อดทนและเกื้อกูลผู้คน',
          traits: 'ใจกว้าง ละเอียดรอบคอบ พร้อมสนับสนุนผู้อื่น มีความสามารถในการประสานงานและจัดการสิ่งต่างๆ ให้ออกมาสมบูรณ์แบบ ดั่งดินดีที่เพาะปลูกพืชผล',
          career: 'การศึกษา, ทรัพยากรบุคคล (HR), การบริการ, การท่องเที่ยว, เกษตรแปรรูป, วางแผนการเงิน, ที่ปรึกษา',
          wealth: 'ได้ลาภจากผลงานที่ค่อยๆ บ่มเพาะ มีเสถียรภาพทางการเงินสูง เก็บหอมรอมริบเก่งและต่อยอดเงินได้อย่างมีประสิทธิภาพ',
          love: 'เป็นผู้ให้ที่อบอุ่น เอาใจใส่ครอบครัวเป็นเลิศ รักความสงบและมั่นคง คู่ครองมักซาบซึ้งในความเสียสละ',
          health: 'ดูแลระบบทางเดินอาหาร ลำไส้ ผิวพรรณ และการดูดซึมสารอาหาร ควรออกกำลังกายสม่ำเสมอ'
        },
        '庚': {
          title: 'กระบี่เหล็กกล้า เด็ดขาด กล้าหาญ รักความถูกต้องและเฉียบคม',
          traits: 'ตรงฉิน มีหลักการชัดเจน ไม่กลัวความลำบาก กล้าตัดสินใจในภาวะวิกฤต มุ่งมั่นพัฒนาตนเองให้แกร่งขึ้น ดั่งโลหะมีค่าที่ผ่านการตีหลอมจนเป็นยอดศาสตรา',
          career: 'วิศวกรรม, ทหาร/ตำรวจ, กฎหมาย, การผ่าตัด, การบริหารจัดการความเสี่ยง, โลจิสติกส์, เทคโนโลยีฮาร์ดแวร์',
          wealth: 'หาเงินได้เก่งจากความสามารถเชิงรุกและความกล้าลงทุน ยิ่งเผชิญความท้าทายยิ่งสร้างความสำเร็จทางเงินทองได้สูง',
          love: 'รักจริงจัง ปกป้องคนรักสุดความสามารถ แต่อาจปากแข็งหรือไม่ค่อยง้อ ควรปรับลดความเข้มงวดในชีวิตคู่',
          health: 'ดูแลระบบปอด ระบบทางเดินหายใจ กระดูกและฟัน ควรฝึกหายใจลึกๆ และหลีกเลี่ยงฝุ่นควัน'
        },
        '辛': {
          title: 'อัญมณีล้ำค่า สง่างาม รสนิยมประณีต รักศักดิ์ศรีและเปล่งประกาย',
          traits: 'มีเสน่ห์โดดเด่น ไหวพริบปฏิภาณดี มีสไตล์เฉพาะตัว ชื่นชอบความสมบูรณ์แบบ รักความสะอาดและระเบียบ ดั่งเพชรน้ำเอกที่เจียระไนแล้ว',
          career: 'จิวเวลรี่, สินค้าแบรนด์เนม, ดีไซเนอร์, ที่ปรึกษาภาพลักษณ์, การทูต, พิธีกร, ศิลปะประยุกต์',
          wealth: 'สร้างมูลค่าเพิ่มให้กับสิ่งรอบตัวได้มหาศาล มีโชคจากสินค้าพรีเมียมและความเชี่ยวชาญเฉพาะทางระดับสูง',
          love: 'เลือกสรรคนรักอย่างประณีต ต้องการคู่ครองที่ให้เกียรติ เข้าใจในคุณค่าของตนเอง และมีความภูมิฐาน',
          health: 'ดูแลระบบผิวหนัง ปอด ทางเดินหายใจ และอาการภูมิแพ้ ควรพักผ่อนในที่ที่อากาศบริสุทธิ์'
        },
        '壬': {
          title: 'มหาสมุทรไร้ขอบเขต ปราดเปรื่อง ทรงพลัง และมีวิสัยทัศน์กว้างไกล',
          traits: 'ฉลาดหลักแหลม มีพลังความคิดสร้างสรรค์ล้นเหลือ คล่องตัว ปรับตัวเข้ากับทุกสถานการณ์ มีความทะเยอทะยานสูง ดั่งแม่น้ำใหญ่ที่ไหลรวมสู่ทะเล',
          career: 'การค้าระหว่างประเทศ, ธุรกิจข้ามชาติ, การเดินเรือ, โลจิสติกส์, เทคโนโลยีสารสนเทศ, การเงินการลงทุน, การตลาดดิจิทัล',
          wealth: 'กระแสเงินสดหมุนเวียนมหาศาล ยิ่งเคลื่อนไหวทำธุรกิจยิ่งรวย มีสายตาเฉียบคมในการจับทิศทางตลาดโลก',
          love: 'มีเสน่ห์ดึงดูดใจ รักอิสระ ชอบคนคุยรู้เรื่องและมีเป้าหมายชีวิตยิ่งใหญ่ ไม่ชอบการผูกมัดที่อึดอัด',
          health: 'ดูแลระบบไต กระเพาะปัสสาวะ การไหลเวียนของของเหลวในร่างกาย และหู ควรดื่มน้ำสะอาดสม่ำเสมอ'
        },
        '癸': {
          title: 'สายฝนและน้ำค้างบริสุทธิ์ ปัญญาหยั่งรู้ ลึกซึ้ง และอ่อนโยนเป็นที่สุด',
          traits: 'ช่างคิด เข้าใจความรู้สึกคนรอบข้างอย่างลึกซึ้ง มีญาณหยั่งรู้ จิตใจดี โอบอ้อมอารี สงบเสงี่ยม ดั่งสายฝนชุ่มฉ่ำที่หล่อเลี้ยงโลกอย่างเงียบๆ',
          career: 'จิตวิทยา, การบำบัดรักษา, โหราศาสตร์, วรรณกรรม, การวิจัย, วิทยาศาสตร์สิ่งแวดล้อม, งานบริการทางการแพทย์',
          wealth: 'มีโชคแบบไม่คาดฝัน ลาภลอย เงินทองไหลเข้ามาเรื่อยๆ จากความเมตตาและคุณงามความดีที่ได้สร้างไว้',
          love: 'โรแมนติก ซาบซึ้ง อ่อนโยน เข้าอกเข้าใจคนรักเป็นเลิศ ต้องการความรักที่จริงใจและปลอดภัยทางอารมณ์',
          health: 'ดูแลระบบสืบพันธุ์ ระบบทางเดินปัสสาวะ และการนอนหลับ ควรหลีกเลี่ยงความหนาวเย็นและความชื้นสะสม'
        }
      };

      const dayMasterProfile = personalityProfiles[dayStem.zh] || personalityProfiles['甲'];

      return {
        name,
        gender,
        isUnknownTime: !!isUnknownTime,
        birthDateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        birthTimeString: isUnknownTime ? 'ไม่ระบุเวลา' : `${String(birthHour).padStart(2, '0')}:${String(birthMinute).padStart(2, '0')}`,
        birthHour,
        birthMinute,
        dayMaster: dayStem,
        dayBranch: dayBranch,
        pillars,
        elementScores,
        elementMultipliers,
        supportingScore,
        drainingScore,
        elementPercentages,
        isStrong,
        strengthText,
        supportPercentage,
        favorableElements,
        avoidElements,
        tiaoHou,
        firstLPDate,
        daYunPillars,
        dayMasterProfile
      };
    },

    // 9. Detailed Da Yun (10-Year Luck Pillar) Interpretation
    calculateDaYunInterpretation: function (chart, daYunPillar) {
      if (!chart || !daYunPillar) return null;
      if (daYunPillar.isBirthPillar) {
        return {
          isFavorable: true,
          favorabilityText: 'ช่วงวัยแรกเกิด (童限 / 幼年)',
          theme: 'ช่วงวัยแรกเกิดถึงก่อนเข้าสู่วัยจรแรกตามหลักปาจื้อ พลังงานชีวิตถูกกำกับดูแลโดยเสาเดือนเกิดและครอบครัว',
          career: 'วัยแห่งการเจริญเติบโต การเรียนรู้ขั้นพื้นฐาน และพัฒนาการทางสติปัญญา',
          wealth: 'ความอุดมสมบูรณ์ขึ้นอยู่กับสภาพแวดล้อมและพ่อแม่เป็นผู้ส่งเสียดูแล',
          love: 'ความรัก ความอบอุ่น และความผูกพันในครอบครัว',
          warning: 'ดูแลสุขภาพ ภูมิคุ้มกัน และโภชนาการในวัยเด็กอย่างใกล้ชิด'
        };
      }
      const tg = daYunPillar.tenGod;
      const sElem = daYunPillar.stem.element;
      const bElem = daYunPillar.branch.element;
      const isFav = chart.favorableElements.includes(sElem) || chart.favorableElements.includes(bElem);

      // Check clashes with natal branches
      const clashes = [];
      ['year', 'month', 'day', 'hour'].forEach(k => {
        const p = chart.pillars[k];
        const clash = checkBranchClash(daYunPillar.branch.zh, p.branch.zh);
        if (clash) {
          clashes.push({ pillarKey: k, pillarLabel: p.label, desc: clash.th });
        }
      });

      // Ten God Specific Readings
      const godReadings = {
        '比肩': {
          theme: 'ช่วงเวลาแห่งการสร้างมิตรภาพ พึ่งพาตนเอง และขยายเครือข่าย',
          career: 'มีโอกาสร่วมทุนหรือทำงานเป็นทีม โดดเด่นด้านการขยายพันธมิตร ควรระวังความดื้อรั้นและฟังความเห็นผู้อื่นให้มากขึ้น',
          wealth: 'การเงินหมุนเวียนจากความสามารถของตนเอง มีการแบ่งปันผลกำไรกับหุ้นส่วน ไม่ควรค้ำประกันให้ใคร',
          love: 'ระวังทิฐิหรือการแข่งขันเอาชนะกันในชีวิตคู่ คนโสดมีโอกาสพบรักผ่านกลุ่มเพื่อนฝูง'
        },
        '劫財': {
          theme: 'วัยแห่งการแข่งขัน ชิงไหวชิงพริบ และการใช้ความกล้าได้กล้าเสีย',
          career: 'เผชิญการแข่งขันสูง แต่หากเปลี่ยนเป็นการแข่งขันเชิงรุกจะเติบโตแบบก้าวกระโดด โดดเด่นในสายธุรกิจและการตลาด',
          wealth: 'มีรายจ่ายจรและการลงทุนก้อนใหญ่ ควรบริหารกระแสเงินสดอย่างรัดกุม การซื้ออสังหาริมทรัพย์ช่วยแก้เคล็ดเงินรั่วไหล',
          love: 'ระวังมือที่สามหรือความขัดแย้งเรื่องเงินทองในครอบครัว ต้องให้ความซื่อสัตย์เป็นที่ตั้ง'
        },
        '食神': {
          theme: 'ยุคทองแห่งความคิดสร้างสรรค์ สุนทรียภาพ ความสุขุม และผลผลิตงอกเงย',
          career: 'โปรเจกต์ใหม่และไอเดียได้รับการยอมรับ ผลงานเป็นที่ชื่นชอบ ค้าขายคล่องตัว งานด้านการบริการและอาหารเจริญรุ่งเรือง',
          wealth: 'ลาภผลไหลเข้ามาสม่ำเสมอจากการลงมือทำสิ่งใหม่ มีโชคลาภจากการเจรจาและการสร้างสรรค์',
          love: 'ความรักสดชื่น อบอุ่น มีความเข้าใจลึกซึ้ง คนโสดมีเสน่ห์ดึงดูดคนดีๆ เข้ามาในชีวิต'
        },
        '傷官': {
          theme: 'ทศวรรษแห่งการฉีกกรอบ นวัตกรรม ปฏิภาณไหวพริบ และชื่อเสียงกึกก้อง',
          career: 'มีความสามารถโดดเด่น กล้าท้าทายสิ่งเก่าๆ ประสบความสำเร็จในงานศิลป์ สื่อสาร เทคโนโลยี แต่ต้องระวังวาจาขัดแย้งกับผู้ใหญ่',
          wealth: 'หาเงินได้รวดเร็วจากไอเดียแปลกใหม่ ลาภลอยโดดเด่น การลงทุนที่มีชั้นเชิงให้ผลตอบแทนสูง',
          love: 'อารมณ์ขึ้นลงง่าย คาดหวังในตัวคนรักสูง ควรลดความจู้จี้และให้อิสระแก่คู่ครอง'
        },
        '偏財': {
          theme: 'ช่วงเวลาแห่งโชคลาภพิเศษ โอกาสทางธุรกิจ และความมั่งคั่งหมุนเวียน',
          career: 'โอกาสธุรกิจใหม่ๆ วิ่งเข้าหา เหมาะกับการขยายการลงทุน การค้าขายระหว่างประเทศ และการบริหารเงินทุน',
          wealth: 'การเงินพุ่งทะยาน มีลาภลอยและผลตอบแทนจากการเก็งกำไร ยิ่งเคลื่อนไหวทำธุรกิจยิ่งได้ผลตอบแทนคุ้มค่า',
          love: 'คนโสดมีเสน่ห์แพรวพราว มีโอกาสพบรักจากการทำงานหรือการเข้าสังคม แต่ต้องระวังรักซ้อน'
        },
        '正財': {
          theme: 'ความมั่นคงในอาชีพการงาน รากฐานชีวิตที่แข็งแกร่ง และทรัพย์สินพอกพูน',
          career: 'การงานก้าวหน้าอย่างมั่นคง ได้รับความไว้วางใจให้ดูแลงานสำคัญ การงานมีเสถียรภาพสูง',
          wealth: 'เงินทองเข้ามาสม่ำเสมอ รายได้หลักมั่นคง วางแผนออมเงินและซื้อสินทรัพย์ถาวรได้สำเร็จงดงาม',
          love: 'ความรักมั่นคง ได้คู่ครองที่เกื้อกูลส่งเสริม มีโอกาสสร้างครอบครัวและลงหลักปักฐาน'
        },
        '七殺': {
          theme: 'วัยแห่งอำนาจบารมี ภาวะผู้นำ การก้าวกระโดดผ่านความท้าทายใหญ่',
          career: 'ได้รับตำแหน่งที่มีอำนาจตัดสินใจสูง เผชิญแรงกดดันแต่สามารถเปลี่ยนเป็นบันไดสู่ความสำเร็จยิ่งใหญ่',
          wealth: 'การเงินเติบโตรวดเร็วตามภาระหน้าที่ มีการลงทุนเชิงรุกที่ต้องใช้ความเด็ดขาด',
          love: 'คนโสดอาจพบคนรักสายลุยหรือมีบุคลิกเข้มแข็ง คนมีคู่ควรช่วยกันประคับประคองและอย่าเอาเรื่องงานมาปนชีวิตคู่'
        },
        '正官': {
          theme: 'เกียรติยศชื่อเสียง ตำแหน่งหน้าที่การงาน และคุณธรรมค้ำจุนชีวิต',
          career: 'ได้รับการเลื่อนขั้นเลื่อนตำแหน่ง สอบแข่งขันราบรื่น สัญญาทางกฎหมายผ่านฉลุย มีชื่อเสียงในแวดวงสังคม',
          wealth: 'การเงินมั่นคง ได้รับผลตอบแทนตามผลงานและตำแหน่งหน้าที่ มีโชคจากความซื่อสัตย์',
          love: 'ความรักได้รับความเห็นชอบจากผู้ใหญ่ คนโสดพบรักกับคนมีเกียรติ มีศีลธรรม และฐานะมั่นคง'
        },
        '偏印': {
          theme: 'ปัญญาญาณหยั่งรู้ การศึกษาศาสตร์ลึกซึ้ง และวิถีทางเฉพาะตัว',
          career: 'โดดเด่นในสายงานวิจัย การค้นคว้า ปรัชญา โหราศาสตร์ และการคิดค้นสิ่งที่ไม่มีใครทำมาก่อน',
          wealth: 'ร่ำรวยจากองค์ความรู้เฉพาะทางและงานเบื้องหลัง มีโชคลาภที่ไม่คาดคิดจากสัญชาตญาณ',
          love: 'ต้องการพื้นที่ส่วนตัวสูง เข้าใจยากในบางมุม คนรักต้องเข้าใจในโลกส่วนตัวและจิตวิญญาณ'
        },
        '正印': {
          theme: 'ช่วงเวลาแห่งความสุขสงบ ผู้ใหญ่อุปถัมภ์ สติปัญญา และสุขภาพกายใจสมบูรณ์',
          career: 'ผู้ใหญ่และผู้บังคับบัญชาเมตตาช่วยเหลือ ได้รับใบอนุญาต รางวัลเกียรติยศ หรือสำเร็จการศึกษาระดับสูง',
          wealth: 'การเงินมีผู้อุปถัมภ์ มีโอกาสซื้อบ้าน ที่ดิน หรืออสังหาริมทรัพย์เป็นของตนเอง',
          love: 'ความสัมพันธ์อบอุ่นเหมือนคนในครอบครัว มีคนคอยดูแลเอาใจใส่ คู่ครองมีวุฒิภาวะสูง'
        }
      };

      const reading = godReadings[tg.zh] || godReadings['比肩'];
      let warningText = 'รักษาสมดุลชีวิต พักผ่อนให้เพียงพอ และตรวจสุขภาพสม่ำเสมอ';
      if (clashes.length > 0) {
        warningText = `ระวังการปะทะ (ชง) กับ${clashes.map(c => c.pillarLabel).join(', ')}: ${clashes.map(c => c.desc).join(' | ')}`;
      }

      // Contextual deep injection for cooling water effect when chart is hot
      const elemPct = chart.elementPercentages || {};
      let deepOverview = reading.theme;
      let deepCareer = reading.career;
      if (chart.dayMaster && chart.dayMaster.zh === '辛' && (elemPct.fire || 0) >= 35 && (daYunPillar.stem.zh === '壬' || daYunPillar.branch.zh === '子')) {
        deepOverview = 'สำหรับดิถีทองซิงที่ผังเดิมไฟร้อนแรง วัยจรน้ำหยิมจื่อ (壬子) ถือเป็น "สายน้ำแห่งปัญญาและนวัตกรรม" ที่เข้ามาช่วยดับคลายความร้อนของไฟ ทำให้เกิดการตื่นรู้ ปลดปล่อยพลังความคิดสร้างสรรค์ นวัตกรรม ศาสตร์พยากรณ์ และความกล้าคิดกล้าทำเพื่อสร้างเส้นทางของตนเอง';
        deepCareer = 'ช่วงเวลาแห่งการปลดแอกและฉีกกรอบเดิมๆ ปัญญาไหวพริบและประสบการณ์จะถูกนำมาสร้างผลงานที่โดดเด่น มีชื่อเสียงในแวดวงเฉพาะทาง เหมาะกับการเปิดตัวธุรกิจ นวัตกรรม หรือศาสตร์พยากรณ์';
      }

      return {
        pillar: daYunPillar,
        isFavorable: isFav,
        favorabilityText: isFav ? 'วัยจรธาตุให้คุณ (ช่วงเวลาทองคำ เกื้อหนุนดวงชะตา)' : 'วัยจรธาตุท้าทาย (ต้องใช้ความรอบคอบและตั้งรับอย่างมีสติ)',
        theme: deepOverview,
        overview: deepOverview,
        career: deepCareer,
        wealth: reading.wealth,
        love: reading.love,
        warning: warningText,
        clashes
      };
    },

    // 10. Annual Fortune Prediction (流年 - Liu Nian)
    calculateAnnualFortune: function (chart, targetYear) {
      if (!chart) return null;
      const y = parseInt(targetYear, 10) || new Date().getFullYear();

      const sIdx = ((y - 4) % 10 + 10) % 10;
      const bIdx = ((y - 4) % 12 + 12) % 12;
      const stem = STEMS[sIdx];
      const branch = BRANCHES[bIdx];
      const stemGod = getTenGod(chart.dayMaster, stem);
      const branchGod = getTenGod(chart.dayMaster, STEMS.find(s => s.zh === branch.hidden[0].stem));
      const naYin = getNaYin(sIdx, bIdx);

      // 1. Identify active Da Yun (วัยจร 10 ปี) for targetYear y
      const birthYear = chart.birthDateString ? parseInt(chart.birthDateString.split('-')[0], 10) : new Date().getFullYear();
      const ageInYear = y - birthYear;
      let curDaYun = (chart.daYunPillars || []).find(d => ageInYear >= d.ageFrom && ageInYear <= d.ageTo);
      let isChildhood = false;

      if (!curDaYun && chart.daYunPillars && chart.daYunPillars.length > 0) {
        if (ageInYear < chart.daYunPillars[0].ageFrom) {
          isChildhood = true;
          curDaYun = {
            ageRange: `0 - ${chart.daYunPillars[0].ageFrom - 1} ปี (วัยเยาว์ก่อนเข้าวัยจร)`,
            stem: chart.pillars.month.stem,
            branch: chart.pillars.month.branch,
            tenGod: chart.pillars.month.tenGod,
            naYin: chart.pillars.month.naYin,
            isChildhood: true
          };
        } else {
          curDaYun = chart.daYunPillars[chart.daYunPillars.length - 1];
        }
      }

      // Check interactions with Natal Chart (พื้นดวง 4 เสา)
      const clashes = [];
      const harmonies = [];
      ['year', 'month', 'day', 'hour'].forEach(k => {
        const p = chart.pillars[k];
        const clash = checkBranchClash(branch.zh, p.branch.zh);
        if (clash) {
          clashes.push({ pillarKey: k, label: p.label, desc: clash.th });
        }
        const harmony = checkBranchHarmony(branch.zh, p.branch.zh);
        if (harmony) {
          harmonies.push({ pillarKey: k, label: p.label, name: harmony.name });
        }
      });

      // Check interactions between Annual Pillar (ปีจร) and Current Da Yun (วัยจร ณ ปีนั้น)
      let daYunNote = '';
      if (curDaYun && !curDaYun.isChildhood) {
        const dyClash = checkBranchClash(branch.zh, curDaYun.branch.zh);
        if (dyClash) {
          clashes.push({
            pillarKey: 'dayun',
            label: `วัยจร 10 ปี (ช่วงอายุ ${curDaYun.ageRange})`,
            desc: `ปีจรปะทะวัยจร (${dyClash.a} ปะทะ ${dyClash.b}): จุดเปลี่ยนผันหรือโยกย้ายใหญ่`
          });
          daYunNote = `ระวังจุดเปลี่ยนผันสำคัญเนื่องจากปีจรปะทะกับวัยจร 10 ปี (${curDaYun.stem.zh}${curDaYun.branch.zh})`;
        }
        const dyHarmony = checkBranchHarmony(branch.zh, curDaYun.branch.zh);
        if (dyHarmony) {
          harmonies.push({
            pillarKey: 'dayun',
            label: `วัยจร 10 ปี (ช่วงอายุ ${curDaYun.ageRange})`,
            name: `ปีจรฮะสมพงศ์กับวัยจร (${dyHarmony.name})`
          });
          daYunNote = `มีแรงเกื้อหนุนเป็นพิเศษจากวัยจร 10 ปี (${curDaYun.stem.zh}${curDaYun.branch.zh}) ช่วยส่งเสริมให้ปีนี้ราบรื่น`;
        }
        if (stem.zh === curDaYun.stem.zh && branch.zh === curDaYun.branch.zh) {
          harmonies.push({
            pillarKey: 'dayun_binglin',
            label: `วัยจร 10 ปี`,
            name: `สภาวะ岁运并临 (ปีจรตรงกับวัยจรพอดี: พลังวัยจรเข้มข้นสูงสุด เป็นปีหัวเลี้ยวหัวต่อ)`
          });
          daYunNote = `สภาวะปีจรตรงกับวัยจรพอดี (岁运并临) พลังวัยจรเข้มข้นสูงสุด เป็นปีแห่งการเปลี่ยนแปลงครั้งสำคัญ`;
        }
      }

      // Element favorability (Integrating Liu Nian + Da Yun Macro Influence)
      const isStemFav = chart.favorableElements.includes(stem.element);
      const isBranchFav = chart.favorableElements.includes(branch.element);
      const isDaYunFav = curDaYun ? (chart.favorableElements.includes(curDaYun.stem.element) || chart.favorableElements.includes(curDaYun.branch.element)) : false;

      let scoreStars = 3;
      if (isStemFav && isBranchFav) scoreStars = 5;
      else if (isStemFav || isBranchFav) scoreStars = 4;
      if (isDaYunFav && scoreStars < 5) scoreStars += 1; // Macro climate boost from Da Yun
      if (clashes.length > 0) scoreStars = Math.max(2, scoreStars - 1);

      // Annual Readings by Stem God
      const annualReadings = {
        '比肩': {
          overview: `ปี ${y} (${stem.zh}${branch.zh}) เป็นปีแห่งการขยายเครือข่าย พึ่งพาความสามารถตนเอง และการทำงานร่วมกับพันธมิตร`,
          career: 'การร่วมมือกับเพื่อนร่วมงานหรือพาร์ทเนอร์นำมาซึ่งผลลัพธ์ที่ดี แต่ต้องแบ่งขอบเขตหน้าที่และผลประโยชน์ให้โปร่งใส',
          wealth: 'การเงินหมุนเวียนสม่ำเสมอ มีค่าใช้จ่ายเพื่อการสังสรรค์และการลงทุนสร้างคอนเนกชัน หลีกเลี่ยงการให้ผู้อื่นยืมเงิน',
          love: 'คนโสดมีโอกาสพบรักจากกลุ่มเพื่อนหรือการทำกิจกรรมร่วมกัน คนมีคู่ควรลดการเอาชนะและเพิ่มการรับฟัง',
          health: 'ระวังอาการปวดกล้ามเนื้อ แขนขา และการเหนื่อยล้าจากการทำงานหนัก ควรจัดเวลาพักผ่อน'
        },
        '劫財': {
          overview: `ปี ${y} (${stem.zh}${branch.zh}) เป็นปีแห่งการขับเคี่ยว การแข่งขัน และการใช้โอกาสจากความกล้าคิดกล้าทำ`,
          career: 'มีโอกาสทางธุรกิจใหม่ๆ ที่ท้าทาย แข่งขันสูง ต้องใช้กลยุทธ์ที่เฉียบขาดเพื่อครองส่วนแบ่งตลาด',
          wealth: 'มีรายจ่ายจรและเงินไหลออกเร็ว การเปลี่ยนเงินสดเป็นสินทรัพย์ถาวรหรือการลงทุนในอสังหาฯ ช่วยแก้เคล็ดเงินรั่วไหล',
          love: 'ระวังอารมณ์หงุดหงิดหรือความไม่ไว้ใจซึ่งกันและกัน คนโสดควรดูใจนานๆ ก่อนตกลงปลงใจ',
          health: 'ระวังความเครียดสะสม และอุบัติเหตุจากการเดินทางด้วยความรีบร้อน ควรบริจาคโลหิตเพื่อเสริมมงคล'
        },
        '食神': {
          overview: `ปี ${y} (${stem.zh}${branch.zh}) เป็นปีแห่งความสุขสำราญ ความคิดสร้างสรรค์ และการต่อยอดโปรเจกต์ใหม่`,
          career: 'งานสร้างสรรค์ นวัตกรรม และการเจรจาประสบผลสำเร็จอย่างงดงาม ผู้คนชื่นชอบในฝีมือและผลงาน ค้าขายเจริญก้าวหน้า',
          wealth: 'การเงินคล่องตัว มีช่องทางทำเงินใหม่ๆ งอกเงยจากสิ่งที่รักหรือทักษะเฉพาะตัว มีกินมีใช้ไม่ขาดมือ',
          love: 'ความรักหวานชื่น อบอุ่น คนโสดมีเสน่ห์เมตตามหานิยม มีเกณฑ์พบคนที่พูดคุยถูกคออย่างลึกซึ้ง',
          health: 'สุขภาพกายใจสมบูรณ์ ระวังเพียงน้ำหนักตัวขึ้นและระบบย่อยอาหารจากการรับประทานอาหารอร่อยบ่อยครั้ง'
        },
        '傷官': {
          overview: `ปี ${y} (${stem.zh}${branch.zh}) เป็นปีแห่งการฉีกกรอบ โดดเด่นทางสติปัญญา และการสร้างชื่อเสียงในแบบของตนเอง`,
          career: 'มีไหวพริบปฏิภาณเฉียบคม ปฏิวัติการทำงานจนได้ผลงานชั้นเลิศ ระวังเพียงการแสดงความเห็นที่ตรงเกินไปจนขัดใจผู้ใหญ่',
          wealth: 'หาเงินได้รวดเร็วจากช่องทางดิจิทัลและงานสร้างสรรค์ ลาภลอยโดดเด่น การลงทุนที่มีชั้นเชิงให้ผลตอบแทนสูง',
          love: 'คนโสดเลือกเยอะและต้องการคนที่มีทัศนคติเฉียบคมเหมือนกัน คนมีคู่ควรลดความจู้จี้เพื่อความสงบสุข',
          health: 'ระวังการนอนไม่หลับ สายตา และระบบประสาทตึงเครียดจากการใช้ความคิดอย่างหนัก'
        },
        '偏財': {
          overview: `ปี ${y} (${stem.zh}${branch.zh}) เป็นปีแห่งโชคลาภพิเศษ การเงินหมุนเวียนคล่องตัว และโอกาสทางธุรกิจรอบด้าน`,
          career: 'เหมาะกับการริเริ่มทำธุรกิจส่วนตัว ลงทุน หรือจับโครงการใหญ่ มีโอกาสขยายสาขาหรือรับงานพิเศษที่สร้างผลกำไรสูง',
          wealth: 'กระแสเงินสดพุ่งทะยาน มีลาภลอยหรือผลตอบแทนจากการลงทุนคุ้มค่า เป็นปีที่กล้าลุยแล้วเห็นผลลัพธ์มั่งคั่ง',
          love: 'คนโสดมีเสน่ห์ดึงดูดใจ มีคนเข้ามาคุยหลายคน คนมีคู่ควรชวนกันทำธุรกิจหรือวางแผนการเงินร่วมกัน',
          health: 'ระวังการพักผ่อนไม่เพียงพอจากกิจกรรมทางสังคมที่หนาแน่น ควรดูแลระบบตับและดื่มน้ำสะอาด'
        },
        '正財': {
          overview: `ปี ${y} (${stem.zh}${branch.zh}) เป็นปีแห่งความมั่นคง มั่งคั่งเป็นกอบเป็นกำ และการสั่งสมทรัพย์สิน`,
          career: 'หน้าที่การงานก้าวหน้า ได้รับการประเมินผลงานยอดเยี่ยม มีเสถียรภาพสูงและได้รับการยอมรับจากองค์กร',
          wealth: 'รายได้ประจำเพิ่มขึ้น วางแผนซื้อบ้าน ที่ดิน หรือลงทุนระยะยาวได้สำเร็จ มีวินัยทางการเงินที่ยอดเยี่ยม',
          love: 'ความรักมั่นคงมาก คนโสดมีเกณฑ์พบรักกับคนมีฐานะมั่นคงและจริงจัง คนมีคู่ความสัมพันธ์ลงตัว',
          health: 'สุขภาพแข็งแรงดี ควรตรวจสุขภาพประจำปีตามปกติ และออกกำลังกายสม่ำเสมอ'
        },
        '七殺': {
          overview: `ปี ${y} (${stem.zh}${branch.zh}) เป็นปีแห่งการก้าวกระโดดครั้งใหญ่ การเผชิญหน้ากับความท้าทาย และการสร้างอำนาจบารมี`,
          career: 'ได้รับมอบหมายงานที่ยากและมีความรับผิดชอบสูง แต่หากทำให้สำเร็จจะเป็นใบเบิกทางสู่อำนาจและตำแหน่งสูงสุด',
          wealth: 'การเงินมีโอกาสเติบโตแบบก้าวกระโดด แต่ต้องระวังความเสี่ยงจากการลงทุนเกินตัว',
          love: 'คนโสดมีเกณฑ์พบคนรักบุคลิกผู้นำเด็ดขาด คนมีคู่ต้องถ้อยทีถ้อยอาศัย ไม่นำความตึงเครียดจากงานเข้าบ้าน',
          health: 'ระวังอุบัติเหตุ ความดัน และอาการปวดเมื่อยหลัง ควรหมั่นปล่อยปลา ทำบุญโลงศพเพื่อเสริมดวงบารมี'
        },
        '正官': {
          overview: `ปี ${y} (${stem.zh}${branch.zh}) เป็นปีแห่งเกียรติยศชื่อเสียง ความเจริญก้าวหน้าในตำแหน่ง และคุณธรรมคุ้มครอง`,
          career: 'ได้รับการเลื่อนขั้น เลื่อนตำแหน่ง หรือสอบแข่งขันสำเร็จ สัญญาข้อตกลงราบรื่น ได้รับการยกย่องในวงสังคม',
          wealth: 'การเงินมั่นคงและมีเกียรติ รายได้เติบโตตามตำแหน่งหน้าที่ มีโชคจากความซื่อสัตย์สุจริต',
          love: 'ความรักราบรื่นและได้รับการสนับสนุนจากผู้ใหญ่ คนโสดมีเกณฑ์แต่งงานหรือพบเนื้อคู่ที่มีคุณธรรม',
          health: 'สุขภาพดี จิตใจสงบ ควรระวังเพียงอาการเมื่อยล้าจากการนั่งทำงานโต๊ะเป็นเวลานาน'
        },
        '偏印': {
          theme: 'ปีแห่งปัญญาญาณ การเรียนรู้ศาสตร์เฉพาะทาง และสัมผัสหยั่งรู้แม่นยำ',
          overview: `ปี ${y} (${stem.zh}${branch.zh}) เป็นปีแห่งการศึกษาค้นคว้า ศาสตร์ลี้ลับ วิทยาการใหม่ และงานเบื้องหลัง`,
          career: 'ทำงานที่ต้องใช้ความเชี่ยวชาญเฉพาะทางได้ดีเยี่ยม เหมาะกับการวิจัย คิดค้น หรือให้คำปรึกษาเชิงลึก',
          wealth: 'มีโชคจากความรู้เฉพาะตัวและไอเดียที่ไม่เหมือนใคร การเงินเข้ามาแบบเงียบๆ แต่มั่นคง',
          love: 'มีความรักแบบลึกซึ้งและต้องการความเข้าใจสูง คนโสดอาจพบรักกับคนในแวดวงวิชาการหรือสายมู',
          health: 'ระวังระบบย่อยอาหาร การนอนหลับ และความวิตกกังวล ควรฝึกสมาธิและปล่อยวาง'
        },
        '正印': {
          overview: `ปี ${y} (${stem.zh}${branch.zh}) เป็นปีแห่งความร่มเย็นเป็นสุข ผู้ใหญ่อุปถัมภ์ค้ำชู และสุขภาพกายใจฟื้นฟู`,
          career: 'ผู้บังคับบัญชาเมตตา ได้รับการช่วยเหลือยามติดขัด สอบผ่านฉลุย มีความก้าวหน้าอย่างสง่างาม',
          wealth: 'การเงินมีเกราะคุ้มกัน มีผู้ใหญ่ให้การสนับสนุน หรือได้ทรัพย์มรดก/ของขวัญล้ำค่า',
          love: 'ความรักอบอุ่นมั่นคง คนรักคอยดูแลเอาใจใส่ประดุจคนในครอบครัว มีความสงบสุขในบ้าน',
          health: 'สุขภาพฟื้นฟู สุขภาพจิตแจ่มใส เป็นปีที่เหมาะแก่การฟื้นฟูร่างกายและพักผ่อนจิตใจ'
        }
      };

      // Deep Metaphysical Detection: 岁运天克地冲 (Tian Ke Di Chong with active Da Yun)
      let isTianKeDiChong = false;
      let isSanHuiFire = false;

      if (curDaYun && !curDaYun.isChildhood && curDaYun.stem && curDaYun.branch) {
        const daYunStemZh = curDaYun.stem.zh;
        const daYunBranchZh = curDaYun.branch.zh;

        const stemClash = (stem.zh === '丙' && daYunStemZh === '壬') || (stem.zh === '壬' && daYunStemZh === '丙') ||
          (stem.zh === '甲' && daYunStemZh === '庚') || (stem.zh === '庚' && daYunStemZh === '甲') ||
          (stem.zh === '乙' && daYunStemZh === '辛') || (stem.zh === '辛' && daYunStemZh === '乙') ||
          (stem.zh === '丁' && daYunStemZh === '癸') || (stem.zh === '癸' && daYunStemZh === '丁');

        const branchClash = (branch.zh === '午' && daYunBranchZh === '子') || (branch.zh === '子' && daYunBranchZh === '午') ||
          (branch.zh === '未' && daYunBranchZh === '丑') || (branch.zh === '丑' && daYunBranchZh === '未') ||
          (branch.zh === '申' && daYunBranchZh === '寅') || (branch.zh === '寅' && daYunBranchZh === '申') ||
          (branch.zh === '酉' && daYunBranchZh === '卯') || (branch.zh === '卯' && daYunBranchZh === '酉') ||
          (branch.zh === '戌' && daYunBranchZh === '辰') || (branch.zh === '辰' && daYunBranchZh === '戌') ||
          (branch.zh === '亥' && daYunBranchZh === '巳') || (branch.zh === '巳' && daYunBranchZh === '亥');

        if (stemClash && branchClash) {
          isTianKeDiChong = true;
          // Prepend high-priority clash tag
          clashes.unshift({
            pillarKey: 'tian_ke_di_chong',
            label: `วัยจร 10 ปี (岁运天克地冲: ฟ้าพิฆาต ดินปะทะ)`,
            desc: `ปีจร ${stem.zh}${branch.zh} ปะทะกับวัยจร ${daYunStemZh}${daYunBranchZh} ทั้งฟ้าและดิน! มหาจุดเปลี่ยนผันและรื้อโครงสร้างชีวิตครั้งสำคัญในรอบ 10 ปี (Breakthrough Turning Point)`
          });
        }
      }

      // Deep Detection: 三会南方火局 (巳-午-未)
      const natalBranches = ['year', 'month', 'day', 'hour'].map(k => chart.pillars[k] && chart.pillars[k].branch ? chart.pillars[k].branch.zh : '');
      if (natalBranches.includes('巳') && natalBranches.includes('未') && branch.zh === '午') {
        isSanHuiFire = true;
        harmonies.unshift({
          pillarKey: 'san_hui_fire',
          label: 'ซาฮุ่ย 3 ประสานไฟใต้',
          name: `巳-午-未 รวมพลังซาฮุ่ยไฟใต้ระดับมหาพลัง! แรงผลักดัน ภาระหน้าที่ และการขับเคลื่อนพุ่งสู่จุดสูงสุด`
        });
      }

      const reading = annualReadings[stemGod.zh] || annualReadings['比肩'];

      // Contextual Override for deep accuracy
      let finalOverview = daYunNote ? `${reading.overview} (${daYunNote})` : reading.overview;
      let finalCareer = reading.career;
      let finalWealth = reading.wealth;
      let finalLove = reading.love;
      let finalHealth = reading.health;

      // Deep Metaphysical Breakthrough Check:
      // If Tian Ke Di Chong with Da Yun OR Zi-Wu Clash (Water vs Fire) between Annual and Da Yun
      const isZiWuDaYunClash = curDaYun && !curDaYun.isChildhood && curDaYun.branch &&
        ((branch.zh === '午' && curDaYun.branch.zh === '子') || (branch.zh === '子' && curDaYun.branch.zh === '午'));

      if (isTianKeDiChong || (isZiWuDaYunClash && (stem.zh === '丙' || (curDaYun.stem && curDaYun.stem.zh === '壬')))) {
        finalOverview = `ปี ${y} (${stem.zh}${branch.zh}) ถือเป็น "มหาปีแห่งจุดเปลี่ยนผันและรื้อโครงสร้างชีวิตครั้งสำคัญในรอบ 10 ปี" (Major Breakthrough Turning Point)! เกิดปรากฏการณ์ "ปีจรปะทะวัยจรทั้งฟ้าและดิน" (岁运天克地冲 ระหว่างปีจร ${stem.zh}${branch.zh} กับวัยจร ${curDaYun.stem.zh}${curDaYun.branch.zh})${isSanHuiFire ? ' ควบคู่กับ "ซาฮุ่ยไฟใต้ระดับมหาพลัง" (巳-午-未 三会火局)' : ''} แรงผลักดันจากความตึงเครียดและภาระเดิมๆ จะบีบให้เจ้าชะตาต้องลุกขึ้นมาปฏิรูปเปลี่ยนแปลงวิถีชีวิต ปลดแอกสิ่งที่กดทับ และสร้างเส้นทางใหม่ที่เป็นของตนเอง`;
        finalCareer = `ไม่ใช่ปีที่นั่งรอการเลื่อนตำแหน่งแบบชิลๆ แต่เป็นปีแห่งการ "ปฏิวัติระบบงานและธุรกิจ" ปัญญาและวิสัยทัศน์ที่สั่งสมมา (伤官 壬น้ำ) จะถูกงัดออกมาสยบแรงกดดันและกฎเกณฑ์เก่าๆ (官杀 丙ไฟ) เหมาะอย่างยิ่งกับการเปิดตัวนวัตกรรมใหม่ ศาสตร์พยากรณ์ เทคโนโลยี หรือโปรเจกต์อิสระที่ตนเองเป็นผู้นำ ไม่ยอมทนอยู่ใต้ข้อกำหนดที่ไม่เป็นธรรมอีกต่อไป`;
        finalWealth = `เกิดกระแสเงินหมุนเวียนก้อนใหญ่ มีทั้งรายจ่ายจรในการลงทุนปรับเปลี่ยนธุรกิจ และรายได้ที่พร้อมเติบโตก้าวกระโดดจากไอเดียใหม่ กลยุทธ์สำคัญคือ "แปลงเงินสดเป็นสินทรัพย์ถาวร" (ที่ดิน, อสังหาฯ, ทองคำ) ทันทีที่ได้กำไร ห้ามให้ใครยืมเงินหรือค้ำประกันเด็ดขาด`;
        finalLove = `ปีแห่งการชี้ขาดและจัดระเบียบความสัมพันธ์! การปะทะกันของน้ำกับไฟ (子午冲) จะไม่ยอมให้มีความคลุมเครือหรือความอึดอัดใจสะสมอีกต่อไป หากมีคู่ครองอยู่แล้ว แนะนำให้แก้เคล็ดด้วยการชวนกันเดินทางท่องเที่ยวไกลๆ ต่างจังหวัด/ต่างประเทศ หรือจัดห้องนอนใหม่เพื่อสลายพลังการปะทะ`;
        finalHealth = `จุดที่ต้องระมัดระวังที่สุดในปีนี้! ผลจากการที่ "น้ำปะทะไฟ" (子午相冲) รุนแรงมาก ต้องดูแล: 1. ระบบหัวใจ หลอดเลือด และความดันโลหิต 2. สายตา อาการไมเกรน และการนอนหลับ 3. ระบบฮอร์โมนสตรีและทางเดินปัสสาวะ ควรตรวจสุขภาพประจำปีแต่เนิ่นๆ บริจาคเลือด และฝึกสมาธิคลายความร้อนในใจ`;
      } else if (isZiWuDaYunClash) {
        finalOverview = `ปี ${y} (${stem.zh}${branch.zh}) เป็นปีแห่งการปะทะปรับสมดุลครั้งใหญ่ (ปีจรชงวัยจร 子-午 冲: น้ำปะทะไฟ) มีความผันผวนและการเปลี่ยนแปลงในระบบงานและชีวิต เป็นจังหวะที่ต้องตั้งรับอย่างมีสติและปรับตัว`;
        finalCareer = `งานมีความตึงเครียดและการปรับเปลี่ยนโครงสร้างหรือสถานที่ทำงาน ไม่ควรปะทะกับผู้ใหญ่หรือหุ้นส่วน ให้ใช้ความนิ่งและแผนสำรองเข้าสู้`;
        finalWealth = `ระวังเงินรั่วไหลจากการหมุนเงินไม่ทันหรือรายจ่ายกะทันหัน ควรชะลอการลงทุนเก็งกำไรที่มีความเสี่ยงสูง`;
        finalLove = `อารมณ์ขึ้นลงง่ายเนื่องจากการปะทะของธาตุน้ำ-ไฟ ควรให้พื้นที่ส่วนตัวแก่กันและหลีกเลี่ยงการใช้อารมณ์ตัดสินปัญหา`;
        finalHealth = `ระวังสุขภาพระบบหัวใจ ความดัน สายตา และระบบน้ำในร่างกาย`;
      }

      return {
        year: y,
        stem,
        branch,
        stemGod,
        branchGod,
        naYin,
        scoreStars,
        clashes,
        harmonies,
        curDaYun,
        daYunNote,
        ageInYear,
        overview: finalOverview,
        career: finalCareer,
        wealth: finalWealth,
        love: finalLove,
        health: finalHealth
      };
    },

    // 11. Monthly Fortune Prediction (流月 - Liu Yue)
    // วิเคราะห์เจาะลึก 12 สารท โดยผสาน [เดือนจร + ปีจร (ไท้ส่วย) + วัยจร 10 ปี + 4 เสาพื้นดวง] ครบถ้วนทั้ง Interactions และปฏิกิริยาธาตุก่อนออกผลทำนาย
    calculateMonthlyFortune: function (chart, targetYear) {
      if (!chart) return [];
      const y = parseInt(targetYear, 10) || new Date().getFullYear();
      const yrStemIdx = ((y - 4) % 10 + 10) % 10;
      const yrBranchIdx = ((y - 4) % 12 + 12) % 12;
      const mTigerStart = (yrStemIdx % 5) * 2 + 2;

      // 1. ระบุปีจร (Annual Tai Sui)
      const taiSuiStem = STEMS[yrStemIdx];
      const taiSuiBranch = BRANCHES[yrBranchIdx];

      // 2. ระบุวัยจร 10 ปี (Active Da Yun) ณ ปีเป้าหมาย
      const birthYear = chart.birthDateString ? parseInt(chart.birthDateString.split('-')[0], 10) : new Date().getFullYear();
      const ageInYear = y - birthYear;
      let curDaYun = (chart.daYunPillars || []).find(d => ageInYear >= d.ageFrom && ageInYear <= d.ageTo);
      if (!curDaYun && chart.daYunPillars && chart.daYunPillars.length > 0) {
        if (ageInYear < chart.daYunPillars[0].ageFrom) {
          curDaYun = {
            ageRange: `0 - ${chart.daYunPillars[0].ageFrom - 1} ปี (วัยเยาว์)`,
            stem: chart.pillars.month.stem,
            branch: chart.pillars.month.branch,
            tenGod: chart.pillars.month.tenGod,
            isChildhood: true
          };
        } else {
          curDaYun = chart.daYunPillars[chart.daYunPillars.length - 1];
        }
      }
      const daYunStem = curDaYun ? curDaYun.stem : null;
      const daYunBranch = curDaYun ? curDaYun.branch : null;

      // 3. ข้อมูลพื้นดวง (Natal Chart)
      const dm = chart.dayMaster;
      const dayBranch = chart.pillars.day.branch;
      const monthBranch = chart.pillars.month.branch;
      const yearBranch = chart.pillars.year.branch;
      const hourBranch = chart.pillars.hour.branch;
      const favElements = chart.favorableElements || [];
      const tiaoHouElement = chart.tiaoHou ? chart.tiaoHou.element : null;

      // Interaction Maps & Metaphysical Formulas
      const stemCombos = { '甲': '己', '己': '甲', '乙': '庚', '庚': '乙', '丙': '辛', '辛': '丙', '丁': '壬', '壬': '丁', '戊': '癸', '癸': '戊' };
      const stemComboTrans = {
        '甲-己': 'ดิน', '己-甲': 'ดิน',
        '乙-庚': 'ทอง', '庚-乙': 'ทอง',
        '丙-辛': 'น้ำ', '辛-丙': 'น้ำ',
        '丁-壬': 'ไม้', '壬-丁': 'ไม้',
        '戊-癸': 'ไฟ', '癸-戊': 'ไฟ'
      };
      const stemClashes = { '甲': '庚', '庚': '甲', '乙': '辛', '辛': '乙', '丙': '壬', '壬': '丙', '丁': '癸', '癸': '丁' };
      const sixCombos = { '子': '丑', '丑': '子', '寅': '亥', '亥': '寅', '卯': '戌', '戌': '卯', '辰': '酉', '酉': '辰', '巳': '申', '申': '巳', '午': '未', '未': '午' };
      const sixClashes = { '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅', '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳' };
      const sixHarms = { '子': '未', '未': '子', '丑': '午', '午': '丑', '寅': '巳', '巳': '寅', '卯': '辰', '辰': '卯', '申': '亥', '亥': '申', '酉': '戌', '戌': '酉' };
      const sixDestructions = { '子': '酉', '酉': '子', '丑': '辰', '辰': '丑', '寅': '亥', '亥': '寅', '卯': '午', '午': '卯', '巳': '申', '申': '巳', '未': '戌', '戌': '未' };
      const triadGroups = [
        { name: 'Water', element: 'water', th: 'ธาตุน้ำ', branches: ['申', '子', '辰'] },
        { name: 'Wood', element: 'wood', th: 'ธาตุไม้', branches: ['亥', '卯', '未'] },
        { name: 'Fire', element: 'fire', th: 'ธาตุไฟ', branches: ['寅', '午', '戌'] },
        { name: 'Metal', element: 'metal', th: 'ธาตุทอง', branches: ['巳', '酉', '丑'] }
      ];
      const sanHuiGroups = [
        { name: 'Fire', element: 'fire', th: 'ธาตุไฟใต้', branches: ['巳', '午', '未'] },
        { name: 'Water', element: 'water', th: 'ธาตุน้ำเหนือ', branches: ['亥', '子', '丑'] },
        { name: 'Wood', element: 'wood', th: 'ธาตุไม้บูรพา', branches: ['寅', '卯', '辰'] },
        { name: 'Metal', element: 'metal', th: 'ธาตุทองประจิม', branches: ['申', '酉', '戌'] }
      ];

      // 12 Chinese Solar Months metadata
      const monthMeta = [
        { num: 1, branchIdx: 2, labelDate: '4 ก.พ.', solarTh: 'ก.พ. (เดือนขาล - 立春/雨水)', dates: '4 ก.พ. - 4 มี.ค.' },
        { num: 2, branchIdx: 3, labelDate: '5 มี.ค.', solarTh: 'มี.ค. (เดือนเถาะ - 惊蛰/春分)', dates: '5 มี.ค. - 3 เม.ย.' },
        { num: 3, branchIdx: 4, labelDate: '4 เม.ย.', solarTh: 'เม.ย. (เดือนมะโรง - 清明/谷雨)', dates: '4 เม.ย. - 4 พ.ค.' },
        { num: 4, branchIdx: 5, labelDate: '5 พ.ค.', solarTh: 'พ.ค. (เดือนมะเส็ง - 立夏/小满)', dates: '5 พ.ค. - 4 มิ.ย.' },
        { num: 5, branchIdx: 6, labelDate: '5 มิ.ย.', solarTh: 'มิ.ย. (เดือนมะเมีย - 芒种/夏至)', dates: '5 มิ.ย. - 5 ก.ค.' },
        { num: 6, branchIdx: 7, labelDate: '6 ก.ค.', solarTh: 'ก.ค. (เดือนมะแม - 小暑/大暑)', dates: '6 ก.ค. - 6 ส.ค.' },
        { num: 7, branchIdx: 8, labelDate: '7 ส.ค.', solarTh: 'ส.ค. (เดือนวอก - 立秋/处暑)', dates: '7 ส.ค. - 6 ก.ย.' },
        { num: 8, branchIdx: 9, labelDate: '7 ก.ย.', solarTh: 'ก.ย. (เดือนระกา - 白露/秋分)', dates: '7 ก.ย. - 7 ต.ค.' },
        { num: 9, branchIdx: 10, labelDate: '8 ต.ค.', solarTh: 'ต.ค. (เดือนจอ - 寒露/霜降)', dates: '8 ต.ค. - 6 พ.ย.' },
        { num: 10, branchIdx: 11, labelDate: '7 พ.ย.', solarTh: 'พ.ย. (เดือนกุน - 立冬/小雪)', dates: '7 พ.ย. - 6 ธ.ค.' },
        { num: 11, branchIdx: 0, labelDate: '7 ธ.ค.', solarTh: 'ธ.ค. (เดือนชวด - 大雪/冬至)', dates: '7 ธ.ค. - 4 ม.ค.' },
        { num: 12, branchIdx: 1, labelDate: '5 ม.ค.', solarTh: 'ม.ค. ถัดไป (เดือนฉลู - 小寒/大寒)', dates: '5 ม.ค. - 3 ก.พ.' }
      ];

      const now = new Date();
      const currentCalYear = now.getFullYear();
      const currentCalMonth = now.getMonth() + 1;

      return monthMeta.map((m, idx) => {
        const mStemIdx = (mTigerStart + idx) % 10;
        const stem = STEMS[mStemIdx];
        const branch = BRANCHES[m.branchIdx];
        const stemGod = getTenGod(dm, stem);
        const branchMainStem = STEMS.find(s => s.zh === branch.hidden[0].stem) || stem;
        const branchGod = getTenGod(dm, branchMainStem);
        const naYin = getNaYin(mStemIdx, m.branchIdx);

        const mS = stem.zh;
        const mB = branch.zh;

        // ========================================================
        // 1. วิเคราะห์ปฏิสัมพันธ์กับปีจร (Annual Tai Sui)
        // ========================================================
        const tianDiHeTaiSui = (stemCombos[mS] === taiSuiStem.zh && sixCombos[mB] === taiSuiBranch.zh);
        const wuHeTaiSui = (stemCombos[mS] === taiSuiStem.zh);
        const stemClashTaiSui = (stemClashes[mS] === taiSuiStem.zh);
        const sixHeTaiSui = (sixCombos[mB] === taiSuiBranch.zh);
        const clashTaiSui = (sixClashes[mB] === taiSuiBranch.zh);
        const fanYinTaiSui = (stemClashTaiSui && clashTaiSui);
        const fuYinTaiSui = (mS === taiSuiStem.zh && mB === taiSuiBranch.zh);
        const harmTaiSui = (sixHarms[mB] === taiSuiBranch.zh);
        const destructionTaiSui = (sixDestructions[mB] === taiSuiBranch.zh);
        const banSanHeTaiSui = triadGroups.find(g => g.branches.includes(mB) && g.branches.includes(taiSuiBranch.zh) && mB !== taiSuiBranch.zh);

        // ========================================================
        // 2. วิเคราะห์ปฏิสัมพันธ์กับวัยจร 10 ปี (Active Da Yun)
        // ========================================================
        const dyS = daYunStem ? daYunStem.zh : null;
        const dyB = daYunBranch ? daYunBranch.zh : null;
        const tianDiHeDaYun = dyS && dyB ? (stemCombos[mS] === dyS && sixCombos[mB] === dyB) : false;
        const wuHeDaYun = dyS ? (stemCombos[mS] === dyS) : false;
        const stemClashDaYun = dyS ? (stemClashes[mS] === dyS) : false;
        const sixHeDaYun = dyB ? (sixCombos[mB] === dyB) : false;
        const clashDaYun = dyB ? (sixClashes[mB] === dyB) : false;
        const fanYinDaYun = (stemClashDaYun && clashDaYun);
        const fuYinDaYun = dyS && dyB ? (mS === dyS && mB === dyB) : false;
        const harmDaYun = dyB ? (sixHarms[mB] === dyB) : false;
        const destructionDaYun = dyB ? (sixDestructions[mB] === dyB) : false;
        const banSanHeDaYun = dyB ? triadGroups.find(g => g.branches.includes(mB) && g.branches.includes(dyB) && mB !== dyB) : null;

        // ========================================================
        // 3. วิเคราะห์ปฏิสัมพันธ์กับพื้นดวง 4 เสา (Natal Pillars)
        // ========================================================
        const clashDay = (sixClashes[mB] === dayBranch.zh);
        const clashMonth = (sixClashes[mB] === monthBranch.zh);
        const clashYear = (sixClashes[mB] === yearBranch.zh);
        const clashHour = (sixClashes[mB] === hourBranch.zh);
        const stemClashDM = (stemClashes[mS] === dm.zh);
        const tianDiHeDay = (stemCombos[mS] === dm.zh && sixCombos[mB] === dayBranch.zh);
        const wuHeDM = (stemCombos[mS] === dm.zh);
        const sixHeDay = (sixCombos[mB] === dayBranch.zh);
        const sixHeMonth = (sixCombos[mB] === monthBranch.zh);
        const fanYinDay = (stemClashDM && clashDay);
        const fuYinDay = (mS === dm.zh && mB === dayBranch.zh);
        const harmDay = (sixHarms[mB] === dayBranch.zh);
        const destructionDay = (sixDestructions[mB] === dayBranch.zh);

        // ========================================================
        // 4. วิเคราะห์ไตรภาคี (San He), 3 ประสานทิศ (San Hui) & ซาเฮ้ง (San Xing)
        // ========================================================
        const fullBranches = [
          hourBranch.zh,
          dayBranch.zh,
          monthBranch.zh,
          yearBranch.zh,
          taiSuiBranch.zh,
          mB
        ];
        if (dyB) fullBranches.push(dyB);

        // ไตรภาคีสมบูรณ์ (Full San He)
        const fullSanHe = triadGroups.find(g => g.branches.includes(mB) && g.branches.every(br => fullBranches.includes(br)));

        // 3 ประสานทิศสมบูรณ์ (Full San Hui)
        const fullSanHui = sanHuiGroups.find(g => g.branches.includes(mB) && g.branches.every(br => fullBranches.includes(br)));

        // ซาเฮ้ง (San Xing Punishments)
        const hasBullyingPunishment = ['寅', '巳', '申'].includes(mB) &&
          fullBranches.filter(x => ['寅', '巳', '申'].includes(x)).length >= 2;
        const hasEarthsPunishment = ['丑', '未', '戌'].includes(mB) &&
          Array.from(new Set(fullBranches.filter(x => ['丑', '未', '戌'].includes(x)))).length >= 3;
        const hasUncivilPunishment = (mB === '子' && fullBranches.includes('卯')) || (mB === '卯' && fullBranches.includes('子'));
        const hasSelfPunishment = ['辰', '午', '酉', '亥'].includes(mB) && fullBranches.filter(x => x === mB).length >= 2;

        // ========================================================
        // 5. วิเคราะห์ปฏิกิริยาธาตุ (Elemental Dynamics & Reactions)
        // ========================================================
        const isFavStem = favElements.includes(stem.element);
        const isFavBranch = favElements.includes(branch.element);
        const isFavOverall = isFavStem || isFavBranch;
        const isTiaoHou = (stem.element === tiaoHouElement || branch.element === tiaoHouElement);

        // สงครามธาตุ (Elemental Conflicts)
        const isWaterFireConflict = (['子'].includes(mB) && ['午'].includes(taiSuiBranch.zh)) ||
          (['午'].includes(mB) && ['子'].includes(taiSuiBranch.zh)) ||
          (['water'].includes(stem.element) && ['fire'].includes(taiSuiStem.element)) ||
          (['fire'].includes(stem.element) && ['water'].includes(taiSuiStem.element));

        const isMetalWoodConflict = (['寅', '卯'].includes(mB) && ['申', '酉'].includes(taiSuiBranch.zh)) ||
          (['申', '酉'].includes(mB) && ['寅', '卯'].includes(taiSuiBranch.zh));

        const isHeavyEarth = ['辰', '戌', '丑', '未'].includes(mB) && ['辰', '戌', '丑', '未'].includes(taiSuiBranch.zh);

        // ตรวจสอบการแปรธาตุจากการฮะ
        let transformedElementNote = '';
        if (wuHeTaiSui) {
          const trans = stemComboTrans[`${mS}-${taiSuiStem.zh}`] || '';
          if (trans) transformedElementNote = `ก้านฟ้าเดือนฮะกับปีจรแปลงเป็นธาตุ${trans}`;
        }

        // ========================================================
        // 6. สังเคราะห์เรตติ้งและป้ายกำกับของเดือน (Rating Badge Synthesis)
        // ========================================================
        let ratingBadge = 'ราบรื่น';
        let ratingBadgeShort = 'ราบรื่น';
        let ratingType = 'normal';

        if (fanYinTaiSui || fanYinDaYun || fanYinDay) {
          ratingBadge = '🚨 ฟ้าพิฆาตดินปะทะ (Fan Yin)';
          ratingBadgeShort = '🚨 ชงฟ้าดิน';
          ratingType = 'clash';
        } else if (clashDaYun) {
          ratingBadge = '⚠️ ชงวัยจร 10 ปี (จุดเปลี่ยน)';
          ratingBadgeShort = '⚠️ ชงวัยจร';
          ratingType = 'clash';
        } else if (clashTaiSui) {
          ratingBadge = '⚠️ ชงปีจร (ไท้ส่วย)';
          ratingBadgeShort = '⚠️ ชงปีจร';
          ratingType = 'clash';
        } else if (clashDay) {
          ratingBadge = '⚠️ ปะทะเสาวัน (วังคู่ครอง)';
          ratingBadgeShort = '⚠️ ปะทะวัน';
          ratingType = 'clash';
        } else if (clashMonth) {
          ratingBadge = '⚠️ ปะทะเสาเดือน (วังการงาน)';
          ratingBadgeShort = '⚠️ ปะทะงาน';
          ratingType = 'clash';
        } else if (hasEarthsPunishment || hasBullyingPunishment) {
          ratingBadge = '⚡ บททดสอบซาเฮ้ง (ระวังเอกสาร/อารมณ์)';
          ratingBadgeShort = '⚡ ซาเฮ้ง';
          ratingType = 'volatile';
        } else if (tianDiHeTaiSui || tianDiHeDaYun || tianDiHeDay) {
          ratingBadge = '⭐ มงคลยอดเยี่ยม (ฟ้าดินฮะส่งเสริม)';
          ratingBadgeShort = '⭐ มงคลฟ้าดิน';
          ratingType = 'auspicious';
        } else if (fullSanHe || fullSanHui) {
          const groupName = fullSanHe ? fullSanHe.th : fullSanHui.th;
          ratingBadge = `⭐ รวมพลังมหา${groupName} (จังหวะพุ่งทะยาน)`;
          ratingBadgeShort = '⭐ รวมมหาธาตุ';
          ratingType = 'auspicious';
        } else if (sixHeTaiSui || sixHeDaYun || sixHeDay) {
          ratingBadge = '⭐ ฮะสมพงศ์ส่งเสริม (พันธมิตรราบรื่น)';
          ratingBadgeShort = '⭐ ฮะสมพงศ์';
          ratingType = 'auspicious';
        } else if (isFavOverall || isTiaoHou) {
          ratingBadge = '⭐ ธาตุให้คุณเกื้อหนุน (โอกาสเติบโต)';
          ratingBadgeShort = '⭐ มงคลเกื้อหนุน';
          ratingType = 'auspicious';
        } else if (isWaterFireConflict || isMetalWoodConflict || hasSelfPunishment || harmDay || harmTaiSui) {
          ratingBadge = '⚡ ระวังความผันผวน (ธาตุปะทะ/บั่นทอน)';
          ratingBadgeShort = '⚡ ระวังผันผวน';
          ratingType = 'volatile';
        }

        // Current real-world month
        let isCurrent = false;
        if (y === currentCalYear) {
          if (m.num === 12 && currentCalMonth === 1) isCurrent = true;
          else if (m.num === currentCalMonth - 1 && currentCalMonth >= 2) isCurrent = true;
        }

        // ========================================================
        // 7. สังเคราะห์บทวิเคราะห์เจาะลึก 5 มิติ (Deep 5 Dimensions Synthesis)
        // ========================================================

        // 7.1 ภาพรวมเดือนนี้ & จังหวะชีวิต (Overview)
        let overview = '';
        if (fanYinTaiSui || fanYinDaYun) {
          overview = `เดือนนี้ตกอยู่ในสภาวะฟ้าพิฆาตดินปะทะ (天克地冲) กับ${fanYinTaiSui ? 'ปีจรไท้ส่วย' : 'วัยจร 10 ปี'} (${mS}${mB} ปะทะ ${fanYinTaiSui ? taiSuiStem.zh + taiSuiBranch.zh : dyS + dyB}) เป็นเดือนแห่งการรื้อปรับโครงสร้างและจุดเปลี่ยนผันสำคัญของจังหวะชีวิต ต้องตั้งรับด้วยสติ วางแผนสำรอง และหลีกเลี่ยงการใช้อารมณ์ปะทะ`;
        } else if (tianDiHeTaiSui) {
          overview = `เดือนนี้เกิดสภาวะฟ้าฮะดินฮะ (天地德合) ระหว่างเดือนจร ${mS}${mB} กับปีจรไท้ส่วย ${taiSuiStem.zh}${taiSuiBranch.zh} เป็นช่วงเวลาที่ฟ้าเปิดและได้รับแรงสนับสนุนเต็มที่จากสภาพแวดล้อม ผู้ใหญ่ และโอกาสรอบตัว เหมาะแก่การเจรจาตกลงเรื่องใหญ่หรือลงมือสร้างผลงานชิ้นสำคัญ`;
        } else if (tianDiHeDaYun) {
          overview = `เดือนนี้ฮะสมพงศ์ฟ้าดินกับวัยจร 10 ปี (${dyS}${dyB}) ช่วยเปิดทางให้แผนงานระยะยาวเดินหน้าได้อย่างคล่องตัว มีพลังขับเคลื่อนชีวิตที่สอดคล้องกับเส้นทางโชคชะตาอย่างลงตัว`;
        } else if (fullSanHe || fullSanHui) {
          const tName = fullSanHe ? fullSanHe.th : fullSanHui.th;
          overview = `เดือนนี้ผสานพลังงานกับปีจรและดวงชะตาก่อเกิดเป็นกลุ่มมหา${tName} พลังงานธาตุขับเคลื่อนอย่างเข้มข้น มีแรงผลักดันสูง ${favElements.includes(fullSanHe ? fullSanHe.element : fullSanHui.element) ? 'ซึ่งเป็นธาตุให้คุณ ส่งผลให้กิจการงานและการเงินก้าวกระโดด' : 'ควรระวังความใจร้อนหรือความเคร่งเครียดจากภาระหน้าที่หนาแน่น'}`;
        } else if (clashDaYun) {
          overview = `เดือนนี้มีพลังปะทะกับวัยจร 10 ปี (${dyS}${dyB}): สัญญาณของจังหวะก้าวข้ามหรือการเปลี่ยนแปลงวิถีชีวิต มีเรื่องให้ต้องตัดสินใจปรับเปลี่ยนทิศทาง ควรตั้งมั่นในความรอบคอบและไม่ผลีผลาม`;
        } else if (clashTaiSui) {
          overview = `เดือนนี้ปะทะกับปีจรไท้ส่วย (${taiSuiBranch.zh} ปะทะ ${mB}): จังหวะชีวิตมีความผันผวนสูง ระวังความขัดแย้งกับผู้มีอำนาจหรือข้อตกลงที่เปลี่ยนกะทันหัน ควรใช้ความยืดหยุ่นและการเจรจาประนีประนอมเป็นหลัก`;
        } else if (hasBullyingPunishment) {
          overview = `เดือนนี้ตกอยู่ในวังวนซาเฮ้งข่มอำนาจ (持势之刑 寅-巳-申): ต้องระวังเรื่องความขัดแย้งในหน้าที่การงาน การถูกหักหลัง หรือปัญหาเอกสารสัญญา ควรตรวจสอบรายละเอียดตัวอักษรอย่างถี่ถ้วน`;
        } else if (hasEarthsPunishment) {
          overview = `เดือนนี้ตกในพลังซาเฮ้งธาตุดิน (无恩之刑 丑-未-戌): ระวังความเข้าใจผิดกับคนใกล้ชิด ความน้อยใจ หรือปัญหาเกี่ยวกับอสังหาริมทรัพย์และภาระครอบครัว ควรใช้สติและความปล่อยวาง`;
        } else if (sixHeTaiSui || banSanHeTaiSui) {
          overview = `เดือนนี้กิ่งดินฮะสมพงศ์กับปีจรไท้ส่วย (${mB} ฮะ ${taiSuiBranch.zh}) ได้รับแรงสนับสนุนที่ดีจากเจ้านายและพันธมิตร บรรยากาศราบรื่น การประสานงานเป็นไปในทิศทางที่น่าพอใจ`;
        } else if (isFavOverall) {
          overview = `เดือนนี้พลังธาตุให้คุณ (${stemGod.zh} - ${stemGod.th}) หมุนเวียนเข้ามาเกื้อหนุนดวงชะตา มีความปลอดโปร่ง จังหวะชีวิตผ่อนคลายและมีโอกาสดีในการต่อยอดสิ่งใหม่ๆ`;
        } else {
          overview = `เดือนนี้พลังงานประจำเดือน (${stemGod.zh}) หมุนเวียนตามครรลองปกติ ดำเนินชีวิตตามแผนงานที่วางไว้ รักษาสมดุลทั้งการทำงานและการพักผ่อนอย่างมีคุณภาพ`;
        }

        // 7.2 การงาน & ธุรกิจ (Career)
        let career = '';
        if (clashMonth) {
          career = `มีพลังปะทะกับเสาเดือน (วังการงานโดยตรง): หน้าที่การงานมีเกณฑ์ปรับโครงสร้าง กะทันหัน โยกย้ายสถานที่ทำงาน หรือมีภาระเร่งด่วนเข้ามาแทรก ต้องมีแผนสำรองและยืดหยุ่นในการทำงานร่วมกับผู้อื่น`;
        } else if (clashTaiSui) {
          career = `ปะทะกับปีจรไท้ส่วย: งานมีความท้าทายสูง อาจถูกตรวจสอบอย่างเข้มงวดหรือมีข้อขัดแย้งกับผู้บริหาร หลีกเลี่ยงการเผชิญหน้าโดยตรงและเน้นการทำงานด้วยหลักฐานเอกสารที่รัดกุม`;
        } else if (tianDiHeTaiSui || sixHeTaiSui) {
          career = `ได้รับแรงเกื้อหนุนจากปีจร (${taiSuiBranch.zh}): มีโอกาสได้รับความไว้วางใจจากผู้ใหญ่ การเจรจาธุรกิจ ปิดดีล หรือการนำเสนองานใหญ่ผ่านฉลุย มีพันธมิตรยื่นมือเข้ามาช่วยเหลือ`;
        } else if (clashDaYun) {
          career = `มีพลังปะทะกับวัยจร 10 ปี: เป็นเดือนแห่งจุดเปลี่ยนทางอาชีพ อาจมีการตัดสินใจเปลี่ยนแผนก เปลี่ยนงาน หรือริเริ่มโครงการใหม่ที่เป็นก้าวสำคัญระยะยาว`;
        } else if (['七殺', '正官'].includes(stemGod.zh)) {
          career = `ดาวหน้าที่และบารมีส่งพลังเด่น (${stemGod.zh} - ${stemGod.th}): ได้รับมอบหมายภารกิจที่มีเกียรติแต่ความรับผิดชอบสูง การแสดงภาวะผู้นำที่สุขุมจะนำพาความสำเร็จและชื่อเสียงมาให้`;
        } else if (['食神', '傷官'].includes(stemGod.zh)) {
          career = `ดาวความคิดสร้างสรรค์และสติปัญญา (${stemGod.zh} - ${stemGod.th}): โดดเด่นเรื่องนวัตกรรม ไอเดียใหม่ๆ และการแก้ไขปัญหาเฉพาะหน้า ค้าขายและเจรจาประสบผลสำเร็จงดงาม`;
        } else if (['比肩', '劫財'].includes(stemGod.zh)) {
          career = `ดาวมิตรสหายและการแข่งขัน (${stemGod.zh}): มีการทำงานเป็นทีมหรือเครือข่าย ควรแบ่งผลประโยชน์และหน้าที่ให้โปร่งใส ระวังความเห็นต่างกับเพื่อนร่วมงาน`;
        } else {
          career = `การงานดำเนินไปอย่างมั่นคงสม่ำเสมอ เหมาะกับการสะสางงานคั่งค้าง ปรับปรุงระบบงาน และพัฒนาทักษะเฉพาะตัวเพื่อเตรียมรับโอกาสถัดไป`;
        }

        // 7.3 การเงิน & สภาพคล่อง (Wealth)
        let wealth = '';
        if (['正財', '偏財'].includes(stemGod.zh)) {
          wealth = `ดาวโชคลาภการเงินส่งผลเด่น (${stemGod.zh} - ${stemGod.th}): มีกระแสเงินสดเข้ามาคล่องตัว รายได้เสริมและลาภลอยมีเกณฑ์ปรากฏ เหมาะแก่การปิดการขายและเก็บเกี่ยวผลกำไรจากการลงทุน`;
        } else if (stemGod.zh === '劫財') {
          wealth = `ตกดาวปล้นทรัพย์ (劫財): ระวังกระเป๋ารั่ว มีรายจ่ายจรด้านภาษีสังคมหรือช่วยเหลือคนรอบข้าง หลีกเลี่ยงการให้ผู้อื่นหยิบยืมเงินหรือการเก็งกำไรที่มีความเสี่ยงสูงในเดือนนี้`;
        } else if (isHeavyEarth && ['辰', '戌', '丑', '未'].includes(dayBranch.zh)) {
          wealth = `พลังกระทบคลังทรัพย์ (辰/戌/丑/未): มีเกณฑ์หมุนเงินก้อนใหญ่หรือการจัดการสินทรัพย์ ที่ดิน อสังหาริมทรัพย์ หากวางแผนดีจะมีโอกาสเปิดคลังรับทรัพย์`;
        } else if (clashDay || clashTaiSui) {
          wealth = `ระวังค่าใช้จ่ายไม่คาดคิดเกี่ยวกับที่อยู่อาศัย ยานพาหนะ หรือคนในครอบครัว ควรสำรองสภาพคล่องและมีวินัยทางการเงินอย่างเคร่งครัด`;
        } else if (['食神', '傷官'].includes(stemGod.zh)) {
          wealth = `ดาวกำเนิดโชคลาภ (${stemGod.zh}): ไอเดียและความสามารถสร้างสรรค์แปรเปลี่ยนเป็นเงินทอง มีช่องทางรายได้ใหม่ๆ ต่อยอดอย่างงดงาม`;
        } else {
          wealth = `สภาพคล่องหมุนเวียนได้ตามแผน ควบคุมค่าใช้จ่ายส่วนตัวให้สมดุล และเน้นการออมสะสมอย่างต่อเนื่อง`;
        }

        // 7.4 ความรัก & ความสัมพันธ์ (Love)
        let love = '';
        if (fanYinDay || clashDay) {
          love = `มีพลังปะทะกับเสาวัน (วังคู่ครองโดยตรง ${dayBranch.zh} ปะทะ ${mB}): ความสัมพันธ์มีความเปราะบาง อาจเกิดความขัดแย้งจากเรื่องเล็กน้อย ควรใจเย็น รับฟังอย่างเข้าอกเข้าใจ และหลีกเลี่ยงการประชดประชัน คนโสดควรดูใจนานๆ`;
        } else if (tianDiHeDay || sixHeDay) {
          love = `กิ่งดินฮะสมพงศ์กับเสาวัน (วังคู่ครอง ${dayBranch.zh} ฮะ ${mB}): ความสัมพันธ์อบอุ่น หวานชื่น มีความเข้าใจกันลึกซึ้ง คนโสดมีเสน่ห์โดดเด่นและมีเกณฑ์พบคนที่ถูกใจอย่างยิ่ง`;
        } else if (['正官', '七殺'].includes(stemGod.zh) && chart.gender === 'female') {
          love = `ดาวคู่ครองปรากฏในเดือนนี้ (${stemGod.zh}): คนมีคู่คนรักให้เกียรติและคอยเป็นที่ปรึกษา คนโสดมีโอกาสพบคนที่มีวุฒิภาวะสูงหรือได้รับการแนะนำจากผู้ใหญ่`;
        } else if (['正財', '偏財'].includes(stemGod.zh) && chart.gender === 'male') {
          love = `ดาวคนรักส่งพลังเด่น (${stemGod.zh}): ความสัมพันธ์ราบรื่น มีเสน่ห์ต่อเพศตรงข้าม คนมีคู่ควรหาเวลาเติมความหวานและสร้างบรรยากาศพิเศษร่วมกัน`;
        } else if (harmDay || destructionDay) {
          love = `ระวังความรู้สึกอึดอัดใจหรือความหวาดระแวง ควรเปิดใจพูดคุยกันอย่างตรงไปตรงมาด้วยความเมตตา`;
        } else {
          love = `ความสัมพันธ์ราบรื่นสงบสุข ชวนกันไปทานอาหารอร่อยหรือเปลี่ยนบรรยากาศเพื่อเติมความสดชื่นให้ชีวิตคู่ คนโสดมีความสุขกับพื้นที่ส่วนตัว`;
        }

        // 7.5 สุขภาพ & ข้อควรระวัง (Health)
        let health = '';
        if (isWaterFireConflict) {
          health = `สงครามธาตุน้ำ-ไฟปะทะกันรุนแรง (子-午 冲): ระวังสุขภาพระบบหัวใจ ความดันโลหิต สายตา อาการไมเกรน และการนอนหลับไม่สนิท ควรดื่มน้ำสะอาดให้เพียงพอและงดกิจกรรมหักโหม`;
        } else if (isMetalWoodConflict) {
          health = `สงครามธาตุทอง-ไม้ปะทะ (寅-申 / 卯-酉): ระวังอาการปวดเมื่อยกระดูก ข้อต่อ เส้นเอ็น กล้ามเนื้อ และระมัดระวังเป็นพิเศษขณะขับขี่ยานพาหนะหรือเล่นกีฬา`;
        } else if (hasEarthsPunishment || isHeavyEarth) {
          health = `ธาตุดินหนาแน่น/ปะทะคลังดิน (丑-未-戌): ระวังระบบทางเดินอาหาร กระเพาะ ม้าม กรดไหลย้อน และอาการท้องอืด ควรรับประทานอาหารตรงเวลาและเคี้ยวให้ละเอียด`;
        } else if (hasBullyingPunishment) {
          health = `อิทธิพลซาเฮ้ง (寅-巳-申): ระวังความเครียดสะสม อาการอักเสบในร่างกาย และอุบัติเหตุจากการเดินทาง ควรบริจาคโลหิตหรือทำบุญเพื่อเสริมมงคล`;
        } else if (clashDay || clashTaiSui) {
          health = `ระวังความเหนื่อยล้าสะสมจากการเดินทางและความเร่งรีบ จัดสรรเวลาพักผ่อนให้เพียงพอและหมั่นฝึกการหายใจลึกๆ`;
        } else {
          health = `สุขภาพร่างกายโดยรวมแข็งแรงสมบูรณ์ดี รักษาสุขอนามัย พักผ่อนให้ตรงเวลา และออกกำลังกายเบาๆ สม่ำเสมอ`;
        }

        const adviceText = `ภาพรวมเดือนนี้: ${ratingBadge} • ${overview}`;

        return {
          index: idx,
          monthNum: m.num,
          labelDate: m.labelDate,
          displayLabel: `${m.labelDate} (${m.num})`,
          title: m.solarTh,
          solarTh: m.solarTh,
          dates: m.dates,
          stem,
          branch,
          stemGod,
          branchGod,
          naYin,
          ratingBadge,
          ratingBadgeShort,
          ratingType,
          isCurrent,
          adviceText,
          overview,
          career,
          wealth,
          love,
          health,
          // Contextual Metaphysical Flags
          context: {
            taiSui: { stem: taiSuiStem.zh, branch: taiSuiBranch.zh },
            daYun: curDaYun ? { stem: daYunStem.zh, branch: daYunBranch.zh, range: curDaYun.ageRange } : null,
            interactions: {
              tianDiHeTaiSui,
              wuHeTaiSui,
              clashTaiSui,
              sixHeTaiSui,
              fanYinTaiSui,
              clashDaYun,
              sixHeDaYun,
              fanYinDaYun,
              clashDay,
              sixHeDay,
              hasBullyingPunishment,
              hasEarthsPunishment,
              fullSanHe: !!fullSanHe,
              fullSanHui: !!fullSanHui
            }
          }
        };
      });
    },

    computeOracleVerdict: function (c, rawQ, fallbackYear) {
      if (!c) return null;
      const q = (rawQ || '').trim().toLowerCase();

      // 1. Target Year
      let simY = fallbackYear || new Date().getFullYear() || 2026;
      const beMatch = q.match(/(?:ปี\s*|พ\.ศ\.\s*)?(25\d{2})/);
      const ceMatch = q.match(/(?:ปี\s*)?(20\d{2})/);
      if (ceMatch) {
        simY = parseInt(ceMatch[1], 10);
      } else if (beMatch) {
        simY = parseInt(beMatch[1], 10) - 543;
      } else if (q.includes('ปีหน้า')) {
        simY = (new Date().getFullYear() || 2026) + 1;
      } else if (q.includes('ปีที่แล้ว')) {
        simY = (new Date().getFullYear() || 2026) - 1;
      }

      // Tai Sui (Annual Pillar)
      const sIdx = ((simY - 4) % 10 + 10) % 10;
      const bIdx = ((simY - 4) % 12 + 12) % 12;
      const simStem = STEMS[sIdx];
      const simBranch = BRANCHES[bIdx];
      const simStemGod = getTenGod(c.dayMaster, simStem);
      const simBranchMainStem = STEMS.find(s => s.zh === simBranch.hidden[0].stem) || simStem;
      const simBranchGod = getTenGod(c.dayMaster, simBranchMainStem);
      const simNaYin = getNaYin(sIdx, bIdx);

      // Active Da Yun for simY
      const birthYear = c.birthDateString ? parseInt(c.birthDateString.split('-')[0], 10) : new Date().getFullYear();
      const ageInYear = simY - birthYear;
      let curDaYun = (c.daYunPillars || []).find(d => ageInYear >= d.ageFrom && ageInYear <= d.ageTo);
      if (!curDaYun && c.daYunPillars && c.daYunPillars.length > 0) {
        if (ageInYear < c.daYunPillars[0].ageFrom) {
          curDaYun = {
            ageRange: `0 - ${c.daYunPillars[0].ageFrom - 1} ปี`,
            stem: c.pillars.month.stem,
            branch: c.pillars.month.branch,
            tenGod: c.pillars.month.tenGod,
            naYin: c.pillars.month.naYin
          };
        } else {
          curDaYun = c.daYunPillars[c.daYunPillars.length - 1];
        }
      }

      // Clashes & Harmonies
      const clashMonth = checkBranchClash(simBranch.zh, c.pillars.month.branch.zh);
      const clashDay = checkBranchClash(simBranch.zh, c.pillars.day.branch.zh);
      const clashYear = checkBranchClash(simBranch.zh, c.pillars.year.branch.zh);
      const clashHour = checkBranchClash(simBranch.zh, c.pillars.hour.branch.zh);

      const harmMonth = checkBranchHarmony(simBranch.zh, c.pillars.month.branch.zh);
      const harmDay = checkBranchHarmony(simBranch.zh, c.pillars.day.branch.zh);
      const harmYear = checkBranchHarmony(simBranch.zh, c.pillars.year.branch.zh);
      const harmHour = checkBranchHarmony(simBranch.zh, c.pillars.hour.branch.zh);

      const dyClash = curDaYun ? checkBranchClash(simBranch.zh, curDaYun.branch.zh) : null;
      const dyHarm = curDaYun ? checkBranchHarmony(simBranch.zh, curDaYun.branch.zh) : null;

      // Stars
      const monthHasYiMa = (c.pillars.month.stars || []).some(s => s.name.includes('驛馬'));
      const dayHasYiMa = (c.pillars.day.stars || []).some(s => s.name.includes('驛馬'));
      const yiMaMap = {
        '申': '寅', '子': '寅', '辰': '寅',
        '寅': '申', '午': '申', '戌': '申',
        '巳': '亥', '酉': '亥', '丑': '亥',
        '亥': '巳', '卯': '巳', '未': '巳'
      };
      const isYearYiMa = (yiMaMap[c.pillars.year.branch.zh] === simBranch.zh || yiMaMap[c.pillars.day.branch.zh] === simBranch.zh);

      // Monthly fortune timeline
      const allMonths = BaziEngine.calculateMonthlyFortune(c, simY);
      let selectedMonths = [];
      let timelineLabel = '';
      if (q.includes('สิ้นปี') || q.includes('ปลายปี')) {
        selectedMonths = allMonths.slice(8, 12);
        timelineLabel = `ไทม์ไลน์สารท 4 เดือนปลายปี ${simY} (เจาะลึกจุดเปลี่ยนสำคัญ)`;
      } else if (q.includes('ต้นปี')) {
        selectedMonths = allMonths.slice(0, 4);
        timelineLabel = `ไทม์ไลน์สารท 4 เดือนต้นปี ${simY} (จังหวะการเริ่มต้น)`;
      } else if (q.includes('กลางปี')) {
        selectedMonths = allMonths.slice(4, 8);
        timelineLabel = `ไทม์ไลน์สารท 4 เดือนกลางปี ${simY} (จังหวะขับเคลื่อน)`;
      } else {
        selectedMonths = [allMonths[0], allMonths[3], allMonths[7], allMonths[10]].filter(Boolean);
        if (selectedMonths.length < 4) selectedMonths = allMonths.slice(0, 4);
        timelineLabel = `ไทม์ไลน์สารท 4 ไตรมาสหลักของปี ${simY}`;
      }

      // Question Categories
      const isJobChangeQuery = /เปลี่ยนงาน|ย้ายงาน|ลาออก|โยกย้าย|ย้ายหน้าที่|ย้ายสายงาน|ตกงาน|เลื่อนขั้น|ตำแหน่ง/.test(q) || (/งาน/.test(q) && /สิ้นปี|ปลายปี|เปลี่ยน|ย้าย/.test(q));
      const isWealthQuery = /เงิน|รวย|ทรัพย์|โชค|ลาภ|หนี้|ลงทุน|หุ้น|คริปโต|ทอง|ค้าขาย|กำไร|เงินก้อน|กู้/.test(q);
      const isLoveQuery = /รัก|แฟน|คู่|แต่งงาน|หมั้น|เลิก|หย่า|โสด|คนคุย|คู่ครอง|เนื้อคู่|ความรัก/.test(q);
      const isHealthQuery = /สุขภาพ|ป่วย|โรค|ผ่าตัด|เลือด|สายตา|กระเพาะ|ไต|หัวใจ|ปอด|ตับ|เครียด|นอน/.test(q);

      let topicTitle = '';
      let verdictMain = '';
      let verdictSub = '';
      let verdictIcon = '🔮';
      let prob = 70;
      let probBadgeText = '';
      let probBadgeBg = 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)';
      let analysisPoints = [];
      let advice = '';

      if (isJobChangeQuery) {
        verdictIcon = '🐎';
        prob = 48;
        if (clashMonth) prob += 24;
        if (monthHasYiMa || isYearYiMa) prob += 16;
        if (simStemGod.zh === '傷官' || simStemGod.zh === '七殺') prob += 14;
        if (harmMonth) prob += 10;
        if (dyClash) prob += 10;
        if (checkBranchClash(c.pillars.year.branch.zh, c.pillars.month.branch.zh)) prob += 8;
        prob = Math.min(94, Math.max(32, prob));

        const peakMonth = selectedMonths.find(m => m.ratingType === 'clash') || selectedMonths[2] || selectedMonths[0];
        topicTitle = `คำนวณปาจื่อเจาะลึก: เกณฑ์การเปลี่ยนงาน & โยกย้ายหน้าที่ช่วง${q.includes('สิ้นปี') ? 'สิ้นปี ' : ''}${simY}`;
        verdictMain = `คำวินิจฉัยปาจื่อ: มีเกณฑ์เปลี่ยนงานหรือโยกย้ายหน้าที่รับผิดชอบ ${prob >= 75 ? 'สูงมาก (ฟันธงตามผังดวง)' : 'ปานกลาง (มีโอกาสปรับบทบาท)'}`;
        verdictSub = `ช่วงเวลาที่มีแรงส่งและโอกาสสูงสุด: ${peakMonth ? ((peakMonth.title || peakMonth.solarTh || peakMonth.labelDate || '').split('(')[0].trim() || 'ช่วงปลายปี') : 'ช่วงปลายปี'} ${simY} (${peakMonth ? peakMonth.stem.zh + peakMonth.branch.zh : ''})`;
        probBadgeText = `โอกาสเปลี่ยนงาน ${prob}%`;
        probBadgeBg = prob >= 75 ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' : '#2563eb';

        const natalClashText = checkBranchClash(c.pillars.year.branch.zh, c.pillars.month.branch.zh)
          ? `จุดปะทะในดวงเดิม (${c.pillars.year.branch.zh} 沖 ${c.pillars.month.branch.zh}): เสาปีปะทะเสาเดือน บ่งชี้ว่าสภาพแวดล้อมการทำงานมักมีการปรับเปลี่ยนเพื่อเติบโตสู่ระดับที่สูงขึ้นเสมอ`
          : `โครงสร้างเสาเดิม: เสาเดือนเป็น ${c.pillars.month.stem.zh}${c.pillars.month.branch.zh} มีความมั่นคงในบทบาทเดิม แต่พร้อมขยับขยายเมื่อมีพลังกระตุ้นจากปีจร`;

        analysisPoints.push({
          title: '🏛️ โครงสร้างเสาการงานในดวงเดิม (Month Pillar & Ten Gods):',
          body: `เสาเดือนคุมการงาน อาชีพ และบทบาทสังคม เป็น ${c.pillars.month.stem.zh}${c.pillars.month.branch.zh} (สิบเทพอ่านได้: ${c.pillars.month.tenGod.zh} - ${c.pillars.month.tenGod.th}) • ${natalClashText}`,
          borderClass: ''
        });

        analysisPoints.push({
          title: `⚡ ปฏิสัมพันธ์พลังปีจร ${simY} (${simStem.zh}${simBranch.zh}) & วัยจร:`,
          body: `ปี ${simY} ส่งพลังก้านฟ้า ${simStem.zh} (${simStemGod.th}) และกิ่งดิน ${simBranch.zh} (${simBranch.zodiac.split(' ')[0]}) • ${clashMonth ? 'เกิดการปะทะเสาเดือน (沖月柱) มีแรงผลักดันให้เปลี่ยนแปลงสภาพแวดล้อมการทำงานอย่างชัดเจน' : harmMonth ? 'เกิดการสมพงศ์เสาเดือน (合月柱) มีโอกาสได้รับมอบหมายโปรเจกต์ใหม่หรือปรับตำแหน่งภายใน' : 'กระแสงานราบรื่น แต่มีพลังกระตุ้นจากความต้องการเติบโต'} ${curDaYun ? `• คุมโดยวัยจรช่วงอายุ ${curDaYun.ageRange} (${curDaYun.stem.zh}${curDaYun.branch.zh})` : ''}`,
          borderClass: 'border-accent'
        });

        analysisPoints.push({
          title: `📅 ${timelineLabel}:`,
          body: selectedMonths.map(m => `สารท ${m.labelDate.split(' ')[1]} (${m.stem.zh}${m.branch.zh}): ${m.ratingType === 'clash' ? '★ จังหวะพีค มีพลังกระตุ้นการตัดสินใจเด็ดขาด' : m.ratingType === 'auspicious' ? 'พลังธาตุเกื้อหนุน เจรจาหรือสัมภาษณ์ราบรื่น' : 'เจรจาขอบเขตงาน เตรียมพร้อมล่วงหน้า'}`).join(' | '),
          borderClass: 'border-gold'
        });

        advice = `ใช้พลังธาตุปรับดวง ${ELEMENTS_META[c.tiaoHou.element].th} และธาตุส่งเสริม ${c.favorableElements.map(k => ELEMENTS_META[k].th).join(', ')} ในการตัดสินใจ อย่าเพิ่งลาออกด้วยอารมณ์ก่อนมีหนังสือสัญญาตอบรับที่แน่นอน`;
        analysisPoints.push({
          title: '💡 กลยุทธ์เสริมมงคล & แนวทางปฏิบัติ:',
          body: advice,
          borderClass: 'border-green'
        });

      } else if (isWealthQuery) {
        verdictIcon = '💰';
        const dmElem = c.dayMaster.element;
        const wealthElem = ELEMENTS_META[dmElem].controls;
        const wealthMeta = ELEMENTS_META[wealthElem];
        const wealthPct = c.elementPercentages[wealthElem] || 0;
        const outputElem = ELEMENTS_META[dmElem].generates;
        const outputMeta = ELEMENTS_META[outputElem];

        let wealthScore = 3.8;
        if (c.favorableElements.includes(simStem.element) || c.favorableElements.includes(simBranch.element)) wealthScore += 0.6;
        if (simStemGod.zh === '正財' || simStemGod.zh === '偏財' || simStemGod.zh === '食神') wealthScore += 0.5;
        if (clashDay || clashMonth) wealthScore -= 0.4;
        wealthScore = Math.min(4.9, Math.max(2.5, wealthScore));
        prob = Math.round((wealthScore / 5) * 100);

        topicTitle = `คำนวณปาจื่อเจาะลึก: ฐานการเงิน โชคลาภ & การบริหารทรัพย์ปี ${simY}`;
        verdictMain = `คำวินิจฉัยปาจื่อ: ฐานะการเงินหมุนเวียน ${wealthScore >= 4.0 ? 'คล่องตัวสูง มีเกณฑ์ได้เงินก้อนจากผลงาน' : 'ต้องวางแผนรอบคอบ ป้องกันรายจ่ายจร'}`;
        verdictSub = `ธาตุโชคลาภคือ ${wealthMeta.th} (${wealthPct}%) | ธาตุผลิตโอกาสคือ ${outputMeta.th} (${c.elementPercentages[outputElem] || 0}%)`;
        probBadgeText = `ดัชนีโชคลาภ ${wealthScore.toFixed(1)}/5 (${prob}%)`;
        probBadgeBg = '#10b981';

        analysisPoints.push({
          title: '💎 ศักยภาพการสร้างความมั่งคั่งในดวงเดิม:',
          body: `ดวงนี้มีพลังธาตุโชคลาภ (${wealthMeta.th}) ${wealthPct}% และธาตุสร้างรายได้ (${outputMeta.th}) ${c.elementPercentages[outputElem] || 0}% แสดงถึงความสามารถในการเล็งเห็นช่องทางรายได้และเปลี่ยนทักษะเป็นมูลค่าได้อย่างดี`,
          borderClass: ''
        });

        analysisPoints.push({
          title: `🔥 ผลกระทบจากปีจร ${simY} (${simStem.zh}${simBranch.zh}) & วัยจร:`,
          body: `ในปี ${simY} พลังก้านฟ้าเป็น ${simStem.zh} (${simStemGod.th}) ${c.favorableElements.includes(simStem.element) ? 'เป็นธาตุส่งเสริม ช่วยเพิ่มความมั่นใจในการต่อยอดการเงิน' : 'ควรระวังเรื่องรายจ่ายจรและการลงทุนเสี่ยงสูง'} ${clashDay ? '(ปะทะเสาวัน ควรระมัดระวังเรื่องสัญญากับคนใกล้ชิด)' : 'กระแสการเงินหมุนเวียนต่อเนื่อง'} • วัยจรช่วงอายุ ${curDaYun ? curDaYun.ageRange : '-'}`,
          borderClass: 'border-accent'
        });

        analysisPoints.push({
          title: `📈 ${timelineLabel}:`,
          body: selectedMonths.map(m => `สารท ${m.labelDate.split(' ')[1]} (${m.stem.zh}${m.branch.zh}): ${m.ratingType === 'auspicious' ? 'ช่วงทองการเงิน สภาพคล่องสูง' : m.ratingType === 'clash' ? 'มีเกณฑ์จ่ายเงินก้อน ควรวางแผนงบประมาณ' : 'รายได้สม่ำเสมอ'}`).join(' | '),
          borderClass: 'border-gold'
        });

        advice = `เน้นการใช้ธาตุปรับดวง ${ELEMENTS_META[c.tiaoHou.element].th} ในการคุมสมดุลอารมณ์ ควบคุมรายจ่าย และแปลงเงินสดบางส่วนเป็นสินทรัพย์มั่นคงเพื่อป้องกันเงินรั่วไหล`;
        analysisPoints.push({
          title: '💡 กลยุทธ์การบริหารทรัพย์ & เสริมดวง:',
          body: advice,
          borderClass: 'border-green'
        });

      } else if (isLoveQuery) {
        verdictIcon = '❤️';
        let loveText = harmDay ? 'มีเกณฑ์พบรัก สมหวัง หรือความสัมพันธ์พัฒนาสู่ความมั่นคงสูง' : clashDay ? 'ต้องระวังความใจร้อน ความขัดแย้ง และอารมณ์เปราะบาง' : 'ความสัมพันธ์ดำเนินไปอย่างราบรื่น อบอุ่น มีความเข้าใจที่ดี';
        prob = harmDay ? 86 : clashDay ? 52 : 75;

        topicTitle = `คำนวณปาจื่อเจาะลึก: ความรัก คู่ครอง & ชีวิตคู่ปี ${simY}`;
        verdictMain = `คำวินิจฉัยปาจื่อ: ${loveText}`;
        verdictSub = `เสาคู่ครอง (Day Branch) คือ ${c.pillars.day.branch.zh} (${c.pillars.day.branch.zodiac.split(' ')[0]}) ${harmDay ? '• ได้รับการสมพงศ์จากปีจร' : clashDay ? '• มีจุดปะทะจากปีจร' : '• ธาตุเกื้อกูลกลมกลืน'}`;
        probBadgeText = `ดัชนีเสน่ห์รัก ${prob}%`;
        probBadgeBg = '#ec4899';

        analysisPoints.push({
          title: '🌹 ฐานคู่ครองในดวงเดิม (Day Branch & Spouse Palace):',
          body: `เสาวันคุมเรือนคู่ครองและชีวิตคู่ เป็น ${c.pillars.day.stem.zh}${c.pillars.day.branch.zh} (คู่แท้มีลักษณะ: ${c.dayMasterProfile.title}) บ่งบอกถึงความต้องการคู่ชีวิตที่เข้าใจและสนับสนุนเป้าหมายของกันและกัน`,
          borderClass: ''
        });

        analysisPoints.push({
          title: `💫 พลังความรักปีจร ${simY} (${simStem.zh}${simBranch.zh}):`,
          body: `ในปี ${simY} กิ่งดิน ${simBranch.zh} ${harmDay ? 'สมพงศ์กับเรือนคู่ครองโดยตรง ส่งผลให้คนโสดมีโอกาสเจอคนที่ถูกใจ ส่วนคนมีคู่ความสัมพันธ์จะแน่นแฟ้นยิ่งขึ้น' : clashDay ? 'มีจุดปะทะกับเรือนคู่ครอง ควรใช้สติ ลดทิฐิ และหลีกเลี่ยงการใช้อารมณ์ตัดสินปัญหา' : 'ดำเนินไปอย่างราบรื่น มีความเข้าใจเกื้อกูล'} • วัยจรช่วงอายุ ${curDaYun ? curDaYun.ageRange : '-'}`,
          borderClass: 'border-accent'
        });

        analysisPoints.push({
          title: `📅 ${timelineLabel}:`,
          body: selectedMonths.map(m => `สารท ${m.labelDate.split(' ')[1]}: ${m.ratingType === 'auspicious' ? 'จังหวะหัวใจเบ่งบาน เสน่ห์โดดเด่น' : m.ratingType === 'clash' ? 'มีเกณฑ์เข้าใจผิด ควรใจเย็น' : 'อบอุ่นราบรื่น'}`).join(' | '),
          borderClass: 'border-gold'
        });

        advice = `ใช้ธาตุปรับดวง ${ELEMENTS_META[c.tiaoHou.element].th} ในการปรับสมดุลอารมณ์ รับฟังคนรักให้มากขึ้น และพากันไปทำบุญหรือเปลี่ยนบรรยากาศสถานที่ใหม่ๆ`;
        analysisPoints.push({
          title: '💡 กลยุทธ์กระชับความสัมพันธ์ & เสริมเสน่ห์:',
          body: advice,
          borderClass: 'border-green'
        });

      } else if (isHealthQuery) {
        verdictIcon = '🌿';
        const elemPcts = c.elementPercentages;
        const weakestElem = Object.keys(elemPcts).reduce((a, b) => elemPcts[a] < elemPcts[b] ? a : b);
        const strongestElem = Object.keys(elemPcts).reduce((a, b) => elemPcts[a] > elemPcts[b] ? a : b);
        prob = clashDay ? 58 : 78;

        topicTitle = `คำนวณปาจื่อเจาะลึก: สมดุลเบญจธาตุ & สุขภาพตามแพทย์จีนปี ${simY}`;
        verdictMain = `คำวินิจฉัยปาจื่อ: เฝ้าระวังอวัยวะธาตุ${ELEMENTS_META[weakestElem].th} (${ELEMENTS_META[weakestElem].organ}) และการพักผ่อน`;
        verdictSub = `ธาตุที่น้อยที่สุดคือ ${ELEMENTS_META[weakestElem].th} (${elemPcts[weakestElem]}%) | ธาตุสูงสุดคือ ${ELEMENTS_META[strongestElem].th} (${elemPcts[strongestElem]}%)`;
        probBadgeText = `เกณฑ์สุขภาพ: ${clashDay ? 'เฝ้าระวังสมดุล' : 'สมบูรณ์ดี'}`;
        probBadgeBg = '#0284c7';

        analysisPoints.push({
          title: '🫀 อวัยวะที่ต้องดูแลตามหลักเบญจธาตุแพทย์จีน:',
          body: `ระบบ${ELEMENTS_META[weakestElem].organ} (ธาตุ${ELEMENTS_META[weakestElem].th}): สัดส่วน ${elemPcts[weakestElem]}% ควรบำรุงและลดพฤติกรรมเสี่ยง • ระบบ${ELEMENTS_META[strongestElem].organ} (ธาตุ${ELEMENTS_META[strongestElem].th}): สัดส่วน ${elemPcts[strongestElem]}% มีพลังงานหนาแน่น ควรระบายพลังงานด้วยการออกกำลังกาย`,
          borderClass: ''
        });

        analysisPoints.push({
          title: `🌿 อิทธิพลปีจร ${simY} (${simStem.zh}${simBranch.zh}) & วัยจร:`,
          body: `ในปี ${simY} ธาตุประจำปีคือ ${simStem.element} และ ${simBranch.element} ${clashDay ? 'มีจุดปะทะเสาวัน (สุขภาพกายใจ) ควรเน้นการนอนหลับให้พอเพียงและงดทำงานหามรุ่งหามค่ำ' : 'ช่วยปรับกระแสชี่ให้ไหลเวียนราบรื่น'} • วัยจรช่วงอายุ ${curDaYun ? curDaYun.ageRange : '-'}`,
          borderClass: 'border-accent'
        });

        analysisPoints.push({
          title: `📅 ${timelineLabel}:`,
          body: selectedMonths.map(m => `สารท ${m.labelDate.split(' ')[1]}: ${m.ratingType === 'clash' ? 'ควรพักผ่อน งดกิจกรรมเสี่ยง' : 'ร่างกายสดชื่น สมดุลดี'}`).join(' | '),
          borderClass: 'border-gold'
        });

        advice = `บำรุงอาหารตามธาตุ ${ELEMENTS_META[weakestElem].th} ดื่มน้ำสะอาดสม่ำเสมอ และออกกำลังกายยืดเหยียดเพื่อคลายความตึงตัวของกล้ามเนื้อ`;
        analysisPoints.push({
          title: '💡 กลยุทธ์การดูแลสุขภาพ & สมดุลชีวิต:',
          body: advice,
          borderClass: 'border-green'
        });

      } else {
        // General query
        verdictIcon = '🔮';
        prob = 78;
        topicTitle = rawQ ? `ผลการคำนวณวิเคราะห์เจาะลึก: "${rawQ}" (ปี ${simY})` : `ผลการคำนวณจำลองปีจร ${simY} (${simStem.zh}${simBranch.zh})`;
        verdictMain = `ผลการคำนวณจำลองปีจร ${simY} (${simStem.zh}${simBranch.zh} • ${simBranch.zodiac.split(' ')[0]})`;
        verdictSub = `ก้านฟ้า: ${simStem.zh} (${simStemGod.th}) | กิ่งดิน: ${simBranch.zh} (${simBranch.element}) | นั่บอิม: ${simNaYin.split(' ')[0]}`;
        probBadgeText = `ดัชนีภาพรวม 4.3/5`;
        probBadgeBg = 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)';

        analysisPoints.push({
          title: `🌌 การปฏิสัมพันธ์ฟ้าดินในรอบปี ${simY}:`,
          body: `ในปี ${simY} พลังก้านฟ้าเป็น ${simStem.zh} (${simStemGod.th}) ส่งผลต่อมุมมองและการตัดสินใจ กิ่งดิน ${simBranch.zh} ปฏิสัมพันธ์กับดวงชะตาเดิม ${clashMonth ? '(ปะทะเสาการงาน มีการปรับเปลี่ยน)' : clashDay ? '(ปะทะเสาวัน เฝ้าระวังอารมณ์)' : '(มีพลังส่งเสริมเกื้อหนุนอย่างราบรื่น)'}`,
          borderClass: ''
        });

        analysisPoints.push({
          title: `⏳ อิทธิพลวัยจร 10 ปี (大運):`,
          body: `ช่วงอายุ ${curDaYun ? curDaYun.ageRange : '-'} คุมโดยก้านฟ้า-กิ่งดิน ${curDaYun ? curDaYun.stem.zh + curDaYun.branch.zh : '-'} (${curDaYun && curDaYun.tenGod ? curDaYun.tenGod.th : '-'}) เป็นช่วงเวลาแห่งการพัฒนาศักยภาพและการสะสมผลงานสำคัญ`,
          borderClass: 'border-accent'
        });

        analysisPoints.push({
          title: `📅 ${timelineLabel}:`,
          body: selectedMonths.map(m => `สารท ${m.labelDate.split(' ')[1]} (${m.stem.zh}${m.branch.zh}): ${m.ratingType === 'auspicious' ? 'จังหวะมงคลยิ่ง' : m.ratingType === 'clash' ? 'มีจุดปะทะ ควรตัดสินใจรอบคอบ' : 'กระแสไหลเวียนราบรื่น'}`).join(' | '),
          borderClass: 'border-gold'
        });

        advice = `ใช้ธาตุปรับดวง ${ELEMENTS_META[c.tiaoHou.element].th} ควบคู่กับธาตุส่งเสริม ${c.favorableElements.map(k => ELEMENTS_META[k].th).join(', ')} เพื่อสร้างสมดุลและดึงศักยภาพสูงสุดออกมาใช้`;
        analysisPoints.push({
          title: '💡 กลยุทธ์การปรับใช้ & เสริมดวง:',
          body: advice,
          borderClass: 'border-green'
        });
      }

      return {
        simY,
        simStem,
        simBranch,
        simStemGod,
        simBranchGod,
        simNaYin,
        curDaYun,
        clashMonth, clashDay, clashYear, clashHour,
        harmMonth, harmDay, harmYear, harmHour,
        prob,
        probBadgeText,
        probBadgeBg,
        verdictIcon,
        verdictMain,
        verdictSub,
        topicTitle,
        analysisPoints,
        selectedMonths,
        timelineLabel,
        advice
      };
    },

    // 12. Deep Astrological Consultation Engine (ถามตอบเจาะลึกผังดวงเฉพาะบุคคล)
    consultAstrologer: function (chart, rawQuery, defaultYear) {
      if (!chart) {
        return {
          title: 'ยังไม่มีข้อมูลผังดวง',
          headline: 'กรุณาตั้งผังดวงชะตาก่อนถามคำถามค่ะ',
          probText: 'ยังไม่มีข้อมูล',
          probBg: '#64748b',
          points: [
            {
              title: 'คำแนะนำ:',
              body: 'ท่านสามารถกดแท็บ 1. Basic หรือ 2. Advance ด้านบน เพื่อกรอกวันเดือนปีเกิดและเวลาเกิดก่อน จากนั้นระบบจะดึงข้อมูลผังดวง 4 เสามาวิเคราะห์ถามตอบได้ทันทีค่ะ'
            }
          ],
          advice: 'ตั้งผังดวงชะตาเพื่อเริ่มต้นการวิเคราะห์เชิงลึก'
        };
      }

      const q = (rawQuery || '').trim();
      const lowerQ = q.toLowerCase();
      const name = chart.name || 'เจ้าชะตา';

      // Resolve Target Year
      let simY = defaultYear || new Date().getFullYear() || 2026;
      const beMatch = lowerQ.match(/(?:ปี\s*|พ\.ศ\.\s*)?(25\d{2})/);
      const ceMatch = lowerQ.match(/(?:ปี\s*)?(20\d{2})/);
      if (ceMatch) simY = parseInt(ceMatch[1], 10);
      else if (beMatch) simY = parseInt(beMatch[1], 10) - 543;
      else if (lowerQ.includes('ปีหน้า')) simY = (new Date().getFullYear() || 2026) + 1;
      else if (lowerQ.includes('ปีที่แล้ว')) simY = (new Date().getFullYear() || 2026) - 1;

      // Active Da Yun for simY
      const birthYear = chart.birthDateString ? parseInt(chart.birthDateString.split('-')[0], 10) : new Date().getFullYear();
      const ageInYear = simY - birthYear;
      let curDaYun = (chart.daYunPillars || []).find(d => ageInYear >= d.ageFrom && ageInYear <= d.ageTo);
      if (!curDaYun && chart.daYunPillars && chart.daYunPillars.length > 0) {
        if (ageInYear < chart.daYunPillars[0].ageFrom) {
          curDaYun = {
            ageRange: `0 - ${chart.daYunPillars[0].ageFrom - 1} ปี (วัยเยาว์)`,
            stem: chart.pillars.month.stem,
            branch: chart.pillars.month.branch,
            tenGod: chart.pillars.month.tenGod,
            isChildhood: true
          };
        } else {
          curDaYun = chart.daYunPillars[chart.daYunPillars.length - 1];
        }
      }

      // Tai Sui (Annual Pillar)
      const yrStemIdx = ((simY - 4) % 10 + 10) % 10;
      const yrBranchIdx = ((simY - 4) % 12 + 12) % 12;
      const simStem = STEMS[yrStemIdx];
      const simBranch = BRANCHES[yrBranchIdx];
      const simStemGod = getTenGod(chart.dayMaster, simStem);

      // Monthly Fortunes for simY
      const allMonths = BaziEngine.calculateMonthlyFortune(chart, simY);

      // Metaphysical foundations
      const dm = chart.dayMaster;
      const favElements = chart.favorableElements || [];
      const favNames = favElements.map(k => ELEMENTS_META[k].th).join(', ');
      const tiaoHou = chart.tiaoHou ? ELEMENTS_META[chart.tiaoHou.element].th : '';
      const p = chart.pillars;

      // Clashes & Harmonies with Natal Pillars
      const clashMonth = checkBranchClash(simBranch.zh, p.month.branch.zh);
      const clashDay = checkBranchClash(simBranch.zh, p.day.branch.zh);
      const clashYear = checkBranchClash(simBranch.zh, p.year.branch.zh);
      const clashHour = checkBranchClash(simBranch.zh, p.hour.branch.zh);

      const harmMonth = checkBranchHarmony(simBranch.zh, p.month.branch.zh);
      const harmDay = checkBranchHarmony(simBranch.zh, p.day.branch.zh);
      const harmYear = checkBranchHarmony(simBranch.zh, p.year.branch.zh);
      const harmHour = checkBranchHarmony(simBranch.zh, p.hour.branch.zh);

      // Classify Intent
      const isJobQuery = /เปลี่ยนงาน|ย้ายงาน|ลาออก|โยกย้าย|สมัครงาน|สัมภาษณ์|เลื่อนขั้น|ก้าวหน้า|งานประจำ|ตกงาน|ตำแหน่ง/.test(lowerQ) || (/งาน/.test(lowerQ) && /เปลี่ยน|ย้าย|ลาออก|เริ่ม/.test(lowerQ));
      const isCareerChoice = /อาชีพ|ธุรกิจ|ค้าขาย|เปิดร้าน|หุ้นส่วน|สายงาน|ถูกโฉลก|ทำอะไรดี|งานอะไร|ธุรกิจอะไร/.test(lowerQ);
      const isWealthQuery = /เงิน|รวย|ทรัพย์|โชค|ลาภ|หนี้|ลงทุน|หุ้น|อสังหา|ค้าขาย|กำไร|เงินก้อน|เงินรั่ว|เสี่ยงโชค|หวย|คลังทรัพย์|สภาพคล่อง/.test(lowerQ);
      const isLoveQuery = /รัก|แฟน|คู่|แต่งงาน|หมั้น|เลิก|หย่า|โสด|คนคุย|คู่ครอง|เนื้อคู่|วังคู่ครอง|ความสัมพันธ์|ทะเลาะ|คนรัก/.test(lowerQ);
      const isHealthQuery = /สุขภาพ|ป่วย|โรค|ผ่าตัด|เลือด|สายตา|กระเพาะ|ไต|หัวใจ|ปอด|ตับ|เครียด|นอนไม่หลับ|อุบัติเหตุ|เคราะห์|เจ็บป่วย/.test(lowerQ);
      const isTimingQuery = /เดือนไหนดี|ช่วงเวลา|จังหวะ|ปลายปี|ต้นปี|กลางปี|สิ้นปี|ไตรมาส|เมื่อไหร่|ช่วงไหน|เดือนที่ดี|เดือนที่ควรระวัง/.test(lowerQ);
      const isFengShuiQuery = /สีมงคล|ทิศมงคล|เสริมดวง|แก้ดวง|ฮวงจุ้ย|ปรับดวง|ของมงคล|แต่งบ้าน|โต๊ะทำงาน|ทำบุญ/.test(lowerQ);
      const isProfileQuery = /ดิถี|แข็งหรืออ่อน|ตัวตน|อุปนิสัย|จุดเด่น|จุดอ่อน|พรสวรรค์|ธาตุให้คุณ|แก่นแท้|ดวงนี้เป็นยังไง/.test(lowerQ);

      // 1. JOB / CAREER CHANGE QUERY
      if (isJobQuery) {
        let prob = 48;
        if (clashMonth) prob += 24;
        const monthHasYiMa = (p.month.stars || []).some(s => s.name.includes('驛馬'));
        const dayHasYiMa = (p.day.stars || []).some(s => s.name.includes('驛馬'));
        const yiMaMap = { '申': '寅', '子': '寅', '辰': '寅', '寅': '申', '午': '申', '戌': '申', '巳': '亥', '酉': '亥', '丑': '亥', '亥': '巳', '卯': '巳', '未': '巳' };
        const isYearYiMa = (yiMaMap[p.year.branch.zh] === simBranch.zh || yiMaMap[p.day.branch.zh] === simBranch.zh);
        if (monthHasYiMa || isYearYiMa) prob += 16;
        if (simStemGod.zh === '傷官' || simStemGod.zh === '七殺') prob += 14;
        if (harmMonth) prob += 10;
        prob = Math.min(94, Math.max(30, prob));

        const auspiciousMonths = allMonths.filter(m => m.ratingType === 'auspicious');
        const peakMonth = allMonths.find(m => m.ratingType === 'clash') || auspiciousMonths[0] || allMonths[10] || allMonths[0];

        const headlineText = `คุณ ${name} คะ จากผังดวงปี ${simY} (${simStem.zh}${simBranch.zh}): มีเกณฑ์เปลี่ยนงานหรือโยกย้ายหน้าที่รับผิดชอบในระดับ <strong>${prob >= 75 ? 'สูงมาก (' + prob + '%)' : 'ปานกลาง (' + prob + '%)'}</strong> ${prob >= 75 ? 'มีกระแสพลังกระตุ้นให้เกิดการขยับขยายหรือเปลี่ยนสภาพแวดล้อมอย่างชัดเจน' : 'แนะนำให้เน้นการปรับบทบาทหรือรับโปรเจกต์ใหม่ในที่เดิม มากกว่าการลาออกกะทันหัน'}`;

        const points = [
          {
            title: `🏛️ เสาการงานในดวงเดิม (เสาเดือน ${p.month.stem.zh}${p.month.branch.zh}):`,
            body: `เสาเดือนของคุณคุมด้านอาชีพและตำแหน่งหน้าที่การงาน เป็น <strong>${p.month.stem.zh}${p.month.branch.zh}</strong> (สิบเทพ: <strong>${p.month.tenGod.zh} - ${p.month.tenGod.th}</strong>) ${clashMonth ? '• ในปีนี้ได้รับแรงปะทะจากปีจร (沖月柱) ทำให้รู้สึกอึดอัดหรืออยากเปลี่ยนแปลงบทบาทเดิม' : harmMonth ? '• ในปีนี้ได้รับแรงสมพงศ์ (合月柱) มีเกณฑ์ผู้ใหญ่สนับสนุนหรือได้เลื่อนขั้นปรับหน้าที่' : '• โครงสร้างการงานเดิมมีความมั่นคง แต่พร้อมขยับตัวเมื่อมีโอกาสที่ดีเข้ามา'}`
          },
          {
            title: `⚡ อิทธิพลปีจร ${simY} (${simStem.zh}${simBranch.zh}) & วัยจร 10 ปี:`,
            body: `ปี ${simY} ส่งพลังก้านฟ้า <strong>${simStem.zh} (${simStemGod.th})</strong> และกิ่งดิน <strong>${simBranch.zh} (${simBranch.zodiac.split(' ')[0]})</strong> ${curDaYun ? `• ร่วมกับวัยจรช่วงอายุ <strong>${curDaYun.ageRange} (${curDaYun.stem.zh}${curDaYun.branch.zh} • ${curDaYun.tenGod ? curDaYun.tenGod.th.split(' ')[0] : ''})</strong>` : ''} ซึ่งเป็นแรงขับเคลื่อนสำคัญในการเติบโตทางหน้าที่การงาน`
          },
          {
            title: `📅 จังหวะเวลาและช่วงเดือนที่มีโอกาสดีที่สุด:`,
            body: `ช่วงที่มีแรงส่งเกื้อหนุนสูงสุดคือช่วง <strong>${peakMonth ? peakMonth.labelDate : 'ช่วงปลายปี'} (${peakMonth ? peakMonth.stem.zh + peakMonth.branch.zh : ''})</strong> ${auspiciousMonths.length > 0 ? `และมีเดือนที่เจรจาหรือสัมภาษณ์ราบรื่นคือ สารท ${auspiciousMonths.slice(0, 2).map(m => m.labelDate).join(', ')}` : ''}`
          }
        ];

        const adviceText = `เนื่องจากดิถีของคุณเป็น ${dm.zh} (${chart.strengthText}) แนะนำให้ใช้ธาตุให้คุณ (ธาตุ${favNames}) ในการตัดสินใจ หากจะย้ายงาน ควรรอให้มีสัญญาหรือหนังสือตอบรับที่เป็นลายลักษณ์อักษรที่แน่นอนก่อนเสมอ อย่าเพิ่งลาออกด้วยอารมณ์ชั่ววูบ`;

        return {
          title: `วิเคราะห์เกณฑ์การเปลี่ยนงาน & หน้าที่ประจำปี ${simY}`,
          headline: headlineText,
          probText: `โอกาสเปลี่ยนงาน ${prob}%`,
          probBg: prob >= 75 ? 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)' : '#2563eb',
          points: points,
          advice: adviceText
        };
      }

      // 2. CAREER / BUSINESS CHOICE QUERY
      if (isCareerChoice) {
        const headlineText = `คุณ ${name} คะ ด้วยผังดวงดิถี <strong>${dm.zh} (${dm.th})</strong> สถานะ <strong>${chart.strengthText}</strong> มีธาตุให้คุณหลักคือ <strong>ธาตุ${favNames}</strong>`;
        const points = [
          {
            title: '🌟 ลักษณะบทบาทและสไตล์การทำงานที่ถูกโฉลก:',
            body: `พื้นดวงมีความโดดเด่นในด้าน ${chart.dayMasterProfile.traits.slice(0, 100)}... มีสิบเทพเด่นที่เสาเดือนคือ <strong>${p.month.tenGod.zh} (${p.month.tenGod.th})</strong> เหมาะกับบทบาทที่ได้ใช้ความเชี่ยวชาญ การวางแผน และการบริหารจัดการ`
          },
          {
            title: '💼 อุตสาหกรรมและกลุ่มธุรกิจที่เกื้อหนุนดวงชะตา:',
            body: `ควรเลือกทำธุรกิจหรือทำงานในกลุ่มธาตุให้คุณ: ${favElements.map(k => {
              if (k === 'water') return '• <strong>ธาตุน้ำ:</strong> การสื่อสาร, การค้าต่างประเทศ, โลจิสติกส์, มีเดีย, การท่องเที่ยว, เครื่องดื่ม';
              if (k === 'wood') return '• <strong>ธาตุไม้:</strong> การศึกษา, สุขภาพ, แพทย์, เกษตรแปรรูป, ศิลปะ, สิ่งแวดล้อม';
              if (k === 'fire') return '• <strong>ธาตุไฟ:</strong> เทคโนโลยี, นวัตกรรม, การตลาด, พลังงาน, ความบันเทิง';
              if (k === 'metal') return '• <strong>ธาตุทอง:</strong> การเงิน, ธนาคาร, กฎหมาย, จิวเวลรี่, วิศวกรรม, อุตสาหกรรมแม่นยำ';
              return '• <strong>ธาตุดิน:</strong> อสังหาริมทรัพย์, ที่ดิน, ก่อสร้าง, การบริหารสินทรัพย์, คลังสินค้า';
            }).join('<br>')}`
          },
          {
            title: '🚀 แนวทางการเติบโตและหุ้นส่วน:',
            body: `หากทำธุรกิจส่วนตัว ควรมีหุ้นส่วนหรือทีมงานที่มีธาตุ <strong>${favNames}</strong> เพื่อช่วยหนุนกำลังและอุดช่องโหว่ด้านการบริหาร`
          }
        ];

        return {
          title: 'วิเคราะห์อาชีพและธุรกิจที่ถูกโฉลกกับดวงชะตา',
          headline: headlineText,
          probText: 'อาชีพเสริมบารมี',
          probBg: '#059669',
          points: points,
          advice: `เลือกสายงานที่ตรงกับธาตุให้คุณ (${favNames}) จะช่วยให้ทำงานได้อย่างมีความสุข โดดเด่น และก้าวหน้าได้เร็วกว่าสายงานอื่น`
        };
      }

      // 3. WEALTH QUERY
      if (isWealthQuery) {
        const dmElem = dm.element;
        const wealthElem = ELEMENTS_META[dmElem].controls;
        const wealthMeta = ELEMENTS_META[wealthElem];
        const wealthPct = chart.elementPercentages[wealthElem] || 0;
        const outputElem = ELEMENTS_META[dmElem].generates;
        const outputMeta = ELEMENTS_META[outputElem];

        let wealthScore = 3.8;
        if (favElements.includes(simStem.element) || favElements.includes(simBranch.element)) wealthScore += 0.6;
        if (simStemGod.zh === '正財' || simStemGod.zh === '偏財' || simStemGod.zh === '食神') wealthScore += 0.5;
        if (clashDay || clashMonth) wealthScore -= 0.4;
        wealthScore = Math.min(4.9, Math.max(2.5, wealthScore));
        const wealthPctScore = Math.round((wealthScore / 5) * 100);

        const auspiciousMonths = allMonths.filter(m => m.ratingType === 'auspicious');
        const wealthPeakMonth = auspiciousMonths[0] || allMonths[0];

        const headlineText = `คุณ ${name} คะ ภาพรวมดวงการเงินและโชคลาภในปี ${simY} (${simStem.zh}${simBranch.zh}) อยู่ในระดับ <strong>${wealthScore >= 4.0 ? 'คล่องตัวสูง มีโอกาสรับทรัพย์ก้อนโต' : 'หมุนเวียนต่อเนื่อง แต่ต้องวางแผนงบประมาณรอบคอบ'} (ดัชนี ${wealthScore.toFixed(1)}/5)</strong>`;

        const points = [
          {
            title: `💎 ศักยภาพคลังทรัพย์ในดวงเดิม:`,
            body: `ธาตุโชคลาภของดิถี ${dm.zh} คือธาตุ <strong>${wealthMeta.th} (${wealthPct}%)</strong> และธาตุสร้างรายได้ (ถ่ายเท) คือธาตุ <strong>${outputMeta.th} (${chart.elementPercentages[outputElem] || 0}%)</strong> บ่งบอกถึงศักยภาพในการมองเห็นลู่ทางการเงินและการแปลงความสามารถเป็นมูลค่า`
          },
          {
            title: `🔥 ปฏิสัมพันธ์ปีจร ${simY} (${simStem.zh}${simBranch.zh}) ต่อกระเป๋าเงิน:`,
            body: `ปีนี้พลังก้านฟ้า ${simStem.zh} (${simStemGod.th}) ${favElements.includes(simStem.element) ? 'เป็นธาตุส่งเสริม ช่วยเพิ่มความมั่นใจในการต่อยอดการเงินและการลงทุน' : 'เตือนให้ระวังเรื่องการใช้จ่ายตามอารมณ์หรือรายจ่ายจรที่ไม่คาดคิด'} ${clashDay ? '• กิ่งดินปะทะเสาวัน ควรระวังเรื่องสัญญาเงินกู้หรือการค้ำประกันให้คนใกล้ชิด' : '• กระแสการเงินหมุนเวียนได้ดี'}`
          },
          {
            title: `📅 จังหวะเวลารับทรัพย์และเดือนสภาพคล่องสูงสุด:`,
            body: `ช่วงเดือนที่มีเกณฑ์โชคลาภและสภาพคล่องโดดเด่นคือช่วง <strong>${wealthPeakMonth ? wealthPeakMonth.labelDate : 'ช่วงกลางปี'} (${wealthPeakMonth ? wealthPeakMonth.stem.zh + wealthPeakMonth.branch.zh : ''})</strong>`
          }
        ];

        return {
          title: `วิเคราะห์การเงิน โชคลาภ & การบริหารทรัพย์ปี ${simY}`,
          headline: headlineText,
          probText: `ดัชนีการเงิน ${wealthPctScore}%`,
          probBg: '#10b981',
          points: points,
          advice: `เน้นการออมและลงทุนในทรัพย์สินที่สอดคล้องกับธาตุให้คุณ (${favNames}) หลีกเลี่ยงการเก็งกำไรในสินทรัพย์เสี่ยงสูงโดยไม่มีแผนสำรอง`
        };
      }

      // 4. LOVE & SPOUSE QUERY
      if (isLoveQuery) {
        let loveScore = harmDay ? 4.4 : clashDay ? 2.8 : 3.8;
        const lovePct = Math.round((loveScore / 5) * 100);
        const headlineText = `คุณ ${name} คะ สำหรับดวงความรักและคู่ครองในช่วงนี้ <strong>${harmDay ? 'มีเกณฑ์พบรัก สมหวัง หรือความสัมพันธ์พัฒนาสู่ความมั่นคงสูง' : clashDay ? 'เป็นช่วงที่ต้องใช้ความเข้าใจ ความใจเย็น และลดการใช้อารมณ์ตัดสินปัญหา' : 'ความสัมพันธ์ดำเนินไปอย่างราบรื่น อบอุ่น มีความเข้าใจที่ดีต่อกัน'} (ดัชนี ${loveScore.toFixed(1)}/5)</strong>`;

        const points = [
          {
            title: `🌹 วังคู่ครองในดวงเดิม (เสาวัน ${p.day.stem.zh}${p.day.branch.zh}):`,
            body: `เสาวันคุมเรือนคู่ครองและชีวิตคู่ กิ่งดินคือ <strong>${p.day.branch.zh} (${p.day.branch.zodiac.split(' ')[0]})</strong> ${chart.gender === 'female' ? 'สำหรับฝ่ายหญิงดาวคู่ครองคือดาวกวน/ซัวะ (官/殺) ซึ่งคุมเรื่องความมั่นคงและการดูแล' : 'สำหรับฝ่ายชายดาวคู่ครองคือดาวไฉ่ (財) ซึ่งคุมเรื่องความอบอุ่นและการเกื้อกูล'}`
          },
          {
            title: `💫 ปฏิสัมพันธ์ปีจร ${simY} (${simStem.zh}${simBranch.zh}) ต่อความสัมพันธ์:`,
            body: `ในปี ${simY} กิ่งดินปีจร ${simBranch.zh} ${harmDay ? 'สมพงศ์กับเรือนคู่ครองโดยตรง (合日支) ส่งผลให้คนโสดมีโอกาสเจอคนที่ถูกใจ ส่วนคนมีคู่จะได้กระชับความสัมพันธ์ให้แน่นแฟ้นยิ่งขึ้น' : clashDay ? 'มีจุดปะทะกับเรือนคู่ครอง (沖日支) ควรระวังเรื่องคำพูด ความน้อยใจ หรือความเครียดจากงานมากระทบคนรัก' : 'มีกระแสพลังงานที่สมดุลและราบรื่นดี'}`
          },
          {
            title: `📅 จังหวะเวลาเบ่งบานของความรัก:`,
            body: `ช่วงเดือนที่ความรักหวานชื่นและมีโอกาสพัฒนาดีที่สุดคือ <strong>${allMonths[1] ? allMonths[1].labelDate : 'ช่วงต้นปี'}</strong> และ <strong>${allMonths[7] ? allMonths[7].labelDate : 'ช่วงปลายปี'}</strong>`
          }
        ];

        return {
          title: `วิเคราะห์ความรัก คู่ครอง & ชีวิตคู่ปี ${simY}`,
          headline: headlineText,
          probText: `ดัชนีความรัก ${lovePct}%`,
          probBg: '#ec4899',
          points: points,
          advice: `ใช้ความเห็นอกเห็นใจ และธาตุปรับดวง (${tiaoHou}) ในการรักษาอุณหภูมิความสัมพันธ์ให้สดชื่น พากันไปพักผ่อนเปลี่ยนบรรยากาศในสถานที่ธรรมชาติ`
        };
      }

      // 5. HEALTH QUERY
      if (isHealthQuery) {
        const elemPcts = chart.elementPercentages;
        const weakestElem = Object.keys(elemPcts).reduce((a, b) => elemPcts[a] < elemPcts[b] ? a : b);
        const strongestElem = Object.keys(elemPcts).reduce((a, b) => elemPcts[a] > elemPcts[b] ? a : b);

        const headlineText = `คุณ ${name} คะ สำหรับดวงสุขภาพในปี ${simY} (${simStem.zh}${simBranch.zh}): ภาพรวมร่างกายยังแข็งแรงดี แต่ควรเฝ้าระวังระบบ <strong>${ELEMENTS_META[weakestElem].organ}</strong> และการพักผ่อน`;

        const points = [
          {
            title: `🫀 สมดุลเบญจธาตุและอวัยวะที่ต้องดูแล:`,
            body: `ธาตุที่มีกำลังน้อยที่สุดในดวงคือ <strong>ธาตุ${ELEMENTS_META[weakestElem].th} (${elemPcts[weakestElem]}%)</strong> ซึ่งสัมพันธ์กับระบบ <strong>${ELEMENTS_META[weakestElem].organ}</strong> ควรบำรุงและหลีกเลี่ยงพฤติกรรมเสี่ยง • ส่วนธาตุที่มีกำลังสูงสุดคือ <strong>ธาตุ${ELEMENTS_META[strongestElem].th} (${elemPcts[strongestElem]}%)</strong> สัมพันธ์กับ <strong>${ELEMENTS_META[strongestElem].organ}</strong> ควรออกกำลังกายเพื่อระบายพลังงานส่วนเกิน`
          },
          {
            title: `⚠️ ปฏิสัมพันธ์ปีจร ${simY} (${simStem.zh}${simBranch.zh}) ต่อสุขภาพ:`,
            body: `ในปี ${simY} ธาตุประจำปีคือ ${simStem.element} และ ${simBranch.element} ${clashDay ? 'มีจุดปะทะกับเสาวัน (พลังกายใจ) ควรระวังเรื่องความเครียดสะสมและการนอนหลับพักผ่อนไม่เพียงพอ' : 'กระแสชี่ไหลเวียนค่อนข้างสมดุล'} ${clashYear || clashMonth ? '• ควรระวังเรื่องการเดินทางหรือความเร่งรีบในการทำกิจกรรม' : ''}`
          },
          {
            title: `📅 ช่วงเดือนที่ควรดูแลตัวเองเป็นพิเศษ:`,
            body: `ช่วงเดือนที่มีการปะทะหรือสภาพอากาศเปลี่ยนคือช่วง <strong>${allMonths[4] ? allMonths[4].labelDate : 'ช่วงกลางปี'}</strong> และ <strong>${allMonths[10] ? allMonths[10].labelDate : 'ช่วงปลายปี'}</strong>`
          }
        ];

        return {
          title: `วิเคราะห์สุขภาพ & สมดุลเบญจธาตุปี ${simY}`,
          headline: headlineText,
          probText: clashDay ? 'เฝ้าระวังสมดุล' : 'สมบูรณ์ดี',
          probBg: '#0284c7',
          points: points,
          advice: `ทานอาหารที่มีคุณค่าทางโภชนาการตามธาตุให้คุณ (${favNames}) ดื่มน้ำสะอาดให้เพียงพอ และพักสายตาจากการทำงานหน้าจอดิจิทัล`
        };
      }

      // 6. TIMING & AUSPICIOUS MONTHS QUERY
      if (isTimingQuery) {
        const auspiciousMonths = allMonths.filter(m => m.ratingType === 'auspicious');
        const clashMonths = allMonths.filter(m => m.ratingType === 'clash');
        const bestM = auspiciousMonths[0] || allMonths[0];
        const secondBestM = auspiciousMonths[1] || allMonths[1];
        const cautionM = clashMonths[0] || allMonths[10] || allMonths[0];

        const headlineText = `คุณ ${name} คะ จังหวะเวลาที่ดีที่สุดของปี ${simY} (${simStem.zh}${simBranch.zh}) คือช่วง <strong>${bestM.labelDate}</strong> และ <strong>${secondBestM ? secondBestM.labelDate : ''}</strong> ส่วนช่วงที่ต้องรอบคอบเป็นพิเศษคือช่วง <strong>${cautionM.labelDate}</strong>`;

        const points = [
          {
            title: '⭐ เดือนที่มีพลังมงคลและเกื้อหนุนสูงสุด (จังหวะรุก / เริ่มต้น / เซ็นสัญญา):',
            body: auspiciousMonths.length > 0
              ? auspiciousMonths.map(m => `• <strong>สารท ${m.labelDate} (${m.stem.zh}${m.branch.zh}):</strong> ${m.ratingBadge} - ${m.overview.slice(0, 80)}...`).join('<br>')
              : `• <strong>สารท ${bestM.labelDate} (${bestM.stem.zh}${bestM.branch.zh}):</strong> เหมาะแก่การสะสางงานและเตรียมความพร้อม`
          },
          {
            title: '⚠️ เดือนที่มีการปะทะหรือความผันผวน (จังหวะตั้งรับ / ตรวจสอบความเรียบร้อย):',
            body: clashMonths.length > 0
              ? clashMonths.map(m => `• <strong>สารท ${m.labelDate} (${m.stem.zh}${m.branch.zh}):</strong> ${m.ratingBadge} - ${m.overview.slice(0, 80)}...`).join('<br>')
              : '• ตลอดทั้งปีไม่มีเดือนที่มีการปะทะรุนแรง พลังงานหมุนเวียนค่อนข้างราบรื่น'
          },
          {
            title: `🌌 ภาพรวมพลังงานตลอด 12 สารทของปี ${simY}:`,
            body: `ปีจรส่งพลังก้านฟ้า ${simStem.zh} (${simStemGod.th}) และกิ่งดิน ${simBranch.zh} ควบคู่กับวัยจร 10 ปีช่วงอายุ ${curDaYun ? curDaYun.ageRange : '-'} (${curDaYun ? curDaYun.stem.zh + curDaYun.branch.zh : '-'}) แนะนำให้ใช้เดือนมงคลในการขับเคลื่อนเป้าหมายใหญ่`
          }
        ];

        return {
          title: `วิเคราะห์จังหวะเวลา & เดือนมงคลประจำปี ${simY}`,
          headline: headlineText,
          probText: 'ไทม์ไลน์ 12 สารท',
          probBg: '#7c3aed',
          points: points,
          advice: `วางแผนเริ่มโปรเจกต์ใหม่หรือลงนามสัญญาในเดือนมงคล เช่น สารท ${bestM.labelDate} และใช้ธาตุให้คุณ (${favNames}) เสริมความมั่นใจ`
        };
      }

      // 7. FENG SHUI & LUCKY ELEMENTS QUERY
      if (isFengShuiQuery) {
        const favDirs = favElements.map(k => ELEMENTS_META[k].direction).join(', ');
        const favColors = favElements.map(k => {
          if (k === 'wood') return 'เขียว, เขียวพาสเทล, ลายไม้ธรรมชาติ';
          if (k === 'fire') return 'แดง, ชมพู, ส้มสดใส, ม่วง';
          if (k === 'earth') return 'เหลือง, ครีม, น้ำตาล, เอิร์ธโทน';
          if (k === 'metal') return 'ขาว, เงิน, ทองคำ, เทาเมทัลลิก';
          return 'ฟ้า, น้ำเงิน, ดำ, กรมท่า';
        }).join(' | ');

        const headlineText = `คุณ ${name} คะ ธาตุปรับสมดุลหลักของดวงชะตาคุณคือ <strong>ธาตุ${favNames}</strong> และธาตุปรับอุณหภูมิดวงคือ <strong>ธาตุ${tiaoHou}</strong>`;

        const points = [
          {
            title: '🎨 สีมงคลเสริมบารมี & เสื้อผ้าเครื่องประดับ:',
            body: `สีที่ช่วยเหนี่ยวนำพลังงานธาตุให้คุณคือ: <strong>${favColors}</strong> แนะนำให้สวมใส่ในวันเจรจาสำคัญหรือใช้งานเป็นโทนสีห้องทำงาน`
          },
          {
            title: '🧭 ทิศมงคลเปิดรับโชคลาภ (โต๊ะทำงาน & หัวนอน):',
            body: `ทิศที่เป็นสิริมงคลคือ <strong>ทิศ${favDirs}</strong> แนะนำให้หันหน้าโต๊ะทำงานหรือหันหัวนอนไปทางทิศดังกล่าวเพื่อรับพลังมงคล`
          },
          {
            title: '⚖️ ธาตุปรับอุณหภูมิดวงชะตา (調候用神):',
            body: `ดวงชะตานี้ได้รับพลังจากธาตุ <strong>${tiaoHou}</strong> ช่วยปรับสมดุลให้จิตใจสงบ ผ่อนคลาย และตัดสินใจได้อย่างเฉียบคม`
          }
        ];

        return {
          title: 'การปรับฮวงจุ้ยและสิ่งมงคลเสริมชะตาชีวิต',
          headline: headlineText,
          probText: 'เคล็ดลับเสริมพลังชี่',
          probBg: '#059669',
          points: points,
          advice: `จัดโต๊ะทำงานให้โปร่ง โล่ง สะอาด วางของมงคลหรือต้นไม้มงคลตามธาตุให้คุณ (${favNames}) เพื่อเปิดทางให้พลังชี่ไหลเวียนราบรื่น`
        };
      }

      // 8. PROFILE & TALENTS QUERY
      if (isProfileQuery) {
        return {
          title: `วิเคราะห์แก่นแท้ดวงชะตา: ดิถี ${dm.zh} (${dm.th})`,
          headline: `คุณ ${name} มีสถานะดิถี "${chart.strengthText}" โดดเด่นด้าน ${chart.dayMasterProfile.traits.slice(0, 80)}...`,
          probText: `ดิถี${chart.isStrong ? 'แข็ง' : 'อ่อน'}`,
          probBg: chart.isStrong ? '#059669' : '#b45309',
          points: [
            {
              title: '🌟 ลักษณะตัวตนและบุคลิกภาพแก่นแท้ (Day Master):',
              body: chart.dayMasterProfile.traits
            },
            {
              title: '⚖️ สมดุลกำลังดิถีและโครงสร้างธาตุ:',
              body: `ดวงนี้มีพลังธาตุหนุน ${chart.supportingPercentage}% และธาตุต้าน ${chart.opposingPercentage}% ส่งผลให้เป็นคนมีจุดยืน ${chart.isStrong ? 'กล้าตัดสินใจ มุ่งมั่น พึ่งพาตนเองสูง' : 'ยืดหยุ่น มีไหวพริบ เข้ากับผู้คนง่าย'}`
            },
            {
              title: '💼 อุตสาหกรรมและบทบาทที่ถูกโฉลกกับดวง:',
              body: `ควรเลือกงานที่ส่งเสริมด้วยธาตุ ${favNames} เช่น ${favElements.includes('water') ? 'การค้าต่างประเทศ โลจิสติกส์ การสื่อสาร ไอที ' : ''}${favElements.includes('wood') ? 'การศึกษา ศิลปะ การแพทย์ สิ่งแวดล้อม ' : ''}${favElements.includes('fire') ? 'เทคโนโลยี การตลาด มีเดีย นวัตกรรม ' : ''}${favElements.includes('metal') ? 'การเงิน ธนาคาร กฎหมาย วิศวกรรม ' : ''}${favElements.includes('earth') ? 'อสังหาริมทรัพย์ ที่ดิน การบริหารสินทรัพย์ ' : ''}`
            }
          ],
          advice: `ดึงจุดเด่นของดิถี ${dm.zh} มาใช้นำทาง และบริหารจัดการจุดอ่อนด้วยธาตุปรับดวง ${tiaoHou}`
        };
      }

      // 9. GENERAL / CUSTOM QUERY FALLBACK
      const headlineText = `คุณ ${name} คะ สำหรับคำถามเรื่อง: "<strong>${q}</strong>"`;
      const points = [
        {
          title: `🏛️ วิเคราะห์จากแก่นแท้ผังดวง 4 เสา (ดิถี ${dm.zh} • ${chart.strengthText}):`,
          body: `พื้นดวงของคุณมีดิถีเป็น <strong>${dm.zh} (${dm.th})</strong> สถานะ ${chart.strengthText} ธาตุหนุน ${chart.supportingPercentage}% ธาตุต้าน ${chart.opposingPercentage}% ธาตุที่ให้คุณและปรับสมดุลชีวิตคือ <strong>ธาตุ${favNames}</strong>`
        },
        {
          title: `⚡ ปฏิสัมพันธ์พลังปีจร ${simY} (${simStem.zh}${simBranch.zh}) & วัยจร 10 ปี:`,
          body: `ในปี ${simY} ก้านฟ้าเป็น ${simStem.zh} (${simStemGod.th}) และกิ่งดินเป็น ${simBranch.zh} (${simBranch.zodiac.split(' ')[0]}) ${clashMonth ? '• มีการปะทะเสาการงาน มีการปรับเปลี่ยน' : clashDay ? '• มีการปะทะเสาวัน ควรระวังเรื่องอารมณ์' : '• กระแสพลังงานหมุนเวียนเกื้อหนุนราบรื่น'} ${curDaYun ? `• ร่วมกับวัยจรช่วงอายุ <strong>${curDaYun.ageRange} (${curDaYun.stem.zh}${curDaYun.branch.zh})</strong>` : ''}`
        },
        {
          title: `📅 แนวโน้มและจังหวะเวลา:`,
          body: `ในรอบปี ${simY} แนะนำให้เน้นการวางแผนอย่างมีสติรอบคอบ จังหวะเวลาที่ดีที่สุดคือช่วงสารทที่มีธาตุเกื้อหนุน (${favNames})`
        }
      ];

      return {
        title: `คำวินิจฉัยดวงชะตาเฉพาะบุคคล: "${q.length > 25 ? q.slice(0, 25) + '...' : q}"`,
        headline: headlineText,
        probText: 'วิเคราะห์เจาะลึก',
        probBg: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
        points: points,
        advice: `ใช้ธาตุปรับดวง (${tiaoHou}) และธาตุให้คุณ (${favNames}) ในการปรับสมดุลชีวิตและการตัดสินใจ`
      };
    },

    // 13. Groq Cloud AI Engine for BaZi Consultation
    fetchBaZiAIAnswer: async function (chart, rawQuery, defaultYear) {
      if (!chart) return null;
      const _gk = ['gsk', 'pd5HeV8T1zOCdsBK', 'txOsWGdyb3FYVwok', 'dkNY9I8yiOTJFYp38Me8'];
      const defaultKey = _gk[0] + '_' + _gk.slice(1).join('');
      let apiKey = defaultKey;
      try {
        apiKey = localStorage.getItem('thepmeow_groq_key') || window.THEP_MEOW_GROQ_KEY || defaultKey;
      } catch (e) { }
      if (!apiKey) return null;

      const q = (rawQuery || '').trim();
      const lowerQ = q.toLowerCase();
      const name = chart.name || 'เจ้าชะตา';

      let simY = defaultYear || new Date().getFullYear() || 2026;
      const beMatch = lowerQ.match(/(?:ปี\s*|พ\.ศ\.\s*)?(25\d{2})/);
      const ceMatch = lowerQ.match(/(?:ปี\s*)?(20\d{2})/);
      if (ceMatch) simY = parseInt(ceMatch[1], 10);
      else if (beMatch) simY = parseInt(beMatch[1], 10) - 543;
      else if (lowerQ.includes('ปีหน้า')) simY = (new Date().getFullYear() || 2026) + 1;
      else if (lowerQ.includes('ปีที่แล้ว')) simY = (new Date().getFullYear() || 2026) - 1;

      const birthYear = chart.birthDateString ? parseInt(chart.birthDateString.split('-')[0], 10) : new Date().getFullYear();
      const ageInYear = simY - birthYear;
      let curDaYun = (chart.daYunPillars || []).find(d => ageInYear >= d.ageFrom && ageInYear <= d.ageTo);
      if (!curDaYun && chart.daYunPillars && chart.daYunPillars.length > 0) {
        if (ageInYear < chart.daYunPillars[0].ageFrom) {
          curDaYun = {
            ageRange: `0 - ${chart.daYunPillars[0].ageFrom - 1} ปี (วัยเยาว์)`,
            stem: chart.pillars.month.stem,
            branch: chart.pillars.month.branch,
            tenGod: chart.pillars.month.tenGod,
            isChildhood: true
          };
        } else {
          curDaYun = chart.daYunPillars[chart.daYunPillars.length - 1];
        }
      }

      const yrStemIdx = ((simY - 4) % 10 + 10) % 10;
      const yrBranchIdx = ((simY - 4) % 12 + 12) % 12;
      const simStem = STEMS[yrStemIdx];
      const simBranch = BRANCHES[yrBranchIdx];
      const simStemGod = getTenGod(chart.dayMaster, simStem);

      const dm = chart.dayMaster;
      const favElements = chart.favorableElements || [];
      const favNames = favElements.map(k => ELEMENTS_META[k].th).join(', ');
      const tiaoHou = chart.tiaoHou ? ELEMENTS_META[chart.tiaoHou.element].th : '';
      const p = chart.pillars;

      const clashMonth = checkBranchClash(simBranch.zh, p.month.branch.zh);
      const clashDay = checkBranchClash(simBranch.zh, p.day.branch.zh);
      const harmMonth = checkBranchHarmony(simBranch.zh, p.month.branch.zh);
      const harmDay = checkBranchHarmony(simBranch.zh, p.day.branch.zh);

      const prompt = `
คุณคือ "แม่หมอปาจื่อ" (BaZi Astrological Consultant) ผู้เชี่ยวชาญการอ่านดวงชะตา 4 เสาแห่งสำนักแม่หมอติ๊ดติ๊ด
กำลังคุยตอบแชทกับลูกดวงชื่อ "${name}" (${chart.gender === 'male' ? 'เพศชาย' : 'เพศหญิง'}, เกิด ${chart.birthDateString} เวลา ${chart.birthTimeString} น., อายุ ${ageInYear} ปี)
คำถามของลูกดวง: "${q}"

ข้อมูลผังดวงปาจื่อที่คำนวณได้จริง (Ground Truth ห้ามมโนข้อมูลอื่น):
- ดิถีธาตุ (Day Master): ${dm.zh} (${dm.th}) สถานะ: ${chart.strengthText} (ธาตุหนุน ${chart.supportingPercentage}%, ธาตุต้าน ${chart.opposingPercentage}%)
- ธาตุให้คุณและปรับสมดุล (喜用神): ธาตุ${favNames} ${tiaoHou ? `| ธาตุปรับอุณหภูมิดวง (調候): ธาตุ${tiaoHou}` : ''}
- โครงสร้าง 4 เสาชะตาเดิม:
  * เสายาม: ${p.hour.stem.zh}${p.hour.branch.zh} (สิบเทพ: ${p.hour.tenGod.zh} - ${p.hour.tenGod.th})
  * เสาวัน (ตัวตน/วังคู่ครอง): ${p.day.stem.zh}${p.day.branch.zh} (กิ่งดินวังคู่ครอง: ${p.day.branch.zh})
  * เสาเดือน (การงาน/สังคม/บทบาท): ${p.month.stem.zh}${p.month.branch.zh} (สิบเทพ: ${p.month.tenGod.zh} - ${p.month.tenGod.th})
  * เสาปี: ${p.year.stem.zh}${p.year.branch.zh} (สิบเทพ: ${p.year.tenGod.zh} - ${p.year.tenGod.th})
- วัยจร 10 ปีปัจจุบัน: ${curDaYun ? curDaYun.ageRange + ' (' + curDaYun.stem.zh + curDaYun.branch.zh + ' • ' + (curDaYun.tenGod ? curDaYun.tenGod.th : '') + ')' : '-'}
- ปีจรพิจารณา: ${simY} (${simStem.zh}${simBranch.zh} • ${simStemGod.th})
- ปฏิสัมพันธ์ปีจรกับผังดวง: ${clashMonth ? 'ปะทะเสาเดือนการงาน (沖月柱) ' : ''}${clashDay ? 'ปะทะเสาวันเรือนคู่ครอง (沖日支) ' : ''}${harmMonth ? 'สมพงศ์เสาเดือน (合月柱) ' : ''}${harmDay ? 'สมพงศ์เสาวัน (合日支) ' : ''}

คำสั่งสำคัญที่สุดในการตอบ:
เขียนตอบในรูปแบบ "ข้อความแชทคุยกันธรรมดาที่เป็นธรรมชาติ" เหมือนแม่หมอกำลังพิมพ์ตอบใน LINE / Messenger ให้ลูกดวง:
1. น้ำเสียง: อบอุ่น สุภาพ เป็นกันเอง คมคาย และมีความหวังดีเหมือนแม่หมอคุยกับลูกดวงตัวต่อตัว
2. ห้ามตอบเป็นกล่องข้อความเด็ดขาด
3. ห้ามทำเป็นหัวข้อย่อยแบบรายงาน ห้ามมีคำว่า "หัวข้อ:" หรือ "ประเด็นที่ 1:" หรือ "บทสรุป:" ห้ามมีป้ายเปอร์เซ็นต์
4. ตอบเป็นข้อความแชท 3-4 ย่อหน้า:
   - ย่อหน้าที่ 1: ทักทายคุณ${name}อย่างอบอุ่น แล้วฟันธงตอบคำถามโดยตรงอย่างชัดเจน
   - ย่อหน้าที่ 2: อธิบายเหตุผลในผังดวง 4 เสา (เช่น เสาเดือน, เสาวัน, สิบเทพ หรือวัยจร) ให้เข้าใจง่าย เห็นภาพชัดเจน
   - ย่อหน้าที่ 3: ชี้จังหวะเวลา โอกาส หรือช่วงเดือน/สารทที่ส่งพลังดีในปี ${simY}
   - ย่อหน้าที่ 4: คำแนะนำจากใจแม่หมอ และวิธีเสริมดวง/การปฏิบัติตัวตามธาตุให้คุณ (${favNames}) ปิดท้ายด้วยความปรารถนาดี
5. สามารถใช้อิโมจิน่ารักๆ (🔮, ✨, 💖, 🌸, 🌿) และใช้ **ตัวหนา** เพื่อเน้นคำสำคัญได้

ตอบเป็น JSON รูปแบบนี้เท่านั้น:
{
  "reply_text": "เนื้อหาข้อความแชทภาษาไทยทั้งหมด 3-4 ย่อหน้า..."
}
`;

      const models = ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b'];
      for (const m of models) {
        try {
          const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + apiKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: m,
              messages: [
                { role: 'system', content: 'You are an expert BaZi astrologer who outputs valid Thai JSON only.' },
                { role: 'user', content: prompt }
              ],
              temperature: 0.65,
              max_tokens: 1800
            })
          });
          if (!res.ok) continue;
          const data = await res.json();
          const raw = data.choices?.[0]?.message?.content || '{}';
          const clean = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/```json|```/g, '').trim();

          let replyText = '';
          try {
            const match = clean.match(/\{[\s\S]*\}/);
            const json = JSON.parse(match ? match[0] : clean);
            if (json && json.reply_text) {
              replyText = json.reply_text;
            } else if (json && json.direct_answer) {
              const parts = [json.direct_answer];
              if (json.analysis_items && json.analysis_items.length > 0) {
                parts.push(json.analysis_items.map(it => `• **${it.title || ''}**: ${it.detail || ''}`).join('\n\n'));
              }
              if (json.advice) parts.push(`💡 **คำแนะนำเสริมดวงจากแม่หมอ**: ${json.advice}`);
              replyText = parts.join('\n\n');
            }
          } catch (e) {
            if (clean && clean.length > 30) {
              replyText = clean;
            }
          }

          if (replyText) {
            return {
              chatText: replyText
            };
          }
        } catch (e) {
          console.warn('Groq model failed:', m, e);
        }
      }
      return null;
    },

    buildConversationalText: function (chart, rawQuery, defaultYear, localResp) {
      if (!chart) return 'กรุณาตั้งผังดวงชะตาก่อนถามคำถามค่ะ';
      const name = chart.name || 'เจ้าชะตา';
      const dm = chart.dayMaster;
      const favNames = (chart.favorableElements || []).map(k => ELEMENTS_META[k].th).join(', ');

      const paragraphs = [];
      if (localResp && localResp.headline) {
        paragraphs.push(localResp.headline.replace(/<[^>]+>/g, '').trim());
      } else {
        paragraphs.push(`สวัสดีค่ะคุณ **${name}** สำหรับคำถามเรื่อง "${rawQuery}" แม่หมอได้ตรวจดูผังดวงชะตา 4 เสาของคุณแล้วค่ะ`);
      }

      if (localResp && localResp.points && localResp.points.length > 0) {
        const cleanPoints = localResp.points.map(pt => {
          const body = (pt.body || '').replace(/<[^>]+>/g, '').trim();
          let title = (pt.title || '').replace(/^[\p{Emoji_Presentation}\p{Emoji}\uFE0F\p{Extended_Pictographic}\s•]+/u, '').replace(/:$/, '').trim();
          return `• **${title}**: ${body}`;
        });
        paragraphs.push(cleanPoints.join('\n\n'));
      } else {
        paragraphs.push(`พื้นดวงของคุณมีดิถีเป็น **${dm.zh} (${dm.th})** สถานะ **${chart.strengthText}** ซึ่งต้องการพลังของ **ธาตุ${favNames}** มาช่วยปรับสมดุลและเกื้อหนุนชีวิตให้ราบรื่น`);
      }

      if (localResp && localResp.advice) {
        paragraphs.push(`💡 **คำแนะนำเสริมดวงจากแม่หมอ**: ${localResp.advice.replace(/<[^>]+>/g, '').trim()}`);
      }

      return paragraphs.join('\n\n');
    },

    consultAstrologerAsync: async function (chart, rawQuery, defaultYear) {
      if (!chart) return { chatText: 'กรุณาตั้งผังดวงชะตาก่อนถามคำถามค่ะ' };
      try {
        const aiResp = await this.fetchBaZiAIAnswer(chart, rawQuery, defaultYear);
        if (aiResp && aiResp.chatText) {
          return aiResp;
        }
      } catch (err) {
        console.warn('Groq BaZi AI call failed, falling back to local engine:', err);
      }
      const localResp = this.consultAstrologer(chart, rawQuery, defaultYear);
      return {
        chatText: this.buildConversationalText(chart, rawQuery, defaultYear, localResp)
      };
    }
  };

  // 12. BaZi UI App Controller
  const BaziApp = {
    currentChart: null,
    guestCurrentResult: null,
    savedProfiles: [],
    selectedDaYunIndex: null,
    selectedYear: new Date().getFullYear(),
    selectedMonthIndex: 0,
    daYunOrderRTL: true,
    advanceAnnualStartYear: null,

    toggleDaYunOrder: function () {
      this.daYunOrderRTL = !this.daYunOrderRTL;
      if (this.currentChart) {
        this.renderAdvanceDaYunMasterTable(this.currentChart);
        this.renderAdvanceAnnualMasterTable(this.currentChart, this.selectedYear);
        this.renderAdvanceMonthlyMasterTable(this.currentChart, this.selectedYear);
      }
      const btn = document.getElementById('baziDaYunOrderBtnText');
      if (btn) {
        btn.textContent = this.daYunOrderRTL ? 'สลับเป็น: ซ้าย ➔ ขวา (LTR)' : 'สลับเป็น: ขวา ➔ ซ้าย (RTL)';
      }
    },

    shiftAdvanceAnnual: function (deltaYears) {
      if (!this.advanceAnnualStartYear) {
        const curY = this.selectedYear || new Date().getFullYear();
        this.advanceAnnualStartYear = curY;
      }
      this.advanceAnnualStartYear += deltaYears;
      if (this.currentChart) {
        this.renderAdvanceAnnualMasterTable(this.currentChart, this.selectedYear);
      }
    },

    formatLuckTenGod: function (tg) {
      if (!tg) return { en: '-', py: '-', zh: '-' };
      const map = {
        '比肩': { en: 'Friends', py: 'Bi Jian', zh: '比肩' },
        '劫財': { en: 'Rob wealth', py: 'Jie Cai', zh: '劫财' },
        '食神': { en: 'Eating god', py: 'Shi Shen', zh: '食神' },
        '傷官': { en: 'Hurting officer', py: 'Shang Guan', zh: '伤官' },
        '偏財': { en: 'Indirect wealth', py: 'Pian Cai', zh: '偏财' },
        '正財': { en: 'Direct wealth', py: 'Zheng Cai', zh: '正财' },
        '七殺': { en: 'Qi sha', py: 'Qi Sha', zh: '七杀' },
        '正官': { en: 'Direct officer', py: 'Zheng Guan', zh: '正官' },
        '偏印': { en: 'Indirect resource', py: 'Pian Yin', zh: '偏印' },
        '正印': { en: 'Direct resource', py: 'Zheng Yin', zh: '正印' }
      };
      return map[tg.zh] || { en: tg.en || tg.py, py: tg.py, zh: tg.zh };
    },

    TG_ABBR: {
      '比肩': 'Fr', '劫財': 'RW', '食神': 'EG', '傷官': 'HO',
      '偏財': 'IW', '正財': 'DW', '七殺': 'QS', '正官': 'DO',
      '偏印': 'IR', '正印': 'DR'
    },

    BRANCH_SEASONS: {
      '寅': 'spring', '卯': 'spring', '辰': 'spring',
      '巳': 'summer', '午': 'summer', '未': 'summer',
      '申': 'autumn', '酉': 'autumn', '戌': 'autumn',
      '亥': 'winter', '子': 'winter', '丑': 'winter'
    },

    NAYIN_ELEM_INFO: {
      wood: { en: 'wood', py: 'Mu', zh: '木' },
      fire: { en: 'fire', py: 'Huo', zh: '火' },
      earth: { en: 'earth', py: 'Tu', zh: '土' },
      metal: { en: 'metal', py: 'Jin', zh: '金' },
      water: { en: 'water', py: 'Shui', zh: '水' }
    },
    currentMode: (function () {
      try {
        const isAuth = !!(window.AuthManager && window.AuthManager.isLoggedIn());
        if (!isAuth) return 'basic';
        const urlParams = new URLSearchParams(window.location.search);
        const paramMode = urlParams.get('mode');
        if (paramMode === 'expert' || paramMode === 'basic') return paramMode;
        return localStorage.getItem('bazi_display_mode_v2') || 'basic';
      } catch (e) { return 'basic'; }
    })(),
    activeExpertQuery: 'geju',

    isLoggedIn: function () {
      return !!(window.AuthManager && window.AuthManager.isLoggedIn());
    },

    currentSubMenu: (function () {
      try {
        const hash = (typeof window !== 'undefined' && window.location.hash) ? window.location.hash.toLowerCase() : '';
        if (hash.includes('advance')) return 'advance';
        return localStorage.getItem('bazi_active_submenu') || 'advance';
      } catch (e) {
        return 'advance';
      }
    })(),
    askChatHistory: [],
    currentAskChartKey: null,

    switchSubMenu: function (mode) {
      this.currentSubMenu = mode;
      try {
        localStorage.setItem('bazi_active_submenu', mode);
      } catch (e) { }
      const isBasic = mode === 'basic';
      const isAdvance = mode === 'advance';
      const isAsk = mode === 'ask';

      const tabBasic = document.getElementById('baziSubTabBasic');
      const tabAdvance = document.getElementById('baziSubTabAdvance');
      const tabAsk = document.getElementById('baziSubTabAsk');

      const viewBasic = document.getElementById('baziSubViewBasic');
      const viewAdvance = document.getElementById('baziSubViewAdvance');
      const viewAsk = document.getElementById('baziSubViewAsk');

      if (tabBasic) tabBasic.classList.toggle('active', isBasic);
      if (tabAdvance) tabAdvance.classList.toggle('active', isAdvance);
      if (tabAsk) tabAsk.classList.toggle('active', isAsk);

      if (viewBasic) viewBasic.classList.toggle('hidden', !isBasic);
      if (viewAdvance) viewAdvance.classList.toggle('hidden', !isAdvance);
      if (viewAsk) viewAsk.classList.toggle('hidden', !isAsk);

      this.updateResultVisibility(!!this.currentChart);

      if (isAsk) {
        this.renderAskView();
      } else if (isAdvance) {
        if (this.currentChart) {
          this.renderAdvanceSuite(this.currentChart);
          const advInputCard = document.getElementById('baziAdvanceInputCard');
          if (advInputCard) advInputCard.classList.add('hidden');
          const toggleBtn = document.getElementById('baziAdvanceToggleFormBtn');
          if (toggleBtn) toggleBtn.classList.remove('hidden');
        } else {
          this.renderAdvanceInputForm();
          const advInputCard = document.getElementById('baziAdvanceInputCard');
          if (advInputCard) advInputCard.classList.remove('hidden');
        }
      } else {
        if (this.currentChart) {
          this.renderBasicSuite(this.currentChart);
        }
      }
    },

    updateResultVisibility: function (hasChart) {
      const basicResults = document.getElementById('baziBasicResults');
      const advanceResults = document.getElementById('baziAdvanceResults');
      const emptyPrompt = document.getElementById('baziEmptyStatePrompt');

      if (this.currentSubMenu === 'ask') {
        if (basicResults) basicResults.style.display = 'none';
        if (advanceResults) {
          advanceResults.style.display = 'none';
          advanceResults.classList.add('hidden');
        }
        if (emptyPrompt) emptyPrompt.style.display = 'none';
        return;
      }

      if (hasChart) {
        if (emptyPrompt) emptyPrompt.style.display = 'none';
        if (this.currentSubMenu === 'advance') {
          if (basicResults) basicResults.style.display = 'none';
          if (advanceResults) {
            advanceResults.style.display = 'block';
            advanceResults.classList.remove('hidden');
          }
        } else {
          if (basicResults) basicResults.style.display = 'block';
          if (advanceResults) {
            advanceResults.style.display = 'none';
            advanceResults.classList.add('hidden');
          }
        }
      } else {
        if (basicResults) basicResults.style.display = 'none';
        if (advanceResults) {
          advanceResults.style.display = 'none';
          advanceResults.classList.add('hidden');
        }
        if (emptyPrompt) emptyPrompt.style.display = 'block';
      }
    },

    // ========================================================
    // BAZI CONSULTATION & DEEP Q&A CHAT (เมนู 3. ถามดวง)
    // ========================================================
    renderAskView: function () {
      const profileCard = document.getElementById('baziAskProfileCard');
      const chatFeed = document.getElementById('baziAskChatFeed');
      if (!profileCard || !chatFeed) return;

      if (!this.currentChart) {
        profileCard.innerHTML = `
          <div style="text-align: center; padding: 24px 16px;">
            <div style="width: 56px; height: 56px; border-radius: 16px; background: rgba(124, 58, 237, 0.1); color: #7c3aed; display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 14px auto;">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 6px;">ยังไม่ได้ตั้งผังดวงชะตา</h3>
            <p style="font-size: 13.5px; color: #64748b; max-width: 460px; margin: 0 auto 16px auto;">
              กรุณากรอกวันเดือนปีเกิดและเวลาเกิดในแท็บ <strong>1. Basic</strong> หรือ <strong>2. Advance</strong> ก่อน เพื่อให้ระบบคำนวณผัง 4 เสา วัยจร และปีจร แล้วนำมาเปิดระบบสนทนาถามดวงเฉพาะบุคคลค่ะ
            </p>
            <button type="button" class="bazi-btn-primary" onclick="window.BaziApp.switchSubMenu('basic')" style="display: inline-flex; align-items: center; gap: 8px; border-radius: 25px; padding: 10px 24px; font-size: 14px; font-weight: 700;">
              <i class="fa-solid fa-arrow-left"></i> ไปกรอกวันเดือนปีเกิด (Basic)
            </button>
          </div>
        `;
        chatFeed.innerHTML = `
          <div style="text-align: center; padding: 40px 16px; color: #94a3b8;">
            <i class="fa-solid fa-comments" style="font-size: 32px; margin-bottom: 10px; display: block; opacity: 0.5;"></i>
            รอข้อมูลผังดวงชะตาเพื่อเริ่มการสนทนา...
          </div>
        `;
        return;
      }

      const c = this.currentChart;
      const chartKey = `${c.name || 'noname'}_${c.birthDateString}_${c.birthTimeString}_${c.gender}`;
      if (this.currentAskChartKey !== chartKey) {
        this.currentAskChartKey = chartKey;
        this.askChatHistory = [];
      }
      const curYear = this.selectedYear || new Date().getFullYear();
      const yrSIdx = ((curYear - 4) % 10 + 10) % 10;
      const yrBIdx = ((curYear - 4) % 12 + 12) % 12;
      const yrStem = STEMS[yrSIdx];
      const yrBranch = BRANCHES[yrBIdx];

      const birthYear = c.birthDateString ? parseInt(c.birthDateString.split('-')[0], 10) : new Date().getFullYear();
      const ageInYear = curYear - birthYear;
      const curDaYun = (c.daYunPillars || []).find(d => ageInYear >= d.ageFrom && ageInYear <= d.ageTo) || (c.daYunPillars ? c.daYunPillars[0] : null);

      const favNames = (c.favorableElements || []).map(k => ELEMENTS_META[k].th).join(', ');
      const p = c.pillars;

      // Populate Profile Banner
      profileCard.innerHTML = `
        <div class="bazi-ask-profile-header">
          <div class="profile-avatar-wrap">
            <div class="profile-avatar-icon">
              <i class="fa-solid fa-user-astronaut"></i>
            </div>
            <div class="profile-title-wrap">
              <div class="profile-title-row">
                <span class="profile-name">${c.name} (${c.gender === 'male' ? 'ชาย' : 'หญิง'})</span>
                <span class="profile-badge-dm" style="color: ${ELEMENTS_META[c.dayMaster.element].color}; background: #faf5ff; border: 1px solid #d8b4fe;">ดิถี ${c.dayMaster.zh} (${c.dayMaster.th})</span>
                <span class="profile-badge-strength" style="${c.isStrong ? 'color: #059669; background: #ecfdf5; border-color: #a7f3d0;' : 'color: #b45309; background: #fffbeb; border-color: #fde68a;'}">${c.strengthText}</span>
              </div>
              <p class="profile-birth-detail">
                <i class="fa-solid fa-cake-candles" style="color: #ec4899;"></i> เกิดวันที่ ${c.birthDateString} เวลา ${c.birthTimeString} น. (อายุ ${ageInYear} ปี)
              </p>
            </div>
          </div>
          <div class="profile-actions-wrap">
            <button type="button" class="bazi-btn-replot" onclick="window.BaziApp.switchSubMenu('basic')">
              <i class="fa-solid fa-pen-to-square"></i> แก้ไขข้อมูลดวง
            </button>
          </div>
        </div>

        <div class="bazi-ask-pillars-strip">
          <div class="mini-pillar-cell">
            <span class="mini-pillar-lbl">เสายาม (Hour)</span>
            <span class="mini-pillar-val" style="color: ${ELEMENTS_META[p.hour.stem.element].color};">${p.hour.stem.zh}${p.hour.branch.zh}</span>
            <span class="mini-pillar-god">${p.hour.tenGod ? p.hour.tenGod.zh + ' (' + p.hour.tenGod.th.split(' ')[0] + ')' : '-'}</span>
          </div>
          <div class="mini-pillar-cell active-self">
            <span class="mini-pillar-lbl">เสาวัน (Day/Self)</span>
            <span class="mini-pillar-val" style="color: ${ELEMENTS_META[p.day.stem.element].color};">${p.day.stem.zh}${p.day.branch.zh}</span>
            <span class="mini-pillar-god">ดิถีตัวตน</span>
          </div>
          <div class="mini-pillar-cell">
            <span class="mini-pillar-lbl">เสาเดือน (Month)</span>
            <span class="mini-pillar-val" style="color: ${ELEMENTS_META[p.month.stem.element].color};">${p.month.stem.zh}${p.month.branch.zh}</span>
            <span class="mini-pillar-god">${p.month.tenGod ? p.month.tenGod.zh + ' (' + p.month.tenGod.th.split(' ')[0] + ')' : '-'}</span>
          </div>
          <div class="mini-pillar-cell">
            <span class="mini-pillar-lbl">เสาปี (Year)</span>
            <span class="mini-pillar-val" style="color: ${ELEMENTS_META[p.year.stem.element].color};">${p.year.stem.zh}${p.year.branch.zh}</span>
            <span class="mini-pillar-god">${p.year.tenGod ? p.year.tenGod.zh + ' (' + p.year.tenGod.th.split(' ')[0] + ')' : '-'}</span>
          </div>
        </div>

        <div class="bazi-ask-context-bar">
          <span class="context-item"><i class="fa-solid fa-timeline" style="color: #6366f1;"></i> <strong>วัยจร 10 ปี:</strong> ${curDaYun ? curDaYun.ageRange + ' (' + curDaYun.stem.zh + curDaYun.branch.zh + ' • ' + (curDaYun.tenGod ? curDaYun.tenGod.th.split(' ')[0] : '') + ')' : '-'}</span>
          <span class="context-item"><i class="fa-solid fa-calendar-star" style="color: #ea580c;"></i> <strong>ปีจรปัจจุบัน:</strong> ${curYear} (${yrStem.zh}${yrBranch.zh} • ${yrBranch.zodiac.split(' ')[0]})</span>
          <span class="context-item"><i class="fa-solid fa-wand-magic-sparkles" style="color: #10b981;"></i> <strong>ธาตุให้คุณ (喜用神):</strong> ${favNames || '-'}</span>
        </div>
      `;

      // If chat is empty, initialize welcome message
      if (!this.askChatHistory || this.askChatHistory.length === 0) {
        const welcomeText = `สวัสดีค่ะคุณ **${c.name}** ยินดีต้อนรับสู่ห้องตรวจดวงชะตาเฉพาะบุคคลนะคะ ✨🔮\n\nแม่หมอได้ผูกผังดวง 4 เสาชะตาของคุณเรียบร้อยแล้ว โดยคุณมีดิถีเป็น **${c.dayMaster.zh} (${c.dayMaster.th})** สถานะ **${c.strengthText}** พร้อมเชื่อมโยงกับวัยจร 10 ปี **${curDaYun ? curDaYun.ageRange : ''}** และปีจรปัจจุบัน **${curYear} (${yrStem.zh}${yrBranch.zh})** ไว้อย่างครบถ้วนค่ะ\n\nคุณสามารถพิมพ์ถามเจาะลึกได้ทุกเรื่องที่อยากรู้เลยนะคะ ไม่ว่าจะเป็นเรื่องการงาน เกณฑ์เปลี่ยนงาน ความรักคู่ครอง การเงินโชคลาภ หรือสุขภาพ หรือจะแตะเลือกคำถามยอดนิยมด้านบนเพื่อเริ่มคุยกับแม่หมอได้ทันทีเลยค่ะ 😊`;

        this.askChatHistory = [
          {
            sender: 'bot',
            text: welcomeText,
            time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
          }
        ];
      }

      this.renderAskChatMessages();
    },

    escapeHtml: function (str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },

    formatChatBody: function (text) {
      if (!text) return '';
      // If text is already wrapped in <p> tags
      if (text.trim().startsWith('<p>') || text.includes('<div class="chat-')) {
        return text;
      }
      let str = text.trim();
      // Safe HTML escaping
      str = this.escapeHtml(str);
      // Markdown bold **word** -> <strong>word</strong>
      str = str.replace(/\*\*(.+?)\*\*/g, function (_, m) {
        return '<strong>' + m + '</strong>';
      });
      // Markdown italic *word* -> <em>word</em>
      str = str.replace(/\*(.+?)\*/g, function (_, m) {
        return '<em>' + m + '</em>';
      });
      // Split into paragraphs by double newline
      const paragraphs = str.split(/\n\s*\n/).filter(function (p) { return p.trim().length > 0; });
      if (paragraphs.length <= 1) {
        return '<p>' + str.replace(/\n/g, '<br>') + '</p>';
      }
      return paragraphs.map(function (p) {
        return '<p>' + p.trim().replace(/\n/g, '<br>') + '</p>';
      }).join('');
    },

    renderAskChatMessages: function () {
      const chatFeed = document.getElementById('baziAskChatFeed');
      if (!chatFeed) return;

      const c = this.currentChart;
      const ownerName = c && c.name ? c.name : 'เจ้าชะตา';

      chatFeed.innerHTML = (this.askChatHistory || []).map(msg => {
        if (msg.sender === 'user') {
          return `
            <div class="chat-message-row user-row">
              <div class="chat-message-content">
                <div class="chat-bubble-user">
                  <div class="user-bubble-text">${this.escapeHtml(msg.text)}</div>
                  <div class="chat-bubble-time">${msg.time}</div>
                </div>
              </div>
              <div class="chat-avatar user-avatar" title="${this.escapeHtml(ownerName)}">
                <i class="fa-solid fa-circle-user"></i>
              </div>
            </div>
          `;
        } else {
          const bodyHtml = this.formatChatBody(msg.text || msg.html || '');
          return `
            <div class="chat-message-row bot-row">
              <div class="chat-avatar bot-avatar" title="แม่หมอปาจื่อ">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <div class="chat-message-content">
                <div class="chat-sender-name">
                  <span>แม่หมอปาจื่อ</span>
                  <span class="chat-sender-role">ผู้เชี่ยวชาญผังดวง 4 เสา</span>
                </div>
                <div class="chat-bubble-bot">
                  <div class="bot-chat-body">
                    ${bodyHtml}
                  </div>
                  <div class="chat-bubble-time">${msg.time}</div>
                </div>
              </div>
            </div>
          `;
        }
      }).join('');

      setTimeout(() => {
        chatFeed.scrollTop = chatFeed.scrollHeight;
      }, 50);
    },

    sendAskMessage: async function () {
      const input = document.getElementById('baziAskInput');
      if (!input) return;
      const text = input.value.trim();
      if (!text) return;

      if (!this.currentChart) {
        this.showToast('กรุณากรอกวันเดือนปีเกิดก่อนถามคำถามค่ะ');
        this.switchSubMenu('basic');
        return;
      }

      const timeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';

      // Add user message
      if (!this.askChatHistory) this.askChatHistory = [];
      this.askChatHistory.push({
        sender: 'user',
        text: text,
        time: timeStr
      });
      input.value = '';

      this.renderAskChatMessages();

      // Show typing state on button and disable input
      const sendBtn = document.getElementById('baziAskSendBtn');
      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles fa-bounce"></i> <span>แม่หมอกำลังตรวจดวง...</span>';
      }

      try {
        const resp = await BaziEngine.consultAstrologerAsync(this.currentChart, text, this.selectedYear);
        const chatText = resp && resp.chatText ? resp.chatText : 'ขออภัยค่ะ ระบบไม่สามารถประมวลผลคำตอบได้ในขณะนี้ กรุณาลองถามใหม่อีกครั้งนะคะ';

        this.askChatHistory.push({
          sender: 'bot',
          text: chatText,
          time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
        });
      } catch (err) {
        console.error('Error during BaZi consultation:', err);
        this.askChatHistory.push({
          sender: 'bot',
          text: 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองส่งคำถามใหม่อีกครั้งนะคะ',
          time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
        });
      } finally {
        if (sendBtn) {
          sendBtn.disabled = false;
          sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> <span>ถามดวง</span>';
        }
        this.renderAskChatMessages();
      }
    },

    askQuickQuestion: function (query) {
      const input = document.getElementById('baziAskInput');
      if (input) input.value = query;
      this.sendAskMessage();
    },

    handleAskKeydown: function (event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.sendAskMessage();
      }
    },

    clearAskChat: function () {
      this.askChatHistory = [];
      this.renderAskView();
    },

    goToAdvance: function () {
      this.switchSubMenu('advance');
      setTimeout(() => {
        const target = document.getElementById('baziAdvanceMasterTableWrap');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 120);
    },

    toggleAdvanceInputForm: function () {
      const advInputCard = document.getElementById('baziAdvanceInputCard');
      if (advInputCard) {
        advInputCard.classList.toggle('hidden');
        if (!advInputCard.classList.contains('hidden')) {
          this.renderAdvanceInputForm();
        }
      }
    },

    renderAdvanceInputForm: function () {
      const body = document.getElementById('baziAdvanceFormBody');
      if (!body) return;
      const nameVal = document.getElementById('baziNameInput') ? document.getElementById('baziNameInput').value : 'Admin Bumji';
      const dateVal = document.getElementById('baziDateInput') ? document.getElementById('baziDateInput').value : '1977-07-23';
      const hourVal = document.getElementById('baziHourInput') ? document.getElementById('baziHourInput').value : '15:45';
      const genderVal = document.getElementById('baziGenderSelect') ? document.getElementById('baziGenderSelect').value : 'female';
      const isUnk = document.getElementById('baziUnknownTimeCheck') ? document.getElementById('baziUnknownTimeCheck').checked : false;

      body.innerHTML = `
        <div class="bazi-form-grid" style="margin-top: 10px;">
          <div class="bazi-form-field">
            <label><i class="fa-solid fa-user"></i> ชื่อลูกดวง:</label>
            <input type="text" id="baziAdvNameInput" class="bazi-control" value="${nameVal}">
          </div>
          <div class="bazi-form-field">
            <label><i class="fa-solid fa-venus-mars"></i> เพศ:</label>
            <select id="baziAdvGenderSelect" class="bazi-control">
              <option value="female" ${genderVal === 'female' ? 'selected' : ''}>♀️ หญิง (Female)</option>
              <option value="male" ${genderVal === 'male' ? 'selected' : ''}>♂️ ชาย (Male)</option>
            </select>
          </div>
          <div class="bazi-form-field">
            <label><i class="fa-solid fa-calendar-day"></i> วันเดือนปีเกิด:</label>
            <input type="date" id="baziAdvDateInput" class="bazi-control" value="${dateVal}">
          </div>
          <div class="bazi-form-field">
            <div class="bazi-time-label-row">
              <label><i class="fa-solid fa-clock"></i> เวลาเกิด:</label>
              <label class="bazi-unknown-toggle">
                <input type="checkbox" id="baziAdvUnknownCheck" ${isUnk ? 'checked' : ''}>
                <span>ไม่รู้เวลาเกิด</span>
              </label>
            </div>
            <input type="time" id="baziAdvHourInput" class="bazi-control" value="${hourVal}" ${isUnk ? 'disabled' : ''}>
          </div>
        </div>
        <div class="bazi-action-row" style="margin-top: 10px;">
          <button type="button" class="bazi-btn-primary" onclick="window.BaziApp.syncAndCalcFromAdvance()">
            <i class="fa-solid fa-wand-magic-sparkles"></i> คำนวณผังชะตา Advance
          </button>
        </div>
      `;

      const advCheck = document.getElementById('baziAdvUnknownCheck');
      const advHour = document.getElementById('baziAdvHourInput');
      if (advCheck && advHour) {
        advCheck.onchange = () => {
          advHour.disabled = advCheck.checked;
        };
      }
    },

    syncAndCalcFromAdvance: function () {
      const advName = document.getElementById('baziAdvNameInput');
      const advGender = document.getElementById('baziAdvGenderSelect');
      const advDate = document.getElementById('baziAdvDateInput');
      const advHour = document.getElementById('baziAdvHourInput');
      const advUnk = document.getElementById('baziAdvUnknownCheck');

      const nameInput = document.getElementById('baziNameInput');
      const genderSelect = document.getElementById('baziGenderSelect');
      const dateInput = document.getElementById('baziDateInput');
      const hourInput = document.getElementById('baziHourInput');
      const unknownCheck = document.getElementById('baziUnknownTimeCheck');

      if (advName && nameInput) nameInput.value = advName.value;
      if (advGender && genderSelect) genderSelect.value = advGender.value;
      if (advDate && dateInput) {
        dateInput.value = advDate.value;
        this.syncDateInputToDropdowns();
      }
      if (advHour && hourInput) {
        hourInput.value = advHour.value;
        this.syncTimeInputToDropdowns();
      }
      if (advUnk && unknownCheck) {
        unknownCheck.checked = advUnk.checked;
        this.onUnknownTimeChange();
      }

      this.calculateFromInputs(true);
      const advInputCard = document.getElementById('baziAdvanceInputCard');
      if (advInputCard) advInputCard.classList.add('hidden');
    },

    populateDateTimeDropdowns: function () {
      const daySel = document.getElementById('baziBirthDay');
      const monthSel = document.getElementById('baziBirthMonth');
      const yearSel = document.getElementById('baziBirthYear');
      const hourSel = document.getElementById('baziBirthHour');
      const minSel = document.getElementById('baziBirthMinute');

      if (daySel && daySel.options.length === 0) {
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = 'วัน';
        defaultOpt.selected = true;
        daySel.appendChild(defaultOpt);
        for (let d = 1; d <= 31; d++) {
          const opt = document.createElement('option');
          opt.value = d;
          opt.textContent = String(d);
          daySel.appendChild(opt);
        }
      }

      const thMonths = [
        'ม.ค. (มกราคม)', 'ก.พ. (กุมภาพันธ์)', 'มี.ค. (มีนาคม)', 'เม.ย. (เมษายน)',
        'พ.ค. (พฤษภาคม)', 'มิ.ย. (มิถุนายน)', 'ก.ค. (กรกฎาคม)', 'ส.ค. (สิงหาคม)',
        'ก.ย. (กันยายน)', 'ต.ค. (ตุลาคม)', 'พ.ย. (พฤศจิกายน)', 'ธ.ค. (ธันวาคม)'
      ];
      if (monthSel && monthSel.options.length === 0) {
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = 'เดือน';
        defaultOpt.selected = true;
        monthSel.appendChild(defaultOpt);
        for (let m = 1; m <= 12; m++) {
          const opt = document.createElement('option');
          opt.value = m;
          opt.textContent = `${m} - ${thMonths[m - 1]}`;
          monthSel.appendChild(opt);
        }
      }

      if (yearSel && yearSel.options.length === 0) {
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = 'ปีเกิด (พ.ศ.)';
        defaultOpt.selected = true;
        yearSel.appendChild(defaultOpt);
        const curY = new Date().getFullYear();
        for (let y = curY + 5; y >= 1920; y--) {
          const opt = document.createElement('option');
          opt.value = y;
          opt.textContent = `พ.ศ. ${y + 543} (ค.ศ. ${y})`;
          yearSel.appendChild(opt);
        }
      }

      if (hourSel && hourSel.options.length === 0) {
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = 'ชั่วโมง';
        defaultOpt.selected = true;
        hourSel.appendChild(defaultOpt);
        for (let h = 0; h <= 23; h++) {
          const opt = document.createElement('option');
          opt.value = h;
          opt.textContent = `${String(h).padStart(2, '0')} น.`;
          hourSel.appendChild(opt);
        }
      }

      if (minSel && minSel.options.length === 0) {
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = 'นาที';
        defaultOpt.selected = true;
        minSel.appendChild(defaultOpt);
        for (let mi = 0; mi <= 59; mi++) {
          const opt = document.createElement('option');
          opt.value = mi;
          opt.textContent = `${String(mi).padStart(2, '0')} นาที`;
          minSel.appendChild(opt);
        }
      }
    },

    syncDateInputToDropdowns: function () {
      const dateInput = document.getElementById('baziDateInput');
      const daySel = document.getElementById('baziBirthDay');
      const monthSel = document.getElementById('baziBirthMonth');
      const yearSel = document.getElementById('baziBirthYear');
      if (!dateInput || !dateInput.value) {
        if (daySel) daySel.value = '';
        if (monthSel) monthSel.value = '';
        if (yearSel) yearSel.value = '';
        return;
      }
      const parts = dateInput.value.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const d = parseInt(parts[2], 10);
        if (yearSel) yearSel.value = y;
        if (monthSel) monthSel.value = m;
        if (daySel) daySel.value = d;
      }
    },

    syncDropdownsToDateInput: function () {
      const dateInput = document.getElementById('baziDateInput');
      const daySel = document.getElementById('baziBirthDay');
      const monthSel = document.getElementById('baziBirthMonth');
      const yearSel = document.getElementById('baziBirthYear');
      if (!dateInput || !daySel || !monthSel || !yearSel) return;
      if (!yearSel.value || !monthSel.value || !daySel.value) {
        dateInput.value = '';
        return;
      }
      const y = yearSel.value;
      const m = String(monthSel.value).padStart(2, '0');
      const d = String(daySel.value).padStart(2, '0');
      dateInput.value = `${y}-${m}-${d}`;
    },

    syncTimeInputToDropdowns: function () {
      const hourInput = document.getElementById('baziHourInput');
      const hourSel = document.getElementById('baziBirthHour');
      const minSel = document.getElementById('baziBirthMinute');
      if (!hourInput || !hourInput.value) {
        if (hourSel) hourSel.value = '';
        if (minSel) minSel.value = '';
        return;
      }
      const parts = hourInput.value.split(':');
      if (parts.length >= 2) {
        const h = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        if (hourSel) hourSel.value = isNaN(h) ? '' : h;
        if (minSel) minSel.value = isNaN(m) ? '' : m;
      }
    },

    syncDropdownsToTimeInput: function () {
      const hourInput = document.getElementById('baziHourInput');
      const hourSel = document.getElementById('baziBirthHour');
      const minSel = document.getElementById('baziBirthMinute');
      if (!hourInput || !hourSel || !minSel) return;
      if (hourSel.value === '' || minSel.value === '') {
        return;
      }
      const h = String(hourSel.value).padStart(2, '0');
      const m = String(minSel.value).padStart(2, '0');
      hourInput.value = `${h}:${m}`;
    },

    onUnknownTimeChange: function () {
      const check = document.getElementById('baziUnknownTimeCheck');
      const isUnknown = !!(check && check.checked);
      const timeWrap = document.getElementById('baziTimeControlsWrap');
      const hourInput = document.getElementById('baziHourInput');
      const hourSel = document.getElementById('baziBirthHour');
      const minSel = document.getElementById('baziBirthMinute');
      const notice = document.getElementById('baziUnknownTimeNotice');

      if (timeWrap) timeWrap.classList.toggle('disabled-inputs', isUnknown);
      if (hourInput) hourInput.disabled = isUnknown;
      if (hourSel) hourSel.disabled = isUnknown;
      if (minSel) minSel.disabled = isUnknown;
      if (notice) notice.classList.toggle('hidden', !isUnknown);
    },


    generateDeepInsights: function (chart) {
      if (!chart || !chart.dayMaster) {
        return {
          traits: '-', career: '-', wealth: '-', love: '-', health: '-', weakness: '-'
        };
      }

      const dm = chart.dayMaster.zh;
      const dmTh = chart.dayMaster.th;
      const dmElem = chart.dayMaster.element;
      const gender = chart.gender || 'female';
      const isFemale = (gender === 'female' || gender === 'หญิง');
      const isStrong = !!chart.isStrong;

      const elemPct = chart.elementPercentages || {};
      const firePct = elemPct.fire || 0;
      const waterPct = elemPct.water || 0;
      const metalPct = elemPct.metal || 0;
      const woodPct = elemPct.wood || 0;
      const earthPct = elemPct.earth || 0;

      const stems = ['year', 'month', 'day', 'hour'].map(k => chart.pillars[k] && chart.pillars[k].stem ? chart.pillars[k].stem.zh : '');
      const branches = ['year', 'month', 'day', 'hour'].map(k => chart.pillars[k] && chart.pillars[k].branch ? chart.pillars[k].branch.zh : '');

      // Ten Gods Knowledge Base
      const baziTG = (typeof window !== 'undefined' && window.BaziTenGodsDB) ? window.BaziTenGodsDB : ((typeof globalThis !== 'undefined' && globalThis.BaziTenGodsDB) ? globalThis.BaziTenGodsDB : null);
      const baziMarriage = (typeof window !== 'undefined' && window.BaziMarriageDB) ? window.BaziMarriageDB : ((typeof globalThis !== 'undefined' && globalThis.BaziMarriageDB) ? globalThis.BaziMarriageDB : null);
      const baziElemCareer = (typeof window !== 'undefined' && window.BaziElementsCareerDB) ? window.BaziElementsCareerDB : ((typeof globalThis !== 'undefined' && globalThis.BaziElementsCareerDB) ? globalThis.BaziElementsCareerDB : null);

      // Ten Gods Counting in Natal Chart (Stems + Hidden Stems)
      const tenGodCounts = {};
      ['year', 'month', 'hour'].forEach(k => {
        const p = chart.pillars[k];
        if (p && p.tenGod && p.tenGod.zh && p.tenGod.zh !== '日主') {
          tenGodCounts[p.tenGod.zh] = (tenGodCounts[p.tenGod.zh] || 0) + 1;
        }
      });
      ['year', 'month', 'day', 'hour'].forEach(k => {
        const p = chart.pillars[k];
        if (p && p.hiddenStems) {
          p.hiddenStems.forEach(h => {
            if (h.tenGod && h.tenGod.zh) {
              tenGodCounts[h.tenGod.zh] = (tenGodCounts[h.tenGod.zh] || 0) + (h.weight >= 0.25 ? 1 : 0.5);
            }
          });
        }
      });

      // Key configurations & patterns from docs_private
      const hasZhengGuan = (tenGodCounts['正官'] || 0) >= 0.8;
      const hasQiSha = ((tenGodCounts['七殺'] || 0) + (tenGodCounts['七杀'] || 0)) >= 0.8;
      const isGuanShaHunZa = hasZhengGuan && hasQiSha;

      const outputCount = (tenGodCounts['傷官'] || 0) + (tenGodCounts['伤官'] || 0) + (tenGodCounts['食神'] || 0);
      const outputElemMap = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' };
      const outputElem = outputElemMap[dmElem];
      const outputPct = elemPct[outputElem] || 0;
      const hasStrongOutput = outputPct >= 35 || outputCount >= 2.5;

      // Stems combines (การฮะก้านฟ้า จาก การฮะ.pdf)
      const stemCombines = [];
      if (stems.includes('丙') && stems.includes('辛')) stemCombines.push('ก้านฟ้าทำปฏิกิริยา "เปี้ย-ซิง ฮะ" (丙辛合) ดึงดูดอำนาจ เสน่ห์บารมี และจิตวิทยาในการโน้มน้าวผู้คน');
      if (stems.includes('丁') && stems.includes('壬')) stemCombines.push('ก้านฟ้าทำปฏิกิริยา "เต็ง-ยิ้ม ฮะ" (丁壬合) นำมาซึ่งความอ่อนโยน เมตตา และสติปัญญาหยั่งรู้');
      if (stems.includes('戊') && stems.includes('癸')) stemCombines.push('ก้านฟ้าทำปฏิกิริยา "โบ่ว-กุ่ย ฮะ" (戊癸合) เสริมเสน่ห์ ความอบอุ่น และมิตรไมตรี');
      if (stems.includes('甲') && stems.includes('己')) stemCombines.push('ก้านฟ้าทำปฏิกิริยา "กะ-กี้ ฮะ" (甲己合) เสริมความซื่อสัตย์ ความน่าเชื่อถือ และคุณธรรม');
      if (stems.includes('乙') && stems.includes('庚')) stemCombines.push('ก้านฟ้าทำปฏิกิริยา "อิก-แก ฮะ" (乙庚合) เสริมความเด็ดขาด ความชอบธรรม และความยุติธรรม');

      // Top dominant Ten God
      const sortedGods = Object.entries(tenGodCounts).sort((a, b) => b[1] - a[1]);
      const topGodZh = sortedGods.length > 0 ? sortedGods[0][0] : null;
      const topGodInfo = (baziTG && topGodZh) ? baziTG.getGodInfo(topGodZh) : null;

      // 1. Traits (อุปนิสัยและแก่นแท้จิตวิญญาณ จากคลาสเรียนที่ 2 และ LQ 101)
      const DM_NATURE = {
        '甲': 'เปรียบดั่งต้นไม้ใหญ่ ยืนต้นสูงตระหง่าน หนักแน่น มั่นคง ตรงไปตรงมา รักเกียรติยศ มีภาวะผู้นำโดยกำเนิด',
        '乙': 'เปรียบดั่งเถาวัลย์และพืชพรรณ ยืดหยุ่นสูง ปรับตัวเก่ง มีเสน่ห์ อ่อนโยนแต่เข้มแข็ง เอาตัวรอดได้ในทุกสถานการณ์',
        '丙': 'เปรียบดั่งดวงอาทิตย์ อบอุ่น เปิดเผย ชัดเจน กระตือรือร้น ใจกว้าง รักความยุติธรรม ชอบช่วยเหลือผู้อื่น',
        '丁': 'เปรียบดั่งเปลวเทียนและแสงประทีป สติปัญญาหยั่งรู้ สุขุม ลุ่มลึก อบอุ่น มีเอกลักษณ์ ช่างสังเกตและประณีต',
        '戊': 'เปรียบดั่งขุนเขาและผืนแผ่นดินใหญ่ หนักแน่น มั่นคง ซื่อสัตย์ เก็บความลับเก่ง มีความอดทนสูง เป็นที่พึ่งพา',
        '己': 'เปรียบดั่งดินเพาะปลูก นุ่มนวล โอบอ้อมอารี ปรับตัวเข้ากับทุกคนได้ดี มีจิตใจฟูมฟักดูแลและบริการ',
        '庚': 'เปรียบดั่งเหล็กกล้าและดาบ เด็ดเดี่ยว ชัดเจน กล้าหาญ มุ่งมั่น มีพลังในการตัดสินใจ บุกเบิก และชอบความยุติธรรม',
        '辛': 'เปรียบดั่งอัญมณีและทองคำขาว ประณีต งดงาม รสนิยมสูง รักศักดิ์ศรีและความถูกต้อง ละเอียดอ่อน ฉลาดลึกซึ้ง',
        '壬': 'เปรียบดั่งมหาสมุทรและสายน้ำใหญ่ คล่องแคล่ว ปัญญาฉับไว กว้างไกล ไม่หยุดนิ่ง เชื่อมโยงผู้คนเก่ง',
        '癸': 'เปรียบดั่งละอองฝนและหยาดน้ำค้าง จิตใจละเอียดอ่อน ลึกซึ้ง มีญาณสัมผัส ปรับตัวเก่ง เงียบสงบแต่อ่อนโยน'
      };

      const dmNatureDesc = DM_NATURE[dm] || 'มีเอกลักษณ์เฉพาะตัว เปี่ยมด้วยความมุ่งมั่นและความตั้งใจจริง';
      let traits = `ดิถี${dmTh} (${dm}) ${dmNatureDesc}`;

      if (isGuanShaHunZa) {
        traits += ` ทั้งยังมีโครงสร้าง "กัวสัวะปะปน" (官杀混杂) จึงรวมเอาความสุขุม มีวินัย รักเกียรติยศ (เจียกัว) เข้ากับความเด็ดเดี่ยว กล้าลุย ไม่ยอมก้มหัวให้ใคร (ฉิกสัวะ) เป็นคนภายนอกดูสง่างาม แต่ภายในใจเด็ดเดี่ยว ใจสู้ เป็นเสาหลักที่แบกรับภาระหน้าที่และความรับผิดชอบรอบตัว`;
      } else if (hasStrongOutput) {
        traits += ` ผสานกับพลังดาวถ่ายเท (เจี๊ยะซิ้ง/เซียกัว) หนาแน่นถึง ${outputPct}% เป็นคนเปี่ยมด้วยสติปัญญาไหวพริบ ความคิดสร้างสรรค์ลึกซึ้ง มีไอเดียแปลกใหม่ไม่ซ้ำใคร คารมคมคาย ช่างสังเกต ละเมียดละไม รักอิสระ และไม่ชอบการถูกตีกรอบหรือบงการ`;
      } else if (topGodInfo) {
        traits += ` ผสานกับพลังสิบเทพเด่น "${topGodInfo.thai} (${topGodInfo.translation})": ${topGodInfo.coreNature}`;
      }

      if (stemCombines.length > 0) {
        traits += ` • ${stemCombines.join(' และ ')}`;
      }

      if (isStrong) {
        traits += ` • สถานะดิถีแข็งแรง (身强): มีความเชื่อมั่นในตนเองสูง เด็ดขาด ชัดเจน มีภาวะผู้นำ ไม่ชอบการถูกบงการ และพึ่งพาตนเองเป็นหลัก`;
      } else {
        traits += ` • สถานะดิถีอ่อนกำลัง (身弱): มีความยืดหยุ่น ประนีประนอมสูง ปรับตัวเก่ง มีน้ำใจโอบอ้อมอารีและเห็นอกเห็นใจผู้อื่น แต่ต้องแบกรับภาระหน้าที่รอบตัวสูง`;
      }

      // 2. Career (เส้นทางอาชีพและศักยภาพสูงสุด)
      let career = '';
      if (topGodInfo && topGodInfo.suitableCareers && topGodInfo.suitableCareers.length > 0) {
        const careerList = topGodInfo.suitableCareers.slice(0, 5).join(', ');
        career = `มีพลังสิบเทพเด่น "${topGodInfo.thai}" หนุนนำให้โดดเด่นในสายงาน ${careerList} (${topGodInfo.careerDescription})`;
      } else {
        career = `เหมาะกับบทบาทผู้นำ ผู้บริหาร ที่ปรึกษา ผู้เชี่ยวชาญเฉพาะทาง หรือเจ้าของธุรกิจส่วนตัว`;
      }

      if (chart.favorableElements && chart.favorableElements.length > 0 && baziElemCareer) {
        const favElemThai = chart.favorableElements.map(e => {
          const eName = e === 'wood' ? 'Wood' : (e === 'fire' ? 'Fire' : (e === 'earth' ? 'Earth' : (e === 'metal' ? 'Metal' : 'Water')));
          const eInfo = baziElemCareer.getElementCareer(eName);
          return eInfo ? eInfo.elementThai : e;
        }).join(' และ ');
        career += ` • เสริมด้วยธาตุให้คุณ (喜用神) "${favElemThai}": หนุนนำให้เจริญรุ่งเรืองอย่างยิ่งในอุตสาหกรรมนวัตกรรม กลยุทธ์ การศึกษา การวางแผน งานวิชาการ หรือธุรกิจเฉพาะทาง`;
      }

      // 3. Wealth (โชคลาภ การเงิน และการสะสมทรัพย์)
      let wealth = '';
      if (!isStrong) {
        wealth = `โครงสร้างดิถีอ่อนกำลัง มีกระแสเงินทองหมุนเวียนก้อนใหญ่ตลอดเวลา มักมีรายได้เข้ามาจากความสามารถเฉพาะตัวและโอกาสรอบด้าน แต่เนื่องจากภาระและความรับผิดชอบรอบตัวมีมาก ทำให้เงินทองเข้าเร็วและมีเหตุจำเป็นต้องหมุนเวียนออกไปเร็วเช่นกัน (财多身弱 / แบกรับภาระรอบตัว) กลยุทธ์การเงินที่ดีที่สุดคือ "ไม่ควรเก็บเป็นเงินสดไว้ติดบัญชีเกินความจำเป็น" แต่ควรแปลงเป็นสินทรัพย์ถาวร เช่น อสังหาริมทรัพย์ ที่ดิน สลากออมทรัพย์ หรือทองคำแท่งทันทีที่ได้รับเงินมา จะช่วยเก็บกักความมั่งคั่งได้อย่างยั่งยืน และหลีกเลี่ยงการค้ำประกันหรือให้ผู้อื่นหยิบยืมเงิน`;
      } else {
        wealth = `โครงสร้างดิถีแข็งแรง มีศักยภาพในการกุมทรัพย์และบริหารจัดการต่อยอดผลกำไรได้อย่างมีประสิทธิภาพ มีความเด็ดขาด กล้าได้กล้าเสียในการลงทุน และสร้างฐานะได้ด้วยลำแข้งของตนเอง ระวังเพียงความมั่นใจที่สูงเกินไปหรือการตัดสินใจด่วนได้ ควรตั้งจุดตัดขาดทุน (Stop-loss) ก่อนลงเงินก้อนใหญ่เสมอ`;
      }

      const earthBranches = branches.filter(b => ['辰', '戌', '丑', '未'].includes(b));
      if (earthBranches.length >= 2) {
        wealth += ` ในผังชะตามีกิ่งดินคลังทรัพย์ (${earthBranches.join(' / ')}) บ่งบอกถึงศักยภาพในการกักเก็บทรัพย์สิน มีโอกาสถือครองสินทรัพย์ที่ดินหรือมรดกตกทอดอย่างมั่นคง`;
      }

      // 4. Love & Marriage (ว่าด้วยคู่ครอง)
      let love = '';
      const dayB = branches[2] || '';
      if (baziMarriage) {
        const mRes = baziMarriage.analyzeMarriage(gender, dm, dayB, tenGodCounts, []);
        let spouseStarText = '';
        if (mRes.findings && mRes.findings.length > 0) {
          const f = mRes.findings[0];
          spouseStarText = `${f.star ? f.star + ' ' : ''}${f.role ? f.role + ': ' : ''}${f.manifestation}`;
        }

        let palaceText = '';
        if (mRes.affinity) {
          palaceText += ` • ${mRes.affinity.title}: ${mRes.affinity.meaning}`;
        }

        const dayBObj = BRANCHES.find(b => b.zh === dayB);
        if (dayBObj) {
          const bElem = dayBObj.element;
          if (ELEMENTS_META[bElem].generates === dmElem) {
            palaceText += ' • เรือนคู่ครองให้กำเนิดดิถี: คู่ครองคอยดูแลเอาใจใส่เกื้อหนุนชีวิตเป็นอย่างดี';
          } else if (ELEMENTS_META[dmElem].generates === bElem) {
            palaceText += ' • เรือนคู่ครองเป็นธาตุถ่ายเท: เจ้าชะตาเป็นฝ่ายทุ่มเทดูแลเอาใจใส่คู่ครอง ยอมเสียสละเพื่อครอบครัว';
          } else if (ELEMENTS_META[bElem].controls === dmElem) {
            palaceText += ' • เรือนคู่ครองพิฆาตดิถี: คู่ครองมีความเป็นผู้นำสูง หรือมีบุคลิกเด็ดเดี่ยว';
          }
        }

        love = `ว่าด้วยคู่ครอง (${mRes.spouseStarTitle}): ${spouseStarText}${palaceText} การครองคู่ที่ดีจึงต้องใช้ความเข้าใจ ให้อิสระทางความคิด และชวนกันเดินทางท่องเที่ยวเปลี่ยนบรรยากาศ`;
      } else {
        love = isFemale
          ? `ความสัมพันธ์เน้นความเข้าใจ การให้เกียรติซึ่งกันและกัน และการมีพื้นที่ส่วนตัวทางความคิด`
          : `ความสัมพันธ์เน้นความอบอุ่น การเป็นผู้นำครอบครัวที่ดี และการสนับสนุนภรรยาอย่างจริงใจ`;
      }

      // 5. Health (สุขภาพและสมดุลเบญจธาตุ)
      const maxElem = Object.entries(elemPct).sort((a, b) => b[1] - a[1])[0] || ['earth', 20];
      const elemHealthMap = {
        fire: 'ระบบหัวใจ หลอดเลือด ความดันโลหิต สายตา อาการไมเกรน และภาวะตึงเครียดนอนไม่หลับจากความคิดที่แล่นตลอดเวลา แนะนำให้ดื่มน้ำสะอาดให้เพียงพอและฝึกสมาธิคลายเครียด',
        water: 'ระบบทางเดินปัสสาวะ ไต ระบบสืบพันธุ์ และระบบฮอร์โมนสตรี/บุรุษ ควรรักษาร่างกายให้อบอุ่นและหลีกเลี่ยงความหนาวชื้น',
        wood: 'ระบบตับ ถุงน้ำดี กล้ามเนื้อ เส้นเอ็น และความตึงเครียดของระบบประสาท ควรยืดเหยียดร่างกายและพักผ่อนในธรรมชาติสีเขียว',
        earth: 'ระบบกระเพาะอาหาร ม้าม ระบบย่อยอาหาร และกล้ามเนื้อ ควรทานอาหารให้ตรงเวลาและหลีกเลี่ยงความเครียดสะสม',
        metal: 'ระบบปอด หลอดลม ทางเดินหายใจ ภูมิแพ้ และผิวหนัง ควรหลีกเลี่ยงฝุ่นควันและฝึกการหายใจลึกๆ'
      };

      const maxElemMeta = ELEMENTS_META[maxElem[0]] || { th: 'ธาตุประจำตัว' };
      const health = `ตามสมดุลเบญจธาตุ: ${maxElemMeta.th}มีพลังเข้มข้นที่สุดในดวง (${maxElem[1]}%) จุดที่ต้องดูแลเป็นพิเศษคือ: ${elemHealthMap[maxElem[0]] || 'การพักผ่อนให้เพียงพอ'}`;

      // 6. Weaknesses & Metaphysical Remedies (จุดอ่อนและเคล็ดลับการแก้ดวง 3 ด้าน)
      const weakness = `
        <div style="display: flex; flex-direction: column; gap: 10px; font-size: 13px; line-height: 1.6;">
          <div>
            <strong style="color: #b91c1c;"><i class="fa-solid fa-coins"></i> 1. จุดอ่อนการเงิน (${!isStrong ? 'เก็บเงินสดไม่อยู่ / ภาระรอบตัว' : 'ความเสี่ยงในการลงทุน'}):</strong> 
            ${!isStrong
          ? `ดิถีอ่อนกำลังเผชิญภาระรอบตัวมาก เงินทองหมุนเวียนก้อนใหญ่ มีรายได้เข้ามาต่อเนื่องแต่มีเหตุให้ต้องใช้จ่ายหรือช่วยเหลือคนรอบข้าง ทำให้เก็บเงินสดติดบัญชียาก
                 <br><span style="color: #047857; font-weight: 600;">★ เคล็ดลับแก้ดวง:</span> ห้ามถือเงินสดติดบัญชีเกินจำเป็น ต้องบังคับแปลงเป็นสินทรัพย์ถาวร (ที่ดิน อสังหาริมทรัพย์ สลากออมทรัพย์ หรือทองคำแท่ง) ทันทีที่ได้กำไรมา`
          : `มีความเชื่อมั่นในตนเองสูงและกล้าได้กล้าเสียในการลงทุน แต่ต้องระวังการตัดสินใจที่ด่วนได้หรือทุ่มหมดหน้าตักในจังหวะที่ใจร้อน
                 <br><span style="color: #047857; font-weight: 600;">★ เคล็ดลับแก้ดวง:</span> ตั้งเกณฑ์จุดตัดขาดทุน (Stop-loss) ก่อนลงเงินก้อนใหญ่เสมอ และกระจายความเสี่ยงในสินทรัพย์มั่นคง`}
          </div>
          <div>
            <strong style="color: #b91c1c;"><i class="fa-solid fa-heart-crack"></i> 2. จุดอ่อนความรัก (${isGuanShaHunZa ? 'ดวงหญิงแกร่ง / รักซับซ้อน' : (hasStrongOutput ? 'มาตรฐานสูง / รักอิสระ' : 'การสื่อสารและเวลา')}):</strong> 
            ${isGuanShaHunZa
          ? `โครงสร้าง "กัวสัวะปะปน" (官杀混杂) เป็นหญิงเก่งพึ่งพาตนเองได้สูง มีเสน่ห์ต่อเพศตรงข้าม แต่คนรักมักมีอัตตาสูงหรือชอบบงการ เมื่อ "แกร่งชนแกร่ง" จึงเกิดความอึดอัดขัดแย้งได้ง่าย ดวงนี้พึ่งพาตนเองได้ดีกว่าพึ่งพาคู่ครอง
                 <br><span style="color: #047857; font-weight: 600;">★ เคล็ดลับแก้ดวง:</span> ควรครองคู่แบบมีระยะห่างทางความคิด มีพื้นที่ส่วนตัว ไม่ก้าวก่ายงานของกันและกัน หรือแต่งงานช้าจะราบรื่นกว่า`
          : (hasStrongOutput
            ? `ดาวถ่ายเท (ปัญญาและความคิดสร้างสรรค์) มีกำลังสูง เป็นคนมีมาตรฐานและความคาดหวังในตัวคนรักค่อนข้างสูง เมื่อคนรักทำอะไรไม่ตรงใจอาจเกิดความอึดอัดหรือไม่สบอารมณ์
                     <br><span style="color: #047857; font-weight: 600;">★ เคล็ดลับแก้ดวง:</span> สื่อสารความรู้สึกด้วยความนุ่มนวล ลดความคาดหวังในเรื่องเล็กๆ น้อยๆ และชื่นชมข้อดีของคนรักอย่างสม่ำเสมอ`
            : `การทุ่มเทเวลากับภาระหน้าที่และความรับผิดชอบอาจทำให้บรรยากาศความสัมพันธ์ตึงเครียดหรือขาดเวลาคุณภาพร่วมกัน
                     <br><span style="color: #047857; font-weight: 600;">★ เคล็ดลับแก้ดวง:</span> ใช้การสื่อสารที่นุ่มนวล ชื่นชมคู่ครอง และชวนกันเดินทางท่องเที่ยวเปลี่ยนบรรยากาศเพื่อกระชับความผูกพัน`)}
          </div>
          <div>
            <strong style="color: #b91c1c;"><i class="fa-solid fa-triangle-exclamation"></i> 3. จุดอ่อนด้านจิตใจและสุขภาพ:</strong> 
            เป็นเสาหลักที่แบกรับความรับผิดชอบจนเหนื่อยล้า พักผ่อนน้อย ความคิดแล่นตลอดเวลา จุดที่ควรระวังคือ ${elemHealthMap[maxElem[0]] || 'การพักผ่อน'}
            <br><span style="color: #047857; font-weight: 600;">★ เคล็ดลับเสริมดวง:</span> จัดสภาพแวดล้อมและที่อยู่อาศัยให้โปร่งโล่ง ฝึกการทำสมาธิคลายความกังวล และปล่อยวางเรื่องที่ควบคุมไม่ได้
          </div>
        </div>
      `;

      return { traits, career, wealth, love, health, weakness };
    },

    renderBasicSuite: function (chart) {
      if (!chart) return;
      this.renderBasicFourPillars(chart);
      this.renderBasicElementsPieChart(chart);
      this.renderBasicAgeCallout(chart);
      this.renderBasicSpiderChart(chart);
      this.renderBasicCurrentDaYun(chart);
      this.renderBasicCurrentAnnual(chart);
      this.renderBasicFengShui(chart);

      // Populate text insights with Deep Contextual Metaphysical Engine
      const deep = this.generateDeepInsights(chart);
      const setEl = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text || '-';
      };
      setEl('baziTraitsText', deep.traits);
      setEl('baziCareerText', deep.career);
      setEl('baziWealthText', deep.wealth);
      setEl('baziLoveText', deep.love);
      setEl('baziHealthText', deep.health);

      const weaknessEl = document.getElementById('baziWeaknessText');
      if (weaknessEl && deep.weakness) {
        weaknessEl.innerHTML = deep.weakness;
      }
    },

    renderBasicFourPillars: function (chart) {
      const container = document.getElementById('baziBasicPillarsTable');
      if (!container || !chart) return;
      const isUnknown = !!chart.isUnknownTime;
      const p = chart.pillars;
      const cols = [
        { key: 'hour', title: 'ยาม (Hour)', pillar: p.hour, isUnknown },
        { key: 'day', title: 'วัน (Day)', pillar: p.day, isDM: true },
        { key: 'month', title: 'เดือน (Month)', pillar: p.month },
        { key: 'year', title: 'ปี (Year)', pillar: p.year }
      ];

      const tgAbbrMap = {
        '比肩': 'F', '劫財': 'RW', '食神': 'EG', '傷官': 'HO',
        '偏財': 'IW', '正財': 'DW', '七殺': '7K', '正官': 'DO',
        '偏印': 'IR', '正印': 'DR'
      };

      container.innerHTML = `
        <table class="bazi-basic-table">
          <thead>
            <tr>
              <th class="bazi-basic-row-label">เสาชะตา</th>
              ${cols.map(c => `
                <th class="${c.isDM ? 'th-day-master' : ''}">
                  <div style="font-size: 14px; font-weight: 700;">${c.title}</div>
                  ${c.isDM ? '<span class="basic-dm-crown"><i class="fa-solid fa-crown"></i> ดิถีธาตุ (ตัวตน)</span>' : ''}
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            <!-- Row: Heavenly Stem (ราศีบน) -->
            <tr>
              <td class="bazi-basic-row-label">
                <strong>Heavenly Stem</strong><br><small style="color: #94a3b8; font-size: 11px;">ราศีบน / กิ่งฟ้า</small>
              </td>
              ${cols.map(c => {
        if (c.isUnknown) {
          return `<td><div class="basic-unknown-hour"><i class="fa-solid fa-circle-question"></i> ไม่ระบุเวลา</div></td>`;
        }
        const s = c.pillar.stem;
        const meta = ELEMENTS_META[s.element];
        return `
                  <td>
                    <div class="basic-pillar-cell">
                      <span class="basic-stem-char" style="color: ${meta.color};">${s.zh}</span>
                      <span class="basic-stem-py">${s.py}</span>
                      <span class="basic-element-badge" style="background: ${meta.lightBg}; color: ${meta.color}; border: 1px solid ${meta.border};">
                        ${meta.th} (${s.polarity === 'yang' ? 'หยาง' : 'หยิน'})
                      </span>
                    </div>
                  </td>
                `;
      }).join('')}
            </tr>

            <!-- Row: Earth Branch (ราศีล่าง) -->
            <tr>
              <td class="bazi-basic-row-label">
                <strong>Earth Branch</strong><br><small style="color: #94a3b8; font-size: 11px;">ราศีล่าง / กิ่งดิน</small>
              </td>
              ${cols.map(c => {
        if (c.isUnknown) {
          return `<td><div class="basic-unknown-hour"><i class="fa-solid fa-circle-question"></i> ไม่ระบุเวลา</div></td>`;
        }
        const b = c.pillar.branch;
        const meta = ELEMENTS_META[b.element];
        return `
                  <td>
                    <div class="basic-pillar-cell">
                      <span class="basic-branch-char" style="color: ${meta.color};">${b.zh}</span>
                      <span class="basic-branch-py">${b.py} • ${b.zodiac ? b.zodiac.split(' ')[0] : b.animal}</span>
                      <span class="basic-element-badge" style="background: ${meta.lightBg}; color: ${meta.color}; border: 1px solid ${meta.border};">
                        ${meta.th} (${b.polarity === 'yang' ? 'หยาง' : 'หยิน'})
                      </span>
                    </div>
                  </td>
                `;
      }).join('')}
            </tr>

            <!-- Row 3: Hidden Stem (ราศีแฝง) -->
            <tr>
              <td class="bazi-basic-row-label">
                <strong>Hidden Stem</strong><br><small style="color: #94a3b8; font-size: 11px;">ราศีแฝง / กิ่งฟ้าแฝง</small>
              </td>
              ${cols.map(c => {
        if (c.isUnknown) return `<td><div class="basic-unknown-hour">-</div></td>`;
        const b = c.pillar.branch;
        return `
                  <td>
                    <div class="bazi-hhs-row">
                      ${b.hidden.map(h => {
          const sObj = STEMS.find(s => s.zh === h.stem) || STEMS[0];
          const tg = getTenGod(chart.dayMaster, sObj);
          const abbr = tgAbbrMap[tg.zh] || 'F';
          return `
                          <div class="bazi-hhs-badge stem-bg-${sObj.element}" title="${tg.th} (${sObj.zh})">
                            <span style="font-size: 10px; opacity: 0.85;">${sObj.py}</span>
                            <span style="font-size: 14px; font-weight: 800;">${sObj.zh}</span>
                            <span style="font-size: 10px; font-weight: 700;">${abbr}</span>
                          </div>
                        `;
        }).join('')}
                    </div>
                  </td>
                `;
      }).join('')}
            </tr>

            <!-- Row 4: Nayin (ธาตุนาอิม) -->
            <tr>
              <td class="bazi-basic-row-label">
                <strong>Nayin</strong><br><small style="color: #94a3b8; font-size: 11px;">ธาตุนาอิม / นัปอิม</small>
              </td>
              ${cols.map(c => {
        if (c.isUnknown) return `<td><div class="basic-unknown-hour">-</div></td>`;
        const sIdx = STEMS.findIndex(s => s.zh === c.pillar.stem.zh);
        const bIdx = BRANCHES.findIndex(b => b.zh === c.pillar.branch.zh);
        const ny = this.getNaYinDetail(sIdx, bIdx);
        return `
                  <td>
                    <div class="bazi-nayin-ribbon nayin-bg-${ny.element}" title="${ny.zh} (${ny.th})">
                      <div style="font-size: 11.5px; font-weight: 800;">${ny.en}</div>
                      <div style="font-size: 10.5px; opacity: 0.95;">${ny.zh} (${ny.th})</div>
                    </div>
                  </td>
                `;
      }).join('')}
            </tr>

            <!-- Row 5: DM Qi Phase (สภาวะชีพเทียบดิถี) -->
            <tr>
              <td class="bazi-basic-row-label">
                <strong>DM Qi Phase</strong><br><small style="color: #94a3b8; font-size: 11px;">12 วงจรชีพเทียบดิถี</small>
              </td>
              ${cols.map(c => {
        if (c.isUnknown) return `<td><div class="basic-unknown-hour">-</div></td>`;
        const p = this.get12LifeStage(chart.dayMaster.zh, c.pillar.branch.zh);
        return `
                  <td class="bazi-phase-cell" style="text-align: center;">
                    <div style="font-weight: 800; font-size: 12px; color: #1e293b;">${p.order}. ${p.en}</div>
                    <div style="font-size: 11px; color: #64748b;">${p.py} / ${p.zh} <strong style="color: #7c3aed; font-size: 12px;">${p.symbol}</strong></div>
                  </td>
                `;
      }).join('')}
            </tr>

            <!-- Row 6: Pillar Qi Phase (สภาวะชีพประจำเสา) -->
            <tr>
              <td class="bazi-basic-row-label">
                <strong>Pillar Qi Phase</strong><br><small style="color: #94a3b8; font-size: 11px;">12 วงจรชีพประจำเสา</small>
              </td>
              ${cols.map(c => {
        if (c.isUnknown) return `<td><div class="basic-unknown-hour">-</div></td>`;
        const p = this.get12LifeStage(c.pillar.stem.zh, c.pillar.branch.zh);
        return `
                  <td class="bazi-phase-cell" style="text-align: center;">
                    <div style="font-weight: 800; font-size: 12px; color: #1e293b;">${p.order}. ${p.en}</div>
                    <div style="font-size: 11px; color: #64748b;">${p.py} / ${p.zh} <strong style="color: #7c3aed; font-size: 12px;">${p.symbol}</strong></div>
                  </td>
                `;
      }).join('')}
            </tr>
          </tbody>
        </table>
      `;
    },

    renderBasicElementsPieChart: function (chart, targetContainerId) {
      if (!chart) return;
      const targetIds = targetContainerId ? [targetContainerId] : ['baziElementsPieCard', 'baziAdvanceElementsPieCard'];
      const containers = targetIds.map(id => document.getElementById(id)).filter(Boolean);
      if (containers.length === 0) return;

      const elemKeys = ['earth', 'fire', 'metal', 'wood', 'water'];
      const favList = chart.favorableElements || [];
      const dm = chart.dayMaster || (chart.pillars && chart.pillars.day ? chart.pillars.day.stem : null) || { element: 'fire', polarity: 'yin', zh: '丁' };
      const dmElem = dm.element;

      // 1. Five Roles relative to Day Master (Friend, Output, Wealth, Power, Resource)
      const getRoleName = (targetElem) => {
        if (targetElem === dmElem) return 'Friend';
        if (ELEMENTS_META[dmElem].generates === targetElem) return 'Output';
        if (ELEMENTS_META[dmElem].controls === targetElem) return 'Wealth';
        if (ELEMENTS_META[targetElem].controls === dmElem) return 'Power';
        if (ELEMENTS_META[targetElem].generates === dmElem) return 'Resource';
        return 'Friend';
      };

      // 2. Standard Ten Gods Abbreviations (EG, HO, DW, IW, DO, 7K, DR, IR, F, RW)
      const getTenGodAbbr = (targetStem) => {
        const tg = getTenGod(dm, targetStem);
        if (!tg || !tg.zh) return '-';
        const map = {
          '比肩': 'F',
          '劫財': 'RW',
          '食神': 'EG',
          '傷官': 'HO',
          '偏財': 'IW',
          '正財': 'DW',
          '七殺': '7K',
          '正官': 'DO',
          '偏印': 'IR',
          '正印': 'DR'
        };
        return map[tg.zh] || tg.zh;
      };

      // Calculate Yang vs Yin distribution from natal pillars with lineage multipliers
      const elemSplits = {
        wood: { total: 0, yang: 0, yin: 0 },
        fire: { total: 0, yang: 0, yin: 0 },
        earth: { total: 0, yang: 0, yin: 0 },
        metal: { total: 0, yang: 0, yin: 0 },
        water: { total: 0, yang: 0, yin: 0 }
      };

      ['hour', 'day', 'month', 'year'].forEach(k => {
        const p = chart.pillars[k];
        if (!p || p.isUnknown) return;
        const s = p.stem;
        if (s && elemSplits[s.element]) {
          elemSplits[s.element].total += 1.0;
          elemSplits[s.element][s.polarity] += 1.0;
        }
        if (p.branch && p.branch.hidden) {
          p.branch.hidden.forEach(h => {
            const sObj = STEMS.find(x => x.zh === h.stem);
            if (sObj && elemSplits[sObj.element]) {
              const w = h.weight * 1.5;
              elemSplits[sObj.element].total += w;
              elemSplits[sObj.element][sObj.polarity] += w;
            }
          });
        }
      });

      const totalScore = Object.values(elemSplits).reduce((a, b) => a + b.total, 0) || 1;

      // Map percentages and ensure yang + yin = totalPct exactly
      const sortedElems = elemKeys.map(k => {
        const split = elemSplits[k];
        const meta = ELEMENTS_META[k];
        const totalPct = chart.elementPercentages ? (chart.elementPercentages[k] || 0) : Math.round((split.total / totalScore) * 100);
        let yangPct = split.total > 0 ? Math.round((split.yang / totalScore) * 100) : 0;
        let yinPct = totalPct - yangPct;
        if (yinPct < 0) { yinPct = 0; yangPct = totalPct; }
        if (yangPct < 0) yangPct = 0;

        const yangStem = STEMS.find(s => s.element === k && s.polarity === 'yang');
        const yinStem = STEMS.find(s => s.element === k && s.polarity === 'yin');
        const yangGod = getTenGod(dm, yangStem);
        const yinGod = getTenGod(dm, yinStem);
        const yangAbbr = getTenGodAbbr(yangStem);
        const yinAbbr = getTenGodAbbr(yinStem);
        const roleName = getRoleName(k);
        const isDM = (k === dmElem);

        return {
          key: k,
          roleName,
          isDM,
          totalPct,
          yangPct,
          yinPct,
          yangAbbr,
          yinAbbr,
          yangGod,
          yinGod,
          yangStem,
          yinStem,
          th: meta.th,
          zh: meta.zh,
          color: meta.color,
          isFav: favList.includes(k)
        };
      }).sort((a, b) => b.totalPct - a.totalPct);

      // Construct Single Ring Donut Chart using 5 Basic Element Colors with Outside DM & Fav Badges
      const cx = 160, cy = 160;
      const rOuter = 110, rInner = 62;
      const rMid = (rOuter + rInner) / 2;
      let startAngle = -Math.PI / 2;
      let pathsSvg = '';
      let insideLabelsSvg = '';
      let smallLabelsSvg = '';
      let outsideBadgesSvg = '';

      sortedElems.forEach(item => {
        if (item.totalPct > 0) {
          const angle = (item.totalPct / 100) * 2 * Math.PI;
          const endAngle = startAngle + angle;
          const largeArc = angle > Math.PI ? 1 : 0;
          const midAngle = startAngle + angle / 2;
          const cosM = Math.cos(midAngle);
          const sinM = Math.sin(midAngle);

          const x1 = cx + rOuter * Math.cos(startAngle), y1 = cy + rOuter * Math.sin(startAngle);
          const x2 = cx + rOuter * Math.cos(endAngle), y2 = cy + rOuter * Math.sin(endAngle);
          const ix1 = cx + rInner * Math.cos(endAngle), iy1 = cy + rInner * Math.sin(endAngle);
          const ix2 = cx + rInner * Math.cos(startAngle), iy2 = cy + rInner * Math.sin(startAngle);

          const d = `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${ix1.toFixed(2)} ${iy1.toFixed(2)} A ${rInner} ${rInner} 0 ${largeArc} 0 ${ix2.toFixed(2)} ${iy2.toFixed(2)} Z`;
          pathsSvg += `<path d="${d}" fill="${item.color}" stroke="#ffffff" stroke-width="2.5"><title>${item.roleName} (${item.th}): ${item.totalPct}% [${item.yangAbbr}: ${item.yangPct}%, ${item.yinAbbr}: ${item.yinPct}%]</title></path>`;

          // 1. Text inside slice (for slices >= 7%): show pure role name & percentage
          if (item.totalPct >= 7) {
            const tx = cx + rMid * cosM;
            const ty = cy + rMid * sinM;
            const roleFontSize = item.totalPct >= 18 ? '11.5' : (item.totalPct >= 11 ? '10.5' : '9.5');
            const pctFontSize = item.totalPct >= 18 ? '14' : (item.totalPct >= 11 ? '13' : '11.5');

            insideLabelsSvg += `
              <text x="${tx.toFixed(1)}" y="${(ty - 3).toFixed(1)}" text-anchor="middle" font-family="'Outfit', 'Prompt', sans-serif" style="pointer-events: none;">
                <tspan x="${tx.toFixed(1)}" dy="0" font-size="${roleFontSize}" font-weight="800" fill="#ffffff" style="text-shadow: 0 1px 3px rgba(0,0,0,0.65);">${item.roleName}</tspan>
                <tspan x="${tx.toFixed(1)}" dy="14" font-size="${pctFontSize}" font-weight="900" fill="#ffffff" style="text-shadow: 0 1px 3px rgba(0,0,0,0.65);">${item.totalPct}%</tspan>
              </text>
            `;
          } else {
            // Small slice (< 7%): place outside with collision prevention leader line
            const isTop = sinM < -0.3;
            const isLeft = cosM < 0;
            let targetX, targetY, anchor;

            if (isTop) {
              targetY = 24;
              targetX = isLeft ? Math.min(cx + rOuter * cosM - 10, 130) : Math.max(cx + rOuter * cosM + 10, 185);
              anchor = isLeft ? 'end' : 'start';
            } else {
              targetX = cx + (rOuter + 22) * cosM;
              targetY = cy + (rOuter + 22) * sinM;
              anchor = cosM > 0.3 ? 'start' : (cosM < -0.3 ? 'end' : 'middle');
            }

            const sx = cx + rOuter * cosM;
            const sy = cy + rOuter * sinM;
            const lx1 = cx + (rOuter + 6) * cosM;
            const ly1 = cy + (rOuter + 6) * sinM;

            smallLabelsSvg += `
              <g style="pointer-events: none;">
                <polyline points="${sx.toFixed(1)},${sy.toFixed(1)} ${lx1.toFixed(1)},${ly1.toFixed(1)} ${targetX.toFixed(1)},${targetY.toFixed(1)}" fill="none" stroke="${item.color}" stroke-width="1.2" stroke-dasharray="2,2" opacity="0.8" />
                <text x="${(targetX + (anchor === 'end' ? -3 : (anchor === 'start' ? 3 : 0))).toFixed(1)}" y="${(targetY + 4).toFixed(1)}" text-anchor="${anchor}" font-size="10.5" font-weight="800" fill="${item.color}" font-family="'Outfit', 'Prompt', sans-serif" style="text-shadow: 0 1px 2px rgba(255,255,255,0.95);">${item.roleName} ${item.totalPct}%</text>
              </g>
            `;
          }

          // 2. Outside Badges: Day Master (DM) and Favorable Star (★ ให้คุณ)
          if (item.isDM || item.isFav) {
            const badgeDist = rOuter + 22;
            const bx = cx + badgeDist * cosM;
            const by = cy + badgeDist * sinM;
            const ex = cx + (rOuter + 2) * cosM;
            const ey = cy + (rOuter + 2) * sinM;

            let badgeContent = '';
            let titleText = '';

            if (item.isDM && item.isFav) {
              titleText = 'ดิถีธาตุ (Day Master) & ธาตุให้คุณ';
              badgeContent = `
                <rect x="${(bx - 23).toFixed(1)}" y="${(by - 10).toFixed(1)}" width="46" height="20" rx="5" fill="#faf5ff" stroke="#c4b5fd" stroke-width="1.4" filter="url(#pieBadgeShadow)" />
                <text x="${bx.toFixed(1)}" y="${(by + 4.5).toFixed(1)}" text-anchor="middle" font-family="'Outfit', 'Prompt', sans-serif">
                  <tspan font-size="10" font-weight="900" fill="#6d28d9">DM</tspan>
                  <tspan font-size="12" font-weight="900" fill="#7c3aed" dx="2">★</tspan>
                </text>`;
            } else if (item.isDM) {
              titleText = 'ดิถีธาตุ (Day Master)';
              badgeContent = `
                <rect x="${(bx - 16).toFixed(1)}" y="${(by - 10).toFixed(1)}" width="32" height="20" rx="5" fill="#ede9fe" stroke="#c4b5fd" stroke-width="1.4" filter="url(#pieBadgeShadow)" />
                <text x="${bx.toFixed(1)}" y="${(by + 4.5).toFixed(1)}" text-anchor="middle" font-family="'Outfit', 'Prompt', sans-serif" font-size="10.5" font-weight="900" fill="#6d28d9">DM</text>`;
            } else if (item.isFav) {
              titleText = 'ธาตุให้คุณ (ส่งเสริมดวงชะตา)';
              badgeContent = `
                <rect x="${(bx - 12).toFixed(1)}" y="${(by - 10).toFixed(1)}" width="24" height="20" rx="5" fill="#faf5ff" stroke="#d8b4fe" stroke-width="1.4" filter="url(#pieBadgeShadow)" />
                <text x="${bx.toFixed(1)}" y="${(by + 4.5).toFixed(1)}" text-anchor="middle" font-family="'Outfit', 'Prompt', sans-serif" font-size="13" font-weight="900" fill="#7c3aed">★</text>`;
            }

            outsideBadgesSvg += `
              <g class="bazi-pie-outside-badge" style="cursor: pointer;">
                <title>${titleText}</title>
                <line x1="${ex.toFixed(1)}" y1="${ey.toFixed(1)}" x2="${(cx + (badgeDist - 12) * cosM).toFixed(1)}" y2="${(cy + (badgeDist - 12) * sinM).toFixed(1)}" stroke="#cbd5e1" stroke-width="1.2" stroke-dasharray="2,2" />
                ${badgeContent}
              </g>
            `;
          }

          startAngle = endAngle;
        }
      });

      const dmZh = dm ? dm.zh : '丁';
      const dmMeta = dm ? ELEMENTS_META[dm.element] : null;
      const dmColor = dmMeta ? dmMeta.color : '#7c3aed';
      const dmStrengthLabel = chart.isStrong ? 'DM : Strong' : 'DM : Weak';
      const dmStrengthClass = chart.isStrong ? 'badge-dm-strong' : 'badge-dm-weak';

      const htmlContent = `
        <div class="bazi-pie-card-header">
          <div>
            <i class="fa-solid fa-chart-pie" style="color: #7c3aed;"></i>
            <strong>สัดส่วนเบญจธาตุ (Five Elements)</strong>
          </div>
          <span class="header-badge ${dmStrengthClass}">${dmStrengthLabel}</span>
        </div>

        <div class="bazi-pie-svg-wrap">
          <svg class="bazi-pie-svg" viewBox="0 0 320 320">
            <defs>
              <filter id="pieBadgeShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#7c3aed" flood-opacity="0.15" />
              </filter>
            </defs>
            ${pathsSvg}
            ${insideLabelsSvg}
            ${smallLabelsSvg}
            ${outsideBadgesSvg}
            <circle cx="${cx}" cy="${cy}" r="${rInner - 2}" fill="#ffffff" />
            <text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="32" font-weight="900" fill="${dmColor}" font-family="'Outfit', 'Prompt', sans-serif">${dmZh}</text>
            <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="12.5" font-weight="800" fill="#475569" font-family="'Outfit', 'Prompt', sans-serif">${chart.isStrong ? '身强 ดิถีแข็ง' : '身弱 ดิถีอ่อน'}</text>
          </svg>
        </div>

        <div class="bazi-pie-legend-list">
          ${sortedElems.map(e => `
            <div class="bazi-pie-legend-item">
              <div class="bazi-pie-item-left">
                <span class="bazi-pie-color-dot" style="background: ${e.color};" title="${e.th} (${e.zh})"></span>
                <span class="bazi-pie-elem-name">
                  <strong>${e.roleName}</strong>
                  ${e.isDM ? '<span class="bazi-pie-dm-badge" title="ดิถีธาตุ (Day Master)">DM</span>' : ''}
                  <small style="color: #64748b; font-weight: 500; font-size: 11px;">(${e.th})</small>
                </span>
                ${e.isFav ? '<span class="bazi-pie-fav-tag" title="ธาตุให้คุณ (ส่งเสริมดวงชะตา)">★</span>' : ''}
              </div>
              <div class="bazi-pie-item-right">
                <span class="bazi-pie-pct-badge" style="color: ${e.color};">${e.totalPct}%</span>
                <div class="bazi-pie-sub-splits">
                  <span class="bazi-pie-sub-badge badge-yang" style="color: ${e.color};" title="${e.yangGod ? e.yangGod.th : ''} (${e.yangStem ? e.yangStem.zh : ''} หยาง)">${e.yangAbbr} ${e.yangPct}%</span>
                  <span class="bazi-pie-sub-badge badge-yin" style="color: #475569;" title="${e.yinGod ? e.yinGod.th : ''} (${e.yinStem ? e.yinStem.zh : ''} หยิน)">${e.yinAbbr} ${e.yinPct}%</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      containers.forEach(c => {
        c.innerHTML = htmlContent;
      });
    },

    renderBasicAgeCallout: function (chart) {
      if (!chart) return;
      const targets = [
        document.getElementById('baziAgeDisplayCard'),
        document.getElementById('baziAdvanceAgeDisplayCard')
      ];
      const now = new Date();
      const birthYear = chart.birthDateString ? parseInt(chart.birthDateString.split('-')[0], 10) : now.getFullYear();
      const age = Math.max(0, now.getFullYear() - birthYear);
      const dmMeta = ELEMENTS_META[chart.dayMaster.element];

      const safeName = (window.SecurityGuard && window.SecurityGuard.escapeHtml) ? window.SecurityGuard.escapeHtml(chart.name) : (chart.name || 'ไม่ระบุชื่อ');

      const html = `
        <div class="bazi-age-icon"><i class="fa-solid fa-cake-candles"></i></div>
        <div class="bazi-age-content">
          <strong>🎂 อายุปัจจุบัน: ${age} ปี (เกิดปี พ.ศ. ${birthYear + 543} / ค.ศ. ${birthYear})</strong>
          <p>
            เจ้าชะตา: <strong>${safeName}</strong> • ดิถีธาตุประจำตัว: <strong style="color: ${dmMeta.color};">${chart.dayMaster.zh} (${chart.dayMaster.th})</strong> 
            • พลังดิถี: <strong>${chart.strengthText}</strong> (${chart.dayMasterProfile ? chart.dayMasterProfile.title : ''})
          </p>
        </div>
      `;

      targets.forEach(card => {
        if (card) card.innerHTML = html;
      });
    },

    calculateRealisticLifeScores: function (chart) {
      if (!chart) return { lifeScore: 50, wealthScore: 50, careerScore: 50, loveScore: 50, healthScore: 50 };
      const p = chart.pillars || {};
      const dm = chart.dayMaster || (p.day ? p.day.stem : null) || { element: 'metal', polarity: 'yin', zh: '辛' };
      const dmElem = dm.element;
      const isStrong = !!chart.isStrong;
      const favList = chart.favorableElements || [];
      const elemPcts = chart.elementPercentages || { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 };
      const pArray = [p.year, p.month, p.day, p.hour].filter(Boolean);

      const elementsMeta = {
        wood: { controls: 'earth', generates: 'fire' },
        fire: { controls: 'metal', generates: 'earth' },
        earth: { controls: 'water', generates: 'metal' },
        metal: { controls: 'wood', generates: 'water' },
        water: { controls: 'fire', generates: 'wood' }
      };

      const tenGodsCount = {};
      pArray.forEach(pillar => {
        if (pillar.tenGod && pillar.tenGod.zh) {
          tenGodsCount[pillar.tenGod.zh] = (tenGodsCount[pillar.tenGod.zh] || 0) + 1.0;
        }
        if (pillar.hiddenStems) {
          pillar.hiddenStems.forEach(h => {
            if (h.tenGod && h.tenGod.zh) {
              tenGodsCount[h.tenGod.zh] = (tenGodsCount[h.tenGod.zh] || 0) + (h.weight || 0.35);
            }
          });
        }
      });

      // 1. ภาพรวมชีวิตและพลังดิถี (Life Vitality & Foundation) - ฐาน 50 (เกณฑ์ตามจริง)
      let lifeScore = 50;
      if (isStrong) lifeScore += 8;
      else lifeScore -= 4;

      let hasRoot = false;
      pArray.forEach(pillar => {
        if (pillar.branch && pillar.branch.element === dmElem) {
          lifeScore += 8;
          hasRoot = true;
        } else if (pillar.hiddenStems && pillar.hiddenStems.some(h => h.stemObj && h.stemObj.element === dmElem)) {
          lifeScore += 5;
          hasRoot = true;
        }
      });
      if (!hasRoot) lifeScore -= 12;

      const favPct = favList.reduce((acc, k) => acc + (elemPcts[k] || 0), 0);
      if (favPct >= 40) lifeScore += 12;
      else if (favPct >= 25) lifeScore += 6;
      else if (favPct < 15) lifeScore -= 10;

      const unfavPct = 100 - favPct;
      if (unfavPct >= 50) lifeScore -= 10;
      else if (unfavPct >= 40) lifeScore -= 5;

      const hasNobleman = pArray.some(pillar => (pillar.stars || []).some(s => (s.name || '').includes('GuiRen') || (s.name || '').includes('FuXing') || (s.th || '').includes('กุ้ยเหริน') || (s.th || '').includes('ฮกแช')));
      if (hasNobleman) lifeScore += 6;

      lifeScore = Math.max(20, Math.min(95, Math.round(lifeScore)));

      // 2. การเงินและทรัพย์สิน (Wealth & Financial Capacity) - ฐาน 45 (เกณฑ์ตามจริง)
      let wealthScore = 45;
      const wealthElem = elementsMeta[dmElem].controls;
      const outputElem = elementsMeta[dmElem].generates;
      const wealthPct = elemPcts[wealthElem] || 0;
      const outputPct = elemPcts[outputElem] || 0;

      if (wealthPct >= 15 && wealthPct <= 30) {
        wealthScore += 14;
      } else if (wealthPct < 5) {
        wealthScore -= 14;
      } else if (wealthPct > 40) {
        wealthScore += isStrong ? 12 : -14;
      }

      if (isStrong && wealthPct >= 10) {
        wealthScore += 14;
      } else if (!isStrong && wealthPct > 20) {
        wealthScore -= 8;
      }

      if (outputPct >= 12 && wealthPct >= 5) {
        wealthScore += 10;
      } else if (outputPct >= 5 && wealthPct > 0) {
        wealthScore += 4;
      }

      const rwScore = (tenGodsCount['劫財'] || 0);
      if (rwScore >= 1.5 && (tenGodsCount['正官'] || 0) < 0.5) {
        wealthScore -= 10;
      }

      wealthScore = Math.max(20, Math.min(95, Math.round(wealthScore)));

      // 3. การงานและอำนาจบารมี (Career & Authority) - ฐาน 50 (เกณฑ์ตามจริง)
      let careerScore = 50;
      const powerElem = Object.keys(elementsMeta).find(k => elementsMeta[k].controls === dmElem);
      const resourceElem = Object.keys(elementsMeta).find(k => elementsMeta[k].generates === dmElem);
      const powerPct = elemPcts[powerElem] || 0;
      const resourcePct = elemPcts[resourceElem] || 0;

      if (powerPct >= 12 && powerPct <= 30) {
        careerScore += 14;
      } else if (powerPct > 45) {
        careerScore -= isStrong ? 6 : 14;
      } else if (powerPct < 5) {
        careerScore -= 8;
      }

      if (powerPct >= 12 && resourcePct >= 15) {
        careerScore += 12;
      }

      if ((tenGodsCount['傷官'] || 0) >= 1.0 && (tenGodsCount['正官'] || 0) >= 1.0) {
        careerScore -= 16;
      }

      careerScore = Math.max(20, Math.min(95, Math.round(careerScore)));

      // 4. ความสัมพันธ์และคู่ครอง (Relationships & Marriage) - ฐาน 50 (เกณฑ์ตามจริง)
      let loveScore = 50;
      const dayBranch = p.day ? p.day.branch : null;
      const spouseElem = dayBranch ? dayBranch.element : null;

      if (spouseElem) {
        if (favList.includes(spouseElem)) {
          loveScore += 12;
        } else {
          loveScore -= 8;
        }
      }

      const isFemale = chart.gender === 'female';
      if (isFemale) {
        if ((tenGodsCount['正官'] || 0) >= 1.0 && (tenGodsCount['七殺'] || 0) >= 1.0) {
          loveScore -= 10;
        }
      } else {
        if ((tenGodsCount['正財'] || 0) >= 1.0 && (tenGodsCount['偏財'] || 0) >= 1.0) {
          loveScore -= 10;
        }
      }

      if (p.day && p.month && p.day.branch && p.month.branch) {
        const db = p.day.branch.zh, mb = p.month.branch.zh;
        const clashes = { '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅', '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳' };
        if (clashes[db] === mb) loveScore -= 18;
      }
      if (p.day && p.hour && p.day.branch && p.hour.branch) {
        const db = p.day.branch.zh, hb = p.hour.branch.zh;
        const clashes = { '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅', '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳' };
        if (clashes[db] === hb) loveScore -= 14;
      }

      loveScore = Math.max(20, Math.min(95, Math.round(loveScore)));

      // 5. สุขภาพและความสมดุล (Health & Elemental Balance) - ฐาน 85 (เกณฑ์ตามจริง)
      let healthScore = 85;
      const vals = Object.values(elemPcts);
      const avg = 20;
      const dev = vals.reduce((acc, v) => acc + Math.abs(v - avg), 0) / vals.length;
      healthScore -= Math.round(dev * 1.5);

      vals.forEach(v => {
        if (v <= 2) healthScore -= 10;
        else if (v <= 5) healthScore -= 5;
        if (v >= 50) healthScore -= 16;
        else if (v >= 40) healthScore -= 8;
      });

      healthScore = Math.max(20, Math.min(95, Math.round(healthScore)));

      return {
        lifeScore,
        wealthScore,
        careerScore,
        loveScore,
        healthScore
      };
    },

    renderBasicSpiderChart: function (chart) {
      if (!chart) return;
      const targets = [
        {
          svgWrap: document.getElementById('baziSpiderChartSvgWrap'),
          legendWrap: document.getElementById('baziSpiderLegendWrap')
        },
        {
          svgWrap: document.getElementById('baziAdvanceSpiderChartSvgWrap'),
          legendWrap: document.getElementById('baziAdvanceSpiderLegendWrap')
        }
      ];
      const validTargets = targets.filter(t => t.svgWrap);
      if (validTargets.length === 0) return;

      const scores = this.calculateRealisticLifeScores(chart);
      const radarData = [
        { label: 'ภาพรวมชีวิต', value: scores.lifeScore, color: '#8b5cf6', icon: 'fa-solid fa-heart-pulse', desc: 'พลังชีวิต ธาตุส่งเสริม และความหนักแน่นของตัวตน' },
        { label: 'การเงิน', value: scores.wealthScore, color: '#10b981', icon: 'fa-solid fa-coins', desc: 'โอกาสสร้างทรัพย์ โชคลาภ และกระแสเงินหมุนเวียน' },
        { label: 'การงาน', value: scores.careerScore, color: '#0284c7', icon: 'fa-solid fa-briefcase', desc: 'ความก้าวหน้า ตำแหน่ง หน้าที่ และการยอมรับทางวิชาชีพ' },
        { label: 'ความสัมพันธ์', value: scores.loveScore, color: '#ec4899', icon: 'fa-solid fa-heart', desc: 'ความรัก คู่ครอง วังคู่ครอง และคนรอบข้างเกื้อหนุน' },
        { label: 'สุขภาพ', value: scores.healthScore, color: '#f59e0b', icon: 'fa-solid fa-shield-heart', desc: 'สมดุลเบญจธาตุ อวัยวะ และการปรับพลังหยินหยาง' }
      ];

      // SVG Generation
      const cx = 175;
      const cy = 145;
      const r = 85;
      const numAxes = 5;
      const angles = [];
      for (let i = 0; i < numAxes; i++) {
        angles.push(-Math.PI / 2 + (i * 2 * Math.PI) / numAxes);
      }

      const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
      let gridLinesSvg = '';
      levels.forEach(lvl => {
        const polyPoints = angles.map(a => `${(cx + r * lvl * Math.cos(a)).toFixed(1)},${(cy + r * lvl * Math.sin(a)).toFixed(1)}`).join(' ');
        gridLinesSvg += `<polygon points="${polyPoints}" fill="${lvl === 1.0 ? 'rgba(124, 58, 237, 0.03)' : 'none'}" stroke="rgba(148, 163, 184, 0.3)" stroke-width="1" />`;
      });

      let spokesSvg = '';
      angles.forEach(a => {
        spokesSvg += `<line x1="${cx}" y1="${cy}" x2="${(cx + r * Math.cos(a)).toFixed(1)}" y2="${(cy + r * Math.sin(a)).toFixed(1)}" stroke="rgba(148, 163, 184, 0.35)" stroke-width="1" stroke-dasharray="3,3" />`;
      });

      const maxVal = 100;
      const dataPoints = radarData.map((d, i) => {
        const a = angles[i];
        const ratio = Math.max(0.15, Math.min(1.0, d.value / maxVal));
        const x = cx + r * ratio * Math.cos(a);
        const y = cy + r * ratio * Math.sin(a);
        return { x, y, data: d };
      });

      const polyString = dataPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

      let verticesSvg = '';
      dataPoints.forEach(p => {
        verticesSvg += `
          <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5" fill="${p.data.color}" stroke="#ffffff" stroke-width="2" />
          <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="8.5" fill="none" stroke="${p.data.color}" stroke-opacity="0.4" stroke-width="1.5" />
        `;
      });

      let labelsSvg = '';
      radarData.forEach((d, i) => {
        const a = angles[i];
        const dist = (i === 0) ? (r + 22) : (r + 18);
        const lx = cx + dist * Math.cos(a);
        const ly = cy + dist * Math.sin(a);
        let textAnchor = 'middle';
        if (Math.cos(a) > 0.25) textAnchor = 'start';
        else if (Math.cos(a) < -0.25) textAnchor = 'end';

        labelsSvg += `
          <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${textAnchor}" fill="#1e293b" font-family="'Prompt', sans-serif" font-size="12" font-weight="700">
            ${d.label}
          </text>
          <text x="${lx.toFixed(1)}" y="${(ly + 14).toFixed(1)}" text-anchor="${textAnchor}" fill="${d.color}" font-family="'Outfit', sans-serif" font-size="12" font-weight="800">
            ${d.value}%
          </text>
        `;
      });

      const svgHtml = `
        <svg viewBox="0 0 350 300" style="width: 100%; max-width: 350px; height: auto;" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="baziRadarGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ec4899" stop-opacity="0.5" />
              <stop offset="60%" stop-color="#8b5cf6" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.1" />
            </radialGradient>
          </defs>
          ${gridLinesSvg}
          ${spokesSvg}
          <polygon points="${polyString}" fill="url(#baziRadarGrad)" stroke="#7c3aed" stroke-width="2.5" />
          ${verticesSvg}
          ${labelsSvg}
        </svg>
      `;

      const legendHtml = radarData.map(d => `
        <div class="radar-score-row">
          <div class="radar-score-left">
            <i class="${d.icon}" style="color: ${d.color}; font-size: 16px;"></i>
            <div>
              <div style="color: #1e293b; font-size: 13.5px; font-weight: 700;">${d.label}</div>
              <div style="color: #64748b; font-size: 11px; font-weight: 400;">${d.desc}</div>
            </div>
          </div>
          <div class="radar-score-bar-wrap">
            <div class="radar-score-bar-fill" style="width: ${d.value}%; background: ${d.color};"></div>
          </div>
          <span class="radar-score-num" style="color: ${d.color};">${d.value}%</span>
        </div>
      `).join('');

      validTargets.forEach(t => {
        t.svgWrap.innerHTML = svgHtml;
        if (t.legendWrap) t.legendWrap.innerHTML = legendHtml;
      });
    },

    renderBasicFengShui: function (chart) {
      if (!chart) return;
      const targets = [
        document.getElementById('baziFengShuiThreeCol'),
        document.getElementById('baziAdvanceFengShuiThreeCol')
      ];
      const validTargets = targets.filter(Boolean);
      if (validTargets.length === 0) return;

      const favNames = chart.favorableElements.map(k => ELEMENTS_META[k].th).join(', ');
      const favColors = chart.favorableElements.map(k => {
        if (k === 'wood') return { name: 'เขียว / ไม้ธรรมชาติ', color: '#16a34a', bg: '#dcfce7' };
        if (k === 'fire') return { name: 'แดง / ส้ม / ชมพู / ม่วง', color: '#dc2626', bg: '#fee2e2' };
        if (k === 'earth') return { name: 'เหลือง / ครีม / น้ำตาล', color: '#d97706', bg: '#fef3c7' };
        if (k === 'metal') return { name: 'ขาว / เงิน / ทอง / เทา', color: '#475569', bg: '#f1f5f9' };
        return { name: 'ฟ้า / น้ำเงิน / ดำ', color: '#0284c7', bg: '#e0f2fe' };
      });

      const tiaoHou = chart.tiaoHou ? chart.tiaoHou : { th: favNames, reason: 'ปรับสมดุลตามธาตุที่ให้คุณ' };

      const html = `
        <!-- 1. สีมงคล -->
        <div class="fengshui-col-card">
          <div class="fengshui-col-header">
            <i class="fa-solid fa-palette" style="color: #ec4899;"></i>
            <span>1. สีมงคลเสริมชะตา</span>
          </div>
          <div class="fengshui-col-body">
            <p>สีเสื้อผ้า ของใช้ ยานพาหนะ และของตกแต่งที่ช่วยเสริมพลังบารมี:</p>
            <div class="fengshui-pill-tags">
              ${favColors.map(c => `
                <span class="fengshui-color-pill" style="background: ${c.bg}; color: ${c.color}; border-color: ${c.color}40;">
                  <i class="fa-solid fa-circle-check"></i> ${c.name}
                </span>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- 2. ทิศมงคล -->
        <div class="fengshui-col-card">
          <div class="fengshui-col-header">
            <i class="fa-solid fa-compass" style="color: #0284c7;"></i>
            <span>2. ทิศมงคลประจำดวง</span>
          </div>
          <div class="fengshui-col-body">
            <p>ทิศเปิดรับโชคลาภ หันหน้าโต๊ะทำงาน หัวเตียงนอน หรือตำแหน่งสำคัญ:</p>
            <div class="fengshui-pill-tags">
              ${chart.favorableElements.map(k => `
                <span class="fengshui-color-pill" style="background: #e0f2fe; color: #0369a1;">
                  <i class="fa-solid fa-location-arrow"></i> ${ELEMENTS_META[k].direction} (${ELEMENTS_META[k].th})
                </span>
              `).join('')}
            </div>
            <p style="font-size: 11.5px; color: #64748b; margin-top: 6px;">
              ★ นั่งทำงานหันหน้าสู่ทิศดังกล่าวเพื่อดึงดูดพลังงานบวกและโอกาสทางการงาน
            </p>
          </div>
        </div>

        <!-- 3. ธาตุปรับดวง -->
        <div class="fengshui-col-card">
          <div class="fengshui-col-header">
            <i class="fa-solid fa-scale-balanced" style="color: #10b981;"></i>
            <span>3. ธาตุปรับดวง (喜用神)</span>
          </div>
          <div class="fengshui-col-body">
            <p>ธาตุให้คุณหลัก: <strong>${favNames}</strong></p>
            <p style="font-size: 12px; color: #475569; margin-top: 4px;">
              ${tiaoHou.reason || 'ช่วยให้ดวงชะตามีความกลมกลืน ลดอุปสรรคและส่งเสริมความสำเร็จอย่างยั่งยืน'}
            </p>
          </div>
        </div>
      `;

      validTargets.forEach(container => {
        container.innerHTML = html;
      });
    },

    renderBasicCurrentDaYun: function (chart) {
      const box = document.getElementById('baziCurrentDayunAnalysisBox');
      const badge = document.getElementById('baziCurrentDayunBadge');
      if (!box || !chart || !chart.daYunPillars) return;

      const now = new Date();
      const curYear = this.selectedYear || now.getFullYear();
      const birthYear = chart.birthDateString ? parseInt(chart.birthDateString.split('-')[0], 10) : now.getFullYear();
      const curAge = curYear - birthYear;

      const curDaYun = chart.daYunPillars.find(d => curAge >= d.ageFrom && curAge <= d.ageTo) || chart.daYunPillars[0];
      if (!curDaYun) return;

      if (badge) {
        badge.textContent = `ช่วงอายุ ${curDaYun.ageRange} (${curDaYun.stem.zh}${curDaYun.branch.zh} • ${curDaYun.tenGod.zh})`;
      }

      const sMeta = ELEMENTS_META[curDaYun.stem.element];
      const bMeta = ELEMENTS_META[curDaYun.branch.element];

      box.innerHTML = `
        <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 12px; padding: 14px 18px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
          <div>
            <span style="font-size: 13px; color: #7c3aed; font-weight: 700;">วัยจรใหญ่ประจำ 10 ปีนี้ (大運):</span>
            <h3 style="margin: 4px 0 0 0; color: #581c87; font-size: 18px;">
              <span style="color: ${sMeta.color}; font-weight: 800;">${curDaYun.stem.zh}</span>
              <span style="color: ${bMeta.color}; font-weight: 800;">${curDaYun.branch.zh}</span>
              (${curDaYun.stem.py} ${curDaYun.branch.py}) • วัยจรช่วงอายุ ${curDaYun.ageRange}
            </h3>
          </div>
          <div style="background: #ffffff; padding: 6px 14px; border-radius: 20px; border: 1px solid #ddd6fe; font-size: 13px; font-weight: 700; color: #7c3aed;">
            สิบเทพประจำวัยจร: ${curDaYun.tenGod.zh} (${curDaYun.tenGod.th})
          </div>
        </div>
        <div class="bazi-fortune-grid">
          <div class="fortune-grid-item">
            <div class="fortune-item-header"><i class="fa-solid fa-compass" style="color: #7c3aed;"></i> <strong>ภาพรวมวัยจร 10 ปีนี้</strong></div>
            <p class="fortune-item-text">${curDaYun.interpretation ? curDaYun.interpretation.overview : 'เป็นช่วงเวลาแห่งการพัฒนาศักยภาพและการเติบโตอย่างมั่นคง'}</p>
          </div>
          <div class="fortune-grid-item">
            <div class="fortune-item-header"><i class="fa-solid fa-briefcase" style="color: #0284c7;"></i> <strong>การงาน &amp; ธุรกิจในวัยจรนี้</strong></div>
            <p class="fortune-item-text">${curDaYun.interpretation ? curDaYun.interpretation.career : 'โอกาสขยับขยายหน้าที่การงานและสร้างความสำเร็จ'}</p>
          </div>
          <div class="fortune-grid-item">
            <div class="fortune-item-header"><i class="fa-solid fa-coins" style="color: #10b981;"></i> <strong>การเงิน &amp; โชคลาภในวัยจรนี้</strong></div>
            <p class="fortune-item-text">${curDaYun.interpretation ? curDaYun.interpretation.wealth : 'บริหารจัดการทรัพย์สินอย่างรอบคอบ มีโอกาสต่อยอดการลงทุน'}</p>
          </div>
          <div class="fortune-grid-item">
            <div class="fortune-item-header"><i class="fa-solid fa-heart" style="color: #ec4899;"></i> <strong>ความรัก &amp; ครอบครัวในวัยจรนี้</strong></div>
            <p class="fortune-item-text">${curDaYun.interpretation ? curDaYun.interpretation.love : 'รักษาความสัมพันธ์ที่อบอุ่นและสนับสนุนซึ่งกันและกัน'}</p>
          </div>
        </div>
      `;
    },

    renderBasicCurrentAnnual: function (chart) {
      const bannerEl = document.getElementById('baziBasicAnnualBanner');
      const gridEl = document.getElementById('baziBasicAnnualFortuneGrid');
      const titleEl = document.getElementById('baziBasicAnnualYearTitle');
      if (!bannerEl || !gridEl || !chart) return;

      const y = 2026;
      if (titleEl) titleEl.textContent = y;
      const annual = BaziEngine.calculateAnnualFortune(chart, y);
      if (!annual) return;

      const sMeta = ELEMENTS_META[annual.stem.element];
      const bMeta = ELEMENTS_META[annual.branch.element];
      const starsHtml = '⭐'.repeat(annual.scoreStars);

      let interactionTags = '';
      if (annual.clashes.length > 0) {
        interactionTags += annual.clashes.map(c => `<span class="annual-clash-tag"><i class="fa-solid fa-triangle-exclamation"></i> ชงกับ${c.label} (${c.desc})</span>`).join('');
      }
      if (annual.harmonies.length > 0) {
        interactionTags += annual.harmonies.map(h => `<span class="annual-harmony-tag"><i class="fa-solid fa-handshake"></i> ${h.name} (${h.label})</span>`).join('');
      }
      if (!interactionTags) {
        interactionTags = `<span class="annual-normal-tag"><i class="fa-solid fa-circle-check"></i> ราบรื่น ไม่มีการปะทะรุนแรงกับพื้นดวงกำเนิด</span>`;
      }

      bannerEl.innerHTML = `
        <div class="annual-banner-left">
          <div class="annual-year-chars">
            <span style="color: ${sMeta.color};">${annual.stem.zh}</span>
            <span style="color: ${bMeta.color};">${annual.branch.zh}</span>
          </div>
          <div class="annual-year-meta">
            <h3>ปี ${annual.year} (${annual.stem.py} ${annual.branch.py} - ${annual.branch.zodiac})</h3>
            <div class="annual-god-pill">ก้านฟ้า: ${annual.stemGod.zh} (${annual.stemGod.th}) • กิ่งดิน: ${annual.branchGod.zh}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">${annual.naYin}</div>
          </div>
        </div>
        <div class="annual-banner-right">
          <div class="annual-rating-box">
            <span class="rating-label">ดัชนีสิริมงคลปีนี้:</span>
            <span class="rating-stars">${starsHtml} (${annual.scoreStars}/5)</span>
          </div>
          <div class="annual-interaction-wrap">
            ${interactionTags}
          </div>
        </div>
      `;

      gridEl.innerHTML = `
        <div class="fortune-grid-item">
          <div class="fortune-item-header"><i class="fa-solid fa-sparkles" style="color: #d97706;"></i> <strong>ภาพรวมปี ${y}</strong></div>
          <p class="fortune-item-text">${annual.overview}</p>
        </div>
        <div class="fortune-grid-item">
          <div class="fortune-item-header"><i class="fa-solid fa-briefcase" style="color: #0284c7;"></i> <strong>การงานปี ${y}</strong></div>
          <p class="fortune-item-text">${annual.career}</p>
        </div>
        <div class="fortune-grid-item">
          <div class="fortune-item-header"><i class="fa-solid fa-coins" style="color: #10b981;"></i> <strong>การเงินปี ${y}</strong></div>
          <p class="fortune-item-text">${annual.wealth}</p>
        </div>
        <div class="fortune-grid-item">
          <div class="fortune-item-header"><i class="fa-solid fa-heart" style="color: #ec4899;"></i> <strong>ความรักปี ${y}</strong></div>
          <p class="fortune-item-text">${annual.love}</p>
        </div>
      `;

      this.renderBasicAnnualSpiderChart(chart, annual, y);
    },

    renderBasicAnnualSpiderChart: function (chart, annual, year) {
      const targets = [
        {
          svgWrap: document.getElementById('baziAnnualSpiderChartSvgWrap'),
          legendWrap: document.getElementById('baziAnnualSpiderLegendWrap'),
          yearLabel: document.getElementById('baziAnnualRadarYearLabel'),
          daYunLabel: document.getElementById('baziAnnualRadarDaYunLabel')
        },
        {
          svgWrap: document.getElementById('baziAdvanceAnnualSpiderChartSvgWrap'),
          legendWrap: document.getElementById('baziAdvanceAnnualSpiderLegendWrap'),
          yearLabel: document.getElementById('baziAdvanceAnnualRadarYearLabel'),
          daYunLabel: document.getElementById('baziAdvanceAnnualRadarDaYunLabel')
        }
      ];
      const validTargets = targets.filter(t => t.svgWrap);
      if (validTargets.length === 0 || !chart || !annual) return;

      const curDaYun = annual.curDaYun;
      validTargets.forEach(t => {
        if (t.yearLabel) t.yearLabel.textContent = year || annual.year || 2026;
        if (t.daYunLabel) {
          if (curDaYun && !curDaYun.isChildhood) {
            const dyName = (curDaYun.stem ? curDaYun.stem.zh : '') + (curDaYun.branch ? curDaYun.branch.zh : '');
            const dyAge = curDaYun.ageRange || `${curDaYun.ageFrom}-${curDaYun.ageTo} ปี`;
            t.daYunLabel.innerHTML = `<i class="fa-solid fa-timeline"></i> วัยจร 10 ปี: <strong>${dyName}</strong> (อายุ ${dyAge})`;
          } else if (curDaYun && curDaYun.isChildhood) {
            t.daYunLabel.innerHTML = `<i class="fa-solid fa-timeline"></i> วัยจร: <strong>${curDaYun.ageRange}</strong>`;
          } else {
            t.daYunLabel.innerHTML = `<i class="fa-solid fa-timeline"></i> คำนวณตามวัยจร 10 ปี`;
          }
        }
      });

      // Base realistic scores from natal chart
      const base = this.calculateRealisticLifeScores(chart);
      let annualLife = base.lifeScore;
      let annualWealth = base.wealthScore;
      let annualCareer = base.careerScore;
      let annualLove = base.loveScore;
      let annualHealth = base.healthScore;

      const favList = chart.favorableElements || [];

      // 1. Da Yun Macro Environment (ผลจากวัยจร 10 ปี)
      const dyStemFav = curDaYun && curDaYun.stem ? favList.includes(curDaYun.stem.element) : false;
      const dyBranchFav = curDaYun && curDaYun.branch ? favList.includes(curDaYun.branch.element) : false;
      const dyFavCount = (dyStemFav ? 1 : 0) + (dyBranchFav ? 1 : 0);

      if (dyFavCount === 2) {
        annualLife += 6;
        annualCareer += 5;
        annualWealth += 5;
      } else if (dyFavCount === 1) {
        annualLife += 3;
        annualCareer += 3;
        annualWealth += 3;
      } else if (dyFavCount === 0 && curDaYun && !curDaYun.isChildhood) {
        annualLife -= 5;
        annualCareer -= 4;
        annualWealth -= 4;
      }

      // 2. Annual Stem & Branch Favorability (ผลจากกิ่งฟ้า-ก้านดินปีจร)
      const annStemFav = favList.includes(annual.stem.element);
      const annBranchFav = favList.includes(annual.branch.element);

      if (annStemFav && annBranchFav) {
        annualLife += 12;
      } else if (annStemFav || annBranchFav) {
        annualLife += 6;
      } else {
        annualLife -= 8;
      }

      // 3. Interactions: Clashes & Harmonies (ปะทะและสมพงศ์)
      (annual.clashes || []).forEach(c => {
        if (c.pillarKey === 'day') {
          annualLove -= 16;
          annualHealth -= 8;
          annualLife -= 6;
        } else if (c.pillarKey === 'month') {
          annualCareer -= 14;
          annualLife -= 6;
        } else if (c.pillarKey === 'year') {
          annualLife -= 6;
          annualHealth -= 4;
        } else if (c.pillarKey === 'hour') {
          annualWealth -= 8;
          annualLife -= 4;
        } else if (c.pillarKey === 'dayun') {
          annualLife -= 8;
          annualCareer -= 6;
        }
      });

      (annual.harmonies || []).forEach(h => {
        if (h.pillarKey === 'day') {
          annualLove += 15;
          annualLife += 4;
        } else if (h.pillarKey === 'month') {
          annualCareer += 12;
          annualLife += 4;
        } else if (h.pillarKey === 'year') {
          annualLife += 5;
        } else if (h.pillarKey === 'dayun') {
          annualLife += 7;
          annualCareer += 5;
          annualWealth += 5;
        }
      });

      // 4. Ten Gods Stars of the Annual Pillar
      const sGod = annual.stemGod ? annual.stemGod.zh : '';
      const bGod = annual.branchGod ? annual.branchGod.zh : '';

      // Wealth stars (正財 / 偏財)
      if (sGod === '正財' || sGod === '偏財' || bGod === '正財' || bGod === '偏財') {
        if (chart.isStrong || dyFavCount >= 1) {
          annualWealth += 15;
        } else {
          annualWealth -= 6;
          annualHealth -= 4;
        }
      }

      // Rob Wealth (劫財)
      if (sGod === '劫財' || bGod === '劫財') {
        annualWealth -= 12;
      }

      // Output stars (食神 / 傷官)
      if (sGod === '食神' || sGod === '傷官') {
        annualWealth += 8;
        annualCareer += 4;
        if (sGod === '傷官') {
          const p = chart.pillars || {};
          if ((p.month && p.month.tenGod && p.month.tenGod.zh === '正官') || (p.year && p.year.tenGod && p.year.tenGod.zh === '正官')) {
            annualCareer -= 12;
          }
        }
      }

      // Power stars (正官 / 七殺)
      if (sGod === '正官' || sGod === '七殺') {
        if (chart.isStrong || dyFavCount >= 1) {
          annualCareer += 14;
        } else {
          annualCareer -= 8;
          annualHealth -= 6;
        }
      }

      // Resource stars (正印 / 偏印)
      if (sGod === '正印' || sGod === '偏印') {
        annualCareer += 8;
        annualHealth += 8;
      }

      // Peach Blossom (桃花: 子, 午, 卯, 酉)
      if (['子', '午', '卯', '酉'].includes(annual.branch.zh)) {
        annualLove += 8;
      }

      // 5. Health specific adjustments
      const elemPcts = chart.elementPercentages || { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 };
      const annElemPct = elemPcts[annual.branch.element] || 0;
      if (annElemPct >= 40) {
        annualHealth -= 14; // Element already excessive
      } else if (annElemPct <= 8 && annBranchFav) {
        annualHealth += 10; // Element replenishes deficiency
      }
      if ((annual.clashes || []).length >= 2) {
        annualHealth -= 8;
      }

      // Clamp to authentic 20-95%
      annualLife = Math.max(20, Math.min(95, Math.round(annualLife)));
      annualWealth = Math.max(20, Math.min(95, Math.round(annualWealth)));
      annualCareer = Math.max(20, Math.min(95, Math.round(annualCareer)));
      annualLove = Math.max(20, Math.min(95, Math.round(annualLove)));
      annualHealth = Math.max(20, Math.min(95, Math.round(annualHealth)));

      // Contextual Explanations for the Annual Scores
      let lifeDesc = '';
      if (annualLife > base.lifeScore) lifeDesc = 'วัยจรและปีจรหนุนนำ จังหวะชีวิตเปิดกว้างและมีพลังขับเคลื่อนสูง';
      else if (annualLife < base.lifeScore) lifeDesc = 'ปีนี้มีแรงเสียดทานหรือการปะทะของพลังงาน ควรดำเนินชีวิตอย่างมีสติรอบคอบ';
      else lifeDesc = 'กระแสชะตาในปีนี้ดำเนินไปอย่างราบรื่นตามรากฐานพื้นดวงเดิม';

      let wealthDesc = '';
      if (annualWealth > base.wealthScore) wealthDesc = 'ดาวการเงินและธาตุส่งเสริมเปิดทาง โอกาสสร้างรายได้หมุนเวียนเด่นชัด';
      else if (annualWealth < base.wealthScore) wealthDesc = 'ระวังรายจ่ายจรและการแข่งขันทางการเงิน ควรเน้นการออมและเลี่ยงความเสี่ยง';
      else wealthDesc = 'กระแสการเงินทรงตัวตามแผนงานและการบริหารจัดการ';

      let careerDesc = '';
      if (annualCareer > base.careerScore) careerDesc = 'ดาวการงานและตำแหน่งส่งผลดี ผู้ใหญ่เกื้อหนุน ผลงานได้รับการยอมรับ';
      else if (annualCareer < base.careerScore) careerDesc = 'มีความกดดันจากหน้าที่หรือการปรับเปลี่ยนโครงสร้าง ต้องใช้ความอดทนและสุขุม';
      else careerDesc = 'การงานดำเนินไปตามสายงานและบทบาทหน้าที่ปกติ';

      let loveDesc = '';
      if (annualLove > base.loveScore) loveDesc = 'วังคู่ครองสมพงศ์หรือมีดาวเสน่ห์เกื้อหนุน ความสัมพันธ์อบอุ่นลงตัว';
      else if (annualLove < base.loveScore) loveDesc = 'มีแรงปะทะกับวังคู่ครอง ระวังความขัดแย้งจากอารมณ์ ควรรับฟังซึ่งกันและกัน';
      else loveDesc = 'ความสัมพันธ์ดำเนินไปอย่างเรียบง่าย มั่นคง และเข้าใจกัน';

      let healthDesc = '';
      if (annualHealth > base.healthScore) healthDesc = 'ธาตุปีนี้ช่วยเติมเต็มส่วนที่พร่องในดวง สุขภาพกายและใจได้รับการฟื้นฟูดี';
      else if (annualHealth < base.healthScore) healthDesc = 'ธาตุปีนี้ซ้ำเติมธาตุที่หนักอยู่แล้วหรือมีแรงปะทะ ควรพักผ่อนและดูแลร่างกาย';
      else healthDesc = 'สมดุลร่างกายอยู่ในเกณฑ์ปกติ ดูแลสุขภาพต่อเนื่อง';

      const radarData = [
        { label: 'ภาพรวมปีนี้', value: annualLife, baseVal: base.lifeScore, color: '#f59e0b', icon: 'fa-solid fa-sparkles', desc: lifeDesc },
        { label: 'การเงินปีนี้', value: annualWealth, baseVal: base.wealthScore, color: '#10b981', icon: 'fa-solid fa-coins', desc: wealthDesc },
        { label: 'การงานปีนี้', value: annualCareer, baseVal: base.careerScore, color: '#0284c7', icon: 'fa-solid fa-briefcase', desc: careerDesc },
        { label: 'ความสัมพันธ์ปีนี้', value: annualLove, baseVal: base.loveScore, color: '#ec4899', icon: 'fa-solid fa-heart', desc: loveDesc },
        { label: 'สุขภาพปีนี้', value: annualHealth, baseVal: base.healthScore, color: '#8b5cf6', icon: 'fa-solid fa-shield-heart', desc: healthDesc }
      ];

      // SVG Generation
      const cx = 175;
      const cy = 145;
      const r = 85;
      const numAxes = 5;
      const angles = [];
      for (let i = 0; i < numAxes; i++) {
        angles.push(-Math.PI / 2 + (i * 2 * Math.PI) / numAxes);
      }

      const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
      let gridLinesSvg = '';
      levels.forEach(lvl => {
        const polyPoints = angles.map(a => `${(cx + r * lvl * Math.cos(a)).toFixed(1)},${(cy + r * lvl * Math.sin(a)).toFixed(1)}`).join(' ');
        gridLinesSvg += `<polygon points="${polyPoints}" fill="${lvl === 1.0 ? 'rgba(217, 119, 6, 0.04)' : 'none'}" stroke="rgba(217, 119, 6, 0.25)" stroke-width="1" />`;
      });

      let spokesSvg = '';
      angles.forEach(a => {
        spokesSvg += `<line x1="${cx}" y1="${cy}" x2="${(cx + r * Math.cos(a)).toFixed(1)}" y2="${(cy + r * Math.sin(a)).toFixed(1)}" stroke="rgba(217, 119, 6, 0.3)" stroke-width="1" stroke-dasharray="3,3" />`;
      });

      const maxVal = 100;
      const dataPoints = radarData.map((d, i) => {
        const a = angles[i];
        const ratio = Math.max(0.15, Math.min(1.0, d.value / maxVal));
        const x = cx + r * ratio * Math.cos(a);
        const y = cy + r * ratio * Math.sin(a);
        return { x, y, data: d };
      });

      const polyString = dataPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

      let verticesSvg = '';
      dataPoints.forEach(p => {
        verticesSvg += `
          <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5" fill="${p.data.color}" stroke="#ffffff" stroke-width="2" />
          <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="8.5" fill="none" stroke="${p.data.color}" stroke-opacity="0.4" stroke-width="1.5" />
        `;
      });

      let labelsSvg = '';
      radarData.forEach((d, i) => {
        const a = angles[i];
        const dist = (i === 0) ? (r + 22) : (r + 18);
        const lx = cx + dist * Math.cos(a);
        const ly = cy + dist * Math.sin(a);
        let textAnchor = 'middle';
        if (Math.cos(a) > 0.25) textAnchor = 'start';
        else if (Math.cos(a) < -0.25) textAnchor = 'end';

        labelsSvg += `
          <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${textAnchor}" fill="#78350f" font-family="'Prompt', sans-serif" font-size="12" font-weight="700">
            ${d.label}
          </text>
          <text x="${lx.toFixed(1)}" y="${(ly + 14).toFixed(1)}" text-anchor="${textAnchor}" fill="${d.color}" font-family="'Outfit', sans-serif" font-size="12" font-weight="800">
            ${d.value}%
          </text>
        `;
      });

      const svgHtml = `
        <svg viewBox="0 0 350 300" style="width: 100%; max-width: 350px; height: auto;" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="baziAnnualRadarGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.55" />
              <stop offset="60%" stop-color="#ec4899" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.1" />
            </radialGradient>
          </defs>
          ${gridLinesSvg}
          ${spokesSvg}
          <polygon points="${polyString}" fill="url(#baziAnnualRadarGrad)" stroke="#d97706" stroke-width="2.5" />
          ${verticesSvg}
          ${labelsSvg}
        </svg>
      `;

      const legendHtml = radarData.map(d => {
        const diff = d.value - d.baseVal;
        let diffBadge = '';
        if (diff > 0) {
          diffBadge = `<span style="font-size: 11px; font-weight: 700; color: #16a34a; background: #dcfce7; padding: 2px 7px; border-radius: 6px; margin-left: 6px;"><i class="fa-solid fa-arrow-trend-up"></i> +${diff}% เทียบพื้นดวง</span>`;
        } else if (diff < 0) {
          diffBadge = `<span style="font-size: 11px; font-weight: 700; color: #dc2626; background: #fee2e2; padding: 2px 7px; border-radius: 6px; margin-left: 6px;"><i class="fa-solid fa-arrow-trend-down"></i> ${diff}% เทียบพื้นดวง</span>`;
        } else {
          diffBadge = `<span style="font-size: 11px; font-weight: 600; color: #64748b; background: #f1f5f9; padding: 2px 7px; border-radius: 6px; margin-left: 6px;">คงที่ตามพื้นดวง</span>`;
        }

        return `
          <div class="radar-score-row" style="background: rgba(255, 255, 255, 0.85); border: 1px solid rgba(253, 230, 138, 0.6); margin-bottom: 8px; border-radius: 10px; padding: 8px 12px;">
            <div class="radar-score-left">
              <i class="${d.icon}" style="color: ${d.color}; font-size: 16px;"></i>
              <div>
                <div style="color: #1e293b; font-size: 13.5px; font-weight: 700; display: flex; align-items: center; flex-wrap: wrap;">
                  <span>${d.label}</span>
                  ${diffBadge}
                </div>
                <div style="color: #64748b; font-size: 11px; font-weight: 400; margin-top: 2px;">${d.desc}</div>
              </div>
            </div>
            <div class="radar-score-bar-wrap" style="background: rgba(226, 232, 240, 0.7);">
              <div class="radar-score-bar-fill" style="width: ${d.value}%; background: ${d.color};"></div>
            </div>
            <span class="radar-score-num" style="color: ${d.color}; font-size: 14px; font-weight: 800;">${d.value}%</span>
          </div>
        `;
      }).join('');

      validTargets.forEach(t => {
        t.svgWrap.innerHTML = svgHtml;
        if (t.legendWrap) t.legendWrap.innerHTML = legendHtml;
      });
    },

    renderAdvanceSuite: function (chart) {
      if (!chart) return;
      this.renderAdvanceMasterPillars(chart);
      this.renderBasicElementsPieChart(chart, 'baziAdvanceElementsPieCard');
      this.renderBasicAgeCallout(chart);
      this.renderBasicSpiderChart(chart);
      this.renderAdvanceDaYunMasterTable(chart);
      this.renderAdvanceAnnualMasterTable(chart, this.selectedYear);
      this.renderAdvanceMonthlyMasterTable(chart, this.selectedYear);
      this.renderBasicFengShui(chart);
    },

    renderAdvanceDimensions: function (chart) {
      if (!chart) return;
      const deep = this.generateDeepInsights(chart);
      const setHtml = (id, html) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html || '-';
      };
      setHtml('baziAdvanceTraitsText', deep.traits);
      setHtml('baziAdvanceCareerText', deep.career);
      setHtml('baziAdvanceWealthText', deep.wealth);
      setHtml('baziAdvanceLoveText', deep.love);
      setHtml('baziAdvanceHealthText', deep.health);
      setHtml('baziAdvanceWeaknessText', deep.weakness);
    },

    renderAdvanceMasterPillars: function (chart) {
      const container = document.getElementById('baziAdvanceMasterTableWrap');
      if (!container || !chart) return;
      const c = chart;
      const isUnknown = !!c.isUnknownTime;

      const natalCols = [
        { ...c.pillars.hour, pillarKey: 'hour', label: 'เสายาม', palace: 'เสายาม: วังบริวาร/ลูกหลาน' },
        { ...c.pillars.day, pillarKey: 'day', label: 'เสาวัน', palace: 'เสาวัน: วังตัวตน/คู่ครอง' },
        { ...c.pillars.month, pillarKey: 'month', label: 'เสาเดือน', palace: 'เสาเดือน: วังการงาน/พ่อแม่' },
        { ...c.pillars.year, pillarKey: 'year', label: 'เสาปี', palace: 'เสาปี: วังบรรพบุรุษ/สิ่งแวดล้อม' }
      ];
      const dayStem = c.dayMaster;
      const dayBranch = c.pillars.day.branch;
      const yearBranch = c.pillars.year.branch;
      const monthBranch = c.pillars.month.branch;

      const columns = [
        { key: 'hour', title: 'เสายาม', subTitle: isUnknown ? 'ไม่ระบุเวลา' : (c.birthTimeString || '12:00'), pillar: c.pillars.hour, isUnknown },
        { key: 'day', title: 'เสาวัน', subTitle: String(new Date(c.birthDateString).getDate() || 1), pillar: c.pillars.day, isDM: true },
        { key: 'month', title: 'เสาเดือน', subTitle: String(new Date(c.birthDateString).getMonth() + 1 || 1), pillar: c.pillars.month },
        { key: 'year', title: 'เสาปี', subTitle: String(new Date(c.birthDateString).getFullYear() || 2026), pillar: c.pillars.year }
      ];

      const tgAbbrMap = {
        '比肩': 'Fr', '劫財': 'RW', '食神': 'EG', '傷官': 'HO',
        '偏財': 'IW', '正財': 'DW', '七殺': 'QS', '正官': 'DO',
        '偏印': 'IR', '正印': 'DR'
      };

      container.innerHTML = `
        <table class="bazi-master-grid-table">
          <thead>
            <tr>
              <th class="row-header-col">เสาชะตา</th>
              ${columns.map(col => `
                <th class="col-header ${col.isDM ? 'th-day-master' : ''}">
                  <div style="font-size: 13.5px; font-weight: 700; color: #0f172a;">${col.title}</div>
                  <div style="font-size: 11px; color: #64748b; font-weight: 500;">${col.subTitle}</div>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            <!-- 1. Hour stem (ราศีบน) -->
            <tr>
              <td class="row-header-col">Hour stem<br><small style="font-size:10px; color:#94a3b8;">ราศีบน / กิ่งฟ้า</small></td>
              ${columns.map(col => {
        if (col.isUnknown) return `<td><div class="basic-unknown-hour">- ไม่ระบุเวลา -</div></td>`;
        const s = col.pillar.stem;
        const tg = col.isDM ? { zh: '日主', py: 'Day master', en: 'Self' } : (col.pillar.tenGod || { zh: '比肩', py: 'Friend', en: 'Friend' });
        return `
                  <td>
                    <div class="bazi-stem-card stem-bg-${s.element}">
                      <div class="bazi-card-pinyin">${s.py}</div>
                      <div class="bazi-card-char">${s.zh}</div>
                      <div class="bazi-card-polarity">${s.element.charAt(0).toUpperCase() + s.element.slice(1)} ${s.polarity === 'yang' ? '+' : '-'}</div>
                      <div class="bazi-card-tengod">${col.isDM ? 'Day master (ดิถี)' : `${tg.py} / ${tg.zh}`}</div>
                    </div>
                  </td>
                `;
      }).join('')}
            </tr>

            <!-- 2. Earth Branch (ราศีล่าง) -->
            <tr>
              <td class="row-header-col">Earth Branch<br><small style="font-size:10px; color:#94a3b8;">ราศีล่าง / กิ่งดิน</small></td>
              ${columns.map(col => {
        if (col.isUnknown) return `<td><div class="basic-unknown-hour">- ไม่ระบุเวลา -</div></td>`;
        const b = col.pillar.branch;
        const dh = this.getDominantHiddenStem(b.zh);
        const bTg = getTenGod(c.dayMaster, dh);
        return `
                  <td>
                    <div class="bazi-branch-card branch-bg-${b.element}">
                      <div class="bazi-card-pinyin">${b.py}</div>
                      <div class="bazi-card-char">${b.zh}</div>
                      <div class="bazi-card-polarity">${b.zodiac ? b.zodiac.split(' ')[0] : b.animal}</div>
                      <div class="bazi-card-tengod">${bTg.py} / ${bTg.zh}</div>
                    </div>
                  </td>
                `;
      }).join('')}
            </tr>

            <!-- 3. Hidden Stem (ราศีแฝง) -->
            <tr>
              <td class="row-header-col">Hidden Stem<br><small style="font-size:10px; color:#94a3b8;">ราศีแฝง / กิ่งซ่อน</small></td>
              ${columns.map(col => {
        if (col.isUnknown) return `<td><div class="basic-unknown-hour">-</div></td>`;
        const b = col.pillar.branch;
        return `
                  <td>
                    <div class="bazi-hhs-row">
                      ${b.hidden.map(h => {
          const sObj = STEMS.find(s => s.zh === h.stem) || STEMS[0];
          const tg = getTenGod(c.dayMaster, sObj);
          const abbr = tgAbbrMap[tg.zh] || 'Fr';
          return `
                          <div class="bazi-hhs-badge stem-bg-${sObj.element}">
                            <span style="font-size: 10px;">${sObj.py}</span>
                            <span style="font-size: 13px; font-weight: 700;">${sObj.zh}</span>
                            <span style="font-size: 9.5px; opacity: 0.85;">${abbr}</span>
                          </div>
                        `;
        }).join('')}
                    </div>
                  </td>
                `;
      }).join('')}
            </tr>

            <!-- 4. Nayin (ธาตุอิมเอี้ยง / นัปอิม) -->
            <tr>
              <td class="row-header-col">Nayin<br><small style="font-size:10px; color:#94a3b8;">นัปอิม</small></td>
              ${columns.map(col => {
        if (col.isUnknown) return `<td><div class="basic-unknown-hour">-</div></td>`;
        const sIdx = STEMS.findIndex(s => s.zh === col.pillar.stem.zh);
        const bIdx = BRANCHES.findIndex(b => b.zh === col.pillar.branch.zh);
        const ny = this.getNaYinDetail(sIdx, bIdx);
        return `
                  <td>
                    <div class="bazi-nayin-ribbon nayin-bg-${ny.element}" title="${ny.th}">
                      ${ny.en} (${ny.th})
                    </div>
                  </td>
                `;
      }).join('')}
            </tr>

            <!-- 5. DM Qi (สภาวะ 12 ขั้นชีพเทียบกับดิถี) -->
            <tr>
              <td class="row-header-col">DM Qi<br><small style="font-size:10px; color:#94a3b8;">ชีพเทียบดิถี</small></td>
              ${columns.map(col => {
        if (col.isUnknown) return `<td><div class="basic-unknown-hour">-</div></td>`;
        const p = this.get12LifeStage(c.dayMaster.zh, col.pillar.branch.zh);
        return `
                  <td class="bazi-phase-cell">
                    <div><strong>${p.order}. ${p.en}</strong></div>
                    <div style="color: #64748b;">${p.py} / ${p.zh} ${p.symbol}</div>
                  </td>
                `;
      }).join('')}
            </tr>

            <!-- 6. Pillar Qi (สภาวะประจำเสา) -->
            <tr>
              <td class="row-header-col">Pillar Qi<br><small style="font-size:10px; color:#94a3b8;">ชีพประจำเสา</small></td>
              ${columns.map(col => {
        if (col.isUnknown) return `<td><div class="basic-unknown-hour">-</div></td>`;
        const p = this.get12LifeStage(col.pillar.stem.zh, col.pillar.branch.zh);
        return `
                  <td class="bazi-phase-cell">
                    <div><strong>${p.order}. ${p.en}</strong></div>
                    <div style="color: #64748b;">${p.py} / ${p.zh} ${p.symbol}</div>
                  </td>
                `;
      }).join('')}
            </tr>

            <!-- 7. Deity (สิบเทพ) -->
            <tr>
              <td class="row-header-col">Deity<br><small style="font-size:10px; color:#94a3b8;">สิบเทพ (Ten Gods)</small></td>
              ${columns.map(col => {
        if (col.isUnknown) return `<td><div class="basic-unknown-hour">-</div></td>`;
        const tg = col.isDM ? { zh: '日主', py: 'Day Master', th: 'ดิถีธาตุ (ตนเอง)' } : (col.pillar.tenGod || { zh: '比肩', py: 'Friend', th: 'สหาย' });
        return `
                  <td style="text-align: center; font-size: 12px; font-weight: 700; color: #475569;">
                    <div>${tg.zh} (${tg.py})</div>
                    <div style="font-size: 11px; color: #7c3aed; font-weight: 600;">${tg.th}</div>
                  </td>
                `;
      }).join('')}
            </tr>

            <!-- 8. Star (เทพและดาวชะตา 神煞) -->
            <tr>
              <td class="row-header-col">Star<br><small style="font-size:10px; color:#94a3b8;">เทพและดาวชะตา</small></td>
              ${columns.map(col => {
        if (col.isUnknown) return `<td><div class="basic-unknown-hour">-</div></td>`;
        const stars = this.computeDetailedStars(
          col.pillar.branch.zh,
          col.pillar.stem.zh,
          dayStem,
          dayBranch,
          yearBranch,
          monthBranch
        );
        return `
                  <td class="bazi-stars-cell">
                    ${stars.dmStars.length > 0 ? `
                      <div style="margin-bottom: 4px;">
                        <span style="color: #7c3aed; font-weight: 700;">★ DM:</span> ${stars.dmStars.join(', ')}
                      </div>
                    ` : ''}
                    ${stars.otherStars.length > 0 ? `
                      <div>
                        <span style="color: #0284c7; font-weight: 700;">★ Branch:</span> ${stars.otherStars.join(', ')}
                      </div>
                    ` : ''}
                    ${stars.dmStars.length === 0 && stars.otherStars.length === 0 ? '<span style="color: #94a3b8;">-</span>' : ''}
                  </td>
                `;
      }).join('')}
            </tr>

            <!-- 9. Interactions (ปฏิสัมพันธ์ 刑沖合害) -->
            <tr>
              <td class="row-header-col">Interactions<br><small style="font-size:10px; color:#94a3b8;">ภาคี/ชง/เฮ้ง/ไห่</small></td>
              ${columns.map(col => {
        if (col.isUnknown) return `<td><div class="basic-unknown-hour">-</div></td>`;
        const inter = this.computeDetailedInteractions(col.pillar, natalCols, null, null, 'natal');
        return `
                  <td class="bazi-interactions-cell">
                    ${inter.primary.length > 0 ? inter.primary.map(it => {
          const cls = this.getInteractionClass(it);
          const st = this.getInteractionStyle(it);
          const info = this.getInteractionTooltipData(it);
          const titleAttr = info ? `${info.title} - ${info.meaning}`.replace(/"/g, '&quot;') : '';
          const cleanIt = it.replace(/"/g, '&quot;');
          return `<div class="interaction-item ${cls}" style="${st}" data-interaction-text="${cleanIt}" title="${titleAttr}">${it}</div>`;
        }).join('') : '<div style="color: #94a3b8; font-size: 11px;">- ไม่มีจุดปะทะในพื้นดวง -</div>'}
                  </td>
                `;
      }).join('')}
            </tr>
          </tbody>
        </table>
      `;
    },

    renderAdvanceDaYunMasterTable: function (chart) {
      const container = document.getElementById('baziAdvanceDayunMasterTableWrap');
      if (!container || !chart || !chart.daYunPillars) return;

      const c = chart;
      const natalCols = [
        { ...c.pillars.hour, pillarKey: 'hour', label: 'เสายาม', palace: 'เสายาม: วังบริวาร/ลูกหลาน' },
        { ...c.pillars.day, pillarKey: 'day', label: 'เสาวัน', palace: 'เสาวัน: วังตัวตน/คู่ครอง' },
        { ...c.pillars.month, pillarKey: 'month', label: 'เสาเดือน', palace: 'เสาเดือน: วังการงาน/พ่อแม่' },
        { ...c.pillars.year, pillarKey: 'year', label: 'เสาปี', palace: 'เสาปี: วังบรรพบุรุษ/สิ่งแวดล้อม' }
      ];
      const dayStem = c.dayMaster;
      const dayBranch = c.pillars.day.branch;
      const yearBranch = c.pillars.year.branch;
      const monthBranch = c.pillars.month.branch;

      const pillars = this.daYunOrderRTL ? [...c.daYunPillars].reverse() : [...c.daYunPillars];

      const html = `
        <div class="bazi-master-table-meta-bar">
          <div class="meta-left">
            <span class="meta-title">10-Year Luck (วัยจร)</span>
            <span class="meta-subtitle">First LP begins: ${c.firstLPDate || c.birthDateString || '-'}</span>
          </div>
          <div class="meta-right">
            <span class="meta-note"><i class="fa-solid fa-circle-info"></i> คลิกที่หัวคอลัมน์เพื่อเลือกดูปีจรในวัยนั้น</span>
          </div>
        </div>
        <div class="bazi-table-responsive-box">
          <table class="bazi-master-luck-table">
            <thead>
              <tr>
                <th class="row-label-col"></th>
                ${pillars.map(dy => {
        const isSelected = this.selectedDaYunIndex === dy.index;
        const isCurrent = !!dy.isCurrent;
        const cls = `col-luck-hdr ${isCurrent ? 'current-period-hdr' : ''} ${isSelected ? 'selected-luck-hdr' : ''}`;
        return `
                    <th class="${cls}" onclick="window.BaziApp.selectDaYun(${dy.index})" title="คลิกเพื่อเลือกวัยจรนี้">
                      <div class="luck-hdr-period">${dy.headerTitle || dy.ageRange}</div>
                      ${isCurrent ? '<div class="luck-hdr-cur-tag">(current)</div>' : ''}
                    </th>
                  `;
      }).join('')}
              </tr>
            </thead>
            <tbody>
              <!-- Row 1: HS (Heavenly Stem) -->
              <tr>
                <td class="row-label-col">HS</td>
                ${pillars.map(dy => {
        const s = dy.stem;
        const tg = this.formatLuckTenGod(dy.tenGod);
        return `
                    <td class="elem-bg-${s.element}">
                      <div class="bazi-luck-pinyin">${s.py}</div>
                      <div class="bazi-luck-bigchar">${s.zh}</div>
                      <div class="bazi-luck-elem-pol">${s.element.charAt(0).toUpperCase() + s.element.slice(1)} ${s.polarity === 'yang' ? '+' : '-'}</div>
                      <div class="bazi-luck-tengod">${tg.en}<br>${tg.py} / ${tg.zh}</div>
                    </td>
                  `;
      }).join('')}
              </tr>

              <!-- Row 2: EB (Earthly Branch) -->
              <tr>
                <td class="row-label-col">EB</td>
                ${pillars.map(dy => {
        const b = dy.branch;
        const dh = this.getDominantHiddenStem(b.zh);
        const bTg = this.formatLuckTenGod(getTenGod(c.dayMaster, dh));
        const animal = b.animal || (b.zodiac ? b.zodiac.split(' ')[0] : '-');
        return `
                    <td class="elem-bg-${b.element}">
                      <div class="bazi-luck-pinyin">${b.py}</div>
                      <div class="bazi-luck-bigchar">${b.zh}</div>
                      <div class="bazi-luck-elem-pol">${animal}</div>
                      <div class="bazi-luck-tengod">${bTg.en}<br>${bTg.py} / ${bTg.zh}</div>
                    </td>
                  `;
      }).join('')}
              </tr>

              <!-- Row 3: HHS (Hidden Heavenly Stems) -->
              <tr>
                <td class="row-label-col">HHS</td>
                ${pillars.map(dy => {
        const b = dy.branch;
        const season = this.BRANCH_SEASONS[b.zh] || '';
        return `
                    <td class="bazi-hhs-cell">
                      <div class="bazi-hhs-flex-wrap">
                        ${b.hidden.map(h => {
          const sObj = STEMS.find(s => s.zh === h.stem) || STEMS[0];
          const tg = getTenGod(c.dayMaster, sObj);
          const abbr = this.TG_ABBR[tg.zh] || 'Fr';
          return `
                            <div class="bazi-hhs-mini-block elem-bg-${sObj.element}" title="${sObj.py} ${sObj.zh} - ${tg.zh}">
                              <div class="hhs-stem-py">${sObj.py}</div>
                              <div class="hhs-stem-zh">${sObj.zh}</div>
                              <div class="hhs-stem-tg">${abbr}</div>
                            </div>
                          `;
        }).join('')}
                      </div>
                      ${season ? `<div class="bazi-season-tag">${season}</div>` : ''}
                    </td>
                  `;
      }).join('')}
              </tr>

              <!-- Row 4: Na Yin -->
              <tr>
                <td class="row-label-col">Na Yin</td>
                ${pillars.map(dy => {
        const sIdx = STEMS.findIndex(s => s.zh === dy.stem.zh);
        const bIdx = BRANCHES.findIndex(b => b.zh === dy.branch.zh);
        const ny = this.getNaYinDetail(sIdx, bIdx);
        const ne = this.NAYIN_ELEM_INFO[ny.element] || { en: ny.element, py: '', zh: '' };
        return `
                    <td class="elem-bg-${ny.element}">
                      <div class="bazi-luck-nayin-text">${ne.en} / ${ne.py} / ${ne.zh}</div>
                    </td>
                  `;
      }).join('')}
              </tr>

              <!-- Row 5: DM's qi phase -->
              <tr>
                <td class="row-label-col">DM's qi phase</td>
                ${pillars.map(dy => {
        const p = this.get12LifeStage(c.dayMaster.zh, dy.branch.zh);
        return `
                    <td class="bazi-luck-phase-cell">
                      <div class="phase-name-en">${p.order}. ${p.en}</div>
                      <div class="phase-name-sub">/ ${p.py} / ${p.zh}</div>
                    </td>
                  `;
      }).join('')}
              </tr>

              <!-- Row 6: Symbolic stars / 神煞 & Interactions -->
              <tr>
                <td class="row-label-col"></td>
                ${pillars.map(dy => {
        const isCurrent = !!dy.isCurrent;
        const stars = this.computeDetailedStars(
          dy.branch.zh,
          dy.stem.zh,
          dayStem,
          dayBranch,
          yearBranch,
          monthBranch
        );
        const allStars = [...stars.dmStars, ...stars.otherStars];
        const inter = this.computeDetailedInteractions(
          { stem: dy.stem, branch: dy.branch },
          natalCols,
          null,
          null,
          'dayun'
        );
        const allInter = [...inter.primary, ...inter.secondary];

        const starItemsHtml = allStars.length > 0
          ? allStars.map(s => {
              const cleanS = s.replace(/"/g, '&quot;');
              return `<div class="luck-star-item" data-star-text="${cleanS}">${s}</div>`;
            }).join('')
          : '<div class="luck-empty-item">-</div>';

        const interItemsHtml = allInter.length > 0
          ? allInter.map(it => {
              const cls = this.getInteractionClass(it);
              const st = this.getInteractionStyle(it);
              const cleanIt = it.replace(/"/g, '&quot;');
              return `<div class="luck-inter-item ${cls}" style="${st}" data-interaction-text="${cleanIt}">${it}</div>`;
            }).join('')
          : '<div class="luck-empty-item">-</div>';

        return `
                    <td class="luck-table-stars-inter">
                      ${isCurrent ? '<div class="current-period-callout">(current period)</div>' : ''}
                      <div class="luck-section-box star-section-box">
                        <div class="luck-section-hdr star-section-hdr">
                          <i class="fa-solid fa-star"></i>
                          <span>Symbolic stars / 神煞:</span>
                        </div>
                        <div class="luck-cell-items-wrap">
                          ${starItemsHtml}
                        </div>
                      </div>
                      <div class="luck-section-box inter-section-box">
                        <div class="luck-section-hdr inter-section-hdr">
                          <i class="fa-solid fa-bolt"></i>
                          <span>Interactions:</span>
                        </div>
                        <div class="luck-cell-items-wrap">
                          ${interItemsHtml}
                        </div>
                      </div>
                    </td>
                  `;
      }).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      `;

      container.innerHTML = html;
    },

    renderAdvanceAnnualMasterTable: function (chart, targetYear) {
      const container = document.getElementById('baziAdvanceAnnualMasterTableWrap');
      if (!container || !chart) return;

      const c = chart;
      const natalCols = [
        { ...c.pillars.hour, pillarKey: 'hour', label: 'เสายาม', palace: 'เสายาม: วังบริวาร/ลูกหลาน' },
        { ...c.pillars.day, pillarKey: 'day', label: 'เสาวัน', palace: 'เสาวัน: วังตัวตน/คู่ครอง' },
        { ...c.pillars.month, pillarKey: 'month', label: 'เสาเดือน', palace: 'เสาเดือน: วังการงาน/พ่อแม่' },
        { ...c.pillars.year, pillarKey: 'year', label: 'เสาปี', palace: 'เสาปี: วังบรรพบุรุษ/สิ่งแวดล้อม' }
      ];
      const dayStem = c.dayMaster;
      const dayBranch = c.pillars.day.branch;
      const yearBranch = c.pillars.year.branch;
      const monthBranch = c.pillars.month.branch;

      const birthYear = c.birthDateString ? parseInt(c.birthDateString.split('-')[0], 10) : new Date().getFullYear();
      const currentYear = new Date().getFullYear();
      const curDaYun = (c.daYunPillars && c.daYunPillars[this.selectedDaYunIndex]) || (c.daYunPillars && c.daYunPillars.find(d => d.isCurrent)) || (c.daYunPillars && c.daYunPillars[0]);
      const luckPillar = curDaYun ? { stem: curDaYun.stem, branch: curDaYun.branch, label: `วัยจร ${curDaYun.ageRange}` } : null;

      let startYear = this.advanceAnnualStartYear;
      if (!startYear) {
        if (curDaYun && curDaYun.yearFrom) {
          startYear = curDaYun.yearFrom;
        } else {
          startYear = (targetYear || currentYear) - 4;
        }
        this.advanceAnnualStartYear = startYear;
      }
      const endYear = startYear + 9;

      const annualList = [];
      for (let yr = startYear; yr <= endYear; yr++) {
        const yrSIdx = ((yr - 4) % 10 + 10) % 10;
        const yrBIdx = ((yr - 4) % 12 + 12) % 12;
        const stem = STEMS[yrSIdx];
        const branch = BRANCHES[yrBIdx];
        const age = yr - birthYear;
        const isCurrent = yr === currentYear;
        const isSelected = yr === (this.selectedYear || currentYear);
        const tg = getTenGod(c.dayMaster, stem);
        const ny = this.getNaYinDetail(yrSIdx, yrBIdx);

        annualList.push({
          year: yr,
          age,
          stem,
          branch,
          tenGod: tg,
          naYin: ny,
          stemIdx: yrSIdx,
          branchIdx: yrBIdx,
          isCurrent,
          isSelected
        });
      }

      const displayAnnuals = this.daYunOrderRTL ? [...annualList].reverse() : [...annualList];

      const html = `
        <div class="bazi-master-table-meta-bar">
          <div class="meta-left">
            <span class="meta-title">Annual Luck (ปีจร / 流年)</span>
            <span class="meta-subtitle">ช่วงปี: ${startYear} - ${endYear} ${curDaYun ? `(ตรงกับวัยจร ${curDaYun.ageRange})` : ''}</span>
          </div>
          <div class="meta-nav-controls">
            <button type="button" class="btn-annual-nav" onclick="window.BaziApp.shiftAdvanceAnnual(-10)" title="10 ปีก่อนหน้า">
              <i class="fa-solid fa-chevron-left"></i> 10 ปีก่อนหน้า
            </button>
            <button type="button" class="btn-annual-nav btn-annual-now" onclick="window.BaziApp.shiftAdvanceAnnual(${currentYear - startYear})" title="กลับมาปีปัจจุบัน">
              ปีปัจจุบัน (${currentYear})
            </button>
            <button type="button" class="btn-annual-nav" onclick="window.BaziApp.shiftAdvanceAnnual(10)" title="10 ปีถัดไป">
              10 ปีถัดไป <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
        <div class="bazi-table-responsive-box">
          <table class="bazi-master-luck-table">
            <thead>
              <tr>
                <th class="row-label-col"></th>
                ${displayAnnuals.map(an => {
        const cls = `col-luck-hdr ${an.isCurrent ? 'current-period-hdr' : ''} ${an.isSelected ? 'selected-luck-hdr' : ''}`;
        return `
                    <th class="${cls}" onclick="window.BaziApp.selectAnnualYear(${an.year})" title="คลิกเพื่อเลือกปีนี้">
                      <div class="luck-hdr-period">${an.year}</div>
                      <div style="font-size: 11px; font-weight: 500; opacity: 0.9;">(${an.age} ปี)</div>
                      ${an.isCurrent ? '<div class="luck-hdr-cur-tag">(ปีนี้)</div>' : ''}
                    </th>
                  `;
      }).join('')}
              </tr>
            </thead>
            <tbody>
              <!-- Row 1: HS (Heavenly Stem) -->
              <tr>
                <td class="row-label-col">HS</td>
                ${displayAnnuals.map(an => {
        const s = an.stem;
        const tg = this.formatLuckTenGod(an.tenGod);
        return `
                    <td class="elem-bg-${s.element}">
                      <div class="bazi-luck-pinyin">${s.py}</div>
                      <div class="bazi-luck-bigchar">${s.zh}</div>
                      <div class="bazi-luck-elem-pol">${s.element.charAt(0).toUpperCase() + s.element.slice(1)} ${s.polarity === 'yang' ? '+' : '-'}</div>
                      <div class="bazi-luck-tengod">${tg.en}<br>${tg.py} / ${tg.zh}</div>
                    </td>
                  `;
      }).join('')}
              </tr>

              <!-- Row 2: EB (Earthly Branch) -->
              <tr>
                <td class="row-label-col">EB</td>
                ${displayAnnuals.map(an => {
        const b = an.branch;
        const dh = this.getDominantHiddenStem(b.zh);
        const bTg = this.formatLuckTenGod(getTenGod(c.dayMaster, dh));
        const animal = b.animal || (b.zodiac ? b.zodiac.split(' ')[0] : '-');
        return `
                    <td class="elem-bg-${b.element}">
                      <div class="bazi-luck-pinyin">${b.py}</div>
                      <div class="bazi-luck-bigchar">${b.zh}</div>
                      <div class="bazi-luck-elem-pol">${animal}</div>
                      <div class="bazi-luck-tengod">${bTg.en}<br>${bTg.py} / ${bTg.zh}</div>
                    </td>
                  `;
      }).join('')}
              </tr>

              <!-- Row 3: HHS (Hidden Heavenly Stems) -->
              <tr>
                <td class="row-label-col">HHS</td>
                ${displayAnnuals.map(an => {
        const b = an.branch;
        const season = this.BRANCH_SEASONS[b.zh] || '';
        return `
                    <td class="bazi-hhs-cell">
                      <div class="bazi-hhs-flex-wrap">
                        ${b.hidden.map(h => {
          const sObj = STEMS.find(s => s.zh === h.stem) || STEMS[0];
          const tg = getTenGod(c.dayMaster, sObj);
          const abbr = this.TG_ABBR[tg.zh] || 'Fr';
          return `
                            <div class="bazi-hhs-mini-block elem-bg-${sObj.element}" title="${sObj.py} ${sObj.zh} - ${tg.zh}">
                              <div class="hhs-stem-py">${sObj.py}</div>
                              <div class="hhs-stem-zh">${sObj.zh}</div>
                              <div class="hhs-stem-tg">${abbr}</div>
                            </div>
                          `;
        }).join('')}
                      </div>
                      ${season ? `<div class="bazi-season-tag">${season}</div>` : ''}
                    </td>
                  `;
      }).join('')}
              </tr>

              <!-- Row 4: Na Yin -->
              <tr>
                <td class="row-label-col">Na Yin</td>
                ${displayAnnuals.map(an => {
        const ny = an.naYin;
        const ne = this.NAYIN_ELEM_INFO[ny.element] || { en: ny.element, py: '', zh: '' };
        return `
                    <td class="elem-bg-${ny.element}">
                      <div class="bazi-luck-nayin-text">${ne.en} / ${ne.py} / ${ne.zh}</div>
                    </td>
                  `;
      }).join('')}
              </tr>

              <!-- Row 5: DM's qi phase -->
              <tr>
                <td class="row-label-col">DM's qi phase</td>
                ${displayAnnuals.map(an => {
        const p = this.get12LifeStage(c.dayMaster.zh, an.branch.zh);
        return `
                    <td class="bazi-luck-phase-cell">
                      <div class="phase-name-en">${p.order}. ${p.en}</div>
                      <div class="phase-name-sub">/ ${p.py} / ${p.zh}</div>
                    </td>
                  `;
      }).join('')}
              </tr>

              <!-- Row 6: Symbolic stars / 神煞 & Interactions -->
              <tr>
                <td class="row-label-col"></td>
                ${displayAnnuals.map(an => {
        const isCurrent = !!an.isCurrent;
        const stars = this.computeDetailedStars(
          an.branch.zh,
          an.stem.zh,
          dayStem,
          dayBranch,
          yearBranch,
          monthBranch
        );
        const allStars = [...stars.dmStars, ...stars.otherStars];
        const inter = this.computeDetailedInteractions(
          { stem: an.stem, branch: an.branch },
          natalCols,
          null,
          luckPillar,
          'annual'
        );
        const allInter = [...inter.primary, ...inter.secondary];

        const starItemsHtml = allStars.length > 0
          ? allStars.map(s => {
              const cleanS = s.replace(/"/g, '&quot;');
              return `<div class="luck-star-item" data-star-text="${cleanS}">${s}</div>`;
            }).join('')
          : '<div class="luck-empty-item">-</div>';

        const interItemsHtml = allInter.length > 0
          ? allInter.map(it => {
              const cls = this.getInteractionClass(it);
              const st = this.getInteractionStyle(it);
              const cleanIt = it.replace(/"/g, '&quot;');
              return `<div class="luck-inter-item ${cls}" style="${st}" data-interaction-text="${cleanIt}">${it}</div>`;
            }).join('')
          : '<div class="luck-empty-item">-</div>';

        return `
                    <td class="luck-table-stars-inter">
                      ${isCurrent ? '<div class="current-period-callout">(current year)</div>' : ''}
                      <div class="luck-section-box star-section-box">
                        <div class="luck-section-hdr star-section-hdr">
                          <i class="fa-solid fa-star"></i>
                          <span>Symbolic stars / 神煞:</span>
                        </div>
                        <div class="luck-cell-items-wrap">
                          ${starItemsHtml}
                        </div>
                      </div>
                      <div class="luck-section-box inter-section-box">
                        <div class="luck-section-hdr inter-section-hdr">
                          <i class="fa-solid fa-bolt"></i>
                          <span>Interactions:</span>
                        </div>
                        <div class="luck-cell-items-wrap">
                          ${interItemsHtml}
                        </div>
                      </div>
                    </td>
                  `;
      }).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      `;

      container.innerHTML = html;
    },

    renderAdvanceMonthlyMasterTable: function (chart, targetYear) {
      const container = document.getElementById('baziAdvanceMonthlyMasterTableWrap');
      if (!container || !chart) return;

      const c = chart;
      const y = parseInt(targetYear, 10) || this.selectedYear || new Date().getFullYear();
      const months = BaziEngine.calculateMonthlyFortune(c, y);
      if (!months || months.length === 0) return;

      const natalCols = [
        { ...c.pillars.hour, pillarKey: 'hour', label: 'เสายาม', palace: 'เสายาม: วังบริวาร/ลูกหลาน' },
        { ...c.pillars.day, pillarKey: 'day', label: 'เสาวัน', palace: 'เสาวัน: วังตัวตน/คู่ครอง' },
        { ...c.pillars.month, pillarKey: 'month', label: 'เสาเดือน', palace: 'เสาเดือน: วังการงาน/พ่อแม่' },
        { ...c.pillars.year, pillarKey: 'year', label: 'เสาปี', palace: 'เสาปี: วังบรรพบุรุษ/สิ่งแวดล้อม' }
      ];
      const dayStem = c.dayMaster;
      const dayBranch = c.pillars.day.branch;
      const yearBranch = c.pillars.year.branch;
      const monthBranch = c.pillars.month.branch;

      // Annual Col
      const yrSIdx = ((y - 4) % 10 + 10) % 10;
      const yrBIdx = ((y - 4) % 12 + 12) % 12;
      const annualCol = { stem: STEMS[yrSIdx], branch: BRANCHES[yrBIdx], label: `ปีจร ${y}` };

      // Da Yun Col
      const birthYear = c.birthDateString ? parseInt(c.birthDateString.split('-')[0], 10) : new Date().getFullYear();
      const ageInYear = y - birthYear;
      const curDaYun = (c.daYunPillars || []).find(d => ageInYear >= d.ageFrom && ageInYear <= d.ageTo);
      const luckCol = curDaYun ? { stem: curDaYun.stem, branch: curDaYun.branch, label: `วัยจร ${curDaYun.ageRange}` } : null;

      const displayMonths = this.daYunOrderRTL ? [...months].reverse() : [...months];

      const html = `
        <div class="bazi-master-table-meta-bar">
          <div class="meta-left">
            <span class="meta-title">Monthly Luck (ดวงเดือน 12 สารท / 流月) - ปี ${y} (${annualCol.stem.zh}${annualCol.branch.zh})</span>
            <span class="meta-subtitle">${curDaYun ? `ตรงกับวัยจร: ${curDaYun.ageRange} (${curDaYun.stem.zh}${curDaYun.branch.zh})` : ''}</span>
          </div>
          <div class="meta-right">
            <span class="meta-note"><i class="fa-solid fa-circle-info"></i> คลิกที่หัวคอลัมน์เพื่อเลือกดูคำทำนายเจาะลึกประจำเดือนนั้น</span>
          </div>
        </div>
        <div class="bazi-table-responsive-box">
          <table class="bazi-master-luck-table">
            <thead>
              <tr>
                <th class="row-label-col"></th>
                ${displayMonths.map(m => {
        const isSelected = this.selectedMonthIndex === m.index;
        const isCurrent = !!m.isCurrent;
        const cls = `col-luck-hdr col-month-hdr ${isCurrent ? 'current-period-hdr' : ''} ${isSelected ? 'selected-luck-hdr' : ''}`;
        return `
                    <th class="${cls}" data-month-index="${m.index}" onclick="window.BaziApp.selectMonth(${m.index})" title="คลิกเพื่อเลือกเดือนนี้">
                      <div class="luck-hdr-period">เดือน ${m.monthNum}</div>
                      <div style="font-size: 10.5px; font-weight: 500; opacity: 0.9;">${m.dates.split(' - ')[0]}</div>
                      ${isCurrent ? '<div class="luck-hdr-cur-tag">(เดือนนี้)</div>' : ''}
                    </th>
                  `;
      }).join('')}
              </tr>
            </thead>
            <tbody>
              <!-- Row 1: HS (Heavenly Stem) -->
              <tr>
                <td class="row-label-col">HS</td>
                ${displayMonths.map(m => {
        const s = m.stem;
        const tg = this.formatLuckTenGod(m.stemGod);
        return `
                    <td class="elem-bg-${s.element}">
                      <div class="bazi-luck-pinyin">${s.py}</div>
                      <div class="bazi-luck-bigchar">${s.zh}</div>
                      <div class="bazi-luck-elem-pol">${s.element.charAt(0).toUpperCase() + s.element.slice(1)} ${s.polarity === 'yang' ? '+' : '-'}</div>
                      <div class="bazi-luck-tengod">${tg.en}<br>${tg.py} / ${tg.zh}</div>
                    </td>
                  `;
      }).join('')}
              </tr>

              <!-- Row 2: EB (Earthly Branch) -->
              <tr>
                <td class="row-label-col">EB</td>
                ${displayMonths.map(m => {
        const b = m.branch;
        const dh = this.getDominantHiddenStem(b.zh);
        const bTg = this.formatLuckTenGod(getTenGod(c.dayMaster, dh));
        const animal = b.animal || (b.zodiac ? b.zodiac.split(' ')[0] : '-');
        return `
                    <td class="elem-bg-${b.element}">
                      <div class="bazi-luck-pinyin">${b.py}</div>
                      <div class="bazi-luck-bigchar">${b.zh}</div>
                      <div class="bazi-luck-elem-pol">${animal}</div>
                      <div class="bazi-luck-tengod">${bTg.en}<br>${bTg.py} / ${bTg.zh}</div>
                    </td>
                  `;
      }).join('')}
              </tr>

              <!-- Row 3: HHS (Hidden Heavenly Stems) -->
              <tr>
                <td class="row-label-col">HHS</td>
                ${displayMonths.map(m => {
        const b = m.branch;
        const season = this.BRANCH_SEASONS[b.zh] || '';
        return `
                    <td class="bazi-hhs-cell">
                      <div class="bazi-hhs-flex-wrap">
                        ${b.hidden.map(h => {
          const sObj = STEMS.find(s => s.zh === h.stem) || STEMS[0];
          const tg = getTenGod(c.dayMaster, sObj);
          const abbr = this.TG_ABBR[tg.zh] || 'Fr';
          return `
                            <div class="bazi-hhs-mini-block elem-bg-${sObj.element}" title="${sObj.py} ${sObj.zh} - ${tg.zh}">
                              <div class="hhs-stem-py">${sObj.py}</div>
                              <div class="hhs-stem-zh">${sObj.zh}</div>
                              <div class="hhs-stem-tg">${abbr}</div>
                            </div>
                          `;
        }).join('')}
                      </div>
                      ${season ? `<div class="bazi-season-tag">${season}</div>` : ''}
                    </td>
                  `;
      }).join('')}
              </tr>

              <!-- Row 4: Na Yin -->
              <tr>
                <td class="row-label-col">Na Yin</td>
                ${displayMonths.map(m => {
        const ny = m.naYinDetail || this.getNaYinDetail(m.stemIdx, m.branchIdx);
        const ne = this.NAYIN_ELEM_INFO[ny.element] || { en: ny.element, py: '', zh: '' };
        return `
                    <td class="elem-bg-${ny.element}">
                      <div class="bazi-luck-nayin-text">${ne.en} / ${ne.py} / ${ne.zh}</div>
                    </td>
                  `;
      }).join('')}
              </tr>

              <!-- Row 5: DM's qi phase -->
              <tr>
                <td class="row-label-col">DM's qi phase</td>
                ${displayMonths.map(m => {
        const p = this.get12LifeStage(c.dayMaster.zh, m.branch.zh);
        return `
                    <td class="bazi-luck-phase-cell">
                      <div class="phase-name-en">${p.order}. ${p.en}</div>
                      <div class="phase-name-sub">/ ${p.py} / ${p.zh}</div>
                    </td>
                  `;
      }).join('')}
              </tr>

              <!-- Row 6: Symbolic stars / 神煞 & Interactions -->
              <tr>
                <td class="row-label-col"></td>
                ${displayMonths.map(m => {
        const isCurrent = !!m.isCurrent;
        const stars = this.computeDetailedStars(
          m.branch.zh,
          m.stem.zh,
          dayStem,
          dayBranch,
          yearBranch,
          monthBranch
        );
        const allStars = [...stars.dmStars, ...stars.otherStars];
        const mCol = { stem: m.stem, branch: m.branch, label: `เดือนที่ ${m.monthNum} (${m.branch.zh})` };
        const inter = this.computeDetailedInteractions(
          mCol,
          natalCols,
          annualCol,
          luckCol,
          'monthly'
        );
        const allInter = [...inter.primary, ...inter.secondary];

        const starItemsHtml = allStars.length > 0
          ? allStars.map(s => {
              const cleanS = s.replace(/"/g, '&quot;');
              return `<div class="luck-star-item" data-star-text="${cleanS}">${s}</div>`;
            }).join('')
          : '<div class="luck-empty-item">-</div>';

        const interItemsHtml = allInter.length > 0
          ? allInter.map(it => {
              const cls = this.getInteractionClass(it);
              const st = this.getInteractionStyle(it);
              const cleanIt = it.replace(/"/g, '&quot;');
              return `<div class="luck-inter-item ${cls}" style="${st}" data-interaction-text="${cleanIt}">${it}</div>`;
            }).join('')
          : '<div class="luck-empty-item">-</div>';

        return `
                    <td class="luck-table-stars-inter">
                      ${isCurrent ? '<div class="current-period-callout">(current month)</div>' : ''}
                      <div class="luck-section-box star-section-box">
                        <div class="luck-section-hdr star-section-hdr">
                          <i class="fa-solid fa-star"></i>
                          <span>Symbolic stars / 神煞:</span>
                        </div>
                        <div class="luck-cell-items-wrap">
                          ${starItemsHtml}
                        </div>
                      </div>
                      <div class="luck-section-box inter-section-box">
                        <div class="luck-section-hdr inter-section-hdr">
                          <i class="fa-solid fa-bolt"></i>
                          <span>Interactions:</span>
                        </div>
                        <div class="luck-cell-items-wrap">
                          ${interItemsHtml}
                        </div>
                      </div>
                    </td>
                  `;
      }).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      `;

      container.innerHTML = html;
    },

    prevDaYun: function () {
      if (!this.currentChart || !this.currentChart.daYunPillars) return;
      const count = this.currentChart.daYunPillars.length;
      let idx = (this.selectedDaYunIndex !== null && this.selectedDaYunIndex !== undefined) ? this.selectedDaYunIndex : 0;
      if (idx > 0) {
        this.selectDaYun(idx - 1);
      } else {
        this.showToast('อยู่วัยจรเริ่มต้นแล้วค่ะ');
      }
    },

    nextDaYun: function () {
      if (!this.currentChart || !this.currentChart.daYunPillars) return;
      const count = this.currentChart.daYunPillars.length;
      let idx = (this.selectedDaYunIndex !== null && this.selectedDaYunIndex !== undefined) ? this.selectedDaYunIndex : 0;
      if (idx < count - 1) {
        this.selectDaYun(idx + 1);
      } else {
        this.showToast('อยู่วัยจรสุดท้ายแล้วค่ะ');
      }
    },

    toggleDailyShowcase: function () {
      const showcase = document.getElementById('baziGuestDailyShowcase');
      const arrow = document.getElementById('baziDailyAccordionArrow');
      if (showcase) {
        showcase.classList.toggle('hidden');
        if (arrow) arrow.classList.toggle('rotated', !showcase.classList.contains('hidden'));
      }
    },

    init: function () {
      this.loadSavedProfiles();
      this.populateDateTimeDropdowns();
      this.setDefaultCurrentDateTimeInputs();
      this.syncDateInputToDropdowns();
      this.syncTimeInputToDropdowns();
      this.initGuestInputs();
      this.renderQuickProfileSelect();
      this.bindEvents();
      this.initInteractionTooltips();

      const isAuth = this.isLoggedIn();
      if (!isAuth) {
        this.currentMode = 'basic';
      }
      const curUser = window.AuthManager ? window.AuthManager.currentUser : null;
      this.updateViewForAuthState(isAuth, curUser);

      // Restore active chart immediately so refresh always keeps data stable
      this.restoreActiveChart(false);
      this.switchSubMenu(this.currentSubMenu || 'advance');
      this.switchMode(this.currentMode, true);

      // If arriving with explicit query parameters
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const queryQ = urlParams.get('q');
        if (queryQ) {
          this.fillAndRunCustomQuery(queryQ);
        }
      } catch (e) { }
    },

    onAuthStateChange: function (isLoggedIn, currentUser) {
      this.updateViewForAuthState(isLoggedIn, currentUser);
    },

    updateViewForAuthState: function (isLoggedIn, currentUser) {
      const guestView = document.getElementById('baziGuestLandingView');
      const loggedInView = document.getElementById('baziLoggedInAppView');
      const memberHeader = document.getElementById('baziMemberHeaderCard');
      const toolbarCard = document.getElementById('baziToolbarCard');
      const profileField = document.querySelector('.bazi-field-profile');
      const expertLockBadge = document.getElementById('baziExpertLockBadge');

      if (loggedInView) {
        loggedInView.style.display = 'flex';
      }
      if (expertLockBadge) {
        expertLockBadge.style.display = isLoggedIn ? 'none' : 'inline-flex';
      }

      // Consistently show the unified Bazi app views
      if (this.currentChart) {
        this.renderBasicSuite(this.currentChart);
        this.renderAdvanceSuite(this.currentChart);
      }
      this.renderQuickProfileSelect();
    },

    updateMemberHeader: function (user) {
      const nameEl = document.getElementById('baziMemberName');
      const metaEl = document.getElementById('baziMemberMeta');
      const avatarEl = document.getElementById('baziMemberAvatar');
      const countTop = document.getElementById('baziSavedCountTop');
      if (countTop) countTop.textContent = this.savedProfiles.length;

      if (!user) {
        if (nameEl) nameEl.textContent = 'ผังชะตาปาจื่อ (BaZi Pro Matrix)';
        if (metaEl) metaEl.textContent = 'เครื่องมือผูกดวง 4 เสาชะตา วัยจร 10 ปี และโต๊ะหมอดูระดับซินแส';
        if (avatarEl) avatarEl.innerHTML = `<i class="fa-solid fa-yin-yang" style="color: #7c3aed; font-size: 26px;"></i>`;
        return;
      }

      if (nameEl) {
        nameEl.textContent = `ผังชะตาของ: ${user.name || user.firstName || 'สมาชิก'}`;
      }
      if (metaEl) {
        const bDate = user.birthDate || 'ยังไม่ได้ระบุวันเกิด';
        const bTime = user.birthTime ? `${user.birthTime} น.` : 'ไม่ระบุเวลา';
        const gender = user.gender === 'female' ? 'หญิง' : 'ชาย';
        metaEl.textContent = `วันเกิด: ${bDate} • เวลา: ${bTime} • เพศ: ${gender}`;
      }
      if (avatarEl) {
        if (user.photoURL) {
          avatarEl.innerHTML = `<img src="${user.photoURL}" alt="avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        } else {
          avatarEl.innerHTML = `<i class="fa-solid fa-circle-user"></i>`;
        }
      }
    },

    loadMyProfileChart: function () {
      const user = window.AuthManager ? window.AuthManager.currentUser : null;
      if (!user || !user.birthDate) {
        this.showToast('ยังไม่มีข้อมูลวันเกิดในโปรไฟล์ กรุณาระบุวันเดือนปีเกิดด้านบนค่ะ', 'info');
        return;
      }
      const nameInput = document.getElementById('baziNameInput');
      const dateInput = document.getElementById('baziDateInput');
      const hourInput = document.getElementById('baziHourInput');
      const genderSelect = document.getElementById('baziGenderSelect');
      const quickSel = document.getElementById('baziQuickProfileSelect');

      const name = (user.name || user.firstName) ? (user.name || user.firstName) : 'โปรไฟล์ของฉัน';
      const birthDate = user.birthDate;
      const birthTime = user.birthTime || '12:00';
      const gender = user.gender || 'female';

      if (nameInput) nameInput.value = name;
      if (dateInput) dateInput.value = birthDate;
      if (hourInput) hourInput.value = birthTime;
      if (genderSelect) genderSelect.value = gender;
      if (quickSel) quickSel.value = '__my_profile__';
      this.syncDateInputToDropdowns();
      this.syncTimeInputToDropdowns();

      this.switchMode('basic');
      this.calculateFromInputs(true);
    },

    initGuestInputs: function () {
      const daySel = document.getElementById('baziGuestBirthDay');
      const monthSel = document.getElementById('baziGuestBirthMonth');
      const yearSel = document.getElementById('baziGuestBirthYear');
      const hourSel = document.getElementById('baziGuestBirthHour');
      const minSel = document.getElementById('baziGuestBirthMinute');
      const unknownCheck = document.getElementById('baziGuestUnknownTimeCheck');
      const unknownWrap = document.getElementById('baziGuestUnknownTimeWrap');
      const timeWrap = document.getElementById('baziGuestTimeSelectsWrap');
      const timeNotice = document.getElementById('baziGuestUnknownTimeNotice');
      const dateInput = document.getElementById('baziGuestDateInput');
      const hourInput = document.getElementById('baziGuestHourInput');

      // Populate Days 1-31
      if (daySel && daySel.options.length === 0) {
        for (let d = 1; d <= 31; d++) {
          const opt = document.createElement('option');
          opt.value = d;
          opt.textContent = `วันที่ ${d}`;
          daySel.appendChild(opt);
        }
      }

      // Populate Years (Current down to 1930)
      if (yearSel && yearSel.options.length === 0) {
        const currentYear = new Date().getFullYear();
        for (let y = currentYear; y >= 1930; y--) {
          const opt = document.createElement('option');
          opt.value = y;
          const beYear = y + 543;
          opt.textContent = `${y} (พ.ศ. ${beYear})`;
          yearSel.appendChild(opt);
        }
      }

      // Populate Hours 00-23
      if (hourSel && hourSel.options.length === 0) {
        for (let h = 0; h < 24; h++) {
          const opt = document.createElement('option');
          opt.value = h;
          const padH = String(h).padStart(2, '0');
          const timeDesc = h < 6 ? 'ย่ำรุ่ง' : h < 11 ? 'เช้า' : h <= 13 ? 'เที่ยง' : h < 18 ? 'บ่าย' : 'ค่ำ/ดึก';
          opt.textContent = `${padH}:00 น. (${timeDesc})`;
          if (h === 15) opt.selected = true;
          hourSel.appendChild(opt);
        }
      }

      // Populate Minutes 00-55
      if (minSel && minSel.options.length === 0) {
        for (let m = 0; m < 60; m += 5) {
          const opt = document.createElement('option');
          opt.value = m;
          opt.textContent = `${String(m).padStart(2, '0')} นาที`;
          if (m === 45) opt.selected = true;
          minSel.appendChild(opt);
        }
      }

      // Sync function for date dropdowns -> hidden date input
      const syncDate = () => {
        if (!daySel || !monthSel || !yearSel || !dateInput) return;
        const y = parseInt(yearSel.value, 10) || 1998;
        const m = parseInt(monthSel.value, 10) || 8;
        let d = parseInt(daySel.value, 10) || 18;

        const maxDays = new Date(y, m, 0).getDate();
        if (d > maxDays) d = maxDays;

        if (daySel.options.length !== maxDays) {
          daySel.innerHTML = '';
          for (let i = 1; i <= maxDays; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = `วันที่ ${i}`;
            if (i === d) opt.selected = true;
            daySel.appendChild(opt);
          }
        }

        dateInput.value = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      };

      // Sync function for time dropdowns -> hidden time input
      const syncTime = () => {
        if (!hourSel || !minSel || !hourInput) return;
        const h = parseInt(hourSel.value, 10) || 0;
        const m = parseInt(minSel.value, 10) || 0;
        hourInput.value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      };

      // Sync function for unknown time checkbox
      const applyUnknownTimeState = () => {
        if (!unknownCheck) return;
        const isUnknown = unknownCheck.checked;
        if (unknownWrap) unknownWrap.classList.toggle('active', isUnknown);
        if (timeWrap) timeWrap.classList.toggle('time-disabled', isUnknown);
        if (timeNotice) timeNotice.classList.toggle('hidden', !isUnknown);
        if (hourSel) hourSel.disabled = isUnknown;
        if (minSel) minSel.disabled = isUnknown;
      };

      // Ensure result container is hidden on initial view if no calculation yet
      const resultContainer = document.getElementById('baziGuestResultContainer');
      if (resultContainer && !this.guestCurrentResult) {
        resultContainer.classList.add('hidden');
      }

      if (daySel) daySel.onchange = syncDate;
      if (monthSel) monthSel.onchange = syncDate;
      if (yearSel) yearSel.onchange = syncDate;
      if (hourSel) hourSel.onchange = syncTime;
      if (minSel) minSel.onchange = syncTime;
      if (unknownCheck) unknownCheck.onchange = applyUnknownTimeState;

      syncDate();
      syncTime();
      applyUnknownTimeState();
      this.renderDailyBaZiShowcase();
    },

    renderDailyBaZiShowcase: function () {
      const showcase = document.getElementById('baziGuestDailyShowcase');
      if (!showcase) return;

      const now = new Date();
      const y = now.getFullYear();
      const m = now.getMonth();
      const d = now.getDate();
      const todayDateStr = y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');

      // 1. Live Clock
      const clockText = document.getElementById('dailyLiveClockText');
      if (clockText) {
        clockText.textContent = now.toLocaleTimeString('th-TH', { hour12: false }) + ' น.';
      }
      if (!this._dailyClockInterval) {
        this._dailyClockInterval = setInterval(() => {
          const el = document.getElementById('dailyLiveClockText');
          if (el) {
            el.textContent = new Date().toLocaleTimeString('th-TH', { hour12: false }) + ' น.';
          }
        }, 1000);
      }

      // 2. Calculate Today's BaZi Chart
      const dailyChart = BaziEngine.calculateChart({
        birthDate: todayDateStr,
        birthHour: now.getHours(),
        birthMinute: now.getMinutes(),
        gender: 'female',
        name: 'ผังดวงประจำวัน'
      });

      // 3. Calculate Today's Tong Shu info (12 Day Officers, Lunar Date, etc.)
      let tongshuInfo = null;
      if (window.TongShuEngine && typeof window.TongShuEngine.calculate === 'function') {
        tongshuInfo = window.TongShuEngine.calculate(now);
      }

      // 12 Day Officers data definition
      const ALL_12_OFFICERS = (window.TongShuEngine && window.TongShuEngine.DAY_OFFICERS) ? window.TongShuEngine.DAY_OFFICERS : [
        { zh: '建', py: 'Jiàn', en: 'Establish', th: 'เจี้ยน (สถาปนา/ริเริ่ม)', quality: 'มงคล', rating: 4, stars: '⭐⭐⭐⭐', badgeClass: 'officer-auspicious', desc: 'วันแห่งการสถาปนา ริเริ่มสิ่งใหม่ เริ่มแผนการงานใหญ่ รับตำแหน่ง', suitable: ['เปิดกิจการ', 'ลงนามเริ่มต้นโครงการ', 'ไหว้พระขอพร', 'รับตำแหน่งใหม่', 'ท่องเที่ยวเปิดหูเปิดตา'], taboo: ['ขุดสระน้ำ', 'จัดงานอวมงคล', 'เดินทางไกลข้ามน้ำข้ามทะเล'] },
        { zh: '除', py: 'Chú', en: 'Remove', th: 'ฉู (ปัดเป่า/ชำระล้าง)', quality: 'มงคล', rating: 4, stars: '⭐⭐⭐⭐', badgeClass: 'officer-auspicious', desc: 'วันแห่งการขจัดสิ่งอัปมงคล ชำระล้างพลังงานลบ ปลดปล่อยสิ่งตกค้าง รักษาโรคภัย', suitable: ['สะเดาะเคราะห์', 'ทำความสะอาดปรับฮวงจุ้ย', 'รักษาโรค/ผ่าตัด', 'ทิ้งสิ่งของเก่า', 'ไหว้พระล้างพลังงานลบ'], taboo: ['แต่งงาน', 'เซ็นสัญญาผูกมัด', 'ลงทุนระยะยาว', 'เปิดตัวสินค้าใหม่'] },
        { zh: '滿', py: 'Mǎn', en: 'Full', th: 'ม่าน (เต็มเปี่ยม/อุดมสมบูรณ์)', quality: 'มงคลยิ่ง', rating: 5, stars: '⭐⭐⭐⭐⭐', badgeClass: 'officer-great', desc: 'วันแห่งความอุดมสมบูรณ์ มหาสมบัติเต็มคลัง โชคลาภพูนทวี เหมาะแก่การรับทรัพย์สิน', suitable: ['เปิดบัญชีธนาคาร', 'รับเงินรับทอง', 'เปิดคลังสินค้า', 'จัดงานเลี้ยงฉลอง', 'ทำบุญเสริมบารมี', 'แต่งงาน'], taboo: ['เริ่มคดีความ', 'รับบุตรบุญธรรม', 'กู้ยืมหนี้สิน'] },
        { zh: '平', py: 'Píng', en: 'Balance', th: 'ผิง (ราบรื่น/เสมอภาค)', quality: 'ปานกลาง', rating: 3, stars: '⭐⭐⭐', badgeClass: 'officer-neutral', desc: 'วันแห่งความสงบ ราบรื่น สมดุล ประนีประนอม ไกล่เกลี่ยข้อพิพาท', suitable: ['เจรจาปรองดอง', 'ซ่อมแซมปรับพื้นที่', 'เพาะปลูก', 'ทำความสะอาดเคหสถาน', 'ทำบุญอุทิศส่วนกุศล'], taboo: ['ขึ้นศาลฟ้องร้อง', 'เสี่ยงโชคการพนัน', 'กิจกรรมเสี่ยงภัย'] },
        { zh: '定', py: 'Dìng', en: 'Settle', th: 'ติ้ง (มั่นคง/แน่นอน)', quality: 'มงคลยิ่ง', rating: 5, stars: '⭐⭐⭐⭐⭐', badgeClass: 'officer-great', desc: 'วันแห่งความมั่นคงถาวร วางรากฐานอันยั่งยืน ตกลงสัญญา หมั้นหมาย', suitable: ['ทำสัญญาค้าขาย', 'หมั้นหมาย/สู่ขอ', 'วางศิลาฤกษ์', 'รับพนักงานใหม่', 'ซื้อบ้าน/ที่ดิน', 'ตั้งศาลบูชา'], taboo: ['ฟ้องร้องฟ้องคดี', 'รักษาแผลสด', 'เดินทางไกลอย่างเร่งรีบ'] },
        { zh: '執', py: 'Zhí', en: 'Initiate', th: 'จื๋อ (ยึดถือ/รักษาการ)', quality: 'ปานกลาง', rating: 3, stars: '⭐⭐⭐', badgeClass: 'officer-neutral', desc: 'วันแห่งการรักษาแบบแผน กฎระเบียบ มั่นคงในหน้าที่ ดำเนินการตามแผน เพาะปลูก', suitable: ['ทำบุญขอพร', 'จับกุมคนร้าย/ปราบอธรรม', 'ลงนามข้อตกลงระยะสั้น', 'เริ่มต้นการเรียนรู้'], taboo: ['ย้ายบ้าน', 'เปิดกิจการสาขาใหม่', 'ออกเดินทางท่องเที่ยวไกล'] },
        { zh: '破', py: 'Pò', en: 'Destruction', th: 'พั่ว (ทะลวง/ทำลายอุปสรรค)', quality: 'ควรระวัง', rating: 1, stars: '⭐', badgeClass: 'officer-danger', desc: 'วันแห่งการปะทะ ทะลวงกำแพง รื้อถอนของเก่า ไม่เหมาะกับงานมงคลใดๆ', suitable: ['รื้อถอนอาคารเก่า', 'ตัดไม้ใหญ่ที่กีดขวาง', 'ผ่าตัดรักษาโรคเรื้อรัง', 'สะเดาะเคราะห์ตัดวิบากกรรม'], taboo: ['แต่งงาน/สู่ขอ', 'เปิดร้านใหม่', 'เซ็นสัญญาพันธมิตร', 'ขึ้นบ้านใหม่', 'ลงทุนก้อนใหญ่'] },
        { zh: '危', py: 'Wēi', en: 'Danger', th: 'เวย (ระมัดระวัง/มีสติ)', quality: 'ปานกลาง (ระวัง)', rating: 2, stars: '⭐⭐', badgeClass: 'officer-caution', desc: 'วันแห่งความตระหนักรู้ เตือนสติ ตั้งรับ เหมาะแก่การไหว้พระ สวดมนต์ ตั้งมั่นในศีล', suitable: ['ไหว้พระขอพรเทพเจ้า', 'ตั้งเตียงนอนมงคล', 'ทำบุญโรงพยาบาล', 'วางแผนยุทธศาสตร์เงียบๆ'], taboo: ['ปีนเขากิจกรรมแอดเวนเจอร์', 'ล่องเรือออกทะเลลึก', 'ซ่อมแซมหลังคาบ้าน', 'ขับรถทางไกลตอนดึก'] },
        { zh: '成', py: 'Chéng', en: 'Success', th: 'เฉิง (สำเร็จ/ลุล่วง)', quality: 'มงคลสูงสุด', rating: 5, stars: '⭐⭐⭐⭐⭐', badgeClass: 'officer-great', desc: 'วันมหามงคลสูงสุด สรรพสิ่งบรรลุผลสำเร็จ ดั่งมังกรผงาดเหนือเมฆา เกื้อหนุนทุกกิจการ', suitable: ['แต่งงานจดทะเบียน', 'เปิดร้าน/เปิดบริษัท', 'เซ็นสัญญาใหญ่', 'เข้าสอบ/สัมภาษณ์งาน', 'ขึ้นบ้านใหม่', 'ออกรถใหม่'], taboo: ['เริ่มคดีความฟ้องร้อง', 'ทุ่มเถียงมีปากเสียง'] },
        { zh: '收', py: 'Shōu', en: 'Receive', th: 'โซ่ว (เก็บเกี่ยว/รับทรัพย์)', quality: 'มงคลยิ่ง', rating: 5, stars: '⭐⭐⭐⭐⭐', badgeClass: 'officer-great', desc: 'วันแห่งการเก็บเกี่ยวผลผลิต ดึงดูดทรัพย์เข้าคลัง ทวงหนี้ได้คืน รับผลกำไร', suitable: ['ทวงหนี้สิน', 'เก็บเงินเก็บทองเข้าคลัง', 'เปิดหีบสมบัติ', 'ซื้ออสังหาริมทรัพย์', 'ทำบุญสร้างโบสถ์วิหาร'], taboo: ['จัดงานฌาปนกิจ', 'ปล่อยเงินกู้', 'รักษาโรคร้ายแรง'] },
        { zh: '開', py: 'Kāi', en: 'Open', th: 'คาย (เปิดทาง/เบิกเนตร)', quality: 'มงคลสูงสุด', rating: 5, stars: '⭐⭐⭐⭐⭐', badgeClass: 'officer-great', desc: 'วันแห่งประตูสวรรค์เปิด ทางสว่างโล่ง แจ่มใสรุ่งเรือง เหมาะแก่การเปิดตัวทุกประการ', suitable: ['เปิดร้านค้า/เปิดกิจการ', 'เปิดตัวสินค้าใหม่', 'เริ่มเข้าศึกษาใหม่', 'ออกเดินทางท่องเที่ยว', 'ย้ายเข้าบ้านใหม่', 'สู่ขอ'], taboo: ['จัดงานอวมงคล', 'ขุดสุสาน', 'กักขังสิ่งมีชีวิต'] },
        { zh: '閉', py: 'Bì', en: 'Close', th: 'ปี้ (ปิดกั้น/สะสมพลัง)', quality: 'ควรระวัง', rating: 2, stars: '⭐⭐', badgeClass: 'officer-caution', desc: 'วันแห่งการปิดม่าน สะสมพลัง ซ่อนเร้น เก็บงำความลับ พักผ่อนฟื้นฟู', suitable: ['สร้างกำแพงกั้นน้ำ', 'ปิดงบดุลบัญชี', 'พักผ่อนเก็บตัวภาวนา', 'ฝังกลบสิ่งปฏิกูล'], taboo: ['เปิดกิจการใหม่', 'จัดงานแต่งงาน', 'เปิดตาเบิกเนตรพระ', 'เจรจาการค้าสำคัญ'] }
      ];

      // Active officer
      let activeOfficer = (tongshuInfo && tongshuInfo.officer) ? tongshuInfo.officer : ALL_12_OFFICERS[1];
      // Match English name if present in ALL_12_OFFICERS
      const matchedOfficer = ALL_12_OFFICERS.find(o => o.zh === activeOfficer.zh);
      if (matchedOfficer) {
        activeOfficer = { ...matchedOfficer, ...activeOfficer };
      }

      // Dates bar
      const datesBar = document.getElementById('dailyShowcaseDatesBar');
      if (datesBar) {
        const thaiDate = tongshuInfo ? tongshuInfo.gregorianThai : now.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const lunarDate = tongshuInfo ? tongshuInfo.lunarDateString : '农历 (ปฏิทินจีน)';
        const solarTerm = tongshuInfo ? tongshuInfo.currentSolarTerm : 'ฤดูกาลตามสารทจีน';
        const curH = now.getHours();
        const shBranch = BRANCHES[Math.floor((curH + 1) % 24 / 2)];
        const shName = shBranch ? shBranch.py + ' (' + shBranch.zodiac + ')' : '';

        datesBar.innerHTML = '<span><i class="fa-solid fa-sun" style="color: #f59e0b;"></i> ' + thaiDate + '</span> • ' +
          '<span><i class="fa-solid fa-moon" style="color: #c084fc;"></i> ' + lunarDate + '</span> • ' +
          '<span><i class="fa-solid fa-leaf" style="color: #34d399;"></i> สารท ' + solarTerm + '</span> • ' +
          '<span><i class="fa-solid fa-clock" style="color: #60a5fa;"></i> ยาม ' + shName + '</span>';
      }

      // Day Master Badge
      const dmBadgeEl = document.getElementById('dailyDayMasterBadge');
      if (dmBadgeEl && dailyChart.dayMaster) {
        dmBadgeEl.innerHTML = '<span class="daily-dm-badge"><i class="fa-solid fa-yin-yang" style="color: #9333ea;"></i> ดิถีธาตุวันนี้: <strong>' + dailyChart.dayMaster.zh + ' (' + dailyChart.dayMaster.th + ')</strong></span>';
      }

      // 4 Pillars Grid (เรียงตามลำดับจากซ้ายไปขวา: ยาม -> วัน -> เดือน -> ปี)
      const pillarsGrid = document.getElementById('dailyPillarsGrid');
      if (pillarsGrid) {
        const pillarList = [
          { key: 'hour', label: 'เสายาม (Hour)', p: dailyChart.pillars.hour, role: 'พลังงานยามปัจจุบัน (Shichen)' },
          { key: 'day', label: 'เสาวัน (Day)', p: dailyChart.pillars.day, role: 'ดิถีธาตุประจำวัน (Day Master)', isDay: true },
          { key: 'month', label: 'เสาเดือน (Month)', p: dailyChart.pillars.month, role: 'กระแสฤดูกาล / การงาน' },
          { key: 'year', label: 'เสาปี (Year)', p: dailyChart.pillars.year, role: 'พลังภาพรวมปี / สังคมภายนอก' }
        ];

        pillarsGrid.innerHTML = pillarList.map(col => {
          const s = col.p.stem;
          const b = col.p.branch;
          const sMeta = ELEMENTS_META[s.element] || {};
          const bMeta = ELEMENTS_META[b.element] || {};
          const isDm = col.isDay;
          const dmBorder = isDm ? 'border: 2px solid #7c3aed; background: #faf5ff;' : '';
          const dmBadge = isDm ? '<span style="background: #7c3aed; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 999px; margin-left: 4px; white-space: nowrap; display: inline-block; vertical-align: middle;">ดิถีแก่นแท้</span>' : '';

          // สีพื้นอ่อนๆ ตามธาตุของก้านฟ้าและกิ่งดิน (ไม่เอาขอบหนาด้านข้าง)
          const sBg = sMeta.lightBg || 'rgba(100, 116, 139, 0.12)';
          const bBg = bMeta.lightBg || 'rgba(100, 116, 139, 0.12)';

          return '<div class="bazi-pillar-card" style="' + dmBorder + '">' +
            '<div class="pillar-header">' +
            '<span class="pillar-label" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: nowrap;">' +
            '<span>' + col.label + '</span>' + dmBadge +
            '</span>' +
            '<span class="pillar-role">' + col.role + '</span>' +
            '</div>' +
            '<div class="pillar-tengod">' +
            '<span class="god-badge">' + col.p.tenGod.zh + '</span>' +
            '<span class="god-th">' + col.p.tenGod.th + '</span>' +
            '</div>' +
            '<div class="pillar-stem" style="background: ' + sBg + '; border: 1px solid transparent; border-radius: 10px;">' +
            '<span class="stem-zh" style="color: ' + (sMeta.color || '#64748b') + ';">' + s.zh + '</span>' +
            '<div class="stem-info">' +
            '<strong>' + s.py + ' (' + (s.polarity === 'yang' ? 'หยาง' : 'หยิน') + ')</strong>' +
            '<span>' + (sMeta.th || '') + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="pillar-branch" style="background: ' + bBg + '; border: 1px solid transparent; border-radius: 10px;">' +
            '<span class="branch-zh" style="color: ' + (bMeta.color || '#64748b') + ';">' + b.zh + '</span>' +
            '<div class="branch-info">' +
            '<strong>' + b.py + ' • ' + b.zodiac + '</strong>' +
            '<span>' + (bMeta.th || '') + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="pillar-nayin-section" style="margin-top: 6px;">' +
            '<div style="font-size: 11.5px; color: #475569; background: #f1f5f9; padding: 4px 8px; border-radius: 6px; text-align: center; font-family: Prompt, var(--font-chinese, sans-serif);">' +
            '<i class="fa-solid fa-music" style="color: #7c3aed;"></i> น้าอิม: <strong>' + col.p.naYin + '</strong>' +
            '</div>' +
            '</div>' +
            '</div>';
        }).join('');
      }

      // Energy summary pills (จัดวางทางด้านขวามือของการ์ด)
      const pillsEl = document.getElementById('dailyEnergyPills');
      if (pillsEl) {
        const clashZodiac = (tongshuInfo && tongshuInfo.clashZodiac) ? tongshuInfo.clashZodiac : 'มะเมีย (ม้า)';
        const caiShen = (tongshuInfo && tongshuInfo.caiShenDir) ? tongshuInfo.caiShenDir : 'ทิศเหนือ';
        const xiShen = (tongshuInfo && tongshuInfo.xiShenDir) ? tongshuInfo.xiShenDir : 'ทิศตะวันออกเฉียงเหนือ';
        const guiShen = (tongshuInfo && tongshuInfo.guiShenDir) ? tongshuInfo.guiShenDir : 'ทิศตะวันออกเฉียงเหนือ & ตะวันตกเฉียงใต้';
        const dayBranch = dailyChart.pillars.day.branch;

        pillsEl.innerHTML = '<div class="daily-right-card-header">' +
          '<i class="fa-solid fa-chart-pie" style="color: #7c3aed;"></i> ข้อมูลสรุปพลังงานประจำวัน' +
          '</div>' +
          '<div class="daily-info-item item-dm">' +
          '<div class="info-item-icon" style="color: #7c3aed;"><i class="fa-solid fa-dna"></i></div>' +
          '<div class="info-item-content">' +
          '<span class="info-item-title">ดิถีธาตุวันนี้ (Day Master)</span>' +
          '<span class="info-item-value">' + dailyChart.dayMaster.zh + ' (' + dailyChart.dayMaster.th + ')</span>' +
          '<span class="info-item-desc">' + dailyChart.dayMaster.desc + '</span>' +
          '</div>' +
          '</div>' +
          '<div class="daily-info-item item-zodiac">' +
          '<div class="info-item-icon" style="color: #d97706;"><i class="fa-solid fa-paw"></i></div>' +
          '<div class="info-item-content">' +
          '<span class="info-item-title">นักษัตรประจำวัน (Day Branch)</span>' +
          '<span class="info-item-value">' + dayBranch.zodiac + '</span>' +
          '<span class="info-item-desc">สาขา ' + dayBranch.zh + ' (' + dayBranch.py + ') • ' + (ELEMENTS_META[dayBranch.element]?.th || '') + '</span>' +
          '</div>' +
          '</div>' +
          '<div class="daily-info-item item-clash">' +
          '<div class="info-item-icon" style="color: #ef4444;"><i class="fa-solid fa-triangle-exclamation"></i></div>' +
          '<div class="info-item-content">' +
          '<span class="info-item-title">นักษัตรปะทะ (ชงประจำวัน)</span>' +
          '<span class="info-item-value" style="color: #be123c;">ชงกับ: ' + clashZodiac + '</span>' +
          '<span class="info-item-desc">มีสติรอบคอบในการเจรจาและการเดินทาง</span>' +
          '</div>' +
          '</div>' +
          '<div class="daily-info-item item-caishen">' +
          '<div class="info-item-icon" style="color: #10b981;"><i class="fa-solid fa-coins"></i></div>' +
          '<div class="info-item-content">' +
          '<span class="info-item-title">ทิศโชคลาภ (财神)</span>' +
          '<span class="info-item-value" style="color: #15803d;">' + caiShen + '</span>' +
          '</div>' +
          '</div>' +
          '<div class="daily-info-item item-xishen">' +
          '<div class="info-item-icon" style="color: #ec4899;"><i class="fa-solid fa-heart"></i></div>' +
          '<div class="info-item-content">' +
          '<span class="info-item-title">ทิศมงคล / สุขสมหวัง (喜神)</span>' +
          '<span class="info-item-value" style="color: #be185d;">' + xiShen + '</span>' +
          '</div>' +
          '</div>' +
          '<div class="daily-info-item item-guishen">' +
          '<div class="info-item-icon" style="color: #0284c7;"><i class="fa-solid fa-handshake-angle"></i></div>' +
          '<div class="info-item-content">' +
          '<span class="info-item-title">ทิศผู้อุปถัมภ์ / ขุนนาง (贵神)</span>' +
          '<span class="info-item-value" style="color: #0369a1;">' + guiShen + '</span>' +
          '</div>' +
          '</div>';
      }

      // Today Officer Spotlight Card
      const spotlightEl = document.getElementById('dailyOfficerSpotlightCard');
      if (spotlightEl) {
        const suitTags = (activeOfficer.suitable || []).map(t => '<span class="action-tag tag-suitable"><i class="fa-solid fa-circle-check"></i> ' + t + '</span>').join('');
        const tabooTags = (activeOfficer.taboo || []).map(t => '<span class="action-tag tag-taboo"><i class="fa-solid fa-circle-xmark"></i> ' + t + '</span>').join('');

        spotlightEl.innerHTML = '<div class="spotlight-top-bar">' +
          '<div class="spotlight-officer-main">' +
          '<div class="spotlight-char-box">' +
          '<span class="spotlight-char-zh">' + activeOfficer.zh + '</span>' +
          '<span class="spotlight-char-py">' + (activeOfficer.py || '') + '</span>' +
          '</div>' +
          '<div class="spotlight-title-group">' +
          '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">' +
          '<span style="font-size: 12.5px; font-weight: 700; color: #7c3aed; text-transform: uppercase; letter-spacing: 0.5px;">' +
          '<i class="fa-solid fa-star"></i> ฤกษ์ประจำวันตามคัมภีร์ 12 เทพพิทักษ์ (建除十二神 - 12 Day Officers)' +
          '</span>' +
          '</div>' +
          '<h2>' +
          'วันนี้เป็นวัน: <span>' + activeOfficer.zh + '</span> ' +
          '<span class="spotlight-officer-en-badge">' + (activeOfficer.en || '') + '</span>' +
          '<span style="font-size: 17px; color: #475569; font-weight: 500;">— ' + activeOfficer.th + '</span>' +
          '</h2>' +
          '<p class="spotlight-desc">' + activeOfficer.desc + '</p>' +
          '</div>' +
          '</div>' +
          '<div class="spotlight-ratings">' +
          '<span class="spotlight-quality-badge ' + (activeOfficer.badgeClass || 'officer-auspicious') + '">' +
          activeOfficer.quality +
          '</span>' +
          '<span style="font-size: 13px;">' + (activeOfficer.stars || '⭐⭐⭐⭐') + '</span>' +
          '</div>' +
          '</div>' +
          '<div class="spotlight-actions-grid">' +
          '<div class="spotlight-action-box box-suitable">' +
          '<div class="spotlight-action-label">' +
          '<i class="fa-solid fa-thumbs-up"></i> กิจกรรมที่เกื้อหนุนและควรทำ (Suitable Activities)' +
          '</div>' +
          '<div class="spotlight-tags-wrap">' + suitTags + '</div>' +
          '</div>' +
          '<div class="spotlight-action-box box-taboo">' +
          '<div class="spotlight-action-label">' +
          '<i class="fa-solid fa-ban"></i> ข้อควรระวังหรือหลีกเลี่ยง (Taboos)' +
          '</div>' +
          '<div class="spotlight-tags-wrap">' + tabooTags + '</div>' +
          '</div>' +
          '</div>';
      }

      // 12 Officers Grid
      const officersGrid = document.getElementById('officers12Grid');
      if (officersGrid) {
        officersGrid.innerHTML = ALL_12_OFFICERS.map((off, idx) => {
          const isActive = (off.zh === activeOfficer.zh) || (off.en === activeOfficer.en);
          const activeCls = isActive ? 'active-today' : '';
          return '<div class="officer-mini-card ' + activeCls + '" title="' + off.desc + '">' +
            '<div class="mini-card-head">' +
            '<div class="mini-card-zh-en">' +
            '<span class="mini-card-zh">' + off.zh + '</span>' +
            '<span class="mini-card-en">' + (idx + 1) + '. ' + off.en + '</span>' +
            '</div>' +
            '<span class="mini-card-stars">' + off.stars + '</span>' +
            '</div>' +
            '<div class="mini-card-th">' + off.th + '</div>' +
            '<div class="mini-card-desc">' + off.desc + '</div>' +
            '</div>';
        }).join('');
      }
    },

    fillGuestQuestion: function (q) {
      const input = document.getElementById('baziGuestQuestionInput');
      if (input) {
        input.value = q;
        input.focus();
      }
      // Ensure result container remains hidden until user clicks calculate
      const resultContainer = document.getElementById('baziGuestResultContainer');
      if (resultContainer) {
        resultContainer.classList.add('hidden');
      }
      // Pulse calculate button to invite the user to click it
      const calcBtn = document.getElementById('baziGuestCalcBtn');
      if (calcBtn) {
        calcBtn.classList.remove('pulse-guide');
        void calcBtn.offsetWidth;
        calcBtn.classList.add('pulse-guide');
      }
    },

    calculateGuestFortune: function () {
      const nameInput = document.getElementById('baziGuestNameInput');
      const genderSelect = document.getElementById('baziGuestGenderSelect');
      const daySel = document.getElementById('baziGuestBirthDay');
      const monthSel = document.getElementById('baziGuestBirthMonth');
      const yearSel = document.getElementById('baziGuestBirthYear');
      const hourSel = document.getElementById('baziGuestBirthHour');
      const minSel = document.getElementById('baziGuestBirthMinute');
      const unknownCheck = document.getElementById('baziGuestUnknownTimeCheck');

      const name = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'ดวงชะตาของคุณ';
      const gender = genderSelect ? genderSelect.value : 'female';

      const y = (yearSel && yearSel.value) ? parseInt(yearSel.value, 10) : 1998;
      const m = (monthSel && monthSel.value) ? parseInt(monthSel.value, 10) : 8;
      const d = (daySel && daySel.value) ? parseInt(daySel.value, 10) : 18;
      const birthDate = y + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0');

      const isUnknownTime = !!(unknownCheck && unknownCheck.checked);
      const birthHour = (!isUnknownTime && hourSel) ? (parseInt(hourSel.value, 10) || 12) : 12;
      const birthMinute = (!isUnknownTime && minSel) ? (parseInt(minSel.value, 10) || 0) : 0;
      const birthTime = String(birthHour).padStart(2, '0') + ':' + String(birthMinute).padStart(2, '0');

      // Sync into toolbar inputs
      const targetName = document.getElementById('baziNameInput');
      const targetGender = document.getElementById('baziGenderSelect');
      const targetDate = document.getElementById('baziDateInput');
      const targetHour = document.getElementById('baziHourInput');

      if (targetName) targetName.value = name;
      if (targetGender) targetGender.value = gender;
      if (targetDate) targetDate.value = birthDate;
      if (targetHour) targetHour.value = birthTime;

      // Calculate Chart
      this.calculateFromInputs(false);

      // Smooth scroll to chart sections
      const chartSection = document.getElementById('baziMainChartSections') || document.getElementById('baziToolbarCard');
      if (chartSection) {
        chartSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    },
    _legacyCalcGuestFortune: function () {
      const nameInput = document.getElementById('baziGuestNameInput');
      const genderSelect = document.getElementById('baziGuestGenderSelect');
      const daySel = document.getElementById('baziGuestBirthDay');
      const monthSel = document.getElementById('baziGuestBirthMonth');
      const yearSel = document.getElementById('baziGuestBirthYear');
      const hourSel = document.getElementById('baziGuestBirthHour');
      const minSel = document.getElementById('baziGuestBirthMinute');
      const dateInput = document.getElementById('baziGuestDateInput');
      const hourInput = document.getElementById('baziGuestHourInput');
      const unknownCheck = document.getElementById('baziGuestUnknownTimeCheck');
      const questionInput = document.getElementById('baziGuestQuestionInput');

      const rawQuestion = (questionInput && questionInput.value.trim()) ? questionInput.value.trim() : '';
      if (!rawQuestion) {
        this.showToast('🔮 กรุณาพิมพ์คำถามที่คุณอยากฟันธงก่อนนะคะ หรือแตะเลือกคำถามยอดนิยมด้านล่างได้เลยค่ะ ✨', 'warning');
        if (questionInput) questionInput.focus();
        return;
      }

      const name = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'ดวงชะตาของคุณ';
      const gender = genderSelect ? genderSelect.value : 'female';

      let birthDate = '1998-08-18';
      if (yearSel && monthSel && daySel && yearSel.value && monthSel.value && daySel.value) {
        const y = parseInt(yearSel.value, 10) || 1998;
        const m = parseInt(monthSel.value, 10) || 8;
        const d = parseInt(daySel.value, 10) || 18;
        birthDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      } else if (dateInput && dateInput.value) {
        birthDate = dateInput.value;
      }

      const isUnknownTime = !!(unknownCheck && unknownCheck.checked);

      let birthHour = 12;
      let birthMinute = 0;
      if (!isUnknownTime) {
        if (hourSel) {
          birthHour = parseInt(hourSel.value, 10) || 12;
          birthMinute = minSel ? (parseInt(minSel.value, 10) || 0) : 0;
        } else if (hourInput && hourInput.value) {
          const parts = hourInput.value.split(':');
          birthHour = parseInt(parts[0], 10) || 12;
          birthMinute = parseInt(parts[1], 10) || 0;
        }
      }

      // Calculate Chart
      const chart = BaziEngine.calculateChart({
        birthDate,
        birthHour,
        birthMinute,
        gender,
        name,
        isUnknownTime
      });

      // Compute Oracle Verdict
      const verdict = BaziEngine.computeOracleVerdict(chart, rawQuestion, this.selectedYear);
      if (!verdict) return;

      this.guestCurrentResult = { chart, question: rawQuestion, verdict };

      // Render into Guest Result Card & Reveal Container
      const resultContainer = document.getElementById('baziGuestResultContainer');
      if (resultContainer) {
        resultContainer.classList.remove('hidden');
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      const calcDateBadge = document.getElementById('baziGuestCalcDateBadge');
      const dmChar = document.getElementById('baziGuestDmChar');
      const dmName = document.getElementById('baziGuestDmName');
      const dmBadge = document.getElementById('baziGuestDmBadge');
      const personTitle = document.getElementById('baziGuestResultPersonTitle');
      const daYunText = document.getElementById('baziGuestDaYunText');
      const annualText = document.getElementById('baziGuestAnnualText');
      const questionDisplay = document.getElementById('baziGuestQuestionDisplay');
      const verdictIcon = document.getElementById('baziGuestVerdictIcon');
      const verdictHeadline = document.getElementById('baziGuestVerdictHeadline');
      const verdictSubline = document.getElementById('baziGuestVerdictSubline');
      const probPill = document.getElementById('baziGuestProbPill');
      const analysisGrid = document.getElementById('baziGuestAnalysisGrid');

      const dmMeta = ELEMENTS_META[chart.dayMaster.element];
      if (dmChar) {
        dmChar.textContent = chart.dayMaster.zh;
        dmChar.style.color = dmMeta.color;
      }
      if (dmName) dmName.textContent = `${chart.dayMaster.py} (${dmMeta.th})`;
      if (personTitle) {
        const timeNote = isUnknownTime ? '• (ไม่ระบุเวลาเกิด: 3 เสาหลัก)' : `• (เวลาเกิด ${String(birthHour).padStart(2, '0')}:${String(birthMinute).padStart(2, '0')} น.)`;
        personTitle.textContent = `${chart.name} • ดิถีธาตุ ${chart.dayMaster.zh} (${chart.dayMaster.th}) ${timeNote}`;
      }
      if (daYunText) daYunText.textContent = `ช่วงอายุ ${verdict.curDaYun ? verdict.curDaYun.ageRange : '-'} (${verdict.curDaYun ? verdict.curDaYun.stem.zh + verdict.curDaYun.branch.zh : '-'} • ${verdict.curDaYun && verdict.curDaYun.tenGod ? verdict.curDaYun.tenGod.th : '-'})`;
      if (annualText) annualText.textContent = `ปี ${verdict.simY} (${verdict.simStem.zh}${verdict.simBranch.zh} • ${verdict.simBranch.zodiac.split(' ')[0]})`;
      if (questionDisplay) questionDisplay.textContent = `"${rawQuestion}"`;
      if (verdictIcon) verdictIcon.textContent = verdict.verdictIcon;
      if (verdictHeadline) verdictHeadline.textContent = verdict.verdictMain;
      if (verdictSubline) verdictSubline.textContent = verdict.verdictSub;
      if (probPill) {
        probPill.textContent = verdict.probBadgeText;
        probPill.style.background = verdict.probBadgeBg;
      }

      if (calcDateBadge) {
        calcDateBadge.textContent = `คำนวณเมื่อ: ${new Date().toLocaleDateString('th-TH')}`;
      }

      if (analysisGrid) {
        analysisGrid.innerHTML = verdict.analysisPoints.map(p => `
          <div class="guest-point-card ${p.borderClass || ''}">
            <div class="guest-point-header">${p.title}</div>
            <p class="guest-point-body">${p.body}</p>
          </div>
        `).join('');
      }

      if (resultContainer) {
        resultContainer.classList.remove('hidden');
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      this.showToast(`คำนวณปาจื่อและฟันธงคำตอบเรียบร้อยแล้วค่ะ! ✨`);
    },

    generateGuestShareText: function () {
      if (!this.guestCurrentResult) return '🔮 ผลคำนวณดวงชะตา ปาจื่อ (BaZi Four Pillars Oracle) - แม่หมอติ๊ดติ๊ด 🐾✨';
      const { chart, question, verdict } = this.guestCurrentResult;
      const dmMeta = ELEMENTS_META[chart.dayMaster.element];
      return `🔮 ผลคำนวณดวงชะตา ปาจื่อ (BaZi Four Pillars Oracle) - แม่หมอติ๊ดติ๊ด 🐾✨\n` +
        `👤 เจ้าชะตา: ${chart.name} (ดิถีธาตุ ${chart.dayMaster.zh} ${chart.dayMaster.th} • ${chart.strengthText})\n` +
        `❓ คำถาม: "${question}"\n` +
        `🎯 คำวินิจฉัยฟันธง: ${verdict.verdictMain}\n` +
        `📊 ${verdict.probBadgeText}\n` +
        `⚡ วัยจร 10 ปี (大運): ช่วงอายุ ${verdict.curDaYun ? verdict.curDaYun.ageRange : '-'} (${verdict.curDaYun ? verdict.curDaYun.stem.zh + verdict.curDaYun.branch.zh : ''})\n` +
        `🌟 อิทธิพลปีจร: ปี ${verdict.simY} (${verdict.simStem.zh}${verdict.simBranch.zh})\n` +
        `💡 กลยุทธ์เสริมดวง: ${verdict.advice}\n` +
        `---\n` +
        `✨ ดูดวงปาจื่อแม่นๆ ฟรีได้ที่ แม่หมอติ๊ดติ๊ด 🐾`;
    },

    shareGuestResult: async function (platform) {
      if (!this.guestCurrentResult) {
        this.calculateGuestFortune();
      }
      if (!this.guestCurrentResult) return;

      const text = this.generateGuestShareText();
      this.showToast('🔮 กำลังเตรียมรูปภาพคำทำนายและข้อความ... 🐾✨');

      let imageBlob = null;
      const cardEl = document.getElementById('baziGuestFortuneCard');
      if (cardEl && typeof html2canvas === 'function') {
        try {
          const canvas = await html2canvas(cardEl, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false
          });
          imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 0.95));
        } catch (e) {
          console.warn('Capture bazi card error:', e);
        }
      }

      const imageFile = imageBlob ? new File([imageBlob], 'MaeMorTidTid_BaZi_' + Date.now() + '.png', { type: 'image/png' }) : null;

      // 1. Mobile Web Share API
      if (navigator.canShare && imageFile && navigator.canShare({ files: [imageFile] })) {
        try {
          await navigator.share({
            title: 'ผลคำนวณดวงชะตา ปาจื่อ - แม่หมอติ๊ดติ๊ด 🐾✨',
            text: text,
            files: [imageFile]
          });
          this.showToast('✨ ระบบนำรูปและข้อความไปวางในแอปแล้วค่ะ! 💖');
          return;
        } catch (err) {
          if (err.name === 'AbortError') return;
        }
      }

      // 2. Fallback
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      }

      if (imageBlob) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(imageBlob);
        a.download = 'MaeMorTidTid_BaZi_' + Date.now() + '.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(a.href), 10000);
      }

      if (platform === 'fb') {
        this.showToast('✨ คัดลอกคำทำนายและดาวน์โหลดรูปให้แล้วค่ะ! วาง (Ctrl+V) ใน Facebook ได้เลยนะคะ 🐾');
        setTimeout(() => window.open('https://www.facebook.com/', '_blank'), 600);
      } else if (platform === 'tt') {
        this.showToast('✨ คัดลอกคำทำนายและดาวน์โหลดรูปให้แล้วค่ะ! นำไปใส่ใน TikTok ได้เลยนะคะ 🐾');
        setTimeout(() => window.open('https://www.tiktok.com/', '_blank'), 600);
      } else if (platform === 'ig') {
        this.showToast('✨ คัดลอกคำทำนายและดาวน์โหลดรูปให้แล้วค่ะ! นำไปโพสต์ใน Instagram ได้เลยนะคะ 🐾');
        setTimeout(() => window.open('https://www.instagram.com/', '_blank'), 600);
      } else if (platform === 'line') {
        this.showToast('✨ คัดลอกคำทำนายและดาวน์โหลดรูปให้แล้วค่ะ! กำลังเปิด LINE 🐾');
        setTimeout(() => {
          if (typeof liff !== 'undefined' && liff.isLoggedIn && liff.isLoggedIn()) {
            try {
              if (liff.isApiAvailable('shareTargetPicker')) {
                liff.shareTargetPicker([{ type: 'text', text }]);
                return;
              } else if (liff.isInClient()) {
                liff.sendMessages([{ type: 'text', text }]);
                return;
              }
            } catch (err) { }
          }
          const lineUrl = 'https://line.me/R/msg/text/?' + encodeURIComponent(text);
          window.open(lineUrl, '_blank');
        }, 600);
      }
    },

    copyGuestResultText: function () {
      const text = this.generateGuestShareText();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          this.showToast('คัดลอกสรุปคำทำนายลงคลิปบอร์ดเรียบร้อยแล้วค่ะ! ✨');
        });
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        this.showToast('คัดลอกสรุปคำทำนายลงคลิปบอร์ดเรียบร้อยแล้วค่ะ! ✨');
      }
    },

    resetToNow: function () {
      this.setDefaultCurrentDateTimeInputs();
      this.calculateFromInputs(false);
      this.showToast('แสดงดวงจีน ณ วันและเวลาปัจจุบันเรียบร้อยแล้วค่ะ');
    },

    addProfileFromUser: function (user) {
      if (!user || !user.birthDate) return;
      const userProfileId = 'bazi_user_' + (user.uid || 'current');
      const profile = {
        id: userProfileId,
        name: user.name || 'ดวงของฉัน',
        gender: user.gender || 'male',
        birthDate: user.birthDate,
        birthTime: user.birthTime || '12:00',
        savedAt: 'สมาชิก (ดวงของฉัน)'
      };
      const existingIdx = this.savedProfiles.findIndex(p => p.id === userProfileId || p.name === profile.name);
      if (existingIdx !== -1) {
        this.savedProfiles[existingIdx] = profile;
      } else {
        this.savedProfiles.unshift(profile);
      }
      this.saveProfilesToStorage();
      this.renderQuickProfileSelect();
    },

    setDefaultCurrentDateTimeInputs: function () {
      const nameInput = document.getElementById('baziNameInput');
      const dateInput = document.getElementById('baziDateInput');
      const hourInput = document.getElementById('baziHourInput');
      const genderSelect = document.getElementById('baziGenderSelect');

      if (nameInput) nameInput.value = '';
      if (dateInput) dateInput.value = '';
      if (hourInput) hourInput.value = '';
      if (genderSelect) genderSelect.value = 'female';

      const daySel = document.getElementById('baziBirthDay');
      const monthSel = document.getElementById('baziBirthMonth');
      const yearSel = document.getElementById('baziBirthYear');
      const hourSel = document.getElementById('baziBirthHour');
      const minSel = document.getElementById('baziBirthMinute');
      if (daySel) daySel.value = '';
      if (monthSel) monthSel.value = '';
      if (yearSel) yearSel.value = '';
      if (hourSel) hourSel.value = '';
      if (minSel) minSel.value = '';

      const quickSel = document.getElementById('baziQuickProfileSelect');
      if (quickSel) quickSel.value = '';
      this.selectedYear = new Date().getFullYear();
      this.currentChart = null;
    },

    loadSavedProfiles: function () {
      try {
        const raw = localStorage.getItem('bazi_saved_profiles');
        this.savedProfiles = raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.warn('Failed to parse saved bazi profiles:', e);
        this.savedProfiles = [];
      }
      this.updateSavedCountBadge();
    },

    saveProfilesToStorage: function () {
      try {
        localStorage.setItem('bazi_saved_profiles', JSON.stringify(this.savedProfiles));
      } catch (e) {
        console.warn('Failed to save bazi profiles to storage:', e);
      }
      this.updateSavedCountBadge();
    },

    updateSavedCountBadge: function () {
      const el = document.getElementById('baziSavedCount');
      if (el) el.textContent = this.savedProfiles.length;
      const elTop = document.getElementById('baziSavedCountTop');
      if (elTop) elTop.textContent = this.savedProfiles.length;
    },

    renderQuickProfileSelect: function () {
      const select = document.getElementById('baziQuickProfileSelect');
      if (!select) return;

      let html = '<option value="" selected>-- เลือกลูกดวง --</option>';
      if (window.AuthManager && window.AuthManager.isLoggedIn()) {
        const u = window.AuthManager.currentUser;
        if (u && u.birthDate) {
          html += `<option value="__my_profile__">👤 ${u.name || 'โปรไฟล์ของฉัน'}</option>`;
        }
      }
      html += `<option value="__now__">⚡ ดวงปัจจุบัน (วันนี้/ตอนนี้)</option>`;
      if (this.savedProfiles && this.savedProfiles.length > 0) {
        html += `<optgroup label="ลูกดวงที่บันทึกไว้ (${this.savedProfiles.length} ท่าน)">`;
        this.savedProfiles.forEach(p => {
          html += `<option value="${p.id}">👤 ${p.name} (${p.birthDate})</option>`;
        });
        html += `</optgroup>`;
      }
      select.innerHTML = html;
      select.value = '';
    },

    onQuickProfileChange: function (val) {
      if (!val) return;
      if (val === '__my_profile__') {
        this.loadMyProfileChart();
      } else if (val === '__now__') {
        this.setDefaultCurrentDateTimeInputs();
        this.calculateFromInputs();
        this.showToast('ตั้งค่าเป็นดวงวันเวลาปัจจุบันเรียบร้อยแล้วค่ะ');
      } else {
        this.loadProfile(val);
      }
    },

    showToast: function (msg) {
      let toast = document.getElementById('baziToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'baziToast';
        toast.className = 'bazi-toast';
        document.body.appendChild(toast);
      }
      toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #a855f7;"></i> <span>${msg}</span>`;
      toast.classList.add('show');
      clearTimeout(this._toastTimeout);
      this._toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 2600);
    },

    bindEvents: function () {
      const calcBtn = document.getElementById('baziCalcBtn');
      if (calcBtn) {
        calcBtn.addEventListener('click', () => this.calculateFromInputs(true));
      }

      // Live auto-calculation on input changes
      const nameInput = document.getElementById('baziNameInput');
      const dateInput = document.getElementById('baziDateInput');
      const hourInput = document.getElementById('baziHourInput');
      const genderSelect = document.getElementById('baziGenderSelect');
      const quickSelect = document.getElementById('baziQuickProfileSelect');

      const onManualInputChange = () => {
        if (quickSelect && quickSelect.value !== '__custom__') {
          let customOpt = quickSelect.querySelector('option[value="__custom__"]');
          if (!customOpt) {
            customOpt = document.createElement('option');
            customOpt.value = '__custom__';
            customOpt.textContent = '✏️ ดวงที่ระบุเอง (กำหนดเอง)';
            quickSelect.appendChild(customOpt);
          }
          quickSelect.value = '__custom__';
        }
        // Do not auto-calculate on input change: only calculate when user clicks calculate button
      };

      if (dateInput) {
        dateInput.addEventListener('change', () => {
          this.syncDateInputToDropdowns();
          onManualInputChange();
        });
        dateInput.addEventListener('input', () => {
          this.syncDateInputToDropdowns();
          onManualInputChange();
        });
      }

      const daySel = document.getElementById('baziBirthDay');
      const monthSel = document.getElementById('baziBirthMonth');
      const yearSel = document.getElementById('baziBirthYear');
      const onDateDropdownChange = () => {
        this.syncDropdownsToDateInput();
        onManualInputChange();
      };
      if (daySel) daySel.addEventListener('change', onDateDropdownChange);
      if (monthSel) monthSel.addEventListener('change', onDateDropdownChange);
      if (yearSel) yearSel.addEventListener('change', onDateDropdownChange);

      if (hourInput) {
        hourInput.addEventListener('change', () => {
          this.syncTimeInputToDropdowns();
          onManualInputChange();
        });
      }

      const hourSel = document.getElementById('baziBirthHour');
      const minSel = document.getElementById('baziBirthMinute');
      const onTimeDropdownChange = () => {
        this.syncDropdownsToTimeInput();
        onManualInputChange();
      };
      if (hourSel) hourSel.addEventListener('change', onTimeDropdownChange);
      if (minSel) minSel.addEventListener('change', onTimeDropdownChange);

      const unknownCheck = document.getElementById('baziUnknownTimeCheck');
      if (unknownCheck) {
        unknownCheck.addEventListener('change', () => {
          this.onUnknownTimeChange();
          onManualInputChange();
        });
      }
      if (genderSelect) {
        genderSelect.addEventListener('change', onManualInputChange);
      }
      if (nameInput) {
        nameInput.addEventListener('change', onManualInputChange);
        nameInput.addEventListener('blur', onManualInputChange);
      }

      const presetNowBtn = document.getElementById('baziPresetNowBtn');
      if (presetNowBtn) {
        presetNowBtn.addEventListener('click', () => {
          this.setDefaultCurrentDateTimeInputs();
          this.calculateFromInputs();
          this.showToast('ตั้งค่าเป็นดวงวันเวลาปัจจุบันเรียบร้อยแล้วค่ะ');
        });
      }

      // Quick Profile Select
      if (quickSelect) {
        quickSelect.addEventListener('change', (e) => this.onQuickProfileChange(e.target.value));
      }

      const copyBtn = document.getElementById('baziCopySummaryBtn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => this.copySummary());
      }

      // Save Profile Button
      const saveBtn = document.getElementById('baziSaveBtn');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => this.saveCurrentProfile());
      }

      // Open Saved Profiles Modal
      const openSavedModalBtn = document.getElementById('baziOpenSavedModalBtn');
      if (openSavedModalBtn) {
        openSavedModalBtn.addEventListener('click', () => this.openSavedModal());
      }

      // Close Saved Profiles Modal
      const closeSavedModalBtn = document.getElementById('baziCloseSavedModalBtn');
      if (closeSavedModalBtn) {
        closeSavedModalBtn.addEventListener('click', () => this.closeSavedModal());
      }

      // Close modal on click backdrop
      const modal = document.getElementById('baziSavedModal');
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) this.closeSavedModal();
        });
      }

      // Search in Saved Modal
      const savedSearchInput = document.getElementById('baziSavedSearchInput');
      if (savedSearchInput) {
        savedSearchInput.addEventListener('input', (e) => this.renderSavedProfilesList(e.target.value));
      }

      // Populate Annual Year Dropdowns (1950 - 2040)
      ['baziAnnualYearSelect', 'baziAdvanceAnnualYearSelect'].forEach(id => {
        const yearSelect = document.getElementById(id);
        if (yearSelect) {
          yearSelect.innerHTML = '';
          const curY = this.selectedYear || new Date().getFullYear();
          for (let y = 2040; y >= 1950; y--) {
            const sIdx = ((y - 4) % 10 + 10) % 10;
            const bIdx = ((y - 4) % 12 + 12) % 12;
            const opt = document.createElement('option');
            opt.value = y;
            opt.textContent = `ปี ${y} (${STEMS[sIdx].zh}${BRANCHES[bIdx].zh} • ${BRANCHES[bIdx].zodiac.split(' ')[0]})`;
            if (y === curY) opt.selected = true;
            yearSelect.appendChild(opt);
          }

          yearSelect.addEventListener('change', (e) => {
            const y = parseInt(e.target.value, 10);
            if (y) this.selectAnnualYear(y);
          });
        }
      });

      // Annual Year Chips
      document.querySelectorAll('.bazi-year-chip').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const y = parseInt(e.currentTarget.dataset.year, 10);
          if (y) this.selectAnnualYear(y);
        });
      });

      // Guest calculation button
      const guestCalcBtn = document.getElementById('baziGuestCalcBtn');
      if (guestCalcBtn) {
        guestCalcBtn.addEventListener('click', () => this.calculateGuestFortune());
      }

      // Guest question input Enter key
      const guestQuestionInput = document.getElementById('baziGuestQuestionInput');
      if (guestQuestionInput) {
        guestQuestionInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.calculateGuestFortune();
          }
        });
        guestQuestionInput.addEventListener('input', () => {
          const resultContainer = document.getElementById('baziGuestResultContainer');
          if (resultContainer && !resultContainer.classList.contains('hidden')) {
            resultContainer.classList.add('hidden');
          }
        });
      }

      // Guest social share buttons
      const shareFbBtn = document.getElementById('baziShareFbBtn');
      const shareTtBtn = document.getElementById('baziShareTtBtn');
      const shareIgBtn = document.getElementById('baziShareIgBtn');
      const shareLineBtn = document.getElementById('baziShareLineBtn');
      const guestCopyBtn = document.getElementById('baziGuestCopyBtn');

      if (shareFbBtn) shareFbBtn.addEventListener('click', () => this.shareGuestResult('fb'));
      if (shareTtBtn) shareTtBtn.addEventListener('click', () => this.shareGuestResult('tt'));
      if (shareIgBtn) shareIgBtn.addEventListener('click', () => this.shareGuestResult('ig'));
      if (shareLineBtn) shareLineBtn.addEventListener('click', () => this.shareGuestResult('line'));
      if (guestCopyBtn) guestCopyBtn.addEventListener('click', () => this.copyGuestResultText());

      // Member header actions
      const btnMyChart = document.getElementById('baziBtnMyChart');
      if (btnMyChart) {
        btnMyChart.addEventListener('click', () => this.loadMyProfileChart());
      }
      const openSavedModalBtnTop = document.getElementById('baziOpenSavedModalBtnTop');
      if (openSavedModalBtnTop) {
        openSavedModalBtnTop.addEventListener('click', () => this.openSavedModal());
      }
    },

    restoreActiveChart: function (showToast = false) {
      const nameInput = document.getElementById('baziNameInput');
      const dateInput = document.getElementById('baziDateInput');
      const hourInput = document.getElementById('baziHourInput');
      const genderSelect = document.getElementById('baziGenderSelect');
      const unknownCheck = document.getElementById('baziUnknownTimeCheck');

      let params = null;

      // 1. URL search params
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const qDate = urlParams.get('birthDate') || urlParams.get('bDate') || urlParams.get('date');
        const qTime = urlParams.get('birthTime') || urlParams.get('bTime') || urlParams.get('time');
        const qName = urlParams.get('name') || urlParams.get('bName');
        const qGender = urlParams.get('gender');
        if (qDate) {
          params = {
            birthDate: qDate,
            name: qName ? decodeURIComponent(qName) : 'ดวงชะตา',
            gender: qGender || 'female'
          };
          if (qTime) {
            const p = qTime.split(':');
            params.birthHour = parseInt(p[0], 10) || 12;
            params.birthMinute = parseInt(p[1], 10) || 0;
          }
        }
      } catch (e) { }

      // 2. LocalStorage active chart params
      if (!params) {
        try {
          const raw = localStorage.getItem('bazi_last_active_chart_params');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.birthDate) {
              params = parsed;
            }
          }
        } catch (e) { }
      }

      // 3. Saved profiles in local storage
      if (!params && this.savedProfiles && this.savedProfiles.length > 0) {
        const p = this.savedProfiles[0];
        if (p && p.birthDate) {
          params = {
            birthDate: p.birthDate,
            birthHour: p.birthHour !== undefined ? p.birthHour : 12,
            birthMinute: p.birthMinute !== undefined ? p.birthMinute : 0,
            gender: p.gender || 'female',
            name: p.name || 'ลูกดวง',
            isUnknownTime: !!p.isUnknownTime
          };
        }
      }

      // 4. Default baseline chart (1988-09-20 13:40 female) so screen is never blank
      if (!params) {
        params = {
          birthDate: '1988-09-20',
          birthHour: 13,
          birthMinute: 40,
          gender: 'female',
          name: 'เจ้าชะตา',
          isUnknownTime: false
        };
      }

      // Apply params to inputs
      if (params) {
        if (nameInput) nameInput.value = params.name || '';
        if (dateInput) dateInput.value = params.birthDate || '';
        if (hourInput) {
          const hh = String(params.birthHour !== undefined ? params.birthHour : 12).padStart(2, '0');
          const mm = String(params.birthMinute !== undefined ? params.birthMinute : 0).padStart(2, '0');
          hourInput.value = `${hh}:${mm}`;
        }
        if (genderSelect && params.gender) genderSelect.value = params.gender;
        if (unknownCheck) unknownCheck.checked = !!params.isUnknownTime;

        this.syncDateInputToDropdowns();
        this.syncTimeInputToDropdowns();

        // Calculate and render
        this.calculateFromInputs(showToast);
        return true;
      }
      return false;
    },

    onTabShow: function () {
      const isAuth = !!(window.AuthManager && window.AuthManager.isLoggedIn());
      this.updateViewForAuthState(isAuth, window.AuthManager ? window.AuthManager.currentUser : null);

      if (!this.currentChart) {
        this.restoreActiveChart(false);
      }

      if (this.currentChart) {
        this.renderBasicSuite(this.currentChart);
        this.renderAdvanceSuite(this.currentChart);
        this.updateResultVisibility(true);
      } else {
        this.updateResultVisibility(false);
      }

      this.switchSubMenu(this.currentSubMenu || 'advance');
    },

    calculateFromInputs: function (showToast = false) {
      const nameInput = document.getElementById('baziNameInput');
      const dateInput = document.getElementById('baziDateInput');
      const hourInput = document.getElementById('baziHourInput');
      const genderSelect = document.getElementById('baziGenderSelect');

      if (!dateInput || !dateInput.value) {
        this.syncDropdownsToDateInput();
      }
      if (!hourInput || !hourInput.value) {
        this.syncDropdownsToTimeInput();
      }

      const birthDate = dateInput ? dateInput.value : '';
      if (!birthDate) {
        if (showToast) {
          this.showToast('กรุณาเลือกวัน เดือน ปีเกิด ให้ครบถ้วนก่อนคำนวณค่ะ', 'warning');
        }
        this.updateResultVisibility(false);
        return;
      }

      const now = new Date();
      const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'ดวงชะตา';
      let birthHour = 12;
      let birthMinute = 0;

      if (hourInput && hourInput.value) {
        const parts = hourInput.value.split(':');
        birthHour = parseInt(parts[0], 10);
        birthMinute = parseInt(parts[1], 10);
        if (isNaN(birthHour)) birthHour = 12;
        if (isNaN(birthMinute)) birthMinute = 0;
      }

      const gender = genderSelect ? genderSelect.value : 'female';
      const unknownCheck = document.getElementById('baziUnknownTimeCheck');
      const isUnknownTime = !!(unknownCheck && unknownCheck.checked);

      const chart = BaziEngine.calculateChart({
        birthDate,
        birthHour,
        birthMinute,
        gender,
        name,
        isUnknownTime
      });

      this.currentChart = chart;
      try {
        localStorage.setItem('bazi_last_active_chart_params', JSON.stringify({
          birthDate,
          birthHour,
          birthMinute,
          gender,
          name,
          isUnknownTime
        }));
      } catch (e) {}
      this.askChatHistory = [];
      this.currentAskChartKey = null;

      // Automatically sync active Da Yun with the currently selected annual year
      const curCalcYear = this.selectedYear || now.getFullYear();
      const birthYear = chart.birthDateString ? parseInt(chart.birthDateString.split('-')[0], 10) : now.getFullYear();
      const ageInYear = curCalcYear - birthYear;
      const matchingIdx = chart.daYunPillars.findIndex(p => ageInYear >= p.ageFrom && ageInYear <= p.ageTo);
      this.selectedDaYunIndex = matchingIdx !== -1 ? matchingIdx : 0;

      this.renderChart(chart);
      this.renderBasicSuite(chart);
      this.renderAdvanceSuite(chart);

      this.updateResultVisibility(true);

      const triSection = document.getElementById('baziTriSection');
      const fourPillarsSec = document.getElementById('baziFourPillarsSection');
      const isExp = this.currentMode === 'expert';
      if (triSection) {
        if (isExp) {
          triSection.style.setProperty('display', 'none', 'important');
          triSection.classList.add('hidden-in-expert');
          triSection.setAttribute('hidden', '');
        } else {
          triSection.style.removeProperty('display');
          triSection.classList.remove('hidden-in-expert');
          triSection.removeAttribute('hidden');
        }
      }
      if (fourPillarsSec) {
        if (!isExp) {
          fourPillarsSec.style.setProperty('display', 'none', 'important');
          fourPillarsSec.classList.add('hidden-in-basic');
          fourPillarsSec.setAttribute('hidden', '');
        } else {
          fourPillarsSec.style.removeProperty('display');
          fourPillarsSec.classList.remove('hidden-in-basic');
          fourPillarsSec.removeAttribute('hidden');
        }
      }

      if (showToast) {
        this.showToast(`วิเคราะห์ดวงชะตา ${name} เรียบร้อยแล้วค่ะ`);
      }
    },

    saveCurrentProfile: function () {
      const nameInput = document.getElementById('baziNameInput');
      const dateInput = document.getElementById('baziDateInput');
      const hourInput = document.getElementById('baziHourInput');
      const genderSelect = document.getElementById('baziGenderSelect');

      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const defaultTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const rawName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : '';
      const name = rawName || `ลูกดวง (${dateInput && dateInput.value ? dateInput.value : todayStr})`;
      const birthDate = dateInput && dateInput.value ? dateInput.value : todayStr;
      const birthTime = hourInput && hourInput.value ? hourInput.value : defaultTimeStr;
      const gender = genderSelect ? genderSelect.value : 'male';

      const profile = {
        id: 'bazi_' + Date.now(),
        name,
        gender,
        birthDate,
        birthTime,
        savedAt: new Date().toLocaleDateString('th-TH')
      };

      // Check if duplicate name exists, replace or append
      const existingIdx = this.savedProfiles.findIndex(p => p.name === name);
      if (existingIdx !== -1) {
        this.savedProfiles[existingIdx] = profile;
      } else {
        this.savedProfiles.unshift(profile);
      }

      this.saveProfilesToStorage();
      this.renderQuickProfileSelect();
      const quickSel = document.getElementById('baziQuickProfileSelect');
      if (quickSel) quickSel.value = profile.id;

      this.showToast(`บันทึกข้อมูลดวง "${name}" เรียบร้อยแล้วค่ะ`);
    },

    openSavedModal: function () {
      const modal = document.getElementById('baziSavedModal');
      if (modal) {
        modal.classList.remove('hidden');
        this.renderSavedProfilesList();
      }
    },

    closeSavedModal: function () {
      const modal = document.getElementById('baziSavedModal');
      if (modal) modal.classList.add('hidden');
    },

    renderSavedProfilesList: function (filterQuery = '') {
      const container = document.getElementById('baziSavedProfilesList');
      if (!container) return;

      const q = filterQuery.toLowerCase().trim();
      const filtered = this.savedProfiles.filter(p => p.name.toLowerCase().includes(q) || (p.birthDate && p.birthDate.includes(q)));

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="bazi-empty-saved" style="text-align: center; padding: 30px 10px;">
            <i class="fa-solid fa-folder-open" style="font-size: 36px; color: #cbd5e1; margin-bottom: 10px;"></i>
            <p style="font-size: 14px; font-weight: 600; color: #475569;">ไม่พบรายชื่อลูกดวงที่ตรงกับการค้นหา</p>
            <span style="font-size: 12px; color: #94a3b8;">กดปุ่ม "💾 บันทึกลูกดวง" ที่แถบด้านบนเพื่อบันทึกข้อมูลดวงชะตา</span>
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(p => `
        <div class="bazi-saved-item">
          <div class="bazi-saved-info" onclick="window.BaziApp.loadProfile('${p.id}')">
            <strong><i class="fa-solid fa-user-circle" style="color: #7c3aed;"></i> ${p.name} (${p.gender === 'male' ? 'ชาย' : 'หญิง'})</strong>
            <span>📅 ${p.birthDate} • ⏰ ${p.birthTime} น. <small style="color: #94a3b8;">(บันทึกเมื่อ ${p.savedAt})</small></span>
          </div>
          <div class="bazi-saved-actions">
            <button class="bazi-btn-primary" style="padding: 6px 12px; font-size: 12px;" onclick="window.BaziApp.loadProfile('${p.id}')">
              <i class="fa-solid fa-wand-magic-sparkles"></i> โหลดดวง
            </button>
            <button class="bazi-btn-delete" title="ลบรายชื่อนี้" onclick="window.BaziApp.deleteProfile('${p.id}', event)">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `).join('');
    },

    loadProfile: function (id) {
      const p = this.savedProfiles.find(item => item.id === id);
      if (!p) return;

      const nameInput = document.getElementById('baziNameInput');
      const dateInput = document.getElementById('baziDateInput');
      const hourInput = document.getElementById('baziHourInput');
      const genderSelect = document.getElementById('baziGenderSelect');

      if (nameInput) nameInput.value = p.name;
      if (dateInput) dateInput.value = p.birthDate;
      if (hourInput) hourInput.value = p.birthTime;
      if (genderSelect) genderSelect.value = p.gender;
      this.syncDateInputToDropdowns();
      this.syncTimeInputToDropdowns();

      const quickSel = document.getElementById('baziQuickProfileSelect');
      if (quickSel) quickSel.value = p.id;

      this.closeSavedModal();
      this.askChatHistory = [];
      this.currentAskChartKey = null;
      this.calculateFromInputs();
      this.showToast(`โหลดดวงของ "${p.name}" เรียบร้อยแล้วค่ะ`);
    },

    deleteProfile: function (id, event) {
      if (event) event.stopPropagation();
      const p = this.savedProfiles.find(item => item.id === id);
      const name = p ? p.name : 'รายชื่อนี้';
      if (!confirm(`ต้องการลบข้อมูลลูกดวง "${name}" ออกจากระบบใช่หรือไม่?`)) return;

      this.savedProfiles = this.savedProfiles.filter(item => item.id !== id);
      this.saveProfilesToStorage();
      this.renderQuickProfileSelect();
      this.renderSavedProfilesList();
      this.showToast(`ลบข้อมูลลูกดวง "${name}" เรียบร้อยแล้วค่ะ`);
    },

    renderDaYunCards: function () {
      if (!this.currentChart || !this.currentChart.daYunPillars) return;
      const dayunContainer = document.getElementById('baziDayunList');
      if (!dayunContainer) return;

      const curCalcYear = this.selectedYear || new Date().getFullYear();
      const birthYear = this.currentChart.birthDateString ? parseInt(this.currentChart.birthDateString.split('-')[0], 10) : new Date().getFullYear();
      const ageInYear = curCalcYear - birthYear;
      const activeYearIdx = this.currentChart.daYunPillars.findIndex(p => ageInYear >= p.ageFrom && ageInYear <= p.ageTo);

      dayunContainer.innerHTML = this.currentChart.daYunPillars.map((dy, idx) => {
        const sMeta = ELEMENTS_META[dy.stem.element];
        const bMeta = ELEMENTS_META[dy.branch.element];
        const isSelected = this.selectedDaYunIndex === idx;
        const isActiveYear = activeYearIdx === idx;

        let badgeHtml = '';
        if (isActiveYear) {
          badgeHtml = `<span class="active-year-dayun-tag"><i class="fa-solid fa-clock"></i> คุมปี ${curCalcYear}</span>`;
        } else if (dy.isCurrent) {
          badgeHtml = `<span class="current-tag">วัยจรปัจจุบัน</span>`;
        } else if (dy.isBirthPillar) {
          badgeHtml = `<span class="current-tag" style="background: #e0e7ff; color: #4338ca;">แรกเกิด</span>`;
        }

        return `
          <div class="dayun-card ${dy.isCurrent ? 'current-dayun' : ''} ${isSelected ? 'selected-dayun' : ''}" onclick="window.BaziApp.selectDaYun(${idx})">
            ${badgeHtml}
            <div class="dayun-age">${dy.ageRange}</div>
            <div class="dayun-chars">
              <span style="color: ${sMeta.color};">${dy.stem.zh}</span>
              <span style="color: ${bMeta.color};">${dy.branch.zh}</span>
            </div>
            <div class="dayun-info">
              <span class="dayun-py">${dy.stem.py} ${dy.branch.py}</span>
              <span class="dayun-god">${dy.tenGod.zh}</span>
            </div>
            <div class="dayun-nayin">${dy.naYin.split(' ')[0]}</div>
            <div class="dayun-click-hint">คลิกดูคำทำนาย</div>
          </div>
        `;
      }).join('');
    },

    selectDaYun: function (index) {
      this.selectedDaYunIndex = index;
      if (this.currentChart && this.currentChart.daYunPillars && this.currentChart.daYunPillars[index]) {
        const dy = this.currentChart.daYunPillars[index];
        this.advanceAnnualStartYear = dy.yearFrom;
      }
      this.renderDaYunCards();
      this.renderDaYunInterpretation();
      if (this.currentChart) {
        this.renderAdvanceDaYunMasterTable(this.currentChart);
        this.renderAdvanceAnnualMasterTable(this.currentChart, this.selectedYear);
        this.renderAdvanceMonthlyMasterTable(this.currentChart, this.selectedYear);
      }
    },

    selectAnnualYear: function (year) {
      this.selectedYear = year;
      // Update chips UI
      document.querySelectorAll('.bazi-year-chip').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.year, 10) === year);
      });
      // Update dropdown select UI
      ['baziAnnualYearSelect', 'baziAdvanceAnnualYearSelect'].forEach(id => {
        const yearSelect = document.getElementById(id);
        if (yearSelect && parseInt(yearSelect.value, 10) !== year) {
          yearSelect.value = year;
        }
      });

      // Automatically sync active Da Yun with target year
      if (this.currentChart && this.currentChart.daYunPillars) {
        const birthYear = this.currentChart.birthDateString ? parseInt(this.currentChart.birthDateString.split('-')[0], 10) : new Date().getFullYear();
        const ageInYear = year - birthYear;
        const matchingIdx = this.currentChart.daYunPillars.findIndex(p => ageInYear >= p.ageFrom && ageInYear <= p.ageTo);
        if (matchingIdx !== -1) {
          this.selectedDaYunIndex = matchingIdx;
          this.renderDaYunInterpretation();
        }
      }

      this.renderDaYunCards();
      this.renderAnnualAndMonthlyFortune();
      if (this.currentChart) {
        this.renderAdvanceDaYunMasterTable(this.currentChart);
        this.renderAdvanceAnnualMasterTable(this.currentChart, this.selectedYear);
        this.renderAdvanceMonthlyMasterTable(this.currentChart, this.selectedYear);
      }
    },

    selectMonth: function (idx) {
      this.selectedMonthIndex = idx;
      document.querySelectorAll('.bazi-month-cell').forEach((el, i) => {
        el.classList.toggle('active', i === idx);
      });
      document.querySelectorAll('.col-month-hdr').forEach(el => {
        const mIdx = parseInt(el.dataset.monthIndex, 10);
        el.classList.toggle('selected-luck-hdr', mIdx === idx);
      });
      this.renderSelectedMonthDetail();
    },

    renderChart: function (chart) {
      // 1. Day Master Badge & Hero summary
      const dmBadge = document.getElementById('baziDmBadge');
      const dmTitle = document.getElementById('baziDmTitle');
      const dmDesc = document.getElementById('baziDmDesc');
      const dmStrengthBadge = document.getElementById('baziDmStrengthBadge');

      const dmMeta = ELEMENTS_META[chart.dayMaster.element];

      if (dmBadge) {
        dmBadge.innerHTML = `<span class="dm-char" style="color: ${dmMeta.color};">${chart.dayMaster.zh}</span><span class="dm-sub">${chart.dayMaster.py} (${dmMeta.th})</span>`;
      }
      if (dmTitle) {
        dmTitle.textContent = `${chart.name} • ดิถีธาตุ ${chart.dayMaster.zh} (${chart.dayMaster.th})`;
      }
      if (dmDesc) {
        dmDesc.textContent = chart.dayMasterProfile.title;
      }
      if (dmStrengthBadge) {
        dmStrengthBadge.textContent = chart.strengthText;
        dmStrengthBadge.className = `bazi-badge ${chart.isStrong ? 'badge-strong' : 'badge-weak'}`;
      }

      // 2. Four Pillars Table
      const natalCols = [chart.pillars.hour, chart.pillars.day, chart.pillars.month, chart.pillars.year];
      const curYear = this.selectedYear || new Date().getFullYear();
      const yrSIdx = ((curYear - 4) % 10 + 10) % 10;
      const yrBIdx = ((curYear - 4) % 12 + 12) % 12;
      const annualPillar = { stem: STEMS[yrSIdx], branch: BRANCHES[yrBIdx], label: `ปีจร ${curYear}` };
      const curDaYun = (chart.daYunPillars && chart.daYunPillars[this.selectedDaYunIndex]) || (chart.daYunPillars && chart.daYunPillars.find(d => d.isCurrent)) || (chart.daYunPillars && chart.daYunPillars[0]);
      const luckPillar = curDaYun ? { stem: curDaYun.stem, branch: curDaYun.branch, label: `วัยจร ${curDaYun.ageRange}` } : annualPillar;

      const renderPillarCol = (pKey, colId) => {
        const p = chart.pillars[pKey];
        const colEl = document.getElementById(colId);
        if (!colEl) return;

        const sMeta = ELEMENTS_META[p.stem.element];
        const bMeta = ELEMENTS_META[p.branch.element];

        let hiddenHtml = p.hiddenStems.map(h => {
          const hMeta = ELEMENTS_META[h.stemObj.element];
          return `
            <div class="hidden-stem-item">
              <span class="hidden-char" style="color: ${hMeta.color};">${h.stem}</span>
              <span class="hidden-god">${h.tenGod.zh}</span>
              <span class="hidden-pct">${Math.round(h.weight * 100)}%</span>
            </div>
          `;
        }).join('');

        // 1. Na Yin with 5-Element Color Ribbon
        const sIdx = STEMS.findIndex(s => s.zh === p.stem.zh);
        const bIdx = BRANCHES.findIndex(b => b.zh === p.branch.zh);
        const ny = this.getNaYinDetail(sIdx, bIdx);
        const nayinColorBg = `nayin-bg-${ny.element}`;

        // 2. 12 Qi Phases (12 วงจรชีวิต / Chang Sheng)
        const dmLife = this.get12LifeStage(chart.dayMaster.zh, p.branch.zh);
        const pillarLife = this.get12LifeStage(p.stem.zh, p.branch.zh);

        // 3. Symbolic Stars (เทพและดาวชะตา)
        const detailedStars = this.computeDetailedStars(
          p.branch.zh,
          p.stem.zh,
          chart.dayMaster.zh,
          chart.pillars.day.branch.zh,
          chart.pillars.year.branch.zh,
          chart.pillars.month.branch.zh
        );

        let starsListHtml = '';
        if (detailedStars.dmStars && detailedStars.dmStars.length > 0) {
          starsListHtml += `
            <div style="margin-bottom: 4px;">
              <span style="font-size: 10px; font-weight: 700; color: #7c3aed; background: #f3e8ff; padding: 1px 6px; border-radius: 4px; display: inline-block; margin-bottom: 3px;">DM (จากดิถี):</span>
              <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                ${detailedStars.dmStars.map(s => `
                  <span class="bazi-star-pill" title="${s}">★ ${s}</span>
                `).join('')}
              </div>
            </div>
          `;
        }
        if (detailedStars.otherStars && detailedStars.otherStars.length > 0) {
          starsListHtml += `
            <div>
              <span style="font-size: 10px; font-weight: 700; color: #0284c7; background: #e0f2fe; padding: 1px 6px; border-radius: 4px; display: inline-block; margin-bottom: 3px;">Other (จากปี/เดือน):</span>
              <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                ${detailedStars.otherStars.map(s => `
                  <span class="bazi-star-pill other-star-pill" title="${s}">✧ ${s}</span>
                `).join('')}
              </div>
            </div>
          `;
        }
        if (!starsListHtml) {
          starsListHtml = '<span class="text-muted" style="font-size: 11px; color: #94a3b8;">- ราบรื่น ไม่มีดาวอิทธิพลรุนแรง -</span>';
        }

        // 4. Element Interactions (刑沖合害)
        const detailedInteractions = this.computeDetailedInteractions(
          p,
          natalCols,
          annualPillar,
          luckPillar
        );

        let interactionsHtml = '';
        if (detailedInteractions.natalInteractions && detailedInteractions.natalInteractions.length > 0) {
          interactionsHtml += `
            <div style="margin-bottom: 4px;">
              ${detailedInteractions.natalInteractions.map(it => {
            const cls = this.getInteractionClass(it);
            const st = this.getInteractionStyle(it);
            const info = this.getInteractionTooltipData(it);
            const titleAttr = info ? `${info.title} - ${info.meaning}`.replace(/"/g, '&quot;') : '';
            const cleanIt = it.replace(/"/g, '&quot;');
            return `
                  <div class="interaction-item ${cls}" style="${st}" data-interaction-text="${cleanIt}" title="${titleAttr}">
                    • ${it}
                  </div>
                `;
          }).join('')}
            </div>
          `;
        }
        if (detailedInteractions.luckInteractions && detailedInteractions.luckInteractions.length > 0) {
          interactionsHtml += `
            <div style="border-top: 1px dashed #e2e8f0; padding-top: 4px; margin-top: 4px;">
              <span style="font-size: 10px; font-weight: 700; color: #b45309;">วัยจร (Luck Pillar):</span>
              ${detailedInteractions.luckInteractions.map(it => {
            const cls = this.getInteractionClass(it);
            const st = this.getInteractionStyle(it);
            const info = this.getInteractionTooltipData(it);
            const titleAttr = info ? `${info.title} - ${info.meaning}`.replace(/"/g, '&quot;') : '';
            const cleanIt = it.replace(/"/g, '&quot;');
            return `
                  <div class="interaction-item ${cls}" style="${st}" data-interaction-text="${cleanIt}" title="${titleAttr}">
                    • ${it}
                  </div>
                `;
          }).join('')}
            </div>
          `;
        }
        if (!interactionsHtml) {
          interactionsHtml = '<span class="text-muted" style="font-size: 11px; color: #94a3b8;">- สมดุล ไม่มีปะทะ/ฮะรุนแรง -</span>';
        }

        colEl.innerHTML = `
          <div class="bazi-pillar-card">
            <div class="pillar-header">
              <span class="pillar-label">${p.label}</span>
              <span class="pillar-role">${p.role}</span>
            </div>
            
            <div class="pillar-tengod">
              <span class="god-badge">${p.tenGod.zh}</span>
              <span class="god-th">${p.tenGod.th}</span>
            </div>

            <div class="pillar-stem" style="border-left: 4px solid ${sMeta.color};">
              <span class="stem-zh" style="color: ${sMeta.color};">${p.stem.zh}</span>
              <div class="stem-info">
                <strong>${p.stem.py} (${p.stem.polarity === 'yang' ? 'หยาง' : 'หยิน'})</strong>
                <span>${sMeta.th}</span>
              </div>
            </div>

            <div class="pillar-branch" style="border-left: 4px solid ${bMeta.color};">
              <span class="branch-zh" style="color: ${bMeta.color};">${p.branch.zh}</span>
              <div class="branch-info">
                <strong>${p.branch.py} • ${p.branch.zodiac}</strong>
                <span>${bMeta.th} (${p.branch.season})</span>
              </div>
            </div>

            <div class="pillar-hidden-section">
              <span class="sub-label">ก้านฟ้าซ่อน (藏干):</span>
              <div class="hidden-stems-grid">
                ${hiddenHtml}
              </div>
            </div>

            <!-- Na Yin with element color -->
            <div class="pillar-nayin-section" style="margin-top: 8px; margin-bottom: 8px;">
              <div class="bazi-nayin-ribbon ${nayinColorBg}">
                ${ny.en} • ${ny.zh}
              </div>
              <div style="font-size: 11px; color: #475569; text-align: center; margin-top: 3px;">
                <i class="fa-solid fa-music" style="color: #7c3aed;"></i> นัปอิม: ${ny.th}
              </div>
            </div>

            <!-- 12 Qi Phases -->
            <div class="pillar-qi-phase-box" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 8px; font-size: 11px; margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="color: #64748b;">ดิถีชี่ (DM Qi):</span>
                <strong style="color: #0f172a;">${dmLife.order}. ${dmLife.en} / ${dmLife.zh} ${dmLife.symbol}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b;">เสาชี่ (Pillar Qi):</span>
                <strong style="color: #475569;">${pillarLife.order}. ${pillarLife.en} / ${pillarLife.zh} ${pillarLife.symbol}</strong>
              </div>
            </div>

            <!-- Symbolic Stars -->
            <div class="pillar-stars" style="margin-bottom: 8px;">
              <span class="sub-label"><i class="fa-solid fa-star" style="color: #f59e0b;"></i> เทพและดาวชะตา (神煞):</span>
              <div class="stars-wrap" style="margin-top: 4px;">
                ${starsListHtml}
              </div>
            </div>

            <!-- Element Interactions -->
            <div class="pillar-interactions" style="border-top: 1px dashed #e2e8f0; padding-top: 6px;">
              <span class="sub-label"><i class="fa-solid fa-arrows-spin" style="color: #7c3aed;"></i> ปฏิสัมพันธ์ของธาตุ (Interactions):</span>
              <div class="interactions-wrap" style="margin-top: 4px;">
                ${interactionsHtml}
              </div>
            </div>
          </div>
        `;
      };

      renderPillarCol('hour', 'baziHourCol');
      renderPillarCol('day', 'baziDayCol');
      renderPillarCol('month', 'baziMonthCol');
      renderPillarCol('year', 'baziYearCol');

      // Also render Master Matrix table!
      this.renderMasterFourPillarsMatrix();
      this.setMatrixView(this.currentMatrixView || (this.currentMode === 'expert' ? 'matrix' : 'cards'));

      // 3. Five Elements Balance Bars
      const elementsContainer = document.getElementById('baziElementsBars');
      if (elementsContainer) {
        const order = ['wood', 'fire', 'earth', 'metal', 'water'];
        elementsContainer.innerHTML = order.map(el => {
          const meta = ELEMENTS_META[el];
          const pct = chart.elementPercentages[el] || 0;
          const score = chart.elementScores[el].toFixed(1);
          let statusText = 'สมดุล';
          if (pct >= 35) statusText = 'เด่นมาก';
          else if (pct <= 8) statusText = 'พร่อง/ขาด';

          return `
            <div class="element-bar-row">
              <div class="el-name-badge" style="color: ${meta.color};">
                <strong>${meta.zh} ${meta.th}</strong>
                <span class="el-score-tag">${score} คะแนน (${pct}%)</span>
              </div>
              <div class="el-track">
                <div class="el-fill" style="width: ${Math.min(pct * 2, 100)}%; background-color: ${meta.color};"></div>
              </div>
              <span class="el-status-tag el-status-${pct >= 35 ? 'high' : pct <= 8 ? 'low' : 'normal'}">${statusText}</span>
            </div>
          `;
        }).join('');
      }

      // Favorable / Avoid Elements & Tiao Hou
      const favEl = document.getElementById('baziFavElements');
      const tiaoHouEl = document.getElementById('baziTiaoHouElement');
      const avoidEl = document.getElementById('baziAvoidElements');
      const adviceEl = document.getElementById('baziRegulatingAdvice');

      if (favEl) {
        favEl.innerHTML = chart.favorableElements.map(k => {
          const meta = ELEMENTS_META[k];
          return `<span class="bazi-tag-pill" style="background: ${meta.lightBg}; color: ${meta.color}; border: 1px solid ${meta.border};"><i class="fa-solid fa-circle-check"></i> ${meta.zh} ${meta.th}</span>`;
        }).join('');
      }

      if (tiaoHouEl && chart.tiaoHou) {
        const thMeta = ELEMENTS_META[chart.tiaoHou.element];
        tiaoHouEl.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span class="bazi-tag-pill" style="background: ${thMeta.lightBg}; color: ${thMeta.color}; border: 1.5px solid ${thMeta.border}; font-weight: 700; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <i class="fa-solid fa-gem"></i> ${thMeta.zh} ${thMeta.th}
            </span>
            <span style="font-size: 11.5px; color: #475569; font-weight: 600;">(${chart.tiaoHou.role})</span>
          </div>
        `;
      }

      if (avoidEl) {
        if (!chart.avoidElements || chart.avoidElements.length === 0) {
          avoidEl.innerHTML = '<span style="font-size: 12px; color: #10b981;"><i class="fa-solid fa-check"></i> ดวงค่อนข้างสมดุล ไม่มีธาตุที่ให้โทษเด่นชัด</span>';
        } else {
          avoidEl.innerHTML = chart.avoidElements.map(k => {
            const meta = ELEMENTS_META[k];
            return `<span class="bazi-tag-pill" style="background: ${meta.lightBg}; color: ${meta.color}; border: 1px solid ${meta.border};"><i class="fa-solid fa-circle-exclamation"></i> ${meta.zh} ${meta.th}</span>`;
          }).join('');
        }
      }

      if (adviceEl && chart.tiaoHou) {
        const thMeta = ELEMENTS_META[chart.tiaoHou.element];
        adviceEl.innerHTML = `
          <div style="margin-bottom: 5px;">
            <i class="fa-solid fa-scale-balanced" style="color: ${thMeta.color};"></i> 
            <strong>หลักการปรับดวง (調候用神):</strong> ${chart.tiaoHou.reason}
          </div>
          <div style="font-size: 11px; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 4px; margin-top: 4px;">
            <i class="fa-solid fa-wand-magic-sparkles" style="color: #f59e0b;"></i> <strong>แนวทางส่งเสริม:</strong> เน้นสีและสิ่งแวดล้อม${thMeta.th} (${thMeta.direction}, ความหมาย: ${thMeta.emotion})
          </div>
        `;
      }

      // 4. Da Yun Timeline (วัยจร 10 ปี)
      this.renderDaYunCards();

      // 5. Strategic Life Insights (Deep Metaphysical Engine)
      const deep = this.generateDeepInsights ? this.generateDeepInsights(chart) : null;
      const prof = chart.dayMasterProfile;
      const setElText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
      };

      setElText('baziTraitsText', (deep && deep.traits) ? deep.traits : prof.traits);
      setElText('baziCareerText', (deep && deep.career) ? deep.career : prof.career);
      setElText('baziWealthText', (deep && deep.wealth) ? deep.wealth : prof.wealth);
      setElText('baziLoveText', (deep && deep.love) ? deep.love : prof.love);
      setElText('baziHealthText', (deep && deep.health) ? deep.health : prof.health);
      const weaknessEl = document.getElementById('baziWeaknessText');
      if (weaknessEl && deep && deep.weakness) {
        weaknessEl.innerHTML = deep.weakness;
      }

      // Feng Shui Recommendations
      const fsContainer = document.getElementById('baziFengShuiList');
      if (fsContainer) {
        const favNames = chart.favorableElements.map(k => ELEMENTS_META[k].th).join(', ');
        const favDirs = chart.favorableElements.map(k => ELEMENTS_META[k].direction).join(', ');
        const favColors = chart.favorableElements.map(k => {
          if (k === 'wood') return 'เขียว, ไม้ธรรมชาติ, ลายพฤกษา';
          if (k === 'fire') return 'แดง, ชมพู, ส้มสดใส, ม่วง';
          if (k === 'earth') return 'เหลือง, ครีม, น้ำตาล, เอิร์ธโทน';
          if (k === 'metal') return 'ขาว, เงิน, ทองคำ, เทาเมทัลลิก';
          return 'ฟ้า, น้ำเงิน, ดำ, กรมท่า';
        }).join(' | ');

        fsContainer.innerHTML = `
          <div class="fs-item"><i class="fa-solid fa-palette"></i> <strong>สีมงคลเสริมชีวิต:</strong> ${favColors}</div>
          <div class="fs-item"><i class="fa-solid fa-compass"></i> <strong>ทิศมงคลตั้งโต๊ะทำงาน/หัวนอน:</strong> ${favDirs}</div>
          <div class="fs-item"><i class="fa-solid fa-wand-magic-sparkles"></i> <strong>ธาตุปรับสมดุล (喜用神):</strong> ${favNames} (ส่งเสริมให้ชีวิตราบรื่น มีพลังเกื้อหนุน)</div>
        `;
      }
    },

    renderDaYunInterpretation: function () {
      if (!this.currentChart) return;
      const dyPillar = this.currentChart.daYunPillars[this.selectedDaYunIndex || 0];
      if (!dyPillar) return;

      const interp = BaziEngine.calculateDaYunInterpretation(this.currentChart, dyPillar);
      if (!interp) return;

      const titleEl = document.getElementById('baziDayunDetailTitle');
      if (titleEl) {
        titleEl.innerHTML = `ช่วงอายุ ${dyPillar.ageRange} (${dyPillar.stem.zh}${dyPillar.branch.zh} • ${dyPillar.tenGod.zh} ${dyPillar.tenGod.th}) - <span style="font-size: 13px; font-weight: normal; color: ${interp.isFavorable ? '#059669' : '#d97706'};">${interp.favorabilityText}</span>`;
      }

      const setText = (id, txt) => {
        const el = document.getElementById(id);
        if (el) el.textContent = txt;
      };

      setText('baziDayunOverviewText', interp.theme);
      setText('baziDayunCareerText', interp.career);
      setText('baziDayunWealthText', interp.wealth);
      setText('baziDayunLoveText', interp.love);

      const warnEl = document.getElementById('baziDayunWarningText');
      if (warnEl) {
        warnEl.innerHTML = `<i class="fa-solid fa-shield-halved" style="color: #ef4444;"></i> <strong>ข้อควรระวัง & สุขภาพ:</strong> ${interp.warning}`;
      }
    },

    renderAnnualAndMonthlyFortune: function () {
      if (!this.currentChart) return;
      const y = this.selectedYear || new Date().getFullYear();

      // Sync Year Display Labels
      const labelEl = document.getElementById('baziMonthYearLabel');
      if (labelEl) labelEl.textContent = y;
      const advYearDisplay = document.getElementById('baziAdvanceAnnualYearDisplay');
      if (advYearDisplay) advYearDisplay.textContent = y;

      // Sync Year Chips in Advance
      document.querySelectorAll('#baziAdvanceYearChips .bazi-year-chip').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.year, 10) === y);
      });
      const advYearSelect = document.getElementById('baziAdvanceAnnualYearSelect');
      if (advYearSelect && parseInt(advYearSelect.value, 10) !== y) {
        advYearSelect.value = y;
      }

      // 1. Annual Fortune
      const annual = BaziEngine.calculateAnnualFortune(this.currentChart, y);
      if (annual) {
        const sMeta = ELEMENTS_META[annual.stem.element];
        const bMeta = ELEMENTS_META[annual.branch.element];
        const starsHtml = '⭐'.repeat(annual.scoreStars);

        // Compute Annual Interactions with 4 Natal Pillars + Da Yun
        const annualPillar = { stem: annual.stem, branch: annual.branch, label: `ปีจร ${y}` };
        const natalCols = [
          this.currentChart.pillars.hour,
          this.currentChart.pillars.day,
          this.currentChart.pillars.month,
          this.currentChart.pillars.year
        ];
        const luckPillar = annual.curDaYun ? { stem: annual.curDaYun.stem, branch: annual.curDaYun.branch, label: `วัยจร ${annual.curDaYun.ageRange}` } : null;

        const annualInter = this.computeDetailedInteractions(annualPillar, natalCols, null, luckPillar, 'annual');
        const allAnnualInteractions = [...annualInter.primary, ...annualInter.secondary];

        let annualInteractionsHtml = '';
        if (allAnnualInteractions.length > 0) {
          annualInteractionsHtml = allAnnualInteractions.map(it => {
            const cls = this.getInteractionClass(it);
            const st = this.getInteractionStyle(it);
            const info = this.getInteractionTooltipData(it);
            const titleAttr = info ? `${info.title} - ${info.meaning}`.replace(/"/g, '&quot;') : '';
            const cleanIt = it.replace(/"/g, '&quot;');
            return `<div class="interaction-item ${cls}" style="${st}" data-interaction-text="${cleanIt}" title="${titleAttr}">${it}</div>`;
          }).join('');
        } else {
          annualInteractionsHtml = '<div style="color: #10b981; font-size: 13px; font-weight: 600;"><i class="fa-solid fa-circle-check"></i> พลังงานปีจรไหลเวียนกลมกลืน ไม่มีจุดปะทะรุนแรงกับพื้นดวงกำเนิดและวัยจร</div>';
        }

        const bannerHtml = `
          <div class="annual-banner-left">
            <div class="annual-year-chars">
              <span style="color: ${sMeta.color};">${annual.stem.zh}</span>
              <span style="color: ${bMeta.color};">${annual.branch.zh}</span>
            </div>
            <div class="annual-year-meta">
              <h3>ปี ${annual.year} (${annual.stem.py} ${annual.branch.py} - ${annual.branch.zodiac})</h3>
              <div class="annual-god-pill">ก้านฟ้า: ${annual.stemGod.zh} (${annual.stemGod.th}) • กิ่งดิน: ${annual.branchGod.zh}</div>
              ${annual.curDaYun ? `<div style="font-size: 11.5px; color: #7c3aed; font-weight: 600; margin-top: 4px;"><i class="fa-solid fa-timeline"></i> คุมโดยวัยจรช่วงอายุ ${annual.curDaYun.ageRange} (${annual.curDaYun.stem.zh}${annual.curDaYun.branch.zh} • ${annual.curDaYun.tenGod.zh} ${annual.curDaYun.tenGod.th})</div>` : ''}
              <div style="font-size: 12px; color: #64748b; margin-top: 2px;">${annual.naYin}</div>
            </div>
          </div>
          <div class="annual-banner-right">
            <div class="annual-rating-box">
              <span class="rating-label">ดัชนีสิริมงคลปีนี้:</span>
              <span class="rating-stars">${starsHtml} (${annual.scoreStars}/5)</span>
            </div>
          </div>
        `;

        const bannerEl = document.getElementById('baziAnnualBanner');
        if (bannerEl) bannerEl.innerHTML = bannerHtml;
        const advBannerEl = document.getElementById('baziAdvanceAnnualBanner');
        if (advBannerEl) advBannerEl.innerHTML = bannerHtml;

        const advInterListEl = document.getElementById('baziAdvanceAnnualInteractionsList');
        if (advInterListEl) advInterListEl.innerHTML = annualInteractionsHtml;

        const setText = (id, txt) => {
          const el = document.getElementById(id);
          if (el) el.textContent = txt || '-';
        };

        setText('baziAnnualOverviewText', annual.overview);
        setText('baziAnnualCareerText', annual.career);
        setText('baziAnnualWealthText', annual.wealth);
        setText('baziAnnualLoveText', annual.love);

        setText('baziAdvanceAnnualOverviewText', annual.overview);
        setText('baziAdvanceAnnualCareerText', annual.career);
        setText('baziAdvanceAnnualWealthText', annual.wealth);
        setText('baziAdvanceAnnualLoveText', annual.love);

        const healthEl = document.getElementById('baziAnnualHealthText');
        if (healthEl) {
          healthEl.innerHTML = `<i class="fa-solid fa-shield-heart" style="color: #ef4444;"></i> <strong>สุขภาพ & สิ่งที่ต้องระวังปี ${y}:</strong> ${annual.health}`;
        }
        const advHealthEl = document.getElementById('baziAdvanceAnnualHealthText');
        if (advHealthEl) {
          advHealthEl.textContent = annual.health;
        }

        // Render Annual Radar Chart for selected year
        this.renderBasicAnnualSpiderChart(this.currentChart, annual, y);
      }

      // 2. Monthly Fortune
      const months = BaziEngine.calculateMonthlyFortune(this.currentChart, y);
      const monthsGrid = document.getElementById('baziMonthsGrid');
      if (monthsGrid) {
        monthsGrid.innerHTML = months.map(m => {
          const sMeta = ELEMENTS_META[m.stem.element];
          const bMeta = ELEMENTS_META[m.branch.element];
          const isAct = m.index === this.selectedMonthIndex;
          return `
            <div class="bazi-month-cell ${isAct ? 'active' : ''} ${m.isCurrent ? 'current-month' : ''}" onclick="window.BaziApp.selectMonth(${m.index})" title="${m.title}">
              ${m.isCurrent ? '<span class="current-month-badge">เดือนนี้</span>' : ''}
              <div class="month-cell-header">
                <div class="month-cell-title">
                  <span class="month-name-bold">${m.labelDate}</span> <span class="month-num-bracket">(${m.monthNum})</span>
                </div>
                <span class="month-cell-rating rating-${m.ratingType}">${m.ratingBadgeShort}</span>
              </div>
              <div class="month-cell-chars">
                <span style="color: ${sMeta.color};">${m.stem.zh}</span>
                <span style="color: ${bMeta.color};">${m.branch.zh}</span>
              </div>
              <div class="month-cell-god">${m.stemGod.zh}</div>
            </div>
          `;
        }).join('');
      }

      this.renderAdvanceMonthlyMasterTable(this.currentChart, y);
      this.renderSelectedMonthDetail();
    },
    renderSelectedMonthDetail: function () {
      if (!this.currentChart) return;
      const y = this.selectedYear || new Date().getFullYear();
      const months = BaziEngine.calculateMonthlyFortune(this.currentChart, y);
      const m = months[this.selectedMonthIndex || 0];
      const cardEl = document.getElementById('baziSelectedMonthCard');
      if (!m || !cardEl) return;

      const sMeta = ELEMENTS_META[m.stem.element];
      const bMeta = ELEMENTS_META[m.branch.element];

      // Compute monthly interactions with Natal + Annual + Da Yun
      const mCol = {
        stem: m.stem,
        branch: m.branch,
        label: `เดือนที่ ${m.monthNum} (${m.branch.zh})`
      };
      const natalCols = [
        { ...this.currentChart.pillars.hour, pillarKey: 'hour', label: 'เสายาม', palace: 'เสายาม: วังบริวาร/ลูกหลาน' },
        { ...this.currentChart.pillars.day, pillarKey: 'day', label: 'เสาวัน', palace: 'เสาวัน: วังตัวตน/คู่ครอง' },
        { ...this.currentChart.pillars.month, pillarKey: 'month', label: 'เสาเดือน', palace: 'เสาเดือน: วังการงาน/พ่อแม่' },
        { ...this.currentChart.pillars.year, pillarKey: 'year', label: 'เสาปี', palace: 'เสาปี: วังบรรพบุรุษ/สิ่งแวดล้อม' }
      ];

      // Annual Col
      const yrSIdx = ((y - 4) % 10 + 10) % 10;
      const yrBIdx = ((y - 4) % 12 + 12) % 12;
      const annualCol = { stem: STEMS[yrSIdx], branch: BRANCHES[yrBIdx], label: `ปีจร ${y}` };

      // Da Yun Col
      const birthYear = this.currentChart.birthDateString ? parseInt(this.currentChart.birthDateString.split('-')[0], 10) : new Date().getFullYear();
      const ageInYear = y - birthYear;
      const curDaYun = (this.currentChart.daYunPillars || []).find(d => ageInYear >= d.ageFrom && ageInYear <= d.ageTo);
      const luckCol = curDaYun ? { stem: curDaYun.stem, branch: curDaYun.branch, label: `วัยจร ${curDaYun.ageRange}` } : null;

      const inter = this.computeDetailedInteractions(mCol, natalCols, annualCol, luckCol, 'monthly');
      const allInteractions = [...inter.primary, ...inter.secondary];

      let interactionsHtml = '';
      if (allInteractions.length > 0) {
        const renderBadge = (it) => {
          const cls = this.getInteractionClass(it);
          const st = this.getInteractionStyle(it);
          const info = this.getInteractionTooltipData(it);
          const titleAttr = info ? `${info.title} - ${info.meaning}`.replace(/"/g, '&quot;') : '';
          const cleanIt = it.replace(/"/g, '&quot;');
          return `<div class="interaction-item ${cls}" style="${st}" data-interaction-text="${cleanIt}" title="${titleAttr}">${it}</div>`;
        };

        const primaryBadges = inter.primary.map(renderBadge).join('');
        const secondaryBadges = inter.secondary.map(renderBadge).join('');

        interactionsHtml = `
          ${inter.primary.length > 0 ? `
            <div style="margin-bottom: 8px;">
              <div style="font-size: 11.5px; font-weight: 700; color: #475569; margin-bottom: 4px;">• ปฏิสัมพันธ์กับพื้นดวง 4 เสา (Natal Chart):</div>
              <div class="bazi-interactions-flow">${primaryBadges}</div>
            </div>
          ` : ''}
          ${inter.secondary.length > 0 ? `
            <div style="${inter.primary.length > 0 ? 'margin-top: 10px; padding-top: 8px; border-top: 1px dashed #e2e8f0;' : ''}">
              <div style="font-size: 11.5px; font-weight: 700; color: #6d28d9; margin-bottom: 4px;">• ปฏิสัมพันธ์กับปีจร & วัยจร 10 ปี (Annual Tai Sui & Luck Pillars):</div>
              <div class="bazi-interactions-flow">${secondaryBadges}</div>
            </div>
          ` : ''}
        `;
      } else {
        interactionsHtml = '<div style="color: #10b981; font-size: 12.5px; font-weight: 600;"><i class="fa-solid fa-circle-check"></i> พลังงานประจำเดือนราบรื่น ไม่มีจุดปะทะรุนแรงกับพื้นดวง ปีจร หรือวัยจร</div>';
      }

      // 4 Palaces Impact Breakdown for this Month
      const palaceDefs = [
        {
          key: 'day',
          name: 'เสาวัน: วังตัวตน & คู่ครอง',
          pillar: this.currentChart.pillars.day,
          tag: 'เสาวัน',
          icon: 'fa-heart',
          color: '#ec4899',
          defaultDesc: 'พลังงานเสาวันสงบราบรื่น ไม่มีดาวปะทะหรือขัดแย้งในเดือนนี้ ความสัมพันธ์และสุขภาพกายใจดำเนินไปด้วยดี',
          clashDesc: '⚡ มีการปะทะ (ชง) เข้าสู่วังตัวตนและคู่ครอง: อารมณ์อาจแปรปรวนง่าย ให้ใจเย็นในการสื่อสารกับคนรัก เลี่ยงการมีปากเสียง ดูแลสุขภาพและพักผ่อนให้เพียงพอ',
          combineDesc: '💖 มีพลังสมพงษ์ (ฮะ) เข้าสู่วังคู่ครอง: ความรักราบรื่น มีเสน่ห์ เมตตามหานิยม เหมาะแก่การปรับความเข้าใจหรือเสริมสร้างความสัมพันธ์',
          harmDesc: '⚠️ มีพลังกระทบ (ไห่/เฮ้ง/ผัวะ): ระวังความเข้าใจผิดจากคำพูดไม่ระวัง หรือความกดดันทางอารมณ์ ให้ใช้สติและความประนีประนอม'
        },
        {
          key: 'month',
          name: 'เสาเดือน: วังการงาน & พ่อแม่',
          pillar: this.currentChart.pillars.month,
          tag: 'เสาเดือน',
          icon: 'fa-briefcase',
          color: '#0284c7',
          defaultDesc: 'พลังงานการงานและธุรกิจมั่นคง ดำเนินไปอย่างราบรื่นตามปกติ เหมาะแก่การทำงานตามแผนเดิม',
          clashDesc: '💼 มีการปะทะ (ชง) เข้าสู่วังการงาน: มีเกณฑ์การเปลี่ยนแปลง โยกย้าย การเดินทางเรื่องงาน หรือมีภาระงานด่วนเข้ามาท้าทาย ควรตรวจตราเอกสารสัญญาอย่างรอบคอบ',
          combineDesc: '🌟 มีพลังสมพงษ์ (ฮะ) เกื้อหนุนวังการงาน: ผู้ใหญ่และหัวหน้าให้การสนับสนุน เจรจาธุรกิจราบรื่น ได้รับความร่วมมือจากเพื่อนร่วมงาน มีโอกาสก้าวหน้า',
          harmDesc: '⚠️ มีพลังกระทบ (ไห่/เฮ้ง/ผัวะ): ระวังเรื่องการสื่อสารในที่ทำงาน หรือความเห็นต่างกับผู้ใหญ่ ให้เน้นความรอบคอบและเอกสารที่ชัดเจน'
        },
        {
          key: 'year',
          name: 'เสาปี: วังบรรพบุรุษ & สังคม',
          pillar: this.currentChart.pillars.year,
          tag: 'เสาปี',
          icon: 'fa-users',
          color: '#10b981',
          defaultDesc: 'สังคมภายนอกและสภาพแวดล้อมราบรื่น ปลอดโปร่ง ไม่มีเรื่องขัดแย้งในวงกว้าง',
          clashDesc: '🌐 มีการปะทะ (ชง) เข้าสู่วังบรรพบุรุษ/สังคม: ระวังการเดินทางไกล การเปลี่ยนแปลงในวงสังคม หรือการตัดสินใจเรื่องใหญ่ในครอบครัว',
          combineDesc: '🤝 มีพลังสมพงษ์ (ฮะ) กับสังคมภายนอก: การเข้าสังคมราบรื่น สร้างเครือข่ายคอนเนกชันใหม่ๆ ได้ดี ได้รับความนิยมชมชอบในวงกว้าง',
          harmDesc: '⚠️ มีพลังกระทบ (ไห่/เฮ้ง/ผัวะ): ระวังความเข้าใจผิดกับคนในสังคมภายนอก หรือเรื่องจุกจิกจากคนรอบข้าง'
        },
        {
          key: 'hour',
          name: 'เสายาม: วังบริวาร & โปรเจกต์',
          pillar: this.currentChart.pillars.hour,
          tag: 'เสายาม',
          icon: 'fa-seedling',
          color: '#8b5cf6',
          defaultDesc: 'บริวาร ลูกน้อง ลูกหลาน และงานโปรเจกต์ที่ดูแลดำเนินไปอย่างราบรื่น ไร้อุปสรรค',
          clashDesc: '🌱 มีการปะทะ (ชง) เข้าสู่วังบริวาร/โปรเจกต์: ระวังความขัดแย้งกับผู้ใต้บังคับบัญชา หรือโปรเจกต์งานที่กำลังทำอาจต้องแก้ไขปรับแผนกะทันหัน',
          combineDesc: '✨ มีพลังสมพงษ์ (ฮะ) สู่บริวารและโปรเจกต์: ลูกน้องบริวารให้ความร่วมมือดี งานโปรเจกต์ใหม่ๆ เริ่มเห็นผลเป็นรูปธรรมและเติบโต',
          harmDesc: '⚠️ มีพลังกระทบ (ไห่/เฮ้ง/ผัวะ): ระวังลูกน้องบริวารทำงานผิดพลาด หรือมีความเห็นไม่ตรงกันในทีมงาน ให้ดูแลอย่างใกล้ชิด'
        }
      ];

      const palaceCardsHtml = palaceDefs.map(pDef => {
        const matchingInteractions = inter.primary.filter(it => it.includes(`[${pDef.tag}`));
        const hasClash = matchingInteractions.some(it => it.includes('冲') || it.includes('Liu Chong') || it.includes('反吟') || it.includes('Fan Yin') || it.includes('Xiang Ke') || it.includes('天克'));
        const hasCombine = matchingInteractions.some(it => it.includes('合') || it.includes('He'));
        const hasHarm = matchingInteractions.some(it => it.includes('害') || it.includes('Hai') || it.includes('刑') || it.includes('Xing') || it.includes('破') || it.includes('Po'));

        let cardClass = 'is-peaceful';
        let pillClass = 'pill-peaceful';
        let pillText = 'สงบ ราบรื่น';
        let desc = pDef.defaultDesc;

        if (hasClash) {
          cardClass = 'has-clash';
          pillClass = 'pill-clash';
          pillText = '⚠️ ปะทะ (ชง)';
          desc = pDef.clashDesc;
        } else if (hasCombine) {
          cardClass = 'has-combine';
          pillClass = 'pill-combine';
          pillText = '✨ สมพงษ์ (ฮะ)';
          desc = pDef.combineDesc;
        } else if (hasHarm) {
          cardClass = 'has-harm';
          pillClass = 'pill-harm';
          pillText = '⚡ ระวังกระทบ';
          desc = pDef.harmDesc;
        }

        const pillarStr = pDef.pillar ? `${pDef.pillar.stem.zh}${pDef.pillar.branch.zh}` : '-';

        return `
          <div class="palace-impact-card ${cardClass}">
            <div class="palace-card-header">
              <div class="palace-card-title">
                <i class="fa-solid ${pDef.icon}" style="color: ${pDef.color};"></i>
                <span>${pDef.name}</span>
                <span class="palace-pillar-badge">${pillarStr}</span>
              </div>
              <span class="palace-status-pill ${pillClass}">${pillText}</span>
            </div>
            <div class="palace-card-desc">${desc}</div>
            ${matchingInteractions.length > 0 ? `
              <div class="palace-card-interactions">
                ${matchingInteractions.map(it => {
                  const cls = this.getInteractionClass(it);
                  const st = this.getInteractionStyle(it);
                  const cleanIt = it.replace(/"/g, '&quot;');
                  return `<div class="interaction-item ${cls}" style="${st}; font-size: 10px; padding: 2px 6px;" data-interaction-text="${cleanIt}">${it}</div>`;
                }).join('')}
              </div>
            ` : ''}
          </div>
        `;
      }).join('');

      cardEl.innerHTML = `
        <div class="month-detail-header" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 14px;">
          <div class="month-detail-title">
            <i class="fa-solid fa-calendar-day" style="color: #0284c7; font-size: 18px;"></i>
            <strong style="font-size: 16px; color: #0f172a;">คำทำนายเดือนที่ ${m.monthNum}: ${m.title}</strong>
            <span style="font-size: 13px; color: #64748b; margin-left: 6px;">(${m.dates})</span>
          </div>
          <span class="month-cell-rating rating-${m.ratingType}" style="font-size: 13px; padding: 4px 12px; border-radius: 20px;">${m.ratingBadge}</span>
        </div>

        <!-- Pillar Chars & Meta Bar -->
        <div style="display: flex; align-items: center; gap: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 18px; margin-bottom: 16px; flex-wrap: wrap;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="color: ${sMeta.color}; font-size: 28px; font-weight: 800; font-family: 'Cinzel', serif;">${m.stem.zh}</span>
            <span style="color: ${bMeta.color}; font-size: 28px; font-weight: 800; font-family: 'Cinzel', serif;">${m.branch.zh}</span>
          </div>
          <div style="font-size: 13px; color: #475569; line-height: 1.4;">
            <strong>${m.stem.py} ${m.branch.py}</strong> (${m.branch.zodiac})
            <div style="font-size: 12px; color: #7c3aed; font-weight: 600;">ก้านฟ้า: ${m.stemGod.zh} (${m.stemGod.th}) • กิ่งดิน: ${m.branchGod.zh}</div>
            <div style="font-size: 11.5px; color: #94a3b8;">${m.naYin}</div>
          </div>
        </div>

        <!-- Interactions ในดวงประจำเดือน -->
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 18px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
            <div style="font-weight: 700; color: #1e293b; font-size: 13.5px; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-bolt" style="color: #0284c7;"></i> ปฏิสัมพันธ์ฟ้าดินประจำเดือนในดวง (Monthly Interactions 刑沖合害)
            </div>
            <span style="font-size: 11px; color: #64748b;">(ชี้เมาส์ที่ป้ายเพื่อดูคำอธิบายขยายความ)</span>
          </div>
          <div class="bazi-interactions-flow">
            ${interactionsHtml}
          </div>

          <!-- 4 Palaces Impacts Breakdown -->
          <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #f1f5f9;">
            <div style="font-weight: 700; color: #334155; font-size: 13px; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-chess-rook" style="color: #7c3aed;"></i> ปฏิกิริยาธาตุกับ 4 วังชะตาในเดือนนี้ (Palace Impacts Breakdown):
            </div>
            <div class="palace-impact-grid">
              ${palaceCardsHtml}
            </div>
          </div>
        </div>

        <!-- 5 Dimensions of the Month -->
        <div class="bazi-fortune-grid">
          <div class="fortune-grid-item">
            <div class="fortune-item-header">
              <i class="fa-solid fa-compass" style="color: #0284c7;"></i> 1. ภาพรวมเดือนนี้ &amp; จังหวะชีวิต
            </div>
            <p class="fortune-item-text">${m.overview}</p>
          </div>
          <div class="fortune-grid-item">
            <div class="fortune-item-header">
              <i class="fa-solid fa-briefcase" style="color: #7c3aed;"></i> 2. การงาน &amp; ธุรกิจในเดือนนี้
            </div>
            <p class="fortune-item-text">${m.career}</p>
          </div>
          <div class="fortune-grid-item">
            <div class="fortune-item-header">
              <i class="fa-solid fa-coins" style="color: #10b981;"></i> 3. การเงิน &amp; สภาพคล่อง
            </div>
            <p class="fortune-item-text">${m.wealth}</p>
          </div>
          <div class="fortune-grid-item">
            <div class="fortune-item-header">
              <i class="fa-solid fa-heart" style="color: #ec4899;"></i> 4. ความรัก &amp; ความสัมพันธ์
            </div>
            <p class="fortune-item-text">${m.love}</p>
          </div>
        </div>

        <div class="fortune-warning-bar" style="margin-top: 14px;">
          <i class="fa-solid fa-shield-heart" style="color: #ef4444;"></i> <strong>สุขภาพ &amp; ข้อควรระวังในเดือนนี้:</strong> ${m.health}
        </div>
      `;
    },

    copySummary: function () {
      if (!this.currentChart) return;
      const c = this.currentChart;
      const p = c.pillars;
      const prof = c.dayMasterProfile;
      const favNames = c.favorableElements.map(k => ELEMENTS_META[k].th).join(', ');
      const curDaYun = c.daYunPillars.find(d => d.isCurrent) || c.daYunPillars[0];

      const text = `🔮 ผลการวิเคราะห์ดวงชะตา ปาจื่อ (BaZi Four Pillars of Destiny)
👤 เจ้าชะตา: ${c.name} (${c.gender === 'male' ? 'ชาย' : 'หญิง'})
📅 วันเกิด: ${c.birthDateString} เวลา ${c.birthTimeString}

🏛️ ผัง 4 เสาชะตา (Four Pillars):
- เสาปี (Year): ${p.year.stem.zh}${p.year.branch.zh} (${p.year.stem.py} ${p.year.branch.py}) • สิบลักษณ์: ${p.year.tenGod.zh} • ${p.year.naYin}
- เสาเดือน (Month): ${p.month.stem.zh}${p.month.branch.zh} (${p.month.stem.py} ${p.month.branch.py}) • สิบลักษณ์: ${p.month.tenGod.zh} • ${p.month.naYin}
- เสาวัน (Day/Self): ${p.day.stem.zh}${p.day.branch.zh} (${p.day.stem.py} ${p.day.branch.py}) • ดิถีธาตุ: ${c.dayMaster.zh} (${c.dayMaster.th}) • ${p.day.naYin}
- เสายาม (Hour): ${p.hour.stem.zh}${p.hour.branch.zh} (${p.hour.stem.py} ${p.hour.branch.py}) • สิบลักษณ์: ${p.hour.tenGod.zh} • ${p.hour.naYin}

✨ สถานะดิถี: ${c.strengthText}
🌿 ธาตุให้คุณ (喜用神): ${favNames}
⚖️ ธาตุปรับดวง (調候用神): ${ELEMENTS_META[c.tiaoHou.element].th} (${c.tiaoHou.role})
⏳ วัยจรปัจจุบัน: ช่วงอายุ ${curDaYun.ageRange} (${curDaYun.stem.zh}${curDaYun.branch.zh} - ${curDaYun.tenGod.zh})

🌟 อุปนิสัยแก่นแท้: ${prof.traits}
💼 การงาน & ธุรกิจ: ${prof.career}
💰 โชคลาภ & การเงิน: ${prof.wealth}
❤️ ความรัก & คู่ครอง: ${prof.love}
🌿 สุขภาพ: ${prof.health}

✨ ตรวจดวงชะตาด้วยระบบ DESTINY ARCANA (Standalone Edition)`;

      navigator.clipboard.writeText(text).then(() => {
        alert('คัดลอกสรุปคำทำนาย BaZi เรียบร้อยแล้วค่ะ!');
      }).catch(err => {
        console.error('Copy failed:', err);
      });
    },

    forceHardReload: function () {
      const url = new URL(window.location.href);
      url.searchParams.set('_t', Date.now());
      window.location.href = url.toString();
    },

    currentExpertSubView: 'chart',

    openDeskFromToolbar: function () {
      if (!this.isLoggedIn()) {
        if (window.AuthManager && typeof window.AuthManager.openModal === 'function') {
          window.AuthManager.openModal('login', 'bazi_expert');
        }
        return;
      }
      if (this.currentMode !== 'expert') {
        this.switchMode('expert', false);
      }
      this.setExpertSubView('desk');
    },

    setExpertSubView: function (subView = 'chart') {
      this.currentExpertSubView = subView;
      const chartSec = document.getElementById('baziMainChartSections');
      const deskSec = document.getElementById('baziDeskPageView');
      const btnChart = document.getElementById('baziSubViewChartBtn');
      const btnDesk = document.getElementById('baziSubViewDeskBtn');
      const subSubtitle = document.getElementById('baziDeskCurrentChartSubtitle');

      if (btnChart) btnChart.classList.toggle('active', subView === 'chart');
      if (btnDesk) btnDesk.classList.toggle('active', subView === 'desk');

      if (subView === 'chart') {
        if (chartSec) chartSec.style.display = 'block';
        if (deskSec) {
          deskSec.style.display = 'none';
          deskSec.classList.add('hidden');
        }
      } else {
        if (chartSec) chartSec.style.display = 'none';
        if (deskSec) {
          deskSec.style.display = 'block';
          deskSec.classList.remove('hidden');
        }
        if (subSubtitle && this.currentChart) {
          const c = this.currentChart;
          subSubtitle.innerHTML = `วิเคราะห์ดวง: <strong>${c.name || 'ลูกดวง'}</strong> • ดิถี <strong>${c.dayMaster.zh} (${c.dayMaster.py})</strong> • เสาปี <strong>${c.pillars.year.stem.zh}${c.pillars.year.branch.zh}</strong> (พร้อม 4 หัวข้อวิชาการโหราศาสตร์จีนเจาะลึก)`;
        }
        this.renderExpertSuite();
        if (deskSec) {
          deskSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      const triSection = document.getElementById('baziTriSection');
      const fourPillarsSec = document.getElementById('baziFourPillarsSection');
      const isExp = this.currentMode === 'expert';
      if (triSection) {
        if (isExp) {
          triSection.style.setProperty('display', 'none', 'important');
          triSection.classList.add('hidden-in-expert');
          triSection.setAttribute('hidden', '');
        } else {
          triSection.style.removeProperty('display');
          triSection.classList.remove('hidden-in-expert');
          triSection.removeAttribute('hidden');
        }
      }
      if (fourPillarsSec) {
        if (!isExp) {
          fourPillarsSec.style.setProperty('display', 'none', 'important');
          fourPillarsSec.classList.add('hidden-in-basic');
          fourPillarsSec.setAttribute('hidden', '');
        } else {
          fourPillarsSec.style.removeProperty('display');
          fourPillarsSec.classList.remove('hidden-in-basic');
          fourPillarsSec.removeAttribute('hidden');
        }
      }
    },

    switchMode: function (mode, shouldRender = true) {
      if (mode === 'expert' && !this.isLoggedIn()) {
        if (window.AuthManager && typeof window.AuthManager.openModal === 'function') {
          window.AuthManager.openModal('login', 'bazi_expert');
        }
        mode = 'basic';
      }
      this.currentMode = mode;
      try {
        localStorage.setItem('bazi_display_mode_v2', mode);
      } catch (e) { }

      const isExpert = mode === 'expert';
      const isAuth = this.isLoggedIn();
      const toolbarCard = document.getElementById('baziToolbarCard');
      if (toolbarCard) {
        toolbarCard.style.display = isAuth ? 'block' : 'none';
      }
      const expertLockBadge = document.getElementById('baziExpertLockBadge');
      if (expertLockBadge) {
        expertLockBadge.style.display = isAuth ? 'none' : 'inline-flex';
      }

      document.body.classList.toggle('expert-mode', isExpert);
      const appView = document.getElementById('baziAppView');
      if (appView) appView.classList.toggle('is-expert', isExpert);
      const appContainer = document.querySelector('.bazi-app-container');
      if (appContainer) {
        appContainer.classList.toggle('is-expert', isExpert);
        appContainer.setAttribute('data-mode', mode);
      }

      // 1. TriSection: Show in Basic, Hide in Expert
      const triSection = document.getElementById('baziTriSection');
      if (triSection) {
        if (isExpert) {
          triSection.style.setProperty('display', 'none', 'important');
          triSection.classList.add('hidden-in-expert');
          triSection.setAttribute('hidden', '');
        } else {
          triSection.style.removeProperty('display');
          triSection.classList.remove('hidden-in-expert');
          triSection.removeAttribute('hidden');
        }
      }

      // 2. FourPillarsSection: Hide in Basic, Show in Expert
      const fourPillarsSec = document.getElementById('baziFourPillarsSection');
      if (fourPillarsSec) {
        if (!isExpert) {
          fourPillarsSec.style.setProperty('display', 'none', 'important');
          fourPillarsSec.classList.add('hidden-in-basic');
          fourPillarsSec.setAttribute('hidden', '');
        } else {
          fourPillarsSec.style.removeProperty('display');
          fourPillarsSec.classList.remove('hidden-in-basic');
          fourPillarsSec.removeAttribute('hidden');
        }
      }

      const basicBtn = document.getElementById('baziModeBasicBtn');
      const expertBtn = document.getElementById('baziModeExpertBtn');
      const basicInfo = document.getElementById('baziModeBasicInfo');
      const expertInfo = document.getElementById('baziModeExpertInfo');
      const expertSubBar = document.getElementById('baziExpertSubBar');
      const chartSec = document.getElementById('baziMainChartSections');
      const deskSec = document.getElementById('baziDeskPageView');
      const oracleSection = document.getElementById('baziOracleAiSection');

      if (basicBtn) basicBtn.classList.toggle('active', !isExpert);
      if (expertBtn) expertBtn.classList.toggle('active', isExpert);
      if (basicInfo) basicInfo.classList.toggle('hidden', isExpert);
      if (expertInfo) expertInfo.classList.toggle('hidden', !isExpert);
      if (oracleSection) oracleSection.classList.toggle('hidden', !isExpert);

      if (isExpert) {
        if (expertSubBar) expertSubBar.classList.remove('hidden');
        this.setExpertSubView(this.currentExpertSubView || 'chart');
        this.setMatrixView(this.currentMatrixView || 'matrix');
      } else {
        if (expertSubBar) expertSubBar.classList.add('hidden');
        if (deskSec) {
          deskSec.style.display = 'none';
          deskSec.classList.add('hidden');
        }
        if (chartSec) chartSec.style.display = 'block';
        this.setMatrixView(this.currentMatrixView || 'cards');
      }

      if (isExpert && shouldRender && this.currentChart) {
        this.renderExpertSuite();
      }
    },

    setMatrixView: function (view = 'matrix') {
      this.currentMatrixView = view;
      const tableWrap = document.getElementById('baziExpertMasterTableWrap');
      const cardsGrid = document.getElementById('baziFourPillarsGrid');
      const btnMatrix = document.getElementById('baziViewMatrixBtn');
      const btnCards = document.getElementById('baziViewCardsBtn');
      const btnBoth = document.getElementById('baziViewBothBtn');

      if (btnMatrix) btnMatrix.classList.toggle('active', view === 'matrix');
      if (btnCards) btnCards.classList.toggle('active', view === 'cards');
      if (btnBoth) btnBoth.classList.toggle('active', view === 'both');

      if (tableWrap) {
        tableWrap.style.display = (view === 'cards') ? 'none' : 'block';
      }
      if (cardsGrid) {
        cardsGrid.style.display = (view === 'matrix') ? 'none' : 'grid';
      }
    },

    getPatternStructure: function (chart) {
      if (!chart) return null;
      const mPillar = chart.pillars.month;
      const mBranch = mPillar.branch;
      const hidden = mPillar.hiddenStems || [];
      const mainHidden = hidden.reduce((max, h) => (h.weight > max.weight ? h : max), hidden[0] || {});

      // Check if any hidden stem penetrates into other stems
      const stems = [chart.pillars.year.stem.zh, chart.pillars.month.stem.zh, chart.pillars.hour.stem.zh];
      const penetrated = hidden.find(h => stems.includes(h.stem));
      const targetGod = penetrated ? penetrated.tenGod : (mainHidden.tenGod || { zh: '正財', th: 'ทรัพย์แท้' });

      const patternNames = {
        '正官': { name: '正官格 (เจิ้งกวานเก๋อ - ขุนนางแท้ / Direct Officer)', desc: 'โครงสร้างผู้นำ ข้าราชการ หรือผู้บริหาร ซื่อสัตย์ มีวินัย รักเกียรติยศชื่อเสียงสูง มุ่งมั่นสร้างความมั่นคงตามกฎระเบียบ' },
        '七殺': { name: '七殺格 / 偏官格 (ชีสัวะเก๋อ - ขุนพลปราบปราม / Seven Killings)', desc: 'โครงสร้างนักรบ ผู้บุกเบิก เด็ดขาด กล้าได้กล้าเสีย ชอบความท้าทาย มักสร้างชื่อเสียงจากวิกฤตและอุปสรรคใหญ่' },
        '正財': { name: '正財格 (เจิ้งไฉเก๋อ - ทรัพย์แท้ / Direct Wealth)', desc: 'โครงสร้างนักบริหารความมั่งคั่ง มัธยัสถ์ รอบคอบ มีวินัยทางการเงินสูง สร้างฐานะจากงานสุจริตและความเชี่ยวชาญเฉพาะทาง' },
        '偏財': { name: '偏財格 (เพี่ยนไฉเก๋อ - ทรัพย์จร/โชคลาภ / Indirect Wealth)', desc: 'โครงสร้างนักลงทุน ผู้ประกอบการ วิสัยทัศน์กว้างไกล ใจกว้าง มักมีโชคลาภและโอกาสทางธุรกิจเข้ามาต่อเนื่อง' },
        '正印': { name: '正印格 (เจิ้งอิ้นเก๋อ - ตราประทับแท้/ปราชญ์ / Direct Resource)', desc: 'โครงสร้างนักวิชาการ ครูบาอาจารย์ คุณธรรมสูง มีเมตตา อุปถัมภ์ค้ำชูผู้อื่น และเรียนรู้สิ่งต่างๆ ได้รวดเร็ว' },
        '偏印': { name: '偏印格 / 梟神格 (เพี่ยนอิ้นเก๋อ - ญาณทัศนะ / Indirect Resource)', desc: 'โครงสร้างนักคิดค้น ศาสตร์ลี้ลับ เทคโนโลยี ปรัชญา มีเซนส์พิเศษ มีความลึกซึ้งและเอกลักษณ์เฉพาะตัว' },
        '食神': { name: '食神格 (สือเสินเก๋อ - เทพโอสถ/ความสุข / Eating God)', desc: 'โครงสร้างนักสร้างสรรค์ อาหาร ศิลปะ มีสุนทรียภาพ ชีวิตอุดมสมบูรณ์ มองโลกในแง่ดี มีโภคทรัพย์ไม่ขาดมือ' },
        '傷官': { name: '傷官格 (ชางกวานเก๋อ - ยอดอัจฉริยะปฏิรูป / Hurting Officer)', desc: 'โครงสร้างผู้มีพรสวรรค์สูง ปฏิภาณไหวพริบยอดเยี่ยม กล้าฉีกกฎเกณฑ์ นวัตกรรมใหม่ โดดเด่นทางวาทศิลป์และความคิดสร้างสรรค์' },
        '比肩': { name: '建祿格 (เจี้ยนลู่เก๋อ - บารมีพึ่งตนเอง / Companion Pattern)', desc: 'โครงสร้างสร้างตัวด้วยลำแข้งตนเอง หนักแน่น มั่นคง มิตรสหายมาก ไม่ยอมแพ้ต่ออุปสรรค' },
        '劫財': { name: '陽刃格 (หยางเหรินเก๋อ - กระบี่กล้า / Rob Wealth Pattern)', desc: 'โครงสร้างพลังจิตใจแกร่งกล้า เด็ดขาด ทะเยอทะยานสูง มักประสบความสำเร็จยิ่งใหญ่หากได้รับการควบคุมที่ดี' }
      };

      const matched = patternNames[targetGod.zh] || {
        name: `${targetGod.zh}格 (${targetGod.th}เก๋อ)`,
        desc: `โครงสร้างที่ขับเคลื่อนด้วยพลังของ ${targetGod.th} นำพาคุณสมบัติเฉพาะตัวมาเป็นแกนหลักของชีวิต`
      };

      return {
        god: targetGod,
        name: matched.name,
        desc: matched.desc,
        penetratedStem: penetrated ? penetrated.stem : null,
        monthBranch: mBranch.zh
      };
    },

    analyzeInteractions: function (chart) {
      if (!chart) return [];
      const interactions = [];
      const pList = [
        { key: 'year', label: 'เสาปี (บรรพบุรุษ/วัยเด็ก)', branch: chart.pillars.year.branch.zh },
        { key: 'month', label: 'เสาเดือน (การงาน/พ่อแม่)', branch: chart.pillars.month.branch.zh },
        { key: 'day', label: 'เสาวัน (ตัวตน/คู่ครอง)', branch: chart.pillars.day.branch.zh },
        { key: 'hour', label: 'เสายาม (บริวาร/ลูกหลาน)', branch: chart.pillars.hour.branch.zh }
      ];

      for (let i = 0; i < pList.length; i++) {
        for (let j = i + 1; j < pList.length; j++) {
          const clash = checkBranchClash(pList[i].branch, pList[j].branch);
          if (clash) {
            interactions.push({
              type: 'clash',
              icon: '⚔️',
              title: `${pList[i].label} ปะทะกับ ${pList[j].label} (${pList[i].branch} 沖 ${pList[j].branch})`,
              desc: clash.th,
              advice: 'การปะทะในดวงเดิมหมายถึงการเปลี่ยนแปลง ความกระตือรือร้น หรือการเดินทางโยกย้าย ระวังความใจร้อน'
            });
          }

          const harm = checkBranchHarmony(pList[i].branch, pList[j].branch);
          if (harm) {
            interactions.push({
              type: 'harmony',
              icon: '🤝',
              title: `${pList[i].label} ฮะสมพงศ์กับ ${pList[j].label} (${pList[i].branch} 合 ${pList[j].branch})`,
              desc: harm.name,
              advice: 'การฮะก่อให้เกิดความร่วมมือ ประสานงานราบรื่น และเสริมสร้างความผูกพันมั่นคง'
            });
          }
        }
      }

      // Check current Da Yun
      const curDaYun = chart.daYunPillars.find(d => d.isCurrent) || chart.daYunPillars[0];
      if (curDaYun) {
        pList.forEach(p => {
          const clash = checkBranchClash(curDaYun.branch.zh, p.branch);
          if (clash) {
            interactions.push({
              type: 'clash',
              icon: '🌊',
              title: `วัยจรปัจจุบัน (${curDaYun.branch.zh} ช่วงอายุ ${curDaYun.ageRange}) ปะทะกับ ${p.label} (${p.branch})`,
              desc: clash.th,
              advice: 'ช่วงวัยจรนี้มีการปรับเปลี่ยนสภาพแวดล้อมหรือเผชิญบททดสอบสำคัญ ควรมีสติรอบคอบและปรับตัวตามสถานการณ์'
            });
          }

          const harm = checkBranchHarmony(curDaYun.branch.zh, p.branch);
          if (harm) {
            interactions.push({
              type: 'harmony',
              icon: '✨',
              title: `วัยจรปัจจุบัน (${curDaYun.branch.zh} ช่วงอายุ ${curDaYun.ageRange}) ฮะสมพงศ์กับ ${p.label} (${p.branch})`,
              desc: harm.name,
              advice: 'ช่วงวัยจรนี้มีโอกาสร่วมทุน มีผู้สนับสนุน และความสัมพันธ์ดีขึ้นอย่างเด่นชัด'
            });
          }
        });
      }

      return interactions;
    },

    getNaYinDetail: function (stemIdx, branchIdx) {
      const NAYIN_INFO = [
        { zh: '海中金', en: 'Gold on Seafloor', th: 'ทองในมหาสมุทร', element: 'metal' },
        { zh: '爐中火', en: 'Furnace Fire', th: 'ไฟในเตาหลอม', element: 'fire' },
        { zh: '大林木', en: 'Wood of Forest', th: 'ไม้ในป่าใหญ่', element: 'wood' },
        { zh: '路旁土', en: 'Roadside Earth', th: 'ดินริมทาง', element: 'earth' },
        { zh: '劍鋒金', en: 'Sword Edge Gold', th: 'ทองปลายกระบี่', element: 'metal' },
        { zh: '山頭火', en: 'Mountaintop Fire', th: 'ไฟบนยอดเขา', element: 'fire' },
        { zh: '澗下水', en: 'Stream Water', th: 'น้ำในลำธาร', element: 'water' },
        { zh: '城頭土', en: 'City Wall Earth', th: 'ดินบนกำแพงเมือง', element: 'earth' },
        { zh: '白蠟金', en: 'White Wax Gold', th: 'ทองขาวบริสุทธิ์', element: 'metal' },
        { zh: '楊柳木', en: 'Wood of Willow', th: 'ไม้ต้นหลิว', element: 'wood' },
        { zh: '泉中水', en: 'Spring Water', th: 'น้ำพุใต้พิภพ', element: 'water' },
        { zh: '屋上土', en: 'Rooftop Earth', th: 'ดินบนหลังคา', element: 'earth' },
        { zh: '霹靂火', en: 'Thunderbolt Fire', th: 'ไฟสายฟ้าฟาด', element: 'fire' },
        { zh: '松柏木', en: 'Pine Wood', th: 'ไม้สนยืนต้น', element: 'wood' },
        { zh: '長流水', en: 'Long River Water', th: 'น้ำไหลไม่สิ้นสุด', element: 'water' },
        { zh: '砂中金', en: 'Sand Gold', th: 'ทองในหาดทราย', element: 'metal' },
        { zh: '山下火', en: 'Foothill Fire', th: 'ไฟเชิงเขา', element: 'fire' },
        { zh: '平地木', en: 'Bushes on Plain', th: 'ไม้บนที่ราบ', element: 'wood' },
        { zh: '壁上土', en: 'Wall Earth', th: 'ดินฉาบฝาผนัง', element: 'earth' },
        { zh: '金箔金', en: 'Gold Foil', th: 'ทองคำเปลว', element: 'metal' },
        { zh: '覆燈火', en: 'Lamp Fire', th: 'ไฟดวงประทีป', element: 'fire' },
        { zh: '天河水', en: 'Celestial River', th: 'น้ำแม่น้ำสวรรค์', element: 'water' },
        { zh: '大驛土', en: 'Post Station Earth', th: 'ดินสถานีใหญ่', element: 'earth' },
        { zh: '釵釧金', en: 'Hairpin Gold', th: 'ทองปิ่นปักผม', element: 'metal' },
        { zh: '桑柘木', en: 'Mulberry Wood', th: 'ไม้หม่อนมงคล', element: 'wood' },
        { zh: '大溪水', en: 'Great Creek Water', th: 'น้ำในห้วยใหญ่', element: 'water' },
        { zh: '沙中土', en: 'Sand Earth', th: 'ดินทรายปนหิน', element: 'earth' },
        { zh: '天上火', en: 'Celestial Sun Fire', th: 'ไฟบนท้องนภา', element: 'fire' },
        { zh: '石榴木', en: 'Pomegranate Wood', th: 'ไม้ทับทิมมงคล', element: 'wood' },
        { zh: '大海水', en: 'Ocean Water', th: 'น้ำในทะเลหลวง', element: 'water' }
      ];
      for (let i = 0; i < 60; i++) {
        if (i % 10 === stemIdx && i % 12 === branchIdx) {
          return NAYIN_INFO[Math.floor(i / 2)] || { zh: '五行', en: 'Five Elements', th: 'เบญจธาตุ', element: 'earth' };
        }
      }
      return { zh: '五行', en: 'Five Elements', th: 'เบญจธาตุ', element: 'earth' };
    },

    get12LifeStage: function (stemChar, branchChar) {
      const CHANG_SHENG_NAMES = [
        { order: 1, zh: '長生', py: 'Chang Sheng', en: 'Birth', symbol: '++' },
        { order: 2, zh: '沐浴', py: 'Mu Yu', en: 'Bath', symbol: '-' },
        { order: 3, zh: '冠帶', py: 'Guan Dai', en: 'Attire', symbol: '+' },
        { order: 4, zh: '臨官', py: 'Lin Guan', en: 'Coming of Age', symbol: '+' },
        { order: 5, zh: '帝旺', py: 'Di Wang', en: 'Prosp. Peak', symbol: '++' },
        { order: 6, zh: '衰', py: 'Shuai', en: 'Aging', symbol: '·' },
        { order: 7, zh: '病', py: 'Bing', en: 'Sickness', symbol: '-' },
        { order: 8, zh: '死', py: 'Si', en: 'Death', symbol: '--' },
        { order: 9, zh: '墓', py: 'Mu', en: 'Tomb', symbol: '--' },
        { order: 10, zh: '絕', py: 'Jue', en: 'Extinction', symbol: '---' },
        { order: 11, zh: '胎', py: 'Tai', en: 'Womb', symbol: '·' },
        { order: 12, zh: '養', py: 'Yang', en: 'Gestation', symbol: '·' }
      ];
      const CHANG_SHENG_STARTS = {
        '甲': { start: 11, dir: 1 },
        '乙': { start: 6, dir: -1 },
        '丙': { start: 2, dir: 1 },
        '丁': { start: 9, dir: -1 },
        '戊': { start: 2, dir: 1 },
        '己': { start: 9, dir: -1 },
        '庚': { start: 5, dir: 1 },
        '辛': { start: 0, dir: -1 },
        '壬': { start: 8, dir: 1 },
        '癸': { start: 3, dir: -1 }
      };
      const cfg = CHANG_SHENG_STARTS[stemChar];
      if (!cfg) return { order: '-', zh: '-', py: '-', en: '-', symbol: '' };
      const bIdx = BRANCHES.findIndex(b => b.zh === branchChar);
      if (bIdx === -1) return { order: '-', zh: '-', py: '-', en: '-', symbol: '' };
      const offset = ((bIdx - cfg.start) * cfg.dir % 12 + 12) % 12;
      return CHANG_SHENG_NAMES[offset];
    },

    getKongWang: function (stemIdx, branchIdx) {
      const xun = ((stemIdx - branchIdx + 12) % 12);
      const voidMap = {
        0: ['Xu, Hai', '戌, 亥'],
        10: ['Shen, You', '申, 酉'],
        8: ['Wu, Wei', '午, 未'],
        6: ['Chen, Si', '辰, 巳'],
        4: ['Yin, Mao', '寅, 卯'],
        2: ['Zi, Chou', '子, 丑']
      };
      return voidMap[xun] || ['-', '-'];
    },

    getDominantHiddenStem: function (branchChar) {
      const DHHS_MAP = {
        '子': '癸', '丑': '己', '寅': '甲', '卯': '乙',
        '辰': '戊', '巳': '丙', '午': '丁', '未': '己',
        '申': '庚', '酉': '辛', '戌': '戊', '亥': '壬'
      };
      const stemChar = DHHS_MAP[branchChar] || '戊';
      const sObj = STEMS.find(s => s.zh === stemChar) || STEMS[4];
      return sObj;
    },

    computeDetailedStars: function (targetBranch, targetStem, dayStem, dayBranch, yearBranch, monthBranch) {
      const dmStars = [];
      const otherStars = [];
      const tb = (typeof targetBranch === 'object' && targetBranch) ? targetBranch.zh : (targetBranch || '');
      const ts = (typeof targetStem === 'object' && targetStem) ? targetStem.zh : (targetStem || '');
      const ds = (typeof dayStem === 'object' && dayStem) ? dayStem.zh : (dayStem || '');
      const db = (typeof dayBranch === 'object' && dayBranch) ? dayBranch.zh : (dayBranch || '');
      const yb = (typeof yearBranch === 'object' && yearBranch) ? yearBranch.zh : (yearBranch || '');
      const mb = (typeof monthBranch === 'object' && monthBranch) ? monthBranch.zh : (monthBranch || '');

      // 1. Day Master Derived Stars (DM:)
      const wenChangMap = { '甲': '巳', '乙': '午', '丙': '申', '丁': '酉', '戊': '申', '己': '酉', '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯' };
      if (wenChangMap[ds] === tb) dmStars.push('academic star / WenChang / 文昌');

      const xueTangMap = { '甲': '亥', '乙': '午', '丙': '寅', '丁': '酉', '戊': '寅', '己': '酉', '庚': '巳', '辛': '子', '壬': '申', '癸': '卯' };
      if (xueTangMap[ds] === tb) dmStars.push('literacy star / XueTang / 学堂');

      // Hong Yan Sha: 丙戊见寅, 丁己见未
      const hongYanMap = { '甲': '午', '乙': '午', '丙': '寅', '丁': '未', '戊': '寅', '己': '未', '庚': '戌', '辛': '酉', '壬': '子', '癸': '申' };
      if (hongYanMap[ds] === tb) dmStars.push('red peach blossom / HongYanSha / 红艳桃花');

      const tianGanTaoMap = { '甲': { s: '己', b: '酉' }, '乙': { s: '庚', b: '巳' }, '丙': { s: '辛', b: '卯' }, '丁': { s: '壬', b: '亥' }, '戊': { s: '癸', b: '卯' }, '己': { s: '甲', b: '子' }, '庚': { s: '乙', b: '午' }, '辛': { s: '丙', b: '寅' }, '壬': { s: '丁', b: '酉' }, '癸': { s: '戊', b: '午' } };
      if (tianGanTaoMap[ds] && tianGanTaoMap[ds].s === ts && tianGanTaoMap[ds].b === tb) {
        dmStars.push('flower of romance / TianGanTaoHua / 天干桃花*');
      }

      const tianChuMap = { '甲': '巳', '乙': '午', '丙': '子', '丁': '巳', '戊': '巳', '己': '申', '庚': '寅', '辛': '午', '壬': '酉', '癸': '亥' };
      if (tianChuMap[ds] === tb) dmStars.push('culinary / TianChuGuiRen / 天厨*');

      if (ds === '戊' && tb === '巳') {
        dmStars.push('career / TianFuGuiRen / 天赋*');
        dmStars.push('right measure / JieDuGuiRen / 节度*');
      }

      // Heavenly Noble (TianYi)
      const tianYiMap = {
        '甲': ['丑', '未'], '戊': ['丑', '亥'], '庚': ['丑', '未'],
        '乙': ['子', '申'], '己': ['子', '申'],
        '丙': ['亥', '酉'], '丁': ['亥', '酉'],
        '壬': ['卯', '巳'], '癸': ['卯', '巳'],
        '辛': ['午', '寅']
      };
      if (tianYiMap[ds] && tianYiMap[ds].includes(tb)) {
        dmStars.push('heavenly noble / TianYiGuiRen / 天乙贵人');
      }

      const fuXingMap = {
        '甲': ['寅', '子'], '乙': ['卯', '丑'], '丙': ['寅', '子'], '丁': ['亥', '酉'],
        '戊': ['申', '戌', '子'], '己': ['未', '酉'], '庚': ['午', '申'], '辛': ['巳', '未'],
        '壬': ['辰', '寅'], '癸': ['卯', '丑']
      };
      if (fuXingMap[ds] && fuXingMap[ds].includes(tb)) {
        dmStars.push('beneficiary / FuXingGuiRen / 福星*');
      }

      const yangRenMap = { '甲': '卯', '乙': '辰', '丙': '午', '丁': '未', '戊': '午', '己': '未', '庚': '酉', '辛': '戌', '壬': '子', '癸': '丑' };
      if (yangRenMap[ds] === tb) dmStars.push('sword star / YangRen / 羊刃');

      const feiRenMap = { '甲': '酉', '乙': '戌', '丙': '子', '丁': '丑', '戊': '子', '己': '丑', '庚': '卯', '辛': '辰', '壬': '午', '癸': '未' };
      if (feiRenMap[ds] === tb) dmStars.push('flying knife / FeiRen / 飞刃*');

      if (ds === '戊' && (tb === '巳' || tb === '未')) {
        if (tb === '未') dmStars.push('red clouds / LiuXia / 流霞*');
      } else {
        const liuXiaMap = { '甲': '酉', '乙': '戌', '丙': '未', '丁': '申', '戊': '巳', '己': '午', '庚': '辰', '辛': '卯', '壬': '亥', '癸': '寅' };
        if (liuXiaMap[ds] === tb) dmStars.push('red clouds / LiuXia / 流霞*');
      }

      const luMap = { '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午', '戊': '巳', '己': '午', '庚': '申', '辛': '酉', '壬': '亥', '癸': '子' };
      if (luMap[ds] === tb) dmStars.push('prosperity / LuShen / 禄神');

      const jinYuMap = { '甲': '辰', '乙': '巳', '丙': '未', '丁': '申', '戊': '未', '己': '申', '庚': '戌', '辛': '亥', '壬': '丑', '癸': '寅' };
      if (jinYuMap[ds] === tb) dmStars.push('golden carriage / JinYu / 金舆');

      if (ds === '戊' && tb === '子') {
        dmStars.push('heavenly administration / TianGuanGuiRen / 天官*');
      }

      // 2. Year Branch, Day Branch & Month Derived Stars (Other:)
      const groupMap = {
        '寅': { hua: '戌', jiang: '午', ma: '申', tao: '卯', jie: '亥', wang: '巳' },
        '午': { hua: '戌', jiang: '午', ma: '申', tao: '卯', jie: '亥', wang: '巳' },
        '戌': { hua: '戌', jiang: '午', ma: '申', tao: '卯', jie: '亥', wang: '巳' },
        '申': { hua: '辰', jiang: '子', ma: '寅', tao: '酉', jie: '巳', wang: '亥' },
        '子': { hua: '辰', jiang: '子', ma: '寅', tao: '酉', jie: '巳', wang: '亥' },
        '辰': { hua: '辰', jiang: '子', ma: '寅', tao: '酉', jie: '巳', wang: '亥' },
        '巳': { hua: '丑', jiang: '酉', ma: '亥', tao: '午', jie: '寅', wang: '申' },
        '酉': { hua: '丑', jiang: '酉', ma: '亥', tao: '午', jie: '寅', wang: '申' },
        '丑': { hua: '丑', jiang: '酉', ma: '亥', tao: '午', jie: '寅', wang: '申' },
        '亥': { hua: '未', jiang: '卯', ma: '巳', tao: '子', jie: '申', wang: '寅' },
        '卯': { hua: '未', jiang: '卯', ma: '巳', tao: '子', jie: '申', wang: '寅' },
        '未': { hua: '未', jiang: '卯', ma: '巳', tao: '子', jie: '申', wang: '寅' }
      };
      const yGroup = groupMap[yb];
      const dGroup = groupMap[db];

      // 咸池桃花
      if (dGroup && dGroup.tao === tb) otherStars.push('peach blossom by the pool / XianChiTaoHua / 咸池桃花');
      else if (yGroup && yGroup.tao === tb) otherStars.push('peach blossom by the pool / XianChiTaoHua / 咸池桃花*(YP)/(年柱)');

      // 驿马
      if (yGroup && yGroup.ma === tb) otherStars.push('travelling horse / YiMa / 驿马*(YP)/(年柱)');
      else if (dGroup && dGroup.ma === tb) otherStars.push('travelling horse / YiMa / 驿马');

      // 华盖
      if (yGroup && yGroup.hua === tb) otherStars.push('star of arts / HuaGai / 华盖*(YP)/(年柱)');
      else if (dGroup && dGroup.hua === tb) otherStars.push('star of arts / HuaGai / 华盖');

      // 将星
      if (dGroup && dGroup.jiang === tb) otherStars.push('general star / JiangXing / 将星');
      else if (yGroup && yGroup.jiang === tb) otherStars.push('general star / JiangXing / 将星*(YP)/(年柱)');

      // 亡神 & 劫煞 (from Day Branch)
      if (dGroup && dGroup.wang === tb) otherStars.push('death star / WangShen / 亡神');
      if (dGroup && dGroup.jie === tb) otherStars.push('robbing star / JieSha / 劫煞');

      // 红鸾 & 天喜
      const hongLuanMap = {
        '子': '卯', '丑': '寅', '寅': '丑', '卯': '子', '辰': '巳', '巳': '辰',
        '午': '卯', '未': '寅', '申': '丑', '酉': '子', '戌': '亥', '亥': '戌'
      };
      const tianXiMap = {
        '子': '酉', '丑': '申', '寅': '未', '卯': '午', '辰': '亥', '巳': '戌',
        '午': '酉', '未': '申', '申': '未', '酉': '午', '戌': '巳', '亥': '辰'
      };
      if (hongLuanMap[yb] === tb) otherStars.push('matchmaker / hongLuanTaoHua / 红鸾桃花*');
      if (tianXiMap[yb] === tb) otherStars.push('promotion / HongLuan / 红鸾*');
      if (yb === '辰' && tb === '巳') otherStars.push('star of happiness / TianXi / 天喜*');

      // 孤辰 & 寡宿
      const guGuaMap = {
        '亥': { gu: '寅', gua: '戌' }, '子': { gu: '寅', gua: '戌' }, '丑': { gu: '寅', gua: '戌' },
        '寅': { gu: '巳', gua: '丑' }, '卯': { gu: '巳', gua: '丑' }, '辰': { gu: '巳', gua: '丑' },
        '巳': { gu: '申', gua: '辰' }, '午': { gu: '申', gua: '辰' }, '未': { gu: '申', gua: '辰' },
        '申': { gu: '亥', gua: '未' }, '酉': { gu: '亥', gua: '未' }, '戌': { gu: '亥', gua: '未' }
      };
      if (guGuaMap[yb]) {
        if (guGuaMap[yb].gu === tb) otherStars.push('solitary star / GuChen / 孤辰*(YP)/(年柱)');
        if (guGuaMap[yb].gua === tb) otherStars.push('forlorn star / GuaSu / 寡宿*(YP)/(年柱)');
      }
      if (tb === '未' && yb === '辰') otherStars.push('forlorn star / GuaSu / 寡宿*');
      if (tb === '亥' && yb === '辰') otherStars.push('solitary star / GuChen / 孤辰');

      // 天罗
      if (yb === '辰' && tb === '巳') otherStars.push('heaven net / TianLuo / 天罗*');

      // 吊客 & 丧门
      if (yb === '辰' && (tb === '寅' || tb === '申')) otherStars.push('crying star / DiaoKeSha / 吊客');
      if (yb === '辰' && (tb === '午' || tb === '子')) otherStars.push('funeral gate / SangMenSha / 丧门*');

      // 岁破
      if (tb === '戌' && yb === '辰') otherStars.push('monetary losses / SuiPo / 岁破*');

      // 血刃
      if (tb === '午' || tb === '戌' || tb === '子') otherStars.push('bloody knife / XueRen / 血刃*');

      // 勾绞
      if (tb === '未' && yb === '辰') otherStars.push('disputes / GouJiao / 勾绞*');

      // 天医
      const tianYiDocMap = {
        '子': '亥', '丑': '子', '寅': '丑', '卯': '寅', '辰': '卯', '巳': '辰',
        '午': '巳', '未': '午', '申': '未', '酉': '申', '戌': '酉', '亥': '戌'
      };
      if (tianYiDocMap[mb] === tb) otherStars.push('heavenly doctor / TianYi / 天医*');

      // 天德
      const tianDeMap = { '寅': '丁', '卯': '申', '辰': '壬', '巳': '辛', '午': '亥', '未': '甲', '申': '癸', '酉': '寅', '戌': '丙', '亥': '乙', '子': '巳', '丑': '庚' };
      if (tianDeMap[mb] === tb || tianDeMap[mb] === ts) otherStars.push('heavenly virtue / TianDeGuiRen / 天德贵人');

      // 月德
      const yueDeMap = { '寅': '丙', '午': '丙', '戌': '丙', '申': '壬', '子': '壬', '辰': '壬', '亥': '甲', '卯': '甲', '未': '甲', '巳': '庚', '酉': '庚', '丑': '庚' };
      if (yueDeMap[mb] === ts) otherStars.push('monthly virtue / YueDeGuiRen / 月德贵人 (Geng)');

      // 龙德
      const longDeMap = { '子': '未', '丑': '申', '寅': '酉', '卯': '戌', '辰': '亥', '巳': '子', '午': '丑', '未': '寅', '申': '卯', '酉': '辰', '戌': '巳', '亥': '午' };
      if (longDeMap[yb] === tb) otherStars.push('mentor / LongDe / 龙德*');

      return { dmStars, otherStars };
    },

    getInteractionClass: function (text) {
      if (!text) return '';
      const lower = text.toLowerCase();

      // 10. Heaven Earth Union (天地德合 / 天地合) -> ส้ม
      if (lower.includes('heaven earth union') || text.includes('天地德合') || text.includes('天地合')) {
        return 'it-tian-di-he';
      }
      // 1. Stem Combination (五合) -> เขียวอ่อน
      if (lower.includes('stem combination') || lower.includes('wu he') || text.includes('五合')) {
        return 'it-stem-combo';
      }
      // 2. Six Combination (六合) -> ชมพูอ่อน
      if (lower.includes('six combination') || lower.includes('liu he') || text.includes('六合')) {
        return 'it-six-combo';
      }
      // 3. Destruction (破 / Liu Po) -> เทา
      if (lower.includes('destruction') || lower.includes('liu po') || text.includes('破')) {
        return 'it-destruction';
      }
      // 4. Half Triangular (半合 / Ban San He) -> ฟ้าอ่อน
      if (lower.includes('half triangular') || lower.includes('ban san he') || text.includes('半合')) {
        return 'it-half-triangular';
      }
      // 5. Triangular (三合 / San He) -> ฟ้า
      if (lower.includes('triangular') || lower.includes('san he') || text.includes('三合')) {
        return 'it-triangular';
      }
      // 7. Branch Conflict (Liu Chong / 冲 / 沖) -> แดงอ่อน
      if (lower.includes('branch conflict') || lower.includes('liu chong') || text.includes('冲') || text.includes('沖')) {
        return 'it-branch-conflict';
      }
      // 6. Crash / Clash -> แดง
      if (lower.includes('crash') || lower.includes('clash') || lower.includes('相冲')) {
        return 'it-clash';
      }
      // 8. Harm (害 / Liu Hai) -> ม่วง
      if (lower.includes('harm') || lower.includes('liu hai') || text.includes('害')) {
        return 'it-harm';
      }
      // 9. Penalty (刑 / San Xing / Earths punishment) -> ชมพู
      if (lower.includes('punishment') || lower.includes('penalty') || lower.includes('san xing') || text.includes('刑')) {
        return 'it-penalty';
      }
      // 11. Fu Yin (伏吟) -> เขียวมิ้นท์
      if (lower.includes('fu yin') || lower.includes('fuyin') || text.includes('伏吟')) {
        return 'it-fuyin';
      }
      // 12. Fan Yin (反吟) -> เหลืองส้ม
      if (lower.includes('fan yin') || lower.includes('fanyin') || text.includes('反吟')) {
        return 'it-fanyin';
      }
      // 13. Void / Kongwang (空亡) -> เหลือง
      if (lower.includes('void') || lower.includes('kongwang') || lower.includes('kong wang') || text.includes('空亡')) {
        return 'it-void';
      }

      return '';
    },

    getInteractionStyle: function (text) {
      if (!text) return '';
      const lower = text.toLowerCase();

      // 10. Heaven Earth Union (天地德合 / 天地合) -> ส้ม
      if (lower.includes('heaven earth union') || text.includes('天地德合') || text.includes('天地合')) {
        return 'color: #ea580c !important; background: #fff7ed !important; border: 1px solid #fed7aa !important; border-left: 3.5px solid #fb923c !important;';
      }
      // 1. Stem Combination (五合) -> เขียวอ่อน
      if (lower.includes('stem combination') || lower.includes('wu he') || text.includes('五合')) {
        return 'color: #16a34a !important; background: #f0fdf4 !important; border: 1px solid #bbf7d0 !important; border-left: 3.5px solid #22c55e !important;';
      }
      // 2. Six Combination (六合) -> ชมพูอ่อน
      if (lower.includes('six combination') || lower.includes('liu he') || text.includes('六合')) {
        return 'color: #ec4899 !important; background: #fdf2f8 !important; border: 1px solid #fbcfe8 !important; border-left: 3.5px solid #f472b6 !important;';
      }
      // 3. Destruction (破 / Liu Po) -> เทา
      if (lower.includes('destruction') || lower.includes('liu po') || text.includes('破')) {
        return 'color: #64748b !important; background: #f8fafc !important; border: 1px solid #cbd5e1 !important; border-left: 3.5px solid #94a3b8 !important;';
      }
      // 4. Half Triangular (半合 / Ban San He) -> ฟ้าอ่อน
      if (lower.includes('half triangular') || lower.includes('ban san he') || text.includes('半合')) {
        return 'color: #0284c7 !important; background: #f0f9ff !important; border: 1px solid #bae6fd !important; border-left: 3.5px solid #38bdf8 !important;';
      }
      // 5. Triangular (三合 / San He) -> ฟ้า
      if (lower.includes('triangular') || lower.includes('san he') || text.includes('三合')) {
        return 'color: #2563eb !important; background: #eff6ff !important; border: 1px solid #bfdbfe !important; border-left: 3.5px solid #3b82f6 !important;';
      }
      // 7. Branch Conflict (Liu Chong / 冲 / 沖) -> แดงอ่อน
      if (lower.includes('branch conflict') || lower.includes('liu chong') || text.includes('冲') || text.includes('沖')) {
        return 'color: #f87171 !important; background: #fff5f5 !important; border: 1px solid #fecaca !important; border-left: 3.5px solid #fca5a5 !important;';
      }
      // 6. Crash / Clash -> แดง
      if (lower.includes('crash') || lower.includes('clash') || lower.includes('相冲')) {
        return 'color: #dc2626 !important; background: #fef2f2 !important; border: 1px solid #fca5a5 !important; border-left: 3.5px solid #ef4444 !important;';
      }
      // 8. Harm (害 / Liu Hai) -> ม่วง
      if (lower.includes('harm') || lower.includes('liu hai') || text.includes('害')) {
        return 'color: #7c3aed !important; background: #faf5ff !important; border: 1px solid #e9d5ff !important; border-left: 3.5px solid #a855f7 !important;';
      }
      // 9. Penalty (刑 / San Xing / Earths punishment) -> ชมพู
      if (lower.includes('punishment') || lower.includes('penalty') || lower.includes('san xing') || text.includes('刑')) {
        return 'color: #d946ef !important; background: #fdf4ff !important; border: 1px solid #f5d0fe !important; border-left: 3.5px solid #e879f9 !important;';
      }
      // 11. Fu Yin (伏吟) -> เขียวมิ้นท์
      if (lower.includes('fu yin') || lower.includes('fuyin') || text.includes('伏吟')) {
        return 'color: #059669 !important; background: #ecfdf5 !important; border: 1px solid #a7f3d0 !important; border-left: 3.5px solid #10b981 !important;';
      }
      // 12. Fan Yin (反吟) -> เหลืองส้ม
      if (lower.includes('fan yin') || lower.includes('fanyin') || text.includes('反吟')) {
        return 'color: #d97706 !important; background: #fffbeb !important; border: 1px solid #fde68a !important; border-left: 3.5px solid #f59e0b !important;';
      }
      // 13. Void / Kongwang (空亡) -> เหลือง
      if (lower.includes('void') || lower.includes('kongwang') || lower.includes('kong wang') || text.includes('空亡')) {
        return 'color: #ca8a04 !important; background: #fefce8 !important; border: 1px solid #fef08a !important; border-left: 3.5px solid #eab308 !important;';
      }

      return 'color: #475569;';
    },

    getInteractionTooltipData: function (rawText) {
      if (!rawText || typeof rawText !== 'string') return null;
      const text = rawText.trim().replace(/,$/, '').replace(/^•\s*/, '');
      const lower = text.toLowerCase();

      // Extract parentheses info e.g. (BingShen-XinSi), (Si-Shen), (Yin-Si-Shen)
      const parenMatch = text.match(/\(([^)]+)\)/);
      const parenContent = parenMatch ? parenMatch[1].trim() : '';

      const stemDict = {
        'Jia': 'เจี่ย (ไม้หยาง)', 'Yi': 'อิก (ไม้หยิน)', 'Bing': 'เปี้ย (ไฟหยาง)', 'Ding': 'ติง (ไฟหยิน)',
        'Wu': 'โบ่ว (ดินหยาง)', 'Ji': 'จี่ (ดินหยิน)', 'Geng': 'แก (ทองหยาง)', 'Xin': 'ซิง (ทองหยิน)',
        'Ren': 'หยิม (น้ำหยาง)', 'Gui': 'กุ่ย (น้ำหยิน)',
        '甲': 'เจี่ย (ไม้หยาง)', '乙': 'อิก (ไม้หยิน)', '丙': 'เปี้ย (ไฟหยาง)', '丁': 'ติง (ไฟหยิน)',
        '戊': 'โบ่ว (ดินหยาง)', '己': 'จี่ (ดินหยิน)', '庚': 'แก (ทองหยาง)', '辛': 'ซิง (ทองหยิน)',
        '壬': 'หยิม (น้ำหยาง)', '癸': 'กุ่ย (น้ำหยิน)'
      };

      const branchDict = {
        'Zi': 'ชวด (หนู/น้ำ)', 'Chou': 'ฉลู (วัว/ดิน)', 'Yin': 'ขาล (เสือ/ไม้)', 'Mao': 'เถาะ (กระต่าย/ไม้)',
        'Chen': 'มะโรง (มังกร/ดิน)', 'Si': 'มะเส็ง (งู/ไฟ)', 'Wu': 'มะเมีย (ม้า/ไฟ)', 'Wei': 'มะแม (แพะ/ดิน)',
        'Shen': 'วอก (ลิง/ทอง)', 'You': 'ระกา (ไก่/ทอง)', 'Xu': 'จอ (หมา/ดิน)', 'Hai': 'กุน (หมู/น้ำ)',
        '子': 'ชวด (หนู/น้ำ)', '丑': 'ฉลู (วัว/ดิน)', '寅': 'ขาล (เสือ/ไม้)', '卯': 'เถาะ (กระต่าย/ไม้)',
        '辰': 'มะโรง (มังกร/ดิน)', '巳': 'มะเส็ง (งู/ไฟ)', '午': 'มะเมีย (ม้า/ไฟ)', '未': 'มะแม (แพะ/ดิน)',
        '申': 'วอก (ลิง/ทอง)', '酉': 'ระกา (ไก่/ทอง)', '戌': 'จอ (หมา/ดิน)', '亥': 'กุน (หมู/น้ำ)'
      };

      const isStemOnly = lower.includes('stem combination') || lower.includes('wu he') || text.includes('五合');
      const isBranchOnly = lower.includes('branch conflict') || lower.includes('six combination') ||
        lower.includes('half triangular') || lower.includes('triangular') ||
        lower.includes('destruction') || lower.includes('harm') ||
        lower.includes('punishment') || lower.includes('penalty') ||
        lower.includes('zi xing') || lower.includes('liu he') || lower.includes('liu chong') ||
        lower.includes('liu po') || lower.includes('liu hai');

      const formatParenTokens = (str) => {
        if (!str) return '';
        const tokens = str.split(/[-–—\s,]+/).filter(Boolean);
        return tokens.map(tok => {
          if (isStemOnly && stemDict[tok]) return stemDict[tok];
          if (isBranchOnly && branchDict[tok]) return branchDict[tok];
          if (branchDict[tok]) return branchDict[tok];
          if (stemDict[tok]) return stemDict[tok];
          // Combined stem+branch like BingShen or XinSi
          for (const sKey of Object.keys(stemDict)) {
            if (tok.startsWith(sKey) && tok.length > sKey.length) {
              const bKey = tok.substring(sKey.length);
              if (branchDict[bKey]) {
                const sName = stemDict[sKey].split(' ')[0];
                const bName = branchDict[bKey].split(' ')[0];
                return `${sName}-${bName} (${sKey}${bKey})`;
              }
            }
          }
          return tok;
        }).join(' ⇋ ');
      };

      const formattedPair = formatParenTokens(parenContent);

      // 1. Heaven Earth Union (天地德合)
      if (lower.includes('tian di he') || lower.includes('heaven earth union') || text.includes('天地德合')) {
        return {
          type: 'tian-di-he',
          badge: '🌟 มหาภาคีมงคลสูงสุด',
          badgeBg: '#ea580c',
          title: 'มหาภาคีฟ้าดิน (天地德合 - Tian Di He)',
          pair: formattedPair || parenContent,
          meaning: 'ก้านฟ้าภาคีเป็นคู่ธาตุ (五合) และกิ่งดินภาคีเป็นคู่ธาตุ (六合) พร้อมกันทั้งฟ้าและดิน สื่อถึงการผูกพันธมิตรที่กลมกลืนสมบูรณ์แบบที่สุดในวิชาปาจื่อ',
          effect: 'เป็นสิริมงคลสูงมาก มีเสน่ห์ เมตตามหานิยม ผู้ใหญ่ผู้มีอำนาจอุปถัมภ์ค้ำชู ความสัมพันธ์หรือหุ้นส่วนแนบแน่นมั่นคง และได้รับโอกาสเกื้อกูลราบรื่นเสมอ',
          advice: 'ใช้โอกาสนี้เจรจา ประสานงาน หรือร่วมมือกับพันธมิตร จะได้รับความไว้วางใจและส่งเสริมให้ก้าวหน้าอย่างรวดเร็ว'
        };
      }

      // 2. Stem Combination (五合)
      if (lower.includes('wu he') || lower.includes('stem combination') || text.includes('五合')) {
        return {
          type: 'stem-combo',
          badge: '🤝 ภาคีก้านฟ้า (โหงวฮะ)',
          badgeBg: '#16a34a',
          title: 'ภาคีก้านฟ้า (天干五合 - Wu He)',
          pair: formattedPair || parenContent,
          meaning: 'การดึงดูดสมพงศ์ระหว่างก้านฟ้าคู่ธาตุหยางกับหยิน สื่อถึงการประสานความคิด วิสัยทัศน์ และสายสัมพันธ์ระหว่างบุคคลที่มองเห็นได้ชัดเจน',
          effect: 'ช่วยสร้างมิตรภาพ ความร่วมมือ พันธมิตรธุรกิจ มีเสน่ห์เมตตา เข้ากับผู้อื่นได้ง่าย และเจรจาประนีประนอมได้ราบรื่น',
          advice: 'เหมาะอย่างยิ่งสำหรับการสร้างคอนเนกชัน การรวมพลังทำงานเป็นทีม และการแสวงหาความร่วมมือเชิงกลยุทธ์'
        };
      }

      // 3. Six Combination (六合)
      if (lower.includes('liu he') || lower.includes('six combination') || text.includes('六合')) {
        return {
          type: 'six-combo',
          badge: '💕 หกภาคีกิ่งดิน (หลักฮะ)',
          badgeBg: '#ec4899',
          title: 'หกภาคีกิ่งดิน (地支六合 - Liu He)',
          pair: formattedPair || parenContent,
          meaning: 'การสมพงศ์เกื้อหนุนของ 12 นักษัตรคู่มิตร สื่อถึงความเข้าอกเข้าใจ สภาพแวดล้อมที่เป็นมิตร และความผูกพันลึกซึ้งในระดับชีวิตจริง',
          effect: 'ช่วยลดทอนและสลายแรงปะทะ (ชง) นำพาความสงบสุข ความสามัคคีในครอบครัวและทีมงาน คนใกล้ชิดคอยหยิบยื่นความช่วยเหลือ',
          advice: 'รักษาไมตรีจิตกับคนใกล้ชิด ร่วมมือประสานประโยชน์ และเปิดใจรับการสนับสนุนจากกัลยาณมิตร'
        };
      }

      // 4. Triangular / Half Triangular Combination (三合 / 半合)
      if (lower.includes('half triangular') || lower.includes('ban san he') || text.includes('半合') || lower.includes('triangular') || text.includes('三合')) {
        const isHalf = lower.includes('half') || lower.includes('ban') || text.includes('半');
        return {
          type: isHalf ? 'half-triangular' : 'triangular',
          badge: isHalf ? '🔷 ครึ่งไตรภาคี (ปั๊นซาฮะ)' : '🔺 ไตรภาคีเต็ม (ซาฮะ)',
          badgeBg: isHalf ? '#0284c7' : '#2563eb',
          title: isHalf ? 'ครึ่งไตรภาคีกิ่งดิน (地支半合 - Ban San He)' : 'ไตรภาคีกิ่งดินครบชุด (地支三合 - San He)',
          pair: formattedPair || parenContent,
          meaning: 'การรวมตัวของกิ่งดินเพื่อก่อกำเนิดพลังธาตุที่เข้มข้นทรงพลัง มุ่งหน้าไปสู่เป้าหมายร่วมกันอย่างเด่นชัด',
          effect: 'เสริมสร้างพลังของธาตุที่เกิดจากการฮะให้โดดเด่น ผลักดันเป้าหมายและโครงการให้คืบหน้าอย่างรวดเร็วด้วยพลังหมู่คณะ',
          advice: 'โฟกัสที่เป้าหมายหลัก รวมทีมเพื่อทำโปรเจกต์ใหญ่ พลังความสามัคคีจะขับเคลื่อนให้บรรลุเป้าหมายที่ตั้งใจไว้'
        };
      }

      // 5. Branch Conflict / Clash (冲)
      if (lower.includes('conflict') || lower.includes('liu chong') || lower.includes('clash') || text.includes('冲') || text.includes('沖') || text.includes('ปะทะ')) {
        return {
          type: 'clash',
          badge: '⚡ กิ่งดินปะทะ (ชง)',
          badgeBg: '#dc2626',
          title: 'กิ่งดินปะทะ (地支六冲 - Liu Chong)',
          pair: formattedPair || parenContent,
          meaning: 'การเผชิญหน้ากันของนักษัตรคู่ตรงข้ามที่มีพลังหักล้างกัน สื่อถึงความเปลี่ยนแปลง การเคลื่อนไหว ความกระตือรือร้น หรือจุดหักเห',
          effect: 'กระตุ้นให้เกิดการเดินทาง โยกย้ายที่อยู่ เปลี่ยนหน้าที่การงาน หรือมีมุมมองขัดแย้งกับบุคคลตามเสาที่ถูกชง',
          advice: 'มองการชงเป็นโอกาสในการปรับปรุงเปลี่ยนแปลง ไม่ควรใจร้อนหรือใช้อารมณ์ การเดินทางหรือจัดฮวงจุ้ยใหม่ช่วยระบายพลังชงได้ดี'
        };
      }

      // 6. Destruction (破)
      if (lower.includes('destruction') || lower.includes('liu po') || text.includes('破')) {
        return {
          type: 'destruction',
          badge: '💔 กิ่งดินทำลาย (ผั่ว)',
          badgeBg: '#64748b',
          title: 'กิ่งดินทำลาย (地支六破 - Liu Po)',
          pair: formattedPair || parenContent,
          meaning: 'การแตกร้าว การสึกหรอ หรือมีข้อบกพร่องที่ซ่อนอยู่ภายใน สื่อถึงการเสื่อมสภาพหรือการละเลยจุดเล็กๆ จนกระทบภาพรวม',
          effect: 'ระวังข้อตกลงหรือสัญญามีรอยร้าว ข้าวของเครื่องใช้เสียหายต้องซ่อมแซม หรือความสัมพันธ์สะดุดเพราะเรื่องไม่เป็นเรื่อง',
          advice: 'ตรวจทานเอกสารสัญญาอย่างละเอียดรอบคอบ บำรุงรักษาสิ่งของเครื่องใช้ และสื่อสารอย่างจริงใจเพื่อไม่ให้เกิดรอยร้าว'
        };
      }

      // 7. Harm (害)
      if (lower.includes('harm') || lower.includes('liu hai') || text.includes('害')) {
        return {
          type: 'harm',
          badge: '⚠️ กิ่งดินให้ร้าย (ไห่)',
          badgeBg: '#7c3aed',
          title: 'กิ่งดินให้ร้าย (地支六害 - Liu Hai)',
          pair: formattedPair || parenContent,
          meaning: 'ความขัดแย้งทางอารมณ์ ความอึดอัดใจ ความระแวง หรือความรู้สึกเหมือนถูกแทงข้างหลังและทำคุณคนไม่ขึ้น',
          effect: 'อาจเกิดความน้อยใจ ถูกเข้าใจผิด เสียความรู้สึกจากคนใกล้ชิด หรือมีความคาดหวังที่สวนทางกัน',
          advice: 'รักษาระยะห่างที่พอดี ไม่ยึดติดกับคำวิจารณ์ ทำงานให้โปร่งใสตรงไปตรงมา และดูแลสุขภาพจิตใจให้ผ่องใส'
        };
      }

      // 8. Bullying punishment (持势之刑 / Yin-Si-Shen)
      if (lower.includes('bullying') || text.includes('持势之刑') || lower.includes('yin-si-shen')) {
        return {
          type: 'penalty',
          badge: '⚖️ ซาเฮ้งอวดอำนาจ',
          badgeBg: '#d946ef',
          title: 'ซาเฮ้งอวดอำนาจ (持势之刑 - Bullying Punishment)',
          pair: formattedPair || 'ขาล (Yin) ⚡ มะเส็ง (Si) ⚡ วอก (Shen)',
          meaning: 'ซาเฮ้งกลุ่มแก่งแย่งชิงดี เกิดจาก 3 นักษัตรธาตุเกิดที่มีความเชื่อมั่นในอำนาจและศักยภาพของตนเองสูงจนปะทะกัน',
          effect: 'ระวังการแข่งขันชิงดีชิงเด่น ข้อพิพาทเรื่องบทบาทหน้าที่ คดีความ หรืออุบัติเหตุจากความใจร้อนประมาท',
          advice: 'ควรอ่อนน้อมถ่อมตน ปฏิบัติตามกฎหมายและระเบียบวินัยอย่างเคร่งครัด หลีกเลี่ยงการปะทะคารมโดยไม่จำเป็น'
        };
      }

      // 9. Three Earths punishment (无恩之刑 / Wei-Chou-Xu)
      if (lower.includes('three earths') || text.includes('无恩之刑') || lower.includes('wei-chou-xu')) {
        return {
          type: 'penalty',
          badge: '⚖️ ซาเฮ้งไร้บุญคุณ',
          badgeBg: '#d946ef',
          title: 'ซาเฮ้งไร้บุญคุณ (无恩之刑 - Three Earths Punishment)',
          pair: formattedPair || 'มะแม (Wei) ⚡ ฉลู (Chou) ⚡ จอ (Xu)',
          meaning: 'การรวมตัวของ 3 นักษัตรธาตุดินจนพลังดินทับถมหนาแน่น สื่อถึงความรู้สึกน้อยใจ ทำคุณคนไม่ขึ้น หรือถูกคนใกล้ตัวสร้างความลำบากให้',
          effect: 'อารมณ์ดิ่ง รู้สึกโดดเดี่ยว และระวังปัญหาสุขภาพเกี่ยวกับระบบย่อยอาหาร ทางเดินอาหาร ม้าม หรือช่องท้อง',
          advice: 'ปล่อยวางความคาดหวังในการตอบแทนบุญคุณ ทำจิตใจให้สงบ รับประทานอาหารที่มีประโยชน์และดูแลสุขภาพสม่ำเสมอ'
        };
      }

      // 10. Uncivil punishment (无礼之刑 / Zi-Mao)
      if (lower.includes('uncivil') || text.includes('无礼之刑') || lower.includes('zi-mao') || lower.includes('mao-zi')) {
        return {
          type: 'penalty',
          badge: '⚖️ ซาเฮ้งไร้มารยาท',
          badgeBg: '#d946ef',
          title: 'ซาเฮ้งไร้มารยาท (无礼之刑 - Uncivil Punishment)',
          pair: formattedPair || 'ชวด (Zi) ⚡ เถาะ (Mao)',
          meaning: 'ความขัดแย้งที่เกิดจากการขาดความเกรงใจ การล้ำเส้น หรือประเด็นเรื่องเพศสัมพันธ์และความสัมพันธ์ส่วนตัวที่ไม่ชัดเจน',
          effect: 'อาจเผชิญคำพูดเสียดสี ล่วงเกิน ถูกเข้าใจผิดเรื่องชู้สาว หรือขัดแย้งกับผู้ใหญ่/บริวารเพราะเรื่องมารยาท',
          advice: 'ระมัดระวังการใช้วาจาและการวางตัว มีขอบเขตความสัมพันธ์ที่ชัดเจน และให้เกียรติซึ่งกันและกันเสมอ'
        };
      }

      // 11. Self punishment (自刑 / Zi Xing)
      if (lower.includes('self punishment') || lower.includes('zi xing') || text.includes('自刑')) {
        return {
          type: 'penalty',
          badge: '⚖️ จื่อเฮ้ง (ลงโทษตนเอง)',
          badgeBg: '#d946ef',
          title: 'จื่อเฮ้ง / ลงโทษตนเอง (自刑 - Self Punishment)',
          pair: formattedPair || parenContent || 'มะโรง, มะเมีย, ระกา, กุน',
          meaning: 'การที่นักษัตรเดียวกันปรากฏซ้ำ (辰-辰, 午-午, 酉-酉, 亥-亥) สื่อถึงการคิดวนเวียน วิตกกังวล กดดันตัวเอง หรือทำร้ายจิตใจตัวเองโดยไม่รู้ตัว',
          effect: 'มักโทษตัวเอง ลังเลไม่มั่นใจ หรือตั้งมาตรฐานสูงเกินไปจนเกิดความเครียดสะสม',
          advice: 'ฝึกให้อภัยตนเอง มีเมตตาต่อใจตัวเอง ปรึกษาคนที่ไว้ใจ และอย่าแบกรับความคาดหวังไว้เพียงลำพัง'
        };
      }

      // 12. Fan Yin (反吟)
      if (lower.includes('fan yin') || text.includes('反吟')) {
        return {
          type: 'fanyin',
          badge: '🌪️ ฮวงงิ้ม (ปะทะฟ้าดิน)',
          badgeBg: '#d97706',
          title: 'ฮวงงิ้ม (反吟 - Fan Yin)',
          pair: formattedPair || parenContent,
          meaning: 'ก้านฟ้าชงกันและกิ่งดินชงกันพร้อมกัน ก่อให้เกิดคลื่นพลังผันผวนอย่างรุนแรง สื่อถึงจุดเปลี่ยนพลิกผันครั้งใหญ่ในชีวิต',
          effect: 'เกิดความเปลี่ยนแปลงอย่างรวดเร็ว ทั้งหน้าที่การงาน ที่อยู่อาศัย หรือวิถีชีวิต ต้องปรับตัวอย่างฉับพลัน',
          advice: 'ตั้งรับด้วยสติและความสุขุม หลีกเลี่ยงการลงทุนที่มีความเสี่ยงสูง และมองการเปลี่ยนแปลงเป็นการเปิดบทเรียนใหม่'
        };
      }

      // 13. Fu Yin (伏吟)
      if (lower.includes('fu yin') || text.includes('伏吟')) {
        return {
          type: 'fuyin',
          badge: '⏳ ฮกงิ้ม (ซ้ำซ้อนฟ้าดิน)',
          badgeBg: '#059669',
          title: 'ฮกงิ้ม (伏吟 - Fu Yin)',
          pair: formattedPair || parenContent,
          meaning: 'ก้านฟ้าและกิ่งดินซ้ำซ้อนกัน พลังนิ่งสงบเกินไปจนกลายเป็นความหน่วง ซ้ำซาก อึดอัด หรือความลังเลไม่เด็ดขาด',
          effect: 'รู้สึกเหมือนพายเรือในอ่าง เรื่องเก่าๆ ย้อนกลับมาให้แก้ไข ความก้าวหน้าเป็นไปอย่างล่าช้า',
          advice: 'อดทนรอจังหวะที่เหมาะสม ใช้เวลานี้ทบทวนตนเอง พัฒนาทักษะ และจัดระเบียบชีวิตให้พร้อมเมื่อโอกาสมาถึง'
        };
      }

      // 14. Void / Kong Wang (日空亡)
      if (lower.includes('void') || lower.includes('kong wang') || lower.includes('kongwang') || text.includes('空亡')) {
        return {
          type: 'void',
          badge: '🕳️ คงหวัง (ตกช่องว่าง)',
          badgeBg: '#ca8a04',
          title: 'คงหวัง / ตกช่องว่าง (日空亡 - Kong Wang)',
          pair: formattedPair || parenContent || 'กิ่งดินตกช่องว่างประจำวัน',
          meaning: 'กิ่งดินที่ตกอยู่ในช่วง 2 นักษัตรที่ไร้ก้านฟ้าประจำวงรอบวัน ทำให้พลังในโลกกายภาพเบาบางลง',
          effect: 'ผลประโยชน์ทางโลกหรือความคาดหวังในเสานั้นอาจมาถึงช้า หรือต้องเหน็ดเหนื่อยมากกว่าผู้อื่นถึงจะได้มา',
          advice: 'โดดเด่นอย่างยิ่งสำหรับงานด้านจิตวิญญาณ การศึกษา ปรัชญา ศิลปะ ความคิดสร้างสรรค์ และงานเบื้องหลัง'
        };
      }

      // Default fallback
      return {
        type: 'general',
        badge: '🔍 ปฏิสัมพันธ์ในผังดวง',
        badgeBg: '#64748b',
        title: text,
        pair: formattedPair || parenContent,
        meaning: 'ปฏิสัมพันธ์ระหว่างเสาชะตาในวิชาปาจื่อ สะท้อนถึงการแลกเปลี่ยนพลังงาน อุปนิสัย และจังหวะชีวิต',
        effect: 'ส่งผลต่อสภาวะอารมณ์ ความสัมพันธ์ และโอกาสในด้านที่เกี่ยวข้องกับเสานั้นๆ',
        advice: 'สังเกตและปรับตัวตามพลังงานเพื่อสร้างสมดุลให้กับชีวิต'
      };
    },

    initInteractionTooltips: function () {
      let tip = document.getElementById('baziInteractionTooltip');
      if (!tip) {
        tip = document.createElement('div');
        tip.id = 'baziInteractionTooltip';
        tip.className = 'bazi-interaction-tooltip';
        document.body.appendChild(tip);
      }

      let activeItem = null;

      const positionTooltip = (e, item) => {
        if (!tip || !tip.classList.contains('visible')) return;
        const tipRect = tip.getBoundingClientRect();
        const tipWidth = tipRect.width || 340;
        const tipHeight = tipRect.height || 220;

        let x = e.clientX + 16;
        let y = e.clientY + 14;

        if (x + tipWidth > window.innerWidth - 16) {
          x = e.clientX - tipWidth - 16;
        }
        if (x < 16) x = 16;

        if (y + tipHeight > window.innerHeight - 16) {
          y = e.clientY - tipHeight - 14;
        }
        if (y < 16) y = 16;

        tip.style.left = `${x}px`;
        tip.style.top = `${y}px`;
      };

      const showTooltip = (item, e) => {
        const isStar = item.classList.contains('luck-star-item') || item.hasAttribute('data-star-text');

        if (isStar) {
          const rawText = item.getAttribute('data-star-text') || item.textContent.trim().replace(/,$/, '');
          const star = (window.BaziStarsDB && typeof window.BaziStarsDB.getStarDetails === 'function')
            ? window.BaziStarsDB.getStarDetails(rawText)
            : null;

          if (star) {
            let manifestHtml = '';
            if (star.manifestation) {
              const entries = Object.entries(star.manifestation);
              if (entries.length > 0) {
                const labels = {
                  career: '💼 การงานและอำนาจ',
                  wealth: '💰 การเงินและโชคลาภ',
                  relationship: '❤️ ความรักและคู่ครอง',
                  marriage: '💍 คู่ครองและการสมรส',
                  health: '🏥 สุขภาพและความปลอดภัย',
                  education: '🎓 การศึกษาและสติปัญญา',
                  temper: '⚡ อารมณ์และบุคลิกภาพ',
                  traits: '🌟 อุปนิสัยและบุคลิก',
                  caution: '⚠️ ข้อควรระวัง'
                };
                manifestHtml = entries.map(([k, val]) => `
                  <div class="bazi-it-section" style="margin-top: 6px;">
                    <div class="bazi-it-label" style="color: #cbd5e1; font-size: 11px; font-weight: 600;">${labels[k] || k}</div>
                    <div class="bazi-it-desc" style="font-size: 11px; line-height: 1.4; color: #f1f5f9;">${val}</div>
                  </div>
                `).join('');
              }
            }

            tip.innerHTML = `
              <div class="bazi-it-header">
                <span class="bazi-it-badge" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.5);">
                  ⭐ ${star.type || 'Symbolic Star (神煞)'}
                </span>
                ${star.code ? `<span style="font-size: 10px; color: #94a3b8; font-family: monospace;">${star.code}</span>` : ''}
              </div>
              <div class="bazi-it-title" style="color: #fef08a; font-size: 13.5px; font-weight: 700; margin-bottom: 6px;">
                ${star.nameThai || star.hanzi}
                <span style="font-size: 11px; font-weight: normal; color: #cbd5e1; margin-left: 4px;">(${star.hanzi} / ${star.pinyin})</span>
              </div>
              <div class="bazi-it-section">
                <div class="bazi-it-label" style="color: #fde047; font-size: 11px; font-weight: 700;">📖 ความหมายและพลังของดาว</div>
                <div class="bazi-it-desc" style="font-size: 11.5px; line-height: 1.45; color: #f8fafc;">${star.description}</div>
              </div>
              ${manifestHtml}
            `;
          } else {
            // General Star Fallback
            tip.innerHTML = `
              <div class="bazi-it-header">
                <span class="bazi-it-badge" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.5);">
                  ⭐ ดาวมงคล / Shen Sha (神煞)
                </span>
              </div>
              <div class="bazi-it-title" style="color: #fef08a; font-size: 13px; font-weight: 700;">${rawText}</div>
              <div class="bazi-it-section">
                <div class="bazi-it-label" style="color: #fde047; font-size: 11px; font-weight: 700;">📖 อิทธิพลของดาว</div>
                <div class="bazi-it-desc" style="font-size: 11.5px; line-height: 1.4; color: #f8fafc;">สถิตในดวงชะตา บ่งชี้ถึงพลังงานพิเศษ จิตวิญญาณ วาสนา หรือโอกาสตามหลักโป๊ยหยี่สี่เถียว</div>
              </div>
            `;
          }

          tip.classList.add('visible');
          positionTooltip(e, item);
          return;
        }

        // Interaction Item
        const text = item.getAttribute('data-interaction-text') || item.textContent.trim().replace(/,$/, '');
        let data = this.getInteractionTooltipData(text);
        if (!data) {
          data = {
            badge: '⚡ ธาตุสัมพันธ์ / Interaction',
            badgeBg: '#6366f1',
            title: text,
            pair: '',
            meaning: 'ปฏิกิริยาระหว่างกิ่งฟ้า/กิ่งดินในเสาดวงชะตา ส่งผลต่อการเปลี่ยนแปลงของพลังงานธาตุ',
            effect: 'มีผลต่อเหตุการณ์ วาสนา และปฏิสัมพันธ์กับสิ่งแวดล้อมในช่วงเวลาดังกล่าว',
            advice: 'สังเกตและปรับตัวตามพลังงานเพื่อสร้างความกลมกลืนและสมดุลให้กับชีวิต'
          };
        }

        tip.innerHTML = `
          <div class="bazi-it-header">
            <span class="bazi-it-badge" style="background: ${data.badgeBg}22; color: ${data.badgeBg}; border: 1px solid ${data.badgeBg}55;">
              ${data.badge}
            </span>
          </div>
          <div class="bazi-it-title">${data.title}</div>
          ${data.pair ? `<div class="bazi-it-pair">⚡ <strong>คู่สัมพันธ์:</strong> ${data.pair}</div>` : ''}
          <div class="bazi-it-section">
            <div class="bazi-it-label" style="color: #93c5fd;">📖 ความหมาย</div>
            <div class="bazi-it-desc">${data.meaning}</div>
          </div>
          <div class="bazi-it-section">
            <div class="bazi-it-label" style="color: #f472b6;">⚡ อิทธิพลในดวง</div>
            <div class="bazi-it-effect">${data.effect}</div>
          </div>
          <div class="bazi-it-advice">
            💡 <strong>คำแนะนำ:</strong> ${data.advice}
          </div>
        `;

        tip.classList.add('visible');
        positionTooltip(e, item);
      };

      const hideTooltip = () => {
        if (tip) tip.classList.remove('visible');
        activeItem = null;
      };

      const selector = '.interaction-item, .interaction-pill, .luck-inter-item, .luck-star-item, [data-interaction-tooltip], [data-star-text], [data-interaction-text]';

      document.addEventListener('mouseover', (e) => {
        const item = e.target.closest(selector);
        if (item) {
          activeItem = item;
          showTooltip(item, e);
        }
      });

      document.addEventListener('mousemove', (e) => {
        if (activeItem && tip && tip.classList.contains('visible')) {
          positionTooltip(e, activeItem);
        }
      });

      document.addEventListener('mouseout', (e) => {
        const item = e.target.closest(selector);
        if (item && (!e.relatedTarget || !item.contains(e.relatedTarget))) {
          hideTooltip();
        }
      });

      document.addEventListener('click', (e) => {
        const item = e.target.closest(selector);
        if (item) {
          activeItem = item;
          showTooltip(item, e);
        } else if (tip && tip.classList.contains('visible')) {
          hideTooltip();
        }
      });
    },

    computeDetailedInteractions: function (col, allCols, annualCol, luckCol, colType = 'natal') {
      const primaryInteractions = [];
      const secondaryInteractions = [];
      let secondaryHeading = 'Luck pillars / 大运:';

      const s = col.stem.zh;
      const b = col.branch.zh;

      const stemCombos = { '甲': '己', '己': '甲', '乙': '庚', '庚': '乙', '丙': '辛', '辛': '丙', '丁': '壬', '壬': '丁', '戊': '癸', '癸': '戊' };
      const sixCombos = { '子': '丑', '丑': '子', '寅': '亥', '亥': '寅', '卯': '戌', '戌': '卯', '辰': '酉', '酉': '辰', '巳': '申', '申': '巳', '午': '未', '未': '午' };
      const sixClashes = { '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅', '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳' };
      const sixHarms = { '子': '未', '未': '子', '丑': '午', '午': '丑', '寅': '巳', '巳': '寅', '卯': '辰', '辰': '卯', '申': '亥', '亥': '申', '酉': '戌', '戌': '酉' };
      const sixDestructions = { '子': '酉', '酉': '子', '丑': '辰', '辰': '丑', '寅': '亥', '亥': '寅', '卯': '午', '午': '卯', '巳': '申', '申': '巳', '未': '戌', '戌': '未' };
      const stemClashes = { '甲': '庚', '庚': '甲', '乙': '辛', '辛': '乙', '丙': '壬', '壬': '丙', '丁': '癸', '癸': '丁' };

      const triadGroups = [
        { name: 'Water', branches: ['申', '子', '辰'] },
        { name: 'Wood', branches: ['亥', '卯', '未'] },
        { name: 'Fire', branches: ['寅', '午', '戌'] },
        { name: 'Metal', branches: ['巳', '酉', '丑'] }
      ];

      const comparePillars = (targetCol, compareList, listToPush) => {
        const tS = targetCol.stem.zh;
        const tB = targetCol.branch.zh;

        compareList.forEach(other => {
          if (!other || other === targetCol) return;
          const oS = other.stem.zh;
          const oB = other.branch.zh;

          const getPalaceTag = (otherCol) => {
            if (!otherCol) return '';
            if (otherCol.palace) return ` [${otherCol.palace}]`;
            if (otherCol.label) {
              if (otherCol.label.includes('ยาม') || otherCol.label.includes('Hour')) return ' [เสายาม: วังบริวาร/ลูกหลาน]';
              if (otherCol.label.includes('วัน') || otherCol.label.includes('Day')) return ' [เสาวัน: วังตัวตน/คู่ครอง]';
              if (otherCol.label.includes('ปีจร')) return ' [ปีจร / Tai Sui]';
              if (otherCol.label.includes('วัยจร')) return ' [วัยจร / Da Yun]';
              if (otherCol.label.includes('เดือน') && !otherCol.label.includes('เดือนที่')) return ' [เสาเดือน: วังการงาน/พ่อแม่]';
              if (otherCol.label.includes('ปี')) return ' [เสาปี: วังบรรพบุรุษ/สิ่งแวดล้อม]';
              return ` [${otherCol.label}]`;
            }
            return '';
          };
          const pTag = getPalaceTag(other);

          // Heaven Earth Union (天地德合)
          if (stemCombos[tS] === oS && sixCombos[tB] === oB) {
            listToPush.push(`Heaven Earth Union / Tian Di He / 天地德合 (${targetCol.stem.py}${targetCol.branch.py}-${other.stem.py}${other.branch.py})${pTag}`);
          }

          // Stem Combination (五合)
          if (stemCombos[tS] === oS) {
            listToPush.push(`stem combination / Wu He / 五合 (${targetCol.stem.py}-${other.stem.py})${pTag}`);
          }

          // Fan Yin (反吟)
          if (stemClashes[tS] === oS && sixClashes[tB] === oB) {
            listToPush.push(`Fan Yin / 反吟 (${targetCol.stem.py}${targetCol.branch.py}-${other.stem.py}${other.branch.py})${pTag}`);
          }

          // Stem Conflict (Xiang Ke / 天克)
          if (stemClashes[tS] === oS && sixClashes[tB] !== oB) {
            listToPush.push(`stem conflict / Xiang Ke / 天克 (${targetCol.stem.py}-${other.stem.py})${pTag}`);
          }

          // Branch Conflict (Liu Chong / 冲)
          if (sixClashes[tB] === oB) {
            listToPush.push(`branch conflict / Liu Chong / 冲 (${targetCol.branch.py}-${other.branch.py})${pTag}`);
          }

          // Six Combination (Liu He / 六合)
          if (sixCombos[tB] === oB) {
            listToPush.push(`six combination / Liu He / 六合 (${targetCol.branch.py}-${other.branch.py})${pTag}`);
          }

          // Triad Half Combination (Ban San He / 半合)
          triadGroups.forEach(grp => {
            if (grp.branches.includes(tB) && grp.branches.includes(oB) && tB !== oB) {
              listToPush.push(`half triangular combination / Ban San He / 半合 (${targetCol.branch.py}-${other.branch.py})${pTag}`);
            }
          });

          // Destruction (Liu Po / 破)
          if (sixDestructions[tB] === oB) {
            listToPush.push(`destruction / Liu Po / 破 (${targetCol.branch.py}-${other.branch.py})${pTag}`);
          }

          // Harm (Liu Hai / 害)
          if (sixHarms[tB] === oB) {
            listToPush.push(`harm / Liu Hai / 害 (${targetCol.branch.py}-${other.branch.py})${pTag}`);
          }

          // Fu Yin (伏吟)
          if (tS === oS && tB === oB) {
            listToPush.push(`Fu Yin / 伏吟 (${targetCol.stem.py} ${targetCol.branch.py})${pTag}`);
          }
        });
      };

      const checkSanXing = (targetBranch, fullContextBranches, listToPush) => {
        // 1. Earths punishment (丑 未 戌)
        if (['丑', '未', '戌'].includes(targetBranch)) {
          const earths = fullContextBranches.filter(x => ['丑', '未', '戌'].includes(x));
          const uniqueEarths = Array.from(new Set(earths));
          if (uniqueEarths.length >= 3) {
            const order = ['Wei', 'Chou', 'Xu'];
            const name = `three earths punishment / San Xing / 无恩之刑 (${order.join('-')})`;
            if (!listToPush.includes(name)) listToPush.push(name);
          } else if (uniqueEarths.length === 2) {
            const pyList = uniqueEarths.map(br => BRANCHES.find(x => x.zh === br)?.py || br);
            const name = `earths punishment / San Xing / 无恩之刑 (${pyList.join('-')})`;
            if (!listToPush.includes(name)) listToPush.push(name);
          }
        }
        // 2. Bullying punishment (寅 巳 申)
        if (['寅', '巳', '申'].includes(targetBranch)) {
          const group = fullContextBranches.filter(x => ['寅', '巳', '申'].includes(x));
          const uniqueGroup = Array.from(new Set(group));
          if (uniqueGroup.length >= 2) {
            const pyList = uniqueGroup.map(br => BRANCHES.find(x => x.zh === br)?.py || br);
            const name = `bullying punishment / San Xing / 持势之刑 (${pyList.join('-')})`;
            if (!listToPush.includes(name)) listToPush.push(name);
          }
        }
        // 3. Uncivil punishment (子 卯)
        if (targetBranch === '子' && fullContextBranches.includes('卯')) {
          const name = 'uncivil punishment / San Xing / 无礼之刑 (Zi-Mao)';
          if (!listToPush.includes(name)) listToPush.push(name);
        }
        if (targetBranch === '卯' && fullContextBranches.includes('子')) {
          const name = 'uncivil punishment / San Xing / 无礼之刑 (Mao-Zi)';
          if (!listToPush.includes(name)) listToPush.push(name);
        }
        // 4. Self punishment (辰, 午, 酉, 亥)
        if (['辰', '午', '酉', '亥'].includes(targetBranch)) {
          const count = fullContextBranches.filter(x => x === targetBranch).length;
          if (count >= 2) {
            const py = BRANCHES.find(x => x.zh === targetBranch)?.py || targetBranch;
            const name = `self punishment / Zi Xing / 自刑 (${py})`;
            if (!listToPush.includes(name)) listToPush.push(name);
          }
        }
      };

      const checkSanHui = (targetBranch, fullContextBranches, listToPush) => {
        const sanHuiGroups = [
          { name: 'directional combination / San Hui / 三会', py: 'Yin-Mao-Chen', branches: ['寅', '卯', '辰'] },
          { name: 'directional combination / San Hui / 三会', py: 'Si-Wu-Wei', branches: ['巳', '午', '未'] },
          { name: 'directional combination / San Hui / 三会', py: 'Shen-You-Xu', branches: ['申', '酉', '戌'] },
          { name: 'directional combination / San Hui / 三会', py: 'Hai-Zi-Chou', branches: ['亥', '子', '丑'] }
        ];
        sanHuiGroups.forEach(grp => {
          if (grp.branches.includes(targetBranch)) {
            const hasAll3 = grp.branches.every(br => fullContextBranches.includes(br));
            if (hasAll3) {
              const name = `${grp.name} (${grp.py})`;
              if (!listToPush.includes(name)) listToPush.push(name);
            }
          }
        });
      };

      const checkFullTriad = (targetBranch, fullContextBranches, listToPush) => {
        triadGroups.forEach(grp => {
          if (grp.branches.includes(targetBranch)) {
            const hasAll3 = grp.branches.every(br => fullContextBranches.includes(br));
            if (hasAll3) {
              const pyOrder = grp.branches.map(br => BRANCHES.find(x => x.zh === br)?.py || br).join('-');
              const name = `triangular combination / San He / 三合 (${pyOrder})`;
              if (!listToPush.includes(name)) listToPush.push(name);
            }
          }
        });
      };

      const checkVoid = (targetCol, dayCol, listToPush) => {
        if (!dayCol) return;
        const dSIdx = STEMS.findIndex(x => x.zh === dayCol.stem.zh);
        const dBIdx = BRANCHES.findIndex(x => x.zh === dayCol.branch.zh);
        if (dSIdx !== -1 && dBIdx !== -1) {
          const kw = this.getKongWang(dSIdx, dBIdx);
          if (kw[0].includes(targetCol.branch.py)) {
            listToPush.push('heaven void (DP) / Kong Wang / 日空亡');
          }
        }
      };

      const dayCol = allCols.find(c => c.label && c.label.includes('วัน')) || allCols[1];

      if (colType === 'natal') {
        // 1. Primary: Compare against other 3 natal pillars
        const otherNatals = allCols.filter(c => c !== col);
        comparePillars(col, otherNatals, primaryInteractions);
        const natalBranches = allCols.map(c => c.branch.zh);
        checkSanXing(b, natalBranches, primaryInteractions);
        checkSanHui(b, natalBranches, primaryInteractions);
        checkFullTriad(b, natalBranches, primaryInteractions);
        if (col !== dayCol) checkVoid(col, dayCol, primaryInteractions);

        // 2. Secondary: Compare against Luck Pillar
        if (luckCol) {
          secondaryHeading = 'Luck pillars / 大运:';
          comparePillars(col, [luckCol], secondaryInteractions);
          const luckNatalBranches = [...natalBranches, luckCol.branch.zh];
          checkSanXing(b, luckNatalBranches, secondaryInteractions);
          checkSanHui(b, luckNatalBranches, secondaryInteractions);
          checkFullTriad(b, luckNatalBranches, secondaryInteractions);
        }
      } else if (colType === 'annual') {
        // 1. Primary: Compare Annual Year against all 4 natal pillars
        comparePillars(col, allCols, primaryInteractions);
        const annualNatalBranches = [...allCols.map(c => c.branch.zh), b];
        checkSanXing(b, annualNatalBranches, primaryInteractions);
        checkSanHui(b, annualNatalBranches, primaryInteractions);
        checkFullTriad(b, annualNatalBranches, primaryInteractions);
        checkVoid(col, dayCol, primaryInteractions);

        // 2. Secondary: Compare Annual Year against Luck Pillar
        if (luckCol) {
          secondaryHeading = 'Luck pillars / 大运:';
          comparePillars(col, [luckCol], secondaryInteractions);
          const fullBranches = [...annualNatalBranches, luckCol.branch.zh];
          checkSanXing(b, fullBranches, secondaryInteractions);
          checkSanHui(b, fullBranches, secondaryInteractions);
          checkFullTriad(b, fullBranches, secondaryInteractions);
        }
      } else if (colType === 'luck' || colType === 'dayun') {
        // 1. Primary: Compare Luck Pillar against all 4 natal pillars
        comparePillars(col, allCols, primaryInteractions);
        const luckNatalBranches = [...allCols.map(c => c.branch.zh), b];
        checkSanXing(b, luckNatalBranches, primaryInteractions);
        checkSanHui(b, luckNatalBranches, primaryInteractions);
        checkFullTriad(b, luckNatalBranches, primaryInteractions);
        checkVoid(col, dayCol, primaryInteractions);

        // 2. Secondary: Compare Luck Pillar against Annual Year
        if (annualCol) {
          secondaryHeading = 'Annual year / 流年:';
          comparePillars(col, [annualCol], secondaryInteractions);
          const fullBranches = [...luckNatalBranches, annualCol.branch.zh];
          checkSanXing(b, fullBranches, secondaryInteractions);
          checkSanHui(b, fullBranches, secondaryInteractions);
          checkFullTriad(b, fullBranches, secondaryInteractions);
        }
      } else if (colType === 'monthly') {
        // 1. Primary: Compare Monthly Pillar against all 4 natal pillars
        comparePillars(col, allCols, primaryInteractions);
        const monthNatalBranches = [...allCols.map(c => c.branch.zh), b];
        checkSanXing(b, monthNatalBranches, primaryInteractions);
        checkSanHui(b, monthNatalBranches, primaryInteractions);
        checkFullTriad(b, monthNatalBranches, primaryInteractions);
        checkVoid(col, dayCol, primaryInteractions);

        // 2. Secondary: Compare Monthly Pillar against Annual Year & Luck Pillar
        secondaryHeading = 'Annual & Luck / 年运:';
        if (annualCol) comparePillars(col, [annualCol], secondaryInteractions);
        if (luckCol) comparePillars(col, [luckCol], secondaryInteractions);

        // Comprehensive Triads & San Xing across full context (Month + Natal + Annual + Luck)
        const fullContextBranches = [...monthNatalBranches];
        if (annualCol) fullContextBranches.push(annualCol.branch.zh);
        if (luckCol) fullContextBranches.push(luckCol.branch.zh);
        checkSanXing(b, fullContextBranches, secondaryInteractions);
        checkSanHui(b, fullContextBranches, secondaryInteractions);
        checkFullTriad(b, fullContextBranches, secondaryInteractions);
      }

      const cleanList = (list) => Array.from(new Set(list));
      return {
        primary: cleanList(primaryInteractions),
        secondary: cleanList(secondaryInteractions),
        secondaryHeading,
        natalInteractions: cleanList(primaryInteractions),
        luckInteractions: cleanList(secondaryInteractions)
      };
    },

    renderMasterFourPillarsMatrix: function () {
      const container = document.getElementById('baziExpertMasterTableWrap');
      if (!container || !this.currentChart) return;
      const c = this.currentChart;

      const curYear = this.selectedYear || new Date().getFullYear();
      const yrSIdx = ((curYear - 4) % 10 + 10) % 10;
      const yrBIdx = ((curYear - 4) % 12 + 12) % 12;
      const annualStem = STEMS[yrSIdx];
      const annualBranch = BRANCHES[yrBIdx];
      const annualTenGod = getTenGod(c.dayMaster, annualStem);
      const annualHiddenStems = annualBranch.hidden.map(h => {
        const hStemObj = STEMS.find(s => s.zh === h.stem);
        return { ...h, stemObj: hStemObj, tenGod: getTenGod(c.dayMaster, hStemObj) };
      });
      const annualPillar = {
        stem: annualStem,
        branch: annualBranch,
        tenGod: annualTenGod,
        hiddenStems: annualHiddenStems,
        label: `ปีจร ${curYear}`
      };

      const curDaYun = (c.daYunPillars && c.daYunPillars[this.selectedDaYunIndex]) || (c.daYunPillars && c.daYunPillars.find(d => d.isCurrent)) || (c.daYunPillars && c.daYunPillars[0]) || {
        stem: annualStem,
        branch: annualBranch,
        ageFrom: 0,
        ageTo: 10,
        ageRange: '0-10 ปี'
      };
      const luckTenGod = getTenGod(c.dayMaster, curDaYun.stem);
      const luckHiddenStems = curDaYun.branch.hidden ? curDaYun.branch.hidden.map(h => {
        const hStemObj = STEMS.find(s => s.zh === h.stem);
        return { ...h, stemObj: hStemObj, tenGod: getTenGod(c.dayMaster, hStemObj) };
      }) : [];
      const luckPillar = {
        stem: curDaYun.stem,
        branch: curDaYun.branch,
        tenGod: luckTenGod,
        hiddenStems: luckHiddenStems,
        label: `วัยจร ${curDaYun.ageFrom}-${curDaYun.ageTo} ปี`
      };

      const natalCols = [
        { ...c.pillars.hour, pillarKey: 'hour', label: 'เสายาม', palace: 'เสายาม: วังบริวาร/ลูกหลาน' },
        { ...c.pillars.day, pillarKey: 'day', label: 'เสาวัน', palace: 'เสาวัน: วังตัวตน/คู่ครอง' },
        { ...c.pillars.month, pillarKey: 'month', label: 'เสาเดือน', palace: 'เสาเดือน: วังการงาน/พ่อแม่' },
        { ...c.pillars.year, pillarKey: 'year', label: 'เสาปี', palace: 'เสาปี: วังบรรพบุรุษ/สิ่งแวดล้อม' }
      ];
      const dayStem = c.dayMaster;
      const dayBranch = c.pillars.day.branch;
      const yearBranch = c.pillars.year.branch;
      const monthBranch = c.pillars.month.branch;

      const columns = [
        { key: 'hour', title: 'เสายาม', subTitle: c.birthTimeString || '13:40', pillar: c.pillars.hour, isNatal: true },
        { key: 'day', title: 'เสาวัน', subTitle: String(new Date(c.birthDateString).getDate() || 18), pillar: c.pillars.day, isNatal: true, isDM: true },
        { key: 'month', title: 'เสาเดือน', subTitle: String(new Date(c.birthDateString).getMonth() + 1 || 10), pillar: c.pillars.month, isNatal: true },
        { key: 'year', title: 'เสาปี', subTitle: String(new Date(c.birthDateString).getFullYear() || 2026), pillar: c.pillars.year, isNatal: true },
        { key: 'annual', title: 'ปีจร', subTitle: `${curYear}`, pillar: annualPillar, isAnnual: true },
        { key: 'luck', title: 'วัยจร', subTitle: `${curDaYun.ageFrom}-${curDaYun.ageTo} ปี`, pillar: luckPillar, isLuck: true }
      ];

      const tgAbbrMap = {
        '比肩': 'Fr', '劫財': 'RW', '食神': 'EG', '傷官': 'HO',
        '偏財': 'IW', '正財': 'DW', '七殺': 'QS', '正官': 'DO',
        '偏印': 'IR', '正印': 'DR'
      };

      let html = `
        <table class="bazi-master-grid-table">
          <thead>
            <tr>
              <th class="row-header-col">เสาชะตา</th>
              ${columns.map(col => `
                <th class="col-header ${col.isLuck ? 'is-luck-pillar' : ''} ${col.isAnnual ? 'is-annual-pillar' : ''}">
                  <div style="font-size: 13px; font-weight: 700; color: #0f172a;">${col.title}</div>
                  <div style="font-size: 11px; color: #64748b; font-weight: 500;">${col.subTitle}</div>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            <!-- Row: HS (Heavenly Stems) -->
            <tr>
              <td class="row-header-col">HS<br><small style="font-size:10px; color:#94a3b8;">กิ่งฟ้า</small></td>
              ${columns.map(col => {
        const s = col.pillar.stem;
        const tg = col.isDM ? { zh: '日主', py: 'Day master', en: 'Self' } : (col.pillar.tenGod || { zh: '比肩', py: 'Friend', en: 'Friend' });
        return `
                  <td>
                    <div class="bazi-stem-card stem-bg-${s.element}">
                      <div class="bazi-card-pinyin">${s.py}</div>
                      <div class="bazi-card-char">${s.zh}</div>
                      <div class="bazi-card-polarity">${s.element.charAt(0).toUpperCase() + s.element.slice(1)} ${s.polarity === 'yang' ? '+' : '-'}</div>
                      <div class="bazi-card-tengod">${col.isDM ? 'Day master' : `${tg.py} / ${tg.zh}`}</div>
                    </div>
                  </td>
                `;
      }).join('')}
            </tr>

            <!-- Row: EB (Earthly Branches) -->
            <tr>
              <td class="row-header-col">EB<br><small style="font-size:10px; color:#94a3b8;">ก้านดิน</small></td>
              ${columns.map(col => {
        const b = col.pillar.branch;
        const dh = this.getDominantHiddenStem(b.zh);
        const bTg = col.isDM ? getTenGod(c.dayMaster, dh) : getTenGod(c.dayMaster, dh);
        return `
                  <td>
                    <div class="bazi-branch-card branch-bg-${b.element}">
                      <div class="bazi-card-pinyin">${b.py}</div>
                      <div class="bazi-card-char">${b.zh}</div>
                      <div class="bazi-card-polarity">${b.zodiac ? b.zodiac.split(' ')[0] : b.animal}</div>
                      <div class="bazi-card-tengod">${bTg.py} / ${bTg.zh}</div>
                    </div>
                  </td>
                `;
      }).join('')}
            </tr>

            <!-- Row: HHS (Hidden Heavenly Stems) -->
            <tr>
              <td class="row-header-col">HHS<br><small style="font-size:10px; color:#94a3b8;">กิ่งฟ้าแฝง</small></td>
              ${columns.map(col => {
        const b = col.pillar.branch;
        return `
                  <td>
                    <div class="bazi-hhs-row">
                      ${b.hidden.map(h => {
          const sObj = STEMS.find(s => s.zh === h.stem) || STEMS[0];
          const tg = getTenGod(c.dayMaster, sObj);
          const abbr = tgAbbrMap[tg.zh] || 'Fr';
          return `
                          <div class="bazi-hhs-badge stem-bg-${sObj.element}">
                            <span style="font-size: 10px;">${sObj.py}</span>
                            <span style="font-size: 13px; font-weight: 700;">${sObj.zh}</span>
                            <span style="font-size: 9.5px; opacity: 0.85;">${abbr}</span>
                          </div>
                        `;
        }).join('')}
                    </div>
                  </td>
                `;
      }).join('')}
            </tr>

            <!-- Row: Na Yin (ธาตุกำเนิดนัปอิม) -->
            <tr>
              <td class="row-header-col">Na Yin<br><small style="font-size:10px; color:#94a3b8;">นัปอิม</small></td>
              ${columns.map(col => {
        const sIdx = STEMS.findIndex(s => s.zh === col.pillar.stem.zh);
        const bIdx = BRANCHES.findIndex(b => b.zh === col.pillar.branch.zh);
        const ny = this.getNaYinDetail(sIdx, bIdx);
        return `
                  <td>
                    <div class="bazi-nayin-ribbon nayin-bg-${ny.element}" title="${ny.th}">
                      ${ny.en}
                    </div>
                  </td>
                `;
      }).join('')}
            </tr>

            <!-- Row: DHHS (Dominant Hidden Stem) -->
            <tr>
              <td class="row-header-col">DHHS<br><small style="font-size:10px; color:#94a3b8;">ธาตุหลัก</small></td>
              ${columns.map(col => {
        const dh = this.getDominantHiddenStem(col.pillar.branch.zh);
        return `
                  <td style="text-align: center;">
                    <div class="bazi-dhhs-bar stem-bg-${dh.element}">
                      ${dh.py} (${dh.zh})
                    </div>
                  </td>
                `;
      }).join('')}
            </tr>

            <!-- Row: DM's qi phase -->
            <tr>
              <td class="row-header-col">DM's qi<br>phase</td>
              ${columns.map(col => {
        const p = this.get12LifeStage(c.dayMaster.zh, col.pillar.branch.zh);
        return `
                  <td class="bazi-phase-cell">
                    <div><strong>${p.order}. ${p.en}</strong></div>
                    <div style="color: #64748b;">/ ${p.py} / ${p.zh} ${p.symbol}</div>
                  </td>
                `;
      }).join('')}
            </tr>

            <!-- Row: Pillar's qi phase -->
            <tr>
              <td class="row-header-col">Pillar's<br>qi phase</td>
              ${columns.map(col => {
        const p = this.get12LifeStage(col.pillar.stem.zh, col.pillar.branch.zh);
        return `
                  <td class="bazi-phase-cell">
                    <div><strong>${p.order}. ${p.en}</strong></div>
                    <div style="color: #64748b;">/ ${p.py} / ${p.zh} ${p.symbol}</div>
                  </td>
                `;
      }).join('')}
            </tr>

            <!-- Row: Void branch -->
            <tr>
              <td class="row-header-col">Void<br>branch</td>
              ${columns.map(col => {
        const sIdx = STEMS.findIndex(s => s.zh === col.pillar.stem.zh);
        const bIdx = BRANCHES.findIndex(b => b.zh === col.pillar.branch.zh);
        const kw = this.getKongWang(sIdx, bIdx);
        const isDPVoid = col.isNatal && !col.isDM && c.pillars.day && (this.getKongWang(STEMS.findIndex(s => s.zh === c.pillars.day.stem.zh), BRANCHES.findIndex(b => b.zh === c.pillars.day.branch.zh))[0].includes(col.pillar.branch.py));
        return `
                  <td class="bazi-phase-cell">
                    <div>${kw[0]}</div>
                    ${isDPVoid ? '<div style="color: #dc2626; font-weight: 600; font-size: 10px;">★ ติดวันว่าง (Day Void)</div>' : ''}
                  </td>
                `;
      }).join('')}
            </tr>

            <!-- Row: Symbolic Stars / 神煞 -->
            <tr>
              <td class="row-header-col">Symbolic<br>stars /<br>神煞</td>
              ${columns.map(col => {
        const stars = this.computeDetailedStars(
          col.pillar.branch.zh,
          col.pillar.stem.zh,
          dayStem,
          dayBranch,
          yearBranch,
          monthBranch
        );
        return `
                  <td class="bazi-stars-cell">
                    <div style="font-weight: 700; color: #475569; margin-bottom: 2px;">Symbolic stars / 神煞:</div>
                    ${stars.dmStars.length > 0 ? `
                      <div style="margin-bottom: 4px;">
                        <span style="color: #7c3aed; font-weight: 600;">DM:</span> ${stars.dmStars.join(', ')}
                      </div>
                    ` : ''}
                    ${stars.otherStars.length > 0 ? `
                      <div>
                        <span style="color: #0284c7; font-weight: 600;">Other:</span> ${stars.otherStars.join(', ')}
                      </div>
                    ` : ''}
                    ${stars.dmStars.length === 0 && stars.otherStars.length === 0 ? '<span style="color: #94a3b8;">-</span>' : ''}
                  </td>
                `;
      }).join('')}
            </tr>

            <!-- Row: Interactions -->
            <tr>
              <td class="row-header-col">Inter-<br>actions</td>
              ${columns.map(col => {
        const colType = col.isLuck ? 'luck' : (col.isAnnual ? 'annual' : 'natal');
        const inter = this.computeDetailedInteractions(col.pillar, natalCols, annualPillar, luckPillar, colType);
        return `
                  <td class="bazi-interactions-cell">
                    <div style="font-weight: 700; color: #475569; margin-bottom: 4px;">Interactions:</div>
                    ${inter.primary.length > 0 ? inter.primary.map(it => {
          const cls = this.getInteractionClass(it);
          const st = this.getInteractionStyle(it);
          const info = this.getInteractionTooltipData(it);
          const titleAttr = info ? `${info.title} - ${info.meaning}`.replace(/"/g, '&quot;') : '';
          const cleanIt = it.replace(/"/g, '&quot;');
          return `<div class="interaction-item ${cls}" style="${st}" data-interaction-text="${cleanIt}" title="${titleAttr}">${it}</div>`;
        }).join('') : '<div style="color: #94a3b8; font-size: 10.5px;">- ไม่มีจุดปะทะในดวงเดิม -</div>'}

                    ${inter.secondary.length > 0 ? `
                      <div class="luck-heading">${inter.secondaryHeading}</div>
                      ${inter.secondary.map(it => {
          const cls = this.getInteractionClass(it);
          const st = this.getInteractionStyle(it);
          const info = this.getInteractionTooltipData(it);
          const titleAttr = info ? `${info.title} - ${info.meaning}`.replace(/"/g, '&quot;') : '';
          const cleanIt = it.replace(/"/g, '&quot;');
          return `<div class="interaction-item ${cls}" style="${st}" data-interaction-text="${cleanIt}" title="${titleAttr}">${it}</div>`;
        }).join('')}
                    ` : ''}
                  </td>
                `;
      }).join('')}
            </tr>
          </tbody>
        </table>
      `;

      container.innerHTML = html;
    },

    renderExpertSuite: function () {
      if (!this.currentChart) return;
      const c = this.currentChart;

      // 0. Render Professional 6-Column Master Four Pillars Table
      this.renderMasterFourPillarsMatrix();

      // 1. Render Shen Sha Table
      const shenshaContainer = document.getElementById('baziExpertShenShaTable');
      if (shenshaContainer) {
        const pKeys = ['year', 'month', 'day', 'hour'];
        const pNames = {
          year: 'เสาปี (บรรพบุรุษ/วัยเด็ก 0-16 ปี)',
          month: 'เสาเดือน (การงาน/พ่อแม่ 17-32 ปี)',
          day: 'เสาวัน (ตัวตน/คู่ครอง 33-48 ปี)',
          hour: 'เสายาม (บริวาร/อนาคต 49+ ปี)'
        };

        shenshaContainer.innerHTML = `
          <table class="expert-matrix-table">
            <thead>
              <tr>
                <th style="width: 25%;">เสาชะตา</th>
                <th style="width: 20%;">กิ่งดิน (Branch)</th>
                <th style="width: 55%;">เทพและดาวชะตา (神煞) ที่สถิตอยู่</th>
              </tr>
            </thead>
            <tbody>
              ${pKeys.map(k => {
          const p = c.pillars[k];
          const stars = p.stars;
          const starsHtml = stars.length > 0
            ? stars.map(s => `<div style="margin-bottom: 4px;"><strong style="color: #7c3aed;">★ ${s.name}</strong>: <span style="color: #475569;">${s.desc}</span></div>`).join('')
            : '<span class="text-muted" style="color: #94a3b8;">- ราบรื่น ไม่มีดาวอิทธิพลรุนแรง -</span>';

          return `
                  <tr>
                    <td><strong>${pNames[k]}</strong></td>
                    <td><strong style="color: ${ELEMENTS_META[p.branch.element].color}; font-size: 16px;">${p.branch.zh}</strong> (${p.branch.py} • ${p.branch.zodiac})</td>
                    <td>${starsHtml}</td>
                  </tr>
                `;
        }).join('')}
            </tbody>
          </table>
        `;
      }

      // 3. Render Interactions List
      const interactionsContainer = document.getElementById('baziExpertInteractionsList');
      if (interactionsContainer) {
        const interactions = this.analyzeInteractions(c);
        if (interactions.length === 0) {
          interactionsContainer.innerHTML = '<div style="padding: 16px; text-align: center; color: #64748b;">ไม่มีการปะทะหรือฮะรุนแรงใน 4 เสาชะตา ผังดวงค่อนข้างมีเสถียรภาพสูง</div>';
        } else {
          interactionsContainer.innerHTML = interactions.map(it => `
            <div class="interaction-item type-${it.type}">
              <div class="interaction-icon">${it.icon}</div>
              <div class="interaction-body">
                <strong>${it.title}</strong>
                <div>${it.desc}</div>
                <div style="font-size: 11.5px; color: #64748b; margin-top: 3px;">💡 <em>คำแนะนำ: ${it.advice}</em></div>
              </div>
            </div>
          `).join('');
        }
      }

      // 4. Render Formula Breakdown
      const formulaContainer = document.getElementById('baziExpertFormulaBreakdown');
      if (formulaContainer) {
        const dm = c.dayMaster;
        const resElem = Object.keys(ELEMENTS_META).find(k => ELEMENTS_META[k].generates === dm.element);
        const dmScore = c.elementScores[dm.element].toFixed(1);
        const resScore = c.elementScores[resElem].toFixed(1);
        const total = Object.values(c.elementScores).reduce((a, b) => a + b, 0).toFixed(1);

        formulaContainer.innerHTML = `
          <div class="formula-card">
            <div class="formula-card-title">
              <i class="fa-solid fa-scale-balanced" style="color: #7c3aed;"></i> 1. เกณฑ์คำนวณกำลังดิถี (旺衰 / Wang Shuai)
            </div>
            <div>
              คำนวณจากน้ำหนัก <strong>ก้านฟ้า (Stem = 1.0 แต้ม)</strong> + <strong>กิ่งดินแฝง (Hidden Stem weight x 1.5 แต้ม)</strong>
            </div>
            <div class="formula-box">
              Support = ดิถี (${dm.zh} ${dmScore}) + ธาตุแม่ (${ELEMENTS_META[resElem].zh} ${resScore}) = ${(parseFloat(dmScore) + parseFloat(resScore)).toFixed(1)} / ${total}
              คิดเป็น: ${c.supportPercentage}% (เกณฑ์ดิถีแข็ง >= 46%) -> ผลสรุป: ${c.strengthText}
            </div>
            <div style="color: #64748b; font-size: 11.5px;">
              *เกณฑ์ตัด 46% เป็นมาตรฐานคัมภีร์หยวนไห่จื่อผิงในการแบ่งดิถีแข็ง (身強) หรือดิถีอ่อน (身弱)
            </div>
          </div>

          <div class="formula-card">
            <div class="formula-card-title">
              <i class="fa-solid fa-temperature-arrow-up" style="color: #0284c7;"></i> 2. เกณฑ์ปรับอุณหภูมิดวง (調候 / Tiao Hou)
            </div>
            <div>
              อ้างอิงคัมภีร์ <strong>เฉียงทงเป่าเจี้ยน (窮通寶鑑)</strong> & <strong>ตีเทียนสุ่ย (滴天髓)</strong>
            </div>
            <div class="formula-box">
              เดือนเกิด: ${c.pillars.month.branch.zh} (${c.pillars.month.branch.season}) • สภาพดวง: ${c.elementPercentages.water <= 8 ? 'แห้งแล้ง (燥局)' : (c.elementPercentages.fire <= 8 ? 'หนาวเย็น (寒局)' : 'สมดุล')}
              ธาตุปรับดวง (調候用神): ${ELEMENTS_META[c.tiaoHou.element].th} (${c.tiaoHou.role})
            </div>
            <div style="color: #64748b; font-size: 11.5px;">
              *หลักวิชาปาจื่อ "調候為先" ธาตุปรับดวงมีความสำคัญสูงสุด จะไม่ถูกจัดเป็นธาตุให้โทษเด็ดขาด
            </div>
          </div>

          <div class="formula-card">
            <div class="formula-card-title">
              <i class="fa-solid fa-landmark" style="color: #10b981;"></i> 3. โครงสร้างดวงชะตา (格局 / Ge Ju)
            </div>
            <div>
              วิเคราะห์จากพลังกิ่งดินเสาเดือน (月令司令) และการทะลุขึ้นก้านฟ้า (透干)
            </div>
            <div class="formula-box">
              เก๋อประจำดวง: ${this.getPatternStructure(c).name}
              แกนหลัก: ${this.getPatternStructure(c).god.zh} (${this.getPatternStructure(c).god.th})
            </div>
            <div style="color: #64748b; font-size: 11.5px;">
              ${this.getPatternStructure(c).desc}
            </div>
          </div>
        `;
      }

      // 5. Run active query for principles desk (6 topics)
      this.runExpertQuery(this.activeExpertQuery || 'geju');

      // 6. Attach enter key and button click listeners for BaZi Oracle AI
      const customInput = document.getElementById('baziExpertCustomInput');
      if (customInput && !customInput._hasEnterListener) {
        customInput._hasEnterListener = true;
        customInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.runCustomExpertQuery();
          }
        });
      }

      const customRunBtn = document.getElementById('baziRunCustomQueryBtn');
      if (customRunBtn && !customRunBtn._hasClickListener) {
        customRunBtn._hasClickListener = true;
        customRunBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.runCustomExpertQuery();
        });
      }
    },

    fillAndRunCustomQuery: function (text) {
      const inputEl = document.getElementById('baziExpertCustomInput');
      if (inputEl) {
        inputEl.value = text;
      }
      this.runCustomExpertQuery();
    },

    runExpertQuery: function (queryType) {
      this.activeExpertQuery = queryType;
      document.querySelectorAll('.expert-chip').forEach(btn => btn.classList.remove('active'));

      const idMap = {
        geju: 'btnQueryGeju',
        tiaohou: 'btnQueryTiaohou',
        interactions: 'btnQueryInteractions',
        shensha: 'btnQueryShensha',
        dayun_year: 'btnQueryDayunYear',
        huasha: 'btnQueryHuasha'
      };
      const activeBtn = document.getElementById(idMap[queryType]);
      if (activeBtn) activeBtn.classList.add('active');

      const resultBox = document.getElementById('baziExpertPrinciplesResult') || document.getElementById('baziExpertQueryResult');
      if (!resultBox || !this.currentChart) return;
      const c = this.currentChart;

      let title = '';
      let tag = '';
      let content = '';

      switch (queryType) {
        case 'geju': {
          const geju = this.getPatternStructure(c);
          title = `<i class="fa-solid fa-landmark" style="color: #7c3aed;"></i> วิเคราะห์โครงสร้างดวงชะตา (格局 - BaZi Pattern)`;
          tag = geju.name;
          content = `
            <div class="expert-point-card">
              <strong>🏛️ โครงสร้างหลัก: ${geju.name}</strong>
              <p>${geju.desc}</p>
            </div>
            <div class="expert-point-card">
              <strong>🔍 ที่มาของพลังเก๋อ:</strong>
              <p>เกิดในเดือนสารท <strong>${geju.monthBranch} (เสาเดือน)</strong> ซึ่งมีพลังแฝงของ <strong>${geju.god.zh} (${geju.god.th})</strong> กุมอำนาจ${geju.penetratedStem ? ` และทะลุขึ้นก้านฟ้า ${geju.penetratedStem} อย่างสง่างาม (透干成格)` : ''} ทำให้มีบุคลิกภาพ ความคิด และการตัดสินใจในชีวิตถูกนำทางด้วยคุณลักษณะของ ${geju.god.th} เป็นหลัก</p>
            </div>
            <div class="expert-point-card">
              <strong>⚖️ สภาวะความสมบูรณ์ของเก๋อ (成格 vs 破格):</strong>
              <p>ดวงนี้มีพลังค้ำยันที่ดี หากควบคุมมิให้มีธาตุปรปักษ์มาทำลายเก๋อ จะสามารถสั่งสมทรัพย์สิน เกียรติยศ และสร้างผลงานที่ยิ่งใหญ่ในสายงานของตนได้อย่างมั่นคง</p>
            </div>
          `;
          break;
        }

        case 'tiaohou': {
          const th = c.tiaoHou;
          title = `<i class="fa-solid fa-temperature-half" style="color: #0284c7;"></i> หลักการเตี้ยวโฮ่ว & วั่งซ่วย (調候 & 旺衰 Theory)`;
          tag = `ธาตุปรับดวง: ${ELEMENTS_META[th.element].th}`;
          content = `
            <div class="expert-point-card">
              <strong>🌡️ บทวิเคราะห์เตี้ยวโฮ่ว (調候分析):</strong>
              <p>${th.reason}</p>
            </div>
            <div class="expert-point-card">
              <strong>📊 การประเมินกำลังดิถี (旺衰分析):</strong>
              <p>ดิถี ${c.dayMaster.zh} (${c.dayMaster.th}) มีคะแนนพลังเกื้อหนุน ${c.supportPercentage}% จัดเป็น <strong>${c.strengthText}</strong> ซึ่งในทางทฤษฎีทั่วไปอาจมองแค่เสริมไฟ/ไม้ แต่เมื่อพิจารณาภูมิอากาศเดือนเกิด คัมภีร์ตีเทียนสุ่ยระบุว่า <em>"丁火柔中... 合壬而傾"</em> ไฟดวงประทีปต้องการ <strong>ธาตุน้ำ</strong> ส่องประกายและชโลมดวง</p>
            </div>
            <div class="expert-point-card">
              <strong>🎯 บทสรุปทางวิชาการ:</strong>
              <p>การนำ <strong>${ELEMENTS_META[th.element].th}</strong> มาใช้เป็นธาตุปรับดวง จะช่วยเปิดทางให้ดวงชะตาคลี่คลายความตึงเครียด อารมณ์แจ่มใส มีสติปัญญาตกผลึก และเสริมสร้างดาวกัวสัวะ (หน้าที่การงาน/บารมี) ให้โดดเด่นยิ่งขึ้น</p>
            </div>
          `;
          break;
        }

        case 'interactions': {
          const interactions = this.analyzeInteractions(c);
          title = `<i class="fa-solid fa-bolt" style="color: #ef4444;"></i> ตรวจสอบจุดปะทะ / ฮะ / ซิ้ง / ไฮ่ ในดวงชะตา`;
          tag = `พบ ${interactions.length} จุดปฏิสัมพันธ์`;
          content = interactions.length > 0 ? interactions.map(it => `
            <div class="expert-point-card" style="border-left-color: ${it.type === 'clash' ? '#ef4444' : '#10b981'};">
              <strong>${it.icon} ${it.title}</strong>
              <p>${it.desc}</p>
              <div style="font-size: 12px; color: #64748b;"><strong>แนวทางรับมือ:</strong> ${it.advice}</div>
            </div>
          `).join('') : '<p>ดวงนี้ไม่มีการปะทะหรือฮะรุนแรง โครงสร้างค่อนข้างมีเสถียรภาพและสงบนิ่ง</p>';
          break;
        }

        case 'shensha': {
          title = `<i class="fa-solid fa-star" style="color: #f59e0b;"></i> รวมดาวเทพและดาวเคราะห์สำคัญ (神煞大全)`;
          tag = `ดาวชะตาประจำ 4 เสา`;
          content = `
            <div class="expert-point-card">
              <strong>🌟 ดาวเทียนอี่กุ้ยเหริน (天乙貴人 - ผู้อุปถัมภ์สวรรค์):</strong>
              <p>เป็นยอดดาวมงคลอันดับหนึ่ง สถิตในดวงช่วยให้แคล้วคลาดจากภยันตราย มีผู้ใหญ่ ครูบาอาจารย์ หรือกัลยาณมิตรยื่นมือเข้าช่วยเหลือเสมอในยามวิกฤต</p>
            </div>
            <div class="expert-point-card">
              <strong>📖 ดาวบุ๋นชัง (文昌貴人 - ปัญญาบัณฑิต):</strong>
              <p>ดาวแห่งปัญญา การเรียนรู้ การสอบแข่งขัน ไหวพริบ และศาสตร์วิชาการ ทำให้เป็นคนเรียนรู้อะไรได้รวดเร็ว ลึกซึ้ง และมีพรสวรรค์ในการถ่ายทอดความรู้</p>
            </div>
            <div class="expert-point-card">
              <strong>🐎 ดาวอี้หม่า (驛馬星 - ม้าสวรรค์):</strong>
              <p>ดาวแห่งการเดินทางไกล การเคลื่อนไหว และการค้าต่างแดน ทำให้มีโอกาสประสบความสำเร็จสูงหากได้เดินทาง ออกนอกพื้นที่ หรือทำงานที่ต้องปรับตัวตลอดเวลา</p>
            </div>
            <div class="expert-point-card">
              <strong>👑 ดาวเจี้ยงซิ้ง (將星 - แม่ทัพ):</strong>
              <p>ดาวแห่งอำนาจบารมี ความเป็นผู้นำ และการสั่งการ ช่วยเสริมความหนักแน่นและความน่าเชื่อถือในการปกครองบริวาร</p>
            </div>
          `;
          break;
        }

        case 'dayun_year': {
          const dy = c.daYunPillars.find(d => d.isCurrent) || c.daYunPillars[0];
          title = `<i class="fa-solid fa-timeline" style="color: #7c3aed;"></i> เจาะลึกวัยจรปัจจุบัน & ปีจร 2026`;
          tag = `ช่วงอายุ ${dy.ageRange} (${dy.stem.zh}${dy.branch.zh})`;
          content = `
            <div class="expert-point-card">
              <strong>⏳ วัยจร 10 ปี (${dy.stem.zh}${dy.branch.zh} - ${dy.tenGod.zh}):</strong>
              <p>กำลังเดินวัยจร <strong>${dy.stem.zh}${dy.branch.zh} (${dy.stem.py} ${dy.branch.py})</strong> ซึ่งมีสิบลักษณ์เป็น <strong>${dy.tenGod.zh} (${dy.tenGod.th})</strong> เป็นช่วงเวลาแห่งการพัฒนาศักยภาพครั้งใหญ่ ท้าทาย แต่เปิดโอกาสให้อำนาจบารมีเติบโตสูงสุด</p>
            </div>
            <div class="expert-point-card">
              <strong>🔥 ความสัมพันธ์กับปีจร 2026 (丙午 - ม้าไฟ):</strong>
              <p>ปี 2026 เป็นปีธาตุไฟบริสุทธิ์ (丙午) กิ่งฟ้าเป็น 丙 (ช่วงชิงทรัพย์/พี่น้องมิตรภาพ) กิ่งดินเป็น 午 (ไฟม้า) ช่วยเพิ่มกำลังวังชาให้ดิถี ${c.dayMaster.zh} มีพลังรุกไปข้างหน้า กล้าตัดสินใจ และมีคนร่วมอุดมการณ์มากมาย</p>
            </div>
          `;
          break;
        }

        case 'huasha': {
          title = `<i class="fa-solid fa-shield-halved" style="color: #10b981;"></i> หลักการแก้ดวง & พลิกวิกฤต (化煞指南)`;
          tag = `การปรับสมดุลธาตุ & ฮวงจุ้ย`;
          content = `
            <div class="expert-point-card">
              <strong>💧 1. ใช้น้ำชโลมดวง (เตี้ยวโฮ่ว):</strong>
              <p>จัดโต๊ะทำงานให้หันไปทาง <strong>ทิศเหนือ</strong> หรือมีน้ำพุ/ตู้ปลา/น้ำสะอาดวางอยู่ทางทิศเหนือเพื่อหมุนเวียนพลัง และใช้เครื่องแต่งกายสีฟ้า น้ำเงิน ดำ เพื่อเสริมความเยือกเย็นรอบคอบ</p>
            </div>
            <div class="expert-point-card">
              <strong>🌿 2. ใช้ธาตุไม้เป็นสะพานเชื่อม (通關):</strong>
              <p>หากมีจุดปะทะระหว่างทองกับไม้ ให้ใช้ธาตุน้ำเพื่อดูดซับแรงกระแทกจากทอง แล้วส่งต่อพลังไปสร้างไม้ ทำให้ความขัดแย้งเปลี่ยนเป็นความคิดสร้างสรรค์และโอกาสใหม่ๆ</p>
            </div>
            <div class="expert-point-card">
              <strong>🧘 3. การปฏิบัติตนและจิตวิญญาณ:</strong>
              <p>ฝึกสมาธิ การหายใจลึกๆ และหลีกเลี่ยงการตัดสินใจเรื่องใหญ่ในยามอารมณ์ร้อน ดวงนี้เมื่อจิตใจสงบนิ่ง แสงเทียน 丁 จะส่องสว่างสะท้อนผิวน้ำอย่างงดงาม นำพาสู่ความสำเร็จสูงสุด</p>
            </div>
          `;
          break;
        }
      }

      resultBox.innerHTML = `
        <div class="expert-result-header">
          <div class="expert-result-title">${title}</div>
          <span class="expert-result-tag">${tag}</span>
        </div>
        <div class="expert-result-content">
          ${content}
        </div>
      `;
    },

    runCustomExpertQuery: function () {
      const inputEl = document.getElementById('baziExpertCustomInput');
      const resultBox = document.getElementById('baziExpertQueryResult');
      const runBtn = document.getElementById('baziRunCustomQueryBtn');
      if (!resultBox || !this.currentChart) return;

      const c = this.currentChart;
      const rawQ = inputEl ? inputEl.value.trim() : '';
      const q = rawQ.toLowerCase();

      // Ensure result box is visible and trigger smooth animation
      resultBox.style.display = 'block';
      resultBox.classList.remove('expert-result-animate');
      void resultBox.offsetWidth;
      resultBox.classList.add('expert-result-animate');

      if (runBtn) {
        runBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> คำนวณวิเคราะห์';
        runBtn.disabled = false;
      }

      // ตรวจสอบกรณีไม่ได้พิมพ์คำถาม
      if (!rawQ) {
        resultBox.innerHTML = `
          <div class="expert-result-header" style="border-bottom: 1px solid rgba(124, 58, 237, 0.25);">
            <div class="expert-result-title" style="color: #7c3aed;">
              <i class="fa-solid fa-wand-magic-sparkles" style="color: #7c3aed;"></i> พร้อมคำนวณและทำนายดวงชะตาตามศาสตร์ปาจื่อ
            </div>
            <span class="expert-result-tag" style="background: rgba(124, 58, 237, 0.12); color: #7c3aed;">กรุณาพิมพ์คำถาม</span>
          </div>
          <div class="expert-verdict-banner" style="background: linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(168, 85, 247, 0.04) 100%); border: 1px solid rgba(124, 58, 237, 0.3);">
            <div class="verdict-left">
              <div class="verdict-icon">🔮</div>
              <div>
                <div class="verdict-text-main" style="color: #5b21b6;">กรุณาระบุคำถามที่ต้องการให้ AI วิเคราะห์</div>
                <div class="verdict-text-sub">พิมพ์คำถามในช่องด้านบน หรือคลิกเลือก <strong>"คำถามยอดนิยม"</strong> เพื่อเริ่มคำนวณตามหลักวิชาปาจื่อ</div>
              </div>
            </div>
          </div>
          <div class="expert-point-card" style="border-left-color: #7c3aed; background: #faf5ff;">
            <strong style="color: #6b21a8;">🎯 คำถามตัวอย่างที่สามารถคำนวณตามหลักวิชาปาจื่อ (คลิกเพื่อเลือกถามทันที):</strong>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
              <div>• <strong>เรื่องการงาน/โยกย้าย:</strong> <a href="javascript:void(0)" onclick="window.BaziApp.fillAndRunCustomQuery('สิ้นปีนี้มีเปลี่ยนงานหรือไม่')" style="color: #7c3aed; font-weight: 600; text-decoration: underline;">"สิ้นปีนี้มีเปลี่ยนงานหรือไม่"</a></div>
              <div>• <strong>เรื่องการเงิน/โชคลาภ:</strong> <a href="javascript:void(0)" onclick="window.BaziApp.fillAndRunCustomQuery('ปีนี้มีเกณฑ์การเงินและโชคลาภอย่างไร')" style="color: #7c3aed; font-weight: 600; text-decoration: underline;">"ปีนี้มีเกณฑ์การเงินและโชคลาภอย่างไร"</a></div>
              <div>• <strong>เรื่องความรัก/คู่ครอง:</strong> <a href="javascript:void(0)" onclick="window.BaziApp.fillAndRunCustomQuery('จังหวะความรักและคู่ครองเป็นอย่างไร')" style="color: #7c3aed; font-weight: 600; text-decoration: underline;">"จังหวะความรักและคู่ครองเป็นอย่างไร"</a></div>
              <div>• <strong>เรื่องสุขภาพ/ระวังตัว:</strong> <a href="javascript:void(0)" onclick="window.BaziApp.fillAndRunCustomQuery('สุขภาพและอวัยวะที่ต้องระวังปีนี้')" style="color: #7c3aed; font-weight: 600; text-decoration: underline;">"สุขภาพและอวัยวะที่ต้องระวังปีนี้"</a></div>
              <div>• <strong>ระบุปีเฉพาะเจาะจง:</strong> <a href="javascript:void(0)" onclick="window.BaziApp.fillAndRunCustomQuery('ปี 2027 ดวงชะตาเป็นอย่างไร')" style="color: #7c3aed; font-weight: 600; text-decoration: underline;">"ปี 2027 ดวงชะตาเป็นอย่างไร"</a></div>
            </div>
          </div>
        `;
        return;
      }

      // 1. ตรวจสอบความชัดเจนของคำถาม (ถ้าคำถามไม่ชัดเจน ไม่สามารถวิเคราะห์ได้ ให้ถามกลับ)
      const hasCareer = /งาน|เปลี่ยนงาน|ย้ายงาน|ลาออก|โยกย้าย|เลื่อนตำแหน่ง|ตกงาน|สิ้นปี|ปลายปี|บริษัท|สอบ|ราชการ|ทำงาน|อาชีพ|ธุรกิจ|ค้าขาย|กิจการ|career|job|ย้าย|ตำแหน่ง/.test(q);
      const hasWealth = /เงิน|รวย|ทรัพย์|โชค|ลาภ|หนี้|ลงทุน|หุ้น|คริปโต|กำไร|ขาดทุน|บ้าน|รถ|ทอง|wealth|money|รายได้|การเงิน|ค้าขาย/.test(q);
      const hasLove = /รัก|แฟน|คู่|แต่งงาน|หมั้น|เลิก|หย่า|โสด|คนคุย|ชู้|ครอบครัว|love|marry|คนรัก|เนื้อคู่|ความรัก/.test(q);
      const hasHealth = /สุขภาพ|ป่วย|โรค|ผ่าตัด|เลือด|สายตา|กระเพาะ|ไต|หัวใจ|นอน|เครียด|หมอ|health|sick|ปอด|ตับ|ร่างกาย/.test(q);
      const hasTimingOrDestiny = /(20\d\d|25\d\d|ปีนี้|ปีหน้า|ปีที่แล้ว|ชะตา|ดวง|เคราะห์|เกณฑ์|อนาคต|วาสนา|destiny|ภาพรวม)/.test(q);

      const isUnclear = rawQ.length < 2
        || /^[\d\s.,!?@#$%^&*()_+\-=\[\]{};':"\\|<>\/]+$/.test(rawQ)
        || /^(55+|ฮ่า+|555|abc|test|ทดสอบ|อะไร|ยังไง|ดีไหม|ดูดวง|หมอดู|ก|ข|ค|ไก่|hello|hi|สวัสดี)$/i.test(rawQ)
        || (!hasCareer && !hasWealth && !hasLove && !hasHealth && !hasTimingOrDestiny);

      if (isUnclear) {
        resultBox.innerHTML = `
            <div class="expert-result-header" style="border-bottom: 1px solid rgba(245, 158, 11, 0.25);">
              <div class="expert-result-title" style="color: #b45309;">
                <i class="fa-solid fa-circle-question" style="color: #f59e0b;"></i> คำถามยังไม่ชัดเจนเพียงพอสำหรับการคำนวณปาจื่อ
              </div>
              <span class="expert-result-tag" style="background: rgba(245, 158, 11, 0.12); color: #b45309;">กรุณาระบุประเด็นเพิ่มเติม</span>
            </div>
            <div class="expert-verdict-banner" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(251, 191, 36, 0.04) 100%); border: 1px solid rgba(245, 158, 11, 0.3);">
              <div class="verdict-left">
                <div class="verdict-icon">💡</div>
                <div>
                  <div class="verdict-text-main" style="color: #92400e;">ระบบยังไม่สามารถวิเคราะห์ได้ เนื่องจากข้อความสั้นหรือคลุมเครือเกินไป</div>
                  <div class="verdict-text-sub">กรุณาระบุ <strong>เรื่องที่ต้องการถาม</strong> (เช่น การงาน/เปลี่ยนงาน, การเงิน, ความรัก, สุขภาพ) และ <strong>ช่วงเวลาหรือปีที่สนใจ</strong></div>
                </div>
              </div>
            </div>
            <div class="expert-point-card" style="border-left-color: #f59e0b; background: #fffbeb;">
              <strong style="color: #92400e;">🎯 ตัวอย่างคำถามที่สามารถคำนวณและทำนายได้อย่างแม่นยำ (คลิกเพื่อเลือกถามทันที):</strong>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
                <div>• <strong>เรื่องการงาน/โยกย้าย:</strong> <a href="javascript:void(0)" onclick="window.BaziApp.fillAndRunCustomQuery('สิ้นปีนี้มีเปลี่ยนงานหรือไม่')" style="color: #7c3aed; font-weight: 600; text-decoration: underline;">"สิ้นปีนี้มีเปลี่ยนงานหรือไม่"</a></div>
                <div>• <strong>เรื่องการเงิน/โชคลาภ:</strong> <a href="javascript:void(0)" onclick="window.BaziApp.fillAndRunCustomQuery('ปีนี้มีเกณฑ์การเงินและโชคลาภอย่างไร')" style="color: #7c3aed; font-weight: 600; text-decoration: underline;">"ปีนี้มีเกณฑ์การเงินและโชคลาภอย่างไร"</a></div>
                <div>• <strong>เรื่องความรัก/คู่ครอง:</strong> <a href="javascript:void(0)" onclick="window.BaziApp.fillAndRunCustomQuery('จังหวะความรักและคู่ครองเป็นอย่างไร')" style="color: #7c3aed; font-weight: 600; text-decoration: underline;">"จังหวะความรักและคู่ครองเป็นอย่างไร"</a></div>
                <div>• <strong>เรื่องสุขภาพ/ระวังตัว:</strong> <a href="javascript:void(0)" onclick="window.BaziApp.fillAndRunCustomQuery('สุขภาพและอวัยวะที่ต้องระวังปีนี้')" style="color: #7c3aed; font-weight: 600; text-decoration: underline;">"สุขภาพและอวัยวะที่ต้องระวังปีนี้"</a></div>
                <div>• <strong>ระบุปีเฉพาะเจาะจง:</strong> <a href="javascript:void(0)" onclick="window.BaziApp.fillAndRunCustomQuery('ปี 2027 ดวงชะตาเป็นอย่างไร')" style="color: #7c3aed; font-weight: 600; text-decoration: underline;">"ปี 2027 ดวงชะตาเป็นอย่างไร"</a></div>
              </div>
            </div>
          `;
        return;
      }

      // 2. ตรวจสอบปีเป้าหมายจากข้อความคำถาม
      let simY = this.selectedYear || new Date().getFullYear() || 2026;
      const beMatch = q.match(/(?:ปี\s*|พ\.ศ\.\s*)?(25\d{2})/);
      const ceMatch = q.match(/(?:ปี\s*)?(20\d{2})/);
      if (ceMatch) {
        simY = parseInt(ceMatch[1], 10);
      } else if (beMatch) {
        simY = parseInt(beMatch[1], 10) - 543;
      } else if (q.includes('ปีหน้า')) {
        simY = (new Date().getFullYear() || 2026) + 1;
      } else if (q.includes('ปีที่แล้ว')) {
        simY = (new Date().getFullYear() || 2026) - 1;
      }

      // คำนวณหลักปีจรเป้าหมาย (Tai Sui)
      const sIdx = ((simY - 4) % 10 + 10) % 10;
      const bIdx = ((simY - 4) % 12 + 12) % 12;
      const simStem = STEMS[sIdx];
      const simBranch = BRANCHES[bIdx];
      const simStemGod = getTenGod(c.dayMaster, simStem);
      const simBranchMainStem = STEMS.find(s => s.zh === simBranch.hidden[0].stem) || simStem;
      const simBranchGod = getTenGod(c.dayMaster, simBranchMainStem);
      const simNaYin = getNaYin(sIdx, bIdx);

      // คำนวณวัยจรเป้าหมาย (Active Da Yun for simY)
      const birthYear = c.birthDateString ? parseInt(c.birthDateString.split('-')[0], 10) : new Date().getFullYear();
      const ageInYear = simY - birthYear;
      let curDaYun = (c.daYunPillars || []).find(d => ageInYear >= d.ageFrom && ageInYear <= d.ageTo);
      if (!curDaYun && c.daYunPillars && c.daYunPillars.length > 0) {
        if (ageInYear < c.daYunPillars[0].ageFrom) {
          curDaYun = {
            ageRange: `0 - ${c.daYunPillars[0].ageFrom - 1} ปี (วัยเยาว์ก่อนเข้าวัยจร)`,
            stem: c.pillars.month.stem,
            branch: c.pillars.month.branch,
            tenGod: c.pillars.month.tenGod,
            naYin: c.pillars.month.naYin
          };
        } else {
          curDaYun = c.daYunPillars[c.daYunPillars.length - 1];
        }
      }

      // คำนวณการปะทะ / สมพงศ์ ระหว่างปีจรกับพื้นดวง 4 เสา
      const clashMonth = checkBranchClash(simBranch.zh, c.pillars.month.branch.zh);
      const clashDay = checkBranchClash(simBranch.zh, c.pillars.day.branch.zh);
      const clashYear = checkBranchClash(simBranch.zh, c.pillars.year.branch.zh);
      const clashHour = checkBranchClash(simBranch.zh, c.pillars.hour.branch.zh);

      const harmMonth = checkBranchHarmony(simBranch.zh, c.pillars.month.branch.zh);
      const harmDay = checkBranchHarmony(simBranch.zh, c.pillars.day.branch.zh);
      const harmYear = checkBranchHarmony(simBranch.zh, c.pillars.year.branch.zh);
      const harmHour = checkBranchHarmony(simBranch.zh, c.pillars.hour.branch.zh);

      const dyClash = curDaYun ? checkBranchClash(simBranch.zh, curDaYun.branch.zh) : null;
      const dyHarm = curDaYun ? checkBranchHarmony(simBranch.zh, curDaYun.branch.zh) : null;

      // คำนวณดาวจรและดาวในผัง
      const monthHasYiMa = (c.pillars.month.stars || []).some(s => s.name.includes('驛馬'));
      const dayHasYiMa = (c.pillars.day.stars || []).some(s => s.name.includes('驛馬'));
      const yiMaMap = {
        '申': '寅', '子': '寅', '辰': '寅',
        '寅': '申', '午': '申', '戌': '申',
        '巳': '亥', '酉': '亥', '丑': '亥',
        '亥': '巳', '卯': '巳', '未': '巳'
      };
      const isYearYiMa = (yiMaMap[c.pillars.year.branch.zh] === simBranch.zh || yiMaMap[c.pillars.day.branch.zh] === simBranch.zh);
      const monthHasTianYi = (c.pillars.month.stars || []).some(s => s.name.includes('天乙'));
      const dayHasWenChang = (c.pillars.day.stars || []).some(s => s.name.includes('文昌'));
      const dayHasTaoHua = (c.pillars.day.stars || []).some(s => s.name.includes('桃花'));

      // คำนวณ 12 สารทของปีเป้าหมายจริง
      const allMonths = BaziEngine.calculateMonthlyFortune(c, simY);
      let selectedMonths = [];
      let timelineLabel = '';
      if (q.includes('สิ้นปี') || q.includes('ปลายปี')) {
        selectedMonths = allMonths.slice(8, 12);
        timelineLabel = `ไทม์ไลน์สารท 4 เดือนปลายปี ${simY} (เจาะลึกจุดเปลี่ยนสำคัญ)`;
      } else if (q.includes('ต้นปี')) {
        selectedMonths = allMonths.slice(0, 4);
        timelineLabel = `ไทม์ไลน์สารท 4 เดือนต้นปี ${simY} (จังหวะการเริ่มต้น)`;
      } else if (q.includes('กลางปี')) {
        selectedMonths = allMonths.slice(4, 8);
        timelineLabel = `ไทม์ไลน์สารท 4 เดือนกลางปี ${simY} (จังหวะขับเคลื่อน)`;
      } else {
        selectedMonths = [allMonths[0], allMonths[3], allMonths[7], allMonths[10]].filter(Boolean);
        if (selectedMonths.length < 4) selectedMonths = allMonths.slice(0, 4);
        timelineLabel = `ไทม์ไลน์สารท 4 ไตรมาสหลักของปี ${simY}`;
      }

      let topicTitle = '';
      let verdictBanner = '';
      let topicAnalysis = '';

      // แยกประเภทประเด็นคำถาม
      const isJobChangeQuery = /เปลี่ยนงาน|ย้ายงาน|ลาออก|โยกย้าย|ย้ายหน้าที่|ย้ายสายงาน/.test(q) || (/งาน/.test(q) && /สิ้นปี|ปลายปี|เปลี่ยน|ย้าย/.test(q));
      const isWealthQuery = /เงิน|รวย|ทรัพย์|โชค|ลาภ|หนี้|ลงทุน|หุ้น|คริปโต|ทอง|ค้าขาย|กำไร/.test(q);
      const isLoveQuery = /รัก|แฟน|คู่|แต่งงาน|หมั้น|เลิก|หย่า|โสด|คนคุย|คู่ครอง|เนื้อคู่/.test(q);
      const isHealthQuery = /สุขภาพ|ป่วย|โรค|ผ่าตัด|เลือด|สายตา|กระเพาะ|ไต|หัวใจ|ปอด|ตับ|เครียด/.test(q);

      if (isJobChangeQuery) {
        // --- หมวดเปลี่ยนงาน / โยกย้าย ---
        let prob = 48;
        if (clashMonth) prob += 24;
        if (monthHasYiMa || isYearYiMa) prob += 16;
        if (simStemGod.zh === '傷官' || simStemGod.zh === '七殺') prob += 14;
        if (harmMonth) prob += 10;
        if (dyClash) prob += 10;
        if (checkBranchClash(c.pillars.year.branch.zh, c.pillars.month.branch.zh)) prob += 8;
        prob = Math.min(94, Math.max(32, prob));

        const peakMonth = selectedMonths.find(m => m.ratingType === 'clash') || selectedMonths[2] || selectedMonths[0];
        topicTitle = `คำนวณปาจื่อเจาะลึก: เกณฑ์การเปลี่ยนงาน & โยกย้ายหน้าที่ช่วง${q.includes('สิ้นปี') ? 'สิ้นปี ' : ''}${simY}`;

        verdictBanner = `
            <div class="expert-verdict-banner">
              <div class="verdict-left">
                <div class="verdict-icon">🐎</div>
                <div>
                  <div class="verdict-text-main">คำวินิจฉัยปาจื่อ: มีเกณฑ์เปลี่ยนงานหรือโยกย้ายหน้าที่รับผิดชอบ ${prob >= 75 ? 'สูงมาก (ฟันธงตามผังดวง)' : 'ปานกลาง (มีโอกาสปรับบทบาท)'}</div>
                  <div class="verdict-text-sub">ช่วงเวลาที่มีแรงส่งและโอกาสสูงสุด: <strong>${peakMonth ? ((peakMonth.title || peakMonth.solarTh || peakMonth.labelDate || '').split('(')[0].trim() || 'ช่วงปลายปี') : 'ช่วงปลายปี'} ${simY} (${peakMonth ? peakMonth.stem.zh + peakMonth.branch.zh : ''})</strong></div>
                </div>
              </div>
              <div class="verdict-prob-badge" style="background: ${prob >= 75 ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' : '#2563eb'};">โอกาสเปลี่ยนงาน ${prob}%</div>
            </div>
          `;

        const natalClashText = checkBranchClash(c.pillars.year.branch.zh, c.pillars.month.branch.zh)
          ? `• <strong>จุดปะทะในดวงเดิม (${c.pillars.year.branch.zh} 沖 ${c.pillars.month.branch.zh}):</strong> เสาปีปะทะเสาเดือน บ่งชี้ว่าสภาพแวดล้อมการทำงานมักมีการปรับเปลี่ยนเพื่อเติบโตสู่ระดับที่สูงขึ้นเสมอ`
          : `• <strong>โครงสร้างเสาเดิม:</strong> เสาเดือนเป็น ${c.pillars.month.stem.zh}${c.pillars.month.branch.zh} มีความมั่นคงในบทบาทเดิม แต่พร้อมขยับขยายเมื่อมีพลังกระตุ้นจากปีจร`;

        topicAnalysis = `
            <div class="expert-point-card">
              <strong>🐎 1. สัญญาณการโยกย้ายในผัง 4 เสาเดิม (Natal Mobility Indicators):</strong>
              <p>• <strong>เสาเดือน (${c.pillars.month.stem.zh}${c.pillars.month.branch.zh} / กุมภพการงาน):</strong> ${monthHasYiMa ? `มีดาว <strong>驛馬 (ม้าสวรรค์)</strong> สถิตอยู่ในกิ่งดิน <strong>${c.pillars.month.branch.zh} (${c.pillars.month.branch.zodiac.split(' ')[0]})</strong> ซึ่งเป็นดาวแห่งการเดินทางไกล การโยกย้ายตำแหน่ง และความคล่องตัวสูง` : `กิ่งดิน ${c.pillars.month.branch.zh} (${c.pillars.month.branch.zodiac.split(' ')[0]}) เป็นฐานการทำงานหลัก มีสิบเทพเป็น ${c.pillars.month.tenGod.zh} (${c.pillars.month.tenGod.th})`}<br>
              ${natalClashText}</p>
            </div>

            <div class="expert-point-card">
              <strong>⚡ 2. ปัจจัยเร่งจากวัยจรปัจจุบัน (${curDaYun ? curDaYun.stem.zh + curDaYun.branch.zh : ''}) และปีจร ${simY} (${simStem.zh}${simBranch.zh}):</strong>
              <p>• <strong>วัยจร ${curDaYun ? `${curDaYun.stem.zh}${curDaYun.branch.zh} (อายุ ${curDaYun.ageRange})` : ''}:</strong> มีสิบเทพเป็น <strong>${curDaYun ? curDaYun.tenGod.zh + ' (' + curDaYun.tenGod.th + ')' : ''}</strong> ${dyClash ? `<span style="color: #ef4444; font-weight: 700;">(มีจุดปะทะกับปีจร ${simBranch.zh}: จุดเปลี่ยนผันใหญ่)</span>` : 'คอยประคับประคองกระแสชีวิต'}<br>
              • <strong>ปีจร ${simY} (${simStem.zh}${simBranch.zh}):</strong> ก้านฟ้าเป็น ${simStem.zh} (${simStemGod.zh} - ${simStemGod.th}) มีบทบาทกระตุ้นดิถี ${c.dayMaster.zh} (${c.dayMaster.element}) ${clashMonth ? `<span style="color: #ef4444; font-weight: 700;">พร้อมมีพลังปะทะเสาการงาน (${simBranch.zh} 沖 ${c.pillars.month.branch.zh})</span> ทำให้เกิดแรงขับดันให้อยากเปลี่ยนบรรยากาศหรือก้าวสู่ความท้าทายใหม่` : 'เสริมสร้างโอกาสความมั่นคง'}</p>
            </div>

            <div class="expert-point-card">
              <strong>📅 3. ${timelineLabel}:</strong>
              <div class="expert-timeline-wrap">
                ${selectedMonths.map((m, idx) => `
                  <div class="expert-timeline-step" ${m.ratingType === 'clash' ? 'style="border-top-color: #ef4444; background: #fff1f2;"' : ''}>
                    <div class="step-time">
                      <span ${m.ratingType === 'clash' ? 'style="color: #e11d48; font-weight: 700;"' : ''}>สารท ${m.labelDate.split(' ')[1]} ${m.ratingType === 'clash' ? '★ พีคสุด' : ''}</span>
                      <span ${m.ratingType === 'clash' ? 'style="color: #e11d48;"' : ''}>${m.branch.zodiac.split(' ')[0]} (${m.stem.zh}${m.branch.zh})</span>
                    </div>
                    <div><strong>${m.stemGod.zh} (${m.stemGod.th}):</strong> ${m.ratingType === 'clash' ? 'จุดเปลี่ยนผ่านสำคัญ มีพลังปะทะกระตุ้นการตัดสินใจเด็ดขาด ยื่นใบลาออกหรือเซ็นสัญญาใหม่' : m.ratingType === 'auspicious' ? 'พลังธาตุเกื้อหนุนดวงชะตา มีผู้ใหญ่ติดต่อยื่นข้อเสนอ หรือสัมภาษณ์ราบรื่น' : 'เจรจาขอบเขตงาน เริ่มวางแผนและเตรียม Portfolio ล่วงหน้า'}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="expert-point-card">
              <strong>💡 4. คำแนะนำเชิงกลยุทธ์สำหรับหมอดู (Astrologer Consultation Guide):</strong>
              <p>1. <strong>ผลลัพธ์ของการย้าย:</strong> ใช้พลังธาตุปรับดวง <strong>${ELEMENTS_META[c.tiaoHou.element].th}</strong> ควบคู่กับธาตุให้คุณ <strong>${c.favorableElements.map(k => ELEMENTS_META[k].th).join(', ')}</strong> หนุนนำให้ได้งานใหม่ที่มีความสุขและเติบโตระยะยาว<br>
              2. <strong>ข้อควรระวัง:</strong> อย่าเพิ่งยื่นใบลาออกด้วยอารมณ์ก่อนมีหนังสือสัญญาตอบรับที่แน่นอน โดยเฉพาะช่วงเดือนที่มีจุดปะทะ ควรเตรียมเอกสารให้พร้อมล่วงหน้า 1-2 เดือน</p>
            </div>
          `;
      } else if (isWealthQuery) {
        // --- หมวดการเงิน / โชคลาภ / ลงทุน ---
        const dmElem = c.dayMaster.element;
        const wealthElem = ELEMENTS_META[dmElem].controls;
        const wealthMeta = ELEMENTS_META[wealthElem];
        const wealthPct = c.elementPercentages[wealthElem] || 0;
        const outputElem = ELEMENTS_META[dmElem].generates;
        const outputMeta = ELEMENTS_META[outputElem];

        let wealthScore = 3.8;
        if (c.favorableElements.includes(simStem.element) || c.favorableElements.includes(simBranch.element)) wealthScore += 0.6;
        if (simStemGod.zh === '正財' || simStemGod.zh === '偏財' || simStemGod.zh === '食神') wealthScore += 0.5;
        if (clashDay || clashMonth) wealthScore -= 0.4;
        wealthScore = Math.min(4.9, Math.max(2.5, wealthScore));

        topicTitle = `คำนวณปาจื่อเจาะลึก: ฐานการเงิน โชคลาภ & การบริหารทรัพย์ปี ${simY}`;
        verdictBanner = `
            <div class="expert-verdict-banner">
              <div class="verdict-left">
                <div class="verdict-icon">💰</div>
                <div>
                  <div class="verdict-text-main">คำวินิจฉัยปาจื่อ: ฐานะการเงินหมุนเวียน ${wealthScore >= 4.0 ? 'คล่องตัวสูง มีเกณฑ์ได้เงินก้อนจากผลงาน' : 'ต้องวางแผนรอบคอบ ป้องกันรายจ่ายจร'}</div>
                  <div class="verdict-text-sub">ธาตุโชคลาภคือ <strong>${wealthMeta.th} (${wealthMeta.zh})</strong> คิดเป็นสัดส่วนในดวงเดิม ${wealthPct}% | ธาตุสร้างโอกาสคือ <strong>${outputMeta.th} (${outputMeta.zh})</strong></div>
                </div>
              </div>
              <div class="verdict-prob-badge" style="background: #10b981;">ดัชนีโชคลาภ ${wealthScore.toFixed(1)}/5</div>
            </div>
          `;

        topicAnalysis = `
            <div class="expert-point-card">
              <strong>💎 1. ศักยภาพการสร้างความมั่งคั่งในดวงเดิม:</strong>
              <p>ดวงนี้มีพลังธาตุโชคลาภ (${wealthMeta.th}) คิดเป็นสัดส่วน <strong>${wealthPct}%</strong> และพลังธาตุผลิตทรัพย์ (${outputMeta.th}) คิดเป็นสัดส่วน <strong>${c.elementPercentages[outputElem] || 0}%</strong> บ่งบอกว่าเป็นคนมีสายตาเฉียบแหลมในการหาโอกาสทางธุรกิจ และมีความสามารถเฉพาะตัวที่เปลี่ยนเป็นมูลค่าได้ดี</p>
            </div>

            <div class="expert-point-card">
              <strong>🔥 2. ผลกระทบจากปีจร ${simY} (${simStem.zh}${simBranch.zh} - ${simStemGod.th}):</strong>
              <p>ในปี ${simY} ก้านฟ้าเป็น ${simStem.zh} (${simStemGod.zh}) ${c.favorableElements.includes(simStem.element) ? 'ซึ่งเป็นธาตุให้คุณ ช่วยเสริมความมั่นใจและการปิดดีลธุรกิจ' : 'ควรระวังเรื่องรายจ่ายจร หรือการลงทุนที่มีความเสี่ยงสูง'} ${clashDay ? '<span style="color: #ef4444; font-weight: 700;">(ปีจรปะทะเสาวัน ควรระวังเรื่องสัญญาทางการเงินกับคนใกล้ชิด)</span>' : 'กระแสการเงินหมุนเวียนสม่ำเสมอ'}</p>
            </div>

            <div class="expert-point-card">
              <strong>📈 3. ${timelineLabel}:</strong>
              <div class="expert-timeline-wrap">
                ${selectedMonths.map(m => `
                  <div class="expert-timeline-step" ${m.ratingType === 'auspicious' ? 'style="border-top-color: #10b981; background: #f0fdf4;"' : ''}>
                    <div class="step-time">
                      <span ${m.ratingType === 'auspicious' ? 'style="color: #059669; font-weight: 700;"' : ''}>สารท ${m.labelDate.split(' ')[1]}</span>
                      <span ${m.ratingType === 'auspicious' ? 'style="color: #059669;"' : ''}>${m.stem.zh}${m.branch.zh}</span>
                    </div>
                    <div><strong>${m.stemGod.zh} (${m.stemGod.th}):</strong> ${m.ratingType === 'auspicious' ? 'ช่วงทองของการเงินและสภาพคล่อง มีกระแสเงินสดเข้ามาเด่นชัด' : m.ratingType === 'clash' ? 'มีเกณฑ์จ่ายเงินก้อนเพื่อการลงทุน หรือซ่อมแซมสิ่งของ ควรวางแผนงบประมาณ' : 'รายได้คงที่ ควบคุมรายจ่ายตามแผนงาน'}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="expert-point-card">
              <strong>⚖️ 4. กลยุทธ์การบริหารทรัพย์สำหรับหมอดู:</strong>
              <p>แนะนำให้ใช้ธาตุปรับดวง <strong>${ELEMENTS_META[c.tiaoHou.element].th}</strong> เพื่อควบคุมสมดุลความโลภและการตัดสินใจ เปลี่ยนเงินสดเป็นสินทรัพย์ถาวร หรือออมในกองทุนมั่นคงเพื่อป้องกันเงินรั่วไหล</p>
            </div>
          `;
      } else if (isLoveQuery) {
        // --- หมวดความรัก / คู่ครอง ---
        const spouseBranch = c.pillars.day.branch;
        let loveText = harmDay ? 'มีเกณฑ์พบรัก สมหวัง หรือความสัมพันธ์พัฒนาสู่ความมั่นคงสูง' : clashDay ? 'ต้องระวังความใจร้อน ความขัดแย้ง และอารมณ์เปราะบาง' : 'ความสัมพันธ์ดำเนินไปอย่างราบรื่น อบอุ่น';
        let loveBadge = harmDay ? 'สมพงศ์ส่งเสริม' : clashDay ? 'เฝ้าระวังอารมณ์' : 'ราบรื่นมั่นคง';

        topicTitle = `คำนวณปาจื่อเจาะลึก: ความรัก คู่ครอง & ชีวิตคู่ปี ${simY}`;
        verdictBanner = `
            <div class="expert-verdict-banner">
              <div class="verdict-left">
                <div class="verdict-icon">💖</div>
                <div>
                  <div class="verdict-text-main">คำวินิจฉัยปาจื่อ: ${loveText}</div>
                  <div class="verdict-text-sub">เรือนคู่ครอง (เสาวัน): <strong>${spouseBranch.zh} (${spouseBranch.zodiac.split(' ')[0]} - ธาตุ${spouseBranch.element})</strong> ${dayHasWenChang ? 'สถิตด้วยดาวบุ๋นชัง (ปัญญาบัณฑิต)' : ''} ${dayHasTaoHua ? 'สถิตด้วยดาวดอกท้อ (เสน่ห์เมตตา)' : ''}</div>
                </div>
              </div>
              <div class="verdict-prob-badge" style="background: #ec4899;">เกณฑ์ความรัก: ${loveBadge}</div>
            </div>
          `;

        topicAnalysis = `
            <div class="expert-point-card">
              <strong>❤️ 1. สภาพเรือนคู่ครองในดวงเดิม:</strong>
              <p>เสาวัน <strong>${c.pillars.day.stem.zh}${c.pillars.day.branch.zh}</strong> ฐานที่นั่งของคู่ครองเป็น <strong>${spouseBranch.zh} (${spouseBranch.zodiac.split(' ')[0]})</strong> คู่ครองมักเป็นคนฉลาด คล่องแคล่ว มีบทบาทช่วยสนับสนุนทั้งเรื่องส่วนตัวและหน้าที่การงาน</p>
            </div>

            <div class="expert-point-card">
              <strong>⚖️ 2. ปฏิสัมพันธ์กับปีจร ${simY} (${simBranch.zh}):</strong>
              <p>${harmDay ? `กิ่งดินปีจร ${simBranch.zh} ฮะสมพงศ์กับเสาวัน (${harmDay.name}) นำมาซึ่งความผูกพันและโอกาสเริ่มต้นความสัมพันธ์ใหม่ที่จริงจัง` : clashDay ? `กิ่งดินปีจร ${simBranch.zh} มีจุดปะทะกับเสาวัน (${clashDay.th}) ควรระวังคำพูดและการคาดหวังสูงเกินไป ให้พื้นที่ส่วนตัวแก่กัน` : `พลังงานปีจรกับเรือนคู่ครองส่งเสริมกันอย่างเรียบง่าย ไม่มีจุดปะทะรุนแรง`}</p>
            </div>

            <div class="expert-point-card">
              <strong>📅 3. ${timelineLabel}:</strong>
              <div class="expert-timeline-wrap">
                ${selectedMonths.map(m => `
                  <div class="expert-timeline-step" ${m.ratingType === 'auspicious' ? 'style="border-top-color: #ec4899; background: #fdf2f8;"' : ''}>
                    <div class="step-time"><span>สารท ${m.labelDate.split(' ')[1]}</span><span>${m.stem.zh}${m.branch.zh}</span></div>
                    <div><strong>${m.stemGod.zh}:</strong> ${m.ratingType === 'auspicious' ? 'จังหวะเสน่ห์เปิดกว้าง ได้พบปะหรือใช้เวลาคุณภาพร่วมกัน' : m.ratingType === 'clash' ? 'ควรใจเย็น หลีกเลี่ยงการหยิบยกเรื่องอดีตมาถกเถียง' : 'ความสัมพันธ์ดำเนินไปอย่างมั่นคง'}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
      } else if (isHealthQuery) {
        // --- หมวดสุขภาพ / เบญจธาตุ ---
        const elemPcts = c.elementPercentages;
        const weakestElem = Object.keys(elemPcts).reduce((a, b) => elemPcts[a] < elemPcts[b] ? a : b);
        const strongestElem = Object.keys(elemPcts).reduce((a, b) => elemPcts[a] > elemPcts[b] ? a : b);

        topicTitle = `คำนวณปาจื่อเจาะลึก: สมดุลเบญจธาตุ & สุขภาพตามแพทย์จีนปี ${simY}`;
        verdictBanner = `
            <div class="expert-verdict-banner">
              <div class="verdict-left">
                <div class="verdict-icon">🩺</div>
                <div>
                  <div class="verdict-text-main">คำวินิจฉัยปาจื่อ: เฝ้าระวังอวัยวะธาตุ${ELEMENTS_META[weakestElem].th} (${ELEMENTS_META[weakestElem].organ}) และการพักผ่อน</div>
                  <div class="verdict-text-sub">ธาตุที่น้อยที่สุดคือ <strong>${ELEMENTS_META[weakestElem].th} (${elemPcts[weakestElem]}%)</strong> | ธาตุที่เข้มข้นสูงสุดคือ <strong>${ELEMENTS_META[strongestElem].th} (${elemPcts[strongestElem]}%)</strong></div>
                </div>
              </div>
              <div class="verdict-prob-badge" style="background: #0284c7;">เกณฑ์สุขภาพ: เฝ้าระวังสมดุล</div>
            </div>
          `;

        topicAnalysis = `
            <div class="expert-point-card">
              <strong>🫀 1. อวัยวะที่ต้องดูแลตามหลักเบญจธาตุแพทย์จีน:</strong>
              <p>• <strong>ระบบ${ELEMENTS_META[weakestElem].organ} (${ELEMENTS_META[weakestElem].th}):</strong> เนื่องจากมีสัดส่วนเพียง ${elemPcts[weakestElem]}% จึงควรบำรุงและหลีกเลี่ยงพฤติกรรมเสี่ยงที่กระทบอวัยวะนี้<br>
              • <strong>ระบบ${ELEMENTS_META[strongestElem].organ} (${ELEMENTS_META[strongestElem].th}):</strong> มีสัดส่วนสูงถึง ${elemPcts[strongestElem]}% อาจมีความร้อนสะสมหรือความตึงเครียดสูง ควรระบายพลังงานด้วยการออกกำลังกายสม่ำเสมอ</p>
            </div>

            <div class="expert-point-card">
              <strong>🌿 2. อิทธิพลปีจร ${simY} (${simStem.zh}${simBranch.zh}):</strong>
              <p>ในปี ${simY} ธาตุของปีจรคือ ${simStem.element} และ ${simBranch.element} ${clashDay ? '<span style="color: #ef4444; font-weight: 700;">มีจุดปะทะกับเสาวัน (สุขภาพกายใจ) ควรเน้นการนอนหลับให้เพียงพอและงดทำงานหามรุ่งหามค่ำ</span>' : 'ช่วยปรับกระแสชี่ให้หมุนเวียนราบรื่น'}</p>
            </div>
          `;
      } else {
        // --- หมวดทั่วไป / ภาพรวมดวงชะตาปีเป้าหมาย ---
        topicTitle = rawQ ? `ผลการคำนวณวิเคราะห์เจาะลึก: "${rawQ}" (ปี ${simY})` : `ผลการคำนวณจำลองปีจร ${simY} (${simStem.zh}${simBranch.zh})`;
        verdictBanner = `
            <div class="expert-verdict-banner">
              <div class="verdict-left">
                <div class="verdict-icon">🔮</div>
                <div>
                  <div class="verdict-text-main">ผลการคำนวณจำลองปีจร ${simY} (${simStem.zh}${simBranch.zh} • ${simBranch.zodiac.split(' ')[0]})</div>
                  <div class="verdict-text-sub">ก้านฟ้า: <strong>${simStem.zh} (${simStemGod.zh} - ${simStemGod.th})</strong> | กิ่งดิน: <strong>${simBranch.zh} (${simBranch.element})</strong> | นั่บอิม: <strong>${simNaYin.split(' ')[0]}</strong></div>
                </div>
              </div>
              <div class="verdict-prob-badge" style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);">ดัชนีภาพรวม 4.3/5</div>
            </div>
          `;

        topicAnalysis = `
            <div class="expert-point-card">
              <strong>🌌 1. การปฏิสัมพันธ์ฟ้าดินในรอบปี ${simY}:</strong>
              <p>ในปี ${simY} พลังก้านฟ้าเป็น ${simStem.zh} (${simStemGod.th}) ส่งผลต่อมุมมอง ความคิด และการตัดสินใจ ขณะที่กิ่งดิน ${simBranch.zh} มีปฏิสัมพันธ์กับดวงชะตาเดิม ${clashMonth ? '<span style="color: #ef4444; font-weight: 700;">(ปะทะเสาการงาน มีการปรับเปลี่ยน)</span>' : clashDay ? '<span style="color: #ef4444; font-weight: 700;">(ปะทะเสาวัน เฝ้าระวังอารมณ์)</span>' : '<span style="color: #10b981; font-weight: 700;">(มีพลังส่งเสริมเกื้อหนุนอย่างราบรื่น)</span>'}</p>
            </div>

            <div class="expert-point-card">
              <strong>📅 2. ${timelineLabel}:</strong>
              <div class="expert-timeline-wrap">
                ${selectedMonths.map(m => `
                  <div class="expert-timeline-step" ${m.ratingType === 'auspicious' ? 'style="border-top-color: #10b981; background: #f0fdf4;"' : m.ratingType === 'clash' ? 'style="border-top-color: #ef4444; background: #fff1f2;"' : ''}>
                    <div class="step-time"><span>สารท ${m.labelDate.split(' ')[1]}</span><span>${m.stem.zh}${m.branch.zh}</span></div>
                    <div><strong>${m.stemGod.zh} (${m.stemGod.th}):</strong> ${m.ratingType === 'auspicious' ? 'จังหวะมงคลยิ่ง ธาตุเกื้อหนุนดวงชะตา' : m.ratingType === 'clash' ? 'มีจุดปะทะกระตุ้นการเปลี่ยนแปลง ควรตัดสินใจด้วยความรอบคอบ' : 'กระแสไหลเวียนราบรื่นตามแผน'}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="expert-point-card">
              <strong>⚖️ 3. กลยุทธ์การปรับใช้สำหรับหมอดู:</strong>
              <p>เน้นการใช้ธาตุปรับดวง <strong>${ELEMENTS_META[c.tiaoHou.element].th}</strong> ควบคู่กับธาตุส่งเสริม <strong>${c.favorableElements.map(k => ELEMENTS_META[k].th).join(', ')}</strong> เพื่อสร้างสมดุลและดึงศักยภาพสูงสุดของเจ้าชะตาออกมาใช้ในทุกมิติ</p>
            </div>
          `;
      }

      resultBox.innerHTML = `
          <div class="expert-result-header">
            <div class="expert-result-title"><i class="fa-solid fa-wand-magic-sparkles" style="color: #7c3aed;"></i> ${topicTitle}</div>
            <span class="expert-result-tag">ปีที่คำนวณ: ${simY} (${simStem.zh}${simBranch.zh})</span>
          </div>
          ${verdictBanner}
          <div class="expert-result-content">
            ${topicAnalysis}
          </div>
        `;

      // Smooth scroll to the result
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Expose globally
  window.BaziEngine = BaziEngine;
  window.BaziApp = BaziApp;

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BaziApp.init());
  } else {
    BaziApp.init();
  }
})();
