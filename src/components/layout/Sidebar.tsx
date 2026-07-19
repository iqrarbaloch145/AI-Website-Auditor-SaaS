"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  SearchCheck,
  Zap,
  Eye,
  ShieldAlert,
  Smartphone,
  FileText,
  Palette,
  History,
  Download,
  Settings,
  Bot,
} from "lucide-react";
import { useAuditStore } from "@/store/useAuditStore";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { activeScan, setIsChatOpen } = useAuditStore();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Website Scanner", href: "/dashboard/scanner", icon: Search },
    { name: "SEO Analysis", href: "/dashboard/scans/seo", icon: SearchCheck },
    { name: "Performance", href: "/dashboard/scans/performance", icon: Zap },
    { name: "Accessibility", href: "/dashboard/scans/accessibility", icon: Eye },
    { name: "Security", href: "/dashboard/scans/security", icon: ShieldAlert },
    { name: "Mobile", href: "/dashboard/scans/mobile", icon: Smartphone },
    { name: "Content", href: "/dashboard/scans/content", icon: FileText },
    { name: "UI / UX Insights", href: "/dashboard/scans/ui", icon: Palette },
    { name: "Audit History", href: "/dashboard/history", icon: History },
    { name: "Export Reports", href: "/dashboard/reports", icon: Download },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Navigation
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Active Scan Box */}
        {activeScan && (
          <div className="p-3.5 rounded-2xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              Active Audit Context
            </span>
            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate mt-1">
              {activeScan.title || activeScan.url}
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400">Score</span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400">{activeScan.overallScore}/100</span>
            </div>
            <button
              onClick={() => setIsChatOpen(true)}
              className="mt-3 w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-amber-500/20 transition-all"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI About This Scan</span>
            </button>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center">
        AI Website Auditor v1.0 &bull; Production Ready
      </div>
    </aside>
  );
};
