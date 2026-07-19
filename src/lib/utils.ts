import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScoreColor(score: number): string {
  if (score >= 90) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  if (score >= 70) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
  return "text-rose-500 bg-rose-500/10 border-rose-500/20";
}

export function getScoreBadgeVariant(score: number): "success" | "warning" | "destructive" {
  if (score >= 90) return "success";
  if (score >= 70) return "warning";
  return "destructive";
}
