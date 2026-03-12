import type { Config } from "jest";
import nextJest from "next/jest.js";

// Next.js 앱 경로를 기반으로 Jest 설정을 자동 구성하는 팩토리 함수
const createJestConfig = nextJest({
  dir: "./",
});

// Jest 기본 설정 객체
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  // 각 테스트 파일 실행 전 jest-dom 커스텀 매처를 전역으로 등록
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

// next/jest가 Next.js 설정(경로 별칭, 이미지 모킹 등)을 자동으로 처리하도록 래핑
export default createJestConfig(config);
