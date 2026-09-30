import fs from 'fs';
import path from 'path';

const appPath = path.resolve('app.js');
const cssPath = path.resolve('styles.css');

let appContent = fs.readFileSync(appPath, 'utf8');
let cssContent = fs.readFileSync(cssPath, 'utf8');

// 1. UPDATE app.js: renderFanDeck, handleFanCardPick, autoDraw3CardsBtn
const oldRenderFan = `  function renderFanDeck() {
    if (!deckFanWrapper) return;
    deckFanWrapper.innerHTML = '';

    const backImg = getDeckBackImage();
    const cardCount = 26; // Number of cards in fan arc
    const angleStep = 48 / cardCount; // Angle spread
    const startAngle = -24;

    for (let i = 0; i < cardCount; i++) {
      const cardEl = document.createElement('div');
      cardEl.className = 'fan-card-item';
      cardEl.style.backgroundImage = \\x60url("\${backImg}")\\x60;
      cardEl.setAttribute('data-fan-index', i);

      const angle = startAngle + i * angleStep;
      const xOffset = (i - cardCount / 2) * 22;
      const yOffset = Math.abs(angle) * 1.5;

      cardEl.style.transform = \\x60translateX(\${xOffset}px) translateY(\${yOffset}px) rotate(\${angle}deg)\\x60;
      cardEl.style.zIndex = i + 1;

      cardEl.addEventListener('click', () => {
        handleFanCardPick(cardEl);
      });

      deckFanWrapper.appendChild(cardEl);
    }
  }

  function handleFanCardPick(cardEl) {
    if (fortuneState.currentPickSlot >= 3) return;

    // Animate clicked card floating up
    cardEl.style.transform = 'translateY(-120px) scale(0) rotate(15deg)';
    cardEl.style.opacity = '0';
    cardEl.style.pointerEvents = 'none';

    // Pick random unpicked card from pool
    const pool = fortuneState.activeCardsPool;
    const available = pool.filter(c => !fortuneState.drawnCards.some(dc => dc && dc.id === c.id));
    const randomCard = available.length > 0 
      ? available[Math.floor(Math.random() * available.length)]
      : pool[Math.floor(Math.random() * pool.length)];

    assignCardToSlot(fortuneState.currentPickSlot, randomCard);

    // Find next unfilled slot
    const nextSlot = fortuneState.drawnCards.findIndex(c => c === null);
    fortuneState.currentPickSlot = nextSlot !== -1 ? nextSlot : 3;

    updateSlotVisuals();
  }`;

// Use normal string match for app.js
const targetPart = `  function renderFanDeck() {
    if (!deckFanWrapper) return;
    deckFanWrapper.innerHTML = '';

    const backImg = getDeckBackImage();
    const cardCount = 26; // Number of cards in fan arc
    const angleStep = 48 / cardCount; // Angle spread
    const startAngle = -24;

    for (let i = 0; i < cardCount; i++) {
      const cardEl = document.createElement('div');
      cardEl.className = 'fan-card-item';
      cardEl.style.backgroundImage = \`url("\${backImg}")\`;
      cardEl.setAttribute('data-fan-index', i);

      const angle = startAngle + i * angleStep;
      const xOffset = (i - cardCount / 2) * 22;
      const yOffset = Math.abs(angle) * 1.5;

      cardEl.style.transform = \`translateX(\${xOffset}px) translateY(\${yOffset}px) rotate(\${angle}deg)\`;
      cardEl.style.zIndex = i + 1;

      cardEl.addEventListener('click', () => {
        handleFanCardPick(cardEl);
      });

      deckFanWrapper.appendChild(cardEl);
    }
  }

  function handleFanCardPick(cardEl) {
    if (fortuneState.currentPickSlot >= 3) return;

    // Animate clicked card floating up
    cardEl.style.transform = 'translateY(-120px) scale(0) rotate(15deg)';
    cardEl.style.opacity = '0';
    cardEl.style.pointerEvents = 'none';

    // Pick random unpicked card from pool
    const pool = fortuneState.activeCardsPool;
    const available = pool.filter(c => !fortuneState.drawnCards.some(dc => dc && dc.id === c.id));
    const randomCard = available.length > 0 
      ? available[Math.floor(Math.random() * available.length)]
      : pool[Math.floor(Math.random() * pool.length)];

    assignCardToSlot(fortuneState.currentPickSlot, randomCard);

    // Find next unfilled slot
    const nextSlot = fortuneState.drawnCards.findIndex(c => c === null);
    fortuneState.currentPickSlot = nextSlot !== -1 ? nextSlot : 3;

    updateSlotVisuals();
  }`;

const replacementFan = `  function renderFanDeck() {
    if (!deckFanWrapper) return;
    deckFanWrapper.innerHTML = '';

    const backImg = getDeckBackImage();
    const cardCount = 26; // Number of cards in fan arc
    const angleStep = 46 / cardCount; // Angle spread
    const startAngle = -23;

    for (let i = 0; i < cardCount; i++) {
      const cardEl = document.createElement('div');
      cardEl.className = 'fan-card-item';
      cardEl.style.backgroundImage = \`url("\${backImg}")\`;
      cardEl.setAttribute('data-fan-index', i);

      const angle = Math.round((startAngle + i * angleStep) * 10) / 10;
      const xOffset = Math.round((i - cardCount / 2) * 22);
      const yOffset = Math.round(Math.abs(angle) * 1.5);

      // Set CSS Custom Properties for silky-smooth hardware-accelerated transforms
      cardEl.style.setProperty('--card-x', \`\${xOffset}px\`);
      cardEl.style.setProperty('--card-y', \`\${yOffset}px\`);
      cardEl.style.setProperty('--card-rot', \`\${angle}deg\`);
      cardEl.style.zIndex = i + 1;

      cardEl.addEventListener('click', () => {
        handleFanCardPick(cardEl);
      });

      deckFanWrapper.appendChild(cardEl);
    }
  }

  function handleFanCardPick(cardEl) {
    if (fortuneState.currentPickSlot >= 3) return;
    if (cardEl.classList.contains('card-picked')) return;

    // Smoothly float the clicked card upwards and fade out
    cardEl.classList.add('card-picked');

    // Pick random unpicked card from pool
    const pool = fortuneState.activeCardsPool;
    const available = pool.filter(c => !fortuneState.drawnCards.some(dc => dc && dc.id === c.id));
    const randomCard = available.length > 0 
      ? available[Math.floor(Math.random() * available.length)]
      : pool[Math.floor(Math.random() * pool.length)];

    assignCardToSlot(fortuneState.currentPickSlot, randomCard);

    // Find next unfilled slot
    const nextSlot = fortuneState.drawnCards.findIndex(c => c === null);
    fortuneState.currentPickSlot = nextSlot !== -1 ? nextSlot : 3;

    updateSlotVisuals();
  }`;

if (appContent.includes(targetPart)) {
  appContent = appContent.replace(targetPart, replacementFan);
  console.log('Updated renderFanDeck and handleFanCardPick in app.js!');
} else {
  console.error('Could not find targetPart in app.js');
}

// Staggered Auto Draw 3 Cards for smooth experience
const oldAutoDraw = `  // Auto Draw 3 Cards (Instant)
  if (autoDraw3CardsBtn) {
    autoDraw3CardsBtn.addEventListener('click', () => {
      const pool = fortuneState.activeCardsPool;
      if (!pool || pool.length === 0) return;

      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      fortuneState.drawnCards = [shuffled[0], shuffled[1], shuffled[2]];
      fortuneState.currentPickSlot = 3;

      updateSlotVisuals();

      if (revealTriggerBanner) {
        revealTriggerBanner.classList.remove('hidden');
        revealTriggerBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }`;

const newAutoDraw = `  // Auto Draw 3 Cards with silky staggered animation
  if (autoDraw3CardsBtn) {
    autoDraw3CardsBtn.addEventListener('click', () => {
      const pool = fortuneState.activeCardsPool;
      if (!pool || pool.length === 0) return;

      const fanCards = deckFanWrapper ? Array.from(deckFanWrapper.querySelectorAll('.fan-card-item:not(.card-picked)')) : [];
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      
      // Sequentially pick for each unfilled slot with 180ms stagger
      let delay = 0;
      for (let s = 0; s < 3; s++) {
        const slotIdx = s;
        setTimeout(() => {
          if (fanCards.length > slotIdx) {
            const randomFan = fanCards[Math.floor(Math.random() * fanCards.length)];
            if (randomFan) randomFan.classList.add('card-picked');
          }
          assignCardToSlot(slotIdx, shuffled[slotIdx]);
          fortuneState.currentPickSlot = slotIdx < 2 ? slotIdx + 1 : 3;
          updateSlotVisuals();
        }, delay);
        delay += 180;
      }
    });
  }`;

if (appContent.includes(oldAutoDraw)) {
  appContent = appContent.replace(oldAutoDraw, newAutoDraw);
  console.log('Updated autoDraw3CardsBtn with smooth stagger in app.js!');
}

fs.writeFileSync(appPath, appContent, 'utf8');

// 2. UPDATE styles.css: Fan card smooth transforms and slot landing animation
const oldFanCSS = `/* Interactive Fan Stage */
.deck-fan-stage {
  position: relative;
  height: 295px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  padding-bottom: 24px;
  background: radial-gradient(circle at center bottom, rgba(236, 72, 153, 0.15) 0%, transparent 70%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.deck-fan-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.fan-card-item {
  position: absolute;
  bottom: 12px;
  width: 114px;
  height: 184px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.55);
  transform-origin: center 120%;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
}

.fan-card-item:hover {
  transform: translateY(-50px) scale(1.2) !important;
  z-index: 100 !important;
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.7), 0 0 30px rgba(236, 72, 153, 0.8);
  border-color: #f472b6;
}`;

const newFanCSS = `/* Interactive Fan Stage - Silky Smooth 60fps */
.deck-fan-stage {
  position: relative;
  height: 300px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  padding-bottom: 24px;
  background: radial-gradient(ellipse at center bottom, rgba(236, 72, 153, 0.18) 0%, transparent 72%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.deck-fan-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  perspective: 1000px;
}

.fan-card-item {
  position: absolute;
  bottom: 16px;
  width: 116px;
  height: 186px;
  border-radius: 14px;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.5);
  transform-origin: 50% 130%;
  transform: translateX(var(--card-x, 0px)) translateY(var(--card-y, 0px)) rotate(var(--card-rot, 0deg));
  transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.28s ease, border-color 0.25s ease, opacity 0.35s ease;
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  will-change: transform;
}

/* Silky smooth hover that preserves the natural fan angle & trajectory */
.fan-card-item:hover {
  transform: translateX(var(--card-x, 0px)) translateY(calc(var(--card-y, 0px) - 36px)) rotate(var(--card-rot, 0deg)) scale(1.08) !important;
  z-index: 999 !important;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.7), 0 0 30px rgba(236, 72, 153, 0.7);
  border-color: #f472b6;
}

/* Silky card pick exit animation */
.fan-card-item.card-picked {
  transform: translateX(var(--card-x, 0px)) translateY(calc(var(--card-y, 0px) - 100px)) rotate(var(--card-rot, 0deg)) scale(0.5) !important;
  opacity: 0 !important;
  pointer-events: none !important;
  transition: transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.35s ease !important;
}`;

if (cssContent.includes(oldFanCSS)) {
  cssContent = cssContent.replace(oldFanCSS, newFanCSS);
  console.log('Updated fan-card-item CSS in styles.css!');
} else {
  console.log('Exact oldFanCSS not found, replacing via regex...');
  cssContent = cssContent.replace(
    /\.fan-card-item\s*\{[^}]+\}\s*\.fan-card-item:hover\s*\{[^}]+\}/g,
    newFanCSS
  );
}

// Add slot card landing animation if not present
if (!cssContent.includes('@keyframes cardSlotLand')) {
  cssContent = cssContent.replace(
    `.slot-filled-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 14px;
}`,
    `@keyframes cardSlotLand {
  0% {
    transform: translateY(-20px) scale(0.9);
    opacity: 0;
  }
  60% {
    transform: translateY(3px) scale(1.02);
    opacity: 0.95;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.slot-filled-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 14px;
  animation: cardSlotLand 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}`
  );
  console.log('Added cardSlotLand animation to styles.css!');
}

fs.writeFileSync(cssPath, cssContent, 'utf8');
console.log('All animation fixes applied successfully!');
