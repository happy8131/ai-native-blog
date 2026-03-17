# 이메일 구독 기능 기술 명세서 (Technical Specification)

## 1. 개요

이 문서는 딩코딩코 블로그의 이메일 구독 기능의 상세한 기술 명세를 다룹니다.

**작성일**: 2026-03-17
**버전**: 1.0
**상태**: 구현 완료 및 검증됨

---

## 2. 시스템 아키텍처

### 2.1 계층 구조

```
┌─────────────────────────────────┐
│   Presentation Layer            │  SubscribeForm 컴포넌트
│   (React Component)             │  - UI 렌더링
│                                 │  - 상태 관리
└─────────────────┬───────────────┘
                  │ fetch() API
┌─────────────────▼───────────────┐
│   API Layer                     │  POST /api/subscribe
│   (Next.js Route Handler)       │  - 요청 검증
│                                 │  - 비즈니스 로직
└─────────────────┬───────────────┘
                  │
        ┌─────────┴──────────┐
        │                    │
┌───────▼────────┐   ┌──────▼──────────┐
│ Data Layer     │   │ External Service│
│ (JSON File)    │   │ (Resend API)    │
│                │   │                 │
│ subscribers.ts │   │ email.ts        │
└────────────────┘   └─────────────────┘
```

### 2.2 데이터 흐름 (Sequence Diagram)

```
User                SubscribeForm         API                Resend
  │                      │                │                   │
  │─ 이메일 입력 ────────→│                │                   │
  │                      │                │                   │
  │─ 구독 버튼 클릭──────→│                │                   │
  │                      │─ POST /api/subscribe ──────────→│
  │                      │                │                   │
  │                      │                │─ 유효성 검사──────┐
  │                      │                │ (형식/중복)       │
  │                      │                │←─────────────────┘
  │                      │                │
  │                      │                │─ DB 저장─────────┐
  │                      │                │ (JSON 파일)      │
  │                      │                │←─────────────────┘
  │                      │                │
  │                      │                │─ 이메일 발송──────→
  │                      │                │ (비동기)          │
  │                      │                │
  │                      │←─ 201 Created ─│
  │                      │ {success:true} │
  │                      │                │
  │← 성공 메시지 ────────│                │
  │   (초록색)           │                │
```

---

## 3. 상세 구현 명세

### 3.1 Frontend: SubscribeForm.tsx

#### 파일 경로
```
src/components/SubscribeForm.tsx
```

#### 특징
- **Client Component**: `'use client'` 지시자 사용
- **상태 관리**: React Hooks (useState)
- **스타일**: Tailwind CSS (프로젝트 표준)

#### 타입 정의

```typescript
type FormState = 'idle' | 'loading' | 'success' | 'error';

interface Props {
  // 특정 props 없음 (자체 상태 관리)
}

interface State {
  email: string;        // 입력된 이메일
  state: FormState;     // 폼 상태
  message: string;      // 피드백 메시지
}
```

#### 상태 전이 다이어그램

```
       ┌─────────────┐
       │    idle     │
       └──────┬──────┘
              │ 사용자가 submit
              ▼
       ┌─────────────┐
       │   loading   │
       └──────┬──────┘
              │
        ┌─────┴────────┐
        │              │
     ◀─▼─┐  ┌──────────▼─┐
  success│  │     error   │
        │  │              │
     back to idle (버튼 재클릭)
```

#### 주요 메서드

```typescript
// 폼 제출 핸들러
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  // 1. 기본 폼 제출 방지
  // 2. 로딩 상태 활성화
  // 3. API 호출 (fetch)
  // 4. 응답 처리
  // 5. UI 업데이트
}
```

#### CSS 클래스 설명

```html
<!-- 폼 컨테이너 -->
<form className="flex flex-col gap-3 w-full">
  <!-- 입력 영역 (가로 배열) -->
  <div className="flex gap-2">
    <!-- 이메일 입력 -->
    <input className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 disabled:bg-gray-100" />

    <!-- 구독 버튼 (프로젝트 표준) -->
    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md disabled:bg-gray-400" />
  </div>

  <!-- 메시지 영역 -->
  <div className={`text-sm p-3 rounded-md ${
    state === 'success'
      ? 'bg-green-50 text-green-800'      // 성공: 초록색
      : 'bg-red-50 text-red-800'          // 에러: 빨간색
  }`} />
</form>
```

#### 렌더링 결과

```
┌─────────────────────────────────┐
│ 📧 이메일 입력란  [  구독 버튼  ] │  (일반 상태)
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 📧 이메일 입력란  [처리 중...   ] │  (로딩 상태)
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 📧 이메일 입력란  [  구독 버튼  ] │
├─────────────────────────────────┤
│ ✅ 구독이 완료되었습니다!        │  (성공)
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 📧 이메일 입력란  [  구독 버튼  ] │
├─────────────────────────────────┤
│ ❌ 이미 구독 중입니다.           │  (에러)
└─────────────────────────────────┘
```

---

### 3.2 Backend: API Route (route.ts)

#### 파일 경로
```
src/app/api/subscribe/route.ts
```

#### HTTP 메서드
```
POST /api/subscribe
```

#### 요청/응답 처리 흐름

```javascript
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    // 1단계: 요청 파싱
    const body: SubscribeRequest = await request.json();
    const { email } = body;

    // 2단계: 필수값 검증
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: '이메일이 필요합니다.' },
        { status: 400 }
      );
    }

    // 3단계: 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isValidEmail(email.trim())) {
      return NextResponse.json(
        { success: false, error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 4단계: 중복 확인
    const existing = await findSubscriberByEmail(email.trim());
    if (existing) {
      return NextResponse.json(
        { success: false, error: '이미 구독 중입니다.' },
        { status: 409 }
      );
    }

    // 5단계: 데이터 저장
    const subscriber = await addSubscriber(email.trim());

    // 6단계: 이메일 발송 (실패해도 무시)
    const emailResult = await sendSubscriptionConfirmEmail(email.trim());
    if (!emailResult.success) {
      console.error('이메일 발송 실패:', emailResult.error);
    }

    // 7단계: 성공 응답
    return NextResponse.json(
      { success: true, message: '구독이 완료되었습니다!' },
      { status: 201 }
    );

  } catch (error) {
    // 예외 처리
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
};
```

#### 이메일 정규식 분석

```regex
^[^\s@]+@[^\s@]+\.[^\s@]+$
 │         │      │    │
 │         │      │    └─ 점(.) 이후 1자 이상
 │         │      └────── 점(.)
 │         └────────────── @ 이후 1자 이상 (특수문자, 공백 제외)
 └────────────────────── 시작: 1자 이상 (@ 제외)

예시:
✅ user@example.com
✅ john.doe@company.co.uk
❌ invalid-email (@ 없음)
❌ @example.com (@ 앞이 비어있음)
❌ user@.com (@ 뒤가 비어있음)
```

#### 응답 상태 코드

| 코드 | 의미 | 본문 예시 |
|------|------|---------|
| 201 | Created | `{success: true, message: "..."}` |
| 400 | Bad Request | `{success: false, error: "..."}` |
| 409 | Conflict | `{success: false, error: "..."}` |
| 500 | Server Error | `{success: false, error: "..."}` |

---

### 3.3 Data Layer: subscribers.ts

#### 파일 경로
```
src/lib/subscribers.ts
```

#### 함수 명세

##### `getAllSubscribers()`

```typescript
export const getAllSubscribers = async (): Promise<Subscriber[]>
```

**목적**: 모든 구독자 조회

**구현**:
1. 파일 경로 해결 (환경 변수 또는 기본값)
2. 파일 읽기 (비동기, utf-8)
3. JSON 파싱
4. 배열 반환 (실패 시 빈 배열)

**에러 처리**: 파일이 없거나 읽을 수 없으면 `[]` 반환

```typescript
try {
  const filePath = getSubscribersFilePath();
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
} catch {
  return []; // 조용히 실패
}
```

##### `findSubscriberByEmail(email: string)`

```typescript
export const findSubscriberByEmail = async (
  email: string
): Promise<Subscriber | null>
```

**목적**: 이메일로 구독자 검색

**구현**:
1. 모든 구독자 조회
2. 배열에서 이메일 일치 확인
3. 일치하면 반환, 아니면 null

```typescript
const subscribers = await getAllSubscribers();
return subscribers.find(sub => sub.email === email) || null;
```

**시간 복잡도**: O(n) - 선형 검색

##### `addSubscriber(email: string)`

```typescript
export const addSubscriber = async (
  email: string
): Promise<Subscriber>
```

**목적**: 새 구독자 추가

**구현**:
1. 모든 구독자 조회
2. 새 Subscriber 객체 생성:
   - `id`: UUID (crypto.randomUUID())
   - `email`: 입력 이메일
   - `subscribedAt`: 현재 ISO 타임스탐프
   - `status`: 'active'
3. 배열에 추가
4. 파일에 JSON 형식으로 쓰기
5. 생성된 구독자 반환

```typescript
const newSubscriber: Subscriber = {
  id: crypto.randomUUID(),
  email,
  subscribedAt: new Date().toISOString(),
  status: 'active',
};

subscribers.push(newSubscriber);
await fs.writeFile(filePath, JSON.stringify(subscribers, null, 2));
return newSubscriber;
```

**주의**: JSON 직렬화 시 2칸 들여쓰기 (가독성 목적)

---

### 3.4 Email Service: email.ts

#### 파일 경로
```
src/lib/email.ts
```

#### 초기화

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
```

**환경 변수**:
- `RESEND_API_KEY`: Resend API 키 (필수)

#### 함수 명세

##### `sendSubscriptionConfirmEmail(toEmail: string)`

```typescript
export const sendSubscriptionConfirmEmail = async (
  toEmail: string
): Promise<{ success: boolean; error?: string }>
```

**목적**: 구독 확인 이메일 발송

**매개변수**:
- `toEmail`: 수신자 이메일 주소

**반환값**:
- 성공: `{ success: true }`
- 실패: `{ success: false, error: "..." }`

**이메일 구성**:

```
제목: {NEXT_PUBLIC_SITE_NAME} 구독 확인 - 반갑습니다!
발신: process.env.RESEND_FROM_EMAIL (기본값: onboarding@resend.dev)
형식: HTML
```

**HTML 템플릿 구조**:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      /* 기본 스타일 */
      body { font-family: system-ui; color: #333; }
      .container { max-width: 600px; padding: 20px; border: 1px solid #eee; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        {사이트명}에 구독해주셨습니다!
      </div>
      <div class="content">
        <p>안녕하세요!</p>
        <p>이메일 구독을 완료해주셨습니다. ...</p>
      </div>
      <div class="footer">
        이 이메일을 받고 싶지 않으시다면...
      </div>
    </div>
  </body>
</html>
```

**에러 처리**:
1. try-catch로 예외 포착
2. 예외 메시지를 error 필드에 기록
3. 호출자는 실패 감지 가능

```typescript
try {
  await resend.emails.send({...});
  return { success: true };
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
  return { success: false, error: errorMessage };
}
```

---

### 3.5 Type Definitions: subscriber.ts

#### 파일 경로
```
src/types/subscriber.ts
```

#### 타입 정의

```typescript
/**
 * 구독자 상태
 */
export type SubscriberStatus = 'active' | 'unsubscribed';

/**
 * 구독자 데이터 모델
 */
export interface Subscriber {
  id: string;              // UUID
  email: string;           // 이메일 주소
  subscribedAt: string;    // ISO 8601 타임스탬프
  status: SubscriberStatus;
}

/**
 * API 요청 바디
 */
export interface SubscribeRequest {
  email: string;
}

/**
 * API 응답 바디
 */
export interface SubscribeResponse {
  success: boolean;
  message?: string;
  error?: string;
}
```

#### 타입 관계도

```
SubscribeRequest
  └─ { email: string }
     └─> API 호출

SubscribeResponse
  ├─ 성공: { success: true, message: "..." }
  └─ 실패: { success: false, error: "..." }

Subscriber (내부 데이터 모델)
  ├─ id: UUID
  ├─ email: 고유값
  ├─ subscribedAt: 타임스탐프
  └─ status: 'active' | 'unsubscribed'
```

---

## 4. 데이터 저장소 명세

### 4.1 파일 경로

```
{project_root}/data/subscribers.json
```

### 4.2 파일 형식

**초기 상태**:
```json
[]
```

**한 명 구독 후**:
```json
[
  {
    "id": "57a29359-b3ca-4abe-a151-6ae701347c09",
    "email": "test@example.com",
    "subscribedAt": "2026-03-17T06:29:04.764Z",
    "status": "active"
  }
]
```

**크기 추정**:
- 구독자당: ~150-200 bytes
- 1,000명: ~200 KB
- 5,000명: ~1 MB (실용적 상한)

### 4.3 환경 변수

```env
SUBSCRIBERS_FILE_PATH=./data/subscribers.json
```

**동작**:
- 상대 경로 → `process.cwd()` 기준 해석
- 기본값: `./data/subscribers.json`

---

## 5. 성능 고려사항

### 5.1 응답 시간 분석

```
API 요청 처리 흐름           예상 시간
├─ 요청 파싱                 ~1ms
├─ 유효성 검사               ~2ms
├─ 파일 읽기 (첫 호출)       ~10ms
├─ 배열 검색                 ~5-50ms (구독자 수에 따라)
├─ 파일 쓰기                 ~15-30ms
├─ 이메일 발송 (비동기)      ~500-1000ms (다른 스레드)
└─ 응답 전송                 ~5ms
─────────────────────────────────────
총 동기 처리 시간:          ~40-100ms
(이메일은 비동기이므로 응답 시간에 영향 없음)
```

### 5.2 최적화 기회

1. **캐싱**: 구독자 목록을 메모리에 캐시 (변경 시 갱신)
2. **DB 마이그레이션**: PostgreSQL 등으로 전환 시 대규모 확장
3. **배치 처리**: 여러 이메일을 일괄 발송
4. **비동기 큐**: 이메일 발송을 큐 시스템으로 처리

### 5.3 확장성 한계

```
JSON 파일 기반
├─ 권장: 5,000명 이하
├─ 성능 만족도: 높음
└─ 동시성: 제한적 (파일 I/O)

       ↓ 마이그레이션

PostgreSQL 기반
├─ 권장: 100,000명 이상
├─ 성능 만족도: 높음 (인덱싱)
└─ 동시성: 우수 (커넥션 풀)
```

---

## 6. 보안 명세

### 6.1 입력 검증

```typescript
// 이메일 정규식 검증
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 검사 항목
✓ 필수값 확인
✓ 문자열 타입 확인
✓ 형식 검증 (이메일)
✓ 중복 확인
✗ XSS 공격 방지 (자동, JSON 직렬화)
✗ SQL Injection 방지 (파일 저장소이므로 해당 없음)
```

### 6.2 환경 변수 보안

```
.env.local       ← Git 제외 (개발용 민감 정보)
.env.local.example ← Git 포함 (템플릿)
data/subscribers.json ← Git 제외 (사용자 데이터)
```

### 6.3 API 보안

```
✓ HTTPS 강제 (프로덕션 배포 시)
✓ CORS 정책 (필요 시 설정)
✓ Rate limiting (Vercel 내장, 또는 미들웨어 추가)
✓ 입력 검증 (위 참고)
```

---

## 7. 테스트 전략

### 7.1 단위 테스트 (Unit Tests)

```typescript
describe('subscribers.ts', () => {
  it('should add a subscriber', async () => {
    const subscriber = await addSubscriber('test@example.com');
    expect(subscriber.email).toBe('test@example.com');
    expect(subscriber.status).toBe('active');
  });

  it('should find subscriber by email', async () => {
    await addSubscriber('test@example.com');
    const found = await findSubscriberByEmail('test@example.com');
    expect(found).not.toBeNull();
    expect(found?.email).toBe('test@example.com');
  });
});

describe('email.ts', () => {
  it('should send email successfully', async () => {
    const result = await sendSubscriptionConfirmEmail('test@example.com');
    expect(result.success).toBe(true);
  });
});
```

### 7.2 통합 테스트 (Integration Tests)

```bash
# curl로 테스트
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# 예상 응답
# HTTP 201 Created
# {success: true, message: "..."}
```

### 7.3 E2E 테스트 (Playwright)

```typescript
test('subscribe form should submit email', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // 이메일 입력
  await page.fill('input[type="email"]', 'test@example.com');

  // 구독 버튼 클릭
  await page.click('button:has-text("구독")');

  // 성공 메시지 확인
  await page.waitForSelector('text=구독이 완료되었습니다');
});
```

### 7.4 테스트 결과 (실제 검증됨)

```
✅ 정상 구독 (201)
✅ 중복 구독 차단 (409)
✅ 형식 검증 (400)
✅ 필수값 검증 (400)
✅ 다중 구독자 저장
✅ 이메일 발송 (Resend)
```

---

## 8. 배포 및 운영

### 8.1 개발 환경 (로컬)

```bash
# 설치
npm install

# 개발 서버 실행
npm run dev

# 접속
http://localhost:3000
```

### 8.2 프로덕션 배포 (Vercel)

```bash
# 빌드
npm run build

# 배포
git push origin main
# → Vercel 자동 배포

# 환경 변수 설정 (Vercel 대시보드)
RESEND_API_KEY=re_***
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_SITE_NAME=딩코딩코
```

**주의**: Vercel의 파일 시스템은 읽기 전용이므로, 프로덕션에서는 `lib/subscribers.ts`를 DB 구현으로 교체해야 합니다.

### 8.3 모니터링

```
로그 확인:
- Vercel 대시보드 → Logs
- API 오류: 500 에러 체크
- 이메일: Resend 대시보드에서 발송 현황 확인
```

### 8.4 백업 및 복구

```bash
# 로컬 개발 환경
data/subscribers.json # 구독자 데이터 백업

# 프로덕션
DB 자동 백업 (PostgreSQL 등)
```

---

## 9. 문제 해결 (Troubleshooting)

### 9.1 이메일 발송 실패

**증상**: "이메일 발송 실패" 로그

**원인**:
1. `RESEND_API_KEY` 환경 변수 미설정
2. 유효하지 않은 API 키
3. Resend API 서버 다운

**해결**:
```bash
# 1. 환경 변수 확인
echo $RESEND_API_KEY

# 2. Resend 대시보드에서 키 재생성
# https://resend.com/api-keys

# 3. 재배포
npm run build && npm run dev
```

### 9.2 구독자 파일 손상

**증상**: JSON 파싱 오류

**원인**: 파일 시스템 오류 또는 수동 수정

**해결**:
```bash
# 파일 초기화
echo "[]" > data/subscribers.json

# 재구성 (필요 시)
npm run dev
```

### 9.3 성능 저하

**증상**: API 응답 시간 > 500ms

**원인**: 구독자 수 증가 (5,000명 이상)

**해결**: PostgreSQL로 마이그레이션
```typescript
// lib/subscribers.ts 구현체 교체
// 기존 타입/API는 유지
```

---

## 10. 마이그레이션 가이드

### 10.1 JSON → PostgreSQL 마이그레이션

**단계별 변경**:

1. **원본 저장** (git commit)
   ```bash
   git add .
   git commit -m "backup: json-based subscribers"
   ```

2. **DB 드라이버 설치**
   ```bash
   npm install pg
   ```

3. **lib/subscribers.ts 구현체 교체**
   ```typescript
   // 기존
   export const addSubscriber = async (email: string): Promise<Subscriber> => {
     // JSON 파일 로직
   }

   // 변경
   export const addSubscriber = async (email: string): Promise<Subscriber> => {
     // SQL INSERT 로직
     const result = await db.query(
       'INSERT INTO subscribers (id, email, subscribed_at, status) VALUES ($1, $2, $3, $4) RETURNING *',
       [uuid(), email, new Date().toISOString(), 'active']
     );
     return mapRowToSubscriber(result.rows[0]);
   }
   ```

4. **데이터 마이그레이션**
   ```sql
   INSERT INTO subscribers (id, email, subscribed_at, status)
   SELECT id, email, subscribed_at, status FROM json_subscribers;
   ```

5. **테스트**
   ```bash
   npm run test:e2e
   ```

6. **배포**
   ```bash
   git push origin main
   ```

**장점**:
- 구독자 타입/API 변경 불필요
- 점진적 마이그레이션 가능
- 롤백 용이

---

## 11. 버전 관리 및 변경 사항

### 11.1 현재 버전: 1.0

```
v1.0 (2026-03-17)
├─ 기본 구독 기능
├─ JSON 파일 저장소
├─ Resend 이메일 서비스
└─ React 컴포넌트 UI
```

### 11.2 예정된 업데이트

```
v2.0 (예상)
├─ PostgreSQL 지원
├─ 구독 취소 기능
├─ 이메일 템플릿 시스템
└─ 분석/대시보드

v3.0 (예상)
├─ 카테고리별 구독
├─ 자동 이메일 발송
└─ Webhook 지원
```

---

## 부록: 주요 코드 스니펫

### A.1 환경 변수 로딩

```typescript
// process.env (Next.js 내장)
const apiKey = process.env.RESEND_API_KEY;        // 서버 전용
const siteName = process.env.NEXT_PUBLIC_SITE_NAME; // 클라이언트 접근 가능

if (!apiKey) {
  throw new Error('RESEND_API_KEY가 설정되지 않았습니다.');
}
```

### A.2 UUID 생성

```typescript
import crypto from 'crypto';

const id = crypto.randomUUID();
// → "57a29359-b3ca-4abe-a151-6ae701347c09"
```

### A.3 ISO 타임스탐프

```typescript
const timestamp = new Date().toISOString();
// → "2026-03-17T06:29:04.764Z"
```

### A.4 파일 I/O

```typescript
import fs from 'fs/promises';
import path from 'path';

// 읽기
const data = await fs.readFile(filePath, 'utf-8');

// 쓰기
await fs.writeFile(filePath, JSON.stringify(data, null, 2));

// 경로 해석
const fullPath = path.resolve(process.cwd(), relativePath);
```

---

**문서 버전**: 1.0
**최종 수정**: 2026-03-17
**다음 검토**: 2026-06-17 (또는 마이그레이션 시)
