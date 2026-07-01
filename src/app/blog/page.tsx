import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import BlogIndex from "@/components/blog/blog-index";

export const metadata: Metadata = {
  title: "Marketing Blog — Guides, Tips & Insights | MarketerTools",
  description:
    "In-depth guides on UTM tracking, Google Ads match types, app store optimisation, and performance marketing — written by practitioners, not content mills.",
  openGraph: {
    title: "Marketing Blog — MarketerTools",
    description:
      "Practitioner-written guides on campaign tracking, paid search, ASO, and more.",
    url: "https://www.marketertools.fyi/blog",
  },
  alternates: { canonical: "https://www.marketertools.fyi/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();

  // Build tag frequency map, sorted by count desc then alpha
  const tagFreq: Record<string, number> = {};
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      tagFreq[tag] = (tagFreq[tag] ?? 0) + 1;
    }
  }
  const allTags = Object.entries(tagFreq)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag, count]) => ({ tag, count }));

  // Unique categories in publication order (deduplicated)
  const categories = [...new Set(posts.map((p) => p.category))];

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

      {/* Interactive list — search, tag filter, pagination */}
      <BlogIndex posts={posts} allTags={allTags} categories={categories} />
    </div>
  );
}
