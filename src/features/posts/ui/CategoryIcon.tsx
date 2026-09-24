import type { JSX, SVGProps } from 'react'

import type { PostCategory } from '../api/types'

/**
 * 카테고리 그림. 사진 없는 글의 자리표시자에 들어간다.
 * 지금은 목록 API 가 썸네일을 주지 않아 모든 카드에 이 그림이 보인다 — 목록의 인상을 이것이 정한다.
 *
 * 필치를 하나로 맞췄다 : 48 격자, 선 1.75, 끝과 모서리 둥글게, 채우지 않는다.
 * 물건의 윤곽만 그리고 무늬는 한두 개로 끝낸다. 작은 크기(40px)에서도 뭉개지지 않게.
 */

type IconProps = SVGProps<SVGSVGElement>

function Frame({ children, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

/** 반지갑 — 뒤로 삐져나온 카드 한 장과 똑딱이 */
function Wallet(props: IconProps) {
  return (
    <Frame {...props}>
      <path d="M11 15.5v-4a2 2 0 0 1 2-2h17.5a2 2 0 0 1 2 2v4" />
      <rect x="6" y="15.5" width="36" height="23" rx="4" />
      <path d="M42 22.5h-8a4 4 0 0 0 0 8h8" />
      <circle cx="34" cy="26.5" r="1.1" fill="currentColor" stroke="none" />
    </Frame>
  )
}

/** 휴대폰 옆에 무선 이어폰 한 쪽 — 전자기기에서 가장 많이 잃어버리는 두 가지 */
function Electronics(props: IconProps) {
  return (
    <Frame {...props}>
      <rect x="9" y="6" width="19" height="36" rx="4" />
      <path d="M15.5 10.5h6" />
      <path d="M16 37.5h5" />
      <path d="M33.5 20.5a4.5 4.5 0 1 1 7.95 2.9V35a1.725 1.725 0 0 1-3.45 0V25a4.5 4.5 0 0 1-4.5-4.5Z" />
    </Frame>
  )
}

/** 교통카드 — IC 칩과 비접촉 표시 */
function Card(props: IconProps) {
  return (
    <Frame {...props}>
      <rect x="5" y="11" width="38" height="26" rx="3.5" />
      <rect x="10" y="17.5" width="8.5" height="6.5" rx="1.5" />
      <path d="M10 31h11M25 31h5" />
      <path d="M33.5 18.5a4.5 4.5 0 0 1 0 5M37 16a8.5 8.5 0 0 1 0 10" />
    </Frame>
  )
}

/** 반팔 티셔츠 */
function Clothes(props: IconProps) {
  return (
    <Frame {...props}>
      <path d="M18 7.5c.6 3 3 5 6 5s5.4-2 6-5l8.4 3.6a2 2 0 0 1 1.1 1.2L43 20.5l-6 2.6-2-3V40a1.5 1.5 0 0 1-1.5 1.5h-19A1.5 1.5 0 0 1 13 40V20.1l-2 3-6-2.6 3.5-8.2a2 2 0 0 1 1.1-1.2Z" />
    </Frame>
  )
}

/** 꼬리표 — 보관소에서 주인 없는 물건에 다는 이름표. 무엇이든 될 수 있는 '기타'의 얼굴 */
function Etc(props: IconProps) {
  return (
    <Frame {...props}>
      <g transform="rotate(-14 24 25)">
        <path d="M24 9.5 31.4 16a2 2 0 0 1 .6 1.45V39.5a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V17.45a2 2 0 0 1 .6-1.45Z" />
        <circle cx="24" cy="18" r="2.25" />
        <path d="M20.5 28h7M20.5 33h4.5" />
        <path d="M24 15.75c0-4.8 2.2-8.4 7-10.25" />
      </g>
    </Frame>
  )
}

const ICONS: Record<PostCategory, (props: IconProps) => JSX.Element> = {
  WALLET: Wallet,
  ELECTRONICS: Electronics,
  CARD: Card,
  CLOTHES: Clothes,
  ETC: Etc,
}

export function CategoryIcon({ category, ...rest }: IconProps & { category: PostCategory }) {
  const Icon = ICONS[category]
  return <Icon {...rest} />
}
