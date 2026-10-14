"use client";

import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../../assets/assets";
import { useApp } from "../../../context/AppContext";
import { CircularGallery, type GalleryItem } from "../../ui/circular-gallery";
import { ShinyButton } from "../../ui/shiny-button";
import { Activity, ShieldCheck, ArrowRight, ArrowLeft, Layers, Cpu } from "lucide-react";

export function ServicesWheelSection() {
  const { language } = useApp();
  const isRTL = language === "ar";
  const [activeAsset, setActiveAsset] = React.useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = React.useMemo(() => [
    {
      common: isRTL ? "محطات الضخ والتحلية الكبرى" : "Desalination Pumps",
      binomial: isRTL ? "معدات حرجة · توفر تشغيلي 99.98%" : "Critical Infrastructure · Tier-4 SCADA",
      photo: {
        url: assets.water1,
        text: isRTL ? "محطات الضخ والتحلية الكبرى" : "Desalination Pumps",
        by: isRTL ? "منظومة معالجة وتحلية المياه المركزية" : "Central Municipal Water Grid",
        pos: "center",
      },
      href: "/dashboard/assets",
      badge: isRTL ? "أصل حيوي نشط" : "Active Critical Asset",
    },
    {
      common: isRTL ? "مولدات الطاقة والطوارئ (1200kVA)" : "Emergency Generators",
      binomial: isRTL ? "تغذية كهربائية مستمرة · جاهزية فورية" : "Continuous Standby Power · Automatic Switch",
      photo: {
        url: assets.generator1,
        text: isRTL ? "مولدات الطاقة والطوارئ" : "Emergency Standby Generators",
        by: isRTL ? "شبكة الطاقة البديلة للمستشفيات والمراكز" : "Hospital Backup Generator Array",
        pos: "center",
      },
      href: "/dashboard/assets",
      badge: isRTL ? "توليد طاقة 1200kVA" : "1200kVA Standby",
    },
    {
      common: isRTL ? "شبكات الأكسجين الطبي الحرج" : "Medical Oxygen System",
      binomial: isRTL ? "ضغط مستقر 24/7 · غرف العناية المركزة" : "Zero-Fail Oxygen Pipeline · ICU Network",
      photo: {
        url: assets.medical1,
        text: isRTL ? "شبكات الأكسجين الطبي الحرج" : "Medical ICU Oxygen Network",
        by: isRTL ? "أنظمة الغازات الطبية وغرف العمليات" : "Clinical Life-Support Delivery",
        pos: "center",
      },
      href: "/dashboard/services",
      badge: isRTL ? "غازات طبية حرجة" : "ICU Critical Gas",
    },
    {
      common: isRTL ? "تبريد المصانع وغرف العمليات" : "Precision HVAC Cleanroom",
      binomial: isRTL ? "تحكم بيئي دقيق · رطوبة وحرارة معيارية" : "Pharmaceutical Grade HVAC · HEPA Filtered",
      photo: {
        url: assets.Factories,
        text: isRTL ? "تبريد المصانع وغرف العمليات" : "Precision Cleanroom & HVAC",
        by: isRTL ? "منظومات تكييف وتبريد المنشآت الصناعية" : "Industrial Precision Climate Control",
        pos: "center",
      },
      href: "/dashboard/services",
      badge: isRTL ? "بيئة نقية ISO-5" : "ISO-5 Cleanroom",
    },
    {
      common: isRTL ? "محطات تعزيز مياه الشرب" : "Water Booster Station",
      binomial: isRTL ? "مضخات ترددية ذكية · استشعار الضغط" : "VFD Inverter Booster Pumps · Dual Redundancy",
      photo: {
        url: assets.water2,
        text: isRTL ? "محطات تعزيز مياه الشرب" : "Municipal Water Booster Grid",
        by: isRTL ? "شبكة التوزيع البلدي ومراقبة الضغط" : "Metropolitan Hydraulic Network",
        pos: "center",
      },
      href: "/dashboard/assets",
      badge: isRTL ? "ضغط 16-Bar ذكي" : "16-Bar Regulated",
    },
    {
      common: isRTL ? "منظومات مكافحة الحريق الآلية" : "Automated Fire Safety",
      binomial: isRTL ? "استجابة فورية · غمر ورغوة وإطفاء بالغاز" : "High-Pressure Deluge & FM-200 Clean Agent",
      photo: {
        url: assets.water3,
        text: isRTL ? "منظومات مكافحة الحريق الآلية" : "Automated Deluge Fire Safety",
        by: isRTL ? "حماية السلامة والأصول الميدانية" : "NFPA-Compliant Life Safety Grid",
        pos: "center",
      },
      href: "/dashboard/services",
      badge: isRTL ? "استجابة فورية <3s" : "<3s Auto Deluge",
    },
    {
      common: isRTL ? "معدات الرنين والتشخيص الطبي" : "Diagnostic MRI Systems",
      binomial: isRTL ? "طاقة نقية غير منقطعة (True Online UPS)" : "Medical Grade UPS · Zero Harmonic Distortion",
      photo: {
        url: assets.medical2,
        text: isRTL ? "معدات الرنين والتشخيص الطبي" : "Diagnostic MRI & Power UPS",
        by: isRTL ? "أنظمة التشخيص والمسح الإشعاعي" : "Radiology & Diagnostic Center",
        pos: "center",
      },
      href: "/dashboard/assets",
      badge: isRTL ? "عزل طبي Class-I" : "Medical Class-I",
    },
    {
      common: isRTL ? "غرف التحكم ومركز الـ IoT" : "SCADA & Telemetry Hub",
      binomial: isRTL ? "ربط الحساسات اللحظي · صيانة تنبؤية AI" : "Real-time Telemetry · Predictive AI Insights",
      photo: {
        url: assets.heroImage,
        text: isRTL ? "غرف التحكم ومركز الـ IoT" : "SCADA & Telemetry Center",
        by: isRTL ? "المنظومة المركزية لإدارة الأصول والمعدات" : "Unified Operations Orchestration",
        pos: "center",
      },
      href: "/dashboard",
      badge: isRTL ? "ذكاء اصطناعي AI" : "AI Predictive Hub",
    },
  ], [isRTL]);

  const handleActiveChange = React.useCallback((_: number, item: GalleryItem) => {
    setActiveAsset(item);
  }, []);

  return (
    <section id="services-wheel" className="relative w-full py-20 bg-slate-950 overflow-hidden border-y border-slate-800/80">
      {/* Background radial ambient lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-emerald-900/10 blur-[110px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4 backdrop-blur-sm">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>
              {isRTL ? "القلب النابض للنظام • إدارة الخدمات الحيوية" : "The Operational Pulse • Critical Services"}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {isRTL ? (
              <>
                عجلة الخدمات الحيوية والأصول{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
                  فائقة الأهمية
                </span>
              </>
            ) : (
              <>
                Interactive Gallery of{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">
                  Critical Services & Assets
                </span>
              </>
            )}
          </h2>

          <p className="mt-4 text-base md:text-lg text-slate-400 leading-relaxed">
            {isRTL
              ? "تحكم دوري ومراقبة حية لأهم المنظومات والمحطات المشغلة للمستشفيات، المصانع، وشبكات المياه مع ارتباط رقمي دقيق يمنع التوقف المفاجئ."
              : "Live visual registry and uptime orchestration for hospital ICUs, power generation, and industrial distribution lines—connected in real-time."}
          </p>

          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
              {isRTL ? "جاهزية تشغيلية 99.98%" : "99.98% Operational Uptime"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />
              {isRTL ? "معالجة CSS 3D فائقة الخفة" : "Ultra-Fast CSS 3D Engine"}
            </span>
          </div>
        </div>

        {/* 3D Circular Gallery Container (Pure CSS 3D - 0 Three.js lag, 120fps smooth) */}
        <div className="relative w-full h-[640px] md:h-[720px] rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Dynamic Ambient Backdrop of Active Asset */}
          {activeAsset && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <img
                src={activeAsset.photo.url}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover blur-3xl opacity-25 scale-125 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-slate-950/70" />
            </div>
          )}

          <CircularGallery
            items={galleryItems}
            radius={580}
            intervalMs={3200}
            autoPlay={true}
            onActiveChange={handleActiveChange}
            className="w-full h-full text-white relative z-10"
          />

          {/* Bottom overlay with quick navigation & Shiny Button */}
          <div className="absolute bottom-6 inset-x-6 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md shadow-2xl z-40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {isRTL ? "نظام ربط الأصول بالخدمات (Asset-Service Linking)" : "Asset-Service Relationship Graph"}
                </p>
                <p className="text-xs text-slate-400">
                  {isRTL ? "دوران تلقائي ذكي يستعرض الأصول والخدمات الحيوية بتوقيت متناسق" : "Automated hands-free showcase cycling through mission-critical assets"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/dashboard/services">
                <ShinyButton
                  label={isRTL ? "إدارة الخدمات الحيوية" : "Manage Services"}
                  fillColor="#0f172a"
                  accentColor="#1d68bd"
                  accentSoftColor="#2eaf7d"
                  className="text-xs px-4 py-2.5"
                >
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>{isRTL ? "إدارة الخدمات الحيوية" : "Manage Services"}</span>
                </ShinyButton>
              </Link>

              <Link to="/dashboard/assets">
                <ShinyButton
                  label={isRTL ? "لوحة الأصول الميدانية" : "Assets Registry"}
                  fillColor="#1e293b"
                  accentColor="#2eaf7d"
                  accentSoftColor="#38bdf8"
                  className="text-xs px-4 py-2.5"
                >
                  <span>{isRTL ? "سجل الأصول" : "Assets Registry"}</span>
                  {isRTL ? <ArrowLeft className="w-3.5 h-3.5 text-blue-400" /> : <ArrowRight className="w-3.5 h-3.5 text-blue-400" />}
                </ShinyButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServicesWheelSection;
