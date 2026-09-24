import { useEffect, useRef } from 'react'

import { Button } from '@/shared/ui/Button'
import { CloseIcon } from '@/shared/ui/icons'

import {
  POST_FILTER_FIELDS,
  POST_FILTER_FIELD_NAME,
  filterValueLabel,
  postListSearchKey,
  type PostFilterField,
  type PostListSearch,
} from '../model/postListSearch'
import styles from './FilterChips.module.css'

interface ActiveFilterListProps {
  search: PostListSearch
  onRemove: (field: PostFilterField) => void
  onClearAll: () => void
  /** 칩이 전부 사라졌을 때 포커스를 받을 곳. 없으면 포커스가 문서 처음으로 튄다 */
  onEmptied?: () => void
}

/**
 * 걸려 있는 필터를 칩으로 늘어놓는다. 누르면 그 조건만 지운다. `[전체 해제]`는 항상 끝에 있다.
 * 필터를 걸어 둔 걸 잊고 "왜 결과가 없지" 하는 것이 목록에서 가장 흔한 실패다.
 */
export function ActiveFilterList({ search, onRemove, onClearAll, onEmptied }: ActiveFilterListProps) {
  const listRef = useRef<HTMLUListElement>(null)
  /** 지운 칩의 자리. 다시 그려진 뒤 그 자리의 칩(없으면 목록 밖)으로 포커스를 옮긴다 */
  const refocusIndex = useRef<number | null>(null)
  const searchKey = postListSearchKey(search)
  const onEmptiedRef = useRef(onEmptied)

  useEffect(() => {
    onEmptiedRef.current = onEmptied
  })
  const items = POST_FILTER_FIELDS.flatMap((field) => {
    const value = filterValueLabel(search, field)
    return value ? [{ field, value }] : []
  })

  // 누른 칩이 사라지면 그 자리의 다음 칩으로. 마지막 하나였으면 목록 밖으로.
  // 주소 변경은 transition 으로 늦게 그려지므로 조건이 바뀐 뒤에 옮긴다
  useEffect(() => {
    const index = refocusIndex.current
    if (index === null) return
    refocusIndex.current = null
    const buttons = listRef.current?.querySelectorAll<HTMLElement>('button')
    if (buttons && buttons.length > 0) {
      buttons[Math.min(index, buttons.length - 1)].focus()
    } else {
      onEmptiedRef.current?.()
    }
  }, [searchKey])

  if (items.length === 0) {
    return null
  }

  return (
    <ul ref={listRef} className={styles.active} role="list" aria-label="적용된 필터">
      {items.map(({ field, value }, index) => (
        <li key={field}>
          <button
            type="button"
            className={styles.removable}
            onClick={() => {
              refocusIndex.current = index
              onRemove(field)
            }}
            aria-label={`${POST_FILTER_FIELD_NAME[field]}: ${value} 조건 지우기`}
          >
            <span className={styles.name}>{POST_FILTER_FIELD_NAME[field]}:</span>
            {value}
            <CloseIcon />
          </button>
        </li>
      ))}
      <li>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            refocusIndex.current = Number.POSITIVE_INFINITY
            onClearAll()
          }}
        >
          전체 해제
        </Button>
      </li>
    </ul>
  )
}
