"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { RazorpayMockModal } from "@/components/subscription/RazorpayMockModal";
import { CheckCircle2, ShieldCheck, Sparkles, HelpCircle } from "lucide-react";

export default function PricingPage() {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [upgraded, setUpgraded] = useState(false);

  const isPremium = user?.subscriptions?.some((s) => s.status === "ACTIVE") || upgraded;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Transparent Citizen Plans
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Free Forever or ₹99/Month Premium
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          SevaDesk is committed to digital inclusion across Bharat. Access all government information completely free or upgrade for ad-free convenience.
        </p>
      </div>

      {upgraded && (
        <div className="mb-8 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Your Premium Plan is now active! You now have ad-free unlimited document drafting.</span>
        </div>
      )}

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* FREE PLAN */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Citizen Free
            </span>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">₹0</span>
              <span className="ml-1 text-sm text-slate-500">/ forever</span>
            </div>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              Standard access supported by a 20–30s informational ad before typing unlock.
            </p>

            <ul className="mt-6 space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>All 15+ Central & State Service Guides</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Basic document templates with Ad-Unlock</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Standard A4 Preview & Print functionality</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Find and message verified local Cyber Cafés</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <Link
              href="/type-document"
              className="w-full block text-center py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Continue Free (Ad-Supported)
            </Link>
          </div>
        </div>

        {/* PREMIUM PLAN */}
        <div className="bg-gradient-to-b from-seva-navy-950 to-seva-navy-900 text-white rounded-2xl border-2 border-emerald-500 p-8 flex flex-col justify-between shadow-xl relative">
          <div className="absolute top-0 right-8 -translate-y-1/2 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow">
            Recommended
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
              SevaDesk Premium
            </span>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-extrabold text-white">₹99</span>
              <span className="ml-1 text-sm text-slate-300">/ month</span>
            </div>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              No ads, faster workflow, and priority operator connection.
            </p>

            <ul className="mt-6 space-y-3 text-xs text-slate-200">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>100% Ad-Free Experience with zero countdowns</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Immediate access to all affidavit & grievance templates</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Unlimited draft documents saved in account history</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Priority response badge on Cyber Café requests</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Cancel anytime with 1 click</span>
              </li>
            </ul>
          </div>

          <div className="mt-8">
            {isPremium ? (
              <div className="w-full text-center py-2.5 rounded-lg bg-emerald-900/60 text-emerald-300 font-semibold text-xs border border-emerald-700">
                ✓ Currently Active on Your Account
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition"
              >
                Upgrade to Premium for ₹99
              </button>
            )}
          </div>
        </div>
      </div>

      <RazorpayMockModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setUpgraded(true)}
      />
    </div>
  );
}
