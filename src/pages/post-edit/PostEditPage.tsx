import { RoutePlaceholder } from '@/app/RoutePlaceholder'

/** [4.4] 게시글 수정 + [4.5] 이미지 교체/삭제/유지 */
export function PostEditPage() {
  return (
    <RoutePlaceholder
      title="게시글 수정"
      spec="[4.4] 게시글 수정 · [4.5] 이미지 처리"
      note="이미지 규칙이 직관과 어긋난다. 새로 올리면 기존 것이 전부 교체된다는 안내를 업로드 영역에 둔다."
    />
  )
}
