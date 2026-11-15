/**
 * Bazi Marriage & Relationships Knowledge Database (ฐานข้อมูลว่าด้วยคู่ครองและชีวิตสมรส)
 * อ้างอิงจากคลังตำราวิชาการ:
 * - "ว่าด้วยคู่ครอง.pdf" (สำนักลิ้มแชเล้ง 林青龍宮)
 */

var BaziMarriageDB = (function () {
  'use strict';

  const MARRIAGE_RULES = {
    // 1. Male Chart Analysis (หลักเกณฑ์ดวงชะตาชาย)
    maleChart: {
      spouseStarTitle: 'ดาวคู่ครองของชาย คือ ดาวไช้ (โชคลาภ/ทรัพย์)',
      types: {
        zhengCai: {
          star: '正财 (เจี่ยไช้)',
          role: 'ภรรยาเอก / คู่ชีวิตคู่บุญ',
          manifestation: 'ได้ภรรยาเรียบร้อย มัธยัสถ์ ดูแลปรนนิบัติบ้านเรือนดี ร่วมสร้างฐานะครอบครัวอย่างมั่นคง'
        },
        pianCai: {
          star: '偏财 (เพียงไช้)',
          role: 'คนรัก / ภรรยาน้อย / สเน่หาหวือหวา',
          manifestation: 'ได้ภรรยาคล่องแคล่ว มีเสน่ห์ เก่งการค้าขาย หรือพบรักในสถานการณ์ที่ไม่คาดคิด หากในดวงไม่มีเจี่ยไช้ เพียงไช้จะทำหน้าที่เป็นภรรยาได้ดีเช่นกัน'
        },
        mixedWealth: {
          pattern: 'ไฉชวน (财混 - มีทั้งเจี่ยไช้และเพียงไช้)',
          manifestation: 'มีโอกาสพบเจอเรื่องรักซ้อน มีเสน่ห์ต่อเพศตรงข้ามมาก มักมีผู้หญิงเข้ามาพัวพันหลายคน ต้องระวังปัญหาครอบครัวแตกแยก'
        },
        noWealth: {
          pattern: 'ไร้ดาวไช้ในดวง (八字无财)',
          manifestation: 'แต่งงานช้า หรือมีอุปสรรคในการเข้าหาเพศตรงข้าม ให้ดูที่กิ่งดินเสาวัน (เรือนคู่ครอง) และธาตุอาหารของดิถีเป็นหลัก'
        },
        biJianClashWealth: {
          pattern: 'ปี่เกียบพิฆาตไช้ (比劫克财)',
          manifestation: 'เพื่อนฝูงหรือพี่น้องเข้ามาแทรกแซงเรื่องคู่ครอง หรือมีปากเสียงเรื่องเงินทองกับภรรยาบ่อยครั้ง'
        }
      }
    },

    // 2. Female Chart Analysis (หลักเกณฑ์ดวงชะตาสตรี)
    femaleChart: {
      spouseStarTitle: 'ดาวคู่ครองของหญิง คือ ดาวกัวสัวะ (ขุนนาง/อำนาจ)',
      types: {
        zhengGuan: {
          star: '正官 (เจียกัว)',
          role: 'สามีเอก / คู่แท้ผู้ทรงเกียรติ',
          manifestation: 'ได้สามีที่มีคุณธรรม สุภาพ มีตำแหน่งหน้าที่การงานมั่นคง เป็นผู้นำครอบครัวที่ดีและให้เกียรติภรรยา'
        },
        qiSha: {
          star: '七杀 (ฉิกสัวะ)',
          role: 'คนรัก / ชายชาตรีสายลุย',
          manifestation: 'ได้สามีที่มีบุคลิกเด็ดเดี่ยว มีอำนาจบารมี ทหาร ตำรวจ นักกีฬา หรือผู้มีอารมณ์ดุดัน ต้องปรับตัวเข้าหากันสูง'
        },
        mixedOfficerSha: {
          pattern: 'กัวสัวะปะปน (官杀混杂)',
          manifestation: 'มีผู้ชายเข้ามาในชีวิตพร้อมกันหลายคน เกิดความลังเลสับสน หรือชีวิตแต่งงานมีอุปสรรค ต้องแต่งงานช้าจึงจะมั่นคง'
        },
        shangGuanHarmOfficer: {
          pattern: 'เซียกัวพิฆาตกัว (伤官见官)',
          manifestation: 'มักเป็นคนฉลาด วาทศิลป์คม และชอบวิจารณ์สามี สามีจะรู้สึกอึดอัดหรือมีปัญหาสุขภาพ ต้องฝึกความอ่อนโยนและให้กำลังใจสามี'
        },
        noOfficer: {
          pattern: 'ไร้ดาวกัวในดวง (八字无官)',
          manifestation: 'มีแนวโน้มพึ่งพาตนเองสูง รักอิสระ แต่งงานช้า หรือมักได้คู่ครองที่อยู่ห่างไกลกัน'
        }
      }
    },

    // 3. Spouse Palace Analysis (เรือนคู่ครอง - กิ่งดินเสาวัน 日支)
    spousePalace: {
      title: 'เรือนคู่ครอง (กิ่งดินเสาวัน - 日支)',
      relations: {
        engendering: {
          title: 'เสาวันให้กำเนิดดิถี (เช่น เสาวันเป็นธาตุอิ่ง)',
          meaning: 'คู่ครองรักใคร่ ทะนุถนอม คอยดูแลเอาใจใส่และเกื้อหนุนชีวิตเป็นอย่างดี'
        },
        controlling: {
          title: 'เสาวันพิฆาตดิถี (เช่น เสาวันเป็นดาวกัวสัวะ)',
          meaning: 'คู่ครองมีอำนาจเหนือกว่า ชอบบงการ หรือทำให้รู้สึกกดดันในบางครั้ง'
        },
        drained: {
          title: 'ดิถีให้กำเนิดเสาวัน (เช่น เสาวันเป็นเจี๊ยะซิ้ง/เซียกัว)',
          meaning: 'เจ้าชะตาเป็นฝ่ายทุ่มเทดูแลเอาใจใส่คู่ครองมากกว่า ยอมเสียสละเพื่อครอบครัว'
        },
        sameElement: {
          title: 'เสาวันธาตุเดียวกับดิถี (เช่น เสาวันเป็นปี่เกย/เกียบไช้)',
          meaning: 'คู่ครองเหมือนเพื่อน รู้ใจกัน เข้าใจกัน แต่บางครั้งอาจดื้อรั้นใส่กัน ไม่ยอมลงให้กัน'
        }
      },
      clashEffects: {
        dayBranchClashed: 'เรือนคู่ครองถูกชง (เช่น เสาวันถูกเสาเดือนหรือเสายามชง): ชีวิตสมรสไม่ค่อยราบรื่น มักมีความเห็นขัดแย้ง หรือต้องแยกกันอยู่เพราะภารกิจหน้าที่การงาน',
        annualClashDay: 'ปีจรมาชงเสาวัน: มีเกณฑ์เกิดความเปลี่ยนแปลงครั้งสำคัญในความรัก เช่น คนโสดอาจพบรักกะทันหัน หรือคนมีคู่อาจมีเรื่องระหองระแหง ต้องใจเย็นและมีสติ'
      },
      combinations: {
        dayBranchCombined: 'เรือนคู่ครองถูกฮะ: ความสัมพันธ์แนบแน่น อบอุ่น ผูกพัน แต่หากถูกฮะไปเป็นธาตุที่ไม่ให้คุณ ระวังคู่ครองใจอ่อนหรือมีคนอื่นเข้ามาแทรก'
      }
    },

    // 4. Strategic Advice for Good Marriage (คำแนะนำเสริมสิริมงคลชีวิตคู่)
    guidance: [
      'เข้าใจธรรมชาติของตนเองและคู่ครอง: หากตนเองเป็นคนธาตุแข็งหรือมีดาวข่วยกัง/เอี่ยยิ่ม ต้องฝึกการยอมรับฟังและลดทิฐิลง',
      'ปีที่เรือนคู่ครองถูกชง ให้แก้เคล็ดด้วยการชวนกันเดินทางท่องเที่ยว เปลี่ยนบรรยากาศ หรือจัดห้องนอนใหม่',
      'ใช้หลักการ "หนึ่งมงคลต้านสามภัย" (一喜挡三灾) เช่น จัดงานมงคล ทำบุญร่วมกัน ปล่อยปลา หรือบริจาคทาน'
    ]
  };

  return {
    MARRIAGE_RULES,
    analyzeMarriage: function (gender, dayStem, dayBranch, tenGodsCounts, branchInteractions) {
      const isMale = (gender === 'male' || gender === 'ชาย');
      const rules = isMale ? MARRIAGE_RULES.maleChart : MARRIAGE_RULES.femaleChart;
      const findings = [];

      if (isMale) {
        const zc = tenGodsCounts['正财'] || 0;
        const pc = tenGodsCounts['偏财'] || 0;
        if (zc >= 1 && pc >= 1) findings.push(rules.types.mixedWealth);
        else if (zc >= 1) findings.push(rules.types.zhengCai);
        else if (pc >= 1) findings.push(rules.types.pianCai);
        else findings.push(rules.types.noWealth);

        if ((tenGodsCounts['比肩'] || 0) + (tenGodsCounts['劫财'] || 0) >= 3) {
          findings.push(rules.types.biJianClashWealth);
        }
      } else {
        const zg = tenGodsCounts['正官'] || 0;
        const qs = tenGodsCounts['七杀'] || 0;
        if (zg >= 1 && qs >= 1) findings.push(rules.types.mixedOfficerSha);
        else if (zg >= 1) findings.push(rules.types.zhengGuan);
        else if (qs >= 1) findings.push(rules.types.qiSha);
        else findings.push(rules.types.noOfficer);

        if ((tenGodsCounts['伤官'] || 0) >= 1 && zg >= 1) {
          findings.push(rules.types.shangGuanHarmOfficer);
        }
      }

      return {
        gender: isMale ? 'ชาย' : 'หญิง',
        spouseStarTitle: rules.spouseStarTitle,
        findings,
        spousePalaceInfo: MARRIAGE_RULES.spousePalace,
        guidance: MARRIAGE_RULES.guidance
      };
    }
  };
})();

if (typeof window !== 'undefined') window.BaziMarriageDB = BaziMarriageDB;
if (typeof globalThis !== 'undefined') globalThis.BaziMarriageDB = BaziMarriageDB;
if (typeof module !== 'undefined' && module.exports) module.exports = BaziMarriageDB;
