import { useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'

/**
 * 화면 모드(밝게 · 어둡게). 사용자가 고른 값만 저장하고, 고르지 않았으면 기기 설정을 따른다.
 *
 * - 저장 : localStorage `theme:v1` = 'light' | 'dark'. 비밀이 아니다(보안명세서 3장의 토큰 금지와 무관)
 * - 적용 : `<html data-theme>`. 고르지 않았으면 속성을 떼고 CSS 의 `prefers-color-scheme` 이 정한다
 * - 첫 화면 : `public/theme-init.js` 가 React 보다 먼저 같은 일을 한다. 여기는 그 뒤의 변경을 맡는다
 * - 탭 사이 : 다른 탭에서 바꾸면 `storage` 이벤트로 이 탭도 따라 바뀐다
 *
 * ⚠️ 키 이름과 theme-color 값은 public/theme-init.js 와 같아야 한다.
 */

export type ThemeName = 'light' | 'dark'
/** `null` 은 "고른 적 없음 — 기기 설정을 따른다" */
export type ThemePreference = ThemeName | null

export interface ThemeState {
  preference: ThemePreference
  /** 지금 실제로 그려지는 모드 */
  resolved: ThemeName
}

const STORAGE_KEY = 'theme:v1'
/** 브라우저 주소창 색. tokens.css 의 `--paper` 와 같다 */
const THEME_COLOR: Record<ThemeName, string> = { light: '#ffffff', dark: '#16171a' }

function isThemeName(value: unknown): value is ThemeName {
  return value === 'light' || value === 'dark'
}

// 저장소가 막힌 브라우저(사생활 보호 모드 · 쿠키 차단)에서도 던지지 않는다. 그때는 기기 설정을 따른다
function readStored(): ThemePreference {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return isThemeName(value) ? value : null
  } catch {
    return null
  }
}

function writeStored(preference: ThemePreference) {
  try {
    if (preference) window.localStorage.setItem(STORAGE_KEY, preference)
    else window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // 이 탭에서는 바뀐다. 새로고침하면 기기 설정으로 돌아간다
  }
}

const systemQuery =
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null

function systemTheme(): ThemeName {
  return systemQuery?.matches ? 'dark' : 'light'
}

let state: ThemeState = { preference: null, resolved: 'light' }
const listeners = new Set<() => void>()

function refresh(preference: ThemePreference) {
  const resolved = preference ?? systemTheme()
  const root = document.documentElement
  if (preference) root.setAttribute('data-theme', preference)
  else root.removeAttribute('data-theme')
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[resolved])

  if (state.preference !== preference || state.resolved !== resolved) {
    state = { preference, resolved }
    listeners.forEach((listener) => listener())
  }
}

let started = false

/**
 * 앱을 띄울 때 한 번 부른다(main.tsx). 화면 모드를 다루는 화면이 없을 때도
 * 다른 탭의 변경 · 기기 설정 변경을 받아야 해서 컴포넌트 구독과 따로 둔다.
 */
export function startThemeSync() {
  if (started) return
  started = true
  refresh(readStored())

  window.addEventListener('storage', (event) => {
    // key 가 null 이면 저장소 전체가 비워졌다(clear)
    if (event.key === STORAGE_KEY || event.key === null) refresh(readStored())
  })
  // 기기 설정을 따르는 중이면 색은 CSS 가 바꾼다. 여기서는 주소창 색과 "지금 모드" 만 맞춘다
  systemQuery?.addEventListener('change', () => refresh(state.preference))
}

/** 고른다(바로 적용). `null` 이면 다시 기기 설정을 따른다. 되돌릴 수 있는 일이라 확인하지 않는다 */
export function setThemePreference(preference: ThemePreference) {
  writeStored(preference)
  // 밝게 ↔ 어둡게는 화면 전체가 한 번에 바뀐다. 번쩍 뒤집히지 않게 짧게 겹쳐 넘긴다(View Transitions — 없는 브라우저는 바로 바뀐다).
  // 고른 칸의 표시(React)도 같은 장면에 들어가도록 동기로 그린다. 모션 줄이기면 겹치지 않는다
  const apply = () => flushSync(() => refresh(preference))
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (!reduceMotion && typeof document.startViewTransition === 'function') {
    document.startViewTransition(apply)
  } else {
    apply()
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

const getSnapshot = () => state

/** 화면 모드와 바꾸는 함수. 값이 바뀌면(다른 탭 · 기기 설정 포함) 다시 그린다 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return { ...theme, setPreference: setThemePreference }
}
