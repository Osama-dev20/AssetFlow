import { useState, useEffect } from 'react';
import type { UserRole, AccountStatus } from '../types';

export interface ManagedUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  department: string;
  createdAt: string;
}

export interface Site {
  id: string;
  name: string;
  code: string;
  address: string;
  status: AccountStatus;
  assetCount: number;
  createdAt: string;
}

export interface CriticalService {
  id: string;
  name: string;
  code: string;
  description: string;
  criticality: 'high' | 'medium' | 'low';
  status: 'active' | 'degraded' | 'out_of_service';
  linkedAssetCount: number;
}

export interface Asset {
  id: string;
  code: string;
  name: string;
  siteId: string;
  siteName: string;
  status: 'operational' | 'maintenance' | 'out_of_service';
  description: string;
  category: string;
  criticalServiceIds: string[];
  createdAt: string;
}

export interface WorkOrder {
  id: string;
  code: string;
  title: string;
  description: string;
  assetId: string;
  assetName: string;
  assetCode: string;
  siteId: string;
  siteName: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'completed';
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  reportedBy: string;
  dueDate: string;
  createdAt: string;
}

// Initial Seeds
const INITIAL_USERS: ManagedUser[] = [
  {
    id: 'usr_1',
    fullName: 'طارق النابلسي (Tariq Nabulsi)',
    email: 'admin@assetflow.io',
    role: 'admin',
    status: 'active',
    department: 'إدارة العمليات المركزية',
    createdAt: '2026-01-10',
  },
  {
    id: 'usr_2',
    fullName: 'أحمد خليل (Ahmad Khalil)',
    email: 'tech@assetflow.io',
    role: 'technician',
    status: 'active',
    department: 'فريق الصيانة الميكانيكية',
    createdAt: '2026-02-14',
  },
  {
    id: 'usr_3',
    fullName: 'سارة الحسن (Sarah Hassan)',
    email: 'reporter@assetflow.io',
    role: 'reporter',
    status: 'active',
    department: 'إدارة تشغيل المواقع',
    createdAt: '2026-03-01',
  },
  {
    id: 'usr_4',
    fullName: 'خالد عمر (Khaled Omar)',
    email: 'inactive@assetflow.io',
    role: 'technician',
    status: 'inactive',
    department: 'الصيانة الوقائية',
    createdAt: '2026-03-15',
  },
  {
    id: 'usr_5',
    fullName: 'نور منصور (Nour Mansour)',
    email: 'nour.m@assetflow.io',
    role: 'technician',
    status: 'active',
    department: 'الصيانة الكهربائية وأنظمة التحكم',
    createdAt: '2026-04-20',
  },
  {
    id: 'usr_6',
    fullName: 'يوسف القاضي (Youssef Al-Qadi)',
    email: 'youssef.q@assetflow.io',
    role: 'admin',
    status: 'active',
    department: 'إدارة الأصول والسلامة (EHS)',
    createdAt: '2026-05-12',
  },
];

const INITIAL_SITES: Site[] = [
  {
    id: 'site_1',
    name: 'مجمع المصانع الشمالية - نابلس',
    code: 'SITE-IND-01',
    address: 'نابلس - المنطقة الصناعية الشرقية',
    status: 'active',
    assetCount: 142,
    createdAt: '2026-01-05',
  },
  {
    id: 'site_2',
    name: 'محطة تحلية وضخ المياه المركزية',
    code: 'SITE-WTR-02',
    address: 'غزة - شارع الرشيد الساحلي',
    status: 'active',
    assetCount: 88,
    createdAt: '2026-01-18',
  },
  {
    id: 'site_3',
    name: 'مستشفى الأمل التخصصي',
    code: 'SITE-MED-03',
    address: 'رام الله - حي الماصيون',
    status: 'active',
    assetCount: 215,
    createdAt: '2026-02-02',
  },
  {
    id: 'site_4',
    name: 'مجمع المولدات الاحتياطية الجنوبي',
    code: 'SITE-PWR-04',
    address: 'الخليل - المنطقة الصناعية',
    status: 'inactive',
    assetCount: 34,
    createdAt: '2026-02-28',
  },
];

const INITIAL_SERVICES: CriticalService[] = [
  {
    id: 'srv_1',
    name: 'تغذية غرف العمليات الجراحية بالطاقة النظيفة',
    code: 'SRV-PWR-CRIT',
    description: 'خط كهرباء طوارئ فائق الاستقرار غير منقطع (UPS + Generator) لحضانات الأطفال وغرف العمليات.',
    criticality: 'high',
    status: 'active',
    linkedAssetCount: 2,
  },
  {
    id: 'srv_2',
    name: 'شبكة ضخ وتبريد خطوط الإنتاج الكيميائي',
    code: 'SRV-COOL-01',
    description: 'مياه تبريد مضغوطة باستمرار لمنع ارتفاع درجات حرارة المفاعلات الصناعية.',
    criticality: 'high',
    status: 'active',
    linkedAssetCount: 3,
  },
  {
    id: 'srv_3',
    name: 'منظومة إمداد الأكسجين الطبي المركزي',
    code: 'SRV-O2-MED',
    description: 'شبكة أنابيب غازات طبية مركزية فائقة النقاء للأجنحة والعناية الحثيثة.',
    criticality: 'high',
    status: 'active',
    linkedAssetCount: 2,
  },
  {
    id: 'srv_4',
    name: 'نظام إطفاء الحريق والإنذار المبكر',
    code: 'SRV-FIRE-01',
    description: 'مضخات حريق ديزل وكهربائية متصلة بحساسات ضغط وشبكة رشاشات مائية.',
    criticality: 'medium',
    status: 'active',
    linkedAssetCount: 1,
  },
  {
    id: 'srv_5',
    name: 'شبكة التكييف المركزي وتنقية الهواء',
    code: 'SRV-HVAC-02',
    description: 'وحدات معالجة الهواء وفلاتر HEPA للمباني الإدارية والمعامل.',
    criticality: 'low',
    status: 'active',
    linkedAssetCount: 1,
  },
];

const INITIAL_ASSETS: Asset[] = [
  {
    id: 'ast_1',
    code: 'AST-PUMP-101',
    name: 'مضخة الطرد المركزي متعددة المراحل #1',
    siteId: 'site_2',
    siteName: 'محطة تحلية وضخ المياه المركزية',
    status: 'operational',
    description: 'مضخة رأسية ألمانية الصنع بقدرة 75 كيلوواط، تدعم ضخ المياه للتبريد الصناعي.',
    category: 'المضخات وميكانيكا السوائل',
    criticalServiceIds: ['srv_2'],
    createdAt: '2026-02-10',
  },
  {
    id: 'ast_2',
    code: 'AST-GEN-204',
    name: 'المولد الكهربائي التوربيني الاحتياطي 1500kVA',
    siteId: 'site_3',
    siteName: 'مستشفى الأمل التخصصي',
    status: 'operational',
    description: 'مولد ديزل كاتربيلر ثقيل مزود بوحدة ATS للتحويل التلقائي خلال 4 ثوانٍ من انقطاع التيار.',
    category: 'الطاقة وتوليد الكهرباء',
    criticalServiceIds: ['srv_1', 'srv_3'],
    createdAt: '2026-02-15',
  },
  {
    id: 'ast_3',
    code: 'AST-O2-302',
    name: 'ضاغط ومولد الأكسجين الطبي عالي النقاء',
    siteId: 'site_3',
    siteName: 'مستشفى الأمل التخصصي',
    status: 'operational',
    description: 'محطة توليد أكسجين تعمل بتقنية PSA لإنتاج غاز نقي بنسبة 99.5%.',
    category: 'المعدات الطبية الحرجة',
    criticalServiceIds: ['srv_3'],
    createdAt: '2026-03-01',
  },
  {
    id: 'ast_4',
    code: 'AST-PUMP-102',
    name: 'مضخة مياه الطرد المركزي الاحتياطية #2',
    siteId: 'site_2',
    siteName: 'محطة تحلية وضخ المياه المركزية',
    status: 'maintenance',
    description: 'تخضع حالياً لأعمال استبدال المانع الميكانيكي (Mechanical Seal) وفحص المحامل.',
    category: 'المضخات وميكانيكا السوائل',
    criticalServiceIds: ['srv_2'],
    createdAt: '2026-03-11',
  },
  {
    id: 'ast_5',
    code: 'AST-CHILL-401',
    name: 'وحدة التبريد الصناعي المركزي Chiller A',
    siteId: 'site_1',
    siteName: 'مجمع المصانع الشمالية - نابلس',
    status: 'operational',
    description: 'تشيلر لولبي بقدرة 300 طن تبريد مزود بمتحكم دقيق ومستشعرات حرارة عن بُعد.',
    category: 'التبريد والتكييف الصناعي',
    criticalServiceIds: ['srv_2', 'srv_5'],
    createdAt: '2026-03-20',
  },
  {
    id: 'ast_6',
    code: 'AST-FIRE-501',
    name: 'محطة مضخات مكافحة الحريق الرئيسية UL/FM',
    siteId: 'site_1',
    siteName: 'مجمع المصانع الشمالية - نابلس',
    status: 'operational',
    description: 'مضخة حريق معتمدة بقدرة 1000 GPM ومحرك ديزل متصل بشبكة الإنذار المركزي.',
    category: 'السلامة والامتثال EHS',
    criticalServiceIds: ['srv_4'],
    createdAt: '2026-04-05',
  },
];

const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'wo_1',
    code: 'WO-2026-101',
    title: 'استبدال المانع الميكانيكي (Mechanical Seal) للمضخة #1',
    description: 'تسريب طفيف في حلقة المانع الميكانيكي، يلزم الفك والتنظيف واستبدال طقم الحلقات المطاطية.',
    assetId: 'ast_1',
    assetName: 'مضخة الطرد المركزي متعددة المراحل #1',
    assetCode: 'AST-PUMP-101',
    siteId: 'site_2',
    siteName: 'محطة تحلية وضخ المياه المركزية',
    priority: 'high',
    status: 'in_progress',
    assignedTechnicianId: 'usr_2',
    assignedTechnicianName: 'أحمد خليل (Ahmad Khalil)',
    reportedBy: 'سارة الحسن',
    dueDate: '2026-10-18',
    createdAt: '2026-10-10',
  },
  {
    id: 'wo_2',
    code: 'WO-2026-102',
    title: 'فحص دوري واختبار التحويل التلقائي ATS للمولد التوربيني',
    description: 'اختبار محاكاة انقطاع التيار الكهربائي والتأكد من استجابة المولد خلال 4 ثوانٍ دون انقطاع الطاقة عن غرف العمليات.',
    assetId: 'ast_2',
    assetName: 'المولد الكهربائي التوربيني الاحتياطي 1500kVA',
    assetCode: 'AST-GEN-204',
    siteId: 'site_3',
    siteName: 'مستشفى الأمل التخصصي',
    priority: 'critical',
    status: 'open',
    assignedTechnicianId: 'usr_2',
    assignedTechnicianName: 'أحمد خليل (Ahmad Khalil)',
    reportedBy: 'طارق النابلسي',
    dueDate: '2026-10-15',
    createdAt: '2026-10-11',
  },
  {
    id: 'wo_3',
    code: 'WO-2026-103',
    title: 'معايرة مستشعرات ضغط ونقاء شبكة الأكسجين الطبي PSA',
    description: 'معايرة الحساسات الكهروكيميائية والتأكد من تجاوز نسبة النقاء 99.5% وتوثيق تقرير الامتثال.',
    assetId: 'ast_3',
    assetName: 'ضاغط ومولد الأكسجين الطبي عالي النقاء',
    assetCode: 'AST-O2-302',
    siteId: 'site_3',
    siteName: 'مستشفى الأمل التخصصي',
    priority: 'critical',
    status: 'completed',
    assignedTechnicianId: 'usr_5',
    assignedTechnicianName: 'نور منصور (Nour Mansour)',
    reportedBy: 'سارة الحسن',
    dueDate: '2026-10-12',
    createdAt: '2026-10-08',
  },
  {
    id: 'wo_4',
    code: 'WO-2026-104',
    title: 'فحص دورة التبريد وضغط غاز الفريون Chiller A',
    description: 'مراجعة قراءات الضغط العالي والمنخفض وتنظيف مبادل الحرارة المائي لرفع كفاءة تبريد المفاعلات.',
    assetId: 'ast_5',
    assetName: 'وحدة التبريد الصناعي المركزي Chiller A',
    assetCode: 'AST-CHILL-401',
    siteId: 'site_1',
    siteName: 'مجمع المصانع الشمالية - نابلس',
    priority: 'medium',
    status: 'open',
    assignedTechnicianId: 'usr_2',
    assignedTechnicianName: 'أحمد خليل (Ahmad Khalil)',
    reportedBy: 'سارة الحسن',
    dueDate: '2026-10-22',
    createdAt: '2026-10-12',
  },
];

// Reactive Store Implementation with LocalStorage persistence
class Store {
  private users: ManagedUser[];
  private sites: Site[];
  private services: CriticalService[];
  private assets: Asset[];
  private workOrders: WorkOrder[];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.users = this.load('af_users', INITIAL_USERS);
    this.sites = this.load('af_sites', INITIAL_SITES);
    this.services = this.load('af_services', INITIAL_SERVICES);
    this.assets = this.load('af_assets', INITIAL_ASSETS);
    this.workOrders = this.load('af_work_orders', INITIAL_WORK_ORDERS);
  }

  private load<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private save() {
    try {
      localStorage.setItem('af_users', JSON.stringify(this.users));
      localStorage.setItem('af_sites', JSON.stringify(this.sites));
      localStorage.setItem('af_services', JSON.stringify(this.services));
      localStorage.setItem('af_assets', JSON.stringify(this.assets));
      localStorage.setItem('af_work_orders', JSON.stringify(this.workOrders));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  // --- Users API ---
  public getUsers(): ManagedUser[] {
    return [...this.users];
  }

  public addUser(user: Omit<ManagedUser, 'id' | 'createdAt'>): ManagedUser {
    const newUser: ManagedUser = {
      ...user,
      id: 'usr_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.users = [newUser, ...this.users];
    this.save();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<ManagedUser>): ManagedUser | null {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...updates };
    this.save();
    return this.users[idx];
  }

  public toggleUserStatus(id: string): ManagedUser | null {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    const nextStatus: AccountStatus = user.status === 'active' ? 'inactive' : 'active';
    return this.updateUser(id, { status: nextStatus });
  }

  // --- Sites API ---
  public getSites(): Site[] {
    return [...this.sites];
  }

  public addSite(site: Omit<Site, 'id' | 'createdAt' | 'assetCount'>): Site {
    const newSite: Site = {
      ...site,
      id: 'site_' + Date.now(),
      assetCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.sites = [newSite, ...this.sites];
    this.save();
    return newSite;
  }

  public updateSite(id: string, updates: Partial<Site>): Site | null {
    const idx = this.sites.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.sites[idx] = { ...this.sites[idx], ...updates };
    this.save();
    return this.sites[idx];
  }

  public toggleSiteStatus(id: string): Site | null {
    const site = this.sites.find((s) => s.id === id);
    if (!site) return null;
    const nextStatus: AccountStatus = site.status === 'active' ? 'inactive' : 'active';
    return this.updateSite(id, { status: nextStatus });
  }

  // --- Critical Services API ---
  public getServices(): CriticalService[] {
    return [...this.services];
  }

  public addService(service: Omit<CriticalService, 'id' | 'linkedAssetCount'>): CriticalService {
    const newService: CriticalService = {
      ...service,
      id: 'srv_' + Date.now(),
      linkedAssetCount: 0,
    };
    this.services = [newService, ...this.services];
    this.save();
    return newService;
  }

  public updateService(id: string, updates: Partial<CriticalService>): CriticalService | null {
    const idx = this.services.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.services[idx] = { ...this.services[idx], ...updates };
    this.save();
    return this.services[idx];
  }

  // --- Assets API ---
  public getAssets(): Asset[] {
    return [...this.assets];
  }

  public getAssetById(id: string): Asset | undefined {
    return this.assets.find((a) => a.id === id);
  }

  public addAsset(asset: Omit<Asset, 'id' | 'createdAt' | 'criticalServiceIds'>): Asset {
    const newAsset: Asset = {
      ...asset,
      id: 'ast_' + Date.now(),
      criticalServiceIds: [],
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.assets = [newAsset, ...this.assets];

    // Update site assetCount
    const site = this.sites.find((s) => s.id === asset.siteId);
    if (site) {
      site.assetCount += 1;
    }

    this.save();
    return newAsset;
  }

  public updateAsset(id: string, updates: Partial<Asset>): Asset | null {
    const idx = this.assets.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.assets[idx] = { ...this.assets[idx], ...updates };
    this.save();
    return this.assets[idx];
  }

  // --- Linking API: Asset <-> Critical Services ---
  public linkAssetToService(assetId: string, serviceId: string): boolean {
    const asset = this.assets.find((a) => a.id === assetId);
    const service = this.services.find((s) => s.id === serviceId);
    if (!asset || !service) return false;

    if (!asset.criticalServiceIds.includes(serviceId)) {
      asset.criticalServiceIds.push(serviceId);
      service.linkedAssetCount = (service.linkedAssetCount || 0) + 1;
      this.save();
      return true;
    }
    return false;
  }

  public unlinkAssetFromService(assetId: string, serviceId: string): boolean {
    const asset = this.assets.find((a) => a.id === assetId);
    const service = this.services.find((s) => s.id === serviceId);
    if (!asset) return false;

    if (asset.criticalServiceIds.includes(serviceId)) {
      asset.criticalServiceIds = asset.criticalServiceIds.filter((id) => id !== serviceId);
      if (service && service.linkedAssetCount > 0) {
        service.linkedAssetCount -= 1;
      }
      this.save();
      return true;
    }
    return false;
  }

  public getServicesForAsset(assetId: string): CriticalService[] {
    const asset = this.assets.find((a) => a.id === assetId);
    if (!asset) return [];
    return this.services.filter((s) => asset.criticalServiceIds.includes(s.id));
  }

  // --- Work Orders API ---
  public getWorkOrders(): WorkOrder[] {
    return [...this.workOrders];
  }

  public getWorkOrderById(id: string): WorkOrder | undefined {
    return this.workOrders.find((w) => w.id === id);
  }

  public addWorkOrder(wo: Omit<WorkOrder, 'id' | 'code' | 'createdAt'>): WorkOrder {
    const num = Math.floor(100 + Math.random() * 900);
    const newWo: WorkOrder = {
      ...wo,
      id: 'wo_' + Date.now(),
      code: `WO-2026-${num}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.workOrders = [newWo, ...this.workOrders];
    this.save();
    return newWo;
  }

  public updateWorkOrder(id: string, updates: Partial<WorkOrder>): WorkOrder | null {
    const idx = this.workOrders.findIndex((w) => w.id === id);
    if (idx === -1) return null;
    this.workOrders[idx] = { ...this.workOrders[idx], ...updates };
    this.save();
    return this.workOrders[idx];
  }

  public updateWorkOrderStatus(id: string, status: 'open' | 'in_progress' | 'completed'): WorkOrder | null {
    return this.updateWorkOrder(id, { status });
  }
}

export const mockStore = new Store();

// React Hook to consume reactive store
export function useMockStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = mockStore.subscribe(() => setTick((t) => t + 1));
    return () => {
      unsubscribe();
    };
  }, []);

  return mockStore;
}
