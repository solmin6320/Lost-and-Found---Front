import type { PostCategory, PostStatus, PostType } from '../api/types'

/**
 * 서버 Enum → 화면 표기(화면정의서 1.1). 화면에는 Enum 이름을 그대로 쓰지 않는다.
 * `Record` 로 둬서 백엔드 Enum 이 늘면 여기서 타입 오류가 난다.
 */

export const POST_TYPE_LABEL: Record<PostType, string> = {
  LOST: '분실',
  FOUND: '습득',
}

export const POST_CATEGORY_LABEL: Record<PostCategory, string> = {
  WALLET: '지갑',
  ELECTRONICS: '전자기기',
  CARD: '카드',
  CLOTHES: '의류',
  ETC: '기타',
}

export const POST_STATUS_LABEL: Record<PostStatus, string> = {
  OPEN: '게시중',
  IN_PROGRESS: '연락중',
  DONE: '완료',
}

/**
 * `lostFoundDate` 의 라벨. 등록일(`createdAt`)과 헷갈리지 않게 유형을 붙인다 — "분실일", "습득일"
 */
export function lostFoundDateLabel(type: PostType): string {
  return `${POST_TYPE_LABEL[type]}일`
}
