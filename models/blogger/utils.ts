import { Blogger } from '@prisma/client';
import { BloggerEntity } from './blogger';
import { InstBloggerEntity } from './inst-blogger';
import { TelegramBloggerEntity } from './telegram-blogger';

export function getBloggerFromMetadata(blogerObject: any) {
  const blogger = blogerObject.metadata ?? {};
  if (!blogerObject) throw new Error('От сервера получен пустой ответ');
  if (blogger.social_media === 'Instagram')
    return new InstBloggerEntity(blogerObject);
  if (blogger.social_media === 'Telegram')
    return new TelegramBloggerEntity(blogerObject);
  return new BloggerEntity(blogerObject);
}

export function getBloggerFromDB(blogger: Blogger) {
  const bloggerWithMetadata = {
    id: blogger.id,
    metadata: { ...blogger }
  };
  if (!blogger) throw new Error('От сервера получен пустой ответ');
  if (blogger.social_media === 'Instagram')
    return new InstBloggerEntity(bloggerWithMetadata);
  if (blogger.social_media === 'Telegram')
    return new TelegramBloggerEntity(bloggerWithMetadata);
  return new BloggerEntity(bloggerWithMetadata);
}

export function toPlainObject<T extends object>(
  instance: T
): Record<string, any> {
  return JSON.parse(JSON.stringify(instance));
}
