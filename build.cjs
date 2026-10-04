// Client App Logic for Bulbula Amen F.C. Single HTML Application
// Note: INITIAL_SEED_DB will be prepended by the builder

function icon(name, cls, size) {
  cls = cls || "w-4 h-4";
  size = size || 16;
  const icons = {
    'dashboard': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',
    'users': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'clipboard': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>',
    'credit-card': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',
    'shield': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',
    'image': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
    'bell': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
    'globe': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    'user-cog': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/><path d="M10 15H6a4 4 0 0 0-4 4v2"/></svg>',
    'settings': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
    'history': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>',
    'search': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    'menu': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',
    'x': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    'logout': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',
    'bar-chart': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>',
    'chevron-down': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    'chevron-right': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    'check': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    'check-circle': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="16 9 12 14 8 10"/></svg>',
    'alert-triangle': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>',
    'plus': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>',
    'edit': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
    'eye': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    'download': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',
    'printer': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>',
    'clock': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    'user': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    'scan': '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></svg>'
  };
  return icons[name] || '<svg class="' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';
}

function getCrestLogoSVG(size) {
  size = size || 40;
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 drop-shadow">' +
    '<defs>' +
      '<linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="#f97316"/>' +
        '<stop offset="50%" stop-color="#ea580c"/>' +
        '<stop offset="100%" stop-color="#0f172a"/>' +
      '</linearGradient>' +
      '<linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="#fbbf24"/>' +
        '<stop offset="100%" stop-color="#d97706"/>' +
      '</linearGradient>' +
    '</defs>' +
    '<path d="M50 5 L88 20 C88 65 50 92 50 92 C50 92 12 65 12 20 Z" fill="url(#shieldGrad)" stroke="#fbbf24" stroke-width="3"/>' +
    '<path d="M50 12 L80 24 C80 60 50 82 50 82 C50 82 20 60 20 24 Z" fill="#0f172a" stroke="#ffffff" stroke-width="1.5" opacity="0.9"/>' +
    '<circle cx="50" cy="46" r="17" fill="#ffffff" stroke="#0f172a" stroke-width="1.5"/>' +
    '<polygon points="50,38 56,43 54,49 46,49 44,43" fill="#0f172a"/>' +
    '<path d="M18 70 Q50 78 82 70 L80 77 Q50 85 20 77 Z" fill="url(#goldGrad)" stroke="#0f172a" stroke-width="1"/>' +
    '<text x="50" y="75" font-family="Outfit, sans-serif" font-weight="900" font-size="6.5" fill="#0f172a" text-anchor="middle" letter-spacing="0.5">BULBULA AMEN FC</text>' +
    '<polygon points="50,18 52,23 57,23 53,26 55,31 50,28 45,31 47,26 43,23 48,23" fill="#fbbf24"/>' +
  '</svg>';
}

const DICTIONARY = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.players": "Players",
    "nav.registrations": "Registrations",
    "nav.payments": "Payments & Financials",
    "nav.teams": "Teams & Schedules",
    "nav.gallery": "Gallery CMS",
    "nav.cms": "Website CMS",
    "nav.notifications": "Notifications",
    "nav.users": "Users & Staff",
    "nav.reports": "Reports & Analytics",
    "nav.audit": "Audit Logs",
    "nav.settings": "Club Settings",
    "nav.parent_portal": "Parent Portal",
    "nav.register": "Public Registration",
    "nav.upload_payment": "Upload Payment Receipt",
    "header.title": "BULBULA AMEN F.C.",
    "header.established": "EST. 2000 E.C. • ADDIS ABABA",
    "header.search": "Search players, registrations, receipts...",
    "dash.total_players": "Total Players",
    "dash.active_members": "Active Members",
    "dash.pending_regs": "Pending Registrations",
    "dash.pending_payments": "Pending Verifications",
    "dash.overdue": "Overdue Payments",
    "dash.revenue": "Verified Revenue",
    "players.title": "Academy Player Roster",
    "players.all": "All Players",
    "players.export": "Export CSV",
    "players.add": "Add Player",
    "reg.title": "Applicant Registrations",
    "pay.title": "Payment Verifications & Ledgers",
    "teams.title": "Squads & Training Sessions",
    "cms.title": "Website CMS & Banners",
    "users.title": "Staff & Role Permissions",
    "reports.title": "Executive Reports Generator",
    "audit.title": "Security & Audit Logs"
  },
  am: {
    "nav.dashboard": "ዳሽቦርድ",
    "nav.players": "ተጫዋቾች",
    "nav.registrations": "ምዝገባዎች",
    "nav.payments": "ክፍያዎች እና ፋይናንስ",
    "nav.teams": "ቡድኖች እና ፕሮግራም",
    "nav.gallery": "ፎቶ ጋለሪ",
    "nav.cms": "ዌብሳይት ሲኤምኤስ",
    "nav.notifications": "ማስታወቂያዎች",
    "nav.users": "ተጠቃሚዎች እና አሰልጣኞች",
    "nav.reports": "ሪፖርቶች",
    "nav.audit": "የደህንነት ኦዲት",
    "nav.settings": "የክለብ መቼቶች",
    "nav.parent_portal": "የወላጅ ፖርታል",
    "nav.register": "አዲስ ምዝገባ",
    "nav.upload_payment": "የክፍያ ደረሰኝ ማስገቢያ",
    "header.title": "ቡልቡላ አመን እግር ኳስ ክለብ",
    "header.established": "ተመሰረተ 2000 ዓ.ም. • አዲስ አበባ",
    "header.search": "ተጫዋች፣ ምዝገባ፣ ደረሰኝ ፈልግ...",
    "dash.total_players": "ጠቅላላ ተጫዋቾች",
    "dash.active_members": "ንቁ አባላት",
    "dash.pending_regs": "የሚገመገሙ ምዝገባዎች",
    "dash.pending_payments": "የሚረጋገጡ ደረሰኞች",
    "dash.overdue": "ያለፈባቸው ክፍያዎች",
    "dash.revenue": "የተሰበሰበ ገቢ",
    "players.title": "የአካዳሚው ተጫዋቾች ዝርዝር",
    "players.all": "ሁሉም ተጫዋቾች",
    "players.export": "በኤክሴል (CSV) አውርድ",
    "players.add": "አዲስ ተጫዋች መዝግብ",
    "reg.title": "የአዳዲስ አመልካቾች ማመልከቻ",
    "pay.title": "የክፍያ ማረጋገጫ እና ሂሳብ",
    "teams.title": "የዕድሜ ቡድኖች እና ልምምድ",
    "cms.title": "የድረ-ገጽ ማስታወቂያዎች",
    "users.title": "አሰልጣኞች እና ፈቃዶች",
    "reports.title": "ሪፖርቶች ማመንጫ",
    "audit.title": "የደህንነት እና ክትትል መዝገብ"
  }
};

const AMHARIC_CONTENT = {
  "Striker": "አጥቂ",
  "Center Forward": "ማዕከላዊ አጥቂ",
  "Right Winger": "ቀኝ ክንፍ",
  "Left Winger": "ግራ ክንፍ",
  "Central Midfielder": "ማዕከላዊ አማካይ",
  "Attacking Midfielder": "አጥቂ አማካይ",
  "Defensive Midfielder": "ተከላካይ አማካይ",
  "Center Back": "ማዕከላዊ ተከላካይ",
  "Left Back": "ግራ ተከላካይ",
  "Right Back": "ቀኝ ተከላካይ",
  "Goalkeeper": "ግብ ጠባቂ",
  "U8 Academy": "U8 አካዳሚ",
  "U10 Juniors": "U10 ጁኒየርስ",
  "U12 Development": "U12 ልማት",
  "U13 Premier": "U13 ፕሪሚየር",
  "U15 Cadets": "U15 ካዴት",
  "U17 Elite": "U17 ኤሊት",
  "U18 Seniors Prep": "U18 ሲኒየርስ",
  "Women's Team": "የሴቶች ቡድን",
  "Health & Fitness Veterans": "የጤና እና አርበኞች",
  "ACTIVE": "ንቁ አባል",
  "PENDING_REVIEW": "በመገምገም ላይ",
  "AWAITING_PAYMENT": "ክፍያ የሚጠብቅ",
  "VERIFIED": "የተረጋገጠ",
  "PAID": "ተከፍሏል",
  "OVERDUE": "ጊዜው ያለፈበት",
  "DUE_SOON": "ክፍያ ደርሷል",
  "REJECTED": "ውድቅ የተደረገ"
};

const AppState = {
  currentRoute: window.location.hash.replace('#', '') || 'dashboard',
  language: localStorage.getItem('bulbula_fc_lang') || 'en',
  sidebarOpen: true,
  mobileMenuOpen: false,
  userMenuOpen: false,
  notifDrawerOpen: false,
  searchQuery: '',
  db: null,
  currentUser: {
    id: "USR-002",
    name: "Selamawit Tadesse",
    email: "admin@bulbulaamenfc.com",
    role: "ADMIN",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
  },
  playersFilter: { team: 'ALL', status: 'ALL', search: '', viewMode: 'TABLE' },
  regFilter: { status: 'PENDING_REVIEW', search: '' },
  payFilter: { view: 'dashboard', status: 'ALL', search: '' },
  attendanceTeam: 'TEAM-U13',
  attendanceDate: new Date().toISOString().split('T')[0],
  attendanceRecords: {}
};

function initDatabase() {
  try {
    const stored = localStorage.getItem('bulbula_fc_db');
    if (stored) {
      AppState.db = JSON.parse(stored);
    } else {
      AppState.db = JSON.parse(JSON.stringify(INITIAL_SEED_DB));
      localStorage.setItem('bulbula_fc_db', JSON.stringify(AppState.db));
    }
  } catch (e) {
    console.error("Storage error:", e);
    AppState.db = JSON.parse(JSON.stringify(INITIAL_SEED_DB));
  }
}

function saveDatabase() {
  try {
    localStorage.setItem('bulbula_fc_db', JSON.stringify(AppState.db));
  } catch (e) {
    console.error("Save error:", e);
  }
}

function t(key) {
  const lang = AppState.language;
  return (DICTIONARY[lang] && DICTIONARY[lang][key]) || (DICTIONARY['en'] && DICTIONARY['en'][key]) || key;
}

function tContent(text) {
  if (!text) return '';
  if (AppState.language === 'am') {
    return AMHARIC_CONTENT[text] || text;
  }
  return text;
}

function toggleLanguage() {
  const newLang = AppState.language === 'en' ? 'am' : 'en';
  AppState.language = newLang;
  localStorage.setItem('bulbula_fc_lang', newLang);
  renderApp();
  showToast(newLang === 'am' ? 'ቋንቋ ወደ አማርኛ ተቀይሯል' : 'Language switched to English');
}

function showToast(msg) {
  const container = document.getElementById('toast-root');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = icon('check-circle', 'text-emerald w-4 h-4') + '<span>' + msg + '</span>';
  container.appendChild(el);
  setTimeout(function() {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.style.transition = 'all 0.3s ease';
    setTimeout(function() { el.remove(); }, 300);
  }, 3500);
}

function logAudit(action, type, id, details) {
  if (!AppState.db.auditLogs) AppState.db.auditLogs = [];
  const newLog = {
    id: 'LOG-' + Date.now(),
    timestamp: new Date().toISOString(),
    userId: AppState.currentUser.id,
    userName: AppState.currentUser.name,
    userRole: AppState.currentUser.role,
    action: action,
    affectedRecordType: type,
    affectedRecordId: id,
    details: details || ''
  };
  AppState.db.auditLogs.unshift(newLog);
  saveDatabase();
}

function navigate(route) {
  AppState.currentRoute = route;
  window.location.hash = route;
  AppState.mobileMenuOpen = false;
  AppState.userMenuOpen = false;
  AppState.notifDrawerOpen = false;
  renderApp();
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', function() {
  const h = window.location.hash.replace('#', '');
  if (h && h !== AppState.currentRoute) {
    AppState.currentRoute = h;
    renderApp();
  }
});

document.addEventListener('click', function(e) {
  if (AppState.userMenuOpen && !e.target.closest('#user-menu-btn') && !e.target.closest('#user-menu-dropdown')) {
    AppState.userMenuOpen = false;
    renderApp();
  }
});

function renderApp() {
  const root = document.getElementById('app-root');
  if (!root) return;

  if (AppState.currentRoute === 'login') {
    root.innerHTML = renderLoginScreen();
    return;
  }
  if (AppState.currentRoute === 'register') {
    root.innerHTML = renderPublicRegisterScreen();
    return;
  }
  if (AppState.currentRoute === 'upload-payment') {
    root.innerHTML = renderUploadPaymentScreen();
    return;
  }
  if (AppState.currentRoute === 'parent') {
    root.innerHTML = renderParentPortalScreen();
    return;
  }

  root.innerHTML = 
    '<div class="flex min-h-screen bg-slate-50">' +
      '<aside class="' + (AppState.sidebarOpen ? 'w-64' : 'w-20') + ' bg-white border-r border-slate-200 transition-all duration-300 hidden md:flex flex-col fixed inset-y-0 left-0 z-30 sidebar-desktop shadow-xs">' +
        renderSidebarContent() +
      '</aside>' +
      '<div class="fixed inset-0 bg-slate-900/60 z-50 transition-opacity md:hidden ' + (AppState.mobileMenuOpen ? 'block' : 'hidden') + '" onclick="AppState.mobileMenuOpen = false; renderApp();">' +
        '<div class="w-72 bg-white h-full shadow-2xl flex flex-col" onclick="event.stopPropagation();">' +
          renderSidebarContent(true) +
        '</div>' +
      '</div>' +
      '<div class="flex-1 flex flex-col transition-all duration-300 ' + (AppState.sidebarOpen ? 'md:ml-64' : 'md:ml-20') + ' w-full">' +
        '<header class="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">' +
          '<div class="flex items-center gap-3">' +
            '<button class="mobile-menu-btn p-2 rounded-xl text-slate-600 hover:bg-slate-100" onclick="AppState.mobileMenuOpen = true; renderApp();">' +
              icon('menu', 'w-5 h-5') +
            '</button>' +
            '<button class="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hidden md:block" onclick="AppState.sidebarOpen = !AppState.sidebarOpen; renderApp();" title="Toggle Sidebar">' +
              icon(AppState.sidebarOpen ? 'x' : 'menu', 'w-4 h-4') +
            '</button>' +
            '<div class="flex items-center gap-2">' +
              '<span class="text-xs font-black tracking-tight text-slate-900 uppercase hidden sm:inline">' + t('header.title') + '</span>' +
              '<span class="text-[10px] font-bold text-orange bg-orange-light px-2 py-0.5 rounded-full uppercase">' + t('header.established') + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="hidden lg:flex items-center relative max-w-xs w-full mx-4">' +
            '<span class="absolute left-3 text-slate-400">' + icon('search', 'w-4 h-4') + '</span>' +
            '<input type="text" placeholder="' + t('header.search') + '" class="w-full pl-9 pr-4 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-orange focus:ring-1 focus:ring-orange outline-none" value="' + AppState.searchQuery + '" oninput="handleGlobalSearch(this.value)"/>' +
          '</div>' +
          '<div class="flex items-center gap-2 relative">' +
            '<button onclick="toggleLanguage()" class="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs" title="Switch Language">' +
              icon('globe', 'w-3.5 h-3.5 text-orange') +
              '<span>' + (AppState.language === 'en' ? 'አማርኛ' : 'English') + '</span>' +
            '</button>' +
            '<button onclick="AppState.notifDrawerOpen = !AppState.notifDrawerOpen; renderApp();" class="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 relative shadow-xs" title="Notifications">' +
              icon('bell', 'w-4 h-4') +
              ((AppState.db.notifications && AppState.db.notifications.filter(function(n) { return !n.isRead; }).length > 0) ?
                '<span class="absolute -top-1 -right-1 w-4 h-4 bg-orange text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">' + AppState.db.notifications.filter(function(n) { return !n.isRead; }).length + '</span>' : '') +
            '</button>' +
            '<div class="relative">' +
              '<button id="user-menu-btn" onclick="AppState.userMenuOpen = !AppState.userMenuOpen; renderApp();" class="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">' +
                '<img src="' + AppState.currentUser.avatar + '" alt="Avatar" class="w-8 h-8 rounded-lg object-cover border border-slate-200"/>' +
                '<div class="text-left hidden sm:block">' +
                  '<span class="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[110px]">' + AppState.currentUser.name + '</span>' +
                  '<span class="text-[10px] font-extrabold text-orange uppercase tracking-wider block">' + AppState.currentUser.role + '</span>' +
                '</div>' +
                icon('chevron-down', 'w-3 h-3 text-slate-400') +
              '</button>' +
              (AppState.userMenuOpen ?
                '<div id="user-menu-dropdown" class="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50">' +
                  '<div class="px-4 py-2 border-b border-slate-100">' +
                    '<span class="text-xs font-bold text-slate-900 block">' + AppState.currentUser.name + '</span>' +
                    '<span class="text-[10px] text-slate-500 block truncate">' + AppState.currentUser.email + '</span>' +
                    '<span class="inline-block mt-1 text-[9px] font-black px-2 py-0.5 rounded bg-orange-light text-orange">' + AppState.currentUser.role + '</span>' +
                  '</div>' +
                  '<div class="p-2 border-b border-slate-100">' +
                    '<span class="text-[10px] font-bold uppercase text-slate-400 px-2 block mb-1">Switch Demo Role</span>' +
                    '<button onclick="switchRole(\'SUPER_ADMIN\')" class="w-full text-left px-2 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-100 flex items-center justify-between"><span>Super Admin</span> ' + (AppState.currentUser.role === 'SUPER_ADMIN' ? '✓' : '') + '</button>' +
                    '<button onclick="switchRole(\'ADMIN\')" class="w-full text-left px-2 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-100 flex items-center justify-between"><span>Admin</span> ' + (AppState.currentUser.role === 'ADMIN' ? '✓' : '') + '</button>' +
                    '<button onclick="switchRole(\'COACH\')" class="w-full text-left px-2 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-100 flex items-center justify-between"><span>Coach</span> ' + (AppState.currentUser.role === 'COACH' ? '✓' : '') + '</button>' +
                    '<button onclick="switchRole(\'FINANCE_OFFICER\')" class="w-full text-left px-2 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-100 flex items-center justify-between"><span>Finance Officer</span> ' + (AppState.currentUser.role === 'FINANCE_OFFICER' ? '✓' : '') + '</button>' +
                  '</div>' +
                  '<div class="p-1">' +
                    '<button onclick="navigate(\'login\')" class="w-full text-left px-3 py-2 text-xs font-bold text-red hover:bg-red-50 rounded-xl flex items-center gap-2">' +
                      icon('logout', 'w-3.5 h-3.5 text-red') + ' Logout' +
                    '</button>' +
                  '</div>' +
                '</div>' : '') +
            '</div>' +
          '</div>' +
        '</header>' +
        (AppState.notifDrawerOpen ? renderNotificationDrawer() : '') +
        '<main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">' +
          renderActiveScreen() +
        '</main>' +
      '</div>' +
    '</div>';
}

function switchRole(role) {
  const roleMap = {
    'SUPER_ADMIN': { id: 'USR-001', name: 'Yonas Alemu', email: 'superadmin@bulbulaamenfc.com', role: 'SUPER_ADMIN', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
    'ADMIN': { id: 'USR-002', name: 'Selamawit Tadesse', email: 'admin@bulbulaamenfc.com', role: 'ADMIN', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' },
    'COACH': { id: 'USR-004', name: 'Coach Ashenafi Bekele', email: 'coach@bulbulaamenfc.com', role: 'COACH', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' },
    'FINANCE_OFFICER': { id: 'USR-005', name: 'Martha Haile', email: 'finance@bulbulaamenfc.com', role: 'FINANCE_OFFICER', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80' }
  };
  AppState.currentUser = roleMap[role] || roleMap['ADMIN'];
  AppState.userMenuOpen = false;
  renderApp();
  showToast('Switched user role to ' + role);
}

function handleGlobalSearch(q) {
  AppState.searchQuery = q;
  if (!q.trim()) return;
  if (AppState.currentRoute !== 'players') {
    AppState.playersFilter.search = q;
    navigate('players');
  } else {
    AppState.playersFilter.search = q;
    renderApp();
  }
}

function renderSidebarContent(isMobile) {
  isMobile = isMobile || false;
  const navLinks = [
    { route: 'dashboard', name: t('nav.dashboard'), iconName: 'dashboard' },
    { route: 'players', name: t('nav.players'), iconName: 'users', count: AppState.db.players ? AppState.db.players.length : 0 },
    { route: 'registrations', name: t('nav.registrations'), iconName: 'clipboard', badge: AppState.db.registrations ? AppState.db.registrations.filter(function(r) { return r.status === 'PENDING_REVIEW'; }).length : 0 },
    { route: 'payments', name: t('nav.payments'), iconName: 'credit-card', badge: AppState.db.payments ? AppState.db.payments.filter(function(p) { return p.verificationStatus === 'Under Verification'; }).length : 0 },
    { route: 'teams', name: t('nav.teams'), iconName: 'shield', count: AppState.db.teams ? AppState.db.teams.length : 0 },
    { route: 'cms', name: t('nav.cms'), iconName: 'globe' },
    { route: 'gallery', name: t('nav.gallery'), iconName: 'image' },
    { route: 'notifications', name: t('nav.notifications'), iconName: 'bell' },
    { route: 'users', name: t('nav.users'), iconName: 'user-cog' },
    { route: 'reports', name: t('nav.reports'), iconName: 'bar-chart' },
    { route: 'audit-logs', name: t('nav.audit'), iconName: 'history' },
    { route: 'settings', name: t('nav.settings'), iconName: 'settings' }
  ];

  return '<div class="h-16 px-4 flex items-center justify-between border-b border-slate-200 bg-white">' +
    '<div class="flex items-center gap-3 overflow-hidden cursor-pointer" onclick="navigate(\'dashboard\')">' +
      getCrestLogoSVG(36) +
      ((AppState.sidebarOpen || isMobile) ?
        '<div class="truncate">' +
          '<span class="font-black text-xs tracking-tight text-slate-900 block truncate uppercase">BULBULA AMEN F.C.</span>' +
          '<span class="block text-[10px] font-extrabold text-orange tracking-widest uppercase">EST. 2000 E.C.</span>' +
        '</div>' : '') +
    '</div>' +
    (isMobile ?
      '<button onclick="AppState.mobileMenuOpen = false; renderApp();" class="p-2 text-slate-400 hover:text-slate-700">' +
        icon('x', 'w-5 h-5') +
      '</button>' : '') +
  '</div>' +
  '<div class="flex-1 overflow-y-auto py-3 px-2 space-y-1">' +
    navLinks.map(function(link) {
      const isActive = AppState.currentRoute === link.route;
      return '<button onclick="navigate(\'' + link.route + '\')" class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ' + (isActive ? 'bg-orange text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900') + '" title="' + link.name + '">' +
        '<div class="flex items-center gap-3 truncate">' +
          icon(link.iconName, 'w-4 h-4 flex-shrink-0') +
          ((AppState.sidebarOpen || isMobile) ? '<span class="truncate">' + link.name + '</span>' : '') +
        '</div>' +
        ((AppState.sidebarOpen || isMobile) ? (
          link.badge ? '<span class="px-2 py-0.5 text-[9px] font-black rounded-full ' + (isActive ? 'bg-white text-orange' : 'bg-orange text-white') + '">' + link.badge + '</span>' :
          (link.count !== undefined ? '<span class="text-[10px] text-slate-400 font-semibold">' + link.count + '</span>' : '')
        ) : '') +
      '</button>';
    }).join('') +
    ((AppState.sidebarOpen || isMobile) ?
      '<div class="pt-4 mt-4 border-t border-slate-100 px-2 space-y-1.5">' +
        '<span class="text-[10px] font-extrabold uppercase text-slate-400 block px-1 tracking-wider">Public Portals</span>' +
        '<button onclick="navigate(\'parent\')" class="w-full text-left px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-orange hover:bg-slate-50 rounded-lg flex items-center gap-2">' +
          icon('users', 'w-3.5 h-3.5 text-slate-400') + ' ' + t('nav.parent_portal') +
        '</button>' +
        '<button onclick="navigate(\'register\')" class="w-full text-left px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-orange hover:bg-slate-50 rounded-lg flex items-center gap-2">' +
          icon('plus', 'w-3.5 h-3.5 text-slate-400') + ' ' + t('nav.register') +
        '</button>' +
        '<button onclick="navigate(\'upload-payment\')" class="w-full text-left px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-orange hover:bg-slate-50 rounded-lg flex items-center gap-2">' +
          icon('scan', 'w-3.5 h-3.5 text-slate-400') + ' ' + t('nav.upload_payment') +
        '</button>' +
      '</div>' : '') +
  '</div>' +
  '<div class="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">' +
    '<div class="flex items-center gap-2 overflow-hidden">' +
      '<div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>' +
      ((AppState.sidebarOpen || isMobile) ? '<span class="text-[10px] font-bold text-slate-500 truncate">System Online (Local DB)</span>' : '') +
    '</div>' +
  '</div>';
}

function renderNotificationDrawer() {
  const notifs = AppState.db.notifications || [];
  return '<div class="fixed inset-0 bg-slate-900/40 z-50 flex justify-end" onclick="AppState.notifDrawerOpen = false; renderApp();">' +
    '<div class="w-96 bg-white h-full shadow-2xl flex flex-col" onclick="event.stopPropagation();">' +
      '<div class="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">' +
        '<div class="flex items-center gap-2">' +
          icon('bell', 'w-4 h-4 text-orange') +
          '<h3 class="font-extrabold text-sm text-slate-900">Notifications</h3>' +
          '<span class="px-2 py-0.5 rounded-full bg-orange-light text-orange text-[10px] font-black">' + notifs.length + '</span>' +
        '</div>' +
        '<button onclick="markAllNotificationsRead()" class="text-xs font-bold text-orange hover:underline">Mark all read</button>' +
      '</div>' +
      '<div class="flex-1 overflow-y-auto p-3 space-y-2">' +
        (notifs.length === 0 ? '<div class="text-center py-12 text-slate-400 text-xs">No notifications yet</div>' :
          notifs.map(function(n) {
            return '<div class="p-3 rounded-xl border border-slate-100 hover:border-orange hover:bg-slate-50 transition-all cursor-pointer ' + (!n.isRead ? 'bg-orange-light/30 border-orange/30' : '') + '" onclick="handleNotifClick(\'' + n.id + '\')">' +
              '<div class="flex items-start justify-between gap-2 mb-1">' +
                '<span class="font-bold text-xs text-slate-900">' + n.title + '</span>' +
                '<span class="text-[10px] text-slate-400">' + new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '</span>' +
              '</div>' +
              '<p class="text-xs text-slate-600">' + n.message + '</p>' +
            '</div>';
          }).join('')) +
      '</div>' +
    '</div>' +
  '</div>';
}

function markAllNotificationsRead() {
  if (AppState.db.notifications) {
    AppState.db.notifications.forEach(function(n) { n.isRead = true; });
    saveDatabase();
    renderApp();
    showToast('All notifications marked as read');
  }
}

function handleNotifClick(id) {
  const n = (AppState.db.notifications || []).find(function(item) { return item.id === id; });
  if (n) {
    n.isRead = true;
    saveDatabase();
    AppState.notifDrawerOpen = false;
    if (n.linkUrl) {
      const target = n.linkUrl.startsWith('/') ? n.linkUrl.slice(1) : n.linkUrl;
      navigate(target);
    } else {
      navigate('notifications');
    }
  }
}

function renderDashboardScreen() {
  const players = AppState.db.players || [];
  const registrations = AppState.db.registrations || [];
  const payments = AppState.db.payments || [];
  const teams = AppState.db.teams || [];

  const activePlayers = players.filter(function(p) { return p.status === 'ACTIVE'; }).length;
  const pendingRegs = registrations.filter(function(r) { return r.status === 'PENDING_REVIEW'; }).length;
  const pendingPay = payments.filter(function(p) { return p.verificationStatus === 'Under Verification'; }).length;
  const overduePay = players.filter(function(p) { return p.feeSchedule && p.feeSchedule.paymentStatus === 'OVERDUE'; }).length;
  const verifiedTotalRevenue = payments
    .filter(function(p) { return p.verificationStatus === 'Verified'; })
    .reduce(function(sum, p) { return sum + (Number(p.amount) || 0); }, 0);

  return '<div class="space-y-6">' +
    '<div class="card p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">' +
      '<div class="relative z-10">' +
        '<span class="text-xs font-bold text-orange tracking-widest uppercase block mb-1">Bulbula Amen F.C. Academy Operations</span>' +
        '<h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">Welcome, ' + AppState.currentUser.name + '</h1>' +
        '<p class="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">Real-time statistics across all 9 age groups, player enrollments, and Telebirr/CBE revenue collection.</p>' +
      '</div>' +
      '<div class="flex items-center gap-3 relative z-10">' +
        '<button onclick="navigate(\'players\')" class="btn btn-orange text-xs">' + icon('users', 'w-4 h-4') + ' Manage Players</button>' +
        '<button onclick="navigate(\'registrations\')" class="btn btn-white text-xs">' + icon('clipboard', 'w-4 h-4 text-orange') + ' Review Applications (' + pendingRegs + ')</button>' +
      '</div>' +
    '</div>' +
    '<div class="grid grid-cols-2 lg:grid-cols-5 gap-4">' +
      '<div class="card p-4 card-hover cursor-pointer" onclick="navigate(\'players\')">' +
        '<div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-slate-500 uppercase">' + t('dash.total_players') + '</span><span class="p-2 rounded-xl bg-orange-light text-orange">' + icon('users', 'w-4 h-4') + '</span></div>' +
        '<div class="text-2xl font-black text-slate-900">' + players.length + '</div>' +
        '<span class="text-[10px] text-emerald font-bold">✓ ' + activePlayers + ' Active Members</span>' +
      '</div>' +
      '<div class="card p-4 card-hover cursor-pointer" onclick="navigate(\'registrations\')">' +
        '<div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-slate-500 uppercase">' + t('dash.pending_regs') + '</span><span class="p-2 rounded-xl bg-amber-50 text-amber">' + icon('clipboard', 'w-4 h-4') + '</span></div>' +
        '<div class="text-2xl font-black text-slate-900">' + pendingRegs + '</div>' +
        '<span class="text-[10px] text-amber font-bold">Awaiting Manager Review</span>' +
      '</div>' +
      '<div class="card p-4 card-hover cursor-pointer" onclick="navigate(\'payments\')">' +
        '<div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-slate-500 uppercase">' + t('dash.revenue') + '</span><span class="p-2 rounded-xl bg-emerald-50 text-emerald">' + icon('credit-card', 'w-4 h-4') + '</span></div>' +
        '<div class="text-2xl font-black text-slate-900">' + verifiedTotalRevenue.toLocaleString() + ' <span class="text-xs font-bold text-slate-500">ETB</span></div>' +
        '<span class="text-[10px] text-emerald font-bold">Verified Bank & Telebirr</span>' +
      '</div>' +
      '<div class="card p-4 card-hover cursor-pointer" onclick="navigate(\'payments\')">' +
        '<div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-slate-500 uppercase">' + t('dash.pending_payments') + '</span><span class="p-2 rounded-xl bg-blue-50 text-blue">' + icon('scan', 'w-4 h-4') + '</span></div>' +
        '<div class="text-2xl font-black text-slate-900">' + pendingPay + '</div>' +
        '<span class="text-[10px] text-blue font-bold">Receipts in OCR Queue</span>' +
      '</div>' +
      '<div class="card p-4 card-hover cursor-pointer col-span-2 lg:col-span-1" onclick="navigate(\'payments\')">' +
        '<div class="flex items-center justify-between mb-2"><span class="text-xs font-bold text-slate-500 uppercase">' + t('dash.overdue') + '</span><span class="p-2 rounded-xl bg-red-50 text-red">' + icon('alert-triangle', 'w-4 h-4') + '</span></div>' +
        '<div class="text-2xl font-black text-red">' + overduePay + '</div>' +
        '<span class="text-[10px] text-red font-bold">Reminder SMS Active</span>' +
      '</div>' +
    '</div>' +
    '<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">' +
      '<div class="card p-5 lg:col-span-2">' +
        '<div class="flex items-center justify-between mb-4"><div><h3 class="font-extrabold text-slate-900 text-sm">Monthly Collections (ETB)</h3><p class="text-xs text-slate-500">2026 Academic Season fee collections</p></div><span class="badge badge-verified">LIVE LEDGER</span></div>' +
        '<div class="h-60 w-full flex flex-col justify-end pt-4">' +
          '<svg viewBox="0 0 600 200" class="w-full h-full overflow-visible">' +
            '<line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4"/>' +
            '<line x1="0" y1="90" x2="600" y2="90" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4"/>' +
            '<line x1="0" y1="140" x2="600" y2="140" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4"/>' +
            '<defs>' +
              '<linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="1">' +
                '<stop offset="0%" stop-color="#f96302" stop-opacity="0.3"/>' +
                '<stop offset="100%" stop-color="#f96302" stop-opacity="0.0"/>' +
              '</linearGradient>' +
            '</defs>' +
            '<polygon points="0,170 100,140 200,110 300,125 400,90 500,60 600,45 600,190 0,190" fill="url(#areaGrad)"/>' +
            '<polyline points="0,170 100,140 200,110 300,125 400,90 500,60 600,45" fill="none" stroke="#f96302" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
            '<circle cx="100" cy="140" r="4" fill="#ffffff" stroke="#f96302" stroke-width="2"/>' +
            '<circle cx="200" cy="110" r="4" fill="#ffffff" stroke="#f96302" stroke-width="2"/>' +
            '<circle cx="300" cy="125" r="4" fill="#ffffff" stroke="#f96302" stroke-width="2"/>' +
            '<circle cx="400" cy="90" r="4" fill="#ffffff" stroke="#f96302" stroke-width="2"/>' +
            '<circle cx="500" cy="60" r="4" fill="#ffffff" stroke="#f96302" stroke-width="2"/>' +
            '<circle cx="600" cy="45" r="5" fill="#f96302"/>' +
          '</svg>' +
          '<div class="flex justify-between text-[11px] font-bold text-slate-400 mt-2 px-1"><span>MAR (3.8k)</span><span>APR (4.2k)</span><span>MAY (4.5k)</span><span>JUN (4.1k)</span><span>JUL (4.6k)</span><span class="text-orange font-extrabold">AUG (5.2k ETB)</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="card p-5">' +
        '<div class="flex items-center justify-between mb-4"><div><h3 class="font-extrabold text-slate-900 text-sm">Squad Distribution</h3><p class="text-xs text-slate-500">Players per team category</p></div><span class="badge badge-team">9 TEAMS</span></div>' +
        '<div class="space-y-2.5">' +
          teams.slice(0, 6).map(function(t) {
            const count = players.filter(function(p) { return p.teamId === t.id; }).length;
            const pct = Math.min(100, Math.round((count / 15) * 100));
            return '<div><div class="flex justify-between text-xs font-bold text-slate-700 mb-1"><span>' + t.name + '</span><span class="text-slate-500">' + count + ' players</span></div><div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div class="bg-gradient-to-r from-orange to-amber-500 h-full rounded-full" style="width: ' + pct + '%"></div></div></div>';
          }).join('') +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">' +
      '<div class="card p-5">' +
        '<div class="flex items-center justify-between mb-3"><div class="flex items-center gap-2">' + icon('clipboard', 'w-4 h-4 text-orange') + '<h3 class="font-extrabold text-slate-900 text-sm">Recent Registration Applications</h3></div><button onclick="navigate(\'registrations\')" class="text-xs font-bold text-orange hover:underline">View All</button></div>' +
        '<div class="divide-y divide-slate-100">' +
          registrations.slice(0, 4).map(function(r) {
            return '<div class="py-2.5 flex items-center justify-between"><div><span class="font-bold text-xs text-slate-900 block">' + r.playerFullName + '</span><span class="text-[11px] text-slate-500">' + (r.teamName || 'U13 Premier') + ' • ' + r.phone + '</span></div><span class="badge ' + (r.status === 'ACTIVE' ? 'badge-active' : r.status === 'REJECTED' ? 'badge-rejected' : 'badge-pending') + '">' + tContent(r.status) + '</span></div>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<div class="card p-5">' +
        '<div class="flex items-center justify-between mb-3"><div class="flex items-center gap-2">' + icon('credit-card', 'w-4 h-4 text-emerald') + '<h3 class="font-extrabold text-slate-900 text-sm">Recent Financial Transactions</h3></div><button onclick="navigate(\'payments\')" class="text-xs font-bold text-orange hover:underline">View All</button></div>' +
        '<div class="divide-y divide-slate-100">' +
          payments.slice(0, 4).map(function(p) {
            return '<div class="py-2.5 flex items-center justify-between"><div><span class="font-bold text-xs text-slate-900 block">' + p.playerName + '</span><span class="text-[11px] text-slate-500 font-mono">' + p.transactionId + ' • ' + p.paymentMethod + '</span></div><div class="text-right"><span class="font-extrabold text-xs text-slate-900 block">' + p.amount + ' ETB</span><span class="text-[10px] font-bold text-emerald">' + p.verificationStatus + '</span></div></div>';
          }).join('') +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function renderPlayersScreen() {
  const players = AppState.db.players || [];
  const teams = AppState.db.teams || [];

  const filtered = players.filter(function(p) {
    if (AppState.playersFilter.team !== 'ALL' && p.teamId !== AppState.playersFilter.team) return false;
    if (AppState.playersFilter.status !== 'ALL' && p.status !== AppState.playersFilter.status) return false;
    if (AppState.playersFilter.search) {
      const q = AppState.playersFilter.search.toLowerCase();
      const match = p.fullName.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.phone && p.phone.includes(q)) ||
        (p.position && p.position.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return '<div class="space-y-6">' +
    '<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">' +
      '<div><h1 class="text-2xl font-black text-slate-900">' + t('players.title') + '</h1><p class="text-xs text-slate-500">Complete registry of 90+ academy athletes across all competitive age brackets.</p></div>' +
      '<div class="flex items-center gap-2">' +
        '<button onclick="exportPlayersCSV()" class="btn btn-white text-xs">' + icon('download', 'w-4 h-4 text-emerald') + ' ' + t('players.export') + '</button>' +
        '<button onclick="openAddPlayerModal()" class="btn btn-orange text-xs">' + icon('plus', 'w-4 h-4') + ' ' + t('players.add') + '</button>' +
      '</div>' +
    '</div>' +
    '<div class="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">' +
      '<button onclick="AppState.playersFilter.team = \'ALL\'; renderApp();" class="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ' + (AppState.playersFilter.team === 'ALL' ? 'bg-orange text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200') + '">All Squads (' + players.length + ')</button>' +
      teams.map(function(t) {
        return '<button onclick="AppState.playersFilter.team = \'' + t.id + '\'; renderApp();" class="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ' + (AppState.playersFilter.team === t.id ? 'bg-orange text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200') + '">' + t.name + '</button>';
      }).join('') +
    '</div>' +
    '<div class="flex flex-col sm:flex-row items-center justify-between gap-3">' +
      '<div class="relative w-full sm:max-w-xs">' +
        '<span class="absolute left-3 top-2.5 text-slate-400">' + icon('search', 'w-4 h-4') + '</span>' +
        '<input type="text" placeholder="Search by name, ID, phone..." value="' + AppState.playersFilter.search + '" oninput="AppState.playersFilter.search = this.value; renderApp();" class="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-orange"/>' +
      '</div>' +
      '<div class="flex items-center gap-2 w-full sm:w-auto justify-end">' +
        '<div class="bg-slate-100 p-1 rounded-xl border border-slate-200 flex">' +
          '<button onclick="AppState.playersFilter.viewMode = \'TABLE\'; renderApp();" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all ' + (AppState.playersFilter.viewMode === 'TABLE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500') + '">Table</button>' +
          '<button onclick="AppState.playersFilter.viewMode = \'CARDS\'; renderApp();" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all ' + (AppState.playersFilter.viewMode === 'CARDS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500') + '">FIFA Cards</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    (AppState.playersFilter.viewMode === 'CARDS' ?
      '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">' +
        filtered.map(function(p) { return renderFifaCardHTML(p); }).join('') +
      '</div>' :
      '<div class="card overflow-x-auto">' +
        '<table class="data-table">' +
          '<thead><tr><th>Player</th><th>ID</th><th>Team</th><th>Position</th><th>Jersey #</th><th>OVR</th><th>Fee Status</th><th>Status</th><th>Actions</th></tr></thead>' +
          '<tbody>' +
            (filtered.length === 0 ? '<tr><td colspan="9" class="text-center py-8 text-slate-400">No players match the selected filters.</td></tr>' :
              filtered.map(function(p) {
                return '<tr>' +
                  '<td><div class="flex items-center gap-3"><img src="' + p.photoUrl + '" alt="' + p.fullName + '" class="w-9 h-9 rounded-xl object-cover border border-slate-200"/><div><span class="font-extrabold text-xs text-slate-900 block">' + p.fullName + '</span><span class="text-[10px] text-slate-400">' + p.age + ' yrs • ' + p.dateOfBirth + '</span></div></div></td>' +
                  '<td class="font-mono text-xs font-bold text-slate-600">' + p.id + '</td>' +
                  '<td class="font-bold text-xs text-slate-700">' + tContent(p.teamName) + '</td>' +
                  '<td class="text-xs text-slate-600">' + tContent(p.position) + '</td>' +
                  '<td class="font-extrabold text-xs text-orange">#' + p.jerseyNumber + '</td>' +
                  '<td><span class="px-2 py-0.5 rounded-md bg-amber-50 text-amber font-black text-xs border border-amber-200">' + (p.statistics ? p.statistics.overallRating : 78) + '</span></td>' +
                  '<td><span class="badge ' + (p.feeSchedule && p.feeSchedule.paymentStatus === 'PAID' ? 'badge-paid' : 'badge-overdue') + '">' + tContent(p.feeSchedule ? p.feeSchedule.paymentStatus : 'PAID') + '</span></td>' +
                  '<td><span class="badge badge-active">' + tContent(p.status) + '</span></td>' +
                  '<td><div class="flex items-center gap-1.5"><button onclick="viewPlayerModal(\'' + p.id + '\')" class="p-1.5 rounded-lg text-slate-500 hover:text-orange hover:bg-orange-light" title="Inspect Player">' + icon('eye', 'w-4 h-4') + '</button></div></td>' +
                '</tr>';
              }).join('')) +
          '</tbody>' +
        '</table>' +
      '</div>'
    ) +
  '</div>';
}

function renderFifaCardHTML(player) {
  const stats = player.statistics || {
    overallRating: 78, pace: 75, shooting: 74, passing: 72, dribbling: 76, defending: 55, physical: 70
  };
  const posShort = player.position ? player.position.split(' ').map(function(w) { return w[0]; }).join('').slice(0, 3) : 'ST';

  return '<div class="fifa-card cursor-pointer" onclick="viewPlayerModal(\'' + player.id + '\')">' +
    '<div class="fifa-inner">' +
      '<div class="fifa-gold-pattern"></div>' +
      '<div class="flex justify-between items-start z-10">' +
        '<div class="flex flex-col items-center">' +
          '<span class="font-black text-2xl text-slate-900 leading-none">' + (stats.overallRating || 78) + '</span>' +
          '<span class="font-extrabold text-xs text-orange uppercase tracking-wider">' + posShort + '</span>' +
          '<div class="w-5 h-3 rounded-xs border border-slate-300 mt-1 flex flex-col overflow-hidden">' +
            '<div class="h-1 bg-emerald-500"></div><div class="h-1 bg-amber-400"></div><div class="h-1 bg-red"></div>' +
          '</div>' +
        '</div>' +
        '<div class="w-7 h-7">' + getCrestLogoSVG(28) + '</div>' +
      '</div>' +
      '<div class="w-full flex-1 flex items-center justify-center z-10 py-1">' +
        '<img src="' + player.photoUrl + '" alt="' + player.fullName + '" class="w-28 h-32 rounded-2xl object-cover border-2 border-amber-300 shadow-md"/>' +
      '</div>' +
      '<div class="text-center z-10 mt-1">' +
        '<span class="font-black text-sm text-slate-900 uppercase block truncate">' + player.fullName + '</span>' +
        '<span class="text-[10px] font-bold text-slate-600 block">' + tContent(player.teamName) + ' • #' + player.jerseyNumber + '</span>' +
      '</div>' +
      '<div class="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] font-extrabold text-slate-800 z-10 mt-2 px-3 pt-2 border-t border-amber-300/60 bg-white/40 rounded-xl">' +
        '<div class="flex justify-between"><span>PAC</span><span class="text-orange">' + (stats.pace || 75) + '</span></div>' +
        '<div class="flex justify-between"><span>DRI</span><span class="text-orange">' + (stats.dribbling || 76) + '</span></div>' +
        '<div class="flex justify-between"><span>SHO</span><span class="text-orange">' + (stats.shooting || 74) + '</span></div>' +
        '<div class="flex justify-between"><span>DEF</span><span class="text-orange">' + (stats.defending || 52) + '</span></div>' +
        '<div class="flex justify-between"><span>PAS</span><span class="text-orange">' + (stats.passing || 72) + '</span></div>' +
        '<div class="flex justify-between"><span>PHY</span><span class="text-orange">' + (stats.physical || 70) + '</span></div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function exportPlayersCSV() {
  const players = AppState.db.players || [];
  let csv = "Player ID,Full Name,Team,Age,Gender,Jersey Number,Position,OVR,Phone,Payment Status\\n";
  players.forEach(function(p) {
    csv += '"' + p.id + '","' + p.fullName + '","' + p.teamName + '","' + p.age + '","' + p.gender + '","' + p.jerseyNumber + '","' + p.position + '","' + (p.statistics ? p.statistics.overallRating : 75) + '","' + p.phone + '","' + (p.feeSchedule ? p.feeSchedule.paymentStatus : 'PAID') + '"\\n';
  });
  downloadFile(csv, 'Bulbula_Amen_FC_Players_Roster.csv', 'text/csv');
  showToast('Players roster exported to CSV successfully');
}

function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function viewPlayerModal(id) {
  const p = (AppState.db.players || []).find(function(x) { return x.id === id; });
  if (!p) return;

  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = '<div class="modal-backdrop" onclick="closeModal()">' +
    '<div class="modal-content p-6" onclick="event.stopPropagation()">' +
      '<div class="flex items-center justify-between pb-4 border-b border-slate-200">' +
        '<div class="flex items-center gap-3">' +
          '<img src="' + p.photoUrl + '" alt="' + p.fullName + '" class="w-12 h-12 rounded-xl object-cover border border-slate-200"/>' +
          '<div>' +
            '<h3 class="font-black text-lg text-slate-900">' + p.fullName + '</h3>' +
            '<span class="text-xs font-bold text-orange">' + p.id + ' • ' + p.teamName + ' • Jersey #' + p.jerseyNumber + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="flex items-center gap-2">' +
          '<button onclick="printCardWindow(\'' + p.id + '\')" class="btn btn-white text-xs">' + icon('printer', 'w-4 h-4') + ' Print FIFA Card</button>' +
          '<button onclick="closeModal()" class="p-2 text-slate-400 hover:text-slate-700">' + icon('x', 'w-5 h-5') + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">' +
        '<div class="flex flex-col items-center justify-center">' + renderFifaCardHTML(p) + '</div>' +
        '<div class="md:col-span-2 space-y-4">' +
          '<div class="card p-4 bg-slate-50">' +
            '<h4 class="text-xs font-extrabold text-slate-500 uppercase mb-2">Personal & Contact</h4>' +
            '<div class="grid grid-cols-2 gap-3 text-xs">' +
              '<div><span class="text-slate-400 block">DoB:</span><strong class="text-slate-800">' + p.dateOfBirth + ' (' + p.age + ' yrs)</strong></div>' +
              '<div><span class="text-slate-400 block">Gender:</span><strong class="text-slate-800">' + p.gender + '</strong></div>' +
              '<div><span class="text-slate-400 block">Nationality:</span><strong class="text-slate-800">' + p.nationality + '</strong></div>' +
              '<div><span class="text-slate-400 block">Phone:</span><strong class="text-slate-800">' + p.phone + '</strong></div>' +
              '<div class="col-span-2"><span class="text-slate-400 block">Address:</span><strong class="text-slate-800">' + p.address + '</strong></div>' +
            '</div>' +
          '</div>' +
          '<div class="card p-4 bg-slate-50">' +
            '<h4 class="text-xs font-extrabold text-slate-500 uppercase mb-2">Parent / Guardian Information</h4>' +
            '<div class="grid grid-cols-2 gap-3 text-xs">' +
              '<div><span class="text-slate-400 block">Parent Name:</span><strong class="text-slate-800">' + (p.parentInfo ? p.parentInfo.fullName : 'N/A') + '</strong></div>' +
              '<div><span class="text-slate-400 block">Relationship:</span><strong class="text-slate-800">' + (p.parentInfo ? p.parentInfo.relationship : 'Parent') + '</strong></div>' +
              '<div><span class="text-slate-400 block">Parent Phone:</span><strong class="text-slate-800">' + (p.parentInfo ? p.parentInfo.phone : 'N/A') + '</strong></div>' +
              '<div><span class="text-slate-400 block">Parent Email:</span><strong class="text-slate-800">' + (p.parentInfo ? p.parentInfo.email : 'N/A') + '</strong></div>' +
            '</div>' +
          '</div>' +
          '<div class="card p-4 bg-slate-50">' +
            '<h4 class="text-xs font-extrabold text-slate-500 uppercase mb-2">Financial Status & Fees</h4>' +
            '<div class="grid grid-cols-3 gap-2 text-xs">' +
              '<div class="bg-white p-2 rounded-xl border border-slate-200 text-center"><span class="text-slate-400 block text-[10px]">Monthly Fee</span><strong class="text-slate-900">' + (p.feeSchedule ? p.feeSchedule.monthlyFee : 1500) + ' ETB</strong></div>' +
              '<div class="bg-white p-2 rounded-xl border border-slate-200 text-center"><span class="text-slate-400 block text-[10px]">Total Paid</span><strong class="text-emerald">' + (p.feeSchedule ? p.feeSchedule.totalPaid : 0) + ' ETB</strong></div>' +
              '<div class="bg-white p-2 rounded-xl border border-slate-200 text-center"><span class="text-slate-400 block text-[10px]">Status</span><span class="badge ' + (p.feeSchedule && p.feeSchedule.paymentStatus === 'PAID' ? 'badge-paid' : 'badge-overdue') + '">' + (p.feeSchedule ? p.feeSchedule.paymentStatus : 'PAID') + '</span></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function printCardWindow(id) {
  const p = (AppState.db.players || []).find(function(x) { return x.id === id; });
  if (!p) return;
  const w = window.open('', '_blank');
  const stats = p.statistics || { overallRating: 78, pace: 75, shooting: 74, passing: 72, dribbling: 76, defending: 55, physical: 70 };
  const printDoc = '<html><head><title>' + p.fullName + ' — FIFA Card</title><style>' +
    'body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fff; margin: 0; }' +
    '.card { width: 300px; padding: 20px; border: 3px solid #f59e0b; border-radius: 20px; text-align: center; }' +
    '.photo { width: 130px; height: 150px; object-fit: cover; border-radius: 14px; margin: 10px auto; }' +
    '.ovr { font-size: 36px; font-weight: 900; }' +
    '.name { font-size: 16px; font-weight: 900; color: #f96302; margin-top: 8px; }' +
    '.stats { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 12px; font-weight: bold; margin-top: 10px; }' +
    '</style></head><body>' +
    '<div class="card">' +
      '<div class="ovr">' + (stats.overallRating || 78) + ' <span style="font-size:14px; color:#f96302;">' + (p.position || 'ST') + '</span></div>' +
      '<img class="photo" src="' + p.photoUrl + '"/>' +
      '<div class="name">' + p.fullName + '</div>' +
      '<div>Bulbula Amen F.C. • #' + p.jerseyNumber + '</div>' +
      '<div class="stats">' +
        '<div>PAC: ' + (stats.pace || 75) + '</div><div>DRI: ' + (stats.dribbling || 76) + '</div>' +
        '<div>SHO: ' + (stats.shooting || 74) + '</div><div>DEF: ' + (stats.defending || 52) + '</div>' +
        '<div>PAS: ' + (stats.passing || 72) + '</div><div>PHY: ' + (stats.physical || 70) + '</div>' +
      '</div>' +
    '</div>' +
    '<scr' + 'ipt>window.print();</scr' + 'ipt>' +
    '</body></html>';
  w.document.write(printDoc);
  w.document.close();
}

function closeModal() {
  const el = document.getElementById('modal-root');
  if (el) el.innerHTML = '';
}

function openAddPlayerModal() {
  const teams = AppState.db.teams || [];
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = '<div class="modal-backdrop" onclick="closeModal()">' +
    '<div class="modal-content p-6" onclick="event.stopPropagation()">' +
      '<div class="flex items-center justify-between pb-4 border-b border-slate-200">' +
        '<div class="flex items-center gap-2">' + icon('plus', 'w-5 h-5 text-orange') + '<h3 class="font-black text-lg text-slate-900">Add New Academy Player</h3></div>' +
        '<button onclick="closeModal()" class="p-2 text-slate-400 hover:text-slate-700">' + icon('x', 'w-5 h-5') + '</button>' +
      '</div>' +
      '<form onsubmit="handleSaveNewPlayer(event)" class="space-y-4 pt-4">' +
        '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">' +
          '<div><label class="block font-bold text-slate-700 mb-1">Full Name *</label><input type="text" id="np_name" required placeholder="e.g. Samuel Desta Bekele" class="form-input"/></div>' +
          '<div><label class="block font-bold text-slate-700 mb-1">Squad Category *</label><select id="np_team" required class="form-input">' + teams.map(function(t) { return '<option value="' + t.id + '">' + t.name + ' (' + t.ageRange + ')</option>'; }).join('') + '</select></div>' +
          '<div><label class="block font-bold text-slate-700 mb-1">Date of Birth *</label><input type="date" id="np_dob" required value="2013-05-15" class="form-input"/></div>' +
          '<div><label class="block font-bold text-slate-700 mb-1">Jersey Number</label><input type="number" id="np_jersey" value="10" min="1" max="99" class="form-input"/></div>' +
          '<div><label class="block font-bold text-slate-700 mb-1">Position</label><select id="np_pos" class="form-input"><option value="Striker">Striker</option><option value="Attacking Midfielder">Attacking Midfielder</option><option value="Central Midfielder">Central Midfielder</option><option value="Winger">Winger</option><option value="Center Back">Center Back</option><option value="Full Back">Full Back</option><option value="Goalkeeper">Goalkeeper</option></select></div>' +
          '<div><label class="block font-bold text-slate-700 mb-1">Phone Number</label><input type="text" id="np_phone" value="+251911400200" class="form-input"/></div>' +
          '<div><label class="block font-bold text-slate-700 mb-1">Parent Name</label><input type="text" id="np_parent_name" value="Desta Bekele" class="form-input"/></div>' +
          '<div><label class="block font-bold text-slate-700 mb-1">Parent Phone</label><input type="text" id="np_parent_phone" value="+251911400201" class="form-input"/></div>' +
        '</div>' +
        '<div class="pt-4 border-t border-slate-200 flex justify-end gap-2">' +
          '<button type="button" onclick="closeModal()" class="btn btn-slate text-xs">Cancel</button>' +
          '<button type="submit" class="btn btn-orange text-xs">Save to Roster</button>' +
        '</div>' +
      '</form>' +
    '</div>' +
  '</div>';
}

function handleSaveNewPlayer(e) {
  e.preventDefault();
  const teamId = document.getElementById('np_team').value;
  const team = (AppState.db.teams || []).find(function(t) { return t.id === teamId; });
  const teamShort = teamId.replace('TEAM-', '');
  const numId = String((AppState.db.players || []).length + 1).padStart(4, '0');
  const newId = 'BFC-' + teamShort + '-' + numId;

  const newPlayer = {
    id: newId,
    fullName: document.getElementById('np_name').value,
    firstName: document.getElementById('np_name').value.split(' ')[0] || '',
    middleName: document.getElementById('np_name').value.split(' ')[1] || '',
    lastName: document.getElementById('np_name').value.split(' ')[2] || '',
    teamId: teamId,
    teamName: team ? team.name : 'U13 Premier',
    dateOfBirth: document.getElementById('np_dob').value,
    age: new Date().getFullYear() - new Date(document.getElementById('np_dob').value).getFullYear(),
    jerseyNumber: Number(document.getElementById('np_jersey').value) || 10,
    position: document.getElementById('np_pos').value,
    phone: document.getElementById('np_phone').value,
    gender: 'Male',
    nationality: 'Ethiopian',
    placeOfBirth: 'Addis Ababa',
    address: 'Addis Ababa, Ethiopia',
    photoUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    registrationStatus: 'ACTIVE',
    paymentStatus: 'PAID',
    parentInfo: {
      fullName: document.getElementById('np_parent_name').value,
      phone: document.getElementById('np_parent_phone').value,
      relationship: 'Parent'
    },
    feeSchedule: {
      monthlyFee: team ? team.monthlyFee : 1500,
      totalPaid: 3500,
      paymentStatus: 'PAID'
    },
    statistics: {
      overallRating: 78, pace: 78, shooting: 74, passing: 76, dribbling: 78, defending: 60, physical: 72
    }
  };

  AppState.db.players.unshift(newPlayer);
  saveDatabase();
  logAudit('ADD_PLAYER', 'PLAYER', newId, 'Created player ' + newPlayer.fullName);
  closeModal();
  renderApp();
  showToast('Player ' + newPlayer.fullName + ' enrolled in ' + newPlayer.teamName);
}

function renderRegistrationsScreen() {
  const registrations = AppState.db.registrations || [];
  const statusFilter = AppState.regFilter.status;

  const filtered = registrations.filter(function(r) {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (AppState.regFilter.search) {
      const q = AppState.regFilter.search.toLowerCase();
      return r.playerFullName.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
    }
    return true;
  });

  return '<div class="space-y-6">' +
    '<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">' +
      '<div><h1 class="text-2xl font-black text-slate-900">' + t('reg.title') + '</h1><p class="text-xs text-slate-500">Review public applicant submissions, inspect submitted documents, and approve active enrollments.</p></div>' +
      '<button onclick="navigate(\'register\')" class="btn btn-orange text-xs">' + icon('plus', 'w-4 h-4') + ' Open Public Registration Form</button>' +
    '</div>' +
    '<div class="flex items-center gap-2 border-b border-slate-200 pb-2">' +
      '<button onclick="AppState.regFilter.status = \'PENDING_REVIEW\'; renderApp();" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ' + (statusFilter === 'PENDING_REVIEW' ? 'bg-orange text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200') + '">Pending Review (' + registrations.filter(function(r) { return r.status === 'PENDING_REVIEW'; }).length + ')</button>' +
      '<button onclick="AppState.regFilter.status = \'ACTIVE\'; renderApp();" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ' + (statusFilter === 'ACTIVE' ? 'bg-orange text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200') + '">Approved Roster (' + registrations.filter(function(r) { return r.status === 'ACTIVE'; }).length + ')</button>' +
      '<button onclick="AppState.regFilter.status = \'REJECTED\'; renderApp();" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ' + (statusFilter === 'REJECTED' ? 'bg-orange text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200') + '">Rejected (' + registrations.filter(function(r) { return r.status === 'REJECTED'; }).length + ')</button>' +
      '<button onclick="AppState.regFilter.status = \'ALL\'; renderApp();" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ' + (statusFilter === 'ALL' ? 'bg-orange text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200') + '">All (' + registrations.length + ')</button>' +
    '</div>' +
    '<div class="card overflow-x-auto">' +
      '<table class="data-table">' +
        '<thead><tr><th>Application ID</th><th>Player Candidate</th><th>Target Squad</th><th>Parent / Contact</th><th>Submitted At</th><th>Status</th><th>Actions</th></tr></thead>' +
        '<tbody>' +
          (filtered.length === 0 ? '<tr><td colspan="7" class="text-center py-8 text-slate-400">No registration records found for this filter.</td></tr>' :
            filtered.map(function(r) {
              return '<tr>' +
                '<td class="font-mono text-xs font-bold text-orange">' + r.id + '</td>' +
                '<td><span class="font-extrabold text-xs text-slate-900 block">' + r.playerFullName + '</span><span class="text-[10px] text-slate-400">DoB: ' + (r.playerDateOfBirth || '2013-09-12') + '</span></td>' +
                '<td class="font-bold text-xs text-slate-700">' + (r.teamName || 'U13 Premier') + '</td>' +
                '<td><span class="text-xs text-slate-800 font-semibold block">' + (r.applicantName || 'Parent') + '</span><span class="text-[10px] text-slate-400">' + r.phone + '</span></td>' +
                '<td class="text-xs text-slate-500">' + new Date(r.submittedAt || Date.now()).toLocaleDateString() + '</td>' +
                '<td><span class="badge ' + (r.status === 'ACTIVE' ? 'badge-active' : r.status === 'REJECTED' ? 'badge-rejected' : 'badge-pending') + '">' + r.status + '</span></td>' +
                '<td><button onclick="inspectRegistrationModal(\'' + r.id + '\')" class="btn btn-white text-xs py-1 px-2.5">' + icon('eye', 'w-3.5 h-3.5 text-orange') + ' Review</button></td>' +
              '</tr>';
            }).join('')) +
        '</tbody>' +
      '</table>' +
    '</div>' +
  '</div>';
}

function inspectRegistrationModal(id) {
  const r = (AppState.db.registrations || []).find(function(x) { return x.id === id; });
  if (!r) return;

  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = '<div class="modal-backdrop" onclick="closeModal()">' +
    '<div class="modal-content p-6" onclick="event.stopPropagation()">' +
      '<div class="flex items-center justify-between pb-4 border-b border-slate-200">' +
        '<div><h3 class="font-black text-lg text-slate-900">Registration Review: ' + r.playerFullName + '</h3><span class="text-xs font-bold text-orange">Application Reference: ' + r.id + '</span></div>' +
        '<button onclick="closeModal()" class="p-2 text-slate-400 hover:text-slate-700">' + icon('x', 'w-5 h-5') + '</button>' +
      '</div>' +
      '<div class="space-y-4 pt-4 text-xs">' +
        '<div class="grid grid-cols-2 gap-4">' +
          '<div class="card p-3 bg-slate-50"><span class="font-bold text-slate-400 block mb-1">PLAYER DETAILS</span><div>Full Name: <strong>' + r.playerFullName + '</strong></div><div>DoB: <strong>' + (r.playerDateOfBirth || '2013-09-12') + '</strong></div><div>Squad Choice: <strong>' + (r.teamName || 'U13 Premier') + '</strong></div></div>' +
          '<div class="card p-3 bg-slate-50"><span class="font-bold text-slate-400 block mb-1">PARENT / GUARDIAN</span><div>Name: <strong>' + (r.applicantName || 'Parent') + '</strong></div><div>Phone: <strong>' + r.phone + '</strong></div><div>Email: <strong>' + (r.email || 'N/A') + '</strong></div></div>' +
        '</div>' +
        '<div class="pt-4 border-t border-slate-200 flex items-center justify-between">' +
          '<span class="badge ' + (r.status === 'ACTIVE' ? 'badge-active' : r.status === 'REJECTED' ? 'badge-rejected' : 'badge-pending') + '">Status: ' + r.status + '</span>' +
          '<div class="flex items-center gap-2">' +
            (r.status !== 'ACTIVE' ? '<button onclick="approveRegistration(\'' + r.id + '\')" class="btn btn-emerald text-xs">' + icon('check', 'w-4 h-4') + ' Approve & Enroll Player</button>' : '') +
            (r.status !== 'REJECTED' ? '<button onclick="rejectRegistration(\'' + r.id + '\')" class="btn btn-red text-xs">' + icon('x', 'w-4 h-4') + ' Reject Application</button>' : '') +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function approveRegistration(id) {
  const r = (AppState.db.registrations || []).find(function(x) { return x.id === id; });
  if (!r) return;
  r.status = 'ACTIVE';

  const teamId = r.teamId || 'TEAM-U13';
  const team = (AppState.db.teams || []).find(function(t) { return t.id === teamId; });
  const teamShort = teamId.replace('TEAM-', '');
  const newPlayerId = 'BFC-' + teamShort + '-' + String((AppState.db.players || []).length + 1).padStart(4, '0');

  const newPlayer = {
    id: newPlayerId,
    fullName: r.playerFullName,
    firstName: r.playerFullName.split(' ')[0] || '',
    middleName: r.playerFullName.split(' ')[1] || '',
    lastName: r.playerFullName.split(' ')[2] || '',
    teamId: teamId,
    teamName: team ? team.name : 'U13 Premier',
    dateOfBirth: r.playerDateOfBirth || '2013-09-12',
    age: 13,
    jerseyNumber: 15,
    position: 'Midfielder',
    phone: r.phone,
    gender: r.gender || 'Male',
    nationality: 'Ethiopian',
    placeOfBirth: 'Addis Ababa',
    address: 'Addis Ababa',
    photoUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    registrationStatus: 'ACTIVE',
    paymentStatus: 'PAID',
    parentInfo: { fullName: r.applicantName || 'Parent', phone: r.phone, relationship: 'Parent' },
    feeSchedule: { monthlyFee: 1500, totalPaid: 3500, paymentStatus: 'PAID' },
    statistics: { overallRating: 77, pace: 76, shooting: 72, passing: 75, dribbling: 77, defending: 58, physical: 70 }
  };

  AppState.db.players.unshift(newPlayer);
  saveDatabase();
  logAudit('APPROVE_REGISTRATION', 'REGISTRATION', id, 'Approved candidate ' + r.playerFullName);
  closeModal();
  renderApp();
  showToast('Registration approved! Candidate ' + r.playerFullName + ' enrolled as ' + newPlayerId);
}

function rejectRegistration(id) {
  const r = (AppState.db.registrations || []).find(function(x) { return x.id === id; });
  if (!r) return;
  r.status = 'REJECTED';
  saveDatabase();
  logAudit('REJECT_REGISTRATION', 'REGISTRATION', id, 'Rejected candidate ' + r.playerFullName);
  closeModal();
  renderApp();
  showToast('Registration rejected for ' + r.playerFullName);
}

function renderPaymentsScreen() {
  const payments = AppState.db.payments || [];
  const players = AppState.db.players || [];
  const activeTab = AppState.payFilter.view;

  const underVerification = payments.filter(function(p) { return p.verificationStatus === 'Under Verification'; });

  return '<div class="space-y-6">' +
    '<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">' +
      '<div><h1 class="text-2xl font-black text-slate-900">' + t('pay.title') + '</h1><p class="text-xs text-slate-500">Telebirr & CBE Birr electronic receipt verification queue, financial statements, and fee ledger.</p></div>' +
      '<div class="flex items-center gap-2">' +
        '<button onclick="openRecordPaymentModal()" class="btn btn-orange text-xs">' + icon('plus', 'w-4 h-4') + ' Record Offline Payment</button>' +
      '</div>' +
    '</div>' +
    '<div class="flex items-center gap-2 border-b border-slate-200 pb-2">' +
      '<button onclick="AppState.payFilter.view = \'dashboard\'; renderApp();" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ' + (activeTab === 'dashboard' ? 'bg-orange text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200') + '">Payment Dashboard & Roster Ledgers</button>' +
      '<button onclick="AppState.payFilter.view = \'verification\'; renderApp();" class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ' + (activeTab === 'verification' ? 'bg-orange text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200') + '">' +
        'Receipt Verification Queue ' +
        (underVerification.length > 0 ? '<span class="px-2 py-0.5 rounded-full text-[9px] font-black ' + (activeTab === 'verification' ? 'bg-white text-orange' : 'bg-orange text-white') + '">' + underVerification.length + '</span>' : '') +
      '</button>' +
    '</div>' +
    (activeTab === 'verification' ?
      '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">' +
        payments.map(function(pay) {
          return '<div class="card p-5 space-y-4">' +
            '<div class="flex items-start justify-between"><div><span class="text-[10px] font-extrabold uppercase text-slate-400 block">' + pay.paymentMethod + '</span><h4 class="font-extrabold text-sm text-slate-900">' + pay.playerName + '</h4><span class="text-xs font-mono font-bold text-orange">' + pay.transactionId + '</span></div><span class="badge ' + (pay.verificationStatus === 'Verified' ? 'badge-active' : 'badge-pending') + '">' + pay.verificationStatus + '</span></div>' +
            '<div class="w-full h-36 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 relative group cursor-pointer" onclick="openReceiptModal(\'' + pay.id + '\')">' +
              '<img src="' + (pay.screenshotUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80') + '" class="w-full h-full object-cover group-hover:scale-105 transition-all"/>' +
              '<div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white font-bold text-xs">Click to Inspect Screenshot</div>' +
            '</div>' +
            '<div class="flex items-center justify-between text-xs pt-2 border-t border-slate-100"><div><span class="text-slate-400 block text-[10px]">Amount Paid</span><strong class="text-slate-900 text-sm font-black">' + pay.amount + ' ETB</strong></div>' +
              '<div class="flex items-center gap-1.5">' +
                (pay.verificationStatus !== 'Verified' ? '<button onclick="verifyPayment(\'' + pay.id + '\')" class="btn btn-emerald text-xs py-1 px-2.5">' + icon('check', 'w-3.5 h-3.5') + ' Verify</button>' : '<span class="text-xs text-emerald font-bold">✓ Approved</span>') +
              '</div>' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>' :
      '<div class="card overflow-x-auto">' +
        '<table class="data-table">' +
          '<thead><tr><th>Player</th><th>Squad</th><th>Monthly Fee</th><th>Total Paid</th><th>Status</th><th>Actions</th></tr></thead>' +
          '<tbody>' +
            players.slice(0, 20).map(function(p) {
              return '<tr>' +
                '<td><span class="font-extrabold text-xs text-slate-900 block">' + p.fullName + '</span><span class="text-[10px] text-slate-400 font-mono">' + p.id + '</span></td>' +
                '<td class="font-bold text-xs text-slate-700">' + tContent(p.teamName) + '</td>' +
                '<td class="text-xs font-bold text-slate-800">' + (p.feeSchedule ? p.feeSchedule.monthlyFee : 1500) + ' ETB</td>' +
                '<td class="text-xs font-extrabold text-emerald">' + (p.feeSchedule ? p.feeSchedule.totalPaid : 0) + ' ETB</td>' +
                '<td><span class="badge ' + (p.feeSchedule && p.feeSchedule.paymentStatus === 'PAID' ? 'badge-paid' : 'badge-overdue') + '">' + tContent(p.feeSchedule ? p.feeSchedule.paymentStatus : 'PAID') + '</span></td>' +
                '<td><button onclick="sendPaymentReminder(\'' + p.id + '\')" class="btn btn-white text-xs py-1 px-2">Send Reminder SMS</button></td>' +
              '</tr>';
            }).join('') +
          '</tbody>' +
        '</table>' +
      '</div>'
    ) +
  '</div>';
}

function verifyPayment(id) {
  const pay = (AppState.db.payments || []).find(function(p) { return p.id === id; });
  if (!pay) return;
  pay.verificationStatus = 'Verified';
  pay.verifiedBy = AppState.currentUser.name;
  pay.verificationDate = new Date().toISOString();

  const player = (AppState.db.players || []).find(function(p) { return p.id === pay.playerId || p.fullName === pay.playerName; });
  if (player && player.feeSchedule) {
    player.feeSchedule.paymentStatus = 'PAID';
    player.feeSchedule.totalPaid = (Number(player.feeSchedule.totalPaid) || 0) + Number(pay.amount);
  }

  saveDatabase();
  logAudit('VERIFY_PAYMENT', 'PAYMENT', id, 'Verified ' + pay.amount + ' ETB for ' + pay.playerName);
  renderApp();
  showToast('Payment verified! ' + pay.amount + ' ETB credited for ' + pay.playerName);
}

function sendPaymentReminder(playerId) {
  const p = (AppState.db.players || []).find(function(x) { return x.id === playerId; });
  if (!p) return;
  showToast('Reminder SMS successfully dispatched to ' + (p.parentInfo ? p.parentInfo.phone : p.phone));
  logAudit('SEND_REMINDER', 'PLAYER', playerId, 'Sent SMS payment reminder');
}

function openReceiptModal(id) {
  const pay = (AppState.db.payments || []).find(function(p) { return p.id === id; });
  if (!pay) return;
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = '<div class="modal-backdrop" onclick="closeModal()">' +
    '<div class="modal-content p-6" onclick="event.stopPropagation()">' +
      '<div class="flex items-center justify-between pb-4 border-b border-slate-200">' +
        '<h3 class="font-black text-sm text-slate-900">Receipt Verification: ' + pay.transactionId + '</h3>' +
        '<button onclick="closeModal()" class="p-2 text-slate-400 hover:text-slate-700">' + icon('x', 'w-5 h-5') + '</button>' +
      '</div>' +
      '<div class="py-4 text-center">' +
        '<img src="' + (pay.screenshotUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80') + '" class="max-h-96 mx-auto rounded-xl shadow-lg border border-slate-200"/>' +
        '<div class="mt-4 flex items-center justify-center gap-4">' +
          '<button onclick="verifyPayment(\'' + pay.id + '\'); closeModal();" class="btn btn-emerald text-xs">' + icon('check', 'w-4 h-4') + ' Approve & Mark Verified</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function openRecordPaymentModal() {
  const players = AppState.db.players || [];
  const modalRoot = document.getElementById('modal-root');
  modalRoot.innerHTML = '<div class="modal-backdrop" onclick="closeModal()">' +
    '<div class="modal-content p-6" onclick="event.stopPropagation()">' +
      '<div class="flex items-center justify-between pb-4 border-b border-slate-200">' +
        '<h3 class="font-black text-sm text-slate-900">Record Offline Payment (Cash / Bank Deposit)</h3>' +
        '<button onclick="closeModal()" class="p-2 text-slate-400 hover:text-slate-700">' + icon('x', 'w-5 h-5') + '</button>' +
      '</div>' +
      '<form onsubmit="handleRecordOfflinePayment(event)" class="space-y-4 pt-4 text-xs">' +
        '<div><label class="block font-bold text-slate-700 mb-1">Select Player</label><select id="op_player" required class="form-input">' + players.map(function(p) { return '<option value="' + p.id + '">' + p.fullName + ' (' + p.teamName + ')</option>'; }).join('') + '</select></div>' +
        '<div class="grid grid-cols-2 gap-3">' +
          '<div><label class="block font-bold text-slate-700 mb-1">Amount (ETB)</label><input type="number" id="op_amount" value="1500" required class="form-input"/></div>' +
          '<div><label class="block font-bold text-slate-700 mb-1">Payment Method</label><select id="op_method" class="form-input"><option value="Cash">Cash</option><option value="CBE Direct Deposit">CBE Direct Deposit</option><option value="Telebirr Merchant">Telebirr Merchant</option><option value="Awash Bank">Awash Bank</option></select></div>' +
        '</div>' +
        '<div class="pt-4 border-t border-slate-200 flex justify-end gap-2">' +
          '<button type="button" onclick="closeModal()" class="btn btn-slate text-xs">Cancel</button>' +
          '<button type="submit" class="btn btn-orange text-xs">Record & Verify</button>' +
        '</div>' +
      '</form>' +
    '</div>' +
  '</div>';
}

function handleRecordOfflinePayment(e) {
  e.preventDefault();
  const pId = document.getElementById('op_player').value;
  const player = (AppState.db.players || []).find(function(p) { return p.id === pId; });
  const amount = Number(document.getElementById('op_amount').value) || 1500;
  const method = document.getElementById('op_method').value;

  const newPay = {
    id: 'PAY-' + Date.now(),
    playerId: pId,
    playerName: player ? player.fullName : 'Player',
    teamId: player ? player.teamId : 'TEAM-U13',
    teamName: player ? player.teamName : 'U13 Premier',
    amount: amount,
    type: 'MONTHLY',
    transactionId: 'MANUAL-' + Math.floor(100000 + Math.random() * 900000),
    paymentDate: new Date().toISOString(),
    paymentMethod: method,
    verificationStatus: 'Verified',
    verifiedBy: AppState.currentUser.name
  };

  if (!AppState.db.payments) AppState.db.payments = [];
  AppState.db.payments.unshift(newPay);

  if (player && player.feeSchedule) {
    player.feeSchedule.paymentStatus = 'PAID';
    player.feeSchedule.totalPaid = (Number(player.feeSchedule.totalPaid) || 0) + amount;
  }

  saveDatabase();
  logAudit('RECORD_OFFLINE_PAYMENT', 'PAYMENT', newPay.id, 'Recorded ' + amount + ' ETB for ' + newPay.playerName);
  closeModal();
  renderApp();
  showToast('Payment of ' + amount + ' ETB successfully recorded for ' + newPay.playerName);
}

function renderTeamsScreen() {
  const teams = AppState.db.teams || [];
  const players = AppState.db.players || [];
  const selectedTeamId = AppState.attendanceTeam;
  const selectedTeam = teams.find(function(t) { return t.id === selectedTeamId; }) || teams[0];
  const teamPlayers = players.filter(function(p) { return p.teamId === selectedTeamId; });

  return '<div class="space-y-6">' +
    '<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">' +
      '<div><h1 class="text-2xl font-black text-slate-900">' + t('teams.title') + '</h1><p class="text-xs text-slate-500">Official squads, training calendar, pitch schedules, and daily attendance tracking.</p></div>' +
    '</div>' +
    '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">' +
      teams.map(function(t) {
        const count = players.filter(function(p) { return p.teamId === t.id; }).length;
        return '<div class="card p-5 space-y-3 ' + (AppState.attendanceTeam === t.id ? 'border-orange ring-2 ring-orange/20' : '') + '">' +
          '<div class="flex items-start justify-between"><div><span class="text-[10px] font-black uppercase text-orange tracking-widest">' + t.category + '</span><h3 class="font-extrabold text-base text-slate-900">' + t.name + '</h3><span class="text-xs text-slate-500 font-semibold">' + t.ageRange + '</span></div><span class="badge badge-team">' + count + ' players</span></div>' +
          '<div class="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">' +
            '<div class="flex items-center gap-2">' + icon('clock', 'w-3.5 h-3.5 text-orange') + '<span>' + t.trainingDays + ' (' + t.trainingTime + ')</span></div>' +
            '<div class="flex items-center gap-2">' + icon('user', 'w-3.5 h-3.5 text-slate-400') + '<span>Coach: ' + t.coachName + '</span></div>' +
          '</div>' +
          '<div class="pt-2 flex justify-between items-center"><button onclick="AppState.attendanceTeam = \'' + t.id + '\'; renderApp();" class="btn ' + (AppState.attendanceTeam === t.id ? 'btn-orange' : 'btn-white') + ' text-xs w-full">' + (AppState.attendanceTeam === t.id ? '✓ Selected for Attendance' : 'Take Attendance') + '</button></div>' +
        '</div>';
      }).join('') +
    '</div>' +
    '<div class="card p-6 space-y-4">' +
      '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">' +
        '<div><span class="text-xs font-bold uppercase text-orange">Training Session Roll-Call</span><h3 class="font-extrabold text-base text-slate-900">Attendance Sheet: ' + (selectedTeam ? selectedTeam.name : '') + '</h3></div>' +
        '<div class="flex items-center gap-3">' +
          '<input type="date" value="' + AppState.attendanceDate + '" onchange="AppState.attendanceDate = this.value; renderApp();" class="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white"/>' +
          '<button onclick="markAllPresent()" class="btn btn-white text-xs">Mark All Present</button>' +
          '<button onclick="saveAttendance()" class="btn btn-emerald text-xs">' + icon('check', 'w-4 h-4') + ' Save Attendance</button>' +
        '</div>' +
      '</div>' +
      '<div class="divide-y divide-slate-100">' +
        (teamPlayers.length === 0 ? '<div class="py-8 text-center text-slate-400 text-xs">No players assigned to this squad.</div>' :
          teamPlayers.map(function(p) {
            const status = AppState.attendanceRecords[p.id] || 'PRESENT';
            return '<div class="py-3 flex items-center justify-between">' +
              '<div class="flex items-center gap-3"><img src="' + p.photoUrl + '" class="w-8 h-8 rounded-lg object-cover"/><div><span class="font-bold text-xs text-slate-900 block">' + p.fullName + '</span><span class="text-[10px] text-slate-400">#' + p.jerseyNumber + ' • ' + p.position + '</span></div></div>' +
              '<div class="flex items-center gap-1.5">' +
                '<button onclick="setAttendanceStatus(\'' + p.id + '\', \'PRESENT\')" class="px-3 py-1 rounded-lg text-xs font-bold ' + (status === 'PRESENT' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600') + '">Present</button>' +
                '<button onclick="setAttendanceStatus(\'' + p.id + '\', \'ABSENT\')" class="px-3 py-1 rounded-lg text-xs font-bold ' + (status === 'ABSENT' ? 'bg-red text-white' : 'bg-slate-100 text-slate-600') + '">Absent</button>' +
                '<button onclick="setAttendanceStatus(\'' + p.id + '\', \'EXCUSED\')" class="px-3 py-1 rounded-lg text-xs font-bold ' + (status === 'EXCUSED' ? 'bg-amber text-white' : 'bg-slate-100 text-slate-600') + '">Excused</button>' +
              '</div>' +
            '</div>';
          }).join('')) +
      '</div>' +
    '</div>' +
  '</div>';
}

function setAttendanceStatus(playerId, status) {
  AppState.attendanceRecords[playerId] = status;
  renderApp();
}

function markAllPresent() {
  const players = AppState.db.players || [];
  const teamPlayers = players.filter(function(p) { return p.teamId === AppState.attendanceTeam; });
  teamPlayers.forEach(function(p) { AppState.attendanceRecords[p.id] = 'PRESENT'; });
  renderApp();
  showToast('All squad members marked Present');
}

function saveAttendance() {
  logAudit('RECORD_ATTENDANCE', 'TEAM', AppState.attendanceTeam, 'Saved attendance for ' + AppState.attendanceDate);
  showToast('Daily attendance saved successfully');
}

function renderCMSScreen() {
  const cms = AppState.db.cms || {};
  const banners = cms.promoBanners || [];

  return '<div class="space-y-6">' +
    '<div><h1 class="text-2xl font-black text-slate-900">' + t('cms.title') + '</h1><p class="text-xs text-slate-500">Manage promotional banners, announcements, and club contact details displayed on the website.</p></div>' +
    '<div class="grid grid-cols-1 md:grid-cols-3 gap-6">' +
      banners.map(function(b) {
        return '<div class="card p-5 space-y-3">' +
          '<div class="w-full h-36 rounded-xl overflow-hidden relative"><img src="' + b.imageUrl + '" class="w-full h-full object-cover"/><span class="absolute top-2 left-2 bg-slate-900/80 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">' + b.badge + '</span></div>' +
          '<h4 class="font-extrabold text-sm text-slate-900 leading-snug">' + b.title + '</h4>' +
          '<p class="text-xs text-slate-500 line-clamp-2">' + b.tagline + '</p>' +
          '<button onclick="showToast(\'Banner slot saved\')" class="btn btn-orange text-xs w-full">Edit Banner Slot</button>' +
        '</div>';
      }).join('') +
    '</div>' +
  '</div>';
}

function renderGalleryScreen() {
  const gallery = AppState.db.gallery || [];
  return '<div class="space-y-6">' +
    '<div class="flex items-center justify-between"><div><h1 class="text-2xl font-black text-slate-900">Media & Trophy Gallery</h1><p class="text-xs text-slate-500">Official tournament photos, match celebrations, and youth academy camps.</p></div></div>' +
    '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">' +
      gallery.map(function(album) {
        return '<div class="card overflow-hidden">' +
          '<div class="h-48 overflow-hidden relative"><img src="' + album.coverPhotoUrl + '" class="w-full h-full object-cover"/><span class="absolute bottom-2 right-2 bg-slate-900/80 text-white text-xs px-2.5 py-1 rounded-lg font-bold">' + album.mediaCount + ' items</span></div>' +
          '<div class="p-4"><h3 class="font-extrabold text-sm text-slate-900">' + album.title + '</h3><p class="text-xs text-slate-500 mt-1">' + album.description + '</p></div>' +
        '</div>';
      }).join('') +
    '</div>' +
  '</div>';
}

function renderNotificationsScreen() {
  const notifs = AppState.db.notifications || [];
  return '<div class="space-y-6">' +
    '<div class="flex items-center justify-between"><h1 class="text-2xl font-black text-slate-900">Notifications & Broadcasts</h1><button onclick="markAllNotificationsRead()" class="btn btn-white text-xs">Mark All Read</button></div>' +
    '<div class="card divide-y divide-slate-100">' +
      notifs.map(function(n) {
        return '<div class="p-4 flex items-center justify-between hover:bg-slate-50"><div><span class="font-bold text-xs text-slate-900 block">' + n.title + '</span><p class="text-xs text-slate-600">' + n.message + '</p><span class="text-[10px] text-slate-400 mt-1 block">' + new Date(n.createdAt).toLocaleString() + '</span></div><span class="badge badge-team">' + (n.channel || 'SMS') + '</span></div>';
      }).join('') +
    '</div>' +
  '</div>';
}

function renderUsersScreen() {
  const users = AppState.db.users || [];
  return '<div class="space-y-6">' +
    '<div class="flex items-center justify-between"><div><h1 class="text-2xl font-black text-slate-900">' + t('users.title') + '</h1><p class="text-xs text-slate-500">Staff directory and role access permissions matrix.</p></div></div>' +
    '<div class="card overflow-x-auto">' +
      '<table class="data-table">' +
        '<thead><tr><th>Staff Member</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th></tr></thead>' +
        '<tbody>' +
          users.map(function(u) {
            return '<tr>' +
              '<td><div class="flex items-center gap-3"><img src="' + u.avatar + '" class="w-8 h-8 rounded-lg object-cover"/><span class="font-bold text-xs text-slate-900">' + u.name + '</span></div></td>' +
              '<td class="text-xs text-slate-600">' + u.email + '</td>' +
              '<td class="text-xs text-slate-600 font-mono">' + u.phone + '</td>' +
              '<td><span class="badge badge-verified">' + u.role + '</span></td>' +
              '<td><span class="badge badge-active">ACTIVE</span></td>' +
            '</tr>';
          }).join('') +
        '</tbody>' +
      '</table>' +
    '</div>' +
  '</div>';
}

function renderReportsScreen() {
  return '<div class="space-y-6">' +
    '<div class="flex items-center justify-between">' +
      '<h1 class="text-2xl font-black text-slate-900">' + t('reports.title') + '</h1>' +
      '<div class="flex gap-2">' +
        '<button onclick="window.print()" class="btn btn-white text-xs">' + icon('printer', 'w-4 h-4') + ' Print Summary</button>' +
        '<button onclick="exportPlayersCSV()" class="btn btn-orange text-xs">' + icon('download', 'w-4 h-4') + ' Export Full CSV</button>' +
      '</div>' +
    '</div>' +
    '<div class="grid grid-cols-1 md:grid-cols-3 gap-6">' +
      '<div class="card p-5 text-center space-y-2"><h4 class="font-extrabold text-sm text-slate-900">Squad Demographics</h4><p class="text-xs text-slate-500">Age distribution, positions, and player registrations per category.</p><button onclick="exportPlayersCSV()" class="btn btn-slate text-xs w-full">Generate CSV</button></div>' +
      '<div class="card p-5 text-center space-y-2"><h4 class="font-extrabold text-sm text-slate-900">Financial Collections</h4><p class="text-xs text-slate-500">Telebirr and CBE Birr transaction ledgers and outstanding balances.</p><button onclick="showToast(\'Exporting Financial Report...\')" class="btn btn-slate text-xs w-full">Generate CSV</button></div>' +
      '<div class="card p-5 text-center space-y-2"><h4 class="font-extrabold text-sm text-slate-900">Attendance Summary</h4><p class="text-xs text-slate-500">Weekly and monthly player attendance percentages for coaching staff.</p><button onclick="showToast(\'Exporting Attendance Report...\')" class="btn btn-slate text-xs w-full">Generate CSV</button></div>' +
    '</div>' +
  '</div>';
}

function renderAuditLogsScreen() {
  const logs = AppState.db.auditLogs || [];
  return '<div class="space-y-6">' +
    '<div class="flex items-center justify-between"><div><h1 class="text-2xl font-black text-slate-900">' + t('audit.title') + '</h1><p class="text-xs text-slate-500">Immutable security ledger capturing administrative approvals and player edits.</p></div></div>' +
    '<div class="card overflow-x-auto">' +
      '<table class="data-table">' +
        '<thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Record Type</th><th>Record ID</th><th>Details</th></tr></thead>' +
        '<tbody>' +
          logs.map(function(l) {
            return '<tr>' +
              '<td class="text-xs font-mono text-slate-500">' + new Date(l.timestamp).toLocaleString() + '</td>' +
              '<td class="font-bold text-xs text-slate-900">' + l.userName + ' (' + l.userRole + ')</td>' +
              '<td><span class="badge badge-team font-mono">' + l.action + '</span></td>' +
              '<td class="text-xs text-slate-600">' + l.affectedRecordType + '</td>' +
              '<td class="text-xs font-mono font-bold text-orange">' + l.affectedRecordId + '</td>' +
              '<td class="text-xs text-slate-600">' + (l.details || '') + '</td>' +
            '</tr>';
          }).join('') +
        '</tbody>' +
      '</table>' +
    '</div>' +
  '</div>';
}

function renderSettingsScreen() {
  const settings = AppState.db.settings || {};
  return '<div class="space-y-6">' +
    '<div><h1 class="text-2xl font-black text-slate-900">' + t('nav.settings') + '</h1><p class="text-xs text-slate-500">Club configurations, Telebirr/CBE accounts, and offline database management.</p></div>' +
    '<div class="card p-6 space-y-4 max-w-2xl">' +
      '<h3 class="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-2">Club Identification</h3>' +
      '<div class="grid grid-cols-2 gap-4 text-xs">' +
        '<div><label class="block font-bold text-slate-700 mb-1">Club Name</label><input type="text" class="form-input" value="' + (settings.clubName || 'Bulbula Amen Football Club') + '"/></div>' +
        '<div><label class="block font-bold text-slate-700 mb-1">Short Name</label><input type="text" class="form-input" value="' + (settings.shortName || 'Bulbula Amen FC') + '"/></div>' +
        '<div><label class="block font-bold text-slate-700 mb-1">Telebirr Account</label><input type="text" class="form-input" value="' + (settings.telebirrAccount || '10002938481') + '"/></div>' +
        '<div><label class="block font-bold text-slate-700 mb-1">CBE Bank Account</label><input type="text" class="form-input" value="' + (settings.cbeAccount || '1000123456789') + '"/></div>' +
      '</div>' +
      '<button onclick="showToast(\'Club settings saved successfully\')" class="btn btn-orange text-xs">Save Settings</button>' +
    '</div>' +
    '<div class="card p-6 space-y-4 max-w-2xl border-orange/40">' +
      '<h3 class="font-extrabold text-sm text-slate-900 border-b border-slate-200 pb-2">Offline Data Backup & Restore</h3>' +
      '<p class="text-xs text-slate-500">Export your local database to a JSON file or restore from a backup.</p>' +
      '<div class="flex flex-wrap gap-3">' +
        '<button onclick="exportDatabaseJSON()" class="btn btn-emerald text-xs">' + icon('download', 'w-4 h-4') + ' Export Database JSON</button>' +
        '<label class="btn btn-white text-xs cursor-pointer">' + icon('upload', 'w-4 h-4') + ' Import Backup JSON<input type="file" accept=".json" onchange="importDatabaseJSON(this)" class="hidden"/></label>' +
        '<button onclick="resetToInitialSeed()" class="btn btn-red text-xs">Reset to Initial 90 Players</button>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function exportDatabaseJSON() {
  const str = JSON.stringify(AppState.db, null, 2);
  downloadFile(str, 'Bulbula_Amen_FC_Backup.json', 'application/json');
  showToast('Database exported successfully');
}

function importDatabaseJSON(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (imported.players && imported.teams) {
        AppState.db = imported;
        saveDatabase();
        renderApp();
        showToast('Database successfully restored from JSON backup!');
      }
    } catch (err) {
      alert('Invalid JSON file');
    }
  };
  reader.readAsText(file);
}

function resetToInitialSeed() {
  if (confirm('Reset entire system database to default 90 players seed?')) {
    AppState.db = JSON.parse(JSON.stringify(INITIAL_SEED_DB));
    saveDatabase();
    renderApp();
    showToast('Database reset to official initial seed');
  }
}

function renderParentPortalScreen() {
  const players = AppState.db.players || [];
  const selected = players[0] || {};

  return '<div class="min-h-screen bg-slate-50 font-sans pb-12">' +
    '<header class="bg-white border-b border-slate-200 px-4 py-3.5 sticky top-0 z-40 shadow-xs">' +
      '<div class="max-w-5xl mx-auto flex items-center justify-between">' +
        '<div class="flex items-center gap-3">' +
          '<button onclick="navigate(\'dashboard\')" class="btn btn-white text-xs py-1.5 px-3">← Back to Admin</button>' +
          '<div class="flex items-center gap-2">' + getCrestLogoSVG(32) + '<span class="font-black text-sm text-slate-900">BULBULA AMEN FC • PARENT PORTAL</span></div>' +
        '</div>' +
        '<button onclick="navigate(\'upload-payment\')" class="btn btn-orange text-xs">Upload Payment Receipt</button>' +
      '</div>' +
    '</header>' +
    '<main class="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 mt-4">' +
      '<div class="card p-6 bg-gradient-to-r from-orange to-amber-500 text-white flex flex-col sm:flex-row justify-between items-center gap-4">' +
        '<div>' +
          '<span class="text-xs font-bold uppercase tracking-wider block text-white/80">Enrolled Athlete</span>' +
          '<h1 class="text-2xl font-black">' + selected.fullName + '</h1>' +
          '<p class="text-xs text-white/90">Squad: ' + selected.teamName + ' • Jersey #' + selected.jerseyNumber + ' • Position: ' + selected.position + '</p>' +
        '</div>' +
        '<div class="bg-white/20 backdrop-blur-md p-3 rounded-2xl text-center">' +
          '<span class="text-[10px] uppercase font-bold block">Monthly Fee Status</span>' +
          '<strong class="text-lg font-black text-white">PAID / VERIFIED</strong>' +
        '</div>' +
      '</div>' +
      '<div class="grid grid-cols-1 md:grid-cols-3 gap-6">' +
        '<div class="flex justify-center">' + renderFifaCardHTML(selected) + '</div>' +
        '<div class="md:col-span-2 space-y-4">' +
          '<div class="card p-5">' +
            '<h3 class="font-extrabold text-sm text-slate-900 mb-3">Weekly Schedule & Pitch Location</h3>' +
            '<div class="p-3 bg-slate-50 rounded-xl text-xs space-y-1">' +
              '<div>Days: <strong>Saturday / Sunday Morning</strong></div>' +
              '<div>Time: <strong>8:30 AM – 10:30 AM</strong></div>' +
              '<div>Location: <strong>Bulbula Amen Pitch Ground, Bole Sub-City</strong></div>' +
            '</div>' +
          '</div>' +
          '<div class="card p-5">' +
            '<h3 class="font-extrabold text-sm text-slate-900 mb-3">Fee History</h3>' +
            '<div class="text-xs text-slate-600 space-y-2">' +
              '<div class="flex justify-between py-2 border-b border-slate-100"><span>Annual Registration Fee:</span><strong class="text-emerald">3,500 ETB (PAID)</strong></div>' +
              '<div class="flex justify-between py-2 border-b border-slate-100"><span>Monthly Training Fee:</span><strong class="text-emerald">1,500 ETB (PAID)</strong></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</main>' +
  '</div>';
}

function renderPublicRegisterScreen() {
  const teams = AppState.db.teams || [];

  return '<div class="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">' +
    '<div class="max-w-2xl mx-auto space-y-6">' +
      '<div class="flex items-center justify-between border-b border-slate-200 pb-4">' +
        '<button onclick="navigate(\'dashboard\')" class="btn btn-white text-xs">← Back to Dashboard</button>' +
        '<div class="flex items-center gap-2">' + getCrestLogoSVG(32) + '<span class="font-black text-sm text-slate-900">BULBULA AMEN FC ENROLLMENT</span></div>' +
      '</div>' +
      '<div class="card p-6 sm:p-8 space-y-6">' +
        '<div><span class="text-xs font-bold text-orange uppercase tracking-wider block">Official Registration</span><h1 class="text-2xl font-black text-slate-900">2026/27 Youth Academy Enrollment</h1><p class="text-xs text-slate-500 mt-1">Please fill in player and parent details. Upon review, you will receive payment instructions.</p></div>' +
        '<form onsubmit="handlePublicRegistration(event)" class="space-y-4 text-xs">' +
          '<div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">' +
            '<h4 class="font-extrabold text-slate-800">1. Player Candidate Information</h4>' +
            '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">' +
              '<div><label class="block font-bold text-slate-700 mb-1">Player Full Name (English) *</label><input type="text" id="reg_name" required placeholder="e.g. Dawit Yohannes Bekele" class="form-input"/></div>' +
              '<div><label class="block font-bold text-slate-700 mb-1">Full Name (Amharic)</label><input type="text" id="reg_name_amh" placeholder="ዳዊት ዮሐንስ በቀለ" class="form-input"/></div>' +
              '<div><label class="block font-bold text-slate-700 mb-1">Date of Birth *</label><input type="date" id="reg_dob" required value="2014-06-12" class="form-input"/></div>' +
              '<div><label class="block font-bold text-slate-700 mb-1">Squad Program *</label><select id="reg_team" class="form-input">' + teams.map(function(t) { return '<option value="' + t.id + '">' + t.name + ' (' + t.ageRange + ')</option>'; }).join('') + '</select></div>' +
            '</div>' +
          '</div>' +
          '<div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">' +
            '<h4 class="font-extrabold text-slate-800">2. Parent / Guardian Information</h4>' +
            '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">' +
              '<div><label class="block font-bold text-slate-700 mb-1">Parent Full Name *</label><input type="text" id="reg_pname" required placeholder="Yohannes Bekele" class="form-input"/></div>' +
              '<div><label class="block font-bold text-slate-700 mb-1">Parent Phone Number *</label><input type="text" id="reg_phone" required placeholder="+251 91 123 4567" class="form-input"/></div>' +
            '</div>' +
          '</div>' +
          '<div class="p-4 bg-orange-light/50 rounded-2xl border border-orange/20 space-y-2">' +
            '<h4 class="font-extrabold text-orange">Fee Information & Bank Details</h4>' +
            '<p class="text-slate-600 text-[11px]">Registration Fee: <strong>3,500 ETB</strong> • Monthly Coaching Fee: <strong>1,500 ETB</strong><br/>Telebirr: <strong>10002938481</strong> • CBE Bank: <strong>1000123456789</strong></p>' +
          '</div>' +
          '<button type="submit" class="btn btn-orange w-full py-3 text-sm font-black shadow-lg shadow-orange/30">Submit Official Application</button>' +
        '</form>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function handlePublicRegistration(e) {
  e.preventDefault();
  const pName = document.getElementById('reg_name').value;
  const teamId = document.getElementById('reg_team').value;
  const team = (AppState.db.teams || []).find(function(t) { return t.id === teamId; });
  const regId = 'REG-' + Math.floor(1000 + Math.random() * 9000);

  const newReg = {
    id: regId,
    applicantName: document.getElementById('reg_pname').value,
    playerFullName: pName,
    playerDateOfBirth: document.getElementById('reg_dob').value,
    gender: 'Male',
    teamId: teamId,
    teamName: team ? team.name : 'U13 Premier',
    phone: document.getElementById('reg_phone').value,
    submittedAt: new Date().toISOString(),
    status: 'PENDING_REVIEW',
    paymentStatus: 'PENDING'
  };

  if (!AppState.db.registrations) AppState.db.registrations = [];
  AppState.db.registrations.unshift(newReg);

  if (!AppState.db.notifications) AppState.db.notifications = [];
  AppState.db.notifications.unshift({
    id: 'NOTIF-' + Date.now(),
    title: 'New Applicant: ' + pName,
    message: 'Applicant registered for ' + (team ? team.name : 'Academy') + '. Ref: ' + regId,
    createdAt: new Date().toISOString(),
    isRead: false,
    linkUrl: 'registrations'
  });

  saveDatabase();
  logAudit('SUBMIT_REGISTRATION', 'REGISTRATION', regId, 'Candidate ' + pName);

  alert('Application ' + regId + ' submitted successfully! Our manager will review and confirm enrollment.');
  navigate('registrations');
}

function renderUploadPaymentScreen() {
  return '<div class="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">' +
    '<div class="max-w-xl mx-auto space-y-6">' +
      '<div class="flex items-center justify-between border-b border-slate-200 pb-4">' +
        '<button onclick="navigate(\'dashboard\')" class="btn btn-white text-xs">← Back to Dashboard</button>' +
        '<span class="font-black text-sm text-slate-900">BULBULA AMEN FC • PAYMENT PROOF</span>' +
      '</div>' +
      '<div class="card p-6 sm:p-8 space-y-6">' +
        '<div><span class="text-xs font-bold text-orange uppercase tracking-wider block">Telebirr & CBE Birr</span><h1 class="text-2xl font-black text-slate-900">Upload Payment Receipt</h1><p class="text-xs text-slate-500 mt-1">Upload your transfer screenshot for AI/OCR transaction verification.</p></div>' +
        '<form onsubmit="handlePaymentUploadSubmit(event)" class="space-y-4 text-xs">' +
          '<div><label class="block font-bold text-slate-700 mb-1">Player Full Name *</label><input type="text" id="up_player" required value="Elias Solomon Kassa" class="form-input"/></div>' +
          '<div class="grid grid-cols-2 gap-3">' +
            '<div><label class="block font-bold text-slate-700 mb-1">Amount Paid (ETB) *</label><input type="number" id="up_amount" required value="1500" class="form-input"/></div>' +
            '<div><label class="block font-bold text-slate-700 mb-1">Payment Method</label><select id="up_method" class="form-input"><option value="Telebirr">Telebirr</option><option value="CBE Birr">CBE Birr</option><option value="Bank Transfer">Bank Transfer</option></select></div>' +
          '</div>' +
          '<div class="p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-3 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer" onclick="simulateOcrScan()">' +
            '<div class="w-12 h-12 bg-orange-light text-orange rounded-xl flex items-center justify-center mx-auto">' + icon('scan', 'w-6 h-6') + '</div>' +
            '<div id="ocr_status_box"><span class="font-bold text-slate-800 block">Click to upload screenshot & run OCR scanner</span><span class="text-[10px] text-slate-400">Extracts Telebirr / CBE Transaction Reference number</span></div>' +
          '</div>' +
          '<div><label class="block font-bold text-slate-700 mb-1">Extracted Transaction ID</label><input type="text" id="up_txnid" required value="TXN-9988123" class="form-input font-mono font-bold text-orange"/></div>' +
          '<button type="submit" class="btn btn-orange w-full py-3 text-sm font-black shadow-lg shadow-orange/30">Submit Payment Proof for Verification</button>' +
        '</form>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function simulateOcrScan() {
  const box = document.getElementById('ocr_status_box');
  box.innerHTML = '<span class="text-orange font-bold animate-pulse">Running OCR Scanner... Extracting Telebirr Ref...</span>';
  setTimeout(function() {
    const mockTxn = 'TB' + Math.floor(10000000 + Math.random() * 90000000);
    document.getElementById('up_txnid').value = mockTxn;
    box.innerHTML = '<span class="text-emerald font-bold">✓ Reference Extracted: ' + mockTxn + ' (Confidence: 96%)</span>';
  }, 900);
}

function handlePaymentUploadSubmit(e) {
  e.preventDefault();
  const pName = document.getElementById('up_player').value;
  const amt = Number(document.getElementById('up_amount').value) || 1500;
  const method = document.getElementById('up_method').value;
  const txn = document.getElementById('up_txnid').value;

  const newPay = {
    id: 'PAY-' + Date.now(),
    playerName: pName,
    amount: amt,
    paymentMethod: method,
    transactionId: txn,
    paymentDate: new Date().toISOString(),
    verificationStatus: 'Under Verification',
    screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
  };

  if (!AppState.db.payments) AppState.db.payments = [];
  AppState.db.payments.unshift(newPay);

  if (!AppState.db.notifications) AppState.db.notifications = [];
  AppState.db.notifications.unshift({
    id: 'NOTIF-' + Date.now(),
    title: 'Payment Proof Uploaded',
    message: pName + ' submitted ' + amt + ' ETB (' + txn + ') for verification.',
    createdAt: new Date().toISOString(),
    isRead: false,
    linkUrl: 'payments'
  });

  saveDatabase();
  logAudit('UPLOAD_PAYMENT', 'PAYMENT', newPay.id, 'Uploaded receipt ' + txn);

  alert('Payment receipt with Transaction ID ' + txn + ' submitted successfully! Finance Department will verify it.');
  navigate('payments');
}

function renderLoginScreen() {
  return '<div class="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative">' +
    '<div class="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">' +
      '<div class="w-16 h-16 mx-auto mb-3">' + getCrestLogoSVG(64) + '</div>' +
      '<h2 class="text-2xl font-black text-slate-900 uppercase tracking-tight">BULBULA AMEN FC</h2>' +
      '<span class="text-xs font-bold text-orange tracking-widest uppercase">Academy Operations Portal</span>' +
    '</div>' +
    '<div class="sm:mx-auto sm:w-full sm:max-w-md">' +
      '<div class="bg-white border border-slate-200 py-8 px-6 shadow-xl rounded-3xl sm:px-10 space-y-6">' +
        '<div class="space-y-4">' +
          '<div><label class="block text-xs font-bold text-slate-700 mb-1">Email Address</label><input type="email" value="admin@bulbulaamenfc.com" class="form-input"/></div>' +
          '<div><label class="block text-xs font-bold text-slate-700 mb-1">Password</label><input type="password" value="password123" class="form-input"/></div>' +
          '<button onclick="navigate(\'dashboard\')" class="btn btn-orange w-full py-3 text-sm font-extrabold shadow-lg shadow-orange/30">Sign In to Control Center</button>' +
        '</div>' +
        '<div class="pt-4 border-t border-slate-200 space-y-2">' +
          '<span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">Quick Demo Role Switcher</span>' +
          '<div class="grid grid-cols-2 gap-2 text-xs">' +
            '<button onclick="switchRole(\'SUPER_ADMIN\'); navigate(\'dashboard\');" class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-orange font-bold text-slate-800 text-left">👑 Super Admin</button>' +
            '<button onclick="switchRole(\'ADMIN\'); navigate(\'dashboard\');" class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-orange font-bold text-slate-800 text-left">⚡ Admin</button>' +
            '<button onclick="switchRole(\'COACH\'); navigate(\'teams\');" class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-orange font-bold text-slate-800 text-left">⚽ Coach</button>' +
            '<button onclick="switchRole(\'FINANCE_OFFICER\'); navigate(\'payments\');" class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-orange font-bold text-slate-800 text-left">💳 Finance Officer</button>' +
          '</div>' +
        '</div>' +
        '<div class="pt-2 text-center text-xs text-slate-500">' +
          '<span>Looking for parent registration?</span>' +
          '<button onclick="navigate(\'register\')" class="font-bold text-orange hover:underline ml-1">Register Candidate</button>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function renderActiveScreen() {
  switch (AppState.currentRoute) {
    case 'dashboard': return renderDashboardScreen();
    case 'players': return renderPlayersScreen();
    case 'registrations': return renderRegistrationsScreen();
    case 'payments': return renderPaymentsScreen();
    case 'teams': return renderTeamsScreen();
    case 'cms': return renderCMSScreen();
    case 'gallery': return renderGalleryScreen();
    case 'notifications': return renderNotificationsScreen();
    case 'users': return renderUsersScreen();
    case 'reports': return renderReportsScreen();
    case 'audit-logs': return renderAuditLogsScreen();
    case 'settings': return renderSettingsScreen();
    default: return renderDashboardScreen();
  }
}

window.addEventListener('DOMContentLoaded', function() {
  initDatabase();
  renderApp();
});
`;

// Prepend seed DB definition
const fullScript = 'const INITIAL_SEED_DB = ' + JSON.stringify(dbData) + ';\n' + scriptSource.replace('const INITIAL_SEED_DB = ${JSON.stringify(dbData)};', '');

// Assemble final HTML
const outputHtml = htmlTemplate.replace(
  '<script id="main-script">\n    // Seed DB will be injected here\n  </script>',
  '<script>\n' + fullScript + '\n  </script>'
);

const out1 = path.join(__dirname, 'index.html');
const out2 = path.join(__dirname, 'Bulbula_Amen_FC_System.html');

fs.writeFileSync(out1, outputHtml, 'utf-8');
fs.writeFileSync(out2, outputHtml, 'utf-8');

console.log('BUILD COMPLETE:');
console.log('1. ' + out1 + ' (' + Math.round(fs.statSync(out1).size / 1024) + ' KB)');
console.log('2. ' + out2 + ' (' + Math.round(fs.statSync(out2).size / 1024) + ' KB)');
