import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AuthorProfile from "../AuthorProfile";
import { Author } from "@/types";

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

// 테스트에서 공통으로 사용할 기본 작가 데이터
const mockAuthor: Author = {
  id: "author-1",
  name: "김철수",
  bio: "프론트엔드 개발자이자 기술 블로거입니다.",
  avatarUrl: "/images/avatar.jpg",
};

describe("AuthorProfile", () => {
  // =========================================================
  // 1. 전체 컴포넌트 렌더링 테스트
  // =========================================================
  describe("전체 컴포넌트 렌더링", () => {
    it("author prop이 주어지면 컴포넌트가 에러 없이 렌더링된다", () => {
      // 기본 렌더링이 성공적으로 완료되는지 확인
      expect(() => render(<AuthorProfile author={mockAuthor} />)).not.toThrow();
    });

    it("작가 정보 섹션 전체가 DOM에 존재한다", () => {
      render(<AuthorProfile author={mockAuthor} />);
      // aria-label로 섹션 요소를 시맨틱하게 조회
      const section = screen.getByRole("region", { name: "작가 정보" });
      expect(section).toBeInTheDocument();
    });

    it("아바타 이미지와 작가 정보가 함께 렌더링된다", () => {
      render(<AuthorProfile author={mockAuthor} />);
      // 이미지와 텍스트 요소가 동시에 존재하는지 통합 검증
      expect(screen.getByRole("img")).toBeInTheDocument();
      expect(screen.getByText(mockAuthor.name)).toBeInTheDocument();
      expect(screen.getByText(mockAuthor.bio)).toBeInTheDocument();
    });
  });

  // =========================================================
  // 2. AuthorAvatar 서브 컴포넌트 테스트 (Image 렌더링, alt 텍스트)
  // =========================================================
  describe("AuthorAvatar 서브 컴포넌트", () => {
    it("작가 avatarUrl을 src 속성으로 갖는 이미지가 렌더링된다", () => {
      render(<AuthorProfile author={mockAuthor} />);
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", mockAuthor.avatarUrl);
    });

    it("alt 텍스트가 '{name} 프로필 사진' 형식으로 렌더링된다", () => {
      render(<AuthorProfile author={mockAuthor} />);
      // 스크린리더 사용자가 이미지 내용을 이해할 수 있는 의미 있는 alt 텍스트 확인
      const img = screen.getByAltText(`${mockAuthor.name} 프로필 사진`);
      expect(img).toBeInTheDocument();
    });

    it("이미지에 고정 크기 64x64가 적용된다", () => {
      render(<AuthorProfile author={mockAuthor} />);
      const img = screen.getByRole("img");
      // AVATAR_SIZE 상수값(64)이 width/height 속성에 올바르게 전달되는지 확인
      expect(img).toHaveAttribute("width", "64");
      expect(img).toHaveAttribute("height", "64");
    });

    it("이미지에 rounded-full, object-cover, flex-shrink-0 클래스가 적용된다", () => {
      render(<AuthorProfile author={mockAuthor} />);
      const img = screen.getByRole("img");
      // 아바타 이미지가 flex 컨테이너 내에서 축소되지 않도록 flex-shrink-0 클래스 포함 검증
      expect(img).toHaveClass("rounded-full");
      expect(img).toHaveClass("object-cover");
      expect(img).toHaveClass("flex-shrink-0");
    });

    it("다른 avatarUrl을 가진 작가의 이미지 src가 올바르게 렌더링된다", () => {
      const anotherAuthor: Author = {
        ...mockAuthor,
        avatarUrl: "https://example.com/profile.png",
      };
      render(<AuthorProfile author={anotherAuthor} />);
      expect(screen.getByRole("img")).toHaveAttribute(
        "src",
        "https://example.com/profile.png"
      );
    });
  });

  // =========================================================
  // 3. AuthorInfo 서브 컴포넌트 테스트 (이름, 레이블, bio 렌더링)
  // =========================================================
  describe("AuthorInfo 서브 컴포넌트", () => {
    it("'작가' 레이블 텍스트가 렌더링된다", () => {
      render(<AuthorProfile author={mockAuthor} />);
      // 고정 레이블 텍스트 '작가'가 항상 표시되는지 확인
      expect(screen.getByText("작가")).toBeInTheDocument();
    });

    it("작가 이름이 h3 태그로 렌더링된다", () => {
      render(<AuthorProfile author={mockAuthor} />);
      // 제목 계층 구조를 위해 이름은 heading 레벨 3으로 렌더링되어야 함
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent(mockAuthor.name);
    });

    it("작가 bio 텍스트가 렌더링된다", () => {
      render(<AuthorProfile author={mockAuthor} />);
      expect(screen.getByText(mockAuthor.bio)).toBeInTheDocument();
    });

    it("'작가' 레이블에 uppercase 클래스가 적용된다", () => {
      render(<AuthorProfile author={mockAuthor} />);
      // 디자인 시스템 준수: 레이블은 대문자 스타일이어야 함
      const label = screen.getByText("작가");
      expect(label).toHaveClass("uppercase");
    });

    it("'작가' 레이블에 text-xs 클래스가 적용된다", () => {
      render(<AuthorProfile author={mockAuthor} />);
      const label = screen.getByText("작가");
      expect(label).toHaveClass("text-xs");
    });
  });

  // =========================================================
  // 4. Props 변경 시 업데이트 테스트
  // =========================================================
  describe("Props 변경 시 업데이트", () => {
    it("다른 작가 데이터로 리렌더링하면 이름이 업데이트된다", () => {
      const { rerender } = render(<AuthorProfile author={mockAuthor} />);

      // 초기 렌더링 상태 확인
      expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
        "김철수"
      );

      const updatedAuthor: Author = {
        ...mockAuthor,
        name: "이영희",
      };

      // 새로운 props로 리렌더링 후 업데이트 확인
      rerender(<AuthorProfile author={updatedAuthor} />);
      expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
        "이영희"
      );
    });

    it("다른 작가 데이터로 리렌더링하면 bio가 업데이트된다", () => {
      const { rerender } = render(<AuthorProfile author={mockAuthor} />);

      expect(screen.getByText(mockAuthor.bio)).toBeInTheDocument();

      const updatedAuthor: Author = {
        ...mockAuthor,
        bio: "백엔드 개발자로 10년 경력을 보유하고 있습니다.",
      };

      rerender(<AuthorProfile author={updatedAuthor} />);
      expect(
        screen.getByText("백엔드 개발자로 10년 경력을 보유하고 있습니다.")
      ).toBeInTheDocument();
      // 이전 bio는 더 이상 존재하지 않아야 함
      expect(screen.queryByText(mockAuthor.bio)).not.toBeInTheDocument();
    });

    it("다른 작가 데이터로 리렌더링하면 avatarUrl과 alt 텍스트가 업데이트된다", () => {
      const { rerender } = render(<AuthorProfile author={mockAuthor} />);

      const updatedAuthor: Author = {
        ...mockAuthor,
        name: "박지성",
        avatarUrl: "/images/new-avatar.png",
      };

      rerender(<AuthorProfile author={updatedAuthor} />);

      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", "/images/new-avatar.png");
      expect(img).toHaveAttribute("alt", "박지성 프로필 사진");
    });
  });

  // =========================================================
  // 5. 접근성 테스트 (aria-label 등)
  // =========================================================
  describe("접근성", () => {
    it("section 요소에 aria-label='작가 정보'가 있다", () => {
      render(<AuthorProfile author={mockAuthor} />);
      // 보조 기술 사용자가 섹션의 목적을 파악할 수 있도록 aria-label 제공
      const section = screen.getByRole("region", { name: "작가 정보" });
      expect(section).toBeInTheDocument();
    });

    it("프로필 이미지의 alt 텍스트가 비어있지 않다", () => {
      render(<AuthorProfile author={mockAuthor} />);
      const img = screen.getByRole("img");
      // alt 텍스트가 빈 문자열이면 스크린리더가 이미지를 무시함
      const altText = img.getAttribute("alt");
      expect(altText).not.toBe("");
      expect(altText).not.toBeNull();
    });

    it("작가 이름이 heading 역할을 갖는다", () => {
      render(<AuthorProfile author={mockAuthor} />);
      // heading 역할은 페이지 구조 파악과 네비게이션에 중요
      expect(
        screen.getByRole("heading", { name: mockAuthor.name })
      ).toBeInTheDocument();
    });

    it("이미지 alt 텍스트가 작가 이름을 포함한다", () => {
      render(<AuthorProfile author={mockAuthor} />);
      const img = screen.getByRole("img");
      expect(img.getAttribute("alt")).toContain(mockAuthor.name);
    });
  });

  // =========================================================
  // 6. 엣지 케이스 테스트 (긴 텍스트, 빈 문자열 등)
  // =========================================================
  describe("엣지 케이스", () => {
    it("이름이 매우 긴 경우에도 렌더링이 성공한다", () => {
      const longNameAuthor: Author = {
        ...mockAuthor,
        name: "김".repeat(50),
      };
      render(<AuthorProfile author={longNameAuthor} />);
      expect(
        screen.getByRole("heading", { level: 3 })
      ).toBeInTheDocument();
    });

    it("bio가 매우 긴 경우에도 렌더링이 성공한다", () => {
      const longBioAuthor: Author = {
        ...mockAuthor,
        // 400자 이상의 긴 bio 텍스트
        bio: "이 작가는 ".repeat(80) + "다양한 주제로 글을 씁니다.",
      };
      render(<AuthorProfile author={longBioAuthor} />);
      expect(screen.getByText(longBioAuthor.bio)).toBeInTheDocument();
    });

    it("bio가 빈 문자열인 경우에도 컴포넌트가 렌더링된다", () => {
      // 빈 bio를 갖는 작가 계정이 존재할 수 있음
      const emptyBioAuthor: Author = {
        ...mockAuthor,
        bio: "",
      };
      expect(() =>
        render(<AuthorProfile author={emptyBioAuthor} />)
      ).not.toThrow();
      // 이름과 레이블은 여전히 렌더링되어야 함
      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
      expect(screen.getByText("작가")).toBeInTheDocument();
    });

    it("이름에 특수 문자가 포함된 경우에도 렌더링된다", () => {
      const specialCharAuthor: Author = {
        ...mockAuthor,
        name: 'O\'Brien & <Test> "Author"',
      };
      render(<AuthorProfile author={specialCharAuthor} />);
      expect(
        screen.getByRole("heading", { name: specialCharAuthor.name })
      ).toBeInTheDocument();
    });

    it("avatarUrl이 외부 URL인 경우에도 이미지가 렌더링된다", () => {
      const externalUrlAuthor: Author = {
        ...mockAuthor,
        avatarUrl: "https://cdn.example.com/users/123/avatar.webp",
      };
      render(<AuthorProfile author={externalUrlAuthor} />);
      expect(screen.getByRole("img")).toHaveAttribute(
        "src",
        "https://cdn.example.com/users/123/avatar.webp"
      );
    });

    it("이름이 단일 글자인 경우 alt 텍스트가 올바르게 생성된다", () => {
      const singleCharAuthor: Author = {
        ...mockAuthor,
        name: "김",
      };
      render(<AuthorProfile author={singleCharAuthor} />);
      expect(screen.getByAltText("김 프로필 사진")).toBeInTheDocument();
    });

    it("이름에 숫자가 포함된 경우 렌더링된다", () => {
      const numericNameAuthor: Author = {
        ...mockAuthor,
        name: "작가123",
      };
      render(<AuthorProfile author={numericNameAuthor} />);
      expect(
        screen.getByRole("heading", { name: "작가123" })
      ).toBeInTheDocument();
    });
  });

  // =========================================================
  // 7. 스냅샷 테스트
  // =========================================================
  describe("스냅샷", () => {
    it("기본 author 데이터로 렌더링한 컴포넌트가 스냅샷과 일치한다", () => {
      const { container } = render(<AuthorProfile author={mockAuthor} />);
      // 컴포넌트 구조 변경 시 의도치 않은 변화를 감지하기 위한 스냅샷
      expect(container.firstChild).toMatchSnapshot();
    });

    it("다른 작가 데이터로 렌더링한 컴포넌트가 스냅샷과 일치한다", () => {
      const anotherAuthor: Author = {
        id: "author-2",
        name: "이수진",
        bio: "UX 디자이너 출신 풀스택 개발자입니다.",
        avatarUrl: "/images/suzy.jpg",
      };
      const { container } = render(<AuthorProfile author={anotherAuthor} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
