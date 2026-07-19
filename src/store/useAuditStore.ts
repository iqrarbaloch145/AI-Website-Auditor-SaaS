import { create } from "zustand";
import { FullAuditResult, AuditIssue } from "@/types/audit";

interface AuditStore {
  activeScan: FullAuditResult | null;
  scanHistory: FullAuditResult[];
  isScanning: boolean;
  scanProgress: number; // 0 to 100
  selectedCategory: string;
  selectedIssueForFix: AuditIssue | null;
  isFixModalOpen: boolean;
  isChatOpen: boolean;
  theme: "dark" | "light";

  setActiveScan: (scan: FullAuditResult | null) => void;
  setScanHistory: (history: FullAuditResult[]) => void;
  setIsScanning: (scanning: boolean) => void;
  setScanProgress: (progress: number) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedIssueForFix: (issue: AuditIssue | null) => void;
  setIsFixModalOpen: (open: boolean) => void;
  setIsChatOpen: (open: boolean) => void;
  toggleTheme: () => void;
}

export const useAuditStore = create<AuditStore>((set) => ({
  activeScan: null,
  scanHistory: [],
  isScanning: false,
  scanProgress: 0,
  selectedCategory: "ALL",
  selectedIssueForFix: null,
  isFixModalOpen: false,
  isChatOpen: false,
  theme: "dark",

  setActiveScan: (scan) => set({ activeScan: scan }),
  setScanHistory: (history) => set({ scanHistory: history }),
  setIsScanning: (scanning) => set({ isScanning: scanning }),
  setScanProgress: (progress) => set({ scanProgress: progress }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedIssueForFix: (issue) => set({ selectedIssueForFix: issue, isFixModalOpen: !!issue }),
  setIsFixModalOpen: (open) => set({ isFixModalOpen: open }),
  setIsChatOpen: (open) => set({ isChatOpen: open }),
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === "dark" ? "light" : "dark";
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", nextTheme === "dark");
      }
      return { theme: nextTheme };
    }),
}));
