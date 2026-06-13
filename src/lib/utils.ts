import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Build a UTM-tagged URL from params. Returns null if baseUrl is empty. */
export function buildUtmUrl(params: {
  baseUrl: string;
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}): string {
  if (!params.baseUrl) return "";
  try {
    const url = new URL(
      params.baseUrl.startsWith("http")
        ? params.baseUrl
        : `https://${params.baseUrl}`
    );
    const utmMap = {
      utm_source: params.source,
      utm_medium: params.medium,
      utm_campaign: params.campaign,
      utm_term: params.term,
      utm_content: params.content,
    };
    Object.entries(utmMap).forEach(([key, value]) => {
      if (value && value.trim()) {
        url.searchParams.set(key, value.trim());
      }
    });
    return url.toString();
  } catch {
    return "";
  }
}

/** Convert a naming-convention string: lowercase + replace spaces/special chars with underscore */
export function toNamingConvention(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/** Format keyword as Broad, [Phrase], or "Exact" match */
export function formatKeyword(
  kw: string,
  type: "broad" | "phrase" | "exact"
): string {
  const clean = kw.trim();
  if (!clean) return "";
  if (type === "broad") return clean;
  if (type === "phrase") return `"${clean}"`;
  return `[${clean}]`;
}

/** Slugify a string for short links */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Format large numbers nicely */
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

/** Copy text to clipboard and return promise */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    return true;
  }
}

/** Convert array of rows to CSV string */
export function toCSV(rows: string[][]): string {
  return rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

/** Download string as file */
export function downloadFile(
  content: string,
  filename: string,
  mimeType = "text/plain"
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Get relative time string */
export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/** Validate URL */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
}
