import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/app/App'
import { startThemeSync } from '@/shared/lib/theme'
import '@/shared/styles/global.css'

const container = document.getElementById('root')

if (!container) {
  throw new Error('#root 엘리먼트를 찾지 못했습니다. index.html을 확인하세요.')
}

// 화면 모드 — 첫 적용은 public/theme-init.js 가 했다. 여기부터는 다른 탭 · 기기 설정의 변경을 따른다
startThemeSync()

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
