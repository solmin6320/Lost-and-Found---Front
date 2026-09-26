import { ChatCircleDots, Check, MegaphoneSimple, type Icon } from '@/shared/ui/icons'

import type { PostStatus } from '../api/types'
import { POST_STATUS_LABEL } from '../model/labels'
import styles from './Badge.module.css'

interface StatusBadgeProps {
  status: PostStatus
  /** 사진 위에 겹칠 때. 불투명한 바탕을 깔고, 완료는 잉크 도장으로 바꾼다 */
  surface?: 'plain' | 'photo'
}

/**
 * 상태마다 아이콘 하나 — 색이 아니라 모양과 라벨로 가른다.
 *   게시중 : 알리는 중(확성기) · 연락중 : 이야기가 오가는 중(말풍선) · 완료 : 끝(체크)
 */
const STATUS_ICON: Record<PostStatus, Icon> = {
  OPEN: MegaphoneSimple,
  IN_PROGRESS: ChatCircleDots,
  DONE: Check,
}

/** 게시중 · 연락중 · 완료. 완료가 가장 옅다 */
export function StatusBadge({ status, surface = 'plain' }: StatusBadgeProps) {
  const StatusIcon = STATUS_ICON[status]
  return (
    <span className={styles.status} data-status={status} data-surface={surface}>
      <StatusIcon className={styles.statusIcon} />
      {POST_STATUS_LABEL[status]}
    </span>
  )
}
