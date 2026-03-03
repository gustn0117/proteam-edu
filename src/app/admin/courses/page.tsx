"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Course {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  duration: string;
  capacity: number;
  location: string;
  status: string;
  category: string;
  fee: number;
  poster_url: string;
  enrolled_count: number;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "", start_date: "", end_date: "", duration: "",
    capacity: 30, location: "", status: "accepting",
    category: "offline", fee: 0, description: "",
  });
  const [saving, setSaving] = useState(false);

  const load = () => fetch("/api/courses").then((r) => r.json()).then((d) => { if (d?.courses) setCourses(d.courses); }).catch(() => {});

  useEffect(() => { load(); }, []);

  const set = (key: string, val: string | number) => setForm((p) => ({ ...p, [key]: val }));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setShowForm(false);
    setForm({ name: "", start_date: "", end_date: "", duration: "", capacity: 30, location: "", status: "accepting", category: "offline", fee: 0, description: "" });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(`/api/courses/${id}`, { method: "DELETE" });
    load();
  };

  const handleStatusToggle = async (c: Course) => {
    const newStatus = c.status === "accepting" ? "closed" : "accepting";
    await fetch(`/api/courses/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...c, status: newStatus }),
    });
    load();
  };

  const formatDate = (d: string) => d?.replace(/-/g, ".");
  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50/50";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">교육과정 목록</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-light transition-colors"
        >
          {showForm ? "취소" : "+ 신규 과정 추가"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-down">
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
            <input type="text" required value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder="예: 1일, 6시간" className={inputCls} />
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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">과정 설명</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className={inputCls} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={saving}
              className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50">
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100">
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">교육 과정명</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">교육기간</th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">정원</th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">신청</th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">포스터</th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-gray-900">{c.name}</td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{formatDate(c.start_date)} ~ {formatDate(c.end_date)}</td>
                  <td className="px-5 py-4 text-center text-gray-500">{c.capacity}명</td>
                  <td className="px-5 py-4 text-center text-gray-500">{c.enrolled_count}명</td>
                  <td className="px-5 py-4 text-center">
                    <button onClick={() => handleStatusToggle(c)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        c.status === "accepting" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 hover:bg-emerald-100" : "bg-gray-50 text-gray-500 ring-1 ring-gray-500/10 hover:bg-gray-100"
                      }`}>
                      {c.status === "accepting" ? "접수중" : "마감"}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-center">
                    {c.poster_url ? (
                      <span className="text-emerald-600 text-xs font-medium">등록됨</span>
                    ) : (
                      <span className="text-gray-300 text-xs">없음</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex gap-3 justify-center">
                      <Link href={`/admin/courses/${c.id}`}
                        className="text-primary hover:text-accent text-xs font-semibold transition-colors">수정</Link>
                      <button onClick={() => handleDelete(c.id)}
                        className="text-red-400 hover:text-red-600 text-xs font-semibold transition-colors">삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
