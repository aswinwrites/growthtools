import type { Metadata } from "next";
import URLShortener from "@/components/tools/url-shortener/url-shortener";

export const metadata: Metadata = {
  title: "URL Shortener — Free Link Shortener with Analytics",
  description:
    "Shorten URLs instantly. Sign in to unlock click tracking, geography, device analytics, and 14-day retention. Free URL shortener for marketers.",
  keywords: [
    "URL shortener",
    "link shortener",
    "free URL shortener",
    "link tracking",
    "short link analytics",
    "marketing link shortener",
  ],
  openGraph: {
    title: "URL Shortener with Analytics | MarketerTools",
    description:
      "Shorten links in seconds. Track clicks, geography, and devices. Free for marketers.",
    url: "https://marketertools.fyi/url-shortener",
  },
};

export default function URLShortenerPage() {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">URL Shortener</h1>
          <p className="mt-2 text-gray-500">
            Shorten any link instantly. Sign in to unlock click tracking, geo
            analytics, and 14-day history.
          </p>
        </div>
        <URLShortener />
      </div>
    </div>
  );
}
