export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

const SECRET_KEY = process.env.TOSS_SECRET_KEY || "test_sk_docs_OaPz8L5KdmQXkzRz3y47BMw6";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { paymentKey, orderId, amount, courseId, buyerName, buyerEmail, buyerPhone, organization } = body;

  if (!paymentKey || !orderId || !amount || !courseId) {
    return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
  }

  // Verify course exists and amount matches
  const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(courseId) as any;
  if (!course) {
    return NextResponse.json({ error: "교육과정을 찾을 수 없습니다." }, { status: 404 });
  }
  if (course.fee !== Number(amount)) {
    return NextResponse.json({ error: "결제 금액이 일치하지 않습니다." }, { status: 400 });
  }

  // Confirm payment with Toss
  const auth = Buffer.from(`${SECRET_KEY}:`).toString("base64");
  const tossRes = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });
  const tossData = await tossRes.json();

  if (!tossRes.ok) {
    return NextResponse.json({ error: tossData.message || "결제 승인 실패" }, { status: 400 });
  }

  // Create or find user
  const user = await getCurrentUser();
  let userId = user?.id;

  if (!userId && buyerEmail) {
    // Guest checkout: find or create user record
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(buyerEmail) as any;
    if (existing) {
      userId = existing.id;
    } else {
      userId = uuidv4();
      const bcrypt = require("bcryptjs");
      const tempPw = bcrypt.hashSync(uuidv4(), 10);
      db.prepare(
        `INSERT INTO users (id, email, password, name, organization, phone, role)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run(userId, buyerEmail, tempPw, buyerName || "비회원", organization || "", buyerPhone || "", "user");
    }
  }

  if (!userId) {
    return NextResponse.json({ error: "사용자 정보를 처리할 수 없습니다." }, { status: 400 });
  }

  // Create enrollment with paid status
  const enrollmentId = uuidv4();
  try {
    db.prepare(
      `INSERT INTO enrollments (id, user_id, course_id, payment_status, enrollment_status)
       VALUES (?, ?, ?, 'paid', 'confirmed')`
    ).run(enrollmentId, userId, courseId);
  } catch (e: any) {
    // If duplicate (already enrolled), update to paid
    if (e.message?.includes("UNIQUE")) {
      db.prepare(
        `UPDATE enrollments SET payment_status='paid', enrollment_status='confirmed'
         WHERE user_id = ? AND course_id = ?`
      ).run(userId, courseId);
    } else {
      throw e;
    }
  }

  return NextResponse.json({ success: true, enrollmentId });
}
