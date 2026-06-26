"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { signIn, useSession } from "next-auth/react";

export default function HeroSection() {
  const { data: session } = useSession();

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 bg-grid-pattern opacity-50"
        aria-hidden="true"
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              Free for every marketer. No credit card required.
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl text-balance"
          >
            The Free Toolkit for{" "}
            <span className="gradient-text">Serious Marketers.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-5 text-lg text-gray-500 text-balance leading-relaxed"
          >
            Build campaign URLs, generate QR codes, preview app store
            screenshots, check Meta safe zones and more — all in your browser,
            instantly, for free.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              href="/utm-builder"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
            >
              Start Using Tools
              <ArrowRight className="h-4 w-4" />
            </Link>
            {!session && (
              <button
                onClick={() => signIn("google")}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-all"
              >
                {/* Google icon */}
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>
            )}
          </motion.div>

          {/* Trust signals */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-xs text-gray-400"
          >
            Used by growth marketers at agencies, startups, and enterprises.
            Always free. Always fast.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
