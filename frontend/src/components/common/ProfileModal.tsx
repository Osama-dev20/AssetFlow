import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  Mail,
  Building2,
  Phone,
  Shield,
  KeyRound,
  CheckCircle2,
  Camera,
  AlertCircle,
  Save,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { language, currentUser, setCurrentUser, addToast } = useApp();
  const isRTL = language === 'ar';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+966 50 123 4567');
  const [organization, setOrganization] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setEmail(currentUser.email || '');
      setOrganization(currentUser.organizationName || 'AssetFlow Enterprise');
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      addToast({
        type: 'error',
        title: isRTL ? 'خطأ في الإدخال' : 'Validation Error',
        description: isRTL ? 'الاسم والبريد الإلكتروني مطلوبان.' : 'Name and email are required.',
      });
      return;
    }

    if (activeTab === 'security' && newPassword) {
      if (newPassword !== confirmPassword) {
        addToast({
          type: 'error',
          title: isRTL ? 'كلمة المرور غير متطابقة' : 'Passwords Do Not Match',
          description: isRTL ? 'تأكيد كلمة المرور يجب أن يتطابق مع الجديدة.' : 'Confirmation must match new password.',
        });
        return;
      }
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          fullName: fullName.trim(),
          email: email.trim(),
          organizationName: organization.trim(),
        });
      }

      addToast({
        type: 'success',
        title: isRTL ? 'تم حفظ التعديلات بنجاح' : 'Profile Updated',
        description: isRTL
          ? 'تم تحديث بيانات ملفك الشخصي في المنظومة.'
          : 'Your account details have been updated.',
      });

      onClose();
    }, 400);
  };

  const userInitial = fullName ? fullName.charAt(0).toUpperCase() : 'U';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 animate-scale-up text-start select-none"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1D68BD] to-[#2EAF7D] flex items-center justify-center text-white text-lg font-extrabold shadow-md shadow-blue-600/20">
              {userInitial}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {isRTL ? 'تعديل الملف الشخصي' : 'Edit User Profile'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRTL ? 'إدارة البيانات الشخصية وإعدادات الأمان' : 'Manage your personal account and security'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-800/80 border border-slate-700/60 my-4">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{isRTL ? 'البيانات الشخصية' : 'Personal Info'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'security'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{isRTL ? 'كلمة المرور والأمان' : 'Security & Password'}</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          {activeTab === 'profile' ? (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isRTL ? 'الاسم الكامل' : 'Full Name'} <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Tariq Mansour"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute top-3 end-3 pointer-events-none" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isRTL ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tariq@assetflow.io"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute top-3 end-3 pointer-events-none" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isRTL ? 'رقم الهاتف / الجوال' : 'Phone Number'}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+966 50 123 4567"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <Phone className="w-4 h-4 text-slate-500 absolute top-3 end-3 pointer-events-none" />
                </div>
              </div>

              {/* Organization */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isRTL ? 'اسم الشركة / المنشأة التابع لها' : 'Organization / Company'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="AssetFlow Enterprise"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <Building2 className="w-4 h-4 text-slate-500 absolute top-3 end-3 pointer-events-none" />
                </div>
              </div>

              {/* Current Role (Read Only) */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">
                    {isRTL ? 'الصلاحية الحالية:' : 'Active Role:'}
                  </span>
                  <span className="text-xs font-bold text-blue-400 capitalize">
                    {currentUser?.role === 'admin'
                      ? isRTL
                        ? 'مدير المنظمة والعمليات (Root Admin)'
                        : 'Root Administrator'
                      : currentUser?.role === 'technician'
                      ? isRTL
                        ? 'فني صيانة معتمد'
                        : 'Field Technician'
                      : isRTL
                      ? 'مبلّغ تشغيلي'
                      : 'Incident Reporter'}
                  </span>
                </div>
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
            </>
          ) : (
            <>
              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isRTL ? 'كلمة المرور الحالية' : 'Current Password'}
                </label>
                <input
                  type="password"
                  dir="ltr"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isRTL ? 'كلمة المرور الجديدة' : 'New Password'}
                </label>
                <input
                  type="password"
                  dir="ltr"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isRTL ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                </label>
                <input
                  type="password"
                  dir="ltr"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  {isRTL
                    ? 'يجب أن لا تقل كلمة المرور عن 8 خانات وتحتوي على حرف كبير ورقم ورمز.'
                    : 'Password must be at least 8 characters with upper, number, and symbol.'}
                </span>
              </div>
            </>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              disabled={isSaving}
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 bg-gradient-to-r from-[#1d68bd] to-[#2eaf7d] transition-all cursor-pointer flex items-center gap-2"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isRTL ? 'حفظ التغييرات' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
