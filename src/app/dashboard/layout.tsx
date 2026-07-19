"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuditStore } from "@/store/useAuditStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = useAuditStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 p-6 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Authentication required. Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto max-w-7xl">{children}</div>
    </div>
  );
}
