"use client";

import { useState, useRef, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy, Check, Trash2, Sparkles, Hash, Wand2,
  ChevronDown, ThumbsUp, MessageCircle, Repeat2, Send,
  Type, List, Zap, Monitor, Smartphone, ImagePlus, X,
  Globe, MoreHorizontal, BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { applyFormat, FORMAT_PREVIEW, FormatKey } from "./unicode";

// ─── Constants ───────────────────────────────────────────────────────────────

const LINKEDIN_LIMIT = 3000;

// Lines-based see-more (closer to real LinkedIn behavior)
// Desktop: ~72 chars per line, show 5 lines
// Mobile: ~38 chars per line, show 3 lines
const SEE_MORE = {
  desktop: { cpl: 72, lines: 5 },
  mobile:  { cpl: 38, lines: 3 },
};

function getVisualLineCount(text: string, cpl: number): number {
  return text.split("\n").reduce((acc, line) => {
    if (!line.trim()) return acc + 1;                     // blank line = 1 visual line
    return acc + Math.max(1, Math.ceil(line.length / cpl));
  }, 0);
}

function buildTruncated(text: string, cpl: number, limit: number): string {
  const lines = text.split("\n");
  let used = 0;
  const out: string[] = [];
  for (const line of lines) {
    const lc = !line.trim() ? 1 : Math.max(1, Math.ceil(line.length / cpl));
    if (used + lc > limit) {
      // fit as many chars as remaining lines allow
      const remaining = limit - used;
      if (remaining > 0 && line.trim()) {
        out.push(line.slice(0, remaining * cpl).trimEnd());
      }
      break;
    }
    out.push(line);
    used += lc;
  }
  return out.join("\n");
}

const TONES = [
  { id: "professional", label: "Professional" },
  { id: "casual",       label: "Casual"       },
  { id: "storytelling", label: "Story-led"    },
  { id: "provocative",  label: "Provocative"  },
] as const;

type Tone     = (typeof TONES)[number]["id"];
type ViewMode = "desktop" | "mobile";

// ─── Format groups ────────────────────────────────────────────────────────────

interface FormatBtn { key: FormatKey; label: string; preview: string }

const TEXT_FORMATS: FormatBtn[] = [
  { key: "bold",          label: "Bold",      preview: FORMAT_PREVIEW.bold          },
  { key: "italic",        label: "Italic",    preview: FORMAT_PREVIEW.italic        },
  { key: "boldItalic",    label: "Bold It.",  preview: FORMAT_PREVIEW.boldItalic    },
  { key: "sansBold",      label: "Sans B",    preview: FORMAT_PREVIEW.sansBold      },
  { key: "sansItalic",    label: "Sans I",    preview: FORMAT_PREVIEW.sansItalic    },
  { key: "script",        label: "Script",    preview: FORMAT_PREVIEW.script        },
  { key: "monospace",     label: "Mono",      preview: FORMAT_PREVIEW.monospace     },
  { key: "doubleStruck",  label: "Double",    preview: FORMAT_PREVIEW.doubleStruck  },
  { key: "strikethrough", label: "Strike",    preview: FORMAT_PREVIEW.strikethrough },
  { key: "underline",     label: "Underline", preview: FORMAT_PREVIEW.underline     },
  { key: "uppercase",     label: "UPPER",     preview: FORMAT_PREVIEW.uppercase     },
  { key: "lowercase",     label: "lower",     preview: FORMAT_PREVIEW.lowercase     },
];

const LIST_FORMATS: FormatBtn[] = [
  { key: "bulletList", label: "Bullets",   preview: FORMAT_PREVIEW.bulletList },
  { key: "numberList", label: "Numbered",  preview: FORMAT_PREVIEW.numberList },
  { key: "checkList",  label: "Checklist", preview: FORMAT_PREVIEW.checkList  },
  { key: "arrowList",  label: "Arrows",    preview: FORMAT_PREVIEW.arrowList  },
];

// ─── LinkedIn emoji palette ───────────────────────────────────────────────────

const EMOJIS = [
  { emoji: "🚀", label: "Rocket"      },
  { emoji: "✅", label: "Green tick"  },
  { emoji: "❌", label: "Red X"       },
  { emoji: "⏰", label: "Timer"       },
  { emoji: "💡", label: "Idea"        },
  { emoji: "🎯", label: "Target"      },
  { emoji: "🔥", label: "Fire"        },
  { emoji: "📈", label: "Growth"      },
  { emoji: "💪", label: "Strong"      },
  { emoji: "✍️", label: "Writing"     },
  { emoji: "👇", label: "Point down"  },
  { emoji: "🏆", label: "Trophy"      },
  { emoji: "⚡", label: "Energy"      },
  { emoji: "🌟", label: "Star"        },
  { emoji: "🙌", label: "Celebrate"   },
];

// ─── Accurate LinkedIn Preview ────────────────────────────────────────────────

function LinkedInPreview({
  text,
  image,
  mode,
}: {
  text: string;
  image: string | null;
  mode: ViewMode;
}) {
  const [expanded, setExpanded] = useState(false);
  const cfg = SEE_MORE[mode];
  const needsTrunc = getVisualLineCount(text, cfg.cpl) > cfg.lines;
  const displayText = !expanded && needsTrunc ? buildTruncated(text, cfg.cpl, cfg.lines) : text;

  // Render post text: preserve line breaks as <br> + blank lines as paragraph gaps
  function renderText(raw: string) {
    return raw.split("\n").map((line, i, arr) => (
      <span key={i}>
        {line}
        {i < arr.length - 1 && (
          line === "" ? <><br /></> : <br />
        )}
      </span>
    ));
  }

  const isMobile = mode === "mobile";

  const card = (
    <div
      className={cn(
        "bg-white font-sans overflow-hidden",
        isMobile
          ? "w-full border-0"
          : "rounded-lg border border-[rgba(0,0,0,0.12)] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
      )}
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
    >
      {/* ── Header ─────────────────────────────── */}
      <div className="flex items-start justify-between px-4 pt-3 pb-0">
        <div className="flex items-start gap-2.5">
          {/* Avatar */}
          <div
            className="rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold shrink-0 overflow-hidden"
            style={{ width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, fontSize: isMobile ? 14 : 16 }}
          >
            You
          </div>
          {/* Name + meta */}
          <div className="min-w-0 pt-0.5">
            <div className="flex items-center gap-1 flex-wrap">
              <span
                className="font-semibold leading-tight text-[rgba(0,0,0,0.9)]"
                style={{ fontSize: isMobile ? 14 : 14 }}
              >
                Your Name
              </span>
              {/* Verified badge — same as LinkedIn's blue check */}
              <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#0a66c2] shrink-0" title="Verified">
                <BadgeCheck className="w-3 h-3 text-white" strokeWidth={3} />
              </span>
              <span className="text-[rgba(0,0,0,0.6)]" style={{ fontSize: 14 }}>· You</span>
            </div>
            <p
              className="text-[rgba(0,0,0,0.6)] leading-tight truncate"
              style={{ fontSize: 12, maxWidth: isMobile ? 200 : 310, lineHeight: 1.33 }}
            >
              Marketing at Acme Corp | Growth &amp; Product | Marketer
            </p>
            <p className="flex items-center gap-1 text-[rgba(0,0,0,0.6)]" style={{ fontSize: 12 }}>
              13h ·
              <Globe className="w-3 h-3 text-[rgba(0,0,0,0.4)]" strokeWidth={1.5} />
            </p>
          </div>
        </div>
        {/* Top-right controls */}
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <button
            className="text-[#0a66c2] font-semibold border border-[#0a66c2] rounded-full px-3 py-0.5 leading-none hover:bg-blue-50 transition-colors"
            style={{ fontSize: 14 }}
          >
            Follow
          </button>
          <MoreHorizontal className="w-5 h-5 text-[rgba(0,0,0,0.6)]" strokeWidth={1.5} />
        </div>
      </div>

      {/* ── Post Body ──────────────────────────── */}
      <div className="px-4 pt-2 pb-2">
        {text ? (
          <p
            className="text-[rgba(0,0,0,0.9)] leading-[1.42857] select-text"
            style={{ fontSize: 14 }}
          >
            {renderText(displayText)}
            {needsTrunc && !expanded && (
              <>
                <span className="text-[rgba(0,0,0,0.6)]">…</span>
                <button
                  onClick={() => setExpanded(true)}
                  className="text-[rgba(0,0,0,0.6)] font-semibold hover:text-[rgba(0,0,0,0.9)] ml-1"
                  style={{ fontSize: 14 }}
                >
                  see more
                </button>
              </>
            )}
            {expanded && needsTrunc && (
              <button
                onClick={() => setExpanded(false)}
                className="text-[rgba(0,0,0,0.6)] font-semibold hover:text-[rgba(0,0,0,0.9)] ml-1"
                style={{ fontSize: 14 }}
              >
                show less
              </button>
            )}
          </p>
        ) : (
          <p className="text-gray-300 italic" style={{ fontSize: 14 }}>
            Start typing to see your post preview…
          </p>
        )}
      </div>

      {/* ── Image ──────────────────────────────── */}
      {image && (
        <div className="w-full bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="Post image" className="w-full object-cover max-h-[400px]" />
        </div>
      )}

      {/* ── Reactions count ────────────────────── */}
      {text && (
        <div className="px-4 pt-1.5 pb-0.5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="flex -space-x-1">
              <span className="text-base leading-none">👍</span>
              <span className="text-base leading-none">❤️</span>
            </span>
            <span className="text-[rgba(0,0,0,0.6)] hover:text-[#0a66c2] hover:underline cursor-pointer" style={{ fontSize: 12 }}>
              57
            </span>
          </div>
          <div className="flex gap-1 text-[rgba(0,0,0,0.6)]" style={{ fontSize: 12 }}>
            <span className="hover:text-[#0a66c2] hover:underline cursor-pointer">24 comments</span>
            <span>·</span>
            <span className="hover:text-[#0a66c2] hover:underline cursor-pointer">6 reposts</span>
          </div>
        </div>
      )}

      {/* ── Action Bar ─────────────────────────── */}
      <div
        className={cn(
          "flex items-center border-t border-[rgba(0,0,0,0.08)]",
          isMobile ? "mt-1 px-1" : "mt-1 px-2"
        )}
      >
        {[
          { icon: ThumbsUp, label: "Like" },
          { icon: MessageCircle, label: "Comment" },
          { icon: Repeat2, label: "Repost" },
          { icon: Send, label: "Send" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex flex-1 items-center justify-center gap-1.5 text-[rgba(0,0,0,0.6)] hover:text-[rgba(0,0,0,0.9)] hover:bg-[rgba(0,0,0,0.04)] rounded-lg py-2.5 transition-colors"
            style={{ fontSize: isMobile ? 11 : 12, fontWeight: 600 }}
          >
            <Icon className={cn(isMobile ? "w-4 h-4" : "w-4 h-4")} strokeWidth={1.75} />
            {!isMobile && label}
          </button>
        ))}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="flex justify-center">
        {/* Phone frame */}
        <div
          className="relative bg-white rounded-[2.5rem] border-[6px] border-gray-800 shadow-2xl overflow-hidden"
          style={{ width: 375, minHeight: 120 }}
        >
          {/* Status bar */}
          <div className="flex items-center justify-between bg-white px-5 pt-2 pb-1">
            <span className="text-xs font-semibold text-gray-900">9:41</span>
            <div className="w-20 h-5 bg-gray-900 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-1" />
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5 items-end">
                {[2,3,4,5].map(h => <div key={h} className="w-0.5 bg-gray-900 rounded-sm" style={{height: h}} />)}
              </div>
              <span className="text-xs font-semibold text-gray-900">●●</span>
            </div>
          </div>
          {/* LinkedIn mobile header bar */}
          <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">in</div>
            <span className="flex-1 text-xs font-semibold text-gray-900">LinkedIn</span>
            <div className="flex gap-2 text-gray-600">
              <MessageCircle className="w-4 h-4" />
              <Hash className="w-4 h-4" />
            </div>
          </div>
          {/* Scrollable content */}
          <div className="overflow-y-auto" style={{ maxHeight: 520 }}>
            {card}
          </div>
          {/* Bottom nav */}
          <div className="bg-white border-t border-gray-200 flex justify-around py-2 px-4">
            {["🏠","🔍","➕","🔔","👤"].map(icon => (
              <button key={icon} className="text-base">{icon}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[552px] mx-auto">
      {/* Desktop LinkedIn header hint */}
      <div className="flex items-center gap-2 mb-2 px-1">
        <div className="w-5 h-5 rounded bg-[#0a66c2] flex items-center justify-center">
          <span className="text-white font-bold text-[10px]">in</span>
        </div>
        <span className="text-xs text-gray-500">linkedin.com feed view</span>
      </div>
      {card}
    </div>
  );
}

// ─── Char Counter ─────────────────────────────────────────────────────────────

function CharCounter({ count, mode }: { count: number; mode: ViewMode }) {
  const pct = Math.min((count / LINKEDIN_LIMIT) * 100, 100);
  const cfg = SEE_MORE[mode];
  // Approx chars before see-more
  const seeMoreApproxChars = cfg.lines * cfg.cpl;
  const over = count > LINKEDIN_LIMIT;
  const warn = count > 2500;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">Characters</span>
        <span className={cn("font-mono font-medium tabular-nums",
          over ? "text-red-600" : warn ? "text-amber-500" : "text-gray-500"
        )}>
          {count.toLocaleString()} / {LINKEDIN_LIMIT.toLocaleString()}
        </span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full transition-colors",
            over ? "bg-red-500" : warn ? "bg-amber-400" : "bg-blue-500"
          )}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      {count > seeMoreApproxChars && (
        <p className="text-xs text-amber-600">
          "see more" likely shown — {mode} view cuts at ~{cfg.lines} visual lines
        </p>
      )}
    </div>
  );
}

// ─── Format Button ────────────────────────────────────────────────────────────

function FmtBtn({ btn, onClick }: { btn: FormatBtn; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={btn.label}
      className="group flex flex-col items-center gap-0.5 rounded-xl border border-gray-200 bg-white px-2.5 py-2 hover:border-blue-300 hover:bg-blue-50 transition-all min-w-[58px]"
    >
      <span className="text-sm text-gray-700 group-hover:text-blue-700 leading-tight truncate max-w-[68px]">
        {btn.preview}
      </span>
      <span className="text-[10px] text-gray-400 group-hover:text-blue-500 uppercase tracking-wide leading-none">
        {btn.label}
      </span>
    </button>
  );
}

// ─── AI Panel ────────────────────────────────────────────────────────────────

function AIPanel({ text }: { text: string }) {
  const [hooks, setHooks]         = useState<string[]>([]);
  const [hashtags, setHashtags]   = useState<string>("");
  const [rewritten, setRewritten] = useState<string>("");
  const [activeTone, setActiveTone] = useState<Tone>("professional");
  const [showToneMenu, setShowToneMenu] = useState(false);
  const [loading, setLoading]     = useState<"hooks"|"hashtags"|"rewrite"|null>(null);

  const callAI = useCallback(async (action: "hooks"|"hashtags"|"rewrite") => {
    if (!text.trim()) { toast.error("Write your post first"); return; }
    setLoading(action);
    trackEvent("linkedin_ai_used", { action });
    try {
      const res = await fetch("/api/linkedin-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, text, tone: activeTone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      if (action === "hooks")    setHooks(data.result.split("\n").filter(Boolean));
      if (action === "hashtags") setHashtags(data.result.trim());
      if (action === "rewrite")  setRewritten(data.result.trim());
    } catch { toast.error("AI failed — try again"); }
    finally  { setLoading(null); }
  }, [text, activeTone]);

  const copy = (t: string) => navigator.clipboard.writeText(t).then(() => toast.success("Copied!"));

  return (
    <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-purple-500" />
        <span className="text-sm font-semibold text-purple-800">AI Features</span>
        <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide">Beta</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => callAI("hooks")} disabled={!!loading}
          className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-white px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50 disabled:opacity-50 transition-all">
          <Zap className={cn("h-3.5 w-3.5", loading==="hooks" && "animate-pulse")} />
          {loading === "hooks" ? "Generating…" : "Hook Ideas"}
        </button>

        <button onClick={() => callAI("hashtags")} disabled={!!loading}
          className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-white px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50 disabled:opacity-50 transition-all">
          <Hash className={cn("h-3.5 w-3.5", loading==="hashtags" && "animate-pulse")} />
          {loading === "hashtags" ? "Generating…" : "Hashtags"}
        </button>

        <div className="flex rounded-xl overflow-hidden border border-purple-200 bg-white">
          <button onClick={() => callAI("rewrite")} disabled={!!loading}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50 disabled:opacity-50 transition-all border-r border-purple-200">
            <Wand2 className={cn("h-3.5 w-3.5", loading==="rewrite" && "animate-pulse")} />
            {loading === "rewrite" ? "Rewriting…" : "Rewrite as"}
          </button>
          <div className="relative">
            <button onClick={() => setShowToneMenu(v => !v)}
              className="flex items-center gap-1 px-2.5 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50 transition-all">
              <span className="text-xs capitalize">{activeTone}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            <AnimatePresence>
              {showToneMenu && (
                <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden min-w-[130px]">
                  {TONES.map(t => (
                    <button key={t.id} onClick={() => { setActiveTone(t.id); setShowToneMenu(false); }}
                      className={cn("w-full text-left px-3 py-2 text-sm transition-colors hover:bg-purple-50",
                        activeTone===t.id ? "text-purple-700 font-medium bg-purple-50" : "text-gray-700")}>
                      {t.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {hooks.length > 0 && (
          <motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hook Ideas</p>
            {hooks.map((h, i) => (
              <div key={i} className="flex items-start justify-between gap-2 rounded-xl bg-white border border-purple-100 px-3 py-2.5">
                <p className="text-sm text-gray-700 flex-1 leading-snug">{h}</p>
                <button onClick={() => copy(h)} className="shrink-0 text-gray-400 hover:text-purple-600 transition-colors">
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
        {hashtags && (
          <motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Suggested Hashtags</p>
              <button onClick={() => copy(hashtags)} className="text-gray-400 hover:text-purple-600 transition-colors"><Copy className="h-3.5 w-3.5" /></button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {hashtags.split(/\s+/).filter(Boolean).map((tag, i) => (
                <button key={i} onClick={() => copy(tag)}
                  className="text-xs bg-white border border-purple-100 text-purple-700 px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors">
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        )}
        {rewritten && (
          <motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rewritten — {activeTone}</p>
              <button onClick={() => copy(rewritten)} className="text-gray-400 hover:text-purple-600 transition-colors"><Copy className="h-3.5 w-3.5" /></button>
            </div>
            <div className="rounded-xl bg-white border border-purple-100 px-3 py-3">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{rewritten}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LinkedInFormatter() {
  const [text, setText]             = useState("");
  const [copied, setCopied]         = useState(false);
  const [mode, setMode]             = useState<ViewMode>("desktop");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputId = useId();

  const insertEmoji = useCallback((emoji: string) => {
    const ta = textareaRef.current;
    if (!ta) {
      // No textarea focus — just copy
      navigator.clipboard.writeText(emoji).then(() => toast.success(`${emoji} copied!`));
      return;
    }
    const { selectionStart, selectionEnd, value } = ta;
    const newVal = value.slice(0, selectionStart) + emoji + value.slice(selectionEnd);
    setText(newVal);
    const pos = selectionStart + emoji.length;
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(pos, pos); });
    trackEvent("linkedin_emoji_inserted", { emoji });
  }, []);

  const handleFormat = useCallback((key: FormatKey) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart, selectionEnd, value } = ta;
    const hasSel = selectionStart !== selectionEnd;
    const target = hasSel ? value.slice(selectionStart, selectionEnd) : value;
    if (!target.trim()) { toast.error("Nothing to format — write something first"); return; }
    const formatted = applyFormat(target, key);
    const newVal = hasSel
      ? value.slice(0, selectionStart) + formatted + value.slice(selectionEnd)
      : formatted;
    setText(newVal);
    trackEvent("linkedin_format_applied", { format: key, selection: hasSel });
    requestAnimationFrame(() => {
      ta.focus();
      if (hasSel) ta.setSelectionRange(selectionStart, selectionStart + formatted.length);
    });
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreviewImage(ev.target?.result as string);
      trackEvent("linkedin_image_added");
    };
    reader.readAsDataURL(file);
  };

  const copyAll = () => {
    if (!text.trim()) { toast.error("Nothing to copy"); return; }
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
      trackEvent("linkedin_text_copied");
    });
  };

  const clear = () => { setText(""); textareaRef.current?.focus(); trackEvent("linkedin_text_cleared"); };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 items-start">

      {/* ── Left: Editor ────────────────────────── */}
      <div className="space-y-4">
        {/* Tip */}
        <div className="flex items-start gap-2 text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 leading-relaxed">
          <span className="font-semibold shrink-0">Tip:</span>
          <span>Select specific words and apply a style — or leave nothing selected to format the whole post.</span>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Write your LinkedIn post here…\n\nI went from 0 to 10k followers in 90 days.\n\nHere's the strategy nobody talks about:\n\n→ Consistency beats virality every time\n→ Comments > Likes for reach\n→ Your niche is your biggest moat\n\nSelect any word above and hit Bold, Script, or any style below.`}
            className="w-full h-60 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none leading-relaxed transition-all"
            maxLength={LINKEDIN_LIMIT + 100}
          />
          {text && (
            <button onClick={clear} className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition-colors" title="Clear">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Char counter */}
        <CharCounter count={text.length} mode={mode} />

        {/* Text styles */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Type className="h-3.5 w-3.5 text-gray-400" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Text Styles</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {TEXT_FORMATS.map((btn) => <FmtBtn key={btn.key} btn={btn} onClick={() => handleFormat(btn.key)} />)}
          </div>
        </div>

        {/* List styles */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <List className="h-3.5 w-3.5 text-gray-400" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lists</p>
            <span className="text-[10px] text-gray-400">(applies per line)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {LIST_FORMATS.map((btn) => <FmtBtn key={btn.key} btn={btn} onClick={() => handleFormat(btn.key)} />)}
          </div>
        </div>

        {/* Emoji palette */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm leading-none">😊</span>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Emojis</p>
            <span className="text-[10px] text-gray-400">(click to insert at cursor)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {EMOJIS.map(({ emoji, label }) => (
              <button
                key={emoji}
                onClick={() => insertEmoji(emoji)}
                title={label}
                className="group relative flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 transition-all text-lg leading-none"
              >
                {emoji}
                <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2 py-1 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Panel */}
        <AIPanel text={text} />
      </div>

      {/* ── Right: Preview ───────────────────────── */}
      <div className="space-y-4 xl:sticky xl:top-24">

        {/* Desktop / Mobile toggle */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Preview</p>
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            {(["desktop", "mobile"] as ViewMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all",
                  mode === m
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                )}
              >
                {m === "desktop" ? <Monitor className="h-3.5 w-3.5" /> : <Smartphone className="h-3.5 w-3.5" />}
                <span className="capitalize">{m}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <LinkedInPreview text={text} image={previewImage} mode={mode} />

        {/* Image upload */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Post Image</p>
          {previewImage ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewImage} alt="Preview" className="w-full max-h-32 object-cover" />
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-2 right-2 bg-gray-900/70 hover:bg-gray-900 text-white rounded-full p-1 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <label
              htmlFor={imageInputId}
              className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 cursor-pointer transition-all"
            >
              <ImagePlus className="h-4 w-4" />
              Add image to preview
            </label>
          )}
          <input
            id={imageInputId}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* Copy button */}
        <button
          onClick={copyAll}
          className={cn(
            "w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition-all",
            copied ? "bg-emerald-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
          )}
        >
          {copied
            ? <><Check className="h-4 w-4" /> Copied!</>
            : <><Copy className="h-4 w-4" /> Copy formatted post</>}
        </button>

        {/* Footnote */}
        <p className="text-xs text-gray-400 leading-relaxed text-center">
          Unicode styles render on all devices but aren't indexed by LinkedIn search.
        </p>
      </div>
    </div>
  );
}
