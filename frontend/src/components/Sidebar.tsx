import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, Box, Building2, ShieldAlert, Wrench, 
  CalendarClock, Users, BarChart3, Settings, ShieldCheck, 
  ChevronsUpDown, X, Sparkles, AlertTriangle, User,
  FileText, Activity, Layers, Bot
} from 'lucide-react';
import { AppPage } from '../types';
import { soundManager } from '../lib/soundEffects';
import { translations } from '../data/translations';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { 
    currentPage, 
    setCurrentPage, 
    assets, 
    workOrders, 
    services, 
    sites,
    issues,
    currentUser,
    switchRole,
    setupPercentage,
    setupSteps,
    language
  } = useApp();

  const isEn = language === 'en';
  const t = translations[language].sidebar;
  const d = translations[language].dashboard;

  const openOrdersCount = workOrders.filter((wo) => wo.status !== 'completed').length;
  const criticalServicesRiskCount = services.filter((s) => s.status !== 'stable').length;
  const openIssuesCount = issues.filter((i) => i.status !== 'resolved').length;

  const navItem = (page: AppPage, label: string, icon: React.ReactNode, count?: number | string, isAlert?: boolean, badgeText?: string) => {
    const isActive = currentPage === page;
    return (
      <button
        key={page}
        onClick={() => {
          soundManager.playCardSwitch();
          setCurrentPage(page);
          onClose();
        }}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-all group cursor-pointer ${
          isActive
            ? `bg-gradient-to-r from-blue-600/25 to-teal-500/15 text-white font-bold shadow-inner ${language === 'en' ? 'border-l-[3px]' : 'border-r-[3px]'} border-[#34D399]`
            : 'text-[#A3B1C6] hover:bg-[#121C33] hover:text-white'
        }`}
      >
        <span className={`shrink-0 transition-colors ${isActive ? 'text-[#34D399]' : 'text-[#8696AE] group-hover:text-white'}`}>
          {icon}
        </span>
        <span className={`flex-1 min-w-0 ${language === 'en' ? 'text-left' : 'text-right'}`}>{label}</span>
        {badgeText && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
            {badgeText}
          </span>
        )}
        {count !== undefined && (
          <span
            className={`text-xs mono px-2 py-0.5 rounded-full ${
              isAlert
                ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30'
                : 'bg-[#16213A] text-[#C3CEDF]'
            }`}
          >
            {count}
          </span>
        )}
      </button>
    );
  };

  const nextStep = setupSteps.find((s) => !s.completed);
  const nextStepTitle = nextStep 
    ? (d.stepTitles[nextStep.id] || nextStep.title) 
    : t.setupDone;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#03060E]/75 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`border-[#1A2440] bg-[#0B1222] flex flex-col justify-between p-4 transition-all duration-300 ease-in-out shrink-0 ${
          isOpen
            ? `fixed inset-y-0 ${language === 'en' ? 'left-0 border-r' : 'right-0 border-l'} z-50 w-72 sm:w-80 max-w-[85vw] shadow-2xl flex translate-x-0`
            : `hidden lg:flex lg:static lg:h-screen lg:sticky lg:top-0 lg:z-auto ${language === 'en' ? 'lg:border-r' : 'lg:border-l'} w-72 sm:w-80`
        }`}
      >
        <div className="flex flex-col gap-4 overflow-y-auto">
          {/* Header & Logo */}
          <div className="flex items-center justify-between pb-2 border-b border-[#1A2440]">
            <button
              onClick={() => {
                setCurrentPage('landing');
                onClose();
              }}
              className="flex items-center gap-2.5 group focus:outline-none cursor-pointer"
            >
              <img src="/mark.png" alt="AssetFlow Logo" className="w-8 h-8 rounded-lg shadow-sm" />
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Asset<span className="grad font-bold">Flow</span>
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#8696AE] hover:text-white hover:bg-[#121C33] lg:hidden cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Facility & Active Role Selector */}
          <div className={`p-2.5 rounded-xl bg-[#0F1729] border border-[#1E2A44] flex items-center justify-between ${
            language === 'en' ? 'text-left' : 'text-right'
          }`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-700 to-teal-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {language === 'en' ? 'NW' : 'م'}
              </span>
              <div className="truncate">
                <span className="block text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                  {currentUser.role === 'admin' ? (isEn ? 'Director Portal' : 'بوابة الإدارة') : (currentUser.role === 'technician' ? (isEn ? 'Technician Portal' : 'بوابة الفني') : (isEn ? 'Reporter Portal' : 'بوابة المُبلِّغ'))}
                </span>
                <span className="block text-xs font-semibold text-white truncate">{t.facilityName}</span>
              </div>
            </div>
          </div>

          {/* Role-Based Navigation Links */}
          <nav className={`flex flex-col gap-1 ${language === 'en' ? 'text-left font-sans' : 'text-right font-arabic'}`}>
            
            {/* 1. ADMIN / MANAGER NAVIGATION */}
            {currentUser.role === 'admin' && (
              <>
                <div className="text-[11px] font-bold text-[#8696AE] px-3 pt-2 pb-1 uppercase tracking-wider">
                  {t.sectionMain}
                </div>
                {navItem('dashboard', t.dashboard, <LayoutDashboard size={18} />)}
                {navItem('issues', t.issues, <AlertTriangle size={18} />, openIssuesCount, true)}

                <div className="text-[11px] font-bold text-[#8696AE] px-3 pt-3 pb-1 uppercase tracking-wider">
                  {t.sectionOps}
                </div>
                {navItem('assets', t.assets, <Box size={18} />, assets.length)}
                {navItem('sites', t.sites, <Building2 size={18} />, sites.length)}
                {navItem(
                  'services', 
                  t.services, 
                  <ShieldAlert size={18} />, 
                  criticalServicesRiskCount > 0 ? `${criticalServicesRiskCount} !` : undefined, 
                  criticalServicesRiskCount > 0
                )}
                {navItem('work-orders', t.workOrders, <Wrench size={18} />, openOrdersCount)}
                {navItem('preventive', t.preventive, <CalendarClock size={18} />)}

                <div className="text-[11px] font-bold text-[#8696AE] px-3 pt-3 pb-1 uppercase tracking-wider">
                  {t.sectionAdmin}
                </div>
                {navItem('team', t.team, <Users size={18} />)}
                {navItem('reports', t.reports, <BarChart3 size={18} />)}
                {navItem('settings', t.settings, <Settings size={18} />)}
                {navItem('audit', t.audit, <ShieldCheck size={18} />)}
                {navItem('profile', t.profile, <User size={18} />)}
              </>
            )}

            {/* 2. FIELD TECHNICIAN NAVIGATION */}
            {currentUser.role === 'technician' && (
              <>
                <div className="text-[11px] font-bold text-[#8696AE] px-3 pt-2 pb-1 uppercase tracking-wider">
                  {isEn ? 'Technician Workspace' : 'مساحة عمل الفني'}
                </div>
                {navItem('tech-portal', t.techPortal, <Wrench size={18} />, openOrdersCount, true)}
                {navItem('assets', t.techAssets, <Box size={18} />, assets.length)}
                {navItem('work-orders', t.workOrders, <Layers size={18} />)}
                {navItem('profile', t.profile, <User size={18} />)}
              </>
            )}

            {/* 3. OPERATIONAL REPORTER NAVIGATION */}
            {currentUser.role === 'reporter' && (
              <>
                <div className="text-[11px] font-bold text-[#8696AE] px-3 pt-2 pb-1 uppercase tracking-wider">
                  {isEn ? 'Reporter Workspace' : 'مساحة عمل المُبلِّغ'}
                </div>
                {navItem('issues-new', t.reportIssue, <AlertTriangle size={18} />, undefined, false)}
                {navItem('my-issues', t.myIssues, <FileText size={18} />, issues.filter(i => i.reportedBy === currentUser.name || i.reportedBy === 'هبة يعيش').length)}
                {navItem('profile', t.profile, <User size={18} />)}
              </>
            )}

          </nav>
        </div>

        {/* Bottom Role Switcher & Setup Progress Card */}
        <div className="mt-4 pt-3 border-t border-[#1A2440] space-y-3">
          
          {/* Fast Persona Switcher Pill */}
          <div className="p-2 rounded-xl bg-[#0F1729] border border-[#1E2A44] space-y-1.5">
            <span className="text-[10px] font-bold text-[#8696AE] block uppercase tracking-wider px-1">
              {isEn ? 'Switch Persona Demo:' : 'تبديل الدور للتجربة:'}
            </span>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => switchRole('admin')}
                className={`py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  currentUser.role === 'admin'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-[#0B1222] text-[#8696AE] hover:text-white'
                }`}
              >
                {isEn ? 'Admin' : 'مدير'}
              </button>
              <button
                type="button"
                onClick={() => switchRole('technician')}
                className={`py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  currentUser.role === 'technician'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-[#0B1222] text-[#8696AE] hover:text-white'
                }`}
              >
                {isEn ? 'Tech' : 'فني'}
              </button>
              <button
                type="button"
                onClick={() => switchRole('reporter')}
                className={`py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  currentUser.role === 'reporter'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-[#0B1222] text-[#8696AE] hover:text-white'
                }`}
              >
                {isEn ? 'Reporter' : 'مُبلِّغ'}
              </button>
            </div>
          </div>

          {/* Setup Progress */}
          {currentUser.role === 'admin' && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-900/20 to-teal-900/10 border border-[#22304D] flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5 text-[11px]">
                  <Sparkles size={13} className="text-[#34D399]" />
                  {t.setupProgress}
                </span>
                <span className="mono font-bold text-[#34D399] text-xs">{setupPercentage}%</span>
              </div>
              
              <div className="h-1.5 rounded-full bg-[#16213A] overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-[#34D399] transition-all duration-500"
                  style={{ width: `${setupPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
