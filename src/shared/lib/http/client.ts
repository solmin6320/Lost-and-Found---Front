import { env } from '@/shared/config/env'

import { getAccessToken } from './accessToken'
import {
  ApiError,
  CONNECTION_FAILED_MESSAGE,
  NetworkError,
  UNEXPECTED_RESPONSE,
  isErrorResponse,
} from './errors'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/** 비어 있는 값(`undefined` · `null` · `''`)은 쿼리스트링에서 빠진다 */
export type QueryValue = string | number | boolean | null | undefined

export interface RequestOptions {
  method?: HttpMethod
  query?: Record<string, QueryValue>
  /** 일반 객체는 JSON 으로, `FormData` 는 그대로(multipart) 보낸다 */
  body?: unknown
  signal?: AbortSignal
  /** 액세스 토큰을 싣지 않는다. 토큰을 받으러 가는 `login` · `reissue` 전용 */
  skipAuth?: boolean
}

/**
 * 백엔드 호출의 유일한 통로.
 *
 * 성공이면 본문(JSON)을, 204 면 `undefined` 를 돌려준다.
 * 실패면 `ApiError`(서버가 응답함) 또는 `NetworkError`(응답 없음)를 던진다.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = options.skipAuth ? null : getAccessToken()
  const response = await send(buildUrl(path, options.query), buildInit(options, token))
  return readResult<T>(response, options.signal)
}

function buildUrl(path: string, query: RequestOptions['query']): string {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null || value === '') {
      continue
    }
    params.append(key, String(value))
  }

  const search = params.toString()
  // apiBaseUrl 이 빈 문자열이면 상대경로 — 개발은 Vite 프록시, 배포는 CloudFront 가 받는다
  return `${env.apiBaseUrl}${path}${search ? `?${search}` : ''}`
}

function buildInit(options: RequestOptions, token: string | null): RequestInit {
  const headers = new Headers({ Accept: 'application/json' })
  let body: BodyInit | undefined

  // 공개 API(목록·상세)에도 싣는다. 상세의 조회수 집계가 로그인 회원 기준이다
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (options.body instanceof FormData) {
    // Content-Type 을 직접 넣지 않는다. 브라우저가 boundary 를 붙여 채운다
    body = options.body
  } else if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
    body = JSON.stringify(options.body)
  }

  return {
    method: options.method ?? 'GET',
    headers,
    body,
    // 리프레시 토큰 쿠키를 싣는다. 빠뜨리면 로그인은 되는데 5분 뒤 재발급이 401 로 조용히 실패한다
    credentials: 'include',
    signal: options.signal,
  }
}

async function send(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init)
  } catch (error) {
    // 취소는 오류가 아니다. TanStack Query 가 알아서 처리하도록 그대로 넘긴다
    if (init.signal?.aborted) {
      throw error
    }
    throw new NetworkError({ cause: error })
  }
}

async function readResult<T>(response: Response, signal: AbortSignal | undefined): Promise<T> {
  let text: string
  try {
    text = await response.text()
  } catch (error) {
    if (signal?.aborted) {
      throw error
    }
    throw new NetworkError({ cause: error })
  }

  if (response.ok) {
    if (text === '') {
      return undefined as T
    }
    const body = parseJson(text)
    if (body === INVALID_JSON) {
      // 성공인데 JSON 이 아니다. 데이터로 취급하지 않고 실패로 드러낸다
      throw new ApiError(response.status, UNEXPECTED_RESPONSE, CONNECTION_FAILED_MESSAGE)
    }
    return body as T
  }

  const body = parseJson(text)
  if (isErrorResponse(body)) {
    throw new ApiError(response.status, body.code, body.message)
  }
  throw new ApiError(response.status, UNEXPECTED_RESPONSE, CONNECTION_FAILED_MESSAGE)
}

const INVALID_JSON = Symbol('INVALID_JSON')

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return INVALID_JSON
  }
}
