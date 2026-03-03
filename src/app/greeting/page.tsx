export default function GreetingPage() {
  return (
    <div>
      <section className="bg-primary py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,168,78,0.1)_0%,transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm font-semibold text-gold uppercase tracking-widest mb-3">Greeting</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">인사말</h1>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-8 pb-20">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 animate-fade-in-up">
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed text-lg">
              기업 업무 실무자들의 역량을 강화하여, 한국의 국가 경쟁력을 높이고자,
              기업인들에게 필요한 업무 스킬에 관한 세미나 콘텐츠를 기획하여 운영하고 있습니다.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              ㈜프로앤팀 교육센터는 각 분야의 최고 전문가를 모시고, 현장에서 바로 활용할 수 있는
              실무 중심의 교육 프로그램을 제공합니다.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              앞으로도 기업인 여러분의 성장과 발전에 함께하겠습니다.
            </p>
          </div>

          <div className="border-t border-gray-100 mt-10 pt-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
              <div className="w-6 h-6 rounded-full bg-gold/60" />
            </div>
            <div>
              <p className="text-primary font-bold text-lg">공동대표 이승헌, 권오진</p>
              <p className="text-gray-400 text-sm">㈜프로앤팀</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
