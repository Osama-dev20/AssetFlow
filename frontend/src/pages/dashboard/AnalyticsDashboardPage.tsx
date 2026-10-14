import React from 'react';
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  TrendingUp,
  CheckCircle2,
  Clock,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Box,
  Calendar,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Cpu,
} from 'lucide-react';

interface MetricItem {
  labelAr: string;
  labelEn: string;
  value: string;
  changeAr: string;
  changeEn: string;
  isPositive: boolean;
  icon: React.ElementType;
  color: string;
}

const METRICS: MetricItem[] = [
  {
    labelAr: 'جاهزية الأصول الحرجة',
    labelEn: 'Critical Assets Uptime',
    value: '99.82%',
    changeAr: '+0.4% مقارنة بالشهر السابق',
    changeEn: '+0.4% from last month',
    isPositive: true,
    icon: ShieldCheck,
    color: 'emerald',
  },
  {
    labelAr: 'متوسط زمن الإصلاح (MTTR)',
    labelEn: 'Mean Time to Repair (MTTR)',
    value: '1.4 hrs',
    changeAr: 'انخفاض زمن التدخل 18%',
    changeEn: '18% faster resolution',
    isPositive: true,
    icon: Clock,
    color: 'blue',
  },
  {
    labelAr: 'متوسط الوقت بين الأعطال (MTBF)',
    labelEn: 'Mean Time Between Failures',
    value: '1,840 hrs',
    changeAr: '+210 ساعة استقرار تشغيلي',
    changeEn: '+210 hrs operational stability',
    isPositive: true,
    icon: Cpu,
    color: 'cyan',
  },
  {
    labelAr: 'نسبة إنجاز أوامر العمل',
    labelEn: 'Work Order Completion',
    value: '89.4%',
    changeAr: '127 أمر منجز من 142',
    changeEn: '127 closed / 142 total',
    isPositive: true,
    icon: CheckCircle2,
    color: 'purple',
  },
];

const THROUGHPUT_DATA = [
  { week: 'W1', opened: 38, resolved: 42 },
  { week: 'W2', opened: 45, resolved: 44 },
  { week: 'W3', opened: 52, resolved: 49 },
  { week: 'W4', opened: 36, resolved: 41 },
  { week: 'W5', opened: 48, resolved: 54 },
  { week: 'W6', opened: 42, resolved: 47 },
  { week: 'W7', opened: 58, resolved: 62 },
  { week: 'W8', opened: 39, resolved: 48 },
];

const CRITICAL_PROJECTS = [
  {
    id: 'PRJ-01',
    nameAr: 'عمرة وتأهيل شبكة مضخات التحلية الرئيسية #04',
    nameEn: 'Desalination Pump Grid #04 Overhaul',
    progress: 78,
    statusAr: 'قيد التنفيذ',
    statusEn: 'In Progress',
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dueDate: '2026-10-24',
    tech: 'عمر طارق • فريق الميكانيك',
  },
  {
    id: 'PRJ-02',
    nameAr: 'معايرة حساسات الاهتزاز والضغط عبر SCADA',
    nameEn: 'SCADA Telemetry & Vibration Sensor Calibration',
    progress: 92,
    statusAr: 'مرحلة الفحص النهائي',
    statusEn: 'Verification',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dueDate: '2026-10-18',
    tech: 'م. أحمد شاهين • التحكم الآلي',
  },
  {
    id: 'PRJ-03',
    nameAr: 'استبدال بطاريات المولدات الاحتياطية (Tier-4)',
    nameEn: 'Tier-4 Emergency Generator Battery Replacement',
    progress: 45,
    statusAr: 'انتظار توريد القطع',
    statusEn: 'Awaiting Spares',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dueDate: '2026-10-29',
    tech: 'سالم الكعبي • طاقة الطوارئ',
  },
  {
    id: 'PRJ-04',
    nameAr: 'التدقيق الشامل لغرف العناية المركزة والمستشفيات',
    nameEn: 'Clinical Clean-Air & Oxygen Pipeline Audit',
    progress: 100,
    statusAr: 'مكتمل بنجاح',
    statusEn: 'Completed',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dueDate: '2026-10-12',
    tech: 'فريق الهندسة الطبية المعتمد',
  },
];

const RECENT_ACTIVITIES = [
  {
    id: 'ACT-01',
    titleAr: 'إنجاز أمر صيانة عاجل: مضخة تغذية محطة المياه #WP-04',
    titleEn: 'Emergency PM Completed: Water Feed Pump #WP-04',
    timeAr: 'منذ 14 دقيقة',
    timeEn: '14 mins ago',
    type: 'success',
  },
  {
    id: 'ACT-02',
    titleAr: 'رصد تذبذب حراري طفيف في المولد الكهربائي #GEN-01',
    titleEn: 'Thermal Telemetry Anomaly Detected: Generator #GEN-01',
    timeAr: 'منذ 42 دقيقة',
    timeEn: '42 mins ago',
    type: 'warning',
  },
  {
    id: 'ACT-03',
    titleAr: 'اكتمال فحص العزل الكهربائي الدوري واختبار LOTO',
    titleEn: 'Scheduled LOTO Isolation and Electrical Audit Passed',
    timeAr: 'منذ ساعتين',
    timeEn: '2 hours ago',
    type: 'info',
  },
  {
    id: 'ACT-04',
    titleAr: 'تحديث مؤشر كفاءة الأصل وسجل الامتثال التنظيمي ISO 55001',
    titleEn: 'Asset Health Index updated to ISO 55001 Ledger',
    timeAr: 'منذ 4 ساعات',
    timeEn: '4 hours ago',
    type: 'success',
  },
];

export function AnalyticsDashboardPage() {
  const { language } = useApp();
  const isRTL = language === 'ar';

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>{isRTL ? 'التحليلات والمؤشرات المركزية' : 'Executive Analytics Console'}</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Live SCADA & CMMS Telemetry
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isRTL ? 'مؤشرات الأداء وموثوقية الأصول' : 'Asset Reliability & Operations KPIs'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isRTL
              ? 'مراقبة فورية لمعدلات الجاهزية التشغيلية 99.8%، كفاءة أوامر العمل، وزمن التدخل والاستجابة للأعطال.'
              : 'Real-time monitoring of 99.8% operational uptime, work order resolution velocity, and predictive health trends.'}
          </p>
        </div>

        {/* Date Filter Badge */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2 shadow-xs">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>{isRTL ? 'آخر 8 أسابيع • مباشر' : 'Last 8 Weeks • Real-time'}</span>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/90 rounded-2xl p-5 shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">
                  {isRTL ? metric.labelAr : metric.labelEn}
                </span>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    metric.color === 'emerald'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : metric.color === 'blue'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : metric.color === 'cyan'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums">
                  {metric.value}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{isRTL ? metric.changeAr : metric.changeEn}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Main Chart: Work Order Throughput */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-xl shadow-black/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                {isRTL ? 'كفاءة إنجاز أوامر العمل (Task Throughput)' : 'Work Order Resolution Throughput'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isRTL
                ? 'مقارنة البلاغات المفتوحة مقابل أوامر الصيانة المنجزة خلال الأسابيع الثمانية الأخيرة.'
                : 'Tasks opened vs maintenance work orders resolved across the last eight operational cycles.'}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
              <span className="text-slate-300">{isRTL ? 'أوامر منجزة (Resolved)' : 'Resolved Orders'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-400 shadow-xs shadow-blue-400/50" />
              <span className="text-slate-300">{isRTL ? 'بلاغات جديدة (Opened)' : 'Opened Issues'}</span>
            </div>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="w-full h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={THROUGHPUT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2EAF7D" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2EAF7D" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="openedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="week" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  fontSize: '12px',
                  color: '#F8FAFC',
                }}
              />
              <Area
                type="monotone"
                dataKey="resolved"
                name={isRTL ? 'أوامر منجزة' : 'Resolved'}
                stroke="#2EAF7D"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#resolvedGradient)"
              />
              <Area
                type="monotone"
                dataKey="opened"
                name={isRTL ? 'بلاغات مفتوحة' : 'Opened'}
                stroke="#38BDF8"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#openedGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Two Executive Columns: Active Projects & Live Telemetry Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Active Projects */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-xl shadow-black/20">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {isRTL ? 'مشاريع الصيانة والتطوير الجارية' : 'Active Maintenance Initiatives'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isRTL ? 'تقدم البرامج الميدانية ومواعيد التسليم المستهدفة' : 'Current work packages & progress status'}
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              4 {isRTL ? 'مشاريع' : 'Projects'}
            </span>
          </div>

          <div className="space-y-4">
            {CRITICAL_PROJECTS.map((prj) => (
              <div
                key={prj.id}
                className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700/80 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white">
                    {isRTL ? prj.nameAr : prj.nameEn}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${prj.badgeClass}`}>
                    {isRTL ? prj.statusAr : prj.statusEn}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{prj.tech}</span>
                    <span className="font-mono font-bold text-white">{prj.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${prj.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>{prj.id}</span>
                  <span>{isRTL ? `تاريخ الإنجاز: ${prj.dueDate}` : `Due: ${prj.dueDate}`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Telemetry & Field Activity Log */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-xl shadow-black/20">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {isRTL ? 'سجل الأنشطة والتدخلات اللحظية' : 'Live Field & SCADA Activity'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isRTL ? 'آخر التحديثات الواردة من الحساسات وفِرق الميدان' : 'Latest telemetry and technician logs'}
              </p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="space-y-3">
            {RECENT_ACTIVITIES.map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800/80 hover:border-slate-700/80 transition-all flex items-start gap-3"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    act.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : act.type === 'warning'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-blue-500/10 text-blue-400'
                  }`}
                >
                  {act.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : act.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : (
                    <Activity className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-200 leading-snug">
                    {isRTL ? act.titleAr : act.titleEn}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {isRTL ? act.timeAr : act.timeEn}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick link button */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <a
              href="/dashboard/work-orders"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>{isRTL ? 'الانتقال إلى سجل أوامر العمل الكامل' : 'View Full Work Orders Ledger'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboardPage;
