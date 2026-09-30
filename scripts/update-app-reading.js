import fs from 'fs';
import path from 'path';

const appJsPath = path.resolve('app.js');
const content = fs.readFileSync(appJsPath, 'utf8');

// Split into lines preserving line endings
const lines = content.split(/\r?\n/);
console.log('Total original lines:', lines.length);

// Keep lines 0 to 856 (1 to 857 in 1-based indexing)
const studioPart = lines.slice(0, 857).join('\n');

const newReadingModule = `
  // ==========================================================================
  // 15. FORTUNE TELLING APP MODULE (4-STEP TAROT DIVINATION)
  // Collections: JiuTian Arcana (96 Chinese Deity Cards) & Bumji & The Gang (Cute Cat Cards)
  // ==========================================================================

  // Tab Switcher DOM
  const tabReadingBtn = document.getElementById('tabReadingBtn');
  const tabStudioBtn = document.getElementById('tabStudioBtn');
  const studioAppView = document.getElementById('studioAppView');
  const readingAppView = document.getElementById('readingAppView');

  if (tabReadingBtn && tabStudioBtn) {
    tabReadingBtn.addEventListener('click', () => {
      tabReadingBtn.classList.add('active');
      tabStudioBtn.classList.remove('active');
      readingAppView.classList.remove('hidden');
      studioAppView.classList.add('hidden');
    });

    tabStudioBtn.addEventListener('click', () => {
      tabStudioBtn.classList.add('active');
      tabReadingBtn.classList.remove('active');
      studioAppView.classList.remove('hidden');
      readingAppView.classList.add('hidden');
    });
  }

  // Stepper Elements
  const stepperFill = document.getElementById('stepperFill');
  const stepIndicators = [
    document.getElementById('stepIndicator1'),
    document.getElementById('stepIndicator2'),
    document.getElementById('stepIndicator3'),
    document.getElementById('stepIndicator4')
  ];

  // Pinned Context Bar
  const pinnedContextBar = document.getElementById('pinnedContextBar');
  const pinnedQuestionText = document.getElementById('pinnedQuestionText');
  const pinnedDeckItem = document.getElementById('pinnedDeckItem');
  const pinnedDeckText = document.getElementById('pinnedDeckText');
  const editQuestionQuickBtn = document.getElementById('editQuestionQuickBtn');

  // Step Sections
  const readingStep1 = document.getElementById('readingStep1');
  const readingStep2 = document.getElementById('readingStep2');
  const readingStep3 = document.getElementById('readingStep3');
  const readingStep4 = document.getElementById('readingStep4');

  // Step 1: Question Elements
  const userQuestionInput = document.getElementById('userQuestionInput');
  const clearQuestionBtn = document.getElementById('clearQuestionBtn');
  const proceedToStep2Btn = document.getElementById('proceedToStep2Btn');
  const chipButtons = document.querySelectorAll('.chip-btn');

  // Step 2: Collection Elements
  const backToStep1Btn = document.getElementById('backToStep1Btn');
  const selectDeckBtns = document.querySelectorAll('.select-deck-btn');
  const collectionCards = document.querySelectorAll('.collection-card');

  // Step 3: Pick 3 Cards Elements
  const backToStep2Btn = document.getElementById('backToStep2Btn');
  const pickStepDesc = document.getElementById('pickStepDesc');
  const pickCurrentInstruction = document.getElementById('pickCurrentInstruction');
  const autoDraw3CardsBtn = document.getElementById('autoDraw3CardsBtn');
  const shuffleDeckCardsBtn = document.getElementById('shuffleDeckCardsBtn');
  const openManualPickerBtn = document.getElementById('openManualPickerBtn');
  const deckFanWrapper = document.getElementById('deckFanWrapper');
  const revealTriggerBanner = document.getElementById('revealTriggerBanner');
  const revealDivinationBtn = document.getElementById('revealDivinationBtn');

  // Step 4: Results Elements
  const newReadingBtn = document.getElementById('newReadingBtn');
  const redrawCurrentCardsBtn = document.getElementById('redrawCurrentCardsBtn');
  const toggleFlipCardsBtn = document.getElementById('toggleFlipCardsBtn');
  const copyResultTextBtn = document.getElementById('copyResultTextBtn');
  const printResultReportBtn = document.getElementById('printResultReportBtn');
  const resultQuestionTitle = document.getElementById('resultQuestionTitle');
  const resultDeckBadge = document.getElementById('resultDeckBadge');
  const resultDateBadge = document.getElementById('resultDateBadge');
  const resultCardsBoard = document.getElementById('resultCardsBoard');
  const resultSynthesisContainer = document.getElementById('resultSynthesisContainer');

  // Modal Picker Elements
  const cardSelectModal = document.getElementById('cardSelectModal');
  const closeCardModalBtn = document.getElementById('closeCardModalBtn');
  const modalPositionName = document.getElementById('modalPositionName');
  const modalCardSearchInput = document.getElementById('modalCardSearchInput');
  const modalCardsGrid = document.getElementById('modalCardsGrid');

  // Spread Position Metadata (3-Card Trinity Spread)
  const POSITIONS = [
    {
      index: 0,
      title: 'ใบที่ 1: สถานการณ์ปัจจุบัน',
      shortName: 'ปัจจุบัน',
      desc: 'สะท้อนต้นเหตุ พลังงาน และสถานการณ์ที่กำลังเผชิญ ณ ขณะนี้'
    },
    {
      index: 1,
      title: 'ใบที่ 2: กลยุทธ์ / สิ่งที่ควรทำ',
      shortName: 'กลยุทธ์',
      desc: 'แนวทางปฏิบัติ มุมมองที่ควรปรับ หรือสิ่งที่ควรโฟกัสเพื่อรับมือ'
    },
    {
      index: 2,
      title: 'ใบที่ 3: ผลลัพธ์ / บทสรุปอนาคต',
      shortName: 'ผลลัพธ์',
      desc: 'แนวโน้มผลลัพธ์ที่จะเกิดขึ้น และบทเรียนล้ำค่าที่จะได้รับ'
    }
  ];

  // App State for Fortune Telling
  const fortuneState = {
    step: 1,
    question: '',
    deckId: 'jiutian', // 'jiutian' | 'bumji'
    activeCardsPool: [],
    drawnCards: [null, null, null],
    currentPickSlot: 0,
    modalTargetSlot: 0
  };

  // --------------------------------------------------------------------------
  // STEPPER & NAVIGATION CONTROLLER
  // --------------------------------------------------------------------------
  function setStep(targetStep) {
    fortuneState.step = targetStep;

    // Update Stepper Visuals
    const fillPercents = [15, 38, 68, 100];
    if (stepperFill) {
      stepperFill.style.width = \`\${fillPercents[targetStep - 1]}%\`;
    }

    stepIndicators.forEach((indicator, idx) => {
      if (!indicator) return;
      const stepNum = idx + 1;
      indicator.classList.remove('active', 'completed');
      if (stepNum === targetStep) {
        indicator.classList.add('active');
      } else if (stepNum < targetStep) {
        indicator.classList.add('completed');
      }
    });

    // Toggle Step Containers
    [readingStep1, readingStep2, readingStep3, readingStep4].forEach((el, idx) => {
      if (!el) return;
      if (idx + 1 === targetStep) {
        el.classList.remove('hidden');
        el.classList.add('animate-fade-in');
      } else {
        el.classList.add('hidden');
      }
    });

    // Pinned Context Bar visibility
    if (pinnedContextBar) {
      if (targetStep >= 2) {
        pinnedContextBar.classList.remove('hidden');
        if (pinnedQuestionText) {
          pinnedQuestionText.textContent = fortuneState.question || 'ภาพรวมดวงชะตาและพลังงานชีวิต';
        }
        if (targetStep >= 3 && pinnedDeckItem && pinnedDeckText) {
          pinnedDeckItem.classList.remove('hidden');
          pinnedDeckText.textContent = fortuneState.deckId === 'jiutian' 
            ? 'JiuTian Arcana (ไพ่เทพจีน 96 ใบ)' 
            : 'Bumji & The Gang (บุ๋มจิแอนด์เดอะแก๊งค์)';
        } else if (pinnedDeckItem) {
          pinnedDeckItem.classList.add('hidden');
        }
      } else {
        pinnedContextBar.classList.add('hidden');
      }
    }

    // Scroll to top of app view smoothly
    if (readingAppView) {
      readingAppView.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // --------------------------------------------------------------------------
  // STEP 1: QUESTION INPUT LOGIC
  // --------------------------------------------------------------------------
  if (clearQuestionBtn && userQuestionInput) {
    clearQuestionBtn.addEventListener('click', () => {
      userQuestionInput.value = '';
      userQuestionInput.focus();
    });
  }

  // Suggestion Chips Click
  chipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-question');
      if (userQuestionInput && q) {
        userQuestionInput.value = q;
        userQuestionInput.focus();
      }
    });
  });

  if (proceedToStep2Btn && userQuestionInput) {
    proceedToStep2Btn.addEventListener('click', () => {
      const q = userQuestionInput.value.trim();
      fortuneState.question = q || 'ภาพรวมดวงชะตา พลังงานชีวิต และคำแนะนำในปัจจุบัน';
      setStep(2);
    });
  }

  if (editQuestionQuickBtn) {
    editQuestionQuickBtn.addEventListener('click', () => {
      setStep(1);
      if (userQuestionInput) userQuestionInput.focus();
    });
  }

  // --------------------------------------------------------------------------
  // STEP 2: COLLECTION SELECTION LOGIC
  // --------------------------------------------------------------------------
  if (backToStep1Btn) {
    backToStep1Btn.addEventListener('click', () => {
      setStep(1);
    });
  }

  function selectCollection(deckId) {
    fortuneState.deckId = deckId;

    if (deckId === 'jiutian') {
      // Use cards from defaultCards / local storage (96 cards)
      fortuneState.activeCardsPool = (typeof cards !== 'undefined' && cards.length > 0) 
        ? cards 
        : (typeof defaultCards !== 'undefined' ? defaultCards : []);
    } else {
      // Use Bumji cards
      fortuneState.activeCardsPool = (typeof bumjiCards !== 'undefined' && bumjiCards.length > 0)
        ? bumjiCards
        : [];
    }

    // Reset drawn cards for new selection
    resetPicks();
    setStep(3);
    renderFanDeck();
    updateSlotVisuals();
  }

  selectDeckBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const deckId = btn.getAttribute('data-deck-id');
      selectCollection(deckId);
    });
  });

  collectionCards.forEach(cardEl => {
    cardEl.addEventListener('click', (e) => {
      if (e.target.closest('button')) return; // handled by button
      const deckId = cardEl.getAttribute('data-deck-id');
      selectCollection(deckId);
    });
  });

  // --------------------------------------------------------------------------
  // STEP 3: PICK 3 CARDS LOGIC
  // --------------------------------------------------------------------------
  if (backToStep2Btn) {
    backToStep2Btn.addEventListener('click', () => {
      setStep(2);
    });
  }

  function resetPicks() {
    fortuneState.drawnCards = [null, null, null];
    fortuneState.currentPickSlot = 0;
    if (revealTriggerBanner) revealTriggerBanner.classList.add('hidden');
  }

  function getDeckBackImage() {
    return fortuneState.deckId === 'jiutian' 
      ? 'assets/card_back_jiutian.jpg' 
      : 'assets/card_back_bumji.jpg';
  }

  function renderFanDeck() {
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
  }

  function assignCardToSlot(slotIndex, card) {
    fortuneState.drawnCards[slotIndex] = card;
    updateSlotVisuals();

    // Check if all 3 are filled
    const allFilled = fortuneState.drawnCards.every(c => c !== null);
    if (allFilled && revealTriggerBanner) {
      revealTriggerBanner.classList.remove('hidden');
      revealTriggerBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function updateSlotVisuals() {
    for (let i = 0; i < 3; i++) {
      const slotEl = document.getElementById(\`slotCard\${i}\`);
      const holderEl = document.getElementById(\`slotHolder\${i}\`);
      if (!slotEl || !holderEl) continue;

      const card = fortuneState.drawnCards[i];
      if (card) {
        slotEl.classList.add('slot-filled');
        slotEl.classList.remove('active-pick');
        holderEl.innerHTML = \`
          <img src="\${card.image || getDeckBackImage()}" class="slot-filled-card-img" alt="\${card.name}" onerror="this.src='\${getDeckBackImage()}'">
        \`;
      } else {
        slotEl.classList.remove('slot-filled');
        if (i === fortuneState.currentPickSlot) {
          slotEl.classList.add('active-pick');
        } else {
          slotEl.classList.remove('active-pick');
        }
        holderEl.innerHTML = \`
          <div class="slot-placeholder">
            <i class="fa-solid fa-circle-plus"></i>
            <span>คลิกเลือกไพ่ใบที่ \${i + 1}</span>
          </div>
        \`;
      }
    }

    // Update instruction text
    if (pickCurrentInstruction) {
      if (fortuneState.currentPickSlot < 3) {
        const pos = POSITIONS[fortuneState.currentPickSlot];
        pickCurrentInstruction.innerHTML = \`
          <i class="fa-solid fa-arrow-down-long text-gold animate-bounce"></i> 
          <span>คลิกเลือกไพ่จากสำรับด้านล่างสำหรับ <strong>\${pos.title}</strong></span>
        \`;
      } else {
        pickCurrentInstruction.innerHTML = \`
          <i class="fa-solid fa-circle-check text-gold"></i> 
          <span>เลือกไพ่ครบทั้ง 3 ใบเรียบร้อยแล้ว! กดปุ่มทำนายด้านล่างได้เลย</span>
        \`;
      }
    }
  }

  // Auto Draw 3 Cards (Instant)
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
  }

  // Shuffle Deck Button
  if (shuffleDeckCardsBtn) {
    shuffleDeckCardsBtn.addEventListener('click', () => {
      renderFanDeck();
    });
  }

  // Manual Search/Picker Modal
  if (openManualPickerBtn) {
    openManualPickerBtn.addEventListener('click', () => {
      openCardSelectModal(fortuneState.currentPickSlot < 3 ? fortuneState.currentPickSlot : 0);
    });
  }

  function openCardSelectModal(slotIndex) {
    fortuneState.modalTargetSlot = slotIndex;
    if (modalPositionName) {
      modalPositionName.textContent = POSITIONS[slotIndex].title;
    }
    if (modalCardSearchInput) modalCardSearchInput.value = '';
    renderModalCardGrid('');
    if (cardSelectModal) cardSelectModal.classList.remove('hidden');
  }

  if (closeCardModalBtn && cardSelectModal) {
    closeCardModalBtn.addEventListener('click', () => {
      cardSelectModal.classList.add('hidden');
    });
  }

  if (modalCardSearchInput) {
    modalCardSearchInput.addEventListener('input', (e) => {
      renderModalCardGrid(e.target.value.trim().toLowerCase());
    });
  }

  function renderModalCardGrid(query) {
    if (!modalCardsGrid) return;
    modalCardsGrid.innerHTML = '';

    const pool = fortuneState.activeCardsPool;
    const filtered = pool.filter(c => {
      if (!query) return true;
      const matchName = c.name && c.name.toLowerCase().includes(query);
      const matchId = String(c.id) === query;
      const matchElement = c.element && c.element.toLowerCase().includes(query);
      const matchChar = c.character && c.character.toLowerCase().includes(query);
      return matchName || matchId || matchElement || matchChar;
    });

    filtered.forEach(card => {
      const itemEl = document.createElement('div');
      itemEl.className = 'modal-card-item';
      itemEl.innerHTML = \`
        <div class="modal-card-thumb">
          <img src="\${card.image || getDeckBackImage()}" alt="\${card.name}" onerror="this.src='\${getDeckBackImage()}'">
        </div>
        <div class="modal-card-meta">
          <strong>#\${card.id} - \${card.name}</strong>
          <span>\${card.element || card.character || ''}</span>
        </div>
      \`;

      itemEl.addEventListener('click', () => {
        assignCardToSlot(fortuneState.modalTargetSlot, card);
        if (cardSelectModal) cardSelectModal.classList.add('hidden');
        const nextSlot = fortuneState.drawnCards.findIndex(c => c === null);
        fortuneState.currentPickSlot = nextSlot !== -1 ? nextSlot : 3;
        updateSlotVisuals();
      });

      modalCardsGrid.appendChild(itemEl);
    });
  }

  // Reveal Divination Button -> Go to Step 4
  if (revealDivinationBtn) {
    revealDivinationBtn.addEventListener('click', () => {
      const allFilled = fortuneState.drawnCards.every(c => c !== null);
      if (!allFilled) {
        alert('กรุณาเลือกไพ่ให้ครบทั้ง 3 ใบก่อนกดทำนายครับ');
        return;
      }
      renderDivinationResults();
      setStep(4);
    });
  }

  // --------------------------------------------------------------------------
  // STEP 4: DIVINATION RESULTS & SYNTHESIS LOGIC
  // --------------------------------------------------------------------------
  function renderDivinationResults() {
    const isJiuTian = fortuneState.deckId === 'jiutian';
    const drawn = fortuneState.drawnCards;

    // Header info
    if (resultQuestionTitle) {
      resultQuestionTitle.textContent = \`“\${fortuneState.question}”\`;
    }
    if (resultDeckBadge) {
      resultDeckBadge.textContent = isJiuTian ? 'JiuTian Arcana (ไพ่เทพจีน)' : 'Bumji & The Gang (แก๊งบุ๋มจิ)';
      resultDeckBadge.className = isJiuTian ? 'badge-deck' : 'badge-deck deck-cat';
    }
    if (resultDateBadge) {
      const now = new Date();
      resultDateBadge.textContent = now.toLocaleDateString('th-TH', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      });
    }

    // Render 3 Result Cards
    if (resultCardsBoard) {
      resultCardsBoard.innerHTML = '';

      drawn.forEach((card, idx) => {
        const pos = POSITIONS[idx];
        const cardEl = document.createElement('article');
        cardEl.className = 'result-card-item';

        // Position interpretation text tailored for this slot
        let positionMeaning = '';
        let quoteText = '';

        if (isJiuTian) {
          if (idx === 0) {
            positionMeaning = \`<strong>สภาวะปัจจุบัน:</strong> \${card.general_meaning || 'พลังงานเปิดกว้างสะท้อนถึงจุดเริ่มต้นและการตระหนักรู้ในตนเอง'} สื่อถึงสถานการณ์ที่กำลังก่อตัวขึ้นรอบตัวคุณ\`;
            quoteText = card.advice || 'ผู้ที่มีสติและรู้จักรอ ย่อมมองเห็นสัจธรรม';
          } else if (idx === 1) {
            positionMeaning = \`<strong>กลยุทธ์ & แนวทางปฏิบัติ:</strong> \${card.work_meaning || 'จงใช้ความสุขุม ความละเอียดรอบคอบ และจัดสรรกำลังให้สมดุล'} เป็นกุญแจสำคัญในการคลี่คลายอุปสรรค\`;
            quoteText = card.advice || 'ไม่ฝืนกระแสธรรมชาติ แต่รู้จักโอนอ่อนผ่อนตามอย่างมีปัญญา';
          } else {
            positionMeaning = \`<strong>บทสรุป & ผลลัพธ์:</strong> \${card.love_meaning || 'ชัยชนะและความสำเร็จจะเกิดขึ้นจากรากฐานที่มั่นคง'} พลังของเทพประจำไพ่ชี้ว่าผลลัพธ์จะนำมาซึ่งความเจริญก้าวหน้า\`;
            quoteText = card.advice || 'เมื่อปัญญาและวาสนามาบรรจบ ผลลัพธ์ย่อมงดงามเสมอ';
          }
        } else {
          // Bumji Deck
          if (idx === 0) {
            positionMeaning = \`<strong>พฤติกรรมสะท้อนปัจจุบัน:</strong> \${card.behavior || 'นอนนิ่งสังเกตการณ์'} — \${card.general_meaning || 'พักใจสบายๆ ไม่ต้องเร่งรีบ'}\`;
            quoteText = card.cat_wisdom || 'ความสุขไม่ต้องซับซ้อน ได้งีบสักตื่นโลกก็น่ารักขึ้นแล้ว!';
          } else if (idx === 1) {
            positionMeaning = \`<strong>คำแนะนำฉบับแมวๆ:</strong> \${card.work_meaning || 'โฟกัสสิ่งที่ถนัดและเซฟโซนของตัวเอง'} \${card.behavior ? \`(ทำตัวเหมือนตอน \${card.behavior})\` : ''}\`;
            quoteText = card.cat_wisdom || 'ถ้าโลกวุ่นวายนัก ก็นอนขดเป็นก้อนขนมปังแล้วรอจังหวะใหม่';
          } else {
            positionMeaning = \`<strong>บทสรุปนุ่มฟู:</strong> \${card.love_meaning || 'ความสัมพันธ์และเรื่องราวจะลงเอยอย่างอบอุ่นใจ'} คุณจะได้รับรอยยิ้มและความสบายใจกลับคืนมา\`;
            quoteText = card.cat_wisdom || 'ยิ้มเข้าไว้ มีขนมแมวเลีย มีคนที่รักเรา แค่นี้ก็ชนะแล้ว!';
          }
        }

        const tagText = isJiuTian 
          ? (card.element || 'พลังจักรวาล') 
          : (card.character || 'น้องแมวแก๊งบุ๋มจิ');

        cardEl.innerHTML = \`
          <div class="result-pos-header">
            <span class="badge-num">\${idx + 1}</span>
            <h3 class="result-pos-title">\${pos.title}</h3>
          </div>
          <div class="result-card-media">
            <img src="\${card.image || getDeckBackImage()}" alt="\${card.name}" onerror="this.src='\${getDeckBackImage()}'">
          </div>
          <div class="result-card-details">
            <h4 class="result-card-name">\${card.name}</h4>
            <div class="result-tag-row">
              <span class="result-tag"><i class="fa-solid fa-tag"></i> \${tagText}</span>
              \${card.keywords ? card.keywords.slice(0, 2).map(kw => \`<span class="result-tag">\${kw}</span>\`).join('') : ''}
            </div>
            <div class="result-pos-meaning">
              \${positionMeaning}
            </div>
            <div class="result-card-quote">
              <i class="fa-solid fa-quote-left"></i>
              <span>\${quoteText}</span>
            </div>
          </div>
        \`;

        resultCardsBoard.appendChild(cardEl);
      });
    }

    // Render Synthesis Section
    if (resultSynthesisContainer) {
      if (isJiuTian) {
        renderJiuTianSynthesis(drawn);
      } else {
        renderBumjiSynthesis(drawn);
      }
    }
  }

  function renderJiuTianSynthesis(drawn) {
    const card1 = drawn[0];
    const card2 = drawn[1];
    const card3 = drawn[2];

    const elementsList = drawn.map(c => c.element || 'พลังธรรมชาติ').join(' &rarr; ');

    resultSynthesisContainer.innerHTML = \`
      <div class="synthesis-header-block">
        <div class="synthesis-header-icon">
          <i class="fa-solid fa-dragon"></i>
        </div>
        <div>
          <h3 class="synthesis-title">บทสังเคราะห์คำทำนายและกลยุทธ์เต๋า (JiuTian Arcana Synthesis)</h3>
          <p class="synthesis-sub">ประมวลผลความสัมพันธ์ของไพ่เทพเจ้าจีนทั้ง 3 องค์ สู่ข้อคิดและยุทธศาสตร์รับมือคำถามของคุณ</p>
        </div>
      </div>

      <div class="synthesis-cards-grid">
        <!-- Box 1: Elements Equilibrium -->
        <div class="synthesis-card-box">
          <h4 class="synthesis-box-title"><i class="fa-solid fa-yin-yang"></i> การหมุนเวียนของพลังเบญจธาตุ</h4>
          <div class="synthesis-box-body">
            <p style="margin-bottom: 8px;"><strong>สายธารพลังงาน:</strong> \${elementsList}</p>
            <p>
              การผสานพลังของ <strong>\${card1.name}</strong> สู่ <strong>\${card2.name}</strong> และสิ้นสุดที่ <strong>\${card3.name}</strong> บ่งบอกถึงจังหวะชีวิตที่กำลังเปลี่ยนผ่านจากสภาวะแห่งการตื่นรู้ สู่การลงมือปฏิบัติด้วยปัญญาเต๋า ธาตุของไพ่ชุดนี้ส่งเสริมให้คุณใช้ความนิ่งสยบความเคลื่อนไหว และมองทะลุภาพลวงตาตรงหน้า
            </p>
          </div>
        </div>

        <!-- Box 2: Strategic Action -->
        <div class="synthesis-card-box">
          <h4 class="synthesis-box-title"><i class="fa-solid fa-chess-knight"></i> กลยุทธ์พิชัยยุทธ์เพื่อความสำเร็จ</h4>
          <div class="synthesis-box-body">
            <p>
              คำตอบสำหรับคำถามของคุณคือ <strong>“อย่าเร่งรัดผลลัพธ์ แต่จงวางโครงสร้างให้แข็งแกร่ง”</strong> ในจุดที่เป็นกลยุทธ์ (\${card2.name}) แนะนำให้คุณจัดลำดับความสำคัญ รักษาความสัมพันธ์ที่ดีกับคนรอบตัว และไม่ประมาทกับรายละเอียดเล็กๆ ชัยชนะที่ยั่งยืนเกิดจากคุณธรรมและความอดทน
            </p>
          </div>
        </div>

        <!-- Box 3: Divine Deities Blessings -->
        <div class="synthesis-card-box" style="grid-column: 1 / -1;">
          <h4 class="synthesis-box-title"><i class="fa-solid fa-scroll"></i> โอวาทและพรอันประเสริฐจากทวยเทพทั้งสามองค์</h4>
          <ul style="margin: 8px 0 0 18px; font-size: 13.5px; line-height: 1.8; color: var(--color-text);">
            <li><strong>\${card1.name}:</strong> “\${card1.advice || 'จงเริ่มต้นด้วยใจที่บริสุทธิ์และปราศจากอคติ'}\”</li>
            <li><strong>\${card2.name}:</strong> “\${card2.advice || 'ปัญญาที่แท้จริงคือการรู้ว่าเมื่อใดควรเดินหน้าและเมื่อใดควรหยุดยั้ง'}\”</li>
            <li><strong>\${card3.name}:</strong> “\${card3.advice || 'ความสำเร็จอันยิ่งใหญ่ย่อมเป็นของผู้อดทนและยึดมั่นในสัจจะ'}\”</li>
          </ul>
        </div>
      </div>
    \`;
  }

  function renderBumjiSynthesis(drawn) {
    const card1 = drawn[0];
    const card2 = drawn[1];
    const card3 = drawn[2];

    resultSynthesisContainer.innerHTML = \`
      <div class="synthesis-header-block">
        <div class="synthesis-header-icon cat-theme">
          <i class="fa-solid fa-paw"></i>
        </div>
        <div>
          <h3 class="synthesis-title">บทสังเคราะห์ความสุขฉบับแก๊งบุ๋มจิ (Bumji Feline Wisdom)</h3>
          <p class="synthesis-sub">ถอดรหัสพฤติกรรมเจ้าเหมียวทั้ง 3 ท่า สู่ความสบายใจ ผ่อนคลาย และรอยยิ้มประจำวัน</p>
        </div>
      </div>

      <div class="synthesis-cards-grid">
        <!-- Box 1: Cat Behavior Insight -->
        <div class="synthesis-card-box theme-cat">
          <h4 class="synthesis-box-title text-cat"><i class="fa-solid fa-cat"></i> พฤติกรรมแมวสะท้อนเรื่องราวของคุณ</h4>
          <div class="synthesis-box-body">
            <p>
              แก๊งแมวบุ๋มจิบอกว่า สถานการณ์ที่คุณกำลังเจอนั้นเหมือนแมวที่กำลัง <em>\${card1.behavior || 'นอนสังเกตการณ์'}</em> แล้วค่อยๆ ขยับตัวไป <em>\${card2.behavior || 'หามุมสบายใจ'}</em> จนสุดท้ายได้ <em>\${card3.behavior || 'กินขนมอย่างมีความสุข'}</em> 
            </p>
            <p style="margin-top: 6px;">
              เรื่องราวไม่ได้ยากเกินไปเลย แค่ปล่อยใจให้เบาเหมือนปุยขนแมว ทำทีละอย่าง เดี๋ยวทางออกก็จะโผล่มาเอง!
            </p>
          </div>
        </div>

        <!-- Box 2: Cat Wisdom -->
        <div class="synthesis-card-box theme-cat">
          <h4 class="synthesis-box-title text-cat"><i class="fa-solid fa-heart"></i> ปรัชญาเหมียวสะกิดใจ (Cat Wisdom)</h4>
          <div class="synthesis-box-body">
            <p style="font-style: italic; color: #e11d48; margin-bottom: 8px;">
              “แมวไม่เคยกังวลถึงเรื่องเมื่อวาน และไม่เคยเครียดกับชามข้าวของวันพรุ่งนี้... สุขกับกล่องตรงหน้า และขนมในมื้อนี้เถอะนะ!”
            </p>
            <p>
              คำแนะนำจาก <strong>\${card2.name}</strong> คือให้คุณรักตัวเอง ดูแลความรู้สึกตัวเองเป็นที่ตั้ง อย่ายอมให้ใครมาแย่งความสุขสงบในใจไปได้
            </p>
          </div>
        </div>

        <!-- Box 3: Daily Healing Quest -->
        <div class="synthesis-card-box theme-cat" style="grid-column: 1 / -1;">
          <h4 class="synthesis-box-title text-cat"><i class="fa-solid fa-wand-sparkles"></i> ภารกิจฮีลใจประจำวันจากแก๊งบุ๋มจิ (Daily Comfort Quest)</h4>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 10px;">
            <div style="background: #ffffff; padding: 12px; border-radius: 10px; border: 1px dashed #f472b6;">
              <strong style="color: #e11d48;"><i class="fa-solid fa-cookie-bite"></i> 1. ให้รางวัลตัวเอง</strong>
              <p style="font-size: 12px; color: #475569; margin-top: 4px;">กินของอร่อยหรือชานมแก้วโปรด เหมือนน้องแมวได้เลียซอง Churu</p>
            </div>
            <div style="background: #ffffff; padding: 12px; border-radius: 10px; border: 1px dashed #f472b6;">
              <strong style="color: #e11d48;"><i class="fa-solid fa-bed"></i> 2. งีบพักชาร์จแบต</strong>
              <p style="font-size: 12px; color: #475569; margin-top: 4px;">พักสายตา 15 นาที ทำตัวเป็นก้อนขนมปังนิ่งๆ วางมือถือลงสักครู่</p>
            </div>
            <div style="background: #ffffff; padding: 12px; border-radius: 10px; border: 1px dashed #f472b6;">
              <strong style="color: #e11d48;"><i class="fa-solid fa-face-smile"></i> 3. กอดตัวเองแล้วยิ้ม</strong>
              <p style="font-size: 12px; color: #475569; margin-top: 4px;">บอกตัวเองหน้ากระจกว่า 'วันนี้เก่งมากแล้ว พรุ่งนี้ค่อยลุยใหม่นะ'</p>
            </div>
          </div>
        </div>
      </div>
    \`;
  }

  // Toolbar Actions in Step 4
  if (newReadingBtn) {
    newReadingBtn.addEventListener('click', () => {
      resetPicks();
      if (userQuestionInput) userQuestionInput.value = '';
      setStep(1);
    });
  }

  if (redrawCurrentCardsBtn) {
    redrawCurrentCardsBtn.addEventListener('click', () => {
      resetPicks();
      setStep(3);
      renderFanDeck();
      updateSlotVisuals();
    });
  }

  if (toggleFlipCardsBtn) {
    toggleFlipCardsBtn.addEventListener('click', () => {
      const cards = document.querySelectorAll('.result-card-item');
      cards.forEach(card => {
        card.classList.toggle('flipped');
      });
    });
  }

  if (copyResultTextBtn) {
    copyResultTextBtn.addEventListener('click', () => {
      const isJiuTian = fortuneState.deckId === 'jiutian';
      const deckName = isJiuTian ? 'JiuTian Arcana (ไพ่เทพจีน)' : 'Bumji & The Gang (บุ๋มจิแอนด์เดอะแก๊งค์)';
      const drawn = fortuneState.drawnCards;

      let text = \`🔮 === คำทำนายไพ่ศักดิ์สิทธิ์: \${deckName} ===\\n\`;
      text += \`❓ คำถาม: \${fortuneState.question}\\n\`;
      text += \`📅 วันที่ทำนาย: \${new Date().toLocaleDateString('th-TH')}\\n\\n\`;

      drawn.forEach((c, idx) => {
        const pos = POSITIONS[idx];
        text += \`[\${pos.title}]\\n\`;
        text += \`ไพ่: \${c.name} (\${c.element || c.character || ''})\\n\`;
        text += \`ความหมาย: \${c.general_meaning || ''}\\n\`;
        if (c.advice) text += \`คำสอน/คำแนะนำ: \${c.advice}\\n\`;
        if (c.cat_wisdom) text += \`ข้อคิดแมวๆ: \${c.cat_wisdom}\\n\`;
        text += \`\\n\`;
      });

      text += \`✨ ขอให้ดวงชะตาและพลังงานแห่งความสุขโอบกอดคุณเสมอ! ✨\\n\`;

      navigator.clipboard.writeText(text).then(() => {
        alert('คัดลอกข้อความคำทำนายลง Clipboard เรียบร้อยแล้ว!');
      }).catch(err => {
        alert('ไม่สามารถคัดลอกได้: ' + err.message);
      });
    });
  }

  if (printResultReportBtn) {
    printResultReportBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Initialize App
  initApp();
  // Set default view to Tarot Reading App
  setStep(1);
});
`;

fs.writeFileSync(appJsPath, studioPart + newReadingModule, 'utf8');
console.log('Successfully updated app.js with new 4-step Fortune Telling App module!');
