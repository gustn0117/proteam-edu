// 결제/가입 시 이메일 오타로 계정이 갈라지는 사고를 막기 위한 검사.
// 실제 사례: hanmail.net → hanmail.com, mycreatz.com → mycreatz.ocm

// 자주 틀리는 도메인 → 올바른 도메인
const DOMAIN_TYPOS: Record<string, string> = {
  "hanmail.com": "hanmail.net",
  "hanmail.co.kr": "hanmail.net",
  "hanmial.net": "hanmail.net",
  "hamail.net": "hanmail.net",
  "daum.com": "daum.net",
  "daum.co.kr": "daum.net",
  "naver.co.kr": "naver.com",
  "naver.net": "naver.com",
  "nver.com": "naver.com",
  "navr.com": "naver.com",
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmail.co.kr": "gmail.com",
  "gmail.co": "gmail.com",
  "gnail.com": "gmail.com",
  "nate.net": "nate.com",
  "nate.co.kr": "nate.com",
  "hotmail.co.kr": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "outlook.co.kr": "outlook.com",
  "yahoo.co.kr": "yahoo.com",
  "kakao.net": "kakao.com",
};

// 최상위 도메인 오타 (.com을 잘못 친 경우 등)
const TLD_TYPOS: Record<string, string> = {
  ocm: "com",
  con: "com",
  cmo: "com",
  vom: "com",
  xom: "com",
  comm: "com",
  co: "com",
  cm: "com",
  nt: "net",
  ne: "net",
  nte: "net",
  krr: "kr",
};

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email.trim());
}

/**
 * 오타로 보이는 이메일이면 고쳐진 주소를 돌려주고, 문제가 없으면 null.
 */
export function suggestEmailFix(email: string): string | null {
  const trimmed = email.trim();
  if (!isValidEmail(trimmed)) return null;

  const at = trimmed.lastIndexOf("@");
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1).toLowerCase();

  const byDomain = DOMAIN_TYPOS[domain];
  if (byDomain) return `${local}@${byDomain}`;

  const parts = domain.split(".");
  const tld = parts[parts.length - 1];
  const fixedTld = TLD_TYPOS[tld];
  // ".co.kr" 처럼 정상적인 2단계 도메인은 건드리지 않는다
  if (fixedTld && !(tld === "co" && parts.length > 2) && !(tld === "kr")) {
    parts[parts.length - 1] = fixedTld;
    return `${local}@${parts.join(".")}`;
  }

  return null;
}
