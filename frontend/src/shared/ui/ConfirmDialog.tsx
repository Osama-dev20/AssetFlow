import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

export type DialogIntent = 'danger' | 'warning' | 'info';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: React.ReactNode | string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  intent?: DialogIntent;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  intent = 'danger',
  isLoading = false,
}) => {
  const { language } = useApp();
  const isRTL = language === 'ar';

  // Handle escape key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onCancel();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  const intentConfig: Record<
    DialogIntent,
    {
      icon: React.ElementType;
      iconBg: string;
      iconColor: string;
      confirmBtn: string;
      borderGlow: string;
    }
  > = {
    danger: {
      icon: AlertOctagon,
      iconBg: 'bg-rose-500/15 border-rose-500/25',
      iconColor: 'text-rose-400',
      confirmBtn: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30',
      borderGlow: 'border-rose-500/30',
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-amber-500/15 border-amber-500/25',
      iconColor: 'text-amber-400',
      confirmBtn: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30',
      borderGlow: 'border-amber-500/30',
    },
    info: {
      icon: Info,
      iconBg: 'bg-blue-500/15 border-blue-500/25',
      iconColor: 'text-blue-400',
      confirmBtn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30',
      borderGlow: 'border-blue-500/30',
    },
  };

  const currentIntent = intentConfig[intent];
  const IconComponent = currentIntent.icon;

  const defaultConfirmText =
    confirmText ||
    (intent === 'danger'
      ? isRTL
        ? 'تأكيد الحذف / التعطيل'
        : 'Confirm'
      : isRTL
      ? 'موافق'
      : 'Continue');

  const defaultCancelText = cancelText || (isRTL ? 'إلغاء' : 'Cancel');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with smooth blur and fade-in */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={() => !isLoading && onCancel()}
      />

      {/* Dialog Card with scale-up and fade-in */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full max-w-md bg-slate-900 border ${currentIntent.borderGlow} rounded-2xl p-6 shadow-2xl z-10 transition-all transform scale-100 animate-scale-up text-start select-none`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Close Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={onCancel}
          className={`absolute top-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ${
            isRTL ? 'left-4' : 'right-4'
          }`}
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon + Title */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0 ${currentIntent.iconBg} ${currentIntent.iconColor}`}
          >
            <IconComponent className="w-6 h-6" />
          </div>
          <div className="min-w-0 pr-6">
            <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
              {title}
            </h3>
            <div className="text-sm text-slate-400 mt-1 leading-relaxed">
              {description}
            </div>
          </div>
        </div>

        {/* Buttons / Actions */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            {defaultCancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${currentIntent.confirmBtn} disabled:opacity-50`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>{defaultConfirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
