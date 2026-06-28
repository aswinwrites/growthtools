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
    title: "Free QR Code Generator | MarketerTools",
    description:
      "Custom QR codes with logo, colors, and styles. Export PNG or SVG. Free.",
    url: "https://www.marketertools.fyi/qr-generator",
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

        {/* SEO content */}
        <section className="mt-16 max-w-3xl">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            When to Use QR Codes in Marketing
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            QR codes bridge offline and online — a poster, a product package, or
            a business card can send someone directly to a landing page, app
            store listing, or campaign URL without typing anything. The key is
            always linking to a UTM-tagged URL so you can measure how many
            scans actually converted, not just how many people looked at the
            code.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Common high-ROI uses: app download campaigns (link directly to your
            App Store or Play Store listing), in-store promotions (scan to claim
            offer), product packaging (scan for setup instructions or extended
            warranty), and event signage (scan to register or get session info).
          </p>

          <h2 className="text-xl font-bold text-gray-900 mb-3 mt-8">
            QR Code Best Practices
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-2">
            A few things that determine whether a QR code actually gets scanned:
          </p>
          <ul className="text-gray-600 text-sm leading-relaxed space-y-2 list-disc pl-5 mb-4">
            <li><strong>Minimum print size:</strong> 2×2cm (about 0.8 inches square) for reliable scanning at arm's length. Smaller than that and phone cameras start struggling.</li>
            <li><strong>Contrast matters more than colour:</strong> Black on white is most reliable. If you're using a brand colour, keep high contrast between the dots and background — avoid light dots on light backgrounds.</li>
            <li><strong>Always test before printing:</strong> Scan with multiple devices (iOS, Android, different camera apps) before the print run.</li>
            <li><strong>Quiet zone:</strong> Keep a clear margin (the white space around the QR code) of at least 4 modules wide. Cutting the quiet zone breaks scanning.</li>
            <li><strong>Track it:</strong> Link to a UTM-tagged URL so you know which placements are driving scans.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 mb-3 mt-8">
            PNG vs SVG — Which to Export
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Export SVG for print (billboards, posters, packaging) — it scales
            to any size without pixelating. Export PNG for digital use (emails,
            websites, presentations) — most email clients and CMS platforms
            don't support SVG. For print, always export SVG at the highest
            quality and let your designer or printer handle the final sizing.
          </p>
        </section>
      </div>
    </div>
  );
}
