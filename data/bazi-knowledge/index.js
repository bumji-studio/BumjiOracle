/**
 * Bazi Knowledge Base - Master Index (ศูนย์รวมฐานข้อมูลโหราศาสตร์จีนปาจื่อ)
 * รวม 7 โมดูลองค์ความรู้จากคลังตำราครูบาอาจารย์
 */

var BaziKnowledge = (function () {
  'use strict';

  function getGlobal(name) {
    if (typeof window !== 'undefined' && window[name]) return window[name];
    if (typeof globalThis !== 'undefined' && globalThis[name]) return globalThis[name];
    try {
      if (typeof require === 'function') {
        const fileMap = {
          'BaziTenGodsDB': './bazi-ten-gods-db.js',
          'BaziElementsCareerDB': './bazi-elements-career-db.js',
          'BaziStarsDB': './bazi-stars-db.js',
          'BaziInteractionsDB': './bazi-interactions-db.js',
          'BaziMarriageDB': './bazi-marriage-db.js',
          'BaziChartPatternsDB': './bazi-chart-patterns-db.js',
          'BaziAnnualDB': './bazi-annual-db.js',
          'BaziClassicalShenShaDB': './bazi-classical-shensha-db.js'
        };
        if (fileMap[name]) return require(fileMap[name]);
      }
    } catch (e) {}
    return null;
  }

  const tenGods = getGlobal('BaziTenGodsDB');
  const elements = getGlobal('BaziElementsCareerDB');
  const stars = getGlobal('BaziStarsDB');
  const interactions = getGlobal('BaziInteractionsDB');
  const marriage = getGlobal('BaziMarriageDB');
  const patterns = getGlobal('BaziChartPatternsDB');
  const annual = getGlobal('BaziAnnualDB');
  const classicalShenSha = getGlobal('BaziClassicalShenShaDB');

  return {
    version: '1.0.0-lineage-master',
    tenGods: tenGods,
    elements: elements,
    stars: stars,
    interactions: interactions,
    marriage: marriage,
    patterns: patterns,
    annual: annual,
    classicalShenSha: classicalShenSha,

    getCareerGuidance: function (dominantGods, favorableElements) {
      const guidance = [];
      const tg = this.tenGods || getGlobal('BaziTenGodsDB');
      const el = this.elements || getGlobal('BaziElementsCareerDB');

      if (dominantGods && dominantGods.length > 0 && tg) {
        for (const g of dominantGods) {
          const info = tg.getGodInfo(g);
          if (info) {
            guidance.push({
              source: `สิบเทพเด่น: ${info.thai} (${info.hanzi})`,
              careers: info.suitableCareers,
              description: info.careerDescription
            });
          }
        }
      }
      if (favorableElements && favorableElements.length > 0 && el) {
        for (const elem of favorableElements) {
          const eInfo = el.getElementCareer(elem);
          if (eInfo) {
            guidance.push({
              source: `ธาตุส่งเสริม (喜用神): ${eInfo.elementThai}`,
              suitableRoles: eInfo.suitableRoles,
              industries: eInfo.industries
            });
          }
        }
      }
      return guidance;
    }
  };
})();

if (typeof window !== 'undefined') window.BaziKnowledge = BaziKnowledge;
if (typeof globalThis !== 'undefined') globalThis.BaziKnowledge = BaziKnowledge;
if (typeof module !== 'undefined' && module.exports) module.exports = BaziKnowledge;
