import { useMutation } from '@tanstack/react-query'

import { useAuth } from './useAuth'

/**
 * [3.2] 로그인. 성공하면 로그인 상태와 내 정보가 채워진 뒤에 `onSuccess` 가 불린다.
 *
 * 실패 code : `INVALID_CREDENTIALS`(401) · `ACCOUNT_LOCKED`(423) · `INVALID_INPUT`(400).
 * 로그인의 401 에는 재발급을 걸지 않는다(`authApi.login` 이 `skipAuth`) — 자격 증명이 틀린 것이지 토큰이 만료된 게 아니다.
 */
export function useLogin() {
  const { login } = useAuth()

  return useMutation({
    mutationFn: login,
    // 자동으로 다시 보내지 않는다. 틀린 비밀번호를 한 번 더 보내면 실패 횟수만 늘어 잠금(5회)에 가까워진다
    retry: 0,
  })
}
