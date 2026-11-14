const fs = require('fs');
const assert = require('assert');

console.log('--- TEST 1: AUDIT 92 CARDS MAPPING & IMAGES ---');
const db = JSON.parse(fs.readFileSync('jiutian-arcana-database-v2.json', 'utf8'));
assert.strictEqual(db.cards.length, 96, 'Total cards in db should be 96');

// Cards 1..92
for (let i = 1; i <= 92; i++) {
  const c = db.cards.find(card => card.id === i);
  assert(c, `Card with id ${i} must exist`);
  assert(c.name_th, `Card ${i} must have name_th`);
  assert(c.name_en, `Card ${i} must have name_en`);
  assert(fs.existsSync(c.image), `Card ${i} image file ${c.image} must exist`);
}

// Check specifically 57, 58, 60
const c57 = db.cards.find(c => c.id === 57);
const c58 = db.cards.find(c => c.id === 58);
const c60 = db.cards.find(c => c.id === 60);

console.log('Card 57:', c57.name_th, '|', c57.name_en, '|', c57.image);
console.log('Card 58:', c58.name_th, '|', c58.name_en, '|', c58.image);
console.log('Card 60:', c60.name_th, '|', c60.name_en, '|', c60.image);

assert.strictEqual(c57.name_th, 'หยุดคิดไตร่ตรอง');
assert.strictEqual(c57.name_en, 'Seven of Earth');
assert.strictEqual(c58.name_th, 'ฝึกฝนเชี่ยวชาญ');
assert.strictEqual(c58.name_en, 'Eight of Earth');
assert.strictEqual(c60.name_th, 'วงศ์ตระกูลมั่งคั่ง');
assert.strictEqual(c60.name_en, 'Ten of Earth');

console.log('✅ TEST 1 PASSED: All 92 cards mapped and verified.');

console.log('--- TEST 2: SIMULATE AUTO DRAW ON SPREADS ---');
const pool = db.cards.filter(c => c.id <= 92);

['daily', 'choice', 'future'].forEach(mode => {
  const cardCounts = { daily: 1, choice: 5, future: 3 };
  const totalSlots = cardCounts[mode];
  
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, totalSlots);
  
  assert.strictEqual(selected.length, totalSlots, `Should select exactly ${totalSlots} cards for ${mode}`);
  
  // Verify all selected are unique
  const ids = new Set(selected.map(c => c.id));
  assert.strictEqual(ids.size, totalSlots, `Selected cards in ${mode} must be unique`);
  console.log(`✅ ${mode.toUpperCase()} (${totalSlots} cards):`, selected.map(c => `${c.id}.${c.name_th}`).join(', '));
});

console.log('✅ TEST 2 PASSED: Auto-draw simulation passed for all 3 spreads.');
