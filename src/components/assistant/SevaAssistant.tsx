"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  HelpCircle,
  X,
  Send,
  Building2,
  FileCheck2,
  ExternalLink,
  Bot,
  ChevronDown,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  action?: {
    label: string;
    url: string;
  };
  sources?: string[];
  timestamp: string;
}

export function SevaAssistant({
  currentServiceSlug,
}: {
  currentServiceSlug?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Namaste! I am your **SevaDesk Sahayak** (Citizen Facilitation Guide).\n\nHow can I help you today? You can ask about required documents, official government fees, turnaround times, or finding a nearby verified Cyber Café.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (userText?: string) => {
    const textToSend = userText || query;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      id: "usr_" + Date.now(),
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!userText) setQuery("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessage.text,
          currentContext: { serviceSlug: currentServiceSlug },
        }),
      });

      if (!res.ok) throw new Error("Assistant response error");
      const data = await res.json();

      const assistantMessage: Message = {
        id: "asst_" + Date.now(),
        sender: "assistant",
        text: data.message,
        action: data.suggestedAction,
        sources: data.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: "err_" + Date.now(),
        sender: "assistant",
        text: "We encountered a temporary connection issue. Please verify your connection or check the service directory directly.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "What documents are required for Income Certificate?",
    "What is the official fee for PAN Card?",
    "How to apply for Domicile Certificate?",
    "Find a verified Cyber Café nearby",
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center space-x-2.5 px-4 py-3 rounded-full bg-seva-navy-900 hover:bg-seva-navy-800 text-white shadow-xl hover:shadow-2xl transition-all border border-slate-700 active:scale-95 group"
            aria-label="Open SevaDesk Sahayak Citizen Assistant"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-inner">
              सहायक
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold leading-tight tracking-wide text-white">
                SevaDesk Sahayak
              </span>
              <span className="block text-[10px] text-slate-300">
                Citizen Help Guide
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
          </button>
        )}
      </div>

      {/* Slide-out Drawer / Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[95vw] sm:w-[420px] max-h-[85vh] h-[600px] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-300 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-seva-navy-900 text-white p-4 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-sm border border-emerald-500">
                SD
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center space-x-1.5">
                  <span>SevaDesk Sahayak</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300 border border-emerald-700 font-normal">
                    Verified Info
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300">
                  Govt Document & Procedure Guidance
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-seva-navy-800 transition"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subheader Notice */}
          <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
            <span>Official Gazette & Portal Standards</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">100% Free Public Guide</span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm bg-slate-50/50 dark:bg-slate-950/40">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 ${
                    m.sender === "user"
                      ? "bg-emerald-700 text-white rounded-br-none shadow-sm"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 rounded-bl-none shadow-sm"
                  }`}
                >
                  <div className="whitespace-pre-line text-xs sm:text-[13px] leading-relaxed">
                    {m.text}
                  </div>

                  {m.action && (
                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <Link
                        href={m.action.url}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                      >
                        <span>{m.action.label}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}

                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                      <BookOpen className="w-3 h-3 text-slate-400" />
                      <span>Source: {m.sources.join(", ")}</span>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>Checking official service directory...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-none flex space-x-2">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask e.g. 'fee for PAN card' or 'domicile docs'..."
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="p-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
