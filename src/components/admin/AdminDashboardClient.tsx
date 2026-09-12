"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  Users,
  FileText,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Eye,
  RotateCcw,
} from "lucide-react";

interface AdminDashboardClientProps {
  stats: {
    totalUsers: number;
    verifiedCafes: number;
    pendingCafes: number;
    totalServices: number;
    totalRequests: number;
    completedRequests: number;
    totalRevenue: number;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cafes: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  services: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  auditLogs: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  users: any[];
}

export function AdminDashboardClient({
  stats,
  cafes: initialCafes,
  services,
  auditLogs,
  users,
}: AdminDashboardClientProps) {
  const [cafes, setCafes] = useState(initialCafes);
  const [activeTab, setActiveTab] = useState<"verification" | "services" | "users" | "logs">("verification");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleVerifyCafe = async (cafeId: string, status: "VERIFIED" | "REJECTED" | "SUSPENDED" | "PENDING") => {
    setProcessingId(cafeId);
    try {
      const res = await fetch("/api/admin/verify-cafe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cafeId, status }),
      });

      if (res.ok) {
        setCafes((prev) =>
          prev.map((c) => (c.id === cafeId ? { ...c, verificationStatus: status } : c))
        );
      } else {
        alert("Failed to update status.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCafesList = cafes.filter((c) => c.verificationStatus === "PENDING");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-seva-navy-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Super Admin Console
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            National Public Service Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Audit Cyber Café registrations, oversee published government service rules, review citizen requests, and examine the system audit trail.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 border border-slate-700">
          Environment: Production Ready
        </span>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Total Citizens</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
            {stats.totalUsers}
          </span>
          <span className="text-[11px] text-emerald-600">Registered users</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Verified Cyber Cafés</span>
          <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">
            {stats.verifiedCafes}
          </span>
          <span className="text-[11px] text-amber-600 font-semibold">
            {stats.pendingCafes} pending review
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Citizen Services</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
            {stats.totalServices}
          </span>
          <span className="text-[11px] text-blue-600">Active public guides</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Assistance Requests</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
            {stats.totalRequests}
          </span>
          <span className="text-[11px] text-emerald-600">
            {stats.completedRequests} completed
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-4">
        <button
          type="button"
          onClick={() => setActiveTab("verification")}
          className={`pb-3 text-sm font-semibold border-b-2 transition flex items-center space-x-2 ${
            activeTab === "verification"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Operator Verification Queue ({pendingCafesList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("services")}
          className={`pb-3 text-sm font-semibold border-b-2 transition flex items-center space-x-2 ${
            activeTab === "services"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Government Services Catalog ({services.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`pb-3 text-sm font-semibold border-b-2 transition flex items-center space-x-2 ${
            activeTab === "users"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users & Roles ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("logs")}
          className={`pb-3 text-sm font-semibold border-b-2 transition flex items-center space-x-2 ${
            activeTab === "logs"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Audit Log Trail</span>
        </button>
      </div>

      {/* TAB 1: CYBER CAFE VERIFICATION QUEUE */}
      {activeTab === "verification" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Cyber Café Verification Queue
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review physical address and CSC credentials. Never verify operators without proper auditing.
            </p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {cafes.map((cafe) => {
              const isPending = cafe.verificationStatus === "PENDING";
              const isVerified = cafe.verificationStatus === "VERIFIED";

              return (
                <div key={cafe.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {cafe.shopName}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isVerified
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : isPending
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                        }`}
                      >
                        {cafe.verificationStatus}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">
                      Owner: <strong>{cafe.ownerName}</strong> • Phone: {cafe.phone} • Email: {cafe.email}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Address: {cafe.address}, {cafe.city}, {cafe.district}, {cafe.state} - {cafe.pincode}
                    </p>
                    {cafe.verificationDocsJson && (
                      <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-mono">
                        Registration Proof: {cafe.verificationDocsJson}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                    <Link
                      href={`/cyber-cafes/${cafe.id}`}
                      target="_blank"
                      className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>

                    {!isVerified && (
                      <button
                        type="button"
                        disabled={processingId === cafe.id}
                        onClick={() => handleVerifyCafe(cafe.id, "VERIFIED")}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Verify</span>
                      </button>
                    )}

                    {isVerified && (
                      <button
                        type="button"
                        disabled={processingId === cafe.id}
                        onClick={() => handleVerifyCafe(cafe.id, "SUSPENDED")}
                        className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow flex items-center space-x-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Suspend</span>
                      </button>
                    )}

                    {isPending && (
                      <button
                        type="button"
                        disabled={processingId === cafe.id}
                        onClick={() => handleVerifyCafe(cafe.id, "REJECTED")}
                        className="px-3 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-xs font-semibold"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: GOVERNMENT SERVICES CATALOG */}
      {activeTab === "services" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Published Government Services Catalog
              </h2>
              <p className="text-xs text-slate-500">
                Ensure accuracy of statutory portal fees and guidelines
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {services.map((svc) => (
              <div key={svc.id} className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Category: {svc.category.name} • Portal Fee: {svc.officialFees.split("(")[0]} • Processing: {svc.processingTime.split("(")[0]}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/services/${svc.slug}`}
                    target="_blank"
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-1"
                  >
                    <span>View Public Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: USERS & ROLES */}
      {activeTab === "users" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Registered Platform Users
            </h2>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {users.map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <strong className="block text-slate-900 dark:text-white">{u.name}</strong>
                  <span className="text-slate-500">{u.email} • {u.phone} • {u.state || "State unset"}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded font-semibold ${
                    u.role === "SUPER_ADMIN"
                      ? "bg-amber-100 text-amber-800"
                      : u.role === "CYBER_CAFE"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOG TRAIL */}
      {activeTab === "logs" && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Security & System Audit Log
          </h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex justify-between items-start">
                <div>
                  <strong className="font-mono text-emerald-600 dark:text-emerald-400">
                    [{log.action}]
                  </strong>
                  <p className="text-slate-700 dark:text-slate-300 mt-0.5">{log.details}</p>
                </div>
                <span className="text-slate-400 text-[11px] whitespace-nowrap ml-4">
                  {new Date(log.createdAt).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
