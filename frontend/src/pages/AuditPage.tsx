import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Wrench, Settings, Box, Calendar } from 'lucide-react';

export const AuditPage: React.FC = () => {
  const { auditLogs, language } = useApp();
  const isEn = language === 'en';
  const [filterCategory, setFilterCategory] = useState<'all' | 'work_order' | 'asset' | 'settings' | 'pm'>('all');

  const filteredLogs = auditLogs.filter((log) => {
    if (filterCategory === 'all') return true;
    return log.category === filterCategory;
  });

  return (
    <div className={`p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full ${
      isEn ? 'text-left font-sans' : 'text-right font-arabic'
    }`}>
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-2 border-b border-[#1E2A44]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isEn ? 'Audit Log & Change Trail' : 'سجل التدقيق والمراجعة (Audit Log)'}
          </h1>
          <p className="text-xs sm:text-sm text-[#A3B1C6] mt-1">
            {isEn
              ? 'Immutable chronological trail documenting all operational changes, work order updates, and priority weight modifications.'
              : 'سجل زمني غير قابل للتعديل يوثق كافة التغييرات على الأصول، أوامر العمل، وتعديلات نموذج الأولوية.'}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0F1729] border border-[#26324A] text-xs self-start flex-wrap">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
            filterCategory === 'all' ? 'bg-[#1E2A44] text-white' : 'text-[#8696AE] hover:text-white'
          }`}
        >
          {isEn ? 'All' : 'الكل'} ({auditLogs.length})
        </button>
        <button
          onClick={() => setFilterCategory('work_order')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
            filterCategory === 'work_order' ? 'bg-[#1E2A44] text-white' : 'text-[#8696AE] hover:text-white'
          }`}
        >
          {isEn ? 'Work Orders' : 'أوامر العمل'}
        </button>
        <button
          onClick={() => setFilterCategory('asset')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
            filterCategory === 'asset' ? 'bg-[#1E2A44] text-white' : 'text-[#8696AE] hover:text-white'
          }`}
        >
          {isEn ? 'Assets & Services' : 'الأصول والخدمات'}
        </button>
        <button
          onClick={() => setFilterCategory('settings')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
            filterCategory === 'settings' ? 'bg-[#1E2A44] text-white' : 'text-[#8696AE] hover:text-white'
          }`}
        >
          {isEn ? 'Priority Weights' : 'تعديل الأوزان'}
        </button>
        <button
          onClick={() => setFilterCategory('pm')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
            filterCategory === 'pm' ? 'bg-[#1E2A44] text-white' : 'text-[#8696AE] hover:text-white'
          }`}
        >
          {isEn ? 'Preventive PM' : 'الصيانة الوقائية'}
        </button>
      </div>

      {/* Audit Log Timeline */}
      <div className="rounded-2xl bg-[#0F1729] border border-[#1E2A44] divide-y divide-[#1A2440]/80 overflow-hidden shadow-xl">
        {filteredLogs.map((log) => {
          const actionText = isEn ? (log.actionEn || log.action) : log.action;
          const targetText = isEn ? (log.targetEn || log.target) : log.target;
          const detailsText = isEn ? (log.detailsEn || log.details) : log.details;
          const userText = isEn ? (log.userEn || log.user) : log.user;

          return (
            <div key={log.id} className="p-4 sm:p-5 flex flex-wrap items-start justify-between gap-4 hover:bg-[#121C33] transition-colors">
              <div className="flex items-start gap-3.5 min-w-0">
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  log.category === 'work_order' ? 'bg-blue-500/15 text-blue-400' :
                  log.category === 'settings' ? 'bg-amber-500/15 text-amber-400' :
                  log.category === 'pm' ? 'bg-teal-500/15 text-teal-400' : 'bg-rose-500/15 text-rose-400'
                }`}>
                  {log.category === 'work_order' && <Wrench size={16} />}
                  {log.category === 'settings' && <Settings size={16} />}
                  {log.category === 'pm' && <Calendar size={16} />}
                  {log.category === 'asset' && <Box size={16} />}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-white">{actionText}</span>
                    <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded font-medium">
                      {targetText}
                    </span>
                  </div>
                  <p className="text-xs text-[#A3B1C6] mt-1 leading-relaxed">{detailsText}</p>
                  <div className="flex items-center gap-2 text-[11px] text-[#8696AE] mt-2">
                    <User size={12} className="text-blue-400" />
                    <span>{isEn ? 'Operator: ' : 'المستخدم: '}<strong className="text-white">{userText}</strong></span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-[#8696AE] mono shrink-0 bg-[#0B1222] px-2.5 py-1 rounded-lg border border-[#1A2440]">
                {log.timestamp}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
