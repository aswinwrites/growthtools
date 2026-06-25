"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Download, Eye, EyeOff, RotateCcw, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// CONSTANTS — phone dimensions are FIXED, always portrait
// ─────────────────────────────────────────────────────────────

const SW = 260;        // screen inner width (px)
const SCREEN_H = 520;  // screen inner height (px) — never changes

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Platform = "instagram" | "facebook";
type UIStyle = "feed" | "story" | "reel" | "instream" | "column";

interface Placement {
  id: string;
  label: string;
  chip: string;
  platform: Platform;
  aspectRatio: string;
  ratio: number;
  dims: { w: number; h: number };
  danger: { top: number; bottom: number; left: number; right: number };
  uiStyle: UIStyle;
  minWidth: number;
  maxMB: number;
  formats: string[];
  note: string;
  textSafe: string;
}

// ─────────────────────────────────────────────────────────────
// PLACEMENTS
// ─────────────────────────────────────────────────────────────

const PLACEMENTS: Placement[] = [
  // ── INSTAGRAM ────────────────────────────────────────────
  {
    id: "ig-feed-sq", label: "Feed · Square", chip: "1:1", platform: "instagram",
    aspectRatio: "1:1", ratio: 1, dims: { w: 1080, h: 1080 },
    danger: { top: 0, bottom: 0, left: 0, right: 0 }, uiStyle: "feed",
    minWidth: 500, maxMB: 30, formats: ["JPG", "PNG"],
    note: "Most versatile feed format. Displays on mobile and desktop.",
    textSafe: "Leave 10% margin on all sides",
  },
  {
    id: "ig-feed-portrait", label: "Feed · Portrait", chip: "4:5", platform: "instagram",
    aspectRatio: "4:5", ratio: 4 / 5, dims: { w: 1080, h: 1350 },
    danger: { top: 0, bottom: 0, left: 0, right: 0 }, uiStyle: "feed",
    minWidth: 500, maxMB: 30, formats: ["JPG", "PNG"],
    note: "Largest feed format — takes up most mobile screen real estate.",
    textSafe: "Leave 10% margin on all sides",
  },
  {
    id: "ig-feed-landscape", label: "Feed · Landscape", chip: "1.91:1", platform: "instagram",
    aspectRatio: "1.91:1", ratio: 1.91, dims: { w: 1080, h: 566 },
    danger: { top: 0, bottom: 0, left: 0, right: 0 }, uiStyle: "feed",
    minWidth: 500, maxMB: 30, formats: ["JPG", "PNG"],
    note: "Wide format — same ratio as link previews.",
    textSafe: "Leave 10% margin on all sides",
  },
  {
    id: "ig-stories", label: "Stories", chip: "9:16", platform: "instagram",
    aspectRatio: "9:16", ratio: 9 / 16, dims: { w: 1080, h: 1920 },
    danger: { top: 14, bottom: 20, left: 5.5, right: 5.5 }, uiStyle: "story",
    minWidth: 500, maxMB: 30, formats: ["JPG", "PNG", "MP4", "MOV"],
    note: "Full-screen vertical. Static images show 5s, video up to 60s.",
    textSafe: "Middle 66% — between top UI bar (14%) and bottom CTA (20%)",
  },
  {
    id: "ig-reels", label: "Reels", chip: "9:16", platform: "instagram",
    aspectRatio: "9:16", ratio: 9 / 16, dims: { w: 1080, h: 1920 },
    danger: { top: 14, bottom: 35, left: 0, right: 10 }, uiStyle: "reel",
    minWidth: 500, maxMB: 4000, formats: ["MP4", "MOV"],
    note: "Video only. Shown in Reels tab and feed. Max 60 seconds.",
    textSafe: "Top-center — avoid right 10% (buttons) and bottom 35% (caption/CTA)",
  },
  {
    id: "ig-explore", label: "Explore", chip: "1:1", platform: "instagram",
    aspectRatio: "1:1", ratio: 1, dims: { w: 1080, h: 1080 },
    danger: { top: 0, bottom: 0, left: 0, right: 0 }, uiStyle: "feed",
    minWidth: 500, maxMB: 30, formats: ["JPG", "PNG"],
    note: "Shown in Explore grid and expanded view.",
    textSafe: "Leave 10% margin on all sides",
  },
  // ── FACEBOOK ─────────────────────────────────────────────
  {
    id: "fb-feed-sq", label: "Feed · Square", chip: "1:1", platform: "facebook",
    aspectRatio: "1:1", ratio: 1, dims: { w: 1080, h: 1080 },
    danger: { top: 0, bottom: 0, left: 0, right: 0 }, uiStyle: "feed",
    minWidth: 500, maxMB: 30, formats: ["JPG", "PNG"],
    note: "Standard Facebook news feed. Mobile and desktop.",
    textSafe: "Leave 10% margin on all sides",
  },
  {
    id: "fb-feed-portrait", label: "Feed · Portrait", chip: "4:5", platform: "facebook",
    aspectRatio: "4:5", ratio: 4 / 5, dims: { w: 1080, h: 1350 },
    danger: { top: 0, bottom: 0, left: 0, right: 0 }, uiStyle: "feed",
    minWidth: 500, maxMB: 30, formats: ["JPG", "PNG"],
    note: "Best mobile format for Facebook news feed.",
    textSafe: "Leave 10% margin on all sides",
  },
  {
    id: "fb-feed-landscape", label: "Feed · Landscape", chip: "1.91:1", platform: "facebook",
    aspectRatio: "1.91:1", ratio: 1.91, dims: { w: 1200, h: 628 },
    danger: { top: 0, bottom: 0, left: 0, right: 0 }, uiStyle: "feed",
    minWidth: 500, maxMB: 30, formats: ["JPG", "PNG"],
    note: "Link preview ratio. Best for website click campaigns.",
    textSafe: "Leave 10% margin on all sides",
  },
  {
    id: "fb-stories", label: "Stories", chip: "9:16", platform: "facebook",
    aspectRatio: "9:16", ratio: 9 / 16, dims: { w: 1080, h: 1920 },
    danger: { top: 14, bottom: 20, left: 5.5, right: 5.5 }, uiStyle: "story",
    minWidth: 500, maxMB: 30, formats: ["JPG", "PNG", "MP4", "MOV"],
    note: "Shares inventory with IG Stories in Advantage+ placements.",
    textSafe: "Middle 66% — between top UI bar (14%) and bottom CTA (20%)",
  },
  {
    id: "fb-reels", label: "Reels", chip: "9:16", platform: "facebook",
    aspectRatio: "9:16", ratio: 9 / 16, dims: { w: 1080, h: 1920 },
    danger: { top: 14, bottom: 35, left: 0, right: 10 }, uiStyle: "reel",
    minWidth: 500, maxMB: 4000, formats: ["MP4", "MOV"],
    note: "Facebook Reels. Action buttons on right side. Max 60 seconds.",
    textSafe: "Top-center — avoid right 10% (buttons) and bottom 35% (caption/CTA)",
  },
  {
    id: "fb-right-column", label: "Right Column", chip: "1:1", platform: "facebook",
    aspectRatio: "1:1", ratio: 1, dims: { w: 1080, h: 1080 },
    danger: { top: 0, bottom: 0, left: 0, right: 0 }, uiStyle: "column",
    minWidth: 400, maxMB: 30, formats: ["JPG", "PNG"],
    note: "Desktop only. Shows in Facebook right sidebar.",
    textSafe: "Full creative is safe — no UI overlay on the image",
  },
  {
    id: "fb-marketplace", label: "Marketplace", chip: "1:1", platform: "facebook",
    aspectRatio: "1:1", ratio: 1, dims: { w: 1080, h: 1080 },
    danger: { top: 0, bottom: 0, left: 0, right: 0 }, uiStyle: "feed",
    minWidth: 500, maxMB: 30, formats: ["JPG", "PNG"],
    note: "Shown in Facebook Marketplace browse feed.",
    textSafe: "Leave 10% margin on all sides",
  },
  {
    id: "fb-instream", label: "In-Stream Video", chip: "16:9", platform: "facebook",
    aspectRatio: "16:9", ratio: 16 / 9, dims: { w: 1280, h: 720 },
    danger: { top: 0, bottom: 15, left: 0, right: 0 }, uiStyle: "instream",
    minWidth: 1280, maxMB: 4000, formats: ["MP4", "MOV"],
    note: "Mid-roll in Facebook video content. 5–15 seconds.",
    textSafe: "Avoid bottom 15% — video controls + sponsored label",
  },
  {
    id: "fb-search", label: "Search Results", chip: "1:1", platform: "facebook",
    aspectRatio: "1:1", ratio: 1, dims: { w: 1080, h: 1080 },
    danger: { top: 0, bottom: 0, left: 0, right: 0 }, uiStyle: "feed",
    minWidth: 500, maxMB: 30, formats: ["JPG", "PNG"],
    note: "Shown in Facebook Search results.",
    textSafe: "Leave 10% margin on all sides",
  },
];

const IG_PLACEMENTS = PLACEMENTS.filter((p) => p.platform === "instagram");
const FB_PLACEMENTS = PLACEMENTS.filter((p) => p.platform === "facebook");

// ─────────────────────────────────────────────────────────────
// DANGER ZONE OVERLAYS
// ─────────────────────────────────────────────────────────────

const STRIPE = `repeating-linear-gradient(
  -45deg,
  rgba(239,68,68,0.6) 0px,
  rgba(239,68,68,0.6) 4px,
  rgba(239,68,68,0.22) 4px,
  rgba(239,68,68,0.22) 10px
)`;

function DangerZones({ danger, show }: { danger: Placement["danger"]; show: boolean }) {
  if (!show) return null;
  return (
    <>
      {danger.top > 0 && (
        <div className="absolute top-0 left-0 right-0 pointer-events-none z-10"
          style={{ height: `${danger.top}%`, background: STRIPE }} />
      )}
      {danger.bottom > 0 && (
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10"
          style={{ height: `${danger.bottom}%`, background: STRIPE }} />
      )}
      {danger.left > 0 && (
        <div className="absolute top-0 bottom-0 left-0 pointer-events-none z-10"
          style={{ width: `${danger.left}%`, background: STRIPE }} />
      )}
      {danger.right > 0 && (
        <div className="absolute top-0 bottom-0 right-0 pointer-events-none z-10"
          style={{ width: `${danger.right}%`, background: STRIPE }} />
      )}
    </>
  );
}

function SafeZoneBorder({ danger, show }: { danger: Placement["danger"]; show: boolean }) {
  if (!show) return null;
  const hasDanger = danger.top > 0 || danger.bottom > 0 || danger.left > 0 || danger.right > 0;
  if (!hasDanger) return null;
  return (
    <div
      className="absolute pointer-events-none z-10 border-2 border-dashed border-green-400/80"
      style={{
        top: `${Math.max(danger.top, 5)}%`,
        bottom: `${Math.max(danger.bottom, 5)}%`,
        left: `${Math.max(danger.left, 5)}%`,
        right: `${Math.max(danger.right, 5)}%`,
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// STATUS BAR
// ─────────────────────────────────────────────────────────────

function StatusBar({ dark = true }: { dark?: boolean }) {
  const c = dark ? "text-white" : "text-gray-900";
  return (
    <div className={`absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-4 z-20 ${c}`}>
      <span className="text-[11px] font-semibold mt-2">9:41</span>
      <div className="flex items-center gap-[5px] mt-2">
        <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
          <rect x="0" y="6" width="2.5" height="4" rx="0.4" />
          <rect x="4" y="4" width="2.5" height="6" rx="0.4" />
          <rect x="8" y="2" width="2.5" height="8" rx="0.4" opacity="0.6" />
          <rect x="12" y="0" width="2.5" height="10" rx="0.4" opacity="0.35" />
        </svg>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
          <path d="M7 2.2c1.7 0 3.2.7 4.3 1.8l1-1C10.8 1.6 9 .8 7 .8S3.2 1.6 1.7 3l1 1C3.8 2.9 5.3 2.2 7 2.2z" />
          <path d="M7 5c1 0 2 .4 2.7 1.1l1-1C9.6 4.2 8.4 3.6 7 3.6S4.4 4.2 3.3 5.1l1 1C5 5.4 6 5 7 5z" />
          <circle cx="7" cy="8.5" r="1.3" />
        </svg>
        <svg width="20" height="10" viewBox="0 0 20 10" fill="currentColor">
          <rect x="0.5" y="0.5" width="16" height="9" rx="2.5" stroke="currentColor" fill="none" strokeWidth="1" opacity="0.5" />
          <rect x="17" y="3" width="2.5" height="4" rx="1" opacity="0.4" />
          <rect x="2" y="2" width="12" height="6" rx="1.5" />
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PLACEHOLDER
// ─────────────────────────────────────────────────────────────

function PlaceholderCreative({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <div className={`w-full h-full flex flex-col items-center justify-center gap-2 ${dark ? "bg-gray-800" : "bg-gray-100"}`}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={dark ? "#4B5563" : "#9CA3AF"} strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
      <span className={`text-[10px] font-medium ${dark ? "text-gray-500" : "text-gray-400"}`}>{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// INSTAGRAM FEED UI
// ─────────────────────────────────────────────────────────────

function IGFeedUI({ imageUrl, placement, showOverlay }: { imageUrl: string | null; placement: Placement; showOverlay: boolean }) {
  // Image height inside the feed — capped so total content fits within SCREEN_H
  const topChrome = 40 + 44 + 50; // statusbar + nav + postHeader
  const bottomChrome = 46 + 36;   // actionBar + CTA
  const maxImgH = SCREEN_H - topChrome - bottomChrome; // 304px
  const naturalImgH = Math.round(SW / placement.ratio);
  const imgH = Math.min(naturalImgH, maxImgH);

  return (
    <div className="absolute inset-0 flex flex-col bg-white text-black overflow-hidden">
      <StatusBar dark={false} />

      {/* Nav */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 shrink-0 mt-10">
        <span className="font-bold text-[15px] italic tracking-tight">Instagram</span>
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 5a2 2 0 0 1 1.98-2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.5a16 16 0 0 0 6 6z" />
          </svg>
        </div>
      </div>

      {/* Post header */}
      <div className="flex items-center gap-2 px-3 py-2 shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-400 p-[2px] shrink-0">
          <div className="w-full h-full rounded-full bg-gray-200" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold leading-tight">yourbrand</p>
          <p className="text-[9px] text-gray-400 leading-tight">Sponsored ·</p>
        </div>
        <span className="text-[10px] font-semibold text-blue-500 shrink-0">Follow</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-gray-400">
          <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
        </svg>
      </div>

      {/* Image */}
      <div className="relative shrink-0 bg-gray-100" style={{ width: SW, height: imgH }}>
        {imageUrl
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={imageUrl} alt="Creative" className="w-full h-full object-cover" />
          : <PlaceholderCreative label={placement.aspectRatio} />
        }
        <DangerZones danger={placement.danger} show={showOverlay} />
        <SafeZoneBorder danger={placement.danger} show={showOverlay} />
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1 shrink-0">
        <div className="flex items-center gap-3">
          {[
            "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
            "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
            "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z",
          ].map((d, i) => (
            <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={d} />
            </svg>
          ))}
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </div>

      {/* CTA */}
      <div className="px-3 pb-2 shrink-0">
        <button className="w-full text-center text-[12px] font-semibold text-blue-600 border border-gray-200 rounded-lg py-1.5">
          Learn More →
        </button>
      </div>

      {/* Next post stub — fills remaining space for landscape/small images */}
      <div className="flex-1 bg-gray-50 border-t border-gray-100 flex flex-col">
        <div className="flex items-center gap-2 px-3 py-2 shrink-0">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-400" />
          <div className="h-2 w-20 bg-gray-200 rounded" />
        </div>
        <div className="flex-1 bg-gray-200/50 mx-0" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FACEBOOK FEED UI
// ─────────────────────────────────────────────────────────────

function FBFeedUI({ imageUrl, placement, showOverlay }: { imageUrl: string | null; placement: Placement; showOverlay: boolean }) {
  const topChrome = 40 + 44 + 54;
  const bottomChrome = 46 + 36;
  const maxImgH = SCREEN_H - topChrome - bottomChrome;
  const naturalImgH = Math.round(SW / placement.ratio);
  const imgH = Math.min(naturalImgH, maxImgH);

  return (
    <div className="absolute inset-0 flex flex-col bg-white text-black overflow-hidden">
      <StatusBar dark={false} />

      {/* FB nav */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 shrink-0 mt-10">
        <span className="font-bold text-[15px] text-blue-600">facebook</span>
        <div className="flex items-center gap-2">
          {[
            "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
            "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
          ].map((d, i) => (
            <div key={i} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-600">
                <path d={d} />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Post header */}
      <div className="flex items-center gap-2 px-3 py-2 shrink-0">
        <div className="w-9 h-9 rounded-full bg-blue-500 shrink-0 flex items-center justify-center text-white text-[11px] font-bold">YB</div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold leading-tight">Your Brand</p>
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-gray-400">Sponsored ·</span>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" />
            </svg>
          </div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-gray-400">
          <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
        </svg>
      </div>

      {/* Image */}
      <div className="relative shrink-0 bg-gray-100" style={{ width: SW, height: imgH }}>
        {imageUrl
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={imageUrl} alt="Creative" className="w-full h-full object-cover" />
          : <PlaceholderCreative label={placement.aspectRatio} />
        }
        <DangerZones danger={placement.danger} show={showOverlay} />
        <SafeZoneBorder danger={placement.danger} show={showOverlay} />
      </div>

      {/* CTA banner */}
      <div className="bg-gray-50 border-t border-gray-100 px-3 py-2 flex items-center justify-between shrink-0">
        <div>
          <p className="text-[9px] text-gray-400 uppercase tracking-wide">Sponsored</p>
          <p className="text-[11px] font-semibold text-gray-900 leading-tight">yourbrand.com</p>
        </div>
        <button className="bg-blue-600 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg shrink-0">
          Learn More
        </button>
      </div>

      {/* Reactions */}
      <div className="flex items-center justify-around px-3 py-1.5 border-t border-gray-100 shrink-0">
        {["👍 Like", "💬 Comment", "↗ Share"].map((a) => (
          <button key={a} className="text-[10px] text-gray-500 font-medium">{a}</button>
        ))}
      </div>

      {/* Next post stub */}
      <div className="flex-1 bg-gray-50 border-t-4 border-gray-100 flex flex-col">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-indigo-400" />
          <div className="h-2 w-24 bg-gray-200 rounded" />
        </div>
        <div className="flex-1 bg-gray-200/40" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STORY UI — fills fixed SCREEN_H, image object-covers
// ─────────────────────────────────────────────────────────────

function StoryUI({ imageUrl, placement, showOverlay, platform }: {
  imageUrl: string | null; placement: Placement; showOverlay: boolean; platform: Platform;
}) {
  return (
    <div className="absolute inset-0 bg-black" style={{ width: SW, height: SCREEN_H }}>
      {imageUrl
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={imageUrl} alt="Creative" className="absolute inset-0 w-full h-full object-cover" />
        : <PlaceholderCreative label="9:16" dark />
      }

      <DangerZones danger={placement.danger} show={showOverlay} />
      <SafeZoneBorder danger={placement.danger} show={showOverlay} />

      {/* Progress bars */}
      <div className="absolute top-10 left-0 right-0 flex gap-1 px-3 z-20">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[2.5px] flex-1 rounded-full bg-white/30 overflow-hidden">
            {i === 1 && <div className="h-full w-3/5 bg-white rounded-full" />}
          </div>
        ))}
      </div>

      {/* Profile row */}
      <div className="absolute top-14 left-0 right-0 flex items-center gap-2 px-3 z-20">
        {platform === "instagram"
          ? <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-400 p-[1.5px] shrink-0">
              <div className="w-full h-full rounded-full bg-gray-300" />
            </div>
          : <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">YB</div>
        }
        <div>
          <span className="text-white text-[11px] font-semibold drop-shadow">yourbrand</span>
          <span className="text-white/60 text-[9px] ml-1.5">Sponsored</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-2 pb-4 z-20">
        <div className="flex items-center gap-1 text-white">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="18 15 12 9 6 15" />
          </svg>
          <span className="text-[11px] font-semibold tracking-wide">See More</span>
        </div>
        <button className="bg-white text-gray-900 text-[12px] font-semibold px-6 py-2 rounded-full shadow-lg">
          Learn More
        </button>
        <div className="flex items-center gap-2 bg-black/25 backdrop-blur-sm rounded-full px-4 py-1.5">
          <div className="w-5 h-5 rounded-full bg-gray-400" />
          <span className="text-white/70 text-[10px]">Send message...</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// REELS UI — fills fixed SCREEN_H
// ─────────────────────────────────────────────────────────────

function ReelUI({ imageUrl, placement, showOverlay }: { imageUrl: string | null; placement: Placement; showOverlay: boolean }) {
  return (
    <div className="absolute inset-0 bg-black" style={{ width: SW, height: SCREEN_H }}>
      {imageUrl
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={imageUrl} alt="Creative" className="absolute inset-0 w-full h-full object-cover" />
        : <PlaceholderCreative label="9:16" dark />
      }

      <DangerZones danger={placement.danger} show={showOverlay} />
      <SafeZoneBorder danger={placement.danger} show={showOverlay} />

      {/* Right action column */}
      <div className="absolute right-2 bottom-[38%] flex flex-col items-center gap-4 z-20">
        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-500 mb-1" />
        {[{ icon: "♥", label: "24.5K" }, { icon: "💬", label: "483" }, { icon: "↗", label: "Share" }].map(({ icon, label }) => (
          <div key={label} className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-[14px]">{icon}</div>
            <span className="text-white text-[8px] mt-0.5 font-medium drop-shadow">{label}</span>
          </div>
        ))}
        <div className="w-7 h-7 rounded-full bg-gray-700 border-2 border-white/30 flex items-center justify-center mt-1">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
        </div>
      </div>

      {/* Bottom-left info */}
      <div className="absolute left-2 right-12 z-20 bottom-[22%]">
        <p className="text-white text-[11px] font-bold drop-shadow">@yourbrand <span className="text-white/60 font-normal text-[9px]">Sponsored</span></p>
        <p className="text-white/80 text-[10px] leading-tight drop-shadow mt-0.5">Your ad headline — short and punchy. ✨</p>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-white/50 text-[9px]">♪ Original Audio · yourbrand</span>
        </div>
      </div>

      {/* CTA button */}
      <div className="absolute left-0 right-0 z-20 px-2 bottom-[14%]">
        <button className="w-full bg-white/90 backdrop-blur-sm text-gray-900 text-[11px] font-semibold py-1.5 rounded-lg">
          Learn More
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// IN-STREAM UI — portrait phone, mid-roll experience
// ─────────────────────────────────────────────────────────────

function InStreamUI({ imageUrl, placement, showOverlay }: { imageUrl: string | null; placement: Placement; showOverlay: boolean }) {
  const adH = Math.round(SW / (16 / 9)); // ≈ 146px
  const contextH = SCREEN_H - adH - 40 - 40 - 36; // remaining for fake video context

  return (
    <div className="absolute inset-0 bg-black flex flex-col" style={{ width: SW, height: SCREEN_H }}>
      <StatusBar dark />

      {/* Context: fake video being watched */}
      <div className="relative shrink-0 bg-gray-900 overflow-hidden" style={{ height: Math.max(contextH, 80) }}>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-950 flex items-center justify-center">
          <svg className="text-white/10" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
        {/* Fake video scene */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-4 left-4 right-4 h-2 bg-white/10 rounded" />
          <div className="absolute bottom-4 left-4 right-16 h-1.5 bg-white/10 rounded" />
          <div className="absolute bottom-8 left-4 w-1/2 h-1 bg-white/10 rounded" />
        </div>
        {/* Paused indicator */}
        <div className="absolute top-2 right-3 bg-black/50 rounded px-1.5 py-0.5 text-white/50 text-[8px]">1:23 / 8:45</div>
      </div>

      {/* Ad break banner */}
      <div className="shrink-0 bg-gray-800 border-t border-gray-700 px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="bg-yellow-400 text-gray-900 text-[7px] font-black px-1.5 py-0.5 rounded">AD</span>
          <span className="text-white/60 text-[9px]">Your video will resume after</span>
        </div>
        <span className="text-white/40 text-[9px]">1 of 2</span>
      </div>

      {/* The 16:9 ad */}
      <div className="relative shrink-0" style={{ width: SW, height: adH }}>
        {imageUrl
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={imageUrl} alt="Creative" className="w-full h-full object-cover" />
          : <PlaceholderCreative label="16:9" dark />
        }
        <DangerZones danger={placement.danger} show={showOverlay} />
        <SafeZoneBorder danger={placement.danger} show={showOverlay} />
        <div className="absolute top-1.5 left-2 z-20 bg-black/60 text-yellow-300 text-[8px] font-bold px-1.5 py-0.5 rounded">Sponsored</div>
        <div className="absolute top-1.5 right-2 z-20 bg-black/60 text-white/80 text-[8px] px-1.5 py-0.5 rounded border border-white/20">Skip Ad ›</div>
      </div>

      {/* Video controls */}
      <div className="shrink-0 bg-gray-900 px-3 pt-2 pb-1">
        <div className="w-full h-1 bg-gray-700 rounded-full mb-2">
          <div className="h-full w-2/5 bg-blue-500 rounded-full" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-[9px]">0:06 / 0:15</span>
          <button className="text-white/70 text-[9px] border border-white/20 rounded px-2 py-0.5">Learn More</button>
          <span className="text-white/40 text-[9px]">Skip in 9s</span>
        </div>
      </div>

      {/* Bottom brand strip */}
      <div className="flex-1 bg-gray-950 flex items-center px-3 gap-2">
        <div className="w-6 h-6 rounded bg-gray-700 shrink-0" />
        <div className="flex-1">
          <div className="h-1.5 w-20 bg-gray-700 rounded mb-1" />
          <div className="h-1 w-14 bg-gray-800 rounded" />
        </div>
        <span className="text-gray-600 text-[8px] shrink-0">yourbrand.com</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PHONE FRAME — always the same portrait shape
// ─────────────────────────────────────────────────────────────

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative inline-block">
      {/* Volume buttons */}
      <div className="absolute left-[-4px] top-[80px] w-[4px] h-[24px] bg-gray-700 rounded-l-sm" />
      <div className="absolute left-[-4px] top-[114px] w-[4px] h-[36px] bg-gray-700 rounded-l-sm" />
      <div className="absolute left-[-4px] top-[158px] w-[4px] h-[36px] bg-gray-700 rounded-l-sm" />
      {/* Power button */}
      <div className="absolute right-[-4px] top-[120px] w-[4px] h-[48px] bg-gray-700 rounded-r-sm" />

      {/* Phone body */}
      <div className="bg-gray-900 rounded-[44px] p-[14px] shadow-2xl shadow-black/50" style={{ width: 290 }}>
        {/* Screen — fixed size always */}
        <div
          className="relative bg-black rounded-[32px] overflow-hidden"
          style={{ width: SW, height: SCREEN_H }}
        >
          {/* Dynamic Island */}
          <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[80px] h-[24px] bg-gray-900 rounded-full z-30" />

          {children}

          {/* Home indicator */}
          <div className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-16 h-[4px] bg-white/20 rounded-full z-30" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PLACEMENT PREVIEW
// ─────────────────────────────────────────────────────────────

function PlacementPreview({ placement, imageUrl, showOverlay, platform }: {
  placement: Placement; imageUrl: string | null; showOverlay: boolean; platform: Platform;
}) {
  let content: React.ReactNode;

  if (placement.uiStyle === "story") {
    content = <StoryUI imageUrl={imageUrl} placement={placement} showOverlay={showOverlay} platform={platform} />;
  } else if (placement.uiStyle === "reel") {
    content = <ReelUI imageUrl={imageUrl} placement={placement} showOverlay={showOverlay} />;
  } else if (placement.uiStyle === "instream") {
    content = <InStreamUI imageUrl={imageUrl} placement={placement} showOverlay={showOverlay} />;
  } else if (platform === "instagram") {
    content = <IGFeedUI imageUrl={imageUrl} placement={placement} showOverlay={showOverlay} />;
  } else {
    content = <FBFeedUI imageUrl={imageUrl} placement={placement} showOverlay={showOverlay} />;
  }

  return (
    <motion.div
      key={placement.id}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.18 }}
    >
      <PhoneFrame>{content}</PhoneFrame>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// SPECS PANEL
// ─────────────────────────────────────────────────────────────

function SpecsPanel({ placement }: { placement: Placement }) {
  const hasDanger = placement.danger.top > 0 || placement.danger.bottom > 0 || placement.danger.left > 0 || placement.danger.right > 0;
  const dangerEntries = [
    { label: "Top", val: placement.danger.top, dim: placement.dims.h },
    { label: "Bottom", val: placement.danger.bottom, dim: placement.dims.h },
    { label: "Left", val: placement.danger.left, dim: placement.dims.w },
    { label: "Right", val: placement.danger.right, dim: placement.dims.w },
  ].filter((e) => e.val > 0);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Dimensions</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">{placement.dims.w}</span>
          <span className="text-gray-400 font-medium">×</span>
          <span className="text-2xl font-bold text-gray-900">{placement.dims.h}</span>
          <span className="text-sm text-gray-400">px</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[
            placement.aspectRatio,
            `Min ${placement.minWidth}px`,
            `Max ${placement.maxMB >= 1000 ? `${placement.maxMB / 1000}GB` : `${placement.maxMB}MB`}`,
          ].map((t) => (
            <span key={t} className="text-xs bg-gray-50 text-gray-600 border border-gray-100 rounded-full px-2.5 py-1 font-medium">{t}</span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Formats</p>
        <div className="flex flex-wrap gap-1.5">
          {placement.formats.map((f) => (
            <span key={f} className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-semibold">{f}</span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Safe Zones</p>
        {hasDanger ? (
          <div className="space-y-2">
            {dangerEntries.map(({ label, val, dim }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: STRIPE, backgroundSize: "6px 6px" }} />
                  <span className="text-gray-600 font-medium">{label} danger</span>
                </div>
                <span className="font-bold text-red-600">
                  {val}% <span className="text-gray-400 text-xs font-normal">({Math.round(dim * val / 100)}px)</span>
                </span>
              </div>
            ))}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-green-700">
                <div className="w-2.5 h-2.5 rounded-sm border-2 border-dashed border-green-500" />
                <span className="font-medium">Text safe area</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{placement.textSafe}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2 text-sm text-green-700">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">No UI overlay</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{placement.textSafe}</p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">{placement.note}</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────

export default function MetaSafeZone() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [selectedId, setSelectedId] = useState<string>("ig-stories");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const placements = platform === "instagram" ? IG_PLACEMENTS : FB_PLACEMENTS;
  const placement = PLACEMENTS.find((p) => p.id === selectedId) ?? PLACEMENTS[3];

  const switchPlatform = useCallback((p: Platform) => {
    setPlatform(p);
    const next = PLACEMENTS.filter((x) => x.platform === p);
    const equiv = next.find((x) => x.uiStyle === placement.uiStyle) ?? next[0];
    setSelectedId(equiv.id);
  }, [placement.uiStyle]);

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setImageUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) loadImage(file);
  }, [loadImage]);

  const downloadWithOverlay = useCallback(() => {
    if (!imageUrl) return;
    const canvas = document.createElement("canvas");
    canvas.width = placement.dims.w;
    canvas.height = placement.dims.h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      if (showOverlay) {
        const { top, bottom, left, right } = placement.danger;
        const W = canvas.width; const H = canvas.height;
        const drawZone = (x: number, y: number, w: number, h: number) => {
          ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
          ctx.fillStyle = "rgba(239,68,68,0.3)"; ctx.fillRect(x, y, w, h);
          ctx.strokeStyle = "rgba(239,68,68,0.6)"; ctx.lineWidth = 8;
          for (let i = -(w + h); i < w + h; i += 28) {
            ctx.beginPath(); ctx.moveTo(x + i, y); ctx.lineTo(x + i + h, y + h); ctx.stroke();
          }
          ctx.restore();
        };
        if (top > 0) drawZone(0, 0, W, H * top / 100);
        if (bottom > 0) drawZone(0, H * (1 - bottom / 100), W, H * bottom / 100);
        if (left > 0) drawZone(0, 0, W * left / 100, H);
        if (right > 0) drawZone(W * (1 - right / 100), 0, W * right / 100, H);
        const hasDanger = top > 0 || bottom > 0 || left > 0 || right > 0;
        if (hasDanger) {
          ctx.setLineDash([24, 12]);
          ctx.strokeStyle = "rgba(34,197,94,0.85)"; ctx.lineWidth = 8;
          ctx.strokeRect(W * Math.max(left, 5) / 100, H * Math.max(top, 5) / 100,
            W * (1 - Math.max(left, 5) / 100 - Math.max(right, 5) / 100),
            H * (1 - Math.max(top, 5) / 100 - Math.max(bottom, 5) / 100));
          ctx.setLineDash([]);
        }
      }
      const link = document.createElement("a");
      link.download = `meta-safe-zone-${placement.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = imageUrl;
  }, [imageUrl, placement, showOverlay]);

  return (
    <div className="min-h-screen bg-gray-50/40">
      <div className="border-b border-gray-100 bg-white px-4 sm:px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Meta Safe Zone Checker</h1>
        <p className="mt-1 text-sm text-gray-500 max-w-2xl">
          Simulate how your creative looks across every Meta placement — with real safe zone overlays for Instagram & Facebook. No upload, runs entirely in browser.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-130px)]">
        {/* LEFT PANEL */}
        <div className="w-full lg:w-72 shrink-0 border-r border-gray-100 bg-white p-5 flex flex-col gap-5">
          {/* Platform */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Platform</p>
            <div className="flex rounded-xl border border-gray-100 p-1 bg-gray-50">
              {(["instagram", "facebook"] as Platform[]).map((p) => (
                <button key={p} onClick={() => switchPlatform(p)}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all ${
                    platform === p ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"}`}>
                  {p === "instagram"
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  }
                  <span className="capitalize">{p}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Placements */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Placement</p>
            <div className="space-y-0.5">
              {placements.map((p) => {
                const hasDanger = p.danger.top > 0 || p.danger.bottom > 0 || p.danger.left > 0 || p.danger.right > 0;
                return (
                  <button key={p.id} onClick={() => setSelectedId(p.id)}
                    className={`w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left transition-all ${
                      selectedId === p.id ? "bg-gray-900 text-white" : "hover:bg-gray-50 text-gray-700"}`}>
                    <span className="text-sm font-medium leading-tight">{p.label}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {hasDanger && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                      <span className={`text-xs font-mono px-1.5 py-0.5 rounded-md ${selectedId === p.id ? "bg-white/15 text-white/80" : "bg-gray-100 text-gray-500"}`}>
                        {p.chip}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Your Creative</p>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-6 px-4 cursor-pointer transition-all ${
                dragging ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
              {imageUrl
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={imageUrl} alt="thumb" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                : <Upload className="w-5 h-5 text-gray-400" />
              }
              <p className="text-xs text-center text-gray-500 leading-snug">
                {imageUrl ? "Click to change" : <>Drop image here<br /><span className="text-gray-400">or click to browse</span></>}
              </p>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) loadImage(f); }} />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-2 mt-auto">
            <button onClick={() => setShowOverlay(!showOverlay)}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                showOverlay ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {showOverlay ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {showOverlay ? "Overlays On" : "Overlays Off"}
            </button>
            <button onClick={downloadWithOverlay} disabled={!imageUrl}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              <Download className="w-4 h-4" /> Download with Overlay
            </button>
            {imageUrl && (
              <button onClick={() => { setImageUrl(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors">
                <RotateCcw className="w-3.5 h-3.5" /> Clear image
              </button>
            )}
          </div>
        </div>

        {/* CENTER — phone mockup */}
        <div className="flex-1 flex flex-col items-center justify-start py-10 px-4 gap-4 bg-gray-50/40">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">
              {platform === "instagram" ? "Instagram" : "Facebook"} · {placement.label}
            </span>
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-mono">
              {placement.dims.w}×{placement.dims.h}px
            </span>
          </div>

          {showOverlay && (placement.danger.top > 0 || placement.danger.bottom > 0 || placement.danger.left > 0 || placement.danger.right > 0) && (
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-3 rounded-sm" style={{ background: STRIPE, backgroundSize: "6px 6px" }} />
                <span>Danger zone</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-3 rounded-sm border-2 border-dashed border-green-400" />
                <span>Text safe area</span>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            <PlacementPreview
              key={placement.id}
              placement={placement}
              imageUrl={imageUrl}
              showOverlay={showOverlay}
              platform={platform}
            />
          </AnimatePresence>

          <p className="text-xs text-gray-400 text-center max-w-xs leading-relaxed">
            Creative renders at <strong>{placement.aspectRatio}</strong> — upload any image to see how it fits
          </p>
        </div>

        {/* RIGHT PANEL — specs */}
        <div className="w-full lg:w-72 shrink-0 border-l border-gray-100 bg-white p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Placement Specs</p>
          <SpecsPanel placement={placement} />
        </div>
      </div>
    </div>
  );
}
