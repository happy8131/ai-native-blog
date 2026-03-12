# React Testing Library QA - 프로젝트 메모리

## 프로젝트 테스트 환경 설정

- **테스트 프레임워크**: Jest + React Testing Library
- **설정 파일**: `jest.config.ts` (ts-node 필요), `jest.setup.ts`
- **Jest 설정 키**: `setupFilesAfterEnv` (setupFilesAfterFramework 아님 - 오류 주의)
- **ts-node 필수**: jest.config.ts 사용 시 반드시 `npm install --save-dev ts-node` 필요
- **next/jest**: `next/jest.js`로 import (`.js` 확장자 명시 필요)

## next/image 모킹 패턴

Next.js Image 컴포넌트는 테스트 환경에서 반드시 모킹 필요:
```tsx
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: { ... }) => (
    <img src={src} alt={alt} width={width} height={height} className={className} />
  ),
}));
```
→ 자세한 내용: `patterns.md`

## 경로 별칭

- `@/*` → `./src/*` (tsconfig.json paths 설정)
- next/jest가 자동으로 처리하므로 별도 moduleNameMapper 불필요

## 설치 필수 패키지

```
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest ts-jest ts-node
```

## 테스트 구조 패턴

describe 블록 순서 (권장):
1. 전체 컴포넌트 렌더링
2. 서브 컴포넌트별 테스트
3. Props 변경 시 업데이트 (rerender 사용)
4. 접근성 (aria-label, role, heading)
5. 엣지 케이스 (빈 문자열, 긴 텍스트, 특수 문자)
6. 스냅샷

## Author 타입 구조

```ts
interface Author {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
}
```

## 스냅샷 불일치 처리 패턴

컴포넌트 스타일 클래스 변경 시 스냅샷이 구버전을 기록하여 실패 발생.
- 원인: 컴포넌트 수정(className 추가/변경)이 스냅샷 파일에 반영되지 않음
- 해결: `npx jest --updateSnapshot` 으로 스냅샷 갱신
- 스냅샷 갱신 전 반드시 해당 className 변경이 의도된 것인지 컴포넌트와 비교 확인
- 클래스 검증 테스트(`toHaveClass`)도 컴포넌트와 동기화 필요

## AuthorProfile 컴포넌트 현재 클래스 구조

- 이미지(`AuthorAvatar`): `rounded-full object-cover flex-shrink-0`
- 섹션: `mt-12 pt-8 border-t border-gray-200`
- 레이블('작가' p 태그): `text-xs font-medium text-gray-400 uppercase tracking-wide`
- 이름(h3): `text-lg font-semibold text-gray-900`
- bio(p): `text-sm text-gray-600 mt-1`
