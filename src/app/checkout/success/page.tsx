"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface VirtualAccount {
  accountNumber: string;
  bankCode: string;
  bank?: string;
  customerName: string;
  dueDate: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "paid" | "waiting" | "error">("loading");
  const [error, setError] = useState("");
  const [virtualAccount, setVirtualAccount] = useState<VirtualAccount | null>(null);

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    const courseId = searchParams.get("courseId");
    const buyerName = searchParams.get("buyerName");
    const buyerEmail = searchParams.get("buyerEmail");
    const buyerPhone = searchParams.get("buyerPhone");
    const organization = searchParams.get("organization");

    if (!paymentKey || !orderId || !amount || !courseId) {
      setStatus("error");
      setError("결제 정보가 누락되었습니다.");
      return;
    }

    fetch("/api/payments/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentKey, orderId, amount, courseId, buyerName, buyerEmail, buyerPhone, organization }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          if (d.status === "WAITING_FOR_DEPOSIT" && d.virtualAccount) {
            setVirtualAccount(d.virtualAccount);
            setStatus("waiting");
          } else {
            setStatus("paid");
          }
        } else {
          setStatus("error");
          setError(d.error || "결제 승인 실패");
        }
      })
      .catch(() => {
        setStatus("error");
        setError("서버 오류가 발생했습니다.");
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-6" />
            <p className="text-gray-500">결제를 처리하고 있습니다...</p>
          </>
        )}
        {status === "paid" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-50 flex items-center justify-center">
              <svg className="w-9 h-9 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">결제가 완료되었습니다</h1>
            <p className="text-gray-500 text-sm mb-8">교육신청이 확정되었습니다.<br />교육 일정에 맞춰 안내 메일을 발송해 드립니다.</p>
            <div className="flex flex-col gap-2">
              <Link href="/my-enrollments" className="bg-primary text-white py-3 rounded-lg font-medium text-sm hover:bg-primary-light transition-colors">
                교육신청 확인
              </Link>
              <Link href="/courses" className="text-gray-400 hover:text-gray-600 text-sm py-2 transition-colors">
                다른 교육과정 보기
              </Link>
            </div>
          </>
        )}
        {status === "waiting" && virtualAccount && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
              <svg className="w-9 h-9 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">가상계좌가 발급되었습니다</h1>
            <p className="text-gray-500 text-sm mb-6">아래 계좌로 입금해 주시면 교육신청이 확정됩니다.</p>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6 text-left">
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">은행</span>
                  <span className="font-semibold text-gray-900">{virtualAccount.bank || virtualAccount.bankCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">계좌번호</span>
                  <span className="font-semibold text-gray-900">{virtualAccount.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">예금주</span>
                  <span className="font-semibold text-gray-900">{virtualAccount.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">입금 마감</span>
                  <span className="font-semibold text-red-500">{new Date(virtualAccount.dueDate).toLocaleString("ko-KR")}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-3 mb-6">
              ⚠ 마감 시각까지 미입금 시 신청이 자동 취소됩니다.
            </p>
            <Link href="/my-enrollments" className="block bg-primary text-white py-3 rounded-lg font-medium text-sm hover:bg-primary-light transition-colors">
              교육신청 확인
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-9 h-9 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">결제 처리 실패</h1>
            <p className="text-gray-500 text-sm mb-8">{error}</p>
            <Link href="/courses" className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-primary-light transition-colors">
              교육과정 목록으로
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
