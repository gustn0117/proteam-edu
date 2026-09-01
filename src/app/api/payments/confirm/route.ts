export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { setSessionCookie } from "@/lib/session";

const SECRET_KEY = process.env.TOSS_SECRET_KEY || "test_sk_docs_OaPz8L5KdmQXkzRz3y47BMw6";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { paymentKey, orderId, amount, courseId, buyerName, buyerEmail, buyerPhone, organization, department, patentNo } = body;

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

  // Toss status: DONE = 결제완료, WAITING_FOR_DEPOSIT = 가상계좌 입금대기
  const isPaid = tossData.status === "DONE";
  const paymentStatus = isPaid ? "paid" : "unpaid";
  const enrollmentStatus = isPaid ? "confirmed" : "pending";

  // Create or find user
  const user = await getCurrentUser();
  let userId = user?.id;
  // 이번 결제로 계정이 새로 만들어졌는지 (자동 로그인 허용 여부를 가른다)
  let accountCreated = false;
  let matchedExistingAccount = false;

  if (!userId && buyerEmail) {
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(buyerEmail) as any;
    if (existing) {
      userId = existing.id;
      matchedExistingAccount = true;
    } else {
      userId = uuidv4();
      accountCreated = true;
      const bcrypt = require("bcryptjs");
      const tempPw = bcrypt.hashSync(uuidv4(), 10);
      db.prepare(
        `INSERT INTO users (id, email, password, name, organization, department, patent_no, phone, role)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(userId, buyerEmail, tempPw, buyerName || "비회원", organization || "", department || "", patentNo || "", buyerPhone || "", "user");
    }
  }

  if (!userId) {
    return NextResponse.json({ error: "사용자 정보를 처리할 수 없습니다." }, { status: 400 });
  }

  // Update existing user's organization/department/patent_no/phone with the buyer info from checkout
  if (userId && (organization || department || patentNo || buyerPhone)) {
    db.prepare(
      `UPDATE users SET
        organization = CASE WHEN ? != '' THEN ? ELSE organization END,
        department = CASE WHEN ? != '' THEN ? ELSE department END,
        patent_no = CASE WHEN ? != '' THEN ? ELSE patent_no END,
        phone = CASE WHEN ? != '' THEN ? ELSE phone END
       WHERE id = ?`
    ).run(
      organization || "", organization || "",
      department || "", department || "",
      patentNo || "", patentNo || "",
      buyerPhone || "", buyerPhone || "",
      userId
    );
  }

  // Create or update enrollment, store paymentKey + orderId for webhook tracking
  const enrollmentId = uuidv4();
  try {
    db.prepare(
      `INSERT INTO enrollments (id, user_id, course_id, payment_status, enrollment_status, payment_key, order_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(enrollmentId, userId, courseId, paymentStatus, enrollmentStatus, paymentKey, orderId);
  } catch (e: any) {
    if (e.message?.includes("UNIQUE")) {
      db.prepare(
        `UPDATE enrollments SET payment_status=?, enrollment_status=?, payment_key=?, order_id=?
         WHERE user_id = ? AND course_id = ?`
      ).run(paymentStatus, enrollmentStatus, paymentKey, orderId, userId, courseId);
    } else {
      throw e;
    }
  }

  const response = NextResponse.json({
    success: true,
    enrollmentId,
    method: tossData.method,
    status: tossData.status,
    virtualAccount: tossData.virtualAccount || null,
    // 비회원 결제 후 "교육신청 확인"이 로그인 화면으로 튕기지 않도록 화면에서 안내에 사용
    loggedIn: !!user || accountCreated,
    existingAccount: matchedExistingAccount,
    buyerEmail: buyerEmail || null,
  });

  // 비회원 결제로 계정이 새로 생성된 경우에만 자동 로그인시킨다.
  // 기존 계정에 이메일만 맞춘 경우까지 로그인시키면 남의 이메일을 입력해
  // 그 사람의 신청 내역을 열람할 수 있게 되므로 제외한다.
  if (accountCreated && !user) {
    setSessionCookie(response, userId);
  }

  return response;
}
