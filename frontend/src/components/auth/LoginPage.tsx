import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Eye,
  EyeOff,
  Globe,
  AlertCircle,
  Shield,
  Wrench,
  FileText,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  KeyRound,
  Building2,
} from 'lucide-react';
import { DEMO_ACCOUNTS } from '../../data/mockData';
import type { UserRole } from '../../types';
import { ShinyButton } from '../ui/shiny-button';
import { assets } from '../../assets/assets';

export const LoginPage: React.FC = () => {
  const { role: routeRole } = useParams<{ role?: string }>();
  const navigate = useNavigate();
  const {
    language,
    toggleLanguage,
    setCurrentUser,
    addToast,
    setIsForgotPasswordModalOpen,
    setIsSSOModalOpen,
  } = useApp();

  const isRTL = language === 'ar';

  // Determine active portal (admin | technician | reporter)
  const initialRole: UserRole =
    routeRole === 'technician' ? 'technician' : routeRole === 'reporter' ? 'reporter' : 'admin';

  const [activePortal, setActivePortal] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // 3D Card Interactive Tilt & Ambient Light Spotlight
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardTransform, setCardTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
  const [mousePos, setMousePos] = useState({ x: 260, y: 220 });
  const [isCardHovered, setIsCardHovered] = useState(false);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -3.2;
    const rotateY = ((x - centerX) / centerX) * 3.2;

    setCardTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`
    );
    setMousePos({ x, y });
    setIsCardHovered(true);
  };

  const handleCardMouseLeave = () => {
    setCardTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
    setIsCardHovered(false);
  };

  const portalConfigs: Record<
    UserRole,
    {
      titleAr: string;
      titleEn: string;
      subtitleAr: string;
      subtitleEn: string;
      badgeAr: string;
      badgeEn: string;
      icon: React.ElementType;
      badgeColor: string;
      account: typeof DEMO_ACCOUNTS[0];
    }
  > = {
    admin: {
      titleAr: 'بوابة الإدارة المركزية والعمليات',
      titleEn: 'Central Operations & Admin Portal',
      subtitleAr: 'صلاحيات كاملة لإدارة الأصول والمواقع والمستخدمين ومصفوفة الخدمات الحرجة.',
      subtitleEn: 'Full administrative access to sites, users, assets, and SLA matrices.',
      badgeAr: 'صلاحية عليا (Level 3 Admin)',
      badgeEn: 'Root Operations Authority',
      icon: Shield,
      badgeColor: 'bg-blue-600/15 text-blue-400 border-blue-500/30',
      account: DEMO_ACCOUNTS[0],
    },
    technician: {
      titleAr: 'بوابة فنيي الصيانة الميدانية',
      titleEn: 'Field Maintenance Technician Portal',
      subtitleAr: 'تنفيذ أوامر العمل، تسجيل قطع الغيار، وإجراء الفحوصات الفنية وقوائم التدقيق.',
      subtitleEn: 'Work order execution, PM inspections, and mobile spare parts tracking.',
      badgeAr: 'طواقم الصيانة الميدانية',
      badgeEn: 'Field Maintenance Crew',
      icon: Wrench,
      badgeColor: 'bg-amber-600/15 text-amber-400 border-amber-500/30',
      account: DEMO_ACCOUNTS[1],
    },
    reporter: {
      titleAr: 'بوابة موظفي التشغيل والبلاغات',
      titleEn: 'Operations Incident Reporting Portal',
      subtitleAr: 'تسجيل بلاغات الأعطال للأصول الحرجة ومتابعة مراحل المعالجة الميدانية.',
      subtitleEn: 'Incident logging, equipment defect reporting, and real-time status tracking.',
      badgeAr: 'مكتب البلاغات والتشغيل',
      badgeEn: 'Incident Dispatch Desk',
      icon: FileText,
      badgeColor: 'bg-emerald-600/15 text-emerald-400 border-emerald-500/30',
      account: DEMO_ACCOUNTS[2],
    },
  };

  const currentConfig = portalConfigs[activePortal];
  const IconComponent = currentConfig.icon;

  // Auto-fill inputs when portal switches
  useEffect(() => {
    setEmail(currentConfig.account.email);
    setPassword(currentConfig.account.password);
    setErrors({});
  }, [activePortal]);

  const handlePortalSwitch = (newRole: UserRole) => {
    setActivePortal(newRole);
    navigate(`/login/${newRole}`, { replace: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = isRTL ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email';
    }
    if (!password.trim()) {
      newErrors.password = isRTL ? 'يرجى إدخال كلمة المرور' : 'Please enter your password';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const acc = currentConfig.account;
      setCurrentUser({
        id: 'usr_' + activePortal,
        fullName: acc.name,
        email: email.trim(),
        role: activePortal,
        status: 'active',
        organizationName: acc.organization,
      });

      addToast({
        type: 'success',
        title: isRTL ? 'تم تسجيل الدخول بنجاح' : 'Signed in successfully',
        description: isRTL ? `مرحباً بك في ${currentConfig.titleAr}` : `Logged in as ${currentConfig.titleEn}`,
      });

      navigate('/dashboard');
    }, 450);
  };

  // Google Sign-In with official Google styling
  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const acc = currentConfig.account;
      setCurrentUser({
        id: 'usr_google_' + Date.now(),
        fullName: isRTL ? 'مستخدم معتمد عبر Google' : 'Google Verified User',
        email: 'user.google@assetflow.io',
        role: activePortal,
        status: 'active',
        organizationName: acc.organization || 'AssetFlow Enterprise',
      });

      addToast({
        type: 'success',
        title: isRTL ? 'تم تسجيل الدخول عبر Google بنجاح' : 'Signed in with Google',
        description: isRTL ? `تم الربط مع ${currentConfig.titleAr}` : `Connected to ${currentConfig.titleEn}`,
      });

      navigate('/dashboard');
    }, 550);
  };

  const handleInstantLogin = () => {
    const acc = currentConfig.account;
    setCurrentUser({
      id: 'usr_' + activePortal,
      fullName: acc.name,
      email: acc.email,
      role: activePortal,
      status: 'active',
      organizationName: acc.organization,
    });
    addToast({
      type: 'success',
      title: isRTL ? 'تم الدخول المباشر' : 'Instant Login Active',
      description: isRTL ? acc.roleTitleAr : acc.roleTitleEn,
    });
    navigate('/dashboard');
  };

  return (
    <div
      className="min-h-screen bg-[#070F1E] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Top Header Bar */}
      <header className="w-full border-b border-slate-800 bg-[#0B1528]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3" title="AssetFlow">
            <img
              src={assets.logoDarkTheme}
              alt="AssetFlow"
              className="h-8 sm:h-9 w-auto object-contain hover:scale-105 transition-transform"
            />
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/signup"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              {isRTL ? 'إنشاء حساب جديد' : 'Create Account'}
            </Link>

            <Link
              to="/"
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors hidden sm:block"
            >
              {isRTL ? 'الموقع التعريفي' : 'Landing Page'}
            </Link>

            <button
              onClick={toggleLanguage}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{isRTL ? 'English' : 'العربية'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center justify-center">
        {/* 1. Portal Switcher Navigation Tabs */}
        <div className="w-full max-w-xl mb-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
            {isRTL ? 'اختر بوابة تسجيل الدخول المخصصة لدورك الوظيفي:' : 'Select your authorized operational portal:'}
          </p>

          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
            {/* Admin Tab */}
            <button
              type="button"
              onClick={() => handlePortalSwitch('admin')}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePortal === 'admin'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Shield className="w-4 h-4 mb-1" />
              <span>{isRTL ? 'مدير المنظمة' : 'Administrator'}</span>
              <span className="text-[10px] opacity-75 font-normal">Admin</span>
            </button>

            {/* Technician Tab */}
            <button
              type="button"
              onClick={() => handlePortalSwitch('technician')}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePortal === 'technician'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Wrench className="w-4 h-4 mb-1" />
              <span>{isRTL ? 'فني صيانة' : 'Technician'}</span>
              <span className="text-[10px] opacity-75 font-normal">Field Ops</span>
            </button>

            {/* Reporter Tab */}
            <button
              type="button"
              onClick={() => handlePortalSwitch('reporter')}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePortal === 'reporter'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4 mb-1" />
              <span>{isRTL ? 'مبلّغ تشغيلي' : 'Incident Reporter'}</span>
              <span className="text-[10px] opacity-75 font-normal">Reporter</span>
            </button>
          </div>
        </div>

        {/* 2. Interactive 3D Floating Login Card */}
        <div
          ref={cardRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          style={{
            transform: cardTransform,
            transition: isCardHovered
              ? 'transform 0.12s ease-out'
              : 'transform 0.5s ease-out, box-shadow 0.5s ease-out',
            transformStyle: 'preserve-3d',
            boxShadow: isCardHovered
              ? '0 30px 70px -15px rgba(0, 0, 0, 0.7), 0 0 50px -10px rgba(29, 104, 189, 0.35)'
              : '0 20px 50px -15px rgba(0, 0, 0, 0.5), 0 0 30px -10px rgba(29, 104, 189, 0.15)',
          }}
          className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-9 shadow-2xl overflow-hidden text-start"
        >
          {/* Dynamic 3D Light Spotlight */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
            style={{
              opacity: isCardHovered ? 0.75 : 0.25,
              background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(29, 104, 189, 0.18), transparent 70%)`,
            }}
          />

          {/* Top Decorative Gradient Accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#1D68BD] via-[#38BDF8] to-[#2EAF7D]" />

          {/* Portal Title & Badge */}
          <div className="pb-6 border-b border-slate-800/80 mb-6">
            <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border ${currentConfig.badgeColor}`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {isRTL ? currentConfig.titleAr : currentConfig.titleEn}
                  </h2>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border tracking-wide ${currentConfig.badgeColor}`}
              >
                {isRTL ? currentConfig.badgeAr : currentConfig.badgeEn}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {isRTL ? currentConfig.subtitleAr : currentConfig.subtitleEn}
            </p>
          </div>

          {/* Google Sign-In with Official 4-Color SVG Button */}
          <div className="mb-6 space-y-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm shadow-md shadow-white/5 border border-slate-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isRTL ? 'تسجيل الدخول باستخدام جوجل' : 'Continue with Google'}</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <span className="relative px-3 bg-slate-900 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {isRTL ? 'أو المتابعة بالبيانات المعتمدة' : 'or continue with credentials'}
              </span>
            </div>
          </div>

          {/* Quick 1-Click Evaluation Login Pill */}
          <div className="mb-6 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/70 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-start">
              <span className="text-xs font-bold text-white block">
                {isRTL ? 'حساب تجريبي معتمد مسبقاً:' : 'Pre-configured Demo Account:'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono" dir="ltr">
                {currentConfig.account.email} • {currentConfig.account.name}
              </span>
            </div>

            <button
              type="button"
              onClick={handleInstantLogin}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#1D68BD] to-[#2EAF7D] shadow-md shadow-blue-600/20 hover:scale-102 transition-all cursor-pointer whitespace-nowrap"
            >
              {isRTL ? '⚡ الدخول الفوري بهذا الدور' : '⚡ One-Click Login'}
            </button>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRTL ? 'البريد الإلكتروني المهني' : 'Work Email'} <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@assetflow.io"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-rose-500 focus:ring-rose-500/30'
                    : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  {isRTL ? 'كلمة المرور' : 'Password'} <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordModalOpen(true)}
                  className="text-xs text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                >
                  {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all pe-10 ${
                    errors.password
                      ? 'border-rose-500 focus:ring-rose-500/30'
                      : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 pe-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <ShinyButton
                type="submit"
                disabled={isLoading}
                label={isRTL ? `تسجيل الدخول إلى ${currentConfig.titleAr}` : `Sign In to Portal`}
                fillColor="#0f172a"
                accentColor={
                  activePortal === 'technician'
                    ? '#d97706'
                    : activePortal === 'reporter'
                    ? '#059669'
                    : '#1d68bd'
                }
                accentSoftColor={
                  activePortal === 'technician'
                    ? '#f59e0b'
                    : activePortal === 'reporter'
                    ? '#10b981'
                    : '#2eaf7d'
                }
                className="w-full py-3.5 px-4 text-sm font-bold shadow-lg"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isRTL ? `تسجيل الدخول إلى ${currentConfig.titleAr}` : `Sign In to Portal`}</span>
                    {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </ShinyButton>
            </div>
          </form>

          {/* Enterprise SSO Option */}
          <div className="mt-4 pt-3 text-center">
            <button
              type="button"
              onClick={() => setIsSSOModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>{isRTL ? 'الدخول عبر نطاق المنشأة (SSO / SAML)' : 'Enterprise Single Sign-On (SSO)'}</span>
            </button>
          </div>

          {/* Compliance & Security Footer Notice */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400">
              {isRTL
                ? '🔒 اتصال مشفر عبر بروتوكول TLS 1.3 • معتمد لمعايير ISO 55001 لإدارة الأصول الصناعية.'
                : '🔒 Encrypted via TLS 1.3 • Certified ISO 55001 Enterprise Asset Management.'}
            </p>
          </div>
        </div>

        {/* Link to Signup */}
        <p className="mt-6 text-xs text-slate-400 text-center">
          {isRTL ? 'ليس لديك حساب منشأة بعد؟' : "Don't have an enterprise account yet?"}{' '}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-bold hover:underline">
            {isRTL ? 'إنشاء حساب جديد وتجربة المنظومة' : 'Create an Account & Start Free Trial'}
          </Link>
        </p>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800 bg-[#0B1528]/80 py-4 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AssetFlow Maintenance Management Platform &copy; 2026</span>
          <span className="text-[11px]">Secure Enterprise Single-Sign-On Available</span>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
