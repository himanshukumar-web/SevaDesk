"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TemplateField } from "@/types";
import { A4DocumentPreview } from "@/components/document/A4DocumentPreview";
import { MockAdModal } from "@/components/ads/MockAdModal";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Printer,
  Save,
  Send,
  Eye,
  Edit3,
  AlertCircle,
  CheckCircle2,
  Lock,
  Sparkles,
} from "lucide-react";

interface DocumentFormWizardProps {
  template: {
    id: string;
    title: string;
    description: string;
    layoutType: string;
    instructions: string;
    disclaimer: string;
    fieldsJson: string;
    sampleDataJson?: string | null;
  };
  hasUnlockedEntitlement: boolean;
  userDocument?: {
    id: string;
    title: string;
    formDataJson: string;
  } | null;
}

export function DocumentFormWizard({
  template,
  hasUnlockedEntitlement,
  userDocument,
}: DocumentFormWizardProps) {
  const { user } = useAuth();
  const router = useRouter();

  // Parse fields
  let fields: TemplateField[] = [];
  try {
    fields = JSON.parse(template.fieldsJson);
  } catch {
    fields = [];
  }

  // Parse initial values
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let initialValues: Record<string, any> = {};
  try {
    if (userDocument?.formDataJson) {
      initialValues = JSON.parse(userDocument.formDataJson);
    } else if (template.sampleDataJson) {
      initialValues = JSON.parse(template.sampleDataJson);
    }
  } catch {
    initialValues = {};
  }

  const [formValues, setFormValues] = useState(initialValues);
  const [docTitle, setDocTitle] = useState(
    userDocument?.title || `${template.title.split("(")[0].trim()} Draft`
  );
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Ad Lock State
  const isPremium = user?.subscriptions?.some((s) => s.status === "ACTIVE");
  const [isUnlocked, setIsUnlocked] = useState(hasUnlockedEntitlement || isPremium || false);
  const [showAdModal, setShowAdModal] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSaveDraft = async () => {
    if (!user) {
      router.push(`/auth/login?redirect=/type-document/${template.id}`);
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/documents/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: userDocument?.id,
          templateId: template.id,
          title: docTitle,
          formDataJson: JSON.stringify(formValues),
          status: "DRAFT",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: "success", text: "Draft saved successfully to your citizen dashboard!" });
      } else {
        setStatusMessage({ type: "error", text: data.error || "Failed to save draft." });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Network error while saving draft." });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Top Action Header */}
      <div className="no-print bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-4 sm:px-6 lg:px-8 mb-6 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                A4 Document Builder
              </span>
              <span className="text-xs text-slate-500">
                Bilingual Standard Format
              </span>
            </div>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="text-base sm:text-lg font-bold text-slate-900 dark:text-white bg-transparent border-b border-dashed border-slate-400 focus:outline-none focus:border-emerald-500 mt-1 w-full max-w-md"
              placeholder="Name your document draft..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {/* Mobile Tab Toggle */}
            <div className="flex lg:hidden rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("form")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
                  activeTab === "form" ? "bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 inline mr-1" />
                Fill Form
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
                  activeTab === "preview" ? "bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                <Eye className="w-3.5 h-3.5 inline mr-1" />
                A4 Preview
              </button>
            </div>

            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Draft"}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Status notification toast */}
        {statusMessage && (
          <div
            className={`mt-3 p-2.5 rounded-lg text-xs flex items-center space-x-2 ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                : "bg-red-50 text-red-800 dark:bg-red-950/80 dark:text-red-300"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}
      </div>

      {/* Main Dual-Pane Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT PANE: Form Fields */}
          <div
            className={`lg:col-span-6 no-print ${
              activeTab === "preview" ? "hidden lg:block" : "block"
            }`}
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {template.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {template.instructions}
                </p>
              </div>

              {/* Free Unlock Advisory if locked */}
              {!isUnlocked && !isPremium && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-3">
                  <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Free Citizen Access:</strong>
                    Watch a short 20–30 second public service announcement to unlock full typing and saving for this document.
                    <div className="mt-2 flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowAdModal(true)}
                        className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-sm transition"
                      >
                        Watch Short Ad to Unlock Free
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push("/pricing")}
                        className="px-3 py-1.5 rounded bg-seva-navy-900 hover:bg-seva-navy-800 text-white font-semibold transition"
                      >
                        Go Premium (₹99/mo)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Field Renderer */}
              <div className="space-y-4 pt-2">
                {fields.map((field) => {
                  const val = formValues[field.id] || "";

                  // Contextual guidance helper for Indian standard documents
                  const getFieldHelp = (fieldId: string, label: string): string | null => {
                    const l = label.toLowerCase();
                    if (l.includes("aadhaar")) return "Enter 12-digit Aadhaar number as printed on your UIDAI card. Do not include spaces or hyphens.";
                    if (l.includes("pan")) return "Enter 10-character alphanumeric PAN (e.g. ABCDE1234F). Must match NSDL / UTI records.";
                    if (l.includes("income")) return "Enter total annual family income from all sources (agriculture, salary, business) as per Patwari / Tehsildar inquiry.";
                    if (l.includes("father") || l.includes("guardian")) return "Enter full name without abbreviations as recorded in 10th marksheet or Aadhaar.";
                    if (l.includes("pincode") || l.includes("pin")) return "Enter 6-digit postal index number of your permanent residence.";
                    if (l.includes("caste") || l.includes("category")) return "State your sub-caste and category (SC/ST/OBC/General) as recognized by State Gazette.";
                    if (l.includes("district") || l.includes("tehsil")) return "Specify your jurisdictional Revenue Sub-Division or Tehsil for gazetted verification.";
                    return null;
                  };

                  const fieldHelp = getFieldHelp(field.id, field.label);

                  return (
                    <div key={field.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {fieldHelp && (
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                            Guidance available
                          </span>
                        )}
                      </div>

                      {fieldHelp && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 px-2 py-1 rounded border border-slate-100 dark:border-slate-800">
                          ℹ️ {fieldHelp}
                        </p>
                      )}


                      {field.type === "textarea" ? (
                        <textarea
                          rows={4}
                          value={val}
                          disabled={!isUnlocked && !isPremium}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                        />
                      ) : field.type === "dropdown" ? (
                        <select
                          value={val}
                          disabled={!isUnlocked && !isPremium}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                        >
                          <option value="">-- Select Option --</option>
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : field.type === "radio" ? (
                        <div className="flex flex-wrap gap-4 pt-1">
                          {field.options?.map((opt) => (
                            <label key={opt} className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                              <input
                                type="radio"
                                name={field.id}
                                value={opt}
                                checked={val === opt}
                                disabled={!isUnlocked && !isPremium}
                                onChange={() => handleFieldChange(field.id, opt)}
                                className="text-emerald-600 focus:ring-emerald-500"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : field.type === "checkbox" ? (
                        <label className="flex items-start space-x-2 pt-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!val}
                            disabled={!isUnlocked && !isPremium}
                            onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                            className="mt-1 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {field.label}
                          </span>
                        </label>
                      ) : (
                        <input
                          type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                          value={val}
                          disabled={!isUnlocked && !isPremium}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Guidance */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-2">
                <p>
                  <strong>Tip:</strong> You can print this application or take it on your phone to any verified local Cyber Café for online portal upload.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT PANE: Live A4 Preview */}
          <div
            className={`lg:col-span-6 print:w-full ${
              activeTab === "form" ? "hidden lg:block" : "block"
            }`}
          >
            <div className="sticky top-32">
              <div className="no-print flex items-center justify-between mb-3 text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-slate-400">
                  Live A4 Document Preview
                </span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  Auto-syncing as you type
                </span>
              </div>

              <A4DocumentPreview
                templateTitle={template.title}
                layoutType={template.layoutType}
                fields={fields}
                values={formValues}
                disclaimer={template.disclaimer}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ad Unlock Modal for free users */}
      <MockAdModal
        isOpen={showAdModal}
        serviceId={template.id}
        onClose={() => setShowAdModal(false)}
        onUnlocked={() => {
          setIsUnlocked(true);
          setShowAdModal(false);
        }}
      />
    </div>
  );
}
