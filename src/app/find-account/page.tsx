"use client";

import { useState } from "react";
import Link from "next/link";

export default function FindAccountPage() {
  const [tab, setTab] = useState<"id" | "pw">("id");

  // Find ID state
  const [idName, setIdName] = useState("");
  const [idPhone, setIdPhone] = useState("");
  const [foundEmail, setFoundEmail] = useState("");
  const [idError, setIdError] = useState("");
  const [idLoading, setIdLoading] = useState(false);

  // Reset PW state
  const [pwName, setPwName] = useState("");
  const [pwEmail, setPwEmail] = useState("");
  const [tempPw, setTempPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const handleFindId = async (e: React.FormEvent) => {
    e.preventDefault();
    setIdError("");
    setFoundEmail("");
    setIdLoading(true);
    try {
      const res = await fetch("/api/auth/find-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: idName, phone: idPhone }),
      });
      const data = await res.json();
      if (!res.ok) { setIdError(data.error); return; }
      setFoundEmail(data.email);
    } catch {
      setIdError("요청 중 오류가 발생했습니다.");
    } finally {
      setIdLoading(false);
    }
  };

  const handleResetPw = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setTempPw("");
    setPwLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: pwName, email: pwEmail }),
      });
      const data = await res.json();
      if (!res.ok) { setPwError(data.error); return; }
      setTempPw(data.tempPassword);
    } catch {
      setPwError("요청 중 오류가 발생했습니다.");
    } finally {
      setPwLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all duration-200 bg-slate-50/50 placeholder:text-gray-300 hover:border-gray-300";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 relative">
      <div className="absolute inset-0 pattern-grid opacity-50" />
      <div className="relative w-full max-w-md animate-fade-in-right">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">아이디 / 비밀번호 찾기</h1>
          <p className="text-sm text-gray-400 mt-2">가입 시 등록한 정보를 입력해주세요</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-1 bg-linear-to-r from-primary via-gold to-primary-light" />

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => { setTab("id"); setFoundEmail(""); setIdError(""); }}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${tab === "id" ? "text-primary border-b-2 border-primary" : "text-gray-400 hover:text-gray-600"}`}
            >
              아이디 찾기
            </button>
            <button
              onClick={() => { setTab("pw"); setTempPw(""); setPwError(""); }}
              className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${tab === "pw" ? "text-primary border-b-2 border-primary" : "text-gray-400 hover:text-gray-600"}`}
            >
              비밀번호 찾기
            </button>
          </div>

          <div className="p-8">
            {tab === "id" ? (
              foundEmail ? (
                <div className="text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                    <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">회원님의 아이디(이메일)는</p>
                    <p className="text-lg font-bold text-primary">{foundEmail}</p>
                    <p className="text-xs text-gray-400 mt-1">보안을 위해 일부가 가려져 있습니다.</p>
                  </div>
                  <Link
                    href="/login"
                    className="inline-block w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-light transition-all text-center"
                  >
                    로그인하기
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleFindId} className="space-y-5">
                  {idError && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                      {idError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
                    <input type="text" value={idName} onChange={(e) => setIdName(e.target.value)} required className={inputCls} placeholder="이름 입력" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">휴대폰 번호</label>
                    <input type="tel" value={idPhone} onChange={(e) => setIdPhone(e.target.value)} required className={inputCls} placeholder="010-0000-0000" />
                  </div>
                  <button type="submit" disabled={idLoading} className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-light transition-all disabled:opacity-50">
                    {idLoading ? "조회 중..." : "아이디 찾기"}
                  </button>
                </form>
              )
            ) : (
              tempPw ? (
                <div className="text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                    <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">임시 비밀번호가 발급되었습니다.</p>
                    <div className="bg-slate-50 border border-gray-200 rounded-xl px-4 py-3">
                      <p className="text-lg font-mono font-bold text-primary tracking-wider">{tempPw}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">로그인 후 반드시 비밀번호를 변경해주세요.</p>
                  </div>
                  <Link
                    href="/login"
                    className="inline-block w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-light transition-all text-center"
                  >
                    로그인하기
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleResetPw} className="space-y-5">
                  {pwError && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                      {pwError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
                    <input type="text" value={pwName} onChange={(e) => setPwName(e.target.value)} required className={inputCls} placeholder="이름 입력" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
                    <input type="email" value={pwEmail} onChange={(e) => setPwEmail(e.target.value)} required className={inputCls} placeholder="example@email.com" />
                  </div>
                  <button type="submit" disabled={pwLoading} className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-light transition-all disabled:opacity-50">
                    {pwLoading ? "처리 중..." : "임시 비밀번호 발급"}
                  </button>
                </form>
              )
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          <Link href="/login" className="text-primary font-medium hover:underline underline-offset-2">로그인으로 돌아가기</Link>
        </p>
      </div>
    </div>
  );
}
