/**
 * ============================================================================
 * แม่หมอติ๊ดติ๊ด (DESTINY ARCANA) - THE MAEMOR TIDTID CAT ARCHETYPE SYSTEM
 * 5 Structures (五行格局) & 10 Cat Profiles (十神) Database & Resolver
 * ============================================================================
 */

(function () {
  'use strict';

  // 1. Five Cat Guilds (5 Structures / 五行格局)
  const CAT_GUILDS = {
    thinkers: {
      key: 'thinkers',
      nameZh: '印星 (Resource)',
      nameTh: 'กิลด์ปราชญ์ผู้นุ่มฟู (The Thinkers)',
      elementRole: 'resource',
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.15)',
      icon: 'fa-brain',
      desc: 'ผู้สั่งสมความรู้ ปัญญา สัญชาตญาณ และความสงบสุขุม ลึกซึ้งและรอบคอบ',
      tenGods: ['偏印', '正印']
    },
    managers: {
      key: 'managers',
      nameZh: '官殺 (Power)',
      nameTh: 'กิลด์ผู้พิทักษ์แห่งวินัย (The Managers)',
      elementRole: 'power',
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.15)',
      icon: 'fa-chess-rook',
      desc: 'ผู้นำแห่งระเบียบ ความเด็ดขาด ยุติธรรม กล้าตัดสินใจและรับผิดชอบสูง',
      tenGods: ['正官', '七殺']
    },
    creators: {
      key: 'creators',
      nameZh: '食傷 (Output)',
      nameTh: 'กิลด์ผู้เนรมิตสุนทรีย์ (The Creators)',
      elementRole: 'output',
      color: '#ec4899',
      bg: 'rgba(236, 72, 153, 0.15)',
      icon: 'fa-wand-magic-sparkles',
      desc: 'ผู้สร้างสรรค์ นวัตกรรม ไหวพริบ ความคิดนอกกรอบ และศิลปะแห่งชีวิต',
      tenGods: ['食神', '傷官']
    },
    financiers: {
      key: 'financiers',
      nameZh: '財星 (Wealth)',
      nameTh: 'กิลด์จอมเวทแห่งทรัพย์สิน (The Financiers)',
      elementRole: 'wealth',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.15)',
      icon: 'fa-coins',
      desc: 'นักล่าโอกาส นักลงทุน บริหารความเสี่ยง ทรัพยากร และสร้างความมั่งคั่ง',
      tenGods: ['正財', '偏財']
    },
    connectors: {
      key: 'connectors',
      nameZh: '比劫 (Companion)',
      nameTh: 'กิลด์มิตรสหายแห่งสายใย (The Connectors)',
      elementRole: 'companion',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.15)',
      icon: 'fa-heart-circle-bolt',
      desc: 'นักเชื่อมสัมพันธ์ มนุษยสัมพันธ์ทรงพลัง รักพวกพ้อง จ่าฝูงที่ระดมใจผู้คน',
      tenGods: ['比肩', '劫財']
    }
  };

  // 2. Ten Cat Profiles (10 Profiles / 十神)
  const CAT_PROFILES = {
    // ----------------------------------------------------
    // The Thinkers (Resource)
    // ----------------------------------------------------
    '偏印': {
      profileId: 1,
      key: 'philosopher',
      tenGodZh: '偏印',
      tenGodPy: 'Pian Yin',
      tenGodTh: 'ปัญญาญาณหยั่งรู้ (Indirect Resource)',
      guildKey: 'thinkers',
      catBreed: 'แมววิเชียรมาศ (Mystic Siamese)',
      catEmoji: '🐱🔮',
      title: 'แมวญาณทิพย์ผู้หยั่งรู้',
      archetype: 'The Philosopher & Mystic',
      discTendency: 'C-S',
      mbtiMatch: 'INFJ / INTJ',
      tagline: '“ความเงียบคือเวทมนตร์ สัญชาตญาณคือดวงตาที่สาม”',
      superpowers: [
        'สัญชาตญาณแม่นยำ ลางสังหรณ์ดีเลิศ รู้ทันคนอื่นก่อนเขาจะพูด',
        'คิดนอกกรอบ แก้ปัญหาซับซ้อนที่คนอื่นมองไม่เห็นได้ลึกซึ้ง',
        'มีความสนใจในศาสตร์ลี้ลับ ศิลปะ จิตวิทยา หรือปรัชญาระดับสูง'
      ],
      shadows: [
        'ขี้ระแวง ไม่ค่อยไว้ใจใครง่ายๆ เก็บตัวจนดูลึกลับเกินไป',
        'คิดวนในหัวจนเครียดสะสม และนอนไม่ค่อยหลับ',
        'หวงพื้นที่ส่วนตัวมาก หากใครล้ำเส้นจะกางกรงเล็บเงียบๆ'
      ],
      awakenedMode: 'เมื่อพลังสมดุล: สติปัญญาเฉียบคม เป็นที่ปรึกษาเบื้องหลังที่ทรงอิทธิพล หยั่งรู้ทิศทางล่วงหน้าได้อย่างน่าอัศจรรย์',
      rechargeMode: 'เมื่อเหนื่อยล้า: ปิดการรับรู้จากผู้คน อยู่ในห้องมืดที่เงียบสงบ จุดเทียนหอม หรือฟังเสียงธรรมชาติเพื่อฟื้นฟูจิตวิญญาณ',
      catChemistry: {
        bestPartner: 'แมวสก็อตติชโฟลด์ (Scottish Scholar) หรือ แมวสามสี (Lucky Calico)',
        growthPartner: 'แมวส้มตัวตึง (Star Ginger Cat) ที่จะช่วยดึงพลังความสนุกออกมา'
      },
      favorableWork: 'นักวิจัย, โหราศาสตร์/ที่ปรึกษา, นักจิตวิทยา, นักเขียน, วิเคราะห์ข้อมูลเชิงลึก, วางแผนกลยุทธ์ลับ',
      healingAdvice: 'คำแนะนำฮีลใจจากแม่หมอติ๊ดติ๊ด: อย่ากลัวที่ตัวเองแปลกแยกจากคนอื่น เพราะของขวัญที่จักรวาลมอบให้คุณคือดวงตาที่มองเห็นความจริง พักผ่อนและกอดตัวเองบ่อยๆ นะแมวเหมียว 🐱✨'
    },

    '正印': {
      profileId: 2,
      key: 'analyzer',
      tenGodZh: '正印',
      tenGodPy: 'Zheng Yin',
      tenGodTh: 'ผู้อุปถัมภ์เกื้อหนุน (Direct Resource)',
      guildKey: 'thinkers',
      catBreed: 'แมวสก็อตติชโฟลด์ (Scottish Scholar)',
      catEmoji: '🐱📚',
      title: 'แมวนักวิชาการผู้นุ่มฟู',
      archetype: 'The Analyzer & Protector',
      discTendency: 'S-C',
      mbtiMatch: 'ISFJ / INTP',
      tagline: '“ความรอบรู้คือเกราะป้องกัน ความเมตตาคือหัวใจที่งดงาม”',
      superpowers: [
        'เก็บข้อมูลเก่ง ความจำยอดเยี่ยม มีฐานความรู้แน่นและแม่นยำ',
        'ใจเย็น สุขุม อบอุ่น เป็นผู้ฟังที่ดีและคอยซัพพอร์ตผู้อื่นเสมอ',
        'มักมีผู้ใหญ่เมตตา อุปถัมภ์ค้ำชู แคล้วคลาดจากภัยอันตราย'
      ],
      shadows: [
        'คิดวิเคราะห์นานเกินไปจนลังเล ไม่ยอมลงมือทำสักที',
        'ติดความสบายและปลอดภัย ไม่ชอบการออกจาก Comfort Zone',
        'แคร์ความรู้สึกคนอื่นมากเกินไปจนลืมดูแลความต้องการของตัวเอง'
      ],
      awakenedMode: 'เมื่อพลังสมดุล: เป็นเสาหลักทางปัญญาที่ทุกคนพึ่งพา มีเกียรติยศชื่อเสียงจากผลงานวิชาการและความเชี่ยวชาญ',
      rechargeMode: 'เมื่อเหนื่อยล้า: ขดตัวอ่านหนังสือดีๆ สักเล่ม จิบชาร้อนๆ ในผ้าห่มนุ่มฟู แล้วหยุดคิดเรื่องของคนอื่นสักวัน',
      catChemistry: {
        bestPartner: 'แมวเมนคูน (Regal Maine Coon) หรือ แมววิเชียรมาศ (Mystic Siamese)',
        growthPartner: 'แมวเบงกอล (Warrior Bengal) ที่ช่วยกระตุ้นความกล้าลงมือทำ'
      },
      favorableWork: 'อาจารย์/นักวิชาการ, แพทย์/พยาบาล, ที่ปรึกษากฎหมาย, งานอนุรักษ์, ผู้ดูแลข้อมูล, บรรณาธิการ',
      healingAdvice: 'คำแนะนำฮีลใจจากแม่หมอติ๊ดติ๊ด: คุณเป็นคนที่ใจดีและน่ารักมาก แต่จำไว้นะว่าคุณไม่จำเป็นต้องแบกรับโลกทั้งใบไว้คนเดียว อนุญาตให้ตัวเองได้พักบ้างนะ 🐱💕'
    },

    // ----------------------------------------------------
    // The Managers (Power)
    // ----------------------------------------------------
    '正官': {
      profileId: 3,
      key: 'director',
      tenGodZh: '正官',
      tenGodPy: 'Zheng Guan',
      tenGodTh: 'เกียรติยศชื่อเสียง (Direct Officer)',
      guildKey: 'managers',
      catBreed: 'แมวเมนคูน (Regal Maine Coon)',
      catEmoji: '🐱👑',
      title: 'แมวยักษ์ราชันย์ผู้ทรงเกียรติ',
      archetype: 'The Director & Guardian',
      discTendency: 'D-C',
      mbtiMatch: 'ESTJ / ISTJ',
      tagline: '“เกียรติยศอยู่ที่วินัย บารมีอยู่ที่ความยุติธรรม”',
      superpowers: [
        'ภาวะผู้นำสุขุม น่าเกรงขาม บริหารจัดการคนและงานได้อย่างมีระบบ',
        'ซื่อสัตย์ ยึดมั่นความถูกต้อง รับผิดชอบคำพูดและหน้าที่ 100%',
        'มีระเบียบวินัยสูง ส่งมอบงานได้ตามมาตรฐานระดับมืออาชีพ'
      ],
      shadows: [
        'ตึงเกินไป ไม่ยอมยืดหยุ่น หงุดหงิดง่ายเมื่อมีคนทำผิดกฎ',
        'แบกความรับผิดชอบไว้คนเดียวจนปวดคอบ่าไหล่และเครียดเรื้อรัง',
        'แคร์ภาพลักษณ์และสายตาคนอื่นมากเกินไป'
      ],
      awakenedMode: 'เมื่อพลังสมดุล: ได้รับการยกย่องเป็นผู้นำองค์กรที่น่าเคารพ บริหารจัดการสิ่งใหญ่โตได้อย่างราบรื่น',
      rechargeMode: 'เมื่อเหนื่อยล้า: วางมงกุฎลง ปล่อยให้คนอื่นจัดการบ้าง ไปนอนเกลือกกลิ้งรับแสงแดดอุ่นๆ โดยไม่ต้องคิดเรื่องระเบียบ',
      catChemistry: {
        bestPartner: 'แมวสก็อตติชโฟลด์ (Scottish Scholar) หรือ แมวเปอร์เซีย (Aristocrat Persian)',
        growthPartner: 'แมวส้มตัวตึง (Star Ginger Cat) ที่จะช่วยสอนให้หัวเราะกับเรื่องผิดแผน'
      },
      favorableWork: 'ผู้บริหารระดับสูง, ข้าราชการ/ทหาร/ตำรวจ, ผู้จัดการโครงการ, ตุลาการ, ผู้อำนวยการฝ่ายปฏิบัติการ',
      healingAdvice: 'คำแนะนำฮีลใจจากแม่หมอติ๊ดติ๊ด: คุณทำหน้าที่ได้ดีเยี่ยมเสมอ แต่ความสมบูรณ์แบบที่แท้จริงคือการอนุญาตให้ตัวเองได้มีช่องว่างให้หายใจ อย่าลืมใจดีกับตัวเองด้วยนะ 🐱🐾'
    },

    '七殺': {
      profileId: 4,
      key: 'pioneer',
      tenGodZh: '七殺',
      tenGodPy: 'Qi Sha',
      tenGodTh: 'อำนาจบารมี (Seven Killings)',
      guildKey: 'managers',
      catBreed: 'แมวเบงกอล (Warrior Bengal)',
      catEmoji: '🐱⚡',
      title: 'แมวนักล่าผู้ไร้ความกลัว',
      archetype: 'The Pioneer & Commander',
      discTendency: 'D-I',
      mbtiMatch: 'ENTJ / ESTP',
      tagline: '“วิกฤตคือเวทีของฉัน อุปสรรคมีไว้ให้ขย้ำ”',
      superpowers: [
        'กล้าหาญ เด็ดขาด ลุยตรงเป้า ไม่เคยยอมแพ้ต่ออุปสรรคใดๆ',
        'เก่งกาจเป็นพิเศษในภาวะวิกฤต (Crisis Management) ตัดสินใจฉับไว',
        'มีพลังขับเคลื่อนสูงมาก กระตุ้นให้คนรอบข้างตื่นตัวและเดินหน้า'
      ],
      shadows: [
        'ใจร้อน วู่วาม เผลอใช้คำพูดเชือดเฉือนทำร้ายจิตใจคนอื่น',
        'มองโลกเป็นสนามรบตลอดเวลา ทำให้ผ่อนคลายไม่เป็น',
        'ดื้อรั้น ไม่ค่อยยอมฟังความคิดเห็นที่ต่างไปจากตัวเอง'
      ],
      awakenedMode: 'เมื่อพลังสมดุล: แม่ทัพผู้พิชิตเป้าหมายใหญ่ พลิกสถานการณ์จากวิกฤตสู่ชัยชนะ นำพาทีมสู่ความสำเร็จ',
      rechargeMode: 'เมื่อเหนื่อยล้า: ไปออกกำลังกายหนักๆ ชกมวย วิ่ง หรือปลดปล่อยอะดรีนาลีน แล้วอาบน้ำอุ่นเพื่อผ่อนคลายกล้ามเนื้อ',
      catChemistry: {
        bestPartner: 'แมวขาวมณี (Aesthetic Cat) หรือ แมวดำตาเหลือง (Fortune Black Cat)',
        growthPartner: 'แมวสามสี (Lucky Calico) ที่ช่วยเสริมความนุ่มนวลในการประสานใจ'
      },
      favorableWork: 'ผู้ก่อตั้งสตาร์ทอัพ, นักแก้วิกฤตองค์กร, นักบิน, ศัลยแพทย์, ทนายความว่าความ, นักกีฬาอาชีพ',
      healingAdvice: 'คำแนะนำฮีลใจจากแม่หมอติ๊ดติ๊ด: ความเข้มแข็งของคุณคือพลังมหัศจรรย์ แต่การยอมรับว่าตัวเองเหนื่อยและขอกำลังใจ ไม่ได้แปลว่าคุณพ่ายแพ้เลยนะ พักผ่อนเอาแรงบ้างนะเจ้าเสือน้อย 🐱🔥'
    },

    // ----------------------------------------------------
    // The Creators (Output)
    // ----------------------------------------------------
    '食神': {
      profileId: 5,
      key: 'artist',
      tenGodZh: '食神',
      tenGodPy: 'Shi Shen',
      tenGodTh: 'ดาวผลิตทรัพย์ (Eating God)',
      guildKey: 'creators',
      catBreed: 'แมวขาวมณี / บริติช (Aesthetic Khao Manee)',
      catEmoji: '🐱🎨',
      title: 'แมวสุนทรีย์ผู้รักความสงบ',
      archetype: 'The Artist & Connoisseur',
      discTendency: 'S-I',
      mbtiMatch: 'ISFP / INFP',
      tagline: '“ชีวิตคืองานศิลปะ ความสุขคือเป้าหมายที่แท้จริง”',
      superpowers: [
        'รสนิยมเป็นเลิศ ประณีต อ่อนโยน มีสัมผัสพิเศษด้านความงามและรสชาติ',
        'มีความคิดสร้างสรรค์ที่ละเมียดละไม ลึกซึ้ง และมีเอกลักษณ์เฉพาะตัว',
        'สร้างบรรยากาศที่สบายใจให้คนรอบข้าง ดึงดูดโชคลาภผ่านความสุข'
      ],
      shadows: [
        'ติดความสบาย ขี้เกียจ ไม่ชอบความกดดันหรือการแก่งแย่งแข่งขัน',
        'ผัดวันประกันพรุ่ง ทำงานตามอารมณ์ศิลปิน',
        'อ่อนไหวต่อสิ่งแวดล้อมรอบข้างง่าย หากบรรยากาศไม่ดีจะหมดไฟทันที'
      ],
      awakenedMode: 'เมื่อพลังสมดุล: สร้างสรรค์ผลงานชิ้นเอกที่มีมูลค่าสูง ดื่มด่ำกับชีวิตที่ร่ำรวยทั้งความสุขและทรัพย์สิน',
      rechargeMode: 'เมื่อเหนื่อยล้า: ทานขนมอร่อยๆ จิบกาแฟหอมกรุ่น เดินเล่นชมสวนดอกไม้ หรือฟังเพลงคลาสสิกเบาๆ',
      catChemistry: {
        bestPartner: 'แมวเปอร์เซีย (Aristocrat Persian) หรือ แมวเบงกอล (Warrior Bengal)',
        growthPartner: 'แมวเมนคูน (Regal Maine Coon) ที่ช่วยสร้างกรอบเวลาและวินัย'
      },
      favorableWork: 'ศิลปิน, นักชิม/เชฟ, นักออกแบบผลิตภัณฑ์, นักเขียนบท, งานฝีมือชั้นสูง, ครีเอทีฟไดเรกเตอร์',
      healingAdvice: 'คำแนะนำฮีลใจจากแม่หมอติ๊ดติ๊ด: ความงามที่คุณมอบให้กับโลกใบนี้มีค่ายิ่งใหญ่ อย่าปล่อยให้ความเร่งรีบของโลกมาทำลายจังหวะหัวใจที่อ่อนโยนของคุณนะ 🐱🌸'
    },

    '傷官': {
      profileId: 6,
      key: 'performer',
      tenGodZh: '傷官',
      tenGodPy: 'Shang Guan',
      tenGodTh: 'ดาวฝ่ากฎเกณฑ์ (Hurting Officer)',
      guildKey: 'creators',
      catBreed: 'แมวส้มตัวตึง (Star Ginger Cat)',
      catEmoji: '🐱⭐',
      title: 'แมวดาราดาวเด่นผู้เปล่งประกาย',
      archetype: 'The Performer & Innovator',
      discTendency: 'I-D',
      mbtiMatch: 'ENFP / ENTP',
      tagline: '“กฎมีไว้ให้แหก แสงสปอตไลต์มีไว้ให้ฉันยืน”',
      superpowers: [
        'หัวไว ปฏิภาณไหวพริบยอดเยี่ยม พูดจาโน้มน้าวและสะกดผู้ฟังได้เก่งกาจ',
        'กล้าฉีกกรอบ คิดค้นนวัตกรรมใหม่ๆ ที่ไม่มีใครกล้าทำมาก่อน',
        'มีเสน่ห์ดึงดูดสายตา โดดเด่นในที่สาธารณะ ปรับตัวเอาตัวรอดเก่ง'
      ],
      shadows: [
        'ปากไว ขวานผ่าซาก พูดความจริงแบบไม่รักษาน้ำใจจนเกิดศัตรู',
        'เบื่อง่าย ชอบเริ่มแต่ไม่ค่อยชอบเก็บรายละเอียดให้จบ',
        'อารมณ์ขึ้นลงเร็ว หากไม่ได้รับการยอมรับจะประชดประชัน'
      ],
      awakenedMode: 'เมื่อพลังสมดุล: ดาราดาวเด่นและผู้ปฏิวัติวงการ สร้างผลกระทบเชิงบวกให้ผู้คนนับล้านด้วยเสน่ห์และไอเดีย',
      rechargeMode: 'เมื่อเหนื่อยล้า: ปิดโซเชียลมีเดีย หยุดการแสดง ไปนอนซุกตัวในที่เงียบๆ เล่นของเล่นชิ้นโปรดแบบไร้คนมอง',
      catChemistry: {
        bestPartner: 'แมววิเชียรมาศ (Mystic Siamese) หรือ แมวดำตาเหลือง (Fortune Black Cat)',
        growthPartner: 'แมวสก็อตติชโฟลด์ (Scottish Scholar) ที่ช่วยดึงสติและความสุขุม'
      },
      favorableWork: 'Influencer, พิธีกร, นักพูดสร้างแรงบันดาลใจ, ผู้กำกับ, นักการตลาดไวรัล, นักปฏิวัติธุรกิจ',
      healingAdvice: 'คำแนะนำฮีลใจจากแม่หมอติ๊ดติ๊ด: คุณเกิดมาเพื่อเปล่งประกาย แต่คุณไม่จำเป็นต้องสมบูรณ์แบบเพื่อให้คนมารัก แค่เป็นแมวส้มที่จริงใจ คนก็หลงรักทั่วบ้านทั่วเมืองแล้วจ้า! 🐱✨'
    },

    // ----------------------------------------------------
    // The Financiers (Wealth)
    // ----------------------------------------------------
    '偏財': {
      profileId: 7,
      key: 'entrepreneur',
      tenGodZh: '偏財',
      tenGodPy: 'Pian Cai',
      tenGodTh: 'โชคลาภพิเศษ (Indirect Wealth)',
      guildKey: 'financiers',
      catBreed: 'แมวดำตาเหลือง (Fortune Black Cat)',
      catEmoji: '🐱💰',
      title: 'แมวนักล่าโอกาสทอง',
      archetype: 'The Entrepreneur & Rainmaker',
      discTendency: 'D-I',
      mbtiMatch: 'ENTP / ESTJ',
      tagline: '“โอกาสซ่อนอยู่ในความมืด และฉันคือผู้คว้ามัน”',
      superpowers: [
        'สายตากว้างไกล มองเห็นช่องทางทำเงินและโอกาสธุรกิจในทุกสถานการณ์',
        'กล้าได้กล้าเสีย ชอบความท้าทายและการลงทุน เครือข่ายคอนเนกชันกว้าง',
        'ใจกว้าง ยืดหยุ่น พลิกแพลงสถานการณ์ได้รวดเร็ว ดึงดูดลาภลอย'
      ],
      shadows: [
        'ใจใหญ่เกินตัว ใช้เงินมือเติบ บริหารเงินสดติดขัดเป็นพักๆ',
        'สมาธิสั้นกับงานประจำ เบื่อง่ายเมื่อธุรกิจเริ่มคงที่',
        'ชอบเสี่ยงมากเกินไปจนบางครั้งเกือบหมดตัว'
      ],
      awakenedMode: 'เมื่อพลังสมดุล: นักธุรกิจและนักลงทุนผู้สร้างความมั่งคั่งแบบก้าวกระโดด เป็นมือประสานสิบทิศที่ทุกคนต้องการ',
      rechargeMode: 'เมื่อเหนื่อยล้า: หยุดดูพอร์ตลงทุนสักระยะ ไปพักผ่อนโรงแรมหรูๆ หรือนอนมองท้องฟ้ายามค่ำคืนเพื่อรีเซ็ตจิตใจ',
      catChemistry: {
        bestPartner: 'แมวเปอร์เซีย (Aristocrat Persian) หรือ แมวเบงกอล (Warrior Bengal)',
        growthPartner: 'แมวสก็อตติชโฟลด์ (Scottish Scholar) ที่ช่วยตรวจสอบความเสี่ยงและตัวเลข'
      },
      favorableWork: 'เจ้าของธุรกิจ, นักลงทุน Venture Capital, นักเจรจาดีลการค้า, การค้าระหว่างประเทศ, ผู้พัฒนาอสังหาริมทรัพย์',
      healingAdvice: 'คำแนะนำฮีลใจจากแม่หมอติ๊ดติ๊ด: คุณมีความสามารถในการดึงดูดเงินทองอย่างน่าทึ่ง แต่ความมั่งคั่งที่ยั่งยืนที่สุดคือสุขภาพและคนข้างกายที่รักคุณจริง อย่าลืมกอดพวกเขาแน่นๆ นะ 🐱🪙'
    },

    '正財': {
      profileId: 8,
      key: 'main_stayer',
      tenGodZh: '正財',
      tenGodPy: 'Zheng Cai',
      tenGodTh: 'ทรัพย์มั่นคง (Direct Wealth)',
      guildKey: 'financiers',
      catBreed: 'แมวเปอร์เซีย (Aristocrat Persian)',
      catEmoji: '🐱💎',
      title: 'แมวเจ้าสัวผู้มั่นคง',
      archetype: 'The Main Stayer & Builder',
      discTendency: 'C-S',
      mbtiMatch: 'ISTJ / ESTJ',
      tagline: '“ความมั่งคั่งสร้างจากหยาดเหงื่อ ความมั่นคงสร้างจากวินัย”',
      superpowers: [
        'บริหารการเงินและสินทรัพย์ได้อย่างแม่นยำ ไม่ยอมให้มีรอยรั่วไหล',
        'ขยัน อดทน ซื่อสัตย์ ไว้วางใจได้ 100% สร้างรากฐานชีวิตอย่างมั่นคง',
        'มองโลกตามความเป็นจริง (Realistic) วางแผนการเงินระยะยาวเยี่ยม'
      ],
      shadows: [
        'ตระหนี่ถี่เหนียว กังวลเรื่องเงินมากเกินไปแม้จะมีเหลือเฟือแล้ว',
        'กลัวความเสี่ยง ไม่กล้าลงทุนสิ่งใหม่ๆ จนพลาดโอกาสทอง',
        'ยึดติดกับสิ่งที่คุ้นเคย ปรับตัวต่อเทคโนโลยีใหม่ๆ ช้า'
      ],
      awakenedMode: 'เมื่อพลังสมดุล: ผู้สร้างอาณาจักรความมั่งคั่งที่มั่นคงสืบทอดรุ่นสู่รุ่น เป็นหลักชัยที่แข็งแกร่งของครอบครัว',
      rechargeMode: 'เมื่อเหนื่อยล้า: ตรวจเช็กบัญชีที่เรียบร้อย นอนบนเบาะขนปุยราคาแพง และให้รางวัลตัวเองด้วยมื้อพิเศษบ้าง',
      catChemistry: {
        bestPartner: 'แมวดำตาเหลือง (Fortune Black Cat) หรือ แมวเมนคูน (Regal Maine Coon)',
        growthPartner: 'แมวส้มตัวตึง (Star Ginger Cat) ที่ช่วยเปิดโลกให้กล้าใช้ชีวิตอย่างตื่นเต้น'
      },
      favorableWork: 'CFO / นักบัญชีการเงิน, ผู้จัดการกองทุน, บริหารสินทรัพย์, นายธนาคาร, เจ้าของโรงงานอุตสาหกรรม',
      healingAdvice: 'คำแนะนำฮีลใจจากแม่หมอติ๊ดติ๊ด: คุณสร้างรากฐานที่ยอดเยี่ยมแล้ว ตอนนี้ถึงเวลาอนุญาตให้ตัวเองได้มีความสุขและใช้เงินเพื่อซื้อความสบายใจบ้างนะเจ้าเหมียวเจ้าสัว 🐱💖'
    },

    // ----------------------------------------------------
    // The Connectors (Companion)
    // ----------------------------------------------------
    '比肩': {
      profileId: 9,
      key: 'friend',
      tenGodZh: '比肩',
      tenGodPy: 'Bi Jian',
      tenGodTh: 'เพื่อนร่วมทาง (Friend)',
      guildKey: 'connectors',
      catBreed: 'แมวสามสี (Lucky Calico)',
      catEmoji: '🐱🍀',
      title: 'แมวนางฟ้าผู้เชื่อมโยงจิตใจ',
      archetype: 'The Friend & Peacemaker',
      discTendency: 'S-I',
      mbtiMatch: 'ESFJ / ISFP',
      tagline: '“มิตรภาพแท้มีค่ากว่าทองคำ รอยยิ้มของคุณคือความสุขของฉัน”',
      superpowers: [
        'จริงใจ ซื่อตรง เป็นมิตรแท้ที่ยืนหยัดเคียงข้างเพื่อนเสมอ',
        'ประสานรอยร้าวในทีมเก่ง สร้างบรรยากาศความสามัคคีและอบอุ่น',
        'นำพาความโชคดีและความสุขมาสู่คนรอบข้างเสมอ (Lucky Charm)'
      ],
      shadows: [
        'เกรงใจคนอื่นจนตัวเองเดือดร้อน ปฏิเสธคำขอร้องของใครไม่เป็น',
        'ดื้อเงียบ เมื่อปักใจเชื่ออะไรแล้วจะไม่ยอมเปลี่ยนใจง่ายๆ',
        'น้อยใจง่ายเมื่อรู้สึกว่าเพื่อนไม่ให้ความสำคัญเท่าที่ตนให้'
      ],
      awakenedMode: 'เมื่อพลังสมดุล: ได้รับความรักและการสนับสนุนจากมิตรสหายทั่วสารทิศ ทำการใดก็มีคนพร้อมยื่นมือเข้ามาช่วยเหลือ',
      rechargeMode: 'เมื่อเหนื่อยล้า: นัดพบเพื่อนสนิทที่รู้ใจเพียง 1-2 คน กอดกันแน่นๆ เล่าเรื่องราวในใจ หรือนอนกอดตุ๊กตาตัวโปรด',
      catChemistry: {
        bestPartner: 'แมววิเชียรมาศ (Mystic Siamese) หรือ แมวสก็อตติชโฟลด์ (Scottish Scholar)',
        growthPartner: 'แมวเบงกอล (Warrior Bengal) ที่ช่วยสอนให้กล้าปฏิเสธและสู้เพื่อสิทธิ์ของตน'
      },
      favorableWork: 'ทรัพยากรบุคคล (HR), ประชาสัมพันธ์ (PR), งานบริการลูกค้า, งานชุมชนสัมพันธ์, ผู้ไกล่เกลี่ย, ครู/ผู้ดูแล',
      healingAdvice: 'คำแนะนำฮีลใจจากแม่หมอติ๊ดติ๊ด: การเป็นคนดีคือสิ่งงดงาม แต่การรักตัวเองและตั้งขอบเขตที่ปลอดภัยให้ตัวเอง คือความเมตตาที่ยิ่งใหญ่ที่สุด อย่าลืมเลือกตัวเองเป็นอันดับแรกบ้างนะ 🐱🍀'
    },

    '劫財': {
      profileId: 10,
      key: 'leader',
      tenGodZh: '劫財',
      tenGodPy: 'Jie Cai',
      tenGodTh: 'ช่วงชิงทรัพย์ (Rob Wealth)',
      guildKey: 'connectors',
      catBreed: 'แมวสฟิงซ์ / ลายเสือ (Alpha Sphynx)',
      catEmoji: '🐱🦁',
      title: 'แมวจ่าฝูงนักระดมพล',
      archetype: 'The Leader & Influencer',
      discTendency: 'I-D',
      mbtiMatch: 'ENFJ / ESTP',
      tagline: '“รวมใจผู้คนให้เป็นหนึ่ง พิชิตยอดเขาไปด้วยกัน”',
      superpowers: [
        'มนุษยสัมพันธ์ทรงพลังอย่างเหลือเชื่อ เข้าถึงและซื้อใจคนได้ทุกระดับ',
        'มีเสน่ห์แห่งการเป็นจ่าฝูง ระดมกำลังคนและทรัพยากรได้รวดเร็ว',
        'ใจสู้ มุ่งมั่น ทะเยอทะยาน พลิกสถานการณ์คับขันได้ด้วยพลังใจ'
      ],
      shadows: [
        'ชอบการแข่งขันมากเกินไปจนเหนื่อยล้า เสียทรัพย์เพราะเพื่อนหรือการไว้ใจคนผิด',
        'หน้าใหญ่ ใจป๋า เลี้ยงดูคนอื่นจนกระเป๋าฉีก',
        'อารมณ์ขึ้นลงง่ายเมื่อมีคนท้าทายอำนาจหรือข้ามหน้าข้ามตา'
      ],
      awakenedMode: 'เมื่อพลังสมดุล: ผู้นำมวลชนที่ยิ่งใหญ่ สร้างเครือข่ายและชุมชนที่แข็งแกร่ง นำพาทุกคนก้าวหน้าไปพร้อมกัน',
      rechargeMode: 'เมื่อเหนื่อยล้า: ปลีกวิเวกจากฝูงชน หยุดการเปรียบเทียบตัวเองกับใคร แช่น้ำอุ่น และพักผ่อนในเซฟโซนที่ไม่มีใครรบกวน',
      catChemistry: {
        bestPartner: 'แมวเมนคูน (Regal Maine Coon) หรือ แมวดำตาเหลือง (Fortune Black Cat)',
        growthPartner: 'แมวเปอร์เซีย (Aristocrat Persian) ที่ช่วยดึงสติเรื่องการจัดการการเงิน'
      },
      favorableWork: 'นักการเมือง/ผู้นำองค์กร, ผู้ระดมทุน (Fundraiser), ผู้นำชุมชน, งานสร้างเครือข่ายธุรกิจ, ผู้บริหารทีมขาย',
      healingAdvice: 'คำแนะนำฮีลใจจากแม่หมอติ๊ดติ๊ด: คุณมีพลังดึงดูดใจผู้คนอันน่าอัศจรรย์ แต่จำไว้นะว่าคุณไม่ต้องพิสูจน์ตัวเองให้ทุกคนยอมรับตลอดเวลา แค่เป็นคุณในแบบที่จริงใจ ก็ชนะใจคนทั้งโลกแล้ว 🐱🦁'
    }
  };

  /**
   * BaZi Profiling Resolver Engine
   * Calculates 5 Structures & Dominant 10 Profiles from Chart
   */
  const CatProfileEngine = {
    GUILDS: CAT_GUILDS,
    PROFILES: CAT_PROFILES,

    resolveCatProfile: function (chart) {
      if (!chart || !chart.pillars) return null;

      const dayMaster = chart.dayMaster; // { zh, element, polarity }
      const pillars = chart.pillars;     // year, month, day, hour

      // Structure weight accumulator
      const guildScores = {
        thinkers: 0,
        managers: 0,
        creators: 0,
        financiers: 0,
        connectors: 0
      };

      // Profile (Ten Gods) weight accumulator
      const profileScores = {
        '偏印': 0,
        '正印': 0,
        '正官': 0,
        '七殺': 0,
        '食神': 0,
        '傷官': 0,
        '偏財': 0,
        '正財': 0,
        '比肩': 0,
        '劫財': 0
      };

      // Weight weights for pillars:
      // Month Branch has the greatest influence (提綱 45%)
      // Month Stem (15%)
      // Day Branch (15%)
      // Hour Pillar (15%)
      // Year Pillar (10%)
      const addTenGodScore = (tgZh, weight) => {
        if (!tgZh || !profileScores.hasOwnProperty(tgZh)) return;
        profileScores[tgZh] += weight;

        // Add to corresponding guild
        for (const [gKey, gData] of Object.entries(CAT_GUILDS)) {
          if (gData.tenGods.includes(tgZh)) {
            guildScores[gKey] += weight;
            break;
          }
        }
      };

      // 1. Month Pillar (Highest weight!)
      if (pillars.month) {
        // Month stem
        if (pillars.month.tenGod && pillars.month.tenGod.zh) {
          addTenGodScore(pillars.month.tenGod.zh, 1.5);
        }
        // Month branch hidden stems (Command of the Month / 司令)
        if (pillars.month.hiddenStems && pillars.month.hiddenStems.length > 0) {
          pillars.month.hiddenStems.forEach((h, idx) => {
            // Main Qi (highest weight)
            const mainWeight = idx === 0 ? 3.0 : (h.weight || 0.3) * 2.0;
            if (h.tenGod && h.tenGod.zh) {
              addTenGodScore(h.tenGod.zh, mainWeight);
            }
          });
        }
      }

      // 2. Day Branch (Spouse / Core subconscious)
      if (pillars.day && pillars.day.hiddenStems) {
        pillars.day.hiddenStems.forEach((h, idx) => {
          const w = idx === 0 ? 1.5 : 0.8;
          if (h.tenGod && h.tenGod.zh) {
            addTenGodScore(h.tenGod.zh, w);
          }
        });
      }

      // 3. Hour Pillar
      if (pillars.hour) {
        if (pillars.hour.tenGod && pillars.hour.tenGod.zh) {
          addTenGodScore(pillars.hour.tenGod.zh, 1.0);
        }
        if (pillars.hour.hiddenStems) {
          pillars.hour.hiddenStems.forEach((h, idx) => {
            const w = idx === 0 ? 0.9 : 0.4;
            if (h.tenGod && h.tenGod.zh) {
              addTenGodScore(h.tenGod.zh, w);
            }
          });
        }
      }

      // 4. Year Pillar
      if (pillars.year) {
        if (pillars.year.tenGod && pillars.year.tenGod.zh) {
          addTenGodScore(pillars.year.tenGod.zh, 0.8);
        }
        if (pillars.year.hiddenStems) {
          pillars.year.hiddenStems.forEach((h, idx) => {
            const w = idx === 0 ? 0.7 : 0.3;
            if (h.tenGod && h.tenGod.zh) {
              addTenGodScore(h.tenGod.zh, w);
            }
          });
        }
      }

      // Calculate Total Guild Scores & Percentages
      const totalGuildScore = Object.values(guildScores).reduce((a, b) => a + b, 0) || 1;
      const guildPercentages = {};
      for (const [k, v] of Object.entries(guildScores)) {
        guildPercentages[k] = Math.round((v / totalGuildScore) * 100);
      }

      // Calculate Total 10 Profile Scores & Percentages (Joey Yap 10 Profiles)
      const totalProfileScore = Object.values(profileScores).reduce((a, b) => a + b, 0) || 1;
      const profilePercentages = {};
      for (const [tg, score] of Object.entries(profileScores)) {
        profilePercentages[tg] = Math.round((score / totalProfileScore) * 100);
      }

      // Find Primary Guild (highest %)
      const sortedGuilds = Object.keys(guildScores).sort((a, b) => guildScores[b] - guildScores[a]);
      const primaryGuildKey = sortedGuilds[0];
      const primaryGuild = CAT_GUILDS[primaryGuildKey];

      // Find Primary & Secondary Cat Profiles (highest Ten God scores)
      const sortedProfiles = Object.keys(profileScores).sort((a, b) => profileScores[b] - profileScores[a]);
      const primaryTenGod = sortedProfiles[0] || '正印';
      const secondaryTenGod = sortedProfiles[1] || '食神';

      const primaryCat = CAT_PROFILES[primaryTenGod];
      const secondaryCat = CAT_PROFILES[secondaryTenGod];

      // Build Ranked 10 Profiles List
      const rankedProfiles = sortedProfiles.map((tg, idx) => {
        const catInfo = CAT_PROFILES[tg];
        const gKey = catInfo.guildKey;
        const guildInfo = CAT_GUILDS[gKey];
        return {
          rank: idx + 1,
          tenGodZh: tg,
          tenGodPy: catInfo.tenGodPy,
          tenGodTh: catInfo.tenGodTh,
          percentage: profilePercentages[tg] || 0,
          rawScore: Math.round(profileScores[tg] * 10) / 10,
          catBreed: catInfo.catBreed,
          catEmoji: catInfo.catEmoji,
          title: catInfo.title,
          archetype: catInfo.archetype,
          guildKey: gKey,
          guildName: guildInfo.nameTh,
          color: guildInfo.color,
          isPrimary: idx === 0,
          isSecondary: idx === 1
        };
      });

      // 5 Structures Radar Chart Datasets
      const radarData = [
        { key: 'creators', label: 'The Creators', labelTh: 'ผู้เนรมิตสุนทรีย์', zh: '食傷', value: guildPercentages.creators || 0, color: '#ec4899', icon: 'fa-wand-magic-sparkles' },
        { key: 'managers', label: 'The Managers', labelTh: 'ผู้พิทักษ์แห่งวินัย', zh: '官殺', value: guildPercentages.managers || 0, color: '#8b5cf6', icon: 'fa-chess-rook' },
        { key: 'financiers', label: 'The Financiers', labelTh: 'จอมเวทแห่งทรัพย์สิน', zh: '財星', value: guildPercentages.financiers || 0, color: '#f59e0b', icon: 'fa-coins' },
        { key: 'thinkers', label: 'The Thinkers', labelTh: 'ปราชญ์ผู้นุ่มฟู', zh: '印星', value: guildPercentages.thinkers || 0, color: '#3b82f6', icon: 'fa-brain' },
        { key: 'connectors', label: 'The Connectors', labelTh: 'มิตรสหายแห่งสายใย', zh: '比劫', value: guildPercentages.connectors || 0, color: '#10b981', icon: 'fa-heart-circle-bolt' }
      ];

      return {
        primaryCat,
        secondaryCat,
        primaryGuild,
        guildScores,
        guildPercentages,
        profileScores,
        profilePercentages,
        rankedProfiles,
        radarData,
        dominantTenGod: primaryTenGod,
        secondaryTenGod: secondaryTenGod,
        allGuilds: CAT_GUILDS
      };
    }
  };

  // Expose globally
  window.CAT_GUILDS = CAT_GUILDS;
  window.CAT_PROFILES = CAT_PROFILES;
  window.CatProfileEngine = CatProfileEngine;

  console.log('[CatProfileEngine] 5 Structures & 10 Cat Profiles Mapping loaded successfully!');
})();
