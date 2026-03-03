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
      case "paid": return { text: "납부완료", cls: "text-emerald-600 bg-emerald-50 ring-1 ring-emerald-600/20" };
      case "unpaid": return { text: "미납", cls: "text-red-500 bg-red-50 ring-1 ring-red-500/10" };
      default: return { text: s, cls: "text-gray-500 bg-gray-50" };
    }
  };

  const statusLabel = (s: string) => {
    switch (s) {
      case "pending": return { text: "대기중", cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20" };
      case "confirmed": return { text: "완료", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20" };
      case "cancelled": return { text: "취소됨", cls: "bg-gray-50 text-gray-500 ring-1 ring-gray-500/10" };
      case "refund_requested": return { text: "환불신청", cls: "bg-orange-50 text-orange-600 ring-1 ring-orange-500/20" };
      default: return { text: s, cls: "bg-gray-50 text-gray-500" };
    }
  };

  const formatDate = (d: string) => d?.replace(/-/g, ".");

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div>
      <section className="bg-primary py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,168,78,0.1)_0%,transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-semibold text-gold uppercase tracking-widest mb-3">My Courses</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">교육신청 확인 / 취소</h1>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 pb-20">
        {enrollments.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center text-gray-400 border border-gray-100 shadow-sm">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
            신청한 교육과정이 없습니다.
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100">
                    <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">교육 과정명</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">교육기간</th>
                    <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">비용 납부</th>
                    <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">신청 상태</th>
                    <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">수료증</th>
                    <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">취소/환불</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {enrollments.map((e) => {
                    const pay = paymentLabel(e.payment_status);
                    const st = statusLabel(e.enrollment_status);
                    return (
                      <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 font-semibold text-gray-900">{e.course_name}</td>
                        <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                          {formatDate(e.start_date)} ~ {formatDate(e.end_date)}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${pay.cls}`}>{pay.text}</span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${st.cls}`}>
                            {st.text}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          {e.certificate_url ? (
                            <a
                              href={e.certificate_url}
                              download
                              className="inline-flex items-center gap-1 text-primary hover:text-accent text-xs font-semibold transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                              </svg>
                              다운로드
                            </a>
                          ) : (
                            <span className="text-gray-300 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-center">
                          {e.enrollment_status !== "cancelled" && e.enrollment_status !== "refund_requested" && (
                            <button
                              onClick={() => handleCancel(e.id)}
                              className="text-red-400 hover:text-red-600 text-xs font-semibold transition-colors"
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
    </div>
  );
}
