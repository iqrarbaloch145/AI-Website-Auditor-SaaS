import { AuditIssue } from "@/types/audit";
import { ScrapeResult } from "./scraper";

export function analyzeUIUX(data: ScrapeResult): { uiScore: number; issues: AuditIssue[] } {
  const issues: AuditIssue[] = [];
  const { $ } = data;
  let penalty = 0;

  // 1. Navigation Element (<nav>)
  const navCount = $("nav, [role='navigation']").length;
  if (navCount === 0) {
    penalty += 20;
    issues.push({
      id: "ui-missing-nav",
      category: "UI_UX",
      severity: "HIGH",
      title: "Missing Semantic Navigation Container (<nav>)",
      description: "The header or page layout lacks a semantic <nav> or role=\"navigation\" block.",
      whyItMatters: "Standardized navigation bar placement is critical for user orientation and page usability.",
      element: "<header>",
      recommendation: "Wrap site navigation links inside a semantic <nav> tag.",
      codeFix: `<nav class="flex items-center justify-between px-6 py-4 border-b">\n  <a href="/" class="font-bold text-xl">Logo</a>\n  <div class="flex space-x-6">\n    <a href="#features">Features</a>\n    <a href="#pricing">Pricing</a>\n  </div>\n</nav>`,
      codeFixLanguage: "html",
      seoImpact: 4,
      uxImpact: 16,
    });
  }

  // 2. Interactive Button Styling & Spacing
  const buttonsWithoutClass = $("button:not([class])").length;
  if (buttonsWithoutClass > 0) {
    penalty += 12;
    issues.push({
      id: "ui-unstyled-buttons",
      category: "UI_UX",
      severity: "MEDIUM",
      title: `${buttonsWithoutClass} Unstyled Native <button> Elements`,
      description: `Found ${buttonsWithoutClass} button elements with default browser user-agent styling.`,
      whyItMatters: "Unstyled buttons break design consistency and lower perceived brand trustworthiness.",
      element: "<button>",
      recommendation: "Apply custom modern button styles with hover, active, and focus state transitions.",
      codeFix: `<button class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium rounded-xl transition-all shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">\n  Submit Action\n</button>`,
      codeFixLanguage: "html",
      seoImpact: 1,
      uxImpact: 12,
    });
  }

  // 3. Footer Links Presence
  const hasFooter = $("footer, [role='contentinfo']").length > 0;
  if (!hasFooter) {
    penalty += 15;
    issues.push({
      id: "ui-missing-footer",
      category: "UI_UX",
      severity: "MEDIUM",
      title: "Missing Footer Container (<footer>)",
      description: "No site-wide <footer> element was located.",
      whyItMatters: "Footers house essential utility links (Terms, Privacy, Contact, Socials) that users expect at the end of every page.",
      element: "<body>",
      recommendation: "Add a structured footer at the end of the main page markup.",
      codeFix: `<footer class="py-12 border-t text-sm text-gray-500 flex justify-between px-8">\n  <p>&copy; 2026 Company Inc. All rights reserved.</p>\n  <div class="flex space-x-4">\n    <a href="/privacy">Privacy</a>\n    <a href="/terms">Terms</a>\n  </div>\n</footer>`,
      codeFixLanguage: "html",
      seoImpact: 3,
      uxImpact: 10,
    });
  }

  const uiScore = Math.max(0, Math.min(100, 100 - penalty));
  return { uiScore, issues };
}
