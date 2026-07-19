"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuditStore } from "@/store/useAuditStore";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { MetricCard } from "@/components/ui/MetricCard";
import { IssueCard } from "@/components/ui/IssueCard";
import { FullAuditResult } from "@/types/audit";
import {
  SearchCheck,
  Zap,
  Eye,
  ShieldAlert,
  Smartphone,
  FileText,
  Sparkles,
  Search,
  Bot,
  ExternalLink,
  Globe,
  ArrowRight,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { activeScan, setIsChatOpen, setSelectedIssueForFix } = useAuditStore();
  const scan: FullAuditResult | null = activeScan;

  if (!scan) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
        <div className="p-4 rounded-3xl bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <Globe className="w-10 h-10" />
        </div>
        <div className="max-w-md space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">No Active Website Audit</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Enter your website URL to initiate your 7-dimension audit scan with Google Gemini AI recommendations.
          </p>
        </div>
        <Link
          href="/dashboard/scanner"
          className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-xl shadow-blue-600/30"
        >
          <Search className="w-4 h-4" />
          <span>Audit Your Website Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Prepare Radar Chart data for 7 dimensions
  const radarData = [
    { subject: "SEO", score: scan.scores.seo },
    { subject: "Perf", score: scan.scores.performance },
    { subject: "A11y", score: scan.scores.accessibility },
    { subject: "Security", score: scan.scores.security },
    { subject: "Mobile", score: scan.scores.mobile },
    { subject: "Content", score: scan.scores.content },
    { subject: "UI/UX", score: scan.scores.ui },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Audit Dashboard</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              Active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-2">
            <span>Inspecting:</span>
            <a href={scan.url} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-mono flex items-center gap-1">
              {scan.url} <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsChatOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-amber-500/20"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI Assistant</span>
          </button>
          <Link
            href="/dashboard/scanner"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-md shadow-blue-500/20"
          >
            <Search className="w-4 h-4" />
            <span>New Site Scan</span>
          </Link>
        </div>
      </div>

      {/* OVERALL SCORE & RADAR CHART HERO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Score Dial */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 glass-panel flex flex-col items-center justify-center text-center">
          <ScoreGauge score={scan.overallScore} size={200} label="Overall Health" />
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 w-full flex items-center justify-around text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">CMS Detected</span>
              <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{scan.cmsDetected}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">Framework</span>
              <span className="font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">{scan.frameworkDetected}</span>
            </div>
          </div>
        </div>

        {/* 7-Dimension Radar Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 glass-panel flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">7-Dimension Health Balance</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Score distribution across technical categories</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Scan duration: {scan.durationMs}ms</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar name="Scan" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* GEMINI EXECUTIVE AI SUMMARY BANNER */}
      {scan.aiSummary && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/10 glass-panel"
        >
          <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Google Gemini AI Executive Audit Summary</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">{scan.aiSummary}</p>
        </motion.div>
      )}

      {/* 7 CATEGORY METRIC CARDS GRID */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Category Breakdowns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/dashboard/scans/seo">
            <MetricCard
              title="SEO Analysis"
              score={scan.scores.seo}
              icon={SearchCheck}
              issueCount={scan.issues.filter((i) => i.category === "SEO").length}
              weight="25% Weight"
              description="Meta tags, Schema, Canonicals & Headings"
            />
          </Link>

          <Link href="/dashboard/scans/performance">
            <MetricCard
              title="Performance"
              score={scan.scores.performance}
              icon={Zap}
              issueCount={scan.issues.filter((i) => i.category === "PERFORMANCE").length}
              weight="25% Weight"
              description="TTFB, Payload sizes & Core Web Vitals"
            />
          </Link>

          <Link href="/dashboard/scans/accessibility">
            <MetricCard
              title="Accessibility"
              score={scan.scores.accessibility}
              icon={Eye}
              issueCount={scan.issues.filter((i) => i.category === "ACCESSIBILITY").length}
              weight="15% Weight"
              description="Alt text, ARIA roles & Form labels"
            />
          </Link>

          <Link href="/dashboard/scans/security">
            <MetricCard
              title="Security"
              score={scan.scores.security}
              icon={ShieldAlert}
              issueCount={scan.issues.filter((i) => i.category === "SECURITY").length}
              weight="15% Weight"
              description="HTTPS, HSTS, CSP & Security headers"
            />
          </Link>

          <Link href="/dashboard/scans/mobile">
            <MetricCard
              title="Mobile"
              score={scan.scores.mobile}
              icon={Smartphone}
              issueCount={scan.issues.filter((i) => i.category === "MOBILE").length}
              weight="10% Weight"
              description="Viewport meta, Responsive images"
            />
          </Link>

          <Link href="/dashboard/scans/content">
            <MetricCard
              title="Content Quality"
              score={scan.scores.content}
              icon={FileText}
              issueCount={scan.issues.filter((i) => i.category === "CONTENT").length}
              weight="10% Weight"
              description="Readability score, word count & CTAs"
            />
          </Link>
        </div>
      </div>

      {/* CRITICAL ACTIONABLE ISSUES FEED */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Priority Action Items & Code Fixes</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Click any issue to open Gemini AI copy-paste code generator</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {scan.issues.length} Total Issues
          </span>
        </div>

        <div className="space-y-4">
          {scan.issues.slice(0, 6).map((issue) => (
            <IssueCard key={issue.id} issue={issue} onOpenFixModal={setSelectedIssueForFix} />
          ))}
        </div>
      </div>
    </div>
  );
}
