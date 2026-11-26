/**
 * Visitor & Traffic Statistics Engine for แม่หมอติ๊ดติ๊ด (MaeMorTidTid)
 * Syncs pageviews, unique daily visitors, and feature events to Google Analytics & Firestore
 */
(function () {
  'use strict';

  const TRAFFIC_COLLECTION = 'site_traffic';
  const SUMMARY_DOC = 'overview';

  function getTodayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function getClientUid() {
    let uid = localStorage.getItem('mm_client_uid');
    if (!uid) {
      uid = 'usr_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      localStorage.setItem('mm_client_uid', uid);
    }
    return uid;
  }

  const VisitorStats = {
    todayData: { pageviews: 0, unique_visitors: 0 },
    summaryData: { total_pageviews: 0, total_visitors: 0 },
    initialized: false,

    init: async function () {
      if (typeof firebase === 'undefined' || !firebase.firestore) {
        setTimeout(() => this.init(), 1000);
        return;
      }
      
      const todayKey = getTodayKey();
      const lastVisitDate = localStorage.getItem('mm_last_visit_date');
      const isNewDayVisitor = (lastVisitDate !== todayKey);

      try {
        const db = firebase.firestore();
        const batch = db.batch();
        const todayRef = db.collection(TRAFFIC_COLLECTION).doc(todayKey);
        const summaryRef = db.collection(TRAFFIC_COLLECTION).doc(SUMMARY_DOC);

        const inc = firebase.firestore.FieldValue.increment;
        const now = firebase.firestore.FieldValue.serverTimestamp();

        // Increment today & summary pageviews
        const todayUpdate = {
          date: todayKey,
          pageviews: inc(1),
          last_active: now
        };
        const summaryUpdate = {
          total_pageviews: inc(1),
          last_active: now
        };

        if (isNewDayVisitor) {
          todayUpdate.unique_visitors = inc(1);
          summaryUpdate.total_visitors = inc(1);
          localStorage.setItem('mm_last_visit_date', todayKey);
        }

        batch.set(todayRef, todayUpdate, { merge: true });
        batch.set(summaryRef, summaryUpdate, { merge: true });

        await batch.commit();
        this.initialized = true;
      } catch (err) {
        console.warn('[VisitorStats] Traffic logging note:', err.message);
      }

      this.subscribeLiveStats();
    },

    subscribeLiveStats: function () {
      if (typeof firebase === 'undefined' || !firebase.firestore) return;
      try {
        const db = firebase.firestore();
        const todayKey = getTodayKey();

        // Listen to today doc
        db.collection(TRAFFIC_COLLECTION).doc(todayKey).onSnapshot(doc => {
          if (doc.exists) {
            this.todayData = doc.data() || {};
            this.updateAdminUI();
          }
        }, err => console.warn('[VisitorStats] Today snapshot note:', err.message));

        // Listen to summary doc
        db.collection(TRAFFIC_COLLECTION).doc(SUMMARY_DOC).onSnapshot(doc => {
          if (doc.exists) {
            this.summaryData = doc.data() || {};
            this.updateAdminUI();
          }
        }, err => console.warn('[VisitorStats] Summary snapshot note:', err.message));
      } catch (e) {
        console.warn('[VisitorStats] subscribe error:', e);
      }
    },

    updateAdminUI: function () {
      const vTodayEl = document.getElementById('adminVisitorToday');
      const pTodayEl = document.getElementById('adminViewsToday');
      const vTotalEl = document.getElementById('adminVisitorTotal');
      const pTotalEl = document.getElementById('adminViewsTotal');

      // Use Firestore stats if available, otherwise fall back to local session stats
      const localPviews = parseInt(localStorage.getItem('mm_local_total_pviews') || '1', 10);
      const vToday = this.todayData.unique_visitors || 1;
      const pToday = this.todayData.pageviews || parseInt(sessionStorage.getItem('mm_session_pviews') || '1', 10);
      const vTotal = this.summaryData.total_visitors || 1;
      const pTotal = this.summaryData.total_pageviews || localPviews;

      if (vTodayEl) vTodayEl.textContent = Number(vToday).toLocaleString();
      if (pTodayEl) pTodayEl.textContent = Number(pToday).toLocaleString();
      if (vTotalEl) vTotalEl.textContent = Number(vTotal).toLocaleString();
      if (pTotalEl) pTotalEl.textContent = Number(pTotal).toLocaleString();
    },

    trackEvent: function (action, category, label) {
      // 1. Send to Google Analytics (GA4)
      try {
        if (typeof window.gtag === 'function') {
          window.gtag('event', action, {
            event_category: category || 'engagement',
            event_label: label || ''
          });
        }
      } catch (e) {}

      // 2. Count feature metric in Firestore
      try {
        if (typeof firebase !== 'undefined' && firebase.firestore) {
          const db = firebase.firestore();
          const todayKey = getTodayKey();
          const safeKey = `metric_${action.replace(/[^a-zA-Z0-9_]/g, '_')}`;
          db.collection(TRAFFIC_COLLECTION).doc(todayKey).set({
            [safeKey]: firebase.firestore.FieldValue.increment(1)
          }, { merge: true }).catch(() => {});
        }
      } catch (e) {}
    }
  };

  window.VisitorStats = VisitorStats;
  window.trackAppEvent = function (action, category, label) {
    VisitorStats.trackEvent(action, category, label);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => VisitorStats.init());
  } else {
    VisitorStats.init();
  }
})();
