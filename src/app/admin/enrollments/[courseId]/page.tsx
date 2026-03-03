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
        setEnrollments(d.enrollments);
        if (d.enrollments.length > 0) setCourseName(d.enrollments[0].course_name);
      });
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

  const paymentLabel = (s: string) => {
    switch (s) {
      case "paid": return "납부완료";
      case "unpaid": return "미납";
      default: return s;
    }
  };

  const statusLabel = (s: string) => {
    switch (s) {
      case "pending": return "대기중";
      case "confirmed": return "완료";
      case "cancelled": return "취소됨";
      case "refund_requested": return "환불신청";
      default: return s;
    }
  };

  return (
    <div>
      <button onClick={() => router.back()} className="text-blue-600 hover:underline text-sm mb-4 inline-block">
        &larr; 목록으로
      </button>
      <h2 className="text-lg font-bold text-gray-800 mb-6">
        {courseName || "교육과정"} — 신청자 현황 ({enrollments.length}명)
      </h2>

      {enrollments.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-500 border">신청자가 없습니다.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">이름</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">소속</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">이메일</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">휴대전화</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">비용 납부</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">신청 상태</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">수료증</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {enrollments.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{e.user_name}</td>
                    <td className="px-4 py-3 text-gray-600">{e.organization || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{e.user_email}</td>
                    <td className="px-4 py-3 text-gray-600">{e.user_phone || "-"}</td>
                    <td className="px-4 py-3 text-center">
                      <select
                        value={e.payment_status}
                        onChange={(ev) => updateEnrollment(e.id, { payment_status: ev.target.value })}
                        className={`px-2 py-1 rounded border text-xs font-medium ${
                          e.payment_status === "paid" ? "text-green-700 bg-green-50" : "text-red-600 bg-red-50"
                        }`}
                      >
                        <option value="unpaid">미납</option>
                        <option value="paid">납부완료</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <select
                        value={e.enrollment_status}
                        onChange={(ev) => updateEnrollment(e.id, { enrollment_status: ev.target.value })}
                        className="px-2 py-1 rounded border text-xs font-medium"
                      >
                        <option value="pending">대기중</option>
                        <option value="confirmed">완료</option>
                        <option value="cancelled">취소됨</option>
                        <option value="refund_requested">환불신청</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {e.certificate_url ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-green-600 text-xs">등록됨</span>
                          <button onClick={() => handleCertDelete(e.id)}
                            className="text-red-500 hover:underline text-xs">삭제</button>
                        </div>
                      ) : (
                        <label className="cursor-pointer text-blue-600 hover:underline text-xs">
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
