"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  X,
  Send,
  FileText,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface RequestAssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  cyberCafe: {
    id: string;
    shopName: string;
    city: string;
  };
  userDocuments: Array<{
    id: string;
    title: string;
    createdAt: string | Date;
  }>;
}

export function RequestAssistanceModal({
  isOpen,
  onClose,
  cyberCafe,
  userDocuments,
}: RequestAssistanceModalProps) {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [selectedDocId, setSelectedDocId] = useState("");
  const [description, setDescription] = useState("");
  const [hasConsent, setHasConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(`/auth/login?redirect=/cyber-cafes/${cyberCafe.id}`);
      return;
    }

    if (!title.trim() || !description.trim()) {
      setErrorMessage("Please fill in the title and description.");
      return;
    }

    if (!hasConsent) {
      setErrorMessage("You must give explicit consent to share details with this Cyber Café.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/requests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cyberCafeId: cyberCafe.id,
          userDocumentId: selectedDocId || null,
          title: title.trim(),
          description: description.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onClose();
        router.push(`/chat/${data.requestId}`);
      } else {
        setErrorMessage(data.error || "Failed to create service request.");
      }
    } catch {
      setErrorMessage("Network error while submitting request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Request Service Assistance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Connecting with {cyberCafe.shopName} ({cyberCafe.city})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Service / Request Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Help uploading Income Certificate to UP eDistrict"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Attach Prepared Document Draft (Optional)
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">-- None (General Service Consultation) --</option>
              {userDocuments.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.title}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Selecting a document lets the operator inspect your draft data directly.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Instructions for the Operator *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what help you need (e.g. scanning proofs, online fee payment, photo resizing, printout pickup)..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Explicit Privacy Consent as mandated by guidelines */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={hasConsent}
                onChange={(e) => setHasConsent(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Citizen Privacy Consent:</strong> I authorize SevaDesk to share this request and any selected document draft exclusively with <strong>{cyberCafe.shopName}</strong> for the sole purpose of service assistance.
              </span>
            </label>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow transition flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Sending Request..." : "Send Request & Open Chat"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
