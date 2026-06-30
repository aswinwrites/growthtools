import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    await prisma.emailLead.upsert({
      where: { email: email.trim().toLowerCase() },
      update: {},
      create: {
        email: email.trim().toLowerCase(),
        source: source ?? "newsletter",
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[newsletter]", err);
    return NextResponse.json(
      { error: "Failed to subscribe. Try again shortly." },
      { status: 500 }
    );
  }
}
