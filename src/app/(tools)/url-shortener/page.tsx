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

        {/* SEO content */}
        <section className="mt-16 max-w-3xl">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            URL Shorteners in Marketing Campaigns
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            A short link serves two functions: it&apos;s cleaner in copy where a raw
            UTM-tagged URL would be unwieldy, and it adds a tracking layer on
            top of whatever analytics your destination page already has. The
            shortener records the click at redirect time, which catches users
            who block JavaScript or don&apos;t trigger page-level analytics.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            The most useful place for short links is SMS and WhatsApp campaigns,
            where character counts matter and raw URLs are unscannable. For
            email and social, UTM parameters on your full URL are usually
            sufficient — platforms like Meta and LinkedIn track clicks
            independently anyway.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-3 mt-8">
            Short Links vs UTM Parameters
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            These solve different problems and work best together, not instead
            of each other. UTM parameters tell Google Analytics where traffic
            came from. Short links tell you how many times the link was clicked
            — regardless of what happened on the destination page. Combining
            both gives you click data (shortener) and attribution data (UTM)
            from the same link.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            The setup: build your full URL with UTM parameters first (use the{" "}
            <a href="/utm-builder" className="text-blue-600 hover:underline">
              UTM Builder
            </a>
            ), then shorten that tagged URL. The short link redirects to the UTM
            URL, so both tracking layers fire on every click.
          </p>
        </section>
      </div>
    </div>
  );
}
