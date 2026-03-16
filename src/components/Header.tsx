'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 왼쪽: 로고 및 네비게이션 */}
          <div className="flex items-center gap-8">
            {/* 로고 */}
            <Link href="/">
              <h1 className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors">
                My Awesome Site
              </h1>
            </Link>

            {/* 네비게이션 링크 */}
            <nav className="hidden sm:flex gap-6">
              <Link
                href="/blog"
                className={`font-medium transition-colors ${
                  pathname === "/blog"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                블로그
              </Link>
            </nav>
          </div>

          {/* 오른쪽: 가입하기 버튼 */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-colors">
            가입하기
          </button>
        </div>
      </div>
    </header>
  );
}
