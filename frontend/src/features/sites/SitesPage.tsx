import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useMockStore, type Site } from '../../data/mockStore';
import { DataTable, type Column } from '../../shared/ui/DataTable';
import { StatusChip } from '../../shared/ui/StatusChip';
import { ConfirmDialog } from '../../shared/ui/ConfirmDialog';
import { PageHeader } from '../../shared/ui/PageHeader';
import { SiteFormDialog } from './SiteFormDialog';
import {
  Building2,
  Edit2,
  Power,
  PowerOff,
  MapPin,
  Box,
  Plus,
  Search,
  ArrowUpRight,
} from 'lucide-react';

export const SitesPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, addToast } = useApp();
  const store = useMockStore();
  const isRTL = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<Site | null>(null);

  const sites = store.getSites();

  // Search filter
  const filteredSites = sites.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateOrUpdate = (data: any) => {
    if (editingSite) {
      store.updateSite(editingSite.id, data);
      addToast({
        type: 'success',
        title: isRTL ? 'تم تحديث الموقع' : 'Site updated',
        description: isRTL
          ? `تم تحديث بيانات "${data.name}" بنجاح.`
          : `Site "${data.name}" was updated successfully.`,
      });
    } else {
      store.addSite({
        ...data,
        status: 'active',
      });
      addToast({
        type: 'success',
        title: isRTL ? 'تمت إضافة الموقع' : 'Site created',
        description: isRTL
          ? `تمت إضافة "${data.name}" إلى النظام بنجاح.`
          : `Site "${data.name}" added successfully.`,
      });
    }
    setIsFormOpen(false);
    setEditingSite(null);
  };

  const handleToggleStatusConfirm = () => {
    if (!confirmTarget) return;
    const updated = store.toggleSiteStatus(confirmTarget.id);
    if (updated) {
      addToast({
        type: updated.status === 'active' ? 'success' : 'warning',
        title:
          updated.status === 'active'
            ? isRTL
              ? 'تم تفعيل الموقع'
              : 'Site Activated'
            : isRTL
            ? 'تم تعطيل الموقع'
            : 'Site Deactivated',
        description: isRTL
          ? `حالة موقع "${confirmTarget.name}" أصبحت: ${
              updated.status === 'active' ? 'نشط' : 'غير نشط'
            }.`
          : `Site "${confirmTarget.name}" status is now ${updated.status}.`,
      });
    }
    setConfirmTarget(null);
  };

  const columns: Column<Site>[] = [
    {
      key: 'name',
      header: isRTL ? 'اسم الموقع والمنشأة' : 'Site Name',
      sortable: true,
      render: (site) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold text-white block">{site.name}</span>
            <span className="text-xs text-slate-400 font-mono tracking-wider" dir="ltr">
              {site.code}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'address',
      header: isRTL ? 'العنوان الجغرافي' : 'Address / City',
      sortable: true,
      render: (site) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span>{site.address}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: isRTL ? 'الحالة التشغيلية' : 'Status',
      sortable: true,
      render: (site) => (
        <StatusChip
          status={site.status}
          label={
            site.status === 'active'
              ? isRTL
                ? 'موقع نشط'
                : 'Active'
              : isRTL
              ? 'معطّل (خارج الخدمة)'
              : 'Deactivated'
          }
        />
      ),
    },
    {
      key: 'assetCount',
      header: isRTL ? 'عدد الأصول المسجلة' : 'Assets Count',
      sortable: true,
      render: (site) => (
        <Link
          to={`/dashboard/assets?site=${site.id}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 hover:text-white transition-all group cursor-pointer shadow-xs"
          title={isRTL ? 'استعراض أصول هذا الموقع' : 'Filter assets by this site'}
        >
          <Box className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-xs">
            {site.assetCount} {isRTL ? 'أصل' : 'assets'}
          </span>
          <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-blue-300 transition-colors" />
        </Link>
      ),
    },
    {
      key: 'actions',
      header: isRTL ? 'الإجراءات' : 'Actions',
      className: 'text-end',
      render: (site) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {/* Quick link to site assets */}
          <button
            type="button"
            onClick={() => navigate(`/dashboard/assets?site=${site.id}`)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors cursor-pointer"
            title={isRTL ? 'استعراض كافة أصول الموقع' : 'View Site Assets'}
          >
            <Box className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingSite(site);
              setIsFormOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isRTL ? 'تعديل بيانات الموقع' : 'Edit Site'}
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setConfirmTarget(site)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              site.status === 'active'
                ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
                : 'text-rose-400 hover:text-emerald-400 hover:bg-emerald-500/10'
            }`}
            title={
              site.status === 'active'
                ? isRTL
                  ? 'تعطيل الموقع (حذف ناعم)'
                  : 'Deactivate Site'
                : isRTL
                ? 'إعادة تفعيل الموقع'
                : 'Activate Site'
            }
          >
            {site.status === 'active' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Page Header */}
      <PageHeader
        title={isRTL ? 'إدارة المواقع والمنشآت' : 'Sites & Facilities Management'}
        description={
          isRTL
            ? 'الهيكلية الجغرافية لمواقع العمل والمصانع ومراكز التشغيل ومتابعة كثافة الأصول في كل موقع.'
            : 'Operational sites, industrial plants, facilities structure and asset density tracking.'
        }
        badge={`${sites.length} ${isRTL ? 'مواقع' : 'Sites'}`}
        actionText={isRTL ? 'إضافة موقع جديد' : 'Add New Site'}
        onAction={() => {
          setEditingSite(null);
          setIsFormOpen(true);
        }}
        actionIcon={Plus}
      />

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRTL ? 'بحث بالاسم، الكود أو المدينة...' : 'Search by site name, code or city...'}
            className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
          />
          <Search
            className={`w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 ${
              isRTL ? 'left-3' : 'right-3'
            }`}
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredSites}
        keyExtractor={(s) => s.id}
        emptyTitle={isRTL ? 'لا توجد مواقع مطابقة' : 'No sites found'}
        emptyDescription={
          isRTL
            ? 'لم يتم العثور على أي موقع تشغيلي يطابق معايير البحث.'
            : 'No facilities match your search criteria.'
        }
      />

      {/* Create / Edit Form Modal */}
      <SiteFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSite(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingSite}
        existingCodes={sites.map((s) => s.code)}
      />

      {/* Soft Delete / Deactivate Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!confirmTarget}
        title={
          confirmTarget?.status === 'active'
            ? isRTL
              ? 'تأكيد تعطيل الموقع التشغيلي'
              : 'Deactivate Operational Site'
            : isRTL
            ? 'تأكيد إعادة تفعيل الموقع'
            : 'Activate Operational Site'
        }
        description={
          confirmTarget?.status === 'active'
            ? isRTL
              ? `هل تريد تعطيل موقع "${confirmTarget?.name}"؟ سيبقى سجل الأصول محفوظاً ولكن لن تتاح إضافة أصول جديدة عليه.`
              : `Are you sure you want to deactivate "${confirmTarget?.name}"? New assets cannot be assigned while deactivated.`
            : isRTL
            ? `هل تريد إعادة تفعيل موقع "${confirmTarget?.name}"؟`
            : `Are you sure you want to re-activate "${confirmTarget?.name}"?`
        }
        intent={confirmTarget?.status === 'active' ? 'danger' : 'info'}
        confirmText={
          confirmTarget?.status === 'active'
            ? isRTL
              ? 'نعم، تعطيل الموقع'
              : 'Deactivate'
            : isRTL
            ? 'نعم، تفعيل الموقع'
            : 'Activate'
        }
        onConfirm={handleToggleStatusConfirm}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
};

export default SitesPage;
