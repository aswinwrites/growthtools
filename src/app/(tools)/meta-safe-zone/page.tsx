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
    title: "Meta Safe Zone Checker | GrowthTools",
    description:
      "Preview your Meta ad creative across all placements with real safe zone overlays. Instagram Stories, Reels, Feed, Facebook and more. Free.",
    url: "https://growthtools.vercel.app/meta-safe-zone",
  },
};

export default function MetaSafeZonePage() {
  return <MetaSafeZone />;
}
