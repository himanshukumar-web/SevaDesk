import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(

  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, note, quoteAmount } = body;

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: params.id },
      include: {
        cyberCafe: { select: { userId: true } },
      },
    });

    if (!serviceRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const isCitizen = serviceRequest.userId === user.id;
    const isCafeOperator = serviceRequest.cyberCafe.userId === user.id;
    const isAdmin = user.role === "SUPER_ADMIN";

    if (!isCitizen && !isCafeOperator && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Citizens can only cancel their own request
    if (isCitizen && !isAdmin && status !== "CANCELLED") {
      return NextResponse.json(
        { error: "Citizens can only cancel their request." },
        { status: 403 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { status };
    if (quoteAmount !== undefined && (isCafeOperator || isAdmin)) {
      updateData.quoteAmount = parseFloat(quoteAmount) || 0;
    }

    const updated = await prisma.serviceRequest.update({
      where: { id: params.id },
      data: {
        ...updateData,
        statusHistory: {
          create: {
            status,
            note: note || `Status transitioned to ${status}`,
            changedByUserId: user.id,
          },
        },
      },
    });

    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json({ error: "Failed to update request status." }, { status: 500 });
  }
}
