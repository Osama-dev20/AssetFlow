import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleGuard } from './components/auth/RoleGuard';

// Route-level code splitting: Dashboard Core Layout & Feature Pages
const AppShell = React.lazy(() => import('./layouts/AppShell/AppShell').then((m) => ({ default: m.AppShell })));
const DashboardOverview = React.lazy(() => import('./pages/dashboard/DashboardOverview').then((m) => ({ default: m.DashboardOverview })));
const UsersPage = React.lazy(() => import('./features/users/UsersPage').then((m) => ({ default: m.UsersPage })));
const SitesPage = React.lazy(() => import('./features/sites/SitesPage').then((m) => ({ default: m.SitesPage })));
const ServicesPage = React.lazy(() => import('./features/services/ServicesPage').then((m) => ({ default: m.ServicesPage })));
const AssetsPage = React.lazy(() => import('./features/assets/AssetsPage').then((m) => ({ default: m.AssetsPage })));
const AssetDetailsPage = React.lazy(() => import('./features/assets/AssetDetailsPage').then((m) => ({ default: m.AssetDetailsPage })));
const WorkOrdersPage = React.lazy(() => import('./features/workorders/WorkOrdersPage').then((m) => ({ default: m.WorkOrdersPage })));
const PlaceholderPage = React.lazy(() => import('./pages/dashboard/PlaceholderPage').then((m) => ({ default: m.PlaceholderPage })));
const AnalyticsDashboardPage = React.lazy(() => import('./pages/dashboard/AnalyticsDashboardPage').then((m) => ({ default: m.AnalyticsDashboardPage })));
const SettingsPage = React.lazy(() => import('./pages/dashboard/SettingsPage').then((m) => ({ default: m.SettingsPage })));

// Public Auth & Demo Pages
const LoginPage = React.lazy(() => import('./components/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const SignupPage = React.lazy(() => import('./components/auth/SignupPage').then((m) => ({ default: m.SignupPage })));
const ContactPage = React.lazy(() => import('./components/contact/ContactPage').then((m) => ({ default: m.ContactPage })));
const App1Demo = React.lazy(() => import('./components/ui/demo'));
const MotionFooterDemo = React.lazy(() => import('./components/ui/demo-motion-footer'));

// Lightweight, zero-shift loading fallback
const PageFallback = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-slate-950 text-slate-300">
    <div className="w-9 h-9 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-3" />
    <span className="text-xs font-mono tracking-widest text-slate-500 uppercase">Loading...</span>
  </div>
);

// Prefetch helpers to enable instant transition on hover or idle
export const prefetchRoute = (name: 'dashboard' | 'assets' | 'login' | 'contact') => {
  switch (name) {
    case 'dashboard':
      import('./layouts/AppShell/AppShell');
      import('./pages/dashboard/DashboardOverview');
      break;
    case 'assets':
      import('./features/assets/AssetsPage');
      break;
    case 'login':
      import('./components/auth/LoginPage');
      break;
    case 'contact':
      import('./components/contact/ContactPage');
      break;
  }
};

interface AppRoutesProps {
  LandingPage: React.ComponentType;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ LandingPage }) => {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* 1. Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/:role" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/demo/app1" element={<App1Demo />} />
        <Route path="/demo/footer" element={<MotionFooterDemo />} />

        {/* 2. Protected Dashboard Core Routes (/dashboard) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />

          {/* Feature 1: Users Management (Admin RoleGuard) */}
          <Route
            path="users"
            element={
              <RoleGuard allowedRoles={['admin']}>
                <UsersPage />
              </RoleGuard>
            }
          />

          {/* Feature 2: Sites Management (Admin & Technician RoleGuard) */}
          <Route
            path="sites"
            element={
              <RoleGuard allowedRoles={['admin', 'technician']}>
                <SitesPage />
              </RoleGuard>
            }
          />

          {/* Feature 3: Critical Services Matrix */}
          <Route
            path="services"
            element={
              <RoleGuard allowedRoles={['admin', 'technician']}>
                <ServicesPage />
              </RoleGuard>
            }
          />

          {/* Feature 4: Assets Management & Details */}
          <Route path="assets" element={<AssetsPage />} />
          <Route path="assets/:id" element={<AssetDetailsPage />} />

          {/* Operations & CMMS Work Orders */}
          <Route path="work-orders" element={<WorkOrdersPage />} />

          <Route
            path="preventive"
            element={
              <RoleGuard allowedRoles={['admin']}>
                <PlaceholderPage
                  titleAr="الصيانة الوقائية (Preventive PM)"
                  titleEn="Preventive Maintenance"
                  descriptionAr="جداول الصيانة الدورية المبنية على ساعات التشغيل وتواريخ الفحص."
                  descriptionEn="Time and usage based preventive maintenance schedules."
                  tag="Admin Only"
                />
              </RoleGuard>
            }
          />

          <Route
            path="team"
            element={
              <RoleGuard allowedRoles={['admin']}>
                <PlaceholderPage
                  titleAr="فريق العمل والفنيين"
                  titleEn="Technicians & Dispatch"
                  descriptionAr="توزيع المهام والمناوبات الميدانية ومراقبة كفاءة التنفيذ."
                  descriptionEn="Technician scheduling, mobile dispatch, and shift allocation."
                  tag="Admin Only"
                />
              </RoleGuard>
            }
          />

          <Route
            path="analytics"
            element={
              <RoleGuard allowedRoles={['admin']}>
                <AnalyticsDashboardPage />
              </RoleGuard>
            }
          />

          <Route
            path="settings"
            element={
              <RoleGuard allowedRoles={['admin']}>
                <SettingsPage />
              </RoleGuard>
            }
          />

          <Route
            path="inspections"
            element={
              <RoleGuard allowedRoles={['technician', 'admin']}>
                <PlaceholderPage
                  titleAr="قوائم الفحص والتفتيش (LOTO & Safety)"
                  titleEn="Inspection Checklists"
                  descriptionAr="قوائم التدقيق الرقمية، تصاريح العمل، وإجراءات العزل والإغلاق."
                  descriptionEn="Digital safety inspection forms, LOTO isolation, and EHS audit."
                  tag="Technician / Admin"
                />
              </RoleGuard>
            }
          />

          <Route
            path="new-request"
            element={
              <PlaceholderPage
                titleAr="تقديم بلاغ عطل جديد"
                titleEn="Submit Issue Report"
                descriptionAr="نموذج الإبلاغ الفوري عن أعطال الأصول وتحديد درجة الخطورة."
                descriptionEn="Rapid incident and asset defect reporting form."
                tag="Reporter"
              />
            }
          />

          <Route
            path="my-reports"
            element={
              <PlaceholderPage
                titleAr="سجل بلاغاتي السابقة"
                titleEn="My Submitted Requests"
                descriptionAr="متابعة حالة البلاغات التي تم إرسالها ومراحل المعالجة الحالية."
                descriptionEn="Tracking history and status of your submitted maintenance issues."
                tag="Reporter"
              />
            }
          />
        </Route>

        {/* 3. Direct Route /app/assets and /app/assets/:id support */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="assets" element={<AssetsPage />} />
          <Route path="assets/:id" element={<AssetDetailsPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="work-orders" element={<WorkOrdersPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* 4. Fallback */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
