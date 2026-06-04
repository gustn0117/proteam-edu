// SQLite datetime('now')는 UTC를 'YYYY-MM-DD HH:MM:SS' 형식으로 반환합니다.
// 화면 표시는 한국 시간(KST, UTC+9)으로 변환합니다.

function toUtcDate(input: string): Date | null {
  if (!input) return null;
  let s = input.trim();
  // 이미 ISO + timezone 정보가 있는 경우
  if (/[zZ]|[+-]\d{2}:?\d{2}$/.test(s)) {
    return new Date(s);
  }
  // 'YYYY-MM-DD HH:MM:SS' 또는 'YYYY-MM-DDTHH:MM:SS' → UTC로 가정
  if (!s.includes("T")) s = s.replace(" ", "T");
  return new Date(s + "Z");
}

export function formatKstDateTime(input: string): string {
  const d = toUtcDate(input);
  if (!d || isNaN(d.getTime())) return "";
  return d.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
    hour12: false,
  }).replace(/\. /g, ".").replace(/\.$/, "");
}

export function formatKstDate(input: string): string {
  const d = toUtcDate(input);
  if (!d || isNaN(d.getTime())) return "";
  return d.toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).replace(/\. /g, ".").replace(/\.$/, "");
}
