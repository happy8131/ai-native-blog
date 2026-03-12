# Component Doc Writer - Memory

## 프로젝트 기본 정보
- Framework: Next.js 16, TypeScript, Tailwind CSS
- 컴포넌트 정의 방식: 화살표 함수(`=>`)만 사용 (CLAUDE.md 규칙)
- 들여쓰기: 2칸
- 타입 정의 위치: `src/types/index.ts`
- 컴포넌트 위치: `src/components/`
- 문서 저장 위치: `docs/components/`

## 문서 작성 패턴
- 문서 언어: 한국어 (코드 예제 포함)
- 코드 예제의 주석은 한국어로 작성
- Props 테이블 컬럼: Prop 이름 / 타입 / 필수 여부 / 설명
- 타입 출처(예: `@/types`)를 Props 섹션에 명시

## 확인된 타입 정의
- `Author`: `{ id: string; name: string; bio: string; avatarUrl: string; }`
- `Post`: `{ slug: string; title: string; content: string; publishedAt: string; author: Author; }`

## 문서 섹션 순서 (표준)
1. 컴포넌트 제목 (H1)
2. 한 줄 설명
3. 컴포넌트 개요 (목적, 주요 기능)
4. Props (인터페이스 테이블 + 참조 타입 정의 코드 블록)
5. 서브 컴포넌트 (존재하는 경우)
6. 사용 예시 (기본 → 고급 순서)
7. 스타일링 정보 (Tailwind 클래스 테이블)
8. 접근성
9. 아키텍처 및 설계 패턴
10. 확장성 및 재사용성
11. 주의사항 및 제약사항

## 설계 패턴 문서화 시 주의할 점
- 서브 컴포넌트가 `Pick<T, "field">` 유틸리티 타입을 사용하는 경우 아키텍처 섹션에 명시
- `AVATAR_SIZE` 같은 상수는 "상수 분리" 패턴으로 아키텍처 섹션에 설명
- 외부 이미지 URL 사용 시 `next.config.ts` 설정 방법을 주의사항과 사용 예시 모두에 포함

## 자주 참조할 파일
- 타입 정의: `src/types/index.ts`
- 실제 사용 예: `src/app/posts/[slug]/page.tsx`
- 컴포넌트 목록: `src/components/` (Header, Footer, SubscribeButton, AuthorProfile)
