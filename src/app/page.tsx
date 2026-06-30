import type { Metadata } from "next";
import { Suspense } from "react";
import HeroSection from "@/components/home/hero-section";
import ToolsGrid from "@/components/home/tools-grid";
import FeaturesSection from "@/components/home/features-section";
import BlogPreview from "@/components/home/blog-preview";
import SocialProof from "@/components/home/social-proof";
import NewsletterSection from "@/components/home/newsletter-section";

export const metadata: Metadata = {
  title: "MarketerTools — Free Tools for Marketers",
  description:
    "Build campaign URLs, generate QR codes, check keyword match types, and more. Free tools for performance marketers, ASO specialists, and agencies.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Suspense>
        <HeroSection />
      </Suspense>
      <ToolsGrid />
      <BlogPreview />
      <FeaturesSection />
      <NewsletterSection />
      <SocialProof />
    </div>
  );
}
