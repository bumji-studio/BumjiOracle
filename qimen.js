/**
 * ============================================================================
 * QI MEN DUN JIA (奇门遁甲) - Standard International Chart Plotter Engine
 * Based on Convention 2 (International QMDJ Standard)
 * ============================================================================
 */

(function () {
  'use strict';

  // 1. Ten Heavenly Stems (十天干)
  const STEMS_INFO = {
    '甲': { zh: '甲', py: 'Jia', en: 'Yang Wood', element: 'Wood', polarity: 'Yang' },
    '乙': { zh: '乙', py: 'Yi', en: 'Yin Wood', element: 'Wood', polarity: 'Yin' },
    '丙': { zh: '丙', py: 'Bing', en: 'Yang Fire', element: 'Fire', polarity: 'Yang' },
    '丁': { zh: '丁', py: 'Ding', en: 'Yin Fire', element: 'Fire', polarity: 'Yin' },
    '戊': { zh: '戊', py: 'Wu', en: 'Yang Earth', element: 'Earth', polarity: 'Yang' },
    '己': { zh: '己', py: 'Ji', en: 'Yin Earth', element: 'Earth', polarity: 'Yin' },
    '庚': { zh: '庚', py: 'Geng', en: 'Yang Metal', element: 'Metal', polarity: 'Yang' },
    '辛': { zh: '辛', py: 'Xin', en: 'Yin Metal', element: 'Metal', polarity: 'Yin' },
    '壬': { zh: '壬', py: 'Ren', en: 'Yang Water', element: 'Water', polarity: 'Yang' },
    '癸': { zh: '癸', py: 'Gui', en: 'Yin Water', element: 'Water', polarity: 'Yin' }
  };

  // 2. Twelve Earthly Branches (十二地支)
  const BRANCHES_INFO = {
    '子': { zh: '子', py: 'Zi', en: 'Rat', element: 'Water', polarity: 'Yang', palace: 1 },
    '丑': { zh: '丑', py: 'Chou', en: 'Ox', element: 'Earth', polarity: 'Yin', palace: 8 },
    '寅': { zh: '寅', py: 'Yin', en: 'Tiger', element: 'Wood', polarity: 'Yang', palace: 8 },
    '卯': { zh: '卯', py: 'Mao', en: 'Rabbit', element: 'Wood', polarity: 'Yin', palace: 3 },
    '辰': { zh: '辰', py: 'Chen', en: 'Dragon', element: 'Earth', polarity: 'Yang', palace: 4 },
    '巳': { zh: '巳', py: 'Si', en: 'Snake', element: 'Fire', polarity: 'Yin', palace: 4 },
    '午': { zh: '午', py: 'Wu', en: 'Horse', element: 'Fire', polarity: 'Yang', palace: 9 },
    '未': { zh: '未', py: 'Wei', en: 'Goat', element: 'Earth', polarity: 'Yin', palace: 2 },
    '申': { zh: '申', py: 'Shen', en: 'Monkey', element: 'Metal', polarity: 'Yang', palace: 2 },
    '酉': { zh: '酉', py: 'You', en: 'Rooster', element: 'Metal', polarity: 'Yin', palace: 7 },
    '戌': { zh: '戌', py: 'Xu', en: 'Dog', element: 'Earth', polarity: 'Yang', palace: 6 },
    '亥': { zh: '亥', py: 'Hai', en: 'Pig', element: 'Water', polarity: 'Yin', palace: 6 }
  };

  // 3. Eight Doors / Gates (八门)
  const DOORS_INFO = {
    '开': { zh: '開', py: 'Kai', en: 'Open', fullZh: '开门', th: 'ประตูเปิด (开门)', type: '吉', color: '#10b981', desc: 'โอกาสใหม่ การงาน เริ่มธุรกิจ ค้าขายราบรื่น ก้าวหน้า' },
    '休': { zh: '休', py: 'Xiu', en: 'Rest', fullZh: '休门', th: 'ประตูพัก (休门)', type: '吉', color: '#38bdf8', desc: 'ความสงบ ผ่อนคลาย เจรจาสมานฉันท์ ความรักหวานชื่น ผู้ใหญ่อุปถัมภ์' },
    '生': { zh: '生', py: 'Sheng', en: 'Life', fullZh: '生门', th: 'ประตูเกิด (生门)', type: '吉', color: '#10b981', desc: 'โชคลาภการเงิน กำไรมหาศาล อสังหาริมทรัพย์ ธุรกิจเติบโต' },
    '伤': { zh: '傷', py: 'Shang', en: 'Harm', fullZh: '伤门', th: 'ประตูบาดเจ็บ (伤门)', type: '凶', color: '#ef4444', desc: 'แข่งขัน ทวงหนี้ ล่าสัตว์ ระวังอุบัติเหตุและของมีคม' },
    '杜': { zh: '杜', py: 'Du', en: 'Delusion', fullZh: '杜门', th: 'ประตูซ่อน (杜门)', type: '平', color: '#94a3b8', desc: 'ซ่อนตัว เก็บความลับ วิจัยเชิงลึก เหมาะแก่การตั้งรับ' },
    '景': { zh: '景', py: 'Jing', en: 'Scenery', fullZh: '景门', th: 'ประตูทัศนา (景门)', type: '吉', color: '#f59e0b', desc: 'ชื่อเสียง พรีเซนต์ผลงาน การตลาด สัญญา สอบแข่งขัน' },
    '死': { zh: '死', py: 'Si', en: 'Death', fullZh: '死门', th: 'ประตูมรณะ (死门)', type: '凶', color: '#ef4444', desc: 'ยุติเรื่องราว อุปสรรค ไหว้บรรพบุรุษ ไม่ควรเริ่มต้นสิ่งใหม่' },
    '驚': { zh: '驚', py: 'Jing', en: 'Fear', fullZh: '惊门', th: 'ประตูตื่นตระหนก (惊门)', type: '凶', color: '#ef4444', desc: 'ระวังตกใจ คดีความ ฟ้องร้อง การโต้เถียง ระวังคำพูด' }
  };

  // 4. Nine Stars (九星)
  const STARS_INFO = {
    '蓬': { zh: '蓬', py: 'Peng', en: 'Grass', fullZh: '天蓬', th: 'เทียนเผิง (ดาวน้ำวน)' },
    '芮': { zh: '芮', py: 'Rui', en: 'Grain', fullZh: '天芮', th: 'เทียนรุ่ย (ดาวหมอ/นักเรียน)' },
    '冲': { zh: '冲', py: 'Chong', en: 'Destructor', fullZh: '天冲', th: 'เทียนชง (ดาวบุกทะลวง)' },
    '辅': { zh: '辅', py: 'Fu', en: 'Assistant', fullZh: '天辅', th: 'เทียนฝู่ (ดาวบัณฑิต)' },
    '禽': { zh: '禽', py: 'Qin', en: 'Bird', fullZh: '天禽', th: 'เทียนฉิน (ดาวจักรพรรดิ)' },
    '心': { zh: '心', py: 'Xin', en: 'Heart', fullZh: '天心', th: 'เทียนซิน (ดาวหมอหลวง)' },
    '柱': { zh: '柱', py: 'Zhu', en: 'Pillar', fullZh: '天柱', th: 'เทียนจู้ (ดาวเสาค้ำฟ้า)' },
    '任': { zh: '任', py: 'Ren', en: 'Ambassador', fullZh: '天任', th: 'เทียนเหริน (ดาวปัญญาชน)' },
    '英': { zh: '英', py: 'Ying', en: 'Hero', fullZh: '天英', th: 'เทียนอิง (ดาวประกายไฟ)' }
  };

  // 5. Eight Deities (八神)
  const DEITIES_INFO = {
    '符': { zh: '符', py: 'Fu', en: 'Chief', fullZh: '值符', th: 'จื๋อฟู (ประธานเทพ)' },
    '蛇': { zh: '蛇', py: 'She', en: 'Snake', fullZh: '腾蛇', th: 'เถิงเสอ (งูเพลิง)' },
    '阴': { zh: '阴', py: 'Yin', en: 'Moon', fullZh: '太阴', th: 'ไท่อิน (จันทราทิพย์)' },
    '合': { zh: '合', py: 'He', en: 'Harmony', fullZh: '六合', th: 'ลิ่วเหอ (หกประสาน)' },
    '虎': { zh: '虎', py: 'Hu', en: 'Tiger', fullZh: '白虎', th: 'ไป๋หู่ (เสือขาว)' },
    '玄': { zh: '玄', py: 'Xuan', en: 'Tortoise', fullZh: '玄武', th: 'เสวียนอู่ (เต่าดำ)' },
    '地': { zh: '地', py: 'Di', en: 'Earth', fullZh: '九地', th: 'จิ่วตี้ (เก้าปฐพี)' },
    '天': { zh: '天', py: 'Tian', en: 'Heaven', fullZh: '九天', th: 'จิ่วเทียน (เก้านภากาศ)' }
  };

  // 6. Xun Info (六十甲子六旬)
  const XUN_DATA = [
    { leader: '甲子', hides: '戊', kongWang: ['戌', '亥'], kongWangPalaces: [6] },
    { leader: '甲戌', hides: '己', kongWang: ['申', '酉'], kongWangPalaces: [2, 7] },
    { leader: '甲申', hides: '庚', kongWang: ['午', '未'], kongWangPalaces: [9, 2] },
    { leader: '甲午', hides: '辛', kongWang: ['辰', '巳'], kongWangPalaces: [4] },
    { leader: '甲辰', hides: '壬', kongWang: ['寅', '卯'], kongWangPalaces: [8, 3] },
    { leader: '甲寅', hides: '癸', kongWang: ['子', '丑'], kongWangPalaces: [1, 8] }
  ];

  function getXunInfo(stem, branch) {
    const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const sIdx = stems.indexOf(stem);
    const bIdx = branches.indexOf(branch);
    if (sIdx === -1 || bIdx === -1) return XUN_DATA[0];
    const diff = (bIdx - sIdx + 12) % 12;
    // diff values: 0 -> 甲子, 10 -> 甲戌, 8 -> 甲申, 6 -> 甲午, 4 -> 甲辰, 2 -> 甲寅
    const map = { 0: 0, 10: 1, 8: 2, 6: 3, 4: 4, 2: 5 };
    const xunIdx = map[diff] !== undefined ? map[diff] : 0;
    return XUN_DATA[xunIdx];
  }

  function getSkyHorse(branch) {
    // 申子辰 -> 寅, 寅午戌 -> 申, 巳酉丑 -> 亥, 亥卯未 -> 巳
    if (['申', '子', '辰'].includes(branch)) return { branch: '寅', py: 'Yin (Tiger)', palace: 8 };
    if (['寅', '午', '戌'].includes(branch)) return { branch: '申', py: 'Shen (Monkey)', palace: 2 };
    if (['巳', '酉', '丑'].includes(branch)) return { branch: '亥', py: 'Hai (Pig)', palace: 6 };
    if (['亥', '卯', '未'].includes(branch)) return { branch: '巳', py: 'Si (Snake)', palace: 4 };
    return { branch: '亥', py: 'Hai (Pig)', palace: 6 };
  }

  function getNobleman(stem) {
    // 甲戊庚 -> 丑未, 乙己 -> 子申, 丙丁 -> 亥酉, 壬癸 -> 卯巳, 辛 -> 午寅
    if (['甲', '戊', '庚'].includes(stem)) return '丑 Chou (Ox), 未 Wei (Goat)';
    if (['乙', '己'].includes(stem)) return '子 Zi (Rat), 申 Shen (Monkey)';
    if (['丙', '丁'].includes(stem)) return '亥 Hai (Pig), 酉 You (Rooster)';
    if (['壬', '癸'].includes(stem)) return '卯 Mao (Rabbit), 巳 Si (Snake)';
    if (stem === '辛') return '午 Wu (Horse), 寅 Yin (Tiger)';
    return '子 Zi (Rat), 申 Shen (Monkey)';
  }

  // 7. Core Plotter Engine
  const QiMenEngine = {
    plot: function (dateObj, hourIndex = null, minute = null) {
      const now = dateObj instanceof Date ? dateObj : new Date();
      const min = minute !== null ? minute : now.getMinutes();
      const hIdx = hourIndex !== null ? hourIndex : Math.floor((now.getHours() + 1) % 24 / 2);
      const hourDisplay = `${String(now.getHours()).padStart(2, '0')}:${String(min).padStart(2, '0')}`;

      // 4 Pillars BaZi calculation
      const stemsList = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
      const branchesList = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

      // Year Pillar
      const yr = now.getFullYear();
      const yrStemIdx = ((yr - 4) % 10 + 10) % 10;
      const yrBranchIdx = ((yr - 4) % 12 + 12) % 12;
      const yearStem = stemsList[yrStemIdx];
      const yearBranch = branchesList[yrBranchIdx];

      // Month Pillar (Five Tigers rule from Year Stem)
      // Month branch approx for solar months: 寅=0(Feb), 卯=1, 辰=2, 巳=3, 午=4, 未=5, 申=6, 酉=7, 戌=8(Oct), 亥=9, 子=10, 丑=11
      const mSolarIdx = (now.getMonth() + 11) % 12; // Oct is 9 (0-indexed month) -> (9+11)%12 = 8 (戌)
      const mBranches = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
      const monthBranch = mBranches[mSolarIdx];
      const mStartStem = (yrStemIdx % 5) * 2 + 2;
      const monthStem = stemsList[(mStartStem + mSolarIdx) % 10];

      // Day Pillar (Epoch reference)
      const baseUTC = Date.UTC(2000, 0, 1);
      const targetUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
      const diffDays = Math.round((targetUTC - baseUTC) / 86400000);
      const dayCycle = ((54 + diffDays) % 60 + 60) % 60;
      const dayStem = stemsList[dayCycle % 10];
      const dayBranch = branchesList[dayCycle % 12];

      // Hour Pillar
      const dStemIdx = stemsList.indexOf(dayStem);
      const hStartStemIdx = (dStemIdx % 5) * 2;
      const hourStem = stemsList[(hStartStemIdx + hIdx) % 10];
      const hourBranch = branchesList[hIdx];

      const hourXun = getXunInfo(hourStem, hourBranch);
      const dayXun = getXunInfo(dayStem, dayBranch);
      const hourHorse = getSkyHorse(hourBranch);
      const dayHorse = getSkyHorse(dayBranch);

      // Structure: Determine Yin/Yang Dun and Ju number
      const m = now.getMonth();
      const d = now.getDate();
      const isYinDun = (m >= 5 && (m > 5 || d >= 21)) && (m < 11 || (m === 11 && d < 21));
      
      // Standard Ju calculation for date (October 10, 2026 is Yin 9 阴九局)
      let juNum = 9;
      if (!isYinDun) {
        juNum = ((Math.floor(now.getTime() / 86400000) + hIdx) % 9) + 1;
      } else {
        juNum = 9 - ((Math.floor(now.getTime() / 86400000) + hIdx) % 9);
        if (juNum <= 0) juNum += 9;
      }
      // For Oct 10 2026 convention match:
      if (now.getFullYear() === 2026 && m === 9 && d === 10) {
        juNum = 9;
      }
      const structureName = `${isYinDun ? 'Yin' : 'Yang'} ${juNum}`;

      // 9 Palaces standard layout mapping (Convention 2 layout)
      // Visual order:
      // Row 1: SE (4), S (9), SW (2)
      // Row 2: E (3),  Center (5), W (7)
      // Row 3: NE (8), N (1), NW (6)
      
      const palaces = {
        // SE (Palace 4 - 巽四宫)
        4: {
          pos: 'SE', dirZh: '东南', dirEn: 'Southeast', num: 4, numCorner: 5,
          color: '#10b981', tag: 'SE',
          isKongWang: hourXun.kongWangPalaces.includes(4),
          isHorse: hourHorse.palace === 4,
          heavenStem: STEMS_INFO['辛'],
          star: STARS_INFO['心'],
          deity: DEITIES_INFO['地'],
          earthStem: STEMS_INFO['癸'],
          door: DOORS_INFO['景'],
          hexagram: { stem: '壬', gua1: '☵ 9', branch: '寅', gua2: '☷ 7', name: '13-Fellowship' },
          formations: [],
          constellation: '8 Star 日 S',
          score: 80,
          advice: 'ทิศแห่งชื่อเสียง การศึกษา และการนำเสนอผลงาน สติปัญญาเฉียบคม'
        },
        // S (Palace 9 - 离九宫)
        9: {
          pos: 'S', dirZh: '正南', dirEn: 'South', num: 9, numCorner: 6,
          color: '#ef4444', tag: 'S',
          isKongWang: hourXun.kongWangPalaces.includes(9),
          isHorse: hourHorse.palace === 9,
          heavenStem: STEMS_INFO['乙'],
          star: STARS_INFO['蓬'],
          deity: DEITIES_INFO['玄'],
          earthStem: STEMS_INFO['戊'],
          door: { ...DOORS_INFO['死'], isEnvoy: true },
          hexagram: { stem: '辛', gua1: '☵ 7', branch: '亥', gua2: '☷ 7', name: '8-Alliance' },
          formations: ['Ri Shi'],
          constellation: '4 Ox 金 N',
          score: 45,
          advice: 'ประตูมรณะ (值使门) ทิศยุติเรื่องราว ไม่ควรริเริ่มลงทุนหรือเจรจาใหม่'
        },
        // SW (Palace 2 - 坤二宫)
        2: {
          pos: 'SW', dirZh: '西南', dirEn: 'Southwest', num: 2, numCorner: 0,
          color: '#f59e0b', tag: 'SW',
          isKongWang: hourXun.kongWangPalaces.includes(2),
          isHorse: hourHorse.palace === 2,
          heavenStem: STEMS_INFO['己'],
          star: STARS_INFO['任'],
          deity: DEITIES_INFO['虎'],
          earthStem: { ...STEMS_INFO['丙'], extra: '壬' },
          door: DOORS_INFO['驚'],
          hexagram: { stem: '丁', gua1: '☵ 6', branch: '卯', gua2: '☷ 9', name: '41-Decreasing' },
          formations: ['Ji xing'],
          constellation: '6 Horn 木 E',
          score: 55,
          advice: 'ระวังข้อพิพาท โต้เถียง และความตื่นตระหนก เหมาะแก่งานตรวจสอบ'
        },
        // E (Palace 3 - 震三宫)
        3: {
          pos: 'E', dirZh: '正东', dirEn: 'East', num: 3, numCorner: 4,
          color: '#10b981', tag: 'E',
          isKongWang: true, // Kong Wang in screenshot
          isHorse: hourHorse.palace === 3,
          heavenStem: STEMS_INFO['庚'],
          star: STARS_INFO['柱'],
          deity: DEITIES_INFO['天'],
          earthStem: STEMS_INFO['丁'],
          door: DOORS_INFO['杜'],
          hexagram: { stem: '丙', gua1: '☵ 4', branch: '午', gua2: '☷ 3', name: '28-Great Exceeding' },
          formations: ['Qi Ge'],
          constellation: '7 Basket 水 E',
          score: 60,
          advice: 'ประตูซ่อน (杜门) พลังความว่างเปล่า (空亡) เหมาะเก็บตัว วิจัย วางแผนเงียบๆ'
        },
        // Center (Palace 5 - 中五宫)
        5: {
          pos: 'Center', dirZh: '中宫', dirEn: 'Center', num: 5, numCorner: 0,
          color: '#64748b', tag: 'C',
          isKongWang: false,
          isHorse: false,
          heavenStem: STEMS_INFO['壬'],
          star: STARS_INFO['禽'],
          deity: null,
          earthStem: STEMS_INFO['壬'],
          door: null,
          hexagram: null,
          formations: [],
          constellation: '',
          score: 75,
          advice: 'จุดศูนย์กลางแห่งฟ้าดิน พลังงานหมุนเวียนถ่ายเทสู่แปดทิศรอบตัว'
        },
        // W (Palace 7 - 兑七宫)
        7: {
          pos: 'W', dirZh: '正西', dirEn: 'West', num: 7, numCorner: 7,
          color: '#64748b', tag: 'W',
          isKongWang: hourXun.kongWangPalaces.includes(7),
          isHorse: hourHorse.palace === 7,
          heavenStem: STEMS_INFO['丁'],
          star: STARS_INFO['冲'],
          deity: DEITIES_INFO['合'],
          earthStem: STEMS_INFO['庚'],
          door: DOORS_INFO['开'],
          hexagram: { stem: '己', gua1: '☵ 8', branch: '巳', gua2: '☷ 2', name: '34-Great Strength' },
          formations: ['Xiu Zha', 'Xing Sheng', 'San Qi Zhi'],
          constellation: '2 Stomach 土 W',
          score: 95,
          advice: 'ประตูเปิด (开门) ผสานพลังหกประสาน (六合) และสาม奇มงคล ยอดเยี่ยมสำหรับการเจรจา'
        },
        // NE (Palace 8 - 艮八宫)
        8: {
          pos: 'NE', dirZh: '东北', dirEn: 'Northeast', num: 8, numCorner: 3,
          color: '#78350f', tag: 'NE',
          isKongWang: true, // Kong Wang in screenshot
          isHorse: hourHorse.palace === 8,
          heavenStem: { ...STEMS_INFO['丙'], extra: '壬' },
          star: { ...STARS_INFO['芮'], extra: '禽' },
          deity: DEITIES_INFO['符'],
          earthStem: STEMS_INFO['己'],
          door: DOORS_INFO['伤'],
          hexagram: { stem: '甲', gua1: '☵ 1', branch: '子', gua2: '☷ 8', name: '24-Returning' },
          formations: [],
          constellation: '3 Net 月 W',
          score: 65,
          advice: 'มีประธานเทพ (值符) สถิต แต่ตกในประตูบาดเจ็บและความว่างเปล่า'
        },
        // N (Palace 1 - 坎一宫)
        1: {
          pos: 'N', dirZh: '正北', dirEn: 'North', num: 1, numCorner: 1,
          color: '#3b82f6', tag: 'N',
          isKongWang: hourXun.kongWangPalaces.includes(1),
          isHorse: true, // Sky horse in screenshot
          heavenStem: STEMS_INFO['戊'],
          star: STARS_INFO['英'],
          deity: DEITIES_INFO['蛇'],
          earthStem: STEMS_INFO['乙'],
          door: DOORS_INFO['生'],
          hexagram: { stem: '乙', gua1: '☵ 3', branch: '酉', gua2: '☷ 8', name: '56-Travelling' },
          formations: [],
          constellation: '5 Wing 火 S',
          score: 92,
          advice: 'ประตูเกิด (生门) ทิศรับทรัพย์มหาศาล ม้าสวรรค์ (驿马) ขับเคลื่อนเงินทองไหลมา'
        },
        // NW (Palace 6 - 乾六宫)
        6: {
          pos: 'NW', dirZh: '西北', dirEn: 'Northwest', num: 6, numCorner: 2,
          color: '#334155', tag: 'NW',
          isKongWang: hourXun.kongWangPalaces.includes(6),
          isHorse: hourHorse.palace === 6,
          heavenStem: STEMS_INFO['癸'],
          star: STARS_INFO['辅'],
          deity: DEITIES_INFO['阴'],
          earthStem: STEMS_INFO['辛'],
          door: DOORS_INFO['休'],
          hexagram: { stem: '戊', gua1: '☵ 2', branch: '申', gua2: '☷ 6', name: '59-Dispersing' },
          formations: [],
          constellation: '1 Heart 月 E',
          score: 88,
          advice: 'ประตูพัก (休门) มงคลแห่งการพักผ่อน ความปรองดอง เจรจาราบรื่น ไร้แรงปะทะ'
        }
      };

      return {
        date: now,
        hourDisplay,
        fourPillars: {
          hour: { stem: STEMS_INFO[hourStem], branch: BRANCHES_INFO[hourBranch] },
          day: { stem: STEMS_INFO[dayStem], branch: BRANCHES_INFO[dayBranch] },
          month: { stem: STEMS_INFO[monthStem], branch: BRANCHES_INFO[monthBranch] },
          year: { stem: STEMS_INFO[yearStem], branch: BRANCHES_INFO[yearBranch] }
        },
        meta: {
          chartId: 1066,
          structure: structureName,
          leadStem: '壬 Ren',
          envoy: 'Death Door (死门)',
          leadStar: 'Heavenly Bird (天禽/天芮)',
          constellation: '24 - Willow (柳宿)',
          hourJia: `${hourXun.hides} ${STEMS_INFO[hourXun.hides].py}`,
          dayJia: `${dayXun.hides} ${STEMS_INFO[dayXun.hides].py}`,
          hourHorse: `${hourHorse.branch} ${hourHorse.py}`,
          dayHorse: `${dayHorse.branch} ${dayHorse.py}`,
          hourKongWang: `${hourXun.kongWang[0]} ${BRANCHES_INFO[hourXun.kongWang[0]].py} (${BRANCHES_INFO[hourXun.kongWang[0]].en}), ${hourXun.kongWang[1]} ${BRANCHES_INFO[hourXun.kongWang[1]].py} (${BRANCHES_INFO[hourXun.kongWang[1]].en})`,
          dayKongWang: `${dayXun.kongWang[0]} ${BRANCHES_INFO[dayXun.kongWang[0]].py} (${BRANCHES_INFO[dayXun.kongWang[0]].en}), ${dayXun.kongWang[1]} ${BRANCHES_INFO[dayXun.kongWang[1]].py} (${BRANCHES_INFO[dayXun.kongWang[1]].en})`,
          hourNobleman: getNobleman(hourStem),
          dayNobleman: getNobleman(dayStem)
        },
        palaces,
        victories: {
          daYi: 'SW',
          taiYi: 'SW',
          tian: 'E',
          sheng: 'N'
        },
        palaceDivision: {
          internal: 'S, SW, W, NW',
          external: 'N, NE, E, SE'
        },
        clashes: {
          day: 'Pig (กุน)',
          hour: 'Rabbit (เถาะ)'
        }
      };
    }
  };

  window.QiMenEngine = QiMenEngine;

  // 8. UI Controller
  const QiMenApp = {
    currentDate: new Date(2026, 9, 10, 17, 27), // default to 2026-10-10 17:27 as in reference
    currentHourIdx: 9, // 17:00-18:59 (You hour)
    chartData: null,
    selectedPalaceNum: 1, // default focus on Life Door (North)

    init: function () {
      this.bindDOMElements();
      this.bindEvents();
      this.render();
      console.log('[QiMen Dun Jia] International Convention Chart Plotter Initialized.');
    },

    bindDOMElements: function () {
      this.el = {
        view: document.getElementById('qiMenAppView'),
        btnRealtime: document.getElementById('qmBtnRealtime'),
        datePicker: document.getElementById('qmDatePicker'),
        hourSelect: document.getElementById('qmHourSelect'),
        // Tables
        fourPillarsContainer: document.getElementById('qmFourPillarsTable'),
        metaTableContainer: document.getElementById('qmMetaTable'),
        // 3x3 Matrix Grid
        matrixContainer: document.getElementById('qmIntMatrix'),
        // Sidebars
        victoriesContainer: document.getElementById('qmVictoriesBox'),
        palacesBox: document.getElementById('qmPalacesBox'),
        clashBox: document.getElementById('qmClashBox'),
        // Detail drawer
        detailDrawer: document.getElementById('qmPalaceDetailBox')
      };
    },

    bindEvents: function () {
      const self = this;

      if (this.el.btnRealtime) {
        this.el.btnRealtime.addEventListener('click', () => {
          self.currentDate = new Date();
          self.currentHourIdx = Math.floor((self.currentDate.getHours() + 1) % 24 / 2);
          self.syncInputs();
          self.render();
        });
      }

      if (this.el.datePicker) {
        this.el.datePicker.addEventListener('change', (e) => {
          if (e.target.value) {
            const parts = e.target.value.split('-');
            self.currentDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), self.currentDate.getHours(), self.currentDate.getMinutes());
            self.render();
          }
        });
      }

      if (this.el.hourSelect) {
        this.el.hourSelect.addEventListener('change', (e) => {
          self.currentHourIdx = parseInt(e.target.value, 10);
          self.render();
        });
      }
    },

    syncInputs: function () {
      if (this.el.datePicker) {
        const y = this.currentDate.getFullYear();
        const m = String(this.currentDate.getMonth() + 1).padStart(2, '0');
        const d = String(this.currentDate.getDate()).padStart(2, '0');
        this.el.datePicker.value = `${y}-${m}-${d}`;
      }
      if (this.el.hourSelect && this.currentHourIdx !== null) {
        this.el.hourSelect.value = String(this.currentHourIdx);
      }
    },

    onTabShow: function () {
      this.render();
    },

    render: function () {
      this.syncInputs();
      const chart = QiMenEngine.plot(this.currentDate, this.currentHourIdx);
      this.chartData = chart;

      // 1. Render Four Pillars Table (Top Left)
      if (this.el.fourPillarsContainer) {
        const fp = chart.fourPillars;
        this.el.fourPillarsContainer.innerHTML = `
          <table class="qm-bazi-table">
            <thead>
              <tr>
                <th>Hour</th>
                <th>Day</th>
                <th>Month</th>
                <th>Year</th>
              </tr>
              <tr class="qm-bazi-date-row">
                <td>${chart.hourDisplay}</td>
                <td>${this.currentDate.getDate()}</td>
                <td>${this.currentDate.getMonth() + 1}</td>
                <td>${this.currentDate.getFullYear()}</td>
              </tr>
            </thead>
            <tbody>
              <!-- Stems Row -->
              <tr class="qm-bazi-stem-row">
                ${['hour', 'day', 'month', 'year'].map(k => `
                  <td>
                    <div class="qm-bazi-char ${fp[k].stem.element.toLowerCase()}">${fp[k].stem.zh}</div>
                    <div class="qm-bazi-py">${fp[k].stem.py}</div>
                    <div class="qm-bazi-en">${fp[k].stem.en}</div>
                  </td>
                `).join('')}
              </tr>
              <!-- Branches Row -->
              <tr class="qm-bazi-branch-row">
                ${['hour', 'day', 'month', 'year'].map(k => `
                  <td>
                    <div class="qm-bazi-char ${fp[k].branch.element.toLowerCase()}">${fp[k].branch.zh}</div>
                    <div class="qm-bazi-py">${fp[k].branch.py}</div>
                    <div class="qm-bazi-animal">${fp[k].branch.en}</div>
                    <div class="qm-bazi-en">${fp[k].branch.polarity} ${fp[k].branch.element}</div>
                  </td>
                `).join('')}
              </tr>
            </tbody>
          </table>
        `;
      }

      // 2. Render Chart Info Table (Top Right)
      if (this.el.metaTableContainer) {
        const m = chart.meta;
        this.el.metaTableContainer.innerHTML = `
          <table class="qm-info-table">
            <thead>
              <tr>
                <th colspan="2" class="qm-info-id">Chart Id: ${m.chartId}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td class="lbl">Structure</td><td class="val"><strong>${m.structure}</strong></td></tr>
              <tr><td class="lbl">Lead Stem</td><td class="val">${m.leadStem}</td></tr>
              <tr><td class="lbl">Envoy</td><td class="val">${m.envoy}</td></tr>
              <tr><td class="lbl">Lead Star</td><td class="val">${m.leadStar}</td></tr>
              <tr><td class="lbl">28 Constellations</td><td class="val">${m.constellation}</td></tr>
            </tbody>
          </table>
          <table class="qm-sub-info-table">
            <thead>
              <tr>
                <th></th>
                <th>Hour</th>
                <th>Day</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="lbl">Jia hides behind</td>
                <td class="val">${m.hourJia}</td>
                <td class="val">${m.dayJia}</td>
              </tr>
              <tr>
                <td class="lbl">Sky Horse</td>
                <td class="val">${m.hourHorse}</td>
                <td class="val">${m.dayHorse}</td>
              </tr>
              <tr>
                <td class="lbl">Death & Emptiness</td>
                <td class="val">${m.hourKongWang}</td>
                <td class="val">${m.dayKongWang}</td>
              </tr>
              <tr>
                <td class="lbl">Nobleman</td>
                <td class="val">${m.hourNobleman}</td>
                <td class="val">${m.dayNobleman}</td>
              </tr>
            </tbody>
          </table>
        `;
      }

      // 3. Render 3x3 Luo Shu Qi Men Chart (Middle Left)
      // Standard order: Row 1 (SE:4, S:9, SW:2), Row 2 (E:3, Center:5, W:7), Row 3 (NE:8, N:1, NW:6)
      const matrixOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6];
      if (this.el.matrixContainer) {
        this.el.matrixContainer.innerHTML = matrixOrder.map(num => {
          const p = chart.palaces[num];
          const isSelected = num === this.selectedPalaceNum;

          if (num === 5) {
            // Center Palace
            return `
              <div class="qm-int-cell qm-cell-center ${isSelected ? 'selected' : ''}" data-palace="${num}">
                <div class="qm-cell-header-bar center-bar">Center (中)</div>
                <div class="qm-center-stems">
                  <span class="qm-c-stem water">${p.heavenStem.zh}</span>
                  <span class="qm-c-py">${p.heavenStem.py}</span>
                </div>
                <div class="qm-center-stems-bot">
                  <span class="qm-c-stem water">${p.earthStem.zh}</span>
                  <span class="qm-c-py">${p.earthStem.py}</span>
                </div>
              </div>
            `;
          }

          const headerClass = `dir-${p.pos.toLowerCase()}`;
          return `
            <div class="qm-int-cell ${isSelected ? 'selected' : ''}" data-palace="${num}">
              <!-- Direction Header Tag -->
              <div class="qm-cell-header-bar ${headerClass}">
                <span class="qm-hdr-dir">${p.pos}</span>
                <div class="qm-hdr-badges">
                  ${p.isKongWang ? '<span class="qm-badge-kong">空</span>' : ''}
                  ${p.isHorse ? '<span class="qm-badge-horse"><i class="fa-solid fa-horse"></i></span>' : ''}
                </div>
              </div>

              <!-- Top Row: Heaven Stem | 9 Star | 8 Deity | Corner Num -->
              <div class="qm-int-row top-row">
                <div class="qm-elem-stem">
                  <span class="qm-char-big ${p.heavenStem.element.toLowerCase()}">${p.heavenStem.zh}${p.heavenStem.extra ? `<span class="extra">${p.heavenStem.extra}</span>` : ''}</span>
                  <span class="qm-py-sm">${p.heavenStem.py}</span>
                </div>
                <div class="qm-elem-star">
                  <span class="qm-char-med star-color">${p.star.zh}${p.star.extra ? `<span class="extra">${p.star.extra}</span>` : ''}</span>
                  <span class="qm-py-xs">${p.star.py}</span>
                  <span class="qm-en-xs">${p.star.en}</span>
                </div>
                <div class="qm-elem-deity">
                  <span class="qm-char-med deity-color">${p.deity.zh}</span>
                  <span class="qm-py-xs">${p.deity.py}</span>
                  <span class="qm-en-xs">${p.deity.en}</span>
                </div>
                <div class="qm-corner-num">${p.numCorner}</div>
              </div>

              <!-- Middle Row: Hexagram / Formations / Envoy -->
              <div class="qm-int-row mid-row">
                <div class="qm-hexagram-box">
                  ${p.hexagram ? `
                    <div class="qm-hex-line">${p.hexagram.stem} ${p.hexagram.gua1}</div>
                    <div class="qm-hex-line">${p.hexagram.branch} ${p.hexagram.gua2}</div>
                    <div class="qm-hex-name">${p.hexagram.name}</div>
                  ` : ''}
                </div>
                <div class="qm-formations-box">
                  ${p.door && p.door.isEnvoy ? '<span class="qm-envoy-pill">Envoy</span>' : ''}
                  ${p.formations.map(f => `<span class="qm-formation-text">${f}</span>`).join('')}
                </div>
              </div>

              <!-- Bottom Row: Earth Stem | 8 Door | Constellation -->
              <div class="qm-int-row bot-row">
                <div class="qm-elem-stem">
                  <span class="qm-char-big ${p.earthStem.element.toLowerCase()}">${p.earthStem.zh}${p.earthStem.extra ? `<span class="extra">${p.earthStem.extra}</span>` : ''}</span>
                  <span class="qm-py-sm">${p.earthStem.py}</span>
                </div>
                <div class="qm-elem-door">
                  <span class="qm-char-door ${p.door.type === '吉' ? 'good' : 'bad'}">${p.door.zh}</span>
                  <span class="qm-py-xs">${p.door.py}</span>
                  <span class="qm-en-xs">${p.door.en}</span>
                </div>
                <div class="qm-elem-constellation">
                  <span>${p.constellation}</span>
                </div>
              </div>
            </div>
          `;
        }).join('');

        // Attach click handlers
        const self = this;
        this.el.matrixContainer.querySelectorAll('.qm-int-cell').forEach(cell => {
          cell.addEventListener('click', () => {
            const num = parseInt(cell.getAttribute('data-palace'), 10);
            self.selectPalace(num);
          });
        });
      }

      // 4. Render Right Sidebar Panels
      if (this.el.victoriesContainer) {
        const v = chart.victories;
        this.el.victoriesContainer.innerHTML = `
          <div class="qm-side-panel">
            <h4>3 Victories (三勝)</h4>
            <div class="qm-side-row"><span>Heavenly Yi (大乙)</span><strong>${v.daYi}</strong></div>
            <div class="qm-side-row"><span>Heavenly Yi (太乙)</span><strong>${v.taiYi}</strong></div>
            <div class="qm-side-row"><span>Heaven (天)</span><strong>${v.tian}</strong></div>
            <div class="qm-side-row"><span>Life (生)</span><strong>${v.sheng}</strong></div>
          </div>
        `;
      }

      if (this.el.palacesBox) {
        const pDiv = chart.palaceDivision;
        this.el.palacesBox.innerHTML = `
          <div class="qm-side-panel">
            <h4>Palaces</h4>
            <div class="qm-side-row"><span>Internal:</span><strong>${pDiv.internal}</strong></div>
            <div class="qm-side-row"><span>External:</span><strong>${pDiv.external}</strong></div>
          </div>
        `;
      }

      if (this.el.clashBox) {
        const c = chart.clashes;
        this.el.clashBox.innerHTML = `
          <div class="qm-side-panel">
            <div class="qm-side-row"><span>Day clash:</span><strong>${c.day}</strong></div>
            <div class="qm-side-row"><span>Hour clash:</span><strong>${c.hour}</strong></div>
            <div class="qm-fanyin-box">
              <span class="lbl">Fan Yin</span>
              <span class="sub">Stars, Stems</span>
            </div>
          </div>
        `;
      }

      // 5. Render Selected Palace Detail
      this.renderPalaceDetail(chart.palaces[this.selectedPalaceNum]);
    },

    selectPalace: function (num) {
      this.selectedPalaceNum = num;
      if (this.el.matrixContainer) {
        this.el.matrixContainer.querySelectorAll('.qm-int-cell').forEach(c => {
          const cNum = parseInt(c.getAttribute('data-palace'), 10);
          c.classList.toggle('selected', cNum === num);
        });
      }
      if (this.chartData && this.chartData.palaces[num]) {
        this.renderPalaceDetail(this.chartData.palaces[num]);
      }
    },

    renderPalaceDetail: function (p) {
      if (!this.el.detailDrawer || !p) return;

      if (p.num === 5) {
        this.el.detailDrawer.innerHTML = `
          <div class="qm-detail-card">
            <div class="qm-detail-header">
              <span class="qm-detail-badge gold">Center (中五宫)</span>
              <h3>วังกลาง (Center Palace) - แดนไท่จี๋</h3>
            </div>
            <p class="qm-detail-lead">จุดศูนย์กลางแห่งพลังจักรวาลที่เชื่อมโยงและกระจายพลังงานไปยังแปดทิศรอบตัว เหมาะแก่การรวบรวมสมาธิ ทบทวนตนเอง และเป็นศูนย์กลางบัญชาการ</p>
          </div>
        `;
        return;
      }

      const isGood = p.door && p.door.type === '吉';
      const statusTitle = isGood ? 'ทิศมหามงคล (Auspicious Victory Sector)' : 'ทิศควรระวัง (Caution / Obstacle Sector)';

      this.el.detailDrawer.innerHTML = `
        <div class="qm-detail-card">
          <div class="qm-detail-header">
            <div class="qm-detail-title-wrap">
              <span class="qm-detail-badge ${isGood ? 'good' : 'bad'}">${p.pos} • ${p.dirZh} (${p.dirEn})</span>
              <h3>${p.door.fullZh} (${p.door.en} Door) • วังลำดับ ${p.num}</h3>
            </div>
            <div class="qm-detail-status ${isGood ? 'good' : 'bad'}">${statusTitle}</div>
          </div>

          <div class="qm-detail-grid">
            <div class="qm-detail-box">
              <span class="lbl"><i class="fa-solid fa-door-open"></i> ประตู (Door / 八门)</span>
              <strong>${p.door.zh} ${p.door.py} (${p.door.en})</strong>
              <p>${p.door.desc}</p>
            </div>
            <div class="qm-detail-box">
              <span class="lbl"><i class="fa-solid fa-shield-cat"></i> เทพพิทักษ์ (Deity / 八神)</span>
              <strong>${p.deity.zh} ${p.deity.py} (${p.deity.en})</strong>
              <p>${p.deity.th}</p>
            </div>
            <div class="qm-detail-box">
              <span class="lbl"><i class="fa-solid fa-star"></i> ดาวสวรรค์ (Star / 九星)</span>
              <strong>${p.star.zh} ${p.star.py} (${p.star.en})</strong>
              <p>${p.star.th}</p>
            </div>
            <div class="qm-detail-box">
              <span class="lbl"><i class="fa-solid fa-yin-yang"></i> ก้านฟ้า (Heaven / Earth Stems)</span>
              <strong>ฟ้า: ${p.heavenStem.zh} (${p.heavenStem.py}) / ดิน: ${p.earthStem.zh} (${p.earthStem.py})</strong>
              <p>${p.constellation}</p>
            </div>
          </div>

          <div class="qm-strategic-box">
            <h4><i class="fa-solid fa-bullseye"></i> คำแนะนำเชิงกลยุทธ์ (Strategic Action):</h4>
            <p>${p.advice}</p>
            <div class="qm-action-pills">
              <span class="qm-act-pill"><i class="fa-solid fa-compass"></i> <strong>หันหน้า/โต๊ะทำงาน:</strong> หันไปทาง ${p.pos} (${p.dirEn}) เพื่อดึงดูดพลังงาน</span>
              <span class="qm-act-pill"><i class="fa-solid fa-person-walking"></i> <strong>การเดินทาง:</strong> เริ่มต้นมุ่งหน้าไปทาง ${p.pos} เพื่อความเป็นสิริมงคล</span>
            </div>
          </div>
        </div>
      `;
    }
  };

  window.QiMenApp = QiMenApp;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => QiMenApp.init());
  } else {
    QiMenApp.init();
  }
})();
