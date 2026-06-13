import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Metadata } from "next";
import DashboardClient from "./dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  const [links, utmPresets] = await Promise.all([
    db.shortLink.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        slug: true,
        destination: true,
        clicks: true,
        createdAt: true,
      },
    }),
    db.uTMPreset.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
  ]);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://growthtools.io";

  const serialized = {
    user: session.user,
    links: links.map((l) => ({
      ...l,
      shortUrl: `${appUrl}/s/${l.slug}`,
      createdAt: l.createdAt.toISOString(),
    })),
    utmPresets: utmPresets.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <DashboardClient data={serialized} />
      </div>
    </div>
  );
}
