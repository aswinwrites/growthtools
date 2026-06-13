"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  ChevronDown,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AD_NETWORKS = [
  { value: "google", label: "Google UAC", source: "google", medium: "cpc" },
  { value: "meta", label: "Meta (Facebook / Instagram)", source: "facebook", medium: "paid_social" },
  { value: "aarki", label: "Aarki", source: "aarki", medium: "cpc" },
  { value: "applovin", label: "AppLovin", source: "applovin", medium: "cpc" },
  { value: "ironsource", label: "IronSource", source: "ironsource", medium: "cpc" },
  { value: "unity", label: "Unity Ads", source: "unity_ads", medium: "cpc" },
  { value: "moloco", label: "Moloco", source: "moloco", medium: "cpc" },
  { value: "chartboost", label: "Chartboost", source: "chartboost", medium: "cpc" },
  { value: "mintegral", label: "Mintegral", source: "mintegral", medium: "cpc" },
  { value: "vungle", label: "Vungle (Liftoff)", source: "vungle", medium: "cpc" },
  { value: "inmobi", label: "InMobi", source: "inmobi", medium: "cpc" },
  { value: "digital_turbine", label: "Digital Turbine", source: "digital_turbine", medium: "cpc" },
  { value: "tiktok", label: "TikTok Ads", source: "tiktok", medium: "paid_social" },
  { value: "snapchat", label: "Snapchat Ads", source: "snapchat", medium: "paid_social" },
  { value: "custom", label: "Custom", source: "", medium: "" },
];

const FIELD_HINTS: Record<string, string> = {
  appId: "The package name from your APK manifest. Find it in Google Play Console → App → Dashboard → App ID (e.g. com.company.appname)",
  source: "The ad network or referral source (auto-filled from network selection)",
  medium: "Marketing channel — cpc for paid, paid_social for social networks",
  campaign: "Identifies the specific campaign, e.g. summer_launch or brand_awareness_q2",
  term: "Paid keywords, e.g. running+shoes. Use + for spaces.",
  content: "Differentiates creatives within the same campaign, e.g. video_30s or banner_blue",
};

interface Field {
  id: string;
  label: string;
  placeholder: string;
  required?: boolean;
}

const CAMPAIGN_FIELDS: Field[] = [
  { id: "source", label: "Campaign Source", placeholder: "google, facebook, aarki…", required: true },
  { id: "medium", label: "Campaign Medium", placeholder: "cpc, paid_social, banner…" },
  { id: "campaign", label: "Campaign Name", placeholder: "summer_launch, brand_q2…" },
  { id: "term", label: "Campaign Term", placeholder: "running+shoes, ride+app…" },
  { id: "content", label: "Campaign Content", placeholder: "video_30s, banner_blue…" },
];

export default function PlayStoreURLGenerator() {
  const [appId, setAppId] = useState("");
  const [network, setNetwork] = useState(AD_NETWORKS[0]);
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [fields, setFields] = useState<Record<string, string>>({
    source: "google",
    medium: "cpc",
    campaign: "",
    term: "",
    content: "",
  });
  const [copied, setCopied] = useState(false);
  const [activeHint, setActiveHint] = useState<string | null>(null);

  const handleNetworkSelect = (n: typeof AD_NETWORKS[0]) => {
    setNetwork(n);
    setIsNetworkOpen(false);
    setFields((prev) => ({
      ...prev,
      source: n.source,
      medium: n.medium,
    }));
  };

  const handleReset = () => {
    setAppId("");
    setNetwork(AD_NETWORKS[0]);
    setFields({ source: "google", medium: "cpc", campaign: "", term: "", content: "" });
    toast("Form reset");
  };

  const generatedUrl = useMemo(() => {
    if (!appId.trim()) return "";

    const referrerParts: string[] = [];
    if (fields.source) referrerParts.push(`utm_source=${encodeURIComponent(fields.source)}`);
    if (fields.medium) referrerParts.push(`utm_medium=${encodeURIComponent(fields.medium)}`);
    if (fields.campaign) referrerParts.push(`utm_campaign=${encodeURIComponent(fields.campaign)}`);
    if (fields.term) referrerParts.push(`utm_term=${encodeURIComponent(fields.term)}`);
    if (fields.content) referrerParts.push(`utm_content=${encodeURIComponent(fields.content)}`);

    const base = `https://play.google.com/store/apps/details?id=${encodeURIComponent(appId.trim())}`;
    if (referrerParts.length === 0) return base;

    const referrer = encodeURIComponent(referrerParts.join("&"));
    return `${base}&referrer=${referrer}`;
  }, [appId, fields]);

  // Human-readable breakdown of referrer params
  const paramBreakdown = useMemo(() => {
    const parts: { key: string; value: string }[] = [];
    if (appId.trim()) parts.push({ key: "id", value: appId.trim() });
    if (fields.source) parts.push({ key: "utm_source", value: fields.source });
    if (fields.medium) parts.push({ key: "utm_medium", value: fields.medium });
    if (fields.campaign) parts.push({ key: "utm_campaign", value: fields.campaign });
    if (fields.term) parts.push({ key: "utm_term", value: fields.term });
    if (fields.content) parts.push({ key: "utm_content", value: fields.content });
    return parts;
  }, [appId, fields]);

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl).then(() => {
      setCopied(true);
      toast.success("Play Store URL copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isValid = appId.trim().includes(".");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Left: Builder */}
      <div className="lg:col-span-3 space-y-4">
        {/* App ID */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
              <Smartphone className="h-4 w-4 text-blue-600" />
              Application ID
              <span className="text-red-400">*</span>
            </label>
            <button
              onMouseEnter={() => setActiveHint("appId")}
              onMouseLeave={() => setActiveHint(null)}
              className="relative text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Info className="h-4 w-4" />
              <AnimatePresence>
                {activeHint === "appId" && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="absolute right-0 top-6 z-10 w-72 rounded-xl border border-blue-100 bg-blue-50 p-3 text-left shadow-lg"
                  >
                    <p className="text-xs text-blue-700">{FIELD_HINTS.appId}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
          <input
            type="text"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            placeholder="com.company.appname"
            className={cn(
              "w-full rounded-xl border px-4 py-3 text-sm font-mono placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
              appId && !isValid
                ? "border-red-300 bg-red-50 text-red-900"
                : "border-gray-200 bg-gray-50 text-gray-900"
            )}
          />
          {appId && !isValid && (
            <p className="mt-1.5 text-xs text-red-500">
              Package name should contain dots (e.g. com.company.app)
            </p>
          )}
          <p className="mt-1.5 text-xs text-gray-400">
            Find this in Google Play Console → App → Dashboard → App ID
          </p>
        </div>

        {/* Ad Network */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Ad Network
          </label>
          <div className="relative">
            <button
              onClick={() => setIsNetworkOpen(!isNetworkOpen)}
              className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 hover:border-blue-300 transition-all"
            >
              {network.label}
              <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", isNetworkOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {isNetworkOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden"
                >
                  <div className="max-h-60 overflow-y-auto py-1">
                    {AD_NETWORKS.map((n) => (
                      <button
                        key={n.value}
                        onClick={() => handleNetworkSelect(n)}
                        className={cn(
                          "w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors",
                          network.value === n.value
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-700"
                        )}
                      >
                        {n.label}
                        {n.source && (
                          <span className="ml-2 text-xs text-gray-400 font-mono">
                            ({n.source})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="mt-1.5 text-xs text-gray-400">
            Auto-fills source & medium. You can override below.
          </p>
        </div>

        {/* Campaign Fields */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4">
          <p className="text-sm font-semibold text-gray-800">Campaign Parameters</p>
          {CAMPAIGN_FIELDS.map((field) => (
            <div key={field.id}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-700">
                  {field.label}
                  {field.required && <span className="ml-1 text-red-400">*</span>}
                </label>
                <button
                  onMouseEnter={() => setActiveHint(field.id)}
                  onMouseLeave={() => setActiveHint(null)}
                  className="relative text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                  <AnimatePresence>
                    {activeHint === field.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute right-0 top-5 z-10 w-64 rounded-xl border border-blue-100 bg-blue-50 p-3 text-left shadow-lg"
                      >
                        <p className="text-xs text-blue-700">{FIELD_HINTS[field.id]}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
              <input
                type="text"
                value={fields[field.id] ?? ""}
                onChange={(e) =>
                  setFields((prev) => ({ ...prev, [field.id]: e.target.value }))
                }
                placeholder={field.placeholder}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          ))}

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset all fields
          </button>
        </div>
      </div>

      {/* Right: Output */}
      <div className="lg:col-span-2">
        <div className="sticky top-24 space-y-4">
          {/* Generated URL */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-800">
                Generated Play Store URL
              </h2>
              {generatedUrl && (
                <a
                  href={generatedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                  title="Open in Play Store"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            {generatedUrl ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                  <p className="text-xs font-mono text-gray-700 break-all leading-relaxed">
                    {generatedUrl}
                  </p>
                </div>
                <button
                  onClick={handleCopy}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.98]",
                    copied
                      ? "bg-emerald-600 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy URL
                    </>
                  )}
                </button>
              </motion.div>
            ) : (
              <div className="rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 p-6 text-center">
                <Smartphone className="mx-auto h-7 w-7 text-gray-300 mb-2" />
                <p className="text-xs text-gray-400">
                  Enter an Application ID to generate your Play Store URL
                </p>
              </div>
            )}
          </div>

          {/* Parameter Breakdown */}
          {paramBreakdown.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-gray-100 bg-white p-5"
            >
              <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Parameter Breakdown
              </h3>
              <div className="space-y-1.5">
                {paramBreakdown.map(({ key, value }) => (
                  <div key={key} className="flex items-baseline gap-2">
                    <span className="text-xs font-mono text-blue-600 min-w-[120px]">
                      {key}
                    </span>
                    <span className="text-xs text-gray-700 font-medium truncate">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Info callout */}
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-xs font-semibold text-amber-800 mb-1">
              How this works
            </p>
            <p className="text-xs text-amber-700">
              The referrer parameter is URL-encoded and passed to Google Play. Your MMP
              (AppsFlyer, Adjust, Branch) reads it on first launch to attribute the install
              to the right campaign.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
