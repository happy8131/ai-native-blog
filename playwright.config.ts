import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // 테스트 실행 시간 초과 (5초)
  timeout: 5 * 1000,
  // 테스트 기대 시간 초과 (5초)
  expect: {
    timeout: 5 * 1000,
  },
  // 실패한 테스트 재시도 2회
  retries: process.env.CI ? 2 : 0,
  // 동시 실행할 워커 수
  workers: process.env.CI ? 1 : undefined,
  // 리포터 설정
  reporter: 'html',
  // 웹 서버 설정
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  use: {
    // 기본 URL (모든 page.goto()에서 사용)
    baseURL: 'http://localhost:3000',
    // 스크린샷 캡처
    screenshot: 'only-on-failure',
    // 비디오 녹화
    video: 'retain-on-failure',
    // 추적 기록
    trace: 'on-first-retry',
  },

  // 여러 브라우저에서 테스트 실행
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // 모바일 테스트
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
