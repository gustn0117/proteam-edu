export default function ContactPage() {
  return (
    <div>
      <section className="bg-primary pt-16 pb-24 md:pt-20 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,168,78,0.1)_0%,transparent_60%)]" />
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-semibold text-gold uppercase tracking-widest mb-3">Contact</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">연락처</h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/20 to-transparent" />
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-14 relative z-10 pb-20">
        {/* Contact Cards */}
        <div className="grid sm:grid-cols-3 gap-5 mb-6 animate-fade-in-up">
          <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="h-1 bg-primary" />
            <div className="p-6 md:p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary/5 to-primary/10 text-primary flex items-center justify-center mx-auto mb-4 group-hover:from-gold/10 group-hover:to-gold/20 group-hover:text-gold transition-all duration-300">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
              </div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">전화</p>
              <p className="text-base font-bold text-gray-900">02-0000-0000</p>
            </div>
          </div>
          <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="h-1 bg-gold" />
            <div className="p-6 md:p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary/5 to-primary/10 text-primary flex items-center justify-center mx-auto mb-4 group-hover:from-gold/10 group-hover:to-gold/20 group-hover:text-gold transition-all duration-300">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
              </div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">이메일</p>
              <p className="text-base font-bold text-gray-900">edu@proteambiz.com</p>
            </div>
          </div>
          <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="h-1 bg-accent" />
            <div className="p-6 md:p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary/5 to-primary/10 text-primary flex items-center justify-center mx-auto mb-4 group-hover:from-gold/10 group-hover:to-gold/20 group-hover:text-gold transition-all duration-300">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
              </div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">주소</p>
              <p className="text-base font-bold text-gray-900">서울특별시</p>
            </div>
          </div>
        </div>

        {/* Payment Info - Separate Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="p-8 md:p-10">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
              결제 안내
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-gold/20 transition-colors">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">계좌이체</p>
                <p className="text-sm text-gray-600 leading-relaxed">국민 829-01-0308-009<br />㈜프로앤팀</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-gold/20 transition-colors">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">계산서 발급</p>
                <p className="text-sm text-gray-600 leading-relaxed">사업자등록증 사본, 담당자 메일, 연락처를 edu@proteambiz.com으로 송부</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-gold/20 transition-colors">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">현금영수증</p>
                <p className="text-sm text-gray-600 leading-relaxed">국세청에 등록된 핸드폰 번호 송부</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
