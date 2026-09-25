import { useCallback, useMemo } from 'react'
import { useSearchParams, type To } from 'react-router-dom'

import {
  parsePostListSearch,
  toSearchParams,
  type PostListSearch,
} from './postListSearch'

/**
 * 목록 검색 조건을 URL 과 맞물린다.
 *
 * 조건을 바꿀 때마다 기록을 **쌓는다**(replace 가 아니다). 필터를 잘못 걸었을 때
 * 뒤로가기 한 번이 직전 조건으로 돌아가는 가장 빠른 길이다.
 */
export function usePostListSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = useMemo(() => parsePostListSearch(searchParams), [searchParams])

  const apply = useCallback(
    (next: PostListSearch) => {
      const nextParams = toSearchParams(next)
      // 같은 주소로 다시 이동하면 뒤로가기에 같은 화면이 두 번 쌓인다
      if (nextParams.toString() !== searchParams.toString()) {
        setSearchParams(nextParams)
      }
    },
    [searchParams, setSearchParams],
  )

  /** 일부만 바꾼다. 결과가 달라지므로 `page` 를 주지 않으면 1쪽으로 돌아간다 */
  const update = useCallback(
    (patch: Partial<PostListSearch>) => apply({ ...search, page: 1, ...patch }),
    [apply, search],
  )

  /**
   * 일부만 바꾼 조건의 주소. `update` 와 같이 `page` 를 주지 않으면 1쪽이다.
   * 이동을 링크로 두면 새 탭 열기 · 주소 복사가 된다(의도 선택 · 쪽 이동)
   */
  const hrefWith = useCallback(
    (patch: Partial<PostListSearch>): To => {
      const query = toSearchParams({ ...search, page: 1, ...patch }).toString()
      return { search: query ? `?${query}` : '' }
    },
    [search],
  )

  /** 다른 쪽으로 가는 주소 */
  const hrefForPage = useCallback((page: number): To => hrefWith({ page }), [hrefWith])

  return { search, apply, update, hrefWith, hrefForPage }
}
