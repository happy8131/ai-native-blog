export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center gap-8">
          {/* CTA 버튼 */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md">
            문의하기
          </button>

          {/* 저작권 표시 */}
          <div className="text-center text-gray-400 border-t border-gray-700 pt-8 w-full">
            <p className="text-sm">
              &copy; 2026 My Awesome Site. 모든 권리 보유.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
