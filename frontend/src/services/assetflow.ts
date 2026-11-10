import { apiRequest } from './api';
import type { Asset, Site, CriticalService, TeamMember, Issue, SeverityLevel } from '../types';

type RecordData = Record<string, any>;
export const unwrap = (response: any): RecordData => response?.data ?? response;
export async function allPages(path: string): Promise<RecordData[]> {
  const items: RecordData[] = [];
  let next: string | null = path;
  for (let page = 0; next && page < 30; page++) {
    const response: any = await apiRequest(next);
    items.push(...(Array.isArray(response?.data) ? response.data : []));
    const url: string | null = response?.links?.next ?? null;
    next = url ? `${new URL(url, window.location.origin).pathname}${new URL(url, window.location.origin).search}` : null;
  }
  return items;
}
const id = (value: unknown) => String(value ?? '');
const assetStatus = (status: string): Asset['status'] => status === 'under_maintenance' ? 'maintenance' : status === 'out_of_service' ? 'stopped' : 'operational';
export const serverAssetStatus = (status: Asset['status']) => status === 'maintenance' ? 'under_maintenance' : status === 'stopped' ? 'out_of_service' : 'operational';
export const mapAsset = (a: RecordData): Asset => ({
  id: id(a.id), name: a.name ?? '', code: a.code ?? '', siteId: id(a.site_id), siteName: a.site?.name ?? '',
  category: a.type ?? '', status: assetStatus(a.status), hasBackup: false, priorityScore: 0,
  installDate: '', warrantyExpiry: '', lastMaintenance: '', nextScheduledMaintenance: '',
  manufacturer: a.manufacturer ?? '', model: a.model ?? '', locationDetails: a.description ?? '',
  operatingHours: 0, mtbfHours: 0, mttrHours: 0, parts: [],
  criticalServiceId: a.critical_services?.[0] ? id(a.critical_services[0].id) : undefined,
  criticalServiceName: a.critical_services?.[0]?.name,
});
export const mapSite = (s: RecordData): Site => ({
  id: id(s.id), name: s.name ?? '', type: '', location: s.location ?? '', managerName: '', contactPhone: '',
  totalAssets: 0, operationalAssets: 0, criticalServicesCount: 0, status: 'normal',
});
export const mapService = (s: RecordData): CriticalService => ({
  id: id(s.id), name: s.name ?? '', description: s.description ?? '', status: 'stable', siteName: '',
  supportingAssetIds: [], supportingAssetsCount: 0, activeAssetsCount: 0,
  hasRedundancy: false, downtimeCostPerHour: 0,
});
export const mapMember = (u: RecordData): TeamMember => {
  const role: TeamMember['role'] = u.role === 'maintenance_manager' ? 'admin' : u.role === 'technician' ? 'technician' : 'reporter';
  return { id: id(u.id), name: u.name ?? '', email: u.email ?? '', role, roleArabic: role === 'admin' ? 'مدير الصيانة' : role === 'technician' ? 'فني' : 'مبلّغ',
    phone: '', initials: (u.name ?? 'U').slice(0, 2).toUpperCase(), avatarGradient: 'from-blue-600 to-teal-600',
    activeOrdersCount: 0, specialty: '', status: u.status === 'inactive' ? 'offline' : 'active' };
};
export const mapIssue = (i: RecordData, assets: Asset[], user?: TeamMember): Issue => {
  const asset = assets.find(a => a.id === id(i.asset_id));
  const impact = i.impact ?? {};
  const priority = i.priority ?? {};
  const level = (['high','medium','low'].includes(impact.level) ? impact.level : 'unknown') as Issue['impact']['level'];
  return {
    id: id(i.id), number: Number(i.id), assetId: id(i.asset_id), assetName: i.asset?.name ?? asset?.name ?? '',
    assetCode: i.asset?.code ?? asset?.code ?? '', siteId: asset?.siteId ?? '', siteName: asset?.siteName ?? '',
    description: i.description ?? '', reportedBy: i.reporter?.name ?? user?.name ?? '', reportedAt: i.created_at ?? '',
    status: (['reported','under_review','work_order_created','resolved'].includes(i.status) ? i.status : 'reported') as Issue['status'],
    aiStatus: 'not_analyzed', impact: {
      level, affectedServices: (impact.affected_services ?? []).map((s: RecordData) => ({
        id: id(s.id), name: s.name ?? '', nameEn: s.name ?? '', siteName: '', siteNameEn: '',
        criticality: s.criticality ?? 'normal', isGoverningImpact: false,
      })), summaryArabic: '', summaryEn: ''
    }, priority: {
      level: ['critical','high','medium','low'].includes(priority.level) ? priority.level : 'incomplete',
      score: 0, severityUsed: (priority.severity_used ?? 'medium') as SeverityLevel,
      severitySource: priority.severity_source ?? 'default', manualSeverity: priority.manual_severity,
      reasonArabic: priority.reason ?? '', reasonEn: priority.reason ?? ''
    }
  };
};
export const assetPayload = (a: Pick<Asset,'name'|'code'|'category'|'siteId'|'status'|'manufacturer'|'model'|'locationDetails'>) => ({
  name: a.name, code: a.code, type: a.category, site_id: Number(a.siteId), status: serverAssetStatus(a.status),
  manufacturer: a.manufacturer || null, model: a.model || null, description: a.locationDetails || null
});
