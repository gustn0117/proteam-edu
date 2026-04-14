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
  course_type: string;
  fee: number;
  description: string;
  enrolled_count: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<any>(null);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const router = useRouter();

  // Filters
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetch("/api/courses").then((r) => r.json()).then((d) => { if (d?.courses) setCourses(d.courses); }).catch(() => {});
    fetch("/api/auth/me").then((r) => r.json()).then((d) => { if (d?.user) setUser(d.user); }).catch(() => {});
  }, []);

  const handleEnroll = async (courseId: string) => {
    const target = courses.find((c) => c.id === courseId);
    // Paid course → checkout (Toss Payments) - guest allowed
    if (target && target.fee > 0) {
      router.push(`/checkout?courseId=${courseId}`);
      return;
    }
    // Free course → existing flow (login required)
    if (!user) {
      router.push("/login");
      return;
    }
    setEnrolling(courseId);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: courseId }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      alert("교육신청이 완료되었습니다.");
      router.push("/my-enrollments");
    } catch (err) {
      alert("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setEnrolling(null);
    }
  };

  const formatDate = (d: string) => d?.replace(/-/g, ".");

  const formatDateRange = (start: string, end: string) => {
    if (start === end) return formatDate(start) + ".";
    return formatDate(start) + "~" + formatDate(end) + ".";
  };

  // Get unique course types for filter dropdown
  const courseTypes = Array.from(new Set(courses.map((c) => c.course_type).filter(Boolean)));

  // Filter courses
  const filtered = courses.filter((c) => {
    if (filterCategory !== "all" && c.category !== filterCategory) return false;
    if (filterType !== "all" && c.course_type !== filterType) return false;
    if (filterName && !c.name.includes(filterName)) return false;
    if (filterDate) {
      const fd = filterDate.replace(/-/g, "");
      const sd = c.start_date.replace(/-/g, "");
      if (sd < fd) return false;
    }
    if (filterStatus !== "all" && c.status !== filterStatus) return false;
    return true;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div>
      {/* Page Title */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">교육과정 및 신청</h1>
            <nav className="hidden sm:flex items-center gap-1.5 text-sm text-gray-400">
              <Link href="/" className="hover:text-primary transition-colors">홈</Link>
              <span>&gt;</span>
              <span className="text-gray-500">교육/시험신청</span>
              <span>&gt;</span>
              <span className="text-gray-900 font-medium">교육신청</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        {/* Search Filter Section */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-primary mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            교육 신청 일정 검색
          </h2>
          <form onSubmit={handleSearch} className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-5">
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              {/* 교육구분 */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">교육구분</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm bg-white min-w-[100px] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="all">전체</option>
                  <option value="offline">오프라인</option>
                  <option value="online">온라인</option>
                </select>
              </div>

              {/* 교육과정명 */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">교육과정명</label>
                <input
                  type="text"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm bg-white min-w-[160px] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder=""
                />
              </div>

              {/* 접수상태 */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">접수상태</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm bg-white min-w-[100px] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="all">전체</option>
                  <option value="accepting">접수중</option>
                  <option value="closed">접수마감</option>
                </select>
              </div>

              {/* 검색 버튼 */}
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded text-sm font-medium hover:bg-primary-light transition-colors"
              >
                검색
              </button>
            </div>
          </form>
        </div>

        {/* Course Type Legend */}
        {courseTypes.length > 0 && (
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            {courseTypes.map((t, i) => (
              <span key={t}>
                <span className="font-semibold text-gray-700">{t}</span>
                {i < courseTypes.length - 1 && ", "}
              </span>
            ))}
          </p>
        )}

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="px-4 py-3.5 text-center font-semibold whitespace-nowrap">교육구분</th>
                  <th className="px-4 py-3.5 text-center font-semibold whitespace-nowrap">구분</th>
                  <th className="px-4 py-3.5 text-center font-semibold">교육과정</th>
                  <th className="px-4 py-3.5 text-center font-semibold whitespace-nowrap">교육기간</th>
                  <th className="px-4 py-3.5 text-center font-semibold whitespace-nowrap">모집정원</th>
                  <th className="px-4 py-3.5 text-center font-semibold whitespace-nowrap">접수상태</th>
                  <th className="px-4 py-3.5 text-center font-semibold whitespace-nowrap">접수신청</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-gray-400">
                      등록된 교육과정이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5 text-center text-gray-700 whitespace-nowrap">
                        {c.category === "offline" ? "오프라인" : "온라인"}
                      </td>
                      <td className="px-4 py-3.5 text-center text-gray-700 whitespace-nowrap">
                        {c.course_type || "-"}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Link
                          href={`/courses/${c.id}`}
                          className="text-gray-900 hover:text-primary hover:underline transition-colors"
                        >
                          {c.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 text-center text-gray-600 whitespace-nowrap">
                        {formatDateRange(c.start_date, c.end_date)}
                      </td>
                      <td className="px-4 py-3.5 text-center text-gray-600 whitespace-nowrap">
                        {c.capacity}명
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {c.status === "accepting" ? (
                          <span className="text-primary font-semibold">접수중</span>
                        ) : (
                          <span className="text-gray-400 font-semibold">접수마감</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {c.status === "accepting" ? (
                          <button
                            onClick={() => handleEnroll(c.id)}
                            disabled={enrolling === c.id}
                            className="bg-gray-600 text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
                          >
                            {enrolling === c.id ? "처리중..." : "신청"}
                          </button>
                        ) : (
                          <span className="text-gray-300 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Result count */}
        {filtered.length > 0 && (
          <p className="mt-3 text-xs text-gray-400">
            총 {filtered.length}개의 교육과정
          </p>
        )}
      </div>
    </div>
  );
}
