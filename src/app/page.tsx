import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a365d] to-[#2a4a7f] text-white py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">㈜프로앤팀 교육센터</h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 leading-relaxed">
            기업 업무 실무자들의 역량을 강화하여,<br />
            한국의 국가 경쟁력을 높이고자 합니다.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/courses"
              className="bg-white text-[#1a365d] px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg"
            >
              교육과정 보기
            </Link>
            <Link
              href="/greeting"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              인사말
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon="📚"
            title="전문 교육 과정"
            desc="기업인들에게 필요한 업무 스킬에 관한 세미나 콘텐츠를 기획하여 운영합니다."
          />
          <FeatureCard
            icon="👨‍🏫"
            title="우수 강사진"
            desc="각 분야 최고의 전문가를 초빙하여 실무 중심의 교육을 진행합니다."
          />
          <FeatureCard
            icon="📜"
            title="수료증 발급"
            desc="교육 이수 후 수료증을 발급받으실 수 있습니다."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
