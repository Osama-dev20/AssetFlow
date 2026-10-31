import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sliders, Building, Bell, Save, RotateCcw } from 'lucide-react';
import { initialPriorityWeights } from '../data/mockData';

export const SettingsPage: React.FC = () => {
  const { priorityWeights, updatePriorityWeights, showToast, language } = useApp();
  const isEn = language === 'en';

  const [activeTab, setActiveTab] = useState<'priority' | 'facility' | 'notifs'>('priority');

  // Sliders state
  const [weights, setWeights] = useState(priorityWeights);

  // Facility state
  const [facilityName, setFacilityName] = useState(isEn ? 'Nablus Water Authority' : 'مياه نابلس');
  const [currency, setCurrency] = useState('USD ($)');
  const [timezone, setTimezone] = useState('Jerusalem (GMT+3)');

  // Notifs state
  const [notifCriticalService, setNotifCriticalService] = useState(true);
  const [notifSlaBreach, setNotifSlaBreach] = useState(true);
  const [notifPmReminder, setNotifPmReminder] = useState(true);

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    updatePriorityWeights(weights);
    showToast(
      isEn ? 'Weights saved successfully' : 'تم حفظ وتطبيق الأوزان',
      isEn ? 'Smart priority model updated across all work orders' : 'تم تحديث نموذج الأولوية الذكي لكافة أوامر العمل',
      'success'
    );
  };

  const handleResetWeights = () => {
    setWeights(initialPriorityWeights);
    updatePriorityWeights(initialPriorityWeights);
    showToast(
      isEn ? 'Default weights restored' : 'تمت استعادة الأوزان الافتراضية',
      isEn ? 'Priority model reset to benchmark values' : 'تمت إعادة ضبط نموذج الأولوية للقيم المعيارية',
      'info'
    );
  };

  // Sample calculated score with current sliders
  const sampleScore = weights.serviceImpact + weights.noBackup + weights.slaDelay + weights.failureRate;

  return (
    <div className={`p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full ${
      isEn ? 'text-left font-sans' : 'text-right font-arabic'
    }`}>
      {/* Header */}
      <div className="pb-2 border-b border-[#1E2A44]">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {isEn ? 'System Settings & Priority Model' : 'إعدادات المنظومة ونموذج الأولوية'}
        </h1>
        <p className="text-xs sm:text-sm text-[#A3B1C6] mt-1">
          {isEn
            ? 'Customize smart priority formula weights, facility profile, and real-time alert preferences.'
            : 'تخصيص أوزان معادلة الأولوية الذكية، بيانات المنشأة، وتفضيلات التنبيهات الفورية.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold flex-wrap">
        <button
          onClick={() => setActiveTab('priority')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'priority' ? 'bg-[#1E2A44] text-white shadow-md' : 'text-[#8696AE] hover:text-white'
          }`}
        >
          <Sliders size={16} />
          <span>{isEn ? 'Priority Model Weights' : 'أوزان نموذج الأولوية'}</span>
        </button>

        <button
          onClick={() => setActiveTab('facility')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'facility' ? 'bg-[#1E2A44] text-white shadow-md' : 'text-[#8696AE] hover:text-white'
          }`}
        >
          <Building size={16} />
          <span>{isEn ? 'Facility Profile' : 'بيانات المنشأة'}</span>
        </button>

        <button
          onClick={() => setActiveTab('notifs')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'notifs' ? 'bg-[#1E2A44] text-white shadow-md' : 'text-[#8696AE] hover:text-white'
          }`}
        >
          <Bell size={16} />
          <span>{isEn ? 'Notifications & Alerts' : 'التنبيهات والإشعارات'}</span>
        </button>
      </div>

      {/* TAB 1: PRIORITY MODEL WEIGHTS */}
      {activeTab === 'priority' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sliders Form (Col 7) */}
          <form 
            onSubmit={handleSaveWeights} 
            className="lg:col-span-7 p-6 sm:p-7 rounded-2xl bg-[#0F1729] border border-[#1E2A44] space-y-6"
          >
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEn ? 'Smart Priority Factor Weights' : 'أوزان عوامل الأولوية الذكية'}
              </h2>
              <p className="text-xs text-[#8696AE] mt-1 leading-relaxed">
                {isEn
                  ? 'How many points each factor adds to the work order score. Priority is always transparent and explainable to every technician and manager.'
                  : 'كم نقطة يضيف كل عامل إلى أولوية أمر العمل. الأولوية دائمًا قابلة للتفسير: يرى كل فني ومهندس سببها الدقيق.'}
              </p>
            </div>

            {/* Slider 1: Service Impact */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="font-semibold text-white">
                  {isEn ? 'Critical Service Impact (Service Impact)' : 'أثر الخدمة الحرجة (Service Impact)'}
                </label>
                <span className="mono font-bold text-blue-400">+{weights.serviceImpact}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={weights.serviceImpact}
                onChange={(e) => setWeights({ ...weights, serviceImpact: Number(e.target.value) })}
                className="w-full accent-blue-600 bg-[#16213A] rounded-lg h-2 cursor-pointer"
              />
              <div className="text-[11px] text-[#8696AE]">
                {isEn
                  ? 'Largest factor: What vital utility stops if this asset is down? (Water, oxygen, power)'
                  : 'أكبر عامل: ما الذي يتوقف إذا لم يُصلح الأصل؟ (مياه، أكسجين، طاقة)'}
              </div>
            </div>

            {/* Slider 2: No Backup */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="font-semibold text-white">
                  {isEn ? 'No Redundancy Backup (No Redundancy)' : 'غياب البديل الاحتياطي (No Redundancy)'}
                </label>
                <span className="mono font-bold text-teal-400">+{weights.noBackup}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={weights.noBackup}
                onChange={(e) => setWeights({ ...weights, noBackup: Number(e.target.value) })}
                className="w-full accent-teal-500 bg-[#16213A] rounded-lg h-2 cursor-pointer"
              />
              <div className="text-[11px] text-[#8696AE]">
                {isEn
                  ? 'Applied when the critical service runs on a single unit without a standby backup.'
                  : 'يُضاف عندما تعمل الخدمة على أصل واحد بلا احتياط أو مناوب.'}
              </div>
            </div>

            {/* Slider 3: SLA Delay */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="font-semibold text-white">
                  {isEn ? 'SLA Response Delay (SLA Delay)' : 'التأخر عن مهلة الاستجابة (SLA Delay)'}
                </label>
                <span className="mono font-bold text-amber-400">+{weights.slaDelay}</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={weights.slaDelay}
                onChange={(e) => setWeights({ ...weights, slaDelay: Number(e.target.value) })}
                className="w-full accent-amber-500 bg-[#16213A] rounded-lg h-2 cursor-pointer"
              />
              <div className="text-[11px] text-[#8696AE]">
                {isEn
                  ? 'Escalation factor that compounds automatically with each overdue hour past SLA window.'
                  : 'عامل تصاعدي يزيد تلقائيًا مع كل ساعة تأخير إضافية عن موعد الاستجابة.'}
              </div>
            </div>

            {/* Slider 4: Failure Recurrence */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <label className="font-semibold text-white">
                  {isEn ? 'Failure Recurrence History (Failure History)' : 'تكرار الأعطال السابقة (Failure History)'}
                </label>
                <span className="mono font-bold text-purple-400">+{weights.failureRate}</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={weights.failureRate}
                onChange={(e) => setWeights({ ...weights, failureRate: Number(e.target.value) })}
                className="w-full accent-purple-500 bg-[#16213A] rounded-lg h-2 cursor-pointer"
              />
              <div className="text-[11px] text-[#8696AE]">
                {isEn
                  ? 'Repeated failures of the same machine within the last 90 days indicates chronic degradation.'
                  : 'تكرار عطل نفس المعدة في آخر 90 يومًا يدل على مشكلة جذرية كامنة.'}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-[#1E2A44]">
              <button
                type="submit"
                className="h-11 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-xs hover:brightness-110 shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save size={16} />
                <span>{isEn ? 'Save & Apply Weights' : 'حفظ وتطبيق الأوزان'}</span>
              </button>
              <button
                type="button"
                onClick={handleResetWeights}
                className="h-11 px-4 rounded-xl border border-[#26324A] bg-[#16213A] text-[#A3B1C6] hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>{isEn ? 'Reset Defaults' : 'القيم الافتراضية'}</span>
              </button>
            </div>
          </form>

          {/* Live Preview & SLA Thresholds Card (Col 5) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Live Formula Preview Box */}
            <div className="p-6 rounded-2xl bg-[#0F1729] border border-[#26324A] space-y-4 text-center">
              <div className="text-xs font-bold text-[#8696AE]">
                {isEn
                  ? 'Live preview on sample failure (Water pump without backup)'
                  : 'معاينة حية على عطل نموذجي (مضخة مياه بلا بديل)'}
              </div>
              
              <div className="p-4 rounded-xl bg-[#0B1222] border border-[#1A2440] flex items-center justify-between">
                <span className="text-xs text-[#A3B1C6]">{isEn ? 'Calculated Total:' : 'المجموع المحسوب:'}</span>
                <span className="text-3xl font-extrabold text-rose-400 mono">{sampleScore} / 100</span>
              </div>

              <div className={`text-xs font-bold px-3 py-1.5 rounded-lg inline-block ${
                sampleScore >= weights.criticalThreshold ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {sampleScore >= weights.criticalThreshold
                  ? (isEn ? 'Rating: Critical (4h response SLA)' : 'تصنيف: حرجة جدًا (استجابة 4 ساعات)')
                  : (isEn ? 'Rating: High (24h response SLA)' : 'تصنيف: عالية (استجابة 24 ساعة)')}
              </div>
            </div>

            {/* SLA Thresholds Settings */}
            <div className="p-6 rounded-2xl bg-[#0F1729] border border-[#1E2A44] space-y-3">
              <h3 className="font-bold text-sm text-white border-b border-[#1E2A44] pb-2">
                {isEn ? 'Priority Thresholds & SLA Agreements' : 'عتبات الأولوية واتفاقية الاستجابة (SLA)'}
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#0B1222]">
                  <span className="text-rose-400 font-semibold">
                    {isEn ? 'Critical' : 'حرجة'} (≥ {weights.criticalThreshold})
                  </span>
                  <span className="text-white">
                    {isEn ? 'Response SLA: ' : 'مهلة الاستجابة: '}
                    <strong>{isEn ? '4 hours' : '4 ساعات'}</strong>
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#0B1222]">
                  <span className="text-amber-400 font-semibold">
                    {isEn ? 'High' : 'عالية'} (≥ {weights.highThreshold})
                  </span>
                  <span className="text-white">
                    {isEn ? 'Response SLA: ' : 'مهلة الاستجابة: '}
                    <strong>{isEn ? '24 hours' : '24 ساعة'}</strong>
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#0B1222]">
                  <span className="text-blue-400 font-semibold">
                    {isEn ? 'Medium' : 'متوسطة'} (≥ {weights.mediumThreshold})
                  </span>
                  <span className="text-white">
                    {isEn ? 'Response SLA: ' : 'مهلة الاستجابة: '}
                    <strong>{isEn ? '3 days' : '3 أيام'}</strong>
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#0B1222]">
                  <span className="text-[#8696AE] font-semibold">
                    {isEn ? 'Low' : 'منخفضة'} (&lt; {weights.mediumThreshold})
                  </span>
                  <span className="text-white">
                    {isEn ? 'Response SLA: ' : 'مهلة الاستجابة: '}
                    <strong>{isEn ? '7 days' : '7 أيام'}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FACILITY PROFILE */}
      {activeTab === 'facility' && (
        <div className="max-w-2xl bg-[#0F1729] border border-[#1E2A44] rounded-2xl p-6 sm:p-7 space-y-5">
          <h2 className="text-lg font-bold text-white border-b border-[#1E2A44] pb-2">
            {isEn ? 'Vital Facility Profile' : 'بيانات المنشأة الحيوية'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                {isEn ? 'Facility or Organization Name' : 'اسم المنشأة أو المؤسسة'}
              </label>
              <input
                type="text"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                className={`w-full h-11 px-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm ${
                  isEn ? 'text-left' : 'text-right'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                  {isEn ? 'Default Cost Currency' : 'العملة الافتراضية للتكاليف'}
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={`w-full h-11 px-3 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm ${
                    isEn ? 'text-left' : 'text-right'
                  }`}
                >
                  <option value="USD ($)">{isEn ? 'US Dollar ($ USD)' : 'الدولار الأمريكي ($ USD)'}</option>
                  <option value="ILS (₪)">{isEn ? 'Israeli Shekel (₪ ILS)' : 'الشيكل (₪ ILS)'}</option>
                  <option value="JOD (JD)">{isEn ? 'Jordanian Dinar (JOD)' : 'الدينار الأردني (JOD)'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                  {isEn ? 'Timezone' : 'المنطقة الزمنية'}
                </label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className={`w-full h-11 px-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm mono ${
                    isEn ? 'text-left' : 'text-right'
                  }`}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => showToast(isEn ? 'Facility profile saved' : 'تم حفظ بيانات المنشأة', '', 'success')}
            className="h-11 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-xs hover:brightness-110 shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save size={16} />
            <span>{isEn ? 'Save Profile Changes' : 'حفظ التعديلات'}</span>
          </button>
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS */}
      {activeTab === 'notifs' && (
        <div className="max-w-2xl bg-[#0F1729] border border-[#1E2A44] rounded-2xl p-6 sm:p-7 space-y-5">
          <h2 className="text-lg font-bold text-white border-b border-[#1E2A44] pb-2">
            {isEn ? 'Notification & Alert Preferences' : 'تفضيلات الإشعارات والتنبيهات'}
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 rounded-xl bg-[#0B1222] border border-[#1A2440] cursor-pointer">
              <div>
                <div className="text-sm font-semibold text-white">
                  {isEn ? 'Instant Alert for Critical Service Risk' : 'تنبيه فوري لتعطل خدمة حرجة'}
                </div>
                <div className="text-xs text-[#8696AE]">
                  {isEn
                    ? 'Direct notification when any service transitions to single-point-of-failure (no backup)'
                    : 'إشعار مباشر عند تحول أي خدمة إلى الحالة المعرّضة (بلا بديل)'}
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifCriticalService}
                onChange={(e) => setNotifCriticalService(e.target.checked)}
                className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl bg-[#0B1222] border border-[#1A2440] cursor-pointer">
              <div>
                <div className="text-sm font-semibold text-white">
                  {isEn ? 'SLA Breach Overdue Alert' : 'تنبيه تجاوز مهلة اتفاقية الاستجابة (SLA Breach)'}
                </div>
                <div className="text-xs text-[#8696AE]">
                  {isEn
                    ? 'Notify management team whenever a work order exceeds its SLA target window'
                    : 'إشعار الإدارة فور تأخر أي أمر عمل عن الساعات المحددة له'}
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifSlaBreach}
                onChange={(e) => setNotifSlaBreach(e.target.checked)}
                className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl bg-[#0B1222] border border-[#1A2440] cursor-pointer">
              <div>
                <div className="text-sm font-semibold text-white">
                  {isEn ? 'Weekly Preventive Maintenance Reminder' : 'تذكير الصيانة الوقائية الأسبوعية'}
                </div>
                <div className="text-xs text-[#8696AE]">
                  {isEn
                    ? 'Send upcoming scheduled maintenance tasks to assigned technicians every Monday'
                    : 'إرسال جدول المهام المجدولة للفنيين كل صباح إثنين'}
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifPmReminder}
                onChange={(e) => setNotifPmReminder(e.target.checked)}
                className="w-5 h-5 accent-teal-500 rounded cursor-pointer"
              />
            </label>
          </div>

          <button
            onClick={() => showToast(isEn ? 'Notification settings saved' : 'تم حفظ إعدادات الإشعارات', '', 'success')}
            className="h-11 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-xs hover:brightness-110 shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save size={16} />
            <span>{isEn ? 'Save Alert Preferences' : 'حفظ إعدادات التنبيه'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
