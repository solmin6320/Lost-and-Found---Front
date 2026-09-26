/*
 * 화면 모드를 첫 화면이 그려지기 전에 붙인다 — 어둡게를 고른 사람이 흰 화면을 한 번 보고 넘어가지 않게.
 *
 * index.html 의 <head> 에서 동기로 불러온다(async · defer 없음). 인라인 스크립트로 쓰지 않는 이유는
 * CSP `script-src 'self'` 가 인라인을 막기 때문이다. 같은 출처의 이 파일은 허용된다(보안명세서 4장).
 *
 * 저장 값은 localStorage `theme:v1` 의 'light' | 'dark' 하나. 비밀이 아니다.
 * 값이 없으면 아무것도 붙이지 않는다 — CSS 가 기기 설정(prefers-color-scheme)을 따른다.
 * 읽기가 막힌 브라우저(저장소 차단)에서도 던지지 않고 기기 설정으로 둔다.
 *
 * ⚠️ 키 이름과 theme-color 두 값은 src/shared/lib/theme.ts 와 같아야 한다.
 */
(function () {
  var theme = null
  try {
    var saved = window.localStorage.getItem('theme:v1')
    if (saved === 'light' || saved === 'dark') theme = saved
  } catch {
    // 저장소가 막혔다 — 기기 설정을 따른다
  }

  var root = document.documentElement
  if (theme) root.setAttribute('data-theme', theme)

  var dark = theme
    ? theme === 'dark'
    : !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  var meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', dark ? '#16171a' : '#ffffff')
})()
