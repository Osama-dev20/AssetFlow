"use client";

import React, { useEffect, useRef, ReactNode } from "react";

export type GlowColor = "blue" | "purple" | "green" | "red" | "orange" | "cyan" | "gold";

export interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  glowColor?: GlowColor;
  size?: "sm" | "md" | "lg";
  width?: string | number;
  height?: string | number;
  customSize?: boolean;
}

const glowColorMap: Record<GlowColor, { base: number; spread: number; sat?: number; light?: number }> = {
  blue: { base: 215, spread: 40, sat: 95, light: 60 },
  cyan: { base: 180, spread: 35, sat: 90, light: 55 },
  green: { base: 155, spread: 35, sat: 85, light: 55 },
  purple: { base: 275, spread: 50, sat: 90, light: 65 },
  orange: { base: 35, spread: 30, sat: 95, light: 55 },
  red: { base: 0, spread: 30, sat: 90, light: 55 },
  gold: { base: 42, spread: 25, sat: 100, light: 60 },
};

const sizeMap = {
  sm: "w-48 h-64",
  md: "w-64 h-80",
  lg: "w-80 h-96",
};

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = "",
  glowColor = "blue",
  size = "md",
  width,
  height,
  customSize = true,
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Don't listen to continuous pointer events on touch-only mobile devices (saves huge CPU/battery)
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;

    let rafId: number | null = null;
    const syncPointer = (e: PointerEvent) => {
      if (rafId !== null) return;
      const { clientX: x, clientY: y } = e;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (cardRef.current) {
          cardRef.current.style.setProperty("--x", x.toFixed(1));
          cardRef.current.style.setProperty("--y", y.toFixed(1));
        }
      });
    };

    window.addEventListener("pointermove", syncPointer, { passive: true });
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", syncPointer);
    };
  }, []);

  const colorConfig = glowColorMap[glowColor] || glowColorMap.blue;
  const { base, spread, sat = 100, light = 60 } = colorConfig;

  const getSizeClasses = () => {
    if (customSize) return "";
    return sizeMap[size];
  };

  const getInlineStyles = (): React.CSSProperties & Record<string, string | number> => {
    const baseStyles: React.CSSProperties & Record<string, string | number> = {
      "--base": base,
      "--spread": spread,
      "--saturation": sat,
      "--lightness": light,
      "--radius": "16",
      "--border": "1.5",
      "--backdrop": "rgba(13, 21, 38, 0.85)",
      "--backup-border": "rgba(30, 42, 68, 0.65)",
      "--size": "260",
      "--outer": "1",
      "--border-size": "calc(var(--border, 1.5) * 1px)",
      "--spotlight-size": "calc(var(--size, 260) * 1px)",
      "--hue": "calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))",
      backgroundImage: `radial-gradient(
        var(--spotlight-size) var(--spotlight-size) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 215) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 60) * 1%) / 0.12), transparent
      )`,
      backgroundColor: "var(--backdrop, rgba(13, 21, 38, 0.85))",
      backgroundSize: "calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))",
      backgroundPosition: "50% 50%",
      backgroundAttachment: "fixed",
      border: "var(--border-size) solid var(--backup-border)",
      position: "relative",
    };

    if (width !== undefined) {
      baseStyles.width = typeof width === "number" ? `${width}px` : width;
    }
    if (height !== undefined) {
      baseStyles.height = typeof height === "number" ? `${height}px` : height;
    }

    return baseStyles;
  };

  return (
    <>
      <div
        ref={cardRef}
        data-glow
        style={getInlineStyles()}
        className={`
          ${getSizeClasses()}
          ${!customSize ? "aspect-[3/4]" : ""}
          rounded-2xl 
          relative 
          shadow-xl
          p-5 
          backdrop-blur-md
          transition-all
          duration-300
          hover:shadow-2xl
          hover:-translate-y-1
          ${className}
        `}
        {...rest}
      >
        <div ref={innerRef} data-glow aria-hidden="true" />
        {children}
      </div>
    </>
  );
};

export default GlowCard;
