export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const enrollments = db
    .prepare(
      `SELECT e.*, c.name as course_name, c.start_date, c.end_date, c.duration, c.location, c.fee
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.user_id = ?
       ORDER BY e.created_at DESC`
    )
    .all(user.id);

  return NextResponse.json({ enrollments });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { course_id } = await req.json();

  // Check if already enrolled (allow re-enrollment if previously cancelled)
  const existing = db
    .prepare("SELECT id, enrollment_status FROM enrollments WHERE user_id = ? AND course_id = ?")
    .get(user.id, course_id) as any;
  if (existing) {
    if (existing.enrollment_status === "cancelled") {
      db.prepare("DELETE FROM enrollments WHERE id = ?").run(existing.id);
    } else {
      return NextResponse.json({ error: "이미 신청한 교육과정입니다." }, { status: 409 });
    }
  }

  // Check capacity
  const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(course_id) as any;
  if (!course) {
    return NextResponse.json({ error: "교육과정을 찾을 수 없습니다." }, { status: 404 });
  }

  if (course.status === "closed") {
    return NextResponse.json({ error: "접수가 마감되었습니다." }, { status: 400 });
  }

  const enrolledCount = db
    .prepare(
      "SELECT COUNT(*) as count FROM enrollments WHERE course_id = ? AND enrollment_status != 'cancelled'"
    )
    .get(course_id) as any;

  if (enrolledCount.count >= course.capacity) {
    return NextResponse.json({ error: "모집 정원이 초과되었습니다." }, { status: 400 });
  }

  const id = uuidv4();
  db.prepare(
    `INSERT INTO enrollments (id, user_id, course_id) VALUES (?, ?, ?)`
  ).run(id, user.id, course_id);

  return NextResponse.json({ success: true, id });
}
