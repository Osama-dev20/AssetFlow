import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export const BrandSplash: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const { language } = useApp();
  const isRTL = language === 'ar';

  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Check if shown in this session
    const hasShown = sessionStorage.getItem('af_splash_viewed');
    if (hasShown) {
      setVisible(false);
      if (onComplete) onComplete();
      return;
    }

    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 1400);

    const removeTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('af_splash_viewed', 'true');
      if (onComplete) onComplete();
    }, 1800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#070F1E] flex flex-col items-center justify-center select-none transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Background subtle radial sheen */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(29,104,189,0.18),transparent_70%)] pointer-events-none" />

      {/* Center Brand Identity Card */}
      <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-5 animate-scale-up">
        {/* Animated Brand Logo */}
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1D68BD] to-[#2EAF7D] p-3.5 shadow-2xl shadow-blue-600/30 ring-1 ring-white/20 animate-pulse">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <path d="M26 30 C 50 30, 52 50, 70 50" stroke="#93C5FD" strokeWidth="8" strokeLinecap="round" />
            <path d="M26 50 L 70 50" stroke="#93C5FD" strokeWidth="8" strokeLinecap="round" />
            <path d="M26 70 C 50 70, 52 50, 70 50" stroke="#93C5FD" strokeWidth="8" strokeLinecap="round" />
            <circle cx="26" cy="30" r="10" fill="#FFFFFF" />
            <circle cx="26" cy="50" r="10" fill="#FFFFFF" />
            <circle cx="26" cy="70" r="10" fill="#FFFFFF" />
            <circle cx="70" cy="50" r="14" fill="#34D399" />
          </svg>
        </div>

        {/* Brand Name */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Asset<span className="text-[#38BDF8]">Flow</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-slate-400">
            {isRTL
              ? 'المنظومة السحابية الموحدة لإدارة الأصول والخدمات الحرجة'
              : 'Enterprise CMMS & Critical Services Platform'}
          </p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-gradient-to-r from-[#1D68BD] to-[#2EAF7D] rounded-full animate-[progress_1.4s_ease-in-out_infinite]" />
        </div>

        {/* System Status */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>
            {isRTL ? 'تهيئة بيئة العمل التشغيلية v1.0.4' : 'Initializing Operations Core v1.0.4'}
          </span>
        </div>
      </div>
    </div>
  );
};
