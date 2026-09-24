/**
 * 경로 문자열을 한곳에 모은다.
 *
 * `<Link to="/posts/3">` 처럼 문자열을 흩어 놓으면 경로를 바꿀 때
 * 바뀌지 않은 링크가 조용히 404 로 간다. 여기서만 만든다.
 */
export const paths = {
  /** [4.2] 목록. 검색·필터·페이지는 쿼리스트링으로 붙인다 */
  postList: '/',
  /** [4.1] 등록 */
  postCreate: '/posts/new',
  /** [4.3] 상세 (+ [5.1] 댓글) */
  postDetail: (postId: number | string) => `/posts/${postId}`,
  /** [4.4] 수정 */
  postEdit: (postId: number | string) => `/posts/${postId}/edit`,

  /** [3.2] 로그인 */
  login: '/login',
  /**
   * 로그인 후 `redirect` 로 되돌아온다(화면정의서 1.5).
   * 받는 쪽(로그인 화면)은 `/` 로 시작하고 `//` 가 아닌 내부 경로만 따라가야 한다 — 열린 리다이렉트
   */
  loginThenReturn: (redirect: string) => `/login?redirect=${encodeURIComponent(redirect)}`,
  /** [3.1] 회원가입 */
  signup: '/signup',

  /** [6.1] 마이페이지 — 내가 쓴 글 */
  myPage: '/me',
  /** [3.6] [3.7] 내 정보 조회·수정 */
  accountSettings: '/me/settings',
} as const
