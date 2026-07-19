import * as cheerio from "cheerio";
import { ExtractedMetadata } from "@/types/audit";

export interface ScrapeResult {
  url: string;
  normalizedUrl: string;
  statusCode: number;
  headers: Record<string, string>;
  ttfbMs: number;
  html: string;
  $: cheerio.CheerioAPI;
  metadata: ExtractedMetadata;
  cmsDetected: string;
  frameworkDetected: string;
  techStack: string[];
}

export async function fetchAndParseWebsite(rawUrl: string): Promise<ScrapeResult> {
  let normalizedUrl = rawUrl.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout limit

  try {
    const response = await fetch(normalizedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 AIWebsiteAuditor/1.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    clearTimeout(timeoutId);

    const ttfbMs = Date.now() - startTime;
    const statusCode = response.status;
    const html = await response.text();

    const headers: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      headers[key.toLowerCase()] = val;
    });

    const $ = cheerio.load(html);

    // Extract HTML details
    const title = $("title").first().text().trim() || $("meta[property='og:title']").attr("content")?.trim();
    const description =
      $("meta[name='description']").attr("content")?.trim() ||
      $("meta[property='og:description']").attr("content")?.trim();
    const canonicalUrl = $("link[rel='canonical']").attr("href")?.trim();
    const robots = $("meta[name='robots']").attr("content")?.trim();

    // OG & Twitter
    const ogTitle = $("meta[property='og:title']").attr("content")?.trim();
    const ogDescription = $("meta[property='og:description']").attr("content")?.trim();
    const ogImage = $("meta[property='og:image']").attr("content")?.trim();
    const twitterCard = $("meta[name='twitter:card']").attr("content")?.trim();

    // Schema Types
    const schemaTypes: string[] = [];
    $("script[type='application/ld+json']").each((_, el) => {
      try {
        const json = JSON.parse($(el).html() || "{}");
        if (json["@type"]) {
          if (Array.isArray(json["@type"])) {
            schemaTypes.push(...json["@type"]);
          } else {
            schemaTypes.push(String(json["@type"]));
          }
        }
      } catch {
        // invalid JSON schema
      }
    });

    // Headings
    const headingsList: { level: string; text: string }[] = [];
    $("h1, h2, h3").each((_, el) => {
      const tag = el.tagName.toLowerCase();
      const text = $(el).text().replace(/\s+/g, " ").trim();
      if (text.length > 0) {
        headingsList.push({ level: tag, text: text.slice(0, 80) });
      }
    });

    const h1Count = $("h1").length;
    const h2Count = $("h2").length;
    const h3Count = $("h3").length;

    // Images
    const totalImages = $("img").length;
    let missingAltCount = 0;
    $("img").each((_, el) => {
      const alt = $(el).attr("alt");
      if (alt === undefined || alt.trim() === "") {
        missingAltCount++;
      }
    });

    // Links
    const totalLinks = $("a[href]").length;
    let internalLinks = 0;
    let externalLinks = 0;
    const targetHost = new URL(normalizedUrl).hostname;

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (href) {
        try {
          if (href.startsWith("http://") || href.startsWith("https://")) {
            const linkHost = new URL(href).hostname;
            if (linkHost === targetHost) internalLinks++;
            else externalLinks++;
          } else if (href.startsWith("/") || href.startsWith("#") || !href.includes(":")) {
            internalLinks++;
          }
        } catch {
          // ignore invalid link format
        }
      }
    });

    // Scripts & Stylesheets
    const totalScripts = $("script").length;
    let asyncDeferScriptsCount = 0;
    $("script").each((_, el) => {
      if ($(el).attr("async") !== undefined || $(el).attr("defer") !== undefined) {
        asyncDeferScriptsCount++;
      }
    });

    const totalStylesheets = $("link[rel='stylesheet']").length;

    // Security Headers & Mixed Content
    const isHttps = normalizedUrl.startsWith("https://");
    const securityHeaders = {
      contentSecurityPolicy: !!headers["content-security-policy"],
      strictTransportSecurity: !!headers["strict-transport-security"],
      xFrameOptions: !!headers["x-frame-options"],
      xContentTypeOptions: !!headers["x-content-type-options"],
      referrerPolicy: !!headers["referrer-policy"],
    };

    let mixedContentCount = 0;
    if (isHttps) {
      $("img[src^='http://'], script[src^='http://'], link[src^='http://']").each(() => {
        mixedContentCount++;
      });
    }

    const setCookie = headers["set-cookie"] || "";
    const cookieFlagsSecure = setCookie ? setCookie.includes("Secure") && setCookie.includes("HttpOnly") : true;

    // Readability & Words
    const bodyText = $("body").text().replace(/\s+/g, " ").trim();
    const words = bodyText.split(" ").filter((w) => w.length > 2);
    const wordCount = words.length;

    // Simple word frequency calculator
    const wordFreq: Record<string, number> = {};
    const stopWords = new Set(["the", "and", "for", "that", "this", "with", "you", "are", "from", "have", "your"]);
    words.forEach((w) => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (clean.length > 3 && !stopWords.has(clean)) {
        wordFreq[clean] = (wordFreq[clean] || 0) + 1;
      }
    });

    const keywordDensity = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word, count]) => ({
        word,
        count,
        percentage: Number(((count / Math.max(wordCount, 1)) * 100).toFixed(1)),
      }));

    // Viewport & Mobile
    const viewportMeta = $("meta[name='viewport']").length > 0;

    // Detect CMS & Framework
    const { cmsDetected, frameworkDetected, techStack } = detectTechStack(html, headers, $);

    // Asset size estimates
    const htmlSizeKb = Number((Buffer.byteLength(html, "utf8") / 1024).toFixed(1));

    const metadata: ExtractedMetadata = {
      title,
      description,
      canonicalUrl,
      robots,
      hasSitemap: false, // will verify in SEO analyzer
      ogTitle,
      ogDescription,
      ogImage,
      twitterCard,
      schemaTypes,
      h1Count,
      h2Count,
      h3Count,
      headingsList,
      totalImages,
      missingAltImagesCount: missingAltCount,
      totalLinks,
      brokenLinksCount: 0,
      internalLinksCount: internalLinks,
      externalLinksCount: externalLinks,
      totalScripts,
      asyncDeferScriptsCount,
      totalStylesheets,
      isHttps,
      securityHeaders,
      mixedContentCount,
      cookieFlagsSecure,
      readabilityScore: calculateReadability(words.length, $("p").length),
      wordCount,
      keywordDensity,
      viewportMeta,
      responsiveImageRatio: totalImages > 0 ? Number((((totalImages - missingAltCount) / totalImages) * 100).toFixed(0)) : 100,
      ttfbMs,
      htmlSizeKb,
      totalAssetsSizeKb: htmlSizeKb + totalScripts * 25 + totalStylesheets * 15,
      estimatedFcpMs: Math.round(ttfbMs * 1.5 + totalStylesheets * 40),
      estimatedLcpMs: Math.round(ttfbMs * 2.2 + totalScripts * 60),
      estimatedCls: totalImages > missingAltCount ? 0.05 : 0.18,
      estimatedTbtMs: Math.max(0, (totalScripts - asyncDeferScriptsCount) * 45),
      contrastIssuesCount: 0,
      missingFormLabelsCount: $("input:not([type='hidden']):not([aria-label]):not([id])").length,
      ariaErrorsCount: 0,
    };

    return {
      url: rawUrl,
      normalizedUrl,
      statusCode,
      headers,
      ttfbMs,
      html,
      $,
      metadata,
      cmsDetected,
      frameworkDetected,
      techStack,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    throw new Error(`Failed to audit ${normalizedUrl}: ${(err as Error).message}`);
  }
}

function calculateReadability(wordCount: number, paragraphCount: number): number {
  if (wordCount === 0 || paragraphCount === 0) return 70;
  const avgWordsPerPara = wordCount / paragraphCount;
  if (avgWordsPerPara > 60) return 55;
  if (avgWordsPerPara > 35) return 78;
  return 88;
}

function detectTechStack(
  html: string,
  headers: Record<string, string>,
  $: cheerio.CheerioAPI
): { cmsDetected: string; frameworkDetected: string; techStack: string[] } {
  const stack: string[] = [];
  let cms = "Custom / Custom HTML";
  let framework = "Vanilla HTML / JavaScript";

  const generator = $("meta[name='generator']").attr("content") || "";

  if (generator.toLowerCase().includes("wordpress") || html.includes("wp-content") || html.includes("wp-includes")) {
    cms = "WordPress";
    stack.push("WordPress", "PHP");
  } else if (generator.toLowerCase().includes("shopify") || html.includes("cdn.shopify.com")) {
    cms = "Shopify";
    stack.push("Shopify", "Liquid");
  } else if (html.includes("__NEXT_DATA__") || html.includes("/_next/")) {
    cms = "Next.js Static / SSR";
    framework = "Next.js (React)";
    stack.push("Next.js", "React");
  } else if (html.includes("webflow")) {
    cms = "Webflow";
    stack.push("Webflow");
  } else if (html.includes("wix.com")) {
    cms = "Wix";
    stack.push("Wix");
  } else if (html.includes("squarespace")) {
    cms = "Squarespace";
    stack.push("Squarespace");
  }

  if (html.includes("react") || html.includes("data-reactroot")) {
    if (!stack.includes("React")) stack.push("React");
    if (framework === "Vanilla HTML / JavaScript") framework = "React";
  }
  if (html.includes("vue") || html.includes("data-v-")) {
    stack.push("Vue.js");
    framework = "Vue.js";
  }
  if (html.includes("ng-version") || html.includes("angular")) {
    stack.push("Angular");
    framework = "Angular";
  }
  if (html.includes("tailwind") || html.includes("class=\"") && /flex|grid|px-|py-|bg-/.test(html)) {
    stack.push("Tailwind CSS");
  }
  if (headers["server"]) {
    stack.push(`Server: ${headers["server"]}`);
  }

  return {
    cmsDetected: cms,
    frameworkDetected: framework,
    techStack: stack.length > 0 ? stack : ["HTML5", "CSS3", "JavaScript"],
  };
}
