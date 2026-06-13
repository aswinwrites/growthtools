// ── Tool Types ────────────────────────────────────────────────────────────────

export type ToolId =
  | "utm-builder"
  | "match-type"
  | "qr-generator"
  | "url-shortener"
  | "meta-safe-zone"
  | "play-store-preview"
  | "app-store-preview";

export interface Tool {
  id: ToolId;
  name: string;
  description: string;
  href: string;
  icon: string;
  badge?: "new" | "coming-soon" | "beta";
  color: string;
  bgColor: string;
}

// ── UTM Builder ───────────────────────────────────────────────────────────────

export interface UTMParams {
  baseUrl: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
}

export interface UTMPresetTemplate {
  id: string;
  name: string;
  source: string;
  medium: string;
  campaignHint?: string;
}

// ── Keyword Match Type ─────────────────────────────────────────────────────────

export interface KeywordRow {
  original: string;
  broad: string;
  phrase: string;
  exact: string;
}

// ── QR Generator ─────────────────────────────────────────────────────────────

export type QRInputType = "url" | "text" | "email" | "phone" | "app-link";

export interface QROptions {
  type: QRInputType;
  value: string;
  fgColor: string;
  bgColor: string;
  size: number;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  margin: number;
}

// ── Short Links ───────────────────────────────────────────────────────────────

export interface ShortLinkData {
  id: string;
  slug: string;
  destination: string;
  title?: string;
  clicks: number;
  createdAt: Date;
}

export interface LinkAnalyticsSummary {
  totalClicks: number;
  topCountries: { country: string; count: number }[];
  topBrowsers: { browser: string; count: number }[];
  topDevices: { device: string; count: number }[];
  clicksByDay: { date: string; count: number }[];
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// ── API Responses ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
