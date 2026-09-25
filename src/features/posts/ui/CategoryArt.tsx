import type { JSX, SVGProps } from 'react'

import type { PostCategory } from '../api/types'

/**
 * 카테고리 그림 — 사진 없는 글의 포스터에 크게 들어간다.
 * 사진은 선택 입력이라 이 그림이 목록의 절반 이상을 차지할 수 있다. 그래서 작은 아이콘이 아니라
 * **스티커처럼 칠한 그림**으로 그린다 : 몸통을 채우고, 진한 선으로 두르고, 밝은 면 하나로 입체를 준다.
 *
 * 색은 감싼 쪽(포스터)이 CSS 변수로 준다. 같은 그림이 분실 · 습득 색으로 갈아입는다.
 *   --art-body  몸통       --art-shade 그늘 · 두 번째 면
 *   --art-line  윤곽선     --art-light 밝은 면(화면 · 카드 앞면)
 *   --art-hole  뚫린 구멍(포스터 바탕색)
 *
 * 120 격자, 선 3. 물건마다 알아볼 단서 하나씩 — 지갑의 똑딱이, 휴대폰 화면과 이어폰, 카드의 IC 칩,
 * 티셔츠 목둘레, 보관소 꼬리표.
 */

type ArtProps = SVGProps<SVGSVGElement>

const BODY = 'var(--art-body)'
const SHADE = 'var(--art-shade)'
const LINE = 'var(--art-line)'
const LIGHT = 'var(--art-light)'
const HOLE = 'var(--art-hole)'

function Frame({ children, ...rest }: ArtProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke={LINE}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {/* 바닥 그림자. 그림이 포스터 위에 놓여 있게 한다 */}
      <ellipse cx="60" cy="109" rx="36" ry="3.5" fill={LINE} stroke="none" opacity="0.14" />
      {children}
    </svg>
  )
}

/** 반지갑 — 뒤로 삐져나온 카드 한 장, 똑딱이 덮개, 박음질 */
function Wallet(props: ArtProps) {
  return (
    <Frame {...props}>
      <rect x="31" y="22" width="50" height="34" rx="5" fill={LIGHT} transform="rotate(-6 56 39)" />
      <path d="M33.5 32.5 82 27.4" strokeWidth="5" stroke={SHADE} />
      <rect x="14" y="42" width="92" height="58" rx="11" fill={BODY} />
      <rect
        x="21"
        y="49"
        width="78"
        height="44"
        rx="6.5"
        strokeWidth="1.75"
        strokeDasharray="3.5 4.5"
        opacity="0.5"
      />
      <path d="M106 58H79a9 9 0 0 0-9 9v6a9 9 0 0 0 9 9h27" fill={SHADE} />
      <circle cx="81" cy="70" r="4" fill={LIGHT} strokeWidth="2.5" />
      <path d="M23 50h18" stroke={LIGHT} strokeWidth="3.5" opacity="0.75" />
    </Frame>
  )
}

/** 휴대폰 + 무선 이어폰 한 쪽 — 전자기기에서 가장 많이 잃어버리는 둘 */
function Electronics(props: ArtProps) {
  return (
    <Frame {...props}>
      <rect x="24" y="12" width="50" height="92" rx="11" fill={BODY} />
      <rect x="31" y="22" width="36" height="70" rx="4.5" fill={LIGHT} strokeWidth="2.25" />
      <path d="M43 17h12" strokeWidth="2.5" />
      <rect x="36" y="28" width="11" height="11" rx="3" fill={SHADE} stroke="none" />
      <rect x="51" y="28" width="11" height="11" rx="3" fill={BODY} stroke="none" />
      <rect x="36" y="43" width="11" height="11" rx="3" fill={BODY} stroke="none" />
      <path d="M36 70h26M36 78h16" strokeWidth="2.5" opacity="0.55" />
      <path d="M49 97.5h0" strokeWidth="4" />
      <rect x="85.5" y="68" width="10" height="33" rx="5" fill={LIGHT} transform="rotate(-12 90 84)" />
      <circle cx="88" cy="64" r="12" fill={LIGHT} />
      <circle cx="84.5" cy="61" r="4" fill={LINE} stroke="none" />
    </Frame>
  )
}

/** 카드 두 장 — IC 칩, 비접촉 표시, 카드 번호 */
function Card(props: ArtProps) {
  return (
    <Frame {...props}>
      <rect x="24" y="24" width="80" height="52" rx="7" fill={LIGHT} transform="rotate(9 64 50)" />
      <g transform="rotate(-7 58 66)">
        <rect x="12" y="40" width="84" height="54" rx="7" fill={BODY} />
        <rect x="21" y="53" width="18" height="14" rx="3" fill={LIGHT} strokeWidth="2.5" />
        <path d="M21 60h18M30 53v14" strokeWidth="1.75" />
        <path d="M74 52.5a8 8 0 0 1 0 11M81 48.5a15 15 0 0 1 0 19" strokeWidth="2.75" />
        <path d="M21 82h20M47 82h12" strokeWidth="3.5" />
      </g>
    </Frame>
  )
}

/** 반팔 티셔츠 — 목둘레와 가슴 주머니 */
function Clothes(props: ArtProps) {
  return (
    <Frame {...props}>
      <path
        d="M43 17c2.4 8.6 8.6 13 17 13s14.6-4.4 17-13l22.6 9.6a4 4 0 0 1 2.2 2.4L109 48.5l-16 6.6-5-7.6V99a4 4 0 0 1-4 4H36a4 4 0 0 1-4-4V47.5l-5 7.6-16-6.6 7.2-19.5a4 4 0 0 1 2.2-2.4Z"
        fill={BODY}
      />
      <path d="M43 17c2.4 8.6 8.6 13 17 13s14.6-4.4 17-13c-4.8 2.4-10.4 3.4-17 3.4S47.8 19.4 43 17Z" fill={SHADE} />
      <rect x="67" y="52" width="15" height="15" rx="2.5" fill={SHADE} strokeWidth="2.5" />
      <path d="M32 92h56" stroke={SHADE} strokeWidth="4" />
      <path d="M22 34l-4 10" stroke={LIGHT} strokeWidth="3.5" opacity="0.8" />
    </Frame>
  )
}

/** 꼬리표 — 보관소에서 주인 없는 물건에 다는 이름표. 무엇이든 될 수 있는 '기타'의 얼굴 */
function Etc(props: ArtProps) {
  return (
    <Frame {...props}>
      <g transform="rotate(-12 60 62)">
        <path d="M60 32c-1-11 5-19 19-24" />
        <path d="M60 16 80.6 34.2a4 4 0 0 1 1.4 3V98a5 5 0 0 1-5 5H43a5 5 0 0 1-5-5V37.2a4 4 0 0 1 1.4-3Z" fill={BODY} />
        <path d="M44 44h32v53a2 2 0 0 1-2 2H46a2 2 0 0 1-2-2Z" fill={LIGHT} stroke="none" opacity="0.55" />
        <circle cx="60" cy="36" r="6" fill={HOLE} />
        <path d="M48 60h24M48 71h24M48 82h14" strokeWidth="3" />
      </g>
    </Frame>
  )
}

const ARTS: Record<PostCategory, (props: ArtProps) => JSX.Element> = {
  WALLET: Wallet,
  ELECTRONICS: Electronics,
  CARD: Card,
  CLOTHES: Clothes,
  ETC: Etc,
}

export function CategoryArt({ category, ...rest }: ArtProps & { category: PostCategory }) {
  const Art = ARTS[category]
  return <Art {...rest} />
}
