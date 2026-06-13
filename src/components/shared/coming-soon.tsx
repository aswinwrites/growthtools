"use client";

import { motion } from "framer-motion";
import { Clock, Bell } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ComingSoonProps {
  toolName: string;
  description: string;
  eta?: string;
}

export default function ComingSoon({
  toolName,
  description,
  eta = "Q1 2025",
}: ComingSoonProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success("You're on the list! We'll email you when it launches.");
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md text-center px-4"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
          <Clock className="h-8 w-8 text-blue-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">{toolName}</h1>
        <p className="mt-2 text-gray-500">{description}</p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5">
          <span className="text-sm font-medium text-blue-600">
            Launching {eta}
          </span>
        </div>

        {!submitted ? (
          <form onSubmit={handleNotify} className="mt-8">
            <p className="text-sm text-gray-600 mb-3">
              Get notified when it launches:
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <Bell className="h-4 w-4" />
                Notify me
              </button>
            </div>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 rounded-xl bg-green-50 border border-green-100 px-6 py-4"
          >
            <p className="text-sm font-medium text-green-700">
              ✓ You&apos;re on the list!
            </p>
            <p className="text-xs text-green-500 mt-0.5">
              We&apos;ll email you at {email} when {toolName} launches.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
