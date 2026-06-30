import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Zap, Lock, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "MarketerTools is a free all-in-one toolkit for growth marketers. No paywalls, no dark patterns — just useful tools that work instantly.",
  openGraph: {
    title: "About MarketerTools",
    description:
      "Free tools for growth marketers who ship campaigns every day. No dark patterns, no forced signups.",
  },
};

const values = [
  {
    icon: Zap,
    color: "text-blue-600 bg-blue-50",
    title: "Tools that work instantly",
    description:
      "Every tool runs in your browser the moment you open it. No onboarding, no configuration, no waiting.",
  },
  {
    icon: Lock,
    color: "text-violet-600 bg-violet-50",
    title: "Privacy-first by design",
    description:
      "We process your campaign data client-side wherever possible. We don't store or sell anything you type into our tools.",
  },
  {
    icon: Globe,
    color: "text-emerald-600 bg-emerald-50",
    title: "Free forever",
    description:
      "Core tools stay free — always. We believe the friction of paywalls slows marketers down. So we removed it.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-gray-100 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-600">
            About MarketerTools
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl text-balance">
            Built by a marketer, for marketers
          </h1>
          <p className="mt-5 text-lg text-gray-500 leading-relaxed text-balance">
            MarketerTools started as a personal toolkit: a collection of
            utilities I kept rebuilding across jobs and agencies. Eventually it
            made more sense to just build them properly and share them.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-gray-900">The problem we solve</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Growth marketers spend a disproportionate amount of time on
              operational work: building UTMs, generating QR codes, reformatting
              data, verifying screenshots, checking ad safe zones. Most tools
              that help with this are locked behind expensive SaaS plans,
              require account creation just to run a query, or are so bloated
              they&apos;re slower than doing it manually.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              MarketerTools is the opposite. Every utility is available
              immediately, runs in your browser with no upload to a server, and
              does exactly what it says. Nothing more.
            </p>

            <h2 className="mt-10 text-2xl font-bold text-gray-900">What we&apos;re building</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              We&apos;re building the most comprehensive free toolkit for growth
              marketers: an all-in-one suite covering the operational and manual
              tasks that eat into your day. Campaign URL building, QR code
              generation, keyword match type conversion, screenshot validation,
              Meta safe zones, spreadsheet operations, JSON formatting, and more.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Logged-in users get extras: saved presets, URL shortening with
              link analytics, and cross-session history. But signing in is
              optional. The tools work either way.
            </p>

            <h2 className="mt-10 text-2xl font-bold text-gray-900">Who we are</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              MarketerTools is an independent project run by{" "}
              <a
                href="https://aswinsampathkumar.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Aswin Sampathkumar
              </a>
              , a growth marketer with experience across paid growth, ASO, and
              growth strategy for apps and SaaS products. It started as a side
              project and became a real product — used daily by growth marketers
              at agencies, startups, and growth teams.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Have a tool request, found a bug, or want to say hi? Use the chat
              button at the bottom right, or email{" "}
              <a
                href="mailto:aswin.growth@gmail.com"
                className="text-blue-600 hover:underline"
              >
                aswin.growth@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-gray-100 bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-2xl font-bold text-gray-900">
            What we stand for
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="flex flex-col gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${v.color}`}
                >
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Start using the tools
          </h2>
          <p className="mt-3 text-gray-500">
            No account required. Open any tool and start immediately.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            Browse all tools
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
