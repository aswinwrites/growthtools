import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getPost, getAllPosts, formatDate, extractFaqs } from "@/lib/blog";
import { mdxComponents } from "@/components/blog/mdx-components";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} | MarketerTools Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `https://marketertools.fyi/blog/${slug}`,
    },
    alternates: { canonical: `https://marketertools.fyi/blog/${slug}` },
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  "Campaign Tracking": "bg-blue-50 text-blue-700",
  "Paid Search": "bg-purple-50 text-purple-700",
  "App Marketing": "bg-green-50 text-green-700",
  "Data & Analytics": "bg-orange-50 text-orange-700",
  "Creative & Ads": "bg-pink-50 text-pink-700",
  default: "bg-gray-100 text-gray-700",
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const colorClass =
    CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS.default;

  // Article JSON-LD schema for GEO/AEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: post.author,
      url: "https://marketertools.fyi",
    },
    publisher: {
      "@type": "Organization",
      name: "MarketerTools",
      url: "https://marketertools.fyi",
      logo: {
        "@type": "ImageObject",
        url: "https://marketertools.fyi/og-image.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://marketertools.fyi/blog/${slug}`,
    },
  };

  // FAQPage JSON-LD — extracted from the article's ## FAQ section
  const faqs = extractFaqs(post.content);
  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <div className="min-h-screen bg-white">
        {/* Back nav */}
        <div className="border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={14} />
              All articles
            </Link>
          </div>
        </div>

        {/* Article header */}
        <div className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorClass}`}
              >
                {post.category}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock size={12} />
                {post.readTime}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(post.date)}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              {post.description}
            </p>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full flex items-center gap-1"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Article body */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug],
              },
            }}
          />

          {/* Author */}
          <div className="mt-16 pt-8 border-t border-gray-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              M
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{post.author}</p>
              {post.authorTitle && (
                <p className="text-xs text-gray-500 mt-0.5">{post.authorTitle}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Written by the MarketerTools team — practitioners who build and
                use tools for marketers every day.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
            <p className="text-lg font-bold text-gray-900 mb-2">
              Put this into practice
            </p>
            <p className="text-gray-600 text-sm mb-5">
              Use the free tools on MarketerTools to apply what you just read.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Browse all tools →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
