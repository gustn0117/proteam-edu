import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[calc(100vh-64px)] flex items-center">
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
        <div className="absolute top-20 right-[15%] w-24 h-24 rounded-full bg-gold/10 animate-float blur-sm" />
        <div className="absolute bottom-32 left-[10%] w-16 h-16 rounded-full bg-accent/10 animate-float blur-sm" style={{ animationDelay: "1s" }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 md:py-28 w-full">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              이론을 넘어 실전으로,<br />
              <span className="text-gradient-gold">지식을 넘어 성과로</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              현장에서 즉시 증명되는 실전형 인재 육성
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
