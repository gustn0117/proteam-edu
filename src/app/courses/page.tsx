"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  description: string;
  enrolled_count: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<any>(null);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/courses").then((r) => r.json()).then((d) => { if (d?.courses) setCourses(d.courses); }).catch(() => {});
    fetch("/api/auth/me").then((r) => r.json()).then((d) => { if (d?.user) setUser(d.user); }).catch(() => {});
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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80"
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
            <p className="text-sm font-semibold text-gold uppercase tracking-widest mb-3">Courses</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">교육 신청</h1>
            <p className="text-white/50 mt-3 text-sm max-w-lg mx-auto">현장에서 바로 활용할 수 있는 실무 중심의 교육 프로그램</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/20 to-transparent" />
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-14 relative z-10 pb-20">
        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <p className="text-gray-400 mb-2">현재 등록된 교육과정이 없습니다.</p>
            <p className="text-gray-300 text-sm">새로운 교육과정이 곧 등록될 예정입니다.</p>
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
                  {/* Top accent bar - color by category */}
                  <div className={`h-1 ${c.category === "online" ? "bg-linear-to-r from-accent via-accent-light to-accent" : "bg-linear-to-r from-primary via-gold to-primary-light"}`} />

                  <div className="p-6">
                    {/* Category + Status */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-primary/5 text-primary">
                        {c.category === "offline" ? (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></svg>
                        )}
                        {c.category === "offline" ? "오프라인" : "온라인"}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${st.cls}`}>
                        {st.text}
                      </span>
                    </div>

                    {/* Course name */}
                    <Link href={`/courses/${c.id}`} className="block">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {c.name}
                      </h3>
                    </Link>

                    {/* Description preview */}
                    {c.description && (
                      <p className="text-sm text-gray-400 line-clamp-2 mb-4">{c.description}</p>
                    )}

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

                    {/* Fee */}
                    <div className="flex items-center justify-between py-3 mb-4 border-t border-gray-50">
                      <span className="text-xs text-gray-400">교육비용</span>
                      {c.fee ? (
                        <span className="text-sm font-bold text-gold">{c.fee.toLocaleString()}원</span>
                      ) : (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full ring-1 ring-emerald-600/20">무료</span>
                      )}
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

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Link
                        href={`/courses/${c.id}`}
                        className="flex-1 bg-primary/5 text-primary py-3 rounded-xl font-semibold hover:bg-primary/10 transition-all text-sm text-center"
                      >
                        상세보기
                      </Link>
                      {c.status === "accepting" ? (
                        <button
                          onClick={() => handleEnroll(c.id)}
                          disabled={enrolling === c.id}
                          className="flex-1 bg-gold text-primary-dark py-3 rounded-xl font-semibold hover:bg-gold-light transition-all disabled:opacity-50 shadow-sm hover:shadow text-sm"
                        >
                          {enrolling === c.id ? "신청중..." : "신청하기"}
                        </button>
                      ) : (
                        <div className="flex-1 bg-gray-50 text-gray-400 py-3 rounded-xl font-semibold text-center text-sm">
                          접수 마감
                        </div>
                      )}
                    </div>
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
