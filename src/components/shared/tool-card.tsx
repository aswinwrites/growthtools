"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  badge?: "new" | "coming-soon" | "beta";
  colorClass: string;
  bgClass: string;
  index?: number;
  onClick?: () => void;
}

export default function ToolCard({
  name,
  description,
  href,
  icon,
  badge,
  colorClass,
  bgClass,
  index = 0,
  onClick,
}: ToolCardProps) {
  const isComingSoon = badge === "coming-soon";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
    >
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "group block rounded-2xl border border-gray-100 bg-white p-6",
          "hover:border-gray-200 hover:shadow-md transition-all duration-200",
          isComingSoon && "opacity-70 cursor-default pointer-events-none"
        )}
      >
        <div
          className={cn(
            "mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl",
            bgClass
          )}
        >
          <div className={cn("h-5 w-5", colorClass)}>{icon}</div>
        </div>

        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {badge === "new" && (
              <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                New
              </span>
            )}
            {badge === "beta" && (
              <span className="text-xs font-medium bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
                Beta
              </span>
            )}
            {isComingSoon && (
              <span className="flex items-center gap-1 text-xs font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                <Clock className="h-3 w-3" />
                Soon
              </span>
            )}
          </div>
        </div>

        <p className="mt-1 text-sm text-gray-500 leading-relaxed">{description}</p>

        {!isComingSoon && (
          <div className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
            Open tool
            <ArrowRight className="h-4 w-4" />
          </div>
        )}
      </Link>
    </motion.div>
  );
}
