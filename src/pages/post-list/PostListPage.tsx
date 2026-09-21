import { RoutePlaceholder } from '@/app/RoutePlaceholder'

/** [4.2] 게시글 목록 조회 — 검색이 진입점이다. 필터는 URL 쿼리스트링에 싣는다 */
export function PostListPage() {
  return (
    <RoutePlaceholder
      title="분실물 · 습득물 목록"
      spec="[4.2] 게시글 목록 조회(검색/필터)"
      note="카드에 본문은 싣지 않는다. 썸네일·제목 → 유형/상태 배지 → 장소·날짜 → 작성자·조회수 순으로 읽히게 한다."
    />
  )
}
