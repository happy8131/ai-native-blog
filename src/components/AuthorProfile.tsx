import Image from "next/image";
import { Author } from "@/types";

interface AuthorProfileProps {
  author: Author;
}

const AuthorProfile = ({ author }: AuthorProfileProps) => {
  return (
    <section
      aria-label="작가 정보"
      className="mt-12 pt-8 border-t border-gray-200"
    >
      <div className="flex items-center gap-4">
        <Image
          src={author.avatarUrl}
          alt={`${author.name} 프로필 사진`}
          width={64}
          height={64}
          className="rounded-full object-cover"
        />
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            작가
          </p>
          <h3 className="text-lg font-semibold text-gray-900">{author.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{author.bio}</p>
        </div>
      </div>
    </section>
  );
};

export default AuthorProfile;
