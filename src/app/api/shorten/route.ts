import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { isValidUrl } from "@/lib/utils";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://marketertools.fyi";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, customSlug } = body as {
      url: string;
      customSlug?: string;
    };

    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL provided" },
        { status: 400 }
      );
    }

    const session = await auth();
    const slug = customSlug?.trim() || nanoid(7);

    // Validate custom slug if provided
    if (customSlug) {
      if (!/^[a-z0-9-]{3,30}$/.test(customSlug)) {
        return NextResponse.json(
          {
            error:
              "Custom slug must be 3–30 lowercase alphanumeric characters or hyphens",
          },
          { status: 400 }
        );
      }

      // Check uniqueness
      const existing = await db.shortLink.findUnique({
        where: { slug: customSlug },
      });
      if (existing) {
        return NextResponse.json(
          { error: "This custom slug is already taken" },
          { status: 409 }
        );
      }
    }

    const link = await db.shortLink.create({
      data: {
        slug,
        destination: url,
        userId: session?.user?.id ?? null,
      },
    });

    return NextResponse.json({
      success: true,
      link: {
        id: link.id,
        slug: link.slug,
        destination: link.destination,
        shortUrl: `${APP_URL}/s/${link.slug}`,
        clicks: link.clicks,
        createdAt: link.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[shorten] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(_req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const links = await db.shortLink.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      slug: true,
      destination: true,
      clicks: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    links: links.map((l) => ({
      ...l,
      shortUrl: `${APP_URL}/s/${l.slug}`,
      createdAt: l.createdAt.toISOString(),
    })),
  });
}
