"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Shield, User, Phone, MapPin, AlertCircle, FileText, CheckCircle2, Upload, Calendar, Globe, Heart, HeartPulse
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function PublicRegistrationPage() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [regId, setRegId] = useState('');

  // Form State matching all 4 screenshots
  const [playerPhoto, setPlayerPhoto] = useState<string>('https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=300&auto=format&fit=crop&q=80');
  const [parentPhoto, setParentPhoto] = useState<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80');

  // Names
  const [firstAmh, setFirstAmh] = useState('ኪዳን');
  const [fatherAmh, setFatherAmh] = useState('ቡዛየሁ');
  const [gfAmh, setGfAmh] = useState('ጌታሁን');

  const [firstEng, setFirstEng] = useState('Kidus');
  const [fatherEng, setFatherEng] = useState('Buzayhu');
  const [gfEng, setGfEng] = useState('Getahun');

  // DoB
  const [ethDay, setEthDay] = useState('22');
  const [ethMonth, setEthMonth] = useState('ነሐሴ / Nehase');
  const [ethYear, setEthYear] = useState('2008');
  const [gregDate, setGregDate] = useState('2016-08-27');
  const [age, setAge] = useState(10);
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [placeOfBirth, setPlaceOfBirth] = useState('አዲስ አበባ');
  const [nationalId, setNationalId] = useState('ETH-ID-992014');
  const [nationality, setNationality] = useState('Ethiopian');
  const [bloodType, setBloodType] = useState('ያልታወቀ — Unknown');
  const [schoolName, setSchoolName] = useState('ቦሌ ቀዳማዊ ደረጃ ት/ቤት');

  // Contact
  const [playerPhone, setPlayerPhone] = useState('0911223344');
  const [subCity, setSubCity] = useState('ቦሌ');
  const [woreda, setWoreda] = useState('03');
  const [houseNo, setHouseNo] = useState('1245');

  // Emergency Contact
  const [emName, setEmName] = useState('ቡዛየሁ ጌታሁን');
  const [emRel, setEmRel] = useState('አባት / Father');
  const [emPhone, setEmPhone] = useState('0911556677');

  // Parent Info
  const [parentNameAmh, setParentNameAmh] = useState('ቡዛየሁ ጌታሁን ወልዴ');
  const [parentRel, setParentRel] = useState('Father');
  const [parentPhone, setParentPhone] = useState('0911556677');
  const [parentEmail, setParentEmail] = useState('buzayhu@gmail.com');

  // Profile / Sports
  const [selectedTeamId, setSelectedTeamId] = useState('TEAM-U10');
  const [selectedTeamName, setSelectedTeamName] = useState('U10 Juniors');
  const [position, setPosition] = useState('MF');
  const [jersey1, setJersey1] = useState(10);
  const [jersey2, setJersey2] = useState(7);
  const [prevClub, setPrevClub] = useState('');

  // Documents
  const [playerDocType, setPlayerDocType] = useState<'Birth Certificate' | 'Fayda ID Card' | 'Kebele ID'>('Birth Certificate');
  const [parentDocType, setParentDocType] = useState<'Fayda ID Card' | 'Kebele ID' | 'Passport'>('Fayda ID Card');

  // Medical & Agreement
  const [hasMedical, setHasMedical] = useState(false);
  const [declaration, setDeclaration] = useState(true);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const fullAmh = `${firstAmh} ${fatherAmh} ${gfAmh}`.trim();
    const fullEng = `${firstEng} ${fatherEng} ${gfEng}`.trim();

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: selectedTeamId,
          teamName: selectedTeamName,
          playerData: {
            firstName: firstEng,
            middleName: fatherEng,
            lastName: gfEng,
            fullName: fullEng,
            firstNameAmharic: firstAmh,
            fatherNameAmharic: fatherAmh,
            grandfatherNameAmharic: gfAmh,
            fullNameAmharic: fullAmh,
            dateOfBirth: gregDate,
            ethiopianDob: { day: ethDay, month: ethMonth, year: ethYear },
            age,
            gender,
            nationality,
            placeOfBirth,
            nationalIdNumber: nationalId,
            bloodType,
            schoolName,
            phone: playerPhone,
            address: `${subCity}, Woreda ${woreda}, House #${houseNo}`,
            subCity,
            woreda,
            houseNo,
            emergencyContact: { name: emName, relationship: emRel, phone: emPhone },
            photoUrl: playerPhoto,
            parentPhotoUrl: parentPhoto,
            position,
            jerseyChoice1: jersey1,
            jerseyChoice2: jersey2,
            previousClub: prevClub,
            medicalCondition: hasMedical ? "Has allergy" : "None"
          },
          parentData: {
            fullName: parentNameAmh,
            relationship: parentRel,
            phone: parentPhone,
            email: parentEmail,
            nationalIdNumber: 'ETH-ID-XXXX',
            nationalIdDocUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
            residenceIdNumber: 'AA-RES-XXXX',
            residenceIdDocUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80'
          },
          documents: {
            playerDocType,
            parentDocType,
            birthCertificateNumber: 'BC-AA-2016-8801',
            birthCertificateDocUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
            parentNationalIdDocUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
            parentResidenceIdDocUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80'
          }
        })
      }).then(r => r.json());

      if (res.success) {
        setRegId(res.data.id);
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans pb-20">
      {/* Top Bar Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 h-16 flex items-center justify-between shadow-sm">
        <Link href="/login" className="flex items-center gap-3">
          <img src="/logo.png" alt="Bulbula Amen F.C." className="w-10 h-10 object-contain" />
          <div>
            <span className="font-black text-sm tracking-tight text-brand-navy block">BULBULA AMEN F.C.</span>
            <span className="text-[10px] font-extrabold text-brand-orange uppercase">Est. 2000 E.C. &bull; Official Registration</span>
          </div>
        </Link>

        {/* Global Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-black transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Globe className="w-4 h-4 text-brand-orange" />
          <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
        </button>
      </header>

      {/* Main Registration Form Container */}
      <div className="max-w-4xl mx-auto px-4 pt-8 space-y-6">
        
        {submitted ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <h2 className="text-2xl font-black text-slate-900">ምዝገባው በተሳካ ሁኔታ ገብቷል!</h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              የምዝገባ ማመልከቻ ቁጥርዎ <strong>{regId}</strong> ነው። በአመራሩ ተገምግሞ ምላሽ ይሰጥዎታል።
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <Link href="/upload-payment" className="px-6 py-3 bg-brand-orange text-white font-bold rounded-xl text-xs shadow-md">
                የክፍያ ደረሰኝ ለማስገባት (Upload Payment Proof)
              </Link>
              <Link href="/" className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs">
                ወደ ዋናው ገጽ ተመለስ
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            
            {/* SECTION 1: PHOTOS (ፎቶዎች) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-xl bg-brand-orange/10 text-brand-orange font-black flex items-center justify-center text-xs">
                  ፩
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">{t('reg.photos_title')}</h3>
                  <span className="text-xs text-slate-400">{t('reg.photos_sub')}</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center space-y-2 hover:border-brand-orange bg-slate-50/50 cursor-pointer">
                  <User className="w-8 h-8 text-slate-400 mx-auto" />
                  <span className="font-bold text-slate-800 text-xs block">{t('reg.player_photo')}</span>
                  <span className="text-[11px] text-slate-400 block">{t('reg.click_to_upload')}</span>
                  <span className="text-[10px] text-slate-400 block">{t('reg.passport_size')}</span>
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center space-y-2 hover:border-brand-orange bg-slate-50/50 cursor-pointer">
                  <User className="w-8 h-8 text-slate-400 mx-auto" />
                  <span className="font-bold text-slate-800 text-xs block">{t('reg.parent_photo')}</span>
                  <span className="text-[11px] text-slate-400 block">{t('reg.click_to_upload')}</span>
                  <span className="text-[10px] text-slate-400 block">JPG / PNG • passport size</span>
                </div>
              </div>
            </div>

            {/* SECTION 2: PERSONAL INFORMATION (የግል መረጃ) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-black flex items-center justify-center text-xs">
                  ፪
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">{t('reg.personal_info')}</h3>
                  <span className="text-xs text-slate-400">Personal Information</span>
                </div>
              </div>

              {/* AMHARIC FULL NAME BOX */}
              <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl space-y-3">
                <span className="text-xs font-black text-purple-900 tracking-wider block uppercase">
                  {t('reg.fullname_amharic')}
                </span>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-1">{t('reg.first_name')}</label>
                    <input type="text" required value={firstAmh} onChange={e => setFirstAmh(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold" />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">{t('reg.father_name')}</label>
                    <input type="text" required value={fatherAmh} onChange={e => setFatherAmh(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold" />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">{t('reg.grandfather_name')}</label>
                    <input type="text" required value={gfAmh} onChange={e => setGfAmh(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold" />
                  </div>
                </div>
              </div>

              {/* ENGLISH FULL NAME BOX */}
              <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl space-y-3">
                <span className="text-xs font-black text-amber-900 tracking-wider block uppercase">
                  {t('reg.fullname_english')}
                </span>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-1">First Name *</label>
                    <input type="text" required value={firstEng} onChange={e => setFirstEng(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold" />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Father's Name *</label>
                    <input type="text" required value={fatherEng} onChange={e => setFatherEng(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold" />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Grandfather's Name</label>
                    <input type="text" value={gfEng} onChange={e => setGfEng(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold" />
                  </div>
                </div>
              </div>

              {/* DOB & AGE ROW */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-2 space-y-2">
                  <label className="block font-bold text-slate-800">{t('reg.dob')}</label>
                  <div className="flex gap-2">
                    <input type="text" value={ethDay} onChange={e => setEthDay(e.target.value)} className="w-16 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center" />
                    <select value={ethMonth} onChange={e => setEthMonth(e.target.value)} className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold">
                      <option value="መስከረም / Meskerem">መስከረም / Meskerem</option>
                      <option value="ጥቅምት / Tikimt">ጥቅምት / Tikimt</option>
                      <option value="ህዳር / Hitdar">ህዳር / Hitdar</option>
                      <option value="ታህሳስ / Tahsas">ታህሳስ / Tahsas</option>
                      <option value="ጥር / Tir">ጥር / Tir</option>
                      <option value="የካቲት / Yekatit">የካቲት / Yekatit</option>
                      <option value="መጋቢት / Megabit">መጋቢት / Megabit</option>
                      <option value="ሚያዝያ / Miazia">ሚያዝያ / Miazia</option>
                      <option value="ግንቦት / Ginbot">ግንቦት / Ginbot</option>
                      <option value="ሰኔ / Sene">ሰኔ / Sene</option>
                      <option value="ሐምሌ / Hamle">ሐምሌ / Hamle</option>
                      <option value="ነሐሴ / Nehase">ነሐሴ / Nehase</option>
                      <option value="ጳጉሜ / Pagume">ጳጉሜ / Pagume</option>
                    </select>
                    <input type="text" value={ethYear} onChange={e => setEthYear(e.target.value)} className="w-20 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center" />
                  </div>
                  <span className="text-[10px] text-slate-400 block pt-1">Gregorian: 📅 {gregDate}</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-2">{t('reg.age')}</label>
                  <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-black text-center text-sm" />
                </div>
              </div>

              {/* GENDER & PLACE OF BIRTH */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-2">{t('reg.gender')}</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="gender" checked={gender === 'Male'} onChange={() => setGender('Male')} className="text-brand-orange" />
                      <span>{t('reg.male')}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="gender" checked={gender === 'Female'} onChange={() => setGender('Female')} className="text-brand-orange" />
                      <span>{t('reg.female')}</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">{t('reg.place_of_birth')}</label>
                  <input type="text" value={placeOfBirth} onChange={e => setPlaceOfBirth(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
              </div>

              {/* NATIONAL ID & SCHOOL */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">{t('reg.national_id')}</label>
                  <input type="text" value={nationalId} onChange={e => setNationalId(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">{t('reg.school_name')}</label>
                  <input type="text" value={schoolName} onChange={e => setSchoolName(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
              </div>
            </div>

            {/* SECTION 3: CONTACT INFORMATION (የአድራሻ መረጃ) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 font-black flex items-center justify-center text-xs">
                  ፫
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">{t('reg.contact_info')}</h3>
                  <span className="text-xs text-slate-400">Contact Information</span>
                </div>
              </div>

              <div className="text-xs space-y-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">{t('reg.player_phone')}</label>
                  <input type="text" value={playerPhone} onChange={e => setPlayerPhone(e.target.value)} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
                </div>

                <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl space-y-3">
                  <span className="text-xs font-black text-emerald-900 tracking-wider block uppercase">{t('reg.residential_address')}</span>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-500 mb-1">{t('reg.sub_city')}</label>
                      <input type="text" value={subCity} onChange={e => setSubCity(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">{t('reg.woreda')}</label>
                      <input type="text" value={woreda} onChange={e => setWoreda(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">{t('reg.house_no')}</label>
                      <input type="text" value={houseNo} onChange={e => setHouseNo(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl space-y-3">
                  <span className="text-xs font-black text-amber-900 tracking-wider block uppercase">⚠️ {t('reg.emergency_contact')}</span>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-500 mb-1">{t('reg.name')}</label>
                      <input type="text" value={emName} onChange={e => setEmName(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">{t('reg.relationship')}</label>
                      <input type="text" value={emRel} onChange={e => setEmRel(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">{t('reg.phone')}</label>
                      <input type="text" value={emPhone} onChange={e => setEmPhone(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: PARENT / GUARDIAN (የወላጅ/አዳጊ መረጃ) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 font-black flex items-center justify-center text-xs">
                  ፬
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">{t('reg.parent_info')}</h3>
                  <span className="text-xs text-slate-400">Parent / Guardian Information</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">{t('reg.parent_name_amharic')}</label>
                  <input type="text" value={parentNameAmh} onChange={e => setParentNameAmh(e.target.value)} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">{t('reg.phone')}</label>
                  <input type="text" value={parentPhone} onChange={e => setParentPhone(e.target.value)} className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono" />
                </div>
              </div>
            </div>

            {/* SECTION 5: PLAYER PROFILE / SPORTS (የስፖርት/ተጫዋች መረጃ) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 font-black flex items-center justify-center text-xs">
                  ፭
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">{t('reg.player_profile')}</h3>
                  <span className="text-xs text-slate-400">Player Profile & Age Group</span>
                </div>
              </div>

              {/* Age Group Selector Grid (Matching Screenshot) */}
              <div className="space-y-2 text-xs">
                <label className="block font-bold text-slate-800">{t('reg.age_group')}</label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { id: 'TEAM-U13', name: 'U13 Premier', short: 'U13', age: '12–13 yrs' },
                    { id: 'TEAM-U17', name: 'U17 Elite', short: 'U17', age: '15–17 yrs' },
                    { id: 'TEAM-U8', name: 'U8 Academy', short: 'U8', age: '5–7 yrs' },
                    { id: 'TEAM-U10', name: 'U10 Juniors', short: 'U10', age: '8–9 yrs' },
                    { id: 'TEAM-U12', name: 'U12 Squad', short: 'U12', age: '10–11 yrs' },
                    { id: 'TEAM-U15', name: 'U15 Cadets', short: 'U15', age: '13–15 yrs' },
                    { id: 'TEAM-WOMEN', name: 'Women Team', short: 'WMN', age: '14–35 yrs' },
                    { id: 'TEAM-HEALTH', name: 'Health Squad', short: 'HLT', age: '18–99 yrs' },
                  ].map(g => (
                    <div
                      key={g.id}
                      onClick={() => { setSelectedTeamId(g.id); setSelectedTeamName(g.name); }}
                      className={`p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                        selectedTeamId === g.id
                          ? "bg-brand-orange text-white border-brand-orange shadow-md"
                          : "bg-slate-50 border-slate-200 text-slate-900 hover:border-brand-orange"
                      }`}
                    >
                      <div className="font-black text-lg">{g.short}</div>
                      <div className="text-[10px] opacity-80">{g.age}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Positions Selector Grid */}
              <div className="space-y-2 text-xs">
                <label className="block font-bold text-slate-800">{t('reg.position')}</label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { key: 'GK', label: 'GK (ግብ ጠባቂ)' },
                    { key: 'DF', label: 'DF (ተከላካይ)' },
                    { key: 'MF', label: 'MF (አማካይ)' },
                    { key: 'FW', label: 'FW (አጥቂ)' },
                  ].map(p => (
                    <div
                      key={p.key}
                      onClick={() => setPosition(p.key)}
                      className={`p-3 rounded-xl border text-center cursor-pointer font-bold transition-all ${
                        position === p.key
                          ? "bg-brand-orange text-white border-brand-orange shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-400"
                      }`}
                    >
                      {p.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Jersey Numbers & Previous Club */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">{t('reg.jersey_1st')}</label>
                  <input type="number" value={jersey1} onChange={e => setJersey1(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center" />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">{t('reg.jersey_2nd')}</label>
                  <input type="number" value={jersey2} onChange={e => setJersey2(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center" />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">{t('reg.previous_club')}</label>
                  <input type="text" value={prevClub} onChange={e => setPrevClub(e.target.value)} placeholder="leave blank if none" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
              </div>
            </div>

            {/* SECTION 6: IDENTITY DOCUMENTS (ሰነዶች) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 font-black flex items-center justify-center text-xs">
                  ፮
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">{t('reg.identity_docs')}</h3>
                  <span className="text-xs text-slate-400">Identity Documents</span>
                </div>
              </div>

              <div className="p-4 bg-red-50/50 border border-red-200/80 rounded-2xl space-y-3 text-xs">
                <span className="font-bold text-red-900 block uppercase">👤 {t('reg.player_doc')}</span>
                <div className="grid grid-cols-3 gap-3">
                  {['Birth Certificate', 'Fayda ID Card', 'Kebele ID'].map(doc => (
                    <button
                      key={doc}
                      type="button"
                      onClick={() => setPlayerDocType(doc as any)}
                      className={`p-2.5 rounded-xl border font-bold text-center ${
                        playerDocType === doc ? "bg-red-600 text-white border-red-600" : "bg-white border-slate-200 text-slate-700"
                      }`}
                    >
                      {doc}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 7: DECLARATION & AGREEMENT */}
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2 font-black text-amber-900 text-sm">
                <span>📜 {t('reg.declaration')}</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed font-medium italic">
                "{t('reg.declaration_text')}"
              </p>
              <label className="flex items-center gap-2 text-xs font-bold text-amber-900 cursor-pointer pt-2">
                <input type="checkbox" checked={declaration} onChange={e => setDeclaration(e.target.checked)} className="w-4 h-4 text-brand-orange rounded" />
                <span>{t('reg.accept_declaration')}</span>
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={submitting || !declaration}
              className="w-full py-4 bg-brand-orange hover:bg-brand-orange-dark text-white font-black text-base rounded-2xl shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              🚀 {submitting ? "እየተላከ ነው..." : t('reg.submit')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
