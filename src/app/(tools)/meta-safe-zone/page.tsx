import type { Metadata } from "next";
import ComingSoon from "@/components/shared/coming-soon";

export const metadata: Metadata = {
  title: "Meta Safe Zone Checker — Check Reels, Story & Feed Safe Areas",
  description:
    "Upload your Meta ad creative and see Reels, Story, and Feed safe zone overlays. Client-side processing. Free Meta safe zone checker for performance marketers.",
  keywords: [
    "Meta safe zone checker",
    "Facebook safe zone",
    "Reels safe area",
    "Story safe zone",
    "Meta ad creative checker",
    "social media creative tool",
  ],
  openGraph: {
    title: "Meta Safe Zone Checker | GrowthTools",
    description:
      "Check your Meta ad creatives against Reels, Story, and Feed safe zones. Coming soon.",
    url: "https://growthtools.io/meta-safe-zone",
  },
};

export default function MetaSafeZonePage() {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ComingSoon
          toolName="Meta Safe Zone Checker"
          description="Upload your creative and instantly see safe zone overlays for Reels, Stories, and Feed placements. Download with overlay applied."
          eta="Q2 2025"
        />
      </div>
    </div>
  );
}
