// End-to-end checks against the existing sample JSON files.
const assert = require('node:assert/strict');
const fs = require('fs');
const { generateFlyer } = require('./generate');
const { FORMATS } = require('./formats');
function jpegSize(buffer) {
  let i = 2;
  while (i < buffer.length) {
    if (buffer[i] !== 0xff) throw new Error('Invalid JPEG');
    const marker = buffer[i + 1];
    const size = buffer.readUInt16BE(i + 2);
    if ([0xc0, 0xc1, 0xc2].includes(marker)) return [buffer.readUInt16BE(i + 7), buffer.readUInt16BE(i + 5)];
    i += 2 + size;
  }
  throw new Error('JPEG size missing');
}
(async () => {
  for (const sample of ['course', 'events', 'trade']) {
    const data = require(`../test-${sample}.json`);
    for (const [format, {width, height}] of Object.entries(FORMATS)) {
      const output = `output/check-${sample}-${format}.jpg`;
      await generateFlyer(data, output, {format});
      assert.deepEqual(jpegSize(fs.readFileSync(output)), [width, height]);
    }
  }
  await assert.rejects(generateFlyer({title:'בדיקת תוכן ארוך', topics:Array(100).fill('נושא בדיקה')}, 'output/overflow.jpg', {format:'square'}), /does not fit/);
  console.log('Nine sample images match requested dimensions; excessive content rejected.');
})().catch(error => { console.error(error); process.exitCode = 1; });
