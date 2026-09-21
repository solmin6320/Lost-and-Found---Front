# shared — 도메인이 없는 것

"분실물 찾기"라는 말을 지워도 성립하는 코드만 둔다.
게시글·회원 같은 말이 나오면 `features/` 로 간다.

| 폴더 | 내용 |
|---|---|
| `config` | 환경변수를 읽는 통로 (`env.ts`) |
| `lib` | HTTP 클라이언트, 날짜 포맷, 작은 유틸 |
| `styles` | 리셋 · 디자인 토큰 · 전역 스타일 |
| `types` | 백엔드 공통 응답 형태(`ErrorResponse`, 페이지 응답 등) |
| `ui` | 도메인을 모르는 컴포넌트 (Button, Field, Dialog, Skeleton …) |
