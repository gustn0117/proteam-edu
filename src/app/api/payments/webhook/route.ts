export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// Toss Payments webhook handler
// 두 가지 이벤트 형식 지원:
//  1) PAYMENT_STATUS_CHANGED : { eventType, data: { orderId, status, ... } }
//  2) DEPOSIT_CALLBACK       : { orderId, status, transactionKey, secret }  (가상계좌 입금)
export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  // 두 형식에서 orderId / status 추출
  const orderId: string | undefined = body?.data?.orderId ?? body?.orderId;
  const status: string | undefined = body?.data?.status ?? body?.status;

  if (!orderId || !status) {
    return NextResponse.json({ ok: true });
  }

  const enrollment = db
    .prepare("SELECT id FROM enrollments WHERE order_id = ?")
    .get(orderId) as any;

  if (!enrollment) {
    return NextResponse.json({ ok: true });
  }

  // 입금/결제 완료 → paid 처리
  if (status === "DONE") {
    db.prepare(
      `UPDATE enrollments SET payment_status = 'paid', enrollment_status = 'confirmed' WHERE id = ?`
    ).run(enrollment.id);
  }

  // 결제 취소
  if (status === "CANCELED" || status === "PARTIAL_CANCELED") {
    db.prepare(
      `UPDATE enrollments SET payment_status = 'unpaid', enrollment_status = 'cancelled' WHERE id = ?`
    ).run(enrollment.id);
  }

  // 가상계좌 입금 만료
  if (status === "EXPIRED") {
    db.prepare(
      `UPDATE enrollments SET enrollment_status = 'cancelled' WHERE id = ?`
    ).run(enrollment.id);
  }

  return NextResponse.json({ ok: true });
}
