"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { REQUEST_STATUSES } from "@/lib/constants";
import {
  Send,
  Building2,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Star,
  ChevronLeft,
  DollarSign,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export default function ChatPage() {
  const params = useParams();
  const requestId = params?.requestId as string;
  const router = useRouter();
  const { user } = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Status Change State (for operator)
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [quoteInput, setQuoteInput] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Review State (for citizen)
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChatData = async () => {
    try {
      const res = await fetch(`/api/chat/${requestId}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setError("");
      } else if (res.status === 403) {
        setError("You are not authorized to view this request conversation.");
      } else if (res.status === 401) {
        router.push(`/auth/login?redirect=/chat/${requestId}`);
      } else {
        setError("Failed to load conversation details.");
      }
    } catch {
      setError("Network connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatData();
    // Poll for new messages every 4 seconds
    const interval = setInterval(fetchChatData, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.request?.conversation?.messages?.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || isSending) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/chat/${requestId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageInput.trim() }),
      });

      if (res.ok) {
        setMessageInput("");
        fetchChatData();
      }
    } catch {
      alert("Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  const handleStatusUpdate = async (statusToSet: string) => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/requests/${requestId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: statusToSet,
          note: statusNote || undefined,
          quoteAmount: quoteInput ? parseFloat(quoteInput) : undefined,
        }),
      });

      if (res.ok) {
        setStatusNote("");
        fetchChatData();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to update status");
      }
    } catch {
      alert("Network error");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/requests/${requestId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      if (res.ok) {
        setReviewSuccess(true);
        fetchChatData();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to submit review");
      }
    } catch {
      alert("Network error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Connecting to secure conversation workspace...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Conversation Unavailable</h2>
        <p className="text-xs text-slate-500 mt-1">{error}</p>
        <Link
          href="/"
          className="mt-4 inline-block px-4 py-2 rounded-lg bg-seva-navy-900 text-white text-xs font-semibold"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const req = data.request;
  const isOperator = data.currentUserRole === "OPERATOR";
  const isCitizen = data.currentUserRole === "CITIZEN";
  const statusMeta = REQUEST_STATUSES[req.status as keyof typeof REQUEST_STATUSES] || {
    label: req.status,
    color: "bg-slate-100 text-slate-800",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href={isOperator ? "/dashboard/cafe" : "/dashboard/user"}
          className="flex items-center text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Encrypted Request Channel</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Request Overview, Status Controls & Timeline */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${statusMeta.color}`}>
                  {statusMeta.label}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  #{req.id.slice(-6).toUpperCase()}
                </span>
              </div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {req.title}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {req.description}
              </p>
            </div>

            {/* Participants summary */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Citizen:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {req.user.name} ({req.user.phone})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Cyber Café:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {req.cyberCafe.shopName}
                </span>
              </div>
              {req.quoteAmount && (
                <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/60 p-2 rounded text-emerald-800 dark:text-emerald-300">
                  <span>Agreed Service Fee:</span>
                  <span className="font-bold">₹{req.quoteAmount}</span>
                </div>
              )}
            </div>

            {/* Attached User Document */}
            {req.userDocument && (
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-xs">
                <div className="flex items-center space-x-2 font-bold text-blue-900 dark:text-blue-200">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="truncate">{req.userDocument.title}</span>
                </div>
                <p className="text-[11px] text-blue-800 dark:text-blue-300 mt-1">
                  Citizen-prepared draft attached.
                </p>
              </div>
            )}

            {/* Operator Status Management Actions */}
            {isOperator && req.status !== "COMPLETED" && req.status !== "CANCELLED" && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Update Request Status
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  {req.status === "PENDING" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate("ACCEPTED")}
                        disabled={isUpdatingStatus}
                        className="p-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"
                      >
                        Accept Request
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate("REJECTED")}
                        disabled={isUpdatingStatus}
                        className="p-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold text-xs"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {req.status === "ACCEPTED" && (
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate("IN_PROGRESS")}
                      disabled={isUpdatingStatus}
                      className="col-span-2 p-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs"
                    >
                      Start Working (In Progress)
                    </button>
                  )}

                  {(req.status === "IN_PROGRESS" || req.status === "WAITING_FOR_USER") && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate("WAITING_FOR_USER")}
                        disabled={isUpdatingStatus}
                        className="p-2 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs"
                      >
                        Ask Citizen Info
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate("COMPLETED")}
                        disabled={isUpdatingStatus}
                        className="p-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                      >
                        Mark Completed
                      </button>
                    </>
                  )}
                </div>

                {/* Service quote input */}
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Set / Update Service Fee (₹)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="e.g. 50"
                      value={quoteInput}
                      onChange={(e) => setQuoteInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(req.status)}
                      className="px-3 py-1.5 rounded bg-slate-800 text-white text-xs font-semibold"
                    >
                      Save Fee
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Citizen Cancel Action */}
            {isCitizen && (req.status === "PENDING" || req.status === "ACCEPTED") && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleStatusUpdate("CANCELLED")}
                  disabled={isUpdatingStatus}
                  className="w-full py-2 text-xs font-semibold text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50"
                >
                  Cancel This Request
                </button>
              </div>
            )}

            {/* Citizen Review Section after completion */}
            {isCitizen && req.status === "COMPLETED" && !req.review && !reviewSuccess && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Rate Cyber Café Service
                </h4>
                <form onSubmit={handleSubmitReview} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`text-lg ${
                          star <= reviewRating ? "text-amber-500" : "text-slate-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="text-xs font-bold">{reviewRating} Stars</span>
                  </div>
                  <textarea
                    rows={2}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Write a short review about the operator's speed and helpfulness..."
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full py-2 rounded bg-emerald-600 text-white font-semibold text-xs"
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Verified Review"}
                  </button>
                </form>
              </div>
            )}

            {/* Existing Review Badge */}
            {(req.review || reviewSuccess) && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800 text-xs">
                <div className="flex items-center space-x-1 text-amber-500 font-bold mb-1">
                  <span>★ {req.review?.rating || reviewRating} / 5</span>
                  <span className="text-slate-700 dark:text-slate-300 font-normal">
                    Verified Citizen Review
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 italic">
                  &ldquo;{req.review?.comment || reviewComment}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Timeline History */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Audit Status Timeline
            </h3>
            <div className="space-y-3">
              {req.statusHistory.map((item: any, idx: number) => (
                <div key={item.id} className="flex items-start space-x-3 text-xs">
                  <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white">
                      {item.status}
                    </strong>
                    <span className="text-slate-500 text-[11px] block">
                      {new Date(item.createdAt).toLocaleString("en-IN")}
                    </span>
                    {item.note && (
                      <p className="text-slate-600 dark:text-slate-400 mt-0.5">{item.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Chat Interface */}
        <div className="lg:col-span-8 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-[680px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-seva-navy-900 text-white flex items-center justify-center font-bold text-xs">
                {isOperator ? req.user.name[0] : req.cyberCafe.shopName[0]}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isOperator ? req.user.name : req.cyberCafe.shopName}
                </h3>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                  Active Channel
                </span>
              </div>
            </div>

            <span className="text-[11px] text-slate-400">
              Live updates enabled
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/30 dark:bg-slate-950/20">
            {req.conversation?.messages?.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs">
                No messages yet. Send a message below to coordinate.
              </div>
            ) : (
              req.conversation?.messages?.map((msg: any) => {
                const isMe = msg.senderId === user?.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-baseline space-x-2 mb-1 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        {isMe ? "You" : msg.sender.name}
                      </span>
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div
                      className={`max-w-md rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                        isMe
                          ? "bg-seva-navy-900 text-white rounded-tr-none"
                          : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-tl-none"
                      }`}
                    >
                      <p>{msg.content}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center space-x-2"
          >
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type message to Cyber Café operator... (Press Enter to send)"
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isSending || !messageInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow flex items-center space-x-1.5 disabled:opacity-50 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
