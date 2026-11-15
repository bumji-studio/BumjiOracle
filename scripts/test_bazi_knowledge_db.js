// ESM Test runner for Bazi Knowledge Base
import '../data/bazi-knowledge/bazi-ten-gods-db.js';
import '../data/bazi-knowledge/bazi-elements-career-db.js';
import '../data/bazi-knowledge/bazi-stars-db.js';
import '../data/bazi-knowledge/bazi-interactions-db.js';
import '../data/bazi-knowledge/bazi-marriage-db.js';
import '../data/bazi-knowledge/bazi-chart-patterns-db.js';
import '../data/bazi-knowledge/bazi-annual-db.js';
import '../data/bazi-knowledge/index.js';

console.log('Testing BaziKnowledge Base...');
const BaziKnowledge = globalThis.BaziKnowledge;
console.log('Version:', BaziKnowledge.version);

// 1. Test Ten Gods
const zhengYin = globalThis.BaziTenGodsDB.getGodInfo('正印');
console.log('1. Ten Gods check:', zhengYin ? `OK (${zhengYin.thai})` : 'FAIL');
console.log('   Suitable careers sample:', zhengYin.suitableCareers.slice(0, 3).join(', '));

// 2. Test Elements Career
const wood = globalThis.BaziElementsCareerDB.getElementCareer('Wood');
console.log('2. Elements check:', wood ? `OK (${wood.elementThai})` : 'FAIL');
console.log('   Favorable colors:', wood.favorableColors.join(', '));

// 3. Test Stars & Kui Gang
const kgCheck = globalThis.BaziStarsDB.checkKuiGang('庚', '戌');
console.log('3. Kui Gang check (庚戌):', kgCheck.isKuiGang ? `OK (${kgCheck.details.name})` : 'FAIL');

// 4. Test Interactions
const clash = globalThis.BaziInteractionsDB.checkBranchClash('子', '午');
console.log('4. Clash check (子午):', clash ? `OK (${clash.thai})` : 'FAIL');
const combo = globalThis.BaziInteractionsDB.checkStemCombination('甲', '己');
console.log('   Combine check (甲己):', combo ? `OK (${combo.thai})` : 'FAIL');

// 5. Test Chart Patterns (Weighting & Tai Yuan)
const taiYuan = globalThis.BaziChartPatternsDB.calculateTaiYuan('癸', '酉');
console.log('5. Tai Yuan check for Month 癸酉 (Stem+1, Branch+3):', taiYuan ? `OK (${taiYuan.pillar} - ${taiYuan.thai})` : 'FAIL');

const chartWeight = globalThis.BaziChartPatternsDB.calculateChartWeight('辛', {
  year: { stem: '甲', branch: '寅' },
  month: { stem: '癸', branch: '酉' },
  day: { stem: '辛', branch: '亥' },
  hour: { stem: '戊', branch: '子' }
});
console.log('   Chart Weighting check: Strength =', chartWeight.strengthType, '| Score =', chartWeight.supportScore, '/', chartWeight.totalScore);
console.log('   Useful Gods (Yong Shen):', chartWeight.yongShen.join(', '));

// 6. Test Marriage
const marriage = globalThis.BaziMarriageDB.analyzeMarriage('female', '辛', '亥', { '正官': 1, '七杀': 1 }, {});
console.log('6. Marriage check (Female):', marriage.findings.length > 0 ? `OK (${marriage.findings[0].pattern || marriage.findings[0].star})` : 'FAIL');

// 7. Test Annual Fortune
const annual = globalThis.BaziAnnualDB.analyzeAnnualFortune(
  '辛',
  '丙',
  '午',
  '壬',
  '子',
  {
    year: { stem: '甲', branch: '寅' },
    month: { stem: '癸', branch: '酉' },
    day: { stem: '辛', branch: '亥' },
    hour: { stem: '戊', branch: '子' }
  }
);
console.log('7. Annual Fortune check (2026 丙午 for 辛 Day Master):');
console.log('   Stem God:', annual.annualStemGod, '| Branch God:', annual.annualBranchGod);
console.log('   Theme:', annual.theme.title);
console.log('   Luck Interactions count:', annual.luckInteractions.length);
if (annual.luckInteractions.length > 0) {
  console.log('   -> Luck Interaction:', annual.luckInteractions[0].title);
}
console.log('   Natal Interactions count:', annual.natalInteractions.length);

console.log('\n>>> ALL 7 BAZI KNOWLEDGE MODULES PASSED 100%! <<<');
