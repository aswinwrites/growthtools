import type { Metadata } from "next";
import JSONFormatter from "@/components/tools/json-formatter/json-formatter";
import { Braces } from "lucide-react";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator | Free Online JSON Beautifier – GrowthTools",
  description:
    "Format, minify, and validate JSON instantly in your browser. Syntax-highlighted output with key count, depth, and size stats. No data leaves your device.",
  keywords: [
    "JSON formatter", "JSON beautifier", "JSON validator", "format JSON online",
    "JSON minifier", "pretty print JSON", "JSON syntax highlighter", "online JSON tool",
  ],
  openGraph: {
    title: "JSON Formatter & Validator – Free Browser Tool",
    description:
      "Paste JSON, get beautiful syntax-highlighted output instantly. Format, minify, or validate — all client-side.",
    url: "https://growthtools.vercel.app/json-formatter",
    type: "website",
  },
  alternates: { canonical: "https://growthtools.vercel.app/json-formatter" },
};

const FEATURES = [
  { title: "Instant formatting", desc: "2-space or 4-space indent, or minified — choose your style." },
  { title: "Syntax highlighting", desc: "Keys, strings, numbers, booleans, and null — each a distinct color." },
  { title: "Validation with errors", desc: "Exact SyntaxError messages so you know where to look." },
  { title: "Depth & key stats", desc: "See how deeply nested your JSON is and total key count at a glance." },
  { title: "Download as .json", desc: "One-click download of the formatted output." },
  { title: "Zero data upload", desc: "Everything runs in your browser — nothing is sent to any server." },
];

export default function JSONFormatterPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 shadow-md shadow-blue-200">
              <Braces className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 border border-blue-100">
                Free
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
                No sign-up
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            JSON Formatter & Validator
          </h1>
          <p className="mt-2 text-gray-500 max-w-xl">
            Format, minify, and validate JSON with syntax highlighting, error messages, and structure stats — all in your browser with zero data upload.
          </p>
        </div>
      </div>

      {/* Tool */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <JSONFormatter />
      </div>

      {/* Features */}
      <div className="border-t border-gray-100 bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Why use this JSON formatter?</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ title, desc }) => (
              <div key={title} className="rounded-2xl border border-gray-200 bg-white p-4">
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="mt-1 text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="px-6 py-12">
        <div className="mx-auto max-w-4xl space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Frequently asked questions</h2>
          {[
            {
              q: "Is my JSON data private?",
              a: "Yes. All processing happens in your browser using JavaScript. No JSON data is ever sent to our servers.",
            },
            {
              q: "What's the difference between Format and Minify?",
              a: "Format adds indentation and line breaks for human readability. Minify removes all whitespace to reduce file size — useful for APIs and storage.",
            },
            {
              q: "Can I format very large JSON files?",
              a: "Yes, as long as your browser can handle the memory. Files up to a few hundred MB typically work fine on modern hardware.",
            },
            {
              q: "Why does validation fail on valid-looking JSON?",
              a: "Common culprits: trailing commas, single quotes instead of double quotes, unquoted keys, and comments (JSON doesn't support // or /* */). The error message pinpoints the exact location.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-gray-100 pb-6">
              <p className="font-semibold text-gray-900">{q}</p>
              <p className="mt-1 text-sm text-gray-500">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
