import { test, expect } from '@playwright/test';

test.describe('블로그 네비게이션 E2E 테스트', () => {
  // =========================================================
  // 시나리오 1: 홈페이지 접속 및 기본 요소 확인
  // =========================================================
  test.describe('시나리오 1: 홈페이지 접속 및 기본 요소 확인', () => {
    test('홈페이지가 정상적으로 로드된다', async ({ page }) => {
      // 1단계: 홈페이지로 이동
      await page.goto('/');

      // 2단계: 페이지가 로드되었는지 확인
      await expect(page).toHaveTitle(/Home/);
    });

    test('네비게이션 바(Header)가 표시된다', async ({ page }) => {
      // 1단계: 홈페이지로 이동
      await page.goto('/');

      // 2단계: Header 요소 확인
      const header = page.getByRole('banner');
      await expect(header).toBeVisible();
    });

    test('사이트 로고/제목이 네비게이션 바에 표시된다', async ({ page }) => {
      // 1단계: 홈페이지로 이동
      await page.goto('/');

      // 2단계: 사이트 로고 확인
      const logo = page.getByRole('heading', {
        name: 'My Awesome Site',
        level: 1,
      });
      await expect(logo).toBeVisible();
    });

    test('네비게이션 바에 "가입하기" 버튼이 있다', async ({ page }) => {
      // 1단계: 홈페이지로 이동
      await page.goto('/');

      // 2단계: 가입하기 버튼 확인
      const signUpButton = page.getByRole('button', { name: '가입하기' });
      await expect(signUpButton).toBeVisible();
    });

    test('메인 콘텐츠가 표시된다', async ({ page }) => {
      // 1단계: 홈페이지로 이동
      await page.goto('/');

      // 2단계: main 요소 확인
      const main = page.getByRole('main');
      await expect(main).toBeVisible();
    });

    test('홈페이지에 메인 제목이 표시된다', async ({ page }) => {
      // 1단계: 홈페이지로 이동
      await page.goto('/');

      // 2단계: 페이지 제목 확인
      const mainHeading = page.getByRole('heading', {
        name: /To get started, edit the page.tsx file./i,
        level: 1,
      });
      await expect(mainHeading).toBeVisible();
    });

    test('Footer가 페이지 하단에 표시된다', async ({ page }) => {
      // 1단계: 홈페이지로 이동
      await page.goto('/');

      // 2단계: 페이지 스크롤 (Footer가 뷰에 들어올 때까지)
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      // 3단계: Footer 요소 확인
      const footer = page.getByRole('contentinfo');
      await expect(footer).toBeVisible();
    });

    test('Footer에 "문의하기" 버튼이 있다', async ({ page }) => {
      // 1단계: 홈페이지로 이동
      await page.goto('/');

      // 2단계: 페이지 스크롤 (Footer가 뷰에 들어올 때까지)
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      // 3단계: 문의하기 버튼 확인
      const contactButton = page.getByRole('button', { name: '문의하기' });
      await expect(contactButton).toBeVisible();
    });

    test('Footer에 저작권 정보가 표시된다', async ({ page }) => {
      // 1단계: 홈페이지로 이동
      await page.goto('/');

      // 2단계: 페이지 스크롤 (Footer가 뷰에 들어올 때까지)
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      // 3단계: 저작권 정보 확인
      const copyright = page.getByText(/© 2026 My Awesome Site/);
      await expect(copyright).toBeVisible();
    });

    test('홈페이지의 모든 이미지가 로드된다', async ({ page }) => {
      // 1단계: 홈페이지로 이동
      await page.goto('/');

      // 2단계: 모든 이미지 로드 대기
      await page.waitForLoadState('networkidle');

      // 3단계: 이미지 요소 확인
      const images = page.locator('img');
      const count = await images.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  // =========================================================
  // 시나리오 2: 블로그 목록 페이지에서 포스트 확인
  // =========================================================
  test.describe('시나리오 2: 블로그 목록 페이지에서 포스트 확인', () => {
    test('블로그 목록 페이지로 이동할 수 있다', async ({ page }) => {
      // 1단계: 블로그 페이지로 이동
      await page.goto('/blog');

      // 2단계: 페이지가 로드되었는지 확인
      await expect(page).toHaveTitle(/블로그/);
    });

    test('블로그 페이지 제목이 표시된다', async ({ page }) => {
      // 1단계: 블로그 페이지로 이동
      await page.goto('/blog');

      // 2단계: 페이지 제목 확인
      const heading = page.getByRole('heading', {
        name: '블로그',
        level: 1,
      });
      await expect(heading).toBeVisible();
    });

    test('블로그 페이지에 설명 텍스트가 표시된다', async ({ page }) => {
      // 1단계: 블로그 페이지로 이동
      await page.goto('/blog');

      // 2단계: 설명 텍스트 확인
      const description = page.getByText(
        '다양한 기술 글과 경험담을 공유하는 블로그입니다.'
      );
      await expect(description).toBeVisible();
    });

    test('첫 번째 포스트가 목록에 표시된다', async ({ page }) => {
      // 1단계: 블로그 페이지로 이동
      await page.goto('/blog');

      // 2단계: 첫 번째 포스트 제목 확인
      const firstPost = page.getByRole('heading', {
        name: '첫 번째 블로그 게시글',
      });
      await expect(firstPost).toBeVisible();
    });

    test('두 번째 포스트가 목록에 표시된다', async ({ page }) => {
      // 1단계: 블로그 페이지로 이동
      await page.goto('/blog');

      // 2단계: 두 번째 포스트 제목 확인
      const secondPost = page.getByRole('heading', {
        name: 'Next.js App Router 시작하기',
      });
      await expect(secondPost).toBeVisible();
    });

    test('각 포스트의 발행 날짜가 표시된다', async ({ page }) => {
      // 1단계: 블로그 페이지로 이동
      await page.goto('/blog');

      // 2단계: 발행 날짜 확인
      const date1 = page.getByText('2026-03-11');
      const date2 = page.getByText('2026-03-10');

      await expect(date1).toBeVisible();
      await expect(date2).toBeVisible();
    });

    test('각 포스트의 미리보기 내용이 표시된다', async ({ page }) => {
      // 1단계: 블로그 페이지로 이동
      await page.goto('/blog');

      // 2단계: 포스트 내용 미리보기 확인
      const preview1 = page.getByText(/이것은 첫 번째 블로그 게시글의 본문입니다/);
      const preview2 = page.getByText(/Next.js 13부터 도입된 App Router/);

      await expect(preview1).toBeVisible();
      await expect(preview2).toBeVisible();
    });

    test('각 포스트에 작가 정보가 표시된다', async ({ page }) => {
      // 1단계: 블로그 페이지로 이동
      await page.goto('/blog');

      // 2단계: 작가명 확인
      const authorName = page.getByText('Jane Doe');
      await expect(authorName).toBeVisible();
    });

    test('각 포스트에 작가 프로필 이미지가 표시된다', async ({ page }) => {
      // 1단계: 블로그 페이지로 이동
      await page.goto('/blog');

      // 2단계: 작가 이미지 확인
      const avatars = page.locator('img[alt*="프로필 사진"]');
      const count = await avatars.count();
      expect(count).toBeGreaterThan(0);
    });

    test('각 포스트에 "더 읽기" 링크가 있다', async ({ page }) => {
      // 1단계: 블로그 페이지로 이동
      await page.goto('/blog');

      // 2단계: "더 읽기" 링크 확인
      const readMoreLinks = page.getByText('더 읽기');
      const count = await readMoreLinks.count();
      expect(count).toBeGreaterThan(0);
    });

    test('블로그 목록 페이지에서도 Header와 Footer가 표시된다', async ({
      page,
    }) => {
      // 1단계: 블로그 페이지로 이동
      await page.goto('/blog');

      // 2단계: Header 확인
      const header = page.getByRole('banner');
      await expect(header).toBeVisible();

      // 3단계: Footer 확인 (스크롤 필요)
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      const footer = page.getByRole('contentinfo');
      await expect(footer).toBeVisible();
    });
  });

  // =========================================================
  // 시나리오 3: 개별 블로그 포스트 페이지 접근 및 콘텐츠 확인
  // =========================================================
  test.describe('시나리오 3: 개별 블로그 포스트 페이지 접근 및 콘텐츠 확인', () => {
    test('블로그 목록에서 첫 번째 포스트 제목을 클릭하면 상세 페이지로 이동한다', async ({
      page,
    }) => {
      // 1단계: 블로그 페이지로 이동
      await page.goto('/blog');

      // 2단계: 첫 번째 포스트 제목 링크 클릭
      const firstPostTitle = page.getByRole('heading', {
        name: '첫 번째 블로그 게시글',
      });
      await firstPostTitle.click();

      // 3단계: 포스트 상세 페이지로 이동했는지 확인
      await expect(page).toHaveURL(/\/posts\/first-post/);
    });

    test('포스트 상세 페이지에 포스트 제목이 표시된다', async ({ page }) => {
      // 1단계: 포스트 상세 페이지로 직접 이동
      await page.goto('/posts/first-post');

      // 2단계: 포스트 제목 확인
      const title = page.getByRole('heading', {
        name: '첫 번째 블로그 게시글',
        level: 1,
      });
      await expect(title).toBeVisible();
    });

    test('포스트 상세 페이지에 발행 날짜가 표시된다', async ({ page }) => {
      // 1단계: 포스트 상세 페이지로 이동
      await page.goto('/posts/first-post');

      // 2단계: 발행 날짜 확인
      const publishedDate = page.getByText('2026-03-11');
      await expect(publishedDate).toBeVisible();
    });

    test('포스트 상세 페이지에 전체 콘텐츠가 표시된다', async ({ page }) => {
      // 1단계: 포스트 상세 페이지로 이동
      await page.goto('/posts/first-post');

      // 2단계: 포스트 본문 확인
      const content = page.getByText(
        /이것은 첫 번째 블로그 게시글의 본문입니다/
      );
      await expect(content).toBeVisible();
    });

    test('포스트 상세 페이지에 작가 정보 섹션이 표시된다', async ({ page }) => {
      // 1단계: 포스트 상세 페이지로 이동
      await page.goto('/posts/first-post');

      // 2단계: 작가 정보 섹션 확인
      const authorSection = page.locator('section[aria-label="작가 정보"]');
      await expect(authorSection).toBeVisible();
    });

    test('포스트 상세 페이지에 작가명이 표시된다', async ({ page }) => {
      // 1단계: 포스트 상세 페이지로 이동
      await page.goto('/posts/first-post');

      // 2단계: 작가명 확인
      const authorName = page.getByRole('heading', {
        name: 'Jane Doe',
        level: 3,
      });
      await expect(authorName).toBeVisible();
    });

    test('포스트 상세 페이지에 작가 자기소개가 표시된다', async ({ page }) => {
      // 1단계: 포스트 상세 페이지로 이동
      await page.goto('/posts/first-post');

      // 2단계: 작가 자기소개 확인
      const bio = page.getByText(
        'Next.js와 TypeScript를 좋아하는 프론트엔드 개발자입니다.'
      );
      await expect(bio).toBeVisible();
    });

    test('포스트 상세 페이지에 작가 프로필 이미지가 표시된다', async ({
      page,
    }) => {
      // 1단계: 포스트 상세 페이지로 이동
      await page.goto('/posts/first-post');

      // 2단계: 작가 프로필 이미지 확인
      const avatar = page.getByAltText('Jane Doe 프로필 사진');
      await expect(avatar).toBeVisible();

      // 3단계: 이미지가 올바른 src를 가지고 있는지 확인
      await expect(avatar).toHaveAttribute(
        'src',
        '/images/authors/default-avatar.svg'
      );
    });

    test('다른 포스트 상세 페이지도 정상적으로 표시된다', async ({
      page,
    }) => {
      // 1단계: 두 번째 포스트 상세 페이지로 이동
      await page.goto('/posts/nextjs-app-router');

      // 2단계: 포스트 제목 확인
      const title = page.getByRole('heading', {
        name: 'Next.js App Router 시작하기',
        level: 1,
      });
      await expect(title).toBeVisible();

      // 3단계: 포스트 본문 확인
      const content = page.getByText(/Next.js 13부터 도입된 App Router/);
      await expect(content).toBeVisible();

      // 4단계: 작가 정보 확인
      const authorName = page.getByRole('heading', {
        name: 'Jane Doe',
        level: 3,
      });
      await expect(authorName).toBeVisible();
    });

    test('포스트 상세 페이지에서도 Header와 Footer가 표시된다', async ({
      page,
    }) => {
      // 1단계: 포스트 상세 페이지로 이동
      await page.goto('/posts/first-post');

      // 2단계: Header 확인
      const header = page.getByRole('banner');
      await expect(header).toBeVisible();

      // 3단계: Footer 확인 (스크롤 필요)
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      const footer = page.getByRole('contentinfo');
      await expect(footer).toBeVisible();
    });

    test("포스트 목록에서 '더 읽기' 버튼으로 상세 페이지에 접근할 수 있다", async ({
      page,
    }) => {
      // 1단계: 블로그 페이지로 이동
      await page.goto('/blog');

      // 2단계: 첫 번째 "더 읽기" 버튼 클릭
      const readMoreButtons = page.getByText('더 읽기');
      await readMoreButtons.first().click();

      // 3단계: 포스트 상세 페이지로 이동했는지 확인
      await expect(page).toHaveURL(/\/posts\//);

      // 4단계: 포스트 제목이 표시되는지 확인
      const title = page.getByRole('heading', { level: 1 });
      await expect(title).toBeVisible();
    });
  });

  // =========================================================
  // 추가 테스트: 전체 플로우 검증
  // =========================================================
  test.describe('추가 테스트: 전체 플로우 검증', () => {
    test('홈페이지 → 블로그 목록 → 포스트 상세 페이지의 완전한 네비게이션 플로우', async ({
      page,
    }) => {
      // 1단계: 홈페이지 접속
      await page.goto('/');
      await expect(page).toHaveTitle(/Home/);

      // 2단계: 블로그 페이지로 이동
      await page.goto('/blog');
      const blogTitle = page.getByRole('heading', {
        name: '블로그',
        level: 1,
      });
      await expect(blogTitle).toBeVisible();

      // 3단계: 포스트 클릭하여 상세 페이지로 이동
      const firstPostTitle = page.getByRole('heading', {
        name: '첫 번째 블로그 게시글',
      });
      await firstPostTitle.click();

      // 4단계: 포스트 상세 페이지 확인
      await expect(page).toHaveURL(/\/posts\/first-post/);
      const postTitle = page.getByRole('heading', {
        name: '첫 번째 블로그 게시글',
        level: 1,
      });
      await expect(postTitle).toBeVisible();

      // 5단계: 포스트 내용과 작가 정보 확인
      const content = page.getByText(/이것은 첫 번째 블로그 게시글의 본문입니다/);
      await expect(content).toBeVisible();

      const authorSection = page.locator('section[aria-label="작가 정보"]');
      await expect(authorSection).toBeVisible();
    });

    test('페이지 로드 성능 기본 검증', async ({ page }) => {
      // 1단계: 블로그 페이지로 이동
      const startTime = Date.now();
      await page.goto('/blog');
      const loadTime = Date.now() - startTime;

      // 2단계: 페이지 로드 시간이 5초 이내인지 확인
      expect(loadTime).toBeLessThan(5000);

      // 3단계: 모든 콘텐츠 로드 대기
      await page.waitForLoadState('networkidle');
    });

    test('반응형 디자인 검증 - 모바일 뷰에서도 정상 작동', async ({
      browser,
    }) => {
      // 모바일 브라우저 컨텍스트 생성
      const mobileContext = await browser.newContext({
        viewport: { width: 375, height: 667 },
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Mobile/15E148 Safari/604.1',
      });

      const mobilePage = await mobileContext.newPage();

      try {
        // 1단계: 모바일에서 블로그 페이지 접속
        await mobilePage.goto('/blog');

        // 2단계: 주요 요소가 표시되는지 확인
        const blogTitle = mobilePage.getByRole('heading', {
          name: '블로그',
          level: 1,
        });
        await expect(blogTitle).toBeVisible();

        // 3단계: 포스트 링크 클릭
        const firstPost = mobilePage.getByRole('heading', {
          name: '첫 번째 블로그 게시글',
        });
        await firstPost.click();

        // 4단계: 포스트 상세 페이지 로드 확인
        await expect(mobilePage).toHaveURL(/\/posts\/first-post/);
      } finally {
        await mobileContext.close();
      }
    });
  });
});
