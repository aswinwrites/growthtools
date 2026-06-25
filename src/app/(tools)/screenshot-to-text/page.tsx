import type { Metadata } from "next";
import ScreenshotToText from "@/components/tools/screenshot-to-text/screenshot-to-text";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Screenshot to Text | Free AI OCR Tool – GrowthTools",
  description:
    "Extract text from screenshots instantly using AI. Convert images of articles, UI, documents, and menus to editable text. No sign-up, no data stored.",
  keywords: [
    "screenshot to text", "image to text", "OCR online free",
    "extract text from image", "convert image to text AI",
    "photo to text", "screenshot OCR", "image text extractor",
  ],
  openGraph: {
    title: "Screenshot to Text – Free AI OCR | GrowthTools",
    description:
      "Upload any screenshot and extract all text instantly with AI. Preserves structure, headings, and layout.",
    url: "https://growthtools.vercel.app/screenshot-to-text",
    type: "website",
  },
  alternates: { canonical: "https://growthtools.vercel.app/screenshot-to-text" },
};

const USE_CASES = [
  { title: "UI screenshots", desc: "Extract button labels, navigation text, and copy from app screens." },
  { title: "Scanned documents", desc: "Convert scanned PDFs and document photos to editable text." },
  { title: "Social media posts", desc: "Grab text from Twitter, Instagram, or LinkedIn screenshots." },
  { title: "Error messages", desc: "Copy error text you can't select — instantly searchable." },
  { title: "Presentation slides", desc: "Extract slide content without access to the original file." },
  { title: "Handwritten notes", desc: "Digitize clear handwritten notes and whiteboard captures." },
];

export default function ScreenshotToTextPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 shadow-md shadow-emerald-200">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-100">
                AI-powered
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
                Free
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Screenshot to Text
          </h1>
          <p className="mt-2 text-gray-500 max-w-xl">
            Upload any image containing text and get clean, structured, editable output in seconds. Powered by Claude AI vision — preserves headings, layout, and hierarchy.
          </p>
        </div>
      </div>

      {/* Tool */}
      <div className="mx-auto max-w-5xl px-6 py-8">
        <ScreenshotToText />
      </div>

      {/* Use cases */}
      <div className="border-t border-gray-100 bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6">What you can extract</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {USE_CASES.map(({ title, desc }) => (
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
              q: "How is this different from regular OCR?",
              a: "Traditional OCR does character recognition. This uses Claude's vision AI which understands context — it preserves document structure, corrects formatting, and handles complex layouts like multi-column text.",
            },
            {
              q: "Is my image data stored?",
              a: "No. Images are processed via the Claude API and immediately discarded. We don't store, log, or analyze your images.",
            },
            {
              q: "What languages does it support?",
              a: "Claude reads text in most major languages — English, Spanish, French, German, Portuguese, Hindi, Japanese, Chinese, Korean, Arabic, and more.",
            },
            {
              q: "How accurate is it with poor quality images?",
              a: "Accuracy degrades with blurry, low-contrast, or heavily stylized fonts. For best results, use clear screenshots at standard resolution (1× or 2×).",
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
