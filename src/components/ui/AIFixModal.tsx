"use client";

import React from "react";
import { useAuditStore } from "@/store/useAuditStore";
import { X, Sparkles, Code2, Lightbulb, CheckCircle2 } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { motion, AnimatePresence } from "framer-motion";

export const AIFixModal: React.FC = () => {
  const { isFixModalOpen, selectedIssueForFix, setIsFixModalOpen } = useAuditStore();

  if (!isFixModalOpen || !selectedIssueForFix) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  AI Solution Generator
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedIssueForFix.title}
                </h3>
              </div>
            </div>
            <button
              onClick={() => setIsFixModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="mt-5 space-y-5">
            {/* Impact stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                <span className="text-[11px] font-medium block">Estimated SEO Score Gain</span>
                <span className="text-xl font-bold">+{selectedIssueForFix.seoImpact || 5} Points</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300">
                <span className="text-[11px] font-medium block">Estimated UX Score Gain</span>
                <span className="text-xl font-bold">+{selectedIssueForFix.uxImpact || 8} Points</span>
              </div>
            </div>

            {/* Why it matters */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-semibold text-sm mb-1">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Why Fix This?</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedIssueForFix.whyItMatters || selectedIssueForFix.description}
              </p>
            </div>

            {/* Recommendation */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>Action Plan</span>
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {selectedIssueForFix.recommendation}
              </p>
            </div>

            {/* Code fix */}
            {selectedIssueForFix.codeFix && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <Code2 className="w-4 h-4 text-blue-500" />
                  <span>Production Code Fix Snippet</span>
                </span>
                <CodeBlock
                  code={selectedIssueForFix.codeFix}
                  language={selectedIssueForFix.codeFixLanguage || "html"}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-3">
            <button
              onClick={() => setIsFixModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
