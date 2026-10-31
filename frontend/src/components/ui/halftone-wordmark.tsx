"use client";

import React, { useEffect, useRef } from "react";
import { soundManager } from "@/lib/soundEffects";

export interface HalftoneWordmarkProps {
  wordmark?: string;
  dotGap?: number;
  radius?: number;
  crop?: number;
  grain?: number;
  interactive?: boolean;
  fontFamily?: string;
  fontWeight?: number;
  height?: string;
  className?: string;
  useBrandGradient?: boolean;
}

export function HalftoneWordmark({
  wordmark = "assetflow",
  dotGap = 6,
  radius = 95,
  crop = 0,
  grain = 0.35,
  interactive = true,
  fontFamily = '"Outfit", "Plus Jakarta Sans", "IBM Plex Sans Arabic", system-ui, -apple-system, sans-serif',
  fontWeight = 800,
  height = "clamp(140px, 24vw, 440px)",
  className = "",
  useBrandGradient = true,
}: HalftoneWordmarkProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let px = -1e5;
    let py = -1e5;
    let raf = 0;
    let visible = true;
    let awake = true;
    let ring = { x: 0, y: 0, t: -1 };
    let dots = new Float32Array(0);
    let count = 0;
    let grainTile: HTMLCanvasElement | null = null;

    // Platform gradient stops: #2563EB -> #22C7B8 -> #34D399
    const brandColor0 = [37, 99, 235];    // Blue
    const brandColor1 = [34, 199, 184];   // Teal
    const brandColor2 = [52, 211, 153];   // Emerald

    const layout = () => {
      const rect = root.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      const mask = document.createElement("canvas");
      mask.width = w;
      mask.height = h;
      const m = mask.getContext("2d", { willReadFrequently: true });
      if (!m) return;

      m.font = `${fontWeight} 100px ${fontFamily}`;
      const measured = m.measureText(wordmark).width;
      // Calculate font size that boldly stretches across the available width (95% container coverage)
      const scaleW = measured > 0 ? (w * 0.95 / measured) * 100 : 120;
      // Let font height expand to fill up to 88% of the canvas height without clipping
      const fit = Math.min(scaleW, h * 0.88);
      m.font = `${fontWeight} ${fit}px ${fontFamily}`;
      const box = m.measureText(wordmark);
      const ascent = box.actualBoundingBoxAscent || fit * 0.72;
      const descent = box.actualBoundingBoxDescent || fit * 0.22;
      const textH = ascent + descent;

      m.fillStyle = "#000";
      m.textBaseline = "alphabetic";
      // Center horizontally and vertically within the canvas so 100% of all letters are completely visible
      const textX = (w - box.width) / 2;
      const textY = (h - textH) / 2 + ascent;
      m.fillText(wordmark, textX, textY);
      const img = m.getImageData(0, 0, w, h).data;

      const gap = Math.max(3, dotGap);
      const cols = Math.ceil(w / gap);
      const rows = Math.ceil(h / gap);
      const tmp: number[] = [];

      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          let sum = 0;
          for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
              const x = Math.min(w - 1, Math.floor(gx * gap + ((sx + 0.5) * gap) / 3));
              const y = Math.min(h - 1, Math.floor(gy * gap + ((sy + 0.5) * gap) / 3));
              sum += img[(y * w + x) * 4 + 3];
            }
          }
          const cov = sum / (9 * 255);
          if (cov < 0.06) continue;
          const hx = gx * gap + gap / 2;
          const hy = gy * gap + gap / 2;
          const r0 = Math.sqrt(cov) * gap * 0.56;
          tmp.push(hx, hy, 0, 0, hx, hy, r0);
        }
      }
      dots = new Float32Array(tmp);
      count = tmp.length / 7;

      grainTile = document.createElement("canvas");
      grainTile.width = 256;
      grainTile.height = 256;
      const g = grainTile.getContext("2d");
      if (g) {
        const id = g.createImageData(256, 256);
        for (let i = 0; i < id.data.length; i += 4) {
          const v = Math.random() * 255;
          id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
          id.data[i + 3] = Math.random() < 0.5 ? 0 : 255;
        }
        g.putImageData(id, 0, 0);
      }
      awake = true;
    };

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const r = interactive && !reduced ? Math.max(0, radius) : 0;
      const ringAge = ring.t < 0 ? 1e9 : now - ring.t;
      const ringR = ringAge * 0.95;
      let moving = false;

      for (let i = 0; i < count; i++) {
        const j = i * 7;
        let x = dots[j];
        let y = dots[j + 1];
        let vx = dots[j + 2];
        let vy = dots[j + 3];
        const hx = dots[j + 4];
        const hy = dots[j + 5];

        if (!reduced) {
          if (ringAge < 900) {
            const dx = hx - ring.x;
            const dy = hy - ring.y;
            const d = Math.sqrt(dx * dx + dy * dy) + 0.001;
            const band = 1 - Math.min(1, Math.abs(d - ringR) / 26);
            if (band > 0) {
              const f = band * 3.4 * (1 - ringAge / 900);
              vx += (dx / d) * f;
              vy += (dy / d) * f;
            }
          }

          const dx = x - px;
          const dy = y - py;
          const d2 = dx * dx + dy * dy;
          if (r > 0 && d2 < r * r) {
            const d = Math.sqrt(d2) + 0.001;
            const f = (1 - d / r) * 2.6;
            vx += (dx / d) * f;
            vy += (dy / d) * f;
          }
          vx = (vx + (hx - x) * 0.05) * 0.84;
          vy = (vy + (hy - y) * 0.05) * 0.84;

          x += vx;
          y += vy;

          if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) > 0.05) {
            moving = true;
          } else {
            x = hx;
            y = hy;
            vx = 0;
            vy = 0;
          }
          dots[j] = x;
          dots[j + 1] = y;
          dots[j + 2] = vx;
          dots[j + 3] = vy;
        }

        const dDisp = Math.hypot(x - hx, y - hy);
        const k = dDisp > 0 ? Math.min(1, dDisp / 28) : 0;

        if (useBrandGradient) {
          const t = Math.min(1, Math.max(0, hx / w));
          let br: number, bg: number, bb: number;
          if (t < 0.5) {
            const u = t / 0.5;
            br = brandColor0[0] + (brandColor1[0] - brandColor0[0]) * u;
            bg = brandColor0[1] + (brandColor1[1] - brandColor0[1]) * u;
            bb = brandColor0[2] + (brandColor1[2] - brandColor0[2]) * u;
          } else {
            const u = (t - 0.5) / 0.5;
            br = brandColor1[0] + (brandColor2[0] - brandColor1[0]) * u;
            bg = brandColor1[1] + (brandColor2[1] - brandColor1[1]) * u;
            bb = brandColor1[2] + (brandColor2[2] - brandColor1[2]) * u;
          }

          if (k > 0.02) {
            const rW = Math.round(br + (255 - br) * k);
            const gW = Math.round(bg + (255 - bg) * k);
            const bW = Math.round(bb + (255 - bb) * k);
            ctx.fillStyle = `rgb(${rW},${gW},${bW})`;
          } else {
            ctx.fillStyle = `rgb(${Math.round(br)},${Math.round(bg)},${Math.round(bb)})`;
          }
        } else {
          ctx.fillStyle = k > 0.02 ? "#38bdf8" : "#E6EDF7";
        }

        ctx.beginPath();
        ctx.arc(x, y, dots[j + 6], 0, 6.2832);
        ctx.fill();
      }

      if (grainTile && grain > 0) {
        ctx.globalAlpha = Math.min(1, grain) * 0.07;
        ctx.globalCompositeOperation = "overlay";
        const pattern = ctx.createPattern(grainTile, "repeat");
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, w, h);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      }

      awake = moving || ringAge < 900 || px > -1e4;
    };

    const loop = (now: number) => {
      raf = 0;
      if (!visible) return;
      draw(now);
      if (awake) raf = requestAnimationFrame(loop);
    };

    const wake = () => {
      awake = true;
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };

    const toLocal = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      return [e.clientX - b.left, e.clientY - b.top];
    };

    const onMove = (e: PointerEvent) => {
      if (!interactive) return;
      const p = toLocal(e);
      px = p[0];
      py = p[1];
      wake();
    };

    const onLeave = () => {
      px = -1e5;
      py = -1e5;
      wake();
    };

    const onDown = (e: PointerEvent) => {
      if (!interactive || reduced) return;
      const p = toLocal(e);
      ring = { x: p[0], y: p[1], t: performance.now() };
      soundManager.playShockwave();
      wake();
    };

    layout();
    draw(performance.now());
    wake();

    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        layout();
        wake();
      });
    }

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointerdown", onDown);
    const ro = new ResizeObserver(() => {
      layout();
      wake();
    });
    ro.observe(root);
    const io = new IntersectionObserver((entries) => {
      visible = entries[0] ? entries[0].isIntersecting : true;
      if (visible) wake();
    });
    io.observe(root);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerdown", onDown);
    };
  }, [wordmark, dotGap, radius, crop, grain, interactive, fontFamily, fontWeight, useBrandGradient]);

  return (
    <div
      ref={rootRef}
      dir="ltr"
      className={`relative w-full overflow-hidden select-none cursor-pointer ${className}`}
      style={{ height }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}

export default HalftoneWordmark;
