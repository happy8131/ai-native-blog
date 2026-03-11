import { Author, Post } from "@/types";

const authors: Author[] = [
  {
    id: "jane-doe",
    name: "Jane Doe",
    bio: "Next.js와 TypeScript를 좋아하는 프론트엔드 개발자입니다.",
    avatarUrl: "/images/authors/default-avatar.svg",
  },
];

const posts: Post[] = [
  {
    slug: "first-post",
    title: "첫 번째 블로그 게시글",
    content:
      "이것은 첫 번째 블로그 게시글의 본문입니다. 여기에 블로그 포스트의 내용을 작성할 수 있습니다. Next.js와 TypeScript를 사용하여 멋진 블로그를 만들어보세요!",
    publishedAt: "2026-03-11",
    author: authors[0],
  },
  {
    slug: "nextjs-app-router",
    title: "Next.js App Router 시작하기",
    content:
      "Next.js 13부터 도입된 App Router는 파일 기반 라우팅 시스템으로, 더욱 직관적이고 강력한 기능을 제공합니다. 이 글에서는 App Router의 기본 개념과 사용법을 알아봅니다.",
    publishedAt: "2026-03-10",
    author: authors[0],
  },
];

export const getPostBySlug = (slug: string) => posts.find((p) => p.slug === slug);
export const getAllPosts = () => posts;
export const getAllSlugs = () => posts.map((p) => p.slug);
