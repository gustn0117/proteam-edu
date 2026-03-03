"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    organization: "",
    phone: "",
    newsletter: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const set = (key: string, val: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (form.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
      {/* Branding Panel - Desktop */}
      <div className="hidden md:flex md:w-5/12 bg-primary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,168,78,0.15)_0%,transparent_60%)]" />
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-16 right-12 w-20 h-20 rounded-full bg-gold/10 animate-float blur-sm" />
        <div className="absolute bottom-24 left-16 w-14 h-14 rounded-full bg-accent/10 animate-float" style={{ animationDelay: "1s" }} />
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
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative">
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
            <h1 className="text-2xl font-bold text-primary">회원가입</h1>
            <p className="text-sm text-gray-400 mt-2">교육 신청을 위해 회원가입해주세요</p>
          </div>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">이름 <span className="text-red-400">*</span></label>
              <input type="text" required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일 <span className="text-red-400">*</span></label>
              <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호 <span className="text-red-400">*</span></label>
                <input type="password" required value={form.password} onChange={(e) => set("password", e.target.value)} className={inputCls} placeholder="6자 이상" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호 확인 <span className="text-red-400">*</span></label>
                <input type="password" required value={form.passwordConfirm} onChange={(e) => set("passwordConfirm", e.target.value)} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">소속</label>
              <input type="text" value={form.organization} onChange={(e) => set("organization", e.target.value)} className={inputCls} placeholder="회사 또는 기관명" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">휴대전화</label>
              <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} placeholder="010-0000-0000" />
            </div>
            <label className="flex items-center gap-2.5 text-sm text-gray-600 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={form.newsletter}
                onChange={(e) => set("newsletter", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
              />
              소식지를 받아 보시겠습니까?
            </label>
            <button
              type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-light transition-all disabled:opacity-50 shadow-sm hover:shadow-md hover:shadow-primary/10 active:scale-[0.98]"
            >
              {loading ? "가입 중..." : "회원가입"}
            </button>
            <p className="text-center text-sm text-gray-400">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline underline-offset-2">로그인</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
