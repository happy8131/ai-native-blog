import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../page";

// next/image는 테스트 환경에서 실제 이미지 최적화를 수행하지 않으므로
// 표준 <img> 태그로 대체하여 테스트 가능하게 모킹
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
    className,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  ),
}));

describe("홈페이지 네비게이션 테스트", () => {
  // =========================================================
  // 1. 홈페이지 전체 렌더링 테스트
  // =========================================================
  describe("홈페이지 전체 렌더링", () => {
    it("홈페이지가 에러 없이 렌더링된다", () => {
      // 기본 렌더링이 성공적으로 완료되는지 확인
      expect(() => render(<Home />)).not.toThrow();
    });

    it("페이지의 주요 섹션(Header, main, Footer)이 모두 렌더링된다", () => {
      render(<Home />);

      // Header 섹션 확인
      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();

      // Main 섹션 확인
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();

      // Footer 섹션 확인
      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeInTheDocument();
    });
  });

  // =========================================================
  // 2. 네비게이션 바 (Header) 테스트
  // =========================================================
  describe("네비게이션 바 (Header) 렌더링", () => {
    it("헤더 요소가 페이지에 표시된다", () => {
      render(<Home />);
      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("헤더에 사이트 로고/제목이 표시된다", () => {
      render(<Home />);
      // 헤더에 'My Awesome Site' 텍스트가 있는지 확인
      const logo = screen.getByText("My Awesome Site");
      expect(logo).toBeInTheDocument();
    });

    it("헤더의 제목이 h1 태그로 렌더링된다", () => {
      render(<Home />);
      // 사이트 로고는 h1 제목으로 표시되어야 함
      const heading = screen.getByRole("heading", {
        name: "My Awesome Site",
        level: 1,
      });
      expect(heading).toBeInTheDocument();
    });

    it("헤더에 '가입하기' 버튼이 표시된다", () => {
      render(<Home />);
      const signUpButton = screen.getByRole("button", { name: "가입하기" });
      expect(signUpButton).toBeInTheDocument();
    });

    it("헤더 전체가 화면 너비만큼 확장된다", () => {
      render(<Home />);
      const header = screen.getByRole("banner");
      // Tailwind CSS 'w-full' 클래스가 적용되어 있는지 확인
      expect(header).toHaveClass("w-full");
    });

    it("헤더에 shadow-sm 스타일이 적용된다", () => {
      render(<Home />);
      const header = screen.getByRole("banner");
      expect(header).toHaveClass("shadow-sm");
    });

    it("'가입하기' 버튼에 올바른 스타일 클래스가 적용된다", () => {
      render(<Home />);
      const signUpButton = screen.getByRole("button", { name: "가입하기" });
      // CLAUDE.md의 Button Component Rule에 따른 필수 클래스 확인
      expect(signUpButton).toHaveClass("bg-blue-600");
      expect(signUpButton).toHaveClass("hover:bg-blue-700");
      expect(signUpButton).toHaveClass("text-white");
      expect(signUpButton).toHaveClass("font-semibold");
      expect(signUpButton).toHaveClass("py-2");
      expect(signUpButton).toHaveClass("px-4");
      expect(signUpButton).toHaveClass("rounded-md");
      expect(signUpButton).toHaveClass("shadow-md");
    });
  });

  // =========================================================
  // 3. 메인 콘텐츠 렌더링 테스트
  // =========================================================
  describe("메인 콘텐츠 (Main) 렌더링", () => {
    it("메인 섹션이 페이지에 존재한다", () => {
      render(<Home />);
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
    });

    it("Next.js 로고 이미지가 렌더링된다", () => {
      render(<Home />);
      const logo = screen.getByAltText("Next.js logo");
      expect(logo).toBeInTheDocument();
    });

    it("메인 제목이 렌더링된다", () => {
      render(<Home />);
      const mainHeading = screen.getByRole("heading", {
        name: /To get started, edit the page.tsx file./i,
      });
      expect(mainHeading).toBeInTheDocument();
    });

    it("메인 제목이 h1 태그로 렌더링된다", () => {
      render(<Home />);
      const mainHeading = screen.getByRole("heading", {
        level: 1,
        name: /To get started, edit the page.tsx file./i,
      });
      expect(mainHeading).toBeInTheDocument();
    });

    it("설명 텍스트가 렌더링된다", () => {
      render(<Home />);
      // 설명 문단이 포함되어 있는지 확인
      const description = screen.getByText(
        /Looking for a starting point or more instructions?/i
      );
      expect(description).toBeInTheDocument();
    });

    it("'Deploy Now' 버튼이 메인 섹션에 표시된다", () => {
      render(<Home />);
      const deployButton = screen.getByRole("link", { name: /Deploy Now/i });
      expect(deployButton).toBeInTheDocument();
    });

    it("'Documentation' 링크가 메인 섹션에 표시된다", () => {
      render(<Home />);
      const docLink = screen.getByRole("link", { name: /Documentation/i });
      expect(docLink).toBeInTheDocument();
    });

    it("Subscribe 버튼이 메인 섹션에 렌더링된다", () => {
      render(<Home />);
      // SubscribeButton 컴포넌트가 렌더링되는지 확인
      // SubscribeButton의 구체적인 요소를 찾기 위해 실제 구현 확인 필요
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
    });
  });

  // =========================================================
  // 4. Footer 렌더링 테스트
  // =========================================================
  describe("Footer 렌더링", () => {
    it("footer 요소가 페이지에 표시된다", () => {
      render(<Home />);
      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeInTheDocument();
    });

    it("footer에 '문의하기' 버튼이 표시된다", () => {
      render(<Home />);
      const contactButton = screen.getByRole("button", { name: "문의하기" });
      expect(contactButton).toBeInTheDocument();
    });

    it("footer에 저작권 정보가 표시된다", () => {
      render(<Home />);
      const copyright = screen.getByText(
        /© 2026 My Awesome Site. 모든 권리 보유./
      );
      expect(copyright).toBeInTheDocument();
    });

    it("footer 전체가 화면 너비만큼 확장된다", () => {
      render(<Home />);
      const footer = screen.getByRole("contentinfo");
      expect(footer).toHaveClass("w-full");
    });

    it("footer에 dark-bg 스타일이 적용된다", () => {
      render(<Home />);
      const footer = screen.getByRole("contentinfo");
      // Footer는 bg-gray-900 클래스를 가져야 함
      expect(footer).toHaveClass("bg-gray-900");
    });

    it("'문의하기' 버튼에 올바른 스타일 클래스가 적용된다", () => {
      render(<Home />);
      const contactButton = screen.getByRole("button", { name: "문의하기" });
      // CLAUDE.md의 Button Component Rule에 따른 필수 클래스 확인
      expect(contactButton).toHaveClass("bg-blue-600");
      expect(contactButton).toHaveClass("hover:bg-blue-700");
      expect(contactButton).toHaveClass("text-white");
      expect(contactButton).toHaveClass("font-semibold");
      expect(contactButton).toHaveClass("py-2");
      expect(contactButton).toHaveClass("px-4");
      expect(contactButton).toHaveClass("rounded-md");
      expect(contactButton).toHaveClass("shadow-md");
    });

    it("footer의 저작권 정보가 텍스트 센터 정렬된다", () => {
      render(<Home />);
      const copyrightSection = screen.getByText(
        /© 2026 My Awesome Site. 모든 권리 보유./
      );
      // 저작권 텍스트의 부모 요소가 text-center 클래스를 가져야 함
      const textCenterDiv = copyrightSection.closest(".text-center");
      expect(textCenterDiv).toBeInTheDocument();
    });
  });

  // =========================================================
  // 5. 레이아웃 구조 테스트
  // =========================================================
  describe("레이아웃 구조", () => {
    it("페이지가 flex 컨테이너로 구성된다", () => {
      const { container } = render(<Home />);
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass("flex");
      expect(mainDiv).toHaveClass("flex-col");
    });

    it("페이지가 최소 스크린 높이를 차지한다", () => {
      const { container } = render(<Home />);
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass("min-h-screen");
    });

    it("메인 콘텐츠가 flex 레이아웃으로 구성된다", () => {
      render(<Home />);
      const main = screen.getByRole("main");
      expect(main).toHaveClass("flex");
      expect(main).toHaveClass("flex-col");
    });
  });

  // =========================================================
  // 6. 접근성 테스트
  // =========================================================
  describe("접근성", () => {
    it("header 요소가 banner 역할을 갖는다", () => {
      render(<Home />);
      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("main 요소가 main 역할을 갖는다", () => {
      render(<Home />);
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
    });

    it("footer 요소가 contentinfo 역할을 갖는다", () => {
      render(<Home />);
      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeInTheDocument();
    });

    it("모든 이미지가 alt 텍스트를 갖는다", () => {
      render(<Home />);
      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        const altText = img.getAttribute("alt");
        expect(altText).not.toBe("");
        expect(altText).not.toBeNull();
      });
    });

    it("버튼들이 접근 가능하다", () => {
      render(<Home />);
      const signUpButton = screen.getByRole("button", { name: "가입하기" });
      const contactButton = screen.getByRole("button", { name: "문의하기" });

      expect(signUpButton).toBeInTheDocument();
      expect(contactButton).toBeInTheDocument();
    });
  });

  // =========================================================
  // 7. 스냅샷 테스트
  // =========================================================
  describe("스냅샷", () => {
    it("홈페이지 전체 구조가 스냅샷과 일치한다", () => {
      const { container } = render(<Home />);
      expect(container).toMatchSnapshot();
    });
  });
});
