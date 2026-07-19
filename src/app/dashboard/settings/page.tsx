"use client";

import React, { useState } from "react";
import { Settings, Key, User, ShieldCheck, Check, Save } from "lucide-react";

export default function SettingsPage() {
  const [geminiKey, setGeminiKey] = useState(process.env.GEMINI_API_KEY || "");
  const [userName, setUserName] = useState("Pro Subscriber");
  const [email, setEmail] = useState("admin@website-auditor.ai");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
          <Settings className="w-6 h-6 text-blue-500" />
          <span>Account & API Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Configure profile details and Google Gemini API credentials</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 glass-panel space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold text-sm">
            <User className="w-4 h-4 text-blue-500" />
            <span>User Profile</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* API Credentials */}
        <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 glass-panel space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold text-sm">
            <Key className="w-4 h-4 text-amber-500" />
            <span>Google Gemini AI API Key</span>
          </div>
          <p className="text-xs text-slate-400">
            Provide your Google Gemini API Key to enable automated code fix generation and scan-aware AI chat.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">API Key</label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-xs font-mono text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-blue-600/30"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Settings Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
