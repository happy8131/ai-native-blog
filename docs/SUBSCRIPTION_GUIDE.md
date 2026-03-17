# 이메일 구독 기능 사용 가이드

**버전**: 1.0
**작성일**: 2026-03-17
**대상**: 개발자, 운영자

---

## 목차

1. [빠른 시작](#빠른-시작)
2. [기능 사용하기](#기능-사용하기)
3. [설정 및 배포](#설정-및-배포)
4. [자주 묻는 질문](#자주-묻는-질문)
5. [문제 해결](#문제-해결)

---

## 빠른 시작

### 1단계: 환경 설정

`.env.local` 파일을 프로젝트 루트에 생성합니다:

```env
RESEND_API_KEY=re_test_key_for_development
RESEND_FROM_EMAIL=onboarding@resend.dev
NEXT_PUBLIC_SITE_NAME=딩코딩코
SUBSCRIBERS_FILE_PATH=./data/subscribers.json
```

> **주의**: `.env.local`은 Git에 커밋되지 않습니다 (.gitignore에 등록됨)

### 2단계: 패키지 설치

```bash
npm install
```

> Resend 패키지는 이미 `package.json`에 포함되어 있습니다.

### 3단계: 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속하면 구독 폼이 보입니다.

### 4단계: 테스트

```bash
# 이메일 입력 후 "구독" 버튼 클릭
# → 성공 메시지가 표시됩니다
# → data/subscribers.json 파일에 데이터가 저장됩니다
```

---

## 기능 사용하기

### 구독하기

```
1. 홈페이지 하단의 구독 폼에 이메일 입력
2. "구독" 버튼 클릭
3. 성공 메시지 표시
4. 확인 이메일 수신 (Resend 설정된 경우)
```

### 오류 처리

| 상황 | 메시지 | 해결 방법 |
|------|--------|---------|
| 이메일 미입력 | "이메일 주소가 필요합니다." | 이메일 입력 |
| 잘못된 형식 | "올바른 이메일 주소를 입력해주세요." | 유효한 이메일 사용 (예: user@example.com) |
| 중복 구독 | "이미 구독 중인 이메일 주소입니다." | 다른 이메일 사용 |
| 서버 오류 | "서버 오류가 발생했습니다." | 잠시 후 재시도 |

---

## 설정 및 배포

### 개발 환경 설정

#### Resend API 키 얻기

1. [Resend 웹사이트](https://resend.com)로 이동
2. 회원가입 (무료)
3. Dashboard → API Keys에서 키 복사
4. `.env.local`에 붙여넣기

```env
RESEND_API_KEY=re_your_api_key_here
```

#### 발신 이메일 주소 설정

```env
RESEND_FROM_EMAIL=onboarding@resend.dev  # 기본값
# 또는
RESEND_FROM_EMAIL=noreply@yourdomain.com  # 커스텀 도메인
```

### 프로덕션 배포 (Vercel)

#### 1단계: GitHub 푸시

```bash
git add .
git commit -m "feat: 이메일 구독 기능 구현"
git push origin main
```

#### 2단계: Vercel 환경 변수 설정

Vercel 대시보드 → Settings → Environment Variables:

```
RESEND_API_KEY=re_your_production_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_SITE_NAME=딩코딩코
SUBSCRIBERS_FILE_PATH=./data/subscribers.json
```

#### 3단계: 배포

```bash
# Vercel이 자동으로 배포합니다 (main 브랜치에 푸시 시)
# 또는 수동 배포:
# Vercel 대시보드 → Deploy
```

**주의**: 파일 시스템이 읽기 전용이므로, 프로덕션에서는 PostgreSQL 등의 데이터베이스로 마이그레이션해야 합니다.

### 데이터베이스 마이그레이션

프로덕션 규모가 커지면 PostgreSQL로 마이그레이션합니다:

```typescript
// lib/subscribers.ts 구현체만 교체
// API와 UI는 변경 없음
```

자세한 내용은 [기술 명세서 - 마이그레이션](./TECHNICAL_SPECIFICATION.md#10-마이그레이션-가이드) 참고.

---

## 자주 묻는 질문

### Q1: 구독자 데이터는 어디에 저장되나요?

**A**: 개발 환경에서는 `data/subscribers.json` 파일에 저장됩니다.

```json
[
  {
    "id": "57a29359-b3ca-4abe-a151-6ae701347c09",
    "email": "user@example.com",
    "subscribedAt": "2026-03-17T06:29:04.764Z",
    "status": "active"
  }
]
```

### Q2: 프로덕션에서 파일 저장이 작동하지 않습니다.

**A**: Vercel의 파일 시스템은 읽기 전용입니다. PostgreSQL 등의 데이터베이스로 마이그레이션해야 합니다.

[마이그레이션 가이드](./TECHNICAL_SPECIFICATION.md#10-마이그레이션-가이드) 참고.

### Q3: 이메일이 발송되지 않습니다.

**A**: 다음을 확인하세요:

1. **API 키 확인**
   ```bash
   echo $RESEND_API_KEY
   ```

2. **Resend 대시보드 확인**
   - https://resend.com/emails
   - 발송 기록이 있는지 확인

3. **스팸 폴더 확인**
   - 이메일이 스팸 폴더로 들어갔을 수 있습니다

4. **로그 확인**
   ```bash
   npm run dev  # 콘솔 로그 확인
   ```

### Q4: 구독을 취소하는 방법은?

**A**: 현재 버전에서는 구독 취소 기능이 없습니다.

향후 버전에서 추가 예정입니다 (구독 취소 링크 포함된 이메일).

### Q5: 구독자 목록을 어떻게 조회하나요?

**A**: 현재 UI는 없습니다. 파일을 직접 확인하거나 API를 추가해야 합니다.

```javascript
// GET /api/subscribers (추가 필요)
const subscribers = await fetch('/api/subscribers');
```

### Q6: 이메일 템플릿을 커스터마이징할 수 있나요?

**A**: 네, `src/lib/email.ts` 파일의 HTML 템플릿을 수정하면 됩니다.

```typescript
const htmlContent = `
<!DOCTYPE html>
<html>
  <!-- 여기를 커스터마이징 -->
</html>
`;
```

### Q7: GDPR 규정을 준수해야 하나요?

**A**: 네, 특히 EU 사용자의 경우 다음이 필요합니다:

- ✅ 구독 확인 (Double Opt-In) - 이미 구현됨
- ❌ 구독 취소 기능 - 추가 필요
- ❌ 개인정보 삭제 API - 추가 필요

---

## 문제 해결

### 문제 1: "RESEND_API_KEY가 설정되지 않았습니다" 오류

**원인**: `.env.local` 파일이 없거나 환경 변수가 설정되지 않음

**해결**:
```bash
# 1. .env.local 생성
echo "RESEND_API_KEY=re_test_key" > .env.local

# 2. 개발 서버 재시작
npm run dev
```

### 문제 2: "JSON 파싱 오류" 또는 "구독자 파일이 손상됨"

**원인**: `data/subscribers.json` 파일 손상

**해결**:
```bash
# 파일 초기화
echo "[]" > data/subscribers.json

# 개발 서버 재시작
npm run dev
```

### 문제 3: API 응답이 느림 (500ms 이상)

**원인**: 구독자가 많음 (5,000명 이상)

**해결**: [마이그레이션 가이드](./TECHNICAL_SPECIFICATION.md#10-마이그레이션-가이드)에 따라 DB로 마이그레이션

### 문제 4: "Cannot find module 'resend'" 오류

**원인**: 패키지 설치되지 않음

**해결**:
```bash
npm install
npm run dev
```

### 문제 5: "data/subscribers.json 파일이 없음" 오류

**원인**: 파일이 생성되지 않음

**해결**:
```bash
# 수동으로 생성
mkdir -p data
echo "[]" > data/subscribers.json

# 개발 서버 재시작
npm run dev
```

---

## 추가 리소스

- [Resend 문서](https://resend.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [React Hooks](https://react.dev/reference/react/hooks)
- [Tailwind CSS](https://tailwindcss.com)

---

## 지원 연락처

문제가 발생하면:

1. 이 문서의 "문제 해결" 섹션 확인
2. [기술 명세서](./TECHNICAL_SPECIFICATION.md) 참고
3. [PRD 문서](./SUBSCRIPTION_PRD.md)에서 아키텍처 확인

---

**마지막 업데이트**: 2026-03-17
**다음 검토**: 2026-06-17
