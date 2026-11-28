/**
 * Bazi Shen Sha (Stars) Knowledge Database (ฐานข้อมูลซิ้งสัวะ ดวงดาว และเทพอสูร)
 * อ้างอิงจากคลังตำราวิชาการ:
 * - "ซิ้งสัวะ โดยอาจารย์นันทนา.pdf"
 * - "ดาวข่วยกัง.pdf"
 * - "เทพอสูร หมั่งไพ่.pdf"
 */

var BaziStarsDB = (function () {
  'use strict';

  const SHEN_SHA_CATALOG = {
    '天乙贵人': {
      code: 'TYGR',
      nameThai: 'เทียนอิกกุ้ยนั้ง (เทพผู้อุปถัมภ์สูงสุด)',
      hanzi: '天乙贵人',
      pinyin: 'Tian Yi Gui Ren',
      type: 'Auspicious (เทพมงคลชั้นหนึ่ง)',
      description: 'ยอดแห่งเทพมงคลทั้งปวง บ่งบอกถึงการมีผู้ใหญ่คอยเกื้อหนุน เมตตาช่วยเหลือในยามคับขัน เปลี่ยนร้ายกลายเป็นดี แคล้วคลาดจากภัยพิบัติ',
      manifestation: {
        career: 'ได้รับการโปรโมต สนับสนุนจากหัวหน้าและผู้บริหาร มีโอกาสเข้าหาผู้มีอำนาจหรือบุคคลชั้นสูงได้ง่าย',
        wealth: 'มีคนชี้ช่องทางทำมาหากิน ยามขัดสนจะมีคนยื่นมือเข้าช่วย',
        relationship: 'คู่ครองมีฐานะหรือเกียรติยศ ช่วยส่งเสริมความเจริญรุ่งเรืองให้ครอบครัว',
        caution: 'หากกุ้ยนั้งถูกชง เฮ้ง หรือตกคงบ้วง (ความว่างเปล่า) พลังการอุปถัมภ์จะลดทอนลง ต้องพึ่งพาตนเองเป็นหลัก'
      }
    },
    '魁罡': {
      code: 'KG',
      nameThai: 'ดาวข่วยกัง (ยอดขุนศึกผู้ทรงอำนาจ)',
      hanzi: '魁罡',
      pinyin: 'Kui Gang',
      type: 'Special / Power Star (ดาวพิเศษแห่งอำนาจบารมี)',
      pillars: ['壬辰', '庚辰', '庚戌', '戊戌'],
      originNote: 'มาจากกลุ่มดาวกระบวยใหญ่ (ดาวข่วย และดาวเทียนกัง) บนท้องฟ้า บ่งบอกถึงดวงชะตาของผู้ที่ไม่เกรงกลัวต่อสิ่งศักดิ์สิทธิ์หรือภูตผี ตรงไปตรงมา เด็ดขาด กล้าหาญ ไม่ยอมคน',
      deepAnalysis: {
        '壬辰': {
          name: 'หยิ่มซิ้ง (สายน้ำอันยาวไกล)',
          pillar: '壬辰 (Ren Chen)',
          nature: 'ฉลาดหลักแหลม มีปฏิภาณไหวพริบ นั่งบนคลังน้ำและมีดินซิ้ง (ฉิกสัวะ) คอยเป็นเขื่อนกั้นน้ำ ทำให้น้ำไหลมีทิศทางชัดเจน มีภาวะผู้นำ กล้าได้กล้าเสีย เหมาะกับนักบริหาร นักปกครอง หรือผู้พิพากษา'
        },
        '庚辰': {
          name: 'แกซิ้ง (ทองนั่งบนมังกรน้ำ)',
          pillar: '庚辰 (Geng Chen)',
          nature: 'ทองนั่งบนธาตุกำเนิด จิตใจเข้มแข็ง มุ่งมั่น จริงจัง ยึดมั่นในความยุติธรรม พูดคำไหนคำนั้น มีบารมีและสามารถควบคุมคนหมู่มากได้'
        },
        '庚戌': {
          name: 'แกสุก (ทองนั่งบนเตาไฟหลอม)',
          pillar: '庚戌 (Geng Xu)',
          nature: 'เด็ดเดี่ยว แข็งแกร่ง อดทนสูงมาก ไม่กลัวความยากลำบาก มีจิตวิญญาณแห่งนักรบ ทหาร ตำรวจ หรือผู้สร้างธุรกิจจากศูนย์'
        },
        '戊戌': {
          name: 'โบ่วสุก (ขุนเขาอันสง่างามและหนักแน่น)',
          pillar: '戊戌 (Wu Xu)',
          nature: 'ดินซ้อนดิน หนักแน่นเหมือนขุนเขา รักศักดิ์ศรี ตรงไปตรงมา ไม่ประจบสอพลอใคร มีความรับผิดชอบและศีลธรรมสูง'
        }
      },
      careerImplications: 'เป็นผู้นำ เจ้าของกิจการ ผู้บริหารระดับสูง นายพล ทหาร ตำรวจ ผู้พิพากษา อัยการ งานที่ต้องตัดสินใจเด็ดขาดและต้องแบกรับความรับผิดชอบสูง',
      marriageImplications: {
        male: 'ชายข่วยกัง: มักมีบุคลิกเผด็จการ ไม่ค่อยยอมรับฟังภรรยา ภรรยาอาจมีปัญหาสุขภาพหรือรู้สึกกดดัน ควรฝึกความอ่อนโยนและการประนีประนอม',
        female: 'หญิงข่วยกัง: เป็น "หญิงแกร่ง" มีความสามารถสูงกว่าผู้ชายทั่วไป หากแข็งกร้าวเกินไปสามีจะเกรงกลัวและเกิดความห่างเหิน ควรลดความดุดันในบ้านลง และปล่อยให้สามีได้เป็นผู้นำบ้าง',
        remedy: '30% กำหนดโดยฟ้า แต่ 70% ขึ้นอยู่กับการกระทำ คนที่มีดาวข่วยกังต้องฝึกความอ่อนโยน มีเมตตา รักษากฎระเบียบอย่างเคร่งครัด หลีกเลี่ยงเนื้อวัว/เนื้อสุนัข (ตามความเชื่อโบราณ) และไม่สร้างศัตรู'
      },
      strictTaboos: 'ห้ามถูก 辰-戌 ชง (ซิ้งชงสุก) หรือเจอ 丑-未-戌 ซาเฮ้ง (โทษทัณฑ์ 3 ประการ) ในดวง เพราะจะทำให้เกิดคดีความ อุบัติเหตุ หรือวิกฤติต่างๆ ได้ง่าย'
    },
    '驿马': {
      code: 'YM',
      nameThai: 'เอี๊ยะเบ้ (ม้าสถานี / ดาวการเดินทาง)',
      hanzi: '驿马',
      pinyin: 'Yi Ma',
      type: 'Dynamic Star (ดาวแห่งการเคลื่อนไหว)',
      description: 'สัญลักษณ์ของการเดินทาง การโยกย้าย การเปลี่ยนแปลง และความก้าวหน้าในแดนไกล',
      manifestation: {
        traits: 'ไม่อยู่นิ่ง ชอบการเดินทาง กระตือรือร้น ปรับตัวเก่ง มีโอกาสไปศึกษาต่อ ทำงาน หรือย้ายถิ่นฐานไปต่างแดน',
        combinations: [
          'เอี๊ยะเบ้ + ดาวอิ่ง (印): ได้เดินทางไปศึกษาต่อต่างประเทศ หรือทำงานด้านวิชาการข้ามแดน',
          'เอี๊ยะเบ้ + ดาวไช้ (财): ค้าขายระหว่างประเทศ การค้าทางไกล หรือได้คู่ครองเป็นชาวต่างชาติต่างภาษา',
          'เอี๊ยะเบ้ + ดาวกัวสัวะ (官/杀): ได้รับมอบหมายงานราชการหรือตำแหน่งงานสำคัญในต่างแดน',
          'เอี๊ยะเบ้ถูกชง (เช่น 寅 ชง 申): การเดินทางบ่อยแต่เหน็ดเหนื่อย อุบัติเหตุจากการเดินทาง หรือย้ายที่อยู่อาศัยกะทันหัน'
        ]
      }
    },
    '桃花': {
      code: 'TH',
      nameThai: 'ท้อฮวย (ดาวดอกท้อ / เสน่ห์เมตตา)',
      hanzi: '桃花',
      pinyin: 'Tao Hua',
      type: 'Charm Star (ดาวแห่งความมีเสน่ห์)',
      description: 'ดาวแห่งเสน่ห์ รูปลักษณ์ ความดึงดูดใจ และความสัมพันธ์อันโรแมนติก',
      manifestation: {
        positive: 'มีเสน่ห์ต่อคนรอบข้าง พูดจาน่าฟัง มีรสนิยมดี เหมาะกับงานแสดง ศิลปิน แฟชั่น การบริการ และงานที่ต้องพบปะผู้คน',
        negative: 'หากท้อฮวยมีมากเกินไปหรือไปร่วมกับดาวร้าย (เถาฮวาซา) จะทำให้เกิดเรื่องรักซ้อน มือที่สาม การนอกใจ หรือเสียทรัพย์เพราะความลุ่มหลง',
        marriage: 'ถ้าสถิตในเสาวัน (เรือนคู่ครอง) คู่ครองจะมีรูปร่างหน้าตาดี มีเสน่ห์ แต่ต้องระวังปัญหาคนอื่นเข้ามาพัวพัน'
      }
    },
    '羊刃': {
      code: 'YR',
      nameThai: 'เอี่ยยิ่ม (ดาวมีดดาบ / พลังรุนแรง)',
      hanzi: '羊刃',
      pinyin: 'Yang Ren',
      type: 'Violent / Blade Star (ดาวพลังดาบและความเด็ดขาด)',
      description: 'จุดสูงสุดของพลังธาตุ เปรียบเสมือนดาบที่มีความคมกล้า บ่งบอกถึงความกล้าหาญ เด็ดเดี่ยว ไม่ยอมแพ้ แต่ก็เสี่ยงต่อการผ่าตัด อุบัติเหตุ หรืออารมณ์ฉุนเฉียว',
      manifestation: {
        career: 'ดีเยี่ยมสำหรับทหาร ตำรวจ ศัลยแพทย์ นักกีฬา หรือผู้บุกเบิกตลาดที่มีการแข่งขันดุเดือด',
        health: 'ระวังการผ่าตัด เลือดตกยางออก หรืออุบัติเหตุจากของมีคม โดยเฉพาะเมื่อปีจรมาชงเข้าเสาเอี่ยยิ่ม',
        temper: 'ใจร้อน ดุดัน ตัดสินใจเร็ว ไม่กลัวตาย แต่ต้องระวังการตัดสินใจผิดพลาดเพราะความใจร้อน'
      }
    },
    '文昌贵人': {
      code: 'WC',
      nameThai: 'บุ๋นเชียง (ดาวปัญญาและนักปราชญ์)',
      hanzi: '文昌贵人',
      pinyin: 'Wen Chang Gui Ren',
      type: 'Academic Star (ดาวแห่งการศึกษาและวิชาการ)',
      description: 'เทพแห่งการศึกษา ปัญญา และการสอบแข่งขัน ผู้ที่มีดาวนี้จะมีสติปัญญาเฉียบแหลม เรียนรู้เร็ว ชอบการอ่านและการค้นคว้า',
      manifestation: {
        education: 'สอบแข่งขันได้คะแนนดี มีผลงานทางวิชาการโดดเด่น จบการศึกษาระดับสูง',
        career: 'นักเขียน อาจารย์ นักวิจัย นักปรัชญา ที่ปรึกษาผู้เชี่ยวชาญ',
        traits: 'มีรสนิยมสูง สุภาพ อ่อนน้อม เป็นที่นับถือของคนในสังคม'
      }
    },
    '华盖': {
      code: 'HG',
      nameThai: 'ฮั่วไก่ (ดาวฉัตรทอง / ศิลปะและสมาธิ)',
      hanzi: '华盖',
      pinyin: 'Hua Gai',
      type: 'Spiritual Star (ดาวแห่งจิตวิญญาณและสันโดษ)',
      description: 'เปรียบเสมือนฉัตรทองคุ้มครองจักรพรรดิ บ่งบอกถึงพรสวรรค์ด้านศิลปะ ปรัชญา โหราศาสตร์ ความคิดลึกซึ้ง และความรักในความเงียบสงบ',
      manifestation: {
        traits: 'รักสันโดษ มีโลกส่วนตัวสูง สนใจธรรมะ ปรัชญา ศาสตร์ลี้ลับ หรือศิลปะชั้นสูง',
        career: 'ศิลปิน นักบวช ผู้เชี่ยวชาญด้านจิตวิญญาณ หมอดู นักประพันธ์',
        relationship: 'มักชอบอยู่คนเดียว บางครั้งอาจแต่งงานช้าหรือไม่ชอบความผูกพันที่วุ่นวาย'
      }
    },
    '天德贵人': {
      code: 'TD',
      nameThai: 'เทียนเต็กกุ้ยนั้ง (คุณธรรมฟ้า)',
      hanzi: '天德贵人',
      pinyin: 'Tian De Gui Ren',
      type: 'Benevolent Star (ดาวคุณธรรมปัดเป่าภัย)',
      description: 'ดาวแห่งคุณธรรมและพรจากสวรรค์ ช่วยคุ้มครองให้พ้นจากคดีความ โจรผู้ร้าย และอุบัติเหตุร้ายแรง'
    },
    '月德贵人': {
      code: 'YD',
      nameThai: 'ง้วยเต็กกุ้ยนั้ง (คุณธรรมจันทร์/ดิน)',
      hanzi: '月德贵人',
      pinyin: 'Yue De Gui Ren',
      type: 'Benevolent Star (ดาวคุณธรรมปัดเป่าภัย)',
      description: 'ดาวแห่งความเมตตาและเสน่ห์ทางศีลธรรม มีเสน่ห์ที่ผู้คนรักใคร่เอ็นดู ทำสิ่งใดก็มักจะราบรื่น'
    },
    '金舆': {
      code: 'JY',
      nameThai: 'กิมอื้อ (ดาวรถม้าทองคำ)',
      hanzi: '金舆',
      pinyin: 'Jin Yu',
      type: 'Wealth & Luxury Star (ดาวแห่งความสะดวกสบาย)',
      description: 'สัญลักษณ์ของยานพาหนะหรูหรา ความสะดวกสบาย และชีวิตความเป็นอยู่ที่ดี มักได้คู่ครองที่ช่วยเสริมฐานะ'
    },
    '三奇贵人': {
      code: 'SQ',
      nameThai: 'ซำคี้กุ้ยนั้ง (สามอัจฉริยะแดนสวรรค์)',
      hanzi: '三奇贵人',
      pinyin: 'San Qi Gui Ren',
      type: 'Rare Noble Star (ดาวอัจฉริยะพิเศษ 3 ประการ)',
      types: {
        heaven: { stems: ['甲', '戊', '庚'], name: 'ซำคี้ฟ้า (Heavenly Wonder)' },
        earth: { stems: ['乙', '丙', '丁'], name: 'ซำคี้ดิน (Earthly Wonder)' },
        man: { stems: ['壬', '癸', '辛'], name: 'ซำคี้คน (Human Wonder)' }
      },
      description: 'ผู้ที่มีซำคี้ในดวงชะตาจะเป็นคนที่มีสติปัญญาพิเศษ มีความคิดแหวกแนว มีพรสวรรค์เฉพาะทางที่คนทั่วไปเลียนแบบไม่ได้ และมักประสบความสำเร็จอย่างยิ่งใหญ่ครั้งหนึ่งในชีวิต'
    },
        '禄神': {
      code: 'LS',
      nameThai: 'ลกซิ้ง (ดาวโภคทรัพย์ / ลาภยศมั่นคง)',
      hanzi: '禄神',
      pinyin: 'Lu Shen',
      type: 'Prosperity Star (ดาวแห่งความมั่งคั่ง)',
      description: 'ตำแหน่งเจี่ยคี่ (Coming of Age / 临官) ของดิถี บ่งบอกถึงความมั่งคั่ง ลาภผลมั่นคง มีกินมีใช้ พึ่งพาความสามารถตนเองสำเร็จ มีเกียรติยศและตำแหน่งหน้าที่การงาน'
    },
    '将星': {
      code: 'JX',
      nameThai: 'เจียงซิ้ง (ดาวขุนพล / แม่ทัพผู้มีอำนาจ)',
      hanzi: '将星',
      pinyin: 'Jiang Xing',
      type: 'Authority Star (ดาวแห่งอำนาจบารมี)',
      description: 'จุดกึ่งกลางกำลังสูงสุดของกลุ่มไตรภาคี บ่งบอกถึงภาวะผู้นำ การบังคับบัญชา ความสามารถในการตัดสินใจเด็ดขาด และการคุมคนหมู่มาก'
    },
    '飞刃': {
      code: 'FR',
      nameThai: 'ปวยยิ่ม (ดาวมีดบิน / อารมณ์ฉับพลัน)',
      hanzi: '飞刃',
      pinyin: 'Fei Ren',
      type: 'Obstacle Star (ดาวแห่งการระวังของมีคม)',
      description: 'กิ่งดินที่ชง (ปะทะ) กับตำแหน่งเอี่ยยิ่ม บ่งบอกถึงความใจร้อน กะทันหัน ควรระวังอุบัติเหตุจากการเร่งรีบ หรือของมีคม'
    },
    '红艳桃花': {
      code: 'HY',
      nameThai: 'อั้งเอี้ยม (ดาวเสน่ห์โรแมนติก / ดอกท้อสีชาด)',
      hanzi: '红艳桃花',
      pinyin: 'Hong Yan Sha',
      type: 'Romantic Charm Star (ดาวเสน่ห์ดึงดูดใจ)',
      description: 'ดาวเสน่ห์เมตตาลึกซึ้ง ดึงดูดเพศตรงข้าม มีรสนิยมทางศิลปะ มีแรงดึงดูดใจเป็นพิเศษ มีความโรแมนติกสูง'
    },
    '太极': {
      code: 'TJ',
      nameThai: 'ไท้เก๊กกุ้ยนั้ง (เทพไท้เก๊ก / ปัญญาญาณสวรรค์)',
      hanzi: '太极贵人',
      pinyin: 'Tai Ji',
      type: 'Wisdom & Spiritual Star (ดาวแห่งญาณหยั่งรู้)',
      description: 'ดาวแห่งปัญญาญาณ สนใจปรัชญา โหราศาสตร์ และศาสตร์เร้นลับ มีเซนส์แม่นยำ ได้รับการคุ้มครองจากสิ่งศักดิ์สิทธิ์'
    },
    '天厨': {
      code: 'TC',
      nameThai: 'เทียนชู้กุ้ยนั้ง (ดาวครัวสวรรค์ / อุดมสมบูรณ์)',
      hanzi: '天厨贵人',
      pinyin: 'Tian Chu',
      type: 'Abundance Star (ดาวแห่งความอุดมสมบูรณ์)',
      description: 'ดาวแห่งความอุดมสมบูรณ์ มีวาสนาด้านอาหารการกิน เดินทางไปที่ใดไม่อดอยาก มีคนคอยเลี้ยงดูต้อนรับขับสู้'
    },
    '福星': {
      code: 'FX',
      nameThai: 'ฮกซิ้งกุ้ยนั้ง (ดาวโชควาสนา / ร่มเย็นเป็นสุข)',
      hanzi: '福星贵人',
      pinyin: 'Fu Xing',
      type: 'Fortune Star (ดาวแห่งโชคลาภความสงบสุข)',
      description: 'ดาวแห่งความร่มเย็นเป็นสุข ปลอดภัยจากภัยพิบัติ มีชีวิตที่ราบรื่นและมีผู้ใหญ่อุปถัมภ์ค้ำชูเสมอ'
    },
    '学堂': {
      code: 'XT',
      nameThai: 'ฮักตึ้ง (ดาวคลังปัญญาและการศึกษา)',
      hanzi: '学堂',
      pinyin: 'Xue Tang',
      type: 'Academic Star (ดาวแห่งการเรียนรู้)',
      description: 'ตำแหน่งเกิด (Birth / 长生) ของธาตุดิถี บ่งบอกถึงการเรียนรู้ไว จดจำแม่นยำ มีไหวพริบ และมีความสามารถในการถ่ายทอดวิชาการ'
    },
    '流霞': {
      code: 'LX',
      nameThai: 'หลิวเสีย (ดาวเมฆโลหิต / เฝ้าระวังสุขภาพ)',
      hanzi: '流霞',
      pinyin: 'Liu Xia',
      type: 'Health Warning Star (ดาวเฝ้าระวังสุขภาพ)',
      description: 'ดาวที่ต้องเฝ้าระวังเรื่องระบบโลหิต การเสียเลือด หรือการผ่าตัด ควรบริจาคเลือดเป็นประจำทุก 3-6 เดือนเพื่อแก้เคล็ด'
    },
    '节度': {
      code: 'JD',
      nameThai: 'เจียะโตวกุ้ยนั้ง (ดาวผู้ว่าการ / ข้าราชการชั้นผู้ใหญ่)',
      hanzi: '节度贵人',
      pinyin: 'Jie Du',
      type: 'Official Rank Star (ดาวแห่งยศศักดิ์)',
      description: 'ดาวแห่งตำแหน่งหน้าที่การงาน ได้รับความไว้วางใจให้คุมกำลังหรือดูแลหน่วยงาน มีเกียรติยศและคนนับถือ'
    },
    '孤辰': {
      code: 'GC',
      nameThai: 'โกวซิ้ง (กูเฉิน 孤辰 - ดาวพ่อหม้าย / สันโดษหลอมปัญญาบารมีธรรม)',
      hanzi: '孤辰',
      pinyin: 'Gu Chen',
      type: 'Solitary / Sagely Star (ดาวแห่งความสันโดษและบารมีปัญญา)',
      description: 'พลังหยางพุ่งเลยขอบเขตฤดูกาลไป 1 ก้าว สื่อถึงความรักอิสระ สันโดษสูงส่ง หากนับอิมเหือดแห้งระวังไร้คู่ครอง แต่หากพบนับอิมปัญญาหรือดาวกุ้ยเหริน/ฮั่วไก้ จะกลายเป็นเกณฑ์ "เสินเซียนเจียกั้ว" (神仙结托) มหาปราชญ์ นักพรต หรือเกจิอาจารย์ (อ้างอิงตำราสำนักเฮียงเหล่งตึ้ง)'
    },
    '寡宿': {
      code: 'GS',
      nameThai: 'กั่วยิ้ง (กวาซู่ 寡宿 - ดาวแม่หม้าย / โลกส่วนตัวและสมาธิลึกซึ้ง)',
      hanzi: '寡宿',
      pinyin: 'Gua Su',
      type: 'Solitary / Internal Focus Star (ดาวแห่งโลกส่วนตัวและฌานสมาธิ)',
      description: 'พลังหยินถอยหลังตัดขาดจากฤดูกาลไป 1 ก้าว สื่อถึงโลกส่วนตัวสูง คิดลึกซึ้ง ชอบทำงานคนเดียว หากนับอิมแห้งแล้งระวังการครองตัวเป็นหม้ายหรือมีคู่เหมือนไม่มี แต่หากมีนับอิมน้ำหล่อเลี้ยงจะเกิดพลังจิตตานุภาพ มีสมาธิลึกซึ้ง เป็นเลิศในการค้นคว้าวิจัย (อ้างอิงตำราสำนักเฮียงเหล่งตึ้ง)'
    },
    '五鬼': {
      code: 'WG',
      nameThai: 'โหงวกุ้ย (ดาวห้าผี / คลื่นใต้น้ำ)',
      hanzi: '五鬼',
      pinyin: 'Wu Gui',
      type: 'Dispute Warning Star (ดาวระวังความขัดแย้ง)',
      description: 'ดาวที่ต้องระวังการถูกแทงข้างหลัง การนินทาให้ร้าย หรือความเข้าใจผิดในแวดวงเพื่อนร่วมงาน ควรทำสิ่งใดด้วยความโปร่งใส'
    },
    '龙德': {
      code: 'LD',
      nameThai: 'หลงเต็ก (ดาวคุณธรรมมังกร / ผู้ใหญ่เกื้อหนุน)',
      hanzi: '龙德',
      pinyin: 'Long De',
      type: 'Mentor Star (ดาวครูบาอาจารย์และผู้ใหญ่)',
      description: 'ดาวผู้ใหญ่เมตตาเอ็นดู มีคนคอยชี้แนะ นำพาความเจริญก้าวหน้าในสายงาน แก้ไขปัญหาอุปสรรคให้คลี่คลาย'
    },
    '空亡': {
      code: 'KW',
      nameThai: 'คงบ้วง (ความว่างเปล่า / ช่องว่างแห่งฟ้าดิน)',
      hanzi: '空亡',
      pinyin: 'Kong Wang',
      type: 'Void Pillar (ความว่างเปล่า)',
      description: 'เมื่อกิ่งดินใดตกคงบ้วง พลังของดาวและสิบเทพในเสานั้นจะลดลงครึ่งหนึ่งหรือกลายเป็นความว่างเปล่า หากเป็นดาวร้ายก็จะลดโทษ หากเป็นดาวดีก็จะลดคุณประโยชน์ แต่จะส่งเสริมทางด้านจิตวิญญาณ ธรรมะ และการปฏิบัติสมาธิอย่างยิ่ง'
    },
    '红鸾': {
      code: 'HL',
      nameThai: 'หงหลวน (ดาววิวาห์มงคล / เสน่ห์คู่แท้)',
      hanzi: '红鸾',
      pinyin: 'Hong Luan',
      type: 'Marriage Star (ดาวแห่งความรักและการแต่งงาน)',
      description: 'ยอดดาวแห่งความรัก เสน่ห์เมตตามหานิยม การหมั้นหมาย และการแต่งงาน นำพาความสุขสดชื่นในชีวิตคู่และมิตรภาพที่ดีเลิศ'
    },
    '天喜': {
      code: 'TX',
      nameThai: 'เทียนฮี่ (ดาวสวรรค์เปี่ยมสุข / การเฉลิมฉลอง)',
      hanzi: '天喜',
      pinyin: 'Tian Xi',
      type: 'Joyous Star (ดาวแห่งความสุขและงานมงคล)',
      description: 'ดาวแห่งความรื่นเริง ข่าวดี การตั้งครรภ์ มีบุตรหลาน หรือการประสบความสำเร็จที่นำมาซึ่งงานเลี้ยงฉลองในครอบครัว'
    },
    '吊客': {
      code: 'DK',
      nameThai: 'เตี่ยวแขะ (ดาวแขกงานศพ / ระวังงานอวมงคล)',
      hanzi: '吊客',
      pinyin: 'Diao Ke',
      type: 'Warning Star (ดาวเฝ้าระวัง)',
      description: 'ดาวที่เตือนให้ระมัดระวังการไปร่วมงานศพหรือสถานที่อวมงคล หมั่นดูแลสุขภาพของญาติผู้ใหญ่ และทำบุญอุทิศส่วนกุศลเพื่อปัดเป่าพลังงานลบ'
    },
    '丧门': {
      code: 'SM',
      nameThai: 'ซึงมึ้ง (ดาวประตูงานศพ / การพลัดพราก)',
      hanzi: '丧门',
      pinyin: 'Sang Men',
      type: 'Warning Star (ดาวเฝ้าระวัง)',
      description: 'ดาวเตือนภัยเรื่องการสูญเสียหรือเจ็บป่วยของคนใกล้ชิด ควรหลีกเลี่ยงการไปเยี่ยมนักโทษหรือโรงพยาบาลในเวลาวิกาล และควรทำทานปล่อยสัตว์'
    },
    '天罗': {
      code: 'TL',
      nameThai: 'เทียนล้อ (ตาข่ายฟ้า / พันธนาการและบททดสอบ)',
      hanzi: '天罗',
      pinyin: 'Tian Luo',
      type: 'Obstacle Star (ดาวแห่งบททดสอบ)',
      description: 'บ่งบอกถึงช่วงเวลาที่มีกรอบข้อจำกัด กฎหมาย หรือสัญญาที่ต้องรอบคอบเป็นพิเศษ ต้องรักษาความซื่อสัตย์สุจริตแล้วจะผ่านพ้นได้อย่างราบรื่น'
    },
    '劫煞': {
      code: 'JS',
      nameThai: 'เกียบซัวะ (ดาวปล้นชิง / ความเสียหายกะทันหัน)',
      hanzi: '劫煞',
      pinyin: 'Jie Sha',
      type: 'Robbery Star (ดาวระวังทรัพย์สิน)',
      description: 'ดาวเตือนภัยเรื่องการถูกโจรกรรม การหลอกลวง หรือการตัดสินใจทางการเงินที่ใจร้อน ควรวางแผนการเงินอย่างรัดกุมและหลีกเลี่ยงการเก็งกำไรที่มีความเสี่ยงสูง'
    },
    '天官': {
      code: 'TG',
      nameThai: 'เทียนกวาน (ดาวขุนนางสวรรค์ / บารมีและอำนาจ)',
      hanzi: '天官',
      pinyin: 'Tian Guan',
      type: 'Official Star (ดาวเกียรติยศและตำแหน่ง)',
      description: 'ส่งเสริมด้านตำแหน่งหน้าที่การงาน การติดต่อประสานงานกับราชการหรือองค์กรใหญ่ ได้รับความนับถือและมีชื่อเสียงเกียรติยศ'
    },
    '天干桃花': {
      code: 'TGTH',
      nameThai: 'เถาฮวาฟ้า (ดาวเสน่ห์ก้านฟ้า / เสน่ห์สังคม)',
      hanzi: '天干桃花',
      pinyin: 'Tian Gan Tao Hua',
      type: 'Romance Star (ดาวเสน่ห์)',
      description: 'มีเสน่ห์ดึงดูดใจจากการเจรจา วาจาไพเราะ เป็นที่ต้องตาต้องใจของเพศตรงข้ามในวงสังคมและการทำงาน'
    },
    '岁破': {
      code: 'SP',
      nameThai: 'ส่วยผั่ว (ดาวปะทะปีจร / การเปลี่ยนแปลงครั้งใหญ่)',
      hanzi: '岁破',
      pinyin: 'Sui Po',
      type: 'Clash Star (ดาวแห่งการเปลี่ยนแปลง)',
      description: 'เกิดจากการชงกับเสาปีเกิดหรือปีจร บ่งบอกถึงจังหวะแห่งการเปลี่ยนแปลงครั้งสำคัญ เช่น โยกย้ายที่อยู่ เปลี่ยนงาน หรือปรับปรุงสภาพแวดล้อม'
    },
    '天赋': {
      code: 'TF',
      nameThai: 'เทียนฟู่ (ดาวพรสวรรค์สวรรค์ / ความสามารถเฉพาะทาง)',
      hanzi: '天赋',
      pinyin: 'Tian Fu',
      type: 'Talent Star (ดาวพรสวรรค์)',
      description: 'มีพรสวรรค์และความเชี่ยวชาญเฉพาะทางสูง เรียนรู้ศาสตร์ยากๆ ได้อย่างรวดเร็ว โดดเด่นในสายอาชีพ'
    },
    '血刃': {
      code: 'XR',
      nameThai: 'ฮ่วยยิ่ม (ดาวมีดเลือด / ระวังของมีคม)',
      hanzi: '血刃',
      pinyin: 'Xue Ren',
      type: 'Health Warning (ดาวระวังของมีคม)',
      description: 'เตือนให้ระมัดระวังอุบัติเหตุจากของมีคม การบาดเจ็บ หรือการผ่าตัดเล็ก ควรแก้เคล็ดด้วยการตรวจสุขภาพ ทำฟัน หรือบริจาคโลหิต'
    },
    '勾绞': {
      code: 'GJ',
      nameThai: 'เกากาว (ดาวเกี่ยวรัด / ข้อพิพาทและความขัดแย้ง)',
      hanzi: '勾绞',
      pinyin: 'Gou Jiao',
      type: 'Dispute Star (ดาวข้อพิพาท)',
      description: 'เตือนเรื่องการมีปากเสียง คดีความ หรือปัญหาข้อสัญญาทางกฎหมาย ควรหลีกเลี่ยงการค้ำประกันและการมีเรื่องวิวาท'
    },
    '官符': {
      code: 'GF',
      nameThai: 'กวนฝูโบราณ (官符 - ตราอาญาสิทธิ์ขุนนาง / ลิขิตคดีความและตราสารแผ่นดิน)',
      hanzi: '官符',
      pinyin: 'Guan Fu',
      type: 'Official Authority & Legal Star (ตราสารแผ่นดินและคดีความ)',
      description: 'กวน คือ ขุนนางหรือทางการ, ฝู คือ ตราประทับ ยันต์อาญาสิทธิ์ หรือใบสั่งราชการ กวนฝูจึงมีความหมายสองด้าน: หากมีอำนาจจะกุมตราประทับ สั่งการ เลื่อนขั้น ถือสัมปทาน แต่หากตกตำแหน่งเสียจะกลายเป็นคดีความ หมายศาล หรือข้อพิพาทกับทางการ (อ้างอิงตำราสำนักเฮียงเหล่งตึ้ง และคัมภีร์《兰台妙选》)'
    }
  };

  return {
    getStarDetails: function (rawText) {
      if (!rawText) return null;
      const clean = String(rawText).trim();
      const lower = clean.toLowerCase();
      const cleanHanzi = clean.replace(/[^\u4e00-\u9fa5]/g, '');
      const cleanAlpha = lower.replace(/[^a-z]/g, '');

      // 1. Direct match or clean contains key/hanzi or key/hanzi contains cleanHanzi (if cleanHanzi has at least 2 chars)
      // Sort keys by length descending to match specific multi-character stars first (e.g. 红艳 before 桃花)
      const sortedKeys = Object.keys(SHEN_SHA_CATALOG).sort((a, b) => b.length - a.length);

      for (const key of sortedKeys) {
        const item = SHEN_SHA_CATALOG[key];
        const strippedKey = key.replace(/(贵人|星|煞)$/, '');
        const strippedHanzi = (item.hanzi || '').replace(/(贵人|星|煞)$/, '');

        if (clean.includes(key) || clean.includes(item.hanzi)) {
          return item;
        }
        if (strippedKey.length >= 2 && clean.includes(strippedKey)) {
          return item;
        }
        if (strippedHanzi.length >= 2 && clean.includes(strippedHanzi)) {
          return item;
        }
        if (cleanHanzi.length >= 2 && (key.includes(cleanHanzi) || item.hanzi.includes(cleanHanzi))) {
          return item;
        }
      }

      // 2. Pinyin match (e.g. 'wenchang' -> 'wenchangguiren')
      for (const key of sortedKeys) {
        const item = SHEN_SHA_CATALOG[key];
        const pinyinAlpha = (item.pinyin || '').toLowerCase().replace(/[^a-z]/g, '');
        if (pinyinAlpha && cleanAlpha.includes(pinyinAlpha)) {
          return item;
        }
        const strippedPinyin = pinyinAlpha.replace(/(guiren|xing|sha)$/, '');
        if (strippedPinyin.length >= 4 && cleanAlpha.includes(strippedPinyin)) {
          return item;
        }
      }

      // 3. English keywords mapping
      const enMap = [
        { kw: 'academic', key: '文昌贵人' },
        { kw: 'wenxing', key: '文昌贵人' },
        { kw: 'wenchang', key: '文昌贵人' },
        { kw: 'peach blossom', key: '咸池桃花' },
        { kw: 'xianchi', key: '咸池桃花' },
        { kw: 'flower of romance', key: '天干桃花' },
        { kw: 'tiangantao', key: '天干桃花' },
        { kw: 'matchmaker', key: '红鸾' },
        { kw: 'hongluan', key: '红鸾' },
        { kw: 'star of happiness', key: '天喜' },
        { kw: 'tianxi', key: '天喜' },
        { kw: 'red peach', key: '红艳' },
        { kw: 'hongyan', key: '红艳' },
        { kw: 'travelling horse', key: '驿马' },
        { kw: 'traveling horse', key: '驿马' },
        { kw: 'yima', key: '驿马' },
        { kw: 'blade', key: '羊刃' },
        { kw: 'sword star', key: '羊刃' },
        { kw: 'yangren', key: '羊刃' },
        { kw: 'general star', key: '将星' },
        { kw: 'jiangxing', key: '将星' },
        { kw: 'death star', key: '亡神' },
        { kw: 'wangshen', key: '亡神' },
        { kw: 'robbing star', key: '劫煞' },
        { kw: 'jiesha', key: '劫煞' },
        { kw: 'star of arts', key: '华盖' },
        { kw: 'huagai', key: '华盖' },
        { kw: 'heavenly virtue', key: '天德贵人' },
        { kw: 'tiandeguiren', key: '天德贵人' },
        { kw: 'tiande', key: '天德贵人' },
        { kw: 'monthly virtue', key: '月德贵人' },
        { kw: 'yuedeguiren', key: '月德贵人' },
        { kw: 'yuede', key: '月德贵人' },
        { kw: 'nobleman', key: '天乙贵人' },
        { kw: 'tianyiguiren', key: '天乙贵人' },
        { kw: 'heavenly noble', key: '天乙贵人' },
        { kw: 'prosperity', key: '禄神' },
        { kw: 'lushen', key: '禄神' },
        { kw: 'shiganlu', key: '禄神' },
        { kw: 'golden carriage', key: '金舆' },
        { kw: 'jinyu', key: '金舆' },
        { kw: 'flying knife', key: '飞刃' },
        { kw: 'feiren', key: '飞刃' },
        { kw: 'bloody knife', key: '血刃' },
        { kw: 'xueren', key: '血刃' },
        { kw: 'funeral gate', key: '丧门' },
        { kw: 'sangmensha', key: '丧门' },
        { kw: 'sangmen', key: '丧门' },
        { kw: 'crying star', key: '吊客' },
        { kw: 'diaokesha', key: '吊客' },
        { kw: 'diaoke', key: '吊客' },
        { kw: 'forlorn', key: '寡宿' },
        { kw: 'guasu', key: '寡宿' },
        { kw: 'solitary', key: '孤辰' },
        { kw: 'guchen', key: '孤辰' },
        { kw: 'disputes', key: '勾绞' },
        { kw: 'goujiao', key: '勾绞' },
        { kw: 'heaven net', key: '天罗' },
        { kw: 'tianluo', key: '天罗' },
        { kw: 'monetary losses', key: '岁破' },
        { kw: 'suipo', key: '岁破' },
        { kw: 'backstabbing', key: '五鬼' },
        { kw: 'five ghosts', key: '五鬼' },
        { kw: 'wugui', key: '五鬼' },
        { kw: 'heaven void', key: '空亡' },
        { kw: 'kong wang', key: '空亡' },
        { kw: 'literacy star', key: '学堂' },
        { kw: 'xuetang', key: '学堂' },
        { kw: 'red clouds', key: '流霞' },
        { kw: 'liuxia', key: '流霞' },
        { kw: 'heavenly doctor', key: '天医' },
        { kw: 'tianyi', key: '天医' },
        { kw: 'taiji', key: '太极贵人' },
        { kw: 'fuxing', key: '福星贵人' },
        { kw: 'beneficiary', key: '福星贵人' },
        { kw: 'tianchu', key: '天厨贵人' },
        { kw: 'culinary', key: '天厨贵人' },
        { kw: 'heavenly administration', key: '天官' },
        { kw: 'tianguan', key: '天官' },
        { kw: 'career', key: '天赋' },
        { kw: 'tianfu', key: '天赋' },
        { kw: 'right measure', key: '节度' },
        { kw: 'jiedu', key: '节度' },
        { kw: 'mentor', key: '龙德' },
        { kw: 'longde', key: '龙德' },
        { kw: 'guanfu', key: '官符' },
        { kw: 'guan fu', key: '官符' },
        { kw: 'official seal', key: '官符' },
        { kw: 'กวนฝู', key: '官符' },
        { kw: 'kuigang', key: '魁罡' }
      ];

      for (const m of enMap) {
        if (lower.includes(m.kw)) {
          if (SHEN_SHA_CATALOG[m.key]) return SHEN_SHA_CATALOG[m.key];
        }
      }

      return null;
    },

    SHEN_SHA_CATALOG,
    getStarInfo: function (starName) {
      return SHEN_SHA_CATALOG[starName] || null;
    },
    checkKuiGang: function (dayStem, dayBranch) {
      const pillar = `${dayStem}${dayBranch}`;
      if (SHEN_SHA_CATALOG['魁罡'].pillars.includes(pillar)) {
        return {
          isKuiGang: true,
          pillar,
          details: SHEN_SHA_CATALOG['魁罡'].deepAnalysis[pillar] || null,
          starInfo: SHEN_SHA_CATALOG['魁罡']
        };
      }
      return { isKuiGang: false };
    }
  };
})();

if (typeof window !== 'undefined') window.BaziStarsDB = BaziStarsDB;
if (typeof globalThis !== 'undefined') globalThis.BaziStarsDB = BaziStarsDB;
if (typeof module !== 'undefined' && module.exports) module.exports = BaziStarsDB;
