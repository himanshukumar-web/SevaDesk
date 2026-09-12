import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { CyberCafeProfileClient } from "@/components/cyber-cafe/CyberCafeProfileClient";

interface CyberCafeDetailPageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

export default async function CyberCafeDetailPage({ params }: CyberCafeDetailPageProps) {
  const currentUser = await getCurrentUser();

  const cafe = await prisma.cyberCafe.findUnique({
    where: { id: params.id },
    include: {
      reviews: {
        where: { isModerated: true },
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { name: true, city: true },
          },
        },
      },
    },
  });

  if (!cafe) {
    notFound();
  }

  // Load user documents if logged in
  let userDocuments: Array<{ id: string; title: string; createdAt: Date }> = [];
  if (currentUser) {
    userDocuments = await prisma.userDocument.findMany({
      where: { userId: currentUser.id },
      select: { id: true, title: true, createdAt: true },
      orderBy: { updatedAt: "desc" },
    });
  }

  return (
    <CyberCafeProfileClient
      cafe={cafe}
      userDocuments={userDocuments}
    />
  );
}
