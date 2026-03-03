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
}

export default function AdminCourseEnrollmentsPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courseName, setCourseName] = useState("");

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

  useEffect(() => { load(); }, [courseId]);

  const updateEnrollment = async (id: string, data: Record<string, string>) => {
    await fetch(`/api/admin/enrollments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
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
        <span className="ml-2 text-sm font-medium text-gray-400">({enrollments.length}명)</span>
      </h2>

      {enrollments.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center text-gray-400 border border-gray-100 shadow-sm">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          신청자가 없습니다.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-100">
                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">이름</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">소속</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">이메일</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">휴대전화</th>
                  <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">비용 납부</th>
                  <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">신청 상태</th>
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
  );
}
