import { keepPreviousData, useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import type { To } from 'react-router-dom'

import { paths } from '@/app/paths'
import { useAuth } from '@/features/auth'
import {
  ActiveFilterList,
  CategoryIcon,
  PostCard,
  PostCardSkeleton,
  PostFilterBar,
  PostFilterPanel,
  PostFilterSheet,
  PostSearchBar,
  hasActiveFilters,
  postListQueryOptions,
  postListSearchKey,
  toPostListParams,
  usePostListSearch,
  withoutFilter,
  withoutFilters,
  type PostFilterField,
  type PostListResponse,
  type PostListSearch,
} from '@/features/posts'
import { getErrorMessage } from '@/shared/lib/http'
import { useMediaQuery } from '@/shared/lib/useMediaQuery'
import type { PagedModel } from '@/shared/types/api'
import { Button, ButtonLink } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'
import { ErrorState } from '@/shared/ui/ErrorState'
import { PlusIcon, SearchIcon } from '@/shared/ui/icons'
import { Pagination } from '@/shared/ui/Pagination'
import { Skeleton } from '@/shared/ui/Skeleton'

import styles from './PostListPage.module.css'

/** 이 폭부터 필터를 옆 열에 펼쳐 둔다. 그 아래는 칩 → 시트 */
const WIDE_QUERY = '(min-width: 64rem)'
/** 로딩 스켈레톤 개수(화면정의서 SCR-01) */
const SKELETON_COUNT = 6

/**
 * SCR-01 게시글 목록 · `/`
 *
 * 검색 · 필터 · 페이지는 전부 URL 에 있다. 이 화면은 주소를 읽어 그리고, 바꿀 때는 주소를 바꾼다.
 * 조건을 바꾸는 동안에는 직전 목록을 흐리게 남겨 둔다(`keepPreviousData`) — 빈 화면으로 깜빡이지 않는다.
 */
export function PostListPage() {
  const { search, apply, update, hrefForPage } = usePostListSearch()
  const isWide = useMediaQuery(WIDE_QUERY)
  const query = useQuery({
    ...postListQueryOptions(toPostListParams(search)),
    placeholderData: keepPreviousData,
  })

  const [sheet, setSheet] = useState<{ open: boolean; field?: PostFilterField; key: number }>({
    open: false,
    key: 0,
  })
  const summaryRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const filterBarRef = useRef<HTMLDivElement>(null)

  const focusResults = () => headingRef.current?.focus({ preventScroll: true })

  const removeFilter = (field: PostFilterField) => apply(withoutFilter(search, field))
  const clearFilters = () => apply(withoutFilters(search))

  // 페이지를 넘기면 목록 첫 줄에서 다시 읽기 시작한다. 스크린리더도 결과 제목으로 옮긴다
  function handlePageNavigate() {
    requestAnimationFrame(() => {
      summaryRef.current?.scrollIntoView({ block: 'start' })
      focusResults()
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

  return (
    <div>
      <h1 className="sr-only">분실물 게시글 목록</h1>

      {/*
        읽는 순서 = Tab 순서 : 검색 → 필터 → 결과. 검색이 진입점이라 맨 앞이다.
        넓은 화면에서 필터가 왼쪽 열에 서는 것은 격자 영역으로 옮길 뿐, 문서 순서는 그대로 둔다
      */}
      <div className={styles.layout}>
        <div className={styles.search}>
          <PostSearchBar
            key={search.keyword}
            keyword={search.keyword}
            onSearch={(keyword) => update({ keyword })}
          />
        </div>

        {isWide ? (
          <aside className={styles.sidebar}>
            <PostFilterPanel search={search} onApply={apply} />
          </aside>
        ) : (
          <div ref={filterBarRef}>
            <PostFilterBar
              search={search}
              onOpen={(field) => setSheet((s) => ({ open: true, field, key: s.key + 1 }))}
              onRemove={removeFilter}
            />
          </div>
        )}

        <section className={styles.results} aria-labelledby="post-list-heading">
          <div ref={summaryRef} className={styles.summary}>
            <h2 id="post-list-heading" ref={headingRef} tabIndex={-1} className="sr-only">
              검색 결과
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
                    <Skeleton shape="text" width="4.5rem" />
                  </>
                ) : null
              ) : (
                <>
                  게시글 <strong data-numeric>{total.toLocaleString('ko-KR')}</strong>건
                </>
              )}
            </p>
            {isWide ? (
              <ActiveFilterList
                search={search}
                onRemove={removeFilter}
                onClearAll={clearFilters}
                onEmptied={focusResults}
              />
            ) : hasActiveFilters(search) ? (
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
        </section>
      </div>

      {isWide ? null : (
        <PostFilterSheet
          key={sheet.key}
          open={sheet.open}
          focusField={sheet.field}
          onClose={() => setSheet((s) => ({ ...s, open: false }))}
          search={search}
          onApply={applyFromSheet}
        />
      )}
    </div>
  )
}

interface PostListBodyProps {
  query: UseQueryResult<PagedModel<PostListResponse>>
  search: PostListSearch
  onClearFilters: () => void
  onClearKeyword: () => void
  firstPageHref: To
}

/** 네 가지 상태 — 로딩 · 오류 · 비어 있음 · 목록. 권한은 해당 없다(전체 공개, 소유자 동작 없음) */
function PostListBody({ query, search, onClearFilters, onClearKeyword, firstPageHref }: PostListBodyProps) {
  if (query.isPending) {
    return (
      <div className={styles.panel} aria-busy="true">
        <ul className={styles.grid} role="list">
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <li key={i} className={styles.cell}>
              <PostCardSkeleton />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (query.isError) {
    return (
      <div className={styles.panel}>
        <ErrorState
          message={getErrorMessage(query.error)}
          onRetry={() => void query.refetch()}
          retrying={query.isFetching}
        />
      </div>
    )
  }

  const { content, page } = query.data

  if (content.length === 0) {
    return (
      <div className={styles.panel}>
        <PostListEmpty
          search={search}
          totalElements={page.totalElements}
          onClearFilters={onClearFilters}
          onClearKeyword={onClearKeyword}
          firstPageHref={firstPageHref}
        />
      </div>
    )
  }

  return (
    <div className={styles.panel} aria-busy={query.isPlaceholderData}>
      <ul className={styles.grid} role="list" data-stale={query.isPlaceholderData || undefined}>
        {content.map((post) => (
          <li key={post.id} className={styles.cell}>
            <PostCard post={post} to={paths.postDetail(post.id)} />
          </li>
        ))}
      </ul>
    </div>
  )
}

interface PostListEmptyProps {
  search: PostListSearch
  totalElements: number
  onClearFilters: () => void
  onClearKeyword: () => void
  firstPageHref: To
}

/** 왜 비었는지 + 다음에 할 일. 막다른 길을 만들지 않는다 */
function PostListEmpty({
  search,
  totalElements,
  onClearFilters,
  onClearKeyword,
  firstPageHref,
}: PostListEmptyProps) {
  const auth = useAuth()

  // 주소의 page 가 끝을 넘었다(오래된 링크, 그사이 글이 지워짐)
  if (totalElements > 0) {
    return (
      <EmptyState
        titleAs="h3"
        icon={<SearchIcon />}
        title={`${search.page}페이지에는 글이 없습니다.`}
        description={`조건에 맞는 글 ${totalElements.toLocaleString('ko-KR')}건은 앞 페이지에 있습니다.`}
        action={<ButtonLink to={firstPageHref}>첫 페이지로</ButtonLink>}
      />
    )
  }

  if (hasActiveFilters(search) || search.keyword) {
    return (
      <EmptyState
        titleAs="h3"
        icon={<SearchIcon />}
        title="조건에 맞는 글이 없습니다."
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

  const createTo =
    auth.status === 'anonymous' ? paths.loginThenReturn(paths.postCreate) : paths.postCreate

  return (
    <EmptyState
      titleAs="h3"
      icon={<CategoryIcon category="ETC" />}
      title="아직 올라온 글이 없습니다."
      description="잃어버렸거나 주운 물건을 올려 보세요."
      action={
        <ButtonLink to={createTo} variant="primary">
          <PlusIcon />글 올리기
        </ButtonLink>
      }
    />
  )
}
