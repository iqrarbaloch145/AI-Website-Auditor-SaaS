"use client";

import React, { useState } from "react";
import { useAuditStore } from "@/store/useAuditStore";
import { Download, FileSpreadsheet, FileJson, Share2, Copy, Check, Sparkles } from "lucide-react";
import { jsPDF } from "jspdf";

export default function ReportsPage() {
  const { activeScan } = useAuditStore();
  const [copiedLink, setCopiedLink] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  if (!activeScan) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-sm text-slate-400">No active audit scan found. Run a scan to export reports.</p>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    setGeneratingPdf(true);
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("AI Website Auditor - Executive Report", 14, 22);

      doc.setFontSize(11);
      doc.text(`Website URL: ${activeScan.url}`, 14, 32);
      doc.text(`Overall Score: ${activeScan.overallScore}/100`, 14, 40);
      doc.text(`SEO Score: ${activeScan.scores.seo}/100`, 14, 48);
      doc.text(`Performance Score: ${activeScan.scores.performance}/100`, 14, 56);
      doc.text(`Accessibility Score: ${activeScan.scores.accessibility}/100`, 14, 64);
      doc.text(`Security Score: ${activeScan.scores.security}/100`, 14, 72);
      doc.text(`CMS / Tech: ${activeScan.cmsDetected} (${activeScan.frameworkDetected})`, 14, 80);

      doc.setFontSize(14);
      doc.text("Priority Audit Issues Found:", 14, 96);

      let yPos = 106;
      activeScan.issues.slice(0, 10).forEach((issue, idx) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(10);
        doc.text(`${idx + 1}. [${issue.severity}] ${issue.title}`, 14, yPos);
        yPos += 6;
        doc.setFontSize(9);
        doc.text(`   Fix: ${issue.recommendation.slice(0, 80)}`, 14, yPos);
        yPos += 8;
      });

      doc.save(`audit-report-${Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleDownloadCSV = () => {
    window.open(`/api/report?scanId=${activeScan.id}&format=csv`, "_blank");
  };

  const handleDownloadJSON = () => {
    window.open(`/api/report?scanId=${activeScan.id}&format=json`, "_blank");
  };

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reports/share/${activeScan.id}`;

  const handleCopyShare = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
          <Download className="w-6 h-6 text-blue-500" />
          <span>Export Reports & Share</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Export full audit findings for {activeScan.url} in PDF, CSV, or JSON formats
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PDF Export Card */}
        <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 glass-panel flex flex-col justify-between">
          <div>
            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 w-fit mb-4">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Executive PDF Report</h3>
            <p className="text-xs text-slate-400 mt-1">
              Formatted PDF report containing overall score dial, category breakdown, and code fix action items.
            </p>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={generatingPdf}
            className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
          >
            {generatingPdf ? "Generating PDF..." : "Download PDF Report"}
          </button>
        </div>

        {/* CSV Export Card */}
        <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 glass-panel flex flex-col justify-between">
          <div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 w-fit mb-4">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Raw CSV Dataset</h3>
            <p className="text-xs text-slate-400 mt-1">
              Export all issue line items, selectors, recommendations, and impact scores into Excel/Spreadsheets.
            </p>
          </div>
          <button
            onClick={handleDownloadCSV}
            className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
          >
            Download CSV Data
          </button>
        </div>

        {/* JSON Export Card */}
        <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 glass-panel flex flex-col justify-between">
          <div>
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 w-fit mb-4">
              <FileJson className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Structured JSON Payload</h3>
            <p className="text-xs text-slate-400 mt-1">
              Complete raw JSON output with extracted DOM metadata, security headers, and Core Web Vitals.
            </p>
          </div>
          <button
            onClick={handleDownloadJSON}
            className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
          >
            Download JSON Payload
          </button>
        </div>
      </div>

      {/* Shareable Link Box */}
      <div className="p-6 rounded-3xl border border-blue-500/30 bg-blue-500/10 glass-panel">
        <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm mb-1">
          <Share2 className="w-4 h-4" />
          <span>Shareable Passwordless Client Audit Link</span>
        </div>
        <p className="text-xs text-slate-300">
          Share this active audit report link with clients or team members.
        </p>

        <div className="mt-4 flex items-center space-x-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs font-mono text-slate-300 focus:outline-none"
          />
          <button
            onClick={handleCopyShare}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-blue-600/20"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
