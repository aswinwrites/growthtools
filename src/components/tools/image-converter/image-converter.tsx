"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Download, ArrowRight, RefreshCw, AlertCircle, CheckCircle2, X, ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormatOption = "png" | "jpeg" | "svg" | "webp";

const FORMAT_LABELS: Record<FormatOption, string> = {
  png: "PNG",
  jpeg: "JPEG",
  svg: "SVG",
  webp: "WebP",
};

const MIME: Record<FormatOption, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  webp: "image/webp",
};

// ─── Conversion logic ─────────────────────────────────────────────────────────

async function convertImage(
  file: File,
  targetFormat: FormatOption,
  quality: number,
  scale: number
): Promise<{ dataUrl: string; size: number }> {
  const srcType = file.type;

  // SVG → raster (PNG / JPEG / WebP)
  if (srcType === "image/svg+xml" && targetFormat !== "svg") {
    const svgText = await file.text();
    const blob = new Blob([svgText], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const w = Math.round((img.naturalWidth || 800) * scale);
        const h = Math.round((img.naturalHeight || 600) * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d")!;
        if (targetFormat === "jpeg") { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, w, h); }
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        const dataUrl = canvas.toDataURL(MIME[targetFormat], quality / 100);
        const byteLen = Math.round((dataUrl.length * 3) / 4);
        resolve({ dataUrl, size: byteLen });
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("SVG load failed")); };
      img.src = url;
    });
  }

  // Raster → SVG (embed as data URI in SVG wrapper)
  if (targetFormat === "svg" && srcType !== "image/svg+xml") {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth, h = img.naturalHeight;
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <image href="${dataUrl}" width="${w}" height="${h}" />
</svg>`;
        const svgBlob = new Blob([svg], { type: "image/svg+xml" });
        const reader2 = new FileReader();
        reader2.onload = () => resolve({ dataUrl: reader2.result as string, size: svgBlob.size });
        reader2.onerror = reject;
        reader2.readAsDataURL(svgBlob);
      };
      img.onerror = reject;
      img.src = dataUrl;
    });
  }

  // Raster → raster (PNG / JPEG / WebP)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        if (targetFormat === "jpeg") { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, img.naturalWidth, img.naturalHeight); }
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL(MIME[targetFormat], quality / 100);
        const byteLen = Math.round((dataUrl.length * 3) / 4);
        resolve({ dataUrl, size: byteLen });
      };
      img.onerror = () => reject(new Error("Image decode failed"));
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function detectInputFormat(file: File): FormatOption {
  if (file.type === "image/png") return "png";
  if (file.type === "image/jpeg") return "jpeg";
  if (file.type === "image/svg+xml") return "svg";
  if (file.type === "image/webp") return "webp";
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "svg") return "svg";
  if (ext === "png") return "png";
  if (ext === "webp") return "webp";
  return "jpeg";
}

function fmtBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [inputFormat, setInputFormat] = useState<FormatOption>("png");
  const [targetFormat, setTargetFormat] = useState<FormatOption>("jpeg");
  const [quality, setQuality] = useState(90);
  const [scale, setScale] = useState(1);
  const [result, setResult] = useState<{ dataUrl: string; size: number } | null>(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const FORMATS: FormatOption[] = ["png", "jpeg", "webp", "svg"];

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    setError("");
    const fmt = detectInputFormat(f);
    setInputFormat(fmt);
    // default to png if same format, else first different
    setTargetFormat(fmt === "png" ? "jpeg" : "png");
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
    else toast.error("Please drop an image file");
  };

  const convert = async () => {
    if (!file) return;
    if (inputFormat === targetFormat && scale === 1) {
      toast("Input and output format are the same — choose a different target.");
      return;
    }
    setConverting(true);
    setError("");
    setResult(null);
    try {
      const res = await convertImage(file, targetFormat, quality, scale);
      setResult(res);
      toast.success("Converted!");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Conversion failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setConverting(false);
    }
  };

  const download = () => {
    if (!result) return;
    const ext = targetFormat === "jpeg" ? "jpg" : targetFormat;
    const baseName = file?.name.replace(/\.[^.]+$/, "") ?? "converted";
    const a = document.createElement("a");
    a.href = result.dataUrl;
    a.download = `${baseName}.${ext}`;
    a.click();
  };

  const clear = () => {
    setFile(null); setPreview(null); setResult(null); setError("");
  };

  const showQuality = targetFormat === "jpeg" || targetFormat === "webp";
  const showScale = inputFormat === "svg" && targetFormat !== "svg";

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
            dragging ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
          )}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-200">
            <ImageIcon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">Drop an image or click to browse</p>
            <p className="mt-1 text-xs text-gray-400">PNG, JPEG, WebP, SVG supported · No file size limit</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,.svg"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <ImageIcon className="h-4 w-4 text-blue-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{fmtBytes(file.size)} · {FORMAT_LABELS[inputFormat]}</p>
              </div>
            </div>
            <button onClick={clear} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          {preview && (
            <div className="flex items-center justify-center bg-[repeating-conic-gradient(#f0f0f0_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] p-4 max-h-64 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Source preview" className="max-h-56 max-w-full object-contain rounded-xl shadow-sm" />
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      {file && (
        <div className="space-y-4">
          {/* Format picker */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">From</span>
              <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700">
                {FORMAT_LABELS[inputFormat]}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">To</span>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                {FORMATS.filter((f) => f !== inputFormat).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setTargetFormat(fmt)}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium transition-colors border-r last:border-r-0 border-gray-200",
                      targetFormat === fmt
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    {FORMAT_LABELS[fmt]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quality slider */}
          <AnimatePresence>
            {showQuality && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-4"
              >
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-14 shrink-0">Quality</span>
                <input
                  type="range" min={10} max={100} step={5}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="flex-1 accent-blue-600"
                />
                <span className="w-10 text-right text-sm font-semibold text-gray-700">{quality}%</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scale slider (SVG→raster) */}
          <AnimatePresence>
            {showScale && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-4"
              >
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-14 shrink-0">Scale</span>
                <input
                  type="range" min={0.5} max={4} step={0.5}
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="flex-1 accent-blue-600"
                />
                <span className="w-10 text-right text-sm font-semibold text-gray-700">{scale}×</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SVG embed note */}
          {targetFormat === "svg" && inputFormat !== "svg" && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
              Note: Raster → SVG embeds the image as a data URI — it&apos;s not vector-traced. For true vectorization, use a dedicated tool like Inkscape or Adobe Illustrator.
            </p>
          )}

          {/* Convert button */}
          <button
            onClick={convert}
            disabled={converting}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-all"
          >
            {converting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {converting ? "Converting…" : `Convert to ${FORMAT_LABELS[targetFormat]}`}
          </button>
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
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-emerald-100 bg-emerald-50 overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-800">
                  Converted · {FORMAT_LABELS[targetFormat]} · {fmtBytes(result.size)}
                </span>
              </div>
              <button
                onClick={download}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </button>
            </div>
            <div className="flex items-center justify-center bg-[repeating-conic-gradient(#e8f5e9_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] p-4 max-h-72 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.dataUrl} alt="Converted preview" className="max-h-64 max-w-full object-contain rounded-xl shadow-sm" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tip */}
      {!file && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { from: "SVG", to: "PNG", note: "Vector → lossless raster" },
            { from: "PNG", to: "JPEG", note: "Reduce file size" },
            { from: "JPEG", to: "WebP", note: "Modern format, ~30% smaller" },
            { from: "PNG", to: "SVG", note: "Embed in SVG wrapper" },
          ].map(({ from, to, note }) => (
            <div key={from + to} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-center">
              <p className="text-xs font-semibold text-gray-800">{from} → {to}</p>
              <p className="mt-0.5 text-xs text-gray-400">{note}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
