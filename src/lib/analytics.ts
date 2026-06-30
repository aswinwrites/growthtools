/**
 * Typed wrapper around window.gtag for GA4 custom event tracking.
 * Property: G-KW3R1R0JR6
 *
 * Usage:
 *   import { trackEvent } from "@/lib/analytics";
 *   trackEvent("utm_url_generated", { mode: "web" });
 */

type EventParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params?: EventParams): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params ?? {});
}
