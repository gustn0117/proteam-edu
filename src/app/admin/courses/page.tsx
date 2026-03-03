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
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = () => fetch("/api/courses").then((r) => r.json()).then((d) => { if (d?.courses) setCourses(d.courses); }).catch(() => {});

  useEffect(() => { load(); }, []);

  const set = (key: string, val: string | number) => setForm((p) => ({ ...p, [key]: val }));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (posterFile && data?.id) {
      const fd = new FormData();
      fd.append("poster", posterFile);
      await fetch(`/api/courses/${data.id}/poster`, { method: "POST", body: fd });
    }
    setSaving(false);
    setShowForm(false);
    setPosterFile(null);
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

  const filtered = courses.filter((c) => {
    const matchSearch = !search || c.name.includes(search);
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">
          교육과정 목록 <span className="text-sm font-medium text-gray-400">({courses.length}개)</span>
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-light transition-colors"
        >
          {showForm ? "취소" : "+ 신규 과정 추가"}
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="과정명 검색"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50/50 cursor-pointer"
        >
          <option value="all">전체 상태</option>
          <option value="accepting">접수중</option>
          <option value="closed">마감</option>
        </select>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">카테고리</label>
            <div className="flex rounded-xl border border-gray-200 overflow-hidden">
              <button type="button" onClick={() => set("category", "offline")}
                className={`flex-1 py-2.5 text-sm font-medium transition-all ${form.category === "offline" ? "bg-primary text-white" : "bg-slate-50/50 text-gray-500 hover:bg-gray-100"}`}>
                <span className="flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
                  오프라인
                </span>
              </button>
              <button type="button" onClick={() => set("category", "online")}
                className={`flex-1 py-2.5 text-sm font-medium transition-all border-l border-gray-200 ${form.category === "online" ? "bg-primary text-white" : "bg-slate-50/50 text-gray-500 hover:bg-gray-100"}`}>
                <span className="flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></svg>
                  온라인
                </span>
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">접수상태</label>
            <div className="flex rounded-xl border border-gray-200 overflow-hidden">
              <button type="button" onClick={() => set("status", "accepting")}
                className={`flex-1 py-2.5 text-sm font-medium transition-all ${form.status === "accepting" ? "bg-emerald-600 text-white" : "bg-slate-50/50 text-gray-500 hover:bg-gray-100"}`}>
                접수중
              </button>
              <button type="button" onClick={() => set("status", "closed")}
                className={`flex-1 py-2.5 text-sm font-medium transition-all border-l border-gray-200 ${form.status === "closed" ? "bg-gray-600 text-white" : "bg-slate-50/50 text-gray-500 hover:bg-gray-100"}`}>
                접수마감
              </button>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">교육 안내 포스터</label>
            <label className="block cursor-pointer">
              <div className={`flex items-center gap-3 px-4 py-3 border border-dashed rounded-xl transition-colors ${posterFile ? "border-primary/40 bg-primary/5" : "border-gray-300 hover:border-primary/40"}`}>
                <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span className="text-sm text-gray-500">
                  {posterFile ? posterFile.name : "파일 선택 (PDF, JPG, PNG) — 과정 생성 후 자동 업로드됩니다"}
                </span>
                {posterFile && (
                  <span className="ml-auto text-xs text-primary font-medium">선택됨</span>
                )}
              </div>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
                className="hidden" />
            </label>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">과정 설명</label>
            <p className="text-xs text-gray-400 mb-1.5">교육 목표, 대상, 커리큘럼 등 상세 내용을 입력하세요. 줄바꿈이 그대로 반영됩니다.</p>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={8}
              placeholder={"[교육 목표]\n실무에서 바로 활용 가능한 핵심 역량 강화\n\n[교육 대상]\n실무 담당자 및 관리자\n\n[교육 내용]\n1. 핵심 이론 및 사례 분석\n2. 실습 및 워크숍\n3. Q&A 및 네트워킹"}
              className={inputCls} />
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
              {filtered.map((c) => (
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
