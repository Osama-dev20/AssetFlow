import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, Plus, ArrowLeft,
  AlertTriangle
} from 'lucide-react';
import { soundManager } from '../lib/soundEffects';
import { translations } from '../data/translations';

interface DashboardPageProps {
  onOpenNewOrderModal: () => void;
  onOpenNewAssetModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
  onOpenNewOrderModal, 
  onOpenNewAssetModal 
}) => {
  const { 
    currentUser, 
    setCurrentPage, 
    openAssetDetail, 
    assets, 
    workOrders, 
    services, 
    sites,
    setupSteps,
    toggleSetupStep,
    language,
    issues
  } = useApp();

  const d = translations[language].dashboard;

  const [attentionFilter, setAttentionFilter] = useState<'all' | 'faults' | 'pm'>('all');

  const openIssues = issues.filter((i) => i.status === 'reported' || i.status === 'under_review');
  const criticalImpactIssues = openIssues.filter((i) => i.impact?.affectedServices?.some((s) => s.criticality === 'critical'));
  const openIssuesCount = openIssues.length;
  const criticalImpactCount = criticalImpactIssues.length;

  const operationalCount = assets.filter((a) => a.status === 'operational').length;
  const maintenanceCount = assets.filter((a) => a.status === 'maintenance').length;
  const stoppedCount = assets.filter((a) => a.status === 'stopped').length;
  const operationalPercent = Math.round((operationalCount / (assets.length || 1)) * 100);

  const stableServicesCount = services.filter((s) => s.status === 'stable').length;
  const atRiskServicesCount = services.filter((s) => s.status !== 'stable').length;

  const openOrders = workOrders.filter((wo) => wo.status !== 'completed');
  const completedSetupCount = setupSteps.filter((s) => s.completed).length;

  return (
    <div className={`p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full ${
      language === 'en' ? 'text-left font-sans' : 'text-right font-arabic'
    }`}>
      {/* Top Greeting & Action Buttons */}
      <div className="flex flex-wrap justify-between items-end gap-4 pb-2">
        <div>
          <div className="text-xs sm:text-sm text-[#8696AE]">{d.date}</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {d.greeting}{language === 'en' ? (currentUser.nameEn ? currentUser.nameEn.split(' ')[0] : 'Tariq') : currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-[#A3B1C6] mt-1">
            {d.summaryPrefix}{openOrders.length}{d.summarySuffix}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onOpenNewOrderModal();
            }}
            className="h-11 px-4 rounded-xl border border-[#26324A] bg-[#0F1729] text-white hover:bg-[#16213A] hover:border-rose-500/50 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <AlertTriangle size={16} className="text-rose-400" />
            <span>{d.reportFault}</span>
          </button>
          <button
            onClick={() => {
              soundManager.playButtonClick();
              onOpenNewAssetModal();
            }}
            className="h-11 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 text-white font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            <span>{d.registerAsset}</span>
          </button>
        </div>
      </div>

      {/* Sprint 2/3 Urgent Fault Reports Banner (Figma 03-15) */}
      {openIssuesCount > 0 && (
        <div 
          role="alert" 
          className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-amber-900/25 to-amber-950/30 border border-amber-500/35 shadow-lg shadow-amber-950/20"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <span className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle size={24} />
            </span>
            <div>
              <div className="font-bold text-white text-sm sm:text-base flex items-center gap-2 flex-wrap">
                <span>
                  {language === 'en'
                    ? `${openIssuesCount} new fault reports need triage review`
                    : `${openIssuesCount} بلاغات أعطال جديدة بحاجة للمراجعة`}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                  {language === 'en'
                    ? `${criticalImpactCount} impact critical services`
                    : `${criticalImpactCount} منها تؤثر على خدمات حرجة`}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-amber-200/90 mt-0.5">
                {language === 'en'
                  ? 'Review AI diagnostic predictions, verify impacted vital services, and convert to work orders.'
                  : 'راجع تشخيص الذكاء الاصطناعي، وتأكد من تأثيرها على استمرارية الخدمات، وحوّلها لأوامر عمل فورية.'}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playButtonClick();
              setCurrentPage('issues');
            }}
            className="h-10 px-5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-400 transition-colors shrink-0 shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>{language === 'en' ? 'Review Fault Reports Now' : 'مراجعة البلاغات الآن'}</span>
            {language === 'en' ? <ArrowLeft size={15} className="rotate-180" /> : <ArrowLeft size={15} />}
          </button>
        </div>
      )}

      {/* Critical Service Alert Banner */}
      <div 
        role="alert" 
        className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-rose-900/25 to-rose-950/30 border border-rose-500/35 shadow-lg shadow-rose-950/20"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <span className="w-11 h-11 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 pulse-critical">
            <ShieldAlert size={24} />
          </span>
          <div>
            <div className="font-bold text-white text-sm sm:text-base">
              {d.criticalAlertTitle}
            </div>
            <div className="text-xs sm:text-sm text-rose-200/90 mt-0.5">
              {d.criticalAlertDesc}
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            soundManager.playButtonClick();
            setCurrentPage('work-orders');
          }}
          className="h-10 px-5 rounded-xl bg-rose-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-rose-400 transition-colors shrink-0 shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <span>{d.openWorkOrder}</span>
          {language === 'en' ? <ArrowLeft size={15} className="rotate-180" /> : <ArrowLeft size={15} />}
        </button>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Assets */}
        <div 
          onClick={() => {
            soundManager.playCardSwitch();
            setCurrentPage('assets');
          }}
          className="p-5 rounded-2xl bg-[#0F1729] border border-[#1E2A44] flex flex-col gap-2.5 cursor-pointer card-glow"
        >
          <div className="flex items-center justify-between text-xs text-[#A3B1C6]">
            <span>{d.kpiOperational}</span>
            <span className="mono text-emerald-400 font-bold">{operationalPercent}%</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white mono">{operationalCount}</span>
            <span className="text-xs text-[#8696AE]">{d.kpiOf} {assets.length}</span>
          </div>
          <div className="flex gap-1 h-1.5 rounded-full overflow-hidden mt-1 bg-[#16213A]">
            <span style={{ width: `${(operationalCount / assets.length) * 100}%` }} className="bg-[#34D399] rounded-full" />
            <span style={{ width: `${(maintenanceCount / assets.length) * 100}%` }} className="bg-[#FBBF24] rounded-full" />
            {stoppedCount > 0 && (
              <span style={{ width: `${(stoppedCount / assets.length) * 100}%` }} className="bg-[#F87171] rounded-full" />
            )}
          </div>
        </div>

        {/* Card 2: Services */}
        <div 
          onClick={() => {
            soundManager.playCardSwitch();
            setCurrentPage('services');
          }}
          className="p-5 rounded-2xl bg-[#0F1729] border border-rose-500/35 flex flex-col gap-2.5 cursor-pointer card-glow shadow-rose-950/10"
        >
          <div className="flex items-center justify-between text-xs text-[#A3B1C6]">
            <span>{d.kpiServices}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              {atRiskServicesCount} {d.kpiAtRisk}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white mono">{stableServicesCount}</span>
            <span className="text-xs text-[#8696AE]">{d.kpiOf} {services.length}</span>
          </div>
          <div className="flex gap-1 h-1.5 rounded-full overflow-hidden mt-1 bg-[#16213A]">
            <span style={{ width: `${(stableServicesCount / services.length) * 100}%` }} className="bg-[#34D399] rounded-full" />
            <span style={{ width: `${(atRiskServicesCount / services.length) * 100}%` }} className="bg-[#F87171] rounded-full" />
          </div>
        </div>

        {/* Card 3: Work Orders */}
        <div 
          onClick={() => {
            soundManager.playCardSwitch();
            setCurrentPage('work-orders');
          }}
          className="p-5 rounded-2xl bg-[#0F1729] border border-[#1E2A44] flex flex-col gap-2.5 cursor-pointer card-glow"
        >
          <div className="flex items-center justify-between text-xs text-[#A3B1C6]">
            <span>{d.kpiWorkOrders}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              1 {d.kpiOverdue}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white mono">{openOrders.length}</span>
            <span className="text-xs text-[#8696AE]">{d.kpiAvgClose}</span>
          </div>
          <div className="flex gap-1 h-1.5 rounded-full overflow-hidden mt-1 bg-[#16213A]">
            <span style={{ width: '33%' }} className="bg-[#F87171] rounded-full" />
            <span style={{ width: '67%' }} className="bg-[#60A5FA] rounded-full" />
          </div>
        </div>

        {/* Card 4: Preventive */}
        <div 
          onClick={() => {
            soundManager.playCardSwitch();
            setCurrentPage('preventive');
          }}
          className="p-5 rounded-2xl bg-[#0F1729] border border-[#1E2A44] flex flex-col gap-2.5 cursor-pointer card-glow"
        >
          <div className="flex items-center justify-between text-xs text-[#A3B1C6]">
            <span>{d.kpiPm}</span>
            <span className="mono text-blue-400 text-xs font-bold">2 {d.kpiScheduled}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white mono">2</span>
            <span className="text-xs text-[#8696AE]">{d.kpiNearest}</span>
          </div>
          <div className="flex gap-1 h-1.5 rounded-full overflow-hidden mt-1 bg-[#16213A]">
            <span style={{ width: '50%' }} className="bg-[#60A5FA] rounded-full" />
            <span style={{ width: '50%' }} className="bg-[#1E2A44] rounded-full" />
          </div>
        </div>
      </div>

      {/* Middle Grid: Needs Attention + Critical Services Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Needs Attention (Col 8) */}
        <section className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-[#0F1729] border border-[#1E2A44] flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#1E2A44]">
            <div>
              <h2 className="text-lg font-bold text-white">{d.needsAttentionTitle}</h2>
              <div className="text-xs text-[#8696AE]">{d.needsAttentionSub}</div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0B1222] border border-[#1E2A44] text-xs">
              <button
                onClick={() => setAttentionFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer ${
                  attentionFilter === 'all' ? 'bg-[#1E2A44] text-white' : 'text-[#A3B1C6] hover:text-white'
                }`}
              >
                {d.filterAll}
              </button>
              <button
                onClick={() => setAttentionFilter('faults')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer ${
                  attentionFilter === 'faults' ? 'bg-[#1E2A44] text-white' : 'text-[#A3B1C6] hover:text-white'
                }`}
              >
                {d.filterFaults}
              </button>
              <button
                onClick={() => setAttentionFilter('pm')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer ${
                  attentionFilter === 'pm' ? 'bg-[#1E2A44] text-white' : 'text-[#A3B1C6] hover:text-white'
                }`}
              >
                {d.filterPm}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Attention Item 1 (Score 86) */}
            {(attentionFilter === 'all' || attentionFilter === 'faults') && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-rose-500/5 border border-rose-500/25 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Conic Ring Radial Badge */}
                  <div 
                    className="w-12 h-12 rounded-full p-0.5 flex items-center justify-center shrink-0"
                    style={{ background: 'conic-gradient(#F87171 0% 86%, #1E2A44 86% 100%)' }}
                  >
                    <div className="w-full h-full bg-[#0F1729] rounded-full flex items-center justify-center font-bold text-sm text-rose-400 mono">
                      86
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-white hover:text-blue-400 cursor-pointer" onClick={() => openAssetDetail('ast-2')}>
                        {d.item1Name}
                      </span>
                      <span className="mono text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        AST-PUMP-102
                      </span>
                    </div>
                    <div className="text-xs text-[#A3B1C6] mt-1">
                      {d.item1Desc}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentPage('work-orders')}
                  className="h-9 px-4 rounded-xl border border-[#26324A] bg-[#0F1729] hover:bg-[#16213A] text-xs font-semibold text-white transition-colors shrink-0 cursor-pointer"
                >
                  {d.item1Btn}
                </button>
              </div>
            )}

            {/* Attention Item 2 (Score 58) */}
            {(attentionFilter === 'all' || attentionFilter === 'pm') && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#0B1222] border border-[#1A2440] flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div 
                    className="w-12 h-12 rounded-full p-0.5 flex items-center justify-center shrink-0"
                    style={{ background: 'conic-gradient(#FBBF24 0% 58%, #1E2A44 58% 100%)' }}
                  >
                    <div className="w-full h-full bg-[#0F1729] rounded-full flex items-center justify-center font-bold text-sm text-amber-400 mono">
                      58
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-white hover:text-blue-400 cursor-pointer" onClick={() => openAssetDetail('ast-3')}>
                        {d.item2Name}
                      </span>
                      <span className="mono text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        AST-GEN-204
                      </span>
                    </div>
                    <div className="text-xs text-[#A3B1C6] mt-1">
                      {d.item2Desc}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentPage('preventive')}
                  className="h-9 px-4 rounded-xl border border-[#26324A] bg-[#0F1729] hover:bg-[#16213A] text-xs font-semibold text-white transition-colors shrink-0 cursor-pointer"
                >
                  {d.item2Btn}
                </button>
              </div>
            )}

            {/* Attention Item 3 (Unlinked Chiller) */}
            {(attentionFilter === 'all') && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-[#0B1222] border border-[#1A2440] opacity-80 hover:opacity-100 transition-opacity flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-[#16213A] flex items-center justify-center font-bold text-sm text-[#8696AE] shrink-0 mono">
                    —
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-white hover:text-blue-400 cursor-pointer" onClick={() => openAssetDetail('ast-5')}>
                        {d.item3Name}
                      </span>
                      <span className="mono text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        AST-CHILL-401
                      </span>
                    </div>
                    <div className="text-xs text-[#8696AE] mt-1">
                      {d.item3Desc}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentPage('services')}
                  className="h-9 px-4 rounded-xl border border-[#26324A] bg-[#0F1729] hover:bg-[#16213A] text-xs font-semibold text-blue-400 transition-colors shrink-0 cursor-pointer"
                >
                  {d.item3Btn}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Critical Services Health (Col 4) */}
        <section className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-[#0F1729] border border-[#1E2A44] flex flex-col gap-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E2A44]">
            <h2 className="text-lg font-bold text-white">{d.servicesHealthTitle}</h2>
            <span className="text-xs text-[#8696AE]">{services.length} {d.servicesCount}</span>
          </div>

          <div className="flex flex-col gap-2 text-xs">
            {services.map((svc) => (
              <div
                key={svc.id}
                onClick={() => setCurrentPage('services')}
                className={`p-2.5 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                  svc.status === 'at_risk' ? 'bg-rose-500/10 border border-rose-500/20' : 'hover:bg-[#16213A]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      svc.status === 'stable' ? 'bg-[#34D399]' :
                      svc.status === 'at_risk' ? 'bg-[#F87171] pulse-critical' : 'bg-[#FBBF24]'
                    }`}
                  />
                  <span className="font-medium text-white truncate">
                    {language === 'en' ? (svc.nameEn || svc.name) : svc.name}
                  </span>
                </div>

                <span
                  className={`text-[11px] shrink-0 font-medium ${
                    svc.status === 'stable' ? 'text-[#8696AE]' :
                    svc.status === 'at_risk' ? 'text-rose-400 font-semibold' : 'text-amber-400'
                  }`}
                >
                  {svc.status === 'stable' ? d.statusStable : svc.supportingAssetsCount === 0 ? d.statusNoAssets : d.statusNoBackup}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage('services')}
            className="w-full mt-2 py-2.5 text-center text-xs font-semibold text-blue-400 hover:text-white bg-[#0B1222] rounded-xl hover:bg-[#16213A] border border-[#1E2A44] transition-colors cursor-pointer"
          >
            {d.viewServicesMatrix}
          </button>
        </section>
      </div>

      {/* Bottom Grid: Assets by Site + Setup Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Assets by Site (Col 6) */}
        <section className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-[#0F1729] border border-[#1E2A44] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E2A44]">
            <h2 className="text-lg font-bold text-white">{d.assetsBySiteTitle}</h2>
            <button
              onClick={() => setCurrentPage('sites')}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{d.manageSites}</span>
              {language === 'en' ? <ArrowLeft size={13} className="rotate-180" /> : <ArrowLeft size={13} />}
            </button>
          </div>

          <div className="space-y-3.5">
            {sites.filter((s) => s.totalAssets > 0).map((site) => (
              <div key={site.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white truncate">
                    {language === 'en' ? (site.nameEn || site.name) : site.name}
                  </span>
                  <span className="mono text-[#8696AE]">{site.totalAssets} {d.assetsCount}</span>
                </div>
                <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-[#16213A]">
                  <div
                    style={{ width: `${(site.operationalAssets / site.totalAssets) * 100}%` }}
                    className="bg-[#34D399] rounded-full"
                  />
                  {site.totalAssets - site.operationalAssets > 0 && (
                    <div
                      style={{ width: `${((site.totalAssets - site.operationalAssets) / site.totalAssets) * 100}%` }}
                      className="bg-[#FBBF24] rounded-full"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#1E2A44] flex items-center gap-4 text-xs text-[#A3B1C6] flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#34D399]" />
              {d.legendOperational}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#FBBF24]" />
              {d.legendMaintenance}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#F87171]" />
              {d.legendStopped}
            </span>
          </div>
        </section>

        {/* Setup Checklist (Col 6) */}
        <section className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-[#0F1729] border border-[#1E2A44] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E2A44]">
            <h2 className="text-lg font-bold text-white">{d.setupTitle}</h2>
            <span className="mono font-bold text-xs text-[#34D399]">
              {completedSetupCount} / {setupSteps.length}
            </span>
          </div>

          <div className="space-y-2">
            {setupSteps.map((step) => (
              <label
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                  step.completed 
                    ? 'bg-transparent text-[#8696AE] line-through' 
                    : 'bg-[#121C33] border border-[#22304D] text-white font-medium hover:border-blue-500/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={step.completed}
                  onChange={() => toggleSetupStep(step.id)}
                  className="w-4 h-4 rounded text-teal-500 accent-[#14B8A6] cursor-pointer"
                />
                <span className="text-xs sm:text-sm">
                  {d.stepTitles[step.id] || step.title}
                </span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
