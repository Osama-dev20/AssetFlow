import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, CheckCircle2, Mail, Lock, Building, 
  User, Phone, Sparkles, ArrowRight, ShieldCheck, Check, KeyRound,
  Eye, EyeOff, Globe, Zap, Shield, Wrench, AlertTriangle
} from 'lucide-react';
import { soundManager } from '../lib/soundEffects';
import { OtpInput } from '../components/ui/otp-input';

export const AuthPages: React.FC<{ initialMode?: 'login' | 'signup' }> = ({ initialMode = 'login' }) => {
  const { 
    setCurrentPage, 
    setCurrentUser, 
    teamMembers, 
    showToast, 
    triggerCelebration, 
    language,
    setLanguage,
    switchRole
  } = useApp();
  
  const isEn = language === 'en';

  const [mode, setMode] = useState<'login' | 'forgot' | 'otp' | 'reset-password' | 'reset-done' | 'signup-1' | 'signup-2' | 'signup-done'>(
    initialMode === 'signup' ? 'signup-1' : 'login'
  );

  // Form states
  const [selectedDemoRole, setSelectedDemoRole] = useState<'admin' | 'technician' | 'reporter'>('admin');
  const [signupRole, setSignupRole] = useState<'admin' | 'technician' | 'reporter'>('admin');
  const [email, setEmail] = useState('admin@assetflow.io');
  const [password, setPassword] = useState('demo-pass-2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [orgName, setOrgName] = useState(isEn ? 'Nablus Water Utility' : 'مياه نابلس');
  const [facilityType, setFacilityType] = useState(isEn ? 'Water & Infrastructure' : 'مياه وبنية تحتية');
  const [fullName, setFullName] = useState(isEn ? 'Tariq Al-Nabulsi' : 'طارق النابلسي');
  const [phone, setPhone] = useState('+970 599 111 222');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playSuccess();
    triggerCelebration();

    if (email.toLowerCase().includes('tech') || selectedDemoRole === 'technician') {
      switchRole('technician');
    } else if (email.toLowerCase().includes('report') || selectedDemoRole === 'reporter') {
      switchRole('reporter');
    } else {
      switchRole('admin');
    }
  };

  const handleSocialLogin = (provider: 'Google' | 'Microsoft') => {
    soundManager.playSuccess();
    triggerCelebration();
    switchRole('admin');
    showToast(
      isEn ? `Signed in via ${provider}` : `تم تسجيل الدخول المباشر عبر ${provider}`, 
      isEn ? `Welcome Tariq Al-Nabulsi` : `مرحباً بك طارق النابلسي`, 
      'success'
    );
  };

  const handleQuickLogin = (memberId: string) => {
    soundManager.playSuccess();
    const member = teamMembers.find((m) => m.id === memberId) || teamMembers[0];
    setCurrentUser(member);
    showToast(
      isEn ? 'Quick Login Successful' : 'تم تسجيل الدخول السريع', 
      isEn ? `Active Account: ${member.nameEn || member.name} (${member.roleEn || member.role})` : `الحساب النشط: ${member.name} (${member.roleArabic})`, 
      'success'
    );
    if (member.role === 'technician') setCurrentPage('tech-portal');
    else if (member.role === 'reporter') setCurrentPage('issues-new');
    else setCurrentPage('dashboard');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playCardSwitch();
    setMode('otp');
    showToast(
      isEn ? 'Verification code sent' : 'تم إرسال رمز التحقق', 
      isEn ? 'Demo OTP code is: 849201' : 'رمز التحقق التجريبي هو: 849201', 
      'info'
    );
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otpCode.length === 6) {
      soundManager.playSuccess();
      setMode('reset-password');
      showToast(
        isEn ? 'Verified successfully' : 'تم التحقق بنجاح', 
        isEn ? 'Please enter your new password' : 'يرجى إدخال كلمة المرور الجديدة', 
        'success'
      );
    } else {
      setOtpError(isEn ? 'Please enter the full 6-digit code' : 'يرجى إدخال رمز التحقق المكون من 6 أرقام كاملاً');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast(
        isEn ? 'Password too short' : 'كلمة المرور قصيرة', 
        isEn ? 'Password must be at least 8 characters' : 'يجب أن تتكون كلمة المرور من 8 خانات على الأقل', 
        'danger'
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast(
        isEn ? 'Mismatch' : 'عدم تطابق', 
        isEn ? 'Passwords do not match' : 'كلمتا المرور غير متطابقتين', 
        'danger'
      );
      return;
    }
    soundManager.playSuccess();
    triggerCelebration();
    setMode('reset-done');
    showToast(
      isEn ? 'Updated successfully' : 'تم التحديث بنجاح', 
      isEn ? 'Your password has been changed' : 'تم تغيير كلمة المرور الخاصة بحسابك', 
      'success'
    );
  };

  const handleSignupStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playCardSwitch();
    setMode('signup-2');
  };

  const handleSignupStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playSuccess();
    setMode('signup-done');
    triggerCelebration();
  };

  if (mode === 'login') {
    return (
      <div 
        dir={isEn ? 'ltr' : 'rtl'} 
        className={`min-h-screen flex flex-wrap bg-[#070B16] text-[#E6EDF7] ${isEn ? 'font-sans' : 'font-arabic'}`}
      >
        {/* FORM SIDE */}
        <div className="flex-1 basis-[520px] min-w-0 flex flex-col justify-between p-6 sm:p-10 lg:p-14">
          {/* Top Bar: Brand Logo + Language Switcher */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => {
                soundManager.playButtonClick();
                setCurrentPage('landing');
              }}
              className="flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity cursor-pointer"
            >
              <img src="/mark.png" alt="AssetFlow" className="w-9 h-9 rounded-xl shadow-lg" />
              <span dir="ltr" className="font-bold text-xl sm:text-2xl text-white">
                Asset<span className="grad font-black">Flow</span>
              </span>
            </button>

            <button
              onClick={() => {
                soundManager.playButtonClick();
                setLanguage(isEn ? 'ar' : 'en');
              }}
              className="h-10 px-3.5 rounded-xl border border-[#26324A] bg-[#0F1729] text-xs font-bold text-[#C3CEDF] hover:text-white hover:border-[#3B82F6] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Globe size={15} className="text-blue-400" />
              <span>{isEn ? 'العربية' : 'English'}</span>
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 flex items-center justify-center py-8">
            <form onSubmit={handleLoginSubmit} className="w-full max-w-[420px] flex flex-col gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {isEn ? 'Welcome Back' : 'أهلًا بعودتك'}
                </h1>
                <p className="text-sm text-[#A3B1C6] mt-1.5 leading-relaxed">
                  {isEn 
                    ? "Sign in, and we'll take you automatically to your portal based on your role." 
                    : "سجّل الدخول، وسننقلك تلقائيًا إلى بوابتك حسب دورك."}
                </p>
              </div>

              {/* Demo Accounts Box */}
              <div className="bg-[#0D1526] border border-dashed border-[#2A3E6A] rounded-2xl p-3.5 sm:p-4 flex flex-col gap-2.5 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#A3B1C6]">
                  <Zap size={14} className="text-amber-400 fill-amber-400" />
                  <span>{isEn ? 'Quick Demo Login for Presentation' : 'دخول تجريبي سريع للعرض'}</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Demo Accounts">
                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playCardSwitch();
                      setSelectedDemoRole('admin');
                      setEmail('admin@assetflow.io');
                      setPassword('demo-pass-2026');
                    }}
                    className={`flex-1 min-w-[90px] h-10 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      selectedDemoRole === 'admin'
                        ? 'bg-blue-600/25 text-white border border-blue-500 shadow-sm'
                        : 'bg-[#101A2E] text-[#C3CEDF] border border-[#26324A] hover:bg-[#16233B]'
                    }`}
                  >
                    {isEn ? 'Facility Director' : 'مدير المنظمة'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playCardSwitch();
                      setSelectedDemoRole('technician');
                      setEmail('tech@assetflow.io');
                      setPassword('demo-pass-2026');
                    }}
                    className={`flex-1 min-w-[90px] h-10 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      selectedDemoRole === 'technician'
                        ? 'bg-blue-600/25 text-white border border-blue-500 shadow-sm'
                        : 'bg-[#101A2E] text-[#C3CEDF] border border-[#26324A] hover:bg-[#16233B]'
                    }`}
                  >
                    {isEn ? 'Field Tech' : 'فني صيانة'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playCardSwitch();
                      setSelectedDemoRole('reporter');
                      setEmail('reporter@assetflow.io');
                      setPassword('demo-pass-2026');
                    }}
                    className={`flex-1 min-w-[90px] h-10 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      selectedDemoRole === 'reporter'
                        ? 'bg-blue-600/25 text-white border border-blue-500 shadow-sm'
                        : 'bg-[#101A2E] text-[#C3CEDF] border border-[#26324A] hover:bg-[#16233B]'
                    }`}
                  >
                    {isEn ? 'Reporter' : 'مُبلِّغ'}
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-medium text-[#C3CEDF]">
                  {isEn ? 'Email Address' : 'البريد الإلكتروني'}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    dir="ltr"
                    className={`w-full h-12 px-4 rounded-xl bg-[#0D1526] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none transition-colors ${
                      isEn ? 'text-left' : 'text-right'
                    }`}
                  />
                  <Mail size={16} className={`absolute ${isEn ? 'right-3.5' : 'left-3.5'} top-3.5 text-[#8696AE] pointer-events-none`} />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-medium text-[#C3CEDF]">
                    {isEn ? 'Password' : 'كلمة المرور'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    {isEn ? 'Forgot password?' : 'نسيت كلمة المرور؟'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    dir="ltr"
                    className="w-full h-12 px-4 pl-12 rounded-xl bg-[#0D1526] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-1 top-1 w-10 h-10 flex items-center justify-center text-[#8696AE] hover:text-white transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-2.5 text-xs sm:text-sm text-[#C3CEDF] cursor-pointer select-none py-1">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#26324A] bg-[#0D1526] accent-blue-600 cursor-pointer"
                />
                <span>{isEn ? 'Remember me on this device' : 'تذكّرني على هذا الجهاز'}</span>
              </label>

              {/* Redirection Notice Banner */}
              <div 
                role="status" 
                className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-emerald-300"
              >
                <Check size={16} className="text-emerald-400 shrink-0" />
                <span className="truncate">
                  {isEn ? 'You will be redirected to: ' : 'سيتم توجيهك إلى: '}
                  <strong className="text-white font-semibold">
                    {selectedDemoRole === 'admin'
                      ? (isEn ? 'Dashboard — Facility Director' : 'لوحة القيادة — مدير المنظمة')
                      : selectedDemoRole === 'technician'
                      ? (isEn ? 'Tech Workspace — Field Technician' : 'لوحة الفني — فني صيانة')
                      : (isEn ? 'Fault Reporting — Operational Reporter' : 'بوابة الإبلاغ عن عطل — مُبلِّغ')}
                  </strong>
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-13 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 text-white font-bold text-base hover:brightness-110 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <span>{isEn ? 'Sign In' : 'تسجيل الدخول'}</span>
                {isEn ? <ArrowRight size={17} /> : <ArrowLeft size={17} />}
              </button>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="h-10 px-3 rounded-xl border border-[#26324A] bg-[#0F1729] hover:bg-[#16213A] text-xs font-semibold text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('Microsoft')}
                  className="h-10 px-3 rounded-xl border border-[#26324A] bg-[#0F1729] hover:bg-[#16213A] text-xs font-semibold text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24">
                    <path fill="#F25022" d="M1 1h10v10H1z"/>
                    <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                    <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                    <path fill="#FFB900" d="M13 13h10v10H13z"/>
                  </svg>
                  <span>Microsoft</span>
                </button>
              </div>

              <p className="text-center text-xs sm:text-sm text-[#A3B1C6] pt-1">
                {isEn ? "Not registered yet? " : 'منشأتك غير مسجّلة؟ '}
                <button
                  type="button"
                  onClick={() => setMode('signup-1')}
                  className="text-blue-400 font-bold hover:underline cursor-pointer"
                >
                  {isEn ? 'Create Free Account' : 'أنشئ حسابًا مجانيًا'}
                </button>
              </p>
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-[#8696AE] pt-4 border-t border-[#1A2440]">
            <span>© 2026 AssetFlow</span>
            <span>{isEn ? 'Encrypted Connection · Role-Based Access' : 'اتصال مشفّر · صلاحيات حسب الدور'}</span>
          </div>
        </div>

        {/* BRAND SIDE (Desktop 1440px / Stacked on Mobile 390px) */}
        <div className="flex-1 basis-[480px] min-w-0 min-h-[480px] relative overflow-hidden bg-gradient-to-br from-[#0B1428] via-[#091122] to-[#070B16] border-t lg:border-t-0 lg:border-r border-[#1A2440] flex flex-col justify-center p-8 sm:p-12 lg:p-16 gap-8">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-lg space-y-3.5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              {isEn ? 'Every fault is linked to a service.' : 'كل عطل مرتبط بخدمة.'}
              <br />
              <span className="grad">
                {isEn ? 'And every service has a priority.' : 'وكل خدمة لها أولوية.'}
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#C3CEDF] leading-relaxed">
              {isEn 
                ? 'Start your shift from "Issues Requiring Your Attention" instead of an endless backlog.'
                : 'ابدأ يومك من «بلاغات تحتاج انتباهك» بدل قائمة طويلة من البلاغات.'}
            </p>
          </div>

          <div className="relative max-w-md bg-[#0D1526]/85 backdrop-blur-md border border-[#26324A] rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-2xl">
            <div className="text-xs font-semibold text-[#A3B1C6]">
              {isEn ? 'Requires Your Attention Right Now' : 'يحتاج انتباهك الآن'}
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25">
              <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full text-rose-300 bg-rose-500/20">
                {isEn ? '▲ High Priority' : '▲ أولوية عالية'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white truncate">
                  {isEn ? 'Turbine Generator 1500kVA' : 'المولد التوربيني 1500kVA'}
                </div>
                <div className="text-[11px] text-[#A3B1C6] truncate mt-0.5">
                  {isEn ? 'Supports Critical Service · High Severity' : 'يدعم خدمة حرجة · شدة عالية'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#16213A]/60 border border-[#26324A]">
              <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full text-[#C3CEDF] bg-[#16213A]">
                {isEn ? '? Incomplete' : '? غير محسوبة'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white truncate">
                  {isEn ? 'Industrial Chiller Unit A' : 'وحدة التبريد الصناعي Chiller A'}
                </div>
                <div className="text-[11px] text-[#A3B1C6] truncate mt-0.5">
                  {isEn ? 'Not mapped to service — complete data' : 'غير مرتبطة بخدمة — أكمل البيانات'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#070B16] flex flex-col justify-center items-center p-4 relative overflow-hidden ${isEn ? 'font-sans' : 'font-arabic'} selection:bg-blue-600 selection:text-white`}>
      {/* Floating Animated Orbs in Background */}
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-teal-500/20 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

      {/* Top Brand Logo */}
      <div 
        className="mb-6 flex flex-col items-center gap-2 cursor-pointer group" 
        onClick={() => setCurrentPage('landing')}
      >
        <div className="flex items-center gap-2.5">
          <img src="/mark.png" alt="AssetFlow" className="w-11 h-11 rounded-xl shadow-xl transition-transform group-hover:scale-105" />
          <span dir="ltr" className="text-2xl font-black text-white font-arabic tracking-tight">
            Asset<span className="grad font-black">Flow</span>
          </span>
        </div>
        <span className="text-xs text-[#8696AE]">
          {isEn ? 'Intelligent CMMS Cloud for Critical Infrastructure & Public Services' : 'المنصة السحابية الذكية لإدارة الأصول والخدمات الحرجة'}
        </span>
      </div>

      {/* FLOATING CARD CONTAINER */}
      <div className={`w-full max-w-md sm:max-w-xl mx-auto bg-[#0F1729]/90 backdrop-blur-2xl border border-[#26324A] rounded-3xl p-6 sm:p-8 shadow-[0_30px_90px_-15px_rgba(37,99,235,0.35)] hover:shadow-[0_35px_100px_-15px_rgba(20,184,166,0.35)] transition-all duration-500 relative z-10 ${isEn ? 'text-left' : 'text-right'}`}>

        {/* FORGOT PASSWORD MODE */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {isEn ? 'Reset Password' : 'استعادة كلمة المرور'}
              </h2>
              <p className="text-xs text-[#A3B1C6] mt-1">
                {isEn ? "Enter your email and we'll send you a recovery link" : 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                {isEn ? 'Registered Email' : 'البريد الإلكتروني المسجل'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full h-11 px-3.5 ${isEn ? 'pl-3.5 pr-10 text-left' : 'pl-10 text-right'} rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none transition-colors`}
                />
                <Mail size={16} className={`absolute ${isEn ? 'right-3' : 'left-3'} top-3.5 text-[#8696AE]`} />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-sm hover:brightness-110 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              {isEn ? 'Send Reset Link' : 'إرسال رابط الاستعادة'}
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full py-2 text-center text-xs text-[#8696AE] hover:text-white cursor-pointer"
            >
              {isEn ? 'Back to Sign In' : 'العودة إلى تسجيل الدخول'}
            </button>
          </form>
        )}

        {/* OTP VERIFICATION MODE */}
        {mode === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-2.5 shadow-inner">
                <ShieldCheck size={26} />
              </div>
              <h2 className="text-2xl font-bold text-white">
                {isEn ? 'Verification Code (OTP)' : 'رمز التحقق (OTP)'}
              </h2>
              <p className="text-xs text-[#A3B1C6] mt-1 leading-relaxed">
                {isEn ? 'Enter the 6-digit code sent to:' : 'أدخل رمز التحقق المكون من 6 أرقام المرسل إلى:'} <br />
                <span className="text-blue-400 mono font-semibold">{email}</span>
              </p>
            </div>

            {/* Quick Demo Helper */}
            <div className="bg-[#141C2E] border border-blue-500/20 rounded-xl p-2.5 flex items-center justify-between">
              <div className="text-[11px] text-[#A3B1C6]">
                {isEn ? 'Demo test code: ' : 'رمز تجريبي للاختبار: '}
                <span className="mono font-bold text-teal-400">849201</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOtpCode('849201');
                  soundManager.playButtonClick();
                  showToast(isEn ? 'Demo code applied' : 'تم إدراج الرمز التجريبي', isEn ? 'Click verify to proceed' : 'اضغط تأكيد المتابعة', 'info');
                }}
                className="text-[11px] font-bold px-2.5 py-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 rounded-lg border border-blue-500/30 transition-colors cursor-pointer"
              >
                {isEn ? 'Auto Fill' : 'إدخال تلقائي'}
              </button>
            </div>

            {/* Interactive OTP Input */}
            <div className="py-2 flex justify-center" dir="ltr">
              <OtpInput
                length={6}
                mode="numeric"
                defaultValue={otpCode}
                onChange={(val) => {
                  setOtpCode(val);
                  setOtpError('');
                }}
                onComplete={(val) => {
                  setOtpCode(val);
                }}
                status={otpError ? "error" : "idle"}
                errorMessage={otpError}
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 text-white font-bold text-sm hover:brightness-110 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isEn ? 'Verify Code & Proceed' : 'تأكيد الرمز والمتابعة'}</span>
              {isEn ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            </button>

            <div className="flex items-center justify-between text-xs pt-1 text-[#8696AE]">
              <button
                type="button"
                onClick={() => {
                  soundManager.playButtonClick();
                  showToast(isEn ? 'New code sent' : 'تم إرسال رمز جديد', isEn ? 'New verification code: 849201' : 'رمز التحقق الجديد: 849201', 'info');
                }}
                className="text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                {isEn ? 'Resend Code' : 'إعادة إرسال الرمز'}
              </button>
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="hover:text-white cursor-pointer"
              >
                {isEn ? 'Change Email' : 'تغيير البريد'}
              </button>
            </div>
          </form>
        )}

        {/* RESET PASSWORD MODE */}
        {mode === 'reset-password' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-2.5 shadow-inner">
                <KeyRound size={22} />
              </div>
              <h2 className="text-2xl font-bold text-white">
                {isEn ? 'Set New Password' : 'تعيين كلمة المرور الجديدة'}
              </h2>
              <p className="text-xs text-[#A3B1C6] mt-1">
                {isEn ? 'Choose a strong password to protect facility access' : 'اختر كلمة مرور قوية لحماية وصولك إلى المنشأة'}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                  {isEn ? 'New Password' : 'كلمة المرور الجديدة'}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={isEn ? 'At least 8 characters' : '8 خانات على الأقل'}
                    className={`w-full h-11 px-3.5 ${isEn ? 'pl-3.5 pr-10 text-left' : 'pl-10 text-right'} rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none transition-colors`}
                  />
                  <Lock size={16} className={`absolute ${isEn ? 'right-3' : 'left-3'} top-3.5 text-[#8696AE]`} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-1.5">
                  {isEn ? 'Confirm New Password' : 'تأكيد كلمة المرور الجديدة'}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={isEn ? 'Re-enter your password' : 'أعد إدخال كلمة المرور'}
                    className={`w-full h-11 px-3.5 ${isEn ? 'pl-3.5 pr-10 text-left' : 'pl-10 text-right'} rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none transition-colors`}
                  />
                  <Lock size={16} className={`absolute ${isEn ? 'right-3' : 'left-3'} top-3.5 text-[#8696AE]`} />
                </div>
              </div>
            </div>

            {/* Validation indicators */}
            <div className="p-3 bg-[#0B1222] rounded-xl border border-[#26324A] space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2 text-[#8696AE]">
                <Check size={14} className={newPassword.length >= 8 ? 'text-emerald-400' : 'text-[#8696AE]'} />
                <span className={newPassword.length >= 8 ? 'text-white' : ''}>
                  {isEn ? 'At least 8 characters' : '8 خانات أو رموز على الأقل'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#8696AE]">
                <Check size={14} className={newPassword && newPassword === confirmPassword ? 'text-emerald-400' : 'text-[#8696AE]'} />
                <span className={newPassword && newPassword === confirmPassword ? 'text-white' : ''}>
                  {isEn ? 'Passwords match' : 'تطابق كلمتي المرور'}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-sm hover:brightness-110 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isEn ? 'Save Password & Sign In' : 'حفظ كلمة المرور والدخول'}</span>
              <Sparkles size={16} />
            </button>
          </form>
        )}

        {/* RESET DONE */}
        {mode === 'reset-done' && (
          <div className="text-center space-y-4 py-4">
            <span className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 size={32} />
            </span>
            <h2 className="text-2xl font-bold text-white">
              {isEn ? 'Password Changed Successfully!' : 'تم تغيير كلمة المرور بنجاح!'}
            </h2>
            <p className="text-xs text-[#A3B1C6] leading-relaxed">
              {isEn 
                ? 'Your account security has been updated. You can proceed directly to the dashboard.' 
                : 'تم تحديث بيانات أمان حسابك، يمكنك الآن المتابعة مباشرة إلى لوحة القيادة.'}
            </p>
            <button
              onClick={() => {
                const admin = teamMembers[0];
                setCurrentUser(admin);
                setCurrentPage('dashboard');
                showToast(isEn ? 'Welcome!' : 'مرحباً بك!', isEn ? 'Signed in successfully' : 'تم الدخول إلى المنظومة بنجاح', 'success');
              }}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-sm hover:brightness-110 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              {isEn ? 'Proceed to Dashboard' : 'الدخول المباشر إلى المنصة'}
            </button>
          </div>
        )}

        {/* SIGNUP STEP 1: SELECT ROLE & ORGANIZATION INFO */}
        {mode === 'signup-1' && (
          <form onSubmit={handleSignupStep1} className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
                <span>{isEn ? 'Step 1 of 2' : 'الخطوة 1 من 2'}</span>
                <span>•</span>
                <span>{isEn ? 'Account Role & Facility' : 'تحديد الدور والمنشأة'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {isEn ? 'Create New Account' : 'إنشاء حساب جديد'}
              </h2>
              <p className="text-xs sm:text-sm text-[#A3B1C6] mt-1">
                {isEn ? 'Choose your role and register your facility' : 'اختر دورك وسجّل منشأتك لتخصيص بيئة العمل فوراً'}
              </p>
            </div>

            {/* Interactive Role Selection Cards */}
            <div>
              <label className="block text-xs font-semibold text-[#C3CEDF] mb-2 text-center sm:text-right">
                {isEn ? 'Select Your Role in the System *' : 'اختر نوع الحساب ودورك الوظيفي *'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Admin Role */}
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playCardSwitch();
                    setSignupRole('admin');
                    setFullName(isEn ? 'Tariq Al-Nabulsi' : 'طارق النابلسي');
                    setEmail('admin@assetflow.io');
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    signupRole === 'admin'
                      ? 'border-blue-500 bg-blue-600/20 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
                      : 'border-[#26324A] bg-[#0B1222] text-[#A3B1C6] hover:bg-[#121D36] hover:text-white'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    signupRole === 'admin' ? 'bg-blue-500 text-white' : 'bg-[#16233B] text-[#8696AE]'
                  }`}>
                    <Shield size={16} />
                  </span>
                  <span className="text-xs font-bold leading-tight">
                    {isEn ? 'Facility Director' : 'مدير المنظمة'}
                  </span>
                  <span className="text-[10px] text-[#8696AE] leading-tight">
                    {isEn ? 'Full control & triage' : 'صلاحيات وإدارة كاملة'}
                  </span>
                </button>

                {/* Technician Role */}
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playCardSwitch();
                    setSignupRole('technician');
                    setFullName(isEn ? 'Ahmed Khalil' : 'أحمد خليل');
                    setEmail('tech@assetflow.io');
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    signupRole === 'technician'
                      ? 'border-blue-500 bg-blue-600/20 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
                      : 'border-[#26324A] bg-[#0B1222] text-[#A3B1C6] hover:bg-[#121D36] hover:text-white'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    signupRole === 'technician' ? 'bg-blue-500 text-white' : 'bg-[#16233B] text-[#8696AE]'
                  }`}>
                    <Wrench size={16} />
                  </span>
                  <span className="text-xs font-bold leading-tight">
                    {isEn ? 'Field Technician' : 'فني صيانة'}
                  </span>
                  <span className="text-[10px] text-[#8696AE] leading-tight">
                    {isEn ? 'Work orders & tasks' : 'أوامر العمل والمهام'}
                  </span>
                </button>

                {/* Reporter Role */}
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playCardSwitch();
                    setSignupRole('reporter');
                    setFullName(isEn ? 'Hiba Yaish' : 'هبة يعيش');
                    setEmail('reporter@assetflow.io');
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    signupRole === 'reporter'
                      ? 'border-blue-500 bg-blue-600/20 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
                      : 'border-[#26324A] bg-[#0B1222] text-[#A3B1C6] hover:bg-[#121D36] hover:text-white'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    signupRole === 'reporter' ? 'bg-blue-500 text-white' : 'bg-[#16233B] text-[#8696AE]'
                  }`}>
                    <AlertTriangle size={16} />
                  </span>
                  <span className="text-xs font-bold leading-tight">
                    {isEn ? 'Reporter' : 'مُبلِّغ تشغيلي'}
                  </span>
                  <span className="text-[10px] text-[#8696AE] leading-tight">
                    {isEn ? 'Report breakdowns' : 'تسجيل بلاغات الأعطال'}
                  </span>
                </button>
              </div>
            </div>

            {/* Facility & Sector Info */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-1">
                  {isEn ? 'Facility or Company Name *' : 'اسم المنشأة أو الشركة *'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder={isEn ? 'e.g., Nablus Water Utility' : 'مثال: بلدية نابلس — دائرة المياه'}
                    className={`w-full h-11 px-3.5 ${isEn ? 'pl-3.5 pr-10 text-left' : 'pl-10 text-right'} rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none transition-colors`}
                  />
                  <Building size={16} className={`absolute ${isEn ? 'right-3' : 'left-3'} top-3.5 text-[#8696AE]`} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-1">
                  {isEn ? 'Sector & Vital Domain' : 'القطاع والنشاط الحيوي'}
                </label>
                <select
                  value={facilityType}
                  onChange={(e) => setFacilityType(e.target.value)}
                  className={`w-full h-11 px-3 rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none transition-colors ${isEn ? 'text-left' : 'text-right'}`}
                >
                  <option value={isEn ? "Water & Infrastructure" : "مياه وبنية تحتية"}>
                    {isEn ? 'Water, Desalination & Wastewater Plants' : 'محطات مياه وصرف صحي وبنية تحتية'}
                  </option>
                  <option value={isEn ? "Hospitals & Healthcare" : "صحة ومستشفيات"}>
                    {isEn ? 'Hospitals & Clinical Facilities' : 'مستشفيات ورعاية صحية'}
                  </option>
                  <option value={isEn ? "Industrial & Logistics" : "صناعي ولوجستي"}>
                    {isEn ? 'Industrial & Chemical Manufacturing Hubs' : 'مصانع ومجمعات كيميائية وصناعية'}
                  </option>
                  <option value={isEn ? "Power & Electrical" : "طاقة وكهرباء"}>
                    {isEn ? 'Power Generation & Electrical Grids' : 'توليد طاقة وشبكات كهربائية'}
                  </option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-sm hover:brightness-110 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{isEn ? 'Continue to Account Details' : 'متابعة لبيانات الحساب'}</span>
              {isEn ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            </button>

            <div className="text-center pt-1 text-xs text-[#A3B1C6]">
              {isEn ? 'Already have an account? ' : 'لديك حساب بالفعل؟ '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-blue-400 font-bold hover:underline cursor-pointer"
              >
                {isEn ? 'Sign In' : 'تسجيل الدخول'}
              </button>
            </div>
          </form>
        )}

        {/* SIGNUP STEP 2: PROFILE & CREDENTIALS */}
        {mode === 'signup-2' && (
          <form onSubmit={handleSignupStep2} className="space-y-3.5">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold mb-2">
                <span>{isEn ? 'Step 2 of 2' : 'الخطوة 2 من 2'}</span>
                <span>•</span>
                <span>
                  {signupRole === 'admin' 
                    ? (isEn ? 'Director Profile' : 'حساب مدير المنشأة')
                    : signupRole === 'technician'
                    ? (isEn ? 'Technician Profile' : 'حساب فني الصيانة')
                    : (isEn ? 'Reporter Profile' : 'حساب المُبلِّغ')}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                {isEn ? 'Complete Account Details' : 'بيانات الحساب الشخصي'}
              </h2>
              <p className="text-xs text-[#A3B1C6] mt-0.5">
                {isEn 
                  ? `Configuring profile for ${orgName}` 
                  : `تهيئة صلاحيات الدخول لمنشأة: ${orgName}`}
              </p>
            </div>

            {/* Selected Role Reminder Banner */}
            <div className="p-2.5 rounded-xl bg-[#0B1222] border border-[#26324A] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  {signupRole === 'admin' ? <Shield size={14} /> : signupRole === 'technician' ? <Wrench size={14} /> : <AlertTriangle size={14} />}
                </span>
                <div>
                  <span className="text-[10px] text-[#8696AE] block">{isEn ? 'Assigned Role' : 'الدور المحدد:'}</span>
                  <span className="font-bold text-white">
                    {signupRole === 'admin' ? (isEn ? 'Facility Director / Admin' : 'مدير المنظمة / أدمن') : signupRole === 'technician' ? (isEn ? 'Field Technician' : 'فني صيانة ميداني') : (isEn ? 'Operational Reporter' : 'مُبلِّغ تشغيلي')}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMode('signup-1')}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer underline"
              >
                {isEn ? 'Change' : 'تغيير الدور'}
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-1">
                  {isEn ? 'Full Name' : 'الاسم الكامل'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full h-10 px-3.5 ${isEn ? 'pl-3.5 pr-10 text-left' : 'pl-10 text-right'} rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none transition-colors`}
                  />
                  <User size={15} className={`absolute ${isEn ? 'right-3' : 'left-3'} top-3 text-[#8696AE]`} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-1">
                  {isEn ? 'Work Email' : 'البريد الإلكتروني للعمل'}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full h-10 px-3.5 ${isEn ? 'pl-3.5 pr-10 text-left' : 'pl-10 text-right'} rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none transition-colors`}
                  />
                  <Mail size={15} className={`absolute ${isEn ? 'right-3' : 'left-3'} top-3 text-[#8696AE]`} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-1">
                  {isEn ? 'Phone Number for Instant Alerts' : 'رقم الهاتف للتنبيهات الفورية'}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full h-10 px-3.5 ${isEn ? 'pl-3.5 pr-10 text-left' : 'pl-10 text-right'} rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none transition-colors mono`}
                  />
                  <Phone size={15} className={`absolute ${isEn ? 'right-3' : 'left-3'} top-3 text-[#8696AE]`} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C3CEDF] mb-1">
                  {isEn ? 'Password' : 'كلمة المرور'}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    defaultValue="demo-pass-2026"
                    placeholder={isEn ? 'At least 8 characters' : '8 رموز على الأقل'}
                    className={`w-full h-10 px-3.5 ${isEn ? 'pl-3.5 pr-10 text-left' : 'pl-10 text-right'} rounded-xl bg-[#0B1222] border border-[#26324A] text-white text-sm focus:border-blue-500 focus:outline-none transition-colors`}
                  />
                  <Lock size={15} className={`absolute ${isEn ? 'right-3' : 'left-3'} top-3 text-[#8696AE]`} />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMode('signup-1')}
                className="w-1/3 h-11 rounded-xl bg-[#16213A] border border-[#26324A] text-white font-semibold text-xs hover:bg-[#1E2A44] transition-all cursor-pointer"
              >
                {isEn ? 'Back' : 'رجوع'}
              </button>
              <button
                type="submit"
                className="w-2/3 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-sm hover:brightness-110 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isEn ? 'Complete Registration' : 'إتمام إنشاء الحساب'}</span>
                <Sparkles size={16} />
              </button>
            </div>
          </form>
        )}

        {/* SIGNUP DONE */}
        {mode === 'signup-done' && (
          <div className="text-center space-y-4 py-4">
            <span className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl">
              <Sparkles size={36} />
            </span>
            <h2 className="text-2xl font-bold text-white">
              {isEn ? 'Welcome to AssetFlow!' : 'مرحباً بك في AssetFlow!'}
            </h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold">
              <span>{isEn ? 'Role Activated:' : 'تم تفعيل الحساب:'}</span>
              <span className="text-white">
                {signupRole === 'admin' ? (isEn ? 'Facility Director' : 'مدير المنظمة') : signupRole === 'technician' ? (isEn ? 'Field Technician' : 'فني صيانة ميداني') : (isEn ? 'Operational Reporter' : 'مُبلِّغ تشغيلي')}
              </span>
            </div>
            <p className="text-xs text-[#A3B1C6] leading-relaxed max-w-sm mx-auto">
              {signupRole === 'admin' 
                ? (isEn ? `Your facility account (${orgName}) has been created with full administrative privileges.` : `تم إنشاء حساب منشأتك (${orgName}) بصلاحيات الإدارة الكاملة للتحكم بالأصول وتشخيص الأعطال.`)
                : signupRole === 'technician'
                ? (isEn ? `Your technician account is ready. You have direct access to your work orders and field inspection tools.` : `تم إعداد حسابك كفني صيانة. يمكنك الآن متابعة أوامر العمل الموكلة إليك وتحديث الإجراءات الميدانية.`)
                : (isEn ? `Your reporter account is activated. You can now submit breakdown reports with instant AI assistance.` : `تم تفعيل حسابك كمُبلّغ تشغيلي. يمكنك الآن رفع بلاغات الأعطال ومتابعة خطوات المعالجة فورياً.`)}
            </p>
            <button
              onClick={() => {
                switchRole(signupRole);
                showToast(
                  isEn ? 'Welcome to AssetFlow' : 'مرحباً بك في المنظومة', 
                  isEn ? `Logged in as ${fullName}` : `تم الدخول باسم ${fullName}`, 
                  'success'
                );
              }}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold text-sm hover:brightness-110 shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>
                {signupRole === 'admin' 
                  ? (isEn ? 'Enter Management Dashboard' : 'الدخول إلى لوحة إدارة المنشأة')
                  : signupRole === 'technician'
                  ? (isEn ? 'Enter Technician Workspace' : 'الدخول إلى مساحة عمل الفني')
                  : (isEn ? 'Enter Reporter Workspace' : 'الدخول إلى بوابة رفع البلاغات')}
              </span>
              {isEn ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            </button>
          </div>
        )}
      </div>

      {/* Back to Home Link */}
      <button
        onClick={() => setCurrentPage('landing')}
        className="mt-6 text-xs text-[#8696AE] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
      >
        {isEn ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
        <span>{isEn ? 'Back to Home Page' : 'العودة إلى الصفحة الرئيسية'}</span>
      </button>
    </div>
  );
};
