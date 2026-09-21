# 분실물 찾기 — 프론트엔드

잃어버린 물건과 주운 물건을 올리고 찾는 서비스의 React 클라이언트.
백엔드는 별도 리포지토리([Lost-and-Found](https://github.com/solmin6320/Lost-and-Found))의 REST API를 그대로 쓴다.

## 실행

```bash
npm install
cp .env.example .env
npm run dev          # http://localhost:5173
```

백엔드(`localhost:8080`)와 Docker Compose(MariaDB·Redis)가 떠 있어야 API가 응답한다.

| 명령 | 하는 일 |
|---|---|
| `npm run dev` | 개발 서버 (5173 고정) |
| `npm run build` | 타입 검사 후 `dist/` 로 빌드 |
| `npm run preview` | 빌드 결과를 로컬에서 확인 |
| `npm run typecheck` | 타입 검사만 |
| `npm run lint` | oxlint |

## API 주소를 잡는 방식

기본값은 **상대경로**다(`VITE_API_BASE_URL` 이 빈 문자열).
요청이 `/api/posts` 로 나가고, 개발에서는 Vite 프록시가, 배포에서는 CloudFront가
백엔드로 넘긴다. 두 환경 모두 브라우저가 보는 오리진이 하나다.

그래서 얻는 것

- CORS preflight 가 없다 — 로컬에서만 통과하고 배포에서 깨지는 일이 생기지 않는다
- `SameSite=Strict` 리프레시 토큰 쿠키가 실린다. 오리진이 갈리면 재발급(`[3.3]`)이 통째로 막힌다
- 로컬 구성이 배포 구성(기능명세서 11장)과 같은 모양이 된다

백엔드 CORS 설정을 직접 확인하고 싶을 때만 `.env` 에
`VITE_API_BASE_URL=http://localhost:8080` 을 채운다. 프록시를 건너뛰고 크로스 오리진으로 나간다.

## 폴더

```
src/
  app/            부팅 · 라우팅 · 공통 레이아웃
  pages/          라우트 1:1 화면. 조립만 하고 로직은 두지 않는다
  features/       도메인 단위 (auth · posts · comments · members)
  shared/         도메인이 없는 것 (ui · lib · styles · config · types)
```

자세한 규칙은 `src/features/README.md`, `src/shared/README.md` 에 있다.

## 화면과 명세서

| 경로 | 화면 | 기능명세서 |
|---|---|---|
| `/` | 게시글 목록(검색·필터) | `[4.2]` |
| `/posts/new` | 게시글 등록 | `[4.1]` `[4.5]` |
| `/posts/:postId` | 게시글 상세 · 댓글 · 상태 변경 | `[4.3]` `[5.1]` `[4.6]` |
| `/posts/:postId/edit` | 게시글 수정 | `[4.4]` `[4.5]` |
| `/login` | 로그인 | `[3.2]` |
| `/signup` | 회원가입 | `[3.1]` |
| `/me` | 내가 쓴 글 | `[6.1]` |
| `/me/settings` | 내 정보 조회 · 수정 | `[3.6]` `[3.7]` |

목록의 검색·필터·페이지는 화면을 나누지 않고 `/` 의 쿼리스트링에 싣는다.
뒤로가기·새로고침·링크 공유가 그대로 동작하고, 백엔드 `[4.2]` 의 쿼리 파라미터와 이름이 같다.

라우터는 `BrowserRouter` 다. 배포에서 `/posts/3` 직접 접근은 CloudFront 커스텀 오류 응답
(403/404 → `/index.html`, 200)이 받는다(기능명세서 11장).

## 디자인

화면에서 **색을 쓰는 곳은 유형 배지(분실/습득)뿐이다.** 나머지는 잉크(회청 무채색)와 종이로 만든다.
목록에서 "내 물건인가"를 1초 안에 판단해야 하므로, 색이 배지에만 있어야 눈이 배지로 먼저 간다.

- 유형 — 채운 배지. 분실 = 앰버 `#E8A33D`, 습득 = 청색 `#175E9E`
- 상태 — 외곽선 배지. 색을 쓰지 않고 라벨 · 점 모양 · 선 굵기로 가른다. 완료는 가장 약하게
- 빨강은 삭제(파괴적 동작)에만 쓴다

토큰은 `src/shared/styles/tokens.css` 한 파일에 있다.
