import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(

  request: Request,
  { params }: { params: { requestId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: params.requestId },
      include: {
        user: { select: { id: true, name: true, phone: true, email: true } },
        cyberCafe: {
          select: {
            id: true,
            shopName: true,
            ownerName: true,
            phone: true,
            userId: true,
          },
        },
        userDocument: { select: { id: true, title: true, formDataJson: true } },
        statusHistory: { orderBy: { createdAt: "asc" } },
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: "asc" },
              include: { sender: { select: { id: true, name: true, role: true } } },
            },
          },
        },
        review: true,
      },
    });

    if (!serviceRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Security check: Only citizen, cyber cafe owner, or super admin can access
    const isCitizen = serviceRequest.userId === user.id;
    const isCafeOperator = serviceRequest.cyberCafe.userId === user.id;
    const isAdmin = user.role === "SUPER_ADMIN";

    if (!isCitizen && !isCafeOperator && !isAdmin) {
      return NextResponse.json(
        { error: "Access denied. You are not a participant in this conversation." },
        { status: 403 }
      );
    }

    // Mark unread messages as read
    if (serviceRequest.conversation) {
      await prisma.message.updateMany({
        where: {
          conversationId: serviceRequest.conversation.id,
          senderId: { not: user.id },
          isRead: false,
        },
        data: { isRead: true },
      });
    }

    return NextResponse.json({
      request: serviceRequest,
      currentUserRole: isCitizen ? "CITIZEN" : isCafeOperator ? "OPERATOR" : "ADMIN",
    });
  } catch (error) {
    console.error("Chat GET error:", error);
    return NextResponse.json({ error: "Failed to load conversation" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { requestId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content, attachmentUrl, attachmentName } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Message content cannot be empty" }, { status: 400 });
    }

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: params.requestId },
      include: {
        cyberCafe: { select: { userId: true } },
        conversation: true,
      },
    });

    if (!serviceRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Authorization check
    const isCitizen = serviceRequest.userId === user.id;
    const isCafeOperator = serviceRequest.cyberCafe.userId === user.id;
    const isAdmin = user.role === "SUPER_ADMIN";

    if (!isCitizen && !isCafeOperator && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let conversationId = serviceRequest.conversation?.id;

    if (!conversationId) {
      const conv = await prisma.conversation.create({
        data: {
          requestId: serviceRequest.id,
          user1Id: serviceRequest.userId,
          user2Id: serviceRequest.cyberCafe.userId,
        },
      });
      conversationId = conv.id;
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: user.id,
        content: content.trim(),
        attachmentUrl: attachmentUrl || null,
        attachmentName: attachmentName || null,
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("Chat POST error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
