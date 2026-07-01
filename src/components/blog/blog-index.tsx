"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, Tag, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { BlogPostMeta } from "@/lib/blog";
import { trackEvent } from "@/lib/analytics";

// ─── Constants ────────────────────────────────────────────────────────────────

const POSTS_PER_PAGE = 6;

const CATEGORY_COLORS: Record<string, { pill: string; dot: string }> = {
  "Campaign Tracking": { pill: "bg-blue-50 text-blue-700 border-blue-100",   dot: "bg-blue-500"   },
  "Paid Search":       { pill: "bg-purple-50 text-purple-700 border-purple-100", dot: "bg-purple-500" },
  "App Marketing":     { pill: "bg-green-50 text-green-700 border-green-100", dot: "bg-green-500"   },
  "Data & Analytics":  { pill: "bg-orange-50 text-orange-700 border-orange-100", dot: "bg-orange-500" },
  "Creative & Ads":    { pill: "bg-pink-50 text-pink-700 border-pink-100",    dot: "bg-pink-500"    },
  default:             { pill: "bg-gray-100 text-gray-600 border-gray-200",   dot: "bg-gray-400"    },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  posts: BlogPostMeta[];
  allTags: { tag: string; count: number }[];
  categories: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function Pagination({
  page,
  total,
  perPage,
  onChange,
}: {
  page: number;
  total: number;
  perPage: number;
  onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-12">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Prev
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              page === p
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === Math.ceil(total / perPage)}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Next <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BlogIndex({ posts, allTags, categories }: Props) {
  const [search, setSearch]             = useState("");
  const [activeTag, setActiveTag]       = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage]                 = useState(1);
  const [showAllTags, setShowAllTags]   = useState(false);

  // ── Filtering ──────────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let result = posts;
    if (activeCategory) result = result.filter((p) => p.category === activeCategory);
    if (activeTag)      result = result.filter((p) => p.tags?.includes(activeTag));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [posts, activeCategory, activeTag, search]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE),
    [filtered, page]
  );

  // ── Handlers ───────────────────────────────────────────────────────────────

  const setPageAndScroll = useCallback((p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
    trackEvent("blog_page_change", { page: p });
  }, []);

  const handleTagClick = useCallback(
    (tag: string) => {
      const next = activeTag === tag ? null : tag;
      setActiveTag(next);
      setPage(1);
      if (next) trackEvent("blog_tag_filter", { tag });
    },
    [activeTag]
  );

  const handleCategoryClick = useCallback(
    (cat: string) => {
      const next = activeCategory === cat ? null : cat;
      setActiveCategory(next);
      setPage(1);
      if (next) trackEvent("blog_category_filter", { category: cat });
    },
    [activeCategory]
  );

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
    if (q.length > 2) trackEvent("blog_search", { query: q });
  }, []);

  const clearAll = useCallback(() => {
    setSearch("");
    setActiveTag(null);
    setActiveCategory(null);
    setPage(1);
  }, []);

  const hasFilters = !!(search || activeTag || activeCategory);

  // ── Tag display ────────────────────────────────────────────────────────────
  const visibleTags = showAllTags ? allTags : allTags.slice(0, 12);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {/* ── Search bar ─────────────────────────────────────────────────────── */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search articles, topics, keywords…"
          className="w-full pl-11 pr-10 py-3 rounded-2xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all shadow-sm"
        />
        {search && (
          <button
            onClick={() => handleSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-3.5 w-3.5 text-gray-400" />
          </button>
        )}
      </div>

      {/* ── Category filter ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={clearAll}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            !activeCategory && !activeTag && !search
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          All
        </button>
        {categories.map((cat) => {
          const colors = CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.default;
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isActive
                  ? `${colors.pill} border-current shadow-sm scale-105`
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── Tag cloud ───────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Filter by topic
        </p>
        <div className="flex flex-wrap gap-2">
          {visibleTags.map(({ tag, count }) => {
            const isActive = activeTag === tag;
            return (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                }`}
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
                <span className={`text-[10px] ${isActive ? "text-blue-200" : "text-gray-400"}`}>
                  {count}
                </span>
              </button>
            );
          })}

          {allTags.length > 12 && (
            <button
              onClick={() => setShowAllTags(!showAllTags)}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              {showAllTags ? "Show less" : `+${allTags.length - 12} more`}
            </button>
          )}
        </div>
      </div>

      {/* ── Active filter summary ────────────────────────────────────────────── */}
      <AnimatePresence>
        {hasFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-blue-50 rounded-xl px-4 py-2.5">
              <span>
                <span className="font-semibold text-blue-700">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "article" : "articles"} found
                {activeCategory && (
                  <>
                    {" "}in <span className="font-semibold text-blue-700">{activeCategory}</span>
                  </>
                )}
                {activeTag && (
                  <>
                    {" "}tagged <span className="font-semibold text-blue-700">{activeTag}</span>
                  </>
                )}
                {search && (
                  <>
                    {" "}for <span className="font-semibold text-blue-700">&ldquo;{search}&rdquo;</span>
                  </>
                )}
              </span>
              <button
                onClick={clearAll}
                className="ml-auto flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Post list ───────────────────────────────────────────────────────── */}
      {paginated.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-2">No articles found.</p>
          <button onClick={clearAll} className="text-sm text-blue-600 underline underline-offset-2">
            Clear filters
          </button>
        </div>
      ) : (
        <div
          className="space-y-px"
          onClick={(e) => {
            const link = (e.target as HTMLElement).closest('a[href^="/blog/"]');
            if (link) {
              const href = link.getAttribute("href") ?? "";
              const slug = href.replace("/blog/", "");
              trackEvent("blog_article_clicked", { slug });
            }
          }}
        >
          <AnimatePresence mode="popLayout">
            {paginated.map((post, i) => {
              const colors = CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS.default;
              return (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, delay: i * 0.04 }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col sm:flex-row gap-6 py-8 border-b border-gray-100 hover:bg-gray-50 -mx-4 px-4 transition-colors rounded-lg"
                  >
                    {/* Number */}
                    <span className="hidden sm:block text-3xl font-bold text-gray-100 group-hover:text-gray-200 transition-colors w-12 shrink-0 pt-1 select-none">
                      {String((page - 1) * POSTS_PER_PAGE + i + 1).padStart(2, "0")}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${colors.pill}`}>
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={11} />
                          {post.readTime}
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(post.date)}</span>
                      </div>

                      <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-gray-500 leading-relaxed text-sm line-clamp-2">
                        {post.description}
                      </p>

                      {/* Clickable tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div
                          className="flex flex-wrap gap-1.5 mt-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {post.tags.slice(0, 5).map((tag) => (
                            <button
                              key={tag}
                              onClick={(e) => {
                                e.preventDefault();
                                handleTagClick(tag);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-all ${
                                activeTag === tag
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                              }`}
                            >
                              <Tag size={9} />
                              {tag}
                            </button>
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
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ── Pagination ──────────────────────────────────────────────────────── */}
      <Pagination
        page={page}
        total={filtered.length}
        perPage={POSTS_PER_PAGE}
        onChange={setPageAndScroll}
      />
    </div>
  );
}
