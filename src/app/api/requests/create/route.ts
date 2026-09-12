import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const body = await request.json();
    const { cyberCafeId, userDocumentId, title, description } = body;

    if (!cyberCafeId || !title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify cyber cafe
    const cafe = await prisma.cyberCafe.findUnique({
      where: { id: cyberCafeId },
      include: { user: true },
    });

    if (!cafe) {
      return NextResponse.json({ error: "Cyber Café operator not found" }, { status: 404 });
    }

    // Verify document ownership if attached
    if (userDocumentId) {
      const doc = await prisma.userDocument.findFirst({
        where: { id: userDocumentId, userId: user.id },
      });
      if (!doc) {
        return NextResponse.json({ error: "Attached document not found or unauthorized" }, { status: 403 });
      }
    }

    // Create Service Request
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        userId: user.id,
        cyberCafeId: cafe.id,
        userDocumentId: userDocumentId || null,
        title,
        description,
        status: "PENDING",
        statusHistory: {
          create: {
            status: "PENDING",
            note: "New service request submitted by citizen",
            changedByUserId: user.id,
          },
        },
        conversation: {
          create: {
            user1Id: user.id,
            user2Id: cafe.userId,
            messages: {
              create: {
                senderId: user.id,
                content: `Namaste, I submitted request: "${title}". ${description}`,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      requestId: serviceRequest.id,
    });
  } catch (error) {
    console.error("Create request error:", error);
    return NextResponse.json({ error: "Failed to create service request." }, { status: 500 });
  }
}
