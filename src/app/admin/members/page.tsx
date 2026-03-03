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
        <h2 className="text-lg font-bold text-gray-800">전체 가입회원 ({members.length}명)</h2>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="이름, 이메일, 소속 검색"
          className="px-4 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">이름</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">소속</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">이메일</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">휴대전화</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-600">소식지</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">가입일</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{m.name}</td>
                  <td className="px-4 py-3 text-gray-600">{m.organization || "-"}</td>
                  <td className="px-4 py-3 text-gray-600">{m.email}</td>
                  <td className="px-4 py-3 text-gray-600">{m.phone || "-"}</td>
                  <td className="px-4 py-3 text-center">
                    {m.newsletter ? (
                      <span className="text-green-600 text-xs">수신</span>
                    ) : (
                      <span className="text-gray-400 text-xs">미수신</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{m.created_at?.split("T")[0] || m.created_at?.split(" ")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
