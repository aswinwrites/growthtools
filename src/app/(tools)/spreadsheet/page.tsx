import type { Metadata } from "next";
import SpreadsheetOps from "@/components/tools/spreadsheet/spreadsheet-ops";

export const metadata: Metadata = {
  title: "Spreadsheet Operations — MarketerTools",
  description:
    "26 browser-based spreadsheet operations: VLOOKUP, XLOOKUP, joins, find missing, detect changes, remove duplicates, split/merge columns, extract emails, domains, numbers and more. No upload, no backend — all data stays in your browser.",
  keywords: [
    "spreadsheet operations",
    "vlookup online",
    "xlookup browser",
    "csv join tool",
    "find missing rows",
    "detect changes between spreadsheets",
    "remove duplicates csv",
    "split column excel",
    "extract emails from spreadsheet",
    "data cleaning tool",
    "spreadsheet comparison",
    "free excel tool online",
  ],
  openGraph: {
    title: "Spreadsheet Operations — MarketerTools",
    description:
      "26 spreadsheet operations in your browser. VLOOKUP, joins, dedup, clean, split, extract. No uploads.",
    type: "website",
  },
};

export default function SpreadsheetPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Spreadsheet Operations</h1>
          <p className="mt-1.5 text-gray-500 text-sm max-w-xl">
            26 operations across Lookup, Compare, Clean, and Transform — all in your browser. Supports CSV and XLSX up to 100k+ rows.
          </p>
        </div>

        <SpreadsheetOps />
      </div>
    </div>
  );
}
