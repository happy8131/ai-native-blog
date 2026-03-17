# 이메일 구독 기능 PRD (Product Requirements Document)

## 1. 개요

### 1.1 프로젝트명
**딩코딩코 블로그 이메일 구독 시스템**

### 1.2 목표
블로그 방문자에게 무료 이메일 알림 기반의 구독 기능을 제공하여 신규 콘텐츠 발행 시 자동으로 구독자에게 알림을 보냄으로써 재방문율과 사용자 engagement 증대

### 1.3 핵심 가치
- **사용자 관점**: 원하는 콘텐츠를 놓치지 않고, 최신 소식을 이메일로 받을 수 있음
- **비즈니스 관점**: 구독자 리스트 확보, 재방문 유도, 이메일 마케팅 기반 마련

---

## 2. 요구사항 정의

### 2.1 기능 요구사항

#### 2.1.1 구독 폼 UI
- 이메일 입력 필드
- 구독 버튼 (프로젝트 버튼 디자인 시스템 적용)
- 에러/성공 메시지 표시
- 로딩 상태 피드백

#### 2.1.2 구독 처리 (Backend)
- 이메일 유효성 검사 (형식 검증)
- 중복 구독 방지
- 구독자 데이터 저장
- 확인 이메일 자동 발송

#### 2.1.3 이메일 알림
- HTML 기반 확인 이메일 발송
- 사이트 이름 포함
- 구독 환영 메시지

### 2.2 비기능 요구사항

| 항목 | 요구사항 | 설명 |
|------|---------|------|
| 성능 | < 1초 응답 시간 | API 응답 시간 최소화 |
| 확장성 | 5,000+ 구독자 지원 | 초기 단계에서 선형 확장 가능 |
| 신뢰성 | 99% 이상 가용성 | 서비스 중단 최소화 |
| 보안 | 이메일 입력값 검증 | XSS, SQL Injection 방지 |
| 호환성 | 모든 최신 브라우저 지원 | Chrome, Firefox, Safari, Edge |

---

## 3. 기술 아키텍처

### 3.1 시스템 다이어그램

```
┌─────────────────────────────────────────────────┐
│              Frontend (Next.js)                 │
│  ┌──────────────────────────────────────────┐  │
│  │   SubscribeForm Component (React)        │  │
│  │  - 이메일 입력                           │  │
│  │  - 상태 관리 (idle/loading/success)     │  │
│  │  - 피드백 메시지 표시                   │  │
│  └────────────┬─────────────────────────────┘  │
└───────────────┼─────────────────────────────────┘
                │ POST /api/subscribe
                │ {email: "user@example.com"}
                ▼
┌─────────────────────────────────────────────────┐
│        Backend API (Next.js Route)              │
│  ┌──────────────────────────────────────────┐  │
│  │   POST /api/subscribe                    │  │
│  │  1. 유효성 검사 (이메일 형식)           │  │
│  │  2. 중복 확인                            │  │
│  │  3. 구독자 저장                          │  │
│  │  4. 이메일 발송                          │  │
│  └────┬──────────────────────────┬──────────┘  │
└──────┼──────────────────────────┼──────────────┘
       │ read/write               │ send email
       ▼                          ▼
   ┌──────────────┐       ┌──────────────┐
   │ JSON File    │       │   Resend     │
   │ subscribers  │       │ Email Service│
   │   .json      │       │   (External) │
   └──────────────┘       └──────────────┘
```

### 3.2 기술 스택

| 계층 | 기술 | 이유 |
|------|------|------|
| Frontend | React 19 + Next.js 16 | 프로젝트 표준 |
| UI Framework | Tailwind CSS 4 | 프로젝트 표준 |
| Backend | Next.js Route Handler | 가벼운 API |
| 데이터 저장 | JSON 파일 | 최소 복잡도 (추후 DB 전환 가능) |
| 이메일 서비스 | Resend | 무료 플랜(3,000/월), Next.js 공식 지원 |
| 언어 | TypeScript | 프로젝트 표준 |

---

## 4. API 명세

### 4.1 구독 엔드포인트

**Base URL**: `/api/subscribe`

#### 요청 (Request)

```http
POST /api/subscribe HTTP/1.1
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**필드 설명:**
- `email` (string, required): 유효한 이메일 주소

#### 응답 (Response)

**201 Created - 성공**
```json
{
  "success": true,
  "message": "구독이 완료되었습니다! 확인 이메일을 확인해주세요."
}
```

**400 Bad Request - 유효성 오류**
```json
{
  "success": false,
  "error": "올바른 이메일 주소를 입력해주세요."
}
```

**409 Conflict - 중복 구독**
```json
{
  "success": false,
  "error": "이미 구독 중인 이메일 주소입니다."
}
```

**500 Internal Server Error - 서버 오류**
```json
{
  "success": false,
  "error": "서버 오류가 발생했습니다."
}
```

### 4.2 오류 처리

| 상황 | HTTP 상태 | 메시지 | 사용자 액션 |
|------|-----------|--------|-----------|
| 이메일 필수값 누락 | 400 | "이메일 주소가 필요합니다." | 이메일 입력 |
| 잘못된 형식 | 400 | "올바른 이메일 주소를 입력해주세요." | 형식 수정 후 재시도 |
| 중복 구독 | 409 | "이미 구독 중인 이메일 주소입니다." | 다른 이메일 사용 |
| 서버 오류 | 500 | "서버 오류가 발생했습니다." | 나중에 재시도 |

---

## 5. 데이터 모델

### 5.1 Subscriber (구독자)

```typescript
interface Subscriber {
  id: string;                    // UUID (고유 식별자)
  email: string;                 // 이메일 주소 (유니크)
  subscribedAt: string;          // ISO 8601 타임스탬프
  status: 'active' | 'unsubscribed'; // 구독 상태
}
```

### 5.2 저장소 형식 (data/subscribers.json)

```json
[
  {
    "id": "57a29359-b3ca-4abe-a151-6ae701347c09",
    "email": "user1@example.com",
    "subscribedAt": "2026-03-17T06:29:04.764Z",
    "status": "active"
  },
  {
    "id": "f46d7ba3-b6ef-40f4-8df1-2ccb3e92690a",
    "email": "user2@example.com",
    "subscribedAt": "2026-03-17T06:29:27.077Z",
    "status": "active"
  }
]
```

---

## 6. 구현 상세

### 6.1 파일 구조

```
my-project/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── subscribe/
│   │   │       └── route.ts         # API 엔드포인트
│   │   └── page.tsx                 # 홈페이지 (SubscribeForm 포함)
│   ├── components/
│   │   ├── SubscribeForm.tsx       # 구독 폼 컴포넌트 (새로 생성)
│   │   └── SubscribeButton.tsx     # 하위 호환용
│   ├── lib/
│   │   ├── subscribers.ts          # 구독자 CRUD 추상화 레이어
│   │   └── email.ts                # 이메일 발송 서비스
│   ├── types/
│   │   ├── subscriber.ts           # 구독자 타입 정의
│   │   └── index.ts                # 타입 re-export
├── data/
│   └── subscribers.json            # 구독자 저장소
├── .env.local                      # 환경 변수 (개발용)
├── .env.local.example              # 환경 변수 템플릿
└── .gitignore                      # Git 제외 설정
```

### 6.2 컴포넌트: SubscribeForm

**역할**: 이메일 입력 UI 및 구독 처리

**Props**: 없음 (자체 상태 관리)

**상태**:
- `email`: 입력된 이메일
- `state`: 'idle' | 'loading' | 'success' | 'error'
- `message`: 피드백 메시지

**UI 요소**:
- 이메일 입력 필드
- 구독 버튼 (버튼 디자인 시스템 적용: `bg-blue-600 hover:bg-blue-700 ...`)
- 메시지 표시 영역 (성공: 초록색, 에러: 빨간색)

**흐름**:
```
사용자 입력 → 폼 제출 → API 호출 → 응답 처리 → UI 업데이트
```

### 6.3 API 라우트: POST /api/subscribe

**처리 순서**:
1. 요청 본문 파싱 → `SubscribeRequest` 검증
2. 이메일 필수값 확인
3. 이메일 형식 정규식 검증 (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
4. 중복 구독 확인 → `findSubscriberByEmail()`
5. 새 Subscriber 객체 생성 (UUID, 타임스탐프 추가)
6. 데이터 저장소에 추가 → `addSubscriber()`
7. Resend로 확인 이메일 발송 (비동기, 실패해도 구독자는 저장됨)
8. 성공 응답 반환

**에러 처리 체인**:
```
입력 검증 오류 → 400
형식 검증 오류 → 400
중복 확인 실패 → 409
저장/이메일 오류 → 500 (단, 이메일 실패는 무시)
```

### 6.4 데이터 저장소: src/lib/subscribers.ts

**함수**:

```typescript
// 모든 구독자 조회
getAllSubscribers(): Promise<Subscriber[]>

// 이메일로 구독자 조회
findSubscriberByEmail(email: string): Promise<Subscriber | null>

// 구독자 추가
addSubscriber(email: string): Promise<Subscriber>
```

**특징**:
- JSON 파일 읽기/쓰기 (비동기)
- 오류 발생 시 빈 배열 반환
- 추상화 레이어: 구현체만 교체하면 DB 전환 가능 (Vercel 배포 시)

### 6.5 이메일 서비스: src/lib/email.ts

**함수**:

```typescript
sendSubscriptionConfirmEmail(toEmail: string): Promise<{
  success: boolean;
  error?: string;
}>
```

**이메일 내용**:
- 제목: `{사이트명} 구독 확인 - 반갑습니다!`
- HTML 템플릿: 환영 메시지, 사이트 이름 포함
- From: `process.env.RESEND_FROM_EMAIL` (기본값: onboarding@resend.dev)

**특징**:
- Resend API 호출
- 발송 실패 로그만 기록 (구독자 추가는 유지)
- 환경 변수로 발신자 이메일, 사이트명 제어

---

## 7. 환경 변수 설정

### 7.1 .env.local (개발용)

```env
# Resend 이메일 서비스
RESEND_API_KEY=re_test_key_for_development
RESEND_FROM_EMAIL=onboarding@resend.dev

# 사이트 정보
NEXT_PUBLIC_SITE_NAME=딩코딩코

# 데이터 저장소 경로
SUBSCRIBERS_FILE_PATH=./data/subscribers.json
```

### 7.2 프로덕션 배포 시

```env
RESEND_API_KEY=re_your_production_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_SITE_NAME=딩코딩코
SUBSCRIBERS_FILE_PATH=./data/subscribers.json  # Vercel은 읽기 전용이므로 DB로 전환 필요
```

---

## 8. 테스트 결과

### 8.1 API 통합 테스트

| 테스트 케이스 | 입력 | 예상 결과 | 실제 결과 | 상태 |
|--------------|------|---------|---------|------|
| 정상 구독 | `{email: "test@example.com"}` | 201, 성공 메시지 | ✅ 201 | 통과 |
| 중복 구독 | `{email: "test@example.com"}` (재입력) | 409, 중복 오류 | ✅ 409 | 통과 |
| 잘못된 형식 | `{email: "invalid-email"}` | 400, 형식 오류 | ✅ 400 | 통과 |
| 필수값 누락 | `{}` | 400, 필수값 오류 | ✅ 400 | 통과 |
| 다중 구독자 | 3명 순차 구독 | 모두 201 저장 | ✅ 3명 저장 | 통과 |

### 8.2 UI 검증

✅ 로딩 상태 표시
✅ 성공 메시지 (초록색 배경)
✅ 에러 메시지 (빨간색 배경)
✅ 버튼 디자인 시스템 적용
✅ 반응형 레이아웃 (모바일/데스크톱)

---

## 9. 배포 및 확장 전략

### 9.1 현재 구조 (개발 단계)

```
JSON 파일 저장소 (data/subscribers.json)
         ↓
로컬/소규모 배포에 적합
5,000명 규모까지 충분
```

### 9.2 Vercel 배포 시 마이그레이션 경로

```
JSON 파일 → PostgreSQL (lib/subscribers.ts 구현체만 교체)
         ↓
클라우드 DB 기반
대규모 확장 가능 (10,000+명)
```

**변경 사항 최소화**:
- API 라우트, 컴포넌트는 변경 불필요
- `src/lib/subscribers.ts` 구현체만 교체
- 타입 인터페이스는 동일 유지

### 9.3 미래 기능 확장

- 구독 취소 (unsubscribe) 링크 추가
- 이메일 템플릿 시스템
- 구독자 세분화 (카테고리별 구독)
- 이메일 발송 스케줄링 (콘텐츠 발행 시 자동 알림)
- 구독자 분석 (구독 수, 취소율 등)

---

## 10. 보안 및 규정 준수

### 10.1 데이터 보호

- ✅ 이메일 입력값 검증 (형식 검사)
- ✅ 구독자 ID는 UUID (예측 불가능)
- ✅ 민감한 파일 제외 (.env.local, data/subscribers.json → .gitignore)

### 10.2 규정 준수

- **GDPR 준비**: 구독 취소 기능 추가 필요
- **이메일 마케팅**: 구독 확인 이메일 발송 (Double Opt-In 권장)
- **스팸 방지**: Resend 내장 스팸 필터 활용

---

## 11. 프로젝트 규칙 준수

✅ **언어**: 한국어 주석 및 메시지
✅ **함수명/변수명**: 영어 (코드 표준)
✅ **컴포넌트 정의**: 화살표 함수 (=>)
✅ **버튼 스타일**: `bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md`
✅ **들여쓰기**: 2칸
✅ **TypeScript**: 타입 정의 완료

---

## 12. 참고자료

- [Resend 공식 문서](https://resend.com/docs)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [React Hooks (useState, FormEvent)](https://react.dev/reference/react)

---

## 부록: 개발 체크리스트

- [x] 패키지 설치 (resend)
- [x] 환경 변수 설정
- [x] 타입 정의 (Subscriber, SubscribeRequest, SubscribeResponse)
- [x] 데이터 저장소 구현 (subscribers.ts)
- [x] 이메일 서비스 구현 (email.ts)
- [x] API 라우트 구현 (route.ts)
- [x] SubscribeForm 컴포넌트 구현
- [x] 페이지 통합 (page.tsx)
- [x] .gitignore 업데이트
- [x] API 통합 테스트
- [ ] E2E 테스트 (Playwright)
- [ ] 성능 테스트 (응답 시간, 메모리)
- [ ] 프로덕션 배포 준비

---

**문서 버전**: 1.0
**작성일**: 2026-03-17
**최종 수정**: 2026-03-17
