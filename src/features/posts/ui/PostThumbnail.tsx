import { useState, type CSSProperties } from 'react'

import { cx } from '@/shared/lib/cx'

import type { PostCategory, PostType } from '../api/types'
import { POST_CATEGORY_LABEL } from '../model/labels'
import { CategoryArt } from './CategoryArt'
import styles from './PostThumbnail.module.css'

interface PostThumbnailProps {
  category: PostCategory
  /** 포스터의 색. 분실이면 마리골드, 습득이면 코발트 */
  type: PostType
  /**
   * 썸네일 주소. **목록 API(`PostListResponse`)는 아직 이미지를 주지 않는다.**
   * 백엔드가 필드를 추가하면 그 값을 넘기기만 하면 된다. 없으면 포스터가 대신한다.
   */
  src?: string
  /**
   * 게시글 제목. "이미지" 라고 쓰지 않는다.
   * 제목이 바로 옆에 글자로 있는 자리(목록 카드)에서는 `""` — 같은 제목을 두 번 읽지 않게
   */
  alt: string
  /** 포스터 그림을 조금씩 다르게 기울인다. 같은 카테고리가 이어져도 복사한 것처럼 보이지 않게 */
  seed?: number
  /** 첫 화면에 보이는 사진(목록 첫 줄)은 `eager`. 나머지는 스크롤에 닿을 때 받는다 */
  loading?: 'lazy' | 'eager'
  className?: string
}

/** 기울기 다섯 가지(도). 손으로 붙인 스티커처럼 보일 만큼만 */
const TILTS = [-7, 4, -3, 8, -5]

/**
 * 게시글 대표 사진. 1:1 로 자른다 — 세로 사진이 와도 카드 높이가 흔들리지 않는다.
 * 없거나 불러오지 못하면 **포스터**로 바꾼다 : 유형 색의 연한 바탕 + 큰 카테고리 그림 + 카테고리 이름.
 * 회색 네모를 두지 않는다. 사진 없는 글이 스무 장 이어져도 목록이 초라해 보이면 안 된다.
 */
export function PostThumbnail({
  category,
  type,
  src,
  alt,
  seed = 0,
  loading = 'lazy',
  className,
}: PostThumbnailProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  if (src && src !== failedSrc) {
    return (
      <img
        className={cx(styles.frame, styles.photo, className)}
        src={src}
        alt={alt}
        width={400}
        height={400}
        loading={loading}
        decoding="async"
        onError={() => setFailedSrc(src)}
      />
    )
  }

  const tilt = TILTS[Math.abs(seed) % TILTS.length]

  return (
    <div
      className={cx(styles.frame, styles.poster, className)}
      data-type={type}
      style={{ '--tilt': `${tilt}deg` } as CSSProperties}
    >
      <CategoryArt category={category} className={styles.art} />
      <span className={styles.label}>{POST_CATEGORY_LABEL[category]}</span>
    </div>
  )
}
