import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowRight, ArrowLeft, ShieldAlert, Wrench, QrCode, Clock, 
  Activity, CheckCircle2, AlertTriangle, Calendar, 
  Cpu, FileText, Package, ChevronRight, X, Printer 
} from 'lucide-react';
import { AssetStatus } from '../types';

export const AssetDetailPage: React.FC<{ onOpenNewOrderForAsset?: (assetId: string) => void }> = ({
  onOpenNewOrderForAsset
}) => {
  const { 
    selectedAssetId, 
    assets, 
    setCurrentPage, 
    workOrders, 
    updateAssetStatus, 
    showToast,
    language 
  } = useApp();

  const isEn = language === 'en';

  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'parts'>('overview');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Current Asset
  const asset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  if (!asset) {
    return (
      <div className={`p-8 text-center text-white ${isEn ? 'font-sans' : 'font-arabic'}`}>
        <div>{isEn ? 'Requested asset not found' : 'لم يتم العثور على الأصل المطلوب'}</div>
        <button onClick={() => setCurrentPage('assets')} className="mt-4 text-blue-400 underline cursor-pointer">
          {isEn ? 'Back to Asset Registry' : 'العودة لسجل الأصول'}
        </button>
      </div>
    );
  }

  // Related work orders
  const assetOrders = workOrders.filter((wo) => wo.assetId === asset.id || wo.assetCode === asset.code);

  return (
    <div className={`p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full ${isEn ? 'text-left font-sans' : 'text-right font-arabic'}`}>
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#8696AE]">
        <button onClick={() => setCurrentPage('dashboard')} className="hover:text-white transition-colors cursor-pointer">
          {isEn ? 'Dashboard' : 'لوحة القيادة'}
        </button>
        <span>/</span>
        <button onClick={() => setCurrentPage('assets')} className="hover:text-white transition-colors cursor-pointer">
          {isEn ? 'Asset Registry' : 'سجل الأصول'}
        </button>
        <span>/</span>
        <span className="text-white font-semibold mono">{asset.code}</span>
      </nav>

      {/* Asset Header Info Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0F1729] border border-[#1E2A44] flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-700 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-lg">
            <Cpu size={28} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/25">
                {asset.code}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white truncate">
                {isEn ? (asset.nameEn || asset.name) : asset.name}
              </h1>
              
              {/* Status Pill */}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                asset.status === 'operational'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : asset.status === 'maintenance'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  asset.status === 'operational' ? 'bg-emerald-400' :
                  asset.status === 'maintenance' ? 'bg-amber-400' : 'bg-rose-400'
                }`} />
                {asset.status === 'operational' 
                  ? (isEn ? 'Operational' : 'يعمل بكفاءة') 
                  : asset.status === 'maintenance' 
                  ? (isEn ? 'Under Maintenance' : 'تحت الصيانة') 
                  : (isEn ? 'Stopped' : 'متوقف')}
              </span>
            </div>

            <div className="text-xs text-[#8696AE] mt-1.5 flex items-center gap-3 flex-wrap">
              <span>{isEn ? (asset.siteNameEn || asset.siteName) : asset.siteName}</span>
              <span>•</span>
              <span>{isEn ? (asset.locationDetailsEn || asset.locationDetails) : asset.locationDetails}</span>
              <span>•</span>
              <span className="text-rose-400 font-bold mono">
                {isEn ? `Impact Priority: ${asset.priorityScore}` : `أولوية التأثير: ${asset.priorityScore}`}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="h-10 px-3.5 rounded-xl border border-[#26324A] bg-[#0B1222] text-[#C3CEDF] hover:text-white hover:border-blue-500/50 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            title={isEn ? 'Print QR Asset Tag' : 'طباعة رمز الاستجابة السريعة QR'}
          >
            <QrCode size={15} />
            <span>{isEn ? 'QR Tag' : 'كود QR'}</span>
          </button>

          <button
            onClick={() => {
              const next: AssetStatus = asset.status === 'operational' ? 'maintenance' : 'operational';
              updateAssetStatus(asset.id, next);
            }}
            className="h-10 px-4 rounded-xl border border-[#26324A] bg-[#0B1222] text-[#C3CEDF] hover:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            {asset.status === 'operational' 
              ? (isEn ? 'Set to Maintenance' : 'تحويل لحالة الصيانة') 
              : (isEn ? 'Set to Operational' : 'تعيين كـ يعمل')}
          </button>

          <button
            onClick={() => {
              if (onOpenNewOrderForAsset) onOpenNewOrderForAsset(asset.id);
              else setCurrentPage('work-orders');
            }}
            className="h-10 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-xs hover:brightness-110 shadow-lg shadow-blue-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Wrench size={15} />
            <span>{isEn ? 'New Work Order' : 'إنشاء أمر عمل'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[#1E2A44] pb-2 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#1E2A44] text-white shadow-sm'
              : 'text-[#8696AE] hover:text-white'
          }`}
        >
          {isEn ? 'Overview & Specifications' : 'نظرة عامة والمواصفات'}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'history'
              ? 'bg-[#1E2A44] text-white shadow-sm'
              : 'text-[#8696AE] hover:text-white'
          }`}
        >
          <span>{isEn ? 'Maintenance & Incident History' : 'سجل الصيانة والأعطال'}</span>
          <span className="mono text-[10px] px-1.5 py-0.2 rounded-full bg-[#16213A] text-blue-400">
            {assetOrders.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('parts')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'parts'
              ? 'bg-[#1E2A44] text-white shadow-sm'
              : 'text-[#8696AE] hover:text-white'
          }`}
        >
          <span>{isEn ? 'Spare Parts & Inventory' : 'قطع الغيار والمخزون'}</span>
          <span className="mono text-[10px] px-1.5 py-0.2 rounded-full bg-[#16213A] text-teal-400">
            {asset.parts.length}
          </span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Reliability Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#0F1729] border border-[#1E2A44]">
              <div className="flex items-center gap-2 text-xs text-[#8696AE] mb-1">
                <Clock size={15} className="text-blue-400" />
                <span>{isEn ? 'Cumulative Runtime' : 'ساعات التشغيل التراكمية'}</span>
              </div>
              <div className="text-2xl font-bold text-white mono">
                {asset.operatingHours.toLocaleString()} {isEn ? 'hours' : 'ساعة'}
              </div>
              <div className="text-[11px] text-[#A3B1C6] mt-0.5">
                {isEn ? `Since installation on ${asset.installDate}` : `منذ التركيب بتاريخ ${asset.installDate}`}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0F1729] border border-[#1E2A44]">
              <div className="flex items-center gap-2 text-xs text-[#8696AE] mb-1">
                <Activity size={15} className="text-emerald-400" />
                <span>{isEn ? 'Mean Time Between Failures (MTBF)' : 'متوسط وقت ما بين الأعطال (MTBF)'}</span>
              </div>
              <div className="text-2xl font-bold text-white mono">
                {asset.mtbfHours} {isEn ? 'hours' : 'ساعة'}
              </div>
              <div className="text-[11px] text-emerald-400 mt-0.5 font-medium">
                {isEn ? 'High Reliability Tier' : 'معدل اعتمادية مرتفع'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0F1729] border border-[#1E2A44]">
              <div className="flex items-center gap-2 text-xs text-[#8696AE] mb-1">
                <Wrench size={15} className="text-amber-400" />
                <span>{isEn ? 'Mean Time to Repair (MTTR)' : 'متوسط وقت الإصلاح (MTTR)'}</span>
              </div>
              <div className="text-2xl font-bold text-white mono">
                {asset.mttrHours} {isEn ? 'hours' : 'ساعة'}
              </div>
              <div className="text-[11px] text-[#A3B1C6] mt-0.5">
                {isEn ? 'On-site spare parts readiness' : 'جاهزية قطع الغيار في الموقع'}
              </div>
            </div>
          </div>

          {/* Technical Specifications & Linked Service */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tech Specs */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0F1729] border border-[#1E2A44] space-y-4">
              <h3 className="font-bold text-base text-white border-b border-[#1E2A44] pb-2">
                {isEn ? 'Technical Specifications' : 'المواصفات الفنية والهندسية'}
              </h3>
              
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between py-1.5 border-b border-[#1A2440]">
                  <span className="text-[#8696AE]">{isEn ? 'Manufacturer:' : 'الشركة المصنعة:'}</span>
                  <span className="font-semibold text-white">{asset.manufacturer}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1A2440]">
                  <span className="text-[#8696AE]">{isEn ? 'Model:' : 'الموديل والطراز:'}</span>
                  <span className="font-semibold text-white mono">{asset.model}</span>
                </div>
                {asset.powerRating && (
                  <div className="flex justify-between py-1.5 border-b border-[#1A2440]">
                    <span className="text-[#8696AE]">{isEn ? 'Power Rating:' : 'القدرة الكهربائية:'}</span>
                    <span className="font-semibold text-white mono">{asset.powerRating}</span>
                  </div>
                )}
                {asset.capacity && (
                  <div className="flex justify-between py-1.5 border-b border-[#1A2440]">
                    <span className="text-[#8696AE]">{isEn ? 'Capacity / Flow:' : 'السعة والتدفق:'}</span>
                    <span className="font-semibold text-white mono">{asset.capacity}</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5 border-b border-[#1A2440]">
                  <span className="text-[#8696AE]">{isEn ? 'Warranty Expiry:' : 'تاريخ انتهاء الضمان:'}</span>
                  <span className="font-semibold text-white mono">{asset.warrantyExpiry}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#8696AE]">{isEn ? 'Last Scheduled Maintenance:' : 'آخر صيانة دورية:'}</span>
                  <span className="font-semibold text-white mono">{asset.lastMaintenance}</span>
                </div>
              </div>
            </div>

            {/* Critical Service Dependency */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0F1729] border border-[#1E2A44] space-y-4">
              <h3 className="font-bold text-base text-white border-b border-[#1E2A44] pb-2 flex items-center justify-between">
                <span>{isEn ? 'Linked Critical Service' : 'الخدمة الحرجة المرتبطة'}</span>
                <span className="text-xs text-rose-400 font-normal">{isEn ? 'Elevated Priority' : 'أولوية مضاعفة'}</span>
              </h3>

              {(asset.criticalServiceName || asset.criticalServiceNameEn) ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                      <ShieldAlert size={18} />
                      <span>{isEn ? (asset.criticalServiceNameEn || asset.criticalServiceName) : asset.criticalServiceName}</span>
                    </div>
                    <p className="text-xs text-[#C3CEDF] leading-relaxed">
                      {isEn 
                        ? 'Any downtime of this unit directly risks water or power supply. The AI priority score is boosted based on this blast radius.' 
                        : 'أي توقف لهذا الأصل يؤثر مباشرة على تزويد المياه أو الطاقة الحيوية. يتم احتساب الأولوية بناءً على هذا الأثر.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0B1222] border border-[#1A2440] text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8696AE]">{isEn ? 'Standby Backup Status:' : 'حالة البديل الاحتياطي:'}</span>
                      <span className={`font-bold ${asset.hasBackup ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {asset.hasBackup 
                          ? (isEn ? 'Standby Backup Available' : 'متوفر بديل احتياطي') 
                          : (isEn ? 'No Backup (Single Point of Failure)' : 'لا يوجد بديل (Single Point of Failure)')}
                      </span>
                    </div>
                    {asset.backupAssetName && (
                      <div className="flex items-center justify-between text-[#8696AE]">
                        <span>{isEn ? 'Backup Unit:' : 'المعدة البديلة:'}</span>
                        <span className="text-white truncate max-w-[200px]">{asset.backupAssetName}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-[#8696AE] text-xs space-y-3">
                  <p>{isEn ? 'This machine is not currently linked to any critical service.' : 'هذا الأصل غير مرتبط بأي خدمة حرجة حتى الآن.'}</p>
                  <button
                    onClick={() => setCurrentPage('services')}
                    className="px-4 py-2 rounded-xl bg-[#16213A] text-blue-400 font-semibold text-xs hover:bg-[#1E2A44] cursor-pointer"
                  >
                    {isEn ? 'Link to Critical Service Now' : 'ربط بخدمة حرجة الآن'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MAINTENANCE HISTORY */}
      {activeTab === 'history' && (
        <div className="rounded-2xl bg-[#0F1729] border border-[#1E2A44] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E2A44]">
            <h3 className="font-bold text-base text-white">
              {isEn ? 'Work Order History & Field Dispatches' : 'سجل أوامر العمل وتاريخ التدخلات'}
            </h3>
            <span className="text-xs text-[#8696AE]">
              {assetOrders.length} {isEn ? 'orders logged' : 'أوامر عمل مسجلة'}
            </span>
          </div>

          {assetOrders.length > 0 ? (
            <div className="space-y-3">
              {assetOrders.map((wo) => (
                <div
                  key={wo.id}
                  onClick={() => setCurrentPage('work-orders')}
                  className={`p-4 rounded-xl bg-[#0B1222] border border-[#1A2440] hover:border-blue-500/40 transition-all cursor-pointer flex flex-wrap items-center justify-between gap-3 ${isEn ? 'text-left' : 'text-right'}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      wo.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      wo.status === 'in_progress' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      <Wrench size={18} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-white">
                          {isEn ? (wo.titleEn || wo.title) : wo.title}
                        </span>
                        <span className="mono text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                          {wo.code}
                        </span>
                      </div>
                      <div className="text-xs text-[#8696AE] mt-1 flex items-center gap-3">
                        <span>{isEn ? 'Assigned To: ' : 'المسند إليه: '}{isEn ? (wo.assignedTo?.nameEn || wo.assignedTo?.name || 'Unassigned') : (wo.assignedTo?.name || 'غير محدد')}</span>
                        <span>•</span>
                        <span className="mono">{wo.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="mono text-xs font-bold text-rose-400 px-2 py-1 rounded bg-[#16213A]">
                      {isEn ? `Priority ${wo.priorityScore}` : `أولوية ${wo.priorityScore}`}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      wo.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' :
                      wo.status === 'in_progress' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'
                    }`}>
                      {wo.status === 'completed' ? (isEn ? 'Completed' : 'مكتمل') : wo.status === 'in_progress' ? (isEn ? 'In Progress' : 'قيد التنفيذ') : (isEn ? 'Open' : 'مفتوح')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-[#8696AE] text-xs">
              {isEn ? 'No previous work orders logged for this asset.' : 'لا توجد أوامر عمل سابقة مسجلة لهذا الأصل.'}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SPARE PARTS */}
      {activeTab === 'parts' && (
        <div className="rounded-2xl bg-[#0F1729] border border-[#1E2A44] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E2A44]">
            <div>
              <h3 className="font-bold text-base text-white">
                {isEn ? 'Compatible Spare Parts & Stock Levels' : 'قطع الغيار المتوافقة والمخزون'}
              </h3>
              <p className="text-xs text-[#8696AE] mt-0.5">
                {isEn 
                  ? `Certified manufacturer spare components for ${asset.nameEn || asset.name}` 
                  : `قطع الغيار المعتمدة من الشركة المصنعة لمعدة ${asset.name}`}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full ${isEn ? 'text-left' : 'text-right'} border-collapse text-xs sm:text-sm`}>
              <thead>
                <tr className="border-b border-[#1E2A44] text-[#8696AE] text-[11px] font-bold">
                  <th className="py-3 px-3">{isEn ? 'Part Name' : 'اسم القطعة'}</th>
                  <th className="py-3 px-3">{isEn ? 'Part #' : 'رقم القطعة (Part #)'}</th>
                  <th className="py-3 px-3">{isEn ? 'In Stock' : 'المتوفر بالمخزن'}</th>
                  <th className="py-3 px-3">{isEn ? 'Min. Required' : 'الحد الأدنى المطلوب'}</th>
                  <th className="py-3 px-3">{isEn ? 'Unit Cost' : 'سعر الوحدة'}</th>
                  <th className="py-3 px-3 text-center">{isEn ? 'Request' : 'طلب توريد'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2440]/70">
                {asset.parts.map((part) => (
                  <tr key={part.id} className="hover:bg-[#121C33] transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-white">
                      {isEn ? (part.nameEn || part.name) : part.name}
                    </td>
                    <td className="py-3.5 px-3 mono text-blue-400">{part.partNumber}</td>
                    <td className="py-3.5 px-3">
                      <span className={`mono font-bold ${
                        part.inStock < part.minRequired ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {part.inStock} {isEn ? 'units' : 'قطع'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 mono text-[#8696AE]">
                      {part.minRequired} {isEn ? 'units' : 'قطع'}
                    </td>
                    <td className="py-3.5 px-3 mono text-white">${part.unitCost}</td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => showToast(
                          isEn ? 'Requisition Order Submitted' : 'تم إرسال طلب التوريد', 
                          isEn ? `Requested requisition for ${part.nameEn || part.name}` : `تم طلب شراء ${part.name}`, 
                          'success'
                        )}
                        className="px-3 py-1.5 rounded-lg bg-[#16213A] hover:bg-blue-600 hover:text-white text-blue-400 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {isEn ? 'Request Stock' : 'طلب من المستودع'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#03060E]/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#0F1729] border border-[#26324A] rounded-2xl p-6 shadow-2xl text-center space-y-4 animate-slide-up">
            <div className="flex justify-between items-center pb-2 border-b border-[#1E2A44]">
              <span className="font-bold text-white text-sm">
                {isEn ? 'Field QR Asset Tag' : 'كود QR لملصق المعدة الميداني'}
              </span>
              <button onClick={() => setIsQrModalOpen(false)} className="text-[#8696AE] hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* QR Mockup Canvas */}
            <div className="p-6 bg-white rounded-2xl inline-block shadow-inner">
              <div className="w-44 h-44 bg-slate-900 rounded-xl p-3 flex flex-col items-center justify-between text-white font-mono text-[9px]">
                <div className="text-[10px] font-bold text-blue-400">AssetFlow CMMS</div>
                <div className="grid grid-cols-5 gap-1.5 p-2 bg-slate-800 rounded-lg">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <span 
                      key={i} 
                      className={`w-4 h-4 rounded-xs ${
                        (i % 2 === 0 || i % 5 === 0) ? 'bg-white' : 'bg-slate-700'
                      }`} 
                    />
                  ))}
                </div>
                <div className="text-white font-bold">{asset.code}</div>
              </div>
            </div>

            <div>
              <div className="font-bold text-white text-sm">{isEn ? (asset.nameEn || asset.name) : asset.name}</div>
              <div className="text-xs text-[#8696AE] mono mt-0.5">
                {asset.code} • {isEn ? (asset.siteNameEn || asset.siteName) : asset.siteName}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                  showToast(isEn ? 'Sending tag to printer...' : 'جاري إرسال الملصق للطابعة', '', 'info');
                }}
                className="flex-1 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 cursor-pointer"
              >
                <Printer size={15} />
                <span>{isEn ? 'Print Tag' : 'طباعة الملصق'}</span>
              </button>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="h-10 px-4 rounded-xl border border-[#26324A] bg-[#16213A] text-[#A3B1C6] text-xs font-semibold cursor-pointer"
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
