const path = require('path');
const fs = require('fs');
const { detectTheme } = require('./themes');
const { buildFlyerHTML } = require('./template');
const { getFormat } = require('./formats');
const DEFAULT_LOGO = path.join(__dirname, 'assets', 'cbc-logo.jpg');

function loadLogo(logoPath) {
  const selected = logoPath ? path.resolve(logoPath) : DEFAULT_LOGO;
  if (!fs.existsSync(selected)) {
    if (logoPath) throw new Error(`Logo file not found: ${selected}`);
    console.warn(`Official logo missing. Add ${DEFAULT_LOGO}; logo area will remain blank.`);
    return undefined;
  }
  const types = { '.png': 'png', '.jpg': 'jpeg', '.jpeg': 'jpeg', '.webp': 'webp' };
  const type = types[path.extname(selected).toLowerCase()];
  if (!type) throw new Error('Logo must be PNG, JPEG or WebP.');
  return `data:image/${type};base64,${fs.readFileSync(selected).toString('base64')}`;
}

async function generateFlyer(course, outputPath, options = {}) {
  const format = getFormat(options.format ?? course.format ?? 'a4');
  const logoDataUrl = loadLogo(options.logoPath ?? course.logoPath);
  const html = buildFlyerHTML(course, detectTheme(course.title), { format: format.name, logoDataUrl });
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: format.width, height: format.height, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.evaluate(async () => {
      const loaded = await Promise.all([300, 700, 900].map(weight => document.fonts.load(`${weight} 24px Heebo`, 'המכללה AI')));
      if (loaded.some(fonts => fonts.length === 0 || fonts.some(font => font.status !== 'loaded'))) {
        throw new Error('Heebo failed to load. Check access to fonts.googleapis.com and fonts.gstatic.com.');
      }
      await document.fonts.ready;
      await Promise.all(Array.from(document.images).map(img => img.decode()));
      // Fail instead of silently clipping marketing copy or overlapping the footer.
      const main = document.querySelector('main');
      const footer = document.querySelector('footer');
      const last = main.lastElementChild;
      if (last.getBoundingClientRect().bottom > footer.getBoundingClientRect().top - 8 ||
          Array.from(document.querySelectorAll('header *, main *, footer *')).some(el => el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 1)) {
        throw new Error('Content does not fit this format. Shorten the title, subtitle or topics.');
      }
    });
    fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
    await page.screenshot({ path: outputPath, type: 'jpeg', quality: 95, fullPage: false });
    console.log(`Flyer saved: ${outputPath} (${format.width}×${format.height})`);
    return outputPath;
  } finally {
    await browser.close();
  }
}

// node flyer/generate.js test-course.json --format square --logo flyer/assets/cbc-logo.png --output output/square.jpg
if (require.main === module) {
  (async () => {
    const [input, ...args] = process.argv.slice(2);
    if (!input || input.startsWith('--')) throw new Error('Usage: node flyer/generate.js <course.json|JSON> [--format a4|square|story] [--logo image.png] [--output flyer.jpg]');
    const options = {};
    for (let i = 0; i < args.length; i += 2) {
      const key = { '--format': 'format', '--logo': 'logoPath', '--output': 'outputPath' }[args[i]];
      if (!key || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`Invalid option: ${args[i]}`);
      options[key] = args[i + 1];
    }
    const course = JSON.parse(fs.existsSync(input) ? fs.readFileSync(input, 'utf8') : input);
    const format = getFormat(options.format ?? course.format ?? 'a4');
    const out = options.outputPath || path.join(__dirname, '..', 'output', `flyer_${format.name}_${Date.now()}.jpg`);
    await generateFlyer(course, out, options);
  })().catch(error => { console.error(error.message); process.exitCode = 1; });
}
module.exports = { generateFlyer, loadLogo };
