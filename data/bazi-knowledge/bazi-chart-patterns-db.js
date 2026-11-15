/**
 * Bazi Chart Patterns & Weighting Knowledge Database (ฐานข้อมูลการชั่งน้ำหนักดวง โครงสร้างดวง และทอง้วน)
 * อ้างอิงจากคลังตำราวิชาการ:
 * - "การชั่งน้ำหนักดวง.pdf"
 * - "ทอง้วน.pdf" (สำนักลิ้มแชเล้ง 林青龍宮)
 * - "ดวงพิเศษ.pdf"
 * - "ดวงแข็งแรงไปตามกระแส.pdf"
 */

var BaziChartPatternsDB = (function () {
  'use strict';

  const STEM_ELEMENTS = {
    '甲': 'Wood', '乙': 'Wood',
    '丙': 'Fire', '丁': 'Fire',
    '戊': 'Earth', '己': 'Earth',
    '庚': 'Metal', '辛': 'Metal',
    '壬': 'Water', '癸': 'Water'
  };

  const BRANCH_ELEMENTS = {
    '寅': 'Wood', '卯': 'Wood',
    '巳': 'Fire', '午': 'Fire',
    '辰': 'Earth', '戌': 'Earth', '丑': 'Earth', '未': 'Earth',
    '申': 'Metal', '酉': 'Metal',
    '亥': 'Water', '子': 'Water'
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

  return {
    /**
     * คำนวณเสาเดือนปฏิสนธิ (ทอง้วน 胎元 - Tai Yuan)
     * อ้างอิงตำราสำนักลิ้มแชเล้ง:
     * - ก้านฟ้าเดือน + 1
     * - กิ่งดินเดือน + 3
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
     * อ้างอิงเอกสาร: "การชั่งน้ำหนักดวง.pdf"
     * 8 ตัวในดวง โดยให้ฐานเดือน (Month Branch) คูณ 2 ทำให้คะแนนเต็มคือ 9 คะแนน
     */
    calculateChartWeight: function (dayStem, pillars) {
      const dmElement = STEM_ELEMENTS[dayStem];
      if (!dmElement) return null;

      const relations = ELEMENT_RELATIONS[dmElement];
      const elementWeights = {
        'Wood': 0,
        'Fire': 0,
        'Earth': 0,
        'Metal': 0,
        'Water': 0
      };

      // 4 Stems (Year, Month, Day, Hour) = 1 point each
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

      // Month Branch = 2 points (ฐานเดือนมีกำลัง 2 เท่า)
      if (pillars.month && pillars.month.branch && BRANCH_ELEMENTS[pillars.month.branch]) {
        elementWeights[BRANCH_ELEMENTS[pillars.month.branch]] += 2;
      }

      // Total scale = 9
      const supportScore = elementWeights[relations.self] + elementWeights[relations.resource];
      const drainScore = elementWeights[relations.output] + elementWeights[relations.wealth] + elementWeights[relations.power];

      let strengthType = '';
      let yongShen = [];
      let xiShen = [];
      let jiShen = []; // ธาตุให้โทษ

      // ตรวจสอบดวงพิเศษไปตามกระแส (从格)
      if (supportScore <= 1.5) {
        strengthType = 'ดวงพิเศษไปตามกระแส (从格 - Follow Pattern)';
        // ไปตามกระแสตัวที่มากที่สุด
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
        yongShen, // ธาตุปรับดวง (Useful God)
        xiShen,   // ธาตุส่งเสริม (Favorable)
        jiShen    // ธาตุขัดขวาง (Unfavorable)
      };
    }
  };
})();

if (typeof window !== 'undefined') window.BaziChartPatternsDB = BaziChartPatternsDB;
if (typeof globalThis !== 'undefined') globalThis.BaziChartPatternsDB = BaziChartPatternsDB;
if (typeof module !== 'undefined' && module.exports) module.exports = BaziChartPatternsDB;
