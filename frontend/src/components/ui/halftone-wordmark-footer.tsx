"use client"

// Halftone Wordmark Footer — a site footer whose wordmark is set enormous and
// cropped by the bottom edge, printed as a field of halftone dots. Each dot is
// sized by how much of the letter covers its cell, so the type keeps its edges
// at any scale. Move across it and the dots part around the pointer on springs,
// warming in colour as they are pushed off their place; click and a shock ring
// runs through the word. Above it sit the studio line, tracked link columns and
// a back-to-top, separated by a hairline, all over a fine print grain.
//
// Integrated with AssetFlow Brand Gradient & tactile Web Audio synthesis.

import * as React from "react"
import { soundManager } from "@/lib/soundEffects"

export interface HalftonePalette {
  /** The footer background. */
  background: string
  /** The dots at rest, and the text. */
  ink: string
  /** The colour a dot warms toward as it is pushed off its place. */
  warm: string
}

export type HalftonePreset = "night" | "paper" | "ember" | "cobalt"

export interface FooterLink {
  label: string
  href?: string
  onClick?: (e: React.MouseEvent) => void
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

export interface HalftoneWordmarkFooterProps {
  /** The giant word printed in dots. Lowercase reads best. */
  wordmark?: string
  /** Top-left studio line. */
  label?: string
  /** The muted line under it. */
  meta?: string
  /** Link columns along the top. */
  columns?: FooterColumn[]
  /** Show the back-to-top link. It scrolls the window to 0. Defaults to true. */
  backToTop?: boolean
  /** Starting colours. Defaults to "night". */
  preset?: HalftonePreset
  /** Colour overrides, merged over the preset. */
  palette?: { background?: string; ink?: string; warm?: string }
  /** Enable platform signature gradient (#2563EB -> #22C7B8 -> #34D399) across the dots */
  useBrandGradient?: boolean
  /** Distance between dot centres, in CSS px. Defaults to 6. */
  dotGap?: number
  /** How far the pointer pushes, in CSS px. Defaults to 80. */
  radius?: number
  /** How much of the word's cap height hangs below the bottom edge, 0–0.6. Defaults to 0.2. */
  crop?: number
  /** Print grain over everything, 0–1. Defaults to 0.5. */
  grain?: number
  /** Pointer and click response. Defaults to true. */
  interactive?: boolean
  /** Face for the wordmark. Heavy grotesks print best. */
  fontFamily?: string
  /** Weight of the wordmark. Defaults to 800. */
  fontWeight?: number
  /** Face for the small type. */
  monoFamily?: string
  /** Root height. A definite length, never a percentage. */
  height?: string
  /** Extra root class names. */
  className?: string
  /** Optional custom content or newsletter placed in the footer header */
  children?: React.ReactNode
}

const PRESETS: { [K in HalftonePreset]: HalftonePalette } = {
  night: { background: "#060912", ink: "#e9e4da", warm: "#38bdf8" },
  paper: { background: "#efebe3", ink: "#17150f", warm: "#c2361c" },
  ember: { background: "#160a06", ink: "#f2c48c", warm: "#ff5a1f" },
  cobalt: { background: "#0d1b4d", ink: "#dfe7ff", warm: "#ffcd3c" },
}

const DEFAULT_COLUMNS_AR: FooterColumn[] = [
  { 
    title: "المنظومة", 
    links: [
      { label: "سجل الأصول", href: "#platform" }, 
      { label: "الخدمات الحيوية", href: "#services" }, 
      { label: "أوامر العمل", href: "#platform" },
      { label: "الصيانة الوقائية", href: "#platform" }
    ] 
  },
  { 
    title: "القطاعات", 
    links: [
      { label: "المستشفيات", href: "#sectors" }, 
      { label: "محطات المياه", href: "#sectors" }, 
      { label: "المصانع الصناعية", href: "#sectors" },
      { label: "الجامعات", href: "#sectors" }
    ] 
  },
  { 
    title: "الحساب", 
    links: [
      { label: "تسجيل الدخول", href: "#login" }, 
      { label: "إنشاء حساب تجريبي", href: "#signup" }, 
      { label: "الأسئلة الشائعة", href: "#faq" }
    ] 
  },
]

const DEFAULT_COLUMNS_EN: FooterColumn[] = [
  { 
    title: "Platform", 
    links: [
      { label: "Asset Registry", href: "#platform" }, 
      { label: "Critical Services", href: "#services" }, 
      { label: "Work Orders", href: "#platform" },
      { label: "Preventive PM", href: "#platform" }
    ] 
  },
  { 
    title: "Sectors", 
    links: [
      { label: "Hospitals", href: "#sectors" }, 
      { label: "Water Plants", href: "#sectors" }, 
      { label: "Manufacturing", href: "#sectors" },
      { label: "Universities", href: "#sectors" }
    ] 
  },
  { 
    title: "Account", 
    links: [
      { label: "Sign In", href: "#login" }, 
      { label: "Start Free Trial", href: "#signup" }, 
      { label: "FAQ", href: "#faq" }
    ] 
  },
]

const SANS_STACK = '"IBM Plex Sans Arabic", "Inter Tight", system-ui, sans-serif'
const MONO_STACK = '"IBM Plex Mono", "SF Mono", monospace'

// #region halftone
/** Hex → [r, g, b] in 0–255, or null for anything that isn't #rgb / #rrggbb. */
export function hwfHex(hex: string) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim())
  if (!m) return null
  const h = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1]
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

/** Dot radius for a cell coverage in [0, 1]: area-true, so tone stays even. */
export function hwfRadius(coverage: number, gap: number) {
  const c = coverage < 0 ? 0 : coverage > 1 ? 1 : coverage
  return Math.sqrt(c) * gap * 0.56
}

/**
 * One step of a dot's spring back to home, plus the push from a pointer at
 * (px, py) within radius r. Returns [x, y, vx, vy].
 */
export function hwfStep(
  x: number, y: number, vx: number, vy: number,
  hx: number, hy: number, px: number, py: number, r: number,
) {
  const dx = x - px
  const dy = y - py
  const d2 = dx * dx + dy * dy
  if (r > 0 && d2 < r * r) {
    const d = Math.sqrt(d2) + 0.001
    const f = (1 - d / r) * 2.6
    vx += (dx / d) * f
    vy += (dy / d) * f
  }
  vx = (vx + (hx - x) * 0.05) * 0.84
  vy = (vy + (hy - y) * 0.05) * 0.84
  return [x + vx, y + vy, vx, vy]
}

/** How warm a dot is drawn: 0 at home, 1 once it is `span` px or more away. */
export function hwfWarmth(x: number, y: number, hx: number, hy: number, span: number) {
  const d = Math.hypot(x - hx, y - hy)
  return span > 0 ? Math.min(1, d / span) : 0
}

/** Font size that sets `measured` (width at 100px) to fill `width` exactly. */
export function hwfFitSize(measured: number, width: number) {
  return measured > 0 ? (width / measured) * 100 : 0
}
// #endregion

const HWF_CSS = `
.hwf-root {
  position: relative; width: 100%; overflow: hidden; isolation: isolate;
  background: var(--hwf-bg); color: var(--hwf-ink); -webkit-font-smoothing: antialiased;
}
.hwf-root canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; max-width: none; }
.hwf-top {
  position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0, 1.4fr) repeat(3, minmax(0, 1fr));
  gap: 28px; padding: clamp(28px, 4vw, 48px) clamp(20px, 4vw, 56px) 0;
  font-family: var(--hwf-mono); font-size: 11px; letter-spacing: .08em; line-height: 1.75;
}
.hwf-brand strong { display: block; font-weight: 700; font-size: 14px; margin-bottom: 2px; }
.hwf-brand span { opacity: .65; font-size: 12px; }
.hwf-col h3 { margin: 0 0 10px 0; font: inherit; opacity: .8; font-weight: 700; color: #FFFFFF; font-size: 12px; }
.hwf-col ul { list-style: none; margin: 0; padding: 0; }
.hwf-col a, .hwf-up {
  color: inherit; text-decoration: none; opacity: .78; background: none; border: 0; padding: 0;
  font: inherit; letter-spacing: inherit; cursor: pointer;
  background-image: linear-gradient(currentColor, currentColor); background-size: 0% 1px;
  background-repeat: no-repeat; background-position: 0 100%; transition: opacity .25s ease, background-size .35s cubic-bezier(.2,.7,.1,1);
}
.hwf-col a:hover, .hwf-up:hover { opacity: 1; color: #60A5FA; background-size: 100% 1px; }
.hwf-col a:focus-visible, .hwf-up:focus-visible { outline: 1px solid currentColor; outline-offset: 3px; opacity: 1; }
.hwf-rule {
  position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: center; gap: 16px;
  margin: clamp(20px, 3vw, 36px) clamp(20px, 4vw, 56px) 0; padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-family: var(--hwf-mono); font-size: 11px; letter-spacing: .05em;
}
.hwf-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (max-width: 820px) {
  .hwf-top { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); row-gap: 24px; }
  .hwf-brand { grid-column: 1 / -1; }
}
@media (prefers-reduced-motion: reduce) {
  .hwf-col a, .hwf-up { transition: none; }
}
`

export default function HalftoneWordmarkFooter({
  wordmark = "assetflow",
  label = "AssetFlow Platform",
  meta,
  columns,
  backToTop = true,
  preset = "night",
  palette,
  useBrandGradient = true,
  dotGap = 6,
  radius = 85,
  crop = 0.22,
  grain = 0.45,
  interactive = true,
  fontFamily = SANS_STACK,
  fontWeight = 800,
  monoFamily = MONO_STACK,
  height = "520px",
  className = "",
  children,
}: HalftoneWordmarkFooterProps) {
  const colors = { ...(PRESETS[preset] || PRESETS.night), ...(palette || {}) }
  const rootRef = React.useRef<HTMLElement | null>(null)
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const opts = React.useRef({ colors, dotGap, radius, crop, grain, interactive, fontFamily, fontWeight, wordmark, useBrandGradient })
  opts.current = { colors, dotGap, radius, crop, grain, interactive, fontFamily, fontWeight, wordmark, useBrandGradient }
  const key = [wordmark, dotGap, crop, grain, fontFamily, fontWeight, colors.background, colors.ink, colors.warm, useBrandGradient].join("|")

  React.useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let w = 0
    let h = 0
    let dpr = 1
    let px = -1e5
    let py = -1e5
    let raf = 0
    let visible = true
    let awake = true
    let ring = { x: 0, y: 0, t: -1 }
    // Flat arrays: x, y, vx, vy, hx, hy, r per dot.
    let dots = new Float32Array(0)
    let count = 0
    let grainTile: HTMLCanvasElement | null = null
    const ink = hwfHex(opts.current.colors.ink) || [233, 228, 218]
    const warm = hwfHex(opts.current.colors.warm) || [56, 189, 248]

    // Brand gradient stops: #2563EB -> #22C7B8 -> #34D399
    const brandColor0 = [37, 99, 235]    // Blue
    const brandColor1 = [34, 199, 184]   // Teal
    const brandColor2 = [52, 211, 153]   // Emerald

    const layout = () => {
      const o = opts.current
      const rect = root.getBoundingClientRect()
      w = Math.max(1, Math.round(rect.width))
      h = Math.max(1, Math.round(rect.height))
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)

      // Set the word once, at a size that fills the width, on a 1x mask.
      const mask = document.createElement("canvas")
      mask.width = w
      mask.height = h
      const m = mask.getContext("2d", { willReadFrequently: true })
      if (!m) return
      const face = o.fontWeight + " 100px " + o.fontFamily
      m.font = face
      const word = o.wordmark || " "
      const fit = hwfFitSize(m.measureText(word).width, w * 1.02)
      m.font = o.fontWeight + " " + fit + "px " + o.fontFamily
      const box = m.measureText(word)
      const cap = box.actualBoundingBoxAscent || fit * 0.72
      const c = Math.max(0, Math.min(0.6, o.crop))
      m.fillStyle = "#000"
      m.textBaseline = "alphabetic"
      m.fillText(word, (w - box.width) / 2, h + cap * c)
      const img = m.getImageData(0, 0, w, h).data

      const gap = Math.max(3, o.dotGap)
      const cols = Math.ceil(w / gap)
      const rows = Math.ceil(h / gap)
      const tmp: number[] = []
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          // Coverage: average alpha over a 3×3 sample of the cell.
          let sum = 0
          for (let sy = 0; sy < 3; sy++) {
            for (let sx = 0; sx < 3; sx++) {
              const x = Math.min(w - 1, Math.floor(gx * gap + ((sx + 0.5) * gap) / 3))
              const y = Math.min(h - 1, Math.floor(gy * gap + ((sy + 0.5) * gap) / 3))
              sum += img[(y * w + x) * 4 + 3]
            }
          }
          const cov = sum / (9 * 255)
          if (cov < 0.06) continue
          const hx = gx * gap + gap / 2
          const hy = gy * gap + gap / 2
          tmp.push(hx, hy, 0, 0, hx, hy, hwfRadius(cov, gap))
        }
      }
      dots = new Float32Array(tmp)
      count = tmp.length / 7

      // Fixed tile of print grain
      grainTile = document.createElement("canvas")
      grainTile.width = 256
      grainTile.height = 256
      const g = grainTile.getContext("2d")
      if (g) {
        const id = g.createImageData(256, 256)
        for (let i = 0; i < id.data.length; i += 4) {
          const v = Math.random() * 255
          id.data[i] = id.data[i + 1] = id.data[i + 2] = v
          id.data[i + 3] = Math.random() < 0.5 ? 0 : 255
        }
        g.putImageData(id, 0, 0)
      }
      awake = true
    }

    const draw = (now: number) => {
      const o = opts.current
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = o.colors.background
      ctx.fillRect(0, 0, w, h)

      const r = o.interactive && !reduced ? Math.max(0, o.radius) : 0
      const ringAge = ring.t < 0 ? 1e9 : now - ring.t
      const ringR = ringAge * 0.95
      let moving = false

      for (let i = 0; i < count; i++) {
        const j = i * 7
        let x = dots[j]
        let y = dots[j + 1]
        let vx = dots[j + 2]
        let vy = dots[j + 3]
        const hx = dots[j + 4]
        const hy = dots[j + 5]

        if (!reduced) {
          if (ringAge < 900) {
            const dx = hx - ring.x
            const dy = hy - ring.y
            const d = Math.sqrt(dx * dx + dy * dy) + 0.001
            const band = 1 - Math.min(1, Math.abs(d - ringR) / 26)
            if (band > 0) {
              const f = band * 3.4 * (1 - ringAge / 900)
              vx += (dx / d) * f
              vy += (dy / d) * f
            }
          }
          const s = hwfStep(x, y, vx, vy, hx, hy, px, py, r)
          x = s[0]
          y = s[1]
          vx = s[2]
          vy = s[3]
          if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) > 0.05) {
            moving = true
          } else {
            x = hx
            y = hy
            vx = 0
            vy = 0
          }
          dots[j] = x
          dots[j + 1] = y
          dots[j + 2] = vx
          dots[j + 3] = vy
        }

        const k = hwfWarmth(x, y, hx, hy, 28)

        if (o.useBrandGradient) {
          // Calculate brand color along horizontal gradient (0.0 to 1.0)
          const t = Math.min(1, Math.max(0, hx / w))
          let br: number, bg: number, bb: number
          if (t < 0.5) {
            const u = t / 0.5
            br = brandColor0[0] + (brandColor1[0] - brandColor0[0]) * u
            bg = brandColor0[1] + (brandColor1[1] - brandColor0[1]) * u
            bb = brandColor0[2] + (brandColor1[2] - brandColor0[2]) * u
          } else {
            const u = (t - 0.5) / 0.5
            br = brandColor1[0] + (brandColor2[0] - brandColor1[0]) * u
            bg = brandColor1[1] + (brandColor2[1] - brandColor1[1]) * u
            bb = brandColor1[2] + (brandColor2[2] - brandColor1[2]) * u
          }

          if (k > 0.02) {
            // Warm/brighten toward white/cyan when pushed
            const rW = Math.round(br + (255 - br) * k)
            const gW = Math.round(bg + (255 - bg) * k)
            const bW = Math.round(bb + (255 - bb) * k)
            ctx.fillStyle = `rgb(${rW},${gW},${bW})`
          } else {
            ctx.fillStyle = `rgb(${Math.round(br)},${Math.round(bg)},${Math.round(bb)})`
          }
        } else {
          ctx.fillStyle =
            k > 0.02
              ? "rgb(" +
                Math.round(ink[0] + (warm[0] - ink[0]) * k) + "," +
                Math.round(ink[1] + (warm[1] - ink[1]) * k) + "," +
                Math.round(ink[2] + (warm[2] - ink[2]) * k) + ")"
              : o.colors.ink
        }

        ctx.beginPath()
        ctx.arc(x, y, dots[j + 6], 0, 6.2832)
        ctx.fill()
      }

      if (grainTile && o.grain > 0) {
        ctx.globalAlpha = Math.min(1, o.grain) * 0.08
        ctx.globalCompositeOperation = "overlay"
        const pattern = ctx.createPattern(grainTile, "repeat")
        if (pattern) {
          ctx.fillStyle = pattern
          ctx.fillRect(0, 0, w, h)
        }
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = "source-over"
      }

      awake = moving || ringAge < 900 || px > -1e4
    }

    const loop = (now: number) => {
      raf = 0
      if (!visible) return
      draw(now)
      if (awake) raf = requestAnimationFrame(loop)
    }
    const wake = () => {
      awake = true
      if (!raf && visible) raf = requestAnimationFrame(loop)
    }

    const toLocal = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect()
      return [e.clientX - b.left, e.clientY - b.top]
    }
    const onMove = (e: PointerEvent) => {
      if (!opts.current.interactive) return
      const p = toLocal(e)
      px = p[0]
      py = p[1]
      wake()
    }
    const onLeave = () => {
      px = -1e5
      py = -1e5
      wake()
    }
    const onDown = (e: PointerEvent) => {
      if (!opts.current.interactive || reduced) return
      if ((e.target as HTMLElement).closest("a,button,input,form")) return
      const p = toLocal(e)
      ring = { x: p[0], y: p[1], t: performance.now() }
      soundManager.playShockwave()
      wake()
    }

    layout()
    draw(performance.now())
    wake()

    root.addEventListener("pointermove", onMove)
    root.addEventListener("pointerleave", onLeave)
    root.addEventListener("pointerdown", onDown)
    const ro = new ResizeObserver(() => {
      layout()
      wake()
    })
    ro.observe(root)
    const io = new IntersectionObserver((entries) => {
      visible = entries[0] ? entries[0].isIntersecting : true
      if (visible) wake()
    })
    io.observe(root)

    let alive = true
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!alive) return
        layout()
        wake()
      })
    }

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      root.removeEventListener("pointermove", onMove)
      root.removeEventListener("pointerleave", onLeave)
      root.removeEventListener("pointerdown", onDown)
    }
  }, [key])

  const toTop = () => {
    soundManager.playButtonClick()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const isEn = typeof document !== 'undefined' && (document.documentElement.dir === 'ltr' || document.documentElement.lang === 'en');
  const resolvedColumns = columns || (isEn ? DEFAULT_COLUMNS_EN : DEFAULT_COLUMNS_AR);
  const resolvedMeta = meta || (isEn ? "© 2026 · Critical Asset Management & Incident Flow" : "© 2026 · نظام إدارة الأصول والخدمات الحرجة");

  return (
    <footer
      ref={rootRef}
      dir={isEn ? "ltr" : "rtl"}
      className={"hwf-root " + className}
      style={
        {
          height,
          "--hwf-bg": colors.background,
          "--hwf-ink": colors.ink,
          "--hwf-mono": monoFamily,
        } as React.CSSProperties
      }
    >
      <style>{HWF_CSS}</style>
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="hwf-sr">{wordmark}</span>

      {/* Children or Newsletter slot */}
      {children && (
        <div className="relative z-10 px-6 sm:px-12 pt-8">
          {children}
        </div>
      )}

      {/* Main Links Grid */}
      <div className="hwf-top">
        <div className="hwf-brand">
          <strong className="text-white text-base">{label}</strong>
          <span className="text-[#A3B1C6] text-xs block mt-1">{resolvedMeta}</span>
        </div>
        {resolvedColumns.map((col) => (
          <nav className="hwf-col" key={col.title} aria-label={col.title}>
            <h3>{col.title}</h3>
            <ul>
              {col.links.map((l) => (
                <li key={l.label} className="mb-2">
                  <a 
                    href={l.href || "#"}
                    onClick={(e) => {
                      soundManager.playButtonClick()
                      if (l.onClick) {
                        l.onClick(e)
                      }
                    }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Rule & Back to Top */}
      <div className="hwf-rule">
        <span className="text-[11px] text-[#8696AE]">
          {isEn
            ? '© 2026 AssetFlow · Cloud-Native Asset & Facility Maintenance Platform'
            : '© 2026 AssetFlow · منصة عربية سحابية لإدارة الأصول والمرافق'}
        </span>
        {backToTop ? (
          <button type="button" className="hwf-up flex items-center gap-1.5 cursor-pointer" onClick={toTop}>
            <span>{isEn ? 'Back to top' : 'العودة للأعلى'}</span>
            <span aria-hidden="true">↑</span>
          </button>
        ) : null}
      </div>
    </footer>
  )
}
