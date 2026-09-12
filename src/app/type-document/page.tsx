import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { FileEdit, FileText, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TypeDocumentIndexPage() {
  const templates = await prisma.documentTemplate.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-medium">Document Typing Center</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Citizen Document & Application Form Builder
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl">
          Choose a standardized bilingual template below to prepare formal citizen applications, sworn affidavits, and representation letters.
        </p>
      </div>

      {/* Trust Reminder */}
      <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl p-4 mb-8 flex items-start space-x-3 text-xs sm:text-sm text-blue-900 dark:text-blue-200">
        <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Legal Transparency:</strong> Documents prepared on SevaDesk are standardized citizen-prepared draft applications and declarations. They adhere to official formatting standards and must be submitted to the competent authority (Tehsildar/SDM/RTO/Court) or uploaded on the respective official state portal.
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {tpl.category}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  A4 Printable Layout
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {tpl.title}
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                {tpl.description}
              </p>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg text-xs text-slate-600 dark:text-slate-300 mb-6">
                <strong>Instructions:</strong> {tpl.instructions}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Format: {tpl.layoutType.replace("_", " ").toUpperCase()}
              </span>
              <Link
                href={`/type-document/${tpl.id}`}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow flex items-center space-x-1.5 transition"
              >
                <span>Type Document Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
