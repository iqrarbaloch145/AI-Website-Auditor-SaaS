import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchAndParseWebsite } from "@/lib/audit/scraper";
import { runFullAudit } from "@/lib/audit/scoring";
import { generateAIEnhancements } from "@/lib/ai/gemini-auditor";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ScanSchema = z.object({
  url: z.string().min(1, "URL is required"),
  projectId: z.string().optional(),
});

export const recentScansMap = new Map<string, any>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = ScanSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid URL payload", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { url } = parseResult.data;

    // 1. Scrape and inspect DOM
    const scrapedData = await fetchAndParseWebsite(url);

    // 2. Perform 7-dimension audit analysis
    const auditResult = runFullAudit(scrapedData);

    // 3. Generate Gemini AI enhancements
    const { aiSummary } = await generateAIEnhancements(auditResult);
    auditResult.aiSummary = aiSummary;

    const scanId = `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    auditResult.id = scanId;

    recentScansMap.set(scanId, auditResult);

    try {
      if (prisma && typeof prisma.scan?.create === "function") {
        await prisma.scan.create({
          data: {
            id: scanId,
            url: auditResult.url,
            title: auditResult.title,
            status: "COMPLETED",
            overallScore: auditResult.overallScore,
            seoScore: auditResult.scores.seo,
            performanceScore: auditResult.scores.performance,
            accessibilityScore: auditResult.scores.accessibility,
            securityScore: auditResult.scores.security,
            mobileScore: auditResult.scores.mobile,
            contentScore: auditResult.scores.content,
            uiScore: auditResult.scores.ui,
            cmsDetected: auditResult.cmsDetected,
            frameworkDetected: auditResult.frameworkDetected,
            techStack: auditResult.techStack,
            metadata: JSON.parse(JSON.stringify(auditResult.metadata)),
            durationMs: auditResult.durationMs,
          },
        });
      }
    } catch {
      // Memory store fallback
    }

    return NextResponse.json({ success: true, scan: auditResult });
  } catch (error) {
    console.error("Scan API Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Audit execution failed" },
      { status: 500 }
    );
  }
}
