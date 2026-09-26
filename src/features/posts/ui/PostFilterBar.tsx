import { useEffect, useRef } from 'react'

import { cx } from '@/shared/lib/cx'
import { CaretDown, X } from '@/shared/ui/icons'

import {
  POST_FILTER_FIELDS,
  POST_FILTER_FIELD_NAME,
  filterValueLabel,
  postListSearchKey,
  type PostFilterField,
  type PostListSearch,
} from '../model/postListSearch'
import styles from './FilterChips.module.css'

interface PostFilterBarProps {
  search: PostListSearch
  /** 시트를 열고 그 필드로 포커스를 옮긴다 */
  onOpen: (field: PostFilterField) => void
  onRemove: (field: PostFilterField) => void
  /**
   * 있으면 줄 맨 앞에 [전체 해제] 를 둔다. 필터가 걸렸을 때만 넘긴다.
   * 같은 일을 하는 버튼이 화면에 이미 있으면(조건 검색 0건의 [필터 초기화]) 넘기지 않는다
   */
  onClearAll?: () => void
}

/**
 * 필터의 입구 — 모든 폭에서 이 한 줄이다. 필드마다 칩 하나, 무엇으로 좁힐 수 있는지가 한 줄에 보인다.
 * 걸린 칩은 값을 보여주고(`카테고리: 지갑`) 옆에 지우기 버튼이 붙는다.
 * 걸린 칩을 앞으로 모은다. 320px 에서는 칩 세 개 남짓만 보여, 뒤쪽에 걸린 조건이 화면 밖에 숨으면
 * "왜 결과가 적지" 를 풀 수 없다. 걸리지 않은 칩끼리의 순서는 그대로다.
 *
 * [전체 해제] 는 줄 맨 앞이다. 결과 제목 줄에 두면 생길 때마다 그 줄이 접혀 피드가 밀렸다.
 */
export function PostFilterBar({ search, onOpen, onRemove, onClearAll }: PostFilterBarProps) {
  const barRef = useRef<HTMLDivElement>(null)
  const refocusField = useRef<PostFilterField | null>(null)
  const searchKey = postListSearchKey(search)

  // 지운 칩은 다른 모양의 버튼으로 바뀐다. 바뀐 칩이 그려진 뒤에 같은 필드의 칩으로 포커스를 되돌린다.
  // 주소 변경은 transition 으로 늦게 그려져, 누른 직후에는 아직 옛 칩이 남아 있다
  useEffect(() => {
    const field = refocusField.current
    if (!field) return
    refocusField.current = null
    barRef.current?.querySelector<HTMLElement>(`[data-filter-field="${field}"]`)?.focus()
  }, [searchKey])

  function handleRemove(field: PostFilterField) {
    refocusField.current = field
    onRemove(field)
  }

  const fields = [...POST_FILTER_FIELDS].sort(
    (a, b) => Number(filterValueLabel(search, b) !== null) - Number(filterValueLabel(search, a) !== null),
  )

  return (
    <div ref={barRef} className={styles.bar} role="group" aria-label="필터">
      {onClearAll ? (
        <button type="button" className={styles.clearAll} onClick={onClearAll}>
          전체 해제
        </button>
      ) : null}

      {fields.map((field) => {
        const name = POST_FILTER_FIELD_NAME[field]
        const value = filterValueLabel(search, field)

        if (!value) {
          return (
            <button
              key={field}
              type="button"
              className={styles.trigger}
              data-filter-field={field}
              aria-haspopup="dialog"
              onClick={() => onOpen(field)}
            >
              {name}
              <CaretDown />
            </button>
          )
        }

        // 값이 길면(장소 100자) 칩 안에서 자른다. 전체 값은 마우스를 올리면(title) · 시트를 열면 보인다
        return (
          <span key={field} className={cx(styles.trigger, styles.triggerActive)}>
            <button
              type="button"
              className={styles.triggerMain}
              data-filter-field={field}
              aria-haspopup="dialog"
              title={`${name}: ${value}`}
              onClick={() => onOpen(field)}
            >
              {name}: <span className={styles.value}>{value}</span>
            </button>
            <button
              type="button"
              className={styles.triggerClear}
              aria-label={`${name}: ${value} 조건 지우기`}
              onClick={() => handleRemove(field)}
            >
              <X />
            </button>
          </span>
        )
      })}
    </div>
  )
}
