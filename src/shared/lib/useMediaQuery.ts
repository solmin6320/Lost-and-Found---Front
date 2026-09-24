import { useCallback, useSyncExternalStore } from 'react'

/**
 * 미디어 쿼리가 맞는지. 첫 렌더부터 실제 값을 읽으므로 좁은 화면 → 넓은 화면으로 한 번 깜빡이지 않는다.
 *
 * CSS 로 숨기는 대신 이걸 쓰는 때 : 두 배치가 같은 입력칸을 각자 그리면 `id` 가 겹치고
 * 스크린리더가 같은 필터를 두 번 읽는다. 한쪽만 그린다.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches)
}
