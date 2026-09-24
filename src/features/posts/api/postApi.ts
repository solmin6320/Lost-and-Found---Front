import { request } from '@/shared/lib/http'
import type { PagedModel } from '@/shared/types/api'

import {
  isPostCategory,
  isPostStatus,
  isPostType,
  type PostListParams,
  type PostListResponse,
} from './types'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/**
 * 검색 조건을 서버에 보낼 모양으로 다듬는다. 요청과 쿼리 키가 같은 결과를 쓴다.
 *
 * - 문자열은 앞뒤 공백을 자르고, 비면 뺀다
 * - Enum·날짜가 형식에 맞지 않으면 뺀다. URL 에서 온 값은 사용자 입력이다.
 *   그대로 보내면 400 이 나고 메시지에 서버 내부 문구가 섞일 수 있다
 * - `page` 0 은 기본값이라 뺀다. `{}` 와 `{ page: 0 }` 이 서로 다른 캐시가 되지 않게 한다
 */
export function normalizePostListParams(params: PostListParams): PostListParams {
  const result: PostListParams = {}

  const keyword = params.keyword?.trim()
  if (keyword) result.keyword = keyword

  if (isPostType(params.type)) result.type = params.type
  if (isPostCategory(params.category)) result.category = params.category
  if (isPostStatus(params.status)) result.status = params.status

  const location = params.location?.trim()
  if (location) result.location = location

  if (params.from && ISO_DATE.test(params.from)) result.from = params.from
  if (params.to && ISO_DATE.test(params.to)) result.to = params.to

  if (isPositiveInteger(params.page)) result.page = params.page
  if (isPositiveInteger(params.size)) result.size = params.size

  return result
}

function isPositiveInteger(value: number | undefined): value is number {
  return Number.isInteger(value) && (value as number) > 0
}

/**
 * [4.2] `GET /api/posts` — 비로그인 가능. 등록일 내림차순 고정.
 * 만료된 토큰을 실어 보내도 401 이 아니라 비로그인 기준의 200 이 온다.
 * `from > to` 면 400 `INVALID_INPUT`("시작일이 종료일보다 늦을 수 없습니다").
 */
export function getPosts(
  params: PostListParams = {},
  signal?: AbortSignal,
): Promise<PagedModel<PostListResponse>> {
  return request<PagedModel<PostListResponse>>('/api/posts', {
    query: { ...normalizePostListParams(params) },
    signal,
  })
}
