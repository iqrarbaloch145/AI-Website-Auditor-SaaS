"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  score: number;
  icon: LucideIcon;
  issueCount: number;
  description?: string;
  weight?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  score,
  icon: Icon,
  issueCount,
  description,
  weight,
  onClick,
  isSelected,
}) => {
  let scoreColor = "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  let barColor = "bg-emerald-500";
  if (score < 70) {
    scoreColor = "text-rose-500 bg-rose-500/10 border-rose-500/20";
    barColor = "bg-rose-500";
  } else if (score < 90) {
    scoreColor = "text-amber-500 bg-amber-500/10 border-amber-500/20";
    barColor = "bg-amber-500";
  }

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`relative cursor-pointer p-5 rounded-2xl border transition-all glass-panel ${
        isSelected
          ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/10"
          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">{title}</h3>
              {weight && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                  {weight}
                </span>
              )}
            </div>
            {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-lg border font-bold text-sm ${scoreColor}`}>
          {score}/100
        </div>
      </div>

      <div className="mt-4">
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full ${barColor} transition-all duration-700`} style={{ width: `${score}%` }} />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{issueCount === 0 ? "No issues detected" : `${issueCount} issue${issueCount > 1 ? "s" : ""} found`}</span>
        <span className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">View Details &rarr;</span>
      </div>
    </motion.div>
  );
};
