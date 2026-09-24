import { queryOptions, useQuery } from '@tanstack/react-query'

import { getPosts, normalizePostListParams } from '../api/postApi'
import type { PostListParams } from '../api/types'

/**
 * 게시글 쿼리 키. 무효화할 때 범위를 고른다.
 *   글 등록·삭제 후 목록 전체 → `postKeys.lists()`
 */
export const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  /** 검색 조건과 페이지가 키에 들어간다. 조건이 바뀌면 다른 캐시다 */
  list: (params: PostListParams) => [...postKeys.lists(), normalizePostListParams(params)] as const,
}

/**
 * 목록 쿼리 설정. 옵션을 덧붙여야 하면 훅 대신 이것을 펼쳐 쓴다.
 *
 * ```ts
 * useQuery({ ...postListQueryOptions(params), placeholderData: keepPreviousData })
 * ```
 */
export function postListQueryOptions(params: PostListParams = {}) {
  return queryOptions({
    queryKey: postKeys.list(params),
    queryFn: ({ signal }) => getPosts(params, signal),
  })
}

/** [4.2] 게시글 목록. `page` 는 0부터 센다 */
export function usePostList(params: PostListParams = {}) {
  return useQuery(postListQueryOptions(params))
}
