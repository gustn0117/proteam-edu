export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getAdminUser } from "@/lib/auth";

// 같은 사람이 이메일 오타 등으로 계정을 두 개 만들면 신청 내역이 갈라진다.
// 전화번호가 같거나, 이름과 이메일 아이디(@ 앞)가 같은 다른 계정을 중복 후보로 본다.
const DUP_ACCOUNTS_SQL = `
  SELECT group_concat(u2.email, ', ')
  FROM users u2
  WHERE u2.id != u.id
    AND u2.role != 'admin'
    AND (
      (u.phone != '' AND replace(u2.phone, '-', '') = replace(u.phone, '-', ''))
      OR (
        u.name != '' AND u2.name = u.name
        AND substr(lower(u2.email), 1, instr(u2.email, '@') - 1)
          = substr(lower(u.email), 1, instr(u.email, '@') - 1)
      )
    )
`;

const BASE_SQL = `
  SELECT e.*, u.name as user_name, u.organization, u.email as user_email, u.phone as user_phone,
         u.department, u.patent_no,
         (${DUP_ACCOUNTS_SQL}) as dup_emails,
         c.name as course_name, c.start_date, c.end_date
  FROM enrollments e
  JOIN users u ON e.user_id = u.id
  JOIN courses c ON e.course_id = c.id
`;

export async function GET(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const courseId = req.nextUrl.searchParams.get("course_id");

  const enrollments = courseId
    ? db.prepare(`${BASE_SQL} WHERE e.course_id = ? ORDER BY e.created_at DESC`).all(courseId)
    : db.prepare(`${BASE_SQL} ORDER BY e.created_at DESC`).all();

  // 수강생이 환불 신청 후 같은 과정을 다시 신청하면 기존 건이 보관 테이블로 옮겨진다.
  // 환불 처리가 남아 있는 건이므로 관리자 화면에서 놓치지 않도록 함께 내려준다.
  const ARCHIVE_SQL = `
    SELECT a.*, u.name as user_name, u.email as user_email, u.phone as user_phone,
           c.name as course_name
    FROM enrollment_archives a
    JOIN users u ON a.user_id = u.id
    JOIN courses c ON a.course_id = c.id
    WHERE a.enrollment_status = 'refund_requested' AND a.payment_status = 'paid'
  `;
  const pendingRefunds = courseId
    ? db.prepare(`${ARCHIVE_SQL} AND a.course_id = ? ORDER BY a.archived_at DESC`).all(courseId)
    : db.prepare(`${ARCHIVE_SQL} ORDER BY a.archived_at DESC`).all();

  return NextResponse.json({ enrollments, pendingRefunds });
}
