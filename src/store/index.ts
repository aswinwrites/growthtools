"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UTMParams, QROptions } from "@/types";

// ── UTM Store ─────────────────────────────────────────────────────────────────

interface UTMStore {
  params: UTMParams;
  history: { url: string; params: UTMParams; timestamp: number }[];
  setParams: (params: Partial<UTMParams>) => void;
  resetParams: () => void;
  addToHistory: (url: string, params: UTMParams) => void;
}

const defaultUTM: UTMParams = {
  baseUrl: "",
  source: "",
  medium: "",
  campaign: "",
  term: "",
  content: "",
};

export const useUTMStore = create<UTMStore>()(
  persist(
    (set) => ({
      params: defaultUTM,
      history: [],
      setParams: (incoming) =>
        set((state) => ({ params: { ...state.params, ...incoming } })),
      resetParams: () => set({ params: defaultUTM }),
      addToHistory: (url, params) =>
        set((state) => ({
          history: [
            { url, params, timestamp: Date.now() },
            ...state.history.slice(0, 9),
          ],
        })),
    }),
    { name: "utm-store" }
  )
);

// ── QR Store ──────────────────────────────────────────────────────────────────

interface QRStore {
  options: QROptions;
  setOptions: (opts: Partial<QROptions>) => void;
  resetOptions: () => void;
}

const defaultQR: QROptions = {
  type: "url",
  value: "",
  fgColor: "#000000",
  bgColor: "#FFFFFF",
  size: 300,
  errorCorrectionLevel: "M",
  margin: 2,
};

export const useQRStore = create<QRStore>()(
  persist(
    (set) => ({
      options: defaultQR,
      setOptions: (opts) =>
        set((state) => ({ options: { ...state.options, ...opts } })),
      resetOptions: () => set({ options: defaultQR }),
    }),
    { name: "qr-store" }
  )
);

// ── UI Store ──────────────────────────────────────────────────────────────────

interface UIStore {
  loginPromptOpen: boolean;
  loginPromptMessage: string;
  openLoginPrompt: (message?: string) => void;
  closeLoginPrompt: () => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  loginPromptOpen: false,
  loginPromptMessage: "Sign in to unlock this feature.",
  openLoginPrompt: (message = "Sign in to unlock this feature.") =>
    set({ loginPromptOpen: true, loginPromptMessage: message }),
  closeLoginPrompt: () => set({ loginPromptOpen: false }),
}));

// ── Match Type Store ──────────────────────────────────────────────────────────

interface MatchTypeStore {
  rawInput: string;
  setRawInput: (v: string) => void;
}

export const useMatchTypeStore = create<MatchTypeStore>()((set) => ({
  rawInput: "",
  setRawInput: (rawInput) => set({ rawInput }),
}));
