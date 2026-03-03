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
    if (s === "accepting") return { text: "접수중", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20" };
    return { text: "접수마감", cls: "bg-gray-50 text-gray-500 ring-1 ring-gray-500/10" };
  };

  const formatDate = (d: string) => d?.replace(/-/g, ".");

  return (
    <div>
      <section className="bg-primary py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,168,78,0.1)_0%,transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-semibold text-gold uppercase tracking-widest mb-3">Courses</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">교육 신청</h1>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 pb-20">
        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center text-gray-400 border border-gray-100 shadow-sm">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            현재 등록된 교육과정이 없습니다.
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100">
                    <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">구분</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">교육 과정명</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">교육기간</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">교육시간</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">정원</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">교육장소</th>
                    <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">접수현황</th>
                    <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">신청</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {courses.map((c) => {
                    const st = statusLabel(c.status);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-primary/5 text-primary">
                            {c.category === "offline" ? "오프라인" : "온라인"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <Link href={`/courses/${c.id}`} className="text-primary hover:text-accent font-semibold hover:underline underline-offset-2 transition-colors">
                            {c.name}
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                          {formatDate(c.start_date)} ~ {formatDate(c.end_date)}
                        </td>
                        <td className="px-5 py-4 text-gray-500">{c.duration}</td>
                        <td className="px-5 py-4 text-gray-500">{c.capacity}명</td>
                        <td className="px-5 py-4 text-gray-500">{c.location}</td>
                        <td className="px-5 py-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${st.cls}`}>
                            {st.text} ({c.enrolled_count}/{c.capacity})
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          {c.status === "accepting" ? (
                            <button
                              onClick={() => handleEnroll(c.id)}
                              disabled={enrolling === c.id}
                              className="bg-gold text-primary-dark px-5 py-2 rounded-lg text-xs font-semibold hover:bg-gold-light transition-all disabled:opacity-50 shadow-sm hover:shadow"
                            >
                              {enrolling === c.id ? "신청중..." : "신청"}
                            </button>
                          ) : (
                            <span className="text-gray-300 text-xs">마감</span>
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
