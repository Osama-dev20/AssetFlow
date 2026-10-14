import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';

export const AppShell: React.FC = () => {
  const { language } = useApp();
  const isRTL = language === 'ar';

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* 1. Collapsible & Responsive Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Layout Area (adjusts margins based on RTL & collapsed state) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isRTL
            ? isSidebarCollapsed
              ? 'md:mr-20'
              : 'md:mr-72'
            : isSidebarCollapsed
            ? 'md:ml-20'
            : 'md:ml-72'
        }`}
      >
        {/* Top Sticky Header */}
        <DashboardHeader
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Content Area with unified padding and responsive max-width container */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Subtle Dashboard Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              AssetFlow Enterprise CMMS & Critical Services Platform &copy; 2026
            </span>
            <span className="text-[11px] text-slate-600">
              v1.0.4 • High Availability SLA 99.99%
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AppShell;
