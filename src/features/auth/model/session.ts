import { getMe, type MemberResponse } from '@/features/members'
import { clearAccessToken, refreshAccessToken, setAccessToken } from '@/shared/lib/http'

import { login, logout } from '../api/authApi'
import type { LoginRequest } from '../api/types'

/**
 * 로그인·세션 복구·로그아웃 흐름. React 를 모른다. AuthProvider 가 결과를 상태로 옮긴다.
 *
 * 토큰 응답(`LoginResponse`)에 회원 식별자가 없어서, 토큰을 받은 뒤 항상 `GET /api/members/me` 로
 * 누구인지 묻는다. 그것이 실패하면 토큰도 버린다 — "토큰은 있는데 누군지 모름" 상태를 만들지 않는다.
 */

async function loadMe(): Promise<MemberResponse> {
  try {
    return await getMe()
  } catch (error) {
    clearAccessToken()
    throw error
  }
}

/** 로그인 후 내 정보를 돌려준다. 실패하면 서버 오류(`INVALID_CREDENTIALS` 등)를 그대로 던진다 */
export async function signIn(credentials: LoginRequest): Promise<MemberResponse> {
  const { accessToken } = await login(credentials)
  setAccessToken(accessToken)
  return loadMe()
}

let restoring: Promise<MemberResponse | null> | null = null

/**
 * 앱 시작 시 세션 복구. 새로고침으로 비워진 메모리 토큰을 리프레시 쿠키로 되살린다.
 *
 * **던지지 않는다.** 쿠키 없음·만료·백엔드 꺼짐 모두 `null`(비로그인)이다.
 * 앱이 `unknown` 에 머물면 헤더가 영원히 자리표시자로 남는다.
 * 재시도하지 않는다. 한 번 실패하면 비로그인으로 시작한다.
 *
 * 개발 모드의 StrictMode 가 effect 를 두 번 돌려도 요청은 한 번씩만 나가도록 진행 중인 복구를 공유한다.
 */
export function restoreSession(): Promise<MemberResponse | null> {
  restoring ??= runRestore().finally(() => {
    restoring = null
  })
  return restoring
}

async function runRestore(): Promise<MemberResponse | null> {
  try {
    await refreshAccessToken()
    return await loadMe()
  } catch {
    return null
  }
}

/**
 * 서버에 로그아웃을 알리고 이 기기의 토큰을 비운다. **던지지 않는다.**
 *
 * 서버 호출이 네트워크 오류로 실패해도 이 기기에서는 로그아웃한다.
 * 다만 그때는 HttpOnly 리프레시 쿠키가 남아, 새로고침하면 다시 로그인된다. JS 로는 지울 수 없다.
 */
export async function signOut(): Promise<void> {
  try {
    await logout()
  } catch {
    // 이 기기에서는 끝낸다
  } finally {
    clearAccessToken()
  }
}
