export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: "이름과 이메일을 입력해주세요." }, { status: 400 });
  }

  const user = db.prepare(
    "SELECT id FROM users WHERE name = ? AND email = ? AND role != 'admin'"
  ).get(name, email) as { id: string } | undefined;

  if (!user) {
    return NextResponse.json({ error: "일치하는 회원 정보를 찾을 수 없습니다." }, { status: 404 });
  }

  // Generate temporary password
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let tempPassword = "";
  for (let i = 0; i < 8; i++) {
    tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const hashed = bcrypt.hashSync(tempPassword, 10);
  db.prepare("UPDATE users SET password = ? WHERE id = ?").run(hashed, user.id);

  return NextResponse.json({ tempPassword });
}
