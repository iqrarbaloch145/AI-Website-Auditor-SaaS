"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuditStore } from "@/store/useAuditStore";
import { Bot, Send, X, Sparkles, Loader2, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

export const AIChatDrawer: React.FC = () => {
  const { isChatOpen, setIsChatOpen, activeScan } = useAuditStore();
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: activeScan
        ? `Hello! I am your AI Auditor assistant for **${activeScan.url}** (Score: **${activeScan.overallScore}/100**). Ask me any question about improving your SEO, Core Web Vitals, Security headers, or code fixes!`
        : "Hello! I am your AI Auditor assistant. Run a site scan to start asking contextual questions!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const message = textToSend || input;
    if (!message.trim() || loading) return;

    const newMsgs: ChatMsg[] = [...messages, { role: "user", content: message }];
    setMessages(newMsgs);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          scanContext: activeScan,
          chatHistory: newMsgs.slice(-6),
        }),
      });

      const data = await res.json();

      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I ran into an error processing your query. Please try again.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error occurred while connecting to Gemini AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isChatOpen) return null;

  const quickPrompts = [
    "How do I fix my Largest Contentful Paint (LCP)?",
    "Generate optimal Meta Description & Title tags",
    "How to set up Strict-Transport-Security HSTS?",
    "Explain all critical security vulnerabilities",
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Gemini AI Scan Assistant</h3>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Contextual Site Advisor</p>
            </div>
          </div>
          <button
            onClick={() => setIsChatOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick prompt chips */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 overflow-x-auto flex space-x-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 shrink-0 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start space-x-2.5 ${
                msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <div
                className={`p-1.5 rounded-lg text-white shrink-0 ${
                  msg.role === "user" ? "bg-blue-600" : "bg-slate-800"
                }`}
              >
                {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <div
                className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span>Analyzing scan data & generating code fixes...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer input */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI how to fix an issue or write code..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md shadow-blue-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </AnimatePresence>
  );
};
