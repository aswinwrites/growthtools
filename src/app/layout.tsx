import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import AuthSessionProvider from "@/components/shared/session-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LoginPrompt from "@/components/shared/login-prompt";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://growthtools.io"
  ),
  title: {
    default: "GrowthTools — Free Tools for Growth Marketers",
    template: "%s | GrowthTools",
  },
  description:
    "Free marketing utilities for performance marketers, growth marketers, ASO specialists, and media buyers. UTM builder, QR generator, keyword match type tool, and more.",
  keywords: [
    "UTM builder",
    "campaign URL builder",
    "QR code generator",
    "keyword match type tool",
    "meta safe zone checker",
    "growth marketing tools",
    "performance marketing",
    "ASO tools",
    "free marketing tools",
  ],
  authors: [{ name: "GrowthTools" }],
  creator: "GrowthTools",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://growthtools.io",
    siteName: "GrowthTools",
    title: "GrowthTools — Free Tools for Growth Marketers",
    description:
      "UTM builder, QR generator, keyword match type tool and more — free for every marketer.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GrowthTools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowthTools — Free Tools for Growth Marketers",
    description:
      "UTM builder, QR generator, keyword match type tool and more — free for every marketer.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-white font-sans">
        <AuthSessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <LoginPrompt />
          <Toaster
            position="bottom-right"
            toastOptions={{
              classNames: {
                toast:
                  "rounded-xl border border-gray-100 shadow-lg font-sans text-sm",
              },
            }}
          />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
