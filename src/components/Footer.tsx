export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white/50 mt-auto relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="text-center text-sm text-white/40 space-y-1.5">
          <p>
            <span className="text-white/60 font-medium">프로앤팀 주식회사</span>
            <span className="mx-2 text-white/20">|</span>
            대표 이승헌, 권오진
            <span className="mx-2 text-white/20">|</span>
            사업자등록번호 892-88-03893
          </p>
          <p>
            통신판매업신고 제2026-서울강남-02423호
            <span className="mx-2 text-white/20">|</span>
            주소 서울특별시 강남구 선릉로 529, 5층 5302호(역삼동, 함양재빌딩)
          </p>
          <p>
            전화 02-6677-3868
            <span className="mx-2 text-white/20">|</span>
            이메일 edu@proteamip.com
          </p>
          <p className="text-white/30 text-xs pt-1">
            &copy; {new Date().getFullYear()} 프로앤팀 주식회사. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
