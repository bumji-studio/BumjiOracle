/**
 * Bazi Chart Patterns & Weighting Knowledge Database (ฐานข้อมูลการชั่งน้ำหนักดวง โครงสร้างดวง และทอง้วน)
 * 
 * ถ่ายทอดและเรียบเรียงตามสารบบวิชา:
 * "ฮวงจุ้ย ดวงจีน สามประสาน ฟ้า ดิน คน สำนักเฮียงเหล่งตึ้ง"
 * และตำราวิชาการ: "การชั่งน้ำหนักดวง", "ทอง้วน", "ดวงพิเศษ", "ดวงแข็งแรงไปตามกระแส"
 * 
 * ครอบคลุม:
 * 1. หลักการวิเคราะห์ดวงจีน 7 ขั้นตอน (Seven Steps BaZi Deep Analysis)
 * 2. การตรวจสอบการได้ฤดูกาล (得令 / 得时 - เสาเดือนคุม 40-50%)
 * 3. การตรวจสอบการได้พื้นที่หยั่งราก (得地 / 通根) และได้พวกพ้อง (得势)
 * 4. การตรวจสอบปฏิสัมพันธ์ภาคี (合) และปะทะชง (冲) ชงเปิดคลัง (开库)
 * 5. การชั่งน้ำหนักความแข็งแรงของดิถี (身强 vs 身弱)
 * 6. การจำแนก 3 กลุ่มโครงสร้างพิเศษ (特殊格局):
 *    - 从格 (ฉงเก็ก - โครงสร้างโอนอ่อนคล้อยตาม / Follow the Leader)
 *    - 专旺格 (จวนวั่งเก็ก - โครงสร้างธาตุพิเศษสุดขอบ / Dominant Element)
 *    - 化气格 (ฮั่วชี่เก็ก - โครงสร้างแปรเปลี่ยนธาตุ / Transformation)
 * 7. การกำหนดย้งซิ้ง (定用神): เถียวโหว (调候), ทงกวน (通关), ฝูอี้ (扶抑)
 */

var BaziChartPatternsDB = (function () {
  'use strict';

  const LINEAGE_METADATA = {
    schoolNameThai: 'ฮวงจุ้ย ดวงจีน สามประสาน ฟ้า ดิน คน สำนักเฮียงเหล่งตึ้ง',
    doctrine: 'การอ่านดวงจีนสี่เสา 7 ขั้นตอน และโครงสร้างพิเศษ ปาจื่อ (BaZi Special Structures)',
    tradition: 'ลู่หมิ่งซู่ (禄命术) & สารัตถะอู่สิง (五行气机) & หลานไถเมี่ยวเสวี่ยน (兰台妙选)',
    updatedAt: '2026-11-28'
  };

  const STEM_ELEMENTS = {
    '甲': 'Wood', '乙': 'Wood',
    '丙': 'Fire', '丁': 'Fire',
    '戊': 'Earth', '己': 'Earth',
    '庚': 'Metal', '辛': 'Metal',
    '壬': 'Water', '癸': 'Water'
  };

  const STEM_POLARITY = {
    '甲': 'Yang', '乙': 'Yin',
    '丙': 'Yang', '丁': 'Yin',
    '戊': 'Yang', '己': 'Yin',
    '庚': 'Yang', '辛': 'Yin',
    '壬': 'Yang', '癸': 'Yin'
  };

  const STEM_NATURE_TH = {
    '甲': 'ไม้ใหญ่ ไม้ยืนต้นสูงตระหง่าน แข็งแกร่ง มุ่งมั่น ตรงไปตรงมา',
    '乙': 'ไม้พุ่ม ไม้เลื้อย พืชดอก ฉ่ำน้ำ อ่อนโยน ปรับตัวเก่ง',
    '丙': 'ไฟแสงอาทิตย์ เจิดจ้า สว่างไสว อบอุ่น เปิดเผย มีเกียรติ',
    '丁': 'ไฟเทียน ไฟตะเกียง แสงประทีป ส่องทางในความมืด อบอุ่น ละเมียดละไม',
    '戊': 'ดินกำแพงเมือง ดินภูเขา ดินเขื่อน หนักแน่น มั่นคง ซื่อสัตย์ อดทน',
    '己': 'ดินสวน ดินโคลนชุ่มน้ำ อุดมสมบูรณ์ โอบอ้อมอารี ยืดหยุ่น',
    '庚': 'ทองแร่ดิบ ดาบโลหะ ขวานใหญ่ เด็ดขาด กล้าหาญ รักความยุติธรรม',
    '辛': 'ทองรูปพรรณ ปิ่นปักผม เพชรนิลจินดา ประณีต สง่างาม รสนิยมสูง',
    '壬': 'น้ำมหาสมุทร แม่น้ำใหญ่ กระแสน้ำเชี่ยวกราก พลังขับเคลื่อน ทรงพลัง',
    '癸': 'น้ำค้าง ฝนพรำ ละอองหมอก น้ำบาดาล ละเอียดอ่อน ซึมลึก ไหวพริบสูง'
  };

  const BRANCH_ELEMENTS = {
    '寅': 'Wood', '卯': 'Wood',
    '巳': 'Fire', '午': 'Fire',
    '辰': 'Earth', '戌': 'Earth', '丑': 'Earth', '未': 'Earth',
    '申': 'Metal', '酉': 'Metal',
    '亥': 'Water', '子': 'Water'
  };

  const BRANCH_SEASONS = {
    '寅': { season: 'Spring', seasonTh: 'ต้นฤดูใบไม้ผลิ', element: 'Wood' },
    '卯': { season: 'Spring', seasonTh: 'กลางฤดูใบไม้ผลิ', element: 'Wood' },
    '辰': { season: 'Spring/Earth', seasonTh: 'ปลายฤดูใบไม้ผลิ (คลังน้ำ)', element: 'Earth' },
    '巳': { season: 'Summer', seasonTh: 'ต้นฤดูร้อน', element: 'Fire' },
    '午': { season: 'Summer', seasonTh: 'กลางฤดูร้อน', element: 'Fire' },
    '未': { season: 'Summer/Earth', seasonTh: 'ปลายฤดูร้อน (คลังไม้)', element: 'Earth' },
    '申': { season: 'Autumn', seasonTh: 'ต้นฤดูใบไม้ร่วง', element: 'Metal' },
    '酉': { season: 'Autumn', seasonTh: 'กลางฤดูใบไม้ร่วง', element: 'Metal' },
    '戌': { season: 'Autumn/Earth', seasonTh: 'ปลายฤดูใบไม้ร่วง (คลังไฟ)', element: 'Earth' },
    '亥': { season: 'Winter', seasonTh: 'ต้นฤดูหนาว', element: 'Water' },
    '子': { season: 'Winter', seasonTh: 'กลางฤดูหนาว', element: 'Water' },
    '丑': { season: 'Winter/Earth', seasonTh: 'ปลายฤดูหนาว (คลังทอง)', element: 'Earth' }
  };

  const ELEMENT_RELATIONS = {
    'Wood': { self: 'Wood', resource: 'Water', output: 'Fire', wealth: 'Earth', power: 'Metal' },
    'Fire': { self: 'Fire', resource: 'Wood', output: 'Earth', wealth: 'Metal', power: 'Water' },
    'Earth': { self: 'Earth', resource: 'Fire', output: 'Metal', wealth: 'Water', power: 'Wood' },
    'Metal': { self: 'Metal', resource: 'Earth', output: 'Water', wealth: 'Wood', power: 'Fire' },
    'Water': { self: 'Water', resource: 'Metal', output: 'Wood', wealth: 'Fire', power: 'Earth' }
  };

  const STEMS_ORDER = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const BRANCHES_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  // 1. คู่ภาคี 5 ธาตุบนฟ้า (天干五合)
  const STEM_COMBINATIONS = [
    { stems: ['甲', '己'], transformElement: 'Earth', nameTh: 'กะ-กี้ ภาคีแปรธาตุดิน (甲己合化土)' },
    { stems: ['乙', '庚'], transformElement: 'Metal', nameTh: 'อิก-แก ภาคีแปรธาตุทอง (乙庚合化金)' },
    { stems: ['丙', '辛'], transformElement: 'Water', nameTh: 'เปี้ย-ซิง ภาคีแปรธาตุน้ำ (丙辛合化水)' },
    { stems: ['丁', '壬'], transformElement: 'Wood', nameTh: 'เต็ง-หยิม ภาคีแปรธาตุไม้ (丁壬合化木)' },
    { stems: ['戊', '癸'], transformElement: 'Fire', nameTh: 'โบ่ว-กุ่ย ภาคีแปรธาตุไฟ (戊癸合化火)' }
  ];

  // 2. คู่ชง 6 คู่บนดิน (地支六冲)
  const BRANCH_CLASHES = [
    { branches: ['子', '午'], nameTh: 'ชวดชงมะเมีย (子午冲 - น้ำชงไฟ)' },
    { branches: ['丑', '未'], nameTh: 'ฉลูชงมะแม (丑未冲 - ดินชงเปิดคลัง)' },
    { branches: ['寅', '申'], nameTh: 'ขาลชงวอก (寅申冲 - ม้าชนม้า ไม้ชงทอง)' },
    { branches: ['卯', '酉'], nameTh: 'เถาะชงระกา (卯酉冲 - ไม้ชงทอง)' },
    { branches: ['辰', '戌'], nameTh: 'มะโรงชงจอ (辰戌冲 - ดินชงเปิดคลัง)' },
    { branches: ['巳', '亥'], nameTh: 'มะเส็งชงกุน (巳亥冲 - ม้าชนม้า ไฟชงน้ำ)' }
  ];

  // 3. โครงสร้างพิเศษ ปาจื่อ 3 กลุ่มหลัก (Special Structures)
  const SPECIAL_STRUCTURES_CATALOG = {
    CONG_GE: {
      nameZh: '从格',
      nameTh: 'ฉงเก็ก (โครงสร้างโอนอ่อนคล้อยตาม / Follow the Leader)',
      concept: 'ดิถีอ่อนแอถึงขีดสุด ไม่มีรากฐานค้ำยันแม้แต่น้อย ไม่มีดาวแม่หรือดาวเพื่อนมาช่วยเลยแม้แต่ตัวเดียว และในดวงเต็มไปด้วยธาตุอื่นที่ครองอำนาจเด็ดขาด จึงยอมสวามิภักดิ์คล้อยตามกระแสพลังที่แข็งแกร่งที่สุดในดวง',
      subTypes: [
        {
          nameZh: '从财格',
          nameTh: 'ฉงไฉเก็ก (คล้อยตามดาวทรัพย์)',
          dominant: 'Wealth (ดาวทรัพย์ 财)',
          prediction: 'ร่ำรวยมหาศาลจากธุรกิจและการค้า เดินวัยจรส่งเสริมทรัพย์จะกลายเป็นมหาเศรษฐี',
          caution: 'กลัวดาวส่งเสริมหรือดาวเพื่อนโผล่เข้ามาขัดขวางกระแส'
        },
        {
          nameZh: '从杀格',
          nameTh: 'ฉงซั่วเก็ก (คล้อยตามดาวอำนาจ/ขุนนาง)',
          dominant: 'Power (ดาวอำนาจ 官/杀)',
          prediction: 'มีบารมีและตำแหน่งหน้าที่การงานสูงส่ง เป็นใหญ่เป็นโตในวงการข้าราชการหรือผู้บริหาร',
          caution: 'กลัวดาวแม่หรือดาวเพื่อนเข้ามาต้านกระแส'
        },
        {
          nameZh: '从儿格',
          nameTh: 'ฉงเอ๋อร์เก็ก (คล้อยตามดาวถ่ายเท/บุตร)',
          dominant: 'Output (ดาวถ่ายเท 食/伤)',
          prediction: 'มีความสามารถ สติปัญญา ศิลปะ และความคิดสร้างสรรค์ล้ำเลิศ นำพาความมั่งคั่งมาให้',
          caution: 'กลัวดาวแม่ (印) เข้ามาพิฆาตดาวถ่ายเท'
        }
      ],
      warningRule: 'ข้อควรระวัง: หากมีธาตุส่งเสริมดิถีโผล่เข้ามาขัดขวางกระแสเพียงตัวเดียว เรียกว่า "คล้อยตามไม่สุด (假从)" ชีวิตจะผกผันและเกิดวิกฤตครั้งใหญ่'
    },

    ZHUAN_WANG_GE: {
      nameZh: '专旺格',
      nameTh: 'จวนวั่งเก็ก (โครงสร้างครองอำนาจธาตุเอกเทศ / Dominant Element)',
      concept: 'ตรงข้ามกับดวงคล้อยตาม คือทั้งดวงชะตาแทบจะมีแต่ธาตุเดียวกับดิถีเพียงอย่างเดียว ไร้ธาตุพิฆาตเข้ามาเจือปน ต้องส่งเสริมให้ธาตุนั้นพุ่งทะยานต่อไป ห้ามนำธาตุพิฆาตเข้ามาขัดขวางเด็ดขาด',
      subTypes: [
        {
          nameZh: '曲直格',
          nameTh: 'ชวีจื๋อเก็ก (โครงสร้างไม้ครองอำนาจ)',
          element: 'Wood',
          description: 'ดิถีไม้ (甲/乙) เกิดในฤดูใบไม้ผลิ (寅/卯/辰) หรือร่วมซาฮะไม้ (亥卯未) ทั้งดวงเต็มไปด้วยไม้',
          favorable: 'Wood, Water, Fire',
          taboo: 'Metal (ห้ามทองพิฆาตเด็ดขาด)'
        },
        {
          nameZh: '炎上格',
          nameTh: 'เหยียนซ่างเก็ก (โครงสร้างไฟครองอำนาจ)',
          element: 'Fire',
          description: 'ดิถีไฟ (丙/丁) เกิดในฤดูร้อน (巳/午/未) หรือร่วมซาฮะไฟ (寅午戌) ทั้งดวงเต็มไปด้วยไฟ',
          favorable: 'Fire, Wood, Earth',
          taboo: 'Water (ห้ามน้ำดับไฟเด็ดขาด)'
        },
        {
          nameZh: '稼穑格',
          nameTh: 'เจี้ยเซ่อเก็ก (โครงสร้างดินครองอำนาจ)',
          element: 'Earth',
          description: 'ดิถีดิน (戊/己) เกิดในเดือน 4 สุสาน (辰/戌/丑/未) ไร้ไม้เข้ามาพิฆาต',
          favorable: 'Earth, Fire, Metal',
          taboo: 'Wood (ห้ามไม้เจาะดิน)'
        },
        {
          nameZh: '从革格',
          nameTh: 'ฉงเก๋อเก็ก (โครงสร้างทองครองอำนาจ)',
          element: 'Metal',
          description: 'ดิถีทอง (庚/辛) เกิดในฤดูใบไม้ร่วง (申/酉/戌) หรือร่วมซาฮะทอง (巳酉丑) ทั้งดวงเต็มไปด้วยทอง',
          favorable: 'Metal, Earth, Water',
          taboo: 'Fire (ห้ามไฟหลอมทอง)'
        },
        {
          nameZh: '润下格',
          nameTh: 'รุ่นเซี่ยเก็ก (โครงสร้างน้ำครองอำนาจ)',
          element: 'Water',
          description: 'ดิถีน้ำ (壬/癸) เกิดในฤดูหนาว (亥/子/丑) หรือร่วมซาฮะน้ำ (申子辰) ทั้งดวงเต็มไปด้วยน้ำ',
          favorable: 'Water, Metal, Wood',
          taboo: 'Earth (ห้ามดินกั้นน้ำ)'
        }
      ]
    },

    HUA_QI_GE: {
      nameZh: '化气格',
      nameTh: 'ฮั่วชี่เก็ก (โครงสร้างภาคีแปรเปลี่ยนธาตุ / Transformation)',
      concept: 'ดิถีจับคู่ภาคีกับราศีบนตัวข้างเคียง (เสาปี-เดือน หรือ เสาเดือน-วัน หรือ เสาวัน-ยาม) และเกิดในฤดูกาลที่หนุนนำการแปรสภาพ ทำให้ดิถีสละธาตุเดิมของตนแล้วแปลงกายเป็นธาตุใหม่ตามคู่ภาคีอย่างสมบูรณ์',
      rules: [
        '甲 ภาคี 己 แปรเป็น ดิน (ต้องเกิดในเดือน 辰, 戌, 丑, 未 หรือ 巳, 午)',
        '乙 ภาคี 庚 แปรเป็น ทอง (ต้องเกิดในเดือน 申, 酉 หรือ 巳, 丑)',
        '丙 ภาคี 辛 แปรเป็น น้ำ (ต้องเกิดในเดือน 亥, 子 หรือ 申, 辰)',
        '丁 ภาคี 壬 แปรเป็น ไม้ (ต้องเกิดในเดือน 寅, 卯 หรือ 亥, 未)',
        '戊 ภาคี 癸 แปรเป็น ไฟ (ต้องเกิดในเดือน 巳, 午 หรือ 寅, 戌)'
      ]
    }
  };

  // 4. หลักการกำหนดย้งซิ้ง 3 ประการ (Yong Shen Principles)
  const YONG_SHEN_PRINCIPLES = {
    TIAO_HOU: {
      nameZh: '调候',
      nameTh: 'เถียวโหว (การปรับอุณหภูมิความสมดุลภูมิอากาศ)',
      rule: 'หากดวงร้อนแล้งจัด นำน้ำเข้ามาปรับอุณหภูมิให้ชุ่มชื้น; หากดวงหนาวเหน็บเยือกแข็ง นำไฟเข้ามาให้ความอบอุ่น ละลายน้ำแข็งให้พืชพันธุ์งอกงาม'
    },
    TONG_GUAN: {
      nameZh: '通关',
      nameTh: 'ทงกวน (การสร้างสะพานเชื่อมคลี่คลายการปะทะ)',
      rule: 'หากสองธาตุแข็งแกร่งกำลังทำศึกประหัตประหารกัน นำธาตุตัวกลางเข้ามาเป็นสะพานเชื่อมเปลี่ยนแรงปะทะเป็นกระแสหนุนเนื่อง เช่น ไม้สู้กับทอง ใช้น้ำเป็นสะพานเชื่อม (ทองกำเนิดน้ำ น้ำกำเนิดไม้)'
    },
    FU_YI: {
      nameZh: '扶抑',
      nameTh: 'ฝูอี้ (การค้ำจุนดวงอ่อนและควบคุมดวงแข็ง)',
      rule: 'ดวงอ่อนแอ (身弱) ใช้ดาวแม่ (印) และดาวเพื่อน (比/劫) เข้ามาค้ำยัน; ดวงแข็งแรง (身强) ใช้ดาวถ่ายเท (食/伤), ดาวทรัพย์ (财), และดาวอำนาจ (官/杀) เข้ามาระบายและควบคุม'
    }
  };

  return {
    metadata: LINEAGE_METADATA,
    stemElements: STEM_ELEMENTS,
    branchElements: BRANCH_ELEMENTS,
    specialStructures: SPECIAL_STRUCTURES_CATALOG,
    yongShenPrinciples: YONG_SHEN_PRINCIPLES,
    getStemNature: function (stem) { return STEM_NATURE_TH[stem] || ''; },

    /**
     * คำนวณเสาเดือนปฏิสนธิ (ทอง้วน 胎元 - Tai Yuan)
     */
    calculateTaiYuan: function (monthStem, monthBranch) {
      const stemIdx = STEMS_ORDER.indexOf(monthStem);
      const branchIdx = BRANCHES_ORDER.indexOf(monthBranch);
      if (stemIdx === -1 || branchIdx === -1) return null;

      const taiYuanStem = STEMS_ORDER[(stemIdx + 1) % 10];
      const taiYuanBranch = BRANCHES_ORDER[(branchIdx + 3) % 12];

      return {
        stem: taiYuanStem,
        branch: taiYuanBranch,
        pillar: `${taiYuanStem}${taiYuanBranch}`,
        thai: 'ทอง้วน (เดือนปฏิสนธิ)',
        meaning: 'พรที่ได้รับมาจากสวรรค์และรากฐานของชีวิต สุขภาพแรกเกิด และความสัมพันธ์ของสายตระกูล'
      };
    },

    /**
     * ชั่งน้ำหนักดวงชะตา (Chart Weighting System)
     */
    calculateChartWeight: function (dayStem, pillars) {
      const dmElement = STEM_ELEMENTS[dayStem];
      if (!dmElement) return null;

      const relations = ELEMENT_RELATIONS[dmElement];
      const elementWeights = { 'Wood': 0, 'Fire': 0, 'Earth': 0, 'Metal': 0, 'Water': 0 };

      // 4 Stems = 1 point each
      for (const p of [pillars.year, pillars.month, pillars.day, pillars.hour]) {
        if (p && p.stem && STEM_ELEMENTS[p.stem]) {
          elementWeights[STEM_ELEMENTS[p.stem]] += 1;
        }
      }

      // Year, Day, Hour Branches = 1 point each
      for (const p of [pillars.year, pillars.day, pillars.hour]) {
        if (p && p.branch && BRANCH_ELEMENTS[p.branch]) {
          elementWeights[BRANCH_ELEMENTS[p.branch]] += 1;
        }
      }

      // Month Branch = 2 points
      if (pillars.month && pillars.month.branch && BRANCH_ELEMENTS[pillars.month.branch]) {
        elementWeights[BRANCH_ELEMENTS[pillars.month.branch]] += 2;
      }

      const supportScore = elementWeights[relations.self] + elementWeights[relations.resource];
      const drainScore = elementWeights[relations.output] + elementWeights[relations.wealth] + elementWeights[relations.power];

      let strengthType = '';
      let yongShen = [];
      let xiShen = [];
      let jiShen = [];

      if (supportScore <= 1.5) {
        strengthType = 'ดวงพิเศษไปตามกระแส (从格 - Follow Pattern)';
        if (elementWeights[relations.wealth] >= 4) {
          yongShen = [relations.wealth];
          xiShen = [relations.output];
          jiShen = [relations.self, relations.resource];
        } else if (elementWeights[relations.power] >= 4) {
          yongShen = [relations.power];
          xiShen = [relations.wealth];
          jiShen = [relations.self, relations.resource];
        } else {
          yongShen = [relations.output];
          xiShen = [relations.wealth];
          jiShen = [relations.self, relations.resource];
        }
      } else if (supportScore >= 7.5) {
        strengthType = 'ดวงแข็งแรงตามกระแสแห่งตน (从旺格 / 专旺格)';
        yongShen = [relations.self];
        xiShen = [relations.resource];
        jiShen = [relations.power, relations.wealth];
      } else if (supportScore >= 4.5) {
        strengthType = 'ดวงแข็งแรง (身旺 - Strong)';
        yongShen = [relations.wealth, relations.power];
        xiShen = [relations.output];
        jiShen = [relations.resource, relations.self];
      } else {
        strengthType = 'ดวงอ่อนแอ (身弱 - Weak)';
        yongShen = [relations.resource];
        xiShen = [relations.self];
        jiShen = [relations.wealth, relations.power, relations.output];
      }

      return {
        dayMasterElement: dmElement,
        elementWeights,
        totalScore: 9,
        supportScore,
        drainScore,
        strengthType,
        yongShen,
        xiShen,
        jiShen
      };
    },

    /**
     * การวิเคราะห์ดวงจีน 7 ขั้นตอนตามตำราโบราณ (Seven Steps BaZi Analysis)
     * ครอบคลุม: ดิถี, ฤดูกาลเสาเดือน (得令), รากฐาน (得地/通根), พวกพ้อง (得势),
     * ปฏิสัมพันธ์ (合/冲), สรุปความแข็งแรง (身强/身弱), ดวงโครงสร้างพิเศษ (从格/专旺/化气),
     * และการกำหนดย้งซิ้ง (调候/通关/扶抑)
     */
    analyzeSevenSteps: function (chart) {
      if (!chart || !chart.pillars) return null;
      const dp = chart.pillars.day;
      const mp = chart.pillars.month;
      if (!dp || !dp.stem || !mp || !mp.branch) return null;

      const dayStemZh = dp.stem.zh;
      const dmElement = STEM_ELEMENTS[dayStemZh];
      const dmPolarity = STEM_POLARITY[dayStemZh];
      const monthBranchZh = mp.branch.zh;

      // STEP 1: กำหนดตัวตนดิถี
      const step1 = {
        title: 'ขั้นตอนที่ 1: กำหนดตัวตน — "ดิถีคือใคร และคือธาตุอะไร"',
        dayMaster: dayStemZh,
        element: dmElement,
        polarity: dmPolarity,
        natureDescription: STEM_NATURE_TH[dayStemZh] || ''
      };

      // STEP 2: ตรวจสอบพลังแห่งฟ้า (得时 / 得令 vs 失令)
      const mSeasonInfo = BRANCH_SEASONS[monthBranchZh];
      const rel = ELEMENT_RELATIONS[dmElement];
      const isSameElementSeason = (mSeasonInfo.element === dmElement);
      const isResourceSeason = (mSeasonInfo.element === rel.resource);
      const isDeLing = (isSameElementSeason || isResourceSeason);

      const step2 = {
        title: 'ขั้นตอนที่ 2: ตรวจสอบพลังแห่งฟ้า — "เกิดได้ฤดูกาลหรือไม่"',
        monthBranch: monthBranchZh,
        monthSeasonTh: mSeasonInfo.seasonTh,
        isDeLing: isDeLing,
        verdict: isDeLing
          ? `ได้ฤดูกาล (得令 - เต็กเหล่ง): เกิดในเดือน ${monthBranchZh} (${mSeasonInfo.seasonTh}) ซึ่งเป็น${isSameElementSeason ? 'ธาตุเดียวกับตนเอง' : 'ธาตุที่ให้กำเนิดตนเอง'} ฐานเดือนคุมชะตา 40-50% ค้ำจุนพลังชีวิตให้มีรากฐานแข็งแกร่งตั้งแต่กำเนิด`
          : `เสียฤดูกาล (失令 - ซิดเหล่ง): เกิดในเดือน ${monthBranchZh} (${mSeasonInfo.seasonTh}) ซึ่งธาตุอื่นเข้ามาดูดซับหรือพิฆาต ดิถีจึงตั้งต้นด้วยความบอบบางและต้องการตัวช่วยจากเสาอื่น`
      };

      // STEP 3: ตรวจสอบพลังแห่งดินและผู้ช่วย (得地 / 通根 & 得势)
      const roots = [];
      ['year', 'month', 'day', 'hour'].forEach(pKey => {
        const p = chart.pillars[pKey];
        if (p && p.branch && p.branch.zh) {
          const bElem = BRANCH_ELEMENTS[p.branch.zh];
          if (bElem === dmElement) {
            roots.push({ pillarRole: pKey, pillarLabel: p.label, branchZh: p.branch.zh, rootType: 'รากตรงธาตุหลัก' });
          }
        }
      });

      const helperStems = [];
      ['year', 'month', 'hour'].forEach(pKey => {
        const p = chart.pillars[pKey];
        if (p && p.stem && p.stem.zh) {
          const sElem = STEM_ELEMENTS[p.stem.zh];
          if (sElem === dmElement || sElem === rel.resource) {
            helperStems.push({ pillarRole: pKey, pillarLabel: p.label, stemZh: p.stem.zh });
          }
        }
      });

      const isDeDi = roots.length > 0;
      const isDeShi = helperStems.length > 0;

      const step3 = {
        title: 'ขั้นตอนที่ 3: ตรวจสอบพลังแห่งดินและผู้ช่วย — "ได้พื้นที่และได้พวกพ้องหรือไม่"',
        isDeDi: isDeDi,
        roots: roots,
        isDeShi: isDeShi,
        helpers: helperStems,
        summary: (isDeDi ? `ได้พื้นที่หยั่งราก (得地 / 通根): มีรากแก้วที่ ${roots.map(r => `${r.pillarLabel} [${r.branchZh}]`).join(', ')}. ` : 'ไร้รากแก้วตรงธาตุ (ไม่得地). ') +
          (isDeShi ? `ได้พวกพ้องหนุนกำลัง (得势): มีดาวแม่/ดาวเพื่อนปรากฏที่ ${helperStems.map(h => `${h.pillarLabel} [${h.stemZh}]`).join(', ')}.` : 'ขาดดาวพวกพ้องบนฟ้า.')
      };

      // STEP 4: การตรวจสอบปฏิสัมพันธ์ (合 / 冲)
      const activeClashes = [];
      const branchList = [];
      ['year', 'month', 'day', 'hour'].forEach(pKey => {
        const p = chart.pillars[pKey];
        if (p && p.branch && p.branch.zh) branchList.push({ role: pKey, label: p.label, branchZh: p.branch.zh });
      });

      for (let i = 0; i < branchList.length; i++) {
        for (let j = i + 1; j < branchList.length; j++) {
          const clashMatch = BRANCH_CLASHES.find(c => 
            (c.branches[0] === branchList[i].branchZh && c.branches[1] === branchList[j].branchZh) ||
            (c.branches[1] === branchList[i].branchZh && c.branches[0] === branchList[j].branchZh)
          );
          if (clashMatch) {
            activeClashes.push({
              pair: [branchList[i].label, branchList[j].label],
              branches: [branchList[i].branchZh, branchList[j].branchZh],
              description: clashMatch.nameTh
            });
          }
        }
      }

      const step4 = {
        title: 'ขั้นตอนที่ 4: การตรวจสอบปฏิสัมพันธ์ — "มีคู่สมพงษ์ (ฮะ) หรือการปะทะ (ชง) หรือไม่"',
        clashes: activeClashes,
        summary: activeClashes.length > 0
          ? `พบการปะทะชงในดวง: ${activeClashes.map(c => `${c.pair.join(' ชง ')} (${c.description})`).join(', ')}`
          : 'ไม่มีคู่ชงตรงหลักกิ่งดินในผังดวง พลังงานมีความสงบและมั่นคง'
      };

      // STEP 5: สรุปความแข็งแรงของดิถี
      const simplifiedPillars = {
        year: { stem: chart.pillars.year ? chart.pillars.year.stem.zh : '', branch: chart.pillars.year ? chart.pillars.year.branch.zh : '' },
        month: { stem: chart.pillars.month ? chart.pillars.month.stem.zh : '', branch: chart.pillars.month ? chart.pillars.month.branch.zh : '' },
        day: { stem: chart.pillars.day ? chart.pillars.day.stem.zh : '', branch: chart.pillars.day ? chart.pillars.day.branch.zh : '' },
        hour: { stem: chart.pillars.hour ? chart.pillars.hour.stem.zh : '', branch: chart.pillars.hour ? chart.pillars.hour.branch.zh : '' }
      };
      const weightCalc = this.calculateChartWeight(dayStemZh, simplifiedPillars);

      const isStrong = (weightCalc && weightCalc.supportScore >= 4.5);
      const step5 = {
        title: 'ขั้นตอนที่ 5: สรุปความแข็งแรงของดิถี — "ดวงแข็ง (身强) หรือ ดวงอ่อน (身弱)"',
        strengthType: weightCalc ? weightCalc.strengthType : (isStrong ? '身旺 / 身强 (ดวงแข็งแรง)' : '身弱 (ดวงอ่อนแอ)'),
        supportScore: weightCalc ? weightCalc.supportScore : 0,
        drainScore: weightCalc ? weightCalc.drainScore : 0,
        guidance: isStrong
          ? 'หลักการปรับดวงแข็ง: ดั่งคนตัวใหญ่แข็งแรงล้นเหลือ สิ่งที่ดวงต้องการ (用神) คือ การถ่ายเท (ดาวสติปัญญา 食/伤), การควบคุม (ดาวอำนาจ 官/杀) และการนำพลังไปหาประโยชน์ (ดาวทรัพย์ 财) ไม่ชอบให้ดาวแม่หรือดาวเพื่อนเข้ามาหนุนเพิ่ม'
          : 'หลักการปรับดวงอ่อน: ดั่งคนป่วยหรือเด็กเล็ก สิ่งที่ดวงต้องการมากที่สุดคือ ดาวอุปถัมภ์ (印 - แม่/ความรู้) และดาวเพื่อนร่วมธาตุ (比/劫 - พันธมิตร/กำลังเสริม) เพื่อเข้ามาค้ำยันให้ดิถียืนหยัดได้ และกลัวการถูกรุมดูดพลังหรือพิฆาตซ้ำเติม'
      };

      // STEP 6: ตรวจสอบโครงสร้างพิเศษ (特殊格局)
      let specialStructureFound = null;
      if (weightCalc && weightCalc.supportScore <= 1.5) {
        specialStructureFound = {
          type: '从格 (ฉงเก็ก - โครงสร้างโอนอ่อนคล้อยตาม / Follow the Leader)',
          details: SPECIAL_STRUCTURES_CATALOG.CONG_GE
        };
      } else if (weightCalc && weightCalc.supportScore >= 7.5) {
        specialStructureFound = {
          type: '专旺格 (จวนวั่งเก็ก - โครงสร้างธาตุพิเศษสุดขอบ / Dominant Element)',
          details: SPECIAL_STRUCTURES_CATALOG.ZHUAN_WANG_GE
        };
      }

      const step6 = {
        title: 'ขั้นตอนที่ 6: การจำแนกดวงโครงสร้างพิเศษ (特殊格局)',
        hasSpecialStructure: !!specialStructureFound,
        structure: specialStructureFound ? specialStructureFound : 'ดวงอยู่ในเกณฑ์โครงสร้างปกติ (正格 - ปรับสมดุลตามหลักดวงแข็ง/ดวงอ่อน)'
      };

      // STEP 7: กำหนดย้งซิ้งและการทำนายชีวิต (定用神)
      let tiaoHouRecommend = '';
      if (['巳', '午', '未'].includes(monthBranchZh)) {
        tiaoHouRecommend = 'เกิดในฤดูร้อน สภาพดวงมีความร้อนแล้งสูง ต้องใช้หลัก "เถียวโหว (调候)" นำธาตุน้ำเข้ามาปรับอุณหภูมิให้ชุ่มชื้น พืชพันธุ์จึงจะเติบโตได้';
      } else if (['亥', '子', '丑'].includes(monthBranchZh)) {
        tiaoHouRecommend = 'เกิดในฤดูหนาว สภาพดวงมีความเยือกแข็ง ต้องใช้หลัก "เถียวโหว (调候)" นำธาตุไฟเข้ามาให้ความอบอุ่น ละลายน้ำแข็งเพื่อปลุกพลังชีวิต';
      }

      const step7 = {
        title: 'ขั้นตอนที่ 7: การกำหนดย้งซิ้งและการทำนายชีวิต (定用神)',
        fuYiYongShen: weightCalc ? weightCalc.yongShen : [],
        tiaoHou: tiaoHouRecommend,
        summary: `ย้งซิ้งปรับสมดุล (扶抑用神): ${weightCalc && weightCalc.yongShen ? weightCalc.yongShen.join(', ') : '-'} ${tiaoHouRecommend ? `| ${tiaoHouRecommend}` : ''}`
      };

      return {
        lineage: LINEAGE_METADATA.schoolNameThai,
        step1: step1,
        step2: step2,
        step3: step3,
        step4: step4,
        step5: step5,
        step6: step6,
        step7: step7,
        overallVerdict: `${step1.dayMaster} (${step1.element}) | ${step2.isDeLing ? '得令 (ได้ฤดูกาล)' : '失令 (เสียฤดูกาล)'} | ${step5.strengthType}`
      };
    }
  };
})();

if (typeof window !== 'undefined') window.BaziChartPatternsDB = BaziChartPatternsDB;
if (typeof globalThis !== 'undefined') globalThis.BaziChartPatternsDB = BaziChartPatternsDB;
if (typeof module !== 'undefined' && module.exports) module.exports = BaziChartPatternsDB;
