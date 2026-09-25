import { Link } from 'react-router-dom'

import { formatDate } from '@/shared/lib/date'
import { PinIcon } from '@/shared/ui/icons'

import type { PostListResponse } from '../api/types'
import { lostFoundDateLabel } from '../model/labels'
import styles from './PostCard.module.css'
import { PostThumbnail } from './PostThumbnail'
import { StatusBadge } from './StatusBadge'
import { TypeBadge } from './TypeBadge'

interface PostCardProps {
  post: PostListResponse
  /** 상세 주소. 경로는 app 이 정한다(`paths.postDetail(id)`) */
  to: string
  /** 목록 API 에 아직 없다. 백엔드가 추가하면 넘긴다 */
  thumbnailUrl?: string
  /** 목록의 제목 구조에 맞춘다 */
  headingLevel?: 'h2' | 'h3'
}

/**
 * 피드 카드 — 사진(없으면 포스터)이 위, 글이 아래. 눈이 멈추는 순서를 고정한다.
 *   1 사진 + 제목   2 유형(사진 위 배지) · 연락중/완료   3 장소 · 분실습득일
 * 작성자 · 조회수는 싣지 않는다. "내 물건인가" 를 가리는 데 쓰이지 않고, 좁은 두 칸에서 줄만 늘린다.
 *
 * 문서 순서는 제목이 먼저다(스크린리더가 제목부터 읽는다). 사진은 CSS 로 위에 올린다.
 * 본문(`content`)은 싣지 않는다 — 응답에도 없다.
 * 소유자 동작(수정·삭제)도 없다. 목록 응답에 `memberId` 가 없어 본인 판정을 할 수 없다.
 */
export function PostCard({ post, to, thumbnailUrl, headingLevel: Heading = 'h3' }: PostCardProps) {
  return (
    <article className={styles.card} data-status={post.status}>
      <div className={styles.body}>
        <Heading className={styles.title}>
          <Link className={styles.link} to={to}>
            {post.title}
          </Link>
        </Heading>

        <dl className={styles.facts}>
          <div className={styles.place}>
            <dt>
              <PinIcon className={styles.pin} />
              <span className="sr-only">장소</span>
            </dt>
            <dd>{post.location}</dd>
          </div>
          <div className={styles.date}>
            <dt>{lostFoundDateLabel(post.type)}</dt>
            <dd>
              <time dateTime={post.lostFoundDate}>{formatDate(post.lostFoundDate)}</time>
            </dd>
          </div>
        </dl>
      </div>

      <div className={styles.media}>
        <PostThumbnail
          className={styles.visual}
          category={post.category}
          type={post.type}
          src={thumbnailUrl}
          alt={post.title}
          seed={post.id}
        />
        {/* 게시중은 기본값이라 표시하지 않는다. 연락중 · 완료만 유형 옆에 붙는다 */}
        <p className={styles.flags}>
          <TypeBadge type={post.type} surface="photo" />
          {post.status === 'OPEN' ? null : <StatusBadge status={post.status} surface="photo" />}
        </p>
      </div>
    </article>
  )
}
