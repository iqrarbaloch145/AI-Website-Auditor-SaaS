"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuditStore } from "@/store/useAuditStore";
import { Search, Globe, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function ScannerForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addScanToHistory } = useAuditStore();

  const [inputUrl, setInputUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlQuery = searchParams.get("url");
    if (urlQuery) {
      setInputUrl(urlQuery);
      runScan(urlQuery);
    }
  }, [searchParams]);

  const runScan = async (targetUrl: string) => {
    setIsScanning(true);
    setError(null);
    setProgress(10);
    setScanStep("Validating website URL and establishing TLS handshake...");

    const steps = [
      { p: 25, msg: "Fetching HTML DOM payload & measuring TTFB response server time..." },
      { p: 45, msg: "Inspecting Meta tags, OpenGraph, Schema JSON-LD & Canonical link headers..." },
      { p: 65, msg: "Auditing Core Web Vitals estimates (FCP, LCP, CLS, TBT) & asset bundles..." },
      { p: 80, msg: "Running WCAG 2.1 Accessibility & Security HSTS/CSP vulnerability checks..." },
      { p: 95, msg: "Invoking Google Gemini AI engine for code fix recommendations..." },
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setProgress(steps[stepIdx].p);
        setScanStep(steps[stepIdx].msg);
        stepIdx++;
      }
    }, 600);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      clearInterval(interval);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Audit execution failed");
      }

      setProgress(100);
      setScanStep("Scan finished! Loading dashboard results...");
      addScanToHistory(data.scan);

      setTimeout(() => {
        setIsScanning(false);
        router.push("/dashboard");
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setIsScanning(false);
      setError((err as Error).message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || isScanning) return;
    runScan(inputUrl);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
          <span>Website Audit Scanner</span>
          <Sparkles className="w-5 h-5 text-amber-500" />
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Analyze any website URL in real-time. Evaluates 7 core dimensions with Gemini AI recommendations.
        </p>
      </div>

      <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 glass-panel shadow-2xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Target Website URL</label>
            <div className="relative">
              <Globe className="w-5 h-5 absolute left-4 top-3.5 text-slate-500" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://example.com"
                disabled={isScanning}
                required
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isScanning || !inputUrl.trim()}
            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Auditing Website... ({progress}%)</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Start Full Audit Scan</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Dynamic Scanning Animation & Logs */}
        {isScanning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-500 animate-spin" />
                <span>Audit Execution Pipeline</span>
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-mono">{progress}%</span>
            </div>

            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed">
              <div className="text-slate-500 text-[10px] uppercase font-bold mb-1">Live Execution Output:</div>
              <p className="text-blue-400">{scanStep}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ScannerPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-xs text-slate-400">Loading scanner...</div>}>
      <ScannerForm />
    </Suspense>
  );
}
