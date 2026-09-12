import React from "react";
import Link from "next/link";
import { AlertCircle, ShieldCheck, HeartHandshake, PhoneCall } from "lucide-react";
import { OFFICIAL_DISCLAIMER } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      {/* Disclaimer Banner Required by Guidelines */}
      <div className="bg-amber-950/40 border-b border-amber-800/60 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-start space-x-3 text-amber-200 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-semibold text-amber-300">Statutory Disclaimer:</strong> {OFFICIAL_DISCLAIMER}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-white text-slate-900 flex items-center justify-center font-bold text-sm">
                SD
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Seva<span className="text-emerald-400">Desk</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering citizens across Bharat with transparent government service guides, standardized document typing, and verified local Cyber Café assistance.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 p-2.5 rounded">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>User documents remain strictly private unless explicitly shared with a Cyber Café.</span>
            </div>
          </div>

          {/* Citizen Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Government Guides
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services/income-certificate" className="hover:text-white transition">
                  Income Certificate (आय प्रमाण पत्र)
                </Link>
              </li>
              <li>
                <Link href="/services/domicile-certificate" className="hover:text-white transition">
                  Domicile / Residence Certificate
                </Link>
              </li>
              <li>
                <Link href="/services/pan-card-services" className="hover:text-white transition">
                  PAN Card Application & Correction
                </Link>
              </li>
              <li>
                <Link href="/services/aadhaar-services" className="hover:text-white transition">
                  Aadhaar Update Procedures
                </Link>
              </li>
              <li>
                <Link href="/services/driving-licence" className="hover:text-white transition">
                  Driving Licence (Sarathi Parivahan)
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-emerald-400 hover:text-emerald-300 font-medium transition">
                  View All 15+ Services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Cyber Café Operators */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              For Cyber Cafés & CSCs
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/cyber-cafes" className="hover:text-white transition">
                  Find Verified Operators
                </Link>
              </li>
              <li>
                <Link href="/auth/signup?role=CYBER_CAFE" className="hover:text-white transition">
                  Register Your Cyber Café
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition">
                  Free vs Premium Usage
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  Operator Guidelines & Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Help */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy & Data Security
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refunds" className="hover:text-white transition">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Citizen Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SevaDesk Platform. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="flex items-center space-x-1">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
              <span>Dedicated to Indian Digital Inclusion</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>National Citizen Facilitation</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
