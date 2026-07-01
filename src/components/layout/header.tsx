"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Menu, X, User, LogOut, BarChart3, ChevronDown,
  Link2, Search, QrCode, Tag, Ruler, Braces, RefreshCw,
  Table, FileText, Database, Shield, Smartphone, BookOpen,
  Linkedin,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

// ─── Nav data ─────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: "campaign",
    label: "Campaign",
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: Link2,
    tools: [
      { name: "UTM Builder",        href: "/utm-builder",   desc: "Build tagged campaign URLs",          icon: Link2   },
      { name: "URL Shortener",      href: "/url-shortener", desc: "Shorten & track link clicks",         icon: Tag     },
      { name: "QR Code Generator",  href: "/qr-generator",  desc: "Custom QR codes — PNG & SVG",         icon: QrCode  },
    ],
  },
  {
    id: "paid-search",
    label: "Paid Search",
    color: "text-violet-600",
    bg: "bg-violet-50",
    icon: Search,
    tools: [
      { name: "Keyword Match Type", href: "/match-type",    desc: "Bulk convert to Broad / Phrase / Exact", icon: Search },
    ],
  },
  {
    id: "app-aso",
    label: "App & ASO",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    icon: Smartphone,
    tools: [
      { name: "Screenshot Checker", href: "/screenshot-checker", desc: "Verify App Store & Play Store sizes", icon: Ruler },
    ],
  },
  {
    id: "creative",
    label: "Creative",
    color: "text-pink-600",
    bg: "bg-pink-50",
    icon: Shield,
    tools: [
      { name: "Meta Safe Zone",     href: "/meta-safe-zone", desc: "Safe zones for all Meta ad placements", icon: Shield },
    ],
  },
  {
    id: "social",
    label: "Social",
    color: "text-blue-600",
    bg: "bg-blue-50",
    icon: Linkedin,
    tools: [
      { name: "LinkedIn Formatter", href: "/linkedin-formatter", desc: "Bold, italic, script + AI hooks & hashtags", icon: Linkedin },
    ],
  },
  {
    id: "data",
    label: "Data & Utils",
    color: "text-orange-600",
    bg: "bg-orange-50",
    icon: Database,
    tools: [
      { name: "JSON Formatter",     href: "/json-formatter",      desc: "Format, minify & validate JSON",        icon: Braces    },
      { name: "Image Converter",    href: "/image-converter",     desc: "Convert PNG, JPEG, WebP, SVG",          icon: RefreshCw },
      { name: "Image to CSV",       href: "/image-to-csv",        desc: "Extract table data from images with AI", icon: Table    },
      { name: "Screenshot to Text", href: "/screenshot-to-text",  desc: "AI-powered OCR from any screenshot",    icon: FileText  },
      { name: "Spreadsheet Ops",    href: "/spreadsheet",         desc: "26 operations — VLOOKUP, dedup & more", icon: Database  },
    ],
  },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

// ─── Dropdown for one category ─────────────────────────────────────────────────

function CategoryDropdown({
  cat,
  onClose,
}: {
  cat: (typeof CATEGORIES)[number];
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.13 }}
      className="absolute left-0 top-full pt-2 z-50"
      style={{ minWidth: 230 }}
    >
      <div className="rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50 p-1.5">
        {/* Category label */}
        <div className={`flex items-center gap-2 px-3 py-2 mb-0.5`}>
          <div className={`p-1 rounded-md ${cat.bg}`}>
            <cat.icon className={`h-3 w-3 ${cat.color}`} />
          </div>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            {cat.label}
          </span>
        </div>

        {/* Tool list */}
        {cat.tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            onClick={() => {
              onClose();
              trackEvent("nav_tool_click", { tool_name: tool.name });
            }}
            className="group flex items-start gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-50 transition-colors"
          >
            <div className={`p-1.5 rounded-lg ${cat.bg} shrink-0 mt-0.5`}>
              <tool.icon className={`h-3.5 w-3.5 ${cat.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 group-hover:text-gray-900 leading-tight">
                {tool.name}
              </p>
              <p className="text-xs text-gray-400 leading-snug mt-0.5">{tool.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

export default function Header() {
  const { data: session } = useSession();
  const [openCat, setOpenCat]     = useState<CategoryId | null>(null);
  const [userOpen, setUserOpen]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<CategoryId | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Click outside closes everything
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenCat(null);
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCatEnter = (id: CategoryId) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (openCat !== id) trackEvent("nav_category_hover", { category: id });
    setOpenCat(id);
  };

  const handleCatLeave = () => {
    closeTimer.current = setTimeout(() => setOpenCat(null), 160);
  };

  const keepOpen = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 group-hover:bg-blue-700 transition-colors">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">MarketerTools</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1" ref={navRef}>
            {CATEGORIES.map((cat) => {
              const isOpen = openCat === cat.id;
              return (
                <div
                  key={cat.id}
                  className="relative"
                  onMouseEnter={() => handleCatEnter(cat.id as CategoryId)}
                  onMouseLeave={handleCatLeave}
                >
                  <button
                    onClick={() => setOpenCat(isOpen ? null : cat.id as CategoryId)}
                    className={`flex items-center gap-1 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isOpen
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {cat.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <div
                        onMouseEnter={keepOpen}
                        onMouseLeave={handleCatLeave}
                      >
                        <CategoryDropdown
                          cat={cat}
                          onClose={() => setOpenCat(null)}
                        />
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Blog */}
            <Link
              href="/blog"
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
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

      {/* Mobile drawer — accordion per category */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-100 bg-white lg:hidden overflow-hidden"
          >
            <div className="max-h-[75vh] overflow-y-auto">
              {/* Blog */}
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

              {/* Accordion categories */}
              <div className="px-4 pb-4 space-y-1">
                {CATEGORIES.map((cat) => {
                  const expanded = mobileExpanded === cat.id;
                  return (
                    <div key={cat.id} className="rounded-xl border border-gray-100 overflow-hidden">
                      {/* Toggle header */}
                      <button
                        onClick={() => setMobileExpanded(expanded ? null : cat.id as CategoryId)}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`p-1.5 rounded-lg ${cat.bg}`}>
                            <cat.icon className={`h-3.5 w-3.5 ${cat.color}`} />
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{cat.label}</span>
                          <span className="text-xs text-gray-400">
                            {cat.tools.length} {cat.tools.length === 1 ? "tool" : "tools"}
                          </span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                        />
                      </button>

                      {/* Expanded tools */}
                      <AnimatePresence>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="overflow-hidden border-t border-gray-100"
                          >
                            <div className="p-2 space-y-0.5">
                              {cat.tools.map((tool) => (
                                <Link
                                  key={tool.href}
                                  href={tool.href}
                                  onClick={() => {
                                    setMobileOpen(false);
                                    setMobileExpanded(null);
                                    trackEvent("nav_tool_click", { tool_name: tool.name, source: "mobile" });
                                  }}
                                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-gray-50 transition-colors"
                                >
                                  <tool.icon className={`h-4 w-4 shrink-0 ${cat.color}`} />
                                  <div>
                                    <p className="text-sm font-medium text-gray-800">{tool.name}</p>
                                    <p className="text-xs text-gray-400 leading-tight">{tool.desc}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
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
