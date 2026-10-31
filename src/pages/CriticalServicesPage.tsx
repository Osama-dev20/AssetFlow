import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, ShieldCheck, Play, RotateCcw, AlertTriangle, 
  Cpu, ArrowLeft, CheckCircle2, DollarSign, Activity, Zap 
} from 'lucide-react';
import { initialAssets } from '../data/mockData';

export const CriticalServicesPage: React.FC = () => {
  const { 
    services, 
    assets, 
    openAssetDetail, 
    setCurrentPage, 
    showToast,
    priorityWeights,
    language
  } = useApp();

  const isEn = language === 'en';

  const getAssetName = (a: { id: string; name: string; nameEn?: string; code?: string }) => {
    if (isEn) {
      if (a.nameEn) return a.nameEn;
      const initial = initialAssets.find((ia) => ia.id === a.id || ia.code === a.code);
      if (initial?.nameEn) return initial.nameEn;
      if (a.id === 'ast-1' || a.name.includes('#1')) return 'Centrifugal Water Pump #1';
      if (a.id === 'ast-2' || a.name.includes('#2')) return 'Centrifugal Water Pump #2';
      if (a.id === 'ast-3' || a.name.includes('1500') || a.name.includes('المولد')) return 'Turbine Generator 1500kVA';
      if (a.id === 'ast-4' || a.name.includes('الأكسجين')) return 'Central Medical Oxygen Manifold';
      if (a.id === 'ast-5' || a.name.includes('Chiller') || a.name.includes('التبريد')) return 'Industrial Chiller Unit A';
      if (a.id === 'ast-6' || a.name.includes('الحريق')) return 'Hydraulic Fire Water Pump';
    }
    return a.name;
  };

  const getServiceNameForAsset = (a: { id: string; criticalServiceId?: string; criticalServiceName?: string; criticalServiceNameEn?: string }) => {
    const service = services.find((s) => s.id === a.criticalServiceId);
    if (service) {
      return isEn ? (service.nameEn || service.name) : service.name;
    }
    if (isEn) {
      if (a.criticalServiceNameEn) return a.criticalServiceNameEn;
      if (a.id === 'ast-1' || a.id === 'ast-2') return 'Desalination Plant Water Supply';
      if (a.id === 'ast-3') return 'Hospital Standby Power';
      if (a.id === 'ast-4') return 'Central Medical Oxygen';
      if (a.id === 'ast-5') return 'Industrial Chiller Cooling';
      if (a.id === 'ast-6') return 'Firefighting & Suppression Network';
      return 'No linked service';
    }
    return a.criticalServiceName || 'بدون خدمة';
  };

  const [selectedSimAssetId, setSelectedSimAssetId] = useState<string>(assets[1]?.id || assets[0]?.id || '');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);

  const handleRunSimulation = () => {
    const asset = assets.find((a) => a.id === selectedSimAssetId);
    if (!asset) return;

    setIsSimulating(true);

    setTimeout(() => {
      // Find affected service
      const affectedService = services.find((s) => s.id === asset.criticalServiceId);
      
      const newPriorityScore = 40 + 35 + 12 + 9; // Max severity
      const estimatedHourlyLoss = affectedService?.downtimeCostPerHour || 5000;

      setSimulationResult({
        assetName: getAssetName(asset),
        assetCode: asset.code,
        serviceName: affectedService 
          ? (isEn ? (affectedService.nameEn || affectedService.name) : affectedService.name)
          : (isEn ? 'No directly linked service' : 'لا توجد خدمة مرتبطة مباشرة'),
        siteName: isEn ? (asset.siteNameEn || asset.siteName) : asset.siteName,
        isCatastrophic: affectedService ? !asset.hasBackup : false,
        score: newPriorityScore,
        hourlyLoss: estimatedHourlyLoss,
        remainingCapacity: asset.hasBackup 
          ? (isEn ? '50% (Operating on secondary standby)' : '50% (تعمل بالمضخة البديلة)')
          : (isEn ? '0% — Complete service interruption!' : '0% — انقطاع كامل للخدمة!'),
        slaRequired: isEn ? '2 hours only (Immediate emergency dispatch)' : 'ساعتان فقط (فريق طوارئ فوري)'
      });

      setIsSimulating(false);
      showToast(
        isEn ? 'Emergency drill simulation complete' : 'اكتملت محاكاة سيناريو الطوارئ',
        isEn ? `Analyzed failure impact of ${getAssetName(asset)}` : `تم تحليل أثر تعطل ${asset.name}`,
        'info'
      );
    }, 600);
  };

  const handleResetSim = () => {
    setSimulationResult(null);
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full ${isEn ? 'text-left font-sans' : 'text-right font-arabic'}`}>
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isEn ? 'Critical Services Matrix & Failure Simulator' : 'مصفوفة الخدمات الحرجة ومحاكي الأعطال'}
          </h1>
          <p className="text-xs sm:text-sm text-[#A3B1C6] mt-1">
            {isEn 
              ? 'Reliability map showing which assets protect vital services, with interactive emergency drill testing.' 
              : 'خريطة الاعتمادية التي توضح أي الأصول تحمي الخدمات الحيوية، واختبار سيناريوهات الطوارئ التفاعلية.'}
          </p>
        </div>
      </div>

      {/* INTERACTIVE FAILURE SIMULATOR WIDGET */}
      <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-[#0F1729] to-[#0D1526] border border-blue-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1E2A44] relative z-10">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Zap size={22} />
            </span>
            <div>
              <div className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                {isEn ? 'Interactive Simulation Feature' : 'ميزة المحاكاة التفاعلية'}
              </div>
              <h2 className="text-lg font-bold text-white">
                {isEn ? 'Failure Simulator & Blast Radius Analysis' : 'محاكي سيناريوهات تعطل الأصول (Failure Simulator)'}
              </h2>
            </div>
          </div>

          <div className="text-xs text-[#8696AE]">
            {isEn 
              ? 'Select any machine and test what happens across the facility if it suddenly fails' 
              : 'اختر أي معدة واختبر ماذا يحدث للمنظومة إذا تعطلت فجأة'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 relative z-10 items-center">
          {/* Selector & Controls (Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                {isEn ? 'Select asset to simulate failure:' : 'حدد الأصل المراد محاكاة تعطله:'}
              </label>
              <select
                value={selectedSimAssetId}
                onChange={(e) => setSelectedSimAssetId(e.target.value)}
                className={`w-full h-11 px-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none ${isEn ? 'text-left' : 'text-right'}`}
              >
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {getAssetName(a)} ({a.code}) — {getServiceNameForAsset(a)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-xs hover:brightness-110 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Play size={16} />
                <span>
                  {isSimulating 
                    ? (isEn ? 'Simulating impact...' : 'جاري محاكاة الأثر...') 
                    : (isEn ? 'Run Simulation Now' : 'تشغيل المحاكاة الآن')}
                </span>
              </button>
              {simulationResult && (
                <button
                  onClick={handleResetSim}
                  className="h-11 px-4 rounded-xl border border-[#26324A] bg-[#16213A] text-[#A3B1C6] hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>{isEn ? 'Reset' : 'إعادة تعيين'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Results Screen (Col 7) */}
          <div className="lg:col-span-7">
            {simulationResult ? (
              <div className={`p-4 sm:p-5 rounded-xl bg-[#0B1222] border border-rose-500/40 shadow-inner space-y-3 animate-fade-in text-xs sm:text-sm ${isEn ? 'text-left' : 'text-right'}`}>
                <div className="flex items-center justify-between pb-2 border-b border-[#1A2440]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 pulse-critical" />
                    <span className="font-bold text-white text-sm">
                      {isEn ? `Failure Scenario Result: ${simulationResult.assetName}` : `نتيجة سيناريو تعطل: ${simulationResult.assetName}`}
                    </span>
                  </div>
                  <span className="mono font-bold text-rose-400 bg-rose-500/15 px-2.5 py-0.5 rounded border border-rose-500/30">
                    {isEn ? `Emergency Priority: ${simulationResult.score} / 100` : `أولوية طوارئ: ${simulationResult.score} / 100`}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded-lg bg-[#121C33] border border-[#1E2A44]">
                    <div className="text-[11px] text-[#8696AE]">{isEn ? 'Impacted Service:' : 'الخدمة المتضررة:'}</div>
                    <div className="font-bold text-white mt-0.5 truncate">{simulationResult.serviceName}</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#121C33] border border-[#1E2A44]">
                    <div className="text-[11px] text-[#8696AE]">{isEn ? 'Remaining Capacity:' : 'القدرة المتبقية:'}</div>
                    <div className={`font-bold mt-0.5 ${simulationResult.isCatastrophic ? 'text-rose-400' : 'text-amber-400'}`}>
                      {simulationResult.remainingCapacity}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#121C33] border border-[#1E2A44]">
                    <div className="text-[11px] text-[#8696AE]">{isEn ? 'Est. Loss / Hour:' : 'الخسارة التقديرية / ساعة:'}</div>
                    <div className="font-bold text-rose-300 mono mt-0.5">${simulationResult.hourlyLoss.toLocaleString()}</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 leading-relaxed">
                  {simulationResult.isCatastrophic
                    ? (isEn 
                        ? '⚠️ Critical Hazard: This failure will cause complete shutdown of the service because no standby backup is available. Immediate technician dispatch required.' 
                        : '⚠️ تحذير عالي الخطورة: سيؤدي هذا التعطل لتوقف إمداد المياه للمحطة بالكامل لعدم وجود مضخة بديلة. يلزم استدعاء فني الطوارئ فورًا.')
                    : (isEn 
                        ? 'ℹ️ Standby Mode: Facility will automatically fail over to secondary standby asset. Swift preventive maintenance recommended.' 
                        : 'ℹ️ وضع بديل: ستتحول المنظومة للعمل على الأصل المناوب تلقائيًا مع ضرورة إجراء الصيانة الوقائية السريعة.')}
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-[#0B1222]/60 border border-dashed border-[#1E2A44] text-center text-xs text-[#8696AE] space-y-1">
                <Activity size={24} className="mx-auto text-blue-400/60 mb-2" />
                <div>{isEn ? 'Select an asset and click "Run Simulation Now" to test real-time failure' : 'حدد الأصل واضغط "تشغيل المحاكاة" لاختبار سيناريو التعطل اللحظي'}</div>
                <div>{isEn ? 'AssetFlow calculates blast radius across vital services, operational risks, and financial loss' : 'يقوم النظام بحساب انتشار الأثر على الخدمات والمخاطر المالية والتشغيلية'}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Critical Services List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">
          {isEn ? `Registered Critical Services (${services.length})` : `الخدمات الحرجة المسجلة (${services.length})`}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => {
            const supportingAssets = assets.filter((a) => a.criticalServiceId === service.id);
            return (
              <div
                key={service.id}
                className="p-5 rounded-2xl bg-[#0F1729] border border-[#1E2A44] hover:border-blue-500/40 transition-all flex flex-col justify-between gap-4 card-glow"
              >
                <div className="space-y-3">
                  {/* Status header */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#8696AE]">
                      {isEn ? (service.siteNameEn || service.siteName) : service.siteName}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      service.status === 'stable'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        service.status === 'stable' ? 'bg-emerald-400' : 'bg-rose-400'
                      }`} />
                      {service.status === 'stable' 
                        ? (isEn ? 'Stable & Safe' : 'مستقرة وبأمان') 
                        : (isEn ? 'At Risk of Outage' : 'معرّضة لخطر التوقف')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {isEn ? (service.nameEn || service.name) : service.name}
                    </h3>
                    <p className="text-xs text-[#A3B1C6] mt-1 leading-relaxed">
                      {isEn ? (service.descriptionEn || service.description) : service.description}
                    </p>
                  </div>

                  {/* Supporting Assets Pills */}
                  <div>
                    <div className="text-[11px] font-semibold text-[#8696AE] mb-1.5">
                      {isEn ? 'Assets Protecting This Service:' : 'الأصول المسؤولة عن الخدمة:'}
                    </div>
                    {supportingAssets.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {supportingAssets.map((asset) => (
                          <button
                            key={asset.id}
                            onClick={() => openAssetDetail(asset.id)}
                            className="px-2.5 py-1 rounded-lg bg-[#0B1222] border border-[#26324A] hover:border-blue-500 text-xs text-[#C3CEDF] flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              asset.status === 'operational' ? 'bg-emerald-400' : 'bg-rose-400'
                            }`} />
                            <span>{getAssetName(asset)}</span>
                            <span className="mono text-[10px] text-blue-400">({asset.code})</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                        {isEn ? 'No assets currently linked! Service is idle or unassigned.' : 'لا توجد أصول مرتبطة حالياً! الخدمة معطلة أو غير مفعلة.'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1E2A44] flex items-center justify-between text-xs text-[#8696AE]">
                  <div className="flex items-center gap-1.5">
                    <DollarSign size={14} className="text-emerald-400" />
                    <span>
                      {isEn ? 'Downtime Cost: ' : 'تكلفة التوقف: '}
                      <strong className="text-white mono">${service.downtimeCostPerHour.toLocaleString()}</strong> 
                      {isEn ? ' / hour' : ' / ساعة'}
                    </span>
                  </div>

                  <span className={`font-semibold ${service.hasRedundancy ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {service.hasRedundancy 
                      ? (isEn ? 'Standby Backup Active' : 'توفر خط احتياط') 
                      : (isEn ? 'No Backup Standby' : 'بلا بديل')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
