import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useApp } from '../../context/AppContext';
import type { ManagedUser } from '../../data/mockStore';
import type { UserRole } from '../../types';
import { X, UserPlus, AlertCircle, Shield, Wrench, FileText } from 'lucide-react';

interface UserFormData {
  fullName: string;
  email: string;
  role: UserRole;
  department: string;
}

interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  initialData?: ManagedUser | null;
  isLoading?: boolean;
}

export const UserFormDialog: React.FC<UserFormDialogProps> = ({
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
  } = useForm<UserFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      role: 'technician',
      department: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        fullName: initialData.fullName,
        email: initialData.email,
        role: initialData.role,
        department: initialData.department || '',
      });
    } else {
      reset({
        fullName: '',
        email: '',
        role: 'technician',
        department: '',
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = (data: UserFormData) => {
    onSubmit(data);
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
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl z-10 animate-scale-up text-start select-none"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 text-blue-400 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {initialData
                  ? isRTL
                    ? 'تعديل بيانات المستخدم'
                    : 'Edit User'
                  : isRTL
                  ? 'إضافة مستخدم جديد'
                  : 'Add New User'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRTL
                  ? 'أدخل بيانات المستخدم وصلاحية الوصول الممنوحة له في المنظومة.'
                  : 'Specify account details and system access permissions.'}
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
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRTL ? 'الاسم الكامل' : 'Full Name'} <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder={isRTL ? 'مثال: أحمد عبد الله' : 'e.g. John Doe'}
              {...register('fullName', {
                required: isRTL ? 'يرجى إدخال الاسم الكامل' : 'Full Name is required',
                minLength: { value: 3, message: isRTL ? 'الاسم يجب ألا يقل عن 3 أحرف' : 'Min 3 characters' },
              })}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.fullName
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.fullName.message}</span>
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRTL ? 'البريد الإلكتروني المهني' : 'Work Email'} <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              dir="ltr"
              placeholder="user@assetflow.io"
              {...register('email', {
                required: isRTL ? 'يرجى إدخال البريد الإلكتروني' : 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: isRTL ? 'يرجى إدخال بريد إلكتروني صالح' : 'Invalid email address',
                },
              })}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>

          {/* Role Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRTL ? 'الدور الوظيفي والصلاحيات' : 'Role & Permissions'}{' '}
              <span className="text-rose-400">*</span>
            </label>
            <select
              {...register('role', { required: true })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
            >
              <option value="admin">
                {isRTL ? 'مدير المنظمة (Admin) - تحكم شامل وإعدادات' : 'Admin - Full Control & Settings'}
              </option>
              <option value="technician">
                {isRTL ? 'فني صيانة (Technician) - تنفيذ أوامر العمل والفحوصات' : 'Technician - Work Orders & Inspections'}
              </option>
              <option value="reporter">
                {isRTL ? 'مبلّغ (Reporter) - تقديم ومتابعة بلاغات الأعطال' : 'Reporter - Report Issues & Track'}
              </option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isRTL ? 'القسم / الفريق التابع له' : 'Department / Team'}
            </label>
            <input
              type="text"
              placeholder={isRTL ? 'مثال: الصيانة الميكانيكية' : 'e.g. Mechanical Maintenance'}
              {...register('department')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
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
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 bg-gradient-to-r from-[#1d68bd] to-[#2eaf7d] transition-all cursor-pointer flex items-center gap-2"
            >
              {isLoading && (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{initialData ? (isRTL ? 'حفظ التعديلات' : 'Save Changes') : isRTL ? 'إضافة المستخدم' : 'Add User'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
