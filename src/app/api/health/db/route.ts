import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    // Perform minimal safe query to verify connectivity
    await prisma.$queryRawUnsafe("SELECT 1");

    return NextResponse.json(
      {
        success: true,
        database: "connected",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Health DB] Connectivity check failed:", error);
    return NextResponse.json(
      {
        success: false,
        database: "unavailable",
      },
      { status: 503 }
    );
  }
}
