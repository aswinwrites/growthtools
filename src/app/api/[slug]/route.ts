import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { UAParser } from "ua-parser-js";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const link = await db.shortLink.findUnique({
    where: { slug },
  });

  if (!link) {
    return NextResponse.redirect(
      new URL("/", req.url)
    );
  }

  // Record analytics asynchronously (don't await — don't block redirect)
  void recordClick(req, link.id).catch(console.error);

  return NextResponse.redirect(link.destination, { status: 302 });
}

async function recordClick(req: NextRequest, linkId: string) {
  const ua = req.headers.get("user-agent") ?? "";
  const parser = new UAParser(ua);
  const result = parser.getResult();

  const device =
    result.device.type === "mobile"
      ? "mobile"
      : result.device.type === "tablet"
      ? "tablet"
      : "desktop";

  const browser = result.browser.name ?? "Unknown";
  const os = result.os.name ?? "Unknown";

  // Extract referrer
  const referrer = req.headers.get("referer") ?? null;

  // Increment click count + create analytics record in parallel
  await Promise.all([
    db.shortLink.update({
      where: { id: linkId },
      data: { clicks: { increment: 1 } },
    }),
    db.linkClick.create({
      data: {
        linkId,
        device,
        browser,
        os,
        referrer,
        // Note: for country/city, integrate a geo IP service (e.g., ipinfo.io)
      },
    }),
  ]);
}
