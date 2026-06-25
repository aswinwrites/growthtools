import type { Metadata } from "next";
import ImageToCSV from "@/components/tools/image-to-csv/image-to-csv";
import { Table } from "lucide-react";

export const metadata: Metadata = {
  title: "Image to CSV Converter | Extract Table Data from Screenshots – GrowthTools",
  description:
    "Convert images with tables into CSV data instantly. Upload a screenshot of a spreadsheet, report, or web table and get a downloadable CSV file in seconds. Powered by AI.",
  keywords: [
    "image to CSV", "screenshot to CSV", "table image to CSV",
    "extract table from image", "convert table screenshot to Excel",
    "OCR table extraction", "PDF table to CSV", "AI table extractor",
  ],
  openGraph: {
    title: "Image to CSV – Extract Tables from Screenshots with AI",
    description:
      "Upload any screenshot containing a table and get structured CSV data instantly. No manual typing, no data storage.",
    url: "https://growthtools.vercel.app/image-to-csv",
    type: "website",
  },
  alternates: { canonical: "https://growthtools.vercel.app/image-to-csv" },
};

const USE_CASES = [
  {
    title: "Spreadsheet screenshots",
    desc: "Extract data from Google Sheets or Excel screenshots without re-typing.",
  },
  {
    title: "PDF table captures",
    desc: "Screenshot a locked PDF table and get editable CSV in one click.",
  },
  {
    title: "Web scraping alternative",
    desc: "Can't copy a web table? Screenshot it and extract the CSV instead.",
  },
  {
    title: "Analytics dashboards",
    desc: "Extract metric tables from Google Analytics, Mixpanel, or Amplitude screenshots.",
  },
  {
    title: "Financial reports",
    desc: "Convert earnings tables, income statements, and financial data images to CSV.",
  },
  {
    title: "Research data",
    desc: "Extract data tables from academic papers, reports, and infographics.",
  },
];

export default function ImageToCSVPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 shadow-md shadow-violet-200">
              <Table className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-600 border border-violet-100">
                AI-powered
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
                No data stored
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Image to CSV Converter
          </h1>
          <p className="mt-2 text-gray-500 max-w-xl">
            Upload any screenshot containing a table — spreadsheet, report, dashboard, PDF — and get a clean, downloadable CSV in seconds. Powered by Claude AI vision.
          </p>
        </div>
      </div>

      {/* Tool */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <ImageToCSV />
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
              q: "How accurate is the extraction?",
              a: "Very accurate for clean screenshots with clear borders and text. Complex merged cells, rotated text, or heavily stylized tables may require minor manual correction.",
            },
            {
              q: "Is my image stored or used for training?",
              a: "No. Images are sent to the Claude API for processing and are not stored on our servers or used for model training per Anthropic's API policy.",
            },
            {
              q: "What if my screenshot has multiple tables?",
              a: "The tool detects multiple tables and separates them with a '## TABLE:' marker in the CSV output. Each table preserves its own headers.",
            },
            {
              q: "Can it handle handwritten tables?",
              a: "It can often read clear handwriting, but printed text is significantly more accurate. For best results, use high-contrast, clearly printed tables.",
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
