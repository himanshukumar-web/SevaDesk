import React from "react";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/auth/login?redirect=/dashboard/admin");
  }

  if (currentUser.role !== "SUPER_ADMIN") {
    redirect("/dashboard/user");
  }

  const [
    totalUsers,
    verifiedCafes,
    pendingCafes,
    totalServices,
    totalRequests,
    completedRequests,
    cafes,
    services,
    auditLogs,
    users,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.cyberCafe.count({ where: { verificationStatus: "VERIFIED" } }),
    prisma.cyberCafe.count({ where: { verificationStatus: "PENDING" } }),
    prisma.service.count(),
    prisma.serviceRequest.count(),
    prisma.serviceRequest.count({ where: { status: "COMPLETED" } }),
    prisma.cyberCafe.findMany({
      orderBy: [{ verificationStatus: "asc" }, { createdAt: "desc" }],
      include: { user: { select: { name: true, email: true, phone: true } } },
    }),
    prisma.service.findMany({
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.auditLog.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      take: 30,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, phone: true, state: true },
    }),
  ]);

  return (
    <AdminDashboardClient
      stats={{
        totalUsers,
        verifiedCafes,
        pendingCafes,
        totalServices,
        totalRequests,
        completedRequests,
        totalRevenue: completedRequests * 50,
      }}
      cafes={cafes}
      services={services}
      auditLogs={auditLogs}
      users={users}
    />
  );
}
