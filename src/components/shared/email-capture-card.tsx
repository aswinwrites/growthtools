"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Mail, ArrowRight, Check, X } from "lucide-react";

const STORAGE_KEY = "gt_email_captured";

export default function EmailCaptureCard() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY)) {
      setDismissed(true);
    }
  }, []);

  if (!mounted || dismissed) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || state === "loading") return;
    setState("loading");
    try {
      const res = await fetch("/api/email-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: pathname }),
      });
      if (res.ok) {
        setState("done");
        localStorage.setItem(STORAGE_KEY, "1");
        setTimeout(() => setDismissed(true), 2500);
      } else {
        setState("error");
        setTimeout(() => setState("idle"), 2500);
      }
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2500);
    }
  };

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="mx-3 mb-3 rounded-xl border border-blue-100 bg-blue-50/70 p-3 relative">
      <button
        onClick={dismiss}
        className="absolute top-2 right-2 rounded-full p-0.5 hover:bg-blue-100 transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-3 w-3 text-blue-400" />
      </button>

      {state === "done" ? (
        <div className="flex items-center gap-2 py-1">
          <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <Check className="h-3 w-3 text-emerald-600" />
          </div>
          <p className="text-xs font-medium text-emerald-700">You&apos;re on the list!</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-1.5 mb-2">
            <Mail className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <p className="text-xs font-semibold text-blue-800">Get new tools first</p>
          </div>
          <p className="text-[11px] text-blue-600 mb-2.5 leading-relaxed">
            Drop your email — we&apos;ll ping you when new tools ship.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-1.5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@work.com"
              required
              className="flex-1 min-w-0 rounded-lg border border-blue-200 bg-white px-2.5 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="shrink-0 rounded-lg bg-blue-600 hover:bg-blue-700 px-2.5 py-1.5 flex items-center justify-center transition-colors disabled:opacity-60"
            >
              {state === "loading" ? (
                <div className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : state === "error" ? (
                <span className="text-[10px] text-white font-medium">Retry</span>
              ) : (
                <ArrowRight className="h-3 w-3 text-white" />
              )}
            </button>
          </form>
          {state === "error" && (
            <p className="text-[10px] text-red-500 mt-1">Something went wrong, try again.</p>
          )}
        </>
      )}
    </div>
  );
}
