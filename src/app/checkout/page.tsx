"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { isValidEmail, suggestEmailFix } from "@/lib/email";

const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "test_ck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

interface Course {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  duration: string;
  location: string;
  fee: number;
  status: string;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("courseId");

  const [course, setCourse] = useState<Course | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [widgets, setWidgets] = useState<any>(null);
  const [ready, setReady] = useState(false);

  // Buyer info (for guest checkout)
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [department, setDepartment] = useState("");
  const [patentNo, setPatentNo] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // 신청 내역은 이메일 기준으로 계정에 연결되므로, 오타가 나면 신청 내역이 다른 계정으로 갈라진다
  const emailSuggestion = suggestEmailFix(buyerEmail);

  // 010-XXXX-XXXX 자동 하이픈
  const formatPhone = (input: string) => {
    const digits = input.replace(/[^0-9]/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  useEffect(() => {
    if (!courseId) {
      router.push("/courses");
      return;
    }
    fetch(`/api/courses/${courseId}`)
      .then((r) => r.json())
      .then((d) => { if (d?.course) setCourse(d.course); })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d?.user) {
          setUser(d.user);
          setBuyerName(d.user.name || "");
          setBuyerEmail(d.user.email || "");
          setBuyerPhone(formatPhone(d.user.phone || ""));
          setOrganization(d.user.organization || "");
          setDepartment(d.user.department || "");
          setPatentNo(d.user.patent_no || "");
        }
      })
      .catch(() => {});
  }, [courseId, router]);

  useEffect(() => {
    if (!course || course.fee <= 0) return;
    (async () => {
      const tossPayments = await loadTossPayments(CLIENT_KEY);
      const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
      await widgets.setAmount({ currency: "KRW", value: course.fee });
      await Promise.all([
        widgets.renderPaymentMethods({ selector: "#payment-method", variantKey: "DEFAULT" }),
        widgets.renderAgreement({ selector: "#agreement", variantKey: "AGREEMENT" }),
      ]);
      setWidgets(widgets);
      setReady(true);
    })();
  }, [course]);

  const handlePay = async () => {
    if (!buyerName || !buyerEmail || !buyerPhone) {
      alert("성함, 이메일, 연락처를 모두 입력해 주세요.");
      return;
    }
    if (!isValidEmail(buyerEmail)) {
      alert("이메일 주소를 다시 확인해 주세요.");
      return;
    }
    if (emailSuggestion) {
      const ok = confirm(
        `입력하신 이메일 주소를 다시 확인해 주세요.\n\n입력: ${buyerEmail}\n혹시: ${emailSuggestion}\n\n신청 내역은 이메일 기준으로 관리되므로, 주소가 다르면 교육신청 확인 화면에서 내역이 보이지 않을 수 있습니다.\n\n입력하신 주소 그대로 결제를 진행할까요?`
      );
      if (!ok) return;
    }
    if (!organization.trim()) {
      alert("소속을 입력해 주세요.");
      return;
    }
    if (!agreeTerms) {
      alert("환불 정책에 동의해 주세요.");
      return;
    }
    if (!widgets || !course) return;

    const orderId = `proteam_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const successParams = new URLSearchParams({
      courseId: course.id,
      buyerName,
      buyerEmail,
      buyerPhone,
      organization,
      department,
      patentNo,
    });

    try {
      await widgets.requestPayment({
        orderId,
        orderName: course.name,
        customerName: buyerName,
        customerEmail: buyerEmail,
        customerMobilePhone: buyerPhone.replace(/-/g, ""),
        successUrl: `${window.location.origin}/checkout/success?${successParams.toString()}`,
        failUrl: `${window.location.origin}/checkout/fail`,
      });
    } catch (err: any) {
      if (err?.code === "USER_CANCEL") return;
      alert(`결제 중 오류가 발생했습니다: ${err?.message || "알 수 없는 오류"}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-500 mb-4">교육과정을 찾을 수 없습니다.</p>
        <Link href="/courses" className="text-primary underline">교육과정 목록으로</Link>
      </div>
    );
  }

  if (course.fee <= 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-500 mb-4">무료 교육과정은 결제가 필요하지 않습니다.</p>
        <Link href={`/courses/${course.id}`} className="text-primary underline">교육과정 상세로</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen py-10 md:py-14">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">결제하기</h1>

        {/* Order summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">주문 정보</h2>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">교육과정</span>
              <span className="text-gray-900 font-medium text-right max-w-md">{course.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">교육일정</span>
              <span className="text-gray-700">{course.start_date.replace(/-/g, ".")} ~ {course.end_date.replace(/-/g, ".")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">교육시간</span>
              <span className="text-gray-700">{course.duration}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">교육장소</span>
              <span className="text-gray-700">{course.location}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-100">
              <span className="text-gray-700 font-bold">결제 금액</span>
              <span className="text-2xl font-extrabold text-primary">{course.fee.toLocaleString()}<span className="text-base ml-1">원</span></span>
            </div>
          </div>
        </div>

        {/* Buyer info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">신청자 정보</h2>
          </div>
          {!user && (
            <div className="mx-6 mt-5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3.5 flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-0.5">이미 회원이시면 로그인 후 결제해 주세요.</p>
                <p className="text-blue-800/80 text-xs leading-relaxed">
                  비회원으로도 결제하실 수 있지만, 이메일을 다르게 입력하시면 신청 내역이 기존 계정과 따로 관리됩니다.{" "}
                  <Link href={`/login?redirect=${encodeURIComponent(`/checkout?courseId=${courseId ?? ""}`)}`}
                    className="font-bold underline underline-offset-2">로그인하기</Link>
                </p>
              </div>
            </div>
          )}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">성함 *</label>
              <input type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">연락처 *</label>
              <input type="tel" value={buyerPhone} onChange={(e) => setBuyerPhone(formatPhone(e.target.value))}
                placeholder="010-1234-5678" maxLength={13}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일 *</label>
              <input type="email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${emailSuggestion ? "border-amber-400 bg-amber-50/40" : "border-gray-200"}`} />
              {emailSuggestion ? (
                <p className="text-xs text-amber-700 mt-1.5">
                  혹시 <button type="button" onClick={() => setBuyerEmail(emailSuggestion)}
                    className="font-bold underline underline-offset-2 hover:text-amber-900">{emailSuggestion}</button> 아니신가요?
                  <span className="text-amber-600"> (눌러서 바로 수정)</span>
                </p>
              ) : (
                <p className="text-xs text-gray-400 mt-1.5">신청 내역 확인에 사용되는 주소입니다. 오타가 없는지 확인해 주세요.</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">소속 *</label>
              <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)}
                placeholder="회사명/기관명" required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">부서 (선택)</label>
              <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)}
                placeholder="부서명"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">변리사 등록번호 (의무연수 신청 시)</label>
              <input type="text" value={patentNo} onChange={(e) => setPatentNo(e.target.value)}
                placeholder="예) 12345"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
              <p className="text-xs text-gray-400 mt-1.5">대한변리사회 의무연수 인정을 위해 필요합니다. 해당되지 않으면 비워두셔도 됩니다.</p>
            </div>
          </div>
        </div>

        {/* Toss Payment Widgets */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">결제 수단</h2>
          </div>
          <div id="payment-method" />
          <div id="agreement" />
        </div>

        {/* Refund policy agreement */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-primary"
            />
            <div className="text-sm text-amber-900">
              <p className="font-bold mb-1">환불 규정 안내 동의 (필수)</p>
              <p className="leading-relaxed">
                교육시작 7일 전까지 100% 환불 / 2~7일 전 80% 환불 / 1~2일 전 50% 환불 / 교육시작 후 환불 불가.
                자세한 내용은 <Link href="/refund" target="_blank" className="underline font-semibold">취소 및 환불</Link> 페이지에서 확인할 수 있습니다.
              </p>
            </div>
          </label>
        </div>

        <button
          onClick={handlePay}
          disabled={!ready}
          className="w-full bg-gold text-primary-dark py-4 rounded-xl font-bold text-base hover:bg-gold-light transition-all disabled:opacity-50 shadow-md shadow-gold/25"
        >
          {ready ? `${course.fee.toLocaleString()}원 결제하기` : "결제창 준비 중..."}
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-24 text-center"><div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
