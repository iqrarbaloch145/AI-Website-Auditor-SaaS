import { FullAuditResult } from "@/types/audit";
import { generateGeminiContent } from "./gemini";

export async function processScanAIChat(
  scanContext: FullAuditResult,
  chatHistory: { role: "user" | "assistant"; content: string }[],
  userMessage: string
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    // Intelligent contextual fallback response when API key is not supplied
    return generateFallbackChatResponse(scanContext, userMessage);
  }

  const systemInstruction = `
You are the AI Website Auditor Assistant powered by Google Gemini.
You have complete real-time context on the user's audited website scan:

URL: ${scanContext.url}
Overall Health Score: ${scanContext.overallScore}/100
CMS / Tech Stack: ${scanContext.cmsDetected} (${scanContext.frameworkDetected})
Scores:
- SEO: ${scanContext.scores.seo}/100
- Performance: ${scanContext.scores.performance}/100
- Accessibility: ${scanContext.scores.accessibility}/100
- Security: ${scanContext.scores.security}/100
- Mobile: ${scanContext.scores.mobile}/100
- Content: ${scanContext.scores.content}/100
- UI/UX: ${scanContext.scores.ui}/100

Extracted Issues (${scanContext.issues.length} total):
${scanContext.issues.map((i) => `- [${i.category} | ${i.severity}] ${i.title}: ${i.recommendation}`).join("\n")}

Instructions:
- Be concise, helpful, and highly technical yet clear.
- Provide direct code fixes (HTML, CSS, JS, React/Next.js) whenever requested.
- Reference the audit score and specific findings from the website data above.
`;

  const conversationFormatted = chatHistory
    .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
    .join("\n\n");

  const fullPrompt = `${conversationFormatted}\n\nUser: ${userMessage}\n\nAssistant:`;

  const responseText = await generateGeminiContent(fullPrompt, systemInstruction);

  return (
    responseText ||
    generateFallbackChatResponse(scanContext, userMessage)
  );
}

function generateFallbackChatResponse(scanContext: FullAuditResult, question: string): string {
  const q = question.toLowerCase();

  if (q.includes("seo") || q.includes("meta") || q.includes("title")) {
    const seoIssues = scanContext.issues.filter((i) => i.category === "SEO");
    if (seoIssues.length > 0) {
      return `Your SEO score is **${scanContext.scores.seo}/100**. The main issue detected is **${seoIssues[0].title}**. \n\n**Recommended Fix:**\n${seoIssues[0].recommendation}\n\n\`\`\`html\n${seoIssues[0].codeFix || "<!-- Add meta tags to head -->"}\n\`\`\``;
    }
    return `Your SEO score is **${scanContext.scores.seo}/100**. Your meta tags, headings, and canonical structure meet optimal search engine criteria.`;
  }

  if (q.includes("performance") || q.includes("lcp") || q.includes("speed") || q.includes("ttfb")) {
    const perfIssues = scanContext.issues.filter((i) => i.category === "PERFORMANCE");
    if (perfIssues.length > 0) {
      return `Your Performance score is **${scanContext.scores.performance}/100**. Top bottleneck: **${perfIssues[0].title}** (TTFB: ${scanContext.metadata.ttfbMs}ms). \n\n**Actionable Fix:**\n${perfIssues[0].recommendation}`;
    }
    return `Your Performance score is **${scanContext.scores.performance}/100**. TTFB is ${scanContext.metadata.ttfbMs}ms and script loading is optimized.`;
  }

  if (q.includes("security") || q.includes("https") || q.includes("header") || q.includes("csp")) {
    const secIssues = scanContext.issues.filter((i) => i.category === "SECURITY");
    if (secIssues.length > 0) {
      return `Your Security score is **${scanContext.scores.security}/100**. Key area to strengthen: **${secIssues[0].title}**. \n\n\`\`\`plaintext\n${secIssues[0].codeFix || "Strict-Transport-Security: max-age=31536000"}\n\`\`\``;
    }
    return `Your Security score is **${scanContext.scores.security}/100**. HTTPS is enabled and security headers are active.`;
  }

  return `Based on the audit of **${scanContext.url}** (Overall Score: **${scanContext.overallScore}/100**), we found **${scanContext.issues.length} items** to optimize across SEO, Performance, Security, and Accessibility. You can ask me for specific code snippets, meta tag optimizations, or performance tuning advice!`;
}
