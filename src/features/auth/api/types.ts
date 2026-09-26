/**
 * 인증 요청·응답 타입.
 * 원본 : Lost-and-Found `dto/request/LoginRequest` · `SignupRequest`, `dto/response/LoginResponse` · `SignupResponse`
 */

/**
 * `POST /api/auth/login` 본문.
 * 서버 검증은 `@NotBlank` · `@Email` 뿐이다 — 길이 규칙을 두지 않는다(비밀번호 정책을 로그인 응답으로 흘리지 않으려고)
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * `POST /api/auth/signup` 본문. 서버는 값을 다듬지 않고 그대로 저장한다(앞뒤 공백 · 대소문자 포함).
 *   email    `@NotBlank` · `@Email` · `@Size(max = 100)`
 *   password `@NotBlank` · `@Size(min = 8, max = 20)` — 문자 종류 규칙은 없다
 *   nickname `@NotBlank` · `@Size(max = 20)` — 보내기 전에 앞뒤 공백을 자른다
 * 길이 상수(8 · 20)는 `features/members` 의 것을 같이 쓴다. 비밀번호 변경과 같은 규칙이다
 */
export interface SignupRequest {
  email: string
  password: string
  nickname: string
}

/** 이메일 `@Size(max = 100)` — `Member` 엔티티 `length = 100` 과 같다 */
export const EMAIL_MAX_LENGTH = 100

/** `POST /api/auth/signup` 201 응답. 토큰은 없다 — 가입과 로그인은 따로다 */
export interface SignupResponse {
  id: number
  email: string
  nickname: string
  /** `LocalDateTime` — 시간대 오프셋이 없다 */
  createdAt: string
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
