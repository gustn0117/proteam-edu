export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getAdminUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = db
    .prepare(
      `SELECT c.*,
        (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id AND e.enrollment_status NOT IN ('cancelled')) as enrolled_count
       FROM courses c WHERE c.id = ?`
    )
    .get(id);

  if (!course) {
    return NextResponse.json({ error: "과정을 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json({ course });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  db.prepare(
    `UPDATE courses SET name=?, start_date=?, end_date=?, duration=?, capacity=?, location=?, status=?, category=?, course_type=?, fee=?, description=?
     WHERE id=?`
  ).run(
    body.name,
    body.start_date,
    body.end_date,
    body.duration,
    body.capacity,
    body.location,
    body.status,
    body.category,
    body.course_type || "",
    body.fee,
    body.description,
    id
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { id } = await params;
  db.prepare("DELETE FROM enrollments WHERE course_id = ?").run(id);
  db.prepare("DELETE FROM courses WHERE id = ?").run(id);

  return NextResponse.json({ success: true });
}
