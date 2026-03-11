import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs } from "@/lib/posts";
import AuthorProfile from "@/components/AuthorProfile";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const generateStaticParams = () =>
  getAllSlugs().map((slug) => ({ slug }));

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const post = getPostBySlug(params.slug);
  return {
    title: post?.title ?? "게시글을 찾을 수 없습니다",
  };
};

export default function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

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
}
