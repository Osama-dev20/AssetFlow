import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Wrench, ArrowRight, ArrowLeft, LayoutDashboard, Construction } from 'lucide-react';

interface PlaceholderPageProps {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  tag?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  titleAr,
  titleEn,
  descriptionAr,
  descriptionEn,
  tag,
}) => {
  const { language } = useApp();
  const isRTL = language === 'ar';

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4 select-none">
      <div className="max-w-lg w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-md">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
          <Construction className="w-8 h-8" />
        </div>

        {tag && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/25 mb-3">
            {tag}
          </span>
        )}

        <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
          {isRTL ? titleAr : titleEn}
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed max-w-md mx-auto">
          {isRTL ? descriptionAr : descriptionEn}
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1d68bd] to-[#2eaf7d] text-white text-xs font-semibold shadow-lg shadow-blue-600/25 flex items-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{isRTL ? 'العودة للوحة القيادة' : 'Back to Dashboard'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
