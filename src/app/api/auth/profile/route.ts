export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role === "admin") {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { name, organization, department, phone, newsletter } = await req.json();

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "이름을 입력해주세요." }, { status: 400 });
  }

  db.prepare(
    `UPDATE users SET name = ?, organization = ?, department = ?, phone = ?, newsletter = ? WHERE id = ?`
  ).run(name.trim(), organization || "", department || "", phone || "", newsletter ? 1 : 0, user.id);

  return NextResponse.json({ success: true });
}
