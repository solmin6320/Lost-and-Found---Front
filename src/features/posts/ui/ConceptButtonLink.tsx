import { Link, type LinkProps } from 'react-router-dom'

import { cx } from '@/shared/lib/cx'
import { Plus } from '@/shared/ui/icons'

import type { PostType } from '../api/types'
import styles from './ConceptButtonLink.module.css'

interface ConceptButtonLinkProps extends LinkProps {
  /** 이 버튼이 올리는 글의 유형. 색이 이것을 따른다 — 분실 글 올리기는 분실 색 */
  concept: PostType
}

/**
 * 한쪽 개념에 묶인 "글 올리기" 버튼. 공통 버튼은 색을 쓰지 않으므로 여기서 입힌다.
 * 링크다 — 이동은 버튼이 아니다(새 탭 열기 · 주소 복사가 된다).
 */
export function ConceptButtonLink({ concept, className, children, ...rest }: ConceptButtonLinkProps) {
  return (
    <Link className={cx(styles.button, className)} data-concept={concept} {...rest}>
      <Plus />
      {children}
    </Link>
  )
}
