"use client";

import React, { useState } from "react";
import { RequestAssistanceModal } from "@/components/cyber-cafe/RequestAssistanceModal";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  Star,
  ShieldCheck,
  Building2,
  DollarSign,
  MessageSquare,
} from "lucide-react";

interface CyberCafeProfileClientProps {
  cafe: {
    id: string;
    shopName: string;
    ownerName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    openingHours: string;
    servicesOffered: string;
    pricingJson: string;
    verificationStatus: string;
    isAvailable: boolean;
    rating: number;
    reviewCount: number;
    reviews: Array<{
      id: string;
      rating: number;
      comment: string;
      createdAt: string | Date;
      user: { name: string; city: string | null };
    }>;
  };
  userDocuments: Array<{
    id: string;
    title: string;
    createdAt: string | Date;
  }>;
}

export function CyberCafeProfileClient({ cafe, userDocuments }: CyberCafeProfileClientProps) {
  const [modalOpen, setModalOpen] = useState(false);

  let pricing: Record<string, number> = { typing: 30, assistance: 50, printBlack: 5, printColor: 15, scan: 10, lamination: 25 };
  try {
    pricing = { ...pricing, ...JSON.parse(cafe.pricingJson) };
  } catch {
    // default
  }

  const isVerified = cafe.verificationStatus === "VERIFIED";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                Authorized Service Provider
              </span>
              {isVerified ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Government Registration Verified
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Verification Under Review
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {cafe.shopName}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Managed by: <strong className="text-slate-700 dark:text-slate-200">{cafe.ownerName}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow transition flex items-center justify-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Request Assistance & Chat</span>
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-start space-x-2 text-slate-600 dark:text-slate-300">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 dark:text-white">Location:</strong>
              <span>{cafe.address}, {cafe.city}, {cafe.district}, {cafe.state} - {cafe.pincode}</span>
            </div>
          </div>

          <div className="flex items-start space-x-2 text-slate-600 dark:text-slate-300">
            <Clock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 dark:text-white">Working Hours:</strong>
              <span>{cafe.openingHours}</span>
            </div>
          </div>

          <div className="flex items-start space-x-2 text-slate-600 dark:text-slate-300">
            <Star className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5 fill-current" />
            <div>
              <strong className="block text-slate-900 dark:text-white">Citizen Trust:</strong>
              <span>★ {cafe.rating.toFixed(1)} / 5.0 ({cafe.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left 2 Cols: Services & Rate Card */}
        <div className="md:col-span-2 space-y-8">
          {/* Services Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              Services Offered
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {cafe.servicesOffered}
            </p>
          </div>

          {/* Published Rate Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Service Provider Charges (Rate Card)
              </h2>
              <span className="text-[11px] text-slate-500">
                Excludes Statutory Govt Fees
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Assistance / Typing Service</th>
                    <th className="p-3 text-right">Published Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="p-3 font-medium">Standard Application Typing (Bilingual A4)</td>
                    <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">₹{pricing.typing || 30}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Online Government Portal Filing Assistance</td>
                    <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">₹{pricing.assistance || 50}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Document Printing (Black & White, per page)</td>
                    <td className="p-3 text-right font-bold">₹{pricing.printBlack || 5}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Document Printing (Color High-Res, per page)</td>
                    <td className="p-3 text-right font-bold">₹{pricing.printColor || 15}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">High Resolution Scanning & PDF Conversion</td>
                    <td className="p-3 text-right font-bold">₹{pricing.scan || 10}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Thermal / Hot Lamination (per document)</td>
                    <td className="p-3 text-right font-bold">₹{pricing.lamination || 25}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Note: The above charges are set by the Cyber Café operator for computer operation, typing, and printing services. Official state government portal fees (if any) are separate and deposited directly into the government treasury.
            </p>
          </div>

          {/* Citizen Reviews */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Verified Citizen Reviews ({cafe.reviews.length})
            </h2>

            {cafe.reviews.length === 0 ? (
              <p className="text-xs text-slate-500">No public reviews yet for this provider.</p>
            ) : (
              <div className="space-y-4">
                {cafe.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {rev.user.name} {rev.user.city ? `(${rev.user.city})` : ""}
                      </span>
                      <span className="text-xs text-amber-500 font-bold flex items-center">
                        ★ {rev.rating} / 5
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Trust & Safety Card */}
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 text-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Operator Verification Standards</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              All verified Cyber Cafés on SevaDesk submit government trade registrations, CSC Kendra IDs, and owner identity proofs audited by the Super Admin team.
            </p>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-2 flex-shrink-0" />
                <span>Transparent service pricing</span>
              </div>
              <div className="flex items-center text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-2 flex-shrink-0" />
                <span>Encrypted private chat</span>
              </div>
              <div className="flex items-center text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-2 flex-shrink-0" />
                <span>Zero unauthorized document sharing</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-seva-navy-900 text-white rounded-xl space-y-3">
            <h4 className="font-bold text-sm">Need Help Right Away?</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Click below to send your application draft or inquiry to {cafe.shopName}.
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs shadow transition text-center"
            >
              Start Request Now
            </button>
          </div>
        </div>
      </div>

      {/* Assistance Modal */}
      <RequestAssistanceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        cyberCafe={cafe}
        userDocuments={userDocuments}
      />
    </div>
  );
}
