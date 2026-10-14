import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useMockStore } from '../../data/mockStore';
import {
  User,
  Building2,
  Shield,
  KeyRound,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  Globe,
  Mail,
  Phone,
  Layers,
  Sparkles,
  ExternalLink,
  Lock,
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
  nameEn: string;
  sector: string;
  sectorAr: string;
  code: string;
  sitesCount: number;
  assetsCount: number;
  contactEmail: string;
  status: 'active' | 'pending';
}

const INITIAL_COMPANIES: Company[] = [
  {
    id: 'COMP-01',
    name: 'مجموعة الملك فهد الطبية التخصصية',
    nameEn: 'King Fahd Specialist Medical Group',
    sector: 'Healthcare',
    sectorAr: 'الرعاية الصحية والمستشفيات',
    code: 'KF-MED-01',
    sitesCount: 4,
    assetsCount: 1420,
    contactEmail: 'operations@kf-med.sa',
    status: 'active',
  },
  {
    id: 'COMP-02',
    name: 'شركة تحلية المياه وشبكات الضخ المركزية',
    nameEn: 'Desalination & Utilities Operations Co.',
    sector: 'Utilities',
    sectorAr: 'المرافق العامة والطاقة',
    code: 'SW-UTIL-02',
    sitesCount: 6,
    assetsCount: 2890,
    contactEmail: 'pumps@sw-water.io',
    status: 'active',
  },
  {
    id: 'COMP-03',
    name: 'الشركة الوطنية للصناعات الميكانيكية',
    nameEn: 'National Heavy Industrial Corp',
    sector: 'Industrial',
    sectorAr: 'المنشآت والمصانع الصناعية',
    code: 'NH-IND-03',
    sitesCount: 3,
    assetsCount: 1750,
    contactEmail: 'admin@nh-industrial.com',
    status: 'active',
  },
];

export const SettingsPage: React.FC = () => {
  const { language, currentUser, setCurrentUser, addToast } = useApp();
  const store = useMockStore();
  const isRTL = language === 'ar';

  const [activeTab, setActiveTab] = useState<'profile' | 'companies' | 'admins' | 'security'>('profile');

  // Profile Form States
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('+966 50 123 4567');
  const [orgName, setOrgName] = useState(currentUser?.organizationName || 'AssetFlow Enterprise');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Companies Management State
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanySector, setNewCompanySector] = useState('healthcare');
  const [newCompanyCode, setNewCompanyCode] = useState('');
  const [newCompanyEmail, setNewCompanyEmail] = useState('');

  // Add Admin State
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminDept, setNewAdminDept] = useState('');

  const users = store.getUsers();
  const adminsList = users.filter((u) => u.role === 'admin');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      addToast({
        type: 'error',
        title: isRTL ? 'بيانات ناقصة' : 'Missing Fields',
        description: isRTL ? 'الاسم الكامل والبريد الإلكتروني مطلوبان.' : 'Name and email are required.',
      });
      return;
    }

    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          fullName: fullName.trim(),
          email: email.trim(),
          organizationName: orgName.trim(),
        });
      }

      addToast({
        type: 'success',
        title: isRTL ? 'تم حفظ التعديلات بنجاح' : 'Settings Saved',
        description: isRTL
          ? 'تم تحديث بيانات الملف الشخصي والمنظمة بنجاح.'
          : 'Your account profile has been updated.',
      });
    }, 450);
  };

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;

    const sectorLabels: Record<string, string> = {
      healthcare: isRTL ? 'الرعاية الصحية والمستشفيات' : 'Healthcare',
      utilities: isRTL ? 'المرافق العامة والطاقة' : 'Utilities & Power',
      industrial: isRTL ? 'المنشآت والمصانع الصناعية' : 'Industrial Plants',
      education: isRTL ? 'الجامعات والمؤسسات التعليمية' : 'Higher Education',
    };

    const newComp: Company = {
      id: 'COMP-0' + (companies.length + 1),
      name: newCompanyName.trim(),
      nameEn: newCompanyName.trim(),
      sector: newCompanySector,
      sectorAr: sectorLabels[newCompanySector] || newCompanySector,
      code: newCompanyCode.trim() || 'ORG-' + Math.floor(100 + Math.random() * 900),
      sitesCount: 1,
      assetsCount: 0,
      contactEmail: newCompanyEmail.trim() || 'contact@' + newCompanyName.toLowerCase().replace(/\s+/g, '') + '.io',
      status: 'active',
    };

    setCompanies([newComp, ...companies]);
    setIsAddCompanyOpen(false);
    setNewCompanyName('');
    setNewCompanyCode('');
    setNewCompanyEmail('');

    addToast({
      type: 'success',
      title: isRTL ? 'تم تسجيل الشركة / المنشأة' : 'Company Added',
      description: isRTL
        ? `تمت إضافة منشأة "${newComp.name}" بنجاح إلى النظام.`
        : `Organization "${newComp.name}" registered successfully.`,
    });
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim()) return;

    store.addUser({
      fullName: newAdminName.trim(),
      email: newAdminEmail.trim(),
      role: 'admin',
      department: newAdminDept.trim() || (isRTL ? 'الإدارة العامة والعمليات' : 'Executive Operations'),
      status: 'active',
    });

    setIsAddAdminOpen(false);
    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminDept('');

    addToast({
      type: 'success',
      title: isRTL ? 'تم تعيين المدير بنجاح' : 'Admin Appointed',
      description: isRTL
        ? `تم منح صلاحيات الإدارة الكاملة لـ "${newAdminName}".`
        : `Admin access granted to "${newAdminName}".`,
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>{isRTL ? 'لوحة تحكم النظام والإعدادات' : 'System Administration Console'}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isRTL ? 'إعدادات المنشأة والحساب' : 'Enterprise & Profile Settings'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isRTL
              ? 'تعديل الملف الشخصي، إضافة الشركات والمنشآت التابعة، وتعيين وإدارة مدراء النظام.'
              : 'Edit user profile, manage multi-site enterprise organizations, and assign administrator roles.'}
          </p>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
        {/* Tab 1: Profile */}
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{isRTL ? 'الملف الشخصي والحساب' : 'My Profile & Account'}</span>
        </button>

        {/* Tab 2: Companies & Organizations */}
        <button
          type="button"
          onClick={() => setActiveTab('companies')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'companies'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{isRTL ? 'الشركات والمنشآت' : 'Companies & Organizations'}</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
            {companies.length}
          </span>
        </button>

        {/* Tab 3: Admins Management */}
        <button
          type="button"
          onClick={() => setActiveTab('admins')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'admins'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>{isRTL ? 'مدراء النظام (Admins)' : 'System Administrators'}</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
            {adminsList.length}
          </span>
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: PROFILE EDITING */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Profile Card Details */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-1">
              {isRTL ? 'تعديل بيانات الملف الشخصي' : 'Edit Personal Profile'}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              {isRTL ? 'تحديث الاسم، البريد الإلكتروني، ورقم الجوال المرتبط بحسابك.' : 'Keep your contact info and personal credentials up to date.'}
            </p>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isRTL ? 'الاسم الكامل' : 'Full Name'} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isRTL ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isRTL ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                {/* Organization */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isRTL ? 'المنظمة / الشركة التابع لها' : 'Organization'}
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#1D68BD] to-[#2EAF7D] shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all cursor-pointer flex items-center gap-2"
                >
                  {isSavingProfile ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isRTL ? 'حفظ تعديلات الملف الشخصي' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Security & Role Summary Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-white">
              {isRTL ? 'صلاحيات الحساب والأمان' : 'Account Role & Security'}
            </h3>

            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400">
                  {isRTL ? 'الدور المعتمد:' : 'Current Role:'}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {isRTL
                  ? 'تمتلك صلاحية الإدارة الكاملة للتحكم في الأصول، المستخدمين، والمواقع ومصفوفات الخدمة.'
                  : 'You have full administrative authority over assets, sites, matrix rules, and users.'}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{isRTL ? 'حالة الحساب' : 'Status'}</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'نشط ومفعل' : 'Active'}</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{isRTL ? 'بروتوكول التشفير' : 'Security'}</span>
                <span className="text-slate-200 font-mono">TLS 1.3 / ISO 55001</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPANIES & ORGANIZATIONS MANAGEMENT */}
      {activeTab === 'companies' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                {isRTL ? 'سجل الشركات والمنشآت المعتمدة' : 'Registered Companies & Organizations'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isRTL ? 'إدارة الكيانات المؤسسية، فروع المنشآت، وربطها بالمواقع والأصول.' : 'Multi-entity organization registry managing sites, assets, and operational contracts.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddCompanyOpen(true)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#1D68BD] to-[#2EAF7D] shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>{isRTL ? 'إضافة شركة / منشأة جديدة' : 'Add New Organization'}</span>
            </button>
          </div>

          {/* Companies Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((comp) => (
              <div
                key={comp.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {comp.status === 'active' ? (isRTL ? 'نشطة' : 'Active') : 'Pending'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {isRTL ? comp.name : comp.nameEn}
                  </h3>
                  <span className="text-xs text-blue-400 font-medium block mt-1">
                    {comp.sectorAr}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                    {comp.code} • {comp.contactEmail}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-800/40">
                    <span className="text-slate-400 block text-[10px]">{isRTL ? 'المواقع' : 'Sites'}</span>
                    <span className="font-bold text-white">{comp.sitesCount}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/40">
                    <span className="text-slate-400 block text-[10px]">{isRTL ? 'الأصول' : 'Assets'}</span>
                    <span className="font-bold text-emerald-400">{comp.assetsCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Company Modal Dialog */}
          {isAddCompanyOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-fade-in"
                onClick={() => setIsAddCompanyOpen(false)}
              />
              <div
                role="dialog"
                className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 animate-scale-up text-start select-none"
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 text-blue-400 flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {isRTL ? 'تسجيل شركة / منشأة جديدة' : 'Add New Organization'}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {isRTL ? 'إضافة كيان جديد وربطه بمنظومة إدارة الأصول' : 'Register a new enterprise entity into CMMS'}
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleAddCompany} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRTL ? 'اسم المنشأة / الشركة' : 'Company Name'} <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      placeholder={isRTL ? 'مثال: شركة الطاقة المتحدة' : 'e.g. United Energy Corp'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRTL ? 'القطاع التشغيلي' : 'Industry Sector'} <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={newCompanySector}
                      onChange={(e) => setNewCompanySector(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="healthcare">{isRTL ? 'الرعاية الصحية والمستشفيات' : 'Healthcare'}</option>
                      <option value="utilities">{isRTL ? 'المرافق العامة والطاقة' : 'Utilities & Power'}</option>
                      <option value="industrial">{isRTL ? 'المنشآت والمصانع الصناعية' : 'Industrial Plants'}</option>
                      <option value="education">{isRTL ? 'الجامعات والمؤسسات التعليمية' : 'Higher Education'}</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {isRTL ? 'كود المنظمة التعريفي' : 'Entity Code'}
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={newCompanyCode}
                        onChange={(e) => setNewCompanyCode(e.target.value)}
                        placeholder="ORG-500"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {isRTL ? 'البريد الإلكتروني للاتصال' : 'Contact Email'}
                      </label>
                      <input
                        type="email"
                        dir="ltr"
                        value={newCompanyEmail}
                        onChange={(e) => setNewCompanyEmail(e.target.value)}
                        placeholder="ops@company.sa"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsAddCompanyOpen(false)}
                      className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold"
                    >
                      {isRTL ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#1D68BD] to-[#2EAF7D]"
                    >
                      {isRTL ? 'حفظ وإضافة الشركة' : 'Add Company'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ADMINS MANAGEMENT */}
      {activeTab === 'admins' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                {isRTL ? 'مدراء النظام المعتمدون (Administrators)' : 'System Administrators Registry'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isRTL ? 'المسؤولون الحاصلون على صلاحية الإدارة الكاملة للتحكم في المنظومة.' : 'Authorized personnel with top-level root operational access.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddAdminOpen(true)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#1D68BD] to-[#2EAF7D] shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>{isRTL ? 'إضافة وتعيين مدير جديد' : 'Add New Admin'}</span>
            </button>
          </div>

          {/* Admins Table/List */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="divide-y divide-slate-800">
              {adminsList.map((adm) => (
                <div
                  key={adm.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-850/50 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600/15 border border-blue-500/25 text-blue-400 flex items-center justify-center font-extrabold text-sm">
                      {adm.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{adm.fullName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                          Admin
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono block mt-0.5">
                        {adm.email} • {adm.department || (isRTL ? 'الإدارة العامة' : 'Central Admin')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isRTL ? 'صلاحية عليا مفعلة' : 'Active Root Admin'}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Admin Modal */}
          {isAddAdminOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-fade-in"
                onClick={() => setIsAddAdminOpen(false)}
              />
              <div
                role="dialog"
                className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 animate-scale-up text-start select-none"
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 text-blue-400 flex items-center justify-center">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {isRTL ? 'تعيين مدير جديد للنظام' : 'Appoint New Administrator'}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {isRTL ? 'منح صلاحيات الإدارة الكاملة للتحكم في الأصول والعمليات' : 'Grant root access to manage operational workflows'}
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleAddAdmin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRTL ? 'اسم المدير الكامل' : 'Admin Full Name'} <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      placeholder={isRTL ? 'مثال: طارق منصور' : 'e.g. Tariq Mansour'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRTL ? 'البريد الإلكتروني المهني' : 'Work Email'} <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      dir="ltr"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="admin@assetflow.io"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {isRTL ? 'القسم / الإدارة التابع لها' : 'Department'}
                    </label>
                    <input
                      type="text"
                      value={newAdminDept}
                      onChange={(e) => setNewAdminDept(e.target.value)}
                      placeholder={isRTL ? 'إدارة التشغيل والصيانة المركزية' : 'Central Operations & CMMS'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsAddAdminOpen(false)}
                      className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold"
                    >
                      {isRTL ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#1D68BD] to-[#2EAF7D]"
                    >
                      {isRTL ? 'تأكيد تعيين المدير' : 'Confirm Admin'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
