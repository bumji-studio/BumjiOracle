const fs = require('fs');

console.log('--- 1. Updating index.html ---');
let html = fs.readFileSync('index.html', 'utf8');

// Target 1: Remove toolbar-right (copyResultTextBtn & direct-social-share-group) from result-header-toolbar
const oldToolbarRegex = /<div class="toolbar-right">[\s\S]*?<\/div>\s*<\/div>/;
if (!oldToolbarRegex.test(html)) {
  console.error('Could not find toolbar-right in index.html');
  process.exit(1);
}
html = html.replace(oldToolbarRegex, '</div>');

// Target 2: Insert Bottom Share Section right after resultSynthesisContainer
const synthesisRegex = /(<div class="result-synthesis-container" id="resultSynthesisContainer">[\s\S]*?<\/div>)/;
if (!synthesisRegex.test(html)) {
  console.error('Could not find synthesisTarget in index.html');
  process.exit(1);
}

const bottomShareHtml = `$1

        <!-- Bottom Share Section (หลังจบคำทำนาย) -->
        <div class="result-share-bottom-card" id="resultShareBottomCard">
          <div class="share-bottom-inner">
            <h3 class="share-bottom-heading">
              แชร์คำทำนายนี้ให้เพื่อนๆกัน
            </h3>
            <div class="share-bottom-buttons-group" role="group" aria-label="แชร์คำทำนายนี้ให้เพื่อนๆ">
              <button type="button" class="btn-share-bottom btn-direct-fb" id="shareFbBottomBtn" title="แชร์ลง Facebook">
                <i class="fa-brands fa-facebook-f"></i>
                <span class="share-btn-text">FB</span>
              </button>
              <button type="button" class="btn-share-bottom btn-direct-ig" id="shareIgBottomBtn" title="แชร์ลง Instagram">
                <i class="fa-brands fa-instagram"></i>
                <span class="share-btn-text">IG</span>
              </button>
              <button type="button" class="btn-share-bottom btn-direct-line" id="shareLineBottomBtn" title="แชร์เข้า LINE">
                <i class="fa-brands fa-line"></i>
                <span class="share-btn-text">Line</span>
              </button>
              <button type="button" class="btn-share-bottom btn-direct-link" id="shareLinkBottomBtn" title="คัดลอกลิงก์คำทำนายนี้">
                <i class="fa-solid fa-link"></i>
                <span class="share-btn-text" id="shareLinkBtnText">Link</span>
              </button>
            </div>
          </div>
        </div>`;

html = html.replace(synthesisRegex, bottomShareHtml);
fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html updated successfully.');

console.log('--- 2. Updating styles.css ---');
let css = fs.readFileSync('styles.css', 'utf8');

const bottomShareCss = `
/* ==========================================================================
   BOTTOM SHARE SECTION (หลังจบคำทำนาย - FB, IG, Line, Link)
   ========================================================================== */
.result-share-bottom-card {
  margin-top: 32px;
  margin-bottom: 20px;
  padding: 24px 20px;
  background: linear-gradient(135deg, #ffffff 0%, #fbfcfe 50%, #f8fafc 100%);
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05);
  text-align: center;
}

.share-bottom-heading {
  font-family: 'Prompt', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.share-bottom-buttons-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-share-bottom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 999px;
  border: none;
  outline: none;
  font-family: 'Prompt', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff !important;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 100px;
}

.btn-share-bottom:hover {
  transform: translateY(-2px);
  filter: brightness(1.08);
}

.btn-share-bottom:active {
  transform: translateY(0);
}

.btn-share-bottom i {
  font-size: 17px;
}

/* Link Button: Indigo Gradient */
.btn-direct-link {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
  box-shadow: 0 3px 10px rgba(99, 102, 241, 0.35) !important;
}
.btn-direct-link:hover {
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.5) !important;
}

@media (max-width: 600px) {
  .result-share-bottom-card {
    padding: 18px 12px;
    margin-top: 24px;
  }
  .share-bottom-heading {
    font-size: 16px;
    margin-bottom: 12px;
  }
  .share-bottom-buttons-group {
    gap: 8px;
  }
  .btn-share-bottom {
    padding: 8px 14px;
    font-size: 14px;
    min-width: 0;
    flex: 1 1 calc(50% - 10px);
    max-width: calc(50% - 4px);
  }
}
`;

css += bottomShareCss;
fs.writeFileSync('styles.css', css, 'utf8');
console.log('styles.css updated successfully.');

console.log('--- 3. Updating app.js ---');
let app = fs.readFileSync('app.js', 'utf8');

const targetInApp = `// Direct 4 Social Share Icon Buttons`;
if (!app.includes(targetInApp)) {
  console.error('Target not found in app.js');
  process.exit(1);
}

const bottomShareJs = `// Bottom Share Section Handlers (FB, IG, Line, Link)
const shareFbBottomBtn = document.getElementById('shareFbBottomBtn');
const shareIgBottomBtn = document.getElementById('shareIgBottomBtn');
const shareLineBottomBtn = document.getElementById('shareLineBottomBtn');
const shareLinkBottomBtn = document.getElementById('shareLinkBottomBtn');
const shareLinkBtnText = document.getElementById('shareLinkBtnText');

if (shareFbBottomBtn) {
  shareFbBottomBtn.addEventListener('click', () => handleSocialShareWithMedia('fb'));
}
if (shareIgBottomBtn) {
  shareIgBottomBtn.addEventListener('click', () => handleSocialShareWithMedia('ig'));
}
if (shareLineBottomBtn) {
  shareLineBottomBtn.addEventListener('click', () => handleSocialShareWithMedia('line'));
}
if (shareLinkBottomBtn) {
  shareLinkBottomBtn.addEventListener('click', async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        await copyToClipboardFallback(shareUrl);
      }
      if (shareLinkBtnText) {
        const orig = shareLinkBtnText.textContent;
        shareLinkBtnText.textContent = 'คัดลอกแล้ว!';
        setTimeout(() => {
          shareLinkBtnText.textContent = orig;
        }, 2500);
      }
      showSocialToast('🔗 คัดลอกลิงก์คำทำนายเรียบร้อยแล้วค่ะ! นำไปส่งต่อให้เพื่อนๆ ได้เลยนะคะ 🐾✨');
    } catch (err) {
      console.warn('Copy link error:', err);
      showSocialToast('🔗 ลิงก์คำทำนาย: ' + shareUrl);
    }
  });
}

`;

app = app.replace(targetInApp, bottomShareJs + targetInApp);
fs.writeFileSync('app.js', app, 'utf8');
console.log('app.js updated successfully.');
