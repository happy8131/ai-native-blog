'use client';

import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { getPostBySlug } from "@/lib/posts";
import AuthorProfile from "@/components/AuthorProfile";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Post } from "@/types";

const PostPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) {
      setError(true);
      setIsLoading(false);
      return;
    }

    // slug 파라미터로 포스트 찾기
    const foundPost = getPostBySlug(slug);
    if (!foundPost) {
      setError(true);
    } else {
      setPost(foundPost);
    }
    setIsLoading(false);
  }, [slug]);

  // 로딩 중
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50">
        <Header />
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
          <p className="text-center text-gray-600">로딩 중...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // 포스트를 찾을 수 없음
  if (error || !post) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50">
        <Header />
        <main className="mx-auto w-full max-x-3xl flex-1 px-6 py-12 bg-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600">게시글을 찾을 수 없습니다.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 bg-white">
        <article>
          <header className="mb-8">
            <p className="text-sm text-gray-400">{post.publishedAt}</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">
              {post.title}
            </h1>
          </header>
          <div className="text-gray-700 leading-8">
            <p>{post.content}</p>
          </div>
          {/* 핵심: 본문 하단 작가 프로필 */}
          <AuthorProfile author={post.author} />
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default PostPage;
