import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, LogOut, ArrowLeft, ArrowRight } from 'lucide-react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, setCurrentUser, language, addToast } = useApp();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle suspended or inactive accounts
  if (currentUser.status === 'inactive') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4 text-red-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            {language === 'ar' ? 'الحساب غير مفعّل' : 'Account Suspended / Inactive'}
          </h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            {language === 'ar'
              ? 'تم تعطيل هذا الحساب مؤقتاً. يرجى التواصل مع مسؤول النظام لتفعيل صلاحيات الوصول الخاصة بك.'
              : 'Your account is currently inactive. Please contact your organization administrator to restore access.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => {
                setCurrentUser(null);
                addToast({
                  type: 'info',
                  title: language === 'ar' ? 'تم تسجيل الخروج' : 'Logged out',
                  description: language === 'ar' ? 'تم إنهاء الجلسة بنجاح.' : 'Session ended.',
                });
              }}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-600/20"
            >
              <LogOut className="w-4 h-4" />
              <span>{language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{language === 'ar' ? 'الرجوع' : 'Go Back'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};
