"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/courses");
    router.refresh();
  };

  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all duration-200 bg-slate-50/50 placeholder:text-gray-300 hover:border-gray-300";

  return (
    <div className="min-h-[80vh] flex">
      {/* Branding Panel with Unsplash image */}
      <div className="hidden md:flex md:w-5/12 relative overflow-hidden items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="absolute inset-0 bg-linear-to-b from-primary/20 via-transparent to-primary/40" />
        <div className="relative text-center px-10 animate-fade-in-left">
          <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-gold/20">
            <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">프로앤팀 교육센터</h2>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            기업 업무 실무자들의 역량을 강화하여,<br />
            한국의 국가 경쟁력을 높이고자 합니다.
          </p>
          <div className="flex items-center justify-center gap-4 text-white/30 text-xs">
            <span>500+ 수료생</span>
            <div className="w-1 h-1 rounded-full bg-gold/40" />
            <span>50+ 교육과정</span>
            <div className="w-1 h-1 rounded-full bg-gold/40" />
            <span>98% 만족도</span>
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-16 relative">
        <div className="absolute inset-0 pattern-grid opacity-50" />
        <div className="relative w-full max-w-md animate-fade-in-right">
          {/* Mobile branding */}
          <div className="md:hidden text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-primary/5 rounded-full px-4 py-2">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
              </svg>
              <span className="text-sm font-semibold text-primary">프로앤팀 교육센터</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary">로그인</h1>
            <p className="text-sm text-gray-400 mt-2">교육 신청을 위해 로그인해주세요</p>
          </div>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-1 bg-linear-to-r from-primary via-gold to-primary-light" />
            <div className="p-8 space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
              <div className="relative">
                <svg className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls + " pl-10"} placeholder="example@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호</label>
              <div className="relative">
                <svg className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputCls + " pl-10"} placeholder="비밀번호 입력" />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-light transition-all disabled:opacity-50 shadow-sm hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98]"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
            <p className="text-center text-sm text-gray-400">
              계정이 없으신가요?{" "}
              <Link href="/register" className="text-primary font-medium hover:underline underline-offset-2">회원가입</Link>
            </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
