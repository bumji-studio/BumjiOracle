/**
 * ============================================================================
 * แม่หมอติ๊ดติ๊ด (DESTINY ARCANA) - Booking & Consultation Appointment Engine
 * ระบบจองคิวดูดวงเฉพาะบุคคล & ระบบจัดการคิวและตั้งค่าวัน-เวลาสำหรับ Admin
 * 
 * กฎและการตั้งค่า (Admin ปรับแต่งได้เอง & บันทึกทันที Auto-Save):
 * - วันที่เปิดรับ: ค่าเริ่มต้น วันเสาร์ และ วันอาทิตย์ (Admin ปรับเป็นวันอื่นๆ ได้)
 * - เวลาทำการ: ค่าเริ่มต้น 14.00 - 20.00 น. (Admin เพิ่ม/ลบ/ปรับรอบเวลาได้)
 * - ระยะห่างระหว่างคิว: ค่าเริ่มต้น 2 ชั่วโมง (Admin ปรับได้)
 * - วันหยุดพิเศษ: Admin สามารถระบุวันงดรับคิวเฉพาะกิจได้
 * - ลูกค้าจอง: ส่ง Email แจ้งเตือนไปที่ bumjaa@gmail.com
 * - Admin ตอบรับ: กดตอบรับในเมนู "ลูกค้าจองดูดวง" แล้วระบบส่ง Email ยืนยันให้ลูกค้า
 * ============================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'maemor_tidtid_bookings';
  const SETTINGS_STORAGE_KEY = 'maemor_tidtid_booking_settings';
  const ADMIN_EMAIL = 'bumjaa@gmail.com';
  const FIRESTORE_COLLECTION = 'bookings';
  const SETTINGS_FIRESTORE_COLLECTION = 'booking_settings';
  const SETTINGS_DOC_ID = 'general_config';

  const THAI_DAYS = [
    { id: 0, name: 'วันอาทิตย์', short: 'อาทิตย์', badgeClass: 'badge-sun' },
    { id: 1, name: 'วันจันทร์', short: 'จันทร์', badgeClass: 'badge-mon' },
    { id: 2, name: 'วันอังคาร', short: 'อังคาร', badgeClass: 'badge-tue' },
    { id: 3, name: 'วันพุธ', short: 'พุธ', badgeClass: 'badge-wed' },
    { id: 4, name: 'วันพฤหัสบดี', short: 'พฤหัส', badgeClass: 'badge-thu' },
    { id: 5, name: 'วันศุกร์', short: 'ศุกร์', badgeClass: 'badge-fri' },
    { id: 6, name: 'วันเสาร์', short: 'เสาร์', badgeClass: 'badge-sat' }
  ];

  const DEFAULT_SETTINGS = {
    isOpen: true,
    closedNotice: 'ขออภัยค่ะ ขณะนี้แม่หมอขอปิดรับคิวชั่วคราว หากเปิดรับแล้วจะแจ้งให้ทราบนะคะ ✨',
    availableDays: [0, 6], // 0: อาทิตย์, 6: เสาร์
    minGapMinutes: 120, // 2 ชั่วโมง
    timeSlots: [
      { start: '14:00', end: '16:00', label: '14:00 - 16:00 น.' },
      { start: '16:00', end: '18:00', label: '16:00 - 18:00 น.' },
      { start: '18:00', end: '20:00', label: '18:00 - 20:00 น.' },
      { start: '20:00', end: '22:00', label: '20:00 - 22:00 น.' }
    ],
    blockedDates: [] // [{ date: 'YYYY-MM-DD', reason: 'ติดภารกิจ' }]
  };

  const BookingApp = {
    bookings: [],
    settings: JSON.parse(JSON.stringify(DEFAULT_SETTINGS)),
    selectedDate: null,
    selectedTimeSlot: null,
    adminFilter: 'all', // 'all', 'pending', 'confirmed', 'cancelled'
    currentAdminTab: 'bookings', // 'bookings' or 'schedule'
    tempDraftSettings: null,
    unsubscribeFirestore: null,

    init: function () {
      this.loadLocalSettings();
      this.loadLocalBookings();
      this.initFirestoreSync();
      this.bindEvents();
      this.updateAdminBadge();
      this.applyScheduleToHeroBanner();
    },

    // ------------------------------------------------------------------------
    // DATA PERSISTENCE & SETTINGS
    // ------------------------------------------------------------------------
    loadLocalSettings: function () {
      try {
        const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          this.settings = { ...DEFAULT_SETTINGS, ...parsed };
          if (!Array.isArray(this.settings.availableDays) || this.settings.availableDays.length === 0) {
            this.settings.availableDays = [0, 6];
          }
          if (!Array.isArray(this.settings.timeSlots) || this.settings.timeSlots.length === 0) {
            this.settings.timeSlots = DEFAULT_SETTINGS.timeSlots;
          }
          if (!Array.isArray(this.settings.blockedDates)) {
            this.settings.blockedDates = [];
          }
        }
      } catch (e) {
        this.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      }
      this.tempDraftSettings = JSON.parse(JSON.stringify(this.settings));
    },

    saveLocalSettings: function () {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.settings));
      } catch (e) {}
    },

    loadLocalBookings: function () {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          this.bookings = JSON.parse(saved) || [];
        }
      } catch (e) {
        this.bookings = [];
      }
    },

    saveLocalBookings: function () {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.bookings));
      } catch (e) {}
      this.updateAdminBadge();
    },

    initFirestoreSync: function () {
      if (typeof firebase === 'undefined' || !firebase.firestore) return;
      try {
        const db = firebase.firestore();

        // 1. Subscribe to Bookings Collection
        this.unsubscribeFirestore = db.collection(FIRESTORE_COLLECTION)
          .onSnapshot((snapshot) => {
            const remoteList = [];
            snapshot.forEach(doc => {
              remoteList.push({ id: doc.id, ...doc.data() });
            });

            if (remoteList.length > 0) {
              const mergedMap = new Map();
              this.bookings.forEach(b => mergedMap.set(b.id || b.ref, b));
              remoteList.forEach(b => mergedMap.set(b.id || b.ref, b));
              this.bookings = Array.from(mergedMap.values());
              this.bookings.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
              this.saveLocalBookings();

              this.renderTimeSlots();
              this.renderAdminBookingsList();
              this.updateAdminBadge();
            }
          }, (err) => {
            console.warn('Firestore bookings snapshot error:', err);
          });

        // 2. Subscribe to Settings Collection (Sync Admin Settings Across Devices)
        db.collection(SETTINGS_FIRESTORE_COLLECTION).doc(SETTINGS_DOC_ID)
          .onSnapshot((doc) => {
            if (doc.exists) {
              const remoteSettings = doc.data();
              if (remoteSettings && typeof remoteSettings === 'object') {
                this.settings = { ...DEFAULT_SETTINGS, ...remoteSettings };
                this.tempDraftSettings = JSON.parse(JSON.stringify(this.settings));
                this.saveLocalSettings();
                this.onSettingsUpdated();
              }
            }
          }, (err) => {
            console.warn('Firestore settings snapshot error:', err);
          });
      } catch (e) {
        console.warn('Firestore init sync error:', e);
      }
    },

    persistBookingRecord: async function (booking) {
      const existingIdx = this.bookings.findIndex(b => b.id === booking.id || b.ref === booking.ref);
      if (existingIdx !== -1) {
        this.bookings[existingIdx] = booking;
      } else {
        this.bookings.unshift(booking);
      }
      this.saveLocalBookings();

      if (typeof firebase !== 'undefined' && firebase.firestore) {
        try {
          const db = firebase.firestore();
          await db.collection(FIRESTORE_COLLECTION).doc(booking.id).set(booking, { merge: true });
        } catch (e) {
          console.warn('Failed to save booking to Firestore:', e);
        }
      }
    },

    /**
     * อัปเดตและบันทึกการตั้งค่าทันที (Auto-Save) เพื่อให้หน้าลูกค้าเปลี่ยนทันที
     */
    applyAndSaveSettings: async function (partialUpdate) {
      this.settings = { ...this.settings, ...partialUpdate };
      this.tempDraftSettings = JSON.parse(JSON.stringify(this.settings));
      this.saveLocalSettings();
      this.onSettingsUpdated();
      this.showAutoSaveNotice();

      if (typeof firebase !== 'undefined' && firebase.firestore) {
        try {
          const db = firebase.firestore();
          await db.collection(SETTINGS_FIRESTORE_COLLECTION).doc(SETTINGS_DOC_ID).set(this.settings, { merge: true });
        } catch (e) {
          console.warn('Failed to save booking settings to Firestore:', e);
        }
      }
    },

    showAutoSaveNotice: function () {
      const badge = document.getElementById('adminAutoSaveBadge');
      if (badge) {
        badge.innerHTML = '<i class="fa-solid fa-circle-check text-emerald-500"></i> บันทึก & อัปเดตหน้าลูกค้าเรียบร้อยแล้ว ✨';
        badge.classList.remove('hidden');
        badge.style.opacity = '1';
        setTimeout(() => {
          if (badge) {
            badge.innerHTML = '<i class="fa-solid fa-circle-check text-emerald-500"></i> บันทึกและเชื่อมต่อหน้าลูกค้าแล้ว';
          }
        }, 2500);
      }
    },

    onSettingsUpdated: function () {
      this.applyScheduleToHeroBanner();
      this.renderAvailableDates();
      this.renderTimeSlots();
      if (this.currentAdminTab === 'schedule') {
        this.populateAdminScheduleSettings();
      }
    },

    updateAdminBadge: function () {
      const badge = document.getElementById('adminPendingCounterBadge');
      const navPending = document.getElementById('adminNavPendingCount');
      const pendingCount = this.bookings.filter(b => b.status === 'pending').length;

      if (badge) {
        if (pendingCount > 0) {
          badge.textContent = String(pendingCount);
          badge.classList.remove('hidden');
          badge.style.display = 'inline-flex';
        } else {
          badge.classList.add('hidden');
          badge.style.display = 'none';
        }
      }

      if (navPending) {
        navPending.textContent = String(pendingCount);
        navPending.style.display = pendingCount > 0 ? 'inline-block' : 'none';
      }
    },

    // ------------------------------------------------------------------------
    // BUSINESS LOGIC: DYNAMIC DATES & TIME SLOTS
    // ------------------------------------------------------------------------
    getScheduleSummary: function () {
      const openDays = Array.isArray(this.settings.availableDays) ? this.settings.availableDays : [0, 6];
      let daysText = '';
      if (openDays.length === 7) {
        daysText = 'เปิดรับทุกวัน';
      } else if (openDays.length === 2 && openDays.includes(0) && openDays.includes(6)) {
        daysText = 'เฉพาะวันเสาร์ และ วันอาทิตย์';
      } else if (openDays.length === 3 && openDays.includes(5) && openDays.includes(6) && openDays.includes(0)) {
        daysText = 'วันศุกร์, เสาร์ และ อาทิตย์';
      } else if (openDays.length === 5 && !openDays.includes(0) && !openDays.includes(6)) {
        daysText = 'วันจันทร์ - วันศุกร์';
      } else {
        daysText = openDays.map(d => THAI_DAYS.find(td => td.id === d)?.name || '').filter(Boolean).join(', ');
      }

      const slots = Array.isArray(this.settings.timeSlots) && this.settings.timeSlots.length > 0 
        ? this.settings.timeSlots 
        : DEFAULT_SETTINGS.timeSlots;
      const firstSlot = slots[0];
      const lastSlot = slots[slots.length - 1];
      const hoursText = (firstSlot && lastSlot) ? `${firstSlot.start} - ${lastSlot.end} น.` : '14:00 - 20:00 น.';
      const gapHours = ((this.settings.minGapMinutes || 120) / 60);
      const gapText = gapHours >= 1 ? `${gapHours} ชั่วโมง` : `${this.settings.minGapMinutes || 120} นาที`;

      return { daysText, hoursText, gapText };
    },

    applyScheduleToHeroBanner: function () {
      const heroSubtitle = document.querySelector('.booking-hero-subtitle');
      const step1Title = document.getElementById('bookingStep1Title');
      const step2Title = document.getElementById('bookingStep2Title');
      const closedNoticeBox = document.getElementById('bookingClosedNoticeBox');
      const bookingGrid = document.querySelector('.booking-main-grid');

      const summary = this.getScheduleSummary();

      // Check if bookings are paused/closed
      if (!this.settings.isOpen) {
        if (closedNoticeBox) {
          closedNoticeBox.classList.remove('hidden');
          closedNoticeBox.innerHTML = `
            <div class="booking-closed-banner">
              <i class="fa-solid fa-circle-exclamation text-amber-300 text-2xl"></i>
              <div>
                <strong>แจ้งปิดรับคิวชั่วคราว</strong>
                <p>${this.settings.closedNotice || 'ขออภัยค่ะ ขณะนี้แม่หมอขอปิดรับคิวชั่วคราว หากเปิดรับแล้วจะแจ้งให้ทราบนะคะ ✨'}</p>
              </div>
            </div>
          `;
        }
        if (bookingGrid) {
          bookingGrid.style.opacity = '0.5';
          bookingGrid.style.pointerEvents = 'none';
        }
      } else {
        if (closedNoticeBox) closedNoticeBox.classList.add('hidden');
        if (bookingGrid) {
          bookingGrid.style.opacity = '1';
          bookingGrid.style.pointerEvents = 'auto';
        }
      }

      if (heroSubtitle) {
        heroSubtitle.innerHTML = `
          เปิดรับนัดหมาย<strong>${summary.daysText}</strong> เวลา <strong>${summary.hoursText}</strong><br>
          (คิวนัดหมายห่างกันอย่างน้อย ${summary.gapText} เพื่อวิเคราะห์ผังดวงและทำนายอย่างเจาะลึกเต็มที่ค่ะ ✨)
        `;
      }

      if (step1Title) {
        step1Title.textContent = `เลือกวันที่เปิดรับนัดหมาย (${summary.daysText})`;
      }
      if (step2Title) {
        step2Title.textContent = `เลือกช่วงเวลานัดหมาย (เว้นระยะ ${summary.gapText})`;
      }
    },

    getUpcomingDates: function (count = 14) {
      const dates = [];
      const now = new Date();
      let d = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const openDays = Array.isArray(this.settings.availableDays) ? this.settings.availableDays : [0, 6];
      const blockedList = Array.isArray(this.settings.blockedDates) ? this.settings.blockedDates : [];

      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      let guard = 0;
      while (dates.length < count && guard < 180) {
        guard++;
        const day = d.getDay();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const dayNum = String(d.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${dayNum}`;
        const isBlocked = blockedList.some(b => (b.date || b) === dateStr);

        if (openDays.includes(day) && !isBlocked) {
          const dayMeta = THAI_DAYS.find(td => td.id === day) || { name: 'วัน', short: '', badgeClass: 'badge-sat' };
          const thaiDateText = d.toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });

          dates.push({
            dateStr: dateStr,
            dayOfWeek: day,
            dayLabel: dayMeta.name,
            dateLabel: thaiDateText,
            badgeLabel: dayMeta.short,
            badgeClass: dayMeta.badgeClass,
            isToday: dateStr === todayStr
          });
        }
        d.setDate(d.getDate() + 1);
      }
      return dates;
    },

    timeToMinutes: function (timeStr) {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    },

    checkSlotAvailability: function (dateStr, slotStartStr) {
      if (!dateStr || !slotStartStr) return { available: false, reason: 'ข้อมูลไม่ครบถ้วน' };

      const slotMinutes = this.timeToMinutes(slotStartStr);
      const minGap = this.settings.minGapMinutes || 120;

      // Active bookings on the same date
      const activeBookings = this.bookings.filter(b => {
        return b.date === dateStr && b.status !== 'cancelled';
      });

      for (const b of activeBookings) {
        const bookedMinutes = this.timeToMinutes(b.time);
        const diffMinutes = Math.abs(slotMinutes - bookedMinutes);

        if (diffMinutes < minGap) {
          const hoursGap = Math.round(minGap / 60);
          return {
            available: false,
            reason: `ติดเวลาการจองของคุณ ${b.name || 'ลูกค้า'} (${b.time} น.) ห่างกันไม่ถึง ${hoursGap} ชม.`
          };
        }
      }

      return { available: true };
    },

    getAvailableSlotsForDate: function (dateStr) {
      const slots = Array.isArray(this.settings.timeSlots) && this.settings.timeSlots.length > 0
        ? this.settings.timeSlots
        : DEFAULT_SETTINGS.timeSlots;

      return slots.map(slot => {
        const check = this.checkSlotAvailability(dateStr, slot.start);
        return {
          ...slot,
          isAvailable: check.available,
          reason: check.reason || ''
        };
      });
    },

    // ------------------------------------------------------------------------
    // EMAIL DISPATCH ENGINES
    // ------------------------------------------------------------------------
    sendEmailToAdminOnNewBooking: async function (booking) {
      try {
        const payload = {
          _subject: `🔮 [จองคิวดูดวงใหม่] คุณ ${booking.name} วันที่ ${booking.date} เวลา ${booking.timeRange}`,
          _replyto: booking.email,
          "ชื่อลูกค้า": booking.name,
          "เบอร์โทรศัพท์": booking.phone,
          "อีเมลลูกค้า": booking.email,
          "Line ID": booking.lineId || '-',
          "บริการที่เลือก": booking.service,
          "วันที่นัดหมาย": booking.dateLabel || booking.date,
          "ช่วงเวลาที่จอง": booking.timeRange,
          "เรื่องที่ต้องการปรึกษา": booking.topic || 'ไม่ระบุ',
          "รหัสการจอง": booking.ref,
          "สถานะ": "⏳ รอ Admin ตรวจสอบและกดตอบรับในระบบ",
          "ข้อความ": "มีลูกค้าทำการจองคิวดูดวง กรุณาเข้าสู่ระบบ Admin เพื่อกดตอบรับการนัดหมายค่ะ"
        };

        const resp = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(ADMIN_EMAIL)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        return resp.ok;
      } catch (err) {
        console.warn('Could not send booking email to admin via FormSubmit:', err);
        return false;
      }
    },

    sendConfirmationEmailToCustomer: async function (booking) {
      try {
        const payload = {
          _subject: `✨ ยืนยันการนัดหมายดูดวงกับแม่หมอติ๊ดติ๊ด (${booking.date} เวลา ${booking.timeRange})`,
          _replyto: ADMIN_EMAIL,
          "เรียนคุณ": booking.name,
          "สถานะการนัดหมาย": "✅ ได้รับการยืนยันคิวเรียบร้อยแล้ว",
          "รหัสการจอง": booking.ref,
          "วันที่นัดหมาย": booking.dateLabel || booking.date,
          "ช่วงเวลานัดหมาย": booking.timeRange,
          "บริการ": booking.service,
          "ผู้ให้บริการ": "แม่หมอติ๊ดติ๊ด (Bumji)",
          "สิ่งที่ต้องเตรียม": "คำถามที่ต้องการถาม, วันเดือนปีเกิดและเวลาเกิดที่แน่นอน",
          "ข้อความจากแม่หมอ": "แม่หมอได้รับคิวและตอบรับการนัดหมายเรียบร้อยแล้วค่ะ แล้วพบกันตามวันและเวลาที่นัดหมายนะคะ ขอบพระคุณมากค่ะ 💖"
        };

        const resp = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(booking.email)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        return resp.ok;
      } catch (err) {
        console.warn('Could not send confirmation email to customer via FormSubmit:', err);
        return false;
      }
    },

    // ------------------------------------------------------------------------
    // UI RENDERING: CUSTOMER BOOKING VIEW
    // ------------------------------------------------------------------------
    onTabShow: function (role = 'customer') {
      this.loadLocalSettings();
      this.applyScheduleToHeroBanner();

      if (role === 'admin' || (window.AuthManager && window.AuthManager.isAdmin())) {
        this.renderAdminBookingsList();
        if (this.currentAdminTab === 'schedule') {
          this.populateAdminScheduleSettings();
        }
      }

      this.renderAvailableDates();
      this.renderTimeSlots();
      this.updateAdminBadge();
    },

    renderAvailableDates: function () {
      const container = document.getElementById('bookingWeekendDatesContainer');
      if (!container) return;

      const dates = this.getUpcomingDates(14);
      if (dates.length === 0) {
        container.innerHTML = '<p class="booking-empty-notice">ขณะนี้ยังไม่มีรอบวันที่เปิดรับนัดหมาย กรุณาติดต่อแม่หมอโดยตรงนะคะ</p>';
        return;
      }

      if (!this.selectedDate || !dates.some(d => d.dateStr === this.selectedDate)) {
        this.selectedDate = dates[0].dateStr;
      }

      container.innerHTML = dates.map(item => {
        const isSelected = item.dateStr === this.selectedDate;
        const availableCount = this.getAvailableSlotsForDate(item.dateStr).filter(s => s.isAvailable).length;
        const isFull = availableCount === 0;

        return `
          <button type="button" 
            class="booking-date-chip ${isSelected ? 'selected' : ''} ${isFull ? 'date-full' : ''}" 
            data-date="${item.dateStr}"
            onclick="window.BookingApp.selectDate('${item.dateStr}')">
            <span class="chip-badge ${item.badgeClass || 'badge-sat'}">${item.badgeLabel}</span>
            <strong class="chip-date">${item.dateLabel}</strong>
            <span class="chip-status ${isFull ? 'status-full' : 'status-avail'}">
              ${isFull ? '🔒 คิวเต็ม' : `✨ ว่าง ${availableCount} คิว`}
            </span>
          </button>
        `;
      }).join('');
    },

    selectDate: function (dateStr) {
      this.selectedDate = dateStr;
      this.selectedTimeSlot = null;
      this.renderAvailableDates();
      this.renderTimeSlots();
    },

    renderTimeSlots: function () {
      const container = document.getElementById('bookingTimeSlotsContainer');
      const dateNotice = document.getElementById('bookingSelectedDateNotice');
      if (!container) return;

      if (!this.selectedDate) {
        container.innerHTML = '<p class="booking-empty-notice">กรุณาเลือกวันที่ด้านบนก่อนค่ะ</p>';
        return;
      }

      const slots = this.getAvailableSlotsForDate(this.selectedDate);
      const selObj = this.getUpcomingDates(30).find(w => w.dateStr === this.selectedDate);
      const summary = this.getScheduleSummary();

      if (dateNotice) {
        dateNotice.innerHTML = `<i class="fa-solid fa-calendar-day text-purple-600"></i> วันที่เลือก: <strong>${selObj ? selObj.dateLabel + ' (' + selObj.dayLabel + ')' : this.selectedDate}</strong> (เวลาทำการ ${summary.hoursText})`;
      }

      if (slots.length === 0) {
        container.innerHTML = '<p class="booking-empty-notice">ไม่มีรอบเวลาเปิดรับในวันดังกล่าว</p>';
        return;
      }

      container.innerHTML = slots.map(slot => {
        const isSelected = this.selectedTimeSlot && this.selectedTimeSlot.start === slot.start;
        if (!slot.isAvailable) {
          return `
            <div class="booking-time-slot disabled" title="${slot.reason || 'จองแล้ว'}">
              <div class="slot-time-row">
                <i class="fa-solid fa-lock text-slate-400"></i>
                <span class="slot-time-text">${slot.label}</span>
              </div>
              <span class="slot-state-badge booked">จองแล้ว (ไม่ว่าง)</span>
            </div>
          `;
        }

        return `
          <button type="button" 
            class="booking-time-slot available ${isSelected ? 'selected' : ''}" 
            onclick="window.BookingApp.selectTimeSlot('${slot.start}', '${slot.end}', '${slot.label}')">
            <div class="slot-time-row">
              <i class="fa-solid fa-clock ${isSelected ? 'text-white' : 'text-purple-600'}"></i>
              <span class="slot-time-text">${slot.label}</span>
            </div>
            <span class="slot-state-badge open">ว่าง (${summary.gapText})</span>
          </button>
        `;
      }).join('');
    },

    selectTimeSlot: function (start, end, label) {
      this.selectedTimeSlot = { start, end, label };
      this.renderTimeSlots();

      const summary = document.getElementById('bookingChosenSlotSummary');
      if (summary) {
        const selObj = this.getUpcomingDates(30).find(w => w.dateStr === this.selectedDate);
        summary.innerHTML = `
          <div class="booking-chosen-card">
            <i class="fa-solid fa-circle-check text-emerald-500 text-xl"></i>
            <div>
              <strong>${selObj ? selObj.dayLabel : ''} ที่ ${selObj ? selObj.dateLabel : this.selectedDate}</strong>
              <div class="text-purple-700 font-semibold">ช่วงเวลา: ${label}</div>
            </div>
          </div>
        `;
      }
    },

    handleCustomerFormSubmit: async function (e) {
      e.preventDefault();

      if (!this.settings.isOpen) {
        alert('ขออภัยค่ะ ขณะนี้ระบบปิดรับคิวชั่วคราว');
        return;
      }

      if (!this.selectedDate) {
        alert('กรุณาเลือกวันที่ต้องการดูดวงก่อนค่ะ');
        return;
      }
      if (!this.selectedTimeSlot) {
        alert('กรุณาเลือกช่วงเวลาที่ต้องการดูดวงค่ะ');
        return;
      }

      // Re-verify availability
      const check = this.checkSlotAvailability(this.selectedDate, this.selectedTimeSlot.start);
      if (!check.available) {
        alert('ขออภัยค่ะ เวลานี้เพิ่งมีผู้จองหรือติดกฎระยะห่าง กรุณาเลือกช่วงเวลาอื่นนะคะ');
        this.renderTimeSlots();
        return;
      }

      const name = document.getElementById('bookingInputName').value.trim();
      const phone = document.getElementById('bookingInputPhone').value.trim();
      const email = document.getElementById('bookingInputEmail').value.trim();
      const lineId = document.getElementById('bookingInputLine').value.trim();
      const service = document.getElementById('bookingSelectService').value;
      const topic = document.getElementById('bookingInputTopic').value.trim();

      if (!name || !phone || !email) {
        alert('กรุณากรอกชื่อ เบอร์โทรศัพท์ และอีเมลให้ครบถ้วนค่ะ');
        return;
      }

      const selObj = this.getUpcomingDates(30).find(w => w.dateStr === this.selectedDate);
      const dateLabel = selObj ? `${selObj.dayLabel} ที่ ${selObj.dateLabel}` : this.selectedDate;

      const submitBtn = document.getElementById('bookingSubmitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังส่งข้อมูลนัดหมาย...';
      }

      const bookingRef = 'MMT-' + Date.now().toString(36).toUpperCase();
      const newBooking = {
        id: 'book_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        ref: bookingRef,
        name: name,
        phone: phone,
        email: email,
        lineId: lineId,
        service: service,
        topic: topic,
        date: this.selectedDate,
        dateLabel: dateLabel,
        time: this.selectedTimeSlot.start,
        timeEnd: this.selectedTimeSlot.end,
        timeRange: this.selectedTimeSlot.label,
        status: 'pending', // 'pending', 'confirmed', 'cancelled'
        createdAt: new Date().toISOString(),
        createdFormatted: new Date().toLocaleDateString('th-TH', {
          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }) + ' น.'
      };

      // 1. Persist booking
      await this.persistBookingRecord(newBooking);

      // 2. Dispatch email notification to admin (bumjaa@gmail.com)
      this.sendEmailToAdminOnNewBooking(newBooking);

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> ยืนยันการจองคิวดูดวง';
      }

      // 3. Show success dialog / modal
      this.showCustomerSuccessModal(newBooking);

      // 4. Reset selection and form
      document.getElementById('bookingCustomerForm').reset();
      this.selectedTimeSlot = null;
      this.renderAvailableDates();
      this.renderTimeSlots();
    },

    showCustomerSuccessModal: function (booking) {
      const modal = document.getElementById('bookingSuccessModal');
      const details = document.getElementById('bookingSuccessDetails');
      if (!modal || !details) return;

      details.innerHTML = `
        <div class="booking-success-card">
          <div class="success-badge-ref">${booking.ref}</div>
          <div class="success-info-row">
            <span class="info-label">ชื่อผู้จอง:</span>
            <strong>คุณ ${booking.name}</strong>
          </div>
          <div class="success-info-row">
            <span class="info-label">วันนัดหมาย:</span>
            <strong class="text-purple-700">${booking.dateLabel}</strong>
          </div>
          <div class="success-info-row">
            <span class="info-label">ช่วงเวลา:</span>
            <strong class="text-purple-700">${booking.timeRange}</strong>
          </div>
          <div class="success-info-row">
            <span class="info-label">บริการ:</span>
            <span>${booking.service}</span>
          </div>
          <div class="success-info-row">
            <span class="info-label">อีเมลรับผล:</span>
            <span>${booking.email}</span>
          </div>
          <div class="success-note">
            <i class="fa-solid fa-paper-plane text-purple-600"></i>
            ระบบได้ส่งข้อมูลการจองไปยังอีเมลแม่หมอ (<strong>${ADMIN_EMAIL}</strong>) แล้วค่ะ<br>
            เมื่อแม่หมอกด <strong>"ตอบรับ"</strong> ในระบบ จะมีอีเมลยืนยันวันและเวลาส่งตรงถึงคุณ <strong>${booking.email}</strong> ทันทีค่ะ ✨
          </div>
        </div>
      `;

      modal.classList.remove('hidden');
      modal.classList.add('show');
    },

    closeCustomerSuccessModal: function () {
      const modal = document.getElementById('bookingSuccessModal');
      if (modal) {
        modal.classList.remove('show');
        modal.classList.add('hidden');
      }
    },

    // ------------------------------------------------------------------------
    // ADMIN SUB-TABS: BOOKINGS FEED VS SCHEDULE SETTINGS
    // ------------------------------------------------------------------------
    switchAdminTab: function (tabName) {
      this.currentAdminTab = tabName;

      const tabBookingsBtn = document.getElementById('adminNavTabBookings');
      const tabScheduleBtn = document.getElementById('adminNavTabSchedule');
      const bookingsPanel = document.getElementById('adminBookingsFeedPanel');
      const schedulePanel = document.getElementById('adminScheduleSettingsPanel');

      if (tabBookingsBtn) tabBookingsBtn.classList.toggle('active', tabName === 'bookings');
      if (tabScheduleBtn) tabScheduleBtn.classList.toggle('active', tabName === 'schedule');

      if (bookingsPanel) {
        if (tabName === 'bookings') {
          bookingsPanel.classList.remove('hidden');
          this.renderAdminBookingsList();
        } else {
          bookingsPanel.classList.add('hidden');
        }
      }

      if (schedulePanel) {
        if (tabName === 'schedule') {
          schedulePanel.classList.remove('hidden');
          this.populateAdminScheduleSettings();
        } else {
          schedulePanel.classList.add('hidden');
        }
      }
    },

    adminGoToCustomerView: function () {
      if (window.setActiveAppMode) {
        window.setActiveAppMode('booking');
      }
    },

    // ------------------------------------------------------------------------
    // ADMIN SCHEDULE SETTINGS CONTROLLER (ปรับเปลี่ยนวัน-เวลารับดูดวง & Auto-Save)
    // ------------------------------------------------------------------------
    populateAdminScheduleSettings: function () {
      // 1. Status Toggle & Closed Notice
      const statusCheckbox = document.getElementById('adminSettingIsOpen');
      const statusText = document.getElementById('adminSettingStatusText');
      const noticeInput = document.getElementById('adminSettingClosedNotice');
      if (statusCheckbox) {
        statusCheckbox.checked = !!this.settings.isOpen;
        if (statusText) {
          statusText.textContent = this.settings.isOpen ? '🟢 กำลังเปิดรับจองคิวตามปกติ' : '🔴 ปิดรับจองชั่วคราว';
          statusText.style.color = this.settings.isOpen ? '#059669' : '#dc2626';
        }
      }
      if (noticeInput) {
        noticeInput.value = this.settings.closedNotice || '';
      }

      // 2. Day of Week Checkboxes
      const daysContainer = document.getElementById('adminSettingDaysContainer');
      if (daysContainer) {
        const activeDays = this.settings.availableDays || [0, 6];
        daysContainer.innerHTML = THAI_DAYS.map(day => {
          const isChecked = activeDays.includes(day.id);
          return `
            <button type="button" 
              class="day-toggle-chip ${isChecked ? 'active' : ''} ${day.badgeClass}" 
              onclick="window.BookingApp.adminToggleDay(${day.id})">
              <i class="fa-solid ${isChecked ? 'fa-circle-check text-purple-600' : 'fa-circle text-slate-300'}"></i>
              <span>${day.name}</span>
            </button>
          `;
        }).join('');
      }

      // 3. Min Gap selector
      const gapSelect = document.getElementById('adminSettingMinGap');
      if (gapSelect) {
        gapSelect.value = String(this.settings.minGapMinutes || 120);
      }

      // 4. Time Slots Pills
      this.renderAdminSlotsEditor();

      // 5. Blocked Dates List
      this.renderAdminBlockedDatesEditor();
    },

    adminToggleStatus: function () {
      const checkbox = document.getElementById('adminSettingIsOpen');
      const isOpen = checkbox ? checkbox.checked : !this.settings.isOpen;
      this.applyAndSaveSettings({ isOpen });
      this.populateAdminScheduleSettings();
    },

    adminToggleDay: function (dayId) {
      let days = [...(this.settings.availableDays || [0, 6])];
      if (days.includes(dayId)) {
        if (days.length <= 1) {
          alert('ต้องเลือกเปิดรับอย่างน้อย 1 วันในสัปดาห์ค่ะ');
          return;
        }
        days = days.filter(d => d !== dayId);
      } else {
        days.push(dayId);
        days.sort((a, b) => a - b);
      }
      this.applyAndSaveSettings({ availableDays: days });
      this.populateAdminScheduleSettings();
    },

    adminApplyPresetDays: function (preset) {
      let days = [0, 6];
      if (preset === 'weekend') days = [0, 6];
      else if (preset === 'all') days = [0, 1, 2, 3, 4, 5, 6];
      else if (preset === 'weekday') days = [1, 2, 3, 4, 5];
      else if (preset === 'fri_sat_sun') days = [5, 6, 0];

      this.applyAndSaveSettings({ availableDays: days });
      this.populateAdminScheduleSettings();
    },

    renderAdminSlotsEditor: function () {
      const container = document.getElementById('adminSettingSlotsContainer');
      if (!container) return;
      const slots = this.settings.timeSlots || [];

      if (slots.length === 0) {
        container.innerHTML = '<p class="text-sm text-slate-400 italic">ยังไม่มีรอบเวลาที่เปิดรับ กรุณากดเพิ่มรอบเวลาด้านล่างค่ะ</p>';
        return;
      }

      container.innerHTML = slots.map((s, idx) => {
        return `
          <div class="admin-slot-pill">
            <span class="slot-pill-clock"><i class="fa-solid fa-clock text-purple-600"></i> ${s.label}</span>
            <button type="button" class="slot-pill-delete" title="ลบรอบเวลานี้" onclick="window.BookingApp.adminRemoveSlot(${idx})">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        `;
      }).join('');
    },

    adminAddNewSlot: function () {
      const startInput = document.getElementById('adminNewSlotStart');
      const endInput = document.getElementById('adminNewSlotEnd');

      const start = startInput ? startInput.value : '';
      const end = endInput ? endInput.value : '';

      if (!start || !end) {
        alert('กรุณาระบุเวลาเริ่มต้นและเวลาสิ้นสุดค่ะ');
        return;
      }

      if (start >= end) {
        alert('เวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุดค่ะ');
        return;
      }

      const label = `${start} - ${end} น.`;
      const slots = [...(this.settings.timeSlots || DEFAULT_SETTINGS.timeSlots)];

      if (slots.some(s => s.start === start)) {
        alert('มีรอบเวลาที่เริ่มต้นในเวลานี้อยู่แล้วค่ะ');
        return;
      }

      slots.push({ start, end, label });
      slots.sort((a, b) => a.start.localeCompare(b.start));
      this.applyAndSaveSettings({ timeSlots: slots });
      this.populateAdminScheduleSettings();
    },

    adminRemoveSlot: function (index) {
      const slots = [...(this.settings.timeSlots || DEFAULT_SETTINGS.timeSlots)];
      if (slots.length <= 1) {
        alert('ต้องมีรอบเวลาอย่างน้อย 1 รอบค่ะ');
        return;
      }
      slots.splice(index, 1);
      this.applyAndSaveSettings({ timeSlots: slots });
      this.populateAdminScheduleSettings();
    },

    adminApplyPresetSlots: function (preset) {
      let slots = [];
      let minGap = this.settings.minGapMinutes || 120;

      if (preset === 'default_afternoon') {
        slots = [
          { start: '14:00', end: '16:00', label: '14:00 - 16:00 น.' },
          { start: '16:00', end: '18:00', label: '16:00 - 18:00 น.' },
          { start: '18:00', end: '20:00', label: '18:00 - 20:00 น.' },
          { start: '20:00', end: '22:00', label: '20:00 - 22:00 น.' }
        ];
        minGap = 120;
      } else if (preset === 'full_day') {
        slots = [
          { start: '10:00', end: '12:00', label: '10:00 - 12:00 น.' },
          { start: '13:00', end: '15:00', label: '13:00 - 15:00 น.' },
          { start: '15:00', end: '17:00', label: '15:00 - 17:00 น.' },
          { start: '18:00', end: '20:00', label: '18:00 - 20:00 น.' }
        ];
        minGap = 120;
      } else if (preset === 'one_hour_afternoon') {
        slots = [
          { start: '14:00', end: '15:00', label: '14:00 - 15:00 น.' },
          { start: '15:00', end: '16:00', label: '15:00 - 16:00 น.' },
          { start: '16:00', end: '17:00', label: '16:00 - 17:00 น.' },
          { start: '17:00', end: '18:00', label: '17:00 - 18:00 น.' },
          { start: '18:00', end: '19:00', label: '18:00 - 19:00 น.' },
          { start: '19:00', end: '20:00', label: '19:00 - 20:00 น.' }
        ];
        minGap = 60;
      }

      this.applyAndSaveSettings({ timeSlots: slots, minGapMinutes: minGap });
      this.populateAdminScheduleSettings();
    },

    renderAdminBlockedDatesEditor: function () {
      const container = document.getElementById('adminSettingBlockedContainer');
      if (!container) return;
      const blocked = this.settings.blockedDates || [];

      if (blocked.length === 0) {
        container.innerHTML = '<p class="text-sm text-slate-400 italic">ยังไม่มีวันหยุดพิเศษที่ระบุไว้</p>';
        return;
      }

      container.innerHTML = blocked.map((b, idx) => {
        const parts = (b.date || '').split('-');
        const dateObj = parts.length === 3 ? new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])) : new Date(b.date);
        const thaiDate = dateObj.toLocaleDateString('th-TH', {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
        return `
          <div class="admin-blocked-date-tag">
            <div class="blocked-tag-info">
              <span class="blocked-date-text"><i class="fa-solid fa-calendar-xmark text-rose-500"></i> ${thaiDate}</span>
              ${b.reason ? `<span class="blocked-reason-text">(${b.reason})</span>` : ''}
            </div>
            <button type="button" class="slot-pill-delete" title="ลบวันหยุดนี้ (เปิดรับคิวใหม่)" onclick="window.BookingApp.adminRemoveBlockedDate(${idx})">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        `;
      }).join('');
    },

    adminAddBlockedDate: function () {
      const dateInput = document.getElementById('adminNewBlockedDate');
      const reasonInput = document.getElementById('adminNewBlockedReason');

      const date = dateInput ? dateInput.value : '';
      const reason = reasonInput ? reasonInput.value.trim() : '';

      if (!date) {
        alert('กรุณาเลือกวันที่ต้องการงดรับคิวค่ะ');
        return;
      }

      const blocked = [...(this.settings.blockedDates || [])];
      if (blocked.some(b => b.date === date)) {
        alert('วันที่นี้อยู่ในรายการงดรับคิวอยู่แล้วค่ะ');
        return;
      }

      blocked.push({ date, reason });
      blocked.sort((a, b) => a.date.localeCompare(b.date));

      if (dateInput) dateInput.value = '';
      if (reasonInput) reasonInput.value = '';

      this.applyAndSaveSettings({ blockedDates: blocked });
      this.populateAdminScheduleSettings();
    },

    adminRemoveBlockedDate: function (index) {
      const blocked = [...(this.settings.blockedDates || [])];
      blocked.splice(index, 1);
      this.applyAndSaveSettings({ blockedDates: blocked });
      this.populateAdminScheduleSettings();
    },

    adminSaveScheduleSettings: async function () {
      const statusCheckbox = document.getElementById('adminSettingIsOpen');
      const noticeInput = document.getElementById('adminSettingClosedNotice');
      const gapSelect = document.getElementById('adminSettingMinGap');

      const isOpen = statusCheckbox ? statusCheckbox.checked : this.settings.isOpen;
      const closedNotice = noticeInput ? noticeInput.value.trim() : this.settings.closedNotice;
      const minGapMinutes = gapSelect ? Number(gapSelect.value) || 120 : (this.settings.minGapMinutes || 120);

      const saveBtn = document.getElementById('adminSaveSettingsBtn');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังบันทึกการตั้งค่า...';
      }

      await this.applyAndSaveSettings({ isOpen, closedNotice, minGapMinutes });

      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fa-solid fa-circle-check text-emerald-300"></i> บันทึก & อัปเดตหน้าลูกค้าเรียบร้อย!';
        setTimeout(() => {
          saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> บันทึกการตั้งค่าทั้งหมด';
        }, 2500);
      }

      alert('💾 บันทึกการตั้งค่าวันและเวลาเปิดรับดูดวงเรียบร้อยแล้วค่ะ!\nระบบได้อัปเดตหน้าจองคิวของลูกค้าให้เป็นไปตามการตั้งค่าใหม่นี้ทันทีค่ะ ✨');
      this.populateAdminScheduleSettings();
    },

    adminResetScheduleSettings: function () {
      const confirmReset = confirm('ต้องการคืนค่าเริ่มต้นทั้งหมดใช่หรือไม่?\n\n- เปิดรับเฉพาะ วันเสาร์ และ วันอาทิตย์\n- เวลา 14:00 - 22:00 น. (รอบละ 2 ชม.)\n- ระยะห่างระหว่างคิว 2 ชม.');
      if (!confirmReset) return;

      this.applyAndSaveSettings(JSON.parse(JSON.stringify(DEFAULT_SETTINGS)));
      this.populateAdminScheduleSettings();
      alert('🔄 คืนค่าเริ่มต้นเรียบร้อยแล้วค่ะ');
    },

    // ------------------------------------------------------------------------
    // ADMIN BOOKING MANAGEMENT: "ลูกค้าจองดูดวง"
    // ------------------------------------------------------------------------
    setAdminFilter: function (filter) {
      this.adminFilter = filter;
      this.renderAdminBookingsList();
    },

    renderAdminBookingsList: function () {
      const listContainer = document.getElementById('adminBookingsListContainer');
      const statsTotal = document.getElementById('adminStatsTotal');
      const statsPending = document.getElementById('adminStatsPending');
      const statsConfirmed = document.getElementById('adminStatsConfirmed');
      const statsCancelled = document.getElementById('adminStatsCancelled');

      if (!listContainer) return;

      const total = this.bookings.length;
      const pending = this.bookings.filter(b => b.status === 'pending').length;
      const confirmed = this.bookings.filter(b => b.status === 'confirmed').length;
      const cancelled = this.bookings.filter(b => b.status === 'cancelled').length;

      if (statsTotal) statsTotal.textContent = String(total);
      if (statsPending) statsPending.textContent = String(pending);
      if (statsConfirmed) statsConfirmed.textContent = String(confirmed);
      if (statsCancelled) statsCancelled.textContent = String(cancelled);

      let filtered = [...this.bookings];
      if (this.adminFilter !== 'all') {
        filtered = filtered.filter(b => b.status === this.adminFilter);
      }

      const filterBtns = document.querySelectorAll('.admin-filter-btn');
      filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === this.adminFilter);
      });

      if (filtered.length === 0) {
        listContainer.innerHTML = `
          <div class="admin-empty-bookings">
            <i class="fa-solid fa-calendar-xmark text-4xl text-slate-300 mb-3 block"></i>
            <p>ไม่พบรายการจองคิวในหมวดหมู่นี้</p>
          </div>
        `;
        return;
      }

      listContainer.innerHTML = filtered.map(b => {
        const isPending = b.status === 'pending';
        const isConfirmed = b.status === 'confirmed';
        const isCancelled = b.status === 'cancelled';

        const statusBadge = isPending
          ? '<span class="status-pill pill-pending"><i class="fa-solid fa-hourglass-half"></i> รอตอบรับ</span>'
          : isConfirmed
          ? '<span class="status-pill pill-confirmed"><i class="fa-solid fa-circle-check"></i> ตอบรับแล้ว</span>'
          : '<span class="status-pill pill-cancelled"><i class="fa-solid fa-circle-xmark"></i> ยกเลิก</span>';

        return `
          <div class="admin-booking-card ${b.status}">
            <div class="card-top-bar">
              <div class="booking-ref-wrap">
                <span class="ref-badge">${b.ref}</span>
                <span class="service-tag">${b.service || 'ดูดวง'}</span>
              </div>
              <div class="booking-status-box">
                ${statusBadge}
                <span class="card-created-time">${b.createdFormatted || ''}</span>
              </div>
            </div>

            <div class="card-main-grid">
              <div class="customer-info-box">
                <h4 class="customer-name"><i class="fa-solid fa-circle-user text-purple-600"></i> คุณ ${b.name}</h4>
                <div class="customer-contact-items">
                  <a href="tel:${b.phone}" class="contact-link"><i class="fa-solid fa-phone text-emerald-600"></i> ${b.phone}</a>
                  <a href="mailto:${b.email}" class="contact-link"><i class="fa-solid fa-envelope text-blue-600"></i> ${b.email}</a>
                  ${b.lineId ? `<span class="contact-line"><i class="fa-brands fa-line text-green-500"></i> LINE: <strong>${b.lineId}</strong></span>` : ''}
                </div>
              </div>

              <div class="booking-datetime-box">
                <div class="datetime-highlight">
                  <i class="fa-solid fa-calendar-star text-amber-500"></i>
                  <div>
                    <div class="date-text">${b.dateLabel || b.date}</div>
                    <div class="time-text">${b.timeRange || b.time}</div>
                  </div>
                </div>
                ${b.topic ? `
                  <div class="customer-topic-note">
                    <span class="topic-label"><i class="fa-solid fa-comment-dots"></i> เรื่องที่ปรึกษา:</span>
                    <p class="topic-body">${b.topic}</p>
                  </div>
                ` : ''}
              </div>
            </div>

            <div class="card-actions-bar">
              ${isPending ? `
                <button type="button" class="btn-admin-action btn-confirm" onclick="window.BookingApp.adminConfirmBooking('${b.id || b.ref}')">
                  <i class="fa-solid fa-circle-check"></i> กดตอบรับ (ส่งอีเมลยืนยันให้ลูกค้า)
                </button>
              ` : isConfirmed ? `
                <button type="button" class="btn-admin-action btn-reemail" onclick="window.BookingApp.adminSendCustomerEmail('${b.id || b.ref}')">
                  <i class="fa-solid fa-envelope"></i> ส่งอีเมลแจ้งเตือนซ้ำ
                </button>
              ` : ''}

              ${!isCancelled ? `
                <button type="button" class="btn-admin-action btn-cancel" onclick="window.BookingApp.adminCancelBooking('${b.id || b.ref}')">
                  <i class="fa-solid fa-ban"></i> ยกเลิกคิว (เปิดช่วงเวลาว่าง)
                </button>
              ` : `
                <button type="button" class="btn-admin-action btn-restore" onclick="window.BookingApp.adminRestoreBooking('${b.id || b.ref}')">
                  <i class="fa-solid fa-rotate-left"></i> นำกลับมาเป็นรอตอบรับ
                </button>
              `}
            </div>
          </div>
        `;
      }).join('');
    },

    adminConfirmBooking: async function (bookingId) {
      const b = this.bookings.find(item => item.id === bookingId || item.ref === bookingId);
      if (!b) return;

      const confirmAction = confirm(`ยืนยันการตอบรับคิวของคุณ ${b.name} ในวัน ${b.dateLabel} เวลา ${b.timeRange} ?\n\nระบบจะส่งอีเมลยืนยันวันและเวลาไปยัง ${b.email} โดยอัตโนมัติค่ะ`);
      if (!confirmAction) return;

      b.status = 'confirmed';
      b.confirmedAt = new Date().toISOString();
      b.confirmedFormatted = new Date().toLocaleDateString('th-TH') + ' ' + new Date().toLocaleTimeString('th-TH');

      await this.persistBookingRecord(b);

      const emailSent = await this.sendConfirmationEmailToCustomer(b);

      alert(`✅ ตอบรับคิวดูดวงของคุณ ${b.name} สำเร็จแล้ว!\n${emailSent ? 'ระบบส่งอีเมลยืนยันไปยัง ' + b.email + ' เรียบร้อยค่ะ' : 'ส่งคำขอยืนยันไปยังอีเมลลูกค้าเรียบร้อยค่ะ'}`);

      this.renderAdminBookingsList();
      this.updateAdminBadge();
    },

    adminSendCustomerEmail: async function (bookingId) {
      const b = this.bookings.find(item => item.id === bookingId || item.ref === bookingId);
      if (!b) return;
      const ok = await this.sendConfirmationEmailToCustomer(b);
      alert(ok ? `ส่งอีเมลยืนยันซ้ำไปยัง ${b.email} เรียบร้อยแล้วค่ะ` : 'ระบบได้ส่งคำขอส่งเมลเรียบร้อยแล้วค่ะ');
    },

    adminCancelBooking: async function (bookingId) {
      const b = this.bookings.find(item => item.id === bookingId || item.ref === bookingId);
      if (!b) return;

      const confirmCancel = confirm(`ต้องการยกเลิกคิวของคุณ ${b.name} ใช่หรือไม่?\n\nการยกเลิกจะทำให้ช่วงเวลา (${b.timeRange}) ในวันดังกล่าวกลับมาเป็น "ว่าง" เพื่อให้ลูกค้ารายอื่นสามารถจองได้ค่ะ`);
      if (!confirmCancel) return;

      b.status = 'cancelled';
      b.cancelledAt = new Date().toISOString();
      await this.persistBookingRecord(b);

      alert(`ยกเลิกคิวของคุณ ${b.name} เรียบร้อยแล้วค่ะ (ช่วงเวลานี้กลับมาว่างแล้ว)`);
      this.renderAdminBookingsList();
      this.renderAvailableDates();
      this.renderTimeSlots();
      this.updateAdminBadge();
    },

    adminRestoreBooking: async function (bookingId) {
      const b = this.bookings.find(item => item.id === bookingId || item.ref === bookingId);
      if (!b) return;

      const check = this.checkSlotAvailability(b.date, b.time);
      if (!check.available) {
        alert('ไม่สามารถนำกลับมาได้เนื่องจาก: ' + check.reason);
        return;
      }

      b.status = 'pending';
      await this.persistBookingRecord(b);
      alert(`นำคิวของคุณ ${b.name} กลับมาอยู่ในสถานะ "รอตอบรับ" เรียบร้อยค่ะ`);
      this.renderAdminBookingsList();
      this.renderAvailableDates();
      this.renderTimeSlots();
      this.updateAdminBadge();
    },

    // ------------------------------------------------------------------------
    // EVENT LISTENERS BINDING
    // ------------------------------------------------------------------------
    bindEvents: function () {
      const customerForm = document.getElementById('bookingCustomerForm');
      if (customerForm) {
        customerForm.addEventListener('submit', (e) => this.handleCustomerFormSubmit(e));
      }

      const modalCloseBtn = document.getElementById('bookingSuccessCloseBtn');
      if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => this.closeCustomerSuccessModal());
      }

      // Min Gap selector live change
      const gapSelect = document.getElementById('adminSettingMinGap');
      if (gapSelect) {
        gapSelect.addEventListener('change', () => {
          this.applyAndSaveSettings({ minGapMinutes: Number(gapSelect.value) || 120 });
        });
      }

      // Closed Notice blur live change
      const noticeInput = document.getElementById('adminSettingClosedNotice');
      if (noticeInput) {
        noticeInput.addEventListener('blur', () => {
          this.applyAndSaveSettings({ closedNotice: noticeInput.value.trim() });
        });
      }

      // Multi-tab broadcast synchronization
      window.addEventListener('storage', (e) => {
        if (e.key === SETTINGS_STORAGE_KEY && e.newValue) {
          try {
            this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(e.newValue) };
            this.tempDraftSettings = JSON.parse(JSON.stringify(this.settings));
            this.onSettingsUpdated();
          } catch (err) {}
        }
      });
    }
  };

  window.BookingApp = BookingApp;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BookingApp.init());
  } else {
    BookingApp.init();
  }

})();
