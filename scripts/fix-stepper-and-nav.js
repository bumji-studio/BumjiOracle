import fs from 'fs';
import path from 'path';

const cssPath = path.resolve('styles.css');
let s = fs.readFileSync(cssPath, 'utf8');

// 1. Remove the old duplicate nav-tab block
const oldNavBlock = `.nav-tab {
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  font-family: var(--font-thai-header);
  font-size: 13px;
  font-weight: 500;
  padding: 8px 18px;
  border-radius: 20px;
  cursor: pointer;
  transition: var(--transition-smooth);
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-tab i {
  font-size: 14px;
}

.nav-tab:hover {
  color: var(--color-gold-light);
}

.nav-tab.active {
  background: linear-gradient(135deg, var(--color-gold-dark), var(--color-gold));
  color: #000;
  font-weight: 600;
  box-shadow: 0 0 12px var(--color-gold-glow);
}`;

if (s.includes(oldNavBlock)) {
  s = s.replace(oldNavBlock, '/* duplicate nav-tab removed */');
  console.log('Old nav-tab block removed!');
} else {
  console.log('Old nav-tab block not found exact match, searching regex...');
  s = s.replace(/\.nav-tab\.active\s*\{\s*background:\s*linear-gradient\(135deg,\s*var\(--color-gold-dark\)[^}]+\}/g, '');
}

// 2. Fix .reading-stepper width: 100% and .stepper-step min-width
s = s.replace(
`.reading-stepper {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 860px;
  margin: 0 auto 36px auto;
  padding: 12px 24px;
}`,
`.reading-stepper {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 760px;
  margin: 0 auto 36px auto;
  padding: 12px 24px;
}`
);

s = s.replace(
`.stepper-step {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  background: transparent;
}`,
`.stepper-step {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 100px;
  text-align: center;
  cursor: pointer;
  background: transparent;
}`
);

fs.writeFileSync(cssPath, s, 'utf8');
console.log('styles.css fine-tuning done!');
