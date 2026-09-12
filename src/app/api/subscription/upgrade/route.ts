import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to upgrade." }, { status: 401 });
    }

    const body = await request.json();
    const { paymentMethod = "MOCK_UPI", razorpayPaymentId } = body;

    const paymentRef = razorpayPaymentId || `pay_rzp_mock_${Date.now()}`;
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: "PREMIUM",
        status: "ACTIVE",
        amount: 99.0,
        startDate: new Date(),
        endDate,
        paymentRef,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "SUBSCRIPTION_PREMIUM_UPGRADE",
        entity: "SUBSCRIPTION",
        entityId: subscription.id,
        details: `Citizen ${user.name} upgraded to Premium plan (₹99/mo) via ${paymentMethod}.`,
      },
    });

    return NextResponse.json({
      success: true,
      subscription,
      message: "Congratulations! Your SevaDesk Premium subscription is now active.",
    });
  } catch (error) {
    console.error("Subscription upgrade error:", error);
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}
