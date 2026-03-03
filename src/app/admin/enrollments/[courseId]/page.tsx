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
  course_name: string;
  created_at: string;
}

export default function AdminCourseEnrollmentsPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courseName, setCourseName] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = () => {
    fetch(`/api/admin/enrollments?course_id=${courseId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.enrollments) {
          setEnrollments(d.enrollments);
          if (d.enrollments.length > 0) setCourseName(d.enrollments[0].course_name);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetch(`/api/courses/${courseId}`)
      .then((r) => r.json())
      .then((d) => { if (d?.course?.name) setCourseName(d.course.name); })
      .catch(() => {});
    load();
  }, [courseId]);

  const updateEnrollment = async (id: string, data: Record<string, string>) => {
    await fetch(`/api/admin/enrollments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    load();
  };

  const deleteEnrollment = async (id: string) => {
    if (!confirm("이 신청을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;
    await fetch(`/api/admin/enrollments/${id}`, { method: "DELETE" });
    load();
  };

  const handleCertUpload = async (enrollmentId: string, file: File) => {
    const fd = new FormData();
    fd.append("enrollment_id", enrollmentId);
    fd.append("certificate", file);
    await fetch("/api/admin/certificates", { method: "POST", body: fd });
    load();
  };

  const handleCertDelete = async (enrollmentId: string) => {
    await fetch("/api/admin/certificates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enrollment_id: enrollmentId }),
    });
    load();
  };

  const filtered = enrollments.filter((e) => {
    const matchSearch =
      !search ||
      e.user_name.includes(search) ||
      e.user_email.includes(search) ||
      (e.organization || "").includes(search);
    const matchStatus =
      statusFilter === "all" || e.enrollment_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: enrollments.length,
    paid: enrollments.filter((e) => e.payment_status === "paid").length,
    confirmed: enrollments.filter((e) => e.enrollment_status === "confirmed").length,
    cancelled: enrollments.filter((e) => e.enrollment_status === "cancelled").length,
    refund: enrollments.filter((e) => e.enrollment_status === "refund_requested").length,
  };

  const exportCSV = () => {
    const headers = ["이름", "소속", "이메일", "휴대전화", "비용납부", "신청상태", "신청일"];
    const rows = filtered.map((e) => [
      e.user_name,
      e.organization || "",
      e.user_email,
      e.user_phone || "",
      e.payment_status === "paid" ? "납부완료" : "미납",
      e.enrollment_status === "confirmed" ? "완료" : e.enrollment_status === "pending" ? "대기중" : e.enrollment_status === "cancelled" ? "취소됨" : "환불신청",
      formatDateTime(e.created_at),
    ]);
    const bom = "\uFEFF";
    const csv = bom + [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${courseName || "enrollments"}_신청현황.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDateTime = (d: string) => {
    if (!d) return "-";
    const date = d.split("T")[0] || d.split(" ")[0];
    return date?.replace(/-/g, ".");
  };

  const selectCls = "px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer";

  return (
    <div>
      <button onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors group mb-6">
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        목록으로
      </button>

      <h2 className="text-lg font-bold text-gray-900 mb-6">
        {courseName || "교육과정"} <span className="text-gray-400 font-normal">—</span> 신청자 현황
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">총 신청자</p>
          <p className="text-2xl font-bold text-primary">{stats.total}<span className="text-sm font-normal text-gray-400">명</span></p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">결제완료</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.paid}<span className="text-sm font-normal text-gray-400">명</span></p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">확인완료</p>
          <p className="text-2xl font-bold text-blue-600">{stats.confirmed}<span className="text-sm font-normal text-gray-400">명</span></p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">취소</p>
          <p className="text-2xl font-bold text-gray-400">{stats.cancelled}<span className="text-sm font-normal text-gray-400">명</span></p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">환불신청</p>
          <p className="text-2xl font-bold text-orange-500">{stats.refund}<span className="text-sm font-normal text-gray-400">명</span></p>
        </div>
      </div>

      {/* Search & Filter & Export */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="relative flex-1 w-full">
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름, 이메일, 소속 검색"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50/50 cursor-pointer"
        >
          <option value="all">전체 상태</option>
          <option value="pending">대기중</option>
          <option value="confirmed">완료</option>
          <option value="cancelled">취소됨</option>
          <option value="refund_requested">환불신청</option>
        </select>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          CSV 다운로드
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center text-gray-400 border border-gray-100 shadow-sm">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          {search || statusFilter !== "all" ? "검색 결과가 없습니다." : "신청자가 없습니다."}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100">
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">이름</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">소속</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">이메일</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">휴대전화</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">비용 납부</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">신청 상태</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">수료증</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">신청일</th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">삭제</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4 font-semibold text-gray-900 whitespace-nowrap">{e.user_name}</td>
                    <td className="px-4 py-4 text-gray-500">{e.organization || "-"}</td>
                    <td className="px-4 py-4 text-gray-500">{e.user_email}</td>
                    <td className="px-4 py-4 text-gray-500 whitespace-nowrap">{e.user_phone || "-"}</td>
                    <td className="px-4 py-4 text-center">
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
                    <td className="px-4 py-4 text-center">
                      <select
                        value={e.enrollment_status}
                        onChange={(ev) => updateEnrollment(e.id, { enrollment_status: ev.target.value })}
                        className={`${selectCls} ${
                          e.enrollment_status === "confirmed" ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
                          e.enrollment_status === "cancelled" ? "text-gray-500 bg-gray-50 border-gray-200" :
                          e.enrollment_status === "refund_requested" ? "text-orange-600 bg-orange-50 border-orange-200" :
                          "text-amber-700 bg-amber-50 border-amber-200"
                        }`}
                      >
                        <option value="pending">대기중</option>
                        <option value="confirmed">완료</option>
                        <option value="cancelled">취소됨</option>
                        <option value="refund_requested">환불신청</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-center">
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
                    <td className="px-4 py-4 text-gray-400 text-xs whitespace-nowrap">{formatDateTime(e.created_at)}</td>
                    <td className="px-4 py-4 text-center">
                      <button onClick={() => deleteEnrollment(e.id)}
                        className="text-red-400 hover:text-red-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
