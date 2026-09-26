/**
 * 회원 요청·응답 타입.
 * 원본 : Lost-and-Found `dto/response/MemberResponse`,
 *        `dto/request/NicknameUpdateRequest`, `dto/request/PasswordUpdateRequest`
 */

/** `GET /api/members/me` 응답. 작성자 본인 판정은 닉네임이 아니라 `id` 로 한다 */
export interface MemberResponse {
  id: number
  email: string
  nickname: string
  /** 가입일시. `LocalDateTime` — 시간대 오프셋이 없다 */
  createdAt: string
}

/**
 * [3.6] `PATCH /api/members/me` 본문. 백엔드 검증 : `@NotBlank` · `@Size(max = 20)`.
 * 서버는 앞뒤 공백을 잘라 내지 않는다. 보낸 문자열이 그대로 저장된다.
 */
export interface NicknameUpdateRequest {
  nickname: string
}

/** [3.6] `PATCH /api/members/me/password` 본문 */
export interface PasswordUpdateRequest {
  /** 지금 비밀번호. `@NotBlank` 만 있고 길이 제한은 없다 */
  currentPassword: string
  /** 새 비밀번호. `@NotBlank` · `@Size(min = 8, max = 20)`. 문자 종류 규칙은 없다 */
  password: string
}

/**
 * 백엔드 `@Size` 와 같은 값. 입력창 `maxLength` · 글자 수 카운터 · 제출 전 안내에 쓴다.
 * 판정은 서버가 한다 — 여기를 통과해도 `INVALID_INPUT` 이 올 수 있다.
 * Java `String.length()` 와 JS `.length` 는 둘 다 UTF-16 단위로 센다. 이모지는 양쪽 모두 2자다.
 */
export const NICKNAME_MAX_LENGTH = 20
export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 20
