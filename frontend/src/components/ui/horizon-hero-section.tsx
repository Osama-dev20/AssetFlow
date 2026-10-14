// horizon-hero-section.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { useApp } from '../../context/AppContext';
import { ShinyButton } from './shiny-button';
import {
  Activity,
  Cpu,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Layers,
  ArrowDown,
  Mouse,
} from 'lucide-react';
import './horizon-hero.css';

export interface HorizonHeroSectionProps {
  onEnterSite?: () => void;
  brandName?: string;
}

export const Component: React.FC<HorizonHeroSectionProps> = ({
  onEnterSite,
  brandName = "ASSETFLOW",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  let language = "ar";
  try {
    const appContext = useApp();
    if (appContext?.language) language = appContext.language;
  } catch (e) {
    // Standalone fallback
  }
  const isRTL = language === "ar";

  // Stages: 0 = ASSETFLOW, 1 = AUTOMATION, 2 = CONTINUITY, 3 = THE CLIMAX
  const [currentStage, setCurrentStage] = useState(0);
  const targetStageRef = useRef(0);
  const [isEntered, setIsEntered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalStages = 4;

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 320 });

  const threeRefs = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    composer: EffectComposer | null;
    stars: THREE.Points[];
    nebula: THREE.Mesh | null;
    mountains: THREE.Mesh[];
    animationId: number | null;
    targetCameraX: number;
    targetCameraY: number;
    targetCameraZ: number;
    cameraPositions: { x: number; y: number; z: number }[];
  }>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    mountains: [],
    animationId: null,
    targetCameraX: 0,
    targetCameraY: 30,
    targetCameraZ: 320,
    cameraPositions: [
      { x: 0, y: 30, z: 320 },   // Stage 0: ASSETFLOW - Wide vista
      { x: 0, y: 38, z: 60 },    // Stage 1: AUTOMATION - Approaching peaks
      { x: 0, y: 46, z: -240 },  // Stage 2: CONTINUITY - Deep in nebula
      { x: 0, y: 56, z: -620 },  // Stage 3: THE CLIMAX - Horizon Gateway
    ],
  });

  // Enter the website with smooth cinematic fade
  const enterWebsite = useCallback(() => {
    if (isEntered || isTransitioning) return;
    setIsTransitioning(true);

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.03,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          setIsEntered(true);
          setIsTransitioning(false);
          document.body.style.overflow = '';

          if (onEnterSite) {
            onEnterSite();
          } else {
            const homeEl = document.getElementById('home');
            if (homeEl) {
              homeEl.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }
        },
      });
    } else {
      setIsEntered(true);
      document.body.style.overflow = '';
      if (onEnterSite) onEnterSite();
    }
  }, [isEntered, isTransitioning, onEnterSite]);

  // Lock body scroll while inside intro
  useEffect(() => {
    if (!isEntered) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isEntered]);

  // Listen for programmatic dismissal from navbar or other routes
  useEffect(() => {
    const handleDismiss = () => enterWebsite();
    window.addEventListener('dismiss-intro', handleDismiss);
    return () => window.removeEventListener('dismiss-intro', handleDismiss);
  }, [enterWebsite]);

  // Update target stage and camera
  const setStage = useCallback((newStage: number) => {
    const clamped = Math.max(0, Math.min(newStage, totalStages - 1));
    targetStageRef.current = clamped;
    setCurrentStage(clamped);

    const { current: refs } = threeRefs;
    const targetPos = refs.cameraPositions[clamped] || refs.cameraPositions[0];
    refs.targetCameraX = targetPos.x;
    refs.targetCameraY = targetPos.y;
    refs.targetCameraZ = targetPos.z;
  }, [totalStages]);

  // Ultra-fluid wheel & gesture handler (NO stutter, NO 650ms freeze!)
  useEffect(() => {
    if (isEntered) return;

    let deltaAcc = 0;
    let cooldown = false;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (cooldown || isTransitioning) return;

      deltaAcc += e.deltaY;

      // Snappy threshold
      if (deltaAcc > 30) {
        deltaAcc = 0;
        if (targetStageRef.current < totalStages - 1) {
          cooldown = true;
          setStage(targetStageRef.current + 1);
          setTimeout(() => {
            cooldown = false;
          }, 240); // Fast 240ms cooldown feels instant and silky
        } else {
          cooldown = true;
          enterWebsite();
          setTimeout(() => {
            cooldown = false;
          }, 350);
        }
      } else if (deltaAcc < -30) {
        deltaAcc = 0;
        if (targetStageRef.current > 0) {
          cooldown = true;
          setStage(targetStageRef.current - 1);
          setTimeout(() => {
            cooldown = false;
          }, 240);
        }
      }
    };

    // Keyboard keys
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        if (targetStageRef.current < totalStages - 1) {
          setStage(targetStageRef.current + 1);
        } else {
          enterWebsite();
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (targetStageRef.current > 0) {
          setStage(targetStageRef.current - 1);
        }
      } else if (e.key === 'Escape') {
        enterWebsite();
      }
    };

    // Touch swipe for mobile/tablets
    let touchY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioning) return;
      const diffY = touchY - e.changedTouches[0].clientY;
      if (diffY > 35) {
        if (targetStageRef.current < totalStages - 1) {
          setStage(targetStageRef.current + 1);
        } else {
          enterWebsite();
        }
      } else if (diffY < -35) {
        if (targetStageRef.current > 0) {
          setStage(targetStageRef.current - 1);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isEntered, isTransitioning, setStage, enterWebsite, totalStages]);

  // High-performance Three.js setup (Capped pixelRatio = 60-120fps buttery smooth)
  useEffect(() => {
    const { current: refs } = threeRefs;
    if (!canvasRef.current) return;

    // Scene
    refs.scene = new THREE.Scene();
    refs.scene.fog = new THREE.FogExp2(0x040711, 0.00035);

    // Camera
    refs.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2200
    );
    refs.camera.position.set(0, 30, 320);

    // High performance renderer: capped at 1.25 to prevent 4K GPU lag
    refs.renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    refs.renderer.setSize(window.innerWidth, window.innerHeight);
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    refs.renderer.toneMappingExposure = 0.65;

    // Post-processing
    refs.composer = new EffectComposer(refs.renderer);
    const renderPass = new RenderPass(refs.scene, refs.camera);
    refs.composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2), // Half-res bloom for 10x faster execution
      0.65,
      0.35,
      0.85
    );
    refs.composer.addPass(bloomPass);

    // Optimized starfield (2,200 stars - dense, beautiful & lightweight)
    const starCount = 2200;
    for (let i = 0; i < 2; i++) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);
      const sizes = new Float32Array(starCount);

      for (let j = 0; j < starCount; j++) {
        const radius = 220 + Math.random() * 800;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[j * 3 + 2] = radius * Math.cos(phi);

        const color = new THREE.Color();
        const rand = Math.random();
        if (rand < 0.6) {
          color.setHSL(0.58, 0.35, 0.9);
        } else if (rand < 0.85) {
          color.setHSL(0.58, 0.85, 0.65);
        } else {
          color.setHSL(0.44, 0.85, 0.6);
        }

        colors[j * 3] = color.r;
        colors[j * 3 + 1] = color.g;
        colors[j * 3 + 2] = color.b;
        sizes[j] = Math.random() * 2 + 0.6;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        size: 1.4,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });

      const stars = new THREE.Points(geometry, material);
      refs.scene.add(stars);
      refs.stars.push(stars);
    }

    // Volumetric Nebula
    const nebulaGeo = new THREE.SphereGeometry(600, 24, 24);
    const nebulaMat = new THREE.MeshBasicMaterial({
      color: 0x1d68bd,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.12,
    });
    refs.nebula = new THREE.Mesh(nebulaGeo, nebulaMat);
    refs.scene.add(refs.nebula);

    // Optimized Mountains (50x20 mesh subdivision)
    const mountainGeos = [
      { z: -100, scale: 1.2, color: 0x091428, roughness: 18 },
      { z: -250, scale: 1.8, color: 0x071120, roughness: 26 },
      { z: -450, scale: 2.5, color: 0x050c18, roughness: 34 },
      { z: -700, scale: 3.2, color: 0x030710, roughness: 42 },
    ];

    mountainGeos.forEach((cfg) => {
      const planeGeo = new THREE.PlaneGeometry(1500, 400, 50, 20);
      const posAttr = planeGeo.attributes.position;
      for (let k = 0; k < posAttr.count; k++) {
        const u = posAttr.getX(k);
        const elevation =
          Math.sin(u * 0.015) * cfg.roughness +
          Math.cos(u * 0.035) * (cfg.roughness * 0.5);
        posAttr.setY(k, posAttr.getY(k) + Math.max(elevation, -20));
      }
      planeGeo.computeVertexNormals();

      const mat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        roughness: 0.85,
        metalness: 0.2,
      });

      const mesh = new THREE.Mesh(planeGeo, mat);
      mesh.position.set(0, -60, cfg.z);
      mesh.rotation.x = -Math.PI * 0.05;
      mesh.scale.set(cfg.scale, cfg.scale, 1);
      refs.scene?.add(mesh);
      refs.mountains.push(mesh);
    });

    // Lighting
    refs.scene.add(new THREE.AmbientLight(0x0f1d38, 1.3));
    const dirLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    dirLight.position.set(0, 150, -200);
    refs.scene.add(dirLight);

    const emeraldLight = new THREE.PointLight(0x2eaf7d, 2.5, 500);
    emeraldLight.position.set(0, 40, -100);
    refs.scene.add(emeraldLight);

    // Fast, responsive 60-120fps animation loop with visibility-awareness
    const animate = () => {
      if (document.hidden) return;
      refs.animationId = requestAnimationFrame(animate);

      if (refs.camera) {
        // Snappy camera damping factor (0.09 = responsive glide)
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * 0.09;
        smoothCameraPos.current.y += (refs.targetCameraY - smoothCameraPos.current.y) * 0.09;
        smoothCameraPos.current.z += (refs.targetCameraZ - smoothCameraPos.current.z) * 0.09;

        refs.camera.position.set(
          smoothCameraPos.current.x,
          smoothCameraPos.current.y,
          smoothCameraPos.current.z
        );
      }

      refs.stars.forEach((starGroup, idx) => {
        starGroup.rotation.y += 0.00025 * (idx + 1);
      });

      if (refs.composer) {
        refs.composer.render();
      }
    };

    animate();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (refs.animationId) {
          cancelAnimationFrame(refs.animationId);
          refs.animationId = null;
        }
      } else {
        if (!refs.animationId && !isEntered) {
          animate();
        }
      }
    };

    const handleResize = () => {
      if (refs.camera && refs.renderer && refs.composer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.composer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (refs.animationId) {
        cancelAnimationFrame(refs.animationId);
        refs.animationId = null;
      }
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      refs.stars.forEach((s) => s.geometry?.dispose());
      refs.mountains.forEach((m) => {
        m.geometry?.dispose();
        if (Array.isArray(m.material)) {
          m.material.forEach((mat) => mat.dispose());
        } else {
          m.material?.dispose();
        }
      });
      if (refs.nebula) {
        refs.nebula.geometry?.dispose();
        (refs.nebula.material as THREE.Material)?.dispose();
      }
      if (refs.composer) {
        refs.composer.dispose();
      }
      if (refs.renderer) {
        refs.renderer.dispose();
        refs.renderer.forceContextLoss?.();
      }
    };
  }, [isEntered]);

  const stagesData = [
    {
      badge: isRTL ? "المنظومة الموحدة للأصول الحيوية" : "Unified Enterprise CMMS",
      badgeIcon: Activity,
      badgeClass: "stage-badge-blue",
      title: brandName,
      line1: isRTL ? "حيث تبدأ السيطرة الشاملة والأتمتة الذكية" : "Where Autonomous Orchestration Begins",
      line2: isRTL ? "تتبع الأصول الحساسة ومراقبة سلاسل الإمداد على مدار الساعة" : "Real-time critical asset telemetry & unbroken reliability",
      prompt: isRTL ? "مرّر الفأرة للأسفل لاكتشاف الأتمتة الميدانية ⬇" : "Scroll down to explore automation ⬇",
    },
    {
      badge: isRTL ? "أتمتة تشغيلية ذكية 100%" : "Smart Industrial Automation",
      badgeIcon: Cpu,
      badgeClass: "stage-badge-emerald",
      title: "AUTOMATION",
      line1: isRTL ? "تحكم آلي ومراقبة تنبؤية بالأعطال قبل حدوثها" : "Autonomous Control & Predictive Maintenance",
      line2: isRTL ? "ربط فوري بين الـ SCADA وحساسات الـ IoT وفرق الصيانة الميدانية" : "Real-time SCADA telemetry dispatching automated work orders directly",
      prompt: isRTL ? "واصل التمرير لاستكشاف استمرارية التشغيل ⬇" : "Continue scrolling to explore continuity ⬇",
    },
    {
      badge: isRTL ? "استمرارية تشغيلية وجاهزية 99.98%" : "99.98% Mission-Critical Reliability",
      badgeIcon: ShieldCheck,
      badgeClass: "stage-badge-cyan",
      title: "CONTINUITY",
      line1: isRTL ? "حماية خطوط الأكسجين الطبي، مضخات التحلية، ومولدات الطاقة" : "Unbroken Power, Water & Hospital ICU Supply",
      line2: isRTL ? "تشغيل دائم بلا انقطاع لحماية الأرواح والمنشآت الحساسة" : "Zero-downtime reliability for essential infrastructure",
      prompt: isRTL ? "مرّر للأسفل للانتقال إلى بوابة الترحيب الرئيسية ⬇" : "Scroll down to launch the platform ⬇",
    },
  ];

  if (isEntered) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden bg-[#040711] select-none"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="hero-canvas" />

      {/* Atmospheric vignette */}
      <div className="stage-ambient-vignette" />

      {/* Top Left/Right: Side branding */}
      <div className="side-menu">
        <div
          className="menu-icon"
          onClick={() => setStage((currentStage + 1) % totalStages)}
          title={isRTL ? "المرحلة التالية" : "Next Stage"}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="vertical-text">ASSETFLOW</div>
      </div>

      {/* Top Skip Button -> Instant entrance into site */}
      <button
        type="button"
        onClick={enterWebsite}
        className="skip-intro-btn"
        aria-label="Enter site directly"
      >
        <span>{isRTL ? "دخول الموقع" : "Enter Site"}</span>
        <ChevronRight className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
      </button>

      {/* Center Stage Presentation */}
      <div className="central-stage-container">
        {stagesData.map((data, index) => {
          const isActive = currentStage === index;
          const BadgeIcon = data.badgeIcon;
          return (
            <div
              key={data.title}
              className="stage-layer"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive
                  ? 'translate3d(0, 0, 0) scale(1)'
                  : currentStage > index
                  ? 'translate3d(0, -30px, 0) scale(1.02)'
                  : 'translate3d(0, 30px, 0) scale(0.98)',
                pointerEvents: isActive ? 'auto' : 'none',
                transition: 'opacity 0.4s ease-out, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div className={`stage-badge ${data.badgeClass}`}>
                <BadgeIcon className="w-4 h-4 animate-pulse" />
                <span>{data.badge}</span>
              </div>

              <h1 className="hero-title">{data.title}</h1>

              <div className="stage-subtitle-box">
                <p className="stage-line-primary">{data.line1}</p>
                <p className="stage-line-secondary">{data.line2}</p>
              </div>

              <div className="stage-prompt-pill">
                <Mouse className="w-3.5 h-3.5 animate-bounce text-emerald-400" />
                <span>{data.prompt}</span>
              </div>
            </div>
          );
        })}

        {/* Stage 3: THE CLIMAX */}
        <div
          className="stage-layer"
          style={{
            opacity: currentStage === 3 ? 1 : 0,
            transform: currentStage === 3
              ? 'translate3d(0, 0, 0) scale(1)'
              : 'translate3d(0, 35px, 0) scale(0.96)',
            pointerEvents: currentStage === 3 ? 'auto' : 'none',
            transition: 'opacity 0.45s ease-out, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="grand-climax-card relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-emerald-400 to-cyan-500" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-40 bg-blue-600/25 blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{isRTL ? "مرحباً بك في المستقبل • Ready to Launch" : "Ready to Launch"}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {isRTL ? (
                <>
                  أهلاً بك في منصة{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
                    AssetFlow
                  </span>
                </>
              ) : (
                <>
                  Welcome to{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
                    AssetFlow
                  </span>
                </>
              )}
            </h2>

            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg">
              {isRTL
                ? "انتقل الآن إلى لوحة التحكم الشاملة، استكشف محاكي الذكاء الاصطناعي 3D، وعجلة الأصول وبوابات الدخول المخصصة لكافة الأدوار."
                : "Enter the unified operations hub, 3D AI operational factory, and role-specific login portals."}
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2.5 w-full text-[11px] font-semibold text-slate-300">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center text-center gap-1 shadow-inner">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>{isRTL ? "أتمتة ذكية" : "Automation"}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center text-center gap-1 shadow-inner">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>{isRTL ? "محاكي 3D" : "3D Factory"}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center text-center gap-1 shadow-inner">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>{isRTL ? "بوابات الأدوار" : "Role Portals"}</span>
              </div>
            </div>

            <div className="mt-7 flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
              <ShinyButton
                onClick={enterWebsite}
                label={isRTL ? "الدخول المباشر إلى المنصة" : "Enter Platform Now"}
                fillColor="#0f172a"
                accentColor="#1d68bd"
                accentSoftColor="#2eaf7d"
                className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold shadow-2xl"
              >
                <span>{isRTL ? "الدخول المباشر إلى المنصة" : "Enter Platform Now"}</span>
                <ArrowDown className="w-4 h-4 text-emerald-400 animate-bounce" />
              </ShinyButton>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Progress Controls */}
      <div className="scroll-progress">
        <button
          type="button"
          onClick={() => {
            if (currentStage > 0) setStage(currentStage - 1);
          }}
          disabled={currentStage === 0}
          className="text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Previous Stage"
        >
          <ChevronDown className="w-4 h-4 rotate-180" />
        </button>

        <div className="scroll-text">
          {currentStage === 3
            ? (isRTL ? "جاهز للانطلاق" : "LAUNCH")
            : (isRTL ? "مرّر للتقدم" : "SCROLL")}
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${((currentStage + 1) / totalStages) * 100}%` }}
          />
        </div>

        <div className="section-counter">
          0{currentStage + 1} / 0{totalStages}
        </div>

        <button
          type="button"
          onClick={() => {
            if (currentStage < totalStages - 1) {
              setStage(currentStage + 1);
            } else {
              enterWebsite();
            }
          }}
          className="text-slate-400 hover:text-white transition-colors"
          aria-label="Next Stage"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const HorizonHeroSection = Component;
export default HorizonHeroSection;
