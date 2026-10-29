const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const jiuTianDir = path.join(rootDir, 'JiuTianData');
const v2DbPath = path.join(rootDir, 'jiutian-arcana-database-v2.json');
const jsOutputPath = path.join(rootDir, 'data', 'jiutian-arcana-database-v2.js');

// 1. Read existing v2 DB
const existingV2 = JSON.parse(fs.readFileSync(v2DbPath, 'utf8'));
const existingV2CardsMap = new Map();
(existingV2.cards || []).forEach(c => {
  existingV2CardsMap.set(c.card_id, c);
});

console.log(`Loaded ${existingV2CardsMap.size} existing curated cards from v2`);

// 2. Read JiuTianData/jiutian-cards.json master metadata
const masterCards = JSON.parse(fs.readFileSync(path.join(jiuTianDir, 'jiutian-cards.json'), 'utf8'));
console.log(`Loaded ${masterCards.length} master card definitions`);

// 3. Map markdown files
const mdFiles = fs.readdirSync(jiuTianDir).filter(f => f.endsWith('.md'));
const mdMap = new Map();

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
  if (id) mdMap.set(id, f);
}

console.log(`Mapped ${mdMap.size} markdown files`);

function cleanDomainText(str) {
  if (!str) return '';
  return str
    .replace(/^[-*•\s]+/, '')
    .replace(/^(?:\*\*)?(?:ภาพรวมของไพ่ใบนี้|ภาพรวม|การงาน\/ธุรกิจ|การงาน|การเงิน\/โชคลาภ|การเงิน|ความรัก\/ความสัมพันธ์|ความรัก|สุขภาพ)(?:\*\*)?[:：\s]*/i, '')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseMarkdownCard(content) {
  const text = content.replace(/\r\n/g, '\n');

  // Element
  const elemM = text.match(/\*\*ธาตุประจำตัว:\*\*\s*(.*)/);
  const elementRaw = elemM ? elemM[1].trim() : '';

  // Concept
  const concM = text.match(/\*\*คอนเซปต์หลัก:\*\*\s*(.*)/);
  const concept = concM ? concM[1].trim() : '';

  // Extract sections 1 to 9
  function getSectionBody(secNum, nextNum) {
    const nextPattern = nextNum ? `(?:^|\\n)(?:#{1,4}\\s*)?(?:\\*\\*)?${nextNum}\\.\\s*` : '$';
    const regex = new RegExp(`(?:^|\\n)(?:#{1,4}\\s*)?(?:\\*\\*)?${secNum}\\.\\s*[\\s\\S]*?\\n([\\s\\S]*?)(?=${nextPattern})`, 'i');
    const m = text.match(regex);
    return m ? m[1].trim() : '';
  }

  const sec1 = getSectionBody(1, 2);
  const sec2 = getSectionBody(2, 3);
  const sec3 = getSectionBody(3, 4);
  const sec4 = getSectionBody(4, 5);
  const sec5 = getSectionBody(5, 6);
  const sec6 = getSectionBody(6, 7);
  const sec7Full = getSectionBody(7, 8);
  const sec8 = getSectionBody(8, 9);
  const sec9 = getSectionBody(9, null);

  // Parse Section 4: Reading Guidance (Domains)
  const reading = {
    overview: '',
    career: '',
    finance: '',
    love: '',
    health: ''
  };

  const lines = sec4.split('\n');
  let curKey = 'overview';
  const curLines = [];

  function flushKey() {
    if (curLines.length > 0) {
      const val = cleanDomainText(curLines.join(' '));
      if (!reading[curKey]) reading[curKey] = val;
      curLines.length = 0;
    }
  }

  for (const rawLine of lines) {
    const l = rawLine.trim();
    if (!l) continue;

    if (/(?:ภาพรวม|ทั่วไป)/i.test(l) && (l.startsWith('-') || l.startsWith('*') || l.includes('**'))) {
      flushKey();
      curKey = 'overview';
      const c = cleanDomainText(l);
      if (c) curLines.push(c);
    } else if (/(?:การงาน|ธุรกิจ)/i.test(l) && (l.startsWith('-') || l.startsWith('*') || l.includes('**'))) {
      flushKey();
      curKey = 'career';
      const c = cleanDomainText(l);
      if (c) curLines.push(c);
    } else if (/(?:การเงิน|โชคลาภ)/i.test(l) && (l.startsWith('-') || l.startsWith('*') || l.includes('**'))) {
      flushKey();
      curKey = 'finance';
      const c = cleanDomainText(l);
      if (c) curLines.push(c);
    } else if (/(?:ความรัก|ความสัมพันธ์)/i.test(l) && (l.startsWith('-') || l.startsWith('*') || l.includes('**'))) {
      flushKey();
      curKey = 'love';
      const c = cleanDomainText(l);
      if (c) curLines.push(c);
    } else if (/(?:สุขภาพ)/i.test(l) && (l.startsWith('-') || l.startsWith('*') || l.includes('**'))) {
      flushKey();
      curKey = 'health';
      const c = cleanDomainText(l);
      if (c) curLines.push(c);
    } else {
      const c = cleanDomainText(l);
      if (c) curLines.push(c);
    }
  }
  flushKey();

  // Parse Section 5: Personality (Light & Shadow)
  let light = '';
  let shadow = '';
  if (sec5.includes('ด้านเงา') || sec5.includes('ในด้านเงา')) {
    const parts = sec5.split(/(?:ในด้านเงา|\*\*ในด้านเงา\*\*|\*\*ด้านเงา\*\*|ด้านเงา)/);
    light = parts[0].replace(/\*\*/g, '').replace(/^[-*]\s*/gm, '').replace(/\s+/g, ' ').trim();
    shadow = (parts[1] || '').replace(/\*\*/g, '').replace(/^[-*]\s*/gm, '').replace(/\s+/g, ' ').trim();
  } else {
    light = sec5.replace(/\*\*/g, '').replace(/^[-*]\s*/gm, '').replace(/\s+/g, ' ').trim();
  }

  // Parse Section 7: Key Affirmation / Deity Message
  let affirmation = '';
  const affMatch = text.match(/(?:^|\n)(?:#{1,4}\s*)?(?:\*\*)?7\.\s*(?:Key Affirmation:?)?\s*(?:\*\*)?\s*["“'‘]?([^"”'’\n\r]+)["”'’]?/i);
  if (affMatch && affMatch[1].trim() && !affMatch[1].toLowerCase().includes('affirmation')) {
    affirmation = affMatch[1].replace(/["“'‘”’]/g, '').trim();
  } else {
    affirmation = sec7Full.split('\n')[0].replace(/["“'‘”’]/g, '').replace(/^[-*]\s*/, '').replace(/^Key Affirmation:?\s*/i, '').trim();
  }

  // Parse Section 8: Keywords
  const kwRaw = sec8.replace(/^Keyword:?\s*/i, '').replace(/\*\*/g, '');
  const keywords = kwRaw
    .split(/[•,·|/]/)
    .map(k => k.trim())
    .filter(k => k.length > 0 && !k.toLowerCase().startsWith('keyword') && !k.startsWith('-'));

  // Parse Section 9: Legend / Mythology
  const legend = sec9
    .split('\n')
    .filter(l => !l.startsWith('Created:') && !l.startsWith('##') && !l.startsWith('![') && l.trim() !== '…')
    .join(' ')
    .replace(/\s+/g, ' ')
    .replace(/\*\*/g, '')
    .trim();

  return {
    elementRaw,
    concept: concept.replace(/\*\*/g, '').trim(),
    essence: sec1.replace(/\*\*/g, '').replace(/^[-*]\s*/gm, '').replace(/\s+/g, ' ').trim(),
    symbolism: sec2.replace(/\*\*/g, '').trim(),
    strategy: sec3.replace(/^[>*-]\s*/gm, '').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim(),
    reading,
    personality: {
      desc: light,
      light,
      shadow
    },
    careers: sec6.replace(/\*\*/g, '').replace(/^[-*]\s*/gm, '').replace(/\s+/g, ' ').trim(),
    affirmation,
    keywords,
    legend
  };
}

// Convert element to standard EN and TH
function normalizeElement(elemStr) {
  const s = (elemStr || '').toLowerCase();
  if (s.includes('น้ำ') || s.includes('water')) return { en: 'WATER', th: 'ธาตุน้ำ' };
  if (s.includes('ไฟ') || s.includes('fire')) return { en: 'FIRE', th: 'ธาตุไฟ' };
  if (s.includes('ไม้') || s.includes('wood')) return { en: 'WOOD', th: 'ธาตุไม้' };
  if (s.includes('ดิน') || s.includes('earth')) return { en: 'EARTH', th: 'ธาตุดิน' };
  if (s.includes('ทอง') || s.includes('metal')) return { en: 'METAL', th: 'ธาตุทอง' };
  return { en: 'WATER', th: 'ธาตุน้ำ' };
}

// Build standard v2 Card ID
function getCardId(id) {
  if (id >= 1 && id <= 22) {
    const num = id - 1;
    return `M${String(num).padStart(2, '0')}`;
  }
  if (id >= 23 && id <= 36) {
    const num = id - 22;
    return `W${String(num).padStart(2, '0')}`;
  }
  if (id >= 37 && id <= 50) {
    const num = id - 36;
    return `F${String(num).padStart(2, '0')}`;
  }
  if (id >= 51 && id <= 64) {
    const num = id - 50;
    return `E${String(num).padStart(2, '0')}`;
  }
  if (id >= 65 && id <= 78) {
    const num = id - 64;
    return `ME${String(num).padStart(2, '0')}`;
  }
  if (id >= 79 && id <= 92) {
    const num = id - 78;
    return `WA${String(num).padStart(2, '0')}`;
  }
  return `S${String(id - 92).padStart(2, '0')}`;
}

// Determine Arcana Type
function getArcanaType(id) {
  if (id >= 1 && id <= 22) return 'MAJOR';
  if (id >= 23 && id <= 36) return 'MINOR_WOOD';
  if (id >= 37 && id <= 50) return 'MINOR_FIRE';
  if (id >= 51 && id <= 64) return 'MINOR_EARTH';
  if (id >= 65 && id <= 78) return 'MINOR_METAL';
  if (id >= 79 && id <= 92) return 'MINOR_WATER';
  return 'SPECIAL';
}

function getCardNumber(id) {
  if (id >= 1 && id <= 22) return id - 1;
  if (id >= 23 && id <= 36) return id - 22;
  if (id >= 37 && id <= 50) return id - 36;
  if (id >= 51 && id <= 64) return id - 50;
  if (id >= 65 && id <= 78) return id - 64;
  if (id >= 79 && id <= 92) return id - 78;
  return id - 92;
}

// Build 96 cards
const finalCards = [];

for (let id = 1; id <= 96; id++) {
  const cardId = getCardId(id);
  const master = masterCards[id - 1] || {};
  const arcanaType = getArcanaType(id);
  const number = getCardNumber(id);
  const mdFileName = mdMap.get(id);

  let mdParsed = null;
  if (mdFileName) {
    const mdContent = fs.readFileSync(path.join(jiuTianDir, mdFileName), 'utf8');
    mdParsed = parseMarkdownCard(mdContent);
  }

  // Preserve all existing cards in v2 DB so manual edits in jiutian-arcana-database-v2.json are never lost
  const existingV2Card = existingV2CardsMap.get(cardId) || (existingV2.cards || []).find(c => c.id === id);

  const elemNorm = normalizeElement(mdParsed?.elementRaw || master.element);

  let cardObj = null;

  if (existingV2Card) {
    // Preserve curated v2 card and complement with app compatibility fields
    cardObj = {
      card_id: existingV2Card.card_id,
      id: id,
      keyword: existingV2Card.keyword || master.keyword || '',
      number: existingV2Card.number !== undefined ? existingV2Card.number : number,
      name_en: existingV2Card.name_en || master.name_en || `Card ${id}`,
      name_th: existingV2Card.name_th || master.name_th || '',
      name_cn: existingV2Card.name_cn || master.name_cn || '',
      arcana_type: existingV2Card.arcana_type || arcanaType,
      element: existingV2Card.element || elemNorm.en,
      element_th: elemNorm.th,
      image: existingV2Card.image || `JiuTianCardImage/${id}.webp`,
      image_alt: master.image_alt || `CardImage/Major${number}.png`,
      deity: {
        name_th: existingV2Card.deity?.name_th || master.name_th || '',
        title: existingV2Card.deity?.title || mdParsed?.concept || '',
        legend_summary: existingV2Card.deity?.legend_summary || mdParsed?.legend || ''
      },
      keywords: existingV2Card.keywords && existingV2Card.keywords.length > 0
        ? existingV2Card.keywords
        : (mdParsed?.keywords || master.keywords || []),
      meanings: {
        core: existingV2Card.meanings?.core || mdParsed?.reading?.overview || mdParsed?.concept || '',
        light_side: existingV2Card.meanings?.light_side || mdParsed?.personality?.light || '',
        shadow_side: existingV2Card.meanings?.shadow_side || mdParsed?.personality?.shadow || '',
        domains: {
          career: existingV2Card.meanings?.domains?.career || mdParsed?.reading?.career || '',
          finance: existingV2Card.meanings?.domains?.finance || mdParsed?.reading?.finance || '',
          love: existingV2Card.meanings?.domains?.love || mdParsed?.reading?.love || '',
          health: existingV2Card.meanings?.domains?.health || mdParsed?.reading?.health || '',
          personality: existingV2Card.meanings?.domains?.personality || mdParsed?.personality?.desc || ''
        }
      },
      strategy: existingV2Card.strategy || mdParsed?.strategy || '',
      deity_message: existingV2Card.deity_message || mdParsed?.affirmation || master.advice || ''
    };
  } else {
    // Build from markdown and master
    const nameTh = master.name_th || (mdFileName ? mdFileName.replace(/^\d+-/, '').replace(/\.md$/, '').split(' ')[0] : `ไพ่ใบที่ ${id}`);
    const nameEn = master.name_en || `Card ${id}`;
    const nameCn = master.name_cn || '';

    // Legend summary fallback
    let legendText = mdParsed?.legend || '';
    if (legendText.length > 300) {
      // Pick first 2 sentences for concise elegance
      const sents = legendText.split(/(?<=[.!?。])\s+/);
      legendText = sents.slice(0, 3).join(' ');
    }

    cardObj = {
      card_id: cardId,
      id: id,
      keyword: master.keyword || '',
      number: number,
      name_en: nameEn,
      name_th: nameTh,
      name_cn: nameCn,
      arcana_type: arcanaType,
      element: elemNorm.en,
      element_th: elemNorm.th,
      image: `JiuTianCardImage/${id}.png`,
      image_alt: master.image_alt || `CardImage/Major${number}.png`,
      deity: {
        name_th: nameTh,
        title: mdParsed?.concept || mdParsed?.essence || nameTh,
        legend_summary: legendText || mdParsed?.concept || ''
      },
      keywords: mdParsed?.keywords && mdParsed.keywords.length > 0 ? mdParsed.keywords : (master.keywords || []),
      meanings: {
        core: mdParsed?.reading?.overview || mdParsed?.concept || mdParsed?.essence || '',
        light_side: mdParsed?.personality?.light || mdParsed?.concept || '',
        shadow_side: mdParsed?.personality?.shadow || 'การขาดความสมดุลหรือเร่งร้อนเกินไป',
        domains: {
          career: mdParsed?.reading?.career || 'หน้าที่การงานและการบริหารจัดการตามแนวทางของไพ่',
          finance: mdParsed?.reading?.finance || 'สภาพคล่องและการหมุนเวียนทางการเงิน',
          love: mdParsed?.reading?.love || 'ความเข้าใจ การสื่อสาร และการเกื้อหนุนซึ่งกันและกัน',
          health: mdParsed?.reading?.health || 'รักษาสมดุลของร่างกายและจิตใจอย่างสม่ำเสมอ',
          personality: mdParsed?.personality?.desc || mdParsed?.personality?.light || 'มีศักยภาพและความมุ่งมั่นในตนเอง'
        }
      },
      strategy: mdParsed?.strategy || '',
      deity_message: mdParsed?.affirmation || master.affirmation || master.advice || 'ดำเนินชีวิตด้วยสติปัญญาและหัวใจที่เปิดกว้าง'
    };
  }

  finalCards.push(cardObj);
}

// Construct updated v2 database
const updatedV2Db = {
  project_info: {
    ...existingV2.project_info,
    title: "Jiu Tian Arcana Database (ไพ่เทพเหมียว & เทพจีน 96 ใบ)",
    version: "2.0.0",
    total_cards: finalCards.length,
    last_updated: new Date().toISOString().slice(0, 10) + " - Complete 96 cards with 5 domains, deity messages, light/shadow, and elemental rules"
  },
  cards: finalCards,
  elemental_rules: existingV2.elemental_rules || [],
  spreads: existingV2.spreads || []
};

// Write to JSON database
fs.writeFileSync(v2DbPath, JSON.stringify(updatedV2Db, null, 2), 'utf8');
console.log(`[SUCCESS] Generated ${finalCards.length} cards in ${v2DbPath}`);

// Write browser/client script wrapper data/jiutian-arcana-database-v2.js
const jsContent = `// ============================================================================
// JIU TIAN ARCANA DATABASE V2 (96 CARDS - ไพ่เทพเหมียว & เทพจีน)
// ฐานข้อมูลสมบูรณ์สำหรับระบบอ่านคำทำนาย แม่หมอติ๊ดติ๊ด
// Version: 2.0.0 | Generated: ${new Date().toISOString()}
// ============================================================================

const jiutianDatabaseV2 = ${JSON.stringify(updatedV2Db, null, 2)};

if (typeof window !== 'undefined') {
  window.JIUTIAN_DATABASE_V2 = jiutianDatabaseV2;
  window.JIUTIAN_CARDS_V2 = jiutianDatabaseV2.cards;
  console.log('[SUCCESS] Loaded ' + jiutianDatabaseV2.cards.length + ' cards from jiutianDatabaseV2 into window.JIUTIAN_DATABASE_V2');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = jiutianDatabaseV2;
}
`;

fs.writeFileSync(jsOutputPath, jsContent, 'utf8');
console.log(`[SUCCESS] Generated client wrapper in ${jsOutputPath}`);

// Also update data/jiutian-cards.js for maximum backward compatibility
const jiutianCardsLegacyPath = path.join(rootDir, 'data', 'jiutian-cards.js');
const legacyCards = finalCards.map(c => ({
  ...c,
  name: c.name_th || c.name || '',
  title: `${c.number}-${c.name_th}${c.name_en ? ` (${c.name_en})` : ''}`,
  card_no: c.number,
  general_meaning: c.meanings?.core || '',
  love_meaning: c.meanings?.domains?.love || '',
  work_meaning: [c.meanings?.domains?.career, c.meanings?.domains?.finance].filter(Boolean).join('\n\n'),
  advice: c.deity_message || '',
  reading_overview: c.meanings?.core || '',
  reading_work: c.meanings?.domains?.career || '',
  reading_finance: c.meanings?.domains?.finance || '',
  reading_love: c.meanings?.domains?.love || '',
  reading_health: c.meanings?.domains?.health || '',
  personality_light: c.meanings?.light_side || '',
  personality_shadow: c.meanings?.shadow_side || '',
  light: c.meanings?.light_side || '',
  shadow: c.meanings?.shadow_side || '',
  cat_wisdom: c.deity_message || '',
  character: 'ไพ่เทพเหมียว',
  deck: 'ไพ่เทพเหมียว'
}));

const legacyJsContent = `// ============================================================================
// JIU TIAN ARCANA CARDS (96 CARDS - ไพ่เทพเหมียว & เทพจีน)
// ฐานข้อมูลสมบูรณ์จาก jiutian-arcana-database-v2.json
// ============================================================================

const jiutianCards = ${JSON.stringify(legacyCards, null, 2)};
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

fs.writeFileSync(jiutianCardsLegacyPath, legacyJsContent, 'utf8');
console.log(`[SUCCESS] Synchronized data/jiutian-cards.js with full 96 cards database`);
