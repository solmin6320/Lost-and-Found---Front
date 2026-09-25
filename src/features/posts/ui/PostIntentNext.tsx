import { useId } from 'react'

import type { PostIntent } from '../model/postIntent'
import { ConceptButtonLink } from './ConceptButtonLink'
import styles from './PostIntentNext.module.css'

interface PostIntentNextProps {
  intent: PostIntent
  /** 등록 화면 주소. 비로그인이면 로그인을 거친다 — 경로는 app 이 정한다 */
  to: string
}

/**
 * 의도를 고른 목록의 끝 — 찾는 글이 없을 때의 다음 행동.
 * 잃어버린 사람에게는 분실 글을, 주운 사람에게는 습득 글을 올려 두게 한다. 색은 올릴 글(내가 한 일)을 따른다.
 */
export function PostIntentNext({ intent, to }: PostIntentNextProps) {
  const titleId = useId()

  return (
    <aside className={styles.next} data-concept={intent.concept} aria-labelledby={titleId}>
      <div className={styles.text}>
        <h3 id={titleId} className={styles.title}>
          {intent.next.title}
        </h3>
        <p className={styles.description}>{intent.next.description}</p>
      </div>
      <ConceptButtonLink concept={intent.concept} to={to} className={styles.action}>
        {intent.next.action}
      </ConceptButtonLink>
    </aside>
  )
}
