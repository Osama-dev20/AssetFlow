import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useMockStore, type CriticalService } from '../../data/mockStore';
import { DataTable, type Column } from '../../shared/ui/DataTable';
import { StatusChip } from '../../shared/ui/StatusChip';
import { PageHeader } from '../../shared/ui/PageHeader';
import { ServiceFormDialog } from './ServiceFormDialog';
import {
  ShieldAlert,
  Edit2,
  Box,
  Plus,
  Search,
  Activity,
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { language, addToast } = useApp();
  const store = useMockStore();
  const isRTL = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [criticalityFilter, setCriticalityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<CriticalService | null>(null);

  const services = store.getServices();

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCrit = criticalityFilter === 'all' || s.criticality === criticalityFilter;

    return matchesSearch && matchesCrit;
  });

  const handleCreateOrUpdate = (data: any) => {
    if (editingService) {
      store.updateService(editingService.id, data);
      addToast({
        type: 'success',
        title: isRTL ? 'تم تحديث الخدمة الحرجة' : 'Service updated',
        description: isRTL
          ? `تم تحديث "${data.name}" بنجاح.`
          : `Service "${data.name}" was updated.`,
      });
    } else {
      store.addService({
        ...data,
        status: 'active',
      });
      addToast({
        type: 'success',
        title: isRTL ? 'تمت إضافة الخدمة الحرجة' : 'Service created',
        description: isRTL
          ? `تمت إضافة "${data.name}" بنجاح.`
          : `Service "${data.name}" was created.`,
      });
    }
    setIsFormOpen(false);
    setEditingService(null);
  };

  const columns: Column<CriticalService>[] = [
    {
      key: 'name',
      header: isRTL ? 'اسم الخدمة الحرجة' : 'Critical Service',
      sortable: true,
      render: (service) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold text-white block">{service.name}</span>
            <span className="text-xs text-slate-400 font-mono" dir="ltr">
              {service.code}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'criticality',
      header: isRTL ? 'درجة الخطورة' : 'Criticality',
      sortable: true,
      render: (service) => <StatusChip criticality={service.criticality} />,
    },
    {
      key: 'description',
      header: isRTL ? 'الوصف ومصفوفة التأثير' : 'Description',
      render: (service) => (
        <span className="text-xs text-slate-300 line-clamp-2 max-w-sm">
          {service.description}
        </span>
      ),
    },
    {
      key: 'linkedAssetCount',
      header: isRTL ? 'الأصول الداعمة للخدمة' : 'Supporting Assets',
      sortable: true,
      render: (service) => (
        <div className="flex items-center gap-1.5">
          <Box className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold text-slate-200 text-xs">
            {service.linkedAssetCount} {isRTL ? 'أصل مرتبط' : 'linked assets'}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: isRTL ? 'الإجراءات' : 'Actions',
      className: 'text-end',
      render: (service) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => {
              setEditingService(service);
              setIsFormOpen(true);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isRTL ? 'تعديل الخدمة' : 'Edit Service'}
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
        title={isRTL ? 'مصفوفة الخدمات الحرجة' : 'Critical Services Matrix'}
        description={
          isRTL
            ? 'تحديد العمليات والخدمات الأكثر حساسية في المنشأة لضمان عدم انقطاعها وتوجيه فرق الصيانة أوتوماتيكياً.'
            : 'Track high-criticality services that impact operational uptime and patient/industrial safety.'
        }
        badge={`${services.length} ${isRTL ? 'خدمات' : 'Services'}`}
        actionText={isRTL ? 'إضافة خدمة حرجة' : 'Add Critical Service'}
        onAction={() => {
          setEditingService(null);
          setIsFormOpen(true);
        }}
        actionIcon={Plus}
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRTL ? 'بحث بالاسم، الكود، أو الوصف...' : 'Search by service name or code...'}
            className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
          />
          <Search
            className={`w-4 h-4 text-slate-500 absolute top-1/2 -translate-y-1/2 ${
              isRTL ? 'left-3' : 'right-3'
            }`}
          />
        </div>

        {/* Criticality Tabs */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', labelAr: 'الكل', labelEn: 'All' },
            { id: 'high', labelAr: 'حرجة (High)', labelEn: 'High' },
            { id: 'medium', labelAr: 'متوسطة (Medium)', labelEn: 'Medium' },
            { id: 'low', labelAr: 'عادية (Low)', labelEn: 'Low' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCriticalityFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                criticalityFilter === tab.id
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {isRTL ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredServices}
        keyExtractor={(s) => s.id}
        emptyTitle={isRTL ? 'لا توجد خدمات مطابقة' : 'No services found'}
        emptyDescription={
          isRTL
            ? 'لم يتم العثور على أي خدمة حرجة مطابقة للبحث.'
            : 'No critical services match your criteria.'
        }
      />

      {/* Form Dialog */}
      <ServiceFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingService(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingService}
      />
    </div>
  );
};

export default ServicesPage;
