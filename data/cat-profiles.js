/**
 * ============================================================================
 * แม่หมอติ๊ดติ๊ด (DESTINY ARCANA) - THE MAEMOR TIDTID CAT ARCHETYPE SYSTEM
 * 5 Structures (五行格局) & 10 Cat Profiles (十神) Database & Resolver
 * ============================================================================
 */

  (function () {
    'use strict';

    // 1. Five Cat Guilds (5 Structures / 五行格局 - Joey Yap BaZi Profiling)
    const CAT_GUILDS = {
      supporters: {
        key: 'supporters',
        nameEn: 'The Supporters',
        nameZh: '名望型 (Influence / Supporters)',
        nameTh: 'กิลด์ผู้พิทักษ์แห่งบารมีและเกียรติยศ (The Supporters)',
        elementRole: 'power',
        color: '#8b5cf6',
        bg: 'rgba(139, 92, 246, 0.15)',
        icon: 'fa-shield-halved',
        desc: 'ผู้นำแห่งระเบียบ บารมี เกียรติยศ และความกล้าหาญ เด็ดขาด ยุติธรรม และรับผิดชอบสูง',
        tenGods: ['七殺', '正官']
      },
      thinkers: {
        key: 'thinkers',
        nameEn: 'The Thinkers',
        nameZh: '智慧型 (Resource / Thinkers)',
        nameTh: 'กิลด์ปราชญ์ผู้นุ่มฟู (The Thinkers)',
        elementRole: 'resource',
        color: '#3b82f6',
        bg: 'rgba(59, 130, 246, 0.15)',
        icon: 'fa-brain',
        desc: 'ผู้สั่งสมความรู้ ปัญญา สัญชาตญาณ และความสงบสุขุม ลึกซึ้งและรอบคอบ',
        tenGods: ['偏印', '正印']
      },
      connectors: {
        key: 'connectors',
        nameEn: 'The Connectors',
        nameZh: '交際型 (Companion / Connectors)',
        nameTh: 'กิลด์มิตรสหายแห่งสายใย (The Connectors)',
        elementRole: 'companion',
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.15)',
        icon: 'fa-heart-circle-bolt',
        desc: 'นักเชื่อมสัมพันธ์ มนุษยสัมพันธ์ทรงพลัง รักพวกพ้อง จ่าฝูงที่ระดมใจผู้คน',
        tenGods: ['劫財', '比肩']
      },
      managers: {
        key: 'managers',
        nameEn: 'The Managers',
        nameZh: '管理型 (Wealth / Managers)',
        nameTh: 'กิลด์ผู้บริหารจัดการทรัพย์สิน (The Managers)',
        elementRole: 'wealth',
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.15)',
        icon: 'fa-coins',
        desc: 'นักล่าโอกาส นักลงทุน บริหารความเสี่ยง ทรัพยากร และสร้างความมั่งคั่ง',
        tenGods: ['偏財', '正財']
      },
      creators: {
        key: 'creators',
        nameEn: 'The Creators',
        nameZh: '創作型 (Output / Creators)',
        nameTh: 'กิลด์ผู้เนรมิตสุนทรีย์ (The Creators)',
        elementRole: 'output',
        color: '#ec4899',
        bg: 'rgba(236, 72, 153, 0.15)',
        icon: 'fa-wand-magic-sparkles',
        desc: 'ผู้สร้างสรรค์ นวัตกรรม ไหวพริบ ความคิดนอกกรอบ และศิลปะแห่งชีวิต',
        tenGods: ['傷官', '食神']
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
        title: 'แมวญาณทิพย์ผู้หยั่งรู้ (The Philosopher)',
        archetype: 'The Philosopher (偏印)',
        discTendency: 'C-S',
        mbtiMatch: 'INFJ / INTJ',
        traitModifier: {
          catNoun: 'วิเชียรมาศ',
          breedShort: 'แมววิเชียรมาศ',
          adjective: 'ลึกลับสัญชาตญาณแม่นยำ ปราชญ์หยั่งรู้ลึกซึ้ง',
          primaryPhrase: 'วิเชียรมาศผู้หยั่งรู้',
          secondaryPhrase: 'ฉลาดลึกซึ้ง มีญาณทิพย์',
          tertiaryPhrase: 'ฉลาดหยั่งรู้',
          roleNoun: 'ปราชญ์ลึกลับผู้หยั่งรู้'
        },
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
        title: 'แมวนักวิชาการผู้นุ่มฟู (The Analyzer)',
        archetype: 'The Analyzer (正印)',
        discTendency: 'S-C',
        mbtiMatch: 'ISFJ / INTP',
        traitModifier: {
          catNoun: 'สก็อตติชโฟลด์',
          breedShort: 'แมวสก็อตติชโฟลด์',
          adjective: 'สุขุมรอบคอบ คลังความรู้แน่น นุ่มฟูใจดี',
          primaryPhrase: 'สก็อตติชโฟลด์นักวิชาการ',
          secondaryPhrase: 'สุขุมรอบคอบ คลังความรู้แน่น',
          tertiaryPhrase: 'ช่างวิเคราะห์สุขุม',
          roleNoun: 'นักวิชาการผู้นุ่มฟู'
        },
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
      // The Supporters (Influence / Power)
      // ----------------------------------------------------
      '正官': {
        profileId: 3,
        key: 'diplomat',
        tenGodZh: '正官',
        tenGodPy: 'Zheng Guan',
        tenGodTh: 'เกียรติยศชื่อเสียง (Direct Officer)',
        guildKey: 'supporters',
        catBreed: 'แมวเบงกอล / สยาม (Noble Bengal / Siamese)',
        catEmoji: '🐱⚡',
        title: 'แมวผู้นำทรงเกียรติผู้มีวินัย (The Diplomat)',
        archetype: 'The Diplomat (正官)',
        discTendency: 'D-C',
        mbtiMatch: 'ESTJ / ISTJ',
        traitModifier: {
          catNoun: 'เบงกอล',
          breedShort: 'แมวเบงกอล',
          adjective: 'มีเกียรติยศชื่อเสียง วินัยสูง บารมีแม่ทัพ',
          primaryPhrase: 'เบงกอลผู้นำทรงเกียรติ',
          secondaryPhrase: 'มีเกียรติบารมีแม่ทัพ',
          tertiaryPhrase: 'มีวินัยบารมีผู้นำ',
          roleNoun: 'ผู้นำที่น่านับถือ'
        },
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
        key: 'warrior',
        tenGodZh: '七殺',
        tenGodPy: 'Qi Sha',
        tenGodTh: 'อำนาจบารมี (Seven Killings)',
        guildKey: 'supporters',
        catBreed: 'แมวเมนคูน (Regal Maine Coon)',
        catEmoji: '🐱👑',
        title: 'แมวเมนคูนนักล่าผู้ไร้ความกลัว (The Warrior)',
        archetype: 'The Warrior (七殺)',
        discTendency: 'D-I',
        mbtiMatch: 'ENTJ / ESTP',
        traitModifier: {
          catNoun: 'เมนคูน',
          breedShort: 'แมวเมนคูน',
          adjective: 'กล้าไล่ล่าเด็ดขาด ไม่กลัววิกฤต พร้อมลุยเป้าหมาย',
          primaryPhrase: 'เมนคูนกล้าไล่ล่า',
          secondaryPhrase: 'เด็ดขาดไม่กลัววิกฤต',
          tertiaryPhrase: 'กล้าลุยเด็ดขาด',
          roleNoun: 'แม่ทัพผู้เกรงขาม'
        },
        tagline: '“วิกฤตคือเวทมนตร์ของฉัน อุปสรรคมีไว้ให้ขย้ำ”',
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
        title: 'แมวสุนทรีย์ผู้รักความสงบ (The Artist)',
        archetype: 'The Artist (食神)',
        discTendency: 'S-I',
        mbtiMatch: 'ISFP / INFP',
        traitModifier: {
          catNoun: 'ขาวมณี',
          breedShort: 'แมวขาวมณี',
          adjective: 'รสนิยมประณีต รักสงบ สุนทรีย์มีคลาส ดึงดูดโชคลาภ',
          primaryPhrase: 'ขาวมณีศิลปินเอก',
          secondaryPhrase: 'รักสงบ รสนิยมสุนทรีย์มีคลาส',
          tertiaryPhrase: 'สุนทรีย์มีระดับ',
          roleNoun: 'ศิลปินผู้รังสรรค์ความสุข'
        },
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
        title: 'แมวดาราดาวเด่นผู้เปล่งประกาย (The Performer)',
        archetype: 'The Performer (傷官)',
        discTendency: 'I-D',
        mbtiMatch: 'ENFP / ENTP',
        traitModifier: {
          catNoun: 'แมวส้ม',
          breedShort: 'แมวส้ม',
          adjective: 'ซุปตาร์ตัวตึง เปล่งประกายแพรวพราว ไอเดียล้นฉีกกรอบ',
          primaryPhrase: 'แมวส้มตัวตึง',
          secondaryPhrase: 'เปล่งประกายแพรวพราว ไอเดียล้น',
          tertiaryPhrase: 'คารมดีไอเดียล้น',
          roleNoun: 'ซุปตาร์ดาวเด่นฉีกกรอบ'
        },
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
      // The Managers (Wealth)
      // ----------------------------------------------------
      '偏財': {
        profileId: 7,
        key: 'pioneer_wealth',
        tenGodZh: '偏財',
        tenGodPy: 'Pian Cai',
        tenGodTh: 'โชคลาภพิเศษ (Indirect Wealth)',
        guildKey: 'managers',
        catBreed: 'แมวดำตาเหลือง (Fortune Black Cat)',
        catEmoji: '🐱💰',
        title: 'แมวนักล่าโอกาสทอง (The Pioneer)',
        archetype: 'The Pioneer (偏財)',
        discTendency: 'D-I',
        mbtiMatch: 'ENTP / ESTJ',
        traitModifier: {
          catNoun: 'แมวดำตาเหลือง',
          breedShort: 'แมวดำ',
          adjective: 'สายตากว้างไกล หัวการค้า จมูกไวคว้าโอกาสทอง',
          primaryPhrase: 'แมวดำนักล่าโอกาสทอง',
          secondaryPhrase: 'หัวการค้า จมูกไวคว้าโอกาส',
          tertiaryPhrase: 'หัวการค้าสายตาเฉียบไว',
          roleNoun: 'นักล่าโอกาสและโชคลาภ'
        },
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
        key: 'director_wealth',
        tenGodZh: '正財',
        tenGodPy: 'Zheng Cai',
        tenGodTh: 'ทรัพย์มั่นคง (Direct Wealth)',
        guildKey: 'managers',
        catBreed: 'แมวเปอร์เซีย (Aristocrat Persian)',
        catEmoji: '🐱💎',
        title: 'แมวเจ้าสัวผู้มั่นคง (The Director)',
        archetype: 'The Director (正財)',
        discTendency: 'C-S',
        mbtiMatch: 'ISTJ / ESTJ',
        traitModifier: {
          catNoun: 'เปอร์เซีย',
          breedShort: 'แมวเปอร์เซีย',
          adjective: 'บริหารจัดการมั่นคง ละเอียดรอบคอบ เจ้าสัวผู้มั่นคง',
          primaryPhrase: 'เปอร์เซียเจ้าสัว',
          secondaryPhrase: 'บริหารจัดการมั่นคง ละเอียดรอบคอบ',
          tertiaryPhrase: 'มั่นคงมั่งคั่ง',
          roleNoun: 'เจ้าสัวผู้มั่นคง'
        },
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
        title: 'แมวนางฟ้าผู้เชื่อมโยงจิตใจ (The Friend)',
        archetype: 'The Friend (比肩)',
        discTendency: 'S-I',
        mbtiMatch: 'ESFJ / ISFP',
        traitModifier: {
          catNoun: 'แมวสามสี',
          breedShort: 'แมวสามสี',
          adjective: 'เพื่อนเยอะจริงใจ สร้างมิตรภาพอบอุ่น เป็นนางฟ้าของเพื่อน',
          primaryPhrase: 'แมวสามสีมิตรแท้',
          secondaryPhrase: 'ที่มีเพื่อนเยอะ จริงใจอบอุ่น',
          tertiaryPhrase: 'เพื่อนเยอะจริงใจ',
          roleNoun: 'มิตรแท้ที่ทุกคนรัก'
        },
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
        title: 'แมวจ่าฝูงนักระดมพล (The Leader)',
        archetype: 'The Leader (劫財)',
        discTendency: 'I-D',
        mbtiMatch: 'ENFJ / ESTP',
        traitModifier: {
          catNoun: 'สฟิงซ์',
          breedShort: 'แมวสฟิงซ์',
          adjective: 'จ่าฝูงนักระดมพล มนุษยสัมพันธ์ทรงพลัง ซื้อใจคนได้รวดเร็ว',
          primaryPhrase: 'สฟิงซ์จ่าฝูง',
          secondaryPhrase: 'ใจถึงพึ่งได้ ระดมพลเก่ง',
          tertiaryPhrase: 'บารมีจ่าฝูงดึงดูดใจ',
          roleNoun: 'จ่าฝูงนักระดมพล'
        },
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

      synthesizeCompositePersona: function (rankedProfiles) {
        if (!rankedProfiles || rankedProfiles.length === 0) return null;

        const top1 = rankedProfiles[0];
        const top2 = rankedProfiles[1] || rankedProfiles[0];
        const top3 = rankedProfiles[2] || rankedProfiles[1] || rankedProfiles[0];

        const p1 = CAT_PROFILES[top1.tenGodZh] || {};
        const p2 = CAT_PROFILES[top2.tenGodZh] || {};
        const p3 = CAT_PROFILES[top3.tenGodZh] || {};

        const t1 = p1.traitModifier || {
          breedShort: top1.catBreed.split(' (')[0],
          catNoun: top1.catBreed.split(' (')[0],
          primaryPhrase: top1.catBreed.split(' (')[0],
          adjective: 'ทรงพลัง'
        };
        const t2 = p2.traitModifier || {
          secondaryPhrase: top2.title,
          tertiaryPhrase: 'เปี่ยมเสน่ห์'
        };
        const t3 = p3.traitModifier || {
          secondaryPhrase: top3.title,
          tertiaryPhrase: 'เฉลียวฉลาด'
        };

        let phrase2 = t2.secondaryPhrase || '';
        let phrase3 = t3.tertiaryPhrase || '';

        let compositeTitle = '';
        if (top1.tenGodZh === top2.tenGodZh) {
          compositeTitle = `${t1.primaryPhrase} บริสุทธิ์`;
        } else {
          if (phrase2.startsWith('ที่') || phrase2.startsWith('มี')) {
            compositeTitle = `${t1.primaryPhrase} ${phrase2} ${phrase3.startsWith('และ') ? phrase3 : (phrase3.startsWith('ฉลาด') ? phrase3 : 'และ' + phrase3)}`;
          } else {
            compositeTitle = `${t1.primaryPhrase} ${phrase2} ${phrase3}`;
          }
        }

        compositeTitle = compositeTitle.replace(/\s+/g, ' ').trim();

        const top1Name = top1.archetype.split(' (')[0];
        const top2Name = top2.archetype.split(' (')[0];
        const top3Name = top3.archetype.split(' (')[0];

        let desc1 = (t1.adjective || '').trim();
        if (desc1 && !desc1.startsWith('ผู้') && !desc1.startsWith('มี') && !desc1.startsWith('ที่')) {
          desc1 = 'ผู้' + desc1;
        }

        let desc2 = (t2.secondaryPhrase || top2.title || '').replace(/^ที่มี\s*/, 'มี').replace(/^ที่\s*/, '').trim();
        let desc3 = (t3.tertiaryPhrase || top3.title || '').replace(/^ที่มี\s*/, 'มี').replace(/^ที่\s*/, '').trim();

        const line1 = `จิตวิญญาณหลัก :  ${top1Name} (${top1.percentage}%) ${desc1}`;
        const line2 = `จิตวิญญาณสนับสนุน : ${top2Name} (${top2.percentage}%) ${desc2}`;
        const line3 = `จิตวิญญาณแฝง : ${top3Name}  (${top3.percentage}%) ${desc3}`;

        const compositeNarrative = `${line1}\n${line2}\n${line3}`;

        return {
          breedShort: t1.breedShort,
          catNoun: t1.catNoun,
          compositeTitle,
          compositeNarrative,
          top1,
          top2,
          top3,
          primaryCat: p1,
          secondaryCat: p2
        };
      },

      resolveCatProfile: function (chart) {
        if (!chart || !chart.pillars) return null;

        const dayMaster = chart.dayMaster; // { zh, element, polarity }
        const pillars = chart.pillars;     // year, month, day, hour

        // Joey Yap 10 Profiles raw scores accumulator
        const profileScores = {
          '七殺': 0,
          '正官': 0,
          '偏印': 0,
          '正印': 0,
          '偏財': 0,
          '正財': 0,
          '食神': 0,
          '傷官': 0,
          '比肩': 0,
          '劫財': 0
        };

        // 1. Day Master Base: Self identity gives base strength to Friend (比肩)
        profileScores['比肩'] = 20;

        // 2. Heavenly Stems (透干)
        // Month stem is closest to seasonal Qi and outward expression: 35 pts
        // Hour stem represents aspirations and creation: 32 pts
        // Year stem represents ancestral and societal expression: 26 pts
        const stemWeights = { month: 35, hour: 32, year: 26 };
        ['year', 'month', 'hour'].forEach(pKey => {
          const p = pillars[pKey];
          if (p && p.tenGod && p.tenGod.zh && profileScores.hasOwnProperty(p.tenGod.zh)) {
            profileScores[p.tenGod.zh] += stemWeights[pKey];
          }
        });

        // 3. Earthly Branches Hidden Stems (地支藏干)
        // In Joey Yap BaZi Profiling, Month Branch (月令) carries command over the season (~45% of total branch weight)
        const branchWeights = {
          month: { main: 68, sub1: 39, sub2: 56 },
          day: { main: 28, sub1: 21, sub2: 18 },
          hour: { main: 22, sub1: 38, sub2: 19 },
          year: { main: 22, sub1: 19, sub2: 14 }
        };

        ['month', 'day', 'hour', 'year'].forEach(pKey => {
          const p = pillars[pKey];
          const cfg = branchWeights[pKey];
          if (p && p.hiddenStems && p.hiddenStems.length > 0) {
            p.hiddenStems.forEach((h, idx) => {
              if (!h.tenGod || !h.tenGod.zh || !profileScores.hasOwnProperty(h.tenGod.zh)) return;
              const pts = idx === 0 ? cfg.main : (idx === 1 ? cfg.sub1 : cfg.sub2);
              profileScores[h.tenGod.zh] += pts;
            });
          }
        });

        // 4. Calculate Joey Yap 10 Profiles Strength % (0 - 100% individual bars)
        const maxScore = Math.max(...Object.values(profileScores)) || 1;
        const profilePercentages = {};
        for (const [tg, raw] of Object.entries(profileScores)) {
          if (raw === 0) {
            profilePercentages[tg] = 2; // Baseline 2% for unexpressed profiles in Joey Yap
          } else {
            profilePercentages[tg] = Math.max(2, Math.round((raw / maxScore) * 100));
          }
        }

        // 5. Calculate Joey Yap 5 Structures (0 - 100% Radar Chart Values)
        // Supporters (名望型): Power (七殺, 正官)
        // Thinkers (智慧型): Resource (偏印, 正印)
        // Connectors (交際型): Companion (劫財, 比肩)
        // Managers (管理型): Wealth (偏財, 正財)
        // Creators (創作型): Output (傷官, 食神)
        const calcStructureVal = (god1, god2) => {
          const s1 = profilePercentages[god1] || 2;
          const s2 = profilePercentages[god2] || 2;
          const higher = Math.max(s1, s2);
          const lower = Math.min(s1, s2);
          return Math.min(100, Math.round(higher * 0.82 + lower * 0.28));
        };

        const structureScores = {
          supporters: calcStructureVal('七殺', '正官'),
          thinkers: calcStructureVal('偏印', '正印'),
          connectors: calcStructureVal('劫財', '比肩'),
          managers: calcStructureVal('偏財', '正財'),
          creators: calcStructureVal('傷官', '食神')
        };

        // Find Primary Guild / Structure (highest score)
        const sortedGuilds = Object.keys(structureScores).sort((a, b) => structureScores[b] - structureScores[a]);
        const primaryGuildKey = sortedGuilds[0];
        const primaryGuild = CAT_GUILDS[primaryGuildKey];

        // Find Primary & Secondary Profiles (highest Ten God scores)
        const sortedProfiles = Object.keys(profileScores).sort((a, b) => profileScores[b] - profileScores[a]);
        const primaryTenGod = sortedProfiles[0] || '七殺';
        const secondaryTenGod = sortedProfiles[1] || '正官';

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
            percentage: profilePercentages[tg] || 2,
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

        // 5 Structures Radar Chart Datasets (Joey Yap 5 Structures: 0 - 100%)
        const radarData = [
          {
            key: 'supporters',
            label: 'The Supporters',
            labelTh: 'ผู้พิทักษ์แห่งบารมี (Influence)',
            zh: '名望型',
            value: structureScores.supporters || 0,
            color: '#8b5cf6',
            icon: 'fa-shield-halved'
          },
          {
            key: 'thinkers',
            label: 'The Thinkers',
            labelTh: 'ปราชญ์ผู้นุ่มฟู (Resources)',
            zh: '智慧型',
            value: structureScores.thinkers || 0,
            color: '#3b82f6',
            icon: 'fa-brain'
          },
          {
            key: 'connectors',
            label: 'The Connectors',
            labelTh: 'มิตรสหายแห่งสายใย (Companion)',
            zh: '交際型',
            value: structureScores.connectors || 0,
            color: '#10b981',
            icon: 'fa-heart-circle-bolt'
          },
          {
            key: 'managers',
            label: 'The Managers',
            labelTh: 'ผู้บริหารจัดการทรัพย์สิน (Wealth)',
            zh: '管理型',
            value: structureScores.managers || 0,
            color: '#f59e0b',
            icon: 'fa-coins'
          },
          {
            key: 'creators',
            label: 'The Creators',
            labelTh: 'ผู้เนรมิตสุนทรีย์ (Output)',
            zh: '創作型',
            value: structureScores.creators || 0,
            color: '#ec4899',
            icon: 'fa-wand-magic-sparkles'
          }
        ];

        // Synthesize dynamic composite persona from Top 1, Top 2, Top 3 profiles
        const compositePersona = CatProfileEngine.synthesizeCompositePersona(rankedProfiles);

        return {
          primaryCat,
          secondaryCat,
          primaryGuild,
          structureScores,
          profileScores,
          profilePercentages,
          rankedProfiles,
          radarData,
          dominantTenGod: primaryTenGod,
          secondaryTenGod: secondaryTenGod,
          compositePersona,
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
