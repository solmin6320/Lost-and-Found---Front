import type { MemberResponse } from '@/features/members'

/**
 * - `unknown`       : 앱 시작 직후, 세션 복구 결과를 기다리는 중. 헤더는 자리만 잡는다
 * - `authenticated` : 로그인됨. `me` 가 반드시 있다
 * - `anonymous`     : 비로그인
 */
export type AuthStatus = 'unknown' | 'authenticated' | 'anonymous'

export type AuthState =
  | { status: 'unknown'; me: null }
  | { status: 'anonymous'; me: null }
  | { status: 'authenticated'; me: MemberResponse }

export type AuthAction =
  /** 앱 시작 시 세션 복구 결과. `null` 이면 비로그인 */
  | { type: 'RESTORED'; me: MemberResponse | null }
  | { type: 'LOGGED_IN'; me: MemberResponse }
  | { type: 'LOGGED_OUT' }
  /** 서버가 세션을 끝냈다(재발급 거절) */
  | { type: 'SESSION_EXPIRED' }

export const initialAuthState: AuthState = { status: 'unknown', me: null }

const anonymous: AuthState = { status: 'anonymous', me: null }

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'RESTORED':
      // 복구가 끝나기 전에 로그인·만료가 먼저 반영됐다. 늦게 온 복구 결과로 덮지 않는다
      if (state.status !== 'unknown') {
        return state
      }
      return action.me ? { status: 'authenticated', me: action.me } : anonymous

    case 'LOGGED_IN':
      return { status: 'authenticated', me: action.me }

    case 'LOGGED_OUT':
    case 'SESSION_EXPIRED':
      return anonymous
  }
}
