function buildFlyerHTML(course, theme) {
  const {
    title,
    subtitle = '',
    date,
    time = '09:00–15:00',
    sessions,
    hours,
    location = 'פרונטלי / אונליין',
    instructor = '',
    audience = '',
    topics = [],
    promo = '',
    promoDeadline = '',
    label = 'קורס מקצועי',
  } = course;

  const topicsHTML = topics.length
    ? topics.map(t => `<li>${t}</li>`).join('')
    : '';

  const audienceList = audience
    ? audience.split(',').map(a => `<li>${a.trim()}</li>`).join('')
    : '';

  const promoHTML = promo
    ? `<div class="promo-badge">
        <div class="promo-text">${promo}</div>
        ${promoDeadline ? `<div class="promo-sub">עד ${promoDeadline}</div>` : ''}
       </div>`
    : '';

  // Split title for big/colored word effect
  const titleWords = title.replace(/^קורס\s+/i, '').trim();
  const words = titleWords.split(' ');
  const half = Math.ceil(words.length / 2);
  const line1 = words.slice(0, half).join(' ');
  const line2 = words.slice(half).join(' ');

  return `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;700;800;900&family=Assistant:wght@400;600;700;800&display=swap');

* { margin:0; padding:0; box-sizing:border-box; }

body {
  width: 794px;
  height: 1123px;
  background: ${theme.bgBase};
  font-family: 'Assistant', Arial, sans-serif;
  direction: rtl;
  overflow: hidden;
  position: relative;
}

/* ─── BACKGROUND LAYERS ─── */
.bg-glow1 {
  position:absolute; width:600px; height:600px;
  border-radius:50%;
  background: radial-gradient(circle, ${theme.accent}33 0%, transparent 70%);
  top:-150px; right:-150px;
  pointer-events:none;
}
.bg-glow2 {
  position:absolute; width:400px; height:400px;
  border-radius:50%;
  background: radial-gradient(circle, ${theme.accent2}22 0%, transparent 70%);
  bottom:100px; left:-100px;
  pointer-events:none;
}
.bg-lines {
  position:absolute; inset:0;
  background-image:
    linear-gradient(${theme.accent}0a 1px, transparent 1px),
    linear-gradient(90deg, ${theme.accent}0a 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events:none;
}
.bg-stripe {
  position:absolute; top:0; left:0; right:0; height:8px;
  background: linear-gradient(90deg, ${theme.accent}, ${theme.accent2}, ${theme.accent});
}

/* ─── LOGO ─── */
.logo-wrap {
  position:absolute; top:24px; right:24px;
  background:white; border-radius:10px;
  padding: 8px 14px 0 14px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  min-width:190px; text-align:center;
}
.logo-title { font-size:17px; font-weight:900; color:#0d2461; letter-spacing:-0.5px; line-height:1.2; }
.logo-sub {
  background:#cc1826; color:white;
  font-size:10px; font-weight:700;
  padding:3px 8px; margin:5px -14px 0 -14px;
  border-radius:0 0 10px 10px;
  letter-spacing:0.3px;
}

/* ─── PROMO BADGE ─── */
.promo-badge {
  position:absolute; top:24px; left:24px;
  background: linear-gradient(135deg, ${theme.accent}, ${theme.accent2});
  border-radius:50%; width:90px; height:90px;
  display:flex; flex-direction:column;
  align-items:center; justify-content:center;
  text-align:center; line-height:1.2;
  box-shadow: 0 0 20px ${theme.accent}88;
}
.promo-text { font-size:15px; font-weight:900; color:${theme.promoTextColor}; }
.promo-sub  { font-size:10px; font-weight:700; color:${theme.promoTextColor}; opacity:0.9; }

/* ─── LABEL CHIP ─── */
.label-chip {
  display:inline-block;
  background: ${theme.accent}22;
  border: 1px solid ${theme.accent}66;
  color: ${theme.accent};
  font-size:13px; font-weight:700;
  padding:4px 16px; border-radius:20px;
  margin-bottom:14px;
  letter-spacing:0.5px;
}

/* ─── HERO ─── */
.hero {
  padding: 130px 32px 0 32px;
  position:relative; z-index:2;
}
.hero-small {
  font-size:20px; color:${theme.textSecondary};
  font-weight:600; margin-bottom:6px;
}
.hero-title {
  font-size:86px; font-weight:900;
  color:white; line-height:0.9;
  font-family: 'Rubik', sans-serif;
  text-shadow: 0 2px 20px rgba(0,0,0,0.6);
  letter-spacing:-3px;
}
.hero-title .accent { color:${theme.accent}; display:block; }
.hero-sub {
  font-size:20px; font-weight:600;
  color:${theme.textSecondary};
  margin-top:16px; line-height:1.4;
  border-right: 3px solid ${theme.accent};
  padding-right: 12px;
}

/* ─── DATE BANNER ─── */
.date-banner {
  margin: 26px 24px 0 24px;
  background: linear-gradient(135deg, ${theme.accent}cc, ${theme.accent2}cc);
  border-radius:12px; padding:10px 24px;
  display:flex; align-items:center; gap:16px;
  box-shadow: 0 4px 20px ${theme.accent}44;
}
.date-icon { font-size:28px; }
.date-main { font-size:38px; font-weight:900; color:white; letter-spacing:1px; }
.date-label { font-size:13px; color:rgba(255,255,255,0.85); font-weight:600; }

/* ─── DETAILS ROW ─── */
.details-row {
  margin: 16px 24px 0 24px;
  display:flex; gap:12px;
}
.detail-pill {
  flex:1;
  background:rgba(255,255,255,0.07);
  border:1px solid rgba(255,255,255,0.12);
  border-radius:10px; padding:16px 10px;
  text-align:center;
}
.detail-pill .dval {
  font-size:26px; font-weight:900;
  color:${theme.accent}; display:block;
  font-family: 'Rubik', sans-serif;
}
.detail-pill .dlbl {
  font-size:12px; color:${theme.textSecondary};
  font-weight:600; margin-top:2px;
}

/* ─── CONTENT GRID ─── */
.content-grid {
  margin: 16px 24px 0 24px;
  display:flex; gap:12px;
}
.content-box {
  flex:1;
  background:rgba(255,255,255,0.06);
  border:1px solid ${theme.accent}33;
  border-radius:12px; padding:16px 18px;
}
.box-title {
  font-size:14px; font-weight:800; color:white;
  background:${theme.accent}; display:inline-block;
  padding:4px 14px; border-radius:6px;
  margin-bottom:12px;
  ${theme.accentDark ? 'color:#000;' : ''}
}
.content-box ul { list-style:none; }
.content-box li {
  font-size:14px; color:${theme.textSecondary};
  padding:4px 0; font-weight:600;
  line-height:1.4;
}
.content-box li::before {
  content:'✓ '; color:${theme.accent};
  font-weight:900;
}

/* ─── INSTRUCTOR ─── */
.instructor-bar {
  margin: 14px 24px 0 24px;
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.1);
  border-radius:10px; padding:10px 18px;
  display:flex; align-items:center; gap:12px;
}
.inst-label { font-size:12px; color:${theme.textSecondary}; font-weight:600; }
.inst-name  { font-size:16px; font-weight:800; color:white; }

/* ─── TAGLINE ─── */
.tagline {
  margin: 20px 24px 0 24px;
  text-align: center;
  padding: 22px;
  background: linear-gradient(135deg, ${theme.accent}18, ${theme.accent2}18);
  border-radius: 14px;
  border: 1px solid ${theme.accent}44;
}
.tagline-main {
  font-size: 28px; font-weight: 900;
  color: white; font-family: 'Rubik', sans-serif;
  line-height: 1.2;
}
.tagline-main span { color: ${theme.accent}; }
.tagline-sub {
  font-size: 15px; font-weight: 600;
  color: ${theme.textSecondary}; margin-top: 6px;
}

/* ─── VALUE STRIP ─── */
.value-strip {
  margin: 16px 24px 0 24px;
  background: ${theme.accent}15;
  border: 1px solid ${theme.accent}40;
  border-radius: 10px; padding: 12px 20px;
  display: flex; align-items: center; justify-content: space-around;
}
.value-item { display:flex; align-items:center; gap:8px; }
.vi-icon { font-size:20px; }
.vi-text { font-size:14px; font-weight:700; color:white; }
.value-sep { width:1px; height:30px; background:${theme.accent}40; }

/* ─── CTA ─── */
.cta-bar {
  position:absolute; bottom:0; left:0; right:0;
  background: linear-gradient(135deg, ${theme.ctaBg}, ${theme.ctaBg}ee);
  padding:20px 32px;
  border-top: 4px solid ${theme.accent};
  display:flex; align-items:center; justify-content:space-between;
}
.cta-left { }
.cta-top { font-size:16px; font-weight:700; color:rgba(255,255,255,0.85); }
.cta-phone {
  font-size:54px; font-weight:900; color:white;
  direction:ltr; display:block; line-height:1;
  font-family:'Rubik', sans-serif;
  text-shadow:0 2px 10px rgba(0,0,0,0.4);
  letter-spacing:2px;
}
.cta-right { text-align:left; }
.cta-address { font-size:12px; color:rgba(255,255,255,0.75); line-height:1.8; }
</style>
</head>
<body>

<div class="bg-stripe"></div>
<div class="bg-glow1"></div>
<div class="bg-glow2"></div>
<div class="bg-lines"></div>

<div class="logo-wrap">
  <div class="logo-title">המכללה העסקית</div>
  <div class="logo-sub">איגוד לשכות המסחר</div>
</div>

${promoHTML}

<div class="hero">
  <div class="label-chip">${label}</div>
  <div class="hero-title">
    ${line1}
    ${line2 ? `<span class="accent">${line2}</span>` : ''}
  </div>
  ${subtitle ? `<div class="hero-sub">${subtitle}</div>` : ''}
</div>

<div class="date-banner">
  <div class="date-icon">📅</div>
  <div>
    <div class="date-label">פתיחה</div>
    <div class="date-main">${date}</div>
  </div>
  <div style="margin-right:auto; text-align:left; color:rgba(255,255,255,0.9); font-size:16px; font-weight:700">${time}</div>
</div>

<div class="details-row">
  ${sessions ? `<div class="detail-pill"><span class="dval">${sessions}</span><span class="dlbl">מפגשים</span></div>` : ''}
  ${hours ? `<div class="detail-pill"><span class="dval">${hours}</span><span class="dlbl">שעות לימוד</span></div>` : ''}
  <div class="detail-pill"><span class="dval" style="font-size:15px">${location}</span><span class="dlbl">אופן לימוד</span></div>
</div>

${(audienceList || topicsHTML) ? `
<div class="content-grid">
  ${audienceList ? `<div class="content-box">
    <div class="box-title">למי זה מתאים?</div>
    <ul>${audienceList}</ul>
  </div>` : ''}
  ${topicsHTML ? `<div class="content-box">
    <div class="box-title">מה לומדים?</div>
    <ul>${topicsHTML}</ul>
  </div>` : ''}
</div>` : ''}

${instructor ? `<div class="instructor-bar">
  <span class="inst-label">מרצה / מנחה:</span>
  <span class="inst-name">${instructor}</span>
</div>` : ''}

<div class="tagline">
  <div class="tagline-main">זה הזמן <span>לשדרג</span> את הקריירה שלכם</div>
  <div class="tagline-sub">הצטרפו לאלפי בוגרים שכבר עובדים חכם יותר</div>
</div>

<div class="value-strip">
  <div class="value-item"><span class="vi-icon">🏆</span><span class="vi-text">ערך מקצועי אמיתי</span></div>
  <div class="value-sep"></div>
  <div class="value-item"><span class="vi-icon">⚡</span><span class="vi-text">כלים ליישום מיידי</span></div>
  <div class="value-sep"></div>
  <div class="value-item"><span class="vi-icon">🎓</span><span class="vi-text">סדנה מעשית</span></div>
</div>

<div class="cta-bar">
  <div class="cta-left">
    <div class="cta-top">לפרטים והרשמה:</div>
    <span class="cta-phone">*8111</span>
  </div>
  <div class="cta-right">
    <div class="cta-address">📍 החשמונאים 84, תל אביב</div>
    <div class="cta-address">🌐 www.cbc.org.il</div>
    <div class="cta-address">✉️ college@chamber.org.il</div>
  </div>
</div>

</body>
</html>`;
}

module.exports = { buildFlyerHTML };
