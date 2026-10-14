import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import "./HowItWorks.css";
import { useApp } from "../../../context/AppContext";
const AgenticFactory3D = lazy(() => import("../../ui/agentic-factory-3d"));
import {
  Cpu,
  Radio,
  Wrench,
  Database,
  ShieldCheck,
  Sparkles,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Layers,
  Activity,
} from "lucide-react";
import { ShinyButton } from "../../ui/shiny-button";
import { GlowCard } from "../../ui/spotlight-card";
import { Link } from "react-router-dom";

export function HowItWorks() {
  const { language } = useApp();
  const isRTL = language === "ar";
  const [shouldLoad3D, setShouldLoad3D] = useState(false);
  const container3DRef = useRef(null);

  useEffect(() => {
    if (shouldLoad3D) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad3D(true);
          observer.disconnect();
        }
      },
      { rootMargin: "350px" }
    );
    if (container3DRef.current) {
      observer.observe(container3DRef.current);
    }
    return () => observer.disconnect();
  }, [shouldLoad3D]);

  const stationsData = [
    {
      step: "01",
      id: "engine",
      titleAr: "محرك التشخيص الذكي (AI Engine)",
      titleEn: "AI Diagnostic Engine",
      descAr: "تحليل ذكي لذبذبات الحساسات ودرجات الحرارة وضغط السوائل باستخدام نماذج التعلم الآلي للكشف عن أي تآكل أو شذوذ قبل حدوث العطل.",
      descEn: "Continuous vibration, thermal and pressure telemetry analysis via ML models to detect anomalies before mechanical breakdown.",
      icon: Cpu,
      color: "blue",
      badge: isRTL ? "كشف استباقي" : "Predictive",
    },
    {
      step: "02",
      id: "admin",
      titleAr: "استيعاب قياسات SCADA والتحكم",
      titleEn: "SCADA & Telemetry Ingestion",
      descAr: "ربط لحظي مع لوحات التحكم الصناعي (Siemens, Schneider, Honeywell) ومعالجة ملايين الإشارات الحساسة على مدار الثانية بلا توقف.",
      descEn: "Real-time industrial PLC telemetry ingestion (Siemens, Schneider, Honeywell) processing millions of data points every second.",
      icon: Radio,
      color: "emerald",
      badge: isRTL ? "مزامنة لحظية" : "Real-time Sync",
    },
    {
      step: "03",
      id: "storefront",
      titleAr: "الإسناد وأوامر العمل الميدانية",
      titleEn: "Automated Field Dispatch",
      descAr: "تحويل التنبيه فوراً إلى أمر صيانة رقمي وإسناده تلقائياً للفني الأقرب والأكثر تأهيلاً مع قائمة قطع الغيار والدليل الإرشادي.",
      descEn: "Instant auto-generation of prioritized work orders dispatched directly to certified mobile technicians with step-by-step SOPs.",
      icon: Wrench,
      color: "cyan",
      badge: isRTL ? "إسناد آلي" : "Auto-Dispatch",
    },
    {
      step: "04",
      id: "cabinet",
      titleAr: "سجل الأصل وتاريخ الصيانة",
      titleEn: "Asset Registry & Lifecycle",
      descAr: "توثيق آلي لكل تدخل صيانة، قطع الغيار المستهلكة، وتحديث مؤشر كفاءة الأصل وسجل الامتثال التنظيمي في قاعدة البيانات المركزية.",
      descEn: "Comprehensive ledger logging spare parts consumption, technician hours, and dynamic recalculation of Asset Health Index.",
      icon: Database,
      color: "amber",
      badge: isRTL ? "سجل مركزي" : "Unified Ledger",
    },
    {
      step: "05",
      id: "cashdesk",
      titleAr: "التدقيق والاعتماد التشغيلي 99.98%",
      titleEn: "Uptime & Compliance Audit",
      descAr: "رصد فوري لمؤشرات MTBF و MTTR وضمان استمرارية شبكات التحلية والمستشفيات ومولدات الطوارئ مع إغلاق دورة العمل باعتماد رقمي.",
      descEn: "Automated MTBF/MTTR benchmarking ensuring 99.98% mission-critical uptime across hospitals, power grids, and water networks.",
      icon: ShieldCheck,
      color: "purple",
      badge: isRTL ? "جاهزية 99.98%" : "99.98% Uptime",
    },
  ];

  return (
    <section className="how-it-works-ai-section relative w-full py-24 bg-slate-950 text-slate-100 overflow-hidden" id="how-it-works" dir={isRTL ? "rtl" : "ltr"}>
      {/* Background Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-400 text-xs font-bold mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>
              {isRTL
                ? "محاكي التشخيص الذكي 3D • دورة العمل المؤتمتة"
                : "Interactive 3D Machine • Autonomous CMMS Pipeline"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            {isRTL ? (
              <>
                كيف يشخص{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
                  الذكاء الاصطناعي
                </span>{" "}
                الأعطال ويتحكم بالعمليات؟
              </>
            ) : (
              <>
                How{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
                  AssetFlow AI
                </span>{" "}
                Diagnoses & Automates Maintenance
              </>
            )}
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {isRTL
              ? "استكشف الماكينة التفاعلية ثلاثية الأبعاد أدناه: تتبع رحلة بلاغ الصيانة من لحظة التقاط ذبذبات الحساسات اللحظية عبر الـ SCADA، مروراً بتشخيص العطل وإسناد أمر العمل للمهندس المختص، وحتى تحديث سجل الأصل واعتماد الجاهزية التشغيلية."
              : "Interact with the 3D machine below: track incidents from initial SCADA telemetry anomalies, automated diagnostic classification, work order dispatch, asset registry history update, to final uptime certification."}
          </p>
        </div>

        {/* 3D Interactive Console Container */}
        <div className="relative rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-blue-950/40 backdrop-blur-xl overflow-hidden mb-16">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-200">
                  {isRTL ? "محاكي العمليات الحية ثلاثي الأبعاد" : "Live 3D Operational Machine"}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ASSETFLOW ENGINE · 5 STATIONS ACTIVE
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300">
                {isRTL ? "⚡ دورة بلاغ صيانة حية" : "⚡ Live Incident Flow"}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono">
                UPTIME: 99.98%
              </span>
            </div>
          </div>

          {/* 3D WebGL Canvas Component - Deferred load on viewport approach */}
          <div
            ref={container3DRef}
            className="w-full relative min-h-[580px] sm:min-h-[680px] lg:min-h-[740px] bg-[#070b14] flex items-center justify-center overflow-hidden"
          >
            {shouldLoad3D ? (
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center p-8 gap-4 text-slate-400">
                    <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
                    <span className="text-xs font-mono tracking-widest text-emerald-400/80 uppercase">
                      {isRTL ? "جاري تهيئة محاكي 3D التفاعلي..." : "INITIALIZING 3D ENGINE..."}
                    </span>
                  </div>
                }
              >
                <AgenticFactory3D height="720px" className="w-full" embedded={false} />
              </Suspense>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 gap-3 text-slate-500 select-none">
                <div className="w-12 h-12 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-emerald-400/70 animate-pulse" />
                </div>
                <span className="text-xs font-mono tracking-wider text-slate-400">
                  {isRTL ? "محاكي العمليات 3D جاهز للتشغيل" : "3D ENGINE READY ON SCROLL"}
                </span>
              </div>
            )}
          </div>

          {/* Bottom Interactive Guidance Pill */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>
                {isRTL
                  ? "حرّك بالماوس لتكبير وتدوير الماكينة 360°، وانقر على أي محطة لفحصها."
                  : "Drag with mouse to rotate 360°, switch camera angles, or click any station to inspect."}
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
              <span>LATENCY: 12ms</span>
              <span>·</span>
              <span>TELEMETRY: STABLE</span>
            </div>
          </div>
        </div>

        {/* The 5 Operational Pipeline Stations Cards with Spotlight Glow Effect */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
          {stationsData.map((station) => {
            const Icon = station.icon;
            const glowColor =
              station.color === "emerald"
                ? "green"
                : station.color === "cyan"
                ? "blue"
                : station.color === "amber"
                ? "orange"
                : station.color === "purple"
                ? "purple"
                : "blue";

            return (
              <GlowCard
                key={station.id}
                customSize={true}
                glowColor={glowColor}
                className="group relative rounded-2xl p-5 border border-slate-800/80 hover:border-blue-500/40 bg-slate-900/80 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {station.step}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/90 px-2 py-0.5 rounded-full">
                      {station.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                      {isRTL ? station.titleAr : station.titleEn}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isRTL ? station.descAr : station.descEn}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{isRTL ? "مؤتمت 100%" : "Autonomous"}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </GlowCard>
            );
          })}
        </div>

        {/* Operational Assurance & CTA Bar */}
        <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-blue-950/60 via-slate-900 to-emerald-950/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex flex-col gap-1 text-center md:text-start">
            <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
              {isRTL ? "التحول من الصيانة التفاعلية إلى السيطرة التنبؤية" : "From Reactive Repairs to Autonomous Control"}
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-white">
              {isRTL
                ? "جاهز لربط أصول منشأتك الحيوية ومراقبتها بالذكاء الاصطناعي؟"
                : "Ready to connect critical assets and prevent costly downtime?"}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {isRTL
                ? "استعرض مؤشرات الأداء الحية في لوحة القيادة أو اطلب استشارة هندسية لنشر النظام في 14 يوماً."
                : "Explore the live executive throughput dashboard or consult our reliability engineers."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/dashboard/analytics">
              <ShinyButton
                label={isRTL ? "لوحة التحليلات المتقدمة" : "Analytics Dashboard"}
                fillColor="#0f172a"
                accentColor="#1d68bd"
                accentSoftColor="#2eaf7d"
                className="px-6 py-3 text-xs font-bold"
              >
                <span>{isRTL ? "لوحة التحليلات المتقدمة" : "Analytics Dashboard"}</span>
                {isRTL ? <ArrowLeft className="w-4 h-4 text-emerald-400" /> : <ArrowRight className="w-4 h-4 text-emerald-400" />}
              </ShinyButton>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;