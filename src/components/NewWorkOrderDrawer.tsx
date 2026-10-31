import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check } from 'lucide-react';
import { soundManager } from '../lib/soundEffects';

interface NewWorkOrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedAssetId?: string;
  initialTitle?: string;
}

export const NewWorkOrderDrawer: React.FC<NewWorkOrderDrawerProps> = ({
  isOpen,
  onClose,
  preselectedAssetId,
  initialTitle
}) => {
  const { assets, services, addWorkOrder, teamMembers, priorityWeights, language } = useApp();
  const isEn = language === 'en';

  const [assetId, setAssetId] = useState(preselectedAssetId || assets[0]?.id || '');
  const [orderType, setOrderType] = useState<'fault' | 'pm' | 'inspection'>('fault');
  const [title, setTitle] = useState(
    initialTitle || (isEn ? 'High vibration and mechanical seal leakage' : 'اهتزاز مرتفع وتسرّب عند مانع التسرّب')
  );
  const [description, setDescription] = useState(
    isEn
      ? 'Clear description helps the technician assemble required tooling and parts before arrival.'
      : 'وصف واضح يساعد الفني على تجهيز الأدوات قبل الوصول.'
  );
  const [assignedToId, setAssignedToId] = useState(teamMembers[2]?.id || '');

  useEffect(() => {
    if (preselectedAssetId) {
      setAssetId(preselectedAssetId);
    }
  }, [preselectedAssetId]);

  useEffect(() => {
    if (initialTitle) {
      setTitle(initialTitle);
    }
  }, [initialTitle]);

  if (!isOpen) return null;

  const currentAsset = assets.find((a) => a.id === assetId) || assets[0];
  const linkedService = services.find((s) => s.id === currentAsset?.criticalServiceId);

  // Dynamic priority calculation matching the design formula
  const serviceImpact = linkedService ? priorityWeights.serviceImpact : 0;
  const noBackup = !currentAsset?.hasBackup ? priorityWeights.noBackup : 0;
  const typeWeight = orderType === 'fault' ? 12 : orderType === 'pm' ? 8 : 4;
  const calculatedScore = Math.min(100, serviceImpact + noBackup + typeWeight + 9);

  const isCritical = calculatedScore >= 75;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playSuccess();
    const assignedMember = teamMembers.find((m) => m.id === assignedToId);

    addWorkOrder({
      title: title || (isEn ? `Emergency Fault: ${currentAsset?.nameEn || currentAsset?.name}` : `عطل طارئ: ${currentAsset?.name}`),
      titleEn: title,
      description,
      descriptionEn: description,
      assetId: currentAsset?.id,
      assetName: currentAsset?.name,
      assetNameEn: currentAsset?.nameEn || currentAsset?.name,
      assetCode: currentAsset?.code,
      siteName: currentAsset?.siteName,
      siteNameEn: currentAsset?.siteNameEn || currentAsset?.siteName,
      priority: isCritical ? 'critical' : calculatedScore >= 50 ? 'high' : 'medium',
      priorityScore: calculatedScore,
      priorityBreakdown: {
        serviceImpact,
        noBackup,
        slaDelay: typeWeight,
        failureRate: 9
      },
      assignedTo: assignedMember ? {
        id: assignedMember.id,
        name: assignedMember.name,
        nameEn: assignedMember.nameEn || assignedMember.name,
        role: assignedMember.roleArabic,
        roleEn: assignedMember.roleEn || assignedMember.role,
        avatar: assignedMember.initials
      } : undefined
    });

    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${
      isEn ? 'text-left font-sans' : 'text-right font-arabic'
    }`}>
      {/* Scrim Backdrop */}
      <div 
        className="absolute inset-0 bg-[#03060E]/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className={`fixed inset-y-0 ${isEn ? 'right-0' : 'left-0'} max-w-full flex`}>
        <div className={`w-screen max-w-lg bg-[#0D1526] ${
          isEn ? 'border-l' : 'border-r'
        } border-[#26324A] shadow-2xl flex flex-col justify-between`}>
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 border-b border-[#1A2440] flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                {isEn ? 'Report Issue / New Work Order' : 'إبلاغ عن عطل / أمر عمل جديد'}
              </h2>
              <p className="text-xs text-[#8696AE] mt-0.5">
                {isEn
                  ? 'Priority is computed automatically based on critical services linked.'
                  : 'تُحسب الأولوية تلقائيًا من الخدمات المرتبطة بالأصل.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-[#26324A] text-[#8696AE] hover:text-white flex items-center justify-center hover:bg-[#16213A] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Form Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            <form id="new-fault-order-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Asset Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                  {isEn ? 'Affected Equipment / Asset' : 'الأصل أو المعدة المتضررة'} <span className="text-rose-400">*</span>
                </label>
                <select
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                  className={`w-full h-11 px-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none ${
                    isEn ? 'text-left' : 'text-right'
                  }`}
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {isEn ? (a.nameEn || a.name) : a.name} · {a.code} ({isEn ? (a.siteNameEn || a.siteName) : a.siteName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Order Type Radio Group */}
              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-2">
                  {isEn ? 'Order Classification' : 'نوع الأمر'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playCardSwitch();
                      setOrderType('fault');
                    }}
                    className={`h-11 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      orderType === 'fault'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-[#0B1222] border-[#26324A] text-[#C3CEDF] hover:text-white'
                    }`}
                  >
                    {isEn ? 'Emergency Fault' : 'عطل طارئ'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playCardSwitch();
                      setOrderType('pm');
                    }}
                    className={`h-11 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      orderType === 'pm'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-[#0B1222] border-[#26324A] text-[#C3CEDF] hover:text-white'
                    }`}
                  >
                    {isEn ? 'Scheduled PM' : 'وقائي دوري'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playCardSwitch();
                      setOrderType('inspection');
                    }}
                    className={`h-11 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      orderType === 'inspection'
                        ? 'bg-blue-600/20 border-blue-500 text-white'
                        : 'bg-[#0B1222] border-[#26324A] text-[#C3CEDF] hover:text-white'
                    }`}
                  >
                    {isEn ? 'Inspection' : 'فحص ومعايرة'}
                  </button>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                  {isEn ? 'Work Order Title' : 'عنوان البلاغ'} <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={isEn ? 'e.g. High vibration and mechanical seal leakage' : 'مثال: صوت اهتزاز مرتفع وتسرّب ميكانيكي'}
                  className={`w-full h-11 px-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none ${
                    isEn ? 'text-left' : 'text-right'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                  {isEn ? 'Symptoms & Issue Details' : 'وصف المشكلة والأعراض التفصيلية'} <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={isEn ? 'Detailed description to help the technician arrive with correct tools and parts...' : 'وصف واضح يساعد الفني على تجهيز قطع الغيار والأدوات قبل التوجه للموقع...'}
                  className={`w-full p-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none leading-relaxed ${
                    isEn ? 'text-left' : 'text-right'
                  }`}
                />
                <span className="text-[11px] text-[#8696AE] mt-1 block">
                  {isEn
                    ? 'Clear symptom description helps technician expedite initial diagnostic time.'
                    : 'وصف واضح يساعد الفني على تجهيز الأدوات وقطع الغيار قبل الوصول.'}
                </span>
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                  {isEn ? 'Assign Certified Technician' : 'إسناد إلى فني معتمد'}
                </label>
                <select
                  value={assignedToId}
                  onChange={(e) => setAssignedToId(e.target.value)}
                  className={`w-full h-11 px-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none ${
                    isEn ? 'text-left' : 'text-right'
                  }`}
                >
                  {teamMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {isEn ? (m.nameEn || m.name) : m.name} ({isEn ? (m.roleEn || m.role) : m.roleArabic} — {isEn ? (m.specialtyEn || m.specialty) : m.specialty})
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Live Preview Box */}
              <div className="p-4 rounded-2xl bg-[#0B1222] border border-[#26324A] space-y-3">
                <div className="flex items-center gap-3">
                  {/* Conic Ring Radial Score */}
                  <div 
                    className="w-12 h-12 rounded-full p-0.5 flex items-center justify-center shrink-0"
                    style={{
                      background: isCritical 
                        ? `conic-gradient(#F87171 0% ${calculatedScore}%, #1E2A44 ${calculatedScore}% 100%)`
                        : `conic-gradient(#FBBF24 0% ${calculatedScore}%, #1E2A44 ${calculatedScore}% 100%)`
                    }}
                  >
                    <div className="w-full h-full bg-[#0B1222] rounded-full flex items-center justify-center font-bold text-sm text-white mono">
                      {calculatedScore}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {isEn ? 'Smart Priority Calculation' : 'معاينة الأولوية الذكية'}
                    </h3>
                    <div className={`text-xs font-bold ${isCritical ? 'text-rose-400' : 'text-amber-400'}`}>
                      {isCritical
                        ? (isEn ? 'Critical Priority · 4h SLA Window' : 'أولوية حرجة · استجابة خلال 4 ساعات')
                        : (isEn ? 'High Priority · 24h SLA Window' : 'أولوية عالية · استجابة خلال 24 ساعة')}
                    </div>
                  </div>
                </div>

                {/* Score Factor Breakdown */}
                <div className="space-y-1.5 pt-2 border-t border-[#1A2440] text-xs">
                  <div className="flex justify-between text-[#C3CEDF]">
                    <span>
                      {isEn ? 'Critical Service: ' : 'خدمة حرجة: '}
                      {linkedService ? (isEn ? (linkedService.nameEn || linkedService.name) : linkedService.name) : (isEn ? 'None' : 'غير مرتبط')}
                    </span>
                    <span className="mono font-bold text-white">+{serviceImpact}</span>
                  </div>
                  <div className="flex justify-between text-[#C3CEDF]">
                    <span>
                      {currentAsset?.hasBackup
                        ? (isEn ? 'Standby backup unit available' : 'متوفر أصل بديل')
                        : (isEn ? 'No standby backup' : 'لا يوجد بديل جاهز')}
                    </span>
                    <span className="mono font-bold text-white">+{noBackup}</span>
                  </div>
                  <div className="flex justify-between text-[#C3CEDF]">
                    <span>
                      {isEn ? 'Order Type: ' : 'نوع الأمر: '}
                      {orderType === 'fault' ? (isEn ? 'Emergency Fault' : 'عطل طارئ') : (isEn ? 'Maintenance' : 'صيانة')}
                    </span>
                    <span className="mono font-bold text-white">+{typeWeight}</span>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Drawer Actions */}
          <div className="p-5 sm:p-6 border-t border-[#1A2440] bg-[#0B1222] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-5 rounded-xl border border-[#26324A] bg-[#0F1729] text-[#A3B1C6] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              {isEn ? 'Cancel' : 'إلغاء'}
            </button>
            <button
              type="submit"
              form="new-fault-order-form"
              className="h-11 px-7 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 text-white font-bold text-xs hover:brightness-110 shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check size={16} />
              <span>{isEn ? 'Create Work Order Now' : 'إنشاء أمر العمل فوراً'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
