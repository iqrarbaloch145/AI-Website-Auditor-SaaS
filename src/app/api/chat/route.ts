import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { processScanAIChat } from "@/lib/ai/gemini-chat";
import { FullAuditResult } from "@/types/audit";

export const dynamic = "force-dynamic";

const ChatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  scanContext: z.any(),
  chatHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .default([]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parse = ChatRequestSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json(
        { error: "Invalid chat request format", details: parse.error.format() },
        { status: 400 }
      );
    }

    const { message, scanContext, chatHistory } = parse.data;

    const reply = await processScanAIChat(scanContext as FullAuditResult, chatHistory, message);

    return NextResponse.json({
      success: true,
      message: {
        role: "assistant",
        content: reply,
      },
    });
  } catch (error) {
    console.error("AI Chat Route Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Chat processing failed" },
      { status: 500 }
    );
  }
}
