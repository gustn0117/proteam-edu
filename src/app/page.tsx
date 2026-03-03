import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,168,78,0.15)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(37,99,235,0.1)_0%,transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8 border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-sm text-white/80">기업 역량 강화 전문 교육기관</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              기업의 성장을 위한<br />
              <span className="text-gold">전문 교육</span> 파트너
            </h1>
            <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
              기업 업무 실무자들의 역량을 강화하여,<br className="hidden sm:inline" />
              한국의 국가 경쟁력을 높이고자 합니다.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/courses"
                className="bg-gold text-primary-dark px-8 py-3.5 rounded-xl font-semibold hover:bg-gold-light transition-all shadow-lg shadow-gold/20 hover:shadow-gold/30 hover:-translate-y-0.5"
              >
                교육과정 보기
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
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/30 to-transparent" />
      </section>

      {/* Features */}
      <section className="py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-gold uppercase tracking-widest mb-3">Why ProTeam</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">프로앤팀이 특별한 이유</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              }
              title="전문 교육 과정"
              desc="기업인들에게 필요한 업무 스킬에 관한 세미나 콘텐츠를 기획하여 운영합니다."
            />
            <FeatureCard
              icon={
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              }
              title="우수 강사진"
              desc="각 분야 최고의 전문가를 초빙하여 실무 중심의 교육을 진행합니다."
            />
            <FeatureCard
              icon={
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              }
              title="수료증 발급"
              desc="교육 이수 후 공인 수료증을 발급받으실 수 있습니다."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 md:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-primary rounded-2xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,168,78,0.1)_0%,transparent_70%)]" />
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">교육 과정에 참여해보세요</h2>
              <p className="text-white/60 mb-8 max-w-lg mx-auto">
                현장에서 바로 활용할 수 있는 실무 중심의 교육 프로그램을 제공합니다.
              </p>
              <Link
                href="/courses"
                className="inline-flex bg-gold text-primary-dark px-8 py-3.5 rounded-xl font-semibold hover:bg-gold-light transition-all shadow-lg shadow-gold/20"
              >
                교육과정 둘러보기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all duration-300 hover:-translate-y-1">
      <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-5 group-hover:bg-gold/10 group-hover:text-gold transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
