import React from 'react';
import { assets } from '../../assets/assets';

interface AssetFlowLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const AssetFlowLogo: React.FC<AssetFlowLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const heights = {
    sm: 'h-7 sm:h-8',
    md: 'h-9 sm:h-10',
    lg: 'h-11 sm:h-13',
    xl: 'h-14 sm:h-16',
  }[size];

  return (
    <div className={`inline-flex items-center select-none group cursor-pointer ${className}`} title="AssetFlow">
      <img
        src={assets.logoDarkTheme}
        alt="AssetFlow"
        className={`${heights} w-auto object-contain transition-transform duration-300 group-hover:scale-105`}
      />
    </div>
  );
};

export default AssetFlowLogo;
