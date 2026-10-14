"use client";

// Ultra-smooth 3D Works Wheel Component
// Optimized with GPU-accelerated transforms (translate3d), momentum physics,
// zero-jank rAF easing, and anti-scroll-trap ergonomics.
import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

export interface WorksWheelItem {
  /** Project name. Shown beside the front card and in the index. */
  title: string;
  /** Cover art. Any src an <img> takes. */
  image: string;
  /** Where the card links to. Omit for a wheel that only browses. */
  href?: string;
}

export interface WorksWheelProps extends Omit<
  React.ComponentPropsWithoutRef<"section">,
  "children"
> {
  items: WorksWheelItem[];
  /** Sits in the middle of the ring. @default undefined */
  label?: string;
  /** Label on the card's hover affordance. Omit to drop it. @default undefined */
  action?: string;
}

/* Geometry */
const CARD_H = 0.39; // front card height, of the stage
const CARD_MAX_W = 0.35; // ... but never wider than this much of the stage
const CARD_RATIO = 1.45; // card width / height
const STEP = 40; // degrees between cards on the drum
const DRUM = 2.22; // drum radius, in card heights
const LENS = 2.7; // perspective distance
const RING_R = 1.14; // ring radius
const BOW = 1.82;
const TITLE = 0.124; // ring label and front-card title
const INDEX = 0.04; // the index down the right-hand side
const CULL = 1.6;

/** Physics and smoothness tuning */
const DRAG_UNITS = 310;
const SETTLE = 120;
const EASE = 0.088; // Silky cinematic glide with gentle landing

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Stage = { w: number; h: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

const bowAt = (drumDeg: number, bow: number) =>
  -bow * (1 - Math.cos(rad(drumDeg)));

/** Hardware-accelerated 3D transform combining translate3d + rotate on compositor layer */
function place(
  ringDeg: number,
  drumDeg: number,
  ringR: number,
  drumR: number,
  bow: number,
  m: number,
) {
  const x = (m * bowAt(drumDeg, bow)).toFixed(2);
  const y = (-(1 - m) * ringR).toFixed(2);
  const z = (m * drumR).toFixed(2);
  const rotZ = ((1 - m) * ringDeg).toFixed(2);
  const rotX = (m * drumDeg).toFixed(2);

  return `translate3d(${x}px, ${y}px, ${z}px) rotateZ(${rotZ}deg) rotateX(${rotX}deg)`;
}

export function WorksWheel({
  items,
  label = "Works '26",
  action = "View",
  className,
  ...props
}: WorksWheelProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const wheelRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLDivElement>(null);

  const turn = React.useRef(0);
  const target = React.useRef(0);
  const [active, setActive] = React.useState(0);
  const [stage, setStage] = React.useState<Stage>({ w: 0, h: 0 });

  const count = items.length;
  const last = Math.max(count - 1, 0);

  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const metrics = React.useMemo(() => {
    const { w, h } = stage;
    const cardW = Math.min(h * CARD_H * CARD_RATIO, w * CARD_MAX_W);
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * DRUM;
    const ringR = cardH * RING_R;
    const ringScale = count
      ? clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1)
      : 1;
    return {
      cardW,
      cardH,
      ringR,
      ringScale,
      drumR,
      bow: cardH * BOW,
      depth: cardH * LENS,
      title: cardH * TITLE,
      index: cardH * INDEX,
    };
  }, [stage, count]);

  const requestDrawRef = React.useRef<() => void>(() => {});

  const to = React.useCallback(
    (next: number) => {
      target.current = clamp(next, 0, last + 1);
      requestDrawRef.current();
    },
    [last],
  );

  // One pass per frame: ease toward the target, then write composite transforms.
  // Stops scheduling rAF frames when motion settles (zero rAF callbacks while idle).
  React.useEffect(() => {
    if (!stage.h) return;
    let frame = 0;
    let isRunning = false;
    const { ringR, ringScale, drumR, bow } = metrics;

    const lastCardTransforms: string[] = [];
    const lastCardOpacities: string[] = [];
    const lastCardZIndexes: string[] = [];
    const lastFaceTransforms: string[] = [];
    let lastWheelTransform = "";
    let lastLabelOpacity = "";
    let lastTitleOpacity = "";

    const draw = () => {
      const gap = target.current - turn.current;
      const isSettled = Math.abs(gap) < 0.0003;
      if (isSettled) {
        turn.current = target.current;
      } else {
        turn.current += gap * (reduced ? 1 : EASE);
      }

      const t = turn.current;
      const m = clamp(t, 0, 1);
      const pos = Math.max(0, t - 1);

      if (wheelRef.current) {
        const nextWheel = `translate3d(0, 0, ${(-m * drumR).toFixed(2)}px)`;
        if (nextWheel !== lastWheelTransform) {
          wheelRef.current.style.transform = nextWheel;
          lastWheelTransform = nextWheel;
        }
      }

      for (let i = 0; i < count; i++) {
        const d = i - pos;
        const drumDeg = d * STEP;
        const card = cardRefs.current[i];
        if (card) {
          const nextTransform = place(
            d * (360 / count),
            drumDeg,
            ringR,
            drumR,
            bow,
            m,
          );
          if (nextTransform !== lastCardTransforms[i]) {
            card.style.transform = nextTransform;
            lastCardTransforms[i] = nextTransform;
          }

          const nextOpacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
          if (nextOpacity !== lastCardOpacities[i]) {
            card.style.opacity = nextOpacity;
            lastCardOpacities[i] = nextOpacity;
          }

          const nextZ = String(Math.round(100 - Math.abs(d) * 2));
          if (nextZ !== lastCardZIndexes[i]) {
            card.style.zIndex = nextZ;
            lastCardZIndexes[i] = nextZ;
          }
        }
        const face = card?.firstElementChild as HTMLElement | null;
        if (face) {
          const s = lerp(ringScale, 1, m);
          const nextFaceTransform = `scale3d(${s.toFixed(3)}, ${s.toFixed(3)}, 1)`;
          if (nextFaceTransform !== lastFaceTransforms[i]) {
            face.style.transform = nextFaceTransform;
            lastFaceTransforms[i] = nextFaceTransform;
          }
        }
      }

      if (labelRef.current) {
        const nextLabel = String(1 - m);
        if (nextLabel !== lastLabelOpacity) {
          labelRef.current.style.opacity = nextLabel;
          lastLabelOpacity = nextLabel;
        }
      }
      if (titleRef.current) {
        const nextTitle = String(m);
        if (nextTitle !== lastTitleOpacity) {
          titleRef.current.style.opacity = nextTitle;
          lastTitleOpacity = nextTitle;
        }
      }
      const near = clamp(Math.round(pos), 0, last);
      setActive((prev) => (prev === near ? prev : near));

      if (isSettled) {
        isRunning = false;
        frame = 0;
        return;
      }

      frame = requestAnimationFrame(draw);
    };

    const startDraw = () => {
      if (!isRunning) {
        isRunning = true;
        frame = requestAnimationFrame(draw);
      }
    };

    requestDrawRef.current = startDraw;
    startDraw();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      isRunning = false;
    };
  }, [metrics, stage.h, count, last, reduced]);

  const settling = React.useRef(0);

  // Wheel listener: responsive, smooth, and NEVER scroll-traps the page!
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      const isTrackpad = Math.abs(event.deltaY) < 40;
      const units = isTrackpad ? 480 : 260;
      const delta = event.deltaY / units;
      const next = target.current + delta;

      // Only prevent page scroll if the wheel has room to turn in this direction.
      // If the reader wants to scroll up or down past the section, the browser naturally scrolls!
      const canTurnNext = delta > 0 && target.current < last + 1;
      const canTurnPrev = delta < 0 && target.current > 0.05;

      if (canTurnNext || canTurnPrev) {
        event.preventDefault();
        to(next);
        window.clearTimeout(settling.current);
        settling.current = window.setTimeout(
          () => to(target.current > 0.4 ? Math.round(target.current) : 0),
          SETTLE,
        );
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(settling.current);
    };
  }, [to, last]);

  // Multi-axis dragging with momentum fling
  const dragStartY = React.useRef<number | null>(null);
  const dragStartX = React.useRef<number | null>(null);
  const dragLastTime = React.useRef(0);
  const dragVelocity = React.useRef(0);

  return (
    <section
      aria-label={label}
      className={cn(
        "bg-background text-foreground relative h-full min-h-[24rem] w-full overflow-hidden select-none",
        className,
      )}
      {...props}
    >
      <div
        ref={stageRef}
        tabIndex={0}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`works-wheel-${active}`}
        className="focus-visible:outline-foreground absolute inset-0 cursor-grab touch-pan-x outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 active:cursor-grabbing"
        style={{ perspective: `${metrics.depth}px` }}
        onPointerDown={(event) => {
          dragStartY.current = event.clientY;
          dragStartX.current = event.clientX;
          dragLastTime.current = performance.now();
          dragVelocity.current = 0;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (dragStartY.current === null || dragStartX.current === null) return;
          const now = performance.now();
          const dt = Math.max(1, now - dragLastTime.current);
          const dy = dragStartY.current - event.clientY;
          const dx = dragStartX.current - event.clientX;
          // Fluid swipe: vertical movement or horizontal swipe
          const effectiveDelta = dy + dx * 0.6;
          const deltaUnits = effectiveDelta / DRAG_UNITS;
          dragVelocity.current = deltaUnits / dt;

          to(target.current + deltaUnits);
          dragStartY.current = event.clientY;
          dragStartX.current = event.clientX;
          dragLastTime.current = now;
        }}
        onPointerUp={() => {
          dragStartY.current = null;
          dragStartX.current = null;
          // Luxurious inertia momentum
          const momentum = dragVelocity.current * 160;
          const final = clamp(target.current + momentum, 0, last + 1);
          if (final > 0.4) {
            to(Math.round(final));
          } else {
            to(0);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowRight") {
            to(Math.min(last + 1, Math.round(target.current) + 1));
          } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
            to(Math.max(0, Math.round(target.current) - 1));
          } else {
            return;
          }
          event.preventDefault();
        }}
      >
        <div
          ref={wheelRef}
          className="absolute top-1/2 left-1/2 [transform-style:preserve-3d] will-change-transform"
        >
          {items.map((item, i) => {
            const isSelected = i === active;
            const Tag = (item.href ? "a" : "div") as "a";
            return (
              <React.Fragment key={item.title}>
                <Tag
                  id={`works-wheel-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  href={item.href}
                  ref={(node: HTMLElement | null) => {
                    cardRefs.current[i] = node;
                  }}
                  onClick={(e: React.MouseEvent) => {
                    // Clicking an angled inactive card smoothly glides it front-and-center!
                    if (!isSelected) {
                      e.preventDefault();
                      e.stopPropagation();
                      to(i + 1);
                    }
                  }}
                  className={cn(
                    "group absolute select-none transition-all duration-300",
                    !isSelected && "cursor-pointer hover:brightness-110",
                  )}
                  style={{
                    width: metrics.cardW,
                    height: metrics.cardH,
                    marginLeft: -metrics.cardW / 2,
                    marginTop: -metrics.cardH / 2,
                    willChange: "transform, opacity",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <span
                    className={cn(
                      "relative block size-full overflow-hidden rounded-2xl transition-all duration-500",
                      isSelected
                        ? "bg-slate-900 border-2 border-emerald-400/90 shadow-[0_0_45px_rgba(46,175,125,0.4),0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-4 ring-emerald-500/20"
                        : "bg-slate-900/95 border border-slate-700/60 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] hover:border-blue-400/60",
                    )}
                    style={{ willChange: "transform" }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      draggable={false}
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Integrated Scrim & Title over Image */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent p-4 sm:p-5 flex flex-col justify-end pointer-events-none">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider",
                            isSelected ? "text-emerald-400" : "text-slate-300",
                          )}
                        >
                          <span
                            className={cn(
                              "w-2 h-2 rounded-full",
                              isSelected
                                ? "bg-emerald-400 shadow-sm shadow-emerald-400/80 animate-pulse"
                                : "bg-slate-400",
                            )}
                          />
                          {action || "الخدمة الحيوية"}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-mono px-2 py-0.5 rounded-full border",
                            isSelected
                              ? "text-emerald-300 bg-emerald-950/80 border-emerald-500/50"
                              : "text-slate-400 bg-slate-900/80 border-slate-700/60",
                          )}
                        >
                          {`#0${i + 1}`}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-extrabold text-white leading-snug drop-shadow-md">
                        {item.title}
                      </h4>
                    </div>

                    {action && item.href ? (
                      <span
                        className={cn(
                          "pointer-events-none absolute top-3 end-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm transition-all duration-300 shadow-lg",
                          isSelected
                            ? "bg-emerald-600/90 text-white opacity-100 shadow-emerald-600/30"
                            : "bg-blue-600/90 text-white opacity-0 group-hover:opacity-100 shadow-blue-600/30",
                        )}
                      >
                        <span>{action}</span>
                        <svg
                          viewBox="0 0 12 12"
                          className="size-3"
                          aria-hidden="true"
                        >
                          <path
                            d="M3 9 9 3M4 3h5v5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    ) : null}
                  </span>
                </Tag>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Floating Prev/Next Buttons for Silky Smooth Cycling */}
      <div className="absolute inset-y-0 left-3 sm:left-5 flex items-center z-40 pointer-events-none">
        <button
          type="button"
          onClick={() => to(Math.max(0, target.current - 1))}
          className="pointer-events-auto p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white/90 hover:text-white border border-slate-700/70 hover:border-blue-500 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          title="السابق"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-3 sm:right-5 flex items-center z-40 pointer-events-none">
        <button
          type="button"
          onClick={() => to(Math.min(last + 1, target.current + 1))}
          className="pointer-events-auto p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white/90 hover:text-white border border-slate-700/70 hover:border-blue-500 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          title="التالي"
          aria-label="Next card"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Ring center label at rest (m = 0) */}
      <div
        ref={labelRef}
        className="pointer-events-none absolute inset-0 grid place-items-center tracking-tight text-slate-500/25 font-black uppercase select-none transition-opacity duration-300"
        style={{ fontSize: Math.min(stage.h * 0.08, 44) }}
      >
        {label}
      </div>

      {/* Compact modern info badge at top-left — completely avoiding card collision */}
      <div
        ref={titleRef}
        className="pointer-events-none absolute top-4 sm:top-6 left-4 sm:left-6 z-30 max-w-[220px] sm:max-w-[250px] opacity-0 transition-opacity duration-300"
      >
        <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800/90 rounded-xl p-3 sm:p-3.5 shadow-xl">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/80 animate-ping" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 truncate">
              {action ? `${action}` : "أصل حيوي نشط"}
            </span>
            <span className="ms-auto text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              {`${active + 1}/${items.length}`}
            </span>
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-white leading-snug drop-shadow line-clamp-2">
            {items[active]?.title}
          </h3>
        </div>
      </div>

      {/* Side index pill navigation on the safe physical RIGHT side */}
      <ol
        className="absolute top-4 sm:top-6 right-4 sm:right-6 text-end z-30 max-h-[75%] overflow-y-auto space-y-1 p-1.5 bg-slate-950/70 backdrop-blur-md rounded-xl border border-slate-800/70 w-44 sm:w-52 hidden sm:block shadow-xl"
      >
        {items.map((item, i) => (
          <li key={item.title}>
            <button
              type="button"
              onClick={() => to(i + 1)}
              className={cn(
                "cursor-pointer transition-all px-2.5 py-1 rounded-lg text-[11px] block w-full text-end truncate",
                i === active
                  ? "bg-blue-600/25 text-blue-300 font-bold border border-blue-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50",
              )}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ol>

      {/* Smooth Dot Pagination Pill at bottom center */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 p-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800/80 shadow-lg">
        {items.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => to(idx + 1)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
              active === idx
                ? "w-6 bg-gradient-to-r from-blue-500 to-emerald-400 shadow-sm shadow-blue-500/50"
                : "w-1.5 bg-slate-700 hover:bg-slate-500",
            )}
            aria-label={`Go to item ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default WorksWheel;