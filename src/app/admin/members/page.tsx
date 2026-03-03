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

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/members").then((r) => r.json()).then((d) => setMembers(d.members));
  }, []);

  const filtered = members.filter(
    (m) =>
      m.name.includes(search) ||
      m.email.includes(search) ||
      m.organization.includes(search)
  );

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
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">이름</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">소속</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">이메일</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">휴대전화</th>
                <th className="px-5 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">소식지</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">가입일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
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
                  <td className="px-5 py-4 text-gray-500">{m.created_at?.split("T")[0] || m.created_at?.split(" ")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
