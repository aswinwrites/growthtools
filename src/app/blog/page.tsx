import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";
import { ArrowRight, Clock, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Marketing Blog — Guides, Tips & Insights | MarketerTools",
  description:
    "In-depth guides on UTM tracking, Google Ads match types, app store optimisation, and performance marketing — written by practitioners, not content mills.",
  openGraph: {
    title: "Marketing Blog — MarketerTools",
    description:
      "Practitioner-written guides on campaign tracking, paid search, ASO, and more.",
    url: "https://marketertools.fyi/blog",
  },
  alternates: { canonical: "https://marketertools.fyi/blog" },
};

const CATEGORY_COLORS: Record<string, string> = {
  "Campaign Tracking": "bg-blue-50 text-blue-700",
  "Paid Search": "bg-purple-50 text-purple-700",
  "App Marketing": "bg-green-50 text-green-700",
  "Data & Analytics": "bg-orange-50 text-orange-700",
  "Creative & Ads": "bg-pink-50 text-pink-700",
  default: "bg-gray-100 text-gray-700",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
            The MarketerTools Blog
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Marketing that actually works.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            No listicles. No fluff. Practitioner-written guides on campaign
            tracking, paid search, ASO, and performance marketing — with the
            citations to back them up.
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {posts.length === 0 ? (
          <p className="text-gray-400 text-center py-20">Coming soon.</p>
        ) : (
          <div className="space-y-px">
            {posts.map((post, i) => {
              const colorClass =
                CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS.default;
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col sm:flex-row gap-6 py-8 border-b border-gray-100 hover:bg-gray-50 -mx-4 px-4 transition-colors rounded-lg"
                >
                  {/* Number */}
                  <span className="hidden sm:block text-3xl font-bold text-gray-100 group-hover:text-gray-200 transition-colors w-12 shrink-0 pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colorClass}`}
                      >
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {post.readTime}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(post.date)}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 leading-relaxed text-sm line-clamp-2">
                      {post.description}
                    </p>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-gray-400 flex items-center gap-1"
                          >
                            <Tag size={10} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center shrink-0">
                    <ArrowRight
                      size={18}
                      className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
