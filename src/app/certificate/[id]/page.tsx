"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface CertificateData {
  enrollment_id: string;
  user_name: string;
  organization: string;
  course_name: string;
  course_type: string;
  start_date: string;
  end_date: string;
  duration: string;
  location: string;
  completed_at: string;
}

export default function CertificatePage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<CertificateData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/certificate/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setError(d.error);
        } else {
          setData(d.certificate);
        }
      })
      .catch(() => setError("수료증을 불러올 수 없습니다."))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (d: string) => {
    if (!d) return "";
    const [y, m, day] = d.split("-");
    return `${y}년 ${parseInt(m)}월 ${parseInt(day)}일`;
  };

  const formatDateShort = (d: string) => d?.replace(/-/g, ".");

  const todayFormatted = () => {
    const now = new Date();
    return `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{error}</p>
          <button onClick={() => router.push("/my-enrollments")} className="text-primary text-sm font-medium hover:underline">
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const certNumber = `PT-${data.enrollment_id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gray-200 py-8 print:bg-white print:py-0">
      {/* Print / Download buttons */}
      <div className="max-w-[800px] mx-auto px-4 mb-4 flex items-center justify-between print:hidden">
        <button
          onClick={() => router.push("/my-enrollments")}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          목록으로
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-light transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
          </svg>
          인쇄 / PDF 저장
        </button>
      </div>

      {/* Certificate */}
      <div className="max-w-[800px] mx-auto px-4 print:px-0 print:max-w-none">
        <div
          className="bg-white shadow-xl print:shadow-none aspect-[1/1.414] relative overflow-hidden"
          style={{ fontFamily: "'Noto Serif KR', 'Batang', serif" }}
        >
          {/* Outer border */}
          <div className="absolute inset-[20px] border-2 border-amber-700/30" />
          <div className="absolute inset-[24px] border border-amber-700/15" />

          {/* Corner ornaments */}
          <div className="absolute top-[28px] left-[28px] w-12 h-12 border-t-2 border-l-2 border-amber-700/40" />
          <div className="absolute top-[28px] right-[28px] w-12 h-12 border-t-2 border-r-2 border-amber-700/40" />
          <div className="absolute bottom-[28px] left-[28px] w-12 h-12 border-b-2 border-l-2 border-amber-700/40" />
          <div className="absolute bottom-[28px] right-[28px] w-12 h-12 border-b-2 border-r-2 border-amber-700/40" />

          {/* Content */}
          <div className="absolute inset-[48px] flex flex-col items-center justify-between py-8 md:py-12">

            {/* Certificate number */}
            <p className="text-[10px] md:text-xs text-gray-400 tracking-widest self-end">
              제 {certNumber} 호
            </p>

            {/* Title */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-[0.3em] text-gray-900 mb-2">
                수 료 증
              </h1>
              <div className="w-24 h-0.5 bg-amber-700/30 mx-auto mt-3" />
            </div>

            {/* Main content */}
            <div className="w-full max-w-[520px] space-y-6 md:space-y-8">
              {/* Name */}
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-gray-900 tracking-wider border-b-2 border-gray-900 pb-2 inline-block px-8">
                  {data.user_name}
                </p>
                {data.organization && (
                  <p className="text-xs md:text-sm text-gray-500 mt-2">({data.organization})</p>
                )}
              </div>

              {/* Details table */}
              <div className="space-y-3 md:space-y-4 text-sm md:text-base">
                <div className="flex">
                  <span className="w-28 md:w-32 text-gray-500 font-medium shrink-0">교 육 과 정</span>
                  <span className="text-gray-900 font-semibold">{data.course_name}</span>
                </div>
                <div className="flex">
                  <span className="w-28 md:w-32 text-gray-500 font-medium shrink-0">교 육 기 간</span>
                  <span className="text-gray-900">
                    {formatDate(data.start_date)} ~ {formatDate(data.end_date)}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-28 md:w-32 text-gray-500 font-medium shrink-0">교 육 시 간</span>
                  <span className="text-gray-900">{data.duration}</span>
                </div>
                {data.location && (
                  <div className="flex">
                    <span className="w-28 md:w-32 text-gray-500 font-medium shrink-0">교 육 장 소</span>
                    <span className="text-gray-900">{data.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Certificate body text */}
            <div className="text-center max-w-[480px]">
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                위 사람은 상기 교육과정을 성실히 이수하였으므로<br />
                이 증서를 수여합니다.
              </p>
            </div>

            {/* Date */}
            <p className="text-sm md:text-base text-gray-700">{todayFormatted()}</p>

            {/* Issuer */}
            <div className="text-center">
              <p className="text-lg md:text-xl font-bold text-gray-900 tracking-wider mb-1">
                ㈜ 프 로 앤 팀
              </p>
              <p className="text-xs md:text-sm text-gray-500">PRO&amp;TEAM Co., Ltd.</p>
              <div className="mt-3 relative inline-block">
                <p className="text-sm md:text-base font-semibold text-gray-800">대표이사</p>
                {/* Stamp effect */}
                <div className="absolute -right-14 -top-3 w-12 h-12 rounded-full border-2 border-red-500/60 flex items-center justify-center rotate-[-8deg]">
                  <span className="text-red-500/70 text-[10px] font-bold leading-none text-center">프로<br />앤팀</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          header, footer, nav {
            display: none !important;
          }
        }
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}
