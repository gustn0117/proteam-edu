import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white/50 mt-auto relative">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-12 bg-linear-to-b from-gold/5 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-white font-bold text-lg">프로앤팀 교육센터</span>
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-dot" />
            </div>
            <p className="text-sm leading-relaxed mb-5">
              기업 업무 실무자들의 역량을 강화하여,<br />
              한국의 국가 경쟁력을 높이고자 합니다.
            </p>
            {/* Contact icons */}
            <div className="flex items-center gap-3">
              <a href="mailto:edu@proteamip.com" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-gold hover:bg-gold/10 hover:scale-110 transition-all duration-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </a>
              <a href="tel:02-6677-3868" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-gold hover:bg-gold/10 hover:scale-110 transition-all duration-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white/80 font-semibold text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-0.5 bg-gold/60 rounded-full" />
              메뉴
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/greeting" className="hover:text-white transition-colors group inline-flex items-center gap-1.5">
                  <span className="w-0 group-hover:w-3 transition-all overflow-hidden">
                    <svg className="w-3 h-3 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </span>
                  인사말
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-white transition-colors group inline-flex items-center gap-1.5">
                  <span className="w-0 group-hover:w-3 transition-all overflow-hidden">
                    <svg className="w-3 h-3 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </span>
                  교육과정 및 신청
                </Link>
              </li>
              <li>
                <Link href="/payment" className="hover:text-white transition-colors group inline-flex items-center gap-1.5">
                  <span className="w-0 group-hover:w-3 transition-all overflow-hidden">
                    <svg className="w-3 h-3 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </span>
                  교육비용 결제
                </Link>
              </li>
              <li>
                <Link href="/my-enrollments" className="hover:text-white transition-colors group inline-flex items-center gap-1.5">
                  <span className="w-0 group-hover:w-3 transition-all overflow-hidden">
                    <svg className="w-3 h-3 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </span>
                  교육신청 확인
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-white transition-colors group inline-flex items-center gap-1.5">
                  <span className="w-0 group-hover:w-3 transition-all overflow-hidden">
                    <svg className="w-3 h-3 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </span>
                  교육신청 취소 및 환불
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors group inline-flex items-center gap-1.5">
                  <span className="w-0 group-hover:w-3 transition-all overflow-hidden">
                    <svg className="w-3 h-3 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </span>
                  연락처
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white/80 font-semibold text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-0.5 bg-gold/60 rounded-full" />
              연락처
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2.5 group">
                <svg className="w-4 h-4 text-gold/50 shrink-0 group-hover:text-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span className="group-hover:text-white/70 transition-colors">edu@proteamip.com</span>
              </li>
              <li className="flex items-center gap-2.5 group">
                <svg className="w-4 h-4 text-gold/50 shrink-0 group-hover:text-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <span className="group-hover:text-white/70 transition-colors">02-6677-3868</span>
              </li>
              <li className="flex items-center gap-2.5 group">
                <svg className="w-4 h-4 text-gold/50 shrink-0 group-hover:text-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="group-hover:text-white/70 transition-colors">서울시 강남구 선릉로 529, 5층 5302호</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Gold gradient divider instead of plain border */}
        <div className="divider-gold mt-10 mb-6" />
        <div className="text-xs text-center text-white/30">
          &copy; {new Date().getFullYear()} ㈜프로앤팀. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
