"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy, Check, Trash2, Sparkles, Hash, Wand2,
  ChevronDown, ThumbsUp, MessageCircle, Repeat2, Send,
  Type, List, Zap,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { applyFormat, FORMAT_PREVIEW, FormatKey } from "./unicode";

// ─── Constants ───────────────────────────────────────────────────────────────

const LINKEDIN_LIMIT = 3000;
const SEE_MORE_THRESHOLD = 235; // chars before LinkedIn shows "...see more"

const TONES = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual" },
  { id: "storytelling", label: "Story-led" },
  { id: "provocative", label: "Provocative" },
] as const;

type Tone = (typeof TONES)[number]["id"];

// ─── Format button groups ─────────────────────────────────────────────────────

interface FormatBtn { key: FormatKey; label: string; preview: string; }

const TEXT_FORMATS: FormatBtn[] = [
  { key: "bold",          label: "Bold",         preview: FORMAT_PREVIEW.bold },
  { key: "italic",        label: "Italic",       preview: FORMAT_PREVIEW.italic },
  { key: "boldItalic",    label: "Bold Italic",  preview: FORMAT_PREVIEW.boldItalic },
  { key: "sansBold",      label: "Sans Bold",    preview: FORMAT_PREVIEW.sansBold },
  { key: "sansItalic",    label: "Sans Italic",  preview: FORMAT_PREVIEW.sansItalic },
  { key: "script",        label: "Script",       preview: FORMAT_PREVIEW.script },
  { key: "monospace",     label: "Mono",         preview: FORMAT_PREVIEW.monospace },
  { key: "doubleStruck",  label: "Double",       preview: FORMAT_PREVIEW.doubleStruck },
  { key: "strikethrough", label: "Strike",       preview: FORMAT_PREVIEW.strikethrough },
  { key: "underline",     label: "Underline",    preview: FORMAT_PREVIEW.underline },
  { key: "uppercase",     label: "UPPER",        preview: FORMAT_PREVIEW.uppercase },
  { key: "lowercase",     label: "lower",        preview: FORMAT_PREVIEW.lowercase },
];

const LIST_FORMATS: FormatBtn[] = [
  { key: "bulletList", label: "Bullets",   preview: FORMAT_PREVIEW.bulletList },
  { key: "numberList", label: "Numbered",  preview: FORMAT_PREVIEW.numberList },
  { key: "checkList",  label: "Checklist", preview: FORMAT_PREVIEW.checkList },
  { key: "arrowList",  label: "Arrows",    preview: FORMAT_PREVIEW.arrowList },
];

// ─── LinkedIn Preview ─────────────────────────────────────────────────────────

function LinkedInPreview({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const needsTruncation = text.length > SEE_MORE_THRESHOLD;
  const displayText = !expanded && needsTruncation
    ? text.slice(0, SEE_MORE_THRESHOLD)
    : text;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      {/* Post header */}
      <div className="p-4 flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
          You
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-tight">Your Name</p>
          <p className="text-xs text-gray-500 leading-tight truncate max-w-[180px]">
            Your Job Title • 1st
          </p>
          <p className="text-xs text-gray-400">2h · 🌐</p>
        </div>
      </div>

      {/* Post body */}
      <div className="px-4 pb-3">
        {text ? (
          <div className="text-sm text-gray-800 leading-relaxed">
            <span className="whitespace-pre-wrap">{displayText}</span>
            {needsTruncation && !expanded && (
              <>
                <span className="text-gray-400">…</span>
                <button
                  onClick={() => setExpanded(true)}
                  className="text-gray-600 font-semibold ml-1 hover:underline text-sm"
                >
                  see more
                </button>
              </>
            )}
            {expanded && needsTruncation && (
              <button
                onClick={() => setExpanded(false)}
                className="text-gray-600 font-semibold ml-1 hover:underline text-sm"
              >
                {" "}show less
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-300 italic">
            Your formatted post will appear here…
          </p>
        )}
      </div>

      {/* Reactions bar */}
      <div className="border-t border-gray-100 px-4 py-2">
        <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
          <span className="inline-flex items-center">
            <span className="text-base">👍</span><span className="text-base">❤️</span>
          </span>
          <span className="ml-1">57 reactions</span>
        </div>
        <div className="flex items-center justify-around">
          {[
            { icon: ThumbsUp, label: "Like" },
            { icon: MessageCircle, label: "Comment" },
            { icon: Repeat2, label: "Repost" },
            { icon: Send, label: "Send" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Char Counter ─────────────────────────────────────────────────────────────

function CharCounter({ count }: { count: number }) {
  const pct = Math.min((count / LINKEDIN_LIMIT) * 100, 100);
  const color =
    count > LINKEDIN_LIMIT ? "text-red-600" :
    count > 2500 ? "text-amber-500" : "text-gray-500";
  const barColor =
    count > LINKEDIN_LIMIT ? "bg-red-500" :
    count > 2500 ? "bg-amber-400" : "bg-blue-500";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">Characters</span>
        <span className={cn("font-mono font-medium tabular-nums", color)}>
          {count.toLocaleString()} / {LINKEDIN_LIMIT.toLocaleString()}
        </span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full transition-colors", barColor)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      {count > SEE_MORE_THRESHOLD && (
        <p className="text-xs text-amber-600">
          LinkedIn shows "…see more" after {SEE_MORE_THRESHOLD} characters
        </p>
      )}
    </div>
  );
}

// ─── Format Button ─────────────────────────────────────────────────────────────

function FmtBtn({
  btn, onClick,
}: {
  btn: FormatBtn;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={btn.label}
      className="group relative flex flex-col items-center gap-0.5 rounded-xl border border-gray-200 bg-white px-2.5 py-2 hover:border-blue-300 hover:bg-blue-50 transition-all min-w-[60px]"
    >
      <span className="text-sm text-gray-700 group-hover:text-blue-700 leading-tight truncate max-w-[72px]">
        {btn.preview}
      </span>
      <span className="text-[10px] text-gray-400 group-hover:text-blue-500 uppercase tracking-wide leading-none">
        {btn.label}
      </span>
    </button>
  );
}

// ─── AI Panel ─────────────────────────────────────────────────────────────────

function AIPanel({ text }: { text: string }) {
  const [hooks, setHooks] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string>("");
  const [rewritten, setRewritten] = useState<string>("");
  const [activeTone, setActiveTone] = useState<Tone>("professional");
  const [showToneMenu, setShowToneMenu] = useState(false);
  const [loading, setLoading] = useState<"hooks" | "hashtags" | "rewrite" | null>(null);

  const callAI = useCallback(
    async (action: "hooks" | "hashtags" | "rewrite") => {
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

        if (action === "hooks") {
          setHooks(data.result.split("\n").filter(Boolean));
        } else if (action === "hashtags") {
          setHashtags(data.result.trim());
        } else {
          setRewritten(data.result.trim());
        }
      } catch {
        toast.error("AI failed — try again");
      } finally {
        setLoading(null);
      }
    },
    [text, activeTone]
  );

  const copyText = (t: string) => {
    navigator.clipboard.writeText(t).then(() => toast.success("Copied!"));
  };

  return (
    <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-purple-500" />
        <span className="text-sm font-semibold text-purple-800">AI Features</span>
        <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide">
          Beta
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Hook Ideas */}
        <button
          onClick={() => callAI("hooks")}
          disabled={loading !== null}
          className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-white px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50 disabled:opacity-50 transition-all"
        >
          <Zap className={cn("h-3.5 w-3.5", loading === "hooks" && "animate-pulse")} />
          {loading === "hooks" ? "Generating…" : "Hook Ideas"}
        </button>

        {/* Hashtags */}
        <button
          onClick={() => callAI("hashtags")}
          disabled={loading !== null}
          className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-white px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50 disabled:opacity-50 transition-all"
        >
          <Hash className={cn("h-3.5 w-3.5", loading === "hashtags" && "animate-pulse")} />
          {loading === "hashtags" ? "Generating…" : "Hashtags"}
        </button>

        {/* Rewrite Tone */}
        <div className="flex rounded-xl overflow-hidden border border-purple-200 bg-white">
          <button
            onClick={() => callAI("rewrite")}
            disabled={loading !== null}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50 disabled:opacity-50 transition-all border-r border-purple-200"
          >
            <Wand2 className={cn("h-3.5 w-3.5", loading === "rewrite" && "animate-pulse")} />
            {loading === "rewrite" ? "Rewriting…" : "Rewrite as"}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowToneMenu((v) => !v)}
              className="flex items-center gap-1 px-2.5 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50 transition-all"
            >
              <span className="text-xs capitalize">{activeTone}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            <AnimatePresence>
              {showToneMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden min-w-[130px]"
                >
                  {TONES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => { setActiveTone(t.id); setShowToneMenu(false); }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm transition-colors hover:bg-purple-50",
                        activeTone === t.id ? "text-purple-700 font-medium bg-purple-50" : "text-gray-700"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Hook results */}
      <AnimatePresence>
        {hooks.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hook Ideas</p>
            {hooks.map((hook, i) => (
              <div key={i} className="flex items-start justify-between gap-2 rounded-xl bg-white border border-purple-100 px-3 py-2.5">
                <p className="text-sm text-gray-700 flex-1 leading-snug">{hook}</p>
                <button
                  onClick={() => copyText(hook)}
                  className="shrink-0 text-gray-400 hover:text-purple-600 transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hashtag results */}
      <AnimatePresence>
        {hashtags && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Suggested Hashtags</p>
              <button onClick={() => copyText(hashtags)} className="text-gray-400 hover:text-purple-600 transition-colors">
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {hashtags.split(/\s+/).filter(Boolean).map((tag, i) => (
                <button
                  key={i}
                  onClick={() => copyText(tag)}
                  className="text-xs bg-white border border-purple-100 text-purple-700 px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rewrite result */}
      <AnimatePresence>
        {rewritten && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Rewritten — {activeTone}
              </p>
              <button onClick={() => copyText(rewritten)} className="text-gray-400 hover:text-purple-600 transition-colors">
                <Copy className="h-3.5 w-3.5" />
              </button>
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
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFormat = useCallback(
    (key: FormatKey) => {
      const ta = textareaRef.current;
      if (!ta) return;

      const { selectionStart, selectionEnd, value } = ta;
      const hasSelection = selectionStart !== selectionEnd;
      const target = hasSelection ? value.slice(selectionStart, selectionEnd) : value;

      if (!target.trim()) {
        toast.error("Nothing to format — write something first");
        return;
      }

      const formatted = applyFormat(target, key);
      const newValue = hasSelection
        ? value.slice(0, selectionStart) + formatted + value.slice(selectionEnd)
        : formatted;

      setText(newValue);
      trackEvent("linkedin_format_applied", { format: key, selection: hasSelection });

      // Restore cursor / selection
      requestAnimationFrame(() => {
        ta.focus();
        if (hasSelection) {
          ta.setSelectionRange(selectionStart, selectionStart + formatted.length);
        }
      });
    },
    []
  );

  const copyAll = () => {
    if (!text.trim()) { toast.error("Nothing to copy"); return; }
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
      trackEvent("linkedin_text_copied");
    });
  };

  const clear = () => {
    setText("");
    textareaRef.current?.focus();
    trackEvent("linkedin_text_cleared");
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">
      {/* ── Left: Editor ───────────────────────────────────── */}
      <div className="space-y-4">
        {/* Selection hint */}
        <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
          <span className="font-medium">Tip:</span>
          Select specific words in your post and click a format — or leave nothing selected to format the whole text.
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Write your LinkedIn post here…\n\nYou grew 0→10k followers in 6 months.\nHere's the exact content strategy nobody talks about:\n\n→ Consistency beats virality\n→ Comments > Likes\n→ Your niche is your moat\n\nSelect any word and apply bold, italic, script and more.`}
            className="w-full h-64 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none leading-relaxed transition-all"
            maxLength={LINKEDIN_LIMIT + 100}
          />
          {text && (
            <button
              onClick={clear}
              className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition-colors"
              title="Clear"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Char counter */}
        <CharCounter count={text.length} />

        {/* ── Text style formats ── */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Type className="h-3.5 w-3.5 text-gray-400" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Text Styles</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {TEXT_FORMATS.map((btn) => (
              <FmtBtn key={btn.key} btn={btn} onClick={() => handleFormat(btn.key)} />
            ))}
          </div>
        </div>

        {/* ── List formats ── */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <List className="h-3.5 w-3.5 text-gray-400" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lists</p>
            <span className="text-[10px] text-gray-400">(applies to each line)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {LIST_FORMATS.map((btn) => (
              <FmtBtn key={btn.key} btn={btn} onClick={() => handleFormat(btn.key)} />
            ))}
          </div>
        </div>

        {/* ── AI Features ── */}
        <AIPanel text={text} />
      </div>

      {/* ── Right: Preview + Copy ──────────────────────────── */}
      <div className="space-y-4 xl:sticky xl:top-24">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            LinkedIn Preview
          </p>
          <span className="text-[10px] text-gray-400">Approximate rendering</span>
        </div>

        <LinkedInPreview text={text} />

        {/* Copy button */}
        <button
          onClick={copyAll}
          className={cn(
            "w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition-all",
            copied
              ? "bg-emerald-500 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
          )}
        >
          {copied ? (
            <><Check className="h-4 w-4" /> Copied!</>
          ) : (
            <><Copy className="h-4 w-4" /> Copy formatted post</>
          )}
        </button>

        {/* Format guide */}
        <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 space-y-1.5">
          <p className="text-xs font-semibold text-gray-500">How it works</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            LinkedIn doesn't support native formatting — these styles use Unicode characters that look bold, italic, or styled. They render on all devices but won't be indexed by search engines.
          </p>
        </div>
      </div>
    </div>
  );
}
