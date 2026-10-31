import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, CalendarClock, Check, Plus, Clock, 
  CheckCircle2, AlertTriangle, ArrowLeft, User, Wrench 
} from 'lucide-react';
import { PreventivePlan } from '../types';

export const PreventivePage: React.FC = () => {
  const { preventivePlans, togglePreventiveChecklist, openAssetDetail, showToast, language } = useApp();
  
  const isEn = language === 'en';

  const [filterType, setFilterType] = useState<'all' | 'scheduled' | 'overdue'>('all');

  const filteredPlans = preventivePlans.filter((p) => {
    if (filterType === 'scheduled') return p.status === 'scheduled';
    if (filterType === 'overdue') return p.status === 'overdue';
    return true;
  });

  return (
    <div className={`p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full ${isEn ? 'text-left font-sans' : 'text-right font-arabic'}`}>
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isEn ? 'Preventive Maintenance (PM)' : 'الصيانة الوقائية (PM)'}
          </h1>
          <p className="text-xs sm:text-sm text-[#A3B1C6] mt-1">
            {isEn 
              ? 'Scheduled inspection routines to prevent sudden breakdowns and ensure critical continuity.' 
              : 'خطط وجداول الفحص الدوري لتفادي الأعطال المفاجئة وحماية استمرارية الأصول الحيوية.'}
          </p>
        </div>

        <button
          onClick={() => showToast(
            isEn ? 'Create Preventive Plan' : 'إنشاء خطة صيانة وقائية', 
            isEn ? 'Opened PM scheduler dialog' : 'تم فتح نموذج جدولة الصيانة', 
            'info'
          )}
          className="h-11 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>{isEn ? 'Add Inspection Plan' : 'إضافة خطة فحص دوري'}</span>
        </button>
      </div>

      {/* Filter and View Bar */}
      <div className="p-4 rounded-2xl bg-[#0F1729] border border-[#1E2A44] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0B1222] border border-[#26324A] text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filterType === 'all' ? 'bg-[#1E2A44] text-white' : 'text-[#8696AE] hover:text-white'
            }`}
          >
            {isEn ? `All Plans (${preventivePlans.length})` : `جميع الخطط (${preventivePlans.length})`}
          </button>
          <button
            onClick={() => setFilterType('overdue')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filterType === 'overdue' ? 'bg-rose-500/20 text-rose-300' : 'text-[#8696AE] hover:text-white'
            }`}
          >
            {isEn ? 'Overdue (1)' : 'متأخرة عن الموعد (1)'}
          </button>
          <button
            onClick={() => setFilterType('scheduled')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              filterType === 'scheduled' ? 'bg-[#1E2A44] text-white' : 'text-[#8696AE] hover:text-white'
            }`}
          >
            {isEn ? 'Upcoming Scheduled' : 'مجدولة قادمة'}
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#8696AE]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            {isEn ? 'Weekly' : 'أسبوعي'}
          </span>
          <span className="flex items-center gap-1.5 mx-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
            {isEn ? 'Monthly' : 'شهري'}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
            {isEn ? 'Quarterly' : 'ربع سنوي'}
          </span>
        </div>
      </div>

      {/* PLANS LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => {
          const completedChecks = plan.checklist.filter((c) => c.done).length;
          const percent = Math.round((completedChecks / plan.checklist.length) * 100);

          return (
            <div
              key={plan.id}
              className={`p-5 rounded-2xl bg-[#0F1729] border transition-all flex flex-col justify-between gap-5 card-glow ${
                plan.status === 'overdue' ? 'border-rose-500/35 shadow-rose-950/20' : 'border-[#1E2A44]'
              }`}
            >
              <div className="space-y-4">
                {/* Header status */}
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
                    plan.status === 'overdue'
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                      : plan.status === 'completed'
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-blue-500/10 border-blue-500/20 text-blue-300'
                  }`}>
                    {plan.status === 'overdue' 
                      ? (isEn ? 'Overdue' : 'متأخرة عن الموعد') 
                      : plan.status === 'completed' 
                      ? (isEn ? 'Completed' : 'تم الفحص بنجاح') 
                      : (isEn ? 'Scheduled' : 'مجدولة')}
                  </span>

                  <span className="text-xs text-[#8696AE] mono">{plan.nextDueDate}</span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white">
                    {isEn ? (plan.titleEn || plan.title) : plan.title}
                  </h3>
                  <div
                    onClick={() => openAssetDetail(plan.assetId)}
                    className="text-xs text-blue-400 hover:underline cursor-pointer mt-1"
                  >
                    {isEn ? (plan.assetNameEn || plan.assetName) : plan.assetName} ({plan.assetCode})
                  </div>
                  <div className="text-xs text-[#8696AE] mt-0.5">
                    {isEn ? (plan.siteNameEn || plan.siteName) : plan.siteName}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#8696AE]">{isEn ? 'Checklist Completion:' : 'اكتمال بنود الفحص:'}</span>
                    <span className="mono font-bold text-teal-400">{completedChecks} / {plan.checklist.length}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#16213A] overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-teal-400 transition-all duration-300" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Interactive Checklist */}
                <div className="space-y-2 pt-2 border-t border-[#1A2440]">
                  <div className="text-xs font-semibold text-[#A3B1C6]">
                    {isEn ? 'Technician Tasks (Click to toggle):' : 'قائمة مهام الفني (انقر للتعليم):'}
                  </div>
                  <div className="space-y-1.5">
                    {plan.checklist.map((item) => (
                      <label
                        key={item.id}
                        className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer text-xs transition-colors ${
                          item.done ? 'bg-[#0B1222]/80 text-[#8696AE] line-through' : 'bg-[#0B1222] text-[#E6EDF7] hover:bg-[#16213A]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.done}
                          onChange={() => togglePreventiveChecklist(plan.id, item.id)}
                          className="w-4 h-4 mt-0.5 accent-teal-500 rounded cursor-pointer shrink-0"
                        />
                        <span className="leading-snug">
                          {isEn ? (item.textEn || item.text) : item.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-[#1E2A44] flex items-center justify-between text-xs text-[#8696AE]">
                <div className="flex items-center gap-1.5">
                  <User size={14} className="text-blue-400" />
                  <span className="text-white">
                    {isEn ? (plan.assignedTechnicianEn || plan.assignedTechnician) : plan.assignedTechnician}
                  </span>
                </div>
                <span>{isEn ? `Est. Time: ${plan.estimatedHours} hrs` : `الوقت المقدر: ${plan.estimatedHours} س`}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
