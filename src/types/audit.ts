export type IssueCategory =
  | "SEO"
  | "PERFORMANCE"
  | "ACCESSIBILITY"
  | "SECURITY"
  | "MOBILE"
  | "CONTENT"
  | "UI_UX";

export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";

export interface AuditIssue {
  id: string;
  category: IssueCategory;
  severity: Severity;
  title: string;
  description: string;
  whyItMatters: string;
  element?: string;
  recommendation: string;
  codeFix?: string;
  codeFixLanguage?: "html" | "css" | "javascript" | "json" | "plaintext";
  seoImpact: number; // Potential score boost (+1 to +20)
  uxImpact: number;  // Potential score boost (+1 to +20)
}

export interface ExtractedMetadata {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  robots?: string;
  hasSitemap?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  schemaTypes: string[];
  h1Count: number;
  h2Count: number;
  h3Count: number;
  headingsList: { level: string; text: string }[];
  totalImages: number;
  missingAltImagesCount: number;
  totalLinks: number;
  brokenLinksCount: number;
  internalLinksCount: number;
  externalLinksCount: number;
  totalScripts: number;
  asyncDeferScriptsCount: number;
  totalStylesheets: number;
  isHttps: boolean;
  securityHeaders: {
    contentSecurityPolicy: boolean;
    strictTransportSecurity: boolean;
    xFrameOptions: boolean;
    xContentTypeOptions: boolean;
    referrerPolicy: boolean;
  };
  mixedContentCount: number;
  cookieFlagsSecure: boolean;
  readabilityScore: number;
  wordCount: number;
  keywordDensity: { word: string; count: number; percentage: number }[];
  viewportMeta: boolean;
  responsiveImageRatio: number;
  ttfbMs: number;
  htmlSizeKb: number;
  totalAssetsSizeKb: number;
  estimatedFcpMs: number;
  estimatedLcpMs: number;
  estimatedCls: number;
  estimatedTbtMs: number;
  contrastIssuesCount: number;
  missingFormLabelsCount: number;
  ariaErrorsCount: number;
}

export interface FullAuditResult {
  id?: string;
  url: string;
  title: string;
  cmsDetected: string;
  frameworkDetected: string;
  techStack: string[];
  durationMs: number;
  overallScore: number;
  scores: {
    seo: number;
    performance: number;
    accessibility: number;
    security: number;
    mobile: number;
    content: number;
    ui: number;
  };
  metadata: ExtractedMetadata;
  issues: AuditIssue[];
  aiSummary?: string;
  createdAt: string;
}
