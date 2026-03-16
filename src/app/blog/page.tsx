import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "블로그",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 bg-white">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">블로그</h1>
          <p className="text-gray-600">
            다양한 기술 글과 경험담을 공유하는 블로그입니다.
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post, index) => (
            <article
              key={post.slug}
              data-testid={`blog-post-${index}`}
              className="border-b border-gray-200 pb-8 last:border-b-0"
            >
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">{post.publishedAt}</p>
                <Link href={`/posts/${post.slug}`}>
                  <h2 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>
              </div>
              <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatarUrl}
                    alt={`${post.author.name} 프로필 사진`}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {post.author.name}
                    </p>
                    <p className="text-sm text-gray-500">{post.author.bio}</p>
                  </div>
                </div>
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  더 읽기
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
