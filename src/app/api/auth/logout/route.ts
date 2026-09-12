import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  try {
    const supabase = createServerSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Clear legacy cookie if present
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: "",
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  }
}
