export interface Author {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
}

export interface Post {
  slug: string;
  title: string;
  content: string;
  publishedAt: string;
  author: Author;
}

export type { Subscriber, SubscriberStatus } from './subscriber';
export type { SubscribeRequest, SubscribeResponse } from './subscriber';
