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
      <section className="bg-primary pt-16 pb-24 md:pt-20 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,168,78,0.1)_0%,transparent_60%)]" />
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-semibold text-gold uppercase tracking-widest mb-3">Courses</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">교육 신청</h1>
          <p className="text-white/50 mt-3 text-sm max-w-lg mx-auto">현장에서 바로 활용할 수 있는 실무 중심의 교육 프로그램</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/20 to-transparent" />
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-14 relative z-10 pb-20">
        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center text-gray-400 border border-gray-100 shadow-sm">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            현재 등록된 교육과정이 없습니다.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((c, idx) => {
              const st = statusLabel(c.status);
              const fillPercent = Math.round((c.enrolled_count / c.capacity) * 100);
              return (
                <div
                  key={c.id}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {/* Top accent bar */}
                  <div className="h-1 bg-linear-to-r from-primary via-gold to-accent" />

                  <div className="p-6">
                    {/* Category + Status */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-primary/5 text-primary">
                        {c.category === "offline" ? "오프라인" : "온라인"}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${st.cls}`}>
                        {st.text}
                      </span>
                    </div>

                    {/* Course name */}
                    <Link href={`/courses/${c.id}`} className="block">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {c.name}
                      </h3>
                    </Link>

                    {/* Info rows */}
                    <div className="space-y-2.5 mb-5">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        {formatDate(c.start_date)} ~ {formatDate(c.end_date)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {c.duration}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        {c.location}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-gray-400">모집 현황</span>
                        <span className="font-semibold text-gray-600">{c.enrolled_count}/{c.capacity}명</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full animate-progress-fill transition-all"
                          style={{
                            width: `${fillPercent}%`,
                            background: fillPercent >= 90
                              ? "linear-gradient(90deg, #ef4444, #f87171)"
                              : fillPercent >= 60
                              ? "linear-gradient(90deg, #c8a84e, #d4b96a)"
                              : "linear-gradient(90deg, #10b981, #34d399)",
                          }}
                        />
                      </div>
                    </div>

                    {/* Action */}
                    {c.status === "accepting" ? (
                      <button
                        onClick={() => handleEnroll(c.id)}
                        disabled={enrolling === c.id}
                        className="w-full bg-gold text-primary-dark py-3 rounded-xl font-semibold hover:bg-gold-light transition-all disabled:opacity-50 shadow-sm hover:shadow text-sm"
                      >
                        {enrolling === c.id ? "신청중..." : "교육 신청하기"}
                      </button>
                    ) : (
                      <div className="w-full bg-gray-50 text-gray-400 py-3 rounded-xl font-semibold text-center text-sm">
                        접수 마감
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
