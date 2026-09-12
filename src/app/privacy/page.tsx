import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, EyeOff, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Trust & Confidentiality
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Privacy Policy & Citizen Data Protection
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Effective Date: September 2026 • Digital Personal Data Protection (DPDP) Standard Compliance
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>1. Our Core Privacy Commitment</span>
          </h2>
          <p>
            Government documents often contain sensitive personal identifiers, family income details, and domicile records. At SevaDesk, your personal data belongs strictly to you. We do not sell, broker, or monetize citizen demographic information.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <EyeOff className="w-5 h-5 text-blue-600" />
            <span>2. Private Document Storage & Operator Isolation</span>
          </h2>
          <p>
            When you type draft applications on SevaDesk:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Your drafts are encrypted and accessible only through your authenticated account.</li>
            <li>Cyber Café operators cannot view or browse your documents in any global directory.</li>
            <li>A Cyber Café can only view a specific document if you explicitly attach it to an assistance request with affirmative consent.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Lock className="w-5 h-5 text-amber-600" />
            <span>3. Passwords & Payment Security</span>
          </h2>
          <p>
            All passwords are cryptographically hashed using industry-standard bcrypt algorithms. Passwords are never stored in plain text. Premium payments are handled via certified payment gateways; raw debit/credit card numbers are never stored on SevaDesk servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <span>4. Right to Erasure & Deletion</span>
          </h2>
          <p>
            Citizens retain full rights under the Digital Personal Data Protection Act to delete any saved document drafts or close their account at any time from their dashboard.
          </p>
        </section>
      </div>
    </div>
  );
}
