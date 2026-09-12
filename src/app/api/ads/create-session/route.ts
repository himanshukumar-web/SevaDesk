import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { adProvider } from "@/lib/ad-provider";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to unlock services." }, { status: 401 });
    }

    const body = await request.json();
    const { serviceId } = body;

    const session = await adProvider.createSession(user.id, serviceId || "general_template");
    return NextResponse.json({ session });
  } catch (error) {
    console.error("Ad session error:", error);
    return NextResponse.json({ error: "Failed to initialize ad session" }, { status: 500 });
  }
}
