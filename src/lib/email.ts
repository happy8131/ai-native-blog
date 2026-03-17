import { Resend } from 'resend';

/**
 * Resend 인스턴스 초기화
 */
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * 구독 확인 이메일 발송
 */
export const sendSubscriptionConfirmEmail = async (
  toEmail: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || '딩코딩코';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #eee;
        border-radius: 8px;
      }
      .header {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
        color: #1f2937;
      }
      .content {
        margin-bottom: 20px;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #999;
        border-top: 1px solid #eee;
        padding-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">${siteName}에 구독해주셨습니다!</div>
      <div class="content">
        <p>안녕하세요!</p>
        <p>이메일 구독을 완료해주셨습니다. 이제부터 ${siteName}의 새로운 콘텐츠를 가장 먼저 만나볼 수 있습니다.</p>
        <p>앞으로 유용한 정보를 찾아뵙겠습니다!</p>
      </div>
      <div class="footer">
        <p>이 이메일을 받고 싶지 않으시다면, 이메일에 포함된 구독 취소 링크를 클릭하세요.</p>
      </div>
    </div>
  </body>
</html>
    `;

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `${siteName} 구독 확인 - 반갑습니다!`,
      html: htmlContent,
    });

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '알 수 없는 오류';
    return { success: false, error: errorMessage };
  }
};
