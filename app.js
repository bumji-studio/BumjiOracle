// Jiu Tian Arcana - App Logic

document.addEventListener('DOMContentLoaded', () => {
  // 1. Core State
  let cards = [];
  let activeCardId = 1;
  const borderStyleKey = 'jiutian_border_style';

  // DOM Elements
  const cardList = document.getElementById('cardList');
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

  // ==========================================================================
  // 15. FORTUNE TELLING APP MODULE (4-STEP TAROT DIVINATION)
  // Collections: JiuTian Arcana (96 Chinese Deity Cards) & Bumji & The Gang (Cute Cat Cards)
  // ==========================================================================

  // Tab Switcher DOM
  const tabReadingBtn = document.getElementById('tabReadingBtn');
  const tabStudioBtn = document.getElementById('tabStudioBtn');
  const studioAppView = document.getElementById('studioAppView');
  const readingAppView = document.getElementById('readingAppView');
  const studioHeaderActions = document.getElementById('studioHeaderActions');

  if (tabReadingBtn && tabStudioBtn) {
    tabReadingBtn.addEventListener('click', () => {
      tabReadingBtn.classList.add('active');
      tabStudioBtn.classList.remove('active');
      readingAppView.classList.remove('hidden');
      studioAppView.classList.add('hidden');
      if (studioHeaderActions) studioHeaderActions.classList.add('hidden');
    });

    tabStudioBtn.addEventListener('click', () => {
      tabStudioBtn.classList.add('active');
      tabReadingBtn.classList.remove('active');
      studioAppView.classList.remove('hidden');
      readingAppView.classList.add('hidden');
      if (studioHeaderActions) studioHeaderActions.classList.remove('hidden');
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
      stepperFill.style.width = `${fillPercents[targetStep - 1]}%`;
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
      cardEl.style.backgroundImage = `url("${backImg}")`;
      cardEl.setAttribute('data-fan-index', i);

      const angle = Math.round((startAngle + i * angleStep) * 10) / 10;
      const xOffset = Math.round((i - cardCount / 2) * spreadStep);
      const yOffset = Math.round(Math.abs(angle) * (isMobile ? 0.9 : 1.5));

      // Set CSS Custom Properties for silky-smooth hardware-accelerated transforms
      cardEl.style.setProperty('--card-x', `${xOffset}px`);
      cardEl.style.setProperty('--card-y', `${yOffset}px`);
      cardEl.style.setProperty('--card-rot', `${angle}deg`);
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
      const slotEl = document.getElementById(`slotCard${i}`);
      const holderEl = document.getElementById(`slotHolder${i}`);
      if (!slotEl || !holderEl) continue;

      const card = fortuneState.drawnCards[i];
      if (card) {
        slotEl.classList.add('slot-filled');
        slotEl.classList.remove('active-pick');
        holderEl.innerHTML = `
          <img src="${card.image || getDeckBackImage()}" class="slot-filled-card-img" alt="${card.name}" onerror="this.src='${getDeckBackImage()}'">
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
            <span>คลิกเลือกไพ่ใบที่ ${i + 1}</span>
          </div>
        `;
      }
    }

    // Update instruction text
    if (pickCurrentInstruction) {
      if (fortuneState.currentPickSlot < 3) {
        const pos = POSITIONS[fortuneState.currentPickSlot];
        pickCurrentInstruction.innerHTML = `
          <i class="fa-solid fa-arrow-down-long text-gold animate-bounce"></i> 
          <span>คลิกเลือกไพ่จากสำรับด้านล่างสำหรับ <strong>${pos.title}</strong></span>
        `;
      } else {
        pickCurrentInstruction.innerHTML = `
          <i class="fa-solid fa-circle-check text-gold"></i> 
          <span>เลือกไพ่ครบทั้ง 3 ใบเรียบร้อยแล้ว! กดปุ่มทำนายด้านล่างได้เลย</span>
        `;
      }
    }
  }

  // Auto Draw 3 Cards with silky staggered animation
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
      itemEl.innerHTML = `
        <div class="modal-card-thumb">
          <img src="${card.image || getDeckBackImage()}" alt="${card.name}" onerror="this.src='${getDeckBackImage()}'">
        </div>
        <div class="modal-card-meta">
          <strong>#${card.id} - ${card.name}</strong>
          <span>${card.element || card.character || ''}</span>
        </div>
      `;

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
      resultQuestionTitle.textContent = `“${fortuneState.question}”`;
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
            positionMeaning = `<strong>สภาวะปัจจุบัน:</strong> ${card.general_meaning || 'พลังงานเปิดกว้างสะท้อนถึงจุดเริ่มต้นและการตระหนักรู้ในตนเอง'} สื่อถึงสถานการณ์ที่กำลังก่อตัวขึ้นรอบตัวคุณ`;
            quoteText = card.advice || 'ผู้ที่มีสติและรู้จักรอ ย่อมมองเห็นสัจธรรม';
          } else if (idx === 1) {
            positionMeaning = `<strong>กลยุทธ์ & แนวทางปฏิบัติ:</strong> ${card.work_meaning || 'จงใช้ความสุขุม ความละเอียดรอบคอบ และจัดสรรกำลังให้สมดุล'} เป็นกุญแจสำคัญในการคลี่คลายอุปสรรค`;
            quoteText = card.advice || 'ไม่ฝืนกระแสธรรมชาติ แต่รู้จักโอนอ่อนผ่อนตามอย่างมีปัญญา';
          } else {
            positionMeaning = `<strong>บทสรุป & ผลลัพธ์:</strong> ${card.love_meaning || 'ชัยชนะและความสำเร็จจะเกิดขึ้นจากรากฐานที่มั่นคง'} พลังของเทพประจำไพ่ชี้ว่าผลลัพธ์จะนำมาซึ่งความเจริญก้าวหน้า`;
            quoteText = card.advice || 'เมื่อปัญญาและวาสนามาบรรจบ ผลลัพธ์ย่อมงดงามเสมอ';
          }
        } else {
          // Bumji Deck
          if (idx === 0) {
            positionMeaning = `<strong>พฤติกรรมสะท้อนปัจจุบัน:</strong> ${card.behavior || 'นอนนิ่งสังเกตการณ์'} — ${card.general_meaning || 'พักใจสบายๆ ไม่ต้องเร่งรีบ'}`;
            quoteText = card.cat_wisdom || 'ความสุขไม่ต้องซับซ้อน ได้งีบสักตื่นโลกก็น่ารักขึ้นแล้ว!';
          } else if (idx === 1) {
            positionMeaning = `<strong>คำแนะนำฉบับแมวๆ:</strong> ${card.work_meaning || 'โฟกัสสิ่งที่ถนัดและเซฟโซนของตัวเอง'} ${card.behavior ? `(ทำตัวเหมือนตอน ${card.behavior})` : ''}`;
            quoteText = card.cat_wisdom || 'ถ้าโลกวุ่นวายนัก ก็นอนขดเป็นก้อนขนมปังแล้วรอจังหวะใหม่';
          } else {
            positionMeaning = `<strong>บทสรุปนุ่มฟู:</strong> ${card.love_meaning || 'ความสัมพันธ์และเรื่องราวจะลงเอยอย่างอบอุ่นใจ'} คุณจะได้รับรอยยิ้มและความสบายใจกลับคืนมา`;
            quoteText = card.cat_wisdom || 'ยิ้มเข้าไว้ มีขนมแมวเลีย มีคนที่รักเรา แค่นี้ก็ชนะแล้ว!';
          }
        }

        const tagText = isJiuTian 
          ? (card.element || 'พลังจักรวาล') 
          : (card.character || 'น้องแมวแก๊งบุ๋มจิ');

        cardEl.innerHTML = `
          <div class="result-pos-header">
            <span class="badge-num">${idx + 1}</span>
            <h3 class="result-pos-title">${pos.title}</h3>
          </div>
          <div class="result-card-media">
            <img src="${card.image || getDeckBackImage()}" alt="${card.name}" onerror="this.src='${getDeckBackImage()}'">
          </div>
          <div class="result-card-details">
            <h4 class="result-card-name">${card.name}</h4>
            <div class="result-tag-row">
              <span class="result-tag"><i class="fa-solid fa-tag"></i> ${tagText}</span>
              ${card.keywords ? card.keywords.slice(0, 2).map(kw => `<span class="result-tag">${kw}</span>`).join('') : ''}
            </div>
            <div class="result-pos-meaning">
              ${positionMeaning}
            </div>
            <div class="result-card-quote">
              <i class="fa-solid fa-quote-left"></i>
              <span>${quoteText}</span>
            </div>
          </div>
        `;

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

    resultSynthesisContainer.innerHTML = `
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
            <p style="margin-bottom: 8px;"><strong>สายธารพลังงาน:</strong> ${elementsList}</p>
            <p>
              การผสานพลังของ <strong>${card1.name}</strong> สู่ <strong>${card2.name}</strong> และสิ้นสุดที่ <strong>${card3.name}</strong> บ่งบอกถึงจังหวะชีวิตที่กำลังเปลี่ยนผ่านจากสภาวะแห่งการตื่นรู้ สู่การลงมือปฏิบัติด้วยปัญญาเต๋า ธาตุของไพ่ชุดนี้ส่งเสริมให้คุณใช้ความนิ่งสยบความเคลื่อนไหว และมองทะลุภาพลวงตาตรงหน้า
            </p>
          </div>
        </div>

        <!-- Box 2: Strategic Action -->
        <div class="synthesis-card-box">
          <h4 class="synthesis-box-title"><i class="fa-solid fa-chess-knight"></i> กลยุทธ์พิชัยยุทธ์เพื่อความสำเร็จ</h4>
          <div class="synthesis-box-body">
            <p>
              คำตอบสำหรับคำถามของคุณคือ <strong>“อย่าเร่งรัดผลลัพธ์ แต่จงวางโครงสร้างให้แข็งแกร่ง”</strong> ในจุดที่เป็นกลยุทธ์ (${card2.name}) แนะนำให้คุณจัดลำดับความสำคัญ รักษาความสัมพันธ์ที่ดีกับคนรอบตัว และไม่ประมาทกับรายละเอียดเล็กๆ ชัยชนะที่ยั่งยืนเกิดจากคุณธรรมและความอดทน
            </p>
          </div>
        </div>

        <!-- Box 3: Divine Deities Blessings -->
        <div class="synthesis-card-box" style="grid-column: 1 / -1;">
          <h4 class="synthesis-box-title"><i class="fa-solid fa-scroll"></i> โอวาทและพรอันประเสริฐจากทวยเทพทั้งสามองค์</h4>
          <ul style="margin: 8px 0 0 18px; font-size: 13.5px; line-height: 1.8; color: var(--color-text);">
            <li><strong>${card1.name}:</strong> “${card1.advice || 'จงเริ่มต้นด้วยใจที่บริสุทธิ์และปราศจากอคติ'}”</li>
            <li><strong>${card2.name}:</strong> “${card2.advice || 'ปัญญาที่แท้จริงคือการรู้ว่าเมื่อใดควรเดินหน้าและเมื่อใดควรหยุดยั้ง'}”</li>
            <li><strong>${card3.name}:</strong> “${card3.advice || 'ความสำเร็จอันยิ่งใหญ่ย่อมเป็นของผู้อดทนและยึดมั่นในสัจจะ'}”</li>
          </ul>
        </div>
      </div>
    `;
  }

  function renderBumjiSynthesis(drawn) {
    const card1 = drawn[0];
    const card2 = drawn[1];
    const card3 = drawn[2];

    resultSynthesisContainer.innerHTML = `
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
              แก๊งแมวบุ๋มจิบอกว่า สถานการณ์ที่คุณกำลังเจอนั้นเหมือนแมวที่กำลัง <em>${card1.behavior || 'นอนสังเกตการณ์'}</em> แล้วค่อยๆ ขยับตัวไป <em>${card2.behavior || 'หามุมสบายใจ'}</em> จนสุดท้ายได้ <em>${card3.behavior || 'กินขนมอย่างมีความสุข'}</em> 
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
              คำแนะนำจาก <strong>${card2.name}</strong> คือให้คุณรักตัวเอง ดูแลความรู้สึกตัวเองเป็นที่ตั้ง อย่ายอมให้ใครมาแย่งความสุขสงบในใจไปได้
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
    `;
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

      let text = `🔮 === คำทำนายไพ่ศักดิ์สิทธิ์: ${deckName} ===\n`;
      text += `❓ คำถาม: ${fortuneState.question}\n`;
      text += `📅 วันที่ทำนาย: ${new Date().toLocaleDateString('th-TH')}\n\n`;

      drawn.forEach((c, idx) => {
        const pos = POSITIONS[idx];
        text += `[${pos.title}]\n`;
        text += `ไพ่: ${c.name} (${c.element || c.character || ''})\n`;
        text += `ความหมาย: ${c.general_meaning || ''}\n`;
        if (c.advice) text += `คำสอน/คำแนะนำ: ${c.advice}\n`;
        if (c.cat_wisdom) text += `ข้อคิดแมวๆ: ${c.cat_wisdom}\n`;
        text += `\n`;
      });

      text += `✨ ขอให้ดวงชะตาและพลังงานแห่งความสุขโอบกอดคุณเสมอ! ✨\n`;

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
      step1Title.innerHTML = `สวัสดีคุณ ${profile.displayName} ✨ จักรวาลพร้อมตอบ 🔮`;
    }
  }

  const shareToLineBtn = document.getElementById('shareToLineBtn');
  if (shareToLineBtn) {
    shareToLineBtn.addEventListener('click', shareResultToLine);
  }

  async function shareResultToLine() {
    const question = fortuneState.question || 'คำถามดวงชะตา';
    const isJiuTian = fortuneState.deckId === 'jiutian';
    const deckName = isJiuTian ? 'JiuTian Arcana (ไพ่เทพจีน)' : 'Bumji & The Gang (แก๊งบุ๋มจิ)';
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
      if (fortuneState.step === 3) {
        renderFanDeck();
      }
    }, 250);
  });
