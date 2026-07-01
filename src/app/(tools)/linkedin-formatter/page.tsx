import type { Metadata } from "next";
import LinkedInFormatter from "@/components/tools/linkedin-formatter/linkedin-formatter";

export const metadata: Metadata = {
  title: "LinkedIn Text Formatter — Bold, Italic, Script & More | MarketerTools",
  description:
    "Format your LinkedIn posts with bold, italic, script, strikethrough and more. Live preview, AI hook generator, hashtag suggester, and tone rewriter. Free, no signup.",
  openGraph: {
    title: "LinkedIn Text Formatter | MarketerTools",
    description:
      "Format LinkedIn posts with Unicode styles. Live preview, selection-based formatting, AI hooks and hashtag suggestions.",
    url: "https://www.marketertools.fyi/linkedin-formatter",
  },
  alternates: { canonical: "https://www.marketertools.fyi/linkedin-formatter" },
};

export default function LinkedInFormatterPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-widest">
            LinkedIn
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          LinkedIn Text Formatter
        </h1>
        <p className="text-gray-500 max-w-2xl leading-relaxed">
          Bold, italic, script, strikethrough — formatted text that actually stands out in the feed.
          Select specific words to format them, or apply styles to your whole post. AI-powered hook ideas, hashtags, and tone rewriting included.
        </p>
      </div>

      <LinkedInFormatter />
    </div>
  );
}
