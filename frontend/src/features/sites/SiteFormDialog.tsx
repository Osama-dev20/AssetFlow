import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useApp } from '../../context/AppContext';
import type { Site } from '../../data/mockStore';
import { X, Building2, AlertCircle } from 'lucide-react';

interface SiteFormData {
  name: string;
  code: string;
  address: string;
}

interface SiteFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SiteFormData) => void;
  initialData?: Site | null;
  existingCodes?: string[];
  isLoading?: boolean;
}

export const SiteFormDialog: React.FC<SiteFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  existingCodes = [],
  isLoading = false,
}) => {
  const { language } = useApp();
  const isRTL = language === 'ar';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SiteFormData>({
    defaultValues: {
      name: '',
      code: '',
      address: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        code: initialData.code,
        address: initialData.address,
      });
    } else {
      reset({
        name: '',
        code: '',
        address: '',
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

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
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl z-10 animate-scale-up text-start select-none"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {initialData
                  ? isRTL
                    ? 'تعديل بيانات الموقع'
                    : 'Edit Site'
                  : isRTL
                  ? 'إضافة موقع تشغيلي جديد'
                  : 'Add New Site'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRTL
                  ? 'حدد اسم الموقع، الكود التعريفي الفريد، والموقع الجغرافي للمنشأة.'
                  : 'Define facility name, unique site code, and physical address.'}
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-5">
          {/* Site Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRTL ? 'اسم الموقع / المنشأة' : 'Site Name'} <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder={isRTL ? 'مثال: محطة معالجة المياه المركزية' : 'e.g. Central Water Plant'}
              {...register('name', {
                required: isRTL ? 'يرجى إدخال اسم الموقع' : 'Site Name is required',
                minLength: { value: 3, message: isRTL ? 'الاسم يجب ألا يقل عن 3 أحرف' : 'Min 3 characters' },
              })}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.name.message}</span>
              </p>
            )}
          </div>

          {/* Site Code */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRTL ? 'كود الموقع الفريد (Site Code)' : 'Unique Site Code'}{' '}
              <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              dir="ltr"
              placeholder="SITE-IND-01"
              {...register('code', {
                required: isRTL ? 'يرجى إدخال كود الموقع' : 'Site Code is required',
                validate: (value) => {
                  if (
                    !initialData &&
                    existingCodes.map((c) => c.toLowerCase()).includes(value.toLowerCase().trim())
                  ) {
                    return isRTL ? 'هذا الكود مستخدم بالفعل لموقع آخر' : 'Code already in use';
                  }
                  return true;
                },
              })}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.code
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
            />
            {errors.code && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.code.message}</span>
              </p>
            )}
          </div>

          {/* Address / City */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRTL ? 'العنوان والموقع الجغرافي' : 'Address / City'}{' '}
              <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder={isRTL ? 'مثال: نابلس - المنطقة الصناعية الشرقية' : 'e.g. Industrial Zone, Building 4'}
              {...register('address', {
                required: isRTL ? 'يرجى تحديد العنوان' : 'Address is required',
              })}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.address
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.address.message}</span>
              </p>
            )}
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
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 bg-gradient-to-r from-[#1d68bd] to-[#2eaf7d] transition-all cursor-pointer flex items-center gap-2"
            >
              {isLoading && (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{initialData ? (isRTL ? 'حفظ التعديلات' : 'Save Changes') : isRTL ? 'إضافة الموقع' : 'Add Site'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
