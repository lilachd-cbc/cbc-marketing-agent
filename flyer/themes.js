const THEMES = {
  events: {
    name: 'הפקת אירועים',
    bgBase: 'linear-gradient(160deg, #120020 0%, #2d0050 45%, #1a0035 100%)',
    accent: '#e91e8c',
    accent2: '#c9a84c',
    textSecondary: '#f0c0e0',
    ctaBg: '#e91e8c',
    promoTextColor: '#fff',
    accentDark: false,
    keywords: ['הפקה', 'אירוע', 'אירועים', 'ניהול אירועים', 'עיצוב אירועים', 'production'],
  },
  ai: {
    name: 'בינה מלאכותית',
    bgBase: 'linear-gradient(160deg, #020d1c 0%, #071830 50%, #020d1c 100%)',
    accent: '#00e5ff',
    accent2: '#7c4dff',
    textSecondary: '#a0d8ef',
    ctaBg: '#0a0a2a',
    promoTextColor: '#000',
    accentDark: true,
    keywords: ['AI', 'בינה מלאכותית', 'מאסטרים', 'אוטומציה', 'ChatGPT', 'וידאו AI', 'סרטון'],
  },
  logistics: {
    name: 'לוגיסטיקה ומחסן',
    bgBase: 'linear-gradient(160deg, #0a1520 0%, #12283c 50%, #0a1520 100%)',
    accent: '#ff8c00',
    accent2: '#ffd700',
    textSecondary: '#ffe0b0',
    ctaBg: '#1a2a3a',
    promoTextColor: '#000',
    accentDark: true,
    keywords: ['לוגיסטיקה', 'מחסן', 'שרשרת אספקה', 'מלאי', 'רכש'],
  },
  trade: {
    name: 'סחר בינלאומי',
    bgBase: 'linear-gradient(160deg, #080f1e 0%, #0d1e3a 50%, #080f1e 100%)',
    accent: '#c9a84c',
    accent2: '#e8c97e',
    textSecondary: '#e8d5a0',
    ctaBg: '#0d1e3a',
    promoTextColor: '#000',
    accentDark: true,
    keywords: ['יבוא', 'יצוא', 'סחר בינלאומי', 'מכס', 'משלחים', 'freight', 'ספנות'],
  },
  management: {
    name: 'ניהול ועסקים',
    bgBase: 'linear-gradient(160deg, #080e24 0%, #0d1e4a 50%, #080e24 100%)',
    accent: '#e63946',
    accent2: '#ff6b6b',
    textSecondary: '#d0c0c5',
    ctaBg: '#cc1826',
    promoTextColor: '#fff',
    accentDark: false,
    keywords: ['ניהול', 'מנהלים', 'עסקים', 'מו"מ', 'קניינות', 'כספים', 'דוחות', 'פיננסים'],
  },
  food: {
    name: 'מזון ורגולציה',
    bgBase: 'linear-gradient(160deg, #081520 0%, #0d2535 50%, #081520 100%)',
    accent: '#00bcd4',
    accent2: '#4dd0e1',
    textSecondary: '#b0e8f0',
    ctaBg: '#0d2535',
    promoTextColor: '#000',
    accentDark: true,
    keywords: ['מזון', 'סימון', 'רגולציה', 'תזונה', 'ייצוא מזון', 'פיקוח'],
  },
};

const DEFAULT_THEME = THEMES.management;

function detectTheme(courseTitle) {
  const lower = courseTitle.toLowerCase();
  for (const theme of Object.values(THEMES)) {
    if (theme.keywords.some(kw => lower.includes(kw.toLowerCase()))) {
      return theme;
    }
  }
  return DEFAULT_THEME;
}

module.exports = { THEMES, detectTheme };
