export type Language = 'ar' | 'en';

export interface TranslationDictionary {
  dir: 'rtl' | 'ltr';
  announcement: {
    tag: string;
    text: string;
    cta: string;
  };
  nav: {
    platform: string;
    assets: string;
    services: string;
    workOrders: string;
    preventive: string;
    journey: string;
    sectors: string;
    ai: string;
    formula: string;
    faq: string;
    reportFault: string;
    login: string;
    startFree: string;
    muteSound: string;
    unmuteSound: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    desc: string;
    startFree: string;
    watchDemo: string;
    subNote: string;
    mockupUrl: string;
    livePlatform: string;
    dashboardNav: string;
    assetsNav: string;
    sitesNav: string;
    servicesNav: string;
    workOrdersNav: string;
    preventiveNav: string;
    operationalAssets: string;
    criticalServicesAtRisk: string;
    openWorkOrders: string;
    overduePm: string;
    needsAttention: string;
    rankedByImpact: string;
    pumpTitle: string;
    pumpDesc: string;
    pumpAction: string;
    genTitle: string;
    genDesc: string;
    statusStopped: string;
    statusMaintenance: string;
    statusRunning: string;
  };
  values: {
    v1Title: string;
    v1Sub: string;
    v2Title: string;
    v2Sub: string;
    v3Title: string;
    v3Sub: string;
    v4Title: string;
    v4Sub: string;
  };
  platform: {
    tag: string;
    title1: string;
    title2: string;
    desc: string;
    c1Title: string;
    c1Desc: string;
    c1Code: string;
    c1Name: string;
    c1LastService: string;
    c1Mtbf: string;
    c1Critical: string;
    c2Title: string;
    c2Desc: string;
    c2Action: string;
    c3Title: string;
    c3Desc: string;
    c3Action: string;
  };
  journey: {
    tag: string;
    title: string;
    desc: string;
    stepPrefix: string;
  };
  sectors: {
    tag: string;
    title: string;
    typicalAssets: string;
    protectedServices: string;
  };
  ai: {
    tag: string;
    title1: string;
    title2: string;
    desc: string;
    f1: string;
    f2: string;
    f3: string;
    operatorReportLabel: string;
    symptomDefault: string;
    categoryDefault: string;
    causesDefault: string;
    testsDefault: string;
    priorityInterrupted: string;
    aiBadge: string;
    catLabel: string;
    severityLabel: string;
    causesLabel: string;
    testsLabel: string;
    priorityLabel: string;
    createOrderBtn: string;
    editAnalysisBtn: string;
  };
  portals: {
    tag: string;
    title: string;
    sub: string;
    adminTitle: string;
    adminDesc: string;
    adminAction: string;
    techTitle: string;
    techDesc: string;
    techAction: string;
    reporterTitle: string;
    reporterDesc: string;
    reporterAction: string;
  };
  formula: {
    tag: string;
    title: string;
    desc: string;
    s1Label: string;
    s1Desc: string;
    s2Label: string;
    s2Desc: string;
    s3Label: string;
    s3Desc: string;
    s4Label: string;
    s4Desc: string;
    resultLabel: string;
    outOf100: string;
    criticalStatus: string;
    highStatus: string;
    standardStatus: string;
    criticalText: string;
    standardText: string;
    settingsCta: string;
  };
  faq: {
    tag: string;
    title: string;
    sub: string;
  };
  cta: {
    title: string;
    desc: string;
    startFreeBtn: string;
    liveDemoBtn: string;
  };
  footer: {
    brandDesc: string;
    newsletterTitle: string;
    newsletterDesc: string;
    newsletterPlaceholder: string;
    newsletterBtn: string;
    newsletterSubscribed: string;
    colSystem: string;
    colSectors: string;
    colAccount: string;
    copyright: string;
    privacy: string;
    terms: string;
    backToTop: string;
  };
  sidebar: {
    sectionMain: string;
    dashboard: string;
    issues: string;
    reportIssue: string;
    myIssues: string;
    techPortal: string;
    techAssets: string;
    profile: string;
    sectionOps: string;
    assets: string;
    sites: string;
    services: string;
    workOrders: string;
    preventive: string;
    sectionAdmin: string;
    team: string;
    reports: string;
    settings: string;
    audit: string;
    activeFacility: string;
    facilityName: string;
    setupProgress: string;
    nextStepPrefix: string;
    setupDone: string;
  };
  dashboard: {
    date: string;
    greeting: string;
    summaryPrefix: string;
    summaryMid: string;
    summarySuffix: string;
    reportFault: string;
    registerAsset: string;
    criticalAlertTitle: string;
    criticalAlertDesc: string;
    openWorkOrder: string;
    kpiOperational: string;
    kpiOf: string;
    kpiServices: string;
    kpiAtRisk: string;
    kpiWorkOrders: string;
    kpiOverdue: string;
    kpiAvgClose: string;
    kpiPm: string;
    kpiScheduled: string;
    kpiNearest: string;
    needsAttentionTitle: string;
    needsAttentionSub: string;
    filterAll: string;
    filterFaults: string;
    filterPm: string;
    item1Name: string;
    item1Desc: string;
    item1Btn: string;
    item2Name: string;
    item2Desc: string;
    item2Btn: string;
    item3Name: string;
    item3Desc: string;
    item3Btn: string;
    servicesHealthTitle: string;
    servicesCount: string;
    statusStable: string;
    statusNoAssets: string;
    statusNoBackup: string;
    viewServicesMatrix: string;
    assetsBySiteTitle: string;
    manageSites: string;
    assetsCount: string;
    legendOperational: string;
    legendMaintenance: string;
    legendStopped: string;
    setupTitle: string;
    stepTitles: Record<string, string>;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  ar: {
    dir: 'rtl',
    announcement: {
      tag: 'جديد',
      text: 'تحليل الأعطال بالذكاء الاصطناعي وحساب الأولويات الذكية متاح الآن لجميع المنشآت.',
      cta: 'اعرف كيف يعمل ←',
    },
    nav: {
      platform: 'المنصة',
      assets: 'سجل الأصول',
      services: 'الخدمات الحرجة',
      workOrders: 'أوامر العمل',
      preventive: 'الصيانة الوقائية',
      journey: 'كيف يعمل',
      sectors: 'القطاعات',
      ai: 'الذكاء الاصطناعي',
      formula: 'معادلة الأولوية',
      faq: 'الأسئلة',
      reportFault: 'إبلاغ عن عطل',
      login: 'تسجيل الدخول',
      startFree: 'ابدأ مجانًا',
      muteSound: 'كتم أصوات التفاعل',
      unmuteSound: 'تفعيل أصوات التفاعل',
    },
    hero: {
      badge: 'منصة CMMS عربية مدعومة بالذكاء الاصطناعي',
      title1: 'اعرف أي عطل يوقف خدماتك الحيوية،',
      title2: 'وأصلحه أولًا.',
      desc: 'AssetFlow يجمع سجل الأصول، أوامر العمل، والصيانة الوقائية في منصة واحدة — ويربط كل معدة بالخدمة التي تعتمد عليها، فتعرف أثر العطل قبل أن تقرر.',
      startFree: 'ابدأ تجربة مجانية · 7 أيام',
      watchDemo: 'شاهد كيف يعمل',
      subNote: 'بدون بطاقة ائتمان · إعداد خلال دقائق · واجهة عربية بالكامل',
      mockupUrl: 'app.assetflow.io/dashboard',
      livePlatform: 'دخول المنصة المباشرة',
      dashboardNav: 'لوحة القيادة',
      assetsNav: 'سجل الأصول',
      sitesNav: 'المواقع والمنشآت',
      servicesNav: 'الخدمات الحرجة',
      workOrdersNav: 'أوامر العمل',
      preventiveNav: 'الصيانة الوقائية',
      operationalAssets: 'الأصول العاملة',
      criticalServicesAtRisk: 'خدمات حرجة معرّضة',
      openWorkOrders: 'أوامر عمل مفتوحة',
      overduePm: 'صيانة وقائية متأخرة',
      needsAttention: 'يحتاج انتباهك الآن',
      rankedByImpact: 'مرتبة حسب أثر الخدمة',
      pumpTitle: 'مضخة الطرد المركزي #1 · محطة التحلية',
      pumpDesc: 'توقف تزويد المياه لغرف العمليات — اضغط لإصدار أمر عمل فوري',
      pumpAction: 'إبلاغ عن عطل',
      genTitle: 'المولد التوربيني 1500kVA',
      genDesc: 'الطاقة الاحتياطية · صيانة مستحقة',
      statusStopped: 'متوقف',
      statusMaintenance: 'صيانة',
      statusRunning: 'يعمل',
    },
    values: {
      v1Title: 'سجل موحّد',
      v1Sub: 'لكل أصل في كل موقع',
      v2Title: 'أولوية حسب الأثر',
      v2Sub: 'لا حسب وقت البلاغ',
      v3Title: 'حتى التحقق',
      v3Sub: 'لا يُغلق عمل دون تأكيد',
      v4Title: 'عربي أولًا',
      v4Sub: 'RTL كامل + الإنجليزية',
    },
    platform: {
      tag: 'المنصة',
      title1: 'أكثر من برنامج صيانة —',
      title2: 'نظام قرار للأصول والخدمات الحرجة.',
      desc: 'كل وحدة مبنية حول سؤال جوهري واحد: ما الذي يجب إصلاحه الآن، ولماذا؟',
      c1Title: 'إدارة دورة حياة الأصل',
      c1Desc: 'من التسجيل وكود QR حتى الإحلال: الموقع، الحالة، المواصفات، وتاريخ كل عطل وإصلاح وتكلفته.',
      c1Code: 'AST-PUMP-101',
      c1Name: 'مضخة الطرد المركزي #1',
      c1LastService: 'آخر صيانة: قبل 12 يومًا',
      c1Mtbf: 'MTBF: 1,840 ساعة',
      c1Critical: '1 خدمة حرجة',
      c2Title: 'مصفوفة الخدمات الحرجة',
      c2Desc: 'اربط كل أصل بالخدمة الحيوية التي يقدمها، فيظهر أثر أي عطل فورًا على حياة المواطنين وعمليات المنشأة.',
      c2Action: 'استعراض مصفوفة الاعتمادية ←',
      c3Title: 'توجيه وأتمتة المهام الميدانية',
      c3Desc: 'أوامر عمل ذكية تُسند للفني الأنسب مع قطع الغيار المحجوزة وقائمة الفحوصات قبل إغلاق البلاغ.',
      c3Action: 'استعراض أوامر العمل المباشرة ←',
    },
    journey: {
      tag: 'رحلة النظام الميدانية',
      title: 'من التسجيل حتى التحقق النهائي: في أربع خطوات.',
      desc: 'طريقة عمل واضحة وشفافة تمكّن فريقك من ضبط جميع الأصول والمعدات بسرعة قياسية.',
      stepPrefix: 'الخطوة',
    },
    sectors: {
      tag: 'القطاعات الحيوية',
      title: 'صُممت للمنشآت التي لا تحتمل توقف العمليات.',
      typicalAssets: 'أصول نموذجية في هذا القطاع:',
      protectedServices: 'الخدمات الحرجة التي نحميها:',
    },
    ai: {
      tag: 'الذكاء الاصطناعي التشغيلي',
      title1: 'يشخّص العطل في ثوانٍ.',
      title2: 'والقرار يبقى لفريقك.',
      desc: 'يكتب المُبلِّغ ما يراه بكلماته ولهجته الطبيعية، فيعيد النظام تصنيفًا وشدة وأسبابًا محتملة وفحوصات مقترحة. الأولوية تُحسب بقواعد شفافة يمكن لمدير الصيانة مراجعتها وتعديلها.',
      f1: 'يقترح ولا يقرر وحده — القرار النهائي للمهندس',
      f2: 'يتعلم من سجل أعطال المعدة السابقة وتاريخ تشغيلها',
      f3: 'يفهم اللهجات العربية الميدانية والمصطلحات الفنية',
      operatorReportLabel: 'بلاغ من: مُبلِّغ تشغيلي · محطة تحلية المياه',
      symptomDefault: 'المضخة صوتها عالي وحرارتها مرتفعة، والضغط ينزل بعد ربع ساعة تشغيل.',
      categoryDefault: 'ميكانيكي — محامل وهيدروليك',
      causesDefault: 'تآكل المحامل · ضعف التزييت · خلل مانع التسرب',
      testsDefault: 'قياس الاهتزاز (Vibration)، فحص مستوى الزيت',
      priorityInterrupted: '— تزويد مياه العمليات متوقف',
      aiBadge: 'تحليل AssetFlow AI · خلال 3 ثوانٍ',
      catLabel: 'التصنيف المقترح:',
      severityLabel: 'درجة الشدة:',
      causesLabel: 'الأسباب المحتملة:',
      testsLabel: 'الفحوصات المطلوبة:',
      priorityLabel: 'الأولوية المحسوبة:',
      createOrderBtn: 'إنشاء أمر عمل فوري',
      editAnalysisBtn: 'تعديل التحليل',
    },
    portals: {
      tag: 'لكل دور تجربته',
      title: 'ثلاث بوابات، حساب واحد.',
      sub: 'يُوجَّه كل مستخدم تلقائيًا إلى واجهته حسب صلاحياته المعتمدة.',
      adminTitle: 'مدير المنظمة',
      adminDesc: 'الأولويات، الأصول، الخدمات، الفريق، ونموذج الأولوية والتقارير المالية والتشغيلية — على الويب.',
      adminAction: 'استعراض بوابة الإدارة',
      techTitle: 'فني الصيانة الميداني',
      techDesc: 'مهامي اليوم مرتبة حسب الأولوية، الفحوصات المقترحة، طلب قطع الغيار وتوثيق الإصلاح — على الجوال.',
      techAction: 'استعراض لوحة المهام',
      reporterTitle: 'المُبلِّغ التشغيلي',
      reporterDesc: 'امسح رمز QR الملصق على الأصل بكاميرا الهاتف، اكتب ما تراه بكلماتك، وتابع حالة البلاغ لحظة بلحظة.',
      reporterAction: 'تجربة مسح وبلاغ',
    },
    formula: {
      tag: 'معادلة الأولوية الذكية',
      title: 'نموذج الأولوية القابل للتفسير',
      desc: 'حرّك أشرطة التمرير لمشاهدة كيف تؤثر المعايير الأربعة على ترتيب أوامر العمل في المنظومة:',
      s1Label: '1. أثر الخدمة الحرجة (Service Impact)',
      s1Desc: 'ما مدى حيوية الخدمة المتأثرة بتعطل هذا الأصل؟',
      s2Label: '2. غياب البديل الاحتياطي (No Redundancy)',
      s2Desc: 'هل تعمل المحطة على مضخة واحدة وحيدة بلا مضخة بديلة؟',
      s3Label: '3. التأخر عن اتفاقية الاستجابة (SLA Delay)',
      s3Desc: 'تراكم الساعات المهدورة بعد تجاوز المهلة المحددة',
      s4Label: '4. تكرار الأعطال السابقة (Failure Recurrence)',
      s4Desc: 'تاريخ الأعطال السابقة للمعدة في آخر 90 يومًا',
      resultLabel: 'النتيجة المحسوبة المباشرة',
      outOf100: 'من 100',
      criticalStatus: 'أولوية حرجة جدًا (استجابة خلال 4 ساعات)',
      highStatus: 'أولوية عالية (استجابة خلال 24 ساعة)',
      standardStatus: 'أولوية معيارية (استجابة خلال 3 أيام)',
      criticalText: 'عطل حرج يهدد الخدمة العامة مباشرة دون بديل احتياطي. يتم إرسال تنبيه فوري للفني الأول.',
      standardText: 'عطل تحت السيطرة مع وجود حلول مؤقتة أو استقرار في الخدمات الحرجة.',
      settingsCta: 'تخصيص الأوزان في لوحة الإعدادات ←',
    },
    faq: {
      tag: 'الأسئلة الشائعة',
      title: 'قبل أن تبدأ.',
      sub: 'إجابات واضحة ومباشرة عن منصة AssetFlow',
    },
    cta: {
      title: 'جاهز تعرف ما الذي يُصلَح أولًا؟',
      desc: 'ابدأ تجربتك المجانية لمدة 7 أيام، أو استكشف المنصة الحية مباشرة بسيناريو منشأتك.',
      startFreeBtn: 'ابدأ مجانًا',
      liveDemoBtn: 'دخول المنصة مباشرة',
    },
    footer: {
      brandDesc: 'منصة عربية ذكية لإدارة الأصول، أوامر العمل، والخدمات الحيوية وفق معايير الاعتمادية الهندسية.',
      newsletterTitle: 'النشرة الهندسية لأفضل ممارسات الصيانة (CMMS Insights)',
      newsletterDesc: 'أرسل بريدك للحصول على أحدث أساليب تشخيص الأعطال وتقليل فترات التوقف غير المخطط.',
      newsletterPlaceholder: 'name@company.com',
      newsletterBtn: 'اشترك',
      newsletterSubscribed: 'تم الاشتراك ✓',
      colSystem: 'المنظومة',
      colSectors: 'القطاعات',
      colAccount: 'الحساب والدعم',
      copyright: '© 2026 AssetFlow · جميع الحقوق محفوظة',
      privacy: 'الخصوصية',
      terms: 'الشروط والأحكام',
      backToTop: 'العودة للأعلى ↑',
    },
    sidebar: {
      sectionMain: 'الرئيسية',
      dashboard: 'لوحة القيادة',
      issues: 'بلاغات الأعطال',
      reportIssue: 'الإبلاغ عن عطل',
      myIssues: 'سجل بلاغاتي',
      techPortal: 'لوحتي والمهام',
      techAssets: 'أصول موقعي (عرض)',
      profile: 'ملفي الشخصي',
      sectionOps: 'العمليات',
      assets: 'سجل الأصول',
      sites: 'المواقع والمنشآت',
      services: 'الخدمات الحرجة',
      workOrders: 'أوامر العمل',
      preventive: 'الصيانة الوقائية',
      sectionAdmin: 'الإدارة',
      team: 'الفريق والصلاحيات',
      reports: 'التحليلات والتقارير',
      settings: 'الإعدادات ونموذج الأولوية',
      audit: 'سجل التدقيق والمراجعة',
      activeFacility: 'المنشأة النشطة',
      facilityName: 'مياه نابلس',
      setupProgress: 'اكتمال الإعداد',
      nextStepPrefix: 'التالي: ',
      setupDone: 'تهانينا! اكتمل إعداد المنشأة بالكامل',
    },
    dashboard: {
      date: 'الأربعاء، 21 أكتوبر 2026',
      greeting: 'صباح الخير، ',
      summaryPrefix: 'لديك عطل واحد يؤثر على خدمة حرجة، و',
      summaryMid: '',
      summarySuffix: ' أوامر عمل مفتوحة.',
      reportFault: 'إبلاغ عن عطل',
      registerAsset: 'تسجيل أصل جديد',
      criticalAlertTitle: 'خدمة حرجة معرّضة: تزويد مياه محطة التحلية',
      criticalAlertDesc: 'مضخة مياه الطرد المركزي #2 تحت الصيانة، والمضخة #1 تعمل وحدها بلا بديل احتياطي.',
      openWorkOrder: 'افتح أمر العمل (WO-849)',
      kpiOperational: 'الأصول العاملة',
      kpiOf: 'من',
      kpiServices: 'الخدمات الحرجة المستقرة',
      kpiAtRisk: 'معرّضة',
      kpiWorkOrders: 'أوامر العمل المفتوحة',
      kpiOverdue: 'متأخر',
      kpiAvgClose: 'متوسط الإغلاق 6 ساعات',
      kpiPm: 'صيانة وقائية هذا الأسبوع',
      kpiScheduled: 'مجدولة',
      kpiNearest: 'الأقرب: غدًا',
      needsAttentionTitle: 'يحتاج انتباهك',
      needsAttentionSub: 'مرتبة تنازليًا حسب أثرها على الخدمات الحرجة',
      filterAll: 'الكل',
      filterFaults: 'أعطال',
      filterPm: 'صيانة',
      item1Name: 'مضخة مياه الطرد المركزي #2',
      item1Desc: 'تحت الصيانة — خدمة التحلية تعمل بمضخة واحدة بلا بديل احتياطي',
      item1Btn: 'أمر العمل',
      item2Name: 'المولد الكهربائي التوربيني 1500kVA',
      item2Desc: 'صيانة وقائية متأخرة يومين — يدعم الطاقة الاحتياطية لمستشفى الأمل',
      item2Btn: 'جدولة الفحص',
      item3Name: 'وحدة التبريد الصناعي Chiller A',
      item3Desc: 'غير مرتبطة بأي خدمة — لن تدخل في حساب الأولوية الذكية',
      item3Btn: 'ربط بخدمة',
      servicesHealthTitle: 'صحة الخدمات الحرجة',
      servicesCount: 'خدمات',
      statusStable: 'مستقرة',
      statusNoAssets: 'بلا أصول',
      statusNoBackup: 'بلا بديل',
      viewServicesMatrix: 'عرض مصفوفة الخدمات الكاملة ←',
      assetsBySiteTitle: 'الأصول حسب الموقع',
      manageSites: 'إدارة المواقع',
      assetsCount: 'أصول',
      legendOperational: 'يعمل',
      legendMaintenance: 'تحت الصيانة',
      legendStopped: 'متوقف / عطل حرج',
      setupTitle: 'أكمل إعداد منشأتك',
      stepTitles: {
        'step-1': 'إنشاء المنشأة واعتماد النطاق',
        'step-2': 'إضافة المواقع والمرافق الحيوية',
        'step-3': 'تسجيل الأصول والمعدات الرئيسية',
        'step-4': 'ربط الأصول بالخدمات الحرجة',
        'step-5': 'دعوة الفنيين وتوزيع الصلاحيات',
      },
    },
  },
  en: {
    dir: 'ltr',
    announcement: {
      tag: 'NEW',
      text: 'AI fault diagnostics and explainable priority scoring are now available for all facilities.',
      cta: 'See how it works →',
    },
    nav: {
      platform: 'Platform',
      assets: 'Asset Registry',
      services: 'Critical Services',
      workOrders: 'Work Orders',
      preventive: 'Preventive PM',
      journey: 'How It Works',
      sectors: 'Sectors',
      ai: 'AI Diagnostics',
      formula: 'Priority Formula',
      faq: 'FAQ',
      reportFault: 'Report Fault',
      login: 'Log In',
      startFree: 'Start Free',
      muteSound: 'Mute Sound Effects',
      unmuteSound: 'Enable Sound Effects',
    },
    hero: {
      badge: 'Arabic-First CMMS Powered by Operational AI',
      title1: 'Know which failure stops your critical services,',
      title2: 'and fix it first.',
      desc: 'AssetFlow unifies asset registry, work orders, and preventive maintenance in one platform — linking every machine to the vital service it powers, so you understand impact before taking action.',
      startFree: 'Start Free Trial · 7 Days',
      watchDemo: 'Watch How It Works',
      subNote: 'No credit card required · Setup in minutes · Full Arabic & English support',
      mockupUrl: 'app.assetflow.io/dashboard',
      livePlatform: 'Enter Live Platform',
      dashboardNav: 'Dashboard',
      assetsNav: 'Asset Registry',
      sitesNav: 'Sites & Facilities',
      servicesNav: 'Critical Services',
      workOrdersNav: 'Work Orders',
      preventiveNav: 'Preventive PM',
      operationalAssets: 'Operational Assets',
      criticalServicesAtRisk: 'Critical Services at Risk',
      openWorkOrders: 'Open Work Orders',
      overduePm: 'Overdue PM',
      needsAttention: 'Needs Attention Now',
      rankedByImpact: 'Ranked by Service Impact',
      pumpTitle: 'Centrifugal Pump #1 · Desalination Plant',
      pumpDesc: 'Water supply to surgery units interrupted — click to issue emergency work order',
      pumpAction: 'Report Fault',
      genTitle: 'Turbine Generator 1500kVA',
      genDesc: 'Emergency power backup · Maintenance due',
      statusStopped: 'Stopped',
      statusMaintenance: 'Maintenance',
      statusRunning: 'Running',
    },
    values: {
      v1Title: 'Unified Registry',
      v1Sub: 'Every asset across every facility',
      v2Title: 'Impact-Based Priority',
      v2Sub: 'Not first-reported, first-served',
      v3Title: 'Until Verified',
      v3Sub: 'No task closed without operational test',
      v4Title: 'Bilingual Native',
      v4Sub: 'Full RTL Arabic + English',
    },
    platform: {
      tag: 'Platform',
      title1: 'Beyond standard maintenance software —',
      title2: 'A decision platform for critical assets.',
      desc: 'Every module is built around one crucial question: what must be repaired right now, and why?',
      c1Title: 'Asset Lifecycle Management',
      c1Desc: 'From onboarding and QR code to decommissioning: location, specs, health history, and maintenance costs.',
      c1Code: 'AST-PUMP-101',
      c1Name: 'Centrifugal Pump #1',
      c1LastService: 'Last service: 12 days ago',
      c1Mtbf: 'MTBF: 1,840 hrs',
      c1Critical: '1 Critical Service',
      c2Title: 'Critical Services Matrix',
      c2Desc: 'Map each machine to the essential public service it delivers. Understand risk to lives and operations instantly.',
      c2Action: 'Explore Reliability Matrix →',
      c3Title: 'Automated Field Dispatching',
      c3Desc: 'Smart work orders routed to the right technician with reserved parts and verification checklists before closure.',
      c3Action: 'View Live Work Orders →',
    },
    journey: {
      tag: 'Operational Journey',
      title: 'From Onboarding to Verification: in 4 Clear Steps.',
      desc: 'A transparent workflow that enables engineering teams to govern all critical infrastructure in record time.',
      stepPrefix: 'Step',
    },
    sectors: {
      tag: 'Vital Sectors',
      title: 'Built for facilities that cannot afford downtime.',
      typicalAssets: 'Typical assets in this sector:',
      protectedServices: 'Critical services we protect:',
    },
    ai: {
      tag: 'Operational AI',
      title1: 'Diagnoses faults in seconds.',
      title2: 'Your team makes the final call.',
      desc: 'Technicians describe what they see in natural vernacular. The system suggests classification, severity, root causes, and tests. Priority is computed by transparent rules reviewable by engineering leadership.',
      f1: 'Recommends without deciding alone — final authority stays with engineers',
      f2: 'Learns from the specific equipment maintenance history and runtime',
      f3: 'Understands Arabic field dialects and technical terminology natively',
      operatorReportLabel: 'Report from: Field Operator · Desalination Plant',
      symptomDefault: 'Pump makes loud abnormal whining noise with high bearing temperature, and discharge pressure drops after 15 minutes of operation.',
      categoryDefault: 'Mechanical — Bearings & Hydraulics',
      causesDefault: 'Bearing wear · Insufficient lubrication · Mechanical seal degradation',
      testsDefault: 'Vibration spectrum FFT, oil lubrication check',
      priorityInterrupted: '— Water supply interrupted',
      aiBadge: 'AssetFlow AI Diagnosis · In 3 seconds',
      catLabel: 'Suggested Classification:',
      severityLabel: 'Severity Level:',
      causesLabel: 'Potential Causes:',
      testsLabel: 'Required Tests:',
      priorityLabel: 'Computed Priority:',
      createOrderBtn: 'Create Emergency Order',
      editAnalysisBtn: 'Adjust Analysis',
    },
    portals: {
      tag: 'Tailored for Every Role',
      title: 'Three Portals, One Account.',
      sub: 'Every team member is automatically routed to their workspace based on verified permissions.',
      adminTitle: 'Operations Director',
      adminDesc: 'Priorities, assets, service matrices, team governance, and financial/reliability reports — on the Web.',
      adminAction: 'Explore Executive Portal',
      techTitle: 'Field Technician',
      techDesc: 'My daily tasks sorted by priority, diagnostic steps, parts requisition, and photo proof — on Mobile.',
      techAction: 'Explore Field Board',
      reporterTitle: 'Operational Reporter',
      reporterDesc: 'Scan the asset QR code, describe symptoms in plain words, and track repair status in real-time.',
      reporterAction: 'Try Scan & Report',
    },
    formula: {
      tag: 'Smart Priority Formula',
      title: 'Explainable Priority Algorithm',
      desc: 'Adjust the sliders below to see how the four engineering criteria shape work order urgency dynamically:',
      s1Label: '1. Service Impact (Service Impact)',
      s1Desc: 'How vital is the public or clinical service powered by this machine?',
      s2Label: '2. Lack of Redundancy (No Backup)',
      s2Desc: 'Is the facility running on a single pump without standby backup?',
      s3Label: '3. Response SLA Delay',
      s3Desc: 'Accumulated delay hours beyond the agreed operational deadline',
      s4Label: '4. Failure Recurrence Rate',
      s4Desc: 'Repeat breakdown history of this unit over the past 90 days',
      resultLabel: 'Live Calculated Priority',
      outOf100: 'out of 100',
      criticalStatus: 'Critical Priority (Response within 4 hrs)',
      highStatus: 'High Priority (Response within 24 hrs)',
      standardStatus: 'Standard Priority (Response within 3 days)',
      criticalText: 'Critical failure directly threatening operations without backup. Instant alert dispatched to senior technician.',
      standardText: 'Manageable issue with temporary bypass available or stabilized secondary services.',
      settingsCta: 'Customize Formula Weights in Settings →',
    },
    faq: {
      tag: 'Frequently Asked Questions',
      title: 'Before you begin.',
      sub: 'Clear and direct answers about the AssetFlow platform',
    },
    cta: {
      title: 'Ready to know what to fix first?',
      desc: 'Start your free 7-day trial or explore the live platform directly with your facility scenario.',
      startFreeBtn: 'Start Free',
      liveDemoBtn: 'Enter Live Platform',
    },
    footer: {
      brandDesc: 'Modern cloud platform for critical infrastructure, CMMS work orders, and vital service protection.',
      newsletterTitle: 'CMMS Engineering Insights Newsletter',
      newsletterDesc: 'Subscribe for the latest diagnostics methodologies and unplanned downtime mitigation strategies.',
      newsletterPlaceholder: 'name@company.com',
      newsletterBtn: 'Subscribe',
      newsletterSubscribed: 'Subscribed ✓',
      colSystem: 'Platform',
      colSectors: 'Sectors',
      colAccount: 'Account & Support',
      copyright: '© 2026 AssetFlow · All rights reserved',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      backToTop: 'Back to Top ↑',
    },
    sidebar: {
      sectionMain: 'MAIN',
      dashboard: 'Dashboard',
      issues: 'Fault Reports',
      reportIssue: 'Report a Fault',
      myIssues: 'My Reports History',
      techPortal: 'My Dashboard & Tasks',
      techAssets: 'Facility Assets (Read-Only)',
      profile: 'My Profile',
      sectionOps: 'OPERATIONS',
      assets: 'Asset Registry',
      sites: 'Sites & Facilities',
      services: 'Critical Services',
      workOrders: 'Work Orders',
      preventive: 'Preventive PM',
      sectionAdmin: 'ADMINISTRATION',
      team: 'Team & Roles',
      reports: 'Analytics & Reports',
      settings: 'Settings & Priority',
      audit: 'Audit Log',
      activeFacility: 'Active Facility',
      facilityName: 'Nablus Water Utility',
      setupProgress: 'Setup Progress',
      nextStepPrefix: 'Next: ',
      setupDone: 'All set! Facility setup complete',
    },
    dashboard: {
      date: 'Wednesday, October 21, 2026',
      greeting: 'Good morning, ',
      summaryPrefix: 'You have 1 fault impacting a critical service, and ',
      summaryMid: '',
      summarySuffix: ' open work orders.',
      reportFault: 'Report Fault',
      registerAsset: 'Register New Asset',
      criticalAlertTitle: 'Critical Service at Risk: Desalination Plant Water Supply',
      criticalAlertDesc: 'Centrifugal Water Pump #2 is under maintenance, and Pump #1 is operating alone with no standby backup.',
      openWorkOrder: 'Open Work Order (WO-849)',
      kpiOperational: 'Operational Assets',
      kpiOf: 'of',
      kpiServices: 'Stable Critical Services',
      kpiAtRisk: 'at risk',
      kpiWorkOrders: 'Open Work Orders',
      kpiOverdue: 'overdue',
      kpiAvgClose: 'Avg closure: 6 hours',
      kpiPm: 'Preventive PM This Week',
      kpiScheduled: 'scheduled',
      kpiNearest: 'Nearest: Tomorrow',
      needsAttentionTitle: 'Needs Your Attention',
      needsAttentionSub: 'Ranked by impact on critical services',
      filterAll: 'All',
      filterFaults: 'Faults',
      filterPm: 'PM',
      item1Name: 'Centrifugal Water Pump #2',
      item1Desc: 'Under maintenance — Desalination service running on single pump without standby',
      item1Btn: 'Work Order',
      item2Name: 'Turbine Generator 1500kVA',
      item2Desc: 'Overdue PM by 2 days — Supports standby backup for Al-Amal Hospital',
      item2Btn: 'Schedule PM',
      item3Name: 'Industrial Chiller Unit A',
      item3Desc: 'Unlinked from any service — Not computed in smart priority scoring',
      item3Btn: 'Link to Service',
      servicesHealthTitle: 'Critical Services Health',
      servicesCount: 'services',
      statusStable: 'Stable',
      statusNoAssets: 'No Assets',
      statusNoBackup: 'No Backup',
      viewServicesMatrix: 'View Full Service Matrix →',
      assetsBySiteTitle: 'Assets by Site',
      manageSites: 'Manage Sites',
      assetsCount: 'assets',
      legendOperational: 'Operational',
      legendMaintenance: 'Under Maintenance',
      legendStopped: 'Stopped / Critical',
      setupTitle: 'Complete Facility Setup',
      stepTitles: {
        'step-1': 'Create facility and define operational scope',
        'step-2': 'Add vital sites and distribution facilities',
        'step-3': 'Register critical machines and assets',
        'step-4': 'Map assets to critical services',
        'step-5': 'Invite technicians and configure roles',
      },
    },
  },
};
