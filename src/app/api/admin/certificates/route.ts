export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getAdminUser } from "@/lib/auth";
import { writeFileSync, unlinkSync, existsSync, mkdirSync } from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const formData = await req.formData();
  const enrollmentId = formData.get("enrollment_id") as string;
  const file = formData.get("certificate") as File;

  if (!enrollmentId || !file) {
    return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
  }

  const dir = path.join(process.cwd(), "public", "uploads", "certificates");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const ext = file.name.split(".").pop();
  const filename = `${enrollmentId}.${ext}`;
  const filePath = path.join(dir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  writeFileSync(filePath, buffer);

  const certUrl = `/api/uploads/certificates/${filename}`;
  db.prepare("UPDATE enrollments SET certificate_url = ? WHERE id = ?").run(certUrl, enrollmentId);

  return NextResponse.json({ success: true, certificate_url: certUrl });
}

export async function DELETE(req: NextRequest) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { enrollment_id } = await req.json();

  const enrollment = db
    .prepare("SELECT certificate_url FROM enrollments WHERE id = ?")
    .get(enrollment_id) as any;

  if (enrollment?.certificate_url) {
    const filePath = path.join(process.cwd(), "public", enrollment.certificate_url);
    if (existsSync(filePath)) unlinkSync(filePath);
  }

  db.prepare("UPDATE enrollments SET certificate_url = '' WHERE id = ?").run(enrollment_id);
  return NextResponse.json({ success: true });
}
