import type { PostStatus } from '../api/types'
import { POST_STATUS_LABEL } from '../model/labels'
import styles from './Badge.module.css'

/** 게시중 · 연락중 · 완료. 색 없이 점 모양으로 가른다. 완료가 가장 옅다 */
export function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <span className={styles.status} data-status={status}>
      {POST_STATUS_LABEL[status]}
    </span>
  )
}
