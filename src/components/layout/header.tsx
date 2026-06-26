"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Zap, Menu, X, User, LogOut, BarChart3 } from "lucide-react";
import { useState } from "react";

const MOBILE_TOOLS = [
  { name: "UTM Builder", href: "/utm-builder" },
  { name: "Match Type Tool", href: "/match-type" },
  { name: "QR Generator", href: "/qr-generator" },
  { name: "URL Shortener", href: "/url-shortener" },
  { name: "Screenshot Checker", href: "/screenshot-checker" },
  { name: "JSON Formatter", href: "/json-formatter" },
  { name: "Image Converter", href: "/image-converter" },
  { name: "Image to CSV", href: "/image-to-csv" },
  { name: "Screenshot to Text", href: "/screenshot-to-text" },
  { name: "Meta Safe Zone", href: "/meta-safe-zone" },
  { name: "Spreadsheet Ops", href: "/spreadsheet" },
  { name: "App Store Preview", href: "/app-store-preview", badge: "Soon" },
  { name: "Play Store Preview", href: "/play-store-preview", badge: "Soon" },
];

export default function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 group-hover:bg-blue-700 transition-colors">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">MarketerTools</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Blog
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 pl-3 pr-1 py-1 hover:border-gray-300 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
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
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-gray-100 bg-white shadow-lg"
                    >
                      <div className="p-1">
                        <div className="px-3 py-2 border-b border-gray-100 mb-1">
                          <p className="text-xs text-gray-500 truncate">
                            {session.user?.email}
                          </p>
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
                onClick={() => signIn("google")}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 active:scale-95 transition-all"
              >
                Sign in
              </button>
            )}

            {/* Mobile menu button — only on < lg (sidebar not visible) */}
            <button
              className="lg:hidden rounded-md p-2 text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile tools drawer */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-gray-100 bg-white lg:hidden"
        >
          <nav className="px-4 py-3 grid grid-cols-2 gap-1">
            <Link
              href="/blog"
              onClick={() => setMobileOpen(false)}
              className="col-span-2 flex items-center rounded-lg px-3 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors border-b border-gray-100 mb-1 pb-3"
            >
              Blog →
            </Link>
            {MOBILE_TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {tool.name}
                {tool.badge && (
                  <span className="text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">
                    {tool.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
}
