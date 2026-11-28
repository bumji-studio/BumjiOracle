/**
 * Bazi Knowledge Base - Hidden Stems & Activation Conditions Database
 * (ฐานข้อมูลราศีแฝงและสภาวะออกกระทำการใน 12 ราศีล่าง / 12 นักษัตร)
 * 
 * ถ่ายทอดและเรียบเรียงตามสารบบวิชา:
 * "ฮวงจุ้ย ดวงจีน สามประสาน ฟ้า ดิน คน สำนักเฮียงเหล่งตึ้ง"
 * ครอบคลุม:
 * 1. 3 หมวดหมู่นักษัตร: ม้าเดินทาง (ต้นฤดู-生), ดาวเสน่ห์ (แกนกลางฤดู-旺), สุสาน/คลังธาตุ (ปลายฤดู-墓)
 * 2. ลำดับพลังราศีแฝง: พลังเศษตกค้าง (余气), พลังก่อกำเนิด/คลังธาตุ (中气/库气), พลังหลัก (本气) พร้อมจำนวนวันครองอำนาจ
 * 3. สภาวะการส่งผล (เมื่อไหร่จะส่งผล / 透干 / ซาฮะ / ลักฮะ / ชงเปิดคลัง / ชงปะทะ)
 * 4. เหตุการณ์และผลพยากรณ์ (ส่งผลแล้วจะเกิดอะไรขึ้น ทั้งด้านดี ด้านเสีย สุขภาพ การเงิน การงาน)
 */

var BaziHiddenStemsDB = (function () {
  'use strict';

  const LINEAGE_METADATA = {
    schoolNameThai: 'ฮวงจุ้ย ดวงจีน สามประสาน ฟ้า ดิน คน สำนักเฮียงเหล่งตึ้ง',
    doctrine: 'ราศีแฝงใน 12 ราศีล่าง (地支藏干) และสภาวะออกกระทำการ',
    tradition: 'ลู่หมิ่งซู่ (禄命术) & อู่สิงจิงจี้ (五行精纪) & หลานไถเมี่ยวเสวี่ยน (兰台妙选)',
    updatedAt: '2026-11-28'
  };

  const BRANCH_CATEGORIES = {
    TRAVEL_HORSE: {
      code: 'SHENG_HORSE',
      nameZh: '生 (长生/马星)',
      nameTh: 'ม้าเดินทาง (ต้นฤดู - 生)',
      branchesZh: ['寅', '巳', '申', '亥'],
      description: 'ต้นฤดูกาล จุดกำเนิดพลังงาน มีราศีแฝง 3 ตัว (ยกเว้น 亥 มักนับ 2 ตัว) ขยันขันแข็ง ไม่อยู่นิ่ง มีการเริ่มต้นใหม่เสมอ'
    },
    PEACH_BLOSSOM: {
      code: 'WANG_BLOSSOM',
      nameZh: '旺 (帝旺/桃花)',
      nameTh: 'ดาวเสน่ห์ (แกนกลางฤดู - 旺)',
      branchesZh: ['子', '卯', '午', '酉'],
      description: 'แกนกลางฤดูกาล จุดสูงสุดของธาตุ บริสุทธิ์และทรงพลังที่สุด มีราศีแฝงตัวเดียวเป็นพลังหลัก (ยกเว้น 午 มีดินกี้แฝง) โดดเด่นด้านเสน่ห์ สังคม อารมณ์'
    },
    TOMB_STORAGE: {
      code: 'MU_STORAGE',
      nameZh: '墓 (墓库)',
      nameTh: 'สุสาน/คลังธาตุ (ปลายฤดู - 墓)',
      branchesZh: ['丑', '辰', '未', '戌'],
      description: 'ปลายฤดูกาล จุดเปลี่ยนผ่านมิติและสะสมพลังธาตุดิน มีราศีแฝง 3 ตัว (เศษตกค้าง, คลังธาตุ, พลังหลัก) ต้องอาศัยการชงเปิดคลังเพื่อปลดปล่อยขุมทรัพย์'
    }
  };

  const BRANCHES = {
    '子': {
      index: 1,
      branchZh: '子',
      branchTh: 'จื้อ',
      animalZh: '鼠',
      animalTh: 'ชวด (หนู)',
      natureTh: 'น้ำหยิน (แกนกลางฤดูหนาว)',
      elementZh: '水',
      elementTh: 'ธาตุน้ำ',
      category: 'PEACH_BLOSSOM',
      categoryTh: 'ดาวเสน่ห์ (แกนกลางฤดู - 旺)',
      seasonContext: {
        chineseMonth: 'เดือน 11 จีน (จื้อง้วย - 子月)',
        solarTerm: 'ช่วงสารทต้าเสวี่ย (大雪 - หิมะตกหนัก) ถึง ตงจื้อ (冬至 - เหมายัน)',
        natureDescription: 'แกนกลางฤดูหนาว ธาตุน้ำเยือกเย็น สงบนิ่ง และบริสุทธิ์ที่สุด ไม่มีธาตุอื่นเจือปน'
      },
      hiddenStems: [
        {
          stemZh: '癸',
          stemTh: 'กุ่ย (น้ำหยิน)',
          elementZh: '水',
          elementTh: 'ธาตุน้ำ',
          roleZh: '本气',
          roleTh: 'พลังหลัก (เปิ่นชี่)',
          days: 30,
          percentage: 100,
          description: 'ครองอำนาจเต็ม 30 วันของสารทเดือน เป็นกระแสน้ำหยินที่เยือกเย็น ลึกซึ้ง บริสุทธิ์'
        }
      ],
      activationConditions: {
        triggers: [
          'บนฟ้ามีน้ำกุ่ย (癸) หรือน้ำหยิ่ม (壬) ปรากฏลอยเด่น (透干)',
          'เข้าสู่การผสมธาตุไตรภาคีน้ำ (申-子-辰 ซาฮะน้ำ)',
          'เข้าสู่ทวิภาคีน้ำ (子-丑 ลักฮะดิน/น้ำ)',
          'ถูกชงปะทะโดยราศีมะเมีย (子-午 冲 ชวดชงมะเมีย)'
        ],
        manifestation: {
          positive: 'ส่งเสริมเรื่องสติปัญญา ความคิดลึกซึ้ง ไหวพริบปฏิภาณ เสน่ห์ดึงดูดผู้คน (ดาวท้อฮวย) หากน้ำมีกำลังดีจะเด่นด้านการค้าขาย การสื่อสาร และการเจรจาธุรกิจระหว่างประเทศ',
          negative: 'หากน้ำมากเกินไปจนท่วมท้นหรือถูกชง อาจเกิดความโลเล ลังเล ไม่มั่นคง วิตกกังวล ซึมเศร้า หรือมีเรื่องชู้สาววุ่นวาย รักซ้อน',
          health: 'ระบบไต ทางเดินปัสสาวะ อวัยวะสืบพันธุ์ กระเพาะปัสสาวะ เลือด และความเย็นในร่างกาย'
        }
      }
    },

    '丑': {
      index: 2,
      branchZh: '丑',
      branchTh: 'ทิ่ว',
      animalZh: '牛',
      animalTh: 'ฉลู (วัว)',
      natureTh: 'ดินหยินเปียก / คลังทอง (ปลายฤดูหนาว)',
      elementZh: '土',
      elementTh: 'ธาตุดิน (ดินเย็นชุ่มน้ำ)',
      category: 'TOMB_STORAGE',
      categoryTh: 'สุสาน/คลังธาตุ (ปลายฤดู - 墓)',
      seasonContext: {
        chineseMonth: 'เดือน 12 จีน (ทิ่วง้วย - 丑月)',
        solarTerm: 'ช่วงสารทเสี่ยวหาน (小寒 - หนาวน้อย) ถึง ต้าหาน (大寒 - หนาวใหญ่)',
        natureDescription: 'ปลายฤดูหนาวเปลี่ยนผ่านสู่ฤดูใบไม้ผลิ ดินโคลนเยือกแข็ง เป็นสุสาน/คลังธาตุทอง (金库)'
      },
      hiddenStems: [
        {
          stemZh: '癸',
          stemTh: 'กุ่ย (น้ำหยิน)',
          elementZh: '水',
          elementTh: 'ธาตุน้ำ',
          roleZh: '余气',
          roleTh: 'พลังเศษตกค้าง (หวี่ชี่)',
          days: 9,
          percentage: 30,
          description: 'เศษตกค้างจากฤดูหนาว ครองอำนาจ 9 วันแรก'
        },
        {
          stemZh: '辛',
          stemTh: 'ซิง (ทองหยิน)',
          elementZh: '金',
          elementTh: 'ธาตุทอง',
          roleZh: '中气 / 库气',
          roleTh: 'พลังคลังธาตุ (จงชี่ / ขู่ชี่)',
          days: 3,
          percentage: 10,
          description: 'พลังคลังธาตุทองที่ถูกเก็บกักไว้ ครองอำนาจ 3 วันถัดมา'
        },
        {
          stemZh: '己',
          stemTh: 'กี้ (ดินหยิน)',
          elementZh: '土',
          elementTh: 'ธาตุดิน',
          roleZh: '本气',
          roleTh: 'พลังหลัก (เปิ่นชี่)',
          days: 18,
          percentage: 60,
          description: 'พลังหลักของราศี ดินโคลนแช่แข็ง ครองอำนาจ 18 วันสุดท้าย'
        }
      ],
      activationConditions: {
        triggers: [
          'มี 己, 辛, 癸 ปรากฏบนราศีบน (透干)',
          'เกิดการ "ชงเปิดคลัง" โดยราศีมะแม (丑-未 冲 ฉลูชงมะแม)',
          'เกิดการลงทัณฑ์สามราศี (丑-戌-未 ซาเฮ้ง ดินปะทะลงทัณฑ์)',
          'ร่วมขบวนไตรภาคีทอง (巳-酉-丑 ซาฮะทอง)'
        ],
        manifestation: {
          positive: 'หากคลังทองถูกเปิดและทองเป็นธาตุให้คุณ เจ้าชะตาจะได้ทรัพย์สินก้อนโต ได้รับมรดก มีโชคลาภที่ไม่คาดคิด กิจการที่ซบเซาจะฟื้นตัวมีสภาพคล่องสูง',
          negative: 'หากธาตุที่แตกออกมาเป็นธาตุให้โทษ หรือถูกซาเฮ้งบดขยี้ อาจนำมาซึ่งความสูญเสียทางการเงินอย่างฉับพลัน ถูกหักหลัง คดีความมรดก',
          health: 'ระบบม้าม กระเพาะอาหาร ท้อง ท้องอืด ท้องผูก และระบบกระดูก/ข้อต่อ'
        }
      }
    },

    '寅': {
      index: 3,
      branchZh: '寅',
      branchTh: 'เอี้ยง (อิ๋น)',
      animalZh: '虎',
      animalTh: 'ขาล (เสือ)',
      natureTh: 'ไม้หยาง (ต้นฤดูใบไม้ผลิ)',
      elementZh: '木',
      elementTh: 'ธาตุไม้',
      category: 'TRAVEL_HORSE',
      categoryTh: 'ม้าเดินทาง (ต้นฤดู - 生)',
      seasonContext: {
        chineseMonth: 'เดือน 1 จีน (เอี้ยงง้วย - 寅月)',
        solarTerm: 'ช่วงสารทลี่ชุน (立春 - เริ่มฤดูใบไม้ผลิ) ถึง อวี่สุ่ย (雨水 - ฝนเริ่มตก)',
        natureDescription: 'ต้นฤดูใบไม้ผลิ ต้นไม้ผุดยอด เป็นจุดกำเนิดธาตุไฟ (火的长生) และเป็นดาวม้าเดินทาง (เอี๊ยะเบ๊)'
      },
      hiddenStems: [
        {
          stemZh: '戊',
          stemTh: 'โบ่ว (ดินหยาง)',
          elementZh: '土',
          elementTh: 'ธาตุดิน',
          roleZh: '余气',
          roleTh: 'พลังเศษตกค้าง (หวี่ชี่)',
          days: 7,
          percentage: 23.3,
          description: 'เศษตกค้างจากดินสุสานปลายหนาว ครองอำนาจ 7 วันแรก'
        },
        {
          stemZh: '丙',
          stemTh: 'เปี้ย (ไฟหยาง)',
          elementZh: '火',
          elementTh: 'ธาตุไฟ',
          roleZh: '中气',
          roleTh: 'พลังก่อกำเนิด (จงชี่ / ฉางเซิง)',
          days: 7,
          percentage: 23.3,
          description: 'จุดกำเนิดธาตุไฟ แสงแรกแห่งความอบอุ่น ครองอำนาจ 7 วันถัดมา'
        },
        {
          stemZh: '甲',
          stemTh: 'กะ (ไม้หยาง)',
          elementZh: '木',
          elementTh: 'ธาตุไม้',
          roleZh: '本气',
          roleTh: 'พลังหลัก (เปิ่นชี่)',
          days: 16,
          percentage: 53.4,
          description: 'พลังหลักของราศี ไม้ยักษ์ทะยานฟ้า ครองอำนาจ 16 วันสุดท้าย'
        }
      ],
      activationConditions: {
        triggers: [
          'มี 甲, 丙, 戊 ปรากฏบนฟ้า (透干)',
          'ร่วมขบวนไตรภาคีไฟ (寅-午-戌 ซาฮะไฟ)',
          'เข้ากลุ่มทวิภาคี (寅-亥 ลักฮะไม้)',
          'ถูกชงปะทะโดยราศีวอก (寅-申 冲 ขาลชงวอก ม้าชนม้า)'
        ],
        manifestation: {
          positive: 'ส่งผลให้เกิดความทะเยอทะยาน การเริ่มต้นโปรเจกต์ใหม่ ความกล้าหาญ เติบโตในหน้าที่การงาน หากไฟเปี้ยแฝงทำงาน จะช่วยอบอุ่นดวงชะตาที่หนาวเย็นให้สดใส มีบารมีและชื่อเสียง',
          negative: 'หากถูกราศีวอกเข้าชง จะเกิดการเดินทางโยกย้ายกะทันหัน อุบัติเหตุทางยานพาหนะ การขัดแย้งกับผู้ใหญ่ หรือแตกหักทางธุรกิจ',
          health: 'แขน ขา เส้นเอ็น ตับ ถุงน้ำดี และระบบประสาทสั่งการ'
        }
      }
    },

    '卯': {
      index: 4,
      branchZh: '卯',
      branchTh: 'เบ้า (เหม่า)',
      animalZh: '兔',
      animalTh: 'เถาะ (กระต่าย)',
      natureTh: 'ไม้หยิน (แกนกลางฤดูใบไม้ผลิ)',
      elementZh: '木',
      elementTh: 'ธาตุไม้',
      category: 'PEACH_BLOSSOM',
      categoryTh: 'ดาวเสน่ห์ (แกนกลางฤดู - 旺)',
      seasonContext: {
        chineseMonth: 'เดือน 2 จีน (เบ้าง้วย - 卯月)',
        solarTerm: 'ช่วงสารทจิงเจ๋อ (惊蛰 - แมลงตื่น) ถึง ชุนเฟิน (春分 - วสันตวิษุวัต)',
        natureDescription: 'แกนกลางฤดูใบไม้ผลิ พืชพันธุ์เขียวชอุ่มบริสุทธิ์ เป็นดาวเสน่ห์ดอกท้อ (ท้อฮวย)'
      },
      hiddenStems: [
        {
          stemZh: '乙',
          stemTh: 'อิก (ไม้หยิน)',
          elementZh: '木',
          elementTh: 'ธาตุไม้',
          roleZh: '本气',
          roleTh: 'พลังหลัก (เปิ่นชี่)',
          days: 30,
          percentage: 100,
          description: 'ครองอำนาจเต็ม 30 วันของสารทเดือน เป็นไม้เลื้อย พืชดอก ใบไม้อ่อนที่เขียวชอุ่ม'
        }
      ],
      activationConditions: {
        triggers: [
          'มีไม้อิก (乙) หรือไม้กะ (甲) ปรากฏบนฟ้า (透干)',
          'เข้ากลุ่มไตรภาคีไม้ (亥-卯-未 ซาฮะไม้)',
          'เข้ากลุ่มทวิภาคี (卯-戌 ลักฮะไฟ)',
          'ถูกชงปะทะโดยราศีระกา (卯-酉 冲 เถาะชงระกา)'
        ],
        manifestation: {
          positive: 'เสริมสร้างความนุ่มนวล มนุษยสัมพันธ์ ความยืดหยุ่น ปรับตัวเก่ง เสน่ห์ทางสังคม หากไม้ให้คุณจะประสบความสำเร็จด้านชื่อเสียง ศิลปวิทยาการ แฟชั่น และการเจรจาประนีประนอม',
          negative: 'หากถูกชงปะทะโดยตรง จะส่งผลให้จิตใจแปรปรวน อารมณ์อ่อนไหวเกินไป ความรักมีปัญหามือที่สาม เกิดแผลจากของมีคม',
          health: 'ตับ ถุงน้ำดี ระบบประสาท ตา และอาการปวดเมื่อยตามข้อนิ้วมือ'
        }
      }
    },

    '辰': {
      index: 5,
      branchZh: '辰',
      branchTh: 'ซิ้ง (เฉิน)',
      animalZh: '龙',
      animalTh: 'มะโรง (มังกร)',
      natureTh: 'ดินหยางเปียก / คลังน้ำ (ปลายฤดูใบไม้ผลิ)',
      elementZh: '土',
      elementTh: 'ธาตุดิน (ดินชุ่มน้ำริมตลิ่ง)',
      category: 'TOMB_STORAGE',
      categoryTh: 'สุสาน/คลังธาตุ (ปลายฤดู - 墓)',
      seasonContext: {
        chineseMonth: 'เดือน 3 จีน (ซิ้งง้วย - 辰月)',
        solarTerm: 'ช่วงสารทชิงหมิง (清明 - เช็งเม้ง) ถึง กู่ยวี่ (谷雨 - ฝนชลธาร)',
        natureDescription: 'ปลายฤดูใบไม้ผลิเปลี่ยนผ่านสู่ฤดูร้อน ดินชุ่มน้ำริมตลิ่ง เป็นสุสาน/คลังธาตุน้ำ (水库)'
      },
      hiddenStems: [
        {
          stemZh: '乙',
          stemTh: 'อิก (ไม้หยิน)',
          elementZh: '木',
          elementTh: 'ธาตุไม้',
          roleZh: '余气',
          roleTh: 'พลังเศษตกค้าง (หวี่ชี่)',
          days: 9,
          percentage: 30,
          description: 'เศษตกค้างจากฤดูใบไม้ผลิ ครองอำนาจ 9 วันแรก'
        },
        {
          stemZh: '癸',
          stemTh: 'กุ่ย (น้ำหยิน)',
          elementZh: '水',
          elementTh: 'ธาตุน้ำ',
          roleZh: '中气 / 库气',
          roleTh: 'พลังคลังธาตุ (จงชี่ / ขู่ชี่)',
          days: 3,
          percentage: 10,
          description: 'พลังคลังธาตุน้ำที่ถูกกักเก็บ ครองอำนาจ 3 วันถัดมา'
        },
        {
          stemZh: '戊',
          stemTh: 'โบ่ว (ดินหยาง)',
          elementZh: '土',
          elementTh: 'ธาตุดิน',
          roleZh: '本气',
          roleTh: 'พลังหลัก (เปิ่นชี่)',
          days: 18,
          percentage: 60,
          description: 'พลังหลักของราศี ดินเขื่อนดินตลิ่ง ครองอำนาจ 18 วันสุดท้าย'
        }
      ],
      activationConditions: {
        triggers: [
          'มี 戊, 乙, 癸 ปรากฏบนฟ้า (透干)',
          'ถูก "ชงเปิดคลัง" โดยราศีจอ (辰-戌 冲 มะโรงชงจอ)',
          'ร่วมขบวนไตรภาคีน้ำ (申-子-辰 ซาฮะน้ำ)',
          'เข้ากลุ่มทวิภาคี (辰-酉 ลักฮะทอง)'
        ],
        manifestation: {
          positive: 'การชงเปิดคลังน้ำจะปลดปล่อยกระแสน้ำกุ่ยออกมา หากน้ำเป็นดาวโชคลาภจะนำมาซึ่งความมั่งคั่งอย่างรวดเร็ว ได้เงินก้อนโต มีสภาพคล่องสูง',
          negative: 'หากน้ำเป็นธาตุพิฆาตหรือให้โทษ อาจเกิดน้ำท่วมทำลายโครงสร้างดวง เกิดปัญหาหนี้สิน ทรัพย์สินเสียหาย หรือถูกฟ้องร้องเรื่องเงินทอง',
          health: 'กระเพาะปัสสาวะ ระบบสืบพันธุ์ มดลูก รังไข่ ต่อมลูกหมาก และผิวหนังพุพอง'
        }
      }
    },

    '巳': {
      index: 6,
      branchZh: '巳',
      branchTh: 'จี๋ (ซื่อ)',
      animalZh: '蛇',
      animalTh: 'มะเส็ง (งู)',
      natureTh: 'ไฟหยาง (ต้นฤดูร้อน)',
      elementZh: '火',
      elementTh: 'ธาตุไฟ',
      category: 'TRAVEL_HORSE',
      categoryTh: 'ม้าเดินทาง (ต้นฤดู - 生)',
      seasonContext: {
        chineseMonth: 'เดือน 4 จีน (จี๋ง้วย - 巳月)',
        solarTerm: 'ช่วงสารทลี่เซี่ย (立夏 - เริ่มฤดูร้อน) ถึง เสี่ยวหม่าน (小满 - พืชพันธุ์เริ่มเต็ม)',
        natureDescription: 'ต้นฤดูร้อน แสงแดดแผ่ความร้อน เป็นจุดกำเนิดธาตุทอง (金的长生) และเป็นดาวม้าเดินทาง (เอี๊ยะเบ๊)'
      },
      hiddenStems: [
        {
          stemZh: '戊',
          stemTh: 'โบ่ว (ดินหยาง)',
          elementZh: '土',
          elementTh: 'ธาตุดิน',
          roleZh: '余气',
          roleTh: 'พลังเศษตกค้าง (หวี่ชี่)',
          days: 7,
          percentage: 23.3,
          description: 'เศษตกค้างจากดินสุสานปลายใบไม้ผลิ ครองอำนาจ 7 วันแรก'
        },
        {
          stemZh: '庚',
          stemTh: 'แก (ทองหยาง)',
          elementZh: '金',
          elementTh: 'ธาตุทอง',
          roleZh: '中气',
          roleTh: 'พลังก่อกำเนิด (จงชี่ / ฉางเซิง)',
          days: 7,
          percentage: 23.3,
          description: 'จุดกำเนิดธาตุทอง แร่ดิบรอการหลอม ครองอำนาจ 7 วันถัดมา'
        },
        {
          stemZh: '丙',
          stemTh: 'เปี้ย (ไฟหยาง)',
          elementZh: '火',
          elementTh: 'ธาตุไฟ',
          roleZh: '本气',
          roleTh: 'พลังหลัก (เปิ่นชี่)',
          days: 16,
          percentage: 53.4,
          description: 'พลังหลักของราศี แสงสุริยันเจิดจ้า ครองอำนาจ 16 วันสุดท้าย'
        }
      ],
      activationConditions: {
        triggers: [
          'มี 丙, 庚, 戊 ปรากฏบนฟ้า (透干)',
          'ร่วมขบวนไตรภาคีทอง (巳-酉-丑 ซาฮะทอง)',
          'เข้ากลุ่มทวิภาคี (巳-申 ลักฮะน้ำ)',
          'ถูกชงปะทะโดยราศีกุน (巳-亥 冲 มะเส็งชงกุน ไฟชงน้ำ)'
        ],
        manifestation: {
          positive: 'ส่งเสริมความเฉลียวฉลาด การแก้ไขปัญหาเฉพาะหน้า ความกระตือรือร้น โอกาสทางการเงิน หากพลังแฝงทองแกถูกกระตุ้นจะช่วยสร้างความมั่งคั่งและขยายการค้า',
          negative: 'หากถูกราศีกุนชงอย่างรุนแรง ธาตุไฟจะดับ ส่งผลให้เกิดความกระวนกระวาย การเปลี่ยนแปลงหน้าที่การงานแบบฟ้าผ่า อุบัติเหตุเพลิงไหม้หรือไฟฟ้า',
          health: 'ระบบหัวใจ หลอดเลือด สายตา ความดันโลหิต และลำไส้เล็ก'
        }
      }
    },

    '午': {
      index: 7,
      branchZh: '午',
      branchTh: 'โง่ว (อู่)',
      animalZh: '马',
      animalTh: 'มะเมีย (ม้า)',
      natureTh: 'ไฟหยิน (แกนกลางฤดูร้อน)',
      elementZh: '火',
      elementTh: 'ธาตุไฟ',
      category: 'PEACH_BLOSSOM',
      categoryTh: 'ดาวเสน่ห์ (แกนกลางฤดู - 旺)',
      seasonContext: {
        chineseMonth: 'เดือน 5 จีน (โง่วง้วย - 午月)',
        solarTerm: 'ช่วงสารทหมางจ้ง (芒种 - เก็บเกี่ยวพืชมีรวง) ถึง เซี่ยจื้อ (夏至 - ครีษมายัน)',
        natureDescription: 'แกนกลางฤดูร้อน ความร้อนแรงสูงสุด เปลวไฟหลอมรวมเป็นดิน เป็นดาวเสน่ห์ (ท้อฮวย)'
      },
      hiddenStems: [
        {
          stemZh: '丙',
          stemTh: 'เปี้ย (ไฟหยาง)',
          elementZh: '火',
          elementTh: 'ธาตุไฟ',
          roleZh: '余气',
          roleTh: 'พลังเศษตกค้าง (หวี่ชี่)',
          days: 10,
          percentage: 33.3,
          description: 'พลังไฟร้อนแรงช่วงต้น ครองอำนาจ 10 วันแรก'
        },
        {
          stemZh: '己',
          stemTh: 'กี้ (ดินหยิน)',
          elementZh: '土',
          elementTh: 'ธาตุดิน',
          roleZh: '中气',
          roleTh: 'พลังรองที่เกิดจากไฟ (จงชี่)',
          days: 9,
          percentage: 30,
          description: 'เถ้าถ่านดินที่กำเนิดจากเปลวเพลิง ครองอำนาจ 9 วันถัดมา'
        },
        {
          stemZh: '丁',
          stemTh: 'เต็ง (ไฟหยิน)',
          elementZh: '火',
          elementTh: 'ธาตุไฟ',
          roleZh: '本气',
          roleTh: 'พลังหลัก (เปิ่นชี่)',
          days: 11,
          percentage: 36.7,
          description: 'พลังหลักของราศี เปลวไฟหลอมละลาย ครองอำนาจ 11 วันสุดท้าย'
        }
      ],
      activationConditions: {
        triggers: [
          'มี 丁, 己, 丙 ปรากฏบนฟ้า (透干)',
          'ร่วมกลุ่มไตรภาคีไฟ (寅-午-戌 ซาฮะไฟ)',
          'เข้ากลุ่มทวิภาคี (午-未 ลักฮะดิน/ไฟ)',
          'ถูกชงปะทะโดยราศีชวด (子-午 冲 ชวดชงมะเมีย)'
        ],
        manifestation: {
          positive: 'ขับเน้นความโดดเด่นในวงสังคม ความมั่นใจ ชื่อเสียงเกียรติยศ และเนื่องจากมีดินกี้แฝงอยู่ จึงช่วยดูดซับความร้อนและให้กำเนิดทองได้บางส่วน มีเสน่ห์แรงดึงดูดสูง',
          negative: 'หากถูกชงอย่างหนักจะส่งผลให้อารมณ์ฉุนเฉียว แตกหักกับผู้อื่นง่าย ใจร้อน ขาดความรอบคอบ เสี่ยงต่อการตัดสินใจผิดพลาดเรื่องสัญญา',
          health: 'โรคหัวใจ ความดันโลหิต สายตา เลือด ร้อนใน ลิ้น และอาการนอนไม่หลับ'
        }
      }
    },

    '未': {
      index: 8,
      branchZh: '未',
      branchTh: 'บี่ (เว่ย)',
      animalZh: '羊',
      animalTh: 'มะแม (แพะ)',
      natureTh: 'ดินหยินแห้ง / คลังไม้ (ปลายฤดูร้อน)',
      elementZh: '土',
      elementTh: 'ธาตุดิน (ดินแห้งอบความร้อน)',
      category: 'TOMB_STORAGE',
      categoryTh: 'สุสาน/คลังธาตุ (ปลายฤดู - 墓)',
      seasonContext: {
        chineseMonth: 'เดือน 6 จีน (บี่ง้วย - 未月)',
        solarTerm: 'ช่วงสารทเสี่ยวสู่ (小暑 - ร้อนน้อย) ถึง ต้าสู่ (大暑 - ร้อนมาก)',
        natureDescription: 'ปลายฤดูร้อนเปลี่ยนผ่านสู่ฤดูใบไม้ร่วง ดินแห้งสะสมความร้อนสูง เป็นสุสาน/คลังธาตุไม้ (木库)'
      },
      hiddenStems: [
        {
          stemZh: '丁',
          stemTh: 'เต็ง (ไฟหยิน)',
          elementZh: '火',
          elementTh: 'ธาตุไฟ',
          roleZh: '余气',
          roleTh: 'พลังเศษตกค้าง (หวี่ชี่)',
          days: 9,
          percentage: 30,
          description: 'เศษตกค้างจากฤดูร้อน ครองอำนาจ 9 วันแรก'
        },
        {
          stemZh: '乙',
          stemTh: 'อิก (ไม้หยิน)',
          elementZh: '木',
          elementTh: 'ธาตุไม้',
          roleZh: '中气 / 库气',
          roleTh: 'พลังคลังธาตุ (จงชี่ / ขู่ชี่)',
          days: 3,
          percentage: 10,
          description: 'พลังคลังธาตุไม้ที่ถูกเก็บงำ ครองอำนาจ 3 วันถัดมา'
        },
        {
          stemZh: '己',
          stemTh: 'กี้ (ดินหยิน)',
          elementZh: '土',
          elementTh: 'ธาตุดิน',
          roleZh: '本气',
          roleTh: 'พลังหลัก (เปิ่นชี่)',
          days: 18,
          percentage: 60,
          description: 'พลังหลักของราศี ดินแห้งเตาอบ ครองอำนาจ 18 วันสุดท้าย'
        }
      ],
      activationConditions: {
        triggers: [
          'มี 己, 丁, 乙 ปรากฏบนฟ้า (透干)',
          'ถูก "ชงเปิดคลัง" โดยราศีฉลู (丑-未 冲 ฉลูชงมะแม)',
          'ร่วมขบวนไตรภาคีไม้ (亥-卯-未 ซาฮะไม้)',
          'ร่วมกลุ่มทวิภาคี (午-未 ลักฮะ)'
        ],
        manifestation: {
          positive: 'การชงเปิดคลังจะปลดปล่อยพลังไม้และไฟออกมา หากเป็นธาตุที่ดวงต้องการ จะส่งเสริมความก้าวหน้า การขยับขยายธุรกิจ และความสำเร็จในโครงการใหญ่',
          negative: 'หากไม้และดินขัดแย้งกันรุนแรง หรือดวงร้อนจัดเกินไป จะแห้งแล้งจนขาดทุน ขัดแย้งกับหุ้นส่วน เสียทรัพย์เพราะที่ดินหรืออสังหาริมทรัพย์',
          health: 'ตับ ถุงน้ำดี กระเพาะอาหาร ลำไส้ใหญ่ ม้าม และอาการผิวหนังแห้งคัน'
        }
      }
    },

    '申': {
      index: 9,
      branchZh: '申',
      branchTh: 'ซิม (เซิน)',
      animalZh: '猴',
      animalTh: 'วอก (ลิง)',
      natureTh: 'ทองหยาง (ต้นฤดูใบไม้ร่วง)',
      elementZh: '金',
      elementTh: 'ธาตุทอง',
      category: 'TRAVEL_HORSE',
      categoryTh: 'ม้าเดินทาง (ต้นฤดู - 生)',
      seasonContext: {
        chineseMonth: 'เดือน 7 จีน (ซิมง้วย - 申月)',
        solarTerm: 'ช่วงสารทลี่ชิว (立秋 - เริ่มฤดูใบไม้ร่วง) ถึง ชู่สู่ (处暑 - สิ้นสุดความร้อน)',
        natureDescription: 'ต้นฤดูใบไม้ร่วง แร่โลหะบริสุทธิ์ เป็นจุดกำเนิดธาตุน้ำ (水的长生) และเป็นดาวม้าเดินทาง (เอี๊ยะเบ๊)'
      },
      hiddenStems: [
        {
          stemZh: '戊',
          stemTh: 'โบ่ว (ดินหยาง)',
          elementZh: '土',
          elementTh: 'ธาตุดิน',
          roleZh: '余气',
          roleTh: 'พลังเศษตกค้าง (หวี่ชี่)',
          days: 7,
          percentage: 23.3,
          description: 'เศษตกค้างจากดินสุสานปลายฤดูร้อน ครองอำนาจ 7 วันแรก'
        },
        {
          stemZh: '壬',
          stemTh: 'หยิ่ม (น้ำหยาง)',
          elementZh: '水',
          elementTh: 'ธาตุน้ำ',
          roleZh: '中气',
          roleTh: 'พลังก่อกำเนิด (จงชี่ / ฉางเซิง)',
          days: 7,
          percentage: 23.3,
          description: 'จุดกำเนิดธาตุน้ำ ต้นกำเนิดแม่น้ำ ครองอำนาจ 7 วันถัดมา'
        },
        {
          stemZh: '庚',
          stemTh: 'แก (ทองหยาง)',
          elementZh: '金',
          elementTh: 'ธาตุทอง',
          roleZh: '本气',
          roleTh: 'พลังหลัก (เปิ่นชี่)',
          days: 16,
          percentage: 53.4,
          description: 'พลังหลักของราศี แร่ทองคำแกร่ง ดาบโลหะ ครองอำนาจ 16 วันสุดท้าย'
        }
      ],
      activationConditions: {
        triggers: [
          'มี 庚, 壬, 戊 ปรากฏบนฟ้า (透干)',
          'ร่วมขบวนไตรภาคีน้ำ (申-子-辰 ซาฮะน้ำ)',
          'เข้ากลุ่มทวิภาคี (巳-申 ลักฮะน้ำ)',
          'ถูกชงปะทะโดยราศีขาล (寅-申 冲 ขาลชงวอก ม้าชนม้า)'
        ],
        manifestation: {
          positive: 'กระตุ้นปฏิภาณไหวพริบ ความเด็ดขาด ความสามารถเชิงการค้า หากน้ำหยิ่มแฝงทำงาน จะช่วยให้มีความลื่นไหล ปัญญาเฉียบคม และเจรจาธุรกิจสำเร็จ',
          negative: 'หากถูกปะทะโดยราศีขาล จะเกิดความขัดแย้งรุนแรง การเปลี่ยนงาน ย้ายถิ่นฐานกะทันหัน การผ่าตัด หรืออุบัติเหตุจากยานพาหนะ',
          health: 'ปอด ลำไส้ใหญ่ กระดูก ข้อต่อ ทางเดินหายใจ และเส้นเสียง'
        }
      }
    },

    '酉': {
      index: 10,
      branchZh: '酉',
      branchTh: 'อิ้ว (โหย่ว)',
      animalZh: '鸡',
      animalTh: 'ระกา (ไก่)',
      natureTh: 'ทองหยิน (แกนกลางฤดูใบไม้ร่วง)',
      elementZh: '金',
      elementTh: 'ธาตุทอง',
      category: 'PEACH_BLOSSOM',
      categoryTh: 'ดาวเสน่ห์ (แกนกลางฤดู - 旺)',
      seasonContext: {
        chineseMonth: 'เดือน 8 จีน (อิ้วง้วย - 酉月)',
        solarTerm: 'ช่วงสารทไป๋ลู่ (白露 - น้ำค้างขาว) ถึง ชิวเฟิน (秋分 - ศารทวิษุวัต)',
        natureDescription: 'แกนกลางฤดูใบไม้ร่วง โลหะมีค่าที่ผ่านการเจียระไนอย่างประณีต เป็นดาวเสน่ห์ (ท้อฮวย)'
      },
      hiddenStems: [
        {
          stemZh: '辛',
          stemTh: 'ซิง (ทองหยิน)',
          elementZh: '金',
          elementTh: 'ธาตุทอง',
          roleZh: '本气',
          roleTh: 'พลังหลัก (เปิ่นชี่)',
          days: 30,
          percentage: 100,
          description: 'ครองอำนาจเต็ม 30 วันของสารทเดือน ทองรูปพรรณ เพชรนิลจินดา ปิ่นทอง'
        }
      ],
      activationConditions: {
        triggers: [
          'มีทองซิง (辛) หรือทองแก (庚) ปรากฏบนฟ้า (透干)',
          'ร่วมกลุ่มไตรภาคีทอง (巳-酉-丑 ซาฮะทอง)',
          'เข้ากลุ่มทวิภาคี (辰-酉 ลักฮะทอง)',
          'ถูกชงปะทะโดยราศีเถาะ (卯-酉 冲 เถาะชงระกา)'
        ],
        manifestation: {
          positive: 'ส่งเสริมความมีระเบียบวินัย ความสง่างาม รสนิยมสูง วาจาที่เฉียบคมและน่าเชื่อถือ หากทองให้คุณจะช่วยหนุนนำเกียรติยศชื่อเสียง ได้รับรางวัลหรือการยกย่อง',
          negative: 'หากถูกชงหรือให้โทษ จะกลายเป็นคนช่างติ พูดจาเชือดเฉือนทำร้ายจิตใจผู้อื่น มีข้อพิพาทวิวาทะ และอาจเจ็บตัวจากของมีคม',
          health: 'ระบบทางเดินหายใจ ปอด จมูก เส้นเสียง ผิวหนัง และภูมิแพ้'
        }
      }
    },

    '戌': {
      index: 11,
      branchZh: '戌',
      branchTh: 'สุก (ซวี)',
      animalZh: '狗',
      animalTh: 'จอ (สุนัข)',
      natureTh: 'ดินหยางแห้ง / คลังไฟ (ปลายฤดูใบไม้ร่วง)',
      elementZh: '土',
      elementTh: 'ธาตุดิน (ดินแห้งเตาหลอม)',
      category: 'TOMB_STORAGE',
      categoryTh: 'สุสาน/คลังธาตุ (ปลายฤดู - 墓)',
      seasonContext: {
        chineseMonth: 'เดือน 9 จีน (สุกง้วย - 戌月)',
        solarTerm: 'ช่วงสารทหานลู่ (寒露 - น้ำค้างเย็น) ถึง ซวงเจี้ยง (霜降 - น้ำค้างแข็งตก)',
        natureDescription: 'ปลายฤดูใบไม้ร่วงเปลี่ยนผ่านสู่ฤดูหนาว ดินแห้งที่มีไอความร้อนดั่งเตาเผา เป็นสุสาน/คลังธาตุไฟ (火库)'
      },
      hiddenStems: [
        {
          stemZh: '辛',
          stemTh: 'ซิง (ทองหยิน)',
          elementZh: '金',
          elementTh: 'ธาตุทอง',
          roleZh: '余气',
          roleTh: 'พลังเศษตกค้าง (หวี่ชี่)',
          days: 9,
          percentage: 30,
          description: 'เศษตกค้างจากฤดูใบไม้ร่วง ครองอำนาจ 9 วันแรก'
        },
        {
          stemZh: '丁',
          stemTh: 'เต็ง (ไฟหยิน)',
          elementZh: '火',
          elementTh: 'ธาตุไฟ',
          roleZh: '中气 / 库气',
          roleTh: 'พลังคลังธาตุ (จงชี่ / ขู่ชี่)',
          days: 3,
          percentage: 10,
          description: 'พลังคลังธาตุไฟที่ถูกกักเก็บ ครองอำนาจ 3 วันถัดมา'
        },
        {
          stemZh: '戊',
          stemTh: 'โบ่ว (ดินหยาง)',
          elementZh: '土',
          elementTh: 'ธาตุดิน',
          roleZh: '本气',
          roleTh: 'พลังหลัก (เปิ่นชี่)',
          days: 18,
          percentage: 60,
          description: 'พลังหลักของราศี ดินภูเขา ดินเตาเผา ครองอำนาจ 18 วันสุดท้าย'
        }
      ],
      activationConditions: {
        triggers: [
          'มี 戊, 辛, 丁 ปรากฏบนฟ้า (透干)',
          'ถูก "ชงเปิดคลัง" โดยราศีมะโรง (辰-戌 冲 มะโรงชงจอ)',
          'ร่วมขบวนไตรภาคีไฟ (寅-午-戌 ซาฮะไฟ)',
          'เข้ากลุ่มทวิภาคี (卯-戌 ลักฮะไฟ)'
        ],
        manifestation: {
          positive: 'การชงเปิดคลังไฟจะทำให้พลังไฟและทองปะทุออกมา หากไฟเป็นธาตุให้คุณ จะช่วยปลุกพลังชีวิต ความกระตือรือร้น นำมาซึ่งชื่อเสียง ความก้าวหน้าอย่างรวดเร็ว',
          negative: 'หากไฟให้โทษ ดินแห้งจะดูดซับน้ำจนเหือดแห้ง ส่งผลให้เกิดความเครียดจัด อารมณ์รุนแรง วิตกจริต และอาจสูญเสียทรัพย์เพราะความใจร้อน',
          health: 'กระเพาะอาหาร ระบบเลือด หัวใจ สายตา ผิวหนังแห้งกร้าน และอาการนอนไม่หลับ'
        }
      }
    },

    '亥': {
      index: 12,
      branchZh: '亥',
      branchTh: 'ไห (ไฮ่)',
      animalZh: '猪',
      animalTh: 'กุน (หมู)',
      natureTh: 'น้ำหยาง (ต้นฤดูหนาว)',
      elementZh: '水',
      elementTh: 'ธาตุน้ำ',
      category: 'TRAVEL_HORSE',
      categoryTh: 'ม้าเดินทาง (ต้นฤดู - 生)',
      seasonContext: {
        chineseMonth: 'เดือน 10 จีน (ไหง้วย - 亥月)',
        solarTerm: 'ช่วงสารทลี่ตง (立冬 - เริ่มฤดูหนาว) ถึง เสี่ยวเสวี่ย (小雪 - หิมะตกน้อย)',
        natureDescription: 'ต้นฤดูหนาว แม่น้ำสายใหญ่ในค่ำคืน เป็นจุดกำเนิดธาตุไม้ (木的长生) และเป็นดาวม้าเดินทาง (เอี๊ยะเบ๊)'
      },
      hiddenStems: [
        {
          stemZh: '甲',
          stemTh: 'กะ (ไม้หยาง)',
          elementZh: '木',
          elementTh: 'ธาตุไม้',
          roleZh: '中气',
          roleTh: 'พลังก่อกำเนิด (จงชี่ / ฉางเซิง)',
          days: 7,
          percentage: 23.3,
          description: 'จุดกำเนิดธาตุไม้ พืชพันธุ์ที่รอแตกยอด ครองอำนาจ 7 วันแรก'
        },
        {
          stemZh: '壬',
          stemTh: 'หยิ่ม (น้ำหยาง)',
          elementZh: '水',
          elementTh: 'ธาตุน้ำ',
          roleZh: '本气',
          roleTh: 'พลังหลัก (เปิ่นชี่)',
          days: 23,
          percentage: 76.7,
          description: 'พลังหลักของราศี น้ำมหาสมุทร แม่น้ำใหญ่ ครองอำนาจ 23 วันสุดท้าย'
        }
      ],
      activationConditions: {
        triggers: [
          'มี 壬, 甲 ปรากฏบนฟ้า (透干)',
          'ร่วมขบวนไตรภาคีไม้ (亥-卯-未 ซาฮะไม้)',
          'เข้ากลุ่มทวิภาคี (寅-亥 ลักฮะไม้)',
          'ถูกชงปะทะโดยราศีมะเส็ง (巳-亥 冲 มะเส็งชงกุน ม้าชนม้า)'
        ],
        manifestation: {
          positive: 'เสริมสร้างวิสัยทัศน์กว้างไกล สติปัญญาบริสุทธิ์ ความโอบอ้อมอารี หากไม้กะแฝงทำงาน จะช่วยให้เกิดความคิดสร้างสรรค์ การเรียนรู้ และการต่อยอดกิจการที่มั่นคง',
          negative: 'หากถูกราศีมะเส็งเข้าชง จะเกิดการเคลื่อนไหวเปลี่ยนแปลง ความไม่สงบในจิตใจ ข้อขัดแย้งเกี่ยวกับผลประโยชน์อย่างกะทันหัน หรือต้องพลัดพรากจากถิ่นฐาน',
          health: 'ระบบไต กระเพาะปัสสาวะ เท้า ข้อเท้า และระบบไหลเวียนโลหิต'
        }
      }
    }
  };

  return {
    metadata: LINEAGE_METADATA,
    categories: BRANCH_CATEGORIES,
    branches: BRANCHES,

    /**
     * ดึงข้อมูลราศีแฝงและสภาวะออกกระทำการของกิ่งดิน
     */
    getBranch: function (charOrName) {
      if (!charOrName) return null;
      if (BRANCHES[charOrName]) return BRANCHES[charOrName];
      for (const k of Object.keys(BRANCHES)) {
        const item = BRANCHES[k];
        if (item.branchTh.includes(charOrName) || item.animalTh.includes(charOrName)) {
          return item;
        }
      }
      return null;
    },

    /**
     * ดึงราศีตามหมวดหมู่ (TRAVEL_HORSE, PEACH_BLOSSOM, TOMB_STORAGE)
     */
    getBranchesByCategory: function (categoryKey) {
      return Object.values(BRANCHES).filter(b => b.category === categoryKey);
    },

    getAllBranches: function () {
      return Object.values(BRANCHES);
    },

    /**
     * วิเคราะห์สภาวะการออกกระทำการของราศีแฝงในผังดวง (ตรวจว่าราศีแฝงตัวใดลอยเด่น 透干 หรือถูกชง/ภาคี)
     * @param {Object} chart - ผังดวงที่มี chart.pillars (year, month, day, hour)
     */
    analyzeChartHiddenStems: function (chart) {
      if (!chart || !chart.pillars) return null;

      const stemChars = [];
      const branchChars = [];

      ['year', 'month', 'day', 'hour'].forEach(pKey => {
        const p = chart.pillars[pKey];
        if (p && p.stem && p.stem.zh) stemChars.push({ pillarRole: pKey, stemZh: p.stem.zh });
        if (p && p.branch && p.branch.zh) branchChars.push({ pillarRole: pKey, branchZh: p.branch.zh });
      });

      const clashPairs = [
        ['子', '午'], ['丑', '未'], ['寅', '申'],
        ['卯', '酉'], ['辰', '戌'], ['巳', '亥']
      ];

      const results = [];

      branchChars.forEach(bItem => {
        const branchInfo = BRANCHES[bItem.branchZh];
        if (!branchInfo) return;

        const pLabel = chart.pillars[bItem.pillarRole].label || bItem.pillarRole;
        const activatedStems = [];

        branchInfo.hiddenStems.forEach(hs => {
          // ตรวจสอบการลอยเด่นบนราศีบน (透干 - โท่วกาน)
          const revealedMatches = stemChars.filter(s => s.stemZh === hs.stemZh);
          if (revealedMatches.length > 0) {
            activatedStems.push({
              hiddenStem: hs,
              state: '透干 (ลอยเด่นบนฟ้า)',
              description: `ราศีแฝง ${hs.stemZh} (${hs.roleTh}) ลอยเด่นปรากฏที่ ${revealedMatches.map(m => chart.pillars[m.pillarRole].label).join(', ')} ส่งผลให้พลังออกกระทำการได้เต็มกำลัง`,
              revealedPillars: revealedMatches.map(m => m.pillarRole)
            });
          }
        });

        // ตรวจสอบการถูกชง (相冲)
        const clashingBranches = [];
        branchChars.forEach(otherB => {
          if (otherB.pillarRole === bItem.pillarRole) return;
          const isClash = clashPairs.some(cp => 
            (cp[0] === bItem.branchZh && cp[1] === otherB.branchZh) ||
            (cp[1] === bItem.branchZh && cp[0] === otherB.branchZh)
          );
          if (isClash) {
            clashingBranches.push({
              otherRole: otherB.pillarRole,
              otherBranch: otherB.branchZh,
              otherLabel: chart.pillars[otherB.pillarRole].label
            });
          }
        });

        const isTomb = branchInfo.category === 'TOMB_STORAGE';
        const isClashed = clashingBranches.length > 0;

        results.push({
          pillarRole: bItem.pillarRole,
          pillarLabel: pLabel,
          branchZh: bItem.branchZh,
          branchInfo: branchInfo,
          activatedStems: activatedStems,
          isClashed: isClashed,
          clashingBranches: clashingBranches,
          isTombOpen: isTomb && isClashed,
          summary: `${pLabel} (${bItem.branchZh} - ${branchInfo.animalTh}): ` +
            (activatedStems.length > 0 ? `พบราศีแฝงลอยเด่น [${activatedStems.map(a => a.hiddenStem.stemZh).join(', ')}]. ` : 'ราศีแฝงสงบนิ่งอยู่ใต้ดิน. ') +
            (isTomb && isClashed ? `ถูกชงเปิดคลังโดย ${clashingBranches.map(c => c.otherLabel).join(', ')}! ` : (isClashed ? `ถูกชงโดย ${clashingBranches.map(c => c.otherLabel).join(', ')}. ` : ''))
        });
      });

      return {
        lineage: LINEAGE_METADATA.schoolNameThai,
        analyzedPillars: results,
        overallCount: results.length
      };
    }
  };
})();

if (typeof window !== 'undefined') window.BaziHiddenStemsDB = BaziHiddenStemsDB;
if (typeof globalThis !== 'undefined') globalThis.BaziHiddenStemsDB = BaziHiddenStemsDB;
if (typeof module !== 'undefined' && module.exports) module.exports = BaziHiddenStemsDB;
