import {
  Link2,
  QrCode,
  Tag,
  Shield,
  Smartphone,
  Monitor,
  Search,
  Ruler,
} from "lucide-react";
import ToolCard from "@/components/shared/tool-card";

const tools = [
  {
    name: "UTM Builder",
    description:
      "Build campaign URLs for web and app. Presets for Google, Meta, LinkedIn, WhatsApp. Includes Play Store referrer URL builder for mobile UA campaigns.",
    href: "/utm-builder",
    icon: <Link2 className="h-5 w-5" />,
    colorClass: "text-blue-600",
    bgClass: "bg-blue-50",
  },
  {
    name: "Keyword Match Type Tool",
    description:
      "Convert keywords to Broad, Phrase, and Exact match in bulk. CSV export, copy all, keyword and character count.",
    href: "/match-type",
    icon: <Search className="h-5 w-5" />,
    colorClass: "text-violet-600",
    bgClass: "bg-violet-50",
  },
  {
    name: "QR Code Generator",
    description:
      "Generate QR codes for URLs, text, phone numbers, and app links. Custom colors, dot styles, logo upload. Export PNG or SVG.",
    href: "/qr-generator",
    icon: <QrCode className="h-5 w-5" />,
    colorClass: "text-emerald-600",
    bgClass: "bg-emerald-50",
  },
  {
    name: "URL Shortener",
    description:
      "Shorten links instantly. Logged-in users get click tracking, geography, city-level data, device, browser, and 14-day analytics.",
    href: "/url-shortener",
    icon: <Tag className="h-5 w-5" />,
    colorClass: "text-orange-600",
    bgClass: "bg-orange-50",
  },
  {
    name: "Screenshot Dimension Checker",
    description:
      "Upload screenshots and instantly verify they meet App Store and Play Store size requirements. Checks all iPhone, iPad, and Android sizes. Runs entirely in-browser.",
    href: "/screenshot-checker",
    icon: <Ruler className="h-5 w-5" />,
    colorClass: "text-sky-600",
    bgClass: "bg-sky-50",
  },
  {
    name: "Meta Safe Zone Checker",
    description:
      "Upload creative and see Reels, Story, and Feed safe zone overlays. Client-side processing. Download with overlay.",
    href: "/meta-safe-zone",
    icon: <Shield className="h-5 w-5" />,
    colorClass: "text-pink-600",
    bgClass: "bg-pink-50",
    badge: "coming-soon" as const,
  },
  {
    name: "App Store Preview",
    description:
      "Preview your screenshots in iPhone and iPad frames. Dark & light mode. Drag to reorder. See exactly what users see.",
    href: "/app-store-preview",
    icon: <Smartphone className="h-5 w-5" />,
    colorClass: "text-sky-600",
    bgClass: "bg-sky-50",
    badge: "coming-soon" as const,
  },
  {
    name: "Play Store Preview",
    description:
      "Preview Android phone and tablet screenshots in a live Google Play Store frame. Drag to reorder. Dark mode support.",
    href: "/play-store-preview",
    icon: <Monitor className="h-5 w-5" />,
    colorClass: "text-green-600",
    bgClass: "bg-green-50",
    badge: "coming-soon" as const,
  },
];

export default function ToolsGrid() {
  return (
    <section className="bg-gray-50/50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            The complete marketer&apos;s toolkit
          </h2>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
            Every tool you need to run better campaigns. No paywalls. No forced signups.
            Just useful utilities that save hours.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool, i) => (
            <ToolCard key={tool.href} {...tool} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
