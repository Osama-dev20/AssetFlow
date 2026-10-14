import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types';
import { ShieldX, ArrowLeft, ArrowRight, LayoutDashboard } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { currentUser, language } = useApp();

  const userRole = currentUser?.role;
  const isAllowed = userRole && allowedRoles.includes(userRole);

  if (!isAllowed) {
    const roleLabels: Record<UserRole, { ar: string; en: string }> = {
      admin: { ar: 'مدير المنظمة (Admin)', en: 'Administrator' },
      technician: { ar: 'فني صيانة (Technician)', en: 'Technician' },
      reporter: { ar: 'مبلّغ (Reporter)', en: 'Issue Reporter' },
    };

    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="max-w-md w-full bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl text-center backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <ShieldX className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            {language === 'ar' ? 'غير مصرح بالدخول' : 'Access Restricted'}
          </h2>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            {language === 'ar'
              ? 'هذه الصفحة مخصصة فقط للأدوار التالية: '
              : 'This section is strictly restricted to: '}
            <span className="font-semibold text-slate-200">
              {allowedRoles.map((r) => roleLabels[r][language]).join(' • ')}
            </span>
          </p>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-400 mb-6">
            <span>{language === 'ar' ? 'دورك الحالي:' : 'Your current role:'} </span>
            <span className="font-semibold text-blue-400">
              {userRole ? roleLabels[userRole][language] : 'None'}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/dashboard"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/25"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{language === 'ar' ? 'العودة للوحة التحكم' : 'Return to Dashboard'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};
