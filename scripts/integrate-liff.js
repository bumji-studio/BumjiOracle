import fs from 'fs';
import path from 'path';

const htmlPath = path.resolve('index.html');
const cssPath = path.resolve('styles.css');
const appPath = path.resolve('app.js');

let html = fs.readFileSync(htmlPath, 'utf8');
let css = fs.readFileSync(cssPath, 'utf8');
let app = fs.readFileSync(appPath, 'utf8');

// 1. In index.html: Add LINE LIFF SDK script in head
if (!html.includes('static.line-scdn.net/liff/edge/2/sdk.js')) {
  html = html.replace(
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>',
    `<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
  <!-- LINE LIFF SDK -->
  <script charset="utf-8" src="https://static.line-scdn.net/liff/edge/2/sdk.js"></script>`
  );
  console.log('Added LIFF SDK script tag to index.html');
}

// In index.html: Add LINE user profile badge in header
if (!html.includes('id="lineUserBadge"')) {
  html = html.replace(
    '<span class="standalone-badge"><i class="fa-solid fa-bolt"></i> Standalone Mode</span>',
    `<span class="standalone-badge"><i class="fa-solid fa-bolt"></i> Standalone Mode</span>
      <div id="lineUserBadge" class="line-user-badge hidden">
        <img id="lineUserAvatar" src="" class="line-user-avatar" alt="LINE Avatar">
        <span id="lineUserName" class="line-user-name">LINE User</span>
      </div>`
  );
  console.log('Added lineUserBadge to header in index.html');
}

// In index.html: Add Share to LINE button in Step 4 Toolbar
if (!html.includes('id="shareToLineBtn"')) {
  html = html.replace(
    `<button class="btn btn-secondary-sm" id="copyResultTextBtn">
              <i class="fa-solid fa-copy"></i> คัดลอกคำทำนาย
            </button>`,
    `<button class="btn btn-line-share hidden" id="shareToLineBtn" title="แชร์ผลทำนายลงแชท LINE">
              <i class="fa-brands fa-line"></i> แชร์ลง LINE
            </button>
            <button class="btn btn-secondary-sm" id="copyResultTextBtn">
              <i class="fa-solid fa-copy"></i> คัดลอกคำทำนาย
            </button>`
  );
  console.log('Added shareToLineBtn to Step 4 toolbar in index.html');
}

fs.writeFileSync(htmlPath, html, 'utf8');

// 2. In styles.css: Add styling for .line-user-badge and .btn-line-share
const liffCSS = `
/* ============================================================
   LINE LIFF INTEGRATION STYLES
   ============================================================ */
.line-user-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(6, 199, 85, 0.15);
  border: 1px solid rgba(6, 199, 85, 0.4);
  padding: 4px 12px 4px 6px;
  border-radius: 20px;
  backdrop-filter: blur(8px);
  animation: modernFadeIn 0.4s ease;
}

.line-user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid #06c755;
}

.line-user-name {
  font-family: 'Prompt', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #a7f3d0;
}

.btn-line-share {
  background: linear-gradient(135deg, #06c755, #05b04b) !important;
  color: #ffffff !important;
  border: none !important;
  border-radius: 12px !important;
  padding: 8px 16px !important;
  font-family: 'Prompt', sans-serif !important;
  font-size: 13px !important;
  font-weight: 700 !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  cursor: pointer !important;
  box-shadow: 0 4px 16px rgba(6, 199, 85, 0.4) !important;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
}

.btn-line-share:hover {
  transform: translateY(-2px) scale(1.03) !important;
  box-shadow: 0 6px 22px rgba(6, 199, 85, 0.6) !important;
}

.btn-line-share i {
  font-size: 16px;
}
`;

if (!css.includes('LINE LIFF INTEGRATION STYLES')) {
  css += '\n' + liffCSS;
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Added LIFF CSS styles to styles.css');
}

// 3. In app.js: Initialize LIFF and wire up shareToLineBtn
const liffLogic = `
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
      step1Title.innerHTML = \`สวัสดีคุณ \${profile.displayName} ✨ จักรวาลพร้อมตอบ 🔮\`;
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

    const shareText = \`🔮 ผลทำนายไพ่: \${deckName}
💬 คำถาม: "\${question}"

1️⃣ ปัจจุบัน: \${card1Name}
2️⃣ กลยุทธ์/ทางออก: \${card2Name}
3️⃣ บทสรุป: \${card3Name}

✨ เปิดไพ่ดูดวงด้วยตัวเองได้ที่:
https://liff.line.me/2011798499-hm8dJi7C\`;

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
`;

if (!app.includes('LINE LIFF INTEGRATION')) {
  // Append before the closing of DOMContentLoaded or at end of file
  app += '\n' + liffLogic;
  fs.writeFileSync(appPath, app, 'utf8');
  console.log('Added LIFF logic to app.js');
}

console.log('All LIFF integration files updated!');
