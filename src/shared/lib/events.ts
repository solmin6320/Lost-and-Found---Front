import type { MouseEvent } from 'react'

/**
 * 이 탭에서 그대로 이동하는 클릭인가. Ctrl · Cmd · Shift · Alt 를 누르거나 가운데 버튼이면
 * 브라우저가 새 탭 · 새 창 · 내려받기로 연다 — 이 화면은 바뀌지 않으니 포커스를 옮길 일도 없다
 */
export function isPlainClick(event: MouseEvent): boolean {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}
