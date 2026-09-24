import { useId, useRef, useState, type FormEvent } from 'react'

import { CloseIcon, SearchIcon } from '@/shared/ui/icons'

import { KEYWORD_MAX_LENGTH } from '../model/postListSearch'
import styles from './PostSearchBar.module.css'

interface PostSearchBarProps {
  /** 지금 적용된 검색어. 바뀌면(뒤로가기) 입력칸을 새로 시작하도록 연 쪽이 `key` 로 준다 */
  keyword: string
  onSearch: (keyword: string) => void
}

/**
 * 제목·본문 검색. 한 글자마다 요청하지 않고 Enter(휴대폰 키보드의 [검색])에서 보낸다 —
 * 뒤로가기 기록이 글자 수만큼 쌓이지 않는다.
 */
export function PostSearchBar({ keyword, onSearch }: PostSearchBarProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [text, setText] = useState(keyword)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSearch(text.trim())
    // 휴대폰에서 키보드를 내려 결과가 보이게 한다
    inputRef.current?.blur()
  }

  function handleClear() {
    setText('')
    if (keyword) {
      onSearch('')
    }
    inputRef.current?.focus()
  }

  return (
    <form role="search" className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor={inputId} className="sr-only">
        검색어
      </label>
      <SearchIcon className={styles.lead} />
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
          <CloseIcon />
        </button>
      ) : null}
    </form>
  )
}
