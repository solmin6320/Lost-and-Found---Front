import type { PostType } from '../api/types'
import { POST_TYPE_LABEL } from '../model/labels'
import styles from './Badge.module.css'

interface TypeBadgeProps {
  type: PostType
  /** 사진 위에 겹칠 때. 흰 테를 둘러 사진 색에 묻히지 않게 한다 */
  surface?: 'plain' | 'photo'
}

/** 분실 · 습득. 채운 배지 — 목록에서 눈이 가장 먼저 가는 자리다 */
export function TypeBadge({ type, surface = 'plain' }: TypeBadgeProps) {
  return (
    <span className={styles.type} data-type={type} data-surface={surface}>
      {POST_TYPE_LABEL[type]}
    </span>
  )
}
