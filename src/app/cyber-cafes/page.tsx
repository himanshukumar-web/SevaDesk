import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { INDIAN_STATES } from "@/lib/constants";
import {
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  Star,
  Search,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface CyberCafesPageProps {
  searchParams: {
    q?: string;
    state?: string;
    verifiedOnly?: string;
    availableOnly?: string;
    sort?: string;
  };
}

export const dynamic = "force-dynamic";

export default async function CyberCafesPage({ searchParams }: CyberCafesPageProps) {
  const query = searchParams.q?.trim() || "";
  const selectedState = searchParams.state || "";
  const verifiedOnly = searchParams.verifiedOnly === "true";
  const availableOnly = searchParams.availableOnly === "true";
  const sortBy = searchParams.sort || "rating";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (verifiedOnly) {
    where.verificationStatus = "VERIFIED";
  }

  if (availableOnly) {
    where.isAvailable = true;
  }

  if (selectedState) {
    where.state = selectedState;
  }

  if (query) {
    where.OR = [
      { shopName: { contains: query } },
      { city: { contains: query } },
      { district: { contains: query } },
      { pincode: { contains: query } },
      { servicesOffered: { contains: query } },
      { ownerName: { contains: query } },
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = [{ rating: "desc" }, { reviewCount: "desc" }];
  if (sortBy === "reviews") {
    orderBy = [{ reviewCount: "desc" }, { rating: "desc" }];
  } else if (sortBy === "name") {
    orderBy = [{ shopName: "asc" }];
  }

  const cafes = await prisma.cyberCafe.findMany({
    where,
    orderBy,
  });


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-medium">Cyber Café & CSC Directory</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Find Verified Local Cyber Cafés & Digital Seva Kendras
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Connect with vetted local operators for document typing, portal applications, scanning, and counter assistance.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
        <form method="GET" action="/cyber-cafes" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 relative">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Search by City, District, PIN, or Operator
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="e.g. 110001, Lucknow, Patna, Digital..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              State
            </label>
            <select
              name="state"
              defaultValue={selectedState}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">All States</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Sort By
            </label>
            <select
              name="sort"
              defaultValue={sortBy}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="rating">Highest Rating</option>
              <option value="reviews">Most Reviews</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

          <div className="flex flex-col justify-end space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="verifiedOnly"
                name="verifiedOnly"
                value="true"
                defaultChecked={verifiedOnly}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="verifiedOnly" className="text-xs text-slate-700 dark:text-slate-300">
                Verified Only
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow transition"
            >
              Apply Filter ({cafes.length} Found)
            </button>
          </div>
        </form>
      </div>


      {/* Cafes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cafes.map((cafe) => {
          let pricing = { typing: 30, assistance: 50 };
          try {
            pricing = JSON.parse(cafe.pricingJson);
          } catch {
            // fallback
          }

          const isVerified = cafe.verificationStatus === "VERIFIED";

          return (
            <div
              key={cafe.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {cafe.shopName}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 flex-shrink-0" />
                      <span>{cafe.city}, {cafe.district}, {cafe.state}</span>
                    </p>
                  </div>

                  {isVerified ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex-shrink-0">
                      Verification Pending
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 my-4 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Operating Hours:</span>
                    <span className="font-medium">{cafe.openingHours}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Citizen Rating:</span>
                    <span className="font-semibold flex items-center text-amber-600 dark:text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current mr-1" />
                      {cafe.rating.toFixed(1)} ({cafe.reviewCount} reviews)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Typing / Service:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      From ₹{pricing.typing || 30}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                  <strong>Services:</strong> {cafe.servicesOffered}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Link
                  href={`/cyber-cafes/${cafe.id}`}
                  className="text-xs font-semibold text-seva-navy-800 dark:text-seva-navy-500 hover:underline"
                >
                  View Rate Card
                </Link>

                <Link
                  href={`/cyber-cafes/${cafe.id}`}
                  className="px-4 py-2 rounded-lg bg-seva-navy-900 hover:bg-seva-navy-800 text-white text-xs font-semibold shadow transition flex items-center space-x-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Request Assistance</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
