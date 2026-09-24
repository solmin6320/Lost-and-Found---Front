import { useState } from 'react'

import { cx } from '@/shared/lib/cx'

import type { PostCategory } from '../api/types'
import { POST_CATEGORY_LABEL } from '../model/labels'
import { CategoryIcon } from './CategoryIcon'
import styles from './PostThumbnail.module.css'

interface PostThumbnailProps {
  category: PostCategory
  /**
   * 썸네일 주소. **목록 API(`PostListResponse`)는 아직 이미지를 주지 않는다.**
   * 백엔드가 필드를 추가하면 그 값을 넘기기만 하면 된다. 없으면 카테고리 그림이 대신한다.
   */
  src?: string
  /** 게시글 제목. "이미지" 라고 쓰지 않는다 */
  alt: string
  className?: string
}

/** 게시글 대표 사진. 없거나 불러오지 못하면 카테고리 그림으로 바꾼다 */
export function PostThumbnail({ category, src, alt, className }: PostThumbnailProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  if (src && src !== failedSrc) {
    return (
      <img
        className={cx(styles.thumb, className)}
        src={src}
        alt={alt}
        width={240}
        height={240}
        loading="lazy"
        decoding="async"
        onError={() => setFailedSrc(src)}
      />
    )
  }

  return (
    <div className={cx(styles.thumb, styles.placeholder, className)}>
      <CategoryIcon category={category} className={styles.icon} />
      <span className={styles.label}>{POST_CATEGORY_LABEL[category]}</span>
    </div>
  )
}
