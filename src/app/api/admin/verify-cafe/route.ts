import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Super Admin only." }, { status: 403 });
    }

    const body = await request.json();
    const { cafeId, status } = body;

    if (!cafeId || !["VERIFIED", "REJECTED", "SUSPENDED", "PENDING"].includes(status)) {
      return NextResponse.json({ error: "Invalid cafe ID or verification status." }, { status: 400 });
    }

    const updated = await prisma.cyberCafe.update({
      where: { id: cafeId },
      data: { verificationStatus: status },
      include: { user: true },
    });

    // Write audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: `CAFE_VERIFICATION_${status}`,
        entity: "CYBER_CAFE",
        entityId: cafeId,
        details: `Super Admin ${user.name} changed verification status of ${updated.shopName} to ${status}.`,
      },
    });

    return NextResponse.json({ success: true, cafe: updated });
  } catch (error) {
    console.error("Admin verification error:", error);
    return NextResponse.json({ error: "Failed to update verification status" }, { status: 500 });
  }
}
