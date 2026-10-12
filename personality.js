/**
 * ============================================================================
 * แม่หมอติ๊ดติ๊ด (DESTINY ARCANA) - PERSONALITY & 60 JIA ZI ARCHETYPE ENGINE
 * Eastern MBTI & Dynamic DISC System powered by 60 Jia Zi (六十甲子)
 * ============================================================================
 */

(function () {
  'use strict';

  const PersonalityApp = {
    currentProfile: null,
    currentChart: null,

    init: function () {
      this.bindEvents();
      this.populateArchetypeDropdown();
      console.log('[PersonalityApp] Initialized successfully.');
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

      const copyBtn = document.getElementById('personalityCopyBtn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => this.copyProfileSummary());
      }

      const jumpToBaziBtn = document.getElementById('personalityJumpToBaziBtn');
      if (jumpToBaziBtn) {
        jumpToBaziBtn.addEventListener('click', () => this.jumpToBazi());
      }
    },

    populateArchetypeDropdown: function () {
      const select = document.getElementById('personalityArchetypeSelect');
      if (!select || !window.JIAZI_PROFILES) return;

      select.innerHTML = '<option value="">-- หรือเลือกดู Archetype 60 เจี่ยจื่อ ทั้งหมดโดยตรง --</option>';
      window.JIAZI_PROFILES.forEach((p, idx) => {
        const opt = document.createElement('option');
        opt.value = p.key;
        opt.textContent = `${idx + 1}. ${p.zh} (${p.thaiName} - ${p.zodiacTitle}) • ${p.mbtiEquiv} • ${p.archetype.split('(')[0].trim()}`;
        select.appendChild(opt);
      });
    },

    onTabShow: function () {
      // Auto-fill from user profile if inputs are empty
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
        alert('กรุณาระบุวันเดือนปีเกิด เพื่อคำนวณรหัสตัวตน 60 Jia Zi');
        document.getElementById('personalityBirthDate')?.focus();
        return;
      }

      if (!window.BaziEngine || typeof window.BaziEngine.calculateChart !== 'function') {
        alert('ระบบ BaZi Engine กำลังโหลด กรุณารอสักครู่แล้วลองใหม่อีกครั้ง');
        return;
      }

      // Calculate BaZi Chart
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

      const profile = window.getJiaZiProfile(dayStem, dayBranch);
      if (!profile) {
        alert(`ไม่พบโปรไฟล์ 60 Jia Zi สำหรับ ${dayStem}${dayBranch}`);
        return;
      }

      this.currentChart = chart;
      this.currentProfile = profile;

      // Fine-tune DISC scores with actual Five Elements percentages
      const dynamicDisc = this.computeDynamicDisc(profile.disc, chart.elementPercentages);

      this.renderProfileCard(profile, dynamicDisc, chart, {
        name,
        birthDate,
        birthHour,
        birthMinute,
        gender
      });
    },

    computeDynamicDisc: function (baseDisc, elPct) {
      if (!baseDisc) return { D: 50, I: 50, S: 50, C: 50 };
      if (!elPct) return { ...baseDisc };

      // Base scores
      let d = baseDisc.D || 50;
      let i = baseDisc.I || 50;
      let s = baseDisc.S || 50;
      let c = baseDisc.C || 50;

      // Element influences (deviations from balanced 20%):
      // Wood: +Drive / +Action (D), +Growth/Optimism (I)
      const woodDelta = ((elPct.wood || 20) - 20) * 0.35;
      d += woodDelta * 0.6;
      i += woodDelta * 0.4;

      // Fire: +Passion / Charisma (I), +Fast decisions (D)
      const fireDelta = ((elPct.fire || 20) - 20) * 0.35;
      i += fireDelta * 0.7;
      d += fireDelta * 0.3;

      // Earth: +Steadiness / Grounded (S), +Calm (C)
      const earthDelta = ((elPct.earth || 20) - 20) * 0.35;
      s += earthDelta * 0.8;
      c += earthDelta * 0.2;

      // Metal: +Conscientiousness / Precision (C), +Decisiveness (D)
      const metalDelta = ((elPct.metal || 20) - 20) * 0.35;
      c += metalDelta * 0.7;
      d += metalDelta * 0.3;

      // Water: +Wisdom / Deep thinking (C), +Adaptability (S)
      const waterDelta = ((elPct.water || 20) - 20) * 0.35;
      c += waterDelta * 0.5;
      s += waterDelta * 0.5;

      // Clamp between 15 and 98
      const clamp = val => Math.round(Math.max(15, Math.min(98, val)));

      return {
        D: clamp(d),
        I: clamp(i),
        S: clamp(s),
        C: clamp(c)
      };
    },

    showDirectArchetype: function (key) {
      if (!window.JIAZI_PROFILES) return;
      const profile = window.JIAZI_PROFILES.find(p => p.key === key);
      if (!profile) return;

      this.currentProfile = profile;
      this.currentChart = null;

      this.renderProfileCard(profile, profile.disc, null, {
        name: 'ตัวอย่าง Archetype',
        birthDate: null
      });
    },

    openFromBazi: function () {
      // 1. Get values from BaZi form
      const bDate = document.getElementById('baziBirthDate')?.value;
      const bHour = document.getElementById('baziBirthHour')?.value;
      const bMin = document.getElementById('baziBirthMinute')?.value;
      const bGender = document.getElementById('baziGender')?.value;
      const bName = document.getElementById('baziName')?.value;

      // 2. Populate Personality inputs
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

      // 3. Switch tab to personality
      if (window.setActiveAppMode) {
        window.setActiveAppMode('personality');
      }

      // 4. Calculate
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

      // Auto trigger BaZi calculation
      const calcBtn = document.getElementById('baziCalcBtn');
      if (calcBtn) {
        setTimeout(() => calcBtn.click(), 100);
      }
    },

    copyProfileSummary: function () {
      if (!this.currentProfile) {
        alert('กรุณาคำนวณโปรไฟล์ก่อนคัดลอก');
        return;
      }

      const p = this.currentProfile;
      const c = this.currentChart;
      const name = document.getElementById('personalityName')?.value || 'คุณ';

      let text = `✨ ถอดรหัสตัวตน 60 Jia Zi (Eastern MBTI) • แม่หมอติ๊ดติ๊ด ✨\n`;
      text += `━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `👤 เจ้าชะตา: ${name}\n`;
      text += `🔮 เสาวัน (Day Pillar): ${p.zh} (${p.thaiName} - ${p.zodiacTitle})\n`;
      text += `👑 Archetype: ${p.archetype}\n`;
      text += `🧠 Eastern MBTI: ${p.mbtiEquiv} | DISC: ${p.discType}\n`;
      text += `📜 คำจำกัดความ: "${p.tagline}"\n`;
      text += `🪙 ธาตุนาอิม: ${p.nayin}\n\n`;

      text += `⚡ พลังพิเศษ (Superpowers):\n`;
      p.superpowers.forEach(s => text += `  • ${s}\n`);

      text += `\n⚠️ จุดบอดที่ควรระวัง (Blindspots):\n`;
      p.blindspots.forEach(b => text += `  • ${b}\n`);

      text += `\n💖 ความรักและคู่แท้: ${p.love}\n`;
      text += `💼 การงานและการเงิน: ${p.career}\n`;
      text += `🎨 สีเสริมพลัง: ${p.powerColors.join(', ')}\n\n`;
      text += `🐱 ${p.healingAdvice}\n`;
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

    renderProfileCard: function (p, disc, chart, inputData) {
      const resultContainer = document.getElementById('personalityResultContainer');
      if (!resultContainer) return;

      // DISC Breakdown text
      const getDiscDesc = (type, val) => {
        if (type === 'D') {
          return val >= 70 ? 'ผู้นำที่เด็ดขาด ลุยตรงเป้าหมาย ตัดสินใจฉับไว' : val >= 50 ? 'มีเป้าหมายชัดเจน พร้อมรับความท้าทาย' : 'เน้นการประนีประนอม ไม่ชอบความขัดแย้ง';
        }
        if (type === 'I') {
          return val >= 70 ? 'มีเสน่ห์ดึงดูด พูดจาโน้มน้าวเก่ง พลังบวกกระจาย' : val >= 50 ? 'เข้าสังคมได้ดี อัธยาศัยน่ารัก เป็นมิตร' : 'สงวนท่าที ชอบความสัมพันธ์ลึกซึ้งเฉพาะกลุ่ม';
        }
        if (type === 'S') {
          return val >= 70 ? 'นิ่ง มั่นคง อดทนสูงมาก เป็นผู้ฟังและที่พึ่งที่ยอดเยี่ยม' : val >= 50 ? 'รักความสงบ ทำงานเป็นทีมได้ดี เชื่อถือได้' : 'ชอบความเปลี่ยนแปลง ไม่ชอบอยู่นิ่ง ปรับตัวเร็ว';
        }
        if (type === 'C') {
          return val >= 70 ? 'รอบคอบ ละเอียด ประณีต ตรรกะเป๊ะ ยึดมั่นมาตรฐานสูง' : val >= 50 ? 'มีระบบ ระเบียบ วางแผนก่อนลงมือทำ' : 'ยืดหยุ่น เน้นผลลัพธ์ภาพรวม ไม่ติดกรอบ';
        }
        return '';
      };

      // Element balance tag if chart is available
      let chartBadgeHtml = '';
      if (chart && chart.pillars) {
        chartBadgeHtml = `
          <div class="personality-bazi-pills">
            <span class="p-pill"><strong>เสาปี:</strong> ${chart.pillars.year.stem.zh}${chart.pillars.year.branch.zh}</span>
            <span class="p-pill"><strong>เสาเดือน:</strong> ${chart.pillars.month.stem.zh}${chart.pillars.month.branch.zh}</span>
            <span class="p-pill active-day"><strong>เสาวัน (ตัวตน):</strong> ${chart.pillars.day.stem.zh}${chart.pillars.day.branch.zh}</span>
            <span class="p-pill"><strong>เสายาม:</strong> ${chart.pillars.hour.stem.zh}${chart.pillars.hour.branch.zh}</span>
            <span class="p-pill strength">${chart.strengthText}</span>
          </div>
        `;
      }

      resultContainer.innerHTML = `
        <div class="personality-card-wrapper animate-fade-in">
          
          <!-- Top Hero Banner -->
          <div class="personality-hero-banner">
            <div class="personality-hero-left">
              <div class="personality-jiazi-seal">
                <span class="seal-zh">${p.zh}</span>
                <span class="seal-th">${p.thaiName}</span>
              </div>
              <div class="personality-hero-titles">
                <div class="personality-sub-badge">
                  <span>${p.zodiacTitle}</span>
                  <span class="bullet">•</span>
                  <span>${p.stemEl} + ${p.branchEl}</span>
                  <span class="bullet">•</span>
                  <span>${p.nayin}</span>
                </div>
                <h2 class="personality-archetype-name">${p.archetype}</h2>
                <p class="personality-tagline">“${p.tagline}”</p>
                ${chartBadgeHtml}
              </div>
            </div>

            <div class="personality-hero-right">
              <div class="personality-badge-group">
                <div class="mbti-badge" title="ประเภทบุคลิกภาพเทียบเคียง Western MBTI">
                  <span class="badge-label">EASTERN MBTI</span>
                  <span class="badge-val">${p.mbtiEquiv}</span>
                </div>
                <div class="disc-badge" title="DISC Style">
                  <span class="badge-label">DISC STYLE</span>
                  <span class="badge-val">${p.discType}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- DISC Energy Matrix (Interactive Bar Gauges) -->
          <div class="personality-section-box">
            <div class="personality-section-header">
              <i class="fa-solid fa-chart-pie" style="color: #ec4899;"></i>
              <h3>ระดับพลังงาน 4 มิติ (Dynamic DISC Energy Matrix)</h3>
              <span class="personality-section-tip">คำนวณผสานพลังธาตุในสี่แถวชะตาเฉพาะตัว</span>
            </div>

            <div class="disc-matrix-grid">
              
              <!-- D -->
              <div class="disc-matrix-card disc-d">
                <div class="disc-card-head">
                  <div class="disc-letter-badge">D</div>
                  <div class="disc-title-wrap">
                    <span class="disc-title">Dominance (ภาวะผู้นำ & การตัดสินใจ)</span>
                    <span class="disc-sub">${getDiscDesc('D', disc.D)}</span>
                  </div>
                  <div class="disc-score">${disc.D}%</div>
                </div>
                <div class="disc-progress-track">
                  <div class="disc-progress-fill fill-d" style="width: ${disc.D}%;"></div>
                </div>
              </div>

              <!-- I -->
              <div class="disc-matrix-card disc-i">
                <div class="disc-card-head">
                  <div class="disc-letter-badge">I</div>
                  <div class="disc-title-wrap">
                    <span class="disc-title">Influence (เสน่ห์ มนุษยสัมพันธ์ & พลังดึงดูด)</span>
                    <span class="disc-sub">${getDiscDesc('I', disc.I)}</span>
                  </div>
                  <div class="disc-score">${disc.I}%</div>
                </div>
                <div class="disc-progress-track">
                  <div class="disc-progress-fill fill-i" style="width: ${disc.I}%;"></div>
                </div>
              </div>

              <!-- S -->
              <div class="disc-matrix-card disc-s">
                <div class="disc-card-head">
                  <div class="disc-letter-badge">S</div>
                  <div class="disc-title-wrap">
                    <span class="disc-title">Steadiness (ความมั่นคง อดทน & การประนีประนอม)</span>
                    <span class="disc-sub">${getDiscDesc('S', disc.S)}</span>
                  </div>
                  <div class="disc-score">${disc.S}%</div>
                </div>
                <div class="disc-progress-track">
                  <div class="disc-progress-fill fill-s" style="width: ${disc.S}%;"></div>
                </div>
              </div>

              <!-- C -->
              <div class="disc-matrix-card disc-c">
                <div class="disc-card-head">
                  <div class="disc-letter-badge">C</div>
                  <div class="disc-title-wrap">
                    <span class="disc-title">Conscientiousness (ความรอบคอบ ละเอียด & แผนงาน)</span>
                    <span class="disc-sub">${getDiscDesc('C', disc.C)}</span>
                  </div>
                  <div class="disc-score">${disc.C}%</div>
                </div>
                <div class="disc-progress-track">
                  <div class="disc-progress-fill fill-c" style="width: ${disc.C}%;"></div>
                </div>
              </div>

            </div>
          </div>

          <!-- Two Columns: Superpowers vs Blindspots -->
          <div class="personality-duo-grid">
            
            <!-- Superpowers -->
            <div class="personality-section-box power-box">
              <div class="personality-section-header">
                <i class="fa-solid fa-sparkles" style="color: #10b981;"></i>
                <h3>จุดแข็ง & ซูเปอร์พาวเวอร์ (Superpowers)</h3>
              </div>
              <ul class="personality-trait-list">
                ${p.superpowers.map(s => `
                  <li>
                    <i class="fa-solid fa-circle-check trait-icon check"></i>
                    <span>${s}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <!-- Blindspots -->
            <div class="personality-section-box shadow-box">
              <div class="personality-section-header">
                <i class="fa-solid fa-shield-cat" style="color: #f59e0b;"></i>
                <h3>จุดบอด & ข้อควรระวัง (Blindspots & Shadows)</h3>
              </div>
              <ul class="personality-trait-list">
                ${p.blindspots.map(b => `
                  <li>
                    <i class="fa-solid fa-circle-exclamation trait-icon alert"></i>
                    <span>${b}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

          </div>

          <!-- Life Blueprint: Love & Career -->
          <div class="personality-duo-grid" style="margin-top: 18px;">
            
            <!-- Love & Soul Chemistry -->
            <div class="personality-section-box love-box">
              <div class="personality-section-header">
                <i class="fa-solid fa-heart" style="color: #ec4899;"></i>
                <h3>ความรัก & พาร์ทเนอร์เคมีคู่แท้ (Soul Chemistry)</h3>
              </div>
              <p class="blueprint-desc">${p.love}</p>
              <div class="love-tip">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                <span>เสน่ห์ธรรมชาติของคุณจะเปล่งประกายที่สุดเมื่อคุณมีความสุขและเป็นตัวของตัวเองอย่างเต็มร้อย</span>
              </div>
            </div>

            <!-- Career & Wealth -->
            <div class="personality-section-box career-box">
              <div class="personality-section-header">
                <i class="fa-solid fa-briefcase" style="color: #8b5cf6;"></i>
                <h3>การงาน การเงิน & พื้นที่สร้างความสำเร็จ (Career & Wealth)</h3>
              </div>
              <p class="blueprint-desc"><strong>เส้นทางที่ส่งเสริมพลัง:</strong> ${p.career}</p>
              <div class="colors-pill-wrap">
                <span class="color-lead"><i class="fa-solid fa-palette"></i> สีมงคลเสริมออร่า:</span>
                ${p.powerColors.map(c => `<span class="color-tag">${c}</span>`).join('')}
              </div>
            </div>

          </div>

          <!-- Healing Message from Mother Cat Therapist -->
          <div class="personality-healing-card">
            <div class="healing-avatar">
              <i class="fa-solid fa-cat cat-icon"></i>
            </div>
            <div class="healing-content">
              <h4>คำแนะนำฮีลใจจากแม่หมอติ๊ดติ๊ด 🐱💖</h4>
              <p>${p.healingAdvice}</p>
            </div>
          </div>

          <!-- Action Buttons Bar -->
          <div class="personality-actions-bar">
            <button type="button" class="p-btn-action primary" id="personalityCopyBtn">
              <i class="fa-solid fa-clipboard-check"></i> คัดลอกสรุปโปรไฟล์
            </button>
            <button type="button" class="p-btn-action secondary" id="personalityJumpToBaziBtn">
              <i class="fa-solid fa-yin-yang"></i> ดูดวง BaZi สี่แถวชะตาตัวเต็ม
            </button>
            <button type="button" class="p-btn-action tertiary" onclick="window.scrollTo({ top: 0, behavior: 'smooth' })">
              <i class="fa-solid fa-arrow-up"></i> กลับขึ้นด้านบน
            </button>
          </div>

        </div>
      `;

      // Rebind copy & jump buttons
      const newCopyBtn = document.getElementById('personalityCopyBtn');
      if (newCopyBtn) {
        newCopyBtn.addEventListener('click', () => this.copyProfileSummary());
      }
      const newJumpBtn = document.getElementById('personalityJumpToBaziBtn');
      if (newJumpBtn) {
        newJumpBtn.addEventListener('click', () => this.jumpToBazi());
      }

      // Smooth scroll to results
      resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Expose globally
  window.PersonalityApp = PersonalityApp;

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PersonalityApp.init());
  } else {
    PersonalityApp.init();
  }
})();
