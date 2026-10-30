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
    { zh: '子', py: 'Zi', th: 'จื่อ (ชวด - หนู)', zodiac: 'หนู (Rat)', element: 'water', polarity: 'yang', season: 'winter', monthNum: 11, hidden: [{ stem: '癸', weight: 1.0 }] },
    { zh: '丑', py: 'Chou', th: 'โฉ่ว (ฉลู - วัว)', zodiac: 'วัว (Ox)', element: 'earth', polarity: 'yin', season: 'winter', monthNum: 12, hidden: [{ stem: '己', weight: 0.6 }, { stem: '癸', weight: 0.3 }, { stem: '辛', weight: 0.1 }] },
    { zh: '寅', py: 'Yin', th: 'อิ๋น (ขาล - เสือ)', zodiac: 'เสือ (Tiger)', element: 'wood', polarity: 'yang', season: 'spring', monthNum: 1, hidden: [{ stem: '甲', weight: 0.6 }, { stem: '丙', weight: 0.3 }, { stem: '戊', weight: 0.1 }] },
    { zh: '卯', py: 'Mao', th: 'เหม่า (เถาะ - กระต่าย)', zodiac: 'กระต่าย (Rabbit)', element: 'wood', polarity: 'yin', season: 'spring', monthNum: 2, hidden: [{ stem: '乙', weight: 1.0 }] },
    { zh: '辰', py: 'Chen', th: 'เฉิน (มะโรง - มังกร)', zodiac: 'มังกร (Dragon)', element: 'earth', polarity: 'yang', season: 'spring', monthNum: 3, hidden: [{ stem: '戊', weight: 0.6 }, { stem: '乙', weight: 0.3 }, { stem: '癸', weight: 0.1 }] },
    { zh: '巳', py: 'Si', th: 'ซื่อ (มะเส็ง - งูเล็ก)', zodiac: 'งู (Snake)', element: 'fire', polarity: 'yin', season: 'summer', monthNum: 4, hidden: [{ stem: '丙', weight: 0.6 }, { stem: '戊', weight: 0.3 }, { stem: '庚', weight: 0.1 }] },
    { zh: '午', py: 'Wu', th: 'อู่ (มะเมีย - ม้า)', zodiac: 'ม้า (Horse)', element: 'fire', polarity: 'yang', season: 'summer', monthNum: 5, hidden: [{ stem: '丁', weight: 0.7 }, { stem: '己', weight: 0.3 }] },
    { zh: '未', py: 'Wei', th: 'เว่ย (มะแม - แพะ)', zodiac: 'แพะ (Goat)', element: 'earth', polarity: 'yin', season: 'summer', monthNum: 6, hidden: [{ stem: '己', weight: 0.6 }, { stem: '丁', weight: 0.3 }, { stem: '乙', weight: 0.1 }] },
    { zh: '申', py: 'Shen', th: 'เซิน (วอก - ลิง)', zodiac: 'ลิง (Monkey)', element: 'metal', polarity: 'yang', season: 'autumn', monthNum: 7, hidden: [{ stem: '庚', weight: 0.6 }, { stem: '壬', weight: 0.3 }, { stem: '戊', weight: 0.1 }] },
    { zh: '酉', py: 'You', th: 'โหย่ว (ระกา - ไก่)', zodiac: 'ไก่ (Rooster)', element: 'metal', polarity: 'yin', season: 'autumn', monthNum: 8, hidden: [{ stem: '辛', weight: 1.0 }] },
    { zh: '戌', py: 'Xu', th: 'ซวี (จอ - หมา)', zodiac: 'หมา (Dog)', element: 'earth', polarity: 'yang', season: 'autumn', monthNum: 9, hidden: [{ stem: '戊', weight: 0.6 }, { stem: '辛', weight: 0.3 }, { stem: '丁', weight: 0.1 }] },
    { zh: '亥', py: 'Hai', th: 'ฮ่าย (กุน - หมู)', zodiac: 'หมู (Pig)', element: 'water', polarity: 'yin', season: 'winter', monthNum: 10, hidden: [{ stem: '壬', weight: 0.7 }, { stem: '甲', weight: 0.3 }] }
  ];

  // 3. Five Elements Meta (五行)
  const ELEMENTS_META = {
    wood: { th: 'ธาตุไม้', zh: '木', color: '#10b981', lightBg: 'rgba(16, 185, 129, 0.12)', border: '#10b981', generates: 'fire', controls: 'earth', direction: 'ตะวันออก', organ: 'ตับ / ถุงน้ำดี / สายตา', emotion: 'ความเมตตา / การเติบโต' },
    fire: { th: 'ธาตุไฟ', zh: '火', color: '#ef4444', lightBg: 'rgba(239, 68, 68, 0.12)', border: '#ef4444', generates: 'earth', controls: 'metal', direction: 'ทิศใต้', organ: 'หัวใจ / หลอดเลือด / สมอง', emotion: 'ความมีชีวิตชีวา / ความหลงใหล' },
    earth: { th: 'ธาตุดิน', zh: '土', color: '#d97706', lightBg: 'rgba(217, 119, 6, 0.12)', border: '#d97706', generates: 'metal', controls: 'water', direction: 'จุดศูนย์กลาง / ตกเฉียงใต้', organ: 'ม้าม / กระเพาะอาหาร / ย่อยอาหาร', emotion: 'ความน่าเชื่อถือ / ความสงบ' },
    metal: { th: 'ธาตุทอง', zh: '金', color: '#64748b', lightBg: 'rgba(100, 116, 139, 0.14)', border: '#64748b', generates: 'water', controls: 'wood', direction: 'ทิศตะวันตก', organ: 'ปอด / ผิวหนัง / ทางเดินหายใจ', emotion: 'ความเฉียบขาด / ระเบียบวินัย' },
    water: { th: 'ธาตุน้ำ', zh: '水', color: '#0284c7', lightBg: 'rgba(2, 132, 199, 0.12)', border: '#0284c7', generates: 'wood', controls: 'fire', direction: 'ทิศเหนือ', organ: 'ไต / กระเพาะปัสสาวะ / หู', emotion: 'สติปัญญา / ความยืดหยุ่น' }
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
    '霹靂火 (ไฟสายฟ้าฟาด)', '霹靂火 (ไฟสายฟ้าฟาด)', '松柏木 (ไม้สนยืนต้น)', '松柏木 (ไม้สนยืนต้น)',
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
        name = 'Bumji'
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

      // 5. Five Elements Calculation
      const elementScores = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
      [hourStem, dayStem, monthStem, yearStem].forEach(s => { elementScores[s.element] += 1.0; });
      [hourBranch, dayBranch, monthBranch, yearBranch].forEach(b => {
        b.hidden.forEach(h => {
          const sObj = STEMS.find(s => s.zh === h.stem);
          if (sObj) elementScores[sObj.element] += h.weight * 1.5;
        });
      });

      const totalScore = Object.values(elementScores).reduce((a, b) => a + b, 0);
      const elementPercentages = {};
      for (const el in elementScores) {
        elementPercentages[el] = Math.round((elementScores[el] / totalScore) * 100);
      }

      // 6. Day Master Strength (身強 vs 身弱)
      const dmElement = dayStem.element;
      const resourceElement = Object.keys(ELEMENTS_META).find(k => ELEMENTS_META[k].generates === dmElement);
      const supportingScore = (elementScores[dmElement] || 0) + (elementScores[resourceElement] || 0);
      const supportPercentage = Math.round((supportingScore / totalScore) * 100);

      const isStrong = supportPercentage >= 46;
      const strengthText = isStrong ? 'ดิถีแข็งแรง (身強 - Strong Day Master)' : 'ดิถีอ่อนแอ (身弱 - Weak Day Master)';

      let favorableElements = [];
      let avoidElements = [];
      if (isStrong) {
        const outputElem = ELEMENTS_META[dmElement].generates;
        const wealthElem = ELEMENTS_META[dmElement].controls;
        const officerElem = Object.keys(ELEMENTS_META).find(k => ELEMENTS_META[k].controls === dmElement);
        favorableElements = [outputElem, wealthElem, officerElem];
        avoidElements = [dmElement, resourceElement];
      } else {
        favorableElements = [resourceElement, dmElement];
        const officerElem = Object.keys(ELEMENTS_META).find(k => ELEMENTS_META[k].controls === dmElement);
        const wealthElem = ELEMENTS_META[dmElement].controls;
        avoidElements = [officerElem, wealthElem];
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
      const startAge = 4;

      for (let i = 1; i <= 8; i++) {
        const offset = isForward ? i : -i;
        const dyStemIdx = (mStemIdx + offset + 100) % 10;
        const dyBranchIdx = (mBranchIdx + offset + 120) % 12;
        const dyStem = STEMS[dyStemIdx];
        const dyBranch = BRANCHES[dyBranchIdx];
        const ageFrom = startAge + (i - 1) * 10;
        const ageTo = ageFrom + 9;
        const isCurrent = currentAge >= ageFrom && currentAge <= ageTo;

        daYunPillars.push({
          index: i - 1,
          order: i,
          ageRange: `${ageFrom} - ${ageTo} ปี`,
          ageFrom,
          ageTo,
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
        birthDateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        birthTimeString: `${String(birthHour).padStart(2, '0')}:${String(birthMinute).padStart(2, '0')}`,
        birthHour,
        birthMinute,
        dayMaster: dayStem,
        dayBranch: dayBranch,
        pillars,
        elementScores,
        elementPercentages,
        isStrong,
        strengthText,
        supportPercentage,
        favorableElements,
        avoidElements,
        tiaoHou,
        daYunPillars,
        dayMasterProfile
      };
    },

    // 9. Detailed Da Yun (10-Year Luck Pillar) Interpretation
    calculateDaYunInterpretation: function (chart, daYunPillar) {
      if (!chart || !daYunPillar) return null;
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

      return {
        pillar: daYunPillar,
        isFavorable: isFav,
        favorabilityText: isFav ? 'วัยจรธาตุให้คุณ (ช่วงเวลาทองคำ เกื้อหนุนดวงชะตา)' : 'วัยจรธาตุท้าทาย (ต้องใช้ความรอบคอบและตั้งรับอย่างมีสติ)',
        theme: reading.theme,
        career: reading.career,
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

      const reading = annualReadings[stemGod.zh] || annualReadings['比肩'];

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
        overview: daYunNote ? `${reading.overview} (${daYunNote})` : reading.overview,
        career: reading.career,
        wealth: reading.wealth,
        love: reading.love,
        health: reading.health
      };
    },

    // 11. Monthly Fortune Prediction (流月 - Liu Yue)
    calculateMonthlyFortune: function (chart, targetYear) {
      if (!chart) return [];
      const y = parseInt(targetYear, 10) || new Date().getFullYear();
      const yrStemIdx = ((y - 4) % 10 + 10) % 10;
      const mTigerStart = (yrStemIdx % 5) * 2 + 2;

      // Identify active Da Yun and Tai Sui for targetYear
      const birthYear = chart.birthDateString ? parseInt(chart.birthDateString.split('-')[0], 10) : new Date().getFullYear();
      const ageInYear = y - birthYear;
      const curDaYun = (chart.daYunPillars || []).find(d => ageInYear >= d.ageFrom && ageInYear <= d.ageTo);
      const taiSuiBranch = BRANCHES[((y - 4) % 12 + 12) % 12];

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
      const currentCalMonth = now.getMonth() + 1; // 1-12

      return monthMeta.map((m, idx) => {
        const mStemIdx = (mTigerStart + idx) % 10;
        const stem = STEMS[mStemIdx];
        const branch = BRANCHES[m.branchIdx];
        const stemGod = getTenGod(chart.dayMaster, stem);
        const branchGod = getTenGod(chart.dayMaster, STEMS.find(s => s.zh === branch.hidden[0].stem));
        const naYin = getNaYin(mStemIdx, m.branchIdx);

        // Clashes with natal chart
        const clashWithDay = checkBranchClash(branch.zh, chart.pillars.day.branch.zh);
        const clashWithMonth = checkBranchClash(branch.zh, chart.pillars.month.branch.zh);
        const clashWithYear = checkBranchClash(branch.zh, chart.pillars.year.branch.zh);

        // Clashes and Harmonies with Annual Tai Sui & Active Da Yun of target year
        const clashWithTaiSui = checkBranchClash(branch.zh, taiSuiBranch.zh);
        const clashWithDaYun = curDaYun ? checkBranchClash(branch.zh, curDaYun.branch.zh) : null;
        const harmWithDaYun = curDaYun ? checkBranchHarmony(branch.zh, curDaYun.branch.zh) : null;

        const hasClash = !!(clashWithDay || clashWithMonth || clashWithYear || clashWithTaiSui || clashWithDaYun);
        const isFav = chart.favorableElements.includes(stem.element) || chart.favorableElements.includes(branch.element);

        let ratingBadge = 'ราบรื่น';
        let ratingBadgeShort = 'ราบรื่น';
        let ratingType = 'normal';
        if (hasClash) {
          if (clashWithDaYun) {
            ratingBadge = '⚠️ ชงวัยจร';
            ratingBadgeShort = '⚠️ ชงวัยจร';
          } else if (clashWithTaiSui) {
            ratingBadge = '⚠️ ชงปีจร';
            ratingBadgeShort = '⚠️ ชงปีจร';
          } else {
            ratingBadge = '⚠️ ระวังการปะทะ';
            ratingBadgeShort = '⚠️ ปะทะ';
          }
          ratingType = 'clash';
        } else if (harmWithDaYun || isFav) {
          ratingBadge = harmWithDaYun ? '⭐ ฮะวัยจร มงคล' : '⭐ มงคลยิ่ง';
          ratingBadgeShort = harmWithDaYun ? '⭐ ฮะวัยจร' : '⭐ มงคล';
          ratingType = 'auspicious';
        }

        // Determine if current real-world month
        let isCurrent = false;
        if (y === currentCalYear) {
          // approx match: month 1 is Feb (2), month 2 is Mar (3)... month 11 is Dec (12), month 12 is Jan (1 next year)
          if (m.num === 12 && currentCalMonth === 1) isCurrent = true;
          else if (m.num === currentCalMonth - 1 && currentCalMonth >= 2) isCurrent = true;
        }

        // Generate tailored monthly advice
        let adviceText = '';
        if (clashWithDaYun) {
          adviceText = `เดือนนี้มีพลังปะทะกับวัยจร 10 ปี (${curDaYun.stem.zh}${curDaYun.branch.zh}) เป็นจุดเปลี่ยนสำคัญของจังหวะชีวิต ควรตั้งรับอย่างมีสติและรอบคอบ`;
        } else if (clashWithTaiSui) {
          adviceText = `เดือนนี้ปะทะกับปีจร (ไท้ส่วย) ระวังความขัดแย้งกับผู้ใหญ่หรือความผันผวนของงาน ควรหลีกเลี่ยงการตัดสินใจผลีผลาม`;
        } else if (clashWithDay) {
          adviceText = `เดือนนี้มีพลังปะทะกับเสาวัน (วังคู่ครอง/ตัวตน) ควรใจเย็นกับคนรักและดูแลสุขภาพตนเอง`;
        } else if (clashWithMonth) {
          adviceText = `เดือนนี้ปะทะกับเสาเดือน (วังการงาน) มีเกณฑ์ปรับเปลี่ยนงาน เดินทาง หรือมีภาระเร่งด่วน`;
        } else if (harmWithDaYun) {
          adviceText = `เดือนนี้สมพงศ์กับวัยจร 10 ปี (${curDaYun.stem.zh}${curDaYun.branch.zh}) ได้รับแรงส่งเสริมให้กิจการและการงานก้าวหน้าราบรื่น`;
        } else if (isFav) {
          adviceText = `พลังธาตุเกื้อหนุนดวงชะตา (${stemGod.zh} - ${stemGod.th}) มีโอกาสดีทางการงานและการเงิน เหมาะแก่การเปิดตัวโปรเจกต์ใหม่ เจรจาธุรกิจ`;
        } else {
          adviceText = `พลังงานประจำเดือนไหลเวียนปกติ ดำเนินการตามแผนที่วางไว้ รักษาสมดุลกระแสเงินสด และดูแลสุขภาพกายใจให้แจ่มใส`;
        }

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
          adviceText
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

    init: function () {
      this.loadSavedProfiles();
      this.setDefaultCurrentDateTimeInputs();
      this.initGuestInputs();
      this.renderQuickProfileSelect();
      this.bindEvents();

      const isAuth = this.isLoggedIn();
      if (!isAuth) {
        this.currentMode = 'basic';
      }
      const curUser = window.AuthManager ? window.AuthManager.currentUser : null;
      this.updateViewForAuthState(isAuth, curUser);

      if (isAuth) {
        this.loadMyProfileChart();
      } else {
        this.calculateFromInputs(false);
      }
      this.switchMode(this.currentMode, true);

      // If arriving with explicit parameters from another view or URL query
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const qDate = urlParams.get('birthDate') || urlParams.get('bDate') || urlParams.get('date');
        const qTime = urlParams.get('birthTime') || urlParams.get('bTime') || urlParams.get('time');
        const qName = urlParams.get('name') || urlParams.get('bName');
        const qGender = urlParams.get('gender');
        if (qDate) {
          const nameInput = document.getElementById('baziNameInput');
          const dateInput = document.getElementById('baziDateInput');
          const hourInput = document.getElementById('baziHourInput');
          const genderSelect = document.getElementById('baziGenderSelect');
          if (nameInput && qName) nameInput.value = decodeURIComponent(qName);
          if (dateInput) dateInput.value = qDate;
          if (hourInput && qTime) hourInput.value = qTime;
          if (genderSelect && qGender) genderSelect.value = qGender;
          this.calculateFromInputs(false);
        }

        const queryQ = urlParams.get('q');
        if (queryQ) {
          this.fillAndRunCustomQuery(queryQ);
        }
      } catch (e) {}
    },

    onAuthStateChange: function (isLoggedIn, currentUser) {
      this.updateViewForAuthState(isLoggedIn, currentUser);
      if (isLoggedIn) {
        this.loadMyProfileChart();
      }
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

      if (!isLoggedIn) {
        if (guestView) guestView.style.display = 'block';
        if (memberHeader) memberHeader.style.display = 'none';
        if (toolbarCard) toolbarCard.style.display = 'none';
        if (profileField) profileField.style.display = 'none';
        if (this.currentMode === 'expert') {
          this.switchMode('basic', false);
        }
        this.initGuestInputs();
      } else {
        if (guestView) guestView.style.display = 'none';
        if (memberHeader) memberHeader.style.display = 'flex';
        if (toolbarCard) toolbarCard.style.display = 'block';
        if (profileField) profileField.style.display = 'flex';
        this.updateMemberHeader(currentUser);
        this.renderQuickProfileSelect();
      }
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
      const nameInput = document.getElementById('baziNameInput');
      const dateInput = document.getElementById('baziDateInput');
      const hourInput = document.getElementById('baziHourInput');
      const genderSelect = document.getElementById('baziGenderSelect');
      const quickSel = document.getElementById('baziQuickProfileSelect');

      const name = (user && (user.name || user.firstName)) ? (user.name || user.firstName) : 'ดวงของฉัน';
      const birthDate = (user && user.birthDate) ? user.birthDate : '1998-08-18';
      const birthTime = (user && user.birthTime) ? user.birthTime : '10:30';
      const gender = (user && user.gender) ? user.gender : 'female';

      if (nameInput) nameInput.value = name;
      if (dateInput) dateInput.value = birthDate;
      if (hourInput) hourInput.value = birthTime;
      if (genderSelect) genderSelect.value = gender;
      if (quickSel) quickSel.value = '__my_profile__';

      // Default mode after login is Basic!
      this.switchMode('basic');
      this.calculateFromInputs(false);
      this.showToast(`แสดงผังดวงของ "${name}" (โหมด Basic) เรียบร้อยแล้วค่ะ`);
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
          if (d === 18) opt.selected = true;
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
          if (y === 1998) opt.selected = true;
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
          if (h === 12) opt.selected = true;
          hourSel.appendChild(opt);
        }
      }

      // Populate Minutes 00-55
      if (minSel && minSel.options.length === 0) {
        for (let m = 0; m < 60; m += 5) {
          const opt = document.createElement('option');
          opt.value = m;
          opt.textContent = `${String(m).padStart(2, '0')} นาที`;
          if (m === 0) opt.selected = true;
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
        name
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
            } catch (err) {}
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
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const defaultTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const nameInput = document.getElementById('baziNameInput');
      const dateInput = document.getElementById('baziDateInput');
      const hourInput = document.getElementById('baziHourInput');

      if (nameInput) nameInput.value = 'ดวงปัจจุบัน';
      if (dateInput) dateInput.value = todayStr;
      if (hourInput) hourInput.value = defaultTimeStr;
      this.selectedYear = now.getFullYear();

      const quickSel = document.getElementById('baziQuickProfileSelect');
      if (quickSel) quickSel.value = '__now__';
    },

    loadSavedProfiles: function () {
      try {
        const raw = localStorage.getItem('bazi_saved_profiles');
        this.savedProfiles = raw ? JSON.parse(raw) : [];
      } catch (e) {
        console.warn('Failed to parse saved bazi profiles:', e);
        this.savedProfiles = [];
      }

      // Preload Bumji as a saved profile if empty so it's readily accessible
      if (!this.savedProfiles || this.savedProfiles.length === 0) {
        this.savedProfiles = [{
          id: 'bazi_default_bumji',
          name: 'Bumji',
          gender: 'male',
          birthDate: '1998-08-18',
          birthTime: '10:30',
          savedAt: 'ดวงตัวอย่าง (Bumji)'
        }];
        this.saveProfilesToStorage();
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

      let html = '';
      if (window.AuthManager && window.AuthManager.isLoggedIn()) {
        html += `<option value="__my_profile__">👤 ดวงของฉัน (Profile Owner)</option>`;
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
    },

    onQuickProfileChange: function (val) {
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
        this.calculateFromInputs(false);
      };

      if (dateInput) {
        dateInput.addEventListener('change', onManualInputChange);
        dateInput.addEventListener('input', onManualInputChange);
      }
      if (hourInput) {
        hourInput.addEventListener('change', onManualInputChange);
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

      // Populate Annual Year Dropdown (1950 - 2040)
      const yearSelect = document.getElementById('baziAnnualYearSelect');
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

    onTabShow: function () {
      const isAuth = !!(window.AuthManager && window.AuthManager.isLoggedIn());
      this.updateViewForAuthState(isAuth, window.AuthManager ? window.AuthManager.currentUser : null);
      if (isAuth) {
        if (!this.currentChart) {
          this.loadMyProfileChart();
        }
      } else {
        this.initGuestInputs();
      }
    },

    calculateFromInputs: function (showToast = false) {
      const nameInput = document.getElementById('baziNameInput');
      const dateInput = document.getElementById('baziDateInput');
      const hourInput = document.getElementById('baziHourInput');
      const genderSelect = document.getElementById('baziGenderSelect');

      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'ดวงปัจจุบัน';
      const birthDate = dateInput && dateInput.value ? dateInput.value : todayStr;
      let birthHour = now.getHours();
      let birthMinute = now.getMinutes();

      if (hourInput && hourInput.value) {
        const parts = hourInput.value.split(':');
        birthHour = parseInt(parts[0], 10);
        birthMinute = parseInt(parts[1], 10);
        if (isNaN(birthHour)) birthHour = now.getHours();
        if (isNaN(birthMinute)) birthMinute = now.getMinutes();
      }

      const gender = genderSelect ? genderSelect.value : 'male';

      const chart = BaziEngine.calculateChart({
        birthDate,
        birthHour,
        birthMinute,
        gender,
        name
      });

      this.currentChart = chart;

      // Automatically sync active Da Yun with the currently selected annual year
      const curCalcYear = this.selectedYear || now.getFullYear();
      const birthYear = chart.birthDateString ? parseInt(chart.birthDateString.split('-')[0], 10) : now.getFullYear();
      const ageInYear = curCalcYear - birthYear;
      const matchingIdx = chart.daYunPillars.findIndex(p => ageInYear >= p.ageFrom && ageInYear <= p.ageTo);
      this.selectedDaYunIndex = matchingIdx !== -1 ? matchingIdx : 0;

      this.renderChart(chart);
      this.renderDaYunInterpretation();
      this.renderAnnualAndMonthlyFortune();
      if (this.currentMode === 'expert') {
        this.renderExpertSuite();
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

      const quickSel = document.getElementById('baziQuickProfileSelect');
      if (quickSel) quickSel.value = p.id;

      this.closeSavedModal();
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
      this.renderDaYunCards();
      this.renderDaYunInterpretation();
    },

    selectAnnualYear: function (year) {
      this.selectedYear = year;
      // Update chips UI
      document.querySelectorAll('.bazi-year-chip').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.year, 10) === year);
      });
      // Update dropdown select UI
      const yearSelect = document.getElementById('baziAnnualYearSelect');
      if (yearSelect && parseInt(yearSelect.value, 10) !== year) {
        yearSelect.value = year;
      }

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
    },

    selectMonth: function (idx) {
      this.selectedMonthIndex = idx;
      document.querySelectorAll('.bazi-month-cell').forEach((el, i) => {
        el.classList.toggle('active', i === idx);
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
                return `
                  <div class="interaction-item ${cls}" style="${st}">
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
                return `
                  <div class="interaction-item ${cls}" style="${st}">
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

      // 5. Strategic Life Insights
      const prof = chart.dayMasterProfile;
      const setElText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
      };

      setElText('baziTraitsText', prof.traits);
      setElText('baziCareerText', prof.career);
      setElText('baziWealthText', prof.wealth);
      setElText('baziLoveText', prof.love);
      setElText('baziHealthText', prof.health);

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

      // 1. Annual Fortune
      const annual = BaziEngine.calculateAnnualFortune(this.currentChart, y);
      if (annual) {
        const bannerEl = document.getElementById('baziAnnualBanner');
        if (bannerEl) {
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
            interactionTags = `<span class="annual-normal-tag"><i class="fa-solid fa-circle-check"></i> ไม่มีการปะทะรุนแรงกับพื้นดวงกำเนิด</span>`;
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
                ${annual.curDaYun ? `<div style="font-size: 11.5px; color: #7c3aed; font-weight: 600; margin-top: 4px;"><i class="fa-solid fa-timeline"></i> คุมโดยวัยจรช่วงอายุ ${annual.curDaYun.ageRange} (${annual.curDaYun.stem.zh}${annual.curDaYun.branch.zh} • ${annual.curDaYun.tenGod.zh} ${annual.curDaYun.tenGod.th})</div>` : ''}
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
        }

        const setText = (id, txt) => {
          const el = document.getElementById(id);
          if (el) el.textContent = txt;
        };
        setText('baziAnnualOverviewText', annual.overview);
        setText('baziAnnualCareerText', annual.career);
        setText('baziAnnualWealthText', annual.wealth);
        setText('baziAnnualLoveText', annual.love);

        const healthEl = document.getElementById('baziAnnualHealthText');
        if (healthEl) {
          healthEl.innerHTML = `<i class="fa-solid fa-shield-heart" style="color: #ef4444;"></i> <strong>สุขภาพ & สิ่งที่ต้องระวังปี ${y}:</strong> ${annual.health}`;
        }
      }

      // 2. Monthly Fortune
      const labelEl = document.getElementById('baziMonthYearLabel');
      if (labelEl) labelEl.textContent = y;

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

      cardEl.innerHTML = `
        <div class="month-detail-header">
          <div class="month-detail-title">
            <i class="fa-solid fa-calendar-day" style="color: #0284c7;"></i> <strong>คำทำนายเดือนที่ ${m.monthNum}: ${m.title}</strong>
            <span style="font-size: 13px; color: #64748b;">(ช่วงเวลา ${m.dates})</span>
          </div>
          <span class="month-cell-rating rating-${m.ratingType}" style="font-size: 12.5px; padding: 4px 10px;">${m.ratingBadge}</span>
        </div>
        <div class="month-detail-body">
          <div class="month-detail-pillar-box">
            <span style="color: ${sMeta.color}; font-size: 24px; font-weight: 800;">${m.stem.zh}</span>
            <span style="color: ${bMeta.color}; font-size: 24px; font-weight: 800;">${m.branch.zh}</span>
            <div style="font-size: 12px; color: #475569;">${m.stem.py} ${m.branch.py}</div>
            <div style="font-size: 11px; color: #7c3aed; font-weight: 600;">${m.stemGod.zh} (${m.stemGod.th})</div>
            <div style="font-size: 10.5px; color: #94a3b8;">${m.naYin.split(' ')[0]}</div>
          </div>
          <div class="month-detail-text">
            <p><i class="fa-solid fa-circle-info" style="color: #0284c7;"></i> <strong>พลังงานและแนวโน้มประจำเดือน:</strong> ${m.adviceText}</p>
          </div>
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
      } catch (e) {}

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
        { order: 3, zh: '冠帶', py: 'Guan Dai', en: 'Coming of Age', symbol: '+' },
        { order: 4, zh: '臨官', py: 'Lin Guan', en: 'Prosperity', symbol: '+' },
        { order: 5, zh: '帝旺', py: 'Di Wang', en: 'Prosp. Peak', symbol: '++' },
        { order: 6, zh: '衰', py: 'Shuai', en: 'Aging', symbol: '·' },
        { order: 7, zh: '病', py: 'Bing', en: 'Sickness', symbol: '-' },
        { order: 8, zh: '死', py: 'Si', en: 'Death', symbol: '--' },
        { order: 9, zh: '墓', py: 'Mu', en: 'Tomb', symbol: '--' },
        { order: 10, zh: '絕', py: 'Jue', en: 'Extinction', symbol: '---' },
        { order: 11, zh: '胎', py: 'Tai', en: 'Conception', symbol: '·' },
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

      const hongYanMap = { '甲': '午', '乙': '午', '丙': '寅', '丁': '未', '戊': '辰', '己': '辰', '庚': '戌', '辛': '酉', '壬': '子', '癸': '申' };
      if (hongYanMap[ds] === tb) dmStars.push('red peach blossom / HongYanSha / 红艳桃花');

      const tianChuMap = { '甲': '巳', '乙': '午', '丙': '子', '丁': '巳', '戊': '午', '己': '申', '庚': '寅', '辛': '午', '壬': '酉', '癸': '亥' };
      if (tianChuMap[ds] === tb) dmStars.push('culinary / TianChuGuiRen / 天厨*');

      const tianYiMap = { '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'], '乙': ['子', '申'], '己': ['子', '申'], '丙': ['亥', '酉'], '丁': ['亥', '酉'], '壬': ['卯', '巳'], '癸': ['卯', '巳'], '辛': ['午', '寅'] };
      if (tianYiMap[ds] && tianYiMap[ds].includes(tb)) dmStars.push('nobleman / TianYiGuiRen / 天乙贵人');

      const fuXingMap = { '甲': ['寅', '子'], '乙': ['卯', '丑'], '丙': ['寅', '子'], '丁': ['亥', '酉'], '戊': '申', '己': '未', '庚': '午', '辛': '巳', '壬': '辰', '癸': '卯' };
      if (Array.isArray(fuXingMap[ds]) ? fuXingMap[ds].includes(tb) : fuXingMap[ds] === tb) dmStars.push('beneficiary / FuXingGuiRen / 福星*');

      const yangRenMap = { '甲': '卯', '乙': '辰', '丙': '午', '丁': '未', '戊': '午', '己': '未', '庚': '酉', '辛': '戌', '壬': '子', '癸': '丑' };
      const feiRenMap = { '甲': '酉', '乙': '戌', '丙': '子', '丁': '丑', '戊': '子', '己': '丑', '庚': '卯', '辛': '辰', '壬': '午', '癸': '未' };
      if (feiRenMap[ds] === tb) dmStars.push('flying knife / FeiRen / 飞刃*');
      if (yangRenMap[ds] === tb) dmStars.push('blade / YangRen / 羊刃');

      const liuXiaMap = { '甲': '酉', '乙': '戌', '丙': '未', '丁': '申', '戊': '巳', '己': '午', '庚': '辰', '辛': '卯', '壬': '亥', '癸': '寅' };
      if (liuXiaMap[ds] === tb) dmStars.push('red clouds / LiuXia / 流霞*');

      const jieDuMap = { '甲': '午', '乙': '未', '丙': '申', '丁': '酉', '戊': '戌', '己': '亥', '庚': '子', '辛': '丑', '壬': '寅', '癸': '卯' };
      if (jieDuMap[ds] === tb) dmStars.push('right measure / JieDuGuiRen / 节度*');

      const luMap = { '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午', '戊': '巳', '己': '午', '庚': '申', '辛': '酉', '壬': '亥', '癸': '子' };
      if (luMap[ds] === tb) dmStars.push('prosperity / LuShen / 禄神');

      const jinYuMap = { '甲': '辰', '乙': '巳', '丙': '未', '丁': '申', '戊': '未', '己': '申', '庚': '戌', '辛': '亥', '壬': '丑', '癸': '寅' };
      if (jinYuMap[ds] === tb) dmStars.push('golden carriage / JinYu / 金舆');

      const guGuaMap = {
        '亥': { gu: '寅', gua: '戌' }, '子': { gu: '寅', gua: '戌' }, '丑': { gu: '寅', gua: '戌' },
        '寅': { gu: '巳', gua: '丑' }, '卯': { gu: '巳', gua: '丑' }, '辰': { gu: '巳', gua: '丑' },
        '巳': { gu: '申', gua: '辰' }, '午': { gu: '申', gua: '辰' }, '未': { gu: '申', gua: '辰' },
        '申': { gu: '亥', gua: '未' }, '酉': { gu: '亥', gua: '未' }, '戌': { gu: '亥', gua: '未' }
      };
      if (guGuaMap[yb]) {
        if (guGuaMap[yb].gua === tb) otherStars.push('forlorn star / GuaSu / 寡宿');
        if (guGuaMap[yb].gu === tb) otherStars.push('solitary star / GuChen / 孤辰');
      }

      // 2. Year Branch & Month Derived Stars (Other:)
      if (mb) {
        const tianDeMap = { '寅': '丁', '卯': '申', '辰': '壬', '巳': '辛', '午': '亥', '未': '甲', '申': '癸', '酉': '寅', '戌': '丙', '亥': '乙', '子': '巳', '丑': '庚' };
        if (tianDeMap[mb] === ts) otherStars.push(`heavenly virtue / TianDeGuiRen / 天德贵人 (${ts})`);
        const yueDeMap = { '寅': '丙', '午': '丙', '戌': '丙', '申': '壬', '子': '壬', '辰': '壬', '亥': '甲', '卯': '甲', '未': '甲', '巳': '庚', '酉': '庚', '丑': '庚' };
        if (yueDeMap[mb] === ts) otherStars.push(`monthly virtue / YueDeGuiRen / 月德贵人 (${ts})`);
      }

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
      if (yGroup) {
        if (yGroup.hua === tb) otherStars.push('star of arts / HuaGai / 华盖*(YP)');
        if (yGroup.jiang === tb) otherStars.push('general star / JiangXing / 将星*(YP)');
        if (yGroup.ma === tb) otherStars.push('traveling horse / YiMa / 驿马');
        if (yGroup.tao === tb) otherStars.push('peach blossom by the pool / XianChiTaoHua / 咸池桃花');
      }
      if (dGroup && dGroup.hua === tb && (!yGroup || yGroup.hua !== tb)) otherStars.push('star of arts / HuaGai / 华盖*(DP)');
      if (dGroup && dGroup.jiang === tb && (!yGroup || yGroup.jiang !== tb)) otherStars.push('general star / JiangXing / 将星*(DP)');

      const taiJiMap = { '甲': ['子', '午'], '乙': ['子', '午'], '丙': ['卯', '酉'], '丁': ['卯', '酉'], '戊': ['辰', '戌', '丑', '未'], '己': ['辰', '戌', '丑', '未'], '庚': ['寅', '亥'], '辛': ['寅', '亥'], '壬': ['巳', '申'], '癸': ['巳', '申'] };
      if (taiJiMap[ds] && taiJiMap[ds].includes(tb)) otherStars.push('wealth / TaiJi / 太极');

      const wuGuiMap = { '子': '辰', '丑': '巳', '寅': '午', '卯': '未', '辰': '申', '巳': '酉', '午': '戌', '未': '亥', '申': '子', '酉': '丑', '戌': '寅', '亥': '卯' };
      if (wuGuiMap[yb] === tb) otherStars.push('backstabbing / WuGui / 五鬼*');

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

          // Heaven Earth Union (天地德合)
          if (stemCombos[tS] === oS && sixCombos[tB] === oB) {
            listToPush.push(`Heaven Earth Union / Tian Di He / 天地德合 (${targetCol.stem.py}${targetCol.branch.py}-${other.stem.py}${other.branch.py})`);
          }

          // Stem Combination (五合)
          if (stemCombos[tS] === oS) {
            listToPush.push(`stem combination / Wu He / 五合 (${targetCol.stem.py}-${other.stem.py})`);
          }

          // Fan Yin (反吟)
          if (stemClashes[tS] === oS && sixClashes[tB] === oB) {
            listToPush.push(`Fan Yin / 反吟 (${targetCol.stem.py}${targetCol.branch.py}-${other.stem.py}${other.branch.py})`);
          }

          // Branch Conflict (Liu Chong / 冲)
          if (sixClashes[tB] === oB) {
            listToPush.push(`branch conflict / Liu Chong / 冲 (${targetCol.branch.py}-${other.branch.py})`);
          }

          // Six Combination (Liu He / 六合)
          if (sixCombos[tB] === oB) {
            listToPush.push(`six combination / Liu He / 六合 (${targetCol.branch.py}-${other.branch.py})`);
          }

          // Triad Half Combination (Ban San He / 半合)
          triadGroups.forEach(grp => {
            if (grp.branches.includes(tB) && grp.branches.includes(oB) && tB !== oB) {
              listToPush.push(`half triangular combination / Ban San He / 半合 (${targetCol.branch.py}-${other.branch.py})`);
            }
          });

          // Destruction (Liu Po / 破)
          if (sixDestructions[tB] === oB) {
            listToPush.push(`destruction / Liu Po / 破 (${targetCol.branch.py}-${other.branch.py})`);
          }

          // Harm (Liu Hai / 害)
          if (sixHarms[tB] === oB) {
            listToPush.push(`harm / Liu Hai / 害 (${targetCol.branch.py}-${other.branch.py})`);
          }

          // Fu Yin (伏吟)
          if (tS === oS && tB === oB) {
            listToPush.push(`Fu Yin (${targetCol.stem.py} ${targetCol.branch.py})`);
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
          }
        }
        // 2. Bullying punishment (寅 巳 申)
        if (['寅', '巳', '申'].includes(targetBranch)) {
          const group = fullContextBranches.filter(x => ['寅', '巳', '申'].includes(x));
          if (Array.from(new Set(group)).length >= 2) {
            const name = 'bullying punishment / San Xing / 持势之刑 (Yin-Si-Shen)';
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
        checkSanXing(b, allCols.map(c => c.branch.zh), primaryInteractions);
        if (col !== dayCol) checkVoid(col, dayCol, primaryInteractions);

        // 2. Secondary: Compare against Luck Pillar
        if (luckCol) {
          secondaryHeading = 'Luck pillars / 大运:';
          comparePillars(col, [luckCol], secondaryInteractions);
          const luckNatalBranches = [...allCols.map(c => c.branch.zh), luckCol.branch.zh];
          checkSanXing(b, luckNatalBranches, secondaryInteractions);
        }
      } else if (colType === 'annual') {
        // 1. Primary: Compare Annual Year against all 4 natal pillars
        comparePillars(col, allCols, primaryInteractions);
        checkSanXing(b, [...allCols.map(c => c.branch.zh), b], primaryInteractions);
        checkVoid(col, dayCol, primaryInteractions);

        // 2. Secondary: Compare Annual Year against Luck Pillar
        if (luckCol) {
          secondaryHeading = 'Luck pillars / 大运:';
          comparePillars(col, [luckCol], secondaryInteractions);
        }
      } else if (colType === 'luck') {
        // 1. Primary: Compare Luck Pillar against all 4 natal pillars
        comparePillars(col, allCols, primaryInteractions);
        checkSanXing(b, [...allCols.map(c => c.branch.zh), b], primaryInteractions);
        checkVoid(col, dayCol, primaryInteractions);

        // 2. Secondary: Compare Luck Pillar against Annual Year
        if (annualCol) {
          secondaryHeading = 'Annual year / 流年:';
          comparePillars(col, [annualCol], secondaryInteractions);
        }
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

      const natalCols = [c.pillars.hour, c.pillars.day, c.pillars.month, c.pillars.year];
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
                      return `<div class="interaction-item ${cls}" style="${st}">${it},</div>`;
                    }).join('') : '<div style="color: #94a3b8; font-size: 10.5px;">- ไม่มีจุดปะทะในดวงเดิม -</div>'}

                    ${inter.secondary.length > 0 ? `
                      <div class="luck-heading">${inter.secondaryHeading}</div>
                      ${inter.secondary.map(it => {
                        const cls = this.getInteractionClass(it);
                        const st = this.getInteractionStyle(it);
                        return `<div class="interaction-item ${cls}" style="${st}">${it},</div>`;
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
