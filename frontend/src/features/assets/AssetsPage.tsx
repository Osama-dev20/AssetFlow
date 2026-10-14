import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useMockStore, type Asset } from '../../data/mockStore';
import { DataTable, type Column } from '../../shared/ui/DataTable';
import { StatusChip } from '../../shared/ui/StatusChip';
import { PageHeader } from '../../shared/ui/PageHeader';
import { FilterBar } from './FilterBar';
import { AssetFormDialog } from './AssetFormDialog';
import {
  Box,
  Building2,
  Edit2,
  ExternalLink,
  Plus,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';

export const AssetsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language, addToast } = useApp();
  const store = useMockStore();
  const isRTL = language === 'ar';

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const assets = store.getAssets();
  const sites = store.getSites();

  // URL search params sync
  const searchQuery = searchParams.get('search') || '';
  const siteFilter = searchParams.get('site') || 'all';
  const statusFilter = searchParams.get('status') || 'all';

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSite = siteFilter === 'all' || asset.siteId === siteFilter;
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;

    return matchesSearch && matchesSite && matchesStatus;
  });

  const handleCreateOrUpdate = (data: any) => {
    const targetSite = sites.find((s) => s.id === data.siteId);
    const siteName = targetSite ? targetSite.name : 'Unknown Site';

    if (editingAsset) {
      store.updateAsset(editingAsset.id, { ...data, siteName });
      addToast({
        type: 'success',
        title: isRTL ? 'تم تحديث الأصل' : 'Asset Updated',
        description: isRTL
          ? `تم تحديث بيانات "${data.name}" بنجاح.`
          : `Asset "${data.name}" was updated.`,
      });
    } else {
      store.addAsset({
        ...data,
        siteName,
      });
      addToast({
        type: 'success',
        title: isRTL ? 'تم تسجيل الأصل' : 'Asset Created',
        description: isRTL
          ? `تم تسجيل "${data.name}" في المنظومة بنجاح.`
          : `Asset "${data.name}" registered successfully.`,
      });
    }
    setIsFormOpen(false);
    setEditingAsset(null);
  };

  const columns: Column<Asset>[] = [
    {
      key: 'code',
      header: isRTL ? 'كود الأصل' : 'Asset Code',
      sortable: true,
      className: 'w-36',
      render: (asset) => (
        <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20" dir="ltr">
          {asset.code}
        </span>
      ),
    },
    {
      key: 'name',
      header: isRTL ? 'اسم الأصل والمعدة' : 'Asset Name',
      sortable: true,
      render: (asset) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
            <Box className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <span className="font-semibold text-white block hover:text-blue-400 transition-colors">
              {asset.name}
            </span>
            <span className="text-xs text-slate-400">{asset.category}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'siteName',
      header: isRTL ? 'الموقع التشغيلي' : 'Site',
      sortable: true,
      render: (asset) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <Building2 className="w-3.5 h-3.5 text-slate-500" />
          <span>{asset.siteName}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: isRTL ? 'الحالة التشغيلية' : 'Status',
      sortable: true,
      render: (asset) => (
        <StatusChip
          status={asset.status}
          label={
            asset.status === 'operational'
              ? isRTL
                ? 'يعمل (جاهز)'
                : 'Operational'
              : asset.status === 'maintenance'
              ? isRTL
                ? 'تحت الصيانة'
                : 'In Maintenance'
              : isRTL
              ? 'خارج الخدمة'
              : 'Out of Service'
          }
        />
      ),
    },
    {
      key: 'criticalServiceIds',
      header: isRTL ? 'الخدمات الحرجة' : 'Critical Services',
      sortable: true,
      sortKey: (asset) => asset.criticalServiceIds.length,
      render: (asset) => (
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span className="text-xs font-semibold text-slate-200">
            {asset.criticalServiceIds.length} {isRTL ? 'خدمات' : 'services'}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: isRTL ? 'الإجراءات' : 'Actions',
      className: 'text-end',
      render: (asset) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => {
              navigate(`/dashboard/assets/${asset.id}`);
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 hover:text-white border border-blue-500/30 hover:border-blue-400 transition-all cursor-pointer shadow-xs group"
            title={isRTL ? `فتح تفاصيل الأصل: ${asset.name}` : `View Details: ${asset.name}`}
          >
            <span>{isRTL ? 'عرض' : 'View'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingAsset(asset);
              setIsFormOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isRTL ? 'تعديل الأصل' : 'Edit Asset'}
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Page Header */}
      <PageHeader
        title={isRTL ? 'سجل الأصول والمعدات التشغيلية' : 'Assets & Equipment Directory'}
        description={
          isRTL
            ? 'متابعة كافة المعدات والماكينات الحيوية وتصنيفاتها وربطها بالمواقع ومصفوفة الخدمات الحرجة.'
            : 'Comprehensive registry of industrial machinery, HVAC, pumps, and mission-critical assets.'
        }
        badge={`${assets.length} ${isRTL ? 'أصل مسجل' : 'Assets'}`}
        actionText={isRTL ? 'تسجيل أصل جديد' : 'Register New Asset'}
        onAction={() => {
          setEditingAsset(null);
          setIsFormOpen(true);
        }}
        actionIcon={Plus}
      />

      {/* Synchronized URL Filter Bar */}
      <FilterBar />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredAssets}
        keyExtractor={(a) => a.id}
        onRowClick={(asset) => navigate(`/dashboard/assets/${asset.id}`)}
        emptyTitle={isRTL ? 'لا توجد أصول مطابقة' : 'No assets found'}
        emptyDescription={
          isRTL
            ? 'لم يتم العثور على أي أصل يطابق الفلاتر أو معايير البحث الحالية في الرابط.'
            : 'No assets matched the active URL query parameters.'
        }
      />

      {/* Asset Form Dialog */}
      <AssetFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAsset(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingAsset}
      />
    </div>
  );
};

export default AssetsPage;
