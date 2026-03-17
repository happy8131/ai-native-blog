/**
 * 구독자 상태 타입
 */
export type SubscriberStatus = 'active' | 'unsubscribed';

/**
 * 구독자 데이터 모델
 */
export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: SubscriberStatus;
}

/**
 * API 구독 요청 바디
 */
export interface SubscribeRequest {
  email: string;
}

/**
 * API 구독 응답 바디
 */
export interface SubscribeResponse {
  success: boolean;
  message?: string;
  error?: string;
}
