/**
 * ============================================================================
 * DESTINY ARCANA - Authentication & Membership Gatekeeper Engine
 * Supports: Google Sign-In, Email/Password, Profile (Birth Date/Time),
 *           and Menu Access Protection (QiMen Dun Jia / BaZi).
 * Ready for direct plug-in with Firebase Auth / Supabase.
 * ============================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'jiutian_arcana_user_session';
  const LOCKED_TABS = ['tongshu', 'qimen', 'bazi']; // Menus requiring membership (TongShu, QiMen, BaZi)

  const AuthManager = {
    currentUser: null,
    pendingTabRedirect: null,

    init: function () {
      this.loadSession();
      this.injectAuthUI();
      this.bindEvents();
      this.updateUI();
      console.log('[AuthManager] Membership & Gatekeeper Engine Initialized.');
    },

    loadSession: function () {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          this.currentUser = JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Failed to load auth session:', e);
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

    isLoggedIn: function () {
      return !!(this.currentUser && this.currentUser.id);
    },

    isTabLocked: function (tabKey) {
      if (!LOCKED_TABS.includes(tabKey)) return false;
      return !this.isLoggedIn();
    },

    // 1. Google Sign-In (Simulation ready for Firebase SDK)
    loginWithGoogle: function () {
      const self = this;
      
      // If real Firebase Auth is configured in window.firebaseAuth, use it:
      if (window.firebase && window.firebase.auth) {
        const provider = new window.firebase.auth.GoogleAuthProvider();
        return window.firebase.auth().signInWithPopup(provider).then((result) => {
          const user = result.user;
          const profile = {
            id: user.uid,
            email: user.email,
            name: user.displayName || 'Google Member',
            firstName: (user.displayName || '').split(' ')[0] || 'Member',
            lastName: (user.displayName || '').split(' ')[1] || '',
            photoURL: user.photoURL || '',
            provider: 'google',
            birthDate: '',
            birthTime: '',
            gender: 'male',
            isMember: true,
            createdAt: new Date().toISOString()
          };
          self.saveSession(profile);
          self.onAuthSuccess(profile);
        });
      }

      // Smooth simulation flow for instant testing
      this.showToast('กำลังเชื่อมต่อ Google Authentication...', 'info');
      setTimeout(() => {
        const mockGoogleUser = {
          id: 'goog_' + Date.now(),
          email: 'user.destiny@gmail.com',
          name: 'คุณผู้ใช้ (Google User)',
          firstName: 'ผู้ใช้กูเกิล',
          lastName: 'สายมู',
          photoURL: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
          provider: 'google',
          birthDate: '1995-10-12',
          birthTime: '13:28',
          gender: 'female',
          isMember: true,
          createdAt: new Date().toISOString()
        };
        self.saveSession(mockGoogleUser);
        self.showToast('✨ เข้าสู่ระบบด้วย Google สำเร็จแล้ว!', 'success');
        self.onAuthSuccess(mockGoogleUser);
      }, 700);
    },

    // 2. Email Login
    loginWithEmail: function (email, password) {
      if (!email || !password) {
        this.showToast('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน', 'warning');
        return false;
      }
      
      // Check existing accounts in local storage
      const existing = this.getStoredAccounts().find(a => a.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        if (existing.password === password) {
          this.saveSession(existing);
          this.showToast(`ยินดีต้อนรับกลับ คุณ${existing.firstName || existing.name}!`, 'success');
          this.onAuthSuccess(existing);
          return true;
        } else {
          this.showToast('รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง', 'error');
          return false;
        }
      }

      // Fallback demo login
      const demoUser = {
        id: 'usr_' + Date.now(),
        email: email,
        name: email.split('@')[0],
        firstName: email.split('@')[0],
        lastName: '',
        birthDate: '1998-05-18',
        birthTime: '09:30',
        gender: 'female',
        provider: 'email',
        isMember: true
      };
      this.saveSession(demoUser);
      this.showToast('เข้าสู่ระบบสำเร็จ!', 'success');
      this.onAuthSuccess(demoUser);
      return true;
    },

    // 3. Register New Account with Birth Info
    register: function (formData) {
      if (!formData.email || !formData.password) {
        this.showToast('กรุณากรอกอีเมลและรหัสผ่าน', 'warning');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        this.showToast('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน', 'error');
        return false;
      }
      if (!formData.firstName) {
        this.showToast('กรุณาระบุชื่อของคุณ', 'warning');
        return false;
      }

      const newUser = {
        id: 'usr_' + Date.now(),
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName || ''}`.trim(),
        firstName: formData.firstName,
        lastName: formData.lastName || '',
        birthDate: formData.birthDate || '',
        birthTime: formData.birthTime || '',
        gender: formData.gender || 'female',
        provider: 'email',
        isMember: true,
        createdAt: new Date().toISOString()
      };

      // Store in accounts list
      const accounts = this.getStoredAccounts();
      accounts.push(newUser);
      try {
        localStorage.setItem('jiutian_arcana_accounts', JSON.stringify(accounts));
      } catch (e) {}

      this.saveSession(newUser);
      this.showToast('🎉 สมัครสมาชิกสำเร็จ! ข้อมูลดวงชะตาของคุณพร้อมใช้งานแล้ว', 'success');
      this.onAuthSuccess(newUser);
      return true;
    },

    getStoredAccounts: function () {
      try {
        return JSON.parse(localStorage.getItem('jiutian_arcana_accounts') || '[]');
      } catch (e) {
        return [];
      }
    },

    logout: function () {
      this.saveSession(null);
      this.showToast('ออกจากระบบเรียบร้อยแล้ว', 'info');
      this.closeModal();
      // Redirect to reading if currently in locked tab
      if (window.location.hash) {
        const curTab = window.location.hash.replace('#', '').toLowerCase();
        if (LOCKED_TABS.includes(curTab)) {
          if (typeof window.setActiveAppMode === 'function') {
            window.setActiveAppMode('reading');
          }
        }
      }
    },

    onAuthSuccess: function (user) {
      this.closeModal();
      this.autoFillHoroscopes(user);

      // If user attempted to access a locked tab, seamlessly route them there
      if (this.pendingTabRedirect && typeof window.setActiveAppMode === 'function') {
        const target = this.pendingTabRedirect;
        this.pendingTabRedirect = null;
        setTimeout(() => {
          window.setActiveAppMode(target);
          this.showToast(`✨ ปลดล็อกเมนู ${target.toUpperCase()} เรียบร้อยแล้ว`, 'success');
        }, 200);
      }
    },

    // Auto-fill user's birth data into BaZi and QiMen
    autoFillHoroscopes: function (user) {
      if (!user) return;

      // 1. Fill BaZi form
      const baziName = document.getElementById('baziNameInput');
      const baziGender = document.getElementById('baziGenderSelect');
      const baziDate = document.getElementById('baziDateInput');
      const baziHour = document.getElementById('baziHourInput');

      if (baziName && user.name) baziName.value = user.name;
      if (baziGender && user.gender) baziGender.value = user.gender;
      if (baziDate && user.birthDate) baziDate.value = user.birthDate;
      if (baziHour && user.birthTime) baziHour.value = user.birthTime;

      // 2. Fill Qi Men Dun Jia
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
    },

    openModal: function (tab = 'login', intendedTab = null) {
      this.pendingTabRedirect = intendedTab;
      const modal = document.getElementById('authModalOverlay');
      if (!modal) return;

      const noticeBox = document.getElementById('authLockedNotice');
      if (noticeBox) {
        if (intendedTab && LOCKED_TABS.includes(intendedTab)) {
          const tabNames = {
            tongshu: 'ปฏิทินฤกษ์ยาม TongShu (通書)',
            qimen: 'ผังฉีเหมิน (Qi Men Dun Jia)',
            bazi: 'ดูดวงจีน (BaZi 八字)'
          };
          noticeBox.innerHTML = `
            <div class="auth-gate-alert">
              <i class="fa-solid fa-lock"></i>
              <div>
                <strong>เมนู ${tabNames[intendedTab] || intendedTab} พิเศษสำหรับสมาชิก</strong>
                <p>เข้าสู่ระบบหรือลงทะเบียนเพื่อปลดล็อกฟังก์ชันดูดวงเจาะลึก พร้อมผูกดวงชะตาส่วนบุคคล</p>
              </div>
            </div>
          `;
          noticeBox.classList.remove('hidden');
        } else {
          noticeBox.classList.add('hidden');
        }
      }

      this.switchModalTab(this.isLoggedIn() ? 'profile' : tab);
      modal.classList.add('show');
      document.body.classList.add('modal-open');
    },

    closeModal: function () {
      const modal = document.getElementById('authModalOverlay');
      if (modal) modal.classList.remove('show');
      document.body.classList.remove('modal-open');
    },

    switchModalTab: function (tab) {
      const tabs = document.querySelectorAll('.auth-tab-btn');
      tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === tab));

      const forms = document.querySelectorAll('.auth-tab-content');
      forms.forEach(f => f.classList.toggle('active', f.getAttribute('data-content') === tab));

      if (tab === 'profile') {
        this.renderProfileCard();
      }
    },

    renderProfileCard: function () {
      const container = document.getElementById('authProfileDetails');
      if (!container) return;

      const u = this.currentUser;
      if (!u) {
        container.innerHTML = `<p class="auth-empty">ยังไม่มีข้อมูลสมาชิก</p>`;
        return;
      }

      container.innerHTML = `
        <div class="auth-user-card">
          <div class="auth-avatar-box">
            ${u.photoURL ? `<img src="${u.photoURL}" class="auth-avatar-img">` : `<div class="auth-avatar-letter">${(u.firstName || u.name || 'M')[0]}</div>`}
            <span class="auth-vip-badge"><i class="fa-solid fa-crown"></i> VIP Member</span>
          </div>
          <div class="auth-user-meta">
            <h3>${u.name || 'สมาชิก'}</h3>
            <p class="email"><i class="fa-solid fa-envelope"></i> ${u.email || '-'}</p>
            <div class="auth-birth-summary">
              <div class="pill"><i class="fa-solid fa-cake-candles"></i> วันเกิด: <strong>${u.birthDate || 'ไม่ระบุ'}</strong></div>
              <div class="pill"><i class="fa-solid fa-clock"></i> เวลาเกิด: <strong>${u.birthTime || 'ไม่ระบุ'}</strong></div>
              <div class="pill"><i class="fa-solid fa-venus-mars"></i> เพศ: <strong>${u.gender === 'male' ? 'ชาย' : 'หญิง'}</strong></div>
            </div>
          </div>
        </div>
        <div class="auth-profile-actions">
          <button class="auth-btn-sync" id="btnSyncProfileCharts">
            <i class="fa-solid fa-wand-magic-sparkles"></i> คำนวณผังดวง BaZi และ Qi Men ของฉันทันที
          </button>
          <button class="auth-btn-logout" id="btnLogoutAction">
            <i class="fa-solid fa-arrow-right-from-bracket"></i> ออกจากระบบ
          </button>
        </div>
      `;

      const btnSync = document.getElementById('btnSyncProfileCharts');
      if (btnSync) {
        btnSync.addEventListener('click', () => {
          this.autoFillHoroscopes(u);
          this.closeModal();
          this.showToast('ซิงค์ข้อมูลดวงชะตาเข้าสู่ BaZi และ Qi Men เรียบร้อยแล้วค่ะ', 'success');
          if (typeof window.setActiveAppMode === 'function') {
            window.setActiveAppMode('bazi');
          }
        });
      }

      const btnLogout = document.getElementById('btnLogoutAction');
      if (btnLogout) {
        btnLogout.addEventListener('click', () => this.logout());
      }
    },

    updateUI: function () {
      const isAuth = this.isLoggedIn();
      const u = this.currentUser;

      // 1. Update Header Button
      const headerAuthBtn = document.getElementById('headerAuthBtn');
      const authBtnLabel = document.getElementById('authBtnLabel');
      const authAvatar = document.getElementById('headerAuthAvatar');

      if (headerAuthBtn && authBtnLabel) {
        if (isAuth) {
          authBtnLabel.innerHTML = `<span class="auth-header-name">${u.firstName || u.name}</span> <span class="auth-vip-tag">VIP</span>`;
          if (authAvatar) {
            if (u.photoURL) {
              authAvatar.innerHTML = `<img src="${u.photoURL}" class="auth-mini-avatar">`;
            } else {
              authAvatar.innerHTML = `<div class="auth-mini-letter">${(u.firstName || u.name)[0]}</div>`;
            }
          }
          headerAuthBtn.classList.add('logged-in');
        } else {
          authBtnLabel.textContent = 'เข้าสู่ระบบ / สมัคร';
          if (authAvatar) {
            authAvatar.innerHTML = `<i class="fa-solid fa-circle-user"></i>`;
          }
          headerAuthBtn.classList.remove('logged-in');
        }
      }

      // 2. Update Nav Lock Badges
      LOCKED_TABS.forEach(tab => {
        const btnId = tab === 'tongshu' ? 'tabTongShuBtn' : tab === 'qimen' ? 'tabQiMenBtn' : tab === 'bazi' ? 'tabBaziBtn' : null;
        if (!btnId) return;
        const btn = document.getElementById(btnId);
        if (!btn) return;

        let badge = btn.querySelector('.nav-lock-badge');
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'nav-lock-badge';
          btn.appendChild(badge);
        }

        if (isAuth) {
          badge.innerHTML = `<i class="fa-solid fa-sparkles"></i> ปลดล็อกแล้ว`;
          badge.className = 'nav-lock-badge unlocked';
        } else {
          badge.innerHTML = `<i class="fa-solid fa-lock"></i> สมาชิก`;
          badge.className = 'nav-lock-badge locked';
        }
      });
    },

    notifyModeChange: function () {
      // Refresh active tab lock state
      this.updateUI();
    },

    showToast: function (msg, type = 'info') {
      let toast = document.getElementById('authToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'authToast';
        toast.className = 'auth-toast';
        document.body.appendChild(toast);
      }
      toast.className = `auth-toast ${type} show`;
      toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info'}"></i> <span>${msg}</span>`;
      setTimeout(() => toast.classList.remove('show'), 3500);
    },

    bindEvents: function () {
      const self = this;

      // Header button
      const headerBtn = document.getElementById('headerAuthBtn');
      if (headerBtn) {
        headerBtn.addEventListener('click', () => {
          self.openModal(self.isLoggedIn() ? 'profile' : 'login');
        });
      }

      // Close modal events
      const closeBtn = document.getElementById('authModalCloseBtn');
      const overlay = document.getElementById('authModalOverlay');
      if (closeBtn) closeBtn.addEventListener('click', () => self.closeModal());
      if (overlay) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) self.closeModal();
        });
      }

      // Tab switcher inside modal
      document.querySelectorAll('.auth-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const targetTab = btn.getAttribute('data-tab');
          self.switchModalTab(targetTab);
        });
      });

      // Google Login Buttons
      document.querySelectorAll('.btn-google-auth').forEach(btn => {
        btn.addEventListener('click', () => self.loginWithGoogle());
      });

      // Email Login Form
      const loginForm = document.getElementById('authLoginForm');
      if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const email = document.getElementById('authLoginEmail').value;
          const pass = document.getElementById('authLoginPassword').value;
          self.loginWithEmail(email, pass);
        });
      }

      // Register Form
      const regForm = document.getElementById('authRegisterForm');
      if (regForm) {
        regForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const data = {
            firstName: document.getElementById('regFirstName').value.trim(),
            lastName: document.getElementById('regLastName').value.trim(),
            email: document.getElementById('regEmail').value.trim(),
            password: document.getElementById('regPassword').value,
            confirmPassword: document.getElementById('regConfirmPassword').value,
            birthDate: document.getElementById('regBirthDate').value,
            birthTime: document.getElementById('regBirthTime').value,
            gender: document.getElementById('regGender').value
          };
          self.register(data);
        });
      }

      // Quick switch links
      const toRegLink = document.getElementById('linkSwitchToRegister');
      const toLoginLink = document.getElementById('linkSwitchToLogin');
      if (toRegLink) toRegLink.addEventListener('click', (e) => { e.preventDefault(); self.switchModalTab('register'); });
      if (toLoginLink) toLoginLink.addEventListener('click', (e) => { e.preventDefault(); self.switchModalTab('login'); });
    },

    injectAuthUI: function () {
      if (document.getElementById('authModalOverlay')) return;

      const modalHtml = `
        <div id="authModalOverlay" class="auth-modal-overlay">
          <div class="auth-modal-card">
            
            <!-- Header - My Cat & I Modern Healing Theme -->
            <div class="auth-modal-header">
              <div class="auth-modal-title">
                <div class="auth-cat-logo">
                  <i class="fa-solid fa-cat"></i>
                </div>
                <div>
                  <h2>แม่หมอติ๊ดติ๊ด</h2>
                  <span class="auth-cat-subtitle">✨ ดูดวงไพ่ออราเคิล My Cat &amp; I (61 ใบ) • สไตล์โมเดิร์นฮีลใจ</span>
                </div>
              </div>
              <button class="auth-modal-close" id="authModalCloseBtn" aria-label="ปิดหน้าต่าง">&times;</button>
            </div>

            <!-- Locked Notice Banner (when user tries to access locked tab) -->
            <div id="authLockedNotice" class="auth-locked-notice hidden"></div>

            <!-- Tabs Switcher -->
            <div class="auth-tabs-bar">
              <button class="auth-tab-btn active" data-tab="login">
                <i class="fa-solid fa-arrow-right-to-bracket"></i> เข้าสู่ระบบ
              </button>
              <button class="auth-tab-btn" data-tab="register">
                <i class="fa-solid fa-user-plus"></i> สมัครสมาชิกใหม่
              </button>
              <button class="auth-tab-btn" data-tab="profile" id="authTabProfileBtn">
                <i class="fa-solid fa-id-card"></i> ข้อมูลดวงชะตาของฉัน
              </button>
            </div>

            <!-- Body Contents -->
            <div class="auth-modal-body">
              
              <!-- 1. LOGIN TAB -->
              <div class="auth-tab-content active" data-content="login">
                
                <!-- Google 1-Click Button -->
                <button type="button" class="btn-google-auth">
                  <svg class="google-svg-icon" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>เข้าสู่ระบบด้วย Google (Gmail)</span>
                </button>

                <div class="auth-divider">
                  <span>หรือใช้อีเมลและรหัสผ่าน</span>
                </div>

                <form id="authLoginForm" class="auth-form">
                  <div class="auth-field">
                    <label><i class="fa-solid fa-envelope"></i> อีเมล:</label>
                    <input type="email" id="authLoginEmail" placeholder="your-email@example.com" required>
                  </div>
                  <div class="auth-field">
                    <label><i class="fa-solid fa-lock"></i> รหัสผ่าน:</label>
                    <input type="password" id="authLoginPassword" placeholder="••••••••" required>
                  </div>
                  <button type="submit" class="auth-submit-btn">
                    <i class="fa-solid fa-sign-in-alt"></i> เข้าสู่ระบบ
                  </button>
                  <p class="auth-footer-text">
                    ยังไม่มีบัญชีสมาชิก? <a href="#" id="linkSwitchToRegister">สมัครสมาชิกที่นี่</a>
                  </p>
                </form>
              </div>

              <!-- 2. REGISTER TAB -->
              <div class="auth-tab-content" data-content="register">
                
                <button type="button" class="btn-google-auth">
                  <svg class="google-svg-icon" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>สมัครสมาชิกด้วย Google (1-Click)</span>
                </button>

                <div class="auth-divider">
                  <span>หรือกรอกข้อมูลสมัครสมาชิก</span>
                </div>

                <div class="auth-info-banner">
                  <i class="fa-solid fa-wand-magic-sparkles"></i>
                  <span>ข้อมูลวันเดือนปีและเวลาเกิด จะนำไปผูกกับ <strong>ผังดวง BaZi</strong> และ <strong>ผังฉีเหมิน</strong> ของคุณอัตโนมัติ</span>
                </div>

                <form id="authRegisterForm" class="auth-form">
                  <div class="auth-grid-2">
                    <div class="auth-field">
                      <label><i class="fa-solid fa-user"></i> ชื่อจริง:</label>
                      <input type="text" id="regFirstName" placeholder="ชื่อ" required>
                    </div>
                    <div class="auth-field">
                      <label><i class="fa-solid fa-user-tag"></i> นามสกุล:</label>
                      <input type="text" id="regLastName" placeholder="นามสกุล">
                    </div>
                  </div>

                  <div class="auth-field">
                    <label><i class="fa-solid fa-envelope"></i> อีเมล (Email):</label>
                    <input type="email" id="regEmail" placeholder="your-email@example.com" required>
                  </div>

                  <div class="auth-grid-2">
                    <div class="auth-field">
                      <label><i class="fa-solid fa-lock"></i> รหัสผ่าน:</label>
                      <input type="password" id="regPassword" placeholder="อย่างน้อย 6 ตัวอักษร" required minlength="6">
                    </div>
                    <div class="auth-field">
                      <label><i class="fa-solid fa-lock-open"></i> ยืนยันรหัสผ่าน:</label>
                      <input type="password" id="regConfirmPassword" placeholder="ยืนยันรหัสผ่าน" required minlength="6">
                    </div>
                  </div>

                  <!-- Birth & Astrology Fields -->
                  <div class="auth-astrology-card">
                    <div class="auth-astro-header">
                      <i class="fa-solid fa-star-and-crescent"></i> ข้อมูลเวลาเกิดสำหรับดูดวงชะตา
                    </div>
                    
                    <div class="auth-grid-3">
                      <div class="auth-field">
                        <label><i class="fa-solid fa-calendar-day"></i> วันเกิด (ว/ด/ป):</label>
                        <input type="date" id="regBirthDate" required>
                      </div>
                      <div class="auth-field">
                        <label><i class="fa-solid fa-clock"></i> เวลาเกิด (เวลาตกฟาก):</label>
                        <input type="time" id="regBirthTime" value="12:00">
                      </div>
                      <div class="auth-field">
                        <label><i class="fa-solid fa-venus-mars"></i> เพศ:</label>
                        <select id="regGender">
                          <option value="female">หญิง (Female)</option>
                          <option value="male">ชาย (Male)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button type="submit" class="auth-submit-btn reg-btn">
                    <i class="fa-solid fa-crown"></i> สร้างบัญชีสมาชิกและผูกผังดวง
                  </button>

                  <p class="auth-footer-text">
                    มีบัญชีอยู่แล้ว? <a href="#" id="linkSwitchToLogin">เข้าสู่ระบบที่นี่</a>
                  </p>
                </form>
              </div>

              <!-- 3. PROFILE TAB -->
              <div class="auth-tab-content" data-content="profile">
                <div id="authProfileDetails"></div>
              </div>

            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
  };

  window.AuthManager = AuthManager;

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AuthManager.init());
  } else {
    AuthManager.init();
  }
})();
