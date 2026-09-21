import { RoutePlaceholder } from '@/app/RoutePlaceholder'

/** [6.1] 마이페이지 — 내가 쓴 글을 상태별로 조회 */
export function MyPage() {
  return (
    <RoutePlaceholder
      title="내가 쓴 글"
      spec="[6.1] 마이페이지"
      note="status 미지정이면 전체다. 상태 탭도 URL 쿼리스트링에 싣는다."
    />
  )
}
