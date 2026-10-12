/**
 * ============================================================================
 * แม่หมอติ๊ดติ๊ด (DESTINY ARCANA) - Authentication & Membership Gatekeeper Engine
 * Supports: Real Firebase Auth (Google Sign-In, Email/Password, Firestore Database),
 *           Profile Synchronization (Birth Date/Time, Gender), and Menu Gatekeeper.
 * ============================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'jiutian_arcana_user_session';
  const LOCKED_TABS = ['tongshu', 'qimen', 'bazi']; // Menus requiring membership (Only 'reading' is free)

  const AuthManager = {
    currentUser: null,
    pendingTabRedirect: null,
    isFirebaseReady: false,

    init: function () {
      this.loadSession();
      this.initFirebase();
      this.injectAuthUI();
      this.bindEvents();
      this.updateUI();
      console.log('[AuthManager] Membership & Gatekeeper Engine Initialized.');
    },

    // ------------------------------------------------------------------------
    // 1. Firebase Initialization & Live Auth State Listener
    // ------------------------------------------------------------------------
    initFirebase: function () {
      const self = this;
      if (typeof firebase === 'undefined') {
        console.warn('[AuthManager] Firebase SDK not detected.');
        return;
      }

      // Check if config is ready
      if (window.isFirebaseConfigured && window.isFirebaseConfigured()) {
        try {
          if (!firebase.apps.length) {
            firebase.initializeApp(window.FIREBASE_CONFIG);
          }
          this.isFirebaseReady = true;
          console.log('[AuthManager] Firebase Auth is Connected and Live!');

          // Listen to real-time auth state changes
          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              self.handleFirebaseUser(user);
            } else {
              if (self.currentUser && self.currentUser.provider !== 'demo') {
                self.currentUser = null;
                localStorage.removeItem(STORAGE_KEY);
                self.updateUI();
              }
            }
          });
        } catch (e) {
          console.warn('[AuthManager] Firebase init error:', e.message);
          this.isFirebaseReady = false;
        }
      } else {
        console.info('[AuthManager] Running in Demo/Simulation mode until Firebase Config is supplied.');
        this.isFirebaseReady = false;
      }
    },

    // Process authenticated Firebase User and sync with Firestore profile
    handleFirebaseUser: async function (user) {
      try {
        let profile = {
          id: user.uid,
          uid: user.uid,
          email: user.email || '',
          name: user.displayName || user.email.split('@')[0] || 'สมาชิก',
          firstName: (user.displayName || '').split(' ')[0] || user.email.split('@')[0],
          lastName: (user.displayName || '').split(' ').slice(1).join(' ') || '',
          photoURL: user.photoURL || '',
          provider: user.providerData && user.providerData[0] ? user.providerData[0].providerId : 'firebase',
          birthDate: '',
          birthTime: '',
          gender: 'female',
          isMember: true,
          updatedAt: new Date().toISOString()
        };

        // Fetch user data from Firestore if available
        if (firebase.firestore) {
          try {
            const db = firebase.firestore();
            const docRef = db.collection('users').doc(user.uid);
            const doc = await docRef.get();

            if (doc.exists) {
              const data = doc.data();
              profile = { ...profile, ...data };
            } else {
              // Create initial profile in Firestore
              await docRef.set({
                uid: user.uid,
                email: profile.email,
                name: profile.name,
                firstName: profile.firstName,
                lastName: profile.lastName,
                photoURL: profile.photoURL,
                gender: profile.gender,
                birthDate: '',
                birthTime: '',
                isMember: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
              });
            }
          } catch (fsErr) {
            console.warn('[AuthManager] Firestore sync warning:', fsErr.message);
          }
        }

        this.saveSession(profile);
        this.autoFillHoroscopes(profile);
      } catch (err) {
        console.error('[AuthManager] Error handling Firebase user:', err);
      }
    },

    loadSession: function () {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          this.currentUser = JSON.parse(saved);
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

    isLoggedIn: function () {
      return !!(this.currentUser && (this.currentUser.id || this.currentUser.uid));
    },

    isTabLocked: function (tabKey) {
      if (!LOCKED_TABS.includes(tabKey)) return false;
      return !this.isLoggedIn();
    },

    // ------------------------------------------------------------------------
    // 2. Real Google Sign-In (Firebase Auth)
    // ------------------------------------------------------------------------
    loginWithGoogle: async function () {
      const self = this;

      // Real Firebase Mode
      if (this.isFirebaseReady && window.firebase && window.firebase.auth) {
        this.showToast('กำลังเปิดหน้าต่างล็อกอิน Google...', 'info');
        try {
          const provider = new firebase.auth.GoogleAuthProvider();
          provider.addScope('profile');
          provider.addScope('email');

          const result = await firebase.auth().signInWithPopup(provider);
          const user = result.user;
          this.showToast('🎉 เข้าสู่ระบบด้วย Google สำเร็จแล้ว!', 'success');
          await self.handleFirebaseUser(user);
          self.onAuthSuccess(self.currentUser);
          return true;
        } catch (error) {
          console.error('[Google Auth Error]', error);
          if (error.code === 'auth/popup-closed-by-user') {
            this.showToast('ยกเลิกการเข้าสู่ระบบ Google', 'info');
          } else if (error.code === 'auth/popup-blocked') {
            this.showToast('เบราว์เซอร์บล็อกหน้าต่างป๊อปอัป กรุณาอนุญาตป๊อปอัปแล้วลองใหม่', 'warning');
          } else if (error.code === 'auth/unauthorized-domain') {
            this.showToast('โดเมนนี้ยังไม่ได้รับอนุญาตใน Firebase Console > Authentication > Authorized domains', 'error');
          } else if (error.code === 'auth/configuration-not-found' || (error.message && error.message.includes('configuration-not-found'))) {
            this.showToast('ยังไม่ได้เปิดใช้งาน Authentication ใน Firebase Console: กรุณาไปที่เมนู Authentication > กด Get started > เปิดใช้งาน Google', 'error');
          } else {
            this.showToast('เกิดข้อผิดพลาด: ' + (error.message || 'ไม่สามารถเชื่อมต่อได้'), 'error');
          }
          return false;
        }
      }

      // Demo Simulation Fallback (When Firebase config is not yet plugged in)
      this.showToast('กำลังทดสอบล็อกอิน Google (โหมดจำลอง)...', 'info');
      setTimeout(() => {
        const mockGoogleUser = {
          id: 'goog_' + Date.now(),
          uid: 'goog_' + Date.now(),
          email: 'cat.destiny@gmail.com',
          name: 'คุณผู้ใช้ (Google Member)',
          firstName: 'ผู้ใช้กูเกิล',
          lastName: 'สายมู',
          photoURL: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
          provider: 'demo-google',
          birthDate: '1996-08-15',
          birthTime: '10:30',
          gender: 'female',
          isMember: true,
          createdAt: new Date().toISOString()
        };
        self.saveSession(mockGoogleUser);
        self.showToast('✨ เข้าสู่ระบบด้วย Google สำเร็จแล้ว (โหมดจำลอง)!', 'success');
        self.onAuthSuccess(mockGoogleUser);
      }, 600);
    },

    // ------------------------------------------------------------------------
    // 3. Real Email/Password Login (Firebase Auth)
    // ------------------------------------------------------------------------
    loginWithEmail: async function (email, password) {
      const self = this;
      if (!email || !password) {
        this.showToast('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน', 'warning');
        return false;
      }

      // Real Firebase Mode
      if (this.isFirebaseReady && window.firebase && window.firebase.auth) {
        this.showToast('กำลังตรวจสอบข้อมูลเข้าสู่ระบบ...', 'info');
        try {
          const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
          const user = userCredential.user;
          this.showToast(`🎉 ยินดีต้อนรับกลับ คุณ${user.displayName || email.split('@')[0]}!`, 'success');
          await self.handleFirebaseUser(user);
          self.onAuthSuccess(self.currentUser);
          return true;
        } catch (error) {
          console.error('[Email Login Error]', error);
          let msg = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
          if (error.code === 'auth/user-not-found') msg = 'ไม่พบบัญชีผู้ใช้นี้ในระบบ กรุณาสมัครสมาชิกใหม่';
          else if (error.code === 'auth/wrong-password') msg = 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง';
          else if (error.code === 'auth/invalid-email') msg = 'รูปแบบอีเมลไม่ถูกต้อง';
          else if (error.code === 'auth/too-many-requests') msg = 'พยายามเข้าสู่ระบบบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่';
          else if (error.code === 'auth/configuration-not-found' || (error.message && error.message.includes('configuration-not-found'))) msg = 'ยังไม่ได้เปิดใช้งาน Authentication ใน Firebase Console: กรุณาไปที่เมนู Authentication > กด Get started > เปิดใช้งาน Email/Password';
          this.showToast(msg, 'error');
          return false;
        }
      }

      // Demo Local Fallback
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

      // Fallback Demo Login
      const demoUser = {
        id: 'usr_' + Date.now(),
        email: email,
        name: email.split('@')[0],
        firstName: email.split('@')[0],
        lastName: '',
        birthDate: '1998-05-18',
        birthTime: '09:30',
        gender: 'female',
        provider: 'demo-email',
        isMember: true
      };
      this.saveSession(demoUser);
      this.showToast('เข้าสู่ระบบสำเร็จ (โหมดจำลอง)!', 'success');
      this.onAuthSuccess(demoUser);
      return true;
    },

    // ------------------------------------------------------------------------
    // 4. Real Registration with Birth Info (Firebase Auth + Firestore)
    // ------------------------------------------------------------------------
    register: async function (formData) {
      const self = this;
      if (!formData.email || !formData.password) {
        this.showToast('กรุณากรอกอีเมลและรหัสผ่าน', 'warning');
        return false;
      }
      if (formData.password.length < 6) {
        this.showToast('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร', 'warning');
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

      // Real Firebase Mode
      if (this.isFirebaseReady && window.firebase && window.firebase.auth) {
        this.showToast('กำลังลงทะเบียนสมาชิกในระบบ Cloud...', 'info');
        try {
          const cred = await firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password);
          const user = cred.user;

          const fullName = `${formData.firstName} ${formData.lastName || ''}`.trim();
          await user.updateProfile({ displayName: fullName });

          // Save birth data to Firestore
          if (firebase.firestore) {
            try {
              await firebase.firestore().collection('users').doc(user.uid).set({
                uid: user.uid,
                email: formData.email,
                name: fullName,
                firstName: formData.firstName,
                lastName: formData.lastName || '',
                birthDate: formData.birthDate || '',
                birthTime: formData.birthTime || '',
                gender: formData.gender || 'female',
                isMember: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
              });
            } catch (fsErr) {
              console.warn('Firestore write err:', fsErr);
            }
          }

          const newUser = {
            id: user.uid,
            uid: user.uid,
            email: formData.email,
            name: fullName,
            firstName: formData.firstName,
            lastName: formData.lastName || '',
            birthDate: formData.birthDate || '',
            birthTime: formData.birthTime || '',
            gender: formData.gender || 'female',
            provider: 'firebase',
            isMember: true,
            createdAt: new Date().toISOString()
          };

          this.saveSession(newUser);
          this.showToast('🎉 สมัครสมาชิกสำเร็จ! ข้อมูลดวงชะตาถูกบันทึกบน Cloud แล้ว', 'success');
          this.onAuthSuccess(newUser);
          return true;
        } catch (error) {
          console.error('[Firebase Register Error]', error);
          let msg = 'ไม่สามารถสมัครสมาชิกได้: ' + (error.message || '');
          if (error.code === 'auth/email-already-in-use') msg = 'อีเมลนี้ถูกใช้งานแล้ว กรุณาเข้าสู่ระบบ';
          else if (error.code === 'auth/invalid-email') msg = 'รูปแบบอีเมลไม่ถูกต้อง';
          else if (error.code === 'auth/weak-password') msg = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
          else if (error.code === 'auth/configuration-not-found' || (error.message && error.message.includes('configuration-not-found'))) msg = 'ยังไม่ได้เปิดใช้งาน Authentication ใน Firebase Console: กรุณาไปที่เมนู Authentication > กด Get started > เปิดใช้งาน Email/Password';
          this.showToast(msg, 'error');
          return false;
        }
      }

      // Local Demo Mode
      const newUser = {
        id: 'usr_' + Date.now(),
        uid: 'usr_' + Date.now(),
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName || ''}`.trim(),
        firstName: formData.firstName,
        lastName: formData.lastName || '',
        birthDate: formData.birthDate || '',
        birthTime: formData.birthTime || '',
        gender: formData.gender || 'female',
        provider: 'demo',
        isMember: true,
        createdAt: new Date().toISOString()
      };

      const accounts = this.getStoredAccounts();
      accounts.push(newUser);
      try {
        localStorage.setItem('jiutian_arcana_accounts', JSON.stringify(accounts));
      } catch (e) {}

      this.saveSession(newUser);
      this.showToast('🎉 สมัครสมาชิกสำเร็จ (โหมดจำลอง)! ข้อมูลดวงชะตาพร้อมใช้งานแล้ว', 'success');
      this.onAuthSuccess(newUser);
      return true;
    },

    // Update birth info to Firestore
    updateBirthProfile: async function (birthDate, birthTime, gender) {
      if (!this.currentUser) return;
      this.currentUser.birthDate = birthDate;
      this.currentUser.birthTime = birthTime;
      this.currentUser.gender = gender;
      this.saveSession(this.currentUser);

      if (this.isFirebaseReady && firebase.firestore && this.currentUser.uid) {
        try {
          await firebase.firestore().collection('users').doc(this.currentUser.uid).update({
            birthDate: birthDate,
            birthTime: birthTime,
            gender: gender,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
          this.showToast('บันทึกข้อมูลดวงชะตาขึ้น Cloud เรียบร้อย', 'success');
        } catch (e) {
          console.warn('Update birth profile cloud err:', e);
        }
      }
    },

    getStoredAccounts: function () {
      try {
        return JSON.parse(localStorage.getItem('jiutian_arcana_accounts') || '[]');
      } catch (e) {
        return [];
      }
    },

    logout: async function () {
      if (this.isFirebaseReady && window.firebase && window.firebase.auth) {
        try {
          await firebase.auth().signOut();
        } catch (e) {}
      }
      this.saveSession(null);
      this.showToast('ออกจากระบบเรียบร้อยแล้ว', 'info');
      this.closeModal();

      // Redirect to reading if currently in a locked tab
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

      // Seamless redirect to user's intended menu
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
      } else if (tab === 'config') {
        this.renderConfigForm();
      }
    },

    renderProfileCard: function () {
      const container = document.getElementById('authProfileDetails');
      if (!container) return;

      const u = this.currentUser;
      if (!u) {
        container.innerHTML = `<p class="auth-empty">ยังไม่มีข้อมูลสมาชิก กรุณาเข้าสู่ระบบ</p>`;
        return;
      }

      const isLiveCloud = this.isFirebaseReady && u.provider !== 'demo' && u.provider !== 'demo-email';

      container.innerHTML = `
        <div class="auth-user-card">
          <div class="auth-avatar-box">
            ${u.photoURL ? `<img src="${u.photoURL}" class="auth-avatar-img" alt="Avatar">` : `<div class="auth-avatar-letter">${(u.firstName || u.name || 'M')[0]}</div>`}
            <span class="auth-vip-badge"><i class="fa-solid fa-crown"></i> VIP Member</span>
          </div>
          <div class="auth-user-meta">
            <h3>${u.name || 'สมาชิก'}</h3>
            <p class="email"><i class="fa-solid fa-envelope"></i> ${u.email || '-'}</p>
            <div class="auth-cloud-badge ${isLiveCloud ? 'live' : 'local'}">
              <i class="fa-solid ${isLiveCloud ? 'fa-cloud-check' : 'fa-laptop'}"></i> 
              ${isLiveCloud ? 'เชื่อมต่อ Firebase Cloud จริง' : 'โหมดบันทึกในเครื่อง (Local)'}
            </div>
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

    renderConfigForm: function () {
      const form = document.getElementById('firebaseConfigForm');
      if (!form) return;
      const cfg = window.FIREBASE_CONFIG || {};

      document.getElementById('fbCfgApiKey').value = cfg.apiKey && !cfg.apiKey.includes('YOUR_ACTUAL') ? cfg.apiKey : '';
      document.getElementById('fbCfgAuthDomain').value = cfg.authDomain && !cfg.authDomain.includes('your-project') ? cfg.authDomain : '';
      document.getElementById('fbCfgProjectId').value = cfg.projectId && !cfg.projectId.includes('your-project') ? cfg.projectId : '';
      document.getElementById('fbCfgStorageBucket').value = cfg.storageBucket && !cfg.storageBucket.includes('your-project') ? cfg.storageBucket : '';
      document.getElementById('fbCfgMessagingSenderId').value = cfg.messagingSenderId && !cfg.messagingSenderId.includes('123456') ? cfg.messagingSenderId : '';
      document.getElementById('fbCfgAppId').value = cfg.appId && !cfg.appId.includes('1:123456') ? cfg.appId : '';
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
              authAvatar.innerHTML = `<img src="${u.photoURL}" class="auth-mini-avatar" alt="Avatar">`;
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

      // 3. Update Firebase Connection Indicator in Modal
      const statusPill = document.getElementById('authFirebaseStatusPill');
      if (statusPill) {
        if (this.isFirebaseReady) {
          statusPill.innerHTML = `<span class="status-dot green"></span> เชื่อมต่อ Firebase Live`;
          statusPill.className = 'auth-status-pill online';
        } else {
          statusPill.innerHTML = `<span class="status-dot orange"></span> โหมดทดสอบ (แตะเพื่อเชื่อมต่อ Firebase)`;
          statusPill.className = 'auth-status-pill offline';
        }
      }
    },

    notifyModeChange: function () {
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

      // Header button click
      const headerAuthBtn = document.getElementById('headerAuthBtn');
      if (headerAuthBtn) {
        headerAuthBtn.addEventListener('click', () => {
          self.openModal(self.isLoggedIn() ? 'profile' : 'login');
        });
      }

      // Close modal button & backdrop click
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

      // Firebase Config Form Submit
      const cfgForm = document.getElementById('firebaseConfigForm');
      if (cfgForm) {
        cfgForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const newCfg = {
            apiKey: document.getElementById('fbCfgApiKey').value.trim(),
            authDomain: document.getElementById('fbCfgAuthDomain').value.trim(),
            projectId: document.getElementById('fbCfgProjectId').value.trim(),
            storageBucket: document.getElementById('fbCfgStorageBucket').value.trim(),
            messagingSenderId: document.getElementById('fbCfgMessagingSenderId').value.trim(),
            appId: document.getElementById('fbCfgAppId').value.trim()
          };

          if (!newCfg.apiKey || !newCfg.projectId) {
            self.showToast('กรุณากรอก apiKey และ projectId เป็นอย่างน้อย', 'warning');
            return;
          }

          if (window.saveFirebaseConfig(newCfg)) {
            self.isFirebaseReady = true;
            self.initFirebase();
            self.showToast('✨ บันทึกการเชื่อมต่อ Firebase สำเร็จแล้ว!', 'success');
            self.switchModalTab('login');
          }
        });
      }

      // Quick JSON Paste Button for Firebase
      const btnPasteJson = document.getElementById('btnPasteFirebaseJson');
      if (btnPasteJson) {
        btnPasteJson.addEventListener('click', () => {
          const raw = prompt('วาง firebaseConfig แบบ JSON หรือ Object ที่คัดลอกจาก Firebase Console:');
          if (!raw) return;
          try {
            // Clean up JS object string into valid JSON if needed
            let cleaned = raw.replace(/const\s+firebaseConfig\s*=\s*/g, '')
                             .replace(/;\s*$/g, '')
                             .replace(/([a-zA-Z0-9_]+):/g, '"$1":')
                             .replace(/'/g, '"');
            const parsed = JSON.parse(cleaned);
            if (parsed.apiKey) {
              window.saveFirebaseConfig(parsed);
              self.isFirebaseReady = true;
              self.initFirebase();
              self.showToast('✨ เชื่อมต่อ Firebase จาก JSON สำเร็จแล้ว!', 'success');
              self.renderConfigForm();
            } else {
              self.showToast('ไม่พบค่า apiKey ในข้อความที่วาง', 'error');
            }
          } catch (err) {
            self.showToast('รูปแบบไม่ถูกต้อง กรุณากรอกในช่องแบบฟอร์มด้านล่างแทนค่ะ', 'error');
          }
        });
      }

      // Quick switch links
      const toRegLink = document.getElementById('linkSwitchToRegister');
      const toLoginLink = document.getElementById('linkSwitchToLogin');
      if (toRegLink) toRegLink.addEventListener('click', (e) => { e.preventDefault(); self.switchModalTab('register'); });
      if (toLoginLink) toLoginLink.addEventListener('click', (e) => { e.preventDefault(); self.switchModalTab('login'); });

      // Click status pill to open config
      const statusPill = document.getElementById('authFirebaseStatusPill');
      if (statusPill) {
        statusPill.addEventListener('click', () => self.switchModalTab('config'));
      }
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

            <!-- Firebase Connection Status Bar -->
            <div class="auth-status-bar">
              <button type="button" id="authFirebaseStatusPill" class="auth-status-pill offline" title="คลิกเพื่อตั้งค่า Firebase Connection">
                <span class="status-dot orange"></span> กำลังตรวจสอบการเชื่อมต่อ...
              </button>
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
                <i class="fa-solid fa-id-card"></i> ข้อมูลดวงชะตา
              </button>
              <button class="auth-tab-btn" data-tab="config" id="authTabConfigBtn" title="ตั้งค่า Firebase Credentials">
                <i class="fa-solid fa-gear"></i> เชื่อมต่อ Firebase
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
                    <i class="fa-solid fa-arrow-right-to-bracket"></i> เข้าสู่ระบบ
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
                      <label><i class="fa-solid fa-user"></i> นามสกุล:</label>
                      <input type="text" id="regLastName" placeholder="นามสกุล (ถ้ามี)">
                    </div>
                  </div>

                  <div class="auth-field">
                    <label><i class="fa-solid fa-envelope"></i> อีเมล:</label>
                    <input type="email" id="regEmail" placeholder="your-email@example.com" required>
                  </div>

                  <div class="auth-grid-2">
                    <div class="auth-field">
                      <label><i class="fa-solid fa-lock"></i> รหัสผ่าน:</label>
                      <input type="password" id="regPassword" placeholder="อย่างน้อย 6 ตัวอักษร" required minlength="6">
                    </div>
                    <div class="auth-field">
                      <label><i class="fa-solid fa-shield-check"></i> ยืนยันรหัสผ่าน:</label>
                      <input type="password" id="regConfirmPassword" placeholder="ยืนยันอีกครั้ง" required minlength="6">
                    </div>
                  </div>

                  <!-- Birth Astrological Card -->
                  <div class="auth-astrology-card">
                    <div class="auth-astro-header">
                      <i class="fa-solid fa-star"></i> ข้อมูลดวงชะตาส่วนบุคคล (ผูกเข้าผังอัตโนมัติ)
                    </div>
                    <div class="auth-grid-3">
                      <div class="auth-field">
                        <label><i class="fa-solid fa-calendar-days"></i> วันเกิด:</label>
                        <input type="date" id="regBirthDate" required>
                      </div>
                      <div class="auth-field">
                        <label><i class="fa-solid fa-clock"></i> เวลาเกิด (ตกฟาก):</label>
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

                  <button type="submit" class="auth-submit-btn">
                    <i class="fa-solid fa-user-plus"></i> สมัครสมาชิกและบันทึกดวงชะตา
                  </button>
                  <p class="auth-footer-text">
                    มีบัญชีอยู่แล้ว? <a href="#" id="linkSwitchToLogin">เข้าสู่ระบบที่นี่</a>
                  </p>
                </form>
              </div>

              <!-- 3. PROFILE TAB -->
              <div class="auth-tab-content" data-content="profile">
                <div id="authProfileDetails">
                  <!-- Rendered dynamically -->
                </div>
              </div>

              <!-- 4. FIREBASE CONFIG TAB -->
              <div class="auth-tab-content" data-content="config">
                <div class="auth-config-intro">
                  <div class="auth-config-header">
                    <i class="fa-solid fa-fire text-orange"></i>
                    <div>
                      <h4>เชื่อมต่อ Firebase Authentication จริง</h4>
                      <p>ใส่ Firebase Keys จากโปรเจกต์ของคุณเพื่อเปิดใช้งานระบบ Google Sign-In &amp; Cloud Database</p>
                    </div>
                  </div>
                  <button type="button" id="btnPasteFirebaseJson" class="auth-btn-paste-json">
                    <i class="fa-solid fa-paste"></i> วางโค้ด JSON จาก Firebase Console
                  </button>
                </div>

                <form id="firebaseConfigForm" class="auth-form">
                  <div class="auth-field">
                    <label>API Key:</label>
                    <input type="text" id="fbCfgApiKey" placeholder="AIzaSy..." required>
                  </div>
                  <div class="auth-grid-2">
                    <div class="auth-field">
                      <label>Auth Domain:</label>
                      <input type="text" id="fbCfgAuthDomain" placeholder="xxx.firebaseapp.com" required>
                    </div>
                    <div class="auth-field">
                      <label>Project ID:</label>
                      <input type="text" id="fbCfgProjectId" placeholder="my-oracle-app" required>
                    </div>
                  </div>
                  <div class="auth-grid-3">
                    <div class="auth-field">
                      <label>Storage Bucket:</label>
                      <input type="text" id="fbCfgStorageBucket" placeholder="xxx.appspot.com">
                    </div>
                    <div class="auth-field">
                      <label>Messaging Sender ID:</label>
                      <input type="text" id="fbCfgMessagingSenderId" placeholder="123456789">
                    </div>
                    <div class="auth-field">
                      <label>App ID:</label>
                      <input type="text" id="fbCfgAppId" placeholder="1:123456:web:abc">
                    </div>
                  </div>
                  <button type="submit" class="auth-submit-btn">
                    <i class="fa-solid fa-floppy-disk"></i> บันทึกและเชื่อมต่อ Firebase
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
