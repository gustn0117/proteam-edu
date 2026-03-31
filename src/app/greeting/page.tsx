import Link from "next/link";
import Image from "next/image";

export default function GreetingPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80"
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
            <p className="text-sm font-semibold text-gold uppercase tracking-widest mb-3">Greeting</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">인사말</h1>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/20 to-transparent" />
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-14 relative z-10 pb-20">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 animate-fade-in-up relative">
          {/* Decorative quote */}
          <div className="text-gold/10 text-[120px] leading-none font-serif absolute -top-4 -left-2 select-none pointer-events-none" aria-hidden="true">
            &ldquo;
          </div>

          <div className="relative space-y-8">
            <div className="text-center mb-4">
              <p className="text-primary font-bold text-xl md:text-2xl">
                &ldquo;실무의 깊이가 기업의 경쟁력&rdquo;
              </p>
            </div>

            <div className="border-l-4 border-gold/30 pl-6 py-1">
              <p className="text-gray-600 leading-relaxed text-lg md:text-xl first-letter:text-2xl first-letter:font-bold first-letter:text-primary">
                기업의 경쟁력은 현장에서 발휘되는 실무자들의 전문성에서 시작됩니다.
                ㈜프로앤팀 교육센터는 각 분야 최고 전문가들과 함께 현업에 즉시 적용 가능한
                실전사례 중심의 세미나 프로그램을 제공합니다.
              </p>
            </div>

            <div className="border-l-4 border-gold/20 pl-6 py-1">
              <p className="text-gray-600 leading-relaxed text-lg md:text-xl">
                실무자의 성장이 곧 기업의 발전이라는 믿음으로, 현장 밀착형 실무 커리큘럼을 통해
                기업의 핵심 인재들의 성공적인 여정에 함께하겠습니다.
              </p>
            </div>
          </div>

          {/* Co-Representatives Photos */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden bg-gray-100 shadow-md border-2 border-gold/20">
                  <Image
                    src="/이승헌.png"
                    alt="공동대표 이승헌"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-primary font-bold text-sm md:text-base mt-4">공동대표 이승헌</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden bg-gray-100 shadow-md border-2 border-gold/20">
                  <Image
                    src="/권오진.png"
                    alt="공동대표 권오진"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-primary font-bold text-sm md:text-base mt-4">공동대표 권오진</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm text-center mt-4">㈜프로앤팀</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 bg-gold text-primary-dark px-6 py-3 rounded-xl font-semibold hover:bg-gold-light transition-all shadow-sm hover:shadow-md shadow-gold/20 group text-sm"
          >
            교육과정 보러가기
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
