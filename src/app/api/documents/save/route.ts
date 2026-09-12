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
    const { documentId, templateId, title, formDataJson, status = "DRAFT" } = body;

    if (!templateId || !title || !formDataJson) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let doc;
    if (documentId) {
      // Verify ownership before updating
      const existing = await prisma.userDocument.findUnique({
        where: { id: documentId },
      });
      if (!existing || existing.userId !== user.id) {
        return NextResponse.json({ error: "Document not found or unauthorized" }, { status: 403 });
      }

      doc = await prisma.userDocument.update({
        where: { id: documentId },
        data: {
          title,
          formDataJson,
          status,
        },
      });
    } else {
      doc = await prisma.userDocument.create({
        data: {
          userId: user.id,
          templateId,
          title,
          formDataJson,
          status,
        },
      });
    }

    return NextResponse.json({ success: true, document: doc });
  } catch (error) {
    console.error("Save document error:", error);
    return NextResponse.json({ error: "Failed to save document" }, { status: 500 });
  }
}
