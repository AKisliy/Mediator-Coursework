import { TgStats } from '@/models/statistics/tg-stats';

export type SocialMedia = 'Telegram' | 'Instagram';

export type Blogger = {
  id: string;
  username: string;
  image_link?: string;
  category?: string;
  followers_count: number;
  social_media: SocialMedia;
  description?: string;
  profile_link: string;
};

export type InstBlogger = Blogger & {
  publications_count: number;
  following_count: number;
};

export type TelegramBlogger = Blogger & {
  avg_post_reach: number;
  channel_title: string;
  statistics: TgStats;
};

export const BLOGGER_FIELDS = {
  category: 'Категория',
  followers_count: 'Число подписчиков',
  description: 'Описание'
} as const;

export const INST_BLOGGER_FIELDS = {
  publications_count: 'Число публикаций',
  following_count: 'Число подписок'
} as const;

export const TELEGRAM_BLOGGER_FIELDS = {
  avg_post_reach: 'Средний охват поста'
} as const;

export type BloggerField = keyof typeof BLOGGER_FIELDS;
export type BloggerFieldLabel = (typeof BLOGGER_FIELDS)[BloggerField];

export type InstBloggerField = keyof typeof INST_BLOGGER_FIELDS;
export type InstBloggerFieldLabel =
  (typeof INST_BLOGGER_FIELDS)[InstBloggerField];

export type TelegramBloggerField = keyof typeof TELEGRAM_BLOGGER_FIELDS;
export type TelegramBloggerFieldLabel =
  (typeof TELEGRAM_BLOGGER_FIELDS)[TelegramBloggerField];
