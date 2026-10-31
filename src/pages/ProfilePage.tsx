import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, Mail, Phone, ShieldCheck, Globe, 
  LogOut, CheckCircle2, Building, Check, Sparkles
} from 'lucide-react';
import { soundManager } from '../lib/soundEffects';

export const ProfilePage: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    language, 
    setLanguage, 
    setCurrentPage, 
    showToast 
  } = useApp();

  const isEn = language === 'en';

  const [fullName, setFullName] = useState(currentUser.name);
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phone);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playButtonClick();
    setCurrentUser({
      ...currentUser,
      name: fullName,
      phone: phoneNumber
    });
    setIsSaved(true);
    showToast(
      isEn ? 'Profile updated successfully' : 'تم حفظ بيانات الملف الشخصي بنجاح',
      isEn ? 'Your changes are now active across your organization' : 'تم تحديث معلوماتك في المنظومة',
      'success'
    );
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleLogout = () => {
    soundManager.playButtonClick();
    setCurrentPage('login');
    showToast(
      isEn ? 'Logged out successfully' : 'تم تسجيل الخروج بنجاح',
      isEn ? 'Session ended safely' : 'تم إنهاء الجلسة بأمان',
      'info'
    );
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 ${isEn ? 'text-left' : 'text-right'}`}>
      
      {/* 1. HEADER & USER SUMMARY CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#101D38] to-[#0F1729] border border-[#22304D] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-teal-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            {currentUser.initials}
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                {isEn ? (currentUser.nameEn || currentUser.name) : currentUser.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {currentUser.role === 'admin' ? (isEn ? 'Organization Director' : 'مدير المنظمة') : (currentUser.role === 'technician' ? (isEn ? 'Field Technician' : 'فني صيانة') : (isEn ? 'Operational Reporter' : 'مُبلِّغ تشغيلي'))}
              </span>
            </div>
            <div className="text-xs sm:text-sm text-[#A3B1C6] mt-1 flex items-center justify-center sm:justify-start gap-2">
              <Building size={14} className="text-blue-400" />
              <span>{isEn ? 'Nablus Water Authority · ' : 'مياه نابلس · '}</span>
              <span className="text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-1 ml-1" />
                {isEn ? 'Active Account' : 'حساب نشط'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="h-10 px-4 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <LogOut size={15} />
          <span>{isEn ? 'Sign Out' : 'تسجيل الخروج'}</span>
        </button>
      </div>

      {/* 2. PROFILE EDIT FORM */}
      <form onSubmit={handleSaveProfile} className="p-6 sm:p-7 rounded-3xl bg-[#0F1729] border border-[#22304D] shadow-lg space-y-5">
        <div className="border-b border-[#1E2A44] pb-3">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <User size={18} className="text-blue-400" />
            <span>{isEn ? 'My Profile Details' : 'بياناتي الشخصية'}</span>
          </h2>
          <span className="text-xs text-[#8696AE]">
            {isEn ? 'Visible only to team members within your organization.' : 'تظهر لأعضاء الفريق داخل مؤسستك فقط.'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#C3CEDF] block">
              {isEn ? 'Full Name' : 'الاسم الكامل'}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#C3CEDF] block">
              {isEn ? 'Phone Number' : 'رقم الهاتف'}
            </label>
            <input
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#C3CEDF] block">
            {isEn ? 'Email Address (Login Identity)' : 'البريد الإلكتروني المهني (اسم الدخول)'}
          </label>
          <div className="relative">
            <input
              type="email"
              disabled
              value={currentUser.email}
              className="w-full h-11 px-4 rounded-xl bg-[#070B16] border border-[#1A2440] text-[#8696AE] text-xs sm:text-sm cursor-not-allowed"
            />
            <span className="absolute left-3 top-3.5 text-[11px] text-[#8696AE]">
              {isEn ? 'Managed by Admin' : 'معتمد للجلسة'}
            </span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
          >
            {isSaved ? <Check size={16} /> : <CheckCircle2 size={16} />}
            <span>{isSaved ? (isEn ? 'Saved!' : 'تم الحفظ!') : (isEn ? 'Save Changes' : 'حفظ التغييرات')}</span>
          </button>
        </div>
      </form>

      {/* 3. LANGUAGE PREFERENCE */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#0F1729] border border-[#22304D] shadow-lg space-y-4">
        <div className="border-b border-[#1E2A44] pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Globe size={18} className="text-blue-400" />
              <span>{isEn ? 'Interface Language Preference' : 'تفضيلات لغة الواجهة'}</span>
            </h2>
            <span className="text-xs text-[#8696AE]">
              {isEn ? 'Choose between Arabic (RTL) and English (LTR).' : 'التبديل بين العربية والإنجليزية في كامل المنظومة.'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-sm">
          <button
            type="button"
            onClick={() => setLanguage('ar')}
            className={`p-3 rounded-xl border font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
              language === 'ar'
                ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white border-blue-400 shadow-md'
                : 'bg-[#0B1222] border-[#22304D] text-[#8696AE] hover:text-white'
            }`}
          >
            <span>العربية (RTL)</span>
          </button>

          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`p-3 rounded-xl border font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
              language === 'en'
                ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white border-blue-400 shadow-md'
                : 'bg-[#0B1222] border-[#22304D] text-[#8696AE] hover:text-white'
            }`}
          >
            <span>English (LTR)</span>
          </button>
        </div>
      </div>

      {/* 4. PERMISSIONS & ROLE BREAKDOWN ("ما يمكنني فعله") */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#0F1729] border border-[#22304D] shadow-lg space-y-4">
        <div className="border-b border-[#1E2A44] pb-3">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <ShieldCheck size={18} className="text-teal-400" />
            <span>{isEn ? 'Role Permissions & Capabilities' : 'ما يمكنني فعله (صلاحيات دوري في المنظومة)'}</span>
          </h2>
          <span className="text-xs text-[#8696AE]">
            {isEn ? 'Official access privileges and operational permissions for your account.' : 'الصلاحيات المعتمدة لحسابك في نظام إدارة الأصول والخدمات الحرجة.'}
          </span>
        </div>

        <ul className="space-y-2 text-xs sm:text-sm text-[#C3CEDF]">
          {currentUser.role === 'admin' && (
            <>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                <span>{isEn ? 'Manage facility users, roles, and invitation workflows.' : 'إدارة المستخدمين وأدوارهم ودعوتهم في مؤسستك.'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                <span>{isEn ? 'Administer sites, asset registry, and critical service mappings.' : 'إدارة المواقع وسجل الأصول والخدمات الحرجة وروابطها.'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                <span>{isEn ? 'Review all fault reports and trigger automated AI triage diagnostics.' : 'مراجعة بلاغات الأعطال وتشغيل التحليل الذكي بالذكاء الاصطناعي.'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                <span>{isEn ? 'Calibrate priority score and override failure severity manually.' : 'مراجعة الأثر على الخدمات والأولوية، وتحديد شدة العطل يدويًا.'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                <span>{isEn ? 'Dispatch work orders, schedule preventive maintenance, and view analytics.' : 'إنشاء أوامر العمل وإسنادها، وجدولة الصيانة الوقائية وعرض التقارير.'}</span>
              </li>
            </>
          )}

          {currentUser.role === 'technician' && (
            <>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                <span>{isEn ? 'View assigned work orders ranked by explainable priority score.' : 'استعراض أوامر العمل المسندة إليّ مرتبة حسب درجة الأولوية.'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                <span>{isEn ? 'Execute field verification checklists step-by-step with offline caching.' : 'تنفيذ قوائم الفحص والتحقق الميداني مع دعم الحفظ دون اتصال (Offline).'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                <span>{isEn ? 'Update work order statuses (In-progress, Waiting parts, Completed).' : 'تحديث حالة أوامر العمل (قيد التنفيذ، بانتظار قطع، مكتمل).'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                <span>{isEn ? 'Read-only inspection of facility assets assigned to your zone.' : 'عرض ومطالعة أصول ومعدات موقع عملك (عرض فقط).'}</span>
              </li>
            </>
          )}

          {currentUser.role === 'reporter' && (
            <>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                <span>{isEn ? 'Submit breakdown and fault reports for organization assets in under a minute.' : 'تسجيل بلاغات الأعطال لمعدات المؤسسة خلال أقل من دقيقة.'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                <span>{isEn ? 'Track submission status in real time across the 4 stages of resolution.' : 'متابعة حالة البلاغات لحظة بلحظة عبر مراحل المعالجة الأربع.'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                <span>{isEn ? 'Protect confidentiality: internal engineering parameters are safely abstracted.' : 'خصوصية وأمان: حجب المتغيرات الهندسية المعقدة لتسهيل التجربة.'}</span>
              </li>
            </>
          )}
        </ul>
      </div>

    </div>
  );
};
