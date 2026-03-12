# React 컴포넌트 리팩토링 메모리

## 프로젝트 표준
- 프레임워크: Next.js 16 + TypeScript + Tailwind CSS
- 컴포넌트 정의: 반드시 화살표 함수(=>)
- 들여쓰기: 2칸
- 코드 주석: 한국어
- CTA 버튼 필수 클래스: `bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md`

## SOLID 적용 패턴

### Single Responsibility (단일 책임)
- 복합 컴포넌트는 역할별로 서브 컴포넌트로 분리
- 예: AuthorProfile → AuthorAvatar + AuthorInfo
- 각 서브 컴포넌트는 파일 내 비공개로 유지 (export 하지 않음)

### Interface Segregation (인터페이스 분리)
- 서브 컴포넌트 props는 `Pick<T, "field1" | "field2">` 패턴으로 최소화
- 상위 타입 전체를 넘기지 않고 필요한 필드만 전달

### Open/Closed (개방/폐쇄)
- props 인터페이스는 export하여 외부 확장 가능하게 구성

## 자주 발견되는 문제
- 마법의 숫자(magic number): 상수로 추출 (예: AVATAR_SIZE = 64)
- 중첩 구조가 깊은 JSX: 서브 컴포넌트로 분리
- props 구조 분해(destructuring) 미사용: 가독성을 위해 항상 분해
- 반환 타입 미명시: 명시적 반환 타입 `: JSX.Element` 추가 권장
- flex 컨테이너 내 이미지 크기 변형: `flex-shrink-0` 클래스로 방지

## 관련 파일
- 타입 정의: `src/types/index.ts`
- 주요 컴포넌트: `src/components/AuthorProfile.tsx`
