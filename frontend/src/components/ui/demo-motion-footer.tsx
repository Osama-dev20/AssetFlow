"use client";

import React from "react";
import { CinematicFooter } from "@/components/ui/motion-footer";

export default function MotionFooterDemo() {
  return (
    <div className="relative w-full bg-slate-950 min-h-screen font-sans selection:bg-emerald-500/20 overflow-x-hidden">
      {/* Main Content Area to demonstrate the curtain reveal */}
      <main className="relative z-10 w-full min-h-[110vh] bg-slate-900 flex flex-col items-center justify-center text-white border-b border-slate-800 shadow-2xl rounded-b-3xl px-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(29,104,189,0.15)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-6">
          <span>AssetFlow Motion Footer</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 uppercase">
          مرّر للأسفل لرؤية الفوتر السينمائي
        </h1>
        
        <p className="text-slate-400 max-w-lg mb-8 text-sm md:text-base">
          Scroll down to experience the curtain reveal, magnetic buttons, giant parallax typography, and beating heart badge.
        </p>

        <div className="w-[2px] h-28 bg-gradient-to-b from-emerald-400 via-blue-500 to-transparent animate-pulse" />
      </main>

      {/* The Cinematic Footer is revealed here */}
      <CinematicFooter />
    </div>
  );
}
