import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white/50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-md bg-gold/80 flex items-center justify-center text-primary-dark font-black text-xs">
                P
              </div>
              <span className="text-white font-bold">프로앤팀 교육센터</span>
            </div>
            <p className="text-sm leading-relaxed">
              기업 업무 실무자들의 역량을 강화하여,<br />
              한국의 국가 경쟁력을 높이고자 합니다.
            </p>
          </div>

          <div>
            <h3 className="text-white/80 font-semibold text-sm mb-4 uppercase tracking-wider">메뉴</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/greeting" className="hover:text-white transition-colors">인사말</Link></li>
              <li><Link href="/courses" className="hover:text-white transition-colors">교육 신청</Link></li>
              <li><Link href="/my-enrollments" className="hover:text-white transition-colors">교육신청확인</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">연락처</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white/80 font-semibold text-sm mb-4 uppercase tracking-wider">연락처</h3>
            <ul className="space-y-2.5 text-sm">
              <li>edu@proteambiz.com</li>
              <li>02-0000-0000</li>
              <li>서울특별시</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-xs text-center">
          &copy; {new Date().getFullYear()} ㈜프로앤팀. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
