import { createContext } from 'react'

import type { MemberResponse } from '@/features/members'

import type { LoginRequest } from '../api/types'
import type { AuthState } from './authReducer'

export interface AuthActions {
  /**
   * 로그인하고 내 정보를 돌려준다.
   * 실패하면 `ApiError` 를 던진다 — `INVALID_CREDENTIALS`(401) · `ACCOUNT_LOCKED`(423) · `INVALID_INPUT`(400)
   */
  login: (credentials: LoginRequest) => Promise<MemberResponse>
  /** 서버 로그아웃 + 메모리 토큰 비우기 + 쿼리 캐시 비우기. 던지지 않는다 */
  logout: () => Promise<void>
}

/** `status` 로 좁히면 `me` 의 null 여부가 따라온다 */
export type AuthContextValue = AuthState & AuthActions

export const AuthContext = createContext<AuthContextValue | null>(null)
