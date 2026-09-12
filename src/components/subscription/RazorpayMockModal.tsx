"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  Building,
} from "lucide-react";

interface RazorpayMockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RazorpayMockModal({ isOpen, onClose, onSuccess }: RazorpayMockModalProps) {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"UPI" | "CARD" | "NETBANKING">("UPI");

  if (!isOpen) return null;

  const handlePay = async () => {
    if (!user) {
      router.push("/auth/login?redirect=/pricing");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/subscription/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: selectedMethod,
          razorpayPaymentId: `pay_mock_rzp_${Date.now()}`,
        }),
      });

      if (res.ok) {
        await refreshUser();
        onSuccess();
        onClose();
      } else {
        alert("Payment simulation failed.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
        {/* Razorpay Brand Bar */}
        <div className="bg-[#0c2340] text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
              R
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight">Razorpay</span>
              <span className="text-[10px] text-blue-300 block -mt-0.5">Secure Gateway (Test Mode)</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Summary */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              SevaDesk Premium (1 Month)
            </h4>
            <p className="text-xs text-slate-500">Ad-free citizen document workspace</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">₹99</span>
            <span className="text-[10px] text-slate-500 block">incl. all taxes</span>
          </div>
        </div>

        {/* Method Picker */}
        <div className="p-6 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Select Test Payment Option
          </div>

          <div className="space-y-2">
            <label
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                selectedMethod === "UPI"
                  ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <div>
                  <strong className="block text-xs text-slate-900 dark:text-white">UPI / QR Code</strong>
                  <span className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</span>
                </div>
              </div>
              <input
                type="radio"
                name="method"
                checked={selectedMethod === "UPI"}
                onChange={() => setSelectedMethod("UPI")}
                className="text-emerald-600 focus:ring-emerald-500"
              />
            </label>

            <label
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                selectedMethod === "CARD"
                  ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div>
                  <strong className="block text-xs text-slate-900 dark:text-white">Debit / Credit Card</strong>
                  <span className="text-[11px] text-slate-500">RuPay, Visa, MasterCard</span>
                </div>
              </div>
              <input
                type="radio"
                name="method"
                checked={selectedMethod === "CARD"}
                onChange={() => setSelectedMethod("CARD")}
                className="text-emerald-600 focus:ring-emerald-500"
              />
            </label>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center space-x-1.5 pt-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>256-bit Encrypted Mock Sandbox. No real money deducted.</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg transition flex items-center justify-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isProcessing ? "Simulating Payment..." : "Pay ₹99 & Activate Premium"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
