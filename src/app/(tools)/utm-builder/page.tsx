import type { Metadata } from "next";
import UTMBuilder from "@/components/tools/utm-builder/utm-builder";

export const metadata: Metadata = {
  title: "UTM Builder — Free Campaign URL Builder",
  description:
    "Build UTM-tagged campaign URLs for Google Ads, Meta Ads, LinkedIn, Email, WhatsApp, and more. Free UTM builder with presets, naming convention generator, and instant copy.",
  keywords: [
    "UTM builder",
    "campaign URL builder",
    "UTM parameter generator",
    "Google Analytics UTM",
    "campaign tracking",
    "UTM link builder",
  ],
  openGraph: {
    title: "UTM Builder — Free Campaign URL Builder | MarketerTools",
    description:
      "Build UTM-tagged campaign URLs with presets for every channel. Free, instant, no signup required.",
    url: "https://www.marketertools.fyi/utm-builder",
  },
};

// FAQ structured data for SEO
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a UTM builder?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A UTM builder is a tool that helps you add UTM parameters (source, medium, campaign, term, content) to your URLs so you can track where your traffic comes from in Google Analytics.",
      },
    },
    {
      "@type": "Question",
      name: "Are UTM parameters case-sensitive?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, UTM parameters are case-sensitive in Google Analytics. It's best practice to use all lowercase to avoid duplicate entries (e.g., 'google' and 'Google' appear as separate sources).",
      },
    },
    {
      "@type": "Question",
      name: "What is utm_source, utm_medium, and utm_campaign?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "utm_source identifies where your traffic comes from (e.g., google, facebook). utm_medium describes the marketing channel (e.g., cpc, email). utm_campaign names your specific campaign (e.g., summer_sale).",
      },
    },
  ],
};

export default function UTMBuilderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="min-h-screen bg-gray-50/30">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">UTM Builder</h1>
            <p className="mt-2 text-gray-500">
              Build campaign tracking URLs for any channel. Includes presets for
              Google, Meta, LinkedIn, Email, WhatsApp, and more.
            </p>
          </div>

          <UTMBuilder />

          {/* SEO content */}
          <section className="mt-16 prose prose-gray max-w-none">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              What is a UTM Builder?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              A UTM builder (or campaign URL builder) is a tool that appends UTM
              parameters to your URLs so Google Analytics and other analytics
              platforms can identify where your website traffic comes from. UTM
              stands for Urchin Tracking Module — a legacy name from the analytics
              platform Google acquired in 2005.
            </p>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
              UTM Parameters Explained
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 not-prose">
              {[
                { param: "utm_source", desc: "Where your traffic originates (google, facebook, newsletter)" },
                { param: "utm_medium", desc: "The marketing channel (cpc, email, organic, social)" },
                { param: "utm_campaign", desc: "Your campaign name (summer_sale, brand_awareness)" },
                { param: "utm_term", desc: "Paid search keywords (optional, for Google Ads)" },
                { param: "utm_content", desc: "Differentiate creatives or links (optional)" },
              ].map((item) => (
                <div
                  key={item.param}
                  className="rounded-xl border border-gray-100 bg-white p-4"
                >
                  <code className="text-sm font-mono text-blue-600">
                    {item.param}
                  </code>
                  <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
