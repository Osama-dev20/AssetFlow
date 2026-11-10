import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { allPages, unwrap, mapAsset, mapSite, mapService, mapMember, mapIssue, assetPayload, serverAssetStatus } from '../services/assetflow';
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
  
  isAuthenticated: boolean;
  currentUser: TeamMember;
  setCurrentUser: (user: TeamMember) => void;
  
  assets: Asset[];
  addAsset: (asset: Omit<Asset, 'id' | 'operatingHours' | 'mtbfHours' | 'mttrHours' | 'parts'>) => Promise<void>;
  updateAssetStatus: (id: string, status: AssetStatus) => void;
  
  workOrders: WorkOrder[];
  addWorkOrder: (order: Partial<WorkOrder>) => void;
  updateWorkOrderStatus: (id: string, status: WorkOrderStatus) => void;
  
  services: CriticalService[];
  updateServiceStatus: (id: string, status: 'stable' | 'at_risk' | 'down') => void;
  
  preventivePlans: PreventivePlan[];
  togglePreventiveChecklist: (planId: string, checkId: string) => void;
  
  sites: Site[];
  addSite: (site: Omit<Site, 'id' | 'totalAssets' | 'operationalAssets' | 'criticalServicesCount' | 'status'>) => Promise<void>;
  
  teamMembers: TeamMember[];
  inviteTeamMember: (data: { name: string; role: 'admin' | 'operations' | 'technician' | 'reporter'; email: string; phone: string; specialty: string }) => Promise<void>;
  
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
  createIssue: (data: { assetId: string; description: string; reporterName?: string }) => Promise<Issue>;
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
  
  const [currentPage, setCurrentPage] = useState<AppPage>(() => {
  return (sessionStorage.getItem('assetflow_page') as AppPage) || 'landing';
  });
  
  // حفظ الصفحة الحالية
useEffect(() => {
  if (currentPage === 'landing' || currentPage === 'login') {
    sessionStorage.removeItem('assetflow_page');
  } else {
    sessionStorage.setItem('assetflow_page', currentPage);
  }
}, [currentPage]);

  
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [currentUser, setCurrentUserState] = useState<TeamMember>(initialTeamMembers[0]);
  const [authenticated, setAuthenticated] = useState(false);
  const setCurrentUser = (user: TeamMember) => { setCurrentUserState(user); setAuthenticated(true); };
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  useEffect(() => {
    const logout = () => {
      setAuthenticated(false);
      sessionStorage.removeItem('assetflow_page');
      setAssets([]); setSites([]); setServices([]); setIssues([]); setTeamMembers([]);
      setCurrentPage('landing');
    };
    window.addEventListener('assetflow:logout', logout);
    return () => window.removeEventListener('assetflow:logout', logout);
  }, []);


  useEffect(() => {
  let isMounted = true;

const restoreSession = async () => {
  try {
    const user = await apiRequest('/api/me') as {
      id: number | string;
      name: string;
      email: string;
      role: string;
      status: string;
    };

    if (!isMounted) return;

    const roleMap: Record<string, TeamMember['role']> = {
      maintenance_manager: 'admin',
      technician: 'technician',
    };

    const mappedRole = roleMap[user.role];

    if (!mappedRole) {
  sessionStorage.removeItem('assetflow_page');
  setCurrentPage('landing');
  return;
}

    const mappedUser: TeamMember = {
      id: String(user.id),
      name: user.name,
      role: mappedRole,
      roleArabic: mappedRole === 'admin' ? 'مدير المنظمة' : 'فني صيانة',
      roleEn: mappedRole === 'admin' ? 'Maintenance Manager' : 'Technician',
      email: user.email,
      phone: '',
      initials: user.name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      avatarGradient:
        mappedRole === 'admin'
          ? 'from-blue-600 to-teal-600'
          : 'from-emerald-600 to-teal-500',
      activeOrdersCount: 0,
      specialty: '',
      status: user.status === 'active' ? 'active' : 'offline',
    };

    setCurrentUser(mappedUser);
    setAuthenticated(true);

    // لا نغيّر الصفحة تلقائيًا عند استعادة الجلسة.

  } catch {
    setAuthenticated(false);
    // لا توجد جلسة صالحة، ابقَ في الصفحة الرئيسية.
      sessionStorage.removeItem('assetflow_page');
      setCurrentPage('landing');
  } finally {
    if (isMounted) {
      setIsAuthChecking(false);
    }
  }
};

  void restoreSession();

  return () => {
    isMounted = false;
  };
}, []);

  const [assets, setAssets] = useState<Asset[]>([]);

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  const [issues, setIssues] = useState<Issue[]>([]);

  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [activeAccessError, setActiveAccessError] = useState<401 | 403 | 404 | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);



  const [services, setServices] = useState<CriticalService[]>([]);
  const [preventivePlans, setPreventivePlans] = useState<PreventivePlan[]>(initialPreventivePlans);
  const [sites, setSites] = useState<Site[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [priorityWeights, setPriorityWeights] = useState<PriorityWeights>(initialPriorityWeights);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [simulationAssetId, setSimulationAssetId] = useState<string | null>(null);

  // Setup Progress Checklist
  // The backend is the source of truth for supported modules. Never display seeded demo data after login.
  useEffect(() => {
    if (!authenticated) return;
    let cancelled = false;
    const load = async () => {
      const requests = await Promise.allSettled([
        allPages('/api/assets'), allPages('/api/sites'), allPages('/api/services'),
        allPages('/api/users'), allPages('/api/issues?per_page=100')
      ]);
      if (cancelled) return;
      const success = (index: number) => requests[index].status === 'fulfilled';
      const values = (index: number) => requests[index].status === 'fulfilled' ? (requests[index] as PromiseFulfilledResult<Record<string, any>[]>).value : [];
      const loadedAssets = values(0).map(mapAsset);
      if (success(0)) setAssets(loadedAssets);
      if (success(1)) setSites(values(1).map(mapSite));
      if (success(2)) setServices(values(2).map(mapService));
      if (success(3)) setTeamMembers(values(3).map(mapMember));
      if (success(4)) setIssues(values(4).map(issue => mapIssue(issue, loadedAssets, currentUser)));
      const failures = requests.filter(result => result.status === 'rejected');
      if (failures.length) {
        console.error('AssetFlow API load failed', failures);
        showToast('تعذر تحميل بعض بيانات الخادم', 'تحقق من الاتصال والصلاحيات ثم أعد تحميل الصفحة', 'danger');
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [authenticated]);

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

  const addAsset = async (assetData: Omit<Asset, 'id' | 'operatingHours' | 'mtbfHours' | 'mttrHours' | 'parts'>) => {
    try {
      const response = await apiRequest('/api/assets', { method: 'POST', body: JSON.stringify(assetPayload(assetData)) });
      const created = mapAsset(unwrap(response));
      created.siteName = sites.find(site => site.id === created.siteId)?.name ?? '';
      setAssets(prev => [created, ...prev]);
      showToast('تم تسجيل الأصل بنجاح', created.name, 'success');
    } catch (error) {
      showToast('تعذر إضافة الأصل', String(error), 'danger');
      throw error;
    }
  };

  const updateAssetStatus = (id: string, status: AssetStatus) => {
    void apiRequest(`/api/assets/${id}`, { method: 'PATCH', body: JSON.stringify({ status: serverAssetStatus(status) }) })
      .then(() => { setAssets(prev => prev.map(a => a.id === id ? { ...a, status } : a)); showToast('تم تحديث حالة الأصل'); })
      .catch(error => showToast('تعذر تحديث حالة الأصل', String(error), 'danger'));
  };

  // Work-order endpoints are not present in the supplied Laravel routes.
  // Never fabricate a successful server-side creation or status change.
  const addWorkOrder = (_orderData: Partial<WorkOrder>) => {
    showToast('أوامر العمل غير متصلة بعد', 'يجب توفير Work Orders API من فريق Backend', 'danger');
  };
  const updateWorkOrderStatus = (_id: string, _status: WorkOrderStatus) => {
    showToast('لا يمكن تحديث أمر العمل', 'الخادم لا يوفر مسار تحديث أوامر العمل بعد', 'danger');
  };

  const updateServiceStatus = (_id: string, _status: 'stable' | 'at_risk' | 'down') => {
    showToast('تغيير حالة الخدمة غير متاح', 'Backend الحالي يخزن درجة الأهمية وليس حالة التشغيل', 'info');
  };

  const togglePreventiveChecklist = (_planId: string, _checkId: string) => {
    showToast('الصيانة الوقائية غير متصلة بالخادم', 'لا يوجد مسار لحفظ قائمة الفحص في Laravel', 'danger');
  };

  const addSite = async (siteData: Omit<Site, 'id' | 'totalAssets' | 'operationalAssets' | 'criticalServicesCount' | 'status'>) => {
    try {
      const response = await apiRequest('/api/sites', { method: 'POST', body: JSON.stringify({ name: siteData.name, location: siteData.location }) });
      setSites(prev => [...prev, mapSite(unwrap(response))]);
      showToast('تمت إضافة الموقع بنجاح');
    } catch (error) {
      showToast('تعذر إضافة الموقع', String(error), 'danger');
      throw error;
    }
  };

  const inviteTeamMember = async (data: { name: string; role: 'admin' | 'operations' | 'technician' | 'reporter'; email: string; phone: string; specialty: string }) => {
    showToast('إضافة المستخدم غير متاحة من هذه الشاشة', 'يتطلب Backend كلمة مرور أولية، ولا يوفر إرسال دعوات بالبريد بعد', 'info');
    throw new Error('Backend invitation endpoint is not implemented');
  };

  const updatePriorityWeights = (_newWeights: Partial<PriorityWeights>) => {
    showToast('تعذر حفظ أوزان الأولوية', 'لا يوجد مسار لحفظ الإعدادات في Laravel', 'danger');
  };

  const openIssueDetail = (issueId: string) => {
    setSelectedIssueId(issueId);
    setCurrentPage('issues');
    soundManager.playCardSwitch();
  };

  const createIssue = async (data: { assetId: string; description: string; reporterName?: string }): Promise<Issue> => {
    const response = await apiRequest('/api/issues', { method: 'POST', body: JSON.stringify({ asset_id: Number(data.assetId), description: data.description }) });
    const created = mapIssue(unwrap(response), assets, currentUser);
    setIssues(prev => [created, ...prev]);
    showToast('تم تسجيل البلاغ بنجاح');
    return created;
  };

  const analyzeIssueWithAi = async (issueId: string) => {
    setIssues(prev => prev.map(issue => issue.id === issueId ? { ...issue, aiStatus: 'analyzing' } : issue));
    try {
      const response = await apiRequest(`/api/issues/${issueId}/analyze`, { method: 'POST' });
      const analysis = unwrap(response);
      setIssues(prev => prev.map(issue => issue.id !== issueId ? issue : ({
        ...issue, aiStatus: 'success', status: 'under_review',
        aiAnalysis: {
          category: analysis.category ?? 'other', categoryArabic: analysis.category ?? '', categoryEn: analysis.category ?? '',
          severity: analysis.severity ?? 'medium', confidence: 0,
          possibleCauses: analysis.possible_causes ?? [], possibleCausesEn: analysis.possible_causes ?? [],
          suggestedChecks: analysis.suggested_checks ?? [], suggestedChecksEn: analysis.suggested_checks ?? [],
          analyzedAt: analysis.analyzed_at ?? ''
        }
      })));
      const detail = unwrap(await apiRequest(`/api/issues/${issueId}`));
      setIssues(prev => prev.map(issue => issue.id === issueId ? { ...issue, ...mapIssue(detail, assets, currentUser), aiStatus: 'success', aiAnalysis: issue.aiAnalysis } : issue));
      showToast('اكتمل تحليل البلاغ على الخادم');
    } catch (error) {
      setIssues(prev => prev.map(issue => issue.id === issueId ? { ...issue, aiStatus: 'failed' } : issue));
      showToast('تعذر تحليل البلاغ', String(error), 'danger');
    }
  };

  const setManualSeverity = (issueId: string, severity: SeverityLevel | null) => {
    if (severity === 'critical') {
      showToast('قيمة غير مدعومة', 'الخادم يقبل low / medium / high فقط', 'danger');
      return;
    }
    // Do not mutate local state or show success before Laravel confirms persistence.
    void (async () => {
      try {
        await apiRequest(`/api/issues/${issueId}/severity`, {
          method: 'PATCH',
          body: JSON.stringify({ manual_severity: severity }),
        });
        const detail = unwrap(await apiRequest(`/api/issues/${issueId}`));
        setIssues(prev => prev.map(issue => issue.id === issueId
          ? mapIssue(detail, assets, currentUser)
          : issue));
        soundManager.playButtonClick();
        showToast(language === 'en' ? 'Severity updated' : 'تم حفظ شدة العطل', undefined, 'success');
      } catch (error) {
        showToast('تعذر حفظ الشدة على الخادم', String(error), 'danger');
      }
    })();
  };

  const createWorkOrderFromIssue = (_issueId: string): WorkOrder => {
    showToast('تعذر إنشاء أمر عمل', 'هذه العملية تتطلب Endpoint غير موجود في نسخة Backend', 'danger');
    throw new Error('Work order API is not available in the supplied backend');
  };

  // Changing the displayed role must never impersonate another authenticated user.
  const switchRole = (_role: 'admin' | 'technician' | 'reporter') => {
    showToast('التبديل بين الأدوار غير متاح', 'سجّل الدخول بالحساب المخصص للدور المطلوب', 'info');
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
        isAuthenticated: authenticated,
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

      {isAuthChecking ? (
  <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent mx-auto mb-4" />
      <p>جارٍ التحقق من جلسة الدخول...</p>
    </div>
  </div>
) : (
  children
)}

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
