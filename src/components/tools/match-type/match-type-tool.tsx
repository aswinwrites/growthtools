"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  ClipboardList,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import { formatKeyword, toCSV, downloadFile, copyToClipboard } from "@/lib/utils";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type MatchType = "broad" | "phrase" | "exact";

const MATCH_TYPES: { id: MatchType; label: string; color: string; example: string }[] = [
  { id: "broad", label: "Broad", color: "blue", example: "keyword" },
  { id: "phrase", label: "Phrase", color: "violet", example: '"keyword"' },
  { id: "exact", label: "Exact", color: "emerald", example: "[keyword]" },
];

export default function MatchTypeTool() {
  const [rawInput, setRawInput] = useState("");
  const [activeTypes, setActiveTypes] = useState<MatchType[]>([
    "broad",
    "phrase",
    "exact",
  ]);
  const [copiedCol, setCopiedCol] = useState<MatchType | null>(null);

  const keywords = useMemo(
    () =>
      rawInput
        .split("\n")
        .map((k) => k.trim())
        .filter(Boolean),
    [rawInput]
  );

  const rows = useMemo(
    () =>
      keywords.map((kw) => ({
        original: kw,
        broad: formatKeyword(kw, "broad"),
        phrase: formatKeyword(kw, "phrase"),
        exact: formatKeyword(kw, "exact"),
      })),
    [keywords]
  );

  const toggleType = (type: MatchType) => {
    setActiveTypes((prev) => {
      const next = prev.includes(type)
        ? prev.length > 1 ? prev.filter((t) => t !== type) : prev
        : [...prev, type];
      trackEvent("match_type_toggled", { match_type: type, enabled: !prev.includes(type) });
      return next;
    });
  };

  const copyColumn = async (type: MatchType) => {
    const text = rows.map((r) => r[type]).join("\n");
    await copyToClipboard(text);
    setCopiedCol(type);
    toast.success(`Copied all ${type} match keywords`);
    setTimeout(() => setCopiedCol(null), 2000);
    trackEvent("match_type_column_copied", { match_type: type });
  };

  const copyAll = async () => {
    const lines = rows
      .map((r) =>
        activeTypes.map((t) => r[t]).join("\t")
      )
      .join("\n");
    await copyToClipboard(lines);
    toast.success("Copied all keywords");
    trackEvent("match_type_copy_all", { keyword_count: keywords.length });
  };

  const exportCSV = () => {
    const headers = ["Keyword", ...activeTypes.map((t) => MATCH_TYPES.find(m => m.id === t)!.label)];
    const csvRows = rows.map((r) => [
      r.original,
      ...activeTypes.map((t) => r[t]),
    ]);
    const csv = toCSV([headers, ...csvRows]);
    downloadFile(csv, "keywords-match-types.csv", "text/csv");
    toast.success("CSV downloaded");
    trackEvent("match_type_csv_exported", { keyword_count: keywords.length });
  };

  const clearAll = () => {
    setRawInput("");
    toast("Cleared");
    trackEvent("match_type_cleared");
  };

  const charCount = useMemo(
    () =>
      rows.reduce(
        (sum, r) =>
          sum + activeTypes.reduce((s, t) => s + r[t].length + 1, 0),
        0
      ),
    [rows, activeTypes]
  );

  return (
    <div className="space-y-4">
      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Match type toggles */}
        <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1">
          {MATCH_TYPES.map((mt) => (
            <button
              key={mt.id}
              onClick={() => toggleType(mt.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                activeTypes.includes(mt.id)
                  ? `bg-${mt.color}-50 text-${mt.color}-700 border border-${mt.color}-200`
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <span className="font-mono">{mt.example}</span>
              <span className="ml-1.5">{mt.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {keywords.length > 0 && (
            <>
              <button
                onClick={copyAll}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ClipboardList className="h-3.5 w-3.5" />
                Copy All
              </button>
              <button
                onClick={exportCSV}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </button>
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Input */}
        <div className="lg:col-span-1 rounded-2xl border border-gray-100 bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-800">
              Keywords
            </label>
            <span className="text-xs text-gray-400">
              {keywords.length} keyword{keywords.length !== 1 ? "s" : ""}
            </span>
          </div>
          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder={"running shoes\nbuy sneakers online\nbest athletic shoes"}
            rows={18}
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          />
          <p className="mt-2 text-xs text-gray-400">One keyword per line</p>
        </div>

        {/* Output columns */}
        <div className="lg:col-span-3 grid gap-4" style={{ gridTemplateColumns: `repeat(${activeTypes.length}, minmax(0, 1fr))` }}>
          {MATCH_TYPES.filter((mt) => activeTypes.includes(mt.id)).map((mt) => (
            <div
              key={mt.id}
              className="rounded-2xl border border-gray-100 bg-white p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span
                    className={`text-sm font-semibold text-${mt.color}-700`}
                  >
                    {mt.label} Match
                  </span>
                  <code className={`ml-2 text-xs font-mono text-${mt.color}-400`}>
                    {mt.example}
                  </code>
                </div>
                <button
                  onClick={() => copyColumn(mt.id)}
                  className={cn(
                    "rounded-lg p-1.5 transition-all",
                    copiedCol === mt.id
                      ? "text-green-600 bg-green-50"
                      : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {copiedCol === mt.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="space-y-1 max-h-[400px] overflow-y-auto scrollbar-hide">
                <AnimatePresence>
                  {rows.length === 0 ? (
                    <p className="text-xs text-gray-400 py-2">
                      Keywords appear here
                    </p>
                  ) : (
                    rows.map((row, i) => (
                      <motion.div
                        key={`${mt.id}-${i}`}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-sm font-mono text-gray-800",
                          i % 2 === 0 ? "bg-gray-50" : "bg-white"
                        )}
                      >
                        {row[mt.id]}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      {keywords.length > 0 && (
        <div className="flex items-center gap-6 rounded-xl bg-gray-50 border border-gray-100 px-4 py-2.5 text-xs text-gray-500">
          <span>
            <strong className="text-gray-700">{keywords.length}</strong> keywords
          </span>
          <span>
            <strong className="text-gray-700">{activeTypes.length}</strong> match types
          </span>
          <span>
            <strong className="text-gray-700">
              {keywords.length * activeTypes.length}
            </strong>{" "}
            total variants
          </span>
          <span>
            <strong className="text-gray-700">{charCount.toLocaleString()}</strong> characters
          </span>
        </div>
      )}
    </div>
  );
}
