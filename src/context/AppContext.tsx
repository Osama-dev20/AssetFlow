import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppPage, Asset, WorkOrder, CriticalService, PreventivePlan, 
  Site, TeamMember, PriorityWeights, AuditLogItem, AssetStatus, 
  WorkOrderStatus, PriorityLevel, Issue, IssueStatus, AiStatus,
  SeverityLevel, ImpactLevel, IssueCategory
} from '../types';
import { 
  initialAssets, initialWorkOrders, initialServices, 
  initialPreventivePlans, initialSites, initialTeamMembers, 
  initialPriorityWeights, initialAuditLogs, initialIssues
} from '../data/mockData';
import confetti from 'canvas-confetti';
import { soundManager } from '../lib/soundEffects';

interface Toast {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'danger' | 'info';
}

interface AppContextType {
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;
  selectedAssetId: string | null;
  setSelectedAssetId: (id: string | null) => void;
  openAssetDetail: (assetId: string) => void;
  
  currentUser: TeamMember;
  setCurrentUser: (user: TeamMember) => void;
  
  assets: Asset[];
  addAsset: (asset: Omit<Asset, 'id' | 'operatingHours' | 'mtbfHours' | 'mttrHours' | 'parts'>) => void;
  updateAssetStatus: (id: string, status: AssetStatus) => void;
  
  workOrders: WorkOrder[];
  addWorkOrder: (order: Partial<WorkOrder>) => void;
  updateWorkOrderStatus: (id: string, status: WorkOrderStatus) => void;
  
  services: CriticalService[];
  updateServiceStatus: (id: string, status: 'stable' | 'at_risk' | 'down') => void;
  
  preventivePlans: PreventivePlan[];
  togglePreventiveChecklist: (planId: string, checkId: string) => void;
  
  sites: Site[];
  addSite: (site: Omit<Site, 'id' | 'totalAssets' | 'operationalAssets' | 'criticalServicesCount' | 'status'>) => void;
  
  teamMembers: TeamMember[];
  inviteTeamMember: (data: { name: string; role: 'admin' | 'operations' | 'technician' | 'reporter'; email: string; phone: string; specialty: string }) => void;
  
  priorityWeights: PriorityWeights;
  updatePriorityWeights: (newWeights: Partial<PriorityWeights>) => void;
  calculatePriority: (asset: Asset, slaDelayHours?: number, failureCount?: number) => {
    score: number;
    breakdown: { serviceImpact: number; noBackup: number; slaDelay: number; failureRate: number };
    level: PriorityLevel;
  };

  auditLogs: AuditLogItem[];
  addAuditLog: (action: string, target: string, details: string, category: 'work_order' | 'asset' | 'settings' | 'pm') => void;

  toasts: Toast[];
  showToast: (title: string, message?: string, type?: 'success' | 'danger' | 'info') => void;
  removeToast: (id: string) => void;

  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // Setup progress checklist
  setupSteps: { id: string; title: string; completed: boolean }[];
  toggleSetupStep: (id: string) => void;
  setupPercentage: number;

  // Simulator
  simulationAssetId: string | null;
  setSimulationAssetId: (id: string | null) => void;
  triggerCelebration: () => void;

  // Bilingual Language State
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;

  // Sound Management
  isSoundMuted: boolean;
  setIsSoundMuted: (muted: boolean) => void;
  toggleSoundMute: () => boolean;

  // Issues & Fault Reports (Sprint 2 & 3)
  issues: Issue[];
  selectedIssueId: string | null;
  setSelectedIssueId: (id: string | null) => void;
  openIssueDetail: (issueId: string) => void;
  createIssue: (data: { assetId: string; description: string; reporterName?: string }) => Issue;
  analyzeIssueWithAi: (issueId: string) => Promise<void>;
  setManualSeverity: (issueId: string, severity: SeverityLevel | null) => void;
  createWorkOrderFromIssue: (issueId: string) => WorkOrder;
  switchRole: (role: 'admin' | 'technician' | 'reporter') => void;
  activeAccessError: 401 | 403 | 404 | null;
  setActiveAccessError: (err: 401 | 403 | 404 | null) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>('ast-2');
  const [currentUser, setCurrentUser] = useState<TeamMember>(initialTeamMembers[0]);
  const [assets, setAssets] = useState<Asset[]>(() => {
    try {
      const saved = localStorage.getItem('af_assets_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((item: Asset) => {
          const initial = initialAssets.find((a) => a.id === item.id || a.code === item.code);
          return {
            ...initial,
            ...item,
            nameEn: item.nameEn || initial?.nameEn,
            siteNameEn: item.siteNameEn || initial?.siteNameEn,
            categoryEn: item.categoryEn || initial?.categoryEn,
            criticalServiceNameEn: item.criticalServiceNameEn || initial?.criticalServiceNameEn,
            locationDetailsEn: item.locationDetailsEn || initial?.locationDetailsEn
          };
        });
      }
    } catch {
      // fallback
    }
    return initialAssets;
  });

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => {
    try {
      const saved = localStorage.getItem('af_work_orders_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((item: WorkOrder) => {
          const initial = initialWorkOrders.find((w) => w.id === item.id || w.code === item.code);
          return {
            ...initial,
            ...item,
            titleEn: item.titleEn || initial?.titleEn,
            descriptionEn: item.descriptionEn || initial?.descriptionEn,
            assetNameEn: item.assetNameEn || initial?.assetNameEn,
            siteNameEn: item.siteNameEn || initial?.siteNameEn,
            assignedTo: item.assignedTo ? {
              ...item.assignedTo,
              nameEn: item.assignedTo.nameEn || initial?.assignedTo?.nameEn,
              roleEn: item.assignedTo.roleEn || initial?.assignedTo?.roleEn
            } : undefined
          };
        });
      }
    } catch {
      // fallback
    }
    return initialWorkOrders;
  });

  const [issues, setIssues] = useState<Issue[]>(() => {
    try {
      const saved = localStorage.getItem('af_issues_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((item: Issue) => {
          const initial = initialIssues.find((i) => i.id === item.id || i.number === item.number);
          return {
            ...initial,
            ...item
          };
        });
      }
    } catch {
      // fallback
    }
    return initialIssues;
  });

  const [selectedIssueId, setSelectedIssueId] = useState<string | null>('iss-27');
  const [activeAccessError, setActiveAccessError] = useState<401 | 403 | 404 | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('af_issues_v2', JSON.stringify(issues));
  }, [issues]);

  const [services, setServices] = useState<CriticalService[]>(initialServices);
  const [preventivePlans, setPreventivePlans] = useState<PreventivePlan[]>(initialPreventivePlans);
  const [sites, setSites] = useState<Site[]>(initialSites);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [priorityWeights, setPriorityWeights] = useState<PriorityWeights>(initialPriorityWeights);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(initialAuditLogs);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [simulationAssetId, setSimulationAssetId] = useState<string | null>(null);

  // Setup Progress Checklist
  const [setupSteps, setSetupSteps] = useState([
    { id: 'step-1', title: 'إنشاء المنشأة واعتماد النطاق', completed: true },
    { id: 'step-2', title: 'إضافة المواقع والمرافق الحيوية', completed: true },
    { id: 'step-3', title: 'تسجيل الأصول والمعدات الرئيسية', completed: true },
    { id: 'step-4', title: 'ربط الأصول بالخدمات الحرجة', completed: false },
    { id: 'step-5', title: 'دعوة الفنيين وتوزيع الصلاحيات', completed: false },
  ]);

  // Language management (Arabic / English)
  const [language, setLanguageState] = useState<'ar' | 'en'>(() => {
    const saved = localStorage.getItem('af_language');
    return (saved === 'en' || saved === 'ar') ? saved : 'ar';
  });

  const setLanguage = (lang: 'ar' | 'en') => {
    setLanguageState(lang);
    localStorage.setItem('af_language', lang);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  // Sound effects mute management
  const [isSoundMuted, setIsSoundMutedState] = useState<boolean>(() => {
    const saved = localStorage.getItem('af_sound_muted');
    return saved === 'true';
  });

  const setIsSoundMuted = (muted: boolean) => {
    setIsSoundMutedState(muted);
    localStorage.setItem('af_sound_muted', muted ? 'true' : 'false');
    if (soundManager.getIsMuted() !== muted) {
      soundManager.toggleMute();
    }
  };

  const toggleSoundMute = () => {
    const newMuted = !isSoundMuted;
    setIsSoundMuted(newMuted);
    return newMuted;
  };


  // Persist assets & work orders
  useEffect(() => {
    localStorage.setItem('af_assets_v3', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('af_work_orders_v3', JSON.stringify(workOrders));
  }, [workOrders]);

  // Keyboard shortcut for command palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (title: string, message?: string, type: 'success' | 'danger' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#2563EB', '#14B8A6', '#34D399', '#60A5FA']
      });
    } catch {
      // fallback if confetti canvas fails
    }
  };

  const addAuditLog = (
    action: string, 
    target: string, 
    details: string, 
    category: 'work_order' | 'asset' | 'settings' | 'pm',
    actionEn?: string,
    targetEn?: string,
    detailsEn?: string
  ) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}`,
      timestamp: dateStr,
      user: currentUser.name,
      userEn: currentUser.nameEn || currentUser.name,
      action,
      actionEn: actionEn || action,
      target,
      targetEn: targetEn || target,
      category,
      details,
      detailsEn: detailsEn || details
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const calculatePriority = (
    asset: Asset, 
    slaDelayHours: number = 0, 
    failureCount: number = 1
  ) => {
    const serviceImpact = asset.criticalServiceId ? priorityWeights.serviceImpact : 0;
    const noBackup = !asset.hasBackup ? priorityWeights.noBackup : 0;
    const slaDelay = Math.min(priorityWeights.slaDelay, slaDelayHours * 3);
    const failureRate = Math.min(priorityWeights.failureRate, failureCount * 3);
    
    const score = Math.min(100, serviceImpact + noBackup + slaDelay + failureRate);
    
    let level: PriorityLevel = 'low';
    if (score >= priorityWeights.criticalThreshold) level = 'critical';
    else if (score >= priorityWeights.highThreshold) level = 'high';
    else if (score >= priorityWeights.mediumThreshold) level = 'medium';

    return {
      score,
      breakdown: {
        serviceImpact,
        noBackup,
        slaDelay,
        failureRate
      },
      level
    };
  };

  const openAssetDetail = (assetId: string) => {
    setSelectedAssetId(assetId);
    setCurrentPage('asset-detail');
  };

  const addAsset = (assetData: Omit<Asset, 'id' | 'operatingHours' | 'mtbfHours' | 'mttrHours' | 'parts'>) => {
    const newId = `ast-${Date.now()}`;
    const newAsset: Asset = {
      ...assetData,
      id: newId,
      operatingHours: 0,
      mtbfHours: 1200,
      mttrHours: 2.5,
      parts: [
        { id: `part-${Date.now()}-1`, name: 'طقم قطع غيار صيانة أولي', nameEn: 'Primary Maintenance Spare Kit', partNumber: 'OEM-STD-01', inStock: 2, minRequired: 1, unitCost: 150 }
      ]
    };
    setAssets((prev) => [newAsset, ...prev]);
    addAuditLog(
      'تسجيل أصل جديد', 
      `${newAsset.name} (${newAsset.code})`, 
      `تم إضافته إلى ${newAsset.siteName}`, 
      'asset',
      'Register New Asset',
      `${newAsset.nameEn || newAsset.name} (${newAsset.code})`,
      `Added to ${newAsset.siteNameEn || newAsset.siteName}`
    );
    showToast(
      language === 'en' ? 'Asset saved successfully' : 'تم حفظ الأصل بنجاح', 
      language === 'en' ? `${newAsset.nameEn || newAsset.name} added to asset registry` : `تمت إضافة ${newAsset.name} إلى سجل الأصول`, 
      'success'
    );
  };

  const updateAssetStatus = (id: string, status: AssetStatus) => {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    const asset = assets.find((a) => a.id === id);
    if (asset) {
      addAuditLog(
        'تغيير حالة أصل', 
        asset.name, 
        `تم تغيير الحالة إلى ${status}`, 
        'asset',
        'Update Asset Status',
        asset.nameEn || asset.name,
        `Status changed to ${status}`
      );
      showToast(
        language === 'en' ? 'Asset status updated' : 'تم تحديث حالة الأصل',
        language === 'en'
          ? `${asset.nameEn || asset.name} is now: ${status === 'operational' ? 'Operational' : status === 'maintenance' ? 'Maintenance' : 'Stopped'}`
          : `${asset.name} أصبحت حالته الآن: ${status === 'operational' ? 'يعمل' : status === 'maintenance' ? 'تحت الصيانة' : 'متوقف'}`,
        'info'
      );
    }
  };

  const addWorkOrder = (orderData: Partial<WorkOrder>) => {
    const id = `wo-${Date.now()}`;
    const code = `WO-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const asset = assets.find((a) => a.id === orderData.assetId);
    const calc = asset ? calculatePriority(asset, 0, 1) : {
      score: 40,
      breakdown: { serviceImpact: 20, noBackup: 10, slaDelay: 5, failureRate: 5 },
      level: 'medium' as PriorityLevel
    };

    const newOrder: WorkOrder = {
      id,
      code,
      title: orderData.title || (language === 'en' ? 'Emergency Maintenance Work Order' : 'أمر عمل صيانة طارئة'),
      titleEn: orderData.titleEn || orderData.title || 'Emergency Maintenance Work Order',
      description: orderData.description || '',
      descriptionEn: orderData.descriptionEn || orderData.description || '',
      assetId: orderData.assetId || '',
      assetName: asset?.name || (language === 'en' ? 'Unspecified Equipment' : 'معدة غير محددة'),
      assetNameEn: asset?.nameEn || asset?.name || 'Unspecified Equipment',
      assetCode: asset?.code || 'AST-GEN',
      siteName: asset?.siteName || (language === 'en' ? 'Main Facility' : 'محطة رئيسية'),
      siteNameEn: asset?.siteNameEn || asset?.siteName || 'Main Facility',
      status: orderData.status || 'open',
      priority: orderData.priority || calc.level,
      priorityScore: orderData.priorityScore || calc.score,
      priorityBreakdown: calc.breakdown,
      assignedTo: orderData.assignedTo || {
        id: currentUser.id,
        name: currentUser.name,
        nameEn: currentUser.nameEn || currentUser.name,
        role: currentUser.roleArabic,
        roleEn: currentUser.roleEn || currentUser.role,
        avatar: currentUser.initials
      },
      createdAt: dateStr,
      slaDueHours: calc.level === 'critical' ? 4 : calc.level === 'high' ? 24 : calc.level === 'medium' ? 72 : 168,
      hoursRemaining: calc.level === 'critical' ? 4 : calc.level === 'high' ? 24 : 72,
      historyNotes: [
        { 
          date: dateStr, 
          author: language === 'en' ? (currentUser.nameEn || currentUser.name) : currentUser.name, 
          note: language === 'en' ? 'Work order created' : 'تم إنشاء أمر العمل' 
        }
      ]
    };

    setWorkOrders((prev) => [newOrder, ...prev]);
    addAuditLog(
      'إنشاء أمر عمل جديد', 
      `${newOrder.code}: ${newOrder.title}`, 
      `الأولوية المحسوبة: ${newOrder.priorityScore} (${newOrder.priority})`, 
      'work_order',
      'Create New Work Order',
      `${newOrder.code}: ${newOrder.titleEn || newOrder.title}`,
      `Calculated score: ${newOrder.priorityScore} (${newOrder.priority})`
    );
    showToast(
      language === 'en' ? 'Work order created' : 'تم إنشاء أمر العمل',
      language === 'en' ? `Work order ${newOrder.code} assigned successfully` : `تم تعيين أمر العمل ${newOrder.code} بنجاح`,
      'success'
    );
    triggerCelebration();
  };

  const updateWorkOrderStatus = (id: string, status: WorkOrderStatus) => {
    setWorkOrders((prev) => prev.map((wo) => {
      if (wo.id === id) {
        return { ...wo, status };
      }
      return wo;
    }));
    const wo = workOrders.find((w) => w.id === id);
    if (wo) {
      addAuditLog(
        'تحديث حالة أمر العمل', 
        wo.code, 
        `تم تحويله إلى ${status}`, 
        'work_order',
        'Update Work Order Status',
        wo.code,
        `Status converted to ${status}`
      );
      showToast(
        language === 'en' ? 'Work order updated' : 'تم تحديث حالة أمر العمل',
        language === 'en'
          ? `${wo.code} is now: ${status === 'completed' ? 'Completed ✅' : status === 'in_progress' ? 'In Progress ⚙️' : status === 'waiting_parts' ? 'Awaiting Parts 📦' : 'Open 📋'}`
          : `${wo.code} الآن: ${status === 'completed' ? 'مكتمل ✅' : status === 'in_progress' ? 'قيد التنفيذ ⚙️' : status === 'waiting_parts' ? 'بانتظار قطع غيار 📦' : 'مفتوح 📋'}`,
        'info'
      );
      if (status === 'completed') {
        triggerCelebration();
      }
    }
  };

  const updateServiceStatus = (id: string, status: 'stable' | 'at_risk' | 'down') => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    const svc = services.find((s) => s.id === id);
    if (svc) {
      addAuditLog(
        'تغيير حالة خدمة حرجة', 
        svc.name, 
        `أصبحت الحالة: ${status}`, 
        'asset',
        'Update Critical Service Status',
        svc.nameEn || svc.name,
        `Status set to: ${status}`
      );
    }
  };

  const togglePreventiveChecklist = (planId: string, checkId: string) => {
    setPreventivePlans((prev) => prev.map((plan) => {
      if (plan.id === planId) {
        const updatedChecklist = plan.checklist.map((item) => 
          item.id === checkId ? { ...item, done: !item.done } : item
        );
        const allDone = updatedChecklist.every((c) => c.done);
        return {
          ...plan,
          checklist: updatedChecklist,
          status: allDone ? 'completed' : plan.status
        };
      }
      return plan;
    }));
    showToast(
      language === 'en' ? 'Checklist item saved' : 'تم حفظ خطوة الفحص',
      language === 'en' ? 'Preventive task verified and updated' : 'تم تحديث قائمة التحقق بنجاح',
      'info'
    );
  };

  const addSite = (siteData: Omit<Site, 'id' | 'totalAssets' | 'operationalAssets' | 'criticalServicesCount' | 'status'>) => {
    const newSite: Site = {
      ...siteData,
      id: `site-${Date.now()}`,
      totalAssets: 0,
      operationalAssets: 0,
      criticalServicesCount: 0,
      status: 'normal'
    };
    setSites((prev) => [...prev, newSite]);
    addAuditLog(
      'إضافة موقع جديد', 
      newSite.name, 
      newSite.location, 
      'asset',
      'Add New Facility Site',
      newSite.nameEn || newSite.name,
      newSite.locationEn || newSite.location
    );
    showToast(
      language === 'en' ? 'Site added successfully' : 'تمت إضافة الموقع بنجاح',
      language === 'en' ? (newSite.nameEn || newSite.name) : newSite.name,
      'success'
    );
  };

  const inviteTeamMember = (data: { name: string; role: 'admin' | 'operations' | 'technician' | 'reporter'; email: string; phone: string; specialty: string }) => {
    const roleMap: Record<string, string> = {
      admin: 'مدير المنظمة',
      operations: 'مسؤول العمليات',
      technician: 'فني معتمد',
      reporter: 'مُبلّغ بلاغات'
    };
    const roleEnMap: Record<string, string> = {
      admin: 'Facility Director',
      operations: 'Operations Lead',
      technician: 'Certified Technician',
      reporter: 'Facility Reporter'
    };
    const gradients = [
      'from-blue-600 to-indigo-600',
      'from-teal-600 to-emerald-600',
      'from-amber-600 to-orange-600',
      'from-purple-600 to-pink-600'
    ];
    const newMember: TeamMember = {
      id: `usr-${Date.now()}`,
      name: data.name,
      nameEn: data.name,
      role: data.role,
      roleArabic: roleMap[data.role] || 'عضو فريق',
      roleEn: roleEnMap[data.role] || 'Team Member',
      email: data.email,
      phone: data.phone,
      initials: data.name.trim()[0] || 'M',
      avatarGradient: gradients[Math.floor(Math.random() * gradients.length)],
      activeOrdersCount: 0,
      specialty: data.specialty,
      specialtyEn: data.specialty,
      status: 'active'
    };
    setTeamMembers((prev) => [...prev, newMember]);
    addAuditLog(
      'دعوة عضو فريق جديد', 
      newMember.name, 
      `الدور: ${newMember.roleArabic} — البريد: ${newMember.email}`, 
      'settings',
      'Invite New Team Member',
      newMember.nameEn || newMember.name,
      `Role: ${newMember.roleEn || newMember.role} — Email: ${newMember.email}`
    );
    showToast(
      language === 'en' ? 'Invitation sent successfully' : 'تم إرسال الدعوة بنجاح',
      language === 'en' ? `Added ${newMember.nameEn || newMember.name} and activation link sent to ${newMember.email}` : `تمت إضافة ${newMember.name} وإرسال رابط التفعيل إلى ${newMember.email}`,
      'success'
    );
    triggerCelebration();
  };

  const updatePriorityWeights = (newWeights: Partial<PriorityWeights>) => {
    setPriorityWeights((prev) => ({ ...prev, ...newWeights }));
    addAuditLog(
      'تحديث أوزان نموذج الأولوية', 
      'نموذج الأولوية القابل للتفسير', 
      'تم حفظ الأوزان الجديدة وإعادة تقييم الأوامر', 
      'settings',
      'Update Priority Weights',
      'Explainable Priority Model',
      'Saved new factor weights and re-scored work orders'
    );
    showToast(
      language === 'en' ? 'Priority weights updated' : 'تم حفظ أوزان الأولوية',
      language === 'en' ? 'Priority calculation updated successfully' : 'تم تحديث معادلة الأولوية بنجاح',
      'success'
    );
  };

  const openIssueDetail = (issueId: string) => {
    setSelectedIssueId(issueId);
    setCurrentPage('issues');
    soundManager.playCardSwitch();
  };

  const createIssue = (data: { assetId: string; description: string; reporterName?: string }): Issue => {
    const nextNum = Math.max(...issues.map((i) => i.number || 0), 32) + 1;
    const targetAsset = assets.find((a) => a.id === data.assetId || a.code === data.assetId) || assets[0];
    
    // Check if target asset is linked to a critical service
    const linkedService = services.find((s) => s.supportingAssetIds?.includes(targetAsset.id) || s.id === targetAsset.criticalServiceId);
    const hasService = !!linkedService;
    const isCritical = linkedService?.status === 'at_risk' || (linkedService?.downtimeCostPerHour || 0) > 5000;

    const newIssue: Issue = {
      id: `iss-${nextNum}`,
      number: nextNum,
      assetId: targetAsset.id,
      assetName: targetAsset.name,
      assetNameEn: targetAsset.nameEn || targetAsset.name,
      assetCode: targetAsset.code,
      siteId: targetAsset.siteId,
      siteName: targetAsset.siteName,
      siteNameEn: targetAsset.siteNameEn || targetAsset.siteName,
      description: data.description,
      descriptionEn: data.description,
      reportedBy: data.reporterName || currentUser.name,
      reportedByEn: currentUser.nameEn || data.reporterName || currentUser.name,
      reportedByRole: currentUser.roleArabic,
      reportedByRoleEn: currentUser.roleEn || currentUser.role,
      reportedAt: new Date().toLocaleDateString('ar-EG', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'reported',
      aiStatus: 'not_analyzed',
      impact: {
        level: hasService ? (isCritical ? 'high' : 'medium') : 'unknown',
        affectedServices: linkedService ? [
          {
            id: linkedService.id,
            name: linkedService.name,
            nameEn: linkedService.nameEn || linkedService.name,
            siteName: linkedService.siteName,
            siteNameEn: linkedService.siteNameEn || linkedService.siteName,
            criticality: isCritical ? 'critical' : 'important',
            isGoverningImpact: true
          }
        ] : [],
        summaryArabic: hasService ? `يرتبط بخدمة: ${linkedService?.name}` : 'لا توجد خدمات حرجة مسجلة مربوطة بهذا الأصل حالياً.',
        summaryEn: hasService ? `Linked to service: ${linkedService?.nameEn || linkedService?.name}` : 'No critical services directly linked to this asset.'
      },
      priority: {
        level: 'incomplete',
        score: 0,
        severityUsed: 'medium',
        severitySource: 'default',
        reasonArabic: 'الأولوية بحاجة إلى استكمال بيانات التحليل الذكي وتقدير الشدة.',
        reasonEn: 'Priority calculation pending AI diagnostic severity assessment.'
      }
    };

    setIssues((prev) => [newIssue, ...prev]);
    addAuditLog(
      'تسجيل بلاغ عطل جديد',
      `بلاغ #${newIssue.number} (${newIssue.assetName})`,
      `المُبلِّغ: ${newIssue.reportedBy} — الوصف: ${newIssue.description.slice(0, 45)}...`,
      'asset'
    );
    soundManager.playSuccess();
    triggerCelebration();
    return newIssue;
  };

  const analyzeIssueWithAi = async (issueId: string) => {
    soundManager.playButtonClick();
    setIssues((prev) => prev.map((item) => item.id === issueId ? { ...item, aiStatus: 'analyzing' } : item));

    // Simulated scanning delay
    await new Promise((r) => setTimeout(r, 1800));

    setIssues((prev) => prev.map((item) => {
      if (item.id !== issueId) return item;

      const desc = item.description.toLowerCase();
      let category: IssueCategory = 'mechanical';
      let categoryArabic = 'ميكانيكي';
      let categoryEn = 'Mechanical';
      if (desc.includes('حرار') || desc.includes('كهرب') || desc.includes('قاطع') || desc.includes('مولد') || desc.includes('إنارة') || desc.includes('انقطاع')) {
        category = 'electrical';
        categoryArabic = 'كهربائي';
        categoryEn = 'Electrical';
      } else if (desc.includes('تبريد') || desc.includes('حرارة المياه') || desc.includes('chiller') || desc.includes('مكيف')) {
        category = 'hvac';
        categoryArabic = 'تبريد وتكييف صناعي';
        categoryEn = 'HVAC & Industrial Cooling';
      } else if (desc.includes('ضغط') || desc.includes('إطفاء') || desc.includes('تسريب') || desc.includes('مضخ')) {
        category = 'hydraulic';
        categoryArabic = 'هيدروليكي ومضخات';
        categoryEn = 'Hydraulics & Pumping';
      }

      const severity: SeverityLevel = item.impact.level === 'high' ? 'high' : (desc.includes('عالي') || desc.includes('حريق') || desc.includes('أكسجين') ? 'critical' : 'medium');
      
      const impactLevel: ImpactLevel = item.impact.affectedServices.some(s => s.criticality === 'critical') 
        ? 'high' 
        : (item.impact.affectedServices.length > 0 ? 'medium' : 'low');

      let priorityLevel: 'critical' | 'high' | 'medium' | 'low' = 'medium';
      let priorityScore = 60;
      if (impactLevel === 'high' && (severity === 'critical' || severity === 'high')) {
        priorityLevel = 'high';
        priorityScore = 84;
      } else if (impactLevel === 'high' && severity === 'medium') {
        priorityLevel = 'medium';
        priorityScore = 68;
      } else if (impactLevel === 'medium' && severity === 'high') {
        priorityLevel = 'high';
        priorityScore = 74;
      } else if (impactLevel === 'low') {
        priorityLevel = 'low';
        priorityScore = 25;
      }

      const possibleCauses = [
        `خلل داخلي في منظومة ${categoryArabic} ناتج عن تقلبات التشغيل أو الإجهاد الحراري.`,
        `تراكم ترسبات أو انسداد جزئي يؤدي إلى هبوط كفاءة الأداء.`,
        `احتمال تآكل أو رخاوة في عناصر التثبيت ونقاط الربط الميكانيكية.`
      ];
      const possibleCausesEn = [
        `Internal impairment in ${categoryEn} assembly due to operational fluctuation or thermal strain.`,
        `Partial blockage or deposit accumulation causing performance degradation.`,
        `Potential component wear or loose mechanical coupling junctions.`
      ];

      const suggestedChecks = [
        `فحص خطوط التغذية الرئيسية والمتحكم الميداني وقراءة سجل الأعطال.`,
        `قياس الضغط والحرارة والاهتزازات ومقارنتها بالحدود المسموحة من المصنّع.`,
        `معاينة سدادات منع التسرب والوصلات الهيدروليكية والتأريض الوقائي.`
      ];
      const suggestedChecksEn = [
        `Inspect primary feed lines, field controller, and retrieve fault telemetry history.`,
        `Measure operating pressure, temperature, and vibration amplitudes against manufacturer specs.`,
        `Examine sealing gaskets, hydraulic unions, and electrical safety bonding.`
      ];

      const nowStr = new Date().toLocaleDateString('ar-EG', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

      return {
        ...item,
        status: item.status === 'reported' ? 'under_review' : item.status,
        aiStatus: 'success',
        aiAnalysis: {
          category,
          categoryArabic,
          categoryEn,
          severity,
          confidence: 93,
          possibleCauses,
          possibleCausesEn,
          suggestedChecks,
          suggestedChecksEn,
          analyzedAt: nowStr
        },
        impact: {
          ...item.impact,
          level: impactLevel
        },
        priority: {
          level: priorityLevel,
          score: priorityScore,
          severityUsed: severity,
          severitySource: 'ai',
          reasonArabic: `أولوية ${priorityLevel === 'high' ? 'عالية' : (priorityLevel === 'medium' ? 'متوسطة' : 'منخفضة')} لأن مستوى التأثير ${impactLevel === 'high' ? 'مرتفع' : (impactLevel === 'medium' ? 'متوسط' : 'منخفض')} والشدة المقترحة من الذكاء الاصطناعي هي ${severity === 'high' ? 'عالية' : (severity === 'critical' ? 'حرجة' : (severity === 'medium' ? 'متوسطة' : 'منخفضة'))}.`,
          reasonEn: `${priorityLevel.toUpperCase()} priority: Impact level is ${impactLevel} combined with ${severity} severity assessed by AI diagnostics.`
        }
      };
    }));

    soundManager.playSuccess();
    showToast(
      language === 'en' ? 'AI Diagnostic completed' : 'اكتمل التحليل الذكي للعطل',
      language === 'en' ? 'Diagnostics, causes, checks, and priority calculated successfully' : 'تم استخراج التصنيف والأسباب والفحوصات وحساب الأولوية بنجاح',
      'success'
    );
  };

  const setManualSeverity = (issueId: string, severity: SeverityLevel | null) => {
    setIssues((prev) => prev.map((item) => {
      if (item.id !== issueId) return item;

      const severityUsed = severity !== null ? severity : (item.aiAnalysis?.severity || 'medium');
      const severitySource = severity !== null ? 'manual' : (item.aiAnalysis ? 'ai' : 'default');

      const impactLevel = item.impact.level;
      let priorityLevel: 'critical' | 'high' | 'medium' | 'low' = 'medium';
      let priorityScore = 60;
      if (impactLevel === 'high' && (severityUsed === 'critical' || severityUsed === 'high')) {
        priorityLevel = 'high';
        priorityScore = 82;
      } else if (impactLevel === 'high' && severityUsed === 'medium') {
        priorityLevel = 'medium';
        priorityScore = 65;
      } else if (impactLevel === 'medium' && severityUsed === 'high') {
        priorityLevel = 'high';
        priorityScore = 72;
      } else if (impactLevel === 'low') {
        priorityLevel = 'low';
        priorityScore = 25;
      }

      const reasonArabic = severity !== null 
        ? `تم تحديد الشدة يدويًا من قِبل مدير الصيانة كـ (${severity === 'high' ? 'عالية' : severity === 'critical' ? 'حرجة' : severity === 'medium' ? 'متوسطة' : 'منخفضة'})، مما حدّث الأولوية المحسوبة إلى ${priorityLevel === 'high' ? 'عالية' : priorityLevel === 'medium' ? 'متوسطة' : 'منخفضة'}.`
        : `تمت استعادة شدة الذكاء الاصطناعي (${severityUsed}) وإعادة احتساب الأولوية آليًا.`;

      const reasonEn = severity !== null
        ? `Severity manually calibrated to (${severity}) by Maintenance Director, updating calculated priority to ${priorityLevel}.`
        : `Restored AI assessed severity (${severityUsed}) and recalculated system priority.`;

      return {
        ...item,
        priority: {
          ...item.priority,
          level: priorityLevel,
          score: priorityScore,
          severityUsed,
          severitySource,
          manualSeverity: severity,
          reasonArabic,
          reasonEn
        }
      };
    }));

    soundManager.playButtonClick();
    showToast(
      language === 'en' ? 'Severity updated' : 'تم تحديث شدة العطل',
      severity !== null 
        ? (language === 'en' ? `Manual override saved: ${severity}` : `تم حفظ التحديد اليدوي: ${severity}`)
        : (language === 'en' ? 'Reset to AI diagnostic result' : 'تمت العودة لنتيجة الذكاء الاصطناعي'),
      'info'
    );
  };

  const createWorkOrderFromIssue = (issueId: string): WorkOrder => {
    const issue = issues.find((i) => i.id === issueId);
    if (!issue) throw new Error('Issue not found');

    const newCode = `WO-${Math.floor(100 + Math.random() * 900)}`;
    const newWo: WorkOrder = {
      id: `wo-${Date.now()}`,
      code: newCode,
      title: issue.description.length > 70 ? issue.description.slice(0, 70) + '...' : issue.description,
      titleEn: issue.descriptionEn ? (issue.descriptionEn.length > 70 ? issue.descriptionEn.slice(0, 70) + '...' : issue.descriptionEn) : undefined,
      description: `بلاغ رقم #${issue.number}: ${issue.description}\n\nالفحوصات المقترحة من التحليل الذكي:\n${issue.aiAnalysis?.suggestedChecks.map((c, i) => `${i + 1}. ${c}`).join('\n') || 'فحص ميداني شامل للأصل'}`,
      descriptionEn: `Report #${issue.number}: ${issue.descriptionEn || issue.description}\n\nAI Suggested Checks:\n${issue.aiAnalysis?.suggestedChecksEn?.map((c, i) => `${i + 1}. ${c}`).join('\n') || 'Comprehensive field diagnosis'}`,
      assetId: issue.assetId,
      assetName: issue.assetName,
      assetNameEn: issue.assetNameEn,
      assetCode: issue.assetCode,
      siteName: issue.siteName,
      siteNameEn: issue.siteNameEn,
      status: 'open',
      priority: issue.priority.level === 'incomplete' ? 'high' : (issue.priority.level as PriorityLevel),
      priorityScore: issue.priority.score || 75,
      priorityBreakdown: {
        serviceImpact: 40,
        noBackup: 25,
        slaDelay: 10,
        failureRate: 6
      },
      assignedTo: (() => {
        const tech = teamMembers.find((t) => t.role === 'technician');
        return tech ? {
          id: tech.id,
          name: tech.name,
          nameEn: tech.nameEn,
          role: tech.roleArabic,
          roleEn: tech.roleEn,
          avatar: tech.initials || 'AK'
        } : {
          id: 'usr-3',
          name: 'أحمد خليل',
          nameEn: 'Ahmed Khalil',
          role: 'فني أول ميكانيك وهيدروليك',
          roleEn: 'Senior Mechanical Tech',
          avatar: 'AK'
        };
      })(),
      createdAt: new Date().toISOString().slice(0, 10),
      slaDueHours: issue.priority.level === 'critical' ? 4 : (issue.priority.level === 'high' ? 24 : 72),
      hoursRemaining: issue.priority.level === 'critical' ? 4 : (issue.priority.level === 'high' ? 24 : 72)
    };

    setWorkOrders((prev) => [newWo, ...prev]);

    setIssues((prev) => prev.map((item) => 
      item.id === issueId ? { ...item, status: 'work_order_created', workOrderId: newWo.id } : item
    ));

    addAuditLog(
      'تحويل بلاغ عطل إلى أمر عمل',
      `أمر عمل ${newWo.code} من بلاغ #${issue.number}`,
      `تم إسناد الفحوصات المقترحة بالأولوية: ${newWo.priority}`,
      'work_order'
    );

    soundManager.playSuccess();
    triggerCelebration();
    showToast(
      language === 'en' ? 'Work Order created!' : 'تم إنشاء أمر العمل بنجاح!',
      language === 'en' ? `Generated ${newWo.code} and linked to Issue #${issue.number}` : `تم إصدار أمر العمل ${newWo.code} وربطه بالبلاغ #${issue.number}`,
      'success'
    );

    return newWo;
  };

  const switchRole = (role: 'admin' | 'technician' | 'reporter') => {
    soundManager.playCardSwitch();
    let targetUser = teamMembers.find((t) => t.role === role);
    if (!targetUser) {
      if (role === 'admin') targetUser = teamMembers[0];
      else if (role === 'technician') targetUser = teamMembers.find((t) => t.role === 'technician') || teamMembers[2];
      else targetUser = teamMembers.find((t) => t.role === 'reporter') || teamMembers[teamMembers.length - 1];
    }

    if (targetUser) {
      setCurrentUser(targetUser);
    }

    if (role === 'admin') {
      setCurrentPage('dashboard');
    } else if (role === 'technician') {
      setCurrentPage('tech-portal');
    } else {
      setCurrentPage('issues-new');
    }

    const roleNameAr = role === 'admin' ? 'مدير المنظمة' : (role === 'technician' ? 'فني صيانة' : 'مُبلِّغ تشغيلي');
    const roleNameEn = role === 'admin' ? 'Facility Director' : (role === 'technician' ? 'Field Technician' : 'Operational Reporter');

    showToast(
      language === 'en' ? `Switched role to ${roleNameEn}` : `تم التبديل إلى: ${roleNameAr}`,
      language === 'en' ? `Portal customized for ${targetUser?.nameEn || targetUser?.name}` : `تم تفعيل واجهة وصلاحيات ${targetUser?.name}`,
      'info'
    );
  };

  const toggleSetupStep = (id: string) => {
    setSetupSteps((prev) => prev.map((step) => 
      step.id === id ? { ...step, completed: !step.completed } : step
    ));
    showToast(
      language === 'en' ? 'Setup progress updated' : 'تم تحديث قائمة الإعداد',
      language === 'en' ? 'Step state saved successfully' : 'تم حفظ حالة خطوة الإعداد',
      'info'
    );
  };

  const completedCount = setupSteps.filter((s) => s.completed).length;
  const setupPercentage = Math.round((completedCount / setupSteps.length) * 100);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedAssetId,
        setSelectedAssetId,
        openAssetDetail,
        currentUser,
        setCurrentUser,
        assets,
        addAsset,
        updateAssetStatus,
        workOrders,
        addWorkOrder,
        updateWorkOrderStatus,
        services,
        updateServiceStatus,
        preventivePlans,
        togglePreventiveChecklist,
        sites,
        addSite,
        teamMembers,
        inviteTeamMember,
        priorityWeights,
        updatePriorityWeights,
        calculatePriority,
        auditLogs,
        addAuditLog,
        toasts,
        showToast,
        removeToast,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        setupSteps,
        toggleSetupStep,
        setupPercentage,
        simulationAssetId,
        setSimulationAssetId,
        triggerCelebration,
        language,
        setLanguage,
        isSoundMuted,
        setIsSoundMuted,
        toggleSoundMute,
        issues,
        selectedIssueId,
        setSelectedIssueId,
        openIssueDetail,
        createIssue,
        analyzeIssueWithAi,
        setManualSeverity,
        createWorkOrderFromIssue,
        switchRole,
        activeAccessError,
        setActiveAccessError,
        isOffline,
        setIsOffline
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
