export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import db from "@/lib/db";
import { writeFileSync, unlinkSync, existsSync, mkdirSync } from "fs";
import path from "path";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { id } = await params;
  const formData = await req.formData();
  const file = formData.get("poster") as File;

  if (!file) {
    return NextResponse.json({ error: "파일을 선택해주세요." }, { status: 400 });
  }

  const dir = path.join(process.cwd(), "public", "uploads", "posters");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const ext = file.name.split(".").pop();
  const filename = `${id}.${ext}`;
  const filePath = path.join(dir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  writeFileSync(filePath, buffer);

  const posterUrl = `/api/uploads/posters/${filename}`;
  db.prepare("UPDATE courses SET poster_url = ? WHERE id = ?").run(posterUrl, id);

  return NextResponse.json({ success: true, poster_url: posterUrl });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { id } = await params;
  const course = db.prepare("SELECT poster_url FROM courses WHERE id = ?").get(id) as any;

  if (course?.poster_url) {
    const filePath = path.join(process.cwd(), "public", course.poster_url);
    if (existsSync(filePath)) unlinkSync(filePath);
  }

  db.prepare("UPDATE courses SET poster_url = '' WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
