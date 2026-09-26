import { useId, useRef, useState, type FormEvent, type Ref } from 'react'

import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/features/members'
import { getErrorMessage, hasErrorCode } from '@/shared/lib/http'
import { Button } from '@/shared/ui/Button'
import { Eye, EyeSlash, WarningCircle } from '@/shared/ui/icons'
import { TextField } from '@/shared/ui/TextField'

import { useUpdatePassword } from '../model/useUpdatePassword'
import styles from './PasswordChangeForm.module.css'

/** 결과 고지 — 누르기 전에, 한 번(화면정의서 1.6). [바꾸기] 바로 위에 상시, 버튼의 설명으로도 읽힌다 */
const LOGOUT_NOTICE = '비밀번호를 바꾸면 이 기기를 포함해 로그인된 모든 기기에서 로그아웃됩니다.'

/** 서버 `PasswordUpdateRequest` 검증 문구와 같다. 보내기 전에 화면이 먼저 막는다 */
const MESSAGES = {
  currentRequired: '현재 비밀번호는 필수입니다',
  nextRequired: '새 비밀번호는 필수입니다',
  nextLength: '비밀번호는 8~20자여야 합니다',
} as const

interface PasswordChangeFormProps {
  /** 비밀번호 관리자가 어느 계정의 비밀번호인지 알도록 숨긴 아이디 칸에 넣는다 */
  email: string
  /** 성공 — 이 기기의 세션은 이미 끝났다. 로그인 화면으로 보내는 일은 부른 쪽이 한다 */
  onChanged: () => void
}

interface Errors {
  current?: string
  next?: string
  /** 어느 입력의 문제인지 모를 때(네트워크 · 서버 오류) — [바꾸기] 위 한 줄 */
  form?: string
}

function checkNext(value: string): string | undefined {
  if (!value) return MESSAGES.nextRequired
  if (value.length < PASSWORD_MIN_LENGTH || value.length > PASSWORD_MAX_LENGTH) return MESSAGES.nextLength
  return undefined
}

/**
 * [3.6] 비밀번호 바꾸기 — 현재 · 새(8~20자) 두 칸, 각각 보기/숨기기.
 * 400 `PASSWORD_MISMATCH` 는 현재 비밀번호 아래에 붙인다. 401 이 아니라 로그아웃도 재발급도 일어나지 않는다.
 * 비밀번호는 앞뒤 공백을 자르지 않는다 — 공백도 비밀번호의 일부일 수 있다.
 */
export function PasswordChangeForm({ email, onChanged }: PasswordChangeFormProps) {
  const mutation = useUpdatePassword()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const currentRef = useRef<HTMLInputElement>(null)
  const nextRef = useRef<HTMLInputElement>(null)
  const noticeId = useId()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (mutation.isPending) return

    const found: Errors = {
      current: current ? undefined : MESSAGES.currentRequired,
      next: checkNext(next),
    }
    if (found.current || found.next) {
      setErrors(found)
      const firstInvalid = found.current ? currentRef : nextRef
      firstInvalid.current?.focus()
      return
    }

    setErrors({})
    mutation.mutate(
      { currentPassword: current, password: next },
      {
        onSuccess: onChanged,
        onError: (failure) => {
          if (hasErrorCode(failure, 'PASSWORD_MISMATCH')) {
            setErrors({ current: getErrorMessage(failure) })
            currentRef.current?.focus()
          } else {
            setErrors({ form: getErrorMessage(failure) })
          }
        },
      },
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* 비밀번호 관리자가 계정을 알아보게 하는 아이디 칸. 화면 · 탭 순서에는 나오지 않는다 */}
      <input
        className="sr-only"
        type="text"
        name="username"
        autoComplete="username"
        value={email}
        readOnly
        tabIndex={-1}
        aria-hidden="true"
      />

      <PasswordInput
        ref={currentRef}
        label="현재 비밀번호"
        name="current-password"
        autoComplete="current-password"
        value={current}
        readOnly={mutation.isPending}
        error={errors.current}
        onChange={(value) => {
          setCurrent(value)
          if (errors.current || errors.form) setErrors((prev) => ({ ...prev, current: undefined, form: undefined }))
        }}
      />

      <PasswordInput
        ref={nextRef}
        label="새 비밀번호"
        name="new-password"
        autoComplete="new-password"
        value={next}
        maxLength={PASSWORD_MAX_LENGTH}
        hint="8~20자"
        readOnly={mutation.isPending}
        error={errors.next}
        onChange={(value) => {
          setNext(value)
          if (errors.next || errors.form) setErrors((prev) => ({ ...prev, next: undefined, form: undefined }))
        }}
        // 벗어날 때 검증한다. 아직 비어 있으면 탭으로 지나가는 중일 수 있어 제출 때까지 기다린다
        onBlur={(value) => {
          if (value) setErrors((prev) => ({ ...prev, next: checkNext(value) }))
        }}
      />

      <p id={noticeId} className={styles.notice}>
        {LOGOUT_NOTICE}
      </p>

      {errors.form ? (
        <p className={styles.formError} role="alert">
          <WarningCircle />
          {errors.form}
        </p>
      ) : null}

      <div>
        <Button type="submit" variant="primary" disabled={mutation.isPending} aria-describedby={noticeId}>
          {mutation.isPending ? '바꾸는 중…' : '비밀번호 바꾸기'}
        </Button>
      </div>
    </form>
  )
}

interface PasswordInputProps {
  label: string
  name: string
  autoComplete: 'current-password' | 'new-password'
  value: string
  onChange: (value: string) => void
  /** 벗어날 때의 값 */
  onBlur?: (value: string) => void
  error?: string
  hint?: string
  maxLength?: number
  readOnly?: boolean
  ref?: Ref<HTMLInputElement>
}

/** 비밀번호 한 칸 + 보기/숨기기. 불안한 상태에서 한 손으로 치다 보면 오타가 난다 */
function PasswordInput({ label, onChange, onBlur, ref, ...rest }: PasswordInputProps) {
  const [shown, setShown] = useState(false)

  return (
    <TextField
      ref={ref}
      label={label}
      type={shown ? 'text' : 'password'}
      spellCheck={false}
      autoCapitalize="none"
      onChange={(event) => onChange(event.target.value)}
      onBlur={(event) => onBlur?.(event.currentTarget.value)}
      trailing={
        <button
          type="button"
          className={styles.reveal}
          aria-label={`${label} 보기`}
          aria-pressed={shown}
          onClick={() => setShown((value) => !value)}
        >
          {shown ? <EyeSlash /> : <Eye />}
        </button>
      }
      {...rest}
    />
  )
}
