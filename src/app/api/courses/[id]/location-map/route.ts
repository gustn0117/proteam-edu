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
  const file = formData.get("location_map") as File;

  if (!file) {
    return NextResponse.json({ error: "파일을 선택해주세요." }, { status: 400 });
  }

  // Delete old map file if exists
  const oldCourse = db.prepare("SELECT location_map_url FROM courses WHERE id = ?").get(id) as any;
  if (oldCourse?.location_map_url) {
    const oldPath = path.join(process.cwd(), "public", oldCourse.location_map_url.replace("/api/uploads/", "/uploads/"));
    if (existsSync(oldPath)) unlinkSync(oldPath);
  }

  const dir = path.join(process.cwd(), "public", "uploads", "location-maps");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const ext = file.name.split(".").pop();
  const filename = `${id}-${Date.now()}.${ext}`;
  const filePath = path.join(dir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  writeFileSync(filePath, buffer);

  const mapUrl = `/api/uploads/location-maps/${filename}`;
  db.prepare("UPDATE courses SET location_map_url = ? WHERE id = ?").run(mapUrl, id);

  return NextResponse.json({ success: true, location_map_url: mapUrl });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const { id } = await params;
  const course = db.prepare("SELECT location_map_url FROM courses WHERE id = ?").get(id) as any;

  if (course?.location_map_url) {
    const relativePath = course.location_map_url.replace("/api/uploads/", "/uploads/");
    const filePath = path.join(process.cwd(), "public", relativePath);
    if (existsSync(filePath)) unlinkSync(filePath);
  }

  db.prepare("UPDATE courses SET location_map_url = '' WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
