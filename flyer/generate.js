const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { detectTheme } = require('./themes');
const { buildFlyerHTML } = require('./template');

async function generateFlyer(course, outputPath) {
  const theme = detectTheme(course.title);
  const html = buildFlyerHTML(course, theme);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Wait for fonts
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({
    path: outputPath,
    type: 'jpeg',
    quality: 95,
    fullPage: false,
  });

  await browser.close();
  console.log(`Flyer saved: ${outputPath}`);
}

// CLI usage: node generate.js path/to/course.json
if (require.main === module) {
  const arg = process.argv[2];
  const courseData = arg
    ? require('fs').existsSync(arg)
      ? JSON.parse(require('fs').readFileSync(arg, 'utf8'))
      : JSON.parse(arg)
    : {};
  const outDir = path.join(__dirname, '..', 'output');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `flyer_${Date.now()}.jpg`);
  generateFlyer(courseData, outPath)
    .then(() => console.log('Done!'))
    .catch(console.error);
}

module.exports = { generateFlyer };
