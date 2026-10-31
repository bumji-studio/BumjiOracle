/**
 * ============================================================================
 * แม่หมอติ๊ดติ๊ด (DESTINY ARCANA) - 60 JIA ZI & CAT ARCHETYPE ENGINE
 * Flow: 60 Jia Zi Day Pillar -> 5 Structures Spider Chart -> 10 Profiles % -> Cat Archetype Mapping
 * ============================================================================
 */

(function () {
  'use strict';

  const PersonalityApp = {
    currentProfile: null,
    currentChart: null,
    currentCatData: null,

    init: function () {
      this.bindEvents();
      this.populateArchetypeDropdown();
      console.log('[PersonalityApp] Initialized with 60 Jia Zi & Cat Archetype Flow.');
    },

    bindEvents: function () {
      const calcBtn = document.getElementById('personalityCalcBtn');
      if (calcBtn) {
        calcBtn.addEventListener('click', () => this.calculateFromInputs());
      }

      const useMyProfileBtn = document.getElementById('personalityUseMyProfileBtn');
      if (useMyProfileBtn) {
        useMyProfileBtn.addEventListener('click', () => this.fillFromCurrentUser());
      }

      const archetypeSelect = document.getElementById('personalityArchetypeSelect');
      if (archetypeSelect) {
        archetypeSelect.addEventListener('change', (e) => {
          const val = e.target.value;
          if (val) {
            this.showDirectArchetype(val);
          }
        });
      }

      // Hybrid Date Picker (Text input for typing on mobile + Icon button for native calendar)
      const dateInput = document.getElementById('personalityBirthDate');
      const pickerBtn = document.getElementById('personalityDatePickerBtn');
      const hiddenPicker = document.getElementById('personalityHiddenDatePicker');

      if (pickerBtn && hiddenPicker) {
        pickerBtn.addEventListener('click', () => {
          if (dateInput && dateInput.value) {
            const norm = this.normalizeDateString(dateInput.value);
            if (/^\d{4}-\d{2}-\d{2}$/.test(norm)) {
              hiddenPicker.value = norm;
            }
          }
          if (typeof hiddenPicker.showPicker === 'function') {
            try {
              hiddenPicker.showPicker();
            } catch (err) {
              hiddenPicker.focus();
              hiddenPicker.click();
            }
          } else {
            hiddenPicker.focus();
            hiddenPicker.click();
          }
        });

        hiddenPicker.addEventListener('change', () => {
          if (dateInput && hiddenPicker.value) {
            dateInput.value = hiddenPicker.value;
          }
        });
      }
    },

    populateArchetypeDropdown: function () {
      const select = document.getElementById('personalityArchetypeSelect');
      if (!select || !window.JIAZI_PROFILES) return;

      select.innerHTML = '<option value="">-- หรือเลือกดู 60 เจี่ยจื่อ (Jia Zi) ทั้งหมดโดยตรง --</option>';
      window.JIAZI_PROFILES.forEach((p, idx) => {
        const opt = document.createElement('option');
        opt.value = p.key;
        opt.textContent = `${idx + 1}. ${p.zh} (${p.stemPy} ${p.branchPy} - ${p.zodiacTitle}) • ${p.mbtiEquiv} • ${p.archetype.split('(')[0].trim()}`;
        select.appendChild(opt);
      });
    },

    onTabShow: function () {
      const bDate = document.getElementById('personalityBirthDate');
      if (bDate && !bDate.value && window.AuthManager && window.AuthManager.currentUser) {
        this.fillFromCurrentUser(false);
      }
    },

    fillFromCurrentUser: function (autoCalculate = true) {
      if (!window.AuthManager || !window.AuthManager.currentUser) {
        if (autoCalculate) {
          alert('กรุณาเข้าสู่ระบบก่อน เพื่อดึงข้อมูลวันเดือนปีเกิดของคุณโดยอัตโนมัติ');
          if (window.AuthManager) window.AuthManager.openModal('login', 'personality');
        }
        return;
      }

      const u = window.AuthManager.currentUser;
      const nameInput = document.getElementById('personalityName');
      const dateInput = document.getElementById('personalityBirthDate');
      const hourInput = document.getElementById('personalityBirthHour');
      const minInput = document.getElementById('personalityBirthMinute');
      const genderInput = document.getElementById('personalityGender');

      if (nameInput) nameInput.value = u.displayName || u.name || u.firstName || 'ฉัน';
      if (dateInput && u.birthDate) dateInput.value = u.birthDate;

      if (u.birthTime) {
        const parts = u.birthTime.split(':');
        if (parts.length >= 2) {
          if (hourInput) hourInput.value = parseInt(parts[0], 10);
          if (minInput) minInput.value = parseInt(parts[1], 10);
        }
      }

      if (genderInput && u.gender) {
        genderInput.value = u.gender;
      }

      if (autoCalculate && dateInput && dateInput.value) {
        this.calculateFromInputs();
      }
    },

    normalizeDateString: function (str) {
      if (!str) return '';
      str = String(str).trim();
      // 1. YYYY-MM-DD or YYYY/MM/DD
      let m = str.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);
      if (m) {
        return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
      }
      // 2. 2 numbers and a 4-digit year: can be DD/MM/YYYY or MM/DD/YYYY
      m = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
      if (m) {
        let n1 = parseInt(m[1], 10);
        let n2 = parseInt(m[2], 10);
        const y = m[3];
        // If n1 > 12 -> must be Day / Month / Year (e.g. 23/07/1977)
        if (n1 > 12 && n2 <= 12) {
          return `${y}-${String(n2).padStart(2, '0')}-${String(n1).padStart(2, '0')}`;
        }
        // If n2 > 12 -> must be Month / Day / Year (e.g. 07/23/1977)
        if (n2 > 12 && n1 <= 12) {
          return `${y}-${String(n1).padStart(2, '0')}-${String(n2).padStart(2, '0')}`;
        }
        // Default to DD/MM/YYYY
        return `${y}-${String(n2).padStart(2, '0')}-${String(n1).padStart(2, '0')}`;
      }
      return str;
    },

    calculateFromInputs: function () {
      const name = (document.getElementById('personalityName')?.value || 'คุณ').trim();
      const rawDate = document.getElementById('personalityBirthDate')?.value;
      const birthDate = this.normalizeDateString(rawDate);
      const birthHour = parseInt(document.getElementById('personalityBirthHour')?.value || '12', 10);
      const birthMinute = parseInt(document.getElementById('personalityBirthMinute')?.value || '0', 10);
      const gender = document.getElementById('personalityGender')?.value || 'female';

      if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
        alert('กรุณาระบุวันเดือนปีเกิดให้ถูกต้อง เช่น 1977-07-23 หรือ 23/07/1977');
        document.getElementById('personalityBirthDate')?.focus();
        return;
      }

      // Sync normalized date back to input
      const dateInput = document.getElementById('personalityBirthDate');
      if (dateInput) dateInput.value = birthDate;

      if (!window.BaziEngine || typeof window.BaziEngine.calculateChart !== 'function') {
        alert('ระบบ BaZi Engine กำลังโหลด กรุณารอสักครู่แล้วลองใหม่อีกครั้ง');
        return;
      }

      // 1. Calculate BaZi Chart
      const chart = window.BaziEngine.calculateChart({
        birthDate: birthDate,
        birthHour: birthHour,
        birthMinute: birthMinute,
        gender: gender,
        name: name
      });

      if (!chart || !chart.pillars || !chart.pillars.day) {
        alert('ไม่สามารถคำนวณเสาวันเกิดได้ กรุณาตรวจสอบวันที่ระบุ');
        return;
      }

      // 2. Resolve 5 Structures & 10 Profiles & Cat Archetypes from birth date/time
      let catData = null;
      if (window.CatProfileEngine && typeof window.CatProfileEngine.resolveCatProfile === 'function') {
        catData = window.CatProfileEngine.resolveCatProfile(chart);
      }

      this.currentChart = chart;
      this.currentProfile = null;
      this.currentCatData = catData;

      // 3. Render Structure & Cat Profile Result Screen (without 60 Jia Zi)
      this.renderFullResultScreen(null, chart, catData, {
        name,
        birthDate,
        birthHour,
        birthMinute,
        gender
      });
    },

    showDirectArchetype: function (key) {
      if (!window.JIAZI_PROFILES) return;
      const profile = window.JIAZI_PROFILES.find(p => p.key === key);
      if (!profile) return;

      this.currentProfile = profile;
      this.currentChart = null;
      this.currentCatData = null;

      this.renderFullResultScreen(profile, null, null, {
        name: 'ตัวอย่าง Archetype',
        birthDate: null
      });
    },

    openFromBazi: function () {
      const bDate = document.getElementById('baziBirthDate')?.value;
      const bHour = document.getElementById('baziBirthHour')?.value;
      const bMin = document.getElementById('baziBirthMinute')?.value;
      const bGender = document.getElementById('baziGender')?.value;
      const bName = document.getElementById('baziName')?.value;

      if (document.getElementById('personalityBirthDate') && bDate) {
        document.getElementById('personalityBirthDate').value = bDate;
      }
      if (document.getElementById('personalityBirthHour') && bHour !== undefined) {
        document.getElementById('personalityBirthHour').value = String(parseInt(bHour, 10));
      }
      if (document.getElementById('personalityBirthMinute') && bMin !== undefined) {
        document.getElementById('personalityBirthMinute').value = String(parseInt(bMin, 10));
      }
      if (document.getElementById('personalityGender') && bGender) {
        document.getElementById('personalityGender').value = bGender;
      }
      if (document.getElementById('personalityName') && bName) {
        document.getElementById('personalityName').value = bName;
      }

      if (window.setActiveAppMode) {
        window.setActiveAppMode('personality');
      }

      if (bDate) {
        setTimeout(() => this.calculateFromInputs(), 100);
      }
    },

    jumpToBazi: function () {
      const bDate = document.getElementById('personalityBirthDate')?.value;
      const bHour = document.getElementById('personalityBirthHour')?.value;
      const bMin = document.getElementById('personalityBirthMinute')?.value;
      const bGender = document.getElementById('personalityGender')?.value;
      const bName = document.getElementById('personalityName')?.value;

      const dateInput = document.getElementById('baziDateInput');
      const hourInput = document.getElementById('baziHourInput');
      const genderSelect = document.getElementById('baziGenderSelect');
      const nameInput = document.getElementById('baziNameInput');

      if (dateInput && bDate) dateInput.value = bDate;
      if (hourInput && bHour !== undefined && bHour !== '') {
        const hh = String(bHour).padStart(2, '0');
        const mm = String(bMin || 0).padStart(2, '0');
        hourInput.value = `${hh}:${mm}`;
      }
      if (genderSelect && bGender) genderSelect.value = bGender;
      if (nameInput && bName) nameInput.value = bName;

      if (window.setActiveAppMode) {
        window.setActiveAppMode('bazi');
      }

      if (window.BaziApp && typeof window.BaziApp.calculateFromInputs === 'function') {
        setTimeout(() => window.BaziApp.calculateFromInputs(true), 120);
      }
    },

    /**
     * Generate Pure SVG Spider / Radar Chart for 5 Structures
     */
    generateRadarChartSVG: function (radarData) {
      if (!radarData || radarData.length !== 5) return '';

      const cx = 195;
      const cy = 160;
      const r = 88;
      const numAxes = 5;

      // 5 Angles (Starts top at -PI/2)
      const angles = [];
      for (let i = 0; i < numAxes; i++) {
        angles.push(-Math.PI / 2 + (i * 2 * Math.PI) / numAxes);
      }

      // Background Concentric Pentagons (20%, 40%, 60%, 80%, 100%)
      const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
      let gridLinesSvg = '';

      levels.forEach(lvl => {
        const polyPoints = angles.map(a => {
          const x = cx + r * lvl * Math.cos(a);
          const y = cy + r * lvl * Math.sin(a);
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ');

        gridLinesSvg += `
          <polygon points="${polyPoints}" fill="${lvl === 1.0 ? 'rgba(255,255,255,0.02)' : 'none'}" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
        `;
      });

      // Axis Spoke Lines
      let spokesSvg = '';
      angles.forEach(a => {
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        spokesSvg += `
          <line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,0.15)" stroke-width="1" stroke-dasharray="3,3" />
        `;
      });

      // Calculate Maximum Value for Scaling
      const maxVal = Math.max(...radarData.map(d => d.value), 35);

      // Data Polygon Vertices
      const dataPoints = radarData.map((d, i) => {
        const a = angles[i];
        // Normalize between 15% and 100% of radius so small values stay visible
        const ratio = Math.max(0.12, Math.min(1.0, d.value / maxVal));
        const x = cx + r * ratio * Math.cos(a);
        const y = cy + r * ratio * Math.sin(a);
        return { x, y, data: d };
      });

      const polyString = dataPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

      // Vertex Circles & Values
      let verticesSvg = '';
      dataPoints.forEach(p => {
        verticesSvg += `
          <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5" fill="#f43f5e" stroke="#fff" stroke-width="2" />
          <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="8.5" fill="none" stroke="rgba(244, 63, 94, 0.45)" stroke-width="1.5" />
        `;
      });

      // Axis Labels (English only, carefully anchored to never clip on mobile)
      let labelsSvg = '';
      radarData.forEach((d, i) => {
        const a = angles[i];
        const dist = (i === 0) ? (r + 18) : (r + 16);
        const lx = cx + dist * Math.cos(a);
        const ly = cy + dist * Math.sin(a);

        // Text alignment based on horizontal angle
        let textAnchor = 'middle';
        if (Math.cos(a) > 0.25) textAnchor = 'start';
        else if (Math.cos(a) < -0.25) textAnchor = 'end';

        labelsSvg += `
          <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${textAnchor}" fill="#f8fafc" font-family="'Outfit', sans-serif" font-size="12" font-weight="700">
            ${d.label}
          </text>
          <text x="${lx.toFixed(1)}" y="${(ly + 13.5).toFixed(1)}" text-anchor="${textAnchor}" fill="${d.color}" font-family="'Outfit', sans-serif" font-size="12" font-weight="800">
            ${d.value}%
          </text>
        `;
      });

      return `
        <svg class="radar-svg-canvas" viewBox="0 0 390 330" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="radarAreaGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ec4899" stop-opacity="0.55" />
              <stop offset="70%" stop-color="#8b5cf6" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.15" />
            </radialGradient>
            <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Background Rings -->
          ${gridLinesSvg}

          <!-- Axis Spokes -->
          ${spokesSvg}

          <!-- Filled Data Polygon -->
          <polygon points="${polyString}" fill="url(#radarAreaGradient)" stroke="#ec4899" stroke-width="2.5" filter="url(#radarGlow)" />

          <!-- Vertices -->
          ${verticesSvg}

          <!-- Axis Labels (English Only) -->
          ${labelsSvg}
        </svg>
      `;
    },

    copyProfileSummary: function () {
      if (!this.currentCatData || !this.currentCatData.primaryCat) {
        alert('กรุณาคำนวณโปรไฟล์ก่อนคัดลอก');
        return;
      }

      const cat = this.currentCatData.primaryCat;
      const guild = this.currentCatData.primaryGuild;
      const name = document.getElementById('personalityName')?.value || 'คุณ';

      let text = `✨ ทายนิสัยฉบับน้องเหมียว (Structure & Cat Profile) • แม่หมอติ๊ดติ๊ด ✨\n`;
      text += `━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `👤 เจ้าชะตา: ${name}\n`;
      text += `🐱 แมวตัวแทนตามหลักแม่หมอติ๊ดติ๊ด:\n`;
      text += `  • สายพันธุ์หลัก: ${cat.catEmoji} ${cat.catBreed} (${cat.title})\n`;
      if (this.currentCatData?.compositePersona?.compositeTitle) {
        text += `  • เอกลักษณ์ย่อย: ${this.currentCatData.compositePersona.compositeTitle}\n`;
      }
      text += `  • โครงสร้างหลัก (5 Structures): ${guild?.nameEn || '-'} (${guild?.nameTh || '-'})\n`;
      text += `  • นิยามแมว: "${cat.tagline}"\n`;
      text += `  • แมวคู่แท้: ${cat.catChemistry.bestPartner}\n\n`;

      if (this.currentCatData?.rankedProfiles) {
        text += `📊 สัดส่วนพลัง 10 Profiles (十神):\n`;
        this.currentCatData.rankedProfiles.slice(0, 5).forEach(rp => {
          text += `  #${rp.rank} ${rp.tenGodZh} (${rp.tenGodTh}): ${rp.percentage}% [${rp.catBreed}]\n`;
        });
        text += `\n`;
      }

      text += `⚡ พลังวิเศษและสัญชาตญาณเด่น:\n`;
      cat.superpowers.forEach(s => text += `  • ${s}\n`);

      text += `\n🐱 ${cat.healingAdvice}\n`;
      text += `━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `ทายนิสัยฉบับน้องเหมียวของคุณได้ที่: แม่หมอติ๊ดติ๊ด (Destiny Arcana)`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          this.showToast('📋 คัดลอกสรุปโปรไฟล์สำเร็จแล้ว!');
        }).catch(() => {
          this.fallbackCopyText(text);
        });
      } else {
        this.fallbackCopyText(text);
      }
    },

    fallbackCopyText: function (text) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      this.showToast('📋 คัดลอกสรุปโปรไฟล์สำเร็จแล้ว!');
    },

    showToast: function (msg) {
      let toast = document.getElementById('personalityToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'personalityToast';
        toast.className = 'personality-toast';
        document.body.appendChild(toast);
      }
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    },

    openStoryModal: function () {
      if (!this.currentCatData || !this.currentCatData.primaryCat) return;

      let modal = document.getElementById('personalityStoryModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'personalityStoryModal';
        modal.className = 'modal-overlay hidden';
        document.body.appendChild(modal);
      }

      const cat = this.currentCatData.primaryCat;
      const guild = this.currentCatData.primaryGuild;
      const comp = this.currentCatData.compositePersona;

      modal.innerHTML = `
        <div class="modal-card story-modal-card">
          <div class="modal-header">
            <h3><i class="fa-solid fa-camera-retro" style="color: #ec4899;"></i> การ์ด Story 9:16 (พร้อมแชร์ IG / LINE)</h3>
            <button class="modal-close" onclick="document.getElementById('personalityStoryModal').classList.add('hidden')">&times;</button>
          </div>
          <div class="story-preview-wrap">
            <div class="story-poster-card" id="storyPosterElement">
              <div class="story-header-brand">
                <span class="story-brand-badge">แม่หมอติ๊ดติ๊ด • DESTINY ARCANA</span>
                <span class="story-card-type">STRUCTURE &amp; CAT PROFILE</span>
              </div>

              <div class="story-cat-avatar-box">
                <div class="story-cat-emoji">${cat.catEmoji}</div>
                <div class="story-cat-breed">${cat.catBreed}</div>
                ${comp?.compositeTitle ? `
                  <div style="font-size: 12.5px; color: #fbcfe8; font-weight: 700; margin-top: 4px; text-align: center;">
                    ${comp.compositeTitle}
                  </div>
                ` : ''}
                <div class="story-cat-guild">${guild?.nameEn || ''} • ${guild?.nameTh || ''}</div>
              </div>

              <div class="story-tagline">“${cat.tagline}”</div>

              <div class="story-powers-box">
                <div class="story-box-title">⚡ พลังวิเศษประจำตัว:</div>
                <ul>
                  ${cat.superpowers.slice(0, 3).map(s => `<li>• ${s}</li>`).join('')}
                </ul>
              </div>

              <div class="story-cat-quote">
                🐱 “${cat.healingAdvice}”
              </div>

              <div class="story-footer">
                <span>ทายนิสัยฉบับน้องเหมียวของคุณได้ที่: แม่หมอติ๊ดติ๊ด</span>
              </div>
            </div>
          </div>

          <div class="story-actions">
            <button type="button" class="p-btn-action primary" onclick="window.PersonalityApp.copyProfileSummary()">
              <i class="fa-solid fa-copy"></i> คัดลอกข้อความ
            </button>
            <button type="button" class="p-btn-action secondary" onclick="document.getElementById('personalityStoryModal').classList.add('hidden')">
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      `;

      modal.classList.remove('hidden');
    },

    /**
     * RENDER DEDICATED RESULT SCREEN
     * Order:
     * 1. 5 Structures Spider Chart (Joey Yap)
     * 2. 10 Profiles % Rankings & Mapping กับ แมวตามหลักการของแม่หมอติ๊ดติ๊ด
     * 3. Actions Bar
     */
    renderFullResultScreen: function (p, chart, catData, inputData) {
      const resultContainer = document.getElementById('personalityResultContainer');
      if (!resultContainer) return;

      // SECTION 1: 5 Structures Spider Chart HTML
      let radarSectionHtml = '';
      if (catData && catData.radarData) {
        const radarSvg = this.generateRadarChartSVG(catData.radarData);
        const primaryG = catData.primaryGuild;

        radarSectionHtml = `
          <div class="personality-section-box structure-radar-box">
            <div class="personality-section-header">
              <div class="p-header-icon-badge" style="background: rgba(139, 92, 246, 0.2); color: #c084fc;">
                <i class="fa-solid fa-chart-pie"></i>
              </div>
              <div class="p-header-titles">
                <h3>จุดแข็ง 5 Structures (Joey Yap)</h3>
                <span class="p-header-sub">วิเคราะห์ศักยภาพและรูปแบบพลังงานการขับเคลื่อนชีวิตทั้ง 5 มิติ</span>
              </div>
            </div>

            <div class="radar-content-flex">
              <!-- Left: Spider/Radar SVG Canvas -->
              <div class="radar-visual-pane">
                ${radarSvg}
              </div>

              <!-- Right: 5 Structures Breakdown Cards -->
              <div class="radar-legend-pane">
                <div class="dominant-guild-card" style="border-left: 4px solid ${primaryG.color};">
                  <div class="d-guild-tag">STRUCTURE อันดับ 1 ของคุณ</div>
                  <div class="d-guild-title">
                    <i class="fa-solid ${primaryG.icon}" style="color: ${primaryG.color};"></i>
                    <span>${primaryG.nameEn || 'The Supporters'}</span>
                  </div>
                  <p class="d-guild-desc">${primaryG.desc}</p>
                </div>

                <div class="structures-progress-list">
                  ${catData.radarData.map(d => `
                    <div class="s-progress-item">
                      <div class="s-prog-head">
                        <span class="s-label"><i class="fa-solid ${d.icon}" style="color: ${d.color};"></i> ${d.label}</span>
                        <span class="s-pct" style="color: ${d.color}; font-weight: 800;">${d.value}%</span>
                      </div>
                      <div class="s-track">
                        <div class="s-fill" style="width: ${d.value}%; background: ${d.color};"></div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        `;
      }

      // SECTION 2: Cat Archetype Mapping (แม่หมอติ๊ดติ๊ด) with Side-by-Side 10 Profiles Mini Breakdowns
      let catMappingSectionHtml = '';
      if (catData && catData.primaryCat) {
        const cat = catData.primaryCat;
        const guild = catData.primaryGuild;
        const composite = catData.compositePersona || {
          breedShort: cat.catBreed.split(' (')[0],
          compositeTitle: cat.title,
          compositeNarrative: `จิตวิญญาณหลักของคุณคือ ${cat.catBreed} (${cat.archetype})`
        };
        const profiles = catData.rankedProfiles || [];
        const dayGZ = chart && chart.pillars && chart.pillars.day ? (chart.pillars.day.stem.zh + chart.pillars.day.branch.zh) : '';
        const isMaineCoonWarrior = (catData.dominantTenGod === '七殺' || dayGZ === '辛巳');

        catMappingSectionHtml = `
          <div class="personality-section-box cat-mapping-full-box">
            <div class="personality-section-header">
              <div class="p-header-icon-badge" style="background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #fff;">
                <i class="fa-solid fa-cat"></i>
              </div>
              <div class="p-header-titles">
                <h3>แมวประจำตัวตนตามหลักการของแม่หมอติ๊ดติ๊ด (The Cat Persona)</h3>
                <span class="p-header-sub">ถอดรหัสพฤติกรรม จิตวิทยา และเอกลักษณ์ของจิตวิญญาณแมวตามสัดส่วน 10 Profiles</span>
              </div>
            </div>

            <!-- Cat Hero Composite: Side-by-Side Character + Mini 10 Profiles -->
            <div class="cat-composite-hero">
              <!-- Left Column: Character Card & Personality Synthesis -->
              <div class="cat-composite-char-col">
                <div class="cat-char-badge-header">
                  <span class="cat-char-tag">[Character ${composite.breedShort}]</span>
                  <span class="cat-guild-tag" style="background: ${guild.bg}; color: ${guild.color};">
                    <i class="fa-solid ${guild.icon}"></i> ${guild.nameEn || 'The Supporters'}
                  </span>
                </div>

                <div class="cat-visual-card">
                  ${isMaineCoonWarrior ? `
                    <div class="cat-portrait-wrap">
                      <img src="assets/cats/founder_mystic_mainecoon.jpg" alt="${composite.compositeTitle}" class="cat-portrait-img" />
                      <div class="cat-portrait-overlay">
                        <span class="cat-portrait-tag">✨ คาแรคเตอร์เฉพาะตัวตนของคุณ</span>
                      </div>
                    </div>
                  ` : `
                    <div class="cat-avatar-fallback">
                      <span class="fallback-cat-emoji">${cat.catEmoji}</span>
                      <span class="fallback-cat-breed">${cat.catBreed}</span>
                    </div>
                  `}
                </div>

                <div class="cat-composite-info">
                  <div class="cat-top-badges">
                    <span class="c-badge-pill">${cat.tenGodTh}</span>
                    <span class="c-badge-pill">DISC: ${cat.discTendency}</span>
                    <span class="c-badge-pill">MBTI: ${cat.mbtiMatch}</span>
                  </div>

                  <h2 class="cat-composite-title">${composite.compositeTitle}</h2>
                  <p class="cat-quote-callout">“${cat.tagline}”</p>

                  <div class="cat-composite-narrative-box">
                    <div class="c-narrative-head">
                      <i class="fa-solid fa-wand-magic-sparkles" style="color: #f472b6;"></i>
                      <span>เอกลักษณ์ย่อยตาม Profile หลัก-รอง:</span>
                    </div>
                    <div class="c-narrative-text">
                      ${composite.compositeNarrative.split('\n').map(line => `<div class="c-narrative-row">${line}</div>`).join('')}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column: Compact Mini-Percentages of 10 Profiles -->
              <div class="cat-composite-stats-col">
                <div class="mini-profiles-header">
                  <div class="m-stat-title">
                    <i class="fa-solid fa-chart-simple" style="color: #ec4899;"></i>
                    <span>สัดส่วนพลัง 10 Profiles (十神)</span>
                  </div>
                  <span class="m-stat-sub">เรียงตามเปอร์เซ็นต์พลังงานแฝงในตัวคุณ</span>
                </div>

                <div class="mini-profiles-list">
                  ${profiles.map(rp => `
                    <div class="mini-profile-item ${rp.isPrimary ? 'primary-item' : (rp.isSecondary ? 'secondary-item' : '')}">
                      <div class="m-item-left">
                        <span class="m-rank-badge ${rp.rank === 1 ? 'rank-1' : (rp.rank === 2 ? 'rank-2' : (rp.rank === 3 ? 'rank-3' : ''))}">
                          #${rp.rank}
                        </span>
                        <span class="m-god-zh" style="color: ${rp.color};">${rp.tenGodZh}</span>
                        <div class="m-names">
                          <span class="m-profile-name">${rp.archetype.split(' (')[0]}</span>
                          <span class="m-cat-sub">${rp.catBreed.split(' (')[0]}</span>
                        </div>
                      </div>
                      <div class="m-item-mid">
                        <div class="m-bar-track">
                          <div class="m-bar-fill" style="width: ${rp.percentage}%; background: ${rp.color};"></div>
                        </div>
                      </div>
                      <div class="m-item-right">
                        <span class="m-pct" style="color: ${rp.color}; font-weight: 800;">${rp.percentage}%</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- Superpowers & Shadows -->
            <div class="cat-duo-traits-grid">
              <div class="trait-box power-style">
                <div class="t-box-head">
                  <i class="fa-solid fa-sparkles" style="color: #10b981;"></i>
                  <h4>พลังวิเศษและสัญชาตญาณเด่น (Cat Superpowers)</h4>
                </div>
                <ul>
                  ${cat.superpowers.map(s => `<li><i class="fa-solid fa-circle-check"></i> <span>${s}</span></li>`).join('')}
                </ul>
              </div>

              <div class="trait-box shadow-style">
                <div class="t-box-head">
                  <i class="fa-solid fa-shield-cat" style="color: #f59e0b;"></i>
                  <h4>จุดบอดและสิ่งที่ทำให้แมวงอน (Cat Quirks &amp; Shadows)</h4>
                </div>
                <ul>
                  ${cat.shadows.map(s => `<li><i class="fa-solid fa-circle-exclamation"></i> <span>${s}</span></li>`).join('')}
                </ul>
              </div>
            </div>

            <!-- Awakened Light vs Cozy Recharge -->
            <div class="cat-modes-duo-grid">
              <div class="mode-box light-box">
                <div class="mode-head">
                  <i class="fa-solid fa-sun" style="color: #fbbf24;"></i>
                  <h4>☀️ โหมดแมวเปล่งประกาย (Awakened Light Mode)</h4>
                </div>
                <p>${cat.awakenedMode}</p>
              </div>

              <div class="mode-box recharge-box">
                <div class="mode-head">
                  <i class="fa-solid fa-couch" style="color: #c084fc;"></i>
                  <h4>🛋️ โหมดแมวพักชาร์จแบต (Cozy Recharge Mode)</h4>
                </div>
                <p>${cat.rechargeMode}</p>
              </div>
            </div>

            <!-- Cat Chemistry -->
            <div class="cat-chem-banner">
              <div class="chem-col">
                <i class="fa-solid fa-heart" style="color: #ec4899;"></i>
                <div>
                  <strong>แมวคู่แท้เคมีลงตัว (Best Partner):</strong>
                  <p>${cat.catChemistry.bestPartner}</p>
                </div>
              </div>
              <div class="chem-col">
                <i class="fa-solid fa-bolt" style="color: #3b82f6;"></i>
                <div>
                  <strong>แมวคู่ท้าทายช่วยให้เติบโต (Growth Partner):</strong>
                  <p>${cat.catChemistry.growthPartner}</p>
                </div>
              </div>
            </div>

            <!-- Mother Cat Healing Note -->
            <div class="mother-cat-advice-card">
              <div class="m-avatar"><i class="fa-solid fa-cat"></i></div>
              <div class="m-text">
                <h4>คำแนะนำฮีลใจจากแม่หมอติ๊ดติ๊ด 🐱💖</h4>
                <p>${cat.healingAdvice}</p>
              </div>
            </div>

          </div>
        `;
      }

      // Assemble the Full Result Screen (Structure & Profile + Cat Persona only)
      resultContainer.innerHTML = `
        <div class="personality-card-wrapper animate-fade-in">
          
          <!-- ============================================================== -->
          <!-- 1. SPIDER CHART 5 STRUCTURES (JOEY YAP)                         -->
          <!-- ============================================================== -->
          ${radarSectionHtml}

          <!-- ============================================================== -->
          <!-- 2. CAT PERSONA & 10 PROFILES BREAKDOWN (แม่หมอติ๊ดติ๊ด)         -->
          <!-- ============================================================== -->
          ${catMappingSectionHtml}

          <!-- ============================================================== -->
          <!-- 3. ACTION TOOLBAR                                              -->
          <!-- ============================================================== -->
          <div class="personality-actions-bar">
            <button type="button" class="p-btn-action primary" id="personalityCopyBtn">
              <i class="fa-solid fa-clipboard-check"></i> คัดลอกสรุปโปรไฟล์
            </button>
            <button type="button" class="p-btn-action story-btn" id="personalityStoryBtn">
              <i class="fa-solid fa-camera-retro"></i> การ์ด Story (9:16)
            </button>
            <button type="button" class="p-btn-action secondary" id="personalityJumpToBaziBtn">
              <i class="fa-solid fa-yin-yang"></i> ดูดวง BaZi สี่แถวชะตาตัวเต็ม
            </button>
            <button type="button" class="p-btn-action tertiary" onclick="document.getElementById('personalityAppView')?.scrollTo({ top: 0, behavior: 'smooth' })">
              <i class="fa-solid fa-arrow-up"></i> กลับขึ้นด้านบน
            </button>
          </div>

        </div>
      `;

      // Rebind action buttons
      const newCopyBtn = document.getElementById('personalityCopyBtn');
      if (newCopyBtn) {
        newCopyBtn.addEventListener('click', () => this.copyProfileSummary());
      }
      const newStoryBtn = document.getElementById('personalityStoryBtn');
      if (newStoryBtn) {
        newStoryBtn.addEventListener('click', () => this.openStoryModal());
      }
      const newJumpBtn = document.getElementById('personalityJumpToBaziBtn');
      if (newJumpBtn) {
        newJumpBtn.addEventListener('click', () => this.jumpToBazi());
      }

      // Smooth scroll to results within the personality scroll container
      const appView = document.getElementById('personalityAppView');
      if (appView && resultContainer) {
        setTimeout(() => {
          appView.scrollTo({
            top: resultContainer.offsetTop - 15,
            behavior: 'smooth'
          });
        }, 60);
      } else if (resultContainer) {
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Expose globally
  window.PersonalityApp = PersonalityApp;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PersonalityApp.init());
  } else {
    PersonalityApp.init();
  }
})();
