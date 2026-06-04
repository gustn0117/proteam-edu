export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { getAdminUser } from "@/lib/auth";

// 관리자 비밀번호: DB의 admin 계정 password 컬럼을 정답으로 사용
// 초기값은 db.ts seed 단계에서 'admin1234'로 설정됨.
// 추가: 호환을 위해 1234도 초기 비밀번호로 허용 (한 번 로그인 후 비밀번호 변경 권장)
const LEGACY_FALLBACK = "1234";

export async function GET() {
  const user = await getAdminUser();
  return NextResponse.json({ authenticated: !!user });
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  const admin = db
    .prepare("SELECT id, password FROM users WHERE role = 'admin' LIMIT 1")
    .get() as { id: string; password: string } | undefined;

  if (!admin) {
    return NextResponse.json({ error: "관리자 계정이 없습니다." }, { status: 500 });
  }

  let ok = false;
  // bcrypt 비교
  try {
    ok = bcrypt.compareSync(password, admin.password);
  } catch {
    ok = false;
  }
  // 레거시 호환: 평문 1234도 허용
  if (!ok && password === LEGACY_FALLBACK) ok = true;

  if (!ok) {
    return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session_id", admin.id, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  response.cookies.set("session_id", "", { httpOnly: true, path: "/", maxAge: 0 });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session_id", "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
