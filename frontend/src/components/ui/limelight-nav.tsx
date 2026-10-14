import React, { useState, useRef, useLayoutEffect, cloneElement, useEffect } from 'react';
import { cn } from '@/lib/utils';

// --- Internal Types and Defaults ---

const DefaultHomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);
const DefaultCompassIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
  </svg>
);
const DefaultBellIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export type NavItem = {
  id: string | number;
  icon: React.ReactElement;
  label?: string;
  onClick?: () => void;
  href?: string;
};

const defaultNavItems: NavItem[] = [
  { id: 'default-home', icon: <DefaultHomeIcon />, label: 'Home' },
  { id: 'default-explore', icon: <DefaultCompassIcon />, label: 'Explore' },
  { id: 'default-notifications', icon: <DefaultBellIcon />, label: 'Notifications' },
];

export type LimelightNavProps = {
  items?: NavItem[];
  defaultActiveIndex?: number;
  activeIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
  limelightClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
  showLabels?: boolean;
};

/**
 * An adaptive-width navigation bar with a "limelight" spotlight effect that highlights the active item.
 * Supports both controlled (`activeIndex`) and uncontrolled (`defaultActiveIndex`) usage.
 */
export const LimelightNav = ({
  items = defaultNavItems,
  defaultActiveIndex = 0,
  activeIndex: controlledActiveIndex,
  onTabChange,
  className,
  limelightClassName,
  iconContainerClassName,
  iconClassName,
  showLabels = false,
}: LimelightNavProps) => {
  const [internalActiveIndex, setInternalActiveIndex] = useState(defaultActiveIndex);
  const activeIndex = controlledActiveIndex !== undefined ? controlledActiveIndex : internalActiveIndex;

  const [isReady, setIsReady] = useState(false);
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement | null>(null);

  const updateLimelightPosition = () => {
    if (items.length === 0) return;

    const limelight = limelightRef.current;
    const activeItem = navItemRefs.current[activeIndex];

    if (limelight && activeItem) {
      const newLeft = activeItem.offsetLeft;
      const newWidth = activeItem.offsetWidth;
      limelight.style.left = `${newLeft}px`;
      limelight.style.width = `${newWidth}px`;

      if (!isReady) {
        setTimeout(() => setIsReady(true), 50);
      }
    }
  };

  useLayoutEffect(() => {
    updateLimelightPosition();
  }, [activeIndex, isReady, items]);

  // Recalculate on window resize or font load
  useEffect(() => {
    const handleResize = () => updateLimelightPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex, items]);

  if (items.length === 0) {
    return null;
  }

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
    if (controlledActiveIndex === undefined) {
      setInternalActiveIndex(index);
    }
    onTabChange?.(index);
    itemOnClick?.();
  };

  return (
    <nav
      className={cn(
        "relative inline-flex items-center h-14 sm:h-16 rounded-full bg-slate-950/80 text-foreground border border-slate-800/80 backdrop-blur-xl px-2 shadow-2xl overflow-hidden",
        className
      )}
    >
      {items.map(({ id, icon, label, onClick, href }, index) => {
        const isActive = activeIndex === index;
        return (
          <a
            key={id}
            href={href || undefined}
            ref={(el) => (navItemRefs.current[index] = el)}
            className={cn(
              "relative z-20 flex h-full cursor-pointer items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-colors duration-300 select-none whitespace-nowrap",
              isActive ? "text-white font-bold" : "text-slate-400 hover:text-slate-200",
              iconContainerClassName
            )}
            onClick={(e) => {
              if (!href || href.startsWith("#")) {
                e.preventDefault();
              }
              handleItemClick(index, onClick);
            }}
            aria-label={label}
          >
            {cloneElement(icon, {
              className: cn(
                "w-4 h-4 sm:w-5 sm:h-5 shrink-0 transition-all duration-300 ease-in-out",
                isActive
                  ? "opacity-100 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] scale-110"
                  : "opacity-45 text-slate-400 hover:opacity-75",
                icon.props.className,
                iconClassName
              ),
            })}
            {showLabels && label && (
              <span className={cn(
                "transition-all duration-300 whitespace-nowrap",
                isActive ? "text-white font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]" : "text-slate-400"
              )}>
                {label}
              </span>
            )}
          </a>
        );
      })}

      {/* Luminous White & Neon Spotlight Beam dynamically scaled to full word width */}
      <div
        ref={limelightRef}
        className={cn(
          "absolute top-0 z-10 h-[4px] sm:h-[5px] rounded-full bg-white shadow-[0_0_20px_#ffffff,0_0_35px_rgba(255,255,255,0.9),0_0_60px_rgba(56,189,248,0.6)]",
          isReady ? "transition-[left,width] duration-250 ease-out" : "",
          limelightClassName
        )}
        style={{ left: "-999px", width: "60px" }}
      >
        {/* Trapezoid radiant light cone shining downwards covering the entire active tab */}
        <div className="absolute left-[-15%] top-[4px] w-[130%] h-14 sm:h-16 [clip-path:polygon(0%_100%,10%_0,90%_0,100%_100%)] bg-gradient-to-b from-white/35 via-cyan-400/12 via-white/5 to-transparent pointer-events-none blur-[0.5px]" />
      </div>
    </nav>
  );
};

export default LimelightNav;
