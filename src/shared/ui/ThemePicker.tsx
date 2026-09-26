import { useId, useRef } from 'react'

import { useTheme, type ThemeName } from '@/shared/lib/theme'

import { Check, Moon, Sun, type Icon } from './icons'
import styles from './ThemePicker.module.css'

const OPTIONS: { value: ThemeName; label: string; icon: Icon }[] = [
  { value: 'light', label: '밝게', icon: Sun },
  { value: 'dark', label: '어둡게', icon: Moon },
]

const SCREEN: Record<ThemeName, string> = { light: '밝은 화면', dark: '어두운 화면' }

interface ThemePickerProps {
  /** 이 선택의 이름이 되는 제목 요소 id(섹션 제목 "화면 모드") */
  labelledBy: string
}

/**
 * 화면 모드 — "밝게" · "어둡게" 두 칸. 칸마다 그 모드로 그린 화면 축소 도식이 들어간다.
 *
 * 진짜 라디오 두 개다 — 화살표 키로 옮기고, 스크린리더가 "2개 중 1번째, 선택됨" 으로 읽는다.
 * 고른 칸은 색이 아니라 **굵은 테두리 + 체크 아이콘**으로도 보인다.
 * 바꾸는 즉시 화면 전체에 적용한다. 되돌릴 수 있는 일이라 확인 창을 띄우지 않는다.
 *
 * 한 번도 고르지 않았으면 기기 설정을 따른다. 그때는 지금 그려지는 모드의 칸이 선택돼 있고,
 * 아래 한 줄이 "기기 설정을 따르는 중" 임을 알린다. 그 칸을 누르면 그 모드로 고정된다.
 */
export function ThemePicker({ labelledBy }: ThemePickerProps) {
  const { preference, resolved, setPreference } = useTheme()
  const selected = preference ?? resolved
  const name = useId()
  const statusId = useId()
  const groupRef = useRef<HTMLDivElement>(null)

  function followSystem() {
    setPreference(null)
    // 누른 버튼이 사라진다. 지금 선택된 칸으로 포커스를 옮긴다
    requestAnimationFrame(() => {
      groupRef.current?.querySelector<HTMLInputElement>('input:checked')?.focus()
    })
  }

  return (
    <div className={styles.picker}>
      <div
        ref={groupRef}
        className={styles.options}
        role="radiogroup"
        aria-labelledby={labelledBy}
        aria-describedby={statusId}
      >
        {OPTIONS.map(({ value, label, icon: OptionIcon }) => {
          const checked = selected === value
          return (
            <label key={value} className={styles.option}>
              <input
                className={styles.input}
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={() => setPreference(value)}
                // 기기 설정을 따르는 중에 지금 모드의 칸을 누르면 change 가 나지 않는다. 그때는 "이 모드로 고정" 이다
                onClick={() => {
                  if (preference === null && checked) setPreference(value)
                }}
              />
              <span className={styles.preview} data-theme={value} aria-hidden="true">
                <ThemePreview />
              </span>
              <span className={styles.caption}>
                <OptionIcon className={styles.captionIcon} />
                <span className={styles.captionText}>{label}</span>
                <span className={styles.check}>
                  <Check />
                </span>
              </span>
            </label>
          )
        })}
      </div>

      <p id={statusId} className={styles.status}>
        {preference === null
          ? `기기 설정에 맞춰 지금은 ${SCREEN[resolved]}이에요.`
          : `기기 설정과 상관없이 늘 ${SCREEN[preference]}으로 보여요.`}
        {preference !== null ? (
          <button type="button" className={styles.follow} onClick={followSystem}>
            기기 설정 따르기
          </button>
        ) : null}
      </p>
    </div>
  )
}

/** 앞 네 칸만 보인다(아래는 잘린다). 분실 · 습득 포스터와 사진 한 장을 섞는다 */
const TILES = ['LOST', 'FOUND', 'PHOTO', 'FOUND', 'LOST', 'LOST'] as const

/**
 * 목록 화면을 줄인 도식 — 헤더 · 제목 · 두 색 면 · 검색창 · 카드 격자. 비율은 실제 375px 화면을 따른다.
 * 그림이나 캡처가 아니라 **실제 토큰으로 그린다.** 감싼 칸의 `data-theme` 이 그 모드의 토큰을 연다.
 * 장식이다 — 이름은 칸의 "밝게" · "어둡게" 가 맡는다.
 */
function ThemePreview() {
  return (
    <span className={styles.screen}>
      <span className={styles.bar}>
        <span className={styles.brand}>
          <span className={styles.tagLost} />
          <span className={styles.tagFound} />
          <span className={styles.word} />
        </span>
        <span className={styles.barActions}>
          <span className={styles.chipSquare} />
          <span className={styles.chipRound} />
          <span className={styles.chipWide} />
        </span>
      </span>
      <span className={styles.content}>
        <span className={styles.headline} />
        <span className={styles.panels}>
          <span className={styles.panel} data-concept="LOST">
            <span className={styles.panelLine} />
            <span className={styles.panelLineShort} />
          </span>
          <span className={styles.panel} data-concept="FOUND">
            <span className={styles.panelLine} />
            <span className={styles.panelLineShort} />
          </span>
        </span>
        <span className={styles.search} />
        <span className={styles.tiles}>
          {TILES.map((kind, index) => (
            <span key={index} className={styles.tile}>
              <span className={styles.photo} data-kind={kind} />
              <span className={styles.tileLine} />
              <span className={styles.tileLineShort} />
            </span>
          ))}
        </span>
      </span>
    </span>
  )
}
