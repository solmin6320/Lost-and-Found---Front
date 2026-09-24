/**
 * 액세스 토큰(5분)은 이 모듈 변수에만 둔다.
 *
 * localStorage · sessionStorage 에 쓰지 않는다. XSS 한 줄이면 통째로 긁힌다(보안명세서 3장).
 * 새로고침하면 비워지고, 앱 시작 시 `POST /api/auth/reissue` 로 되살린다.
 * 토큰 값을 콘솔에 찍지 않는다.
 */
let accessToken: string | null = null

export function getAccessToken(): string | null {
  return accessToken
}

export function setAccessToken(token: string): void {
  accessToken = token
}

export function clearAccessToken(): void {
  accessToken = null
}
