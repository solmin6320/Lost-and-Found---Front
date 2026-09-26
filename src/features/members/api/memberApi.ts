import { request } from '@/shared/lib/http'

import type { MemberResponse, NicknameUpdateRequest, PasswordUpdateRequest } from './types'

/** [3.7] `GET /api/members/me` — 로그인 필요. 로그인·재발급 직후 누구인지 알아내는 데 쓴다 */
export function getMe(signal?: AbortSignal): Promise<MemberResponse> {
  return request<MemberResponse>('/api/members/me', { signal })
}

/**
 * [3.6] `PATCH /api/members/me` — 닉네임 변경. 로그인 필요. 성공하면 200 + 바뀐 내 정보.
 * 지금과 같은 닉네임을 보내면 아무것도 바꾸지 않고 200 을 준다. 오류가 아니다.
 *
 * 실패 code : `DUPLICATE_NICKNAME`(409) · `INVALID_INPUT`(400) · `MEMBER_NOT_FOUND`(404)
 *
 * 화면에서는 캐시까지 갱신하는 `useUpdateNickname()` 을 쓴다.
 */
export function updateNickname(body: NicknameUpdateRequest): Promise<MemberResponse> {
  return request<MemberResponse>('/api/members/me', { method: 'PATCH', body })
}

/**
 * [3.6] `PATCH /api/members/me/password` — 비밀번호 변경. 로그인 필요. 성공하면 204(본문 없음, `undefined`).
 *
 * 성공하면 서버가 리프레시 토큰을 지운다. **이 기기를 포함한 모든 기기가 로그아웃된다.**
 * 그래서 화면에서 직접 부르지 않는다. 이 기기의 세션까지 비우는 `@/features/auth` 의
 * `useUpdatePassword()` 를 쓴다.
 *
 * 실패 code : `PASSWORD_MISMATCH`(400, 현재 비밀번호가 틀림) · `INVALID_INPUT`(400) · `MEMBER_NOT_FOUND`(404)
 * `PASSWORD_MISMATCH` 는 401 이 아니다. 재발급도 로그아웃도 일어나지 않는다.
 */
export function updatePassword(body: PasswordUpdateRequest): Promise<void> {
  return request<void>('/api/members/me/password', { method: 'PATCH', body })
}
