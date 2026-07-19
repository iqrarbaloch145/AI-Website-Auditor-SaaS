"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Zap,
  Search,
  Lock,
  Eye,
  Smartphone,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Globe,
  Bot,
  ChevronDown,
  Code2,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const router = useRouter();

  const handleQuickScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setLoading(true);
    router.push(`/dashboard/scanner?url=${encodeURIComponent(urlInput)}`);
  };

  const setPresetUrl = (url: string) => {
    setUrlInput(url);
  };

  const features = [
    {
      icon: Search,
      title: "SEO Optimization",
      desc: "Meta title/desc analysis, OpenGraph, Schema.org, canonical tags, heading hierarchy & keyword density.",
      badge: "25% Weight",
      color: "from-blue-500/20 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    },
    {
      icon: Zap,
      title: "Performance & Web Vitals",
      desc: "TTFB measurement, HTML/CSS/JS payload sizes, render-blocking scripts, and Core Web Vitals estimates (FCP, LCP, CLS).",
      badge: "25% Weight",
      color: "from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    },
    {
      icon: Eye,
      title: "Accessibility (WCAG 2.1)",
      desc: "Image alt tag audit, ARIA landmark roles, color contrast ratios, form label associations, and keyboard focus outlines.",
      badge: "15% Weight",
      color: "from-purple-500/20 to-pink-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
    },
    {
      icon: Lock,
      title: "Security & Headers",
      desc: "HTTPS protocol verification, HSTS, Content Security Policy (CSP), X-Frame-Options clickjacking, and cookie security flags.",
      badge: "15% Weight",
      color: "from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    },
    {
      icon: Smartphone,
      title: "Mobile Responsiveness",
      desc: "Viewport configuration, responsive image scaling, tap target layout sizes, and mobile viewport rendering.",
      badge: "10% Weight",
      color: "from-cyan-500/20 to-blue-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
    },
    {
      icon: FileText,
      title: "Content & Readability",
      desc: "Flesch-Kincaid readability scoring, word count sufficiency, spam indicator checks, and CTA quality.",
      badge: "10% Weight",
      color: "from-rose-500/20 to-red-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
    },
  ];

  const faqs = [
    {
      q: "How does the AI Website Auditor engine work?",
      a: "Our multi-stage auditor fetches your target website's HTML DOM, measures server response metrics (TTFB), parses meta tags, images, scripts, stylesheets, and security headers. It computes weighted health scores across 7 dimensions and invokes Google Gemini AI to generate copy-paste code fixes.",
    },
    {
      q: "What AI model powers the recommendations and chat assistant?",
      a: "The auditor uses Google Gemini API (Gemini 2.5 Flash) conditioned on your exact website DOM extractions and issue list to provide targeted code snippets and answer questions.",
    },
    {
      q: "Can I export reports for clients or stakeholders?",
      a: "Yes! You can download executive PDF reports, export raw CSV spreadsheets, download structured JSON payloads, or generate passwordless public share links.",
    },
    {
      q: "Does this audit require installing any software or code scripts?",
      a: "No installation is required. Simply enter any public URL to initiate instant serverless auditing in under 1 second.",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* BACKGROUND SPOTLIGHTS & GRID */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[650px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[160px] pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section className="relative pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Gemini Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-300 text-xs font-semibold mb-8 shadow-inner backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-pulse" />
          <span>Powered by Google Gemini 2.5 AI & Real-Time DOM Inspection</span>
          <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-mono text-[10px]">NEW</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 dark:text-white max-w-5xl mx-auto leading-[1.05]"
        >
          Analyze. Understand. <br />
          <span className="gradient-text drop-shadow-sm">Improve Your Website.</span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-normal"
        >
          Production-grade website auditing platform. Get comprehensive <span className="text-slate-900 dark:text-slate-200 font-semibold">SEO, Performance, Accessibility, Security, Mobile, Content, and UI/UX</span> scores with copy-paste code fixes generated by Google Gemini.
        </motion.p>

        {/* QUICK URL SCANNER INPUT FORM */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 max-w-2xl mx-auto space-y-3"
        >
          <form
            onSubmit={handleQuickScan}
            className="relative flex items-center p-2 rounded-2xl glass-panel border border-slate-200 dark:border-slate-700/80 shadow-2xl focus-within:ring-2 focus-within:ring-blue-500/50 transition-all glow-blue"
          >
            <div className="pl-4 text-blue-600 dark:text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter website URL (e.g., vercel.com or github.com)"
              className="w-full px-4 py-4 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-xl shadow-blue-600/30 shrink-0 active:scale-95"
            >
              <span>{loading ? "Analyzing DOM..." : "Audit Website"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Presets */}
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 pt-1">
            <span className="font-medium">Try Preset:</span>
            {["vercel.com", "stripe.com", "linear.app", "github.com"].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setPresetUrl(preset)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/50 text-[11px] font-mono transition-colors shadow-sm"
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-center space-x-6 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center space-x-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span>Zero Install</span></span>
            <span className="flex items-center space-x-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span>Sub-Second Scan</span></span>
            <span className="flex items-center space-x-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /><span>Gemini AI Fixes</span></span>
          </div>
        </motion.div>

        {/* HERO MOCKUP DASHBOARD WINDOW PREVIEW */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 max-w-5xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/80 glass-panel shadow-2xl overflow-hidden p-1"
        >
          <div className="px-4 py-3 bg-slate-100 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">https://ai-website-auditor.saas/dashboard</span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE AUDIT ENGINE ACTIVE</span>
            </div>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Left Mock Gauge */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="58" stroke="currentColor" strokeWidth="10" className="text-slate-200 dark:text-slate-800" fill="transparent" />
                  <circle cx="72" cy="72" r="58" stroke="#22C55E" strokeWidth="10" strokeDasharray="364" strokeDashoffset="36" strokeLinecap="round" fill="transparent" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">92</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Overall Health</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 w-full flex justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">CMS: Next.js SSR</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Passed 28 Checks</span>
              </div>
            </div>

            {/* Middle Mock Scores Grid */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
                <span>Category Breakdown</span>
                <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">Exact Scoring Weights</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white block">SEO Optimization</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">25% Weight</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">95/100</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white block">Performance Vitals</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">25% Weight</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">90/100</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white block">WCAG Accessibility</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">15% Weight</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">88/100</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white block">Security Headers</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">15% Weight</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">100/100</span>
                </div>
              </div>

              {/* Gemini AI Fix Banner Mock */}
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-200 truncate">Gemini AI Fix: Add <code className="text-blue-600 dark:text-blue-300 font-mono">&lt;meta name="viewport"&gt;</code> to boost mobile score (+12 pts)</span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-blue-600 text-white shrink-0">Generate Fix</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* STATS STRIP */}
      <section className="py-12 border-y border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">7</span>
            <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
              Core Audit Dimensions
            </span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400">100%</span>
            <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
              Real Analysis Logic
            </span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">&lt; 1s</span>
            <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
              Audit Speed
            </span>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-amber-500">Gemini 2.5</span>
            <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
              AI Recommendation Engine
            </span>
          </div>
        </div>
      </section>

      {/* 7 DIMENSIONS FEATURE GRID SECTION */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-500">Comprehensive Inspection</h2>
          <p className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mt-2">
            7 Dimensions of Website Health
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-4 leading-relaxed">
            Every audit evaluates your web application against strict production criteria to deliver actionable code fixes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/50 glass-panel hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${f.color} border`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* AI BEFORE/AFTER CODE FIX DEMO SHOWCASE */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-3 border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Code Generation Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">Instant Copy-Paste Code Fixes</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">Google Gemini AI identifies exact bottlenecks and writes optimized HTML, CSS, and JS code snippets for your team.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Issue Found */}
          <div className="p-6 rounded-3xl border border-rose-500/30 bg-rose-500/5 glass-panel space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/20">
                Issue Identified
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Performance & SEO</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Missing Meta Description & Render-Blocking Script</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Target page lacks a concise <code className="text-rose-600 dark:text-rose-300 font-mono">&lt;meta name="description"&gt;</code> snippet and loads scripts synchronously, delaying First Contentful Paint by 450ms.
            </p>
          </div>

          {/* AI Solution Snippet */}
          <div className="p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 glass-panel space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>Gemini AI Generated Fix</span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">+18 Score Gain</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 overflow-x-auto leading-relaxed">
              <pre><code>{`<!-- Optimized Meta Tags -->
<meta name="description" content="AI Website Auditor evaluates SEO, Performance, Accessibility & Security." />

<!-- Deferred Script Loading -->
<script src="/app-bundle.js" defer></script>`}</code></pre>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-500">Transparent Pricing</h2>
          <p className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mt-2">Scale Your Web Auditing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter */}
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Starter</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For freelancers & developers</p>
              <div className="mt-6">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-white">$29</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs"> / month</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /><span>50 Scans / Month</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /><span>7-Dimension Audit Engine</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /><span>PDF & CSV Exports</span></li>
              </ul>
            </div>
            <Link href="/dashboard/scanner" className="mt-8 w-full py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs text-center block transition-colors">
              Start Free Trial
            </Link>
          </div>

          {/* Pro */}
          <div className="p-8 rounded-3xl border-2 border-blue-500 bg-white dark:bg-slate-900 relative flex flex-col justify-between shadow-2xl shadow-blue-500/20 scale-105 z-10">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-extrabold tracking-wider uppercase shadow-md">
              Most Popular
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pro SaaS</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">For growing marketing teams & agencies</p>
              <div className="mt-6">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-white">$79</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs"> / month</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /><span>Unlimited Website Scans</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /><span>Google Gemini AI Code Fixes</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /><span>Scan-Aware Interactive AI Chat</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /><span>Shareable Passwordless Links</span></li>
              </ul>
            </div>
            <Link href="/dashboard/scanner" className="mt-8 w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center block transition-all shadow-lg shadow-blue-600/30">
              Upgrade to Pro
            </Link>
          </div>

          {/* Enterprise */}
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enterprise</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Custom infrastructure & API access</p>
              <div className="mt-6">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-white">$199</span>
                <span className="text-slate-500 dark:text-slate-400 text-xs"> / month</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /><span>Custom API Access</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /><span>Dedicated Cloud Run Instance</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /><span>White-label PDF Branding</span></li>
              </ul>
            </div>
            <Link href="/dashboard/settings" className="mt-8 w-full py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs text-center block transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-500">FAQ</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">Frequently Asked Questions</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 glass-panel overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            <span className="text-slate-900 dark:text-slate-200 font-bold text-sm">AI Website Auditor</span>
          </div>
          <p>&copy; 2026 AI Website Auditor. Production-Quality SaaS Platform.</p>
        </div>
      </footer>
    </div>
  );
}
