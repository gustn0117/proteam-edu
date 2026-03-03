"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Course {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  duration: string;
  capacity: number;
  location: string;
  status: string;
  fee: number;
  poster_url: string;
  description: string;
  enrolled_count: number;
  category: string;
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [user, setUser] = useState<any>(null);
  const [enrolling, setEnrolling] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/courses/${id}`).then((r) => r.json()).then((d) => setCourse(d.course));
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setUser(d.user));
  }, [id]);

  const handleEnroll = async () => {
    if (!user) { router.push("/login"); return; }
    setEnrolling(true);
    const res = await fetch("/api/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_id: id }),
    });
    const data = await res.json();
    setEnrolling(false);
    if (!res.ok) { alert(data.error); return; }
    alert("교육 신청이 완료되었습니다.");
    router.push("/my-enrollments");
  };

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const formatDate = (d: string) => d?.replace(/-/g, ".");
  const formatFee = (f: number) => f ? f.toLocaleString() + "원" : "무료";
  const fillPercent = Math.round((course.enrolled_count / course.capacity) * 100);

  return (
    <div>
      {/* Hero header */}
      <section className="bg-primary py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,168,78,0.1)_0%,transparent_60%)]" />
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/courses" className="inline-flex items-center gap-1.5 text-white/50 hover:text-white text-sm mb-4 transition-colors group">
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            교육 과정 목록
          </Link>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/10 text-gold mb-3 inline-block">
            {course.category === "offline" ? "오프라인" : "온라인"}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-white">{course.name}</h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/20 to-transparent" />
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 pb-14">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
          <div className="p-8 md:p-10">
            {/* Enroll button */}
            {course.status === "accepting" && (
              <div className="flex justify-end mb-6">
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="bg-gold text-primary-dark px-7 py-3 rounded-xl font-semibold hover:bg-gold-light transition-all disabled:opacity-50 shadow-sm hover:shadow shrink-0"
                >
                  {enrolling ? "신청중..." : "교육 신청"}
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              <InfoItem label="교육기간" value={`${formatDate(course.start_date)} ~ ${formatDate(course.end_date)}`} />
              <InfoItem label="교육시간" value={course.duration} />
              <InfoItem label="모집정원" value={`${course.capacity}명`} />
              <InfoItem label="교육장소" value={course.location} />
              <InfoItem label="교육비용" value={formatFee(course.fee)} />
            </div>

            {/* Enrollment progress bar */}
            <div className="bg-slate-50 rounded-xl p-5 mb-8">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-700">모집 현황</p>
                <p className="text-sm">
                  <span className="font-bold text-primary">{course.enrolled_count}</span>
                  <span className="text-gray-400"> / {course.capacity}명</span>
                </p>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full animate-progress-fill"
                  style={{
                    width: `${fillPercent}%`,
                    background: fillPercent >= 90
                      ? "linear-gradient(90deg, #ef4444, #f87171)"
                      : "linear-gradient(90deg, #c8a84e, #d4b96a)",
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                잔여 {course.capacity - course.enrolled_count}석
              </p>
            </div>

            {course.description && (
              <div className="mb-2">
                <h2 className="text-base font-bold text-gray-900 mb-3">과정 소개</h2>
                <p className="text-gray-500 leading-relaxed">{course.description}</p>
              </div>
            )}
          </div>

          {course.poster_url && (
            <div className="border-t border-gray-100 p-8 md:p-10">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6.75v12A2.25 2.25 0 003.75 21z" />
                </svg>
                교육 안내 포스터
              </h2>
              {course.poster_url.endsWith(".pdf") ? (
                <iframe src={course.poster_url} className="w-full h-200 border border-gray-200 rounded-2xl shadow-sm" />
              ) : (
                <img src={course.poster_url} alt="교육 안내 포스터" className="max-w-full rounded-2xl shadow-md border border-gray-100" />
              )}
            </div>
          )}

          <div className="border-t border-gray-100 p-8 md:p-10 bg-slate-50/50">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
              결제 안내
            </h2>
            <div className="space-y-3 text-sm text-gray-500">
              <p><span className="font-medium text-gray-700">계좌이체:</span> 국민 829-01-0308-009, ㈜프로앤팀</p>
              <p><span className="font-medium text-gray-700">계산서 발급:</span> 사업자등록증 사본, 담당자 메일, 연락처를 edu@proteambiz.com으로 송부</p>
              <p><span className="font-medium text-gray-700">현금영수증:</span> 국세청에 등록된 핸드폰 번호 송부</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-gold/20 transition-colors">
      <p className="text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}
