import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  AlertTriangle, CheckCircle2, Clock, Eye, 
  ArrowRight, ArrowLeft, Search, X, Box, ExternalLink
} from 'lucide-react';
import { Issue, IssueStatus } from '../types';
import { soundManager } from '../lib/soundEffects';

export const MyReportsPage: React.FC = () => {
  const { 
    issues, 
    currentUser, 
    language, 
    setCurrentPage, 
    setSelectedIssueId 
  } = useApp();

  const isEn = language === 'en';

  const [statusFilter, setStatusFilter] = useState<'all' | IssueStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectIssue, setInspectIssue] = useState<Issue | null>(null);

  // Filter issues for current reporter (or all issues for demo inspection)
  const myIssues = useMemo(() => {
    return issues.filter((iss) => {
      // If reporter role, show reporter's issues (or all if empty)
      if (currentUser.role === 'reporter') {
        const matchesReporter = iss.reportedBy === currentUser.name || iss.reportedBy === 'هبة يعيش';
        if (!matchesReporter) return false;
      }
      if (statusFilter !== 'all' && iss.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (iss.number.toString() + iss.assetName + (iss.assetNameEn || '') + iss.description).toLowerCase().includes(q);
      }
      return true;
    });
  }, [issues, currentUser, statusFilter, searchQuery]);

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 ${isEn ? 'text-left' : 'text-right'}`}>
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2A44]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8696AE] mb-1">
            <span 
              onClick={() => setCurrentPage('issues-new')} 
              className="hover:text-blue-400 cursor-pointer transition-colors"
            >
              {isEn ? 'Reporting Portal' : 'بوابة البلاغات'}
            </span>
            <span>/</span>
            <span className="text-white font-medium">{isEn ? 'My Submissions' : 'بلاغاتي'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span>{isEn ? 'My Submitted Fault Reports' : 'سجل بلاغاتي ومتابعة حالتها'}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/15 border border-teal-500/30 text-teal-300">
              {myIssues.length} {isEn ? 'Reports' : 'بلاغات'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A3B1C6] mt-1">
            {isEn 
              ? 'Track the real-time status of breakdowns you reported, from receipt to engineering review and repair verification.' 
              : 'تابعي حالة الأعطال التي سجلتِها خطوة بخطوة، من لحظة الاستلام وحتى إسناد الفنيين والتحقق النهائي.'}
          </p>
        </div>

        <button
          onClick={() => {
            soundManager.playButtonClick();
            setCurrentPage('issues-new');
          }}
          className="h-10 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:brightness-110 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-600/25 flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-center"
        >
          <AlertTriangle size={15} />
          <span>{isEn ? '+ Report New Fault' : '+ تسجيل بلاغ عطل جديد'}</span>
        </button>
      </div>

      {/* 2. TABS & SEARCH */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full sm:w-auto no-scrollbar">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#0F1729] border border-[#22304D] text-[#8696AE] hover:text-white'
            }`}
          >
            {isEn ? 'All Reports' : 'الكل'}
          </button>
          <button
            onClick={() => setStatusFilter('reported')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              statusFilter === 'reported'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#0F1729] border border-[#22304D] text-[#8696AE] hover:text-white'
            }`}
          >
            {isEn ? 'Reported' : 'تم الإبلاغ'}
          </button>
          <button
            onClick={() => setStatusFilter('under_review')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              statusFilter === 'under_review'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#0F1729] border border-[#22304D] text-[#8696AE] hover:text-white'
            }`}
          >
            {isEn ? 'Under Review' : 'قيد المراجعة'}
          </button>
          <button
            onClick={() => setStatusFilter('work_order_created')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              statusFilter === 'work_order_created'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[#0F1729] border border-[#22304D] text-[#8696AE] hover:text-white'
            }`}
          >
            {isEn ? 'Work Order' : 'تحوّل لأمر عمل'}
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={15} className={`absolute ${isEn ? 'left-3' : 'right-3'} top-2.5 text-[#8696AE]`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEn ? 'Search my reports...' : 'بحث في بلاغاتي...'}
            className={`w-full h-9 ${isEn ? 'pl-9 pr-3' : 'pr-9 pl-3'} rounded-xl bg-[#0F1729] border border-[#22304D] text-xs text-white placeholder-[#8696AE] focus:outline-none focus:border-blue-500`}
          />
        </div>
      </div>

      {/* 3. REPORTS LIST WITH TIMELINE STEPPERS */}
      <div className="space-y-4">
        {myIssues.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#0F1729] border border-[#22304D] flex flex-col items-center gap-3">
            <span className="w-14 h-14 rounded-2xl bg-[#16213A] border border-[#22304D] text-[#8696AE] flex items-center justify-center">
              <CheckCircle2 size={24} />
            </span>
            <div className="text-sm font-bold text-white">{isEn ? 'No reports in this view' : 'لا توجد بلاغات مسجلة في هذا القسم'}</div>
            <p className="text-xs text-[#8696AE]">
              {isEn ? 'Click "+ Report New Fault" to submit an issue.' : 'يمكنك الضغط على زر "تسجيل بلاغ عطل جديد" للإبلاغ عن أي ملاحظة.'}
            </p>
          </div>
        ) : (
          myIssues.map((iss) => (
            <div
              key={iss.id}
              onClick={() => {
                soundManager.playCardSwitch();
                setInspectIssue(iss);
              }}
              className="p-5 sm:p-6 rounded-2xl bg-[#0F1729] border border-[#22304D] hover:border-blue-500/40 hover:bg-[#121C32] transition-all cursor-pointer space-y-4 shadow-md group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center font-extrabold text-sm mono">
                    #{iss.number}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-white text-sm sm:text-base group-hover:text-blue-400 transition-colors">
                      {isEn ? (iss.assetNameEn || iss.assetName) : iss.assetName}
                    </h3>
                    <div className="text-xs text-[#8696AE] flex items-center gap-2 mt-0.5">
                      <span className="mono text-blue-300 font-semibold">{iss.assetCode}</span>
                      <span>·</span>
                      <span>{iss.reportedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {iss.status === 'reported' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 border border-blue-500/30 text-blue-300">
                      {isEn ? 'Reported' : 'تم الإبلاغ'}
                    </span>
                  )}
                  {iss.status === 'under_review' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                      {isEn ? 'Under Review' : 'قيد المراجعة والتحليل'}
                    </span>
                  )}
                  {iss.status === 'work_order_created' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                      {isEn ? 'Work Order Created' : 'تم إنشاء أمر عمل'}
                    </span>
                  )}
                </div>
              </div>

              {/* Symptom snippet */}
              <p className="text-xs sm:text-sm text-[#C3CEDF] leading-relaxed line-clamp-2">
                "{isEn ? (iss.descriptionEn || iss.description) : iss.description}"
              </p>

              {/* Timeline Stepper (4 Stages) */}
              <div className="pt-2 border-t border-[#1E2A44] grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                    ✓
                  </div>
                  <span className="text-white font-semibold">{isEn ? 'Received' : 'تم الإبلاغ'}</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    iss.status !== 'reported' 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-[#16213A] text-[#8696AE] border border-[#26324A]'
                  }`}>
                    {iss.status !== 'reported' ? '✓' : '2'}
                  </div>
                  <span className={iss.status !== 'reported' ? 'text-white font-semibold' : 'text-[#8696AE]'}>
                    {isEn ? 'Triage' : 'قيد المراجعة'}
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    iss.status === 'work_order_created' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-[#16213A] text-[#8696AE] border border-[#26324A]'
                  }`}>
                    {iss.status === 'work_order_created' ? '✓' : '3'}
                  </div>
                  <span className={iss.status === 'work_order_created' ? 'text-white font-semibold' : 'text-[#8696AE]'}>
                    {isEn ? 'Work Order' : 'أمر عمل'}
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    iss.status === 'resolved' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-[#16213A] text-[#8696AE] border border-[#26324A]'
                  }`}>
                    4
                  </div>
                  <span className={iss.status === 'resolved' ? 'text-white font-semibold' : 'text-[#8696AE]'}>
                    {isEn ? 'Resolved' : 'تم الإصلاح'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. SAFE INSPECTION MODAL FOR REPORTER */}
      {inspectIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#0F1729] border border-[#22304D] rounded-3xl p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-[#1E2A44] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black mono text-sm">
                  #{inspectIssue.number}
                </span>
                <div>
                  <h3 className="font-extrabold text-white text-sm">
                    {isEn ? (inspectIssue.assetNameEn || inspectIssue.assetName) : inspectIssue.assetName}
                  </h3>
                  <div className="text-[11px] text-[#8696AE]">{inspectIssue.reportedAt}</div>
                </div>
              </div>
              <button
                onClick={() => setInspectIssue(null)}
                className="w-8 h-8 rounded-lg bg-[#16213A] text-[#8696AE] hover:text-white flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#0A1020] border border-[#1A2440] space-y-1">
                <span className="text-[#8696AE] font-semibold block">{isEn ? 'Reported Symptom:' : 'الوصف المسجل:'}</span>
                <p className="text-white leading-relaxed">
                  "{isEn ? (inspectIssue.descriptionEn || inspectIssue.description) : inspectIssue.description}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-[#0A1020] border border-[#1A2440]">
                  <span className="text-[#8696AE] block mb-0.5">{isEn ? 'Current Status:' : 'حالة المعالجة:'}</span>
                  <span className="font-bold text-white">
                    {inspectIssue.status === 'reported' && (isEn ? 'Reported (Pending Review)' : 'تم الإبلاغ (بانتظار المراجعة)')}
                    {inspectIssue.status === 'under_review' && (isEn ? 'Under Review by Maintenance' : 'قيد المراجعة الفنية')}
                    {inspectIssue.status === 'work_order_created' && (isEn ? 'Dispatched to Field Tech' : 'أُسند لفني الصيانة')}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#0A1020] border border-[#1A2440]">
                  <span className="text-[#8696AE] block mb-0.5">{isEn ? 'Asset Location:' : 'موقع المعدة:'}</span>
                  <span className="font-bold text-white">{isEn ? (inspectIssue.siteNameEn || inspectIssue.siteName) : inspectIssue.siteName}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectIssue(null)}
                className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
              >
                {isEn ? 'Close' : 'إغلاق'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
