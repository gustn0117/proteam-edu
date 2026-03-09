"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
        if (!d?.user) { router.push("/login"); return; }
        setUser(d.user);
        return fetch("/api/enrollments").then((r) => r.json());
      })
      .then((d) => { if (d?.enrollments) setEnrollments(d.enrollments); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const handleCancel = async (id: string) => {
    if (!confirm("정말 취소하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/enrollments/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) { alert(data.error || "오류가 발생했습니다."); return; }
      alert(data.message);
      setEnrollments((prev) => prev.map((e) => e.id === id
        ? { ...e, enrollment_status: data.message.includes("환불") ? "refund_requested" : "cancelled" }
        : e
      ));
    } catch {
      alert("요청 중 오류가 발생했습니다.");
    }
  };

  const paymentLabel = (s: string) => {
    switch (s) {
      case "paid": return "납부완료";
      case "unpaid": return "미납";
      default: return s;
    }
  };

  const paymentColor = (s: string) => {
    switch (s) {
      case "paid": return "text-emerald-600 font-semibold";
      case "unpaid": return "text-red-500 font-semibold";
      default: return "text-gray-500";
    }
  };

  const statusLabel = (s: string) => {
    switch (s) {
      case "pending": return "대기중";
      case "confirmed": return "확인완료";
      case "completed": return "수료";
      case "cancelled": return "취소됨";
      case "refund_requested": return "환불신청";
      default: return s;
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "pending": return "text-amber-600 font-semibold";
      case "confirmed": return "text-emerald-600 font-semibold";
      case "completed": return "text-primary font-semibold";
      case "cancelled": return "text-gray-400 font-semibold";
      case "refund_requested": return "text-orange-500 font-semibold";
      default: return "text-gray-500";
    }
  };

  const canCancel = (e: Enrollment) =>
    e.enrollment_status !== "cancelled" &&
    e.enrollment_status !== "refund_requested" &&
    e.enrollment_status !== "completed";

  const formatDate = (d: string) => d?.replace(/-/g, ".");

  const formatDateRange = (start: string, end: string) => {
    if (start === end) return formatDate(start) + ".";
    return formatDate(start) + "~" + formatDate(end) + ".";
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div>
      {/* Page Title */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">교육신청 확인 / 취소</h1>
            <nav className="hidden sm:flex items-center gap-1.5 text-sm text-gray-400">
              <Link href="/" className="hover:text-primary transition-colors">홈</Link>
              <span>&gt;</span>
              <span className="text-gray-500">교육/시험신청</span>
              <span>&gt;</span>
              <span className="text-gray-900 font-medium">교육신청확인</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        {/* Section title */}
        <h2 className="text-base font-bold text-primary mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          나의 교육신청 내역
        </h2>

        {enrollments.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-16 text-center">
            <p className="text-gray-400 mb-4">신청한 교육과정이 없습니다.</p>
            <Link href="/courses" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded text-sm font-medium hover:bg-primary-light transition-colors">
              교육과정 둘러보기
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-3">
              {enrollments.map((e) => (
                <div key={e.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Link href={`/courses/${e.course_id}`} className="font-semibold text-gray-900 hover:text-primary transition-colors text-sm">
                        {e.course_name}
                      </Link>
                    </div>
                    <div className="text-xs text-gray-400 mb-3">
                      {formatDateRange(e.start_date, e.end_date)}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                      <div>
                        <span className="text-gray-400 block mb-0.5">수강료</span>
                        <span className="text-gray-700 font-medium">{e.fee > 0 ? `${e.fee.toLocaleString()}원` : "무료"}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block mb-0.5">납부</span>
                        <span className={paymentColor(e.payment_status)}>{paymentLabel(e.payment_status)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block mb-0.5">상태</span>
                        <span className={statusColor(e.enrollment_status)}>{statusLabel(e.enrollment_status)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        {e.enrollment_status === "completed" ? (
                          <Link href={`/certificate/${e.id}`} className="text-primary text-xs font-semibold hover:underline">
                            수료증 보기
                          </Link>
                        ) : (
                          <span className="text-gray-300 text-xs">수료증 미발급</span>
                        )}
                      </div>
                      {canCancel(e) && (
                        <button onClick={() => handleCancel(e.id)} className="bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-gray-700 transition-colors">
                          {e.payment_status === "paid" ? "환불신청" : "취소"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th className="px-4 py-3.5 text-center font-semibold">교육과정</th>
                      <th className="px-4 py-3.5 text-center font-semibold whitespace-nowrap">교육기간</th>
                      <th className="px-4 py-3.5 text-center font-semibold whitespace-nowrap">수강료</th>
                      <th className="px-4 py-3.5 text-center font-semibold whitespace-nowrap">납부상태</th>
                      <th className="px-4 py-3.5 text-center font-semibold whitespace-nowrap">신청상태</th>
                      <th className="px-4 py-3.5 text-center font-semibold whitespace-nowrap">신청일</th>
                      <th className="px-4 py-3.5 text-center font-semibold whitespace-nowrap">수료증</th>
                      <th className="px-4 py-3.5 text-center font-semibold whitespace-nowrap">취소/환불</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {enrollments.map((e) => (
                      <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3.5 text-center">
                          <Link href={`/courses/${e.course_id}`} className="text-gray-900 hover:text-primary hover:underline transition-colors">
                            {e.course_name}
                          </Link>
                        </td>
                        <td className="px-4 py-3.5 text-center text-gray-600 whitespace-nowrap">
                          {formatDateRange(e.start_date, e.end_date)}
                        </td>
                        <td className="px-4 py-3.5 text-center text-gray-700 whitespace-nowrap">
                          {e.fee > 0 ? `${e.fee.toLocaleString()}원` : <span className="text-gray-400">무료</span>}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={paymentColor(e.payment_status)}>{paymentLabel(e.payment_status)}</span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={statusColor(e.enrollment_status)}>{statusLabel(e.enrollment_status)}</span>
                        </td>
                        <td className="px-4 py-3.5 text-center text-gray-500 whitespace-nowrap">
                          {formatDate((e.created_at?.split("T")[0] || e.created_at?.split(" ")[0]) ?? "")}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {e.enrollment_status === "completed" ? (
                            <Link href={`/certificate/${e.id}`} className="text-primary font-semibold hover:underline text-xs">
                              보기
                            </Link>
                          ) : (
                            <span className="text-gray-300 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {canCancel(e) ? (
                            <button onClick={() => handleCancel(e.id)} className="bg-gray-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-700 transition-colors">
                              {e.payment_status === "paid" ? "환불신청" : "취소"}
                            </button>
                          ) : (
                            <span className="text-gray-300 text-xs">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Result count */}
            <p className="mt-3 text-xs text-gray-400">
              총 {enrollments.length}건
            </p>
          </>
        )}
      </div>
    </div>
  );
}
