"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Menu, X, User, LogOut, BarChart3, ChevronDown,
  Link2, Search, QrCode, Tag, Ruler, Braces, RefreshCw,
  Table, FileText, Database, Shield, Smartphone, BookOpen,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

const CATEGORIES = [
  {
    name: "Campaign & Tracking",
    icon: Link2,
    color: "text-blue-600",
    bg: "bg-blue-50",
    tools: [
      { name: "UTM Builder", href: "/utm-builder", desc: "Build tagged campaign URLs", icon: Link2 },
      { name: "URL Shortener", href: "/url-shortener", desc: "Shorten & track link clicks", icon: Tag },
      { name: "QR Code Generator", href: "/qr-generator", desc: "Custom QR codes — PNG & SVG", icon: QrCode },
    ],
  },
  {
    name: "Paid Search",
    icon: Search,
    color: "text-violet-600",
    bg: "bg-violet-50",
    tools: [
      { name: "Keyword Match Type", href: "/match-type", desc: "Bulk convert keywords to Broad / Phrase / Exact", icon: Search },
    ],
  },
  {
    name: "App & ASO",
    icon: Smartphone,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    tools: [
      { name: "Screenshot Checker", href: "/screenshot-checker", desc: "Verify App Store & Play Store screenshot sizes", icon: Ruler },
    ],
  },
  {
    name: "Creative & Ads",
    icon: Shield,
    color: "text-pink-600",
    bg: "bg-pink-50",
    tools: [
      { name: "Meta Safe Zone", href: "/meta-safe-zone", desc: "Overlay safe zones for all Meta ad placements", icon: Shield },
    ],
  },
  {
    name: "Data & Utilities",
    icon: Database,
    color: "text-orange-600",
    bg: "bg-orange-50",
    tools: [
      { name: "JSON Formatter", href: "/json-formatter", desc: "Format, minify & validate JSON", icon: Braces },
      { name: "Image Converter", href: "/image-converter", desc: "Convert PNG, JPEG, WebP, SVG", icon: RefreshCw },
      { name: "Image to CSV", href: "/image-to-csv", desc: "Extract table data from screenshots with AI", icon: Table },
      { name: "Screenshot to Text", href: "/screenshot-to-text", desc: "AI-powered OCR — copy any text from images", icon: FileText },
      { name: "Spreadsheet Ops", href: "/spreadsheet", desc: "26 browser-based operations — no uploads", icon: Database },
    ],
  },
];

export default function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close mega menu when clicking outside
  const megaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMenuEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (!megaOpen) trackEvent("mega_menu_opened");
    setMegaOpen(true);
  };
  const handleMenuLeave = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 150);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 group-hover:bg-blue-700 transition-colors">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">MarketerTools</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1" ref={megaRef}>
            {/* Tools mega-menu trigger */}
            <div
              className="relative"
              onMouseEnter={handleMenuEnter}
              onMouseLeave={handleMenuLeave}
            >
              <button
                onClick={() => setMegaOpen((o) => !o)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  megaOpen
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Tools
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Mega menu */}
              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    onMouseEnter={handleMenuEnter}
                    onMouseLeave={handleMenuLeave}
                    className="absolute left-0 top-full pt-2 z-50 w-[680px]"
                  >
                    <div className="rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/60 p-5">
                      <div className="grid grid-cols-3 gap-x-5 gap-y-5">
                        {CATEGORIES.map((cat) => (
                          <div key={cat.name}>
                            {/* Category header */}
                            <div className={`flex items-center gap-2 mb-2.5`}>
                              <div className={`p-1.5 rounded-lg ${cat.bg}`}>
                                <cat.icon className={`h-3.5 w-3.5 ${cat.color}`} />
                              </div>
                              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {cat.name}
                              </span>
                            </div>
                            {/* Tools */}
                            <div className="space-y-0.5">
                              {cat.tools.map((tool) => (
                                <Link
                                  key={tool.href}
                                  href={tool.href}
                                  onClick={() => {
                                    setMegaOpen(false);
                                    trackEvent("nav_tool_click", { tool_name: tool.name });
                                  }}
                                  className="group/tool flex items-start gap-2.5 rounded-lg px-2 py-2 hover:bg-gray-50 transition-colors"
                                >
                                  <tool.icon className={`h-4 w-4 mt-0.5 shrink-0 ${cat.color} opacity-70`} />
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-sm font-medium text-gray-800 group-hover/tool:text-gray-900">
                                        {tool.name}
                                      </span>
                                      {"badge" in tool && tool.badge && (
                                        <span className="text-[10px] font-medium bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">
                                          {tool.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-400 leading-snug mt-0.5">
                                      {tool.desc}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer strip */}
                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {CATEGORIES.reduce((n, c) => n + c.tools.length, 0)} tools · free forever · no card needed
                        </span>
                        <Link
                          href="/"
                          onClick={() => setMegaOpen(false)}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          Browse all →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Blog */}
            <Link
              href="/blog"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Blog
            </Link>
          </nav>

          {/* Right: auth + mobile trigger */}
          <div className="flex items-center gap-2 shrink-0">
            {session ? (
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 pl-3 pr-1 py-1 hover:border-gray-300 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                  {session.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt={session.user.name ?? "User"}
                      className="h-7 w-7 rounded-full"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                </button>
                {userOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-gray-100 bg-white shadow-lg"
                    >
                      <div className="p-1">
                        <div className="px-3 py-2 border-b border-gray-100 mb-1">
                          <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setUserOpen(false)}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <BarChart3 className="h-4 w-4" />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => signOut()}
                          className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => { trackEvent("cta_header_signin"); signIn("google"); }}
                className="hidden lg:flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 active:scale-95 transition-all"
              >
                Sign in free
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden rounded-md p-2 text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => {
                const next = !mobileOpen;
                setMobileOpen(next);
                if (next) trackEvent("mobile_menu_opened");
              }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-100 bg-white lg:hidden overflow-hidden"
          >
            <div className="max-h-[75vh] overflow-y-auto">
              {/* Blog link */}
              <div className="px-4 pt-3 pb-2">
                <Link
                  href="/blog"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 rounded-xl px-4 py-3"
                >
                  <BookOpen className="h-4 w-4" />
                  Blog — Guides & Insights
                </Link>
              </div>

              {/* Categorised tools */}
              <div className="px-4 pb-4 space-y-4">
                {CATEGORIES.map((cat) => (
                  <div key={cat.name}>
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <div className={`p-1 rounded-md ${cat.bg}`}>
                        <cat.icon className={`h-3 w-3 ${cat.color}`} />
                      </div>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {cat.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {cat.tools.map((tool) => (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={() => {
                            setMobileOpen(false);
                            trackEvent("nav_tool_click", { tool_name: tool.name, source: "mobile" });
                          }}
                          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <tool.icon className={`h-3.5 w-3.5 shrink-0 ${cat.color} opacity-70`} />
                          <span className="leading-snug">{tool.name}</span>
                          {"badge" in tool && tool.badge && (
                            <span className="text-[9px] bg-gray-100 text-gray-400 px-1 py-0.5 rounded-full ml-auto">
                              {tool.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Auth */}
              {!session && (
                <div className="border-t border-gray-100 px-4 py-3">
                  <button
                    onClick={() => signIn("google")}
                    className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    Sign in free
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
