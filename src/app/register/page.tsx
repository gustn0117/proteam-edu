"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const set = (key: string, val: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreeTerms || !agreePrivacy) {
      setError("이용약관 및 개인정보처리방침에 동의해주세요.");
      return;
    }

    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (form.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      router.push("/courses");
      router.refresh();
    } catch {
      setError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all duration-200 bg-slate-50/50 placeholder:text-gray-300 hover:border-gray-300";

  return (
    <div className="min-h-[80vh] flex">
      {/* Branding Panel with Unsplash image */}
      <div className="hidden md:flex md:w-5/12 relative overflow-hidden items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&q=80"
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
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-1 bg-linear-to-r from-primary via-gold to-primary-light" />
            <div className="p-8 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">이름 <span className="text-red-400">*</span></label>
              <div className="relative">
                <svg className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                <input type="text" required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls + " pl-10"} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일 <span className="text-red-400">*</span></label>
              <div className="relative">
                <svg className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls + " pl-10"} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호 <span className="text-red-400">*</span></label>
                <div className="relative">
                  <svg className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                  <input type="password" required value={form.password} onChange={(e) => set("password", e.target.value)} className={inputCls + " pl-10"} placeholder="6자 이상" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호 확인 <span className="text-red-400">*</span></label>
                <div className="relative">
                  <svg className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                  <input type="password" required value={form.passwordConfirm} onChange={(e) => set("passwordConfirm", e.target.value)} className={inputCls + " pl-10"} />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">소속</label>
              <div className="relative">
                <svg className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
                <input type="text" value={form.organization} onChange={(e) => set("organization", e.target.value)} className={inputCls + " pl-10"} placeholder="회사 또는 기관명" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">휴대전화</label>
              <div className="relative">
                <svg className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
                <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls + " pl-10"} placeholder="010-0000-0000" />
              </div>
            </div>
            {/* Agreement section */}
            <div className="space-y-2 border border-gray-200 rounded-xl p-4 bg-gray-50/50">
              <label className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms && agreePrivacy}
                  onChange={(e) => { setAgreeTerms(e.target.checked); setAgreePrivacy(e.target.checked); }}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                />
                <span className="font-semibold">전체 동의</span>
              </label>
              <div className="border-t border-gray-200 pt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                    />
                    이용약관 동의 <span className="text-red-400">(필수)</span>
                  </label>
                  <button type="button" onClick={() => setShowTerms(true)} className="text-xs text-gray-400 hover:text-primary underline">내용보기</button>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreePrivacy}
                      onChange={(e) => setAgreePrivacy(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                    />
                    개인정보 수집 및 이용 동의 <span className="text-red-400">(필수)</span>
                  </label>
                  <button type="button" onClick={() => setShowPrivacy(true)} className="text-xs text-gray-400 hover:text-primary underline">내용보기</button>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.newsletter}
                      onChange={(e) => set("newsletter", e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                    />
                    교육 소식지 수신 동의 <span className="text-gray-400">(선택)</span>
                  </label>
                </div>
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-light transition-all disabled:opacity-50 shadow-sm hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98]"
            >
              {loading ? "가입 중..." : "회원가입"}
            </button>
            <p className="text-center text-sm text-gray-400">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline underline-offset-2">로그인</Link>
            </p>
            </div>
          </form>
        </div>
      </div>

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowTerms(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">이용약관</h3>
              <button onClick={() => setShowTerms(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh] text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{TERMS_TEXT}</div>
            <div className="px-6 py-4 border-t border-gray-200 text-right">
              <button onClick={() => { setAgreeTerms(true); setShowTerms(false); }} className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-light transition-colors">동의</button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPrivacy(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">개인정보 수집 및 이용 동의</h3>
              <button onClick={() => setShowPrivacy(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh] text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{PRIVACY_TEXT}</div>
            <div className="px-6 py-4 border-t border-gray-200 text-right">
              <button onClick={() => { setAgreePrivacy(true); setShowPrivacy(false); }} className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-light transition-colors">동의</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const TERMS_TEXT = `[제 1 장 총 칙]

제1조 목 적

본 약관은 ㈜프로앤팀(이하 '회사')이 제공하는 교육센터 서비스(이하 '서비스')의 이용조건 및 절차에 관해 규정함을 목적으로 합니다.

제2조 약관의 효력과 변경
(1) 약관은 이용자에게 공시함으로써 효력을 발생합니다.
(2) 회사는 사정 변경의 경우와 영업상 중요 사유가 있을 때 약관을 변경할 수 있으며, 변경된 약관은 전항과 같은 방법으로 효력을 발생합니다.

제3조 약관 외 준칙
이 약관에 명시되지 않은 사항이 관계법령에 규정되어 있을 경우에는 그 규정에 따릅니다.

[제 2 장 회원 가입과 서비스 이용]

제4조 이용 계약의 성립
(1) 이용계약은 이용자의 이용 신청에 대한 회사의 이용 승낙과 이용자의 약관 내용에 대한 동의로 성립됩니다.
(2) 회원에 가입하여 서비스를 이용하고자 하는 희망자는 회사에서 요청하는 개인 신상정보를 제공해야 합니다.

제5조 서비스 이용
(1) 서비스 이용은 회사의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴, 1일 24시간을 원칙으로 합니다.
(2) 전항의 서비스 이용시간은 정기점검 등의 필요에 의하여 회사가 정한 날 또는 시간에는 예외로 합니다.

제6조 서비스 내용 변경
회사는 서비스의 내용을 변경할 수 있으며, 변경 사항은 서비스 내 공지사항을 통해 공지합니다.

[제 3 장 의무 및 책임]

제7조 회사의 의무
회사는 서비스 제공과 관련하여 취득한 회원의 개인정보를 본인의 승낙 없이 타인에게 누설 또는 배포할 수 없습니다.

제8조 회원의 의무
(1) 회원은 서비스를 이용할 때 다음 각 호의 행위를 하여서는 안됩니다.
  ① 다른 회원의 ID를 부정하게 사용하는 행위
  ② 서비스에서 얻은 정보를 회사의 사전 승낙 없이 회원의 이용 이외의 목적으로 복제하거나, 이를 출판 및 방송 등에 사용하거나, 제3자에게 제공하는 행위
  ③ 회사의 저작권, 제3자의 저작권 등 기타 권리를 침해하는 행위
  ④ 공공질서 및 미풍양속에 위반되는 내용의 정보, 문장, 도형 등을 타인에게 유포하는 행위
(2) 회원은 서비스 이용을 위해 등록한 정보에 변경사항이 있을 경우 즉시 갱신하여야 합니다.`;

const PRIVACY_TEXT = `㈜프로앤팀(이하 '회사')은 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.

1. 수집하는 개인정보 항목
회사는 회원가입, 교육신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.

  - 필수항목: 이름, 이메일, 비밀번호
  - 선택항목: 소속(회사/기관명), 휴대전화번호

2. 개인정보의 수집 및 이용목적
회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.

  - 회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인식별, 불량회원의 부정이용 방지
  - 교육 서비스 제공: 교육 신청 접수, 수강 관리, 수료증 발급
  - 고객 서비스: 교육 관련 공지사항 전달, 불만처리 등 민원처리
  - 마케팅 활용: 신규 교육과정 안내 및 이벤트 정보 제공 (동의한 경우에 한함)

3. 개인정보의 보유 및 이용기간
회원의 개인정보는 회원 탈퇴 시까지 보유하며, 탈퇴 즉시 파기합니다.
단, 관계 법령의 규정에 의하여 보존할 필요가 있는 경우 아래와 같이 관계 법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.

  - 계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)
  - 대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)

4. 개인정보의 파기절차 및 방법
회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.

  - 전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.

5. 개인정보의 제3자 제공
회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.

  - 이용자가 사전에 동의한 경우
  - 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우

6. 개인정보 보호책임자
회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고 있습니다.

  - 담당부서: 교육사업부
  - 이메일: edu@proteamip.com
  - 전화: 02-6677-3868

7. 개인정보처리방침의 변경
이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.`;
