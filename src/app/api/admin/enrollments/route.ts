export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getAdminUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const courseId = req.nextUrl.searchParams.get("course_id");

  let enrollments;
  if (courseId) {
    enrollments = db
      .prepare(
        `SELECT e.*, u.name as user_name, u.organization, u.email as user_email, u.phone as user_phone,
                c.name as course_name, c.start_date, c.end_date
         FROM enrollments e
         JOIN users u ON e.user_id = u.id
         JOIN courses c ON e.course_id = c.id
         WHERE e.course_id = ?
         ORDER BY e.created_at DESC`
      )
      .all(courseId);
  } else {
    enrollments = db
      .prepare(
        `SELECT e.*, u.name as user_name, u.organization, u.email as user_email, u.phone as user_phone,
                c.name as course_name, c.start_date, c.end_date
         FROM enrollments e
         JOIN users u ON e.user_id = u.id
         JOIN courses c ON e.course_id = c.id
         ORDER BY e.created_at DESC`
      )
      .all();
  }

  return NextResponse.json({ enrollments });
}
