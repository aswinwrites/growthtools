"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Link2,
  MousePointerClick,
  BookmarkCheck,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import CopyButton from "@/components/shared/copy-button";
import { timeAgo } from "@/lib/utils";

interface Props {
  data: {
    user: { name?: string | null; email?: string | null; image?: string | null };
    links: {
      id: string;
      slug: string;
      destination: string;
      shortUrl: string;
      clicks: number;
      createdAt: string;
    }[];
    utmPresets: {
      id: string;
      name: string;
      source: string;
      medium: string;
      campaign: string | null;
    }[];
  };
}

export default function DashboardClient({ data }: Props) {
  const [activeTab, setActiveTab] = useState<"links" | "presets">("links");
  const totalClicks = data.links.reduce((s, l) => s + l.clicks, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back{data.user.name ? `, ${data.user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Your MarketerTools dashboard
          </p>
        </div>
        <Link
          href="/utm-builder"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Open a tool
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          {
            icon: <Link2 className="h-5 w-5 text-blue-600" />,
            label: "Short Links",
            value: data.links.length,
            bg: "bg-blue-50",
          },
          {
            icon: <MousePointerClick className="h-5 w-5 text-emerald-600" />,
            label: "Total Clicks",
            value: totalClicks,
            bg: "bg-emerald-50",
          },
          {
            icon: <BookmarkCheck className="h-5 w-5 text-violet-600" />,
            label: "UTM Presets",
            value: data.utmPresets.length,
            bg: "bg-violet-50",
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-100 bg-white p-5"
          >
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
        <div className="flex border-b border-gray-100">
          {(["links", "presets"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "links"
                ? `Short Links (${data.links.length})`
                : `UTM Presets (${data.utmPresets.length})`}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === "links" && (
            <div className="space-y-3">
              {data.links.length === 0 ? (
                <div className="text-center py-8">
                  <Link2 className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-400">No links yet</p>
                  <Link
                    href="/url-shortener"
                    className="mt-2 text-xs text-blue-500 hover:underline"
                  >
                    Create your first short link
                  </Link>
                </div>
              ) : (
                data.links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <a
                          href={link.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {link.shortUrl}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {link.destination}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <MousePointerClick className="h-3 w-3" />
                          {link.clicks} clicks
                        </span>
                        <span className="text-xs text-gray-400">
                          {timeAgo(new Date(link.createdAt))}
                        </span>
                      </div>
                    </div>
                    <CopyButton
                      text={link.shortUrl}
                      label="Copy"
                      className="flex-shrink-0 py-1.5 px-3 text-xs"
                    />
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "presets" && (
            <div className="space-y-3">
              {data.utmPresets.length === 0 ? (
                <div className="text-center py-8">
                  <BookmarkCheck className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-400">No saved presets</p>
                  <Link
                    href="/utm-builder"
                    className="mt-2 text-xs text-blue-500 hover:underline"
                  >
                    Save your first UTM preset
                  </Link>
                </div>
              ) : (
                data.utmPresets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {preset.name}
                      </p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">
                        {preset.source} / {preset.medium}
                        {preset.campaign ? ` / ${preset.campaign}` : ""}
                      </p>
                    </div>
                    <Link
                      href={`/utm-builder?preset=${preset.id}`}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Apply
                    </Link>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
