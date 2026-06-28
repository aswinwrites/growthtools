import type { Metadata } from "next";
import MetaSafeZone from "@/components/tools/meta-safe-zone/meta-safe-zone";

export const metadata: Metadata = {
  title: "Meta Safe Zone Checker — Instagram & Facebook Ad Safe Zones",
  description:
    "Simulate your Meta ad creative across every placement — Stories, Reels, Feed, In-Stream, Right Column and more. See real safe zone overlays for Instagram and Facebook. Free, browser-based, no upload.",
  keywords: [
    "Meta safe zone checker",
    "Instagram safe zone",
    "Facebook safe zone",
    "Reels safe area",
    "Stories safe zone",
    "Meta ad creative checker",
    "Instagram ad sizes",
    "Facebook ad dimensions",
    "Meta ad specs 2025",
    "safe zone overlay tool",
    "Instagram Reels safe zone",
    "Facebook Stories safe zone",
    "Meta ad simulator",
  ],
  openGraph: {
    title: "Meta Safe Zone Checker | MarketerTools",
    description:
      "Preview your Meta ad creative across all placements with real safe zone overlays. Instagram Stories, Reels, Feed, Facebook and more. Free.",
    url: "https://www.marketertools.fyi/meta-safe-zone",
  },
  alternates: { canonical: "https://www.marketertools.fyi/meta-safe-zone" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the Meta ad safe zone?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Meta ad safe zone is the area of your creative that will always be visible regardless of placement, without being cropped or covered by UI elements like profile pictures, action buttons, or text overlays. Safe zones vary by placement — Stories and Reels have a taller safe zone than Feed placements due to the profile info and CTA button at the top and bottom.",
      },
    },
    {
      "@type": "Question",
      name: "What are the safe zone dimensions for Instagram Stories ads?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Instagram Stories ads are 1080x1920px (9:16). The safe zone keeps critical content within roughly the middle 1080x1420px — approximately 250px from the top (where the profile info appears) and 250px from the bottom (where the CTA button sits). Text and logos should stay within this central area.",
      },
    },
    {
      "@type": "Question",
      name: "Do safe zones differ between Instagram Reels and Stories?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Both are 9:16 (1080x1920px) but the UI overlay positions differ slightly. Reels have the caption and audio attribution at the bottom, plus the like/comment/share buttons on the right side. The right-side safe zone for Reels is narrower than for Stories to avoid covering these engagement elements.",
      },
    },
    {
      "@type": "Question",
      name: "What is the recommended aspect ratio for Meta Feed ads?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For Facebook and Instagram Feed, 1:1 (square, 1080x1080px) or 4:5 (1080x1350px) are the recommended aspect ratios. Meta crops taller images in Feed to 4:5, so designing at exactly 4:5 gives you maximum screen real estate. Landscape (1.91:1) is supported but shows smaller in Feed.",
      },
    },
    {
      "@type": "Question",
      name: "Why is my Meta ad creative getting cropped?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cropping happens when your creative doesn't match the native aspect ratio of the placement it's serving in. Meta auto-crops to fit, which can cut off logos, faces, or text near edges. The fix is to design at the correct dimensions for each placement, or at minimum keep all critical content within the safe zone so auto-cropping doesn't remove important elements.",
      },
    },
    {
      "@type": "Question",
      name: "Should I create separate creatives for each Meta placement?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For best performance, yes — especially between Feed and Stories/Reels. A 1:1 or 4:5 asset designed for Feed will be letterboxed or cropped awkwardly in a 9:16 Stories placement. With Meta's Andromeda update emphasising creative as targeting, placement-native creatives perform measurably better than auto-adapted assets. At minimum, create separate 4:5 (Feed) and 9:16 (Stories/Reels) versions.",
      },
    },
  ],
};

export default function MetaSafeZonePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="min-h-screen bg-gray-50/30">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Meta Safe Zone Checker
            </h1>
            <p className="mt-2 text-gray-500 max-w-2xl">
              Upload your ad creative and see exactly how it looks across every
              Meta placement — with real safe zone overlays for Stories, Reels,
              Feed, In-Stream, and more. Everything runs in your browser.
            </p>
          </div>

          <MetaSafeZone />

          {/* SEO content */}
          <section className="mt-16 max-w-3xl">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              What Is the Meta Ad Safe Zone?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Every Meta placement overlays UI elements on top of your creative
              — profile pictures, CTA buttons, captions, like/comment buttons.
              The safe zone is the area of your image or video guaranteed to
              remain visible without obstruction. Content placed outside the safe
              zone risks being hidden, cropped, or covered depending on which
              placement serves the ad.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Safe zones vary significantly by placement. Instagram Stories and
              Reels reserve roughly 250px at the top and bottom of a 1920px
              frame for profile info and action elements. Feed placements have
              a different crop behaviour entirely. Running the same 9:16 asset
              across all placements without checking safe zones is one of the
              most common creative mistakes in Meta campaigns.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mb-3 mt-8">
              Meta Ad Specs at a Glance (2025)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 pr-4 font-semibold text-gray-700">Placement</th>
                    <th className="text-left py-2 pr-4 font-semibold text-gray-700">Aspect Ratio</th>
                    <th className="text-left py-2 pr-4 font-semibold text-gray-700">Recommended Size</th>
                    <th className="text-left py-2 font-semibold text-gray-700">Key Safe Zone Risk</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-4">Instagram / Facebook Feed</td>
                    <td className="py-2 pr-4">4:5 or 1:1</td>
                    <td className="py-2 pr-4">1080×1350 or 1080×1080</td>
                    <td className="py-2">Bottom caption overlay</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-4">Instagram Stories</td>
                    <td className="py-2 pr-4">9:16</td>
                    <td className="py-2 pr-4">1080×1920</td>
                    <td className="py-2">Top profile + bottom CTA (~250px each)</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-4">Instagram Reels</td>
                    <td className="py-2 pr-4">9:16</td>
                    <td className="py-2 pr-4">1080×1920</td>
                    <td className="py-2">Right-side engagement buttons</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-4">Facebook Stories</td>
                    <td className="py-2 pr-4">9:16</td>
                    <td className="py-2 pr-4">1080×1920</td>
                    <td className="py-2">Top profile bar</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-4">Facebook In-Stream Video</td>
                    <td className="py-2 pr-4">16:9</td>
                    <td className="py-2 pr-4">1280×720</td>
                    <td className="py-2">Bottom progress bar</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Facebook Right Column</td>
                    <td className="py-2 pr-4">1:1</td>
                    <td className="py-2 pr-4">1080×1080</td>
                    <td className="py-2">Small display — avoid small text</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-3 mt-8">
              Why This Matters More in 2025
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Meta&apos;s Andromeda update shifted the platform toward using creative
              as a targeting signal — the algorithm reads your image and copy to
              find the right audience. A creative that&apos;s visually broken (cropped
              text, logo cut off, key message in the danger zone) doesn&apos;t just
              look unprofessional: it gives Andromeda a poor signal to work
              with, which affects delivery quality and costs.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Placement-native creative — designed specifically for each format
              rather than adapted from a single master asset — consistently
              outperforms auto-cropped creative. Check your assets here before
              launching, especially for any campaign using Advantage+ placements
              where Meta automatically distributes across all formats.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mb-4 mt-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-5">
              {[
                {
                  q: "What is the Meta ad safe zone?",
                  a: "The safe zone is the area of your creative that will always be visible, without being covered by Meta's UI overlays (profile pictures, CTA buttons, engagement icons). It varies by placement.",
                },
                {
                  q: "What dimensions for Instagram Stories ads?",
                  a: "1080×1920px (9:16). Keep critical content within the middle ~1080×1420px — roughly 250px clear at top and bottom for profile info and the CTA button.",
                },
                {
                  q: "Should I make separate creatives per placement?",
                  a: "Yes, especially between Feed (4:5) and Stories/Reels (9:16). A single asset auto-adapted by Meta will often crop or letterbox in ways that hurt performance. At minimum, create one 4:5 and one 9:16 version.",
                },
              ].map(({ q, a }) => (
                <div key={q}>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{q}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
