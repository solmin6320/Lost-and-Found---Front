import { clearAccessToken, getAccessToken, setAccessToken } from './accessToken'
import { ApiError } from './errors'

/** 새 액세스 토큰을 받아 오는 함수. 실패하면 reject 한다 */
export type TokenRefresher = () => Promise<string>

let refresher: TokenRefresher | null = null
let inFlight: Promise<string> | null = null
const sessionExpiredListeners = new Set<() => void>()

/** 재발급 방법을 등록한다. 엔드포인트를 아는 쪽(features/auth)이 부른다 */
export function setTokenRefresher(fn: TokenRefresher): void {
  refresher = fn
}

/**
 * 액세스 토큰을 재발급한다. **동시에 몇 번을 불러도 요청은 한 번만 나간다.**
 *
 * 리프레시 토큰은 재발급마다 교체된다. 두 요청이 같은 옛 쿠키로 동시에 재발급하면
 * 먼저 끝난 쪽이 Redis 값을 바꾸고, 늦은 쪽은 `REFRESH_TOKEN_MISMATCH` 로 거절돼
 * 멀쩡한 세션이 끊긴다. 그래서 진행 중인 Promise 를 모두가 나눠 기다린다.
 *
 * 앱 시작 시 세션 복구도 이 함수를 쓴다. 그 사이 401 을 받은 요청이 같은 Promise 에 합류한다.
 */
export function refreshAccessToken(): Promise<string> {
  inFlight ??= runRefresh().finally(() => {
    inFlight = null
  })
  return inFlight
}

async function runRefresh(): Promise<string> {
  if (!refresher) {
    throw new Error('재발급 함수가 등록되지 않았습니다. features/auth 를 확인하세요.')
  }

  try {
    const token = await refresher()
    setAccessToken(token)
    return token
  } catch (error) {
    // 서버가 거절했다(4xx) — 리프레시 토큰이 죽었다. 세션을 끝낸다.
    // 네트워크 오류·5xx 는 세션이 죽었다는 증거가 아니다. 토큰을 두고 오류만 올린다.
    // 어느 쪽이든 여기서 다시 재발급하지 않는다(무한 재시도 금지).
    if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
      expireSession()
    }
    throw error
  }
}

/**
 * 있던 세션을 끝낸다. 토큰이 없었으면(비로그인·앱 시작 직후) 아무것도 알리지 않는다.
 * 그래서 앱 시작 시 복구 실패는 "세션 만료"가 아니라 조용한 비로그인이 된다.
 */
export function expireSession(): void {
  if (getAccessToken() === null) {
    return
  }
  clearAccessToken()
  sessionExpiredListeners.forEach((listener) => listener())
}

/** 세션이 서버에 의해 끝났을 때 불린다. 해제 함수를 돌려준다 */
export function subscribeSessionExpired(listener: () => void): () => void {
  sessionExpiredListeners.add(listener)
  return () => {
    sessionExpiredListeners.delete(listener)
  }
}
