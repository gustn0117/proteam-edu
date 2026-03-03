"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-primary-dark/95 backdrop-blur-md shadow-lg shadow-black/10"
          : "bg-primary"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="text-lg font-bold tracking-tight text-white">
              프로앤팀 <span className="font-normal text-white/70 hidden sm:inline">교육센터</span>
            </span>
          </Link>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="메뉴"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            <NavLinks user={user} logout={logout} pathname={pathname} />
          </nav>
        </div>

        {menuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-1 animate-slide-down border-t border-white/10 pt-3">
            <NavLinks user={user} logout={logout} pathname={pathname} mobile />
          </nav>
        )}
      </div>
    </header>
  );
}

function NavLinks({
  user,
  logout,
  pathname,
  mobile,
}: {
  user: User | null;
  logout: () => void;
  pathname: string;
  mobile?: boolean;
}) {
  const links = [
    { href: "/greeting", label: "인사말" },
    { href: "/courses", label: "교육 신청" },
    { href: "/my-enrollments", label: "교육신청확인" },
    { href: "/contact", label: "연락처" },
  ];

  const base = mobile
    ? "block px-3 py-2.5 rounded-lg text-sm transition-colors"
    : "px-3 py-2 rounded-lg text-sm transition-colors";

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`${base} ${
            isActive(l.href)
              ? "bg-white/15 text-white font-medium"
              : "text-white/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          {l.label}
        </Link>
      ))}

      {user?.role === "admin" && (
        <Link
          href="/admin/courses"
          className={`${base} text-gold-light hover:bg-white/10 font-medium`}
        >
          관리자
        </Link>
      )}

      <div className={mobile ? "border-t border-white/10 mt-2 pt-2 flex flex-col gap-1" : "flex items-center gap-1 ml-2 pl-2 border-l border-white/15"}>
        {user ? (
          <>
            <span className={`${base} text-white/60 cursor-default text-xs`}>
              {user.name}님
            </span>
            <button
              onClick={logout}
              className={`${base} text-white/70 hover:bg-white/10 hover:text-white`}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={`${base} text-white/80 hover:bg-white/10 hover:text-white`}>
              로그인
            </Link>
            <Link
              href="/register"
              className={`${base} bg-gold/90 text-primary-dark font-semibold hover:bg-gold`}
            >
              회원가입
            </Link>
          </>
        )}
      </div>
    </>
  );
}
