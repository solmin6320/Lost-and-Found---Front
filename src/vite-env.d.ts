/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * API 주소의 앞부분. 비워 두는 것이 기본값이다.
   * 비어 있으면 요청이 `/api/...` 상대경로로 나가고,
   * 개발 서버는 vite.config.ts 의 프록시가, 배포 환경은 CloudFront 가 백엔드로 넘긴다.
   * `http://localhost:8080` 처럼 채우면 프록시를 건너뛰고 직접 호출한다(CORS 경로 확인용).
   */
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
