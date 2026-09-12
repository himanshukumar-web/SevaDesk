"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { ShieldCheck, AlertCircle, ArrowRight, Lock, Mail } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") || "";
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        await refreshUser();
        if (redirect) {
          router.push(redirect);
        } else if (data.user.role === "SUPER_ADMIN") {
          router.push("/dashboard/admin");
        } else if (data.user.role === "CYBER_CAFE") {
          router.push("/dashboard/cafe");
        } else {
          router.push("/dashboard/user");
        }
        router.refresh();
      } else {
        setError(data.error || "Login failed. Please check credentials.");
      }
    } catch {
      setError("Network connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = (type: "user" | "cafe" | "admin") => {
    if (type === "user") {
      setEmail("user@sevadesk.in");
      setPassword("User@123456");
    } else if (type === "cafe") {
      setEmail("operator@delhicyber.in");
      setPassword("Cafe@123456");
    } else {
      setEmail("admin@sevadesk.in");
      setPassword("Admin@123456");
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-xl bg-seva-navy-900 text-white items-center justify-center font-bold text-xl shadow mb-3">
            <span className="text-amber-400">S</span>
            <span>D</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Log in to SevaDesk
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Access your government documents, draft applications, and messages
          </p>
        </div>

        {/* Demo login shortcuts */}
        <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs space-y-1.5 border border-slate-200 dark:border-slate-700">
          <div className="text-slate-500 font-semibold flex items-center justify-between">
            <span>Quick Demo Accounts:</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400">1-Click Fill</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleDemoFill("user")}
              className="px-2 py-1 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium hover:border-emerald-500 border border-slate-200 dark:border-slate-600 transition"
            >
              Citizen
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill("cafe")}
              className="px-2 py-1 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium hover:border-emerald-500 border border-slate-200 dark:border-slate-600 transition"
            >
              Cyber Café
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill("admin")}
              className="px-2 py-1 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium hover:border-emerald-500 border border-slate-200 dark:border-slate-600 transition"
            >
              Admin
            </button>
          </div>
        </div>

        <div className="mt-4 bg-white dark:bg-slate-900 py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-slate-200 dark:border-slate-800">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-seva-navy-900 hover:bg-seva-navy-800 text-white font-semibold text-xs shadow flex items-center justify-center space-x-1.5 transition disabled:opacity-50"
            >
              <span>{isLoading ? "Signing in..." : "Sign In to SevaDesk"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
            <span className="text-slate-500">New citizen or Cyber Café?</span>{" "}
            <Link
              href="/auth/signup"
              className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-slate-500">Loading Login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
