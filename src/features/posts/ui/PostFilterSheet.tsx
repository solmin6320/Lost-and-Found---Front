import { useCallback, useId, useRef, useState, type FormEvent } from 'react'

import { Button } from '@/shared/ui/Button'
import { Sheet } from '@/shared/ui/Sheet'

import {
  EMPTY_POST_FILTER_DRAFT,
  applyDraft,
  draftFromSearch,
  periodError,
  type PostFilterDraft,
  type PostFilterField,
  type PostListSearch,
} from '../model/postListSearch'
import { PostFilterFields } from './PostFilterFields'

interface PostFilterSheetProps {
  open: boolean
  onClose: () => void
  search: PostListSearch
  onApply: (next: PostListSearch) => void
  /** 칩에서 열었으면 그 묶음으로 바로 포커스를 옮긴다 */
  focusField?: PostFilterField
}

/**
 * 좁은 화면의 필터. 고르는 동안은 목록이 바뀌지 않고 [적용하기]에서 한 번에 반영한다 —
 * 조건 하나마다 목록이 뒤에서 다시 그려지면 무엇이 바뀌었는지 볼 수 없다.
 * 닫기 · Esc · 바깥 누름은 고른 것을 버린다. 연 쪽이 열 때마다 `key` 를 바꿔 새로 시작한다.
 */
export function PostFilterSheet({ open, onClose, search, onApply, focusField }: PostFilterSheetProps) {
  const formId = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [draft, setDraft] = useState<PostFilterDraft>(() => draftFromSearch(search))
  const error = periodError(draft)

  const initialFocus = useCallback(() => {
    const group = focusField ? formRef.current?.querySelector(`[data-field="${focusField}"]`) : null
    return (
      group?.querySelector<HTMLElement>('input:checked') ??
      group?.querySelector<HTMLElement>('input') ??
      null
    )
  }, [focusField])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (error) {
      formRef.current?.querySelector<HTMLInputElement>('input[name="period-to"]')?.focus()
      return
    }
    onApply(applyDraft(search, draft))
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="필터"
      initialFocus={initialFocus}
      footer={
        <>
          <Button onClick={() => setDraft(EMPTY_POST_FILTER_DRAFT)}>초기화</Button>
          <Button type="submit" form={formId} variant="primary" block>
            적용하기
          </Button>
        </>
      }
    >
      <form id={formId} ref={formRef} onSubmit={handleSubmit} noValidate>
        <PostFilterFields
          value={draft}
          onChange={(patch) => setDraft((current) => ({ ...current, ...patch }))}
          periodError={error}
        />
      </form>
    </Sheet>
  )
}
