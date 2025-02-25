import { Blogger, InstBlogger, TelegramBlogger } from './blogger';

export function isTelegramBlogger(
  blogger: Blogger
): blogger is TelegramBlogger {
  return blogger.social_media === 'Telegram';
}

export function isInstBlogger(blogger: Blogger): blogger is InstBlogger {
  return blogger.social_media === 'Instagram';
}
