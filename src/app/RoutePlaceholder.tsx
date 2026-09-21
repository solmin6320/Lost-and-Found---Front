import styles from './RoutePlaceholder.module.css'

interface RoutePlaceholderProps {
  /** 화면 이름 */
  title: string
  /** 대응하는 기능명세서 항목. 예: '[4.2] 게시글 목록 조회' */
  spec: string
  /** 이 화면에서 반드시 다뤄야 할 것 한 줄 */
  note?: string
}

/**
 * 라우팅만 확인하기 위한 임시 자리표시자.
 * 화면 구현이 들어오면 이 컴포넌트와 파일은 지운다.
 */
export function RoutePlaceholder({ title, spec, note }: RoutePlaceholderProps) {
  return (
    <section className={styles.placeholder}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.spec}>기능명세서 {spec}</p>
      {note ? <p className={styles.note}>{note}</p> : null}
    </section>
  )
}
