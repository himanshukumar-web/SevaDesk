import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ExternalLink,
  MapPin,
  FileEdit,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

interface ServiceDetailProps {
  params: {
    slug: string;
  };
}

export const dynamic = "force-dynamic";

export default async function ServiceDetailPage({ params }: ServiceDetailProps) {
  const service = await prisma.service.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      template: true,
    },
  });

  if (!service || !service.isPublished) {
    notFound();
  }

  // Parse JSON fields
  let requiredDocs: string[] = [];
  try {
    requiredDocs = JSON.parse(service.requiredDocsJson);
  } catch {
    requiredDocs = [];
  }

  let steps: string[] = [];
  try {
    steps = JSON.parse(service.stepsJson);
  } catch {
    steps = [];
  }

  let stateSpecificNotes: Record<string, string> = {};
  try {
    if (service.stateSpecificNotesJson) {
      stateSpecificNotes = JSON.parse(service.stateSpecificNotesJson);
    }
  } catch {
    stateSpecificNotes = {};
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-500 mb-4">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/services" className="hover:underline">Services</Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">{service.title}</span>
      </div>

      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            {service.category.name}
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            Verified Procedure
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {service.title}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {service.shortDesc}
        </p>

        {/* Action Buttons */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4">
          {service.templateId ? (
            <Link
              href={`/type-document/${service.templateId}`}
              className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow flex items-center space-x-2 transition"
            >
              <FileEdit className="w-4 h-4" />
              <span>Type Application Form (Draft)</span>
            </Link>
          ) : null}

          <Link
            href={`/cyber-cafes?service=${service.slug}`}
            className="px-6 py-3 rounded-lg bg-seva-navy-900 hover:bg-seva-navy-800 text-white font-semibold text-sm shadow flex items-center space-x-2 transition"
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Find Verified Cyber Café Operator</span>
          </Link>

          <a
            href={service.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm flex items-center space-x-2 transition"
          >
            <span>Official Portal</span>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>
        </div>
      </div>

      {/* QUICK SUMMARY BOX */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-6 border border-slate-200 dark:border-slate-800 mb-10">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Quick Service Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div>
            <span className="text-xs text-slate-500 block">Statutory Official Fee</span>
            <strong className="text-slate-900 dark:text-white font-semibold mt-1 block">
              {service.officialFees}
            </strong>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Expected Processing Duration</span>
            <strong className="text-slate-900 dark:text-white font-semibold mt-1 block">
              {service.processingTime}
            </strong>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Issuing Authority / Portal</span>
            <strong className="text-slate-900 dark:text-white font-semibold mt-1 block">
              {service.whereToApply}
            </strong>
          </div>
        </div>
      </div>

      {/* DETAILED CONTENT SECTIONS */}
      <div className="space-y-8">
        {/* Section 1: What is it and who needs it */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            1. Purpose & Beneficiary Eligibility
          </h2>
          <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">What is this document used for?</h3>
              <p>{service.whatIsIt}</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Who needs it?</h3>
              <p>{service.whoNeedsIt}</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Eligibility Criteria</h3>
              <p>{service.eligibility}</p>
            </div>
          </div>
        </div>

        {/* Section 2: Required Documents */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            2. Required Documents & Identity Proofs
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Ensure clear photocopies and original documents are available before visiting your Cyber Café or submitting online.
          </p>

          <ul className="space-y-3">
            {requiredDocs.map((doc, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 3: Step-by-Step Application Process */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            3. Step-by-Step Application Process
          </h2>

          <div className="space-y-6">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-seva-navy-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="text-sm text-slate-700 dark:text-slate-300 pt-1 leading-relaxed">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: State-Specific Information */}
        {Object.keys(stateSpecificNotes).length > 0 && (
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                4. State-Specific Rules & Portals
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Information and portal links for prominent states. Click your state to review local validity rules:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(stateSpecificNotes).map(([stName, note]) => (
                <div
                  key={stName}
                  className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                >
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                    {stName}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Mandatory Statutory Warning */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 p-6 rounded-r-xl">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Important Official Advisory
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                Information may vary by state/district. Verify on the official government portal before proceeding.
                Do not pay unauthorized persons claiming guaranteed document issuance. All certificates are subject to revenue verification under state laws.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
