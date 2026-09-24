/**
 * 회원 응답 타입.
 * 원본 : Lost-and-Found `dto/response/MemberResponse`
 */

/** `GET /api/members/me` 응답. 작성자 본인 판정은 닉네임이 아니라 `id` 로 한다 */
export interface MemberResponse {
  id: number
  email: string
  nickname: string
  /** 가입일시. `LocalDateTime` — 시간대 오프셋이 없다 */
  createdAt: string
}
