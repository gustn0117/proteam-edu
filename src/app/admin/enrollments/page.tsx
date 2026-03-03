"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Course {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  duration: string;
  capacity: number;
  status: string;
  enrolled_count: number;
}

export default function AdminEnrollmentsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/courses").then((r) => r.json()).then((d) => { if (d?.courses) setCourses(d.courses); }).catch(() => {});
  }, []);

  const filtered = courses.filter((c) => !search || c.name.includes(search));
  const formatDate = (d: string) => d?.replace(/-/g, ".");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">수강 신청 현황</h2>
        <div className="relative">
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="과정명 검색"
            className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm w-56 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50/50"
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">전체 과정</p>
          <p className="text-2xl font-bold text-primary">{courses.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">접수중</p>
          <p className="text-2xl font-bold text-emerald-600">{courses.filter(c => c.status === "accepting").length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">총 신청자</p>
          <p className="text-2xl font-bold text-primary">{courses.reduce((a, c) => a + c.enrolled_count, 0)}명</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">평균 모집률</p>
          <p className="text-2xl font-bold text-gold">
            {courses.length ? Math.round(courses.reduce((a, c) => a + (c.enrolled_count / c.capacity * 100), 0) / courses.length) : 0}%
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100">
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">교육 과정명</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">교육기간</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">교육시간</th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">접수현황</th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-gray-900">{c.name}</td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{formatDate(c.start_date)} ~ {formatDate(c.end_date)}</td>
                  <td className="px-5 py-4 text-gray-500">{c.duration}</td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            c.enrolled_count / c.capacity >= 0.8 ? "bg-emerald-500" :
                            c.enrolled_count / c.capacity >= 0.5 ? "bg-amber-500" : "bg-primary"
                          }`}
                          style={{ width: `${Math.min(100, (c.enrolled_count / c.capacity) * 100)}%` }}
                        />
                      </div>
                      <span className="text-gray-700 font-medium">{c.enrolled_count}</span>
                      <span className="text-gray-400">/{c.capacity}명</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      c.status === "accepting"
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                        : "bg-gray-50 text-gray-500 ring-1 ring-gray-500/10"
                    }`}>
                      {c.status === "accepting" ? "접수중" : "마감"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Link href={`/admin/enrollments/${c.id}`}
                      className="inline-flex items-center gap-1 text-primary hover:text-accent text-xs font-semibold transition-colors">
                      신청자 보기
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
