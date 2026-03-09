export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

interface CertificateData {
  enrollment_id: string;
  user_name: string;
  organization: string;
  course_name: string;
  course_type: string;
  start_date: string;
  end_date: string;
  duration: string;
  location: string;
  enrollment_status: string;
  completed_at: string;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const data = db.prepare(`
    SELECT
      e.id as enrollment_id,
      u.name as user_name,
      u.organization,
      c.name as course_name,
      c.course_type,
      c.start_date,
      c.end_date,
      c.duration,
      c.location,
      e.enrollment_status,
      e.created_at as completed_at
    FROM enrollments e
    JOIN users u ON e.user_id = u.id
    JOIN courses c ON e.course_id = c.id
    WHERE e.id = ? AND e.user_id = ?
  `).get(id, user.id) as CertificateData | undefined;

  if (!data) {
    return NextResponse.json({ error: "수료 정보를 찾을 수 없습니다." }, { status: 404 });
  }

  if (data.enrollment_status !== "completed") {
    return NextResponse.json({ error: "수료 상태가 아닙니다." }, { status: 403 });
  }

  return NextResponse.json({ certificate: data });
}
