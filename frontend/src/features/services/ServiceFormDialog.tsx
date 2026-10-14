import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useApp } from '../../context/AppContext';
import type { CriticalService } from '../../data/mockStore';
import { X, ShieldAlert, AlertCircle } from 'lucide-react';

interface ServiceFormData {
  name: string;
  code: string;
  description: string;
  criticality: 'high' | 'medium' | 'low';
}

interface ServiceFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => void;
  initialData?: CriticalService | null;
  isLoading?: boolean;
}

export const ServiceFormDialog: React.FC<ServiceFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const { language } = useApp();
  const isRTL = language === 'ar';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    defaultValues: {
      name: '',
      code: '',
      description: '',
      criticality: 'high',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        code: initialData.code,
        description: initialData.description,
        criticality: initialData.criticality,
      });
    } else {
      reset({
        name: '',
        code: '',
        description: '',
        criticality: 'high',
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => !isLoading && onClose()}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl z-10 animate-scale-up text-start select-none"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/25 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {initialData
                  ? isRTL
                    ? 'تعديل الخدمة الحرجة'
                    : 'Edit Critical Service'
                  : isRTL
                  ? 'تعريف خدمة حرجة جديدة'
                  : 'Add Critical Service'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRTL
                  ? 'الخدمات التشغيلية الحيوية التي تعتمد على توافر الأصول لمنع توقف العمل.'
                  : 'Vital operational services depending on underlying asset health.'}
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-5">
          {/* Service Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRTL ? 'اسم الخدمة الحرجة' : 'Service Name'} <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder={isRTL ? 'مثال: تغذية غرف العمليات بالطاقة النظيفة' : 'e.g. Surgical Clean Power Feed'}
              {...register('name', {
                required: isRTL ? 'اسم الخدمة مطلوب' : 'Name is required',
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

          {/* Service Code */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRTL ? 'كود الخدمة الفريد' : 'Service Code'} <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              dir="ltr"
              placeholder="SRV-PWR-CRIT"
              {...register('code', {
                required: isRTL ? 'كود الخدمة مطلوب' : 'Code is required',
              })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Criticality Rating */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRTL ? 'درجة الخطورة والتأثير (Criticality)' : 'Criticality Level'}{' '}
              <span className="text-rose-400">*</span>
            </label>
            <select
              {...register('criticality', { required: true })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="high">
                {isRTL ? 'حرجة للغاية (High) - توقف العمل فوراً وخسائر جسيمة' : 'High - Severe immediate impact'}
              </option>
              <option value="medium">
                {isRTL ? 'متوسطة الخطورة (Medium) - تأثير محدود قابل للاحتواء' : 'Medium - Moderate impact'}
              </option>
              <option value="low">
                {isRTL ? 'عادية / منخفضة (Low) - خدمات مساندة' : 'Low - Supportive services'}
              </option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRTL ? 'الوصف ومصفوفة التبعية' : 'Description'}
            </label>
            <textarea
              rows={3}
              placeholder={isRTL ? 'شرح التبعية التشغيلية وأهمية الخدمة...' : 'Describe dependencies and operational impact...'}
              {...register('description')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all resize-none"
            />
          </div>

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
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-lg shadow-rose-600/30 hover:shadow-rose-600/40 bg-gradient-to-r from-blue-600 to-rose-600 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{initialData ? (isRTL ? 'حفظ التعديلات' : 'Save Changes') : isRTL ? 'إضافة الخدمة' : 'Add Service'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
