import Image from "next/image";
import { Author } from "@/types";

// 작가 아바타 이미지의 고정 크기 상수
const AVATAR_SIZE = 64;

// 외부에서 컴포넌트를 확장할 수 있도록 props 인터페이스를 공개
export interface AuthorProfileProps {
  author: Author;
}

// 작가 아바타 이미지만을 렌더링하는 단일 책임 서브 컴포넌트 (ISP 적용)
const AuthorAvatar = ({ name, avatarUrl }: Pick<Author, "name" | "avatarUrl">) => (
  <Image
    src={avatarUrl}
    alt={`${name} 프로필 사진`}
    width={AVATAR_SIZE}
    height={AVATAR_SIZE}
    className="rounded-full object-cover flex-shrink-0"
  />
);

// 작가 이름과 소개 텍스트만을 렌더링하는 단일 책임 서브 컴포넌트 (ISP 적용)
const AuthorInfo = ({ name, bio }: Pick<Author, "name" | "bio">) => (
  <div>
    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
      작가
    </p>
    <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
    <p className="text-sm text-gray-600 mt-1">{bio}</p>
  </div>
);

// 작가 프로필 섹션 전체를 조합하는 컨테이너 컴포넌트 (SRP + OCP 적용)
const AuthorProfile = ({ author }: AuthorProfileProps) => {
  const { name, bio, avatarUrl } = author;

  return (
    <section
      aria-label="작가 정보"
      className="mt-12 pt-8 border-t border-gray-200"
    >
      <div className="flex items-center gap-4">
        <AuthorAvatar name={name} avatarUrl={avatarUrl} />
        <AuthorInfo name={name} bio={bio} />
      </div>
    </section>
  );
};

export default AuthorProfile;
