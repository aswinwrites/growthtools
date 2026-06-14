"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Link2,
  QrCode,
  Tag,
  Search,
  Ruler,
  Shield,
  Smartphone,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Color =
  | "blue"
  | "violet"
  | "emerald"
  | "orange"
  | "sky"
  | "pink"
  | "indigo"
  | "green";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  color: Color;
}

const ACTIVE_TOOLS: NavItem[] = [
  { name: "UTM Builder", href: "/utm-builder", icon: Link2, color: "blue" },
  { name: "Match Type", href: "/match-type", icon: Search, color: "violet" },
  { name: "QR Generator", href: "/qr-generator", icon: QrCode, color: "emerald" },
  { name: "URL Shortener", href: "/url-shortener", icon: Tag, color: "orange" },
  { name: "Screenshot Checker", href: "/screenshot-checker", icon: Ruler, color: "sky" },
];

const SOON_TOOLS: NavItem[] = [
  { name: "Meta Safe Zone", href: "/meta-safe-zone", icon: Shield, color: "pink" },
  { name: "App Store Preview", href: "/app-store-preview", icon: Smartphone, color: "indigo" },
  { name: "Play Store Preview", href: "/play-store-preview", icon: Monitor, color: "green" },
];

const activeBg: Record<Color, string> = {
  blue: "bg-blue-50 text-blue-700",
  violet: "bg-violet-50 text-violet-700",
  emerald: "bg-emerald-50 text-emerald-700",
  orange: "bg-orange-50 text-orange-700",
  sky: "bg-sky-50 text-sky-700",
  pink: "bg-pink-50 text-pink-700",
  indigo: "bg-indigo-50 text-indigo-700",
  green: "bg-green-50 text-green-700",
};

const activeIcon: Record<Color, string> = {
  blue: "text-blue-600",
  violet: "text-violet-600",
  emerald: "text-emerald-600",
  orange: "text-orange-600",
  sky: "text-sky-600",
  pink: "text-pink-600",
  indigo: "text-indigo-600",
  green: "text-green-600",
};

export default function ToolsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-gray-100 bg-white sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
      <nav className="p-3 flex flex-col gap-4">
        {/* Active tools */}
        <div>
          <p className="px-3 pt-1 pb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            Tools
          </p>
          <div className="space-y-0.5">
            {ACTIVE_TOOLS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? activeBg[item.color]
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isActive ? activeIcon[item.color] : "text-gray-400"
                    )}
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Coming soon */}
        <div>
          <p className="px-3 pt-1 pb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            Coming Soon
          </p>
          <div className="space-y-0.5">
            {SOON_TOOLS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.href}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 opacity-40 select-none cursor-default"
                >
                  <Icon className="h-4 w-4 shrink-0 text-gray-400" />
                  <span className="text-sm text-gray-500 truncate flex-1">
                    {item.name}
                  </span>
                  <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide shrink-0">
                    Soon
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
}
