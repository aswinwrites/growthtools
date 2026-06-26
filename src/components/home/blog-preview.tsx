import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";
import { ArrowRight, Clock, BookOpen } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  "Campaign Tracking": "bg-blue-50 text-blue-700",
  "Paid Search": "bg-purple-50 text-purple-700",
  "App Marketing": "bg-green-50 text-green-700",
  "Data & Analytics": "bg-orange-50 text-orange-700",
  "Creative & Ads": "bg-pink-50 text-pink-700",
  default: "bg-gray-100 text-gray-600",
};

export default function BlogPreview() {
  const posts = getAllPosts().slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="bg-white py-16 sm:py-20 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                From the Blog
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Learn the craft, not just the tool.
            </h2>
            <p className="mt-2 text-gray-500 max-w-xl">
              Practitioner-written guides on campaign tracking, paid search, ASO,
              and performance marketing. Cited, not ChatGPT&apos;d.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors shrink-0"
          >
            All articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Article cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const colorClass =
              CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS.default;
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-md hover:shadow-gray-100 transition-all duration-200"
              >
                {/* Meta */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorClass}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={11} />
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors flex-1">
                  {post.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-5">
                  {post.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs text-gray-400">{formatDate(post.date)}</span>
                  <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read
                    <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile "all articles" link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
          >
            All articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
