import { RoutePlaceholder } from '@/app/RoutePlaceholder'

/** [3.2] 로그인 — 5회 실패 시 423 Locked(30분) */
export function LoginPage() {
  return (
    <RoutePlaceholder
      title="로그인"
      spec="[3.2] 로그인"
      note="5회 실패하면 423으로 30분 잠긴다. 잠김 화면을 따로 만든다."
    />
  )
}
