import puppeteer from 'puppeteer';
import path from 'path';

const artifactDir = 'C:\\Users\\PavichayaMonsiriruan\\.gemini\\antigravity-ide\\brain\\39ee367b-76b9-47e3-95c3-969e8a740e78';

async function capture() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1500,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 1000 });

  console.log('Navigating to http://127.0.0.1:8085...');
  await page.goto('http://127.0.0.1:8085/?nocache=' + Date.now(), { waitUntil: 'networkidle2' });

  // Verify header tabs
  const tabTexts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.header-nav-tabs .nav-tab')).map(b => b.innerText.trim());
  });
  console.log('Header tabs found:', tabTexts);

  // Click on BaZi Tab
  console.log('Clicking tabBaziBtn...');
  await page.click('#tabBaziBtn');
  await new Promise(r => setTimeout(r, 800));

  // Take screenshot 1: Top of BaZi view
  const ss1Path = path.join(artifactDir, 'bazi_view_top.png');
  await page.screenshot({ path: ss1Path });
  console.log('Saved screenshot 1 to:', ss1Path);

  // Scroll down
  await page.evaluate(() => {
    const el = document.getElementById('baziAppView');
    if (el) el.scrollTop = 700;
  });
  await new Promise(r => setTimeout(r, 600));

  // Take screenshot 2: Bottom of BaZi view
  const ss2Path = path.join(artifactDir, 'bazi_view_bottom.png');
  await page.screenshot({ path: ss2Path });
  console.log('Saved screenshot 2 to:', ss2Path);

  await browser.close();
  console.log('Done!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
