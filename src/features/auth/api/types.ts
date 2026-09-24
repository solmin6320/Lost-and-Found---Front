/**
 * 인증 요청·응답 타입.
 * 원본 : Lost-and-Found `dto/request/LoginRequest`, `dto/response/LoginResponse`
 */

/** `POST /api/auth/login` 본문 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * `POST /api/auth/login` · `POST /api/auth/reissue` 응답.
 * 리프레시 토큰은 여기 없다 — HttpOnly 쿠키(`path=/api/auth`)로만 온다.
 * 회원 식별자도 없다. 누구인지는 `GET /api/members/me` 로 따로 묻는다.
 */
export interface LoginResponse {
  accessToken: string
  /** 항상 `"Bearer"` */
  tokenType: string
  /** 액세스 토큰 **유효기간(ms)**. 만료 시각이 아니다. 현재 300000(5분) */
  accessTokenExpires: number
}
