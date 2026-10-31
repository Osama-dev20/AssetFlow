import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Plus, Phone, User, MapPin, Box, ShieldAlert, X } from 'lucide-react';

export const SitesPage: React.FC = () => {
  const { sites, addSite, setCurrentPage, language, showToast } = useApp();
  const isEn = language === 'en';
  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState(isEn ? 'Water & Infrastructure Plant' : 'محطة مياه وبنية تحتية');
  const [location, setLocation] = useState('');
  const [managerName, setManagerName] = useState('');
  const [contactPhone, setContactPhone] = useState('+970 599 ');

  const handleCreateSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location) return;

    addSite({
      name,
      nameEn: name,
      type,
      typeEn: type,
      location,
      locationEn: location,
      managerName: managerName || (isEn ? 'Site Supervisor' : 'مدير الموقع'),
      managerNameEn: managerName || 'Site Supervisor',
      contactPhone: contactPhone || '+970 599 000 000'
    });

    showToast(
      isEn ? 'Facility Added Successfully' : 'تم إضافة المنشأة بنجاح',
      isEn ? `${name} registered into network` : `تم تسجيل ${name} في المنظومة`,
      'success'
    );

    setName('');
    setLocation('');
    setIsAddSiteOpen(false);
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full ${isEn ? 'text-left font-sans' : 'text-right font-arabic'}`}>
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {isEn ? 'Sites & Critical Facilities' : 'المواقع والمنشآت الحيوية'}
          </h1>
          <p className="text-xs sm:text-sm text-[#A3B1C6] mt-1">
            {isEn 
              ? 'Manage geographic facilities, pumping stations, hospitals, and industrial hubs.' 
              : 'إدارة كافة المرافق الجغرافية، محطات الضخ، المستشفيات، والمجمعات الصناعية.'}
          </p>
        </div>

        <button
          onClick={() => setIsAddSiteOpen(true)}
          className="h-11 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 text-white font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} />
          <span>{isEn ? 'Add Site or Facility' : 'إضافة منشأة أو موقع'}</span>
        </button>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sites.map((site) => (
          <div
            key={site.id}
            className="p-6 rounded-2xl bg-[#0F1729] border border-[#1E2A44] hover:border-blue-500/40 transition-all flex flex-col justify-between gap-5 card-glow"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-400 font-semibold bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                  {isEn ? (site.typeEn || site.type) : site.type}
                </span>

                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  site.status === 'normal' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${site.status === 'normal' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  {site.status === 'normal' 
                    ? (isEn ? 'Operational / Normal' : 'حالة طبيعية') 
                    : (isEn ? 'Maintenance Warning' : 'تنبيه صيانة')}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  {isEn ? (site.nameEn || site.name) : site.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-[#8696AE] mt-1">
                  <MapPin size={14} className="text-teal-400" />
                  <span>{isEn ? (site.locationEn || site.location) : site.location}</span>
                </div>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#0B1222] border border-[#1A2440]">
                  <div className="text-xs text-[#8696AE]">{isEn ? 'Registered Assets:' : 'الأصول المسجلة:'}</div>
                  <div className="text-xl font-bold text-white mono mt-0.5">
                    {site.totalAssets} {isEn ? 'assets' : 'أصول'}
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-0.5">
                    {site.operationalAssets} {isEn ? 'operational' : 'عاملة بكفاءة'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0B1222] border border-[#1A2440]">
                  <div className="text-xs text-[#8696AE]">{isEn ? 'Critical Services:' : 'الخدمات الحرجة:'}</div>
                  <div className="text-xl font-bold text-white mono mt-0.5">
                    {site.criticalServicesCount} {isEn ? 'services' : 'خدمات'}
                  </div>
                  <div className="text-[11px] text-blue-400 mt-0.5">
                    {isEn ? 'Linked to platform' : 'مرتبطة بالنظام'}
                  </div>
                </div>
              </div>
            </div>

            {/* Manager info */}
            <div className="pt-4 border-t border-[#1E2A44] flex items-center justify-between text-xs text-[#A3B1C6]">
              <div className="flex items-center gap-2">
                <User size={15} className="text-blue-400" />
                <span>
                  {isEn ? 'Supervisor: ' : 'المشرف: '}
                  <strong className="text-white">
                    {isEn ? (site.managerNameEn || site.managerName) : site.managerName}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-1 text-[#8696AE] mono">
                <Phone size={13} />
                <span>{site.contactPhone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD SITE MODAL */}
      {isAddSiteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#03060E]/80 backdrop-blur-md">
          <div className={`w-full max-w-md bg-[#0F1729] border border-[#26324A] rounded-2xl p-6 shadow-2xl ${isEn ? 'text-left font-sans' : 'text-right font-arabic'} space-y-5 animate-slide-up`}>
            <div className="flex items-center justify-between pb-2 border-b border-[#1E2A44]">
              <h3 className="font-bold text-lg text-white">
                {isEn ? 'Add New Facility / Site' : 'إضافة موقع أو منشأة جديدة'}
              </h3>
              <button onClick={() => setIsAddSiteOpen(false)} className="text-[#8696AE] hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSite} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                  {isEn ? 'Facility or Site Name *' : 'اسم المنشأة أو الموقع *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isEn ? 'e.g. Sarra Pumping Station' : 'مثال: محطة ضخ مياه صرة والقرى الغربية'}
                  className={`w-full h-11 px-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none ${isEn ? 'text-left' : 'text-right'}`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                  {isEn ? 'Facility Type' : 'نوع المنشأة'}
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={`w-full h-11 px-3 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none ${isEn ? 'text-left' : 'text-right'} cursor-pointer`}
                >
                  <option value={isEn ? "Water & Infrastructure" : "محطة مياه وبنية تحتية"}>
                    {isEn ? 'Water & Infrastructure Plant' : 'محطة مياه وبنية تحتية'}
                  </option>
                  <option value={isEn ? "Healthcare & Clinical" : "منشأة صحية ورعاية طبية"}>
                    {isEn ? 'Healthcare & Clinical Facility' : 'منشأة صحية ورعاية طبية'}
                  </option>
                  <option value={isEn ? "Industrial & Logistics" : "مجمع صناعي ولوجستي"}>
                    {isEn ? 'Industrial & Logistics Park' : 'مجمع صناعي ولوجستي'}
                  </option>
                  <option value={isEn ? "Supply & Warehouse" : "مستودع إمداد وتخزين"}>
                    {isEn ? 'Supply & Warehouse Depot' : 'مستودع إمداد وتخزين'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                  {isEn ? 'Geographic Location / Address *' : 'العنوان الجغرافي التفصيلي *'}
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={isEn ? 'e.g. Nablus — West Bypass Road' : 'مثال: نابلس — الشارع الالتفافي الغربي'}
                  className={`w-full h-11 px-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none ${isEn ? 'text-left' : 'text-right'}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                    {isEn ? 'Supervisor Name' : 'اسم المشرف المسئول'}
                  </label>
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder={isEn ? 'Eng. Ahmed Sobhi' : 'م. أحمد صبحي'}
                    className={`w-full h-11 px-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm ${isEn ? 'text-left' : 'text-right'}`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                    {isEn ? 'Emergency Phone' : 'هاتف الطوارئ'}
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className={`w-full h-11 px-3.5 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm ${isEn ? 'text-left' : 'text-right'} mono`}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-xs hover:brightness-110 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  {isEn ? 'Save Facility' : 'حفظ الموقع'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddSiteOpen(false)}
                  className="h-11 px-4 rounded-xl border border-[#26324A] bg-[#16213A] text-[#A3B1C6] text-xs font-semibold cursor-pointer"
                >
                  {isEn ? 'Cancel' : 'إلغاء'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
