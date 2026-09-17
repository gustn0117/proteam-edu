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

// 재신청으로 대체되는 기존 신청 건을 보관한다. 결제완료 후 환불신청 상태였다면
// 환불 처리에 필요한 payment_key / order_id가 여기에 남아야 한다.
function archiveEnrollment(row: any, reason: string) {
  db.prepare(
    `INSERT INTO enrollment_archives
       (id, user_id, course_id, payment_status, enrollment_status, payment_key, order_id,
        certificate_name, certificate_url, refund_requested_at, created_at, archived_reason)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    row.id, row.user_id, row.course_id, row.payment_status, row.enrollment_status,
    row.payment_key || "", row.order_id || "",
    row.certificate_name || "", row.certificate_url || "",
    row.refund_requested_at || "", row.created_at || "", reason
  );
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { course_id } = await req.json();

  // 이미 신청한 적이 있는 과정인지 확인.
  // 취소(cancelled) / 환불신청(refund_requested) 건은 관리자가 따로 삭제해주지 않아도
  // 본인이 바로 다시 신청할 수 있어야 한다. 단 결제·환불 기록은 보관한 뒤 새 신청을 만든다.
  const existing = db
    .prepare("SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?")
    .get(user.id, course_id) as any;

  if (existing) {
    const reusable = existing.enrollment_status === "cancelled" || existing.enrollment_status === "refund_requested";

    if (!reusable) {
      const messages: Record<string, string> = {
        pending:
          "이미 신청하신 교육과정입니다.\n결제가 필요하시면 '결제하기' 메뉴를 이용해 주세요.\n신청을 다시 하시려면 '취소 및 환불' 메뉴에서 기존 신청을 취소하신 후 다시 신청해 주세요.",
        confirmed:
          "이미 신청이 완료된 교육과정입니다.\n신청을 다시 하시려면 '취소 및 환불' 메뉴에서 기존 신청을 취소(환불 신청)하신 후 다시 신청해 주세요.",
        completed: "이미 수료하신 교육과정입니다.",
      };
      return NextResponse.json(
        { error: messages[existing.enrollment_status] || "이미 신청한 교육과정입니다." },
        { status: 409 }
      );
    }

    archiveEnrollment(existing, existing.enrollment_status === "refund_requested" ? "재신청(환불신청 건)" : "재신청(취소 건)");
    db.prepare("DELETE FROM enrollments WHERE id = ?").run(existing.id);
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

  // 실제 마감 정원: capacity_internal이 0보다 크면 그것, 아니면 공개 정원(capacity)
  const limit = (course.capacity_internal && course.capacity_internal > 0) ? course.capacity_internal : course.capacity;

  if (enrolledCount.count >= limit) {
    return NextResponse.json({ error: "모집 정원이 초과되었습니다." }, { status: 400 });
  }

  const id = uuidv4();
  db.prepare(
    `INSERT INTO enrollments (id, user_id, course_id) VALUES (?, ?, ?)`
  ).run(id, user.id, course_id);

  // 정원 도달 시 자동 접수마감
  const newCount = (enrolledCount.count as number) + 1;
  if (newCount >= limit) {
    db.prepare("UPDATE courses SET status = 'closed' WHERE id = ?").run(course_id);
  }

  return NextResponse.json({ success: true, id });
}
