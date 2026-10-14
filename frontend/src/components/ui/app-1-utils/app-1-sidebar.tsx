"use client";

import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Cpu,
  Layers,
  Wrench,
  Activity,
  ShieldCheck,
  Settings,
  ArrowLeft,
  Database,
  Radio,
} from "lucide-react";
import { useSidebar } from "@/components/ui/app-1-utils/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Executive Analytics", icon: LayoutDashboard, href: "/dashboard", active: true },
  { label: "Critical Assets", icon: Layers, href: "/dashboard/assets" },
  { label: "AI Anomaly Telemetry", icon: Radio, href: "/#how-it-works" },
  { label: "Automated Work Orders", icon: Wrench, href: "/dashboard/tasks" },
  { label: "Critical Services", icon: ShieldCheck, href: "/dashboard/services" },
  { label: "System Health & SCADA", icon: Cpu, href: "/dashboard" },
];

export function App1Sidebar() {
  const { open } = useSidebar();

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-card/60 backdrop-blur-xl transition-all duration-300 z-20",
        open ? "w-64" : "w-16"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow-md shadow-blue-500/20">
          <Activity className="h-5 w-5" />
        </div>
        {open && (
          <div className="flex flex-col truncate">
            <span className="text-sm font-bold tracking-tight text-foreground">AssetFlow</span>
            <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider">Enterprise Ops</span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2 py-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors",
                item.active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {open && <span className="truncate">{item.label}</span>}
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Return Link */}
      <div className="border-t border-border p-3">
        <Link to="/">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 shrink-0" />
            {open && <span>Back to Home</span>}
          </Button>
        </Link>
      </div>
    </aside>
  );
}
export default App1Sidebar;
