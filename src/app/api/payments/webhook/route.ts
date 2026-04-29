export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// Toss Payments webhook handler
// 가상계좌 입금/취소 등 결제 상태 변경 알림 수신
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { eventType, data } = body;

  if (!data?.orderId) {
    return NextResponse.json({ ok: true });
  }

  const enrollment = db
    .prepare("SELECT id FROM enrollments WHERE order_id = ?")
    .get(data.orderId) as any;

  if (!enrollment) {
    return NextResponse.json({ ok: true });
  }

  // 가상계좌 입금 완료 → paid 처리
  if (eventType === "PAYMENT_STATUS_CHANGED" && data.status === "DONE") {
    db.prepare(
      `UPDATE enrollments SET payment_status = 'paid', enrollment_status = 'confirmed' WHERE id = ?`
    ).run(enrollment.id);
  }

  // 결제 취소
  if (eventType === "PAYMENT_STATUS_CHANGED" && data.status === "CANCELED") {
    db.prepare(
      `UPDATE enrollments SET payment_status = 'unpaid', enrollment_status = 'cancelled' WHERE id = ?`
    ).run(enrollment.id);
  }

  // 가상계좌 입금 만료
  if (eventType === "PAYMENT_STATUS_CHANGED" && data.status === "EXPIRED") {
    db.prepare(
      `UPDATE enrollments SET enrollment_status = 'cancelled' WHERE id = ?`
    ).run(enrollment.id);
  }

  return NextResponse.json({ ok: true });
}
