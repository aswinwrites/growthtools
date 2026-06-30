"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Copy, Check, Download, Trash2, RefreshCw, AlertCircle, X } from "lucide-react";
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

function fmtBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScreenshotToText() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [text, setText] = useState("");
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
    setText("");
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
    setText("");
    try {
      const { base64, mimeType } = await fileToBase64(file);
      const res = await fetch("/api/screenshot-to-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "Extraction failed");
      if (data.text === "No text detected in this image") {
        toast("No text found in this image.");
        return;
      }
      setText(data.text);
      toast.success("Text extracted!");
      trackEvent("screenshot_to_text_extracted");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 2000);
      trackEvent("screenshot_to_text_copied");
    });
  };

  const download = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const name = file?.name.replace(/\.[^.]+$/, "") ?? "extracted";
    a.href = url; a.download = `${name}.txt`; a.click();
    URL.revokeObjectURL(url);
    trackEvent("screenshot_to_text_downloaded");
  };

  const clear = () => {
    setFile(null); setPreview(null); setText(""); setError("");
    trackEvent("screenshot_to_text_cleared");
  };

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
            dragging ? "border-emerald-400 bg-emerald-50" : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
          )}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-200">
            <FileText className="h-6 w-6 text-emerald-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">Drop a screenshot or image</p>
            <p className="mt-1 text-xs text-gray-400">PNG, JPEG, WebP, GIF · Text, menus, articles, UI screenshots</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: preview + actions */}
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                  <FileText className="h-4 w-4 text-emerald-500" />
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
              <div className="flex items-center justify-center bg-gray-50 p-4 border-b border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Upload preview" className="max-h-64 max-w-full object-contain rounded-xl" />
              </div>
            )}
            <div className="px-4 py-3">
              <button
                onClick={extract}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 transition-all"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                {loading ? "Extracting text…" : "Extract Text"}
              </button>
            </div>
          </div>

          {/* Right: output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Extracted Text</p>
              {text && (
                <div className="flex items-center gap-2">
                  <button onClick={copy} className={cn("flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all", copied ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>
                    {copied ? <><Check className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
                  </button>
                  <button onClick={download} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all">
                    <Download className="h-3 w-3" /> .txt
                  </button>
                  <button onClick={() => { setText(""); }} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-red-500 transition-colors">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
            <div className={cn("relative w-full rounded-2xl border overflow-auto p-4 font-mono text-sm leading-relaxed min-h-[320px]", text ? "bg-white border-gray-200 text-gray-800" : "bg-gray-50 border-gray-200")}>
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 h-full py-12">
                  <RefreshCw className="h-6 w-6 text-emerald-400 animate-spin" />
                  <p className="text-sm text-gray-400">Analyzing image with AI…</p>
                </div>
              ) : text ? (
                <pre className="whitespace-pre-wrap break-words font-sans text-sm">{text}</pre>
              ) : (
                <p className="text-gray-400 text-sm mt-2">Extracted text will appear here.</p>
              )}
            </div>
            {text && (
              <p className="text-xs text-gray-400">
                {text.length.toLocaleString()} characters · {wordCount(text).toLocaleString()} words
              </p>
            )}
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

      {/* Use cases */}
      {!file && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            "UI screenshots",
            "Scanned documents",
            "Social media posts",
            "Error messages",
            "Menu & pricing boards",
            "Presentation slides",
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
