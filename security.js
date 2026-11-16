/**
 * ============================================================================
 * แม่หมอตี้ดตี้ด (MAEMOR TIDTID) - Security & Anti-Theft Guard Engine
 * ============================================================================
 * ป้องกันการขโมยข้อมูล คุ้มครองทรัพย์สินทางปัญญา และอุดช่องโหว่ความปลอดภัย:
 * 1. Anti-Scraping & Copy Protection (ป้องกันการคลิกขวา คัดลอก บันทึกหน้าจอ)
 * 2. DevTools & View-Source Shortcut Blocker (ป้องกัน F12, Ctrl+U, Ctrl+Shift+I, Ctrl+S)
 * 3. Iframe / Clickjacking Protection (ป้องกันการถูกแอบนำไปฝังในเว็บอื่น)
 * 4. Memory Deep-Freeze (ป้องกันการดัดแปลงหรือดูดฐานข้อมูลผ่าน Console)
 * 5. Cryptographic SHA-256 Hashing & Session Token Signatures
 * 6. XSS Injection Sanitizer
 * ============================================================================
 */

(function () {
  'use strict';

  // Standalone Cryptographic SHA-256 implementation
  function sha256(ascii) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    let lengthProperty = 'length';
    let i, j;
    let result = '';

    const words = [];
    const asciiBitLength = (ascii || '')[lengthProperty] * 8;

    let hash = [];
    const k = [];
    let primeCounter = 0;

    const isComposite = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (i = 0; i < 313; i += candidate) {
          isComposite[i] = candidate;
        }
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }

    ascii += '\x80';
    while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
    for (i = 0; i < ascii[lengthProperty]; i++) {
      j = ascii.charCodeAt(i);
      if (j >> 8) return '';
      words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
    words[words[lengthProperty]] = asciiBitLength;

    for (j = 0; j < words[lengthProperty]; ) {
      const w = words.slice(j, (j += 16));
      const oldHash = hash;
      hash = hash.slice(0, 8);

      for (i = 0; i < 64; i++) {
        const i2 = i + j;
        const w15 = w[i - 15], w2 = w[i - 2];
        const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
        const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
        const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
        const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
        const temp1 = hash[7] + (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) + ch + k[i] + (w[i] = (i < 16) ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0);
        const temp2 = (rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) + maj;

        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
      }

      for (i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }

    for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
        const b = (hash[i] >> (j * 8)) & 255;
        result += ((b < 16) ? '0' : '') + b.toString(16);
      }
    }
    return result;
  }

  // Recursive deep freeze to protect in-memory knowledge databases from tampering or runtime scraping
  function deepFreeze(object) {
    if (!object || typeof object !== 'object') return object;
    const propNames = Object.getOwnPropertyNames(object);
    for (const name of propNames) {
      const value = object[name];
      if (value && typeof value === 'object') {
        deepFreeze(value);
      }
    }
    return Object.freeze(object);
  }

  // HTML entity sanitizer to prevent XSS
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const SECURITY_SALT = 'maemortidtid_security_v5_2026:';

  const SecurityGuard = {
    sha256: sha256,
    deepFreeze: deepFreeze,
    escapeHtml: escapeHtml,

    // Generate tamper-proof HMAC-like signature for stored sessions
    signSession: function (userId, email) {
      if (!userId || !email) return '';
      return sha256(SECURITY_SALT + String(userId) + ':' + String(email).toLowerCase() + ':bumjiVerifiedAdmin');
    },

    // Verify session token integrity to prevent localStorage spoofing
    verifySession: function (user) {
      if (!user || !user.id || !user.email || !user._token) return false;
      const expected = this.signSession(user.id, user.email);
      return expected === user._token;
    },

    init: function () {
      this.preventClickjacking();
      this.bindAntiScrapingEvents();
      this.freezeDatabases();
      this.printSecurityNotice();
    },

    // 1. Iframe Clickjacking Protection
    preventClickjacking: function () {
      try {
        if (window.top !== window.self) {
          // If embedded in external iframe, attempt to break out
          window.top.location = window.self.location;
        }
      } catch (e) {
        // Sandboxed iframe: hide content
        if (document.body) {
          document.body.innerHTML = '<div style="padding:40px;text-align:center;font-family:sans-serif;"><h3>⚠️ ไม่อนุญาตให้เปิดใช้งานผ่าน iframe ภายนอก</h3></div>';
        }
      }
    },

    // 2. Anti-Scraping & Copy Protection
    bindAntiScrapingEvents: function () {
      const isInput = (target) => {
        if (!target) return false;
        const tag = (target.tagName || '').toLowerCase();
        return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable;
      };

      // Disable Right-Click Context Menu on application content
      document.addEventListener('contextmenu', (e) => {
        if (isInput(e.target)) return; // Allow normal copy/paste inside inputs
        e.preventDefault();
        this.showSecurityToast('🛡️ ข้อมูลและเนื้อหาทั้งหมดได้รับการคุ้มครองลิขสิทธิ์');
        return false;
      }, { passive: false });

      // Disable Copy on protected content
      document.addEventListener('copy', (e) => {
        if (isInput(e.target)) return;
        const sel = window.getSelection ? window.getSelection().toString() : '';
        if (sel && sel.length > 30) {
          e.preventDefault();
          this.showSecurityToast('🛡️ ไม่อนุญาตให้คัดลอกเนื้อหาบทวิเคราะห์');
          return false;
        }
      }, { passive: false });

      // Disable Key Shortcuts: F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S, Ctrl+P
      document.addEventListener('keydown', (e) => {
        const key = e.key || '';
        const code = e.keyCode || 0;
        const ctrlOrMeta = e.ctrlKey || e.metaKey;

        // F12
        if (key === 'F12' || code === 123) {
          e.preventDefault();
          e.stopPropagation();
          this.showSecurityToast('🛡️ Developer Tools ถูกปิดการใช้งานเพื่อความปลอดภัย');
          return false;
        }

        // Ctrl + Shift + I/J/C (DevTools)
        if (ctrlOrMeta && e.shiftKey && (key === 'I' || key === 'i' || key === 'J' || key === 'j' || key === 'C' || key === 'c' || code === 73 || code === 74 || code === 67)) {
          e.preventDefault();
          e.stopPropagation();
          this.showSecurityToast('🛡️ ฟังก์ชันตรวจสอบโค้ดถูกปิดการใช้งาน');
          return false;
        }

        // Ctrl + U (View Source)
        if (ctrlOrMeta && (key === 'U' || key === 'u' || code === 85)) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        // Ctrl + S (Save Page)
        if (ctrlOrMeta && (key === 'S' || key === 's' || code === 83)) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        // Ctrl + P (Print / Export) outside inputs
        if (ctrlOrMeta && (key === 'P' || key === 'p' || code === 80)) {
          if (!isInput(e.target)) {
            e.preventDefault();
            e.stopPropagation();
            this.showSecurityToast('🛡️ ไม่อนุญาตให้สั่งพิมพ์เอกสารวิเคราะห์');
            return false;
          }
        }
      }, { passive: false });

      // Disable image drag-and-drop theft
      document.addEventListener('dragstart', (e) => {
        if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'img') {
          e.preventDefault();
          return false;
        }
      }, { passive: false });
    },

    // 3. Freeze in-memory databases to protect against tampering & console scraping
    freezeDatabases: function () {
      const lockDBs = () => {
        const dbs = [
          'BAZI_TEN_GODS_DB',
          'BAZI_MARRIAGE_DB',
          'BAZI_STARS_DB',
          'BAZI_INTERACTIONS_DB',
          'BAZI_ANNUAL_DB',
          'BAZI_PATTERNS_DB',
          'BAZI_CAREER_DB',
          'JIAZI_PROFILES',
          'CAT_PROFILES'
        ];
        dbs.forEach(name => {
          if (window[name] && typeof window[name] === 'object' && !Object.isFrozen(window[name])) {
            deepFreeze(window[name]);
          }
        });
      };

      if (document.readyState === 'complete') {
        lockDBs();
      } else {
        window.addEventListener('load', lockDBs);
      }
    },

    // 4. Subtle security toast
    showSecurityToast: function (msg) {
      let toast = document.getElementById('securityNoticeToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'securityNoticeToast';
        toast.style.cssText = `
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%) translateY(30px);
          background: rgba(15, 23, 42, 0.92);
          color: #f8fafc;
          padding: 10px 22px;
          border-radius: 24px;
          font-family: 'Prompt', 'Sarabun', sans-serif;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(148, 163, 184, 0.25);
          z-index: 999999;
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
          display: flex;
          align-items: center;
          gap: 8px;
        `;
        document.body.appendChild(toast);
      }
      toast.textContent = msg;
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';

      if (this._toastTimer) clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(30px)';
      }, 2400);
    },

    // 5. Console Legal & Copyright Notice
    printSecurityNotice: function () {
      try {
        console.log(
          '%c🛡️ แม่หมอตี้ดตี้ด (MAEMOR TIDTID) - SECURITY GUARD ACTIVE\n' +
          '%cสงวนลิขสิทธิ์ข้อมูล การคำนวณ ฐานข้อมูลโหราศาสตร์จีน และบทวิเคราะห์ทั้งหมดตามกฎหมาย\n' +
          'ห้ามคัดลอก ดัดแปลง หรือนำข้อมูลไปเผยแพร่โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร',
          'color: #7c3aed; font-size: 14px; font-weight: 800; padding: 4px 0;',
          'color: #475569; font-size: 11.5px; font-weight: 500;'
        );
      } catch (e) {}
    }
  };

  window.SecurityGuard = SecurityGuard;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SecurityGuard.init());
  } else {
    SecurityGuard.init();
  }
})();
