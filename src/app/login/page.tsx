"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 relative">
      <div className="absolute inset-0 pattern-dots opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-64 bg-linear-to-b from-primary/2 to-transparent" />
      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gold/90 flex items-center justify-center text-primary-dark font-black text-lg mx-auto mb-4">
            P
          </div>
          <h1 className="text-2xl font-bold text-primary">로그인</h1>
          <p className="text-sm text-gray-400 mt-2">프로앤팀 교육센터에 오신 것을 환영합니다</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputCls}
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputCls}
              placeholder="비밀번호 입력"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-light transition-all disabled:opacity-50 shadow-sm hover:shadow-md hover:shadow-primary/10 active:scale-[0.98]"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
          <p className="text-center text-sm text-gray-400">
            계정이 없으신가요?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline underline-offset-2">회원가입</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
