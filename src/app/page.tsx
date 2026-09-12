import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  Search,
  FileCheck,
  FileText,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Award,
  ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let categories: any[] = [];
  let popularServices: any[] = [];
  let verifiedCafes: any[] = [];

  try {
    const results = await Promise.all([
      prisma.category.findMany({
        orderBy: { displayOrder: "asc" },
        include: {
          _count: { select: { services: true } },
        },
      }),
      prisma.service.findMany({
        where: { isPublished: true },
        take: 6,
        include: {
          category: true,
        },
      }),
      prisma.cyberCafe.findMany({
        where: { verificationStatus: "VERIFIED" },
        take: 3,
        orderBy: { rating: "desc" },
      }),
    ]);
    categories = results[0];
    popularServices = results[1];
    verifiedCafes = results[2];
  } catch {
    // Graceful fallback if database is not reachable
  }

  const quickSearchTags = [
    "Income Certificate",
    "Caste Certificate",
    "PAN Card",
    "Domicile",
    "Driving Licence",
    "Aadhaar Update",
    "PM-Kisan",
    "Ration Card",
  ];

  return (
    <div className="flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-seva-navy-950 via-seva-navy-900 to-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-amber-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Independent Citizen Facilitation & Document Preparation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Government Documents, <br className="hidden sm:inline" />
            <span className="text-emerald-400">Made Simple.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-300 leading-relaxed font-normal">
            Find the right document, understand the process, prepare your application, and get help from a verified local service provider.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto pt-4">
            <form action="/services" method="GET" className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                name="q"
                placeholder="Search documents: e.g. Income certificate, Caste, PAN, Domicile..."
                className="w-full pl-12 pr-32 py-4 rounded-xl text-slate-900 dark:text-white bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:outline-none focus:border-emerald-500 shadow-lg text-base"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow transition"
              >
                Search
              </button>
            </form>

            {/* Quick search tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs">
              <span className="text-slate-400">Popular:</span>
              {quickSearchTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/services?q=${encodeURIComponent(tag)}`}
                  className="px-2.5 py-1 rounded-md bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/services"
              className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>Find a Document</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/cyber-cafes"
              className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-base border border-slate-600 transition flex items-center justify-center space-x-2"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Find a Cyber Café</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (4 Clear Steps) */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Simple 4-Step Process
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              How SevaDesk Works
            </p>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Clear government service guidance without the bureaucratic confusion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-xl border border-slate-200 dark:border-slate-700 relative">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Find Your Service
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Search through our directory of state & central services to find exactly which certificate or document fits your need.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-xl border border-slate-200 dark:border-slate-700 relative">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Understand Requirements
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Review eligibility, required identity proofs, statutory government fees, and step-by-step application flows before applying.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-xl border border-slate-200 dark:border-slate-700 relative">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Type Your Document
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Fill standardized bilingual application templates, preview the clean A4 layout, and print or download your draft PDF.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-xl border border-slate-200 dark:border-slate-700 relative">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-lg mb-4">
                4
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Get Help if Needed
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Connect with verified local Cyber Café operators for scanning, online portal upload, or counter submission assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR SERVICES DIRECTORY PREVIEW */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Official Guidance
              </h2>
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Frequently Needed Government Services
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Know what you need before you apply. Verified requirements & processes.
              </p>
            </div>
            <Link
              href="/services"
              className="mt-4 sm:mt-0 inline-flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Browse all services <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularServices.map((svc) => (
              <div
                key={svc.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                      {svc.category.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{svc.processingTime.split("(")[0]}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
                    {svc.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                    {svc.shortDesc}
                  </p>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg text-xs space-y-1 mb-4 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Official Govt Fee:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {svc.officialFees.split("(")[0]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Authority:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
                        {svc.whereToApply.split(",")[0]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <Link
                    href={`/services/${svc.slug}`}
                    className="text-xs font-semibold text-seva-navy-800 dark:text-seva-navy-500 hover:underline flex items-center"
                  >
                    View Checklist <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>

                  {svc.templateId && (
                    <Link
                      href={`/type-document/${svc.templateId}`}
                      className="px-3 py-1.5 rounded text-xs font-medium bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition"
                    >
                      Type Draft Form
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY USE SEVADESK (Anti-Fraud & Transparency) */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Trust & Transparency
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Why Citizens Rely on SevaDesk
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                No Hidden Agent Scams
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                We clearly separate statutory government portal fees from private service provider assistance charges. No unexpected inflated commissions.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Clean Standardized Applications
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Type clean, legally structured drafts and affidavits. Format previewed in standard A4 sheet ready for printing or Tehsildar submission.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Verified Cyber Café Network
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Connect only with admin-verified local CSC and Cyber Café operators with visible rate cards, operating hours, and genuine customer ratings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED SERVICE PROVIDERS DIRECTORY */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Local Assistance
              </h2>
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Verified Cyber Café Operators
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Need physical printing, scanning, or portal submission help? Connect with nearby trusted centres.
              </p>
            </div>
            <Link
              href="/cyber-cafes"
              className="mt-4 sm:mt-0 inline-flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Browse all Cyber Cafés <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {verifiedCafes.map((cafe) => (
              <div
                key={cafe.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {cafe.shopName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {cafe.city}, {cafe.district}, {cafe.state}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                    Verified
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 mb-4">
                  <p>
                    <strong className="text-slate-700 dark:text-slate-200">Timings:</strong> {cafe.openingHours}
                  </p>
                  <p className="line-clamp-1">
                    <strong className="text-slate-700 dark:text-slate-200">Services:</strong> {cafe.servicesOffered}
                  </p>
                  <p>
                    <strong className="text-slate-700 dark:text-slate-200">Rating:</strong> ★ {cafe.rating} ({cafe.reviewCount} citizen reviews)
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Typing from ₹30
                  </span>
                  <Link
                    href={`/cyber-cafes/${cafe.id}`}
                    className="px-3 py-1.5 rounded text-xs font-semibold bg-seva-navy-900 hover:bg-seva-navy-800 text-white transition"
                  >
                    View & Contact
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FREE VS PREMIUM SECTION */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Fair & Transparent Pricing
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Choose the Plan That Fits You
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Free forever with ad-supported unlock, or upgrade to Premium for seamless high-speed access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  Citizen Free
                </span>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">₹0</span>
                  <span className="ml-1 text-sm text-slate-500">/ forever</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Supported by short 20-30s informational ads before typing unlock.
                </p>

                <ul className="mt-6 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Access all 15+ government service guides</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Basic document templates with Ad-Unlock</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>A4 live preview and printable draft</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Find & chat with verified Cyber Cafés</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href="/services"
                  className="w-full block text-center py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition text-sm"
                >
                  Start for Free
                </Link>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-b from-seva-navy-950 to-seva-navy-900 text-white p-8 rounded-2xl border-2 border-emerald-500 relative shadow-xl flex flex-col justify-between">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow">
                Most Popular
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                  SevaDesk Premium
                </span>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-white">₹99</span>
                  <span className="ml-1 text-sm text-slate-300">/ month</span>
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  Zero ads, instant document generation, and priority assistance.
                </p>

                <ul className="mt-6 space-y-3 text-sm text-slate-200">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>100% Ad-free experience with zero countdowns</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Instant access to all affidavit & letter templates</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Unlimited document drafts saved in your history</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Priority operator response & direct PDF exports</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href="/pricing"
                  className="w-full block text-center py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg transition text-sm"
                >
                  Upgrade to Premium (₹99/mo)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Citizen FAQs
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Is SevaDesk an official government portal?
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No. SevaDesk is an independent public information and document preparation facilitation platform. We are not affiliated with the Government of India or any state department. We assist citizens in understanding requirements, drafting standard applications, and finding verified Cyber Cafés.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Does SevaDesk issue official certificates directly?
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No. Official certificates (such as Income, Caste, Domicile, or Driving Licences) are issued solely by authorized government officers (SDM, Tehsildar, RTO) or official state citizen portals. SevaDesk generates standardized citizen-prepared draft applications and affidavits that you can submit to the authorities or upload via a Cyber Café.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                How does the Free vs Premium model work?
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Free citizens can access all service checklists and type basic applications by watching a short 20–30 second informational advertisement before unlocking the template. Premium users paying ₹99/month bypass all ads and gain unlimited draft saves and priority assistance.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                How do Cyber Café operators charge for their services?
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Cyber Cafés set their own service rate cards (e.g. ₹30 for document typing, ₹5 for printing, ₹50 for online application assistance). These fees are completely separate from statutory government fees and are clearly published on the operator&apos;s verified profile card.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SAFETY & DATA PRIVACY BANNER */}
      <section className="py-12 bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <ShieldCheck className="w-10 h-10 text-emerald-300 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-white">
                Your Personal Information is Strictly Private
              </h3>
              <p className="text-sm text-emerald-100 max-w-2xl mt-1 leading-relaxed">
                SevaDesk enforces strict role-based access control. Draft documents and personal identity numbers are encrypted and never shared with any Cyber Café unless you explicitly initiate an assistance request.
              </p>
            </div>
          </div>
          <Link
            href="/privacy"
            className="px-6 py-2.5 rounded-lg bg-white text-emerald-950 font-bold text-sm shadow hover:bg-emerald-50 transition flex-shrink-0"
          >
            Read Privacy Standards
          </Link>
        </div>
      </section>
    </div>
  );
}
