# AuthorProfile

게시글 상세 페이지 하단에 작가 정보를 표시하는 섹션 컴포넌트입니다. 작가의 프로필 사진, 이름, 소개글을 시각적으로 구성하여 독자가 작가를 쉽게 파악할 수 있도록 합니다.

---

## 컴포넌트 개요

### 목적

- 게시글 본문 하단에 작가 프로필 섹션을 렌더링합니다.
- 작가의 아바타 이미지, 이름, 소개글을 하나의 시각적 단위로 묶어 표현합니다.
- 독자가 게시글 작성자를 식별하고 작가에 대한 기본 정보를 확인할 수 있도록 합니다.

### 주요 기능

- `Author` 타입의 데이터를 받아 프로필 UI로 렌더링합니다.
- Next.js `Image` 컴포넌트를 사용하여 아바타 이미지를 최적화합니다(WebP 자동 변환, 지연 로딩 등).
- 단일 책임 원칙(SRP)에 따라 `AuthorAvatar`, `AuthorInfo` 두 개의 서브 컴포넌트로 내부 분리되어 있습니다.
- WAI-ARIA `aria-label`을 통해 스크린 리더 접근성을 지원합니다.

### 파일 위치

```
src/components/AuthorProfile.tsx
```

---

## Props

### `AuthorProfileProps`

| Prop 이름 | 타입     | 필수 여부 | 설명                                     |
| --------- | -------- | --------- | ---------------------------------------- |
| `author`  | `Author` | 필수      | 렌더링할 작가 정보 객체 (`@/types` 참조) |

### `Author` 타입 정의

`Author` 인터페이스는 `src/types/index.ts`에 정의되어 있습니다.

```typescript
// src/types/index.ts
export interface Author {
  id: string;        // 작가 고유 식별자
  name: string;      // 작가 이름 (화면에 표시)
  bio: string;       // 작가 소개글
  avatarUrl: string; // 아바타 이미지 URL (내부 경로 또는 외부 URL)
}
```

`Author` 인터페이스의 모든 필드는 필수(non-optional)입니다.

---

## 서브 컴포넌트

`AuthorProfile`은 단일 책임 원칙에 따라 두 개의 내부 서브 컴포넌트로 구성됩니다. 두 컴포넌트 모두 파일 내부에 정의되어 있으며 외부로 export되지 않습니다.

### `AuthorAvatar`

작가 아바타 이미지 렌더링만을 담당하는 서브 컴포넌트입니다.

| Prop 이름   | 타입     | 필수 여부 | 설명                                                  |
| ----------- | -------- | --------- | ----------------------------------------------------- |
| `name`      | `string` | 필수      | 이미지 alt 텍스트 생성에 사용 (`{name} 프로필 사진`) |
| `avatarUrl` | `string` | 필수      | 아바타 이미지 URL                                     |

**구현 세부사항:**

- 이미지 크기는 파일 상단의 `AVATAR_SIZE` 상수(64px)로 고정됩니다.
- `rounded-full` 클래스로 원형 이미지를, `object-cover` 클래스로 비율을 유지하며 영역을 채웁니다.
- Next.js `Image` 컴포넌트를 사용하므로 WebP 자동 변환, 지연 로딩(lazy loading), 크기 최적화가 자동 적용됩니다.

### `AuthorInfo`

작가 이름과 소개글 텍스트 렌더링만을 담당하는 서브 컴포넌트입니다.

| Prop 이름 | 타입     | 필수 여부 | 설명        |
| --------- | -------- | --------- | ----------- |
| `name`    | `string` | 필수      | 작가 이름   |
| `bio`     | `string` | 필수      | 작가 소개글 |

**구현 세부사항:**

- "작가" 레이블(`text-xs`, `uppercase`, `tracking-wide`)을 상단에 표시하여 섹션 역할을 명시합니다.
- 작가 이름은 `<h3>` 태그로 마크업되어 페이지 내 문서 계층 구조를 유지합니다.
- 소개글은 `text-sm text-gray-600`으로 본문보다 시각적으로 구분됩니다.

---

## 사용 예시

### 기본 사용

게시글 상세 페이지에서 `Post` 데이터의 `author` 필드를 전달하는 가장 일반적인 사용 패턴입니다.

```tsx
// src/app/posts/[slug]/page.tsx
import AuthorProfile from "@/components/AuthorProfile";
import { getPostBySlug } from "@/lib/posts";

const PostPage = ({ params }: { params: { slug: string } }) => {
  const post = getPostBySlug(params.slug);
  if (!post) return null;

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {/* 본문 하단에 작가 프로필 섹션 삽입 */}
      <AuthorProfile author={post.author} />
    </article>
  );
};

export default PostPage;
```

### 정적 데이터로 직접 사용

테스트 또는 프리뷰 목적으로 `Author` 객체를 직접 구성하여 사용할 수 있습니다.

```tsx
import AuthorProfile from "@/components/AuthorProfile";
import { Author } from "@/types";

// 테스트 또는 스토리북용 목 데이터
const mockAuthor: Author = {
  id: "author-001",
  name: "김철수",
  bio: "소프트웨어 엔지니어이자 기술 블로거입니다. Next.js와 TypeScript에 관심이 많습니다.",
  avatarUrl: "/images/authors/cheolsu-kim.jpg",
};

const PreviewPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-6">
      <p>게시글 본문 내용...</p>
      {/* 내부 경로 이미지 사용 시 next.config 설정 불필요 */}
      <AuthorProfile author={mockAuthor} />
    </div>
  );
};

export default PreviewPage;
```

### 외부 이미지 URL 사용

아바타 이미지가 외부 CDN에 호스팅된 경우, `next.config.ts`에 해당 도메인을 허용 목록에 추가해야 합니다.

**1단계: next.config.ts 도메인 허용 등록**

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.example.com", // 아바타 이미지를 제공하는 외부 도메인
      },
    ],
  },
};

export default nextConfig;
```

**2단계: 외부 URL을 avatarUrl로 전달**

```tsx
import AuthorProfile from "@/components/AuthorProfile";
import { Author } from "@/types";

const authorWithExternalAvatar: Author = {
  id: "author-002",
  name: "이영희",
  bio: "UX 디자이너 겸 프론트엔드 개발자입니다.",
  avatarUrl: "https://cdn.example.com/avatars/younghee-lee.jpg",
};

const PostPage = () => (
  // next.config.ts에 cdn.example.com이 등록되어야 정상 렌더링됩니다
  <AuthorProfile author={authorWithExternalAvatar} />
);

export default PostPage;
```

### 고급 사용: 작가 목록 페이지에서 반복 렌더링

여러 작가를 목록으로 표시하는 경우에도 동일하게 적용할 수 있습니다.

```tsx
import AuthorProfile from "@/components/AuthorProfile";
import { Author } from "@/types";

// 예시: API 또는 CMS에서 가져온 작가 목록
const authors: Author[] = [
  {
    id: "author-001",
    name: "김철수",
    bio: "백엔드 개발자입니다.",
    avatarUrl: "/images/authors/cheolsu.jpg",
  },
  {
    id: "author-002",
    name: "이영희",
    bio: "프론트엔드 개발자입니다.",
    avatarUrl: "/images/authors/younghee.jpg",
  },
];

const AuthorsPage = () => (
  <main className="max-w-3xl mx-auto px-6 py-12">
    <h1 className="text-2xl font-bold mb-8">작가 소개</h1>
    {/* key prop은 author.id를 사용하여 안정적인 식별자를 제공합니다 */}
    {authors.map((author) => (
      <AuthorProfile key={author.id} author={author} />
    ))}
  </main>
);

export default AuthorsPage;
```

---

## 스타일링 정보

### 컴포넌트 전체 레이아웃

| 요소                | Tailwind CSS 클래스                   | 설명                                     |
| ------------------- | ------------------------------------- | ---------------------------------------- |
| `<section>` (루트)  | `mt-12 pt-8 border-t border-gray-200` | 본문과 구분하는 상단 여백 및 경계선 표시 |
| 내부 flex 컨테이너  | `flex items-center gap-4`             | 아바타와 텍스트 정보를 수평 배치         |

### `AuthorAvatar` 스타일

| 요소             | Tailwind CSS 클래스 / 속성    | 설명                                |
| ---------------- | ----------------------------- | ----------------------------------- |
| `Image` (루트)   | `rounded-full object-cover`   | 원형 크롭, 이미지 비율 유지하며 채움 |
| 이미지 고정 크기 | `width={64} height={64}`      | `AVATAR_SIZE` 상수 기준 64px 고정   |

### `AuthorInfo` 스타일

| 요소              | Tailwind CSS 클래스                                          | 설명                                |
| ----------------- | ------------------------------------------------------------ | ----------------------------------- |
| "작가" 레이블     | `text-xs font-medium text-gray-400 uppercase tracking-wide`  | 작은 대문자 회색 레이블             |
| 작가 이름 (`h3`)  | `text-lg font-semibold text-gray-900`                        | 굵은 진한 텍스트                    |
| 소개글 (`p`)      | `text-sm text-gray-600 mt-1`                                 | 작은 회색 텍스트, 이름과 간격 유지  |

---

## 접근성

| 항목               | 구현 방식                                   | 설명                                                       |
| ------------------ | ------------------------------------------- | ---------------------------------------------------------- |
| 섹션 레이블        | `<section aria-label="작가 정보">`          | 스크린 리더가 해당 섹션의 역할을 "작가 정보"로 인식합니다  |
| 이미지 대체 텍스트 | `alt={`${name} 프로필 사진`}`               | 이미지 로드 실패 또는 스크린 리더 환경에서 대체 정보 제공  |
| 제목 계층 구조     | 작가 이름에 `<h3>` 태그 사용                | 페이지 `<h1>` → 본문 섹션 → `<h3>` 작가 이름 순서 유지    |

---

## 아키텍처 및 설계 패턴

### 단일 책임 원칙 (Single Responsibility Principle)

컴포넌트를 3개의 계층으로 분리하여 각 컴포넌트가 하나의 역할만 담당하도록 설계되었습니다.

```
AuthorProfile           ← 전체 섹션 구성 및 데이터 분배 역할
├── AuthorAvatar        ← 아바타 이미지 렌더링만 담당
└── AuthorInfo          ← 텍스트 정보(이름, 소개글) 렌더링만 담당
```

이 구조는 다음과 같은 장점을 제공합니다.

- **가독성**: 각 서브 컴포넌트의 역할이 명확하여 코드를 이해하기 쉽습니다.
- **유지보수성**: 아바타 스타일 변경 시 `AuthorAvatar`만, 텍스트 레이아웃 변경 시 `AuthorInfo`만 수정하면 됩니다.
- **테스트 용이성**: 서브 컴포넌트를 독립적으로 단위 테스트할 수 있습니다.

### 상수 분리

아바타 크기를 `AVATAR_SIZE = 64` 상수로 분리하여, 크기 변경 시 한 곳만 수정하면 `width`와 `height` 두 속성이 동시에 업데이트됩니다. 매직 넘버를 방지하고 일관성을 유지합니다.

### TypeScript `Pick` 유틸리티 타입 활용

서브 컴포넌트는 `Pick<Author, "name" | "avatarUrl">` 방식으로 필요한 필드만 props로 선언합니다. 이를 통해 서브 컴포넌트가 필요 이상의 데이터에 의존하지 않도록 props 범위를 명시적으로 제한합니다.

### 화살표 함수 컴포넌트

프로젝트 컨벤션(`CLAUDE.md`)에 따라 모든 컴포넌트를 화살표 함수(`=>`)로 정의합니다.

```tsx
// 올바른 방식 (프로젝트 컨벤션)
const AuthorProfile = ({ author }: AuthorProfileProps) => { ... };

// 사용하지 않는 방식
function AuthorProfile({ author }: AuthorProfileProps) { ... }
```

---

## 확장성 및 재사용성

### 다른 페이지에서의 재사용

`AuthorProfile`은 `Author` 타입 객체만 있으면 어느 페이지에서도 사용할 수 있습니다. 작가 목록 페이지, 검색 결과 페이지, 사이드바 등 작가 정보가 필요한 모든 곳에 활용 가능합니다.

### 서브 컴포넌트 확장 시나리오

현재 서브 컴포넌트는 파일 내부에 비공개로 정의되어 있습니다. 향후 아래와 같은 확장이 필요한 경우 별도 파일로 분리하여 export할 수 있습니다.

- `AuthorAvatar`에 `<a>` 태그 감싸기로 작가 상세 페이지 연결
- `AuthorInfo`에 SNS 링크, 팔로우 버튼, 게시글 수 등 추가 정보 표시
- `Author` 타입에 `socialLinks`, `postCount` 등 필드 추가 후 서브 컴포넌트 확장
- `size` prop을 추가하여 컨텍스트별로 아바타 크기를 동적으로 지정

---

## 주의사항 및 제약사항

### Next.js Image 도메인 설정 필수

`avatarUrl`이 외부 URL인 경우 반드시 `next.config.ts`의 `images.remotePatterns`에 해당 호스트를 등록해야 합니다. 등록하지 않으면 Next.js가 이미지 요청을 차단하고 에러가 발생합니다.

### 아바타 이미지 크기 고정

아바타 크기는 `AVATAR_SIZE = 64` 상수로 고정되어 있습니다. 다른 크기가 필요한 경우 컴포넌트 내부의 상수 값을 변경하거나, `size` prop을 추가하는 방식으로 확장이 필요합니다. 현재 props로 크기를 조절할 수 없습니다.

### `Author` 필드 모두 필수

`Author` 인터페이스의 모든 필드(`id`, `name`, `bio`, `avatarUrl`)는 필수(non-optional)입니다. 데이터 소스에서 일부 필드가 없는 경우 TypeScript 컴파일 오류가 발생하므로, 타입 정의 수정 또는 기본값 처리 로직을 추가해야 합니다.

### 서브 컴포넌트 외부 접근 불가

`AuthorAvatar`와 `AuthorInfo`는 `AuthorProfile.tsx` 내부에만 정의되어 있으며 export되지 않습니다. 외부에서 두 서브 컴포넌트를 단독으로 사용하려면 별도 파일로 분리하고 export해야 합니다.

### `<h3>` 태그 사용 시 제목 계층 주의

`AuthorInfo`는 작가 이름을 `<h3>`으로 마크업합니다. 이 컴포넌트가 삽입되는 페이지에서 `<h1>`, `<h2>`가 먼저 존재해야 올바른 제목 계층 구조(Heading Hierarchy)를 유지할 수 있습니다. 계층을 건너뛰면 접근성 검사(Lighthouse, axe) 경고가 발생할 수 있습니다.
