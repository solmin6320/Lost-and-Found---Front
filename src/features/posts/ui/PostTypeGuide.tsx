import { TypeBadge } from './TypeBadge'
import styles from './PostTypeGuide.module.css'

/**
 * 글 두 갈래 안내 — 목록 카드에 붙는 이름표(분실 · 습득)가 무엇인지, 로그인하면 무엇을 올리는지.
 * 로그인 · 가입의 넓은 화면 왼쪽 칸에 둔다(좁은 화면에서는 폼이 먼저라 두지 않는다).
 * 배지는 목록과 같은 컴포넌트다 — 여기서 본 이름표를 목록에서 그대로 다시 만난다.
 */
export function PostTypeGuide() {
  return (
    <ul className={styles.guide} aria-label="올릴 수 있는 글">
      <li className={styles.item} data-type="LOST">
        <TypeBadge type="LOST" />
        <p className={styles.text}>
          <strong>잃어버렸다면 분실 글</strong>
          사진과 잃어버린 곳을 남겨 두면, 주운 사람이 댓글로 알려 줘요.
        </p>
      </li>
      <li className={styles.item} data-type="FOUND">
        <TypeBadge type="FOUND" />
        <p className={styles.text}>
          <strong>주웠다면 습득 글</strong>
          어디서 주웠는지 남겨 두면, 잃어버린 사람이 찾아봐요.
        </p>
      </li>
    </ul>
  )
}
