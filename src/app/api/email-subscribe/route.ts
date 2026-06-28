import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();

    if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    await db.emailLead.upsert({
      where: { email: email.trim().toLowerCase() },
      update: { source: source ?? null },
      create: {
        email: email.trim().toLowerCase(),
        source: source ?? null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("email-subscribe error:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
