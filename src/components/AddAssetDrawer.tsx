import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { AssetStatus } from '../types';

interface AddAssetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddAssetDrawer: React.FC<AddAssetDrawerProps> = ({ isOpen, onClose }) => {
  const { addAsset, sites, services, assets, language } = useApp();
  const isEn = language === 'en';

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [siteId, setSiteId] = useState(sites[0]?.id || '');
  const [category, setCategory] = useState(isEn ? 'Pumps & Hydraulics' : 'مضخات وهيدروليك');
  const [status, setStatus] = useState<AssetStatus>('operational');
  
  // Step 2
  const [criticalServiceId, setCriticalServiceId] = useState('');
  const [hasBackup, setHasBackup] = useState(true);
  const [backupAssetId, setBackupAssetId] = useState('');
  
  // Step 3
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [powerRating, setPowerRating] = useState('');
  const [capacity, setCapacity] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [warrantyExpiry, setWarrantyExpiry] = useState('2028-12-31');

  if (!isOpen) return null;

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const site = sites.find((s) => s.id === siteId);
    const service = services.find((s) => s.id === criticalServiceId);
    const backupAsset = assets.find((a) => a.id === backupAssetId);

    addAsset({
      name,
      nameEn: name,
      code,
      siteId,
      siteName: site?.name || 'محطة رئيسية',
      siteNameEn: site?.nameEn || 'Main Facility',
      category,
      categoryEn: category,
      status,
      criticalServiceId: criticalServiceId || undefined,
      criticalServiceName: service?.name,
      hasBackup,
      backupAssetId: backupAssetId || undefined,
      backupAssetName: backupAsset?.name,
      priorityScore: service ? (hasBackup ? 45 : 85) : 25,
      installDate: new Date().toISOString().split('T')[0],
      warrantyExpiry,
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextScheduledMaintenance: '2026-12-15',
      manufacturer: manufacturer || 'Grundfos / CAT',
      model: model || 'Standard Industrial Unit',
      powerRating,
      capacity,
      locationDetails: locationDetails || (isEn ? 'Main Site' : 'الموقع الرئيسي')
    });

    // Reset & close
    setStep(1);
    setName('');
    setCode('');
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${
      isEn ? 'text-left font-sans' : 'text-right font-arabic'
    }`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#03060E]/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className={`fixed inset-y-0 ${isEn ? 'right-0' : 'left-0'} max-w-full flex`}>
        <div className={`w-screen max-w-lg bg-[#0D1526] ${
          isEn ? 'border-l' : 'border-r'
        } border-[#26324A] shadow-2xl flex flex-col justify-between`}>
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 border-b border-[#1A2440] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-blue-400 mb-1">
                {isEn ? `Step ${step} of 3` : `الخطوة ${step} من 3`}
              </div>
              <h2 className="text-xl font-bold text-white">
                {isEn ? 'Register New Equipment / Asset' : 'تسجيل أصل أو معدة جديدة'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-[#26324A] text-[#8696AE] hover:text-white flex items-center justify-center hover:bg-[#16213A] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Steps Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <form id="drawer-form-1" onSubmit={handleNextStep1} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                    {isEn ? 'Equipment / Asset Name *' : 'اسم المعدة أو الأصل *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isEn ? 'e.g. Centrifugal Booster Pump #3' : 'مثال: مضخة مياه الطرد المركزي #3'}
                    className={`w-full h-11 px-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none ${
                      isEn ? 'text-left' : 'text-right'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                      {isEn ? 'Asset Code *' : 'كود الأصل (Asset Code) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="AST-PUMP-103"
                      className="w-full h-11 px-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                      {isEn ? 'Category' : 'التصنيف'}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full h-11 px-3 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none ${
                        isEn ? 'text-left' : 'text-right'
                      }`}
                    >
                      <option value={isEn ? 'Pumps & Hydraulics' : 'مضخات وهيدروليك'}>
                        {isEn ? 'Pumps & Hydraulics' : 'مضخات وهيدروليك'}
                      </option>
                      <option value={isEn ? 'Power Generation & Electrical' : 'توليد طاقة وكهرباء'}>
                        {isEn ? 'Power Generation & Electrical' : 'توليد طاقة وكهرباء'}
                      </option>
                      <option value={isEn ? 'Medical Gas Systems' : 'أنظمة غازات طبية'}>
                        {isEn ? 'Medical Gas Systems' : 'أنظمة غازات طبية'}
                      </option>
                      <option value={isEn ? 'HVAC & Industrial Cooling' : 'تبريد وتكييف صناعي HVAC'}>
                        {isEn ? 'HVAC & Industrial Cooling' : 'تبريد وتكييف صناعي HVAC'}
                      </option>
                      <option value={isEn ? 'Fire Safety & Protection' : 'أنظمة السلامة ومكافحة الحريق'}>
                        {isEn ? 'Fire Safety & Protection' : 'أنظمة السلامة ومكافحة الحريق'}
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                    {isEn ? 'Site & Location *' : 'الموقع والمنشأة التابعة *'}
                  </label>
                  <select
                    value={siteId}
                    onChange={(e) => setSiteId(e.target.value)}
                    className={`w-full h-11 px-3 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none ${
                      isEn ? 'text-left' : 'text-right'
                    }`}
                  >
                    {sites.map((s) => (
                      <option key={s.id} value={s.id}>
                        {isEn ? (s.nameEn || s.name) : s.name} ({isEn ? (s.locationEn || s.location) : s.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                    {isEn ? 'Initial Operational Status' : 'الحالة التشغيلية الأولية'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setStatus('operational')}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        status === 'operational'
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                          : 'bg-[#0B1222] border-[#26324A] text-[#8696AE]'
                      }`}
                    >
                      {isEn ? 'Operational' : 'يعمل بكفاءة'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('maintenance')}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        status === 'maintenance'
                          ? 'bg-amber-500/15 border-amber-500 text-amber-400'
                          : 'bg-[#0B1222] border-[#26324A] text-[#8696AE]'
                      }`}
                    >
                      {isEn ? 'Maintenance' : 'تحت الصيانة'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('stopped')}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        status === 'stopped'
                          ? 'bg-rose-500/15 border-rose-500 text-rose-400'
                          : 'bg-[#0B1222] border-[#26324A] text-[#8696AE]'
                      }`}
                    >
                      {isEn ? 'Stopped' : 'متوقف عن العمل'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Step 2: Critical Service & Redundancy */}
            {step === 2 && (
              <form id="drawer-form-2" onSubmit={handleNextStep2} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 leading-relaxed">
                  {isEn
                    ? 'Linking this asset to a critical service enables AssetFlow to automatically calculate smart priority scores for all upcoming work orders.'
                    : 'ربط الأصل بخدمة حرجة يمكّن AssetFlow من احتساب أولوية أوامر العمل تلقائيًا عند حدوث أي عطل.'}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                    {isEn ? 'Linked Critical Service' : 'الخدمة الحرجة المرتبطة'}
                  </label>
                  <select
                    value={criticalServiceId}
                    onChange={(e) => setCriticalServiceId(e.target.value)}
                    className={`w-full h-11 px-3 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none ${
                      isEn ? 'text-left' : 'text-right'
                    }`}
                  >
                    <option value="">{isEn ? '-- No Critical Service Linked --' : '-- بدون ربط بخدمة حرجة --'}</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {isEn ? (s.nameEn || s.name) : s.name} ({isEn ? (s.siteNameEn || s.siteName) : s.siteName})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-[#0B1222] border border-[#1E2A44] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {isEn ? 'Is there a redundant standby unit? (Redundancy)' : 'هل يوجد أصل بديل احتياطي؟ (Redundancy)'}
                      </div>
                      <div className="text-[11px] text-[#8696AE]">
                        {isEn
                          ? 'Without a standby backup, work order priority escalates immediately upon failure'
                          : 'إذا لم يتوفر بديل، ترتفع أولوية الصيانة فورًا عند التعطل'}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={hasBackup}
                      onChange={(e) => setHasBackup(e.target.checked)}
                      className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                    />
                  </div>

                  {hasBackup && (
                    <div>
                      <label className="block text-xs font-semibold text-[#C3CEDF] mb-1">
                        {isEn ? 'Select Standby Backup Asset' : 'اختر الأصل البديل المناوب'}
                      </label>
                      <select
                        value={backupAssetId}
                        onChange={(e) => setBackupAssetId(e.target.value)}
                        className={`w-full h-10 px-3 rounded-lg bg-[#16213A] border border-[#26324A] text-white text-xs ${
                          isEn ? 'text-left' : 'text-right'
                        }`}
                      >
                        <option value="">{isEn ? 'Select from registered assets...' : 'اختر من الأصول المسجلة...'}</option>
                        {assets.map((a) => (
                          <option key={a.id} value={a.id}>
                            {isEn ? (a.nameEn || a.name) : a.name} ({a.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </form>
            )}

            {/* Step 3: Specifications & Warranty */}
            {step === 3 && (
              <form id="drawer-form-3" onSubmit={handleFinalSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                      {isEn ? 'Manufacturer' : 'الشركة المصنعة'}
                    </label>
                    <input
                      type="text"
                      value={manufacturer}
                      onChange={(e) => setManufacturer(e.target.value)}
                      placeholder="Grundfos / Siemens"
                      className={`w-full h-11 px-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm ${
                        isEn ? 'text-left' : 'text-right'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                      {isEn ? 'Model / Series' : 'الموديل أو الطراز'}
                    </label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="CR-95 45kW"
                      className={`w-full h-11 px-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm ${
                        isEn ? 'text-left' : 'text-right'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                      {isEn ? 'Power Rating' : 'القدرة الكهربائية / الحركية'}
                    </label>
                    <input
                      type="text"
                      value={powerRating}
                      onChange={(e) => setPowerRating(e.target.value)}
                      placeholder="45 kW · 380V"
                      className="w-full h-11 px-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                      {isEn ? 'Capacity / Flow' : 'السعة أو التدفق'}
                    </label>
                    <input
                      type="text"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="120 m³/h @ 16 bar"
                      className="w-full h-11 px-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                    {isEn ? 'Precise Location within Facility' : 'الموقع التفصيلي الدقيق داخل المنشأة'}
                  </label>
                  <input
                    type="text"
                    value={locationDetails}
                    onChange={(e) => setLocationDetails(e.target.value)}
                    placeholder={isEn ? 'Pumping Hall #2 — North Discharge Header' : 'عنبر الضخ رقم 2 — خط الطرد الشمالي'}
                    className={`w-full h-11 px-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm ${
                      isEn ? 'text-left' : 'text-right'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                    {isEn ? 'Warranty Expiry Date' : 'تاريخ انتهاء الضمان'}
                  </label>
                  <input
                    type="date"
                    value={warrantyExpiry}
                    onChange={(e) => setWarrantyExpiry(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm mono"
                  />
                </div>
              </form>
            )}
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-5 sm:p-6 border-t border-[#1A2440] bg-[#0B1222] flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as 1 | 2)}
                className="h-11 px-5 rounded-xl border border-[#26324A] bg-[#0F1729] text-white font-semibold text-xs hover:bg-[#16213A] transition-colors flex items-center gap-2 cursor-pointer"
              >
                {isEn ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
                <span>{isEn ? 'Previous Step' : 'الخطوة السابقة'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="h-11 px-5 rounded-xl border border-[#26324A] bg-[#0F1729] text-[#8696AE] font-semibold text-xs hover:text-white transition-colors cursor-pointer"
              >
                {isEn ? 'Cancel' : 'إلغاء'}
              </button>
            )}

            {step < 3 ? (
              <button
                type="submit"
                form={`drawer-form-${step}`}
                className="h-11 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-xs hover:brightness-110 shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{isEn ? `Continue to Step ${step + 1}` : `المتابعة للخطوة ${step + 1}`}</span>
                {isEn ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
              </button>
            ) : (
              <button
                type="submit"
                form="drawer-form-3"
                className="h-11 px-8 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs hover:brightness-110 shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check size={16} />
                <span>{isEn ? 'Save Asset' : 'حفظ الأصل نهائيًا'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
