import { Button } from '@/shared/ui/Button'
import { CloseIcon } from '@/shared/ui/icons'

import {
  POST_FILTER_FIELDS,
  POST_FILTER_FIELD_NAME,
  filterValueLabel,
  type PostFilterField,
  type PostListSearch,
} from '../model/postListSearch'
import styles from './FilterChips.module.css'

interface ActiveFilterListProps {
  search: PostListSearch
  onRemove: (field: PostFilterField) => void
  onClearAll: () => void
}

/**
 * 걸려 있는 필터를 칩으로 늘어놓는다. 누르면 그 조건만 지운다. `[전체 해제]`는 항상 끝에 있다.
 * 필터를 걸어 둔 걸 잊고 "왜 결과가 없지" 하는 것이 목록에서 가장 흔한 실패다.
 */
export function ActiveFilterList({ search, onRemove, onClearAll }: ActiveFilterListProps) {
  const items = POST_FILTER_FIELDS.flatMap((field) => {
    const value = filterValueLabel(search, field)
    return value ? [{ field, value }] : []
  })

  if (items.length === 0) {
    return null
  }

  return (
    <ul className={styles.active} role="list" aria-label="적용된 필터">
      {items.map(({ field, value }) => (
        <li key={field}>
          <button
            type="button"
            className={styles.removable}
            onClick={() => onRemove(field)}
            aria-label={`${POST_FILTER_FIELD_NAME[field]}: ${value} 조건 지우기`}
          >
            <span className={styles.name}>{POST_FILTER_FIELD_NAME[field]}:</span>
            {value}
            <CloseIcon />
          </button>
        </li>
      ))}
      <li>
        <Button variant="ghost" size="sm" onClick={onClearAll}>
          전체 해제
        </Button>
      </li>
    </ul>
  )
}
