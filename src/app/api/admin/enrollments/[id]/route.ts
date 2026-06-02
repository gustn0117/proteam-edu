export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getAdminUser } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  const updates: string[] = [];
  const values: any[] = [];

  if (body.payment_status !== undefined) {
    updates.push("payment_status = ?");
    values.push(body.payment_status);
  }
  if (body.enrollment_status !== undefined) {
    updates.push("enrollment_status = ?");
    values.push(body.enrollment_status);
  }
  if (body.certificate_name !== undefined) {
    updates.push("certificate_name = ?");
    values.push(body.certificate_name);
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: "변경할 내용이 없습니다." }, { status: 400 });
  }

  // Auto-confirm if payment is marked as paid
  if (body.payment_status === "paid" && body.enrollment_status === undefined) {
    updates.push("enrollment_status = ?");
    values.push("confirmed");
  }

  values.push(id);
  db.prepare(`UPDATE enrollments SET ${updates.join(", ")} WHERE id = ?`).run(...values);

  // 신청상태가 변경되면 강좌 정원 재계산 → 마감/접수중 자동 전환
  syncCourseStatusForEnrollment(id);

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { id } = await params;
  const enr = db.prepare("SELECT course_id FROM enrollments WHERE id = ?").get(id) as any;
  db.prepare("DELETE FROM enrollments WHERE id = ?").run(id);

  if (enr?.course_id) syncCourseStatus(enr.course_id);

  return NextResponse.json({ success: true });
}

function syncCourseStatusForEnrollment(enrollmentId: string) {
  const enr = db.prepare("SELECT course_id FROM enrollments WHERE id = ?").get(enrollmentId) as any;
  if (enr?.course_id) syncCourseStatus(enr.course_id);
}

function syncCourseStatus(courseId: string) {
  const course = db.prepare("SELECT capacity, status FROM courses WHERE id = ?").get(courseId) as any;
  if (!course) return;
  const cnt = db.prepare(
    "SELECT COUNT(*) as count FROM enrollments WHERE course_id = ? AND enrollment_status != 'cancelled'"
  ).get(courseId) as any;
  if (cnt.count >= course.capacity && course.status === "accepting") {
    db.prepare("UPDATE courses SET status = 'closed' WHERE id = ?").run(courseId);
  } else if (cnt.count < course.capacity && course.status === "closed") {
    db.prepare("UPDATE courses SET status = 'accepting' WHERE id = ?").run(courseId);
  }
}
