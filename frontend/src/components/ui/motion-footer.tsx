"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import {
  Activity,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowUp,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

// Register ScrollTrigger safely for React
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 1. THEME-ADAPTIVE INLINE STYLES (Tailored for AssetFlow Brand Identity)
// -------------------------------------------------------------------------
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

.cinematic-footer-wrapper {
  font-family: 'IBM Plex Sans Arabic', 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  
  --af-blue: #1d68bd;
  --af-emerald: #2eaf7d;
  --af-cyan: #38bdf8;
  --af-dark: #070b14;

  --pill-bg-1: rgba(15, 23, 42, 0.75);
  --pill-bg-2: rgba(10, 15, 28, 0.9);
  --pill-shadow: rgba(0, 0, 0, 0.7);
  --pill-highlight: rgba(56, 189, 248, 0.25);
  --pill-inset-shadow: rgba(0, 0, 0, 0.6);
  --pill-border: rgba(56, 189, 248, 0.2);
  
  --pill-bg-1-hover: rgba(29, 104, 189, 0.2);
  --pill-bg-2-hover: rgba(46, 175, 125, 0.25);
  --pill-border-hover: rgba(46, 175, 125, 0.5);
  --pill-shadow-hover: rgba(0, 0, 0, 0.9);
  --pill-highlight-hover: rgba(46, 175, 125, 0.4);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.55; }
  100% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.9; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 6px rgba(239, 68, 68, 0.6)); }
  15%, 45% { transform: scale(1.28); filter: drop-shadow(0 0 14px rgba(239, 68, 68, 0.9)); }
  30% { transform: scale(1.05); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 35s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 1.8s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

/* Theme-adaptive Grid Background */
.footer-bg-grid {
  background-size: 60px 60px;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
}

/* AssetFlow Aurora Glow */
.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    rgba(29, 104, 189, 0.25) 0%, 
    rgba(46, 175, 125, 0.18) 40%, 
    transparent 72%
  );
}

/* Glass Pill Theming */
.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow: 
      0 10px 30px -10px var(--pill-shadow), 
      inset 0 1px 1px var(--pill-highlight), 
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow: 
      0 20px 40px -10px var(--pill-shadow-hover), 
      inset 0 1px 2px var(--pill-highlight-hover);
  color: #ffffff;
  transform: translateY(-2px);
}

/* Giant Background Text Masking */
.footer-giant-bg-text {
  font-size: 23vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.06);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(46, 175, 125, 0.02) 60%, transparent 100%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Metallic Text Glow */
.footer-text-glow {
  background: linear-gradient(180deg, #ffffff 10%, #93c5fd 65%, #2eaf7d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 35px rgba(29, 104, 189, 0.45));
}
`;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE (Zero Dependency)
// -------------------------------------------------------------------------
export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & 
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.35,
            y: y * 0.35,
            rotationX: -y * 0.12,
            rotationY: x * 0.12,
            scale: 1.04,
            ease: "power2.out",
            duration: 0.35,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
          });
        };

        element.addEventListener("mousemove", handleMouseMove as any);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove as any);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement) => {
          (localRef as any).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as any).current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// 3. MAIN COMPONENT (Motion Footer for AssetFlow)
// -------------------------------------------------------------------------
const MarqueeItem = ({ isRTL }: { isRTL: boolean }) => (
  <div className="flex items-center space-x-12 rtl:space-x-reverse px-6">
    <span>{isRTL ? "منظومة الأصول الحيوية" : "Mission-Critical CMMS"}</span> <span className="text-emerald-400">✦</span>
    <span>{isRTL ? "جاهزية تشغيلية 99.98%" : "99.98% Guaranteed Uptime"}</span> <span className="text-blue-400">✦</span>
    <span>{isRTL ? "استيعاب SCADA اللحظي" : "Real-Time SCADA Telemetry"}</span> <span className="text-cyan-400">✦</span>
    <span>{isRTL ? "تشخيص الأعطال بالـ AI" : "AI Diagnostic Predictive Engine"}</span> <span className="text-emerald-400">✦</span>
    <span>{isRTL ? "أوامر عمل مؤتمتة 100%" : "Autonomous Work Order Dispatch"}</span> <span className="text-blue-400">✦</span>
  </div>
);

export function CinematicFooter() {
  const { language } = useApp();
  const isRTL = language === "ar";

  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      // Background Parallax for Giant Text
      gsap.fromTo(
        giantTextRef.current,
        { y: "12vh", scale: 0.85, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      // Staggered Content Reveal
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 45%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      
      {/* 
        The "Curtain Reveal" Wrapper:
        It sits in standard document flow. With clip-path, its contents
        are cleanly masked within its bounding box.
      */}
      <div
        ref={wrapperRef}
        className="relative min-h-[90vh] md:min-h-screen w-full bg-[#040711]"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* The actual footer stays fixed to the viewport underneath everything */}
        <footer className="fixed bottom-0 left-0 flex h-full min-h-[90vh] md:min-h-screen w-full flex-col justify-between overflow-hidden bg-[#040711] text-slate-100 cinematic-footer-wrapper border-t border-slate-800/80">
          
          {/* Ambient Light & Grid Background */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[90px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

          {/* Giant background brand text */}
          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute -bottom-[4vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none tracking-widest"
          >
            ASSETFLOW
          </div>

          {/* 1. Diagonal Sleek Marquee (Top of footer) */}
          <div className="absolute top-10 left-0 w-full overflow-hidden border-y border-slate-800/80 bg-slate-950/70 backdrop-blur-md py-3.5 z-10 -rotate-1 scale-105 shadow-2xl">
            <div className="flex w-max animate-footer-scroll-marquee text-xs md:text-sm font-bold tracking-[0.25em] text-slate-300 uppercase">
              <MarqueeItem isRTL={isRTL} />
              <MarqueeItem isRTL={isRTL} />
            </div>
          </div>

          {/* 2. Main Center Content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-24 w-full max-w-5xl mx-auto text-center">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-300 text-xs font-bold mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>
                {isRTL
                  ? "منظومة إدارة الأصول والخدمات الحيوية المتقدمة"
                  : "Unified Enterprise Critical Infrastructure Platform"}
              </span>
            </div>

            <h2
              ref={headingRef}
              className="text-4xl sm:text-6xl md:text-7xl font-black footer-text-glow tracking-tight leading-tight mb-8"
            >
              {isRTL ? "جاهز لحماية استمرارية أصولك؟" : "Ready to protect critical uptime?"}
            </h2>

            <p className="max-w-2xl text-slate-300 text-sm sm:text-base leading-relaxed mb-10">
              {isRTL
                ? "انضم إلى كبرى المنشآت الطبية وشبكات المياه والطاقة التي تعتمد على AssetFlow للتنبؤ بالأعطال وضمان استمرارية التشغيل على مدار الساعة."
                : "Empower your facilities, medical networks, and power grids with automated AI diagnostics and zero unscheduled downtime."}
            </p>

            {/* Interactive Magnetic Action Pills */}
            <div ref={linksRef} className="flex flex-col items-center gap-5 w-full">
              {/* Primary Direct Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4 w-full">
                <Link to="/login">
                  <MagneticButton className="footer-glass-pill px-8 py-4 rounded-full text-white font-bold text-sm md:text-base flex items-center gap-3 group shadow-xl">
                    <Activity className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>{isRTL ? "الدخول المباشر إلى المنصة" : "Enter Platform Now"}</span>
                  </MagneticButton>
                </Link>

                <Link to="/contact">
                  <MagneticButton className="footer-glass-pill px-8 py-4 rounded-full text-white font-bold text-sm md:text-base flex items-center gap-3 group shadow-xl">
                    <ShieldCheck className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span>{isRTL ? "طلب استشارة هندسية للمنشأة" : "Request Enterprise Demo"}</span>
                  </MagneticButton>
                </Link>

                <a href="#how-it-works">
                  <MagneticButton className="footer-glass-pill px-7 py-4 rounded-full text-slate-300 hover:text-white font-bold text-sm md:text-base flex items-center gap-2 group">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>{isRTL ? "محاكي العمليات 3D" : "3D Operational Machine"}</span>
                  </MagneticButton>
                </a>
              </div>

              {/* Secondary Navigation Links */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-6 w-full mt-2 text-xs font-semibold text-slate-400">
                <Link to="/dashboard/assets">
                  <MagneticButton className="footer-glass-pill px-5 py-2.5 rounded-full hover:text-emerald-300">
                    {isRTL ? "سجل الأصول" : "Asset Registry"}
                  </MagneticButton>
                </Link>
                <Link to="/dashboard/services">
                  <MagneticButton className="footer-glass-pill px-5 py-2.5 rounded-full hover:text-blue-300">
                    {isRTL ? "الخدمات الحيوية" : "Critical Services"}
                  </MagneticButton>
                </Link>
                <Link to="/dashboard/work-orders">
                  <MagneticButton className="footer-glass-pill px-5 py-2.5 rounded-full hover:text-cyan-300">
                    {isRTL ? "أوامر العمل" : "Work Orders"}
                  </MagneticButton>
                </Link>
                <Link to="/contact">
                  <MagneticButton className="footer-glass-pill px-5 py-2.5 rounded-full hover:text-white">
                    {isRTL ? "الدعم الهندسي" : "Engineering Support"}
                  </MagneticButton>
                </Link>
              </div>
            </div>
          </div>

          {/* 3. Bottom Bar / Credits */}
          <div className="relative z-20 w-full pb-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-800/60 pt-6">
            
            {/* Copyright */}
            <div className="text-slate-400 text-[11px] md:text-xs font-semibold tracking-wider order-2 md:order-1">
              {isRTL
                ? "© 2026 منصة AssetFlow. كافة الحقوق محفوظة."
                : "© 2026 AssetFlow Enterprise. All rights reserved."}
            </div>

            {/* "Made with Love" Badge -> Customized as requested: "بُني بحُب ❤" */}
            <div className="footer-glass-pill px-6 py-2.5 rounded-full flex items-center gap-2 order-1 md:order-2 cursor-default border-slate-800/80 shadow-md">
              <span className="text-slate-300 text-xs md:text-sm font-bold tracking-wide">
                {isRTL ? "بُني بحُب" : "Built with love"}
              </span>
              <span className="animate-footer-heartbeat text-base md:text-lg text-rose-500">
                ❤
              </span>
              <span className="text-emerald-400 font-bold text-xs md:text-sm ml-1">
                {isRTL ? "للأصول الحيوية" : "for Critical Assets"}
              </span>
            </div>

            {/* Back to top Button */}
            <MagneticButton
              as="button"
              onClick={scrollToTop}
              className="w-11 h-11 rounded-full footer-glass-pill flex items-center justify-center text-slate-300 hover:text-white group order-3 shadow-lg"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform duration-300 text-emerald-400" />
            </MagneticButton>

          </div>
        </footer>
      </div>
    </>
  );
}

export const MotionFooter = CinematicFooter;
export default CinematicFooter;
