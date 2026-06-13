import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const linkId = searchParams.get("linkId");

  if (!linkId) {
    return NextResponse.json({ error: "linkId required" }, { status: 400 });
  }

  // Verify ownership
  const link = await db.shortLink.findFirst({
    where: { id: linkId, userId: session.user.id },
  });

  if (!link) {
    return NextResponse.json({ error: "Link not found" }, { status: 404 });
  }

  // 14-day window
  const since = new Date();
  since.setDate(since.getDate() - 14);

  const clicks = await db.linkClick.findMany({
    where: {
      linkId,
      createdAt: { gte: since },
    },
    select: {
      device: true,
      browser: true,
      country: true,
      city: true,
      referrer: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // Aggregate by day
  const byDay = clicks.reduce<Record<string, number>>((acc, c) => {
    const day = c.createdAt.toISOString().split("T")[0];
    acc[day] = (acc[day] ?? 0) + 1;
    return acc;
  }, {});

  const clicksByDay = Object.entries(byDay).map(([date, count]) => ({
    date,
    count,
  }));

  // Top countries
  const countryCounts = clicks.reduce<Record<string, number>>((acc, c) => {
    const k = c.country ?? "Unknown";
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

  const topCountries = Object.entries(countryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([country, count]) => ({ country, count }));

  // Top devices
  const deviceCounts = clicks.reduce<Record<string, number>>((acc, c) => {
    const k = c.device ?? "Unknown";
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

  const topDevices = Object.entries(deviceCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([device, count]) => ({ device, count }));

  // Top browsers
  const browserCounts = clicks.reduce<Record<string, number>>((acc, c) => {
    const k = c.browser ?? "Unknown";
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

  const topBrowsers = Object.entries(browserCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([browser, count]) => ({ browser, count }));

  // Top cities
  const cityCounts = clicks.reduce<Record<string, number>>((acc, c) => {
    const k = c.city ? `${c.city}${c.country ? `, ${c.country}` : ""}` : "Unknown";
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

  const topCities = Object.entries(cityCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([city, count]) => ({ city, count }));

  return NextResponse.json({
    totalClicks: clicks.length,
    clicksByDay,
    topCountries,
    topCities,
    topDevices,
    topBrowsers,
  });
}
