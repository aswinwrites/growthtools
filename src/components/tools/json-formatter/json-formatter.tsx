"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Download, Trash2, Minimize2, Maximize2, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Syntax highlighting ─────────────────────────────────────────────────────

function syntaxHighlight(json: string): string {
  const escaped = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match)) {
        if (/:$/.test(match)) return `<span style="color:#c792ea">${match}</span>`; // key
        return `<span style="color:#c3e88d">${match}</span>`; // string value
      }
      if (/true|false/.test(match)) return `<span style="color:#ffcb6b">${match}</span>`; // boolean
      if (/null/.test(match)) return `<span style="color:#f07178">${match}</span>`; // null
      return `<span style="color:#82aaff">${match}</span>`; // number
    }
  );
}

function getStats(json: string): { keys: number; depth: number; size: string } | null {
  try {
    const obj = JSON.parse(json);
    let maxDepth = 0;
    let keyCount = 0;
    const traverse = (val: unknown, depth: number) => {
      if (depth > maxDepth) maxDepth = depth;
      if (Array.isArray(val)) val.forEach((v) => traverse(v, depth + 1));
      else if (val && typeof val === "object") {
        Object.entries(val as Record<string, unknown>).forEach(([, v]) => {
          keyCount++;
          traverse(v, depth + 1);
        });
      }
    };
    traverse(obj, 0);
    const bytes = new TextEncoder().encode(json).length;
    const size = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
    return { keys: keyCount, depth: maxDepth, size };
  } catch {
    return null;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function JSONFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ keys: number; depth: number; size: string } | null>(null);

  const format = useCallback(
    (spaces: number = indent) => {
      if (!input.trim()) { toast.error("Paste some JSON first"); return; }
      try {
        const parsed = JSON.parse(input);
        const formatted = JSON.stringify(parsed, null, spaces);
        setOutput(formatted);
        setError("");
        setStats(getStats(formatted));
        setIndent(spaces);
        toast.success("Formatted");
      } catch (e) {
        const msg = e instanceof SyntaxError ? e.message : "Invalid JSON";
        setError(msg);
        setOutput("");
        setStats(null);
      }
    },
    [input, indent]
  );

  const minify = () => {
    if (!input.trim()) { toast.error("Paste some JSON first"); return; }
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError("");
      setStats(getStats(minified));
      toast.success("Minified");
    } catch (e) {
      setError(e instanceof SyntaxError ? e.message : "Invalid JSON");
      setOutput("");
      setStats(null);
    }
  };

  const validate = () => {
    if (!input.trim()) { toast.error("Paste some JSON first"); return; }
    try {
      JSON.parse(input);
      setError("");
      toast.success("Valid JSON ✓");
    } catch (e) {
      const msg = e instanceof SyntaxError ? e.message : "Invalid JSON";
      setError(msg);
      toast.error("Invalid JSON");
    }
  };

  const clear = () => {
    setInput(""); setOutput(""); setError(""); setStats(null);
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      toast.success("Copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const download = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "formatted.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const isValid = input.trim() && !error;

  return (
    <div className="space-y-4">
      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-xl border border-gray-200 overflow-hidden">
          <button onClick={() => format(2)} className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border-r border-gray-200 transition-colors flex items-center gap-1.5">
            <Maximize2 className="h-3.5 w-3.5" /> Format (2)
          </button>
          <button onClick={() => format(4)} className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border-r border-gray-200 transition-colors">
            Format (4)
          </button>
          <button onClick={minify} className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border-r border-gray-200 transition-colors flex items-center gap-1.5">
            <Minimize2 className="h-3.5 w-3.5" /> Minify
          </button>
          <button onClick={validate} className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Validate
          </button>
        </div>
        <button onClick={clear} className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-500 hover:text-red-500 hover:border-red-200 transition-colors">
          <Trash2 className="h-3.5 w-3.5" /> Clear
        </button>
      </div>

      {/* Editor layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Input</p>
            {input.trim() && (
              <p className="text-xs text-gray-400">{input.length.toLocaleString()} chars</p>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            placeholder={`Paste your JSON here…\n\n{\n  "name": "MarketerTools",\n  "type": "free",\n  "tools": 9\n}`}
            className="w-full h-[480px] rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm font-mono text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
            spellCheck={false}
          />
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-100 px-3 py-2"
              >
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-600 font-mono">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Output</p>
            <div className="flex items-center gap-2">
              {output && (
                <>
                  <button onClick={copy} className={cn("flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all", copied ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}>
                    {copied ? <><Check className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
                  </button>
                  <button onClick={download} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all">
                    <Download className="h-3 w-3" /> .json
                  </button>
                </>
              )}
            </div>
          </div>
          <div
            className={cn(
              "relative w-full h-[480px] rounded-2xl border overflow-auto p-4 font-mono text-sm leading-relaxed",
              output ? "bg-[#1e1e2e] border-gray-700" : "bg-gray-900 border-gray-800"
            )}
          >
            {output ? (
              <pre
                className="whitespace-pre-wrap break-all"
                dangerouslySetInnerHTML={{ __html: syntaxHighlight(output) }}
              />
            ) : (
              <p className="text-gray-600 text-sm mt-2">Formatted output will appear here.</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <AnimatePresence>
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-wrap items-center gap-3"
          >
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-xs font-medium text-emerald-700">Valid JSON</span>
            </div>
            {[
              { label: "Keys", value: stats.keys },
              { label: "Max depth", value: stats.depth },
              { label: "Size", value: stats.size },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600">
                <span className="text-gray-400">{label}: </span>
                <span className="font-medium text-gray-800">{value}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      {output && (
        <div className="flex flex-wrap gap-3 text-xs">
          {[
            { label: "Keys", color: "#c792ea" },
            { label: "Strings", color: "#c3e88d" },
            { label: "Numbers", color: "#82aaff" },
            { label: "Booleans", color: "#ffcb6b" },
            { label: "Null", color: "#f07178" },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
