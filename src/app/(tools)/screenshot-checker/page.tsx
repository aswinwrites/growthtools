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

        {/* SEO content */}
        <section className="mt-16 max-w-3xl">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            App Store Screenshot Requirements (2025)
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Apple and Google both enforce strict dimension rules for screenshots,
            and both reject submissions that don&apos;t match the required sizes for
            each device class. The rules change more often than most developers
            expect — Apple stopped requiring separate 4.7-inch screenshots when
            it deprecated the iPhone SE layout, and Google tightened its aspect
            ratio constraints in 2023.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-3 mt-8">
            Required Screenshot Sizes — App Store (iOS)
          </h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 font-semibold text-gray-700">Device</th>
                  <th className="text-left py-2 pr-4 font-semibold text-gray-700">Required Size</th>
                  <th className="text-left py-2 font-semibold text-gray-700">Notes</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4">iPhone 6.9&quot; (iPhone 16 Pro Max)</td>
                  <td className="py-2 pr-4">1320×2868 or 2868×1320</td>
                  <td className="py-2">Required from 2024</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4">iPhone 6.5&quot; (iPhone 14 Plus, 15 Plus)</td>
                  <td className="py-2 pr-4">1242×2688 or 2688×1242</td>
                  <td className="py-2">Most common required size</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4">iPhone 5.5&quot; (older required set)</td>
                  <td className="py-2 pr-4">1242×2208 or 2208×1242</td>
                  <td className="py-2">Still required if no 6.5&quot; set</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 pr-4">iPad Pro 12.9&quot; (3rd gen+)</td>
                  <td className="py-2 pr-4">2048×2732 or 2732×2048</td>
                  <td className="py-2">Required for iPad support</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-3 mt-8">
            Required Screenshot Sizes — Google Play Store
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Google Play requires at least 2 screenshots. Accepted dimensions:
            minimum 320px on the short side, maximum 3840px on the long side.
            Aspect ratio must be between 2:1 and 1:2. Phone screenshots display
            at a fixed width in the store listing, so higher resolution is
            always better up to the 3840px cap.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Common issue: screenshots exported at exactly 16:9 (e.g., 1920×1080)
            sometimes appear letterboxed in the Play Store listing because Google
            prefers a slightly taller ratio for phone screenshots. Design at
            9:19.5 or 9:20 (common phone screen ratios) for the cleanest result.
          </p>
        </section>
      </div>
    </div>
  );
}
