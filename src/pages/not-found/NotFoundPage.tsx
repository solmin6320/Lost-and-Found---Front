import { Link } from 'react-router-dom'

import { paths } from '@/app/paths'
import { RoutePlaceholder } from '@/app/RoutePlaceholder'

/** 정의되지 않은 경로 */
export function NotFoundPage() {
  return (
    <>
      <RoutePlaceholder
        title="없는 화면입니다"
        spec="9장 예외 처리 (RESOURCE_NOT_FOUND)"
        note="주소가 잘못됐거나 삭제된 글입니다."
      />
      <p style={{ marginTop: 'var(--space-5)' }}>
        <Link to={paths.postList}>목록으로 가기</Link>
      </p>
    </>
  )
}
