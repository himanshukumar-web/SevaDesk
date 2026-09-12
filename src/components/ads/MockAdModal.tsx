"use client";

import React, { useState, useEffect } from "react";
import { X, Volume2, Shield, CheckCircle2, Play, Sparkles } from "lucide-react";

interface MockAdModalProps {
  isOpen: boolean;
  serviceId: string;
  onClose: () => void;
  onUnlocked: () => void;
}

export function MockAdModal({ isOpen, serviceId, onClose, onUnlocked }: MockAdModalProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(20);
  const [canSkip, setCanSkip] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    if (!isOpen) {
      setSecondsRemaining(20);
      setCanSkip(false);
      setIsVerifying(false);
      return;
    }

    // Initialize session
    fetch("/api/ads/create-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.session) setSessionId(data.session.sessionId);
      })
      .catch((err) => console.error("Session init failed:", err));

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        if (prev <= 15) {
          setCanSkip(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, serviceId]);

  const handleCompleteUnlock = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch("/api/ads/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId || "ad_sess_demo_fallback",
          clientToken: `demo_proof_${Date.now()}`,
          serviceId,
        }),
      });

      if (res.ok) {
        onUnlocked();
        onClose();
      } else {
        alert("Verification failed. Please try again.");
      }
    } catch {
      alert("Network error during ad verification.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isOpen) return null;

  const progressPercent = ((20 - secondsRemaining) / 20) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
        {/* Banner Label as instructed */}
        <div className="bg-slate-800 text-slate-300 px-4 py-2 text-xs flex items-center justify-between border-b border-slate-700">
          <span className="flex items-center space-x-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AdProvider Abstraction (Demo Ad Network Simulation)</span>
          </span>
          <span className="text-amber-400 font-semibold">Reward Unlock</span>
        </div>

        {/* Ad Video Simulator Display */}
        <div className="relative bg-slate-950 p-8 text-center text-white aspect-video flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
            <Play className="w-8 h-8 fill-current" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Digital India Public Literacy Initiative
          </span>
          <h3 className="text-lg font-bold mt-1 text-slate-100">
            Always Verify Certificate Portals on Official .gov.in Domains
          </h3>
          <p className="text-xs text-slate-400 mt-2 max-w-sm">
            Sponsored Public Awareness Message: Protect yourself from fraudulent agents. Official state applications always bear a valid QR code and application reference number.
          </p>

          {/* Countdown timer badge */}
          <div className="absolute top-3 left-3 bg-black/70 px-2.5 py-1 rounded text-xs font-mono text-amber-300">
            Ad: {secondsRemaining}s remaining
          </div>

          <div className="absolute top-3 right-3 text-slate-400">
            <Volume2 className="w-4 h-4" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5">
          <div
            className="bg-emerald-500 h-1.5 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Watch 20 seconds to unlock document typing for free.
          </p>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
            >
              Cancel
            </button>

            {secondsRemaining === 0 ? (
              <button
                type="button"
                onClick={handleCompleteUnlock}
                disabled={isVerifying}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow transition flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isVerifying ? "Verifying..." : "Continue to Document"}</span>
              </button>
            ) : canSkip ? (
              <button
                type="button"
                onClick={handleCompleteUnlock}
                disabled={isVerifying}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition"
              >
                Skip Ad ({secondsRemaining}s)
              </button>
            ) : (
              <span className="text-xs font-semibold text-slate-400">
                Reward in {secondsRemaining}s
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
