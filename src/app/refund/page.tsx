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
  fee: number;
  payment_status: string;
  enrollment_status: string;
  created_at: string;
}

export default function RefundPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d?.user) {
          setLoading(false);
          return;
        }
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

  const canCancel = (e: Enrollment) =>
    e.enrollment_status !== "cancelled" &&
    e.enrollment_status !== "refund_requested" &&
    e.enrollment_status !== "completed";

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
      case "cancelled": return "text-gray-400";
      case "refund_requested": return "text-orange-500";
      default: return "text-gray-700";
    }
  };

  const formatDate = (d: string) => d?.replace(/-/g, ".");

  return (
    <div>
      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">교육신청 취소 및 환불</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        {/* 나의 신청 내역 - 취소 */}
        {user && (
          <div className="mb-10">
            <h2 className="text-base font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              나의 교육신청 내역
            </h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
              </div>
            ) : enrollments.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
                <p className="text-gray-400">신청한 교육과정이 없습니다.</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-primary text-white">
                        <th className="px-4 py-3.5 text-center font-semibold">교육과정</th>
                        <th className="px-4 py-3.5 text-center font-semibold whitespace-nowrap">교육일</th>
                        <th className="px-4 py-3.5 text-center font-semibold whitespace-nowrap">수강료</th>
                        <th className="px-4 py-3.5 text-center font-semibold whitespace-nowrap">상태</th>
                        <th className="px-4 py-3.5 text-center font-semibold whitespace-nowrap">취소</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {enrollments.map((e) => (
                        <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3.5 text-center text-gray-900">{e.course_name}</td>
                          <td className="px-4 py-3.5 text-center text-gray-600 whitespace-nowrap">{formatDate(e.start_date)}</td>
                          <td className="px-4 py-3.5 text-center text-gray-700 whitespace-nowrap">
                            {e.fee > 0 ? `${e.fee.toLocaleString()}원` : "무료"}
                          </td>
                          <td className={`px-4 py-3.5 text-center font-semibold whitespace-nowrap ${statusColor(e.enrollment_status)}`}>
                            {statusLabel(e.enrollment_status)}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            {canCancel(e) ? (
                              <button
                                onClick={() => handleCancel(e.id)}
                                className="bg-red-500 text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-red-600 transition-colors"
                              >
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
            )}
          </div>
        )}

        {!user && !loading && (
          <div className="mb-10 bg-white border border-gray-200 rounded-lg p-10 text-center">
            <p className="text-gray-500 mb-4">교육신청 취소를 위해 로그인해 주세요.</p>
            <Link href="/login" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded text-sm font-medium hover:bg-primary-light transition-colors">
              로그인
            </Link>
          </div>
        )}

        {/* 환불 규정 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              환불 규정
            </h2>

            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">취소 시점</th>
                    <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">환불 비율</th>
                    <th className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">예시 (교육일: 4월 15일(수))</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3 text-center text-gray-700">교육시작 7일 전까지</td>
                    <td className="border border-gray-200 px-4 py-3 text-center font-bold text-emerald-600">100% 환불</td>
                    <td className="border border-gray-200 px-4 py-3 text-center text-gray-500 text-xs">~ 4월 7일(화) 24:00</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="border border-gray-200 px-4 py-3 text-center text-gray-700">교육시작 2~7일 전</td>
                    <td className="border border-gray-200 px-4 py-3 text-center font-bold text-amber-600">80% 환불</td>
                    <td className="border border-gray-200 px-4 py-3 text-center text-gray-500 text-xs">4월 8일(수) 00:00 ~ 4월 12일(일) 24:00</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3 text-center text-gray-700">교육시작 1~2일 전</td>
                    <td className="border border-gray-200 px-4 py-3 text-center font-bold text-orange-500">50% 환불</td>
                    <td className="border border-gray-200 px-4 py-3 text-center text-gray-500 text-xs">4월 13일(월) 00:00 ~ 4월 14일(화) 24:00</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="border border-gray-200 px-4 py-3 text-center text-gray-700">교육시작 후</td>
                    <td className="border border-gray-200 px-4 py-3 text-center font-bold text-red-500">환불 없음</td>
                    <td className="border border-gray-200 px-4 py-3 text-center text-gray-500 text-xs">4월 15일(수) 이후</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 환불절차 */}
            <h3 className="text-lg font-bold text-gray-900 mb-5">환불절차 및 소요기간</h3>

            <div className="space-y-6">
              {/* 은행계좌 납부 */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">①</span>
                  은행계좌로 교육비용 납부한 경우
                </h4>
                <div className="text-gray-600 text-sm leading-relaxed space-y-2">
                  <p>아래의 교육비 환불 신청서 작성 후, 이메일(<span className="font-medium text-gray-800">edu@proteamip.com</span>)로 발송해 주시기 바랍니다.</p>
                  <p className="text-gray-500">이메일 접수 후, 3일 내 은행계좌로 송금해 드립니다.</p>
                </div>
              </div>

              {/* 신용카드 납부 */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">②</span>
                  신용카드로 교육비용 납부한 경우
                </h4>
                <div className="text-gray-600 text-sm leading-relaxed space-y-3">
                  <p>
                    교육접수 취소를 하시면, 결제취소가 진행되며, 결제취소 완료 후 카드사 및 PG사에서 환불처리를 진행합니다.
                    각 회사마다 처리 소요일이 상이하므로 정확한 환불시점은 아래 &apos;일반적인 환불 소요기간&apos;을 참고해 주시기 바랍니다.
                  </p>
                  <ul className="space-y-1.5 pl-1">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold/60 mt-1.5 shrink-0" />
                      <span><span className="font-medium text-gray-700">당일 취소:</span> 당일 환불</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold/60 mt-1.5 shrink-0" />
                      <span><span className="font-medium text-gray-700">익일 이후 취소:</span> 취소 신청 완료 후 3~5일 소요</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold/60 mt-1.5 shrink-0" />
                      <span><span className="font-medium text-gray-700">카드대금 청구 후 취소:</span> 익월 청구 금액에서 공제</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 참고사항 */}
            <div className="mt-6 bg-amber-50 border border-amber-100 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                ※ 모든 소요기간은 업무일 기준입니다.<br />
                ※ 환불 관련 문의사항은 <span className="font-bold">02-6677-3868</span>로 문의 바랍니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
