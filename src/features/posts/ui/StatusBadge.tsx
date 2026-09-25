import type { PostStatus } from '../api/types'
import { POST_STATUS_LABEL } from '../model/labels'
import styles from './Badge.module.css'

interface StatusBadgeProps {
  status: PostStatus
  /** 사진 위에 겹칠 때. 흰 바탕을 깔고, 완료는 잉크 도장으로 바꾼다 */
  surface?: 'plain' | 'photo'
}

/** 게시중 · 연락중 · 완료. 색 없이 점 모양으로 가른다. 완료가 가장 옅다 */
export function StatusBadge({ status, surface = 'plain' }: StatusBadgeProps) {
  return (
    <span className={styles.status} data-status={status} data-surface={surface}>
      {POST_STATUS_LABEL[status]}
    </span>
  )
}
