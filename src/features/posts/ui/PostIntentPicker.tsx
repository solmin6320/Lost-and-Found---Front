import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { Link, type To } from 'react-router-dom'

import { CloseIcon } from '@/shared/ui/icons'

import type { PostType } from '../api/types'
import { POST_INTENTS, intentHintTail, type PostIntent } from '../model/postIntent'
import { postListQueryOptions } from '../model/postQueries'
import styles from './PostIntentPicker.module.css'

interface PostIntentPickerProps {
  /** 지금 목록에 걸린 유형. 의도가 아니라 **보여주는 글의 유형**이다 */
  selected: PostType | undefined
  /** 유형 → 주소. `undefined` 는 전체. 검색어 · 필터는 그대로 두고 1쪽으로 간다 */
  hrefFor: (type: PostType | undefined) => To
}

/**
 * 첫 화면의 두 갈래 — `물건을 잃어버렸어요` / `물건을 주웠어요`.
 * 분실/습득은 필터 하나가 아니라 이 서비스의 구조라 맨 위에 큰 색 면으로 둔다.
 *
 * 둘 다 링크다(새 탭 열기 · 주소 공유). 고른 쪽은 `aria-current` 로 알리고, 옆의 [×] 로 전체로 돌아간다.
 * 다른 쪽을 누르면 바로 갈아탄다. 고른 쪽을 다시 눌러도 같은 주소라 기록이 쌓이지 않는다.
 */
export function PostIntentPicker({ selected, hrefFor }: PostIntentPickerProps) {
  const listRef = useRef<HTMLUListElement>(null)
  /** [×] 는 누르면 사라진다. 전체로 돌아간 뒤 방금 풀린 선택지로 포커스를 옮긴다 */
  const refocus = useRef<PostType | null>(null)

  useEffect(() => {
    const concept = refocus.current
    if (!concept) return
    refocus.current = null
    listRef.current?.querySelector<HTMLElement>(`[data-concept="${concept}"] a`)?.focus()
  }, [selected])

  return (
    <ul ref={listRef} className={styles.intents} role="list" aria-label="무엇을 찾나요">
      {POST_INTENTS.map((intent) => {
        const on = selected === intent.shows
        return (
          <li
            key={intent.concept}
            className={styles.item}
            data-concept={intent.concept}
            data-state={on ? 'on' : selected ? 'off' : 'idle'}
          >
            <Link className={styles.choice} to={hrefFor(intent.shows)} aria-current={on ? 'true' : undefined}>
              <span className={styles.label}>
                <span>{intent.label[0]}</span> <span>{intent.label[1]}</span>
              </span>
              <IntentHint intent={intent} on={on} />
              <TagMark className={styles.art} />
            </Link>
            {on ? (
              <Link
                className={styles.reset}
                to={hrefFor(undefined)}
                aria-label="선택 풀고 모든 글 보기"
                onClick={() => {
                  refocus.current = intent.concept
                }}
              >
                <CloseIcon />
              </Link>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

/**
 * 무엇을 보게 되는지 한 줄 — "주워진 물건 · 12건 보기". 좁은 칸에서는 두 조각을 두 줄로 끊는다.
 * 건수는 목록과 별개로 불러온다 — 목록을 막지 않는다.
 * 불러오는 동안 숫자 자리를 비워 두어 글자가 밀리지 않고, 실패하면 숫자 대신 "모두" 를 쓴다.
 */
function IntentHint({ intent, on }: { intent: PostIntent; on: boolean }) {
  const count = useQuery({
    ...postListQueryOptions({ type: intent.shows, size: 1 }),
    select: (data) => data.page.totalElements,
  })

  if (count.isPending) {
    return (
      <span className={styles.hint}>
        <span className="sr-only">
          {intent.sees} {intentHintTail(undefined, on)}
        </span>
        <span aria-hidden="true">{intent.sees}</span>{' '}
        <span aria-hidden="true">
          <span className={styles.countPending} />건 {on ? '보는 중' : '보기'}
        </span>
      </span>
    )
  }

  return (
    <span className={styles.hint}>
      <span>{intent.sees}</span> <span>{intentHintTail(count.isSuccess ? count.data : undefined, on)}</span>
    </span>
  )
}

/** 선택지 귀퉁이의 큰 꼬리표. 로고와 같은 모양이다 — 분실물 보관소의 이름표 */
function TagMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 1.8 17.3 6.3a1.6 1.6 0 0 1 .6 1.23V20.4a1.6 1.6 0 0 1-1.6 1.6H7.7a1.6 1.6 0 0 1-1.6-1.6V7.53a1.6 1.6 0 0 1 .6-1.23Z"
        fill="currentColor"
      />
      <circle cx="12" cy="7.9" r="1.65" fill="var(--intent-face)" />
    </svg>
  )
}
