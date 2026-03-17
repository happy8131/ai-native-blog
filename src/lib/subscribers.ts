import { Subscriber } from '@/types/subscriber';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

/**
 * 구독자 데이터 저장소 경로
 */
const getSubscribersFilePath = (): string => {
  const filePath = process.env.SUBSCRIBERS_FILE_PATH || './data/subscribers.json';
  return path.resolve(process.cwd(), filePath);
};

/**
 * 모든 구독자 조회
 */
export const getAllSubscribers = async (): Promise<Subscriber[]> => {
  try {
    const filePath = getSubscribersFilePath();
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

/**
 * 이메일로 구독자 조회
 */
export const findSubscriberByEmail = async (
  email: string
): Promise<Subscriber | null> => {
  const subscribers = await getAllSubscribers();
  return subscribers.find(sub => sub.email === email) || null;
};

/**
 * 구독자 추가
 */
export const addSubscriber = async (email: string): Promise<Subscriber> => {
  const subscribers = await getAllSubscribers();

  const newSubscriber: Subscriber = {
    id: crypto.randomUUID(),
    email,
    subscribedAt: new Date().toISOString(),
    status: 'active',
  };

  subscribers.push(newSubscriber);

  const filePath = getSubscribersFilePath();
  await fs.writeFile(filePath, JSON.stringify(subscribers, null, 2));

  return newSubscriber;
};
