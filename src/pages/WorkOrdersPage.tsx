import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, Search, LayoutGrid, Table as TableIcon, Filter, 
  Wrench, ShieldAlert, Clock, User, ChevronRight, ChevronLeft, 
  ArrowLeft, ArrowRight, X, CheckCircle2, AlertTriangle, HelpCircle, 
  Sliders, ArrowUpRight 
} from 'lucide-react';
import { WorkOrder, WorkOrderStatus, PriorityLevel } from '../types';
import { initialWorkOrders, initialAssets, initialSites, initialTeamMembers } from '../data/mockData';

interface WorkOrdersPageProps {
  onOpenNewOrder: () => void;
}

export const WorkOrdersPage: React.FC<WorkOrdersPageProps> = ({
  onOpenNewOrder
}) => {
  const { 
    workOrders, 
    updateWorkOrderStatus, 
    addWorkOrder, 
    assets, 
    teamMembers, 
    priorityWeights,
    setCurrentPage,
    openAssetDetail,
    language
  } = useApp();

  const isEn = language === 'en';

  const getAssetTitle = (wo: WorkOrder) => {
    if (isEn) {
      if (wo.assetNameEn) return wo.assetNameEn;
      const initial = initialAssets.find((a) => a.id === wo.assetId || a.code === wo.assetCode);
      if (initial?.nameEn) return initial.nameEn;
      if (wo.assetId === 'ast-1' || wo.assetCode === 'AST-PUMP-101' || wo.assetName.includes('#1')) return 'Centrifugal Water Pump #1';
      if (wo.assetId === 'ast-2' || wo.assetCode === 'AST-PUMP-102' || wo.assetName.includes('#2')) return 'Centrifugal Water Pump #2';
      if (wo.assetId === 'ast-3' || wo.assetCode === 'AST-GEN-204' || wo.assetName.includes('المولد') || wo.assetName.includes('1500')) return 'Turbine Generator 1500kVA';
      if (wo.assetId === 'ast-4' || wo.assetCode === 'AST-OXY-301' || wo.assetName.includes('الأكسجين')) return 'Central Medical Oxygen Manifold';
      if (wo.assetId === 'ast-5' || wo.assetCode === 'AST-CHILL-401' || wo.assetName.includes('Chiller') || wo.assetName.includes('التبريد')) return 'Industrial Chiller Unit A';
      if (wo.assetId === 'ast-6' || wo.assetCode === 'AST-FIRE-501' || wo.assetName.includes('الحريق')) return 'Hydraulic Fire Water Pump';
    }
    return wo.assetName;
  };

  const getOrderTitle = (wo: WorkOrder) => {
    if (isEn) {
      if (wo.titleEn) return wo.titleEn;
      const initial = initialWorkOrders.find((w) => w.id === wo.id || w.code === wo.code);
      if (initial?.titleEn) return initial.titleEn;
      if (wo.title.includes('تسريب') || wo.title.includes('حشوة') || wo.code === 'WO-849') {
        return 'Continuous leakage in mechanical seal and high bearing temperature';
      }
      if (wo.title.includes('كابلات') || wo.title.includes('إقلاع') || wo.code === 'WO-848' || wo.code === 'WO-843') {
        return 'High voltage cabling check and automatic ATS transfer test';
      }
      if (wo.title.includes('فلاتر') || wo.title.includes('Chiller') || wo.code === 'WO-847' || wo.code === 'WO-561') {
        return 'Air filter replacement and refrigerant pressure inspection for Chiller A';
      }
      if (wo.title.includes('معايرة') || wo.title.includes('صمامات') || wo.code === 'WO-646') {
        return 'Calibration and relief valve check for Medical Oxygen Manifold';
      }
      if (wo.title.includes('اهتزاز') || wo.title.includes('تسرب') || wo.code === 'WO-103' || wo.code === 'WO-957') {
        return 'High vibration and mechanical seal leakage';
      }
      if (wo.title.includes('عطل')) {
        return `Emergency Fault: ${getAssetTitle(wo)}`;
      }
      return 'Maintenance Work Order';
    }
    return wo.title;
  };

  const getSiteTitle = (wo: WorkOrder) => {
    if (isEn) {
      if (wo.siteNameEn) return wo.siteNameEn;
      const initialSite = initialSites.find((s) => s.name === wo.siteName);
      if (initialSite?.nameEn) return initialSite.nameEn;
      if (wo.siteName.includes('التحلية') || wo.siteName.includes('الضخ')) return 'Main Desalination & Pumping Station';
      if (wo.siteName.includes('الأمل') || wo.siteName.includes('مستشفى')) return 'Al-Amal Specialized Hospital';
      if (wo.siteName.includes('المصانع') || wo.siteName.includes('الصناعية')) return 'Northern Industrial Complex - Nablus';
    }
    return wo.siteName;
  };

  const getAssigneeName = (wo: WorkOrder) => {
    if (!wo.assignedTo) return isEn ? 'Unassigned' : 'غير مسند';
    if (isEn) {
      if (wo.assignedTo.nameEn) return wo.assignedTo.nameEn;
      const initialMember = initialTeamMembers.find((m) => m.id === wo.assignedTo?.id || m.name === wo.assignedTo?.name);
      if (initialMember?.nameEn) return initialMember.nameEn;
      if (wo.assignedTo.name === 'أحمد خليل') return 'Ahmed Khalil';
      if (wo.assignedTo.name === 'رامي سالم') return 'Rami Salem';
      if (wo.assignedTo.name === 'طارق النابلسي') return 'Tariq Al-Nabulsi';
      if (wo.assignedTo.name === 'م. أنس الكرمي') return 'Eng. Anas Al-Karmi';
      if (wo.assignedTo.name === 'سامر عودة') return 'Samer Odeh';
    }
    return wo.assignedTo.name;
  };

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [filterType, setFilterType] = useState<'all' | 'unassigned' | 'critical'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected Order for Priority Explanation Modal
  const [selectedOrderForExplanation, setSelectedOrderForExplanation] = useState<WorkOrder | null>(null);

  // Filtered orders
  const filteredOrders = workOrders.filter((wo) => {
    const q = searchQuery.toLowerCase();
    const title = getOrderTitle(wo).toLowerCase();
    const asset = getAssetTitle(wo).toLowerCase();
    const matchesSearch = 
      wo.title.toLowerCase().includes(q) || 
      title.includes(q) ||
      wo.code.toLowerCase().includes(q) || 
      wo.assetName.toLowerCase().includes(q) || 
      asset.includes(q);

    if (filterType === 'unassigned') return matchesSearch && !wo.assignedTo;
    if (filterType === 'critical') return matchesSearch && wo.priority === 'critical';
    return matchesSearch;
  });

  const columns: { id: WorkOrderStatus; title: string; color: string }[] = [
    { id: 'open', title: isEn ? 'New / Pending' : 'جديدة / معلقة', color: 'border-blue-500/40' },
    { id: 'in_progress', title: isEn ? 'In Progress' : 'قيد التنفيذ', color: 'border-amber-500/40' },
    { id: 'waiting_parts', title: isEn ? 'Waiting for Parts' : 'بانتظار قطع غيار', color: 'border-purple-500/40' },
    { id: 'completed', title: isEn ? 'Completed & Closed' : 'مكتملة ومغلقة', color: 'border-emerald-500/40' },
  ];

  return (
    <div className={`p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full ${isEn ? 'text-left font-sans' : 'text-right font-arabic'}`}>
      {/* Top Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isEn ? 'Work Orders & Field Maintenance' : 'أوامر العمل والصيانة'}
          </h1>
          <p className="text-xs sm:text-sm text-[#A3B1C6] mt-1">
            {isEn 
              ? 'Manage dispatches, monitor technician progress, with transparent priority explanation.' 
              : 'إدارة البلاغات ومتابعة تقدم الفنيين مع تفسير فوري لأسباب تحديد أولوية كل أمر.'}
          </p>
        </div>

        <button
          onClick={onOpenNewOrder}
          className="h-11 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 text-white font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>{isEn ? 'Create New Work Order' : 'إنشاء أمر عمل جديد'}</span>
        </button>
      </div>

      {/* Filter and View Switcher Bar */}
      <div className="p-4 rounded-2xl bg-[#0F1729] border border-[#1E2A44] flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEn ? 'Search by order # (WO-...), title, or asset...' : 'ابحث برقم الأمر (WO-...)، العنوان، أو اسم الأصل...'}
            className={`w-full h-10 px-3.5 ${isEn ? 'pl-10 text-left' : 'pl-10 text-right'} rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none placeholder-[#8696AE]`}
          />
          <Search size={16} className="absolute left-3 top-3 text-[#8696AE]" />
        </div>

        {/* Filters & View Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0B1222] border border-[#26324A] text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                filterType === 'all' ? 'bg-[#1E2A44] text-white' : 'text-[#8696AE] hover:text-white'
              }`}
            >
              {isEn ? `All (${workOrders.length})` : `الكل (${workOrders.length})`}
            </button>
            <button
              onClick={() => setFilterType('critical')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                filterType === 'critical' ? 'bg-rose-500/20 text-rose-300' : 'text-[#8696AE] hover:text-white'
              }`}
            >
              {isEn ? 'Critical & Urgent' : 'عاجلة وحرجة'}
            </button>
            <button
              onClick={() => setFilterType('unassigned')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                filterType === 'unassigned' ? 'bg-[#1E2A44] text-white' : 'text-[#8696AE] hover:text-white'
              }`}
            >
              {isEn ? 'Unassigned' : 'غير مسندة'}
            </button>
          </div>

          {/* Board vs List */}
          <div className="flex items-center p-1 rounded-xl bg-[#0B1222] border border-[#26324A]">
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'board' ? 'bg-[#1E2A44] text-white' : 'text-[#8696AE] hover:text-white'
              }`}
              title={isEn ? 'Kanban Board' : 'لوحة كانبان'}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-[#1E2A44] text-white' : 'text-[#8696AE] hover:text-white'
              }`}
              title={isEn ? 'Table View' : 'جدول الأوامر'}
            >
              <TableIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const colOrders = filteredOrders.filter((wo) => wo.status === col.id);
            return (
              <div 
                key={col.id} 
                className="bg-[#0B1222] border border-[#1A2440] rounded-2xl p-4 flex flex-col gap-3 min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#1A2440]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{col.title}</span>
                    <span className="mono text-xs px-2 py-0.5 rounded-full bg-[#16213A] text-[#C3CEDF]">
                      {colOrders.length}
                    </span>
                  </div>
                </div>

                {/* Column Cards */}
                <div className="flex flex-col gap-3">
                  {colOrders.map((wo) => (
                    <div
                      key={wo.id}
                      className={`p-4 rounded-xl bg-[#0F1729] border border-[#1E2A44] hover:border-blue-500/50 transition-all shadow-md flex flex-col justify-between gap-3 ${isEn ? 'text-left' : 'text-right'} group card-glow`}
                    >
                      <div className="space-y-2">
                        {/* Header: Code & Priority Badge */}
                        <div className="flex items-center justify-between">
                          <span className="mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                            {wo.code}
                          </span>

                          {/* Explainable Priority Trigger */}
                          <button
                            onClick={() => setSelectedOrderForExplanation(wo)}
                            className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs mono font-bold border transition-colors cursor-pointer ${
                              wo.priorityScore >= 75
                                ? 'bg-rose-500/15 border-rose-500/30 text-rose-400 hover:bg-rose-500/25'
                                : wo.priorityScore >= 50
                                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/25'
                                : 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20'
                            }`}
                            title={isEn ? 'Click to explain how priority was calculated' : 'انقر لتفسير كيف تم حساب هذه الأولوية'}
                          >
                            <span>{isEn ? `Priority ${wo.priorityScore}` : `أولوية ${wo.priorityScore}`}</span>
                            <HelpCircle size={12} />
                          </button>
                        </div>

                        {/* Title */}
                        <h4 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors leading-snug">
                          {getOrderTitle(wo)}
                        </h4>

                        {/* Asset & Site Info */}
                        <div className="text-xs text-[#8696AE] space-y-0.5">
                          <div 
                            onClick={() => openAssetDetail(wo.assetId)}
                            className="text-teal-400/90 hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <span>{getAssetTitle(wo)}</span>
                          </div>
                          <div>{getSiteTitle(wo)}</div>
                        </div>
                      </div>

                      {/* Footer: Assignee & SLA & Column Mover */}
                      <div className="pt-2.5 border-t border-[#1A2440] flex items-center justify-between text-xs">
                        {/* Assignee */}
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 text-[10px] font-bold flex items-center justify-center">
                            {isEn ? (getAssigneeName(wo)[0] || '?') : (wo.assignedTo?.avatar || '؟')}
                          </span>
                          <span className="text-white text-[11px] truncate max-w-[90px]">
                            {getAssigneeName(wo)}
                          </span>
                        </div>

                        {/* Movement Action Arrows */}
                        <div className="flex items-center gap-1">
                          {col.id !== 'open' && (
                            <button
                              onClick={() => {
                                const target = col.id === 'completed' ? 'waiting_parts' : col.id === 'waiting_parts' ? 'in_progress' : 'open';
                                updateWorkOrderStatus(wo.id, target);
                              }}
                              className="p-1 rounded bg-[#16213A] hover:bg-[#1E2A44] text-[#A3B1C6] hover:text-white cursor-pointer"
                              title={isEn ? 'Move to previous stage' : 'الرجوع للمرحلة السابقة'}
                            >
                              {isEn ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                            </button>
                          )}
                          {col.id !== 'completed' && (
                            <button
                              onClick={() => {
                                const target = col.id === 'open' ? 'in_progress' : col.id === 'in_progress' ? 'waiting_parts' : 'completed';
                                updateWorkOrderStatus(wo.id, target);
                              }}
                              className="p-1 rounded bg-[#16213A] hover:bg-blue-600 text-[#A3B1C6] hover:text-white cursor-pointer"
                              title={isEn ? 'Advance to next stage' : 'التقدم للمرحلة التالية'}
                            >
                              {isEn ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {colOrders.length === 0 && (
                    <div className="py-12 text-center text-[#8696AE] text-xs">
                      {isEn ? 'No work orders in this column' : 'لا توجد أوامر في هذه الحالة'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'list' && (
        <div className="rounded-2xl bg-[#0F1729] border border-[#1E2A44] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className={`w-full ${isEn ? 'text-left' : 'text-right'} border-collapse text-xs sm:text-sm`}>
              <thead>
                <tr className="bg-[#0B1222] border-b border-[#1E2A44] text-[11px] font-bold text-[#8696AE]">
                  <th className="py-3.5 px-4">{isEn ? 'Order #' : 'رقم الأمر'}</th>
                  <th className="py-3.5 px-4">{isEn ? 'Title & Machine' : 'العنوان والمعدة'}</th>
                  <th className="py-3.5 px-4">{isEn ? 'Site' : 'الموقع'}</th>
                  <th className="py-3.5 px-4">{isEn ? 'Status' : 'الحالة'}</th>
                  <th className="py-3.5 px-4">{isEn ? 'Priority Score' : 'الأولوية المحسوبة'}</th>
                  <th className="py-3.5 px-4">{isEn ? 'Assigned To' : 'المسند إليه'}</th>
                  <th className="py-3.5 px-4 text-center">{isEn ? 'Change Status' : 'تغيير الحالة'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2440]/70">
                {filteredOrders.map((wo) => (
                  <tr key={wo.id} className="hover:bg-[#121C33] transition-colors">
                    <td className="py-4 px-4 font-bold text-blue-400 mono">{wo.code}</td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-white">
                        {getOrderTitle(wo)}
                      </div>
                      <div className="text-xs text-[#8696AE] mt-0.5">
                        {getAssetTitle(wo)} ({wo.assetCode})
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[#C3CEDF]">
                      {getSiteTitle(wo)}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        wo.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' :
                        wo.status === 'in_progress' ? 'bg-amber-500/15 text-amber-400' :
                        wo.status === 'waiting_parts' ? 'bg-purple-500/15 text-purple-400' : 'bg-blue-500/15 text-blue-400'
                      }`}>
                        {wo.status === 'completed' 
                          ? (isEn ? 'Completed' : 'مكتمل') 
                          : wo.status === 'in_progress' 
                          ? (isEn ? 'In Progress' : 'قيد التنفيذ') 
                          : wo.status === 'waiting_parts' 
                          ? (isEn ? 'Waiting Parts' : 'قطع غيار') 
                          : (isEn ? 'New' : 'جديد')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => setSelectedOrderForExplanation(wo)}
                        className="mono font-bold text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{wo.priorityScore}</span>
                        <HelpCircle size={13} className="text-[#8696AE]" />
                      </button>
                    </td>
                    <td className="py-4 px-4 text-white">
                      {getAssigneeName(wo)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <select
                        value={wo.status}
                        onChange={(e) => updateWorkOrderStatus(wo.id, e.target.value as any)}
                        className="h-8 px-2 rounded-lg bg-[#0B1222] border border-[#26324A] text-xs text-[#C3CEDF] cursor-pointer"
                      >
                        <option value="open">{isEn ? 'New' : 'جديد'}</option>
                        <option value="in_progress">{isEn ? 'In Progress' : 'قيد التنفيذ'}</option>
                        <option value="waiting_parts">{isEn ? 'Waiting Parts' : 'بانتظار قطع'}</option>
                        <option value="completed">{isEn ? 'Completed' : 'مكتمل'}</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: EXPLAINABLE PRIORITY BREAKDOWN */}
      {selectedOrderForExplanation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#03060E]/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-lg bg-[#0F1729] border border-[#26324A] rounded-2xl p-6 sm:p-7 shadow-2xl ${isEn ? 'text-left font-sans' : 'text-right font-arabic'} space-y-5 animate-slide-up`}>
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2A44]">
              <div>
                <div className="text-xs text-blue-400 font-bold mono">
                  {isEn ? 'Explainable Priority Algorithm' : 'نموذج الأولوية القابل للتفسير'}
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {isEn ? `Work Order Priority Breakdown (${selectedOrderForExplanation.code})` : `تفسير أولوية أمر العمل (${selectedOrderForExplanation.code})`}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderForExplanation(null)}
                className="w-8 h-8 rounded-lg text-[#8696AE] hover:text-white flex items-center justify-center hover:bg-[#16213A] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B1222] border border-[#1A2440] text-xs space-y-1">
              <div className="text-white font-semibold">
                {getOrderTitle(selectedOrderForExplanation)}
              </div>
              <div className="text-[#8696AE]">
                {isEn ? 'Asset: ' : 'المعدة: '}
                {getAssetTitle(selectedOrderForExplanation)} ({selectedOrderForExplanation.assetCode})
              </div>
            </div>

            {/* Score Breakdown List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#121C33] border border-[#1E2A44]">
                <div>
                  <div className="text-xs font-bold text-white">
                    {isEn ? '1. Critical Service Impact' : '1. أثر الخدمة الحرجة'}
                  </div>
                  <div className="text-[11px] text-[#8696AE]">
                    {isEn ? 'Interruption risk to vital public/clinical service' : 'توقف الخدمة الحيوية المرتبطة بالأصل'}
                  </div>
                </div>
                <span className="mono font-bold text-blue-400 text-sm">
                  +{selectedOrderForExplanation.priorityBreakdown.serviceImpact}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#121C33] border border-[#1E2A44]">
                <div>
                  <div className="text-xs font-bold text-white">
                    {isEn ? '2. Lack of Standby Redundancy' : '2. غياب البديل الاحتياطي'}
                  </div>
                  <div className="text-[11px] text-[#8696AE]">
                    {isEn ? 'Facility operating on single unit without standby backup' : 'المحطة تعمل بأصل واحد بلا مناوب احتياطي'}
                  </div>
                </div>
                <span className="mono font-bold text-teal-400 text-sm">
                  +{selectedOrderForExplanation.priorityBreakdown.noBackup}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#121C33] border border-[#1E2A44]">
                <div>
                  <div className="text-xs font-bold text-white">
                    {isEn ? '3. Response SLA Delay' : '3. التأخر عن مهلة الاستجابة SLA'}
                  </div>
                  <div className="text-[11px] text-[#8696AE]">
                    {isEn ? 'Accumulated hours past agreed resolution threshold' : 'تجاوز ساعات الاستجابة القياسية'}
                  </div>
                </div>
                <span className="mono font-bold text-amber-400 text-sm">
                  +{selectedOrderForExplanation.priorityBreakdown.slaDelay}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#121C33] border border-[#1E2A44]">
                <div>
                  <div className="text-xs font-bold text-white">
                    {isEn ? '4. Historical Breakdown Frequency' : '4. تكرار الأعطال السابقة'}
                  </div>
                  <div className="text-[11px] text-[#8696AE]">
                    {isEn ? 'Recurrence of bearing/pump failure in last 90 days' : 'تكرار عطل نفس المحامل أو المضخة هذا الشهر'}
                  </div>
                </div>
                <span className="mono font-bold text-purple-400 text-sm">
                  +{selectedOrderForExplanation.priorityBreakdown.failureRate}
                </span>
              </div>
            </div>

            {/* Total Score & Explanation */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/40 to-blue-950/40 border border-[#26324A] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#8696AE]">
                  {isEn ? 'Total Calculated Priority' : 'مجموع الأولوية المحسوبة'}
                </span>
                <div className="text-xl font-black text-white mt-0.5">
                  {selectedOrderForExplanation.priorityScore >= 75 
                    ? (isEn ? 'Critical Emergency (4h dispatch SLA)' : 'حرجة جدًا (استجابة 4 ساعات)') 
                    : selectedOrderForExplanation.priorityScore >= 50 
                    ? (isEn ? 'High Priority (24h SLA)' : 'عالية (استجابة 24 ساعة)') 
                    : (isEn ? 'Standard Priority (3 days)' : 'معيارية')}
                </div>
              </div>
              <div className="text-3xl font-black text-rose-400 mono">
                {selectedOrderForExplanation.priorityScore}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedOrderForExplanation(null);
                  setCurrentPage('settings');
                }}
                className="flex-1 h-10 rounded-xl bg-[#16213A] hover:bg-[#1E2A44] border border-[#26324A] text-xs font-semibold text-blue-400 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sliders size={14} />
                <span>{isEn ? 'Customize Weights in Settings' : 'تعديل أوزان المعادلة من الإعدادات'}</span>
              </button>
              <button
                onClick={() => setSelectedOrderForExplanation(null)}
                className="h-10 px-5 rounded-xl bg-[#1E2A44] text-white text-xs font-semibold cursor-pointer"
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
