export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

const CRON_SECRET = process.env.CRON_SECRET || "proteam-cron-2026";

export async function GET(req: NextRequest) {
  // Simple auth check
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find unpaid enrollments older than 24 hours
  const result = db.prepare(`
    UPDATE enrollments
    SET enrollment_status = 'cancelled'
    WHERE payment_status = 'unpaid'
      AND enrollment_status IN ('pending', 'confirmed')
      AND created_at <= datetime('now', '-24 hours')
  `).run();

  return NextResponse.json({
    success: true,
    cancelled: result.changes,
    timestamp: new Date().toISOString(),
  });
}
