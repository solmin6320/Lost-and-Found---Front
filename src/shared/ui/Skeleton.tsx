import type { CSSProperties } from 'react'

import { cx } from '@/shared/lib/cx'

import styles from './Skeleton.module.css'

interface SkeletonProps {
  /** `text` 는 둘러싼 글자 크기에 맞춘 한 줄. `block` 은 크기를 직접 준다 */
  shape?: 'text' | 'block'
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  className?: string
}

/**
 * 로딩 자리표시. 스크린리더에는 숨긴다 — "불러오는 중"은 감싼 영역이 `aria-busy` 와 문장으로 알린다.
 * 조각마다 읽히면 "그룹, 그룹, 그룹…"이 된다.
 */
export function Skeleton({ shape = 'block', width, height, className }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cx(styles.skeleton, shape === 'text' && styles.text, className)}
      style={{ width, height }}
    />
  )
}
