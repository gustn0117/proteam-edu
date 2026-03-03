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
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">로딩 중...</div>;
  }

  const formatDate = (d: string) => d?.replace(/-/g, ".");
  const formatFee = (f: number) => f ? f.toLocaleString() + "원" : "무료";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/courses" className="text-blue-600 hover:underline text-sm mb-6 inline-block">&larr; 교육 과정 목록</Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-700 mb-2 inline-block">
                {course.category === "offline" ? "오프라인" : "온라인"}
              </span>
              <h1 className="text-2xl font-bold text-[#1a365d]">{course.name}</h1>
            </div>
            {course.status === "accepting" && (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="bg-[#1a365d] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#2a4a7f] transition disabled:opacity-50"
              >
                {enrolling ? "신청중..." : "교육 신청"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <InfoItem label="교육기간" value={`${formatDate(course.start_date)} ~ ${formatDate(course.end_date)}`} />
            <InfoItem label="교육시간" value={course.duration} />
            <InfoItem label="모집정원" value={`${course.capacity}명`} />
            <InfoItem label="교육장소" value={course.location} />
            <InfoItem label="교육비용" value={formatFee(course.fee)} />
            <InfoItem label="접수현황" value={`${course.enrolled_count}/${course.capacity}명`} />
          </div>

          {course.description && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-3">과정 소개</h2>
              <p className="text-gray-600 leading-relaxed">{course.description}</p>
            </div>
          )}
        </div>

        {course.poster_url && (
          <div className="border-t p-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">교육 안내 포스터</h2>
            {course.poster_url.endsWith(".pdf") ? (
              <iframe src={course.poster_url} className="w-full h-[800px] border rounded-lg" />
            ) : (
              <img src={course.poster_url} alt="교육 안내 포스터" className="max-w-full rounded-lg shadow" />
            )}
          </div>
        )}

        <div className="border-t p-8 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 mb-3">결제 안내</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p>계좌이체: 국민 829-01-0308-009, ㈜프로앤팀</p>
            <p>계산서 발급: 사업자등록증 사본, 담당자 메일, 연락처를 edu@proteambiz.com으로 송부</p>
            <p>현금영수증: 국세청에 등록된 핸드폰 번호 송부</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}
