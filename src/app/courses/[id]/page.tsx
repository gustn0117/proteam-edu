"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
  location_map_url: string;
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
    fetch(`/api/courses/${id}`).then((r) => r.json()).then((d) => { if (d?.course) setCourse(d.course); }).catch(() => {});
    fetch("/api/auth/me").then((r) => r.json()).then((d) => { if (d?.user) setUser(d.user); }).catch(() => {});
  }, [id]);

  const handleEnroll = async () => {
    if (!course) return;
    // Paid course → go to checkout (Toss Payments)
    if (course.fee > 0) {
      router.push(`/checkout?courseId=${course.id}`);
      return;
    }
    // Free course → existing enrollment flow (login required)
    if (!user) { router.push("/login"); return; }
    setEnrolling(true);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: id }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.error); return; }
      alert("교육신청이 완료되었습니다.");
      router.push("/my-enrollments");
    } catch (err) {
      alert("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setEnrolling(false);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400">교육과정 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const formatDate = (d: string) => d?.replace(/-/g, ".");
  const formatFee = (f: number) => f ? f.toLocaleString() + "원" : "무료";
  const fileUrl = (url: string) => url?.startsWith("/uploads/") ? url.replace("/uploads/", "/api/uploads/") : url;
  const isClosed = course.status !== "accepting";
  const isOnline = course.category === "online";

  return (
    <div className="bg-gray-50/50 min-h-screen">
      {/* Hero with background image */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={isOnline
              ? "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&q=80"
              : "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80"
            }
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary/85" />
          <div className="absolute inset-0 bg-linear-to-b from-primary/40 via-transparent to-primary/60" />
        </div>
        <div className="absolute inset-0 pattern-dots opacity-10" />

        <div className="relative pt-10 pb-32 md:pt-14 md:pb-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
              <Link href="/" className="hover:text-white/70 transition-colors">홈</Link>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <Link href="/courses" className="hover:text-white/70 transition-colors">교육 과정</Link>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <span className="text-white/60 truncate max-w-48">{course.name}</span>
            </nav>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full backdrop-blur-sm ${
                isOnline
                  ? "bg-blue-500/20 text-blue-200 border border-blue-400/30"
                  : "bg-amber-500/20 text-amber-200 border border-amber-400/30"
              }`}>
                {isOnline ? "온라인" : "오프라인"}
              </span>
              {isClosed ? (
                <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-200 border border-red-400/30 backdrop-blur-sm">
                  접수 마감
                </span>
              ) : (
                <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 backdrop-blur-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  접수중
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl">
              {course.name}
            </h1>

          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-20 relative z-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-7 animate-fade-in-up">

            {/* Key highlights strip */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-2 md:grid-cols-4">
                <HighlightCard
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>}
                  label="교육기간"
                  value={`${formatDate(course.start_date)} ~ ${formatDate(course.end_date)}`}
                  bg="bg-blue-50" iconColor="text-blue-500"
                />
                <HighlightCard
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  label="교육시간"
                  value={course.duration}
                  bg="bg-emerald-50" iconColor="text-emerald-500"
                />
                <HighlightCard
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>}
                  label="교육장소"
                  value={course.location}
                  bg="bg-purple-50" iconColor="text-purple-500"
                />
                <HighlightCard
                  icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>}
                  label="모집정원"
                  value={`${course.capacity}명`}
                  bg="bg-amber-50" iconColor="text-amber-500"
                />
              </div>
            </div>

            {/* Course description */}
            {course.description && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-7 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                      <svg className="w-[18px] h-[18px] text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </span>
                    과정 소개
                  </h2>
                </div>
                <div className="p-7">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-[1.85] whitespace-pre-wrap text-[15px]">{course.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Poster */}
            {course.poster_url && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-7 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
                      <svg className="w-[18px] h-[18px] text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6.75v12A2.25 2.25 0 003.75 21z" />
                      </svg>
                    </span>
                    교육 안내 포스터
                  </h2>
                </div>
                <div className="p-7">
                  {course.poster_url.endsWith(".pdf") ? (
                    <iframe src={`${fileUrl(course.poster_url)}#navpanes=0&scrollbar=0`} className="w-full h-200 border border-gray-200 rounded-xl" />
                  ) : (
                    <img src={fileUrl(course.poster_url)} alt="교육 안내 포스터" className="max-w-full rounded-xl shadow-sm border border-gray-100" />
                  )}
                </div>
              </div>
            )}

            {/* Location map */}
            {course.location_map_url && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-7 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                      <svg className="w-[18px] h-[18px] text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </span>
                    교육장소
                  </h2>
                </div>
                <div className="p-7">
                  {course.location_map_url.endsWith(".pdf") ? (
                    <iframe src={`${fileUrl(course.location_map_url)}#navpanes=0&scrollbar=0`} className="w-full h-200 border border-gray-200 rounded-xl" />
                  ) : (
                    <img src={fileUrl(course.location_map_url)} alt="교육장소 약도" className="max-w-full rounded-xl shadow-sm border border-gray-100" />
                  )}
                </div>
              </div>
            )}

            {/* Service info & refund policy */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-7 py-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <svg className="w-[18px] h-[18px] text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </span>
                  서비스 제공 안내
                </h2>
              </div>
              <div className="p-7 space-y-4 text-sm">
                <div className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/60 mt-2 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-800 mb-0.5">서비스 유형</p>
                    <p className="text-gray-500">무형 서비스 (오프라인/온라인 교육)</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/60 mt-2 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-800 mb-0.5">서비스 제공 기간</p>
                    <p className="text-gray-500">결제 완료 후 해당 교육 일정에 따라 제공 (최대 5주 이내)</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/60 mt-2 shrink-0" />
                  <div>
                    <p className="font-bold text-gray-800 mb-0.5">환불 정책</p>
                    <p className="text-gray-500">교육시작 7일 전 100% / 2~7일 전 80% / 1~2일 전 50% / 교육시작 후 환불 불가</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-7 py-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                    <svg className="w-[18px] h-[18px] text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                  </span>
                  결제 안내
                </h2>
              </div>
              <div className="p-7 space-y-4">
                <div className="flex gap-4 items-start bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <span className="w-8 h-8 rounded-lg bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">1</span>
                  <div>
                    <p className="text-sm font-bold text-gray-800 mb-1">계좌이체</p>
                    <p className="text-sm text-gray-500 leading-relaxed">IBK기업은행 065-166799-04-016 (프로앤팀 주식회사)</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <span className="w-8 h-8 rounded-lg bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">2</span>
                  <div>
                    <p className="text-sm font-bold text-gray-800 mb-1">계산서 발급</p>
                    <p className="text-sm text-gray-500 leading-relaxed">사업자등록증 사본, 담당자 메일, 연락처를<br className="hidden sm:block" /> edu@proteamip.com으로 송부해 주세요</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <span className="w-8 h-8 rounded-lg bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">3</span>
                  <div>
                    <p className="text-sm font-bold text-gray-800 mb-1">현금영수증</p>
                    <p className="text-sm text-gray-500 leading-relaxed">국세청에 등록된 핸드폰 번호 송부</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <div className="lg:sticky lg:top-6 space-y-6">

              {/* Enrollment card */}
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
                {/* Price header */}
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0">
                    <Image
                      src={isOnline
                        ? "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80"
                        : "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                      }
                      alt=""
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/90" />
                  </div>
                  <div className="relative p-6 text-center">
                    <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-2">교육비용</p>
                    {course.fee > 0 ? (
                      <p className="text-3xl font-extrabold text-gradient-gold">{course.fee.toLocaleString()}<span className="text-lg ml-0.5">원</span></p>
                    ) : (
                      <p className="text-3xl font-extrabold text-emerald-300">무료</p>
                    )}
                    {course.fee > 0 && (
                      <p className="text-white/30 text-xs mt-1.5">VAT 포함</p>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-5">

                  {/* CTA */}
                  <div className="pt-1">
                    {isClosed ? (
                      <div className="w-full bg-gray-100 text-gray-400 py-4 rounded-xl font-bold text-center cursor-not-allowed flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        접수 마감
                      </div>
                    ) : (
                      <button
                        onClick={handleEnroll}
                        disabled={enrolling}
                        className="w-full bg-gold text-primary-dark py-4 rounded-xl font-bold hover:bg-gold-light transition-all disabled:opacity-50 shadow-md shadow-gold/25 hover:shadow-lg hover:shadow-gold/30 text-base flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        {enrolling ? (
                          <>
                            <div className="w-4 h-4 border-2 border-primary-dark/20 border-t-primary-dark rounded-full animate-spin" />
                            신청 처리중...
                          </>
                        ) : (
                          <>
                            교육 신청하기
                            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                          </>
                        )}
                      </button>
                    )}
                    {!isClosed && (
                      <p className="text-center text-xs text-gray-400 mt-3">
                        로그인 후 간편하게 신청할 수 있습니다
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    교육 문의
                  </h3>
                  <div className="space-y-3">
                    <a href="tel:02-6677-3868" className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors group p-2.5 -mx-2.5 rounded-lg hover:bg-primary/3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                        <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700">02-6677-3868</p>
                        <p className="text-xs text-gray-400">평일 09:00 ~ 18:00</p>
                      </div>
                    </a>
                    <a href="mailto:edu@proteamip.com" className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary transition-colors group p-2.5 -mx-2.5 rounded-lg hover:bg-primary/3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700">edu@proteamip.com</p>
                        <p className="text-xs text-gray-400">이메일 문의</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Share / back buttons */}
              <div className="flex gap-3">
                <Link
                  href="/courses"
                  className="flex-1 bg-white rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 text-center hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                  </svg>
                  목록으로
                </Link>
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-white rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 text-center hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                  </svg>
                  인쇄하기
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile bottom CTA */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3 max-w-6xl mx-auto">
            <div className="flex-1 min-w-0">
              {course.fee > 0 ? (
                <p className="text-lg font-extrabold text-primary">{course.fee.toLocaleString()}<span className="text-sm font-normal text-gray-400 ml-0.5">원</span></p>
              ) : (
                <p className="text-lg font-extrabold text-emerald-600">무료</p>
              )}
              <p className="text-xs text-gray-400 truncate">정원 {course.capacity}명 | {course.duration}</p>
            </div>
            {isClosed ? (
              <div className="bg-gray-100 text-gray-400 px-8 py-3.5 rounded-xl font-bold text-sm cursor-not-allowed">
                접수 마감
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="bg-gold text-primary-dark px-8 py-3.5 rounded-xl font-bold hover:bg-gold-light transition-all disabled:opacity-50 shadow-md shadow-gold/25 text-sm shrink-0 cursor-pointer"
              >
                {enrolling ? "신청중..." : "교육 신청하기"}
              </button>
            )}
          </div>
        </div>
        <div className="lg:hidden h-20" />
      </div>
    </div>
  );
}

function HighlightCard({ icon, label, value, bg, iconColor }: {
  icon: React.ReactNode; label: string; value: string; bg: string; iconColor: string;
}) {
  return (
    <div className="p-5 text-center border-r border-gray-100 last:border-r-0 hover:bg-gray-50/50 transition-colors">
      <div className={`w-11 h-11 rounded-xl ${bg} ${iconColor} flex items-center justify-center mx-auto mb-3`}>
        {icon}
      </div>
      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-bold text-gray-800 leading-snug">{value}</p>
    </div>
  );
}

function SidebarInfo({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? "text-gold" : "text-gray-700"}`}>{value}</span>
    </div>
  );
}
