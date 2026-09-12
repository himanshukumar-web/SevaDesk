import React from "react";
import Link from "next/link";
import { AlertTriangle, FileCheck, ShieldAlert } from "lucide-react";
import { OFFICIAL_DISCLAIMER } from "@/lib/constants";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          User Agreement
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Terms of Service & Citizen Representation Guidelines
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Last Updated: September 2026
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 p-4 rounded-r-xl text-xs text-amber-900 dark:text-amber-200">
        <strong>Mandatory Advisory:</strong> {OFFICIAL_DISCLAIMER}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            1. Platform Nature: Independent Facilitation
          </h2>
          <p>
            SevaDesk is an independent technology platform providing digital document drafting tools, information guides, and directory access to local Cyber Cafés. SevaDesk does not issue government certificates, licenses, or authorizations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            2. Prohibition of Fake Certificates
          </h2>
          <p>
            Users and Cyber Café operators are strictly prohibited from utilizing the platform to forge government stamps, seals, or misrepresent citizen-prepared drafts as official government-issued certificates. Any fraudulent use will result in immediate permanent suspension and referral to law enforcement.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            3. Distinct Fee Structure
          </h2>
          <p>
            Users acknowledge that:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Official Statutory Fees:</strong> Determined by State/Central government laws and payable only to government treasuries/portals.</li>
            <li><strong>Cyber Café Service Fees:</strong> Private charges for computer typing, scanning, printing, and counter assistance agreed upon with the operator.</li>
            <li><strong>SevaDesk Subscription:</strong> ₹99/month convenience fee for ad-free experience and template access.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
