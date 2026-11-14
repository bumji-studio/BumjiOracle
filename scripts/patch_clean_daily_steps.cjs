const fs = require('fs');

console.log('--- Patching app.js for Daily Oracle Step labels ---');
let app = fs.readFileSync('app.js', 'utf8');

// 1. Update the AI Prompt Instruction for Daily Spread:
const oldPromptTarget = `2. overall_analysis: วิเคราะห์พลังงานของไพ่ประจำวันใบนี้ โดยจัดโครงสร้างเนื้อหาเป็น 3 สเต็ปอย่างไหลลื่น (ความยาว 2-3 ย่อหน้า):
   - สเต็ป 1 (พลังงานประจำวัน): สิ่งที่ไพ่ใบนี้สะท้อนถึงสภาวะและโอกาสดีๆ ในวันนี้
   - สเต็ป 2 (ข้อคิดเตือนใจ): เตือนใจอย่างอ่อนโยน ไม่ประมาท หรือสิ่งที่ควรปล่อยวาง ค่อยๆ ทำ ไม่กดดันตัวเอง
   - สเต็ป 3 (พลังใจ & กำลังใจ): คำพูดให้กำลังใจ ชุบชูใจ อบอุ่น ส่งพลังบวกให้ก้าวผ่านวันได้อย่างมีความสุข`;

const newPromptReplacement = `2. overall_analysis: วิเคราะห์พลังงานของไพ่ประจำวันใบนี้ โดยแบ่งเนื้อหาเป็น 3 ส่วนชัดเจน ห้ามเขียนคำว่า Step หรือ สเต็ป และห้ามใส่วงเล็บ โดยให้ขึ้นต้นแต่ละส่วนด้วยคำเหล่านี้โดยตรง:
   - คำทำนาย: สิ่งที่ไพ่ใบนี้สะท้อนถึงสภาวะและโอกาสดีๆ ในวันนี้
   - คำเตือน: เตือนใจอย่างอ่อนโยน ไม่ประมาท หรือสิ่งที่ควรปล่อยวาง ค่อยๆ ทำ ไม่กดดันตัวเอง
   - คำฮีลใจ: คำพูดให้กำลังใจ ชุบชูใจ อบอุ่น ส่งพลังบวกให้ก้าวผ่านวันได้อย่างมีความสุข`;

if (!app.includes(oldPromptTarget)) {
  console.error('Could not find oldPromptTarget in app.js');
  process.exit(1);
}
app = app.replace(oldPromptTarget, newPromptReplacement);

// 2. Add cleanStepLabels in renderThepMeowAIFortuneHtml:
const renderFunctionTarget = `  function renderThepMeowAIFortuneHtml({ question, drawn, positions, aiData, baziCtx = null }) {
    let rawAnalysis = aiData.overall_analysis || aiData.summary || '';
    if (!rawAnalysis && (aiData.card1_reading || aiData.card2_reading || aiData.card3_reading)) {
      rawAnalysis = [aiData.card1_reading, aiData.card2_reading, aiData.card3_reading].filter(Boolean).join('\\n\\n');
    }

    let formattedAnalysis = '';
    if (rawAnalysis.includes('<p>') || rawAnalysis.includes('<div>')) {
      formattedAnalysis = rawAnalysis;
    } else {
      formattedAnalysis = rawAnalysis
        .split(/\\n\\n+/)
        .map(p => p.trim())
        .filter(p => p.length > 0)
        .map(p => \`<p>\${p}</p>\`)
        .join('');
    }`;

const renderFunctionReplacement = `  function formatOracleAnalysisText(raw) {
    if (!raw) return '';
    let cleaned = raw
      // Replace Step 1 / สเต็ป 1 (พลังงานประจำวัน) -> คำทำนาย:
      .replace(/(?:(?:สเต็ป|สเตป|step)\\s*1\\s*(?:\\([^)]*\\))?|(?:\\([^)]*พลังงานประจำวัน[^)]*\\)))\\s*[:：\\-–]?\\s*/gi, '<strong>คำทำนาย:</strong> ')
      // Replace Step 2 / สเต็ป 2 (ข้อคิดเตือนใจ) -> คำเตือน:
      .replace(/(?:(?:สเต็ป|สเตป|step)\\s*2\\s*(?:\\([^)]*\\))?|(?:\\([^)]*ข้อคิดเตือนใจ[^)]*\\)))\\s*[:：\\-–]?\\s*/gi, '<strong>คำเตือน:</strong> ')
      // Replace Step 3 / สเต็ป 3 (พลังใจ & กำลังใจ) -> คำฮีลใจ:
      .replace(/(?:(?:สเต็ป|สเตป|step)\\s*3\\s*(?:\\([^)]*\\))?|(?:\\([^)]*พลังใจ[^)]*\\)))\\s*[:：\\-–]?\\s*/gi, '<strong>คำฮีลใจ:</strong> ')
      // Clean parentheses around these terms if any: (คำทำนาย), (คำเตือน), (คำฮีลใจ)
      .replace(/\\(คำทำนาย\\)\\s*[:：]?\\s*/g, '<strong>คำทำนาย:</strong> ')
      .replace(/\\(คำเตือน\\)\\s*[:：]?\\s*/g, '<strong>คำเตือน:</strong> ')
      .replace(/\\(คำฮีลใจ\\)\\s*[:：]?\\s*/g, '<strong>คำฮีลใจ:</strong> ')
      // Ensure bare คำทำนาย:, คำเตือน:, คำฮีลใจ: are bolded
      .replace(/(?:^|\\n)\\s*(?:[-*•]\\s*)?(คำทำนาย)\\s*[:：]\\s*/g, '\\n<strong>คำทำนาย:</strong> ')
      .replace(/(?:^|\\n)\\s*(?:[-*•]\\s*)?(คำเตือน)\\s*[:：]\\s*/g, '\\n<strong>คำเตือน:</strong> ')
      .replace(/(?:^|\\n)\\s*(?:[-*•]\\s*)?(คำฮีลใจ)\\s*[:：]\\s*/g, '\\n<strong>คำฮีลใจ:</strong> ');

    if (cleaned.includes('<p>') || cleaned.includes('<div>')) {
      return cleaned;
    }
    return cleaned
      .split(/\\n\\n+/)
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .map(p => \`<p>\${p}</p>\`)
      .join('');
  }

  function renderThepMeowAIFortuneHtml({ question, drawn, positions, aiData, baziCtx = null }) {
    let rawAnalysis = aiData.overall_analysis || aiData.summary || '';
    if (!rawAnalysis && (aiData.card1_reading || aiData.card2_reading || aiData.card3_reading)) {
      rawAnalysis = [aiData.card1_reading, aiData.card2_reading, aiData.card3_reading].filter(Boolean).join('\\n\\n');
    }

    let formattedAnalysis = formatOracleAnalysisText(rawAnalysis);`;

if (!app.includes(renderFunctionTarget)) {
  console.error('Could not find renderFunctionTarget in app.js');
  process.exit(1);
}
app = app.replace(renderFunctionTarget, renderFunctionReplacement);

// 3. Update loading status messages to avoid "สเต็ป" word:
const oldLoadingTarget = `      { text: "🐾 สเต็ป 1: อ่านคีย์เวิร์ดจากไพ่ใบที่ 1, 2 และ 3 รวมกัน...", step: 1 },
      { text: hasQuestion ? "🔮 สเต็ป 2: แม่หมอเชื่อมโยงคีย์เวิร์ดทั้ง 3 ใบเพื่อตอบคำถามของคุณ..." : "🔮 สเต็ป 2: แม่หมอเชื่อมโยงคีย์เวิร์ดทั้ง 3 ใบเพื่ออ่านภาพรวม...", step: 2 },
      { text: "✨ สเต็ป 3: กำลังร้อยเรียงคำทำนายและข้อคิดฮีลใจอย่างลึกซึ้ง เมี๊ยววว~ 💖", step: 3 }`;

const newLoadingReplacement = `      { text: "🐾 กำลังอ่านพลังงานและคีย์เวิร์ดจากหน้าไพ่...", step: 1 },
      { text: hasQuestion ? "🔮 แม่หมอกำลังเชื่อมโยงพลังงานเพื่อตอบคำถามของคุณ..." : "🔮 แม่หมอกำลังเชื่อมโยงพลังงานเพื่ออ่านภาพรวม...", step: 2 },
      { text: "✨ กำลังร้อยเรียงคำทำนายและข้อคิดฮีลใจอย่างลึกซึ้ง เมี๊ยววว~ 💖", step: 3 }`;

if (app.includes(oldLoadingTarget)) {
  app = app.replace(oldLoadingTarget, newLoadingReplacement);
}

fs.writeFileSync('app.js', app, 'utf8');
console.log('Successfully updated app.js with clean prophecy headers.');
