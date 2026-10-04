"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'am';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tContent: (text: string | undefined | null) => string;
}

const contentDictionaryAmharic: Record<string, string> = {
  // Positions
  "Striker": "አጥቂ",
  "Center Forward": "ማዕከላዊ አጥቂ",
  "Forward": "አጥቂ",
  "Right Winger": "ቀኝ ክንፍ",
  "Left Winger": "ግራ ክንፍ",
  "Winger": "የክንፍ ተጫዋች",
  "Attacking Midfielder": "አጥቂ አማካይ",
  "Central Midfielder": "ማዕከላዊ አማካይ",
  "Midfielder": "አማካይ",
  "Defensive Midfielder": "ተከላካይ አማካይ",
  "Playmaker": "አጫዋች",
  "Center Back": "ማዕከላዊ ተከላካይ",
  "Defender": "ተከላካይ",
  "Left Back": "ግራ ተከላካይ",
  "Right Back": "ቀኝ ተከላካይ",
  "Full Back": "ተከላካይ",
  "Goalkeeper": "ግብ ጠባቂ",
  "Keeper": "ግብ ጠባቂ",

  // Teams
  "U8 Academy": "U8 አካዳሚ",
  "U10 Juniors": "U10 ጁኒየርስ",
  "U12 Development": "U12 ልማት",
  "U13 Premier": "U13 ፕሪሚየር",
  "U15 Cadets": "U15 ካዴት",
  "U17 Elite": "U17 ኤሊት",
  "U18 Seniors Prep": "U18 ሲኒየርስ",
  "Women's Team": "የሴቶች ቡድን",
  "Health & Fitness Veterans": "የጤና እና አርበኞች",

  // Categories
  "Youth Academy": "የታዳጊዎች አካዳሚ",
  "Junior Academy": "የጁኒየር አካዳሚ",
  "Development Squad": "የልማት ቡድን",
  "Youth Premier": "የወጣቶች ፕሪሚየር",
  "Cadet Elite": "የካዴት ኤሊት",
  "Elite Academy": "የኤሊት አካዳሚ",
  "Senior Reserve": "የሲኒየር ቡድን",
  "Senior Women": "የሴቶች ክለብ",
  "Community & Vets": "የማህበረሰብ እና አርበኞች",

  // Statuses
  "ACTIVE": "ንቁ አባል",
  "PENDING_REVIEW": "በመገምገም ላይ",
  "AWAITING_PAYMENT": "ክፍያ የሚጠብቅ",
  "PAYMENT_VERIFICATION": "የክፍያ ማረጋገጫ",
  "VERIFIED": "የተረጋገጠ",
  "Verified": "የተረጋገጠ",
  "Under Verification": "በመረጋገጥ ላይ",
  "Submitted": "የቀረበ",
  "OVERDUE": "ጊዜው ያለፈበት",
  "DUE_SOON": "ክፍያ ደርሷል",
  "REJECTED": "ውድቅ የተደረገ",
  "Rejected": "ውድቅ የተደረገ",
  "PAID": "ተከፍሏል",
  "INACTIVE": "ቦዝኗል",

  // Training Days
  "Saturday / Sunday": "ቅዳሜ / እሁድ",
  "Tuesday / Thursday / Saturday": "ማክሰኞ / ሐሙስ / ቅዳሜ",
  "Monday / Wednesday / Friday": "ሰኞ / ረቡዕ / አርብ",
  "Everyday except Sunday": "ከእሁድ በስተቀር በየቀኑ",
  "Monday thru Friday": "ከሰኞ እስከ ዐርብ",
  "Daily": "በየቀኑ",
  "Monday / Wednesday / Saturday": "ሰኞ / ረቡዕ / ቅዳሜ",
  "Saturday / Sunday Morning": "ቅዳሜ / እሁድ ጧት",

  // Stats
  "Pace": "ፍጥነት",
  "Shooting": "ምታት",
  "Passing": "ቅብብል",
  "Dribbling": "ክህሎት",
  "Defending": "ተከላካይ",
  "Physical": "ጉልበት",
  "Games Played": "የተጫወቱት ጨዋታ",
  "Goals": "ግብ",
  "Assists": "አሲስት"
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation & Layout
    "nav.dashboard": "Dashboard",
    "nav.players": "Players",
    "nav.registrations": "Registrations",
    "nav.payments": "Payments & Financials",
    "nav.teams": "Teams & Schedules",
    "nav.gallery": "Gallery CMS",
    "nav.cms": "Website CMS",
    "nav.notifications": "Notifications",
    "nav.users": "Users & Staff",
    "nav.audit": "Audit Logs",
    "nav.settings": "Club Settings",
    "nav.all_players": "All Players",
    "nav.pending_review": "Pending Review",
    "nav.awaiting_payment": "Awaiting Payment",
    "nav.payment_verification": "Payment Verification",
    "nav.active_registrations": "Active Registrations",
    "nav.payment_dashboard": "Payment Dashboard",
    "nav.verified_payments": "Verified Payments",
    "lang.switch": "አማርኛ",

    // Headers & Common
    "header.system_title": "BULBULA AMEN F.C.",
    "header.management": "Est. 2000 E.C.",
    "header.search_placeholder": "Search players, IDs, phone numbers...",

    // Dashboard Page
    "dash.title": "Dashboard Overview",
    "dash.sub": "Real-time statistics across all teams, registrations, and payments.",
    "dash.roster_btn": "Players Roster",
    "dash.pending_btn": "Pending Registrations",
    "dash.total_players": "Total Players",
    "dash.active_members": "Active Members",
    "dash.pending_regs": "Pending Registrations",
    "dash.pending_sub": "Awaiting manager review",
    "dash.pending_payments": "Pending Payments",
    "dash.payments_sub": "Receipt verification queue",
    "dash.overdue": "Overdue Payments",
    "dash.overdue_sub": "Automated reminders active",
    "dash.fin_perf": "Financial Performance",
    "dash.monthly_coll": "Monthly Collections",
    "dash.verified_pay": "Verified Payments",
    "dash.team_breakdown": "Team Breakdown",
    "dash.active_squads": "Active Squads",
    "dash.recent_apps": "Recent Applications",

    // Players Page
    "players.title": "Player Roster",
    "players.all_title": "All Players Roster",
    "players.table_view": "Table View",
    "players.card_view": "Card View",
    "players.export_excel": "Export Excel",
    "players.add_player": "Add Player",
    "players.all_teams": "All Teams",
    "players.all_statuses": "All Statuses",
    "players.search_placeholder": "Search player name, ID...",
    "players.col_player": "Player",
    "players.col_id": "Player ID",
    "players.col_team": "Team",
    "players.col_ovr": "OVR Rating",
    "players.col_age": "Age / DoB",
    "players.col_jersey": "Jersey #",
    "players.col_pos": "Position",
    "players.col_status": "Status",
    "players.col_actions": "Actions",

    // Registration Form & Inspector Labels
    "reg.title": "Applications Review",
    "reg.sub": "Review public applications and verify submitted documents.",
    "reg.photos_title": "Photos",
    "reg.photos_sub": "Player photo + Parent/Guardian photo (passport size)",
    "reg.player_photo": "Player Photo",
    "reg.parent_photo": "Parent Photo",
    "reg.click_to_upload": "Click to upload",
    "reg.passport_size": "JPG / PNG • 3x4 passport size",
    "reg.personal_info": "Personal Information",
    "reg.fullname_amharic": "FULL NAME IN AMHARIC",
    "reg.first_name": "First Name",
    "reg.father_name": "Father's Name",
    "reg.grandfather_name": "Grandfather's Name",
    "reg.fullname_english": "FULL NAME IN ENGLISH",
    "reg.english_id_note": "required for ID card printing",
    "reg.dob": "Date of Birth",
    "reg.age": "Age",
    "reg.gregorian": "Gregorian",
    "reg.gender": "Gender",
    "reg.male": "Male",
    "reg.female": "Female",
    "reg.place_of_birth": "Place of Birth",
    "reg.national_id": "National ID / Fayda No.",
    "reg.nationality": "Nationality",
    "reg.blood_type": "Blood Type",
    "reg.school_name": "School Name",
    "reg.contact_info": "Contact Information",
    "reg.player_phone": "Player Phone",
    "reg.residential_address": "RESIDENTIAL ADDRESS",
    "reg.sub_city": "Sub-City",
    "reg.woreda": "Woreda",
    "reg.house_no": "House No.",
    "reg.emergency_contact": "EMERGENCY CONTACT",
    "reg.name": "Name",
    "reg.relationship": "Relationship",
    "reg.phone": "Phone",
    "reg.parent_info": "Parent / Guardian Information",
    "reg.parent_name_amharic": "Parent Name (Amharic)",
    "reg.email": "Email (optional)",
    "reg.player_profile": "Player Profile",
    "reg.age_group": "Age Group / Program",
    "reg.position": "Position",
    "reg.jersey_1st": "Jersey No. 1st Choice",
    "reg.jersey_2nd": "Jersey No. 2nd Choice",
    "reg.previous_club": "Previous Club (if any)",
    "reg.identity_docs": "Identity Documents",
    "reg.player_doc": "PLAYER IDENTITY DOCUMENT",
    "reg.parent_doc": "PARENT/GUARDIAN DOCUMENT",
    "reg.birth_cert": "Birth Certificate",
    "reg.fayda_id": "Fayda ID Card",
    "reg.kebele_id": "Kebele ID",
    "reg.passport": "Passport",
    "reg.medical_info": "Medical Information",
    "reg.medical_check": "Do you have any medical condition or allergy?",
    "reg.declaration": "Declaration & Agreement",
    "reg.declaration_text": "I confirm all information provided is correct and I agree to comply with club rules and regulations.",
    "reg.accept_declaration": "I accept the declaration",
    "reg.submit": "Submit Registration",

    // Payments Page
    "pay.title": "Payment Verification & History",
    "pay.sub": "Verify Telebirr & CBE Birr transaction receipts using OCR scanner.",
    "pay.txn_ref": "Transaction Ref #",
    "pay.method": "Payment Method",
    "pay.amount": "Amount",
    "pay.inspect": "Inspect Details",
    "pay.receipt_screenshot": "Payment Proof Receipt Screenshot",
    "pay.approve": "Approve Payment",
    "pay.reject": "Reject Payment",

    // Actions
    "action.inspect": "Inspect",
    "action.view_profile": "View Profile",
    "action.view_details": "View Details",
    "action.edit": "Edit Player",
    "action.close": "Close",
    "action.approve_app": "Approve Application",
    "action.reject_app": "Reject Application"
  },
  am: {
    // Navigation & Layout
    "nav.dashboard": "ዳሽቦርድ",
    "nav.players": "ተጫዋቾች",
    "nav.registrations": "ምዝገባዎች",
    "nav.payments": "ክፍያዎች እና ፋይናንስ",
    "nav.teams": "ቡድኖች እና ፕሮግራም",
    "nav.gallery": "ፎቶ ጋለሪ",
    "nav.cms": "ዌብሳይት ሲኤምኤስ",
    "nav.notifications": "ማስታወቂያዎች",
    "nav.users": "ተጠቃሚዎች",
    "nav.audit": "ኦዲት ሎግ",
    "nav.settings": "የክለብ መቼቶች",
    "nav.all_players": "ሁሉም ተጫዋቾች",
    "nav.pending_review": "በመገምገም ላይ ያሉ",
    "nav.awaiting_payment": "ክፍያ የሚጠብቁ",
    "nav.payment_verification": "የክፍያ ማረጋገጫ",
    "nav.active_registrations": "የጸደቁ ምዝገባዎች",
    "nav.payment_dashboard": "የክፍያ ዳሽቦርድ",
    "nav.verified_payments": "የተረጋገጡ ክፍያዎች",
    "lang.switch": "English",

    // Headers & Common
    "header.system_title": "ቡልቡላ አመን ኤፍሲ",
    "header.management": "ተመሰረተ 2000 ዓ.ም.",
    "header.search_placeholder": "ተጫዋች፣ አይዲ፣ ስልክ ፈልግ...",

    // Dashboard Page
    "dash.title": "የዳሽቦርድ አጠቃላይ መረጃ",
    "dash.sub": "የቡድኖች፣ የምዝገባዎች እና የክፍያዎች የቀጥታ መረጃ።",
    "dash.roster_btn": "የተጫዋቾች ዝርዝር",
    "dash.pending_btn": "በመጠባበቅ ላይ ያሉ ምዝገባዎች",
    "dash.total_players": "ጠቅላላ ተጫዋቾች",
    "dash.active_members": "ንቁ አባላት",
    "dash.pending_regs": "በመጠባበቅ ላይ ያሉ ምዝገባዎች",
    "dash.pending_sub": "የአመራሩን ግምገማ የሚጠብቁ",
    "dash.pending_payments": "በመገምገም ላይ ያሉ ክፍያዎች",
    "dash.payments_sub": "የደረሰኝ ማረጋገጫ ተራ",
    "dash.overdue": "ጊዜያቸው ያለፈባቸው ክፍያዎች",
    "dash.overdue_sub": "ራስ-ሰር ማስታወሻዎች እየሰሩ ነው",
    "dash.fin_perf": "የፋይናንስ አፈፃፀም",
    "dash.monthly_coll": "የወርሃዊ ስብስብ",
    "dash.verified_pay": "የተረጋገጡ ክፍያዎች",
    "dash.team_breakdown": "የቡድኖች ክፍፍል",
    "dash.active_squads": "ንቁ ቡድኖች",
    "dash.recent_apps": "የቅርብ ጊዜ ማመልከቻዎች",

    // Players Page
    "players.title": "የተጫዋቾች ዝርዝር",
    "players.all_title": "የሁሉም ተጫዋቾች ዝርዝር",
    "players.table_view": "ሰንጠረዥ",
    "players.card_view": "ካርድ",
    "players.export_excel": "ኤክሴል አውርድ",
    "players.add_player": "ተጫዋች ጨምር",
    "players.all_teams": "ሁሉም ቡድኖች",
    "players.all_statuses": "ሁሉም ሁኔታዎች",
    "players.search_placeholder": "ተጫዋች ስም፣ መለያ ፈልግ...",
    "players.col_player": "ተጫዋች",
    "players.col_id": "መለያ (ID)",
    "players.col_team": "ቡድን",
    "players.col_ovr": "ደረጃ (OVR)",
    "players.col_age": "ዕድሜ / ልደት",
    "players.col_jersey": "ማሊያ #",
    "players.col_pos": "ቦታ",
    "players.col_status": "ሁኔታ",
    "players.col_actions": "እርምጃዎች",

    // Registration Form & Inspector Labels
    "reg.title": "የማመልከቻዎች ግምገማ",
    "reg.sub": "የቀረቡ ማመልከቻዎችን እና ሰነዶችን መመርመሪያ።",
    "reg.photos_title": "ፎቶዎች",
    "reg.photos_sub": "የተጫዋች ፎቶ + የወላጅ/አዳጊ ፎቶ (ፓስፖርት መጠን)",
    "reg.player_photo": "የተጫዋች ፎቶ *",
    "reg.parent_photo": "የወላጅ/አዳጊ ፎቶ",
    "reg.click_to_upload": "ፎቶ ለመምረጥ እዚህ ይጫኑ",
    "reg.passport_size": "JPG / PNG • 3×4 ፓስፖርት መጠን",
    "reg.personal_info": "የግል መረጃ",
    "reg.fullname_amharic": "ሙሉ ስም በአማርኛ — FULL NAME IN AMHARIC",
    "reg.first_name": "ስም (First)",
    "reg.father_name": "የአባት ስም (Father)",
    "reg.grandfather_name": "የአያት ስም (Grandfather)",
    "reg.fullname_english": "FULL NAME IN ENGLISH — ለID ካርድ ህትመት",
    "reg.english_id_note": "required for ID card printing",
    "reg.dob": "የልደት ቀን — Date of Birth *",
    "reg.age": "ዕድሜ — Age",
    "reg.gregorian": "የፈረንጆች ቀን",
    "reg.gender": "ጾታ — Gender",
    "reg.male": "ወንድ (Male)",
    "reg.female": "ሴት (Female)",
    "reg.place_of_birth": "የትውልድ ቦታ — Place of Birth",
    "reg.national_id": "መታወቂያ ቁጥር — National ID / Fayda",
    "reg.nationality": "ዜግነት — Nationality",
    "reg.blood_type": "የደም አይነት — Blood Type",
    "reg.school_name": "ትምህርት ቤት — School Name",
    "reg.contact_info": "የአድራሻ መረጃ",
    "reg.player_phone": "ስልክ ቁጥር (ተጫዋች) — Player Phone",
    "reg.residential_address": "የመኖሪያ አድራሻ — RESIDENTIAL ADDRESS",
    "reg.sub_city": "ክፍለ ከተማ — Sub-City",
    "reg.woreda": "ወረዳ — Woreda",
    "reg.house_no": "የቤት ቁጥር — House No.",
    "reg.emergency_contact": "የአደጋ ጊዜ ተጠሪ — EMERGENCY CONTACT",
    "reg.name": "ስም — Name",
    "reg.relationship": "ዝምድና — Relationship",
    "reg.phone": "ስልክ ቁጥር — Phone",
    "reg.parent_info": "የወላጅ/አዳጊ መረጃ",
    "reg.parent_name_amharic": "ሙሉ ስም (በአማርኛ)",
    "reg.email": "ኢሜይል — Email (optional)",
    "reg.player_profile": "የስፖርት/ተጫዋች መረጃ",
    "reg.age_group": "ፕሮግራም — Age Group",
    "reg.position": "የሚጫወቱበት ቦታ — Position",
    "reg.jersey_1st": "ማሊያ ቁጥር 1ኛ ምርጫ",
    "reg.jersey_2nd": "ማሊያ ቁጥር 2ኛ ምርጫ",
    "reg.previous_club": "ቀደም ሲል የተጫወቱበት ክለብ (ካለ)",
    "reg.identity_docs": "ሰነዶች — Identity Documents",
    "reg.player_doc": "የተጫዋች ሰነድ — PLAYER IDENTITY DOCUMENT",
    "reg.parent_doc": "የወላጅ/አዳጊ ሰነድ — PARENT/GUARDIAN DOCUMENT",
    "reg.birth_cert": "የልደት ምስክር ወረቀት",
    "reg.fayda_id": "ፋይዳ ID ካርድ",
    "reg.kebele_id": "የቀበሌ መታወቂያ",
    "reg.passport": "ፓስፖርት",
    "reg.medical_info": "የጤና ሁኔታ",
    "reg.medical_check": "ማንኛውም አይነት የጤና አካል ወይም አለርጂ አለብዎት?",
    "reg.declaration": "ስምምነት ማረጋገጫ",
    "reg.declaration_text": "እኔ ስሜ ከላይ የተጠቀሰው ተጫዋች/ወላጅ በክለቡ ህግ እና ደንብ አክብሬ ለመጫወት የተስማማሁ መሆኑን እረጋግጣለሁ።",
    "reg.accept_declaration": "ስምምነቱን ተቀብያለሁ — I accept the declaration",
    "reg.submit": "ምዝገባ ያስገቡ — Submit Registration",

    // Payments Page
    "pay.title": "የክፍያ ማረጋገጫ እና ታሪክ",
    "pay.sub": "የቴሌብር እና ሲቢኢ ብር ክፍያ ደረሰኞች ማረጋገጫ።",
    "pay.txn_ref": "የትራንዛክሽን መለያ ቁጥር",
    "pay.method": "የክፍያ መንገድ",
    "pay.amount": "የገንዘብ መጠን",
    "pay.inspect": "ዝርዝር ይመልከቱ",
    "pay.receipt_screenshot": "የክፍያ ደረሰኝ ፎቶ (Screenshot)",
    "pay.approve": "ክፍያ አጽድቅ",
    "pay.reject": "ክፍያ ውድቅ አድርግ",

    // Actions
    "action.inspect": "ዝርዝር ይመልከቱ",
    "action.view_profile": "ፕሮፋይል ይመልከቱ",
    "action.view_details": "መረጃ ይመልከቱ",
    "action.edit": "ተጫዋች አስተካክል",
    "action.close": "ዝጋ",
    "action.approve_app": "ማመልከቻ አጽድቅ",
    "action.reject_app": "ማመልከቻ ውድቅ አድርግ"
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  tContent: (text: string | undefined | null) => text || ''
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('app_lang') as Language;
    if (saved === 'en' || saved === 'am') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const tContent = (text: string | undefined | null): string => {
    if (!text) return '';
    if (language === 'am') {
      return contentDictionaryAmharic[text] || text;
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tContent }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
