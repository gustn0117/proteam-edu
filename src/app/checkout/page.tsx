"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";

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
  const [agreeTerms, setAgreeTerms] = useState(false);

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
    if (!agreeTerms) {
      alert("환불 정책에 동의해 주세요.");
      return;
    }
    if (!widgets || !course) return;

    const orderId = `proteam_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    try {
      await widgets.requestPayment({
        orderId,
        orderName: course.name,
        customerName: buyerName,
        customerEmail: buyerEmail,
        customerMobilePhone: buyerPhone.replace(/-/g, ""),
        successUrl: `${window.location.origin}/checkout/success?courseId=${course.id}&buyerName=${encodeURIComponent(buyerName)}&buyerEmail=${encodeURIComponent(buyerEmail)}&buyerPhone=${encodeURIComponent(buyerPhone)}&organization=${encodeURIComponent(organization)}`,
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
            {!user && <p className="text-xs text-gray-400 mt-1">비회원도 결제 가능합니다.</p>}
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">성함 *</label>
              <input type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">연락처 *</label>
              <input type="tel" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)}
                placeholder="010-1234-5678"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일 *</label>
              <input type="email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">소속 (선택)</label>
              <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
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
