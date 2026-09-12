import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED_STATUSES = ["VERIFIED", "REJECTED", "SUSPENDED", "PENDING"] as const;
type VerificationStatus = (typeof ALLOWED_STATUSES)[number];

export async function POST(request: Request) {
  try {
    // 1. Validate session & Super Admin authorization
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please authenticate as Super Admin." },
        { status: 401 }
      );
    }

    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden. Super Admin privileges required." },
        { status: 403 }
      );
    }

    // 2. Validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload." },
        { status: 400 }
      );
    }

    const { cafeId, status } = body;

    if (!cafeId || typeof cafeId !== "string" || cafeId.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Valid cafe ID is required." },
        { status: 400 }
      );
    }

    if (!status || !ALLOWED_STATUSES.includes(status as VerificationStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // 3. Verify cafe existence
    const existingCafe = await prisma.cyberCafe.findUnique({
      where: { id: cafeId },
      select: { id: true, shopName: true, verificationStatus: true },
    });

    if (!existingCafe) {
      return NextResponse.json(
        { success: false, error: "Cyber Café not found." },
        { status: 404 }
      );
    }

    // 4. Update cafe status
    const updated = await prisma.cyberCafe.update({
      where: { id: cafeId },
      data: { verificationStatus: status },
      include: { user: true },
    });

    // 5. Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: `CAFE_VERIFICATION_${status}`,
        entity: "CYBER_CAFE",
        entityId: cafeId,
        details: `Super Admin ${user.name} changed verification status of "${updated.shopName}" to "${status}".`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Cyber Café status successfully updated to ${status}.`,
      cafe: updated,
      data: updated,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(`[Admin Verify Cafe] Prisma Request Error [${error.code}]:`, error.message);
      if (error.code === "P2025") {
        return NextResponse.json(
          { success: false, error: "Cyber Café record does not exist." },
          { status: 404 }
        );
      }
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error("[Admin Verify Cafe] Prisma Initialization Error:", error.message);
      return NextResponse.json(
        { success: false, error: "Database service temporarily unavailable." },
        { status: 503 }
      );
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      console.error("[Admin Verify Cafe] Prisma Validation Error:", error.message);
      return NextResponse.json(
        { success: false, error: "Invalid database query parameters." },
        { status: 400 }
      );
    }

    console.error("[Admin Verify Cafe] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
