"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

const stats = [
  { value: "7+", label: "Marketing Tools" },
  { value: "100%", label: "Free to Use" },
  { value: "0", label: "Dark Patterns" },
  { value: "∞", label: "Campaigns Built" },
];

export default function SocialProof() {
  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 mb-14">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-gray-900">{stat.value}</div>
              <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-blue-600 px-8 py-12 text-center"
        >
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Save your first UTM preset
          </h2>
          <p className="mt-2 text-blue-200 max-w-lg mx-auto">
            Sign in with Google to unlock history, presets, and link analytics.
            Takes 10 seconds. Always free.
          </p>
          <button
            onClick={() => signIn("google")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 active:scale-[0.98] transition-all"
          >
            Get started for free
          </button>
        </motion.div>
      </div>
    </section>
  );
}
