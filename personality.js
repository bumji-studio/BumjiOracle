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

    calculateFromInputs: function () {
      const name = (document.getElementById('personalityName')?.value || 'คุณ').trim();
      const birthDate = document.getElementById('personalityBirthDate')?.value;
      const birthHour = parseInt(document.getElementById('personalityBirthHour')?.value || '12', 10);
      const birthMinute = parseInt(document.getElementById('personalityBirthMinute')?.value || '0', 10);
      const gender = document.getElementById('personalityGender')?.value || 'female';

      if (!birthDate) {
        alert('กรุณาระบุวันเดือนปีเกิด เพื่อคำนวณเสาวัน 60 Jia Zi และโครงสร้างดวงชะตา');
        document.getElementById('personalityBirthDate')?.focus();
        return;
      }

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

      const dayStem = chart.pillars.day.stem.zh;
      const dayBranch = chart.pillars.day.branch.zh;

      // 2. Resolve 60 Jia Zi Soul Profile
      const profile = window.getJiaZiProfile(dayStem, dayBranch);
      if (!profile) {
        alert(`ไม่พบโปรไฟล์ 60 Jia Zi สำหรับ ${dayStem}${dayBranch}`);
        return;
      }

      // 3. Resolve 5 Structures & 10 Profiles & Cat Archetypes
      let catData = null;
      if (window.CatProfileEngine && typeof window.CatProfileEngine.resolveCatProfile === 'function') {
        catData = window.CatProfileEngine.resolveCatProfile(chart);
      }

      this.currentChart = chart;
      this.currentProfile = profile;
      this.currentCatData = catData;

      // 4. Render New Dedicated Flow
      this.renderFullResultScreen(profile, chart, catData, {
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
      if (document.getElementById('personalityBirthHour') && bHour) {
        document.getElementById('personalityBirthHour').value = bHour;
      }
      if (document.getElementById('personalityBirthMinute') && bMin) {
        document.getElementById('personalityBirthMinute').value = bMin;
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

      if (document.getElementById('baziBirthDate') && bDate) {
        document.getElementById('baziBirthDate').value = bDate;
      }
      if (document.getElementById('baziBirthHour') && bHour) {
        document.getElementById('baziBirthHour').value = bHour;
      }
      if (document.getElementById('baziBirthMinute') && bMin) {
        document.getElementById('baziBirthMinute').value = bMin;
      }
      if (document.getElementById('baziGender') && bGender) {
        document.getElementById('baziGender').value = bGender;
      }
      if (document.getElementById('baziName') && bName) {
        document.getElementById('baziName').value = bName;
      }

      if (window.setActiveAppMode) {
        window.setActiveAppMode('bazi');
      }

      const calcBtn = document.getElementById('baziCalcBtn');
      if (calcBtn) {
        setTimeout(() => calcBtn.click(), 100);
      }
    },

    /**
     * Generate Pure SVG Spider / Radar Chart for 5 Structures
     */
    generateRadarChartSVG: function (radarData) {
      if (!radarData || radarData.length !== 5) return '';

      const cx = 175;
      const cy = 175;
      const r = 105;
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
          <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="5" fill="#f43f5e" stroke="#fff" stroke-width="2" />
          <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="9" fill="none" stroke="rgba(244, 63, 94, 0.45)" stroke-width="1.5" />
        `;
      });

      // Axis Labels (Placed nicely around perimeter)
      let labelsSvg = '';
      radarData.forEach((d, i) => {
        const a = angles[i];
        const dist = r + 24;
        const lx = cx + dist * Math.cos(a);
        const ly = cy + dist * Math.sin(a);

        // Text alignment based on x position
        let textAnchor = 'middle';
        if (Math.cos(a) > 0.3) textAnchor = 'start';
        else if (Math.cos(a) < -0.3) textAnchor = 'end';

        labelsSvg += `
          <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${textAnchor}" fill="#e2e8f0" font-family="'Prompt', sans-serif" font-size="11" font-weight="600">
            ${d.labelTh}
          </text>
          <text x="${lx.toFixed(1)}" y="${(ly + 13).toFixed(1)}" text-anchor="${textAnchor}" fill="${d.color}" font-family="'Outfit', sans-serif" font-size="12" font-weight="800">
            ${d.value}%
          </text>
        `;
      });

      return `
        <svg class="radar-svg-canvas" viewBox="0 0 350 350" xmlns="http://www.w3.org/2000/svg">
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

          <!-- Axis Labels -->
          ${labelsSvg}
        </svg>
      `;
    },

    copyProfileSummary: function () {
      if (!this.currentProfile) {
        alert('กรุณาคำนวณโปรไฟล์ก่อนคัดลอก');
        return;
      }

      const p = this.currentProfile;
      const c = this.currentChart;
      const cat = this.currentCatData?.primaryCat;
      const guild = this.currentCatData?.primaryGuild;
      const name = document.getElementById('personalityName')?.value || 'คุณ';

      let text = `✨ ถอดรหัส 60 Jia Zi & แมวตัวตน • แม่หมอติ๊ดติ๊ด ✨\n`;
      text += `━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `👤 เจ้าชะตา: ${name}\n`;
      text += `🔮 เสาวัน (Day Pillar): ${p.zh} (${p.stemPy} ${p.branchPy} - ${p.thaiName})\n`;
      text += `👑 Archetype: ${p.archetype}\n`;
      text += `🪙 ธาตุนาอิม: ${p.nayin}\n`;
      text += `📜 คำจำกัดความ: "${p.tagline}"\n\n`;

      if (cat) {
        text += `🐱 แมวตัวแทนตามหลักแม่หมอติ๊ดติ๊ด:\n`;
        text += `  • สายพันธุ์หลัก: ${cat.catEmoji} ${cat.catBreed} (${cat.title})\n`;
        text += `  • กิลด์พลังชีวิต: ${guild?.nameTh || '-'}\n`;
        text += `  • นิยามแมว: "${cat.tagline}"\n`;
        text += `  • แมวคู่แท้: ${cat.catChemistry.bestPartner}\n\n`;
      }

      if (this.currentCatData?.rankedProfiles) {
        text += `📊 อันดับ 10 Profiles (Joey Yap):\n`;
        this.currentCatData.rankedProfiles.slice(0, 5).forEach(rp => {
          text += `  #${rp.rank} ${rp.tenGodZh} (${rp.tenGodTh}): ${rp.percentage}% [${rp.catBreed}]\n`;
        });
        text += `\n`;
      }

      text += `⚡ พลังพิเศษ:\n`;
      p.superpowers.forEach(s => text += `  • ${s}\n`);

      text += `\n🐱 ${p.healingAdvice}\n`;
      text += `━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `ถอดรหัสตัวตนของคุณได้ที่: แม่หมอติ๊ดติ๊ด (Destiny Arcana)`;

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
      if (!this.currentProfile) return;

      let modal = document.getElementById('personalityStoryModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'personalityStoryModal';
        modal.className = 'modal-overlay hidden';
        document.body.appendChild(modal);
      }

      const p = this.currentProfile;
      const cat = this.currentCatData?.primaryCat;
      const guild = this.currentCatData?.primaryGuild;

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
                <span class="story-card-type">60 JIA ZI &amp; CAT ARCHETYPE</span>
              </div>

              ${cat ? `
                <div class="story-cat-avatar-box">
                  <div class="story-cat-emoji">${cat.catEmoji}</div>
                  <div class="story-cat-breed">${cat.catBreed}</div>
                  <div class="story-cat-guild">${guild?.nameTh || ''}</div>
                </div>
              ` : ''}

              <div class="story-seal-wrap">
                <div class="story-seal">${p.zh}</div>
                <div class="story-title-info">
                  <div class="story-archetype-name">${p.stemPy} ${p.branchPy} (${p.thaiName})</div>
                  <div class="story-meta-tags">
                    <span>${p.mbtiEquiv}</span>
                    <span>•</span>
                    <span>${p.archetype}</span>
                  </div>
                </div>
              </div>

              <div class="story-tagline">“${cat ? cat.tagline : p.tagline}”</div>

              <div class="story-powers-box">
                <div class="story-box-title">⚡ พลังวิเศษประจำตัว:</div>
                <ul>
                  ${(cat ? cat.superpowers : p.superpowers).slice(0, 3).map(s => `<li>• ${s}</li>`).join('')}
                </ul>
              </div>

              <div class="story-cat-quote">
                🐱 “${p.healingAdvice.split('คำแนะนำฮีลใจจากแม่หมอติ๊ดติ๊ด:')[1]?.trim() || p.healingAdvice}”
              </div>

              <div class="story-footer">
                <span>ค้นพบตัวตนและจิตวิญญาณแมวของคุณที่: แม่หมอติ๊ดติ๊ด</span>
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
     * 1. 60 Jia Zi Day Pillar Hero (e.g. Xin Si)
     * 2. 5 Structures Spider Chart (Joey Yap)
     * 3. 10 Profiles % Rankings (Joey Yap Ten Gods)
     * 4. Mapping กับ แมวตามหลักการของแม่หมอติ๊ดติ๊ด
     * 5. Actions Bar
     */
    renderFullResultScreen: function (p, chart, catData, inputData) {
      const resultContainer = document.getElementById('personalityResultContainer');
      if (!resultContainer) return;

      // 4 Pillars mini-summary if chart exists
      let pillarsSummaryHtml = '';
      if (chart && chart.pillars) {
        pillarsSummaryHtml = `
          <div class="p-pillars-row">
            <div class="p-pillar-chip">
              <span class="chip-label">เสาปี (Year)</span>
              <span class="chip-chars">${chart.pillars.year.stem.zh}${chart.pillars.year.branch.zh}</span>
            </div>
            <div class="p-pillar-chip">
              <span class="chip-label">เสาเดือน (Month)</span>
              <span class="chip-chars">${chart.pillars.month.stem.zh}${chart.pillars.month.branch.zh}</span>
            </div>
            <div class="p-pillar-chip active-day-chip">
              <span class="chip-label">เสาวัน (Day Core) ⭐</span>
              <span class="chip-chars">${chart.pillars.day.stem.zh}${chart.pillars.day.branch.zh}</span>
              <span class="chip-pinyin">${p.stemPy} ${p.branchPy}</span>
            </div>
            <div class="p-pillar-chip">
              <span class="chip-label">เสายาม (Hour)</span>
              <span class="chip-chars">${chart.pillars.hour.stem.zh}${chart.pillars.hour.branch.zh}</span>
            </div>
            <div class="p-pillar-chip strength-chip">
              <span class="chip-label">สภาพดิถี</span>
              <span class="chip-val">${chart.strengthText}</span>
            </div>
          </div>
        `;
      }

      // SECTION 2: 5 Structures Spider Chart HTML
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
                <h3>กราฟใยแมงมุมแสดงจุดแข็ง 5 Structures (Joey Yap)</h3>
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
                    <span>${primaryG.nameTh} (${primaryG.nameZh})</span>
                  </div>
                  <p class="d-guild-desc">${primaryG.desc}</p>
                </div>

                <div class="structures-progress-list">
                  ${catData.radarData.map(d => `
                    <div class="s-progress-item">
                      <div class="s-prog-head">
                        <span class="s-label"><i class="fa-solid ${d.icon}" style="color: ${d.color};"></i> ${d.labelTh} (${d.label})</span>
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

      // SECTION 3: 10 Profiles Rankings HTML
      let tenProfilesSectionHtml = '';
      if (catData && catData.rankedProfiles) {
        const profiles = catData.rankedProfiles;

        tenProfilesSectionHtml = `
          <div class="personality-section-box ten-profiles-box">
            <div class="personality-section-header">
              <div class="p-header-icon-badge" style="background: rgba(236, 72, 153, 0.2); color: #f472b6;">
                <i class="fa-solid fa-list-ol"></i>
              </div>
              <div class="p-header-titles">
                <h3>สัดส่วน % ของ 10 Profiles (十神 Profiling)</h3>
                <span class="p-header-sub">จัดอันดับขุนพลพลังงานประจำตัว 10 ด้าน ตามหลักวิชา BaZi Profiling ของ Joey Yap</span>
              </div>
            </div>

            <div class="profiles-rank-grid">
              ${profiles.map(rp => `
                <div class="profile-rank-card ${rp.isPrimary ? 'primary-card' : ''} ${rp.isSecondary ? 'secondary-card' : ''}">
                  <div class="profile-card-top">
                    <div class="profile-badge-num ${rp.isPrimary ? 'rank-1' : rp.isSecondary ? 'rank-2' : ''}">
                      ${rp.isPrimary ? '⭐ #1' : rp.isSecondary ? '✨ #2' : '#' + rp.rank}
                    </div>
                    <div class="profile-god-zh" style="color: ${rp.color};">
                      ${rp.tenGodZh}
                    </div>
                    <div class="profile-pct-val" style="color: ${rp.color};">
                      ${rp.percentage}%
                    </div>
                  </div>

                  <div class="profile-card-mid">
                    <h4 class="profile-title-text">${rp.archetype}</h4>
                    <span class="profile-god-th">${rp.tenGodTh}</span>
                  </div>

                  <div class="profile-card-cat-tag">
                    <span class="cat-chip"><i class="fa-solid fa-cat"></i> ${rp.catEmoji} ${rp.catBreed}</span>
                  </div>

                  <div class="profile-bar-track">
                    <div class="profile-bar-fill" style="width: ${rp.percentage}%; background: ${rp.color};"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      // SECTION 4: Mapping กับ แมวตามหลักการของแม่หมอติ๊ดติ๊ด
      let catMappingSectionHtml = '';
      if (catData && catData.primaryCat) {
        const cat = catData.primaryCat;
        const subCat = catData.secondaryCat;
        const guild = catData.primaryGuild;

        catMappingSectionHtml = `
          <div class="personality-section-box cat-mapping-full-box">
            <div class="personality-section-header">
              <div class="p-header-icon-badge" style="background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #fff;">
                <i class="fa-solid fa-cat"></i>
              </div>
              <div class="p-header-titles">
                <h3>แมวประจำตัวตนตามหลักการของแม่หมอติ๊ดติ๊ด (The Cat Persona)</h3>
                <span class="p-header-sub">ถอดรหัสพฤติกรรม จิตวิทยา และสัญชาตญาณของจิตวิญญาณแมวในตัวคุณ</span>
              </div>
            </div>

            <!-- Cat Hero Emblem -->
            <div class="cat-mapping-hero">
              <div class="cat-emblem-large">
                <span class="big-cat-emoji">${cat.catEmoji}</span>
                <span class="emblem-breed-name">${cat.catBreed}</span>
                <span class="emblem-guild-tag" style="background: ${guild.bg}; color: ${guild.color};">
                  ${guild.nameTh}
                </span>
              </div>

              <div class="cat-details-col">
                <div class="cat-role-badge">
                  <span>${cat.tenGodTh}</span>
                  <span class="bullet">•</span>
                  <span>DISC Style: ${cat.discTendency}</span>
                  <span class="bullet">•</span>
                  <span>MBTI: ${cat.mbtiMatch}</span>
                </div>
                <h2 class="cat-headline">${cat.title} (${cat.archetype})</h2>
                <p class="cat-quote-callout">“${cat.tagline}”</p>

                ${subCat ? `
                  <div class="companion-cat-pill">
                    <i class="fa-solid fa-shield-cat"></i>
                    <span>แมวเพื่อนแท้ซ่อนเร้น (Companion Cat): <strong>${subCat.catEmoji} ${subCat.catBreed}</strong> (${subCat.title})</span>
                  </div>
                ` : ''}
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

      // Assemble the Full Result Screen
      resultContainer.innerHTML = `
        <div class="personality-card-wrapper animate-fade-in">
          
          <!-- ============================================================== -->
          <!-- 1. 60 JIA ZI DAY PILLAR HERO SECTION (เสาวันเกิด)             -->
          <!-- ============================================================== -->
          <div class="jiazi-day-pillar-card">
            <div class="jiazi-header-badge-row">
              <span class="j-badge"><i class="fa-solid fa-yin-yang"></i> เสาวัน (DAY PILLAR) • จิตวิญญาณแก่นแท้</span>
              <span class="j-nayin"><i class="fa-solid fa-shield-halved"></i> ${p.nayin}</span>
            </div>

            <div class="jiazi-main-content">
              <!-- Giant Chinese Characters Seal -->
              <div class="jiazi-big-seal">
                <span class="seal-chars">${p.zh}</span>
                <span class="seal-pinyin">${p.stemPy} ${p.branchPy}</span>
                <span class="seal-thai">${p.thaiName}</span>
              </div>

              <div class="jiazi-text-info">
                <div class="jiazi-elements-pill">
                  <span>${p.stemEl}</span>
                  <span class="sep">+</span>
                  <span>${p.branchEl}</span>
                  <span class="sep">•</span>
                  <span>สัตว์ประจำเสา: ${p.zodiacTitle}</span>
                  <span class="sep">•</span>
                  <span>MBTI: ${p.mbtiEquiv}</span>
                </div>

                <h1 class="jiazi-archetype-title">${p.archetype}</h1>
                <p class="jiazi-poetic-tagline">“${p.tagline}”</p>

                <!-- 4 Pillars mini summary -->
                ${pillarsSummaryHtml}
              </div>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- 2. SPIDER CHART 5 STRUCTURES (JOEY YAP)                         -->
          <!-- ============================================================== -->
          ${radarSectionHtml}

          <!-- ============================================================== -->
          <!-- 3. 10 PROFILES RANKING PERCENTAGES (JOEY YAP)                  -->
          <!-- ============================================================== -->
          ${tenProfilesSectionHtml}

          <!-- ============================================================== -->
          <!-- 4. CAT ARCHETYPE MAPPING (แม่หมอติ๊ดติ๊ด)                      -->
          <!-- ============================================================== -->
          ${catMappingSectionHtml}

          <!-- ============================================================== -->
          <!-- 5. ACTION TOOLBAR                                              -->
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
