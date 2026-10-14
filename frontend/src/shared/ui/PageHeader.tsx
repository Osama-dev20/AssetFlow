import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plus } from 'lucide-react';
import { ShinyButton } from '../../components/ui/shiny-button';

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  actionText?: string;
  onAction?: () => void;
  actionIcon?: React.ElementType;
  secondaryAction?: React.ReactNode;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  actionText,
  onAction,
  actionIcon: ActionIcon = Plus,
  secondaryAction,
  children,
}) => {
  const { language } = useApp();
  const isRTL = language === 'ar';

  return (
    <div className="mb-6 sm:mb-8 flex flex-col gap-4 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title & Description */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {title}
            </h1>
            {badge && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/25">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-slate-400 font-normal max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {secondaryAction}

          {actionText && onAction && (
            <ShinyButton
              onClick={onAction}
              label={actionText}
              fillColor="#0f172a"
              accentColor="#1d68bd"
              accentSoftColor="#2eaf7d"
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-lg"
            >
              <ActionIcon className="w-4 h-4 text-emerald-400" />
              <span>{actionText}</span>
            </ShinyButton>
          )}
        </div>
      </div>

      {children}
    </div>
  );
};
