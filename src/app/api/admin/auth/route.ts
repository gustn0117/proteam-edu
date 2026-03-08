export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getAdminUser } from "@/lib/auth";

const ADMIN_PASSWORD = "1234";

export async function GET() {
  const user = await getAdminUser();
  return NextResponse.json({ authenticated: !!user });
}

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const admin = db
    .prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
    .get() as { id: string } | undefined;

  if (!admin) {
    return NextResponse.json({ error: "관리자 계정이 없습니다." }, { status: 500 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session_id", admin.id, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session_id", "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
