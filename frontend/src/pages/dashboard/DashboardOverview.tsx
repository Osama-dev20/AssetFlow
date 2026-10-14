import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useMockStore } from '../../data/mockStore';
import { StatusChip } from '../../shared/ui/StatusChip';
import type { UserRole } from '../../types';
import {
  Box,
  Building2,
  ShieldAlert,
  Users,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Activity,
  Layers,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { language, currentUser, setCurrentUser, addToast } = useApp();
  const store = useMockStore();
  const navigate = useNavigate();
  const isRTL = language === 'ar';

  const userRole: UserRole = currentUser?.role || 'admin';

  const assets = store.getAssets();
  const sites = store.getSites();
  const services = store.getServices();
  const users = store.getUsers();

  const operationalAssets = assets.filter((a) => a.status === 'operational').length;
  const maintenanceAssets = assets.filter((a) => a.status === 'maintenance').length;
  const highCriticalityServices = services.filter((s) => s.criticality === 'high').length;
  const uptimeRate = assets.length > 0 ? Math.round((operationalAssets / assets.length) * 100) : 98;

  const roleTitleMap: Record<UserRole, { ar: string; en: string }> = {
    admin: { ar: 'مدير المنظمة والعمليات', en: 'Operations & Maintenance Admin' },
    technician: { ar: 'فني صيانة معتمد', en: 'Certified Maintenance Tech' },
    reporter: { ar: 'مبلّغ تشغيلي ميداني', en: 'Operational Reporter' },
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in select-none">
      {/* 1. Hero Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Glow orb */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/15 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/25 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>{roleTitleMap[userRole][language]}</span>
              </span>
              <span className="text-xs text-slate-400">
                {isRTL ? 'المنظومة متصلة وسجلات الصيانة فورية' : 'Live CMMS synchronization'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {isRTL ? 'مرحباً بك، ' : 'Welcome back, '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                {currentUser?.fullName?.split(' ')[0] || 'Tariq'}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isRTL
                ? 'لوحة التحكم المركزية لمنظومة AssetFlow لمتابعة الأصول التشغيلية، ومصفوفة الخدمات الحرجة وفِرق العمل الميدانية.'
                : 'Central operations console tracking asset uptime, critical service dependencies, and preventive work orders.'}
            </p>
          </div>

          {/* Quick Action Pill on Banner */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/assets"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#1d68bd] to-[#2eaf7d] shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-102 transition-all cursor-pointer flex items-center gap-2"
            >
              <Box className="w-4 h-4" />
              <span>{isRTL ? 'استعراض الأصول' : 'Explore Assets'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Assets */}
        <Link
          to="/dashboard/assets"
          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isRTL ? 'إجمالي الأصول' : 'Total Assets'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Box className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {assets.length}
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+100% SLA</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {operationalAssets} {isRTL ? 'أصل يعمل بكفاءة' : 'operational assets'}
          </p>
        </Link>

        {/* Metric 2: Critical Services */}
        <Link
          to="/dashboard/services"
          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isRTL ? 'الخدمات الحرجة' : 'Critical Services'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {services.length}
            </span>
            <span className="text-xs text-rose-400 font-semibold">
              {highCriticalityServices} {isRTL ? 'حرجة للغاية' : 'high criticality'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {isRTL ? 'كافة الخدمات متصلة بمصادر طوارئ' : 'All services linked to backup assets'}
          </p>
        </Link>

        {/* Metric 3: Active Sites */}
        <Link
          to="/dashboard/sites"
          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isRTL ? 'المواقع والمنشآت' : 'Operational Sites'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {sites.length}
            </span>
            <span className="text-xs text-emerald-400 font-semibold">
              {sites.filter((s) => s.status === 'active').length} {isRTL ? 'موقع نشط' : 'active'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {isRTL ? 'موزعة عبر المحافظات الصناعية' : 'Distributed regional facilities'}
          </p>
        </Link>

        {/* Metric 4: Team & Technicians */}
        <Link
          to="/dashboard/users"
          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isRTL ? 'المستخدمون والفنيون' : 'Users & Team'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {users.length}
            </span>
            <span className="text-xs text-blue-400 font-semibold">
              {users.filter((u) => u.role === 'technician').length} {isRTL ? 'فنيين' : 'techs'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {isRTL ? 'جاهزية استجابة للبلاغات 100%' : '100% field readiness'}
          </p>
        </Link>
      </div>

      {/* 3. Core Modules Quick Access Grid */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {isRTL ? 'الوحدات التشغيلية الأساسية' : 'Core Operational Modules'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card: Users */}
          <Link
            to="/dashboard/users"
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                {isRTL ? 'إدارة المستخدمين' : 'Users Management'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {isRTL
                  ? 'جداول المستخدمين، تفعيل وتعطيل الحسابات وتوزيع الصلاحيات.'
                  : 'Manage user directory, activate/deactivate accounts, and edit roles.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-400">
              <span>{isRTL ? 'فتح الصفحة' : 'Open Module'}</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card: Sites */}
          <Link
            to="/dashboard/sites"
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                {isRTL ? 'إدارة المواقع' : 'Sites Management'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {isRTL
                  ? 'تعريف المواقع والمنشآت الصناعية وكثافة الأصول والتعطيل الناعم.'
                  : 'Facilities hierarchy, site codes, asset density and soft deletion.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span>{isRTL ? 'فتح الصفحة' : 'Open Module'}</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card: Assets */}
          <Link
            to="/dashboard/assets"
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1d68bd] to-[#2eaf7d] text-white flex items-center justify-center mb-3 shadow-md shadow-blue-500/20">
                <Box className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                {isRTL ? 'إدارة الأصول التشغيلية' : 'Assets Directory'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {isRTL
                  ? 'الفلاتر المتزامنة مع الرابط URL، تفاصيل الأصل وربط الخدمات الحرجة.'
                  : 'URL-synchronized filtering, asset details, and critical service links.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-400">
              <span>{isRTL ? 'فتح الصفحة' : 'Open Module'}</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card: Critical Services */}
          <Link
            to="/dashboard/services"
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center mb-3">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                {isRTL ? 'الخدمات الحرجة' : 'Critical Services'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {isRTL
                  ? 'مصفوفة درجات الخطورة (High, Medium, Low) والأصول المساندة.'
                  : 'High-availability services matrix, dependency mapping and linking.'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-rose-400">
              <span>{isRTL ? 'فتح الصفحة' : 'Open Module'}</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* 4. Live Assets Snapshot Preview */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">
              {isRTL ? 'أحدث الأصول المسجلة في المنظومة' : 'Recent Assets Snapshot'}
            </h3>
            <p className="text-xs text-slate-400">
              {isRTL ? 'عينة حية من جدول الأصول وقابلية الضغط للانتقال المباشر' : 'Click any asset to inspect linked critical services'}
            </p>
          </div>
          <Link
            to="/dashboard/assets"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>{isRTL ? 'عرض كافة الأصول' : 'View All'}</span>
            {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {assets.slice(0, 3).map((asset) => (
            <div
              key={asset.id}
              onClick={() => navigate(`/dashboard/assets/${asset.id}`)}
              className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 hover:border-blue-500/50 hover:bg-slate-800 transition-all cursor-pointer space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded" dir="ltr">
                  {asset.code}
                </span>
                <StatusChip status={asset.status} size="sm" />
              </div>

              <h4 className="font-bold text-white text-xs truncate">
                {asset.name}
              </h4>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-700/50">
                <span className="truncate max-w-[150px]">{asset.siteName}</span>
                <span className="text-rose-400 font-semibold flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  <span>{asset.criticalServiceIds.length} {isRTL ? 'خدمات' : 'services'}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
