import Image from "next/image";
import Link from "next/link";

export default function PaymentPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&q=80"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/85" />
          <div className="absolute inset-0 bg-linear-to-b from-primary/30 via-transparent to-primary/50" />
        </div>
        <div className="absolute inset-0 pattern-dots opacity-15" />
        <div className="relative pt-16 pb-24 md:pt-20 md:pb-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-sm font-semibold text-gold uppercase tracking-widest mb-3">Payment</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">교육비용 결제</h1>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/20 to-transparent" />
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-14 relative z-10 pb-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
          <div className="p-8 md:p-10">
            <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
              결제 안내
            </h2>

            <p className="text-gray-500 text-sm mb-6">
              교육비용 결제는 아래 두 가지 방법으로 가능합니다. 교육과정 페이지에서 원하는 과정을 선택하신 후,
              결제창에서 신용카드 또는 가상계좌를 선택하실 수 있습니다.
            </p>

            <div className="space-y-5">
              {/* 신용카드 결제 */}
              <div className="bg-linear-to-br from-primary/5 to-gold/5 rounded-xl p-6 border border-gold/20">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-gold text-primary-dark text-sm font-bold flex items-center justify-center">1</span>
                  <h3 className="text-base font-bold text-primary">신용카드 결제</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-2">
                  PG사(토스페이먼츠)를 통해 결제됩니다. 결제 완료와 동시에 교육신청이 확정됩니다.
                </p>
                <p className="text-sm text-red-500 font-medium">
                  ※ 신용카드 결제 시 현금영수증 및 세금계산서의 발행이 불가합니다.
                </p>
              </div>

              {/* 가상계좌 */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">2</span>
                  <h3 className="text-base font-bold text-primary">가상계좌 입금</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-3">
                  PG사(토스페이먼츠)를 통해 발급된 가상계좌로 입금하시면, 입금 확인 후 교육신청이 확정됩니다.
                </p>
                <ul className="space-y-1.5 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/60 mt-1.5 shrink-0" />
                    <span><span className="font-semibold text-gray-700">현금영수증:</span> 결제창에서 선택 시, 입금 확인 후 국세청에 자동 발행됩니다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/60 mt-1.5 shrink-0" />
                    <span><span className="font-semibold text-gray-700">세금계산서:</span> 결제창에서 사업자 정보 입력 시, 전자세금계산서가 자동 발행됩니다.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 결제하러 가기 */}
            <div className="mt-8 text-center">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 bg-gold text-primary-dark px-6 py-3 rounded-xl font-semibold hover:bg-gold-light transition-all shadow-sm hover:shadow-md shadow-gold/20"
              >
                교육과정 보러가기
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            {/* 서비스 제공 및 환불 정책 */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">서비스 제공 및 환불 안내</h3>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 space-y-3">
                <div>
                  <p className="text-sm font-bold text-amber-900 mb-1">서비스 제공 방식</p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    본 교육 서비스는 비실물(서비스) 상품으로, 결제 완료 후 신청하신 교육과정의 일정에 따라 오프라인/온라인으로 제공됩니다.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-900 mb-1">환불 정책</p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    교육시작 7일 전까지 100% 환불, 2~7일 전 80% 환불, 1~2일 전 50% 환불, 교육시작 후 환불 불가.
                    자세한 내용은 <Link href="/refund" className="underline font-semibold">취소 및 환불</Link> 페이지를 참고해 주세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
