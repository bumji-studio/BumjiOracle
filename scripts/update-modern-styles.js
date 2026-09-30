import fs from 'fs';
import path from 'path';

const cssPath = path.resolve('styles.css');
const content = fs.readFileSync(cssPath, 'utf8');

// Replace #readingAppView base styling around line 889
let updated = content.replace(
`#readingAppView {
  background: var(--bg-app);
  overflow-y: auto;
  padding: 24px;
  box-sizing: border-box;
}`,
`#readingAppView {
  background: radial-gradient(circle at 10% 15%, rgba(99, 102, 241, 0.18) 0%, transparent 40%),
              radial-gradient(circle at 90% 20%, rgba(245, 158, 11, 0.15) 0%, transparent 45%),
              radial-gradient(circle at 50% 85%, rgba(244, 63, 94, 0.14) 0%, transparent 50%),
              #070a13;
  color: #f1f5f9;
  overflow-y: auto;
  padding: 30px 24px;
  box-sizing: border-box;
}`
);

// Update Header to modern dark glass
updated = updated.replace(
`.app-header {
  background: linear-gradient(135deg, #ffffff 0%, #f7f2ea 100%);
  border-bottom: 2px solid var(--color-gold);`,
`.app-header {
  background: rgba(11, 15, 25, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;`
);

// Also make header logo text and subtitle look modern
updated = updated.replace(
`.header-logo h1 {
  font-family: var(--font-en);
  font-size: 22px;
  letter-spacing: 2px;
  color: var(--color-gold-dark);
  margin-bottom: 2px;
}`,
`.header-logo h1 {
  font-family: 'Cinzel', serif;
  font-size: 22px;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #fde68a 0%, #f59e0b 50%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2px;
}`
);

// Split at FORTUNE TELLING APP to replace the entire 4-step CSS with ultra-modern design
const splitMarker = '/* ==========================================================================\n   FORTUNE TELLING APP - 4-STEP DIVINATION DESIGN SYSTEM';
const markerIndex = updated.indexOf(splitMarker);

let basePart = updated;
if (markerIndex !== -1) {
  basePart = updated.substring(0, markerIndex);
}

const modernStyles = `/* ==========================================================================
   FORTUNE TELLING APP - ULTRA-MODERN COSMIC GLASS DESIGN SYSTEM
   Collections: JiuTian Arcana (Chinese Deities) & Bumji & The Gang (Cute Cats)
   ========================================================================== */

:root {
  --cosmic-bg: #070a13;
  --cosmic-surface: rgba(15, 23, 42, 0.72);
  --cosmic-surface-hover: rgba(30, 41, 59, 0.85);
  --cosmic-border: rgba(255, 255, 255, 0.1);
  --cosmic-border-glow: rgba(245, 158, 11, 0.45);
  --cosmic-gold: #f59e0b;
  --cosmic-gold-light: #fde68a;
  --cosmic-rose: #f43f5e;
  --cosmic-violet: #8b5cf6;
  --cosmic-text: #f8fafc;
  --cosmic-text-muted: #94a3b8;
  --font-modern-thai: 'Prompt', 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Standalone Status Badge in Header */
.standalone-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(52, 211, 153, 0.3);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

/* MODERN STEPPER PROGRESS BAR */
.reading-stepper {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 860px;
  margin: 0 auto 32px auto;
  padding: 12px 24px;
}

.stepper-track {
  position: absolute;
  top: 50%;
  left: 60px;
  right: 60px;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-50%);
  z-index: 1;
  border-radius: 4px;
}

.stepper-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #f59e0b, #ec4899);
  border-radius: 4px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 14px rgba(245, 158, 11, 0.6);
}

.stepper-step {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  background: transparent;
}

.step-num {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.85);
  border: 2px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--cosmic-text-muted);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-label {
  font-family: var(--font-modern-thai);
  font-size: 13px;
  font-weight: 500;
  color: var(--cosmic-text-muted);
  white-space: nowrap;
  transition: all 0.3s ease;
}

.stepper-step.active .step-num {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #000000;
  border-color: #fde68a;
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.7);
  transform: scale(1.15);
}

.stepper-step.active .step-label {
  color: #fde68a;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
}

.stepper-step.completed .step-num {
  background: #10b981;
  color: #ffffff;
  border-color: #34d399;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
}

.stepper-step.completed .step-label {
  color: #34d399;
}

/* PINNED CONTEXT BAR */
.pinned-context-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(245, 158, 11, 0.25);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  padding: 14px 24px;
  max-width: 980px;
  margin: 0 auto 28px auto;
  animation: fadeIn 0.3s ease;
}

.context-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-gold {
  color: #fbbf24;
  font-size: 20px;
}

.context-text {
  display: flex;
  flex-direction: column;
}

.context-label {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.context-val {
  font-family: var(--font-modern-thai);
  font-size: 15px;
  color: #f8fafc;
  max-width: 480px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* MODERN STEP CARD CONTAINER */
.reading-step-card {
  max-width: 1080px;
  margin: 0 auto;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px 36px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* ============================================================
   STEP 1: QUESTION INPUT (MODERN COSMIC)
   ============================================================ */
.step1-hero {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 32px auto;
}

.sparkle-orbit {
  width: 70px;
  height: 70px;
  margin: 0 auto 18px auto;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(99, 102, 241, 0.15) 100%);
  border: 1px solid rgba(245, 158, 11, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 24px rgba(245, 158, 11, 0.3);
  position: relative;
  animation: orbitPulse 3s infinite ease-in-out;
}

@keyframes orbitPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 24px rgba(245, 158, 11, 0.3); }
  50% { transform: scale(1.08); box-shadow: 0 0 36px rgba(245, 158, 11, 0.5); }
}

.step1-main-icon {
  font-size: 30px;
  color: #fde68a;
}

.step1-title {
  font-family: var(--font-modern-thai);
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #fde68a 50%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.step1-desc {
  font-size: 15px;
  line-height: 1.7;
  color: #94a3b8;
}

.question-input-box-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.question-textarea-container {
  position: relative;
  background: rgba(2, 6, 23, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 18px 22px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.4);
}

.question-textarea-container:focus-within {
  border-color: #f59e0b;
  background: rgba(2, 6, 23, 0.85);
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.2), 0 0 25px rgba(245, 158, 11, 0.25);
}

.question-textarea {
  width: 100%;
  border: none;
  background: transparent;
  font-family: var(--font-modern-thai);
  font-size: 16px;
  line-height: 1.6;
  color: #f8fafc;
  resize: vertical;
  min-height: 84px;
  outline: none;
}

.question-textarea::placeholder {
  color: #64748b;
  font-family: var(--font-modern-thai);
}

.textarea-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn-clear-text {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.btn-clear-text:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  border-color: rgba(239, 68, 68, 0.4);
}

/* Suggestion Chips */
.suggestion-chips-area {
  margin-top: 24px;
}

.chips-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #fde68a;
  margin-bottom: 12px;
}

.chips-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip-btn {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 9px 18px;
  border-radius: 20px;
  font-family: var(--font-modern-thai);
  font-size: 13px;
  color: #cbd5e1;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(8px);
}

.chip-btn i {
  color: #f59e0b;
}

.chip-btn:hover {
  background: rgba(30, 41, 59, 0.9);
  border-color: #f59e0b;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(245, 158, 11, 0.25);
}

.step1-action-row {
  margin-top: 36px;
  text-align: center;
}

.pulse-glow {
  animation: modernPulse 2.5s infinite;
}

@keyframes modernPulse {
  0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.6); }
  70% { box-shadow: 0 0 0 18px rgba(245, 158, 11, 0); }
  100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
}

/* ============================================================
   STEP 2: COLLECTION SELECTION (ULTRA MODERN 3D CARDS)
   ============================================================ */
.collection-selection-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-top: 28px;
}

@media (max-width: 880px) {
  .collection-selection-grid {
    grid-template-columns: 1fr;
  }
}

.collection-card {
  position: relative;
  background: rgba(15, 23, 42, 0.85);
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
  padding: 26px;
  display: flex;
  flex-direction: column;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  backdrop-filter: blur(16px);
}

.collection-card:hover {
  transform: translateY(-8px);
}

/* JiuTian Card */
.deck-jiutian {
  border-color: rgba(245, 158, 11, 0.35);
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 16, 32, 0.95) 100%);
}

.deck-jiutian:hover {
  border-color: #f59e0b;
  box-shadow: 0 20px 45px rgba(245, 158, 11, 0.25), 0 0 20px rgba(245, 158, 11, 0.15);
}

.badge-jiutian {
  background: rgba(245, 158, 11, 0.15);
  color: #fde68a;
  border: 1px solid rgba(245, 158, 11, 0.4);
}

/* Bumji Card */
.deck-bumji {
  border-color: rgba(244, 63, 94, 0.35);
  background: linear-gradient(180deg, rgba(28, 15, 30, 0.95) 0%, rgba(15, 10, 20, 0.95) 100%);
}

.deck-bumji:hover {
  border-color: #f43f5e;
  box-shadow: 0 20px 45px rgba(244, 63, 94, 0.25), 0 0 20px rgba(244, 63, 94, 0.15);
}

.badge-bumji {
  background: rgba(244, 63, 94, 0.18);
  color: #fecdd3;
  border: 1px solid rgba(244, 63, 94, 0.4);
}

.collection-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  padding: 6px 16px;
  border-radius: 20px;
  font-family: var(--font-modern-thai);
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 20px;
}

.collection-card-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.collection-media-box {
  position: relative;
  width: 100%;
  height: 260px;
  border-radius: 16px;
  overflow: hidden;
  background: #020617;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.collection-box-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.collection-card:hover .collection-box-img {
  transform: scale(1.06);
}

.deck-count-badge {
  position: absolute;
  bottom: 14px;
  right: 14px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  color: #ffd700;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.deck-count-badge.badge-cat {
  color: #fbcfe8;
  border-color: rgba(244, 114, 182, 0.4);
}

.collection-name {
  font-family: var(--font-modern-thai);
  font-size: 22px;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 4px;
}

.collection-tagline {
  font-size: 13.5px;
  color: #94a3b8;
  margin-bottom: 16px;
}

/* Modern Style Callout Boxes (แนวคำตอบ) */
.collection-style-box {
  border-radius: 14px;
  padding: 16px 18px;
  margin-bottom: 18px;
  backdrop-filter: blur(12px);
}

.style-jiutian {
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-left: 4px solid #f59e0b;
}

.style-bumji {
  background: rgba(244, 63, 94, 0.08);
  border: 1px solid rgba(244, 63, 94, 0.3);
  border-left: 4px solid #f43f5e;
}

.style-header {
  font-family: var(--font-modern-thai);
  font-size: 13.5px;
  color: #ffffff;
  margin-bottom: 6px;
}

.style-desc {
  font-size: 13px;
  line-height: 1.65;
  color: #cbd5e1;
}

.collection-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 22px;
  flex-grow: 1;
}

.collection-features li {
  font-size: 13px;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-cat {
  background: linear-gradient(135deg, #f43f5e, #e11d48);
  color: #ffffff;
  border: none;
  font-family: var(--font-modern-thai);
  font-weight: 600;
  padding: 14px 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 18px rgba(244, 63, 94, 0.4);
}

.btn-cat:hover {
  background: linear-gradient(135deg, #fb7185, #f43f5e);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(244, 63, 94, 0.5);
}

/* ============================================================
   STEP 3: PICK 3 CARDS (MODERN SLOTS & FAN DECK)
   ============================================================ */
.pick-slots-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin: 28px 0;
}

@media (max-width: 800px) {
  .pick-slots-container {
    grid-template-columns: 1fr;
  }
}

.pick-target-slot {
  background: rgba(2, 6, 23, 0.5);
  border: 2px dashed rgba(255, 255, 255, 0.15);
  border-radius: 18px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
}

.pick-target-slot.active-pick {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.05);
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.25);
  transform: translateY(-4px);
}

.pick-target-slot.slot-filled {
  border-style: solid;
  border-color: #f59e0b;
  background: rgba(15, 23, 42, 0.85);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.slot-pos-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-modern-thai);
  font-size: 13.5px;
  font-weight: 700;
  color: #fde68a;
  margin-bottom: 14px;
}

.badge-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f59e0b;
  color: #000;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
}

.slot-card-holder {
  width: 140px;
  height: 220px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.slot-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #64748b;
  font-size: 12px;
  padding: 10px;
}

.slot-placeholder i {
  font-size: 30px;
  color: rgba(245, 158, 11, 0.4);
}

.slot-filled-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.slot-desc-text {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
}

/* Pick Controls Bar */
.pick-controls-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  background: rgba(2, 6, 23, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 14px 20px;
  margin-bottom: 26px;
  backdrop-filter: blur(12px);
}

.pick-current-instruction {
  font-family: var(--font-modern-thai);
  font-size: 14.5px;
  color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 10px;
}

.pick-quick-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* Interactive Fan Stage */
.deck-fan-stage {
  position: relative;
  height: 290px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  padding-bottom: 22px;
  background: radial-gradient(circle at center bottom, rgba(245, 158, 11, 0.12) 0%, transparent 70%);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.deck-fan-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.fan-card-item {
  position: absolute;
  bottom: 12px;
  width: 112px;
  height: 180px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.5);
  transform-origin: center 120%;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
}

.fan-card-item:hover {
  transform: translateY(-46px) scale(1.18) !important;
  z-index: 100 !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(245, 158, 11, 0.7);
  border-color: #ffd700;
}

/* Reveal Trigger Banner */
.reveal-trigger-banner {
  margin-top: 28px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.95));
  border: 2px solid #f59e0b;
  border-radius: 20px;
  padding: 26px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), 0 0 35px rgba(245, 158, 11, 0.4);
}

@media (max-width: 768px) {
  .reveal-trigger-banner {
    flex-direction: column;
    text-align: center;
  }
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 20px;
  color: #ffffff;
}

.banner-icon {
  font-size: 34px;
  color: #ffd700;
}

.banner-content h3 {
  font-family: var(--font-modern-thai);
  font-size: 19px;
  margin-bottom: 4px;
  color: #ffd700;
}

.banner-content p {
  font-size: 13.5px;
  color: #cbd5e1;
}

.btn-xl {
  padding: 16px 36px;
  font-size: 16.5px;
  font-weight: 700;
  border-radius: 16px;
  white-space: nowrap;
}

/* ============================================================
   STEP 4: DIVINATION RESULTS & SYNTHESIS (MODERN DISPLAY)
   ============================================================ */
.result-header-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 26px;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.result-question-banner {
  background: rgba(2, 6, 23, 0.65);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 18px;
  padding: 22px 28px;
  margin-bottom: 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);
}

.banner-badge-group {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.badge-deck {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #000000;
  font-family: var(--font-modern-thai);
  font-size: 11.5px;
  font-weight: 700;
  padding: 4px 14px;
  border-radius: 20px;
}

.badge-deck.deck-cat {
  background: linear-gradient(135deg, #f43f5e, #fb7185);
  color: #ffffff;
}

.badge-spread, .badge-date {
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 11.5px;
  padding: 4px 12px;
  border-radius: 20px;
}

.result-question-title {
  font-family: var(--font-modern-thai);
  font-size: 22px;
  font-weight: 700;
  color: #fde68a;
  line-height: 1.5;
}

/* 3 Cards Visual Board */
.result-cards-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 26px;
  margin-bottom: 36px;
}

@media (max-width: 880px) {
  .result-cards-board {
    grid-template-columns: 1fr;
  }
}

.result-card-item {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  transition: all 0.35s ease;
  backdrop-filter: blur(16px);
}

.result-card-item:hover {
  transform: translateY(-6px);
  border-color: rgba(245, 158, 11, 0.4);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.5), 0 0 20px rgba(245, 158, 11, 0.2);
}

.result-pos-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.result-pos-title {
  font-family: var(--font-modern-thai);
  font-size: 15px;
  font-weight: 700;
  color: #fde68a;
}

.result-card-media {
  width: 100%;
  height: 290px;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  background: #020617;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.result-card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-card-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.result-card-name {
  font-family: var(--font-modern-thai);
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
}

.result-tag-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.result-tag {
  font-size: 11.5px;
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 3px 10px;
  border-radius: 12px;
  color: #fde68a;
}

.result-pos-meaning {
  background: rgba(2, 6, 23, 0.5);
  border-left: 3px solid #f59e0b;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 13.5px;
  line-height: 1.65;
  color: #e2e8f0;
  margin-top: 4px;
}

.result-card-quote {
  font-size: 12.5px;
  font-style: italic;
  color: #94a3b8;
  line-height: 1.6;
  margin-top: 6px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.result-card-quote i {
  color: #f59e0b;
  margin-top: 3px;
}

/* Synthesis Section */
.result-synthesis-container {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(245, 158, 11, 0.35);
  border-radius: 22px;
  padding: 32px;
  box-shadow: 0 16px 45px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
}

.synthesis-header-block {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.synthesis-header-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
}

.synthesis-header-icon.cat-theme {
  background: linear-gradient(135deg, #f43f5e, #fb7185);
  color: #fff;
  box-shadow: 0 0 20px rgba(244, 63, 94, 0.4);
}

.synthesis-title {
  font-family: var(--font-modern-thai);
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
}

.synthesis-sub {
  font-size: 13.5px;
  color: #94a3b8;
}

.synthesis-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
}

@media (max-width: 768px) {
  .synthesis-cards-grid {
    grid-template-columns: 1fr;
  }
}

.synthesis-card-box {
  background: rgba(2, 6, 23, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
}

.synthesis-card-box.theme-cat {
  background: rgba(25, 10, 20, 0.6);
  border-color: rgba(244, 63, 94, 0.25);
}

.synthesis-box-title {
  font-family: var(--font-modern-thai);
  font-size: 16px;
  font-weight: 700;
  color: #fde68a;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.synthesis-box-title.text-cat {
  color: #fbcfe8;
}

.synthesis-box-body {
  font-size: 14px;
  line-height: 1.75;
  color: #cbd5e1;
}

/* Animations */
.animate-fade-in {
  animation: modernFadeIn 0.4s ease-out forwards;
}

@keyframes modernFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-bounce-soft {
  animation: modernBounce 2s infinite ease-in-out;
}

@keyframes modernBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
`;

fs.writeFileSync(cssPath, basePart + modernStyles, 'utf8');
console.log('Successfully updated styles.css with Ultra-Modern Cosmic Glass Design System!');
