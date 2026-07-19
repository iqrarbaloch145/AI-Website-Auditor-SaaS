import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto max-w-7xl">{children}</div>
    </div>
  );
}
