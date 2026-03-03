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

  useEffect(() => {
    fetch("/api/courses").then((r) => r.json()).then((d) => setCourses(d.courses));
  }, []);

  const formatDate = (d: string) => d?.replace(/-/g, ".");

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-6">수강 신청 현황</h2>
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
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-gray-900">{c.name}</td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{formatDate(c.start_date)} ~ {formatDate(c.end_date)}</td>
                  <td className="px-5 py-4 text-gray-500">{c.duration}</td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-gray-700 font-medium">{c.enrolled_count}</span>
                    <span className="text-gray-400">/{c.capacity}명</span>
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
                      className="text-primary hover:text-accent text-xs font-semibold transition-colors">신청자 보기</Link>
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
