import { NextRequest, NextResponse } from "next/server";
import { recentScansMap } from "../route";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const scan = recentScansMap.get(id);

    if (!scan) {
      return NextResponse.json({ error: "Scan record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, scan });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch scan" }, { status: 500 });
  }
}
