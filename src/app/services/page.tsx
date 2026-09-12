import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { INDIAN_STATES } from "@/lib/constants";
import { Search, Filter, Clock, ArrowRight, FileText, CheckCircle2 } from "lucide-react";

interface ServicesPageProps {
  searchParams: {
    q?: string;
    cat?: string;
    state?: string;
  };
}

export const dynamic = "force-dynamic";

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const query = searchParams.q?.trim() || "";
  const categorySlug = searchParams.cat || "";
  const selectedState = searchParams.state || "";

  // Query categories
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
  });

  // Build service where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    isPublished: true,
  };

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (query) {
    where.OR = [
      { title: { contains: query } },
      { shortDesc: { contains: query } },
      { whatIsIt: { contains: query } },
      { eligibility: { contains: query } },
    ];
  }

  const services = await prisma.service.findMany({
    where,
    include: {
      category: true,
      template: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb & Title */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-medium">Government Services Directory</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Government Services & Documents Directory
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Search requirements, eligibility, required proofs, official fees, and verified procedures for central and state public services.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
        <form method="GET" action="/services" className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="md:col-span-2 relative">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Search Document / Service
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="e.g. Income certificate, Caste, Driving licence..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Category
            </label>
            <select
              name="cat"
              defaultValue={categorySlug}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* State Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              State / Union Territory
            </label>
            <select
              name="state"
              defaultValue={selectedState}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">All India (National & States)</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Action Buttons */}
          <div className="md:col-span-4 flex items-center justify-end space-x-3 pt-2">
            <Link
              href="/services"
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Clear Filters
            </Link>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
            >
              Apply Filter
            </button>
          </div>
        </form>
      </div>

      {/* Services Results Grid */}
      {services.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No exact result found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Try searching for another document or service, or clear the category filters to browse all available citizen guides.
          </p>
          <div className="mt-6">
            <Link
              href="/services"
              className="px-5 py-2.5 rounded-lg bg-seva-navy-900 hover:bg-seva-navy-800 text-white text-xs font-semibold transition"
            >
              View All Services
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {svc.category.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{svc.processingTime.split("(")[0]}</span>
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  <Link href={`/services/${svc.slug}`} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                    {svc.title}
                  </Link>
                </h2>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                  {svc.shortDesc}
                </p>

                {/* Requirements Snapshot */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg text-xs space-y-1.5 mb-4 border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Official Portal Fee:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {svc.officialFees.split("(")[0]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Issuing Department:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[170px]">
                      {svc.whereToApply.split(",")[0]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Link
                  href={`/services/${svc.slug}`}
                  className="text-xs font-semibold text-seva-navy-800 dark:text-seva-navy-500 hover:underline flex items-center"
                >
                  Full Checklist <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>

                {svc.templateId && (
                  <Link
                    href={`/type-document/${svc.templateId}`}
                    className="px-3 py-1.5 rounded text-xs font-medium bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition"
                  >
                    Type Draft Application
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
