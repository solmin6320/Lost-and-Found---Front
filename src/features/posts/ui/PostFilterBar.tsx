import { cx } from '@/shared/lib/cx'
import { ChevronDownIcon, CloseIcon } from '@/shared/ui/icons'

import {
  POST_FILTER_FIELDS,
  POST_FILTER_FIELD_NAME,
  filterValueLabel,
  type PostFilterField,
  type PostListSearch,
} from '../model/postListSearch'
import styles from './FilterChips.module.css'

interface PostFilterBarProps {
  search: PostListSearch
  /** 시트를 열고 그 필드로 포커스를 옮긴다 */
  onOpen: (field: PostFilterField) => void
  onRemove: (field: PostFilterField) => void
}

/**
 * 좁은 화면의 필터 입구. 필드마다 칩 하나 — 무엇으로 좁힐 수 있는지가 한 줄에 보인다.
 * 걸린 칩은 값을 보여주고(`카테고리: 지갑`) 옆에 지우기 버튼이 붙는다.
 * 걸린 칩을 앞으로 모은다. 320px 에서는 칩 세 개 남짓만 보여, 뒤쪽에 걸린 조건이 화면 밖에 숨으면
 * "왜 결과가 적지" 를 풀 수 없다. 걸리지 않은 칩끼리의 순서는 그대로다.
 */
export function PostFilterBar({ search, onOpen, onRemove }: PostFilterBarProps) {
  const fields = [...POST_FILTER_FIELDS].sort(
    (a, b) => Number(filterValueLabel(search, b) !== null) - Number(filterValueLabel(search, a) !== null),
  )

  return (
    <div className={styles.bar} role="group" aria-label="필터">
      {fields.map((field) => {
        const name = POST_FILTER_FIELD_NAME[field]
        const value = filterValueLabel(search, field)

        if (!value) {
          return (
            <button
              key={field}
              type="button"
              className={styles.trigger}
              aria-haspopup="dialog"
              onClick={() => onOpen(field)}
            >
              {name}
              <ChevronDownIcon />
            </button>
          )
        }

        return (
          <span key={field} className={cx(styles.trigger, styles.triggerActive)}>
            <button
              type="button"
              className={styles.triggerMain}
              aria-haspopup="dialog"
              onClick={() => onOpen(field)}
            >
              {name}: {value}
            </button>
            <button
              type="button"
              className={styles.triggerClear}
              aria-label={`${name}: ${value} 조건 지우기`}
              onClick={() => onRemove(field)}
            >
              <CloseIcon />
            </button>
          </span>
        )
      })}
    </div>
  )
}
