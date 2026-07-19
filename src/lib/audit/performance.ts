import { AuditIssue } from "@/types/audit";
import { ScrapeResult } from "./scraper";

export function analyzePerformance(data: ScrapeResult): { score: number; issues: AuditIssue[] } {
  const issues: AuditIssue[] = [];
  const { metadata, headers } = data;
  let penalty = 0;

  // 1. TTFB (Time to First Byte)
  if (metadata.ttfbMs > 800) {
    penalty += 20;
    issues.push({
      id: "perf-slow-ttfb",
      category: "PERFORMANCE",
      severity: "CRITICAL",
      title: `High Server Response Time (TTFB: ${metadata.ttfbMs}ms)`,
      description: `The server took ${metadata.ttfbMs}ms to respond with initial HTML headers. Recommended target is under 400ms.`,
      whyItMatters: "High TTFB delays every subsequent asset download and hurts search rankings & user retention.",
      element: "Server / Network",
      recommendation: "Implement Edge CDN caching (Vercel/Cloudflare), optimize DB database queries, or enable HTTP response caching.",
      codeFix: `// Next.js Route Cache Example\nexport const revalidate = 3600; // Cache page for 1 hour at edge`,
      codeFixLanguage: "javascript",
      seoImpact: 12,
      uxImpact: 18,
    });
  } else if (metadata.ttfbMs > 400) {
    penalty += 8;
    issues.push({
      id: "perf-moderate-ttfb",
      category: "PERFORMANCE",
      severity: "MEDIUM",
      title: `Moderate Server Response Time (TTFB: ${metadata.ttfbMs}ms)`,
      description: `Server response time is ${metadata.ttfbMs}ms. Recommended goal is under 300ms.`,
      whyItMatters: "Slower server responses delay First Contentful Paint.",
      element: "Server",
      recommendation: "Enable edge caching and compress server responses.",
      codeFix: `// Add Cache-Control Header\nres.setHeader('Cache-Control', 'public, s-maxage=31536000, stale-while-revalidate=59');`,
      codeFixLanguage: "javascript",
      seoImpact: 5,
      uxImpact: 8,
    });
  }

  // 2. Render Blocking Scripts (Async/Defer)
  const renderBlockingScripts = metadata.totalScripts - metadata.asyncDeferScriptsCount;
  if (renderBlockingScripts > 2) {
    penalty += 15;
    issues.push({
      id: "perf-render-blocking-js",
      category: "PERFORMANCE",
      severity: "HIGH",
      title: `${renderBlockingScripts} Render-Blocking JavaScript Files`,
      description: `Found ${renderBlockingScripts} script tags in the DOM without 'defer' or 'async' attributes.`,
      whyItMatters: "Synchronous script loading halts HTML parsing and browser rendering, delaying First Contentful Paint (FCP).",
      element: "<script src=\"...\">",
      recommendation: "Add 'defer' or 'async' to non-critical script tags, or move them to the end of <body>.",
      codeFix: `<script src="/app-analytics.js" defer></script>\n<!-- OR for Next.js Script -->\n<Script src="/app-analytics.js" strategy="lazyOnload" />`,
      codeFixLanguage: "html",
      seoImpact: 8,
      uxImpact: 15,
    });
  }

  // 3. HTML Payload Size
  if (metadata.htmlSizeKb > 150) {
    penalty += 12;
    issues.push({
      id: "perf-large-html-size",
      category: "PERFORMANCE",
      severity: "MEDIUM",
      title: `Large HTML Document Size (${metadata.htmlSizeKb} KB)`,
      description: `The raw HTML payload is ${metadata.htmlSizeKb} KB. Keep raw HTML under 100 KB for fast parsing.`,
      whyItMatters: "Excessive DOM size causes memory bloat and slows down layout rendering on mobile devices.",
      element: "<html>",
      recommendation: "Minify HTML output, paginate long lists, and remove inline data-uris or large inline scripts.",
      codeFix: `// Compression middleware in Next.js/Express\nimport compression from 'compression';\napp.use(compression());`,
      codeFixLanguage: "javascript",
      seoImpact: 4,
      uxImpact: 10,
    });
  }

  // 4. Compression Header Check (Gzip/Brotli)
  const contentEncoding = headers["content-encoding"] || "";
  if (!contentEncoding.includes("gzip") && !contentEncoding.includes("br")) {
    penalty += 14;
    issues.push({
      id: "perf-missing-compression",
      category: "PERFORMANCE",
      severity: "HIGH",
      title: "Gzip / Brotli Compression Not Enabled",
      description: "The web server response does not specify Content-Encoding: gzip or br.",
      whyItMatters: "Text compression reduces HTML, CSS, and JS transfer sizes by 60%-80%.",
      element: "HTTP Response Header",
      recommendation: "Enable Brotli or Gzip compression on your reverse proxy or web host.",
      codeFix: `# Nginx Gzip Config\ngzip on;\ngzip_types text/plain text/css application/json application/javascript text/xml;`,
      codeFixLanguage: "plaintext",
      seoImpact: 7,
      uxImpact: 14,
    });
  }

  // 5. Caching Headers Check
  const cacheControl = headers["cache-control"] || "";
  if (!cacheControl || cacheControl.includes("no-cache") || cacheControl.includes("max-age=0")) {
    penalty += 10;
    issues.push({
      id: "perf-missing-cache-control",
      category: "PERFORMANCE",
      severity: "MEDIUM",
      title: "Suboptimal or Missing Cache-Control Policy",
      description: `Current Cache-Control header: "${cacheControl || "None"}".`,
      whyItMatters: "Browser caching enables returning visitors to load the website instantly without re-downloading unchanged static assets.",
      element: "HTTP Response Header",
      recommendation: "Set long cache durations (e.g. max-age=31536000, immutable) for static JS/CSS/image assets.",
      codeFix: `Cache-Control: public, max-age=31536000, immutable`,
      codeFixLanguage: "plaintext",
      seoImpact: 3,
      uxImpact: 11,
    });
  }

  // 6. Core Web Vitals LCP & CLS Estimation
  if (metadata.estimatedLcpMs > 2500) {
    penalty += 15;
    issues.push({
      id: "perf-high-lcp",
      category: "PERFORMANCE",
      severity: "HIGH",
      title: `Estimated LCP Exceeds 2.5s Target (${(metadata.estimatedLcpMs / 1000).toFixed(1)}s)`,
      description: "Largest Contentful Paint measures when the main page content has likely loaded.",
      whyItMatters: "Google uses LCP as a Core Web Vitals ranking factor. LCP under 2.5s is required for optimal user UX.",
      element: "Hero Image / Main Heading",
      recommendation: "Preload the hero image, use WebP/AVIF formats, and eliminate render-blocking stylesheets.",
      codeFix: `<link rel="preload" as="image" href="/hero-image.webp" type="image/webp" />`,
      codeFixLanguage: "html",
      seoImpact: 14,
      uxImpact: 16,
    });
  }

  const score = Math.max(0, Math.min(100, 100 - penalty));
  return { score, issues };
}
