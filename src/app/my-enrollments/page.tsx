"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Enrollment {
  id: string;
  course_id: string;
  course_name: string;
  start_date: string;
  end_date: string;
  duration: string;
  location: string;
  fee: number;
  payment_status: string;
  enrollment_status: string;
  certificate_url: string;
  created_at: string;
}

export default function MyEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) { router.push("/login"); return; }
        setUser(d.user);
        return fetch("/api/enrollments").then((r) => r.json());
      })
      .then((d) => { if (d) setEnrollments(d.enrollments); })
      .finally(() => setLoading(false));
  }, [router]);

  const handleCancel = async (id: string) => {
    if (!confirm("정말 취소하시겠습니까?")) return;
    const res = await fetch(`/api/enrollments/${id}`, { method: "DELETE" });
    const data = await res.json();
    alert(data.message);
    setEnrollments((prev) => prev.map((e) => e.id === id
      ? { ...e, enrollment_status: data.message.includes("환불") ? "refund_requested" : "cancelled" }
      : e
    ));
  };

  const paymentLabel = (s: string) => {
    switch (s) {
      case "paid": return { text: "납부완료", cls: "text-green-600" };
      case "unpaid": return { text: "미납", cls: "text-red-500" };
      default: return { text: s, cls: "text-gray-500" };
    }
  };

  const statusLabel = (s: string) => {
    switch (s) {
      case "pending": return { text: "대기중", cls: "bg-yellow-100 text-yellow-700" };
      case "confirmed": return { text: "완료", cls: "bg-green-100 text-green-700" };
      case "cancelled": return { text: "취소됨", cls: "bg-gray-100 text-gray-500" };
      case "refund_requested": return { text: "환불신청", cls: "bg-orange-100 text-orange-600" };
      default: return { text: s, cls: "bg-gray-100 text-gray-500" };
    }
  };

  const formatDate = (d: string) => d?.replace(/-/g, ".");

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-16 text-center text-gray-500">로딩 중...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1a365d] mb-8">교육신청 확인 / 취소</h1>

      {enrollments.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-500 border">
          신청한 교육과정이 없습니다.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">교육 과정명</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">교육기간</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">비용 납부</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">교육신청 확인</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">수료증</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">취소/환불</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {enrollments.map((e) => {
                  const pay = paymentLabel(e.payment_status);
                  const st = statusLabel(e.enrollment_status);
                  return (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{e.course_name}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {formatDate(e.start_date)}~{formatDate(e.end_date)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`font-medium ${pay.cls}`}>{pay.text}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${st.cls}`}>
                          {st.text}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {e.certificate_url ? (
                          <a
                            href={e.certificate_url}
                            download
                            className="text-blue-600 hover:underline text-xs font-medium"
                          >
                            다운로드
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {e.enrollment_status !== "cancelled" && e.enrollment_status !== "refund_requested" && (
                          <button
                            onClick={() => handleCancel(e.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                          >
                            {e.payment_status === "paid" ? "환불신청" : "취소"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
