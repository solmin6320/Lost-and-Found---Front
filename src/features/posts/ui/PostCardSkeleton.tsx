import { Skeleton } from '@/shared/ui/Skeleton'

import styles from './PostCard.module.css'

/** 카드와 같은 격자·같은 줄 높이. 데이터가 들어와도 레이아웃이 튀지 않는다 */
export function PostCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.inner}>
        <Skeleton className={styles.skeletonThumb} height="auto" />
        <div className={styles.body}>
          <div className={styles.skeletonTitle}>
            <Skeleton shape="text" width="92%" />
            <Skeleton shape="text" width="58%" />
          </div>
          <div className={styles.skeletonBadges}>
            <Skeleton width="2.25rem" height="1.375rem" className={styles.skeletonPill} />
            <Skeleton width="3.5rem" height="1.375rem" className={styles.skeletonPill} />
          </div>
          <div className={styles.skeletonFacts}>
            <Skeleton shape="text" width="70%" />
            <Skeleton shape="text" width="45%" />
          </div>
          <div className={styles.skeletonMeta}>
            <Skeleton shape="text" width="35%" />
          </div>
        </div>
      </div>
    </div>
  )
}
