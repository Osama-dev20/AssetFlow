"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../../../context/AppContext";
import HalftoneWordmarkFooter from "../../ui/halftone-wordmark-footer";

export function Footer() {
  const { language } = useApp();
  const isRTL = language === "ar";
  const location = useLocation();
  const isNotHome = location.pathname !== "/";

  const columns = [
    {
      title: isRTL ? "المنظومة" : "Platform",
      links: [
        { label: isRTL ? "سجل الأصول الميدانية" : "Assets Registry", href: "/dashboard/assets" },
        { label: isRTL ? "الخدمات الحيوية" : "Critical Services", href: "/dashboard/services" },
        { label: isRTL ? "المواقع والمنشآت" : "Sites & Facilities", href: "/dashboard/sites" },
        { label: isRTL ? "أوامر العمل والصيانة" : "Work Orders CMMS", href: "/dashboard/work-orders" },
      ],
    },
    {
      title: isRTL ? "القطاعات الحيوية" : "Industries",
      links: [
        { label: isRTL ? "المستشفيات والرعاية الصحية" : "Healthcare & Clinical", href: isNotHome ? "/#audience" : "#audience" },
        { label: isRTL ? "محطات التحلية وشبكات المياه" : "Water & Utilities", href: isNotHome ? "/#audience" : "#audience" },
        { label: isRTL ? "المصانع وخطوط الإنتاج" : "Industrial Plants", href: isNotHome ? "/#audience" : "#audience" },
        { label: isRTL ? "الجامعات والتعليم العالي" : "Higher Education", href: isNotHome ? "/#audience" : "#audience" },
      ],
    },
    {
      title: isRTL ? "بوابات الدخول" : "Portals & Contact",
      links: [
        { label: isRTL ? "بوابة المدير العام (Admin)" : "Admin Portal", href: "/login/admin" },
        { label: isRTL ? "بوابة فني الصيانة (Field Ops)" : "Technician Portal", href: "/login/technician" },
        { label: isRTL ? "بوابة المبلّغ التشغيلي (Reporter)" : "Reporter Portal", href: "/login/reporter" },
        { label: isRTL ? "فريق الدعم والاستشارات" : "Contact & Advisory", href: "/contact" },
      ],
    },
  ];

  return (
    <div className="relative w-full border-t border-slate-800/80 bg-slate-950" dir={isRTL ? "rtl" : "ltr"}>
      <HalftoneWordmarkFooter
        wordmark="assetflow"
        label="AssetFlow Enterprise"
        meta={
          isRTL
            ? "©2026 AssetFlow · بُني بحُب ❤ للأصول والخدمات الحيوية"
            : "©2026 AssetFlow · Built with love ❤ for Critical Infrastructure"
        }
        columns={columns}
        backToTop={true}
        height="560px"
        dotGap={6}
        radius={90}
        crop={0}
        grain={0.35}
        interactive={true}
        palette={{
          background: "#070b14", // AssetFlow deep navy
          ink: "#e2e8f0",        // Crisp contrast dots
          warm: "#2eaf7d",       // AssetFlow emerald gleam on touch
        }}
      />
    </div>
  );
}

export default Footer;
