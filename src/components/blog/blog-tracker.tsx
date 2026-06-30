"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

export function BlogTracker({ slug }: { slug: string }) {
  const fired = useRef(new Set<number>());

  useEffect(() => {
    fired.current.clear();
    const thresholds = [25, 50, 75, 100];

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);
      for (const t of thresholds) {
        if (pct >= t && !fired.current.has(t)) {
          fired.current.add(t);
          trackEvent("blog_scroll_depth", { slug, depth: t });
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  return null;
}
