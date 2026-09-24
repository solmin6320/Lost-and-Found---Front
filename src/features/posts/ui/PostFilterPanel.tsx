import { useId, useRef, useState, type FormEvent } from 'react'

import { Button } from '@/shared/ui/Button'

import {
  applyDraft,
  draftFromSearch,
  periodError,
  toSearchParams,
  type PostFilterDraft,
  type PostListSearch,
} from '../model/postListSearch'
import { PostFilterFields } from './PostFilterFields'
import styles from './PostFilterPanel.module.css'

interface PostFilterPanelProps {
  search: PostListSearch
  onApply: (next: PostListSearch) => void
}

/**
 * 넓은 화면의 옆 열 필터. 펼쳐 둔 채로 쓴다.
 *
 * 선택지(유형·카테고리·상태)는 **고르는 즉시** 반영한다. 글자를 치는 장소와 날짜는
 * 한 글자마다 요청하지 않도록 [적용하기] 또는 Enter 에서 반영한다 — 연도 네 자리를 치는 동안
 * 0002년, 0020년… 으로 요청이 네 번 나간다.
 */
export function PostFilterPanel({ search, onApply }: PostFilterPanelProps) {
  const titleId = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const searchKey = toSearchParams(search).toString()
  const [draft, setDraft] = useState<PostFilterDraft>(() => draftFromSearch(search))
  const [syncedKey, setSyncedKey] = useState(searchKey)

  // 뒤로가기 등으로 주소가 바뀌면 입력칸을 주소에 맞춘다. 다시 그리지(remount) 않아 포커스가 남는다
  if (syncedKey !== searchKey) {
    setSyncedKey(searchKey)
    setDraft(draftFromSearch(search))
  }

  const applied = draftFromSearch(search)
  const error = periodError(draft)
  const typingDirty =
    draft.location.trim() !== applied.location || draft.from !== applied.from || draft.to !== applied.to

  function handleChange(patch: Partial<PostFilterDraft>) {
    const next = { ...draft, ...patch }
    setDraft(next)

    if ('type' in patch || 'category' in patch || 'status' in patch) {
      // 입력 중인 기간이 거꾸로면 그것만 빼고 반영한다. 보내면 400 이고 목록이 사라진다
      const safe = periodError(next) ? { ...next, from: applied.from, to: applied.to } : next
      onApply(applyDraft(search, safe))
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (error) {
      formRef.current?.querySelector<HTMLInputElement>('input[name="period-to"]')?.focus()
      return
    }
    onApply(applyDraft(search, draft))
  }

  return (
    <form
      ref={formRef}
      className={styles.panel}
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby={titleId}
    >
      <h2 id={titleId} className={styles.title}>
        필터
      </h2>
      <PostFilterFields value={draft} onChange={handleChange} periodError={error} />
      {typingDirty ? (
        <Button type="submit" variant="primary" block>
          장소·기간 적용하기
        </Button>
      ) : null}
    </form>
  )
}
