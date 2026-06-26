import type { Metadata } from "next";
import ScreenshotChecker from "@/components/tools/screenshot-checker/screenshot-checker";

export const metadata: Metadata = {
  title: "Screenshot Dimension Checker — App Store & Play Store",
  description:
    "Instantly check if your app screenshots meet App Store and Play Store dimension requirements. Supports all iPhone, iPad, and Android sizes. Client-side — your images never leave your browser.",
  keywords: [
    "screenshot dimension checker",
    "App Store screenshot size",
    "Play Store screenshot requirements",
    "iOS screenshot dimensions",
    "Android screenshot size",
    "app store optimization",
    "ASO screenshot tool",
  ],
  openGraph: {
    title: "Screenshot Dimension Checker | MarketerTools",
    description:
      "Check if your screenshots meet App Store and Play Store requirements. Instant, client-side, free.",
    url: "https://marketertools.fyi/screenshot-checker",
  },
};

export default function ScreenshotCheckerPage() {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Screenshot Dimension Checker</h1>
          <p className="mt-2 text-gray-500">
            Upload your app screenshots and instantly see if they meet App Store and Play Store requirements.
            Checks all iPhone, iPad, and Android sizes. Everything runs in your browser — no uploads, no server.
          </p>
        </div>

        <ScreenshotChecker />
      </div>
    </div>
  );
}
