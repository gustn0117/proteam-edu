export default function GreetingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-[#1a365d] mb-8">인사말</h1>
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <p className="text-gray-700 leading-relaxed text-lg mb-6">
          기업 업무 실무자들의 역량을 강화하여, 한국의 국가 경쟁력을 높이고자,
          기업인들에게 필요한 업무 스킬에 관한 세미나 콘텐츠를 기획하여 운영하고 있습니다.
        </p>
        <p className="text-gray-700 leading-relaxed text-lg mb-6">
          ㈜프로앤팀 교육센터는 각 분야의 최고 전문가를 모시고, 현장에서 바로 활용할 수 있는
          실무 중심의 교육 프로그램을 제공합니다.
        </p>
        <p className="text-gray-700 leading-relaxed text-lg mb-8">
          앞으로도 기업인 여러분의 성장과 발전에 함께하겠습니다.
        </p>
        <div className="border-t pt-6">
          <p className="text-[#1a365d] font-semibold text-lg">
            공동대표 이승헌, 권오진
          </p>
          <p className="text-gray-500 text-sm mt-1">㈜프로앤팀</p>
        </div>
      </div>
    </div>
  );
}
