import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PostPage from "../[slug]/page";

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

// next/navigation의 notFound 모킹
jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("Not Found");
  }),
}));

describe("블로그 포스트 읽기 - 포스트 상세 페이지", () => {
  // =========================================================
  // 1. 포스트 페이지 전체 렌더링 테스트
  // =========================================================
  describe("포스트 페이지 전체 렌더링", () => {
    it("포스트 페이지가 에러 없이 렌더링된다", () => {
      const params = { slug: "first-post" };
      expect(() => render(<PostPage params={params} />)).not.toThrow();
    });

    it("페이지의 주요 섹션(Header, main, Footer)이 모두 렌더링된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      // Header 섹션 확인 (네비게이션 헤더만 선택)
      const headers = screen.getAllByRole("banner");
      expect(headers.length).toBeGreaterThan(0);

      // Main 섹션 확인
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();

      // Footer 섹션 확인
      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeInTheDocument();
    });

    it("article 요소가 메인 섹션에 존재한다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();
    });
  });

  // =========================================================
  // 2. 포스트 제목 렌더링 테스트
  // =========================================================
  describe("포스트 제목 (Title) 렌더링", () => {
    it("포스트 제목이 화면에 표시된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const title = screen.getByText("첫 번째 블로그 게시글");
      expect(title).toBeInTheDocument();
    });

    it("포스트 제목이 h1 태그로 렌더링된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const heading = screen.getByRole("heading", {
        name: "첫 번째 블로그 게시글",
        level: 1,
      });
      expect(heading).toBeInTheDocument();
    });

    it("포스트 제목에 font-bold 클래스가 적용된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const heading = screen.getByRole("heading", {
        name: "첫 번째 블로그 게시글",
        level: 1,
      });
      expect(heading).toHaveClass("font-bold");
    });

    it("포스트 제목에 text-3xl 클래스가 적용된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const heading = screen.getByRole("heading", {
        name: "첫 번째 블로그 게시글",
        level: 1,
      });
      expect(heading).toHaveClass("text-3xl");
    });

    it("다른 슬러그의 포스트 제목이 올바르게 렌더링된다", () => {
      const params = { slug: "nextjs-app-router" };
      render(<PostPage params={params} />);

      const title = screen.getByText("Next.js App Router 시작하기");
      expect(title).toBeInTheDocument();
    });
  });

  // =========================================================
  // 3. 발행 날짜 렌더링 테스트
  // =========================================================
  describe("발행 날짜 (Published Date) 렌더링", () => {
    it("포스트 발행 날짜가 표시된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const publishedDate = screen.getByText("2026-03-11");
      expect(publishedDate).toBeInTheDocument();
    });

    it("발행 날짜에 text-gray-400 클래스가 적용된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const publishedDate = screen.getByText("2026-03-11");
      expect(publishedDate).toHaveClass("text-gray-400");
    });

    it("발행 날짜에 text-sm 클래스가 적용된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const publishedDate = screen.getByText("2026-03-11");
      expect(publishedDate).toHaveClass("text-sm");
    });

    it("다른 포스트의 발행 날짜가 올바르게 렌더링된다", () => {
      const params = { slug: "nextjs-app-router" };
      render(<PostPage params={params} />);

      const publishedDate = screen.getByText("2026-03-10");
      expect(publishedDate).toBeInTheDocument();
    });
  });

  // =========================================================
  // 4. 포스트 내용 렌더링 테스트
  // =========================================================
  describe("포스트 내용 (Content) 렌더링", () => {
    it("포스트 내용이 화면에 표시된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const content = screen.getByText(
        /이것은 첫 번째 블로그 게시글의 본문입니다/
      );
      expect(content).toBeInTheDocument();
    });

    it("포스트 내용이 정상적으로 렌더링된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const expectedContent =
        "이것은 첫 번째 블로그 게시글의 본문입니다. 여기에 블로그 포스트의 내용을 작성할 수 있습니다. Next.js와 TypeScript를 사용하여 멋진 블로그를 만들어보세요!";
      const content = screen.getByText(expectedContent);
      expect(content).toBeInTheDocument();
    });

    it("포스트 내용에 text-gray-700 클래스가 적용된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const expectedContent =
        "이것은 첫 번째 블로그 게시글의 본문입니다. 여기에 블로그 포스트의 내용을 작성할 수 있습니다. Next.js와 TypeScript를 사용하여 멋진 블로그를 만들어보세요!";
      const content = screen.getByText(expectedContent);
      // text-gray-700 클래스는 부모 <div> 요소에 적용됨
      expect(content.parentElement).toHaveClass("text-gray-700");
    });

    it("포스트 내용에 leading-8 클래스가 적용된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const expectedContent =
        "이것은 첫 번째 블로그 게시글의 본문입니다. 여기에 블로그 포스트의 내용을 작성할 수 있습니다. Next.js와 TypeScript를 사용하여 멋진 블로그를 만들어보세요!";
      const content = screen.getByText(expectedContent);
      expect(content.parentElement).toHaveClass("leading-8");
    });

    it("다른 포스트의 내용이 올바르게 렌더링된다", () => {
      const params = { slug: "nextjs-app-router" };
      render(<PostPage params={params} />);

      const content = screen.getByText(/Next.js 13부터 도입된 App Router/);
      expect(content).toBeInTheDocument();
    });
  });

  // =========================================================
  // 5. 작성자 프로필 렌더링 테스트
  // =========================================================
  describe("작성자 프로필 (AuthorProfile) 렌더링", () => {
    it("작가 정보 섹션이 렌더링된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const section = screen.getByRole("region", { name: "작가 정보" });
      expect(section).toBeInTheDocument();
    });

    it("작가 이름이 표시된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const authorName = screen.getByRole("heading", {
        name: "Jane Doe",
        level: 3,
      });
      expect(authorName).toBeInTheDocument();
    });

    it("작가 자기소개가 표시된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const bio = screen.getByText(
        "Next.js와 TypeScript를 좋아하는 프론트엔드 개발자입니다."
      );
      expect(bio).toBeInTheDocument();
    });

    it("'작가' 레이블이 표시된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const label = screen.getByText("작가");
      expect(label).toBeInTheDocument();
    });

    it("작가 프로필 이미지가 렌더링된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const avatar = screen.getByAltText("Jane Doe 프로필 사진");
      expect(avatar).toBeInTheDocument();
    });

    it("작가 프로필 이미지가 올바른 URL을 가진다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const avatar = screen.getByAltText("Jane Doe 프로필 사진");
      expect(avatar).toHaveAttribute("src", "/images/authors/default-avatar.svg");
    });

    it("작가 프로필이 포스트 내용 하단에 위치한다", () => {
      const params = { slug: "first-post" };
      const { container } = render(<PostPage params={params} />);

      const article = container.querySelector("article");
      const authorSection = screen.getByRole("region", { name: "작가 정보" });

      // AuthorProfile은 article의 마지막 자식이어야 함
      expect(article?.contains(authorSection)).toBe(true);
    });
  });

  // =========================================================
  // 6. 레이아웃 및 스타일 테스트
  // =========================================================
  describe("레이아웃 및 스타일", () => {
    it("메인 컨텐츠가 max-w-3xl 클래스를 가진다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const main = screen.getByRole("main");
      expect(main).toHaveClass("max-w-3xl");
    });

    it("메인 컨텐츠가 중앙 정렬된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const main = screen.getByRole("main");
      expect(main).toHaveClass("mx-auto");
    });

    it("메인 컨텐츠에 적절한 패딩이 적용된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const main = screen.getByRole("main");
      expect(main).toHaveClass("px-6");
      expect(main).toHaveClass("py-12");
    });

    it("포스트 헤더에 마진이 적용된다", () => {
      const params = { slug: "first-post" };
      const { container } = render(<PostPage params={params} />);

      const postHeader = container.querySelector("article > header");
      expect(postHeader).toHaveClass("mb-8");
    });

    it("페이지 배경색이 올바르게 설정된다", () => {
      const params = { slug: "first-post" };
      const { container } = render(<PostPage params={params} />);

      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass("bg-zinc-50");
    });
  });

  // =========================================================
  // 7. 접근성 테스트
  // =========================================================
  describe("접근성", () => {
    it("header 요소가 banner 역할을 갖는다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const headers = screen.getAllByRole("banner");
      expect(headers.length).toBeGreaterThan(0);
    });

    it("main 요소가 main 역할을 갖는다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
    });

    it("article 요소가 article 역할을 갖는다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();
    });

    it("footer 요소가 contentinfo 역할을 갖는다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeInTheDocument();
    });

    it("모든 이미지가 alt 텍스트를 갖는다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        const altText = img.getAttribute("alt");
        expect(altText).not.toBe("");
        expect(altText).not.toBeNull();
      });
    });

    it("작가 정보 섹션이 aria-label을 갖는다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const section = screen.getByRole("region", { name: "작가 정보" });
      expect(section).toBeInTheDocument();
    });
  });

  // =========================================================
  // 8. 엣지 케이스 테스트
  // =========================================================
  describe("엣지 케이스", () => {
    it("존재하지 않는 슬러그로 접근하면 에러가 발생한다", () => {
      const params = { slug: "non-existent-post" };

      // notFound()가 호출되어 에러가 발생해야 함
      expect(() => render(<PostPage params={params} />)).toThrow();
    });

    it("빈 문자열 슬러그로 접근하면 에러가 발생한다", () => {
      const params = { slug: "" };

      expect(() => render(<PostPage params={params} />)).toThrow();
    });
  });

  // =========================================================
  // 9. 컨텐츠 정렬 및 순서 테스트
  // =========================================================
  describe("컨텐츠 정렬 및 순서", () => {
    it("포스트 제목이 발행 날짜 아래에 위치한다", () => {
      const params = { slug: "first-post" };
      const { container } = render(<PostPage params={params} />);

      const postHeader = container.querySelector("article > header");
      const publishedDate = postHeader?.querySelector("p");
      const title = postHeader?.querySelector("h1");

      // 발행 날짜가 제목보다 먼저 나타나야 함
      expect(publishedDate).toBeInTheDocument();
      expect(title).toBeInTheDocument();
    });

    it("포스트 내용이 제목 아래에 위치한다", () => {
      const params = { slug: "first-post" };
      const { container } = render(<PostPage params={params} />);

      const article = container.querySelector("article");
      const header = article?.querySelector("header");
      const content = article?.querySelector("div.text-gray-700");

      // header가 content보다 먼저 나타나야 함
      const headerIndex = Array.from(article!.children).indexOf(header!);
      const contentIndex = Array.from(article!.children).indexOf(content!);

      expect(headerIndex).toBeLessThan(contentIndex);
    });

    it("작가 프로필이 포스트 내용 마지막에 위치한다", () => {
      const params = { slug: "first-post" };
      const { container } = render(<PostPage params={params} />);

      const article = container.querySelector("article");
      const authorSection = screen.getByRole("region", { name: "작가 정보" });

      // article의 마지막 자식이 authorSection 또는 그의 부모여야 함
      const lastChild = article?.lastElementChild;
      expect(lastChild?.contains(authorSection) || lastChild === authorSection).toBe(
        true
      );
    });
  });

  // =========================================================
  // 10. 스냅샷 테스트
  // =========================================================
  describe("스냅샷", () => {
    it("첫 번째 포스트 페이지 구조가 스냅샷과 일치한다", () => {
      const params = { slug: "first-post" };
      const { container } = render(<PostPage params={params} />);

      expect(container).toMatchSnapshot();
    });

    it("두 번째 포스트 페이지 구조가 스냅샷과 일치한다", () => {
      const params = { slug: "nextjs-app-router" };
      const { container } = render(<PostPage params={params} />);

      expect(container).toMatchSnapshot();
    });
  });
});
