import { useMutation } from '@tanstack/react-query'

import { signup } from '../api/authApi'
import type { SignupRequest } from '../api/types'
import { useAuth } from './useAuth'

export interface SignupResult {
  /**
   * 가입한 계정으로 바로 로그인됐는가. 가입은 됐는데 이어진 로그인만 실패했으면 `false` —
   * 가입 실패가 아니므로 던지지 않는다. 부른 쪽이 로그인 화면으로 보낸다
   */
  signedIn: boolean
}

/**
 * [3.1] 회원가입 → 방금 입력한 이메일 · 비밀번호로 바로 로그인([3.2]).
 *
 * 가입 응답에는 토큰이 없다. 가입 직후 같은 값을 다시 치게 하지 않으려고 로그인까지 한 번에 한다(화면정의서 SCR-06).
 * 두 요청이 끝날 때까지 `isPending` 이라 제출 버튼이 잠긴 채로 있다.
 *
 * 실패 code(가입) : `DUPLICATE_EMAIL` · `DUPLICATE_NICKNAME`(409) · `INVALID_INPUT`(400)
 */
export function useSignup() {
  const { login } = useAuth()

  return useMutation({
    mutationFn: async (body: SignupRequest): Promise<SignupResult> => {
      await signup(body)
      try {
        await login({ email: body.email, password: body.password })
        return { signedIn: true }
      } catch {
        return { signedIn: false }
      }
    },
    // 자동으로 다시 보내지 않는다. 응답만 잃었을 때 서버엔 이미 계정이 있어 재시도가 DUPLICATE_EMAIL 로 끝난다
    retry: 0,
  })
}
