import type { Metadata } from "next";
import ComingSoon from "@/components/shared/coming-soon";

export const metadata: Metadata = {
  title: "Play Store Preview — Android App Screenshot Preview",
  description:
    "Preview your Android app screenshots in a live Google Play Store frame. See exactly what users see before you submit. Coming soon.",
  openGraph: {
    title: "Play Store Preview | MarketerTools",
    description: "Preview Android app screenshots in a Google Play Store frame. Coming soon.",
    url: "https://marketertools.fyi/play-store-preview",
  },
};

export default function PlayStorePreviewPage() {
  return (
    <div className="min-h-screen bg-gray-50/30 py-10">
      <ComingSoon
        toolName="Play Store Preview"
        description="Preview your Android phone and tablet screenshots inside a live Google Play Store frame. Drag to reorder, toggle dark mode, and see exactly what users see before you submit."
        eta="Q3 2025"
      />
    </div>
  );
}
