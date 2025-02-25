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
};
