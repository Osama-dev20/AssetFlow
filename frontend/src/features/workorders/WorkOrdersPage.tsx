import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useMockStore, type WorkOrder } from '../../data/mockStore';
import { DataTable, type Column } from '../../shared/ui/DataTable';
import { StatusChip } from '../../shared/ui/StatusChip';
import { PageHeader } from '../../shared/ui/PageHeader';
import { ConfirmDialog } from '../../shared/ui/ConfirmDialog';
import {
  Wrench,
  Box,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Play,
  Plus,
  Search,
  User,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

export const WorkOrdersPage: React.FC = () => {
  const { language, currentUser, addToast } = useApp();
  const store = useMockStore();
  const isRTL = language === 'ar';

  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get('status') || 'all';
  const priorityParam = searchParams.get('priority') || 'all';
  const searchQuery = searchParams.get('search') || '';

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAssetId, setNewAssetId] = useState('');
  const [newPriority, setNewPriority] = useState<'critical' | 'high' | 'medium' | 'low'>('high');
  const [newTechId, setNewTechId] = useState('');

  const workOrders = store.getWorkOrders();
  const assets = store.getAssets();
  const sites = store.getSites();
  const technicians = store.getUsers().filter((u) => u.role === 'technician');

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  // Filter list
  const filteredOrders = workOrders.filter((wo) => {
    const matchesSearch =
      wo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.siteName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusParam === 'all' || wo.status === statusParam;
    const matchesPriority = priorityParam === 'all' || wo.priority === priorityParam;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAssetId) return;

    const asset = assets.find((a) => a.id === newAssetId);
    if (!asset) return;

    const tech = technicians.find((t) => t.id === newTechId);

    const newWo = store.addWorkOrder({
      title: newTitle.trim(),
      description: newDescription.trim(),
      assetId: asset.id,
      assetName: asset.name,
      assetCode: asset.code,
      siteId: asset.siteId,
      siteName: asset.siteName,
      priority: newPriority,
      status: 'open',
      assignedTechnicianId: tech?.id,
      assignedTechnicianName: tech ? tech.fullName : undefined,
      reportedBy: currentUser?.fullName || 'مشرف النظام',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    });

    addToast({
      type: 'success',
      title: isRTL ? 'تم إنشاء أمر العمل' : 'Work Order Created',
      description: isRTL
        ? `تم إصدار أمر العمل ${newWo.code} وإسناده للمتابعة.`
        : `Work Order ${newWo.code} issued successfully.`,
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewAssetId('');
  };

  const handleStatusChange = (wo: WorkOrder, nextStatus: 'open' | 'in_progress' | 'completed') => {
    store.updateWorkOrderStatus(wo.id, nextStatus);
    addToast({
      type: 'success',
      title: isRTL ? 'تم تحديث حالة أمر العمل' : 'Status Updated',
      description: isRTL
        ? `أمر العمل ${wo.code} أصبح الآن بحالة: ${
            nextStatus === 'in_progress' ? 'قيد التنفيذ' : nextStatus === 'completed' ? 'مكتمل' : 'مفتوح'
          }.`
        : `Order ${wo.code} is now ${nextStatus}.`,
    });
  };

  const columns: Column<WorkOrder>[] = [
    {
      key: 'code',
      header: isRTL ? 'كود الأمر' : 'Order Code',
      sortable: true,
      className: 'w-32',
      render: (wo) => (
        <span className="font-mono text-xs font-bold text-slate-200 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700" dir="ltr">
          {wo.code}
        </span>
      ),
    },
    {
      key: 'title',
      header: isRTL ? 'مهمة الصيانة والأصل التابع له' : 'Work Order & Asset',
      sortable: true,
      render: (wo) => (
        <div className="space-y-1 max-w-md">
          <span className="font-semibold text-white text-sm block">
            {wo.title}
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link
              to={`/dashboard/assets/${wo.assetId}`}
              className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 font-mono"
              dir="ltr"
              onClick={(e) => e.stopPropagation()}
            >
              <Box className="w-3.5 h-3.5" />
              <span>{wo.assetCode}</span>
            </Link>
            <span>•</span>
            <span className="truncate">{wo.assetName}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'siteName',
      header: isRTL ? 'الموقع' : 'Site',
      sortable: true,
      render: (wo) => (
        <Link
          to={`/dashboard/assets?site=${wo.siteId}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white"
        >
          <Building2 className="w-3.5 h-3.5 text-slate-500" />
          <span className="truncate max-w-[150px]">{wo.siteName}</span>
        </Link>
      ),
    },
    {
      key: 'priority',
      header: isRTL ? 'الأولوية' : 'Priority',
      sortable: true,
      render: (wo) => <StatusChip criticality={wo.priority} size="sm" />,
    },
    {
      key: 'status',
      header: isRTL ? 'الحالة' : 'Status',
      sortable: true,
      render: (wo) => (
        <StatusChip
          status={wo.status === 'open' ? 'pending' : wo.status === 'in_progress' ? 'maintenance' : 'active'}
          label={
            wo.status === 'open'
              ? isRTL
                ? 'مفتوح (جديد)'
                : 'Open'
              : wo.status === 'in_progress'
              ? isRTL
                ? 'قيد التنفيذ'
                : 'In Progress'
              : isRTL
              ? 'مكتمل'
              : 'Completed'
          }
          size="sm"
        />
      ),
    },
    {
      key: 'assignedTechnicianName',
      header: isRTL ? 'الفني المسند له' : 'Technician',
      render: (wo) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <User className="w-3.5 h-3.5 text-slate-500" />
          <span className="truncate max-w-[140px]">
            {wo.assignedTechnicianName || (isRTL ? 'غير مسند' : 'Unassigned')}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: isRTL ? 'الإجراء' : 'Action',
      className: 'text-end',
      render: (wo) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {wo.status === 'open' && (
            <button
              type="button"
              onClick={() => handleStatusChange(wo, 'in_progress')}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
              title={isRTL ? 'بدء العمل الميداني' : 'Start Progress'}
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isRTL ? 'بدء العمل' : 'Start'}</span>
            </button>
          )}

          {wo.status === 'in_progress' && (
            <button
              type="button"
              onClick={() => handleStatusChange(wo, 'completed')}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
              title={isRTL ? 'إغلاق أمر العمل كمكتمل' : 'Complete Order'}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>{isRTL ? 'إنجاز' : 'Complete'}</span>
            </button>
          )}

          {wo.status === 'completed' && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isRTL ? 'منجز' : 'Done'}</span>
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Page Header */}
      <PageHeader
        title={isRTL ? 'أوامر العمل والصيانة (CMMS)' : 'Work Orders & Maintenance (CMMS)'}
        description={
          isRTL
            ? 'متابعة وإسناد أوامر العمل الميدانية وربطها التلقائي بالأصول والمواقع وفريق الفنيين.'
            : 'Track, dispatch, and close maintenance work orders linked to industrial assets.'
        }
        badge={`${workOrders.length} ${isRTL ? 'أمر عمل' : 'Orders'}`}
        actionText={isRTL ? 'إنشاء أمر عمل جديد' : 'New Work Order'}
        onAction={() => {
          setNewAssetId(assets[0]?.id || '');
          setNewTechId(technicians[0]?.id || '');
          setIsCreateModalOpen(true);
        }}
        actionIcon={Plus}
      />

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/60 border border-slate-800/80 p-3.5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => updateParam('search', e.target.value)}
            placeholder={isRTL ? 'بحث برقم الأمر، الأصل، أو العنوان...' : 'Search order code, asset or title...'}
            className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
          />
          <Search
            className={`w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 ${
              isRTL ? 'left-3' : 'right-3'
            }`}
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          {/* Status Filter */}
          <select
            value={statusParam}
            onChange={(e) => updateParam('status', e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="all">{isRTL ? 'كافة الحالات' : 'All Statuses'}</option>
            <option value="open">{isRTL ? 'مفتوح (قيد الانتظار)' : 'Open'}</option>
            <option value="in_progress">{isRTL ? 'قيد التنفيذ' : 'In Progress'}</option>
            <option value="completed">{isRTL ? 'مكتمل ومغلق' : 'Completed'}</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityParam}
            onChange={(e) => updateParam('priority', e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="all">{isRTL ? 'كافة الأولويات' : 'All Priorities'}</option>
            <option value="critical">{isRTL ? 'حرجة (Critical)' : 'Critical'}</option>
            <option value="high">{isRTL ? 'عالية (High)' : 'High'}</option>
            <option value="medium">{isRTL ? 'متوسطة (Medium)' : 'Medium'}</option>
            <option value="low">{isRTL ? 'عادية (Low)' : 'Low'}</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        keyExtractor={(wo) => wo.id}
        emptyTitle={isRTL ? 'لا توجد أوامر عمل مطابقة' : 'No work orders found'}
        emptyDescription={
          isRTL
            ? 'لم يتم العثور على أوامر عمل مطابقة للبحث أو الفلتر المختار.'
            : 'No work orders match the current criteria.'
        }
      />

      {/* Create Modal Dialog */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs animate-fade-in"
            onClick={() => setIsCreateModalOpen(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl z-10 animate-scale-up text-start select-none"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 text-blue-400 flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {isRTL ? 'إصدار أمر عمل جديد (Work Order)' : 'Create Work Order'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isRTL
                      ? 'حدد الأصل والمعدة المطلوب صيانتها والفني المسؤول.'
                      : 'Assign maintenance work to asset and technician.'}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 pt-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isRTL ? 'عنوان مهمة الصيانة' : 'Task Title'} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={isRTL ? 'مثال: فحص دوري واستبدال فلاتر الزيت' : 'e.g. Periodic Oil Filter Replacement'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isRTL ? 'الأصل / المعدة المستهدفة' : 'Target Asset'} <span className="text-rose-400">*</span>
                </label>
                <select
                  value={newAssetId}
                  onChange={(e) => setNewAssetId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.code}) - {a.siteName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isRTL ? 'الأولوية والخطورة' : 'Priority'}
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="critical">{isRTL ? 'حرجة (Critical)' : 'Critical'}</option>
                    <option value="high">{isRTL ? 'عالية (High)' : 'High'}</option>
                    <option value="medium">{isRTL ? 'متوسطة (Medium)' : 'Medium'}</option>
                    <option value="low">{isRTL ? 'عادية (Low)' : 'Low'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isRTL ? 'الفني المسؤول' : 'Assigned Tech'}
                  </label>
                  <select
                    value={newTechId}
                    onChange={(e) => setNewTechId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                  >
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isRTL ? 'تفاصيل العطل أو خطة الصيانة' : 'Scope of Work'}
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder={isRTL ? 'شرح الإجراء المطلوب وقطع الغيار المقترحة...' : 'Explain required procedures...'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  {isRTL ? 'إصدار أمر العمل' : 'Issue Work Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkOrdersPage;
