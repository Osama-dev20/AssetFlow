import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useApp } from '../../context/AppContext';
import { useMockStore, type Asset } from '../../data/mockStore';
import { X, Box, AlertCircle } from 'lucide-react';

const assetSchema = z.object({
  name: z.string().min(3, 'اسم الأصل يجب ألا يقل عن 3 أحرف'),
  code: z
    .string()
    .min(3, 'كود الأصل مطلوب (3 أحرف كحد أدنى)')
    .regex(/^[A-Za-z0-9-_]+$/, 'الكود يجب أن يحتوي فقط على حروف وأرقام وشرطات بدون مسافات'),
  siteId: z.string().min(1, 'يرجى اختيار الموقع التشغيلي'),
  status: z.enum(['operational', 'maintenance', 'out_of_service']),
  category: z.string().min(2, 'يرجى تحديد فئة الأصل'),
  description: z.string().default(''),
});

type AssetFormValues = z.infer<typeof assetSchema>;

interface AssetFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AssetFormValues) => void;
  initialData?: Asset | null;
  isLoading?: boolean;
}

export const AssetFormDialog: React.FC<AssetFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const { language } = useApp();
  const store = useMockStore();
  const isRTL = language === 'ar';

  const sites = store.getSites();
  const [zodErrors, setZodErrors] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    reset,
    getValues,
  } = useForm<AssetFormValues>({
    defaultValues: {
      name: '',
      code: '',
      siteId: sites[0]?.id || '',
      status: 'operational',
      category: isRTL ? 'المضخات وميكانيكا السوائل' : 'Mechanical & Pumps',
      description: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        code: initialData.code,
        siteId: initialData.siteId,
        status: initialData.status,
        category: initialData.category,
        description: initialData.description || '',
      });
    } else {
      reset({
        name: '',
        code: '',
        siteId: sites[0]?.id || '',
        status: 'operational',
        category: isRTL ? 'المضخات وميكانيكا السوائل' : 'Mechanical & Pumps',
        description: '',
      });
    }
    setZodErrors({});
  }, [initialData, reset, isOpen, sites, isRTL]);

  if (!isOpen) return null;

  const onFormSubmit = (data: AssetFormValues) => {
    const parseResult = assetSchema.safeParse(data);
    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.issues.forEach((issue) => {
        const path = issue.path[0]?.toString() || 'general';
        fieldErrors[path] = issue.message;
      });
      setZodErrors(fieldErrors);
      return;
    }

    setZodErrors({});
    onSubmit(parseResult.data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => !isLoading && onClose()}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl z-10 animate-scale-up text-start select-none max-h-[90vh] overflow-y-auto"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 text-blue-400 flex items-center justify-center">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {initialData
                  ? isRTL
                    ? 'تعديل بيانات الأصل'
                    : 'Edit Asset'
                  : isRTL
                  ? 'تسجيل أصل تشغيلي جديد'
                  : 'Register New Asset'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRTL
                  ? 'تسجيل وتوثيق المعدة والموقع التابع لها وحالتها المعتمدة.'
                  : 'Specify asset specifications, facility location, and status.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-5">
          {/* Asset Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRTL ? 'اسم الأصل أو المعدة' : 'Asset Name'} <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder={isRTL ? 'مثال: مضخة الطرد المركزي متعددة المراحل #1' : 'e.g. Centrifugal Water Pump #1'}
              {...register('name')}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                zodErrors.name
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
            />
            {zodErrors.name && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{zodErrors.name}</span>
              </p>
            )}
          </div>

          {/* Asset Code */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRTL ? 'كود الأصل المرجعي (Asset Code / QR)' : 'Asset Code'} <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              dir="ltr"
              placeholder="AST-PUMP-101"
              {...register('code')}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                zodErrors.code
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
            />
            {zodErrors.code && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{zodErrors.code}</span>
              </p>
            )}
          </div>

          {/* Site Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRTL ? 'الموقع التشغيلي التابع له' : 'Operational Site'}{' '}
              <span className="text-rose-400">*</span>
            </label>
            <select
              {...register('siteId')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
            >
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name} ({site.code})
                </option>
              ))}
            </select>
            {zodErrors.siteId && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{zodErrors.siteId}</span>
              </p>
            )}
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRTL ? 'الحالة التشغيلية' : 'Operating Status'}{' '}
              <span className="text-rose-400">*</span>
            </label>
            <select
              {...register('status')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="operational">
                {isRTL ? 'يعمل بحالة ممتازة (Operational)' : 'Operational - In Service'}
              </option>
              <option value="maintenance">
                {isRTL ? 'تحت الصيانة (In Maintenance)' : 'Under Maintenance'}
              </option>
              <option value="out_of_service">
                {isRTL ? 'خارج الخدمة / معطل (Out of Service)' : 'Out of Service - Offline'}
              </option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRTL ? 'تصنيف وفئة الأصل' : 'Asset Category'}
            </label>
            <input
              type="text"
              placeholder={isRTL ? 'مثال: المضخات وميكانيكا السوائل' : 'e.g. Pumps & Fluid Mechanics'}
              {...register('category')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
            />
            {zodErrors.category && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{zodErrors.category}</span>
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRTL ? 'المواصفات الفنية والملاحظات' : 'Technical Specifications'}
            </label>
            <textarea
              rows={3}
              placeholder={isRTL ? 'المواصفات الفنية، السعة، القدرة التشغيلية...' : 'Technical details, capacity, warranty...'}
              {...register('description')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 bg-blue-600 hover:bg-blue-500 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{initialData ? (isRTL ? 'حفظ التعديلات' : 'Save Changes') : isRTL ? 'تسجيل الأصل' : 'Register Asset'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
