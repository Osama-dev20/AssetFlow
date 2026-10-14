import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types';
import { DEMO_ACCOUNTS } from '../../data/mockData';
import {
  Menu,
  Globe,
  LogOut,
  ChevronDown,
  User,
  Shield,
  Wrench,
  FileText,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Bell,
  Sparkles,
} from 'lucide-react';
import { ProfileModal } from '../../components/common/ProfileModal';

interface DashboardHeaderProps {
  onOpenMobileSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onOpenMobileSidebar,
}) => {
  const { language, toggleLanguage, currentUser, setCurrentUser, addToast } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const isRTL = language === 'ar';

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const roleMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setIsRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    addToast({
      type: 'info',
      title: isRTL ? 'تم تسجيل الخروج' : 'Logged out',
      description: isRTL ? 'تم إنهاء الجلسة بنجاح.' : 'Logged out successfully.',
    });
    navigate('/login');
  };

  const handleSwitchRole = (newRole: UserRole) => {
    const demo = DEMO_ACCOUNTS.find((acc) => acc.role === newRole) || DEMO_ACCOUNTS[0];
    setCurrentUser({
      id: 'demo_' + newRole,
      fullName: demo.name,
      email: demo.email,
      role: newRole,
      status: 'active',
      organizationName: demo.organization,
    });
    setIsRoleMenuOpen(false);
    addToast({
      type: 'success',
      title: isRTL ? 'تم تغيير الدور' : 'Role switched',
      description: isRTL
        ? `أنت الآن تتصفح بصلاحية: ${demo.roleTitleAr}`
        : `You are now browsing as: ${demo.roleTitleEn}`,
    });
  };

  // Dynamic breadcrumb labels based on current path
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const crumbs = [
      {
        label: isRTL ? 'لوحة التحكم' : 'Dashboard',
        path: '/dashboard',
      },
    ];

    if (path.includes('/dashboard/users')) {
      crumbs.push({ label: isRTL ? 'إدارة المستخدمين' : 'Users Management', path: '/dashboard/users' });
    } else if (path.includes('/dashboard/sites')) {
      crumbs.push({ label: isRTL ? 'إدارة المواقع' : 'Sites Management', path: '/dashboard/sites' });
    } else if (path.includes('/dashboard/assets')) {
      crumbs.push({ label: isRTL ? 'الأصول والمواقع' : 'Assets Directory', path: '/dashboard/assets' });
      if (path.match(/\/dashboard\/assets\/[^/]+/)) {
        crumbs.push({ label: isRTL ? 'تفاصيل الأصل' : 'Asset Details', path });
      }
    } else if (path.includes('/dashboard/services')) {
      crumbs.push({ label: isRTL ? 'الخدمات الحرجة' : 'Critical Services', path: '/dashboard/services' });
    } else if (path.includes('/dashboard/work-orders')) {
      crumbs.push({ label: isRTL ? 'أوامر العمل' : 'Work Orders', path: '/dashboard/work-orders' });
    } else if (path.includes('/dashboard/preventive')) {
      crumbs.push({ label: isRTL ? 'الصيانة الوقائية' : 'Preventive Maintenance', path: '/dashboard/preventive' });
    } else if (path.includes('/dashboard/team')) {
      crumbs.push({ label: isRTL ? 'فريق العمل' : 'Technicians & Team', path: '/dashboard/team' });
    } else if (path.includes('/dashboard/analytics')) {
      crumbs.push({ label: isRTL ? 'التقارير والتحليلات' : 'Analytics & KPIs', path: '/dashboard/analytics' });
    } else if (path.includes('/dashboard/settings')) {
      crumbs.push({ label: isRTL ? 'إعدادات النظام' : 'System Settings', path: '/dashboard/settings' });
    } else if (path.includes('/dashboard/inspections')) {
      crumbs.push({ label: isRTL ? 'قوائم الفحص' : 'Checklists', path: '/dashboard/inspections' });
    } else if (path.includes('/dashboard/new-request')) {
      crumbs.push({ label: isRTL ? 'تقديم بلاغ جديد' : 'New Issue Report', path: '/dashboard/new-request' });
    } else if (path.includes('/dashboard/my-reports')) {
      crumbs.push({ label: isRTL ? 'بلاغاتي السابقة' : 'My Reports', path: '/dashboard/my-reports' });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const currentRole: UserRole = currentUser?.role || 'admin';

  const roleBadgeConfig: Record<UserRole, { labelAr: string; labelEn: string; color: string; icon: React.ElementType }> = {
    admin: { labelAr: 'مدير المنظمة', labelEn: 'Admin', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: Shield },
    technician: { labelAr: 'فني صيانة', labelEn: 'Technician', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: Wrench },
    reporter: { labelAr: 'مبلّغ تشغيلي', labelEn: 'Reporter', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: FileText },
  };

  const userInitial = (currentUser?.fullName || currentUser?.name || 'User').charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 h-16 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-md flex items-center justify-between px-4 sm:px-6 select-none transition-all">
      {/* 1. Left Section: Mobile Hamburger & Dynamic Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Menu button (< 768px) */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors md:hidden cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Breadcrumb with RTL-adaptive Chevrons */}
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm font-medium overflow-hidden">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.path + idx}>
                {idx > 0 && (
                  <span className="text-slate-500 flex items-center">
                    {isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </span>
                )}
                {isLast ? (
                  <span className="text-white font-semibold truncate max-w-[140px] sm:max-w-[220px]">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="text-slate-400 hover:text-white transition-colors truncate max-w-[100px] sm:max-w-none"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* 2. Right Section: Role Quick-Switcher, Language Switcher, Notifications & User Profile Menu */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        
        {/* Quick Demo Role Switcher Pill (Super handy for evaluation) */}
        <div className="relative" ref={roleMenuRef}>
          <button
            type="button"
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
              roleBadgeConfig[currentRole].color
            } hover:scale-105 active:scale-95`}
            title={isRTL ? 'تبديل الصلاحية للتجربة' : 'Switch demo role'}
          >
            {React.createElement(roleBadgeConfig[currentRole].icon, { className: 'w-3.5 h-3.5' })}
            <span className="hidden sm:inline">
              {isRTL ? roleBadgeConfig[currentRole].labelAr : roleBadgeConfig[currentRole].labelEn}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isRoleMenuOpen && (
            <div
              className={`absolute top-full mt-2 w-52 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-1.5 z-50 animate-fade-in ${
                isRTL ? 'left-0' : 'right-0'
              }`}
            >
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {isRTL ? 'معاينة الصلاحيات والأدوار' : 'Switch Active Role'}
              </div>

              {(['admin', 'technician', 'reporter'] as UserRole[]).map((r) => {
                const conf = roleBadgeConfig[r];
                const IconComponent = conf.icon;
                const isSelected = r === currentRole;

                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleSwitchRole(r)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/20 text-blue-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-slate-400" />
                      <span>{isRTL ? conf.labelAr : conf.labelEn}</span>
                    </div>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Language Switcher Capsule (reusing existing AppContext.toggleLanguage) */}
        <button
          onClick={toggleLanguage}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all cursor-pointer group shadow-xs"
          title={isRTL ? 'Switch to English' : 'التحويل إلى العربية'}
        >
          <Globe className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-180 transition-transform duration-500" />
          <span>{isRTL ? 'EN' : 'عربي'}</span>
        </button>

        {/* View Landing Page Link (fully functional and accessible) */}
        <Link
          to="/"
          state={{ skipIntro: true }}
          onClick={() => {
            document.body.style.overflow = '';
            window.dispatchEvent(new CustomEvent('dismiss-intro'));
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
          title={isRTL ? 'الرجوع للموقع التعريفي' : 'Visit Landing Page'}
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
          <span>{isRTL ? 'الموقع' : 'Website'}</span>
        </Link>

        {/* User Menu Area */}
        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 pl-2 sm:px-2.5 sm:py-1.5 rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-700 transition-all cursor-pointer"
            aria-label="Open user menu"
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#1d68bd] to-[#2eaf7d] flex items-center justify-center text-white text-xs font-bold shadow-xs">
              {userInitial}
            </div>

            {/* User Name & Role (hidden on small screens) */}
            <div className="hidden sm:flex flex-col text-start leading-none min-w-[70px]">
              <span className="text-xs font-semibold text-white truncate max-w-[100px]">
                {currentUser?.fullName?.split(' ')[0] || 'User'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium capitalize">
                {currentRole}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User Dropdown Menu */}
          {isUserMenuOpen && (
            <div
              className={`absolute top-full mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 z-50 animate-fade-in ${
                isRTL ? 'left-0' : 'right-0'
              }`}
            >
              {/* Header Info */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1d68bd] to-[#2eaf7d] flex items-center justify-center text-white text-sm font-bold shadow-xs flex-shrink-0">
                    {userInitial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {currentUser?.fullName || 'AssetFlow User'}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {currentUser?.email || 'admin@assetflow.io'}
                    </p>
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{isRTL ? 'المؤسسة:' : 'Org:'}</span>
                  <span className="font-semibold text-slate-200 truncate max-w-[140px]">
                    {currentUser?.organizationName || 'AssetFlow Enterprise'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer text-start"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{isRTL ? 'تعديل الملف الشخصي' : 'Edit Profile'}</span>
                </button>

                <Link
                  to="/dashboard/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>{isRTL ? 'إعدادات المنشأة والشركات' : 'Companies & Settings'}</span>
                </Link>

                <Link
                  to="/"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                  <span>{isRTL ? 'الصفحة الرئيسية' : 'Landing Page'}</span>
                </Link>

                <div className="pt-1 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{isRTL ? 'تسجيل الخروج' : 'Log Out'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Interactive Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </header>
  );
};
