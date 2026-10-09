import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { InteractiveBackground } from '../auth/InteractiveBackground';
import Navbar from '../sections/Navbar/Navbar';
import Footer from '../sections/Footer/Footer';
import { landingData } from '../../data/landingData';
import { BACKGROUND_SLIDES } from '../../data/backgroundSlides';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Copy,
  Check,
  User,
  Layers,
  Activity,
  Zap,
  Cpu,
  ShieldCheck,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { language, addToast, activeSlide, setActiveSlide } = useApp();
  const t = landingData[language]?.contact || landingData.en.contact;

  const currentSlide = BACKGROUND_SLIDES[activeSlide] || BACKGROUND_SLIDES[0];

  // 3D Card Interactive Tilt & Light Reflection (Exact match with LoginPage)
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardTransform, setCardTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [cardMousePos, setCardMousePos] = useState({ x: 220, y: 250 });
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    fleetSize: t.form.fleetOptions?.[1] || '50 – 250 Assets',
    inquiryType: t.form.inquiryOptions?.[0] || 'Enterprise Demo',
    message: '',
  });

  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync options on language toggle
  useEffect(() => {
    if (t.form.inquiryOptions && !t.form.inquiryOptions.includes(formData.inquiryType)) {
      setFormData((prev) => ({
        ...prev,
        inquiryType: t.form.inquiryOptions[0],
        fleetSize: t.form.fleetOptions?.[1] || prev.fleetSize,
      }));
    }
  }, [language, t]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -3.5;
    const rotateY = ((x - centerX) / centerX) * 3.5;

    setCardTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`);
    setCardMousePos({ x, y });
    setIsCardHovered(true);
  };

  const handleCardMouseLeave = () => {
    setCardTransform('perspective(1000px) rotateX(0deg) rotateY(0deg)');
    setIsCardHovered(false);
  };

  const copyEmailToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(t.directChannels.email);
      setCopiedEmail(true);
      addToast({
        type: 'success',
        title: language === 'ar' ? 'تم النسخ' : 'Email Copied',
        description: t.directChannels.copiedTooltip || 'enterprise@assetflow.io copied to clipboard.',
      });
      setTimeout(() => setCopiedEmail(false), 2400);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { fullName?: string; email?: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = language === 'ar' ? 'هذا الحقل مطلوب (يرجى إدخال الاسم)' : 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = language === 'ar' ? 'هذا الحقل مطلوب (يرجى إدخال البريد الإلكتروني)' : 'Work email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email =
        language === 'ar' ? 'يرجى إدخال عنوان بريد إلكتروني صحيح' : 'Please enter a valid work email';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      addToast({
        type: 'warning',
        title: language === 'ar' ? 'تنبيه التحقق' : 'Validation Error',
        description: language === 'ar' ? 'يرجى مراجعة وتعبئة الحقول المطلوبة.' : 'Please fill all required fields.',
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      addToast({
        type: 'success',
        title: t.form.successTitle,
        description: t.form.successDesc,
      });
    }, 800);
  };

  const benefitIcons = [
    <Zap key="b-1" className="w-5 h-5 text-[#38bdf8]" />,
    <Cpu key="b-2" className="w-5 h-5 text-[#34d399]" />,
    <ShieldCheck key="b-3" className="w-5 h-5 text-[#818cf8]" />,
  ];

  return (
    <div className="min-h-screen bg-[#061224] text-white flex flex-col justify-between relative overflow-hidden selection:bg-[#0066FF] selection:text-white">
      {/* 1. Dynamic Animated & Interactive Canvas Background (Identical to Auth) */}
      <InteractiveBackground />

      {/* 2. Floating Navbar at Top */}
      <Navbar />

      {/* 3. Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-32 sm:pt-40 pb-16 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start w-full">

          {/* Left Column: Heading, Direct Channels & Value Deck */}
          <div className="lg:col-span-6 flex flex-col justify-center text-start">

            {/* Synchronized Headline & Subtitle */}
            <div key={activeSlide} className="transition-all duration-700 animate-fade-in mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white leading-[1.2] tracking-tight mb-4">
                {t.titlePart1}{' '}
                <span className="bg-gradient-to-r from-[#38bdf8] via-[#60a5fa] to-[#34d399] bg-clip-text text-transparent">
                  {t.titlePart2}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-lg">
                {t.description}
              </p>
            </div>

            {/* Direct Channels Cards */}
            <div className="flex flex-col gap-3 mb-8">
              {/* Email Card */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-md hover:border-slate-500/80 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-sky-400" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {t.directChannels.emailLabel}
                  </span>
                  <a
                    href={`mailto:${t.directChannels.email}`}
                    className="text-sm font-semibold text-white hover:text-sky-300 transition-colors truncate"
                  >
                    {t.directChannels.email}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={copyEmailToClipboard}
                  className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-sky-500/20 border border-slate-700 hover:border-sky-500/40 text-slate-300 hover:text-sky-300 flex items-center justify-center transition-all cursor-pointer shrink-0"
                  title={language === 'ar' ? 'نسخ البريد' : 'Copy email'}
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Phone Card */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-md hover:border-slate-500/80 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {t.directChannels.phoneLabel}
                  </span>
                  <a
                    href={`tel:${t.directChannels.phone}`}
                    className="text-sm font-semibold text-white hover:text-emerald-300 transition-colors truncate"
                  >
                    {t.directChannels.phone}
                  </a>
                </div>
              </div>

              {/* Offices Card */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 backdrop-blur-md hover:border-slate-500/80 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {t.directChannels.officeLabel}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-200">
                    {t.directChannels.office}
                  </span>
                </div>
              </div>
            </div>

            {/* Value Highlights */}
            <div className="flex flex-col gap-2.5 mb-8">
              {t.benefits?.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center shrink-0 mt-0.5">
                    {benefitIcons[idx % benefitIcons.length]}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">{benefit.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Theme Slide Switchers (Matching Login) */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium mr-2">
                {language === 'ar' ? 'السمات الحركية:' : 'Dynamic Canvas:'}
              </span>
              {BACKGROUND_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  title={`Background Theme ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                    activeSlide === idx
                      ? 'w-8 bg-gradient-to-r from-[#1D68BD] to-[#2EAF7D]'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>

          </div>


          {/* Right Column: Crisp White 3D Glass Form Card (Matching Login Page) */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{
                transform: cardTransform,
                transition: 'transform 0.15s ease-out, box-shadow 0.25s ease-out',
              }}
              className={`w-full max-w-[500px] bg-white rounded-2xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.35)] hover:shadow-[0_25px_60px_rgba(0,102,255,0.18)] text-gray-900 border border-gray-100/90 relative z-10 transition-transform overflow-hidden ${
                isShaking ? 'animate-shake' : ''
              }`}
            >
              {/* Dynamic 3D Cursor Light Sheen on Card */}
              <div
                className={`pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                  isCardHovered ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  background: `radial-gradient(400px circle at ${cardMousePos.x}px ${cardMousePos.y}px, rgba(0, 102, 255, 0.08), transparent 75%)`,
                }}
              />

              {isSubmitted ? (
                /* Success Confirmation State */
                <div className="text-center py-8 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center animate-bounce">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{t.form.successTitle}</h3>
                  <p className="text-sm text-gray-600 max-w-sm leading-relaxed">{t.form.successDesc}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        fullName: '',
                        email: '',
                        company: '',
                        fleetSize: t.form.fleetOptions?.[1] || '50 – 250 Assets',
                        inquiryType: t.form.inquiryOptions?.[0] || 'Enterprise Demo',
                        message: '',
                      });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold transition-all cursor-pointer"
                  >
                    {t.form.resetBtn}
                  </button>
                </div>
              ) : (
                /* Interactive Contact Form */
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-start" noValidate>

                  {/* Form Title & Subtitle */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                      {t.form.headerTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      {t.form.headerSubtitle}
                    </p>
                  </div>

                  {/* Inquiry Focus Selector Pills */}
                  <div className="mt-1">
                    <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-2">
                      {t.form.inquiryType}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {t.form.inquiryOptions?.map((option) => {
                        const isSelected = formData.inquiryType === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setFormData({ ...formData, inquiryType: option })}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'bg-gradient-to-r from-[#1D68BD] to-[#2EAF7D] text-white shadow-sm shadow-[#1D68BD]/30 scale-[1.02]'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Full Name & Work Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-1">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        {t.form.fullName} <span className="text-blue-600">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 pointer-events-none" />
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => {
                            setFormData({ ...formData, fullName: e.target.value });
                            if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                          }}
                          placeholder={t.form.fullNamePlaceholder}
                          className={`w-full py-2.5 px-3.5 pl-10 rtl:pl-3.5 rtl:pr-10 bg-gray-50/90 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D68BD] focus:border-transparent text-sm font-medium transition-all ${
                            errors.fullName ? 'border-red-500 bg-red-50/40' : 'border-gray-200'
                          }`}
                        />
                      </div>
                      {errors.fullName && (
                        <span className="text-[11px] text-red-500 font-medium mt-1 block">{errors.fullName}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        {t.form.email} <span className="text-blue-600">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 pointer-events-none" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (errors.email) setErrors({ ...errors, email: undefined });
                          }}
                          placeholder={t.form.emailPlaceholder}
                          className={`w-full py-2.5 px-3.5 pl-10 rtl:pl-3.5 rtl:pr-10 bg-gray-50/90 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D68BD] focus:border-transparent text-sm font-medium transition-all ${
                            errors.email ? 'border-red-500 bg-red-50/40' : 'border-gray-200'
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <span className="text-[11px] text-red-500 font-medium mt-1 block">{errors.email}</span>
                      )}
                    </div>
                  </div>

                  {/* Company & Asset Fleet Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        {t.form.company}
                      </label>
                      <div className="relative">
                        <Activity className="w-4 h-4 text-gray-400 absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 pointer-events-none" />
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder={t.form.companyPlaceholder}
                          className="w-full py-2.5 px-3.5 pl-10 rtl:pl-3.5 rtl:pr-10 bg-gray-50/90 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D68BD] focus:border-transparent text-sm font-medium transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        {t.form.fleetSize}
                      </label>
                      <div className="relative">
                        <Layers className="w-4 h-4 text-gray-400 absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 pointer-events-none" />
                        <select
                          value={formData.fleetSize}
                          onChange={(e) => setFormData({ ...formData, fleetSize: e.target.value })}
                          className="w-full py-2.5 px-3.5 pl-10 rtl:pl-3.5 rtl:pr-10 bg-gray-50/90 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1D68BD] focus:border-transparent text-sm font-medium transition-all cursor-pointer appearance-none"
                        >
                          {t.form.fleetOptions?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Message Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                      {t.form.message}
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t.form.messagePlaceholder}
                      className="w-full py-2.5 px-3.5 bg-gray-50/90 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D68BD] focus:border-transparent text-sm font-medium transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-[#1D68BD] to-[#2EAF7D] hover:opacity-95 text-white font-semibold rounded-xl shadow-lg shadow-[#1D68BD]/25 transition-all duration-200 text-sm flex items-center justify-center gap-2 cursor-pointer mt-1 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        {t.form.submitting}
                      </span>
                    ) : (
                      <>
                        <span>{t.form.submitBtn}</span>
                        <Send className="w-4 h-4 rtl:rotate-180" />
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* 4. Footer at Bottom */}
      <Footer />
    </div>
  );
};
