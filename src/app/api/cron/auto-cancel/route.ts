export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

const CRON_SECRET = process.env.CRON_SECRET || "proteam-cron-2026";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 영향받을 강좌 id 미리 수집 (재개 처리용)
  const affectedCourses = db.prepare(`
    SELECT DISTINCT course_id FROM enrollments
    WHERE payment_status = 'unpaid'
      AND enrollment_status IN ('pending', 'confirmed')
      AND created_at <= datetime('now', '-48 hours')
  `).all() as { course_id: string }[];

  // 48시간 초과 미결제 → 자동 취소
  const result = db.prepare(`
    UPDATE enrollments
    SET enrollment_status = 'cancelled'
    WHERE payment_status = 'unpaid'
      AND enrollment_status IN ('pending', 'confirmed')
      AND created_at <= datetime('now', '-48 hours')
  `).run();

  // 정원 미달 시 마감 → 접수중 자동 재개
  for (const { course_id } of affectedCourses) {
    const course = db.prepare("SELECT capacity, capacity_internal, status FROM courses WHERE id = ?").get(course_id) as any;
    if (!course || course.status !== "closed") continue;
    const limit = (course.capacity_internal && course.capacity_internal > 0) ? course.capacity_internal : course.capacity;
    const cnt = db.prepare(
      "SELECT COUNT(*) as count FROM enrollments WHERE course_id = ? AND enrollment_status != 'cancelled'"
    ).get(course_id) as any;
    if (cnt.count < limit) {
      db.prepare("UPDATE courses SET status = 'accepting' WHERE id = ?").run(course_id);
    }
  }

  return NextResponse.json({
    success: true,
    cancelled: result.changes,
    timestamp: new Date().toISOString(),
  });
}
