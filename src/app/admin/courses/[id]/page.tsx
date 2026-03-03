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

  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50/50";

  if (!form) return (
    <div className="text-center py-16">
      <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
    </div>
  );

  return (
    <div>
      <button onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors group mb-6">
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        목록으로
      </button>

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-fade-in-up">
        <h2 className="md:col-span-2 text-lg font-bold text-gray-900">과정 정보 수정</h2>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">교육 과정명</label>
          <input type="text" required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">시작일</label>
          <input type="date" required value={form.start_date} onChange={(e) => set("start_date", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">종료일</label>
          <input type="date" required value={form.end_date} onChange={(e) => set("end_date", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">교육시간</label>
          <input type="text" required value={form.duration} onChange={(e) => set("duration", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">모집정원</label>
          <input type="number" required value={form.capacity} onChange={(e) => set("capacity", +e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">교육장소</label>
          <input type="text" required value={form.location} onChange={(e) => set("location", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">교육비용 (원)</label>
          <input type="number" value={form.fee} onChange={(e) => set("fee", +e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">접수상태</label>
          <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
            <option value="accepting">접수중</option>
            <option value="closed">접수마감</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">과정 설명</label>
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
            rows={3} className={inputCls} />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" disabled={saving}
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50">
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in-up">
        <h2 className="text-lg font-bold text-gray-900 mb-4">교육 안내 포스터</h2>

        {form.poster_url && (
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              포스터 등록됨
            </span>
            <button onClick={handlePosterDelete}
              className="text-red-400 hover:text-red-600 text-xs font-semibold transition-colors">삭제</button>
          </div>
        )}

        <div className="flex items-center gap-4">
          <label className="flex-1 cursor-pointer">
            <div className="flex items-center gap-3 px-4 py-3 border border-dashed border-gray-300 rounded-xl hover:border-primary/40 transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span className="text-sm text-gray-500">
                {posterFile ? posterFile.name : "파일 선택 (PDF, JPG, PNG)"}
              </span>
            </div>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
              className="hidden" />
          </label>
          <button onClick={handlePosterUpload} disabled={!posterFile || uploading}
            className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50">
            {uploading ? "업로드 중..." : "업로드"}
          </button>
        </div>
      </div>
    </div>
  );
}
