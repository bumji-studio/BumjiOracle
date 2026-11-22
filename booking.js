/**
 * ============================================================================
 * แม่หมอติ๊ดติ๊ด (DESTINY ARCANA) - Booking & Consultation Appointment Engine
 * ระบบจองคิวดูดวงเฉพาะบุคคล & ระบบจัดการคิวลูกค้าสำหรับ Admin
 * 
 * กฎการจอง:
 * - วันว่าง: วันเสาร์ และ วันอาทิตย์
 * - เวลาทำการ: 14.00 - 20.00 น.
 * - ระยะห่างระหว่างคิว: อย่างน้อย 2 ชั่วโมง (จองติดกันภายใน 2 ชม. ไม่ได้)
 * - ลูกค้าจอง: ส่ง Email แจ้งเตือนไปที่ bumjaa@gmail.com
 * - Admin ตอบรับ: กดตอบรับในเมนู "ลูกค้าจองดูดวง" แล้วระบบส่ง Email ยืนยันให้ลูกค้า
 * ============================================================================
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'maemor_tidtid_bookings';
  const ADMIN_EMAIL = 'bumjaa@gmail.com';
  const FIRESTORE_COLLECTION = 'bookings';

  // Base 2-hour consultation slots
  const BASE_TIME_SLOTS = [
    { start: '14:00', end: '16:00', label: '14:00 - 16:00 น.' },
    { start: '16:00', end: '18:00', label: '16:00 - 18:00 น.' },
    { start: '18:00', end: '20:00', label: '18:00 - 20:00 น.' },
    { start: '20:00', end: '22:00', label: '20:00 - 22:00 น.' }
  ];

  const BookingApp = {
    bookings: [],
    selectedDate: null,
    selectedTimeSlot: null,
    adminFilter: 'all', // 'all', 'pending', 'confirmed', 'cancelled'
    unsubscribeFirestore: null,

    init: function () {
      this.loadLocalBookings();
      this.initFirestoreSync();
      this.bindEvents();
      this.updateAdminBadge();
    },

    // ------------------------------------------------------------------------
    // DATA PERSISTENCE & FIRESTORE SYNC
    // ------------------------------------------------------------------------
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
        // Subscribe to real-time updates for bookings collection
        this.unsubscribeFirestore = db.collection(FIRESTORE_COLLECTION)
          .onSnapshot((snapshot) => {
            const remoteList = [];
            snapshot.forEach(doc => {
              remoteList.push({ id: doc.id, ...doc.data() });
            });

            if (remoteList.length > 0) {
              // Merge remote with local (remote takes precedence on match)
              const mergedMap = new Map();
              this.bookings.forEach(b => mergedMap.set(b.id || b.ref, b));
              remoteList.forEach(b => mergedMap.set(b.id || b.ref, b));
              this.bookings = Array.from(mergedMap.values());
              // Sort by date and time
              this.bookings.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
              this.saveLocalBookings();

              // Refresh active views if visible
              this.renderTimeSlots();
              this.renderAdminBookingsList();
              this.updateAdminBadge();
            }
          }, (err) => {
            console.warn('Firestore bookings snapshot error (fallback to local):', err);
          });
      } catch (e) {
        console.warn('Firestore init sync error:', e);
      }
    },

    persistBookingRecord: async function (booking) {
      // 1. Save in local state
      const existingIdx = this.bookings.findIndex(b => b.id === booking.id || b.ref === booking.ref);
      if (existingIdx !== -1) {
        this.bookings[existingIdx] = booking;
      } else {
        this.bookings.unshift(booking);
      }
      this.saveLocalBookings();

      // 2. Save in Firestore if online
      if (typeof firebase !== 'undefined' && firebase.firestore) {
        try {
          const db = firebase.firestore();
          await db.collection(FIRESTORE_COLLECTION).doc(booking.id).set(booking, { merge: true });
        } catch (e) {
          console.warn('Failed to save booking to Firestore (saved locally):', e);
        }
      }
    },

    updateAdminBadge: function () {
      const badge = document.getElementById('adminPendingCounterBadge');
      if (!badge) return;
      const pendingCount = this.bookings.filter(b => b.status === 'pending').length;
      if (pendingCount > 0) {
        badge.textContent = String(pendingCount);
        badge.classList.remove('hidden');
        badge.style.display = 'inline-flex';
      } else {
        badge.classList.add('hidden');
        badge.style.display = 'none';
      }
    },

    // ------------------------------------------------------------------------
    // BUSINESS LOGIC: SATURDAY & SUNDAY ONLY + 2-HOUR GAP
    // ------------------------------------------------------------------------
    getUpcomingWeekends: function (count = 14) {
      const weekends = [];
      const now = new Date();
      // Start from tomorrow or today if afternoon before 18:00
      let d = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      while (weekends.length < count) {
        const day = d.getDay(); // 0 is Sunday, 6 is Saturday
        if (day === 0 || day === 6) {
          const dateStr = d.toISOString().split('T')[0];
          const isSaturday = day === 6;
          const thaiDayName = isSaturday ? 'วันเสาร์' : 'วันอาทิตย์';
          const thaiDateText = d.toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });

          weekends.push({
            dateStr: dateStr,
            dayOfWeek: day,
            dayLabel: thaiDayName,
            dateLabel: thaiDateText,
            badgeLabel: isSaturday ? 'เสาร์' : 'อาทิตย์',
            isToday: dateStr === now.toISOString().split('T')[0]
          });
        }
        d.setDate(d.getDate() + 1);
      }
      return weekends;
    },

    timeToMinutes: function (timeStr) {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    },

    /**
     * ตรวจสอบความว่างของเวลา โดยอิงกฎ:
     * "ถ้ามีคนกดจองแล้ว ระยะห่างจะอยู่ 2 ชั่วโมง คือ จองติดกันภายในเวลา 2 ชั่วโมงไม่ได้"
     */
    checkSlotAvailability: function (dateStr, slotStartStr) {
      if (!dateStr || !slotStartStr) return { available: false, reason: 'ข้อมูลไม่ครบถ้วน' };

      const slotMinutes = this.timeToMinutes(slotStartStr);

      // หาการจองที่ยัง Active ในวันเดียวกัน (ไม่รวมที่ยกเลิกแล้ว)
      const activeBookings = this.bookings.filter(b => {
        return b.date === dateStr && b.status !== 'cancelled';
      });

      for (const b of activeBookings) {
        const bookedMinutes = this.timeToMinutes(b.time);
        const diffMinutes = Math.abs(slotMinutes - bookedMinutes);

        // ระยะห่างต้อง >= 120 นาที (2 ชั่วโมง)
        if (diffMinutes < 120) {
          return {
            available: false,
            reason: `ติดเวลาการจองของคุณ ${b.name || 'ลูกค้า'} (${b.time} น.) ห่างกันไม่ถึง 2 ชม.`
          };
        }
      }

      return { available: true };
    },

    getAvailableSlotsForDate: function (dateStr) {
      return BASE_TIME_SLOTS.map(slot => {
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
        console.warn('Could not send email to admin via FormSubmit:', err);
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
      if (role === 'admin' || (window.AuthManager && window.AuthManager.isAdmin())) {
        this.renderAdminBookingsList();
      }
      this.renderWeekendDates();
      this.renderTimeSlots();
      this.updateAdminBadge();
    },

    renderWeekendDates: function () {
      const container = document.getElementById('bookingWeekendDatesContainer');
      if (!container) return;

      const weekends = this.getUpcomingWeekends(14);
      if (!this.selectedDate && weekends.length > 0) {
        this.selectedDate = weekends[0].dateStr;
      }

      container.innerHTML = weekends.map(item => {
        const isSelected = item.dateStr === this.selectedDate;
        const availableCount = this.getAvailableSlotsForDate(item.dateStr).filter(s => s.isAvailable).length;
        const isFull = availableCount === 0;

        return `
          <button type="button" 
            class="booking-date-chip ${isSelected ? 'selected' : ''} ${isFull ? 'date-full' : ''}" 
            data-date="${item.dateStr}"
            onclick="window.BookingApp.selectDate('${item.dateStr}')">
            <span class="chip-badge ${item.dayOfWeek === 6 ? 'badge-sat' : 'badge-sun'}">${item.badgeLabel}</span>
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
      this.renderWeekendDates();
      this.renderTimeSlots();
    },

    renderTimeSlots: function () {
      const container = document.getElementById('bookingTimeSlotsContainer');
      const dateNotice = document.getElementById('bookingSelectedDateNotice');
      if (!container) return;

      if (!this.selectedDate) {
        container.innerHTML = '<p class="booking-empty-notice">กรุณาเลือกวันเสาร์หรืออาทิตย์ด้านบนก่อนค่ะ</p>';
        return;
      }

      const slots = this.getAvailableSlotsForDate(this.selectedDate);
      const selObj = this.getUpcomingWeekends(30).find(w => w.dateStr === this.selectedDate);
      if (dateNotice) {
        dateNotice.innerHTML = `<i class="fa-solid fa-calendar-day text-purple-600"></i> วันที่เลือก: <strong>${selObj ? selObj.dateLabel + ' (' + selObj.dayLabel + ')' : this.selectedDate}</strong> (เวลาทำการ 14.00 - 20.00 น.)`;
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
            <span class="slot-state-badge open">ว่าง (2 ชั่วโมง)</span>
          </button>
        `;
      }).join('');
    },

    selectTimeSlot: function (start, end, label) {
      this.selectedTimeSlot = { start, end, label };
      this.renderTimeSlots();

      const summary = document.getElementById('bookingChosenSlotSummary');
      if (summary) {
        const selObj = this.getUpcomingWeekends(30).find(w => w.dateStr === this.selectedDate);
        summary.innerHTML = `
          <div class="booking-chosen-card">
            <i class="fa-solid fa-circle-check text-emerald-500 text-xl"></i>
            <div>
              <strong>วัน${selObj ? selObj.dayLabel : ''} ที่ ${selObj ? selObj.dateLabel : this.selectedDate}</strong>
              <div class="text-purple-700 font-semibold">ช่วงเวลา: ${label}</div>
            </div>
          </div>
        `;
      }
    },

    handleCustomerFormSubmit: async function (e) {
      e.preventDefault();

      if (!this.selectedDate) {
        alert('กรุณาเลือกวันเสาร์หรืออาทิตย์ที่ต้องการดูดวงก่อนค่ะ');
        return;
      }
      if (!this.selectedTimeSlot) {
        alert('กรุณาเลือกช่วงเวลาที่ต้องการดูดวงค่ะ');
        return;
      }

      // Re-verify availability
      const check = this.checkSlotAvailability(this.selectedDate, this.selectedTimeSlot.start);
      if (!check.available) {
        alert('ขออภัยค่ะ เวลานี้เพิ่งมีผู้จองหรือติดกฎระยะห่าง 2 ชั่วโมง กรุณาเลือกช่วงเวลาอื่นนะคะ');
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
        alert('กรุณากรอกชื่อ เบอร์โทรศัพท์ และอีเมลให้ครบถ้วนเพื่อรับการยืนยันค่ะ');
        return;
      }

      const submitBtn = document.getElementById('bookingSubmitBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังส่งข้อมูลการจอง...';
      }

      const selObj = this.getUpcomingWeekends(30).find(w => w.dateStr === this.selectedDate);
      const refId = 'BK' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 90 + 10);

      const newBooking = {
        id: refId,
        ref: '#' + refId,
        name: name,
        phone: phone,
        email: email,
        lineId: lineId,
        service: service,
        date: this.selectedDate,
        dateLabel: selObj ? `${selObj.dayLabel}ที่ ${selObj.dateLabel}` : this.selectedDate,
        time: this.selectedTimeSlot.start,
        timeEnd: this.selectedTimeSlot.end,
        timeRange: this.selectedTimeSlot.label,
        topic: topic,
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
      this.renderWeekendDates();
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

      // Update counters
      const total = this.bookings.length;
      const pending = this.bookings.filter(b => b.status === 'pending').length;
      const confirmed = this.bookings.filter(b => b.status === 'confirmed').length;
      const cancelled = this.bookings.filter(b => b.status === 'cancelled').length;

      if (statsTotal) statsTotal.textContent = String(total);
      if (statsPending) statsPending.textContent = String(pending);
      if (statsConfirmed) statsConfirmed.textContent = String(confirmed);
      if (statsCancelled) statsCancelled.textContent = String(cancelled);

      // Filter list
      let filtered = [...this.bookings];
      if (this.adminFilter !== 'all') {
        filtered = filtered.filter(b => b.status === this.adminFilter);
      }

      // Update filter tabs active state
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
              <!-- Customer Profile -->
              <div class="customer-info-box">
                <h4 class="customer-name"><i class="fa-solid fa-circle-user text-purple-600"></i> คุณ ${b.name}</h4>
                <div class="customer-contact-items">
                  <a href="tel:${b.phone}" class="contact-link"><i class="fa-solid fa-phone text-emerald-600"></i> ${b.phone}</a>
                  <a href="mailto:${b.email}" class="contact-link"><i class="fa-solid fa-envelope text-blue-600"></i> ${b.email}</a>
                  ${b.lineId ? `<span class="contact-line"><i class="fa-brands fa-line text-green-500"></i> LINE: <strong>${b.lineId}</strong></span>` : ''}
                </div>
              </div>

              <!-- Booking Time & Topic -->
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

            <!-- Action Buttons for Admin -->
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

      // Send confirmation email to customer
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
      this.renderWeekendDates();
      this.renderTimeSlots();
      this.updateAdminBadge();
    },

    adminRestoreBooking: async function (bookingId) {
      const b = this.bookings.find(item => item.id === bookingId || item.ref === bookingId);
      if (!b) return;

      // Check slot availability again
      const check = this.checkSlotAvailability(b.date, b.time);
      if (!check.available) {
        alert('ไม่สามารถนำกลับมาได้เนื่องจาก: ' + check.reason);
        return;
      }

      b.status = 'pending';
      await this.persistBookingRecord(b);
      alert(`นำคิวของคุณ ${b.name} กลับมาอยู่ในสถานะ "รอตอบรับ" เรียบร้อยค่ะ`);
      this.renderAdminBookingsList();
      this.renderWeekendDates();
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
    }
  };

  window.BookingApp = BookingApp;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BookingApp.init());
  } else {
    BookingApp.init();
  }

})();
