import { useId, type CSSProperties } from 'react'

import { cx } from '@/shared/lib/cx'
import { todayIsoDate } from '@/shared/lib/date'
import { WarningCircle } from '@/shared/ui/icons'

import { POST_CATEGORIES, POST_STATUSES, type PostCategory, type PostStatus } from '../api/types'
import { POST_CATEGORY_LABEL, POST_STATUS_LABEL } from '../model/labels'
import {
  LOCATION_MAX_LENGTH,
  POST_FILTER_FIELD_NAME,
  type PostFilterDraft,
} from '../model/postListSearch'
import styles from './PostFilterFields.module.css'

interface PostFilterFieldsProps {
  value: PostFilterDraft
  onChange: (patch: Partial<PostFilterDraft>) => void
  /** 기간이 거꾸로일 때의 문구. 있으면 기간 아래에 붙는다 */
  periodError?: string | null
}

/**
 * 카테고리 · 상태 · 장소 · 기간. 입력만 한다 — 언제 적용할지는 감싼 쪽(시트)이 정한다.
 * 유형(분실/습득)은 여기 없다. 첫 화면의 의도 선택이 맡는다.
 * 각 묶음에 `data-field` 를 달아, 칩에서 시트를 열 때 그 묶음으로 바로 포커스를 옮긴다.
 */
export function PostFilterFields({ value, onChange, periodError }: PostFilterFieldsProps) {
  const id = useId()
  const today = todayIsoDate()
  const errorId = `${id}-period-error`

  return (
    <div className={styles.fields}>
      <ChoiceGroup
        field="category"
        name={`${id}-category`}
        columns={3}
        options={POST_CATEGORIES.map((category) => ({
          value: category,
          label: POST_CATEGORY_LABEL[category],
        }))}
        value={value.category}
        onChange={(category: PostCategory | undefined) => onChange({ category })}
      />

      <ChoiceGroup
        field="status"
        name={`${id}-status`}
        columns={4}
        options={POST_STATUSES.map((status) => ({ value: status, label: POST_STATUS_LABEL[status] }))}
        value={value.status}
        onChange={(status: PostStatus | undefined) => onChange({ status })}
      />

      <div className={styles.group} data-field="location">
        <label className={styles.legend} htmlFor={`${id}-location`}>
          {POST_FILTER_FIELD_NAME.location}
        </label>
        <input
          id={`${id}-location`}
          className={styles.input}
          type="text"
          value={value.location}
          onChange={(event) => onChange({ location: event.target.value })}
          maxLength={LOCATION_MAX_LENGTH}
          placeholder="예: 강남역"
          autoComplete="off"
          enterKeyHint="done"
        />
      </div>

      <fieldset className={styles.group} data-field="period" aria-describedby={`${id}-period-hint`}>
        <legend className={styles.legend}>{POST_FILTER_FIELD_NAME.period}</legend>
        {/* 등록일과 헷갈리지 않게 기준 날짜를 밝힌다(화면정의서 1.1) */}
        <p id={`${id}-period-hint`} className={styles.hint}>
          분실·습득일 기준
        </p>
        <div className={styles.period}>
          <label className={styles.dateField}>
            <span className={styles.dateLabel}>시작</span>
            <input
              className={cx(styles.input, styles.dateInput)}
              type="date"
              value={value.from}
              max={value.to || today}
              onChange={(event) => onChange({ from: event.target.value })}
            />
          </label>
          <label className={styles.dateField}>
            <span className={styles.dateLabel}>끝</span>
            <input
              className={cx(styles.input, styles.dateInput)}
              type="date"
              name="period-to"
              value={value.to}
              min={value.from || undefined}
              max={today}
              aria-invalid={periodError ? true : undefined}
              aria-describedby={periodError ? errorId : undefined}
              onChange={(event) => onChange({ to: event.target.value })}
            />
          </label>
        </div>
        {periodError ? (
          <p id={errorId} className={styles.error} role="alert">
            <WarningCircle />
            {periodError}
          </p>
        ) : null}
      </fieldset>
    </div>
  )
}

interface ChoiceGroupProps<T extends string> {
  field: 'category' | 'status'
  name: string
  options: { value: T; label: string }[]
  value: T | undefined
  onChange: (value: T | undefined) => void
  /** "전체"를 포함한 칸 수. 한 줄에 다 들어가거나 줄이 가지런히 끊기게 고른다 */
  columns: number
}

/** 단일 선택. 맨 앞의 "전체"가 조건 없음이다 — 백엔드도 필드당 값 하나만 받는다 */
function ChoiceGroup<T extends string>({
  field,
  name,
  options,
  value,
  onChange,
  columns,
}: ChoiceGroupProps<T>) {
  const all: { value: T | undefined; label: string } = { value: undefined, label: '전체' }

  return (
    <fieldset className={styles.group} data-field={field}>
      <legend className={styles.legend}>{POST_FILTER_FIELD_NAME[field]}</legend>
      <div className={styles.choices} style={{ '--choice-columns': columns } as CSSProperties}>
        {[all, ...options].map((option) => (
          <label key={option.value ?? 'all'} className={styles.choice}>
            <input
              className={styles.choiceInput}
              type="radio"
              name={name}
              value={option.value ?? ''}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className={styles.choiceLabel}>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
