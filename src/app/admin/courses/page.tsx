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

  const load = () => fetch("/api/courses").then((r) => r.json()).then((d) => setCourses(d.courses));

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800">교육과정 목록</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#1a365d] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2a4a7f] transition"
        >
          {showForm ? "취소" : "+ 신규 과정 추가"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl p-6 shadow-sm border mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="예: 1일, 6시간"
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
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">교육 과정명</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">교육기간</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">정원</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">신청</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">상태</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">포스터</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDate(c.start_date)}~{formatDate(c.end_date)}</td>
                  <td className="px-4 py-3 text-center">{c.capacity}명</td>
                  <td className="px-4 py-3 text-center">{c.enrolled_count}명</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handleStatusToggle(c)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        c.status === "accepting" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                      {c.status === "accepting" ? "접수중" : "마감"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {c.poster_url ? (
                      <span className="text-green-600 text-xs">등록됨</span>
                    ) : (
                      <span className="text-gray-400 text-xs">없음</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <Link href={`/admin/courses/${c.id}`}
                        className="text-blue-600 hover:underline text-xs">수정</Link>
                      <button onClick={() => handleDelete(c.id)}
                        className="text-red-500 hover:underline text-xs">삭제</button>
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
