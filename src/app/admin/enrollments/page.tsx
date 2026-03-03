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
      <h2 className="text-lg font-bold text-gray-800 mb-6">수강 신청 현황</h2>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">교육 과정명</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">교육기간</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">교육시간</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">접수현황</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">상태</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {courses.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(c.start_date)}~{formatDate(c.end_date)}</td>
                  <td className="px-4 py-3 text-gray-600">{c.duration}</td>
                  <td className="px-4 py-3 text-center">{c.enrolled_count}/{c.capacity}명</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      c.status === "accepting" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {c.status === "accepting" ? "접수중" : "마감"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Link href={`/admin/enrollments/${c.id}`}
                      className="text-blue-600 hover:underline text-xs font-medium">신청자 보기</Link>
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
