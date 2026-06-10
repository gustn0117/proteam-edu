export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

interface CertificateData {
  enrollment_id: string;
  user_name: string;
  certificate_name: string;
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
      e.certificate_name,
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

  // Use certificate_name if set by admin, otherwise user_name
  const displayName = data.certificate_name || data.user_name;

  // 수료증 번호: 제{year}-{4자리 일련번호}호
  // 일련번호는 같은 해에 완료된 수료증 중 created_at 기준으로 몇 번째인지로 결정
  const seqRow = db.prepare(`
    SELECT COUNT(*) AS seq FROM enrollments
    WHERE enrollment_status = 'completed'
      AND strftime('%Y', created_at) = strftime('%Y', (SELECT created_at FROM enrollments WHERE id = ?))
      AND created_at <= (SELECT created_at FROM enrollments WHERE id = ?)
  `).get(id, id) as { seq: number };

  const year = (data.completed_at || "").slice(0, 4) || new Date().getFullYear().toString();
  const cert_number = `제${year}-${String(seqRow.seq).padStart(4, "0")}호`;

  return NextResponse.json({ certificate: { ...data, display_name: displayName, cert_number } });
}
