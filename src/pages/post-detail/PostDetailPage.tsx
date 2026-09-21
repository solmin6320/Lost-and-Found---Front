import { RoutePlaceholder } from '@/app/RoutePlaceholder'

/** [4.3] 게시글 상세 + [5.1] 댓글 + [4.6] 상태 변경 */
export function PostDetailPage() {
  return (
    <RoutePlaceholder
      title="게시글 상세"
      spec="[4.3] 상세 조회 · [5.1] 댓글 · [4.6] 상태 변경"
      note="수정·삭제·상태 변경은 작성자 본인에게만 보인다. 비활성이 아니라 숨김이다."
    />
  )
}
