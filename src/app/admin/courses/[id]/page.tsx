"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AdminCourseEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch(`/api/courses/${id}`).then((r) => r.json()).then((d) => setForm(d.course));
  }, [id]);

  const set = (key: string, val: string | number) => setForm((p: any) => ({ ...p, [key]: val }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/courses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    alert("저장되었습니다.");
  };

  const handlePosterUpload = async () => {
    if (!posterFile) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("poster", posterFile);
    const res = await fetch(`/api/courses/${id}/poster`, { method: "POST", body: fd });
    const data = await res.json();
    if (data.success) {
      setForm((p: any) => ({ ...p, poster_url: data.poster_url }));
      setPosterFile(null);
      alert("포스터가 업로드되었습니다.");
    }
    setUploading(false);
  };

  const handlePosterDelete = async () => {
    if (!confirm("포스터를 삭제하시겠습니까?")) return;
    await fetch(`/api/courses/${id}/poster`, { method: "DELETE" });
    setForm((p: any) => ({ ...p, poster_url: "" }));
  };

  if (!form) return <div className="text-center text-gray-500 py-16">로딩 중...</div>;

  return (
    <div>
      <button onClick={() => router.back()} className="text-blue-600 hover:underline text-sm mb-6 inline-block">
        &larr; 목록으로
      </button>

      <form onSubmit={handleSave} className="bg-white rounded-xl p-6 shadow-sm border grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <h2 className="md:col-span-2 text-lg font-bold text-gray-800">과정 정보 수정</h2>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">교육 과정명</label>
          <input type="text" required value={form.name} onChange={(e) => set("name", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
          <input type="date" required value={form.start_date} onChange={(e) => set("start_date", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">종료일</label>
          <input type="date" required value={form.end_date} onChange={(e) => set("end_date", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">교육시간</label>
          <input type="text" required value={form.duration} onChange={(e) => set("duration", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">모집정원</label>
          <input type="number" required value={form.capacity} onChange={(e) => set("capacity", +e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">교육장소</label>
          <input type="text" required value={form.location} onChange={(e) => set("location", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">교육비용 (원)</label>
          <input type="number" value={form.fee} onChange={(e) => set("fee", +e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">접수상태</label>
          <select value={form.status} onChange={(e) => set("status", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="accepting">접수중</option>
            <option value="closed">접수마감</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">과정 설명</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
            rows={3} className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50">
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>

      {/* Poster management */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-lg font-bold text-gray-800 mb-4">교육 안내 포스터</h2>

        {form.poster_url && (
          <div className="mb-4">
            <p className="text-sm text-green-600 mb-2">현재 포스터: {form.poster_url}</p>
            <button onClick={handlePosterDelete}
              className="text-red-500 hover:underline text-sm">포스터 삭제</button>
          </div>
        )}

        <div className="flex items-center gap-4">
          <input type="file" accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
            className="text-sm" />
          <button onClick={handlePosterUpload} disabled={!posterFile || uploading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50">
            {uploading ? "업로드 중..." : "업로드"}
          </button>
        </div>
      </div>
    </div>
  );
}
