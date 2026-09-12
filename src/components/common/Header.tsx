"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import {
  FileText,
  MapPin,
  FileEdit,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Shield,
  HelpCircle,
  CreditCard,
  Building2,
} from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardHref = () => {
    if (!user) return "/auth/login";
    if (user.role === "SUPER_ADMIN") return "/dashboard/admin";
    if (user.role === "CYBER_CAFE") return "/dashboard/cafe";
    return "/dashboard/user";
  };

  const navLinks = [
    { name: "All Services", href: "/services", icon: FileText },
    { name: "Type a Document", href: "/type-document", icon: FileEdit },
    { name: "Find Cyber Café", href: "/cyber-cafes", icon: MapPin },
    { name: "Plans & Pricing", href: "/pricing", icon: CreditCard },
    { name: "FAQ", href: "/faq", icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm transition-colors">
      {/* Tricolor Citizen Public Service Identity Strip */}
      <div className="h-1 w-full flex">
        <div className="w-1/3 bg-amber-500" />
        <div className="w-1/3 bg-white dark:bg-slate-400" />
        <div className="w-1/3 bg-emerald-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-seva-navy-900 text-white flex items-center justify-center font-bold text-xl shadow-sm border border-slate-700 group-hover:bg-seva-navy-800 transition">
              <span className="text-amber-400">S</span>
              <span className="text-white">D</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Seva<span className="text-emerald-600 dark:text-emerald-400">Desk</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Citizen Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Government Documents, Made Simple.
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-100 dark:bg-slate-800 text-seva-navy-900 dark:text-white font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400 dark:text-slate-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden sm:flex items-center space-x-3">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href={getDashboardHref()}
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-md bg-seva-navy-900 hover:bg-seva-navy-800 text-white text-sm font-medium shadow-sm transition"
                >
                  {user.role === "SUPER_ADMIN" ? (
                    <Shield className="w-4 h-4 text-amber-400" />
                  ) : user.role === "CYBER_CAFE" ? (
                    <Building2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <LayoutDashboard className="w-4 h-4 text-blue-300" />
                  )}
                  <span>
                    {user.role === "SUPER_ADMIN"
                      ? "Admin Panel"
                      : user.role === "CYBER_CAFE"
                      ? "Operator Portal"
                      : "Citizen Dashboard"}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/login"
                  className="px-3.5 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-3.5 py-2 rounded-md text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Icon className="w-5 h-5 text-slate-500" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {user ? (
              <>
                <Link
                  href={getDashboardHref()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-md bg-seva-navy-900 text-white font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 rounded-md bg-emerald-600 text-white font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
