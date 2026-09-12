import React from "react";
import Link from "next/link";
import { HelpCircle } from "lucide-react";

export default function RefundsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Refund & Cancellation Policy
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          For SevaDesk Premium Subscriptions (₹99/month)
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <p>
          We want you to be completely satisfied with your SevaDesk experience. If you subscribed to SevaDesk Premium (₹99/month) and encountered technical issues accessing document templates or ad-free services:
        </p>

        <h3 className="font-bold text-slate-900 dark:text-white pt-2">
          7-Day Money Back Guarantee
        </h3>
        <p className="text-xs">
          You may request a full refund within 7 days of subscription activation by writing to <strong>support@sevadesk.in</strong> with your registered email address and payment reference ID.
        </p>

        <h3 className="font-bold text-slate-900 dark:text-white pt-2">
          Cyber Café Operator Transactions
        </h3>
        <p className="text-xs">
          Please note that payments for printing, scanning, or physical typing services paid directly to local Cyber Café operators are private transactions between the citizen and the operator and are governed by the operator&apos;s shop policy.
        </p>
      </div>
    </div>
  );
}
