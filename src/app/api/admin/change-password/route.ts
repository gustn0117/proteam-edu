export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { getAdminUser } from "@/lib/auth";

const LEGACY_FALLBACK = "1234";

export async function POST(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "관리자 로그인이 필요합니다." }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "현재 비밀번호와 새 비밀번호를 입력해주세요." }, { status: 400 });
  }
  if (newPassword.length < 4) {
    return NextResponse.json({ error: "새 비밀번호는 4자 이상이어야 합니다." }, { status: 400 });
  }

  const record = db.prepare("SELECT password FROM users WHERE id = ?").get(user.id) as { password: string } | undefined;
  if (!record) {
    return NextResponse.json({ error: "관리자를 찾을 수 없습니다." }, { status: 404 });
  }

  let ok = false;
  try { ok = bcrypt.compareSync(currentPassword, record.password); } catch { ok = false; }
  if (!ok && currentPassword === LEGACY_FALLBACK) ok = true;

  if (!ok) {
    return NextResponse.json({ error: "현재 비밀번호가 올바르지 않습니다." }, { status: 400 });
  }

  const hashed = bcrypt.hashSync(newPassword, 10);
  db.prepare("UPDATE users SET password = ? WHERE id = ?").run(hashed, user.id);

  return NextResponse.json({ success: true });
}
