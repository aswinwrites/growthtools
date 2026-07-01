"use client";

import { useState } from "react";
import {
  Link2, Search, QrCode, Tag, Ruler, Braces, RefreshCw,
  Table, FileText, Database, Shield, Smartphone, LayoutGrid, Linkedin,
} from "lucide-react";
import ToolCard from "@/components/shared/tool-card";
import { trackEvent } from "@/lib/analytics";

const CATEGORIES = [
  { id: "all", label: "All Tools", icon: LayoutGrid },
  { id: "campaign", label: "Campaign & Tracking", icon: Link2 },
  { id: "paid-search", label: "Paid Search", icon: Search },
  { id: "aso", label: "App & ASO", icon: Smartphone },
  { id: "creative", label: "Creative & Ads", icon: Shield },
  { id: "data", label: "Data & Utilities", icon: Database },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

const tools = [
  {
    name: "UTM Builder",
    description: "Build campaign URLs for web and app. Presets for Google, Meta, LinkedIn, WhatsApp. Includes Play Store referrer URL builder for mobile UA campaigns.",
    href: "/utm-builder",
    icon: <Link2 className="h-5 w-5" />,
    colorClass: "text-blue-600",
    bgClass: "bg-blue-50",
    category: "campaign" as CategoryId,
  },
  {
    name: "URL Shortener",
    description: "Shorten links instantly. Logged-in users get click tracking, geography, city-level data, device, browser, and 14-day analytics.",
    href: "/url-shortener",
    icon: <Tag className="h-5 w-5" />,
    colorClass: "text-orange-600",
    bgClass: "bg-orange-50",
    category: "campaign" as CategoryId,
  },
  {
    name: "QR Code Generator",
    description: "Generate QR codes for URLs, text, phone numbers, and app links. Custom colors, dot styles, logo upload. Export PNG or SVG.",
    href: "/qr-generator",
    icon: <QrCode className="h-5 w-5" />,
    colorClass: "text-emerald-600",
    bgClass: "bg-emerald-50",
    category: "campaign" as CategoryId,
  },
  {
    name: "Keyword Match Type Tool",
    description: "Convert keywords to Broad, Phrase, and Exact match in bulk. CSV export, copy all, keyword and character count.",
    href: "/match-type",
    icon: <Search className="h-5 w-5" />,
    colorClass: "text-violet-600",
    bgClass: "bg-violet-50",
    category: "paid-search" as CategoryId,
  },
  {
    name: "Screenshot Dimension Checker",
    description: "Upload screenshots and instantly verify they meet App Store and Play Store size requirements. Checks all iPhone, iPad, and Android sizes. Runs entirely in-browser.",
    href: "/screenshot-checker",
    icon: <Ruler className="h-5 w-5" />,
    colorClass: "text-sky-600",
    bgClass: "bg-sky-50",
    category: "aso" as CategoryId,
  },
  {
    name: "Meta Safe Zone Checker",
    description: "Simulate your ad creative across all Meta placements — Stories, Reels, Feed, In-Stream and more. Real safe zone overlays for Instagram & Facebook.",
    href: "/meta-safe-zone",
    icon: <Shield className="h-5 w-5" />,
    colorClass: "text-pink-600",
    bgClass: "bg-pink-50",
    category: "creative" as CategoryId,
  },
  {
    name: "JSON Formatter",
    description: "Format, minify, and validate JSON with syntax highlighting. See key count, depth, and size stats. Copy or download. Runs entirely in-browser.",
    href: "/json-formatter",
    icon: <Braces className="h-5 w-5" />,
    colorClass: "text-blue-600",
    bgClass: "bg-blue-50",
    category: "data" as CategoryId,
  },
  {
    name: "Image Converter",
    description: "Convert between PNG, JPEG, WebP, and SVG. Adjust quality and scale SVGs to any resolution. Client-side only — no upload, no watermark.",
    href: "/image-converter",
    icon: <RefreshCw className="h-5 w-5" />,
    colorClass: "text-amber-600",
    bgClass: "bg-amber-50",
    category: "data" as CategoryId,
  },
  {
    name: "Image to CSV",
    description: "Upload a screenshot of any table and extract clean, downloadable CSV data with AI. Works on spreadsheets, reports, dashboards, and more.",
    href: "/image-to-csv",
    icon: <Table className="h-5 w-5" />,
    colorClass: "text-teal-600",
    bgClass: "bg-teal-50",
    category: "data" as CategoryId,
  },
  {
    name: "Screenshot to Text",
    description: "Extract text from any screenshot or image instantly using AI. Preserves structure, headings, and layout. Copy or download as .txt.",
    href: "/screenshot-to-text",
    icon: <FileText className="h-5 w-5" />,
    colorClass: "text-emerald-600",
    bgClass: "bg-emerald-50",
    category: "data" as CategoryId,
  },
  {
    name: "Spreadsheet Operations",
    description: "26 browser-based operations: VLOOKUP, joins, find missing, detect changes, dedup, split columns, extract emails and more. CSV & XLSX. No uploads.",
    href: "/spreadsheet",
    icon: <Database className="h-5 w-5" />,
    colorClass: "text-cyan-600",
    bgClass: "bg-cyan-50",
    category: "data" as CategoryId,
  },
  {
    name: "LinkedIn Text Formatter",
    description: "Bold, italic, script, strikethrough and 12+ styles for LinkedIn posts. Selection-based formatting, live preview with see-more truncation, AI hook ideas, hashtags, and tone rewriter.",
    href: "/linkedin-formatter",
    icon: <Linkedin className="h-5 w-5" />,
    colorClass: "text-blue-600",
    bgClass: "bg-blue-50",
    category: "campaign" as CategoryId,
  },
];

export default function ToolsGrid() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");

  const filtered =
    activeCategory === "all"
      ? tools
      : tools.filter((t) => t.category === activeCategory);

  return (
    <section className="bg-gray-50/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            The complete marketer&apos;s toolkit
          </h2>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
            Every tool you need to run better campaigns. Free forever. No paywalls.
            No forced signups. Just utilities that save hours.
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                trackEvent("tools_filter_tab", { category: cat.id });
              }}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              <cat.icon className="h-3.5 w-3.5" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((tool, i) => (
            <ToolCard
              key={tool.href}
              {...tool}
              index={i}
              onClick={() => trackEvent("tool_card_click", { tool_name: tool.name, tool_slug: tool.href })}
            />
          ))}
        </div>

        {activeCategory !== "all" && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setActiveCategory("all")}
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors underline underline-offset-2"
            >
              Show all {tools.length} tools
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
