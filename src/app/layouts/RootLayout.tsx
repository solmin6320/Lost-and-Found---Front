import { Link, Outlet, useLocation } from 'react-router-dom'

import { paths } from '@/app/paths'
import { useAuth } from '@/features/auth'
import { ButtonLink } from '@/shared/ui/Button'
import { PlusIcon } from '@/shared/ui/icons'

import { AccountMenu } from './AccountMenu'
import styles from './RootLayout.module.css'

/**
 * 모든 화면이 공유하는 껍데기. 헤더 · 본문 · 푸터.
 *
 * 헤더는 셋만 둔다 — 로고(목록으로), [글 올리기], 로그인/계정.
 * [글 올리기]는 비로그인에게도 보인다. 수정·삭제와 달리 서비스로 들어오는 동선이다(SCR-01).
 */
export function RootLayout() {
  return (
    <div className={styles.shell}>
      <a className="skip-link" href="#main">
        본문으로 건너뛰기
      </a>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.wordmark} to={paths.postList}>
            <BrandMark />
            분실물 찾기
          </Link>

          <div className={styles.actions}>
            <CreatePostLink />
            <HeaderAuth />
          </div>
        </div>
      </header>

      <main className={styles.main} id="main">
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>분실물 찾기 · 개인 프로젝트</div>
      </footer>
    </div>
  )
}

/** 비로그인이면 로그인을 거쳐 등록 화면으로 돌아온다 */
function CreatePostLink() {
  const auth = useAuth()
  const to =
    auth.status === 'anonymous' ? paths.loginThenReturn(paths.postCreate) : paths.postCreate

  return (
    <ButtonLink to={to} variant="primary" size="sm" className={styles.create}>
      <PlusIcon />글 올리기
    </ButtonLink>
  )
}

/**
 * 세션 복구 중(`unknown`)에는 자리만 잡는다. [로그인]을 먼저 그렸다가 닉네임으로 바꾸면
 * 로그인한 사용자에게 매번 "로그아웃됐나?" 하는 깜빡임이 보인다.
 */
function HeaderAuth() {
  const auth = useAuth()
  const location = useLocation()

  if (auth.status === 'unknown') {
    return <span className={styles.authPending} aria-hidden="true" />
  }

  if (auth.status === 'anonymous') {
    const here = `${location.pathname}${location.search}`
    const onAuthScreen = location.pathname === paths.login || location.pathname === paths.signup
    const to = here === paths.postList || onAuthScreen ? paths.login : paths.loginThenReturn(here)

    return (
      <ButtonLink to={to} variant="secondary" size="sm" className={styles.login}>
        로그인
      </ButtonLink>
    )
  }

  // 화면을 옮기면 펼친 메뉴를 닫는다
  return <AccountMenu key={location.pathname} me={auth.me} onLogout={auth.logout} />
}

/**
 * 꼬리표 두 장. 보관소에서 물건에 다는 이름표다 — 잃어버린 쪽(마리골드)과 주운 쪽(코발트)이 겹친다.
 * 사진 없는 '기타' 게시글의 포스터와 같은 모양이다.
 */
function BrandMark() {
  const tag =
    'M12 1.8 17.3 6.3a1.6 1.6 0 0 1 .6 1.23V20.4a1.6 1.6 0 0 1-1.6 1.6H7.7a1.6 1.6 0 0 1-1.6-1.6V7.53a1.6 1.6 0 0 1 .6-1.23Z'
  return (
    <svg className={styles.mark} viewBox="0 0 30 24" aria-hidden="true" focusable="false">
      <g transform="translate(7.5 0.4) rotate(14 12 12)">
        <path d={tag} fill="var(--found-face)" />
        <circle cx="12" cy="7.9" r="1.65" fill="var(--paper)" />
      </g>
      <g transform="translate(-0.5 0.6) rotate(-12 12 12)">
        <path d={tag} fill="var(--lost-face)" stroke="var(--paper)" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="12" cy="7.9" r="1.65" fill="var(--paper)" />
      </g>
    </svg>
  )
}
