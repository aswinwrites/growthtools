import type { Metadata } from "next";
import QRGenerator from "@/components/tools/qr-generator/qr-generator";

export const metadata: Metadata = {
  title: "QR Code Generator — Free Custom QR Codes",
  description:
    "Generate custom QR codes for URLs, text, phone numbers, email, and app links. Customize colors, dot styles, and add your logo. Export as PNG or SVG. Free, no signup.",
  keywords: [
    "QR code generator",
    "free QR code",
    "custom QR code",
    "QR code with logo",
    "QR code maker",
    "app QR code",
    "marketing QR code",
  ],
  openGraph: {
    title: "Free QR Code Generator | GrowthTools",
    description:
      "Custom QR codes with logo, colors, and styles. Export PNG or SVG. Free.",
    url: "https://growthtools.io/qr-generator",
  },
};

export default function QRGeneratorPage() {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">QR Code Generator</h1>
          <p className="mt-2 text-gray-500">
            Generate custom QR codes for any URL, text, or link. Customize
            colors, add your logo, and export as PNG or SVG.
          </p>
        </div>
        <QRGenerator />
      </div>
    </div>
  );
}
