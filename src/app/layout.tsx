import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import AuthSessionProvider from "@/components/shared/session-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LoginPrompt from "@/components/shared/login-prompt";
import ChatWidget from "@/components/shared/chat-widget";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://www.marketertools.fyi"
  ),
  title: {
    default: "MarketerTools — Free Tools for Marketers",
    template: "%s | MarketerTools",
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
  authors: [{ name: "MarketerTools" }],
  creator: "MarketerTools",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.marketertools.fyi",
    siteName: "MarketerTools",
    title: "MarketerTools — Free Tools for Marketers",
    description:
      "UTM builder, QR generator, keyword match type tool and more — free for every marketer.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MarketerTools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MarketerTools — Free Tools for Marketers",
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
  verification: {
    google: "SKbPfPZTgU0E_AVOL1yf75ChEvTUE4M66hiiBb5TUM4",
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
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-KW3R1R0JR6"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KW3R1R0JR6');
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white font-sans">
        <AuthSessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <LoginPrompt />
          <ChatWidget />
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
