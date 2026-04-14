"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function FailContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "결제가 정상적으로 처리되지 않았습니다.";
  const code = searchParams.get("code");

  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
          <svg className="w-9 h-9 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">결제에 실패했습니다</h1>
        <p className="text-gray-500 text-sm mb-2">{message}</p>
        {code && <p className="text-xs text-gray-400 mb-8">에러 코드: {code}</p>}
        <div className="flex flex-col gap-2 mt-6">
          <Link href="/courses" className="bg-primary text-white py-3 rounded-lg font-medium text-sm hover:bg-primary-light transition-colors">
            교육과정 목록으로
          </Link>
          <Link href="/contact" className="text-gray-400 hover:text-gray-600 text-sm py-2 transition-colors">
            문의하기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>}>
      <FailContent />
    </Suspense>
  );
}
