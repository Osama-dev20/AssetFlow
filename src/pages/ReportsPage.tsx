import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, Download, TrendingUp, Clock, AlertTriangle, CheckCircle2, DollarSign, Calendar } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { showToast, language } = useApp();
  const isEn = language === 'en';
  const [timeframe, setTimeframe] = useState<'90d' | '12m'>('90d');

  const handleExport = (format: 'pdf' | 'csv') => {
    showToast(
      isEn ? `Report exported successfully (${format.toUpperCase()})` : `تم تصدير التقرير بنجاح (${format.toUpperCase()})`,
      isEn ? 'Maintenance & reliability metrics summary downloaded to your device' : 'تم تنزيل ملخص مؤشرات الصيانة والاعتمادية على جهازك',
      'success'
    );
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full ${isEn ? 'text-left font-sans' : 'text-right font-arabic'}`}>
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isEn ? 'Analytics & Engineering Reports' : 'التحليلات والتقارير الهندسية'}
          </h1>
          <p className="text-xs sm:text-sm text-[#A3B1C6] mt-1">
            {isEn 
              ? 'Operational uptime indicators, SLA closure rate, and lifecycle maintenance expenditure.' 
              : 'مؤشرات الجاهزية التشغيلية، ومعدل إغلاق الأعطال ضمن اتفاقية مستوى الخدمة (SLA)، وتكاليف الصيانة.'}
          </p>
        </div>

        {/* Timeframe switch & Export */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center p-1 rounded-xl bg-[#0F1729] border border-[#26324A] text-xs">
            <button
              onClick={() => setTimeframe('90d')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                timeframe === '90d' ? 'bg-[#1E2A44] text-white' : 'text-[#8696AE] hover:text-white'
              }`}
            >
              {isEn ? 'Last 90 Days' : 'آخر 90 يوم'}
            </button>
            <button
              onClick={() => setTimeframe('12m')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                timeframe === '12m' ? 'bg-[#1E2A44] text-white' : 'text-[#8696AE] hover:text-white'
              }`}
            >
              {isEn ? 'Last 12 Months (Annual)' : 'آخر 12 شهر (سنوي)'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('csv')}
              className="h-10 px-3.5 rounded-xl border border-[#26324A] bg-[#0F1729] text-[#C3CEDF] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download size={14} />
              <span>{isEn ? 'Export CSV' : 'تصدير CSV'}</span>
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-xs hover:brightness-110 shadow-lg shadow-blue-600/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download size={14} />
              <span>{isEn ? 'PDF Report' : 'تقرير PDF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0F1729] border border-[#1E2A44]">
          <div className="flex items-center justify-between text-xs text-[#8696AE]">
            <span>{isEn ? 'Operational Uptime' : 'نسبة الجاهزية التشغيلية (Uptime)'}</span>
            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
              <TrendingUp size={12} />
              +1.8%
            </span>
          </div>
          <div className="text-3xl font-bold text-white mono mt-1">98.4%</div>
          <div className="text-xs text-[#A3B1C6] mt-0.5">
            {isEn ? 'Critical service stability rate' : 'معدل استقرار الخدمات الحرجة'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F1729] border border-[#1E2A44]">
          <div className="flex items-center justify-between text-xs text-[#8696AE]">
            <span>{isEn ? 'Mean Time to Repair (MTTR)' : 'متوسط زمن الإصلاح (MTTR)'}</span>
            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
              <TrendingUp size={12} />
              {isEn ? '-28% gain' : '-28% تحسن'}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mono mt-1">3.2 <span className="text-xs text-[#8696AE]">{isEn ? 'hours' : 'ساعة'}</span></div>
          <div className="text-xs text-[#A3B1C6] mt-0.5">
            {isEn ? 'Down from 4.5 hrs previously' : 'انخفض من 4.5 ساعة سابقًا'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F1729] border border-[#1E2A44]">
          <div className="flex items-center justify-between text-xs text-[#8696AE]">
            <span>{isEn ? 'Response SLA Compliance' : 'الالتزام بمهلة الاستجابة (SLA)'}</span>
            <span className="mono text-blue-400 font-bold">94%</span>
          </div>
          <div className="text-3xl font-bold text-white mono mt-1">47 <span className="text-xs text-[#8696AE]">{isEn ? 'of 50' : 'من 50'}</span></div>
          <div className="text-xs text-[#A3B1C6] mt-0.5">
            {isEn ? 'Orders resolved within deadline' : 'أوامر أغلقت ضمن الوقت المحدد'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F1729] border border-[#1E2A44]">
          <div className="flex items-center justify-between text-xs text-[#8696AE]">
            <span>{isEn ? 'Total Maintenance Cost' : 'تكلفة الصيانة الإجمالية'}</span>
            <span className="text-[#8696AE] text-xs">{isEn ? 'Saved 15%' : 'وفر 15%'}</span>
          </div>
          <div className="text-3xl font-bold text-white mono mt-1">$18,450</div>
          <div className="text-xs text-[#A3B1C6] mt-0.5">
            {isEn ? 'Parts $12.2k + Labor $6.2k' : 'قطع غيار $12.2k + عمالة $6.2k'}
          </div>
        </div>
      </div>

      {/* Visual Chart Bars Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Availability Trend by Month (Col 8) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0F1729] border border-[#1E2A44] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E2A44]">
            <div>
              <h3 className="font-bold text-base text-white">
                {isEn ? 'Water Utilities & Hospital Reliability Availability' : 'معدل توافر وجاهزية محطات المياه والمستشفى'}
              </h3>
              <p className="text-xs text-[#8696AE] mt-0.5">
                {isEn ? 'Monthly comparison of actual asset uptime ratios' : 'مقارنة شهرية لنسب التشغيل الفعلي للأصول'}
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
              {isEn ? 'Facility Target: 98%' : 'هدف المنشأة: 98%'}
            </span>
          </div>

          {/* Bar Chart Simulation */}
          <div className="pt-6 pb-2 space-y-3">
            {[
              { month: isEn ? 'July' : 'يوليو', rate: 97.2, target: 98 },
              { month: isEn ? 'August' : 'أغسطس', rate: 98.6, target: 98 },
              { month: isEn ? 'September' : 'سبتمبر', rate: 99.1, target: 98 },
              { month: isEn ? 'October (Current)' : 'أكتوبر (الحالي)', rate: 98.4, target: 98 },
            ].map((bar, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-white">{bar.month}</span>
                  <span className="mono font-bold text-blue-400">{bar.rate}%</span>
                </div>
                <div className="h-3 rounded-full bg-[#16213A] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-teal-400 rounded-full transition-all duration-700"
                    style={{ width: `${bar.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-[#8696AE] pt-2 border-t border-[#1A2440] flex items-center justify-between">
            <span>{isEn ? 'Aggregated from IoT vibration sensors and work order logs' : 'البيانات مجمعة من حساسات التشغيل وسجلات أوامر العمل'}</span>
            <span className="text-teal-400">{isEn ? 'Continuous improvement via preventive PM' : 'تحسن مستمر بفضل الصيانة الوقائية'}</span>
          </div>
        </div>

        {/* Cost Breakdown & Work Orders by Type (Col 4) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0F1729] border border-[#1E2A44] space-y-4">
          <h3 className="font-bold text-base text-white pb-2 border-b border-[#1E2A44]">
            {isEn ? 'Work Orders by Type' : 'توزيع أوامر العمل حسب النوع'}
          </h3>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#A3B1C6]">{isEn ? 'Scheduled Preventive PM' : 'صيانة وقائية دورية (PM)'}</span>
                <span className="mono font-bold text-teal-400">58%</span>
              </div>
              <div className="h-2 rounded-full bg-[#16213A] overflow-hidden">
                <div className="h-full bg-teal-400 rounded-full" style={{ width: '58%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#A3B1C6]">{isEn ? 'Urgent Corrective Breakdowns' : 'أعطال تصحيحية عاجلة'}</span>
                <span className="mono font-bold text-rose-400">26%</span>
              </div>
              <div className="h-2 rounded-full bg-[#16213A] overflow-hidden">
                <div className="h-full bg-rose-400 rounded-full" style={{ width: '26%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#A3B1C6]">{isEn ? 'Engineering Upgrades' : 'تحسينات وتعديلات هندسية'}</span>
                <span className="mono font-bold text-blue-400">16%</span>
              </div>
              <div className="h-2 rounded-full bg-[#16213A] overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: '16%' }} />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B1222] border border-[#1A2440] text-xs text-[#A3B1C6] leading-relaxed mt-4">
            {isEn 
              ? <>Strategic Target: Reach <strong>70%</strong> preventive ratio to eliminate unplanned emergency shutdowns.</> 
              : <>الهدف الاستراتيجي: الوصول بنسبة الصيانة الوقائية إلى <strong>70%</strong> لتقليل التوقفات الطارئة غير المخططة.</>}
          </div>
        </div>
      </div>
    </div>
  );
};
