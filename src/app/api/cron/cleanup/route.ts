import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Vercel cron job: runs daily at 2am
// Deletes link analytics older than 14 days
export async function GET() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 14);

  const deleted = await db.linkClick.deleteMany({
    where: { createdAt: { lt: cutoff } },
  });

  // Also delete orphaned anonymous links older than 30 days
  const oldLinks = new Date();
  oldLinks.setDate(oldLinks.getDate() - 30);

  const deletedLinks = await db.shortLink.deleteMany({
    where: {
      userId: null,
      createdAt: { lt: oldLinks },
    },
  });

  return NextResponse.json({
    success: true,
    deletedClicks: deleted.count,
    deletedLinks: deletedLinks.count,
    timestamp: new Date().toISOString(),
  });
}
