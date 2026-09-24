import { cx } from '@/shared/lib/cx'

import { Button } from './Button'
import { AlertIcon, RetryIcon } from './icons'
import styles from './StatePanel.module.css'

interface ErrorStateProps {
  /**
   * 서버 `message` 그대로. `getErrorMessage(error)` 로 얻는다.
   * 프론트가 문구를 새로 짓지 않는다 — 같은 상황에 문장이 두 개 생긴다.
   */
  message: string
  /** 있으면 `[다시 시도]` 를 둔다. 오류 화면에는 나갈 문이 있어야 한다 */
  onRetry?: () => void
  /** 다시 불러오는 중. 버튼을 잠가 요청이 겹치지 않게 한다 */
  retrying?: boolean
  className?: string
}

/** 불러오기 실패. 콘텐츠가 있던 자리를 대신한다 */
export function ErrorState({ message, onRetry, retrying = false, className }: ErrorStateProps) {
  return (
    <div className={cx(styles.panel, className)}>
      <span className={styles.icon} aria-hidden="true">
        <AlertIcon />
      </span>
      <p className={styles.title} role="alert">
        {message}
      </p>
      {onRetry ? (
        <div className={styles.action}>
          <Button onClick={onRetry} disabled={retrying}>
            <RetryIcon />
            {retrying ? '다시 불러오는 중…' : '다시 시도'}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
