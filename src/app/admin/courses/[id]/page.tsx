"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Enrollment {
  id: string;
  user_name: string;
  organization: string;
  user_email: string;
  user_phone: string;
  payment_status: string;
  enrollment_status: string;
  certificate_url: string;
}

export default function AdminCourseEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [activeTab, setActiveTab] = useState<"info" | "enrollments">("info");

  useEffect(() => {
    fetch(`/api/courses/${id}`).then((r) => r.json()).then((d) => { if (d?.course) setForm(d.course); }).catch(() => {});
    loadEnrollments();
  }, [id]);

  const loadEnrollments = () => {
    fetch(`/api/admin/enrollments?course_id=${id}`)
      .then((r) => r.json())
      .then((d) => { if (d?.enrollments) setEnrollments(d.enrollments); })
      .catch(() => {});
  };

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

  const updateEnrollment = async (eid: string, data: Record<string, string>) => {
    await fetch(`/api/admin/enrollments/${eid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    loadEnrollments();
  };

  const handleCertUpload = async (enrollmentId: string, file: File) => {
    const fd = new FormData();
    fd.append("enrollment_id", enrollmentId);
    fd.append("certificate", file);
    await fetch("/api/admin/certificates", { method: "POST", body: fd });
    loadEnrollments();
  };

  const handleCertDelete = async (enrollmentId: string) => {
    await fetch("/api/admin/certificates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enrollment_id: enrollmentId }),
    });
    loadEnrollments();
  };

  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50/50";
  const selectCls = "px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer";

  if (!form) return (
    <div className="text-center py-16">
      <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
    </div>
  );

  const activeCount = enrollments.filter(e => e.enrollment_status !== "cancelled").length;
  const paidCount = enrollments.filter(e => e.payment_status === "paid").length;
  const confirmedCount = enrollments.filter(e => e.enrollment_status === "confirmed").length;

  return (
    <div>
      <button onClick={() => router.push("/admin/courses")}
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors group mb-6">
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        과정 목록으로
      </button>

      {/* Course name header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{form.name}</h2>
          <p className="text-sm text-gray-400 mt-1">{form.start_date?.replace(/-/g, ".")} ~ {form.end_date?.replace(/-/g, ".")}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          form.status === "accepting" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20" : "bg-gray-50 text-gray-500 ring-1 ring-gray-500/10"
        }`}>
          {form.status === "accepting" ? "접수중" : "마감"}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">총 신청자</p>
          <p className="text-2xl font-bold text-primary">{activeCount}<span className="text-sm text-gray-400 font-normal">/{form.capacity}명</span></p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">납부 완료</p>
          <p className="text-2xl font-bold text-emerald-600">{paidCount}<span className="text-sm text-gray-400 font-normal">명</span></p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">확정</p>
          <p className="text-2xl font-bold text-gold">{confirmedCount}<span className="text-sm text-gray-400 font-normal">명</span></p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">모집률</p>
          <p className="text-2xl font-bold text-primary">{form.capacity > 0 ? Math.round(activeCount / form.capacity * 100) : 0}<span className="text-sm text-gray-400 font-normal">%</span></p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100/80 p-1 rounded-xl mb-6">
        <button
          onClick={() => setActiveTab("info")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === "info" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
          과정 정보
        </button>
        <button
          onClick={() => setActiveTab("enrollments")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === "enrollments" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
          신청자 관리 ({enrollments.length})
        </button>
      </div>

      {activeTab === "info" ? (
        <>
          {/* Course info form */}
          <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-fade-in-up">
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">과정 설명</label>
              <p className="text-xs text-gray-400 mb-1.5">교육 목표, 대상, 커리큘럼 등 상세 내용을 입력하세요. 줄바꿈이 그대로 반영됩니다.</p>
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
                rows={10}
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

          {/* Poster section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in-up">
            <h3 className="text-base font-bold text-gray-900 mb-4">교육 안내 포스터</h3>
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
        </>
      ) : (
        /* Enrollments tab */
        <div className="animate-fade-in-up">
          {enrollments.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center text-gray-400 border border-gray-100 shadow-sm">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              신청자가 없습니다.
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-gray-100">
                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">이름</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">소속</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">이메일</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">연락처</th>
                      <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">납부</th>
                      <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">상태</th>
                      <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">수료증</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {enrollments.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 font-semibold text-gray-900">{e.user_name}</td>
                        <td className="px-5 py-4 text-gray-500">{e.organization || "-"}</td>
                        <td className="px-5 py-4 text-gray-500">{e.user_email}</td>
                        <td className="px-5 py-4 text-gray-500">{e.user_phone || "-"}</td>
                        <td className="px-5 py-4 text-center">
                          <select
                            value={e.payment_status}
                            onChange={(ev) => updateEnrollment(e.id, { payment_status: ev.target.value })}
                            className={`${selectCls} ${
                              e.payment_status === "paid"
                                ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                                : "text-red-600 bg-red-50 border-red-200"
                            }`}
                          >
                            <option value="unpaid">미납</option>
                            <option value="paid">납부완료</option>
                          </select>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <select
                            value={e.enrollment_status}
                            onChange={(ev) => updateEnrollment(e.id, { enrollment_status: ev.target.value })}
                            className={`${selectCls} ${
                              e.enrollment_status === "confirmed" ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
                              e.enrollment_status === "completed" ? "text-gold bg-amber-50 border-amber-200" :
                              e.enrollment_status === "cancelled" ? "text-gray-500 bg-gray-50 border-gray-200" :
                              e.enrollment_status === "refund_requested" ? "text-orange-600 bg-orange-50 border-orange-200" :
                              "text-amber-700 bg-amber-50 border-amber-200"
                            }`}
                          >
                            <option value="pending">대기중</option>
                            <option value="confirmed">확인완료</option>
                            <option value="completed">수료</option>
                            <option value="cancelled">취소됨</option>
                            <option value="refund_requested">환불신청</option>
                          </select>
                        </td>
                        <td className="px-5 py-4 text-center">
                          {e.certificate_url ? (
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-emerald-600 text-xs font-medium">등록됨</span>
                              <button onClick={() => handleCertDelete(e.id)}
                                className="text-red-400 hover:text-red-600 text-xs font-semibold transition-colors">삭제</button>
                            </div>
                          ) : (
                            <label className="cursor-pointer text-primary hover:text-accent text-xs font-semibold transition-colors">
                              업로드
                              <input type="file" accept=".pdf" className="hidden"
                                onChange={(ev) => {
                                  const f = ev.target.files?.[0];
                                  if (f) handleCertUpload(e.id, f);
                                }} />
                            </label>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
