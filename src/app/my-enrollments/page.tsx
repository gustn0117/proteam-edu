"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1920&q=80"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary/85" />
          <div className="absolute inset-0 bg-linear-to-b from-primary/30 via-transparent to-primary/50" />
        </div>
        <div className="absolute inset-0 pattern-dots opacity-15" />
        <div className="relative pt-16 pb-24 md:pt-20 md:pb-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-sm font-semibold text-gold uppercase tracking-widest mb-3">My Courses</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">교육신청 확인 / 취소</h1>
            <p className="text-white/50 mt-3 text-sm">신청하신 교육과정의 현황을 확인하고 관리하세요</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/20 to-transparent" />
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-14 relative z-10 pb-20">
        {enrollments.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
            </div>
            <p className="text-gray-400 mb-4">신청한 교육과정이 없습니다.</p>
            <a href="/courses" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-light transition-all">
              교육과정 둘러보기
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        ) : (
          <>
            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-4 animate-fade-in-up">
              {enrollments.map((e) => {
                const pay = paymentLabel(e.payment_status);
                const st = statusLabel(e.enrollment_status);
                return (
                  <div key={e.id} className={`bg-white rounded-2xl border border-gray-100 overflow-hidden border-l-4 ${
                    e.enrollment_status === "confirmed" ? "border-l-emerald-400" :
                    e.enrollment_status === "cancelled" ? "border-l-gray-300" :
                    e.enrollment_status === "refund_requested" ? "border-l-orange-400" :
                    "border-l-amber-400"
                  }`}>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-900">{e.course_name}</h3>
                        {e.fee > 0 && <span className="text-sm font-bold text-primary">{e.fee.toLocaleString()}원</span>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                        <span>{formatDate(e.start_date)} ~ {formatDate(e.end_date)}</span>
                        <span>신청일: {formatDate((e.created_at?.split("T")[0] || e.created_at?.split(" ")[0]) ?? "")}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${pay.cls}`}>{pay.text}</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${st.cls}`}>{st.text}</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <div>
                          {e.certificate_url ? (
                            <a href={e.certificate_url} download className="inline-flex items-center gap-1.5 bg-primary/5 text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                              수료증
                            </a>
                          ) : (
                            <span className="text-gray-300 text-xs">수료증 미발급</span>
                          )}
                        </div>
                        {e.enrollment_status !== "cancelled" && e.enrollment_status !== "refund_requested" && (
                          <button onClick={() => handleCancel(e.id)} className="text-red-400 hover:text-red-600 text-xs font-semibold transition-colors">
                            {e.payment_status === "paid" ? "환불신청" : "취소"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-linear-to-r from-slate-50 to-slate-100/50 border-b border-gray-100">
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">교육 과정명</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">교육기간</th>
                      <th className="px-4 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">수강료</th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">비용 납부</th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">신청 상태</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">신청일</th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">수료증</th>
                      <th className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">취소/환불</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {enrollments.map((e) => {
                      const pay = paymentLabel(e.payment_status);
                      const st = statusLabel(e.enrollment_status);
                      return (
                        <tr key={e.id} className={`hover:bg-slate-50/50 transition-colors border-l-3 ${
                          e.enrollment_status === "confirmed" ? "border-l-emerald-400" :
                          e.enrollment_status === "cancelled" ? "border-l-gray-300" :
                          e.enrollment_status === "refund_requested" ? "border-l-orange-400" :
                          "border-l-amber-400"
                        }`}>
                          <td className="px-4 py-4 font-semibold text-gray-900">{e.course_name}</td>
                          <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                            {formatDate(e.start_date)} ~ {formatDate(e.end_date)}
                          </td>
                          <td className="px-4 py-4 text-right text-gray-700 font-medium whitespace-nowrap">
                            {e.fee > 0 ? `${e.fee.toLocaleString()}원` : <span className="text-gray-300">무료</span>}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${pay.cls}`}>{pay.text}</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${st.cls}`}>{st.text}</span>
                          </td>
                          <td className="px-4 py-4 text-gray-400 text-xs whitespace-nowrap">
                            {formatDate((e.created_at?.split("T")[0] || e.created_at?.split(" ")[0]) ?? "")}
                          </td>
                          <td className="px-4 py-4 text-center">
                            {e.certificate_url ? (
                              <a href={e.certificate_url} download className="inline-flex items-center gap-1.5 bg-gold/10 text-gold hover:bg-gold/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:shadow-sm">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                                수료증
                              </a>
                            ) : (
                              <span className="text-gray-300 text-xs">미발급</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center">
                            {e.enrollment_status !== "cancelled" && e.enrollment_status !== "refund_requested" && (
                              <button onClick={() => handleCancel(e.id)} className="text-red-400 hover:text-red-600 text-xs font-semibold transition-colors">
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
          </>
        )}
      </div>
    </div>
  );
}
