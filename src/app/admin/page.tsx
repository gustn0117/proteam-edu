"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalMembers: number;
  totalCourses: number;
  totalEnrollments: number;
  monthEnrollments: number;
}

interface RecentEnrollment {
  id: string;
  user_name: string;
  course_name: string;
  enrollment_status: string;
  payment_status: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ totalMembers: 0, totalCourses: 0, totalEnrollments: 0, monthEnrollments: 0 });
  const [recent, setRecent] = useState<RecentEnrollment[]>([]);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d?.stats) setStats(d.stats);
        if (d?.recentEnrollments) setRecent(d.recentEnrollments);
      })
      .catch(() => {});
  }, []);

  const formatDateTime = (d: string) => {
    if (!d) return "-";
    const date = d.split("T")[0] || d.split(" ")[0];
    return date?.replace(/-/g, ".");
  };

  const statusLabel = (s: string) => {
    switch (s) {
      case "pending": return { text: "대기중", cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20" };
      case "confirmed": return { text: "확인완료", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20" };
      case "completed": return { text: "수료", cls: "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20" };
      case "cancelled": return { text: "취소됨", cls: "bg-gray-50 text-gray-500 ring-1 ring-gray-500/10" };
      case "refund_requested": return { text: "환불신청", cls: "bg-orange-50 text-orange-600 ring-1 ring-orange-500/20" };
      default: return { text: s, cls: "bg-gray-50 text-gray-500" };
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-6 lg:hidden">대시보드</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <p className="text-xs text-gray-400 font-medium">전체 회원</p>
          </div>
          <p className="text-3xl font-bold text-primary">{stats.totalMembers}<span className="text-sm font-normal text-gray-400 ml-1">명</span></p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <p className="text-xs text-gray-400 font-medium">교육 과정</p>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{stats.totalCourses}<span className="text-sm font-normal text-gray-400 ml-1">개</span></p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-100 to-blue-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
            </div>
            <p className="text-xs text-gray-400 font-medium">총 수강신청</p>
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.totalEnrollments}<span className="text-sm font-normal text-gray-400 ml-1">건</span></p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <p className="text-xs text-gray-400 font-medium">이번 달 신청</p>
          </div>
          <p className="text-3xl font-bold text-gold">{stats.monthEnrollments}<span className="text-sm font-normal text-gray-400 ml-1">건</span></p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/admin/courses" className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:border-primary/30 hover:shadow-md transition-all group flex">
          <div className="w-1 bg-emerald-400 shrink-0" />
          <div className="flex items-center justify-between flex-1 p-5">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">교육과정 관리</h3>
              <p className="text-xs text-gray-400">과정 추가, 수정, 삭제</p>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </Link>
        <Link href="/admin/enrollments" className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:border-primary/30 hover:shadow-md transition-all group flex">
          <div className="w-1 bg-blue-400 shrink-0" />
          <div className="flex items-center justify-between flex-1 p-5">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">수강신청 현황</h3>
              <p className="text-xs text-gray-400">신청자 관리, CSV 내보내기</p>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </Link>
        <Link href="/admin/members" className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:border-primary/30 hover:shadow-md transition-all group flex">
          <div className="w-1 bg-gold shrink-0" />
          <div className="flex items-center justify-between flex-1 p-5">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">회원 관리</h3>
              <p className="text-xs text-gray-400">회원 조회, 수강 이력</p>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Recent Enrollments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">최근 수강신청</h3>
          <Link href="/admin/enrollments" className="text-xs text-primary hover:text-accent font-medium transition-colors">전체 보기</Link>
        </div>
        {recent.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400 border border-gray-100 text-sm">
            최근 수강신청이 없습니다.
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">신청자</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">교육과정</th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">결제</th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">상태</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">신청일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recent.map((e) => {
                    const st = statusLabel(e.enrollment_status);
                    return (
                      <tr key={e.id} className="even:bg-slate-50/30 hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 font-medium text-gray-900">{e.user_name}</td>
                        <td className="px-5 py-3 text-gray-500">{e.course_name}</td>
                        <td className="px-5 py-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            e.payment_status === "paid"
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                              : "bg-red-50 text-red-500 ring-1 ring-red-500/10"
                          }`}>
                            {e.payment_status === "paid" ? "납부" : "미납"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${st.cls}`}>{st.text}</span>
                        </td>
                        <td className="px-5 py-3 text-gray-400 text-xs">{formatDateTime(e.created_at)}</td>
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
