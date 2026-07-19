import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FullAuditResult, AuditIssue } from "@/types/audit";

export interface UserSession {
  name: string;
  email: string;
}

interface AuditStore {
  user: UserSession | null;
  isLoggedIn: boolean;
  activeScan: FullAuditResult | null;
  scanHistory: FullAuditResult[];
  isScanning: boolean;
  scanProgress: number; // 0 to 100
  selectedCategory: string;
  selectedIssueForFix: AuditIssue | null;
  isFixModalOpen: boolean;
  isChatOpen: boolean;
  theme: "dark" | "light";

  setUser: (user: UserSession | null) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  setActiveScan: (scan: FullAuditResult | null) => void;
  setScanHistory: (history: FullAuditResult[]) => void;
  addScanToHistory: (scan: FullAuditResult) => void;
  deleteActiveScan: () => void;
  deleteScanFromHistory: (scanId: string) => void;
  setIsScanning: (scanning: boolean) => void;
  setScanProgress: (progress: number) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedIssueForFix: (issue: AuditIssue | null) => void;
  setIsFixModalOpen: (open: boolean) => void;
  setIsChatOpen: (open: boolean) => void;
  toggleTheme: () => void;
  logout: () => void;
}

export const useAuditStore = create<AuditStore>()(
  persist(
    (set) => ({
      user: { name: "Pro Developer", email: "user@websiteauditor.ai" },
      isLoggedIn: true,
      activeScan: null,
      scanHistory: [],
      isScanning: false,
      scanProgress: 0,
      selectedCategory: "ALL",
      selectedIssueForFix: null,
      isFixModalOpen: false,
      isChatOpen: false,
      theme: "dark",

      setUser: (user) => set({ user }),
      setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
      setActiveScan: (scan) => set({ activeScan: scan }),
      setScanHistory: (history) => set({ scanHistory: history }),

      addScanToHistory: (scan) =>
        set((state) => {
          const exists = state.scanHistory.some((item) => item.id === scan.id || item.url === scan.url);
          const nextHistory = exists
            ? state.scanHistory.map((item) => (item.url === scan.url ? scan : item))
            : [scan, ...state.scanHistory];
          return {
            activeScan: scan,
            scanHistory: nextHistory,
          };
        }),

      deleteActiveScan: () =>
        set((state) => {
          const remainingHistory = state.scanHistory.filter(
            (item) => item.id !== state.activeScan?.id && item.url !== state.activeScan?.url
          );
          return {
            activeScan: remainingHistory.length > 0 ? remainingHistory[0] : null,
            scanHistory: remainingHistory,
          };
        }),

      deleteScanFromHistory: (scanId) =>
        set((state) => {
          const remainingHistory = state.scanHistory.filter((item) => item.id !== scanId);
          const nextActive = state.activeScan?.id === scanId
            ? remainingHistory.length > 0
              ? remainingHistory[0]
              : null
            : state.activeScan;

          return {
            activeScan: nextActive,
            scanHistory: remainingHistory,
          };
        }),

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

      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
        }),
    }),
    {
      name: "ai_website_auditor_storage",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : ({} as any))),
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        activeScan: state.activeScan,
        scanHistory: state.scanHistory,
        theme: state.theme,
      }),
    }
  )
);
