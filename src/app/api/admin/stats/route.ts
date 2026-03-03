export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const totalMembers = (db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'user'").get() as any).count;
  const totalCourses = (db.prepare("SELECT COUNT(*) as count FROM courses").get() as any).count;
  const totalEnrollments = (db.prepare("SELECT COUNT(*) as count FROM enrollments").get() as any).count;

  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const monthEnrollments = (db.prepare("SELECT COUNT(*) as count FROM enrollments WHERE created_at >= ?").get(monthStart) as any).count;

  const recentEnrollments = db
    .prepare(
      `SELECT e.id, e.enrollment_status, e.payment_status, e.created_at,
              u.name as user_name, c.name as course_name
       FROM enrollments e
       JOIN users u ON e.user_id = u.id
       JOIN courses c ON e.course_id = c.id
       ORDER BY e.created_at DESC
       LIMIT 5`
    )
    .all();

  return NextResponse.json({
    stats: { totalMembers, totalCourses, totalEnrollments, monthEnrollments },
    recentEnrollments,
  });
}
