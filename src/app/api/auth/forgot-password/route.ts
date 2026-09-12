import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Valid email address is required." },
        { status: 400 }
      );
    }

    const emailNorm = email.toLowerCase().trim();
    const supabase = createServerSupabaseClient();

    if (supabase) {
      const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "https://sevadesk.in";
      const { error } = await supabase.auth.resetPasswordForEmail(emailNorm, {
        redirectTo: `${origin}/auth/reset-password`,
      });

      if (error) {
        console.warn("[Auth] Supabase reset password warning:", error.message);
      }
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, password reset instructions have been dispatched.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
