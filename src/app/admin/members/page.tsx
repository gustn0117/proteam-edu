"use client";

import { useEffect, useState } from "react";

interface Member {
  id: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  newsletter: number;
  created_at: string;
}

interface MemberEnrollment {
  id: string;
  course_name: string;
  start_date: string;
  end_date: string;
  fee: number;
  payment_status: string;
  enrollment_status: string;
  created_at: string;
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [enrollments, setEnrollments] = useState<Record<string, MemberEnrollment[]>>({});
  const [loadingEnrollments, setLoadingEnrollments] = useState<string | null>(null);

  const load = () => {
    fetch("/api/admin/members").then((r) => r.json()).then((d) => { if (d?.members) setMembers(d.members); }).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const toggleExpand = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (!enrollments[id]) {
      setLoadingEnrollments(id);
      fetch(`/api/admin/members/${id}/enrollments`)
        .then((r) => r.json())
        .then((d) => {
          if (d?.enrollments) setEnrollments((prev) => ({ ...prev, [id]: d.enrollments }));
        })
        .catch(() => {})
        .finally(() => setLoadingEnrollments(null));
    }
  };

  const deleteMember = async (id: string, name: string) => {
    if (!confirm(`"${name}" 회원을 삭제하시겠습니까? 관련 수강 신청도 모두 삭제됩니다.`)) return;
    await fetch(`/api/admin/members/${id}`, { method: "DELETE" });
    load();
    if (expandedId === id) setExpandedId(null);
  };

  const filtered = members.filter(
    (m) =>
      m.name.includes(search) ||
      m.email.includes(search) ||
      (m.organization || "").includes(search)
  );

  const formatDate = (d: string) => {
    if (!d) return "-";
    const date = d.split("T")[0] || d.split(" ")[0];
    return date?.replace(/-/g, ".");
  };

  const statusLabel = (s: string) => {
    switch (s) {
      case "pending": return { text: "대기중", cls: "bg-amber-50 text-amber-700" };
      case "confirmed": return { text: "완료", cls: "bg-emerald-50 text-emerald-700" };
      case "cancelled": return { text: "취소됨", cls: "bg-gray-50 text-gray-500" };
      case "refund_requested": return { text: "환불신청", cls: "bg-orange-50 text-orange-600" };
      default: return { text: s, cls: "bg-gray-50 text-gray-500" };
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">
          전체 가입회원 <span className="text-sm font-medium text-gray-400">({members.length}명)</span>
        </h2>
        <div className="relative">
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름, 이메일, 소속 검색"
            className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50/50"
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">전체 회원</p>
          <p className="text-2xl font-bold text-primary">{members.length}명</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">소식지 수신</p>
          <p className="text-2xl font-bold text-emerald-600">{members.filter(m => m.newsletter).length}명</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-1">소속 기관</p>
          <p className="text-2xl font-bold text-gold">{new Set(members.filter(m => m.organization).map(m => m.organization)).size}개</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100">
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-8"></th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">이름</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">소속</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">이메일</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">휴대전화</th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">소식지</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">가입일</th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">삭제</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((m) => (
                <>
                  <tr key={m.id} className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${expandedId === m.id ? "bg-slate-50/50" : ""}`}
                    onClick={() => toggleExpand(m.id)}>
                    <td className="pl-5 py-4">
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedId === m.id ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">{m.name}</td>
                    <td className="px-5 py-4 text-gray-500">{m.organization || "-"}</td>
                    <td className="px-5 py-4 text-gray-500">{m.email}</td>
                    <td className="px-5 py-4 text-gray-500">{m.phone || "-"}</td>
                    <td className="px-5 py-4 text-center">
                      {m.newsletter ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">수신</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-400 ring-1 ring-gray-400/10">미수신</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-500">{formatDate(m.created_at)}</td>
                    <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => deleteMember(m.id, m.name)}
                        className="text-red-400 hover:text-red-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                  {expandedId === m.id && (
                    <tr key={`${m.id}-detail`}>
                      <td colSpan={8} className="px-5 py-4 bg-slate-50/80">
                        <div className="pl-8">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">수강 이력</p>
                          {loadingEnrollments === m.id ? (
                            <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
                              <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                              로딩 중...
                            </div>
                          ) : (enrollments[m.id]?.length || 0) === 0 ? (
                            <p className="text-gray-400 text-sm py-2">수강 이력이 없습니다.</p>
                          ) : (
                            <div className="space-y-2">
                              {enrollments[m.id]?.map((e) => {
                                const st = statusLabel(e.enrollment_status);
                                return (
                                  <div key={e.id} className="flex items-center gap-4 bg-white rounded-lg px-4 py-2.5 border border-gray-100">
                                    <span className="font-medium text-gray-900 text-sm flex-1">{e.course_name}</span>
                                    <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(e.start_date)} ~ {formatDate(e.end_date)}</span>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">{e.fee > 0 ? `${e.fee.toLocaleString()}원` : "무료"}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${e.payment_status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-500"}`}>
                                      {e.payment_status === "paid" ? "결제완료" : "미완료"}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${st.cls}`}>{st.text}</span>
                                    <span className="text-xs text-gray-400">{formatDate(e.created_at)}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
