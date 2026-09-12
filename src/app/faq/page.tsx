import React from "react";
import Link from "next/link";
import { HelpCircle, ChevronRight, ShieldCheck, PhoneCall } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      q: "What is SevaDesk?",
      a: "SevaDesk is an independent digital public information and application preparation platform. We help Indian citizens understand what documents they need for government services, type standard A4 application drafts, and connect with verified local Cyber Café operators.",
    },
    {
      q: "Is SevaDesk an official government portal?",
      a: "No. SevaDesk is NOT a government website and is not affiliated with UIDAI, the Income Tax Department, the Election Commission, or any State/Central Government ministry. We provide informational guidance and draft preparation tools.",
    },
    {
      q: "How does free access work?",
      a: "Citizens can browse all service checklists for free. When typing or saving certain application templates, you watch a short 20–30 second public literacy advertisement to unlock full access for free.",
    },
    {
      q: "What benefits does the ₹99/month Premium plan offer?",
      a: "Premium provides a 100% ad-free experience with zero countdowns, immediate access to all affidavit & grievance templates, unlimited saved drafts, and priority operator connection.",
    },
    {
      q: "How do Cyber Café operators earn on the platform?",
      a: "Cyber Cafés register on SevaDesk, publish their service rate cards (e.g. ₹30 for typing, ₹5 for printing), and receive direct assistance requests from citizens who need help with scanning, printing, or submitting applications.",
    },
    {
      q: "Are documents generated on SevaDesk official government certificates?",
      a: "No. The documents generated are citizen-prepared draft applications and affidavits. They must be submitted to the competent revenue authority (such as the Tehsildar, SDM, or RTO) or uploaded to the official state e-District portal.",
    },
    {
      q: "How is my personal data protected?",
      a: "We follow strict privacy standards. Your document drafts are stored securely and are never shared with any Cyber Café unless you explicitly initiate a service request and grant authorization.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Knowledge Base
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Everything you need to know about SevaDesk services, fees, and operator verification.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm"
          >
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-start">
              <span className="text-emerald-600 dark:text-emerald-400 mr-2 font-mono font-bold">Q{idx + 1}.</span>
              <span>{faq.q}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 pl-6 leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-center space-y-3">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Have a question not listed here?
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Our citizen support desk is available Monday to Saturday to help you navigate your service requests.
        </p>
        <Link
          href="/contact"
          className="inline-block px-5 py-2.5 rounded-lg bg-seva-navy-900 text-white font-semibold text-xs transition"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
