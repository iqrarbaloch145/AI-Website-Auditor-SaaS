"use client";

import React, { useEffect, useState } from "react";
import { useAuditStore } from "@/store/useAuditStore";
import { FullAuditResult } from "@/types/audit";
import { History, ExternalLink, ArrowRight, Search } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const { activeScan, setActiveScan } = useAuditStore();
  const [historyList, setHistoryList] = useState<FullAuditResult[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (data.success && data.scans) {
        setHistoryList(data.scans);
      } else if (activeScan) {
        setHistoryList([activeScan]);
      }
    } catch {
      if (activeScan) setHistoryList([activeScan]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <History className="w-6 h-6 text-blue-500" />
            <span>Audit History & Logs</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Previous website scan executions and health scores</p>
        </div>

        <Link
          href="/dashboard/scanner"
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-2 shadow-md shadow-blue-600/20"
        >
          <Search className="w-4 h-4" />
          <span>New Scan</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 glass-panel overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4">Target URL</th>
              <th className="p-4">Overall Score</th>
              <th className="p-4">CMS / Framework</th>
              <th className="p-4">Issues Found</th>
              <th className="p-4">Scan Date</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {historyList.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No scan history available yet. Run your first audit scan!
                </td>
              </tr>
            ) : (
              historyList.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-semibold text-white font-mono flex items-center space-x-1.5">
                    <span>{item.url}</span>
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-400">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg font-bold border ${
                        item.overallScore >= 90
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : item.overallScore >= 70
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {item.overallScore}/100
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">
                    {item.cmsDetected} ({item.frameworkDetected})
                  </td>
                  <td className="p-4 font-semibold">{item.issues.length} items</td>
                  <td className="p-4 text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setActiveScan(item);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white font-semibold transition-all"
                    >
                      View Report
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
