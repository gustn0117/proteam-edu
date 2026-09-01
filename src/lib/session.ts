import type { NextResponse } from "next/server";

// 로그인 유지 기간. 7일이면 지난 기수 수강생이 다음 기수 신청 때 대부분 로그아웃 상태가 되어
// 비회원 결제로 흘러가고, 이메일을 다시 입력하다 오타로 계정이 갈라지는 사고가 생긴다.
export const SESSION_MAX_AGE = 60 * 60 * 24 * 90; // 90일

export function setSessionCookie(response: NextResponse, userId: string) {
  response.cookies.set("session_id", userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}
