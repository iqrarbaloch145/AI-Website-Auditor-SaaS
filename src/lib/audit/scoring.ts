import { FullAuditResult } from "@/types/audit";
import { ScrapeResult } from "./scraper";
import { analyzeSEO } from "./seo";
import { analyzePerformance } from "./performance";
import { analyzeAccessibility } from "./accessibility";
import { analyzeSecurity } from "./security";
import { analyzeMobileAndContent } from "./content-mobile";
import { analyzeUIUX } from "./ui-cms";

export function runFullAudit(scraped: ScrapeResult): FullAuditResult {
  const startTime = Date.now();

  const seo = analyzeSEO(scraped);
  const perf = analyzePerformance(scraped);
  const a11y = analyzeAccessibility(scraped);
  const sec = analyzeSecurity(scraped);
  const mobileContent = analyzeMobileAndContent(scraped);
  const ui = analyzeUIUX(scraped);

  // Exact scoring weight specified in requirements:
  // SEO 25% | Performance 25% | Accessibility 15% | Security 15% | Mobile 10% | Content 10%
  const overallScore = Math.round(
    seo.score * 0.25 +
      perf.score * 0.25 +
      a11y.score * 0.15 +
      sec.score * 0.15 +
      mobileContent.mobileScore * 0.10 +
      mobileContent.contentScore * 0.10
  );

  const allIssues = [
    ...seo.issues,
    ...perf.issues,
    ...a11y.issues,
    ...sec.issues,
    ...mobileContent.issues,
    ...ui.issues,
  ];

  // Sort issues by severity
  const severityOrder: Record<string, number> = {
    CRITICAL: 1,
    HIGH: 2,
    MEDIUM: 3,
    LOW: 4,
    INFO: 5,
  };

  allIssues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const auditDurationMs = scraped.ttfbMs + (Date.now() - startTime);

  return {
    url: scraped.normalizedUrl,
    title: scraped.metadata.title || scraped.normalizedUrl,
    cmsDetected: scraped.cmsDetected,
    frameworkDetected: scraped.frameworkDetected,
    techStack: scraped.techStack,
    durationMs: auditDurationMs,
    overallScore,
    scores: {
      seo: seo.score,
      performance: perf.score,
      accessibility: a11y.score,
      security: sec.score,
      mobile: mobileContent.mobileScore,
      content: mobileContent.contentScore,
      ui: ui.uiScore,
    },
    metadata: scraped.metadata,
    issues: allIssues,
    createdAt: new Date().toISOString(),
  };
}
