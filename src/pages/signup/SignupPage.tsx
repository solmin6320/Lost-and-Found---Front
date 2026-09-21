import { RoutePlaceholder } from '@/app/RoutePlaceholder'

/** [3.1] 회원가입 */
export function SignupPage() {
  return (
    <RoutePlaceholder
      title="회원가입"
      spec="[3.1] 회원가입"
      note="이메일·닉네임 중복은 409로 온다. 서버 메시지를 해당 필드 아래에 붙인다."
    />
  )
}
