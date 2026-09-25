import type { PostType } from '../api/types'

/**
 * 첫 화면의 의도 선택 — `물건을 잃어버렸어요` / `물건을 주웠어요`.
 *
 * ⚠️ 사용자가 고르는 것(내가 한 일)과 목록에 거는 유형이 **엇갈린다.**
 *   잃어버린 사람이 알고 싶은 건 "누가 주웠나" → 습득(FOUND) 글을 보여준다
 *   주운 사람이 알고 싶은 건 "누가 찾고 있나" → 분실(LOST) 글을 보여준다
 * 그래서 선택지 아래에 **무엇을 보게 되는지**를 한 줄로 적는다.
 *
 * 색은 사용자가 한 일(`concept`)에 붙는다. `잃어버렸어요` 는 분실 색이고,
 * 결과 끝의 "분실 글 올리기" 도 분실 색이다. 보여주는 글(`shows`)의 색이 아니다.
 */
export interface PostIntent {
  /** 사용자가 한 일. 선택지의 색과 "올리기" 의 유형이 이것을 따른다 */
  concept: PostType
  /** 이 의도를 고르면 목록에 거는 `type` */
  shows: PostType
  /** 선택지 문구. 좁은 칸에서는 두 줄로 끊는다 */
  label: readonly [string, string]
  /** 선택지 아래 한 줄의 앞부분 — 무엇을 보게 되는지. 뒤에 "12건 보기" 가 붙는다 */
  sees: string
  /** 이 의도로 걸려 있을 때 결과 제목 */
  heading: string
  /** 결과 끝의 다음 행동. 찾는 글이 없으면 내 글을 올려 두게 한다 */
  next: { title: string; description: string; action: string }
  /** 이 의도만 걸었는데 글이 하나도 없을 때 */
  empty: { title: string; description: string }
}

const I_LOST: PostIntent = {
  concept: 'LOST',
  shows: 'FOUND',
  label: ['물건을', '잃어버렸어요'],
  sees: '주워진 물건',
  heading: '누군가 주워 둔 물건',
  next: {
    title: '찾는 물건이 없나요?',
    description: '분실 글을 올려 두면 주운 사람이 연락할 수 있어요.',
    action: '분실 글 올리기',
  },
  empty: {
    title: '아직 주워 둔 물건이 없어요.',
    description: '분실 글을 올려 두면 주운 사람이 연락할 수 있어요.',
  },
}

const I_FOUND: PostIntent = {
  concept: 'FOUND',
  shows: 'LOST',
  label: ['물건을', '주웠어요'],
  sees: '주인이 찾는 물건',
  heading: '주인이 찾고 있는 물건',
  next: {
    title: '주운 물건과 맞는 글이 없나요?',
    description: '습득 글을 올려 두면 잃어버린 사람이 찾아볼 수 있어요.',
    action: '습득 글 올리기',
  },
  empty: {
    title: '아직 주인이 찾는 물건이 없어요.',
    description: '습득 글을 올려 두면 잃어버린 사람이 찾아볼 수 있어요.',
  },
}

/** 화면 순서 그대로. 잃어버린 사람이 더 급하므로 앞에 둔다 */
export const POST_INTENTS: readonly PostIntent[] = [I_LOST, I_FOUND]

/** 목록에 걸린 `type` → 그 유형을 보여주는 의도. 유형이 없으면(전체) `undefined` */
export function intentShowing(type: PostType | undefined): PostIntent | undefined {
  return POST_INTENTS.find((intent) => intent.shows === type)
}

/**
 * 선택지 아래 한 줄의 뒷부분. 건수를 모르면(불러오는 중 · 실패) 숫자 대신 "모두".
 * 고른 쪽은 "보기" 가 "보는 중" 으로 바뀐다 — 지금 무엇이 걸려 있는지 선택지 자신이 말한다
 */
export function intentHintTail(count: number | undefined, active: boolean): string {
  const amount = count === undefined ? '모두' : `${count.toLocaleString('ko-KR')}건`
  return `${amount} ${active ? '보는 중' : '보기'}`
}

/** 유형을 걸지 않은 목록의 제목 */
export const ALL_POSTS_HEADING = '최근 올라온 물건'

export function postListHeading(type: PostType | undefined): string {
  return intentShowing(type)?.heading ?? ALL_POSTS_HEADING
}
