"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2,
  ExternalLink,
  BarChart3,
  Trash2,
  Globe,
  Monitor,
  MousePointerClick,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import CopyButton from "@/components/shared/copy-button";
import { useUIStore } from "@/store";
import { isValidUrl } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ShortenedLink {
  id: string;
  slug: string;
  destination: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

interface AnalyticsData {
  totalClicks: number;
  clicksByDay: { date: string; count: number }[];
  topCountries: { country: string; count: number }[];
  topCities: { city: string; count: number }[];
  topDevices: { device: string; count: number }[];
  topBrowsers: { browser: string; count: number }[];
}

export default function URLShortener() {
  const { data: session } = useSession();
  const { openLoginPrompt } = useUIStore();
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [links, setLinks] = useState<ShortenedLink[]>([]);
  const [error, setError] = useState("");
  const [expandedAnalytics, setExpandedAnalytics] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<Record<string, AnalyticsData>>({});
  const [loadingAnalytics, setLoadingAnalytics] = useState<string | null>(null);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.marketertools.fyi";

  const handleShorten = async () => {
    setError("");
    if (!url.trim()) return;
    if (!isValidUrl(url)) {
      setError("Please enter a valid URL");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, customSlug: customSlug || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to shorten URL");

      setLinks((prev) => [data.link, ...prev]);
      setUrl("");
      setCustomSlug("");
      toast.success("Link shortened!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    toast("Link removed");
  };

  const toggleAnalytics = async (linkId: string) => {
    if (expandedAnalytics === linkId) {
      setExpandedAnalytics(null);
      return;
    }
    setExpandedAnalytics(linkId);
    if (analyticsData[linkId]) return; // already loaded
    setLoadingAnalytics(linkId);
    try {
      const res = await fetch(`/api/analytics?linkId=${linkId}`);
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData((prev) => ({ ...prev, [linkId]: data }));
      }
    } catch {
      toast.error("Failed to load analytics");
    } finally {
      setLoadingAnalytics(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input card */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleShorten()}
              placeholder="https://example.com/your-long-url"
              className={cn(
                "w-full rounded-xl border pl-10 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                error ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
              )}
            />
          </div>
          <button
            onClick={handleShorten}
            disabled={isLoading || !url.trim()}
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all whitespace-nowrap"
          >
            {isLoading ? "Shortening..." : "Shorten URL"}
          </button>
        </div>

        {error && (
          <p className="mt-2 text-xs text-red-500">{error}</p>
        )}

        {/* Custom slug (authenticated only) */}
        {session ? (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {appUrl}/s/
            </span>
            <input
              type="text"
              value={customSlug}
              onChange={(e) =>
                setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
              }
              placeholder="custom-slug (optional)"
              className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        ) : (
          <button
            onClick={() =>
              openLoginPrompt(
                "Sign in to set custom slugs and track your links"
              )
            }
            className="mt-3 text-xs text-blue-500 hover:underline"
          >
            + Add custom slug & tracking (sign in free)
          </button>
        )}
      </div>

      {/* Analytics feature banner for anonymous */}
      {!session && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-orange-100 bg-orange-50 p-5"
        >
          <div className="flex items-start gap-4">
            <BarChart3 className="h-8 w-8 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-orange-800">
                Unlock link analytics
              </h3>
              <p className="text-sm text-orange-600 mt-1">
                Sign in to track clicks, countries, cities, devices, and browsers.
                Analytics auto-delete after 14 days.
              </p>
              <div className="flex flex-wrap gap-3 mt-3">
                {[
                  { icon: <MousePointerClick className="h-3.5 w-3.5" />, label: "Click count" },
                  { icon: <Globe className="h-3.5 w-3.5" />, label: "Countries" },
                  { icon: <MapPin className="h-3.5 w-3.5" />, label: "Cities" },
                  { icon: <Monitor className="h-3.5 w-3.5" />, label: "Device & browser" },
                ].map((item) => (
                  <span
                    key={item.label}
                    className="flex items-center gap-1 text-xs text-orange-700 bg-orange-100 rounded-full px-2.5 py-1"
                  >
                    {item.icon}
                    {item.label}
                  </span>
                ))}
              </div>
              <button
                onClick={() => openLoginPrompt("Track your short links — sign in free")}
                className="mt-3 rounded-lg bg-orange-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-orange-600 transition-colors"
              >
                Sign in free
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Links list */}
      <AnimatePresence>
        {links.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-700">
              Shortened Links ({links.length})
            </h2>
            {links.map((link) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-2xl border border-gray-100 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    {/* Short URL */}
                    <div className="flex items-center gap-2 mb-1">
                      <a
                        href={link.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {link.shortUrl}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <CopyButton text={link.shortUrl} label="Copy" className="py-1 px-2 text-xs" />
                    </div>
                    {/* Original URL */}
                    <p className="text-xs text-gray-400 truncate">
                      → {link.destination}
                    </p>
                    {/* Meta */}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MousePointerClick className="h-3 w-3" />
                        {link.clicks} clicks
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(link.createdAt).toLocaleDateString()}
                      </span>
                      {session && (
                        <button
                          onClick={() => toggleAnalytics(link.id)}
                          className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <BarChart3 className="h-3 w-3" />
                          Analytics
                          {expandedAnalytics === link.id
                            ? <ChevronUp className="h-3 w-3" />
                            : <ChevronDown className="h-3 w-3" />}
                        </button>
                      )}
                      {!session && (
                        <span className="text-xs text-orange-500">
                          No tracking (sign in)
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="flex-shrink-0 rounded-lg p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Analytics Panel */}
                <AnimatePresence>
                  {expandedAnalytics === link.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        {loadingAnalytics === link.id ? (
                          <p className="text-xs text-gray-400 text-center py-3">Loading analytics…</p>
                        ) : analyticsData[link.id] ? (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Top Countries */}
                            <div>
                              <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                                <Globe className="h-3.5 w-3.5 text-blue-500" />
                                Countries
                              </p>
                              {analyticsData[link.id].topCountries.length === 0 ? (
                                <p className="text-xs text-gray-400">No data yet</p>
                              ) : analyticsData[link.id].topCountries.slice(0, 5).map((c) => (
                                <div key={c.country} className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-gray-600 truncate">{c.country}</span>
                                  <span className="text-xs font-mono text-gray-500 ml-2">{c.count}</span>
                                </div>
                              ))}
                            </div>
                            {/* Top Cities */}
                            <div>
                              <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                                Cities
                              </p>
                              {analyticsData[link.id].topCities.length === 0 ? (
                                <p className="text-xs text-gray-400">No data yet</p>
                              ) : analyticsData[link.id].topCities.slice(0, 5).map((c) => (
                                <div key={c.city} className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-gray-600 truncate">{c.city}</span>
                                  <span className="text-xs font-mono text-gray-500 ml-2">{c.count}</span>
                                </div>
                              ))}
                            </div>
                            {/* Devices */}
                            <div>
                              <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                                <Monitor className="h-3.5 w-3.5 text-purple-500" />
                                Devices
                              </p>
                              {analyticsData[link.id].topDevices.length === 0 ? (
                                <p className="text-xs text-gray-400">No data yet</p>
                              ) : analyticsData[link.id].topDevices.slice(0, 5).map((d) => (
                                <div key={d.device} className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-gray-600 truncate">{d.device}</span>
                                  <span className="text-xs font-mono text-gray-500 ml-2">{d.count}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {links.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
          <Link2 className="mx-auto h-8 w-8 text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">
            Shortened links will appear here
          </p>
          <p className="text-xs text-gray-300 mt-1">
            Links are session-based unless you sign in
          </p>
        </div>
      )}
    </div>
  );
}
