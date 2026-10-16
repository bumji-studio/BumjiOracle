// Jiu Tian Arcana - App Logic

document.addEventListener('DOMContentLoaded', () => {
  // 1. Core State
  let cards = [];
  let activeCardId = 1;
  const borderStyleKey = 'jiutian_border_style';

  function initLegacyStudio() {
    // DOM Elements
    const cardList = document.getElementById('cardList');
    if (!cardList) return;
  const searchCards = document.getElementById('searchCards');
  const filterElement = document.getElementById('filterElement');
  const borderStyleSelect = document.getElementById('borderStyleSelect');
  const resetDataBtn = document.getElementById('resetDataBtn');
  const exportPdfBtn = document.getElementById('exportPdfBtn');
  const importPdfBtn = document.getElementById('importPdfBtn');
  const pdfFileInput = document.getElementById('pdfFileInput');
  const backupJsonBtn = document.getElementById('backupJsonBtn');
  const restoreJsonBtn = document.getElementById('restoreJsonBtn');
  const jsonFileInput = document.getElementById('jsonFileInput');
  
  // Form Fields
  const editCardId = document.getElementById('editCardId');
  const editCardName = document.getElementById('editCardName');
  const editCardElement = document.getElementById('editCardElement');
  const editCardKeywords = document.getElementById('editCardKeywords');
  const editCardImage = document.getElementById('editCardImage');
  const localImageFile = document.getElementById('localImageFile');
  const editGeneralMeaning = document.getElementById('editGeneralMeaning');
  const editLoveMeaning = document.getElementById('editLoveMeaning');
  const editWorkMeaning = document.getElementById('editWorkMeaning');
  const editAdvice = document.getElementById('editAdvice');
  const activeCardIndicator = document.getElementById('activeCardIndicator');
  
  // A4 Preview Fields
  const a4PreviewPage = document.getElementById('a4PreviewPage');
  const previewCardName = document.getElementById('previewCardName');
  const previewPageElement = document.getElementById('previewPageElement');
  const previewKeywords = document.getElementById('previewKeywords');
  const previewCardArt = document.getElementById('previewCardArt');
  const previewCardArtText = document.getElementById('previewCardArtText');
  const previewCardIdBadge = document.getElementById('previewCardIdBadge');
  const previewGeneralMeaning = document.getElementById('previewGeneralMeaning');
  const previewLoveMeaning = document.getElementById('previewLoveMeaning');
  const previewWorkMeaning = document.getElementById('previewWorkMeaning');
  const previewAdvice = document.getElementById('previewAdvice');
  const previewPageNum = document.getElementById('previewPageNum');
  const saveStatus = document.getElementById('saveStatus');

  // Progress Overlay
  const progressOverlay = document.getElementById('progressOverlay');
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.getElementById('progressPercent');
  const progressPageCount = document.getElementById('progressPageCount');
  const progressTitle = document.getElementById('progressTitle');
  const pdfPrintBuffer = document.getElementById('pdfPrintBuffer');

  // 2. Data Initialization
  function initApp() {
    // Load from local storage or defaults
    const savedData = localStorage.getItem('jiutian_cards_data');
    if (savedData) {
      try {
        cards = JSON.parse(savedData);
      } catch (e) {
        console.error('Error parsing saved cards, loading defaults', e);
        cards = [...window.DEFAULT_CARDS];
      }
    } else {
      cards = [...window.DEFAULT_CARDS];
      saveToLocalStorage();
    }

    // Sync card images and authentic PDF meanings with window.DEFAULT_CARDS mapping
    if (window.DEFAULT_CARDS && window.DEFAULT_CARDS.length > 0) {
      cards = window.DEFAULT_CARDS.map(def => {
        const existing = cards.find(c => c.id === def.id);
        let cardImg = def.image;
        if (existing && existing.image && existing.image.startsWith('data:image/')) {
          cardImg = existing.image;
        }
        return {
          ...existing,
          ...def, // Authentic PDF meanings, elements, keywords, and deity titles take precedence
          image: cardImg
        };
      });
      saveToLocalStorage();
    }

    // Load border style
    const savedBorder = localStorage.getItem(borderStyleKey) || 'border-gold-ornate';
    borderStyleSelect.value = savedBorder;
    updatePageBorder(savedBorder);

    // Render list & select first card
    renderCardList();
    selectCard(1);
  }

  function saveToLocalStorage() {
    localStorage.setItem('jiutian_cards_data', JSON.stringify(cards));
    showSavedIndicator();
  }

  function showSavedIndicator() {
    saveStatus.style.opacity = '1';
    saveStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> บันทึกข้อมูลแล้ว (Local)';
    saveStatus.style.color = '#10b981';
    saveStatus.style.background = 'rgba(16, 185, 129, 0.1)';
  }

  function showEditingIndicator() {
    saveStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังอัปเดต...';
    saveStatus.style.color = '#f59e0b';
    saveStatus.style.background = 'rgba(245, 158, 11, 0.1)';
  }

  // 3. Render Card List in Sidebar
  function renderCardList() {
    const query = searchCards.value.trim().toLowerCase();
    const elementFilter = filterElement.value;
    
    cardList.innerHTML = '';

    const filteredCards = cards.filter(card => {
      const matchQuery = card.name.toLowerCase().includes(query) || 
                         card.id.toString() === query ||
                         (card.keywords && card.keywords.some(k => k.toLowerCase().includes(query)));
      
      const matchElement = elementFilter === 'all' || card.element.includes(elementFilter);
      
      return matchQuery && matchElement;
    });

    filteredCards.forEach(card => {
      const cardItem = document.createElement('div');
      cardItem.className = `card-item ${card.id === activeCardId ? 'active' : ''}`;
      cardItem.dataset.id = card.id;
      
      const isCustomized = localStorage.getItem(`jiutian_card_customized_${card.id}`) === 'true';

      // We can display the card preview image in list item if available
      let imgTag = `<div class="card-item-num">${String(card.id).padStart(2, '0')}</div>`;
      if (card.image) {
        imgTag = `<div class="card-item-num" style="background-image: url('${card.image}'); background-size: cover; background-position: center; border-radius: 4px; color: transparent; border: 1px solid var(--color-gold);">.</div>`;
      }

      cardItem.innerHTML = `
        ${imgTag}
        <div class="card-item-info">
          <div class="card-item-name">${card.name}</div>
          <div class="card-item-tag">${card.element}</div>
        </div>
        ${isCustomized ? '<div class="card-item-status"><i class="fa-solid fa-pen-nib"></i></div>' : ''}
      `;

      cardItem.addEventListener('click', () => {
        selectCard(card.id);
      });

      cardList.appendChild(cardItem);
    });
  }

  // 4. Select Card for Editing and Previewing
  function selectCard(id) {
    activeCardId = id;
    const card = cards.find(c => c.id === id);
    if (!card) return;

    // Highlight active list item
    document.querySelectorAll('.card-item').forEach(item => {
      item.classList.toggle('active', parseInt(item.dataset.id) === id);
    });

    // Populate Editor Fields
    if (editCardId) editCardId.value = card.id;
    if (editCardName) editCardName.value = card.name;
    if (editCardElement) editCardElement.value = card.element;
    if (editCardKeywords) editCardKeywords.value = card.keywords ? card.keywords.join(', ') : '';
    if (editCardImage) editCardImage.value = card.image || '';
    if (editGeneralMeaning) editGeneralMeaning.value = card.general_meaning || '';
    if (editLoveMeaning) editLoveMeaning.value = card.love_meaning || '';
    if (editWorkMeaning) editWorkMeaning.value = card.work_meaning || '';
    if (editAdvice) editAdvice.value = card.advice || '';
    
    if (activeCardIndicator) activeCardIndicator.textContent = `ไพ่ใบที่ ${card.id}`;

    // Update A4 Live Preview
    updateLivePreview(card);
  }

  // 5. Update Live Preview from Data
  function updateLivePreview(card) {
    if (previewCardName) previewCardName.textContent = card.name || `ไพ่ใบที่ ${card.id}`;
    if (previewPageElement) previewPageElement.textContent = card.element || '-';
    if (previewCardIdBadge) previewCardIdBadge.textContent = String(card.id).padStart(2, '0');
    
    // Keywords formatting
    if (previewKeywords) {
      previewKeywords.innerHTML = '';
      const kStr = (editCardKeywords && editCardKeywords.value) || '';
      const keywords = kStr.split(',').map(k => k.trim()).filter(k => k !== '');
      keywords.forEach(keyword => {
        const span = document.createElement('span');
        span.textContent = keyword;
        previewKeywords.appendChild(span);
      });
    }

    // Text content
    if (previewGeneralMeaning) previewGeneralMeaning.textContent = card.general_meaning || 'ไม่มีรายละเอียดความหมายทั่วไป...';
    if (previewLoveMeaning) previewLoveMeaning.textContent = card.love_meaning || 'ไม่มีรายละเอียดความรัก...';
    if (previewWorkMeaning) previewWorkMeaning.textContent = card.work_meaning || 'ไม่มีรายละเอียดการงานและการเงิน...';
    if (previewAdvice) previewAdvice.textContent = card.advice || 'ไม่มีรายละเอียดคำแนะนำ...';
    if (previewPageNum) previewPageNum.textContent = `หน้า ${card.id + 1}`; // Page 1 is cover, cards start at Page 2

    // Image preview
    if (previewCardArt) {
      if (card.image) {
        previewCardArt.innerHTML = `<img src="${card.image}" alt="${card.name}">`;
      } else {
        // Show default placeholder with icons
        previewCardArt.innerHTML = `
          <i class="fa-solid fa-bahai art-icon"></i>
          <span>${card.name}</span>
        `;
      }
    }
  }

  // 6. Handle Form Inputs (Live binding)
  function handleFormInput() {
    showEditingIndicator();
    
    const id = parseInt(editCardId.value);
    const cardIndex = cards.findIndex(c => c.id === id);
    if (cardIndex === -1) return;

    // Update state
    cards[cardIndex].name = editCardName.value;
    cards[cardIndex].element = editCardElement.value;
    cards[cardIndex].keywords = editCardKeywords.value.split(',').map(k => k.trim()).filter(k => k !== '');
    cards[cardIndex].image = editCardImage.value;
    cards[cardIndex].general_meaning = editGeneralMeaning.value;
    cards[cardIndex].love_meaning = editLoveMeaning.value;
    cards[cardIndex].work_meaning = editWorkMeaning.value;
    cards[cardIndex].advice = editAdvice.value;

    // Mark as customized
    localStorage.setItem(`jiutian_card_customized_${id}`, 'true');

    // Debounce save to localStorage to avoid performance hits
    clearTimeout(window.saveTimeout);
    window.saveTimeout = setTimeout(() => {
      saveToLocalStorage();
      renderCardList();
    }, 500);

    // Update live preview directly
    updateLivePreview(cards[cardIndex]);
  }

  // Bind inputs to handleFormInput
  [editCardName, editCardElement, editCardKeywords, editCardImage, 
   editGeneralMeaning, editLoveMeaning, editWorkMeaning, editAdvice,
   document.getElementById('editCardNameEn'),
   document.getElementById('editCardNameTh'),
   document.getElementById('editCardNameZh'),
   document.getElementById('editCardMainQuote'),
   document.getElementById('editCardCoreEnergy'),
   document.getElementById('editCardDeity'),
   document.getElementById('editCardCategory'),
   document.getElementById('editCardMythology'),
   document.getElementById('editCardPersonality'),
   document.getElementById('editCardCareers'),
   document.getElementById('editCardIfDrawn'),
   document.getElementById('editCardDeityMessage'),
   document.getElementById('editCardStrategyKeywords')].filter(Boolean).forEach(input => {
    input.addEventListener('input', handleFormInput);
  });

  // 7. Local File Upload Helper (Convert to Base64)
  localImageFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
      editCardImage.value = event.target.result;
      handleFormInput();
    };
    reader.readAsDataURL(file);
  });

  // 8. Search & Filters
  searchCards.addEventListener('input', renderCardList);
  filterElement.addEventListener('change', renderCardList);

  // 9. Border Style customizer
  borderStyleSelect.addEventListener('change', (e) => {
    const style = e.target.value;
    localStorage.setItem(borderStyleKey, style);
    updatePageBorder(style);
  });

  function updatePageBorder(styleClass) {
    a4PreviewPage.className = `a4-page ${styleClass}`;
  }

  // 10. Reset Data to defaults
  resetDataBtn.addEventListener('click', () => {
    if (confirm('คุณต้องการรีเซ็ตข้อมูลไพ่ทั้งหมดกลับไปเป็นค่าเริ่มต้นใช่หรือไม่? (การแก้ไขของคุณจะหายไปทั้งหมด)')) {
      localStorage.clear();
      // Remove customized statuses
      for (let i = 1; i <= 94; i++) {
        localStorage.removeItem(`jiutian_card_customized_${i}`);
      }
      initApp();
      alert('รีเซ็ตข้อมูลไพ่ทั้ง 94 ใบเรียบร้อยแล้ว!');
    }
  });

  // 11. PDF Import (Import from existing guidebook file)
  if (importPdfBtn && pdfFileInput) {
    importPdfBtn.addEventListener('click', () => {
      pdfFileInput.click();
    });

    pdfFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Check if pdf.js library is loaded
      if (typeof pdfjsLib === 'undefined') {
        alert('ตรวจพบปัญหา: ไลบรารี pdf.js ยังไม่ถูกโหลดในหน้านี้ กรุณาเชื่อมต่ออินเทอร์เน็ตเพื่อโหลดเครื่องมือวิเคราะห์ PDF');
        return;
      }
      
      // Set worker source URL
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

      progressOverlay.classList.add('show');
      updateProgress(5, 'กำลังเปิดไฟล์ PDF...', 'อ่านไฟล์...');

      const reader = new FileReader();
      reader.onload = async function() {
        try {
          const typedarray = new Uint8Array(this.result);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          
          const totalPdfPages = pdf.numPages;
          updateProgress(10, `วิเคราะห์สำเร็จ! ตรวจพบจำนวนหน้าทั้งหมด: ${totalPdfPages} หน้า`, 'คำนวณสัดส่วนหน้าการ์ด...');
          await delay(800);

          // Heuristic page mapping:
          // Cards guidebook is 94 cards.
          // If totalPages is 94: map pages 1-94 to cards 1-94
          // If totalPages is >= 95: assume page 1 is cover, pages 2 to 95 are cards 1-94
          let startPage = 1;
          if (totalPdfPages >= 95) {
            startPage = 2; // page 1 is cover/introduction
          }
          
          const importedCards = [];
          // Limit to max 94 cards
          const maxCards = Math.min(94, totalPdfPages - startPage + 1);

          for (let i = 0; i < maxCards; i++) {
            const pageNum = startPage + i;
            const cardId = i + 1;
            
            updateProgress(
              10 + Math.round((i / maxCards) * 75), 
              `กำลังสแกนหน้า ${pageNum} เพื่อสกัดเนื้อหาของไพ่ใบที่ ${cardId}...`, 
              `กำลังดำเนินการ ${cardId} / ${maxCards} ใบ`
            );

            const page = await pdf.getPage(pageNum);
            
            // Extract text items
            const textContent = await page.getTextContent();
            const textItems = textContent.items.map(item => item.str);
            const fullPageText = textItems.join('\n');
            const lines = textItems.map(t => t.trim()).filter(t => t !== '');

            // Parse fields
            let cardName = `ไพ่ใบที่ ${cardId}`;
            let element = 'ธาตุทั่วไป';
            let keywords = [];
            let general_meaning = '';
            let love_meaning = '';
            let work_meaning = '';
            let advice = '';

            if (lines.length > 0) {
              // Heuristic 1: Find Card Name
              // Usually the first non-empty line with text
              cardName = lines[0];
              
              // Heuristic 2: Find Element
              const elementLine = lines.find(l => l.includes('ธาตุ') || l.includes('Metal') || l.includes('Wood') || l.includes('Water') || l.includes('Fire') || l.includes('Earth'));
              if (elementLine) {
                element = elementLine;
              }

              // Heuristic 3: Segment Sections
              const sections = parseThaiGuidebookText(fullPageText, cardId);
              general_meaning = sections.general;
              love_meaning = sections.love;
              work_meaning = sections.work;
              advice = sections.advice;
              keywords = sections.keywords;
            }

            // Generate low-res thumbnail image from PDF page representation
            let thumbnailBase64 = '';
            try {
              // Scale down to a small resolution (width ~ 120px) to stay within localStorage limits
              const viewport = page.getViewport({ scale: 0.15 });
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              
              await page.render({
                canvasContext: context,
                viewport: viewport
              }).promise;

              // Save as low-quality compressed jpeg
              thumbnailBase64 = canvas.toDataURL('image/jpeg', 0.5);
            } catch (canvasErr) {
              console.warn(`Could not render thumbnail for page ${pageNum}`, canvasErr);
            }

            importedCards.push({
              id: cardId,
              name: cardName,
              image: thumbnailBase64 || `card_${String(cardId).padStart(2, '0')}.png`,
              element: element,
              keywords: keywords,
              general_meaning: general_meaning,
              love_meaning: love_meaning,
              work_meaning: work_meaning,
              advice: advice
            });

            await delay(10); // Yield main thread
          }

          // If we imported some cards, update our state
          if (importedCards.length > 0) {
            // Fill up remaining slots to make exactly 94 cards if needed
            for (let i = importedCards.length; i < 94; i++) {
              importedCards.push({
                ...window.DEFAULT_CARDS[i],
                id: i + 1
              });
            }

            cards = importedCards;
            saveToLocalStorage();
            
            // Mark all imported cards as customized in local state
            for (let i = 1; i <= 94; i++) {
              localStorage.setItem(`jiutian_card_customized_${i}`, 'true');
            }

            initApp();
            updateProgress(100, 'สกัดข้อมูลและนำเข้าคู่มือสำเร็จ!', 'บันทึกข้อมูลแล้ว!');
            await delay(1200);
            alert(`[สำเร็จ] นำเข้าข้อมูลไพ่ทั้ง ${maxCards} หน้าเรียบร้อยแล้ว!\n\nระบบได้สกัดเอาเนื้อหา ความหมาย และสร้างรูปย่อจาก PDF แต่ละหน้าเข้ามาให้คุณเรียบร้อย คุณสามารถตรวจทาน ปรับแต่งข้อความ หรือใส่กรอบภาพหน้าจอ A4 ก่อนส่งออกเป็น PDF ทับไปใหม่ได้เลยครับ`);
          }

        } catch (err) {
          console.error('Import PDF Error:', err);
          alert('ขออภัย! ระบบไม่สามารถอ่านและแปลงข้อมูล PDF นี้ได้: ' + err.message);
        } finally {
          progressOverlay.classList.remove('show');
          pdfFileInput.value = '';
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  // Helper parser for Thai esoteric guidebook text
  function parseThaiGuidebookText(text, cardId) {
    const result = {
      general: '',
      love: '',
      work: '',
      advice: '',
      keywords: []
    };

    // Replace linebreaks and standard cleanups
    const cleanText = text.replace(/\r\n/g, '\n').replace(/\n+/g, '\n');

    // Extract keywords (matching "คำสำคัญ", "คีย์เวิร์ด", "Keywords")
    const keywordMatches = cleanText.match(/(?:คำสำคัญ|คีย์เวิร์ด|Keywords)[:\s]+([^\n]+)/i);
    if (keywordMatches && keywordMatches[1]) {
      result.keywords = keywordMatches[1].split(/[,|•\/\\-]/).map(k => k.trim()).filter(k => k !== '');
    }
    
    // Fallback if keywords are empty
    if (result.keywords.length === 0) {
      result.keywords = [`ธาตุประจำตัว`, `พลังดวงชะตา`, `วิถีอาร์คานา`];
    }

    // Identify indices of headers
    const sectionHeaders = [
      { key: 'love', regex: /(?:ความหมายด้านความรัก|ความรัก|Love|Relationship)/i },
      { key: 'work', regex: /(?:การงานและการเงิน|การงาน|การเงิน|Career|Finance|Work)/i },
      { key: 'advice', regex: /(?:คำแนะนำ|ข้อควรระวัง|ข้อพึงระวัง|Advice|Warning)/i },
      { key: 'general', regex: /(?:ความหมายทั่วไป|ความหมายของไพ่|General)/i }
    ];

    const matches = [];
    sectionHeaders.forEach(sh => {
      const match = sh.regex.exec(cleanText);
      if (match) {
        matches.push({
          key: sh.key,
          index: match.index,
          length: match[0].length,
          header: match[0]
        });
      }
    });

    // Sort by appearance index
    matches.sort((a, b) => a.index - b.index);

    if (matches.length === 0) {
      // Split raw lines to distribute into columns
      const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l !== '');
      if (lines.length >= 6) {
        result.general = lines.slice(1, Math.floor(lines.length * 0.4)).join('\n');
        result.love = lines.slice(Math.floor(lines.length * 0.4), Math.floor(lines.length * 0.6)).join('\n');
        result.work = lines.slice(Math.floor(lines.length * 0.6), Math.floor(lines.length * 0.8)).join('\n');
        result.advice = lines.slice(Math.floor(lines.length * 0.8)).join('\n');
      } else {
        result.general = cleanText;
      }
    } else {
      // Extract texts between header offsets
      for (let i = 0; i < matches.length; i++) {
        const current = matches[i];
        const next = matches[i + 1];
        const start = current.index + current.length;
        const end = next ? next.index : cleanText.length;
        
        let content = cleanText.substring(start, end).trim();
        // Remove leading symbols
        content = content.replace(/^[:\-=\s\.]*/, '');
        
        result[current.key] = content;
      }

      // Pre-header text goes to general meaning
      if (matches[0].index > 0 && !result.general) {
        const preHeaderContent = cleanText.substring(0, matches[0].index).trim();
        // Remove card name and element lines if duplicated
        const lines = preHeaderContent.split('\n');
        if (lines.length > 2) {
          result.general = lines.slice(2).join('\n').trim();
        } else {
          result.general = preHeaderContent;
        }
      }
    }

    // Double check to make sure sections are populated
    if (!result.general) result.general = `คำวิเคราะห์ภาพรวมความหมายของไพ่ใบที่ ${cardId}`;
    if (!result.love) result.love = `การวิเคราะห์เรื่องความรักความสัมพันธ์ของไพ่ใบนี้`;
    if (!result.work) result.work = `การวิเคราะห์ด้านการงาน การทำธุรกิจ และกระแสทรัพย์ทางการเงิน`;
    if (!result.advice) result.advice = `คำชี้แนะพิเศษและข้อพึงระวังตามหลักโหราศาสตร์`;

    return result;
  }

  // 12. PDF Compilation & Copy-Protection Generator (html2pdf)
  exportPdfBtn.addEventListener('click', async () => {
    if (!confirm('ยืนยันสร้างเอกสารคู่มือ A4 จำนวน 94 หน้า?\n\nกระบวนการนี้จะทำการสแกนหน้ากระดาษ A4 ทั้งหมดแล้วเซฟเป็นภาพความละเอียดสูงรวมเป็น PDF ป้องกันไม่ให้บุคคลภายนอกกดคัดลอกข้อความ (Copy Text) ได้ง่าย')) {
      return;
    }

    // Show Progress Screen
    progressOverlay.classList.add('show');
    progressBar.style.width = '0%';
    progressPercent.textContent = '0%';
    progressPageCount.textContent = '0 / 94 หน้า';

    // Clear Buffer
    pdfPrintBuffer.innerHTML = '';
    
    // Generate Cover Page (Page 1)
    const coverPageHtml = createCoverPageHtml();
    pdfPrintBuffer.appendChild(coverPageHtml);
    
    // Generate Card pages (Page 2 to 95)
    const totalPages = cards.length;
    const borderStyle = borderStyleSelect.value;

    for (let i = 0; i < totalPages; i++) {
      const card = cards[i];
      const pageEl = document.createElement('div');
      pageEl.className = `a4-page ${borderStyle}`;
      pageEl.style.transform = 'none'; // No scaled shrinkage in buffer
      pageEl.style.margin = '0';
      
      const keywordsHtml = card.keywords.map(k => `<span>${k}</span>`).join('');
      
      let imgHtml = `
        <div class="card-art-placeholder">
          <i class="fa-solid fa-bahai art-icon"></i>
          <span>${card.name}</span>
        </div>
      `;
      if (card.image && (card.image.startsWith('data:image/') || card.image.startsWith('http://') || card.image.startsWith('https://'))) {
        imgHtml = `<div class="card-art-placeholder"><img src="${card.image}" alt="${card.name}"></div>`;
      }

      pageEl.innerHTML = `
        <!-- Decorative Corners -->
        <div class="corner corner-tl"></div>
        <div class="corner corner-tr"></div>
        <div class="corner corner-bl"></div>
        <div class="corner corner-br"></div>
        
        <!-- Running Header -->
        <header class="page-header-print">
          <span class="header-left">JIU TIAN ARCANA GUIDEBOOK</span>
          <span class="header-right">${card.element}</span>
        </header>

        <!-- Main Layout -->
        <div class="page-content-print">
          
          <!-- Left Side: Card Image Section -->
          <div class="print-card-art-col">
            <div class="card-frame">
              <div class="card-frame-inner">
                ${imgHtml}
              </div>
            </div>
            <div class="card-id-badge">${String(card.id).padStart(2, '0')}</div>
          </div>

          <!-- Right Side: Content Details -->
          <div class="print-card-details-col">
            <h2 class="card-title-thai">${card.name}</h2>
            
            <div class="keywords-row">
              ${keywordsHtml}
            </div>

            <div class="meaning-section">
              <h3><i class="fa-solid fa-dharmachakra icon-gold"></i> ความหมายทั่วไป (General Interpretation)</h3>
              <p>${card.general_meaning || 'ไม่มีรายละเอียด...'}</p>
            </div>

            <div class="meaning-section">
              <h3><i class="fa-solid fa-heart icon-gold"></i> ความหมายด้านความรัก (Love & Relationship)</h3>
              <p>${card.love_meaning || 'ไม่มีรายละเอียด...'}</p>
            </div>

            <div class="meaning-section">
              <h3><i class="fa-solid fa-coins icon-gold"></i> การงานและการเงิน (Career & Finance)</h3>
              <p>${card.work_meaning || 'ไม่มีรายละเอียด...'}</p>
            </div>

            <div class="meaning-section">
              <h3><i class="fa-solid fa-bell icon-gold"></i> คำแนะนำ (Advice & Warnings)</h3>
              <p class="advice-text">${card.advice || 'ไม่มีรายละเอียด...'}</p>
            </div>
          </div>

        </div>

        <!-- Running Footer -->
        <footer class="page-footer-print">
          <span class="footer-left">ลิขสิทธิ์เฉพาะและสงวนสิทธิ์คำทำนายตามกฎหมาย</span>
          <span class="footer-page-num">หน้า ${card.id + 1}</span>
        </footer>
      `;

      pdfPrintBuffer.appendChild(pageEl);
      
      // Update UI thread on buffer assembly
      if (i % 5 === 0 || i === totalPages - 1) {
        const percent = Math.round(((i + 1) / totalPages) * 25);
        updateProgress(percent, `กำลังรวบรวมข้อมูล A4...`, `${i + 1} / ${totalPages} หน้า`);
        await delay(30);
      }
    }

    // 13. Run html2pdf to render image-based PDF page sheets
    updateProgress(35, "กำลังเริ่มต้นการเรนเดอร์รูปภาพ...", "กำลังจัดเตรียมเอนจินประมวลผล...");
    await delay(200);

    const filename = `Jiu_Tian_Arcana_Guidebook_${new Date().toISOString().slice(0,10)}.pdf`;
    
    const opt = {
      margin:       0,
      filename:     filename,
      image:        { type: 'jpeg', quality: 0.95 },
      html2canvas:  { 
        scale: 2, // Scale 2 ensures crisp printing details
        useCORS: true, 
        letterRendering: true,
        logging: false
      },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      const worker = html2pdf().set(opt).from(pdfPrintBuffer);
      
      updateProgress(50, "กำลังเซฟรูปหน้ากระดาษเพื่อบล็อกการก๊อปปี้...", "สแกนหน้าเพจ 50%...");
      await delay(500);

      updateProgress(75, "กำลังเย็บหน้าหนังสือและสร้างเลย์เอาต์ไฟล์ PDF...", "สแกนหน้าเพจ 75%...");
      await delay(500);

      await worker.save();
      
      updateProgress(100, "สร้างไฟล์คู่มือ A4 ป้องกันการก๊อปปี้เรียบร้อย!", "ดาวน์โหลดสมบูรณ์!");
      await delay(1200);
    } catch (error) {
      console.error('PDF Generation failed:', error);
      alert('ขออภัย! การสร้าง PDF ไม่สำเร็จ โปรดตรวจสอบหน่วยความจำเครื่อง หรือลองเปิดใช้งานผ่านเซิร์ฟเวอร์แบบ HTTP');
    } finally {
      progressOverlay.classList.remove('show');
      pdfPrintBuffer.innerHTML = '';
    }
  });

  // Helper to create a beautiful cover page
  function createCoverPageHtml() {
    const cover = document.createElement('div');
    cover.className = `a4-page ${borderStyleSelect.value}`;
    cover.style.transform = 'none';
    cover.style.margin = '0';
    
    cover.innerHTML = `
      <div class="corner corner-tl"></div>
      <div class="corner corner-tr"></div>
      <div class="corner corner-bl"></div>
      <div class="corner corner-br"></div>
      
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; font-family: var(--font-thai-header); padding: 20px;">
        <div style="font-size: 70px; color: #c5a059; margin-bottom: 20px; text-shadow: 0 0 10px rgba(197, 160, 89, 0.2);">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
        </div>
        <h1 style="font-family: var(--font-en); font-size: 42px; color: #1e293b; letter-spacing: 4px; margin-bottom: 10px; font-weight: 700;">JIU TIAN ARCANA</h1>
        <h2 style="font-size: 26px; color: #854d0e; letter-spacing: 2px; margin-bottom: 40px; font-weight: 500;">คู่มือความหมายไพ่โบราณจิ่วเทียน</h2>
        
        <div style="width: 80mm; height: 80mm; border: 2px double #c5a059; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 40px; background-color: #fcfbf7;">
          <div style="width: 74mm; height: 74mm; border: 1px dashed rgba(197, 160, 89, 0.5); border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #c5a059;">
            <i class="fa-solid fa-dharmachakra" style="font-size: 80px; margin-bottom: 10px;"></i>
            <span style="font-family: var(--font-en); font-size: 14px; letter-spacing: 3px; font-weight: bold;">94 SACRED CARDS</span>
          </div>
        </div>

        <p style="font-family: var(--font-thai-body); font-size: 14px; max-width: 130mm; line-height: 1.6; color: #475569; margin-bottom: 60px;">
          ตำราสรุปขอบเขตเนื้อหา คำพยากรณ์ และสมดุลแห่งธาตุเจ้าชะตา ทั้งการงาน การเงิน ความรัก และคำเตือนทางจิตวิญญาณ สำหรับไพ่อาร์คานาจิ่วเทียนฉบับพิมพ์สมบูรณ์
        </p>

        <div style="border-top: 1px solid rgba(197, 160, 89, 0.4); width: 60mm; padding-top: 15px;">
          <span style="display: block; font-size: 12px; color: #64748b; margin-bottom: 5px;">เรียบเรียงและลิขสิทธิ์โดย</span>
          <strong style="font-size: 16px; color: #1e293b; font-weight: 600;">Jiu Tian Arcana Studio</strong>
        </div>
      </div>
      
      <footer class="page-footer-print">
        <span class="footer-left">ฉบับลิขสิทธิ์จำหน่ายอย่างเป็นทางการ</span>
        <span class="footer-page-num">หน้า 1</span>
      </footer>
    `;
    return cover;
  }

  // Utilities
  function updateProgress(percent, title, subtitle) {
    progressBar.style.width = `${percent}%`;
    progressPercent.textContent = `${percent}%`;
    progressTitle.textContent = title;
    if (subtitle) progressPageCount.textContent = subtitle;
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 14. Backup & Restore JSON Data
  if (backupJsonBtn) {
    backupJsonBtn.addEventListener('click', () => {
      try {
        const jsonStr = JSON.stringify(cards, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jiutian_cards_backup_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการสำรองข้อมูล: ' + err.message);
      }
    });
  }

  if (restoreJsonBtn && jsonFileInput) {
    restoreJsonBtn.addEventListener('click', () => {
      jsonFileInput.click();
    });

    jsonFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(event) {
        try {
          const importedData = JSON.parse(event.target.result);
          if (!Array.isArray(importedData)) {
            throw new Error('โครงสร้างข้อมูลในไฟล์ไม่ใช่ Array (ไม่ถูกต้อง)');
          }
          
          if (confirm(`คุณต้องการโหลดข้อมูลสำรองนี้ใช่หรือไม่? ข้อมูลการ์ดปัจจุบันทั้งหมดจะถูกเขียนทับด้วยข้อมูลจากไฟล์นี้`)) {
            cards = importedData;
            saveToLocalStorage();
            
            // Mark customized status based on loaded items
            for (let i = 1; i <= 94; i++) {
              localStorage.setItem(`jiutian_card_customized_${i}`, 'true');
            }
            
            initApp();
            alert('โหลดข้อมูลสำรองไฟล์ JSON สำเร็จ!');
          }
        } catch (err) {
          alert('ไม่สามารถอ่านไฟล์สำรองได้: ' + err.message);
        } finally {
          jsonFileInput.value = '';
        }
      };
      reader.readAsText(file);
    });
  }
  } // end initLegacyStudio
  initLegacyStudio();

  // ==========================================================================
  // 15. FORTUNE TELLING APP MODULE (4-STEP TAROT DIVINATION)
  // Collections: JiuTian Arcana (96 Chinese Deity Cards) & Bumji & The Gang (Cute Cat Cards)
  // ==========================================================================

  // Tab Switcher DOM (Tarot Reading, TongShu Auspicious Timing, Qi Men Dun Jia, BaZi Destiny)
  const tabReadingBtn = document.getElementById('tabReadingBtn');
  const tabTongShuBtn = document.getElementById('tabTongShuBtn');
  const tabQiMenBtn = document.getElementById('tabQiMenBtn');
  const tabBaziBtn = document.getElementById('tabBaziBtn');
  const tabPersonalityBtn = document.getElementById('tabPersonalityBtn');
  const readingAppView = document.getElementById('readingAppView');
  const tongShuAppView = document.getElementById('tongShuAppView');
  const qiMenAppView = document.getElementById('qiMenAppView');
  const baziAppView = document.getElementById('baziAppView');
  const personalityAppView = document.getElementById('personalityAppView');

  // Mobile Hamburger Menu Navigation Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const headerNavTabs = document.getElementById('headerNavTabs') || document.querySelector('.header-nav-tabs');
  const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');

  // Responsive Viewport & Device Detector (Strict Mobile < 768px, Tablet/Desktop >= 768px)
  function updateResponsiveViewMode() {
    const isMobile = window.innerWidth < 768 || 
      /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches && window.innerWidth < 768);
    
    document.documentElement.classList.toggle('is-mobile', isMobile);
    document.documentElement.classList.toggle('is-desktop', !isMobile);
    document.body.classList.toggle('is-mobile', isMobile);
    document.body.classList.toggle('is-desktop', !isMobile);
  }
  updateResponsiveViewMode();

  let resizeDebounceTimer = null;
  window.addEventListener('resize', () => {
    updateResponsiveViewMode();
    clearTimeout(resizeDebounceTimer);
    resizeDebounceTimer = setTimeout(() => {
      if (readingStep3 && !readingStep3.classList.contains('hidden')) {
        renderFanDeck();
      }
    }, 120);
  });
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      updateResponsiveViewMode();
      if (readingStep3 && !readingStep3.classList.contains('hidden')) {
        renderFanDeck();
      }
    }, 150);
  });

  function toggleMobileMenu(forceClose = false) {
    if (!headerNavTabs) return;
    const isCurrentlyOpen = headerNavTabs.classList.contains('open');
    const shouldOpen = forceClose ? false : !isCurrentlyOpen;

    headerNavTabs.classList.toggle('open', shouldOpen);
    if (mobileMenuBackdrop) {
      mobileMenuBackdrop.classList.toggle('open', shouldOpen);
    }
    if (mobileMenuBtn) {
      mobileMenuBtn.classList.toggle('active', shouldOpen);
      mobileMenuBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.className = shouldOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  if (mobileMenuBackdrop) {
    mobileMenuBackdrop.addEventListener('click', () => {
      toggleMobileMenu(true);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMobileMenu(true);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      toggleMobileMenu(true);
    }
  });

  function setActiveAppMode(mode, updateHash = true) {
    // Check gatekeeper if tab is locked for members
    if (window.AuthManager && window.AuthManager.isTabLocked(mode)) {
      window.AuthManager.openModal('login', mode);
      return;
    }

    // Close mobile menu if open
    toggleMobileMenu(true);

    // Nav tab active state
    if (tabReadingBtn) tabReadingBtn.classList.toggle('active', mode === 'reading');
    if (tabTongShuBtn) tabTongShuBtn.classList.toggle('active', mode === 'tongshu');
    if (tabQiMenBtn) tabQiMenBtn.classList.toggle('active', mode === 'qimen');
    if (tabBaziBtn) tabBaziBtn.classList.toggle('active', mode === 'bazi');
    if (tabPersonalityBtn) tabPersonalityBtn.classList.toggle('active', mode === 'personality');

    // View containers visibility - strictly enforce 1 active view
    const views = [
      { el: readingAppView, modeKey: 'reading' },
      { el: tongShuAppView, modeKey: 'tongshu' },
      { el: qiMenAppView, modeKey: 'qimen' },
      { el: baziAppView, modeKey: 'bazi' },
      { el: personalityAppView, modeKey: 'personality' }
    ];

    views.forEach(v => {
      if (!v.el) return;
      const isShow = mode === v.modeKey;
      v.el.classList.toggle('hidden', !isShow);
      v.el.style.setProperty('display', isShow ? 'block' : 'none', 'important');
    });

    // Sync URL hash seamlessly without page jumping
    if (updateHash) {
      try {
        if (window.location.hash.replace('#', '').toLowerCase() !== mode) {
          history.replaceState(null, '', '#' + mode);
        }
      } catch (e) {}
    }

    // Trigger TongShu live update when activated
    if (mode === 'tongshu' && window.TongShuApp) {
      window.TongShuApp.onTabShow();
    }
    // Trigger Qi Men Dun Jia live update when activated
    if (mode === 'qimen' && window.QiMenApp) {
      window.QiMenApp.onTabShow();
    }
    // Trigger BaZi live update when activated
    if (mode === 'bazi' && window.BaziApp) {
      window.BaziApp.onTabShow();
    }
    // Trigger Personality live update when activated
    if (mode === 'personality' && window.PersonalityApp) {
      window.PersonalityApp.onTabShow();
    }
  }

  // Expose setActiveAppMode globally for cross-tab navigation
  window.setActiveAppMode = setActiveAppMode;

  if (tabReadingBtn) {
    tabReadingBtn.addEventListener('click', () => setActiveAppMode('reading'));
  }
  if (tabTongShuBtn) {
    tabTongShuBtn.addEventListener('click', () => setActiveAppMode('tongshu'));
  }
  if (tabQiMenBtn) {
    tabQiMenBtn.addEventListener('click', () => setActiveAppMode('qimen'));
  }
  if (tabBaziBtn) {
    tabBaziBtn.addEventListener('click', () => setActiveAppMode('bazi'));
  }
  if (tabPersonalityBtn) {
    tabPersonalityBtn.addEventListener('click', () => setActiveAppMode('personality'));
  }

  // Aliases mapping for external direct links (e.g. ?tab=bazi or #bazi)
  const TAB_ALIASES = {
    'reading': 'reading',
    'tarot': 'reading',
    'card': 'reading',
    'cards': 'reading',
    'cat': 'reading',
    'mycat': 'reading',
    'tongshu': 'tongshu',
    'calendar': 'tongshu',
    'almanac': 'tongshu',
    'qimen': 'qimen',
    'qimendunjia': 'qimen',
    'dunjia': 'qimen',
    'bazi': 'bazi',
    'fourpillars': 'bazi',
    'destiny': 'bazi',
    'personality': 'personality',
    'mbti': 'personality',
    'disc': 'personality',
    'jiazi': 'personality',
    'archetype': 'personality'
  };

  function parseTargetTabFromUrl() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const rawParam = (urlParams.get('tab') || '').toLowerCase().trim();
      const rawHash = (window.location.hash.replace('#', '') || '').toLowerCase().trim();
      return TAB_ALIASES[rawParam] || TAB_ALIASES[rawHash] || null;
    } catch (e) {
      return null;
    }
  }

  // Parse initial tab on page load (defaults to reading)
  const initialTab = parseTargetTabFromUrl() || 'reading';
  setActiveAppMode(initialTab, false);

  // Listen for dynamic hash changes (external links or browser back/forward)
  window.addEventListener('hashchange', () => {
    const targetTab = parseTargetTabFromUrl() || 'reading';
    setActiveAppMode(targetTab, false);
  });

  // ==========================================================================
  // MY CAT & I ORACLE DIVINATION APP MODULE (3-STEP INTUITIVE FLOW)
  // Single Deck: "My Cat & I" (61 Cards from คู่มือไพ่CAT61.xlsx)
  // ==========================================================================

  // Stepper Elements (2 Steps)
  const stepperFill = document.getElementById('stepperFill');
  const stepIndicators = [
    document.getElementById('stepIndicator1'),
    document.getElementById('stepIndicator2')
  ];

  // Pinned Context Bar
  const pinnedContextBar = document.getElementById('pinnedContextBar');
  const pinnedQuestionText = document.getElementById('pinnedQuestionText');
  const pinnedDeckItem = document.getElementById('pinnedDeckItem');
  const pinnedDeckText = document.getElementById('pinnedDeckText');
  const editQuestionQuickBtn = document.getElementById('editQuestionQuickBtn');

  // Step Sections
  const readingStep1 = document.getElementById('readingStep1');
  const readingStep2 = document.getElementById('readingStep2'); // Legacy 2-deck screen (hidden)
  const readingStep3 = document.getElementById('readingStep3'); // Step 2: Pick 3 Cards
  const readingStep4 = document.getElementById('readingStep4'); // Step 3: Divination Results

  // Step 1: Question Elements
  const userQuestionInput = document.getElementById('userQuestionInput');
  const clearQuestionBtn = document.getElementById('clearQuestionBtn');
  const proceedToStep2Btn = document.getElementById('proceedToStep2Btn');
  const chipButtons = document.querySelectorAll('.chip-btn');

  // Step 2: Pick 3 Cards Elements
  const backToStep2Btn = document.getElementById('backToStep2Btn');
  const pickStepDesc = document.getElementById('pickStepDesc');
  const pickCurrentInstruction = document.getElementById('pickCurrentInstruction');
  const autoDraw3CardsBtn = document.getElementById('autoDraw3CardsBtn');
  const shuffleDeckCardsBtn = document.getElementById('shuffleDeckCardsBtn');
  const openManualPickerBtn = document.getElementById('openManualPickerBtn');
  const deckFanWrapper = document.getElementById('deckFanWrapper');
  const revealTriggerBanner = document.getElementById('revealTriggerBanner');
  const revealDivinationBtn = document.getElementById('revealDivinationBtn');

  // Step 3: Results Elements
  const newReadingBtn = document.getElementById('newReadingBtn');
  const redrawCurrentCardsBtn = document.getElementById('redrawCurrentCardsBtn');
  const toggleFlipCardsBtn = document.getElementById('toggleFlipCardsBtn');
  const copyResultTextBtn = document.getElementById('copyResultTextBtn');
  const printResultReportBtn = document.getElementById('printResultReportBtn');
  const resultQuestionTitle = document.getElementById('resultQuestionTitle');
  const resultDeckBadge = document.getElementById('resultDeckBadge');
  const resultSpreadBadge = document.getElementById('resultSpreadBadge');
  const resultDateBadge = document.getElementById('resultDateBadge');
  const resultCardsBoard = document.getElementById('resultCardsBoard');
  const resultSynthesisContainer = document.getElementById('resultSynthesisContainer');

  // Spread Selection DOM Elements
  const spreadTab3Cards = document.getElementById('spreadTab3Cards');
  const spreadTab5Cards = document.getElementById('spreadTab5Cards');
  const patterns3CardsWrap = document.getElementById('patterns3CardsWrap');
  const spread5CardsWrap = document.getElementById('spread5CardsWrap');
  const patternChipsGroup = document.getElementById('patternChipsGroup');
  const patternInfoBanner = document.getElementById('patternInfoBanner');
  const step2IndicatorLabel = document.getElementById('step2IndicatorLabel');
  const step2HeaderTitle = document.getElementById('step2HeaderTitle');
  const pickSlotsContainer = document.getElementById('pickSlotsContainer');
  const autoDrawCardsBtnText = document.getElementById('autoDrawCardsBtnText');
  const revealBannerTitle = document.getElementById('revealBannerTitle');
  const smartPatternBox = document.getElementById('smartPatternBox');
  const smartPatternTitle = document.getElementById('smartPatternTitle');
  const smartPatternDesc = document.getElementById('smartPatternDesc');

  // Modal Picker Elements
  const cardSelectModal = document.getElementById('cardSelectModal');
  const closeCardModalBtn = document.getElementById('closeCardModalBtn');
  const modalPositionName = document.getElementById('modalPositionName');
  const modalCardSearchInput = document.getElementById('modalCardSearchInput');
  const modalCardsGrid = document.getElementById('modalCardsGrid');
  const modalFilterTabs = document.getElementById('modalFilterTabs');
  let currentModalFilter = 'all';

  // --------------------------------------------------------------------------
  // SPREAD CONFIGURATIONS (3-CARD 5 PATTERNS + 5-CARD STRATEGIC SPREAD)
  // --------------------------------------------------------------------------
  const SPREAD_CONFIGS = {
    '3cards': {
      id: '3cards',
      name: 'ไพ่ 3 ใบ (Trinity Spread)',
      cardCount: 3,
      patterns: {
        'pattern1': {
          id: 'pattern1',
          patternNum: 1,
          title: 'แบบที่ 1: อดีต - ปัจจุบัน - อนาคต',
          shortTitle: 'อดีต - ปัจจุบัน - อนาคต',
          desc: 'ใช้ดูพัฒนาการของเรื่อง ตั้งแต่สิ่งที่นำมาสู่สถานการณ์ปัจจุบัน ไปจนถึงแนวโน้มข้างหน้า',
          positions: [
            { index: 0, title: 'ใบที่ 1: อดีต / สิ่งที่นำมา', shortName: 'อดีต', desc: 'สิ่งที่นำพามาสู่สถานการณ์ปัจจุบัน ต้นเหตุหรือรากฐานเดิม' },
            { index: 1, title: 'ใบที่ 2: ปัจจุบัน / สภาวะจริง', shortName: 'ปัจจุบัน', desc: 'สถานการณ์และพลังงานที่เป็นอยู่ ณ ขณะนี้' },
            { index: 2, title: 'ใบที่ 3: อนาคต / แนวโน้ม', shortName: 'อนาคต', desc: 'แนวโน้มพัฒนาการข้างหน้าที่จะเกิดขึ้น' }
          ]
        },
        'pattern2': {
          id: 'pattern2',
          patternNum: 2,
          title: 'แบบที่ 2: สถานการณ์ - อุปสรรค - ทางออก',
          shortTitle: 'สถานการณ์ - อุปสรรค - ทางออก',
          desc: 'ใช้เมื่อผู้ถามต้องการเข้าใจปัญหาและหาทางจัดการ เหมาะกับเรื่องงาน ความสัมพันธ์ และการตัดสินใจ',
          positions: [
            { index: 0, title: 'ใบที่ 1: สถานการณ์', shortName: 'สถานการณ์', desc: 'ภาพรวมของเรื่องที่กำลังเผชิญ สภาวะความเป็นจริง' },
            { index: 1, title: 'ใบที่ 2: อุปสรรค / สิ่งกีดขวาง', shortName: 'อุปสรรค', desc: 'จุดติดขัด แรงต้าน หรือความท้าทายที่ต้องก้าวข้าม' },
            { index: 2, title: 'ใบที่ 3: ทางออก / กลยุทธ์แก้ไข', shortName: 'ทางออก', desc: 'กลยุทธ์ วิธีปฏิบัติ และทางสว่างในการคลี่คลายปัญหา' }
          ]
        },
        'pattern3': {
          id: 'pattern3',
          patternNum: 3,
          title: 'แบบที่ 3: สิ่งที่เกิดขึ้น - สิ่งที่ซ่อนอยู่ - แนวโน้มผลลัพธ์',
          shortTitle: 'สิ่งที่เกิด - สิ่งที่ซ่อน - แนวโน้มผล',
          desc: 'ใช้เจาะสถานการณ์ที่ยังไม่เข้าใจ เช่น อีกฝ่ายคิดอย่างไร หรือองค์กรกำลังดำเนินเรื่องไปในทิศทางใด (พึงตระหนักว่าเป็นการอ่านสัญลักษณ์สะท้อนใจ ไม่ใช่การตัดสินแทนผู้อื่น)',
          positions: [
            { index: 0, title: 'ใบที่ 1: สิ่งที่เกิดขึ้น', shortName: 'สิ่งที่เกิดขึ้น', desc: 'ภาพเบื้องหน้า ข้อเท็จจริงที่มองเห็นได้ชัดเจน' },
            { index: 1, title: 'ใบที่ 2: สิ่งที่ซ่อนอยู่', shortName: 'สิ่งที่ซ่อนอยู่', desc: 'เบื้องลึก จิตใต้สำนึก หรือปัจจัยที่ยังไม่เปิดเผย' },
            { index: 2, title: 'ใบที่ 3: แนวโน้มผลลัพธ์', shortName: 'แนวโน้มผลลัพธ์', desc: 'ทิศทางที่สถานการณ์กำลังดำเนินไปสู่' }
          ]
        },
        'pattern4': {
          id: 'pattern4',
          patternNum: 4,
          title: 'แบบที่ 4: ตัวเลือก A - ตัวเลือก B - คำแนะนำ',
          shortTitle: 'ตัวเลือก A - ตัวเลือก B - คำแนะนำ',
          desc: 'ใช้เมื่อผู้ถามต้องเลือกระหว่างสองแนวทาง โดยเปรียบเทียบข้อดี ข้อเสีย และความเสี่ยงร่วมกับคำแนะนำ',
          positions: [
            { index: 0, title: 'ใบที่ 1: ตัวเลือก A', shortName: 'ตัวเลือก A', desc: 'สภาวะ ผลลัพธ์ และบรรยากาศหากเลือกเส้นทาง A' },
            { index: 1, title: 'ใบที่ 2: ตัวเลือก B', shortName: 'ตัวเลือก B', desc: 'สภาวะ ผลลัพธ์ และบรรยากาศหากเลือกเส้นทาง B' },
            { index: 2, title: 'ใบที่ 3: คำแนะนำ / ทางสายกลาง', shortName: 'คำแนะนำ', desc: 'คำชี้แนะจากปัญญาญาณเพื่อประกอบการตัดสินใจอย่างมีสติ' }
          ]
        },
        'pattern5': {
          id: 'pattern5',
          patternNum: 5,
          title: 'แบบที่ 5: เงื่อนไข - กระบวนการ - ผลลัพธ์',
          shortTitle: 'เงื่อนไข - กระบวนการ - ผลลัพธ์',
          desc: 'ใช้ดูว่าเรื่องหนึ่งจะดำเนินไปอย่างไร โดยเฉพาะคำถามเกี่ยวกับการสมัครงาน การเจรจา การอนุมัติ และการเปลี่ยนแปลงในองค์กร',
          positions: [
            { index: 0, title: 'ใบที่ 1: เงื่อนไข / ปัจจัยตั้งต้น', shortName: 'เงื่อนไข', desc: 'ข้อกำหนด ปัจจัยตั้งต้น หรือเงื่อนไขสำคัญ' },
            { index: 1, title: 'ใบที่ 2: กระบวนการ / การดำเนินการ', shortName: 'กระบวนการ', desc: 'ขั้นตอนการดำเนินงาน สิ่งที่จะเกิดขึ้นระหว่างทาง และการปฏิบัติ' },
            { index: 2, title: 'ใบที่ 3: ผลลัพธ์ / ปลายทาง', shortName: 'ผลลัพธ์', desc: 'ผลลัพธ์สุดท้ายของการดำเนินกระบวนการนั้น' }
          ]
        }
      }
    },
    '5cards': {
      id: '5cards',
      name: 'ไพ่ 5 ใบ (ทางเลือกและผลลัพธ์เชิงกลยุทธ์)',
      cardCount: 5,
      title: 'ไพ่ 5 ใบ: ทางเลือกและผลลัพธ์เชิงกลยุทธ์',
      desc: 'วิเคราะห์ทางออก เปรียบเทียบผลลัพธ์ของการลงมือทำ vs ไม่ทำ และสำรวจแนวโน้มการตัดสินใจในใจ',
      positions: [
        { index: 0, title: 'ใบที่ 1: สถานการณ์ปัจจุบัน (Current)', shortName: 'ปัจจุบัน (Current)', desc: 'สภาพการณ์ปัจจุบัน ปัจจัยที่เผชิญ แรงส่ง แรงต้าน หรือสภาวะคงตัว' },
        { index: 1, title: 'ใบที่ 2: ทางออก / วิธีการ (How to)', shortName: 'ทางออก (How to)', desc: 'แนวทาง การกระทำ หรือวิธีรับมือกับสถานการณ์' },
        { index: 2, title: 'ใบที่ 3: ผลถ้าลงมือทำ (Do)', shortName: 'ผลถ้าทำ (Do)', desc: 'ผลลัพธ์ที่จะเกิดขึ้นเมื่อเลือกลงมือปฏิบัติตามแนวทาง' },
        { index: 3, title: 'ใบที่ 4: ผลถ้าไม่ทำ (Don\'t)', shortName: 'ผลถ้าไม่ทำ', desc: 'ผลลัพธ์ที่จะเกิดขึ้นหากปล่อยไว้ หรือเลือกไม่ลงมือทำ' },
        { index: 4, title: 'ใบที่ 5: สิ่งที่อยู่ในใจที่ไพ่มองเห็น', shortName: 'สิ่งที่อยู่ในใจ', desc: 'สิ่งที่ซ่อนอยู่ในใจลึกๆ จิตใต้สำนึกที่ไพ่ช่วยสะท้อนให้มองเห็นชัดเจน' }
      ]
    }
  };

  // --------------------------------------------------------------------------
  // FIVE ELEMENTS ENGINE (เบญจธาตุ: ไม้ ไฟ ดิน ทอง น้ำ)
  // --------------------------------------------------------------------------
  const ELEMENT_INFO = {
    'ไม้': { name: 'ไม้', cn: '木 (Mù)', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: '🌱' },
    'ไฟ': { name: 'ไฟ', cn: '火 (Huǒ)', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: '🔥' },
    'ดิน': { name: 'ดิน', cn: '土 (Tǔ)', color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: '⛰️' },
    'ทอง': { name: 'ทอง', cn: '金 (Jīn)', color: '#ca8a04', bg: '#fefce8', border: '#fef08a', icon: '⚔️' },
    'น้ำ': { name: 'น้ำ', cn: '水 (Shuǐ)', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', icon: '💧' }
  };

  const GENERATING_MAP = {
    'ไม้': { target: 'ไฟ', reason: 'ไม้เป็นเชื้อให้ไฟลุก โหมพลังสร้างความสว่างไสว' },
    'ไฟ': { target: 'ดิน', reason: 'ไฟก่อให้เกิดเถ้าถ่านกลับสู่ดิน ก่อกำเนิดความอุดมสมบูรณ์' },
    'ดิน': { target: 'ทอง', reason: 'แร่ธาตุและโลหะมีค่าสะสมตัวอยู่ใต้ผืนดิน' },
    'ทอง': { target: 'น้ำ', reason: 'โลหะหลอมเหลวหรือควบแน่นก่อเกิดละอองน้ำ คล่องตัวและลื่นไหล' },
    'น้ำ': { target: 'ไม้', reason: 'น้ำหล่อเลี้ยงรากและต้นไม้ให้เติบโตผลิดอกออกผล' }
  };

  const CONTROLLING_MAP = {
    'ไม้': { target: 'ดิน', reason: 'รากไม้ชอนไชยึดดิน ควบคุมและกำหนดรูปทรง' },
    'ดิน': { target: 'น้ำ', reason: 'คันดินและเขื่อนกั้นน้ำ จัดระเบียบป้องกันการท่วมล้น' },
    'น้ำ': { target: 'ไฟ', reason: 'น้ำดับไฟ ดับความร้อนรนและควบคุมเปลวเพลิง' },
    'ไฟ': { target: 'ทอง', reason: 'ไฟหลอมโลหะ เคี่ยวกรำให้เปลี่ยนรูปทรงเป็นเครื่องมือทรงคุณค่า' },
    'ทอง': { target: 'ไม้', reason: 'คมขวานทองตัดแต่งไม้ ตัดสิ่งเกินพอดีเพื่อนำไปใช้ประโยชน์' }
  };

  function getBaseElement(elemStr) {
    if (!elemStr) return 'ดิน';
    if (elemStr.includes('ไม้') || elemStr.toLowerCase().includes('wood')) return 'ไม้';
    if (elemStr.includes('ไฟ') || elemStr.toLowerCase().includes('fire')) return 'ไฟ';
    if (elemStr.includes('ดิน') || elemStr.toLowerCase().includes('earth')) return 'ดิน';
    if (elemStr.includes('ทอง') || elemStr.toLowerCase().includes('metal')) return 'ทอง';
    if (elemStr.includes('น้ำ') || elemStr.toLowerCase().includes('water')) return 'น้ำ';
    return 'ดิน';
  }

  function getElementRelation(elemA, elemB) {
    const a = getBaseElement(elemA);
    const b = getBaseElement(elemB);

    if (a === b) {
      return {
        type: 'same',
        typeTh: 'ธาตุเดียวกัน (比和)',
        symbol: '=',
        color: '#0284c7',
        bg: '#f0f9ff',
        border: '#bae6fd',
        headline: `${a} สะท้อน ${b}: สอดคล้องและเน้นย้ำพลังเดิม`,
        detail: `เป็นธาตุ${a}เหมือนกัน สะท้อนถึงความสอดคล้อง การตอกย้ำสภาวะเดิม หรือความต่อเนื่องที่ทรงพลัง (ไม่สรุปว่าดีหรือร้ายจากความเหมือนเพียงอย่างเดียว ให้อ่านเนื้อหาไพ่ประกอบ)`
      };
    }

    if (GENERATING_MAP[a] && GENERATING_MAP[a].target === b) {
      return {
        type: 'generating',
        typeTh: 'วงจรส่งเสริม (相生)',
        symbol: '→',
        color: '#16a34a',
        bg: '#f0fdf4',
        border: '#bbf7d0',
        headline: `${a} ส่งเสริม ${b}: มีแรงหนุน เกื้อกูล และส่งพลังต่อเนื่อง`,
        detail: `${GENERATING_MAP[a].reason} สะท้อนว่าพลังงานส่งต่อได้อย่างราบรื่น มีแรงสนับสนุนที่ดีและช่วยขับเคลื่อนไปข้างหน้า`
      };
    }

    if (GENERATING_MAP[b] && GENERATING_MAP[b].target === a) {
      return {
        type: 'draining',
        typeTh: 'ธาตุลูกถ่ายเทแรง (泄气)',
        symbol: '←',
        color: '#854d0e',
        bg: '#fefce8',
        border: '#fef08a',
        headline: `${b} ดึงพลังจาก ${a}: ถ่ายเทแรง ต้องระวังหมดกำลัง`,
        detail: `${b} เป็นธาตุที่ได้รับแรงหล่อเลี้ยงจาก ${a} จึงอาจทำให้ ${a} ต้องทุ่มเทกำลังหรือปรับตัวรองรับ`
      };
    }

    if (CONTROLLING_MAP[a] && CONTROLLING_MAP[a].target === b) {
      return {
        type: 'controlling',
        typeTh: 'วงจรควบคุม (相克)',
        symbol: '⚔️',
        color: '#c2410c',
        bg: '#fff7ed',
        border: '#ffedd5',
        headline: `${a} ควบคุม ${b}: มีวินัย บริหารจัดการ หรือแรงต้าน`,
        detail: `${CONTROLLING_MAP[a].reason} การควบคุมไม่ได้แปลว่าเป็นผลร้ายเสมอไป แต่อาจหมายถึงการจัดระเบียบ การจำกัดปัญหา วินัย หรือการใช้ความเด็ดขาดเอาชนะอุปสรรค`
      };
    }

    if (CONTROLLING_MAP[b] && CONTROLLING_MAP[b].target === a) {
      return {
        type: 'counter_control',
        typeTh: 'แรงควบคุมย้อนกลับ (反克)',
        symbol: '🛡️',
        color: '#b91c1c',
        bg: '#fef2f2',
        border: '#fecaca',
        headline: `${b} พยายามควบคุม ${a}: มีแรงเสียดทานหรือข้อจำกัด`,
        detail: `สภาวะที่ต้องเผชิญกับข้อจำกัด หรือต้องปรับกลยุทธ์เพื่อไม่ให้เกิดการปะทะโดยตรง`
      };
    }

    return {
      type: 'neutral',
      typeTh: 'สมดุลทั่วไป',
      symbol: '•',
      color: '#64748b',
      bg: '#f8fafc',
      border: '#e2e8f0',
      headline: 'พลังงานสมดุล',
      detail: 'ดำเนินไปตามธรรมชาติ'
    };
  }

  function getActiveCardsPool() {
    let pool = [];
    if (typeof window !== 'undefined' && window.JIUTIAN_DATABASE_V2 && Array.isArray(window.JIUTIAN_DATABASE_V2.cards) && window.JIUTIAN_DATABASE_V2.cards.length > 0) {
      pool = window.JIUTIAN_DATABASE_V2.cards;
    } else if (typeof jiutianDatabaseV2 !== 'undefined' && jiutianDatabaseV2 && Array.isArray(jiutianDatabaseV2.cards) && jiutianDatabaseV2.cards.length > 0) {
      pool = jiutianDatabaseV2.cards;
    } else if (typeof jiutianCards !== 'undefined' && Array.isArray(jiutianCards) && jiutianCards.length > 0) {
      pool = jiutianCards;
    } else if (typeof window !== 'undefined' && window.THEP_MEOW_CARDS && Array.isArray(window.THEP_MEOW_CARDS) && window.THEP_MEOW_CARDS.length > 0) {
      pool = window.THEP_MEOW_CARDS;
    } else if (typeof window !== 'undefined' && window.JIUTIAN_CARDS && Array.isArray(window.JIUTIAN_CARDS) && window.JIUTIAN_CARDS.length > 0) {
      pool = window.JIUTIAN_CARDS;
    } else if (typeof myCatCards !== 'undefined' && Array.isArray(myCatCards) && myCatCards.length > 0) {
      pool = myCatCards;
    }

    // ตอนสุ่มไพ่: ใช้เฉพาะ 92 ใบแรก (ไฟล์ 1-92.png) ส่วน 93.png คือภาพหลังไพ่ ไม่นำมาสุ่ม
    return pool.filter(c => {
      if (!c) return false;
      const numId = parseInt(c.id, 10);
      if (!isNaN(numId) && numId > 92) return false;
      const cardImg = c.image || '';
      if (cardImg.includes('93.png') || /JiuTianCardImage\/(9[3-9]|\d{3,})\.png/i.test(cardImg)) return false;
      return true;
    });
  }

  // App State for Fortune Telling (Single Unified Deck: ไพ่เทพเหมียว 92 ใบ)
  const fortuneState = {
    step: 1,
    question: '',
    deckId: 'thepmeow',
    deckName: 'ไพ่เทพเหมียว (92 ใบ)',
    spreadType: '3cards', // Default: ไพ่ 3 ใบ (Auto-detected 1 of 5 patterns)
    patternId: 'pattern2',
    activeCardsPool: getActiveCardsPool(),
    drawnCards: [null, null, null],
    currentPickSlot: 0,
    modalTargetSlot: 0
  };

  function parseQuestionChoices(question) {
    if (!question || typeof question !== 'string') {
      return { choiceA: 'ตัวเลือก A', choiceB: 'ตัวเลือก B', hasExplicitChoices: false };
    }
    const clean = question.trim();
    const separators = [' vs ', ' VS ', ' หรือ ', ' หรือว่า ', ' / ', '/', ' . ', '.', ' , ', ',', ' - '];
    for (const sep of separators) {
      if (clean.includes(sep)) {
        const parts = clean.split(sep).map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          return {
            choiceA: parts[0],
            choiceB: parts[1],
            hasExplicitChoices: true
          };
        }
      }
    }
    return { choiceA: 'ตัวเลือก A', choiceB: 'ตัวเลือก B', hasExplicitChoices: false };
  }

  function getCardConsideration(card, choiceName, baseElem) {
    const name = card.name_th || card.name || '';
    const elem = getBaseElement(baseElem || card.element);
    return interpretCardInContext({
      card,
      posRole: 'CHOICE_CONSIDERATION',
      posTitle: `ทางเลือก ${choiceName}`,
      question: fortuneState.question,
      choiceLabel: choiceName
    });
  }

  // --------------------------------------------------------------------------
  // CONTEXTUAL DIVINATION INTERPRETATION ENGINE (แม่หมอติ๊ดติ๊ด ปัญญาญาณ)
  // วิเคราะห์แก่นไพ่ เบญจธาตุ และบทบาทประจำตำแหน่ง สังเคราะห์เป็นคำทำนายบริบทจริง
  // ไม่ดึงข้อมูล raw Excel ซ้ำซ้อน แต่ตีความตามคำถามและตำแหน่งอย่างลึกซึ้ง
  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // INTELLIGENT QUESTION PATTERN CLASSIFIER (5 PATTERNS AUTO-DETECTION)
  // --------------------------------------------------------------------------
  function detectBestPatternForQuestion(questionText) {
    const q = (questionText || '').trim().toLowerCase();
    if (!q) {
      return 'pattern2'; // default: สถานการณ์ - อุปสรรค - ทางออก
    }

    // แบบที่ 4: ตัวเลือก A - ตัวเลือก B - คำแนะนำ
    // ใช้เมื่อผู้ถามต้องเลือกระหว่างสองแนวทาง โดยเปรียบเทียบข้อดี ข้อเสีย และความเสี่ยงร่วมกับคำแนะนำ
    const choiceMarkers = ['หรือ', 'หรือว่า', ' vs ', ' vs. ', ' vs', 'vs ', ' / ', 'ระหว่าง', 'ดีกว่า', 'อันไหน', 'แบบไหน', 'เลือกอัน', 'เลือกทาง', 'สองจิตสองใจ', 'ชั่งใจ'];
    const hasChoiceKeyword = choiceMarkers.some(m => q.includes(m)) ||
      ((q.includes('ดีไหม') || q.includes('ดีมั้ย')) && (q.includes('หรือ') || q.includes('ถ้า') || q.includes('กับ')));
    if (hasChoiceKeyword) {
      return 'pattern4';
    }

    // แบบที่ 5: เงื่อนไข - กระบวนการ - ผลลัพธ์
    // ใช้ดูว่าเรื่องหนึ่งจะดำเนินไปอย่างไร โดยเฉพาะคำถามเกี่ยวกับการสมัครงาน การเจรจา การอนุมัติ และการเปลี่ยนแปลงในองค์กร
    const processMarkers = [
      'สมัครงาน', 'สัมภาษณ์', 'ผ่านโปร', 'โปรเบชั่น', 'เจรจา', 'สัญญา', 'เซ็นสัญญา',
      'อนุมัติ', 'ขั้นตอน', 'กระบวนการ', 'ดำเนินเรื่อง', 'วีซ่า', 'กู้เงิน', 'สินเชื่อ',
      'ยื่นกู้', 'สอบ', 'สอบผ่าน', 'ประเมิน', 'ปรับโครงสร้าง', 'ย้ายแผนก', 'ย้ายสาขา',
      'ประมูล', 'เงื่อนไข', 'ดีล', 'ขอทุน', 'จะผ่านไหม', 'ผ่านไหม', 'จะได้ไหม', 'สำเร็จไหม'
    ];
    if (processMarkers.some(m => q.includes(m))) {
      return 'pattern5';
    }

    // แบบที่ 3: สิ่งที่เกิดขึ้น - สิ่งที่ซ่อนอยู่ - แนวโน้มผลลัพธ์
    // ใช้เจาะสถานการณ์ที่ยังไม่เข้าใจ เช่น อีกฝ่ายคิดอย่างไร หรือองค์กรกำลังดำเนินเรื่องไปในทิศทางใด โดยต้องระวังไม่ถือว่าไพ่ยืนยันความคิดของบุคคลอื่นได้จริง
    const hiddenMarkers = [
      'คิดอย่างไร', 'คิดยังไง', 'คิดอะไร', 'รู้สึกอย่างไร', 'รู้สึกยังไง', 'รู้สึกอะไร',
      'ในใจ', 'ความในใจ', 'ซ่อนอยู่', 'ซ่อน', 'แอบ', 'เบื้องหลัง', 'ความจริง', 'จริงใจ',
      'จริงจัง', 'หลอก', 'มีคนอื่น', 'นอกใจ', 'ลับหลัง', 'เจตนา', 'หวังดี', 'ทิศทางองค์กร',
      'องค์กรกำลัง', 'บริษัทกำลัง', 'นโยบาย', 'ลับ', 'ปิดบัง', 'อีกฝ่าย', 'เขาคิด', 'เธอคิด', 'หัวหน้าคิด', 'เพื่อนร่วมงานคิด'
    ];
    if (hiddenMarkers.some(m => q.includes(m))) {
      return 'pattern3';
    }

    // แบบที่ 1: อดีต - ปัจจุบัน - อนาคต
    // ใช้ดูพัฒนาการของเรื่อง ตั้งแต่สิ่งที่นำมาสู่สถานการณ์ปัจจุบัน ไปจนถึงแนวโน้มข้างหน้า
    const timelineMarkers = [
      'อดีต', 'ปัจจุบัน', 'อนาคต', 'พัฒนาการ', 'แนวโน้ม', 'จากนี้', 'ต่อไปนี้', 'ข้างหน้า',
      'ระยะยาว', 'ปีนี้', 'ปีหน้า', 'ช่วงนี้', 'ที่ผ่านมา', 'จะเป็นอย่างไรต่อไป', 'จะเป็นยังไงต่อไป',
      'เติบโต', 'พัฒนา', 'ทิศทางชีวิต', 'ดวงปี', 'ดวงชะตาชีวิต', 'ภาพรวม'
    ];
    if (timelineMarkers.some(m => q.includes(m))) {
      return 'pattern1';
    }

    // แบบที่ 2: สถานการณ์ - อุปสรรค - ทางออก (Default)
    // ใช้เมื่อผู้ถามต้องการเข้าใจปัญหาและหาทางจัดการ เหมาะกับเรื่องงาน ความสัมพันธ์ และการตัดสินใจ
    return 'pattern2';
  }

  function detectQuestionTopic(questionText) {
    const q = (questionText || '').trim().toLowerCase();
    if (!q) {
      return {
        topic: 'general',
        label: 'ภาพรวมชีวิต & ทางออกของปัญหา',
        focusNoun: 'สถานการณ์และเรื่องราวนี้',
        actionVerb: 'คลี่คลายปัญหาและเปิดทางสว่าง'
      };
    }

    // Career / Business
    if (/งาน|ลาออก|ย้ายงาน|หางาน|ตำแหน่ง|โปรเจกต์|เจ้านาย|หัวหน้า|ลูกน้อง|เพื่อนร่วมงาน|บริษัท|องค์กร|ออฟฟิศ|สัญญา|ทำงาน|อาชีพ|ธุรกิจ|ค้าขาย|กิจการ|สตาร์ทอัพ|ลูกค้า|สัมภาษณ์/.test(q)) {
      return {
        topic: 'career',
        label: 'การงาน & ทิศทางอาชีพ',
        focusNoun: 'หน้าที่การงานและภารกิจนี้',
        actionVerb: 'บริหารจัดการงานและเป้าหมายความสำเร็จ'
      };
    }

    // Love / Relationship
    if (/รัก|แฟน|คนรัก|คนคุย|แอบชอบ|นอกใจ|มือที่สาม|เลิก|คืนดี|แต่งงาน|คู่ครอง|โสด|ความสัมพันธ์|แฟนเก่า|จีบ/.test(q)) {
      return {
        topic: 'love',
        label: 'ความรัก & ความสัมพันธ์',
        focusNoun: 'สายใยความสัมพันธ์และความรู้สึกนี้',
        actionVerb: 'ปรับความเข้าใจและรักษาความผูกพัน'
      };
    }

    // Finance / Wealth
    if (/เงิน|หนี้|หนี้สิน|รายได้|โชคลาภ|เงินเก็บ|รวย|ทรัพย์|ค่าใช้จ่าย|ลงทุน|กู้|กระเป๋าเงิน|กำไร|ขาดทุน/.test(q)) {
      return {
        topic: 'finance',
        label: 'การเงิน & โชคลาภทรัพย์สิน',
        focusNoun: 'สภาพคล่องและการเงินนี้',
        actionVerb: 'บริหารจัดการทรัพย์สินและความมั่นคง'
      };
    }

    // Decision / Dilemma
    if (/เลือก|ตัดสินใจ|ทางแยก|ลังเล|เอาไงดี|ดีไหม|ควรทำไหม|ทางไหน|a หรือ b|ลาออกดีไหม/.test(q)) {
      return {
        topic: 'decision',
        label: 'การตัดสินใจ & ทางแพร่งชีวิต',
        focusNoun: 'การตัดสินใจครั้งสำคัญนี้',
        actionVerb: 'เลือกเส้นทางที่ดีที่สุดให้กับตนเอง'
      };
    }

    // Health / Stress / Burnout
    if (/สุขภาพ|เครียด|เหนื่อย|หมดไฟ|กังวล|ซึมเศร้า|นอนไม่หลับ|ป่วย|ร่างกาย|พักผ่อน|ท้อ/.test(q)) {
      return {
        topic: 'health',
        label: 'สุขภาพ & พลังใจ',
        focusNoun: 'สุขภาพกายและสภาวะจิตใจนี้',
        actionVerb: 'ฟื้นฟูพลังชีวิตและสร้างสมดุลใจ'
      };
    }

    return {
      topic: 'general',
      label: 'ภาพรวมชีวิต & ทางออกของปัญหา',
      focusNoun: 'สถานการณ์และสิ่งที่คุณกำลังเผชิญ',
      actionVerb: 'คลี่คลายปัญหาและเปิดทางสว่าง'
    };
  }

  function extractCleanEssence(card) {
    const raw = card.concept || card.core_meaning || '';
    if (!raw) return 'การปรับสมดุลและขับเคลื่อนไปข้างหน้าอย่างมีสติ';
    const sentences = raw.split(/[.!?\n]+/).map(s => s.trim()).filter(Boolean);
    if (sentences.length > 1 && sentences[0] === sentences[1]) {
      return sentences[0];
    }
    return raw.replace(/แม่หมอแนะนำว่า.*$/, '').trim();
  }

  // Archetype library for key Chinese oracle cards
  const CARD_ARCHETYPES = {
    'ยืนหยัดต่อสู้': {
      situation: 'ในสถานการณ์ปัจจุบันของ{focusNoun} ไพ่สะท้อนภาพที่คุณกำลังต้องตั้งการ์ดสู้ยิบตาเพื่อปกป้องสิทธิ ขอบเขต หรือพื้นที่ของตนเองค่ะ อาจมีแรงกดดันจากรอบข้างหรือสภาวะที่ทำให้รู้สึกว่าหากยอมถอยแม้แต่ก้าวเดียวจะถูกเอาเปรียบทันที แม้จะเหนื่อยล้าแต่แม่หมอเห็นไฟในหัวใจของคุณที่ยังคงมุ่งมั่นและไม่ยอมจำนนง่ายๆ',
      action: 'ทางออกสำหรับ{focusNoun}คือ คุณต้อง “ตั้งการ์ดให้มั่นและยืนหยัดในจุดยืนที่ถูกต้อง” ค่ะ อย่าเพิ่งยอมจำนนหรือถอยหนีเพียงเพราะความเกรงใจหรือแรงกดดัน จงสร้างขอบเขต (Boundary) ให้ชัดเจน รักษามาตรฐานความเป็นมืออาชีพไว้เป็นเกราะคุ้มกันตนเอง',
      outcome_action: 'หากคุณยืนหยัดตามแนวทางนี้ ผลลัพธ์คือคุณจะสามารถปกป้องพื้นที่และสิทธิ์อันชอบธรรมของตนเองไว้ได้อย่างสง่างาม คนรอบข้างจะเริ่มเกรงใจและยอมรับในความหนักแน่นของคุณ',
      outcome_inaction: 'หากคุณเลือกที่จะยอมแพ้หรือไม่กล้าลุกขึ้นปกป้องตนเอง คุณจะสูญเสียขอบเขตที่ปลอดภัย และจะถูกรุมเร้าด้วยความรับผิดชอบที่ไม่เป็นธรรมจนเหนื่อยล้าเกินเยียวยา',
      heart: 'ลึกๆ ในก้นบึ้งหัวใจ คุณรู้สึกว่าสิ่งที่ตนเองยึดถือนั้นถูกต้อง และพร้อมจะยืนหยัดปกป้องศักดิ์ศรีและความเป็นธรรมของตนเองอย่างถึงที่สุดค่ะ'
    },
    'จิ่วเทียนเสวียนหนี่ว์': {
      situation: 'สภาวะปัจจุบันมีความซับซ้อนและมีมิติทางจิตวิทยาซ่อนอยู่เบื้องหลัง ดั่งมีเกมที่มองไม่เห็นด้วยตาเปล่า การมองเพียงสิ่งที่ปรากฏภายนอกอาจทำให้ประเมินสถานการณ์ผิดพลาดได้',
      action: 'นี่คือกุญแจชี้ขาดที่แม่หมอติ๊ดติ๊ดอยากสะกิดเตือนเลยค่ะ! สำหรับ{focusNoun}นี้ “อย่าใช้เพียงแรงปะทะหรืออารมณ์ร้อนเข้าชนเด็ดขาด” แต่จงอัญเชิญพลังปัญญาญาณของ “จิ่วเทียนเสวียนหนี่ว์ (ธาตุน้ำ)” มาใช้ นั่นคือการใช้ “จิตวิทยา สัญชาตญาณ และการอ่านใจคน” สังเกตการณ์อย่างสุขุม มองทะลุแรงจูงใจเบื้องลึกของทุกฝ่าย แล้ววางหมากแก้เกมอย่างแยบยล นิ่งดั่งสายน้ำแต่เฉียบคมทุกการเคลื่อนไหว',
      outcome_action: 'เมื่อคุณนำปัญญาญาณและความเยือกเย็นมาใช้ คุณจะมองทะลุเกม อ่านทางออกได้อย่างทะลุปรุโปร่ง สามารถพลิกสถานการณ์กลับมาคุมเกมได้โดยไม่ต้องเปลืองแรงปะทะแม้แต่น้อย',
      outcome_inaction: 'หากด่วนตัดสินใจด้วยความหุนหันและขาดการวิเคราะห์เชิงลึก คุณอาจติดกับดักทางจิตวิทยาและตกเป็นเบี้ยล่างในเกมของผู้อื่นได้ง่ายๆ ค่ะ',
      heart: 'สัญชาตญาณในใจกำลังกระซิบเตือนคุณว่ามีบางสิ่งยังไม่เปิดเผย คุณอยากเพ่งพินิจเพื่อค้นหาแก่นแท้และความจริงที่ซ่อนอยู่เบื้องหลังเรื่องนี้'
    },
    'นาจา': {
      situation: 'สถานการณ์กำลังต้องการความรวดเร็วและเด็ดขาด มีพลังขับเคลื่อนสูงและแรงกระตุ้นที่พร้อมจะพุ่งไปข้างหน้า',
      action: 'ทางออกคือการ “ตัดสินใจให้ฉับไวและลงมือทำอย่างกล้าหาญ” อย่ายืดเยื้อหรือปล่อยให้ความลังเลมาฉุดรั้ง พุ่งตรงสู่เป้าหมายด้วยความมุ่งมั่นเต็มร้อย',
      outcome_action: 'หากคุณลงมือทำตามกลยุทธ์ปัญญาญาณของใบที่ 2 ผลลัพธ์จะระเบิดพลังดั่ง “นาจา (ธาตุไฟ)” ทันทีค่ะ! สถานการณ์จะพลิกกลับมาขับเคลื่อนอย่างรวดเร็วปานสายฟ้าแลบ ปัญหาที่เคยคาราคาซังจะถูกปลดล็อก คุณจะฝ่าด่านอุปสรรคได้อย่างคล่องแคล่ว สะใจ และพุ่งทะยานสู่เป้าหมายด้วยชัยชนะอันเด็ดเดี่ยว',
      outcome_inaction: 'หากไม่ยอมขยับตัว พลังความเร่งด่วนจะแปรเปลี่ยนเป็นความใจร้อน อึดอัด และความตึงเครียดที่สร้างแรงกดดันอยู่ภายใน',
      heart: 'หัวใจของคุณเปี่ยมด้วยความกล้าหาญและความกระตือรือร้น คุณอยากพุ่งทะยานไปข้างหน้าให้พ้นจากความอึดอัดนี้โดยเร็วที่สุด'
    },
    'มหาเทพจู๋หรง': {
      situation: 'คุณกำลังอยู่ในตำแหน่งที่ต้องแบกรับความรับผิดชอบหลัก เป็นศูนย์กลางที่ทุกคนคาดหวังและรอคอยการตัดสินใจจากคุณ',
      action: 'จงแสดงภาวะผู้นำ กล้าตัดสินใจอย่างเด็ดเดี่ยว คุมพลังงานและทิศทางของทีมหรือตนเองให้มุ่งตรงสู่เป้าหมายโดยไม่วอกแวก',
      outcome_action: 'คุณจะได้รับการยอมรับในฐานะผู้นำที่มีบารมี มีอำนาจในการจัดการเรื่องราวได้เบ็ดเสร็จเด็ดขาด',
      outcome_inaction: 'นี่คือจุดเตือนสติที่สำคัญมากค่ะ! หากคุณไม่ปรับกลยุทธ์ตามใบที่ 2 ผลลัพธ์จะกลายเป็น “มหาเทพจู๋หรง (ธาตุไฟ)” ในด้านความกดดัน... คุณจะต้องแบกรับภาระอันหนักอึ้งไว้บนบ่าคนเดียว ความรับผิดชอบที่สะสมจะบีบให้คุณต้องคุมทุกอย่างไว้ด้วยความตึงเครียดสูง และไฟในตัวอาจเผาผลาญจนหมดพลังใจในที่สุด',
      heart: 'ในใจของคุณตระหนักดีถึงความรับผิดชอบอันยิ่งใหญ่ และต้องการที่จะควบคุมชะตาชีวิตของตนเองให้อยู่ในมือ'
    },
    'เฉลิมฉลองร่วมกัน': {
      situation: 'มีบรรยากาศแห่งความหวัง หรือกำลังมองหาจุดพักใจเพื่อผ่อนคลายจากความตึงเครียดที่สะสมมา',
      action: 'จงเปิดใจรับความสุข มองหาบรรยากาศที่อบอุ่นเป็นมิตร สร้างความร่วมมือและรอยยิ้มร่วมกับคนรอบข้าง ลดความตึงเครียดลง',
      outcome_action: 'เรื่องราวจะจบลงด้วยความชื่นมื่น บรรยากาศแห่งการเฉลิมฉลอง ความสำเร็จ และรอยยิ้มที่อบอุ่นจะกลับคืนมา',
      outcome_inaction: 'คุณอาจพลาดช่วงเวลาแห่งความสุข และต้องติดอยู่กับความตึงเครียดต่อไปโดยไม่จำเป็น',
      heart: 'ลึกๆ ในก้นบึ้งหัวใจ สิ่งที่คุณต้องการอย่างแท้จริงคือ “ความสุข ความอบอุ่น และความผ่อนคลาย” ค่ะ คุณไม่ได้ต้องการการต่อสู้อันยืดเยื้อหรือชัยชนะที่โดดเดี่ยว แต่หัวใจของคุณอยากให้เรื่องนี้จบลงด้วยดี เพื่อจะได้กลับมามีรอยยิ้ม ร่วมยินดี และเฉลิมฉลองกับคนรอบข้างอีกครั้ง'
    },
    'ผานกู่': {
      situation: 'สถานการณ์กำลังอยู่ในช่วงบุกเบิกและลงแรงอย่างหนัก ทุกสิ่งต้องสร้างด้วยน้ำพักน้ำแรงของตนเอง มีแรงผลักดันสูงที่จะทำให้เป้าหมายสำเร็จ',
      action: 'จงสร้างรากฐานที่มั่นคง วางโครงสร้างให้ชัดเจน แต่ต้องระวังไม่ให้ความหนักแน่นกลายเป็นการแบกโลกทั้งใบไว้คนเดียว',
      outcome_action: 'ความพยายามของคุณจะผลิดอกออกผลเป็นความสำเร็จที่มั่นคงดั่งภูเขาหินผา',
      outcome_inaction: 'อุปสรรคเกิดจากความพยายามที่จะแบกรับและควบคุมทุกอย่างไว้ในกำมือคนเดียว หรือกำลังเผชิญหน้ากับโครงสร้างหรือบุคคลที่มีความแข็งกร้าว มั่นคงดั่งภูเขาหิน ไม่ยอมผ่อนปรน ทำให้รู้สึกหนักอึ้งดั่งการแบกฟ้าค้ำดินจนแทบขยับตัวไม่ได้',
      heart: 'คุณมีความมุ่งมั่นสูงที่จะบุกเบิกและสร้างความสำเร็จด้วยตนเอง แต่อาจเริ่มล้าจากการแบกรับทุกสิ่ง'
    },
    'หนิวหลาง': {
      action: 'ทางออกไม่ใช่การใช้ไม้แข็งหรือการหักดิบ แต่คือ “การสร้างสะพานเชื่อมใจ” ดั่งการข้ามสะพานนกกาเหว่า! จงใช้ความอ่อนโยน ความจริงใจ ความอดทน และการให้เกียรติซึ่งกันและกัน ค่อยๆ ประสานรอยร้าว และรอคอยจังหวะเวลาที่สุกงอม'
    },
    'กุศโลบาย': {
      situation: 'คุณไม่ได้นิ่งเฉยหรือยอมจำนนต่อปัญหา แต่กำลังระดมความคิด วางแผน และใช้ปฏิภาณไหวพริบอย่างเต็มที่เพื่อหาทางพลิกสถานการณ์ มีการคิดคำนวณอย่างรอบคอบและมองหาแต้มต่อ',
      action: 'จงใช้ปฏิภาณไหวพริบและกุศโลบายอันแยบยล วางแผนอย่างมีชั้นเชิง ปรับตัวตามสถานการณ์ และอย่าแสดงไพ่ในมือให้คู่แข่งเห็นทั้งหมด',
      outcome_action: 'คุณจะสามารถพลิกแพลงสถานการณ์และคว้าความได้เปรียบมาครองได้อย่างแยบยล',
      outcome_inaction: 'ระวังความซับซ้อนของการวางแผนที่อาจมากเกินไป หรือการระแวดระวังจนเกิดความตึงเครียด'
    },
    'ร่วมมือประสานใจ': {
      action: 'ทางออกที่สำคัญที่สุดคือ “อย่าทำหรือแบกคนเดียวเด็ดขาด!” จงเปิดใจสื่อสาร ขอความช่วยเหลือจากทีมหรือคนรอบข้าง สร้างพันธมิตร และร่วมมือประสานใจเพื่อคลี่คลายสถานการณ์'
    },
    'หวงแหนสมบัติ': {
      situation: 'สะท้อนถึงการถอยกลับมาอยู่ใน Safe Zone เพื่อปกป้องพลังงาน รักษาสิทธิ์ และรักษาทรัพยากรของตนเองไว้ แต่ต้องระวังไม่ให้ความระมัดระวังกลายเป็นการปิดกั้นโอกาสใหม่ๆ'
    },
    'ภาระจากความสำเร็จ': {
      situation: 'สะท้อนว่าคุณมีผลงานและความสามารถที่เป็นที่ยอมรับ แต่ต้องแลกมาด้วยความเหนื่อยล้าสาหัส ภาระหน้าที่ที่ล้นมือทำให้พลังใจเริ่มถดถอยและเสี่ยงต่อภาวะหมดไฟ'
    }
  };

  // Universal contextual interpretation engine powered by jiutian-arcana-database-v2.json
  function interpretCardInContext({ card, posRole, posTitle, question, drawn, posIndex, choiceLabel }) {
    const name = card.name_th || card.name || '';
    const elem = getBaseElement(card.element);
    const qTopic = detectQuestionTopic(question);
    const essence = extractCleanEssence(card);

    // V2 Database Fields
    const domains = card.meanings?.domains || {};
    let domainReading = '';
    if (qTopic.topic === 'career') domainReading = domains.career;
    else if (qTopic.topic === 'love') domainReading = domains.love;
    else if (qTopic.topic === 'finance') domainReading = domains.finance;
    else if (qTopic.topic === 'health') domainReading = domains.health;
    else domainReading = domains.personality || domains.career || card.meanings?.core || '';

    const lightSide = card.meanings?.light_side || '';
    const shadowSide = card.meanings?.shadow_side || '';
    const strategy = card.strategy || '';
    const deityMsg = card.deity_message || '';
    const deityTitle = card.deity?.title || '';

    // 1. Check known archetypes
    for (const [key, arch] of Object.entries(CARD_ARCHETYPES)) {
      if (name.includes(key)) {
        let text = '';
        if (posRole === 'CURRENT_SITUATION' && arch.situation) text = arch.situation;
        else if (posRole === 'ACTION_SOLUTION' && arch.action) text = arch.action;
        else if (posRole === 'OUTCOME_ACTION' && arch.outcome_action) text = arch.outcome_action;
        else if (posRole === 'OUTCOME_INACTION' && arch.outcome_inaction) text = arch.outcome_inaction;
        else if (posRole === 'HEART_INCLINATION' && arch.heart) text = arch.heart;
        else if (posRole === 'OBSTACLE' && (arch.outcome_inaction || arch.situation)) text = arch.outcome_inaction || arch.situation;
        else if ((posRole === 'CHOICE_A' || posRole === 'CHOICE_B') && (arch.situation || arch.action)) text = arch.situation || arch.action;

        if (text) {
          return text.replace(/{focusNoun}/g, qTopic.focusNoun);
        }
      }
    }

    // 2. Dynamic element & role synthesis for ALL cards
    const elemDynamics = {
      'ไฟ': {
        nature: 'ความมุ่งมั่น แรงผลักดัน ความกระตือรือร้น หรือความร้อนรุ่มที่ต้องการการระบาย',
        actionVerb: 'จุดประกายความกล้าหาญ ลงมือทำอย่างมีเป้าหมาย และแสดงจุดยืนให้ชัดเจน',
        warning: 'ความใจร้อน อารมณ์ที่พลุ่งพล่าน หรือแรงกดดันที่อาจเผาผลาญพลังงานตนเอง',
        gift: 'พลังขับเคลื่อนที่จะทะยานไปข้างหน้าอย่างรวดเร็วและเด็ดเดี่ยว'
      },
      'น้ำ': {
        nature: 'สัญชาตญาณ ความยืดหยุ่น การปรับตัวตามกระแส และความลึกซึ้งทางอารมณ์',
        actionVerb: 'ใช้ความนุ่มนวลสยบความแข็งกร้าว สังเกตการณ์อย่างสุขุม และรอคอยจังหวะเวลาที่เหมาะสม',
        warning: 'ความคลุมเครือ ไม่แน่นอน หรือการปล่อยให้อารมณ์ความรู้สึกพัดพาจนเสียทิศทาง',
        gift: 'ปัญญาญาณที่มองทะลุถึงแก่นแท้และความสัมพันธ์ที่แน่นแฟ้น'
      },
      'ดิน': {
        nature: 'ความมั่นคง ความหนักแน่น การรักษาผลประโยชน์ และการปักหลักในพื้นที่ปลอดภัย',
        actionVerb: 'ตั้งหลักบนความสุขุมรอบคอบ วางรากฐานให้แน่นหนา และบริหารจัดการทรัพยากรที่มีอยู่',
        warning: 'ความยึดติดในกรอบเดิมๆ ความกลัวการเปลี่ยนแปลง หรือการแบกรับภาระไว้คนเดียว',
        gift: 'ผลลัพธ์ที่เป็นรูปธรรม ความมั่นคงในระยะยาว และความปลอดภัย'
      },
      'ทอง': {
        nature: 'ความเฉียบคม ความถูกต้องเป็นธรรม ระเบียบวินัย และการตัดสินใจเชิงกลยุทธ์',
        actionVerb: 'ใช้เหตุผลและข้อเท็จจริง จัดระเบียบ ตัดสิ่งที่ไม่จำเป็นออกไป และตัดสินใจอย่างเด็ดขาด',
        warning: 'ความแข็งกร้าว กฎเกณฑ์ที่เข้มงวดเกินไป หรือการใช้ไม้แข็งจนเกิดแรงเสียดทาน',
        gift: 'ความชัดเจน ความโปร่งใส และการปลดล็อกพันธนาการได้อย่างตรงจุด'
      },
      'ไม้': {
        nature: 'การเติบโต การเรียนรู้ การขยายโอกาส และความคิดสร้างสรรค์',
        actionVerb: 'เปิดรับมุมมองใหม่ๆ พัฒนาทักษะ และสร้างการเติบโตร่วมกับผู้อื่นอย่างเป็นขั้นเป็นตอน',
        warning: 'ภาระหน้าที่ที่งอกเงยจนล้นมือ หรือความคาดหวังที่เติบโตเร็วกว่ากำลังที่มี',
        gift: 'การต่อยอดที่ยั่งยืน โอกาสใหม่ๆ และพัฒนาการที่งดงาม'
      }
    };

    const ed = elemDynamics[elem] || elemDynamics['น้ำ'];

    if (posRole === 'CURRENT_SITUATION') {
      const situationBody = domainReading || essence;
      return `สำหรับ${qTopic.focusNoun} ไพ่ “${name}” (ธาตุ${elem}${deityTitle ? ` — ${deityTitle}` : ''}) สะท้อนสภาวะปัจจุบันว่า: ${situationBody} พลังของธาตุ${elem}บ่งชี้ว่าคุณกำลังอยู่ในช่วงที่${ed.nature} ซึ่งต้องอาศัยสติและความเข้าใจในการประคองสถานการณ์`;
    } else if (posRole === 'ACTION_SOLUTION') {
      return `ทางออกและกลยุทธ์ที่แม่หมอขอชี้แนะคือ: ${strategy ? `“${strategy}” ` : ''}จงน้อมนำพลังของ “${name}” มาเป็นแนวทาง นั่นคือ ${ed.actionVerb} ${lightSide ? `(จุดแข็ง: ${lightSide})` : ''} ปรับใช้อย่างยืดหยุ่นเพื่อคลี่คลายปัญหา`;
    } else if (posRole === 'OUTCOME_ACTION') {
      const outcomeBody = lightSide || domainReading || essence;
      return `หากคุณปฏิบัติตามแนวทางนี้ ผลลัพธ์ของ${qTopic.focusNoun}จะนำพาไปสู่: ${ed.gift} ปัญหาที่สะสมจะได้รับการคลี่คลาย และเปิดทางให้ “${outcomeBody}” ปรากฏขึ้นอย่างงดงาม`;
    } else if (posRole === 'OUTCOME_INACTION') {
      const warningBody = shadowSide || ed.warning;
      return `ข้อพึงระวังหากปล่อยผ่านหรือไม่ปรับเปลี่ยนวิธี: ด้านเงาของไพ่เตือนถึง ${warningBody} ซึ่งจะทำให้สถานการณ์กลายเป็นแรงกดดันที่สะสมยืดเยื้อต่อไป`;
    } else if (posRole === 'HEART_INCLINATION') {
      const heartBody = domains.personality || essence;
      return `ลึกๆ ในก้นบึ้งหัวใจของคุณ ไพ่ใบนี้สะท้อนว่าจิตใต้สำนึกกำลังโน้มเอียงไปทาง “${heartBody}” คุณปรารถนาความมั่นคงตามพลังของธาตุ${elem} ${deityMsg ? `พร้อมด้วยโอวาทเตือนใจ: “${deityMsg}”` : ''}`;
    } else if (posRole === 'OBSTACLE') {
      return `จุดที่ทำให้เรื่องนี้ติดขัดเกิดจาก: ${shadowSide || ed.warning} หรือการยึดติดในกรอบเดิมมากเกินไปจนขาดความสมดุล`;
    } else if (posRole === 'CHOICE_A' || posRole === 'CHOICE_B') {
      const cLabel = choiceLabel || 'เส้นทางนี้';
      const choiceBody = domainReading || essence;
      return `หากเลือกเส้นทาง “${cLabel}” บรรยากาศและผลลัพธ์จะขับเคลื่อนด้วยพลังของ “${name} (${elem})”: ${choiceBody} โดยมีทั้ง ${ed.gift} ${shadowSide ? `แต่ก็ต้องพึงระวังด้านเงา (${shadowSide}) ไว้ด้วยค่ะ` : ''}`;
    } else if (posRole === 'PAST') {
      return `ในอดีตหรือรากเหง้าที่นำพามาสู่จุดนี้ของ “${question || fortuneState.question}”: พลังของ “${name} (${elem})” สะท้อนว่า ${domainReading || essence} ซึ่งได้หล่อหลอมและส่งผลต่อเนื่องมาถึงปัจจุบัน`;
    } else if (posRole === 'FUTURE') {
      return `แนวโน้มพัฒนาการข้างหน้าที่จะเกิดขึ้นกับ “${question || fortuneState.question}”: พลังของ “${name} (${elem})” นำพา ${ed.gift} ${domainReading || essence}`;
    } else if (posRole === 'SURFACE_REALITY') {
      return `สิ่งที่ปรากฏให้เห็นภายนอกอย่างชัดเจนสำหรับ “${question || fortuneState.question}”: พลังของ “${name} (${elem})” สะท้อนว่า ${domainReading || essence} ซึ่งเป็นภาพจริงเบื้องหน้าที่ทุกคนรับรู้ได้`;
    } else if (posRole === 'HIDDEN_FACTOR') {
      const hiddenBody = shadowSide || domains.personality || essence;
      return `เบื้องลึกหรือสิ่งที่ซ่อนอยู่ใต้ผิวน้ำ ไพ่ “${name}” ชี้ให้เห็นถึง: ${hiddenBody} พลังของธาตุ${elem}บ่งบอกถึงสภาวะจิตใต้สำนึก หรือแรงผลักดันที่ยังไม่ได้เปิดเผยออกมา`;
    } else if (posRole === 'PROJECTED_OUTCOME') {
      return `ทิศทางที่สถานการณ์กำลังดำเนินไปสู่ สำหรับเรื่อง “${question || fortuneState.question}”: พลังของ “${name} (${elem})” ชี้ว่า ${domainReading || essence} จะเป็นผลลัพธ์ที่จะค่อยๆ ชัดเจนขึ้นตามกาลเวลา`;
    } else if (posRole === 'PREREQUISITE') {
      return `เงื่อนไขสำคัญหรือปัจจัยตั้งต้นที่ต้องมี/ต้องรู้สำหรับ “${question || fortuneState.question}”: พลังของ “${name} (${elem})” สะท้อนว่า ${domainReading || strategy || essence} คุณต้องเตรียมความพร้อมและตั้งหลักบนพื้นฐานนี้`;
    } else if (posRole === 'PROCESS') {
      return `ในขั้นตอนการดำเนินงานจริง สิ่งที่จะต้องปฏิบัติและเผชิญระหว่างทางคือ: ${strategy ? `“${strategy}” ` : ''}${domainReading || essence} นั่นคือ ${ed.actionVerb} เพื่อขับเคลื่อนเรื่องนี้ให้คืบหน้า`;
    }

    return `ไพ่ “${name}” ในตำแหน่ง${posTitle || ''} สะท้อนว่า: ${domainReading || essence} จงใช้พลังของธาตุ${elem}เพื่อนำพา${qTopic.actionVerb}อย่างมีสติ`;
  }

  function getCardSituationInterpretation(card, baseElem, question) {
    return interpretCardInContext({
      card,
      posRole: 'CURRENT_SITUATION',
      posTitle: 'สถานการณ์ปัจจุบัน',
      question: question || fortuneState.question
    });
  }

  function getCardObstacleInterpretation(card, baseElem, question) {
    return interpretCardInContext({
      card,
      posRole: 'OBSTACLE',
      posTitle: 'อุปสรรค / สิ่งกีดขวาง',
      question: question || fortuneState.question
    });
  }

  function getCardSolutionInterpretation(card, baseElem, question) {
    return interpretCardInContext({
      card,
      posRole: 'ACTION_SOLUTION',
      posTitle: 'ทางออก / กลยุทธ์แก้ไข',
      question: question || fortuneState.question
    });
  }

  function getCardWisdomGuidance(card, question) {
    return interpretCardInContext({
      card,
      posRole: 'ACTION_SOLUTION',
      posTitle: 'คำแนะนำจากปัญญาญาณ',
      question: question || fortuneState.question
    });
  }

  function getActivePositions() {
    if (fortuneState.spreadType === '5cards') {
      return SPREAD_CONFIGS['5cards'].positions;
    }
    const pat = SPREAD_CONFIGS['3cards'].patterns[fortuneState.patternId] || SPREAD_CONFIGS['3cards'].patterns['pattern2'];
    if (fortuneState.patternId === 'pattern4') {
      const { choiceA, choiceB } = parseQuestionChoices(fortuneState.question);
      return [
        { 
          index: 0, 
          title: `ใบที่ 1: ตัวเลือก A (${choiceA})`, 
          shortName: `ตัวเลือก A (${choiceA})`, 
          choiceLabel: choiceA,
          desc: `สภาวะ ผลลัพธ์ และบรรยากาศหากเลือกเส้นทาง: ${choiceA}` 
        },
        { 
          index: 1, 
          title: `ใบที่ 2: ตัวเลือก B (${choiceB})`, 
          shortName: `ตัวเลือก B (${choiceB})`, 
          choiceLabel: choiceB,
          desc: `สภาวะ ผลลัพธ์ และบรรยากาศหากเลือกเส้นทาง: ${choiceB}` 
        },
        { 
          index: 2, 
          title: 'ใบที่ 3: คำแนะนำจากปัญญาญาณ', 
          shortName: 'คำแนะนำ', 
          desc: 'คำชี้แนะจากปัญญาญาณเพื่อประกอบการตัดสินใจอย่างมีสติ' 
        }
      ];
    }
    return pat.positions;
  }

  function getActiveSpreadTitle() {
    if (fortuneState.spreadType === '5cards') {
      return 'ไพ่ 5 ใบ (ทางเลือกและผลลัพธ์เชิงกลยุทธ์)';
    }
    const pat = SPREAD_CONFIGS['3cards'].patterns[fortuneState.patternId] || SPREAD_CONFIGS['3cards'].patterns['pattern2'];
    return `ไพ่ 3 ใบ (${pat.shortTitle})`;
  }

  // --------------------------------------------------------------------------
  // STEPPER & NAVIGATION CONTROLLER (2-STEP STREAMLINED SYSTEM)
  // 1: Question Input & Pick 3 Cards -> 2: Divination Results
  // --------------------------------------------------------------------------
  function setStep(targetStep) {
    fortuneState.step = targetStep;

    // Ensure pool is loaded
    if (!fortuneState.activeCardsPool || fortuneState.activeCardsPool.length === 0) {
      fortuneState.activeCardsPool = getActiveCardsPool();
    }

    // Update Stepper Progress Bar (0% for Step 1, 100% for Step 2)
    const fillPercents = [0, 100];
    if (stepperFill) {
      stepperFill.style.width = `${fillPercents[targetStep - 1] || 0}%`;
    }

    // Update Stepper Step Badges
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

    // Toggle Step Containers: Step 1 is readingStep3 (integrated screen), Step 2 is readingStep4 (results)
    if (readingStep1) readingStep1.classList.add('hidden');
    if (readingStep2) readingStep2.classList.add('hidden');
    if (readingStep3) readingStep3.classList.toggle('hidden', targetStep !== 1);
    if (readingStep4) readingStep4.classList.toggle('hidden', targetStep !== 2);

    // Keep pinnedContextBar hidden on Step 1 (since question box is right on this screen)
    if (pinnedContextBar) {
      pinnedContextBar.classList.add('hidden');
    }

    // Smooth scroll to top
    if (readingAppView) {
      readingAppView.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // --------------------------------------------------------------------------
  // LIVE QUESTION INPUT & SMART PATTERN DETECTION
  // --------------------------------------------------------------------------
  function updateSmartPatternPreview() {
    const q = userQuestionInput ? userQuestionInput.value.trim() : '';
    fortuneState.question = q;
    const patId = detectBestPatternForQuestion(q);
    fortuneState.patternId = patId;
    const patConfig = SPREAD_CONFIGS['3cards'].patterns[patId];
    if (smartPatternTitle && patConfig) {
      smartPatternTitle.textContent = patConfig.title;
    }
    if (smartPatternDesc && patConfig) {
      smartPatternDesc.textContent = patConfig.desc;
    }

    // Dynamically update slot badges according to the detected pattern
    const positions = getActivePositions();
    positions.forEach((pos, i) => {
      const slotEl = document.getElementById(`slotCard${i}`);
      if (slotEl) {
        const badgeEl = slotEl.querySelector('.slot-pos-badge');
        if (badgeEl) {
          badgeEl.setAttribute('title', pos.title);
          badgeEl.innerHTML = `<span class="badge-num">${i + 1}</span>`;
        }
      }
    });

    // Update instruction text
    if (pickCurrentInstruction && fortuneState.currentPickSlot < positions.length) {
      const pos = positions[fortuneState.currentPickSlot];
      const isMobile = window.innerWidth <= 880;
      const targetLabel = isMobile ? `ใบที่ ${fortuneState.currentPickSlot + 1}: ${pos.shortName || pos.title}` : pos.title;
      pickCurrentInstruction.innerHTML = `
        <i class="fa-solid fa-hand-pointer text-gold animate-bounce"></i> 
        <span>คลิกเลือกไพ่สำหรับ <strong>${targetLabel}</strong></span>
      `;
    }
  }

  if (userQuestionInput) {
    userQuestionInput.addEventListener('input', updateSmartPatternPreview);
  }

  if (clearQuestionBtn && userQuestionInput) {
    clearQuestionBtn.addEventListener('click', () => {
      userQuestionInput.value = '';
      userQuestionInput.focus();
      updateSmartPatternPreview();
    });
  }

  // Suggestion Chips Click
  chipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-question');
      if (userQuestionInput && q) {
        userQuestionInput.value = q;
        userQuestionInput.focus();
        updateSmartPatternPreview();
      }
    });
  });

  // --------------------------------------------------------------------------
  // SPREAD SELECTION LOGIC (STEP 1)
  // --------------------------------------------------------------------------
  function updateSpreadUI() {
    const is5Cards = fortuneState.spreadType === '5cards';

    // Tabs toggle
    if (spreadTab3Cards) spreadTab3Cards.classList.toggle('active', !is5Cards);
    if (spreadTab5Cards) spreadTab5Cards.classList.toggle('active', is5Cards);

    // Pattern container toggle
    if (patterns3CardsWrap) patterns3CardsWrap.classList.toggle('hidden', is5Cards);
    if (spread5CardsWrap) spread5CardsWrap.classList.toggle('hidden', !is5Cards);

    // Update proceed button text
    if (proceedToStep2Btn) {
      proceedToStep2Btn.innerHTML = is5Cards 
        ? 'ไปเลือกไพ่เทพเหมียว 5 ใบกันเลย ✨ <i class="fa-solid fa-arrow-right"></i>'
        : 'ไปเลือกไพ่เทพเหมียว 3 ใบกันเลย ✨ <i class="fa-solid fa-arrow-right"></i>';
    }

    // Update stepper label
    if (step2IndicatorLabel) {
      step2IndicatorLabel.textContent = is5Cards ? '2. เลือกไพ่ 5 ใบ' : '2. เลือกไพ่ 3 ใบ';
    }

    // Update Step 2 header title
    if (step2HeaderTitle) {
      step2HeaderTitle.innerHTML = '<i class="fa-solid fa-hand-sparkles"></i> ตั้งจิตอธิษฐานให้ "ไพ่เทพเหมียว" ช่วยนำทาง';
    }

    // Update auto draw button text
    if (autoDrawCardsBtnText) {
      autoDrawCardsBtnText.textContent = 'สุ่มไพ่';
    }
  }

  if (spreadTab3Cards) {
    spreadTab3Cards.addEventListener('click', () => {
      fortuneState.spreadType = '3cards';
      updateSpreadUI();
    });
  }

  if (spreadTab5Cards) {
    spreadTab5Cards.addEventListener('click', () => {
      fortuneState.spreadType = '5cards';
      updateSpreadUI();
    });
  }

  // 3-Card Pattern Pill Buttons Click
  if (patternChipsGroup) {
    const patternPills = patternChipsGroup.querySelectorAll('.pattern-pill-btn');
    patternPills.forEach(pill => {
      pill.addEventListener('click', () => {
        patternPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const patId = pill.getAttribute('data-pattern');
        fortuneState.patternId = patId;

        const patConfig = SPREAD_CONFIGS['3cards'].patterns[patId];
        if (patternInfoBanner && patConfig) {
          patternInfoBanner.innerHTML = `
            <strong style="color: #0284c7;"><i class="fa-solid fa-circle-info"></i> ${patConfig.title}</strong><br>
            <span>${patConfig.desc}</span>
          `;
        }
      });
    });
  }

  // Step 1 Proceed Button -> Direct to Step 2 (Pick Cards)
  if (proceedToStep2Btn && userQuestionInput) {
    proceedToStep2Btn.addEventListener('click', () => {
      const q = userQuestionInput.value.trim();
      fortuneState.question = q || 'ภาพรวมดวงชะตา พลังงานชีวิต และคำแนะนำในปัจจุบัน';
      fortuneState.spreadType = '3cards';
      fortuneState.patternId = detectBestPatternForQuestion(fortuneState.question);
      fortuneState.activeCardsPool = getActiveCardsPool();
      resetPicks();
      setStep(2);
      renderFanDeck();
      updateSlotVisuals();
    });
  }

  if (editQuestionQuickBtn) {
    editQuestionQuickBtn.addEventListener('click', () => {
      setStep(1);
      if (userQuestionInput) userQuestionInput.focus();
    });
  }

  // --------------------------------------------------------------------------
  // STEP 2: PICK CARDS LOGIC (3 OR 5 CARDS DYNAMIC)
  // --------------------------------------------------------------------------
  if (backToStep2Btn) {
    backToStep2Btn.addEventListener('click', () => {
      setStep(1);
    });
  }

  function resetPicks() {
    const cardCount = fortuneState.spreadType === '5cards' ? 5 : 3;
    fortuneState.drawnCards = new Array(cardCount).fill(null);
    fortuneState.currentPickSlot = 0;
    if (revealTriggerBanner) revealTriggerBanner.classList.add('hidden');
    renderPickSlots();
  }

  function renderPickSlots() {
    if (!pickSlotsContainer) return;
    pickSlotsContainer.innerHTML = '';
    const positions = getActivePositions();
    const count = positions.length;

    if (count === 5) {
      pickSlotsContainer.classList.add('slots-count-5');
    } else {
      pickSlotsContainer.classList.remove('slots-count-5');
    }

    positions.forEach((pos, i) => {
      const slotEl = document.createElement('div');
      slotEl.className = 'pick-target-slot';
      slotEl.id = `slotCard${i}`;
      slotEl.setAttribute('data-slot', i);

      slotEl.innerHTML = `
        <div class="slot-pos-badge" title="${pos.title}">
          <span class="badge-num">${i + 1}</span>
        </div>
        <div class="slot-card-holder" id="slotHolder${i}">
          <div class="slot-placeholder">
            <i class="fa-solid fa-circle-plus"></i>
            <span>แตะเลือก</span>
          </div>
        </div>
      `;

      slotEl.addEventListener('click', () => {
        fortuneState.currentPickSlot = i;
        updateSlotVisuals();
      });

      pickSlotsContainer.appendChild(slotEl);
    });
  }

  function getDeckBackImage() {
    return 'JiuTianCardImage/93.png';
  }

  function renderFanDeck() {
    if (!deckFanWrapper) return;
    deckFanWrapper.innerHTML = '';

    const winW = window.innerWidth;
    const isMobile = winW < 768;
    const isWidescreen = winW >= 1200;
    const backImg = getDeckBackImage();
    
    // Dynamic card count and width according to screen
    const cardCount = isMobile ? 18 : (isWidescreen ? 34 : 26);
    const cardWidth = isMobile ? 62 : (isWidescreen ? 122 : 108);
    
    // Calculate spread step so cards fill the available width smoothly across desktop or mobile
    const containerWidth = deckFanWrapper.clientWidth || (isMobile ? winW - 32 : Math.min(winW - 64, 1260));
    const maxSpan = Math.max(containerWidth - cardWidth - (isMobile ? 16 : 48), 220);
    const targetStep = isMobile ? 16 : (isWidescreen ? 34 : 28);
    const spreadStep = Math.min(targetStep, Math.floor(maxSpan / (cardCount - 1)));

    for (let i = 0; i < cardCount; i++) {
      const cardEl = document.createElement('div');
      cardEl.className = 'fan-card-item';
      cardEl.style.backgroundImage = `url("${backImg}")`;
      cardEl.setAttribute('data-fan-index', i);

      const xOffset = Math.round((i - (cardCount - 1) / 2) * spreadStep);

      cardEl.style.setProperty('--card-x', `${xOffset}px`);
      cardEl.style.setProperty('--card-y', '0px');
      cardEl.style.setProperty('--card-rot', '0deg');
      cardEl.style.zIndex = i + 1;

      cardEl.addEventListener('click', () => {
        handleFanCardPick(cardEl);
      });

      deckFanWrapper.appendChild(cardEl);
    }
  }

  function handleFanCardPick(cardEl) {
    const totalSlots = fortuneState.drawnCards.length;
    if (fortuneState.currentPickSlot >= totalSlots) return;
    if (cardEl.classList.contains('card-picked')) return;

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
    fortuneState.currentPickSlot = nextSlot !== -1 ? nextSlot : totalSlots;

    updateSlotVisuals();
  }

  function assignCardToSlot(slotIndex, card) {
    fortuneState.drawnCards[slotIndex] = card;
    updateSlotVisuals();

    // Check if all are filled
    const allFilled = fortuneState.drawnCards.every(c => c !== null);
    if (allFilled && revealTriggerBanner) {
      if (revealBannerTitle) {
        revealBannerTitle.textContent = `เลือกไพ่ครบ ${fortuneState.drawnCards.length} ใบเรียบร้อยแล้ว!`;
      }
      revealTriggerBanner.classList.remove('hidden');
      revealTriggerBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function updateSlotVisuals() {
    const positions = getActivePositions();
    const count = positions.length;

    for (let i = 0; i < count; i++) {
      const slotEl = document.getElementById(`slotCard${i}`);
      const holderEl = document.getElementById(`slotHolder${i}`);
      if (!slotEl || !holderEl) continue;

      const card = fortuneState.drawnCards[i];
      if (card) {
        slotEl.classList.add('slot-filled');
        slotEl.classList.remove('active-pick');

        holderEl.innerHTML = `
          <div class="slot-card-wrapper" style="position: relative; width: 100%; height: 100%; border-radius: 10px; overflow: hidden;">
            <img src="${card.image || getDeckBackImage()}" class="slot-filled-card-img" style="width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 10px;" alt="${card.name_th || card.name}" onerror="this.onerror=null; this.src='${card.image_alt || getDeckBackImage()}';">
          </div>
        `;
      } else {
        slotEl.classList.remove('slot-filled');
        if (i === fortuneState.currentPickSlot) {
          slotEl.classList.add('active-pick');
        } else {
          slotEl.classList.remove('active-pick');
        }
        holderEl.innerHTML = `
          <div class="slot-placeholder">
            <i class="fa-solid fa-circle-plus"></i>
            <span>แตะเลือก</span>
          </div>
        `;
      }
    }

    // Update instruction text
    if (pickCurrentInstruction) {
      if (fortuneState.currentPickSlot < count) {
        const pos = positions[fortuneState.currentPickSlot];
        const isMobile = window.innerWidth <= 880;
        const targetLabel = isMobile ? `ใบที่ ${fortuneState.currentPickSlot + 1}: ${pos.shortName || pos.title}` : pos.title;
        pickCurrentInstruction.innerHTML = `
          <i class="fa-solid fa-hand-pointer text-gold animate-bounce"></i> 
          <span>คลิกเลือกไพ่สำหรับ <strong>${targetLabel}</strong></span>
        `;
      } else {
        pickCurrentInstruction.innerHTML = `
          <i class="fa-solid fa-circle-check text-gold"></i> 
          <span>เลือกไพ่ครบทั้ง ${count} ใบเรียบร้อยแล้ว! กดปุ่มทำนายด้านล่างได้เลย ✨</span>
        `;
      }
    }
  }

  // Auto Draw Cards with silky staggered animation
  if (autoDraw3CardsBtn) {
    autoDraw3CardsBtn.addEventListener('click', () => {
      const pool = fortuneState.activeCardsPool;
      if (!pool || pool.length === 0) return;

      const totalSlots = fortuneState.drawnCards.length;
      const fanCards = deckFanWrapper ? Array.from(deckFanWrapper.querySelectorAll('.fan-card-item:not(.card-picked)')) : [];
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      
      let delay = 0;
      for (let i = 0; i < totalSlots; i++) {
        if (fortuneState.drawnCards[i] === null) {
          setTimeout(() => {
            const avail = shuffled.filter(c => !fortuneState.drawnCards.some(dc => dc && dc.id === c.id));
            if (avail.length > 0) {
              const pickCard = avail[0];
              assignCardToSlot(i, pickCard);
              if (fanCards.length > i) {
                fanCards[i].classList.add('card-picked');
              }
            }
            const nextSlot = fortuneState.drawnCards.findIndex(c => c === null);
            fortuneState.currentPickSlot = nextSlot !== -1 ? nextSlot : totalSlots;
            updateSlotVisuals();
          }, delay);
          delay += 160;
        }
      }
    });
  }

  // Shuffle Deck Button with authentic animation
  if (shuffleDeckCardsBtn) {
    shuffleDeckCardsBtn.addEventListener('click', () => {
      if (!deckFanWrapper || deckFanWrapper.classList.contains('is-shuffling')) return;
      deckFanWrapper.classList.add('is-shuffling');
      shuffleDeckCardsBtn.disabled = true;
      const icon = shuffleDeckCardsBtn.querySelector('i');
      if (icon) icon.classList.add('fa-spin');

      setTimeout(() => {
        deckFanWrapper.classList.remove('is-shuffling');
        shuffleDeckCardsBtn.disabled = false;
        if (icon) icon.classList.remove('fa-spin');
        renderFanDeck();
      }, 750);
    });
  }

  // Manual Card Selector Modal
  if (openManualPickerBtn) {
    openManualPickerBtn.addEventListener('click', () => {
      const totalSlots = fortuneState.drawnCards.length;
      openCardSelectModal(fortuneState.currentPickSlot < totalSlots ? fortuneState.currentPickSlot : 0);
    });
  }

  function openCardSelectModal(slotIndex) {
    fortuneState.modalTargetSlot = slotIndex;
    const positions = getActivePositions();
    if (modalPositionName && positions[slotIndex]) {
      modalPositionName.textContent = positions[slotIndex].title;
    }
    if (modalCardSearchInput) modalCardSearchInput.value = '';
    currentModalFilter = 'all';
    if (modalFilterTabs) {
      modalFilterTabs.querySelectorAll('.modal-tab').forEach(t => {
        t.classList.toggle('active', t.getAttribute('data-filter') === 'all');
      });
    }
    renderModalCardGrid('');
    if (cardSelectModal) cardSelectModal.classList.remove('hidden');
  }

  if (closeCardModalBtn && cardSelectModal) {
    closeCardModalBtn.addEventListener('click', () => {
      cardSelectModal.classList.add('hidden');
    });
  }

  if (modalFilterTabs) {
    modalFilterTabs.querySelectorAll('.modal-tab').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        modalFilterTabs.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
        tabBtn.classList.add('active');
        currentModalFilter = tabBtn.getAttribute('data-filter') || 'all';
        const q = modalCardSearchInput ? modalCardSearchInput.value.trim().toLowerCase() : '';
        renderModalCardGrid(q);
      });
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
      // Category / Element Tab filter
      if (currentModalFilter && currentModalFilter !== 'all') {
        if (currentModalFilter === 'major') {
          if (c.type !== 'major' && (c.id < 1 || c.id > 22)) return false;
        } else if (currentModalFilter === 'wood') {
          if (c.element_type !== 'wood' && !(c.element && c.element.includes('ไม้'))) return false;
        } else if (currentModalFilter === 'fire') {
          if (c.element_type !== 'fire' && !(c.element && c.element.includes('ไฟ'))) return false;
        } else if (currentModalFilter === 'earth') {
          if (c.element_type !== 'earth' && !(c.element && c.element.includes('ดิน'))) return false;
        } else if (currentModalFilter === 'metal') {
          if (c.element_type !== 'metal' && !(c.element && c.element.includes('ทอง'))) return false;
        } else if (currentModalFilter === 'water') {
          if (c.element_type !== 'water' && !(c.element && c.element.includes('น้ำ'))) return false;
        } else if (currentModalFilter === 'special') {
          if (c.type !== 'special' && c.id < 93) return false;
        }
      }

      // Search Query filter
      if (query) {
        const matchName = c.name && c.name.toLowerCase().includes(query);
        const matchNameEn = c.name_en && c.name_en.toLowerCase().includes(query);
        const matchNameTh = c.name_th && c.name_th.toLowerCase().includes(query);
        const matchNameCn = c.name_cn && c.name_cn.toLowerCase().includes(query);
        const matchId = String(c.id) === query;
        const matchKeywords = c.keywords && c.keywords.some(k => k.toLowerCase().includes(query));
        const matchKeywordsTh = c.keywords_th && c.keywords_th.some(k => k.toLowerCase().includes(query));
        const matchCore = (c.core_meaning || c.concept) && (c.core_meaning || c.concept).toLowerCase().includes(query);
        const matchElem = c.element && c.element.toLowerCase().includes(query);
        if (!(matchName || matchNameEn || matchNameTh || matchNameCn || matchId || matchKeywords || matchKeywordsTh || matchCore || matchElem)) {
          return false;
        }
      }
      return true;
    });

    filtered.forEach(card => {
      const itemEl = document.createElement('div');
      itemEl.className = 'modal-card-item';

      const metaHtml = `
        <strong style="font-size: 13.5px; color: #1e293b;">${card.id}. ${card.name_cn ? card.name_cn + ' ' : ''}${card.name_th || card.name}</strong>
        <span style="font-size: 11.5px; color: ${card.element_color || '#0284c7'}; margin-top: 3px; font-weight: 600;">
          ${card.element_icon || '🎴'} ${card.element || ''} (${card.suit_name_th || ''})
        </span>
        <span style="font-size: 11px; color: #475569; margin-top: 2px;">
          ✨ ${(card.concept || card.core_meaning || '').slice(0, 48)}${(card.concept || card.core_meaning || '').length > 48 ? '...' : ''}
        </span>
        <span style="font-size: 11px; color: #64748b; margin-top: 2px;">
          🏷️ ${card.keywords_th && card.keywords_th.length ? card.keywords_th.slice(0, 3).join(', ') : (card.keywords ? card.keywords.slice(0, 3).join(', ') : '')}
        </span>
      `;

      itemEl.innerHTML = `
        <div class="modal-card-thumb" style="position: relative;">
          <img src="${card.image || getDeckBackImage()}" alt="${card.name}" onerror="this.onerror=null; this.src='${card.image_alt || getDeckBackImage()}';">
          <span class="modal-card-num-badge">#${card.id}</span>
        </div>
        <div class="modal-card-meta">
          ${metaHtml}
        </div>
      `;

      itemEl.addEventListener('click', () => {
        assignCardToSlot(fortuneState.modalTargetSlot, card);
        if (cardSelectModal) cardSelectModal.classList.add('hidden');
        const totalSlots = fortuneState.drawnCards.length;
        const nextSlot = fortuneState.drawnCards.findIndex(c => c === null);
        fortuneState.currentPickSlot = nextSlot !== -1 ? nextSlot : totalSlots;
        updateSlotVisuals();
      });

      modalCardsGrid.appendChild(itemEl);
    });
  }

  // Reveal Divination Button -> Go to Step 2 (Results)
  if (revealDivinationBtn) {
    revealDivinationBtn.addEventListener('click', () => {
      const totalSlots = fortuneState.drawnCards.length;
      const allFilled = fortuneState.drawnCards.every(c => c !== null);
      if (!allFilled) {
        alert(`กรุณาเลือกไพ่ให้ครบทั้ง ${totalSlots} ใบก่อนกดทำนายครับ`);
        return;
      }
      const q = userQuestionInput ? userQuestionInput.value.trim() : '';
      fortuneState.question = q || 'ภาพรวมดวงชะตา พลังงานชีวิต และคำแนะนำในปัจจุบัน';
      fortuneState.patternId = detectBestPatternForQuestion(fortuneState.question);
      renderDivinationResults();
      setStep(2);
    });
  }

  // --------------------------------------------------------------------------
  // STEP 3: DIVINATION RESULTS & SYNTHESIS CONTROLLER (ไพ่เทพเหมียว)
  // --------------------------------------------------------------------------
  function renderDivinationResults() {
    const drawn = fortuneState.drawnCards;

    // Header info
    if (resultQuestionTitle) {
      resultQuestionTitle.textContent = `“${fortuneState.question}”`;
    }
    if (resultDeckBadge) {
      resultDeckBadge.textContent = 'ไพ่เทพเหมียว (92 ใบ)';
      resultDeckBadge.className = 'badge-deck badge-jiutian';
    }
    if (resultSpreadBadge) {
      resultSpreadBadge.textContent = getActiveSpreadTitle();
    }
    if (resultDateBadge) {
      const now = new Date();
      resultDateBadge.textContent = now.toLocaleDateString('th-TH', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      });
    }

    renderThepMeowResults(drawn);
    if (resultSynthesisContainer) {
      renderThepMeowSynthesis(drawn);
    }
  }

  // Render Revealed Cards for ไพ่เทพเหมียว (Clean Visual Card Deck - No Clutter)
  function renderThepMeowResults(drawn) {
    if (!resultCardsBoard) return;
    resultCardsBoard.innerHTML = '';

    const positions = getActivePositions();
    const count = drawn.length;

    if (count === 5) {
      resultCardsBoard.classList.add('board-5-cards');
    } else {
      resultCardsBoard.classList.remove('board-5-cards');
    }

    drawn.forEach((card, idx) => {
      const pos = positions[idx] || { title: `ใบที่ ${idx + 1}`, shortName: `ใบที่ ${idx + 1}`, desc: '' };
      const cardEl = document.createElement('article');
      cardEl.className = 'result-card-item';

      const baseElem = getBaseElement(card.element);
      const elemInfo = ELEMENT_INFO[baseElem] || { name: baseElem, cn: '', color: '#0284c7', bg: '#f0f9ff', icon: '🎴' };

      cardEl.innerHTML = `
        <div class="result-pos-header">
          <span class="badge-num" style="background: #0284c7;">${idx + 1}</span>
          <h3 class="result-pos-title">${pos.title}</h3>
        </div>
        <div class="result-card-media">
          <img src="${card.image || getDeckBackImage()}" alt="${card.name_th || card.name}" onerror="this.onerror=null; this.src='${card.image_alt || getDeckBackImage()}';">
        </div>
        <div class="result-card-details" style="text-align: center; padding: 4px 6px 10px 6px;">
          <h4 class="result-card-name" style="text-align: center; color: #0f172a; font-size: 18px; font-weight: 800; margin: 4px 0 2px 0; width: 100%;">
            ${card.name_th || card.name} ${card.name_cn ? `<small style="font-size: 13.5px; color: #64748b; font-weight: 600;">(${card.name_cn})</small>` : ''}
          </h4>
          ${card.deity?.title ? `<div style="font-size: 12px; color: #b45309; font-weight: 600; margin-bottom: 6px; line-height: 1.3;">“${card.deity.title}”</div>` : ''}
          <div style="display: flex; justify-content: center;">
            <span class="elem-badge-small" style="background: ${elemInfo.bg}; color: ${elemInfo.color}; border: 1px solid ${elemInfo.border || elemInfo.color}; padding: 3px 12px; border-radius: 20px; font-size: 12px; font-weight: 700;">
              ${elemInfo.icon} ธาตุ${baseElem} ${elemInfo.cn ? `(${elemInfo.cn})` : ''}
            </span>
          </div>
          ${card.deity_message ? `
            <div style="margin-top: 8px; font-size: 11.5px; color: #334155; background: #f8fafc; border-radius: 6px; padding: 6px 8px; border-left: 3px solid #0284c7; text-align: left; line-height: 1.4;">
              <strong style="color: #0284c7;"><i class="fa-solid fa-feather"></i> โอวาท:</strong> ${card.deity_message}
            </div>
          ` : ''}
        </div>
      `;

      resultCardsBoard.appendChild(cardEl);
    });
  }

  // --------------------------------------------------------------------------
  // REDESIGNED 3-LAYER DIVINATION REPORT (EDITORIAL CONSULTATION DOSSIER)
  // 1. ความหมายประจำตำแหน่งและสภาวะของแต่ละใบ (Positional Readings)
  // 2. วิเคราะห์ปฏิสัมพันธ์เบญจธาตุรายคู่ พร้อมไฮไลท์คู่ชี้ขาด (Five Elements)
  // 3. บทสรุปฟันธง & แผนการปฏิบัติเชิงกลยุทธ์ (Synthesis & Action Plan)
  // --------------------------------------------------------------------------
  // Clean raw card text from markdown artifacts and harsh vocabulary
  function cleanThepMeowCardText(text) {
    if (!text) return '';
    return text
      .replace(/\*\*.*?\*\*/g, (m) => m.replace(/\*\*/g, ''))
      .replace(/[\*\#\-]/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/(ยะโส|เล่ห์เหลี่ยม|ทรยศ|เอาแต่ใจ|ก้าวร้าว|ดื้อดึง|ความโลภ|ความดื้อรั้น)/g, 'ความตึงเครียดหรือความเร่งร้อน')
      .trim();
  }

  // Extract core positive wisdom and healing advice from card
  function getThepMeowCardCore(card) {
    if (!card) return 'พลังแห่งการเริ่มต้นใหม่และความหวัง';
    if (card.summary) return cleanThepMeowCardText(card.summary);
    if (card.keywords && card.keywords.length > 0) return card.keywords.slice(0, 3).join(' • ');
    if (card.meanings && card.meanings.light_side) return cleanThepMeowCardText(card.meanings.light_side);
    return cleanThepMeowCardText(card.core_meaning || card.name_th || card.name);
  }

  // Extract gentle caution without harsh words
  function getThepMeowCardCaution(card) {
    if (!card) return 'ค่อยๆ คิด ค่อยๆ ก้าว ไม่ต้องกดดันตัวเอง';
    if (card.meanings && card.meanings.shadow_side) {
      const clean = cleanThepMeowCardText(card.meanings.shadow_side);
      const parts = clean.split(/[.,;\n]/);
      return parts[0]?.trim() || 'อย่าเพิ่งใจร้อนหรือคาดหวังผลลัพธ์เร็วเกินไป';
    }
    if (card.warning) return cleanThepMeowCardText(card.warning);
    return 'ระวังความกังวลใจล่วงหน้าที่จะมาบั่นทอนพลังใจของคุณ';
  }

  // Detect user's question intent
  function detectQuestionIntent(question) {
    const q = (question || '').toLowerCase();
    if (/จะ.*ไหม|จะ.*หรือเปล่า|ผ่านไหม|ได้ไหม|สำเร็จไหม|มีโอกาสไหม|รอดไหม|สมหวังไหม|จะดีไหม/.test(q)) {
      return 'will_it_happen';
    }
    if (/ทำยังไง|อย่างไร|วิธี|แนวทาง|ทางออก|ควรทำ|แก้ไข|เริ่มยังไง|แบบไหนดี/.test(q)) {
      return 'how_to';
    }
    if (/เลือก|อันไหน|ทางไหน|หรือ|ดีกว่า/.test(q)) {
      return 'choices';
    }
    if (/รัก|แฟน|คนคุย|คู่|ความสัมพันธ์|เขาคิด|เลิก|คืนดี|ใจ/.test(q)) {
      return 'relationship';
    }
    if (/งาน|เงิน|บริษัท|สัมภาษณ์|สอบ|ย้าย|ลงทุน|ธุรกิจ|ขาย|เงินทอง|โชคลาภ/.test(q)) {
      return 'career_finance';
    }
    return 'general';
  }

  // 1. Direct Verdict Builder
  function buildThepMeowVerdict({ question, drawn, patternId, intent }) {
    const cardLast = drawn[drawn.length - 1];
    const outcomeName = cardLast ? (cardLast.name_th || cardLast.name) : 'ไพ่แห่งโชคชะตา';
    const outcomeElem = cardLast ? getBaseElement(cardLast.element) : 'ดิน';

    let verdictLead = '';
    let verdictDetail = '';

    if (intent === 'will_it_happen') {
      verdictLead = 'มีแนวโน้มสำเร็จและเปิดทางสว่างสดใสให้คุณอย่างแน่นอนค่ะ';
      verdictDetail = `พลังจากไพ่ <strong>“${outcomeName}”</strong> ชี้ชัดว่าสิ่งที่คุณกำลังตั้งจิตถามเรื่อง <em>'${question}'</em> มีโอกาสสมหวังสูงมาก ขอเพียงรักษาความสม่ำเสมอและก้าวไปด้วยความมั่นใจ รับรองว่าผลลัพธ์ที่รออยู่จะทำให้คุณยิ้มได้กว้างเลยค่ะ เมี๊ยววว~ 🐾✨`;
    } else if (intent === 'how_to') {
      verdictLead = 'กุญแจสำคัญคือการ “วางความกังวลลง แล้วเริ่มจากก้าวเล็กๆ ที่จัดการได้จริงในวันนี้”';
      verdictDetail = `สำหรับคำถาม <em>'${question}'</em> เทพเหมียวมองเห็นว่าทางออกไม่ได้ซับซ้อนเลยค่ะ ไพ่ <strong>“${outcomeName}”</strong> บอกให้คุณปรับสมดุลธาตุ${outcomeElem}ในตัว โฟกัสกับสิ่งที่มีอำนาจตัดสินใจในมือ และอย่าเพิ่งแบกรับเรื่องราวทั้งหมดไว้คนเดียว ค่อยๆ ก้าวทีละสเต็ป จะราบรื่นและคลี่คลายได้สวยงามแน่นอนค่ะ เมี๊ยววว~ 🐾✨`;
    } else if (intent === 'choices') {
      verdictLead = 'เส้นทางที่มีพลังเกื้อหนุนและให้ความสบายใจในระยะยาวคือตัวเลือกที่ดีที่สุด';
      verdictDetail = `ในเรื่อง <em>'${question}'</em> เทพเหมียวอยากให้คุณสังเกตว่าทางไหนที่คิดถึงแล้วรู้สึกโล่งอกและมีพลังใจมากกว่า นั่นคือเสียงนำทางที่แท้จริง ไพ่ <strong>“${outcomeName}”</strong> ยืนยันว่าเมื่อคุณเลือกด้วยความสงบในใจ จะเกิดความมั่นคงและความก้าวหน้าที่ยั่งยืนค่ะ เมี๊ยววว~ 🐾✨`;
    } else if (intent === 'relationship') {
      verdictLead = 'เรื่องของหัวใจกำลังเรียกร้อง “ความเข้าใจและการสื่อสารที่นุ่มนวลจริงใจ”';
      verdictDetail = `พลังงานความสัมพันธ์ในคำถาม <em>'${question}'</em> มีการเชื่อมต่อของคลื่นอารมณ์ที่ลึกซึ้ง ไพ่ <strong>“${outcomeName}”</strong> แนะนำให้ใช้ความอ่อนโยนเป็นสะพานเชื่อม ไม่ต้องเร่งรัดคำตอบหรือจับผิดกัน แล้วความอบอุ่นจะค่อยๆ หวนกลับมาเบ่งบานอีกครั้งค่ะ เมี๊ยววว~ 🐾✨`;
    } else if (intent === 'career_finance') {
      verdictLead = 'จังหวะโอกาสทองกำลังเปิดกว้าง เตรียมตัวให้พร้อมแล้วลงมืออย่างมั่นใจ';
      verdictDetail = `สำหรับเรื่องงานและโอกาสก้าวหน้าใน <em>'${question}'</em> ไพ่ <strong>“${outcomeName}”</strong> ส่งพลังสนับสนุนอย่างเต็มที่ ทุกความพยายามที่สะสมมาจะไม่สูญเปล่า สิ่งสำคัญคือกล้าแสดงศักยภาพของตัวเองออกมา เทพเหมียวเอาใจช่วยสุดตัวเลยค่ะ เมี๊ยววว~ 🐾✨`;
    } else {
      verdictLead = 'สถานการณ์กำลังเปลี่ยนผ่านไปสู่จุดที่คลี่คลายและสบายใจยิ่งขึ้น';
      verdictDetail = `เทพเหมียวสัมผัสได้ถึงความตั้งใจจริงในคำถาม <em>'${question}'</em> ของคุณ ไพ่ <strong>“${outcomeName}”</strong> มอบคำตอบว่าทุกสิ่งที่พบเจอคือจังหวะชีวิตที่กำลังจัดสรรสิ่งดีๆ เข้ามา ขอให้วางใจในตัวเองและก้าวต่อไปอย่างเบิกบานนะคะ เมี๊ยววว~ 🐾✨`;
    }

    return `
      <div class="thepmeow-verdict-box">
        <div class="thepmeow-verdict-top">
          <span class="thepmeow-avatar-badge">
            <i class="fa-solid fa-cat"></i> เทพเหมียวพยากรณ์
          </span>
          <span class="thepmeow-verdict-tag">
            <i class="fa-solid fa-star"></i> คำตอบชัดเจนตรงประเด็น
          </span>
        </div>
        <h3 class="thepmeow-verdict-question">
          “${question}”
        </h3>
        <p class="thepmeow-verdict-speech">
          “เทพเหมียวตั้งจิตอ่านพลังงานให้คุณแล้วนะคะ... <strong>${verdictLead}</strong> ${verdictDetail}”
        </p>
      </div>
    `;
  }

  // 2. Connected Story Stream Builder (The 3-Card Journey)
  function buildThepMeowStoryStream({ question, drawn, patternId, intent, positions }) {
    let stepsHtml = '';

    drawn.forEach((card, idx) => {
      const pos = positions[idx] || { title: `ใบที่ ${idx + 1}`, role: 'INSIGHT' };
      const elem = getBaseElement(card.element);
      const elemInfo = ELEMENT_INFO[elem] || { icon: '🐾', color: '#ec4899', name: elem };
      const cardName = card.name_th || card.name;
      const coreWisdom = getThepMeowCardCore(card);
      const caution = getThepMeowCardCaution(card);
      const stepNum = idx + 1;

      let storyIntro = '';
      let catNote = '';

      if (drawn.length === 3) {
        if (idx === 0) {
          storyIntro = `<strong>จุดเริ่มต้นและรากฐานของเรื่อง:</strong> ไพ่ใบแรกเปิดขึ้นมาด้วยพลังของ <strong>“${cardName}”</strong> (${elemInfo.icon} ธาตุ${elem}) สะท้อนว่าที่ผ่านมาคุณได้สั่งสมประสบการณ์และเผชิญสิ่งต่างๆ มาด้วยความพยายาม สิ่งที่ไพ่บอกคือ <em>${coreWisdom}</em>`;
          catNote = 'เทพเหมียวสัมผัสได้ว่าคุณเก่งมากแล้วนะที่ผ่านมาถึงจุดนี้ได้ เมี๊ยววว~ 🐾';
        } else if (idx === 1) {
          storyIntro = `<strong>สภาวะใจกลางและการประคองสมดุล:</strong> เมื่อมาถึงไพ่ใบที่สอง <strong>“${cardName}”</strong> (${elemInfo.icon} ธาตุ${elem}) ได้เข้ามาบอกจุดโฟกัสสำคัญในตอนนี้ คือ <em>${coreWisdom}</em> โดยข้อควรระวังเบาๆ คือ ${caution}`;
          catNote = 'ตรงนี้ให้ใจเย็นๆ ไม่ต้องเร่งรีบ ค่อยๆ หายใจลึกๆ นะคะ เมี๊ยววว~ 🐾';
        } else {
          storyIntro = `<strong>ปลายทางและทิศทางข้างหน้า:</strong> บทสรุปปิดท้ายด้วยไพ่ <strong>“${cardName}”</strong> (${elemInfo.icon} ธาตุ${elem}) เผยให้เห็นแนวโน้มที่กำลังจะผลิดอกออกผล คือ <em>${coreWisdom}</em> หากคุณประคองใจตามคำแนะนำ ทุกอย่างจะลงตัวอย่างงดงามค่ะ`;
          catNote = 'ปลายทางสดใสรออยู่แน่นอน เชื่อมั่นในตัวเองเข้าไว้นะคะ เมี๊ยววว~ 🐾✨';
        }
      } else {
        storyIntro = `<strong>${pos.title}:</strong> พลังของไพ่ <strong>“${cardName}”</strong> (${elemInfo.icon} ธาตุ${elem}) กำลังสื่อสารกับคุณว่า: ${coreWisdom}`;
        catNote = `เทพเหมียวอยากให้คุณนำพลังธาตุ${elem}นี้มาเสริมความมั่นใจนะคะ เมี๊ยววว~ 🐾`;
      }

      stepsHtml += `
        <div class="thepmeow-step-card step-card-${stepNum}">
          <div class="step-card-header">
            <div class="step-card-pill">
              <span class="step-num-badge">${stepNum}</span>
              <span>${cardName}</span>
              <span style="font-size: 12px; color: ${elemInfo.color}; font-weight: 600;">
                (${elemInfo.icon} ธาตุ${elem})
              </span>
            </div>
            <span class="step-role-label">
              <i class="fa-solid fa-sparkles" style="color: #f59e0b; margin-right: 4px;"></i>${pos.title}
            </span>
          </div>
          <p class="step-card-text">
            ${storyIntro}
          </p>
          <div style="margin-top: 10px; font-size: 13px; color: #ec4899; font-weight: 600; background: #fdf2f8; padding: 6px 12px; border-radius: 10px; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-comment-dots"></i> ${catNote}
          </div>
        </div>
      `;
    });

    return `
      <div class="thepmeow-story-stream">
        <div class="thepmeow-stream-header">
          <h3 class="thepmeow-stream-title">
            <i class="fa-solid fa-compass" style="color: #ec4899;"></i> การเดินทางของคลื่นพลังงาน (Story Journey)
          </h3>
          <p class="thepmeow-stream-sub">
            เทพเหมียวร้อยเรียงเรื่องราวจากไพ่ทั้งสำรับเป็นหนึ่งเดียว เพื่อให้คุณเห็นภาพชัดเจนที่สุด
          </p>
        </div>
        ${stepsHtml}
      </div>
    `;
  }

  // 3. 3 Practical Actions Builder (Mindset, Action, Release)
  function buildThepMeowActions({ question, drawn, intent }) {
    const cardMid = drawn[1] || drawn[0];
    const cardLast = drawn[drawn.length - 1];
    const cautionText = getThepMeowCardCaution(cardMid);
    const coreAction = getThepMeowCardCore(cardLast);

    return `
      <div class="thepmeow-action-box">
        <h3 class="thepmeow-action-heading">
          <i class="fa-solid fa-list-check"></i> 3 สเต็ปฮีลใจและแผนปฏิบัติจริง โดย เทพเหมียว
        </h3>
        <div class="thepmeow-action-items">
          <div class="thepmeow-action-row">
            <div class="action-row-icon icon-mind">
              <i class="fa-solid fa-brain"></i>
            </div>
            <div class="action-row-text">
              <strong>สเต็ปที่ 1: ปรับคลื่นใจให้สงบและเชื่อมั่น (Mindset)</strong><br />
              วางความกังวลในอนาคตที่ยังมาไม่ถึงลงก่อน บอกตัวเองทุกเช้าว่า <em>“ฉันทำดีที่สุดในจุดนี้ และฉันคู่ควรกับสิ่งที่ดีงาม”</em> ไม่เปรียบเทียบตัวเองกับใคร เมี๊ยววว~ 🐾
            </div>
          </div>

          <div class="thepmeow-action-row">
            <div class="action-row-icon icon-act">
              <i class="fa-solid fa-paw"></i>
            </div>
            <div class="action-row-text">
              <strong>สเต็ปที่ 2: เริ่มลงมือทำก้าวเล็กๆ ทันที (Practical Action)</strong><br />
              นำพลังจากไพ่มาขับเคลื่อน: โฟกัสที่ <strong>“${coreAction}”</strong> เริ่มจากสิ่งที่ทำได้ง่ายที่สุด 1 อย่างในวันนี้ ความสม่ำเสมอเพียงเล็กน้อยจะสร้างปาฏิหาริย์ที่ยิ่งใหญ่ค่ะ เมี๊ยววว~ 🐾
            </div>
          </div>

          <div class="thepmeow-action-row">
            <div class="action-row-icon icon-let">
              <i class="fa-solid fa-feather-pointed"></i>
            </div>
            <div class="action-row-text">
              <strong>สเต็ปที่ 3: ปล่อยวางและระวังจุดสะดุด (Release & Care)</strong><br />
              สิ่งที่ควรระวังคือ <strong>“${cautionText}”</strong> อย่ากดดันตัวเองจนตึงเกินไป หากเหนื่อยให้พัก ดื่มน้ำอุ่น กอดน้องแมว หรือทำสิ่งที่ทำให้ยิ้มได้ แล้วค่อยลุยต่อนะคะ เมี๊ยววว~ 🐾
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 4. Empowerment Blessing Builder
  function buildThepMeowBlessing({ question, drawn }) {
    const quotes = [
      '“เมื่อใจของคุณสงบและมั่นคง ทางเดินข้างหน้าจะสว่างไสวเสมอ ขอให้เชื่อมั่นในแสงสว่างในตัวคุณนะคะ”',
      '“ทุกการเดินทางมีจังหวะเวลาที่งดงามเสมอ สิ่งดีๆ กำลังเดินทางมาหาคุณตามเวลาที่เหมาะสมที่สุดค่ะ”',
      '“คุณมีความเข้มแข็งและน่ารักในแบบของตัวเอง อย่าลืมใจดีกับตัวเองให้มากๆ ในทุกๆ วันนะคะ”',
      '“ท้องฟ้าหลังสายฝนสดใสเสมอ และคลื่นลมในใจคุณกำลังจะกลับมาสงบราบรื่นแล้วค่ะ”'
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    return `
      <div class="thepmeow-blessing-card">
        <div class="thepmeow-blessing-badge">
          <i class="fa-solid fa-sparkles"></i> พรเสริมมงคลจากเทพเหมียว
        </div>
        <p class="thepmeow-blessing-quote">
          ${randomQuote}
        </p>
        <p class="thepmeow-blessing-author">
          — ส่งพลังรัก ปัดเป่าความกังวล และส่งอ้อมกอดอุ่นๆ โดย เทพเหมียว เมี๊ยววว~ 🐾💖
        </p>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // MAIN SYNTHESIS DISPATCHER
  // --------------------------------------------------------------------------
  function renderThepMeowSynthesis(drawn) {
    if (!resultSynthesisContainer) return;
    const question = (fortuneState.question || 'สิ่งที่อยู่ในใจ').trim();
    const intent = detectQuestionIntent(question);
    const patternId = fortuneState.patternId || 'pattern1';
    const positions = getActivePositions();

    const verdictHtml = buildThepMeowVerdict({ question, drawn, patternId, intent });
    const storyHtml = buildThepMeowStoryStream({ question, drawn, patternId, intent, positions });
    const actionHtml = buildThepMeowActions({ question, drawn, intent });
    const blessingHtml = buildThepMeowBlessing({ question, drawn });

    resultSynthesisContainer.innerHTML = `
      <div class="thepmeow-dossier">
        <!-- Layer 1: ฟันธงชัดเจน ตอบตรงคำถาม -->
        ${verdictHtml}

        <!-- Layer 2: การเดินทางของไพ่ 3 ใบ (Connected Narrative) -->
        ${storyHtml}

        <!-- Layer 3: 3 สเต็ปฮีลใจและแนวทางปฏิบัติ -->
        ${actionHtml}

        <!-- Layer 4: พรเสริมมงคลจากเทพเหมียว -->
        ${blessingHtml}
      </div>
    `;
  }

  // Render 3 Cards for My Cat & I Oracle
  function renderMyCatResults(drawn) {
    if (!resultCardsBoard) return;
    resultCardsBoard.innerHTML = '';

    drawn.forEach((card, idx) => {
      const pos = POSITIONS[idx];
      const cardEl = document.createElement('article');
      cardEl.className = 'result-card-item';

      let positionMeaning = '';
      const quoteText = card.advice || 'จงเริ่มต้นด้วยใจที่เปิดกว้างและมีสติ';

      if (idx === 0) {
        positionMeaning = `
          <p><strong>สภาวะปัจจุบัน:</strong> ${card.core_meaning}</p>
          <p style="margin-top: 6px; color: #059669;"><strong><i class="fa-solid fa-sun"></i> พลังแสงสว่าง (Light):</strong> ${card.light}</p>
          <p style="margin-top: 4px; color: #d97706;"><strong><i class="fa-solid fa-moon"></i> จุดควรระวัง (Shadow):</strong> ${card.shadow}</p>
        `;
      } else if (idx === 1) {
        positionMeaning = `
          <p><strong>คำแนะนำสำคัญ (Advice):</strong> ${card.advice}</p>
          <p style="margin-top: 6px; color: #059669;"><strong><i class="fa-solid fa-bolt"></i> พลังเกื้อหนุน (Light):</strong> ${card.light}</p>
          <p style="margin-top: 4px; color: #d97706;"><strong><i class="fa-solid fa-shield-halved"></i> สิ่งที่ต้องเลี่ยง (Shadow):</strong> ${card.shadow}</p>
        `;
      } else {
        positionMeaning = `
          <p><strong>แนวโน้มผลลัพธ์:</strong> เมื่อนำคำแนะนำของไพ่ไปปรับใช้ สถานการณ์จะพัฒนาไปสู่ความสำเร็จ <em>“${card.light}”</em></p>
          <p style="margin-top: 6px;"><strong>แก่นสาระสำคัญ:</strong> ${card.core_meaning}</p>
        `;
      }

      cardEl.innerHTML = `
        <div class="result-pos-header">
          <span class="badge-num">${idx + 1}</span>
          <h3 class="result-pos-title">${pos.title}</h3>
        </div>
        <div class="result-card-media cat-card-frame">
          <img src="${card.image || getDeckBackImage()}" alt="${card.name}" onerror="this.onerror=null; this.src='${getDeckBackImage()}';">
          <div class="card-front-overlay">
            <div class="overlay-card-num">No. ${String(card.id).padStart(2, '0')}</div>
            <div class="overlay-card-name-en">${card.name_en || ''}</div>
            <div class="overlay-card-name-th">${card.name_th || ''}</div>
          </div>
        </div>
        <div class="result-card-details">
          <h4 class="result-card-name">${card.id}. ${card.name_en} (${card.name_th})</h4>
          <div class="result-tag-row">
            <span class="result-tag"><i class="fa-solid fa-cat"></i> My Cat &amp; I</span>
            ${card.keywords_th ? card.keywords_th.slice(0, 3).map(kw => `<span class="result-tag">${kw}</span>`).join('') : ''}
          </div>
          <div class="result-pos-meaning">
            ${positionMeaning}
          </div>
          <div class="result-card-quote">
            <i class="fa-solid fa-quote-left"></i>
            <span>“${quoteText}”</span>
          </div>
        </div>
      `;

      resultCardsBoard.appendChild(cardEl);
    });
  }

  function renderMyCatSynthesis(drawn) {
    const card1 = drawn[0];
    const card2 = drawn[1];
    const card3 = drawn[2];

    resultSynthesisContainer.innerHTML = `
      <div class="synthesis-header-block">
        <div class="synthesis-header-icon cat-theme">
          <i class="fa-solid fa-cat"></i>
        </div>
        <div>
          <h3 class="synthesis-title">🐱 บทสังเคราะห์คำทำนาย My Cat &amp; I Oracle (61 Cards)</h3>
          <p class="synthesis-sub">ร้อยเรียงแก่นความหมาย แสงสว่าง (Light) ด้านเงา (Shadow) และคำแนะนำ (Advice) เพื่อคำตอบที่ชัดเจนและนำไปใช้ได้จริง</p>
        </div>
      </div>

      <div class="synthesis-cards-grid">
        <!-- Box 1: Energy Journey -->
        <div class="synthesis-card-box theme-cat">
          <h4 class="synthesis-box-title text-cat"><i class="fa-solid fa-route"></i> เส้นทางพลังงานชีวิต (Energy Journey)</h4>
          <div class="synthesis-box-body">
            <p style="margin-bottom: 8px;">
              <strong>การเชื่อมโยง:</strong> 
              <span class="badge-cat" style="font-size: 11px; padding: 2px 8px; border-radius: 10px;">${card1.name_th}</span> &rarr; 
              <span class="badge-cat" style="font-size: 11px; padding: 2px 8px; border-radius: 10px;">${card2.name_th}</span> &rarr; 
              <span class="badge-cat" style="font-size: 11px; padding: 2px 8px; border-radius: 10px;">${card3.name_th}</span>
            </p>
            <p>
              จากสถานการณ์ปัจจุบันที่สะท้อนถึง <em>“${card1.core_meaning}”</em> เมื่อคุณปรับกลยุทธ์ตามคำแนะนำ <em>“${card2.advice}”</em> จะช่วยปลดล็อกพลังงานด้านบวกและนำพาชีวิตไปสู่ <em>“${card3.light}”</em> ได้อย่างราบรื่น
            </p>
          </div>
        </div>

        <!-- Box 2: Key Breakthrough -->
        <div class="synthesis-card-box theme-cat">
          <h4 class="synthesis-box-title text-cat"><i class="fa-solid fa-key"></i> กุญแจสำคัญสู่การปลดล็อก (Key Breakthrough)</h4>
          <div class="synthesis-box-body">
            <p>
              หัวใจสำคัญในการรับมือกับเรื่องนี้อยู่ที่ไพ่ใบที่ 2 <strong>${card2.name}</strong>: 
              ให้มุ่งเน้น <strong>“${card2.advice}”</strong> พร้อมระวังกับดักด้านเงาคือ <em>“${card2.shadow}”</em> อย่าด่วนตัดสินใจด้วยความกังวล
            </p>
          </div>
        </div>

        <!-- Box 3: Oracle Wisdom & 3 Blessings -->
        <div class="synthesis-card-box theme-cat" style="grid-column: 1 / -1;">
          <h4 class="synthesis-box-title text-cat"><i class="fa-solid fa-heart"></i> โอวาทและข้อคิดเตือนใจ (My Cat &amp; I Wisdom)</h4>
          <ul style="margin: 8px 0 0 18px; font-size: 13.5px; line-height: 1.8; color: var(--color-text);">
            <li><strong>${card1.name_en} (${card1.name_th}):</strong> “${card1.advice}” — น้อมรับความจริงและพลังเกื้อหนุน: ${card1.light}</li>
            <li><strong>${card2.name_en} (${card2.name_th}):</strong> “${card2.advice}” — วางแผนรอบคอบ หลีกเลี่ยง: ${card2.shadow}</li>
            <li><strong>${card3.name_en} (${card3.name_th}):</strong> “${card3.advice}” — ผลลัพธ์แห่งความสำเร็จและความสุข: ${card3.light}</li>
          </ul>
        </div>
      </div>
    `;
  }

  // Results Action Buttons
  if (newReadingBtn) {
    newReadingBtn.addEventListener('click', () => {
      resetPicks();
      if (userQuestionInput) {
        userQuestionInput.value = '';
        userQuestionInput.focus();
      }
      fortuneState.question = '';
      fortuneState.patternId = 'pattern2';
      setStep(1);
      renderFanDeck();
      renderPickSlots();
      updateSlotVisuals();
    });
  }

  if (redrawCurrentCardsBtn) {
    redrawCurrentCardsBtn.addEventListener('click', () => {
      resetPicks();
      setStep(1);
      renderFanDeck();
      renderPickSlots();
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
      const drawn = fortuneState.drawnCards;
      const positions = getActivePositions();
      const spreadTitle = getActiveSpreadTitle();
      const isPattern4 = fortuneState.spreadType === '3cards' && fortuneState.patternId === 'pattern4';
      const is5Cards = drawn.length === 5;
      const { choiceA, choiceB } = parseQuestionChoices(fortuneState.question);

      let text = `🔮 === ผลคำทำนายไพ่: ไพ่เทพเหมียว (92 ใบ) ===\n`;
      text += `❓ คำถาม: ${fortuneState.question}\n`;
      text += `🎴 รูปแบบการอ่าน: ${spreadTitle}\n`;
      text += `📅 วันที่ทำนาย: ${new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}\n\n`;

      text += `🐱 【ชั้นที่ 1: ความหมายประจำตำแหน่ง & สภาวะของแต่ละใบ】\n`;
      drawn.forEach((c, idx) => {
        const pos = positions[idx] || { title: `ใบที่ ${idx + 1}` };
        const baseElem = getBaseElement(c.element);
        text += `• ${pos.title}: ไพ่ "${c.name_th || c.name}" (ธาตุ${baseElem})\n`;
        if (isPattern4) {
          if (idx === 0) {
            text += `  - สภาวะหากเลือก "${choiceA}": ${c.concept || c.core_meaning || ''}\n`;
            text += `  - จุดที่ต้องพิจารณา: ${getCardConsideration(c, choiceA, baseElem)}\n`;
          } else if (idx === 1) {
            text += `  - สภาวะหากเลือก "${choiceB}": ${c.concept || c.core_meaning || ''}\n`;
            text += `  - จุดที่ต้องพิจารณา: ${getCardConsideration(c, choiceB, baseElem)}\n`;
          } else {
            text += `  - คำชี้แนะจากปัญญาญาณ: ${getCardWisdomGuidance(c)}\n`;
            text += `  - แก่นธรรมประจำใบ: ${c.concept || c.core_meaning || ''}\n`;
          }
        } else {
          text += `  - แก่นสาระประจำใบ: ${c.concept || c.core_meaning || ''}\n`;
          if (c.advice) text += `  - คำแนะนำ/กลยุทธ์: ${c.advice}\n`;
        }
        text += `\n`;
      });

      text += `⚡ 【ชั้นที่ 2: วิเคราะห์ปฏิสัมพันธ์เบญจธาตุ (Five Elements Relations)】\n`;
      if (isPattern4) {
        const elemA = getBaseElement(drawn[0].element);
        const elemB = getBaseElement(drawn[1].element);
        const advElem = getBaseElement(drawn[2].element);
        const relAB = getElementRelation(drawn[0].element, drawn[1].element);
        const relBAdv = getElementRelation(drawn[2].element, drawn[1].element);
        const relAAdv = getElementRelation(drawn[0].element, drawn[2].element);

        text += `1) คู่ที่ 1: ตัวเลือก A (${choiceA}: ${drawn[0].name_th}) ↔ ตัวเลือก B (${choiceB}: ${drawn[1].name_th})\n`;
        text += `   - ความสัมพันธ์: ${relAB.typeTh} (${relAB.headline})\n\n`;

        text += `2) ✨ คู่ที่ 2 (จุดชี้ขาด): ตัวเลือก B (${choiceB}: ${drawn[1].name_th}) ↔ คำแนะนำ (${drawn[2].name_th})\n`;
        text += `   - ความสัมพันธ์: ${relBAdv.typeTh} (${relBAdv.headline})\n`;
        if (GENERATING_MAP[advElem] && GENERATING_MAP[advElem].target === elemB) {
          text += `   - คำแนะนำ (${advElem}) ส่งเสริมตัวเลือก B (${elemB}) โดยตรง (相生)! ปัญหาแก้ไขได้ด้วยพลังคำแนะนำ\n\n`;
        } else {
          text += `   - วิเคราะห์ความสอดคล้องระหว่างคำแนะนำกับตัวเลือก B\n\n`;
        }

        text += `3) คู่ที่ 3: ตัวเลือก A (${choiceA}: ${drawn[0].name_th}) ↔ คำแนะนำ (${drawn[2].name_th})\n`;
        text += `   - ความสัมพันธ์: ${relAAdv.typeTh} (${relAAdv.headline})\n\n`;
      } else {
        text += `สายธารพลังงานธาตุ: ${drawn.map(c => `${c.name_th} (${getBaseElement(c.element)})`).join(' → ')}\n\n`;
      }

      text += `💡 【ชั้นที่ 3: บทสรุปฟันธง & แผนการปฏิบัติเชิงกลยุทธ์】\n`;
      if (isPattern4) {
        const elemA = getBaseElement(drawn[0].element);
        const elemB = getBaseElement(drawn[1].element);
        const advElem = getBaseElement(drawn[2].element);
        const adviceSupportsB = GENERATING_MAP[advElem] && GENERATING_MAP[advElem].target === elemB;
        if (adviceSupportsB) {
          text += `• บทสรุปฟันธง: พลังคำแนะนำ “${drawn[2].name_th} (${advElem})” ส่งเสริมทางเลือก “${choiceB} (${drawn[1].name_th} - ${elemB})” โดยตรง (相生) ชี้ชัดว่าภาระงานแก้ไขได้ด้วยการปรับวิธีทำงาน\n`;
          text += `• 1. แนวทางที่ดีที่สุดในตอนนี้: อยู่ต่อ/เลือก ${choiceB} แต่ต้อง "กระจายภาระ" อย่าแบกคนเดียว ใช้พลังร่วมมือประสานใจ\n`;
          text += `• 2. ข้อพิจารณาสำรอง: หากต้องเลือก ${choiceA} อย่ากักตัวอยู่เฉยๆ ให้ใช้พลังคำแนะนำมองหาทีมสนับสนุนและคอนเนกชันใหม่\n\n`;
        }
      }
      text += `📜 【กฎทอง 6 ประการของสำรับไพ่เทพเหมียว】\n`;
      text += `1. ยึดความหมายไพ่ตามคู่มือเป็นแกนหลัก\n`;
      text += `2. ระบบธาตุเป็นเครื่องมือวิเคราะห์แรงส่ง\n`;
      text += `3. ธาตุเกื้อหนุน (相生) ไม่ได้รับประกันผลดีเสมอไป\n`;
      text += `4. ธาตุควบคุม (相克) ไม่ได้รับประกันผลเสียเสมอไป\n`;
      text += `5. ไพ่เปรียบเทียบทางเลือก ชี้ให้เห็นผลลัพธ์ของแต่ละเส้นทาง\n`;
      text += `6. ไพ่คำแนะนำเป็นเสมือนเข็มทิศชี้ทางเพื่อการตัดสินใจอย่างมีสติสัมปชัญญะ\n`;

      navigator.clipboard.writeText(text).then(() => {
        alert('คัดลอกข้อความบทวิเคราะห์ 3 ชั้น ลง Clipboard เรียบร้อยแล้ว!');
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
  if (document.getElementById('cardList')) {
    initApp();
  }
  // Set default view to Tarot Reading App Step 1 (Question Input + Cards Fan + 3 Slots)
  fortuneState.spreadType = '3cards';
  fortuneState.drawnCards = [null, null, null];
  fortuneState.activeCardsPool = getActiveCardsPool();
  setStep(1);
  renderFanDeck();
  renderPickSlots();
  updateSlotVisuals();
});


  // --------------------------------------------------------------------------
  // LINE LIFF INTEGRATION (LINE Official Account)
  // --------------------------------------------------------------------------
  const LIFF_ID = '2011798499-hm8dJi7C';
  let lineUserProfile = null;

  async function initLineLiff() {
    if (typeof liff === 'undefined') {
      console.log('LIFF SDK not loaded or offline');
      return;
    }

    try {
      await liff.init({ liffId: LIFF_ID });
      console.log('LIFF initialized successfully');

      if (liff.isLoggedIn()) {
        lineUserProfile = await liff.getProfile();
        applyLineUserProfile(lineUserProfile);
      } else if (liff.isInClient()) {
        lineUserProfile = await liff.getProfile();
        applyLineUserProfile(lineUserProfile);
      }

      // Show Line Share button
      const shareBtn = document.getElementById('shareToLineBtn');
      if (shareBtn) {
        shareBtn.classList.remove('hidden');
      }
    } catch (err) {
      console.log('LIFF init info:', err);
    }
  }

  function applyLineUserProfile(profile) {
    if (!profile) return;
    const badgeEl = document.getElementById('lineUserBadge');
    const avatarEl = document.getElementById('lineUserAvatar');
    const nameEl = document.getElementById('lineUserName');

    if (badgeEl && nameEl) {
      nameEl.textContent = profile.displayName || 'LINE User';
      if (avatarEl && profile.pictureUrl) {
        avatarEl.src = profile.pictureUrl;
      }
      badgeEl.classList.remove('hidden');
    }

    // Friendly greeting on question step
    const step1Title = document.querySelector('.step1-title');
    if (step1Title && profile.displayName) {
      step1Title.innerHTML = `สวัสดีคุณ ${profile.displayName} ✨ ไพ่ My Cat & I พร้อมตอบ 🔮`;
    }
  }

  const shareToLineBtn = document.getElementById('shareToLineBtn');
  if (shareToLineBtn) {
    shareToLineBtn.addEventListener('click', shareResultToLine);
  }

  async function shareResultToLine() {
    const question = fortuneState.question || 'คำถามดวงชะตา';
    const deckName = 'My Cat & I Oracle (61 ใบ)';
    const cards = fortuneState.drawnCards;
    
    const card1Name = cards[0] ? cards[0].name : '';
    const card2Name = cards[1] ? cards[1].name : '';
    const card3Name = cards[2] ? cards[2].name : '';

    const shareText = `🔮 ผลทำนายไพ่: ${deckName}
💬 คำถาม: "${question}"

1️⃣ ปัจจุบัน: ${card1Name}
2️⃣ กลยุทธ์/ทางออก: ${card2Name}
3️⃣ บทสรุป: ${card3Name}

✨ เปิดไพ่ดูดวงด้วยตัวเองได้ที่:
https://liff.line.me/2011798499-hm8dJi7C`;

    if (typeof liff !== 'undefined' && liff.isLoggedIn()) {
      try {
        if (liff.isApiAvailable('shareTargetPicker')) {
          const res = await liff.shareTargetPicker([
            { type: 'text', text: shareText }
          ]);
          if (res) {
            alert('แชร์ผลทำนายเรียบร้อยแล้วครับ! 💬✨');
          }
          return;
        } else if (liff.isInClient()) {
          await liff.sendMessages([
            { type: 'text', text: shareText }
          ]);
          alert('ส่งผลทำนายเข้าห้องแชท LINE เรียบร้อยแล้วครับ! 💬✨');
          return;
        }
      } catch (err) {
        console.log('LINE share error:', err);
      }
    }

    // Fallback: Copy to clipboard
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      alert('คัดลอกข้อความผลทำนายแล้ว สามารถกดวาง (Paste) ส่งให้เพื่อนใน LINE ได้เลยครับ! 💬✨');
    }
  }

  // Auto initialize LIFF on startup
  setTimeout(initLineLiff, 500);

  // Responsive fan deck re-render on orientation change or window resize
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (fortuneState.step === 2) {
        renderFanDeck();
      }
    }, 250);
  });
