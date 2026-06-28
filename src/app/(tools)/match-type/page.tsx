import type { Metadata } from "next";
import MatchTypeTool from "@/components/tools/match-type/match-type-tool";

export const metadata: Metadata = {
  title: "Google Ads Keyword Match Type Tool — Free Bulk Converter",
  description:
    "Convert keywords to Broad, Phrase, and Exact match types in bulk. Free Google Ads keyword match type tool with CSV export and copy all. No signup required.",
  keywords: [
    "keyword match type tool",
    "Google Ads match type",
    "broad match",
    "phrase match",
    "exact match",
    "bulk keyword tool",
    "PPC keyword tool",
  ],
  openGraph: {
    title: "Keyword Match Type Tool | MarketerTools",
    description:
      "Convert keywords to all three Google Ads match types in bulk. Free, instant, CSV export.",
    url: "https://www.marketertools.fyi/match-type",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are Google Ads keyword match types?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Google Ads has three keyword match types: Broad Match (default, shows for related searches), Phrase Match (shows when the phrase is included in the query, denoted by quotes), and Exact Match (shows only for that specific query, denoted by brackets).",
      },
    },
    {
      "@type": "Question",
      name: "How do I use phrase match in Google Ads?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "To use phrase match, wrap your keyword in double quotes: \"running shoes\". Your ad will show when someone searches for that phrase, potentially with words before or after it.",
      },
    },
  ],
};

export default function MatchTypePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="min-h-screen bg-gray-50/30">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Keyword Match Type Tool
            </h1>
            <p className="mt-2 text-gray-500">
              Paste your keywords and instantly convert them to Broad, Phrase,
              and Exact match formats. Bulk support with CSV export.
            </p>
          </div>

          <MatchTypeTool />

          <section className="mt-16 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
              Google Ads Match Types Explained
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  type: "Broad Match",
                  format: "running shoes",
                  color: "blue",
                  desc: "Shows for related searches, synonyms, and variations. Maximum reach, lower precision. Default match type.",
                },
                {
                  type: "Phrase Match",
                  format: '"running shoes"',
                  color: "violet",
                  desc: 'Shows when the phrase appears in the search query. More targeted than broad. Wrapped in double quotes.',
                },
                {
                  type: "Exact Match",
                  format: "[running shoes]",
                  color: "emerald",
                  desc: "Shows only for that exact query or close variants. Highest precision, lowest volume. Wrapped in square brackets.",
                },
              ].map((item) => (
                <div
                  key={item.type}
                  className="rounded-xl border border-gray-100 bg-white p-5"
                >
                  <span
                    className={`inline-block text-xs font-medium rounded-full px-2 py-0.5 mb-3 bg-${item.color}-50 text-${item.color}-600`}
                  >
                    {item.type}
                  </span>
                  <code className="block text-lg font-mono font-bold text-gray-900 mb-2">
                    {item.format}
                  </code>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
