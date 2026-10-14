"use client";
import React, { useRef } from "react";

type GlowColor = "blue" | "teal" | "purple" | "green" | "red" | "orange";

export interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: GlowColor;
}

export function GlowCard({ glowColor = "blue", className = "", children, ...rest }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    if (rafRef.current !== null) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!cardRef.current) return;
      const s = cardRef.current.style;
      s.setProperty("--x", clientX.toFixed(1));
      s.setProperty("--xp", (clientX / window.innerWidth).toFixed(2));
      s.setProperty("--y", clientY.toFixed(1));
      s.setProperty("--yp", (clientY / window.innerHeight).toFixed(2));
    });
  };

  const handlePointerLeave = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  return (
    <div
      ref={cardRef}
      data-glow-card
      data-color={glowColor}
      className={`glow-card ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...rest}
    >
      <div className="glow-card__halo" aria-hidden="true" />
      {children}
    </div>
  );
}

export default GlowCard;
