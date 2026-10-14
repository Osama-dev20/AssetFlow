import React, { useState, useEffect, useRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronLeft, Play, Pause } from 'lucide-react';

// Define the type for a single gallery item
export interface GalleryItem {
  common: string;
  binomial: string;
  photo: {
    url: string;
    text: string;
    pos?: string;
    by: string;
  };
  href?: string;
  badge?: string;
}

// Define the props for the CircularGallery component
export interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  /** Controls how far the items are from the center. */
  radius?: number;
  /** Timer interval in milliseconds between auto card turns. Defaults to 3400ms. */
  intervalMs?: number;
  /** Whether auto-rotation timer is enabled by default. Defaults to true. */
  autoPlay?: boolean;
  onItemClick?: (item: GalleryItem, index: number) => void;
  onActiveChange?: (index: number, item: GalleryItem) => void;
  showControls?: boolean;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  (
    {
      items,
      className,
      radius = 640,
      intervalMs = 3400,
      autoPlay = true,
      onItemClick,
      onActiveChange,
      showControls = true,
      ...props
    },
    ref
  ) => {
    const count = items.length;
    const anglePerItem = count > 0 ? 360 / count : 0;

    const [rotation, setRotation] = useState(0);
    const [isPaused, setIsPaused] = useState(!autoPlay);
    const [responsiveRadius, setResponsiveRadius] = useState(radius);
    const touchStartX = useRef<number | null>(null);

    // Responsive radius handling for mobile, tablet & desktop
    useEffect(() => {
      const updateRadius = () => {
        const w = window.innerWidth;
        if (w < 640) {
          setResponsiveRadius(350);
        } else if (w < 1024) {
          setResponsiveRadius(470);
        } else {
          setResponsiveRadius(radius || 580);
        }
      };
      updateRadius();
      window.addEventListener('resize', updateRadius);
      return () => window.removeEventListener('resize', updateRadius);
    }, [radius]);

    // Calculate currently active front item index
    const activeIndex = count > 0 ? (Math.round(-rotation / anglePerItem) % count + count) % count : 0;

    // Notify parent on active item change
    useEffect(() => {
      if (items[activeIndex]) {
        onActiveChange?.(activeIndex, items[activeIndex]);
      }
    }, [activeIndex, items, onActiveChange]);

    // Continuous Automatic Rotation: Cards cycle automatically by timer without freezing on hover
    useEffect(() => {
      if (isPaused || count === 0) return;

      const timer = setInterval(() => {
        setRotation((prev) => prev - anglePerItem);
      }, intervalMs);

      return () => clearInterval(timer);
    }, [isPaused, anglePerItem, intervalMs, count]);

    const handleNext = () => {
      setRotation((prev) => prev - anglePerItem);
    };

    const handlePrev = () => {
      setRotation((prev) => prev + anglePerItem);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchStartX.current - touchEndX;
      if (Math.abs(diffX) > 40) {
        if (diffX > 0) {
          setRotation((prev) => prev - anglePerItem);
        } else {
          setRotation((prev) => prev + anglePerItem);
        }
      }
      touchStartX.current = null;
    };

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Circular 3D Gallery"
        className={cn(
          "relative w-full h-full flex items-center justify-center overflow-hidden select-none",
          className
        )}
        style={{ perspective: "2200px" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        {/* 3D Rotating Cylinder with Ultra-Smooth Physics Easing */}
        <div
          className="relative w-full h-full [transform-style:preserve-3d] transition-transform duration-800 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: `rotateY(${rotation}deg)`,
            willChange: "transform",
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            // Angular distance from the front viewer (0 degrees)
            const currentRotNormalized = ((-rotation % 360) + 360) % 360;
            const diffAngle = Math.abs(((itemAngle - currentRotNormalized + 180) % 360) - 180);

            const isFront = diffAngle < 24;
            const isBack = diffAngle > 70;

            // Transparency depth: Front card is 100% opaque; back curving cards are gracefully semi-transparent
            const opacity = isFront ? 1 : isBack ? 0.36 : 0.72;
            const scale = isFront ? 1.04 : isBack ? 0.88 : 0.96;

            return (
              <div
                key={item.photo.url + i}
                role="group"
                aria-label={item.common}
                className={cn(
                  "absolute w-[255px] sm:w-[285px] md:w-[315px] h-[340px] sm:h-[375px] md:h-[405px] transition-all duration-700 cursor-pointer",
                  isFront ? "z-30 cursor-default" : "z-10 hover:opacity-85"
                )}
                style={{
                  transform: `translate(-50%, -50%) rotateY(${itemAngle}deg) translateZ(${responsiveRadius}px) scale(${scale})`,
                  left: "50%",
                  top: "44%",
                  opacity: opacity,
                  willChange: "transform, opacity",
                  backfaceVisibility: "visible",
                }}
                onClick={(e) => {
                  if (onItemClick) {
                    onItemClick(item, i);
                  } else if (!isFront) {
                    // Clicking an angled or back card smoothly rotates it to front
                    e.stopPropagation();
                    const targetAngle = -itemAngle;
                    setRotation(targetAngle);
                  }
                }}
              >
                <div
                  className={cn(
                    "relative w-full h-full rounded-2xl shadow-2xl overflow-hidden group border backdrop-blur-xl transition-all duration-500",
                    isFront
                      ? "border-emerald-400/90 shadow-[0_0_55px_rgba(46,175,125,0.4),0_25px_60px_-15px_rgba(0,0,0,0.95)] bg-slate-900/90 ring-2 ring-emerald-400/50"
                      : "border-slate-800/80 bg-slate-950/75 hover:border-slate-600/80"
                  )}
                >
                  <img
                    src={item.photo.url}
                    alt={item.photo.text}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ objectPosition: item.photo.pos || "center" }}
                    draggable={false}
                  />

                  {/* Top Badge */}
                  {item.badge && (
                    <div className="absolute top-3.5 end-3.5 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-950/85 text-emerald-300 border border-emerald-500/35 backdrop-blur-md shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {item.badge}
                      </span>
                    </div>
                  )}

                  {/* Gradient Scrim & Info Content (Always horizontal, clean, elegant) */}
                  <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent text-white">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-white drop-shadow whitespace-normal leading-snug">
                        {item.common}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-300 bg-slate-900/90 px-2 py-0.5 rounded-full border border-slate-700 shrink-0">
                        #{String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <em className="text-xs sm:text-sm text-cyan-300 font-medium not-italic opacity-90 block leading-tight">
                      {item.binomial}
                    </em>
                    {item.photo.by && (
                      <p className="text-[11px] mt-2 text-slate-400 opacity-80 leading-normal">
                        {item.photo.by}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Controls (Prev / Next & Play/Pause auto-timer) */}
        {showControls && (
          <>
            <div className="absolute inset-y-0 left-4 sm:left-6 flex items-center z-40 pointer-events-none">
              <button
                type="button"
                onClick={handlePrev}
                className="pointer-events-auto p-3 rounded-full bg-slate-900/85 hover:bg-blue-600 text-white/90 hover:text-white border border-slate-700/80 hover:border-blue-500 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                title="السابق"
                aria-label="Previous Item"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="absolute inset-y-0 right-4 sm:right-6 flex items-center z-40 pointer-events-none">
              <button
                type="button"
                onClick={handleNext}
                className="pointer-events-auto p-3 rounded-full bg-slate-900/85 hover:bg-blue-600 text-white/90 hover:text-white border border-slate-700/80 hover:border-blue-500 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                title="التالي"
                aria-label="Next Item"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Subtle auto-play status indicator / toggle at top right */}
            <div className="absolute top-4 end-4 z-40">
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300 backdrop-blur-md transition-all cursor-pointer shadow-lg"
                title={isPaused ? "تشغيل الدوران التلقائي" : "إيقاف مؤقت للدوران"}
              >
                {isPaused ? (
                  <>
                    <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                    <span>تشغيل العرض التلقائي</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                    <span>عرض تلقائي نشط</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';

export { CircularGallery };
export default CircularGallery;
