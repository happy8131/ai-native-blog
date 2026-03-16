import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import BlogPage from "../page";
import PostPage from "../../posts/[slug]/page";

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

// next/link 모킹
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe("테스트 시나리오 2: 블로그 포스트 읽기", () => {
  // =========================================================
  // 1. 블로그 목록 페이지 렌더링 테스트
  // =========================================================
  describe("블로그 목록 페이지 렌더링", () => {
    it("블로그 목록 페이지가 에러 없이 렌더링된다", () => {
      expect(() => render(<BlogPage />)).not.toThrow();
    });

    it("페이지 제목이 '블로그'로 표시된다", () => {
      render(<BlogPage />);
      const title = screen.getByRole("heading", {
        name: "블로그",
        level: 1,
      });
      expect(title).toBeInTheDocument();
    });

    it("설명 텍스트가 표시된다", () => {
      render(<BlogPage />);
      const description = screen.getByText(
        "다양한 기술 글과 경험담을 공유하는 블로그입니다."
      );
      expect(description).toBeInTheDocument();
    });

    it("헤더와 푸터가 렌더링된다", () => {
      render(<BlogPage />);

      const headers = screen.getAllByRole("banner");
      expect(headers.length).toBeGreaterThan(0);

      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeInTheDocument();
    });
  });

  // =========================================================
  // 2. 블로그 포스트 목록 렌더링 테스트
  // =========================================================
  describe("블로그 포스트 목록", () => {
    it("모든 포스트가 목록에 표시된다", () => {
      render(<BlogPage />);

      // 첫 번째 포스트
      expect(
        screen.getByRole("heading", {
          name: "첫 번째 블로그 게시글",
        })
      ).toBeInTheDocument();

      // 두 번째 포스트
      expect(
        screen.getByRole("heading", {
          name: "Next.js App Router 시작하기",
        })
      ).toBeInTheDocument();
    });

    it("각 포스트의 발행 날짜가 표시된다", () => {
      render(<BlogPage />);

      expect(screen.getByText("2026-03-11")).toBeInTheDocument();
      expect(screen.getByText("2026-03-10")).toBeInTheDocument();
    });

    it("각 포스트의 내용 미리보기가 표시된다", () => {
      render(<BlogPage />);

      expect(
        screen.getByText(/이것은 첫 번째 블로그 게시글의 본문입니다/)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/Next.js 13부터 도입된 App Router/)
      ).toBeInTheDocument();
    });

    it("각 포스트의 작가 정보가 표시된다", () => {
      render(<BlogPage />);

      // 작가명
      const authorNames = screen.getAllByText("Jane Doe");
      expect(authorNames.length).toBeGreaterThan(0);

      // 작가 설명
      const bios = screen.getAllByText(
        "Next.js와 TypeScript를 좋아하는 프론트엔드 개발자입니다."
      );
      expect(bios.length).toBeGreaterThan(0);
    });

    it("각 포스트의 작가 프로필 이미지가 표시된다", () => {
      render(<BlogPage />);

      const avatars = screen.getAllByAltText("Jane Doe 프로필 사진");
      expect(avatars.length).toBeGreaterThan(0);
    });

    it("각 포스트에 '더 읽기' 링크가 있다", () => {
      render(<BlogPage />);

      const readMoreLinks = screen.getAllByText("더 읽기");
      expect(readMoreLinks.length).toBeGreaterThan(0);
    });
  });

  // =========================================================
  // 3. 시나리오 1: /blog 페이지로 이동한다
  // =========================================================
  describe("시나리오 1: /blog 페이지로 이동", () => {
    it("블로그 목록 페이지가 정상적으로 렌더링된다", () => {
      const { container } = render(<BlogPage />);
      expect(container).toBeInTheDocument();
    });

    it("페이지 구조가 올바르다", () => {
      render(<BlogPage />);

      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();

      // 블로그 제목
      const heading = screen.getByRole("heading", {
        name: "블로그",
        level: 1,
      });
      expect(heading).toBeInTheDocument();

      // 포스트 목록
      const postHeadings = screen.getAllByRole("heading", { level: 2 });
      expect(postHeadings.length).toBeGreaterThan(0);
    });
  });

  // =========================================================
  // 4. 시나리오 2: 첫 번째 블로그 포스트를 클릭한다
  // =========================================================
  describe("시나리오 2: 포스트 클릭 및 상세 페이지 확인", () => {
    it("첫 번째 포스트 제목이 클릭 가능하다", () => {
      render(<BlogPage />);

      const firstPostTitle = screen.getByRole("heading", {
        name: "첫 번째 블로그 게시글",
      });
      const link = firstPostTitle.closest("a");

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/posts/first-post");
    });

    it("첫 번째 포스트의 '더 읽기' 링크가 올바른 URL을 가진다", () => {
      render(<BlogPage />);

      const readMoreLinks = screen.getAllByText("더 읽기");
      const firstLink = readMoreLinks[0];

      expect(firstLink).toHaveAttribute("href", "/posts/first-post");
    });

    it("두 번째 포스트의 '더 읽기' 링크가 올바른 URL을 가진다", () => {
      render(<BlogPage />);

      const readMoreLinks = screen.getAllByText("더 읽기");
      const secondLink = readMoreLinks[1];

      expect(secondLink).toHaveAttribute("href", "/posts/nextjs-app-router");
    });
  });

  // =========================================================
  // 5. 시나리오 3: 포스트 제목이 표시되는지 확인한다
  // =========================================================
  describe("시나리오 3: 포스트 제목 확인 (포스트 상세 페이지)", () => {
    it("포스트 상세 페이지에 포스트 제목이 표시된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const title = screen.getByRole("heading", {
        name: "첫 번째 블로그 게시글",
        level: 1,
      });
      expect(title).toBeInTheDocument();
    });

    it("포스트 상세 페이지의 제목에 font-bold 스타일이 적용된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const title = screen.getByRole("heading", {
        name: "첫 번째 블로그 게시글",
        level: 1,
      });
      expect(title).toHaveClass("font-bold");
    });

    it("포스트 상세 페이지의 제목에 text-3xl 스타일이 적용된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const title = screen.getByRole("heading", {
        name: "첫 번째 블로그 게시글",
        level: 1,
      });
      expect(title).toHaveClass("text-3xl");
    });
  });

  // =========================================================
  // 6. 시나리오 4: 작성자 프로필이 표시되는지 확인한다
  // =========================================================
  describe("시나리오 4: 작성자 프로필 확인 (포스트 상세 페이지)", () => {
    it("포스트 상세 페이지에 작가 정보 섹션이 있다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const section = screen.getByRole("region", { name: "작가 정보" });
      expect(section).toBeInTheDocument();
    });

    it("포스트 상세 페이지에 작가 이름이 표시된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const authorName = screen.getByRole("heading", {
        name: "Jane Doe",
        level: 3,
      });
      expect(authorName).toBeInTheDocument();
    });

    it("포스트 상세 페이지에 작가 자기소개가 표시된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const bio = screen.getByText(
        "Next.js와 TypeScript를 좋아하는 프론트엔드 개발자입니다."
      );
      expect(bio).toBeInTheDocument();
    });

    it("포스트 상세 페이지에 작가 프로필 이미지가 표시된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const avatar = screen.getByAltText("Jane Doe 프로필 사진");
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute("src", "/images/authors/default-avatar.svg");
    });

    it("포스트 상세 페이지에 '작가' 레이블이 표시된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const label = screen.getByText("작가");
      expect(label).toBeInTheDocument();
    });

    it("작가 프로필이 article 내에 포함된다", () => {
      const params = { slug: "first-post" };
      const { container } = render(<PostPage params={params} />);

      const article = container.querySelector("article");
      const authorSection = screen.getByRole("region", { name: "작가 정보" });

      expect(article?.contains(authorSection)).toBe(true);
    });
  });

  // =========================================================
  // 7. 시나리오 5: 포스트 내용이 정상적으로 렌더링되는지 확인한다
  // =========================================================
  describe("시나리오 5: 포스트 내용 확인 (포스트 상세 페이지)", () => {
    it("포스트 상세 페이지에 포스트 내용이 표시된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const content = screen.getByText(
        /이것은 첫 번째 블로그 게시글의 본문입니다/
      );
      expect(content).toBeInTheDocument();
    });

    it("포스트 내용이 완전한 텍스트로 렌더링된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const expectedContent =
        "이것은 첫 번째 블로그 게시글의 본문입니다. 여기에 블로그 포스트의 내용을 작성할 수 있습니다. Next.js와 TypeScript를 사용하여 멋진 블로그를 만들어보세요!";

      expect(screen.getByText(expectedContent)).toBeInTheDocument();
    });

    it("포스트 내용에 text-gray-700 스타일이 적용된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const expectedContent =
        "이것은 첫 번째 블로그 게시글의 본문입니다. 여기에 블로그 포스트의 내용을 작성할 수 있습니다. Next.js와 TypeScript를 사용하여 멋진 블로그를 만들어보세요!";
      const content = screen.getByText(expectedContent);

      expect(content.parentElement).toHaveClass("text-gray-700");
    });

    it("포스트 내용에 leading-8 스타일이 적용된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const expectedContent =
        "이것은 첫 번째 블로그 게시글의 본문입니다. 여기에 블로그 포스트의 내용을 작성할 수 있습니다. Next.js와 TypeScript를 사용하여 멋진 블로그를 만들어보세요!";
      const content = screen.getByText(expectedContent);

      expect(content.parentElement).toHaveClass("leading-8");
    });

    it("포스트 발행 날짜가 내용 위에 표시된다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const publishedDate = screen.getByText("2026-03-11");
      expect(publishedDate).toBeInTheDocument();
    });
  });

  // =========================================================
  // 8. 접근성 테스트
  // =========================================================
  describe("접근성", () => {
    it("블로그 목록 페이지의 모든 이미지가 alt 텍스트를 갖는다", () => {
      render(<BlogPage />);

      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        const altText = img.getAttribute("alt");
        expect(altText).not.toBe("");
        expect(altText).not.toBeNull();
      });
    });

    it("포스트 상세 페이지의 모든 이미지가 alt 텍스트를 갖는다", () => {
      const params = { slug: "first-post" };
      render(<PostPage params={params} />);

      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        const altText = img.getAttribute("alt");
        expect(altText).not.toBe("");
        expect(altText).not.toBeNull();
      });
    });

    it("포스트 목록의 제목들이 heading 역할을 갖는다", () => {
      render(<BlogPage />);

      const headings = screen.getAllByRole("heading", { level: 2 });
      expect(headings.length).toBeGreaterThan(0);
    });

    it("포스트 목록과 상세 페이지의 article 요소들이 존재한다", () => {
      render(<BlogPage />);

      const articles = screen.getAllByRole("article");
      expect(articles.length).toBeGreaterThan(0);
    });
  });

  // =========================================================
  // 9. 포스트 간 비교 테스트
  // =========================================================
  describe("포스트 간 일관성", () => {
    it("목록과 상세 페이지의 제목이 일치한다", () => {
      const { unmount: unmountBlog } = render(<BlogPage />);
      const listTitle = screen.getByRole("heading", {
        name: "첫 번째 블로그 게시글",
      });
      expect(listTitle).toBeInTheDocument();
      unmountBlog();

      const params = { slug: "first-post" };
      render(<PostPage params={params} />);
      const detailTitle = screen.getByRole("heading", {
        name: "첫 번째 블로그 게시글",
        level: 1,
      });
      expect(detailTitle).toBeInTheDocument();
    });

    it("목록과 상세 페이지의 작가 정보가 일치한다", () => {
      const { unmount: unmountBlog } = render(<BlogPage />);
      const listAuthor = screen.getAllByText("Jane Doe")[0];
      expect(listAuthor).toBeInTheDocument();
      unmountBlog();

      const params = { slug: "first-post" };
      render(<PostPage params={params} />);
      const detailAuthor = screen.getByRole("heading", {
        name: "Jane Doe",
        level: 3,
      });
      expect(detailAuthor).toBeInTheDocument();
    });
  });

  // =========================================================
  // 10. 스냅샷 테스트
  // =========================================================
  describe("스냅샷", () => {
    it("블로그 목록 페이지 구조가 스냅샷과 일치한다", () => {
      const { container } = render(<BlogPage />);
      expect(container).toMatchSnapshot();
    });
  });
});
