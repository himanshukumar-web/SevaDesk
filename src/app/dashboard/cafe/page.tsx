import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { REQUEST_STATUSES } from "@/lib/constants";
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
  Star,
  DollarSign,
  TrendingUp,
  FileText,
  Users,
  Settings,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CyberCafeDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/cafe");
  }

  if (user.role === "USER") {
    redirect("/dashboard/user");
  }

  if (user.role === "SUPER_ADMIN") {
    redirect("/dashboard/admin");
  }

  const cafe = await prisma.cyberCafe.findUnique({
    where: { userId: user.id },
    include: {
      serviceRequests: {
        include: {
          user: { select: { name: true, phone: true, email: true } },
          userDocument: { select: { title: true } },
        },
        orderBy: { updatedAt: "desc" },
      },
      reviews: {
        where: { isModerated: true },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!cafe) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold">Cyber Café Profile Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">Please contact SevaDesk administrator to link your profile.</p>
      </div>
    );
  }

  // Group requests
  const newRequests = cafe.serviceRequests.filter((r) => r.status === "PENDING");
  const activeRequests = cafe.serviceRequests.filter((r) =>
    ["ACCEPTED", "IN_PROGRESS", "WAITING_FOR_USER"].includes(r.status)
  );
  const completedRequests = cafe.serviceRequests.filter((r) => r.status === "COMPLETED");

  // Calculate earnings
  const completedRevenue = completedRequests.reduce((sum, r) => sum + (r.quoteAmount || 0), 0);
  const pendingRevenue = activeRequests.reduce((sum, r) => sum + (r.quoteAmount || 0), 0);

  const isVerified = cafe.verificationStatus === "VERIFIED";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              Cyber Café Operator Portal
            </span>
            {isVerified ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Verified Partner
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
                Verification Status: {cafe.verificationStatus}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {cafe.shopName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {cafe.address}, {cafe.city}, {cafe.district}, {cafe.state} • Timings: {cafe.openingHours}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/cyber-cafes/${cafe.id}`}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Preview Public Rate Card
          </Link>
        </div>
      </div>

      {/* Verification Advisory Banner if not verified */}
      {!isVerified && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Admin Verification in Progress:</strong>
            Your Cyber Café account has been registered and is currently queued for audit. Once the Super Admin verifies your CSC / Trade registration details, the official green &ldquo;Verified&rdquo; badge will appear in public search results.
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">New Requests</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {newRequests.length}
          </span>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 block mt-1">
            Requires your response
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Active In-Progress</span>
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {activeRequests.length}
          </span>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 block mt-1">
            Under typing or upload
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Completed Assistance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {completedRequests.length}
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-1">
            Successfully closed
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Operator Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            ₹{completedRevenue}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            +₹{pendingRevenue} pending in active quotes
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT 8 COLS: REQUEST PIPELINE */}
        <div className="lg:col-span-8 space-y-6">
          {/* New & Active Customer Requests */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Citizen Service Inquiries & Requests ({cafe.serviceRequests.length})
            </h2>

            {cafe.serviceRequests.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">
                No customer requests received yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {cafe.serviceRequests.map((req) => {
                  const statusMeta =
                    REQUEST_STATUSES[req.status as keyof typeof REQUEST_STATUSES] || {
                      label: req.status,
                      color: "bg-slate-100 text-slate-800",
                    };

                  return (
                    <div
                      key={req.id}
                      className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusMeta.color}`}
                          >
                            {statusMeta.label}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(req.createdAt).toLocaleDateString("en-IN")}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                          {req.title}
                        </h3>

                        <p className="text-xs text-slate-500 mt-0.5">
                          Citizen: <strong>{req.user.name}</strong> • Phone: {req.user.phone}
                          {req.userDocument && (
                            <span className="text-blue-600 dark:text-blue-400 ml-1">
                              • Draft attached ({req.userDocument.title})
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                        {req.quoteAmount && (
                          <span className="text-xs font-bold text-emerald-600">
                            ₹{req.quoteAmount}
                          </span>
                        )}
                        <Link
                          href={`/chat/${req.id}`}
                          className="px-4 py-2 rounded-lg bg-seva-navy-900 hover:bg-seva-navy-800 text-white text-xs font-semibold shadow transition flex items-center space-x-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Respond & Chat</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT 4 COLS: REPUTATION & EARNINGS BREAKDOWN */}
        <div className="lg:col-span-4 space-y-6">
          {/* Rating Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Citizen Trust & Ratings
            </h3>
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-3xl font-extrabold text-amber-500">
                ★ {cafe.rating.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500">
                Based on {cafe.reviewCount} verified citizen reviews
              </span>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              {cafe.reviews.slice(0, 3).map((r) => (
                <div key={r.id} className="text-xs space-y-0.5">
                  <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                    <span>{r.user.name}</span>
                    <span className="text-amber-500">★ {r.rating}</span>
                  </div>
                  <p className="text-slate-500 italic">&ldquo;{r.comment}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rate Card Summary */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Current Service Rates
            </h3>
            <p className="text-slate-500">
              Published on your public profile card for citizens:
            </p>
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex justify-between">
                <span>Application Typing:</span>
                <span className="font-bold text-emerald-600">₹30</span>
              </div>
              <div className="flex justify-between">
                <span>Portal Filing Assist:</span>
                <span className="font-bold text-emerald-600">₹50</span>
              </div>
              <div className="flex justify-between">
                <span>B&W Printing:</span>
                <span className="font-bold">₹5 / page</span>
              </div>
              <div className="flex justify-between">
                <span>Color Printing:</span>
                <span className="font-bold">₹15 / page</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
