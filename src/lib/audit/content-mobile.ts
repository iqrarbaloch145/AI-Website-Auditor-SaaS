import { AuditIssue } from "@/types/audit";
import { ScrapeResult } from "./scraper";

export function analyzeMobileAndContent(data: ScrapeResult): {
  mobileScore: number;
  contentScore: number;
  issues: AuditIssue[];
} {
  const issues: AuditIssue[] = [];
  const { metadata, $ } = data;

  let mobilePenalty = 0;
  let contentPenalty = 0;

  // --- MOBILE AUDIT ---

  // 1. Viewport Meta Tag
  if (!metadata.viewportMeta) {
    mobilePenalty += 40;
    issues.push({
      id: "mobile-missing-viewport",
      category: "MOBILE",
      severity: "CRITICAL",
      title: "Missing Viewport Meta Tag",
      description: "No <meta name=\"viewport\"> tag was discovered in the head section.",
      whyItMatters: "Mobile browsers render non-viewport pages at desktop width (980px), forcing users to pinch and zoom.",
      element: "<head>",
      recommendation: "Add a viewport meta tag with width=device-width and initial-scale=1.0.",
      codeFix: `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
      codeFixLanguage: "html",
      seoImpact: 12,
      uxImpact: 25,
    });
  }

  // 2. Responsive Image Dimension Attributes
  if (metadata.responsiveImageRatio < 70) {
    mobilePenalty += 15;
    issues.push({
      id: "mobile-unoptimized-images",
      category: "MOBILE",
      severity: "MEDIUM",
      title: "Unresponsive Image Formats & Dimensions",
      description: "Over 30% of images lack modern srcset attributes or flexible CSS containers.",
      whyItMatters: "Serving desktop-sized high-resolution images to mobile screens consumes mobile data and causes Cumulative Layout Shift (CLS).",
      element: "<img>",
      recommendation: "Use picture element or srcset attributes for dynamic multi-resolution serving.",
      codeFix: `<img srcset="/img-400.jpg 400w, /img-800.jpg 800w" sizes="(max-width: 600px) 400px, 800px" src="/img-800.jpg" alt="Responsive graphic" />`,
      codeFixLanguage: "html",
      seoImpact: 6,
      uxImpact: 12,
    });
  }

  // --- CONTENT AUDIT ---

  // 1. Low Word Count
  if (metadata.wordCount < 300) {
    contentPenalty += 25;
    issues.push({
      id: "content-thin-content",
      category: "CONTENT",
      severity: "HIGH",
      title: `Thin Page Content (${metadata.wordCount} words)`,
      description: `The page contains only ${metadata.wordCount} words of main body copy. Recommended minimum is 500+ words.`,
      whyItMatters: "Search engines penalize thin content pages that provide minimal contextual value to search queries.",
      element: "<body>",
      recommendation: "Expand the page copy with structured sections, feature highlights, and FAQs.",
      codeFix: `<!-- Add value-adding content section -->\n<section className="py-12">\n  <h2>Key Benefits & Features</h2>\n  <p>Detailed explanation of your product solution...</p>\n</section>`,
      codeFixLanguage: "html",
      seoImpact: 15,
      uxImpact: 8,
    });
  }

  // 2. Readability Score Check
  if (metadata.readabilityScore < 60) {
    contentPenalty += 15;
    issues.push({
      id: "content-poor-readability",
      category: "CONTENT",
      severity: "MEDIUM",
      title: "Complex Readability & Long Sentences",
      description: "Paragraphs have high word counts per sentence, making content difficult to digest.",
      whyItMatters: "Web visitors scan content quickly. Complex sentences increase bounce rate.",
      element: "<p>",
      recommendation: "Break long paragraphs into bullet points, active voice sentences, and subheadings.",
      codeFix: `<!-- Use bullet lists for scanability -->\n<ul class="space-y-2 list-disc pl-5">\n  <li>Clear point 1</li>\n  <li>Actionable point 2</li>\n</ul>`,
      codeFixLanguage: "html",
      seoImpact: 4,
      uxImpact: 12,
    });
  }

  // 3. Keyword Stuffing Check
  const stuffedKeywords = metadata.keywordDensity.filter((kw) => kw.percentage > 4.5);
  if (stuffedKeywords.length > 0) {
    contentPenalty += 20;
    issues.push({
      id: "content-keyword-stuffing",
      category: "CONTENT",
      severity: "HIGH",
      title: `Potential Keyword Stuffing Detected ("${stuffedKeywords[0].word}" at ${stuffedKeywords[0].percentage}%)`,
      description: `The word "${stuffedKeywords[0].word}" accounts for ${stuffedKeywords[0].percentage}% of total page text.`,
      whyItMatters: "Excessive keyword density triggers spam filters and search engine algorithmic demotions.",
      element: "Body Text",
      recommendation: "Replace repetitive keywords with natural synonyms and contextual phrases.",
      codeFix: `// Vary phrasing using Latent Semantic Indexing (LSI) terms`,
      codeFixLanguage: "plaintext",
      seoImpact: 12,
      uxImpact: 10,
    });
  }

  // 4. Call To Action (CTA) Quality
  const hasCTA = $("a, button").text().toLowerCase().match(/sign up|get started|try free|buy now|contact us|book demo|schedule/);
  if (!hasCTA) {
    contentPenalty += 12;
    issues.push({
      id: "content-missing-cta",
      category: "CONTENT",
      severity: "MEDIUM",
      title: "Missing Clear Call-To-Action (CTA) Element",
      description: "No explicit call-to-action button or link (e.g., 'Get Started', 'Sign Up') was detected above or below the fold.",
      whyItMatters: "Without a clear next step, page visitors exit without converting.",
      element: "Hero / Footer",
      recommendation: "Add a high-contrast primary CTA button with clear action copy.",
      codeFix: `<a href="/signup" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg">\n  Get Started Free &rarr;\n</a>`,
      codeFixLanguage: "html",
      seoImpact: 2,
      uxImpact: 16,
    });
  }

  const mobileScore = Math.max(0, Math.min(100, 100 - mobilePenalty));
  const contentScore = Math.max(0, Math.min(100, 100 - contentPenalty));

  return { mobileScore, contentScore, issues };
}
