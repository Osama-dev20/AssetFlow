import { Asset, WorkOrder, CriticalService, PreventivePlan, Site, TeamMember, PriorityWeights, AuditLogItem, Issue } from '../types';

export const initialPriorityWeights: PriorityWeights = {
  serviceImpact: 40,
  noBackup: 35,
  slaDelay: 12,
  failureRate: 9,
  criticalThreshold: 75,
  highThreshold: 50,
  mediumThreshold: 30
};

export const initialSites: Site[] = [
  {
    id: 'site-1',
    name: 'محطة تحلية وضخ المياه الرئيسية',
    nameEn: 'Main Desalination & Pumping Station',
    type: 'محطة مياه وبنية تحتية',
    typeEn: 'Water & Infrastructure Plant',
    location: 'نابلس — المنطقة الصناعية الشرقية',
    locationEn: 'Nablus — Eastern Industrial Zone',
    totalAssets: 2,
    operationalAssets: 1,
    managerName: 'م. أيمن حجاوي',
    managerNameEn: 'Eng. Ayman Hijjawi',
    contactPhone: '+970 599 123 456',
    criticalServicesCount: 1,
    status: 'warning'
  },
  {
    id: 'site-2',
    name: 'مستشفى الأمل التخصصي',
    nameEn: 'Al-Amal Specialized Hospital',
    type: 'منشأة صحية ورعاية طبية',
    typeEn: 'Healthcare & Clinical Facility',
    location: 'نابلس — شارع فيصل',
    locationEn: 'Nablus — Faisal Street',
    totalAssets: 2,
    operationalAssets: 2,
    managerName: 'د. ليلى الشكعة',
    managerNameEn: 'Dr. Laila Shakaa',
    contactPhone: '+970 599 654 321',
    criticalServicesCount: 2,
    status: 'normal'
  },
  {
    id: 'site-3',
    name: 'مجمع المصانع الشمالية - نابلس',
    nameEn: 'Northern Industrial Complex - Nablus',
    type: 'مجمع صناعي ولوجستي',
    typeEn: 'Industrial & Logistics Park',
    location: 'نابلس — بيت وزن',
    locationEn: 'Nablus — Beit Wazan',
    totalAssets: 2,
    operationalAssets: 2,
    managerName: 'طارق عبد الهادي',
    managerNameEn: 'Tariq Abdel Hadi',
    contactPhone: '+970 599 789 012',
    criticalServicesCount: 1,
    status: 'normal'
  },
  {
    id: 'site-4',
    name: 'المستودع المركزي لقطع الغيار',
    nameEn: 'Central Spare Parts Warehouse',
    type: 'مستودع إمداد وتخزين',
    typeEn: 'Supply & Storage Depot',
    location: 'نابلس — دير شرف',
    locationEn: 'Nablus — Deir Sharaf',
    totalAssets: 0,
    operationalAssets: 0,
    managerName: 'خالد دروزة',
    managerNameEn: 'Khaled Darwaza',
    contactPhone: '+970 599 333 444',
    criticalServicesCount: 0,
    status: 'normal'
  }
];

export const initialServices: CriticalService[] = [
  {
    id: 'svc-1',
    name: 'تزويد مياه محطة التحلية',
    nameEn: 'Desalination Plant Water Supply',
    description: 'تغذية شبكة مياه الشرب الحيوية للأحياء السكنية والصناعية',
    descriptionEn: 'Vital potable water supply to residential and industrial municipal districts',
    status: 'at_risk',
    siteName: 'محطة تحلية وضخ المياه الرئيسية',
    siteNameEn: 'Main Desalination & Pumping Station',
    supportingAssetIds: ['ast-1', 'ast-2'],
    supportingAssetsCount: 2,
    activeAssetsCount: 1,
    hasRedundancy: false, // AST-PUMP-102 is down, only AST-PUMP-101 is running!
    downtimeCostPerHour: 4500
  },
  {
    id: 'svc-2',
    name: 'الأكسجين الطبي المركزي',
    nameEn: 'Central Medical Oxygen',
    description: 'إمداد غرف العمليات والعناية المركزة بالأكسجين النقي بضغط ثابت',
    descriptionEn: 'Continuous medical oxygen supply to operating theatres and ICU wards at steady pressure',
    status: 'stable',
    siteName: 'مستشفى الأمل التخصصي',
    siteNameEn: 'Al-Amal Specialized Hospital',
    supportingAssetIds: ['ast-4'],
    supportingAssetsCount: 1,
    activeAssetsCount: 1,
    hasRedundancy: true,
    downtimeCostPerHour: 12000
  },
  {
    id: 'svc-3',
    name: 'الطاقة الاحتياطية للمستشفى',
    nameEn: 'Hospital Standby Power',
    description: 'توليد الكهرباء الفوري للمعدات الحيوية عند انقطاع الشبكة الرئيسية',
    descriptionEn: 'Instant backup power generation for life-support machinery during grid blackouts',
    status: 'stable',
    siteName: 'مستشفى الأمل التخصصي',
    siteNameEn: 'Al-Amal Specialized Hospital',
    supportingAssetIds: ['ast-3'],
    supportingAssetsCount: 1,
    activeAssetsCount: 1,
    hasRedundancy: true,
    downtimeCostPerHour: 8000
  },
  {
    id: 'svc-4',
    name: 'التبريد الصناعي Chiller',
    nameEn: 'Industrial Chiller Cooling',
    description: 'حفظ مستودعات الأدوية والمواد الكيميائية الحساسة بدرجات حرارة معيارية',
    descriptionEn: 'Critical climate conditioning for sensitive pharmaceutical cold rooms and chemical storage',
    status: 'at_risk',
    siteName: 'مجمع المصانع الشمالية - نابلس',
    siteNameEn: 'Northern Industrial Complex - Nablus',
    supportingAssetIds: [],
    supportingAssetsCount: 0,
    activeAssetsCount: 0,
    hasRedundancy: false,
    downtimeCostPerHour: 2200
  },
  {
    id: 'svc-5',
    name: 'شبكة مكافحة وإطفاء الحريق',
    nameEn: 'Firefighting & Suppression Network',
    description: 'ضغط هيدروليكي فوري لمرشات الحريق وخراطيم الطوارئ في كافة المرافق',
    descriptionEn: 'Instant hydraulic pressure to emergency fire sprinklers and hose stations across all facilities',
    status: 'stable',
    siteName: 'مجمع المصانع الشمالية - نابلس',
    siteNameEn: 'Northern Industrial Complex - Nablus',
    supportingAssetIds: ['ast-6'],
    supportingAssetsCount: 1,
    activeAssetsCount: 1,
    hasRedundancy: true,
    downtimeCostPerHour: 15000
  }
];

export const initialAssets: Asset[] = [
  {
    id: 'ast-2',
    name: 'مضخة مياه الطرد المركزي #2',
    nameEn: 'Centrifugal Water Pump #2',
    code: 'AST-PUMP-102',
    siteId: 'site-1',
    siteName: 'محطة تحلية وضخ المياه الرئيسية',
    siteNameEn: 'Main Desalination & Pumping Station',
    category: 'مضخات وهيدروليك',
    categoryEn: 'Pumps & Hydraulics',
    status: 'maintenance',
    criticalServiceId: 'svc-1',
    criticalServiceName: 'تزويد مياه محطة التحلية',
    criticalServiceNameEn: 'Desalination Plant Water Supply',
    hasBackup: false,
    backupAssetId: 'ast-1',
    backupAssetName: 'مضخة مياه الطرد المركزي #1 (تعمل منفردة)',
    priorityScore: 86,
    installDate: '2022-03-15',
    warrantyExpiry: '2025-03-15',
    lastMaintenance: '2026-09-12',
    nextScheduledMaintenance: '2026-11-01',
    manufacturer: 'Grundfos Denmark',
    model: 'CR-95 High Pressure Multistage',
    powerRating: '45 kW · 380V',
    capacity: '120 m³/h @ 16 bar',
    locationDetails: 'عنبر المضخات رقم 2 — خط الطرد الشمالي',
    locationDetailsEn: 'Pump Bay #2 — North Discharge Header',
    operatingHours: 14820,
    mtbfHours: 720,
    mttrHours: 4.2,
    parts: [
      { id: 'part-1', name: 'طقم جوان ميكانيكي SiC/SiC', nameEn: 'Mechanical Seal Kit SiC/SiC', partNumber: 'GR-SK-95-01', inStock: 3, minRequired: 2, unitCost: 340 },
      { id: 'part-2', name: 'رولمان بلي مزدوج SKF 6312', nameEn: 'Double Ball Bearing SKF 6312', partNumber: 'SKF-6312-2Z', inStock: 4, minRequired: 4, unitCost: 180 },
      { id: 'part-3', name: 'حشوة منع تسرب جرافيت', nameEn: 'Graphite Gland Packing', partNumber: 'GRF-PK-32', inStock: 8, minRequired: 5, unitCost: 45 }
    ]
  },
  {
    id: 'ast-1',
    name: 'مضخة مياه الطرد المركزي #1',
    nameEn: 'Centrifugal Water Pump #1',
    code: 'AST-PUMP-101',
    siteId: 'site-1',
    siteName: 'محطة تحلية وضخ المياه الرئيسية',
    siteNameEn: 'Main Desalination & Pumping Station',
    category: 'مضخات وهيدروليك',
    categoryEn: 'Pumps & Hydraulics',
    status: 'operational',
    criticalServiceId: 'svc-1',
    criticalServiceName: 'تزويد مياه محطة التحلية',
    criticalServiceNameEn: 'Desalination Plant Water Supply',
    hasBackup: true,
    backupAssetId: 'ast-2',
    backupAssetName: 'مضخة مياه الطرد المركزي #2 (تحت الصيانة)',
    priorityScore: 30,
    installDate: '2022-03-15',
    warrantyExpiry: '2025-03-15',
    lastMaintenance: '2026-08-20',
    nextScheduledMaintenance: '2026-11-20',
    manufacturer: 'Grundfos Denmark',
    model: 'CR-95 High Pressure Multistage',
    powerRating: '45 kW · 380V',
    capacity: '120 m³/h @ 16 bar',
    locationDetails: 'عنبر المضخات رقم 1 — خط الطرد الشمالي',
    locationDetailsEn: 'Pump Bay #1 — North Discharge Header',
    operatingHours: 16400,
    mtbfHours: 890,
    mttrHours: 3.5,
    parts: [
      { id: 'part-1', name: 'طقم جوان ميكانيكي SiC/SiC', nameEn: 'Mechanical Seal Kit SiC/SiC', partNumber: 'GR-SK-95-01', inStock: 3, minRequired: 2, unitCost: 340 }
    ]
  },
  {
    id: 'ast-3',
    name: 'المولد الكهربائي التوربيني 1500kVA',
    nameEn: 'Turbine Generator 1500kVA',
    code: 'AST-GEN-204',
    siteId: 'site-2',
    siteName: 'مستشفى الأمل التخصصي',
    siteNameEn: 'Al-Amal Specialized Hospital',
    category: 'توليد طاقة وكهرباء',
    categoryEn: 'Power Generation & Electrical',
    status: 'maintenance',
    criticalServiceId: 'svc-3',
    criticalServiceName: 'الطاقة الاحتياطية للمستشفى',
    criticalServiceNameEn: 'Hospital Standby Power',
    hasBackup: false,
    priorityScore: 58,
    installDate: '2021-08-10',
    warrantyExpiry: '2024-08-10',
    lastMaintenance: '2026-07-15',
    nextScheduledMaintenance: '2026-10-19',
    manufacturer: 'Caterpillar Inc.',
    model: 'CAT 3512B DITA',
    powerRating: '1500 kVA / 1200 kW',
    capacity: '3000L Diesel Tank',
    locationDetails: 'المبنى السفلي B2 — غرفة المولدات الرئيسية',
    locationDetailsEn: 'Basement B2 — Central Generator Room',
    operatingHours: 1240,
    mtbfHours: 1400,
    mttrHours: 2.1,
    parts: [
      { id: 'part-4', name: 'فلتر ديزل رئيسي CAT', nameEn: 'CAT Main Diesel Filter', partNumber: 'CAT-1R-0749', inStock: 6, minRequired: 4, unitCost: 95 },
      { id: 'part-5', name: 'بطارية إقلاع جافة 12V 200Ah', nameEn: 'Dry Starter Battery 12V 200Ah', partNumber: 'CAT-BAT-200', inStock: 2, minRequired: 2, unitCost: 450 }
    ]
  },
  {
    id: 'ast-4',
    name: 'نظام إمداد الأكسجين الطبي المركزي',
    nameEn: 'Central Medical Oxygen Manifold',
    code: 'AST-OXY-301',
    siteId: 'site-2',
    siteName: 'مستشفى الأمل التخصصي',
    siteNameEn: 'Al-Amal Specialized Hospital',
    category: 'أنظمة غازات طبية',
    categoryEn: 'Medical Gas Systems',
    status: 'operational',
    criticalServiceId: 'svc-2',
    criticalServiceName: 'الأكسجين الطبي المركزي',
    criticalServiceNameEn: 'Central Medical Oxygen',
    hasBackup: true,
    priorityScore: 35,
    installDate: '2023-01-20',
    warrantyExpiry: '2027-01-20',
    lastMaintenance: '2026-09-01',
    nextScheduledMaintenance: '2026-12-01',
    manufacturer: 'BeaconMedæs UK',
    model: 'Medical Oxygen Manifold Duo 2x10',
    powerRating: '2.2 kW',
    capacity: '20 Cylinders 50L @ 200 bar',
    locationDetails: 'محطة الغازات الخارجية — جوار مدخل الطوارئ',
    locationDetailsEn: 'External Gas Station — Adjacent to Emergency Entrance',
    operatingHours: 9800,
    mtbfHours: 2500,
    mttrHours: 1.5,
    parts: [
      { id: 'part-6', name: 'حساس ضغط رقمي 0-250 bar', nameEn: 'Digital Pressure Sensor 0-250 bar', partNumber: 'BM-SN-OXY-01', inStock: 2, minRequired: 1, unitCost: 520 }
    ]
  },
  {
    id: 'ast-5',
    name: 'وحدة التبريد الصناعي Chiller A',
    nameEn: 'Industrial Chiller Unit A',
    code: 'AST-CHILL-401',
    siteId: 'site-3',
    siteName: 'مجمع المصانع الشمالية - نابلس',
    siteNameEn: 'Northern Industrial Complex - Nablus',
    category: 'تبريد وتكييف صناعي HVAC',
    categoryEn: 'Industrial HVAC & Cooling',
    status: 'operational',
    hasBackup: false,
    priorityScore: 24,
    installDate: '2023-06-10',
    warrantyExpiry: '2026-06-10',
    lastMaintenance: '2026-08-10',
    nextScheduledMaintenance: '2026-11-10',
    manufacturer: 'Daikin Applied',
    model: 'Air-Cooled Screw Chiller 250TR',
    powerRating: '220 kW · 400V',
    capacity: '250 TR (R-134a)',
    locationDetails: 'سطح مبنى الإنتاج رقم 3',
    locationDetailsEn: 'Roof of Production Facility #3',
    operatingHours: 8750,
    mtbfHours: 1100,
    mttrHours: 5.0,
    parts: [
      { id: 'part-7', name: 'فلتر دراير غاز التبريد R134a', nameEn: 'Filter Drier R134a', partNumber: 'DK-FD-250', inStock: 2, minRequired: 2, unitCost: 160 }
    ]
  },
  {
    id: 'ast-6',
    name: 'مضخة مياه الحريق الهيدروليكية',
    nameEn: 'Hydraulic Fire Water Pump',
    code: 'AST-FIRE-501',
    siteId: 'site-3',
    siteName: 'مجمع المصانع الشمالية - نابلس',
    siteNameEn: 'Northern Industrial Complex - Nablus',
    category: 'أنظمة السلامة ومكافحة الحريق',
    categoryEn: 'Safety & Fire Suppression',
    status: 'operational',
    criticalServiceId: 'svc-5',
    criticalServiceName: 'شبكة مكافحة وإطفاء الحريق',
    criticalServiceNameEn: 'Firefighting & Suppression Network',
    hasBackup: true,
    priorityScore: 28,
    installDate: '2021-11-05',
    warrantyExpiry: '2024-11-05',
    lastMaintenance: '2026-09-18',
    nextScheduledMaintenance: '2026-10-28',
    manufacturer: 'Peerless Pump UL/FM',
    model: 'Fire Pump 1000 GPM @ 125 PSI',
    powerRating: '75 kW Diesel Engine',
    capacity: '1000 GPM',
    locationDetails: 'غرفة مضخات الحريق المستقلة بالقرب من البوابة الغربية',
    locationDetailsEn: 'Dedicated Fire Pump House near West Gate',
    operatingHours: 420,
    mtbfHours: 3200,
    mttrHours: 1.8,
    parts: [
      { id: 'part-8', name: 'صمام تخفيف الضغط 4 بوصة', nameEn: 'Pressure Relief Valve 4"', partNumber: 'PRV-FP-04', inStock: 1, minRequired: 1, unitCost: 890 }
    ]
  }
];

export const initialWorkOrders: WorkOrder[] = [
  {
    id: 'wo-1',
    code: 'WO-849',
    title: 'تسريب مستمر في حشوة مانع التسرب الميكانيكي وارتفاع حرارة المحامل',
    titleEn: 'Continuous leakage in mechanical seal and high bearing temperature',
    description: 'تسريب مياه ضغط عالي من جسم المضخة مع اهتزاز غير طبيعي يتجاوز 4.5 mm/s عند المحمل الخلفي. الخدمة تعمل بمضخة واحدة فقط.',
    descriptionEn: 'High-pressure water leakage from casing with abnormal vibration exceeding 4.5 mm/s at rear bearing. System operating on single pump without standby.',
    assetId: 'ast-2',
    assetName: 'مضخة مياه الطرد المركزي #2',
    assetNameEn: 'Centrifugal Water Pump #2',
    assetCode: 'AST-PUMP-102',
    siteName: 'محطة تحلية وضخ المياه الرئيسية',
    siteNameEn: 'Main Desalination & Pumping Station',
    status: 'in_progress',
    priority: 'critical',
    priorityScore: 86,
    priorityBreakdown: {
      serviceImpact: 40,
      noBackup: 25,
      slaDelay: 12,
      failureRate: 9
    },
    assignedTo: {
      id: 'usr-3',
      name: 'أحمد خليل',
      nameEn: 'Ahmed Khalil',
      role: 'فني أول ميكانيك',
      roleEn: 'Senior Mechanical Tech',
      avatar: 'أ'
    },
    createdAt: '2026-10-20 07:30',
    slaDueHours: 4,
    hoursRemaining: 1.5,
    partsUsed: [
      { name: 'طقم جوان ميكانيكي SiC/SiC', quantity: 1, cost: 340 }
    ],
    historyNotes: [
      { date: '2026-10-20 07:30', author: 'النظام الآلي', note: 'تم إنشاء أمر العمل تلقائيًا بارتفاع الأولوية إلى 86 لغياب البديل' },
      { date: '2026-10-20 08:15', author: 'أحمد خليل', note: 'تم عزل الخط ميكانيكيًا وتصريف الضغط. جاري فك عمود المضخة' }
    ]
  },
  {
    id: 'wo-2',
    code: 'WO-848',
    title: 'فحص كابلات الجهد العالي وصيانة نظام الإقلاع الذاتي للمولد',
    titleEn: 'High voltage cabling check and automatic ATS transfer test',
    description: 'صيانة دورية وقائية متأخرة يومين. المولد يمثل خط الدفاع الأول للمستشفى عند انقطاع التيار الكهربائي العام.',
    descriptionEn: 'Scheduled preventive maintenance overdue by 2 days. Generator protects hospital ICU upon grid outage.',
    assetId: 'ast-3',
    assetName: 'المولد الكهربائي التوربيني 1500kVA',
    assetNameEn: 'Turbine Generator 1500kVA',
    assetCode: 'AST-GEN-204',
    siteName: 'مستشفى الأمل التخصصي',
    siteNameEn: 'Al-Amal Specialized Hospital',
    status: 'open',
    priority: 'high',
    priorityScore: 58,
    priorityBreakdown: {
      serviceImpact: 25,
      noBackup: 15,
      slaDelay: 10,
      failureRate: 8
    },
    assignedTo: {
      id: 'usr-4',
      name: 'رامي سالم',
      nameEn: 'Rami Salem',
      role: 'فني كهرباء وتحكم',
      roleEn: 'Electrical & Automation Tech',
      avatar: 'ر'
    },
    createdAt: '2026-10-19 14:00',
    slaDueHours: 24,
    hoursRemaining: 9,
    historyNotes: [
      { date: '2026-10-19 14:00', author: 'طارق النابلسي', note: 'توجيه أمر العمل للفريق الكهربائي نظراً لحساسية قسم الطوارئ' }
    ]
  },
  {
    id: 'wo-3',
    code: 'WO-847',
    title: 'استبدال فلاتر الهواء وفحص ضغط سائل التبريد Chiller A',
    titleEn: 'Air filter replacement and refrigerant pressure inspection for Chiller A',
    description: 'انخفاض طفيف في كفاءة التبريد نتيجة تراكم الأتربة على المكثف الخارجي.',
    descriptionEn: 'Slight cooling performance drop due to dust accumulation on external condenser.',
    assetId: 'ast-5',
    assetName: 'وحدة التبريد الصناعي Chiller A',
    assetNameEn: 'Industrial Chiller Unit A',
    assetCode: 'AST-CHILL-401',
    siteName: 'مجمع المصانع الشمالية - نابلس',
    siteNameEn: 'Northern Industrial Complex - Nablus',
    status: 'waiting_parts',
    priority: 'low',
    priorityScore: 24,
    priorityBreakdown: {
      serviceImpact: 10,
      noBackup: 5,
      slaDelay: 5,
      failureRate: 4
    },
    assignedTo: {
      id: 'usr-3',
      name: 'أحمد خليل',
      nameEn: 'Ahmed Khalil',
      role: 'فني أول ميكانيك',
      roleEn: 'Senior Mechanical Tech',
      avatar: 'أ'
    },
    createdAt: '2026-10-18 09:20',
    slaDueHours: 72,
    hoursRemaining: 48,
    historyNotes: [
      { date: '2026-10-18 11:00', author: 'أحمد خليل', note: 'بانتظار وصول الفلاتر البديلة من المستودع المركزي' }
    ]
  },
  {
    id: 'wo-4',
    code: 'WO-846',
    title: 'معايرة وفحص صمامات الأمان لمستشعر شبكة إمداد الأكسجين',
    titleEn: 'Calibration and relief valve check for Medical Oxygen Manifold',
    description: 'تمت المعايرة السنوية بنجاح واعتماد قراءات الضغط معيارية عند 4.2 bar.',
    descriptionEn: 'Annual certification calibration completed successfully; pressure confirmed nominal at 4.2 bar.',
    assetId: 'ast-4',
    assetName: 'نظام إمداد الأكسجين الطبي المركزي',
    assetNameEn: 'Central Medical Oxygen Manifold',
    assetCode: 'AST-OXY-301',
    siteName: 'مستشفى الأمل التخصصي',
    siteNameEn: 'Al-Amal Specialized Hospital',
    status: 'completed',
    priority: 'medium',
    priorityScore: 42,
    priorityBreakdown: {
      serviceImpact: 20,
      noBackup: 10,
      slaDelay: 8,
      failureRate: 4
    },
    assignedTo: {
      id: 'usr-4',
      name: 'رامي سالم',
      nameEn: 'Rami Salem',
      role: 'فني كهرباء وتحكم',
      roleEn: 'Electrical & Automation Tech',
      avatar: 'ر'
    },
    createdAt: '2026-10-16 11:00',
    slaDueHours: 24,
    hoursRemaining: 0,
    historyNotes: [
      { date: '2026-10-17 15:30', author: 'رامي سالم', note: 'تم إجراء المعايرة واختبار الإنذار المبكر وإغلاق أمر العمل' }
    ]
  }
];

export const initialPreventivePlans: PreventivePlan[] = [
  {
    id: 'pm-1',
    title: 'تشحيم وتزييت محامل مضخات الطرد المركزي',
    titleEn: 'Lubrication and greasing of centrifugal pump bearings',
    assetId: 'ast-1',
    assetName: 'مضخة مياه الطرد المركزي #1',
    assetNameEn: 'Centrifugal Water Pump #1',
    assetCode: 'AST-PUMP-101',
    siteName: 'محطة تحلية وضخ المياه الرئيسية',
    siteNameEn: 'Main Desalination & Pumping Station',
    frequency: 'weekly',
    nextDueDate: '2026-10-22 (غداً)',
    assignedTechnician: 'أحمد خليل',
    assignedTechnicianEn: 'Ahmed Khalil',
    estimatedHours: 1.5,
    status: 'scheduled',
    checklist: [
      { id: 'chk-1', text: 'فحص درجة حرارة المحامل بالأشعة تحت الحمراء', textEn: 'Inspect bearing temperatures using infrared thermometer', done: true },
      { id: 'chk-2', text: 'تفريغ وتعبئة شحم الليثيوم المعياري EP2', textEn: 'Drain old grease and apply standard lithium EP2 grease', done: false },
      { id: 'chk-3', text: 'فحص خلوص المحور الميكانيكي بمؤشر القياس', textEn: 'Check shaft mechanical runout with dial gauge', done: false }
    ]
  },
  {
    id: 'pm-2',
    title: 'اختبار تشغيل المولد التوربيني تحت الحمل الكامل',
    titleEn: 'Full load operational test of Turbine Generator',
    assetId: 'ast-3',
    assetName: 'المولد الكهربائي التوربيني 1500kVA',
    assetNameEn: 'Turbine Generator 1500kVA',
    assetCode: 'AST-GEN-204',
    siteName: 'مستشفى الأمل التخصصي',
    siteNameEn: 'Al-Amal Specialized Hospital',
    frequency: 'monthly',
    nextDueDate: '2026-10-19',
    assignedTechnician: 'رامي سالم',
    assignedTechnicianEn: 'Rami Salem',
    estimatedHours: 2.5,
    status: 'overdue',
    checklist: [
      { id: 'chk-4', text: 'فحص مستوى ونقاء زيت المحرك 15W-40', textEn: 'Inspect 15W-40 engine oil level and viscosity', done: true },
      { id: 'chk-5', text: 'فحص شحن بطاريات الإقلاع وقواطع ATS', textEn: 'Verify starter battery charging voltage and ATS switches', done: false },
      { id: 'chk-6', text: 'تشغيل المولد لمدة 30 دقيقة بحمل تجريبي 60%', textEn: 'Run engine under 60% test load for 30 minutes', done: false }
    ]
  },
  {
    id: 'pm-3',
    title: 'فحص واختبار سريان مضخة مكافحة الحريق الهيدروليكية',
    titleEn: 'Hydraulic flow and pressure check for Fire Pump',
    assetId: 'ast-6',
    assetName: 'مضخة مياه الحريق الهيدروليكية',
    assetNameEn: 'Hydraulic Fire Water Pump',
    assetCode: 'AST-FIRE-501',
    siteName: 'مجمع المصانع الشمالية - نابلس',
    siteNameEn: 'Northern Industrial Complex - Nablus',
    frequency: 'monthly',
    nextDueDate: '2026-10-28',
    assignedTechnician: 'أحمد خليل',
    assignedTechnicianEn: 'Ahmed Khalil',
    estimatedHours: 2.0,
    status: 'scheduled',
    checklist: [
      { id: 'chk-7', text: 'فحص ضغط خط الملحق الأوتوماتيكي Jockey Pump', textEn: 'Inspect automatic Jockey pump line pressure', done: false },
      { id: 'chk-8', text: 'بدء تشغيل محرك الديزل يدويًا وتفقد عادم الدخان', textEn: 'Manually crank diesel engine and check exhaust clarity', done: false }
    ]
  }
];

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'usr-1',
    name: 'طارق النابلسي',
    nameEn: 'Tariq Al-Nabulsi',
    role: 'admin',
    roleArabic: 'مدير المنظمة والمنشآت',
    roleEn: 'Facility & Operations Director',
    email: 'admin@assetflow.io',
    phone: '+970 599 111 222',
    initials: 'TN',
    avatarGradient: 'from-blue-600 to-teal-600',
    activeOrdersCount: 1,
    specialty: 'إدارة هندسية واستراتيجيات الصيانة',
    specialtyEn: 'Engineering Management & Maintenance Strategy',
    status: 'active',
    siteName: 'كل المواقع والمنشآت (4)',
    siteNameEn: 'All Facilities (4)'
  },
  {
    id: 'usr-2',
    name: 'م. أنس الكرمي',
    nameEn: 'Eng. Anas Al-Karmi',
    role: 'operations',
    roleArabic: 'مسؤول العمليات والتشغيل',
    roleEn: 'Operations & Reliability Manager',
    email: 'anas.k@nabluswater.ps',
    phone: '+970 599 222 333',
    initials: 'AK',
    avatarGradient: 'from-indigo-600 to-blue-500',
    activeOrdersCount: 2,
    specialty: 'تخطيط العمليات وسلاسل الإمداد',
    specialtyEn: 'Operations Planning & Supply Chain Governance',
    status: 'active',
    siteName: 'محطة تحلية وضخ المياه الرئيسية',
    siteNameEn: 'Main Desalination & Pumping Station'
  },
  {
    id: 'usr-3',
    name: 'أحمد خليل',
    nameEn: 'Ahmed Khalil',
    role: 'technician',
    roleArabic: 'فني أول ميكانيك وهيدروليك',
    roleEn: 'Senior Mechanical & Hydraulic Tech',
    email: 'tech@assetflow.io',
    phone: '+970 599 444 555',
    initials: 'AK',
    avatarGradient: 'from-emerald-600 to-teal-500',
    activeOrdersCount: 2,
    specialty: 'مضخات طرد مركزي وتوربينات',
    specialtyEn: 'Centrifugal Pumps & High-Pressure Turbines',
    status: 'busy',
    siteId: 'site-1',
    siteName: 'محطة تحلية وضخ المياه الرئيسية',
    siteNameEn: 'Main Desalination & Pumping Station'
  },
  {
    id: 'usr-4',
    name: 'رامي سالم',
    nameEn: 'Rami Salem',
    role: 'technician',
    roleArabic: 'فني كهرباء وتحكم آلي (PLC)',
    roleEn: 'Electrical & Automation Tech (PLC)',
    email: 'rami.s@nabluswater.ps',
    phone: '+970 599 666 777',
    initials: 'RS',
    avatarGradient: 'from-amber-600 to-orange-500',
    activeOrdersCount: 1,
    specialty: 'مولدات CAT، لوحات ATS ومتحكمات Siemens',
    specialtyEn: 'CAT Generators, ATS Panels & Siemens PLCs',
    status: 'active',
    siteId: 'site-2',
    siteName: 'مستشفى الأمل التخصصي',
    siteNameEn: 'Al-Amal Specialized Hospital'
  },
  {
    id: 'usr-5',
    name: 'سامر عودة',
    nameEn: 'Samer Odeh',
    role: 'technician',
    roleArabic: 'فني صيانة ميداني',
    roleEn: 'Field Maintenance Technician',
    email: 'samer.o@nabluswater.ps',
    phone: '+970 599 888 999',
    initials: 'SO',
    avatarGradient: 'from-purple-600 to-indigo-500',
    activeOrdersCount: 1,
    specialty: 'صيانة وقائية وفحص هيدروليكي',
    specialtyEn: 'Preventive Maintenance & Hydraulic Diagnostics',
    status: 'active',
    siteId: 'site-1',
    siteName: 'محطة تحلية وضخ المياه الرئيسية',
    siteNameEn: 'Main Desalination & Pumping Station'
  },
  {
    id: 'usr-6',
    name: 'هبة يعيش',
    nameEn: 'Heba Yaish',
    role: 'reporter',
    roleArabic: 'مُبلِّغة تشغيلية ومراقبة موقع',
    roleEn: 'Operational Reporter & Site Monitor',
    email: 'reporter@assetflow.io',
    phone: '+970 599 321 654',
    initials: 'HY',
    avatarGradient: 'from-teal-500 to-emerald-600',
    activeOrdersCount: 0,
    specialty: 'رصد الأعطال وتسجيل بلاغات الصيانة الميدانية',
    specialtyEn: 'Fault Reporting & Field Dispatch Tracking',
    status: 'active',
    siteId: 'site-2',
    siteName: 'مستشفى الأمل التخصصي',
    siteNameEn: 'Al-Amal Specialized Hospital'
  }
];

export const initialAuditLogs: AuditLogItem[] = [
  {
    id: 'aud-1',
    timestamp: '2026-10-21 09:45',
    user: 'أحمد خليل',
    userEn: 'Ahmed Khalil',
    action: 'تحديث حالة أمر العمل',
    actionEn: 'Work order status updated',
    target: 'WO-849 (مضخة الطرد المركزي #2)',
    targetEn: 'WO-849 (Centrifugal Pump #2)',
    category: 'work_order',
    details: 'تم الانتقال للحالة قيد التنفيذ وبدء فك الحشوة الميكانيكية',
    detailsEn: 'Moved to in-progress state and began disassembly of mechanical seal'
  },
  {
    id: 'aud-2',
    timestamp: '2026-10-21 08:30',
    user: 'طارق النابلسي',
    userEn: 'Tariq Al-Nabulsi',
    action: 'تعديل أوزان نموذج الأولوية',
    actionEn: 'Priority formula weights adjusted',
    target: 'نموذج الأولوية الذكي',
    targetEn: 'Smart Priority Algorithm',
    category: 'settings',
    details: 'تم رفع وزن غياب البديل إلى 35 نقطة بدلاً من 25',
    detailsEn: 'Increased No-Backup weight to 35 points from 25'
  },
  {
    id: 'aud-3',
    timestamp: '2026-10-20 17:15',
    user: 'النظام الآلي',
    userEn: 'Automated System',
    action: 'تنبيه أمان حرج',
    actionEn: 'Critical safety alert',
    target: 'خدمة تزويد مياه محطة التحلية',
    targetEn: 'Desalination Plant Water Supply Service',
    category: 'asset',
    details: 'انتقلت الخدمة إلى الحالة المعرّضة لغياب المضخة البديلة',
    detailsEn: 'Service transitioned to At-Risk state due to missing standby pump'
  },
  {
    id: 'aud-4',
    timestamp: '2026-10-19 14:00',
    user: 'م. أنس الكرمي',
    userEn: 'Eng. Anas Al-Karmi',
    action: 'جدولة خطة صيانة وقائية',
    actionEn: 'Scheduled preventive maintenance plan',
    target: 'PM-2 (المولد الكهربائي التوربيني)',
    targetEn: 'PM-2 (Turbine Generator 1500kVA)',
    category: 'pm',
    details: 'تم تحديد موعد الفحص الشهري الشامل وإسناده للمهندس رامي',
    detailsEn: 'Scheduled monthly full inspection and assigned to Eng. Rami'
  }
];

export const initialIssues: Issue[] = [
  {
    id: 'iss-31',
    number: 31,
    assetId: 'ast-6',
    assetName: 'محطة مضخات مكافحة الحريق UL/FM',
    assetNameEn: 'Hydraulic Fire Water Pump UL/FM',
    assetCode: 'AST-FIRE-501',
    siteId: 'site-3',
    siteName: 'مجمع المصانع الشمالية - نابلس',
    siteNameEn: 'Northern Industrial Complex - Nablus',
    description: 'ضغط شبكة الإطفاء ينخفض ببطء خلال الليل، والمضخة الاحتياطية تشتغل وحدها كل ساعتين تقريبًا.',
    descriptionEn: 'Fire sprinkler network pressure drops gradually overnight, and jockey standby pump auto-engages every two hours.',
    reportedBy: 'أحمد صوالحة',
    reportedByEn: 'Ahmed Sawalha',
    reportedByRole: 'مشرف سلامة مهنية',
    reportedByRoleEn: 'Occupational Safety Supervisor',
    reportedAt: '2026-10-28 09:40',
    status: 'reported',
    aiStatus: 'not_analyzed',
    impact: {
      level: 'unknown',
      affectedServices: [
        {
          id: 'svc-5',
          name: 'شبكة مكافحة وإطفاء الحريق',
          nameEn: 'Firefighting & Suppression Network',
          siteName: 'مجمع المصانع الشمالية - نابلس',
          siteNameEn: 'Northern Industrial Complex - Nablus',
          criticality: 'critical',
          isGoverningImpact: true
        }
      ],
      summaryArabic: 'بانتظار التحليل لتحديد الخدمات المتأثرة ومستوى الحرجية بدقة.',
      summaryEn: 'Pending AI diagnostic scan to confirm exact service criticality level.'
    },
    priority: {
      level: 'incomplete',
      score: 0,
      severityUsed: 'medium',
      severitySource: 'default',
      reasonArabic: 'الأولوية بحاجة إلى استكمال بيانات التحليل الذكي وتقدير الشدة.',
      reasonEn: 'Priority calculation pending AI diagnostic severity assessment.'
    }
  },
  {
    id: 'iss-30',
    number: 30,
    assetId: 'ast-5',
    assetName: 'وحدة التبريد الصناعي المركزي Chiller A',
    assetNameEn: 'Industrial Chiller Unit A',
    assetCode: 'AST-CHILL-401',
    siteId: 'site-3',
    siteName: 'مجمع المصانع الشمالية - نابلس',
    siteNameEn: 'Northern Industrial Complex - Nablus',
    description: 'صوت طقطقة عالي من الوحدة الخارجية، وحرارة المياه الخارجة أعلى من المعتاد بثلاث درجات.',
    descriptionEn: 'Loud rattling noise from external condenser fan unit, chilled water supply is 3°C above setpoint.',
    reportedBy: 'عمر داود',
    reportedByEn: 'Omar Dawood',
    reportedByRole: 'فني تشغيل وتبريد',
    reportedByRoleEn: 'Cooling Operator',
    reportedAt: '2026-10-28 08:15',
    status: 'reported',
    aiStatus: 'not_analyzed',
    impact: {
      level: 'unknown',
      affectedServices: [],
      summaryArabic: 'لا توجد خدمات حرجة مربوطة حالياً بهذا الأصل.',
      summaryEn: 'No critical services directly mapped to this asset.'
    },
    priority: {
      level: 'incomplete',
      score: 0,
      severityUsed: 'medium',
      severitySource: 'default',
      reasonArabic: 'الأولوية بحاجة إلى استكمال التحليل وتحديد ارتباط الخدمات.',
      reasonEn: 'Priority requires diagnostic completion and service mapping.'
    }
  },
  {
    id: 'iss-29',
    number: 29,
    assetId: 'ast-4',
    assetName: 'ضاغط ومولد الأكسجين الطبي المركزي',
    assetNameEn: 'Central Medical Oxygen Manifold',
    assetCode: 'AST-OXY-301',
    siteId: 'site-2',
    siteName: 'مستشفى الأمل التخصصي',
    siteNameEn: 'Al-Amal Specialized Hospital',
    description: 'إنذار انخفاض النقاء ظهر مرتين في جناح العناية، ثم اختفى وحده.',
    descriptionEn: 'Purity level low alarm triggered twice in ICU ward, then cleared automatically.',
    reportedBy: 'هبة يعيش',
    reportedByEn: 'Heba Yaish',
    reportedByRole: 'مُبلِّغة تشغيلية',
    reportedByRoleEn: 'Operational Reporter',
    reportedAt: '2026-10-27 22:10',
    status: 'reported',
    aiStatus: 'failed',
    impact: {
      level: 'high',
      affectedServices: [
        {
          id: 'svc-2',
          name: 'الأكسجين الطبي المركزي',
          nameEn: 'Central Medical Oxygen',
          siteName: 'مستشفى الأمل التخصصي',
          siteNameEn: 'Al-Amal Specialized Hospital',
          criticality: 'critical',
          isGoverningImpact: true
        }
      ],
      summaryArabic: 'تأثير مرتفع لارتباط الأصل بخدمة الأكسجين الطبي الحيوي.',
      summaryEn: 'High impact due to direct feed to critical ICU clinical oxygen.'
    },
    priority: {
      level: 'incomplete',
      score: 0,
      severityUsed: 'high',
      severitySource: 'default',
      reasonArabic: 'تعذّر إكمال التحليل الآلي حالياً — يرجى إعادة المحاولة أو تحديد الشدة يدوياً.',
      reasonEn: 'Automated analysis timed out safely — please retry or set manual severity.'
    }
  },
  {
    id: 'iss-27',
    number: 27,
    assetId: 'ast-3',
    assetName: 'المولد الكهربائي التوربيني 1500kVA',
    assetNameEn: 'Turbine Generator 1500kVA',
    assetCode: 'AST-GEN-204',
    siteId: 'site-2',
    siteName: 'مستشفى الأمل التخصصي',
    siteNameEn: 'Al-Amal Specialized Hospital',
    description: 'المولد يتوقف بعد عشر دقائق من التشغيل أثناء الاختبار الأسبوعي، ولوحة التحكم تعرض إنذار حرارة.',
    descriptionEn: 'Generator trips after 10 mins during weekly load test; control panel indicates high temperature alarm.',
    reportedBy: 'هبة يعيش',
    reportedByEn: 'Heba Yaish',
    reportedByRole: 'مُبلِّغة تشغيلية',
    reportedByRoleEn: 'Operational Reporter',
    reportedAt: '2026-10-27 14:05',
    status: 'under_review',
    aiStatus: 'success',
    aiAnalysis: {
      category: 'electrical',
      categoryArabic: 'كهربائي',
      categoryEn: 'Electrical',
      severity: 'high',
      confidence: 94,
      possibleCauses: [
        'ارتفاع حرارة المحرك بسبب ضعف سائل التبريد أو توقف المروحة.',
        'خلل في حساس الحرارة يعطي قراءة خاطئة فيفصل المولد وقائياً.',
        'حمل كهربائي زائد يتجاوز القدرة المقننة لحظة الإقلاع.'
      ],
      possibleCausesEn: [
        'Cooling system impairment due to low coolant level or fan belt slip.',
        'Faulty thermal sensor sending inaccurate runaway safety trip signals.',
        'Electrical load surge exceeding rated kVA threshold during peak cycle.'
      ],
      suggestedChecks: [
        'افحص مستوى سائل التبريد وسلامة المشعّ والمروحة الميكانيكية.',
        'قارن قراءة حساس الحرارة بجهاز قياس ليزري خارجي معاير.',
        'سجّل الحمل الفعلي بالفولت والأمبير خلال الدقائق العشر الأولى.'
      ],
      suggestedChecksEn: [
        'Inspect coolant fluid reservoir level and radiator fan belt tension.',
        'Cross-verify thermal sensor reading with calibrated infrared thermometer.',
        'Log real-time load amperages across all three phases during first 10 minutes.'
      ],
      analyzedAt: '2026-10-27 14:20'
    },
    impact: {
      level: 'high',
      affectedServices: [
        {
          id: 'svc-2',
          name: 'الأكسجين الطبي المركزي',
          nameEn: 'Central Medical Oxygen',
          siteName: 'مستشفى الأمل التخصصي',
          siteNameEn: 'Al-Amal Specialized Hospital',
          criticality: 'critical',
          isGoverningImpact: true
        },
        {
          id: 'svc-3',
          name: 'الطاقة الاحتياطية للمستشفى',
          nameEn: 'Hospital Standby Power',
          siteName: 'مستشفى الأمل التخصصي',
          siteNameEn: 'Al-Amal Specialized Hospital',
          criticality: 'important',
          isGoverningImpact: false
        }
      ],
      summaryArabic: 'أعلى أهمية بين الخدمات المرتبطة (2): حرجة ← تأثير مرتفع.',
      summaryEn: 'Highest service tier among connected links (2): Critical Tier 1 -> High Impact.'
    },
    priority: {
      level: 'high',
      score: 82,
      severityUsed: 'high',
      severitySource: 'ai',
      reasonArabic: 'أولوية عالية لأن مستوى التأثير مرتفع — الأصل يدعم خدمة حرجة (الأكسجين الطبي) — وشدة العطل عالية حسب تحليل الذكاء الاصطناعي.',
      reasonEn: 'High priority: High service impact on critical ICU oxygen combined with High severity assessed by AI diagnostics.'
    }
  },
  {
    id: 'iss-26',
    number: 26,
    assetId: 'ast-1',
    assetName: 'لوحة إنارة المواقف الخارجية',
    assetNameEn: 'External Parking Lighting Panel',
    assetCode: 'AST-LGT-110',
    siteId: 'site-1',
    siteName: 'محطة تحلية وضخ المياه الرئيسية',
    siteNameEn: 'Main Desalination & Pumping Station',
    description: 'ثلاثة أعمدة إنارة في موقف الزوار لا تعمل منذ يومين.',
    descriptionEn: 'Three lighting poles in the visitor parking lot have been inoperable for two days.',
    reportedBy: 'ليث حمدان',
    reportedByEn: 'Laith Hamdan',
    reportedByRole: 'مساعد إداري',
    reportedByRoleEn: 'Administrative Assistant',
    reportedAt: '2026-10-26 19:30',
    status: 'under_review',
    aiStatus: 'success',
    aiAnalysis: {
      category: 'electrical',
      categoryArabic: 'كهربائي',
      categoryEn: 'Electrical',
      severity: 'low',
      confidence: 96,
      possibleCauses: [
        'احتراق مصابيح LED في الأعمدة الثلاثة.',
        'عطل في قاطع الدائرة الفرعية المخصص لخط الإنارة رقم 2.'
      ],
      possibleCausesEn: [
        'Burned out LED driver fixtures on the three respective poles.',
        'Tripped sub-circuit breaker for illumination zone line #2.'
      ],
      suggestedChecks: [
        'افحص القاطع الكهربائي في اللوحة الفرعية.',
        'قِس الجهد عند قاعدة العمود الأول لمعرفة وصول التيار.'
      ],
      suggestedChecksEn: [
        'Check miniature circuit breaker inside sub-distribution panel.',
        'Measure operating voltage at the pole base terminal block.'
      ],
      analyzedAt: '2026-10-26 19:45'
    },
    impact: {
      level: 'low',
      affectedServices: [],
      summaryArabic: 'تأثير منخفض — لا ترتبط بأي خدمات حرجة أو طبية أو تشغيلية.',
      summaryEn: 'Low impact — non-critical facility amenity, zero operational disruption.'
    },
    priority: {
      level: 'low',
      score: 22,
      severityUsed: 'low',
      severitySource: 'ai',
      reasonArabic: 'أولوية منخفضة لعدم وجود تأثير على خدمات المنشأة الحيوية وكون الشدة طفيفة.',
      reasonEn: 'Low priority: No critical service dependencies affected and low failure severity.'
    }
  },
  {
    id: 'iss-25',
    number: 25,
    assetId: 'ast-2',
    assetName: 'مضخة مياه الطرد المركزي #2 الاحتياطية',
    assetNameEn: 'Centrifugal Water Pump #2 (Standby)',
    assetCode: 'AST-PUMP-102',
    siteId: 'site-1',
    siteName: 'محطة تحلية وضخ المياه الرئيسية',
    siteNameEn: 'Main Desalination & Pumping Station',
    description: 'تسرّب قطرات مياه من جهة مانع التسرّب أثناء التشغيل التجريبي.',
    descriptionEn: 'Water droplets weeping from mechanical seal face during test run cycle.',
    reportedBy: 'خالد عودة',
    reportedByEn: 'Khaled Odeh',
    reportedByRole: 'فني تشغيل مياه',
    reportedByRoleEn: 'Water Operations Tech',
    reportedAt: '2026-10-26 10:50',
    status: 'work_order_created',
    workOrderId: 'wo-1',
    aiStatus: 'success',
    aiAnalysis: {
      category: 'mechanical',
      categoryArabic: 'ميكانيكي',
      categoryEn: 'Mechanical',
      severity: 'medium',
      confidence: 91,
      possibleCauses: [
        'تآكل حشوة مانع التسرب الميكانيكي (Mechanical Seal Kit).',
        'عدم محاذاة طفيفة في المحور تسببت في إجهاد الجلبة.'
      ],
      possibleCausesEn: [
        'Wear and tear on silicon carbide mechanical seal friction faces.',
        'Slight shaft angular misalignment causing uneven sleeve contact pressure.'
      ],
      suggestedChecks: [
        'فحص وجه الحشوة للتأكد من عدم وجود خدوش سطحية.',
        'إجراء فحص ليزري لمحاذاة المحور مع المحرك.'
      ],
      suggestedChecksEn: [
        'Inspect seal face flatness and check for microscopic thermal cracking.',
        'Perform laser shaft alignment check between pump and electric motor.'
      ],
      analyzedAt: '2026-10-26 11:05'
    },
    impact: {
      level: 'high',
      affectedServices: [
        {
          id: 'svc-1',
          name: 'تزويد مياه محطة التحلية',
          nameEn: 'Desalination Plant Water Supply',
          siteName: 'محطة تحلية وضخ المياه الرئيسية',
          siteNameEn: 'Main Desalination & Pumping Station',
          criticality: 'critical',
          isGoverningImpact: true
        }
      ],
      summaryArabic: 'تأثير مرتفع لأن الخدمة أصبحت تعمل بمضخة واحدة بدون بديل.',
      summaryEn: 'High impact: Vital municipal water supply left with zero standby redundancy.'
    },
    priority: {
      level: 'medium',
      score: 65,
      severityUsed: 'medium',
      severitySource: 'manual',
      manualSeverity: 'medium',
      reasonArabic: 'تم تحديد الشدة يدوياً من قِبل مدير الصيانة كـ (متوسطة)، مما خفض الأولوية المحسوبة إلى متوسطة لوجود المضخة الأساسية بالخدمة.',
      reasonEn: 'Severity manually calibrated to Medium by Maintenance Director, yielding Medium priority while primary pump is running.'
    }
  },
  {
    id: 'iss-22',
    number: 22,
    assetId: 'ast-1',
    assetName: 'مضخة الطرد المركزي متعددة المراحل #1',
    assetNameEn: 'Centrifugal Water Pump #1',
    assetCode: 'AST-PUMP-101',
    siteId: 'site-1',
    siteName: 'محطة تحلية وضخ المياه الرئيسية',
    siteNameEn: 'Main Desalination & Pumping Station',
    description: 'لا يعمل.',
    descriptionEn: 'Does not start.',
    reportedBy: 'خالد عودة',
    reportedByEn: 'Khaled Odeh',
    reportedByRole: 'فني تشغيل مياه',
    reportedByRoleEn: 'Water Operations Tech',
    reportedAt: '2026-10-21 09:12',
    status: 'reported',
    aiStatus: 'success',
    aiAnalysis: {
      category: 'electrical',
      categoryArabic: 'كهربائي',
      categoryEn: 'Electrical',
      severity: 'high',
      confidence: 88,
      possibleCauses: [
        'عطل في دائرة الإقلاع Soft Starter أو القاطع الرئيسي.',
        'تعشيق مفتاح الطوارئ E-Stop أو تفعيل حماية الحمل الزائد.'
      ],
      possibleCausesEn: [
        'Fault in motor soft starter controller or main power breaker trip.',
        'Engaged emergency stop interlock or thermal overload relay latch.'
      ],
      suggestedChecks: [
        'تأكد من وضعية مفتاح الطوارئ في لوحة التحكم الميدانية.',
        'قِس الفولتية الواصلة لأطراف المحرك الثلاثة (L1, L2, L3).'
      ],
      suggestedChecksEn: [
        'Verify physical status of emergency stop pushbuttons.',
        'Measure supply voltage across motor terminals L1, L2, L3 under command.'
      ],
      analyzedAt: '2026-10-21 09:20'
    },
    impact: {
      level: 'high',
      affectedServices: [
        {
          id: 'svc-1',
          name: 'تزويد مياه محطة التحلية',
          nameEn: 'Desalination Plant Water Supply',
          siteName: 'محطة تحلية وضخ المياه الرئيسية',
          siteNameEn: 'Main Desalination & Pumping Station',
          criticality: 'critical',
          isGoverningImpact: true
        }
      ],
      summaryArabic: 'تأثير مرتفع جداً لتوقف التزويد الحيوي عن المحطة.',
      summaryEn: 'Critical high impact: complete interruption to vital city water header.'
    },
    priority: {
      level: 'high',
      score: 85,
      severityUsed: 'high',
      severitySource: 'ai',
      reasonArabic: 'أولوية عالية فورية: تأثير مرتفع على خدمة مياه التحلية والشدة مقدرة بعالية.',
      reasonEn: 'Immediate high priority: Severe impact on critical water service with high severity.'
    }
  }
];
