import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertOctagon, Clock, Wrench, Shield, Circle } from 'lucide-react';

export type ChipVariant =
  | 'active'
  | 'inactive'
  | 'maintenance'
  | 'operational'
  | 'degraded'
  | 'out_of_service'
  | 'pending'
  | 'high'
  | 'critical'
  | 'medium'
  | 'low'
  | 'admin'
  | 'technician'
  | 'reporter'
  | string;

interface StatusChipProps {
  status?: ChipVariant;
  criticality?: 'high' | 'medium' | 'low' | string;
  label?: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  criticality,
  label,
  size = 'md',
  showDot = true,
  className = '',
}) => {
  const { language } = useApp();
  const isRTL = language === 'ar';

  const rawValue = (criticality || status || '').toLowerCase().trim();

  // Style configurations with soft tailwind colors
  let styles = 'bg-slate-800 text-slate-300 border-slate-700';
  let defaultLabelAr = rawValue;
  let defaultLabelEn = rawValue;
  let Icon: React.ElementType | null = null;

  switch (rawValue) {
    case 'active':
    case 'operational':
      styles = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25';
      defaultLabelAr = 'نشط / يعمل';
      defaultLabelEn = 'Active';
      Icon = CheckCircle2;
      break;

    case 'inactive':
    case 'out_of_service':
      styles = 'bg-rose-500/15 text-rose-300 border-rose-500/25';
      defaultLabelAr = 'غير نشط / متوقف';
      defaultLabelEn = 'Inactive';
      Icon = AlertOctagon;
      break;

    case 'maintenance':
      styles = 'bg-amber-500/15 text-amber-300 border-amber-500/25';
      defaultLabelAr = 'تحت الصيانة';
      defaultLabelEn = 'In Maintenance';
      Icon = Wrench;
      break;

    case 'degraded':
      styles = 'bg-orange-500/15 text-orange-300 border-orange-500/25';
      defaultLabelAr = 'أداء متأثر';
      defaultLabelEn = 'Degraded';
      Icon = AlertTriangle;
      break;

    case 'pending':
      styles = 'bg-sky-500/15 text-sky-300 border-sky-500/25';
      defaultLabelAr = 'قيد المراجعة';
      defaultLabelEn = 'Pending';
      Icon = Clock;
      break;

    // Criticality
    case 'high':
    case 'critical':
      styles = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      defaultLabelAr = 'حرجة للغاية (High)';
      defaultLabelEn = 'High Criticality';
      Icon = AlertTriangle;
      break;

    case 'medium':
      styles = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      defaultLabelAr = 'متوسطة (Medium)';
      defaultLabelEn = 'Medium Criticality';
      Icon = AlertTriangle;
      break;

    case 'low':
      styles = 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      defaultLabelAr = 'عادية (Low)';
      defaultLabelEn = 'Low Criticality';
      Icon = CheckCircle2;
      break;

    // Roles
    case 'admin':
      styles = 'bg-blue-500/15 text-blue-300 border-blue-500/25';
      defaultLabelAr = 'مدير النظام (Admin)';
      defaultLabelEn = 'Administrator';
      Icon = Shield;
      break;

    case 'technician':
      styles = 'bg-amber-500/15 text-amber-300 border-amber-500/25';
      defaultLabelAr = 'فني صيانة (Tech)';
      defaultLabelEn = 'Technician';
      Icon = Wrench;
      break;

    case 'reporter':
      styles = 'bg-teal-500/15 text-teal-300 border-teal-500/25';
      defaultLabelAr = 'مبلّغ (Reporter)';
      defaultLabelEn = 'Reporter';
      break;

    default:
      styles = 'bg-slate-700/50 text-slate-300 border-slate-600/50';
      defaultLabelAr = rawValue;
      defaultLabelEn = rawValue;
  }

  const displayText = label || (isRTL ? defaultLabelAr : defaultLabelEn);
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border tracking-wide whitespace-nowrap shadow-xs transition-colors ${sizeClasses} ${styles} ${className}`}
    >
      {showDot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 animate-pulse" />
      )}
      <span>{displayText}</span>
    </span>
  );
};
