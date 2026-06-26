"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  Download,
  Palette,
  RefreshCw,
  Link2,
  Type,
  Phone,
  Mail,
  Smartphone,
  ImagePlus,
  X,
} from "lucide-react";
import { useQRStore, useUIStore } from "@/store";
import { downloadFile } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { QRInputType } from "@/types";

const INPUT_TYPES: { id: QRInputType; label: string; icon: React.ReactNode; placeholder: string }[] = [
  { id: "url", label: "URL", icon: <Link2 className="h-4 w-4" />, placeholder: "https://example.com" },
  { id: "text", label: "Text", icon: <Type className="h-4 w-4" />, placeholder: "Your text here..." },
  { id: "phone", label: "Phone", icon: <Phone className="h-4 w-4" />, placeholder: "+1 (555) 000-0000" },
  { id: "email", label: "Email", icon: <Mail className="h-4 w-4" />, placeholder: "hello@example.com" },
  { id: "app-link", label: "App Link", icon: <Smartphone className="h-4 w-4" />, placeholder: "https://play.google.com/store/apps/..." },
];

const ERROR_LEVELS = ["L", "M", "Q", "H"] as const;

function buildQRValue(type: QRInputType, value: string): string {
  if (!value.trim()) return "";
  switch (type) {
    case "phone":
      return `tel:${value.replace(/\s/g, "")}`;
    case "email":
      return `mailto:${value}`;
    default:
      return value;
  }
}

export default function QRGenerator() {
  const { data: session } = useSession();
  const { options, setOptions, resetOptions } = useQRStore();
  const { openLoginPrompt } = useUIStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showColorPanel, setShowColorPanel] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoFileName, setLogoFileName] = useState<string>("");

  const overlayLogo = useCallback((canvas: HTMLCanvasElement, logoSrc: string) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      const logoSize = canvas.width * 0.22;
      const x = (canvas.width - logoSize) / 2;
      const y = (canvas.height - logoSize) / 2;
      // White rounded square background
      const pad = 6;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      const rx = x - pad, ry = y - pad, rw = logoSize + pad * 2, rh = logoSize + pad * 2, r = 8;
      ctx.moveTo(rx + r, ry);
      ctx.lineTo(rx + rw - r, ry);
      ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + r);
      ctx.lineTo(rx + rw, ry + rh - r);
      ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - r, ry + rh);
      ctx.lineTo(rx + r, ry + rh);
      ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - r);
      ctx.lineTo(rx, ry + r);
      ctx.quadraticCurveTo(rx, ry, rx + r, ry);
      ctx.closePath();
      ctx.fill();
      ctx.drawImage(img, x, y, logoSize, logoSize);
    };
    img.src = logoSrc;
  }, []);

  const generateQR = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const qrValue = buildQRValue(options.type, options.value);
    if (!qrValue) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#f9fafb";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#d1d5db";
        ctx.font = "14px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Enter a value to generate", canvas.width / 2, canvas.height / 2);
      }
      return;
    }

    setIsGenerating(true);
    try {
      const QRCode = (await import("qrcode")).default;
      await QRCode.toCanvas(canvas, qrValue, {
        width: options.size,
        margin: options.margin,
        errorCorrectionLevel: options.errorCorrectionLevel,
        color: {
          dark: options.fgColor,
          light: options.bgColor,
        },
      });
      // Overlay logo after QR renders
      if (logoDataUrl) {
        overlayLogo(canvas, logoDataUrl);
      }
    } catch (err) {
      console.error("QR generation error:", err);
      toast.error("Failed to generate QR code");
    } finally {
      setIsGenerating(false);
    }
  }, [options, logoDataUrl, overlayLogo]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, SVG)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be under 2 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoDataUrl(ev.target?.result as string);
      setLogoFileName(file.name);
      // Auto-switch to H error correction when logo is added
      if (options.errorCorrectionLevel !== "H") {
        setOptions({ errorCorrectionLevel: "H" });
        toast("Switched to H error correction for logo reliability");
      }
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoDataUrl(null);
    setLogoFileName("");
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  useEffect(() => {
    const timeout = setTimeout(generateQR, 200);
    return () => clearTimeout(timeout);
  }, [generateQR]);

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "marketertools-qr.png";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("QR code downloaded as PNG");
    }, "image/png");
  };

  const downloadSVG = async () => {
    if (!options.value) return;
    try {
      const QRCode = (await import("qrcode")).default;
      const qrValue = buildQRValue(options.type, options.value);
      const svg = await QRCode.toString(qrValue, {
        type: "svg",
        margin: options.margin,
        errorCorrectionLevel: options.errorCorrectionLevel,
        color: { dark: options.fgColor, light: options.bgColor },
      });
      downloadFile(svg, "marketertools-qr.svg", "image/svg+xml");
      toast.success("QR code downloaded as SVG");
    } catch {
      toast.error("SVG export failed");
    }
  };

  const handleSaveStyle = () => {
    if (!session) {
      openLoginPrompt("Want to save your QR style for later?");
      return;
    }
    toast.success("QR style saved!");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Left: Controls */}
      <div className="lg:col-span-3 space-y-4">
        {/* Input type selector */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <p className="mb-3 text-sm font-semibold text-gray-800">
            Content Type
          </p>
          <div className="flex flex-wrap gap-2">
            {INPUT_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setOptions({ type: t.id })}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                  options.type === t.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50"
                )}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {INPUT_TYPES.find((t) => t.id === options.type)?.label} Content
            </label>
            {options.type === "text" ? (
              <textarea
                value={options.value}
                onChange={(e) => setOptions({ value: e.target.value })}
                placeholder={
                  INPUT_TYPES.find((t) => t.id === options.type)?.placeholder
                }
                rows={3}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            ) : (
              <input
                type={options.type === "email" ? "email" : "text"}
                value={options.value}
                onChange={(e) => setOptions({ value: e.target.value })}
                placeholder={
                  INPUT_TYPES.find((t) => t.id === options.type)?.placeholder
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            )}
          </div>
        </div>

        {/* Customization */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-5">
          <button
            onClick={() => setShowColorPanel(!showColorPanel)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-800"
          >
            <Palette className="h-4 w-4 text-blue-600" />
            Customize Appearance
          </button>

          <div className="grid grid-cols-2 gap-4">
            {/* Colors */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Foreground Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={options.fgColor}
                  onChange={(e) => setOptions({ fgColor: e.target.value })}
                  className="h-9 w-14 rounded-lg cursor-pointer border border-gray-200"
                />
                <input
                  type="text"
                  value={options.fgColor.toUpperCase()}
                  onChange={(e) =>
                    e.target.value.match(/^#[0-9A-Fa-f]{0,6}$/) &&
                    setOptions({ fgColor: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={options.bgColor}
                  onChange={(e) => setOptions({ bgColor: e.target.value })}
                  className="h-9 w-14 rounded-lg cursor-pointer border border-gray-200"
                />
                <input
                  type="text"
                  value={options.bgColor.toUpperCase()}
                  onChange={(e) =>
                    e.target.value.match(/^#[0-9A-Fa-f]{0,6}$/) &&
                    setOptions({ bgColor: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Size */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-600">
                Size
              </label>
              <span className="text-xs font-mono text-gray-500">
                {options.size}×{options.size}px
              </span>
            </div>
            <input
              type="range"
              min={200}
              max={600}
              step={50}
              value={options.size}
              onChange={(e) => setOptions({ size: Number(e.target.value) })}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Error Correction */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Error Correction Level
            </label>
            <div className="flex gap-2">
              {ERROR_LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => setOptions({ errorCorrectionLevel: level })}
                  className={cn(
                    "flex-1 rounded-xl py-1.5 text-xs font-mono font-medium transition-all",
                    options.errorCorrectionLevel === level
                      ? "bg-blue-600 text-white"
                      : "border border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-gray-400">
              H = highest correction (use when adding a logo)
            </p>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Center Logo (optional)
            </label>
            {logoDataUrl ? (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoDataUrl}
                  alt="logo preview"
                  className="h-8 w-8 rounded object-contain bg-white border border-emerald-100"
                />
                <span className="flex-1 text-xs text-emerald-700 truncate">{logoFileName}</span>
                <button
                  onClick={removeLogo}
                  className="text-emerald-500 hover:text-red-500 transition-colors flex-shrink-0"
                  title="Remove logo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => logoInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-xs text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all"
              >
                <ImagePlus className="h-4 w-4" />
                Upload logo (PNG, JPG, SVG · max 2 MB)
              </button>
            )}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <p className="mt-1.5 text-xs text-gray-400">
              Use H error correction (set above) for best logo readability
            </p>
          </div>

          {/* Margin */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-600">
                Quiet Zone (Margin)
              </label>
              <span className="text-xs font-mono text-gray-500">{options.margin} modules</span>
            </div>
            <input
              type="range"
              min={0}
              max={6}
              step={1}
              value={options.margin}
              onChange={(e) => setOptions({ margin: Number(e.target.value) })}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Quick preset colors */}
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">
              Color Presets
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { fg: "#000000", bg: "#FFFFFF", name: "Classic" },
                { fg: "#1d4ed8", bg: "#eff6ff", name: "Blue" },
                { fg: "#7c3aed", bg: "#f5f3ff", name: "Purple" },
                { fg: "#065f46", bg: "#ecfdf5", name: "Green" },
                { fg: "#be123c", bg: "#fff1f2", name: "Red" },
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() =>
                    setOptions({ fgColor: preset.fg, bgColor: preset.bg })
                  }
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:border-gray-300 transition-all"
                  title={preset.name}
                >
                  <span
                    className="h-3 w-3 rounded-full border border-gray-200"
                    style={{ backgroundColor: preset.fg }}
                  />
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              resetOptions();
              toast("Options reset");
            }}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset to defaults
          </button>
        </div>
      </div>

      {/* Right: Preview + Download */}
      <div className="lg:col-span-2">
        <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 text-center space-y-4">
          <h2 className="text-sm font-semibold text-gray-800 text-left">
            QR Preview
          </h2>

          <motion.div
            key={`${options.fgColor}-${options.bgColor}`}
            initial={{ opacity: 0.6, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center"
          >
            <canvas
              ref={canvasRef}
              width={options.size}
              height={options.size}
              className="max-w-full rounded-xl border border-gray-100"
              style={{ imageRendering: "pixelated" }}
            />
          </motion.div>

          {isGenerating && (
            <p className="text-xs text-gray-400">Generating...</p>
          )}

          {/* Download buttons */}
          <div className="flex gap-2">
            <button
              onClick={downloadPNG}
              disabled={!options.value}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
            >
              <Download className="h-4 w-4" />
              PNG
            </button>
            <button
              onClick={downloadSVG}
              disabled={!options.value}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
            >
              <Download className="h-4 w-4" />
              SVG
            </button>
          </div>

          {/* Save style nudge */}
          {!session && options.value && (
            <motion.button
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleSaveStyle}
              className="w-full rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-left"
            >
              <p className="text-xs font-medium text-emerald-700">
                💾 Want to save your QR style?
              </p>
              <p className="text-xs text-emerald-500 mt-0.5">
                Sign in free to reuse colors and settings
              </p>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
