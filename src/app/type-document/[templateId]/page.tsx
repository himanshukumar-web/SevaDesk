import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { verifyUserEntitlement } from "@/lib/ad-provider";
import { DocumentFormWizard } from "@/components/document/DocumentFormWizard";

interface TypeDocumentPageProps {
  params: {
    templateId: string;
  };
  searchParams: {
    docId?: string;
  };
}

export const dynamic = "force-dynamic";

export default async function TypeDocumentPage({ params, searchParams }: TypeDocumentPageProps) {
  const currentUser = await getCurrentUser();

  // Find template by id or slug
  const template = await prisma.documentTemplate.findFirst({
    where: {
      OR: [{ id: params.templateId }, { slug: params.templateId }],
      isPublished: true,
    },
  });

  if (!template) {
    notFound();
  }

  // Check user entitlement
  let hasUnlockedEntitlement = false;
  if (currentUser) {
    const entitlement = await verifyUserEntitlement(currentUser.id, template.id);
    hasUnlockedEntitlement = entitlement.hasAccess;
  }

  // If user requested to edit an existing saved draft
  let userDocument = null;
  if (searchParams.docId && currentUser) {
    userDocument = await prisma.userDocument.findFirst({
      where: {
        id: searchParams.docId,
        userId: currentUser.id,
      },
      select: {
        id: true,
        title: true,
        formDataJson: true,
      },
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DocumentFormWizard
        template={template}
        hasUnlockedEntitlement={hasUnlockedEntitlement}
        userDocument={userDocument}
      />
    </div>
  );
}
