// Pixel dimensions are output dimensions (deviceScaleFactor must stay 1).
const FORMATS = Object.freeze({
  a4: { width: 2480, height: 3508, layoutWidth: 794, layoutHeight: 1123 },
  square: { width: 1200, height: 1200, layoutWidth: 1000, layoutHeight: 1000 },
  story: { width: 1080, height: 1920, layoutWidth: 900, layoutHeight: 1600 },
});
function getFormat(name = 'a4') {
  const key = String(name).toLowerCase();
  if (!Object.hasOwn(FORMATS, key)) throw new Error(`Unknown format "${name}". Use a4, square or story.`);
  return { name: key, ...FORMATS[key] };
}
module.exports = { FORMATS, getFormat };
