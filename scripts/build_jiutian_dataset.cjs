const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const jiuTianDir = path.join(__dirname, '..', 'JiuTianData');
const jiuTianCardImageDir = path.join(__dirname, '..', 'JiuTianCardImage');
const cardImageDir = path.join(__dirname, '..', 'CardImage');
const dataDir = path.join(__dirname, '..', 'data');
const thepMeowXlsxPath = path.join(__dirname, '..', 'ความหมายไพ่เทพเหมียว.xlsx');

// Load default cards as baseline / fallback
const defCardsPath = path.join(__dirname, '..', 'scratch', 'default_cards_cjs.cjs');
const defaultCards = require(defCardsPath);

// Preserve existing keyword field from JiuTianData/jiutian-cards.json if present
const existingJsonPath = path.join(jiuTianDir, 'jiutian-cards.json');
const existingKeywordsById = new Map();
if (fs.existsSync(existingJsonPath)) {
  try {
    const existingArr = JSON.parse(fs.readFileSync(existingJsonPath, 'utf8'));
    existingArr.forEach(c => {
      if (c && c.id && c.keyword) existingKeywordsById.set(c.id, c.keyword);
    });
  } catch (e) {}
}

console.log(`Loaded ${defaultCards.length} default cards from scratch/default_cards_cjs.cjs`);

// Load ความหมายไพ่เทพเหมียว.xlsx (Authoritative meaning source)
const thepMeowDataById = new Map();
const elementRules = {};

if (fs.existsSync(thepMeowXlsxPath)) {
  const wb = XLSX.readFile(thepMeowXlsxPath);
  const cardSheetName = wb.SheetNames[0]; // 'ไพ่เทพจีน 96 ใบ (ทั้งหมด)'
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[cardSheetName]);
  rows.forEach(r => {
    const id = r['ลำดับ (No.)'];
    if (id !== undefined && id !== null) {
      thepMeowDataById.set(parseInt(id, 10), r);
    }
  });
  console.log(`Loaded ${thepMeowDataById.size} cards from ${thepMeowXlsxPath}`);

  if (wb.SheetNames.includes('ข้อมูลธาตุ')) {
    const elemRows = XLSX.utils.sheet_to_json(wb.Sheets['ข้อมูลธาตุ']);
    elemRows.forEach(er => {
      const el = er['ธาตุ'];
      const desc = er['ความเกี่ยวข้อง'];
      if (el) elementRules[el.trim()] = (desc || '').trim();
    });
    console.log(`Loaded element rules for: ${Object.keys(elementRules).join(', ')}`);
  }
} else {
  console.warn(`[WARN] ${thepMeowXlsxPath} not found!`);
}

// Helper to clean markdown text
function cleanText(txt) {
  if (!txt) return '';
  return txt
    .replace(/\r\n/g, '\n')
    .replace(/^>\s+/gm, '')
    .trim();
}

// Helper to parse sub-bullets from Reading Guidance
function parseReadingGuidance(sectionText) {
  const result = {
    overview: '',
    work: '',
    finance: '',
    love: '',
    health: ''
  };
  if (!sectionText) return result;

  const lines = sectionText.split('\n');
  let currentKey = 'overview';
  const currentLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (/ภาพรวม|ทั่วไป/i.test(trimmed) && trimmed.startsWith('-')) {
      if (currentLines.length) result[currentKey] = currentLines.join('\n').trim();
      currentKey = 'overview';
      currentLines.length = 0;
      currentLines.push(trimmed.replace(/^-\s*\*\*.*?\*\*:\s*/, '').replace(/^-\s*/, ''));
    } else if (/การงาน|ธุรกิจ/i.test(trimmed) && trimmed.startsWith('-')) {
      if (currentLines.length) result[currentKey] = currentLines.join('\n').trim();
      currentKey = 'work';
      currentLines.length = 0;
      currentLines.push(trimmed.replace(/^-\s*\*\*.*?\*\*:\s*/, '').replace(/^-\s*/, ''));
    } else if (/การเงิน|โชคลาภ/i.test(trimmed) && trimmed.startsWith('-')) {
      if (currentLines.length) result[currentKey] = currentLines.join('\n').trim();
      currentKey = 'finance';
      currentLines.length = 0;
      currentLines.push(trimmed.replace(/^-\s*\*\*.*?\*\*:\s*/, '').replace(/^-\s*/, ''));
    } else if (/ความรัก|ความสัมพันธ์/i.test(trimmed) && trimmed.startsWith('-')) {
      if (currentLines.length) result[currentKey] = currentLines.join('\n').trim();
      currentKey = 'love';
      currentLines.length = 0;
      currentLines.push(trimmed.replace(/^-\s*\*\*.*?\*\*:\s*/, '').replace(/^-\s*/, ''));
    } else if (/สุขภาพ/i.test(trimmed) && trimmed.startsWith('-')) {
      if (currentLines.length) result[currentKey] = currentLines.join('\n').trim();
      currentKey = 'health';
      currentLines.length = 0;
      currentLines.push(trimmed.replace(/^-\s*\*\*.*?\*\*:\s*/, '').replace(/^-\s*/, ''));
    } else {
      currentLines.push(trimmed);
    }
  }
  if (currentLines.length) {
    result[currentKey] = currentLines.join('\n').trim();
  }
  return result;
}

// Helper to parse Personality section
function parsePersonality(sectionText) {
  let light = '';
  let shadow = '';
  if (!sectionText) return { light, shadow };

  if (sectionText.includes('ด้านเงา') || sectionText.includes('ในด้านเงา')) {
    const parts = sectionText.split(/(?:ในด้านเงา|\*\*ในด้านเงา\*\*|\*\*ด้านเงา\*\*)/);
    light = parts[0].trim();
    shadow = (parts[1] || '').trim();
  } else {
    light = sectionText.trim();
  }
  return { light, shadow };
}

// Parse a single markdown file
function parseMarkdownFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  
  // Title
  const titleM = text.match(/^#\s*(.*)/m);
  const title = titleM ? titleM[1].trim() : path.basename(filePath, '.md');

  // Image tag
  const imgM = text.match(/!\[.*?\]\((.*?)\)/);
  const imgRef = imgM ? imgM[1].trim() : '';

  // Element
  const elemM = text.match(/\*\*ธาตุประจำตัว:\*\*\s*(.*)/);
  const elementRaw = elemM ? elemM[1].trim() : '';

  // Concept
  const concM = text.match(/\*\*คอนเซปต์หลัก:\*\*\s*(.*)/);
  const concept = concM ? concM[1].trim() : '';

  // Extract sections by number
  function getSection(num, nextNum) {
    const regex = new RegExp(`${num}\\.\\s*\\*\\*[\\s\\S]*?\\n+([\\s\\S]*?)(?=\\n${nextNum}\\.\\s*\\*\\*|$)`);
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }

  const essence = getSection(1, 2);
  const symbolism = getSection(2, 3);
  const strategy = getSection(3, 4);
  const readingGuidanceRaw = getSection(4, 5);
  const personalityRaw = getSection(5, 6);
  const careers = getSection(6, 7);
  const affirmationRaw = getSection(7, 8);
  const keywordsRaw = getSection(8, 9);
  
  // Section 9: Mythology
  const mythM = text.match(/9\.\s*\*\*ประวัติเทพเจ้า\*\*\s*\n+([\s\S]*?)$/);
  const mythology = mythM ? mythM[1].trim() : '';

  // Extract affirmation
  const affirmation = affirmationRaw.replace(/^["“”']|["“”']$/g, '').trim();

  // Extract keywords
  const keywords = keywordsRaw
    ? keywordsRaw
        .split(/[•,·|]/)
        .map(k => k.trim())
        .filter(k => k.length > 0 && !k.startsWith('Keyword'))
    : [];

  const reading = parseReadingGuidance(readingGuidanceRaw);
  const personality = parsePersonality(personalityRaw);

  return {
    title,
    imgRef,
    elementRaw,
    concept,
    essence,
    symbolism,
    strategy,
    reading,
    personality,
    careers,
    affirmation,
    keywords,
    mythology
  };
}

// Build map of existing markdown files by ID
const mdFiles = fs.readdirSync(jiuTianDir).filter(f => f.endsWith('.md'));
const mdDataById = new Map();

for (const f of mdFiles) {
  let id = null;
  const majorMatch = f.match(/^(\d+)-/);
  if (majorMatch) {
    id = parseInt(majorMatch[1], 10) + 1;
  } else {
    const minorMatch = f.match(/^(Wood|Fire|Earth|Metal|Water)\s+(\d+)/i);
    if (minorMatch) {
      const suit = minorMatch[1].toLowerCase();
      const rank = parseInt(minorMatch[2], 10);
      const base = { wood: 22, fire: 36, earth: 50, metal: 64, water: 78 }[suit];
      id = base + rank;
    } else {
      const specialMatch = f.match(/^Special\s+(\d+)/i);
      if (specialMatch) {
        id = parseInt(specialMatch[1], 10);
      }
    }
  }
  if (id) {
    const parsed = parseMarkdownFile(path.join(jiuTianDir, f));
    parsed.filename = f;
    mdDataById.set(id, parsed);
  }
}

console.log(`Parsed ${mdDataById.size} markdown cards from JiuTianData.`);

// Helper to determine element info
function getElementInfo(id, parsedElem, defElem) {
  const combined = (parsedElem + ' ' + (defElem || '')).toLowerCase();
  if (combined.includes('น้ำ') || combined.includes('water')) {
    return { name: 'ธาตุน้ำ (Water)', type: 'water', icon: '💧', color: '#0284c7' };
  }
  if (combined.includes('ไฟ') || combined.includes('fire')) {
    return { name: 'ธาตุไฟ (Fire)', type: 'fire', icon: '🔥', color: '#e11d48' };
  }
  if (combined.includes('ไม้') || combined.includes('wood')) {
    return { name: 'ธาตุไม้ (Wood)', type: 'wood', icon: '🌲', color: '#16a34a' };
  }
  if (combined.includes('ดิน') || combined.includes('earth')) {
    return { name: 'ธาตุดิน (Earth)', type: 'earth', icon: '⛰️', color: '#d97706' };
  }
  if (combined.includes('ทอง') || combined.includes('metal')) {
    return { name: 'ธาตุทอง (Metal)', type: 'metal', icon: '⚔️', color: '#ca8a04' };
  }
  return { name: 'ธาตุน้ำ (Water)', type: 'water', icon: '💧', color: '#0284c7' };
}

// Build 96 unified cards
const allCards = [];

for (let id = 1; id <= 96; id++) {
  const def = defaultCards[id - 1] || {};
  const md = mdDataById.get(id);

  // Determine card type & numbering
  let cardType = 'major';
  let cardNo = id - 1;
  let suitNameTh = 'อาร์คานาหลัก';
  let suitNameEn = 'Major Arcana';

  if (id >= 1 && id <= 22) {
    cardType = 'major';
    cardNo = id - 1;
    suitNameTh = 'เมเจอร์ อาร์คานา (Major)';
    suitNameEn = 'Major Arcana';
  } else if (id >= 23 && id <= 36) {
    cardType = 'wood';
    cardNo = id - 22;
    suitNameTh = 'ธาตุไม้ (Wood)';
    suitNameEn = 'Suit of Wood';
  } else if (id >= 37 && id <= 50) {
    cardType = 'fire';
    cardNo = id - 36;
    suitNameTh = 'ธาตุไฟ (Fire)';
    suitNameEn = 'Suit of Fire';
  } else if (id >= 51 && id <= 64) {
    cardType = 'earth';
    cardNo = id - 50;
    suitNameTh = 'ธาตุดิน (Earth)';
    suitNameEn = 'Suit of Earth';
  } else if (id >= 65 && id <= 78) {
    cardType = 'metal';
    cardNo = id - 64;
    suitNameTh = 'ธาตุทอง (Metal)';
    suitNameEn = 'Suit of Metal';
  } else if (id >= 79 && id <= 92) {
    cardType = 'water';
    cardNo = id - 78;
    suitNameTh = 'ธาตุน้ำ (Water)';
    suitNameEn = 'Suit of Water';
  } else {
    cardType = 'special';
    cardNo = id;
    suitNameTh = 'ไพ่พิเศษจิ่วเทียน (Special)';
    suitNameEn = 'Special Arcana';
  }

  // Titles & Names
  let fullTitle = md ? md.title : def.name;
  let nameTh = '';
  let nameEn = '';
  let nameCn = '';

  if (md) {
    // Parse from title: e.g. "0-จี้กง (Ji Gong - 濟公) : The Fool"
    const match = md.title.match(/(?:.*?-)?(.*?)(?:\((.*?)\))?(?:\s*:\s*(.*))?$/);
    if (match) {
      nameTh = (match[1] || '').trim();
      const paren = (match[2] || '').trim();
      nameEn = (match[3] || '').trim();
      if (paren.includes('-')) {
        const parts = paren.split('-');
        if (!nameEn) nameEn = parts[0].trim();
        nameCn = parts[1].trim();
      } else if (/[\u4e00-\u9fa5]/.test(paren)) {
        nameCn = paren;
      } else {
        if (!nameEn) nameEn = paren;
      }
    }
  } else {
    nameTh = def.name.replace(/^(Major \d+|Minor \w+ \w+|Special \d+)\s*-\s*/, '').trim();
    nameEn = `Card ${id}`;
  }

  if (!nameTh) nameTh = def.name || `Card ${id}`;
  if (!nameEn) nameEn = `Card ${id}`;

  let elemInfo = getElementInfo(id, md ? md.elementRaw : '', def.element);

  // Image paths
  let imageJiuTian = `JiuTianCardImage/${id}.png`;
  const imageCard = def.image || (cardType === 'major' ? `CardImage/Major${cardNo}.png` : `CardImage/${id}.png`);

  // Keywords
  let keywords = md && md.keywords.length > 0 ? md.keywords : (def.keywords || ['พลังธาตุ', 'จิ่วเทียนอาร์คานา', 'โชคชะตา']);
  // Filter Thai and English keywords
  let keywordsTh = keywords.filter(k => /[ก-๙]/.test(k));
  let keywordsEn = keywords.filter(k => /[a-zA-Z]/.test(k));

  // Affirmation & Advice
  let affirmation = (md && md.affirmation) ? md.affirmation : (def.advice ? def.advice.replace(/^ข้อความจากเทพ\s*“?|^คำแนะนำ:?\s*“?/, '').replace(/”$/, '') : '');
  let advice = (md && md.reading && md.reading.overview) ? md.reading.overview : (def.advice || 'จงดำเนินชีวิตด้วยปัญญาและรักษาใจให้สงบมั่นคง');

  // Core Meaning / Concept
  let coreMeaning = (md && md.concept) ? md.concept : (def.general_meaning || '');

  // Readings
  let readingGeneral = (md && md.reading && md.reading.overview) ? md.reading.overview : (def.general_meaning || '');
  let readingWork = (md && md.reading && md.reading.work) ? md.reading.work : (def.work_meaning || '');
  let readingLove = (md && md.reading && md.reading.love) ? md.reading.love : (def.love_meaning || '');
  let readingFinance = (md && md.reading && md.reading.finance) ? md.reading.finance : '';
  let readingHealth = (md && md.reading && md.reading.health) ? md.reading.health : '';

  // Personality
  let personalityLight = (md && md.personality && md.personality.light) ? md.personality.light : (def.general_meaning || '');
  let personalityShadow = (md && md.personality && md.personality.shadow) ? md.personality.shadow : '';

  let essence = md ? md.essence : '';
  let symbolism = md ? md.symbolism : '';
  let strategy = md ? md.strategy : '';
  let careers = md ? md.careers : '';
  let mythology = md ? md.mythology : '';

  // OVERRIDE WITH ความหมายไพ่เทพเหมียว.xlsx (Exclusive Authoritative Source)
  const meow = thepMeowDataById.get(id);
  if (meow) {
    if (meow['ชื่อภาษาไทย']) nameTh = String(meow['ชื่อภาษาไทย']).trim();
    if (meow['หมวดหมู่ (Suit)']) suitNameTh = String(meow['หมวดหมู่ (Suit)']).trim();
    if (meow['หมวดหมู่ (EN)']) suitNameEn = String(meow['หมวดหมู่ (EN)']).trim();
    if (meow['ธาตุประจำตัว (Element)']) {
      elemInfo = getElementInfo(id, meow['ธาตุประจำตัว (Element)'], def.element);
    }
    if (meow['ไฟล์รูปภาพ (Image)']) {
      imageJiuTian = String(meow['ไฟล์รูปภาพ (Image)']).trim();
    }
    mythology = meow['เทพเจ้าชี้ทาง (Mythology)'] ? String(meow['เทพเจ้าชี้ทาง (Mythology)']).trim() : '';
    if (meow['Keyword']) {
      const kwText = String(meow['Keyword']).trim();
      coreMeaning = kwText;
      concept = kwText;
      readingGeneral = kwText;
      advice = kwText;
      affirmation = kwText;
      strategy = kwText;
      const parsedKws = kwText.split(/[,•\n]+|\s{2,}/).map(s => s.trim()).filter(Boolean);
      keywords = parsedKws.length > 1 ? parsedKws : kwText.split(/\s+/).filter(Boolean);
      keywordsTh = keywords;
    }

    // Exclusively use ความหมายไพ่เทพเหมียว: clear old notion text blocks
    essence = '';
    symbolism = '';
    readingWork = '';
    readingFinance = '';
    readingLove = '';
    readingHealth = '';
    personalityLight = '';
    personalityShadow = '';
    careers = '';
  }

  // Get element description from Sheet 2 (ข้อมูลธาตุ)
  let elemKey = 'น้ำ';
  if (elemInfo.name.includes('ไม้')) elemKey = 'ไม้';
  else if (elemInfo.name.includes('ไฟ')) elemKey = 'ไฟ';
  else if (elemInfo.name.includes('ดิน')) elemKey = 'ดิน';
  else if (elemInfo.name.includes('ทอง')) elemKey = 'ทอง';
  const elementDesc = elementRules[elemKey] || '';

  const cardObj = {
    id,
    keyword: existingKeywordsById.get(id) || '',
    card_no: cardNo,
    type: cardType,
    suit_name_th: suitNameTh,
    suit_name_en: suitNameEn,
    title: fullTitle,
    name: fullTitle,
    name_th: nameTh,
    name_en: nameEn,
    name_cn: nameCn,
    element: elemInfo.name,
    element_type: elemInfo.type,
    element_icon: elemInfo.icon,
    element_color: elemInfo.color,
    element_desc: elementDesc,
    element_association: elementDesc,
    image: imageJiuTian,
    image_alt: imageCard,
    concept: coreMeaning,
    core_meaning: coreMeaning,
    essence: essence,
    symbolism: symbolism,
    strategy: strategy,
    reading_overview: readingGeneral,
    reading_work: readingWork,
    reading_finance: readingFinance,
    reading_love: readingLove,
    reading_health: readingHealth,
    personality_light: personalityLight,
    personality_shadow: personalityShadow,
    light: coreMeaning,
    shadow: '',
    cat_wisdom: coreMeaning,
    character: 'ไพ่เทพเหมียว',
    deck: 'ไพ่เทพเหมียว',
    careers: careers,
    affirmation: affirmation,
    advice: advice,
    keywords,
    keywords_th: keywordsTh.length ? keywordsTh : keywords.slice(0, 4),
    keywords_en: keywordsEn.length ? keywordsEn : [],
    mythology: mythology,
    has_full_md: !!meow
  };

  allCards.push(cardObj);
}

console.log(`Compiled all ${allCards.length} Jiu Tian cards!`);

// Save JiuTianData/jiutian-cards.json
const jsonPath = path.join(jiuTianDir, 'jiutian-cards.json');
fs.writeFileSync(jsonPath, JSON.stringify(allCards, null, 2), 'utf8');
console.log(`[SUCCESS] Written ${allCards.length} cards to ${jsonPath}`);

// Save data/jiutian-cards.js
const jsContent = `// ============================================================================
// JIU TIAN ARCANA CARDS (96 CARDS - ไพ่เทพจีนจิ่วเทียน)
// ข้อมูลสมบูรณ์จาก JiuTianData และ คู่มือไพ่เทพจีน v4 ครบทั้ง 96 ใบ
// รองรับการใช้งานทั้งเบราว์เซอร์ (window.JIUTIAN_CARDS) และ ES Module
// ============================================================================

const jiutianCards = ${JSON.stringify(allCards, null, 2)};
const thepMeowCards = jiutianCards;

if (typeof window !== 'undefined') {
  window.JIUTIAN_CARDS = jiutianCards;
  window.THEP_MEOW_CARDS = jiutianCards;
  console.log('[SUCCESS] Loaded ' + window.JIUTIAN_CARDS.length + ' ไพ่เทพเหมียว cards into window.JIUTIAN_CARDS');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = jiutianCards;
}
`;

const jsPath = path.join(dataDir, 'jiutian-cards.js');
fs.writeFileSync(jsPath, jsContent, 'utf8');
console.log(`[SUCCESS] Written ${allCards.length} cards to ${jsPath}`);
