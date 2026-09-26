import { useId, useRef, useState, type FormEvent } from 'react'

import { MagnifyingGlass, X } from '@/shared/ui/icons'

import { KEYWORD_MAX_LENGTH } from '../model/postListSearch'
import styles from './PostSearchBar.module.css'

interface PostSearchBarProps {
  /** 지금 적용된 검색어. 바뀌면(뒤로가기) 입력칸을 새로 시작하도록 연 쪽이 `key` 로 준다 */
  keyword: string
  /**
   * 검색어를 적용한다(지울 때는 `''`). 입력칸은 `key` 때문에 새로 그려져 포커스를 잃으므로,
   * 포커스는 연 쪽이 결과 제목으로 옮긴다 — 휴대폰 키보드도 그때 내려간다
   */
  onSearch: (keyword: string) => void
}

/**
 * 제목·본문 검색. 한 글자마다 요청하지 않고 Enter(휴대폰 키보드의 [검색])에서 보낸다 —
 * 뒤로가기 기록이 글자 수만큼 쌓이지 않는다.
 * 보낸 뒤 포커스는 결과 제목으로 간다(연 쪽이 옮긴다). `blur()` 로 버리지 않는다 — 포커스가 문서 맨 앞으로 빠진다.
 */
export function PostSearchBar({ keyword, onSearch }: PostSearchBarProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [text, setText] = useState(keyword)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSearch(text.trim())
  }

  // 적용된 검색어를 지우면 목록이 바뀐다 — 결과로 간다. 치던 글자만 지우면 그 자리에서 다시 친다
  function handleClear() {
    setText('')
    if (keyword) {
      onSearch('')
    } else {
      inputRef.current?.focus()
    }
  }

  return (
    <form role="search" className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor={inputId} className="sr-only">
        검색어
      </label>
      <MagnifyingGlass className={styles.lead} />
      <input
        ref={inputRef}
        id={inputId}
        className={styles.input}
        type="search"
        name="keyword"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="물건 이름으로 검색"
        maxLength={KEYWORD_MAX_LENGTH}
        autoComplete="off"
        enterKeyHint="search"
      />
      {text ? (
        <button type="button" className={styles.clear} aria-label="검색어 지우기" onClick={handleClear}>
          <X />
        </button>
      ) : null}
    </form>
  )
}
