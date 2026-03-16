# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e5]:
        - heading "My Awesome Site" [level=1] [ref=e7]
        - button "가입하기" [ref=e8]
    - main [ref=e10]:
      - img "Next.js logo" [ref=e11]
      - generic [ref=e12]:
        - heading "To get started, edit the page.tsx file." [level=1] [ref=e13]
        - paragraph [ref=e14]:
          - text: Looking for a starting point or more instructions? Head over to
          - link "Templates" [ref=e15] [cursor=pointer]:
            - /url: https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app
          - text: or the
          - link "Learning" [ref=e16] [cursor=pointer]:
            - /url: https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app
          - text: center.
      - generic [ref=e17]:
        - link "Vercel logomark Deploy Now" [ref=e18] [cursor=pointer]:
          - /url: https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app
          - img "Vercel logomark" [ref=e19]
          - text: Deploy Now
        - link "Documentation" [ref=e20] [cursor=pointer]:
          - /url: https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app
      - button "딩코딩코 구독" [ref=e22]
    - contentinfo [ref=e23]:
      - generic [ref=e25]:
        - button "문의하기" [ref=e26]
        - paragraph [ref=e28]: © 2026 My Awesome Site. 모든 권리 보유.
  - button "Open Next.js Dev Tools" [ref=e34] [cursor=pointer]:
    - img [ref=e35]
  - alert [ref=e38]
```