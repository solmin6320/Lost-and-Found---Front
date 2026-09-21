import { RoutePlaceholder } from '@/app/RoutePlaceholder'

/** [4.1] 게시글 등록 + [4.5] 이미지 업로드 (multipart/form-data 한 요청) */
export function PostCreatePage() {
  return (
    <RoutePlaceholder
      title="게시글 등록"
      spec="[4.1] 게시글 등록 · [4.5] 이미지 업로드"
      note="이미지는 5장에서 UI가 막는다. 전송 중에는 제출·취소 버튼을 잠근다."
    />
  )
}
