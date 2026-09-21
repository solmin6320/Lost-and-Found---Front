import { Link, NavLink, Outlet } from 'react-router-dom'

import { paths } from '@/app/paths'

import styles from './RootLayout.module.css'

/**
 * 모든 화면이 공유하는 껍데기.
 *
 * 지금은 라우팅이 도는지 확인할 수 있을 만큼만 있다.
 * 검색바·로그인 상태 표시 같은 실제 헤더 구성은 화면 작업에서 채운다.
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
            분실물 찾기
          </Link>

          <nav className={styles.nav} aria-label="주요 메뉴">
            <NavLink className={styles.navLink} to={paths.postList} end>
              목록
            </NavLink>
            <NavLink className={styles.navLink} to={paths.myPage}>
              내 글
            </NavLink>
            <NavLink className={styles.navLink} to={paths.login}>
              로그인
            </NavLink>
          </nav>
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
