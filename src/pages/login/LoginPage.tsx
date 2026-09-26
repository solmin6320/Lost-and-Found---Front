import { RoutePlaceholder } from '@/app/RoutePlaceholder'

/**
 * [3.2] 로그인 — 5회 실패 시 423 Locked(30분)
 *
 * 단계 2 할 일 : `location.state` 의 `LoginNoticeState.notice`(app/paths)를 폼 위에 띄운다.
 * 설정 화면에서 비밀번호를 바꾸면 "비밀번호를 바꿨습니다. 다시 로그인하세요." 가 넘어온다(SCR-05 · SCR-08).
 */
export function LoginPage() {
  return (
    <RoutePlaceholder
      title="로그인"
      spec="[3.2] 로그인"
      note="5회 실패하면 423으로 30분 잠긴다. 잠김 화면을 따로 만든다."
    />
  )
}
