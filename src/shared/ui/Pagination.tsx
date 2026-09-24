import { Link, type To } from 'react-router-dom'

import { ChevronLeftIcon, ChevronRightIcon } from './icons'
import styles from './Pagination.module.css'

interface PaginationProps {
  /** 지금 페이지. **1부터** */
  page: number
  totalPages: number
  /** 페이지 번호 → 주소. 링크라서 새 탭 열기 · 주소 복사가 된다 */
  hrefFor: (page: number) => To
  /** 링크를 누른 직후. 목록 맨 위로 옮길 때 쓴다 */
  onNavigate?: () => void
}

type Slot = number | 'gap'

/** 1 … 4 5 6 … 12 처럼 처음 · 끝 · 지금 앞뒤만 남긴다. 칸 수가 7을 넘지 않아 폭이 흔들리지 않는다 */
function pageSlots(page: number, total: number): Slot[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const shown = new Set([1, total, page - 1, page, page + 1])
  if (page <= 3) [2, 3, 4].forEach((n) => shown.add(n))
  if (page >= total - 2) [total - 3, total - 2, total - 1].forEach((n) => shown.add(n))

  const sorted = [...shown].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)
  const slots: Slot[] = []
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) slots.push('gap')
    slots.push(n)
  })
  return slots
}

/** 페이지 이동. 한 페이지뿐이면 그리지 않는다 */
export function Pagination({ page, totalPages, hrefFor, onNavigate }: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const hasPrev = page > 1
  const hasNext = page < totalPages

  return (
    <nav className={styles.nav} aria-label="페이지 이동">
      {hasPrev ? (
        <Link className={styles.step} to={hrefFor(page - 1)} onClick={onNavigate}>
          <ChevronLeftIcon />
          이전
        </Link>
      ) : (
        <span className={styles.step} aria-disabled="true">
          <ChevronLeftIcon />
          이전
        </span>
      )}

      <ol className={styles.pages} role="list">
        {pageSlots(page, totalPages).map((slot, i) =>
          slot === 'gap' ? (
            <li key={`gap-${i}`} className={styles.gap} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={slot}>
              <Link
                className={styles.page}
                to={hrefFor(slot)}
                aria-label={`${slot}페이지`}
                aria-current={slot === page ? 'page' : undefined}
                onClick={onNavigate}
              >
                {slot}
              </Link>
            </li>
          ),
        )}
      </ol>

      <p className={styles.compact}>
        <span className="sr-only">
          전체 {totalPages}페이지 중 {page}페이지
        </span>
        <span aria-hidden="true">
          <strong>{page}</strong> / {totalPages}
        </span>
      </p>

      {hasNext ? (
        <Link className={styles.step} to={hrefFor(page + 1)} onClick={onNavigate}>
          다음
          <ChevronRightIcon />
        </Link>
      ) : (
        <span className={styles.step} aria-disabled="true">
          다음
          <ChevronRightIcon />
        </span>
      )}
    </nav>
  )
}
