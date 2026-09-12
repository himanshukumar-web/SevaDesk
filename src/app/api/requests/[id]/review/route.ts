import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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
    const { rating, comment } = body;

    const numRating = parseInt(rating, 10);
    if (!numRating || numRating < 1 || numRating > 5 || !comment?.trim()) {
      return NextResponse.json(
        { error: "Please provide a valid rating (1-5) and comment." },
        { status: 400 }
      );
    }

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: params.id },
      include: { review: true },
    });

    if (!serviceRequest) {
      return NextResponse.json({ error: "Request not found." }, { status: 404 });
    }

    if (serviceRequest.userId !== user.id) {
      return NextResponse.json({ error: "Only the requesting citizen can submit a review." }, { status: 403 });
    }

    if (serviceRequest.status !== "COMPLETED") {
      return NextResponse.json({ error: "Reviews can only be submitted after request completion." }, { status: 400 });
    }

    if (serviceRequest.review) {
      return NextResponse.json({ error: "A review has already been submitted for this request." }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        requestId: serviceRequest.id,
        userId: user.id,
        cyberCafeId: serviceRequest.cyberCafeId,
        rating: numRating,
        comment: comment.trim(),
        isModerated: true,
      },
    });

    // Recalculate Cafe average rating and review count
    const cafeReviews = await prisma.review.findMany({
      where: { cyberCafeId: serviceRequest.cyberCafeId, isModerated: true },
      select: { rating: true },
    });

    const totalStars = cafeReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = cafeReviews.length > 0 ? totalStars / cafeReviews.length : 5.0;

    await prisma.cyberCafe.update({
      where: { id: serviceRequest.cyberCafeId },
      data: {
        rating: parseFloat(avgRating.toFixed(1)),
        reviewCount: cafeReviews.length,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Review submission error:", error);
    return NextResponse.json({ error: "Failed to submit review." }, { status: 500 });
  }
}
