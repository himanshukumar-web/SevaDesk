import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { REQUEST_STATUSES } from "@/lib/constants";
import {
  FileText,
  FileEdit,
  Building2,
  Search,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Printer,
  ShieldCheck,
  CreditCard,
  User,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function UserDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/user");
  }

  if (user.role === "CYBER_CAFE") {
    redirect("/dashboard/cafe");
  }

  if (user.role === "SUPER_ADMIN") {
    redirect("/dashboard/admin");
  }

  const [documents, serviceRequests, activeSubscription] = await Promise.all([
    prisma.userDocument.findMany({
      where: { userId: user.id },
      include: {
        template: { select: { title: true, id: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.serviceRequest.findMany({
      where: { userId: user.id },
      include: {
        cyberCafe: { select: { shopName: true, city: true, phone: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: "ACTIVE",
        OR: [{ endDate: null }, { endDate: { gt: new Date() } }],
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const isPremium = !!activeSubscription && activeSubscription.plan === "PREMIUM";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Platform Explanation Banner required by prompt */}
      <div className="bg-gradient-to-r from-seva-navy-950 to-seva-navy-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-700 inline-block mb-2">
              Citizen Public Service Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              Welcome back, {user.name}!
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Find the right government document. Know what you need before you apply. Draft standard A4 application formats and connect with verified local Cyber Café operators.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/type-document"
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs shadow transition flex items-center space-x-1.5"
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Type Document</span>
            </Link>
            <Link
              href="/cyber-cafes"
              className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-600 transition flex items-center space-x-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Find Cyber Café</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/services"
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-sm transition group"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Search Documents
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Browse 15+ central & state service guides and checklists
          </p>
        </Link>

        <Link
          href="/type-document"
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-sm transition group"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition">
            <FileEdit className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Draft Application
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Income, Domicile, Affidavits, and General representation letters
          </p>
        </Link>

        <Link
          href="/cyber-cafes"
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-sm transition group"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Find Local CSC / Café
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Verified operators near you for scanning, typing, and printing
          </p>
        </Link>

        <Link
          href="/pricing"
          className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-sm transition group"
        >
          <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Plan: {isPremium ? "Premium (₹99)" : "Citizen Free"}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isPremium ? "Active Ad-free unlimited status" : "Upgrade for zero ads & instant typing"}
          </p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT 7 COLS: MY DRAFTS & MY REQUESTS */}
        <div className="lg:col-span-8 space-y-8">
          {/* SECTION: My Saved Documents */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  My Prepared Documents ({documents.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Citizen-prepared standardized application drafts saved to your account
                </p>
              </div>
              <Link
                href="/type-document"
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                + New Document
              </Link>
            </div>

            {documents.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700">
                <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  No saved drafts yet
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Pick an Income, Domicile, or General letter template to draft your first application.
                </p>
                <Link
                  href="/type-document"
                  className="mt-3 inline-block px-4 py-2 rounded-lg bg-seva-navy-900 text-white text-xs font-semibold"
                >
                  Browse Templates
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
                        <span>{doc.template?.title || "Standard Format"}</span>
                        <span>•</span>
                        <span>Updated {new Date(doc.updatedAt).toLocaleDateString("en-IN")}</span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                      <Link
                        href={`/type-document/${doc.templateId}?docId=${doc.id}`}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-1"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                        <span>Edit & Preview</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION: My Service Requests & Cyber Cafe Assistance */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  My Cyber Café Requests ({serviceRequests.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Track status, quotes, and chat with your chosen service provider
                </p>
              </div>
              <Link
                href="/cyber-cafes"
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                + New Request
              </Link>
            </div>

            {serviceRequests.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700">
                <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  No active operator requests
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Need help uploading to official portals or printing? Search nearby Cyber Cafés.
                </p>
                <Link
                  href="/cyber-cafes"
                  className="mt-3 inline-block px-4 py-2 rounded-lg bg-seva-navy-900 text-white text-xs font-semibold"
                >
                  Find a Cyber Café
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {serviceRequests.map((req) => {
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
                          Assigned to: <strong>{req.cyberCafe.shopName}</strong> ({req.cyberCafe.city})
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
                          <span>Open Chat & Details</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT 4 COLS: CITIZEN PROFILE & SECURITY */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-seva-navy-900 text-white flex items-center justify-center font-bold text-base">
                {user.name[0]}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {user.name}
                </h3>
                <span className="text-xs text-slate-500">{user.email}</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Mobile:</span>
                <span className="font-semibold">{user.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">State:</span>
                <span className="font-semibold">{user.state || "Not Set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">District:</span>
                <span className="font-semibold">{user.district || "Not Set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pincode:</span>
                <span className="font-semibold">{user.pincode || "Not Set"}</span>
              </div>
            </div>
          </div>

          {/* Privacy & Trust Badge */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-xs space-y-3">
            <div className="flex items-center space-x-2 text-emerald-600 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>Data Protection Guarantee</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Your draft documents and personal entries remain confidential. Cyber Cafés can only view information you explicitly submit through an assistance request.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
