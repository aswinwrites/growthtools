"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const tools = [
  { name: "UTM Builder", href: "/utm-builder" },
  { name: "Match Type Tool", href: "/match-type" },
  { name: "QR Generator", href: "/qr-generator" },
  { name: "URL Shortener", href: "/url-shortener" },
  { name: "Meta Safe Zone", href: "/meta-safe-zone" },
  { name: "Screenshot Checker", href: "/screenshot-checker" },
  { name: "Spreadsheet Ops", href: "/spreadsheet" },
  { name: "JSON Formatter", href: "/json-formatter" },
  { name: "Image Converter", href: "/image-converter" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">MarketerTools</span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 max-w-xs">
              Free tools for growth marketers. Free forever. No credit card. No dark patterns.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Tools</h3>
            <ul className="space-y-2">
              {tools.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    onClick={() => trackEvent("footer_link_clicked", { destination: tool.href })}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} MarketerTools. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Built for performance marketers.{" "}
            <span className="text-blue-500">Always free.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
