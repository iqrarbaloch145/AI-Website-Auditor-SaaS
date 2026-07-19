import { AuditIssue } from "@/types/audit";
import { ScrapeResult } from "./scraper";

export function analyzeSecurity(data: ScrapeResult): { score: number; issues: AuditIssue[] } {
  const issues: AuditIssue[] = [];
  const { metadata } = data;
  let penalty = 0;

  // 1. HTTPS Protocol Check
  if (!metadata.isHttps) {
    penalty += 35;
    issues.push({
      id: "sec-missing-https",
      category: "SECURITY",
      severity: "CRITICAL",
      title: "Insecure HTTP Protocol Connection",
      description: "The website is serving content over unencrypted HTTP (http://) instead of HTTPS.",
      whyItMatters: "Unencrypted traffic exposes sensitive user data, passwords, and tokens to Man-in-the-Middle (MitM) attacks and triggers browser warnings.",
      element: "Protocol Scheme",
      recommendation: "Issue a TLS/SSL certificate (Let's Encrypt / Cloudflare) and enforce HTTPS redirects.",
      codeFix: `# Nginx 301 Redirect to HTTPS\nserver {\n    listen 80;\n    server_name example.com;\n    return 301 https://$host$request_uri;\n}`,
      codeFixLanguage: "plaintext",
      seoImpact: 15,
      uxImpact: 20,
    });
  }

  // 2. Strict-Transport-Security (HSTS) Header
  if (!metadata.securityHeaders.strictTransportSecurity) {
    penalty += 15;
    issues.push({
      id: "sec-missing-hsts",
      category: "SECURITY",
      severity: "HIGH",
      title: "Missing HSTS Security Header (Strict-Transport-Security)",
      description: "No Strict-Transport-Security header was detected in the HTTP response.",
      whyItMatters: "HSTS forces browsers to communicate strictly over HTTPS, preventing SSL stripping and downgrade attacks.",
      element: "HTTP Response Header",
      recommendation: "Add Strict-Transport-Security with max-age of at least 1 year (31536000 seconds).",
      codeFix: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`,
      codeFixLanguage: "plaintext",
      seoImpact: 5,
      uxImpact: 10,
    });
  }

  // 3. Content Security Policy (CSP) Header
  if (!metadata.securityHeaders.contentSecurityPolicy) {
    penalty += 15;
    issues.push({
      id: "sec-missing-csp",
      category: "SECURITY",
      severity: "HIGH",
      title: "Missing Content Security Policy (CSP) Header",
      description: "No Content-Security-Policy header was returned by the web server.",
      whyItMatters: "CSP mitigates Cross-Site Scripting (XSS) and data injection attacks by restricting resource load origins.",
      element: "HTTP Response Header",
      recommendation: "Configure a strict Content Security Policy limiting script, style, and frame sources.",
      codeFix: `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline';`,
      codeFixLanguage: "plaintext",
      seoImpact: 3,
      uxImpact: 12,
    });
  }

  // 4. Clickjacking Protection (X-Frame-Options)
  if (!metadata.securityHeaders.xFrameOptions) {
    penalty += 12;
    issues.push({
      id: "sec-missing-x-frame-options",
      category: "SECURITY",
      severity: "MEDIUM",
      title: "Missing Clickjacking Protection (X-Frame-Options)",
      description: "The response lacks an X-Frame-Options header.",
      whyItMatters: "Without frame restrictions, attackers can embed your site inside invisible <iframe> tags to trick users into performing unintentional actions.",
      element: "HTTP Response Header",
      recommendation: "Set X-Frame-Options to DENY or SAMEORIGIN.",
      codeFix: `X-Frame-Options: DENY`,
      codeFixLanguage: "plaintext",
      seoImpact: 2,
      uxImpact: 8,
    });
  }

  // 5. MIME-Sniffing Prevention (X-Content-Type-Options)
  if (!metadata.securityHeaders.xContentTypeOptions) {
    penalty += 10;
    issues.push({
      id: "sec-missing-x-content-type-options",
      category: "SECURITY",
      severity: "MEDIUM",
      title: "Missing X-Content-Type-Options: nosniff Header",
      description: "The server did not set X-Content-Type-Options to 'nosniff'.",
      whyItMatters: "Prevents browsers from MIME-sniffing a response away from the declared content-type, blocking malicious script execution via image uploads.",
      element: "HTTP Response Header",
      recommendation: "Set X-Content-Type-Options to nosniff.",
      codeFix: `X-Content-Type-Options: nosniff`,
      codeFixLanguage: "plaintext",
      seoImpact: 2,
      uxImpact: 6,
    });
  }

  // 6. Mixed Content Check
  if (metadata.mixedContentCount > 0) {
    penalty += 15;
    issues.push({
      id: "sec-mixed-content",
      category: "SECURITY",
      severity: "CRITICAL",
      title: `${metadata.mixedContentCount} Insecure Mixed Content Resources Detected`,
      description: `Found ${metadata.mixedContentCount} resources (images/scripts/stylesheets) loaded via http:// on an https:// page.`,
      whyItMatters: "Modern browsers block active mixed content, resulting in broken styles, scripts, or security warnings.",
      element: "http:// resource URL",
      recommendation: "Update resource paths to relative URLs or https:// protocols.",
      codeFix: `<!-- Replace http:// with https:// or relative paths -->\n<script src="https://cdn.example.com/app.js"></script>`,
      codeFixLanguage: "html",
      seoImpact: 8,
      uxImpact: 14,
    });
  }

  const score = Math.max(0, Math.min(100, 100 - penalty));
  return { score, issues };
}
