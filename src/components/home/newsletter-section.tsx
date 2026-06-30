"use client";

import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter" }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubscribed(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white border-t border-gray-100 py-14">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
        <div className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-blue-50 mb-4">
          <Mail className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          New tools &amp; guides, delivered
        </h2>
        <p className="mt-2 text-gray-500 text-sm">
          We write about performance marketing, ASO, and campaign operations.
          No fluff, no cadence pressure — just useful when it lands.
        </p>

        {subscribed ? (
          <div className="mt-6 flex items-center justify-center gap-2 text-emerald-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">You&apos;re in. Talk soon.</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 active:scale-[0.98] transition-all"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent inline-block" />
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
        )}
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        <p className="mt-3 text-xs text-gray-400">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
