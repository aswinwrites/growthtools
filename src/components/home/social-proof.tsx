"use client";

import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { trackEvent } from "@/lib/analytics";

export default function SocialProof() {
  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-blue-600 px-8 py-12 text-center"
        >
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            The marketer&apos;s toolkit that stays free
          </h2>
          <p className="mt-2 text-blue-200 max-w-lg mx-auto">
            Sign in with Google to unlock saved presets, link analytics, and
            cross-session history. Takes 10 seconds. Always free.
          </p>
          <button
            onClick={() => {
              trackEvent("cta_social_proof_signup");
              signIn("google");
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 active:scale-[0.98] transition-all"
          >
            Get started for free
          </button>
        </motion.div>
      </div>
    </section>
  );
}
