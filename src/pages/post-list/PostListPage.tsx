import { keepPreviousData, useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import type { To } from 'react-router-dom'

import { paths } from '@/app/paths'
import { useAuth } from '@/features/auth'
import {
  CategoryArt,
  ConceptButtonLink,
  PostCard,
  PostCardSkeleton,
  PostFilterBar,
  PostFilterSheet,
  PostIntentNext,
  PostIntentPicker,
  PostSearchBar,
  hasActiveFilters,
  intentShowing,
  postListHeading,
  postListQueryOptions,
  postListSearchKey,
  toPostListParams,
  usePostListSearch,
  withoutFilter,
  withoutFilters,
  type PostFilterField,
  type PostIntent,
  type PostListResponse,
  type PostListSearch,
  type PostType,
} from '@/features/posts'
import { getErrorMessage } from '@/shared/lib/http'
import type { PagedModel } from '@/shared/types/api'
import { Button, ButtonLink } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PlusIcon, SearchIcon } from '@/shared/ui/icons'
import { Pagination } from '@/shared/ui/Pagination'
import { Skeleton } from '@/shared/ui/Skeleton'

import styles from './PostListPage.module.css'

/** 로딩 스켈레톤 개수. 2 · 3 · 4열 어디서든 줄이 채워지는 수(화면정의서 SCR-01) */
const SKELETON_COUNT = 8

/**
 * SCR-01 게시글 목록 · `/`
 *
 * 맨 위에서 의도를 고른다(`잃어버렸어요` → 습득 글, `주웠어요` → 분실 글). 그 아래 검색 · 필터 칩 · 사진 피드.
 * 의도 · 검색 · 필터 · 페이지는 전부 URL 에 있다. 이 화면은 주소를 읽어 그리고, 바꿀 때는 주소를 바꾼다.
 * 조건을 바꾸는 동안에는 직전 목록을 흐리게 남겨 둔다(`keepPreviousData`) — 빈 화면으로 깜빡이지 않는다.
 */
export function PostListPage() {
  const { search, apply, update, hrefWith, hrefForPage } = usePostListSearch()
  const query = useQuery({
    ...postListQueryOptions(toPostListParams(search)),
    placeholderData: keepPreviousData,
  })
  const createHref = useCreateHref()
  const intent = intentShowing(search.type)

  const [sheet, setSheet] = useState<{ open: boolean; field?: PostFilterField; key: number }>({
    open: false,
    key: 0,
  })
  const summaryRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const filterBarRef = useRef<HTMLDivElement>(null)

  const removeFilter = (field: PostFilterField) => apply(withoutFilter(search, field))
  const clearFilters = () => apply(withoutFilters(search))

  // 페이지를 넘기면 목록 첫 줄에서 다시 읽기 시작한다. 스크린리더도 결과 제목으로 옮긴다
  function handlePageNavigate() {
    requestAnimationFrame(() => {
      summaryRef.current?.scrollIntoView({ block: 'start' })
      headingRef.current?.focus({ preventScroll: true })
    })
  }

  /**
   * 조건이 바뀌어 다시 그려진 **뒤에** 포커스를 줄 곳. 누른 버튼이 사라지거나 다른 모양으로 바뀌는 경우다.
   * 주소 변경은 transition 으로 늦게 그려지므로, 누른 직후가 아니라 조건 지문이 바뀐 뒤에 옮긴다
   */
  const refocus = useRef<{ kind: 'chip'; field: PostFilterField } | { kind: 'results' } | null>(null)
  const searchKey = postListSearchKey(search)

  useEffect(() => {
    const target = refocus.current
    if (!target) return
    refocus.current = null
    if (target.kind === 'results') {
      headingRef.current?.focus({ preventScroll: true })
    } else {
      filterBarRef.current?.querySelector<HTMLElement>(`[data-filter-field="${target.field}"]`)?.focus()
    }
  }, [searchKey])

  // 시트를 연 칩은 적용 뒤 값이 든 칩으로 바뀐다. 시트가 돌려준 포커스가 사라지므로 새 칩으로 옮긴다
  function applyFromSheet(next: PostListSearch) {
    if (sheet.field && postListSearchKey(next) !== searchKey) {
      refocus.current = { kind: 'chip', field: sheet.field }
    }
    apply(next)
  }

  const total = query.data?.page.totalElements
  const empty = query.data ? emptyKindOf(search, query.data) : null
  // 의도를 골랐으면 결과 끝에 "내 글을 올려 두기" 를 둔다. 빈 상태가 이미 그 버튼을 말하면 두 번 말하지 않는다
  const showNext = intent !== undefined && query.data !== undefined && empty !== 'none-yet'

  return (
    <div className={styles.page}>
      {/* 읽는 순서 = Tab 순서 : 의도 → 검색 → 필터 → 결과. 가장 먼저 할 일이 가장 위에 있다 */}
      <section className={styles.hero} aria-labelledby="post-list-title">
        <h1 id="post-list-title" className={styles.title}>
          잃어버렸나요, 주웠나요?
        </h1>
        <PostIntentPicker selected={search.type} hrefFor={(type) => hrefWith({ type })} />
      </section>

      <div className={styles.finder}>
        <PostSearchBar
          key={search.keyword}
          keyword={search.keyword}
          onSearch={(keyword) => update({ keyword })}
        />
        <div ref={filterBarRef} className={styles.filters}>
          <PostFilterBar
            search={search}
            onOpen={(field) => setSheet((s) => ({ open: true, field, key: s.key + 1 }))}
            onRemove={removeFilter}
          />
        </div>
      </div>

      <section className={styles.results} aria-labelledby="post-list-heading">
        <div ref={summaryRef} className={styles.summary}>
          <h2 id="post-list-heading" ref={headingRef} tabIndex={-1} className={styles.heading}>
            {postListHeading(search.type)}
          </h2>
          <p
            className={styles.count}
            aria-live="polite"
            aria-atomic="true"
            data-stale={query.isPlaceholderData || undefined}
          >
            {total === undefined ? (
              query.isPending ? (
                <>
                  <span className="sr-only">게시글을 불러오는 중입니다</span>
                  <Skeleton shape="text" width="2.75rem" />
                </>
              ) : null
            ) : (
              <>
                <span className="sr-only">게시글 </span>
                <strong data-numeric>{total.toLocaleString('ko-KR')}</strong>건
              </>
            )}
          </p>
          {hasActiveFilters(search) ? (
            <Button
              variant="ghost"
              size="sm"
              className={styles.clearAll}
              onClick={() => {
                // 이 버튼은 눌리면 사라진다. 포커스를 결과 제목으로
                refocus.current = { kind: 'results' }
                clearFilters()
              }}
            >
              전체 해제
            </Button>
          ) : null}
        </div>

        <PostListBody
          query={query}
          search={search}
          intent={intent}
          createHref={createHref}
          onClearFilters={clearFilters}
          onClearKeyword={() => update({ keyword: '' })}
          firstPageHref={hrefForPage(1)}
        />

        {/* 끝을 넘은 페이지면 "9 / 2" 가 된다. 그때는 빈 상태의 [첫 페이지로]가 나갈 문이다 */}
        {query.data && query.data.content.length > 0 ? (
          <div className={styles.pagination}>
            <Pagination
              page={search.page}
              totalPages={query.data.page.totalPages}
              hrefFor={hrefForPage}
              onNavigate={handlePageNavigate}
            />
          </div>
        ) : null}

        {showNext ? (
          <div className={styles.next}>
            <PostIntentNext intent={intent} to={createHref(intent.concept)} />
          </div>
        ) : null}
      </section>

      <PostFilterSheet
        key={sheet.key}
        open={sheet.open}
        focusField={sheet.field}
        onClose={() => setSheet((s) => ({ ...s, open: false }))}
        search={search}
        onApply={applyFromSheet}
      />
    </div>
  )
}

/** 글 올리기 주소. 비로그인이면 로그인을 거쳐 돌아온다. 유형을 주면 등록 화면이 미리 고른다 */
function useCreateHref() {
  const auth = useAuth()
  return (type?: PostType) => {
    const target = type ? paths.postCreateAs(type) : paths.postCreate
    return auth.status === 'anonymous' ? paths.loginThenReturn(target) : target
  }
}

/**
 * 비어 있는 까닭.
 *   past-end  : 주소의 page 가 끝을 넘었다(오래된 링크, 그사이 글이 지워짐)
 *   filtered  : 검색어나 필터가 걸려 있다
 *   none-yet  : 조건 없이도 글이 없다(의도만 골랐으면 그 유형의 글이 없다)
 */
type EmptyKind = 'past-end' | 'filtered' | 'none-yet'

function emptyKindOf(search: PostListSearch, data: PagedModel<PostListResponse>): EmptyKind | null {
  if (data.content.length > 0) return null
  if (data.page.totalElements > 0) return 'past-end'
  if (hasActiveFilters(search) || search.keyword) return 'filtered'
  return 'none-yet'
}

interface PostListBodyProps {
  query: UseQueryResult<PagedModel<PostListResponse>>
  search: PostListSearch
  intent: PostIntent | undefined
  createHref: (type?: PostType) => string
  onClearFilters: () => void
  onClearKeyword: () => void
  firstPageHref: To
}

/** 네 가지 상태 — 로딩 · 오류 · 비어 있음 · 목록. 권한은 해당 없다(전체 공개, 소유자 동작 없음) */
function PostListBody({
  query,
  search,
  intent,
  createHref,
  onClearFilters,
  onClearKeyword,
  firstPageHref,
}: PostListBodyProps) {
  if (query.isPending) {
    return (
      <ul className={styles.grid} role="list" aria-busy="true">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <li key={i}>
            <PostCardSkeleton />
          </li>
        ))}
      </ul>
    )
  }

  if (query.isError) {
    return (
      <div className={styles.stateBox}>
        <ErrorState
          message={getErrorMessage(query.error)}
          onRetry={() => void query.refetch()}
          retrying={query.isFetching}
        />
      </div>
    )
  }

  const { content, page } = query.data
  const empty = emptyKindOf(search, query.data)

  if (empty) {
    return (
      <div className={styles.stateBox}>
        <PostListEmpty
          kind={empty}
          search={search}
          totalElements={page.totalElements}
          intent={intent}
          createHref={createHref}
          onClearFilters={onClearFilters}
          onClearKeyword={onClearKeyword}
          firstPageHref={firstPageHref}
        />
      </div>
    )
  }

  return (
    <ul
      className={styles.grid}
      role="list"
      aria-busy={query.isPlaceholderData}
      data-stale={query.isPlaceholderData || undefined}
    >
      {content.map((post) => (
        <li key={post.id}>
          <PostCard post={post} to={paths.postDetail(post.id)} />
        </li>
      ))}
    </ul>
  )
}

interface PostListEmptyProps {
  kind: EmptyKind
  search: PostListSearch
  totalElements: number
  intent: PostIntent | undefined
  createHref: (type?: PostType) => string
  onClearFilters: () => void
  onClearKeyword: () => void
  firstPageHref: To
}

/** 왜 비었는지 + 다음에 할 일. 막다른 길을 만들지 않는다 */
function PostListEmpty({
  kind,
  search,
  totalElements,
  intent,
  createHref,
  onClearFilters,
  onClearKeyword,
  firstPageHref,
}: PostListEmptyProps) {
  if (kind === 'past-end') {
    return (
      <EmptyState
        titleAs="h3"
        icon={<SearchIcon />}
        title={`${search.page}페이지에는 글이 없어요.`}
        description={`조건에 맞는 글 ${totalElements.toLocaleString('ko-KR')}건은 앞 페이지에 있어요.`}
        action={<ButtonLink to={firstPageHref}>첫 페이지로</ButtonLink>}
      />
    )
  }

  if (kind === 'filtered') {
    return (
      <EmptyState
        titleAs="h3"
        icon={<SearchIcon />}
        title="조건에 맞는 글이 없어요."
        description="검색어나 필터를 바꿔 보세요."
        action={
          hasActiveFilters(search) ? (
            <Button onClick={onClearFilters}>필터 초기화</Button>
          ) : (
            <Button onClick={onClearKeyword}>검색어 지우기</Button>
          )
        }
      />
    )
  }

  // 의도만 골랐는데 그 유형의 글이 없다 — 반대쪽 글을 올려 두게 한다. 색은 올릴 글을 따른다
  if (intent) {
    return (
      <EmptyState
        titleAs="h3"
        className={styles.emptyWithArt}
        icon={<EmptyArt concept={intent.concept} />}
        title={intent.empty.title}
        description={intent.empty.description}
        action={
          <ConceptButtonLink concept={intent.concept} to={createHref(intent.concept)}>
            {intent.next.action}
          </ConceptButtonLink>
        }
      />
    )
  }

  return (
    <EmptyState
      titleAs="h3"
      className={styles.emptyWithArt}
      icon={<EmptyArt concept="LOST" />}
      title="아직 올라온 글이 없어요."
      description="잃어버렸거나 주운 물건을 올려 보세요."
      action={
        <ButtonLink to={createHref()} variant="primary">
          <PlusIcon />글 올리기
        </ButtonLink>
      }
    />
  )
}

/** 빈 상태의 그림. 포스터와 같은 꼬리표 그림을 올릴 글의 색으로 */
function EmptyArt({ concept }: { concept: PostType }) {
  return (
    <span className={styles.emptyArt} data-concept={concept}>
      <CategoryArt category="ETC" />
    </span>
  )
}
