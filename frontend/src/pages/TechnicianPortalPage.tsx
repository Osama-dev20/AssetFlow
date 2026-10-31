import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wrench, CheckCircle2, AlertTriangle, Phone, 
  Wifi, WifiOff, Box, Clock, ChevronRight, Check, Sparkles, Sliders
} from 'lucide-react';
import { WorkOrder, Asset } from '../types';
import { soundManager } from '../lib/soundEffects';

export const TechnicianPortalPage: React.FC = () => {
  const { 
    currentUser, 
    workOrders, 
    assets, 
    updateWorkOrderStatus, 
    language, 
    isOffline, 
    setIsOffline, 
    showToast,
    openAssetDetail
  } = useApp();

  const isEn = language === 'en';

  // State
  const [selectedOrderId, setSelectedOrderId] = useState<string>(workOrders[0]?.id || '');
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  // Filter technician's site assets and assigned orders
  const mySiteAssets = assets.filter((a) => a.siteId === 'site-1' || a.siteName.includes('التحلية'));
  const myWorkOrders = workOrders; // Display work orders sorted by priority score
  const selectedOrder = workOrders.find((w) => w.id === selectedOrderId) || workOrders[0];

  const toggleTask = (taskId: string) => {
    soundManager.playButtonClick();
    setCompletedTasks((prev) => {
      const next = !prev[taskId];
      showToast(
        isEn ? (next ? 'Task step verified' : 'Task step undone') : (next ? 'تم إنجاز خطوة الفحص بنجاح' : 'تم إلغاء تحديد الخطوة'),
        '',
        'info'
      );
      return { ...prev, [taskId]: next };
    });
  };

  const handleToggleOffline = () => {
    const next = !isOffline;
    setIsOffline(next);
    soundManager.playCardSwitch();
    showToast(
      next 
        ? (isEn ? 'Offline Mode Activated' : 'تم تفعيل وضع عدم الاتصال (Offline)') 
        : (isEn ? 'Online Mode Restored' : 'تمت استعادة الاتصال بالشبكة (Online)'),
      next 
        ? (isEn ? 'Local changes are queued for synchronization' : 'التحديثات ستُحفظ محلياً في الذاكرة حتى عودة الاتصال') 
        : (isEn ? 'All queued updates synced with server' : 'تمت مزامنة كافة الفحوصات والمهام مع الخادم'),
      next ? 'info' : 'success'
    );
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 ${isEn ? 'text-left' : 'text-right'}`}>
      
      {/* 1. HEADER & GREETING */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2A44]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8696AE] mb-1">
            <span>{isEn ? 'Field Technician Portal' : 'لوحة الفني الميداني'}</span>
            <span>·</span>
            <span className="text-blue-400 font-semibold">{isEn ? (currentUser.siteNameEn || currentUser.siteName || 'Desalination Plant') : (currentUser.siteName || 'محطة التحلية وضخ المياه')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span>{isEn ? `Welcome back, ${currentUser.nameEn || currentUser.name} 🔧` : `مرحباً بك، ${currentUser.name} 🔧`}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A3B1C6] mt-1">
            {isEn 
              ? 'View assigned priority tasks, verify diagnostic checklists, and inspect site assets directly from the field.' 
              : 'مهامك الميدانية مرتبة بالأولوية، الفحوصات المقترحة، وأصول موقعك جاهزة للمتابعة الفورية.'}
          </p>
        </div>

        {/* Offline Toggle Pill */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
          <button
            onClick={handleToggleOffline}
            className={`h-10 px-4 rounded-xl border transition-all text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm ${
              isOffline
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
            }`}
          >
            {isOffline ? <WifiOff size={15} /> : <Wifi size={15} />}
            <span>{isOffline ? (isEn ? 'Offline Mode (Local Cache)' : 'غير متصل (حفظ محلي)') : (isEn ? 'Online (Synced)' : 'متصل بالشبكة (مباشر)')}</span>
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#0F1729] border border-[#22304D] flex items-center gap-3.5">
          <span className="w-11 h-11 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
            <Wrench size={20} />
          </span>
          <div>
            <div className="text-xs text-[#8696AE] font-medium">{isEn ? 'Assigned Tasks' : 'المهام المسندة'}</div>
            <div className="text-2xl font-black text-white mono mt-0.5">{myWorkOrders.length}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1729] border border-[#22304D] flex items-center gap-3.5">
          <span className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
            <Box size={20} />
          </span>
          <div>
            <div className="text-xs text-[#8696AE] font-medium">{isEn ? 'My Site Assets' : 'أصول موقعي'}</div>
            <div className="text-2xl font-black text-white mono mt-0.5">{mySiteAssets.length}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F1729] border border-[#22304D] flex items-center gap-3.5">
          <span className="w-11 h-11 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </span>
          <div>
            <div className="text-xs text-[#8696AE] font-medium">{isEn ? 'Under Repair' : 'تحت الصيانة'}</div>
            <div className="text-2xl font-black text-rose-400 mono mt-0.5">1</div>
          </div>
        </div>
      </div>

      {/* 3. WORK ORDER EXECUTION PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Task List (Col 5) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Wrench size={16} className="text-blue-400" />
              <span>{isEn ? 'Priority Work Orders' : 'أوامر العمل الميدانية'}</span>
            </h2>
            <span className="text-xs text-[#8696AE]">{isEn ? 'Ranked by Priority Score' : 'مرتبة بحسب درجة الأولوية'}</span>
          </div>

          <div className="space-y-3">
            {myWorkOrders.map((order) => {
              const isSelected = order.id === selectedOrderId;
              return (
                <div
                  key={order.id}
                  onClick={() => {
                    soundManager.playCardSwitch();
                    setSelectedOrderId(order.id);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-[#142038] border-blue-500/60 shadow-lg shadow-blue-500/10'
                      : 'bg-[#0F1729] border-[#22304D] hover:bg-[#121B30]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="mono font-extrabold text-xs text-blue-400">{order.code}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      order.priority === 'critical' 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : (order.priority === 'high' 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30')
                    }`}>
                      {order.priority.toUpperCase()} · Score {order.priorityScore}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-2">
                    {isEn ? (order.titleEn || order.title) : order.title}
                  </h3>

                  <div className="text-[11px] text-[#8696AE] flex items-center justify-between pt-1 border-t border-[#1E2A44]">
                    <span>{isEn ? (order.assetNameEn || order.assetName) : order.assetName}</span>
                    <span className="mono text-blue-300">{order.assetCode}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Task Details & Checklist (Col 7) */}
        {selectedOrder && (
          <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl bg-[#0F1729] border border-blue-500/30 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2A44]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="mono font-bold text-xs text-blue-400">{selectedOrder.code}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    {selectedOrder.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-extrabold text-white mt-1">
                  {isEn ? (selectedOrder.titleEn || selectedOrder.title) : selectedOrder.title}
                </h2>
              </div>

              {/* Status Update Dropdown */}
              <select
                value={selectedOrder.status}
                onChange={(e) => {
                  updateWorkOrderStatus(selectedOrder.id, e.target.value as any);
                  soundManager.playButtonClick();
                }}
                className="h-9 px-3 rounded-xl bg-[#0B1222] border border-[#26324A] text-xs font-bold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="open">{isEn ? 'Open' : 'مفتوح'}</option>
                <option value="in_progress">{isEn ? 'In Progress' : 'قيد التنفيذ'}</option>
                <option value="waiting_parts">{isEn ? 'Waiting Parts' : 'بانتظار قطع'}</option>
                <option value="completed">{isEn ? 'Completed' : 'مكتمل'}</option>
              </select>
            </div>

            {/* Scope / Description */}
            <div className="p-4 rounded-2xl bg-[#0A1020] border border-[#1A2440] text-xs leading-relaxed text-[#C3CEDF]">
              <span className="font-bold text-white block mb-1">{isEn ? 'Work Order Instructions & Symptoms:' : 'تعليمات ووصف أمر العمل:'}</span>
              <p className="whitespace-pre-line">
                {isEn ? (selectedOrder.descriptionEn || selectedOrder.description) : selectedOrder.description}
              </p>
            </div>

            {/* Interactive Verification Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-teal-400" />
                  <span>{isEn ? 'Field Diagnostic Verification Checklist' : 'قائمة التحقق والفحوصات الميدانية'}</span>
                </span>
                <span className="text-[11px] text-[#8696AE] mono">{isEn ? 'Click to toggle' : 'انقر للتأكيد'}</span>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'c1', textAr: 'فحص إحكام حشوة مانع التسرب وعدم وجود تسريب تحت الضغط', textEn: 'Inspect mechanical seal seating and verify zero leakage under pressure' },
                  { id: 'c2', textAr: 'قياس اهتزازات المحمل الخلفي عبر جهاز الاهتزازات المحمول (< 2.8 mm/s)', textEn: 'Measure rear bearing vibration level with portable analyzer (< 2.8 mm/s)' },
                  { id: 'c3', textAr: 'معاينة محاذاة محور المحرك مع المضخة بالليزر وتوثيق القراءات', textEn: 'Perform laser shaft alignment and log dial readings' },
                  { id: 'c4', textAr: 'تشغيل تجريبي لمدة 15 دقيقة ومراقبة حرارة المحرك وتدفق الطرد', textEn: '15-minute operational test run and log motor stator temperatures' },
                ].map((item) => {
                  const isDone = !!completedTasks[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleTask(item.id)}
                      className={`p-3 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                        isDone
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                          : 'bg-[#0A1020] border-[#1A2440] text-[#C3CEDF] hover:bg-[#121B30]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold text-xs transition-colors shrink-0 ${
                        isDone ? 'bg-emerald-500 text-white' : 'border border-[#26324A] bg-[#16213A]'
                      }`}>
                        {isDone && <Check size={13} />}
                      </div>
                      <span className={`text-xs flex-1 ${isDone ? 'line-through text-emerald-300/70' : ''}`}>
                        {isEn ? item.textEn : item.textAr}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Contact with Director */}
            <div className="p-4 rounded-2xl bg-[#0A1020] border border-[#1A2440] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                  <Phone size={16} />
                </span>
                <div>
                  <div className="font-bold text-white">{isEn ? 'Direct Facility Director' : 'مديرك المباشر: طارق النابلسي'}</div>
                  <div className="text-[11px] text-[#8696AE]">{isEn ? 'Facility & Maintenance Lead' : 'مدير المنظمة والمنشآت'}</div>
                </div>
              </div>
              <a 
                href="tel:+970598124410"
                className="h-8 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors inline-flex items-center gap-1.5 mono cursor-pointer"
              >
                <span>+970 59 812 4410</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 4. MY SITE ASSETS (READ-ONLY INSPECTION) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0F1729] border border-[#22304D] space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E2A44] pb-3">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Box size={18} className="text-blue-400" />
              <span>{isEn ? 'Assets at My Facility (Read-Only)' : 'أصول موقعي ومعداته (عرض فقط)'}</span>
            </h2>
            <span className="text-xs text-[#8696AE]">{isEn ? 'Direct equipment inventory assigned to your work zone' : 'سجل المعدات في موقع عملك الميداني'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {mySiteAssets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => openAssetDetail(asset.id)}
              className="p-4 rounded-2xl bg-[#0A1020] border border-[#1A2440] hover:border-blue-500/40 hover:bg-[#121B30] transition-all cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                  <Box size={18} />
                </span>
                <div>
                  <h3 className="font-bold text-white text-xs sm:text-sm group-hover:text-blue-400 transition-colors">
                    {isEn ? (asset.nameEn || asset.name) : asset.name}
                  </h3>
                  <div className="text-[11px] text-[#8696AE] mono mt-0.5">{asset.code} · {asset.category}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  asset.status === 'operational'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                }`}>
                  {asset.status === 'operational' ? (isEn ? 'Operational' : 'يعمل') : (isEn ? 'Maintenance' : 'تحت الصيانة')}
                </span>
                <ChevronRight size={16} className="text-[#8696AE]" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
