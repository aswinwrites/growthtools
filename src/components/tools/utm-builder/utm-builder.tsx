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
} from "lucide-react";
import { useUTMStore, useUIStore } from "@/store";
import { buildUtmUrl, toNamingConvention, isValidUrl } from "@/lib/utils";
import CopyButton from "@/components/shared/copy-button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PRESETS: {
  id: string;
  name: string;
  source: string;
  medium: string;
  emoji: string;
}[] = [
  { id: "google-ads", name: "Google Ads", source: "google", medium: "cpc", emoji: "🔵" },
  { id: "meta-ads", name: "Meta Ads", source: "facebook", medium: "paid_social", emoji: "🟣" },
  { id: "linkedin", name: "LinkedIn", source: "linkedin", medium: "paid_social", emoji: "🔷" },
  { id: "email", name: "Email", source: "newsletter", medium: "email", emoji: "📧" },
  { id: "whatsapp", name: "WhatsApp", source: "whatsapp", medium: "messaging", emoji: "💬" },
  { id: "influencer", name: "Influencer", source: "influencer", medium: "social", emoji: "⭐" },
  { id: "push", name: "Push Notification", source: "push", medium: "push", emoji: "🔔" },
  { id: "organic-social", name: "Organic Social", source: "instagram", medium: "organic_social", emoji: "📱" },
  { id: "play-store", name: "Play Store", source: "google_play", medium: "app_store", emoji: "🤖" },
  { id: "app-store", name: "App Store", source: "apple", medium: "app_store", emoji: "🍎" },
];

const FIELD_HINTS: Record<string, string> = {
  source: "Where the traffic comes from (e.g., google, newsletter, facebook)",
  medium: "Marketing channel (e.g., cpc, email, organic_social)",
  campaign: "Campaign name (e.g., summer_sale, brand_awareness_q1)",
  term: "Paid keywords — primarily for Google Ads",
  content: "Differentiate creatives or A/B test variants",
};

export default function UTMBuilder() {
  const { data: session } = useSession();
  const { params, setParams, resetParams, addToHistory } = useUTMStore();
  const { openLoginPrompt } = useUIStore();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [namingParts, setNamingParts] = useState({
    platform: "",
    type: "",
    geo: "",
    period: "",
  });
  const [activeHint, setActiveHint] = useState<string | null>(null);

  const generatedUrl = useMemo(() => buildUtmUrl(params), [params]);
  const isValid = params.baseUrl ? isValidUrl(params.baseUrl) : true;

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setParams({ source: preset.source, medium: preset.medium });
    toast.success(`Applied ${preset.name} preset`);
  };

  const generateNamingConvention = () => {
    const parts = [
      namingParts.platform,
      namingParts.type,
      namingParts.geo,
      namingParts.period,
    ].filter(Boolean);
    if (!parts.length) {
      toast.error("Enter at least one naming component");
      return;
    }
    const campaign = parts.map(toNamingConvention).join("_");
    setParams({ campaign });
    toast.success("Naming convention applied");
  };

  const handleGenerate = () => {
    if (!generatedUrl) return;
    addToHistory(generatedUrl, params);
  };

  const handleSavePreset = () => {
    if (!session) {
      openLoginPrompt("Want to save this UTM preset for later?");
      return;
    }
    // TODO: call /api/utm-presets POST
    toast.success("Preset saved!");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Left: Inputs */}
      <div className="lg:col-span-3 space-y-4">
        {/* Preset chips */}
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
            Quick Presets
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
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

        {/* Form card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 space-y-4">
          {/* Base URL */}
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
                "w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                !isValid && params.baseUrl
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 bg-gray-50"
              )}
            />
            {!isValid && params.baseUrl && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" />
                Please enter a valid URL
              </p>
            )}
          </div>

          {/* UTM fields */}
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
                  {label}
                  {required && <span className="text-red-400 ml-0.5">*</span>}
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setActiveHint(activeHint === key ? null : key)
                  }
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
                    {FIELD_HINTS[key]}
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

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={resetParams}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </button>
            <button
              onClick={handleSavePreset}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <BookmarkPlus className="h-4 w-4" />
              Save preset
            </button>
          </div>
        </div>

        {/* Advanced: Naming Convention Generator */}
        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between px-6 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-blue-600" />
              Naming Convention Generator
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-gray-400 transition-transform",
                showAdvanced && "rotate-180"
              )}
            />
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
                    Fill in the components, click generate, and the campaign
                    name field will auto-fill with a consistent naming
                    convention.
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
                        onChange={(e) =>
                          setNamingParts((p) => ({
                            ...p,
                            [f.key]: e.target.value,
                          }))
                        }
                        placeholder={f.placeholder}
                        className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    ))}
                  </div>
                  {namingParts.platform && (
                    <p className="text-xs font-mono bg-gray-50 rounded-lg px-3 py-2 text-gray-700">
                      Preview:{" "}
                      <strong>
                        {[
                          namingParts.platform,
                          namingParts.type,
                          namingParts.geo,
                          namingParts.period,
                        ]
                          .filter(Boolean)
                          .map(toNamingConvention)
                          .join("_")}
                      </strong>
                    </p>
                  )}
                  <button
                    onClick={generateNamingConvention}
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
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Generated URL
          </h2>

          {/* URL output */}
          <div
            className={cn(
              "min-h-[100px] rounded-xl border bg-gray-50 p-4 text-xs font-mono break-all leading-relaxed",
              generatedUrl
                ? "text-gray-800 border-gray-200"
                : "text-gray-400 border-dashed border-gray-200"
            )}
          >
            {generatedUrl ||
              "Fill in the fields on the left to generate your URL."}
          </div>

          {/* Copy + open */}
          <div className="mt-3 flex gap-2">
            <CopyButton
              text={generatedUrl}
              className="flex-1 justify-center"
              onCopy={() => handleGenerate()}
            />
            {generatedUrl && (
              <a
                href={generatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                ↗
              </a>
            )}
          </div>

          {/* Parameter breakdown */}
          {generatedUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-5 space-y-2"
            >
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Parameters
              </p>
              {(
                [
                  { key: "source", label: "Source" },
                  { key: "medium", label: "Medium" },
                  { key: "campaign", label: "Campaign" },
                  { key: "term", label: "Term" },
                  { key: "content", label: "Content" },
                ] as { key: keyof typeof params; label: string }[]
              )
                .filter(({ key }) => params[key])
                .map(({ key, label }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-1.5"
                  >
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-xs font-medium text-gray-900 font-mono">
                      {params[key] as string}
                    </span>
                  </div>
                ))}
            </motion.div>
          )}

          {/* Login nudge */}
          {!session && generatedUrl && (
            <motion.button
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() =>
                openLoginPrompt("Want to save this UTM preset for later?")
              }
              className="mt-4 w-full rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-left"
            >
              <p className="text-xs font-medium text-blue-700">
                💾 Want to save this UTM preset for later?
              </p>
              <p className="text-xs text-blue-500 mt-0.5">
                Sign in free to save presets across sessions
              </p>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
