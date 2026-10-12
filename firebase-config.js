/**
 * ============================================================================
 * FIREBASE CONFIGURATION - แม่หมอติ๊ดติ๊ด (DESTINY ARCANA)
 * บริการ Authentication (Google Sign-In & Email/Password) และ Firestore
 * ============================================================================
 * 
 * วิธีการนำค่าจาก Firebase Console มาใส่:
 * 1. ไปที่ https://console.firebase.google.com/
 * 2. สร้างโปรเจกต์ใหม่ (หรือเลือกโปรเจกต์ที่มีอยู่)
 * 3. ไปที่เมนู "Authentication" > "Sign-in method" > เปิดใช้งาน "Google" และ "Email/Password"
 * 4. ไปที่เมนู "Firestore Database" > สร้างฐานข้อมูล (โหมดทดสอบ หรือ Production)
 * 5. ไปที่ Project Settings (รูปฟันเฟือง) > ส่วน "Your apps" > เพิ่ม Web App (</>)
 * 6. คัดลอกค่า firebaseConfig มาวางแทนที่ด้านล่างนี้ หรือใส่ผ่านหน้าเว็บได้ทันที!
 */

(function () {
  'use strict';

  // ค่าคอนฟิกเริ่มต้น (สามารถแก้ไขที่นี่ หรือวางในหน้าต่างตั้งค่าของเว็บได้)
  const DEFAULT_CONFIG = {
    apiKey: "AIzaSyYOUR_ACTUAL_API_KEY_HERE",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
  };

  // ตรวจสอบค่าที่บันทึกไว้ในเบราว์เซอร์
  function getActiveConfig() {
    try {
      const stored = localStorage.getItem('jiutian_firebase_config');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.apiKey && !parsed.apiKey.includes('YOUR_ACTUAL')) {
          return parsed;
        }
      }
    } catch (e) {}

    return DEFAULT_CONFIG;
  }

  function isConfigConfigured(cfg) {
    if (!cfg || !cfg.apiKey || !cfg.projectId) return false;
    if (cfg.apiKey.includes('YOUR_ACTUAL') || cfg.projectId.includes('your-project-id')) return false;
    return true;
  }

  const activeConfig = getActiveConfig();
  window.FIREBASE_CONFIG = activeConfig;
  window.isFirebaseConfigured = function () {
    return isConfigConfigured(window.FIREBASE_CONFIG);
  };

  window.saveFirebaseConfig = function (newConfig) {
    if (!newConfig || !newConfig.apiKey) return false;
    try {
      localStorage.setItem('jiutian_firebase_config', JSON.stringify(newConfig));
      window.FIREBASE_CONFIG = newConfig;
      // Reinitialize firebase
      if (window.firebase) {
        try {
          if (firebase.apps.length > 0) {
            firebase.app().delete().then(() => {
              firebase.initializeApp(newConfig);
              console.log('[Firebase] Re-initialized with new credentials.');
            });
          } else {
            firebase.initializeApp(newConfig);
          }
        } catch (err) {
          console.warn('[Firebase] Re-init error:', err);
        }
      }
      return true;
    } catch (e) {
      console.error('Failed to save Firebase config:', e);
      return false;
    }
  };

  // Initialize Firebase if library is loaded
  if (typeof firebase !== 'undefined') {
    try {
      if (!firebase.apps.length && isConfigConfigured(activeConfig)) {
        firebase.initializeApp(activeConfig);
        console.log('[Firebase] Initialized successfully with projectId:', activeConfig.projectId);
      }
    } catch (err) {
      console.warn('[Firebase] Init warning:', err.message);
    }
  }

})();
