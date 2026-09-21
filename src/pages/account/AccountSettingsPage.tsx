import { RoutePlaceholder } from '@/app/RoutePlaceholder'

/** [3.7] 내 정보 조회 + [3.6] 닉네임·비밀번호 수정 */
export function AccountSettingsPage() {
  return (
    <RoutePlaceholder
      title="내 정보"
      spec="[3.7] 내 정보 조회 · [3.6] 닉네임·비밀번호 수정"
      note="비밀번호를 바꾸면 서버가 리프레시 토큰을 지운다. 바꾼 뒤에는 로그인 화면으로 보낸다."
    />
  )
}
