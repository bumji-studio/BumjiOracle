/**
 * ============================================================================
 * แม่หมอติ๊ดติ๊ด (DESTINY ARCANA) - PERSONALITY & CAT ARCHETYPE ENGINE
 * Eastern MBTI & 10 Cat Profiles & 5 Structures & 60 Jia Zi System
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
      console.log('[PersonalityApp] Initialized successfully with Cat Archetypes.');
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

      select.innerHTML = '<option value="">-- หรือเลือกดู Archetype 60 เจี่ยจื่อ ทั้งหมดโดยตรง --</option>';
      window.JIAZI_PROFILES.forEach((p, idx) => {
        const opt = document.createElement('option');
        opt.value = p.key;
        opt.textContent = `${idx + 1}. ${p.zh} (${p.thaiName} - ${p.zodiacTitle}) • ${p.mbtiEquiv} • ${p.archetype.split('(')[0].trim()}`;
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
        alert('กรุณาระบุวันเดือนปีเกิด เพื่อถอดรหัสตัวตน 60 Jia Zi และโปรไฟล์แมว');
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

      // 3. Resolve 10 Cat Profiles & 5 Structures
      let catData = null;
      if (window.CatProfileEngine && typeof window.CatProfileEngine.resolveCatProfile === 'function') {
        catData = window.CatProfileEngine.resolveCatProfile(chart);
      }

      this.currentChart = chart;
      this.currentProfile = profile;
      this.currentCatData = catData;

      // 4. Fine-tune DISC scores with actual Five Elements percentages
      const dynamicDisc = this.computeDynamicDisc(profile.disc, chart.elementPercentages);

      // 5. Render
      this.renderProfileCard(profile, dynamicDisc, chart, catData, {
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

      let d = baseDisc.D || 50;
      let i = baseDisc.I || 50;
      let s = baseDisc.S || 50;
      let c = baseDisc.C || 50;

      const woodDelta = ((elPct.wood || 20) - 20) * 0.35;
      d += woodDelta * 0.6;
      i += woodDelta * 0.4;

      const fireDelta = ((elPct.fire || 20) - 20) * 0.35;
      i += fireDelta * 0.7;
      d += fireDelta * 0.3;

      const earthDelta = ((elPct.earth || 20) - 20) * 0.35;
      s += earthDelta * 0.8;
      c += earthDelta * 0.2;

      const metalDelta = ((elPct.metal || 20) - 20) * 0.35;
      c += metalDelta * 0.7;
      d += metalDelta * 0.3;

      const waterDelta = ((elPct.water || 20) - 20) * 0.35;
      c += waterDelta * 0.5;
      s += waterDelta * 0.5;

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
      this.currentCatData = null;

      this.renderProfileCard(profile, profile.disc, null, null, {
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

      let text = `✨ ถอดรหัสตัวตน 60 Jia Zi & Cat Archetype • แม่หมอติ๊ดติ๊ด ✨\n`;
      text += `━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `👤 เจ้าชะตา: ${name}\n`;
      if (cat) {
        text += `🐱 แมวประจำตัวตน: ${cat.catEmoji} ${cat.catBreed} (${cat.title})\n`;
        text += `🏰 กิลด์พลังชีวิต: ${guild?.nameTh || '-'}\n`;
        text += `🐾 นิยามแมว: "${cat.tagline}"\n`;
      }
      text += `🔮 เสาวัน (Soul Core): ${p.zh} (${p.thaiName} - ${p.zodiacTitle})\n`;
      text += `👑 Archetype: ${p.archetype}\n`;
      text += `🧠 Eastern MBTI: ${p.mbtiEquiv} | DISC: ${p.discType}\n`;
      text += `🪙 ธาตุนาอิม: ${p.nayin}\n\n`;

      text += `⚡ พลังพิเศษ (Superpowers):\n`;
      p.superpowers.forEach(s => text += `  • ${s}\n`);

      text += `\n⚠️ จุดบอดที่ควรระวัง (Blindspots):\n`;
      p.blindspots.forEach(b => text += `  • ${b}\n`);

      if (cat) {
        text += `\n☀️ โหมดเฉิดฉาย (Awakened): ${cat.awakenedMode}\n`;
        text += `🛋️ โหมดชาร์จแบต (Recharge): ${cat.rechargeMode}\n`;
        text += `💕 แมวคู่แท้: ${cat.catChemistry.bestPartner}\n`;
      }

      text += `\n💖 ความรักและคู่แท้: ${p.love}\n`;
      text += `💼 การงานและการเงิน: ${p.career}\n`;
      text += `🎨 สีเสริมพลัง: ${p.powerColors.join(', ')}\n\n`;
      text += `🐱 ${p.healingAdvice}\n`;
      text += `━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `ถอดรหัสตัวตนของคุณได้ที่: แม่หมอติ๊ดติ๊ด (Destiny Arcana)`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          this.showToast('📋 คัดลอกสรุปโปรไฟล์และแมวประจำตัวสำเร็จแล้ว!');
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
      this.showToast('📋 คัดลอกสรุปโปรไฟล์และแมวประจำตัวสำเร็จแล้ว!');
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
      if (!this.currentProfile) {
        alert('กรุณาคำนวณโปรไฟล์ก่อนบันทึกการ์ด Story');
        return;
      }

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
      const name = document.getElementById('personalityName')?.value || 'คุณ';

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
                  <div class="story-archetype-name">${p.archetype}</div>
                  <div class="story-meta-tags">
                    <span>${p.mbtiEquiv}</span>
                    <span>•</span>
                    <span>DISC: ${p.discType}</span>
                    <span>•</span>
                    <span>${p.thaiName}</span>
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
                <span>ค้นพบจิตวิญญาณแมวของคุณที่: แม่หมอติ๊ดติ๊ด</span>
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

    renderProfileCard: function (p, disc, chart, catData, inputData) {
      const resultContainer = document.getElementById('personalityResultContainer');
      if (!resultContainer) return;

      const getDiscDesc = (type, val) => {
        if (type === 'D') return val >= 70 ? 'ผู้นำที่เด็ดขาด ลุยตรงเป้าหมาย ตัดสินใจฉับไว' : val >= 50 ? 'มีเป้าหมายชัดเจน พร้อมรับความท้าทาย' : 'เน้นการประนีประนอม ไม่ชอบความขัดแย้ง';
        if (type === 'I') return val >= 70 ? 'มีเสน่ห์ดึงดูด พูดจาโน้มน้าวเก่ง พลังบวกกระจาย' : val >= 50 ? 'เข้าสังคมได้ดี อัธยาศัยน่ารัก เป็นมิตร' : 'สงวนท่าที ชอบความสัมพันธ์ลึกซึ้งเฉพาะกลุ่ม';
        if (type === 'S') return val >= 70 ? 'นิ่ง มั่นคง อดทนสูงมาก เป็นผู้ฟังและที่พึ่งที่ดี' : val >= 50 ? 'รักความสงบ ทำงานเป็นทีมได้ดี เชื่อถือได้' : 'ชอบความเปลี่ยนแปลง ไม่ชอบอยู่นิ่ง ปรับตัวเร็ว';
        if (type === 'C') return val >= 70 ? 'รอบคอบ ละเอียด ประณีต ตรรกะเป๊ะ มาตรฐานสูง' : val >= 50 ? 'มีระบบ ระเบียบ วางแผนก่อนลงมือทำ' : 'ยืดหยุ่น เน้นผลลัพธ์ภาพรวม ไม่ติดกรอบ';
        return '';
      };

      // 1. Cat Archetype Hero Banner Section
      let catSectionHtml = '';
      if (catData && catData.primaryCat) {
        const cat = catData.primaryCat;
        const subCat = catData.secondaryCat;
        const guild = catData.primaryGuild;
        const pcts = catData.guildPercentages;

        catSectionHtml = `
          <!-- CAT ARCHETYPE HERO CARD -->
          <div class="cat-archetype-card animate-fade-in">
            <div class="cat-card-header-bar">
              <span class="cat-ip-badge"><i class="fa-solid fa-cat"></i> THE MAEMOR TIDTID CAT ARCHETYPE</span>
              <span class="cat-guild-pill" style="background: ${guild.bg}; color: ${guild.color}; border: 1px solid ${guild.color};">
                <i class="fa-solid ${guild.icon}"></i> ${guild.nameTh}
              </span>
            </div>

            <div class="cat-hero-body">
              <div class="cat-avatar-emblem">
                <span class="cat-big-emoji">${cat.catEmoji}</span>
                <span class="cat-breed-tag">${cat.catBreed}</span>
              </div>

              <div class="cat-hero-info">
                <div class="cat-role-tag">${cat.tenGodTh}</div>
                <h2 class="cat-title-text">${cat.title}</h2>
                <div class="cat-sub-title">Archetype: <strong>${cat.archetype}</strong></div>
                <p class="cat-tagline-quote">“${cat.tagline}”</p>
                
                ${subCat ? `
                  <div class="companion-cat-badge">
                    <i class="fa-solid fa-shield-cat"></i> 
                    <span>แมวเพื่อนแท้ซ่อนเร้น (Companion Cat): <strong>${subCat.catEmoji} ${subCat.catBreed}</strong></span>
                  </div>
                ` : ''}
              </div>
            </div>

            <!-- 5 Structures Guild Gauges (Joey Yap 5 Structures Breakdown) -->
            <div class="cat-structures-box">
              <div class="cat-structures-title">
                <i class="fa-solid fa-chart-column" style="color: #8b5cf6;"></i>
                <span>สัดส่วนพลัง 5 กิลด์แห่งชีวิต (5 Structures Energy Breakdown)</span>
              </div>

              <div class="guild-gauges-grid">
                <div class="guild-gauge-item">
                  <div class="g-gauge-head">
                    <span><i class="fa-solid fa-brain" style="color: #3b82f6;"></i> ปราชญ์ (Thinkers)</span>
                    <strong>${pcts.thinkers || 0}%</strong>
                  </div>
                  <div class="g-track"><div class="g-fill" style="width: ${pcts.thinkers || 0}%; background: #3b82f6;"></div></div>
                </div>

                <div class="guild-gauge-item">
                  <div class="g-gauge-head">
                    <span><i class="fa-solid fa-chess-rook" style="color: #8b5cf6;"></i> ผู้นำ (Managers)</span>
                    <strong>${pcts.managers || 0}%</strong>
                  </div>
                  <div class="g-track"><div class="g-fill" style="width: ${pcts.managers || 0}%; background: #8b5cf6;"></div></div>
                </div>

                <div class="guild-gauge-item">
                  <div class="g-gauge-head">
                    <span><i class="fa-solid fa-wand-magic-sparkles" style="color: #ec4899;"></i> ผู้เนรมิต (Creators)</span>
                    <strong>${pcts.creators || 0}%</strong>
                  </div>
                  <div class="g-track"><div class="g-fill" style="width: ${pcts.creators || 0}%; background: #ec4899;"></div></div>
                </div>

                <div class="guild-gauge-item">
                  <div class="g-gauge-head">
                    <span><i class="fa-solid fa-coins" style="color: #f59e0b;"></i> จอมเวททรัพย์ (Financiers)</span>
                    <strong>${pcts.financiers || 0}%</strong>
                  </div>
                  <div class="g-track"><div class="g-fill" style="width: ${pcts.financiers || 0}%; background: #f59e0b;"></div></div>
                </div>

                <div class="guild-gauge-item">
                  <div class="g-gauge-head">
                    <span><i class="fa-solid fa-heart-circle-bolt" style="color: #10b981;"></i> มิตรสหาย (Connectors)</span>
                    <strong>${pcts.connectors || 0}%</strong>
                  </div>
                  <div class="g-track"><div class="g-fill" style="width: ${pcts.connectors || 0}%; background: #10b981;"></div></div>
                </div>
              </div>
            </div>

            <!-- Awakened Light vs Cozy Recharge Mode -->
            <div class="cat-dual-modes-grid">
              <div class="cat-mode-card mode-light">
                <div class="cat-mode-head">
                  <i class="fa-solid fa-sun" style="color: #fbbf24;"></i>
                  <h4>โหมดแมวเปล่งประกาย (Awakened Light)</h4>
                </div>
                <p>${cat.awakenedMode}</p>
              </div>

              <div class="cat-mode-card mode-recharge">
                <div class="cat-mode-head">
                  <i class="fa-solid fa-couch" style="color: #c084fc;"></i>
                  <h4>โหมดแมวพักชาร์จแบต (Cozy Recharge)</h4>
                </div>
                <p>${cat.rechargeMode}</p>
              </div>
            </div>

            <!-- Cat Chemistry -->
            <div class="cat-chemistry-box">
              <div class="cat-chem-item">
                <i class="fa-solid fa-heart" style="color: #ec4899;"></i>
                <div>
                  <strong>แมวคู่แท้เคมีลงตัว (Best Partner):</strong>
                  <span>${cat.catChemistry.bestPartner}</span>
                </div>
              </div>
              <div class="cat-chem-item">
                <i class="fa-solid fa-bolt" style="color: #3b82f6;"></i>
                <div>
                  <strong>แมวคู่ท้าทายช่วยให้เติบโต (Growth Partner):</strong>
                  <span>${cat.catChemistry.growthPartner}</span>
                </div>
              </div>
            </div>

          </div>
        `;
      }

      // 2. Element balance tag if chart is available
      let chartBadgeHtml = '';
      if (chart && chart.pillars) {
        chartBadgeHtml = `
          <div class="personality-bazi-pills">
            <span class="p-pill"><strong>เสาปี:</strong> ${chart.pillars.year.stem.zh}${chart.pillars.year.branch.zh}</span>
            <span class="p-pill"><strong>เสาเดือน:</strong> ${chart.pillars.month.stem.zh}${chart.pillars.month.branch.zh}</span>
            <span class="p-pill active-day"><strong>เสาวัน (Soul Core):</strong> ${chart.pillars.day.stem.zh}${chart.pillars.day.branch.zh}</span>
            <span class="p-pill"><strong>เสายาม:</strong> ${chart.pillars.hour.stem.zh}${chart.pillars.hour.branch.zh}</span>
            <span class="p-pill strength">${chart.strengthText}</span>
          </div>
        `;
      }

      resultContainer.innerHTML = `
        <div class="personality-card-wrapper animate-fade-in">
          
          ${catSectionHtml}

          <!-- 60 Jia Zi Soul Core Hero Banner -->
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
            <button type="button" class="p-btn-action story-btn" id="personalityStoryBtn">
              <i class="fa-solid fa-camera-retro"></i> การ์ด Story (9:16)
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

      resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
