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
      .then((d) => setUser(d?.user || null))
      .catch(() => {});
  }, [pathname]);

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
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-primary-dark/95 backdrop-blur-md shadow-lg shadow-black/10"
          : "bg-primary"
      }`}
    >
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/30 to-transparent" />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-1.5 h-1.5 rounded-full bg-gold group-hover:scale-150 transition-transform duration-300" />
            <span className="text-lg font-bold tracking-tight text-white">
              프로앤팀 <span className="font-normal text-white/60 hidden sm:inline">교육센터</span>
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

          <nav className="hidden md:flex items-center gap-0.5">
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

const navIcons: Record<string, string> = {
  "/greeting": "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z",
  "/courses": "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  "/payment": "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z",
  "/my-enrollments": "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z",
  "/refund": "M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3",
  "/contact": "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z",
};

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
    { href: "/courses", label: "교육과정 및 신청" },
    { href: "/payment", label: "교육비용 납부" },
    { href: "/my-enrollments", label: "교육신청 확인" },
    { href: "/refund", label: "교육신청 취소 및 환불" },
    { href: "/contact", label: "연락처" },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  if (mobile) {
    return (
      <>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive(l.href)
                ? "bg-white/15 text-white font-medium"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <svg className={`w-4 h-4 shrink-0 ${isActive(l.href) ? "text-gold" : "text-white/30"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={navIcons[l.href]} />
            </svg>
            {l.label}
          </Link>
        ))}
        <div className="border-t border-white/10 mt-2 pt-2 flex flex-col gap-1">
          {user ? (
            <>
              <span className="px-3 py-2.5 text-white/50 text-xs">{user.name}님</span>
              <button onClick={logout} className="text-left px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors">로그인</Link>
              <Link href="/register" className="px-3 py-2.5 rounded-lg text-sm bg-gold/90 text-primary-dark font-semibold hover:bg-gold transition-colors">회원가입</Link>
            </>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`relative px-3 py-2 rounded-lg text-[15px] transition-all duration-200 ${
            isActive(l.href)
              ? "text-white font-medium"
              : "text-white/70 hover:text-white"
          }`}
        >
          {l.label}
          {isActive(l.href) && (
            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gold" />
          )}
        </Link>
      ))}

      <div className="flex items-center gap-1 ml-3 pl-3 border-l border-white/15">
        {user ? (
          <>
            <span className="px-3 py-2 text-white/50 text-xs">{user.name}님</span>
            <button onClick={logout} className="px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white transition-colors">
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white transition-colors">로그인</Link>
            <Link href="/register" className="px-3 py-2 rounded-lg text-sm bg-gold/90 text-primary-dark font-semibold hover:bg-gold hover:scale-105 transition-all">
              회원가입
            </Link>
          </>
        )}
      </div>
    </>
  );
}
