import fs from 'fs';
import path from 'path';

const cssPath = path.resolve('styles.css');
const appPath = path.resolve('app.js');

let css = fs.readFileSync(cssPath, 'utf8');
let app = fs.readFileSync(appPath, 'utf8');

// 1. UPDATE app.js: Responsive Fan Deck
const oldFanLogic = `  function renderFanDeck() {
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
  }`;

const newFanLogic = `  function renderFanDeck() {
    if (!deckFanWrapper) return;
    deckFanWrapper.innerHTML = '';

    const isMobile = window.innerWidth <= 640;
    const backImg = getDeckBackImage();
    
    // Responsive card count & spread for mobile vs desktop
    const cardCount = isMobile ? 18 : 26;
    const spreadStep = isMobile ? 13 : 22;
    const angleRange = isMobile ? 42 : 46;
    const angleStep = angleRange / cardCount;
    const startAngle = -(angleRange / 2);

    for (let i = 0; i < cardCount; i++) {
      const cardEl = document.createElement('div');
      cardEl.className = 'fan-card-item';
      cardEl.style.backgroundImage = \`url("\${backImg}")\`;
      cardEl.setAttribute('data-fan-index', i);

      const angle = Math.round((startAngle + i * angleStep) * 10) / 10;
      const xOffset = Math.round((i - cardCount / 2) * spreadStep);
      const yOffset = Math.round(Math.abs(angle) * (isMobile ? 0.9 : 1.5));

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
  }`;

if (app.includes(oldFanLogic)) {
  app = app.replace(oldFanLogic, newFanLogic);
  console.log('Updated renderFanDeck for mobile screens in app.js');
} else {
  console.log('Exact oldFanLogic not found in app.js, checking regex...');
}

// Add window resize listener to recalculate fan on mobile orientation change
if (!app.includes('resizeTimer')) {
  app += `
  // Responsive fan deck re-render on orientation change or window resize
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (fortuneState.step === 3) {
        renderFanDeck();
      }
    }, 250);
  });
`;
  console.log('Added responsive resize listener to app.js');
}

fs.writeFileSync(appPath, app, 'utf8');

// 2. IN styles.css: Add complete Mobile-First & Phone Media Queries
const mobileCSS = `
/* ==========================================================================
   MOBILE & SMARTPHONE RESPONSIVE DESIGN SYSTEM (LINE LIFF & MOBILE BROWSERS)
   Breakpoints: Max-width 768px & Max-width 480px
   ========================================================================== */

@media (max-width: 768px) {
  /* Header Compact Mobile */
  .app-header {
    padding: 10px 14px !important;
    gap: 10px;
  }

  .header-logo {
    gap: 8px;
  }

  .logo-icon {
    font-size: 22px !important;
  }

  .header-logo h1 {
    font-size: 17px !important;
    letter-spacing: 0.5px !important;
  }

  .header-logo .subtitle {
    display: none !important;
  }

  /* On mobile reading app, hide studio tab to keep header clean and focused */
  .header-nav-tabs {
    display: none !important;
  }

  .standalone-badge {
    padding: 4px 10px !important;
    font-size: 10.5px !important;
  }

  .line-user-badge {
    padding: 3px 8px 3px 4px !important;
  }

  .line-user-avatar {
    width: 20px !important;
    height: 20px !important;
  }

  .line-user-name {
    font-size: 11px !important;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* App Canvas on Mobile */
  #readingAppView {
    padding: 16px 12px 60px 12px !important;
  }

  .reading-app-container {
    gap: 16px !important;
  }

  /* Compact Stepper on Mobile */
  .reading-stepper {
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 auto 20px auto !important;
    padding: 6px 4px !important;
  }

  .stepper-track {
    left: 28px !important;
    right: 28px !important;
    height: 2px !important;
  }

  .step-num {
    width: 36px !important;
    height: 36px !important;
    font-size: 13px !important;
  }

  .stepper-step {
    min-width: 65px !important;
    gap: 4px !important;
  }

  .step-label {
    font-size: 11px !important;
    letter-spacing: -0.3px;
  }

  /* Pinned Context Bar on Mobile */
  .pinned-context-bar {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 10px !important;
    padding: 12px 16px !important;
    margin-bottom: 20px !important;
  }

  .context-val {
    max-width: 100% !important;
    font-size: 13.5px !important;
  }

  /* Reading Step Cards on Mobile */
  .reading-step-card {
    padding: 22px 14px !important;
    border-radius: 20px !important;
  }

  /* STEP 1: MOBILE QUESTION */
  .step1-hero {
    margin-bottom: 24px !important;
  }

  .sparkle-orbit {
    width: 58px !important;
    height: 58px !important;
    margin-bottom: 14px !important;
  }

  .step1-main-icon {
    font-size: 26px !important;
  }

  .step1-title {
    font-size: 21px !important;
    line-height: 1.35 !important;
    margin-bottom: 8px !important;
  }

  .step1-desc {
    font-size: 13.5px !important;
    line-height: 1.6 !important;
  }

  .question-textarea-container {
    padding: 14px 16px !important;
    border-radius: 16px !important;
  }

  .question-textarea {
    font-size: 15px !important;
    min-height: 70px !important;
  }

  .suggestion-chips-area {
    margin-top: 18px !important;
  }

  .chips-label {
    font-size: 12.5px !important;
    margin-bottom: 10px !important;
  }

  /* 2-column mobile grid for chips */
  .chips-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 8px !important;
  }

  .chip-btn {
    padding: 9px 10px !important;
    font-size: 12px !important;
    border-radius: 14px !important;
    justify-content: center !important;
    text-align: center !important;
  }

  .step1-action-row {
    margin-top: 24px !important;
  }

  .step1-action-row .btn-primary {
    width: 100% !important;
    padding: 14px 20px !important;
    font-size: 15px !important;
  }

  /* STEP 2: MOBILE DECK SELECTION */
  .step-header-with-back {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 12px !important;
  }

  .step-title-group .step-title {
    font-size: 19px !important;
  }

  .step-title-group .step-desc {
    font-size: 12.5px !important;
  }

  .collection-selection-grid {
    grid-template-columns: 1fr !important;
    gap: 20px !important;
    margin-top: 18px !important;
  }

  .collection-card {
    padding: 18px 16px !important;
    border-radius: 20px !important;
  }

  .collection-media-box {
    height: 190px !important;
    border-radius: 14px !important;
  }

  .collection-name {
    font-size: 19px !important;
  }

  .collection-tagline {
    font-size: 13px !important;
    margin-bottom: 12px !important;
  }

  .collection-style-box {
    padding: 12px 14px !important;
    border-radius: 12px !important;
    margin-bottom: 14px !important;
  }

  .style-header {
    font-size: 13px !important;
  }

  .style-desc {
    font-size: 12.5px !important;
    line-height: 1.6 !important;
  }

  .collection-features {
    gap: 8px !important;
    margin-bottom: 18px !important;
  }

  .collection-features li {
    font-size: 12.5px !important;
  }

  /* STEP 3: MOBILE 3-SLOTS SIDE BY SIDE (CRITICAL FIX) */
  .pick-slots-container {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 8px !important;
    margin: 16px 0 !important;
  }

  .pick-target-slot {
    padding: 10px 4px !important;
    border-radius: 14px !important;
  }

  .slot-pos-badge {
    font-size: 11px !important;
    margin-bottom: 6px !important;
    gap: 4px !important;
    flex-direction: column !important;
    text-align: center !important;
  }

  .badge-num {
    width: 22px !important;
    height: 22px !important;
    font-size: 11px !important;
  }

  .slot-card-holder {
    width: 100% !important;
    height: 125px !important;
    border-radius: 10px !important;
    margin-bottom: 4px !important;
  }

  .slot-placeholder {
    gap: 6px !important;
    font-size: 10.5px !important;
    padding: 4px !important;
  }

  .slot-placeholder i {
    font-size: 22px !important;
  }

  .slot-desc-text {
    display: none !important; /* Hide long description on mobile to save vertical space */
  }

  /* Mobile Pick Controls */
  .pick-controls-bar {
    padding: 12px 14px !important;
    margin-bottom: 18px !important;
    flex-direction: column !important;
    gap: 10px !important;
    text-align: center !important;
  }

  .pick-current-instruction {
    font-size: 13px !important;
    justify-content: center !important;
  }

  .pick-quick-actions {
    width: 100% !important;
    display: flex !important;
    gap: 6px !important;
  }

  .pick-quick-actions .btn-secondary-sm {
    flex: 1 !important;
    padding: 8px 6px !important;
    font-size: 11px !important;
    text-align: center !important;
    justify-content: center !important;
  }

  /* Mobile Fan Deck Stage */
  .deck-fan-stage {
    height: 220px !important;
    padding-bottom: 12px !important;
    border-radius: 16px !important;
  }

  .fan-card-item {
    bottom: 8px !important;
    width: 68px !important;
    height: 108px !important;
    border-radius: 8px !important;
    transform-origin: 50% 140% !important;
  }

  .fan-card-item:hover {
    transform: translateX(var(--card-x, 0px)) translateY(calc(var(--card-y, 0px) - 24px)) rotate(var(--card-rot, 0deg)) scale(1.1) !important;
  }

  /* Reveal Trigger Banner on Mobile */
  .reveal-trigger-banner {
    padding: 18px 16px !important;
    border-radius: 18px !important;
    flex-direction: column !important;
    text-align: center !important;
    gap: 14px !important;
  }

  .banner-content {
    flex-direction: column !important;
    gap: 8px !important;
  }

  .banner-icon {
    font-size: 30px !important;
  }

  .banner-content h3 {
    font-size: 17px !important;
  }

  .banner-content p {
    font-size: 12.5px !important;
  }

  .reveal-trigger-banner .btn-xl {
    width: 100% !important;
    font-size: 15px !important;
    padding: 13px 20px !important;
  }

  /* STEP 4: MOBILE RESULTS & SYNTHESIS */
  .result-header-toolbar {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 10px !important;
    padding-bottom: 14px !important;
    margin-bottom: 20px !important;
  }

  .toolbar-left, .toolbar-right {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 6px !important;
    width: 100% !important;
  }

  .toolbar-left .btn, .toolbar-right .btn {
    flex: 1 1 45% !important;
    justify-content: center !important;
    padding: 9px 8px !important;
    font-size: 12px !important;
  }

  .result-question-banner {
    padding: 16px !important;
    border-radius: 16px !important;
    margin-bottom: 24px !important;
  }

  .result-question-title {
    font-size: 17px !important;
  }

  .result-cards-board {
    grid-template-columns: 1fr !important;
    gap: 20px !important;
    margin-bottom: 26px !important;
  }

  .result-card-item {
    padding: 18px 16px !important;
    border-radius: 20px !important;
  }

  .result-card-media {
    height: 240px !important;
    border-radius: 14px !important;
  }

  .result-card-name {
    font-size: 18px !important;
  }

  .result-pos-meaning {
    font-size: 13px !important;
    padding: 12px 14px !important;
    line-height: 1.65 !important;
  }

  .result-card-quote {
    font-size: 12.5px !important;
  }

  .result-synthesis-container {
    padding: 20px 16px !important;
    border-radius: 20px !important;
  }

  .synthesis-header-block {
    gap: 12px !important;
    margin-bottom: 18px !important;
    padding-bottom: 14px !important;
  }

  .synthesis-header-icon {
    width: 42px !important;
    height: 42px !important;
    font-size: 20px !important;
  }

  .synthesis-title {
    font-size: 19px !important;
  }

  .synthesis-cards-grid {
    grid-template-columns: 1fr !important;
    gap: 14px !important;
  }

  .synthesis-card-box {
    padding: 16px !important;
    border-radius: 16px !important;
  }

  .synthesis-box-title {
    font-size: 15px !important;
  }

  .synthesis-box-body {
    font-size: 13.5px !important;
    line-height: 1.65 !important;
  }
}

/* Extra small devices (iPhone SE / 360px) */
@media (max-width: 380px) {
  .chips-grid {
    grid-template-columns: 1fr !important;
  }

  .step-label {
    display: none !important; /* Hide labels, show only numbers to prevent text cut off */
  }

  .stepper-step {
    min-width: 40px !important;
  }
}
`;

// Append mobileCSS to styles.css
if (!css.includes('MOBILE & SMARTPHONE RESPONSIVE DESIGN SYSTEM')) {
  css += '\n' + mobileCSS;
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Appended mobile responsive styles to styles.css!');
} else {
  // Replace existing mobile block
  const marker = '/* ==========================================================================\n   MOBILE & SMARTPHONE RESPONSIVE DESIGN SYSTEM';
  const idx = css.indexOf(marker);
  if (idx !== -1) {
    css = css.substring(0, idx) + mobileCSS;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('Replaced mobile responsive styles in styles.css!');
  }
}
