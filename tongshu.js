/**
 * ============================================================================
 * JIU TIAN ARCANA - TONG SHU (通書) AUSPICIOUS ALMANAC ENGINE & CONTROLLER
 * Comprehensive Chinese Metaphysics, 12 Day Officers, 28 Mansions, 12 Shichen,
 * Daily Deity Oracle & Purpose-Based Auspicious Date Finder.
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. CHINESE METAPHYSICS DATA TABLES
  // ==========================================================================

  const STEMS = [
    { zh: '甲', th: 'เจี่ย (Jia)', element: 'ไม้หยาง (Yang Wood)', pinyin: 'Jiǎ', luckyColor: 'เขียวมรกต / เขียวป่าไม้' },
    { zh: '乙', th: 'อี่ (Yi)', element: 'ไม้หยิน (Yin Wood)', pinyin: 'Yǐ', luckyColor: 'เขียวอ่อน / หยกเขียว' },
    { zh: '丙', th: 'ปิ่ง (Bing)', element: 'ไฟหยาง (Yang Fire)', pinyin: 'Bǐng', luckyColor: 'แดงชาด / ส้มประกายเพลิง' },
    { zh: '丁', th: 'ติง (Ding)', element: 'ไฟหยิน (Yin Fire)', pinyin: 'Dīng', luckyColor: 'ชมพูเข้ม / ม่วงแดง' },
    { zh: '戊', th: 'อู้ (Wu)', element: 'ดินหยาง (Yang Earth)', pinyin: 'Wù', luckyColor: 'น้ำตาลทอง / เหลืองอำพัน' },
    { zh: '己', th: 'จี่ (Ji)', element: 'ดินหยิน (Yin Earth)', pinyin: 'Jǐ', luckyColor: 'เหลืองนวล / ครีมเบจ' },
    { zh: '庚', th: 'เกิง (Geng)', element: 'ทองหยาง (Yang Metal)', pinyin: 'Gēng', luckyColor: 'ขาวบริสุทธิ์ / เงินแพลตตินัม' },
    { zh: '辛', th: 'ซิน (Xin)', element: 'ทองหยิน (Yin Metal)', pinyin: 'Xīn', luckyColor: 'ทองคำ / คริสตัลวิบวับ' },
    { zh: '壬', th: 'เหริน (Ren)', element: 'น้ำหยาง (Yang Water)', pinyin: 'Rén', luckyColor: 'น้ำเงินไพลิน / ดำลึกลับ' },
    { zh: '癸', th: 'กุ่ย (Gui)', element: 'น้ำหยิน (Yin Water)', pinyin: 'Guǐ', luckyColor: 'ฟ้าคราม / ดำประกายม่วง' }
  ];

  const BRANCHES = [
    { zh: '子', th: 'ชวด (หนู)', animal: 'หนู (Rat)', pinyin: 'Zǐ', element: 'น้ำ', clashZh: '午', clashTh: 'มะเมีย (ม้า)', shaDir: 'ทิศใต้' },
    { zh: '丑', th: 'ฉลู (วัว)', animal: 'วัว (Ox)', pinyin: 'Chǒu', element: 'ดิน', clashZh: '未', clashTh: 'มะแม (แพะ)', shaDir: 'ทิศตะวันออก' },
    { zh: '寅', th: 'ขาล (เสือ)', animal: 'เสือ (Tiger)', pinyin: 'Yín', element: 'ไม้', clashZh: '申', clashTh: 'วอก (ลิง)', shaDir: 'ทิศเหนือ' },
    { zh: '卯', th: 'เถาะ (กระต่าย)', animal: 'กระต่าย (Rabbit)', pinyin: 'Mǎo', element: 'ไม้', clashZh: '酉', clashTh: 'ระกา (ไก่)', shaDir: 'ทิศตะวันตก' },
    { zh: '辰', th: 'มะโรง (มังกร)', animal: 'มังกร (Dragon)', pinyin: 'Chén', element: 'ดิน', clashZh: '戌', clashTh: 'จอ (หมา)', shaDir: 'ทิศใต้' },
    { zh: '巳', th: 'มะเส็ง (งู)', animal: 'งู (Snake)', pinyin: 'Sì', element: 'ไฟ', clashZh: '亥', clashTh: 'กุน (หมู)', shaDir: 'ทิศตะวันออก' },
    { zh: '午', th: 'มะเมีย (ม้า)', animal: 'ม้า (Horse)', pinyin: 'Wǔ', element: 'ไฟ', clashZh: '子', clashTh: 'ชวด (หนู)', shaDir: 'ทิศเหนือ' },
    { zh: '未', th: 'มะแม (แพะ)', animal: 'แพะ (Goat)', pinyin: 'Wèi', element: 'ดิน', clashZh: '丑', clashTh: 'ฉลู (วัว)', shaDir: 'ทิศตะวันตก' },
    { zh: '申', th: 'วอก (ลิง)', animal: 'ลิง (Monkey)', pinyin: 'Shēn', element: 'ทอง', clashZh: '寅', clashTh: 'ขาล (เสือ)', shaDir: 'ทิศใต้' },
    { zh: '酉', th: 'ระกา (ไก่)', animal: 'ไก่ (Rooster)', pinyin: 'Yǒu', element: 'ทอง', clashZh: '卯', clashTh: 'เถาะ (กระต่าย)', shaDir: 'ทิศตะวันออก' },
    { zh: '戌', th: 'จอ (หมา)', animal: 'หมา (Dog)', pinyin: 'Xū', element: 'ดิน', clashZh: '辰', clashTh: 'มะโรง (มังกร)', shaDir: 'ทิศเหนือ' },
    { zh: '亥', th: 'กุน (หมู)', animal: 'หมู (Pig)', pinyin: 'Hài', element: 'น้ำ', clashZh: '巳', clashTh: 'มะเส็ง (งู)', shaDir: 'ทิศตะวันตก' }
  ];

  // 60 Na-Yin (纳音五行)
  const NAYIN_60 = [
    '海中金 (ทองในมหาสมุทร)', '海中金 (ทองในมหาสมุทร)', '炉中火 (ไฟในเตาหลอม)', '炉中火 (ไฟในเตาหลอม)',
    '大林木 (ไม้ในป่าใหญ่)', '大林木 (ไม้ในป่าใหญ่)', '路旁土 (ดินริมทางหลวง)', '路旁土 (ดินริมทางหลวง)',
    '剑锋金 (ทองคมกระบี่)', '剑锋金 (ทองคมกระบี่)', '山头火 (ไฟบนยอดเขา)', '山头火 (ไฟบนยอดเขา)',
    '涧下水 (น้ำในลำธาร)', '涧下水 (น้ำในลำธาร)', '城头土 (ดินบนกำแพงเมือง)', '城头土 (ดินบนกำแพงเมือง)',
    '白蜡金 (ทองขี้ผึ้งขาว)', '白蜡金 (ทองขี้ผึ้งขาว)', '杨柳木 (ไม้ต้นหลิว)', '杨柳木 (ไม้ต้นหลิว)',
    '泉中水 (น้ำพุบริสุทธิ์)', '泉中水 (น้ำพุบริสุทธิ์)', '屋上土 (ดินบนหลังคา)', '屋上土 (ดินบนหลังคา)',
    '霹雳火 (ไฟอัสนีบาต)', '霹雳火 (ไฟอัสนีบาต)', '松柏木 (ไม้สนยืนต้น)', '松柏木 (ไม้สนยืนต้น)',
    '长流水 (น้ำไหลไม่ขาดสาย)', '长流水 (น้ำไหลไม่ขาดสาย)', '沙中金 (ทองปนทราย)', '沙中金 (ทองปนทราย)',
    '山下火 (ไฟเชิงเขา)', '山下火 (ไฟเชิงเขา)', '平地木 (ไม้บนที่ราบ)', '平地木 (ไม้บนที่ราบ)',
    '壁上土 (ดินฉาบฝาผนัง)', '壁上土 (ดินฉาบฝาผนัง)', '金箔金 (ทองคำเปลวบริสุทธิ์)', '金箔金 (ทองคำเปลวบริสุทธิ์)',
    '覆灯火 (ไฟตะเกียงส่องสว่าง)', '覆灯火 (ไฟตะเกียงส่องสว่าง)', '天河水 (น้ำในแม่น้ำสวรรค์)', '天河水 (น้ำในแม่น้ำสวรรค์)',
    '大驿土 (ดินสถานีใหญ่)', '大驿土 (ดินสถานีใหญ่)', '钗钏金 (ทองกำไลปิ่นปักผม)', '钗钏金 (ทองกำไลปิ่นปักผม)',
    '桑柘木 (ไม้หม่อนมงคล)', '桑柘木 (ไม้หม่อนมงคล)', '大溪水 (น้ำในแม่น้ำใหญ่)', '大溪水 (น้ำในแม่น้ำใหญ่)',
    '沙中土 (ดินในทรายปนหิน)', '沙中土 (ดินในทรายปนหิน)', '天上火 (ไฟสุริยันบนฟ้า)', '天上火 (ไฟสุริยันบนฟ้า)',
    '石榴木 (ไม้ทับทิมนำโชค)', '石榴木 (ไม้ทับทิมนำโชค)', '大海水 (น้ำในมหาสมุทรลึก)', '大海水 (น้ำในมหาสมุทรลึก)'
  ];

  // 12 Day Officers (建除十二神)
  const DAY_OFFICERS = [
    {
      zh: '建', th: 'เจี้ยน (สถาปนา/ริเริ่ม)',
      quality: 'มงคล', rating: 4, stars: '⭐⭐⭐⭐',
      badgeClass: 'officer-auspicious',
      desc: 'วันแห่งการสถาปนา ริเริ่มสิ่งใหม่ เริ่มแผนการงานใหญ่ รับตำแหน่ง',
      suitable: ['เปิดกิจการ', 'ลงนามเริ่มต้นโครงการ', 'ไหว้พระขอพร', 'รับตำแหน่งใหม่', 'ท่องเที่ยวเปิดหูเปิดตา'],
      taboo: ['ขุดสระน้ำ', 'จัดงานอวมงคล', 'เดินทางไกลข้ามน้ำข้ามทะเล']
    },
    {
      zh: '除', th: 'ฉู (ปัดเป่า/ชำระล้าง)',
      quality: 'มงคล', rating: 4, stars: '⭐⭐⭐⭐',
      badgeClass: 'officer-auspicious',
      desc: 'วันแห่งการขจัดสิ่งอัปมงคล ชำระล้างพลังงานลบ ปลดปล่อยสิ่งตกค้าง รักษาโรคภัย',
      suitable: ['สะเดาะเคราะห์', 'ทำความสะอาดปรับฮวงจุ้ย', 'รักษาโรค/ผ่าตัด', 'ทิ้งสิ่งของเก่า', 'ไหว้พระล้างพลังงานลบ'],
      taboo: ['แต่งงาน', 'เซ็นสัญญาผูกมัด', 'ลงทุนระยะยาว', 'เปิดตัวสินค้าใหม่']
    },
    {
      zh: '滿', th: 'ม่าน (เต็มเปี่ยม/อุดมสมบูรณ์)',
      quality: 'มงคลยิ่ง', rating: 5, stars: '⭐⭐⭐⭐⭐',
      badgeClass: 'officer-great',
      desc: 'วันแห่งความอุดมสมบูรณ์ มหาสมบัติเต็มคลัง โชคลาภพูนทวี เหมาะแก่การรับทรัพย์สิน',
      suitable: ['เปิดบัญชีธนาคาร', 'รับเงินรับทอง', 'เปิดคลังสินค้า', 'จัดงานเลี้ยงฉลอง', 'ทำบุญเสริมบารมี', 'แต่งงาน'],
      taboo: ['เริ่มคดีความ', 'รับบุตรบุญธรรม', 'กู้ยืมหนี้สิน']
    },
    {
      zh: '平', th: 'ผิง (ราบรื่น/เสมอภาค)',
      quality: 'ปานกลาง', rating: 3, stars: '⭐⭐⭐',
      badgeClass: 'officer-neutral',
      desc: 'วันแห่งความสงบ ราบรื่น สมดุล ประนีประนอม ไกล่เกลี่ยข้อพิพาท',
      suitable: ['เจรจาปรองดอง', 'ซ่อมแซมปรับพื้นที่', 'เพาะปลูก', 'ทำความสะอาดเคหสถาน', 'ทำบุญอุทิศส่วนกุศล'],
      taboo: ['ขึ้นศาลฟ้องร้อง', 'เสี่ยงโชคการพนัน', 'กิจกรรมเสี่ยงภัย']
    },
    {
      zh: '定', th: 'ติ้ง (มั่นคง/แน่นอน)',
      quality: 'มงคลยิ่ง', rating: 5, stars: '⭐⭐⭐⭐⭐',
      badgeClass: 'officer-great',
      desc: 'วันแห่งความมั่นคงถาวร วางรากฐานอันยั่งยืน ตกลงสัญญา หมั้นหมาย',
      suitable: ['ทำสัญญาค้าขาย', 'หมั้นหมาย/สู่ขอ', 'วางศิลาฤกษ์', 'รับพนักงานใหม่', 'ซื้อบ้าน/ที่ดิน', 'ตั้งศาลบูชา'],
      taboo: ['ฟ้องร้องฟ้องคดี', 'รักษาแผลสด', 'เดินทางไกลอย่างเร่งรีบ']
    },
    {
      zh: '執', th: 'จื๋อ (ยึดถือ/รักษาการ)',
      quality: 'ปานกลาง', rating: 3, stars: '⭐⭐⭐',
      badgeClass: 'officer-neutral',
      desc: 'วันแห่งการรักษาแบบแผน กฎระเบียบ มั่นคงในหน้าที่ เพาะปลูก เลี้ยงสัตว์',
      suitable: ['ทำบุญขอพร', 'จับกุมคนร้าย/ปราบอธรรม', 'ลงนามข้อตกลงระยะสั้น', 'เริ่มต้นการเรียนรู้'],
      taboo: ['ย้ายบ้าน', 'เปิดกิจการสาขาใหม่', 'ออกเดินทางท่องเที่ยวไกล']
    },
    {
      zh: '破', th: 'พั่ว (ทะลวง/ทำลายอุปสรรค)',
      quality: 'ควรระวัง', rating: 1, stars: '⭐',
      badgeClass: 'officer-danger',
      desc: 'วันแห่งการปะทะ ทะลวงกำแพง รื้อถอนของเก่า ไม่เหมาะกับงานมงคลใดๆ',
      suitable: ['รื้อถอนอาคารเก่า', 'ตัดไม้ใหญ่ที่กีดขวาง', 'ผ่าตัดรักษาโรคเรื้อรัง', 'สะเดาะเคราะห์ตัดวิบากกรรม'],
      taboo: ['แต่งงาน/สู่ขอ', 'เปิดร้านใหม่', 'เซ็นสัญญาพันธมิตร', 'ขึ้นบ้านใหม่', 'ลงทุนก้อนใหญ่']
    },
    {
      zh: '危', th: 'เวย (ระมัดระวัง/มีสติ)',
      quality: 'ปานกลาง (ระวัง)', rating: 2, stars: '⭐⭐',
      badgeClass: 'officer-caution',
      desc: 'วันแห่งความตระหนักรู้ เตือนสติ ตั้งรับ เหมาะแก่การไหว้พระ สวดมนต์ ตั้งมั่นในศีล',
      suitable: ['ไหว้พระขอพรเทพเจ้า', 'ตั้งเตียงนอนมงคล', 'ทำบุญโรงพยาบาล', 'วางแผนยุทธศาสตร์เงียบๆ'],
      taboo: ['ปีนเขากิจกรรมแอดเวนเจอร์', 'ล่องเรือออกทะเลลึก', 'ซ่อมแซมหลังคาบ้าน', 'ขับรถทางไกลตอนดึก']
    },
    {
      zh: '成', th: 'เฉิง (สำเร็จ/ลุล่วง)',
      quality: 'มงคลสูงสุด', rating: 5, stars: '⭐⭐⭐⭐⭐',
      badgeClass: 'officer-great',
      desc: 'วันมหามงคลสูงสุด สรรพสิ่งบรรลุผลสำเร็จ ดั่งมังกรผงาดเหนือเมฆา เกื้อหนุนทุกกิจการ',
      suitable: ['แต่งงานจดทะเบียน', 'เปิดร้าน/เปิดบริษัท', 'เซ็นสัญญาใหญ่', 'เข้าสอบ/สัมภาษณ์งาน', 'ขึ้นบ้านใหม่', 'ออกรถใหม่'],
      taboo: ['เริ่มคดีความฟ้องร้อง', 'ทุ่มเถียงมีปากเสียง']
    },
    {
      zh: '收', th: 'โซ่ว (เก็บเกี่ยว/รับทรัพย์)',
      quality: 'มงคลยิ่ง', rating: 5, stars: '⭐⭐⭐⭐⭐',
      badgeClass: 'officer-great',
      desc: 'วันแห่งการเก็บเกี่ยวผลผลิต ดึงดูดทรัพย์เข้าคลัง ทวงหนี้ได้คืน รับผลกำไร',
      suitable: ['ทวงหนี้สิน', 'เก็บเงินเก็บทองเข้าคลัง', 'เปิดหีบสมบัติ', 'ซื้ออสังหาริมทรัพย์', 'ทำบุญสร้างโบสถ์วิหาร'],
      taboo: ['จัดงานฌาปนกิจ', 'ปล่อยเงินกู้', 'รักษาโรคร้ายแรง']
    },
    {
      zh: '開', th: 'คาย (เปิดทาง/เบิกเนตร)',
      quality: 'มงคลสูงสุด', rating: 5, stars: '⭐⭐⭐⭐⭐',
      badgeClass: 'officer-great',
      desc: 'วันแห่งประตูสวรรค์เปิด ทางสว่างโล่ง แจ่มใสรุ่งเรือง เหมาะแก่การเปิดตัวทุกประการ',
      suitable: ['เปิดร้านค้า/เปิดกิจการ', 'เปิดตัวสินค้าใหม่', 'เริ่มเข้าศึกษาใหม่', 'ออกเดินทางท่องเที่ยว', 'ย้ายเข้าบ้านใหม่', 'สู่ขอ'],
      taboo: ['จัดงานอวมงคล', 'ขุดสุสาน', 'กักขังสิ่งมีชีวิต']
    },
    {
      zh: '閉', th: 'ปี้ (ปิดกั้น/สะสมพลัง)',
      quality: 'ควรระวัง', rating: 2, stars: '⭐⭐',
      badgeClass: 'officer-caution',
      desc: 'วันแห่งการปิดม่าน สะสมพลัง ซ่อนเร้น เก็บงำความลับ พักผ่อนฟื้นฟู',
      suitable: ['สร้างกำแพงกั้นน้ำ', 'ปิดงบดุลบัญชี', 'พักผ่อนเก็บตัวภาวนา', 'ฝังกลบสิ่งปฏิกูล'],
      taboo: ['เปิดกิจการใหม่', 'จัดงานแต่งงาน', 'เปิดตาเบิกเนตรพระ', 'เจรจาการค้าสำคัญ']
    }
  ];

  // 28 Lunar Mansions (二十八宿)
  const MANSIONS_28 = [
    { zh: '角木蛟', nameTh: 'เจียก (มังกรไม้)', animal: 'มังกรเขียว', dir: 'ทิศตะวันออก', auspice: '吉 (มงคล)', desc: 'ดาวมงคลแห่งเกียรติยศและปัญญา เหมาะเริ่มต้นการศึกษาและเจรจา' },
    { zh: '亢金龙', nameTh: 'คัง (มังกรทอง)', animal: 'มังกรเขียว', dir: 'ทิศตะวันออก', auspice: '凶 (ควรระวัง)', desc: 'ดาวกระด้าง ระวังความขัดแย้งกับผู้ใหญ่ ไม่ควรขึ้นศาล' },
    { zh: '氐土貉', nameTh: 'ตี (แรคคูนดิน)', animal: 'มังกรเขียว', dir: 'ทิศตะวันออก', auspice: '凶 (ควรระวัง)', desc: 'ดาวแห่งการพลัดพราก ระวังการลงทุนเก็งกำไร' },
    { zh: '房日兔', nameTh: 'ฝาง (กระต่ายสุริยัน)', animal: 'มังกรเขียว', dir: 'ทิศตะวันออก', auspice: '吉 (มงคลยิ่ง)', desc: 'ดวงดาวแห่งโชคลาภ คลังสมบัติ และความสุขสมหวังในความรัก' },
    { zh: '心月狐', nameTh: 'ซิน (จิ้งจอกจันทรา)', animal: 'มังกรเขียว', dir: 'ทิศตะวันออก', auspice: '凶 (ควรระวัง)', desc: 'ดาวเสน่ห์เล่ห์กล ระวังการหลอกลวงหรือเอกสารสัญญาผิดพลาด' },
    { zh: '尾火虎', nameTh: 'บี่ (เสือเพลิง)', animal: 'มังกรเขียว', dir: 'ทิศตะวันออก', auspice: '吉 (มงคลยิ่ง)', desc: 'ดาวแห่งอำนาจบารมี ชัยชนะในการแข่งขัน และการเลื่อนยศ' },
    { zh: '箕水豹', nameTh: 'กี (เสือดาววารี)', animal: 'มังกรเขียว', dir: 'ทิศตะวันออก', auspice: '吉 (มงคล)', desc: 'ดาวแห่งการค้าขายทางไกล ลาภลอย และการเปิดสาขาใหม่' },
    { zh: '斗木獬', nameTh: 'โต่ว (ยูนิคอร์นไม้)', animal: 'เต่าดำ', dir: 'ทิศเหนือ', auspice: '吉 (มงคลยิ่ง)', desc: 'ดาวแห่งการสร้างรากฐาน ความมั่นคง การวางศิลาฤกษ์สร้างบ้าน' },
    { zh: '牛金牛', nameTh: 'งิว (วัวทอง)', animal: 'เต่าดำ', dir: 'ทิศเหนือ', auspice: '凶 (ควรระวัง)', desc: 'ดาวแห่งภาระเหน็ดเหนื่อย ระวังอุบัติเหตุจากการทำงานหนัก' },
    { zh: '女土蝠', nameTh: 'นื้อ (ค้างคาวดิน)', animal: 'เต่าดำ', dir: 'ทิศเหนือ', auspice: '凶 (ควรระวัง)', desc: 'ดาวหญิงระทม ระวังปากเสียงในครอบครัวหรือเรื่องชู้สาว' },
    { zh: '虚日鼠', nameTh: 'ฮือ (หนูสุริยัน)', animal: 'เต่าดำ', dir: 'ทิศเหนือ', auspice: '凶 (ควรระวัง)', desc: 'ดาวความว่างเปล่า การลงทุนอาจได้ผลตอบแทนล่าช้า' },
    { zh: '危月燕', nameTh: 'งุ่ย (นกนางแอ่นจันทรา)', animal: 'เต่าดำ', dir: 'ทิศเหนือ', auspice: '凶 (ควรระวัง)', desc: 'ดาวแห่งความไม่แน่นอน เหมาะแก่การทำบุญ ไหว้พระปฏิบัติธรรม' },
    { zh: '室火猪', nameTh: 'เส็ก (หมูเพลิง)', animal: 'เต่าดำ', dir: 'ทิศเหนือ', auspice: '吉 (มงคลยิ่ง)', desc: 'ดาวแห่งการสร้างบ้านเรือน แต่งงาน รับทรัพย์สมบัติก้อนโต' },
    { zh: '壁水貐', nameTh: 'เป็ก (กวางวารี)', animal: 'เต่าดำ', dir: 'ทิศเหนือ', auspice: '吉 (มงคลยิ่ง)', desc: 'ดาวกำแพงสมบัติ การศึกษา สอบแข่งขัน และงานศิลปะรุ่งเรือง' },
    { zh: '奎木狼', nameTh: 'กวย (หมาป่าไม้)', animal: 'เสือขาว', dir: 'ทิศตะวันตก', auspice: '凶 (ควรระวัง)', desc: 'ดาวขัดสน ระวังการถูกหักหลังและโจรกรรม' },
    { zh: '娄金狗', nameTh: 'เล้า (สุนัขทอง)', animal: 'เสือขาว', dir: 'ทิศตะวันตก', auspice: '吉 (มงคลยิ่ง)', desc: 'ดาวแห่งความภักดี มิตรภาพ และการค้าขายสัตว์เลี้ยง/ที่ดิน' },
    { zh: '胃土雉', nameTh: 'อุย (ไก่ฟ้าดิน)', animal: 'เสือขาว', dir: 'ทิศตะวันตก', auspice: '吉 (มงคล)', desc: 'ดาวแห่งความสมบูรณ์พูนสุข ค้าขายอาหารและพืชผลรุ่งโรจน์' },
    { zh: '昴日鸡', nameTh: 'เบ้า (ไก่สุริยัน)', animal: 'เสือขาว', dir: 'ทิศตะวันตก', auspice: '凶 (ควรระวัง)', desc: 'ดาวขวากหนาม ระวังอุบัติเหตุจากการเดินทางและของมีคม' },
    { zh: '毕月乌', nameTh: 'ปิก (กาจันทรา)', animal: 'เสือขาว', dir: 'ทิศตะวันตก', auspice: '吉 (มงคลยิ่ง)', desc: 'ดาวแห่งการคุ้มครอง ปลอดภัยจากภยันตรายทั้งปวง' },
    { zh: '觜火猴', nameTh: 'จุย (ลิงเพลิง)', animal: 'เสือขาว', dir: 'ทิศตะวันตก', auspice: '凶 (ควรระวัง)', desc: 'ดาวปากเปราะ ระวังการวิวาท โต้เถียง หรือใส่ร้ายป้ายสี' },
    { zh: '参水猿', nameTh: 'ซำ (ชะนีวารี)', animal: 'เสือขาว', dir: 'ทิศตะวันตก', auspice: '吉 (มงคล)', desc: 'ดาวแห่งพันธมิตร เหมาะร่วมหุ้น ค้าขาย ขยายเครือข่าย' },
    { zh: '井木犴', nameTh: 'เจ็ง (กวางป่าไม้)', animal: 'หงส์เพลิง', dir: 'ทิศใต้', auspice: '吉 (มงคลยิ่ง)', desc: 'ดาวบ่อน้ำทิพย์ ร่ำรวยเงินทอง ไหลมาเทมาไม่ขาดสาย' },
    { zh: '鬼金羊', nameTh: 'กุ่ย (แพะทอง)', animal: 'หงส์เพลิง', dir: 'ทิศใต้', auspice: '凶 (ควรระวัง)', desc: 'ดาววิญญาณ เหมาะทำบุญอุทิศส่วนกุศล เลี่ยงงานมงคลรื่นเริง' },
    { zh: '柳土獐', nameTh: 'ลิ่ว (ละมั่งดิน)', animal: 'หงส์เพลิง', dir: 'ทิศใต้', auspice: '凶 (ควรระวัง)', desc: 'ดาวใบลอยลม สัญญาอาจผันผวน ระวังการถูกเอาเปรียบ' },
    { zh: '星日马', nameTh: 'แช (ม้าสุริยัน)', animal: 'หงส์เพลิง', dir: 'ทิศใต้', auspice: '凶 (ควรระวัง)', desc: 'ดาวร้อนรน กิจการอาจติดขัด เลี่ยงการลงเสาเอกสร้างบ้าน' },
    { zh: '张月鹿', nameTh: 'เตีย (กวางดาวจันทรา)', animal: 'หงส์เพลิง', dir: 'ทิศใต้', auspice: '吉 (มงคลยิ่ง)', desc: 'ดาวมิ่งมงคล งานมงคลสมรส บุตรบริวารนำความสุขมาให้' },
    { zh: '翼火蛇', nameTh: 'เอ็ก (งูเพลิง)', animal: 'หงส์เพลิง', dir: 'ทิศใต้', auspice: '凶 (ควรระวัง)', desc: 'ดาวปีกหัก ระวังอุบัติเหตุและคดีความทางกฎหมาย' },
    { zh: '轸水蚓', nameTh: 'จิ๋น (ไส้เดือนวารี)', animal: 'หงส์เพลิง', dir: 'ทิศใต้', auspice: '吉 (มงคลยิ่ง)', desc: 'ดาวรถม้าเศรษฐี เดินทางไกลปลอดภัย โชคลาภเดินทางมาถึง' }
  ];

  // 12 Shichen Hours (24-hour cycle)
  const SHICHEN_TABLE = [
    { idx: 0, zh: '子时', nameTh: 'ยามจื่อ (ชวด)', timeRange: '23:00 - 00:59', startH: 23, endH: 1 },
    { idx: 1, zh: '丑时', nameTh: 'ยามโฉ่ว (ฉลู)', timeRange: '01:00 - 02:59', startH: 1, endH: 3 },
    { idx: 2, zh: '寅时', nameTh: 'ยามอิ๋น (ขาล)', timeRange: '03:00 - 04:59', startH: 3, endH: 5 },
    { idx: 3, zh: '卯时', nameTh: 'ยามเหม่า (เถาะ)', timeRange: '05:00 - 06:59', startH: 5, endH: 7 },
    { idx: 4, zh: '辰时', nameTh: 'ยามเฉิน (มะโรง)', timeRange: '07:00 - 08:59', startH: 7, endH: 9 },
    { idx: 5, zh: '巳时', nameTh: 'ยามซื่อ (มะเส็ง)', timeRange: '09:00 - 10:59', startH: 9, endH: 11 },
    { idx: 6, zh: '午时', nameTh: 'ยามอู่ (มะเมีย)', timeRange: '11:00 - 12:59', startH: 11, endH: 13 },
    { idx: 7, zh: '未时', nameTh: 'ยามเว่ย (มะแม)', timeRange: '13:00 - 14:59', startH: 13, endH: 15 },
    { idx: 8, zh: '申时', nameTh: 'ยามเซิน (วอก)', timeRange: '15:00 - 16:59', startH: 15, endH: 17 },
    { idx: 9, zh: '酉时', nameTh: 'ยามโยว (ระกา)', timeRange: '17:00 - 18:59', startH: 17, endH: 19 },
    { idx: 10, zh: '戌时', nameTh: 'ยามซวี (จอ)', timeRange: '19:00 - 20:59', startH: 19, endH: 21 },
    { idx: 11, zh: '亥时', nameTh: 'ยามไฮ่ (กุน)', timeRange: '21:00 - 22:59', startH: 21, endH: 23 }
  ];

  // 12 Deities of the Hours (黄道六吉神 vs 黑道六凶神)
  const HOUR_DEITIES = [
    { zh: '青龙', th: 'มังกรเขียว (ชิงหลง)', type: '吉', quality: 'มงคลยิ่ง', badge: 'hour-great', desc: 'เทพมังกรเขียว ประทานโชคลาภ เกียรติยศ และความสำเร็จรุ่งโรจน์' },
    { zh: '明堂', th: 'ลานสว่าง (หมิงถัง)', type: '吉', quality: 'มงคลยิ่ง', badge: 'hour-great', desc: 'เทพตำหนักสว่าง อุปถัมภ์ค้ำชู ธุรกิจราบรื่น ผู้ใหญ่เมตตา' },
    { zh: '天刑', th: 'ทัณฑ์สวรรค์ (เทียนสิง)', type: '凶', quality: 'ควรระวัง', badge: 'hour-danger', desc: 'ดาวลงทัณฑ์ ระวังความขัดแย้ง คดีความ หรืออุบัติเหตุ' },
    { zh: '朱雀', th: 'หงส์ชาด (จูเชวี่ย)', type: '凶', quality: 'ควรระวัง', badge: 'hour-danger', desc: 'ดาวหงส์ไฟพิโรธ ระวังการนินทา ปากเสียง และข้อพิพาท' },
    { zh: '金匮', th: 'หีบสมบัติทอง (จินกุ้ย)', type: '吉', quality: 'มงคลยิ่ง', badge: 'hour-great', desc: 'เทพคลังทองคำ เหมาะเปิดบัญชี โอนเงิน ลงทุน รับทรัพย์' },
    { zh: '天德', th: 'คุณธรรมฟ้า (เทียนเต๋อ)', type: '吉', quality: 'มงคลยิ่ง', badge: 'hour-great', desc: 'ดาวคุณธรรมสูงสุด แคล้วคลาดปลอดภัย สิ่งศักดิ์สิทธิ์คุ้มครอง' },
    { zh: '白虎', th: 'เสือขาว (ไป๋หู่)', type: '凶', quality: 'ควรระวัง', badge: 'hour-danger', desc: 'ดาวเสือขาวดุร้าย ระวังโทสะ ของมีคม และการปะทะ' },
    { zh: '玉堂', th: 'ตำหนักหยก (อวี่ถัง)', type: '吉', quality: 'มงคลยิ่ง', badge: 'hour-great', desc: 'เทพตำหนักหยก ปัญญาผ่องใส เจรจาสำเร็จ บัณฑิตเกื้อหนุน' },
    { zh: '天牢', th: 'คุกสวรรค์ (เทียนเหลา)', type: '凶', quality: 'ควรระวัง', badge: 'hour-danger', desc: 'ดาวจองจำ งานอาจล่าช้า ติดขัด ไม่ราบรื่นตามนัดหมาย' },
    { zh: '玄武', th: 'เต่าดำ (เสวียนอู่)', type: '凶', quality: 'ควรระวัง', badge: 'hour-danger', desc: 'ดาวเต่าดำเงียบงัน ระวังการสูญหาย ถูกโจรกรรม หรือคนลวง' },
    { zh: '司命', th: 'จอมชะตา (ซือหม่า)', type: '吉', quality: 'มงคลยิ่ง', badge: 'hour-great', desc: 'เทพผู้พิทักษ์ชะตา สำเร็จทุกประการ ฟ้าเปิดทาง สุขภาพดี' },
    { zh: '勾陈', th: 'พญางูพัน (โกวเฉิน)', type: '凶', quality: 'ควรระวัง', badge: 'hour-danger', desc: 'ดาวพัวพัน เรื่องยืดเยื้อ ไม่ควรรีบตัดสินใจใหญ่ในเวลานี้' }
  ];

  // Starting index of 青龙 (Qing Long) in the 12 Shichens based on Day Branch:
  // 子/午 -> 申(8), 丑/未 -> 戌(10), 寅/申 -> 子(0), 卯/酉 -> 寅(2), 辰/戌 -> 辰(4), 巳/亥 -> 午(6)
  const DAY_BRANCH_QINGLONG_START = {
    0: 8, 6: 8,  // 子, 午
    1: 10, 7: 10, // 丑, 未
    2: 0, 8: 0,  // 寅, 申
    3: 2, 9: 2,  // 卯, 酉
    4: 4, 10: 4, // 辰, 戌
    5: 6, 11: 6  // 巳, 亥
  };

  // 24 Solar Terms (节气) Approximations
  const SOLAR_TERMS = [
    { name: '小寒 (เสี่ยวหาน - หนาวน้อย)', m: 1, d: 6 },
    { name: '大寒 (ต้าหาน - หนาวใหญ่)', m: 1, d: 20 },
    { name: '立春 (หลี่ชุน - เริ่มต้นฤดูใบไม้ผลิ)', m: 2, d: 4 },
    { name: '雨水 (ยวี่สุ่ย - ฝนพรำเบิกฟ้า)', m: 2, d: 19 },
    { name: '惊蛰 (จิงเจ๋อ - แมลงตื่นจำศีล)', m: 3, d: 6 },
    { name: '春分 (ชุนเฟิน - ราตรีทิวาเสมอภาค)', m: 3, d: 21 },
    { name: '清明 (เช็งเม้ง - ฟ้าสว่างสดใส)', m: 4, d: 5 },
    { name: '谷雨 (กู๋ยวี่ - ฝนหล่อเลี้ยงธัญพืช)', m: 4, d: 20 },
    { name: '立夏 (หลี่เซี่ย - ย่างเข้าคิมหันต์)', m: 5, d: 6 },
    { name: '小满 (เสี่ยวหม่าน - รวงข้าวเริ่มเต็ม)', m: 5, d: 21 },
    { name: '芒种 (หมังจ้ง - เก็บเกี่ยวเพาะหว่าน)', m: 6, d: 6 },
    { name: '夏至 (เซี่ยจื้อ - กลางวันยาวนานที่สุด)', m: 6, d: 21 },
    { name: '小暑 (เสี่ยวสู่ - ร้อนน้อย)', m: 7, d: 7 },
    { name: '大暑 (ต้าสู่ - ร้อนยิ่งยวด)', m: 7, d: 23 },
    { name: '立秋 (หลี่ชิว - สารทใบไม้ร่วงเริ่ม)', m: 8, d: 8 },
    { name: '处暑 (ชู่สู่ - คลายไอร้อน)', m: 8, d: 23 },
    { name: '白露 (ไป๋ลู่ - น้ำค้างขาวต้องลม)', m: 9, d: 8 },
    { name: '秋分 (ชิวเฟิน - กลางวันกลางคืนเท่ากัน)', m: 9, d: 23 },
    { name: '寒露 (หานลู่ - ลมหนาวน้ำค้างเย็น)', m: 10, d: 8 },
    { name: '霜降 (ซวงเจี้ยง - เหมยขาบเกล็ดน้ำค้างแข็ง)', m: 10, d: 23 },
    { name: '立冬 (หลี่ตง - เริ่มต้นเหมันตฤดู)', m: 11, d: 7 },
    { name: '小雪 (เสี่ยวเสวี่ย - หิมะแรกโปรย)', m: 11, d: 22 },
    { name: '大雪 (ต้าเสวี่ย - หิมะตกหนัก)', m: 12, d: 7 },
    { name: '冬至 (ตงจื้อ - ตะวันอ้อมข้าว/ราตรียาวนาน)', m: 12, d: 22 }
  ];

  // Auspicious Finder Purpose Presets
  const PURPOSE_PRESETS = {
    opening: {
      id: 'opening',
      title: '🏪 เปิดร้าน / เปิดธุรกิจ / เริ่มค้าขาย',
      icon: 'fa-store',
      favOfficers: [8, 10, 2, 0], // 成, 开, 满, 建
      boostBranches: [4, 5, 6, 8, 9], // 辰, 巳, 午, 申, 酉 (Dragon, Snake, Horse, Monkey, Rooster)
      desc: 'เน้นวันแห่งความมั่งคั่ง ประตูฟ้าเปิดทาง และมีเทพการค้าสถิต'
    },
    wedding: {
      id: 'wedding',
      title: '💍 มงคลสมรส / สู่ขอ / จดทะเบียน',
      icon: 'fa-ring',
      favOfficers: [8, 4, 10, 2], // 成, 定, 开, 满
      boostBranches: [3, 4, 6, 7], // 卯, 辰, 午, 未
      desc: 'เน้นวันแห่งความมั่นคงยั่งยืน ความรักหวานชื่น ไร้พลังปะทะ'
    },
    moving: {
      id: 'moving',
      title: '🏡 ขึ้นบ้านใหม่ / ย้ายที่อยู่ / ลงเสาเอก',
      icon: 'fa-house-chimney',
      favOfficers: [8, 10, 4, 0], // 成, 开, 定, 建
      boostBranches: [1, 4, 7, 10], // 丑, 辰, 未, 戌 (Earth branches for stability)
      desc: 'เน้นวันธาตุดินมั่นคง อยู่เย็นเป็นสุข ไร้ลมร้ายมารบกวน'
    },
    car: {
      id: 'car',
      title: '🚗 ออกรถใหม่ / รับยานพาหนะ',
      icon: 'fa-car-side',
      favOfficers: [8, 10, 2, 4], // 成, 开, 满, 定
      boostBranches: [2, 6, 8], // 寅, 午, 申 (Fast, energetic, powerful)
      desc: 'เน้นความปลอดภัย เดินทางแคล้วคลาด เสริมอำนาจบารมี'
    },
    signing: {
      id: 'signing',
      title: '✍️ เซ็นสัญญา / เจรจาการค้า / ลงทุน',
      icon: 'fa-file-signature',
      favOfficers: [4, 8, 9, 2], // 定, 成, 收, 满
      boostBranches: [4, 8, 9, 11], // 辰, 申, 酉, 亥
      desc: 'เน้นสัญญาเหนียวแน่น ผลประโยชน์งอกเงย ไร้ข้อพิพาท'
    },
    blessing: {
      id: 'blessing',
      title: '🧧 ไหว้พระ / สะเดาะเคราะห์ / ไหว้ขอพรเทพ',
      icon: 'fa-hands-praying',
      favOfficers: [1, 7, 8, 0], // 除, 危, 成, 建
      boostBranches: [0, 2, 4, 6, 8, 10],
      desc: 'เน้นการเปิดรับพุทธบารมี ปัดเป่าสิ่งตกค้าง สบายใจร่มเย็น'
    }
  };

  // Month Hanzi Map
  const LUNAR_MONTH_MAP = {
    '正': 1, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
    '六': 6, '七': 7, '八': 8, '九': 9, '十': 10, '十一': 11, '十二': 12,
    '冬': 11, '腊': 12
  };

  // ==========================================================================
  // 2. CORE CALCULATION ENGINE
  // ==========================================================================

  const TongShuEngine = {
    /**
     * Compute comprehensive Chinese Almanac info for any JavaScript Date
     */
    calculate: function (targetDate) {
      const date = targetDate instanceof Date ? targetDate : new Date(targetDate);
      const year = date.getFullYear();
      const month = date.getMonth(); // 0-indexed
      const day = date.getDate();

      // 1. Julian Day Difference from reference epoch (2000-01-01 was 戊午 Wu-Wu, 60-cycle index 54)
      const baseUTC = Date.UTC(2000, 0, 1);
      const targetUTC = Date.UTC(year, month, day);
      const diffDays = Math.round((targetUTC - baseUTC) / 86400000);

      // Day GanZhi (Cycle 0-59)
      const dayCycle = ((54 + diffDays) % 60 + 60) % 60;
      const dayStemIdx = dayCycle % 10;
      const dayBranchIdx = dayCycle % 12;

      const dayStem = STEMS[dayStemIdx];
      const dayBranch = BRANCHES[dayBranchIdx];
      const dayGanZhi = dayStem.zh + dayBranch.zh;
      const naYin = NAYIN_60[dayCycle];

      // 2. Native Intl Chinese Calendar Lunar Date
      let lunarYearName = '';
      let lunarMonthNum = 1;
      let lunarDayNum = 1;
      let isLeapMonth = false;

      try {
        const parts = new Intl.DateTimeFormat('zh-u-ca-chinese', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).formatToParts(date);

        for (const p of parts) {
          if (p.type === 'year') {
            lunarYearName = p.value;
          } else if (p.type === 'month') {
            const val = p.value;
            isLeapMonth = val.includes('闰') || val.includes('閏');
            const clean = val.replace(/[闰閏月]/g, '').trim();
            lunarMonthNum = LUNAR_MONTH_MAP[clean] || parseInt(clean) || 1;
          } else if (p.type === 'day') {
            lunarDayNum = parseInt(p.value) || 1;
          }
        }
      } catch (err) {
        console.warn('Intl Chinese calendar fallback used:', err);
      }

      // Lunar Day Name in Thai / Chinese
      let lunarDayName = `ค่ำที่ ${lunarDayNum}`;
      if (lunarDayNum === 1) lunarDayName = 'วันชิวอิก (初一) - ขึ้น 1 ค่ำ';
      else if (lunarDayNum === 2) lunarDayName = 'วันชิวหยี (初二) - ขึ้น 2 ค่ำ';
      else if (lunarDayNum === 15) lunarDayName = 'วันจับโหงว (十五) - วันพระจีน/เพ็ญ 15 ค่ำ';

      const lunarDateString = `农历${isLeapMonth ? '闰' : ''}${lunarMonthNum}月${lunarDayNum < 10 ? '初' + lunarDayNum : lunarDayNum}日 (${lunarDayName})`;

      // 3. Month Branch (月支) calculation for 12 Day Officers
      // Month 1 starts at 寅 (idx 2)
      const monthBranchIdx = (lunarMonthNum + 1) % 12;

      // 12 Day Officer Index: (DayBranch - MonthBranch + 12) % 12
      const officerIdx = (dayBranchIdx - monthBranchIdx + 12) % 12;
      const officer = DAY_OFFICERS[officerIdx];

      // 4. 28 Lunar Mansion (二十八宿)
      // Cycle starts with offset 16 from 2000-01-01 (giving 柳宿 at 2026-10-10)
      const mansionIdx = ((diffDays + 16) % 28 + 28) % 28;
      const mansion = MANSIONS_28[mansionIdx];

      // 5. 24 Solar Term (Current or Nearest)
      let currentSolarTerm = SOLAR_TERMS[0];
      const mPlus1 = month + 1;
      for (let i = SOLAR_TERMS.length - 1; i >= 0; i--) {
        const st = SOLAR_TERMS[i];
        if (mPlus1 > st.m || (mPlus1 === st.m && day >= st.d)) {
          currentSolarTerm = st;
          break;
        }
      }

      // 6. Auspicious Directions (ทิศมงคล)
      // 喜神 (Xi Shen - Joy/Love): by Day Stem
      const xiShenMap = ['ตะวันออกเฉียงเหนือ', 'ตะวันตกเฉียงเหนือ', 'ตะวันตกเฉียงใต้', 'ทิศใต้', 'ตะวันออกเฉียงใต้', 'ตะวันออกเฉียงเหนือ', 'ตะวันตกเฉียงเหนือ', 'ตะวันตกเฉียงใต้', 'ทิศใต้', 'ตะวันออกเฉียงใต้'];
      const xiShenDir = xiShenMap[dayStemIdx];

      // 财神 (Cai Shen - Wealth): by Day Stem
      const caiShenMap = ['ตะวันออกเฉียงใต้', 'ตะวันออกเฉียงใต้', 'ทิศตะวันตก', 'ทิศตะวันตก', 'ทิศเหนือ', 'ทิศใต้', 'ทิศตะวันออก', 'ทิศตะวันออก', 'ทิศใต้', 'ทิศเหนือ'];
      const caiShenDir = caiShenMap[dayStemIdx];

      // 贵神 (Gui Shen - Noble Benefactor): by Day Stem
      const guiShenMap = ['ตะวันออกเฉียงเหนือ & ตะวันตกเฉียงใต้', 'ทิศเหนือ & ตะวันตกเฉียงใต้', 'ตะวันตกเฉียงเหนือ & ทิศตะวันตก', 'ตะวันตกเฉียงเหนือ & ทิศตะวันตก', 'ตะวันออกเฉียงเหนือ & ตะวันตกเฉียงใต้', 'ทิศเหนือ & ตะวันตกเฉียงใต้', 'ตะวันออกเฉียงเหนือ & ทิศใต้', 'ตะวันออกเฉียงเหนือ & ทิศใต้', 'ทิศตะวันออก & ตะวันออกเฉียงใต้', 'ทิศตะวันออก & ตะวันออกเฉียงใต้'];
      const guiShenDir = guiShenMap[dayStemIdx];

      // Clash Zodiac & Inauspicious Sha Direction
      const clashZodiac = dayBranch.clashTh;
      const shaDir = dayBranch.shaDir;

      // 7. Day Auspicious Score & Yellow Path Status (黄道吉日 vs 黑道日)
      let baseScore = 50 + (officer.rating * 8);
      if (mansion.auspice.includes('吉')) baseScore += 10;
      if (mansion.auspice.includes('大吉') || mansion.auspice.includes('吉ยิ่ง')) baseScore += 5;
      baseScore = Math.min(98, Math.max(30, baseScore));

      const isYellowPath = officer.rating >= 4 || mansion.auspice.includes('吉');
      const dayStatusTitle = isYellowPath ? 'วันหวงเต้าจี๋ยื่อ (黄道吉日 - วันดาวทองมหามงคล)' : 'วันเฮยเต้า (黑道日 - วันควรระวังและรอบคอบ)';

      // 8. 12 Hourly Fortunes (12 Shichen breakdown)
      const qingLongStart = DAY_BRANCH_QINGLONG_START[dayBranchIdx];
      const nowH = new Date().getHours();

      const hours = SHICHEN_TABLE.map((sh, i) => {
        const deityOffset = (i - qingLongStart + 12) % 12;
        const deity = HOUR_DEITIES[deityOffset];

        // Check if current hour
        let isCurrent = false;
        if (sh.startH === 23) {
          isCurrent = nowH >= 23 || nowH < 1;
        } else {
          isCurrent = nowH >= sh.startH && nowH < sh.endH;
        }

        return {
          ...sh,
          deity,
          isCurrent,
          isAuspicious: deity.type === '吉'
        };
      });

      // 9. Deity Connection from JiuTian Arcana (defaultCards)
      const deityOracle = TongShuEngine.pickDeityForDay(dayStemIdx, dayBranchIdx, officerIdx);

      // Gregorian String representation
      const thaiDays = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
      const thaiMonths = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ];
      const gregorianThai = `${thaiDays[date.getDay()]}ที่ ${day} ${thaiMonths[month]} พ.ศ. ${year + 543} (ค.ศ. ${year})`;
      const isoDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      return {
        date,
        isoDate,
        gregorianThai,
        weekdayName: thaiDays[date.getDay()],
        lunarYearName,
        lunarMonthNum,
        lunarDayNum,
        lunarDateString,
        lunarDayName,
        dayStem,
        dayBranch,
        dayGanZhi,
        naYin,
        officer,
        mansion,
        currentSolarTerm: currentSolarTerm.name,
        caiShenDir,
        xiShenDir,
        guiShenDir,
        clashZodiac,
        shaDir,
        baseScore,
        isYellowPath,
        dayStatusTitle,
        hours,
        deityOracle
      };
    },

    /**
     * Intelligently selects an authentic JiuTian deity card for the day
     */
    pickDeityForDay: function (stemIdx, branchIdx, officerIdx) {
      const cards = window.DEFAULT_CARDS || [];
      if (!cards || cards.length === 0) {
        return {
          name: 'พระแม่จิ่วเทียนเสวียนหนี่ว์ (九天玄女)',
          element: 'ธาตุน้ำ (Water)',
          quote: '“ผู้ที่รู้จักรอด้วยปัญญา ย่อมมองเห็นความจริงแห่งฟ้าดิน”',
          image: 'CardImage/Major2.png',
          advice: 'ตั้งมั่นในศีลธรรม มีสติในการตัดสินใจ และเปิดใจรับฟังปัญญาแห่งจักรวาล',
          blessing: 'ขออัญเชิญบารมีพระแม่เก้าสวรรค์ ประทานปัญญา ความรุ่งเรือง และความคุ้มครอง',
          luckyNumbers: '2, 6, 8, 9',
          luckyColor: 'ม่วงประกายทอง & น้ำเงินคราม'
        };
      }

      // Preferred high deities in Major Arcana
      const majorDeityIds = [3, 15, 5, 2, 1, 8, 9, 12, 19, 21, 22]; // JiuTian, GuanYin, Jade Emperor, Laozi, Ji Gong, Nezha, Wukong, Bao Zheng, etc.
      const pickId = majorDeityIds[(stemIdx + branchIdx + officerIdx) % majorDeityIds.length];
      const found = cards.find(c => c.id === pickId) || cards[2] || cards[0];

      // Lucky numbers & colors
      const luckyNums = [
        `${(stemIdx + 1)}, ${(branchIdx + 3)}, 8`,
        `1, 6, 8, ${(officerIdx + 2)}`,
        `2, 7, ${(stemIdx + 4)}, 9`,
        `3, 5, 8, ${(branchIdx + 1)}`
      ][(stemIdx + officerIdx) % 4];

      return {
        id: found.id,
        name: found.name,
        element: found.element,
        quote: found.advice || '“จงก้าวเดินด้วยปัญญาและความเมตตา พลังฟ้าดินย่อมเกื้อหนุนเสมอ”',
        image: found.image || 'CardImage/Major2.png',
        advice: found.general_meaning ? found.general_meaning.slice(0, 150) + '...' : 'ทำจิตใจให้ผ่องใส เปิดรับโอกาสใหม่ๆ ด้วยความรอบคอบ',
        blessing: 'ขอให้พลังแห่งองค์เทพนำพาความสำเร็จ สุขภาพแข็งแรง และโชคลาภพูนทวี',
        luckyNumbers: luckyNums,
        luckyColor: STEMS[stemIdx].luckyColor
      };
    },

    /**
     * Search 30-60 days ahead for top auspicious dates based on a purpose
     */
    findAuspiciousDates: function (purposeKey, startDate, dayRange = 35) {
      const preset = PURPOSE_PRESETS[purposeKey] || PURPOSE_PRESETS.opening;
      const base = startDate instanceof Date ? new Date(startDate) : new Date();
      const results = [];

      for (let i = 0; i < dayRange; i++) {
        const testD = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
        const info = TongShuEngine.calculate(testD);

        // Calculate specific fitness score for this purpose
        let fitScore = 60;

        // Officer bonus
        const offPos = preset.favOfficers.indexOf(info.officer.zh);
        if (preset.favOfficers.includes(info.officer.zh) || preset.favOfficers.some(idx => DAY_OFFICERS[idx]?.zh === info.officer.zh)) {
          fitScore += 24;
        } else if (info.officer.rating >= 4) {
          fitScore += 14;
        } else if (info.officer.rating <= 2) {
          fitScore -= 20;
        }

        // Branch bonus
        if (preset.boostBranches.includes(info.dayBranch.zh) || preset.boostBranches.some(bIdx => BRANCHES[bIdx]?.zh === info.dayBranch.zh)) {
          fitScore += 10;
        }

        // 28 Mansions bonus
        if (info.mansion.auspice.includes('吉')) {
          fitScore += 10;
        } else {
          fitScore -= 8;
        }

        fitScore = Math.min(99, Math.max(35, fitScore));

        // Find best Golden Hours on that day
        const goldenHours = info.hours
          .filter(h => h.isAuspicious)
          .map(h => `${h.nameTh.split(' ')[0]} (${h.timeRange})`)
          .slice(0, 3);

        results.push({
          info,
          fitScore,
          goldenHours,
          preset
        });
      }

      // Sort by fitScore descending
      results.sort((a, b) => b.fitScore - a.fitScore);
      return results.slice(0, 6);
    },

    /**
     * Get monthly calendar matrix for a given year & month (1-indexed month)
     */
    getMonthDays: function (year, month1Indexed) {
      const firstDay = new Date(year, month1Indexed - 1, 1);
      const lastDay = new Date(year, month1Indexed, 0);
      const totalDays = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

      const days = [];
      for (let d = 1; d <= totalDays; d++) {
        const dateObj = new Date(year, month1Indexed - 1, d);
        const info = TongShuEngine.calculate(dateObj);
        days.push({
          dayNum: d,
          dateObj,
          info
        });
      }

      return {
        year,
        month: month1Indexed,
        startingDayOfWeek,
        totalDays,
        days
      };
    }
  };

  // Expose engine to window
  window.TongShuEngine = TongShuEngine;

  // ==========================================================================
  // 3. UI CONTROLLER FOR TONG SHU APP VIEW
  // ==========================================================================

  const TongShuApp = {
    currentDate: new Date(),
    currentMode: 'basic', // 'basic' (Today's hourly only) | 'expert' (Full almanac, finder, calendar)
    currentSubView: 'almanac', // 'almanac' | 'finder' | 'calendar'
    currentPurpose: 'opening',
    calendarYear: new Date().getFullYear(),
    calendarMonth: new Date().getMonth() + 1,
    clockInterval: null,

    isLoggedIn: function () {
      return !!(window.AuthManager && window.AuthManager.isLoggedIn());
    },

    init: function () {
      this.bindDOMElements();
      this.bindEvents();
      this.startLiveClock();
      this.switchMode('basic', false);
      this.render();
      console.log('[TongShu] Auspicious Almanac Engine initialized successfully.');
    },

    onAuthStateChange: function (isLoggedIn) {
      const lockBadge = document.getElementById('tsExpertLockBadge');
      if (lockBadge) {
        lockBadge.style.display = isLoggedIn ? 'none' : 'inline-flex';
      }
      if (!isLoggedIn && this.currentMode === 'expert') {
        this.switchMode('basic', true);
      }
    },

    switchMode: function (mode, shouldRender = true) {
      if (mode === 'expert' && !this.isLoggedIn()) {
        if (window.AuthManager && typeof window.AuthManager.openModal === 'function') {
          window.AuthManager.openModal('login', 'tongshu_expert');
        }
        mode = 'basic';
      }
      this.currentMode = mode;
      const isExpert = mode === 'expert';
      const isAuth = this.isLoggedIn();

      const lockBadge = document.getElementById('tsExpertLockBadge');
      if (lockBadge) {
        lockBadge.style.display = isAuth ? 'none' : 'inline-flex';
      }

      const basicBtn = document.getElementById('tsModeBasicBtn');
      const expertBtn = document.getElementById('tsModeExpertBtn');
      const basicInfo = document.getElementById('tsModeBasicInfo');
      const expertInfo = document.getElementById('tsModeExpertInfo');

      if (basicBtn) basicBtn.classList.toggle('active', !isExpert);
      if (expertBtn) expertBtn.classList.toggle('active', isExpert);
      if (basicInfo) basicInfo.classList.toggle('hidden', isExpert);
      if (expertInfo) expertInfo.classList.toggle('hidden', !isExpert);

      const toolbarCard = document.getElementById('tsToolbarCard');
      const heroCard = document.getElementById('tsHeroCard');
      const activitiesGrid = document.getElementById('tsActivitiesGrid');
      const directionsGrid = document.getElementById('tsDirectionsGrid');
      const deityCardSection = document.getElementById('tsDeityCardSection');

      if (!isExpert) {
        // Basic Mode: Force Today & Daily Almanac subview, show ONLY Hourly (12 Shichen) section
        this.currentDate = new Date();
        this.currentSubView = 'almanac';
        if (this.el && this.el.subViewAlmanac) this.el.subViewAlmanac.classList.remove('hidden');
        if (this.el && this.el.subViewFinder) this.el.subViewFinder.classList.add('hidden');
        if (this.el && this.el.subViewCalendar) this.el.subViewCalendar.classList.add('hidden');

        if (toolbarCard) toolbarCard.style.display = 'none';
        if (heroCard) heroCard.style.display = 'none';
        if (activitiesGrid) activitiesGrid.style.display = 'none';
        if (directionsGrid) directionsGrid.style.display = 'none';
        if (deityCardSection) deityCardSection.style.display = 'none';
      } else {
        // Expert Mode: Show full toolbar & daily sections
        if (toolbarCard) toolbarCard.style.display = '';
        if (heroCard) heroCard.style.display = '';
        if (activitiesGrid) activitiesGrid.style.display = '';
        if (directionsGrid) directionsGrid.style.display = '';
        if (deityCardSection) deityCardSection.style.display = '';
      }

      if (shouldRender) {
        this.render();
      }
    },

    bindDOMElements: function () {
      this.el = {
        view: document.getElementById('tongShuAppView'),
        datePicker: document.getElementById('tsDatePicker'),
        prevDayBtn: document.getElementById('tsPrevDayBtn'),
        nextDayBtn: document.getElementById('tsNextDayBtn'),
        todayBtn: document.getElementById('tsTodayBtn'),
        copyDailyBtn: document.getElementById('tsCopyDailyBtn'),
        shareLineBtn: document.getElementById('tsShareLineBtn'),

        // Subtabs
        subTabAlmanac: document.getElementById('tsSubTabAlmanac'),
        subTabFinder: document.getElementById('tsSubTabFinder'),
        subTabCalendar: document.getElementById('tsSubTabCalendar'),

        // Subview Containers
        subViewAlmanac: document.getElementById('tsSubViewAlmanac'),
        subViewFinder: document.getElementById('tsSubViewFinder'),
        subViewCalendar: document.getElementById('tsSubViewCalendar'),

        // Daily View Elements
        heroDateGregorian: document.getElementById('tsHeroDateGregorian'),
        heroDateLunar: document.getElementById('tsHeroDateLunar'),
        heroDayGanZhi: document.getElementById('tsHeroDayGanZhi'),
        heroScoreBadge: document.getElementById('tsHeroScoreBadge'),
        heroStatusTitle: document.getElementById('tsHeroStatusTitle'),
        heroSolarTermBadge: document.getElementById('tsHeroSolarTermBadge'),
        heroOfficerBadge: document.getElementById('tsHeroOfficerBadge'),
        heroMansionBadge: document.getElementById('tsHeroMansionBadge'),
        heroNaYinBadge: document.getElementById('tsHeroNaYinBadge'),
        heroOfficerSummary: document.getElementById('tsHeroOfficerSummary'),

        // Activities
        suitableTagsList: document.getElementById('tsSuitableTagsList'),
        tabooTagsList: document.getElementById('tsTabooTagsList'),

        // Directions & Clash
        dirCaiShen: document.getElementById('tsDirCaiShen'),
        dirXiShen: document.getElementById('tsDirXiShen'),
        dirGuiShen: document.getElementById('tsDirGuiShen'),
        clashZodiac: document.getElementById('tsClashZodiac'),
        shaDir: document.getElementById('tsShaDir'),

        // Hourly Fortune
        hoursGrid: document.getElementById('tsHoursGrid'),
        liveClockText: document.getElementById('tsLiveClockText'),
        currentShichenBadge: document.getElementById('tsCurrentShichenBadge'),

        // Deity Oracle Card
        deityCardImage: document.getElementById('tsDeityCardImage'),
        deityCardName: document.getElementById('tsDeityCardName'),
        deityCardElement: document.getElementById('tsDeityCardElement'),
        deityCardQuote: document.getElementById('tsDeityCardQuote'),
        deityCardAdvice: document.getElementById('tsDeityCardAdvice'),
        deityLuckyNumbers: document.getElementById('tsDeityLuckyNumbers'),
        deityLuckyColor: document.getElementById('tsDeityLuckyColor'),
        prayBlessingBtn: document.getElementById('tsPrayBlessingBtn'),
        jumpToReadingBtn: document.getElementById('tsJumpToReadingBtn'),

        // Purpose Finder Elements
        purposePills: document.querySelectorAll('.ts-purpose-pill'),
        finderResultsList: document.getElementById('tsFinderResultsList'),

        // Monthly Calendar Elements
        calMonthSelect: document.getElementById('tsCalMonthSelect'),
        calYearSelect: document.getElementById('tsCalYearSelect'),
        calPrevMonthBtn: document.getElementById('tsCalPrevMonthBtn'),
        calNextMonthBtn: document.getElementById('tsCalNextMonthBtn'),
        calDaysGrid: document.getElementById('tsCalDaysGrid')
      };
    },

    bindEvents: function () {
      const self = this;

      // Date Picker Sync
      if (this.el.datePicker) {
        this.el.datePicker.addEventListener('change', (e) => {
          if (e.target.value) {
            const parts = e.target.value.split('-');
            self.currentDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            self.render();
          }
        });
      }

      // Prev / Next / Today
      if (this.el.prevDayBtn) {
        this.el.prevDayBtn.addEventListener('click', () => {
          self.currentDate.setDate(self.currentDate.getDate() - 1);
          self.render();
        });
      }
      if (this.el.nextDayBtn) {
        this.el.nextDayBtn.addEventListener('click', () => {
          self.currentDate.setDate(self.currentDate.getDate() + 1);
          self.render();
        });
      }
      if (this.el.todayBtn) {
        this.el.todayBtn.addEventListener('click', () => {
          self.currentDate = new Date();
          self.render();
        });
      }

      // Subtab Switches
      if (this.el.subTabAlmanac) {
        this.el.subTabAlmanac.addEventListener('click', () => self.switchSubView('almanac'));
      }
      if (this.el.subTabFinder) {
        this.el.subTabFinder.addEventListener('click', () => self.switchSubView('finder'));
      }
      if (this.el.subTabCalendar) {
        this.el.subTabCalendar.addEventListener('click', () => self.switchSubView('calendar'));
      }

      // Purpose Pills
      if (this.el.purposePills) {
        this.el.purposePills.forEach(pill => {
          pill.addEventListener('click', () => {
            self.el.purposePills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            self.currentPurpose = pill.getAttribute('data-purpose') || 'opening';
            self.renderFinder();
          });
        });
      }

      // Calendar Navigation
      if (this.el.calPrevMonthBtn) {
        this.el.calPrevMonthBtn.addEventListener('click', () => {
          self.calendarMonth--;
          if (self.calendarMonth < 1) {
            self.calendarMonth = 12;
            self.calendarYear--;
          }
          self.renderCalendar();
        });
      }
      if (this.el.calNextMonthBtn) {
        this.el.calNextMonthBtn.addEventListener('click', () => {
          self.calendarMonth++;
          if (self.calendarMonth > 12) {
            self.calendarMonth = 1;
            self.calendarYear++;
          }
          self.renderCalendar();
        });
      }
      if (this.el.calMonthSelect) {
        this.el.calMonthSelect.addEventListener('change', (e) => {
          self.calendarMonth = parseInt(e.target.value);
          self.renderCalendar();
        });
      }
      if (this.el.calYearSelect) {
        this.el.calYearSelect.addEventListener('change', (e) => {
          self.calendarYear = parseInt(e.target.value);
          self.renderCalendar();
        });
      }

      // Pray Blessing Modal / Animation
      if (this.el.prayBlessingBtn) {
        this.el.prayBlessingBtn.addEventListener('click', () => {
          self.showBlessingToast();
        });
      }

      // Jump to Reading Tab with Deity Card Context
      if (this.el.jumpToReadingBtn) {
        this.el.jumpToReadingBtn.addEventListener('click', () => {
          const tabReadingBtn = document.getElementById('tabReadingBtn');
          if (tabReadingBtn) tabReadingBtn.click();
          // Populate question input with deity focus
          const questionInput = document.getElementById('userQuestionInput');
          if (questionInput) {
            questionInput.value = `ขอคำชี้แนะและพลังมงคลประจำวัน จากองค์เทพผู้พิทักษ์แห่งวันนี้`;
          }
        });
      }

      // Copy Daily Summary
      if (this.el.copyDailyBtn) {
        this.el.copyDailyBtn.addEventListener('click', () => self.copyDailySummary());
      }

      // Share to LINE
      if (this.el.shareLineBtn) {
        this.el.shareLineBtn.addEventListener('click', () => self.shareToLine());
      }
    },

    switchSubView: function (subViewName) {
      this.currentSubView = subViewName;
      const { subTabAlmanac, subTabFinder, subTabCalendar, subViewAlmanac, subViewFinder, subViewCalendar } = this.el;

      [subTabAlmanac, subTabFinder, subTabCalendar].forEach(t => t?.classList.remove('active'));
      [subViewAlmanac, subViewFinder, subViewCalendar].forEach(v => v?.classList.add('hidden'));

      if (subViewName === 'almanac') {
        subTabAlmanac?.classList.add('active');
        subViewAlmanac?.classList.remove('hidden');
        this.renderDailyAlmanac();
      } else if (subViewName === 'finder') {
        subTabFinder?.classList.add('active');
        subViewFinder?.classList.remove('hidden');
        this.renderFinder();
      } else if (subViewName === 'calendar') {
        subTabCalendar?.classList.add('active');
        subViewCalendar?.classList.remove('hidden');
        this.renderCalendar();
      }
    },

    startLiveClock: function () {
      const self = this;
      this.updateLiveClockText();
      if (this.clockInterval) clearInterval(this.clockInterval);
      this.clockInterval = setInterval(() => {
        self.updateLiveClockText();
      }, 30000);
    },

    updateLiveClockText: function () {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const hourVal = now.getHours();

      // Find current shichen
      let currentSh = SHICHEN_TABLE[0];
      for (const sh of SHICHEN_TABLE) {
        if (sh.startH === 23) {
          if (hourVal >= 23 || hourVal < 1) { currentSh = sh; break; }
        } else if (hourVal >= sh.startH && hourVal < sh.endH) {
          currentSh = sh; break;
        }
      }

      if (this.el.liveClockText) {
        this.el.liveClockText.innerHTML = `<i class="fa-regular fa-clock"></i> เวลาปัจจุบัน <strong>${h}:${m}</strong> น.`;
      }
      if (this.el.currentShichenBadge) {
        this.el.currentShichenBadge.innerHTML = `<i class="fa-solid fa-hourglass-half"></i> ขณะนี้: <strong>${currentSh.nameTh}</strong> <span class="ts-shichen-badge-time">(${currentSh.timeRange})</span>`;
      }
    },

    render: function () {
      // Sync date picker
      if (this.el.datePicker) {
        const y = this.currentDate.getFullYear();
        const m = String(this.currentDate.getMonth() + 1).padStart(2, '0');
        const d = String(this.currentDate.getDate()).padStart(2, '0');
        this.el.datePicker.value = `${y}-${m}-${d}`;
      }

      if (this.currentSubView === 'almanac') {
        this.renderDailyAlmanac();
      } else if (this.currentSubView === 'finder') {
        this.renderFinder();
      } else if (this.currentSubView === 'calendar') {
        this.renderCalendar();
      }
    },

    renderDailyAlmanac: function () {
      if (this.currentMode === 'basic') {
        this.currentDate = new Date();
      }
      const info = TongShuEngine.calculate(this.currentDate);
      const hourlyTitle = document.getElementById('tsHourlySectionTitle');
      if (hourlyTitle) {
        if (this.currentMode === 'basic') {
          hourlyTitle.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i> ฤกษ์ยามวันนี้ รายชั่วโมง (${info.gregorianThai})`;
        } else {
          hourlyTitle.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i> ฤกษ์ยามมงคล 12 ชั่วยาม (${info.gregorianThai})`;
        }
      }

      // Hero Section
      if (this.el.heroDateGregorian) this.el.heroDateGregorian.textContent = info.gregorianThai;
      if (this.el.heroDateLunar) this.el.heroDateLunar.textContent = info.lunarDateString;
      if (this.el.heroDayGanZhi) {
        this.el.heroDayGanZhi.innerHTML = `วัน <strong>${info.dayGanZhi}</strong> (${info.dayStem.th} • ${info.dayBranch.th})`;
      }
      if (this.el.heroScoreBadge) {
        this.el.heroScoreBadge.innerHTML = `<i class="fa-solid fa-star"></i> ความมงคล ${info.baseScore}% (${info.officer.stars})`;
      }
      if (this.el.heroStatusTitle) {
        this.el.heroStatusTitle.textContent = info.dayStatusTitle;
        this.el.heroStatusTitle.className = info.isYellowPath ? 'ts-status-title gold' : 'ts-status-title caution';
      }

      if (this.el.heroSolarTermBadge) this.el.heroSolarTermBadge.textContent = `สารท ${info.currentSolarTerm}`;
      if (this.el.heroOfficerBadge) this.el.heroOfficerBadge.textContent = `12 เทพผู้พิทักษ์: ${info.officer.zh} (${info.officer.th})`;
      if (this.el.heroMansionBadge) this.el.heroMansionBadge.textContent = `28 ดาวฤกษ์: ${info.mansion.zh} (${info.mansion.nameTh})`;
      if (this.el.heroNaYinBadge) this.el.heroNaYinBadge.textContent = `ธาตุสถิต: ${info.naYin}`;
      if (this.el.heroOfficerSummary) this.el.heroOfficerSummary.textContent = `${info.officer.desc} • ${info.mansion.desc}`;

      // Activities: Suitable (宜) & Taboo (忌)
      if (this.el.suitableTagsList) {
        this.el.suitableTagsList.innerHTML = info.officer.suitable.map(act => `
          <span class="ts-act-tag suitable"><i class="fa-solid fa-circle-check"></i> ${act}</span>
        `).join('');
      }
      if (this.el.tabooTagsList) {
        this.el.tabooTagsList.innerHTML = info.officer.taboo.map(act => `
          <span class="ts-act-tag taboo"><i class="fa-solid fa-circle-xmark"></i> ${act}</span>
        `).join('');
      }

      // Auspicious Directions & Clash
      if (this.el.dirCaiShen) this.el.dirCaiShen.textContent = info.caiShenDir;
      if (this.el.dirXiShen) this.el.dirXiShen.textContent = info.xiShenDir;
      if (this.el.dirGuiShen) this.el.dirGuiShen.textContent = info.guiShenDir;
      if (this.el.clashZodiac) this.el.clashZodiac.textContent = `ชงปี ${info.clashZodiac}`;
      if (this.el.shaDir) this.el.shaDir.textContent = info.shaDir;

      // 12 Shichen Hours Grid
      if (this.el.hoursGrid) {
        this.el.hoursGrid.innerHTML = info.hours.map(h => {
          const cardClass = h.isCurrent ? 'ts-hour-card current-active' : 'ts-hour-card';
          const typeBadge = h.isAuspicious ? 'badge-auspicious' : 'badge-danger';
          const statusText = h.isAuspicious ? 'มงคล' : 'ควรระวัง';
          return `
            <div class="${cardClass}">
              <div class="ts-hour-header">
                <span class="ts-hour-name">${h.nameTh}</span>
                <div class="ts-hour-badges-wrap">
                  ${h.isCurrent ? '<span class="ts-hour-now-pill"><i class="fa-solid fa-circle-dot"></i> ขณะนี้</span>' : ''}
                  <span class="ts-hour-badge ${typeBadge}">${statusText}</span>
                </div>
              </div>
              <div class="ts-hour-time">
                <i class="fa-regular fa-clock"></i> <span>${h.timeRange}</span>
              </div>
              <div class="ts-hour-deity">
                <i class="fa-regular fa-star"></i> <strong>${h.deity.th} (${h.deity.zh})</strong>
              </div>
              <div class="ts-hour-desc">${h.deity.desc}</div>
            </div>
          `;
        }).join('');
      }

      // Daily Deity Oracle Card
      const deity = info.deityOracle;
      if (this.el.deityCardImage) this.el.deityCardImage.src = deity.image;
      if (this.el.deityCardName) this.el.deityCardName.textContent = deity.name;
      if (this.el.deityCardElement) this.el.deityCardElement.textContent = deity.element;
      if (this.el.deityCardQuote) this.el.deityCardQuote.textContent = deity.quote;
      if (this.el.deityCardAdvice) this.el.deityCardAdvice.textContent = deity.advice;
      if (this.el.deityLuckyNumbers) this.el.deityLuckyNumbers.textContent = deity.luckyNumbers;
      if (this.el.deityLuckyColor) this.el.deityLuckyColor.textContent = deity.luckyColor;
    },

    renderFinder: function () {
      const results = TongShuEngine.findAuspiciousDates(this.currentPurpose, this.currentDate, 35);
      const preset = PURPOSE_PRESETS[this.currentPurpose];

      if (!this.el.finderResultsList) return;

      this.el.finderResultsList.innerHTML = `
        <div class="ts-finder-intro">
          <h4><i class="fa-solid ${preset.icon}"></i> ผลการสแกนฤกษ์มงคล: ${preset.title}</h4>
          <p>${preset.desc} (คัดสรร 6 วันที่ดีที่สุดในรอบ 35 วันข้างหน้า)</p>
        </div>
        <div class="ts-finder-cards-grid">
          ${results.map((r, idx) => {
            const info = r.info;
            const rankLabel = idx === 0 ? '🏆 ฤกษ์มงคลอันดับ 1 (Best Choice)' : `อันดับที่ ${idx + 1}`;
            const rankClass = idx === 0 ? 'ts-finder-card best-pick' : 'ts-finder-card';
            return `
              <div class="${rankClass}">
                <div class="ts-finder-card-header">
                  <span class="ts-finder-rank">${rankLabel}</span>
                  <span class="ts-finder-score"><i class="fa-solid fa-star"></i> คะแนนฤกษ์ ${r.fitScore}%</span>
                </div>
                <div class="ts-finder-date-row">
                  <div class="ts-finder-date-th">${info.gregorianThai}</div>
                  <div class="ts-finder-date-lunar">${info.lunarDateString}</div>
                </div>
                <div class="ts-finder-tags">
                  <span class="ts-badge-pill gold"><i class="fa-solid fa-gem"></i> ${info.officer.th}</span>
                  <span class="ts-badge-pill emerald"><i class="fa-solid fa-compass"></i> ทิศโชค: ${info.caiShenDir}</span>
                  <span class="ts-badge-pill warning"><i class="fa-solid fa-triangle-exclamation"></i> ชงปี${info.clashZodiac}</span>
                </div>
                <div class="ts-finder-golden-hours">
                  <strong><i class="fa-solid fa-clock"></i> ชั่วยามทอง:</strong> ${r.goldenHours.join(', ') || 'ยามอู่ (11:00-12:59)'}
                </div>
                <button class="ts-btn ts-btn-inspect" data-date="${info.isoDate}">
                  <i class="fa-solid fa-eye"></i> ดูรายละเอียดฤกษ์ของวันนี้
                </button>
              </div>
            `;
          }).join('')}
        </div>
      `;

      // Attach click listeners to inspect buttons
      this.el.finderResultsList.querySelectorAll('.ts-btn-inspect').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const iso = btn.getAttribute('data-date');
          if (iso) {
            const parts = iso.split('-');
            this.currentDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            this.switchSubView('almanac');
          }
        });
      });
    },

    renderCalendar: function () {
      const year = this.calendarYear;
      const month = this.calendarMonth;

      // Populate year/month selects if empty
      if (this.el.calYearSelect && this.el.calYearSelect.options.length === 0) {
        for (let y = 2024; y <= 2030; y++) {
          const opt = document.createElement('option');
          opt.value = y;
          opt.textContent = `พ.ศ. ${y + 543} (${y})`;
          if (y === year) opt.selected = true;
          this.el.calYearSelect.appendChild(opt);
        }
      }
      if (this.el.calMonthSelect) {
        this.el.calMonthSelect.value = month;
      }

      const calData = TongShuEngine.getMonthDays(year, month);
      if (!this.el.calDaysGrid) return;

      const weekdaysHeader = `
        <div class="ts-cal-cell-header sunday">อา.</div>
        <div class="ts-cal-cell-header">จ.</div>
        <div class="ts-cal-cell-header">อ.</div>
        <div class="ts-cal-cell-header">พ.</div>
        <div class="ts-cal-cell-header">พฤ.</div>
        <div class="ts-cal-cell-header">ศ.</div>
        <div class="ts-cal-cell-header saturday">ส.</div>
      `;

      let cellsHtml = '';
      // Leading empty cells
      for (let i = 0; i < calData.startingDayOfWeek; i++) {
        cellsHtml += `<div class="ts-cal-day-cell empty"></div>`;
      }

      const todayStr = new Date().toISOString().slice(0, 10);
      const selectedStr = this.currentDate.toISOString().slice(0, 10);

      calData.days.forEach(d => {
        const info = d.info;
        const iso = info.isoDate;
        const isToday = iso === todayStr;
        const isSelected = iso === selectedStr;
        const dotClass = info.isYellowPath ? 'dot-gold' : 'dot-caution';

        let cellClass = 'ts-cal-day-cell';
        if (isToday) cellClass += ' is-today';
        if (isSelected) cellClass += ' is-selected';

        // Auspicious & moderate hours calculation for this day
        const auspiciousHours = info.hours
          .filter(h => h.isAuspicious)
          .map(h => {
            const isModerate = h.deity.zh === '司命';
            const levelClass = isModerate ? 'moderate' : 'auspicious';
            const levelText = isModerate ? 'ปานกลาง' : 'มงคล';
            const timeStr = `${h.startH}.00-${h.endH}.00`;
            return {
              ...h,
              levelClass,
              levelText,
              timeStr
            };
          });

        // Prioritize daytime/active waking hours (07:00 - 22:00)
        const daytimeHours = auspiciousHours.filter(h => h.startH >= 7 && h.startH <= 22);
        const displayHours = (daytimeHours.length >= 2 ? daytimeHours : auspiciousHours).slice(0, 2);
        const remainingCount = auspiciousHours.length - displayHours.length;

        const hoursTooltip = auspiciousHours.map(h => `• ${h.timeStr} ${h.levelText} (${h.deity.th})`).join('\n');
        const cellTitle = `${info.gregorianThai}\n${info.dayStatusTitle}\n\nช่วงเวลามงคล:\n${hoursTooltip}`;
        const lunarText = info.lunarDayNum === 1 ? '初一' : (info.lunarDayNum === 15 ? '十五' : `${info.lunarDayNum}ค่ำ`);

        cellsHtml += `
          <div class="${cellClass}" data-date="${iso}" title="${cellTitle}">
            <div class="ts-cal-day-top">
              <div class="ts-cal-num-wrap">
                <span class="ts-cal-gregorian-num">${d.dayNum}</span>
                <span class="ts-cal-lunar-mini">${lunarText}</span>
              </div>
              <div class="ts-cal-top-right">
                <span class="ts-cal-officer-mini">${info.officer.zh}</span>
                <span class="ts-cal-status-dot ${dotClass}" title="${info.officer.th}"></span>
              </div>
            </div>
            <div class="ts-cal-hours-box">
              ${displayHours.map(h => `
                <div class="ts-cal-hour-row" title="${h.timeStr} ${h.levelText} (${h.deity.th})">
                  <span class="ts-cal-hdot ${h.levelClass}"></span>
                  <span class="ts-cal-htime">${h.timeStr}</span>
                  <span class="ts-cal-hlabel ${h.levelClass}">${h.levelText}</span>
                </div>
              `).join('')}
              ${remainingCount > 0 ? `<div class="ts-cal-more-hours">+${remainingCount} ยาม</div>` : ''}
            </div>
          </div>
        `;
      });

      this.el.calDaysGrid.innerHTML = weekdaysHeader + cellsHtml;

      // Attach cell click events
      this.el.calDaysGrid.querySelectorAll('.ts-cal-day-cell:not(.empty)').forEach(cell => {
        cell.addEventListener('click', () => {
          const iso = cell.getAttribute('data-date');
          if (iso) {
            const parts = iso.split('-');
            this.currentDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            this.switchSubView('almanac');
          }
        });
      });
    },

    showBlessingToast: function () {
      const deity = TongShuEngine.calculate(this.currentDate).deityOracle;
      let toast = document.getElementById('tsBlessingToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'tsBlessingToast';
        toast.className = 'ts-blessing-toast animate-bounce-in';
        document.body.appendChild(toast);
      }

      toast.innerHTML = `
        <div class="ts-toast-card">
          <div class="ts-toast-icon"><i class="fa-solid fa-hands-praying"></i></div>
          <div class="ts-toast-content">
            <h4>คำอำนวยพรมงคลประจำวัน ✨</h4>
            <div class="ts-toast-deity">${deity.name}</div>
            <p class="ts-toast-quote">${deity.quote}</p>
            <div class="ts-toast-bless">${deity.blessing}</div>
            <div class="ts-toast-lucky">เลขมงคล: <strong>${deity.luckyNumbers}</strong> • สีมงคล: <strong>${deity.luckyColor}</strong></div>
          </div>
          <button class="ts-toast-close" onclick="document.getElementById('tsBlessingToast').classList.remove('show')">&times;</button>
        </div>
      `;

      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 7000);
    },

    copyDailySummary: function () {
      const info = TongShuEngine.calculate(this.currentDate);
      const text = `✨ ปฏิทินฤกษ์ยามจีน TongShu (通書) - DESTINY ARCANA ✨
━━━━━━━━━━━━━━━━━━━━
📅 วันที่: ${info.gregorianThai}
🏮 จีน: ${info.lunarDateString}
☯️ พลังฟ้าดิน: วัน${info.dayGanZhi} (${info.dayStem.th} • ${info.dayBranch.th})
🌟 สถานะฤกษ์: ${info.dayStatusTitle} (${info.baseScore}%)
🛡️ 12 เทพผู้พิทักษ์: ${info.officer.zh} (${info.officer.th})
✨ 28 ดาวนักษัตร: ${info.mansion.zh} (${info.mansion.nameTh})

✅ 宜 สิ่งที่ควรทำ:
${info.officer.suitable.map(s => ' • ' + s).join('\n')}

❌ 忌 สิ่งที่ควรละเว้น:
${info.officer.taboo.map(t => ' • ' + t).join('\n')}

🧭 ทิศมงคลประจำวัน:
💰 ทิศเทพโชคลาภ (财神): ${info.caiShenDir}
❤️ ทิศเทพยินดี (喜神): ${info.xiShenDir}
👑 ทิศเทพผู้อุปถัมภ์ (贵神): ${info.guiShenDir}
⚠️ ปีชง: ชงปี${info.clashZodiac} (ทิศอัปมงคล: ${info.shaDir})

🪷 เทพเจ้าประจำวัน: ${info.deityOracle.name}
${info.deityOracle.quote}
🔢 เลขมงคล: ${info.deityOracle.luckyNumbers}
🎨 สีมงคล: ${info.deityOracle.luckyColor}
━━━━━━━━━━━━━━━━━━━━
ดูดวงไพ่และคำนวณฤกษ์ยามแม่นยำได้ที่ระบบ DESTINY ARCANA`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          alert('คัดลอกสรุปฤกษ์ยามประจำวันเรียบร้อยแล้ว! สามารถนำไปแชร์ใน LINE ได้ทันที');
        }).catch(() => {
          prompt('คัดลอกข้อความสรุปฤกษ์ยามด้านล่าง:', text);
        });
      } else {
        prompt('คัดลอกข้อความสรุปฤกษ์ยามด้านล่าง:', text);
      }
    },

    shareToLine: function () {
      const info = TongShuEngine.calculate(this.currentDate);
      const summary = `📅 ฤกษ์ยามจีน TongShu (${info.gregorianThai}): ${info.dayStatusTitle} | 12เทพ: ${info.officer.zh} | ทิศโชค: ${info.caiShenDir} | ชงปี: ${info.clashZodiac}`;
      const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(summary)}`;
      window.open(url, '_blank');
    },

    onTabShow: function () {
      const isAuth = this.isLoggedIn();
      this.onAuthStateChange(isAuth);
      if (this.currentMode === 'basic') {
        this.currentDate = new Date();
      }
      this.updateLiveClockText();
      this.render();
    }
  };

  // Expose App controller
  window.TongShuApp = TongShuApp;

  // Auto initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TongShuApp.init());
  } else {
    TongShuApp.init();
  }

})();
