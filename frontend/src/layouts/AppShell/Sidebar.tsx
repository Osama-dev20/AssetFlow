import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import type { UserRole } from '../../types';
import {
  LayoutDashboard,
  Box,
  Building2,
  ShieldAlert,
  Wrench,
  CalendarClock,
  Users,
  BarChart3,
  Settings,
  PlusCircle,
  FileText,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  ArrowUpRight,
  LogOut,
  UserCheck,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItemConfig {
  id: string;
  path: string;
  titleAr: string;
  titleEn: string;
  icon: React.ElementType;
  roles: UserRole[];
  badge?: {
    textAr: string;
    textEn: string;
    variant: 'blue' | 'emerald' | 'amber' | 'purple';
  };
  sectionAr?: string;
  sectionEn?: string;
}

const NAV_ITEMS: NavItemConfig[] = [
  // --- Admin Navigation ---
  {
    id: 'admin-dashboard',
    path: '/dashboard',
    titleAr: 'لوحة القيادة والمؤشرات',
    titleEn: 'Dashboard Overview',
    icon: LayoutDashboard,
    roles: ['admin'],
    sectionAr: 'الرئيسية',
    sectionEn: 'OVERVIEW',
  },
  {
    id: 'admin-assets',
    path: '/dashboard/assets',
    titleAr: 'سجل الأصول والمعدات',
    titleEn: 'Assets & Equipment',
    icon: Box,
    roles: ['admin', 'technician', 'reporter'],
    badge: { textAr: '4,120', textEn: '4,120', variant: 'blue' },
    sectionAr: 'إدارة العمليات',
    sectionEn: 'OPERATIONS',
  },
  {
    id: 'admin-sites',
    path: '/dashboard/sites',
    titleAr: 'المواقع والمنشآت',
    titleEn: 'Sites & Facilities',
    icon: Building2,
    roles: ['admin', 'technician'],
  },
  {
    id: 'admin-services',
    path: '/dashboard/services',
    titleAr: 'مصفوفة الخدمات الحرجة',
    titleEn: 'Critical Services',
    icon: ShieldAlert,
    roles: ['admin', 'technician'],
    badge: { textAr: '99.8%', textEn: '99.8%', variant: 'emerald' },
  },
  {
    id: 'admin-workorders',
    path: '/dashboard/work-orders',
    titleAr: 'أوامر العمل والصيانة',
    titleEn: 'Work Orders & CMMS',
    icon: Wrench,
    roles: ['admin'],
    badge: { textAr: '18 نشط', textEn: '18 Open', variant: 'amber' },
  },
  {
    id: 'admin-preventive',
    path: '/dashboard/preventive',
    titleAr: 'الصيانة الوقائية (PM)',
    titleEn: 'Preventive Maintenance',
    icon: CalendarClock,
    roles: ['admin'],
  },
  {
    id: 'admin-users',
    path: '/dashboard/users',
    titleAr: 'المستخدمون والصلاحيات',
    titleEn: 'Users & Permissions',
    icon: Users,
    roles: ['admin'],
    sectionAr: 'الإدارة والتحليل',
    sectionEn: 'MANAGEMENT',
  },
  {
    id: 'admin-team',
    path: '/dashboard/team',
    titleAr: 'فريق العمل والفنيين',
    titleEn: 'Technicians & Team',
    icon: Users,
    roles: ['admin'],
  },
  {
    id: 'admin-analytics',
    path: '/dashboard/analytics',
    titleAr: 'التحليلات ومؤشرات الأداء',
    titleEn: 'Analytics & KPIs',
    icon: BarChart3,
    roles: ['admin'],
  },
  {
    id: 'admin-settings',
    path: '/dashboard/settings',
    titleAr: 'إعدادات المنشأة والنظام',
    titleEn: 'System Settings',
    icon: Settings,
    roles: ['admin'],
  },

  // --- Technician Navigation ---
  {
    id: 'tech-dashboard',
    path: '/dashboard',
    titleAr: 'لوحة مهام الفني',
    titleEn: 'Technician Hub',
    icon: LayoutDashboard,
    roles: ['technician'],
    sectionAr: 'الرئيسية',
    sectionEn: 'OVERVIEW',
  },
  {
    id: 'tech-orders',
    path: '/dashboard/work-orders',
    titleAr: 'أوامر العمل المسندة لي',
    titleEn: 'Assigned Work Orders',
    icon: Wrench,
    roles: ['technician'],
    badge: { textAr: '5 اليوم', textEn: '5 Today', variant: 'amber' },
    sectionAr: 'المهام الميدانية',
    sectionEn: 'TASKS',
  },
  {
    id: 'tech-inspections',
    path: '/dashboard/inspections',
    titleAr: 'قوائم الفحص والتفتيش',
    titleEn: 'Inspection Checklists',
    icon: CheckSquare,
    roles: ['technician'],
    badge: { textAr: 'LOTO', textEn: 'LOTO', variant: 'purple' },
  },

  // --- Reporter Navigation ---
  {
    id: 'reporter-dashboard',
    path: '/dashboard',
    titleAr: 'لوحة متابعة البلاغات',
    titleEn: 'Reporter Hub',
    icon: LayoutDashboard,
    roles: ['reporter'],
    sectionAr: 'الرئيسية',
    sectionEn: 'OVERVIEW',
  },
  {
    id: 'reporter-new',
    path: '/dashboard/new-request',
    titleAr: 'تقديم بلاغ عطل جديد',
    titleEn: 'Submit Issue Report',
    icon: PlusCircle,
    roles: ['reporter'],
    badge: { textAr: 'فوري', textEn: 'Instant', variant: 'emerald' },
    sectionAr: 'البلاغات والطلبات',
    sectionEn: 'REQUESTS',
  },
  {
    id: 'reporter-my-reports',
    path: '/dashboard/my-reports',
    titleAr: 'سجل بلاغاتي السابقة',
    titleEn: 'My Submitted Requests',
    icon: FileText,
    roles: ['reporter'],
    badge: { textAr: '3 قيد المعالجة', textEn: '3 Active', variant: 'blue' },
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { language, currentUser, setCurrentUser, addToast } = useApp();
  const location = useLocation();
  const isRTL = language === 'ar';

  const userRole: UserRole = currentUser?.role || 'admin';

  // Filter items matching current user's role
  const allowedItems = NAV_ITEMS.filter((item) => item.roles.includes(userRole));

  // Remove duplicate paths if any (prioritizing specific role configs)
  const uniqueItems = allowedItems.reduce<NavItemConfig[]>((acc, item) => {
    if (!acc.some((existing) => existing.path === item.path)) {
      acc.push(item);
    }
    return acc;
  }, []);

  const badgeStyles = {
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  };

  const roleLabelMap: Record<UserRole, { ar: string; en: string; badgeColor: string }> = {
    admin: { ar: 'مدير المنظمة', en: 'Admin', badgeColor: 'from-blue-500 to-indigo-600' },
    technician: { ar: 'فني صيانة معتمد', en: 'Technician', badgeColor: 'from-amber-500 to-orange-600' },
    reporter: { ar: 'مبلّغ تشغيلي', en: 'Reporter', badgeColor: 'from-emerald-500 to-teal-600' },
  };

  const currentRoleInfo = roleLabelMap[userRole];

  const handleLogout = () => {
    setCurrentUser(null);
    addToast({
      type: 'info',
      title: isRTL ? 'تم تسجيل الخروج' : 'Logged out',
      description: isRTL ? 'تم إنهاء الجلسة بنجاح.' : 'Logged out successfully.',
    });
  };

  // Nav content shared between Desktop and Mobile
  const renderNavLinks = (forMobile = false) => {
    let lastSection: string | undefined = undefined;

    return (
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {uniqueItems.map((item) => {
          const sectionTitle = isRTL ? item.sectionAr : item.sectionEn;
          const showSection = sectionTitle && sectionTitle !== lastSection;
          if (showSection) {
            lastSection = sectionTitle;
          }

          // Strict active match for exact path or subroutes
          const isActive =
            item.path === '/dashboard'
              ? location.pathname === '/dashboard'
              : location.pathname.startsWith(item.path);

          const IconComponent = item.icon;

          return (
            <React.Fragment key={item.id}>
              {/* Section Header (only shown when expanded or in mobile view) */}
              {showSection && (!isCollapsed || forMobile) && (
                <div className="pt-4 pb-1.5 px-3">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                    {sectionTitle}
                  </span>
                </div>
              )}

              <NavLink
                to={item.path}
                onClick={() => {
                  if (forMobile) onCloseMobile();
                }}
                title={isCollapsed && !forMobile ? (isRTL ? item.titleAr : item.titleEn) : undefined}
                className={`group relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white font-semibold shadow-lg shadow-blue-600/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                } ${isCollapsed && !forMobile ? 'justify-center px-2.5' : ''}`}
                style={
                  isActive
                    ? {
                        background: 'linear-gradient(135deg, #1d68bd 0%, #2eaf7d 100%)',
                      }
                    : undefined
                }
              >
                {/* Active Glowing Notch indicator on inner edge */}
                {isActive && (
                  <span
                    className={`absolute top-1.5 bottom-1.5 w-1 rounded-full bg-white shadow-[0_0_8px_#ffffff] ${
                      isRTL ? 'right-1' : 'left-1'
                    }`}
                  />
                )}

                {/* Icon */}
                <div
                  className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                {/* Title and Badge (hidden when collapsed on desktop) */}
                {(!isCollapsed || forMobile) && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">{isRTL ? item.titleAr : item.titleEn}</span>

                    {item.badge && (
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                          isActive
                            ? 'bg-white/20 text-white border-white/30'
                            : badgeStyles[item.badge.variant]
                        }`}
                      >
                        {isRTL ? item.badge.textAr : item.badge.textEn}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            </React.Fragment>
          );
        })}
      </nav>
    );
  };

  return (
    <>
      {/* ========================================================
          1. DESKTOP SIDEBAR (Collapsible with smooth animation)
         ======================================================== */}
      <aside
        className={`hidden md:flex flex-col fixed top-0 bottom-0 z-30 bg-slate-900/95 backdrop-blur-xl border-slate-800/80 transition-all duration-300 ease-in-out select-none ${
          isRTL ? 'right-0 border-l' : 'left-0 border-r'
        } ${isCollapsed ? 'w-20' : 'w-72'}`}
      >
        {/* Brand Header & Collapse Toggle */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 overflow-hidden transition-all ${
              isCollapsed ? 'justify-center w-full' : ''
            }`}
            title="AssetFlow CMMS"
          >
            {/* AssetFlow Brand Logo Icon */}
            {isCollapsed ? (
              <img
                src={assets.logoIcon}
                alt="AssetFlow"
                className="w-8 h-8 object-contain hover:scale-105 transition-transform"
              />
            ) : (
              <img
                src={assets.logoDarkTheme}
                alt="AssetFlow"
                className="h-8 w-auto object-contain hover:scale-105 transition-transform"
              />
            )}
          </Link>

          {/* Collapse / Expand Toggle Button (arrows dynamically flip in RTL) */}
          {!isCollapsed && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              title={
                isCollapsed
                  ? isRTL
                    ? 'توسيع القائمة'
                    : 'Expand Sidebar'
                  : isRTL
                  ? 'طي القائمة'
                  : 'Collapse Sidebar'
              }
            >
              {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          )}
        </div>

        {/* If collapsed, show center expand button just below header */}
        {isCollapsed && (
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isRTL ? 'توسيع القائمة' : 'Expand Sidebar'}
            >
              {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Navigation Items */}
        {renderNavLinks(false)}

        {/* Footer Info / User Role Pill */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
          {!isCollapsed ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${currentRoleInfo.badgeColor} flex items-center justify-center text-white text-xs font-bold shadow-xs flex-shrink-0`}
                >
                  {userRole.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {currentUser?.fullName || (isRTL ? 'المستخدم الحالي' : 'Active User')}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {isRTL ? currentRoleInfo.ar : currentRoleInfo.en}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer"
                title={isRTL ? 'تسجيل الخروج' : 'Logout'}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title={isRTL ? 'تسجيل الخروج' : 'Logout'}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ========================================================
          2. MOBILE OFF-CANVAS DRAWER (< 768px)
         ======================================================== */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onCloseMobile}
      />

      {/* Drawer Panel */}
      <aside
        className={`fixed top-0 bottom-0 z-50 w-72 bg-slate-900 border-slate-800 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isRTL
            ? `right-0 border-l ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'}`
            : `left-0 border-r ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`
        }`}
      >
        {/* Mobile Header with Brand & Close Button */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1d68bd] to-[#2eaf7d] p-1.5 shadow-md shadow-blue-500/20">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                <path d="M26 30 C 50 30, 52 50, 70 50" stroke="#93C5FD" strokeWidth="8" strokeLinecap="round" />
                <path d="M26 50 L 70 50" stroke="#93C5FD" strokeWidth="8" strokeLinecap="round" />
                <path d="M26 70 C 50 70, 52 50, 70 50" stroke="#93C5FD" strokeWidth="8" strokeLinecap="round" />
                <circle cx="26" cy="30" r="10" fill="#FFFFFF" />
                <circle cx="26" cy="50" r="10" fill="#FFFFFF" />
                <circle cx="26" cy="70" r="10" fill="#FFFFFF" />
                <circle cx="70" cy="50" r="14" fill="#34D399" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-white text-base">AssetFlow</span>
              <span className="block text-[10px] text-slate-400">CMMS Operations</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        {renderNavLinks(true)}

        {/* Mobile User Profile Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${currentRoleInfo.badgeColor} flex items-center justify-center text-white text-xs font-bold shadow-xs flex-shrink-0`}
              >
                {userRole.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {currentUser?.fullName || 'User'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {isRTL ? currentRoleInfo.ar : currentRoleInfo.en}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onCloseMobile();
                handleLogout();
              }}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer"
              title={isRTL ? 'تسجيل الخروج' : 'Logout'}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
