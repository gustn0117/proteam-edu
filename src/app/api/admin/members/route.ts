export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const members = db
    .prepare(
      "SELECT id, name, organization, email, phone, newsletter, created_at FROM users WHERE role = 'user' ORDER BY created_at DESC"
    )
    .all();

  return NextResponse.json({ members });
}
