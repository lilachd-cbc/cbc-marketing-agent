const test = require('node:test');
const assert = require('node:assert/strict');
const { getFormat } = require('./formats');
const { buildFlyerHTML } = require('./template');
const { detectTheme, THEMES } = require('./themes');
const { loadLogo } = require('./generate');
test('formats have exact output sizes and reject unknown names', () => {
  for (const [name,w,h] of [['a4',2480,3508],['square',1200,1200],['story',1080,1920]]) {
    const f = getFormat(name); assert.equal(f.width,w); assert.equal(f.height,h);
  }
  assert.equal(getFormat('A4').name, 'a4');
  assert.throws(() => getFormat('unknown'));
});
test('existing data renders safely in all formats, without a fabricated logo', () => {
  for (const filename of ['test-course','test-events','test-trade']) {
    const data = require(`../${filename}.json`);
    for (const format of ['a4','square','story']) {
      const html = buildFlyerHTML(data, detectTheme(data.title), { format });
      assert.match(html, /dir="rtl" lang="he"/);
      assert.match(html, /Heebo/);
      assert.doesNotMatch(html, /Rubik|Assistant|logo-title|<img/);
    }
  }
  const html = buildFlyerHTML({ title: '<script>alert("x")</script>', topics:['a & b'] }, THEMES.ai);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/); assert.match(html, /a &amp; b/);
  assert.doesNotMatch(html, /undefined|09:00/);
});
test('missing explicit logo and invalid course data fail clearly', () => {
  assert.throws(() => loadLogo('/nonexistent/cbc-logo.png'), /Logo file not found/);
  assert.throws(() => buildFlyerHTML({}, THEMES.ai), /title/);
  assert.throws(() => buildFlyerHTML({title:'קורס', topics:'text'}, THEMES.ai), /topics/);
});
test('course themes cover automation, warehouses, trade and management', () => {
  for (const [title, expected] of [['אוטומציות',THEMES.ai],['מחסנים',THEMES.logistics],['יבוא יצוא',THEMES.trade],['ניהול פרויקטים',THEMES.management]]) assert.equal(detectTheme(title), expected);
});
