"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  BookmarkPlus,
  ChevronDown,
  Info,
  RefreshCw,
  Wand2,
  Globe,
  Smartphone,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { useUTMStore, useUIStore } from "@/store";
import { buildUtmUrl, toNamingConvention, isValidUrl } from "@/lib/utils";
import CopyButton from "@/components/shared/copy-button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Web Campaign ────────────────────────────────────────────────────────────

const WEB_PRESETS = [
  { id: "google-ads", name: "Google Ads", source: "google", medium: "cpc", emoji: "🔵" },
  { id: "meta-ads", name: "Meta Ads", source: "facebook", medium: "paid_social", emoji: "🟣" },
  { id: "linkedin", name: "LinkedIn", source: "linkedin", medium: "paid_social", emoji: "🔷" },
  { id: "email", name: "Email", source: "newsletter", medium: "email", emoji: "📧" },
  { id: "whatsapp", name: "WhatsApp", source: "whatsapp", medium: "messaging", emoji: "💬" },
  { id: "influencer", name: "Influencer", source: "influencer", medium: "social", emoji: "⭐" },
  { id: "push", name: "Push Notification", source: "push", medium: "push", emoji: "🔔" },
  { id: "organic-social", name: "Organic Social", source: "instagram", medium: "organic_social", emoji: "📱" },
];

const WEB_FIELD_HINTS: Record<string, string> = {
  source: "Where the traffic comes from (e.g., google, newsletter, facebook)",
  medium: "Marketing channel (e.g., cpc, email, organic_social)",
  campaign: "Campaign name (e.g., summer_sale, brand_awareness_q1)",
  term: "Paid keywords — primarily for Google Ads",
  content: "Differentiate creatives or A/B test variants",
};

// ─── App Campaign ────────────────────────────────────────────────────────────

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

const APP_FIELD_HINTS: Record<string, string> = {
  appId: "The package name from your APK manifest. Find it in Google Play Console → App → Dashboard → App ID (e.g. com.company.appname)",
  source: "The ad network or referral source (auto-filled from network selection)",
  medium: "Marketing channel — cpc for paid, paid_social for social networks",
  campaign: "Identifies the specific campaign, e.g. summer_launch or brand_q2",
  term: "Paid keywords — use + for spaces (e.g. running+shoes)",
  content: "Differentiates creatives within the same campaign, e.g. video_30s",
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function UTMBuilder() {
  const { data: session } = useSession();
  const { params, setParams, resetParams, addToHistory } = useUTMStore();
  const { openLoginPrompt } = useUIStore();

  // Mode
  const [mode, setMode] = useState<"web" | "app">("web");

  // Web mode
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [namingParts, setNamingParts] = useState({ platform: "", type: "", geo: "", period: "" });
  const [activeHint, setActiveHint] = useState<string | null>(null);

  // App mode
  const [appId, setAppId] = useState("");
  const [network, setNetwork] = useState(AD_NETWORKS[0]);
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [appFields, setAppFields] = useState({
    source: "google",
    medium: "cpc",
    campaign: "",
    term: "",
    content: "",
  });
  const [appHint, setAppHint] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // ─ Derived ─
  const webUrl = useMemo(() => buildUtmUrl(params), [params]);
  const isWebValid = params.baseUrl ? isValidUrl(params.baseUrl) : true;
  const isAppIdValid = appId.trim().includes(".");

  const appUrl = useMemo(() => {
    if (!appId.trim()) return "";
    const parts: string[] = [];
    if (appFields.source) parts.push(`utm_source=${encodeURIComponent(appFields.source)}`);
    if (appFields.medium) parts.push(`utm_medium=${encodeURIComponent(appFields.medium)}`);
    if (appFields.campaign) parts.push(`utm_campaign=${encodeURIComponent(appFields.campaign)}`);
    if (appFields.term) parts.push(`utm_term=${encodeURIComponent(appFields.term)}`);
    if (appFields.content) parts.push(`utm_content=${encodeURIComponent(appFields.content)}`);
    const base = `https://play.google.com/store/apps/details?id=${encodeURIComponent(appId.trim())}`;
    if (!parts.length) return base;
    return `${base}&referrer=${encodeURIComponent(parts.join("&"))}`;
  }, [appId, appFields]);

  const appBreakdown = useMemo(() => {
    const p: { key: string; value: string }[] = [];
    if (appId.trim()) p.push({ key: "id", value: appId.trim() });
    if (appFields.source) p.push({ key: "utm_source", value: appFields.source });
    if (appFields.medium) p.push({ key: "utm_medium", value: appFields.medium });
    if (appFields.campaign) p.push({ key: "utm_campaign", value: appFields.campaign });
    if (appFields.term) p.push({ key: "utm_term", value: appFields.term });
    if (appFields.content) p.push({ key: "utm_content", value: appFields.content });
    return p;
  }, [appId, appFields]);

  // ─ Handlers ─
  const applyPreset = (p: typeof WEB_PRESETS[0]) => {
    setParams({ source: p.source, medium: p.medium });
    toast.success(`Applied ${p.name} preset`);
  };

  const generateNaming = () => {
    const parts = [namingParts.platform, namingParts.type, namingParts.geo, namingParts.period].filter(Boolean);
    if (!parts.length) { toast.error("Enter at least one naming component"); return; }
    setParams({ campaign: parts.map(toNamingConvention).join("_") });
    toast.success("Naming convention applied");
  };

  const handleNetworkSelect = (n: typeof AD_NETWORKS[0]) => {
    setNetwork(n);
    setIsNetworkOpen(false);
    setAppFields((prev) => ({ ...prev, source: n.source, medium: n.medium }));
  };

  const resetApp = () => {
    setAppId("");
    setNetwork(AD_NETWORKS[0]);
    setAppFields({ source: "google", medium: "cpc", campaign: "", term: "", content: "" });
    toast("Form reset");
  };

  const handleAppCopy = () => {
    if (!appUrl) return;
    navigator.clipboard.writeText(appUrl).then(() => {
      setCopied(true);
      toast.success("Play Store URL copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1 gap-1">
        <button
          onClick={() => setMode("web")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
            mode === "web"
              ? "bg-white text-blue-700 shadow-sm border border-gray-100"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Globe className="h-4 w-4" />
          Web Campaign
        </button>
        <button
          onClick={() => setMode("app")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
            mode === "app"
              ? "bg-white text-blue-700 shadow-sm border border-gray-100"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <Smartphone className="h-4 w-4" />
          App Campaign
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "web" ? (
          <motion.div
            key="web"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-5"
          >
            {/* Left: Inputs */}
            <div className="lg:col-span-3 space-y-4">
              {/* Preset chips */}
              <div>
                <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Quick Presets
                </p>
                <div className="flex flex-wrap gap-2">
                  {WEB_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all"
                    >
                      <span>{preset.emoji}</span>
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Website URL <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    value={params.baseUrl}
                    onChange={(e) => setParams({ baseUrl: e.target.value })}
                    placeholder="https://example.com/landing-page"
                    className={cn(
                      "w-full rounded-xl border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                      !isWebValid && params.baseUrl
                        ? "border-red-300 bg-red-50 text-red-900"
                        : "border-gray-200 bg-gray-50 text-gray-900"
                    )}
                  />
                  {!isWebValid && params.baseUrl && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="h-3 w-3" /> Please enter a valid URL
                    </p>
                  )}
                </div>

                {(
                  [
                    { key: "source", label: "Campaign Source", placeholder: "google", required: true },
                    { key: "medium", label: "Campaign Medium", placeholder: "cpc", required: true },
                    { key: "campaign", label: "Campaign Name", placeholder: "summer_sale_2025" },
                    { key: "term", label: "Campaign Term", placeholder: "running shoes" },
                    { key: "content", label: "Campaign Content", placeholder: "banner_a" },
                  ] as { key: keyof typeof params; label: string; placeholder: string; required?: boolean }[]
                ).map(({ key, label, placeholder, required }) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveHint(activeHint === key ? null : key)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Info className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <AnimatePresence>
                      {activeHint === key && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-1.5 text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2"
                        >
                          {WEB_FIELD_HINTS[key]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <input
                      type="text"
                      value={params[key] as string}
                      onChange={(e) =>
                        setParams({ [key]: e.target.value.toLowerCase().replace(/\s+/g, "_") })
                      }
                      placeholder={placeholder}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                ))}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={resetParams}
                    className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" /> Reset
                  </button>
                  <button
                    onClick={() => {
                      if (!session) { openLoginPrompt("Want to save this UTM preset for later?"); return; }
                      toast.success("Preset saved!");
                    }}
                    className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <BookmarkPlus className="h-4 w-4" /> Save preset
                  </button>
                </div>
              </div>

              {/* Naming convention */}
              <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between px-6 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-blue-600" />
                    Naming Convention Generator
                  </div>
                  <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", showAdvanced && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 space-y-3 border-t border-gray-100 pt-4">
                        <p className="text-xs text-gray-500">
                          Fill in the components and the campaign name auto-fills with a consistent naming convention.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { key: "platform", placeholder: "meta" },
                            { key: "type", placeholder: "remarketing" },
                            { key: "geo", placeholder: "india" },
                            { key: "period", placeholder: "july_2025" },
                          ].map((f) => (
                            <input
                              key={f.key}
                              type="text"
                              value={namingParts[f.key as keyof typeof namingParts]}
                              onChange={(e) => setNamingParts((p) => ({ ...p, [f.key]: e.target.value }))}
                              placeholder={f.placeholder}
                              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                          ))}
                        </div>
                        {namingParts.platform && (
                          <p className="text-xs font-mono bg-gray-50 rounded-lg px-3 py-2 text-gray-700">
                            Preview: <strong>{[namingParts.platform, namingParts.type, namingParts.geo, namingParts.period].filter(Boolean).map(toNamingConvention).join("_")}</strong>
                          </p>
                        )}
                        <button
                          onClick={generateNaming}
                          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                        >
                          Apply to Campaign Name
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Output */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 sticky top-24">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Generated URL</h2>
                <div
                  className={cn(
                    "min-h-[100px] rounded-xl border bg-gray-50 p-4 text-xs font-mono break-all leading-relaxed",
                    webUrl ? "text-gray-800 border-gray-200" : "text-gray-400 border-dashed border-gray-200"
                  )}
                >
                  {webUrl || "Fill in the fields on the left to generate your URL."}
                </div>
                <div className="mt-3 flex gap-2">
                  <CopyButton text={webUrl} className="flex-1 justify-center" onCopy={() => addToHistory(webUrl, params)} />
                  {webUrl && (
                    <a href={webUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">↗</a>
                  )}
                </div>
                {webUrl && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Parameters</p>
                    {(["source", "medium", "campaign", "term", "content"] as (keyof typeof params)[])
                      .filter((k) => params[k])
                      .map((k) => (
                        <div key={k} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-1.5">
                          <span className="text-xs text-gray-500 capitalize">{k}</span>
                          <span className="text-xs font-medium text-gray-900 font-mono">{params[k] as string}</span>
                        </div>
                      ))}
                  </motion.div>
                )}
                {!session && webUrl && (
                  <motion.button
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => openLoginPrompt("Want to save this UTM preset for later?")}
                    className="mt-4 w-full rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-left"
                  >
                    <p className="text-xs font-medium text-blue-700">💾 Want to save this UTM preset for later?</p>
                    <p className="text-xs text-blue-500 mt-0.5">Sign in free to save presets across sessions</p>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── App Campaign ── */
          <motion.div
            key="app"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-5"
          >
            {/* Left */}
            <div className="lg:col-span-3 space-y-4">
              {/* App ID */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                    <Smartphone className="h-4 w-4 text-blue-600" />
                    Application ID <span className="text-red-400">*</span>
                  </label>
                  <button
                    onMouseEnter={() => setAppHint("appId")}
                    onMouseLeave={() => setAppHint(null)}
                    className="relative text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Info className="h-4 w-4" />
                    <AnimatePresence>
                      {appHint === "appId" && (
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          className="absolute right-0 top-6 z-10 w-72 rounded-xl border border-blue-100 bg-blue-50 p-3 text-left shadow-lg"
                        >
                          <p className="text-xs text-blue-700">{APP_FIELD_HINTS.appId}</p>
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
                    appId && !isAppIdValid
                      ? "border-red-300 bg-red-50 text-red-900"
                      : "border-gray-200 bg-gray-50 text-gray-900"
                  )}
                />
                {appId && !isAppIdValid && (
                  <p className="mt-1.5 text-xs text-red-500">Package name should contain dots (e.g. com.company.app)</p>
                )}
                <p className="mt-1.5 text-xs text-gray-400">Find this in Google Play Console → App → Dashboard → App ID</p>
              </div>

              {/* Ad Network */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <label className="block text-sm font-semibold text-gray-800 mb-2">Ad Network</label>
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
                                network.value === n.value ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                              )}
                            >
                              {n.label}
                              {n.source && <span className="ml-2 text-xs text-gray-400 font-mono">({n.source})</span>}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <p className="mt-1.5 text-xs text-gray-400">Auto-fills source & medium. You can override below.</p>
              </div>

              {/* Campaign fields */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4">
                <p className="text-sm font-semibold text-gray-800">Campaign Parameters</p>
                {(["source", "medium", "campaign", "term", "content"] as const).map((id) => (
                  <div key={id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-gray-700 capitalize">
                        {id === "source" ? "Campaign Source" : id === "medium" ? "Campaign Medium" : id === "campaign" ? "Campaign Name" : id === "term" ? "Campaign Term" : "Campaign Content"}
                        {(id === "source") && <span className="ml-1 text-red-400">*</span>}
                      </label>
                      <button
                        onMouseEnter={() => setAppHint(id)}
                        onMouseLeave={() => setAppHint(null)}
                        className="relative text-gray-300 hover:text-blue-400 transition-colors"
                      >
                        <Info className="h-3.5 w-3.5" />
                        <AnimatePresence>
                          {appHint === id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.96 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute right-0 top-5 z-10 w-64 rounded-xl border border-blue-100 bg-blue-50 p-3 text-left shadow-lg"
                            >
                              <p className="text-xs text-blue-700">{APP_FIELD_HINTS[id]}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={appFields[id]}
                      onChange={(e) => setAppFields((prev) => ({ ...prev, [id]: e.target.value }))}
                      placeholder={id === "source" ? "google, facebook, aarki…" : id === "medium" ? "cpc, paid_social…" : id === "campaign" ? "summer_launch, brand_q2…" : id === "term" ? "running+shoes…" : "video_30s, banner_blue…"}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                ))}
                <button
                  onClick={resetApp}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Reset all fields
                </button>
              </div>
            </div>

            {/* Right: Output */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-4">
                <div className="rounded-2xl border border-gray-100 bg-white p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-gray-800">Play Store Campaign URL</h2>
                    {appUrl && (
                      <a href={appUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors" title="Open in Play Store">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  {appUrl ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                      <div className="rounded-xl bg-gray-50 border border-gray-200 p-3">
                        <p className="text-xs font-mono text-gray-700 break-all leading-relaxed">{appUrl}</p>
                      </div>
                      <button
                        onClick={handleAppCopy}
                        className={cn(
                          "w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.98]",
                          copied ? "bg-emerald-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
                        )}
                      >
                        {copied ? <><Check className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy URL</>}
                      </button>
                    </motion.div>
                  ) : (
                    <div className="rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 p-6 text-center">
                      <Smartphone className="mx-auto h-7 w-7 text-gray-300 mb-2" />
                      <p className="text-xs text-gray-400">Enter an Application ID to generate your Play Store URL</p>
                    </div>
                  )}
                </div>

                {appBreakdown.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-gray-100 bg-white p-5">
                    <h3 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Parameter Breakdown</h3>
                    <div className="space-y-1.5">
                      {appBreakdown.map(({ key, value }) => (
                        <div key={key} className="flex items-baseline gap-2">
                          <span className="text-xs font-mono text-blue-600 min-w-[110px]">{key}</span>
                          <span className="text-xs text-gray-700 font-medium truncate">{value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                  <p className="text-xs font-semibold text-amber-800 mb-1">How this works</p>
                  <p className="text-xs text-amber-700">The referrer parameter is URL-encoded and passed to Google Play. Your MMP (AppsFlyer, Adjust, Branch) reads it on first launch to attribute the install to the right campaign.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
