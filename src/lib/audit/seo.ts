import { AuditIssue } from "@/types/audit";
import { ScrapeResult } from "./scraper";

export function analyzeSEO(data: ScrapeResult): { score: number; issues: AuditIssue[] } {
  const issues: AuditIssue[] = [];
  const { metadata } = data;
  let penalty = 0;

  // 1. Meta Title Check
  if (!metadata.title) {
    penalty += 20;
    issues.push({
      id: "seo-missing-title",
      category: "SEO",
      severity: "CRITICAL",
      title: "Missing Document <title> Tag",
      description: "The webpage does not contain a primary <title> tag.",
      whyItMatters: "Title tags are the single most important on-page SEO signal for search engine rankings and click-through rates.",
      element: "<head>",
      recommendation: "Add a descriptive <title> tag between 30 and 60 characters containing key target terms.",
      codeFix: `<title>AI Website Auditor | Automated SEO & Performance Analytics</title>`,
      codeFixLanguage: "html",
      seoImpact: 15,
      uxImpact: 8,
    });
  } else if (metadata.title.length < 30 || metadata.title.length > 60) {
    penalty += 8;
    issues.push({
      id: "seo-suboptimal-title-length",
      category: "SEO",
      severity: "MEDIUM",
      title: `Suboptimal Title Tag Length (${metadata.title.length} characters)`,
      description: `The current title "${metadata.title}" is ${metadata.title.length} characters long. Recommended length is 30-60 characters.`,
      whyItMatters: "Titles that are too short fail to convey topic depth; titles over 60 characters get truncated in Google search results.",
      element: `<title>${metadata.title}</title>`,
      recommendation: "Refactor the title tag to be between 30 and 60 characters.",
      codeFix: `<title>${metadata.title.slice(0, 55)} - Official Site</title>`,
      codeFixLanguage: "html",
      seoImpact: 6,
      uxImpact: 3,
    });
  }

  // 2. Meta Description Check
  if (!metadata.description) {
    penalty += 15;
    issues.push({
      id: "seo-missing-description",
      category: "SEO",
      severity: "HIGH",
      title: "Missing Meta Description Tag",
      description: "No <meta name=\"description\"> tag was found on the page.",
      whyItMatters: "Meta descriptions act as your search engine snippet pitch. Missing descriptions lead to lower Click-Through Rates (CTR).",
      element: "<head>",
      recommendation: "Provide a compelling meta description between 120 and 160 characters.",
      codeFix: `<meta name="description" content="Analyze, understand, and improve your website with AI-driven SEO, performance, security, and accessibility auditing." />`,
      codeFixLanguage: "html",
      seoImpact: 10,
      uxImpact: 5,
    });
  } else if (metadata.description.length < 70 || metadata.description.length > 160) {
    penalty += 6;
    issues.push({
      id: "seo-suboptimal-description-length",
      category: "SEO",
      severity: "LOW",
      title: `Meta Description Length Issue (${metadata.description.length} chars)`,
      description: `Meta description is ${metadata.description.length} characters long. Optimal range is 120-160 characters.`,
      whyItMatters: "Descriptions outside the 120-160 character range are prone to truncation or search engine replacement.",
      element: `<meta name="description" content="${metadata.description}" />`,
      recommendation: "Adjust the length of your meta description to fit 120-160 characters.",
      codeFix: `<meta name="description" content="${metadata.description.slice(0, 150)}..." />`,
      codeFixLanguage: "html",
      seoImpact: 4,
      uxImpact: 2,
    });
  }

  // 3. Canonical Tag Check
  if (!metadata.canonicalUrl) {
    penalty += 10;
    issues.push({
      id: "seo-missing-canonical",
      category: "SEO",
      severity: "MEDIUM",
      title: "Missing Canonical URL Tag",
      description: "No canonical link element (<link rel=\"canonical\">) is defined.",
      whyItMatters: "Canonical tags prevent duplicate content penalties by explicitly specifying the master URL to search engines.",
      element: "<head>",
      recommendation: "Add a canonical link tag matching your preferred URL structure.",
      codeFix: `<link rel="canonical" href="${data.normalizedUrl}" />`,
      codeFixLanguage: "html",
      seoImpact: 8,
      uxImpact: 0,
    });
  }

  // 4. Heading Hierarchy Check (H1 tag)
  if (metadata.h1Count === 0) {
    penalty += 15;
    issues.push({
      id: "seo-missing-h1",
      category: "SEO",
      severity: "HIGH",
      title: "Missing H1 Heading Tag",
      description: "The page does not contain any <h1> heading tag.",
      whyItMatters: "H1 headings communicate the main subject of the page to search crawlers and screen readers.",
      element: "<body>",
      recommendation: "Add exactly one prominent <h1> heading tag near the top of the body.",
      codeFix: `<h1 class="text-4xl font-bold">Main Keyword-Rich Page Heading</h1>`,
      codeFixLanguage: "html",
      seoImpact: 12,
      uxImpact: 7,
    });
  } else if (metadata.h1Count > 1) {
    penalty += 8;
    issues.push({
      id: "seo-multiple-h1",
      category: "SEO",
      severity: "MEDIUM",
      title: `Multiple H1 Headings Detected (${metadata.h1Count} tags)`,
      description: `The page contains ${metadata.h1Count} <h1> tags.`,
      whyItMatters: "Having multiple H1 elements dilutes topic authority and confuses crawl algorithms.",
      element: "<h1>",
      recommendation: "Keep only one primary <h1> and convert secondary headings to <h2> elements.",
      codeFix: `<!-- Keep primary H1 -->\n<h1>Primary Title</h1>\n<!-- Convert secondary to H2 -->\n<h2>Secondary Topic</h2>`,
      codeFixLanguage: "html",
      seoImpact: 6,
      uxImpact: 4,
    });
  }

  // 5. OpenGraph & Social Cards
  if (!metadata.ogTitle || !metadata.ogImage) {
    penalty += 8;
    issues.push({
      id: "seo-missing-og-tags",
      category: "SEO",
      severity: "MEDIUM",
      title: "Incomplete Open Graph Social Tags",
      description: "Missing og:title or og:image meta tags.",
      whyItMatters: "Open Graph metadata controls how your pages display when shared on LinkedIn, Facebook, Slack, and Discord.",
      element: "<head>",
      recommendation: "Define og:title, og:description, og:url, and og:image tags.",
      codeFix: `<meta property="og:title" content="${metadata.title || "AI Website Auditor"}" />\n<meta property="og:description" content="${metadata.description || "Analyze and improve websites with AI."}" />\n<meta property="og:image" content="${data.normalizedUrl}/og-image.jpg" />\n<meta property="og:type" content="website" />`,
      codeFixLanguage: "html",
      seoImpact: 5,
      uxImpact: 8,
    });
  }

  // 6. Schema JSON-LD Structured Data
  if (metadata.schemaTypes.length === 0) {
    penalty += 8;
    issues.push({
      id: "seo-missing-schema",
      category: "SEO",
      severity: "MEDIUM",
      title: "Missing Structured Data (Schema.org / JSON-LD)",
      description: "No JSON-LD structured data script was found.",
      whyItMatters: "Schema markup enables search engines to display rich snippets, star ratings, FAQs, and product details.",
      element: "<script type=\"application/ld+json\">",
      recommendation: "Add a JSON-LD schema snippet appropriate for your website (Organization, SoftwareApplication, WebSite).",
      codeFix: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "WebSite",\n  "name": "${metadata.title || "Website"}",\n  "url": "${data.normalizedUrl}"\n}\n</script>`,
      codeFixLanguage: "html",
      seoImpact: 8,
      uxImpact: 4,
    });
  }

  // 7. Missing Image Alt Text for SEO
  if (metadata.missingAltImagesCount > 0) {
    penalty += Math.min(12, metadata.missingAltImagesCount * 2);
    issues.push({
      id: "seo-missing-alt-text",
      category: "SEO",
      severity: metadata.missingAltImagesCount > 5 ? "HIGH" : "MEDIUM",
      title: `${metadata.missingAltImagesCount} Images Missing Descriptive Alt Attributes`,
      description: `Found ${metadata.missingAltImagesCount} <img> elements without alt attributes out of ${metadata.totalImages} total images.`,
      whyItMatters: "Alt text aids Google Image Search indexing and provides screen reader accessibility.",
      element: "<img>",
      recommendation: "Add meaningful alt descriptive text to every non-decorative image.",
      codeFix: `<img src="/hero-banner.webp" alt="Dashboard preview showing website SEO and performance analytics score dial" width="800" height="450" />`,
      codeFixLanguage: "html",
      seoImpact: 7,
      uxImpact: 9,
    });
  }

  const score = Math.max(0, Math.min(100, 100 - penalty));
  return { score, issues };
}
