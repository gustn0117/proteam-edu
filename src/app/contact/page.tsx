export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-[#1a365d] mb-8">연락처</h1>
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-1">전화</h2>
          <p className="text-lg text-gray-900">02-0000-0000</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-1">이메일</h2>
          <p className="text-lg text-gray-900">edu@proteambiz.com</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-1">주소</h2>
          <p className="text-lg text-gray-900">서울특별시 (상세 주소 추후 업데이트)</p>
        </div>
        <div className="pt-4 border-t">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">결제 안내</h2>
          <div className="text-sm text-gray-700 space-y-1">
            <p><span className="font-medium">계좌이체:</span> 국민 829-01-0308-009, ㈜프로앤팀</p>
            <p><span className="font-medium">계산서 발급:</span> 사업자등록증 사본, 계산서 담당자 메일주소, 연락처를 edu@proteambiz.com으로 송부</p>
            <p><span className="font-medium">현금영수증:</span> 국세청에 등록된 핸드폰 번호 송부</p>
          </div>
        </div>
      </div>
    </div>
  );
}
