import { NextRequest, NextResponse } from 'next/server';
import { SubscribeRequest, SubscribeResponse } from '@/types/subscriber';
import { findSubscriberByEmail, addSubscriber } from '@/lib/subscribers';
import { sendSubscriptionConfirmEmail } from '@/lib/email';

/**
 * 이메일 유효성 검사
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 구독 엔드포인트
 * POST /api/subscribe
 */
export const POST = async (
  request: NextRequest
): Promise<NextResponse<SubscribeResponse>> => {
  try {
    const body: SubscribeRequest = await request.json();
    const { email } = body;

    // 필수값 확인
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: '이메일 주소가 필요합니다.',
        },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    if (!isValidEmail(email.trim())) {
      return NextResponse.json(
        {
          success: false,
          error: '올바른 이메일 주소를 입력해주세요.',
        },
        { status: 400 }
      );
    }

    // 중복 구독 확인
    const existingSubscriber = await findSubscriberByEmail(email.trim());
    if (existingSubscriber) {
      return NextResponse.json(
        {
          success: false,
          error: '이미 구독 중인 이메일 주소입니다.',
        },
        { status: 409 }
      );
    }

    // 구독자 추가
    const subscriber = await addSubscriber(email.trim());

    // 확인 이메일 발송
    const emailResult = await sendSubscriptionConfirmEmail(email.trim());
    if (!emailResult.success) {
      console.error('이메일 발송 실패:', emailResult.error);
      // 이메일 발송 실패해도 구독자는 추가되었으므로 성공 응답
    }

    return NextResponse.json(
      {
        success: true,
        message: '구독이 완료되었습니다! 확인 이메일을 확인해주세요.',
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    console.error('구독 처리 중 오류:', errorMessage);

    return NextResponse.json(
      {
        success: false,
        error: '서버 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
};
