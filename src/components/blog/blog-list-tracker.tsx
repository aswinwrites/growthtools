"use client";

import { trackEvent } from "@/lib/analytics";

export function BlogListTracker({ children }: { children: React.ReactNode }) {
  return (
    <div
      onClick={(e) => {
        const link = (e.target as HTMLElement).closest('a[href^="/blog/"]');
        if (link) {
          const href = link.getAttribute("href") ?? "";
          const slug = href.replace("/blog/", "");
          trackEvent("blog_article_clicked", { slug });
        }
      }}
    >
      {children}
    </div>
  );
}
