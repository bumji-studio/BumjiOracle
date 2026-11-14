/**
 * ============================================================================
 * แม่หมอติ๊ดติ๊ด (DESTINY ARCANA) - Authentication & Admin Gatekeeper Engine
 * Supports:
 * - Public access strictly for Card Reading (เปิดเป็น เมนู Public เฉพาะเมนูเปิดไพ่)
 * - Removed public login & registration forms
 * - Admin credentials gatekeeper (email: bumjaa@gmail.com / password: bumjiOnly)
 * ============================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'jiutian_arcana_user_session';
  const ADMIN_CONFIG = {
    email: 'bumjaa@gmail.com',
    password: 'bumjiOnly',
    name: 'Bumji (Admin)',
    firstName: 'Bumji',
    lastName: ''
  };

  // Main tabs requiring Admin login:
  const LOCKED_TABS = ['personality', 'bazi', 'qimen', 'tongshu'];

  const AuthManager = {
    currentUser: null,
    pendingTabRedirect: null,
    isFirebaseReady: false,

    init: function () {
      this.loadSession();
      this.injectAuthUI();
      this.bindEvents();
      this.updateUI();
      this.notifyModeChange();
      console.log('[AuthManager] Admin Gatekeeper Initialized.');
    },

    loadSession: function () {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const u = JSON.parse(saved);
          if (u && (u.email === ADMIN_CONFIG.email || u.isAdmin)) {
            this.currentUser = u;
          } else {
            // Discard any non-admin demo user session
            this.currentUser = null;
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (e) {
        this.currentUser = null;
      }
    },

    saveSession: function (user) {
      this.currentUser = user;
      try {
        if (user) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {}
      this.updateUI();
      this.notifyModeChange();
    },

    isAdmin: function () {
      return !!(this.currentUser && (this.currentUser.email === ADMIN_CONFIG.email || this.currentUser.isAdmin));
    },

    isLoggedIn: function () {
      return this.isAdmin();
    },

    isTabLocked: function (tabKey) {
      if (!tabKey || tabKey === 'reading') return false;
      if (!LOCKED_TABS.includes(tabKey)) return false;
      return !this.isAdmin();
    },

    // Admin Login Verification
    loginWithEmail: async function (email, password) {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPass = (password || '').trim();

      if (!cleanEmail || !cleanPass) {
        this.showToast('กรุณากรอกอีเมลและรหัสผ่าน Admin ให้ครบถ้วน', 'warning');
        return false;
      }

      if (cleanEmail === ADMIN_CONFIG.email.toLowerCase() && cleanPass === ADMIN_CONFIG.password) {
        const adminUser = {
          id: 'admin_bumji',
          uid: 'admin_bumji',
          email: ADMIN_CONFIG.email,
          name: ADMIN_CONFIG.name,
          firstName: ADMIN_CONFIG.firstName,
          lastName: ADMIN_CONFIG.lastName,
          role: 'admin',
          isAdmin: true,
          isMember: true,
          provider: 'admin-local',
          birthDate: '1990-01-01',
          birthTime: '12:00',
          gender: 'female',
          updatedAt: new Date().toISOString()
        };

        this.saveSession(adminUser);
        this.showToast('🎉 เข้าสู่ระบบผู้ดูแลระบบ (Admin) สำเร็จแล้ว!', 'success');
        this.onAuthSuccess(adminUser);
        return true;
      }

      this.showToast('อีเมลหรือรหัสผ่าน Admin ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง', 'error');
      return false;
    },

    logout: async function () {
      this.saveSession(null);
      this.showToast('ออกจากระบบ Admin เรียบร้อยแล้ว', 'info');
      this.closeModal();

      // Return to public card reading view
      if (typeof window.setActiveAppMode === 'function') {
        window.setActiveAppMode('reading');
      }
    },

    onAuthSuccess: function (user) {
      this.autoFillHoroscopes(user);
      this.closeModal();

      // Seamless redirect to user's intended menu
      if (this.pendingTabRedirect && typeof window.setActiveAppMode === 'function') {
        const target = this.pendingTabRedirect;
        this.pendingTabRedirect = null;
        setTimeout(() => {
          window.setActiveAppMode(target);
          this.showToast(`✨ เข้าสู่เมนู ${target.toUpperCase()} เรียบร้อยแล้ว`, 'success');
        }, 150);
      }
    },

    // Auto-fill user's birth data into BaZi, QiMen, and Personality
    autoFillHoroscopes: function (user) {
      if (!user) return;

      if (window.BaziApp && typeof window.BaziApp.addProfileFromUser === 'function') {
        window.BaziApp.addProfileFromUser(user);
      }

      const qmDate = document.getElementById('qmDatePicker');
      const qmHour = document.getElementById('qmHourSelect');
      if (qmDate && user.birthDate) {
        qmDate.value = user.birthDate;
      }
      if (qmHour && user.birthTime) {
        const [h] = user.birthTime.split(':').map(Number);
        if (!isNaN(h)) {
          const hIdx = Math.floor((h + 1) % 24 / 2);
          qmHour.value = String(hIdx);
        }
      }

      if (window.PersonalityApp && typeof window.PersonalityApp.fillFromCurrentUser === 'function') {
        window.PersonalityApp.fillFromCurrentUser(false);
      }
    },

    openModal: function (tab = 'login', intendedTab = null) {
      this.pendingTabRedirect = intendedTab;
      const modal = document.getElementById('authModalOverlay');
      if (!modal) return;

      const noticeBox = document.getElementById('authLockedNotice');
      if (noticeBox) {
        if (intendedTab && LOCKED_TABS.includes(intendedTab)) {
          const tabNames = {
            tongshu: 'ปฏิทินและฤกษ์ยาม TongShu',
            qimen: 'ผังฉีเหมิน (Qi Men Dun Jia)',
            bazi: 'ผังดวงจีนปาจื่อ (BaZi 八字)',
            personality: 'ทายนิสัยฉบับน้องเหมียว (Cat Archetype)'
          };
          noticeBox.innerHTML = `
            <div class="auth-gate-alert">
              <i class="fa-solid fa-shield-halved"></i>
              <div>
                <strong>เมนู ${tabNames[intendedTab] || intendedTab} สงวนสิทธิ์เฉพาะผู้ดูแลระบบ (Admin)</strong>
                <p>กรุณาลงชื่อเข้าใช้ด้วยบัญชี Admin เพื่อเข้าใช้งานฟังก์ชันนี้ค่ะ</p>
              </div>
            </div>
          `;
          noticeBox.classList.remove('hidden');
        } else {
          noticeBox.classList.add('hidden');
        }
      }

      const emailInput = document.getElementById('authLoginEmail');
      const passInput = document.getElementById('authLoginPassword');
      if (emailInput && !emailInput.value) {
        emailInput.value = ADMIN_CONFIG.email;
      }
      if (passInput) {
        passInput.value = '';
        setTimeout(() => passInput.focus(), 200);
      }

      modal.classList.add('show');
      document.body.classList.add('modal-open');
    },

    closeModal: function () {
      const modal = document.getElementById('authModalOverlay');
      if (modal) modal.classList.remove('show');
      document.body.classList.remove('modal-open');
    },

    updateUI: function () {
      const isAdm = this.isAdmin();
      const u = this.currentUser;

      // 1. Update Header Button: Hidden for public visitors; only visible as Admin badge when logged in
      const headerAuthBtn = document.getElementById('headerAuthBtn');
      if (headerAuthBtn) {
        if (isAdm) {
          headerAuthBtn.style.display = 'inline-flex';
          headerAuthBtn.classList.add('logged-in', 'admin-logged-in');
          headerAuthBtn.innerHTML = `
            <span class="auth-admin-tag"><i class="fa-solid fa-crown text-amber-400"></i> ${u.name || 'Admin Bumji'}</span>
            <button type="button" class="btn-header-logout" id="headerLogoutBtn" title="ออกจากระบบ">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          `;
          const btnLogout = document.getElementById('headerLogoutBtn');
          if (btnLogout) {
            btnLogout.addEventListener('click', (e) => {
              e.stopPropagation();
              this.logout();
            });
          }
        } else {
          headerAuthBtn.style.display = 'none'; // Completely hidden for public visitors
          headerAuthBtn.classList.remove('logged-in', 'admin-logged-in');
          headerAuthBtn.innerHTML = '';
        }
      }

      // 2. Update Nav Lock Badges on Non-Public Tabs
      LOCKED_TABS.forEach(tab => {
        const btnId = tab === 'tongshu' ? 'tabTongShuBtn' : tab === 'qimen' ? 'tabQiMenBtn' : tab === 'bazi' ? 'tabBaziBtn' : tab === 'personality' ? 'tabPersonalityBtn' : null;
        if (!btnId) return;
        const btn = document.getElementById(btnId);
        if (!btn) return;

        let badge = btn.querySelector('.nav-lock-badge');
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'nav-lock-badge';
          btn.appendChild(badge);
        }

        if (isAdm) {
          badge.style.display = 'none';
          badge.innerHTML = '';
        } else {
          badge.style.display = 'inline-flex';
          badge.innerHTML = `<i class="fa-solid fa-lock"></i>`;
          badge.title = 'สำหรับผู้ดูแลระบบ (Admin Only)';
          badge.className = 'nav-lock-badge locked';
        }
      });
    },

    notifyModeChange: function () {
      this.updateUI();
      if (window.BaziApp && typeof window.BaziApp.onAuthStateChange === 'function') {
        window.BaziApp.onAuthStateChange(this.isAdmin(), this.currentUser);
      }
      if (window.TongShuApp && typeof window.TongShuApp.onAuthStateChange === 'function') {
        window.TongShuApp.onAuthStateChange(this.isAdmin(), this.currentUser);
      }
      if (window.QiMenApp && typeof window.QiMenApp.updateLockBadges === 'function') {
        window.QiMenApp.updateLockBadges();
      }
    },

    showToast: function (msg, type = 'info') {
      let toast = document.getElementById('authToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'authToast';
        toast.className = 'auth-toast';
        document.body.appendChild(toast);
      }

      toast.className = `auth-toast show ${type}`;
      toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-info'}"></i>
        <span>${msg}</span>
      `;

      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    },

    bindEvents: function () {
      const self = this;

      // Close modal button & backdrop click
      const closeBtn = document.getElementById('authModalCloseBtn');
      const overlay = document.getElementById('authModalOverlay');
      if (closeBtn) closeBtn.addEventListener('click', () => self.closeModal());
      if (overlay) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) self.closeModal();
        });
      }

      // Admin Login Form
      const loginForm = document.getElementById('authLoginForm');
      if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const email = document.getElementById('authLoginEmail').value;
          const pass = document.getElementById('authLoginPassword').value;
          self.loginWithEmail(email, pass);
        });
      }
    },

    injectAuthUI: function () {
      if (document.getElementById('authModalOverlay')) return;

      const modalHtml = `
        <div id="authModalOverlay" class="auth-modal-overlay">
          <div class="auth-modal-card admin-auth-card">
            
            <!-- Header -->
            <div class="auth-modal-header">
              <div class="auth-modal-title">
                <div class="auth-admin-icon-logo">
                  <i class="fa-solid fa-shield-halved"></i>
                </div>
                <div>
                  <h2>เข้าสู่ระบบผู้ดูแลระบบ</h2>
                  <span class="auth-cat-subtitle">🔒 เข้าใช้งานเฉพาะ Admin (คุณ Bumji)</span>
                </div>
              </div>
              <button class="auth-modal-close" id="authModalCloseBtn" aria-label="ปิดหน้าต่าง">&times;</button>
            </div>

            <!-- Notice Banner (when admin clicks locked menu) -->
            <div id="authLockedNotice" class="auth-locked-notice hidden" style="margin: 14px 20px 0 20px;"></div>

            <!-- Body Contents: Admin Login Form ONLY -->
            <div class="auth-modal-body" style="padding: 18px 20px 24px 20px;">
              <form id="authLoginForm" class="auth-form">
                <div class="auth-field">
                  <label><i class="fa-solid fa-envelope"></i> อีเมล Admin:</label>
                  <input type="email" id="authLoginEmail" value="bumjaa@gmail.com" placeholder="bumjaa@gmail.com" required autocomplete="email">
                </div>
                <div class="auth-field">
                  <label><i class="fa-solid fa-lock"></i> รหัสผ่าน Admin:</label>
                  <input type="password" id="authLoginPassword" placeholder="••••••••" required autocomplete="current-password">
                </div>
                <button type="submit" class="auth-submit-btn" style="background: linear-gradient(135deg, #7c3aed, #4f46e5); margin-top: 10px; font-weight: 700;">
                  <i class="fa-solid fa-arrow-right-to-bracket"></i> เข้าสู่ระบบ Admin
                </button>
              </form>
            </div>

          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
  };

  window.AuthManager = AuthManager;

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AuthManager.init());
  } else {
    AuthManager.init();
  }

})();
