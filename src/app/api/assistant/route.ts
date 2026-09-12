import { NextRequest, NextResponse } from "next/server";
import { getAssistantProvider, AssistantMessage } from "@/lib/ai/provider";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, history = [], currentContext } = body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Please enter a valid query." },
        { status: 400 }
      );
    }

    // Limit length to avoid abuse
    if (query.length > 500) {
      return NextResponse.json(
        { error: "Query exceeds maximum permitted length of 500 characters." },
        { status: 400 }
      );
    }

    const provider = getAssistantProvider();
    const result = await provider.askAssistant(
      query,
      history as AssistantMessage[],
      currentContext
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Citizen Assistant API error:", error);
    return NextResponse.json(
      {
        message:
          "Our Citizen Facilitation Assistant is temporarily unavailable. Please browse the service directory directly.",
      },
      { status: 500 }
    );
  }
}
