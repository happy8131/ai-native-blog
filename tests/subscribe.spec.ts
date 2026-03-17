import { test, expect } from '@playwright/test';

test.describe('구독 기능 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('01. 구독 폼이 화면에 표시된다', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button:has-text("구독")');

    await expect(emailInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('02. 유효한 이메일로 구독할 수 있다', async ({ page }) => {
    const timestamp = Date.now();
    const email = `test-${timestamp}@example.com`;

    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button:has-text("구독")');

    await emailInput.fill(email);
    await submitButton.click();

    // 성공 메시지 확인
    await expect(page.locator('text=구독이 완료되었습니다')).toBeVisible();
  });

  test('03. 중복 구독은 불가능하다', async ({ page }) => {
    const timestamp = Date.now();
    const email = `duplicate-${timestamp}@example.com`;

    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button:has-text("구독")');

    // 첫 구독
    await emailInput.fill(email);
    await submitButton.click();
    await expect(page.locator('text=구독이 완료되었습니다')).toBeVisible();

    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('input[type="email"]');

    // 같은 이메일 재구독 시도
    await emailInput.fill(email);
    await submitButton.click();

    // 에러 메시지
    await expect(page.locator('text=이미 구독 중인 이메일 주소입니다')).toBeVisible();
  });

  test('04. 잘못된 형식의 이메일은 거부된다', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button:has-text("구독")');

    // @ 기호가 없는 이메일
    await emailInput.fill('invalidemail');
    await submitButton.click();

    // HTML5 유효성 검사 또는 서버 에러 메시지 대기
    await page.waitForTimeout(500);

    // 에러 메시지가 있거나, 폼이 제출되지 않음
    const errorMessage = page.locator('text=올바른 이메일 주소를 입력해주세요');
    const successMessage = page.locator('text=구독이 완료되었습니다');

    // 성공 메시지가 없으면 테스트 통과
    const hasSuccess = await successMessage.isVisible().catch(() => false);
    expect(hasSuccess).toBe(false);
  });

  test('05. 성공 후 입력 필드가 초기화된다', async ({ page }) => {
    const timestamp = Date.now();
    const email = `clear-${timestamp}@example.com`;

    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button:has-text("구독")');

    await emailInput.fill(email);
    await submitButton.click();
    await expect(page.locator('text=구독이 완료되었습니다')).toBeVisible();

    // 입력 필드가 비워짐
    await expect(emailInput).toHaveValue('');
  });

  test('06. 버튼 스타일이 올바르다', async ({ page }) => {
    const submitButton = page.locator('button:has-text("구독")');
    const className = await submitButton.getAttribute('class');

    expect(className).toContain('bg-blue-600');
    expect(className).toContain('hover:bg-blue-700');
    expect(className).toContain('text-white');
    expect(className).toContain('font-semibold');
  });

  test('07. 여러 개의 다른 이메일로 구독할 수 있다', async ({ page }) => {
    const timestamp = Date.now();
    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button:has-text("구독")');

    // 첫 번째 이메일
    await emailInput.fill(`user1-${timestamp}@example.com`);
    await submitButton.click();
    await expect(page.locator('text=구독이 완료되었습니다')).toBeVisible();

    await page.reload();
    await page.waitForSelector('input[type="email"]');

    // 두 번째 이메일
    await emailInput.fill(`user2-${timestamp}@example.com`);
    await submitButton.click();
    await expect(page.locator('text=구독이 완료되었습니다')).toBeVisible();
  });

  test('08. API 엔드포인트가 정상 작동한다', async ({ page }) => {
    const timestamp = Date.now();
    const email = `api-${timestamp}@example.com`;

    let apiResponse = null;

    page.on('response', response => {
      if (response.url().includes('/api/subscribe')) {
        apiResponse = response;
      }
    });

    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button:has-text("구독")');

    await emailInput.fill(email);
    await submitButton.click();

    // API 호출 대기
    await page.waitForTimeout(500);

    expect(apiResponse).not.toBeNull();
    if (apiResponse) {
      expect(apiResponse.status()).toBe(201);
    }
  });

  test('09. 페이지 로딩이 빠르다', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(10000); // 10초 이내
  });

  test('10. 블로그 페이지에서 돌아와도 폼이 작동한다', async ({ page }) => {
    const timestamp = Date.now();
    const email = `navigation-${timestamp}@example.com`;

    // 블로그 페이지 이동
    await page.goto('/blog');

    // 홈페이지 돌아오기
    await page.goto('/');

    // 폼 사용
    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button:has-text("구독")');

    await emailInput.fill(email);
    await submitButton.click();

    await expect(page.locator('text=구독이 완료되었습니다')).toBeVisible();
  });
});
