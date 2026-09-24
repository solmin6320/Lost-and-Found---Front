import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react'

import { subscribeSessionExpired } from '@/shared/lib/http'

import type { LoginRequest } from '../api/types'
import { AuthContext, type AuthContextValue } from './AuthContext'
import { authReducer, initialAuthState } from './authReducer'
import { restoreSession, signIn, signOut } from './session'

/**
 * 로그인 상태를 앱 전체에 준다. `QueryClientProvider` 안쪽에 둔다(로그아웃 시 캐시를 비운다).
 *
 * 앱을 막지 않는다. 복구를 기다리는 동안에도 목록은 바로 뜬다(공개 API).
 * `status === 'unknown'` 동안 자리를 잡아야 하는 곳은 헤더뿐이다.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [state, dispatch] = useReducer(authReducer, initialAuthState)

  // 앱 시작 시 한 번 — 새로고침으로 비워진 토큰을 리프레시 쿠키로 되살린다
  useEffect(() => {
    let active = true
    void restoreSession().then((me) => {
      if (active) {
        dispatch({ type: 'RESTORED', me })
      }
    })
    return () => {
      active = false
    }
  }, [])

  // 요청 도중 재발급이 거절되면 세션이 끝난 것이다. 이전 사용자의 데이터를 남기지 않는다
  useEffect(
    () =>
      subscribeSessionExpired(() => {
        queryClient.clear()
        dispatch({ type: 'SESSION_EXPIRED' })
      }),
    [queryClient],
  )

  const login = useCallback(async (credentials: LoginRequest) => {
    const me = await signIn(credentials)
    dispatch({ type: 'LOGGED_IN', me })
    return me
  }, [])

  const logout = useCallback(async () => {
    await signOut()
    // 안 비우면 같은 기기의 다음 사용자가 이전 사용자의 데이터를 본다(보안명세서 8장)
    queryClient.clear()
    dispatch({ type: 'LOGGED_OUT' })
  }, [queryClient])

  const value = useMemo<AuthContextValue>(() => ({ ...state, login, logout }), [state, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
