export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  const { name, phone } = await req.json();

  if (!name || !phone) {
    return NextResponse.json({ error: "이름과 휴대폰 번호를 입력해주세요." }, { status: 400 });
  }

  const user = db.prepare(
    "SELECT email FROM users WHERE name = ? AND phone = ? AND role != 'admin'"
  ).get(name, phone) as { email: string } | undefined;

  if (!user) {
    return NextResponse.json({ error: "일치하는 회원 정보를 찾을 수 없습니다." }, { status: 404 });
  }

  // Mask email: show first 3 chars + *** + @domain
  const [local, domain] = user.email.split("@");
  const masked = local.length <= 3
    ? local + "***@" + domain
    : local.slice(0, 3) + "***@" + domain;

  return NextResponse.json({ email: masked });
}
