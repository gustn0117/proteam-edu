export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, name, organization, phone, newsletter } = body;

  if (!email || !password || !name) {
    return NextResponse.json({ error: "필수 정보를 입력해주세요." }, { status: 400 });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return NextResponse.json({ error: "이미 등록된 이메일입니다." }, { status: 409 });
  }

  const id = uuidv4();
  const hashed = bcrypt.hashSync(password, 10);

  db.prepare(
    `INSERT INTO users (id, email, password, name, organization, phone, newsletter)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, email, hashed, name, organization || "", phone || "", newsletter ? 1 : 0);

  const response = NextResponse.json({ success: true });
  response.cookies.set("session_id", id, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
