"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Download, Copy, Check, Trash2, Table, RefreshCw, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const [meta, base64] = dataUrl.split(",");
      const mimeType = meta.match(/data:([^;]+)/)?.[1] ?? file.type;
      resolve({ base64, mimeType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function parseCsvToRows(csv: string): string[][] {
  const lines = csv.trim().split("\n");
  return lines.map((line) => {
    const row: string[] = [];
    let inQuotes = false;
    let cell = "";
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"' && !inQuotes) { inQuotes = true; continue; }
      if (ch === '"' && inQuotes) {
        if (line[i + 1] === '"') { cell += '"'; i++; }
        else inQuotes = false;
        continue;
      }
      if (ch === "," && !inQuotes) { row.push(cell); cell = ""; continue; }
      cell += ch;
    }
    row.push(cell);
    return row;
  });
}

function fmtBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ImageToCSV() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [csv, setCsv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/gif"];

  const handleFile = useCallback((f: File) => {
    if (!ACCEPTED.includes(f.type)) {
      toast.error("Please upload a PNG, JPEG, WebP, or GIF image");
      return;
    }
    setFile(f);
    setCsv("");
    setError("");
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const extract = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setCsv("");
    try {
      const { base64, mimeType } = await fileToBase64(file);
      const res = await fetch("/api/image-to-csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "Extraction failed");
      if (data.csv.startsWith("ERROR:")) throw new Error(data.csv.replace("ERROR:", "").trim());
      setCsv(data.csv);
      toast.success("Table extracted!");
      trackEvent("image_to_csv_extracted");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(csv).then(() => {
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 2000);
      trackEvent("image_to_csv_copied");
    });
  };

  const download = () => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const name = file?.name.replace(/\.[^.]+$/, "") ?? "table";
    a.href = url; a.download = `${name}.csv`; a.click();
    URL.revokeObjectURL(url);
    trackEvent("image_to_csv_downloaded");
  };

  const clear = () => {
    setFile(null); setPreview(null); setCsv(""); setError("");
    trackEvent("image_to_csv_cleared");
  };

  const rows = csv ? parseCsvToRows(csv) : [];
  const hasMultipleTables = csv.includes("## TABLE:");

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-16 cursor-pointer transition-all select-none",
            dragging ? "border-violet-400 bg-violet-50" : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
          )}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-200">
            <Table className="h-6 w-6 text-violet-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">Drop a screenshot with a table</p>
            <p className="mt-1 text-xs text-gray-400">PNG, JPEG, WebP, GIF · Spreadsheets, reports, receipts, web tables</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                <Upload className="h-4 w-4 text-violet-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{fmtBytes(file.size)}</p>
              </div>
            </div>
            <button onClick={clear} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          {preview && (
            <div className="flex items-center justify-center bg-gray-50 p-4 max-h-64 overflow-hidden border-b border-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Upload preview" className="max-h-56 max-w-full object-contain rounded-xl" />
            </div>
          )}
          <div className="px-4 py-3">
            <button
              onClick={extract}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60 transition-all"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Table className="h-4 w-4" />}
              {loading ? "Extracting table…" : "Extract to CSV"}
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3"
          >
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {csv && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {hasMultipleTables ? "Extracted Tables" : `${rows.length} rows · ${rows[0]?.length ?? 0} columns`}
              </p>
              <div className="flex items-center gap-2">
                <button onClick={copy} className={cn("flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all", copied ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>
                  {copied ? <><Check className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy CSV</>}
                </button>
                <button onClick={download} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium bg-violet-100 text-violet-700 hover:bg-violet-200 transition-all">
                  <Download className="h-3 w-3" /> Download .csv
                </button>
                <button onClick={clear} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Table preview (only if no multi-table marker) */}
            {!hasMultipleTables && rows.length > 0 && (
              <div className="overflow-auto rounded-2xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      {rows[0].map((cell, i) => (
                        <th key={i} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(1, 51).map((row, ri) => (
                      <tr key={ri} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-3 py-2 text-gray-700 whitespace-nowrap">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rows.length > 51 && (
                  <p className="px-3 py-2 text-xs text-gray-400 text-center border-t border-gray-100">
                    Showing first 50 rows — download CSV for full data
                  </p>
                )}
              </div>
            )}

            {/* Raw CSV for multi-table */}
            {hasMultipleTables && (
              <pre className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xs font-mono text-gray-700 overflow-auto max-h-80 whitespace-pre-wrap">
                {csv}
              </pre>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Use cases */}
      {!file && !csv && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            "Spreadsheet screenshots",
            "Web table captures",
            "Financial reports",
            "Dashboard exports",
            "PDF table images",
            "Analytics screenshots",
          ].map((label) => (
            <div key={label} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-center text-xs text-gray-500">
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
