import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-primary/80" />
          <div className="absolute inset-0 bg-linear-to-b from-primary/30 via-transparent to-primary/50" />
        </div>
        <div className="absolute inset-0 pattern-dots opacity-15" />
        {/* Floating decorations */}
        <div className="absolute top-20 right-[15%] w-24 h-24 rounded-full bg-gold/10 animate-float blur-sm" />
        <div className="absolute bottom-32 left-[10%] w-16 h-16 rounded-full bg-accent/10 animate-float blur-sm" style={{ animationDelay: "1s" }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-28 md:py-40">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8 border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-sm text-white/80">기업 역량 강화 전문 교육기관</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              기업의 성장을 위한<br />
              <span className="text-gradient-gold">전문 교육</span> 파트너
            </h1>
            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              기업 업무 실무자들의 역량을 강화하여,<br className="hidden sm:inline" />
              한국의 국가 경쟁력을 높이고자 합니다.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/courses"
                className="relative bg-gold text-primary-dark px-8 py-3.5 rounded-xl font-semibold hover:bg-gold-light transition-all shadow-lg shadow-gold/20 hover:shadow-gold/30 hover:-translate-y-0.5 overflow-hidden group"
              >
                <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                <span className="relative flex items-center gap-2">
                  교육과정 보기
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/greeting"
                className="border border-white/20 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                인사말
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1920&q=80"
                alt=""
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-primary/90" />
            </div>
            <div className="absolute inset-0 pattern-dots opacity-20" />
            <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />
            <div className="absolute bottom-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-gold/20 to-transparent" />
            <div className="relative p-12 md:p-16 text-center">
              <p className="text-sm font-semibold text-gold uppercase tracking-widest mb-4">Get Started</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">교육 과정에 참여해보세요</h2>
              <p className="text-white/60 mb-10 max-w-lg mx-auto leading-relaxed">
                현장에서 바로 활용할 수 있는 실무 중심의 교육 프로그램을 제공합니다.
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 bg-gold text-primary-dark px-8 py-3.5 rounded-xl font-semibold hover:bg-gold-light transition-all shadow-lg shadow-gold/20 group"
              >
                교육과정 둘러보기
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

