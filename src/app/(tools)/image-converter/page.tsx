import type { Metadata } from "next";
import ImageConverter from "@/components/tools/image-converter/image-converter";
import { RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Image Format Converter: PNG, JPEG, WebP, SVG | Free – GrowthTools",
  description:
    "Convert images between PNG, JPEG, WebP, and SVG formats instantly in your browser. Adjust quality, scale SVGs to any resolution. No upload, no watermark, no limits.",
  keywords: [
    "image converter", "convert PNG to JPEG", "convert JPEG to WebP",
    "SVG to PNG converter", "PNG to SVG", "WebP converter", "free image converter online",
    "convert image format browser", "no upload image converter",
  ],
  openGraph: {
    title: "Free Image Format Converter – PNG, JPEG, WebP, SVG",
    description:
      "Instantly convert between PNG, JPEG, WebP, and SVG in your browser. Quality control and scale settings — no file upload to any server.",
    url: "https://growthtools.vercel.app/image-converter",
    type: "website",
  },
  alternates: { canonical: "https://growthtools.vercel.app/image-converter" },
};

const CONVERSIONS = [
  { from: "SVG", to: "PNG", note: "Perfect pixel-crisp export at any scale" },
  { from: "SVG", to: "JPEG", note: "White background, JPEG quality control" },
  { from: "SVG", to: "WebP", note: "Modern format with transparency" },
  { from: "PNG", to: "JPEG", note: "Shrink PNG file size by 60–80%" },
  { from: "PNG", to: "WebP", note: "~26% smaller than PNG, lossless option" },
  { from: "JPEG", to: "PNG", note: "Lossless with transparency support" },
  { from: "JPEG", to: "WebP", note: "~25–34% smaller than JPEG" },
  { from: "PNG / JPEG", to: "SVG", note: "Embed raster inside SVG wrapper" },
];

export default function ImageConverterPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 shadow-md shadow-orange-200">
              <RefreshCw className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-600 border border-orange-100">
                Free
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
                No upload
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Image Format Converter
          </h1>
          <p className="mt-2 text-gray-500 max-w-xl">
            Convert between PNG, JPEG, WebP, and SVG — instantly in your browser. Adjust quality and scale, then download. No upload, no watermark, no server.
          </p>
        </div>
      </div>

      {/* Tool */}
      <div className="mx-auto max-w-3xl px-6 py-8">
        <ImageConverter />
      </div>

      {/* Conversions table */}
      <div className="border-t border-gray-100 bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Supported conversions</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CONVERSIONS.map(({ from, to, note }) => (
              <div key={from + to} className="rounded-2xl border border-gray-200 bg-white p-4">
                <p className="text-sm font-bold text-gray-900">{from} → {to}</p>
                <p className="mt-1 text-xs text-gray-500">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="px-6 py-12">
        <div className="mx-auto max-w-4xl space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Frequently asked questions</h2>
          {[
            {
              q: "Does my image get uploaded to your servers?",
              a: "No. All conversion happens client-side using the HTML5 Canvas API. Your files never leave your device.",
            },
            {
              q: "How does SVG → PNG conversion work?",
              a: "The SVG is loaded as an image into an HTML canvas element, then exported as PNG at the chosen scale. You can set 1×, 2×, 3×, or 4× scale for Retina-ready exports.",
            },
            {
              q: "Is PNG → SVG actually vectorized?",
              a: "No — and we're transparent about this. The raster image is embedded as a data URI inside an SVG wrapper. True vector tracing requires tools like Inkscape or Adobe Illustrator.",
            },
            {
              q: "Which format should I use for web images?",
              a: "WebP is the modern standard — ~25–30% smaller than PNG or JPEG with equivalent quality. Use PNG for images requiring transparency where WebP isn't supported. Use JPEG for photographs.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-gray-100 pb-6">
              <p className="font-semibold text-gray-900">{q}</p>
              <p className="mt-1 text-sm text-gray-500">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
