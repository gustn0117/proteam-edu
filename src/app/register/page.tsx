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

  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-slate-50/50 placeholder:text-gray-300";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gold/90 flex items-center justify-center text-primary-dark font-black text-lg mx-auto mb-4">
            P
          </div>
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
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-light transition-colors disabled:opacity-50"
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
  );
}
