import type { Metadata } from "next";
import PlayStoreURLGenerator from "@/components/tools/play-store-url/play-store-url";

export const metadata: Metadata = {
  title: "Play Store URL Generator — App Campaign Tracking Link Builder",
  description:
    "Build Play Store campaign URLs with UTM parameters for Google UAC, Meta, AppLovin, IronSource, and 10+ ad networks. Track app installs with your MMP.",
  keywords: [
    "Play Store URL generator",
    "Google Play campaign URL",
    "app install tracking URL",
    "UTM builder for apps",
    "Google UAC campaign URL",
    "MMP tracking link",
    "AppLovin campaign URL",
    "Android campaign tracking",
  ],
  openGraph: {
    title: "Play Store URL Generator | GrowthTools",
    description:
      "Build Play Store campaign tracking URLs for any ad network. Free app marketing tool.",
    url: "https://growthtools.io/play-store-preview",
  },
};

export default function PlayStorePreviewPage() {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Play Store URL Generator
          </h1>
          <p className="mt-2 text-gray-500">
            Build campaign tracking URLs for Google Play. Works with any MMP — AppsFlyer, Adjust, Branch, Singular.
          </p>
        </div>

        <PlayStoreURLGenerator />
      </div>
    </div>
  );
}
