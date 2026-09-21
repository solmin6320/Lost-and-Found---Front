import { BrowserRouter } from 'react-router-dom'

import { AppRoutes } from '@/app/routes'

/**
 * 앱의 가장 바깥. 전역 프로바이더는 전부 여기에 쌓는다.
 *
 * 라우터는 BrowserRouter(History API)를 쓴다. 해시 라우터가 아니다.
 * 배포에서 `/posts/3` 직접 접근은 CloudFront 커스텀 오류 응답
 * (403/404 → /index.html, 200)이 받아 준다 (기능명세서 11장).
 */
export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
