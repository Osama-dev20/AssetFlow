import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, Wrench, Box, CalendarClock, Sparkles, 
  ArrowLeft, CheckCircle2, ChevronDown, ChevronLeft, Play, HelpCircle, 
  ExternalLink, Layers, Activity, Zap, Check, ChevronRight,
  TrendingUp, Clock, Globe, Mail, ArrowUpRight, CheckSquare,
  Menu, X, Volume2, VolumeX, AlertTriangle, Sliders, ShieldCheck,
  Cpu, Radio, Database
} from 'lucide-react';
import { HalftoneWordmark } from '@/components/ui/halftone-wordmark';
import { ShinyButton } from '@/components/ui/shiny-button';
import { GlowCard } from '@/components/ui/spotlight-card';
import { translations } from '@/data/translations';
import { soundManager } from '@/lib/soundEffects';

interface LandingPageProps {
  onOpenReportFault?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenReportFault }) => {
  const { 
    setCurrentPage, 
    showToast, 
    triggerCelebration,
    language,
    setLanguage,
    isSoundMuted,
    toggleSoundMute,
    switchRole
  } = useApp();
  
  const t = translations[language] || translations['ar'];
  
  // Navigation & Interactive states
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('top');

  // Section Tabs states
  const [journeyStep, setJourneyStep] = useState(0);
  const [selectedSector, setSelectedSector] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // AI Diagnosis Edit Modal State
  const [isEditAiModalOpen, setIsEditAiModalOpen] = useState(false);
  const [customAiSymptom, setCustomAiSymptom] = useState<string | null>(null);
  const [customAiCategory, setCustomAiCategory] = useState<string | null>(null);
  const [aiSeverity, setAiSeverity] = useState<'high' | 'medium' | 'low'>('high');
  const [customAiCauses, setCustomAiCauses] = useState<string | null>(null);

  const activeSymptom = customAiSymptom ?? t.ai.symptomDefault;
  const activeCategory = customAiCategory ?? t.ai.categoryDefault;
  const activeCauses = customAiCauses ?? t.ai.causesDefault;

  // Interactive Priority Calculator state
  const [calcServiceImpact, setCalcServiceImpact] = useState(40);
  const [calcNoBackup, setCalcNoBackup] = useState(25);
  const [calcDelay, setCalcDelay] = useState(12);
  const [calcFailure, setCalcFailure] = useState(9);
  const calcScore = calcServiceImpact + calcNoBackup + calcDelay + calcFailure;

  // Scroll spy to highlight active section in Navbar (RAF throttled for 120fps smooth performance)
  useEffect(() => {
    let ticking = false;
    const sectionIds = ['top', 'platform', 'journey', 'sectors', 'ai', 'formula', 'faq'];

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + 180;
          for (let i = sectionIds.length - 1; i >= 0; i--) {
            const id = sectionIds[i];
            const el = document.getElementById(id);
            if (el) {
              const top = el.offsetTop;
              if (scrollPosition >= top) {
                setActiveSection(id);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll reveal IntersectionObserver for smooth transitions
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.section-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const scrollToSection = (id: string) => {
    soundManager.playButtonClick();
    setMobileMenuOpen(false);
    setMegaOpen(false);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleSound = () => {
    const nextMuted = toggleSoundMute();
    if (!nextMuted) {
      soundManager.playButtonClick();
      showToast(
        language === 'ar' ? 'المؤثرات الصوتية مفعلة' : 'Sound effects enabled',
        language === 'ar' ? 'تم تشغيل أصوات النقر والتنقل التفاعلية' : 'Interactive clicks and chime audio active',
        'info'
      );
    } else {
      showToast(
        language === 'ar' ? 'المؤثرات الصوتية صامتة' : 'Sound effects muted',
        language === 'ar' ? 'تم كتم الأصوات التفاعلية' : 'Audio is now silent',
        'info'
      );
    }
  };

  const journeyStepsData = [
    {
      num: '01',
      title: language === 'en' ? 'Register Your Assets' : 'سجّل أصولك',
      sub: language === 'en' ? 'Excel Import or Rapid QR Setup' : 'استيراد Excel أو إدخال سريع مع QR',
      desc: language === 'en'
        ? 'Start with critical machines: name, code, location, condition. Bulk import your asset inventory from Excel, and generate instant QR tags for field affixing.'
        : 'ابدأ بالأصول الأهم: اسم، كود، موقع، حالة. استورد قائمتك الحالية دفعة واحدة من جداول Excel، واطبع رمز QR لكل معدة فورياً للتعليق الميداني.',
      items: language === 'en' ? [
        { name: 'AST-PUMP-101 · Centrifugal Pump #1', status: 'Registered', color: 'text-blue-400' },
        { name: 'AST-GEN-204 · Turbine Generator 1500kVA', status: 'Registered', color: 'text-blue-400' },
        { name: 'Batch import 120 assets from Excel', status: 'Completed', color: 'text-emerald-400' }
      ] : [
        { name: 'AST-PUMP-101 · مضخة الطرد المركزي', status: 'تم التسجيل', color: 'text-blue-400' },
        { name: 'AST-GEN-204 · المولد التوربيني', status: 'تم التسجيل', color: 'text-blue-400' },
        { name: 'استيراد 120 أصلًا من ملف Excel', status: 'مكتمل بنجاح', color: 'text-emerald-400' }
      ]
    },
    {
      num: '02',
      title: language === 'en' ? 'Map to Critical Services' : 'اربطها بالخدمات',
      sub: language === 'en' ? 'Who depends on what?' : 'من يعتمد على من؟',
      desc: language === 'en'
        ? 'Identify which vital service each machine supports (potable water, medical oxygen, grid power). If an asset halts, know its immediate service impact.'
        : 'حدّد أي خدمة حيوية تخدمها كل معدة (مياه الشرب، الأكسجين، الطاقة). عند تعطل أي أصل، يعرف النظام فورًا أي خدمة ستتأثر وهل يوجد أصل بديل مناوب.',
      items: language === 'en' ? [
        { name: 'Pump #1 + Pump #2 ➔ RO Desalination Feed', status: 'N+1 Redundant', color: 'text-emerald-400' },
        { name: 'CAT Generator ➔ Hospital Emergency Power', status: 'Critical Service', color: 'text-amber-400' },
        { name: 'Firefighting Grid ➔ North Industrial Cluster', status: 'Stable', color: 'text-blue-400' }
      ] : [
        { name: 'مضخة #1 + مضخة #2 ➔ تزويد مياه محطة التحلية', status: 'خط احتياط N+1', color: 'text-emerald-400' },
        { name: 'مولد CAT ➔ الطاقة الاحتياطية للمستشفى', status: 'خدمة حرجة', color: 'text-amber-400' },
        { name: 'شبكة مكافحة الحريق ➔ مجمع المصانع الشمالية', status: 'مستقرة', color: 'text-blue-400' }
      ]
    },
    {
      num: '03',
      title: language === 'en' ? 'Report & Let AI Diagnose' : 'أبلغ ودع AI يحلل',
      sub: language === 'en' ? 'Classification, Severity & Tests' : 'تصنيف وشدة وفحوصات خلال ثوانٍ',
      desc: language === 'en'
        ? 'Technicians describe what they observe in colloquial words. AI determines failure category, severity, suspected causes, and auto-calculates priority.'
        : 'يكتب الفني أو المُبلِّغ ما يراه بلغته الطبيعية، فيقوم الذكاء الاصطناعي بتحديد التصنيف والشدة والأسباب المحتملة، واحتساب الأولوية الذكية فورًا.',
      items: language === 'en' ? [
        { name: 'Report diagnosis: Loud bearing noise & thermal rise', status: 'Mechanical Bearing Wear', color: 'text-rose-400' },
        { name: 'Impact score: No standby backup available', status: 'Priority 86 (Critical)', color: 'text-rose-400' },
        { name: 'Technician test checklist auto-generated', status: 'Ready', color: 'text-teal-400' }
      ] : [
        { name: 'تحليل البلاغ: صوت اهتزاز عالي وارتفاع حرارة', status: 'عطل ميكانيكي محامل', color: 'text-rose-400' },
        { name: 'حساب الأثر: لا يوجد بديل احتياطي متوفر', status: 'أولوية 86 (حرجة)', color: 'text-rose-400' },
        { name: 'توليد قائمة الفحوصات المقترحة للفني', status: 'جاهزة', color: 'text-teal-400' }
      ]
    },
    {
      num: '04',
      title: language === 'en' ? 'Execute & Certify' : 'نفّذ وتحقق',
      sub: language === 'en' ? 'Work Order to Verified Close' : 'أمر عمل حتى التأكيد',
      desc: language === 'en'
        ? 'Work order reaches technician phone with reserved parts list. Ticket cannot close without proof of operational test and verified service stabilization.'
        : 'يصل أمر العمل لهاتف الفني الأنسب مع قطع الغيار المطلوبة، ولا يُغلق البلاغ إلا بعد إجراء اختبار التشغيل والتأكد من استقرار الخدمة الحرجة.',
      items: language === 'en' ? [
        { name: 'Assigned to: Ahmed Khalil (Senior Mechanic)', status: 'Dispatched', color: 'text-blue-400' },
        { name: 'Mechanical Seal Kit reserved from warehouse', status: 'Issued', color: 'text-emerald-400' },
        { name: 'Commissioning test & pressure OK', status: 'Closed & Verified', color: 'text-emerald-400' }
      ] : [
        { name: 'إسناد الأمر للفني: أحمد خليل (فني أول ميكانيك)', status: 'تم الإسناد', color: 'text-blue-400' },
        { name: 'حجز طقم الجوان الميكانيكي من المستودع', status: 'تم الصرف', color: 'text-emerald-400' },
        { name: 'فحص ما بعد الصيانة وتأكيد استقرار الضغط', status: 'مغلق وموثق', color: 'text-emerald-400' }
      ]
    }
  ];

  const sectorsData = [
    {
      name: language === 'en' ? 'Healthcare & Hospitals' : 'الرعاية الصحية والمستشفيات',
      title: language === 'en' ? 'When Downtime is a Matter of Life' : 'حين يكون العطل مسألة حياة',
      desc: language === 'en'
        ? 'Operating rooms, medical oxygen, and vaccine cold chains cannot afford waiting. AssetFlow keeps them on top, ensuring life safety.'
        : 'غرف العمليات، الأكسجين الطبي، وسلسلة تبريد الأدوية لا تحتمل الانتظار. AssetFlow يضعها في رأس القائمة دائمًا، ويضمن تشغيل أنظمة الإنقاذ أولاً.',
      assets: language === 'en'
        ? ['Medical Oxygen Plant', 'Blood Bank Freezers', 'Emergency ATS Generators', 'Central Autoclaves']
        : ['مولدات الأكسجين المركزي', 'وحدات تبريد بنك الدم', 'المولدات الاحتياطية ATS', 'أجهزة التعقيم بالأوتوكلاف'],
      services: language === 'en'
        ? ['ICU Medical Oxygen Supply', 'Surgical Theaters Operation', 'Vaccine & Medication Cold Chain']
        : ['إمداد الأكسجين الطبي لغرف العناية', 'تشغيل غرف العمليات الجراحية', 'سلسلة تبريد اللقاحات والأدوية']
    },
    {
      name: language === 'en' ? 'Water Utilities & Desalination' : 'المرافق العامة ومحطات المياه',
      title: language === 'en' ? 'Continuous Clean Water Flow' : 'تدفق المياه الصالحة بلا انقطاع',
      desc: language === 'en'
        ? 'Pumping stations, RO desalination, and distribution networks serving thousands. Prevents hydraulic cavitation and network drought.'
        : 'محطات الضخ والتحلية وشبكات التوزيع تخدم آلاف المواطنين. يراقب النظام مضخات الطرد المركزي، مستويات الخزانات، والضغوط الهيدروليكية لمنع جفاف الشبكة.',
      assets: language === 'en'
        ? ['High-Pressure Centrifugal Pumps', 'RO Desalination Trains', 'SCADA RTU Remote Panels', 'Pressure Regulating Valves (PRV)']
        : ['مضخات الطرد المركزي عالية الضغط', 'محطات تحلية التناضح العكسي RO', 'لوحات التحكم الآلي SCADA', 'صمامات تنظيم الضغط PRV'],
      services: language === 'en'
        ? ['Municipal Potable Water Supply', 'Desalination Plant Feed Loop', 'Emergency Firefighting Reservoir Flow']
        : ['تزويد مياه الشرب للأحياء السكنية', 'معالجة وتنقية مياه الآبار', 'خطوط الضخ الناقلة الرئيسية']
    },
    {
      name: language === 'en' ? 'Industrial Plants & Manufacturing' : 'المنشآت والمصانع الصناعية',
      title: language === 'en' ? 'Prevent Costly Line Stalls' : 'حماية خطوط الإنتاج من التوقف المكلف',
      desc: language === 'en'
        ? 'Every minute of downtime damages raw materials and costs thousands. AssetFlow links production lines with preventive maintenance.'
        : 'كل دقيقة توقف في المصنع تعني خسائر مالية فادحة وتلف مواد خام. يربط AssetFlow خطوط الإنتاج بالصيانة الوقائية لخفض التوقف غير المخطط بنسبة 40%.',
      assets: language === 'en'
        ? ['Industrial Chillers', 'Screw Air Compressors', 'Conveyor Drive Motors', 'Thermal Treatment Boilers']
        : ['وحدات التبريد الصناعي Chiller', 'ضواغط الهواء اللولبية Screw', 'محركات السيور الناقلة', 'أفران المعالجة الحرارية'],
      services: language === 'en'
        ? ['Chemical Production Cooling', 'Pneumatic Automation Air Supply', 'Safety Firefighting Loop']
        : ['تبريد خطوط الإنتاج الكيميائي', 'إمداد الهواء المضغوط للأتمتة', 'شبكة إطفاء الحريق والسلامة']
    },
    {
      name: language === 'en' ? 'Universities & Campus Infrastructure' : 'الجامعات والمؤسسات التعليمية',
      title: language === 'en' ? 'Advanced & Resilient Campuses' : 'بنية تحتية متطورة ومستدامة',
      desc: language === 'en'
        ? 'Campuses hosting thousands daily. Manage central HVAC, research laboratories, and electrical substations seamlessly.'
        : 'إدارة مراكز البيانات الجامعية، مختبرات الأبحاث العلمية، ومحطات الكهرباء المركزية لضمان بيئة تعليمية وبحثية مستمرة دون انقطاع.',
      assets: language === 'en'
        ? ['CRAC Data Center Air Handlers', 'Uninterruptible Power Supplies (UPS)', 'Cryogenic Research Labs', 'District Heating Loops']
        : ['مكيفات مراكز البيانات الدقيقة CRAC', 'أنظمة UPS للطاقة اللامنقطعة', 'مختبرات الأبحاث المبردة', 'شبكات التدفئة المركزية'],
      services: language === 'en'
        ? ['Cloud Servers Uptime', 'Bio-engineering Labs HVAC', 'Academic Complex Power Reliability']
        : ['استمرارية خوادم البيانات السحابية', 'أبحاث الهندسة والعلوم الحيوية', 'إمداد الطاقة للمجمعات الأكاديمية']
    }
  ];

  const faqs = language === 'en' ? [
    {
      q: 'Does AI autonomously make final maintenance decisions?',
      a: 'No. AI parses fault symptoms, predicts mechanical root causes, suggests diagnostic checklists, and computes priority. The final decision always remains with your certified maintenance manager.'
    },
    {
      q: 'How long does facility onboarding and setup take?',
      a: 'Between 15 to 45 minutes for standard plants. You can bulk import existing assets via Excel (.xlsx), auto-generate printable QR tags, and map vital services with simple point-and-click.'
    },
    {
      q: 'Does AssetFlow support multi-site geographical facilities?',
      a: 'Yes, absolutely. The platform is architected for multi-site organizations, letting you monitor pumping stations, hospitals, and industrial hubs from a centralized screen with granular access control.'
    },
    {
      q: 'Is the platform mobile and tablet friendly?',
      a: 'Yes, it is super responsive and 100% compatible with phones and tablets, allowing technicians to scan QR tags, inspect daily work orders, and log photo repairs on-site.'
    },
    {
      q: 'What happens after the 7-day free trial ends?',
      a: 'All your logged assets, telemetry history, and work orders remain fully preserved and secure. You can upgrade to a monthly or annual tier or request a custom deployment.'
    }
  ] : [
    {
      q: 'هل الذكاء الاصطناعي يتخذ قرار الصيانة بمفرده؟',
      a: 'لا. الذكاء الاصطناعي يحلل وصف العطل الميداني ويقترح تصنيفًا وشدة وفحوصات مبدئية. الأولوية تُحسب بقواعد شفافة وقابلة للتفسير (Explainable Priority) وفق سياسة المنشأة، والقرار النهائي يبقى دائمًا لمدير الصيانة والمهندس المسئول.'
    },
    {
      q: 'كم يستغرق إعداد النظام وبدء الاستخدام؟',
      a: 'أقل من 15 دقيقة! تستطيع استيراد قائمة أصولك ومعداتك دفعة واحدة من ملف Excel، وتوليد ملصقات QR بضغطة زر، وبدء استقبال بلاغات الأعطال فوراً دون الحاجة لتدريب معقد.'
    },
    {
      q: 'هل يناسب AssetFlow منشأة تمتلك عدة مواقع جغرافية متباعدة؟',
      a: 'نعم تمامًا. النظام مبني هيكليًا ليدعم المؤسسات متعددة المواقع (Multi-site)، بحيث يمكنك متابعة محطات الضخ، المستشفيات، والمصانع من شاشة مركزية واحدة مع تخصيص صلاحيات لكل موقع.'
    },
    {
      q: 'هل يعمل النظام على الهواتف والأجهزة اللوحية؟',
      a: 'نعم، المنصة سوبر ريسبونسيف ومتوافقة 100% مع شاشات الهواتف والتابلت، مما يتيح للفنيين مسح رموز QR، واستعراض مهامهم اليومية وتحديث حالة الإصلاحات ميدانيًا من الموقع مباشرة.'
    },
    {
      q: 'ماذا يحدث بعد انتهاء فترة التجربة المجانية؟',
      a: 'تبقى كافة بياناتك وأصولك وسجلاتك محفوظة بأمان تام. يمكنك الترقية إلى إحدى خططنا الشهرية أو السنوية المناسبة لحجم منشأتك، أو طلب استشارة هندسية لتخصيص الخطة.'
    }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    soundManager.playSuccess();
    setNewsletterSubscribed(true);
    showToast(
      language === 'en' ? 'Thank you for subscribing!' : 'شكراً لاشتراكك!',
      language === 'en' ? 'Your email has been added to our engineering newsletter.' : 'تم تسجيل بريدك في النشرة الهندسية الدورية.',
      'success'
    );
  };

  const handleTriggerReportFault = () => {
    soundManager.playButtonClick();
    switchRole('reporter');
    setCurrentPage('issues-new');
  };

  return (
    <div 
      dir={t.dir}
      className={`min-h-screen bg-[#060A15] text-[#E6EDF7] antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden relative ${
        language === 'en' ? 'font-sans' : 'font-arabic'
      }`}
    >
      {/* GLOBAL UNIFIED AMBIENT BACKGROUND CANVAS: Continuous Star/Dot Matrix & Atmospheric Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Continuous star/dot grid running seamlessly across the entire page */}
        <div className="absolute inset-0 bg-stars-unified opacity-80" />
        
        {/* Soft, harmonious atmospheric color blooms that do not cut off at section borders */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-blue-600/15 via-teal-500/10 to-transparent blur-[140px]" />
        <div className="absolute top-[32%] -left-[180px] w-[600px] h-[600px] bg-blue-700/10 rounded-full blur-[160px]" />
        <div className="absolute top-[60%] -right-[180px] w-[650px] h-[650px] bg-teal-600/10 rounded-full blur-[170px]" />
        <div className="absolute bottom-[10%] left-1/3 w-[700px] h-[500px] bg-indigo-700/10 rounded-full blur-[180px]" />
      </div>
      
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="bg-gradient-to-r from-blue-900/40 via-teal-900/30 to-blue-900/40 border-b border-[#1E2A44]/70 backdrop-blur-md py-2.5 px-4 text-center text-xs sm:text-sm relative z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2.5 flex-wrap text-[#C3CEDF]">
          <span className="text-[11px] font-bold text-[#070B16] bg-[#34D399] px-2.5 py-0.5 rounded-full shadow-sm">
            {t.announcement.tag}
          </span>
          <span>{t.announcement.text}</span>
          <button 
            onClick={() => scrollToSection('ai')}
            className="text-blue-400 hover:text-blue-300 font-semibold underline inline-flex items-center gap-1 cursor-pointer"
          >
            {t.announcement.cta}
          </button>
        </div>
      </div>

      {/* 2. MAIN HEADER WITH DYNAMIC ACTIVE HIGHLIGHTING NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#070B16]/85 backdrop-blur-xl border-b border-[#1A2440]/80 transition-colors">
        <nav aria-label={language === 'en' ? 'Main Navigation' : 'التنقل الرئيسي'} className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 relative">
          
          {/* Logo & Audio / Language Switchers */}
          <div className="flex items-center gap-3">
            <a 
              href="#top" 
              onClick={(e) => { e.preventDefault(); scrollToSection('top'); }}
              className="flex items-center gap-3 group focus:outline-none"
            >
              <img src="/mark.png" alt="AssetFlow" className="w-10 h-10 rounded-xl shadow-lg transition-transform group-hover:scale-105" />
              <span dir="ltr" className="text-xl sm:text-2xl font-black tracking-tight text-white whitespace-nowrap">
                Asset<span className="grad font-black">Flow</span>
              </span>
            </a>

            {/* Tactile Audio Toggle Button (Desktop & Tablet) */}
            <button
              onClick={toggleSound}
              title={isSoundMuted ? t.nav.unmuteSound : t.nav.muteSound}
              className={`hidden sm:flex p-2 rounded-xl border transition-all text-xs items-center gap-1 cursor-pointer shrink-0 ${
                isSoundMuted
                  ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                  : 'border-[#22304D] bg-[#0F1729]/80 text-[#8696AE] hover:text-white hover:border-blue-500/50'
              }`}
            >
              {isSoundMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-teal-400" />}
            </button>

            {/* Language Switcher Single Toggle Button (like before) */}
            <button
              onClick={() => {
                soundManager.playButtonClick();
                const next = language === 'ar' ? 'en' : 'ar';
                setLanguage(next);
                showToast(
                  next === 'en' ? 'Switched to English' : 'تم تفعيل اللغة العربية',
                  next === 'en' ? 'Full interface preview in EN mode' : 'الواجهة كاملة باللغة العربية',
                  'info'
                );
              }}
              title={language === 'en' ? 'Switch to Arabic' : 'تغيير لغة العرض إلى الإنجليزية'}
              className="h-10 px-3.5 rounded-xl border border-[#22304D] bg-[#0F1729]/90 text-xs font-bold text-[#C3CEDF] hover:text-white hover:border-blue-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0"
            >
              <Globe size={15} className="text-blue-400 shrink-0" />
              <span className="mono uppercase tracking-wider">{language.toUpperCase()}</span>
            </button>
          </div>

          {/* Desktop Nav Links with Highlighting Animation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 p-1 rounded-full bg-[#0D1526]/85 border border-[#22304D]/70 text-xs font-semibold shrink-0 whitespace-nowrap shadow-inner">
            
            {/* Mega Menu Toggle */}
            <div className="relative shrink-0">
              <button
                type="button"
                aria-expanded={megaOpen}
                onClick={() => {
                  soundManager.playCardSwitch();
                  setMegaOpen(!megaOpen);
                }}
                className={`flex items-center gap-1.5 px-3 xl:px-3.5 py-1.5 rounded-full transition-all duration-300 whitespace-nowrap shrink-0 cursor-pointer ${
                  megaOpen ? 'bg-blue-600/20 text-white border border-blue-500/30' : 'text-[#C3CEDF] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span className="whitespace-nowrap">{t.nav.platform}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 shrink-0 ${megaOpen ? 'rotate-180 text-blue-400' : ''}`} />
              </button>

              {/* Mega Dropdown Panel */}
              {megaOpen && (
                <div className={`absolute top-full mt-2.5 w-[520px] p-4 rounded-2xl bg-[#0D1526]/95 backdrop-blur-xl border border-[#22304D] shadow-2xl grid grid-cols-2 gap-2.5 z-50 animate-slide-up ${
                  language === 'en' ? 'left-0 text-left' : 'right-0 text-right'
                }`}>
                  <button
                    onClick={() => { 
                      soundManager.playButtonClick(); 
                      setMegaOpen(false); 
                      setCurrentPage('assets'); 
                    }}
                    className={`p-3.5 rounded-xl hover:bg-[#16213A] transition-colors flex items-start gap-3 group cursor-pointer ${
                      language === 'en' ? 'text-left' : 'text-right'
                    }`}
                  >
                    <span className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                      <Box size={20} />
                    </span>
                    <div>
                      <div className="font-bold text-sm text-white group-hover:text-blue-400">{t.nav.assets}</div>
                      <div className="text-xs text-[#8696AE] mt-0.5">
                        {language === 'en' ? 'Every asset, QR code, health and history' : 'كل معدة، موقعها، حالتها وسجلها'}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => { 
                      soundManager.playButtonClick(); 
                      setMegaOpen(false); 
                      setCurrentPage('services'); 
                    }}
                    className={`p-3.5 rounded-xl hover:bg-[#16213A] transition-colors flex items-start gap-3 group cursor-pointer ${
                      language === 'en' ? 'text-left' : 'text-right'
                    }`}
                  >
                    <span className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
                      <ShieldAlert size={20} />
                    </span>
                    <div>
                      <div className="font-bold text-sm text-white group-hover:text-rose-400">{t.nav.services}</div>
                      <div className="text-xs text-[#8696AE] mt-0.5">
                        {language === 'en' ? 'Which vital service is impacted by what' : 'أي خدمة تتأثر بأي عطل'}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => { 
                      soundManager.playButtonClick(); 
                      setMegaOpen(false); 
                      setCurrentPage('work-orders'); 
                    }}
                    className={`p-3.5 rounded-xl hover:bg-[#16213A] transition-colors flex items-start gap-3 group cursor-pointer ${
                      language === 'en' ? 'text-left' : 'text-right'
                    }`}
                  >
                    <span className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                      <Wrench size={20} />
                    </span>
                    <div>
                      <div className="font-bold text-sm text-white group-hover:text-amber-400">{t.nav.workOrders}</div>
                      <div className="text-xs text-[#8696AE] mt-0.5">
                        {language === 'en' ? 'From reporting to closure & verification' : 'من البلاغ حتى التحقق'}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => { 
                      soundManager.playButtonClick(); 
                      setMegaOpen(false); 
                      setCurrentPage('preventive'); 
                    }}
                    className={`p-3.5 rounded-xl hover:bg-[#16213A] transition-colors flex items-start gap-3 group cursor-pointer ${
                      language === 'en' ? 'text-left' : 'text-right'
                    }`}
                  >
                    <span className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0">
                      <CalendarClock size={20} />
                    </span>
                    <div>
                      <div className="font-bold text-sm text-white group-hover:text-teal-400">{t.nav.preventive}</div>
                      <div className="text-xs text-[#8696AE] mt-0.5">
                        {language === 'en' ? 'Recurring plans generating automated tasks' : 'خطط دورية تولّد المهام تلقائيًا'}
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Nav link: How It Works */}
            <a 
              href="#journey" 
              onClick={(e) => { e.preventDefault(); scrollToSection('journey'); }}
              className={`px-3 xl:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 whitespace-nowrap shrink-0 inline-flex items-center ${
                activeSection === 'journey'
                  ? 'bg-blue-500/25 text-white border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                  : 'text-[#C3CEDF] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span className="whitespace-nowrap">{t.nav.journey}</span>
            </a>

            {/* Nav link: Sectors */}
            <a 
              href="#sectors" 
              onClick={(e) => { e.preventDefault(); scrollToSection('sectors'); }}
              className={`px-3 xl:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 whitespace-nowrap shrink-0 inline-flex items-center ${
                activeSection === 'sectors'
                  ? 'bg-blue-500/25 text-white border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                  : 'text-[#C3CEDF] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span className="whitespace-nowrap">{t.nav.sectors}</span>
            </a>

            {/* Nav link: AI */}
            <a 
              href="#ai" 
              onClick={(e) => { e.preventDefault(); scrollToSection('ai'); }}
              className={`px-3 xl:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 whitespace-nowrap shrink-0 inline-flex items-center ${
                activeSection === 'ai'
                  ? 'bg-teal-500/25 text-white border border-teal-400/40 shadow-[0_0_15px_rgba(20,184,166,0.25)]'
                  : 'text-[#C3CEDF] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span className="whitespace-nowrap">{t.nav.ai}</span>
            </a>

            {/* Nav link: Formula */}
            <a 
              href="#formula" 
              onClick={(e) => { e.preventDefault(); scrollToSection('formula'); }}
              className={`px-3 xl:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 whitespace-nowrap shrink-0 inline-flex items-center ${
                activeSection === 'formula'
                  ? 'bg-blue-500/25 text-white border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                  : 'text-[#C3CEDF] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span className="whitespace-nowrap">{t.nav.formula}</span>
            </a>

            {/* Nav link: FAQ */}
            <a 
              href="#faq" 
              onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}
              className={`px-3 xl:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 whitespace-nowrap shrink-0 inline-flex items-center ${
                activeSection === 'faq'
                  ? 'bg-blue-500/25 text-white border border-blue-400/40 shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                  : 'text-[#C3CEDF] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span className="whitespace-nowrap">{t.nav.faq}</span>
            </a>
          </div>

          {/* Action Buttons & Mobile Hamburger */}
          <div className="flex items-center gap-2 xl:gap-2.5 shrink-0">
            {/* Quick Report Fault trigger from Header */}
            <button
              onClick={handleTriggerReportFault}
              className="hidden xl:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0"
            >
              <AlertTriangle size={14} className="text-rose-400 shrink-0" />
              <span className="whitespace-nowrap">{t.nav.reportFault}</span>
            </button>

            <button
              onClick={() => {
                soundManager.playButtonClick();
                setCurrentPage('login');
              }}
              className="hidden sm:inline-flex items-center justify-center whitespace-nowrap min-w-fit h-10 px-5 sm:px-6 rounded-xl border border-blue-500/40 bg-gradient-to-b from-[#142346] to-[#0A1326] text-[#E2E8F0] hover:text-white hover:border-blue-400 hover:from-[#1C305E] hover:to-[#0F1B36] font-bold text-xs sm:text-sm transition-all duration-300 shadow-[0_2px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.38)] cursor-pointer tracking-normal group shrink-0"
            >
              <span className="whitespace-nowrap leading-none transition-transform duration-200 group-hover:scale-105">
                {t.nav.login}
              </span>
            </button>

            <ShinyButton
              label={t.nav.startFree}
              onClick={() => {
                setCurrentPage('signup');
              }}
              cornerRadius={9999}
              className="!h-10 !px-4 sm:!px-5 text-xs sm:text-sm font-bold shadow-md shadow-blue-600/30 min-w-fit whitespace-nowrap shrink-0"
              accentColor="#2563EB"
              accentSoftColor="#22C7B8"
            />

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                soundManager.playCardSwitch();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden p-2 rounded-xl border border-[#22304D] bg-[#0F1729] text-[#C3CEDF] cursor-pointer"
              aria-label={language === 'en' ? 'Main Menu' : 'القائمة الرئيسية'}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className={`lg:hidden bg-[#0D1526]/95 backdrop-blur-xl border-b border-[#1A2440] p-4 space-y-3 animate-slide-up ${
            language === 'en' ? 'text-left' : 'text-right'
          }`}>
            <div className="flex flex-col gap-1 text-sm font-medium">
              <button 
                onClick={() => scrollToSection('journey')}
                className="w-full p-2.5 rounded-xl text-[#C3CEDF] hover:bg-[#16213A] hover:text-white flex items-center justify-between"
              >
                <span>{t.nav.journey}</span>
                {language === 'en' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
              <button 
                onClick={() => scrollToSection('sectors')}
                className="w-full p-2.5 rounded-xl text-[#C3CEDF] hover:bg-[#16213A] hover:text-white flex items-center justify-between"
              >
                <span>{t.nav.sectors}</span>
                {language === 'en' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
              <button 
                onClick={() => scrollToSection('ai')}
                className="w-full p-2.5 rounded-xl text-[#C3CEDF] hover:bg-[#16213A] hover:text-white flex items-center justify-between"
              >
                <span>{t.nav.ai}</span>
                {language === 'en' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
              <button 
                onClick={() => scrollToSection('formula')}
                className="w-full p-2.5 rounded-xl text-[#C3CEDF] hover:bg-[#16213A] hover:text-white flex items-center justify-between"
              >
                <span>{t.nav.formula}</span>
                {language === 'en' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="w-full p-2.5 rounded-xl text-[#C3CEDF] hover:bg-[#16213A] hover:text-white flex items-center justify-between"
              >
                <span>{t.nav.faq}</span>
                {language === 'en' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            </div>

            {/* Audio Toggle Control in Mobile Menu */}
            <div className="pt-2 border-t border-[#1A2440] flex items-center justify-between p-2.5 rounded-xl bg-[#0B1222] border border-[#1E2A44]">
              <div className="flex items-center gap-2 text-xs text-[#C3CEDF]">
                {isSoundMuted ? <VolumeX size={16} className="text-rose-400 shrink-0" /> : <Volume2 size={16} className="text-teal-400 shrink-0" />}
                <span className="font-medium">{isSoundMuted ? (language === 'en' ? 'Sound: Muted' : 'المؤثرات الصوتية: مكتومة') : (language === 'en' ? 'Sound: Active' : 'المؤثرات الصوتية: مفعّلة')}</span>
              </div>
              <button
                type="button"
                onClick={toggleSound}
                className="px-3 py-1 rounded-lg text-xs font-bold border border-[#22304D] bg-[#16213A] text-white hover:bg-blue-600 transition-colors cursor-pointer"
              >
                {isSoundMuted ? (language === 'en' ? 'Unmute' : 'تشغيل') : (language === 'en' ? 'Mute' : 'كتم')}
              </button>
            </div>

            <div className="pt-2 border-t border-[#1A2440] flex gap-2">
              <button
                onClick={handleTriggerReportFault}
                className="flex-1 h-10 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <AlertTriangle size={15} />
                <span>{t.nav.reportFault}</span>
              </button>
              <button
                onClick={() => {
                  soundManager.playButtonClick();
                  setCurrentPage('dashboard');
                }}
                className="flex-1 h-10 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
              >
                {t.hero.livePlatform}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION WITH EXACT SVG STAR PATTERN & REALISTIC APP MOCKUP */}
      <section id="top" className="relative pt-16 sm:pt-24 pb-20 px-4 sm:px-6 overflow-hidden section-reveal is-visible z-10">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center gap-6 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-300 text-xs sm:text-sm font-semibold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#34D399] pulse-critical" />
            <span>{t.hero.badge}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.25] sm:leading-[1.2]">
            {t.hero.title1}<br />
            <span className="grad font-extrabold">{t.hero.title2}</span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-xl text-[#A3B1C6] max-w-3xl leading-relaxed">
            {t.hero.desc}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
            <ShinyButton
              label={t.hero.startFree}
              onClick={() => {
                setCurrentPage('signup');
              }}
              cornerRadius={14}
              className="h-13 px-8 text-base font-bold shadow-xl"
              accentColor="#2563EB"
              accentSoftColor="#22C7B8"
              icon={<ArrowLeft size={18} className={language === 'en' ? 'rotate-180' : ''} />}
            />
            <button
              onClick={() => scrollToSection('journey')}
              className="h-13 px-6 rounded-xl border border-[#26324A] bg-[#0F1729]/80 backdrop-blur-sm text-white font-semibold text-base hover:border-blue-500/60 hover:bg-[#121C33] transition-all flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Play size={16} className="text-blue-400 fill-blue-400" />
              <span>{t.hero.watchDemo}</span>
            </button>
          </div>

          <div className="text-xs text-[#8696AE] pt-1">
            {t.hero.subNote}
          </div>

          {/* Product Frame Mockup */}
          <div className="w-full max-w-5xl mt-10 rounded-2xl border border-[#26324A] bg-[#0B1222]/90 backdrop-blur-md shadow-2xl overflow-hidden shadow-blue-900/20">
            {/* Top Mockup Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A2440] bg-[#0D1526]/90">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="mono text-xs text-[#8696AE]">{t.hero.mockupUrl}</span>
              <button
                onClick={() => {
                  soundManager.playButtonClick();
                  setCurrentPage('dashboard');
                }}
                className="text-xs text-blue-400 hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>{t.hero.livePlatform}</span>
                <ExternalLink size={12} />
              </button>
            </div>

            {/* Inner Dashboard Frame */}
            <div className="flex min-h-[420px]">
              {/* Mini Sidebar */}
              <div className={`w-48 bg-[#0E162A]/90 p-4 hidden sm:flex flex-col gap-1 text-xs ${
                language === 'en' ? 'border-r border-[#1A2440] text-left' : 'border-l border-[#1A2440] text-right'
              }`}>
                <button 
                  onClick={() => { soundManager.playButtonClick(); setCurrentPage('dashboard'); }}
                  className={`w-full p-2.5 rounded-lg bg-gradient-to-r from-blue-600/30 to-teal-500/20 text-white font-semibold ${
                    language === 'en' ? 'text-left border-l-2 border-[#34D399]' : 'text-right border-r-2 border-[#34D399]'
                  }`}
                >
                  {t.hero.dashboardNav}
                </button>
                <button 
                  onClick={() => { soundManager.playButtonClick(); setCurrentPage('assets'); }} 
                  className={`w-full p-2.5 rounded-lg text-[#A3B1C6] hover:bg-[#16213A] hover:text-white ${
                    language === 'en' ? 'text-left' : 'text-right'
                  }`}
                >
                  {t.hero.assetsNav}
                </button>
                <button 
                  onClick={() => { soundManager.playButtonClick(); setCurrentPage('sites'); }} 
                  className={`w-full p-2.5 rounded-lg text-[#A3B1C6] hover:bg-[#16213A] hover:text-white ${
                    language === 'en' ? 'text-left' : 'text-right'
                  }`}
                >
                  {t.hero.sitesNav}
                </button>
                <button 
                  onClick={() => { soundManager.playButtonClick(); setCurrentPage('services'); }} 
                  className={`w-full p-2.5 rounded-lg text-[#A3B1C6] hover:bg-[#16213A] hover:text-white ${
                    language === 'en' ? 'text-left' : 'text-right'
                  }`}
                >
                  {t.hero.servicesNav}
                </button>
                <button 
                  onClick={() => { soundManager.playButtonClick(); setCurrentPage('work-orders'); }} 
                  className={`w-full p-2.5 rounded-lg text-[#A3B1C6] hover:bg-[#16213A] hover:text-white flex justify-between ${
                    language === 'en' ? 'text-left' : 'text-right'
                  }`}
                >
                  <span>{t.hero.workOrdersNav}</span>
                  <span className="text-amber-400 mono">18</span>
                </button>
                <button 
                  onClick={() => { soundManager.playButtonClick(); setCurrentPage('preventive'); }} 
                  className={`w-full p-2.5 rounded-lg text-[#A3B1C6] hover:bg-[#16213A] hover:text-white ${
                    language === 'en' ? 'text-left' : 'text-right'
                  }`}
                >
                  {t.hero.preventiveNav}
                </button>
              </div>

              {/* Main Content inside Mockup */}
              <div className={`flex-1 p-5 sm:p-6 space-y-4 ${language === 'en' ? 'text-left' : 'text-right'}`}>
                {/* 4 KPIs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#101A2E]/90 border border-[#1E2A44]">
                    <div className="text-xs text-[#A3B1C6]">{t.hero.operationalAssets}</div>
                    <div className="mono text-2xl font-bold text-white mt-0.5">94%</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#101A2E]/90 border border-rose-500/40">
                    <div className="text-xs text-[#A3B1C6]">{t.hero.criticalServicesAtRisk}</div>
                    <div className="mono text-2xl font-bold text-rose-400 mt-0.5">1</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#101A2E]/90 border border-[#1E2A44]">
                    <div className="text-xs text-[#A3B1C6]">{t.hero.openWorkOrders}</div>
                    <div className="mono text-2xl font-bold text-white mt-0.5">18</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#101A2E]/90 border border-[#1E2A44]">
                    <div className="text-xs text-[#A3B1C6]">{t.hero.overduePm}</div>
                    <div className="mono text-2xl font-bold text-amber-400 mt-0.5">3</div>
                  </div>
                </div>

                {/* Urgent Attention Items with Direct Action */}
                <div className="p-4 rounded-xl bg-[#101A2E]/90 border border-[#1E2A44] space-y-2.5">
                  <div className="flex justify-between items-center text-xs font-semibold pb-1">
                    <span className="text-white">{t.hero.needsAttention}</span>
                    <span className="text-[#8696AE] font-normal">{t.hero.rankedByImpact}</span>
                  </div>

                  {/* Interactive Urgent item 1: opens Report Fault Drawer */}
                  <div 
                    onClick={handleTriggerReportFault}
                    className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/35 hover:bg-rose-500/15 cursor-pointer transition-colors group"
                  >
                    <span className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-rose-400 mono bg-[#0F1729] shrink-0 border border-rose-500/50">
                      86
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs sm:text-sm text-white group-hover:text-rose-300 transition-colors">
                        {t.hero.pumpTitle}
                      </div>
                      <div className="text-[11px] text-[#A3B1C6]">{t.hero.pumpDesc}</div>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-rose-500 text-slate-950 font-bold shrink-0 flex items-center gap-1 shadow-sm">
                      <AlertTriangle size={12} />
                      <span>{t.hero.pumpAction}</span>
                    </span>
                  </div>

                  <div 
                    onClick={() => { soundManager.playButtonClick(); setCurrentPage('work-orders'); }}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-[#0D1526] border border-[#1A2440] hover:bg-[#16213A] cursor-pointer transition-colors"
                  >
                    <span className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-amber-400 mono bg-[#0F1729] shrink-0 border border-amber-500/40">
                      58
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs sm:text-sm text-white">{t.hero.genTitle}</div>
                      <div className="text-[11px] text-[#A3B1C6]">{t.hero.genDesc}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold shrink-0">
                      {t.hero.statusMaintenance}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VALUE STRIP (4 Core Values) - Seamless Glassmorphic Strip */}
      <section aria-label={language === 'en' ? 'Core Values' : 'أهم القيم'} className="border-y border-[#1E2A44]/70 bg-[#0B1325]/75 backdrop-blur-md relative z-10 section-reveal">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 ltr:sm:divide-x rtl:sm:divide-x-reverse divide-[#1E2A44]/70">
          <div className="p-6 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
            <span className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/25 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/10">
              <Box size={22} />
            </span>
            <div>
              <b className="block font-bold text-white text-base">{t.values.v1Title}</b>
              <span className="text-xs sm:text-sm text-[#A3B1C6]">{t.values.v1Sub}</span>
            </div>
          </div>

          <div className="p-6 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
            <span className="w-12 h-12 rounded-2xl bg-teal-500/15 text-teal-400 border border-teal-500/25 flex items-center justify-center shrink-0 shadow-lg shadow-teal-500/10">
              <TrendingUp size={22} />
            </span>
            <div>
              <b className="block font-bold text-white text-base">{t.values.v2Title}</b>
              <span className="text-xs sm:text-sm text-[#A3B1C6]">{t.values.v2Sub}</span>
            </div>
          </div>

          <div className="p-6 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
            <span className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 size={22} />
            </span>
            <div>
              <b className="block font-bold text-white text-base">{t.values.v3Title}</b>
              <span className="text-xs sm:text-sm text-[#A3B1C6]">{t.values.v3Sub}</span>
            </div>
          </div>

          <div className="p-6 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
            <span className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/10">
              <Globe size={22} />
            </span>
            <div>
              <b className="block font-bold text-white text-base">{t.values.v4Title}</b>
              <span className="text-xs sm:text-sm text-[#A3B1C6]">{t.values.v4Sub}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PLATFORM BENTO SECTION */}
      <section id="platform" className="py-24 px-4 sm:px-6 relative z-10 section-reveal">
        {/* Ambient atmospheric backlight behind platform cards */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 bg-blue-600/10 blur-[130px] pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
              {t.platform.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {t.platform.title1} <span className="grad font-extrabold">{t.platform.title2}</span>
            </h2>
            <p className="text-sm sm:text-base text-[#A3B1C6] max-w-2xl leading-relaxed">
              {t.platform.desc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article className={`p-8 rounded-3xl bg-[#0F1729]/90 backdrop-blur-md border border-[#1E2A44] flex flex-col justify-between gap-6 card-glow-border ${
              language === 'en' ? 'text-left' : 'text-right'
            }`}>
              <div className="space-y-4">
                <span className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                  <Box size={24} />
                </span>
                <h3 className="text-xl font-bold text-white">{t.platform.c1Title}</h3>
                <p className="text-xs sm:text-sm text-[#A3B1C6] leading-relaxed">
                  {t.platform.c1Desc}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0B1222]/90 border border-[#1A2440] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="mono text-blue-400 font-bold">{t.platform.c1Code}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">
                    {language === 'en' ? 'Operational' : 'يعمل'}
                  </span>
                </div>
                <div className="font-bold text-white">{t.platform.c1Name}</div>
                <div className="pt-2 border-t border-[#1A2440] flex justify-between text-[#8696AE]">
                  <span>{t.platform.c1Mtbf}</span>
                  <span className="text-rose-400">{t.platform.c1Critical}</span>
                </div>
              </div>
            </article>

            <article className={`p-8 rounded-3xl bg-gradient-to-br from-rose-950/20 to-[#0F1729]/90 backdrop-blur-md border border-rose-500/30 flex flex-col justify-between gap-6 card-glow-border ${
              language === 'en' ? 'text-left' : 'text-right'
            }`}>
              <div className="space-y-4">
                <span className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <ShieldAlert size={24} />
                </span>
                <h3 className="text-xl font-bold text-white">{t.platform.c2Title}</h3>
                <p className="text-xs sm:text-sm text-[#A3B1C6] leading-relaxed">
                  {t.platform.c2Desc}
                </p>
              </div>

              <button
                onClick={() => { soundManager.playButtonClick(); setCurrentPage('services'); }}
                className="w-full py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold hover:bg-rose-500/25 transition-all text-center cursor-pointer"
              >
                {t.platform.c2Action}
              </button>
            </article>

            <article className={`p-8 rounded-3xl bg-[#0F1729]/90 backdrop-blur-md border border-[#1E2A44] flex flex-col justify-between gap-6 card-glow-border ${
              language === 'en' ? 'text-left' : 'text-right'
            }`}>
              <div className="space-y-4">
                <span className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
                  <Wrench size={24} />
                </span>
                <h3 className="text-xl font-bold text-white">{t.platform.c3Title}</h3>
                <p className="text-xs sm:text-sm text-[#A3B1C6] leading-relaxed">
                  {t.platform.c3Desc}
                </p>
              </div>

              <button
                onClick={() => { soundManager.playButtonClick(); setCurrentPage('work-orders'); }}
                className="w-full py-2.5 rounded-xl bg-[#16213A] border border-[#22304D] text-blue-400 text-xs font-bold hover:bg-[#1E2A44] transition-all text-center cursor-pointer"
              >
                {t.platform.c3Action}
              </button>
            </article>
          </div>
        </div>
      </section>

      {/* 6. OPERATIONAL PIPELINE (5 Spotlight GlowCards) + 4-STEP FIELD JOURNEY */}
      <section id="journey" className="py-24 px-4 sm:px-6 border-y border-[#1E2A44]/70 bg-[#0B1325]/70 backdrop-blur-md relative z-10 section-reveal">
        <div className="max-w-6xl mx-auto flex flex-col gap-14">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold mb-2">
              {t.journey.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              {t.journey.title}
            </h2>
            <p className="text-sm text-[#A3B1C6] mt-2">
              {t.journey.desc}
            </p>
          </div>

          {/* Interactive Steps Grid */}
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {journeyStepsData.map((step, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    soundManager.playCardSwitch();
                    setJourneyStep(idx);
                  }}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                    language === 'en' ? 'text-left' : 'text-right'
                  } ${
                    journeyStep === idx
                      ? 'bg-[#121E36] border-blue-500/60 shadow-xl shadow-blue-950/40 ring-1 ring-blue-500/30'
                      : 'bg-[#0D1526]/85 backdrop-blur-sm border-[#1E2A44] hover:border-[#2A3E6A] opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="mono text-2xl font-black text-blue-400">{step.num}</span>
                    {journeyStep === idx && (
                      <span className="w-2 h-2 rounded-full bg-[#34D399] pulse-critical" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  <div className="text-xs text-[#8696AE] mt-0.5 font-medium">{step.sub}</div>
                  <p className="text-xs text-[#A3B1C6] mt-3 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Interactive Step Preview Detail Card */}
            <div className={`p-6 sm:p-8 rounded-3xl bg-[#0F1729]/90 backdrop-blur-md border border-[#22304D] space-y-4 shadow-2xl ${
              language === 'en' ? 'text-left' : 'text-right'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1A2440]">
                <div className="flex items-center gap-2">
                  <span className="mono font-bold text-sm text-blue-400">{t.journey.stepPrefix} {journeyStepsData[journeyStep].num}:</span>
                  <span className="font-bold text-white text-base">{journeyStepsData[journeyStep].title}</span>
                </div>
                <span className="text-xs text-[#8696AE]">{journeyStepsData[journeyStep].sub}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {journeyStepsData[journeyStep].items.map((item, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[#0B1222]/90 border border-[#1A2440] flex items-center justify-between gap-3 text-xs">
                    <span className="font-semibold text-white truncate">{item.name}</span>
                    <span className={`mono font-bold shrink-0 ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECTORS SECTION (4 Interactive Tabs) */}
      <section id="sectors" className="py-24 px-4 sm:px-6 relative z-10 section-reveal">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-3">
              {t.sectors.tag}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight text-balance">
              {t.sectors.title}
            </h2>
          </div>

          {/* Sector Tabs with Tactile Card Switch Sound */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {sectorsData.map((sec, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundManager.playCardSwitch();
                  setSelectedSector(idx);
                }}
                className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  selectedSector === idx
                    ? 'bg-white text-[#0B1222] shadow-lg shadow-white/10 scale-105'
                    : 'bg-[#0D1526]/85 backdrop-blur-sm text-[#C3CEDF] border border-[#22304D] hover:text-white hover:border-blue-500/40'
                }`}
              >
                {sec.name}
              </button>
            ))}
          </div>

          {/* Sector Display Card */}
          <div className={`p-6 sm:p-10 rounded-3xl bg-[#0F1729]/90 backdrop-blur-md border border-[#1E2A44] grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-2xl card-glow-border ${
            language === 'en' ? 'text-left' : 'text-right'
          }`}>
            <div className="md:col-span-7 space-y-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {sectorsData[selectedSector].title}
              </h3>
              <p className="text-sm sm:text-base text-[#A3B1C6] leading-relaxed">
                {sectorsData[selectedSector].desc}
              </p>

              <div>
                <div className="text-xs font-bold text-[#8696AE] mb-2">{t.sectors.typicalAssets}</div>
                <div className="flex flex-wrap gap-2">
                  {sectorsData[selectedSector].assets.map((asset, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-[#101A2E]/90 border border-[#22304D] text-[#E6EDF7]">
                      {asset}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Protected Services Box */}
            <div className="md:col-span-5 p-5 sm:p-6 rounded-2xl bg-[#0A1020]/90 border border-[#1A2440] space-y-3">
              <div className="text-xs font-bold text-[#8696AE]">{t.sectors.protectedServices}</div>
              <div className="space-y-2">
                {sectorsData[selectedSector].services.map((srv, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#101A2E]/80 text-xs font-medium text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] shadow-sm shrink-0" />
                    <span>{srv}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. AI SECTION (Realistic Colloquial Diagnostic Card with Action) */}
      <section id="ai" className="py-24 px-4 sm:px-6 border-y border-[#1E2A44]/70 bg-[#0B1325]/70 backdrop-blur-md relative z-10 section-reveal">
        <div className={`max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
          language === 'en' ? 'text-left' : 'text-right'
        }`}>
          {/* Explanation (Col 6) */}
          <div className="lg:col-span-6 space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold">
              {t.ai.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {t.ai.title1}<br />
              <span className="grad font-extrabold">{t.ai.title2}</span>
            </h2>
            <p className="text-sm sm:text-base text-[#A3B1C6] leading-relaxed">
              {t.ai.desc}
            </p>

            <div className="space-y-3 pt-3">
              <div className="flex items-center gap-3 text-sm text-white font-medium">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check size={18} />
                </span>
                <span>{t.ai.f1}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white font-medium">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check size={18} />
                </span>
                <span>{t.ai.f2}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white font-medium">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check size={18} />
                </span>
                <span>{t.ai.f3}</span>
              </div>
            </div>
          </div>

          {/* AI Live Diagnostic Mockup (Col 6) */}
          <div className="lg:col-span-6 space-y-3">
            {/* Operator Report Card */}
            <div className="p-4 rounded-xl bg-[#0F1729]/90 border border-[#1E2A44] space-y-1">
              <div className="text-xs text-[#8696AE]">{t.ai.operatorReportLabel}</div>
              <div className="text-sm font-semibold text-white">
                "{activeSymptom}"
              </div>
            </div>

            {/* AI Diagnosis Result */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-900/35 via-teal-900/25 to-[#0F1729]/95 border border-[#2A3E6A] space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#1E2A44]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#6EE7B7]">
                  <Sparkles size={16} />
                  <span>{t.ai.aiBadge}</span>
                </div>
                <span className="text-[11px] mono text-blue-400">GPT-4o Diagnostic Engine</span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between py-1 border-b border-[#1A2440]">
                  <span className="text-[#A3B1C6]">{t.ai.catLabel}</span>
                  <span className="font-semibold text-white">{activeCategory}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A2440]">
                  <span className="text-[#A3B1C6]">{t.ai.severityLabel}</span>
                  <span className="font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                    {aiSeverity === 'high' ? (language === 'en' ? 'High Risk' : 'عالية الخطورة') : aiSeverity === 'medium' ? (language === 'en' ? 'Medium' : 'متوسطة') : (language === 'en' ? 'Low' : 'منخفضة')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A2440]">
                  <span className="text-[#A3B1C6]">{t.ai.causesLabel}</span>
                  <span className="font-medium text-white">{activeCauses}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1A2440]">
                  <span className="text-[#A3B1C6]">{t.ai.testsLabel}</span>
                  <span className="font-medium text-white">
                    {t.ai.testsDefault}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#A3B1C6]">{t.ai.priorityLabel}</span>
                  <span className="font-bold text-rose-400 mono text-base">
                    86 <span className="text-xs text-[#8696AE] font-normal">
                      {t.ai.priorityInterrupted}
                    </span>
                  </span>
                </div>
              </div>

              {/* Functional Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleTriggerReportFault}
                  className="flex-1 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-xs hover:brightness-110 shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Wrench size={14} />
                  <span>{t.ai.createOrderBtn}</span>
                </button>
                <button
                  onClick={() => {
                    soundManager.playButtonClick();
                    setIsEditAiModalOpen(true);
                  }}
                  className="h-10 px-4 rounded-xl border border-[#26324A] bg-[#0F1729] text-white text-xs font-semibold hover:bg-[#1E2A44] flex items-center gap-1.5 cursor-pointer"
                >
                  <Sliders size={14} />
                  <span>{t.ai.editAnalysisBtn}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. PORTALS (3 User Portals with Spotlight GlowCards) */}
      <section className="py-24 px-4 sm:px-6 relative z-10 section-reveal">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
              {t.portals.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">{t.portals.title}</h2>
            <p className="text-sm text-[#A3B1C6] mt-2">{t.portals.sub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Admin Portal GlowCard */}
            <GlowCard 
              glowColor="blue" 
              className={`flex flex-col justify-between gap-4 p-6 sm:p-7 cursor-pointer ${
                language === 'en' ? 'text-left' : 'text-right'
              }`}
              onClick={() => { switchRole('admin'); }}
            >
              <div className="relative z-10 space-y-4">
                <span className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shadow-sm">
                  <ShieldAlert size={24} />
                </span>
                <div>
                  <h3 className="font-bold text-xl text-white">{t.portals.adminTitle}</h3>
                  <p className="text-xs sm:text-sm text-[#A3B1C6] mt-2 leading-relaxed">
                    {t.portals.adminDesc}
                  </p>
                </div>
              </div>
              <div className="relative z-10 pt-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); switchRole('admin'); }} 
                  className="text-xs text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{t.portals.adminAction}</span>
                  {language === 'en' ? <ArrowLeft size={13} className="rotate-180" /> : <ArrowLeft size={13} />}
                </button>
              </div>
            </GlowCard>

            {/* Technician Portal GlowCard */}
            <GlowCard 
              glowColor="orange" 
              className={`flex flex-col justify-between gap-4 p-6 sm:p-7 cursor-pointer ${
                language === 'en' ? 'text-left' : 'text-right'
              }`}
              onClick={() => { switchRole('technician'); }}
            >
              <div className="relative z-10 space-y-4">
                <span className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shadow-sm">
                  <Wrench size={24} />
                </span>
                <div>
                  <h3 className="font-bold text-xl text-white">{t.portals.techTitle}</h3>
                  <p className="text-xs sm:text-sm text-[#A3B1C6] mt-2 leading-relaxed">
                    {t.portals.techDesc}
                  </p>
                </div>
              </div>
              <div className="relative z-10 pt-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); switchRole('technician'); }} 
                  className="text-xs text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{t.portals.techAction}</span>
                  {language === 'en' ? <ArrowLeft size={13} className="rotate-180" /> : <ArrowLeft size={13} />}
                </button>
              </div>
            </GlowCard>

            {/* Reporter Portal GlowCard */}
            <GlowCard 
              glowColor="green" 
              className={`flex flex-col justify-between gap-4 p-6 sm:p-7 cursor-pointer ${
                language === 'en' ? 'text-left' : 'text-right'
              }`}
              onClick={() => { switchRole('reporter'); }}
            >
              <div className="relative z-10 space-y-4">
                <span className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shadow-sm">
                  <Box size={24} />
                </span>
                <div>
                  <h3 className="font-bold text-xl text-white">{t.portals.reporterTitle}</h3>
                  <p className="text-xs sm:text-sm text-[#A3B1C6] mt-2 leading-relaxed">
                    {t.portals.reporterDesc}
                  </p>
                </div>
              </div>
              <div className="relative z-10 pt-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); switchRole('reporter'); }} 
                  className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{t.portals.reporterAction}</span>
                  {language === 'en' ? <ArrowLeft size={13} className="rotate-180" /> : <ArrowLeft size={13} />}
                </button>
              </div>
            </GlowCard>
          </div>
        </div>
      </section>

      {/* 10. INTERACTIVE PRIORITY FORMULA TESTER */}
      <section id="formula" className="py-24 px-4 sm:px-6 border-y border-[#1E2A44]/70 bg-[#0B1325]/70 backdrop-blur-md relative z-10 section-reveal">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-400 tracking-wider uppercase bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20 inline-flex items-center gap-1.5">
              {t.formula.tag}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-4 leading-tight tracking-tight flex flex-wrap items-center justify-center gap-2.5">
              <span>{t.formula.title}</span>
              {language === 'ar' ? (
                <span dir="ltr" className="text-base sm:text-xl font-bold text-blue-400/90 whitespace-nowrap bg-blue-500/10 border border-blue-500/25 px-2.5 py-0.5 rounded-lg inline-block">
                  (Explainable Priority)
                </span>
              ) : null}
            </h2>
            <p className="text-sm sm:text-base text-[#A3B1C6] mt-3 max-w-2xl mx-auto text-balance">
              {t.formula.desc}
            </p>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
            language === 'en' ? 'text-left' : 'text-right'
          }`}>
            {/* Sliders (Col 7) */}
            <div className="lg:col-span-7 bg-[#0F1729]/90 backdrop-blur-md border border-[#1E2A44] rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-white">{t.formula.s1Label}</label>
                  <span className="mono font-bold text-blue-400">+{calcServiceImpact}</span>
                </div>
                <input 
                  type="range" min="0" max="50" value={calcServiceImpact}
                  onChange={(e) => setCalcServiceImpact(Number(e.target.value))}
                  className="w-full accent-blue-600 bg-[#16213A] rounded-lg h-2 cursor-pointer"
                />
                <div className="text-xs text-[#8696AE] mt-1">{t.formula.s1Desc}</div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-white">{t.formula.s2Label}</label>
                  <span className="mono font-bold text-teal-400">+{calcNoBackup}</span>
                </div>
                <input 
                  type="range" min="0" max="40" value={calcNoBackup}
                  onChange={(e) => setCalcNoBackup(Number(e.target.value))}
                  className="w-full accent-teal-500 bg-[#16213A] rounded-lg h-2 cursor-pointer"
                />
                <div className="text-xs text-[#8696AE] mt-1">{t.formula.s2Desc}</div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-white">{t.formula.s3Label}</label>
                  <span className="mono font-bold text-amber-400">+{calcDelay}</span>
                </div>
                <input 
                  type="range" min="0" max="20" value={calcDelay}
                  onChange={(e) => setCalcDelay(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-[#16213A] rounded-lg h-2 cursor-pointer"
                />
                <div className="text-xs text-[#8696AE] mt-1">{t.formula.s3Desc}</div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-white">{t.formula.s4Label}</label>
                  <span className="mono font-bold text-purple-400">+{calcFailure}</span>
                </div>
                <input 
                  type="range" min="0" max="20" value={calcFailure}
                  onChange={(e) => setCalcFailure(Number(e.target.value))}
                  className="w-full accent-purple-500 bg-[#16213A] rounded-lg h-2 cursor-pointer"
                />
                <div className="text-xs text-[#8696AE] mt-1">{t.formula.s4Desc}</div>
              </div>
            </div>

            {/* Score Output Box (Col 5) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#101A2E]/90 to-[#0D1526]/90 border border-[#26324A] rounded-2xl p-8 flex flex-col items-center text-center gap-6 shadow-2xl backdrop-blur-md">
              <div className="text-xs font-semibold text-[#8696AE]">{t.formula.resultLabel}</div>
              
              <div className="relative w-36 h-36 rounded-full flex items-center justify-center bg-gradient-to-tr from-blue-600 via-teal-500 to-rose-500 p-1 shadow-2xl">
                <div className="w-full h-full bg-[#0F1729] rounded-full flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold text-white mono">{calcScore}</span>
                  <span className="text-[11px] text-[#8696AE]">{t.formula.outOf100}</span>
                </div>
              </div>

              <div>
                <div className={`text-sm font-bold px-4 py-1.5 rounded-full inline-block ${
                  calcScore >= 75 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  calcScore >= 50 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {calcScore >= 75 ? t.formula.criticalStatus :
                   calcScore >= 50 ? t.formula.highStatus :
                   t.formula.standardStatus}
                </div>
                <p className="text-xs text-[#A3B1C6] mt-3 leading-relaxed max-w-xs">
                  {calcScore >= 75 
                    ? t.formula.criticalText 
                    : t.formula.standardText}
                </p>
              </div>

              <button
                onClick={() => {
                  soundManager.playButtonClick();
                  setCurrentPage('settings');
                }}
                className="w-full py-2.5 rounded-xl border border-[#22304D] bg-[#16213A] text-xs font-semibold text-white hover:bg-[#1E2A44] transition-colors cursor-pointer"
              >
                {t.formula.settingsCta}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FAQ ACCORDION SECTION */}
      <section id="faq" className="py-24 px-4 sm:px-6 relative z-10 section-reveal">
        <div className={`max-w-4xl mx-auto ${language === 'en' ? 'text-left' : 'text-right'}`}>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
              {t.faq.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">{t.faq.title}</h2>
            <p className="text-sm text-[#A3B1C6] mt-2">{t.faq.sub}</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#0F1729]/90 backdrop-blur-md border border-[#1E2A44] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playCardSwitch();
                    setFaqOpen(faqOpen === idx ? null : idx);
                  }}
                  className={`w-full p-5 flex items-center justify-between gap-4 hover:text-white transition-colors cursor-pointer ${
                    language === 'en' ? 'text-left' : 'text-right'
                  }`}
                >
                  <span className="text-base font-bold text-white">{faq.q}</span>
                  <span 
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg transition-transform duration-200 shrink-0 ${
                      faqOpen === idx ? 'bg-blue-600 text-white rotate-45' : 'bg-[#16213A] text-[#E6EDF7]'
                    }`}
                  >
                    +
                  </span>
                </button>
                {faqOpen === idx && (
                  <div className="px-5 pb-5 text-sm text-[#A3B1C6] leading-relaxed border-t border-[#1A2440]/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. CALL TO ACTION BANNER WITH EXACT PATTERN */}
      <section className="py-24 px-4 sm:px-6 relative z-10 section-reveal">
        <div className="max-w-6xl mx-auto">
          <div className={`rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 relative overflow-hidden flex flex-wrap items-center justify-between gap-8 shadow-2xl ${
            language === 'en' ? 'text-left' : 'text-right'
          }`}>
            {/* Pattern SVG */}
            <svg aria-hidden="true" width="100%" height="100%" className="absolute inset-0 pointer-events-none opacity-25">
              <defs>
                <pattern id="cd" width="18" height="18" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.3" fill="#FFFFFF" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cd)" />
            </svg>

            <div className="max-w-xl space-y-2 relative z-10">
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                {t.cta.title}
              </h2>
              <p className="text-base text-blue-100">
                {t.cta.desc}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 relative z-10">
              <ShinyButton
                label={t.cta.startFreeBtn}
                onClick={() => {
                  setCurrentPage('signup');
                }}
                fillColor="#FFFFFF"
                labelColor="#0B1222"
                accentColor="#2563EB"
                accentSoftColor="#22C7B8"
                cornerRadius={12}
                className="h-12 px-7 text-sm font-bold shadow-xl"
              />
              <button
                onClick={() => {
                  soundManager.playButtonClick();
                  setCurrentPage('dashboard');
                }}
                className="h-12 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/40 font-semibold text-sm transition-all cursor-pointer"
              >
                {t.cta.liveDemoBtn}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 13. FOOTER WITH INTERACTIVE MOUSE HOVER ANIMATION & FULL HALFTONE WORDMARK */}
      <footer className="border-t border-[#1A2440] bg-[#050813]/95 backdrop-blur-xl overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-8 flex flex-col gap-10">
          
          <div className={`flex flex-wrap justify-between gap-10 ${language === 'en' ? 'text-left' : 'text-right'}`}>
            {/* Left Brand and Newsletter Block */}
            <div className="flex-1 min-w-[280px] max-w-md flex flex-col gap-3.5">
              <div 
                className="flex items-center gap-2.5 cursor-pointer group w-fit"
                onClick={() => scrollToSection('top')}
              >
                <img src="/mark.png" alt="AssetFlow" className="w-9 h-9 rounded-xl shadow-lg transition-transform group-hover:scale-105" />
                <span dir="ltr" className="font-bold text-2xl text-white">
                  Asset<span className="grad">Flow</span>
                </span>
              </div>
              
              <p className="text-sm text-[#A3B1C6] leading-relaxed">
                {t.footer.brandDesc}
              </p>

              {/* Newsletter subscription form */}
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm pt-1">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={t.footer.newsletterPlaceholder}
                  className={`flex-1 min-w-0 text-sm h-11 px-3.5 rounded-xl border border-[#22304D] bg-[#0D1526] text-white focus:border-blue-500 focus:outline-none transition-colors ${
                    language === 'en' ? 'text-left' : 'text-right'
                  }`}
                />
                <button
                  type="submit"
                  className="h-11 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-blue-600/30 transition-all shrink-0 cursor-pointer"
                >
                  {newsletterSubscribed ? t.footer.newsletterSubscribed : t.footer.newsletterBtn}
                </button>
              </form>
            </div>

            {/* 3 Columns Links with Rich Mouse Hover Animation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-14 text-sm">
              {/* Column 1: Platform */}
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-white mb-2 text-base">{t.footer.colSystem}</span>
                
                <button 
                  onMouseEnter={() => soundManager.playButtonClick()}
                  onClick={() => setCurrentPage('assets')} 
                  className="group flex items-center gap-2 text-[#A3B1C6] hover:text-white transition-all py-1.5 px-2.5 rounded-lg hover:bg-white/[0.04] cursor-pointer -mx-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.8)] shrink-0" />
                  <span className="transition-transform duration-300 rtl:group-hover:-translate-x-1.5 ltr:group-hover:translate-x-1.5 font-medium">
                    {t.nav.assets}
                  </span>
                </button>

                <button 
                  onMouseEnter={() => soundManager.playButtonClick()}
                  onClick={() => setCurrentPage('services')} 
                  className="group flex items-center gap-2 text-[#A3B1C6] hover:text-white transition-all py-1.5 px-2.5 rounded-lg hover:bg-white/[0.04] cursor-pointer -mx-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.8)] shrink-0" />
                  <span className="transition-transform duration-300 rtl:group-hover:-translate-x-1.5 ltr:group-hover:translate-x-1.5 font-medium">
                    {t.nav.services}
                  </span>
                </button>

                <button 
                  onMouseEnter={() => soundManager.playButtonClick()}
                  onClick={() => setCurrentPage('work-orders')} 
                  className="group flex items-center gap-2 text-[#A3B1C6] hover:text-white transition-all py-1.5 px-2.5 rounded-lg hover:bg-white/[0.04] cursor-pointer -mx-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.8)] shrink-0" />
                  <span className="transition-transform duration-300 rtl:group-hover:-translate-x-1.5 ltr:group-hover:translate-x-1.5 font-medium">
                    {t.nav.workOrders}
                  </span>
                </button>

                <button 
                  onMouseEnter={() => soundManager.playButtonClick()}
                  onClick={() => setCurrentPage('preventive')} 
                  className="group flex items-center gap-2 text-[#A3B1C6] hover:text-white transition-all py-1.5 px-2.5 rounded-lg hover:bg-white/[0.04] cursor-pointer -mx-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.8)] shrink-0" />
                  <span className="transition-transform duration-300 rtl:group-hover:-translate-x-1.5 ltr:group-hover:translate-x-1.5 font-medium">
                    {t.nav.preventive}
                  </span>
                </button>
              </div>

              {/* Column 2: Sectors */}
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-white mb-2 text-base">{t.footer.colSectors}</span>

                <button 
                  onMouseEnter={() => soundManager.playButtonClick()}
                  onClick={() => { setSelectedSector(0); scrollToSection('sectors'); }} 
                  className="group flex items-center gap-2 text-[#A3B1C6] hover:text-white transition-all py-1.5 px-2.5 rounded-lg hover:bg-white/[0.04] cursor-pointer -mx-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.8)] shrink-0" />
                  <span className="transition-transform duration-300 rtl:group-hover:-translate-x-1.5 ltr:group-hover:translate-x-1.5 font-medium">
                    {language === 'en' ? 'Water Utilities & Desalination' : 'محطات المياه والصرف الصحي'}
                  </span>
                </button>

                <button 
                  onMouseEnter={() => soundManager.playButtonClick()}
                  onClick={() => { setSelectedSector(1); scrollToSection('sectors'); }} 
                  className="group flex items-center gap-2 text-[#A3B1C6] hover:text-white transition-all py-1.5 px-2.5 rounded-lg hover:bg-white/[0.04] cursor-pointer -mx-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.8)] shrink-0" />
                  <span className="transition-transform duration-300 rtl:group-hover:-translate-x-1.5 ltr:group-hover:translate-x-1.5 font-medium">
                    {language === 'en' ? 'Hospitals & Healthcare' : 'المستشفيات والرعاية الصحية'}
                  </span>
                </button>

                <button 
                  onMouseEnter={() => soundManager.playButtonClick()}
                  onClick={() => { setSelectedSector(2); scrollToSection('sectors'); }} 
                  className="group flex items-center gap-2 text-[#A3B1C6] hover:text-white transition-all py-1.5 px-2.5 rounded-lg hover:bg-white/[0.04] cursor-pointer -mx-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.8)] shrink-0" />
                  <span className="transition-transform duration-300 rtl:group-hover:-translate-x-1.5 ltr:group-hover:translate-x-1.5 font-medium">
                    {language === 'en' ? 'Manufacturing & Industrial Hubs' : 'المصانع والمجمعات الصناعية'}
                  </span>
                </button>

                <button 
                  onMouseEnter={() => soundManager.playButtonClick()}
                  onClick={() => { setSelectedSector(3); scrollToSection('sectors'); }} 
                  className="group flex items-center gap-2 text-[#A3B1C6] hover:text-white transition-all py-1.5 px-2.5 rounded-lg hover:bg-white/[0.04] cursor-pointer -mx-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.8)] shrink-0" />
                  <span className="transition-transform duration-300 rtl:group-hover:-translate-x-1.5 ltr:group-hover:translate-x-1.5 font-medium">
                    {language === 'en' ? 'Universities & Campuses' : 'الجامعات والمرافق العامة'}
                  </span>
                </button>
              </div>

              {/* Column 3: Account & Support */}
              <div className="flex flex-col gap-1.5">
                <span className="font-bold text-white mb-2 text-base">{t.footer.colAccount}</span>

                <button 
                  onMouseEnter={() => soundManager.playButtonClick()}
                  onClick={() => setCurrentPage('login')} 
                  className="group flex items-center gap-2 text-[#A3B1C6] hover:text-white transition-all py-1.5 px-2.5 rounded-lg hover:bg-white/[0.04] cursor-pointer -mx-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.8)] shrink-0" />
                  <span className="transition-transform duration-300 rtl:group-hover:-translate-x-1.5 ltr:group-hover:translate-x-1.5 font-medium">
                    {t.nav.login}
                  </span>
                </button>

                <button 
                  onMouseEnter={() => soundManager.playButtonClick()}
                  onClick={() => setCurrentPage('signup')} 
                  className="group flex items-center gap-2 text-[#A3B1C6] hover:text-white transition-all py-1.5 px-2.5 rounded-lg hover:bg-white/[0.04] cursor-pointer -mx-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.8)] shrink-0" />
                  <span className="transition-transform duration-300 rtl:group-hover:-translate-x-1.5 ltr:group-hover:translate-x-1.5 font-medium">
                    {t.nav.startFree}
                  </span>
                </button>

                <button 
                  onMouseEnter={() => soundManager.playButtonClick()}
                  onClick={handleTriggerReportFault} 
                  className="group flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-all py-1.5 px-2.5 rounded-lg hover:bg-rose-500/10 cursor-pointer -mx-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 shadow-[0_0_8px_rgba(244,63,94,0.8)] shrink-0" />
                  <span className="transition-transform duration-300 rtl:group-hover:-translate-x-1.5 ltr:group-hover:translate-x-1.5 font-medium flex items-center gap-1.5">
                    <AlertTriangle size={13} />
                    <span>{t.nav.reportFault}</span>
                  </span>
                </button>

                <button 
                  onMouseEnter={() => soundManager.playButtonClick()}
                  onClick={() => scrollToSection('faq')} 
                  className="group flex items-center gap-2 text-[#A3B1C6] hover:text-white transition-all py-1.5 px-2.5 rounded-lg hover:bg-white/[0.04] cursor-pointer -mx-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0.8)] shrink-0" />
                  <span className="transition-transform duration-300 rtl:group-hover:-translate-x-1.5 ltr:group-hover:translate-x-1.5 font-medium">
                    {t.nav.faq}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Copyright & Legal Bar */}
          <div className="flex flex-wrap justify-between items-center gap-3 text-xs text-[#8696AE] border-t border-[#1A2440] pt-5">
            <span>{t.footer.copyright}</span>
            <div className="flex items-center gap-5">
              <button onClick={() => showToast(t.footer.privacy, language === 'en' ? '256-bit enterprise encryption' : 'بيانات منشأتك مشفرة بأمان 256-bit', 'info')} className="hover:text-white transition-colors cursor-pointer">
                {t.footer.privacy}
              </button>
              <button onClick={() => showToast(t.footer.terms, language === 'en' ? 'SLA 99.98% uptime guarantee' : 'اتفاقية ترخيص مستوى الخدمة SLA 99.9%', 'info')} className="hover:text-white transition-colors cursor-pointer">
                {t.footer.terms}
              </button>
              <button 
                onClick={() => scrollToSection('top')} 
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{t.footer.backToTop}</span>
              </button>
            </div>
          </div>

        </div>

        {/* BOTTOM HALFTONE INTERACTIVE CANVAS WORDMARK - EXPANDED TO FULL MAJESTIC FOOTER WIDTH */}
        <div className="w-full relative overflow-hidden mt-8 mb-4 pointer-events-auto">
          <HalftoneWordmark
            wordmark="assetflow"
            height="clamp(140px, 24vw, 440px)"
            dotGap={6}
            radius={95}
            crop={0}
            grain={0.35}
            useBrandGradient={true}
          />
        </div>
      </footer>

      {/* EDIT AI DIAGNOSTIC MODAL */}
      {isEditAiModalOpen && (
        <div dir={t.dir} className={`fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 ${
          language === 'en' ? 'text-left font-sans' : 'text-right font-arabic'
        }`}>
          <div 
            className="absolute inset-0 bg-[#03060E]/75 backdrop-blur-sm"
            onClick={() => setIsEditAiModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-[#0F1729] border border-[#26324A] rounded-2xl p-6 shadow-2xl space-y-5 animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A2440]">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Sparkles size={18} className="text-teal-400" />
                <span>{language === 'en' ? 'Adjust AI Diagnostic Model' : 'تعديل معايير التحليل الذكي'}</span>
              </div>
              <button 
                onClick={() => setIsEditAiModalOpen(false)}
                className="text-[#8696AE] hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-[#C3CEDF] mb-1">
                  {language === 'en' ? 'Technician description / Vernacular' : 'وصف العطل كما أورده الفني'}
                </label>
                <textarea
                  rows={2}
                  value={activeSymptom}
                  onChange={(e) => setCustomAiSymptom(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#0B1222] border border-[#26324A] text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#C3CEDF] mb-1">
                  {language === 'en' ? 'Suggested Classification' : 'التصنيف الهندسي'}
                </label>
                <input
                  type="text"
                  value={activeCategory}
                  onChange={(e) => setCustomAiCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#0B1222] border border-[#26324A] text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#C3CEDF] mb-1">
                  {language === 'en' ? 'Severity Level' : 'درجة الشدة'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAiSeverity('high')}
                    className={`py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      aiSeverity === 'high' ? 'bg-rose-500 text-white' : 'bg-[#0B1222] text-[#8696AE] border border-[#26324A]'
                    }`}
                  >
                    {language === 'en' ? 'High Risk' : 'عالية الخطورة'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiSeverity('medium')}
                    className={`py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      aiSeverity === 'medium' ? 'bg-amber-500 text-white' : 'bg-[#0B1222] text-[#8696AE] border border-[#26324A]'
                    }`}
                  >
                    {language === 'en' ? 'Medium' : 'متوسطة'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiSeverity('low')}
                    className={`py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      aiSeverity === 'low' ? 'bg-emerald-500 text-white' : 'bg-[#0B1222] text-[#8696AE] border border-[#26324A]'
                    }`}
                  >
                    {language === 'en' ? 'Low' : 'منخفضة'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#C3CEDF] mb-1">
                  {language === 'en' ? 'Potential Root Causes' : 'الأسباب المحتملة'}
                </label>
                <input
                  type="text"
                  value={activeCauses}
                  onChange={(e) => setCustomAiCauses(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#0B1222] border border-[#26324A] text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#1A2440]">
              <button
                type="button"
                onClick={() => {
                  soundManager.playSuccess();
                  setIsEditAiModalOpen(false);
                  showToast(
                    language === 'en' ? 'AI Diagnostic Model Updated' : 'تم تحديث معايير الذكاء الاصطناعي',
                    language === 'en' ? 'Changes saved and impact recalculated' : 'تم حفظ التعديلات وحساب الأثر بنجاح',
                    'success'
                  );
                }}
                className="flex-1 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-xs hover:brightness-110 cursor-pointer"
              >
                {language === 'en' ? 'Apply Changes' : 'تطبيق التعديلات'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditAiModalOpen(false)}
                className="h-10 px-4 rounded-xl border border-[#26324A] bg-[#16213A] text-[#8696AE] text-xs font-semibold cursor-pointer"
              >
                {language === 'en' ? 'Cancel' : 'إلغاء'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
