"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Mail, Lock, User, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuditStore } from "@/store/useAuditStore";

function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIsLoggedIn, setUser } = useAuditStore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("example.supabase.co")
      ) {
        const supabase = createClient();
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        });
      }
    } catch (err) {
      console.warn("Supabase auth fallback active:", (err as Error).message);
    } finally {
      setUser({ name: name || email.split("@")[0] || "New User", email });
      setIsLoggedIn(true);
      setLoading(false);

      const redirectUrl = searchParams.get("url");
      if (redirectUrl) {
        router.push(`/dashboard/scanner?url=${encodeURIComponent(redirectUrl)}`);
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white transition-colors duration-200">
      <div className="w-full max-w-md p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 glass-panel shadow-2xl">
        <div className="text-center">
          <div className="inline-flex p-3 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-500 border border-blue-500/20 mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Register to start auditing your websites with Gemini AI</p>
        </div>

        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2"
          >
            <span>{loading ? "Creating Account..." : "Create Account & Start Audit"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Already registered?{" "}
          <Link href="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading signup...</div>}>
      <SignupForm />
    </Suspense>
  );
}
