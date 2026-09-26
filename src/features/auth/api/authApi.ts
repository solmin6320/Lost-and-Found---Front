import { request, setTokenRefresher } from '@/shared/lib/http'

import type { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from './types'

/**
 * [3.1] `POST /api/auth/signup` — 201 과 회원 정보를 돌려준다. 토큰은 주지 않는다(로그인은 따로).
 * 토큰이 필요 없는 공개 엔드포인트라 싣지 않고, 401 재발급도 걸지 않는다.
 * 실패 code : `DUPLICATE_EMAIL` · `DUPLICATE_NICKNAME`(409) · `INVALID_INPUT`(400, message 가 필드를 말한다)
 */
export function signup(body: SignupRequest): Promise<SignupResponse> {
  return request<SignupResponse>('/api/auth/signup', { method: 'POST', body, skipAuth: true })
}

/**
 * [3.2] `POST /api/auth/login`.
 * 성공하면 서버가 리프레시 토큰 쿠키를 심는다. 액세스 토큰 저장은 호출한 쪽이 한다.
 * 실패 code : `INVALID_CREDENTIALS`(401) · `ACCOUNT_LOCKED`(423) · `INVALID_INPUT`(400)
 */
export function login(body: LoginRequest): Promise<LoginResponse> {
  return request<LoginResponse>('/api/auth/login', { method: 'POST', body, skipAuth: true })
}

/**
 * [3.3] `POST /api/auth/reissue` — 쿠키만으로 동작한다.
 * **직접 부르지 않는다.** 동시 호출을 한 번으로 묶는 `refreshAccessToken()` 을 거친다.
 * 실패 code : `INVALID_REFRESH_TOKEN` · `REFRESH_TOKEN_MISMATCH`(둘 다 401)
 */
export function reissue(): Promise<LoginResponse> {
  return request<LoginResponse>('/api/auth/reissue', { method: 'POST', skipAuth: true })
}

/**
 * [3.4] `POST /api/auth/logout` — 서버가 Redis 의 리프레시 토큰을 지우고 쿠키를 만료시킨다.
 *
 * 인증이 필요한 엔드포인트라 `skipAuth` 를 쓰지 않는다. 액세스 토큰이 만료됐으면 재발급 후 다시 보낸다.
 * 여기서 401 로 끝나면 HttpOnly 쿠키가 브라우저에 남고, JS 는 그것을 지울 수 없다.
 * 그러면 새로고침 한 번에 앱 시작 재발급이 성공해 **로그아웃이 풀린다.**
 */
export function logout(): Promise<void> {
  return request<void>('/api/auth/logout', { method: 'POST' })
}

// 401 인터셉터가 쓸 재발급 방법을 등록한다.
// 토큰은 login 또는 이 재발급으로만 생기고 둘 다 이 모듈에 있으므로, 토큰이 생기기 전에 반드시 등록된다.
setTokenRefresher(async () => (await reissue()).accessToken)
