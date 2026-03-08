export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const enrollment = db
    .prepare("SELECT * FROM enrollments WHERE id = ? AND user_id = ?")
    .get(id, user.id) as any;

  if (!enrollment) {
    return NextResponse.json({ error: "신청 내역을 찾을 수 없습니다." }, { status: 404 });
  }

  if (enrollment.enrollment_status === "completed") {
    return NextResponse.json({ error: "수료 처리된 교육은 취소할 수 없습니다." }, { status: 400 });
  }

  if (enrollment.enrollment_status === "cancelled" || enrollment.enrollment_status === "refund_requested") {
    return NextResponse.json({ error: "이미 취소/환불 처리된 신청입니다." }, { status: 400 });
  }

  if (enrollment.payment_status === "paid") {
    // Paid enrollment → refund request regardless of enrollment_status
    db.prepare("UPDATE enrollments SET enrollment_status = 'refund_requested' WHERE id = ?").run(id);
    return NextResponse.json({ success: true, message: "환불 신청이 접수되었습니다." });
  }

  db.prepare("UPDATE enrollments SET enrollment_status = 'cancelled' WHERE id = ?").run(id);
  return NextResponse.json({ success: true, message: "교육 신청이 취소되었습니다." });
}
