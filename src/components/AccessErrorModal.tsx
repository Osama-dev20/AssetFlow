import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertOctagon, Lock, FileQuestion, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { soundManager } from '../lib/soundEffects';

export const AccessErrorModal: React.FC = () => {
  const { 
    activeAccessError, 
    setActiveAccessError, 
    setCurrentPage, 
    language 
  } = useApp();

  if (!activeAccessError) return null;

  const isEn = language === 'en';

  const config = {
    401: {
      code: '401',
      endpoint: isEn ? 'Any Request → 401' : 'أي طلب غير مصادق → 401',
      who: isEn ? 'Session Expiration Handler' : 'أي مستخدم بعد انتهاء صلاحية الجلسة',
      title: isEn ? 'Session Has Expired' : 'انتهت الجلسة الحالية',
      text: isEn 
        ? 'Your session timed out. Please sign in again. Any draft data entered in the report form has been safely cached in local storage.' 
        : 'انتهت الجلسة. يرجى تسجيل الدخول مجددًا. ما كتبته في نموذج البلاغ يُحفظ مؤقتًا في المتصفح حتى تعود.',
      cta: isEn ? 'Go to Login' : 'تسجيل الدخول مجدداً',
      badgeColor: 'border-slate-500/40 bg-slate-500/10 text-slate-300',
      icon: Lock,
      action: () => setCurrentPage('login')
    },
    403: {
      code: '403',
      endpoint: 'GET /api/issues → 403',
      who: isEn ? 'Role Access Control (e.g. Technician opening manager triage)' : 'فني يفتح بلاغات الأعطال الإدارية · Technician',
      title: isEn ? 'Access Forbidden (Insufficient Privileges)' : 'هذه الصفحة ليست ضمن صلاحياتك',
      text: isEn 
        ? 'Reviewing organization-wide fault reports and running AI triage is restricted to Maintenance Directors. If you require access, please contact your facility admin.' 
        : 'مراجعة البلاغات وتشغيل التحليل الذكي وتعديل الشدة متاح لمدير الصيانة فقط. إذا كنت تحتاج الوصول، تواصل مع مدير منشأتك.',
      cta: isEn ? 'Return to Home' : 'العودة إلى البداية',
      badgeColor: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
      icon: AlertOctagon,
      action: () => setCurrentPage('dashboard')
    },
    404: {
      code: '404',
      endpoint: 'GET /api/issues/{id} → 404',
      who: isEn ? 'Manager opening non-existent or cross-tenant issue' : 'مدير يفتح بلاغًا من مؤسسة أخرى أو محذوف',
      title: isEn ? 'Fault Report Not Found' : 'لم نجد هذا البلاغ في مؤسستك',
      text: isEn 
        ? 'The requested issue ID does not exist or belongs to another organization. Cross-tenant data isolation strictly protects multi-facility privacy.' 
        : 'ربما كتبت الرقم بشكل خاطئ، أو أن البلاغ لا يتبع منشأتك. نحافظ على عزل بيانات المؤسسات ولا نعرض بيانات منشآت أخرى.',
      cta: isEn ? 'View All Reports' : 'العودة لكل البلاغات',
      badgeColor: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
      icon: FileQuestion,
      action: () => setCurrentPage('issues')
    }
  }[activeAccessError];

  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-md bg-[#0F1729] border border-[#22304D] rounded-3xl overflow-hidden shadow-2xl animate-scale-in ${isEn ? 'text-left' : 'text-right'}`}>
        
        {/* Top Spec Bar */}
        <div className="p-3.5 px-5 bg-[#0B1222] border-b border-[#1E2A44] flex items-center justify-between text-xs text-[#8696AE]">
          <span className="truncate max-w-[240px]">{config.who}</span>
          <span className="mono font-bold text-blue-400">{config.endpoint}</span>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative">
            <span className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${config.badgeColor}`}>
              <IconComponent size={28} />
            </span>
          </div>

          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-black mono mb-2 border ${config.badgeColor}`}>
              HTTP {config.code}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {config.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#A3B1C6] mt-2 leading-relaxed">
              {config.text}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full pt-2">
            <button
              onClick={() => {
                soundManager.playButtonClick();
                setActiveAccessError(null);
                config.action();
              }}
              className="flex-1 h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{config.cta}</span>
              {isEn ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
            </button>

            <button
              onClick={() => {
                soundManager.playButtonClick();
                setActiveAccessError(null);
              }}
              className="h-11 px-4 rounded-xl bg-[#16213A] hover:bg-[#1E2A44] text-[#8696AE] hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              {isEn ? 'Dismiss' : 'إغلاق'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
