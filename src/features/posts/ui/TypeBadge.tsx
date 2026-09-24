import type { PostType } from '../api/types'
import { POST_TYPE_LABEL } from '../model/labels'
import styles from './Badge.module.css'

/** 분실 · 습득. 채운 배지 — 목록에서 눈이 가장 먼저 가는 자리다 */
export function TypeBadge({ type }: { type: PostType }) {
  return (
    <span className={styles.type} data-type={type}>
      {POST_TYPE_LABEL[type]}
    </span>
  )
}
