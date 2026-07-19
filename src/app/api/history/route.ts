import { NextRequest, NextResponse } from "next/server";
import { recentScansMap } from "../scan/route";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const memoryScans = Array.from(recentScansMap.values()).reverse();
    return NextResponse.json({
      success: true,
      scans: memoryScans,
      total: memoryScans.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch scan history" },
      { status: 500 }
    );
  }
}
