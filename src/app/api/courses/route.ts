export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getAdminUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const courses = db
    .prepare(
      `SELECT c.*,
        (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id AND e.enrollment_status NOT IN ('cancelled')) as enrolled_count
       FROM courses c ORDER BY c.start_date DESC`
    )
    .all();
  return NextResponse.json({ courses });
}

export async function POST(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const body = await req.json();
  const id = uuidv4();

  db.prepare(
    `INSERT INTO courses (id, name, start_date, end_date, duration, capacity, location, status, category, course_type, fee, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    body.name,
    body.start_date,
    body.end_date,
    body.duration,
    body.capacity,
    body.location,
    body.status || "accepting",
    body.category || "offline",
    body.course_type || "",
    body.fee || 0,
    body.description || ""
  );

  return NextResponse.json({ success: true, id });
}
