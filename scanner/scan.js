const https = require('https');
const fs = require('fs');
const path = require('path');

const COURSES_FILE = path.join(__dirname, 'known_courses.json');
const CBC_URL = 'https://www.cbc.org.il/courses';

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseCourses(html) {
  const courses = [];
  // Match course blocks — adjust selectors after inspecting live site
  const titleRegex = /<h[23][^>]*class="[^"]*course[^"]*"[^>]*>([^<]+)<\/h[23]>/gi;
  const dateRegex = /(\d{1,2}[./]\d{1,2}[./]\d{2,4})/g;

  let titleMatch;
  while ((titleMatch = titleRegex.exec(html)) !== null) {
    const title = titleMatch[1].trim();
    // Look for a date near this title (within 300 chars)
    const nearbyText = html.substring(titleMatch.index, titleMatch.index + 300);
    const dateMatch = nearbyText.match(dateRegex);
    if (dateMatch) {
      courses.push({ title, date: dateMatch[0], url: CBC_URL });
    }
  }
  return courses;
}

function loadKnown() {
  if (!fs.existsSync(COURSES_FILE)) return [];
  return JSON.parse(fs.readFileSync(COURSES_FILE, 'utf8'));
}

function saveKnown(courses) {
  fs.writeFileSync(COURSES_FILE, JSON.stringify(courses, null, 2));
}

function findNew(current, known) {
  const knownKeys = new Set(known.map(c => `${c.title}__${c.date}`));
  return current.filter(c => !knownKeys.has(`${c.title}__${c.date}`));
}

async function run() {
  console.log('Scanning cbc.org.il for new courses...');
  const html = await fetchPage(CBC_URL);
  const current = parseCourses(html);
  const known = loadKnown();
  const newCourses = findNew(current, known);

  if (newCourses.length === 0) {
    console.log('No new courses found.');
    return;
  }

  console.log(`Found ${newCourses.length} new course(s):`);
  newCourses.forEach(c => console.log(`  - ${c.title} | ${c.date}`));

  // Save updated list
  saveKnown([...known, ...newCourses]);

  // Output for GitHub Actions to pick up
  fs.writeFileSync(
    path.join(__dirname, 'new_courses.json'),
    JSON.stringify(newCourses, null, 2)
  );

  // Signal new courses found (exit code 1 = found, 0 = nothing new)
  process.exit(1);
}

run().catch(err => {
  console.error('Scan failed:', err.message);
  process.exit(2);
});
