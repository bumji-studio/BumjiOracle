import fs from 'fs';
import path from 'path';

const cssPath = path.resolve('styles.css');
const htmlPath = path.resolve('index.html');

console.log('Reading files...');
let cssContent = fs.readFileSync(cssPath, 'utf8');
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// ============================================================================
// 1. UPDATE index.html (Youthful modern texts, icons & subtitle)
// ============================================================================

// Header logo icon & title
htmlContent = htmlContent.replace(
  '<i class="fa-solid fa-wand-magic-sparkles logo-icon" style="color: #f59e0b; font-size: 26px;"></i>',
  '<i class="fa-solid fa-wand-magic-sparkles logo-icon"></i>'
);

htmlContent = htmlContent.replace(
  '<span class="subtitle">ระบบพยากรณ์ไพ่ศักดิ์สิทธิ์ 2 สำรับ &amp; สตูดิโอคู่มือ A4</span>',
  '<span class="subtitle">✨ ดูดวงไพ่ทาโรต์ x แก๊งเหมียวนุ่มฟู • สไตล์โมเดิร์นวัยรุ่น</span>'
);

// Step 1 texts: make it fun, friendly & youthful
htmlContent = htmlContent.replace(
  '<h2 class="step1-title">ตั้งจิตอธิษฐาน &amp; ระบุคำถามของคุณ</h2>',
  '<h2 class="step1-title">ถามอะไรก็ได้... จักรวาลพร้อมตอบ 🔮✨</h2>'
);

htmlContent = htmlContent.replace(
  `<p class="step1-desc">
            จงทำจิตใจให้สงบ มีสมาธิอยู่กับสิ่งที่คุณกำลังต้องการคำตอบ จากนั้นพิมพ์คำถามลงในช่องด้านล่างเพื่อเริ่มการทำนาย
          </p>`,
  `<p class="step1-desc">
            พิมพ์เรื่องที่อยากรู้ในใจ หรือแตะเลือกหัวข้อยอดฮิตด้านล่างได้เลย ไพ่พร้อมเปิดชะตาให้แล้ว!
          </p>`
);

htmlContent = htmlContent.replace(
  'placeholder="พิมพ์คำถามของคุณที่นี่ เช่น การงานและการเงินในเดือนนี้จะเป็นอย่างไร? / ความสัมพันธ์กับคนคุยมีแนวโน้มอย่างไร? / ควรตัดสินใจอย่างไรกับทางแยกชีวิตตอนนี้..."',
  'placeholder="พิมพ์คำถามที่อยากรู้ เช่น คนคุยคนนี้คิดยังไงกับเรา? / สัมภาษณ์งานรอบนี้จะผ่านไหม? / ปีนี้จะมีโชคมีเงินเปย์ตัวเองรัวๆ ไหม..."'
);

htmlContent = htmlContent.replace(
  '<span class="chips-label"><i class="fa-solid fa-lightbulb"></i> ตัวอย่างคำถามยอดนิยม:</span>',
  '<span class="chips-label"><i class="fa-solid fa-fire text-pink"></i> หัวข้อฮิตวัยรุ่น อยากรู้เรื่องไหนจิ้มเลย:</span>'
);

// Youthful suggestion chips
const oldChips = `<div class="chips-grid">
              <button type="button" class="chip-btn" data-question="ทิศทางการงานและโอกาสก้าวหน้าในช่วงนี้จะเป็นอย่างไร?">
                <i class="fa-solid fa-briefcase"></i> ทิศทางการงาน
              </button>
              <button type="button" class="chip-btn" data-question="การเงินและโชคลาภในช่วงนี้ ควรวางแผนหรือระวังสิ่งใด?">
                <i class="fa-solid fa-coins"></i> การเงิน &amp; โชคลาภ
              </button>
              <button type="button" class="chip-btn" data-question="ความสัมพันธ์และความรักในช่วงนี้ มีแนวโน้มพัฒนาอย่างไร?">
                <i class="fa-solid fa-heart"></i> ความรัก &amp; คนคุย
              </button>
              <button type="button" class="chip-btn" data-question="สิ่งที่ควรระวังและกลยุทธ์ที่ดีที่สุดในการรับมือสถานการณ์ตอนนี้?">
                <i class="fa-solid fa-shield-halved"></i> กลยุทธ์รับมือปัญหา
              </button>
              <button type="button" class="chip-btn" data-question="ภาพรวมพลังงานชีวิตและคำแนะนำชี้แนะประจำวัน">
                <i class="fa-solid fa-compass"></i> ภาพรวมดวงชะตา
              </button>
            </div>`;

const newChips = `<div class="chips-grid">
              <button type="button" class="chip-btn chip-pink" data-question="ความสัมพันธ์และความรักตอนนี้ เค้าคิดยังไงกับเรา? มีแนวโน้มพัฒนาไหม?">
                <i class="fa-solid fa-heart"></i> 💖 เรื่องรัก &amp; คนคุย
              </button>
              <button type="button" class="chip-btn chip-purple" data-question="ทิศทางการงาน โปรเจกต์ หรือการสัมภาษณ์งานรอบนี้ จะปังไหม?">
                <i class="fa-solid fa-bolt"></i> 💼 งาน &amp; โปรเจกต์ใหม่
              </button>
              <button type="button" class="chip-btn chip-cyan" data-question="การเงินและโชคลาภช่วงนี้ จะมีเงินเข้ามาเปย์ตัวเองรัวๆ ไหม?">
                <i class="fa-solid fa-coins"></i> 💸 การเงิน &amp; โชคลาภ
              </button>
              <button type="button" class="chip-btn chip-amber" data-question="สภาพจิตใจและเอเนอร์จี้ช่วงนี้ มีคำแนะนำอะไรให้สดชื่นขึ้นบ้าง?">
                <i class="fa-solid fa-cat"></i> 🐱 พักใจ &amp; บูสต์พลังบวก
              </button>
              <button type="button" class="chip-btn chip-green" data-question="ทางแก้และกลยุทธ์ที่ดีที่สุดในการผ่านอุปสรรคช่วงนี้ไปให้ได้">
                <i class="fa-solid fa-compass"></i> ⚡ ทางออก &amp; กลยุทธ์
              </button>
              <button type="button" class="chip-btn chip-blue" data-question="ภาพรวมโชคชะตาและเรื่องดีๆ ที่กำลังจะวิ่งเข้ามาหาเรา">
                <i class="fa-solid fa-sparkles"></i> 🚀 สรุปภาพรวมชะตา
              </button>
            </div>`;

if (htmlContent.includes(oldChips)) {
  htmlContent = htmlContent.replace(oldChips, newChips);
}

// Step 1 proceed button text
htmlContent = htmlContent.replace(
  'ต่อไป: เลือกชุดไพ่ที่จะใช้ทำนาย <i class="fa-solid fa-arrow-right"></i>',
  'ไปเลือกสำรับไพ่กันเลย ✨ <i class="fa-solid fa-arrow-right"></i>'
);

// Step 2 Title & sub
htmlContent = htmlContent.replace(
  '<h2 class="step-title"><i class="fa-solid fa-layer-group"></i> เลือกชุดไพ่ที่ต้องการใช้ทำนาย</h2>',
  '<h2 class="step-title"><i class="fa-solid fa-layer-group"></i> เลือกสำรับที่ใช่สำหรับคำถามนี้</h2>'
);

htmlContent = htmlContent.replace(
  '<p class="step-desc">แต่ละชุดไพ่มีเอกลักษณ์ ปรัชญา และแนวคำตอบที่แตกต่างกัน เลือกสำรับที่ตรงกับจริตและคำถามของคุณ</p>',
  '<p class="step-desc">ชอบสไตล์ไหนเลือกได้เลย: ไพ่เทพจีนสายกลยุทธ์คมชัด หรือ แก๊งแมวนุ่มฟูฮีลใจอบอุ่น</p>'
);

// Write back updated index.html
fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('Updated index.html successfully!');


// ============================================================================
// 2. UPDATE styles.css (Youthful Cyber-Neon / Neo-Glass Aesthetic)
// ============================================================================

// Replace the split starting from TAROT READING APP VIEW
const splitMarker = '/* ==========================================================================\n   TAROT READING APP VIEW';
const markerIdx = cssContent.indexOf(splitMarker);

let basePart = cssContent;
if (markerIdx !== -1) {
  basePart = cssContent.substring(0, markerIdx);
} else {
  // Try finding by readingAppView
  const appIdx = cssContent.indexOf('#readingAppView');
  if (appIdx !== -1) {
    basePart = cssContent.substring(0, appIdx - 100);
  }
}

// In basePart, make sure header styling is vibrant neon & modern font
basePart = basePart.replace(
  `/* Header Styles */
.app-header {
  background: rgba(11, 15, 25, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  z-index: 10;
}`,
  `/* Header Styles - Ultra Modern Youthful */
.app-header {
  background: rgba(10, 14, 28, 0.88);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
  padding: 14px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  z-index: 10;
}`
);

// Header Logo & Nav Tabs in basePart
basePart = basePart.replace(
  `.logo-icon {
  font-size: 28px;
  color: var(--color-gold);
  text-shadow: 0 0 10px var(--color-gold-glow);
  animation: pulse-gold 3s infinite alternate;
}

.header-logo h1 {
  font-family: var(--font-en);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 2px;
  background: linear-gradient(to right, var(--color-gold-light), var(--color-gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-logo .subtitle {
  font-size: 11px;
  color: var(--color-text-muted);
  letter-spacing: 1px;
  display: block;
}`,
  `.logo-icon {
  font-size: 28px;
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 12px rgba(236, 72, 153, 0.6));
  animation: modernSparkle 3s infinite alternate ease-in-out;
}

@keyframes modernSparkle {
  0% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.5)); }
  100% { transform: scale(1.12) rotate(8deg); filter: drop-shadow(0 0 18px rgba(56, 189, 248, 0.8)); }
}

.header-logo h1 {
  font-family: 'Outfit', -apple-system, sans-serif;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 1.5px;
  background: linear-gradient(135deg, #ffffff 0%, #c084fc 40%, #f472b6 75%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-logo .subtitle {
  font-family: 'Prompt', -apple-system, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #94a3b8;
  letter-spacing: 0.3px;
  display: block;
}

.header-nav-tabs {
  display: flex;
  gap: 6px;
  background: rgba(18, 24, 46, 0.85);
  padding: 5px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
}

.nav-tab {
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 8px 18px;
  border-radius: 20px;
  font-family: 'Prompt', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.25s ease;
}

.nav-tab:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

.nav-tab.active {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  color: #ffffff;
  font-weight: 700;
  box-shadow: 0 4px 18px rgba(236, 72, 153, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.2);
}`
);

// Youthful Modern Divination CSS
const youthfulDivinationCSS = `/* ==========================================================================
   TAROT READING APP VIEW - ULTRA-MODERN YOUTHFUL CYBER-NEO DESIGN SYSTEM
   Theme: Vibrant Cyber Violet (#8b5cf6), Neon Pink (#ec4899), Cyber Cyan (#06b6d4)
   ========================================================================== */

#readingAppView {
  background: radial-gradient(ellipse at 15% 15%, rgba(139, 92, 246, 0.28) 0%, transparent 48%),
              radial-gradient(ellipse at 85% 15%, rgba(236, 72, 153, 0.24) 0%, transparent 52%),
              radial-gradient(ellipse at 50% 85%, rgba(6, 182, 212, 0.2) 0%, transparent 55%),
              #080b18;
  color: #f8fafc;
  font-family: 'Outfit', 'Prompt', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow-y: auto;
  padding: 34px 24px;
  box-sizing: border-box;
}

.reading-app-container {
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 70px;
}

/* Standalone Status Badge */
.standalone-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.16), rgba(139, 92, 246, 0.16));
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.35);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.5px;
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);
}

/* YOUTHFUL STEPPER PROGRESS BAR */
.reading-stepper {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 860px;
  margin: 0 auto 36px auto;
  padding: 12px 24px;
}

.stepper-track {
  position: absolute;
  top: 50%;
  left: 60px;
  right: 60px;
  height: 3px;
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-50%);
  z-index: 1;
  border-radius: 4px;
}

.stepper-fill {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6 0%, #ec4899 50%, #06b6d4 100%);
  border-radius: 4px;
  transition: width 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 18px rgba(236, 72, 153, 0.65);
}

.stepper-step {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  background: transparent;
}

.step-num {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(18, 24, 46, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #94a3b8;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.step-label {
  font-family: 'Prompt', sans-serif;
  font-size: 13.5px;
  font-weight: 500;
  color: #94a3b8;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.stepper-step.active .step-num {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: #ffffff;
  border-color: #f472b6;
  box-shadow: 0 0 25px rgba(236, 72, 153, 0.75);
  transform: scale(1.18);
}

.stepper-step.active .step-label {
  color: #f472b6;
  font-weight: 700;
  text-shadow: 0 0 12px rgba(236, 72, 153, 0.5);
}

.stepper-step.completed .step-num {
  background: linear-gradient(135deg, #06b6d4, #10b981);
  color: #ffffff;
  border-color: #34d399;
  box-shadow: 0 0 14px rgba(6, 182, 212, 0.4);
}

.stepper-step.completed .step-label {
  color: #38bdf8;
}

/* PINNED CONTEXT BAR */
.pinned-context-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: rgba(22, 28, 54, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(236, 72, 153, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35), 0 0 20px rgba(139, 92, 246, 0.15);
  border-radius: 18px;
  padding: 14px 24px;
  max-width: 980px;
  margin: 0 auto 30px auto;
  animation: modernFadeIn 0.35s ease;
}

.context-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-gold {
  color: #ec4899;
  font-size: 20px;
}

.context-text {
  display: flex;
  flex-direction: column;
}

.context-label {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.context-val {
  font-family: 'Prompt', sans-serif;
  font-size: 15px;
  color: #ffffff;
  max-width: 480px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* YOUTHFUL STEP CARD CONTAINER */
.reading-step-card {
  max-width: 1080px;
  margin: 0 auto;
  background: rgba(18, 24, 46, 0.8);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 26px;
  padding: 42px 38px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

/* ============================================================
   STEP 1: QUESTION INPUT (TRENDY & ENGAGING)
   ============================================================ */
.step1-hero {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 34px auto;
}

.sparkle-orbit {
  width: 74px;
  height: 74px;
  margin: 0 auto 20px auto;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.35) 0%, rgba(139, 92, 246, 0.2) 100%);
  border: 2px solid rgba(236, 72, 153, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 35px rgba(236, 72, 153, 0.5);
  position: relative;
  animation: neoOrbit 3s infinite ease-in-out;
}

@keyframes neoOrbit {
  0%, 100% { transform: scale(1) rotate(0deg); box-shadow: 0 0 30px rgba(236, 72, 153, 0.4); }
  50% { transform: scale(1.1) rotate(6deg); box-shadow: 0 0 45px rgba(139, 92, 246, 0.65); }
}

.step1-main-icon {
  font-size: 32px;
  color: #f472b6;
}

.step1-title {
  font-family: 'Prompt', 'Outfit', sans-serif;
  font-size: 30px;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #c084fc 40%, #f472b6 80%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.step1-desc {
  font-family: 'Prompt', sans-serif;
  font-size: 15.5px;
  line-height: 1.7;
  color: #94a3b8;
}

.question-input-box-wrapper {
  max-width: 820px;
  margin: 0 auto;
}

.question-textarea-container {
  position: relative;
  background: rgba(11, 15, 30, 0.7);
  border: 1.5px solid rgba(255, 255, 255, 0.14);
  border-radius: 20px;
  padding: 20px 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5);
}

.question-textarea-container:focus-within {
  border-color: #ec4899;
  background: rgba(11, 15, 30, 0.9);
  box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.25), 0 0 30px rgba(236, 72, 153, 0.3);
}

.question-textarea {
  width: 100%;
  border: none;
  background: transparent;
  font-family: 'Prompt', sans-serif;
  font-size: 16.5px;
  line-height: 1.6;
  color: #ffffff;
  resize: vertical;
  min-height: 84px;
  outline: none;
}

.question-textarea::placeholder {
  color: #64748b;
  font-family: 'Prompt', sans-serif;
}

.textarea-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn-clear-text {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
  font-size: 12px;
  cursor: pointer;
  padding: 5px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-clear-text:hover {
  background: rgba(239, 68, 68, 0.25);
  color: #fca5a5;
  border-color: rgba(239, 68, 68, 0.5);
}

/* Suggestion Chips */
.suggestion-chips-area {
  margin-top: 26px;
}

.chips-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Prompt', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #fbcfe8;
  margin-bottom: 14px;
}

.chips-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.chip-btn {
  background: rgba(22, 28, 54, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 11px 20px;
  border-radius: 30px;
  font-family: 'Prompt', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  color: #e2e8f0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
  backdrop-filter: blur(10px);
}

.chip-btn:hover {
  transform: translateY(-4px) scale(1.03);
  color: #ffffff;
}

.chip-pink:hover {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.35), rgba(244, 63, 94, 0.35));
  border-color: #ec4899;
  box-shadow: 0 8px 24px rgba(236, 72, 153, 0.45);
}

.chip-purple:hover {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.35), rgba(168, 85, 247, 0.35));
  border-color: #a855f7;
  box-shadow: 0 8px 24px rgba(168, 85, 247, 0.45);
}

.chip-cyan:hover {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.35), rgba(56, 189, 248, 0.35));
  border-color: #38bdf8;
  box-shadow: 0 8px 24px rgba(56, 189, 248, 0.45);
}

.chip-amber:hover {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.35), rgba(251, 191, 36, 0.35));
  border-color: #fbbf24;
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.45);
}

.chip-green:hover {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.35), rgba(52, 211, 153, 0.35));
  border-color: #34d399;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.45);
}

.chip-blue:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.35), rgba(99, 102, 241, 0.35));
  border-color: #60a5fa;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.45);
}

.step1-action-row {
  margin-top: 38px;
  text-align: center;
}

/* Trendy Primary Button */
.btn-primary {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f43f5e 100%) !important;
  color: #ffffff !important;
  border: none !important;
  border-radius: 16px;
  font-family: 'Prompt', sans-serif;
  font-weight: 700;
  padding: 15px 32px;
  box-shadow: 0 8px 30px rgba(236, 72, 153, 0.5);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 12px 36px rgba(236, 72, 153, 0.7);
}

.btn-lg {
  padding: 16px 38px;
  font-size: 16.5px;
}

.pulse-glow {
  animation: trendyPulse 2.5s infinite;
}

@keyframes trendyPulse {
  0% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.65); }
  70% { box-shadow: 0 0 0 20px rgba(236, 72, 153, 0); }
  100% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
}

/* ============================================================
   STEP 2: COLLECTION SELECTION (YOUTHFUL 3D CARDS)
   ============================================================ */
.step-header-with-back {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.step-title-group .step-title {
  font-family: 'Prompt', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 6px;
}

.step-title-group .step-desc {
  font-size: 14px;
  color: #94a3b8;
}

.collection-selection-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  margin-top: 30px;
}

@media (max-width: 880px) {
  .collection-selection-grid {
    grid-template-columns: 1fr;
  }
}

.collection-card {
  position: relative;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
  padding: 28px;
  display: flex;
  flex-direction: column;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  backdrop-filter: blur(20px);
}

.collection-card:hover {
  transform: translateY(-10px) scale(1.02);
}

/* JiuTian Card: Cyber-Celestial / Anime Fantasy */
.deck-jiutian {
  border-color: rgba(56, 189, 248, 0.35);
  background: linear-gradient(180deg, rgba(20, 26, 54, 0.95) 0%, rgba(11, 15, 34, 0.95) 100%);
}

.deck-jiutian:hover {
  border-color: #38bdf8;
  box-shadow: 0 25px 55px rgba(56, 189, 248, 0.3), 0 0 30px rgba(139, 92, 246, 0.3);
}

.badge-jiutian {
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.2));
  color: #7dd3fc;
  border: 1px solid rgba(56, 189, 248, 0.4);
}

/* Bumji Card: Kawaii Y2K / Cozy Pastel */
.deck-bumji {
  border-color: rgba(244, 63, 94, 0.35);
  background: linear-gradient(180deg, rgba(38, 16, 40, 0.95) 0%, rgba(20, 10, 26, 0.95) 100%);
}

.deck-bumji:hover {
  border-color: #ec4899;
  box-shadow: 0 25px 55px rgba(236, 72, 153, 0.35), 0 0 30px rgba(244, 63, 94, 0.3);
}

.badge-bumji {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.25), rgba(244, 63, 94, 0.25));
  color: #fbcfe8;
  border: 1px solid rgba(244, 63, 94, 0.4);
}

.collection-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  padding: 7px 18px;
  border-radius: 20px;
  font-family: 'Prompt', sans-serif;
  font-size: 12.5px;
  font-weight: 700;
  margin-bottom: 22px;
}

.collection-card-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.collection-media-box {
  position: relative;
  width: 100%;
  height: 270px;
  border-radius: 18px;
  overflow: hidden;
  background: #060814;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.collection-box-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.collection-card:hover .collection-box-img {
  transform: scale(1.08);
}

.deck-count-badge {
  position: absolute;
  bottom: 14px;
  right: 14px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  color: #38bdf8;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 700;
  border: 1px solid rgba(56, 189, 248, 0.4);
}

.deck-count-badge.badge-cat {
  color: #fbcfe8;
  border-color: rgba(236, 72, 153, 0.5);
}

.collection-name {
  font-family: 'Prompt', sans-serif;
  font-size: 23px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 4px;
}

.collection-tagline {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 18px;
}

/* Style Highlight Boxes */
.collection-style-box {
  border-radius: 16px;
  padding: 18px 20px;
  margin-bottom: 20px;
  backdrop-filter: blur(15px);
}

.style-jiutian {
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-left: 5px solid #38bdf8;
}

.style-bumji {
  background: rgba(236, 72, 153, 0.08);
  border: 1px solid rgba(236, 72, 153, 0.3);
  border-left: 5px solid #ec4899;
}

.style-header {
  font-family: 'Prompt', sans-serif;
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 8px;
}

.style-desc {
  font-size: 13.5px;
  line-height: 1.7;
  color: #cbd5e1;
}

.collection-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  flex-grow: 1;
}

.collection-features li {
  font-size: 13.5px;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.text-gold {
  color: #38bdf8;
}

.text-paw {
  color: #ec4899;
}

.btn-cat {
  background: linear-gradient(135deg, #ec4899, #f43f5e) !important;
  color: #ffffff !important;
  border: none;
  font-family: 'Prompt', sans-serif;
  font-weight: 700;
  padding: 15px 22px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 6px 25px rgba(236, 72, 153, 0.5);
}

.btn-cat:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 10px 32px rgba(236, 72, 153, 0.65);
}

.btn-block {
  width: 100%;
}

/* ============================================================
   STEP 3: PICK 3 CARDS (NEON SLOTS & 3D FAN)
   ============================================================ */
.pick-slots-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin: 30px 0;
}

@media (max-width: 800px) {
  .pick-slots-container {
    grid-template-columns: 1fr;
  }
}

.pick-target-slot {
  background: rgba(11, 15, 30, 0.6);
  border: 2px dashed rgba(255, 255, 255, 0.16);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.pick-target-slot.active-pick {
  border-color: #ec4899;
  background: rgba(236, 72, 153, 0.08);
  box-shadow: 0 0 25px rgba(236, 72, 153, 0.3);
  transform: translateY(-5px);
}

.pick-target-slot.slot-filled {
  border-style: solid;
  border-color: #a855f7;
  background: rgba(22, 28, 54, 0.9);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(168, 85, 247, 0.3);
}

.slot-pos-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Prompt', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #fbcfe8;
  margin-bottom: 16px;
}

.badge-num {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  box-shadow: 0 0 12px rgba(236, 72, 153, 0.5);
}

.slot-card-holder {
  width: 146px;
  height: 228px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  background: rgba(18, 24, 46, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.slot-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #64748b;
  font-size: 12.5px;
  padding: 10px;
}

.slot-placeholder i {
  font-size: 32px;
  color: rgba(236, 72, 153, 0.5);
}

.slot-filled-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 14px;
}

.slot-desc-text {
  font-size: 12.5px;
  color: #94a3b8;
  line-height: 1.55;
}

/* Pick Controls Bar */
.pick-controls-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  background: rgba(11, 15, 30, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 15px 22px;
  margin-bottom: 28px;
  backdrop-filter: blur(15px);
}

.pick-current-instruction {
  font-family: 'Prompt', sans-serif;
  font-size: 15px;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
}

.pick-quick-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-secondary-sm {
  background: rgba(255, 255, 255, 0.08) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.14) !important;
  border-radius: 12px !important;
  padding: 8px 16px !important;
  font-family: 'Prompt', sans-serif !important;
  font-size: 13px !important;
  transition: all 0.25s ease !important;
}

.btn-secondary-sm:hover {
  background: rgba(255, 255, 255, 0.16) !important;
  border-color: #ec4899 !important;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3) !important;
  transform: translateY(-2px);
}

/* Interactive Fan Stage */
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
}

/* Reveal Trigger Banner */
.reveal-trigger-banner {
  margin-top: 30px;
  background: linear-gradient(135deg, rgba(22, 28, 54, 0.95), rgba(45, 20, 50, 0.95));
  border: 2px solid #ec4899;
  border-radius: 22px;
  padding: 28px 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 26px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(236, 72, 153, 0.5);
}

@media (max-width: 768px) {
  .reveal-trigger-banner {
    flex-direction: column;
    text-align: center;
  }
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 22px;
  color: #ffffff;
}

.banner-icon {
  font-size: 36px;
  color: #f472b6;
}

.banner-content h3 {
  font-family: 'Prompt', sans-serif;
  font-size: 20px;
  margin-bottom: 4px;
  color: #fbcfe8;
}

.banner-content p {
  font-size: 14px;
  color: #cbd5e1;
}

.btn-xl {
  padding: 16px 38px;
  font-size: 17px;
  font-weight: 800;
  border-radius: 18px;
  white-space: nowrap;
}

/* ============================================================
   STEP 4: DIVINATION RESULTS & SYNTHESIS (NEO POP)
   ============================================================ */
.result-header-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.result-question-banner {
  background: rgba(11, 15, 30, 0.7);
  border: 1px solid rgba(236, 72, 153, 0.35);
  border-radius: 20px;
  padding: 24px 30px;
  margin-bottom: 34px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(236, 72, 153, 0.15);
  backdrop-filter: blur(15px);
}

.banner-badge-group {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.badge-deck {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  color: #ffffff;
  font-family: 'Prompt', sans-serif;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 16px;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(236, 72, 153, 0.35);
}

.badge-deck.deck-cat {
  background: linear-gradient(135deg, #ec4899, #f43f5e);
}

.badge-spread, .badge-date {
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-size: 12px;
  padding: 5px 14px;
  border-radius: 20px;
}

.result-question-title {
  font-family: 'Prompt', sans-serif;
  font-size: 23px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.5;
}

/* 3 Cards Visual Board */
.result-cards-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  margin-bottom: 38px;
}

@media (max-width: 880px) {
  .result-cards-board {
    grid-template-columns: 1fr;
  }
}

.result-card-item {
  background: rgba(22, 28, 54, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 22px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  backdrop-filter: blur(20px);
}

.result-card-item:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(236, 72, 153, 0.5);
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.55), 0 0 25px rgba(236, 72, 153, 0.3);
}

.result-pos-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.result-pos-title {
  font-family: 'Prompt', sans-serif;
  font-size: 15.5px;
  font-weight: 800;
  color: #fbcfe8;
}

.result-card-media {
  width: 100%;
  height: 295px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 18px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45);
  background: #060814;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.result-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-card-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.result-card-name {
  font-family: 'Prompt', sans-serif;
  font-size: 19px;
  font-weight: 800;
  color: #ffffff;
}

.result-tag-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.result-tag {
  font-size: 12px;
  background: rgba(236, 72, 153, 0.15);
  border: 1px solid rgba(236, 72, 153, 0.35);
  padding: 4px 12px;
  border-radius: 14px;
  color: #fbcfe8;
  font-weight: 600;
}

.result-pos-meaning {
  background: rgba(11, 15, 30, 0.65);
  border-left: 4px solid #ec4899;
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 13.8px;
  line-height: 1.7;
  color: #e2e8f0;
  margin-top: 4px;
}

.result-card-quote {
  font-size: 13px;
  font-style: italic;
  color: #94a3b8;
  line-height: 1.6;
  margin-top: 8px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.result-card-quote i {
  color: #f472b6;
  margin-top: 3px;
}

/* Synthesis Section */
.result-synthesis-container {
  background: rgba(22, 28, 54, 0.9);
  border: 1px solid rgba(236, 72, 153, 0.4);
  border-radius: 24px;
  padding: 34px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(236, 72, 153, 0.2);
  backdrop-filter: blur(25px);
}

.synthesis-header-block {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 26px;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.synthesis-header-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 0 24px rgba(139, 92, 246, 0.5);
}

.synthesis-header-icon.cat-theme {
  background: linear-gradient(135deg, #ec4899, #f43f5e);
  color: #fff;
  box-shadow: 0 0 24px rgba(236, 72, 153, 0.5);
}

.synthesis-title {
  font-family: 'Prompt', sans-serif;
  font-size: 23px;
  font-weight: 800;
  color: #ffffff;
}

.synthesis-sub {
  font-size: 14px;
  color: #94a3b8;
}

.synthesis-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

@media (max-width: 768px) {
  .synthesis-cards-grid {
    grid-template-columns: 1fr;
  }
}

.synthesis-card-box {
  background: rgba(11, 15, 30, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 22px;
}

.synthesis-card-box.theme-cat {
  background: rgba(35, 15, 36, 0.65);
  border-color: rgba(236, 72, 153, 0.3);
}

.synthesis-box-title {
  font-family: 'Prompt', sans-serif;
  font-size: 16.5px;
  font-weight: 800;
  color: #fbcfe8;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.synthesis-box-title.text-cat {
  color: #f472b6;
}

.synthesis-box-body {
  font-size: 14.5px;
  line-height: 1.75;
  color: #cbd5e1;
}

/* Animations */
.animate-fade-in {
  animation: modernFadeIn 0.4s ease-out forwards;
}

@keyframes modernFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-bounce-soft {
  animation: modernBounce 2s infinite ease-in-out;
}

@keyframes modernBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
`;

fs.writeFileSync(cssPath, basePart + '\n' + youthfulDivinationCSS, 'utf8');
console.log('Updated styles.css with youthful modern theme!');
