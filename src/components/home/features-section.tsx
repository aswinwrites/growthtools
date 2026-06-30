"use client";

import { motion } from "framer-motion";
import { Zap, Lock, History, BarChart3 } from "lucide-react";

const features = [
  {
    icon: <Zap className="h-5 w-5 text-blue-600" />,
    title: "Free forever, no card needed",
    description:
      "Every tool works in your browser immediately. No account needed. No trial period. No paywall after 30 days.",
  },
  {
    icon: <Lock className="h-5 w-5 text-violet-600" />,
    title: "Privacy-first architecture",
    description:
      "Client-side processing where possible. We don't store your campaign data unless you ask us to.",
  },
  {
    icon: <History className="h-5 w-5 text-emerald-600" />,
    title: "Save & reuse presets",
    description:
      "Sign in with Google to save UTM presets, QR styles, and naming conventions across sessions.",
  },
  {
    icon: <BarChart3 className="h-5 w-5 text-orange-600" />,
    title: "14-day link analytics",
    description:
      "Track clicks, countries, devices, and referrers on your short links. Auto-deleted after 14 days.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Fast tools. No friction. Free forever.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
