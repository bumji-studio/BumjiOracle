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
    passwordHash: '2939f90c231733cba588fa88fa14a4775425a877528e78f5a05a109476660c2e',
    salt: 'maemortidtid_salt_2026:',
    name: 'Bumji (Admin)',
    firstName: 'Bumji',
    lastName: ''
  };

  // Main tabs requiring Admin login:
  const LOCKED_TABS = ['personality', 'bazi', 'qimen', 'tongshu', 'adminbookings'];

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
    },

    loadSession: function () {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const u = JSON.parse(saved);
          const isValidSession = u && (u.email === ADMIN_CONFIG.email || u.isAdmin) && (
            (window.SecurityGuard && window.SecurityGuard.verifySession(u)) ||
            (!u._token && u.email === ADMIN_CONFIG.email) // Migration path on first run
          );

          if (isValidSession) {
            // Auto-sign session if token is missing
            if (!u._token && window.SecurityGuard) {
              u._token = window.SecurityGuard.signSession(u.id || 'admin_bumji', u.email);
              try { localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); } catch (e) {}
            }
            // Auto-migrate Admin Bumji to 1977-07-23 15:45 female
            if (u.id === 'admin_bumji' || u.email === ADMIN_CONFIG.email) {
              if (u.birthDate !== '1977-07-23' || u.birthTime !== '15:45' || u.gender !== 'female') {
                u.birthDate = '1977-07-23';
                u.birthTime = '15:45';
                u.gender = 'female';
                try {
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
                } catch (e) {}
              }
            }
            this.currentUser = u;
          } else {
            // Discard any forged or invalid user session
            this.currentUser = null;
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (e) {
        this.currentUser = null;
      }

      // Auto-authenticate Admin on Localhost/Dev Environment for seamless local testing
      const isLocalDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      if (!this.currentUser && isLocalDev) {
        const localAdmin = {
          id: 'admin_bumji',
          uid: 'admin_bumji',
          email: ADMIN_CONFIG.email,
          name: ADMIN_CONFIG.name,
          firstName: ADMIN_CONFIG.firstName,
          lastName: ADMIN_CONFIG.lastName,
          role: 'admin',
          isAdmin: true,
          birthDate: '1977-07-23',
          birthTime: '15:45',
          gender: 'female'
        };
        if (window.SecurityGuard) {
          localAdmin._token = window.SecurityGuard.signSession(localAdmin.id, localAdmin.email);
        }
        this.currentUser = localAdmin;
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(localAdmin)); } catch (e) {}
      }
    },

    saveSession: function (user) {
      if (user && window.SecurityGuard) {
        user._token = window.SecurityGuard.signSession(user.id, user.email);
      }
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

    // Admin Login Verification with Secure SHA-256 Hashing
    loginWithEmail: async function (email, password) {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPass = (password || '').trim();

      if (!cleanEmail || !cleanPass) {
        this.showToast('กรุณากรอกอีเมลและรหัสผ่าน Admin ให้ครบถ้วน', 'warning');
        return false;
      }

      const inputHash = window.SecurityGuard ? window.SecurityGuard.sha256(ADMIN_CONFIG.salt + cleanPass) : cleanPass;

      if (cleanEmail === ADMIN_CONFIG.email.toLowerCase() && inputHash === ADMIN_CONFIG.passwordHash) {
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
          birthDate: '1977-07-23',
          birthTime: '15:45',
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

      const adminWrap = document.getElementById('authAdminFormWrap');
      if (adminWrap) adminWrap.classList.add('hidden');

      const emailInput = document.getElementById('authLoginEmail');
      const passInput = document.getElementById('authLoginPassword');
      if (emailInput) emailInput.value = '';
      if (passInput) passInput.value = '';

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

      // 3. Update Admin Bookings Nav Tab (Only visible to Admin)
      const adminBookingsBtn = document.getElementById('tabAdminBookingsBtn');
      if (adminBookingsBtn) {
        if (isAdm) {
          adminBookingsBtn.classList.remove('hidden');
          adminBookingsBtn.style.display = 'inline-flex';
        } else {
          adminBookingsBtn.classList.add('hidden');
          adminBookingsBtn.style.display = 'none';
        }
      }
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
      if (window.BookingApp && typeof window.BookingApp.updateAdminBadge === 'function') {
        window.BookingApp.updateAdminBadge();
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
      const notReadyBtn = document.getElementById('authNotReadyCloseBtn');
      const overlay = document.getElementById('authModalOverlay');
      if (closeBtn) closeBtn.addEventListener('click', () => self.closeModal());
      if (notReadyBtn) notReadyBtn.addEventListener('click', () => self.closeModal());
      if (overlay) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) self.closeModal();
        });
      }

      // Admin Login Toggle
      const adminToggle = document.getElementById('authAdminToggleLink');
      const adminWrap = document.getElementById('authAdminFormWrap');
      if (adminToggle && adminWrap) {
        adminToggle.addEventListener('click', (e) => {
          e.preventDefault();
          adminWrap.classList.toggle('hidden');
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
          <div class="auth-modal-card auth-not-ready-card" style="max-width: 440px; border-radius: 24px; padding: 0; overflow: hidden; text-align: center; border: 1.5px solid #e9d5ff; box-shadow: 0 20px 50px rgba(124, 58, 237, 0.2); background: #ffffff;">
            
            <!-- Top bar with close button -->
            <div style="display: flex; justify-content: flex-end; padding: 14px 18px 0 18px;">
              <button class="auth-modal-close" id="authModalCloseBtn" aria-label="ปิดหน้าต่าง" style="font-size: 28px; line-height: 1; color: #94a3b8; background: transparent; border: none; cursor: pointer; padding: 4px 8px;">&times;</button>
            </div>

            <div style="padding: 4px 28px 32px 28px;">
              <!-- Big Icon -->
              <div style="width: 76px; height: 76px; margin: 0 auto 18px auto; border-radius: 50%; background: linear-gradient(135deg, #f3e8ff 0%, #ede9fe 100%); display: flex; align-items: center; justify-content: center; font-size: 34px; color: #7c3aed; box-shadow: 0 8px 20px rgba(124, 58, 237, 0.15); border: 2px solid #e9d5ff;">
                <i class="fa-solid fa-bullhorn"></i>
              </div>

              <!-- BIG NOTICE TEXT -->
              <h2 style="font-family: 'Prompt', 'Kanit', sans-serif; font-size: 28px; font-weight: 800; color: #4c1d95; line-height: 1.35; margin: 0 0 12px 0;">
                ส่วนนี้ยังไม่เปิดใช้งาน<br>
                <span style="color: #7c3aed; font-size: 26px;">ไว้เปิดแล้วจะบอกนะ!</span>
              </h2>

              <p style="font-size: 15px; line-height: 1.65; color: #64748b; margin: 0 auto 24px auto; max-width: 320px;">
                ระบบสมาชิกและการเข้าสู่ระบบกำลังอยู่ในระหว่างการพัฒนา เตรียมพบกับฟังก์ชันพิเศษเร็วๆ นี้นะคะ ✨
              </p>

              <button type="button" id="authNotReadyCloseBtn" style="background: linear-gradient(135deg, #7c3aed, #6d28d9); color: #ffffff; border: none; padding: 12px 38px; border-radius: 25px; font-size: 15.5px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.35); transition: transform 0.2s;">
                <i class="fa-solid fa-heart"></i> รับทราบจ้า
              </button>

              <!-- Discreet admin toggle -->
              <div style="margin-top: 24px; padding-top: 14px; border-top: 1px dashed #e2e8f0;">
                <a href="javascript:void(0)" id="authAdminToggleLink" style="font-size: 11.5px; color: #cbd5e1; text-decoration: none;">
                  <i class="fa-solid fa-lock" style="font-size: 10px;"></i> Admin Access
                </a>
              </div>

              <div id="authAdminFormWrap" class="hidden" style="margin-top: 14px; text-align: left;">
                <form id="authLoginForm" class="auth-form">
                  <div class="auth-field" style="margin-bottom: 10px;">
                    <label style="font-size: 12px; color: #475569;"><i class="fa-solid fa-envelope"></i> อีเมล Admin:</label>
                    <input type="email" id="authLoginEmail" value="" placeholder="กรอกอีเมล Admin" required autocomplete="email" style="width: 100%; padding: 8px 12px; font-size: 13px; border-radius: 8px; border: 1px solid #cbd5e1;">
                  </div>
                  <div class="auth-field" style="margin-bottom: 12px;">
                    <label style="font-size: 12px; color: #475569;"><i class="fa-solid fa-lock"></i> รหัสผ่าน Admin:</label>
                    <input type="password" id="authLoginPassword" placeholder="••••••••" required autocomplete="current-password" style="width: 100%; padding: 8px 12px; font-size: 13px; border-radius: 8px; border: 1px solid #cbd5e1;">
                  </div>
                  <button type="submit" class="auth-submit-btn" style="background: #7c3aed; color: #fff; width: 100%; padding: 9px; font-size: 13px; font-weight: 600; border-radius: 8px; border: none; cursor: pointer;">
                    เข้าสู่ระบบ Admin
                  </button>
                </form>
              </div>

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
