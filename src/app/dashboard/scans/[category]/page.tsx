"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuditStore } from "@/store/useAuditStore";
import { ScoreGauge } from "@/components/ui/ScoreGauge";
import { IssueCard } from "@/components/ui/IssueCard";
import { IssueCategory } from "@/types/audit";
import {
  SearchCheck,
  Zap,
  Eye,
  ShieldAlert,
  Smartphone,
  FileText,
  Palette,
  ArrowLeft,
  Bot,
} from "lucide-react";
import Link from "next/link";

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryParam = String(params.category || "seo").toUpperCase();
  const { activeScan, setSelectedIssueForFix, setIsChatOpen } = useAuditStore();
  const router = useRouter();

  if (!activeScan) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-sm text-slate-400">No active audit scan available.</p>
        <Link href="/dashboard/scanner" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs">
          Run a Site Scan
        </Link>
      </div>
    );
  }

  const getCategoryDetails = () => {
    switch (categoryParam) {
      case "PERFORMANCE":
        return {
          name: "Performance & Web Vitals",
          score: activeScan.scores.performance,
          icon: Zap,
          catKey: "PERFORMANCE" as IssueCategory,
          metrics: [
            { label: "Server TTFB", value: `${activeScan.metadata.ttfbMs} ms` },
            { label: "HTML Size", value: `${activeScan.metadata.htmlSizeKb} KB` },
            { label: "Est. FCP", value: `${activeScan.metadata.estimatedFcpMs} ms` },
            { label: "Est. LCP", value: `${(activeScan.metadata.estimatedLcpMs / 1000).toFixed(1)} s` },
          ],
        };
      case "ACCESSIBILITY":
        return {
          name: "WCAG 2.1 Accessibility",
          score: activeScan.scores.accessibility,
          icon: Eye,
          catKey: "ACCESSIBILITY" as IssueCategory,
          metrics: [
            { label: "Missing Alt Images", value: `${activeScan.metadata.missingAltImagesCount}` },
            { label: "Unlabelled Inputs", value: `${activeScan.metadata.missingFormLabelsCount}` },
            { label: "ARIA Errors", value: `${activeScan.metadata.ariaErrorsCount}` },
          ],
        };
      case "SECURITY":
        return {
          name: "Security & Headers",
          score: activeScan.scores.security,
          icon: ShieldAlert,
          catKey: "SECURITY" as IssueCategory,
          metrics: [
            { label: "HTTPS Protocol", value: activeScan.metadata.isHttps ? "Enabled" : "Insecure" },
            { label: "HSTS Header", value: activeScan.metadata.securityHeaders.strictTransportSecurity ? "Active" : "Missing" },
            { label: "CSP Header", value: activeScan.metadata.securityHeaders.contentSecurityPolicy ? "Active" : "Missing" },
            { label: "Mixed Content", value: `${activeScan.metadata.mixedContentCount} items` },
          ],
        };
      case "MOBILE":
        return {
          name: "Mobile Responsiveness",
          score: activeScan.scores.mobile,
          icon: Smartphone,
          catKey: "MOBILE" as IssueCategory,
          metrics: [
            { label: "Viewport Tag", value: activeScan.metadata.viewportMeta ? "Present" : "Missing" },
            { label: "Responsive Images", value: `${activeScan.metadata.responsiveImageRatio}%` },
          ],
        };
      case "CONTENT":
        return {
          name: "Content & Readability",
          score: activeScan.scores.content,
          icon: FileText,
          catKey: "CONTENT" as IssueCategory,
          metrics: [
            { label: "Word Count", value: `${activeScan.metadata.wordCount} words` },
            { label: "Readability Index", value: `${activeScan.metadata.readabilityScore}/100` },
          ],
        };
      case "UI":
      case "UI_UX":
        return {
          name: "UI / UX Insights",
          score: activeScan.scores.ui,
          icon: Palette,
          catKey: "UI_UX" as IssueCategory,
          metrics: [
            { label: "Framework", value: activeScan.frameworkDetected },
            { label: "CMS Platform", value: activeScan.cmsDetected },
          ],
        };
      default:
        return {
          name: "SEO Optimization",
          score: activeScan.scores.seo,
          icon: SearchCheck,
          catKey: "SEO" as IssueCategory,
          metrics: [
            { label: "H1 Tag Count", value: `${activeScan.metadata.h1Count}` },
            { label: "Canonical URL", value: activeScan.metadata.canonicalUrl ? "Configured" : "Missing" },
            { label: "Schema JSON-LD", value: `${activeScan.metadata.schemaTypes.length} Types` },
          ],
        };
    }
  };

  const details = getCategoryDetails();
  const categoryIssues = activeScan.issues.filter(
    (i) => i.category === details.catKey || categoryParam.includes(i.category)
  );

  const Icon = details.icon;

  return (
    <div className="space-y-8">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <button
          onClick={() => setIsChatOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-amber-500/20"
        >
          <Bot className="w-4 h-4" />
          <span>Ask AI Assistant</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 glass-panel flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-4 rounded-2xl bg-blue-600/10 text-blue-500 border border-blue-500/20">
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Detailed Category Audit</span>
            <h1 className="text-2xl font-extrabold text-white">{details.name}</h1>
            <p className="text-xs text-slate-400 mt-1">Audit score & findings for {activeScan.url}</p>
          </div>
        </div>

        <ScoreGauge score={details.score} size={140} label="Category Score" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {details.metrics.map((m, idx) => (
          <div key={idx} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/40">
            <span className="text-[10px] font-semibold uppercase text-slate-400 block">{m.label}</span>
            <span className="text-lg font-bold text-white mt-1 block">{m.value}</span>
          </div>
        ))}
      </div>

      {/* Category Issues Feed */}
      <div>
        <h2 className="text-base font-bold text-white mb-4">
          Category Issues ({categoryIssues.length})
        </h2>

        {categoryIssues.length === 0 ? (
          <div className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 text-xs font-semibold text-center">
            ✓ Excellent! No critical or medium severity issues found for {details.name}.
          </div>
        ) : (
          <div className="space-y-4">
            {categoryIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} onOpenFixModal={setSelectedIssueForFix} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
