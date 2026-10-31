import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { ToastContainer } from './components/ToastContainer';
import { AddAssetDrawer } from './components/AddAssetDrawer';
import { NewWorkOrderDrawer } from './components/NewWorkOrderDrawer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPages } from './pages/AuthPages';
import { DashboardPage } from './pages/DashboardPage';
import { AssetsPage } from './pages/AssetsPage';
import { AssetDetailPage } from './pages/AssetDetailPage';
import { WorkOrdersPage } from './pages/WorkOrdersPage';
import { CriticalServicesPage } from './pages/CriticalServicesPage';
import { PreventivePage } from './pages/PreventivePage';
import { SitesPage } from './pages/SitesPage';
import { TeamPage } from './pages/TeamPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuditPage } from './pages/AuditPage';
import { IssuesPage } from './pages/IssuesPage';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { MyReportsPage } from './pages/MyReportsPage';
import { TechnicianPortalPage } from './pages/TechnicianPortalPage';
import { ProfilePage } from './pages/ProfilePage';
import { AccessErrorModal } from './components/AccessErrorModal';

export const AppContent: React.FC = () => {
  const { currentPage, language } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [preselectedAssetId, setPreselectedAssetId] = useState<string | undefined>(undefined);

  // Automatically close mobile sidebar and scroll top on page change
  React.useEffect(() => {
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentPage]);

  // If on Landing Page or Auth Pages, render standalone without app shell
  if (currentPage === 'landing') {
    return (
      <>
        <LandingPage onOpenReportFault={() => setIsNewOrderOpen(true)} />
        <ToastContainer />
        <NewWorkOrderDrawer 
          isOpen={isNewOrderOpen} 
          onClose={() => setIsNewOrderOpen(false)} 
        />
      </>
    );
  }

  if (currentPage === 'login') {
    return (
      <>
        <AuthPages initialMode="login" />
        <ToastContainer />
      </>
    );
  }

  if (currentPage === 'signup') {
    return (
      <>
        <AuthPages initialMode="signup" />
        <ToastContainer />
      </>
    );
  }

  // App Shell (Dashboard, Assets, Work Orders, Services, etc.)
  return (
    <div 
      dir={language === 'en' ? 'ltr' : 'rtl'} 
      className={`min-h-screen bg-[#070B16] text-[#E6EDF7] flex antialiased overflow-x-hidden w-full relative ${
        language === 'en' ? 'font-sans' : 'font-arabic'
      }`}
    >
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0A1020] overflow-x-hidden w-full">
        <Header onToggleSidebar={() => setIsSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          {currentPage === 'dashboard' && (
            <DashboardPage
              onOpenNewOrderModal={() => {
                setPreselectedAssetId(undefined);
                setIsNewOrderOpen(true);
              }}
              onOpenNewAssetModal={() => setIsAddAssetOpen(true)}
            />
          )}
          {currentPage === 'assets' && <AssetsPage />}
          {currentPage === 'asset-detail' && (
            <AssetDetailPage 
              onOpenNewOrderForAsset={(assetId) => {
                setPreselectedAssetId(assetId);
                setIsNewOrderOpen(true);
              }} 
            />
          )}
          {currentPage === 'work-orders' && (
            <WorkOrdersPage
              onOpenNewOrder={() => {
                setPreselectedAssetId(undefined);
                setIsNewOrderOpen(true);
              }}
            />
          )}
          {currentPage === 'services' && <CriticalServicesPage />}
          {currentPage === 'preventive' && <PreventivePage />}
          {currentPage === 'sites' && <SitesPage />}
          {currentPage === 'team' && <TeamPage />}
          {currentPage === 'reports' && <ReportsPage />}
          {currentPage === 'settings' && <SettingsPage />}
          {currentPage === 'audit' && <AuditPage />}
          {currentPage === 'issues' && <IssuesPage />}
          {currentPage === 'issues-new' && <ReportIssuePage />}
          {currentPage === 'my-issues' && <MyReportsPage />}
          {currentPage === 'tech-portal' && <TechnicianPortalPage />}
          {currentPage === 'profile' && <ProfilePage />}
        </main>
      </div>

      {/* Global Modals & Drawers accessible everywhere */}
      <AccessErrorModal />
      <CommandPalette />
      <ToastContainer />
      <AddAssetDrawer 
        isOpen={isAddAssetOpen} 
        onClose={() => setIsAddAssetOpen(false)} 
      />
      <NewWorkOrderDrawer 
        isOpen={isNewOrderOpen} 
        preselectedAssetId={preselectedAssetId}
        onClose={() => setIsNewOrderOpen(false)} 
      />
    </div>
  );
};
