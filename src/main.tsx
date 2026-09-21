import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from '@/app/App'
import '@/shared/styles/global.css'

const container = document.getElementById('root')

if (!container) {
  throw new Error('#root 엘리먼트를 찾지 못했습니다. index.html을 확인하세요.')
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
