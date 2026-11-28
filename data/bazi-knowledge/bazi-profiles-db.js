/**
 * Bazi Knowledge Base - 5 Structures & 10 Profiles Strength Database & Calculator
 * (โมดูลคำนวณและแสดงผล 5 โครงสร้างชะตา 五型格 และ 10 โพรไฟล์สิบเทพ 十神格)
 * 
 * ถ่ายทอดตามมาตรฐานวิชา BaZi Profiling System:
 * 1. 5 Structures (五型格):
 *    - Managers / 管理型 (Wealth Structure - 偏财/正财)
 *    - Supporters / 忠诚型 (Influence Structure - 正官/七杀)
 *    - Thinkers / 智慧型 (Resources Structure - 正印/偏印)
 *    - Connectors / 交际型 (Companion Structure - 比肩/劫财)
 *    - Creators / 创作型 (Output Structure - 食神/伤官)
 * 
 * 2. 10 Profiles (十神格):
 *    - The Pioneer (Indirect Wealth) 偏财格
 *    - The Director (Direct Wealth) 正财格
 *    - The Friend (Friend) 比肩格
 *    - The Leader (Rob Wealth) 劫财格
 *    - The Artist (Eating God) 食神格
 *    - The Performer (Hurting Officer) 伤官格
 *    - The Diplomat (Direct Officer) 正官格
 *    - The Warrior (Seven Killings) 七杀格
 *    - The Analyzer (Direct Resource) 正印格
 *    - The Philosopher (Indirect Resource) 偏印格
 */

var BaziProfilesDB = (function () {
  'use strict';

  // 1. Definition of the 10 Profiles
  const TEN_PROFILES = [
    {
      godZh: '偏财',
      godTh: 'เพี้ยงใช้',
      enName: 'The Pioneer',
      godEn: 'Indirect Wealth',
      patternZh: '偏财格',
      structureKey: 'wealth',
      descTh: 'นักบุกเบิก มุ่งมั่น โอกาสใหม่ ลาภลอย การลงทุน คล่องตัวในการหมุนเงิน'
    },
    {
      godZh: '正财',
      godTh: 'เจี้ยใช้',
      enName: 'The Director',
      godEn: 'Direct Wealth',
      patternZh: '正财格',
      structureKey: 'wealth',
      descTh: 'ผู้อำนวยการ บริหารสินทรัพย์ ความมั่นคง รอบคอบ วางแผนการเงินเป็นระบบ'
    },
    {
      godZh: '比肩',
      godTh: 'ปี่เจียน',
      enName: 'The Friend',
      godEn: 'Friend',
      patternZh: '比肩格',
      structureKey: 'companion',
      descTh: 'มิตรสหาย รักความเท่าเทียม พึ่งพาตนเอง มีศักดิ์ศรี เป็นเพื่อนร่วมทางที่จริงใจ'
    },
    {
      godZh: '劫财',
      godTh: 'เกียบใช้',
      enName: 'The Leader',
      godEn: 'Rob Wealth',
      patternZh: '劫财格',
      structureKey: 'companion',
      descTh: 'ผู้นำมวลชน กล้าได้กล้าเสีย ทะเยอทะยาน มีเสน่ห์ในการจูงใจผู้อื่น'
    },
    {
      godZh: '食神',
      godTh: 'เจียะซิ้ง',
      enName: 'The Artist',
      godEn: 'Eating God',
      patternZh: '食神格',
      structureKey: 'output',
      descTh: 'ศิลปิน ความคิดสร้างสรรค์ลุ่มลึก สุนทรียภาพ รสนิยมประณีต มีความสุขในชีวิต'
    },
    {
      godZh: '伤官',
      godTh: 'เซียกัว',
      enName: 'The Performer',
      godEn: 'Hurting Officer',
      patternZh: '伤官格',
      structureKey: 'output',
      descTh: 'นักแสดง/ผู้สร้างสรรค์ ปฏิภาณไหวพริบ คารมคมคาย กล้าคิดกล้าทำ ท้าทายสิ่งใหม่'
    },
    {
      godZh: '正官',
      godTh: 'เจี้ยกัว',
      enName: 'The Diplomat',
      godEn: 'Direct Officer',
      patternZh: '正官格',
      structureKey: 'influence',
      descTh: 'นักการทูต รักความถูกต้อง ยุติธรรม วินัย เกียรติยศ และความซื่อตรง'
    },
    {
      godZh: '七杀',
      godTh: 'ชิกสัวะ',
      enName: 'The Warrior',
      godEn: 'Seven Killings',
      patternZh: '七杀格',
      structureKey: 'influence',
      descTh: 'นักรบ/ขุนพล เด็ดขาด เฉียบคม กล้าหาญ พร้อมฟันฝ่าวิกฤตและแรงกดดัน'
    },
    {
      godZh: '正印',
      godTh: 'เจี้ยอิ่ง',
      enName: 'The Analyzer',
      godEn: 'Direct Resource',
      patternZh: '正印格',
      structureKey: 'resource',
      descTh: 'นักวิเคราะห์ คุณธรรม ความรอบรู้ตามแบบแผน เอกสารสัญญา เมตตาและสุขุม'
    },
    {
      godZh: '偏印',
      godTh: 'เพี้ยงอิ่ง',
      enName: 'The Philosopher',
      godEn: 'Indirect Resource',
      patternZh: '偏印格',
      structureKey: 'resource',
      descTh: 'นักปรัชญา ปัญญาญาณ ศาสตร์ลี้ลับ การคิดนอกกรอบ ความรู้เฉพาะทางลึกซึ้ง'
    }
  ];

  // 2. Definition of the 5 Structures
  const FIVE_STRUCTURES = {
    wealth: {
      key: 'wealth',
      nameEn: 'Wealth (Manager)',
      mainNameEn: 'Managers',
      nameZh: '管理型',
      roleZh: '管理型',
      profileGods: ['偏财', '正财'],
      descTh: 'นักบริหารจัดการ มุ่งเน้นผลลัพธ์ ควบคุมการใช้ทรัพยากร และสร้างความมั่งคั่ง',
      axisIndex: 0 // Top
    },
    influence: {
      key: 'influence',
      nameEn: 'Influence (Supporters)',
      mainNameEn: 'Supporters',
      nameZh: '忠诚型',
      roleZh: '忠诚型',
      profileGods: ['正官', '七杀'],
      descTh: 'ผู้สนับสนุนและผดุงกฎเกณฑ์ มีวินัย สัจจะ เกียรติยศ และความจงรักภักดี',
      axisIndex: 1 // Right
    },
    resource: {
      key: 'resource',
      nameEn: 'Resources (Thinkers)',
      mainNameEn: 'Thinkers',
      nameZh: '智慧型',
      roleZh: '智慧型',
      profileGods: ['正印', '偏印'],
      descTh: 'นักคิดและผู้วางแผน แสวงหาปัญญา ข้อมูล ความรู้ และกลยุทธ์ระยะยาว',
      axisIndex: 2 // Bottom Right
    },
    companion: {
      key: 'companion',
      nameEn: 'Companion (Connectors)',
      mainNameEn: 'Connectors',
      nameZh: '交际型',
      roleZh: '交际型',
      profileGods: ['比肩', '劫财'],
      descTh: 'นักเชื่อมสัมพันธ์ ผู้นำมิตรภาพ เครือข่าย การประสานงาน และมวลชนสัมพันธ์',
      axisIndex: 3 // Bottom Left
    },
    output: {
      key: 'output',
      nameEn: 'Output (Creators)',
      mainNameEn: 'Creators',
      nameZh: '创作型',
      roleZh: '创作型',
      profileGods: ['食神', '伤官'],
      descTh: 'นักสร้างสรรค์และนวัตกร แสดงออกซึ่งพรสวรรค์ นวัตกรรม ศิลปะ และไอเดียใหม่',
      axisIndex: 4 // Top Left
    }
  };

  const STEM_LIST = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const STEM_META = {
    '甲': { zh: '甲', pinyin: 'Jia', element: 'wood', polarity: 'yang' },
    '乙': { zh: '乙', pinyin: 'Yi', element: 'wood', polarity: 'yin' },
    '丙': { zh: '丙', pinyin: 'Bing', element: 'fire', polarity: 'yang' },
    '丁': { zh: '丁', pinyin: 'Ding', element: 'fire', polarity: 'yin' },
    '戊': { zh: '戊', pinyin: 'Wu', element: 'earth', polarity: 'yang' },
    '己': { zh: '己', pinyin: 'Ji', element: 'earth', polarity: 'yin' },
    '庚': { zh: '庚', pinyin: 'Geng', element: 'metal', polarity: 'yang' },
    '辛': { zh: '辛', pinyin: 'Xin', element: 'metal', polarity: 'yin' },
    '壬': { zh: '壬', pinyin: 'Ren', element: 'water', polarity: 'yang' },
    '癸': { zh: '癸', pinyin: 'Gui', element: 'water', polarity: 'yin' }
  };

  const BRANCH_HIDDEN_STEMS = {
    '子': [{ stem: '癸', weight: 1.0 }],
    '丑': [{ stem: '己', weight: 0.60 }, { stem: '癸', weight: 0.30 }, { stem: '辛', weight: 0.10 }],
    '寅': [{ stem: '甲', weight: 0.60 }, { stem: '丙', weight: 0.30 }, { stem: '戊', weight: 0.10 }],
    '卯': [{ stem: '乙', weight: 1.0 }],
    '辰': [{ stem: '戊', weight: 0.60 }, { stem: '乙', weight: 0.30 }, { stem: '癸', weight: 0.10 }],
    '巳': [{ stem: '丙', weight: 0.60 }, { stem: '庚', weight: 0.30 }, { stem: '戊', weight: 0.10 }],
    '午': [{ stem: '丁', weight: 0.70 }, { stem: '己', weight: 0.30 }],
    '未': [{ stem: '己', weight: 0.60 }, { stem: '丁', weight: 0.30 }, { stem: '乙', weight: 0.10 }],
    '申': [{ stem: '庚', weight: 0.60 }, { stem: '壬', weight: 0.30 }, { stem: '戊', weight: 0.10 }],
    '酉': [{ stem: '辛', weight: 1.0 }],
    '戌': [{ stem: '戊', weight: 0.60 }, { stem: '辛', weight: 0.30 }, { stem: '丁', weight: 0.10 }],
    '亥': [{ stem: '壬', weight: 0.70 }, { stem: '甲', weight: 0.30 }]
  };

  const ELEMENT_RELATIONS = {
    wood: { companion: 'wood', output: 'fire', wealth: 'earth', influence: 'metal', resource: 'water' },
    fire: { companion: 'fire', output: 'earth', wealth: 'metal', influence: 'water', resource: 'wood' },
    earth: { companion: 'earth', output: 'metal', wealth: 'water', influence: 'wood', resource: 'fire' },
    metal: { companion: 'metal', output: 'water', wealth: 'wood', influence: 'fire', resource: 'earth' },
    water: { companion: 'water', output: 'wood', wealth: 'fire', influence: 'earth', resource: 'metal' }
  };

  const ELEMENT_LABELS = {
    wood: { zh: '木', en: 'WOOD' },
    fire: { zh: '火', en: 'FIRE' },
    earth: { zh: '土', en: 'EARTH' },
    metal: { zh: '金', en: 'METAL' },
    water: { zh: '水', en: 'WATER' }
  };

  // Helper to get Ten God for any stem relative to DM
  function getGodRelation(dmStem, targetStem) {
    if (!dmStem || !targetStem) return null;
    const dm = typeof dmStem === 'string' ? STEM_META[dmStem] : dmStem;
    const target = typeof targetStem === 'string' ? STEM_META[targetStem] : targetStem;
    if (!dm || !target) return null;

    const relMap = ELEMENT_RELATIONS[dm.element];
    const isSamePol = dm.polarity === target.polarity;

    if (target.element === relMap.companion) {
      return isSamePol ? '比肩' : '劫财';
    } else if (target.element === relMap.output) {
      return isSamePol ? '食神' : '伤官';
    } else if (target.element === relMap.wealth) {
      return isSamePol ? '偏财' : '正财';
    } else if (target.element === relMap.influence) {
      return isSamePol ? '七杀' : '正官';
    } else if (target.element === relMap.resource) {
      return isSamePol ? '偏印' : '正印';
    }
    return '比肩';
  }

  // Calculate annual pillar for any year
  function getAnnualPillar(year) {
    const yrSIdx = ((year - 4) % 10 + 10) % 10;
    const yrBIdx = ((year - 4) % 12 + 12) % 12;
    const stemsArr = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const branchesArr = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    return {
      stemZh: stemsArr[yrSIdx],
      branchZh: branchesArr[yrBIdx],
      year: year
    };
  }

  /**
   * Main calculation function: 10 Profiles & 5 Structures strength (0 - 100%)
   * @param {Object} chart - BaZi chart object with pillars
   * @param {number} annualYear - Year to evaluate (e.g. 2026, 2027)
   */
  function calculateProfilesAndStructures(chart, annualYear) {
    if (!chart || !chart.pillars) return null;

    const dmStem = (chart.dayMaster && chart.dayMaster.zh) || 
                   (chart.pillars.day && chart.pillars.day.stem && chart.pillars.day.stem.zh) || '丙';
    const dmMeta = STEM_META[dmStem] || STEM_META['丙'];
    const yr = annualYear || (chart.currentYear || new Date().getFullYear());
    const annualPillar = getAnnualPillar(yr);

    // 1. Accumulate raw strength points for all 10 Heavenly Stems
    const natalStemScores = {};
    const annualStemScores = {};
    STEM_LIST.forEach(s => {
      natalStemScores[s] = 0;
      annualStemScores[s] = 0;
    });

    // Pillar weights for heavenly stems
    const pillarWeights = {
      month: 18,
      day: 14,
      year: 12,
      hour: 10
    };

    // Branch weights for hidden stems
    const branchWeights = {
      month: 36, // Month branch (月令) carries largest seasonal weight
      day: 18,
      year: 14,
      hour: 12
    };

    // Evaluate Natal chart
    ['year', 'month', 'day', 'hour'].forEach(k => {
      const p = chart.pillars[k];
      if (!p || p.isUnknown) return;

      // Stem presence
      const sChar = p.stem ? (p.stem.zh || p.stem) : null;
      if (sChar && natalStemScores[sChar] !== undefined) {
        natalStemScores[sChar] += (pillarWeights[k] || 10);
      }

      // Branch hidden stems presence
      const bChar = p.branch ? (p.branch.zh || p.branch) : null;
      if (bChar && BRANCH_HIDDEN_STEMS[bChar]) {
        const bWeight = branchWeights[k] || 12;
        BRANCH_HIDDEN_STEMS[bChar].forEach(h => {
          if (natalStemScores[h.stem] !== undefined) {
            natalStemScores[h.stem] += (bWeight * h.weight);
          }
        });
      }
    });

    // Check Rooting (通根) bonus for Natal
    const natalBranches = ['year', 'month', 'day', 'hour']
      .map(k => chart.pillars[k] && chart.pillars[k].branch ? (chart.pillars[k].branch.zh || chart.pillars[k].branch) : null)
      .filter(Boolean);

    STEM_LIST.forEach(s => {
      let rootCount = 0;
      natalBranches.forEach(b => {
        if (BRANCH_HIDDEN_STEMS[b] && BRANCH_HIDDEN_STEMS[b].some(h => h.stem === s)) {
          rootCount++;
        }
      });
      if (natalStemScores[s] > 0 && rootCount > 0) {
        natalStemScores[s] += (rootCount * 6);
      }
    });

    // Copy natal baseline into annual and add annual pillar influence
    STEM_LIST.forEach(s => {
      annualStemScores[s] = natalStemScores[s] * 0.72; // Natal retention
    });

    // Add Annual Stem
    if (annualStemScores[annualPillar.stemZh] !== undefined) {
      annualStemScores[annualPillar.stemZh] += 26;
    }

    // Add Annual Branch Hidden Stems
    if (annualPillar.branchZh && BRANCH_HIDDEN_STEMS[annualPillar.branchZh]) {
      BRANCH_HIDDEN_STEMS[annualPillar.branchZh].forEach(h => {
        if (annualStemScores[h.stem] !== undefined) {
          annualStemScores[h.stem] += (28 * h.weight);
        }
      });
    }

    // 2. Normalize to Percentages (0 - 100%)
    const maxNatal = Math.max(...Object.values(natalStemScores), 1);
    const maxAnnual = Math.max(...Object.values(annualStemScores), 1);

    const natalPcts = {};
    const annualPcts = {};

    STEM_LIST.forEach(s => {
      // If raw score is 0, percentage is strictly 0%
      if (natalStemScores[s] <= 0) {
        natalPcts[s] = 0;
      } else {
        // Natural scaling: top peaks reach 95-100%
        const ratio = natalStemScores[s] / maxNatal;
        let pct = Math.round(ratio * 100);
        if (ratio >= 0.92) pct = Math.min(100, Math.round(92 + (ratio - 0.92) * 100));
        natalPcts[s] = Math.max(0, Math.min(100, pct));
      }

      if (annualStemScores[s] <= 0) {
        annualPcts[s] = 0;
      } else {
        const ratio = annualStemScores[s] / maxAnnual;
        let pct = Math.round(ratio * 100);
        if (ratio >= 0.90) pct = Math.min(100, Math.round(90 + (ratio - 0.90) * 100));
        annualPcts[s] = Math.max(0, Math.min(100, pct));
      }
    });

    // 3. Map Stems to the 10 Profiles relative to Day Master
    const profileResults = TEN_PROFILES.map(prof => {
      // Find which stem generates this Ten God from DM
      const stemChar = STEM_LIST.find(s => getGodRelation(dmStem, s) === prof.godZh) || '甲';
      const stemData = STEM_META[stemChar];
      const isDM = stemChar === dmStem;
      const natalPct = natalPcts[stemChar] || 0;
      const annualPct = annualPcts[stemChar] || 0;

      return {
        ...prof,
        stemZh: stemChar,
        stemPinyin: stemData.pinyin,
        isDM: isDM,
        natalPct: natalPct,
        annualPct: annualPct,
        rawNatalScore: natalStemScores[stemChar] || 0
      };
    });

    // Sort profiles descending by Natal percentage
    profileResults.sort((a, b) => {
      if (b.natalPct !== a.natalPct) return b.natalPct - a.natalPct;
      return b.rawNatalScore - a.rawNatalScore;
    });

    // 4. Calculate 5 Structures Scores
    const structures = {};
    const rel = ELEMENT_RELATIONS[dmMeta.element];

    Object.keys(FIVE_STRUCTURES).forEach(key => {
      const struct = FIVE_STRUCTURES[key];
      const matchingProfiles = profileResults.filter(p => struct.profileGods.includes(p.godZh));
      const p1Natal = matchingProfiles[0] ? matchingProfiles[0].natalPct : 0;
      const p2Natal = matchingProfiles[1] ? matchingProfiles[1].natalPct : 0;
      const p1Annual = matchingProfiles[0] ? matchingProfiles[0].annualPct : 0;
      const p2Annual = matchingProfiles[1] ? matchingProfiles[1].annualPct : 0;

      // Structure score is prominent peak with secondary blend
      const natalScore = Math.min(100, Math.round(Math.max(p1Natal, p2Natal) * 0.85 + Math.min(p1Natal, p2Natal) * 0.15));
      const annualScore = Math.min(100, Math.round(Math.max(p1Annual, p2Annual) * 0.85 + Math.min(p1Annual, p2Annual) * 0.15));

      // Dynamic Element for this structure relative to DM
      const elemKey = rel[key] || 'earth';
      const elemLabel = ELEMENT_LABELS[elemKey] || { zh: '土', en: 'EARTH' };

      structures[key] = {
        ...struct,
        elementKey: elemKey,
        elementZh: elemLabel.zh,
        elementEn: elemLabel.en,
        natalPct: natalScore,
        annualPct: annualScore
      };
    });

    // Determine Main Structure & Main Profile
    let mainStructureKey = 'wealth';
    let maxStructNatal = -1;
    Object.keys(structures).forEach(k => {
      if (structures[k].natalPct > maxStructNatal) {
        maxStructNatal = structures[k].natalPct;
        mainStructureKey = k;
      }
    });

    const mainStructure = structures[mainStructureKey];
    const mainProfile = profileResults[0] || TEN_PROFILES[0];

    return {
      dayMasterStem: dmStem,
      dayMasterPinyin: dmMeta.pinyin,
      dayMasterElement: dmMeta.element,
      annualYear: yr,
      annualPillar: annualPillar,
      profiles: profileResults,
      structures: structures,
      axesOrder: ['wealth', 'influence', 'resource', 'companion', 'output'],
      mainStructure: mainStructure,
      mainProfile: mainProfile
    };
  }

  /**
   * Render complete HTML matching the user's reference image
   * @param {HTMLElement|string} container - Element or ID to render inside
   * @param {Object} data - Result from calculateProfilesAndStructures
   */
  function renderStructuresAndProfilesCard(container, data) {
    const el = typeof container === 'string' ? document.getElementById(container) : container;
    if (!el || !data) return;

    const yr = data.annualYear;
    const mainStruct = data.mainStructure;
    const mainProf = data.mainProfile;

    // SVG Pentagon Radar Calculations (cx: 190, cy: 175, r: 95)
    const cx = 190;
    const cy = 175;
    const maxR = 95;
    const axesOrder = data.axesOrder; // ['wealth', 'influence', 'resource', 'companion', 'output']

    // Coordinates of 5 axes: Top (-90°), Right (-18°), Bottom-Right (54°), Bottom-Left (126°), Top-Left (198°)
    const angles = [-90, -18, 54, 126, 198].map(deg => (deg * Math.PI) / 180);

    // Compute polygon points for a given radius or percentages
    const getPentagonPoints = (radius) => {
      return angles.map(a => `${(cx + radius * Math.cos(a)).toFixed(1)},${(cy + radius * Math.sin(a)).toFixed(1)}`).join(' ');
    };

    const getScorePoints = (isAnnual) => {
      return axesOrder.map((key, i) => {
        const val = isAnnual ? data.structures[key].annualPct : data.structures[key].natalPct;
        const r = (val / 100) * maxR;
        const a = angles[i];
        return {
          x: (cx + r * Math.cos(a)).toFixed(1),
          y: (cy + r * Math.sin(a)).toFixed(1)
        };
      });
    };

    const natalPoints = getScorePoints(false);
    const annualPoints = getScorePoints(true);
    const natalPolyStr = natalPoints.map(p => `${p.x},${p.y}`).join(' ');
    const annualPolyStr = annualPoints.map(p => `${p.x},${p.y}`).join(' ');

    // Axis label positions (offset slightly further than maxR)
    const labelOffsets = [
      { x: 0, y: -24 },   // 0: Top (Wealth)
      { x: 26, y: -4 },   // 1: Right (Influence)
      { x: 20, y: 22 },   // 2: Bottom-Right (Resource)
      { x: -20, y: 22 },  // 3: Bottom-Left (Companion)
      { x: -26, y: -4 }   // 4: Top-Left (Output)
    ];

    const axisLabelsHtml = axesOrder.map((key, i) => {
      const s = data.structures[key];
      const a = angles[i];
      const labelR = maxR + 24;
      const lx = cx + labelR * Math.cos(a) + labelOffsets[i].x;
      const ly = cy + labelR * Math.sin(a) + labelOffsets[i].y;

      let textAnchor = 'middle';
      if (i === 1 || i === 2) textAnchor = 'start';
      if (i === 3 || i === 4) textAnchor = 'end';

      return `
        <g class="bazi-radar-axis-label" transform="translate(${lx}, ${ly})">
          <!-- Red Element Badge -->
          <rect x="${textAnchor === 'middle' ? -34 : (textAnchor === 'end' ? -68 : 0)}" y="-26" width="68" height="18" rx="3" fill="#881c24" />
          <text x="${textAnchor === 'middle' ? 0 : (textAnchor === 'end' ? -34 : 34)}" y="-13" text-anchor="middle" fill="#ffffff" font-size="10.5" font-weight="700" letter-spacing="0.5">
            ${s.elementZh} ${s.elementEn}
          </text>
          <!-- Structure Name -->
          <text x="${textAnchor === 'middle' ? 0 : (textAnchor === 'end' ? 0 : 0)}" y="-1" text-anchor="${textAnchor}" fill="#0f172a" font-size="12" font-weight="800">
            ${s.nameZh}
          </text>
          <text x="${textAnchor === 'middle' ? 0 : (textAnchor === 'end' ? 0 : 0)}" y="13" text-anchor="${textAnchor}" fill="#334155" font-size="10.5" font-weight="700">
            ${s.nameEn}
          </text>
        </g>
      `;
    }).join('');

    // HTML Output
    const html = `
      <div class="bazi-profiling-dual-card">
        <!-- LEFT COLUMN: 5 STRUCTURES -->
        <div class="bazi-profiling-col bazi-struct-col">
          <div class="bazi-profiling-header-bar">
            <span class="prof-hdr-title">5 STRUCTURES 五型格</span>
          </div>

          <div class="bazi-struct-content-wrap">
            <!-- Legend -->
            <div class="bazi-struct-legend-row">
              <div class="prof-legend-item">
                <span class="prof-legend-box box-natal"></span>
                <span class="prof-legend-text">Natal</span>
              </div>
              <div class="prof-legend-item">
                <span class="prof-legend-box box-annual"></span>
                <span class="prof-legend-text">Annual ${yr}</span>
              </div>
            </div>

            <!-- SVG Radar / Pentagon Chart -->
            <div class="bazi-struct-radar-wrap">
              <svg class="bazi-struct-radar-svg" viewBox="0 0 380 340" preserveAspectRatio="xMidYMid meet">
                <!-- Background Grid Rings (20, 40, 60, 80, 100) -->
                ${[0.2, 0.4, 0.6, 0.8, 1.0].map(ratio => `
                  <polygon points="${getPentagonPoints(maxR * ratio)}" fill="none" stroke="#e2e8f0" stroke-width="1.2" />
                `).join('')}

                <!-- Spokes -->
                ${angles.map(a => `
                  <line x1="${cx}" y1="${cy}" x2="${(cx + maxR * Math.cos(a)).toFixed(1)}" y2="${(cy + maxR * Math.sin(a)).toFixed(1)}" stroke="#e2e8f0" stroke-width="1.2" />
                `).join('')}

                <!-- Grid Value Markers (20, 40, 60, 80, 100) -->
                ${[20, 40, 60, 80, 100].map(v => {
                  const yPos = cy - (v / 100) * maxR;
                  return `<text x="${cx + 4}" y="${yPos - 2}" fill="#94a3b8" font-size="8.5" font-weight="600">${v}</text>`;
                }).join('')}

                <!-- Data Polygon 1: Natal (Goldish Beige) -->
                <polygon points="${natalPolyStr}" fill="rgba(202, 166, 98, 0.42)" stroke="#b59344" stroke-width="2.4" />
                ${natalPoints.map(p => `
                  <circle cx="${p.x}" cy="${p.y}" r="4" fill="#b59344" stroke="#ffffff" stroke-width="1.5" />
                `).join('')}

                <!-- Data Polygon 2: Annual (Deep Maroon) -->
                <polygon points="${annualPolyStr}" fill="rgba(136, 28, 36, 0.48)" stroke="#881c24" stroke-width="2.4" />
                ${annualPoints.map(p => `
                  <circle cx="${p.x}" cy="${p.y}" r="4" fill="#881c24" stroke="#ffffff" stroke-width="1.5" />
                `).join('')}

                <!-- Axis Labels & Red Element Badges -->
                ${axisLabelsHtml}
              </svg>
            </div>
          </div>

          <!-- Bottom Footer Bar -->
          <div class="bazi-profiling-footer-bar">
            <span>Main Structure : ${mainStruct.mainNameEn} ${mainStruct.nameZh}</span>
          </div>
        </div>

        <!-- RIGHT COLUMN: 10 PROFILES STRENGTH CHART -->
        <div class="bazi-profiling-col bazi-prof-col">
          <div class="bazi-profiling-header-bar">
            <span class="prof-hdr-title">10 PROFILES STRENGTH CHART 十神格</span>
          </div>

          <div class="bazi-prof-content-wrap">
            <!-- Table Header Sub-row -->
            <div class="bazi-prof-tbl-header">
              <div class="th-profile-name"></div>
              <div class="th-score-col">Natal</div>
              <div class="th-score-col">Annual ${yr}</div>
            </div>

            <!-- 10 Profile Rows -->
            <div class="bazi-prof-rows-list">
              ${data.profiles.map(p => `
                <div class="bazi-prof-row-item">
                  <div class="prof-name-cell">
                    <div class="prof-stem-badge">
                      <span class="stem-zh">${p.stemZh}</span>
                      <span class="stem-py">${p.stemPinyin}</span>
                    </div>
                    <div class="prof-title-text" title="${p.descTh}">
                      <span class="prof-en-archetype">${p.enName}</span>
                      <span class="prof-god-detail">(${p.godEn}) ${p.patternZh}</span>
                      ${p.isDM ? '<span class="prof-dm-pill" title="ดิถีธาตุประจำตัว (Day Master)">DM</span>' : ''}
                    </div>
                  </div>

                  <!-- Natal Progress Bar -->
                  <div class="prof-bar-cell">
                    <div class="prof-bar-track">
                      <div class="prof-bar-fill bar-natal" style="width: ${p.natalPct}%;">
                        ${p.natalPct > 15 ? `<span class="prof-bar-pct in-bar">${p.natalPct}%</span>` : ''}
                      </div>
                      ${p.natalPct <= 15 ? `<span class="prof-bar-pct out-bar">${p.natalPct}%</span>` : ''}
                    </div>
                  </div>

                  <!-- Annual Progress Bar -->
                  <div class="prof-bar-cell">
                    <div class="prof-bar-track">
                      <div class="prof-bar-fill bar-annual" style="width: ${p.annualPct}%;">
                        ${p.annualPct > 15 ? `<span class="prof-bar-pct in-bar in-annual">${p.annualPct}%</span>` : ''}
                      </div>
                      ${p.annualPct <= 15 ? `<span class="prof-bar-pct out-bar out-annual">${p.annualPct}%</span>` : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Bottom Footer Bar -->
          <div class="bazi-profiling-footer-bar">
            <span>Main Profile : ${mainProf.enName} (${mainProf.godEn}) ${mainProf.patternZh}</span>
          </div>
        </div>
      </div>
    `;

    el.innerHTML = html;
  }

  return {
    TEN_PROFILES,
    FIVE_STRUCTURES,
    calculateProfilesAndStructures,
    renderStructuresAndProfilesCard
  };
})();

if (typeof window !== 'undefined') window.BaziProfilesDB = BaziProfilesDB;
if (typeof globalThis !== 'undefined') globalThis.BaziProfilesDB = BaziProfilesDB;
if (typeof module !== 'undefined' && module.exports) module.exports = BaziProfilesDB;
