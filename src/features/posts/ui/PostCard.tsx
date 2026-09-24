import { Link } from 'react-router-dom'

import { formatDate } from '@/shared/lib/date'

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
 * 목록 카드. 본문(`content`)은 싣지 않는다 — 응답에도 없다.
 * 소유자 동작(수정·삭제)도 없다. 목록 응답에 `memberId` 가 없어 본인 판정을 할 수 없다.
 */
export function PostCard({ post, to, thumbnailUrl, headingLevel: Heading = 'h3' }: PostCardProps) {
  return (
    <article className={styles.card} data-status={post.status}>
      <div className={styles.inner}>
        <PostThumbnail category={post.category} src={thumbnailUrl} alt={post.title} />

        <div className={styles.body}>
          <Heading className={styles.title}>
            <Link className={styles.link} to={to}>
              {post.title}
            </Link>
          </Heading>

          <div className={styles.badges}>
            <TypeBadge type={post.type} />
            <StatusBadge status={post.status} />
          </div>

          <dl className={styles.facts}>
            <div className={styles.place}>
              <dt className="sr-only">장소</dt>
              <dd>{post.location}</dd>
            </div>
            <div className={styles.date}>
              <dt>{lostFoundDateLabel(post.type)}</dt>
              <dd>
                <time dateTime={post.lostFoundDate}>{formatDate(post.lostFoundDate)}</time>
              </dd>
            </div>
          </dl>

          <p className={styles.meta}>
            <span className={styles.nickname}>
              <span className="sr-only">작성자 </span>
              {post.nickname}
            </span>
            <span className={styles.views}>
              조회 <span data-numeric>{post.viewCount.toLocaleString('ko-KR')}</span>
            </span>
          </p>
        </div>
      </div>
    </article>
  )
}
