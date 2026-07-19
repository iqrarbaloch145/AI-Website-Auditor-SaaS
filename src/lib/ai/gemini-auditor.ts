import { FullAuditResult, AuditIssue } from "@/types/audit";
import { generateGeminiContent } from "./gemini";

export async function generateAIEnhancements(result: FullAuditResult): Promise<{
  aiSummary: string;
  enhancedIssues: AuditIssue[];
}> {
  // If no API key set or offline fallback mode, return enhanced default recommendations
  if (!process.env.GEMINI_API_KEY) {
    const aiSummary = `Comprehensive audit of ${result.url} completed. Overall Health Score: ${result.overallScore}/100 across 7 core dimensions. Identified ${result.issues.length} potential optimizations with ${result.issues.filter((i) => i.severity === "CRITICAL" || i.severity === "HIGH").length} high-priority action items.`;
    return {
      aiSummary,
      enhancedIssues: result.issues,
    };
  }

  try {
    const systemPrompt = `You are a Senior Web Performance, SEO, Security, and Accessibility Architect. Analyze the provided website scan data and output an executive summary highlighting key issues, their root causes, and prioritized code recommendations.`;

    const userPrompt = `
Website URL: ${result.url}
Overall Score: ${result.overallScore}/100
Category Scores:
- SEO: ${result.scores.seo}/100
- Performance: ${result.scores.performance}/100
- Accessibility: ${result.scores.accessibility}/100
- Security: ${result.scores.security}/100
- Mobile: ${result.scores.mobile}/100
- Content: ${result.scores.content}/100
- UI/UX: ${result.scores.ui}/100

CMS: ${result.cmsDetected}
Framework: ${result.frameworkDetected}
Total Issues Found: ${result.issues.length}

Key Issues Summary:
${result.issues.slice(0, 5).map((i) => `- [${i.severity}] ${i.title}: ${i.recommendation}`).join("\n")}

Provide a 3-sentence executive summary explaining why these scores were achieved and the single highest leverage fix.
`;

    const summaryText = await generateGeminiContent(userPrompt, systemPrompt);

    return {
      aiSummary: summaryText || `Audit completed for ${result.url} with an overall score of ${result.overallScore}/100.`,
      enhancedIssues: result.issues,
    };
  } catch (error) {
    console.error("Gemini AI Enhancement Error:", error);
    return {
      aiSummary: `Audit completed for ${result.url} with score ${result.overallScore}/100.`,
      enhancedIssues: result.issues,
    };
  }
}

export async function generateAICodeFix(issue: AuditIssue, framework: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    return issue.codeFix || `/* Fix recommendation for ${issue.title} */`;
  }

  const prompt = `
Issue Title: ${issue.title}
Category: ${issue.category}
Description: ${issue.description}
Framework/Stack: ${framework}

Generate a production-ready, clean, formatted code fix snippet for this issue. Output ONLY code inside appropriate markdown block with language tag.
`;

  const code = await generateGeminiContent(prompt, "You are an expert developer generating copy-paste code fixes.");
  return code || issue.codeFix || "";
}
