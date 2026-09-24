/**
 * 게시글 요청·응답 타입.
 * 원본 : Lost-and-Found `entity/PostType·PostCategory·PostStatus`,
 *        `dto/response/PostListResponse`, `dto/request/PostSearchCondition`
 *
 * Enum 은 TS `enum` 대신 값 배열로 둔다. 필터 선택지와 URL 값 검증에 그대로 쓴다.
 * 백엔드 Enum 에 값이 늘면 여기도 같이 늘려야 한다.
 */

/** 분실 · 습득 */
export const POST_TYPES = ['LOST', 'FOUND'] as const
export type PostType = (typeof POST_TYPES)[number]

/** 지갑 · 전자기기 · 카드 · 의류 · 기타 */
export const POST_CATEGORIES = ['WALLET', 'ELECTRONICS', 'CARD', 'CLOTHES', 'ETC'] as const
export type PostCategory = (typeof POST_CATEGORIES)[number]

/** 게시중 · 연락중 · 완료. 완료는 되돌릴 수 없다([4.6]) */
export const POST_STATUSES = ['OPEN', 'IN_PROGRESS', 'DONE'] as const
export type PostStatus = (typeof POST_STATUSES)[number]

function isOneOf<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (values as readonly string[]).includes(value)
}

/**
 * URL 쿼리스트링처럼 밖에서 들어온 값을 Enum 으로 좁힌다.
 * 없는 값을 그대로 보내면 백엔드가 400 을 준다.
 */
export const isPostType = (value: unknown): value is PostType => isOneOf(POST_TYPES, value)
export const isPostCategory = (value: unknown): value is PostCategory =>
  isOneOf(POST_CATEGORIES, value)
export const isPostStatus = (value: unknown): value is PostStatus => isOneOf(POST_STATUSES, value)

/** `GET /api/posts` 의 항목 하나. 본문(`content`)·이미지·작성자 id 는 없다 */
export interface PostListResponse {
  id: number
  /** 작성자 닉네임. 목록에는 `memberId` 가 없어 본인 판정을 할 수 없다 */
  nickname: string
  type: PostType
  title: string
  category: PostCategory
  location: string
  /** 분실·습득일. `LocalDate` — `"2026-09-20"` */
  lostFoundDate: string
  status: PostStatus
  viewCount: number
  /** 등록일시. `LocalDateTime` — 시간대 오프셋이 없다 (`"2026-09-21T14:03:11.123456"`) */
  createdAt: string
}

/**
 * `GET /api/posts` 검색 조건. 이름이 백엔드 쿼리 파라미터와 같다.
 * 비워 둔 조건은 적용되지 않는다.
 */
export interface PostSearchCondition {
  /** 제목 또는 본문 부분 일치 */
  keyword?: string
  type?: PostType
  category?: PostCategory
  status?: PostStatus
  /** 장소 부분 일치 */
  location?: string
  /** 분실·습득일 시작(포함). `"yyyy-MM-dd"` */
  from?: string
  /** 분실·습득일 끝(포함). `from` 보다 앞이면 400 `INVALID_INPUT` */
  to?: string
}

/** 검색 조건 + 페이지. 정렬은 등록일 내림차순 고정이라 받지 않는다(서버가 `sort` 를 무시한다) */
export interface PostListParams extends PostSearchCondition {
  /** **0부터** 센다. 기본 0 */
  page?: number
  /** 기본 20, 최대 100. 넘기면 서버가 100 으로 자른다 */
  size?: number
}
