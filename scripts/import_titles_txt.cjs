const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const dbPath = path.join(rootDir, 'jiutian-arcana-database-v2.json');
const inputPath = path.join(rootDir, 'card_titles.txt');

if (!fs.existsSync(inputPath)) {
  console.error(`File not found: ${inputPath}`);
  process.exit(1);
}

const txt = fs.readFileSync(inputPath, 'utf8');
const lines = txt.split('\n');

const titleUpdates = new Map();

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  
  // Format: [id] name = title
  const match = trimmed.match(/^\[(\d+)\]\s*(.*?)\s*=\s*(.*)$/);
  if (match) {
    const id = parseInt(match[1], 10);
    const name = match[2].trim();
    const title = match[3].trim();
    titleUpdates.set(id, { name, title });
  }
}

console.log(`Parsed ${titleUpdates.size} card titles from card_titles.txt`);

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let updatedCount = 0;
db.cards.forEach((card, idx) => {
  const id = card.id !== undefined ? card.id : (idx + 1);
  if (titleUpdates.has(id)) {
    const item = titleUpdates.get(id);
    if (!card.deity) card.deity = {};
    if (item.title) {
      card.deity.title = item.title;
    }
    if (item.name) {
      card.name_th = item.name;
      card.deity.name_th = item.name;
    }
    updatedCount++;
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log(`Successfully updated ${updatedCount} cards in jiutian-arcana-database-v2.json`);

// Now sync into data/jiutian-cards.js
require('./build_jiutian_v2_db.cjs');
