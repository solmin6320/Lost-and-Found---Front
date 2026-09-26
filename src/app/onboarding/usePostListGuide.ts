import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import type { PostListEntryState } from '@/app/paths'

import { isOnboardingDone, takeGuideRequest, useGuideRequested } from './onboardingState'

function isJustSignedUp(state: unknown): boolean {
  return (state as Partial<PostListEntryState> | null)?.justSignedUp === true
}

/**
 * 목록이 온보딩 1층을 여는 때 — 둘뿐이다. 스스로 떠서 가리는 일은 이 밖에 없다.
 *   1. 가입 직후(`PostListEntryState`) + 아직 안 봤을 때. 신호는 읽자마자 기록에서 지운다 —
 *      새로고침 · 뒤로가기로 다시 뜨지 않고, 저장소가 막힌 브라우저에서도 한 번으로 끝난다
 *   2. 헤더 `서비스 안내`를 눌렀을 때. 본 적이 있어도 연다(다른 화면에서 눌렀으면 목록으로 온 뒤에)
 */
export function usePostListGuide() {
  const location = useLocation()
  const navigate = useNavigate()
  const justSignedUp = isJustSignedUp(location.state)
  // 가입 화면이 목록으로 보내며 이 화면이 새로 그려진다 — 처음 그릴 때 한 번만 본다
  const [afterSignup, setAfterSignup] = useState(() => justSignedUp && !isOnboardingDone())
  const requested = useGuideRequested()

  useEffect(() => {
    if (!justSignedUp) return
    navigate({ pathname: location.pathname, search: location.search }, { replace: true, state: null })
  }, [justSignedUp, navigate, location.pathname, location.search])

  return {
    open: afterSignup || requested,
    close: () => {
      setAfterSignup(false)
      takeGuideRequest()
    },
  }
}
