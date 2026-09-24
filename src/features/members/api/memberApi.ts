import { request } from '@/shared/lib/http'

import type { MemberResponse } from './types'

/** [3.7] `GET /api/members/me` — 로그인 필요. 로그인·재발급 직후 누구인지 알아내는 데 쓴다 */
export function getMe(signal?: AbortSignal): Promise<MemberResponse> {
  return request<MemberResponse>('/api/members/me', { signal })
}
