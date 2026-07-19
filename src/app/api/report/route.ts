import { NextRequest, NextResponse } from "next/server";
import { recentScansMap } from "../scan/route";
import Papa from "papaparse";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const scanId = searchParams.get("scanId");
  const format = (searchParams.get("format") || "json").toLowerCase();

  if (!scanId) {
    return NextResponse.json({ error: "scanId query parameter is required" }, { status: 400 });
  }

  const scan = recentScansMap.get(scanId);
  if (!scan) {
    return NextResponse.json({ error: "Scan record not found" }, { status: 404 });
  }

  if (format === "csv") {
    const csvData = scan.issues.map((i: any) => ({
      Category: i.category,
      Severity: i.severity,
      Title: i.title,
      Description: i.description,
      Recommendation: i.recommendation,
      SEO_Impact_Pts: i.seoImpact,
      UX_Impact_Pts: i.uxImpact,
      Element: i.element || "N/A",
    }));

    const csvString = Papa.unparse(csvData);

    return new NextResponse(csvString, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="audit-report-${scanId}.csv"`,
      },
    });
  }

  if (format === "json") {
    return new NextResponse(JSON.stringify(scan, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="audit-report-${scanId}.json"`,
      },
    });
  }

  return NextResponse.json({
    success: true,
    shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reports/share/${scanId}`,
    scan,
  });
}
