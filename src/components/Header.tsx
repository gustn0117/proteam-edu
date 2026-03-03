"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="bg-[#1a365d] text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold tracking-tight">
            ㈜프로앤팀 교육센터
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLinks user={user} logout={logout} />
          </nav>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-1">
            <NavLinks user={user} logout={logout} mobile />
          </nav>
        )}
      </div>
    </header>
  );
}

function NavLinks({ user, logout, mobile }: { user: User | null; logout: () => void; mobile?: boolean }) {
  const base = mobile
    ? "block px-3 py-2 rounded text-sm hover:bg-[#2a4a7f] transition"
    : "px-3 py-2 rounded text-sm hover:bg-[#2a4a7f] transition";

  return (
    <>
      <Link href="/greeting" className={base}>인사말</Link>
      <Link href="/courses" className={base}>교육 신청</Link>
      <Link href="/my-enrollments" className={base}>교육신청확인</Link>
      <Link href="/contact" className={base}>연락처</Link>

      {user?.role === "admin" && (
        <Link href="/admin/courses" className={`${base} text-yellow-300`}>관리자</Link>
      )}

      {user ? (
        <>
          <span className={`${base} text-blue-200 cursor-default`}>{user.name}님</span>
          <button onClick={logout} className={`${base} bg-[#2a4a7f]`}>로그아웃</button>
        </>
      ) : (
        <>
          <Link href="/login" className={`${base} bg-[#2a4a7f]`}>로그인</Link>
          <Link href="/register" className={`${base} bg-blue-600 hover:bg-blue-700`}>회원가입</Link>
        </>
      )}
    </>
  );
}
