import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ScanEye, ChevronDown, Check, ArrowRight, ShieldCheck, Stethoscope,
  Eye, Users, Shield, Sparkles, Globe, MapPin, User, Building2
} from 'lucide-react';
import { useAppState } from '../context/AppStateContext';
import type { UserRole } from '../lib/types';

interface LanguageOption {
  code: string;
  name: string;
  native: string;
  catchphrase: string;
  subtitle: string;
  stats: {
    speed: string;
    speedLabel: string;
    grades: string;
    gradesLabel: string;
    offline: string;
    offlineLabel: string;
  };
  roles: {
    hw: string;
    hwDesc: string;
    doctor: string;
    doctorDesc: string;
    admin: string;
    adminDesc: string;
  };
}

const LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    native: 'English',
    catchphrase: 'Catch diabetic retinopathy before vision is lost.',
    subtitle: 'Point-of-care AI screening engineered for rural primary health centres and tele-ophthalmology triage.',
    stats: {
      speed: '< 30s',
      speedLabel: 'PER SCREENING',
      grades: '5 grades',
      gradesLabel: 'AI CLASSIFICATION',
      offline: 'Offline',
      offlineLabel: 'FRIENDLY',
    },
    roles: {
      hw: 'Field Health Worker',
      hwDesc: 'Register patients & capture retinal images at rural camps.',
      doctor: 'Ophthalmologist',
      doctorDesc: 'Review AI-graded cases and provide clinical sign-off.',
      admin: 'District Administrator',
      adminDesc: 'Monitor screening coverage and plan capacity.',
    },
  },
  {
    code: 'hi',
    name: 'Hindi',
    native: 'हिन्दी',
    catchphrase: 'डायबिटिक रेटिनोपैथी की पहचान दृष्टि जाने से पहले करें।',
    subtitle: 'ग्रामीण प्राथमिक स्वास्थ्य केंद्रों और टेली-ऑप्थैल्मोलॉजी के लिए एआई-संचालित रेटिना स्क्रीनिंग।',
    stats: {
      speed: '< ३० से',
      speedLabel: 'प्रति जांच',
      grades: '५ श्रेणियां',
      gradesLabel: 'एआई वर्गीकरण',
      offline: 'ऑफलाइन',
      offlineLabel: 'सुविधाजनक',
    },
    roles: {
      hw: 'स्वास्थ्य कार्यकर्ता',
      hwDesc: 'मरीजों का पंजीकरण और रेटिना फोटो कैप्चर करें।',
      doctor: 'नेत्र रोग विशेषज्ञ',
      doctorDesc: 'एआई जांच की समीक्षा और नैदानिक निर्णय लें।',
      admin: 'जिला प्रशासक',
      adminDesc: 'स्क्रीनिंग कवरेज और स्वास्थ्य क्षमता की निगरानी करें।',
    },
  },
  {
    code: 'mr',
    name: 'Marathi',
    native: 'मराठी',
    catchphrase: 'दृष्टी जाण्यापूर्वी डायबिटिक रेटिनोपॅथी ओळखा.',
    subtitle: 'ग्रामीण प्राथमिक आरोग्य केंद्रांसाठी आणि टेलि-ऑप्थॅल्मोलॉजीसाठी एआय रेटिनल स्क्रीनिंग.',
    stats: {
      speed: '< ३० सेकंद',
      speedLabel: 'तपासणी वेळ',
      grades: '५ स्तर',
      gradesLabel: 'एआय वर्गीकरण',
      offline: 'ऑफलाइन',
      offlineLabel: 'सुलभ वापर',
    },
    roles: {
      hw: 'आरोग्य सेविका / कार्यकर्ता',
      hwDesc: 'रुग्ण नोंदणी आणि रेटिना प्रतिमा संकलन करा.',
      doctor: 'नेत्रतज्ज्ञ डॉक्टर',
      doctorDesc: 'एआय अहवाल तपासा आणि अंतिम मान्यता द्या.',
      admin: 'जिल्हा समन्वयक',
      adminDesc: 'आरोग्य केंद्र क्षमता व तपासणी अहवाल पहा.',
    },
  },
  {
    code: 'bn',
    name: 'Bengali',
    native: 'বাংলা',
    catchphrase: 'দৃষ্টি হারানোর আগেই ডায়াবেটিক রেটিনোপ্যাথি শনাক্ত করুন।',
    subtitle: 'গ্রামীণ স্বাস্থ্যকেন্দ্র ও টেলিমেডিসিনের জন্য পয়েন্ট-অফ-কেয়ার এআই স্ক্রিনিং।',
    stats: {
      speed: '< ৩০ সে',
      speedLabel: 'প্রতি পরীক্ষা',
      grades: '৫টি স্তর',
      gradesLabel: 'এআই বিশ্লেষণ',
      offline: 'অফলাইন',
      offlineLabel: 'উপযোগী',
    },
    roles: {
      hw: 'স্বাস্থ্যকর্মী',
      hwDesc: 'রোগী নিবন্ধন ও রেটিনা ছবি তুলুন।',
      doctor: 'চক্ষুরোগ বিশেষজ্ঞ',
      doctorDesc: 'এআই কেস পর্যালোচনা ও পরামর্শ দিন।',
      admin: 'জেলা প্রশাসক',
      adminDesc: 'স্বাস্থ্য পরিকাঠামো পর্যবেক্ষণ করুন।',
    },
  },
  {
    code: 'pa',
    name: 'Punjabi',
    native: 'ਪੰਜਾਬੀ',
    catchphrase: 'ਨਜ਼ਰ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਡਾਇਬੀਟਿਕ ਰੈਟੀਨੋਪੈਥੀ ਦੀ ਪਛਾਣ ਕਰੋ।',
    subtitle: 'ਪੇਂਡੂ ਪ੍ਰਾਇਮਰੀ ਸਿਹਤ ਕੇਂਦਰਾਂ ਲਈ ਏਆਈ-ਅਧਾਰਿਤ ਰੈਟੀਨਾ ਸਕ੍ਰੀਨਿੰਗ।',
    stats: {
      speed: '< 30 ਸਕਿੰਟ',
      speedLabel: 'ਪ੍ਰਤੀ ਜਾਂਚ',
      grades: '5 ਸ਼੍ਰੇਣੀਆਂ',
      gradesLabel: 'ਏਆਈ ਵਰਗੀਕਰਨ',
      offline: 'ਆਫਲਾਈਨ',
      offlineLabel: 'ਸਮਰਥਿਤ',
    },
    roles: {
      hw: 'ਸਿਹਤ ਕਰਮਚਾਰੀ',
      hwDesc: 'ਮਰੀਜ਼ ਰਜਿਸਟਰ ਕਰੋ ਅਤੇ ਰੈਟੀਨਾ ਫੋਟੋ ਲਵੋ।',
      doctor: 'ਅੱਖਾਂ ਦੇ ਮਾਹਰ',
      doctorDesc: 'ਏਆਈ ਰਿਪੋਰਟਾਂ ਦੀ ਜਾਂਚ ਅਤੇ ਪੁਸ਼ਟੀ ਕਰੋ।',
      admin: 'ਜ਼ਿਲ੍ਹਾ ਪ੍ਰਬੰਧਕ',
      adminDesc: 'ਸਕ੍ਰੀਨਿੰਗ ਕਵਰੇਜ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ।',
    },
  },
  {
    code: 'ta',
    name: 'Tamil',
    native: 'தமிழ்',
    catchphrase: 'பார்வை இழப்பதற்கு முன் நீரிழிவு ரெட்டினோபதியை கண்டறியவும்.',
    subtitle: 'கிராமப்புற ஆரம்ப சுகாதார நிலையங்களுக்கான ஏஐ விழித்திரை பரிசோதனை.',
    stats: {
      speed: '< 30 வினாடி',
      speedLabel: 'பரிசோதனை நேரம்',
      grades: '5 நிலைகள்',
      gradesLabel: 'ஏஐ பகுப்பாய்வு',
      offline: 'ஆஃப்லைன்',
      offlineLabel: 'பயன்படுத்தலாம்',
    },
    roles: {
      hw: 'கள சுகாதார பணியாளர்',
      hwDesc: 'நோயாளிகளைப் பதிவு செய்து படங்களை எடுக்கவும்.',
      doctor: 'கண் மருத்துவர்',
      doctorDesc: 'ஏஐ முடிவுகளை மதிப்பாய்வு செய்து உறுதிப்படுத்தவும்.',
      admin: 'மாவட்ட நிர்வாகி',
      adminDesc: 'பரிசோதனை அளவை கண்காணிக்கவும்.',
    },
  },
  {
    code: 'te',
    name: 'Telugu',
    native: 'తెలుగు',
    catchphrase: 'దృష్టి కోల్పోయే ముందే డయాబెటిక్ రెటినోపతిని గుర్తించండి.',
    subtitle: 'గ్రామీణ ప్రాథమిక ఆరోగ్య కేంద్రాల కోసం ఏఐ రెటీనా స్క్రీనింగ్.',
    stats: {
      speed: '< 30 సె',
      speedLabel: 'ఒక్కో పరీక్ష',
      grades: '5 వర్గాలు',
      gradesLabel: 'ఏఐ విభజన',
      offline: 'ఆఫ్‌లైన్',
      offlineLabel: 'అనుకూలం',
    },
    roles: {
      hw: 'క్షేత్ర స్థాయి ఆరోగ్య కార్యకర్త',
      hwDesc: 'రోగుల వివరాలు నమోదు చేసి ఫోటోలు తీయండి.',
      doctor: 'నేత్ర వైద్య నిపుణులు',
      doctorDesc: 'ఏఐ నివేదికలను సమీక్షించి నిర్ధారించండి.',
      admin: 'జిల్లా అడ్మినిస్ట్రేటర్',
      adminDesc: 'స్క్రీనింగ్ పురోగతిని పర్యవేక్షించండి.',
    },
  },
  {
    code: 'chg',
    name: 'Chhattisgarhi',
    native: 'छत्तीसगढ़ी',
    catchphrase: 'आंखी के जोती जाय से पहिली डायबिटिक रेटिनोपैथी के जांच करव।',
    subtitle: 'गांव-देहात के प्राथमिक स्वास्थ्य केंद्र बर एआई रेटिना जांच प्रणाली।',
    stats: {
      speed: '< ३० सेकंद',
      speedLabel: 'जांच म समय',
      grades: '५ ठन स्तर',
      gradesLabel: 'एआई जांच',
      offline: 'बिना नेट के',
      offlineLabel: 'सुविधाजनक',
    },
    roles: {
      hw: 'मितानिन / स्वास्थ्य कार्यकर्ता',
      hwDesc: 'रोगी के पंजीयन अउ आंखी के फोटो खींचव।',
      doctor: 'आंखी के डॉक्टर',
      doctorDesc: 'एआई जांच के रिपोर्ट देखव अउ साइन करव।',
      admin: 'जिला अधिकारी',
      adminDesc: 'जांच शिविर के व्यवस्था देखव।',
    },
  },
  {
    code: 'gu',
    name: 'Gujarati',
    native: 'ગુજરાતી',
    catchphrase: 'દ્રષ્ટિ ગુમાવતા પહેલા ડાયાબિટીક રેટિનોપેથી ઓળખો.',
    subtitle: 'ગ્રામીણ આરોગ્ય કેન્દ્રો માટે એઆઈ આધારિત આંખની રેટિના તપાસ.',
    stats: {
      speed: '< ૩૦ સેકન્ડ',
      speedLabel: 'તપાસ સમય',
      grades: '૫ સ્તર',
      gradesLabel: 'એઆઈ વર્ગીકરણ',
      offline: 'ઓફલાઇન',
      offlineLabel: 'સુલભ',
    },
    roles: {
      hw: 'આરોગ્ય કાર્યકર',
      hwDesc: 'દર્દીઓની નોંધણી અને રેટિના ફોટો કેપ્ચર કરો.',
      doctor: 'નેત્ર ચિકિત્સક',
      doctorDesc: 'એઆઈ તપાસનું મૂલ્યાંકન અને મંજૂરી આપો.',
      admin: 'જિલ્લા વહીવટકર્તા',
      adminDesc: 'તપાસ ક્ષમતા અને કવરેજનું નિરીક્ષણ કરો.',
    },
  },
  {
    code: 'kn',
    name: 'Kannada',
    native: 'ಕನ್ನಡ',
    catchphrase: 'ದೃಷ್ಟಿ ಕಳೆದುಕೊಳ್ಳುವ ಮುನ್ನವೇ ಮಧುಮೇಹ ರೆಟಿನೋಪತಿಯನ್ನು ಪತ್ತೆಹಚ್ಚಿ.',
    subtitle: 'ಗ್ರಾಮೀಣ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರಗಳಿಗಾಗಿ ಎಐ ರೆಟಿನಾ ತಪಾಸಣೆ.',
    stats: {
      speed: '< ೩೦ ಸೆ',
      speedLabel: 'ಪ್ರತಿ ತಪಾಸಣೆ',
      grades: '೫ ಹಂತಗಳು',
      gradesLabel: 'ಎಐ ವರ್ಗೀಕರಣ',
      offline: 'ಆಫ್‌ಲೈನ್',
      offlineLabel: 'ಸ್ನೇಹಿ',
    },
    roles: {
      hw: 'ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತರು',
      hwDesc: 'ರೋಗಿಗಳನ್ನು ನೋಂದಾಯಿಸಿ ಮತ್ತು ಫೋಟೋ ತೆಗೆಯಿರಿ.',
      doctor: 'ನೇತ್ರ ತಜ್ಞರು',
      doctorDesc: 'ಎಐ ವರದಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ದೃಢೀಕರಿಸಿ.',
      admin: 'ಜಿಲ್ಲಾ ನಿರ್ವಾಹಕರು',
      adminDesc: 'ತಪಾಸಣೆಯ ಪ್ರಗತಿಯನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.',
    },
  },
];

const DISTRICTS = [
  'Khed Primary Health Centre (Pune)',
  'Pune District',
  'Nashik District',
  'Nagpur District',
  'Thane District',
  'Satara District',
  'Ahmednagar District',
];

export function Login() {
  const navigate = useNavigate();
  const { setUserRole } = useAppState();

  const [selectedLang, setSelectedLang] = useState<LanguageOption>(LANGUAGES[0]);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const [chosenRole, setChosenRole] = useState<'health_worker' | 'doctor' | 'admin'>('health_worker');
  const [name, setName] = useState('Priya Sharma / प्रिया शर्मा');
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [loading, setLoading] = useState(false);

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (chosenRole === 'doctor') {
      setUserRole('doctor');
      setTimeout(() => navigate('/doctor'), 350);
    } else if (chosenRole === 'admin') {
      setUserRole('doctor');
      setTimeout(() => navigate('/settings'), 350);
    } else {
      setUserRole('health_worker');
      setTimeout(() => navigate('/'), 350);
    }
  }

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 overflow-x-hidden font-sans">
      {/* ========================================================
          LEFT PANEL: Deep Blue/Indigo Gradient + Clinical Fundus Background
          ======================================================== */}
      <div className="relative lg:col-span-6 xl:col-span-5 bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 text-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden">
        {/* Subtle radial glow accents */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />

        {/* Clinical Fundus Examination Background Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none mix-blend-soft-light opacity-30"
          style={{ backgroundImage: `url('/clinical-fundus-bg.jpg')` }}
        />

        {/* Top Bar: Brand Badge & Multilingual Selector */}
        <div className="relative z-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg border border-white/20">
              <ScanEye size={22} className="text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block leading-tight">
                NetraRakshaq
              </span>
              <span className="text-[10px] text-blue-200/80 font-mono tracking-wider uppercase">
                AI Retinal Triage
              </span>
            </div>
          </div>

          {/* Frosted Translucent Pill Multilingual Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(o => !o)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-xs font-semibold text-white transition-all cursor-pointer shadow-sm"
            >
              <Globe size={14} className="text-blue-300" />
              <span>{selectedLang.native} ({selectedLang.name})</span>
              <ChevronDown size={13} className="text-blue-200" />
            </button>

            {langDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangDropdownOpen(false)}
                />
                <div className="absolute right-0 top-11 w-64 max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-2xl py-1.5 z-50 text-xs text-gray-900 ring-1 ring-black/10">
                  <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/80">
                    Select Language / भाषा चुनें
                  </div>
                  {LANGUAGES.map(lang => {
                    const isSelected = selectedLang.code === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setSelectedLang(lang);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 text-blue-900 font-bold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="truncate">
                          {lang.native} <span className="text-[11px] text-gray-500 font-normal">({lang.name})</span>
                        </span>
                        {isSelected && <Check size={14} className="text-blue-600 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center Hero: Prominent Catchphrase & Subtitle */}
        <div className="relative z-10 my-10 lg:my-0 space-y-4 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-[11px] font-bold">
            <Sparkles size={12} className="text-blue-300" />
            <span>Tele-Ophthalmology for Rural Primary Care</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
            {selectedLang.catchphrase}
          </h1>

          <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed font-normal">
            {selectedLang.subtitle}
          </p>

          {/* 3 Key Stats */}
          <div className="grid grid-cols-3 gap-2.5 pt-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3 rounded-xl text-center">
              <div className="text-base sm:text-lg font-black text-blue-300 font-mono">
                {selectedLang.stats.speed}
              </div>
              <div className="text-[10px] text-blue-100/70 font-bold tracking-wider mt-0.5">
                {selectedLang.stats.speedLabel}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3 rounded-xl text-center">
              <div className="text-base sm:text-lg font-black text-emerald-300 font-mono">
                {selectedLang.stats.grades}
              </div>
              <div className="text-[10px] text-blue-100/70 font-bold tracking-wider mt-0.5">
                {selectedLang.stats.gradesLabel}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-3 rounded-xl text-center">
              <div className="text-base sm:text-lg font-black text-amber-300 font-mono">
                {selectedLang.stats.offline}
              </div>
              <div className="text-[10px] text-blue-100/70 font-bold tracking-wider mt-0.5">
                {selectedLang.stats.offlineLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tag */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-blue-200/60 font-mono">
          <span>DEMO MODE · For demonstration only</span>
          <span>Not for clinical use</span>
        </div>
      </div>

      {/* ========================================================
          RIGHT PANEL: Role Selector & Simple Big-Touch Form
          ======================================================== */}
      <div className="lg:col-span-6 xl:col-span-7 bg-[#F8FAFC] p-6 sm:p-10 lg:p-14 flex items-center justify-center">
        <div className="w-full max-w-xl space-y-6">
          {/* Header */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <ScanEye size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Sign in to continue
              </h2>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Choose your role to see the workflow tailored for you.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {/* 3 Role Selector Cards (With Radio Dots) */}
            <div className="space-y-2.5">
              <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                Select Your Access Role:
              </label>

              {/* 1. Field Health Worker */}
              <div
                onClick={() => setChosenRole('health_worker')}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  chosenRole === 'health_worker'
                    ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-100 shadow-xs'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  chosenRole === 'health_worker'
                    ? 'bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <Stethoscope size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-gray-900">
                      🩺 {selectedLang.roles.hw}
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      chosenRole === 'health_worker' ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'
                    }`}>
                      {chosenRole === 'health_worker' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    {selectedLang.roles.hwDesc}
                  </p>
                </div>
              </div>

              {/* 2. Ophthalmologist */}
              <div
                onClick={() => setChosenRole('doctor')}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  chosenRole === 'doctor'
                    ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-100 shadow-xs'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  chosenRole === 'doctor'
                    ? 'bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <Eye size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-gray-900">
                      👁️ {selectedLang.roles.doctor}
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      chosenRole === 'doctor' ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'
                    }`}>
                      {chosenRole === 'doctor' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    {selectedLang.roles.doctorDesc}
                  </p>
                </div>
              </div>

              {/* 3. District Administrator */}
              <div
                onClick={() => setChosenRole('admin')}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  chosenRole === 'admin'
                    ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-100 shadow-xs'
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  chosenRole === 'admin'
                    ? 'bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <Shield size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-gray-900">
                      🛡️ {selectedLang.roles.admin}
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      chosenRole === 'admin' ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white'
                    }`}>
                      {chosenRole === 'admin' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    {selectedLang.roles.adminDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Inputs: Your Name & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-gray-700">
                  Your Name:
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma / प्रिया शर्मा"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-medium text-gray-800 transition-all text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-gray-700">
                  District / Primary Health Unit:
                </label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-medium text-gray-800 transition-all text-xs cursor-pointer"
                  >
                    {DISTRICTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Big CTA Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 text-sm"
            >
              {loading ? (
                <>Launching Workspace…</>
              ) : (
                <>
                  Enter NetraRakshaq →
                </>
              )}
            </button>

            {/* Demo Note */}
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-center text-[11px] text-blue-900">
              <span className="font-bold">Demo Note:</span> No password needed — this is a demo. Real deployments use OTP / ABHA SSO.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
