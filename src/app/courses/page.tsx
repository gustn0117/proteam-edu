"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  duration: string;
  capacity: number;
  location: string;
  status: string;
  category: string;
  fee: number;
  enrolled_count: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<any>(null);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/courses").then((r) => r.json()).then((d) => setCourses(d.courses));
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user));
  }, []);

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }
    setEnrolling(courseId);
    const res = await fetch("/api/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_id: courseId }),
    });
    const data = await res.json();
    setEnrolling(null);

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("교육 신청이 완료되었습니다.\n결제 안내는 '교육신청확인' 메뉴에서 확인해주세요.");
    router.push("/my-enrollments");
  };

  const statusLabel = (s: string) => {
    if (s === "accepting") return { text: "접수중", cls: "bg-green-100 text-green-700" };
    return { text: "접수마감", cls: "bg-gray-100 text-gray-500" };
  };

  const formatDate = (d: string) => d?.replace(/-/g, ".");

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1a365d] mb-8">교육 신청</h1>

      {courses.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-500 border">
          현재 등록된 교육과정이 없습니다.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">구분</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">교육 과정명</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">교육기간</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">교육시간</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">모집정원</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">교육장소</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">접수현황</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">교육신청</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {courses.map((c) => {
                  const st = statusLabel(c.status);
                  return (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500">{c.category === "offline" ? "오프라인" : "온라인"}</td>
                      <td className="px-4 py-3">
                        <Link href={`/courses/${c.id}`} className="text-blue-600 hover:underline font-medium">
                          {c.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {formatDate(c.start_date)}~{formatDate(c.end_date)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{c.duration}</td>
                      <td className="px-4 py-3 text-gray-600">{c.capacity}명</td>
                      <td className="px-4 py-3 text-gray-600">{c.location}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${st.cls}`}>
                          {st.text} ({c.enrolled_count}/{c.capacity})
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {c.status === "accepting" ? (
                          <button
                            onClick={() => handleEnroll(c.id)}
                            disabled={enrolling === c.id}
                            className="bg-[#1a365d] text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-[#2a4a7f] transition disabled:opacity-50"
                          >
                            {enrolling === c.id ? "신청중..." : "신청"}
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">접수마감</span>
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
