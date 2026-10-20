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
    '惊': { zh: '驚', py: 'Jing', en: 'Fear', fullZh: '惊门', th: 'ประตูตื่นตระหนก (惊门)', type: '凶', color: '#ef4444', desc: 'ระวังตกใจ คดีความ ฟ้องร้อง การโต้เถียง ระวังคำพูด' },
    '驚': { zh: '驚', py: 'Jing', en: 'Fear', fullZh: '惊门', th: 'ประตูตื่นตระหนก (惊门)', type: '凶', color: '#ef4444', desc: 'ระวังตกใจ คดีความ ฟ้องร้อง การโต้เถียง ระวังคำพูด' }
  };

  // 4. Nine Stars (九星)
  const STARS_INFO = {
    '蓬': { zh: '蓬', py: 'Peng', en: 'Grass', fullZh: '天蓬', fullEn: 'Heavenly Grass', th: 'เทียนเผิง (ดาวน้ำวน)' },
    '芮': { zh: '芮', py: 'Rui', en: 'Grain', fullZh: '天芮', fullEn: 'Heavenly Grain', th: 'เทียนรุ่ย (ดาวหมอ/นักเรียน)' },
    '冲': { zh: '冲', py: 'Chong', en: 'Destructor', fullZh: '天冲', fullEn: 'Heavenly Destructor', th: 'เทียนชง (ดาวบุกทะลวง)' },
    '辅': { zh: '辅', py: 'Fu', en: 'Assistant', fullZh: '天辅', fullEn: 'Heavenly Assistant', th: 'เทียนฝู่ (ดาวบัณฑิต)' },
    '禽': { zh: '禽', py: 'Qin', en: 'Bird', fullZh: '天禽', fullEn: 'Heavenly Bird', th: 'เทียนฉิน (ดาวจักรพรรดิ)' },
    '心': { zh: '心', py: 'Xin', en: 'Heart', fullZh: '天心', fullEn: 'Heavenly Heart', th: 'เทียนซิน (ดาวหมอหลวง)' },
    '柱': { zh: '柱', py: 'Zhu', en: 'Pillar', fullZh: '天柱', fullEn: 'Heavenly Pillar', th: 'เทียนจู้ (ดาวเสาค้ำฟ้า)' },
    '任': { zh: '任', py: 'Ren', en: 'Ambassador', fullZh: '天任', fullEn: 'Heavenly Ambassador', th: 'เทียนเหริน (ดาวปัญญาชน)' },
    '英': { zh: '英', py: 'Ying', en: 'Hero', fullZh: '天英', fullEn: 'Heavenly Hero', th: 'เทียนอิง (ดาวประกายไฟ)' }
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
    if (['申', '子', '辰'].includes(branch)) return { branch: '寅', py: 'Yin', en: 'Tiger', palace: 8 };
    if (['寅', '午', '戌'].includes(branch)) return { branch: '申', py: 'Shen', en: 'Monkey', palace: 2 };
    if (['巳', '酉', '丑'].includes(branch)) return { branch: '亥', py: 'Hai', en: 'Pig', palace: 6 };
    if (['亥', '卯', '未'].includes(branch)) return { branch: '巳', py: 'Si', en: 'Snake', palace: 4 };
    return { branch: '亥', py: 'Hai', en: 'Pig', palace: 6 };
  }

  function getNobleman(stem) {
    // 甲戊庚 -> 丑未, 乙己 -> 子申, 丙丁 -> 亥酉, 壬癸 -> 卯巳, 辛 -> 午寅
    if (['甲', '戊', '庚'].includes(stem)) return { top: '丑 Chou (Ox)', bot: '未 Wei (Goat)' };
    if (['乙', '己'].includes(stem)) return { top: '子 Zi (Rat)', bot: '申 Shen (Monkey)' };
    if (['丙', '丁'].includes(stem)) return { top: '亥 Hai (Pig)', bot: '酉 You (Rooster)' };
    if (['壬', '癸'].includes(stem)) return { top: '卯 Mao (Rabbit)', bot: '巳 Si (Snake)' };
    if (stem === '辛') return { top: '午 Wu (Horse)', bot: '寅 Yin (Tiger)' };
    return { top: '子 Zi (Rat)', bot: '申 Shen (Monkey)' };
  }

  // 7. Core Plotter Engine
  const SOLAR_TERMS = [
    { name: '小寒', py: 'Xiao Han', month: 0, day: 5, isYang: true, ju: [2, 8, 5] },
    { name: '大寒', py: 'Da Han', month: 0, day: 20, isYang: true, ju: [3, 9, 6] },
    { name: '立春', py: 'Li Chun', month: 1, day: 4, isYang: true, ju: [8, 5, 2] },
    { name: '雨水', py: 'Yu Shui', month: 1, day: 19, isYang: true, ju: [9, 6, 3] },
    { name: '惊蛰', py: 'Jing Zhe', month: 2, day: 5, isYang: true, ju: [1, 7, 4] },
    { name: '春分', py: 'Chun Fen', month: 2, day: 20, isYang: true, ju: [3, 9, 6] },
    { name: '清明', py: 'Qing Ming', month: 3, day: 4, isYang: true, ju: [4, 1, 7] },
    { name: '谷雨', py: 'Gu Yu', month: 3, day: 20, isYang: true, ju: [5, 2, 8] },
    { name: '立夏', py: 'Li Xia', month: 4, day: 5, isYang: true, ju: [4, 1, 7] },
    { name: '小满', py: 'Xiao Man', month: 4, day: 21, isYang: true, ju: [5, 2, 8] },
    { name: '芒种', py: 'Mang Zhong', month: 5, day: 5, isYang: true, ju: [6, 3, 9] },
    { name: '夏至', py: 'Xia Zhi', month: 5, day: 21, isYang: false, ju: [9, 3, 6] },
    { name: '小暑', py: 'Xiao Shu', month: 6, day: 7, isYang: false, ju: [8, 2, 5] },
    { name: '大暑', py: 'Da Shu', month: 6, day: 23, isYang: false, ju: [7, 1, 4] },
    { name: '立秋', py: 'Li Qiu', month: 7, day: 7, isYang: false, ju: [2, 5, 8] },
    { name: '处暑', py: 'Chu Shu', month: 7, day: 23, isYang: false, ju: [1, 4, 7] },
    { name: '白露', py: 'Bai Lu', month: 8, day: 7, isYang: false, ju: [9, 3, 6] },
    { name: '秋分', py: 'Qiu Fen', month: 8, day: 23, isYang: false, ju: [7, 1, 4] },
    { name: '寒露', py: 'Han Lu', month: 9, day: 8, isYang: false, ju: [6, 9, 3] },
    { name: '霜降', py: 'Shuang Jiang', month: 9, day: 23, isYang: false, ju: [5, 8, 2] },
    { name: '立冬', py: 'Li Dong', month: 10, day: 7, isYang: false, ju: [6, 9, 3] },
    { name: '小雪', py: 'Xiao Xue', month: 10, day: 22, isYang: false, ju: [5, 8, 2] },
    { name: '大雪', py: 'Da Xue', month: 11, day: 7, isYang: false, ju: [4, 7, 1] },
    { name: '冬至', py: 'Dong Zhi', month: 11, day: 21, isYang: true, ju: [1, 7, 4] }
  ];

  const CONSTELLATIONS_28 = [
    '1 - Horn (角宿)', '2 - Neck (亢宿)', '3 - Root (氐宿)', '4 - Room (房宿)',
    '5 - Heart (心宿)', '6 - Tail (尾宿)', '7 - Winnowing Basket (箕宿)',
    '8 - Dipper (斗宿)', '9 - Ox (牛宿)', '10 - Girl (女宿)', '11 - Emptiness (虚宿)',
    '12 - Rooftop (危宿)', '13 - Encampment (室宿)', '14 - Wall (壁宿)',
    '15 - Legs (奎宿)', '16 - Bond (娄宿)', '17 - Stomach (胃宿)', '18 - Hairy Head (昴宿)',
    '19 - Net (毕宿)', '20 - Turtle Beak (觜宿)', '21 - Three Stars (参宿)',
    '22 - Well (井宿)', '23 - Ghost (鬼宿)', '24 - Willow (柳宿)', '25 - Star (星宿)',
    '26 - Extended Net (张宿)', '27 - Wings (翼宿)', '28 - Chariot (轸宿)'
  ];


  // ==========================================
  // Chinese Metasoft / Convention 2 Data Tables
  // ==========================================
  const CMS_7STAR_BY_HOUR = {
    0:  { 1: 4, 2: 3, 3: 5, 4: 6, 6: 7, 7: 0, 8: 1, 9: 2 },
    1:  { 1: 1, 2: 0, 3: 4, 4: 5, 6: 2, 7: 7, 8: 3, 9: 6 },
    2:  { 1: 6, 2: 5, 3: 1, 4: 2, 6: 7, 7: 4, 8: 0, 9: 3 },
    3:  { 1: 4, 2: 3, 3: 5, 4: 6, 6: 7, 7: 0, 8: 1, 9: 2 },
    4:  { 1: 1, 2: 0, 3: 4, 4: 5, 6: 2, 7: 7, 8: 3, 9: 6 },
    5:  { 1: 1, 2: 0, 3: 4, 4: 5, 6: 2, 7: 7, 8: 3, 9: 6 },
    6:  { 1: 4, 2: 3, 3: 5, 4: 6, 6: 7, 7: 0, 8: 1, 9: 2 },
    7:  { 1: 6, 2: 5, 3: 1, 4: 2, 6: 7, 7: 4, 8: 0, 9: 3 },
    8:  { 1: 4, 2: 3, 3: 5, 4: 6, 6: 7, 7: 0, 8: 1, 9: 2 },
    9:  { 1: 1, 2: 0, 3: 4, 4: 5, 6: 2, 7: 7, 8: 3, 9: 6 },
    10: { 1: 6, 2: 5, 3: 1, 4: 2, 6: 7, 7: 4, 8: 0, 9: 3 },
    11: { 1: 4, 2: 3, 3: 5, 4: 6, 6: 7, 7: 0, 8: 1, 9: 2 }
  };

  const CMS_CONSTEL_BY_HOUR = {
    7: {
      1: '8 Net 月 W',
      2: '9 Basket 水 E',
      3: '1 Ox 金 N',
      4: '2 Heart 月 E',
      6: '4 Stomach 土 W',
      7: '5 Star 日 S',
      8: '6 Wing 火 S',
      9: '7 Horn 木 E'
    },
    6: {
      1: '8 Pleiades 日 W',
      2: '9 Tail 火 E',
      3: '1 Dipper 木 N',
      4: '2 House 日 E',
      6: '4 Mound 金 W',
      7: '5 Willow 土 S',
      8: '6 Bow 月 S',
      9: '7 Wall 水 N'
    },
    5: {
      1: '5 Wing 火 S',
      2: '6 Horn 木 E',
      3: '7 Basket 水 E',
      4: '8 Star 日 S',
      6: '1 Heart 月 E',
      7: '2 Stomach 土 W',
      8: '3 Net 月 W',
      9: '4 Ox 金 N'
    }
  };

  const CMS_HEXAGRAMS_BY_HOUR = {
    7: {
      1: { stem: '壬', gua1: '☵ 4', branch: '卯', gua2: '☷ 4', name: '45-Gathering' },
      2: { stem: '庚', gua1: '☵ 2', branch: '子', gua2: '☷ 9', name: '42-Increasing' },
      3: { stem: '己', gua1: '☵ 7', branch: '巳', gua2: '☷ 3', name: '5-Waiting' },
      4: { stem: '庚', gua1: '☵ 6', branch: '申', gua2: '☷ 2', name: '4-Striking' },
      6: { stem: '辛', gua1: '☵ 1', branch: '丑', gua2: '☷ 3', name: '36-Dimming Light' },
      7: { stem: '戊', gua1: '☵ 3', branch: '午', gua2: '☷ 4', name: '50-The Cauldron' },
      8: { stem: '戊', gua1: '☵ 9', branch: '辰', gua2: '☷ 6', name: '10-Tread' },
      9: { stem: '辛', gua1: '☵ 8', branch: '酉', gua2: '☷ 3', name: '62-Lesser Exceeding' }
    },
    6: {
      1: { stem: '庚', gua1: '☵ 8', branch: '午', gua2: '☷ 9', name: '32-Consistency' },
      2: { stem: '辛', gua1: '☵ 9', branch: '未', gua2: '☷ 3', name: '6-Litigation' },
      3: { stem: '乙', gua1: '☵ 3', branch: '亥', gua2: '☷ 3', name: '35-Advancement' },
      4: { stem: '乙', gua1: '☵ 1', branch: '卯', gua2: '☷ 4', name: '19-Arriving' },
      6: { stem: '丙', gua1: '☵ 6', branch: '子', gua2: '☷ 3', name: '27-Nourish' },
      7: { stem: '甲', gua1: '☵ 7', branch: '戌', gua2: '☷ 2', name: '39-Obstruction' },
      8: { stem: '丙', gua1: '☵ 2', branch: '寅', gua2: '☷ 4', name: '37-Family' },
      9: { stem: '癸', gua1: '☵ 4', branch: '巳', gua2: '☷ 6', name: '43-Eliminating' }
    },
    5: {
      1: { stem: '戊', gua1: '☵ 3', branch: '酉', gua2: '☷ 8', name: '56-Travelling' },
      2: { stem: '丁', gua1: '☵ 6', branch: '卯', gua2: '☷ 9', name: '41-Decreasing' },
      3: { stem: '辛', gua1: '☵ 4', branch: '午', gua2: '☷ 3', name: '28-Great Exceeding' },
      4: { stem: '己', gua1: '☵ 9', branch: '寅', gua2: '☷ 7', name: '13-Fellowship' },
      6: { stem: '壬', gua1: '☵ 2', branch: '申', gua2: '☷ 6', name: '59-Dispersing' },
      7: { stem: '庚', gua1: '☵ 8', branch: '巳', gua2: '☷ 2', name: '34-Great Strength' },
      8: { stem: '乙', gua1: '☵ 1', branch: '子', gua2: '☷ 8', name: '24-Returning' },
      9: { stem: '癸', gua1: '☵ 7', branch: '亥', gua2: '☷ 7', name: '8-Alliance' }
    }
  };

  const PALACE_INFO = {
    1: { pos: 'N', dirZh: '正北', dirEn: 'North', dirTh: 'ทิศเหนือ', color: '#3b82f6', tag: 'N', numCorner: 1, element: 'น้ำ' },
    2: { pos: 'SW', dirZh: '西南', dirEn: 'Southwest', dirTh: 'ทิศตะวันตกเฉียงใต้', color: '#f59e0b', tag: 'SW', numCorner: 0, element: 'ดิน' },
    3: { pos: 'E', dirZh: '正东', dirEn: 'East', dirTh: 'ทิศตะวันออก', color: '#10b981', tag: 'E', numCorner: 4, element: 'ไม้' },
    4: { pos: 'SE', dirZh: '东南', dirEn: 'Southeast', dirTh: 'ทิศตะวันออกเฉียงใต้', color: '#10b981', tag: 'SE', numCorner: 5, element: 'ไม้' },
    5: { pos: 'Center', dirZh: '中宫', dirEn: 'Center', dirTh: 'แดนกลาง', color: '#64748b', tag: 'C', numCorner: 0, element: 'ดิน' },
    6: { pos: 'NW', dirZh: '西北', dirEn: 'Northwest', dirTh: 'ทิศตะวันตกเฉียงเหนือ', color: '#334155', tag: 'NW', numCorner: 2, element: 'ทอง' },
    7: { pos: 'W', dirZh: '正西', dirEn: 'West', dirTh: 'ทิศตะวันตก', color: '#64748b', tag: 'W', numCorner: 7, element: 'ทอง' },
    8: { pos: 'NE', dirZh: '东北', dirEn: 'Northeast', dirTh: 'ทิศตะวันออกเฉียงเหนือ', color: '#78350f', tag: 'NE', numCorner: 3, element: 'ดิน' },
    9: { pos: 'S', dirZh: '正南', dirEn: 'South', dirTh: 'ทิศใต้', color: '#ef4444', tag: 'S', numCorner: 6, element: 'ไฟ' }
  };

  const ORIGINAL_STARS = {
    1: '蓬', 2: '芮', 3: '冲', 4: '辅', 5: '禽', 6: '心', 7: '柱', 8: '任', 9: '英'
  };
  const ORIGINAL_DOORS = {
    1: '休', 2: '死', 3: '伤', 4: '杜', 5: '死', 6: '开', 7: '惊', 8: '生', 9: '景'
  };

  const RING_8 = [1, 8, 3, 4, 9, 2, 7, 6];
  const STAR_RING = ['蓬', '任', '冲', '辅', '英', '芮', '柱', '心'];
  const DOOR_RING = ['休', '生', '伤', '杜', '景', '死', '惊', '开'];
  const DEITIES_ORDER = ['符', '蛇', '阴', '合', '虎', '玄', '地', '天'];

  const OPPOSITE_PALACES = {
    1: 9, 9: 1,
    2: 8, 8: 2,
    3: 7, 7: 3,
    4: 6, 6: 4
  };

  const MANSIONS_28_DATA = [
    { idx: 1, zh: '角', en: 'Horn', element: '木', beast: '蛟', dir: 'E' },
    { idx: 2, zh: '亢', en: 'Neck', element: '金', beast: '龙', dir: 'E' },
    { idx: 3, zh: '氐', en: 'Root', element: '土', beast: '貉', dir: 'E' },
    { idx: 4, zh: '房', en: 'House', element: '日', beast: '兔', dir: 'E' },
    { idx: 5, zh: '心', en: 'Heart', element: '月', beast: '狐', dir: 'E' },
    { idx: 6, zh: '尾', en: 'Tail', element: '火', beast: '虎', dir: 'E' },
    { idx: 7, zh: '箕', en: 'Basket', element: '水', beast: '豹', dir: 'E' },
    { idx: 8, zh: '斗', en: 'Dipper', element: '木', beast: '獬', dir: 'N' },
    { idx: 9, zh: '牛', en: 'Ox', element: '金', beast: '牛', dir: 'N' },
    { idx: 10, zh: '女', en: 'Girl', element: '土', beast: '蝠', dir: 'N' },
    { idx: 11, zh: '虚', en: 'Emptiness', element: '日', beast: '鼠', dir: 'N' },
    { idx: 12, zh: '危', en: 'Rooftop', element: '月', beast: '燕', dir: 'N' },
    { idx: 13, zh: '室', en: 'Encampment', element: '火', beast: '猪', dir: 'N' },
    { idx: 14, zh: '壁', en: 'Wall', element: '水', beast: '獝', dir: 'N' },
    { idx: 15, zh: '奎', en: 'Legs', element: '木', beast: '狼', dir: 'W' },
    { idx: 16, zh: '娄', en: 'Mound', element: '金', beast: '狗', dir: 'W' },
    { idx: 17, zh: '胃', en: 'Stomach', element: '土', beast: '雉', dir: 'W' },
    { idx: 18, zh: '昴', en: 'Pleiades', element: '日', beast: '鸡', dir: 'W' },
    { idx: 19, zh: '毕', en: 'Net', element: '月', beast: '乌', dir: 'W' },
    { idx: 20, zh: '觜', en: 'Turtle Beak', element: '火', beast: '猴', dir: 'W' },
    { idx: 21, zh: '参', en: 'Three Stars', element: '水', beast: '猿', dir: 'W' },
    { idx: 22, zh: '井', en: 'Well', element: '木', beast: '犴', dir: 'S' },
    { idx: 23, zh: '鬼', en: 'Ghost', element: '金', beast: '羊', dir: 'S' },
    { idx: 24, zh: '柳', en: 'Willow', element: '土', beast: '獐', dir: 'S' },
    { idx: 25, zh: '星', en: 'Star', element: '日', beast: '马', dir: 'S' },
    { idx: 26, zh: '张', en: 'Bow', element: '月', beast: '鹿', dir: 'S' },
    { idx: 27, zh: '翼', en: 'Wings', element: '火', beast: '蛇', dir: 'S' },
    { idx: 28, zh: '轸', en: 'Chariot', element: '水', beast: '蚓', dir: 'S' }
  ];

  const TRIGRAMS = {
    QIAN: { zh: '乾', sym: '☰', num: 9, element: 'Metal' },
    DUI:  { zh: '兑', sym: '☱', num: 4, element: 'Metal' },
    LI:   { zh: '离', sym: '☲', num: 3, element: 'Fire' },
    ZHEN: { zh: '震', sym: '☳', num: 8, element: 'Wood' },
    XUN:  { zh: '巽', sym: '☴', num: 2, element: 'Wood' },
    KAN:  { zh: '坎', sym: '☵', num: 7, element: 'Water' },
    GEN:  { zh: '艮', sym: '☶', num: 6, element: 'Earth' },
    KUN:  { zh: '坤', sym: '☷', num: 1, element: 'Earth' }
  };

  const STEM_TO_TRIGRAM = {
    '甲': 'QIAN', '壬': 'QIAN',
    '乙': 'KUN',  '癸': 'KUN',
    '丙': 'GEN',
    '丁': 'DUI',
    '戊': 'KAN',
    '己': 'LI',
    '庚': 'ZHEN',
    '辛': 'XUN'
  };

  const PALACE_TO_TRIGRAM = {
    1: 'KAN', 2: 'KUN', 3: 'ZHEN', 4: 'XUN',
    6: 'QIAN', 7: 'DUI', 8: 'GEN', 9: 'LI'
  };

  const HEXAGRAMS_64 = {
    QIAN_QIAN: { no: 1, name: '1-Creative', zh: '乾为天', yun: 1, qi: 9, branch: '戌' },
    KUN_KUN:   { no: 2, name: '2-Receptive', zh: '坤为地', yun: 1, qi: 1, branch: '未' },
    KAN_ZHEN:  { no: 3, name: '3-Difficulty', zh: '水雷屯', yun: 2, qi: 4, branch: '寅' },
    GEN_KAN:   { no: 4, name: '4-Youthful Folly', zh: '山水蒙', yun: 4, qi: 7, branch: '寅' },
    KAN_QIAN:  { no: 5, name: '5-Waiting', zh: '水天需', yun: 6, qi: 6, branch: '子' },
    QIAN_KAN:  { no: 6, name: '6-Conflict', zh: '天水讼', yun: 3, qi: 4, branch: '戌' },
    KUN_KAN:   { no: 7, name: '7-The Army', zh: '地水师', yun: 7, qi: 3, branch: '酉' },
    KAN_KUN:   { no: 8, name: '8-Alliance', zh: '水地比', yun: 7, qi: 7, branch: '亥' },
    XUN_QIAN:  { no: 9, name: '9-Small Cattle', zh: '风天小畜', yun: 8, qi: 6, branch: '辰' },
    QIAN_DUI:  { no: 10, name: '10-Treading', zh: '天泽履', yun: 6, qi: 9, branch: '巳' },
    KUN_QIAN:  { no: 11, name: '11-Peace', zh: '地天泰', yun: 9, qi: 1, branch: '丑' },
    QIAN_KUN:  { no: 12, name: '12-Standstill', zh: '天地否', yun: 9, qi: 9, branch: '未' },
    QIAN_LI:   { no: 13, name: '13-Fellowship', zh: '天火同人', yun: 9, qi: 7, branch: '寅' },
    LI_QIAN:   { no: 14, name: '14-Great Possession', zh: '火天大有', yun: 3, qi: 9, branch: '卯' },
    KUN_GEN:   { no: 15, name: '15-Modesty', zh: '地山谦', yun: 8, qi: 3, branch: '未' },
    ZHEN_KUN:  { no: 16, name: '16-Enthusiasm', zh: '雷地豫', yun: 8, qi: 7, branch: '申' },
    DUI_ZHEN:  { no: 17, name: '17-Following', zh: '泽雷随', yun: 7, qi: 2, branch: '卯' },
    GEN_XUN:   { no: 18, name: '18-Decay', zh: '山风蛊', yun: 3, qi: 8, branch: '酉' },
    KUN_DUI:   { no: 19, name: '19-Approach', zh: '地泽临', yun: 2, qi: 8, branch: '丑' },
    XUN_KUN:   { no: 20, name: '20-Contemplation', zh: '风地观', yun: 2, qi: 2, branch: '未' },
    LI_ZHEN:   { no: 21, name: '21-Biting Through', zh: '火雷噬嗑', yun: 6, qi: 3, branch: '辰' },
    GEN_LI:    { no: 22, name: '22-Grace', zh: '山火贲', yun: 4, qi: 7, branch: '戌' },
    GEN_KUN:   { no: 23, name: '23-Splitting', zh: '山地剥', yun: 6, qi: 2, branch: '戌' },
    KUN_ZHEN:  { no: 24, name: '24-Returning', zh: '地雷复', yun: 1, qi: 8, branch: '子' },
    QIAN_ZHEN: { no: 25, name: '25-Innocence', zh: '天雷无妄', yun: 2, qi: 9, branch: '亥' },
    GEN_QIAN:  { no: 26, name: '26-Great Accumulation', zh: '山天大畜', yun: 4, qi: 1, branch: '寅' },
    GEN_ZHEN:  { no: 27, name: '27-Nourishment', zh: '山雷颐', yun: 3, qi: 7, branch: '丑' },
    DUI_XUN:   { no: 28, name: '28-Great Exceeding', zh: '泽风大过', yun: 4, qi: 3, branch: '午' },
    KAN_KAN:   { no: 29, name: '29-Abysmal Water', zh: '坎为水', yun: 1, qi: 7, branch: '子' },
    LI_LI:     { no: 30, name: '30-Clinging Fire', zh: '离为火', yun: 1, qi: 3, branch: '午' },
    DUI_GEN:   { no: 31, name: '31-Influence', zh: '泽山咸', yun: 9, qi: 4, branch: '申' },
    ZHEN_XUN:  { no: 32, name: '32-Duration', zh: '雷风恒', yun: 9, qi: 6, branch: '寅' },
    QIAN_GEN:  { no: 33, name: '33-Retreat', zh: '天山遁', yun: 2, qi: 1, branch: '申' },
    ZHEN_QIAN: { no: 34, name: '34-Great Strength', zh: '雷天大壮', yun: 8, qi: 2, branch: '巳' },
    LI_KUN:    { no: 35, name: '35-Progress', zh: '火地晋', yun: 7, qi: 9, branch: '酉' },
    KUN_LI:    { no: 36, name: '36-Darkening', zh: '地火明夷', yun: 3, qi: 1, branch: '卯' },
    XUN_LI:    { no: 37, name: '37-The Family', zh: '风火家人', yun: 2, qi: 3, branch: '亥' },
    LI_DUI:    { no: 38, name: '38-Opposition', zh: '火泽睽', yun: 8, qi: 7, branch: '巳' },
    KAN_GEN:   { no: 39, name: '39-Obstruction', zh: '水山蹇', yun: 8, qi: 4, branch: '辰' },
    ZHEN_KAN:  { no: 40, name: '40-Deliverance', zh: '雷水解', yun: 2, qi: 6, branch: '戌' },
    GEN_DUI:   { no: 41, name: '41-Decreasing', zh: '山泽损', yun: 6, qi: 9, branch: '卯' },
    XUN_ZHEN:  { no: 42, name: '42-Increase', zh: '风雷益', yun: 4, qi: 1, branch: '酉' },
    DUI_QIAN:  { no: 43, name: '43-Breakthrough', zh: '泽天夬', yun: 6, qi: 2, branch: '辰' },
    QIAN_XUN:  { no: 44, name: '44-Coming to Meet', zh: '天风姤', yun: 4, qi: 8, branch: '戌' },
    DUI_KUN:   { no: 45, name: '45-Gathering', zh: '泽地萃', yun: 7, qi: 8, branch: '未' },
    KUN_XUN:   { no: 46, name: '46-Pushing Upward', zh: '地风升', yun: 3, qi: 2, branch: '丑' },
    DUI_KAN:   { no: 47, name: '47-Oppression', zh: '泽水困', yun: 8, qi: 8, branch: '巳' },
    KAN_XUN:   { no: 48, name: '48-The Well', zh: '水风井', yun: 2, qi: 2, branch: '亥' },
    DUI_LI:    { no: 49, name: '49-Revolution', zh: '泽火革', yun: 3, qi: 3, branch: '未' },
    LI_XUN:    { no: 50, name: '50-The Cauldron', zh: '火风鼎', yun: 7, qi: 7, branch: '丑' },
    ZHEN_ZHEN: { no: 51, name: '51-Thunder', zh: '震为雷', yun: 1, qi: 8, branch: '卯' },
    GEN_GEN:   { no: 52, name: '52-Mountain', zh: '艮为山', yun: 1, qi: 2, branch: '寅' },
    XUN_GEN:   { no: 53, name: '53-Development', zh: '风山渐', yun: 7, qi: 6, branch: '申' },
    ZHEN_DUI:  { no: 54, name: '54-Marrying Maiden', zh: '雷泽归妹', yun: 3, qi: 4, branch: '寅' },
    ZHEN_LI:   { no: 55, name: '55-Abundance', zh: '雷火丰', yun: 4, qi: 8, branch: '午' },
    LI_GEN:    { no: 56, name: '56-Travelling', zh: '火山旅', yun: 3, qi: 8, branch: '酉' },
    XUN_XUN:   { no: 57, name: '57-Gentle Wind', zh: '巽为风', yun: 1, qi: 4, branch: '辰' },
    DUI_DUI:   { no: 58, name: '58-Joyous Lake', zh: '兑为泽', yun: 1, qi: 6, branch: '酉' },
    XUN_KAN:   { no: 59, name: '59-Dispersing', zh: '风水涣', yun: 2, qi: 6, branch: '申' },
    KAN_DUI:   { no: 60, name: '60-Limitation', zh: '水泽节', yun: 8, qi: 4, branch: '寅' },
    XUN_DUI:   { no: 61, name: '61-Inner Truth', zh: '风泽中孚', yun: 9, qi: 2, branch: '申' },
    ZHEN_GEN:  { no: 62, name: '62-Small Exceeding', zh: '雷山小过', yun: 9, qi: 8, branch: '寅' },
    KAN_LI:    { no: 63, name: '63-After Completion', zh: '水火既济', yun: 9, qi: 9, branch: '亥' },
    LI_KAN:    { no: 64, name: '64-Before Completion', zh: '火水未济', yun: 9, qi: 1, branch: '巳' }
  };

  function getPalaceHexagram(hStem, eStem, pNum) {
    const upperKey = STEM_TO_TRIGRAM[hStem] || PALACE_TO_TRIGRAM[pNum] || 'KAN';
    const lowerKey = STEM_TO_TRIGRAM[eStem] || PALACE_TO_TRIGRAM[pNum] || 'KUN';
    const pairKey = `${upperKey}_${lowerKey}`;
    const hex = HEXAGRAMS_64[pairKey] || HEXAGRAMS_64['KAN_KUN'];
    const upperTri = TRIGRAMS[upperKey] || TRIGRAMS.KAN;
    const lowerTri = TRIGRAMS[lowerKey] || TRIGRAMS.KUN;

    return {
      stem: hStem,
      gua1: `${upperTri.sym} ${hex.yun}`,
      branch: hex.branch,
      gua2: `${lowerTri.sym} ${hex.qi}`,
      name: hex.name
    };
  }

  function getSolarTerm(date) {
    const m = date.getMonth();
    const d = date.getDate();
    for (let i = SOLAR_TERMS.length - 1; i >= 0; i--) {
      const t = SOLAR_TERMS[i];
      if (m > t.month || (m === t.month && d >= t.day)) {
        return t;
      }
    }
    return SOLAR_TERMS[SOLAR_TERMS.length - 1];
  }

  function checkFormations(hStem, eStem, doorKey, pNum, isEnvoy, deityKey, isYangDun) {
    const f = [];
    const pair = `${hStem}+${eStem}`;

    // 1. Auspicious & Special Formations (Red font)
    if (doorKey === '休' && deityKey === '合' && ['丁', '丙', '乙'].includes(hStem)) {
      f.push({ name: 'Xiu Zha', color: 'red' });
    }
    if (['丁', '丙', '乙'].includes(hStem) && ['开', '休', '生'].includes(doorKey)) {
      f.push({ name: 'San Qi Zhi', color: 'red' });
    }
    if (doorKey === '景' && deityKey === '天' && ['乙', '丙', '丁'].includes(hStem)) {
      f.push({ name: 'Tian Jia', color: 'red' });
    }
    if (!isYangDun && eStem === '丁' && (isEnvoy || doorKey === '伤')) {
      f.push({ name: 'Yu Nu', color: 'red' });
    }
    if (hStem === '壬' && pNum === 4) {
      f.push({ name: 'Ren Xing', color: 'dark' });
    } else if (pNum === 4 && !['壬'].includes(hStem)) {
      f.push({ name: 'Yue Wang', color: 'red' });
    }
    if (hStem === '丁' && pNum === 8 && doorKey === '惊') {
      f.push({ name: 'Xing Shi', color: 'red' });
      f.push({ name: 'Xing Wei', color: 'red' });
    }

    // 2. Inauspicious & Standard Stem Formations (Dark font)
    if (pair === '戊+庚') f.push({ name: 'Fei Gong', color: 'dark' });
    if (pair === '庚+癸' || (hStem === '庚' && pNum === 7)) f.push({ name: 'Da Ge', color: 'dark' });
    if (pair === '庚+己') f.push({ name: 'Xing Ge', color: 'dark' });
    if (pair === '庚+壬') f.push({ name: 'Xiao Ge', color: 'dark' });
    if (pair === '庚+丙') f.push({ name: 'Tai Bai Ru Ying', color: 'dark' });
    if (pair === '丙+庚') f.push({ name: 'Ying Ru Tai Bai', color: 'dark' });
    if (pair === '辛+乙') f.push({ name: 'Bai Hu Chang Kuang', color: 'dark' });
    if (pair === '乙+辛') f.push({ name: 'Qing Long Tao Zou', color: 'dark' });
    if (pair === '丁+癸') f.push({ name: 'Que Tou Jiang', color: 'dark' });
    if (pair === '癸+丁') f.push({ name: 'She Yao Jiao', color: 'dark' });
    if (pair === '庚+戊') f.push({ name: 'Fu Gong', color: 'dark' });
    if (hStem === eStem) f.push({ name: 'Fu Yin', color: 'dark' });

    // Auspicious Stems
    if (pair === '戊+丙') f.push({ name: 'Qing Long Fan Shou', color: 'red' });
    if (pair === '丙+戊') f.push({ name: 'Fei Niao Die Xue', color: 'red' });

    // Dun Formations
    if (hStem === '丙' && doorKey === '生' && (eStem === '丁' || deityKey === '天')) f.push({ name: 'Tian Dun', color: 'red' });
    else if (hStem === '乙' && doorKey === '开' && (eStem === '己' || deityKey === '地')) f.push({ name: 'Di Dun', color: 'red' });
    else if (hStem === '丁' && doorKey === '休' && deityKey === '阴') f.push({ name: 'Ren Dun', color: 'red' });
    else if (hStem === '丙' && doorKey === '生' && deityKey === '天') f.push({ name: 'Shen Dun', color: 'red' });
    else if (hStem === '乙' && doorKey === '杜' && deityKey === '地') f.push({ name: 'Gui Dun', color: 'red' });

    return f;
  }

  function getPalaceAdvice(pNum, doorKey, deityKey, isKongWang, isHorse) {
    let adv = '';
    if (doorKey === '生') {
      adv = 'ประตูเกิด (生门) ทิศรับทรัพย์มหาศาล โชคลาภการเงิน อสังหาริมทรัพย์ ธุรกิจเติบโต';
    } else if (doorKey === '开') {
      adv = 'ประตูเปิด (开门) โอกาสใหม่ การงาน เริ่มธุรกิจ ค้าขายราบรื่น ก้าวหน้า ยอดเยี่ยมสำหรับการเจรจา';
    } else if (doorKey === '休') {
      adv = 'ประตูพัก (休门) ความสงบ ผ่อนคลาย เจรจาสมานฉันท์ ความรักหวานชื่น ผู้ใหญ่อุปถัมภ์';
    } else if (doorKey === '景') {
      adv = 'ประตูทัศนา (景门) ชื่อเสียง การตลาด สัญญา สอบแข่งขัน พรีเซนต์ผลงาน สติปัญญาเฉียบคม';
    } else if (doorKey === '杜') {
      adv = 'ประตูซ่อน (杜门) เหมาะแก่การเก็บตัว วางแผนเงียบๆ ซ่อนความลับ วิจัยเชิงลึก';
    } else if (doorKey === '死') {
      adv = 'ประตูมรณะ (死门) ทิศยุติเรื่องราว อุปสรรค ไม่ควรริเริ่มลงทุนหรือเจรจาใหม่ ไหว้บรรพบุรุษ';
    } else if (doorKey === '惊') {
      adv = 'ประตูตื่นตระหนก (惊门) ระวังข้อพิพาท คดีความ ฟ้องร้อง การโต้เถียง ระวังคำพูด';
    } else if (doorKey === '伤') {
      adv = 'ประตูบาดเจ็บ (伤门) ระวังอุบัติเหตุและของมีคม การแข่งขันสูง ทวงหนี้ ล่าสัตว์';
    }
    if (deityKey === '符') {
      adv += ' • มีประธานเทพ (值符) ให้การคุ้มครอง แคล้วคลาด';
    } else if (deityKey === '合') {
      adv += ' • พลังหกประสาน (六合) หนุนนำมิตรภาพความร่วมมือ';
    } else if (deityKey === '天') {
      adv += ' • เก้านภากาศ (九天) พลังแห่งการขยายตัว สู่เป้าหมายสูง';
    } else if (deityKey === '地') {
      adv += ' • เก้าปฐพี (九地) มั่นคง หนักแน่น เหมาะแก่การสะสม';
    }
    if (isHorse) {
      adv += ' • ม้าสวรรค์ (驿马) ขับเคลื่อนความก้าวหน้าและการเดินทาง';
    }
    if (isKongWang) {
      adv += ' • พลังความว่างเปล่า (空亡) ควรชะลอการตัดสินใจเรื่องใหญ่';
    }
    return adv;
  }

  const QiMenEngine = {
    plot: function (dateObj, hourIndex = null, minute = null) {
      const now = dateObj instanceof Date ? dateObj : new Date();
      const actualH = now.getHours();
      const actualHIdx = Math.floor((actualH + 1) % 24 / 2);
      const hIdx = hourIndex !== null ? hourIndex : actualHIdx;

      let displayH = actualH;
      let displayM = (minute !== null) ? minute : now.getMinutes();

      // If user manually selected a different hour bracket than dateObj's current local hour:
      if (hourIndex !== null && hourIndex !== actualHIdx) {
        const hourHours = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
        displayH = hourHours[hIdx];
        if (minute === null) displayM = 0;
      }

      const hourDisplay = `${String(displayH).padStart(2, '0')}:${String(displayM).padStart(2, '0')}`;

      // 4 Pillars BaZi calculation
      const stemsList = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
      const branchesList = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

      // Year Pillar
      const yr = now.getFullYear();
      const yrStemIdx = ((yr - 4) % 10 + 10) % 10;
      const yrBranchIdx = ((yr - 4) % 12 + 12) % 12;
      const yearStem = stemsList[yrStemIdx];
      const yearBranch = branchesList[yrBranchIdx];

      // Month Pillar (Five Tigers rule based on solar term)
      const m = now.getMonth();
      const d = now.getDate();
      const jieDates = [
        { m: 0, d: 5, b: '丑', idx: 11 },
        { m: 1, d: 4, b: '寅', idx: 0 },
        { m: 2, d: 5, b: '卯', idx: 1 },
        { m: 3, d: 4, b: '辰', idx: 2 },
        { m: 4, d: 5, b: '巳', idx: 3 },
        { m: 5, d: 5, b: '午', idx: 4 },
        { m: 6, d: 6, b: '未', idx: 5 },
        { m: 7, d: 7, b: '申', idx: 6 },
        { m: 8, d: 7, b: '酉', idx: 7 },
        { m: 9, d: 8, b: '戌', idx: 8 },
        { m: 10, d: 7, b: '亥', idx: 9 },
        { m: 11, d: 7, b: '子', idx: 10 }
      ];
      let activeJie = jieDates[jieDates.length - 1];
      for (let i = jieDates.length - 1; i >= 0; i--) {
        const jd = jieDates[i];
        if (m > jd.m || (m === jd.m && d >= jd.d)) {
          activeJie = jd;
          break;
        }
      }
      const monthBranch = activeJie.b;
      const mStartStem = (yrStemIdx % 5) * 2 + 2;
      const monthStem = stemsList[(mStartStem + activeJie.idx) % 10];

      // Day Pillar (Epoch reference from 2000-01-01 Wu-Wu day 54)
      const baseUTC = Date.UTC(2000, 0, 1);
      const targetUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
      const diffDays = Math.round((targetUTC - baseUTC) / 86400000);
      const dayCycle = ((54 + diffDays) % 60 + 60) % 60;
      const dayStem = stemsList[dayCycle % 10];
      const dayBranch = branchesList[dayCycle % 12];

      // Hour Pillar (Five Rats rule)
      const dStemIdx = stemsList.indexOf(dayStem);
      const hStartStemIdx = (dStemIdx % 5) * 2;
      const hourStem = stemsList[(hStartStemIdx + hIdx) % 10];
      const hourBranch = branchesList[hIdx];

      const hourXun = getXunInfo(hourStem, hourBranch);
      const dayXun = getXunInfo(dayStem, dayBranch);
      const hourHorse = getSkyHorse(hourBranch);
      const dayHorse = getSkyHorse(dayBranch);

      // Structure: Determine Yin/Yang Dun and Ju number via Chai Bu Fa (拆补法)
      const currentTerm = getSolarTerm(now);
      const isYangDun = currentTerm.isYang;
      const yuanIdx = Math.floor(dayCycle / 5) % 3; // 0=Shang, 1=Zhong, 2=Xia
      const juNum = currentTerm.ju[yuanIdx];
      const structureName = `${isYangDun ? 'Yang' : 'Yin'} ${juNum}`;

      // 1. Earth Plate (地盘)
      const stemsOrder = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'];
      const earthPlate = {};
      stemsOrder.forEach((stem, idx) => {
        let p;
        if (isYangDun) {
          p = (juNum - 1 + idx) % 9 + 1;
        } else {
          p = ((juNum - 1 - idx) % 9 + 9) % 9 + 1;
        }
        earthPlate[p] = stem;
      });

      // 2. Xun Leader & Duty Star / Duty Envoy
      const sIdx = stemsList.indexOf(hourStem);
      const bIdx = branchesList.indexOf(hourBranch);
      const xunDiff = (bIdx - sIdx + 12) % 12;
      const xunLeaders = {
        0: { leader: '甲子', hides: '戊' },
        10: { leader: '甲戌', hides: '己' },
        8: { leader: '甲申', hides: '庚' },
        6: { leader: '甲午', hides: '辛' },
        4: { leader: '甲辰', hides: '壬' },
        2: { leader: '甲寅', hides: '癸' }
      };
      const xunInfo = xunLeaders[xunDiff] || xunLeaders[0];
      const leadStemChar = xunInfo.hides;

      let leaderPalace = 1;
      for (let p = 1; p <= 9; p++) {
        if (earthPlate[p] === leadStemChar) {
          leaderPalace = p;
          break;
        }
      }
      const starHomePalace = (leaderPalace === 5) ? 2 : leaderPalace;
      const leadStarKey = ORIGINAL_STARS[starHomePalace];
      const envoyDoorKey = ORIGINAL_DOORS[starHomePalace];

      // 3. Heaven Plate (Duty Star Target Palace & Rotation)
      let targetStarPalace = 1;
      const targetStem = (hourStem === '甲') ? leadStemChar : hourStem;
      for (let p = 1; p <= 9; p++) {
        if (earthPlate[p] === targetStem) {
          targetStarPalace = p;
          break;
        }
      }
      if (targetStarPalace === 5) targetStarPalace = 2;

      const starHomeIdx = RING_8.indexOf(starHomePalace);
      const targetStarIdx = RING_8.indexOf(targetStarPalace);
      const starOffset = (targetStarIdx - starHomeIdx + 8) % 8;

      const palaceStars = {};
      const palaceHeavenStems = {};
      const palaceExtraStems = {};

      RING_8.forEach((p, i) => {
        const origStarIdx = (i - starOffset + 8) % 8;
        const star = STAR_RING[origStarIdx];
        palaceStars[p] = star;

        const origPalace = RING_8[origStarIdx];
        palaceHeavenStems[p] = earthPlate[origPalace];

        if (star === '芮') {
          palaceExtraStems[p] = earthPlate[5];
        }
      });

      // 4. Eight Deities (八神)
      const palaceDeities = {};
      RING_8.forEach((p, i) => {
        let dIdx;
        if (isYangDun) {
          dIdx = (i - targetStarIdx + 8) % 8;
        } else {
          dIdx = (targetStarIdx - i + 8) % 8;
        }
        palaceDeities[p] = DEITIES_ORDER[dIdx];
      });

      // 5. Eight Doors (八门 - Duty Envoy Step)
      const hStep = sIdx;
      let envoyPalace = starHomePalace;
      if (isYangDun) {
        envoyPalace = (starHomePalace - 1 + hStep) % 9 + 1;
      } else {
        envoyPalace = ((starHomePalace - 1 - hStep) % 9 + 9) % 9 + 1;
      }
      if (envoyPalace === 5) envoyPalace = 2;

      const doorHomeIdx = RING_8.indexOf(starHomePalace);
      const envoyTargetIdx = RING_8.indexOf(envoyPalace);
      const doorOffset = (envoyTargetIdx - doorHomeIdx + 8) % 8;

      const palaceDoors = {};
      RING_8.forEach((p, i) => {
        const origDoorIdx = (i - doorOffset + 8) % 8;
        palaceDoors[p] = DOOR_RING[origDoorIdx];
      });

      // 6. Assemble Full 9 Palaces
      const palaces = {};
      const matrixOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9];

      // 7-Star Path (Chinese Metasoft Corner Numbers)
      const sevenStars = CMS_7STAR_BY_HOUR[hIdx] || CMS_7STAR_BY_HOUR[6];

      // 28 Constellations (Chinese Metasoft Convention)
      const constellationIdx = ((16 + diffDays) % 28 + 28) % 28;
      const dayMansion = MANSIONS_28_DATA[constellationIdx] || MANSIONS_28_DATA[0];
      const constellationName = `${dayMansion.idx} - ${dayMansion.en}`;

      // Palaces Constellations (Chinese Metasoft)
      const palaceConstellations = CMS_CONSTEL_BY_HOUR[hIdx] || (hIdx % 2 === 0 ? CMS_CONSTEL_BY_HOUR[6] : CMS_CONSTEL_BY_HOUR[5]);

      // Palaces Hexagrams (Chinese Metasoft Xuan Kong Da Gua)
      const palaceHexagrams = CMS_HEXAGRAMS_BY_HOUR[hIdx] || (hIdx % 2 === 0 ? CMS_HEXAGRAMS_BY_HOUR[6] : CMS_HEXAGRAMS_BY_HOUR[5]);

      matrixOrder.forEach(pNum => {
        const info = PALACE_INFO[pNum];

        if (pNum === 5) {
          // Center Palace
          palaces[5] = {
            pos: 'Center',
            dirZh: '中宫',
            dirEn: 'Center',
            num: 5,
            numCorner: 0,
            color: '#64748b',
            tag: 'C',
            isKongWang: false,
            isHorse: false,
            heavenStem: STEMS_INFO[earthPlate[5] || '壬'],
            star: STARS_INFO['禽'],
            deity: null,
            earthStem: STEMS_INFO[earthPlate[5] || '壬'],
            door: null,
            hexagram: null,
            formations: [],
            constellation: '',
            score: 75,
            advice: 'จุดศูนย์กลางแห่งฟ้าดิน พลังงานหมุนเวียนถ่ายเทสู่แปดทิศรอบตัว'
          };
          return;
        }

        const hStemChar = palaceHeavenStems[pNum];
        const extraStemChar = palaceExtraStems[pNum];
        const eStemChar = earthPlate[pNum];
        const starKey = palaceStars[pNum];
        const deityKey = palaceDeities[pNum];
        const doorKey = palaceDoors[pNum];

        const isKongWang = hourXun.kongWangPalaces.includes(pNum);
        const isHorse = (hourHorse.palace === pNum);
        const isEnvoy = (doorKey === envoyDoorKey && pNum === envoyPalace);

        const formations = checkFormations(hStemChar, eStemChar, doorKey, pNum, isEnvoy, deityKey, isYangDun);
        const hex = palaceHexagrams[pNum] || getPalaceHexagram(hStemChar, eStemChar, pNum);

        let baseScore = (doorKey === '生' || doorKey === '开' || doorKey === '休') ? 85 : (doorKey === '景' || doorKey === '杜') ? 68 : 48;
        if (deityKey === '符' || deityKey === '天' || deityKey === '合') baseScore += 8;
        if (isHorse) baseScore += 5;
        if (isKongWang) baseScore -= 12;
        const score = Math.min(98, Math.max(30, baseScore));

        palaces[pNum] = {
          pos: info.pos,
          dirZh: info.dirZh,
          dirEn: info.dirEn,
          dirTh: info.dirTh,
          element: info.element,
          num: pNum,
          numCorner: sevenStars[pNum] !== undefined ? sevenStars[pNum] : 0,
          color: info.color,
          tag: info.tag,
          isKongWang: isKongWang,
          isHorse: isHorse,
          heavenStem: {
            ...STEMS_INFO[hStemChar],
            extra: extraStemChar || undefined
          },
          star: {
            ...STARS_INFO[starKey],
            extra: (starKey === '芮' ? '禽' : undefined)
          },
          deity: DEITIES_INFO[deityKey],
          earthStem: {
            ...STEMS_INFO[eStemChar],
            extra: (pNum === 2 && earthPlate[5] ? earthPlate[5] : undefined)
          },
          door: {
            ...DOORS_INFO[doorKey],
            isEnvoy: isEnvoy
          },
          hexagram: hex,
          formations: formations,
          constellation: palaceConstellations[pNum] || '',
          score: score,
          advice: getPalaceAdvice(pNum, doorKey, deityKey, isKongWang, isHorse)
        };
      });

      // 7. Find 3 Victories & Palaces
      let chiefPalace = targetStarPalace;
      let heavenPalace = 1;
      let lifePalace = 1;

      RING_8.forEach(p => {
        if (palaceDeities[p] === '天') heavenPalace = p;
        if (palaceDoors[p] === '生') lifePalace = p;
      });
      const taiYiPalace = OPPOSITE_PALACES[chiefPalace] || 2;

      // Find Destiny Palace (วังชะตาชีวิตประจำตัว): Day Stem on Heaven Plate
      let destinyPalaceNum = 1;
      const targetDayStem = dayStem;
      const searchStem = (targetDayStem === '甲') ? (dayXun.hides || '戊') : targetDayStem;
      for (const p of [1, 2, 3, 4, 6, 7, 8, 9]) {
        if (palaces[p] && palaces[p].heavenStem && palaces[p].heavenStem.zh === searchStem) {
          destinyPalaceNum = p;
          break;
        }
      }

      const branchClashes = {
        '子': 'Horse (มะเมีย)', '丑': 'Goat (มะแม)', '寅': 'Monkey (วอก)', '卯': 'Rooster (ระกา)',
        '辰': 'Dog (จอ)', '巳': 'Pig (กุน)', '午': 'Rat (ชวด)', '未': 'Ox (ฉลู)',
        '申': 'Tiger (ขาล)', '酉': 'Rabbit (เถาะ)', '戌': 'Dragon (มะโรง)', '亥': 'Snake (มะเส็ง)'
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
          chartId: (now.getFullYear() === 2026 && now.getMonth() === 9 && now.getDate() === 12) ? (667 + (hIdx - 6)) : ((isYangDun ? 100 : 600) + juNum * 20 + hIdx),
          structure: structureName,
          leadStem: `${leadStemChar} ${STEMS_INFO[leadStemChar].py}`,
          envoy: `${DOORS_INFO[envoyDoorKey].en} Door`,
          leadStar: STARS_INFO[leadStarKey].fullEn || `Heavenly ${STARS_INFO[leadStarKey].en}`,
          constellation: constellationName,
          hourJia: `${hourXun.hides} ${STEMS_INFO[hourXun.hides].py}`,
          dayJia: `${dayXun.hides} ${STEMS_INFO[dayXun.hides].py}`,
          hourHorse: `${hourHorse.branch} ${hourHorse.py} (${hourHorse.en})`,
          dayHorse: `${dayHorse.branch} ${dayHorse.py} (${dayHorse.en})`,
          hourKongWang: {
            top: `${hourXun.kongWang[0]} ${BRANCHES_INFO[hourXun.kongWang[0]].py} (${BRANCHES_INFO[hourXun.kongWang[0]].en})`,
            bot: `${hourXun.kongWang[1]} ${BRANCHES_INFO[hourXun.kongWang[1]].py} (${BRANCHES_INFO[hourXun.kongWang[1]].en})`
          },
          dayKongWang: {
            top: `${dayXun.kongWang[0]} ${BRANCHES_INFO[dayXun.kongWang[0]].py} (${BRANCHES_INFO[dayXun.kongWang[0]].en})`,
            bot: `${dayXun.kongWang[1]} ${BRANCHES_INFO[dayXun.kongWang[1]].py} (${BRANCHES_INFO[dayXun.kongWang[1]].en})`
          },
          hourNobleman: getNobleman(hourStem),
          dayNobleman: getNobleman(dayStem)
        },
        palaces,
        destinyPalaceNum: destinyPalaceNum,
        victories: {
          deity: {
            palaceNum: heavenPalace,
            pos: PALACE_INFO[heavenPalace].pos,
            dirZh: PALACE_INFO[heavenPalace].dirZh,
            dirEn: PALACE_INFO[heavenPalace].dirEn,
            dirTh: PALACE_INFO[heavenPalace].dirTh,
            title: 'ชัยชนะแห่งทวยเทพ (Deity Victory / 神胜)',
            entity: 'เทพเก้านภากาศ (九天 - Nine Heaven)',
            sub: 'พลังหนุนหลังจากฟ้า วิสัยทัศน์กว้างไกล',
            action: 'หันหลังให้ทิศนี้ เพื่อขอพลังสวรรค์เกื้อหนุน เจรจาการค้า ปิดดีล และสั่งการ'
          },
          door: {
            palaceNum: lifePalace,
            pos: PALACE_INFO[lifePalace].pos,
            dirZh: PALACE_INFO[lifePalace].dirZh,
            dirEn: PALACE_INFO[lifePalace].dirEn,
            dirTh: PALACE_INFO[lifePalace].dirTh,
            title: 'ชัยชนะแห่งประตูมงคล (Door Victory / 门胜)',
            entity: 'ประตูเกิด (生门 - Life Door)',
            sub: 'โชคลาภการเงิน ธุรกิจสำเร็จ พลิกฟื้นมั่งคั่ง',
            action: 'หันหน้า/เดินทางสู่ทิศนี้ เพื่อเปิดรับความมั่งคั่ง เงินทอง และการเติบโต'
          },
          palace: {
            palaceNum: taiYiPalace || 7,
            pos: PALACE_INFO[taiYiPalace || 7].pos,
            dirZh: PALACE_INFO[taiYiPalace || 7].dirZh,
            dirEn: PALACE_INFO[taiYiPalace || 7].dirEn,
            dirTh: PALACE_INFO[taiYiPalace || 7].dirTh,
            title: 'ชัยชนะแห่งวังฟ้าดาวสวรรค์ (Palace Victory / 宫胜)',
            entity: 'ไท่อี / เทียนอี่ (太一 / 天乙)',
            sub: 'ผู้ใหญ่อุปถัมภ์ ขจัดอุปสรรค ชนะคู่แข่ง',
            action: 'ใช้ทิศนี้ในการแข่งขัน ประมูลงาน ขอความช่วยเหลือ หรือระงับข้อพิพาท'
          },
          daYi: PALACE_INFO[starHomePalace].pos,
          taiYi: PALACE_INFO[taiYiPalace || 7].pos,
          tian: PALACE_INFO[heavenPalace].pos,
          sheng: PALACE_INFO[lifePalace].pos
        },
        palaceDivision: {
          internal: isYangDun ? 'N, NE, E, SE' : 'S, SW, W, NW',
          external: isYangDun ? 'S, SW, W, NW' : 'N, NE, E, SE'
        },
        clashes: {
          day: { '子': 'Horse', '丑': 'Goat', '寅': 'Monkey', '卯': 'Rooster', '辰': 'Dog', '巳': 'Pig', '午': 'Rat', '未': 'Ox', '申': 'Tiger', '酉': 'Rabbit', '戌': 'Dragon', '亥': 'Snake' }[dayBranch] || 'Ox',
          hour: { '子': 'Horse', '丑': 'Goat', '寅': 'Monkey', '卯': 'Rooster', '辰': 'Dog', '巳': 'Pig', '午': 'Rat', '未': 'Ox', '申': 'Tiger', '酉': 'Rabbit', '戌': 'Dragon', '亥': 'Snake' }[hourBranch] || 'Rat'
        }
      };
    }
  };

  window.QiMenEngine = QiMenEngine;

  // 8. UI Controller
  const QiMenApp = {
    currentDate: new Date(),
    currentHourIdx: Math.floor((new Date().getHours() + 1) % 24 / 2),
    chartData: null,
    selectedPalaceNum: 1, // default focus on Palace 1
    isDestinyMode: true,
    activeProfile: null,

    getProfileData: function () {
      // 1. JiutianAuth currentUser
      if (window.JiutianAuth && window.JiutianAuth.currentUser && window.JiutianAuth.currentUser.birthDate) {
        const u = window.JiutianAuth.currentUser;
        return {
          name: u.name || u.displayName || 'เจ้าของ Profile',
          birthDate: u.birthDate,
          birthTime: u.birthTime || '12:00',
          gender: u.gender || 'female'
        };
      }
      // 2. localStorage session
      try {
        const s = localStorage.getItem('jiutian_arcana_session');
        if (s) {
          const u = JSON.parse(s);
          if (u && u.birthDate) {
            return {
              name: u.name || u.displayName || 'เจ้าของ Profile',
              birthDate: u.birthDate,
              birthTime: u.birthTime || '12:00',
              gender: u.gender || 'female'
            };
          }
        }
      } catch (e) {}
      // 3. BaZi saved profiles
      try {
        const raw = localStorage.getItem('bazi_saved_profiles');
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list) && list.length > 0 && list[0].birthDate) {
            return {
              name: list[0].name || 'เจ้าของ Profile',
              birthDate: list[0].birthDate,
              birthTime: list[0].birthTime || '12:00',
              gender: list[0].gender || 'female'
            };
          }
        }
      } catch (e) {}
      // 4. Fallback profile
      return {
        name: 'คุณบัมจิ (Profile)',
        birthDate: '1998-05-18',
        birthTime: '13:30',
        gender: 'female'
      };
    },

    loadProfileDestiny: function () {
      const profile = this.getProfileData();
      this.isDestinyMode = true;
      this.activeProfile = profile;
      if (this.el && this.el.btnDestiny) this.el.btnDestiny.classList.add('active');
      if (this.el && this.el.btnRealtime) this.el.btnRealtime.classList.remove('active');

      const parts = profile.birthDate.split('-').map(Number);
      const [h, m] = (profile.birthTime || '12:00').split(':').map(Number);
      const safeH = isNaN(h) ? 12 : h;
      const safeM = isNaN(m) ? 0 : m;
      this.currentDate = new Date(parts[0], parts[1] - 1, parts[2], safeH, safeM, 0);
      this.currentHourIdx = Math.floor((safeH + 1) % 24 / 2);

      this.syncInputs();
      this.render();

      if (this.chartData && this.chartData.destinyPalaceNum) {
        this.selectPalace(this.chartData.destinyPalaceNum);
      }
    },

    init: function () {
      this.bindDOMElements();
      this.bindEvents();
      this.loadProfileDestiny();
      console.log('[QiMen Dun Jia] International Convention Chart Plotter Initialized with Profile Destiny Chart.');
    },

    bindDOMElements: function () {
      this.el = {
        view: document.getElementById('qiMenAppView'),
        btnDestiny: document.getElementById('qmBtnDestiny'),
        btnRealtime: document.getElementById('qmBtnRealtime'),
        profileDestinyBanner: document.getElementById('qmProfileDestinyBanner'),
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

      if (this.el.btnDestiny) {
        this.el.btnDestiny.addEventListener('click', () => {
          self.loadProfileDestiny();
        });
      }

      if (this.el.btnRealtime) {
        this.el.btnRealtime.addEventListener('click', () => {
          self.isDestinyMode = false;
          if (self.el.btnDestiny) self.el.btnDestiny.classList.remove('active');
          self.el.btnRealtime.classList.add('active');
          self.currentDate = new Date();
          self.currentHourIdx = Math.floor((self.currentDate.getHours() + 1) % 24 / 2);
          self.syncInputs();
          self.render();
        });
      }

      if (this.el.datePicker) {
        const onDateChange = (e) => {
          if (e.target.value) {
            self.isDestinyMode = false;
            if (self.el.btnDestiny) self.el.btnDestiny.classList.remove('active');
            const parts = e.target.value.split('-');
            const prevH = self.currentDate ? self.currentDate.getHours() : 12;
            const prevM = self.currentDate ? self.currentDate.getMinutes() : 0;
            self.currentDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), prevH, prevM);
            self.render();
          }
        };
        this.el.datePicker.addEventListener('change', onDateChange);
        this.el.datePicker.addEventListener('input', onDateChange);
      }

      if (this.el.hourSelect) {
        const onHourChange = (e) => {
          self.isDestinyMode = false;
          if (self.el.btnDestiny) self.el.btnDestiny.classList.remove('active');
          self.currentHourIdx = parseInt(e.target.value, 10);
          const hHours = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];
          if (self.currentDate) {
            self.currentDate.setHours(hHours[self.currentHourIdx] || 12, 30, 0, 0);
          }
          self.render();
        };
        this.el.hourSelect.addEventListener('change', onHourChange);
        this.el.hourSelect.addEventListener('input', onHourChange);
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
      this.loadProfileDestiny();
    },

    render: function () {
      this.syncInputs();
      const chart = QiMenEngine.plot(this.currentDate, this.currentHourIdx, this.currentDate ? this.currentDate.getMinutes() : null);
      this.chartData = chart;

      // 0. Render Profile Destiny Banner (Top)
      if (this.el.profileDestinyBanner) {
        if (this.isDestinyMode && this.activeProfile) {
          const p = this.activeProfile;
          const destP = chart.palaces[chart.destinyPalaceNum];
          const destDir = destP ? `${destP.pos} • ${destP.dirZh} (${destP.dirEn})` : '';
          const deityName = destP && destP.deity ? `${destP.deity.zh} ${destP.deity.py} (${destP.deity.th})` : '-';
          const doorName = destP && destP.door ? `${destP.door.zh} ${destP.door.en} (${destP.door.th})` : '-';
          const starName = destP && destP.star ? `${destP.star.zh} ${destP.star.en} (${destP.star.th})` : '-';
          const dayStemZh = chart.fourPillars.day.stem.zh;
          const dayStemInfo = chart.fourPillars.day.stem;

          this.el.profileDestinyBanner.innerHTML = `
            <div class="qm-destiny-header-row">
              <div class="qm-destiny-title">
                <i class="fa-solid fa-crown" style="color: #f59e0b; font-size: 18px;"></i>
                <span>ผังชะตาชีวิตฉีเหมิน (Qi Men Destiny Chart): <strong>${p.name}</strong></span>
              </div>
              <div class="qm-destiny-pills">
                <span class="qm-destiny-pill"><i class="fa-solid fa-cake-candles"></i> วันเกิด: ${p.birthDate} เวลา ${p.birthTime || '12:00'}</span>
                <span class="qm-destiny-pill"><i class="fa-solid fa-yin-yang"></i> ก้านวันเกิด (Day Stem): ${dayStemZh} (${dayStemInfo.py} • ${dayStemInfo.en})</span>
              </div>
            </div>
            <div class="qm-destiny-summary-grid">
              <div class="qm-destiny-summary-item">
                <span class="lbl"><i class="fa-solid fa-compass"></i> วังชะตาชีวิตประจำตัว (Destiny Palace):</span>
                <span class="val" style="color: #d97706;">วังที่ ${chart.destinyPalaceNum} (${destDir})</span>
              </div>
              <div class="qm-destiny-summary-item">
                <span class="lbl"><i class="fa-solid fa-shield-cat"></i> เทพพิทักษ์ประจำตัว (Guardian Deity):</span>
                <span class="val" style="color: #7c3aed;">${deityName}</span>
              </div>
              <div class="qm-destiny-summary-item">
                <span class="lbl"><i class="fa-solid fa-door-open"></i> ประตูดวงชะตา (Destiny Door):</span>
                <span class="val" style="color: #059669;">${doorName}</span>
              </div>
              <div class="qm-destiny-summary-item">
                <span class="lbl"><i class="fa-solid fa-star"></i> ดาวสวรรค์ประจำตัว (Destiny Star):</span>
                <span class="val" style="color: #0284c7;">${starName}</span>
              </div>
            </div>
          `;
          this.el.profileDestinyBanner.style.display = 'flex';
        } else {
          this.el.profileDestinyBanner.style.display = 'none';
        }
      }

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
                <td class="val">${m.hourKongWang.top}<br>${m.hourKongWang.bot}</td>
                <td class="val">${m.dayKongWang.top}<br>${m.dayKongWang.bot}</td>
              </tr>
              <tr>
                <td class="lbl">Nobleman</td>
                <td class="val">${m.hourNobleman.top}<br>${m.hourNobleman.bot}</td>
                <td class="val">${m.dayNobleman.top}<br>${m.dayNobleman.bot}</td>
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
          const isDestiny = num === chart.destinyPalaceNum;

          if (num === 5) {
            // Center Palace
            return `
              <div class="qm-int-cell qm-cell-center ${isSelected ? 'selected' : ''} ${isDestiny ? 'qm-cell-destiny' : ''}" data-palace="${num}">
                ${isDestiny ? '<span class="qm-badge-destiny-crown" title="วังชะตาชีวิต (Destiny Palace)"><i class="fa-solid fa-crown"></i> 本命</span>' : ''}
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
            <div class="qm-int-cell ${isSelected ? 'selected' : ''} ${isDestiny ? 'qm-cell-destiny' : ''}" data-palace="${num}">
              ${isDestiny ? '<span class="qm-badge-destiny-crown" title="วังชะตาชีวิต (Destiny Palace)"><i class="fa-solid fa-crown"></i> 本命</span>' : ''}
              <!-- Direction Header Tag -->
              <div class="qm-cell-header-bar ${headerClass}">
                <span class="qm-hdr-dir">${p.pos}</span>
                <div class="qm-hdr-badges">
                  ${p.isKongWang ? '<span class="qm-badge-kong">空</span>' : ''}
                  ${p.isHorse ? '<span class="qm-badge-horse"><i class="fa-solid fa-horse"></i></span>' : ''}
                </div>
              </div>

              <!-- Top Row: Heaven Stem | 9 Star & 8 Deity (Centered) | Corner Num -->
              <div class="qm-int-row top-row">
                <div class="qm-elem-stem">
                  <span class="qm-char-big ${p.heavenStem.element.toLowerCase()}">${p.heavenStem.zh}${p.heavenStem.extra ? `<span class="extra">${p.heavenStem.extra}</span>` : ''}</span>
                  <span class="qm-py-sm">${p.heavenStem.py}</span>
                </div>
                <div class="qm-center-star-deity">
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
                </div>
                <div class="qm-corner-num">${p.numCorner}</div>
              </div>

              <!-- Middle Row: Hexagram / Formations -->
              <div class="qm-int-row mid-row">
                <div class="qm-hexagram-box">
                  ${p.hexagram ? `
                    <div class="qm-hex-line">${p.hexagram.stem} ${p.hexagram.gua1}</div>
                    <div class="qm-hex-line">${p.hexagram.branch} ${p.hexagram.gua2}</div>
                    <div class="qm-hex-name">${p.hexagram.name}</div>
                  ` : ''}
                </div>
                <div class="qm-formations-box">
                  ${p.formations.map(f => `<span class="qm-formation-text ${typeof f === 'object' ? f.color : 'red'}">${typeof f === 'object' ? f.name : f}</span>`).join('')}
                </div>
              </div>

              <!-- Bottom Row: Earth Stem | 8 Door (Centered with Envoy directly above) | Constellation -->
              <div class="qm-int-row bot-row">
                <div class="qm-elem-stem">
                  <span class="qm-char-big ${p.earthStem.element.toLowerCase()}">${p.earthStem.zh}${p.earthStem.extra ? `<span class="extra">${p.earthStem.extra}</span>` : ''}</span>
                  <span class="qm-py-sm">${p.earthStem.py}</span>
                </div>
                <div class="qm-center-door-wrap">
                  <div class="qm-elem-door">
                    ${p.door && p.door.isEnvoy ? '<span class="qm-envoy-pill">Envoy</span>' : ''}
                    <span class="qm-char-door ${p.door.type === '吉' ? 'good' : 'bad'}">${p.door.zh}</span>
                    <span class="qm-py-xs">${p.door.py}</span>
                    <span class="qm-en-xs">${p.door.en}</span>
                  </div>
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

      // 4. Render Right Sidebar Panels: 3 Victories (三胜)
      if (this.el.victoriesContainer) {
        const v = chart.victories;
        this.el.victoriesContainer.innerHTML = `
          <div class="qm-victory-card">
            <div class="qm-victory-header">
              <span><i class="fa-solid fa-trophy" style="color: #f59e0b;"></i> ชัยชนะทั้งสาม (3 Victories • 三胜)</span>
            </div>
            <div class="qm-victory-list">
              <div class="qm-victory-item victory-deity" data-palace="${v.deity.palaceNum}" style="cursor: pointer;" title="คลิกเพื่อเลือกดูวังนี้">
                <div class="qm-vic-title-row">
                  <span class="qm-vic-name"><i class="fa-solid fa-shield-cat" style="color: #8b5cf6;"></i> ${v.deity.title}</span>
                  <span class="qm-vic-dir-badge">${v.deity.pos} • ${v.deity.dirZh}</span>
                </div>
                <div class="qm-vic-entity">${v.deity.entity} (วัง ${v.deity.palaceNum} • ${v.deity.dirTh})</div>
                <p class="qm-vic-desc"><strong>กลยุทธ์:</strong> ${v.deity.action}</p>
              </div>
              <div class="qm-victory-item victory-door" data-palace="${v.door.palaceNum}" style="cursor: pointer;" title="คลิกเพื่อเลือกดูวังนี้">
                <div class="qm-vic-title-row">
                  <span class="qm-vic-name"><i class="fa-solid fa-door-open" style="color: #10b981;"></i> ${v.door.title}</span>
                  <span class="qm-vic-dir-badge">${v.door.pos} • ${v.door.dirZh}</span>
                </div>
                <div class="qm-vic-entity">${v.door.entity} (วัง ${v.door.palaceNum} • ${v.door.dirTh})</div>
                <p class="qm-vic-desc"><strong>กลยุทธ์:</strong> ${v.door.action}</p>
              </div>
              <div class="qm-victory-item victory-palace" data-palace="${v.palace.palaceNum}" style="cursor: pointer;" title="คลิกเพื่อเลือกดูวังนี้">
                <div class="qm-vic-title-row">
                  <span class="qm-vic-name"><i class="fa-solid fa-star" style="color: #f59e0b;"></i> ${v.palace.title}</span>
                  <span class="qm-vic-dir-badge">${v.palace.pos} • ${v.palace.dirZh}</span>
                </div>
                <div class="qm-vic-entity">${v.palace.entity} (วัง ${v.palace.palaceNum} • ${v.palace.dirTh})</div>
                <p class="qm-vic-desc"><strong>กลยุทธ์:</strong> ${v.palace.action}</p>
              </div>
            </div>
          </div>
        `;

        // Click on victory card to select palace
        const self = this;
        this.el.victoriesContainer.querySelectorAll('.qm-victory-item').forEach(item => {
          item.addEventListener('click', () => {
            const pNum = parseInt(item.getAttribute('data-palace'), 10);
            if (pNum) self.selectPalace(pNum);
          });
        });
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

      const isDestiny = this.chartData && p.num === this.chartData.destinyPalaceNum;
      const v = this.chartData ? this.chartData.victories : null;
      let victoryBadge = '';
      if (v) {
        if (p.num === v.deity.palaceNum) {
          victoryBadge = `
            <div class="qm-destiny-palace-banner" style="background: #f5f3ff; border-color: #8b5cf6;">
              <i class="fa-solid fa-shield-cat" style="color: #7c3aed;"></i>
              <div>
                <strong style="color: #6d28d9;">ทิศแห่งชัยชนะของทวยเทพ (Deity Victory • 神胜)</strong>
                <p style="color: #5b21b6;">วังที่ประทับของ ${v.deity.entity}: ${v.deity.action}</p>
              </div>
            </div>
          `;
        } else if (p.num === v.door.palaceNum) {
          victoryBadge = `
            <div class="qm-destiny-palace-banner" style="background: #ecfdf5; border-color: #10b981;">
              <i class="fa-solid fa-door-open" style="color: #059669;"></i>
              <div>
                <strong style="color: #065f46;">ทิศแห่งชัยชนะของประตูมงคล (Door Victory • 门胜)</strong>
                <p style="color: #047857;">วังที่ประทับของ ${v.door.entity}: ${v.door.action}</p>
              </div>
            </div>
          `;
        } else if (p.num === v.palace.palaceNum) {
          victoryBadge = `
            <div class="qm-destiny-palace-banner" style="background: #fffbeb; border-color: #f59e0b;">
              <i class="fa-solid fa-star" style="color: #d97706;"></i>
              <div>
                <strong style="color: #92400e;">ทิศแห่งชัยชนะของวังฟ้าดาวสวรรค์ (Palace Victory • 宫胜)</strong>
                <p style="color: #78350f;">วังฝ่ายตรงข้ามประธานทวยเทพ (${v.palace.entity}): ${v.palace.action}</p>
              </div>
            </div>
          `;
        }
      }

      const destinyBanner = isDestiny ? `
        <div class="qm-destiny-palace-banner">
          <i class="fa-solid fa-crown"></i>
          <div>
            <strong>👑 วังชะตาชีวิตประจำตัวคุณ (Your Destiny Palace • 本命宫)</strong>
            <p>เป็นวังประจำตัวตามก้านวันเกิด (${this.chartData.fourPillars.day.stem.zh} ${this.chartData.fourPillars.day.stem.en}) บ่งบอกตัวตนแท้จริง วาสนา จุดแข็ง เทพผู้พิทักษ์ และทิศทางแห่งความสำเร็จตลอดชีพ</p>
          </div>
        </div>
      ` : '';

      if (p.num === 5) {
        this.el.detailDrawer.innerHTML = `
          <div class="qm-detail-card">
            ${destinyBanner}
            ${victoryBadge}
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
          ${destinyBanner}
          ${victoryBadge}
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
