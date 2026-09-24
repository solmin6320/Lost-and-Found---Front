import { useContext } from 'react'

import { AuthContext, type AuthContextValue } from './AuthContext'

/**
 * 로그인 상태와 동작. `AuthProvider` 밖에서 부르면 던진다.
 *
 * ```tsx
 * const auth = useAuth()
 * if (auth.status === 'authenticated') auth.me.nickname
 * ```
 */
export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) {
    throw new Error('useAuth 는 AuthProvider 안에서만 쓸 수 있습니다.')
  }
  return value
}
