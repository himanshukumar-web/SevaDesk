import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { verifyPassword, AUTH_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const emailNorm = email.toLowerCase().trim();
    const supabase = createServerSupabaseClient();

    // 1. Primary Authentication: Supabase Auth
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailNorm,
        password,
      });

      if (error) {
        return NextResponse.json(
          { error: error.message || "Invalid email or password. Please check your credentials." },
          { status: 401 }
        );
      }

      // Fetch or link application profile in Prisma database
      let user = null;
      try {
        user = await prisma.user.findFirst({
          where: {
            OR: [{ supabaseAuthId: data.user.id }, { email: emailNorm }],
          },
          include: {
            cyberCafe: true,
          },
        });

        if (user && !user.supabaseAuthId) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { supabaseAuthId: data.user.id },
            include: { cyberCafe: true },
          });
        }
      } catch (dbErr) {
        console.warn("[Login] Could not query Prisma profile:", dbErr);
      }

      const meta = data.user.user_metadata || {};
      const userRole = user?.role || meta.role || "USER";
      const userName = user?.name || meta.name || emailNorm.split("@")[0];

      return NextResponse.json({
        success: true,
        user: {
          id: user?.id || data.user.id,
          name: userName,
          email: emailNorm,
          role: userRole,
          cyberCafe: user?.cyberCafe || null,
        },
      });
    }

    // 2. Fallback for offline local dev environment without active Supabase credentials
    const user = await prisma.user.findUnique({
      where: { email: emailNorm },
      include: {
        cyberCafe: true,
      },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password. Please check your credentials." },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password. Please check your credentials." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        cyberCafe: user.cyberCafe,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: user.id,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
