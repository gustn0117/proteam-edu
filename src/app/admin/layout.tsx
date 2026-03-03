"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin/courses", label: "교육과정 관리" },
    { href: "/admin/enrollments", label: "수강신청 현황" },
    { href: "/admin/members", label: "회원 관리" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1a365d]">관리자</h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline">&larr; 사이트로 돌아가기</Link>
      </div>
      <nav className="flex gap-1 mb-8 border-b">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition ${
              pathname.startsWith(l.href)
                ? "bg-white border border-b-white text-[#1a365d] -mb-px"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
