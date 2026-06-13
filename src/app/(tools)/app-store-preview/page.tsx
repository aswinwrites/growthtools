import type { Metadata } from "next";
import ComingSoon from "@/components/shared/coming-soon";

export const metadata: Metadata = {
  title: "App Store Screenshot Preview — iPhone & iPad Frame Tool",
  description:
    "Preview your app screenshots in iPhone and iPad frames, exactly as they appear in the Apple App Store. Dark & light mode. Drag to reorder. Free ASO tool.",
  keywords: [
    "App Store screenshot preview",
    "iPhone screenshot frame",
    "iPad screenshot mockup",
    "ASO screenshot tool",
    "Apple App Store preview",
    "app screenshot generator",
  ],
  openGraph: {
    title: "App Store Screenshot Preview | GrowthTools",
    description:
      "Preview screenshots in iPhone & iPad frames. Dark mode. Drag to reorder. Coming soon.",
    url: "https://growthtools.io/app-store-preview",
  },
};

export default function AppStorePreviewPage() {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ComingSoon
          toolName="App Store Screenshot Preview"
          description="Upload your screenshots and preview them in iPhone and iPad frames exactly as Apple displays them. Dark mode, light mode, drag-and-drop reordering."
          eta="Q2 2025"
        />
      </div>
    </div>
  );
}
