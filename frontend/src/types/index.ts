export type AssetStatus = 'operational' | 'maintenance' | 'stopped';
export type WorkOrderStatus = 'open' | 'in_progress' | 'waiting_parts' | 'completed';
export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';
export type ServiceStatus = 'stable' | 'at_risk' | 'down';

export interface Asset {
  id: string;
  name: string;
  nameEn?: string;
  code: string;
  siteId: string;
  siteName: string;
  siteNameEn?: string;
  category: string;
  categoryEn?: string;
  status: AssetStatus;
  criticalServiceId?: string;
  criticalServiceName?: string;
  criticalServiceNameEn?: string;
  hasBackup: boolean;
  backupAssetId?: string;
  backupAssetName?: string;
  priorityScore: number;
  installDate: string;
  warrantyExpiry: string;
  lastMaintenance: string;
  nextScheduledMaintenance: string;
  manufacturer: string;
  model: string;
  powerRating?: string;
  capacity?: string;
  locationDetails: string;
  locationDetailsEn?: string;
  operatingHours: number;
  mtbfHours: number;
  mttrHours: number;
  parts: SparePart[];
}

export interface SparePart {
  id: string;
  name: string;
  nameEn?: string;
  partNumber: string;
  inStock: number;
  minRequired: number;
  unitCost: number;
}

export interface WorkOrder {
  id: string;
  code: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  assetId: string;
  assetName: string;
  assetNameEn?: string;
  assetCode: string;
  siteName: string;
  siteNameEn?: string;
  status: WorkOrderStatus;
  priority: PriorityLevel;
  priorityScore: number;
  priorityBreakdown: {
    serviceImpact: number;
    noBackup: number;
    slaDelay: number;
    failureRate: number;
  };
  assignedTo?: {
    id: string;
    name: string;
    nameEn?: string;
    role: string;
    roleEn?: string;
    avatar: string;
  };
  createdAt: string;
  slaDueHours: number;
  hoursRemaining: number;
  partsUsed?: { name: string; quantity: number; cost: number }[];
  historyNotes?: { date: string; author: string; note: string }[];
}

export interface CriticalService {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  status: ServiceStatus;
  siteName: string;
  siteNameEn?: string;
  supportingAssetIds: string[];
  supportingAssetsCount: number;
  activeAssetsCount: number;
  hasRedundancy: boolean;
  downtimeCostPerHour: number;
}

export interface PreventivePlan {
  id: string;
  title: string;
  titleEn?: string;
  assetId: string;
  assetName: string;
  assetNameEn?: string;
  assetCode: string;
  siteName: string;
  siteNameEn?: string;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'hourly_500';
  nextDueDate: string;
  assignedTechnician: string;
  assignedTechnicianEn?: string;
  estimatedHours: number;
  checklist: { id: string; text: string; textEn?: string; done: boolean }[];
  status: 'scheduled' | 'overdue' | 'completed';
}

export interface Site {
  id: string;
  name: string;
  nameEn?: string;
  type: string;
  typeEn?: string;
  location: string;
  locationEn?: string;
  totalAssets: number;
  operationalAssets: number;
  managerName: string;
  managerNameEn?: string;
  contactPhone: string;
  criticalServicesCount: number;
  status: 'normal' | 'warning';
}

export interface TeamMember {
  id: string;
  name: string;
  nameEn?: string;
  role: 'admin' | 'operations' | 'technician' | 'reporter';
  roleArabic: string;
  roleEn?: string;
  email: string;
  phone: string;
  initials: string;
  avatar?: string;
  avatarGradient: string;
  activeOrdersCount: number;
  specialty: string;
  specialtyEn?: string;
  status: 'active' | 'busy' | 'offline';
  siteId?: string;
  siteName?: string;
  siteNameEn?: string;
}

export type IssueStatus = 'reported' | 'under_review' | 'work_order_created' | 'resolved';
export type AiStatus = 'not_analyzed' | 'analyzing' | 'success' | 'failed';
export type IssueCategory = 'mechanical' | 'electrical' | 'hydraulic' | 'hvac' | 'safety' | 'other';
export type ImpactLevel = 'high' | 'medium' | 'low' | 'unknown';
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface IssueAiAnalysis {
  category: IssueCategory;
  categoryArabic: string;
  categoryEn: string;
  severity: SeverityLevel;
  confidence: number;
  possibleCauses: string[];
  possibleCausesEn: string[];
  suggestedChecks: string[];
  suggestedChecksEn: string[];
  analyzedAt: string;
}

export interface IssueAffectedService {
  id: string;
  name: string;
  nameEn: string;
  siteName: string;
  siteNameEn: string;
  criticality: 'critical' | 'important' | 'normal';
  isGoverningImpact: boolean;
}

export interface Issue {
  id: string;
  number: number;
  assetId: string;
  assetName: string;
  assetNameEn?: string;
  assetCode: string;
  siteId: string;
  siteName: string;
  siteNameEn?: string;
  description: string;
  descriptionEn?: string;
  reportedBy: string;
  reportedByEn?: string;
  reportedByRole?: string;
  reportedByRoleEn?: string;
  reportedAt: string;
  status: IssueStatus;
  aiStatus: AiStatus;
  aiAnalysis?: IssueAiAnalysis;
  impact: {
    level: ImpactLevel;
    affectedServices: IssueAffectedService[];
    summaryArabic: string;
    summaryEn: string;
  };
  priority: {
    level: 'critical' | 'high' | 'medium' | 'low' | 'incomplete';
    score: number;
    severityUsed: SeverityLevel;
    severitySource: 'ai' | 'manual' | 'default';
    manualSeverity?: SeverityLevel | null;
    reasonArabic: string;
    reasonEn: string;
  };
  workOrderId?: string;
}

export interface PriorityWeights {
  serviceImpact: number; // default 40
  noBackup: number;      // default 35
  slaDelay: number;      // default 12
  failureRate: number;   // default 9
  criticalThreshold: number; // 75
  highThreshold: number;     // 50
  mediumThreshold: number;   // 30
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  userEn?: string;
  action: string;
  actionEn?: string;
  target: string;
  targetEn?: string;
  category: 'work_order' | 'asset' | 'settings' | 'pm';
  details: string;
  detailsEn?: string;
}

export type AppPage = 
  | 'landing' 
  | 'login' 
  | 'signup' 
  | 'dashboard' 
  | 'assets' 
  | 'asset-detail' 
  | 'work-orders' 
  | 'services' 
  | 'preventive' 
  | 'sites' 
  | 'team' 
  | 'reports' 
  | 'settings' 
  | 'audit'
  | 'issues'
  | 'issues-new'
  | 'my-issues'
  | 'tech-portal'
  | 'profile'
  | 'access-error';
