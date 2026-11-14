const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const target = '  // Reveal Divination Button -> Go to Step 2 (Results)';
if (!app.includes(target)) {
  console.error('Target not found in app.js');
  process.exit(1);
}

const addition = `  // Auto-draw cards into all positions of the active spread
  function handleAutoDrawCards() {
    const pool = fortuneState.activeCardsPool;
    if (!pool || pool.length === 0) return;
    const totalSlots = fortuneState.drawnCards.length;

    // Pick totalSlots distinct random cards from pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, totalSlots);

    for (let i = 0; i < totalSlots; i++) {
      fortuneState.drawnCards[i] = selected[i];
    }
    fortuneState.currentPickSlot = totalSlots;

    // Update picked cards visually in fan deck
    if (deckFanWrapper) {
      const fanCards = Array.from(deckFanWrapper.querySelectorAll('.fan-card-item'));
      fanCards.forEach(fc => fc.classList.remove('card-picked'));
      const fanIndices = fanCards.map((_, i) => i);
      for (let i = fanIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fanIndices[i], fanIndices[j]] = [fanIndices[j], fanIndices[i]];
      }
      for (let i = 0; i < Math.min(totalSlots, fanCards.length); i++) {
        fanCards[fanIndices[i]].classList.add('card-picked');
      }
    }

    updateSlotVisuals();

    // Trigger reveal divination banner
    const mode = fortuneState.readingMode || fortuneState.spreadType || 'daily';
    if (revealBannerTitle) {
      if (mode === 'daily') {
        revealBannerTitle.textContent = 'สุ่มไพ่ประจำวันเรียบร้อยแล้ว!';
      } else if (mode === 'choice') {
        revealBannerTitle.textContent = 'สุ่มไพ่ครบ 5 ใบเรียบร้อยแล้ว!';
      } else {
        revealBannerTitle.textContent = 'สุ่มไพ่ครบ 3 ใบเรียบร้อยแล้ว!';
      }
    }
    if (revealDivinationBtn) {
      if (mode === 'daily') {
        revealDivinationBtn.innerHTML = '<i class="fa-solid fa-sun"></i> อ่านผลทำนายไพ่ประจำวัน ✨';
      } else if (mode === 'choice') {
        revealDivinationBtn.innerHTML = '<i class="fa-solid fa-code-fork"></i> อ่านผลทำนายทางเลือก (5 ใบ) ✨';
      } else {
        revealDivinationBtn.innerHTML = '<i class="fa-solid fa-crystal-ball"></i> อ่านผลทำนายอนาคต (3 ใบ) ✨';
      }
    }
    if (revealTriggerBanner) {
      revealTriggerBanner.classList.remove('hidden');
      revealTriggerBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function handleShuffleDeck() {
    resetPicks();
    renderFanDeck();
    updateSlotVisuals();
  }

  if (autoDraw3CardsBtn) {
    autoDraw3CardsBtn.addEventListener('click', handleAutoDrawCards);
  }

  if (shuffleDeckCardsBtn) {
    shuffleDeckCardsBtn.addEventListener('click', handleShuffleDeck);
  }

`;

app = app.replace(target, addition + target);
fs.writeFileSync('app.js', app, 'utf8');
console.log('Successfully patched app.js with handleAutoDrawCards and handleShuffleDeck.');
