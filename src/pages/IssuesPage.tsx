import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  AlertTriangle, Sparkles, ShieldAlert, ArrowRight, ArrowLeft,
  Search, CheckCircle2, Clock, X, RefreshCw, Wrench, Eye, 
  Layers, ChevronRight, Sliders, ExternalLink, Bot, Check, AlertOctagon, HelpCircle
} from 'lucide-react';
import { Issue, IssueStatus, SeverityLevel } from '../types';
import { soundManager } from '../lib/soundEffects';

export const IssuesPage: React.FC = () => {
  const { 
    issues, 
    selectedIssueId, 
    setSelectedIssueId, 
    analyzeIssueWithAi, 
    setManualSeverity, 
    createWorkOrderFromIssue, 
    language, 
    setCurrentPage, 
    showToast,
    openAssetDetail
  } = useApp();

  const isEn = language === 'en';

  // Filters & State
  const [statusFilter, setStatusFilter] = useState<'all' | IssueStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [aiFilter, setAiFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiScanStep, setAiScanStep] = useState(0);
  const [manualSeverityChoice, setManualSeverityChoice] = useState<SeverityLevel | 'reset'>('reset');

  // Currently selected issue
  const activeIssue = useMemo(() => {
    return issues.find((i) => i.id === selectedIssueId) || issues[0];
  }, [issues, selectedIssueId]);

  // Filtered Issues list
  const filteredIssues = useMemo(() => {
    return issues.filter((iss) => {
      // Status filter
      if (statusFilter !== 'all' && iss.status !== statusFilter) return false;
      // Priority filter
      if (priorityFilter !== 'all' && iss.priority.level !== priorityFilter) return false;
      // AI status filter
      if (aiFilter !== 'all' && iss.aiStatus !== aiFilter) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = iss.number.toString().includes(q);
        const matchAsset = (iss.assetName + (iss.assetNameEn || '') + iss.assetCode).toLowerCase().includes(q);
        const matchReporter = (iss.reportedBy + (iss.reportedByEn || '')).toLowerCase().includes(q);
        const matchDesc = (iss.description + (iss.descriptionEn || '')).toLowerCase().includes(q);
        if (!matchNum && !matchAsset && !matchReporter && !matchDesc) return false;
      }
      return true;
    });
  }, [issues, statusFilter, priorityFilter, aiFilter, searchQuery]);

  // Counts for tabs
  const countAll = issues.length;
  const countReported = issues.filter((i) => i.status === 'reported').length;
  const countReview = issues.filter((i) => i.status === 'under_review').length;
  const countWorkOrders = issues.filter((i) => i.status === 'work_order_created').length;
  const countHighPriority = issues.filter((i) => i.priority.level === 'high' || i.priority.level === 'critical').length;
  const countIncomplete = issues.filter((i) => i.priority.level === 'incomplete').length;
  const countPendingAi = issues.filter((i) => i.aiStatus === 'not_analyzed').length;

  const handleOpenDetail = (iss: Issue) => {
    soundManager.playCardSwitch();
    setSelectedIssueId(iss.id);
    setIsDetailDrawerOpen(true);
    setManualSeverityChoice(iss.priority.manualSeverity || 'reset');
  };

  const handleRunAiAnalysis = async (issueId: string) => {
    setIsAiScanning(true);
    setAiScanStep(1);
    const t1 = setTimeout(() => setAiScanStep(2), 600);
    const t2 = setTimeout(() => setAiScanStep(3), 1200);

    await analyzeIssueWithAi(issueId);

    clearTimeout(t1);
    clearTimeout(t2);
    setIsAiScanning(false);
    setAiScanStep(0);
  };

  const handleSaveManualSeverity = () => {
    if (!activeIssue) return;
    if (manualSeverityChoice === 'reset') {
      setManualSeverity(activeIssue.id, null);
    } else {
      setManualSeverity(activeIssue.id, manualSeverityChoice);
    }
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto ${isEn ? 'text-left' : 'text-right'}`}>
      
      {/* 1. PAGE HEADER & QUICK BREADCRUMB */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E2A44]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8696AE] mb-1">
            <span 
              onClick={() => setCurrentPage('dashboard')} 
              className="hover:text-blue-400 cursor-pointer transition-colors"
            >
              {isEn ? 'Dashboard' : 'لوحة القيادة'}
            </span>
            <span>/</span>
            <span className="text-white font-medium">{isEn ? 'Fault Reports' : 'بلاغات الأعطال'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span>{isEn ? 'Fault Reports & AI Triage' : 'بلاغات الأعطال وتشخيص الذكاء الاصطناعي'}</span>
            
          </h1>
          <p className="text-xs sm:text-sm text-[#A3B1C6] mt-1">
            {isEn 
              ? 'Triage facility breakdown reports, trigger automated AI root cause diagnosis, review critical service impact, and calibrate priority.' 
              : 'مراجعة بلاغات الأعطال الميدانية، تشغيل التحليل بالذكاء الاصطناعي، حساب أثر الخدمات الحيوية، وتحديد أولوية المعالجة.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              soundManager.playButtonClick();
              setCurrentPage('issues-new');
            }}
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2 cursor-pointer"
          >
            <AlertTriangle size={15} />
            <span>{isEn ? '+ Report New Fault' : '+ تسجيل بلاغ عطل'}</span>
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#0F1729] border border-[#22304D] shadow-sm flex items-center gap-3.5">
          <span className="w-11 h-11 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </span>
          <div>
            <div className="text-xs text-[#8696AE] font-medium">{isEn ? 'New Reports' : 'بلاغات جديدة'}</div>
            <div className="text-2xl font-black text-white mono mt-0.5">{countReported}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1729] border border-[#22304D] shadow-sm flex items-center gap-3.5">
          <span className="w-11 h-11 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
            <ShieldAlert size={20} />
          </span>
          <div>
            <div className="text-xs text-[#8696AE] font-medium">{isEn ? 'High Priority' : 'أولوية عالية'}</div>
            <div className="text-2xl font-black text-rose-400 mono mt-0.5">{countHighPriority}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1729] border border-[#22304D] shadow-sm flex items-center gap-3.5">
          <span className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
            <HelpCircle size={20} />
          </span>
          <div>
            <div className="text-xs text-[#8696AE] font-medium">{isEn ? 'Incomplete Priority' : 'أولوية غير محسوبة'}</div>
            <div className="text-2xl font-black text-amber-400 mono mt-0.5">{countIncomplete}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1729] border border-[#22304D] shadow-sm flex items-center gap-3.5">
          <span className="w-11 h-11 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
            <Bot size={20} />
          </span>
          <div>
            <div className="text-xs text-[#8696AE] font-medium">{isEn ? 'Pending AI Triage' : 'بانتظار التحليل الذكي'}</div>
            <div className="text-2xl font-black text-purple-400 mono mt-0.5">{countPendingAi}</div>
          </div>
        </div>
      </div>

      {/* 3. TABS, SEARCH & FILTER CONTROLS */}
      <div className="flex flex-col gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => {
              soundManager.playButtonClick();
              setStatusFilter('all');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-[#0F1729] border border-[#22304D] text-[#8696AE] hover:text-white'
            }`}
          >
            <span>{isEn ? 'All Reports' : 'الكل'}</span>
            <span className="mono text-[11px] px-1.5 py-0.5 rounded-full bg-white/15">{countAll}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playButtonClick();
              setStatusFilter('reported');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              statusFilter === 'reported'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-[#0F1729] border border-[#22304D] text-[#8696AE] hover:text-white'
            }`}
          >
            <span>{isEn ? 'Reported' : 'تم الإبلاغ'}</span>
            <span className="mono text-[11px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300">{countReported}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playButtonClick();
              setStatusFilter('under_review');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              statusFilter === 'under_review'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-[#0F1729] border border-[#22304D] text-[#8696AE] hover:text-white'
            }`}
          >
            <span>{isEn ? 'Under Review' : 'قيد المراجعة'}</span>
            <span className="mono text-[11px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300">{countReview}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playButtonClick();
              setStatusFilter('work_order_created');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              statusFilter === 'work_order_created'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-[#0F1729] border border-[#22304D] text-[#8696AE] hover:text-white'
            }`}
          >
            <span>{isEn ? 'Converted to Work Order' : 'تحوّل لأمر عمل'}</span>
            <span className="mono text-[11px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">{countWorkOrders}</span>
          </button>
        </div>

        {/* Search & Select Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={16} className={`absolute ${isEn ? 'left-3.5' : 'right-3.5'} top-3 text-[#8696AE]`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? 'Search by issue #, asset name, reporter, or symptom...' : 'البحث برقم البلاغ، اسم الأصل، المُبلِّغ، أو وصف العطل...'}
              className={`w-full h-10 ${isEn ? 'pl-10 pr-4' : 'pr-10 pl-4'} rounded-xl bg-[#0F1729] border border-[#22304D] text-xs sm:text-sm text-white placeholder-[#8696AE] focus:outline-none focus:border-blue-500 transition-colors`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className={`absolute ${isEn ? 'right-3' : 'left-3'} top-2.5 text-[#8696AE] hover:text-white`}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Priority filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#0F1729] border border-[#22304D] text-xs font-semibold text-[#C3CEDF] focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">{isEn ? 'All Priorities' : 'جميع الأولويات'}</option>
              <option value="high">{isEn ? '▲ High Priority' : '▲ أولوية عالية'}</option>
              <option value="medium">{isEn ? '◆ Medium Priority' : '◆ أولوية متوسطة'}</option>
              <option value="low">{isEn ? '▼ Low Priority' : '▼ أولوية منخفضة'}</option>
              <option value="incomplete">{isEn ? '? Incomplete' : '? غير محسوبة'}</option>
            </select>

            {/* AI Diagnosis filter */}
            <select
              value={aiFilter}
              onChange={(e) => setAiFilter(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[#0F1729] border border-[#22304D] text-xs font-semibold text-[#C3CEDF] focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">{isEn ? 'All AI States' : 'جميع حالات AI'}</option>
              <option value="success">{isEn ? 'Analyzed' : 'تم التحليل'}</option>
              <option value="not_analyzed">{isEn ? 'Not Analyzed' : 'لم يُحلَّل'}</option>
              <option value="failed">{isEn ? 'Failed' : 'فشل التحليل'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. MAIN DATA TABLE (DESKTOP) / CARDS (MOBILE) */}
      <div className="bg-[#0F1729] border border-[#22304D] rounded-2xl overflow-hidden shadow-lg">
        {filteredIssues.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <span className="w-14 h-14 rounded-2xl bg-[#16213A] border border-[#22304D] text-[#8696AE] flex items-center justify-center">
              <AlertTriangle size={24} />
            </span>
            <div className="text-sm font-bold text-white">{isEn ? 'No matching reports found' : 'لا توجد بلاغات مطابقة'}</div>
            <p className="text-xs text-[#8696AE]">
              {isEn ? 'Try adjusting your filters or search keywords.' : 'جرّب تغيير كلمات البحث أو إعادة ضبط خيارات التصفية.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View (Hidden on Mobile) */}
            <div className="hidden md:block overflow-x-auto">
  
            <table className="w-full text-xs text-right">
              <thead className="bg-[#0B1222] border-b border-[#1E2A44] text-[#8696AE] font-semibold">
                <tr>
                  <th className={`p-4 ${isEn ? 'text-left' : 'text-right'}`}>{isEn ? 'Issue #' : 'البلاغ'}</th>
                  <th className={`p-4 ${isEn ? 'text-left' : 'text-right'}`}>{isEn ? 'Target Asset' : 'الأصل'}</th>
                  <th className={`p-4 ${isEn ? 'text-left' : 'text-right'}`}>{isEn ? 'Reporter' : 'المُبلِّغ'}</th>
                  <th className={`p-4 text-center`}>{isEn ? 'Status' : 'الحالة'}</th>
                  <th className={`p-4 text-center`}>{isEn ? 'AI Diagnosis' : 'تحليل AI'}</th>
                  <th className={`p-4 text-center`}>{isEn ? 'Priority' : 'الأولوية'}</th>
                  <th className={`p-4 text-center`}>{isEn ? 'Action' : 'الإجراء'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2440]">
                {filteredIssues.map((iss) => {
                  const isCriticalService = iss.impact.affectedServices.some(s => s.criticality === 'critical');
                  return (
                    <tr 
                      key={iss.id}
                      onClick={() => handleOpenDetail(iss)}
                      className="hover:bg-[#142038] transition-colors cursor-pointer group"
                    >
                      {/* Issue ID and Date */}
                      <td className="p-4 align-top">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white text-sm mono">#{iss.number}</span>
                          {iss.status === 'reported' && (
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                          )}
                        </div>
                        <div className="text-[11px] text-[#8696AE] mt-1 mono">{iss.reportedAt}</div>
                        <p className="text-xs text-[#C3CEDF] mt-1.5 line-clamp-2 max-w-xs leading-relaxed">
                          {isEn ? (iss.descriptionEn || iss.description) : iss.description}
                        </p>
                      </td>

                      {/* Asset */}
                      <td className="p-4 align-top">
                        <div className="font-bold text-white text-xs sm:text-sm group-hover:text-blue-400 transition-colors">
                          {isEn ? (iss.assetNameEn || iss.assetName) : iss.assetName}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="mono text-[11px] text-blue-300 font-semibold">{iss.assetCode}</span>
                          <span className="text-[11px] text-[#8696AE]">· {isEn ? (iss.siteNameEn || iss.siteName) : iss.siteName}</span>
                        </div>
                        {isCriticalService && (
                          <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] font-bold">
                            <ShieldAlert size={11} />
                            <span>{isEn ? 'Impacts Critical Service' : 'يغذي خدمة حرجة'}</span>
                          </div>
                        )}
                      </td>

                      {/* Reporter */}
                      <td className="p-4 align-top">
                        <div className="font-semibold text-white">{isEn ? (iss.reportedByEn || iss.reportedBy) : iss.reportedBy}</div>
                        <div className="text-[11px] text-[#8696AE] mt-0.5">{isEn ? (iss.reportedByRoleEn || iss.reportedByRole) : iss.reportedByRole}</div>
                      </td>

                      {/* Status */}
                      <td className="p-4 align-top text-center">
                        {iss.status === 'reported' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-bold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            <span>{isEn ? 'Reported' : 'تم الإبلاغ'}</span>
                          </span>
                        )}
                        {iss.status === 'under_review' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>{isEn ? 'Under Review' : 'قيد المراجعة'}</span>
                          </span>
                        )}
                        {iss.status === 'work_order_created' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[11px]">
                            <CheckCircle2 size={12} className="text-emerald-400" />
                            <span>{isEn ? 'Work Order' : 'تحوّل لأمر عمل'}</span>
                          </span>
                        )}
                      </td>

                      {/* AI Diagnosis */}
                      <td className="p-4 align-top text-center">
                        {iss.aiStatus === 'success' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[11px]">
                            <Sparkles size={12} className="text-emerald-400" />
                            <span>{isEn ? 'Analyzed' : 'تم التحليل'}</span>
                          </span>
                        )}
                        {iss.aiStatus === 'not_analyzed' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16213A] border border-[#26324A] text-[#8696AE] font-bold text-[11px]">
                            <Clock size={12} />
                            <span>{isEn ? 'Not Analyzed' : 'لم يُحلَّل'}</span>
                          </span>
                        )}
                        {iss.aiStatus === 'failed' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold text-[11px]">
                            <AlertOctagon size={12} />
                            <span>{isEn ? 'Failed' : 'فشل التحليل'}</span>
                          </span>
                        )}
                        {iss.aiStatus === 'analyzing' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 font-bold text-[11px] animate-pulse">
                            <RefreshCw size={12} className="animate-spin text-blue-400" />
                            <span>{isEn ? 'Triage...' : 'جارٍ التحليل...'}</span>
                          </span>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="p-4 align-top text-center">
                        {iss.priority.level === 'high' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 font-bold text-[11px]">
                            <span>▲</span>
                            <span>{isEn ? 'High Priority' : 'أولوية عالية'}</span>
                          </span>
                        )}
                        {iss.priority.level === 'medium' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/40 text-blue-300 font-bold text-[11px]">
                            <span>◆</span>
                            <span>{isEn ? 'Medium Priority' : 'أولوية متوسطة'}</span>
                          </span>
                        )}
                        {iss.priority.level === 'low' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-500/15 border border-slate-500/40 text-slate-300 font-bold text-[11px]">
                            <span>▼</span>
                            <span>{isEn ? 'Low Priority' : 'أولوية منخفضة'}</span>
                          </span>
                        )}
                        {iss.priority.level === 'incomplete' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#16213A] border border-[#26324A] text-[#8696AE] font-bold text-[11px]">
                            <span>?</span>
                            <span>{isEn ? 'Incomplete' : 'غير محسوبة'}</span>
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="p-4 align-top text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(iss);
                          }}
                          className="h-8 px-3 rounded-lg bg-[#16213A] hover:bg-[#1E2A44] border border-[#26324A] text-blue-400 hover:text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye size={13} />
                          <span>{isEn ? 'Details' : 'عرض التفاصيل'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          
            </div>

            {/* Mobile Cards View (Per Sprint 2 Spec & Figma Mobile 390px) */}
            <div className="md:hidden divide-y divide-[#1A2440]">
              {filteredIssues.map((iss) => {
                const isCriticalService = iss.impact.affectedServices.some(s => s.criticality === 'critical');
                return (
                  <div
                    key={iss.id}
                    onClick={() => handleOpenDetail(iss)}
                    className="p-4 hover:bg-[#142038] active:bg-[#16233B] transition-colors cursor-pointer space-y-3"
                  >
                    {/* Top Row: ID, Status, Priority */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-base mono">#{iss.number}</span>
                        {iss.status === 'reported' && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold">
                            {isEn ? 'Reported' : 'تم الإبلاغ'}
                          </span>
                        )}
                        {iss.status === 'under_review' && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                            {isEn ? 'Under Review' : 'قيد المراجعة'}
                          </span>
                        )}
                        {iss.status === 'work_order_created' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                            {isEn ? 'Work Order' : 'تحوّل لأمر عمل'}
                          </span>
                        )}
                      </div>

                      {/* Priority Pill */}
                      <div>
                        {iss.priority.level === 'high' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 font-bold text-xs">
                            <span>▲</span>
                            <span>{isEn ? 'High' : 'عالية'}</span>
                          </span>
                        )}
                        {iss.priority.level === 'medium' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/40 text-blue-300 font-bold text-xs">
                            <span>◆</span>
                            <span>{isEn ? 'Medium' : 'متوسطة'}</span>
                          </span>
                        )}
                        {iss.priority.level === 'low' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-500/15 border border-slate-500/40 text-slate-300 font-bold text-xs">
                            <span>▼</span>
                            <span>{isEn ? 'Low' : 'منخفضة'}</span>
                          </span>
                        )}
                        {iss.priority.level === 'incomplete' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#16213A] border border-[#26324A] text-[#8696AE] font-bold text-xs">
                            <span>?</span>
                            <span>{isEn ? 'Incomplete' : 'غير محسوبة'}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Asset Name and Site */}
                    <div>
                      <div className="font-bold text-white text-sm">
                        {isEn ? (iss.assetNameEn || iss.assetName) : iss.assetName}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#8696AE] mt-0.5">
                        <span className="mono text-blue-400 font-semibold">{iss.assetCode}</span>
                        <span>·</span>
                        <span>{isEn ? (iss.siteNameEn || iss.siteName) : iss.siteName}</span>
                      </div>
                    </div>

                    {/* Critical Service Indicator if any */}
                    {isCriticalService && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold">
                        <ShieldAlert size={13} />
                        <span>{isEn ? 'Impacts Critical Service' : 'يغذي خدمة حرجة'}</span>
                      </div>
                    )}

                    {/* Description excerpt */}
                    <p className="text-xs text-[#C3CEDF] line-clamp-2 leading-relaxed">
                      {isEn ? (iss.descriptionEn || iss.description) : iss.description}
                    </p>

                    {/* Card Footer: Reporter + Date + Trigger button */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-[#16213A] text-[#8696AE]">
                      <div>
                        <span className="text-white font-medium">{isEn ? (iss.reportedByEn || iss.reportedBy) : iss.reportedBy}</span>
                        <span className="mx-1">·</span>
                        <span className="mono">{iss.reportedAt}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(iss);
                        }}
                        className="h-8 px-3 rounded-lg bg-[#16213A] hover:bg-blue-600 hover:text-white text-blue-300 font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isEn ? 'Triage' : 'عرض التفاصيل'}</span>
                        <ArrowLeft size={13} className={isEn ? 'rotate-180' : ''} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* 5. INTERACTIVE ISSUE DETAILS DRAWER (MATCHING FIGMA SPRINT 2 & 3 SECTIONS) */}
      {isDetailDrawerOpen && activeIssue && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl h-full bg-[#0D1526] border-l border-[#1E2A44] shadow-2xl flex flex-col animate-slide-left overflow-y-auto">
            
            {/* Drawer Header */}
            <div className="sticky top-0 z-20 bg-[#0F1729]/95 backdrop-blur-md p-5 border-b border-[#1E2A44] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center font-black mono text-base">
                  #{activeIssue.number}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-white">
                      {isEn ? `Issue Report #${activeIssue.number}` : `بلاغ عطل رقم #${activeIssue.number}`}
                    </h2>
                    {activeIssue.status === 'under_review' && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {isEn ? 'Under Review' : 'قيد المراجعة'}
                      </span>
                    )}
                    {activeIssue.status === 'work_order_created' && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {isEn ? 'Work Order Issued' : 'تحوّل لأمر عمل'}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#8696AE] mt-0.5">
                    {activeIssue.reportedAt} · {isEn ? (activeIssue.siteNameEn || activeIssue.siteName) : activeIssue.siteName}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsDetailDrawerOpen(false)}
                className="w-9 h-9 rounded-xl bg-[#16213A] hover:bg-[#1E2A44] text-[#8696AE] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body - 5 Canonical Sprint Sections */}
            <div className="p-5 sm:p-6 space-y-6 flex-1">
              
              {/* SECTION 1: بيانات البلاغ كما أرسلها المُبلِّغ */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0F1729] border border-[#1E2A44] space-y-3">
                <div className="flex items-center justify-between border-b border-[#1A2440] pb-2.5">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[11px]">1</span>
                    <span>{isEn ? 'Report Submission Data' : 'بيانات البلاغ كما أرسلها المُبلِّغ'}</span>
                  </span>
                  <span className="text-xs text-[#8696AE] mono">{activeIssue.reportedAt}</span>
                </div>

                {/* Symptom Description */}
                <div className="p-3.5 rounded-xl bg-[#0A1020] border border-[#1A2440] text-sm text-[#E2E8F0] leading-relaxed">
                  "{isEn ? (activeIssue.descriptionEn || activeIssue.description) : activeIssue.description}"
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                  <div>
                    <span className="text-[#8696AE] block mb-0.5">{isEn ? 'Reporter' : 'المُبلِّغ'}</span>
                    <span className="font-bold text-white">{isEn ? (activeIssue.reportedByEn || activeIssue.reportedBy) : activeIssue.reportedBy}</span>
                    <span className="text-[11px] text-[#8696AE] block">{isEn ? (activeIssue.reportedByRoleEn || activeIssue.reportedByRole) : activeIssue.reportedByRole}</span>
                  </div>
                  <div>
                    <span className="text-[#8696AE] block mb-0.5">{isEn ? 'Target Asset' : 'الأصل المُبلَّغ عنه'}</span>
                    <span 
                      onClick={() => openAssetDetail(activeIssue.assetId)}
                      className="font-bold text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>{isEn ? (activeIssue.assetNameEn || activeIssue.assetName) : activeIssue.assetName}</span>
                      <ExternalLink size={12} />
                    </span>
                    <span className="text-[11px] text-[#8696AE] mono">{activeIssue.assetCode}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: تحليل العطل بمساعدة الذكاء الاصطناعي (AI Analysis Panel) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0F1729] border border-blue-500/30 shadow-[0_4px_25px_rgba(37,99,235,0.1)] space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#1A2440] pb-2.5">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[11px]">2</span>
                    <span>{isEn ? 'AI Diagnostic Triage' : 'تحليل العطل بمساعدة الذكاء الاصطناعي'}</span>
                  </span>
                  <span className="text-[11px] text-[#8696AE]">
                    {isEn ? 'Advisory AI assistant · Not final human order' : 'اقتراح مساعد وليس تشخيصًا نهائيًا'}
                  </span>
                </div>

                {/* STATE A: NOT ANALYZED */}
                {activeIssue.aiStatus === 'not_analyzed' && !isAiScanning && (
                  <div className="p-6 rounded-xl bg-[#0A1020] border border-[#1E2A44] text-center flex flex-col items-center gap-3.5">
                    <span className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                      <Sparkles size={22} />
                    </span>
                    <div>
                      <div className="font-bold text-white text-sm">
                        {isEn ? 'Diagnostic analysis has not been executed yet' : 'لم يتم تشغيل التحليل بالذكاء الاصطناعي لهذا البلاغ بعد'}
                      </div>
                      <p className="text-xs text-[#8696AE] mt-1 max-w-md">
                        {isEn 
                          ? 'Run AI triage to extract proposed failure category, estimate severity, and identify root causes.'
                          : 'شغّل التحليل الآلي لتصنيف العطل، تقدير شدته، واقتراح الأسباب المحتملة والفحوصات الميدانية.'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRunAiAnalysis(activeIssue.id)}
                      className="h-10 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:brightness-110 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles size={15} />
                      <span>{isEn ? 'Analyze with AI' : 'تحليل باستخدام الذكاء الاصطناعي'}</span>
                    </button>
                  </div>
                )}

                {/* STATE B: SCANNING / ANALYZING PROGRESS SKELETON */}
                {(activeIssue.aiStatus === 'analyzing' || isAiScanning) && (
                  <div className="p-6 rounded-xl bg-[#0A1020] border border-blue-500/40 text-center flex flex-col items-center gap-4 relative overflow-hidden">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/50 flex items-center justify-center relative">
                      <RefreshCw size={26} className="text-blue-400 animate-spin" />
                      <span className="absolute inset-0 rounded-2xl bg-blue-500/20 animate-ping" />
                    </div>
                    <div>
                      <div className="font-extrabold text-white text-sm">
                        {aiScanStep === 1 && (isEn ? 'Connecting to Asset Diagnostic Model...' : 'جاري فحص وصف العطل وسجل المعدة...')}
                        {aiScanStep === 2 && (isEn ? 'Matching failure patterns against knowledge base...' : 'مقارنة أنماط الأعطال مع قاعدة المعرفة الهندسية...')}
                        {aiScanStep === 3 && (isEn ? 'Synthesizing probable causes & tests...' : 'تحديد الشدة والأسباب المحتملة والفحوصات...')}
                      </div>
                      <div className="text-xs text-blue-400 mt-1 mono">{isEn ? 'Estimated time: up to 2 seconds' : 'قد يستغرق الفحص بضع ثوانٍ'}</div>
                    </div>
                    <div className="w-full max-w-xs h-1.5 bg-[#16213A] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-teal-400 animate-pulse w-3/4" />
                    </div>
                  </div>
                )}

                {/* STATE C: FAILED ANALYZE */}
                {activeIssue.aiStatus === 'failed' && !isAiScanning && (
                  <div className="p-5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-3">
                    <div className="flex items-center gap-2.5 text-rose-300 font-bold text-xs sm:text-sm">
                      <AlertOctagon size={18} />
                      <span>{isEn ? 'AI Analysis Timed Out (Safe Failure)' : 'تعذّر إكمال التحليل الذكي حالياً (فشل آمن)'}</span>
                    </div>
                    <p className="text-xs text-[#A3B1C6] leading-relaxed">
                      {isEn 
                        ? 'The report is safely preserved in the database. You can retry the automated analysis or set manual severity below.' 
                        : 'بيانات البلاغ محفوظة بأمان في النظام. يمكنك إعادة محاولة التحليل أو تحديد الشدة يدويًا في القسم أدناه.'}
                    </p>
                    <button
                      onClick={() => handleRunAiAnalysis(activeIssue.id)}
                      className="h-9 px-4 rounded-xl bg-[#16213A] hover:bg-[#1E2A44] border border-rose-500/40 text-rose-300 text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw size={13} />
                      <span>{isEn ? 'Retry Analysis' : 'إعادة المحاولة'}</span>
                    </button>
                  </div>
                )}

                {/* STATE D: SUCCESSFUL ANALYSIS */}
                {activeIssue.aiStatus === 'success' && activeIssue.aiAnalysis && !isAiScanning && (
                  <div className="space-y-4">
                    {/* Suggested Category & Severity Pills */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-[#0A1020] border border-[#1A2440]">
                        <span className="text-[11px] text-[#8696AE] block mb-1">{isEn ? 'Suggested Category' : 'التصنيف المقترح'}</span>
                        <span className="font-extrabold text-blue-400 text-sm">
                          {isEn ? activeIssue.aiAnalysis.categoryEn : activeIssue.aiAnalysis.categoryArabic}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#0A1020] border border-[#1A2440]">
                        <span className="text-[11px] text-[#8696AE] block mb-1">{isEn ? 'Suggested Severity' : 'شدة العطل المقترحة'}</span>
                        <span className="font-extrabold text-amber-400 text-sm uppercase">
                          {activeIssue.aiAnalysis.severity}
                        </span>
                      </div>
                    </div>

                    {/* Possible Causes */}
                    <div>
                      <span className="text-xs font-bold text-white block mb-1.5">{isEn ? 'Possible Causes' : 'الأسباب المحتملة'}</span>
                      <ul className="space-y-1.5 text-xs text-[#C3CEDF] pr-2">
                        {(isEn ? activeIssue.aiAnalysis.possibleCausesEn : activeIssue.aiAnalysis.possibleCauses).map((cause, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span className="flex-1 leading-relaxed">{cause}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggested Checks */}
                    <div>
                      <span className="text-xs font-bold text-white block mb-1.5">{isEn ? 'Suggested Diagnostic Checks' : 'الفحوصات المقترحة'}</span>
                      <ol className="space-y-1.5 text-xs text-[#C3CEDF]">
                        {(isEn ? activeIssue.aiAnalysis.suggestedChecksEn : activeIssue.aiAnalysis.suggestedChecks).map((chk, idx) => (
                          <li key={idx} className="p-2 rounded-lg bg-[#0A1020] border border-[#1A2440] flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="flex-1 leading-relaxed">{chk}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Human Verification Notice & Timestamp */}
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2 text-xs text-amber-200">
                      <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-400" />
                      <div className="flex-1">
                        <span>{isEn ? 'Notice: This diagnosis is an assistive recommendation and requires human engineering review.' : 'تنبيه: هذا التحليل اقتراح مساعد ويتطلب مراجعة بشرية من المهندس المختص.'}</span>
                        <div className="text-[11px] text-amber-300/70 mt-0.5 mono">
                          {isEn ? `Analyzed on: ${activeIssue.aiAnalysis.analyzedAt}` : `حُلِّل في: ${activeIssue.aiAnalysis.analyzedAt}`}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRunAiAnalysis(activeIssue.id)}
                        className="text-xs font-bold text-amber-300 hover:text-white underline cursor-pointer shrink-0"
                      >
                        {isEn ? 'Re-analyze' : 'إعادة التحليل'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: الخدمات المتأثرة (Critical Services Impact) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0F1729] border border-[#1E2A44] space-y-4">
                <div className="flex items-center justify-between border-b border-[#1A2440] pb-2.5">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[11px]">3</span>
                    <span>{isEn ? 'Critical Services Impact' : 'الخدمات المتأثرة ومستوى الحرجية'}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    {activeIssue.impact.level === 'high' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 border border-rose-500/40 text-rose-300">
                        ▲ {isEn ? 'High Impact' : 'تأثير مرتفع'}
                      </span>
                    )}
                    {activeIssue.impact.level === 'medium' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                        ◆ {isEn ? 'Medium Impact' : 'تأثير متوسط'}
                      </span>
                    )}
                    {activeIssue.impact.level === 'low' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-500/20 border border-slate-500/40 text-slate-300">
                        ▼ {isEn ? 'Low Impact' : 'تأثير منخفض'}
                      </span>
                    )}
                    {activeIssue.impact.level === 'unknown' && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#16213A] border border-[#26324A] text-[#8696AE]">
                        ? {isEn ? 'Unknown' : 'غير معروف'}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#8696AE]">
                  {isEn 
                    ? 'Critical services mapped to this asset — the highest criticality tier among them determines the overall service impact level.' 
                    : 'الخدمات الحرجة المرتبطة بهذا الأصل — أعلى أهمية بينها تحدد مستوى التأثير العام.'}
                </p>

                {activeIssue.impact.affectedServices.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[#0A1020] border border-[#1A2440] text-center text-xs text-[#8696AE]">
                    {isEn ? 'No critical services directly mapped to this asset.' : 'لا توجد خدمات حرجة مربوطة حالياً بهذا الأصل.'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeIssue.impact.affectedServices.map((svc) => (
                      <div 
                        key={svc.id}
                        className="p-3.5 rounded-xl bg-[#0A1020] border border-[#1A2440] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            svc.criticality === 'critical' 
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            <ShieldAlert size={16} />
                          </span>
                          <div>
                            <div className="font-bold text-white text-xs sm:text-sm">{isEn ? svc.nameEn : svc.name}</div>
                            <div className="text-[11px] text-[#8696AE]">{isEn ? svc.siteNameEn : svc.siteName}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            svc.criticality === 'critical'
                              ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                              : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          }`}>
                            {svc.criticality === 'critical' ? (isEn ? 'Critical Tier 1' : 'أهمية حرجة') : (isEn ? 'Important Tier 2' : 'أهمية مهمة')}
                          </span>
                          {svc.isGoverningImpact && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              {isEn ? 'Governs Impact' : 'يحدد التأثير'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 4: الأولوية وسببها والشدة اليدوية (Priority & Reasoning + Manual Severity) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0F1729] border border-[#1E2A44] space-y-4">
                <div className="flex items-center justify-between border-b border-[#1A2440] pb-2.5">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[11px]">4</span>
                    <span>{isEn ? 'Priority & Explainable Reason' : 'الأولوية وسببها'}</span>
                  </span>
                  <div>
                    {activeIssue.priority.level === 'high' && (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-500/20 border border-rose-500/50 text-rose-300">
                        ▲ {isEn ? 'High Priority' : 'أولوية عالية'}
                      </span>
                    )}
                    {activeIssue.priority.level === 'medium' && (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/20 border border-blue-500/50 text-blue-300">
                        ◆ {isEn ? 'Medium Priority' : 'أولوية متوسطة'}
                      </span>
                    )}
                    {activeIssue.priority.level === 'low' && (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-500/20 border border-slate-500/50 text-slate-300">
                        ▼ {isEn ? 'Low Priority' : 'أولوية منخفضة'}
                      </span>
                    )}
                    {activeIssue.priority.level === 'incomplete' && (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#16213A] border border-[#26324A] text-[#8696AE]">
                        ? {isEn ? 'Priority Incomplete' : 'غير محسوبة'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Score Breakdown Pills */}
                <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-[#0A1020] border border-[#1A2440]">
                    <span className="text-[11px] text-[#8696AE] block">{isEn ? 'Impact Level' : 'مستوى التأثير'}</span>
                    <span className="font-bold text-white mt-0.5 block">{activeIssue.impact.level.toUpperCase()}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0A1020] border border-[#1A2440]">
                    <span className="text-[11px] text-[#8696AE] block">{isEn ? 'Severity Used' : 'الشدة المستخدمة'}</span>
                    <span className="font-bold text-amber-300 mt-0.5 block">{activeIssue.priority.severityUsed.toUpperCase()}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0A1020] border border-[#1A2440]">
                    <span className="text-[11px] text-[#8696AE] block">{isEn ? 'Severity Source' : 'مصدر الشدة'}</span>
                    <span className="font-bold text-blue-400 mt-0.5 block">
                      {activeIssue.priority.severitySource === 'manual' ? (isEn ? 'Manual' : 'يدوي') : (isEn ? 'AI Model' : 'تحليل AI')}
                    </span>
                  </div>
                </div>

                {/* Reasoning Statement */}
                <div className="p-3.5 rounded-xl bg-[#0A1020] border border-[#1A2440] text-xs">
                  <span className="font-bold text-white block mb-1">{isEn ? 'Why this priority score?' : 'لماذا هذه الأولوية؟'}</span>
                  <p className="text-[#C3CEDF] leading-relaxed">
                    {isEn ? activeIssue.priority.reasonEn : activeIssue.priority.reasonArabic}
                  </p>
                </div>

                {/* Manual Severity Override Sub-panel (Manager only) */}
                <div className="p-3.5 rounded-xl bg-[#141E34] border border-blue-500/25 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sliders size={14} className="text-blue-400" />
                      <span>{isEn ? 'Manual Severity Override' : 'تحديد شدة العطل يدويًا'}</span>
                    </span>
                    <span className="text-[10px] text-blue-300 font-semibold">{isEn ? 'Manager Control' : 'لمدير الصيانة فقط'}</span>
                  </div>
                  <p className="text-[11px] text-[#8696AE]">
                    {isEn 
                      ? 'Manually adjusting severity will not overwrite AI diagnostic logs. It calibrates the final computed priority score.' 
                      : 'تحديد الشدة يدويًا يتيح لمدير المنشأة موازنة القرار دون محو سجل الذكاء الاصطناعي.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setManualSeverityChoice('low')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        manualSeverityChoice === 'low'
                          ? 'bg-slate-500 text-white shadow-sm'
                          : 'bg-[#0A1020] border border-[#22304D] text-[#8696AE] hover:text-white'
                      }`}
                    >
                      {isEn ? 'Low' : 'منخفضة'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setManualSeverityChoice('medium')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        manualSeverityChoice === 'medium'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-[#0A1020] border border-[#22304D] text-[#8696AE] hover:text-white'
                      }`}
                    >
                      {isEn ? 'Medium' : 'متوسطة'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setManualSeverityChoice('high')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        manualSeverityChoice === 'high'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-[#0A1020] border border-[#22304D] text-[#8696AE] hover:text-white'
                      }`}
                    >
                      {isEn ? 'High' : 'عالية'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setManualSeverityChoice('critical')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        manualSeverityChoice === 'critical'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-[#0A1020] border border-[#22304D] text-[#8696AE] hover:text-white'
                      }`}
                    >
                      {isEn ? 'Critical' : 'حرجة'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setManualSeverityChoice('reset')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        manualSeverityChoice === 'reset'
                          ? 'bg-[#1E2A44] text-teal-300 border border-teal-500/40'
                          : 'bg-[#0A1020] border border-[#22304D] text-[#8696AE] hover:text-white'
                      }`}
                    >
                      {isEn ? 'Reset to AI' : 'استعادة نتيجة AI'}
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveManualSeverity}
                      className="ml-auto h-8 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-md"
                    >
                      {isEn ? 'Save Severity' : 'حفظ شدة العطل'}
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 5: القرار (Decision - Convert Issue to Work Order) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#101A2E] to-[#0A1020] border border-blue-500/40 space-y-3.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[11px]">5</span>
                    <span>{isEn ? 'Decision & Work Order Dispatch' : 'القرار وتحويل البلاغ'}</span>
                  </span>
                  <Wrench size={16} className="text-blue-400" />
                </div>

                <p className="text-xs text-[#C3CEDF] leading-relaxed">
                  {isEn 
                    ? 'Convert this fault report into an official work order and assign it to a field technician with AI diagnostic checks pre-loaded.' 
                    : 'حوّل البلاغ إلى أمر عمل رسمي وأسنده لفني صيانة — بالأولوية المحسوبة أعلاه، وستتحول الفحوصات المقترحة لمهام عمل للفني.'}
                </p>

                {activeIssue.status === 'work_order_created' ? (
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-200">
                        {isEn ? `Converted to Work Order: ${activeIssue.workOrderId || 'WO-849'}` : `تم إنشاء أمر العمل بنجاح (#${activeIssue.workOrderId || 'WO-849'})`}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setIsDetailDrawerOpen(false);
                        setCurrentPage('work-orders');
                      }}
                      className="text-xs font-bold text-emerald-300 hover:text-white underline cursor-pointer"
                    >
                      {isEn ? 'View in Work Orders →' : 'عرض في أوامر العمل ←'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      createWorkOrderFromIssue(activeIssue.id);
                    }}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 hover:brightness-110 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Wrench size={16} />
                    <span>{isEn ? 'Create Work Order Now' : 'إنشاء أمر عمل وإسناد للميدان'}</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
