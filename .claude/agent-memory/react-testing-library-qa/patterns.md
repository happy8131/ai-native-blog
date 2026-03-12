# 테스트 패턴 상세 노트

## next/image 모킹

테스트 환경에서 `next/image`는 실제 이미지 최적화를 수행하지 않으므로
표준 `<img>` 태그로 대체하는 모킹이 필수입니다.

```tsx
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
    <img src={src} alt={alt} width={width} height={height} className={className} />
  ),
}));
```

주의: `<img>` 태그에 `// eslint-disable-next-line @next/next/no-img-element` 주석 추가 권장

## aria-label을 가진 section 조회

`aria-label`이 있는 `<section>` 요소는 `getByRole("region", { name: "..." })`으로 조회:

```tsx
const section = screen.getByRole("region", { name: "작가 정보" });
```

## width/height 속성 검증

숫자 속성도 문자열로 비교해야 함:

```tsx
expect(img).toHaveAttribute("width", "64");  // 숫자 64가 아닌 문자열 "64"
```

## Props 변경 테스트 패턴 (rerender)

```tsx
const { rerender } = render(<Component prop={initialValue} />);
// 초기 상태 확인
rerender(<Component prop={updatedValue} />);
// 업데이트 상태 확인 + 이전 값 사라짐 확인
expect(screen.queryByText(oldText)).not.toBeInTheDocument();
```

## 엣지 케이스 체크리스트

- [ ] 빈 문자열 (bio: "")
- [ ] 매우 긴 텍스트 (반복 문자열로 생성)
- [ ] 특수 문자 포함 이름 (따옴표, 앤퍼샌드, 꺾쇠)
- [ ] 단일 문자
- [ ] 숫자 포함
- [ ] 외부 URL (https://...)

## 스냅샷 테스트

- `container.firstChild`를 스냅샷 대상으로 사용
- 최소 2개: 기본 데이터, 다른 데이터
- 스냅샷 파일은 `__tests__/__snapshots__/` 에 자동 생성
