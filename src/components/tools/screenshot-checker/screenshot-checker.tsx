"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ImageIcon,
  Smartphone,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Device Data ─────────────────────────────────────────────────────────────

interface Device {
  name: string;
  width: number;
  height: number;
}

const IOS_DEVICES: Device[] = [
  { name: "iPhone 16 Pro Max", width: 1320, height: 2868 },
  { name: "iPhone 15 Pro Max / 16 Plus", width: 1290, height: 2796 },
  { name: "iPhone Air / 17 Pro Max", width: 1260, height: 2736 },
  { name: "iPhone 14 Plus / 13 Pro Max", width: 1284, height: 2778 },
  { name: "iPhone 11 Pro Max / XS Max", width: 1242, height: 2688 },
  { name: "iPhone 17 Pro / 17", width: 1206, height: 2622 },
  { name: "iPhone 16 / 15 Pro / 15", width: 1179, height: 2556 },
  { name: "iPhone 14 / 13 / 12", width: 1170, height: 2532 },
  { name: "iPhone X / XS / 11 Pro", width: 1125, height: 2436 },
  { name: "iPhone 16e", width: 1080, height: 2340 },
  { name: "iPhone 8+ / 7+ / 6S+", width: 1242, height: 2208 },
  { name: "iPhone SE / 8 / 7", width: 750, height: 1334 },
  { name: "iPad Pro M4/M5 13\"", width: 2064, height: 2752 },
  { name: "iPad Pro 12.9\"", width: 2048, height: 2732 },
  { name: "iPad Air M2/M3 / Pro M4/M5 11\"", width: 1668, height: 2420 },
  { name: "iPad Pro 11\"", width: 1668, height: 2388 },
  { name: "iPad Air 3rd / iPad 7–9th gen", width: 1668, height: 2224 },
  { name: "iPad 10th gen / mini 6th", width: 1640, height: 2360 },
  { name: "iPad Pro M4/M5 11\" (alt)", width: 1488, height: 2266 },
];

const ANDROID_RECOMMENDED: Device[] = [
  { name: "Recommended Phone 9:16", width: 1080, height: 1920 },
  { name: "QHD Phone 9:16", width: 1440, height: 2560 },
  { name: '7" Tablet', width: 1200, height: 1920 },
  { name: '10" Tablet', width: 1600, height: 2560 },
  { name: "Chromebook 16:9", width: 1920, height: 1080 },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface IOSMatch {
  device: Device;
  orientation: "Portrait" | "Landscape";
  type: "exact" | "close";
  diff: number; // px difference
}

interface AndroidCheck {
  pass: boolean;
  issues: string[];
  recommendations: string[];
}

interface ImageResult {
  id: string;
  file: File;
  dataUrl: string;
  width: number;
  height: number;
  iosMatches: IOSMatch[];
  androidCheck: AndroidCheck;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function checkIOS(w: number, h: number): IOSMatch[] {
  const matches: IOSMatch[] = [];
  for (const device of IOS_DEVICES) {
    // Portrait
    const pDiff = Math.abs(w - device.width) + Math.abs(h - device.height);
    if (pDiff === 0) {
      matches.push({ device, orientation: "Portrait", type: "exact", diff: 0 });
    } else if (pDiff <= 20) {
      matches.push({ device, orientation: "Portrait", type: "close", diff: pDiff });
    }
    // Landscape
    const lDiff = Math.abs(w - device.height) + Math.abs(h - device.width);
    if (lDiff === 0) {
      matches.push({ device, orientation: "Landscape", type: "exact", diff: 0 });
    } else if (lDiff <= 20) {
      matches.push({ device, orientation: "Landscape", type: "close", diff: lDiff });
    }
  }
  return matches.sort((a, b) => a.diff - b.diff);
}

function checkAndroid(w: number, h: number, fileSizeBytes: number): AndroidCheck {
  const issues: string[] = [];
  const recommendations: string[] = [];
  const min = 320, max = 3840;

  if (w < min || h < min) issues.push(`Minimum dimension is ${min}px (got ${Math.min(w, h)}px)`);
  if (w > max || h > max) issues.push(`Maximum dimension is ${max}px (got ${Math.max(w, h)}px)`);

  const longSide = Math.max(w, h);
  const shortSide = Math.min(w, h);
  const ratio = longSide / shortSide;
  if (ratio > 2) issues.push(`Aspect ratio exceeds 2:1 (got ${ratio.toFixed(2)}:1)`);

  if (fileSizeBytes > 8 * 1024 * 1024) issues.push(`File size exceeds 8 MB (got ${(fileSizeBytes / 1024 / 1024).toFixed(1)} MB)`);

  // Recommendations — check if close to a recommended size
  for (const rec of ANDROID_RECOMMENDED) {
    const pDiff = Math.abs(w - rec.width) + Math.abs(h - rec.height);
    const lDiff = Math.abs(w - rec.height) + Math.abs(h - rec.width);
    if (pDiff === 0 || lDiff === 0) {
      recommendations.push(`✓ Matches recommended size: ${rec.name} (${rec.width}×${rec.height})`);
      break;
    }
  }
  if (recommendations.length === 0) {
    recommendations.push(`For phones, use 1080×1920 (9:16). For 10" tablets, use 1600×2560.`);
  }

  return { pass: issues.length === 0, issues, recommendations };
}

function readImageDimensions(file: File): Promise<{ width: number; height: number; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight, dataUrl });
      img.onerror = reject;
      img.src = dataUrl;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ScreenshotChecker() {
  const [results, setResults] = useState<ImageResult[]>([]);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(async (files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (!imageFiles.length) return;
    setProcessing(true);
    const newResults: ImageResult[] = [];
    for (const file of imageFiles) {
      try {
        const { width, height, dataUrl } = await readImageDimensions(file);
        newResults.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          dataUrl,
          width,
          height,
          iosMatches: checkIOS(width, height),
          androidCheck: checkAndroid(width, height, file.size),
        });
      } catch {
        // skip unreadable files
      }
    }
    setResults((prev) => [...newResults, ...prev]);
    setProcessing(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      processFiles(Array.from(e.dataTransfer.files));
    },
    [processFiles]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const removeResult = (id: string) => setResults((prev) => prev.filter((r) => r.id !== id));
  const clearAll = () => setResults([]);

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 p-10",
          dragging
            ? "border-blue-400 bg-blue-50"
            : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl transition-colors", dragging ? "bg-blue-100" : "bg-white border border-gray-200")}>
          {processing ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <Upload className="h-5 w-5 text-blue-500" />
            </motion.div>
          ) : (
            <Upload className={cn("h-5 w-5", dragging ? "text-blue-500" : "text-gray-400")} />
          )}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            {processing ? "Processing…" : dragging ? "Drop to check dimensions" : "Drop screenshots here, or click to upload"}
          </p>
          <p className="text-xs text-gray-400 mt-1">PNG or JPEG · up to 8 MB each · multiple files supported</p>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">
                {results.length} screenshot{results.length !== 1 ? "s" : ""} checked
              </p>
              <button onClick={clearAll} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                Clear all
              </button>
            </div>

            {results.map((result) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="rounded-2xl border border-gray-100 bg-white overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-50">
                  {/* Thumbnail */}
                  <div className="h-12 w-8 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={result.dataUrl} alt={result.file.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{result.file.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {result.width} × {result.height} px · {(result.file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <button onClick={() => removeResult(result.id)} className="text-gray-300 hover:text-gray-500 transition-colors shrink-0">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Panels */}
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                  {/* iOS */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Smartphone className="h-4 w-4 text-gray-500" />
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">App Store (iOS)</p>
                    </div>
                    {result.iosMatches.length === 0 ? (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-amber-700 font-medium">No matching device found</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            This size doesn&apos;t match any known iOS screenshot requirement.
                            Common sizes: 1290×2796 (iPhone 15 Pro Max), 1179×2556 (iPhone 16).
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {result.iosMatches.slice(0, 4).map((m, i) => (
                          <div key={i} className="flex items-start gap-2">
                            {m.type === "exact" ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <p className={cn("text-xs font-medium", m.type === "exact" ? "text-gray-800" : "text-gray-600")}>
                                {m.device.name}
                                <span className={cn("ml-1 text-[11px]", m.type === "exact" ? "text-emerald-600" : "text-amber-500")}>
                                  {m.orientation === "Landscape" ? "· Landscape" : ""}
                                  {m.type === "close" ? ` · ±${m.diff}px` : ""}
                                </span>
                              </p>
                              <p className="text-[11px] text-gray-400">
                                {m.device.width}×{m.device.height}
                              </p>
                            </div>
                          </div>
                        ))}
                        {result.iosMatches.length > 4 && (
                          <p className="text-xs text-gray-400 pl-6">+{result.iosMatches.length - 4} more matches</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Android */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Monitor className="h-4 w-4 text-gray-500" />
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Play Store (Android)</p>
                    </div>
                    <div className="space-y-2">
                      {result.androidCheck.issues.length === 0 ? (
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <p className="text-xs font-medium text-emerald-700">Meets all Play Store requirements</p>
                        </div>
                      ) : (
                        result.androidCheck.issues.map((issue, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-red-600">{issue}</p>
                          </div>
                        ))
                      )}
                      {result.androidCheck.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-2 mt-1">
                          <ImageIcon className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-500">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reference table */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* iOS sizes */}
        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-gray-400" />
            <p className="text-sm font-semibold text-gray-700">iOS Required Screenshot Sizes</p>
          </div>
          <div className="divide-y divide-gray-50">
            {IOS_DEVICES.map((d) => (
              <div key={d.name} className="flex items-center justify-between px-5 py-2.5">
                <span className="text-xs text-gray-600">{d.name}</span>
                <span className="text-xs font-mono text-gray-400">{d.width}×{d.height}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Android info */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
              <Monitor className="h-4 w-4 text-gray-400" />
              <p className="text-sm font-semibold text-gray-700">Android Play Store Requirements</p>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: "Min dimension", value: "320 px" },
                { label: "Max dimension", value: "3840 px" },
                { label: "Max aspect ratio", value: "2 : 1" },
                { label: "Max file size", value: "8 MB" },
                { label: "Formats", value: "PNG, JPEG" },
                { label: "Max screenshots", value: "8 per listing" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-xs font-mono font-medium text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <p className="text-sm font-semibold text-gray-700">Recommended Android Sizes</p>
            </div>
            <div className="divide-y divide-gray-50">
              {ANDROID_RECOMMENDED.map((d) => (
                <div key={d.name} className="flex items-center justify-between px-5 py-2.5">
                  <span className="text-xs text-gray-600">{d.name}</span>
                  <span className="text-xs font-mono text-gray-400">{d.width}×{d.height}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
