import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  AlertTriangle, CheckCircle2, ArrowRight, ArrowLeft,
  Search, ShieldAlert, Sparkles, RefreshCw, X, Box, Check, HelpCircle
} from 'lucide-react';
import { soundManager } from '../lib/soundEffects';

export const ReportIssuePage: React.FC = () => {
  const { 
    assets, 
    createIssue, 
    language, 
    setCurrentPage, 
    setSelectedIssueId, 
    currentUser,
    showToast
  } = useApp();

  const isEn = language === 'en';

  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || '');
  const [description, setDescription] = useState<string>('');
  const [assetSearch, setAssetSearch] = useState<string>('');
  const [isAssetDropdownOpen, setIsAssetDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [simulatedError, setSimulatedError] = useState<'none' | '422' | 'network'>('none');
  const [createdIssueId, setCreatedIssueId] = useState<string | null>(null);
  const [createdIssueNumber, setCreatedIssueNumber] = useState<number | null>(null);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  const filteredAssets = assets.filter((a) => {
    if (!assetSearch.trim()) return true;
    const q = assetSearch.toLowerCase();
    return (a.name + (a.nameEn || '') + a.code + a.siteName).toLowerCase().includes(q);
  });

  const charCount = description.length;
  const isDescValid = charCount >= 10 && charCount <= 1000;
  const canSubmit = selectedAssetId && isDescValid && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    soundManager.playButtonClick();

    // Simulated network delay
    await new Promise((r) => setTimeout(r, 650));

    if (simulatedError === '422') {
      setIsSubmitting(false);
      showToast(
        isEn ? 'Validation error (422)' : 'خطأ في التحقق من البيانات (422)',
        isEn ? 'Please check input fields and retry' : 'الرجاء التحقق من الحقول والمحاولة مجدداً',
        'danger'
      );
      return;
    }

    if (simulatedError === 'network') {
      setIsSubmitting(false);
      showToast(
        isEn ? 'Network connection failure' : 'تعذّر الاتصال بالخادم (خطأ شبكة)',
        isEn ? 'Draft is preserved. Please click retry.' : 'تم الحفاظ على مسودتك بأمان. انقر لإعادة المحاولة.',
        'danger'
      );
      return;
    }

    const newIssue = createIssue({
      assetId: selectedAssetId,
      description: description.trim(),
      reporterName: currentUser.name
    });

    setIsSubmitting(false);
    setCreatedIssueId(newIssue.id);
    setCreatedIssueNumber(newIssue.number);
  };

  // SUCCESS SCREEN (MATCHING FIGMA 01-08)
  if (createdIssueId && createdIssueNumber) {
    return (
      <div className={`p-4 sm:p-8 max-w-2xl mx-auto my-8 ${isEn ? 'text-left' : 'text-right'}`}>
        <div className="p-8 rounded-3xl bg-[#0F1729] border border-emerald-500/30 shadow-2xl text-center flex flex-col items-center gap-5 relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center animate-scale-in">
            <CheckCircle2 size={36} />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
              {isEn ? 'Submitted Successfully' : 'تم استلام البلاغ بنجاح'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isEn ? `Report Reference #${createdIssueNumber}` : `رقم البلاغ المسجل: #${createdIssueNumber}`}
            </h2>
            <p className="text-xs sm:text-sm text-[#A3B1C6] mt-2 max-w-md mx-auto leading-relaxed">
              {isEn 
                ? 'Your fault report has been logged and sent to the facility maintenance director for AI triage and work order scheduling.' 
                : 'تم تسجيل بلاغك بنجاح وتحويله إلى مدير الصيانة للمراجعة وتشغيل التحليل الذكي للأعطال.'}
            </p>
          </div>

          <div className="w-full p-4 rounded-2xl bg-[#0A1020] border border-[#1A2440] text-xs space-y-2 text-right">
            <div className="flex justify-between items-center text-[#8696AE]">
              <span>{isEn ? 'Asset:' : 'المعدّة / الأصل:'}</span>
              <span className="font-bold text-white">{isEn ? (selectedAsset.nameEn || selectedAsset.name) : selectedAsset.name}</span>
            </div>
            <div className="flex justify-between items-center text-[#8696AE]">
              <span>{isEn ? 'Location:' : 'الموقع:'}</span>
              <span className="text-[#C3CEDF]">{isEn ? (selectedAsset.siteNameEn || selectedAsset.siteName) : selectedAsset.siteName}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full pt-2">
            <button
              onClick={() => {
                soundManager.playButtonClick();
                setSelectedIssueId(createdIssueId);
                setCurrentPage('issues');
              }}
              className="flex-1 min-w-[140px] h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isEn ? 'View Report Details' : 'عرض تفاصيل البلاغ'}</span>
              {isEn ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
            </button>

            <button
              onClick={() => {
                soundManager.playButtonClick();
                setCurrentPage('my-issues');
              }}
              className="flex-1 min-w-[140px] h-11 px-5 rounded-xl bg-[#16213A] hover:bg-[#1E2A44] border border-[#22304D] text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isEn ? 'My Reports' : 'سجل بلاغاتي'}</span>
            </button>

            <button
              onClick={() => {
                soundManager.playButtonClick();
                setDescription('');
                setCreatedIssueId(null);
                setCreatedIssueNumber(null);
                setSimulatedError('none');
              }}
              className="h-11 px-5 rounded-xl bg-[#16213A] hover:bg-[#1E2A44] border border-[#22304D] text-[#8696AE] hover:text-white font-bold text-xs transition-all cursor-pointer"
            >
              {isEn ? '+ Report Another' : '+ تسجيل بلاغ آخر'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 ${isEn ? 'text-left' : 'text-right'}`}>
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2A44]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8696AE] mb-1">
            <span 
              onClick={() => setCurrentPage(currentUser.role === 'reporter' ? 'my-issues' : 'dashboard')} 
              className="hover:text-blue-400 cursor-pointer transition-colors"
            >
              {currentUser.role === 'reporter' ? (isEn ? 'My Reports' : 'بلاغاتي') : (isEn ? 'Dashboard' : 'لوحة القيادة')}
            </span>
            <span>/</span>
            <span className="text-white font-medium">{isEn ? 'New Fault Report' : 'الإبلاغ عن عطل جديد'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span>{isEn ? 'Report a Fault or Breakdown' : 'الإبلاغ عن عطل أو توقف معدّة'}</span>
            
          </h1>
          <p className="text-xs sm:text-sm text-[#A3B1C6] mt-1">
            {isEn 
              ? 'Select the affected asset and enter symptoms in natural language. The system and AI triage will route it directly to the engineering team.' 
              : 'اختر الأصل واشرح ما لاحظته بكلماتك. سيتولى النظام تشخيص البلاغ وإسناده لفريق الصيانة.'}
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('my-issues')}
          className="h-10 px-4 rounded-xl bg-[#16213A] hover:bg-[#1E2A44] border border-[#22304D] text-xs font-bold text-[#C3CEDF] hover:text-white transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-center shrink-0"
        >
          <span>{isEn ? 'View My Reports' : 'استعراض بلاغاتي'}</span>
        </button>
      </div>

      {/* 2. SIMULATION CONTROLS BAR (FOR REVIEWERS) */}
      <div className="p-3.5 rounded-2xl bg-[#0F1729]/80 border border-[#22304D] flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold text-[#8696AE] flex items-center gap-1.5">
          <HelpCircle size={14} className="text-blue-400" />
          <span>{isEn ? 'Simulate Server Test Cases (Figma Spec):' : 'محاكاة حالات الاستجابة من الخادم (Figma Spec):'}</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSimulatedError('none');
              showToast(isEn ? 'Normal flow active (HTTP 201)' : 'الوضع الطبيعي نشط (استجابة 201 نجاح)', '', 'info');
            }}
            className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer transition-all ${
              simulatedError === 'none' 
                ? 'bg-blue-600 text-white' 
                : 'bg-[#16213A] text-[#8696AE] hover:text-white'
            }`}
          >
            {isEn ? 'Normal (201 Success)' : 'الوضع العادي (نجاح)'}
          </button>
          <button
            type="button"
            onClick={() => {
              setSimulatedError('422');
              showToast(isEn ? 'Simulating 422 Unprocessable' : 'تم تفعيل محاكاة رفض 422', isEn ? 'Server validation failure' : 'خطأ تحقق من حقول الإدخال', 'danger');
            }}
            className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer transition-all ${
              simulatedError === '422' 
                ? 'bg-rose-600 text-white' 
                : 'bg-[#16213A] text-[#8696AE] hover:text-white'
            }`}
          >
            {isEn ? 'Simulate 422' : 'محاكاة رفض 422'}
          </button>
          <button
            type="button"
            onClick={() => {
              setSimulatedError('network');
              showToast(isEn ? 'Simulating Network Error' : 'تم تفعيل محاكاة انقطاع الشبكة', isEn ? 'Retry banner will display' : 'سيظهر شريط إعادة المحاولة دون فقدان النص', 'danger');
            }}
            className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer transition-all ${
              simulatedError === 'network' 
                ? 'bg-amber-600 text-white' 
                : 'bg-[#16213A] text-[#8696AE] hover:text-white'
            }`}
          >
            {isEn ? 'Network Failure' : 'محاكاة فشل الشبكة'}
          </button>
        </div>
      </div>

      {/* 3. NETWORK ERROR WARNING BANNER */}
      {simulatedError === 'network' && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 flex items-center justify-between gap-3 text-xs text-rose-200">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} />
            </span>
            <div>
              <div className="font-bold text-white">{isEn ? 'Network Connectivity Issue' : 'تعذّر إرسال البلاغ بسبب انقطاع الاتصال'}</div>
              <div className="text-[11px] text-rose-300 mt-0.5">
                {isEn ? 'Draft is preserved. Please click retry once connection is restored.' : 'تم الحفاظ على مسودتك في المتصفح. اضغط إعادة المحاولة عند استقرار الشبكة.'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors shrink-0 cursor-pointer"
          >
            {isEn ? 'Retry' : 'إعادة المحاولة'}
          </button>
        </div>
      )}

      {/* 4. MAIN FORM CONTAINER */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-7 rounded-3xl bg-[#0F1729] border border-[#22304D] shadow-xl space-y-6">
        
        {/* FIELD 1: ASSET SELECTOR */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-white">
            {isEn ? '1. Select Affected Asset (Organization Assets Only)' : '1. اختيار الأصل / المعدّة (أصول المؤسسة فقط)'}
            <span className="text-rose-400 mr-1">*</span>
          </label>
          
          <div className="relative">
            {/* Selected asset pill display */}
            <div 
              onClick={() => setIsAssetDropdownOpen(!isAssetDropdownOpen)}
              className="p-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] hover:border-blue-500/50 transition-all flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                  <Box size={20} />
                </span>
                <div className="min-w-0">
                  <div className="font-bold text-white text-xs sm:text-sm truncate group-hover:text-blue-400 transition-colors">
                    {isEn ? (selectedAsset.nameEn || selectedAsset.name) : selectedAsset.name}
                  </div>
                  <div className="text-[11px] text-[#8696AE] flex items-center gap-2 mt-0.5">
                    <span className="mono text-blue-300 font-semibold">{selectedAsset.code}</span>
                    <span>·</span>
                    <span>{isEn ? (selectedAsset.siteNameEn || selectedAsset.siteName) : selectedAsset.siteName}</span>
                  </div>
                </div>
              </div>

              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg shrink-0">
                {isEn ? 'Change Asset' : 'تغيير المعدة'}
              </span>
            </div>

            {/* Dropdown with search */}
            {isAssetDropdownOpen && (
              <div className="absolute top-full mt-2 w-full p-3 rounded-2xl bg-[#0D1526]/98 backdrop-blur-xl border border-[#22304D] shadow-2xl z-30 space-y-2 animate-slide-up">
                <div className="relative">
                  <Search size={14} className={`absolute ${isEn ? 'left-3' : 'right-3'} top-2.5 text-[#8696AE]`} />
                  <input
                    type="text"
                    value={assetSearch}
                    onChange={(e) => setAssetSearch(e.target.value)}
                    placeholder={isEn ? 'Search assets by name or code...' : 'ابحث عن أصل بالاسم أو الكود...'}
                    className={`w-full h-9 ${isEn ? 'pl-9 pr-3' : 'pr-9 pl-3'} rounded-lg bg-[#070B16] border border-[#22304D] text-xs text-white placeholder-[#8696AE] focus:outline-none focus:border-blue-500`}
                    autoFocus
                  />
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1.5 pt-1">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => {
                        setSelectedAssetId(asset.id);
                        setIsAssetDropdownOpen(false);
                        soundManager.playButtonClick();
                      }}
                      className={`p-2.5 rounded-xl transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                        selectedAssetId === asset.id 
                          ? 'bg-blue-600/20 border border-blue-500/40' 
                          : 'hover:bg-[#16213A]'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-white truncate">
                          {isEn ? (asset.nameEn || asset.name) : asset.name}
                        </div>
                        <div className="text-[11px] text-[#8696AE] mono">{asset.code} · {isEn ? (asset.siteNameEn || asset.siteName) : asset.siteName}</div>
                      </div>
                      {selectedAssetId === asset.id && (
                        <Check size={16} className="text-blue-400 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Validation error for 422 simulation */}
          {simulatedError === '422' && (
            <p className="text-xs text-rose-400 font-semibold pt-1">
              {isEn ? 'Asset ID is invalid or does not belong to your organization.' : 'رمز الأصل غير صالح أو لا ينتمي إلى مؤسستك.'}
            </p>
          )}
        </div>

        {/* FIELD 2: DESCRIPTION TEXTAREA */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white">
              {isEn ? '2. Issue Description & Observed Symptoms' : '2. وصف العطل وما لاحظته بدقة'}
              <span className="text-rose-400 mr-1">*</span>
            </label>
            <span className={`text-[11px] mono font-semibold ${
              charCount < 10 
                ? 'text-[#8696AE]' 
                : (charCount > 1000 ? 'text-rose-400' : 'text-blue-400')
            }`}>
              {charCount} / 1000 {isEn ? 'chars' : 'حرف'} (الحد الأدنى 10)
            </span>
          </div>

          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={isEn 
              ? 'Describe what you saw or heard: e.g. unusual high-pitched noise, vibration, smoke, leakage, or sudden automated trip...'
              : 'اكتب ما رأيته أو سمعته: مثلاً اهتزاز غير طبيعي، تسريب مياه أو زيت، صوت طقطقة، انبعاث حرارة، أو توقف مفاجئ أثناء التشغيل...'}
            className="w-full p-4 rounded-2xl bg-[#0B1222] border border-[#26324A] text-white text-xs sm:text-sm placeholder-[#8696AE] focus:outline-none focus:border-blue-500 transition-colors leading-relaxed"
          />

          {charCount > 0 && charCount < 10 && (
            <p className="text-xs text-amber-400 font-medium">
              {isEn ? 'Please enter at least 10 characters to provide sufficient context for AI triage.' : 'يرجى كتابة 10 أحرف على الأقل لوصف العطل بشكل كافٍ للفحص الآلي.'}
            </p>
          )}
        </div>

        {/* TIPS BOX */}
        <div className="p-4 rounded-2xl bg-[#0A1020] border border-[#1A2440] space-y-1.5 text-xs text-[#8696AE]">
          <span className="font-bold text-white block mb-1">
            {isEn ? '💡 Tips for a high-quality fault report:' : '💡 نصائح لكتابة بلاغ عطل مفيد للفريق:'}
          </span>
          <p>• {isEn ? 'Double check the physical asset code on the QR label attached to the equipment.' : 'تأكد من كود الأصل الملصق على المعدّة قبل الإرسال.'}</p>
          <p>• {isEn ? 'Mention when the issue started and whether it is persistent or intermittent.' : 'اذكر متى بدأ العطل وهل يتكرر باستمرار أم يحدث على فترات متقطعة.'}</p>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setCurrentPage('my-issues')}
            className="h-11 px-5 rounded-xl border border-[#22304D] bg-[#0A1020] text-[#8696AE] hover:text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
          >
            {isEn ? 'Cancel' : 'إلغاء'}
          </button>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`h-11 px-7 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
              canSubmit
                ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 hover:brightness-110 text-white shadow-blue-600/30'
                : 'bg-[#16213A] text-[#8696AE] cursor-not-allowed opacity-60'
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={16} className="animate-spin text-white" />
                <span>{isEn ? 'Submitting...' : 'جاري الإرسال...'}</span>
              </>
            ) : (
              <>
                <AlertTriangle size={16} />
                <span>{isEn ? 'Submit Fault Report' : 'إرسال البلاغ الآن'}</span>
              </>
            )}
          </button>
        </div>
      </form>

    </div>
  );
};
