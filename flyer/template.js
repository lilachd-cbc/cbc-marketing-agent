const { getFormat } = require('./formats');
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

function buildFlyerHTML(course, theme, options = {}) {
  if (!course || typeof course.title !== 'string' || !course.title.trim()) {
    throw new Error('Course title is required.');
  }
  const format = getFormat(options.format ?? course.format ?? 'a4');
  const e = escapeHTML;
  const topics = course.topics ?? [];
  if (!Array.isArray(topics) || topics.some(t => typeof t !== 'string')) throw new Error('topics must be an array of strings.');
  const title = course.title.replace(/^קורס\s+/, '').trim();
  const words = title.split(/\s+/);
  const last = words.pop();
  const details = [
    course.sessions && [course.sessions, 'מפגשים'],
    course.hours && [course.hours, 'שעות לימוד'],
    course.location && [course.location, 'אופן לימוד'],
  ].filter(Boolean);
  const logo = options.logoDataUrl;
  if (logo && !/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(logo)) throw new Error('Logo must be an embedded PNG, JPEG or WebP image.');
  return `<!DOCTYPE html>
<html dir="rtl" lang="he"><head><meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;700;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{width:${format.width}px;height:${format.height}px;overflow:hidden;background:#fff;font-family:'Heebo',sans-serif;font-weight:300;direction:rtl;color:#162339}
.flyer{width:${format.layoutWidth}px;height:${format.layoutHeight}px;transform:scale(${format.width / format.layoutWidth},${format.height / format.layoutHeight});transform-origin:top right;position:absolute;right:0;top:0;padding:36px 42px;display:flex;flex-direction:column;border-top:8px solid #cc1826;background:linear-gradient(150deg,#fff 65%,${theme.accent}12)}
header{min-height:88px;display:flex;justify-content:space-between;align-items:center;gap:24px;margin-bottom:24px;flex-shrink:0}
.logo-slot{width:240px;height:88px;flex-shrink:0;display:flex;align-items:center}
.logo-slot img{width:100%;height:100%;object-fit:contain;object-position:right center}
.label{font-size:15px;font-weight:700;letter-spacing:.2px;border-bottom:3px solid ${theme.accent};padding-bottom:8px}
main{display:flex;flex-direction:column;gap:22px;flex:1;min-height:0}
.hero-title{font-size:66px;line-height:1.16;font-weight:900;letter-spacing:-1.5px;overflow-wrap:anywhere;max-width:100%}
.hero-title .accent{background:${theme.accent};color:${theme.promoTextColor};padding:0 8px;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.hero-sub{font-size:24px;line-height:1.5;margin-top:18px;max-width:94%}
.schedule{display:flex;align-items:center;gap:26px;padding:18px 0;border-block:1px solid #d9dfe6}
.small-label{font-size:15px}.date{font-size:34px;font-weight:900;line-height:1.25}
.time{font-size:23px;font-weight:700;margin-inline-start:auto}
bdi{unicode-bidi:isolate}
.details{display:flex;gap:20px}.detail{flex:1;border-inline-start:3px solid ${theme.accent};padding-inline-start:14px;min-width:0}.detail strong{font-size:23px;font-weight:700;display:block;overflow-wrap:anywhere}.detail span{font-size:14px}
.content{display:grid;grid-template-columns:1.2fr 1fr;gap:24px}.content h2{font-size:17px;font-weight:700;margin-bottom:8px}.content ul{list-style:none}.content li,.content p{font-size:18px;line-height:1.55;overflow-wrap:anywhere}.content li{padding-inline-start:14px;position:relative}.content li:before{content:'';width:5px;height:5px;background:${theme.accent};position:absolute;right:0;top:12px}
.instructor{font-size:18px;line-height:1.5}.instructor strong{font-weight:700}
.promo{background:#17243a;color:white;padding:14px 20px;border-inline-start:6px solid ${theme.accent};font-size:23px;font-weight:900}.promo small{font-size:15px;font-weight:300;display:block}
footer{display:flex;align-items:center;justify-content:space-between;gap:20px;border-top:3px solid #cc1826;padding-top:20px;margin-top:26px;flex-shrink:0}.cta-label{font-size:18px;font-weight:700}.phone{font-size:42px;font-weight:900;line-height:1.25;display:block;color:#cc1826}.contact{text-align:left;font-size:14px;line-height:1.7}
.square{padding:36px 50px}.square header{margin-bottom:22px}.square .hero-title{font-size:72px}.square main{gap:22px}.square .content{grid-template-columns:1.35fr 1fr}.square .hero-sub{font-size:25px}
.story{padding:160px 55px 180px}.story header{margin-bottom:54px}.story main{gap:32px}.story .hero-title{font-size:86px}.story .hero-sub{font-size:29px}.story .content li,.story .content p{font-size:23px}.story .content h2{font-size:22px}.story .date{font-size:42px}.story .detail strong{font-size:27px}.story footer{margin-top:36px}.story .phone{font-size:52px}.story .contact{font-size:17px}
</style></head><body><article class="flyer ${format.name}">
<header><div class="logo-slot">${logo ? `<img src="${e(logo)}" alt="המכללה העסקית">` : ''}</div><span class="label">${e(course.label || 'קורס מקצועי')}</span></header>
<main>
<section><h1 class="hero-title">${e(words.join(' '))} <span class="accent">${e(last)}</span></h1>${course.subtitle ? `<p class="hero-sub">${e(course.subtitle)}</p>` : ''}</section>
${course.date || course.time ? `<section class="schedule">${course.date ? `<div><div class="small-label">פתיחה</div><div class="date"><bdi dir="ltr">${e(course.date)}</bdi></div></div>` : ''}${course.time ? `<div class="time"><bdi dir="ltr">${e(course.time)}</bdi></div>` : ''}</section>` : ''}
${details.length ? `<section class="details">${details.map(([value,label]) => `<div class="detail"><strong>${e(value)}</strong><span>${label}</span></div>`).join('')}</section>` : ''}
${topics.length || course.audience ? `<section class="content">${topics.length ? `<div><h2>מה לומדים?</h2><ul>${topics.map(t => `<li><bdi dir="auto">${e(t)}</bdi></li>`).join('')}</ul></div>` : ''}${course.audience ? `<div><h2>למי זה מתאים?</h2><p>${e(course.audience)}</p></div>` : ''}</section>` : ''}
${course.instructor ? `<p class="instructor">מרצה / מנחה: <strong>${e(course.instructor)}</strong></p>` : ''}
${course.promo ? `<aside class="promo">${e(course.promo)}${course.promoDeadline ? `<small>עד <bdi dir="ltr">${e(course.promoDeadline)}</bdi></small>` : ''}</aside>` : ''}
</main>
<footer><div><div class="cta-label">לפרטים והרשמה</div><bdi class="phone" dir="ltr">${e(course.phone || '*8111')}</bdi></div><div class="contact"><div>החשמונאים 84, תל אביב</div><div><bdi dir="ltr">www.cbc.org.il</bdi></div><div><bdi dir="ltr">college@chamber.org.il</bdi></div></div></footer>
</article></body></html>`;
}
module.exports = { buildFlyerHTML };
