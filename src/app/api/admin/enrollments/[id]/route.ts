export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  const updates: string[] = [];
  const values: any[] = [];

  if (body.payment_status !== undefined) {
    updates.push("payment_status = ?");
    values.push(body.payment_status);
  }
  if (body.enrollment_status !== undefined) {
    updates.push("enrollment_status = ?");
    values.push(body.enrollment_status);
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: "변경할 내용이 없습니다." }, { status: 400 });
  }

  // Auto-confirm if payment is marked as paid
  if (body.payment_status === "paid" && body.enrollment_status === undefined) {
    updates.push("enrollment_status = ?");
    values.push("confirmed");
  }

  values.push(id);
  db.prepare(`UPDATE enrollments SET ${updates.join(", ")} WHERE id = ?`).run(...values);

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { id } = await params;
  db.prepare("DELETE FROM enrollments WHERE id = ?").run(id);

  return NextResponse.json({ success: true });
}
