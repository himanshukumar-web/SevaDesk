import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { adProvider, grantAdUnlock } from "@/lib/ad-provider";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, clientToken, serviceId } = body;

    const isValid = await adProvider.verifyCompletion(sessionId, clientToken);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid ad completion verification." }, { status: 400 });
    }

    const expiresAt = await grantAdUnlock(user.id, serviceId || "general_template");

    return NextResponse.json({
      success: true,
      message: "Ad-based unlock entitlement successfully granted.",
      expiresAt,
    });
  } catch (error) {
    console.error("Ad verify error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
