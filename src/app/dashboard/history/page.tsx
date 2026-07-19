"use client";

import React from "react";
import { useAuditStore } from "@/store/useAuditStore";
import { History, ExternalLink, Search, Trash2 } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const { activeScan, setActiveScan, scanHistory, deleteScanFromHistory } = useAuditStore();

  const displayList = scanHistory.length > 0 ? scanHistory : activeScan ? [activeScan] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <History className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            <span>Audit History & Saved Websites</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Persistent website scan history and health scores
          </p>
        </div>

        <Link
          href="/dashboard/scanner"
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-2 shadow-md shadow-blue-600/20"
        >
          <Search className="w-4 h-4" />
          <span>New Scan</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 glass-panel overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4">Target URL</th>
              <th className="p-4">Overall Score</th>
              <th className="p-4">CMS / Framework</th>
              <th className="p-4">Issues Found</th>
              <th className="p-4">Scan Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
            {displayList.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No scan history available yet. Run your first audit scan!
                </td>
              </tr>
            ) : (
              displayList.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-semibold text-slate-900 dark:text-white font-mono flex items-center space-x-1.5">
                    <span>{item.url}</span>
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-500">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg font-bold border ${
                        item.overallScore >= 90
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : item.overallScore >= 70
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {item.overallScore}/100
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">
                    {item.cmsDetected} ({item.frameworkDetected})
                  </td>
                  <td className="p-4 font-semibold">{item.issues.length} items</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setActiveScan(item)}
                      className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white font-semibold transition-all"
                    >
                      View Report
                    </button>
                    <button
                      onClick={() => item.id && deleteScanFromHistory(item.id)}
                      title="Delete website from history"
                      className="px-2 py-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
