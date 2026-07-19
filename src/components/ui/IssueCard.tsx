"use client";

import React from "react";
import { AuditIssue } from "@/types/audit";
import { AlertTriangle, AlertCircle, Info, Sparkles, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface IssueCardProps {
  issue: AuditIssue;
  onOpenFixModal: (issue: AuditIssue) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onOpenFixModal }) => {
  const getSeverityBadge = () => {
    switch (issue.severity) {
      case "CRITICAL":
        return {
          bg: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
          icon: AlertCircle,
          label: "Critical",
        };
      case "HIGH":
        return {
          bg: "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400",
          icon: AlertTriangle,
          label: "High",
        };
      case "MEDIUM":
        return {
          bg: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
          icon: AlertTriangle,
          label: "Medium",
        };
      default:
        return {
          bg: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
          icon: Info,
          label: "Low / Info",
        };
    }
  };

  const badge = getSeverityBadge();
  const Icon = badge.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 glass-panel hover:border-slate-300 dark:hover:border-slate-700 transition-all"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${badge.bg}`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{badge.label}</span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
            {issue.category}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          {issue.seoImpact > 0 && (
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
              +{issue.seoImpact} SEO Pts
            </span>
          )}
          {issue.uxImpact > 0 && (
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20">
              +{issue.uxImpact} UX Pts
            </span>
          )}
        </div>
      </div>

      <h4 className="text-base font-bold text-slate-900 dark:text-white">{issue.title}</h4>
      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{issue.description}</p>

      {issue.whyItMatters && (
        <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
          <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
            Why It Matters
          </span>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-normal">{issue.whyItMatters}</p>
        </div>
      )}

      {issue.element && (
        <div className="mt-2 text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
          <span className="font-semibold font-sans">Element:</span> {issue.element}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <p className="text-xs text-slate-600 dark:text-slate-400 flex-1 pr-4 truncate">
          <span className="font-medium text-slate-900 dark:text-white">Fix:</span> {issue.recommendation}
        </p>

        <button
          onClick={() => onOpenFixModal(issue)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-md shadow-blue-500/20 active:scale-95 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>AI Code Fix</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
